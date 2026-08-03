"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Package2, Loader2, AlertCircle, Search, X } from "lucide-react"
import { toast } from "sonner"
import type { Order, PaginationMeta } from "@/lib/api/types"
import { getOrders, updateOrderStatus, searchOrders } from "@/lib/api/services/orders"
import { useSearchParams } from "next/navigation"

export default function AdminOrdersPage() {
  const searchParams = useSearchParams()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationMeta | null>(null)
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState<Order["status"]>("pending")
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Sync state with URL if it changes (e.g. clicking a notification while on this page)
  useEffect(() => {
    const q = searchParams.get("q")
    if (q !== null) {
      setSearchQuery(q)
    }
  }, [searchParams])

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      let data
      
      // If there's a search query, search instead of standard fetch
      if (searchQuery.trim()) {
        data = await searchOrders(searchQuery.trim(), currentPage, 10)
      } else {
        // Here we could pass selectedStatus as a parameter if backend supported it natively, 
        // but since we filter locally for status, we might need a backend update for true status filtering in the future.
        data = await getOrders(undefined, currentPage, 10)
      }
      
      setOrders(data.orders || [])
      setPagination(data.pagination || null)
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
    const timeoutId = setTimeout(() => {
      fetchOrders()
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery, currentPage])

  // Reset page when search or status changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedStatus])

  // Local filtering for status until backend supports `status` query param
  const filteredOrders = orders.filter((order) => {
    return selectedStatus === "all" || order.status === selectedStatus
  })

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!selectedOrder) return

    setIsUpdating(true)

    try {
      await updateOrderStatus(selectedOrder.id, { status: newStatus })
      toast.success("Order status updated successfully!")
      fetchOrders()
      setIsSheetOpen(false)
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
        return "bg-green-100 text-green-800 border-green-200"
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "paid":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  const openOrderSheet = (order: Order) => {
    setSelectedOrder(order)
    setNewStatus(order.status)
    setIsSheetOpen(true)
  }

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={fetchOrders}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-3xl font-serif font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground mt-2">Manage customer orders and update shipping statuses.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Tabs value={selectedStatus} onValueChange={setSelectedStatus} className="w-full sm:w-auto overflow-x-auto">
          <TabsList className="bg-transparent h-auto p-0 gap-2 flex-wrap">
            {["all", "pending", "paid", "processing", "shipped", "delivered", "cancelled"].map((status) => (
              <TabsTrigger 
                key={status}
                value={status} 
                className="rounded-full px-4 py-2 border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground capitalize"
              >
                {status}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Search Bar */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by ID, email, name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 rounded-full bg-background"
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
      </div>

      <Card className="overflow-hidden border shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-semibold">Order ID</TableHead>
                <TableHead className="font-semibold">Customer</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold text-right">Total</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium truncate max-w-[120px]">{order.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{order.customerName}</span>
                        <span className="text-xs text-muted-foreground">{order.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      KES {order.total.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => openOrderSheet(order)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
      
      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{orders.length}</span> of <span className="font-medium text-foreground">{pagination.total}</span> orders
          </p>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || isLoading}
              className="h-9 px-4 rounded-full"
            >
              Previous
            </Button>
            <div className="flex items-center justify-center min-w-[2rem]">
              <span className="text-sm font-medium">{currentPage} / {pagination.totalPages}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
              disabled={currentPage === pagination.totalPages || isLoading}
              className="h-9 px-4 rounded-full"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* View Order Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto pb-24">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl font-serif">Order Details</SheetTitle>
            <SheetDescription>
              Manage order <span className="font-mono text-foreground">{selectedOrder?.id}</span>
            </SheetDescription>
          </SheetHeader>
          
          {selectedOrder && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6 bg-muted/30 p-4 rounded-xl">
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Customer</h4>
                  <div className="space-y-1">
                    <p className="font-medium">{selectedOrder.customerName}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.email}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.phone}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Shipping Address</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>{selectedOrder.address}</p>
                    <p>{selectedOrder.city}, {selectedOrder.county}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-lg border-b pb-2 mb-4">Order Summary</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.quantity}x</span>
                        <span className="text-muted-foreground">{item.productName || item.productId}</span>
                      </div>
                      {item.price && (
                        <span className="font-medium">
                          KES {(item.price * item.quantity).toLocaleString()}
                        </span>
                      )}
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Subtotal</span>
                      <span>KES {selectedOrder.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Shipping</span>
                      <span>KES {selectedOrder.shipping.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>KES {selectedOrder.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="fixed bottom-0 right-0 w-full sm:max-w-xl bg-background/80 backdrop-blur-xl border-t p-6 flex flex-col gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">Update Status</label>
                  <Select value={newStatus} onValueChange={(value) => setNewStatus(value as Order["status"])}>
                    <SelectTrigger className="bg-background">
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
                <div className="flex gap-3">
                  <Button variant="outline" className="w-1/2" onClick={() => setIsSheetOpen(false)}>
                    Close
                  </Button>
                  <Button className="w-1/2" onClick={handleStatusUpdate} disabled={isUpdating || newStatus === selectedOrder.status}>
                    {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
