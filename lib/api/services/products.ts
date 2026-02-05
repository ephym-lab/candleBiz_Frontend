/**
 * Products API Service
 */

import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'
import type {
    ApiResponse,
    Product,
    TopSellingProduct,
    ProductAvailability,
    BundleOffer,
    PaginatedResponse,
    ProductFilters,
    UpdateProductRequest,
} from '../types'

/**
 * Get all products with optional filters
 */
export async function getProducts(filters?: ProductFilters) {
    const params = new URLSearchParams()

    if (filters) {
        if (filters.scent) params.append('scent', filters.scent)
        if (filters.size) params.append('size', filters.size)
        if (filters.min_price) params.append('min_price', filters.min_price.toString())
        if (filters.max_price) params.append('max_price', filters.max_price.toString())
        if (filters.in_stock !== undefined) params.append('in_stock', filters.in_stock.toString())
        if (filters.page) params.append('page', filters.page.toString())
        if (filters.limit) params.append('limit', filters.limit.toString())
    }

    const query = params.toString()
    const endpoint = query ? `${API_ENDPOINTS.PRODUCTS}?${query}` : API_ENDPOINTS.PRODUCTS

    const response = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>(endpoint)
    return response.data
}

/**
 * Search products by query
 */
export async function searchProducts(query: string, page: number = 1, limit: number = 20) {
    const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        limit: limit.toString(),
    })

    const response = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>(
        `${API_ENDPOINTS.PRODUCT_SEARCH}?${params.toString()}`
    )
    return response.data
}

/**
 * Get top selling products
 */
export async function getTopSellingProducts(limit: number = 10) {
    const params = new URLSearchParams({ limit: limit.toString() })
    const response = await apiClient.get<ApiResponse<TopSellingProduct[]>>(
        `${API_ENDPOINTS.PRODUCT_TOP_SELLING}?${params.toString()}`
    )
    return response.data
}

/**
 * Get single product by ID
 */
export async function getProduct(id: string) {
    const response = await apiClient.get<ApiResponse<Product>>(
        API_ENDPOINTS.PRODUCT_BY_ID(id)
    )
    return response.data
}

/**
 * Get all products with bundle offers
 */
export async function getBundleProducts() {
    const response = await apiClient.get<ApiResponse<Product[]>>(
        API_ENDPOINTS.PRODUCT_BUNDLES
    )
    return response.data
}

/**
 * Get product bundle offer
 */
export async function getBundleOffer(productId: string) {
    const response = await apiClient.get<ApiResponse<BundleOffer>>(
        API_ENDPOINTS.PRODUCT_BUNDLE(productId)
    )
    return response.data
}

/**
 * Check product availability
 */
export async function checkAvailability(productId: string) {
    const response = await apiClient.get<ApiResponse<ProductAvailability>>(
        API_ENDPOINTS.PRODUCT_AVAILABILITY(productId)
    )
    return response.data
}

/**
 * Create new product (Admin only)
 */
export async function createProduct(productData: UpdateProductRequest, imageFile?: File, additionalImages?: File[]) {
    const formData = new FormData()

    // Required fields
    if (productData.name) formData.append('name', productData.name)
    if (productData.description) formData.append('description', productData.description)
    if (productData.price !== undefined) formData.append('price', productData.price.toString())
    if (productData.scent) formData.append('scent', productData.scent)
    if (productData.size) formData.append('size', productData.size)
    if (productData.stock !== undefined) formData.append('stock', productData.stock.toString())

    // Main image file (required)
    if (imageFile) {
        formData.append('image', imageFile)
    }

    // Additional images (optional, max 2)
    if (additionalImages && additionalImages.length > 0) {
        additionalImages.forEach((file) => {
            formData.append('additional_images', file)
        })
    }

    // Optional fields
    if (productData.scent_description) formData.append('scent_description', productData.scent_description)
    if (productData.burn_time !== undefined) formData.append('burn_time', productData.burn_time.toString())

    if (productData.care_instructions && productData.care_instructions.length > 0) {
        formData.append('care_instructions', JSON.stringify(productData.care_instructions))
    }

    if (productData.ingredients && productData.ingredients.length > 0) {
        formData.append('ingredients', JSON.stringify(productData.ingredients))
    }

    if (productData.related_products && productData.related_products.length > 0) {
        formData.append('related_products', JSON.stringify(productData.related_products))
    }

    if (productData.bundle_offer) {
        formData.append('bundle_offer', JSON.stringify(productData.bundle_offer))
    }

    const response = await apiClient.postFormData<ApiResponse<Product>>(
        API_ENDPOINTS.PRODUCTS,
        formData,
        true // Include auth
    )
    return response.data
}

/**
 * Update product (Admin only)
 */
export async function updateProduct(id: string, productData: UpdateProductRequest, imageFile?: File, additionalImages?: File[]) {
    const formData = new FormData()

    // Only append fields that are provided
    if (productData.name) formData.append('name', productData.name)
    if (productData.description) formData.append('description', productData.description)
    if (productData.price !== undefined) formData.append('price', productData.price.toString())
    if (productData.scent) formData.append('scent', productData.scent)
    if (productData.size) formData.append('size', productData.size)
    if (productData.stock !== undefined) formData.append('stock', productData.stock.toString())

    // Main image file (optional for update)
    if (imageFile) {
        formData.append('image', imageFile)
    }

    // Additional images (optional, max 2)
    if (additionalImages && additionalImages.length > 0) {
        additionalImages.forEach((file) => {
            formData.append('additional_images', file)
        })
    }

    // Optional fields
    if (productData.scent_description) formData.append('scent_description', productData.scent_description)
    if (productData.burn_time !== undefined) formData.append('burn_time', productData.burn_time.toString())

    if (productData.care_instructions && productData.care_instructions.length > 0) {
        formData.append('care_instructions', JSON.stringify(productData.care_instructions))
    }

    if (productData.ingredients && productData.ingredients.length > 0) {
        formData.append('ingredients', JSON.stringify(productData.ingredients))
    }

    if (productData.related_products && productData.related_products.length > 0) {
        formData.append('related_products', JSON.stringify(productData.related_products))
    }

    if (productData.bundle_offer) {
        formData.append('bundle_offer', JSON.stringify(productData.bundle_offer))
    }

    const response = await apiClient.patchFormData<ApiResponse<Product>>(
        API_ENDPOINTS.PRODUCT_BY_ID(id),
        formData,
        true // Include auth
    )
    return response.data
}


/**
 * Update product stock (Admin only)
 */
export async function updateStock(id: string, stock: number) {
    const response = await apiClient.patch<ApiResponse<Product>>(
        API_ENDPOINTS.PRODUCT_STOCK(id),
        { stock },
        true // Include auth
    )
    return response.data
}

/**
 * Delete product (Admin only)
 */
export async function deleteProduct(id: string) {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(
        API_ENDPOINTS.PRODUCT_BY_ID(id),
        true // Include auth
    )
    return response
}
