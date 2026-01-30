// Testimonials data

export interface Testimonial {
    id: string
    name: string
    role: string
    avatar: string
    content: string
    rating: number
}

export const testimonials: Testimonial[] = [
    {
        id: "1",
        name: "Sarah Mitchell",
        role: "Interior Designer",
        avatar: "/testimonial-sarah.jpg",
        content:
            "These candles have transformed my home! The lavender scent is absolutely divine and the quality is unmatched. I've recommended them to all my clients.",
        rating: 5,
    },
    {
        id: "2",
        name: "John Anderson",
        role: "Restaurant Owner",
        avatar: "/testimonial-john.jpg",
        content:
            "We use these candles in our restaurant to create the perfect ambiance. Our customers always ask where we get them. The burn time is excellent!",
        rating: 5,
    },
    {
        id: "3",
        name: "Emma Thompson",
        role: "Yoga Instructor",
        avatar: "/testimonial-emma.jpg",
        content:
            "Perfect for my yoga studio! The natural soy wax and calming scents help create a peaceful environment. My students love them.",
        rating: 5,
    },
]

// Trust badges data
export interface TrustBadge {
    id: string
    icon: string
    title: string
    description: string
}

export const trustBadges: TrustBadge[] = [
    {
        id: "1",
        icon: "Leaf",
        title: "100% Natural",
        description: "Made with pure soy wax and essential oils",
    },
    {
        id: "2",
        icon: "Heart",
        title: "Handcrafted",
        description: "Each candle is carefully made by hand",
    },
    {
        id: "3",
        icon: "Truck",
        title: "Free Shipping",
        description: "On orders over KES 3,000",
    },
    {
        id: "4",
        icon: "Shield",
        title: "Quality Guaranteed",
        description: "30-day money-back guarantee",
    },
]
