/**
 * The scent range, as printed on the Smells by Kourtney flier.
 * Products store a single scent (e.g. "jasmine"); families group them for browsing.
 */

export const BRAND = {
  name: "Smells by Kourtney",
  phone: "0729 302 230",
  phoneHref: "tel:+254729302230",
  tagline: "When life gives you darkness, light a candle",
} as const

export interface ScentFamily {
  id: "floral" | "gourmand" | "woodsy" | "fruity"
  name: string
  scents: string[]
  note: string
  image: string
}

export const scentFamilies: ScentFamily[] = [
  {
    id: "floral",
    name: "Floral",
    scents: ["Lavender", "Jasmine", "Rose"],
    note: "Soft and calming, for bedrooms and slow evenings",
    image: "/rose-scented-candle-pink-jar.jpg",
  },
  {
    id: "gourmand",
    name: "Gourmand",
    scents: ["Vanilla", "Coffee"],
    note: "Warm and sweet, like a kitchen on a Sunday morning",
    image: "/vanilla-scented-candle-in-cream-jar.jpg",
  },
  {
    id: "woodsy",
    name: "Woodsy",
    scents: ["Sandalwood", "Green Tea"],
    note: "Grounding and green, for living rooms and studies",
    image: "/sandalwood-scented-candle-wooden-jar.jpg",
  },
  {
    id: "fruity",
    name: "Fruity",
    scents: ["Orange", "Lemon", "Strawberry"],
    note: "Bright and fresh, to wake a room up",
    image: "/citrus-scented-candle-yellow-jar.jpg",
  },
]

export const allScents = scentFamilies.flatMap((f) => f.scents)

/** Scents are stored lowercase by the admin form; show them capitalised. */
export function displayScent(scent?: string | null): string {
  if (!scent) return ""
  return scent.trim().replace(/\b\w/g, (c) => c.toUpperCase())
}

export function familyOf(scent?: string | null): ScentFamily | undefined {
  if (!scent) return undefined
  const s = scent.trim().toLowerCase()
  return scentFamilies.find((f) => f.id === s || f.scents.some((x) => x.toLowerCase() === s))
}
