"use client"

import { useState, useEffect, Suspense, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { OrderProgress } from "@/components/order-progress"
import { trackOrder } from "@/lib/api/services/orders"
import { BRAND } from "@/lib/scents"
import { kes } from "@/lib/pricing"
import type { Order } from "@/lib/api/types"

function normaliseId(raw: string) {
  const id = raw.trim().toUpperCase()
  return id.startsWith("ORD-") ? id : `ORD-${id}`
}

function TrackOrderContent() {
  const searchParams = useSearchParams()
  const [orderId, setOrderId] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState<string | null>(null)

  const lookup = useCallback(async (id: string, mail: string) => {
    if (!id.trim() || !mail.trim()) {
      setError("Enter both your order number and email.")
      return
    }
    setIsLoading(true)
    setError(null)
    setOrder(null)
    try {
      const data = await trackOrder(normaliseId(id), mail.trim())
      setOrder(data as Order)
    } catch {
      setError(
        "No order matches that number and email. Check both against your confirmation email; the email must be the one you ordered with.",
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Links from the order confirmation fill both fields and look the order up straight away.
  useEffect(() => {
    const id = searchParams.get("id")
    const mail = searchParams.get("email")
    if (id) setOrderId(id)
    if (mail) setEmail(mail)
    if (id && mail) lookup(id, mail)
  }, [searchParams, lookup])

  return (
    <div className="container mx-auto px-4 pb-24 pt-14 md:pt-20">
      <div className="grid gap-12 lg:grid-cols-[22rem_1fr] lg:gap-20">
        <div>
          <h1 className="type-title text-foreground">Track an order</h1>
          <p className="mt-4 text-muted-foreground">
            Enter the order number from your confirmation email and the email you ordered with.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              lookup(orderId, email)
            }}
            className="mt-8 space-y-5"
            noValidate
          >
            <div>
              <Label htmlFor="orderId" className="mb-2 block text-[0.9375rem] font-normal">
                Order number
              </Label>
              <Input
                id="orderId"
                placeholder="ORD-5F1B2C3D"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                autoComplete="off"
                className="uppercase placeholder:normal-case"
              />
            </div>
            <div>
              <Label htmlFor="email" className="mb-2 block text-[0.9375rem] font-normal">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? "Looking it up…" : "Track order"}
            </Button>
          </form>

          <p className="mt-6 text-[0.9375rem] text-muted-foreground">
            Lost your confirmation? Call{" "}
            <a href={BRAND.phoneHref} className="text-foreground underline decoration-primary/50 underline-offset-4">
              {BRAND.phone}
            </a>
            .
          </p>
        </div>

        <div aria-live="polite">
          {error && (
            <p role="alert" className="flex gap-3 rounded-xl bg-destructive/10 p-5 text-[0.9375rem] text-destructive">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
              {error}
            </p>
          )}

          {isLoading && (
            <div className="jar-label space-y-4 px-7 py-7">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          )}

          {!order && !error && !isLoading && (
            <div className="hidden h-full min-h-[18rem] items-center justify-center rounded-2xl border border-dashed border-border p-10 text-center lg:flex">
              <p className="max-w-[30ch] text-muted-foreground">Your order&apos;s progress will appear here.</p>
            </div>
          )}

          {order && (
            <article className="jar-label px-7 py-8 sm:px-9">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="font-serif text-[1.75rem] leading-none tabular">{order.id}</h2>
                <p className="text-[0.9375rem] text-muted-foreground">
                  Placed{" "}
                  {new Date(order.createdAt || order.orderDate).toLocaleDateString("en-KE", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="mt-8">
                <OrderProgress status={order.status} />
              </div>

              <div className="mt-8 grid gap-8 border-t border-foreground/15 pt-6 sm:grid-cols-2">
                <div>
                  <h3 className="text-[0.9375rem] text-muted-foreground">In this order</h3>
                  <ul className="mt-3 space-y-2 text-[0.9375rem]">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between gap-4">
                        <span>
                          {item.quantity} × {item.productName || "Candle"}
                        </span>
                        {item.price !== undefined && <span className="tabular">{kes(item.price * item.quantity)}</span>}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 flex justify-between border-t border-foreground/10 pt-3 text-[0.9375rem]">
                    <span>Total{order.paymentMethod === "cash" ? ", paid on delivery" : ""}</span>
                    <span className="font-serif text-xl tabular">{kes(order.total)}</span>
                  </p>
                </div>
                <div>
                  <h3 className="text-[0.9375rem] text-muted-foreground">Delivering to</h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed">
                    {order.customerName}
                    <br />
                    {order.address}
                    <br />
                    {order.city}, {order.county}
                  </p>
                </div>
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TrackOrderPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="container mx-auto px-4 py-20">
              <Skeleton className="h-12 w-1/3" />
            </div>
          }
        >
          <TrackOrderContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
