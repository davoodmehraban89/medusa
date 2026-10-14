/**
 * CI-only helper: prints metadata about Gitleaks detections without revealing
 * Secret, Match, Content, surrounding source text, or full fingerprints.
 *
 * NEVER upload the original JSON report as an artifact, print it to logs, or
 * commit it. Logs are public on a public GitHub repository.
 */
import fs from "node:fs"

const reportPath = process.argv[2]
if (!reportPath || !fs.existsSync(reportPath)) {
  console.log("No Gitleaks JSON findings report available.")
  process.exit(0)
}

const raw = JSON.parse(fs.readFileSync(reportPath, "utf8"))
if (!Array.isArray(raw)) {
  throw new Error("Unexpected Gitleaks report format")
}

const isLikelyTestMaterial = (path) =>
  /(^|\/)(?:__tests__|tests?|fixtures?|__fixtures__|examples?|samples?|mocks?|docs?)(\/|$)|\.(?:test|spec)\.[jt]sx?$|\.(?:example|sample|template)(?:\.|$)/i.test(path)

const sanitize = (value, limit = 240) =>
  JSON.stringify(String(value ?? "").slice(0, limit))

const counts = new Map()
console.log(`Gitleaks finding metadata (NO secret values): ${raw.length} detections`)
for (const [index, item] of raw.entries()) {
  // A filename alone does NOT establish false-positive status.
  const path = String(item.File ?? "")
  const rule = String(item.RuleID ?? "")
  const kind = isLikelyTestMaterial(path) ? "test-or-documentation-path" : "other-path"
  const group = `${kind} / ${rule}`
  counts.set(group, (counts.get(group) ?? 0) + 1)

  console.log(
    `Finding ${index + 1}: kind=${kind} rule=${sanitize(rule, 100)} ` +
    `path=${sanitize(path)} commit_prefix=${sanitize(String(item.Commit ?? "").slice(0, 12), 12)} ` +
    `start_line=${Number.isFinite(Number(item.StartLine)) ? Number(item.StartLine) : "unknown"}`
  )
}
console.log("Counts grouped by path category and rule:")
for (const [name, count] of [...counts.entries()].sort()) {
  console.log(`  ${sanitize(name)}: ${count}`)
}
console.log("All detections require review. No allowlist or suppression was applied.")
