import Link from "next/link"
import { scentFamilies } from "@/lib/scents"

/**
 * The four scent families from the flier, set as jar labels. Typographic on purpose:
 * the photos don't say which scent each candle is, so none is implied here.
 */
export function ShopByScent() {
  return (
    <section className="container mx-auto px-4 py-20 md:py-28">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="type-title text-foreground">Ten scents, four moods</h2>
          <p className="mt-3 max-w-[52ch] text-muted-foreground">
            Start with how you want the room to feel, then pick the scent.
          </p>
        </div>
        <Link
          href="/shop"
          className="text-base text-foreground underline decoration-primary/50 underline-offset-4 hover:decoration-primary"
        >
          See every candle
        </Link>
      </div>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {scentFamilies.map((family) => (
          <li key={family.id}>
            <Link
              href={`/shop?family=${family.id}`}
              className="jar-label group flex h-full flex-col px-7 pb-7 pt-8 transition-colors hover:bg-secondary/50"
            >
              <h3 className="font-serif text-[2rem] leading-none text-foreground">{family.name}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">{family.note}</p>

              <ul className="mt-6 flex-1 border-t border-foreground/15 pt-4">
                {family.scents.map((scent) => (
                  <li
                    key={scent}
                    className="flex items-baseline justify-between border-b border-dashed border-foreground/15 py-2 text-[1.0625rem] text-foreground last:border-b-0"
                  >
                    {scent}
                  </li>
                ))}
              </ul>

              <span className="mt-6 text-[0.9375rem] text-foreground underline decoration-primary/40 underline-offset-4 group-hover:decoration-primary">
                Shop {family.name.toLowerCase()} candles
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
