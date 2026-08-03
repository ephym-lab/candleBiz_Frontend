"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
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
import type { Review, PaginationMeta } from "@/lib/api/types"
import { getAllReviews, verifyReview, unverifyReview, deleteReview } from "@/lib/api/services/reviews"

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [filterStatus, setFilterStatus] = useState<string>("all")
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [pagination, setPagination] = useState<PaginationMeta | null>(null)
    
    // Sheet & Modals
    const [selectedReview, setSelectedReview] = useState<Review | null>(null)
    const [isSheetOpen, setIsSheetOpen] = useState(false)
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

            const data = await getAllReviews(verified, currentPage, 10)
            setReviews(data.reviews || [])
            setPagination(data.pagination || null)
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
        const timeoutId = setTimeout(() => {
            fetchReviews()
        }, 300)
        return () => clearTimeout(timeoutId)
    }, [filterStatus, currentPage])

    // Reset page on filter change
    useEffect(() => {
        setCurrentPage(1)
    }, [filterStatus])

    // Handle verify review
    const handleVerify = async (review: Review) => {
        setIsUpdating(true)
        try {
            await verifyReview(review.product_id, review.id)
            toast.success("Review verified successfully!")
            fetchReviews()
            setIsSheetOpen(false)
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
            setIsSheetOpen(false)
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
            setIsSheetOpen(false)
            setSelectedReview(null)
            fetchReviews()
        } catch (err) {
            console.error("Failed to delete review:", err)
            toast.error("Failed to delete review")
        } finally {
            setIsUpdating(false)
        }
    }

    const openReviewSheet = (review: Review) => {
        setSelectedReview(review)
        setIsSheetOpen(true)
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

    if (isLoading && reviews.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error && reviews.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <p className="text-muted-foreground">{error}</p>
                <Button onClick={fetchReviews}>Retry</Button>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-serif font-bold tracking-tight">Reviews</h1>
                <p className="text-muted-foreground">Manage and moderate customer product reviews.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.count}</div>
                    </CardContent>
                </Card>
                <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Verified</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">{stats.verified_count}</div>
                    </CardContent>
                </Card>
                <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Verification</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-yellow-600">{stats.unverified_count}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center justify-between">
                <Tabs value={filterStatus} onValueChange={setFilterStatus} className="w-full sm:w-auto">
                    <TabsList className="bg-transparent h-auto p-0 gap-2 flex-wrap">
                        <TabsTrigger 
                            value="all" 
                            className="rounded-full px-4 py-2 border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                            All Reviews
                        </TabsTrigger>
                        <TabsTrigger 
                            value="verified" 
                            className="rounded-full px-4 py-2 border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                            Verified
                        </TabsTrigger>
                        <TabsTrigger 
                            value="unverified" 
                            className="rounded-full px-4 py-2 border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                            Unverified
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Reviews List */}
            <Card className="overflow-hidden border shadow-sm">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[150px] font-semibold">Author</TableHead>
                                <TableHead className="font-semibold">Rating</TableHead>
                                <TableHead className="font-semibold max-w-[300px]">Comment</TableHead>
                                <TableHead className="font-semibold">Date</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                                <TableHead className="text-right font-semibold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <TableRow key={review.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium truncate">{review.author}</span>
                                                {review.email && (
                                                    <span className="text-xs text-muted-foreground truncate">{review.email}</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`h-3 w-3 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                                    />
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-[300px]">
                                            <p className="truncate text-sm" title={review.comment}>
                                                {review.comment}
                                            </p>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {new Date(review.created_at).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={review.verified ? "default" : "secondary"} className="text-xs">
                                                {review.verified ? "Verified" : "Unverified"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => openReviewSheet(review)}>
                                                Moderate
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        No reviews found matching your filter.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                    <p className="text-sm text-muted-foreground">
                        Showing <span className="font-medium text-foreground">{reviews.length}</span> of <span className="font-medium text-foreground">{pagination.total}</span> reviews
                    </p>
                    <div className="flex items-center gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1 || isLoading}
                            className="h-9 px-4 rounded-full"
                        >
                            Previous
                        </Button>
                        <div className="flex items-center justify-center min-w-[2rem]">
                            <span className="text-sm font-medium">{currentPage} / {pagination.totalPages}</span>
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                            disabled={currentPage === pagination.totalPages || isLoading}
                            className="h-9 px-4 rounded-full"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Review Moderation Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                    <SheetHeader className="mb-6">
                        <SheetTitle className="text-2xl font-serif">Review Details</SheetTitle>
                        <SheetDescription>
                            Moderate customer review for Product ID <span className="font-mono text-foreground text-xs">{selectedReview?.product_id}</span>
                        </SheetDescription>
                    </SheetHeader>
                    
                    {selectedReview && (
                        <div className="space-y-6">
                            <div className="bg-muted/30 p-4 rounded-xl space-y-4">
                                <div>
                                    <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">Author</h4>
                                    <p className="font-medium">{selectedReview.author}</p>
                                    {selectedReview.email && <p className="text-sm text-muted-foreground">{selectedReview.email}</p>}
                                </div>
                                <div>
                                    <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">Rating</h4>
                                    {renderStars(selectedReview.rating)}
                                </div>
                                <div>
                                    <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">Date Submitted</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(selectedReview.created_at).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Review Content</h4>
                                    <p className="text-sm leading-relaxed p-3 bg-background rounded-lg border">
                                        {selectedReview.comment}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-3 pt-4 border-t">
                                <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Moderation Actions</h4>
                                {selectedReview.verified ? (
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => handleUnverify(selectedReview)}
                                        disabled={isUpdating}
                                    >
                                        {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                                        Mark as Unverified
                                    </Button>
                                ) : (
                                    <Button
                                        className="w-full"
                                        onClick={() => handleVerify(selectedReview)}
                                        disabled={isUpdating}
                                    >
                                        {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                                        Verify Review
                                    </Button>
                                )}
                                <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={() => openDeleteDialog(selectedReview)}
                                    disabled={isUpdating}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Review
                                </Button>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Review</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this review? This action cannot be undone and it will be permanently removed from the product.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isUpdating} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
