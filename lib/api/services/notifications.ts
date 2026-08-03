/**
 * Notifications API Service
 * Handles all admin notification endpoints
 */

import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'
import type {
    NotificationListResponse,
    MarkReadResponse,
    MarkAllReadResponse,
} from '../types'

export interface GetNotificationsParams {
    skip?: number
    limit?: number
    is_read?: boolean | null
}

/**
 * Get all notifications (Admin Only)
 */
export async function getNotifications(params: GetNotificationsParams = {}) {
    const query = new URLSearchParams()

    if (params.skip !== undefined) query.set('skip', String(params.skip))
    if (params.limit !== undefined) query.set('limit', String(params.limit))
    if (params.is_read !== undefined && params.is_read !== null) {
        query.set('is_read', String(params.is_read))
    }

    const endpoint = query.toString()
        ? `${API_ENDPOINTS.NOTIFICATIONS}?${query.toString()}`
        : API_ENDPOINTS.NOTIFICATIONS

    return apiClient.get<NotificationListResponse>(endpoint, true)
}

/**
 * Mark a specific notification as read (Admin Only)
 */
export async function markNotificationAsRead(notificationId: string) {
    return apiClient.patch<MarkReadResponse>(
        API_ENDPOINTS.NOTIFICATION_MARK_READ(notificationId),
        undefined,
        true
    )
}

/**
 * Mark all unread notifications as read (Admin Only)
 */
export async function markAllNotificationsAsRead() {
    return apiClient.patch<MarkAllReadResponse>(
        API_ENDPOINTS.NOTIFICATIONS_READ_ALL,
        undefined,
        true
    )
}
