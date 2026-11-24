import Link from "next/link"
import Image from "next/image"
import { Phone, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { TestimonialsSection } from "@/components/testimonials-section"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { TrustBadges } from "@/components/trust-badges"
import { BundleDeals } from "@/components/bundle-deals"
import { ShopByScent } from "@/components/shop-by-scent"
import { JarLabel } from "@/components/jar-label"
import { ProductCard } from "@/components/product-card"
import { getTopSellingProducts } from "@/lib/api/services/products"
import type { TopSellingProduct } from "@/lib/api/types"
import { BRAND, allScents, scentFamilies } from "@/lib/scents"
import { careTips as tips } from "@/lib/care-tips"


export default async function HomePage() {
  let featuredProducts: TopSellingProduct[] = []
  try {
    featuredProducts = await getTopSellingProducts(4)
  } catch (error) {
    console.error("Failed to fetch featured products:", error)
    featuredProducts = []
  }

  const heroProduct = featuredProducts[0]
  const labelShadow = "shadow-[0_24px_48px_-28px_color-mix(in_oklch,var(--foreground)_55%,transparent)]"

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-secondary/40">
          <div className="container mx-auto grid items-center gap-14 px-4 pb-24 pt-14 md:pt-20 lg:grid-cols-2 lg:gap-16 lg:pb-32">
            <div>
              <h1 className="type-display max-w-[14ch] text-foreground">Handmade, hand-poured scented candles</h1>
              <p className="type-lede mt-7 max-w-[46ch] text-muted-foreground">
                Made with 100% natural soy wax in ten scents: floral, gourmand, woodsy and fruity. Order online, or
                call us and we&apos;ll help you choose.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
                <Button asChild size="lg">
                  <Link href="/shop">Shop candles</Link>
                </Button>
                <Button asChild variant="link" className="text-base">
                  <a href={BRAND.phoneHref}>Call {BRAND.phone}</a>
                </Button>
              </div>

              <dl className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-foreground/15 pt-6">
                {[
                  ["100%", "natural soy wax"],
                  [String(allScents.length), "scents to choose from"],
                  [String(scentFamilies.length), "scent families"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <dt className="sr-only">{label}</dt>
                    <dd>
                      <span className="block font-serif text-[1.75rem] leading-none text-foreground tabular">{value}</span>
                      <span className="mt-1.5 block text-[0.875rem] leading-snug text-muted-foreground">{label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
                <Image
                  src="/photos/web/candle1.jpg"
                  alt="A lit soy candle in a faceted cut-glass jar"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>

              <div className="animate-glow-in relative z-10 mx-4 -mt-20 sm:absolute sm:bottom-8 sm:-left-8 sm:mx-0 sm:mt-0 sm:w-[20rem] lg:-left-12">
                {heroProduct ? (
                  <JarLabel
                    as="p"
                    name={heroProduct.name}
                    scent={heroProduct.scent}
                    size={heroProduct.size}
                    burnTime={heroProduct.burn_time}
                    price={heroProduct.price}
                    className={labelShadow}
                  >
                    <Link
                      href={`/product/${heroProduct.id}`}
                      className="mt-4 inline-block text-[0.9375rem] text-foreground underline decoration-primary/50 underline-offset-4 hover:decoration-primary"
                    >
                      View this candle
                    </Link>
                  </JarLabel>
                ) : (
                  <JarLabel as="p" name="Ten scents" className={labelShadow}>
                    <p className="mt-3 border-t border-foreground/15 pt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
                      {allScents.join(", ")}
                    </p>
                  </JarLabel>
                )}
              </div>
            </div>
          </div>
        </section>

        <TrustBadges />

        {featuredProducts.length > 0 && (
          <section className="container mx-auto px-4 pt-20 md:pt-28">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="type-title text-foreground">Most loved right now</h2>
                <p className="mt-3 max-w-[48ch] text-muted-foreground">The candles customers order most.</p>
              </div>
              <Button asChild variant="link" className="text-base">
                <Link href="/shop">See all candles</Link>
              </Button>
            </div>

            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} showActions={false} />
              ))}
            </div>
          </section>
        )}

        <ShopByScent />

        {/* Real candles from recent batches */}
        <section className="container mx-auto px-4 pb-20 md:pb-28">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="type-title text-foreground">Recently poured</h2>
            <p className="max-w-[44ch] text-muted-foreground">Candles from recent batches, photographed as they are.</p>
          </div>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
            {[
              { src: "/photos/web/candle3.jpg", alt: "A pink two-wick soy candle topped with wax crystals" },
              { src: "/photos/web/candle4.jpg", alt: "A red soy candle seen from above in a cut-glass jar" },
              { src: "/photos/web/candle5.jpg", alt: "An orange layered soy candle in a glass tumbler" },
            ].map((photo, i) => (
              <li
                key={photo.src}
                className={i === 2 ? "col-span-2 md:col-span-1" : undefined}
              >
                <div className={`relative overflow-hidden rounded-xl bg-muted ${i === 2 ? "aspect-[2/1] md:aspect-[4/5]" : "aspect-[4/5]"}`}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Candle care tips, under the brand's own line */}
        <section className="bg-foreground text-background">
          <div className="container mx-auto grid gap-14 px-4 py-20 md:py-28 lg:grid-cols-2 lg:gap-20">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-auto lg:min-h-[32rem]">
              <Image
                src="/photos/web/candle2.jpg"
                alt="An orange soy candle in a tilted glass resting on a green candle"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="type-title max-w-[18ch]">{BRAND.tagline}</h2>
              <p className="mt-4 max-w-[48ch] text-background/70">
                A few habits that help every candle burn cleanly, smell stronger and last longer.
              </p>
              <ul className="mt-10">
                {tips.map((tip) => (
                  <li key={tip.title} className="grid grid-cols-[1.5rem_1fr] gap-3 border-t border-background/15 py-5">
                    <Flame className="mt-1 h-4 w-4 text-background/50" strokeWidth={1.5} aria-hidden />
                    <div>
                      <h3 className="font-serif text-xl">{tip.title}</h3>
                      <p className="mt-1.5 max-w-[52ch] text-[0.9375rem] leading-relaxed text-background/70">
                        {tip.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <BundleDeals />
        <TestimonialsSection />

        {/* Order by phone */}
        <section className="container mx-auto px-4 py-20 md:py-28">
          <div className="grid items-center gap-10 rounded-2xl border border-border bg-card p-8 md:grid-cols-[1.2fr_1fr] md:p-14">
            <div>
              <h2 className="type-title max-w-[20ch] text-foreground">Rather order by phone?</h2>
              <p className="mt-4 max-w-[50ch] text-muted-foreground">
                Call us to place an order, ask about a scent or put together a gift.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
              <Button asChild size="lg">
                <a href={BRAND.phoneHref}>
                  <Phone aria-hidden />
                  Call {BRAND.phone}
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Send a message</Link>
              </Button>
            </div>
          </div>
        </section>

        <NewsletterSignup />
      </main>

      <Footer />
    </div>
  )
}
