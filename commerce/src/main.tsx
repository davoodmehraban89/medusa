import React from "react"
import { createRoot } from "react-dom/client"
import { MARKETS, LOCALES, type MarketCode, type StoreLocale } from "./config/markets"
import "./styles.css"

function App() {
  const [market, setMarket] = React.useState<MarketCode>("IR")
  const [locale, setLocale] = React.useState<StoreLocale>("fa-IR")
  const isFa = locale === "fa-IR"
  const marketNames: Record<MarketCode, string> = isFa
    ? { IR: "ایران", AE: "امارات", OM: "عمان", IQ: "عراق", QA: "قطر" }
    : { IR: "Iran", AE: "UAE", OM: "Oman", IQ: "Iraq", QA: "Qatar" }
  return (
    <main dir={LOCALES[locale].direction} lang={LOCALES[locale].language}>
      <header className="header">
        <a href="/" className="logo">MEDUSA <span>COMMERCE</span></a>
        <nav aria-label={isFa ? "تنظیمات فروشگاه" : "Store settings"}>
          <label>{isFa ? "کشور" : "Country"} <select value={market} onChange={(event) => setMarket(event.target.value as MarketCode)}>
            {Object.keys(MARKETS).map((code) => <option key={code} value={code}>{marketNames[code as MarketCode]}</option>)}
          </select></label>
          <label>{isFa ? "زبان" : "Language"} <select value={locale} onChange={(event) => setLocale(event.target.value as StoreLocale)}>
            <option value="fa-IR">فارسی</option><option value="en">English</option>
          </select></label>
        </nav>
      </header>
      <section className="hero">
        <p className="eyebrow">{isFa ? "تجربه خرید در پنج بازار" : "Shopping across five markets"}</p>
        <h1>{isFa ? "یک فروشگاه، جهانی از انتخاب‌ها" : "One store. More possibilities."}</h1>
        <p>{isFa ? "فروشگاه چندکشوری با محصولات دیجیتال و کالاهای منتخب ایران" : "A multi-market store for electronics and selected Iran-origin goods."}</p>
        <div className="market">{isFa ? "بازار انتخاب‌شده:" : "Selected market:"} <strong>{marketNames[market]}</strong> · {MARKETS[market].currencyCode.toUpperCase()}</div>
      </section>
      <section className="content" aria-labelledby="catalog-title">
        <h2 id="catalog-title">{isFa ? "محصولات فروشگاه" : "Store products"}</h2>
        <p>{isFa ? "کاتالوگ پس از اتصال و تأیید API فروشگاه نمایش داده می‌شود." : "The catalog will appear after the store API is connected and verified."}</p>
        <p className="notice">{isFa ? "این نسخه پیش‌نمایش رابط است؛ خرید و پرداخت هنوز فعال نیست." : "This is a UI preview; checkout and payments are not active."}</p>
      </section>
      <footer>© Medusa Commerce · {isFa ? "نسخه توسعه" : "Development preview"}</footer>
    </main>
  )
}

createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>)
