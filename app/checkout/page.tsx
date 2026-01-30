"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCart } from "@/lib/cart-context"
import type { OrderFormData } from "@/lib/types"
import { ShoppingBag, CreditCard, Package } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, cartTotal, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<OrderFormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "cash",
    mpesaPhone: "",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof OrderFormData, string>>>({})

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
            <p className="mt-2 text-muted-foreground">Add items to your cart before checking out</p>
            <Button asChild size="lg" className="mt-6">
              <a href="/shop">Browse Collection</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const shippingCost = cartTotal >= 3000 ? 0 : 300
  const total = cartTotal + shippingCost

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof OrderFormData, string>> = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address"
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^[0-9+\s-()]+$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number"
    }
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (formData.paymentMethod === "mpesa" && !formData.mpesaPhone?.trim()) {
      newErrors.mpesaPhone = "M-Pesa phone number is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Clear cart and redirect to success page with message
    clearCart()

    // Store order confirmation message
    localStorage.setItem('orderConfirmation', JSON.stringify({
      message: 'Thank you for your order! You will receive a confirmation call shortly to verify your delivery details.',
      paymentMethod: formData.paymentMethod
    }))

    router.push("/order-success")
  }

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-b from-secondary/50 to-background py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h1 className="font-serif text-4xl font-bold text-foreground md:text-5xl">Checkout</h1>
            <p className="mt-4 text-muted-foreground">Complete your order</p>
          </div>
        </section>

        {/* Checkout Form */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-8 lg:grid-cols-3">
                {/* Form Section */}
                <div className="space-y-6 lg:col-span-2">
                  {/* Contact Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          placeholder="John Doe"
                          className={errors.fullName ? "border-destructive" : ""}
                        />
                        {errors.fullName && <p className="mt-1 text-sm text-destructive">{errors.fullName}</p>}
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="john@example.com"
                            className={errors.email ? "border-destructive" : ""}
                          />
                          {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
                        </div>

                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            placeholder="+254 700 000 000"
                            className={errors.phone ? "border-destructive" : ""}
                          />
                          {errors.phone && <p className="mt-1 text-sm text-destructive">{errors.phone}</p>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Shipping Address */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        Shipping Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="address">Street Address *</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          placeholder="123 Main Street"
                          className={errors.address ? "border-destructive" : ""}
                        />
                        {errors.address && <p className="mt-1 text-sm text-destructive">{errors.address}</p>}
                      </div>

                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          placeholder="Nairobi"
                          className={errors.city ? "border-destructive" : ""}
                        />
                        {errors.city && <p className="mt-1 text-sm text-destructive">{errors.city}</p>}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Method */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        Payment Method
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <RadioGroup
                        value={formData.paymentMethod}
                        onValueChange={(value) => handleInputChange("paymentMethod", value as "mpesa" | "cash")}
                      >
                        <div className="flex items-center space-x-2 rounded-lg border border-border p-4 relative">
                          <RadioGroupItem value="mpesa" id="mpesa" />
                          <Label htmlFor="mpesa" className="flex-1 cursor-pointer font-normal">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">M-Pesa</span>
                              <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                Coming Soon
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">M-Pesa payments will be available soon</div>
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2 rounded-lg border border-border p-4">
                          <RadioGroupItem value="cash" id="cash" />
                          <Label htmlFor="cash" className="flex-1 cursor-pointer font-normal">
                            <div className="font-semibold">Cash on Delivery</div>
                            <div className="text-sm text-muted-foreground">Pay when you receive your order</div>
                          </Label>
                        </div>
                      </RadioGroup>

                      {formData.paymentMethod === "mpesa" && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                          <Label htmlFor="mpesaPhone">M-Pesa Phone Number *</Label>
                          <Input
                            id="mpesaPhone"
                            type="tel"
                            value={formData.mpesaPhone}
                            onChange={(e) => handleInputChange("mpesaPhone", e.target.value)}
                            placeholder="+254 700 000 000"
                            className={errors.mpesaPhone ? "border-destructive" : ""}
                          />
                          {errors.mpesaPhone && <p className="mt-1 text-sm text-destructive">{errors.mpesaPhone}</p>}
                          <p className="mt-2 text-sm text-muted-foreground">
                            You will receive an M-Pesa prompt to complete payment
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <Card className="sticky top-24">
                    <CardHeader>
                      <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Cart Items */}
                      <div className="space-y-3">
                        {cart.map((item) => (
                          <div key={item.product.id} className="flex gap-3">
                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                              <Image
                                src={item.product.image || "/placeholder.svg"}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{item.product.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Qty: {item.quantity} × KES {item.product.price.toLocaleString()}
                              </p>
                              <p className="text-sm font-semibold text-primary">
                                KES {(item.product.price * item.quantity).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pricing */}
                      <div className="space-y-2 border-t border-border pt-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="font-medium text-foreground">KES {cartTotal.toLocaleString()}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Shipping</span>
                          <span className="font-medium text-foreground">
                            {shippingCost === 0 ? "FREE" : `KES ${shippingCost}`}
                          </span>
                        </div>

                        {cartTotal >= 3000 && <p className="text-xs text-primary">Free shipping applied!</p>}

                        <div className="border-t border-border pt-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-foreground">Total</span>
                            <span className="font-serif text-2xl font-bold text-primary">
                              KES {total.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Processing..." : "Place Order"}
                      </Button>

                      <p className="text-center text-xs text-muted-foreground">
                        By placing your order, you agree to our terms and conditions
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
