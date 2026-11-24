"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Search, X, Phone } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductCard } from "@/components/product-card"
import { ProductGridSkeleton } from "@/components/skeletons/product-skeleton"
import { getProducts } from "@/lib/api/services/products"
import type { Product } from "@/lib/api/types"
import { BRAND, familyOf, scentFamilies, type ScentFamily } from "@/lib/scents"
import { cn } from "@/lib/utils"

const priceRanges = [
  { id: "all", label: "Any price", min: 0, max: Infinity },
  { id: "under-1000", label: "Under KES 1,000", min: 0, max: 999 },
  { id: "1000-1500", label: "KES 1,000 to 1,500", min: 1000, max: 1500 },
  { id: "over-1500", label: "Over KES 1,500", min: 1501, max: Infinity },
]

const sortOptions = [
  { id: "featured", label: "Featured" },
  { id: "price-low", label: "Price, low to high" },
  { id: "price-high", label: "Price, high to low" },
  { id: "rating", label: "Highest rated" },
  { id: "name", label: "Name, A to Z" },
]

const same = (a?: string | null, b?: string | null) => (a ?? "").trim().toLowerCase() === (b ?? "").trim().toLowerCase()

function Chip({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  count?: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[0.9375rem] transition-colors",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-foreground/20 text-foreground hover:border-foreground/50",
      )}
    >
      {children}
      {count !== undefined && (
        <span className={cn("text-[0.8125rem] tabular", active ? "text-background/70" : "text-muted-foreground")}>
          {count}
        </span>
      )}
    </button>
  )
}

function ShopContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const [query, setQuery] = useState("")
  const [size, setSize] = useState("all")
  const [price, setPrice] = useState("all")
  const [sortBy, setSortBy] = useState("featured")

  // Family and scent live in the URL so links from the home page and footer land filtered.
  const scentParam = searchParams.get("scent")
  const family: ScentFamily | undefined =
    scentFamilies.find((f) => f.id === searchParams.get("family")) ?? familyOf(scentParam)
  const scent = scentParam && family?.scents.some((s) => same(s, scentParam)) ? scentParam : null

  const setUrl = (next: { family?: string | null; scent?: string | null }) => {
    const params = new URLSearchParams()
    if (next.family) params.set("family", next.family)
    if (next.scent) params.set("scent", next.scent)
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    getProducts({ limit: 100 })
      .then((res) => {
        if (cancelled) return
        setProducts(res.products ?? [])
        setError(null)
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err)
        if (!cancelled) setError("The candles couldn't be loaded. Check your connection and try again.")
      })
      .finally(() => !cancelled && setIsLoading(false))
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const sizes = useMemo(
    () => Array.from(new Set(products.map((p) => p.size).filter(Boolean))).sort(),
    [products],
  )

  const familyCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const p of products) {
      const f = familyOf(p.scent)
      if (f) counts[f.id] = (counts[f.id] ?? 0) + 1
    }
    return counts
  }, [products])

  const visible = useMemo(() => {
    const range = priceRanges.find((r) => r.id === price) ?? priceRanges[0]
    const q = query.trim().toLowerCase()
    const list = products.filter((p) => {
      if (family && familyOf(p.scent)?.id !== family.id) return false
      if (scent && !same(p.scent, scent)) return false
      if (size !== "all" && p.size !== size) return false
      if (p.price < range.min || p.price > range.max) return false
      if (q && ![p.name, p.scent, p.description].some((v) => v?.toLowerCase().includes(q))) return false
      return true
    })
    switch (sortBy) {
      case "price-low":
        return [...list].sort((a, b) => a.price - b.price)
      case "price-high":
        return [...list].sort((a, b) => b.price - a.price)
      case "rating":
        return [...list].sort((a, b) => Number(b.rating) - Number(a.rating))
      case "name":
        return [...list].sort((a, b) => a.name.localeCompare(b.name))
      default:
        return list
    }
  }, [products, family, scent, size, price, query, sortBy])

  const hasFilters = Boolean(family || scent || query || size !== "all" || price !== "all")
  const clearAll = () => {
    setQuery("")
    setSize("all")
    setPrice("all")
    setUrl({})
  }

  return (
    <main className="flex-1">
      {/* Header */}
      <section className="bg-secondary/40">
        <div className="container mx-auto px-4 pb-10 pt-14 md:pt-20">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="type-display text-foreground">{family ? `${family.name} candles` : "Shop candles"}</h1>
              <p className="type-lede mt-5 max-w-[52ch] text-muted-foreground">
                {family
                  ? `${family.note}. ${family.scents.join(", ")}, all in 100% natural soy wax.`
                  : "Every candle is handmade and hand-poured in 100% natural soy wax. Choose a scent family to narrow it down."}
              </p>
            </div>
          </div>

          {/* Families: the primary way to browse */}
          <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Scent family">
            <Chip active={!family} onClick={() => setUrl({})} count={products.length || undefined}>
              All candles
            </Chip>
            {scentFamilies.map((f) => (
              <Chip
                key={f.id}
                active={family?.id === f.id}
                onClick={() => setUrl({ family: family?.id === f.id ? null : f.id })}
                count={products.length ? (familyCounts[f.id] ?? 0) : undefined}
              >
                {f.name}
              </Chip>
            ))}
          </div>

          {family && (
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2" role="group" aria-label="Scent">
              <span className="text-[0.9375rem] text-muted-foreground">Scent:</span>
              {[null, ...family.scents].map((s) => {
                const active = s ? same(scent, s) : !scent
                return (
                  <button
                    key={s ?? "any"}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setUrl({ family: family.id, scent: s })}
                    className={cn(
                      "py-1 text-[0.9375rem] underline-offset-[6px] transition-colors",
                      active
                        ? "text-foreground underline decoration-primary decoration-2"
                        : "text-foreground/70 hover:text-foreground",
                    )}
                  >
                    {s ?? `Any ${family.name.toLowerCase()}`}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24 pt-8">
        {/* Toolbar (hidden while there's nothing to search) */}
        <div className={cn("flex flex-col gap-3 border-b border-border pb-6 lg:flex-row lg:items-center", !isLoading && !error && products.length === 0 && "hidden")}>
          <div className="relative flex-1 lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <label htmlFor="shop-search" className="sr-only">
              Search candles
            </label>
            <Input
              id="shop-search"
              type="search"
              placeholder="Search by name or scent"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap lg:ml-auto">
            {sizes.length > 1 && (
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger className="w-full sm:w-[11rem]" aria-label="Size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any size</SelectItem>
                  {sizes.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={price} onValueChange={setPrice}>
              <SelectTrigger className="w-full sm:w-[11.5rem]" aria-label="Price">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="col-span-2 w-full sm:col-span-1 sm:w-[12rem]" aria-label="Sort by">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {!isLoading && !error && products.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 py-5 text-[0.9375rem]">
            <p className="text-muted-foreground" aria-live="polite">
              {visible.length === products.length
                ? `${visible.length} ${visible.length === 1 ? "candle" : "candles"}`
                : `Showing ${visible.length} of ${products.length} candles`}
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={clearAll}
                className="text-foreground underline decoration-primary/50 underline-offset-4 hover:decoration-primary"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="pt-8">
            <ProductGridSkeleton count={8} />
          </div>
        ) : error ? (
          <div className="mx-auto max-w-md py-20 text-center">
            <h2 className="type-heading text-foreground">Couldn&apos;t load the shop</h2>
            <p className="mt-3 text-muted-foreground">{error}</p>
            <Button className="mt-6" onClick={() => setReloadKey((k) => k + 1)}>
              Try again
            </Button>
          </div>
        ) : products.length === 0 ? (
          <div className="jar-label mx-auto mt-12 max-w-lg px-8 py-10 text-center">
            <h2 className="type-heading text-foreground">New candles are being poured</h2>
            <p className="mt-3 text-muted-foreground">
              Nothing is listed online right now. Call to order, or to hear when the next batch is ready.
            </p>
            <Button asChild size="lg" className="mt-6">
              <a href={BRAND.phoneHref}>
                <Phone aria-hidden />
                Call {BRAND.phone}
              </a>
            </Button>
          </div>
        ) : visible.length === 0 ? (
          <div className="mx-auto max-w-md py-20 text-center">
            <h2 className="type-heading text-foreground">No candles match those filters</h2>
            <p className="mt-3 text-muted-foreground">
              {scent
                ? `${scent} isn't listed right now. Try another ${family?.name.toLowerCase()} scent, or call to ask about it.`
                : "Try a different scent family or price, or clear the filters to see everything."}
            </p>
            <Button variant="outline" className="mt-6" onClick={clearAll}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-x-6 gap-y-14 pt-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 4} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default function ShopPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <Suspense
        fallback={
          <main className="container mx-auto flex-1 px-4 py-20">
            <ProductGridSkeleton count={8} />
          </main>
        }
      >
        <ShopContent />
      </Suspense>
      <Footer />
    </div>
  )
}
