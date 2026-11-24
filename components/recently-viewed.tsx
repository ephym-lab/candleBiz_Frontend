"use client"

import { ProductCard } from "@/components/product-card"
import { useRecentlyViewed } from "@/lib/recently-viewed-context"

export function RecentlyViewed({ excludeId }: { excludeId?: string }) {
    const { recentlyViewed } = useRecentlyViewed()
    const items = recentlyViewed.filter((p) => p.id !== excludeId).slice(0, 4)

    if (items.length === 0) return null

    return (
        <section className="border-t border-border py-16 md:py-20">
            <h2 className="type-heading mb-8 text-foreground">Recently viewed</h2>
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((product) => (
                    <ProductCard key={product.id} product={product} showActions={false} />
                ))}
            </div>
        </section>
    )
}
