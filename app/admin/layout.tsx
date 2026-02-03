"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAdmin } from "@/lib/admin-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Package, ShoppingCart, BarChart3, LogOut, Star } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAdmin()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isAuthenticated && pathname !== "/admin") {
      router.push("/admin")
    }
  }, [isAuthenticated, pathname, router])

  if (!isAuthenticated && pathname !== "/admin") {
    return null
  }

  if (pathname === "/admin") {
    return <>{children}</>
  }

  const handleLogout = () => {
    logout()
    router.push("/admin")
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin/dashboard" className="text-xl font-serif font-bold">
              Luxe Candles Admin
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/admin/dashboard"
                className={`flex items-center gap-2 text-sm hover:text-primary transition-colors ${pathname === "/admin/dashboard" ? "text-primary font-medium" : "text-muted-foreground"}`}
              >
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/admin/products"
                className={`flex items-center gap-2 text-sm hover:text-primary transition-colors ${pathname === "/admin/products" ? "text-primary font-medium" : "text-muted-foreground"}`}
              >
                <Package className="h-4 w-4" />
                Products
              </Link>
              <Link
                href="/admin/orders"
                className={`flex items-center gap-2 text-sm hover:text-primary transition-colors ${pathname === "/admin/orders" ? "text-primary font-medium" : "text-muted-foreground"}`}
              >
                <ShoppingCart className="h-4 w-4" />
                Orders
              </Link>
              <Link
                href="/admin/reviews"
                className={`flex items-center gap-2 text-sm hover:text-primary transition-colors ${pathname === "/admin/reviews" ? "text-primary font-medium" : "text-muted-foreground"}`}
              >
                <Star className="h-4 w-4" />
                Reviews
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">View Store</Link>
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
