# Medusa Commerce — storefront design handoff (2026-10-15)

## Approved scope of this iteration

**Complete the visible, reviewable storefront design and user experience**, using the public GitHub Pages delivery method confirmed working on the owner's phone. This is a product-design iteration, **not** the launch of a transactional store.

### Public preview

- Persian: https://davoodmehraban89.github.io/medusa/
- English: https://davoodmehraban89.github.io/medusa/en.html
- Arabic: https://davoodmehraban89.github.io/medusa/ar.html
- Publishing branch: `project/medusa-foundation-audit`; source folder: `/docs`.
- The branch contains an **unmerged Draft PR #2** into `main`.

### Implemented user journeys

1. Read the landing hero and clearly labeled preview-only notice.
2. Jump between Collections, Experience, Roadmap and FAQ using in-page navigation.
3. Select Iran, UAE, Oman, Iraq or Qatar. The native HTML radio selection changes the displayed collection without JavaScript. Default is Iran.
4. Browse 8 illustrative categories for Iran (4 digital and 4 Iran-origin) or 4 illustrative Iran-origin categories for each other market.
5. Open native HTML product-sample details. There are **no** live product prices, inventory, cart buttons or promised fulfillment.
6. Switch page language between Persian (RTL), Arabic (RTL) and English (LTR). **Limitation:** changing language resets the sample-market selection to the default Iran state because these are independent static HTML pages without runtime persistence.
7. Read transparent capability/rollout notes and four FAQ items.

### Design system / UX decisions

- Primary surface palette: evergreen `#143d30`, cream `#fbfaf6` and muted botanical accents; understated card backgrounds and clear readable text contrast.
- Text uses local system fonts (Tahoma / Segoe UI / Arial); no Google Fonts or external font fetches.
- Illustrative categories use inline SVG artwork without remote assets.
- Adaptive layout includes mobile, tablet and desktop CSS breakpoints (1120, 780 and 420 CSS pixels). Mobile collapses to a single-column hero and a two-column example grid.
- Semantic HTML headings, navs, sections, product articles and native `details` are used with visible keyboard focus and a skip link. Radio labels rely on native semantics, with keyboard focus indicated via CSS.
- HTML pages include inline CSS and zero scripts, remote images, iframes, API requests or external style references. This is deliberate because previous React/Cloudflare previews displayed blank on the owner's mobile network.

### Country / localization constraints

| Market | Currency shown as a code only | Example merchandising |
| --- | --- | --- |
| Iran (IR) | IRR | Electronics + Iran-origin collections |
| UAE (AE) | AED | Iran-origin collections |
| Oman (OM) | OMR | Iran-origin collections |
| Iraq (IQ) | IQD | Iran-origin collections |
| Qatar (QA) | QAR | Iran-origin collections |

- Currency codes are **not prices or FX exchange rates**; IRR is rial, not toman.
- Product-country examples do **not** mean shipping, export, provider availability or sanctions compliance has been established.
- Arabic / Persian directions are RTL, English LTR, regardless of selected country.
- Sample illustrations are not photographic claims about a specific real product.

### Validation gates and evidence

- The three static HTML pages are validated in CI by `commerce/scripts/validate-static-preview.mjs`.
- The independent static validator asserts all five markets, the category/panel counts, three locales, four FAQs, small-screen and accessibility hooks, absence of scripts/external asset dependencies, and correct explicit market currencies.
- The existing storefront CI still runs Vitest and the Vite/TypeScript build for the React application in `commerce/`. That app is **not** the `/docs` GitHub Pages static site.
- GitHub Actions `Commerce storefront checks` run **38764265249** passed after the redesign and a11y correction.
- GitHub Pages `pages build and deployment` run **38764265134** passed for the redesigned static site.
- An independent external HTML fetch for all three live public URLs confirmed the hero, collections, experience, roadmap, FAQ, 24 sample-card instances across market panels and four FAQ entries on each page.
- The owner had previously confirmed that the **earlier** GitHub Pages preview loaded on their iPhone. **The latest redesigned pages have not yet been re-confirmed by the owner on their specific device.**

### Open items and non-goals

- No live Medusa Admin / Backend database, Store API region/product mapping, stock locations, rate quotes, users, sessions, shopping cart or payment provider is configured by this design iteration.
- No legal, export, merchant-of-record, payment or fulfillment authorization has been established for the target markets.
- **Design maintenance limitation:** all three HTML pages embed localized content and a duplicated CSS snapshot for offline reliability. Future design changes must be applied to all three. The CI validator detects structural drift, not pixel-level design drift. Before the project scales, introduce a reviewed common HTML generator that emits independent inline-CSS locale pages.
- Before production, build a fully working Medusa backend, add real verified product content, connect regional pricing/inventory, enable tested checkout behind appropriate provider contracts, run security and end-to-end tests, and obtain explicit release approval.
- GitHub PR #2 must not be merged automatically. Project branch updates publish only the static design preview.

## Acceptance definition

This **design iteration** is complete when all three public pages deploy and render with the planned navigation and sample interactions, GitHub Actions validators pass, and the owner can review the result on the intended device. This does not constitute production readiness.
