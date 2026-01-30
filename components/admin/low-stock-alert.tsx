"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { products } from "@/lib/products"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export function LowStockAlert() {
    const lowStockProducts = products.filter((p) => p.stock < 10)

    if (lowStockProducts.length === 0) {
        return null
    }

    return (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                    <CardTitle className="text-yellow-800 dark:text-yellow-200">Low Stock Alert</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
                    {lowStockProducts.length} product(s) need restocking
                </p>
                <div className="space-y-3">
                    {lowStockProducts.map((product) => (
                        <div
                            key={product.id}
                            className="flex items-center justify-between rounded-lg bg-white dark:bg-gray-900 p-3 border border-yellow-200 dark:border-yellow-900"
                        >
                            <div>
                                <p className="font-medium text-sm">{product.name}</p>
                                <p className="text-xs text-muted-foreground">{product.scent}</p>
                            </div>
                            <Badge variant="destructive" className="bg-yellow-600">
                                {product.stock} left
                            </Badge>
                        </div>
                    ))}
                </div>
                <Link
                    href="/admin/products"
                    className="mt-4 inline-block text-sm font-medium text-yellow-700 dark:text-yellow-300 hover:underline"
                >
                    Manage Inventory →
                </Link>
            </CardContent>
        </Card>
    )
}
