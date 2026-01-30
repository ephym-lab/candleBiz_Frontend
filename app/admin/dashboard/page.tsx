"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, DollarSign, TrendingUp, Users, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { mockOrders } from "@/lib/orders"
import { products } from "@/lib/products"
import { calculateGrowth } from "@/lib/analytics"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { MonthlyOrdersChart } from "@/components/admin/monthly-orders-chart"
import { TopProductsWidget } from "@/components/admin/top-products-widget"
import { LowStockAlert } from "@/components/admin/low-stock-alert"

export default function AdminDashboardPage() {
  // Calculate statistics
  const totalOrders = mockOrders.length
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0)
  const totalProducts = products.length
  const lowStockProducts = products.filter((p) => p.stock < 10).length

  const recentOrders = mockOrders.slice(0, 5)
  const growth = calculateGrowth()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your candle business</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {totalRevenue.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs mt-1">
              {growth.revenueGrowth >= 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">+{growth.revenueGrowth.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-600" />
                  <span className="text-red-600">{growth.revenueGrowth.toFixed(1)}%</span>
                </>
              )}
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <div className="flex items-center gap-1 text-xs mt-1">
              {growth.ordersGrowth >= 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">+{growth.ordersGrowth.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-600" />
                  <span className="text-red-600">{growth.ordersGrowth.toFixed(1)}%</span>
                </>
              )}
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {lowStockProducts > 0 ? (
                <span className="text-yellow-600 font-medium">{lowStockProducts} low stock items</span>
              ) : (
                "All products in stock"
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {Math.round(totalRevenue / totalOrders).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Per order</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <RevenueChart />
        <MonthlyOrdersChart />
      </div>

      {/* Widgets Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <TopProductsWidget />

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} item(s) • {order.orderDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">KES {order.total.toLocaleString()}</p>
                    <p
                      className={`text-sm capitalize ${order.status === "delivered"
                          ? "text-green-600"
                          : order.status === "processing"
                            ? "text-blue-600"
                            : order.status === "cancelled"
                              ? "text-red-600"
                              : "text-yellow-600"
                        }`}
                    >
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      <LowStockAlert />
    </div>
  )
}
