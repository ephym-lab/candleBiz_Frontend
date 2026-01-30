"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { Product } from "./types"

interface RecentlyViewedContextType {
    recentlyViewed: Product[]
    addToRecentlyViewed: (product: Product) => void
    clearRecentlyViewed: () => void
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined)

const MAX_RECENTLY_VIEWED = 8
const STORAGE_KEY = "recentlyViewed"

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
    const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Load recently viewed from localStorage on mount
    useEffect(() => {
        const savedRecentlyViewed = localStorage.getItem(STORAGE_KEY)
        if (savedRecentlyViewed) {
            try {
                setRecentlyViewed(JSON.parse(savedRecentlyViewed))
            } catch (error) {
                console.error("Failed to parse recently viewed from localStorage:", error)
            }
        }
        setIsLoaded(true)
    }, [])

    // Save recently viewed to localStorage whenever it changes (but only after initial load)
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed))
        }
    }, [recentlyViewed, isLoaded])

    const addToRecentlyViewed = useCallback((product: Product) => {
        setRecentlyViewed((prev) => {
            // Remove if already exists
            const filtered = prev.filter((item) => item.id !== product.id)
            // Add to beginning
            const updated = [product, ...filtered]
            // Keep only the last MAX_RECENTLY_VIEWED items
            return updated.slice(0, MAX_RECENTLY_VIEWED)
        })
    }, [])

    const clearRecentlyViewed = useCallback(() => {
        setRecentlyViewed([])
    }, [])

    return (
        <RecentlyViewedContext.Provider
            value={{
                recentlyViewed,
                addToRecentlyViewed,
                clearRecentlyViewed,
            }}
        >
            {children}
        </RecentlyViewedContext.Provider>
    )
}

export function useRecentlyViewed() {
    const context = useContext(RecentlyViewedContext)
    if (context === undefined) {
        throw new Error("useRecentlyViewed must be used within a RecentlyViewedProvider")
    }
    return context
}
