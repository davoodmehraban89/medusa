# PROJECT_STATUS.md — Medusa implementation control center

> Updated: 2026-10-13. Evidence-based status only. This is a development baseline, **not** a claim of production readiness.

## Mission
Turn the imported Medusa open-source commerce monorepo into a verified, runnable foundation for a professional single-merchant online store (MVP), with a modular architecture for future growth. Preserve upstream compatibility while keeping local changes reviewed.

## Current verified state
- Repository: `davoodmehraban89/medusa`; default branch: `main`.
- Imported source snapshot is present, including the original workflow files. Import completion does **not** prove a successful build, test, or deployment.
- Upstream: `medusajs/medusa`, branch `develop`.
- Controlled upstream workflow: `.github/workflows/medusa-upstream-review.yml`; first run 38408879299 fetched upstream and pushed a review branch but **failed to open a PR** because GitHub Actions was not permitted to create pull requests.
- Draft upstream review PR: #1 (`automation/medusa-upstream-review` → `main`). Do not merge before auditing differences, including executable-bit changes.
- Application runtime, databases, credentials, Storefront, Admin availability, payments, and end-to-end order flow are **not verified**.
- The upstream project is a large TypeScript/Yarn workspace monorepo; it is not itself a turnkey deployed store.

## Five workstreams (functional responsibilities, not claims of autonomous agents)
| Workstream | Owner responsibility | Immediate deliverable | Acceptance criteria | State |
| --- | --- | --- | --- | --- |
| 1. Product | Scope and target customer/use case | MVP requirements and explicit exclusions | Owner accepts MVP and success metrics | Product direction confirmed; MVP details pending |
| 2. Architecture & DevOps | Runtime and reproducible setup | Versioned environment specification and dev setup | Clean environment starts Backend + Admin | Not started |
| 3. Application & UX | Storefront/Admin integration | Minimal purchase journey design and working UI | Browse → cart → checkout in test environment | Not started |
| 4. QA & Security | Tests, dependency/secrets review | CI baseline, smoke tests, threat/risk register | Repeatable passing checks; no leaked secrets | Not started |
| 5. Release & Documentation | Deployment, operations, documentation | Staging deployment and runbook | Health checks, backup/restore, rollback verified | Not started |

The project coordinator integrates these workstreams, reviews dependencies and blockers, and prevents changes to unrelated repositories.

## Delivery gates
- **G0 — Source custody:** imported to GitHub; **done** (does not include runtime verification).
- **G1 — Reproducible development:** Node/Yarn versions pinned, dependencies install, Backend/Admin boot; **pending**.
- **G2 — Commerce smoke test:** product, inventory, cart, checkout using test provider; **pending**.
- **G3 — Target-market MVP:** selected use case, storefront, payment/shipping integrations, localization if needed; **scope selected: professional single-merchant store; detailed requirements pending**.
- **G4 — Staging release:** CI, security checks, backups, monitoring, rollback; **pending**.
- **G5 — Production readiness:** business sign-off and production acceptance; **pending**.

Do **not** assign an overall completion percentage until the MVP scope and gate weights are agreed. Current code import is 100% of the transfer task; production readiness is unverified.

## Immediate actions
1. Review upstream PR #1, especially mode-only changes and any deletions. **Do not merge blindly.**
2. Fix upstream sync permissions: repository Settings → Actions → General → Workflow permissions → enable `Allow GitHub Actions to create and approve pull requests` **only after approval**; alternatively use an approved GitHub App/PAT with minimum required permissions. Re-test PR creation.
3. Establish a reproducible environment and run install/build/test checks on a safe branch; record exact logs and versions.
4. Business target confirmed: **professional online store**, initially single merchant. Define catalog, checkout, payment and shipping requirements; do not add marketplace or store-builder capabilities without a new decision.
5. Develop on feature branches, review via PR, and update this file with evidence and blockers after each completed milestone.

## Change log
- 2026-10-13: Initial source transfer verified in GitHub.
- 2026-10-13: Upstream sync workflow configured and tested; PR creation failed due to GitHub permissions; draft PR #1 opened separately.
- 2026-10-13: Project status and delivery gates established in branch `project/medusa-foundation-audit`.

## Next check-in format
Record date, commit/PR, objective, tests run with results, unresolved blockers, owner, and next acceptance gate. Never mark an item done on code presence alone.

