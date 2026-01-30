"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { topProducts } from "@/lib/analytics"
import { TrendingUp } from "lucide-react"

export function TopProductsWidget() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Best performers this month</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {topProducts.map((product, index) => (
                        <div key={product.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                    {index + 1}
                                </div>
                                <div>
                                    <p className="font-medium text-sm">{product.name}</p>
                                    <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-sm">KES {product.revenue.toLocaleString()}</p>
                                <div className="flex items-center gap-1 text-xs text-green-600">
                                    <TrendingUp className="h-3 w-3" />
                                    <span>+{Math.round((product.sales / 200) * 100)}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
