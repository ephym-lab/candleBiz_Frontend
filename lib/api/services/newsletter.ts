/**
 * Newsletter API Service
 */

import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'
import type { ApiResponse } from '../types'

/**
 * Subscribe to newsletter
 */
export async function subscribe(email: string) {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
        API_ENDPOINTS.NEWSLETTER_SUBSCRIBE,
        { email }
    )
    return response
}

/**
 * Unsubscribe from newsletter
 */
export async function unsubscribe(email: string) {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
        API_ENDPOINTS.NEWSLETTER_UNSUBSCRIBE,
        { email }
    )
    return response
}
