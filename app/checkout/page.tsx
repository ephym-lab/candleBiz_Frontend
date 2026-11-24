"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart, lineUnitPrice } from "@/lib/cart-context"
import { deliveryFee, kes } from "@/lib/pricing"
import { kenyaCounties } from "@/lib/kenya-counties"
import { BRAND } from "@/lib/scents"
import type { OrderFormData } from "@/lib/types"
import { cn } from "@/lib/utils"

type Errors = Partial<Record<keyof OrderFormData, string>>

/** Accepts 07…, 01…, 2547…, +2547… with spaces or dashes; returns +254XXXXXXXXX. */
function formatPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[\s\-()]/g, "")
  if (cleaned.startsWith("0")) cleaned = "+254" + cleaned.substring(1)
  else if (cleaned.startsWith("254")) cleaned = "+" + cleaned
  else if (!cleaned.startsWith("+254")) cleaned = "+254" + cleaned
  return cleaned
}

function Field({
  id,
  label,
  hint,
  error,
  children,
  className,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-2 block text-[0.9375rem] font-normal text-foreground">
        {label}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-[0.875rem] text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-[0.8125rem] text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-border pt-8">
      <legend className="float-left mb-6 w-full font-serif text-2xl">{title}</legend>
      <div className="clear-both space-y-5">{children}</div>
    </fieldset>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, cartTotal, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [form, setForm] = useState<OrderFormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    county: "",
    paymentMethod: "cash",
    mpesaPhone: "",
  })

  if (cart.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navigation />
        <main className="flex flex-1 items-center justify-center px-4 py-24">
          <div className="jar-label max-w-md px-8 py-10 text-center">
            <h1 className="type-heading text-foreground">Nothing to check out yet</h1>
            <p className="mt-3 text-muted-foreground">Add a candle to your cart first, then come back here.</p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/shop">Shop candles</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const delivery = deliveryFee(cartTotal)
  const total = cartTotal + delivery

  const set = (field: keyof OrderFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = (): boolean => {
    const e: Errors = {}
    if (!form.fullName.trim()) e.fullName = "Enter your full name."
    if (!form.email.trim()) e.email = "Enter your email so we can send your order confirmation."
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "That email doesn't look right. Check for typos."
    if (!form.phone.trim()) e.phone = "Enter a phone number for the delivery rider."
    else if (!/^\+254[0-9]{9}$/.test(formatPhoneNumber(form.phone)))
      e.phone = "Use a Kenyan number, like 0712 345 678."
    if (!form.address.trim()) e.address = "Enter a street, building or landmark."
    if (!form.city.trim()) e.city = "Enter your town or area."
    if (!form.county) e.county = "Choose your county."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    setSubmitError(null)
    if (!validate()) {
      const first = document.querySelector<HTMLElement>("[aria-invalid='true']")
      first?.focus()
      return
    }

    setIsSubmitting(true)
    try {
      const { createOrder } = await import("@/lib/api/services/orders")
      const order = await createOrder({
        customerName: form.fullName.trim(),
        email: form.email.trim(),
        phone: formatPhoneNumber(form.phone),
        address: form.address.trim(),
        city: form.city.trim(),
        county: form.county,
        items: cart.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
        paymentMethod: "cash",
      })
      clearCart()
      router.push(`/order-success?orderId=${order.id}`)
    } catch (error) {
      console.error("Order creation failed:", error)
      const message = error instanceof Error ? error.message : ""
      setSubmitError(
        message.startsWith("Insufficient stock")
          ? `${message}. Lower the quantity in your cart and try again.`
          : `Your order couldn't be placed. Check your connection and try again, or call ${BRAND.phone} to order by phone.`,
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputProps = (field: keyof OrderFormData) => ({
    id: field,
    value: (form[field] as string) ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(field, e.target.value),
    "aria-invalid": errors[field] ? ("true" as const) : undefined,
    "aria-describedby": errors[field] ? `${field}-error` : undefined,
    className: cn(errors[field] && "border-destructive"),
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="container mx-auto px-4 pb-24 pt-12 md:pt-16">
          <h1 className="type-title text-foreground">Check out</h1>
          <p className="mt-2 text-muted-foreground">
            We&apos;ll email a confirmation and call before delivery.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-10 grid gap-12 lg:grid-cols-[1fr_24rem] lg:gap-16">
            <div className="max-w-2xl space-y-10">
              <Section title="Your details">
                <Field id="fullName" label="Full name" error={errors.fullName}>
                  <Input {...inputProps("fullName")} autoComplete="name" />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="email" label="Email" error={errors.email}>
                    <Input {...inputProps("email")} type="email" autoComplete="email" placeholder="you@example.com" />
                  </Field>
                  <Field id="phone" label="Phone number" error={errors.phone} hint="For the delivery rider.">
                    <Input {...inputProps("phone")} type="tel" autoComplete="tel" placeholder="0712 345 678" />
                  </Field>
                </div>
              </Section>

              <Section title="Delivery address">
                <Field id="address" label="Street, building or landmark" error={errors.address}>
                  <Input {...inputProps("address")} autoComplete="street-address" placeholder="e.g. Riverside Apartments, Hse 4B" />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="city" label="Town or area" error={errors.city}>
                    <Input {...inputProps("city")} autoComplete="address-level2" placeholder="e.g. Kilimani" />
                  </Field>
                  <Field id="county" label="County" error={errors.county}>
                    <Select value={form.county} onValueChange={(v) => set("county", v)}>
                      <SelectTrigger
                        id="county"
                        className={cn("w-full", errors.county && "border-destructive")}
                        aria-invalid={errors.county ? "true" : undefined}
                        aria-describedby={errors.county ? "county-error" : undefined}
                      >
                        <SelectValue placeholder="Choose a county" />
                      </SelectTrigger>
                      <SelectContent className="max-h-72">
                        {kenyaCounties.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </Section>

              <Section title="Payment">
                <RadioGroup value="cash" className="gap-3" aria-label="Payment method">
                  <Label
                    htmlFor="pay-cash"
                    className="flex cursor-pointer items-start gap-3 rounded-xl border border-foreground bg-card p-5 font-normal"
                  >
                    <RadioGroupItem value="cash" id="pay-cash" className="mt-1" />
                    <span>
                      <span className="block text-base text-foreground">Cash on delivery</span>
                      <span className="mt-0.5 block text-[0.9375rem] text-muted-foreground">
                        Pay the rider when your candles arrive.
                      </span>
                    </span>
                  </Label>
                  <Label
                    htmlFor="pay-mpesa"
                    className="flex cursor-not-allowed items-start gap-3 rounded-xl border border-border p-5 font-normal opacity-60"
                  >
                    <RadioGroupItem value="mpesa" id="pay-mpesa" disabled className="mt-1" />
                    <span>
                      <span className="block text-base text-foreground">M-Pesa</span>
                      <span className="mt-0.5 block text-[0.9375rem] text-muted-foreground">
                        Coming soon. For now, choose cash on delivery.
                      </span>
                    </span>
                  </Label>
                </RadioGroup>
              </Section>
            </div>

            {/* Summary */}
            <aside className="lg:sticky lg:top-32 lg:self-start">
              <div className="jar-label px-7 py-7">
                <h2 className="font-serif text-2xl">Your order</h2>

                <ul className="mt-5 space-y-4">
                  {cart.map((item) => {
                    const unit = lineUnitPrice(item)
                    return (
                      <li key={item.product.id} className="flex gap-3">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                          <Image
                            src={item.product.image || "/placeholder.svg"}
                            alt=""
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                          <span className="absolute -right-0 -top-0 flex h-5 min-w-5 items-center justify-center rounded-bl-md bg-foreground px-1 text-[0.6875rem] text-background tabular">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[0.9375rem]">{item.product.name}</p>
                          <p className="text-[0.8125rem] text-muted-foreground tabular">
                            {item.quantity} × {kes(unit)}
                          </p>
                        </div>
                        <p className="text-[0.9375rem] tabular">{kes(unit * item.quantity)}</p>
                      </li>
                    )
                  })}
                </ul>

                <dl className="mt-6 space-y-3 border-t border-foreground/15 pt-5 text-[0.9375rem]">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd className="tabular">{kes(cartTotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Delivery</dt>
                    <dd className="tabular">{delivery === 0 ? "Free" : kes(delivery)}</dd>
                  </div>
                </dl>
                <div className="mt-5 flex items-baseline justify-between border-t border-foreground/15 pt-5">
                  <span>Total, paid on delivery</span>
                  <span className="font-serif text-[1.75rem] leading-none tabular">{kes(total)}</span>
                </div>

                {submitError && (
                  <p role="alert" className="mt-5 flex gap-2 rounded-lg bg-destructive/10 p-3 text-[0.875rem] text-destructive">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                    {submitError}
                  </p>
                )}

                <Button type="submit" size="lg" className="mt-6 w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Placing order…" : `Place order, ${kes(total)}`}
                </Button>
                <Link
                  href="/cart"
                  className="mt-4 block text-center text-[0.875rem] text-muted-foreground underline decoration-foreground/20 underline-offset-4 hover:text-foreground"
                >
                  Edit cart
                </Link>
              </div>
            </aside>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
