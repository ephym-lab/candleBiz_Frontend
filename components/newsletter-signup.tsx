"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

export function NewsletterSignup() {
    const [email, setEmail] = useState("")
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email) {
            toast.error("Please enter your email address")
            return
        }

        setIsLoading(true)

        try {
            const { subscribe } = await import("@/lib/api/services/newsletter")
            await subscribe(email)
            setIsSubscribed(true)
            toast.success("Successfully subscribed to our newsletter!")
            setEmail("")

            // Reset after 3 seconds
            setTimeout(() => setIsSubscribed(false), 3000)
        } catch (error) {
            toast.error("Failed to subscribe. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className="py-16 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4">
                <Card className="max-w-2xl mx-auto bg-primary-foreground/10 border-primary-foreground/20">
                    <CardContent className="p-8 md:p-12">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-foreground/20 mb-4">
                                <Mail className="h-8 w-8" />
                            </div>
                            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2">
                                Join Our Newsletter
                            </h2>
                            <p className="text-primary-foreground/80">
                                Get exclusive offers, new product launches, and candle care tips delivered to your inbox
                            </p>
                        </div>

                        {isSubscribed ? (
                            <div className="flex flex-col items-center gap-4 py-4">
                                <CheckCircle2 className="h-16 w-16 text-green-400" />
                                <p className="text-lg font-medium">Thank you for subscribing!</p>
                                <p className="text-sm text-primary-foreground/80">
                                    Check your inbox for a welcome email
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/50"
                                    disabled={isLoading}
                                />
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Subscribing..." : "Subscribe"}
                                </Button>
                            </form>
                        )}

                        <p className="text-xs text-center mt-4 text-primary-foreground/60">
                            We respect your privacy. Unsubscribe at any time.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
