"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import Image from "next/image"
import { testimonials } from "@/lib/testimonials"

export function TestimonialsSection() {
    return (
        <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
                        What Our Customers Say
                    </h2>
                    <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                        Don't just take our word for it - hear from our satisfied customers
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial) => (
                        <Card key={testimonial.id} className="border-2 hover:border-primary/50 transition-colors">
                            <CardContent className="p-6">
                                {/* Rating */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                                    ))}
                                </div>

                                {/* Content */}
                                <p className="text-muted-foreground leading-relaxed mb-6 italic">
                                    "{testimonial.content}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-4">
                                    <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted">
                                        <Image
                                            src={testimonial.avatar || "/placeholder.svg"}
                                            alt={testimonial.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
