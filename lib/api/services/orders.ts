/**
 * Orders API Service
 */

import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'
import type {
    ApiResponse,
    Order,
    CreateOrderRequest,
    UpdateOrderRequest,
    UpdateOrderStatusRequest,
    AdminOrdersResponse,
} from '../types'

/**
 * Create new order
 */
export async function createOrder(orderData: CreateOrderRequest) {
    const response = await apiClient.post<ApiResponse<Order>>(
        API_ENDPOINTS.ORDERS,
        orderData
    )
    return response.data
}

/**
 * Get all orders or filter by email with optional pagination
 */
export async function getOrders(email?: string, page: number = 1, limit: number = 10) {
    const params = new URLSearchParams()
    if (email) params.append('email', email)
    params.append('page', page.toString())
    params.append('limit', limit.toString())

    const response = await apiClient.get<ApiResponse<AdminOrdersResponse>>(
        `${API_ENDPOINTS.ORDERS}?${params.toString()}`
    )
    return response.data
}

/**
 * Search orders by query
 */
export async function searchOrders(query: string, page: number = 1, limit: number = 10) {
    const params = new URLSearchParams({ 
        q: query,
        page: page.toString(),
        limit: limit.toString()
    })
    const response = await apiClient.get<ApiResponse<AdminOrdersResponse>>(
        `${API_ENDPOINTS.ORDER_SEARCH}?${params.toString()}`
    )
    return response.data
}

/**
 * Get single order by ID
 */
export async function getOrder(id: string) {
    const response = await apiClient.get<ApiResponse<Order>>(
        API_ENDPOINTS.ORDER_BY_ID(id)
    )
    return response.data
}

/**
 * Track order
 */
export async function trackOrder(id: string) {
    const response = await apiClient.get<ApiResponse<Order>>(
        API_ENDPOINTS.ORDER_TRACK(id)
    )
    return response.data
}

/**
 * Update order details
 */
export async function updateOrder(id: string, orderData: UpdateOrderRequest) {
    const response = await apiClient.patch<ApiResponse<Order>>(
        API_ENDPOINTS.ORDER_BY_ID(id),
        orderData
    )
    return response.data
}

/**
 * Update order status
 */
export async function updateOrderStatus(id: string, statusData: UpdateOrderStatusRequest) {
    const response = await apiClient.patch<ApiResponse<Order>>(
        API_ENDPOINTS.ORDER_STATUS(id),
        statusData
    )
    return response.data
}

/**
 * Cancel order
 */
export async function cancelOrder(id: string) {
    const response = await apiClient.patch<ApiResponse<{ message: string }>>(
        API_ENDPOINTS.ORDER_CANCEL(id)
    )
    return response
}
