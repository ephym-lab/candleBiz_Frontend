export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  images?: string[] // Multiple images for gallery
  scent: string
  scentDescription?: string // Detailed scent profile
  size: string
  stock: number
  rating: number
  reviews: Review[]
  burnTime?: number // Burn time in hours
  careInstructions?: string[]
  ingredients?: string[]
  relatedProducts?: string[] // IDs of related products
  bundleOffer?: {
    quantity: number
    discount: number
    description: string
  }
}

export interface Review {
  id: string
  author: string
  rating: number
  comment: string
  date: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface OrderFormData {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  paymentMethod: "mpesa" | "cash"
  mpesaPhone?: string
}
