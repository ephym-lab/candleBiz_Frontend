// Analytics data for admin dashboard

export interface DailySales {
    date: string
    revenue: number
    orders: number
}

export interface TopProduct {
    id: string
    name: string
    sales: number
    revenue: number
}

export interface MonthlyStats {
    month: string
    revenue: number
    orders: number
    customers: number
}

// Last 30 days of sales data
export const dailySalesData: DailySales[] = [
    { date: "2024-01-01", revenue: 12400, orders: 8 },
    { date: "2024-01-02", revenue: 15600, orders: 11 },
    { date: "2024-01-03", revenue: 9800, orders: 6 },
    { date: "2024-01-04", revenue: 18200, orders: 13 },
    { date: "2024-01-05", revenue: 14500, orders: 10 },
    { date: "2024-01-06", revenue: 11200, orders: 7 },
    { date: "2024-01-07", revenue: 16800, orders: 12 },
    { date: "2024-01-08", revenue: 13400, orders: 9 },
    { date: "2024-01-09", revenue: 19600, orders: 14 },
    { date: "2024-01-10", revenue: 17200, orders: 12 },
    { date: "2024-01-11", revenue: 14800, orders: 10 },
    { date: "2024-01-12", revenue: 12600, orders: 8 },
    { date: "2024-01-13", revenue: 16400, orders: 11 },
    { date: "2024-01-14", revenue: 18900, orders: 13 },
    { date: "2024-01-15", revenue: 15300, orders: 11 },
    { date: "2024-01-16", revenue: 13700, orders: 9 },
    { date: "2024-01-17", revenue: 17500, orders: 12 },
    { date: "2024-01-18", revenue: 14200, orders: 10 },
    { date: "2024-01-19", revenue: 16900, orders: 12 },
    { date: "2024-01-20", revenue: 19200, orders: 14 },
    { date: "2024-01-21", revenue: 15800, orders: 11 },
    { date: "2024-01-22", revenue: 13200, orders: 9 },
    { date: "2024-01-23", revenue: 17800, orders: 13 },
    { date: "2024-01-24", revenue: 16100, orders: 11 },
    { date: "2024-01-25", revenue: 14600, orders: 10 },
    { date: "2024-01-26", revenue: 18400, orders: 13 },
    { date: "2024-01-27", revenue: 15900, orders: 11 },
    { date: "2024-01-28", revenue: 17300, orders: 12 },
    { date: "2024-01-29", revenue: 19800, orders: 14 },
    { date: "2024-01-30", revenue: 16500, orders: 12 },
]

// Last 6 months of data
export const monthlySalesData: MonthlyStats[] = [
    { month: "Aug", revenue: 342000, orders: 234, customers: 189 },
    { month: "Sep", revenue: 398000, orders: 267, customers: 215 },
    { month: "Oct", revenue: 456000, orders: 312, customers: 248 },
    { month: "Nov", revenue: 512000, orders: 348, customers: 276 },
    { month: "Dec", revenue: 589000, orders: 402, customers: 318 },
    { month: "Jan", revenue: 478000, orders: 326, customers: 259 },
]

// Top selling products
export const topProducts: TopProduct[] = [
    { id: "1", name: "Lavender Dreams", sales: 156, revenue: 187200 },
    { id: "2", name: "Vanilla Bliss", sales: 142, revenue: 170400 },
    { id: "3", name: "Ocean Breeze", sales: 128, revenue: 153600 },
    { id: "4", name: "Cinnamon Spice", sales: 98, revenue: 117600 },
    { id: "5", name: "Rose Garden", sales: 87, revenue: 104400 },
]

// Revenue by category
export const revenueByCategory = [
    { name: "Lavender", value: 187200, percentage: 28 },
    { name: "Vanilla", value: 170400, percentage: 26 },
    { name: "Citrus", value: 153600, percentage: 23 },
    { name: "Spice", value: 117600, percentage: 18 },
    { name: "Floral", value: 33200, percentage: 5 },
]

// Order status distribution
export const orderStatusData = [
    { status: "Delivered", count: 245, percentage: 68 },
    { status: "Processing", count: 78, percentage: 22 },
    { status: "Shipped", count: 28, percentage: 8 },
    { status: "Cancelled", count: 9, percentage: 2 },
]

// Calculate growth percentages
export const calculateGrowth = () => {
    const currentMonth = monthlySalesData[monthlySalesData.length - 1]
    const previousMonth = monthlySalesData[monthlySalesData.length - 2]

    return {
        revenueGrowth: ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100,
        ordersGrowth: ((currentMonth.orders - previousMonth.orders) / previousMonth.orders) * 100,
        customersGrowth: ((currentMonth.customers - previousMonth.customers) / previousMonth.customers) * 100,
    }
}
