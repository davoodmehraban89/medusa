import React from "react"
import { createRoot } from "react-dom/client"
import { MARKETS, LOCALES, type MarketCode, type StoreLocale } from "./config/markets"
import { fetchCatalog, type CatalogProduct } from "./api/catalog"
import { previewProductsForMarket, type PreviewProduct, type PreviewVisual, type PreviewKind } from "./preview/products"
import "./styles.css"

type CatalogState = "unconfigured" | "loading" | "ready" | "error"
type Filter = "all" | PreviewKind

function Artwork({ visual }: { visual: PreviewVisual }) {
  return (
    <div className={"artwork art-" + visual} aria-hidden="true">
      <span className="artwork-orbit" />
      <svg viewBox="0 0 240 180" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        {visual === "phone" && <><rect x="84" y="24" width="72" height="132" rx="13" /><path d="M110 33h20" /><circle cx="120" cy="145" r="3" /><path d="M96 65l38-16M99 92l40-15" strokeOpacity=".24" strokeWidth="10" /></>}
        {visual === "laptop" && <><rect x="43" y="42" width="154" height="96" rx="7" /><path d="M25 144h190l-17 12H42z" /><path d="M88 80h64M104 97h32" strokeOpacity=".32" strokeWidth="10" /></>}
        {visual === "headphones" && <><path d="M61 102V83a59 59 0 0 1 118 0v19" /><rect x="48" y="94" width="28" height="52" rx="12" /><rect x="164" y="94" width="28" height="52" rx="12" /><path d="M179 146c-3 20-18 22-37 22h-12" /><rect x="109" y="160" width="24" height="13" rx="6" /></>}
        {visual === "camera" && <><rect x="39" y="66" width="162" height="92" rx="14" /><circle cx="122" cy="110" r="32" /><circle cx="122" cy="110" r="13" /><path d="M77 66l14-19h58l14 19" /><circle cx="180" cy="82" r="4" /></>}
        {visual === "tea" && <><path d="M72 46h90l-9 113H81z" /><path d="M85 64h64M88 143h56" /><path d="M107 16c-13 14 10 18-4 32M137 16c-13 14 10 18-4 32" /><path d="M92 105c26-24 30 22 49 0" strokeOpacity=".55" /></>}
        {visual === "ceramic" && <><path d="M79 38h82M88 38c-3 21 13 28 8 42-6 21-28 24-28 51 0 20 21 28 52 28s52-8 52-28c0-27-22-30-28-51-5-14 11-21 8-42" /><path d="M83 118c26-13 48 15 74 0M92 133c16-7 40 7 56 0" strokeOpacity=".4" /></>}
        {visual === "textile" && <><path d="M50 35h140v110H50z" /><path d="M68 35v110M87 35v110M106 35v110M125 35v110M144 35v110M163 35v110" strokeOpacity=".35" /><path d="M50 63h140M50 88h140M50 113h140" strokeOpacity=".45" /><path d="M50 153v10M68 153v10M87 153v10M106 153v10M125 153v10M144 153v10M163 153v10M190 153v10" /></>}
        {visual === "saffron" && <><path d="M58 96c-16-20-15-39-10-48 20 3 41 23 51 46M182 96c16-20 15-39 10-48-20 3-41 23-51 46" /><path d="M97 92c-20-37-7-67 23-76 30 9 43 39 23 76" /><path d="M89 98h62l-8 55H97z" /><path d="M86 99h68M105 117l30 20M135 117l-30 20" strokeOpacity=".45" /></>}
      </svg>
    </div>
  )
}

