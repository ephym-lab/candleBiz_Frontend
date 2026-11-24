"use client"

import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"
import { WishlistButton } from "@/components/wishlist-button"
import { QuickViewButton } from "@/components/quick-view-modal"
import { cn } from "@/lib/utils"
import type { Product as UiProduct } from "@/lib/types"
import { displayScent } from "@/lib/scents"

type CardProduct = {
  id: string
  name: string
  price: number
  image: string
  scent: string
  size?: string
  stock?: number
  rating?: number
  burn_time?: number
  burnTime?: number
  description?: string
}

interface ProductCardProps {
  product: CardProduct
  showActions?: boolean
  priority?: boolean
  className?: string
}

/** Photo first, then a quiet caption: name, scent, price. No box around it. */
export function ProductCard({ product, showActions = true, priority, className }: ProductCardProps) {
  const uiProduct = { ...product, reviews: [] } as unknown as UiProduct
  const lowStock = product.stock !== undefined && product.stock > 0 && product.stock < 10
  const soldOut = product.stock === 0

  return (
    <article className={cn("group relative flex flex-col", className)}>
      <Link
        href={`/product/${product.id}`}
        className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-muted"
      >
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
          className={cn(
            "object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]",
            soldOut && "opacity-60 grayscale",
          )}
        />
        {(lowStock || soldOut) && (
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
            {soldOut ? "Sold out" : `Only ${product.stock} left`}
          </span>
        )}
      </Link>

      {showActions && (
        <div className="absolute right-3 top-3">
          <WishlistButton
            product={uiProduct}
            variant="ghost"
            className="size-9 bg-background/85 backdrop-blur hover:bg-background"
          />
        </div>
      )}

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-serif text-xl leading-snug text-foreground">
            <Link href={`/product/${product.id}`} className="hover:text-primary focus-visible:text-primary">
              {product.name}
            </Link>
          </h3>
          <p className="mt-0.5 text-[0.9375rem] text-muted-foreground">
            {displayScent(product.scent)}
            {product.size ? `, ${product.size}` : ""}
          </p>
        </div>
        <p className="shrink-0 pt-0.5 text-[0.9375rem] font-medium text-foreground tabular">
          KES {product.price.toLocaleString()}
        </p>
      </div>

      {product.rating ? (
        <p className="mt-2 flex items-center gap-1 text-[0.8125rem] text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-primary text-primary" aria-hidden />
          <span className="tabular">{Number(product.rating).toFixed(1)}</span>
          <span className="sr-only">out of 5</span>
        </p>
      ) : null}

      {showActions && (
        <div className="mt-3">
          <QuickViewButton product={uiProduct} />
        </div>
      )}
    </article>
  )
}
