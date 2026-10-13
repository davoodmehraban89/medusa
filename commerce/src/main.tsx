import React from "react"
import { createRoot } from "react-dom/client"
import { MARKETS, LOCALES, type MarketCode, type StoreLocale } from "./config/markets"
import { fetchCatalog, type CatalogProduct } from "./api/catalog"
import "./styles.css"

function App() {
  const [market, setMarket] = React.useState<MarketCode>("IR")
  const [locale, setLocale] = React.useState<StoreLocale>("fa-IR")
  const [products, setProducts] = React.useState<CatalogProduct[]>([])
  const [catalogState, setCatalogState] = React.useState<"unconfigured" | "loading" | "ready" | "error">("unconfigured")
  const isFa = locale === "fa-IR"
  const isAr = locale === "ar"
  const tr = (fa: string, en: string, ar: string) => isFa ? fa : isAr ? ar : en
  const marketNames: Record<MarketCode, string> = isFa
    ? { IR: "ایران", AE: "امارات", OM: "عمان", IQ: "عراق", QA: "قطر" }
    : isAr ? { IR: "إيران", AE: "الإمارات", OM: "عُمان", IQ: "العراق", QA: "قطر" }
    : { IR: "Iran", AE: "UAE", OM: "Oman", IQ: "Iraq", QA: "Qatar" }
  React.useEffect(() => {
    const backendUrl = import.meta.env.VITE_MEDUSA_BACKEND_URL
    const publishableKey = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY
    if (!backendUrl || !publishableKey) {
      setProducts([])
      setCatalogState("unconfigured")
      return
    }
    const controller = new AbortController()
    setCatalogState("loading")
    setProducts([])
    fetchCatalog(market, { backendUrl, publishableKey, signal: controller.signal })
      .then((items) => { if (!controller.signal.aborted) { setProducts(items); setCatalogState("ready") } })
      .catch(() => { if (!controller.signal.aborted) setCatalogState("error") })
    return () => controller.abort()
  }, [market])
  return (
    <main dir={LOCALES[locale].direction} lang={LOCALES[locale].language}>
      <header className="header">
        <a href="/" className="logo">MEDUSA <span>COMMERCE</span></a>
        <nav aria-label={tr("تنظیمات فروشگاه", "Store settings", "إعدادات المتجر")}>
          <label>{tr("کشور", "Country", "الدولة")} <select value={market} onChange={(event) => setMarket(event.target.value as MarketCode)}>
            {Object.keys(MARKETS).map((code) => <option key={code} value={code}>{marketNames[code as MarketCode]}</option>)}
          </select></label>
          <label>{tr("زبان", "Language", "اللغة")} <select value={locale} onChange={(event) => setLocale(event.target.value as StoreLocale)}>
            <option value="fa-IR">فارسی</option><option value="ar">العربية</option><option value="en">English</option>
          </select></label>
        </nav>
      </header>
      <section className="hero">
        <p className="eyebrow">{tr("تجربه خرید در پنج بازار", "Shopping across five markets", "تسوّق في خمسة أسواق")}</p>
        <h1>{tr("یک فروشگاه، جهانی از انتخاب‌ها", "One store. More possibilities.", "متجر واحد، خيارات بلا حدود")}</h1>
        <p>{tr("فروشگاه چندکشوری با محصولات دیجیتال و کالاهای منتخب ایران", "A multi-market store for electronics and selected Iran-origin goods.", "متجر متعدد الأسواق للإلكترونيات ومنتجات مختارة من إيران")}</p>
        <div className="market">{tr("بازار انتخاب‌شده:", "Selected market:", "السوق المحدد:")} <strong>{marketNames[market]}</strong> · {MARKETS[market].currencyCode.toUpperCase()}</div>
      </section>
      <section className="content" aria-labelledby="catalog-title">
        <h2 id="catalog-title">{tr("محصولات فروشگاه", "Store products", "منتجات المتجر")}</h2>
        {catalogState === "unconfigured" && <p>{tr("برای نمایش محصولات، اتصال API فروشگاه را تنظیم کنید.", "Configure the store API to display products.", "يرجى إعداد اتصال واجهة المتجر لعرض المنتجات.")}</p>}
        {catalogState === "loading" && <p role="status">{tr("در حال دریافت محصولات…", "Loading products…", "جارٍ تحميل المنتجات…")}</p>}
        {catalogState === "error" && <p role="alert">{tr("دریافت محصولات ناموفق بود. اتصال Backend و کلید عمومی را بررسی کنید.", "Could not load products. Check backend connectivity and publishable key.", "تعذر تحميل المنتجات. تحقق من اتصال الخادم والمفتاح العام.")}</p>}
        {catalogState === "ready" && products.length === 0 && <p>{tr("در حال حاضر محصولی برای نمایش وجود ندارد.", "No products available to display.", "لا توجد منتجات متاحة للعرض.")}</p>}
        {catalogState === "ready" && products.length > 0 && <div className="product-grid">{products.map((product) => <article className="product" key={product.id}>{product.thumbnail && <img loading="lazy" src={product.thumbnail} alt="" />}<h3>{product.title}</h3></article>)}</div>}
        <p className="notice">{tr("این نسخه پیش‌نمایش است؛ قیمت‌گذاری منطقه‌ای، خرید و پرداخت هنوز فعال نیست.", "This is a preview; regional pricing, checkout and payments are not active.", "هذه معاينة؛ الأسعار الإقليمية والشراء والدفع غير متاحة بعد.")}</p>
      </section>
      <footer>© Medusa Commerce · {tr("نسخه توسعه", "Development preview", "نسخة تجريبية")}</footer>
    </main>
  )
}

createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>)
