/**
 * API Response Types
 * TypeScript interfaces matching backend API responses
 */

// Generic API Response Wrapper
export interface ApiResponse<T> {
    success: boolean
    data: T
    message?: string | null
}

// Pagination
export interface PaginationMeta {
    page: number
    limit: number
    total: number
    totalPages: number
}

export interface PaginatedResponse<T> {
    products?: T[]
    items?: T[]
    pagination: PaginationMeta
}

// Product Types
export interface BundleOffer {
    quantity: number
    discount: number
    description: string
}

export interface Product {
    id: string
    name: string
    description: string
    price: number
    image: string
    scent: string
    size: string
    stock: number
    rating: number
    scent_description?: string
    images?: string[]
    burn_time?: number
    care_instructions?: string[]
    ingredients?: string[]
    related_products?: string[]
    bundle_offer?: BundleOffer
    created_at: string
    updated_at: string
}

export interface TopSellingProduct extends Product {
    total_sold: number
    revenue: number
}

export interface ProductAvailability {
    available: boolean
    stock: number
}

// Order Types
export interface OrderItem {
    productId: string
    productName?: string
    quantity: number
    price?: number
}

export interface Order {
    id: string
    customerName: string
    email: string
    phone: string
    address: string
    city: string
    county: string
    items: OrderItem[]
    subtotal: number
    shipping: number
    total: number
    paymentMethod: 'mpesa' | 'cash'
    mpesaPhone?: string
    mpesaTransactionId?: string
    status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    orderDate: string
    createdAt: string
    updatedAt: string
}

export interface AdminOrdersResponse {
    orders: Order[]
    pagination?: PaginationMeta
}

// Review Types
export interface Review {
    id: string
    product_id: string
    author: string
    email?: string
    rating: number
    comment: string
    date: string
    verified: boolean
    created_at: string
}

// Auth Types
export interface User {
    id: string
    email: string
    role: string
}

export interface AuthResponse {
    token: string
    user: User
}

// Request Types
export interface LoginRequest {
    email: string
    password: string
}

export interface CreateOrderRequest {
    customerName: string
    email: string
    phone: string
    address: string
    city: string
    county: string
    items: OrderItem[]
    paymentMethod: 'mpesa' | 'cash'
    mpesaPhone?: string
}

export interface CreateReviewRequest {
    author: string
    email?: string
    rating: number
    comment: string
}

export interface AdminReviewsResponse {
    reviews: Review[]
    count: number
    verified_count: number
    unverified_count: number
    pagination?: PaginationMeta
}

export interface VerifiedReview {
    id: string
    productId: string
    productName: string
    customerName: string
    email: string | null
    rating: number
    comment: string
    verified: boolean
    createdAt: string
}

export interface VerifiedReviewsResponse {
    reviews: VerifiedReview[]
    count: number
}

export interface UpdateProductRequest {
    name?: string
    description?: string
    price?: number
    image?: string
    scent?: string
    size?: string
    stock?: number
    scent_description?: string
    images?: string[]
    burn_time?: number
    care_instructions?: string[]
    ingredients?: string[]
    related_products?: string[]
    bundle_offer?: BundleOffer
}

export interface UpdateOrderRequest {
    customerName?: string
    phone?: string
    address?: string
    city?: string
    county?: string
}

export interface UpdateOrderStatusRequest {
    status: Order['status']
    mpesaTransactionId?: string
}

// Filter Types
export interface ProductFilters {
    scent?: string
    size?: string
    min_price?: number
    max_price?: number
    in_stock?: boolean
    page?: number
    limit?: number
}

// Notification Types
export type NotificationType =
    | 'order_created'
    | 'order_updated'
    | 'order_cancelled'
    | 'low_stock'
    | 'new_review'
    | 'newsletter_signup'
    | string

export type NotificationPriority = 'low' | 'medium' | 'high'

export interface Notification {
    id: string
    title: string
    message: string
    notification_type: NotificationType
    priority: NotificationPriority
    related_entity?: string | null
    related_id?: string | null
    is_read: boolean
    read_at: string | null
    created_at: string
    updated_at: string
}

export interface NotificationMeta {
    total: number
    skip: number
    limit: number
}

export interface NotificationListResponse {
    success: boolean
    data: Notification[]
    meta: NotificationMeta
}

export interface MarkReadResponse {
    success: boolean
    message: string
    data: Notification
}

export interface MarkAllReadResponse {
    success: boolean
    message: string
    data: { count: number }
}

// Error Types
export interface ApiError {
    success: false
    message: string
    errors?: Record<string, string[]>
}
