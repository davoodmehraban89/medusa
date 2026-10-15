/** Canonical market definitions for the proposed storefront. No PSP/shipping integrations are active. */
export const MARKETS = {
  IR: { countryCode: "ir", currencyCode: "irr", defaultLocale: "fa-IR", focus: "electronics" },
  AE: { countryCode: "ae", currencyCode: "aed", defaultLocale: "en", focus: "iran-origin" },
  OM: { countryCode: "om", currencyCode: "omr", defaultLocale: "en", focus: "iran-origin" },
  IQ: { countryCode: "iq", currencyCode: "iqd", defaultLocale: "en", focus: "iran-origin" },
  QA: { countryCode: "qa", currencyCode: "qar", defaultLocale: "en", focus: "iran-origin" },
} as const

export type MarketCode = keyof typeof MARKETS
export type StoreLocale = "fa-IR" | "ar" | "en"

export const LOCALES = {
  "fa-IR": { language: "fa", direction: "rtl" },
  ar: { language: "ar", direction: "rtl" },
  en: { language: "en", direction: "ltr" },
} as const

export function isMarketCode(value: string): value is MarketCode {
  return Object.prototype.hasOwnProperty.call(MARKETS, value)
}

export function isStoreLocale(value: string): value is StoreLocale {
  return Object.prototype.hasOwnProperty.call(LOCALES, value)
}

/**
 * Converts a whole-number amount in Iranian rials to toman for display.
 * Fractional toman values are preserved; UI rounding policy is a separate decision.
 * This function does not perform currency exchange.
 */
export function rialToToman(rials: number): number {
  if (!Number.isFinite(rials)) {
    throw new TypeError("Rial amount must be a finite number")
  }
  return rials / 10
}

/** Product origin is independent of market, warehouse and dispatch country. */
export type CommerceProductPolicy = {
  sku: string
  originCountryCode: string
  allowedMarketCodes: MarketCode[]
}
