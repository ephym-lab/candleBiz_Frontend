"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
    const [isPromptOpen, setIsPromptOpen] = useState(false)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [rating, setRating] = useState(0)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [author, setAuthor] = useState("")
    const [email, setEmail] = useState("")
    const [comment, setComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            const hasSeenPrompt = localStorage.getItem(`review_prompt_${productId}`)
            if (!hasSeenPrompt) {
                setIsPromptOpen(true)
                localStorage.setItem(`review_prompt_${productId}`, "true")
            }
        }, 3000)
        return () => clearTimeout(timer)
    }, [productId])

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
            setIsFormOpen(false)

            // Refresh the page to show new review
            window.location.reload()
        } catch (error) {
            toast.error("Failed to submit review. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            {/* Manual Trigger Button */}
            <div className="flex justify-center">
                {/* <Button onClick={() => setIsFormOpen(true)} variant="outline" size="lg" className="w-full md:w-auto min-w-[200px]">
                    Write a Review
                </Button> */}
            </div>

            {/* Auto Prompt */}
            <AlertDialog open={isPromptOpen} onOpenChange={setIsPromptOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Would you like to review {productName}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Your feedback helps other shoppers make better decisions and helps us improve our products.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                            setIsPromptOpen(false)
                            toast("No problem!", { description: "You can always leave a review later." })
                        }}>
                            Not right now
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            setIsPromptOpen(false)
                            setIsFormOpen(true)
                        }}>
                            Yes, I'd love to!
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Review Form Modal */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Write Your Review</DialogTitle>
                        <DialogDescription>
                            Share your experience with {productName}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
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
                        <div className="flex gap-2 justify-end pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsFormOpen(false)
                                    setRating(0)
                                    setAuthor("")
                                    setEmail("")
                                    setComment("")
                                }}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Submit Review"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
