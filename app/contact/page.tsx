import Link from "next/link"
import type { Metadata } from "next"
import { MessageSquare, Phone } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BRAND, allScents } from "@/lib/scents"
import { DELIVERY_FEE, FREE_DELIVERY_FROM, kes } from "@/lib/pricing"

export const metadata: Metadata = {
  title: "Contact | Smells by Kourtney",
  description: `Call or text ${BRAND.phone} to order or ask a question.`,
}

const smsHref = BRAND.phoneHref.replace("tel:", "sms:")

const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: "How do I order?",
    a: (
      <>
        Add candles to your cart in the <Link href="/shop">shop</Link> and check out, or call {BRAND.phone} and order by
        phone.
      </>
    ),
  },
  {
    q: "How do I pay?",
    a: "Cash on delivery: pay the rider when your candles arrive. M-Pesa payments are coming soon.",
  },
  {
    q: "How much is delivery?",
    a: `Free on orders of ${kes(FREE_DELIVERY_FROM)} or more. Smaller orders cost ${kes(DELIVERY_FEE)} to deliver.`,
  },
  {
    q: "What are the candles made of?",
    a: "100% natural soy wax. Every candle is handmade and hand-poured.",
  },
  {
    q: "Which scents do you have?",
    a: `${allScents.join(", ")}.`,
  },
  {
    q: "Where's my order?",
    a: (
      <>
        Use <Link href="/track-order">Track an order</Link> with the order number from your confirmation email, or call
        us.
      </>
    ),
  },
  {
    q: "How do I get the best burn?",
    a: "The first time you light it, let the whole top melt to the edges. Trim the wick to about 5mm before each light, and burn for no more than 4 hours at a time.",
  },
]

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="container mx-auto grid gap-16 px-4 pb-24 pt-14 md:pt-20 lg:grid-cols-[1fr_1.15fr] lg:gap-24">
          <section>
            <h1 className="type-display text-foreground">Get in touch</h1>
            <p className="type-lede mt-5 max-w-[40ch] text-muted-foreground">
              Questions, orders or gift ideas: the quickest way to reach us is by phone.
            </p>

            <div className="jar-label mt-10 px-7 py-8">
              <p className="text-[0.9375rem] text-muted-foreground">Call or text</p>
              <a
                href={BRAND.phoneHref}
                className="mt-1 block font-serif text-[2.5rem] leading-tight tabular hover:text-primary"
              >
                {BRAND.phone}
              </a>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={BRAND.phoneHref}
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  Call
                </a>
                <a
                  href={smsHref}
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-foreground/25 px-6 hover:border-foreground/60"
                >
                  <MessageSquare className="h-4 w-4" aria-hidden />
                  Send a text
                </a>
              </div>
            </div>
          </section>

          <section aria-labelledby="faq-heading" className="lg:pt-3">
            <h2 id="faq-heading" className="type-heading text-foreground">
              Common questions
            </h2>
            <Accordion type="single" collapsible className="mt-6 border-t border-border">
              {faqs.map((f) => (
                <AccordionItem key={f.q} value={f.q} className="border-border">
                  <AccordionTrigger className="py-5 text-left text-base font-normal hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="max-w-[60ch] pb-5 text-[0.9375rem] leading-relaxed text-muted-foreground [&_a]:text-foreground [&_a]:underline [&_a]:decoration-primary/50 [&_a]:underline-offset-4">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
