import { cn } from "@/lib/utils"

interface WordmarkProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

const sizes = {
  sm: { main: "text-[1.25rem] tracking-[0.2em]", sub: "text-[0.5625rem] tracking-[0.32em]" },
  md: { main: "text-[1.625rem] tracking-[0.2em]", sub: "text-[0.625rem] tracking-[0.34em]" },
  lg: { main: "text-[2.75rem] tracking-[0.18em]", sub: "text-[0.8125rem] tracking-[0.36em]" },
}

/**
 * The Smells by Kourtney logotype, following the flier: widely spaced capitals for
 * SMELLS with a small spaced BY KOURTNEY centred beneath it. (Brand lettering,
 * so the capitals are intentional here and nowhere else.)
 */
export function Wordmark({ className, size = "md" }: WordmarkProps) {
  const s = sizes[size]
  return (
    <span className={cn("inline-flex flex-col items-center leading-none", className)}>
      <span aria-hidden className={cn("font-serif uppercase", s.main)} style={{ marginRight: "-0.2em" }}>
        Smells
      </span>
      <span aria-hidden className={cn("mt-1 font-sans font-medium uppercase", s.sub)} style={{ marginRight: "-0.34em" }}>
        by Kourtney
      </span>
      <span className="sr-only">Smells by Kourtney</span>
    </span>
  )
}
