import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import type { Product } from "@/lib/types"
import { products } from "@/lib/products"

interface RelatedProductsProps {
    currentProductId: string
    relatedProductIds?: string[]
}

export function RelatedProducts({ currentProductId, relatedProductIds }: RelatedProductsProps) {
    // Get related products based on IDs or fallback to same scent
    let relatedProducts: Product[] = []

    if (relatedProductIds && relatedProductIds.length > 0) {
        relatedProducts = products.filter((p) => relatedProductIds.includes(p.id))
    } else {
        // Fallback: get products with same scent
        const currentProduct = products.find((p) => p.id === currentProductId)
        if (currentProduct) {
            relatedProducts = products
                .filter((p) => p.id !== currentProductId && p.scent === currentProduct.scent)
                .slice(0, 4)
        }
    }

    // If still no related products, get random products
    if (relatedProducts.length === 0) {
        relatedProducts = products.filter((p) => p.id !== currentProductId).slice(0, 4)
    }

    if (relatedProducts.length === 0) {
        return null
    }

    return (
        <section className="py-12">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">You Might Also Like</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((product) => (
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
