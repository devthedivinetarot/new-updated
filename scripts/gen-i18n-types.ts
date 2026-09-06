// scripts/gen-i18n-types.ts
// Generate typed translation keys from translations.ts
// Run: npx ts-node scripts/gen-i18n-types.ts

import * as fs from 'fs';
import * as path from 'path';

const TRANSLATIONS_PATH = path.join(__dirname, '../src/lib/i18n/translations.ts');
const OUTPUT_PATH = path.join(__dirname, '../src/lib/i18n/types.ts');

function flattenObject(obj: any, prefix = ''): string[] {
  const keys: string[] = [];
  
  for (const key of Object.keys(obj)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    
    if (typeof value === 'object' && value !== null && !('en' in value)) {
      // Nested object - recurse
      keys.push(...flattenObject(value, fullPath));
    } else {
      keys.push(fullPath);
    }
  }
  
  return keys;
}

function extractTranslations() {
  const content = fs.readFileSync(TRANSLATIONS_PATH, 'utf-8');
  
  // Extract the TRANSLATIONS object
  const match = content.match(/export const TRANSLATIONS: Record<string, TranslationSet> = \{([\s\S]*?)\n\};/);
  if (!match) {
    console.error('Could not find TRANSLATIONS');
    process.exit(1);
  }
  
  return match[1];
}

function parseTranslations(translationsBlock: string): Record<string, any> {
  const result: Record<string, any> = {};
  
  // Simple parsing - extract top-level keys and their structure
  const lines = translationsBlock.split('\n');
  let currentKey = '';
  let indentLevel = 0;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//')) continue;
    
    const keyMatch = trimmed.match(/^(\w+):/);
    if (keyMatch) {
      currentKey = keyMatch[1];
    }
  }
  
  return result;
}

function generateTypes() {
  console.log('🔄 Generating i18n types...');
  
  // For now, read from existing types.ts if it exists, or use the manual list
  const existingTypesPath = path.join(__dirname, '../src/lib/i18n/types.ts');
  
  if (fs.existsSync(existingTypesPath)) {
    console.log('✅ Types already exist at src/lib/i18n/types.ts');
    console.log('💡 Edit this file manually to add new translation keys.');
    return;
  }
  
  console.log('⚠️ No types.ts found. Create it at src/lib/i18n/types.ts');
}

generateTypes();

// Also export a script to find raw strings in components
export function findRawStringsInComponents(srcDir: string): string[] {
  const violations: string[] = [];
  const rawPattern = /(["'])([a-z]+\.[a-z]+(?:\.[a-z]+)?)\1/g;
  
  function walkDir(dir: string) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!file.includes('node_modules') && !file.startsWith('.')) {
          walkDir(fullPath);
        }
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const matches = content.match(rawPattern);
        if (matches) {
          for (const match of matches) {
            const key = match.slice(1, -1);
            if (key.includes('.') && !key.startsWith('{') && !key.includes('//')) {
              violations.push(`${fullPath}: ${key}`);
            }
          }
        }
      }
    }
  }
  
  if (fs.existsSync(srcDir)) {
    walkDir(srcDir);
  }
  
  return violations;
}

// Run if called directly
if (require.main === module) {
  generateTypes();
  
  const srcDir = path.join(__dirname, '../src/components');
  const rawStrings = findRawStringsInComponents(srcDir);
  
  if (rawStrings.length > 0) {
    console.log('\n⚠️ Potential raw translation keys found:');
    for (const v of rawStrings.slice(0, 10)) {
      console.log('  ', v);
    }
    if (rawStrings.length > 10) {
      console.log(`  ... and ${rawStrings.length - 10} more`);
    }
  } else {
    console.log('✅ No raw translation keys detected');
  }
}