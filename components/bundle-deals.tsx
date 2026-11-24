"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useCart } from "@/lib/cart-context"
import { getBundleProducts } from "@/lib/api/services/products"
import type { Product } from "@/lib/api/types"

function bundlePrices(product: Product) {
    const offer = product.bundle_offer!
    const full = product.price * offer.quantity
    const discounted = Math.round(full * (1 - offer.discount / 100))
    return { full, discounted }
}

/** Bundles are a list of offers, read top to bottom: what you get, what it costs, one button. */
export function BundleDeals() {
    const { addToCart } = useCart()
    const [bundleProducts, setBundleProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [failed, setFailed] = useState(false)

    useEffect(() => {
        getBundleProducts()
            .then((data) => setBundleProducts(data.filter((p) => p.bundle_offer)))
            .catch((err) => {
                console.error("Failed to fetch bundle products:", err)
                setFailed(true)
            })
            .finally(() => setLoading(false))
    }, [])

    if (failed || (!loading && bundleProducts.length === 0)) return null

    return (
        <section className="bg-secondary/40 py-20 md:py-28">
            <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-12">
                <div className="lg:col-span-4">
                    <h2 className="type-title text-foreground">Buy a few, pay less</h2>
                    <p className="mt-4 max-w-[36ch] text-muted-foreground">
                        Set a scent in every room or put a gift aside for later. Bundles are priced below buying the same
                        candles one at a time.
                    </p>
                </div>

                <ul className="divide-y divide-foreground/15 border-y border-foreground/15 lg:col-span-8">
                    {loading
                        ? [0, 1, 2].map((i) => (
                              <li key={i} className="flex items-center gap-5 py-6">
                                  <Skeleton className="h-24 w-24 shrink-0 rounded-lg" />
                                  <div className="flex-1 space-y-2">
                                      <Skeleton className="h-5 w-1/2" />
                                      <Skeleton className="h-4 w-1/3" />
                                  </div>
                              </li>
                          ))
                        : bundleProducts.map((product) => {
                              const offer = product.bundle_offer!
                              const { full, discounted } = bundlePrices(product)
                              return (
                                  <li
                                      key={product.id}
                                      className="grid grid-cols-[5rem_1fr] items-center gap-x-5 gap-y-4 py-6 sm:grid-cols-[6rem_1fr_auto]"
                                  >
                                      <Link
                                          href={`/product/${product.id}`}
                                          className="relative block aspect-square overflow-hidden rounded-lg bg-muted"
                                      >
                                          <Image
                                              src={product.image || "/placeholder.svg"}
                                              alt={product.name}
                                              fill
                                              sizes="96px"
                                              className="object-cover"
                                          />
                                      </Link>

                                      <div className="min-w-0">
                                          <h3 className="font-serif text-xl text-foreground">
                                              <Link href={`/product/${product.id}`} className="hover:text-primary">
                                                  {offer.quantity} × {product.name}
                                              </Link>
                                          </h3>
                                          <p className="mt-1 text-[0.9375rem] text-muted-foreground">
                                              {offer.description}
                                          </p>
                                          <p className="mt-2 flex flex-wrap items-baseline gap-x-3 text-[0.9375rem] tabular">
                                              <span className="font-medium text-foreground">
                                                  KES {discounted.toLocaleString()}
                                              </span>
                                              <s className="text-muted-foreground">KES {full.toLocaleString()}</s>
                                              <span className="text-primary">Save {offer.discount}%</span>
                                          </p>
                                      </div>

                                      <Button
                                          variant="outline"
                                          onClick={() => addToCart(product as any, offer.quantity)}
                                          className="col-span-2 sm:col-span-1"
                                      >
                                          Add {offer.quantity} to cart
                                      </Button>
                                  </li>
                              )
                          })}
                </ul>
            </div>
        </section>
    )
}