## Confirmed product direction (2026-10-13)
- **Target:** professional online store, initially a single merchant (not multi-vendor marketplace or SaaS store-builder).
- **MVP customer journey:** browse/search products → view variants and stock → add to cart → enter customer/address details → select shipping and payment → place order → receive confirmation → track order status.
- **MVP admin journey:** create/edit products and variants; maintain prices and inventory; manage orders, fulfillment and customers; configure basic promotions.
- **Architecture:** Medusa backend + Admin, separate responsive storefront, PostgreSQL, required infrastructure/services selected during setup. Keep provider integrations modular.
- **Initial acceptance:** local/staging environment starts reliably; one test product completes an end-to-end order using sandbox/test payment; inventory/order state updates correctly; basic responsive and accessibility checks pass; secrets are excluded from Git.
- **Out of scope until requested:** multi-vendor marketplace, multi-tenant store-builder, mobile native apps, AI agents, complex ERP integration.
- **Unresolved business decisions:** exact launch countries, product category, payment providers, shipping providers, brand and domain. These affect localization and live launch but do not block the technical foundation.
- **Progress statement:** product direction confirmed; no working storefront or passing end-to-end test has yet been demonstrated.

## Confirmed market scope — Iran + international (2026-10-13)
- The store must serve **Iranian and international markets** through a single modular commerce platform; country-specific payment/shipping availability must be verified before launch.
- **Localization:** Persian (fa-IR) with RTL layout and English (en) with LTR layout; language choice should be explicit, persisted and testable. Prepare translation keys rather than hard-coded interface strings.
- **Regions/currencies:** define Medusa sales regions and supported currencies explicitly. Iran display can use toman while backend monetary units must be normalized and documented (IRR/rial vs toman conversion). International prices must use configured currencies; do not imply live FX conversion without an FX provider.
- **Payments:** separate payment-provider configuration by region. Use sandbox/test flows first. Iranian gateways and international PSPs require their own eligibility, legal/compliance and account checks; never assume a provider can process both.
- **Shipping/taxes:** region-based shipping methods, address validation, tax rules and customs responsibilities must be configurable; do not hard-code country rules.
- **Catalog:** shared products with market-specific pricing, availability and publication where appropriate; test cross-region cart and checkout restrictions.
- **Security:** no production payment credentials in Git; validate webhook signatures, restrict administrative access and handle personal data by applicable jurisdiction.
- **Acceptance criteria:** demonstrate fa-IR/RTL and en/LTR pages, IR region test checkout and one international region test checkout, correct price unit and shipping choices, and region isolation in orders. A successful test is not proof of live PSP eligibility.
- **Open decisions:** which international countries first, initial product category, whether prices are managed independently or through an FX feed, preferred providers, hosting jurisdiction and domain.
- **Status:** requirements recorded; localization, providers, UI and end-to-end tests **not yet implemented or verified**.

## International launch markets confirmed (2026-10-13)
- Iran (IR), United Arab Emirates (AE), Oman (OM), Iraq (IQ), and Qatar (QA) are the initial target countries. No other international countries are in phase one.
- Candidate local currencies: IRR (rial; toman as explicitly labeled presentation only), AED, OMR, IQD, QAR. Store currency units and minor-unit rounding must be verified per provider and Medusa configuration before implementation; do not assume all currencies have two decimals.
- Persian and English storefront locales are required; Arabic is a recommended additional locale for AE/OM/IQ/QA but not yet approved as a release requirement.
- Region-level payment, tax, shipping, customs, address formats, product restrictions and merchant eligibility require country-specific validation. No live gateway or shipping provider has been selected or integrated.
- Test acceptance: selectable shipping country for all five markets, correct configured price currency and unit, available shipping/payment options by country, and test checkout per configured region. Do not imply live payment availability.
- Product category and seller's country/legal entity remain open decisions that affect payment eligibility, export and tax rules.

