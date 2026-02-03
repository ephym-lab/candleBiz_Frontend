"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Star, CheckCircle, XCircle, Trash2, Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import type { Review } from "@/lib/api/types"
import { getAllReviews, verifyReview, unverifyReview, deleteReview } from "@/lib/api/services/reviews"

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [filterStatus, setFilterStatus] = useState<string>("all")
    const [selectedReview, setSelectedReview] = useState<Review | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [stats, setStats] = useState({ count: 0, verified_count: 0, unverified_count: 0 })

    // Fetch reviews
    const fetchReviews = async () => {
        try {
            setIsLoading(true)
            let verified: boolean | undefined
            if (filterStatus === "verified") verified = true
            if (filterStatus === "unverified") verified = false

            const data = await getAllReviews(verified)
            setReviews(data.reviews || [])
            setStats({
                count: data.count || 0,
                verified_count: data.verified_count || 0,
                unverified_count: data.unverified_count || 0,
            })
            setError(null)
        } catch (err) {
            console.error("Failed to fetch reviews:", err)
            setError("Failed to load reviews")
            toast.error("Failed to load reviews")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchReviews()
    }, [filterStatus])

    // Handle verify review
    const handleVerify = async (review: Review) => {
        setIsUpdating(true)
        try {
            await verifyReview(review.product_id, review.id)
            toast.success("Review verified successfully!")
            fetchReviews()
        } catch (err) {
            console.error("Failed to verify review:", err)
            toast.error("Failed to verify review")
        } finally {
            setIsUpdating(false)
        }
    }

    // Handle unverify review
    const handleUnverify = async (review: Review) => {
        setIsUpdating(true)
        try {
            await unverifyReview(review.product_id, review.id)
            toast.success("Review unverified successfully!")
            fetchReviews()
        } catch (err) {
            console.error("Failed to unverify review:", err)
            toast.error("Failed to unverify review")
        } finally {
            setIsUpdating(false)
        }
    }

    // Handle delete review
    const handleDelete = async () => {
        if (!selectedReview) return

        setIsUpdating(true)
        try {
            await deleteReview(selectedReview.product_id, selectedReview.id)
            toast.success("Review deleted successfully!")
            setIsDeleteDialogOpen(false)
            setSelectedReview(null)
            fetchReviews()
        } catch (err) {
            console.error("Failed to delete review:", err)
            toast.error("Failed to delete review")
        } finally {
            setIsUpdating(false)
        }
    }

    const openDeleteDialog = (review: Review) => {
        setSelectedReview(review)
        setIsDeleteDialogOpen(true)
    }

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                ))}
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <p className="text-muted-foreground">{error}</p>
                <Button onClick={fetchReviews}>Retry</Button>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold">Reviews</h1>
                    <p className="text-muted-foreground">Manage product reviews</p>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter reviews" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Reviews ({stats.count})</SelectItem>
                        <SelectItem value="verified">Verified ({stats.verified_count})</SelectItem>
                        <SelectItem value="unverified">Unverified ({stats.unverified_count})</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="p-6">
                        <div className="text-2xl font-bold">{stats.count}</div>
                        <p className="text-sm text-muted-foreground">Total Reviews</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="text-2xl font-bold text-green-600">{stats.verified_count}</div>
                        <p className="text-sm text-muted-foreground">Verified</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="text-2xl font-bold text-yellow-600">{stats.unverified_count}</div>
                        <p className="text-sm text-muted-foreground">Pending Verification</p>
                    </CardContent>
                </Card>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <p className="text-muted-foreground">No reviews found</p>
                        </CardContent>
                    </Card>
                ) : (
                    reviews.map((review) => (
                        <Card key={review.id}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <p className="font-semibold">{review.author}</p>
                                                {review.email && (
                                                    <p className="text-sm text-muted-foreground">{review.email}</p>
                                                )}
                                            </div>
                                            <Badge variant={review.verified ? "default" : "secondary"}>
                                                {review.verified ? "Verified" : "Unverified"}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {renderStars(review.rating)}
                                            <span className="text-sm text-muted-foreground">
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <p className="text-sm leading-relaxed">{review.comment}</p>

                                        <p className="text-xs text-muted-foreground">
                                            Product ID: {review.product_id}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {review.verified ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleUnverify(review)}
                                                disabled={isUpdating}
                                            >
                                                <XCircle className="h-4 w-4 mr-2" />
                                                Unverify
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="default"
                                                size="sm"
                                                onClick={() => handleVerify(review)}
                                                disabled={isUpdating}
                                            >
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Verify
                                            </Button>
                                        )}
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => openDeleteDialog(review)}
                                            disabled={isUpdating}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Review</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this review? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isUpdating}>
                            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
