"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Check, Copy } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { BRAND } from "@/lib/scents"
import { kes } from "@/lib/pricing"
import type { Order } from "@/lib/api/types"

// What happens after an order is a real sequence, so it's numbered.
const nextSteps = [
  { title: "We call to confirm", body: "Expect a call on the number you gave to confirm your order and a delivery time." },
  { title: "Your candles are wrapped", body: "Each one is checked and packed by hand." },
  { title: "Pay on delivery", body: "Pay the rider in cash when your candles arrive." },
]

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!orderId) {
      setIsLoading(false)
      return
    }
    import("@/lib/api/services/orders")
      .then(({ getOrder }) => getOrder(orderId))
      .then(setOrder)
      .catch((error) => console.error("Failed to fetch order:", error))
      .finally(() => setIsLoading(false))
  }, [orderId])

  const copyId = async () => {
    if (!orderId) return
    try {
      await navigator.clipboard.writeText(orderId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked: the ID is still visible to copy by hand */
    }
  }

  const trackHref = order ? `/track-order?id=${order.id}&email=${encodeURIComponent(order.email)}` : "/track-order"

  return (
    <div className="container mx-auto grid gap-14 px-4 pb-24 pt-14 md:pt-20 lg:grid-cols-[1fr_26rem] lg:gap-20">
      <div>
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-6 w-6" aria-hidden />
        </span>
        <h1 className="type-display mt-6 max-w-[14ch] text-foreground">Thank you, your order is in</h1>
        <p className="type-lede mt-5 max-w-[48ch] text-muted-foreground">
          {order
            ? `A confirmation is on its way to ${order.email}.`
            : "A confirmation email is on its way."}{" "}
          Keep your order number handy in case you need to get in touch.
        </p>

        <h2 className="mt-14 font-serif text-2xl">What happens next</h2>
        <ol className="mt-6 space-y-6">
          {nextSteps.map((step, i) => (
            <li key={step.title} className="grid grid-cols-[2.5rem_1fr] gap-3">
              <span className="font-serif text-2xl leading-none text-primary tabular" aria-hidden>
                {i + 1}
              </span>
              <div>
                <h3 className="text-base text-foreground">{step.title}</h3>
                <p className="mt-1 max-w-[52ch] text-[0.9375rem] text-muted-foreground">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href={trackHref}>Track this order</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/shop">Keep shopping</Link>
          </Button>
        </div>
      </div>

      {/* Receipt as a jar label */}
      <aside className="lg:pt-4">
        <div className="jar-label px-7 py-7">
          <p className="text-[0.9375rem] text-muted-foreground">Order number</p>
          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="font-serif text-[1.75rem] leading-none tabular">{orderId ?? "Not available"}</p>
            {orderId && (
              <button
                type="button"
                onClick={copyId}
                className="flex items-center gap-1.5 rounded-full border border-foreground/20 px-3 py-1.5 text-[0.8125rem] hover:border-foreground/50"
                aria-label="Copy order number"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="mt-6 space-y-3 border-t border-foreground/15 pt-5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : order ? (
            <>
              <ul className="mt-6 space-y-2.5 border-t border-foreground/15 pt-5 text-[0.9375rem]">
                {order.items.map((item, i) => (
                  <li key={i} className="flex justify-between gap-4">
                    <span>
                      {item.quantity} × {item.productName ?? "Candle"}
                    </span>
                    {item.price !== undefined && <span className="tabular">{kes(item.price * item.quantity)}</span>}
                  </li>
                ))}
              </ul>
              <dl className="mt-5 space-y-2 border-t border-foreground/15 pt-5 text-[0.9375rem]">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd className="tabular">{order.shipping === 0 ? "Free" : kes(order.shipping)}</dd>
                </div>
                <div className="flex items-baseline justify-between pt-2">
                  <dt>Total, paid on delivery</dt>
                  <dd className="font-serif text-2xl tabular">{kes(order.total)}</dd>
                </div>
              </dl>
              <p className="mt-5 border-t border-foreground/15 pt-5 text-[0.9375rem] text-muted-foreground">
                Delivering to {order.customerName}, {order.address}, {order.city}, {order.county}.
              </p>
            </>
          ) : null}
        </div>

        <p className="mt-5 text-[0.9375rem] text-muted-foreground">
          Questions about your order? Call{" "}
          <a href={BRAND.phoneHref} className="text-foreground underline decoration-primary/50 underline-offset-4">
            {BRAND.phone}
          </a>
          .
        </p>
      </aside>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="container mx-auto px-4 py-20">
              <Skeleton className="h-16 w-2/3" />
            </div>
          }
        >
          <OrderSuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
