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

Persian (`fa-IR`, RTL) and English (`en`, LTR) are confirmed. Arabic remains a proposed enhancement, not an approved release requirement.

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
