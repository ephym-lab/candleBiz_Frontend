"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { products } from "@/lib/products"
import { Star, ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"

export function BundleDeals() {
    const { addToCart } = useCart()

    // Get products with bundle offers
    const bundleProducts = products.filter((p) => p.bundleOffer)

    if (bundleProducts.length === 0) {
        return null
    }

    const handleAddBundle = (product: typeof products[0]) => {
        if (product.bundleOffer) {
            addToCart(product, product.bundleOffer.quantity)
        }
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
                                {product.bundleOffer && (
                                    <div className="absolute top-4 right-4">
                                        <Badge className="bg-red-500 text-white font-bold text-sm px-3 py-1">
                                            Save {product.bundleOffer.discount}%
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
                                    <span className="text-sm text-muted-foreground">({product.reviews.length})</span>
                                </div>

                                {product.bundleOffer && (
                                    <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                                        <p className="text-sm font-semibold text-primary mb-1">
                                            {product.bundleOffer.description}
                                        </p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-lg font-bold text-foreground">
                                                KES {(product.price * product.bundleOffer.quantity * (1 - product.bundleOffer.discount / 100)).toLocaleString()}
                                            </span>
                                            <span className="text-sm text-muted-foreground line-through">
                                                KES {(product.price * product.bundleOffer.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {product.bundleOffer.quantity} candles
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
