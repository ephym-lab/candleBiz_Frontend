"use client"

import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useWishlist } from "@/lib/wishlist-context"
import { useCart } from "@/lib/cart-context"
import { Star, Heart, ShoppingCart, Trash2 } from "lucide-react"
import { Breadcrumbs } from "@/components/breadcrumbs"

export default function WishlistPage() {
    const { wishlist, removeFromWishlist } = useWishlist()
    const { addToCart } = useCart()

    if (wishlist.length === 0) {
        return (
            <div className="flex min-h-screen flex-col">
                <Navigation />
                <main className="flex-1">
                    <section className="bg-gradient-to-b from-secondary/50 to-background py-12 md:py-16">
                        <div className="container mx-auto px-4">
                            <Breadcrumbs items={[{ label: "Wishlist" }]} />
                            <h1 className="font-serif text-4xl font-bold text-foreground md:text-5xl">My Wishlist</h1>
                        </div>
                    </section>

                    <section className="py-16">
                        <div className="container mx-auto px-4 text-center">
                            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                                <Heart className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <h2 className="mt-6 font-serif text-2xl font-bold text-foreground">Your wishlist is empty</h2>
                            <p className="mt-2 text-muted-foreground">
                                Save your favorite candles here to purchase later
                            </p>
                            <Button asChild size="lg" className="mt-6">
                                <Link href="/shop">Browse Collection</Link>
                            </Button>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Navigation />

            <main className="flex-1">
                {/* Header */}
                <section className="bg-gradient-to-b from-secondary/50 to-background py-12 md:py-16">
                    <div className="container mx-auto px-4">
                        <Breadcrumbs items={[{ label: "Wishlist" }]} />
                        <h1 className="font-serif text-4xl font-bold text-foreground md:text-5xl">My Wishlist</h1>
                        <p className="mt-4 text-muted-foreground">{wishlist.length} {wishlist.length === 1 ? "item" : "items"}</p>
                    </div>
                </section>

                {/* Wishlist Grid */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {wishlist.map((product) => (
                                <Card key={product.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
                                    <Link href={`/product/${product.id}`}>
                                        <div className="relative aspect-square overflow-hidden bg-muted">
                                            <Image
                                                src={product.image || "/placeholder.svg"}
                                                alt={product.name}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                    </Link>
                                    <CardContent className="p-4 space-y-3">
                                        <Link href={`/product/${product.id}`}>
                                            <h3 className="font-semibold text-foreground text-balance hover:text-primary transition-colors">
                                                {product.name}
                                            </h3>
                                            <p className="mt-1 text-sm text-muted-foreground">{product.scent}</p>
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="font-semibold text-primary">KES {product.price.toLocaleString()}</span>
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-4 w-4 fill-primary text-primary" />
                                                    <span className="text-sm text-muted-foreground">{product.rating}</span>
                                                </div>
                                            </div>
                                        </Link>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => addToCart(product)}
                                                className="flex-1"
                                                size="sm"
                                                disabled={product.stock === 0}
                                            >
                                                <ShoppingCart className="mr-2 h-4 w-4" />
                                                Add to Cart
                                            </Button>
                                            <Button
                                                onClick={() => removeFromWishlist(product.id)}
                                                variant="outline"
                                                size="sm"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
