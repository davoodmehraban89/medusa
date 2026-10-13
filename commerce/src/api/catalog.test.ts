import { describe, expect, it, vi } from "vitest"
import { CatalogError, fetchCatalog } from "./catalog"

const options = { backendUrl: "http://localhost:9000", publishableKey: "pk_test_example" }
const regions = { regions: [
  { id: "reg_ir", countries: [{ iso_2: "ir" }] },
  { id: "reg_ae", countries: [{ iso_2: "ae" }] },
  { id: "reg_om", countries: [{ iso_2: "om" }] },
  { id: "reg_iq", countries: [{ iso_2: "iq" }] },
  { id: "reg_qa", countries: [{ iso_2: "qa" }] },
] }

function mockApi(productsResponse: Response, regionsResponse = new Response(JSON.stringify(regions))) {
  return vi.fn(async (url: string) => url.includes("/store/regions") ? regionsResponse.clone() : productsResponse.clone())
}

describe("Medusa Store API catalog", () => {
  it.each([["IR", "reg_ir"], ["AE", "reg_ae"], ["OM", "reg_om"], ["IQ", "reg_iq"], ["QA", "reg_qa"]] as const)(
    "resolves country %s to region %s",
    async (market, region) => {
      const fetcher = mockApi(new Response(JSON.stringify({ products: [
        { id: "prod_1", title: "Sample", handle: "sample", thumbnail: "https://example.com/a.jpg" },
      ] })))
      const products = await fetchCatalog(market, { ...options, fetcher: fetcher as typeof fetch })
      expect(products).toHaveLength(1)
      expect(fetcher.mock.calls[1][0]).toContain("region_id=" + region)
    },
  )
  it("requires a publishable key", async () => {
    await expect(fetchCatalog("AE", { ...options, publishableKey: "" })).rejects.toThrow("publishable key")
  })
  it("rejects markets not enabled in backend", async () => {
    const fetcher = mockApi(new Response(JSON.stringify({ products: [] })), new Response(JSON.stringify({ regions: [] })))
    await expect(fetchCatalog("QA", { ...options, fetcher: fetcher as typeof fetch })).rejects.toThrow("not configured")
  })
  it("surfaces HTTP errors", async () => {
    const fetcher = mockApi(new Response("Unauthorized", { status: 401 }))
    await expect(fetchCatalog("QA", { ...options, fetcher: fetcher as typeof fetch })).rejects.toMatchObject({ status: 401 })
  })
  it("rejects malformed product response", async () => {
    const fetcher = mockApi(new Response(JSON.stringify({ items: [] })))
    await expect(fetchCatalog("OM", { ...options, fetcher: fetcher as typeof fetch })).rejects.toBeInstanceOf(CatalogError)
  })
})
