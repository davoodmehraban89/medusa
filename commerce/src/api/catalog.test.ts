import { describe, expect, it, vi } from "vitest"
import { CatalogError, fetchCatalog } from "./catalog"

const options = { backendUrl: "http://localhost:9000", publishableKey: "pk_test_example" }

describe("Medusa Store API catalog", () => {
  it("sends publishable API key and parses products", async () => {
    const fetcher = vi.fn(async () => new Response(JSON.stringify({ products: [
      { id: "prod_1", title: "Sample", handle: "sample", thumbnail: "https://example.com/a.jpg" },
    ] }), { status: 200 }))
    const products = await fetchCatalog("IR", { ...options, fetcher: fetcher as typeof fetch })
    expect(products).toHaveLength(1)
    expect(products[0].handle).toBe("sample")
    expect(fetcher.mock.calls[0][0]).toContain("/store/products?limit=24")
    expect((fetcher.mock.calls[0][1] as RequestInit).headers).toMatchObject({ "x-publishable-api-key": "pk_test_example" })
  })
  it("rejects missing API key", async () => {
    await expect(fetchCatalog("AE", { ...options, publishableKey: "" })).rejects.toThrow("publishable key")
  })
  it("surfaces HTTP errors", async () => {
    const fetcher = vi.fn(async () => new Response("Unauthorized", { status: 401 }))
    await expect(fetchCatalog("QA", { ...options, fetcher: fetcher as typeof fetch })).rejects.toMatchObject({ status: 401 })
  })
  it("rejects malformed response", async () => {
    const fetcher = vi.fn(async () => new Response(JSON.stringify({ items: [] }), { status: 200 }))
    await expect(fetchCatalog("OM", { ...options, fetcher: fetcher as typeof fetch })).rejects.toBeInstanceOf(CatalogError)
  })
})
