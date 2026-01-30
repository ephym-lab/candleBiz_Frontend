import Image from "next/image"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Leaf, Sparkles, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-secondary/50 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-serif text-4xl font-bold text-foreground md:text-5xl text-balance">Our Story</h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Handcrafting candles with love, care, and natural ingredients to bring warmth and tranquility to your
                home.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <Image
                  src="/about-artisan-making-candles.jpg"
                  alt="Artisan carefully crafting handmade candles"
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">Crafted with Passion</h2>
                <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Welcome to Luxe Candles, where every candle tells a story. Founded in 2020, our journey began with a
                    simple belief: that the ambiance of your space should be as unique and beautiful as you are.
                  </p>
                  <p>
                    We started small, experimenting with different scents and wax blends in a tiny workshop. What began
                    as a passion project quickly grew into something much bigger when friends and family fell in love
                    with our handcrafted creations.
                  </p>
                  <p>
                    Today, each candle is still made by hand in small batches, using 100% natural soy wax and premium
                    essential oils. We believe in sustainability, quality, and the power of a beautiful scent to
                    transform your day.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">Our Values</h2>
              <p className="mt-4 text-muted-foreground">What makes us different</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border/50">
                <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Leaf className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground">Natural</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We use only 100% natural soy wax and essential oils, free from harmful chemicals and additives.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground">Handmade</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Every candle is carefully crafted by hand in small batches to ensure premium quality.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground">Quality</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We never compromise on quality. Each candle is tested to ensure perfect scent throw and burn time.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground">Community</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We support local artisans and give back to our community with every purchase.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">Our Process</h2>
              <p className="mt-4 text-muted-foreground">How we create each candle</p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="font-semibold text-foreground">Selection</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  We carefully select premium soy wax and natural essential oils for each unique scent blend.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="font-semibold text-foreground">Handcrafting</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Each candle is hand-poured in small batches, allowing us to maintain strict quality control.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="font-semibold text-foreground">Quality Check</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Every candle is tested for proper burn time, scent throw, and overall quality before shipping.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-secondary/30 to-accent/30 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
              Experience the Difference
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground leading-relaxed">
              Join hundreds of satisfied customers who have transformed their spaces with our handcrafted candles.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/shop">Shop Our Collection</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
