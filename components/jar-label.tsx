import type React from "react"
import { cn } from "@/lib/utils"

/** Longest burn time in the range; the meter reads against it. */
const MAX_BURN_HOURS = 60

interface BurnMeterProps {
  hours: number
  className?: string
}

/** A wick-thin bar showing how long a candle burns relative to the longest in the range. */
export function BurnMeter({ hours, className }: BurnMeterProps) {
  const pct = Math.max(8, Math.min(100, (hours / MAX_BURN_HOURS) * 100))
  return (
    <div className={cn("space-y-1.5", className)}>
      <div
        className="relative h-[3px] w-full rounded-full bg-foreground/10"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={MAX_BURN_HOURS}
        aria-valuenow={hours}
        aria-label={`Burns for about ${hours} hours`}
      >
        <div className="absolute inset-y-0 left-0 rounded-full bg-primary" style={{ width: `${pct}%` }} />
        <span
          className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_0_3px_color-mix(in_oklch,var(--primary)_20%,transparent)]"
          style={{ left: `${pct}%` }}
          aria-hidden
        />
      </div>
      <p className="text-[0.8125rem] text-muted-foreground tabular">About {hours} hours of burn</p>
    </div>
  )
}

interface JarLabelProps {
  name: string
  scent?: string
  size?: string
  burnTime?: number
  price?: number
  as?: "h1" | "h2" | "h3" | "p"
  className?: string
  nameClassName?: string
  children?: React.ReactNode
}

/**
 * The jar label: the storefront's one signature device. It is printed like the label on
 * a candle jar, with a double rule, the name set in Young Serif and the facts that
 * matter (weight, burn time, price) set beneath it.
 */
export function JarLabel({
  name,
  scent,
  size,
  burnTime,
  price,
  as: Name = "h3",
  className,
  nameClassName,
  children,
}: JarLabelProps) {
  return (
    <div className={cn("jar-label px-6 py-6 sm:px-7", className)}>
      <Name className={cn("font-serif text-[1.625rem] leading-tight text-foreground text-balance", nameClassName)}>
        {name}
      </Name>
      {scent && <p className="mt-1 text-[0.9375rem] text-muted-foreground">{scent}</p>}

      {(size || price !== undefined) && (
        <dl className="mt-5 flex items-end justify-between gap-4 border-t border-foreground/15 pt-4">
          {size && (
            <div>
              <dt className="sr-only">Size</dt>
              <dd className="text-[0.9375rem] text-foreground">{size}</dd>
            </div>
          )}
          {price !== undefined && (
            <div className="text-right">
              <dt className="sr-only">Price</dt>
              <dd className="font-serif text-xl text-foreground tabular">KES {price.toLocaleString()}</dd>
            </div>
          )}
        </dl>
      )}

      {burnTime ? <BurnMeter hours={burnTime} className="mt-4" /> : null}
      {children}
    </div>
  )
}
