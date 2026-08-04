/**
 * Reviews API Service
 */

import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'
import type { ApiResponse, Review, CreateReviewRequest, AdminReviewsResponse, VerifiedReviewsResponse } from '../types'

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

    // If data has a 'reviews' property that's an array, return that
    if (data && typeof data === 'object' && 'reviews' in data && Array.isArray((data as any).reviews)) {
        return (data as any).reviews
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
 * Get all reviews (Admin only) with optional pagination
 */
export async function getAllReviews(verified?: boolean, page: number = 1, limit: number = 10) {
    const params = new URLSearchParams()
    if (verified !== undefined) {
        params.append('verified', String(verified))
    }
    params.append('page', page.toString())
    params.append('limit', limit.toString())

    const url = `${API_ENDPOINTS.ADMIN_REVIEWS}?${params.toString()}`
    const response = await apiClient.get<ApiResponse<AdminReviewsResponse>>(url, true)
    return response.data
}

/**
 * Get all verified reviews (Public)
 */
export async function getVerifiedReviews() {
    const response = await apiClient.get<ApiResponse<VerifiedReviewsResponse>>(
        API_ENDPOINTS.VERIFIED_REVIEWS
    )
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