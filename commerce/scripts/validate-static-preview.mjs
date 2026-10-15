import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import assert from "node:assert/strict"

const pages = [
  { file: "index.html", lang: "fa", dir: "rtl" },
  { file: "en.html", lang: "en", dir: "ltr" },
  { file: "ar.html", lang: "ar", dir: "rtl" },
]

const docs = new URL("../../docs/", import.meta.url)

const occurrences = (text, expression) => [...text.matchAll(expression)].length

for (const { file, lang, dir } of pages) {
  const html = readFileSync(fileURLToPath(new URL(file, docs)), "utf8")

  assert.match(html, /^<!doctype html><html /i, file + ": valid document start")
  assert.ok(html.includes(`<html lang="${lang}" dir="${dir}"`), file + ": language and direction")
  assert.ok(html.includes('name="viewport"'), file + ": mobile viewport")
  assert.ok(html.includes('name="robots" content="noindex,nofollow"'), file + ": preview must not be indexed")
  assert.ok(html.includes('class="skip"'), file + ": skip navigation")
  assert.equal(occurrences(html, /class="market-input"/g), 5, file + ": five independent markets")
  assert.equal(occurrences(html, /class="market-panel /g), 5, file + ": five market panels")
  assert.equal(occurrences(html, /class="card"/g), 24, file + ": category examples across the five panels")
  assert.equal(occurrences(html, /class="faq-item"/g), 4, file + ": four FAQs")
  assert.equal(occurrences(html, /class="languages"/g), 1, file + ": locale menu")
  assert.equal(occurrences(html, /href="\.\/(?:index|en|ar)\.html"/g), 3, file + ": all three translations")
  assert.equal(occurrences(html, /class="feature"/g), 3, file + ": three experience features")
  assert.equal(occurrences(html, /class="step"/g), 3, file + ": three delivery milestones")
  assert.equal(occurrences(html, /class="hero"/g), 1, file + ": accessible hero")
  assert.ok(html.includes('id="collections"') && html.includes('id="roadmap"') && html.includes('id="faq"'), file + ": required navigation destinations")
  assert.ok(html.includes('@media(max-width:420px)'), file + ": small-screen styling")
  assert.ok(html.includes('prefers-reduced-motion'), file + ": reduced motion support")
  assert.ok(html.includes('focus-visible'), file + ": keyboard focus indicator")
  assert.ok(html.includes('IRR') && html.includes('AED') && html.includes('OMR') && html.includes('IQD') && html.includes('QAR'), file + ": explicit market currencies")
  assert.doesNotMatch(html, /<(script|link|iframe|img)\b/i, file + ": zero external asset dependencies")
  assert.doesNotMatch(html, /https?:\/\//, file + ": no external network requests")

  for (const country of ["ir", "ae", "om", "iq", "qa"]) {
    assert.ok(html.includes(`id="market-${country}"`), file + ": radio " + country)
    assert.ok(html.includes(`for="market-${country}"`), file + ": label " + country)
    assert.ok(html.includes(`class="market-panel ${country}"`), file + ": panel " + country)
  }

  const iranStart = html.indexOf('class="market-panel ir"')
  const uaeStart = html.indexOf('class="market-panel ae"')
  const omanStart = html.indexOf('class="market-panel om"')
  assert.ok(iranStart >= 0 && uaeStart > iranStart && omanStart > uaeStart, file + ": country panel order")
  assert.equal(occurrences(html.slice(iranStart, uaeStart), /class="card"/g), 8, file + ": Iran's eight illustrative categories")
  assert.equal(occurrences(html.slice(uaeStart, omanStart), /class="card"/g), 4, file + ": UAE's four illustrative Iran-origin categories")

  process.stdout.write(`PASS ${file}: ${html.length} characters, 5 markets, 24 sample cards, 3 languages, 4 FAQs, no JS/external assets\n`)
}
