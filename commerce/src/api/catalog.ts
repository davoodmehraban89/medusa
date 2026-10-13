import { MARKETS, type MarketCode } from "../config/markets"

export type CatalogProduct = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
}

type ProductResponse = { products?: unknown }
type RegionResponse = { regions?: unknown }

export class CatalogError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message)
    this.name = "CatalogError"
  }
}

function parseProduct(value: unknown): CatalogProduct | null {
  if (!value || typeof value !== "object") return null
  const p = value as Record<string, unknown>
  if (typeof p.id !== "string" || typeof p.title !== "string" || typeof p.handle !== "string") return null
  return {
    id: p.id,
    title: p.title,
    handle: p.handle,
    thumbnail: typeof p.thumbnail === "string" && /^https?:\/\//.test(p.thumbnail) ? p.thumbnail : null,
  }
}

/** Fetch public product summaries from Medusa Store API. Region pricing requires a resolved region_id. */
export async function fetchCatalog(
  market: MarketCode,
  options: { backendUrl: string; publishableKey: string; signal?: AbortSignal; fetcher?: typeof fetch },
): Promise<CatalogProduct[]> {
  const { backendUrl, publishableKey, signal, fetcher = fetch } = options
  if (!/^https?:\/\//.test(backendUrl)) throw new CatalogError("A valid backend URL is required")
  if (!publishableKey.trim()) throw new CatalogError("Medusa publishable key is required")
  const headers = { "x-publishable-api-key": publishableKey, accept: "application/json" }
  const regionsResponse = await fetcher(new URL("/store/regions", backendUrl).toString(), { signal, headers })
  if (!regionsResponse.ok) throw new CatalogError("Medusa regions API request failed", regionsResponse.status)
  const regionBody: RegionResponse = await regionsResponse.json()
  if (!Array.isArray(regionBody.regions)) throw new CatalogError("Invalid Medusa regions response")
  const countryCode = MARKETS[market].countryCode
  const region = regionBody.regions.find((item: unknown) => {
    if (!item || typeof item !== "object") return false
    const candidate = item as { id?: unknown; countries?: unknown }
    return typeof candidate.id === "string" && Array.isArray(candidate.countries) && candidate.countries.some((country: unknown) =>
      country !== null && typeof country === "object" && (country as { iso_2?: unknown }).iso_2 === countryCode,
    )
  }) as { id: string } | undefined
  if (!region) throw new CatalogError("Selected country is not configured in a Medusa region")
  const url = new URL("/store/products", backendUrl)
  url.searchParams.set("limit", "24")
  url.searchParams.set("region_id", region.id)
  const response = await fetcher(url.toString(), {
    signal,
    headers,
  })
  if (!response.ok) throw new CatalogError("Medusa product API request failed", response.status)
  const body: ProductResponse = await response.json()
  if (!Array.isArray(body.products)) throw new CatalogError("Invalid Medusa product API response")
  return body.products.map(parseProduct).filter((p): p is CatalogProduct => p !== null)
}
