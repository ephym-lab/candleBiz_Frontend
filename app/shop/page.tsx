"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { products, scents, sizes, priceRanges } from "@/lib/products"
import { Star, Filter } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { WishlistButton } from "@/components/wishlist-button"
import { QuickViewButton } from "@/components/quick-view-modal"
import { Breadcrumbs } from "@/components/breadcrumbs"

export default function ShopPage() {
  const [selectedScent, setSelectedScent] = useState("All")
  const [selectedSize, setSelectedSize] = useState("All")
  const [selectedPriceRange, setSelectedPriceRange] = useState("All")
  const [sortBy, setSortBy] = useState("featured")

  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Filter by scent
    if (selectedScent !== "All") {
      filtered = filtered.filter((product) => product.scent === selectedScent)
    }

    // Filter by size
    if (selectedSize !== "All") {
      filtered = filtered.filter((product) => product.size === selectedSize)
    }

    // Filter by price range
    if (selectedPriceRange !== "All") {
      const range = priceRanges.find((r) => r.label === selectedPriceRange)
      if (range) {
        filtered = filtered.filter((product) => product.price >= range.min && product.price < range.max)
      }
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // Keep original order for "featured"
        break
    }

    return filtered
  }, [selectedScent, selectedSize, selectedPriceRange, sortBy])

  const clearFilters = () => {
    setSelectedScent("All")
    setSelectedSize("All")
    setSelectedPriceRange("All")
  }

  const hasActiveFilters = selectedScent !== "All" || selectedSize !== "All" || selectedPriceRange !== "All"

  const FilterSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 font-semibold text-foreground">Scent</h3>
        <div className="space-y-2">
          {scents.map((scent) => (
            <button
              key={scent}
              onClick={() => setSelectedScent(scent)}
              className={`block w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${selectedScent === scent
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-foreground hover:bg-muted"
                }`}
            >
              {scent}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-foreground">Size</h3>
        <div className="space-y-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`block w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${selectedSize === size
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-foreground hover:bg-muted"
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-foreground">Price Range</h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <button
              key={range.label}
              onClick={() => setSelectedPriceRange(range.label)}
              className={`block w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${selectedPriceRange === range.label
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-foreground hover:bg-muted"
                }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
          Clear Filters
        </Button>
      )}
    </div>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-b from-secondary/50 to-background py-12 md:py-16">
          <div className="container mx-auto px-4">
            <Breadcrumbs items={[{ label: "Shop" }]} />
            <h1 className="font-serif text-4xl font-bold text-foreground md:text-5xl text-balance">Our Collection</h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Explore our handcrafted candles in various scents and sizes
            </p>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-8 lg:flex-row">
              {/* Desktop Filters */}
              <aside className="hidden lg:block lg:w-64 lg:flex-shrink-0">
                <div className="sticky top-24 space-y-6">
                  <div>
                    <h2 className="mb-4 font-serif text-2xl font-bold text-foreground">Filters</h2>
                    <FilterSection />
                  </div>
                </div>
              </aside>

              {/* Products Grid */}
              <div className="flex-1">
                {/* Mobile Filter and Sort Bar */}
                <div className="mb-6 flex items-center justify-between gap-4">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden bg-transparent">
                        <Filter className="mr-2 h-4 w-4" />
                        Filters
                        {hasActiveFilters && (
                          <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                            !
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterSection />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Sort by:</span>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="name">Name: A to Z</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Products Count */}
                <p className="mb-6 text-sm text-muted-foreground">
                  Showing {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
                </p>

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredProducts.map((product) => (
                      <div key={product.id}>
                        <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
                          <Link href={`/product/${product.id}`}>
                            <div className="relative aspect-square overflow-hidden bg-muted">
                              <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              {product.stock < 10 && (
                                <div className="absolute right-2 top-2 rounded-full bg-destructive px-3 py-1 text-xs font-semibold text-destructive-foreground">
                                  Low Stock
                                </div>
                              )}
                              <div className="absolute right-2 bottom-2">
                                <WishlistButton product={product} variant="outline" />
                              </div>
                            </div>
                          </Link>
                          <CardContent className="p-4 space-y-3">
                            <Link href={`/product/${product.id}`}>
                              <h3 className="font-semibold text-foreground text-balance hover:text-primary transition-colors">
                                {product.name}
                              </h3>
                              <p className="mt-1 text-sm text-muted-foreground">{product.scent}</p>
                              <p className="mt-1 text-xs text-muted-foreground">{product.size}</p>
                              <div className="mt-3 flex items-center justify-between">
                                <span className="text-lg font-semibold text-primary">
                                  KES {product.price.toLocaleString()}
                                </span>
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-primary text-primary" />
                                  <span className="text-sm text-muted-foreground">{product.rating}</span>
                                </div>
                              </div>
                            </Link>
                            <QuickViewButton product={product} />
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <p className="text-lg font-medium text-foreground">No products found</p>
                    <p className="mt-2 text-sm text-muted-foreground">Try adjusting your filters</p>
                    <Button onClick={clearFilters} className="mt-4">
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
