"use client"

import { Leaf, Heart, Truck, Shield } from "lucide-react"
import { trustBadges } from "@/lib/testimonials"

const iconMap = {
    Leaf,
    Heart,
    Truck,
    Shield,
}

export function TrustBadges() {
    return (
        <section className="py-12 border-y border-border bg-background">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                    {trustBadges.map((badge) => {
                        const Icon = iconMap[badge.icon as keyof typeof iconMap]
                        return (
                            <div key={badge.id} className="flex flex-col items-center text-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <Icon className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground text-sm">{badge.title}</h3>
                                    <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
