"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/lib/wishlist-context"
import type { Product } from "@/lib/types"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
    product: Product
    className?: string
    variant?: "default" | "ghost" | "outline"
    size?: "default" | "sm" | "lg" | "icon"
}

export function WishlistButton({ product, className, variant = "ghost", size = "icon" }: WishlistButtonProps) {
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
    const inWishlist = isInWishlist(product.id)

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (inWishlist) {
            removeFromWishlist(product.id)
            toast.success(`${product.name} removed from wishlist`)
        } else {
            addToWishlist(product)
            toast.success(`${product.name} added to wishlist`)
        }
    }

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleClick}
            className={cn("transition-colors", className)}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
            <Heart className={cn("h-5 w-5", inWishlist && "fill-red-500 text-red-500")} />
        </Button>
    )
}
