"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useCart, lineUnitPrice } from "@/lib/cart-context"
import { DELIVERY_FEE, FREE_DELIVERY_FROM, deliveryFee, kes } from "@/lib/pricing"
import { displayScent } from "@/lib/scents"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart()

  if (cart.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navigation />
        <main className="flex flex-1 items-center justify-center px-4 py-24">
          <div className="jar-label max-w-md px-8 py-10 text-center">
            <h1 className="type-heading text-foreground">Your cart is empty</h1>
            <p className="mt-3 text-muted-foreground">
              Find a scent you like and add it here. Your cart is saved on this device until you check out.
            </p>
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
  const toFree = FREE_DELIVERY_FROM - cartTotal
  const fullPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const savings = fullPrice - cartTotal

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="container mx-auto px-4 pb-24 pt-12 md:pt-16">
          <h1 className="type-title text-foreground">Your cart</h1>
          <p className="mt-2 text-muted-foreground">
            {cartCount} {cartCount === 1 ? "candle" : "candles"}
          </p>

          <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_24rem] lg:gap-16">
            {/* Lines */}
            <ul className="divide-y divide-border self-start border-y border-border">
              {cart.map((item) => {
                const p = item.product
                const offer = p.bundle_offer || p.bundleOffer
                const unit = lineUnitPrice(item)
                const discounted = unit < p.price
                return (
                  <li key={p.id} className="grid grid-cols-[5.5rem_1fr] gap-x-5 gap-y-3 py-6 sm:grid-cols-[7rem_1fr_auto]">
                    <Link
                      href={`/product/${p.id}`}
                      className="relative row-span-2 aspect-square overflow-hidden rounded-lg bg-muted sm:row-span-1"
                    >
                      <Image src={p.image || "/placeholder.svg"} alt={p.name} fill sizes="112px" className="object-cover" />
                    </Link>

                    <div className="min-w-0">
                      <h2 className="font-serif text-xl leading-snug">
                        <Link href={`/product/${p.id}`} className="hover:text-primary">
                          {p.name}
                        </Link>
                      </h2>
                      <p className="mt-0.5 text-[0.9375rem] text-muted-foreground">
                        {displayScent(p.scent)}
                        {p.size ? `, ${p.size}` : ""}
                      </p>
                      {offer && (
                        <p className="mt-1.5 text-[0.875rem] text-primary">
                          {discounted
                            ? `${offer.discount}% bundle discount applied`
                            : `Add ${offer.quantity - item.quantity} more for ${offer.discount}% off`}
                        </p>
                      )}

                      <div className="mt-4 flex items-center gap-5">
                        <div className="flex h-10 items-center rounded-full border border-foreground/20">
                          <button
                            type="button"
                            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary disabled:opacity-40"
                            onClick={() => updateQuantity(p.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-label={`Decrease quantity of ${p.name}`}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-7 text-center tabular" aria-label={`Quantity ${item.quantity}`}>
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary disabled:opacity-40"
                            onClick={() => updateQuantity(p.id, item.quantity + 1)}
                            disabled={item.quantity >= p.stock}
                            aria-label={`Increase quantity of ${p.name}`}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(p.id)}
                          className="text-[0.875rem] text-muted-foreground underline decoration-foreground/20 underline-offset-4 hover:text-destructive hover:decoration-destructive"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="col-start-2 text-left sm:col-start-3 sm:text-right">
                      <p className="font-medium tabular">{kes(unit * item.quantity)}</p>
                      {item.quantity > 1 && (
                        <p className="text-[0.8125rem] text-muted-foreground tabular">
                          {kes(unit)} each
                          {discounted && (
                            <>
                              {" "}
                              <s>{kes(p.price)}</s>
                            </>
                          )}
                        </p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>

            {/* Summary */}
            <aside className="lg:sticky lg:top-32 lg:self-start">
              <div className="jar-label px-7 py-7">
                <h2 className="font-serif text-2xl">Summary</h2>

                <dl className="mt-6 space-y-3 text-[0.9375rem]">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd className="tabular">{kes(cartTotal)}</dd>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-primary">
                      <dt>Bundle savings</dt>
                      <dd className="tabular">−{kes(savings)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Delivery</dt>
                    <dd className="tabular">{delivery === 0 ? "Free" : kes(delivery)}</dd>
                  </div>
                </dl>

                {/* Free delivery progress: a real threshold, so it's shown as a measure */}
                <div className="mt-5">
                  <div className="h-[3px] w-full rounded-full bg-foreground/10" aria-hidden>
                    <div
                      className="h-full rounded-full bg-primary transition-[width] duration-500"
                      style={{ width: `${Math.min(100, (cartTotal / FREE_DELIVERY_FROM) * 100)}%` }}
                    />
                  </div>
                  <p className="mt-2 text-[0.8125rem] text-muted-foreground">
                    {toFree > 0
                      ? `Add ${kes(toFree)} more for free delivery (otherwise ${kes(DELIVERY_FEE)}).`
                      : "Your order gets free delivery."}
                  </p>
                </div>

                <div className="mt-6 flex items-baseline justify-between border-t border-foreground/15 pt-5">
                  <span className="text-[0.9375rem]">Total</span>
                  <span className="font-serif text-[1.75rem] leading-none tabular">{kes(cartTotal + delivery)}</span>
                </div>

                <Button asChild size="lg" className="mt-6 w-full">
                  <Link href="/checkout">Check out</Link>
                </Button>
                <p className="mt-3 text-center text-[0.8125rem] text-muted-foreground">
                  Pay cash when your candles arrive.
                </p>
              </div>

              <Link
                href="/shop"
                className="mt-5 inline-block text-[0.9375rem] underline decoration-primary/50 underline-offset-4 hover:decoration-primary"
              >
                Keep shopping
              </Link>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
