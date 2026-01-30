"use client"

import { useState, use, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { products } from "@/lib/products"
import { useCart } from "@/lib/cart-context"
import { useRecentlyViewed } from "@/lib/recently-viewed-context"
import { useReviews } from "@/lib/reviews-context"
import { Star, Minus, Plus, ShoppingCart, Check, Package, Leaf, Heart, ArrowLeft, Clock, Flame } from "lucide-react"
import { useRouter } from "next/navigation"
import { ImageGallery } from "@/components/image-gallery"
import { WishlistButton } from "@/components/wishlist-button"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { RelatedProducts } from "@/components/related-products"
import { RecentlyViewed } from "@/components/recently-viewed"
import { ReviewForm } from "@/components/review-form"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { addToCart } = useCart()
  const { addToRecentlyViewed } = useRecentlyViewed()
  const { getProductReviews } = useReviews()
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  const product = products.find((p) => p.id === resolvedParams.id)

  // Track product view
  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product)
    }
  }, [product, addToRecentlyViewed])

  if (!product) {
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

  const relatedProducts = products.filter((p) => p.scent === product.scent && p.id !== product.id).slice(0, 3)

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
                {product.images && product.images.length > 0 ? (
                  <ImageGallery images={product.images} productName={product.name} />
                ) : (
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  </div>
                )}
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
                      {product.rating} ({product.reviews.length} reviews)
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <p className="text-3xl font-bold text-primary">KES {product.price.toLocaleString()}</p>
                    {product.burnTime && (
                      <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                        <Flame className="h-4 w-4" />
                        {product.burnTime}h burn time
                      </div>
                    )}
                  </div>

                  <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>
                  {product.scentDescription && (
                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed italic">
                      {product.scentDescription}
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
                {(product.careInstructions || product.ingredients) && (
                  <div className="mt-8 border-t border-border pt-8">
                    <Accordion type="single" collapsible className="w-full">
                      {product.careInstructions && (
                        <AccordionItem value="care">
                          <AccordionTrigger className="text-left font-semibold">
                            Care Instructions
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              {product.careInstructions.map((instruction, index) => (
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
                              {product.ingredients.map((ingredient, index) => (
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
              {/* User submitted reviews */}
              {getProductReviews(product.id).map((review) => (
                <Card key={review.id} className="border-2 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">{review.author}</p>
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            Verified Purchase
                          </span>
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
                        {new Date(review.date).toLocaleDateString("en-US", {
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

              {/* Existing product reviews */}
              {product.reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{review.author}</p>
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
                        {new Date(review.date).toLocaleDateString("en-US", {
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
            </div>
          </div>
        </section>

        {/* Related Products */}
        <div className="container mx-auto px-4">
          <RelatedProducts currentProductId={product.id} relatedProductIds={product.relatedProducts} />
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
