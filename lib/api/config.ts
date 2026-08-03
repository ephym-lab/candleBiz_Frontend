/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/v1',
    TIMEOUT: 30000, // 30 seconds
} as const

export const API_ENDPOINTS = {
    // Auth
    ADMIN_LOGIN: '/auth/admin/login',

    // Products
    PRODUCTS: '/products',
    PRODUCT_SEARCH: '/products/search',
    PRODUCT_TOP_SELLING: '/products/stats/top-selling',
    PRODUCT_BUNDLES: '/products/bundle/all/',
    PRODUCT_BY_ID: (id: string) => `/products/${id}`,
    PRODUCT_REVIEWS: (id: string) => `/products/${id}/reviews`,
    PRODUCT_BUNDLE: (id: string) => `/products/${id}/bundle`,
    PRODUCT_AVAILABILITY: (id: string) => `/products/${id}/availability`,
    PRODUCT_STOCK: (id: string) => `/products/${id}/stock`,

    // Reviews
    ADMIN_REVIEWS: '/admin/reviews',
    VERIFIED_REVIEWS: '/reviews/verified',
    REVIEW_VERIFY: (productId: string, reviewId: string) => `/products/${productId}/reviews/${reviewId}/verify`,
    REVIEW_UNVERIFY: (productId: string, reviewId: string) => `/products/${productId}/reviews/${reviewId}/unverify`,
    REVIEW_DELETE: (productId: string, reviewId: string) => `/products/${productId}/reviews/${reviewId}`,

    // Orders
    ORDERS: '/orders',
    ORDER_SEARCH: '/orders/search',
    ORDER_BY_ID: (id: string) => `/orders/${id}`,
    ORDER_TRACK: (id: string) => `/orders/${id}/track`,
    ORDER_STATUS: (id: string) => `/orders/${id}/status`,
    ORDER_CANCEL: (id: string) => `/orders/${id}/cancel`,

    // Newsletter
    NEWSLETTER_SUBSCRIBE: '/newsletter/subscribe',
    NEWSLETTER_UNSUBSCRIBE: '/newsletter/unsubscribe',
    NEWSLETTER_BROADCAST: '/newsletter/admin/broadcast',

    // Notifications
    NOTIFICATIONS: '/notifications',
    NOTIFICATIONS_READ_ALL: '/notifications/read-all',
    NOTIFICATION_MARK_READ: (id: string) => `/notifications/${id}/read`,
} as const
