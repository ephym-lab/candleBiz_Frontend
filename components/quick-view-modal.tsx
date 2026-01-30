"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart, Eye } from "lucide-react"
import type { Product } from "@/lib/types"
import { useCart } from "@/lib/cart-context"
import { WishlistButton } from "./wishlist-button"

interface QuickViewModalProps {
    product: Product
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function QuickViewModal({ product, open, onOpenChange }: QuickViewModalProps) {
    const { addToCart } = useCart()
    const [quantity, setQuantity] = useState(1)

    const handleAddToCart = () => {
        addToCart(product, quantity)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="sr-only">Quick View: {product.name}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                        <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col gap-4">
                        <div>
                            <h2 className="font-serif text-2xl font-bold text-foreground">{product.name}</h2>
                            <p className="mt-1 text-sm text-muted-foreground">{product.scent}</p>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-primary text-primary" />
                                <span className="text-sm font-medium">{product.rating}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">({product.reviews.length} reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="text-3xl font-bold text-primary">KES {product.price.toLocaleString()}</div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

                        {/* Size & Stock */}
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Size:</span>
                                <span className="font-medium">{product.size}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Stock:</span>
                                <span className={`font-medium ${product.stock < 10 ? "text-destructive" : "text-green-600"}`}>
                                    {product.stock} available
                                </span>
                            </div>
                            {product.burnTime && (
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Burn Time:</span>
                                    <span className="font-medium">{product.burnTime} hours</span>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-auto">
                            <Button onClick={handleAddToCart} className="flex-1" disabled={product.stock === 0}>
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Add to Cart
                            </Button>
                            <WishlistButton product={product} size="default" />
                        </div>

                        {/* View Full Details Link */}
                        <Link href={`/product/${product.id}`} className="text-center">
                            <Button variant="outline" className="w-full">
                                <Eye className="mr-2 h-4 w-4" />
                                View Full Details
                            </Button>
                        </Link>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

interface QuickViewButtonProps {
    product: Product
}

export function QuickViewButton({ product }: QuickViewButtonProps) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setOpen(true)
                }}
                className="w-full"
            >
                <Eye className="mr-2 h-4 w-4" />
                Quick View
            </Button>
            <QuickViewModal product={product} open={open} onOpenChange={setOpen} />
        </>
    )
}