## Fulfillment and inventory model confirmed (2026-10-13)
- **Multi-country stock locations**, with **Iran as the primary dispatch and replenishment origin**. Other warehouses may hold local inventory in UAE, Oman, Iraq and/or Qatar as operations expand; their exact locations are not yet confirmed.
- Use Medusa stock locations, inventory levels, sales channels, fulfillment sets and shipping options rather than one global stock count. Inventory availability must be resolved per sales region/address and eligible fulfillment location.
- Phase-one fulfillment routing policy: prioritize an eligible in-country warehouse with available stock; otherwise consider Iran-origin cross-border shipment only where carrier, export/import restrictions, duties and customer disclosure permit. Do not promise automatic cross-border shipping without verified carriers and compliance.
- Prevent overselling: reserve stock at checkout, handle cancellation/refund/release, split shipments only where operationally supported, and define backorder policy explicitly.
- Maintain per-location inventory and shipment tracking, with an admin-visible audit trail of transfers, stock adjustments and fulfillment decisions.
- Pricing, payments, customs, sanctions/export controls and import taxes require jurisdiction-specific legal/provider verification before live operation; software design alone does not establish permission to ship or accept payments.
- **Acceptance scenarios:** (1) Iran-origin domestic order; (2) local-country stock order; (3) no local stock with eligible Iran-origin route; (4) no legal/available route produces a clear unavailable-shipping message; (5) stock reservation and cancellation restore correct location-level quantity.
- **Outstanding operational inputs:** actual warehouse countries/addresses, SKU/product category, cross-border shipping partners, merchant legal entities, Incoterms/duties responsibility, returns address and service levels.
- **Implementation status:** architecture requirement recorded; no warehouse configuration, inventory routing, or fulfillment tests have yet been run.

## Catalog and merchandising strategy confirmed (2026-10-13)
- **Mixed-category retail catalog** rather than a single vertical.
- **Iran market:** electronics are the primary commercial focus; allow other product categories.
- **UAE, Oman, Iraq and Qatar:** primary focus on products originating from Iran; allow other compliant categories as the business evolves.
- Treat **country of origin** (e.g. Iran) as structured product/variant metadata, distinct from warehouse location, seller jurisdiction and shipping origin. Never infer origin merely from the warehouse country.
- Support country/region-specific assortment, publication, prices, stock, restrictions, tax and fulfillment eligibility; a product may be sellable in Iran but not in every export market.
- Electronics requirements to evaluate: serial/IMEI where applicable, warranty jurisdiction, voltage/plug compatibility, battery/dangerous-goods restrictions, authenticity and returns/RMA.
- Export-product requirements to evaluate: origin labeling, HS/customs classification, packaging/expiry/storage for applicable categories, import permissions, country-specific product restrictions and duty/tax disclosure.
- **Acceptance:** electronics product listed and test-purchased in Iran; Iran-origin product listed and test-purchased in at least one eligible foreign test region; unsupported cross-border product cannot be checked out; inventory is reserved at correct stock location.
- **Not yet known:** precise SKUs/categories for exports, brands, regulated items, seller legal entity, carriers, actual warehouse locations, product compliance documentation.
- **Status:** requirements documented only; no category rules, listings, shipping routes or checkouts implemented or verified.

## Merchant legal structure and partner strategy (2026-10-13)
- **Current:** No registered company or legal entity outside Iran.
- **Future:** Establish an overseas entity when commercially justified; may collaborate with friends who have companies/residency in target markets, subject to verified written agreements and provider approvals.
- **Architecture decision:** Design payment, merchant-of-record, tax, settlement and fulfillment settings as country/partner-specific configurations, not assumptions that one Iran-based entity can legally process all five markets.
- **Release phases:** (1) build/test multilingual multi-region storefront with sandbox payments and simulated shipping; (2) launch only markets where an authorized seller, PSP, shipping and tax arrangements are verified; (3) add partner-based or owned foreign entities after onboarding/compliance checks.
- **Partner onboarding safeguards:** independently verify legal entity, beneficial ownership, merchant-of-record role, payment processor authorization, bank/settlement ownership, contract, refunds/chargebacks, data protection, taxes and export/import/sanctions restrictions. A friend's residency/company does not automatically authorize use of their merchant account or enable cross-border transactions.
- **Hard gate:** no live payment routing through another person's account, false merchant representation, or production activation without formal authorization and provider acceptance.
- **Status:** business constraint recorded; no external company, contract, bank account, PSP onboarding or production processing has been verified.

## Technical implementation start (2026-10-13)
- Created `commerce/README.md` with dedicated application boundary, five-market delivery plan and local prerequisite commands. Commit `984866f`.
- Created `commerce/src/config/markets.ts` with typed country/currency/locale definitions, product-origin policy type and explicit rial-to-toman helper. Commit `f217a8a`.
- These are **source/configuration scaffolding only**. No storefront runtime, package install, automated test, database, payment or deployment has been verified.
- Next technical gate: establish executable storefront package and test harness; verify Node 22/Yarn 3.2.1 setup and Medusa backend instance on an authorized runner.

