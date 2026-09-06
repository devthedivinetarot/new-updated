const fs = require("fs")
const path = require("path")

const REPORT_PATH = path.join(process.cwd(), "i18n-report.json")
const TRANSLATIONS_DIR = path.join(process.cwd(), "src", "translations")
const TRANSLATIONS_FILE = path.join(TRANSLATIONS_DIR, "index.ts")

function loadReport() {
  if (!fs.existsSync(REPORT_PATH)) {
    console.error("❌ i18n-report.json not found. Run: node scripts/i18n-audit.js first")
    process.exit(1)
  }
  return JSON.parse(fs.readFileSync(REPORT_PATH, "utf8"))
}

function ensureTranslationsDir() {
  if (!fs.existsSync(TRANSLATIONS_DIR)) {
    fs.mkdirSync(TRANSLATIONS_DIR, { recursive: true })
  }
}

function loadExistingTranslations() {
  if (fs.existsSync(TRANSLATIONS_FILE)) {
    const content = fs.readFileSync(TRANSLATIONS_FILE, "utf8")
    // Extract the JSON object from the file
    const match = content.match(/export const translations = ({[\s\S]*?});/)
    if (match) {
      try {
        return eval("(" + match[1] + ")")
      } catch (e) {
        return { english: {}, hinglish: {}, hindi: {} }
      }
    }
  }
  return { english: {}, hinglish: {}, hindi: {} }
}

function saveTranslations(translations) {
  const content = `export const translations = {
  english: ${JSON.stringify(translations.english, null, 2)},
  hinglish: ${JSON.stringify(translations.hinglish, null, 2)},
  hindi: ${JSON.stringify(translations.hindi, null, 2)}
};

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.english

// Auto-generated keys from i18n-audit.js
// Run: node scripts/i18n-sync.js
`

  fs.writeFileSync(TRANSLATIONS_FILE, content)
  console.log("✅ Translations store updated")
}

function syncTranslations() {
  const report = loadReport()
  const existing = loadExistingTranslations()
  const newKeys = []
  const updatedKeys = []

  // Add missing keys
  report.flatList.forEach(item => {
    const key = item.key

    if (!existing.english[key]) {
      existing.english[key] = item.text
      newKeys.push(key)
    } else if (existing.english[key] !== item.text) {
      // Existing text differs, flag for review
      console.log(`⚠️  Mismatch for "${key}": "${existing.english[key]}" ≠ "${item.text}"`)
    }
  })

  // Save updated translations
  saveTranslations(existing)

  console.log(`\n📊 Sync Summary:`)
  console.log(`   New keys added: ${newKeys.length}`)
  console.log(`   Total keys: ${Object.keys(existing.english).length}`)
  
  if (newKeys.length > 0) {
    console.log("\n🆕 New keys:")
    newKeys.slice(0, 20).forEach(k => console.log(`   ${k}`))
    if (newKeys.length > 20) {
      console.log(`   ... and ${newKeys.length - 20} more`)
    }
  }

  // Generate a migration file for manual review
  generateMigrationFile(report.flatList, existing)
}

function generateMigrationFile(flatList, existing) {
  const missingHinglish = []
  const missingHindi = []

  Object.keys(existing.english).forEach(key => {
    if (!existing.hinglish[key]) {
      missingHinglish.push({ key, text: existing.english[key] })
    }
    if (!existing.hindi[key]) {
      missingHindi.push({ key, text: existing.english[key] })
    }
  })

  const migrationContent = `
// ============================================
// I18N MIGRATION GUIDE
// ============================================
// 1. Review keys added in this sync
// 2. Add Hinglish translations (for Indian users)
// 3. Add Hindi translations (for Hindi readers)
// 4. Update components to use t() hook
// 
// Usage: const { t } = useTranslation()
//        t("${missingHinglish.length > 0 ? missingHinglish[0].key : "example_key"}")
//
// ============================================

export const pendingTranslations = {
  hinglish: ${JSON.stringify(missingHinglish.reduce((acc, item) => ({ ...acc, [item.key]: "" }), {}), null, 2)},
  hindi: ${JSON.stringify(missingHindi.reduce((acc, item) => ({ ...acc, [item.key]: "" }), {}), null, 2)}
};

// Stats
export const translationStats = {
  totalKeys: ${Object.keys(existing.english).length},
  pendingHinglish: ${missingHinglish.length},
  pendingHindi: ${missingHindi.length},
  completed: ${Object.keys(existing.english).length - Math.max(missingHinglish.length, missingHindi.length)}
};
`

  fs.writeFileSync(
    path.join(TRANSLATIONS_DIR, "migration.ts"),
    migrationContent
  )
}

// Run
syncTranslations()
