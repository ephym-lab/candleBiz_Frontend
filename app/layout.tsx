import type React from "react"
import type { Metadata } from "next"
import { Young_Serif, Albert_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import { AdminProvider } from "@/lib/admin-context"
import { WishlistProvider } from "@/lib/wishlist-context"
import { RecentlyViewedProvider } from "@/lib/recently-viewed-context"
import { ReviewsProvider } from "@/lib/reviews-context"
import { Toaster } from "sonner"

const youngSerif = Young_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-young-serif",
  display: "swap",
})

const albertSans = Albert_Sans({
  subsets: ["latin"],
  variable: "--font-albert-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Smells by Kourtney | Handmade soy candles",
  description:
    "Handmade, hand-poured scented candles in 100% natural soy wax. Floral, gourmand, woodsy and fruity scents. Call 0729 302 230 to order.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${albertSans.variable} ${youngSerif.variable}`}>
      <body className="font-sans antialiased">
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
