/**
 * Authentication API Service
 */

import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'
import type { ApiResponse, AuthResponse, LoginRequest } from '../types'

const TOKEN_KEY = 'luxe-candles-admin-token'
const USER_KEY = 'luxe-candles-admin-user'

/**
 * Admin login
 */
export async function adminLogin(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.ADMIN_LOGIN,
        { email, password } as LoginRequest
    )

    if (response.success && response.data) {
        // Store token and user info
        if (typeof window !== 'undefined') {
            localStorage.setItem(TOKEN_KEY, response.data.token)
            localStorage.setItem(USER_KEY, JSON.stringify(response.data.user))
        }
        return response.data
    }

    throw new Error('Login failed')
}

/**
 * Get stored auth token
 */
export function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(TOKEN_KEY)
}

/**
 * Get stored user info
 */
export function getStoredUser() {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem(USER_KEY)
    return userStr ? JSON.parse(userStr) : null
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    return !!getAuthToken()
}

/**
 * Logout user
 */
export function logout(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
    }
}
