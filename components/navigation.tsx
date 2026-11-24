"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingBag, Menu, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Wordmark } from "@/components/wordmark"
import { BRAND } from "@/lib/scents"

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "Our story" },
  { href: "/track-order", label: "Track an order" },
  { href: "/contact", label: "Contact" },
]

function CountDot({ count }: { count: number }) {
  if (count <= 0) return null
  return (
    <span className="absolute -right-0.5 -top-0.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-primary px-1 text-[0.6875rem] font-semibold text-primary-foreground tabular">
      {count}
    </span>
  )
}

export function Navigation() {
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-50">
      <p className="bg-foreground px-4 py-2 text-center text-[0.8125rem] text-background">
        Handmade and hand-poured. Call to order:{" "}
        <a href={BRAND.phoneHref} className="underline decoration-background/40 underline-offset-2 hover:decoration-background">
          {BRAND.phone}
        </a>
      </p>
      <nav
        aria-label="Main"
        className="border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75"
      >
        <div className="container mx-auto flex h-[4.25rem] items-center justify-between gap-6 px-4">
          <Link href="/" className="text-foreground" aria-label="Smells by Kourtney, home">
            <Wordmark />
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "relative py-2 text-[0.9375rem] text-foreground/75 transition-colors hover:text-foreground",
                    "after:absolute after:inset-x-0 after:-bottom-px after:h-[2px] after:origin-left after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform",
                    isActive(link.href) && "text-foreground after:scale-x-100",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <Button asChild variant="ghost" size="icon" className="relative">
              <Link href="/wishlist" aria-label={`Wishlist, ${wishlistCount} saved`}>
                <Heart className="h-5 w-5" />
                <CountDot count={wishlistCount} />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className="relative">
              <Link href="/cart" aria-label={`Cart, ${cartCount} items`}>
                <ShoppingBag className="h-5 w-5" />
                <CountDot count={cartCount} />
              </Link>
            </Button>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-background px-6">
                <SheetTitle className="pt-8 font-normal">
                  <Wordmark />
                </SheetTitle>
                <ul className="mt-8 flex flex-col gap-1">
                  {[{ href: "/", label: "Home" }, ...navLinks].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        aria-current={pathname === link.href ? "page" : undefined}
                        className={cn(
                          "block border-b border-border py-3 font-serif text-xl text-foreground/80 hover:text-foreground",
                          pathname === link.href && "text-primary",
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  )
}
