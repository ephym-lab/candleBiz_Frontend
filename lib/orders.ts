// mock orders data structure and types
export interface Order {
  id: string
  customerName: string
  email: string
  phone: string
  address: string
  city: string
  county: string
  items: Array<{
    productId: string
    productName: string
    quantity: number
    price: number
  }>
  subtotal: number
  shipping: number
  total: number
  paymentMethod: "mpesa" | "cash"
  mpesaPhone?: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  orderDate: string
}

// Mock orders data - in production, this would come from a database
export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customerName: "Jane Doe",
    email: "jane@example.com",
    phone: "+254712345678",
    address: "123 Main Street",
    city: "Nairobi",
    county: "Nairobi",
    items: [
      {
        productId: "1",
        productName: "Lavender Dreams",
        quantity: 2,
        price: 1200,
      },
      {
        productId: "2",
        productName: "Vanilla Bliss",
        quantity: 1,
        price: 1200,
      },
    ],
    subtotal: 3600,
    shipping: 0,
    total: 3600,
    paymentMethod: "mpesa",
    mpesaPhone: "+254712345678",
    status: "processing",
    orderDate: "2025-01-10",
  },
  {
    id: "ORD-002",
    customerName: "John Smith",
    email: "john@example.com",
    phone: "+254723456789",
    address: "456 Oak Avenue",
    city: "Mombasa",
    county: "Mombasa",
    items: [
      {
        productId: "4",
        productName: "Ocean Breeze",
        quantity: 1,
        price: 1500,
      },
    ],
    subtotal: 1500,
    shipping: 300,
    total: 1800,
    paymentMethod: "cash",
    status: "pending",
    orderDate: "2025-01-12",
  },
  {
    id: "ORD-003",
    customerName: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+254734567890",
    address: "789 Pine Road",
    city: "Kisumu",
    county: "Kisumu",
    items: [
      {
        productId: "5",
        productName: "Rose Garden",
        quantity: 3,
        price: 1500,
      },
    ],
    subtotal: 4500,
    shipping: 0,
    total: 4500,
    paymentMethod: "mpesa",
    mpesaPhone: "+254734567890",
    status: "delivered",
    orderDate: "2025-01-08",
  },
]
