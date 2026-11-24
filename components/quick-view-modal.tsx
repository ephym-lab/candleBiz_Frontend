"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Star } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BurnMeter } from "@/components/jar-label"
import type { Product } from "@/lib/types"
import { useCart } from "@/lib/cart-context"
import { WishlistButton } from "./wishlist-button"
import { displayScent } from "@/lib/scents"

interface QuickViewModalProps {
    product: Product
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function QuickViewModal({ product, open, onOpenChange }: QuickViewModalProps) {
    const { addToCart } = useCart()
    const [quantity, setQuantity] = useState(1)
    const burnTime = product.burnTime ?? product.burn_time
    const soldOut = product.stock === 0

    const handleAddToCart = () => {
        addToCart(product, quantity)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-3xl">
                <div className="grid md:grid-cols-2">
                    <div className="relative aspect-square bg-muted md:aspect-auto">
                        <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            sizes="(min-width: 768px) 384px, 100vw"
                            className="object-cover"
                        />
                    </div>

                    <div className="flex flex-col p-7">
                        <DialogTitle className="font-serif text-[1.875rem] font-normal leading-tight">
                            {product.name}
                        </DialogTitle>
                        <DialogDescription className="mt-1 text-[0.9375rem]">
                            {displayScent(product.scent)}
                            {product.size ? `, ${product.size}` : ""}
                        </DialogDescription>

                        <div className="mt-5 flex items-baseline justify-between border-t border-foreground/15 pt-4">
                            <p className="font-serif text-2xl tabular">KES {product.price.toLocaleString()}</p>
                            {product.rating ? (
                                <p className="flex items-center gap-1 text-[0.875rem] text-muted-foreground">
                                    <Star className="h-4 w-4 fill-primary text-primary" aria-hidden />
                                    <span className="tabular">{Number(product.rating).toFixed(1)}</span>
                                    <span className="sr-only">out of 5</span>
                                </p>
                            ) : null}
                        </div>

                        {burnTime ? <BurnMeter hours={burnTime} className="mt-4" /> : null}

                        <p className="mt-5 line-clamp-4 text-[0.9375rem] leading-relaxed text-muted-foreground">
                            {product.description}
                        </p>

                        <p className="mt-4 text-[0.875rem] text-muted-foreground">
                            {soldOut
                                ? "Sold out"
                                : product.stock < 10
                                  ? `Only ${product.stock} left`
                                  : "In stock"}
                        </p>

                        <div className="mt-auto flex items-center gap-2 pt-6">
                            <div className="flex h-10 items-center rounded-full border border-foreground/20">
                                <button
                                    type="button"
                                    className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary disabled:opacity-40"
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    disabled={quantity <= 1}
                                    aria-label="Decrease quantity"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-6 text-center tabular" aria-live="polite">
                                    {quantity}
                                </span>
                                <button
                                    type="button"
                                    className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary disabled:opacity-40"
                                    onClick={() => setQuantity((q) => Math.min(product.stock || 1, q + 1))}
                                    disabled={quantity >= (product.stock || 1)}
                                    aria-label="Increase quantity"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                            <Button onClick={handleAddToCart} className="flex-1" disabled={soldOut}>
                                {soldOut ? "Sold out" : "Add to cart"}
                            </Button>
                            <WishlistButton product={product} variant="outline" />
                        </div>

                        <Link
                            href={`/product/${product.id}`}
                            className="mt-4 text-center text-[0.9375rem] text-foreground underline decoration-primary/50 underline-offset-4 hover:decoration-primary"
                        >
                            See full details
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
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setOpen(true)
                }}
                className="text-[0.875rem] text-muted-foreground underline decoration-foreground/20 underline-offset-4 transition-colors hover:text-foreground hover:decoration-primary"
            >
                Quick look
            </button>
            <QuickViewModal product={product} open={open} onOpenChange={setOpen} />
        </>
    )
}
