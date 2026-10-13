import React from "react"
import { createRoot } from "react-dom/client"
import { MARKETS, LOCALES, type MarketCode, type StoreLocale } from "./config/markets"
import "./styles.css"

function App() {
  const [market, setMarket] = React.useState<MarketCode>("IR")
  const [locale, setLocale] = React.useState<StoreLocale>("fa-IR")
  const isFa = locale === "fa-IR"
  const isAr = locale === "ar"
  const tr = (fa: string, en: string, ar: string) => isFa ? fa : isAr ? ar : en
  const marketNames: Record<MarketCode, string> = isFa
    ? { IR: "ایران", AE: "امارات", OM: "عمان", IQ: "عراق", QA: "قطر" }
    : isAr ? { IR: "إيران", AE: "الإمارات", OM: "عُمان", IQ: "العراق", QA: "قطر" }
    : { IR: "Iran", AE: "UAE", OM: "Oman", IQ: "Iraq", QA: "Qatar" }
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
        <p>{tr("کاتالوگ پس از اتصال و تأیید API فروشگاه نمایش داده می‌شود.", "The catalog will appear after the store API is connected and verified.", "سيظهر كتالوج المنتجات بعد ربط واجهة المتجر البرمجية والتحقق منها.")}</p>
        <p className="notice">{tr("این نسخه پیش‌نمایش رابط است؛ خرید و پرداخت هنوز فعال نیست.", "This is a UI preview; checkout and payments are not active.", "هذه معاينة للواجهة؛ الشراء والدفع غير متاحين بعد.")}</p>
      </section>
      <footer>© Medusa Commerce · {tr("نسخه توسعه", "Development preview", "نسخة تجريبية")}</footer>
    </main>
  )
}

createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>)
