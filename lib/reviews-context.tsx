// Reviews context for managing user-submitted reviews

"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Review } from "./types"

interface ReviewsContextType {
    reviews: Record<string, Review[]> // productId -> reviews
    addReview: (productId: string, review: Omit<Review, "id" | "date">) => void
    getProductReviews: (productId: string) => Review[]
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined)

const REVIEWS_STORAGE_KEY = "luxe-candles-reviews"

export function ReviewsProvider({ children }: { children: ReactNode }) {
    const [reviews, setReviews] = useState<Record<string, Review[]>>({})
    const [isLoaded, setIsLoaded] = useState(false)

    // Load reviews from localStorage on mount
    useEffect(() => {
        const savedReviews = localStorage.getItem(REVIEWS_STORAGE_KEY)
        if (savedReviews) {
            try {
                setReviews(JSON.parse(savedReviews))
            } catch (error) {
                console.error("Failed to load reviews from localStorage:", error)
            }
        }
        setIsLoaded(true)
    }, [])

    // Save reviews to localStorage whenever they change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews))
        }
    }, [reviews, isLoaded])

    const addReview = (productId: string, reviewData: Omit<Review, "id" | "date">) => {
        const newReview: Review = {
            ...reviewData,
            id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            date: new Date().toISOString().split("T")[0],
        }

        setReviews((prev) => ({
            ...prev,
            [productId]: [...(prev[productId] || []), newReview],
        }))
    }

    const getProductReviews = (productId: string): Review[] => {
        return reviews[productId] || []
    }

    return (
        <ReviewsContext.Provider value={{ reviews, addReview, getProductReviews }}>
            {children}
        </ReviewsContext.Provider>
    )
}

export function useReviews() {
    const context = useContext(ReviewsContext)
    if (context === undefined) {
        throw new Error("useReviews must be used within a ReviewsProvider")
    }
    return context
}
