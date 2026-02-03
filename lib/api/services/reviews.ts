/**
 * Reviews API Service
 */

import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'
import type { ApiResponse, Review, CreateReviewRequest, AdminReviewsResponse } from '../types'

/**
 * Get product reviews
 */
export async function getProductReviews(productId: string, verifiedOnly: boolean = false) {
    const params = verifiedOnly ? '?verified_only=true' : ''
    const response = await apiClient.get<ApiResponse<Review[]>>(
        `${API_ENDPOINTS.PRODUCT_REVIEWS(productId)}${params}`
    )

    // Handle both direct array and wrapped response
    const data = response.data

    // If data is already an array, return it
    if (Array.isArray(data)) {
        return data
    }

    // If data has a 'data' property that's an array, return that
    if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as any).data)) {
        return (data as any).data
    }

    // Otherwise return empty array
    return []
}

/**
 * Create product review
 */
export async function createReview(productId: string, reviewData: CreateReviewRequest) {
    const response = await apiClient.post<ApiResponse<Review>>(
        API_ENDPOINTS.PRODUCT_REVIEWS(productId),
        reviewData
    )
    return response.data
}

/**
 * Get all reviews (Admin only)
 */
export async function getAllReviews(verified?: boolean) {
    let url = API_ENDPOINTS.ADMIN_REVIEWS
    if (verified !== undefined) {
        url += `?verified=${verified}`
    }
    const response = await apiClient.get<ApiResponse<AdminReviewsResponse>>(url, true)
    return response.data
}

/**
 * Verify a review (Admin only)
 */
export async function verifyReview(productId: string, reviewId: string) {
    const response = await apiClient.patch<ApiResponse<Review>>(
        API_ENDPOINTS.REVIEW_VERIFY(productId, reviewId),
        {},
        true
    )
    return response.data
}

/**
 * Unverify a review (Admin only)
 */
export async function unverifyReview(productId: string, reviewId: string) {
    const response = await apiClient.patch<ApiResponse<Review>>(
        API_ENDPOINTS.REVIEW_UNVERIFY(productId, reviewId),
        {},
        true
    )
    return response.data
}

/**
 * Delete a review (Admin only)
 */
export async function deleteReview(productId: string, reviewId: string) {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(
        API_ENDPOINTS.REVIEW_DELETE(productId, reviewId),
        true
    )
    return response
}
