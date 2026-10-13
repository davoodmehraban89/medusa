# AvanTech on Medusa — Implementation Scope

Source: AvanTech Discovery Book v1.0 (22 pages, September 2026).

## Product intent
A Persian-first (RTL), English-capable technology and gaming commerce platform built on Medusa. This repository is the implementation target, not a completed deployment.

## Architecture boundaries
- Medusa backend owns products, variants, inventory, carts, orders, payment and fulfillment workflows.
- A separately deployed storefront owns bilingual/RTL user experience, brand worlds, SEO, comparison and buying guides.
- Custom modules/workflows own category attribute schemas, product compatibility, source provenance, import review, Iran-specific integrations, consent and audit history.
- External data imports must create drafts and require human review before publication.
- Payment, SMS, shipping and marketplace feeds use provider adapters; no provider credentials in source control.
- Never claim an integration is operational without real credentials and end-to-end tests.

## Functional scope extracted from the Discovery Book
1. Brand/catalog worlds: Apple, PlayStation, Xbox, Nintendo, Meta/XR and selected mobile devices.
2. Structured product family, variants, specifications, compatibility, media, pricing, stock and provenance.
3. Secure product URL import, normalization, deduplication, draft/review/publish workflow.
4. Category-specific faceted search, product comparison, stable filter URLs.
5. Persian/English storefront, brand theming, accessibility and responsive navigation.
6. Cart, accounts, addresses, consent, order/payment/shipping/returns/refunds.
7. Iran adapters: payment gateways, SMS/OTP, carriers, Torob/Emalls feeds and trust badges.
8. SEO: canonical, sitemap, hreflang, schema.org, redirects, guides and content.
9. Admin: products, customers, orders, inventory, content, campaigns, integrations, audit and health checks.
10. Abandoned cart recovery respecting marketing consent, analytics and operational reporting.

## Release gates
- Database migrations and seed data are reproducible.
- Inventory and financial transitions are transactional and idempotent.
- API authorization, SSRF controls, rate limiting and secret management are tested.
- RTL/LTR, mobile and desktop, SEO metadata, checkout and returns are tested.
- CI passes before production deployment.

## Current status
Scope extraction started. No application implementation, integration or production deployment has yet been verified.
