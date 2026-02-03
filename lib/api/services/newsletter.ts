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

/**
 * Broadcast newsletter to all subscribers (Admin only)
 */
export async function broadcastNewsletter(subject: string, htmlBody: string, token: string) {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/v1'

    const response = await fetch(`${baseURL}${API_ENDPOINTS.NEWSLETTER_BROADCAST}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            subject,
            html_body: htmlBody
        })
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Failed to broadcast newsletter')
    }

    const data = await response.json()
    return { data }
}
