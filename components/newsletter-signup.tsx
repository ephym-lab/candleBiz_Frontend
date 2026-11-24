"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check } from "lucide-react"
import { toast } from "sonner"

export function NewsletterSignup() {
    const [email, setEmail] = useState("")
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email) {
            toast.error("Enter your email address to subscribe.")
            return
        }

        setIsLoading(true)
        try {
            const { subscribe } = await import("@/lib/api/services/newsletter")
            await subscribe(email)
            setIsSubscribed(true)
            toast.success("Subscribed. Look out for a welcome email.")
            setEmail("")
        } catch (error) {
            toast.error("Couldn't subscribe that address. Check it and try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className="bg-primary text-primary-foreground">
            <div className="container mx-auto grid items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-20">
                <div>
                    <h2 className="type-title">Hear about new scents first</h2>
                    <p className="mt-3 max-w-[44ch] text-primary-foreground/80">
                        One email when a new candle is poured, plus the occasional subscriber-only offer.
                    </p>
                </div>

                {isSubscribed ? (
                    <p className="flex items-center gap-3 text-lg" role="status">
                        <Check className="h-5 w-5" aria-hidden />
                        You&apos;re subscribed. Check your inbox for a welcome email.
                    </p>
                ) : (
                    <form onSubmit={handleSubmit} className="w-full">
                        <label htmlFor="newsletter-email" className="sr-only">
                            Email address
                        </label>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Input
                                id="newsletter-email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 flex-1 rounded-full border-primary-foreground/30 bg-primary-foreground/10 px-5 text-primary-foreground placeholder:text-primary-foreground/55 focus-visible:border-primary-foreground"
                                disabled={isLoading}
                            />
                            <Button
                                type="submit"
                                size="lg"
                                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                                disabled={isLoading}
                            >
                                {isLoading ? "Subscribing…" : "Subscribe"}
                            </Button>
                        </div>
                        <p className="mt-3 text-[0.8125rem] text-primary-foreground/70">
                            Unsubscribe from any email in one click.
                        </p>
                    </form>
                )}
            </div>
        </section>
    )
}