## Storefront source implementation (2026-10-13)
- Created a standalone React/TypeScript/Vite scaffold in `commerce/`: `package.json`, `index.html`, `tsconfig.json`, `vite.config.ts`, `.env.example`, `src/main.tsx`, `src/styles.css`.
- Implemented a responsive, static storefront landing view with five-market selection, currency labels, and Persian RTL / English LTR UI switching. The view explicitly states that catalog and checkout are inactive.
- Updated `commerce/README.md` with standalone npm preview commands. These commands have **not been run or tested** in this environment; no backend connectivity or successful build is claimed.
- Next gate: dependency installation and TypeScript build in CI or an authorized runtime; connect a real Medusa backend instance, region APIs and publishable key, then add product listings and integration tests.

## Arabic language approved and initial UI implemented (2026-10-13)
- Arabic (`ar`, RTL) is now a **required third language** alongside Persian (`fa-IR`, RTL) and English (`en`, LTR).
- Updated `commerce/src/config/markets.ts` and `commerce/src/main.tsx` with Arabic locale, language switch and translated initial storefront UI. Language choice does not automatically change the market/currency selection.
- **Verification pending:** dependencies/build and browser RTL/LTR testing have not yet been run; complete translation coverage of product data, checkout and transactional messages is not yet implemented.

## Catalog integration and isolated CI added (2026-10-13)
- Added `commerce/src/api/catalog.ts`: fetches Medusa Store API regions, resolves the selected country to an enabled region, requests public product summaries with `region_id` and publishable key, validates API responses and exposes typed errors.
- Connected `commerce/src/main.tsx` to the catalog fetcher with abortable requests, loading/error/empty states and responsive product cards. Product prices and checkout remain intentionally disabled until validated region pricing and cart flows exist.
- Added Vitest test source for all five market region mappings, invalid responses, missing publishable keys and locale/currency utilities; added `commerce/.gitignore` and Vite type declarations.
- Added `.github/workflows/commerce-checks.yml` for Node 22 isolated `commerce/` npm test/build on PR and feature branch pushes. **CI run status has not been checked; no passing tests/build are claimed.**
- Engineering follow-up: check Actions run output, fix any TS/build/test issues, configure actual Medusa backend regions and publishable key, validate Store API/CORS, then implement product details and cart.

## Security and fork CI workstream — verified update 2026-10-14

- Security workstream implemented in a separate **Draft, unmerged** PR #3: https://github.com/davoodmehraban89/medusa/pull/3. Its source branch is `security/codeql-dependabot-gitleaks`; **not on `main`**.
- Added candidate controls: CodeQL for JS/TS and GitHub Actions, Gitleaks on incoming commits and reachable history, Dependabot actions update policy, owner-specific vulnerability reporting document, and safeguards for upstream-only automation / source synchronization.
- Initial 21 candidate Gitleaks detections were sourced to the imported Medusa snapshot and reviewed as sample/test/docs/vendor cases. Only their original-commit fingerprints were allowlisted; no product/provider credential was proven compromised, and no live account was accessed or rotated.
- Evidence: Gitleaks history + diff **run 38624077121 passed**; CodeQL JS/TS + Actions **run 38624077199 passed**; upstream-review **run 38628696228 passed**. These runs are not necessarily the latest PR head; final verification must inspect the latest checks.
- Imported Medusa monorepo CI previously failed because ZIP import stripped executable bits on shell scripts. Targeted shell-invocation and non-mutating diff fixes are included in PR #3; the complete Backend/Admin test and checkout still require independently passing verification.
- The standalone commerce storefront's existing CI run **38457109616 passed** (Node 22 dependency installation, unit tests, TypeScript build). This does **not** establish a running Medusa backend, checkout, or production readiness.
- Unresolved requirements before release: verify GitHub Dependabot Alerts/Security Updates, private vulnerability intake, review CodeQL alert inventory in Security tab, configure confirmed backend + database + real market integrations, test end-to-end orders.
- IMPORTANT: Neither security PR #3 nor storefront PR #2 nor upstream PR #1 is merged. Do not merge `main` without explicit approval.
