"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { mockOrders, type Order } from "@/lib/orders"
import { Eye, Package2 } from "lucide-react"

export default function AdminOrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const filteredOrders =
    selectedStatus === "all" ? mockOrders : mockOrders.filter((order) => order.status === selectedStatus)

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
      default:
        return "bg-yellow-100 text-yellow-800"
    }
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
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
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
                      <span className="font-medium">Order Date:</span> {order.orderDate}
                    </p>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm font-medium mb-1">Items:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.productName} × {item.quantity} - KES {(item.price * item.quantity).toLocaleString()}
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
                      <Button onClick={() => setSelectedOrder(order)}>
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
                                    {item.productName} × {item.quantity}
                                  </span>
                                  <span className="font-medium">
                                    KES {(item.price * item.quantity).toLocaleString()}
                                  </span>
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
                            <Select defaultValue={selectedOrder.status}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button className="w-full">
                            <Package2 className="h-4 w-4 mr-2" />
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
