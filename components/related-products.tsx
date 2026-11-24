"use client"

import { useEffect, useState } from "react"
import { ProductCard } from "@/components/product-card"
import { getProducts } from "@/lib/api/services/products"
import type { Product } from "@/lib/api/types"
import { familyOf } from "@/lib/scents"

interface RelatedProductsProps {
    currentProductId: string
    currentScent?: string
    relatedProductIds?: string[]
}

/**
 * Candles to look at next: ones the admin linked first, then the same scent family,
 * then anything else, up to four.
 */
export function RelatedProducts({ currentProductId, currentScent, relatedProductIds = [] }: RelatedProductsProps) {
    const [related, setRelated] = useState<Product[]>([])
    const family = familyOf(currentScent)

    useEffect(() => {
        let cancelled = false
        getProducts({ limit: 100 })
            .then((res) => {
                if (cancelled) return
                const others = (res.products ?? []).filter((p) => p.id !== currentProductId)
                const linked = others.filter((p) => relatedProductIds.includes(p.id))
                const sameFamily = others.filter(
                    (p) => !linked.includes(p) && family && familyOf(p.scent)?.id === family.id,
                )
                const rest = others.filter((p) => !linked.includes(p) && !sameFamily.includes(p))
                setRelated([...linked, ...sameFamily, ...rest].slice(0, 4))
            })
            .catch((err) => console.error("Failed to fetch related products:", err))
        return () => {
            cancelled = true
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentProductId, family?.id, relatedProductIds.join(",")])

    if (related.length === 0) return null

    const allSameFamily = family && related.every((p) => familyOf(p.scent)?.id === family.id)

    return (
        <section className="py-16 md:py-20">
            <h2 className="type-title mb-10 text-foreground">
                {allSameFamily ? `More ${family!.name.toLowerCase()} candles` : "You might also like"}
            </h2>
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((product) => (
                    <ProductCard key={product.id} product={product} showActions={false} />
                ))}
            </div>
        </section>
    )
}
