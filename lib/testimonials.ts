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
        title: "100% natural soy wax",
        description: "In every candle, whatever the scent",
    },
    {
        id: "2",
        icon: "Heart",
        title: "Handmade, hand-poured",
        description: "Each jar is poured and finished by hand",
    },
    {
        id: "3",
        icon: "Flower",
        title: "Ten scents",
        description: "Floral, gourmand, woodsy and fruity",
    },
    {
        id: "4",
        icon: "Phone",
        title: "Call to order",
        description: "0729 302 230",
    },
]
