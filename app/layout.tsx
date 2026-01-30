import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import { AdminProvider } from "@/lib/admin-context"
import { WishlistProvider } from "@/lib/wishlist-context"
import { RecentlyViewedProvider } from "@/lib/recently-viewed-context"
import { ReviewsProvider } from "@/lib/reviews-context"
import { Toaster } from "sonner"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Luxe Candles - Handmade Scented Soy Candles",
  description:
    "Discover our collection of handmade, eco-friendly soy wax candles. Crafted with love and natural essential oils for your home.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <AdminProvider>
          <WishlistProvider>
            <RecentlyViewedProvider>
              <ReviewsProvider>
                <CartProvider>
                  {children}
                  <Toaster position="top-center" richColors />
                </CartProvider>
              </ReviewsProvider>
            </RecentlyViewedProvider>
          </WishlistProvider>
        </AdminProvider>
        <Analytics />
      </body>
    </html>
  )
}
