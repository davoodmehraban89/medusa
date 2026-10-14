# Security policy — Medusa storefront fork

This repository is maintained by **davoodmehraban89** as an independent
storefront project based on upstream [Medusa](https://github.com/medusajs/medusa).
It is not operated by the Medusa upstream maintainers.

## Report a vulnerability privately

Do **not** post passwords, private keys, proof-of-concept exploits, customer
information, or unpublished vulnerability details in public GitHub issues or
pull requests.

- If this repository has GitHub **Private vulnerability reporting** enabled,
  use the **Security → Report a vulnerability** action in this repository.
- If private reporting is not enabled, the repository owner must establish and
  publish a verified private intake channel **before production launch**.
  Until then, confidential vulnerability reporting is an unresolved blocker;
  do not disclose sensitive details through public comments.
- If the issue affects the original upstream Medusa project independently of
  this fork, use the security-reporting process published in the **upstream**
  `medusajs/medusa` repository. The upstream contact does not accept
  responsibility for this project's custom application or infrastructure.

## Scope

Assess the custom storefront, Medusa-derived backend, CI workflows, API
configuration, user authorization, dependencies, order data, and payment
integrations. Never attempt unauthorized access to other systems.

Any credential actually found in source history must be revoked/rotated at
its provider and access logs reviewed. Removing a file or adding a Gitleaks
fingerprint to an ignore list does not invalidate an exposed credential.

Automated CodeQL/Gitleaks/Dependabot checks supplement but do not replace
manual security review and end-to-end testing.

**Current status:** development only; no production security acceptance has
been issued, and a verified private intake method is not yet confirmed.
