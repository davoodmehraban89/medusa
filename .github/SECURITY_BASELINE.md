# Security automation baseline — owner fork

Reviewed: 2026-10-14  
Repository: `davoodmehraban89/medusa` (public; default branch `main`)  
Scope: propose security automation by PR only. **Not yet a passed security audit or production approval.**

## Baseline findings (before this PR)

1. `.github/dependabot.yml` already existed on `main`: root Yarn workspace, `/www`, and GitHub Actions had weekly checks but `open-pull-requests-limit: 0`, keeping ordinary version-bump PRs disabled. Dependabot **security-update PRs** still require enabling the corresponding repository setting.
2. No dedicated CodeQL or Gitleaks workflow was present in the inspected `.github/workflows/` directory on `main`.
3. Numerous workflows were imported from `medusajs/medusa` and depend on that organization's GitHub App tokens, Linear integration, or external bots. They should not be treated as functioning local security controls.
4. Actual Actions run 38534165110 (2026-10-14) — `Triage Dependabot Alerts` — failed at "Triage alerts"; its logs show the `GH_TOKEN` environment variable is empty and the script queries `/repos/medusajs/medusa/dependabot/alerts`, not this fork's owner/repository. No alerts were successfully triaged by that run.
5. Actual Actions run 38569275140 (2026-10-14) — `Security Advisories to Linear` — failed at GitHub App token creation (`Input required and not supplied: app-id`). This workflow is not a functioning security escalation for this fork.
6. Previous `Commerce storefront checks` run 38457109616 completed successfully on the separate `project/medusa-foundation-audit` PR branch. It demonstrates a working basic build/test job, **not** a security assessment.
7. Imported root `SECURITY.md` directs reporters to the upstream team's address `security@medusajs.com`. A fork-specific reporting policy and verified private contact mechanism are required before live launch.

**Important:** These are configuration and CI evidence findings, not proof of a code exploit, an exposed secret, or the absence of vulnerabilities. No existing Dependabot alert inventory or historical-secret scan has been verified yet.

## Controls introduced by this PR

| Control | File | Trigger | Intent |
| --- | --- | --- | --- |
| CodeQL JS/TS | `.github/workflows/security-codeql.yml` + `.github/codeql/codeql-config.yml` | PR/push on code or workflow changes; weekly schedule; manual | Check local app plus Medusa packages and scripts. Excludes build output/fixtures/tests, not production source. |
| CodeQL GitHub Actions | `.github/workflows/security-codeql.yml` | Same | Flag risky expressions and execution patterns in imported GitHub Actions YAML. |
| Gitleaks | `.github/workflows/security-secrets.yml` | All PRs, main push, weekly, manual | Scan Git history for accidental credentials. PR comments, SARIF artifacts and job summaries are disabled to reduce inadvertent disclosure of findings. |
| Dependabot storefront | `.github/dependabot.yml` | Weekly, after `commerce/package.json` is merged into main | Open reviewed dependency-update PRs for the standalone storefront, including security updates. Keep legacy root `open-pull-requests-limit: 0` behavior unchanged. |

GitHub Actions have minimum practical permissions: CodeQL `contents: read`, `security-events: write`, `actions: read`; Gitleaks `contents: read` only. Neither workflow has repository secrets or production infrastructure credentials.

## Validation gates

- [ ] Check that the CodeQL JavaScript/TypeScript job completes and uploads results.
- [ ] Check that the CodeQL GitHub Actions job completes and uploads results.
- [ ] Check that Gitleaks completes with no findings (or triage every finding privately).
- [ ] Confirm Dependabot config is accepted; verify alerts/security updates enabled in Settings > Security & analysis (connector cannot verify private admin settings).
- [ ] Review existing open alerts without dismissing them automatically.
- [ ] Ensure mandatory status checks are set before merging security-sensitive changes, when repository rules/plan allow.
- [ ] Address existing upstream-only automation failures in a separate, reviewed PR; do not supply private credentials merely to make vendor workflows run.
- [ ] Review any finding, remediate, and rerun until checks pass. Rotate any actually exposed secret; deleting its file alone is not sufficient.
- [ ] Adopt a fork-specific confidential vulnerability intake channel without sending user reports to an unaffiliated upstream contact.

## Deployment / security readiness

No credentials, production PSP integration, overseas corporate account, production server, or live checkout is provisioned by these changes. Passing these scans alone would not constitute compliance or secure production readiness.

## PR verification log

To be filled with exact Action run IDs, job conclusions and subsequent fixes after opening this PR. Do **not** check a box without evidence.
