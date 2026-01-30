"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" })
      setSubmitted(false)
    }, 3000)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-b from-secondary/50 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-serif text-4xl font-bold text-foreground md:text-5xl">Get In Touch</h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Have a question or special request? We'd love to hear from you.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-3">
              {/* Contact Info */}
              <div className="space-y-8 lg:col-span-1">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">Contact Information</h2>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    Reach out to us through any of these channels
                  </p>
                </div>

                <div className="space-y-6">
                  <Card className="border-border/50">
                    <CardContent className="flex gap-4 p-6">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Email</h3>
                        <a
                          href="mailto:hello@luxecandles.com"
                          className="mt-1 text-sm text-muted-foreground hover:text-primary"
                        >
                          hello@luxecandles.com
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50">
                    <CardContent className="flex gap-4 p-6">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Phone</h3>
                        <a href="tel:+254700000000" className="mt-1 text-sm text-muted-foreground hover:text-primary">
                          +254 700 000 000
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50">
                    <CardContent className="flex gap-4 p-6">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Location</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Nairobi, Kenya</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50">
                    <CardContent className="flex gap-4 p-6">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Business Hours</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Mon - Fri: 9AM - 6PM</p>
                        <p className="text-sm text-muted-foreground">Sat: 10AM - 4PM</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6 md:p-8">
                    <h2 className="font-serif text-2xl font-bold text-foreground">Send Us a Message</h2>
                    <p className="mt-2 text-muted-foreground">Fill out the form below and we'll get back to you soon</p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            placeholder="Your name"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            placeholder="your@email.com"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => handleChange("subject", e.target.value)}
                          placeholder="How can we help?"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => handleChange("message", e.target.value)}
                          placeholder="Tell us more about your inquiry..."
                          rows={6}
                          required
                        />
                      </div>

                      <Button type="submit" size="lg" disabled={isSubmitting || submitted} className="w-full sm:w-auto">
                        {submitted ? "Message Sent!" : isSubmitting ? "Sending..." : "Send Message"}
                      </Button>

                      {submitted && (
                        <p className="text-sm text-primary">Thank you! We'll get back to you within 24 hours.</p>
                      )}
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-center font-serif text-3xl font-bold text-foreground md:text-4xl">
                Frequently Asked Questions
              </h2>

              <div className="mt-12 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground">How long does shipping take?</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      Orders are processed within 1-2 business days and typically arrive within 3-5 business days via
                      standard shipping.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground">What are your candles made from?</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      All our candles are made from 100% natural soy wax and scented with premium essential oils. They
                      contain no harmful chemicals or synthetic fragrances.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground">Do you offer custom orders?</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      Yes! We love creating custom candles for special events and corporate gifts. Contact us to discuss
                      your requirements.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground">What is your return policy?</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      We want you to love your candles! If you're not satisfied, contact us within 7 days of delivery
                      for a full refund or exchange.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
