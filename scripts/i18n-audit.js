const fs = require("fs")
const path = require("path")

const EXCLUDE = ["node_modules", ".next", "dist", ".git", "build", "out"]

function scanDir(dir, results = []) {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const fullPath = path.join(dir, file)

    if (EXCLUDE.some(e => fullPath.includes(e))) {
      continue
    }

    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      scanDir(fullPath, results)
    } else if (/\.(tsx|ts|jsx|js)$/.test(file)) {
      const content = fs.readFileSync(fullPath, "utf8")
      scanFile(fullPath, content, results)
    }
  }

  return results
}

function scanFile(filePath, content, results) {
  const lines = content.split("\n")

  lines.forEach((line, lineNum) => {
    // Skip comment-only lines
    const trimmed = line.trim()
    if (trimmed.startsWith("//") || trimmed.startsWith("#") || trimmed.startsWith("/*") || (trimmed.startsWith("*") && !trimmed.includes(">"))) {
      return
    }

    // Skip if line contains mostly code keywords
    const codeKeywords = ["import ", "export ", "from ", "const ", "let ", "var ", "function ", "class ", "interface ", "type ", "enum "]
    if (codeKeywords.some(kw => trimmed.startsWith(kw))) {
      return
    }

    // Match JSX text: >Some text< (but not >{...}<)
    const jsxMatches = line.match(/>([^<{]+)</g)
    if (jsxMatches) {
      jsxMatches.forEach(m => {
        const text = m.replace(/[><]/g, "").trim()
        validateAndAdd(text, filePath, lineNum + 1, results, "jsx")
      })
    }

    // Match UI text attributes (not className/id/etc)
    const uiAttrMatches = line.match(/(children|placeholder|title|alt|aria-label|aria-placeholder|label|data-empty-text|data-placeholder|data-tooltip)="([^"]+)"/g)
    if (uiAttrMatches) {
      uiAttrMatches.forEach(m => {
        const match = m.match(/="([^"]+)"/)
        if (match) {
          const text = match[1].trim()
          if (text && text.length > 2) {
            validateAndAdd(text, filePath, lineNum + 1, results, "attr")
          }
        }
      })
    }
  })
}

function validateAndAdd(text, filePath, lineNum, results, source) {
  // Skip if empty or too short
  if (!text || text.length < 2) return

  // Skip JSX expressions
  if (text.includes("{") || text.includes("}")) return

  // Skip common false positives
  const falsePositives = [
    "className",
    "id",
    "data-",
    "aria-",
    "role",
    "type",
    "src",
    "href",
    "alt",
    "key",
    "ref",
    "onClick",
    "onChange",
    "onSubmit",
    "method",
    "action",
    "cursor",
    "fill",
    "stroke",
    "viewBox",
    "d:",
    " M",
    " L",
    " C",
    " Q",
    "from ",
    "to ",
    "start",
    "end",
    "delay",
    "duration",
    "ease",
    "style",
    "width",
    "height",
    "color",
    "background",
    "fill-rule",
  ]
  if (falsePositives.some(fp => text.includes(fp))) return

  // Skip if looks like a path or filename
  if (text.includes("/") || text.includes("\\") || (text.includes(".") && text.split(".").length > 1)) return

  // Skip common code patterns
  if (/^[a-z_]+$/i.test(text) && text.length < 15) return // short variable names
  if (text.startsWith("$") || text.startsWith(":")) return
  if (text.includes("\n") || text.includes("\t")) return
   if (/^\d+$/.test(text)) return // numbers only

   // Skip emojis-only text (decorative, not translations)
   if (/^[\p{Emoji}\s]+$/u.test(text)) return

   // Deduplicate by file+text
  const existing = results.find(r => r.file === filePath && r.text === text)
  if (existing) return

  results.push({
    file: filePath.replace(/\\/g, "/"),
    line: lineNum,
    text,
    source,
    key: generateKey(text)
  })
}

function generateKey(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 0)
    .join("_")
    .slice(0, 50)
}

// Run scanner
const results = scanDir(process.cwd())

// Group by file for easier processing
const grouped = results.reduce((acc, item) => {
  if (!acc[item.file]) acc[item.file] = []
  acc[item.file].push(item)
  return acc
}, {})

// Write report
const output = {
  summary: {
    totalHardcodedStrings: results.length,
    filesScanned: Object.keys(grouped).length,
    scannedAt: new Date().toISOString(),
  },
  files: grouped,
  flatList: results,
}

fs.writeFileSync(
  path.join(process.cwd(), "i18n-report.json"),
  JSON.stringify(output, null, 2)
)

console.log(`✅ Scan complete → i18n-report.json generated`)
console.log(`   📁 ${Object.keys(grouped).length} files scanned`)
console.log(`   🔍 ${results.length} hardcoded strings found`)

// Print top 10 if found
if (results.length > 0) {
  console.log("\n📝 Sample findings:")
  results.slice(0, 10).forEach(r => {
    console.log(`   ${r.file}:${r.line} → "${r.text}" [${r.source}]`)
  })
}
