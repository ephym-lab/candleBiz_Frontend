"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, Package2, Loader2, AlertCircle, Search, X } from "lucide-react"
import { toast } from "sonner"
import type { Order } from "@/lib/api/types"
import { getOrders, updateOrderStatus } from "@/lib/api/services/orders"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState<Order["status"]>("pending")

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      // If search query looks like an email, use email filter
      const data = searchQuery.includes('@')
        ? await getOrders(searchQuery.trim())
        : await getOrders()
      setOrders(data)
      setError(null)
    } catch (err) {
      console.error("Failed to fetch orders:", err)
      setError("Failed to load orders")
      toast.error("Failed to load orders")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchOrders()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Filter orders
  const filteredOrders =
    selectedStatus === "all" ? orders : orders.filter((order) => order.status === selectedStatus)

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!selectedOrder) return

    setIsUpdating(true)

    try {
      await updateOrderStatus(selectedOrder.id, { status: newStatus })
      toast.success("Order status updated successfully!")
      fetchOrders()
      setSelectedOrder(null)
    } catch (err) {
      console.error("Failed to update order status:", err)
      toast.error("Failed to update order status")
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "paid":
        return "bg-emerald-100 text-emerald-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const openOrderDialog = (order: Order) => {
    setSelectedOrder(order)
    setNewStatus(order.status)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={fetchOrders}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders</p>
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by customer email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{order.id}</h3>
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    <Badge variant="outline">{order.paymentMethod.toUpperCase()}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      <span className="font-medium">Customer:</span> {order.customerName}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {order.email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span> {order.phone}
                    </p>
                    <p>
                      <span className="font-medium">Address:</span> {order.address}, {order.city}, {order.county}
                    </p>
                    <p>
                      <span className="font-medium">Order Date:</span>{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm font-medium mb-1">Items:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.productName || item.productId} × {item.quantity}
                          {item.price && ` - KES ${(item.price * item.quantity).toLocaleString()}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="text-right space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold">KES {order.total.toLocaleString()}</p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={() => openOrderDialog(order)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
                        <DialogDescription>Manage and update order status</DialogDescription>
                      </DialogHeader>
                      {selectedOrder && (
                        <div className="space-y-6">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <h4 className="font-medium mb-2">Customer Information</h4>
                              <div className="text-sm space-y-1 text-muted-foreground">
                                <p>{selectedOrder.customerName}</p>
                                <p>{selectedOrder.email}</p>
                                <p>{selectedOrder.phone}</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Shipping Address</h4>
                              <div className="text-sm text-muted-foreground">
                                <p>{selectedOrder.address}</p>
                                <p>
                                  {selectedOrder.city}, {selectedOrder.county}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Order Items</h4>
                            <div className="space-y-2">
                              {selectedOrder.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm border-b pb-2">
                                  <span>
                                    {item.productName || item.productId} × {item.quantity}
                                  </span>
                                  {item.price && (
                                    <span className="font-medium">
                                      KES {(item.price * item.quantity).toLocaleString()}
                                    </span>
                                  )}
                                </div>
                              ))}
                              <div className="flex justify-between text-sm pt-2">
                                <span>Subtotal:</span>
                                <span>KES {selectedOrder.subtotal.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Shipping:</span>
                                <span>KES {selectedOrder.shipping.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between font-bold text-lg border-t pt-2">
                                <span>Total:</span>
                                <span>KES {selectedOrder.total.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Update Order Status</h4>
                            <Select value={newStatus} onValueChange={(value) => setNewStatus(value as Order["status"])}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button className="w-full" onClick={handleStatusUpdate} disabled={isUpdating}>
                            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Package2 className="h-4 w-4 mr-2" />}
                            Update Order
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Package2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No orders found with this status</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
