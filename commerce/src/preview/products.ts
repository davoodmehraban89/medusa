import type { MarketCode, StoreLocale } from "../config/markets"

/**
 * Illustrative examples ONLY. No SKU, live stock, seller, price, customs
 * eligibility or fulfillment claim is implied by these entries.
 */
export type PreviewKind = "electronics" | "iranian"
export type PreviewVisual = "phone" | "laptop" | "headphones" | "camera" | "tea" | "ceramic" | "textile" | "saffron"

export type PreviewProduct = {
  id: string
  kind: PreviewKind
  visual: PreviewVisual
  markets: readonly MarketCode[]
  name: Record<StoreLocale, string>
  description: Record<StoreLocale, string>
}

const ALL_MARKETS: readonly MarketCode[] = ["IR", "AE", "OM", "IQ", "QA"]

export const PREVIEW_PRODUCTS: readonly PreviewProduct[] = [
  {
    id: "example-phone", kind: "electronics", visual: "phone", markets: ["IR"],
    name: { "fa-IR": "گوشی هوشمند", ar: "هاتف ذكي", en: "Smartphone" },
    description: { "fa-IR": "نمایشی از دسته موبایل و لوازم دیجیتال", ar: "معاينة لفئة الهواتف والإلكترونيات", en: "Illustrating the mobile and digital category" },
  },
  {
    id: "example-laptop", kind: "electronics", visual: "laptop", markets: ["IR"],
    name: { "fa-IR": "لپ‌تاپ و رایانه", ar: "حاسوب محمول", en: "Laptop & computing" },
    description: { "fa-IR": "نمونه چیدمان محصولات رایانه‌ای", ar: "نموذج لعرض منتجات الحاسوب", en: "Example layout for computing products" },
  },
  {
    id: "example-audio", kind: "electronics", visual: "headphones", markets: ["IR"],
    name: { "fa-IR": "لوازم صوتی", ar: "ملحقات صوتية", en: "Audio accessories" },
    description: { "fa-IR": "دسته‌بندی نمونه هدفون و تجهیزات صوتی", ar: "مثال على فئة سماعات الرأس والصوت", en: "Sample audio and headphone category" },
  },
  {
    id: "example-camera", kind: "electronics", visual: "camera", markets: ["IR"],
    name: { "fa-IR": "تصویربرداری", ar: "التصوير", en: "Imaging" },
    description: { "fa-IR": "نمایشی از محصولات دوربین و تصویر", ar: "معاينة لمنتجات التصوير", en: "Preview of camera and imaging categories" },
  },
  {
    id: "example-tea", kind: "iranian", visual: "tea", markets: ALL_MARKETS,
    name: { "fa-IR": "چای ایرانی", ar: "الشاي الإيراني", en: "Iranian tea" },
    description: { "fa-IR": "نمونه دسته محصولات خوراکی منتخب ایران", ar: "نموذج لفئة الأغذية الإيرانية المختارة", en: "Illustrative Iran-origin grocery category" },
  },
  {
    id: "example-ceramic", kind: "iranian", visual: "ceramic", markets: ALL_MARKETS,
    name: { "fa-IR": "سفال و سرامیک", ar: "الفخار والخزف", en: "Pottery & ceramics" },
    description: { "fa-IR": "نمایش نمونه برای صنایع دستی ایرانی", ar: "عرض توضيحي للحرف اليدوية الإيرانية", en: "Example of Iranian handicraft merchandising" },
  },
  {
    id: "example-textile", kind: "iranian", visual: "textile", markets: ALL_MARKETS,
    name: { "fa-IR": "منسوجات دست‌باف", ar: "المنسوجات اليدوية", en: "Handwoven textiles" },
    description: { "fa-IR": "نمونه گروه هنرهای پارچه‌ای و دست‌باف", ar: "مثال على المنسوجات والفنون اليدوية", en: "Illustrative woven and textile collection" },
  },
  {
    id: "example-saffron", kind: "iranian", visual: "saffron", markets: ALL_MARKETS,
    name: { "fa-IR": "زعفران و ادویه", ar: "الزعفران والتوابل", en: "Saffron & spices" },
    description: { "fa-IR": "نمایش نمونه محصولات کشاورزی منتخب", ar: "معاينة لمحاصيل زراعية مختارة", en: "Example of selected agricultural products" },
  },
]

export function previewProductsForMarket(market: MarketCode): PreviewProduct[] {
  return PREVIEW_PRODUCTS.filter((product) => product.markets.includes(market))
}
