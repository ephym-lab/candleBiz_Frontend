"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { PackageSearch, Loader2, Search, MapPin, Package, CreditCard, ChevronRight, CheckCircle2 } from "lucide-react"
import { trackOrder } from "@/lib/api/services/orders"
import type { Order } from "@/lib/api/types"
import { toast } from "sonner"

function TrackOrderContent() {
  const searchParams = useSearchParams()
  const [orderId, setOrderId] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Auto-fill from URL parameters if available
  useEffect(() => {
    const urlOrderId = searchParams.get("id")
    const urlEmail = searchParams.get("email")

    if (urlOrderId) setOrderId(urlOrderId)
    if (urlEmail) setEmail(urlEmail)

    // If both are present, automatically search
    if (urlOrderId && urlEmail) {
      handleTrackOrder(urlOrderId, urlEmail)
    }
  }, [searchParams])

  const handleTrackOrder = async (searchId: string = orderId, searchEmail: string = email) => {
    if (!searchId.trim() || !searchEmail.trim()) {
      toast.error("Please enter both Order ID and Email Address")
      return
    }

    // Ensure "ORD-" prefix is present since the backend expects the full ID
    let cleanId = searchId.trim().toUpperCase()
    if (!cleanId.startsWith("ORD-")) {
      cleanId = `ORD-${cleanId}`
    }

    setIsLoading(true)
    setError(null)
    setOrder(null)

    try {
      const data = await trackOrder(cleanId, searchEmail.trim())
      setOrder(data as Order)
    } catch (err: any) {
      console.error("Failed to track order:", err)
      const errorMessage = err.response?.data?.detail || "Order not found or email does not match."
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "processing":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "shipped":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "paid":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      default:
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl min-h-[70vh]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Track Your Order</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Enter your Order ID and the email address you used during checkout to see the current status of your shipment.
        </p>
      </div>

      <Card className="max-w-xl mx-auto shadow-sm border-muted/60 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PackageSearch className="h-5 w-5 text-primary" />
            Order Details
          </CardTitle>
          <CardDescription>
            You can find your Order ID in the confirmation email we sent you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form 
            onSubmit={(e) => {
              e.preventDefault()
              handleTrackOrder()
            }} 
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="orderId">Order ID</Label>
              <Input 
                id="orderId" 
                placeholder="e.g. 5f1b2c3d" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="e.g. hello@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Track Order
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <div className="max-w-xl mx-auto p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-center flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <AlertCircleIcon className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      {order && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="flex items-center justify-between flex-wrap gap-4 bg-muted/30 p-6 rounded-xl border border-muted/60">
            <div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">Order Status</p>
              <Badge variant="outline" className={`h-8 px-4 text-sm font-semibold capitalize ${getStatusColor(order.status)}`}>
                {order.status}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">Order Date</p>
              <p className="font-semibold text-foreground">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric"
                })}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-muted/60 shadow-sm">
              <CardHeader className="pb-3 border-b border-muted/20">
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  Items in Shipment
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md">{item.quantity}x</span>
                        <span className="font-medium">{item.productName || item.productId}</span>
                      </div>
                      {item.price && (
                        <span className="font-medium text-muted-foreground">
                          KES {(item.price * item.quantity).toLocaleString()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-muted/60 shadow-sm">
              <CardHeader className="pb-3 border-b border-muted/20">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Delivery Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Shipping To</p>
                  <p className="text-sm font-medium">{order.customerName}</p>
                  <p className="text-sm text-muted-foreground">{order.address}</p>
                  <p className="text-sm text-muted-foreground">{order.city}, {order.county}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Payment Method</p>
                  <div className="flex items-center gap-2 text-sm capitalize font-medium">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    {order.paymentMethod}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

function AlertCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  )
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-16 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>}>
      <TrackOrderContent />
    </Suspense>
  )
}
