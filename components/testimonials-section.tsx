"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star, AlertCircle } from "lucide-react"
import { getVerifiedReviews } from "@/lib/api/services/reviews"
import type { VerifiedReview } from "@/lib/api/types"

export function TestimonialsSection() {
    const [reviews, setReviews] = useState<VerifiedReview[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchReviews() {
            try {
                setLoading(true)
                setError(null)
                const data = await getVerifiedReviews()
                setReviews(data.reviews)
            } catch (err) {
                console.error('Failed to fetch verified reviews:', err)
                setError('Failed to load reviews. Please try again later.')
            } finally {
                setLoading(false)
            }
        }

        fetchReviews()
    }, [])

    // Loading state
    if (loading) {
        return (
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
                            What Our Customers Say
                        </h2>
                        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                            Don't just take our word for it - hear from our satisfied customers
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="border-2">
                                <CardContent className="p-6 space-y-4">
                                    <div className="h-5 bg-muted animate-pulse rounded w-1/3" />
                                    <div className="space-y-2">
                                        <div className="h-4 bg-muted animate-pulse rounded" />
                                        <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
                                    </div>
                                    <div className="h-12 bg-muted animate-pulse rounded-full w-12" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    // Error state
    if (error) {
        return (
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-md mx-auto">
                        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                        <h3 className="font-semibold text-lg mb-2">Unable to Load Reviews</h3>
                        <p className="text-muted-foreground">{error}</p>
                    </div>
                </div>
            </section>
        )
    }

    // Don't render if no reviews
    if (reviews.length === 0) {
        return null
    }

    return (
        <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
                        What Our Customers Say
                    </h2>
                    <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                        Don't just take our word for it - hear from our satisfied customers
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {reviews.map((review) => (
                        <Card key={review.id} className="border-2 hover:border-primary/50 transition-colors">
                            <CardContent className="p-6">
                                {/* Rating */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                                    ))}
                                </div>

                                {/* Content */}
                                <p className="text-muted-foreground leading-relaxed mb-6 italic">
                                    "{review.comment}"
                                </p>

                                {/* Author */}
                                <div>
                                    <p className="font-semibold text-foreground">{review.customerName}</p>
                                    <p className="text-sm text-muted-foreground">{review.productName}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
