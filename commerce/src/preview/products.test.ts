import { describe, expect, it } from "vitest"
import { LOCALES, MARKETS } from "../config/markets"
import { PREVIEW_PRODUCTS, previewProductsForMarket } from "./products"

describe("public storefront demonstration catalogue", () => {
  it("provides examples for all five markets", () => {
    for (const market of Object.keys(MARKETS) as Array<keyof typeof MARKETS>) {
      expect(previewProductsForMarket(market).length).toBeGreaterThan(0)
    }
  })
  it("limits electronics examples to the Iranian market", () => {
    expect(previewProductsForMarket("IR").some((p) => p.kind === "electronics")).toBe(true)
    for (const market of ["AE", "OM", "IQ", "QA"] as const) {
      expect(previewProductsForMarket(market).every((p) => p.kind === "iranian")).toBe(true)
    }
  })
  it("has complete, nonempty translations and unique sample IDs", () => {
    expect(new Set(PREVIEW_PRODUCTS.map((p) => p.id)).size).toBe(PREVIEW_PRODUCTS.length)
    for (const product of PREVIEW_PRODUCTS) {
      for (const locale of Object.keys(LOCALES) as Array<keyof typeof LOCALES>) {
        expect(product.name[locale].trim()).not.toBe("")
        expect(product.description[locale].trim()).not.toBe("")
      }
    }
  })
  it("has no imaginary price or inventory fields", () => {
    for (const p of PREVIEW_PRODUCTS) {
      expect("price" in p).toBe(false)
      expect("inventory" in p).toBe(false)
      expect("available" in p).toBe(false)
    }
  })
})
