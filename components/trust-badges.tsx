import { Leaf, Hand, Truck, ShieldCheck, Flower2, Phone } from "lucide-react"
import { trustBadges } from "@/lib/testimonials"

const iconMap = {
    Leaf,
    Heart: Hand,
    Truck,
    Shield: ShieldCheck,
    Flower: Flower2,
    Phone,
}

/** A quiet strip of facts that sits under the hero. No boxes, no icon bubbles. */
export function TrustBadges() {
    return (
        <section aria-label="Why people buy from us" className="border-y border-border bg-secondary/40">
            <ul className="container mx-auto grid grid-cols-1 gap-x-8 gap-y-6 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
                {trustBadges.map((badge) => {
                    const Icon = iconMap[badge.icon as keyof typeof iconMap] ?? Leaf
                    return (
                        <li key={badge.id} className="flex gap-3.5">
                            <Icon className="mt-1 h-5 w-5 shrink-0 text-primary" strokeWidth={1.5} aria-hidden />
                            <div>
                                <p className="font-serif text-lg leading-snug text-foreground">{badge.title}</p>
                                <p className="mt-0.5 text-[0.9375rem] text-muted-foreground">{badge.description}</p>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}
