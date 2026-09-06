const fs = require('fs')
const path = require('path')

const REPORT_PATH = path.join(process.cwd(), 'i18n-report.json')
const TRANSLATIONS_PATH = path.join(process.cwd(), 'src', 'translations', 'index.ts')

function loadReport() {
  if (!fs.existsSync(REPORT_PATH)) {
    console.error('❌ i18n-report.json not found. Run: node scripts/i18n-audit.js')
    process.exit(1)
  }
  return JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8'))
}

function loadTranslations() {
  if (!fs.existsSync(TRANSLATIONS_PATH)) {
    console.error('❌ translations/index.ts not found.')
    process.exit(1)
  }
  const content = fs.readFileSync(TRANSLATIONS_PATH, 'utf8')
  // Extract english object using simple regex (works for our generated format)
  const match = content.match(/english:\s*{([^}]+)}/)
  if (!match) {
    console.error('❌ Could not parse translations file.')
    process.exit(1)
  }
  const englishBlock = match[1]
  // Extract keys
  const keys = englishBlock.match(/"([^"]+)":/g) || []
  const translationKeys = new Set(keys.map(k => k.replace(/"/g, '').replace(/:$/, '')))
  return translationKeys
}

function generateKey(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0)
    .join('_')
    .slice(0, 50)
}

function main() {
  const report = loadReport()
  const translationKeys = loadTranslations()
  
  const missing = []
  
  report.flatList.forEach(item => {
    const key = generateKey(item.text)
    if (!translationKeys.has(key)) {
      missing.push(item)
    }
  })
  
  if (missing.length > 0) {
    console.log('\n❌ Found hardcoded text not in translations store:')
    missing.forEach(item => {
      console.log(`   ${item.file}:${item.line} → "${item.text}"`)
      console.log(`      Suggested key: ${generateKey(item.text)}`)
    })
    console.log('\n👉 Fix: Run "node scripts/i18n-sync.js" to add missing keys')
    console.log('   Then update your code to use t("key") for these strings.\n')
    process.exit(1)
  } else {
    console.log('✅ All hardcoded strings have translation keys')
  }
}

main()
