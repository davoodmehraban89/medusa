# Medusa Commerce — development bootstrap

This folder is the planned application workspace for the **single-merchant, five-market storefront**. It is separate from the upstream Medusa monorepo packages to reduce merge conflicts.

## Supported target markets

| Country | ISO code | Currency | Initial commercial focus |
| --- | --- | --- | --- |
| Iran | IR | IRR | Electronics and mixed categories |
| UAE | AE | AED | Iran-origin products |
| Oman | OM | OMR | Iran-origin products |
| Iraq | IQ | IQD | Iran-origin products |
| Qatar | QA | QAR | Iran-origin products |

Persian (`fa-IR`, RTL), Arabic (`ar`, RTL), and English (`en`, LTR) are confirmed requirements. Country/market selection is independent of the selected language.

## Architectural boundaries

- **Medusa backend and Admin:** retain upstream implementation until a reproducible development environment is validated.
- **Storefront:** separate application, to be added after the backend's API contracts and runtime are verified.
- **Inventory:** per-stock-location inventory, with Iran as the principal origin; overseas warehouse locations are optional until real locations are confirmed.
- **Checkout:** region-specific payment and fulfillment provider adapters; test-mode only until merchant authorization, contracts and compliance checks pass.
- **Pricing:** country-specific prices; IRR is the canonical rial unit, and toman presentation must be explicit. Never perform implicit currency conversion.
- **Origin:** a product's country of manufacture is separate from its stock location and shipment origin.

## Development milestones

1. **Environment verification:** Node 22 and repository-pinned Yarn 3.2.1; dependency install, build, test and boot logs.
2. **Backend instance:** create a dedicated Medusa project/instance backed by PostgreSQL, not an ad hoc edit of upstream packages.
3. **Storefront shell:** product listing, product detail, cart, localized UI and responsive layout.
4. **Commerce integration:** country selection, regional prices, stock-location availability, test checkout and order confirmation.
5. **Quality gates:** automated tests for all five markets, RTL/LTR, shipping eligibility, inventory reservations and secrets handling.
6. **Staging:** health checks, monitoring, backups, restore and rollback verification.

## Local prerequisite commands (not yet executed)

```bash
node --version  # should be v22.x
corepack enable
yarn --version  # repo pins 3.2.1
yarn install --immutable
```

The root repository is a large upstream source monorepo. Installation may require substantial resources. No successful installation or runtime has yet been demonstrated.

## Release blockers

- Merchant entity and PSP onboarding per market
- Real warehouse locations and carriers
- Specific SKUs and applicable product/export/import restrictions
- Tax, customs, refund and consumer-policy requirements
- Staging hosting, domain, secrets and backup policy

See `PROJECT_STATUS.md` for the verified project record.

## Storefront preview — new source files

The initial React/TypeScript/Vite storefront scaffold now lives in `commerce/`.

To run this **standalone preview** (requires Node.js 22 and npm; commands have not been verified in CI):

```bash
cd commerce
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173. The storefront displays the five configured markets and currencies with independent Persian/Arabic/English RTL/LTR controls. When no Medusa backend is configured, it shows an explicitly labeled **illustrative sample catalogue** with working search, category filters and sample detail views. Sample cards are not real stock, purchasable offers or price quotations. When a real backend and publishable key are configured, it requests Medusa Store API products by matching region. It **does not process orders, payments or live pricing**. Never commit `.env` or live secrets.

For the upstream monorepo, continue to use its pinned Yarn version. The standalone storefront uses npm until a workspace integration strategy is validated.

## Public UI preview — Cloudflare Pages

The **static development UI preview** is configured in Cloudflare Pages on the `project/medusa-foundation-audit` branch, independent of `main`:

- Preview project: `medusa-commerce-preview-dm`
- Public URL (available only once a Cloudflare build completes): `https://medusa-commerce-preview-dm.pages.dev/`
- Build root: `commerce`; build: `npm install --no-audit --no-fund && npm run build`; published directory: `dist`.
- Three languages: Persian (RTL), Arabic (RTL), and English (LTR).
- Country selection: Iran, UAE, Oman, Iraq, Qatar. Prices shown only as currency labels, not real sale prices.
- **No live API key, payment gateway, customer data, checkout, or production inventory is configured.** The catalog displays an unconfigured state until a real Medusa backend and publishable key are provisioned.

The preview must not be represented as an operating store. A public static UI deployment does not establish any commerce or security production acceptance.

### How to check the interactive preview

- Cloudflare deployment: https://medusa-commerce-preview-dm.pages.dev/
- Switch between Persian, Arabic and English; layout direction changes automatically.
- Change country: Iran shows sample electronics plus Iran-origin collections; the UAE, Oman, Iraq and Qatar show examples of Iran-origin collections only. All examples are illustrative, not inventory offers.
- Search and category filters operate on the examples. Open a sample card for its detail overlay; use Escape or the close button to dismiss it.
- Until backend credentials are configured, no legitimate add-to-cart, checkout, customer registration, stock verification or payment is available. The preview explicitly signals that fact.
- Every pull-request change to `commerce/` is checked by GitHub Actions using `npm test` and `npm run build`; Cloudflare Pages builds the development branch for its public static preview without changing `main`.
- If the site does not open for a visitor, first compare the canonical URL with the latest successful deployment URL in Cloudflare Pages and collect the exact browser error, network (Wi-Fi/mobile data) and country. A successful Cloudflare deployment alone does not guarantee reachability from every network.


## White-screen-safe accessible preview

The URL `https://medusa-commerce-access.davoodmehraban89.workers.dev/` is a **separate Cloudflare Worker** deployed from `commerce/edge/preview-worker.js`, independent of Vite and the `pages.dev` JavaScript bundles.

- Returns fully rendered HTML and inline CSS on the first response; **no browser JavaScript, external fonts, image CDN, or API** is needed.
- Country and language links are ordinary server-rendered HTTP GET navigation and work without JavaScript. Product sample cards are explicitly non-orderable. Search and category filtering are processed per request.
- A static HTML-only page is the fallback for users whose browser shows blank output on the interactive React preview.
- The worker returns 404 for unrelated paths and 405 for modifying HTTP methods. Nothing in this path accesses store data, payments, or other secrets.
- The default client-side React demo remains separately available at `https://medusa-commerce-preview-dm.pages.dev/`.
- **Limit:** a working outside-network check cannot prove the visitor's phone/carrier can reach `workers.dev`. If it also renders blank, collect the exact Safari/Chrome error, network type and VPN/DNS status; do not blindly assume a frontend-only problem.

The accessible Worker implementation is tracked and versioned in `commerce/edge/preview-worker.js`. After modifying it, update the deployed Worker and independently verify locale/market combinations. Never pretend committing a source file alone automatically redeploys this particular Worker.
