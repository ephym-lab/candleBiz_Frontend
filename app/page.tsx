import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { products } from "@/lib/products"
import { Star, Sparkles, Leaf, Heart } from "lucide-react"
import { TestimonialsSection } from "@/components/testimonials-section"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { TrustBadges } from "@/components/trust-badges"
import { BundleDeals } from "@/components/bundle-deals"

export default function HomePage() {
  const featuredProducts = products.slice(0, 4)

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="space-y-6">
                <h1 className="font-serif text-4xl font-bold leading-tight text-balance text-foreground md:text-5xl lg:text-6xl">
                  Illuminate Your Space with Handcrafted Elegance
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                  Discover our collection of handmade, eco-friendly soy wax candles. Each candle is carefully crafted
                  with natural essential oils to create the perfect ambiance for your home.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg" className="font-semibold">
                    <Link href="/shop">Shop Collection</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/about">Our Story</Link>
                  </Button>
                </div>
              </div>

              <div className="relative aspect-square overflow-hidden rounded-lg">
                <Image
                  src="/hero-candle-display.jpg"
                  alt="Beautiful display of handmade scented candles"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="border-border/50">
                <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Leaf className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground">100% Natural</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Made with pure soy wax and natural essential oils, free from harmful chemicals
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground">Handcrafted</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Each candle is lovingly made by hand in small batches for premium quality
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground">Long Lasting</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Our candles provide 40+ hours of clean, even burn time for lasting enjoyment
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">Featured Collection</h2>
              <p className="mt-4 text-muted-foreground">Discover our most popular handcrafted candles</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground text-balance">{product.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{product.scent}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-semibold text-primary">KES {product.price.toLocaleString()}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span className="text-sm text-muted-foreground">{product.rating}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button asChild size="lg">
                <Link href="/shop">View All Candles</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <TrustBadges />

        {/* Bundle Deals */}
        <BundleDeals />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Newsletter Signup */}
        <NewsletterSignup />

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Card className="overflow-hidden border-primary/20 bg-gradient-to-r from-secondary/30 to-accent/30">
              <CardContent className="p-8 text-center md:p-12">
                <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
                  Transform Your Space Today
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-muted-foreground leading-relaxed">
                  Experience the perfect blend of fragrance and ambiance. Our handmade candles make wonderful gifts or
                  treats for yourself.
                </p>
                <Button asChild size="lg" className="mt-8">
                  <Link href="/shop">Start Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
