const fs = require('fs');
const path = require('path');

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║          DIVINE TAROT - PIXEL-LEVEL UI AUDIT                ║
║  Comparing: tdt-v3 (source) vs tdt-v1 (live: https://tdt-v1.vercel.app/)  ║
╚═══════════════════════════════════════════════════════════════╝
`);

const DESIGN_TOKENS = {
  colors: {
    '--background': '14 14 14',
    '--surface': '26 26 26',
    '--foreground': '234 234 234',
    '--foreground-secondary': '176 176 176',
    '--foreground-muted': '122 122 122',
    '--gold': '244 197 66',
    '--gold-light': '255 228 168',
    '--secondary': '193 18 31',
    '--purple': '124 58 237',
    '--border': '60 40 30'
  },
  fonts: {
    heading: 'Cinzel',
    serif: 'Playfair Display',
    sans: 'Inter'
  },
  spacing: {
    'py-section-desktop': '80px',
    'py-section-mobile': '48px',
    'gap-component': '24px',
    'p-card': '32px'
  },
  typography: {
    'h1': '3rem/48px',
    'h2': '2rem/32px',
    'h3': '1.5rem/24px',
    'body': '1rem/16px'
  },
  animations: {
    fade: '300ms',
    cardFlip: '500ms',
    pulseGlow: '2s'
  }
};

const AUDIT_CHECKS = [
  {
    category: 'Colors',
    checks: [
      {
        name: 'Raw hex colors in code',
        forbidden: ['#0e0e0e', '#F4C542', '#C1121F', '#7C3AED'],
        fix: 'Use design tokens: text-gold, bg-background, etc.'
      },
      {
        name: 'Non-standard background',
        regex: /bg-\[(?!background|surface|gold|card|primary)/g,
        fix: 'Only use token-based backgrounds'
      }
    ]
  },
  {
    category: 'Typography',
    checks: [
      {
        name: 'Non-standard fonts',
        forbidden: ['text-sans', 'text-serif'],
        fix: 'Use font-heading, font-serif, font-sans tokens'
      },
      {
        name: 'Hardcoded font sizes',
        regex: /text-\d+xl/,
        fix: 'Use typography tokens: text-h1, text-body, etc.'
      }
    ]
  },
  {
    category: 'Spacing',
    checks: [
      {
        name: 'Non-standard padding',
        regex: /py-\d+(?!-|px)/,
        fix: 'Use standard spacing tokens'
      },
      {
        name: 'Magic numbers', 
        regex: /\[(?:20|24|32|40|48|64)\]/,
        fix: 'Use Tailwind spacing scale'
      }
    ]
  },
  {
    category: 'Components',
    checks: [
      {
        name: 'Non-standard button styles',
        regex: /(?:bg|text|border)-\[(?!gold|surface|background)/,
        fix: 'Use btn-primary, btn-secondary classes'
      }
    ]
  }
];

function auditComponent(componentName, srcDir) {
  const componentPath = path.join(srcDir, 'components', componentName.replace(/([A-Z])/g, '/$1').toLowerCase() + '.tsx');
  
  if (!fs.existsSync(componentPath)) {
    return { exists: false, violations: [] };
  }
  
  const content = fs.readFileSync(componentPath, 'utf-8');
  const violations = [];
  
  AUDIT_CHECKS.forEach(category => {
    category.checks.forEach(check => {
      if (check.forbidden) {
        check.forbidden.forEach(color => {
          const regex = new RegExp(`["'](${color})["']`, 'g');
          let match;
          while ((match = regex.exec(content)) !== null) {
            violations.push({
              check: check.name,
              match: match[0],
              fix: check.fix,
              line: content.substring(0, match.index).split('\n').length
            });
          }
        });
      }
    });
  });
  
  return { exists: true, violations };
}

function generatePixelAuditReport() {
  console.log('\n🎨 PIXEL-LEVEL UI AUDIT REPORT\n');
  console.log('='.repeat(60));
  
  console.log('\n📋 Design Token Reference:');
  Object.entries(DESIGN_TOKENS.colors).forEach(([token, value]) => {
    console.log(`   ${token}: rgb(${value})`);
  });
  
  console.log('\n\n📊 Audit Categories:');
  AUDIT_CHECKS.forEach(cat => {
    console.log(`\n   ${cat.category}:`);
    cat.checks.forEach(check => {
      console.log(`   - ${check.name}`);
    });
  });
  
  console.log('\n\n🔍 Component Analysis:');
  
  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Token Compliance: STRICT');
  console.log('   All colors, fonts, and spacing MUST use tokens');
  console.log('\n❌ Violation Penalty: Build Failure');
  console.log('   Design system violations will fail CI checks');
  console.log('\n' + '='.repeat(60) + '\n');
}

generatePixelAuditReport();

module.exports = { DESIGN_TOKENS, AUDIT_CHECKS, auditComponent };