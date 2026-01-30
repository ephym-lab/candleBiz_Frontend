"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Product } from "./types"

interface WishlistContextType {
    wishlist: Product[]
    addToWishlist: (product: Product) => void
    removeFromWishlist: (productId: string) => void
    isInWishlist: (productId: string) => boolean
    wishlistCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [wishlist, setWishlist] = useState<Product[]>([])

    // Load wishlist from localStorage on mount
    useEffect(() => {
        const savedWishlist = localStorage.getItem("wishlist")
        if (savedWishlist) {
            try {
                setWishlist(JSON.parse(savedWishlist))
            } catch (error) {
                console.error("Failed to parse wishlist from localStorage:", error)
            }
        }
    }, [])

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("wishlist", JSON.stringify(wishlist))
    }, [wishlist])

    const addToWishlist = (product: Product) => {
        setWishlist((prev) => {
            const exists = prev.find((item) => item.id === product.id)
            if (exists) {
                return prev
            }
            return [...prev, product]
        })
    }

    const removeFromWishlist = (productId: string) => {
        setWishlist((prev) => prev.filter((item) => item.id !== productId))
    }

    const isInWishlist = (productId: string) => {
        return wishlist.some((item) => item.id === productId)
    }

    const wishlistCount = wishlist.length

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                wishlistCount,
            }}
        >
            {children}
        </WishlistContext.Provider>
    )
}

export function useWishlist() {
    const context = useContext(WishlistContext)
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider")
    }
    return context
}
