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

const cachedLines = new Map()
function contextualEvidence(path, lineNumber) {
  // Inspect only inside CI; return labels, NEVER raw text.
  if (!path || path.startsWith("/") || path.split("/").includes("..")) return "invalid-path"
  if (!fs.existsSync(path)) return "historical-only-path"
  if (path.startsWith(".yarn/releases/")) return "generated-vendor-bundle"
  let lines = cachedLines.get(path)
  if (!lines) {
    lines = fs.readFileSync(path, "utf8").split(/\r?\n/)
    cachedLines.set(path, lines)
  }
  const index = Math.max(0, Math.min(lines.length - 1, Number(lineNumber) - 1 || 0))
  const excerpt = lines.slice(Math.max(0, index - 4), Math.min(lines.length, index + 6)).join("\n")
  const flags = []
  if (/__tests__|\.spec\.|\.test\./i.test(path)) flags.push("test-file")
  if (/www\/|\.mdx$|llms-full\.txt$|\.stories\./i.test(path)) flags.push("documentation-or-demo")
  if (/\b(?:example|for example|your_|replace|placeholder|dummy|fake|sample)\b/i.test(excerpt)) flags.push("example-marker")
  if (/\.\.\./.test(excerpt)) flags.push("ellipsis-placeholder")
  if (/\b(?:idempotency_key|mock|jest|expect\()/.test(excerpt)) flags.push("test-field")
  if (/\b(?:curl|authorization|bearer|x-publishable-api-key)\b/i.test(excerpt)) flags.push("http-example")
  if (/BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/.test(excerpt)) flags.push("pem-header")
  if (/BEGIN (?:RSA |EC )?PRIVATE KEY-----[\s\S]{50,4000}END (?:RSA |EC )?PRIVATE KEY/.test(excerpt) && !/\.\.\./.test(excerpt)) {
    flags.push("POSSIBLE-COMPLETE-PEM-REVIEW")
  }
  return flags.join("|") || "no-context-marker"
}

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
    `start_line=${Number.isFinite(Number(item.StartLine)) ? Number(item.StartLine) : "unknown"} ` +
    `source_evidence=${sanitize(contextualEvidence(path, item.StartLine))}`
  )
}
console.log("Counts grouped by path category and rule:")
for (const [name, count] of [...counts.entries()].sort()) {
  console.log(`  ${sanitize(name)}: ${count}`)
}
console.log("All detections require review. No allowlist or suppression was applied.")
