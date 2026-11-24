import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { BRAND, scentFamilies, allScents } from "@/lib/scents"

export const metadata: Metadata = {
  title: "Our story | Smells by Kourtney",
  description: "Handmade, hand-poured scented candles in 100% natural soy wax.",
}

/*
 * Written only from facts on the Smells by Kourtney flier.
 * Kourtney can replace these paragraphs with her own story: edit the text here, nothing else needs to change.
 */
const story = {
  heading: "Scented candles, made and poured by hand",
  lede: `${BRAND.name} makes scented candles from 100% natural soy wax. Every candle is made and poured by hand.`,
  paragraphs: [
    "There are ten scents to choose from, grouped into four families: floral, gourmand, woodsy and fruity. Whether you want something soft for the bedroom or bright for the kitchen, there's a candle for the mood.",
    `You can order through this site and pay cash when your candles arrive, or call ${BRAND.phone} to order by phone.`,
  ],
}

const facts = [
  { title: "100% natural soy wax", body: "Every candle is poured with natural soy wax." },
  { title: "Handmade, hand-poured", body: "Every jar is made and poured by hand." },
  { title: `${allScents.length} scents`, body: "Across four families, from lavender to strawberry." },
]

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Story */}
        <section className="container mx-auto grid items-center gap-12 px-4 pb-20 pt-14 md:pt-20 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <h1 className="type-display max-w-[16ch] text-foreground">{story.heading}</h1>
            <p className="type-lede mt-6 max-w-[48ch] text-muted-foreground">{story.lede}</p>
            <div className="mt-6 max-w-[58ch] space-y-4 leading-relaxed text-foreground/85">
              {story.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button asChild size="lg">
                <Link href="/shop">Shop candles</Link>
              </Button>
              <Button asChild variant="link">
                <a href={BRAND.phoneHref}>Call {BRAND.phone}</a>
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
            <Image
              src="/photos/web/candle4.jpg"
              alt="A hand-poured Smells by Kourtney candle"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </section>

        {/* Facts */}
        <section className="border-y border-border bg-card">
          <dl className="container mx-auto grid gap-10 px-4 py-14 sm:grid-cols-3">
            {facts.map((f) => (
              <div key={f.title}>
                <dt className="font-serif text-2xl text-foreground">{f.title}</dt>
                <dd className="mt-2 max-w-[32ch] text-muted-foreground">{f.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Tagline */}
        <section className="bg-foreground text-background">
          <div className="container mx-auto grid items-center gap-12 px-4 py-20 md:grid-cols-[1fr_20rem] lg:gap-20">
            <blockquote>
              <p className="type-title max-w-[18ch]">{BRAND.tagline}.</p>
              <footer className="mt-5 text-background/65">The {BRAND.name} motto</footer>
            </blockquote>
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image src="/photos/web/candle1.jpg" alt="" fill sizes="20rem" className="object-cover" />
            </div>
          </div>
        </section>

        {/* Scents */}
        <section className="container mx-auto px-4 py-20">
          <h2 className="type-heading text-foreground">The scents</h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {scentFamilies.map((family) => (
              <li key={family.id}>
                <Link
                  href={`/shop?family=${family.id}`}
                  className="jar-label block h-full px-6 py-6 transition-colors hover:bg-secondary/50"
                >
                  <h3 className="font-serif text-2xl">{family.name}</h3>
                  <p className="mt-2 text-[0.9375rem] text-muted-foreground">{family.note}</p>
                  <p className="mt-5 border-t border-foreground/15 pt-4 text-[0.9375rem]">
                    {family.scents.join(", ")}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  )
}
