"use client"

import { useState, use, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useCart } from "@/lib/cart-context"
import { useRecentlyViewed } from "@/lib/recently-viewed-context"
import { Star, Minus, Plus, ShoppingCart, Check, Package, Leaf, Heart, ArrowLeft, Clock, Flame, Loader2, Tag } from "lucide-react"
import { useRouter } from "next/navigation"
import { ImageGallery } from "@/components/image-gallery"
import { WishlistButton } from "@/components/wishlist-button"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { RelatedProducts } from "@/components/related-products"
import { RecentlyViewed } from "@/components/recently-viewed"
import { ReviewForm } from "@/components/review-form"
import type { Product, Review } from "@/lib/api/types"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { addToCart } = useCart()
  const { addToRecentlyViewed } = useRecentlyViewed()
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch product and reviews from API
  useEffect(() => {
    async function fetchProductData() {
      try {
        setIsLoading(true)
        const { getProduct } = await import("@/lib/api/services/products")
        const { getProductReviews } = await import("@/lib/api/services/reviews")

        const [productData, reviewsData] = await Promise.all([
          getProduct(resolvedParams.id),
          getProductReviews(resolvedParams.id, true) // Only fetch verified reviews
        ])

        setProduct(productData)
        // Ensure reviews is always an array
        setReviews(Array.isArray(reviewsData) ? reviewsData : [])
        setError(null)

        // Track product view (convert API product to local type)
        if (productData) {
          addToRecentlyViewed({ ...productData, reviews: [] })
        }
      } catch (err) {
        console.error("Failed to fetch product:", err)
        setError("Failed to load product. Please try again.")
        setReviews([]) // Set empty array on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchProductData()
  }, [resolvedParams.id, addToRecentlyViewed])

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navigation />
        <main className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Error or not found state
  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navigation />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-2xl font-bold text-foreground">Product not found</h1>
            <Button asChild className="mt-4">
              <Link href="/shop">Back to Shop</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Related products will be fetched separately if needed
  const relatedProducts: Product[] = []

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-muted/30">
          <div className="container mx-auto px-4 py-4">
            <Breadcrumbs items={[{ label: "Shop", href: "/shop" }, { label: product.name }]} />
          </div>
        </div>

        {/* Product Details */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-6 -ml-4 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              {/* Product Image Gallery */}
              <div>
                <ImageGallery
                  images={[product.image, ...(product.images || [])]}
                  productName={product.name}
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-col">
                <div>
                  <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
                    {product.name}
                  </h1>

                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < Math.floor(product.rating)
                            ? "fill-primary text-primary"
                            : "fill-muted text-muted-foreground"
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating} ({reviews.length} reviews)
                    </span>
                  </div>

                  <div className="mt-4 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      {product.bundle_offer && quantity >= product.bundle_offer.quantity ? (
                        <div className="flex items-center gap-2">
                          <p className="text-3xl font-bold text-primary">
                            KES {Math.round(product.price * (1 - product.bundle_offer.discount / 100)).toLocaleString()}
                          </p>
                          <p className="text-lg text-muted-foreground line-through">
                            KES {product.price.toLocaleString()}
                          </p>
                          <Badge variant="destructive">
                            Save {product.bundle_offer.discount}%
                          </Badge>
                        </div>
                      ) : (
                        <p className="text-3xl font-bold text-primary">KES {product.price.toLocaleString()}</p>
                      )}

                      {product.burn_time && (
                        <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ml-auto">
                          <Flame className="h-4 w-4" />
                          {product.burn_time}h burn time
                        </div>
                      )}
                    </div>

                    {product.bundle_offer && (
                      <div className={`text-sm rounded-md p-3 border ${quantity >= product.bundle_offer.quantity
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}>
                        <div className="flex items-center gap-2 font-medium">
                          <Tag className="h-4 w-4" />
                          <span>Special Offer: {product.bundle_offer.description}</span>
                        </div>
                        {quantity < product.bundle_offer.quantity && (
                          <p className="mt-1 ml-6 text-xs opacity-90">
                            Add {product.bundle_offer.quantity - quantity} more unit{product.bundle_offer.quantity - quantity > 1 && 's'} to save {product.bundle_offer.discount}%!
                          </p>
                        )}
                        {quantity >= product.bundle_offer.quantity && (
                          <p className="mt-1 ml-6 text-xs font-semibold flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            Discount applied!
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>
                  {product.scent_description && (
                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed italic">
                      {product.scent_description}
                    </p>
                  )}
                </div>

                {/* Product Details */}
                <div className="mt-8 space-y-4 border-t border-border pt-8">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Scent:</span>
                    <span className="text-sm text-muted-foreground">{product.scent}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Size:</span>
                    <span className="text-sm text-muted-foreground">{product.size}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Stock:</span>
                    <span className="text-sm text-muted-foreground">
                      {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
                    </span>
                  </div>
                </div>

                {/* Quantity and Add to Cart */}
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-foreground">Quantity:</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                        className="h-10 w-10 bg-transparent"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={incrementQuantity}
                        disabled={quantity >= product.stock}
                        className="h-10 w-10"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0 || addedToCart}
                      size="lg"
                      className="flex-1"
                    >
                      {addedToCart ? (
                        <>
                          <Check className="mr-2 h-5 w-5" />
                          Added to Cart
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                    <WishlistButton product={product} size="lg" />
                  </div>
                </div>

                {/* Features */}
                <div className="mt-8 grid gap-4 border-t border-border pt-8 sm:grid-cols-3">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Leaf className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground">100% Natural Soy Wax</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground">Handcrafted with Love</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground">Ready to Ship</span>
                  </div>
                </div>

                {/* Care Instructions & Ingredients */}
                {(product.care_instructions || product.ingredients) && (
                  <div className="mt-8 border-t border-border pt-8">
                    <Accordion type="single" collapsible className="w-full">
                      {product.care_instructions && (
                        <AccordionItem value="care">
                          <AccordionTrigger className="text-left font-semibold">
                            Care Instructions
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              {product.care_instructions.map((instruction: string, index: number) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                                  {instruction}
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      )}
                      {product.ingredients && (
                        <AccordionItem value="ingredients">
                          <AccordionTrigger className="text-left font-semibold">
                            Ingredients
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              {product.ingredients.map((ingredient: string, index: number) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                                  {ingredient}
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      )}
                    </Accordion>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="border-t border-border bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">Customer Reviews</h2>

            {/* Review Form */}
            <div className="mt-8">
              <ReviewForm productId={product.id} productName={product.name} />
            </div>

            {/* All Reviews */}
            <div className="mt-8 space-y-6">
              {/* API reviews */}
              {reviews.map((review: Review) => (
                <Card key={review.id} className="border-2 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">{review.author}</p>
                          {review.verified && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground"
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="mt-4 text-muted-foreground leading-relaxed">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}

              {/* Show message if no reviews */}
              {reviews.length === 0 && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* Related Products */}
        <div className="container mx-auto px-4">
          <RelatedProducts currentProductId={product.id} relatedProductIds={product.related_products || []} />
        </div>

        {/* Recently Viewed */}
        <div className="container mx-auto px-4">
          <RecentlyViewed />
        </div>
      </main>

      <Footer />
    </div>
  )
}
