import Link from "next/link"
import { Instagram, Facebook, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-primary">Luxe Candles</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Handcrafted soy wax candles made with love and natural essential oils for your home.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/shop" className="transition-colors hover:text-primary">
                  All Candles
                </Link>
              </li>
              <li>
                <Link href="/shop?scent=Lavender" className="transition-colors hover:text-primary">
                  Lavender Collection
                </Link>
              </li>
              <li>
                <Link href="/shop?scent=Vanilla" className="transition-colors hover:text-primary">
                  Vanilla Collection
                </Link>
              </li>
              <li>
                <Link href="/shop?scent=Citrus" className="transition-colors hover:text-primary">
                  Citrus Collection
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="transition-colors hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition-colors hover:text-primary">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="mailto:hello@luxecandles.com"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Luxe Candles. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
