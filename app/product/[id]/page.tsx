"use client"

import { useState, use, useEffect } from "react"
import Link from "next/link"
import { Star, Minus, Plus, Check, Phone } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ImageGallery } from "@/components/image-gallery"
import { WishlistButton } from "@/components/wishlist-button"
import { RelatedProducts } from "@/components/related-products"
import { RecentlyViewed } from "@/components/recently-viewed"
import { ReviewForm } from "@/components/review-form"
import { BurnMeter } from "@/components/jar-label"
import { useCart } from "@/lib/cart-context"
import { useRecentlyViewed } from "@/lib/recently-viewed-context"
import { BRAND, displayScent, familyOf } from "@/lib/scents"
import { careTips } from "@/lib/care-tips"
import type { Product, Review } from "@/lib/api/types"

function Stars({ rating, className = "h-4 w-4" }: { rating: number; className?: string }) {
  return (
    <span className="flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${className} ${i < Math.round(rating) ? "fill-primary text-primary" : "text-foreground/20"}`}
        />
      ))}
    </span>
  )
}

function ProductSkeleton() {
  return (
    <div className="container mx-auto grid gap-12 px-4 py-12 lg:grid-cols-2">
      <Skeleton className="aspect-[4/5] rounded-2xl" />
      <div className="space-y-5 pt-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-14 w-3/4" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-48 w-full rounded-md" />
      </div>
    </div>
  )
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { addToCart } = useCart()
  const { addToRecentlyViewed } = useRecentlyViewed()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true)
        const { getProduct } = await import("@/lib/api/services/products")
        const { getProductReviews } = await import("@/lib/api/services/reviews")
        const [productData, reviewsData] = await Promise.all([
          getProduct(id),
          getProductReviews(id, true).catch(() => []),
        ])
        setProduct(productData)
        setReviews(Array.isArray(reviewsData) ? reviewsData : [])
        setError(null)
        if (productData) addToRecentlyViewed({ ...productData, reviews: [] } as any)
      } catch (err) {
        console.error("Failed to fetch product:", err)
        setError("not-found")
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [id, addToRecentlyViewed])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navigation />
        <main className="flex-1">
          <ProductSkeleton />
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navigation />
        <main className="flex flex-1 items-center justify-center px-4 py-24">
          <div className="jar-label max-w-md px-8 py-10 text-center">
            <h1 className="type-heading text-foreground">This candle isn&apos;t available</h1>
            <p className="mt-3 text-muted-foreground">
              It may have sold out or been removed from the shop. Browse what&apos;s in stock, or call to ask about it.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link href="/shop">Browse the shop</Link>
              </Button>
              <Button asChild variant="outline">
                <a href={BRAND.phoneHref}>Call {BRAND.phone}</a>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const family = familyOf(product.scent)
  const soldOut = product.stock <= 0
  const offer = product.bundle_offer
  const offerApplies = offer && quantity >= offer.quantity
  const unitPrice = offerApplies ? Math.round(product.price * (1 - offer!.discount / 100)) : product.price
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : Number(product.rating)
  const care = product.care_instructions?.length ? product.care_instructions : careTips.map((t) => `${t.title}. ${t.body}`)

  const handleAddToCart = () => {
    addToCart(product as any, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        <section className="container mx-auto px-4 pb-20 pt-8 md:pt-10">
          <nav aria-label="Breadcrumb" className="mb-8 text-[0.875rem] text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-x-2">
              <li>
                <Link href="/shop" className="hover:text-foreground">
                  Shop
                </Link>
              </li>
              {family && (
                <>
                  <li aria-hidden>/</li>
                  <li>
                    <Link href={`/shop?family=${family.id}`} className="hover:text-foreground">
                      {family.name}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-foreground">
                {product.name}
              </li>
            </ol>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <ImageGallery images={[product.image, ...(product.images || [])]} productName={product.name} />
            </div>

            <div>
              <h1 className="type-display text-foreground">{product.name}</h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.9375rem]">
                {family ? (
                  <Link
                    href={`/shop?family=${family.id}&scent=${encodeURIComponent(displayScent(product.scent))}`}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {displayScent(product.scent)}, {family.name.toLowerCase()}
                  </Link>
                ) : (
                  <span className="text-muted-foreground">{displayScent(product.scent)}</span>
                )}
                {avgRating > 0 && (
                  <a href="#reviews" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <Stars rating={avgRating} />
                    <span className="tabular">
                      {avgRating.toFixed(1)}
                      {reviews.length > 0 && ` from ${reviews.length} ${reviews.length === 1 ? "review" : "reviews"}`}
                    </span>
                    <span className="sr-only">out of 5</span>
                  </a>
                )}
              </div>

              <p className="mt-8 flex items-baseline gap-3">
                <span className="font-serif text-[2.25rem] leading-none text-foreground tabular">
                  KES {unitPrice.toLocaleString()}
                </span>
                {offerApplies && (
                  <s className="text-lg text-muted-foreground tabular">KES {product.price.toLocaleString()}</s>
                )}
              </p>

              {offer && (
                <p className="mt-4 rounded-lg bg-secondary/70 px-4 py-3 text-[0.9375rem] text-foreground">
                  {offerApplies ? (
                    <span className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" aria-hidden />
                      {offer.discount}% off applied for {offer.quantity} or more.
                    </span>
                  ) : (
                    <>
                      <span className="font-medium">{offer.description.replace(/\.$/, "")}.</span> Add{" "}
                      {offer.quantity - quantity} more to get the discount.
                    </>
                  )}
                </p>
              )}

              <p className="type-lede mt-6 max-w-[56ch] text-muted-foreground">{product.description}</p>
              {product.scent_description && (
                <p className="mt-4 max-w-[56ch] font-serif text-[1.25rem] leading-snug text-foreground">
                  {product.scent_description}
                </p>
              )}

              {/* The jar label: the facts printed on the candle itself */}
              <dl className="jar-label mt-8 grid grid-cols-2 gap-x-6 gap-y-5 px-7 py-6 text-[0.9375rem]">
                <div>
                  <dt className="text-muted-foreground">Scent</dt>
                  <dd className="mt-0.5 text-foreground">{displayScent(product.scent)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Size</dt>
                  <dd className="mt-0.5 text-foreground">{product.size}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Wax</dt>
                  <dd className="mt-0.5 text-foreground">100% natural soy</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Availability</dt>
                  <dd className={`mt-0.5 ${soldOut ? "text-destructive" : "text-foreground"}`}>
                    {soldOut ? "Sold out" : product.stock < 10 ? `Only ${product.stock} left` : "In stock"}
                  </dd>
                </div>
                {product.burn_time ? (
                  <div className="col-span-2 border-t border-foreground/15 pt-4">
                    <dt className="sr-only">Burn time</dt>
                    <dd>
                      <BurnMeter hours={product.burn_time} />
                    </dd>
                  </div>
                ) : null}
              </dl>

              {/* Buy */}
              <div className="mt-8 flex items-center gap-2 sm:gap-3">
                <div className="flex h-12 shrink-0 items-center rounded-full border border-foreground/25">
                  <button
                    type="button"
                    className="flex h-12 w-10 items-center justify-center rounded-full hover:bg-secondary disabled:opacity-40 sm:w-12"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || soldOut}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-lg tabular" aria-live="polite" aria-label={`Quantity ${quantity}`}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className="flex h-12 w-10 items-center justify-center rounded-full hover:bg-secondary disabled:opacity-40 sm:w-12"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock || soldOut}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button onClick={handleAddToCart} disabled={soldOut || added} size="lg" className="min-w-0 flex-1 px-4">
                  {soldOut ? (
                    "Sold out"
                  ) : added ? (
                    <>
                      <Check aria-hidden />
                      Added to cart
                    </>
                  ) : (
                    <>
                      Add to cart
                      <span className="hidden sm:inline">, KES {(unitPrice * quantity).toLocaleString()}</span>
                    </>
                  )}
                </Button>
                <WishlistButton product={product as any} variant="outline" className="size-12 shrink-0" />
              </div>

              <p className="mt-5 flex items-center gap-2 text-[0.9375rem] text-muted-foreground">
                <Phone className="h-4 w-4" aria-hidden />
                Prefer to order by phone? Call{" "}
                <a
                  href={BRAND.phoneHref}
                  className="text-foreground underline decoration-primary/50 underline-offset-4 hover:decoration-primary"
                >
                  {BRAND.phone}
                </a>
              </p>

              <Accordion type="multiple" className="mt-10 border-t border-border">
                <AccordionItem value="care">
                  <AccordionTrigger className="py-5 font-serif text-xl font-normal hover:no-underline">
                    Caring for your candle
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
                      {care.map((line, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
                          {line}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                {product.ingredients && product.ingredients.length > 0 && (
                  <AccordionItem value="ingredients">
                    <AccordionTrigger className="py-5 font-serif text-xl font-normal hover:no-underline">
                      What&apos;s in it
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-[0.9375rem] text-muted-foreground">
                        {product.ingredients.map((ingredient, i) => (
                          <li key={i} className="flex gap-3">
                            <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
                            {ingredient}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="scroll-mt-32 bg-secondary/40">
          <div className="container mx-auto grid gap-12 px-4 py-16 md:py-20 lg:grid-cols-[1fr_2fr]">
            <div>
              <h2 className="type-title text-foreground">Reviews</h2>
              {reviews.length > 0 ? (
                <div className="mt-5 flex items-center gap-3">
                  <span className="font-serif text-[2.75rem] leading-none tabular">{avgRating.toFixed(1)}</span>
                  <div>
                    <Stars rating={avgRating} />
                    <p className="mt-1 text-[0.875rem] text-muted-foreground">
                      {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-4 max-w-[36ch] text-muted-foreground">
                  No reviews yet. If you&apos;ve burned this candle, tell others what you thought.
                </p>
              )}
              <div className="mt-6">
                <ReviewForm productId={product.id} productName={product.name} triggerLabel="Write a review" />
              </div>
            </div>

            {reviews.length > 0 && (
              <ul className="divide-y divide-foreground/10">
                {reviews.map((review) => (
                  <li key={review.id} className="py-6 first:pt-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Stars rating={review.rating} />
                      <time className="text-[0.875rem] text-muted-foreground" dateTime={review.created_at}>
                        {new Date(review.created_at).toLocaleDateString("en-KE", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                    <p className="mt-3 max-w-[64ch] text-[1.0625rem] leading-relaxed text-foreground">
                      {review.comment}
                    </p>
                    <p className="mt-2 text-[0.875rem] text-muted-foreground">
                      {review.author}
                      {review.verified && ", verified purchase"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <div className="container mx-auto px-4">
          <RelatedProducts
            currentProductId={product.id}
            currentScent={product.scent}
            relatedProductIds={product.related_products || []}
          />
          <RecentlyViewed excludeId={product.id} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