function App() {
  const [market, setMarket] = React.useState<MarketCode>("IR")
  const [locale, setLocale] = React.useState<StoreLocale>("fa-IR")
  const [products, setProducts] = React.useState<CatalogProduct[]>([])
  const [catalogState, setCatalogState] = React.useState<CatalogState>("unconfigured")
  const [filter, setFilter] = React.useState<Filter>("all")
  const [search, setSearch] = React.useState("")
  const [selected, setSelected] = React.useState<PreviewProduct | null>(null)

  const fa = locale === "fa-IR"
  const ar = locale === "ar"
  const tr = (persian: string, english: string, arabic: string) => fa ? persian : ar ? arabic : english

  const marketNames: Record<MarketCode, string> = fa
    ? { IR: "ایران", AE: "امارات", OM: "عمان", IQ: "عراق", QA: "قطر" }
    : ar
    ? { IR: "إيران", AE: "الإمارات", OM: "عُمان", IQ: "العراق", QA: "قطر" }
    : { IR: "Iran", AE: "UAE", OM: "Oman", IQ: "Iraq", QA: "Qatar" }

  React.useEffect(() => {
    document.documentElement.dir = LOCALES[locale].direction
    document.documentElement.lang = LOCALES[locale].language
  }, [locale])

  React.useEffect(() => {
    setSelected(null)
    setFilter("all")
    setSearch("")
  }, [market])

  React.useEffect(() => {
    if (!selected) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [selected])

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
      .then((items) => {
        if (!controller.signal.aborted) {
          setProducts(items)
          setCatalogState("ready")
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setCatalogState("error")
      })
    return () => controller.abort()
  }, [market])

  const isDemo = catalogState === "unconfigured" || catalogState === "error"
  const examples = previewProductsForMarket(market).filter((p) => {
    if (filter !== "all" && p.kind !== filter) return false
    if (!search.trim()) return true
    const term = search.trim().toLocaleLowerCase()
    return p.name[locale].toLocaleLowerCase().includes(term) || p.description[locale].toLocaleLowerCase().includes(term)
  })
  const filteredRealProducts = products.filter((p) => p.title.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()))
  const labelForKind = (kind: PreviewKind) => kind === "electronics"
    ? tr("دیجیتال و الکترونیک", "Electronics", "الإلكترونيات")
    : tr("محصولات منتخب ایران", "Iran-origin collections", "منتجات مختارة من إيران")

  return (
    <div className="app-shell">
      <div className="preview-strip">
        <span className="live-dot" />
        {tr("پیش‌نمایش تعاملی طراحی · بدون خرید یا پرداخت واقعی", "Interactive design preview · no real purchases or payments", "معاينة تصميم تفاعلية · لا شراء أو دفع حقيقي")}
      </div>
      <header className="header">
        <a href="#top" className="logo" aria-label="Medusa Commerce">
          <span className="logo-mark">M</span>
          <span className="logo-text">MEDUSA <small>COMMERCE</small></span>
        </a>
        <nav className="header-nav" aria-label={tr("تنظیمات فروشگاه", "Store settings", "إعدادات المتجر")}>
          <a href="#catalog" className="nav-catalog">{tr("دسته‌بندی‌ها", "Collections", "المجموعات")}</a>
          <label className="nav-select">{tr("کشور", "Market", "السوق")}
            <select aria-label={tr("انتخاب کشور", "Select market", "اختر السوق")} value={market} onChange={(e) => setMarket(e.target.value as MarketCode)}>
              {Object.keys(MARKETS).map((code) => <option key={code} value={code}>{marketNames[code as MarketCode]}</option>)}
            </select>
          </label>
          <label className="nav-select">{tr("زبان", "Language", "اللغة")}
            <select aria-label={tr("انتخاب زبان", "Select language", "اختر اللغة")} value={locale} onChange={(e) => setLocale(e.target.value as StoreLocale)}>
              <option value="fa-IR">فارسی</option>
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </label>
        </nav>
      </header>
      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-line" />{tr("تجربه خرید، بدون مرز", "A new way to explore", "تجربة تسوّق بلا حدود")}</span>
            <h1>{tr("انتخاب‌های تازه،", "Discover more.", "اكتشف المزيد،")}<br/><em>{tr("در یک نگاه.", "Across borders.", "عبر الحدود.")}</em></h1>
            <p>{tr("یک تجربه فروشگاهی در حال طراحی؛ ویژه محصولات دیجیتال و مجموعه‌ای از کالاهای منتخب ایرانی در پنج بازار.", "A storefront experience in progress, designed for electronics and curated Iran-origin collections across five markets.", "تجربة متجر قيد التطوير للإلكترونيات ومجموعات مختارة من المنتجات الإيرانية في خمسة أسواق.")}</p>
            <div className="hero-actions">
              <a className="primary-action" href="#catalog">{tr("دیدن دسته‌بندی‌های نمونه", "Explore sample collections", "استعرض المجموعات التجريبية")} <span aria-hidden="true">↗</span></a>
              <span className="hero-note">{tr("بدون قیمت و سفارش واقعی", "No real prices or orders", "دون أسعار أو طلبات فعلية")}</span>
            </div>
            <div className="market-pill">
              <span className="market-pill-icon">◎</span>
              <span>{tr("بازار انتخابی", "Selected market", "السوق المحدد")}: <strong>{marketNames[market]}</strong></span>
              <span className="currency">{MARKETS[market].currencyCode.toUpperCase()}</span>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="hero-ring hero-ring-one" />
            <div className="hero-ring hero-ring-two" />
            <div className="hero-figure">
              <div className="figure-top" />
              <div className="figure-center" />
              <div className="figure-bottom" />
            </div>
            <span className="hero-art-caption">M / CURATED</span>
            <span className="hero-art-index">01—05</span>
          </div>
        </section>
        <section className="feature-band" aria-label={tr("ویژگی‌های نسخه نمایشی", "Preview features", "ميزات المعاينة")}>
          <div><strong>05</strong><span>{tr("بازار هدف", "Markets", "أسواق")}</span></div>
          <div><strong>03</strong><span>{tr("زبان مستقل", "Languages", "لغات")}</span></div>
          <div><strong>RTL / LTR</strong><span>{tr("چیدمان هماهنگ", "Adaptive layout", "تصميم متكيف")}</span></div>
        </section>
        <section className="content" id="catalog" aria-labelledby="catalog-title">
          <div className="section-heading">
            <div>
              <span className="section-kicker">{tr("نگاهی به فروشگاه", "A glimpse of the store", "نظرة على المتجر")}</span>
              <h2 id="catalog-title">{tr("مجموعه‌ها را کشف کنید", "Explore the collections", "اكتشف المجموعات")}</h2>
              <p>{isDemo
                ? tr("این کارت‌ها نمونه طراحی هستند؛ نه کالاهای موجود یا قابل سفارش.", "These cards are illustrative design samples, not stocked or orderable products.", "هذه البطاقات أمثلة تصميمية وليست منتجات متوفرة أو قابلة للطلب.")
                : tr("محصولات دریافتی از فروشگاه مدوسا", "Products loaded from Medusa", "المنتجات المحمّلة من مدوسا")}</p>
            </div>
            {isDemo && <span className="demo-badge">{tr("داده نمونه", "DEMO DATA", "بيانات تجريبية")}</span>}
          </div>
          <div className="catalog-toolbar">
            <div className="filters" aria-label={tr("فیلتر دسته‌بندی", "Category filter", "تصفية الفئات")}>
              <button type="button" aria-pressed={filter === "all"} className={filter === "all" ? "filter active" : "filter"} onClick={() => setFilter("all")}>{tr("همه", "All", "الكل")}</button>
              {market === "IR" && <button type="button" aria-pressed={filter === "electronics"} className={filter === "electronics" ? "filter active" : "filter"} onClick={() => setFilter("electronics")}>{labelForKind("electronics")}</button>}
              <button type="button" aria-pressed={filter === "iranian"} className={filter === "iranian" ? "filter active" : "filter"} onClick={() => setFilter("iranian")}>{labelForKind("iranian")}</button>
            </div>
            <label className="search-field">
              <span aria-hidden="true">⌕</span>
              <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={tr("جست‌وجو در نمونه‌ها…", "Search collections…", "ابحث في المجموعات…")} aria-label={tr("جست‌وجو", "Search", "بحث")} />
            </label>
          </div>
          {catalogState === "error" && <p role="alert" className="catalog-alert">{tr("اتصال به Backend برقرار نشد؛ نمونه طراحی زیر نمایش داده می‌شود.", "The backend could not be reached; showing illustrative samples instead.", "تعذر الاتصال بالخادم؛ يتم عرض أمثلة توضيحية بدلاً منها.")}</p>}
          {catalogState === "loading" && <p role="status" className="catalog-alert">{tr("در حال دریافت محصولات…", "Loading products…", "جارٍ تحميل المنتجات…")}</p>}
          {isDemo && <>
            {examples.length ? <div className="product-grid">
              {examples.map((product, index) => <article className="product" key={product.id}>
                <button type="button" className="product-open" onClick={() => setSelected(product)} aria-label={tr("مشاهده نمونه", "View sample", "عرض المثال") + ": " + product.name[locale]}>
                  <Artwork visual={product.visual} />
                  <div className="product-copy">
                    <div className="product-meta"><span>{labelForKind(product.kind)}</span><span>{String(index + 1).padStart(2, "0")}</span></div>
                    <h3>{product.name[locale]}</h3>
                    <p>{product.description[locale]}</p>
                    <span className="product-link">{tr("مشاهده جزئیات نمونه", "View example", "عرض المثال")} <span aria-hidden="true">↗</span></span>
                  </div>
                </button>
              </article>)}
            </div> : <p role="status" className="empty-state">{tr("نمونه‌ای مطابق جست‌وجو پیدا نشد.", "No sample matches your search.", "لا توجد أمثلة تطابق البحث.")}</p>}
          </>}
          {catalogState === "ready" && <>
            {filteredRealProducts.length ? <div className="product-grid">
              {filteredRealProducts.map((product) => <article className="product" key={product.id}>
                <div className="real-product-image">{product.thumbnail ? <img loading="lazy" src={product.thumbnail} alt="" /> : <span aria-hidden="true">◈</span>}</div>
                <div className="product-copy"><h3>{product.title}</h3><p>{tr("اطلاعات قیمت و خرید هنوز فعال نیست.", "Pricing and checkout remain disabled.", "الأسعار والشراء غير متاحين بعد.")}</p></div>
              </article>)}
            </div> : <p role="status" className="empty-state">{tr("محصولی برای نمایش پیدا نشد.", "No matching products found.", "لم يتم العثور على منتجات.")}</p>}
          </>}
        </section>
        <section className="closing">
          <div><span className="section-kicker">{tr("قدم بعدی", "What's next", "الخطوة التالية")}</span><h2>{tr("از نمونه طراحی تا فروشگاه واقعی", "From concept to commerce.", "من التصميم إلى المتجر الحقيقي")}</h2></div>
          <p>{tr("اتصال محصولات واقعی، قیمت‌گذاری منطقه‌ای، موجودی و پرداخت پس از تکمیل و آزمون زیرساخت اضافه می‌شوند.", "Live products, region-specific prices, inventory and checkout will follow after backend integration and testing.", "ستُضاف المنتجات الفعلية والأسعار الإقليمية والمخزون والدفع بعد ربط الخادم واختباره.")}</p>
        </section>
      </main>
      <footer><span>MEDUSA COMMERCE <small> / PREVIEW</small></span><span>© 2026 · {tr("نسخه نمایشی غیرعملیاتی", "Non-transactional demonstration", "معاينة غير تجارية")}</span></footer>
      {selected && <div className="modal-backdrop" onClick={() => setSelected(null)}>
        <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.stopPropagation()}>
          <button type="button" className="modal-close" onClick={() => setSelected(null)} aria-label={tr("بستن", "Close", "إغلاق")}>×</button>
          <Artwork visual={selected.visual} />
          <div className="modal-copy">
            <span className="demo-badge">{tr("نمونه طراحی", "DESIGN SAMPLE", "مثال تصميمي")}</span>
            <h2 id="modal-title">{selected.name[locale]}</h2>
            <p>{selected.description[locale]}</p>
            <p className="modal-note">{tr("این مورد نمایشی است و قیمت، موجودی یا امکان ثبت سفارش ندارد.", "This is an illustration only. No real price, stock or checkout is available.", "هذا مثال توضيحي فقط؛ لا يوجد سعر فعلي أو مخزون أو إمكانية للشراء.")}</p>
            <button type="button" className="modal-done" onClick={() => setSelected(null)}>{tr("بازگشت به مجموعه‌ها", "Back to collections", "العودة إلى المجموعات")}</button>
          </div>
        </section>
      </div>}
    </div>
  )
}

createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>)
