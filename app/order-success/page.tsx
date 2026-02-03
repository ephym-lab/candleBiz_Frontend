"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Package, Mail, Home, Phone, Loader2 } from "lucide-react"
import type { Order } from "@/lib/api/types"

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setIsLoading(false)
        return
      }

      try {
        const { getOrder } = await import("@/lib/api/services/orders")
        const orderData = await getOrder(orderId)
        setOrder(orderData)
      } catch (error) {
        console.error("Failed to fetch order:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          {/* Success Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>

          {/* Success Message */}
          <h1 className="mt-6 font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
            Order Placed Successfully!
          </h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>

          {/* Order ID */}
          {order && (
            <Card className="mt-6 border-2 border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="text-lg font-semibold text-foreground">{order.id}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Total: <span className="font-semibold text-primary">KES {order.total.toLocaleString()}</span>
                </p>
              </CardContent>
            </Card>
          )}

          {/* Order Details Card */}
          <Card className="mt-8 text-left">
            <CardContent className="p-6">
              <h2 className="font-semibold text-foreground">What happens next?</h2>

              <div className="mt-6 space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Confirmation Call</h3>
                    <p className="text-sm text-muted-foreground">
                      Our team will call you shortly to confirm your order and delivery details.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Order Confirmation</h3>
                    <p className="text-sm text-muted-foreground">
                      You will receive an email confirmation with your order details shortly.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Processing</h3>
                    <p className="text-sm text-muted-foreground">
                      We will carefully prepare your handcrafted candles for shipping.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Home className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Delivery</h3>
                    <p className="text-sm text-muted-foreground">
                      Your order will be delivered to your address within 3-5 business days.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>

          {/* Support Message */}
          <p className="mt-8 text-sm text-muted-foreground">
            Need help? Contact us at{" "}
            <a href="mailto:hello@luxecandles.com" className="text-primary hover:underline">
              hello@luxecandles.com
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

export default function OrderSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        <Suspense
          fallback={
            <section className="py-16 md:py-24">
              <div className="container mx-auto px-4">
                <div className="mx-auto max-w-2xl text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                  <p className="mt-4 text-muted-foreground">Loading order details...</p>
                </div>
              </div>
            </section>
          }
        >
          <OrderSuccessContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}
