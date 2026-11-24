import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Order } from "@/lib/api/types"

/**
 * An order's journey is a real sequence, so it's shown as numbered stages.
 * "paid" sits inside the first stage: with cash on delivery most orders skip it.
 */
const stages = [
  { id: "placed", label: "Order placed", note: "We've got your order and will call to confirm." },
  { id: "processing", label: "Being prepared", note: "Your candles are being wrapped." },
  { id: "shipped", label: "On its way", note: "With the rider, heading to you." },
  { id: "delivered", label: "Delivered", note: "Enjoy your candles." },
] as const

const stageIndex: Record<Order["status"], number> = {
  pending: 0,
  paid: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  cancelled: -1,
}

export function OrderProgress({ status }: { status: Order["status"] }) {
  if (status === "cancelled") {
    return (
      <p className="rounded-lg bg-destructive/10 px-4 py-3 text-[0.9375rem] text-destructive">
        This order was cancelled. If that&apos;s a surprise, call us and we&apos;ll sort it out.
      </p>
    )
  }

  const current = stageIndex[status] ?? 0

  return (
    <ol className="grid gap-0 sm:grid-cols-4">
      {stages.map((stage, i) => {
        const done = i < current
        const active = i === current
        return (
          <li
            key={stage.id}
            aria-current={active ? "step" : undefined}
            className="relative flex gap-4 pb-6 sm:flex-col sm:gap-3 sm:pb-0 sm:pr-4"
          >
            {/* connector */}
            {i < stages.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[0.9375rem] top-8 h-[calc(100%-2rem)] w-[2px] sm:left-8 sm:top-[0.9375rem] sm:h-[2px] sm:w-[calc(100%-2rem)]",
                  done ? "bg-primary" : "bg-foreground/12",
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[0.875rem] tabular",
                done && "border-primary bg-primary text-primary-foreground",
                active && "border-primary bg-background text-primary ring-4 ring-primary/15",
                !done && !active && "border-foreground/20 bg-background text-muted-foreground",
              )}
            >
              {done ? <Check className="h-4 w-4" aria-hidden /> : i + 1}
            </span>
            <span>
              <span className={cn("block text-[0.9375rem]", active || done ? "text-foreground" : "text-muted-foreground")}>
                {stage.label}
                {done && <span className="sr-only"> (done)</span>}
                {active && <span className="sr-only"> (current)</span>}
              </span>
              {active && <span className="mt-0.5 block text-[0.8125rem] text-muted-foreground">{stage.note}</span>}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
