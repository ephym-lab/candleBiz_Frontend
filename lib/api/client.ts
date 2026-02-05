/**
 * API Client
 * Centralized HTTP client with error handling and authentication
 */

import { API_CONFIG } from './config'
import type { ApiResponse, ApiError } from './types'

class ApiClient {
    private baseURL: string
    private timeout: number

    constructor() {
        this.baseURL = API_CONFIG.BASE_URL
        this.timeout = API_CONFIG.TIMEOUT
    }

    /**
     * Get authentication token from localStorage
     */
    private getAuthToken(): string | null {
        if (typeof window === 'undefined') return null
        return localStorage.getItem('luxe-candles-admin-token')
    }

    /**
     * Build headers for request
     */
    private buildHeaders(includeAuth: boolean = false): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        }

        if (includeAuth) {
            const token = this.getAuthToken()
            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }
        }

        return headers
    }

    /**
     * Handle API response
     */
    private async handleResponse<T>(response: Response): Promise<T> {
        const contentType = response.headers.get('content-type')
        const isJson = contentType?.includes('application/json')

        if (!response.ok) {
            if (isJson) {
                const error: any = await response.json()

                // Log the full error response for debugging
                console.error('Backend Error Response:', JSON.stringify(error, null, 2))
                console.error('Response Status:', response.status)

                // Handle FastAPI validation errors (422) with detail array
                if (response.status === 422 && error.detail && Array.isArray(error.detail)) {
                    const errorMessages = error.detail
                        .map((err: any) => `${err.loc?.join('.') || 'field'}: ${err.msg}`)
                        .join('\n')
                    throw new Error(`Validation Error:\n${errorMessages}`)
                }

                // Handle validation errors with errors object
                if (error.errors) {
                    const errorMessages = Object.entries(error.errors)
                        .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
                        .join('\n')
                    throw new Error(`Validation Error:\n${errorMessages}`)
                }

                throw new Error(error.message || error.detail || 'An error occurred')
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        if (isJson) {
            return response.json()
        }

        return {} as T
    }

    /**
     * Make HTTP request with timeout
     */
    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
        includeAuth: boolean = false
    ): Promise<T> {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.timeout)

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...options,
                headers: this.buildHeaders(includeAuth),
                signal: controller.signal,
            })

            clearTimeout(timeoutId)
            return this.handleResponse<T>(response)
        } catch (error) {
            clearTimeout(timeoutId)

            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    throw new Error('Request timeout')
                }
                throw error
            }

            throw new Error('An unexpected error occurred')
        }
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string, includeAuth: boolean = false): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' }, includeAuth)
    }

    /**
     * POST request
     */
    async post<T>(
        endpoint: string,
        data?: unknown,
        includeAuth: boolean = false
    ): Promise<T> {
        return this.request<T>(
            endpoint,
            {
                method: 'POST',
                body: data ? JSON.stringify(data) : undefined,
            },
            includeAuth
        )
    }

    /**
     * POST request with multipart/form-data (for file uploads)
     */
    async postFormData<T>(
        endpoint: string,
        formData: FormData,
        includeAuth: boolean = false
    ): Promise<T> {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.timeout)

        try {
            const headers: HeadersInit = {}

            if (includeAuth) {
                const token = this.getAuthToken()
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`
                }
            }

            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers,
                body: formData,
                signal: controller.signal,
            })

            clearTimeout(timeoutId)
            return this.handleResponse<T>(response)
        } catch (error) {
            clearTimeout(timeoutId)

            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    throw new Error('Request timeout')
                }
                throw error
            }

            throw new Error('An unexpected error occurred')
        }
    }

    /**
     * PATCH request
     */
    async patch<T>(
        endpoint: string,
        data?: unknown,
        includeAuth: boolean = false
    ): Promise<T> {
        return this.request<T>(
            endpoint,
            {
                method: 'PATCH',
                body: data ? JSON.stringify(data) : undefined,
            },
            includeAuth
        )
    }

    /**
     * PATCH request with multipart/form-data (for file uploads)
     */
    async patchFormData<T>(
        endpoint: string,
        formData: FormData,
        includeAuth: boolean = false
    ): Promise<T> {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.timeout)

        try {
            const headers: HeadersInit = {}

            if (includeAuth) {
                const token = this.getAuthToken()
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`
                }
            }

            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'PATCH',
                headers,
                body: formData,
                signal: controller.signal,
            })

            clearTimeout(timeoutId)
            return this.handleResponse<T>(response)
        } catch (error) {
            clearTimeout(timeoutId)

            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    throw new Error('Request timeout')
                }
                throw error
            }

            throw new Error('An unexpected error occurred')
        }
    }


    /**
     * DELETE request
     */
    async delete<T>(endpoint: string, includeAuth: boolean = false): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' }, includeAuth)
    }
}

// Export singleton instance
export const apiClient = new ApiClient()
