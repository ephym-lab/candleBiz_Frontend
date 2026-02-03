"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"
import { useReviews } from "@/lib/reviews-context"
import { toast } from "sonner"

interface ReviewFormProps {
    productId: string
    productName: string
}

export function ReviewForm({ productId, productName }: ReviewFormProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [rating, setRating] = useState(0)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [author, setAuthor] = useState("")
    const [email, setEmail] = useState("")
    const [comment, setComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (rating === 0) {
            toast.error("Please select a rating")
            return
        }

        if (!author.trim()) {
            toast.error("Please enter your name")
            return
        }

        if (!comment.trim()) {
            toast.error("Please write a review")
            return
        }

        setIsSubmitting(true)

        try {
            const { createReview } = await import("@/lib/api/services/reviews")
            await createReview(productId, {
                author: author.trim(),
                email: email.trim() || undefined,
                rating,
                comment: comment.trim(),
            })

            toast.success("Thank you for your review!")

            // Reset form
            setRating(0)
            setAuthor("")
            setEmail("")
            setComment("")
            setIsOpen(false)

            // Refresh the page to show new review
            window.location.reload()
        } catch (error) {
            toast.error("Failed to submit review. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) {
        return (
            <Button onClick={() => setIsOpen(true)} variant="outline" size="lg" className="w-full">
                Write a Review
            </Button>
        )
    }

    return (
        <Card className="border-2 border-primary/20">
            <CardHeader>
                <CardTitle>Write Your Review</CardTitle>
                <p className="text-sm text-muted-foreground">Share your experience with {productName}</p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Rating */}
                    <div className="space-y-2">
                        <Label>Your Rating *</Label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`h-8 w-8 ${star <= (hoveredRating || rating)
                                            ? "fill-primary text-primary"
                                            : "fill-muted text-muted-foreground"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="author">Your Name *</Label>
                        <Input
                            id="author"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="Enter your name"
                            maxLength={50}
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Email (Optional) */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email (Optional)</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            disabled={isSubmitting}
                        />
                        <p className="text-xs text-muted-foreground">
                            Provide your email to get verified purchase badge
                        </p>
                    </div>

                    {/* Comment */}
                    <div className="space-y-2">
                        <Label htmlFor="comment">Your Review *</Label>
                        <Textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell us what you think about this candle..."
                            rows={4}
                            maxLength={500}
                            disabled={isSubmitting}
                        />
                        <p className="text-xs text-muted-foreground text-right">
                            {comment.length}/500 characters
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2">
                        <Button type="submit" className="flex-1" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit Review"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setIsOpen(false)
                                setRating(0)
                                setAuthor("")
                                setEmail("")
                                setComment("")
                            }}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
