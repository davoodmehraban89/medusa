import { describe, expect, it } from "vitest"
import { isMarketCode, isStoreLocale, LOCALES, MARKETS, rialToToman } from "./markets"

describe("market configuration", () => {
  it("contains five configured markets", () => expect(Object.keys(MARKETS)).toEqual(["IR", "AE", "OM", "IQ", "QA"]))
  it("supports Persian and Arabic RTL plus English LTR", () => {
    expect(LOCALES["fa-IR"].direction).toBe("rtl")
    expect(LOCALES.ar.direction).toBe("rtl")
    expect(LOCALES.en.direction).toBe("ltr")
  })
  it("validates codes", () => {
    expect(isMarketCode("IR")).toBe(true)
    expect(isMarketCode("US")).toBe(false)
    expect(isStoreLocale("ar")).toBe(true)
    expect(isStoreLocale("fr")).toBe(false)
  })
  it("converts rials to tomans without FX", () => {
    expect(rialToToman(1250)).toBe(125)
    expect(() => rialToToman(Infinity)).toThrow()
  })
})
