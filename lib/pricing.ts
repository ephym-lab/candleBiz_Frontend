/**
 * Pricing rules shared by the cart and checkout.
 * Keep in sync with Backend/app/services/order_service.py (delivery_fee, bundle_unit_price),
 * which recalculates and saves the real order total.
 */

export const FREE_DELIVERY_FROM = 3000
export const DELIVERY_FEE = 300

type Offer = { quantity: number; discount: number } | undefined | null

export function bundleUnitPrice(price: number, offer: Offer, quantity: number): number {
  if (!offer || !offer.quantity || !offer.discount || quantity < offer.quantity) return price
  return Math.round(price * (1 - offer.discount / 100))
}

export function deliveryFee(subtotal: number): number {
  return subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE
}

export const kes = (n: number) => `KES ${n.toLocaleString("en-KE")}`
