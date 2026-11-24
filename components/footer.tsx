import Link from "next/link"
import { Instagram, Phone } from "lucide-react"
import { Wordmark } from "@/components/wordmark"
import { BRAND, scentFamilies } from "@/lib/scents"

const helpLinks = [
  { href: "/track-order", label: "Track an order" },
  { href: "/contact", label: "Contact us" },
  { href: "/about", label: "Our story" },
]

export function Footer() {
  return (
    <footer className="mt-auto bg-foreground text-background">
      <div className="container mx-auto px-4 pb-10 pt-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Wordmark size="lg" />
            <p className="mt-6 font-serif text-xl leading-snug">{BRAND.tagline}.</p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-background/70">
              Handmade, hand-poured candles in 100% natural soy wax.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={BRAND.phoneHref}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-background/25 px-4 text-[0.9375rem] transition-colors hover:border-background/60"
              >
                <Phone className="h-4 w-4" aria-hidden />
                Call {BRAND.phone}
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-background/25 text-background/80 transition-colors hover:border-background/60 hover:text-background"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          <nav aria-label="Shop by scent">
            <h2 className="font-serif text-lg">Shop by scent</h2>
            <ul className="mt-4 space-y-2.5 text-[0.9375rem] text-background/70">
              <li>
                <Link href="/shop" className="transition-colors hover:text-background">
                  All candles
                </Link>
              </li>
              {scentFamilies.map((f) => (
                <li key={f.id}>
                  <Link href={`/shop?family=${f.id}`} className="transition-colors hover:text-background">
                    {f.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Help">
            <h2 className="font-serif text-lg">Help</h2>
            <ul className="mt-4 space-y-2.5 text-[0.9375rem] text-background/70">
              {helpLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-background">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-background/15 pt-6 text-[0.8125rem] text-background/55 sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Smells by Kourtney</p>
          <p>Prices in Kenyan shillings. Pay cash on delivery.</p>
        </div>
      </div>
    </footer>
  )
}
