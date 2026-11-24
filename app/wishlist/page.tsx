"use client"

import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { useWishlist } from "@/lib/wishlist-context"
import { useCart } from "@/lib/cart-context"

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="container mx-auto px-4 pb-24 pt-12 md:pt-16">
          <h1 className="type-title text-foreground">Saved candles</h1>

          {wishlist.length === 0 ? (
            <div className="jar-label mx-auto mt-12 max-w-md px-8 py-10 text-center">
              <h2 className="type-heading text-foreground">Nothing saved yet</h2>
              <p className="mt-3 text-muted-foreground">
                Tap the heart on any candle to keep it here for later. Saved candles stay on this device.
              </p>
              <Button asChild size="lg" className="mt-6">
                <Link href="/shop">Shop candles</Link>
              </Button>
            </div>
          ) : (
            <>
              <p className="mt-2 text-muted-foreground">
                {wishlist.length} {wishlist.length === 1 ? "candle" : "candles"}, saved on this device.
              </p>
              <ul className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {wishlist.map((product) => (
                  <li key={product.id} className="flex flex-col">
                    <ProductCard product={product} showActions={false} />
                    <div className="mt-4 flex items-center gap-4">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                      >
                        {product.stock === 0 ? "Sold out" : "Add to cart"}
                      </Button>
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(product.id)}
                        className="text-[0.875rem] text-muted-foreground underline decoration-foreground/20 underline-offset-4 hover:text-foreground"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
