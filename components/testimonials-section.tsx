"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { getVerifiedReviews } from "@/lib/api/services/reviews"
import type { VerifiedReview } from "@/lib/api/types"

function Stars({ rating }: { rating: number }) {
    return (
        <span className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    aria-hidden
                    className={i < rating ? "h-4 w-4 fill-primary text-primary" : "h-4 w-4 text-foreground/20"}
                />
            ))}
        </span>
    )
}

/** One review set large as a pull quote, the rest in a quiet column beside it. */
export function TestimonialsSection() {
    const [reviews, setReviews] = useState<VerifiedReview[]>([])
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        getVerifiedReviews()
            .then((data) => setReviews(data.reviews))
            .catch((err) => console.error("Failed to fetch verified reviews:", err))
            .finally(() => setLoaded(true))
    }, [])

    if (!loaded || reviews.length === 0) return null

    const [lead, ...rest] = reviews

    return (
        <section className="container mx-auto px-4 py-20 md:py-28">
            <h2 className="sr-only">What customers say</h2>
            <div className="grid gap-14 lg:grid-cols-12">
                <figure className="lg:col-span-7">
                    <Stars rating={lead.rating} />
                    <blockquote className="mt-6 font-serif text-[1.75rem] leading-[1.3] text-foreground md:text-[2.25rem]">
                        <p>&ldquo;{lead.comment}&rdquo;</p>
                    </blockquote>
                    <figcaption className="mt-6 text-[0.9375rem] text-muted-foreground">
                        <span className="text-foreground">{lead.customerName}</span>, on {lead.productName}
                    </figcaption>
                </figure>

                {rest.length > 0 && (
                    <ul className="space-y-8 lg:col-span-5 lg:border-l lg:border-border lg:pl-10">
                        {rest.slice(0, 3).map((review) => (
                            <li key={review.id}>
                                <figure>
                                    <Stars rating={review.rating} />
                                    <blockquote className="mt-3 text-[1.0625rem] leading-relaxed text-foreground">
                                        <p>&ldquo;{review.comment}&rdquo;</p>
                                    </blockquote>
                                    <figcaption className="mt-2 text-[0.875rem] text-muted-foreground">
                                        {review.customerName}, on {review.productName}
                                    </figcaption>
                                </figure>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    )
}
