import { MARKETS, type MarketCode } from "../config/markets"

export type CatalogProduct = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
}

type ProductResponse = { products?: unknown }

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
  const url = new URL("/store/products", backendUrl)
  url.searchParams.set("limit", "24")
  // Country selection alone must not be mistaken for Medusa region resolution.
  // Region IDs and price context will be supplied by a dedicated region resolver.
  const response = await fetcher(url.toString(), {
    signal,
    headers: { "x-publishable-api-key": publishableKey, accept: "application/json" },
  })
  if (!response.ok) throw new CatalogError("Medusa product API request failed", response.status)
  const body: ProductResponse = await response.json()
  if (!Array.isArray(body.products)) throw new CatalogError("Invalid Medusa product API response")
  void MARKETS[market]
  return body.products.map(parseProduct).filter((p): p is CatalogProduct => p !== null)
}
