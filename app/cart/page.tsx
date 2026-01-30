"use client"

import Image from "next/image"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart()

  if (cart.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navigation />

        <main className="flex flex-1 items-center justify-center">
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="mt-6 font-serif text-2xl font-bold text-foreground md:text-3xl">Your cart is empty</h1>
            <p className="mt-2 text-muted-foreground">Add some beautiful candles to get started</p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/shop">Browse Collection</Link>
            </Button>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-b from-secondary/50 to-background py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h1 className="font-serif text-4xl font-bold text-foreground md:text-5xl">Shopping Cart</h1>
            <p className="mt-4 text-muted-foreground">{cart.length} items in your cart</p>
          </div>
        </section>

        {/* Cart Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {cart.map((item) => (
                    <Card key={item.product.id}>
                      <CardContent className="p-4 md:p-6">
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted md:h-32 md:w-32">
                            <Image
                              src={item.product.image || "/placeholder.svg"}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <Link
                                    href={`/product/${item.product.id}`}
                                    className="font-semibold text-foreground hover:text-primary"
                                  >
                                    {item.product.name}
                                  </Link>
                                  <p className="mt-1 text-sm text-muted-foreground">{item.product.scent}</p>
                                  <p className="text-xs text-muted-foreground">{item.product.size}</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeFromCart(item.product.id)}
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Remove item</span>
                                </Button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="h-8 w-8 bg-transparent"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  disabled={item.quantity >= item.product.stock}
                                  className="h-8 w-8"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>

                              {/* Price */}
                              <div className="text-right">
                                <p className="font-semibold text-primary">
                                  KES {(item.product.price * item.quantity).toLocaleString()}
                                </p>
                                {item.quantity > 1 && (
                                  <p className="text-xs text-muted-foreground">
                                    KES {item.product.price.toLocaleString()} each
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Clear Cart Button */}
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="mt-4 bg-transparent text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Cart
                </Button>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardContent className="p-6">
                    <h2 className="font-serif text-xl font-bold text-foreground">Order Summary</h2>

                    <div className="mt-6 space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium text-foreground">KES {cartTotal.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium text-foreground">Calculated at checkout</span>
                      </div>

                      <div className="border-t border-border pt-4">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-foreground">Total</span>
                          <span className="font-serif text-2xl font-bold text-primary">
                            KES {cartTotal.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button asChild size="lg" className="mt-6 w-full">
                      <Link href="/checkout">
                        Proceed to Checkout
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>

                    <Button asChild variant="outline" className="mt-3 w-full bg-transparent">
                      <Link href="/shop">Continue Shopping</Link>
                    </Button>

                    {/* Trust Badges */}
                    <div className="mt-6 space-y-3 border-t border-border pt-6">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <ShoppingBag className="h-4 w-4 text-primary" />
                        </div>
                        <span>Secure checkout</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <ShoppingBag className="h-4 w-4 text-primary" />
                        </div>
                        <span>Free shipping on orders over KES 3000</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <ShoppingBag className="h-4 w-4 text-primary" />
                        </div>
                        <span>Handcrafted with care</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
