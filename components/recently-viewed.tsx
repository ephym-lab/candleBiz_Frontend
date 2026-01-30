"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { useRecentlyViewed } from "@/lib/recently-viewed-context"

export function RecentlyViewed() {
    const { recentlyViewed } = useRecentlyViewed()

    if (recentlyViewed.length === 0) {
        return null
    }

    return (
        <section className="py-12">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Recently Viewed</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {recentlyViewed.slice(0, 4).map((product) => (
                    <Link key={product.id} href={`/product/${product.id}`}>
                        <Card className="group overflow-hidden transition-shadow hover:shadow-lg h-full">
                            <div className="relative aspect-square overflow-hidden bg-muted">
                                <Image
                                    src={product.image || "/placeholder.svg"}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                            <CardContent className="p-4">
                                <h3 className="font-semibold text-foreground text-balance">{product.name}</h3>
                                <p className="mt-1 text-sm text-muted-foreground">{product.scent}</p>
                                <div className="mt-2 flex items-center justify-between">
                                    <span className="font-semibold text-primary">KES {product.price.toLocaleString()}</span>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-primary text-primary" />
                                        <span className="text-sm text-muted-foreground">{product.rating}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    )
}
