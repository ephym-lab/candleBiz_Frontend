"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Package, Mail, Home, Phone } from "lucide-react"

export default function OrderSuccessPage() {
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null)

  useEffect(() => {
    // Read confirmation message from localStorage
    const stored = localStorage.getItem('orderConfirmation')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        setConfirmationMessage(data.message)
        // Clear the message after reading
        localStorage.removeItem('orderConfirmation')
      } catch (error) {
        console.error('Failed to parse order confirmation:', error)
      }
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
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

              {/* Confirmation Call Message */}
              {confirmationMessage && (
                <Card className="mt-6 border-2 border-primary/20 bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-foreground font-medium text-left">
                        {confirmationMessage}
                      </p>
                    </div>
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
      </main>

      <Footer />
    </div>
  )
}
