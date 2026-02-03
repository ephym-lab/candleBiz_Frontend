"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart, AlertCircle } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { getBundleProducts } from "@/lib/api/services/products"
import type { Product } from "@/lib/api/types"

export function BundleDeals() {
    const { addToCart } = useCart()
    const [bundleProducts, setBundleProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchBundleProducts() {
            try {
                setLoading(true)
                setError(null)
                const data = await getBundleProducts()
                setBundleProducts(data)
            } catch (err) {
                console.error('Failed to fetch bundle products:', err)
                setError('Failed to load bundle deals. Please try again later.')
            } finally {
                setLoading(false)
            }
        }

        fetchBundleProducts()
    }, [])

    const handleAddBundle = (product: Product) => {
        if (product.bundle_offer) {
            addToCart(product, product.bundle_offer.quantity)
        }
    }

    // Don't render if no products or still loading
    if (loading) {
        return (
            <section className="py-16 bg-gradient-to-b from-secondary/30 to-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4" variant="secondary">
                            Special Offers
                        </Badge>
                        <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
                            Bundle Deals
                        </h2>
                        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                            Save more when you buy in bundles. Perfect for gifts or stocking up your favorites!
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="overflow-hidden border-2 border-primary/20">
                                <div className="relative aspect-square bg-muted animate-pulse" />
                                <CardContent className="p-6 space-y-3">
                                    <div className="h-6 bg-muted animate-pulse rounded" />
                                    <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                                    <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    if (error) {
        return (
            <section className="py-16 bg-gradient-to-b from-secondary/30 to-background">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-md mx-auto">
                        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                        <h3 className="font-semibold text-lg mb-2">Unable to Load Bundle Deals</h3>
                        <p className="text-muted-foreground">{error}</p>
                    </div>
                </div>
            </section>
        )
    }

    if (bundleProducts.length === 0) {
        return null
    }

    return (
        <section className="py-16 bg-gradient-to-b from-secondary/30 to-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <Badge className="mb-4" variant="secondary">
                        Special Offers
                    </Badge>
                    <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
                        Bundle Deals
                    </h2>
                    <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                        Save more when you buy in bundles. Perfect for gifts or stocking up your favorites!
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
                    {bundleProducts.map((product) => (
                        <Card key={product.id} className="overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-all hover:shadow-lg">
                            <div className="relative">
                                <div className="relative aspect-square overflow-hidden bg-muted">
                                    <Image
                                        src={product.image || "/placeholder.svg"}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                {product.bundle_offer && (
                                    <div className="absolute top-4 right-4">
                                        <Badge className="bg-red-500 text-white font-bold text-sm px-3 py-1">
                                            Save {product.bundle_offer.discount}%
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            <CardContent className="p-6">
                                <Link href={`/product/${product.id}`}>
                                    <h3 className="font-semibold text-lg text-foreground hover:text-primary transition-colors">
                                        {product.name}
                                    </h3>
                                </Link>
                                <p className="text-sm text-muted-foreground mt-1">{product.scent}</p>

                                <div className="flex items-center gap-1 mt-2">
                                    <Star className="h-4 w-4 fill-primary text-primary" />
                                    <span className="text-sm font-medium">{product.rating}</span>
                                </div>

                                {product.bundle_offer && (
                                    <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                                        <p className="text-sm font-semibold text-primary mb-1">
                                            {product.bundle_offer.description}
                                        </p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-lg font-bold text-foreground">
                                                KES {(product.price * product.bundle_offer.quantity * (1 - product.bundle_offer.discount / 100)).toLocaleString()}
                                            </span>
                                            <span className="text-sm text-muted-foreground line-through">
                                                KES {(product.price * product.bundle_offer.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {product.bundle_offer.quantity} candles
                                        </p>
                                    </div>
                                )}

                                <Button
                                    onClick={() => handleAddBundle(product)}
                                    className="w-full mt-4"
                                    size="lg"
                                >
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    Add Bundle to Cart
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
