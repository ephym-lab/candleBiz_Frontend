"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Loader2, AlertCircle, Search, X, Smartphone, Banknote, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { toast } from "sonner"
import type { Order, PaginationMeta } from "@/lib/api/types"
import { getOrders, updateOrderStatus, searchOrders } from "@/lib/api/services/orders"
import { useSearchParams } from "next/navigation"
import { LineChart, Line, ResponsiveContainer } from "recharts"

const mockChartData1 = [{ value: 40 }, { value: 30 }, { value: 45 }, { value: 25 }, { value: 55 }, { value: 35 }, { value: 60 }]
const mockChartData2 = [{ value: 60 }, { value: 40 }, { value: 50 }, { value: 30 }, { value: 45 }, { value: 20 }, { value: 35 }]
const mockChartData3 = [{ value: 10 }, { value: 15 }, { value: 12 }, { value: 20 }, { value: 18 }, { value: 25 }, { value: 22 }]

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
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())

  // Sync state with URL if it changes
  useEffect(() => {
    const q = searchParams.get("q")
    if (q !== null) {
      setSearchQuery(q)
    }
  }, [searchParams])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      let data
      if (searchQuery.trim()) {
        data = await searchOrders(searchQuery.trim(), currentPage, 10)
      } else {
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

  useEffect(() => {
    setCurrentPage(1)
    setSelectedRows(new Set())
  }, [searchQuery, selectedStatus])

  const filteredOrders = orders.filter((order) => {
    return selectedStatus === "all" || order.status === selectedStatus
  })

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

  const openOrderSheet = (order: Order) => {
    setSelectedOrder(order)
    setNewStatus(order.status)
    setIsSheetOpen(true)
  }

  const toggleRow = (id: string) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(id)) newSelected.delete(id)
    else newSelected.add(id)
    setSelectedRows(newSelected)
  }

  const toggleAll = () => {
    if (selectedRows.size === filteredOrders.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(filteredOrders.map(o => o.id)))
    }
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Orders</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage and track your orders seamlessly in real-time</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-muted/60 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-4">Total Orders</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold">{pagination?.total || 0}</h3>
                </div>
                <div className="flex items-center gap-1 text-green-500 mt-2 text-sm font-medium">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>23.5% (+10)</span>
                </div>
              </div>
              <div className="h-12 w-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockChartData1}>
                    <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-muted/60 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-4">Order items over time</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold">32</h3>
                </div>
                <div className="flex items-center gap-1 text-red-500 mt-2 text-sm font-medium">
                  <ArrowDownRight className="h-4 w-4" />
                  <span>16.1% (+5)</span>
                </div>
              </div>
              <div className="h-12 w-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockChartData2}>
                    <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-muted/60 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-4">Returns Orders</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold">7</h3>
                </div>
                <div className="flex items-center gap-1 text-yellow-500 mt-2 text-sm font-medium">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>1.6% (+3)</span>
                </div>
              </div>
              <div className="h-12 w-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockChartData3}>
                    <Line type="monotone" dataKey="value" stroke="#eab308" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col gap-6">
        <Tabs value={selectedStatus} onValueChange={setSelectedStatus} className="w-full">
          <TabsList className="bg-transparent h-auto p-0 gap-6 flex-wrap">
            {[
              { id: "all", label: "All" },
              { id: "pending", label: "Pending" },
              { id: "paid", label: "Paid" },
              { id: "processing", label: "Processing" },
              { id: "shipped", label: "Shipped" },
              { id: "delivered", label: "Delivered" },
              { id: "cancelled", label: "Cancelled" }
            ].map((tab) => (
              <TabsTrigger 
                key={tab.id}
                value={tab.id} 
                className="bg-transparent px-0 py-2 border-b-2 border-transparent rounded-none data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:text-foreground text-muted-foreground transition-all"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-transparent border-muted/60"
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
          
          <Select defaultValue="customer">
            <SelectTrigger className="w-[130px] h-9 bg-transparent border-muted/60">
              <SelectValue placeholder="Customer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="customer">Customer</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="payment">
            <SelectTrigger className="w-[130px] h-9 bg-transparent border-muted/60">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="payment">Payment</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="method">
            <SelectTrigger className="w-[160px] h-9 bg-transparent border-muted/60">
              <SelectValue placeholder="Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="method">Payment Method</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="ghost" size="sm" className="h-9 text-muted-foreground hover:text-foreground">
            + Add filter
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-xl border border-muted/60 bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-transparent">
              <TableRow className="border-b-muted/60 hover:bg-transparent">
                <TableHead className="w-12 pl-6">
                  <Checkbox 
                    checked={selectedRows.size === filteredOrders.length && filteredOrders.length > 0} 
                    onCheckedChange={toggleAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="font-medium text-muted-foreground whitespace-nowrap"># Order ID</TableHead>
                <TableHead className="font-medium text-muted-foreground whitespace-nowrap">@ Customer</TableHead>
                <TableHead className="font-medium text-muted-foreground whitespace-nowrap">Total</TableHead>
                <TableHead className="font-medium text-muted-foreground whitespace-nowrap">Items</TableHead>
                <TableHead className="font-medium text-muted-foreground whitespace-nowrap">Order Date</TableHead>
                <TableHead className="font-medium text-muted-foreground whitespace-nowrap">Order Status</TableHead>
                <TableHead className="font-medium text-muted-foreground whitespace-nowrap pr-6">Payment Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow 
                    key={order.id} 
                    className="border-b-muted/60 hover:bg-muted/30 transition-colors cursor-pointer group"
                    onClick={() => openOrderSheet(order)}
                  >
                    <TableCell className="pl-6" onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={selectedRows.has(order.id)} 
                        onCheckedChange={() => toggleRow(order.id)}
                        aria-label={`Select order ${order.id}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-foreground whitespace-nowrap">
                      {order.id.split('-').pop()}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium text-foreground">
                      {order.customerName}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      KES {order.total.toLocaleString()}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {order.items.reduce((acc, item) => acc + item.quantity, 0)} {order.items.length === 1 && order.items[0].quantity === 1 ? 'item' : 'items'}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString("en-GB", {
                        day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit"
                      }).replace(',', '')}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Badge variant="outline" className={`h-6 rounded-md font-medium text-xs px-2.5 ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap pr-6">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {order.paymentMethod === 'mpesa' ? (
                          <div className="flex items-center justify-center h-6 w-8 rounded-sm bg-green-500/10 border border-green-500/20 text-green-600">
                            <Smartphone className="h-3.5 w-3.5" />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-6 w-8 rounded-sm bg-blue-500/10 border border-blue-500/20 text-blue-600">
                            <Banknote className="h-3.5 w-3.5" />
                          </div>
                        )}
                        <span className="text-sm capitalize">{order.paymentMethod}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
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
              className="h-9 px-4 bg-transparent border-muted/60"
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
              className="h-9 px-4 bg-transparent border-muted/60"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* View Order Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto pb-24 border-l-muted/60">
          <SheetHeader className="mb-6 border-b border-muted/60 pb-6">
            <SheetTitle className="text-xl font-semibold">Order Details</SheetTitle>
            <SheetDescription>
              Manage order <span className="font-mono text-foreground">{selectedOrder?.id}</span>
            </SheetDescription>
          </SheetHeader>
          
          {selectedOrder && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6 bg-muted/10 border border-muted/60 p-5 rounded-xl">
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Customer</h4>
                  <div className="space-y-1.5 text-sm">
                    <p className="font-medium text-foreground">{selectedOrder.customerName}</p>
                    <p className="text-muted-foreground">{selectedOrder.email}</p>
                    <p className="text-muted-foreground">{selectedOrder.phone}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Shipping Address</h4>
                  <div className="space-y-1.5 text-sm text-muted-foreground">
                    <p>{selectedOrder.address}</p>
                    <p>{selectedOrder.city}, {selectedOrder.county}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-lg border-b border-muted/60 pb-3 mb-4">Order Summary</h4>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-md">{item.quantity}x</span>
                        <span className="font-medium">{item.productName || item.productId}</span>
                      </div>
                      {item.price && (
                        <span className="font-medium text-muted-foreground">
                          KES {(item.price * item.quantity).toLocaleString()}
                        </span>
                      )}
                    </div>
                  ))}
                  
                  <div className="pt-5 border-t border-muted/60 space-y-3">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Subtotal</span>
                      <span>KES {selectedOrder.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Shipping</span>
                      <span>KES {selectedOrder.shipping.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-base pt-3 border-t border-muted/60">
                      <span>Total</span>
                      <span>KES {selectedOrder.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="fixed bottom-0 right-0 w-full sm:max-w-xl bg-background border-t border-muted/60 p-6 flex flex-col gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">Update Status</label>
                  <Select value={newStatus} onValueChange={(value) => setNewStatus(value as Order["status"])}>
                    <SelectTrigger className="bg-transparent border-muted/60">
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
                  <Button variant="outline" className="w-1/2 border-muted/60 hover:bg-muted/10" onClick={() => setIsSheetOpen(false)}>
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
