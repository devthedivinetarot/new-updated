#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 * 
 * STRATEGY:
 * - LOCAL (development):  STRICT — fails build if Tier 1 vars missing
 * - VERCEL (deployment):   PERMISSIVE — warns only, never fails
 * 
 * This ensures:
 *   ✅ Developers don't forget env vars locally
 *   ✅ Vercel builds never crash (can add vars later in dashboard)
 *   ✅ Runtime safety via lazy initialization (already in code)
 */

const fs = require('fs');
const path = require('path');

const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';

console.log(`\n${BOLD}🔍 Validating environment configuration...${RESET}\n`);

// Detect Vercel environment
const isVercel = !!(process.env.VERCEL || process.env.NOW || process.env.VERCEL_ENV);
const envLabel = isVercel ? `${CYAN}Vercel${RESET}` : `${YELLOW}Local${RESET}`;
console.log(`${CYAN}🌍 Mode: ${envLabel} ${isVercel ? '(warnings only)' : '(strict)'}${RESET}\n`);

// Load .env.local if it exists (local development)
const envPath = path.resolve(process.cwd(), '.env.local');
const localEnv = {};

if (fs.existsSync(envPath)) {
  console.log(`${YELLOW}📁 Loading .env.local...${RESET}`);
  const content = fs.readFileSync(envPath, 'utf-8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key) {
        localEnv[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      }
    }
  });
} else {
  console.log(`${YELLOW}⚠️  .env.local not found${RESET}`);
  if (!isVercel) {
    console.log(`   ${CYAN}→ Create from .env.example for local dev${RESET}\n`);
  }
}

// Tier 1: Core variables that MUST be set for production runtime
// These are used by critical features: DB, AI, Email
const tier1Keys = [
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY',
  'RESEND_API_KEY',
  'RESEND_FROM_EMAIL',
];

// Tier 2: Optional features (payments, blog, WhatsApp, video)
const tier2Keys = [
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'RAZORPAY_WEBHOOK_SECRET',
  'WORDPRESS_API_URL',
  'WORDPRESS_USERNAME',
  'WORDPRESS_APP_PASSWORD',
  'ELEVENLABS_API_KEY',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_WHATSAPP_NUMBER',
  'TWILIO_STATUS_CALLBACK_URL',
  'WHATSAPP_PHONE_NUMBER_ID',
  'WHATSAPP_TOKEN',
  'WHATSAPP_API_URL',
];

// Tier 3: Analytics & feature flags (all optional with defaults)
const tier3Keys = [
  'NEXT_PUBLIC_GOOGLE_ANALYTICS_ID',
  'NEXT_PUBLIC_CLARITY_PROJECT_ID',
  'NEXT_PUBLIC_GTM_ID',
  'NEXT_PUBLIC_ENABLE_PAYMENTS',
  'NEXT_PUBLIC_ENABLE_EMAILS',
  'NEXT_PUBLIC_SKIP_CRON',
  'OPENAI_KEY', // fallback key
];

const allKeys = [...tier1Keys, ...tier2Keys, ...tier3Keys];

let missingTier1 = [];
let missingTier2 = [];
let missingTier3 = [];

console.log(`${CYAN}📋 Checking environment variables...${RESET}\n`);

allKeys.forEach(key => {
  const value = process.env[key] || localEnv[key];
  const isSet = value && value.trim() !== '';
  
  // Mask secrets in output
  const isSecret = key.includes('KEY') || key.includes('SECRET') || key.includes('TOKEN') || key.includes('PASSWORD');
  const displayValue = isSet && isSecret ? '***set***' : (isSet ? value : '');
  
  if (isSet) {
    console.log(`  ${GREEN}✓${RESET} ${key}`);
  } else {
    // Determine tier for messaging
    let tier = 3;
    if (tier1Keys.includes(key)) tier = 1;
    else if (tier2Keys.includes(key)) tier = 2;
    
    const emoji = tier === 1 ? `${RED}●${RESET}` : tier === 2 ? `${YELLOW}○${RESET}` : `${CYAN}○${RESET}`;
    const tierName = tier === 1 ? 'Core' : tier === 2 ? 'Optional' : 'Analytics/Flag';
    
    console.log(`  ${emoji} ${key} ${CYAN}[${tierName}]${RESET}`);
    
    if (tier === 1) missingTier1.push(key);
    else if (tier === 2) missingTier2.push(key);
    else missingTier3.push(key);
  }
});

console.log('');

// DECISION: Block build locally if Tier 1 missing, but always allow Vercel
const shouldBlockBuild = !isVercel && missingTier1.length > 0;

if (shouldBlockBuild) {
  console.error(`${RED}${BOLD}❌ BLOCKING: ${missingTier1.length} core env var(s) missing${RESET}`);
  console.error(`${YELLOW}💡 Create .env.local from .env.example with real values${RESET}\n`);
  console.error(`   Missing:${RESET}`);
  missingTier1.forEach(k => console.error(`     ${RED}• ${k}${RESET}`));
  console.error(`\n   ${CYAN}See ENV_KEYS.md for details${RESET}\n`);
  process.exit(1);
}

// Vercel: continue with warnings (vars can be added in dashboard later)
if (isVercel && missingTier1.length > 0) {
  console.warn(`${YELLOW}⚠️  VERCEL: ${missingTier1.length} core variable(s) not set${RESET}`);
  console.warn(`   Build continuing. Add in Vercel → Settings → Environment Variables:`);
  missingTier1.forEach(k => console.warn(`     ${YELLOW}• ${k}${RESET}`));
  console.warn(`\n   ${CYAN}Runtime may fail if these remain unset${RESET}\n`);
}

// Optional features
if (missingTier2.length > 0) {
  console.log(`${YELLOW}ℹ️  ${missingTier2.length} optional variable(s) not set${RESET}`);
  console.log(`   Related features disabled (expected if not using them)\n`);
}

// Final summary
if (!shouldBlockBuild) {
  if (missingTier1.length === 0 && missingTier2.length === 0) {
    console.log(`${GREEN}${BOLD}✅ All environment variables configured${RESET}`);
    console.log(`   ${isVercel ? 'Vercel' : 'Local'} build approved.\n`);
  } else {
    console.log(`${YELLOW}⚠️  Ready with ${missingTier2.length} optional feature(s) disabled${RESET}\n`);
  }
}

process.exit(0);
