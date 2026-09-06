const fs = require('fs');
const path = require('path');

const DESIGN_TOKENS = {
  colors: [
    'background', 'surface', 'foreground', 'foreground-secondary', 'foreground-muted',
    'card', 'card-foreground', 'primary', 'secondary', 'muted', 'gold', 'gold-light',
    'border', 'input', 'ring', 'purple', 'purple-light'
  ],
  text: [
    'text-h1', 'text-h2', 'text-h3', 'text-body', 'text-small', 'text-xs'
  ],
  buttons: [
    'btn-primary', 'btn-secondary'
  ],
  cards: [
    'card-mystical', 'tarot-card'
  ],
  inputs: [
    'input-mystical'
  ]
};

const FORBIDDEN_PATTERNS = [
  { pattern: /#(?:[0-9A-Fa-f]{3,8})\b/g, name: 'hex color' },
  { pattern: /rgb\s*\(\s*#(?:[0-9A-Fa-f]{6})\s*\)/g, name: 'rgb hex' },
  { pattern: /text-\[#(?:[0-9A-Fa-f]{3,6})\]/g, name: 'Tailwind hex class' },
  { pattern: /bg-\[#(?:[0-9A-Fa-f]{3,6})\]/g, name: 'Tailwind hex class' },
  { pattern: /border-\[#(?:[0-9A-Fa-f]{3,6})\]/g, name: 'Tailwind hex class' },
  { pattern: /ring-\[#(?:[0-9A-Fa-f]{3,6})\]/g, name: 'Tailwind hex class' },
];

function findViolations(dir, filePatterns = ['*.tsx', '*.ts', '*.js']) {
  const violations = [];
  
  function walkDir(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        if (!file.startsWith('.') && file !== 'node_modules') {
          walkDir(filePath);
        }
      } else {
        const ext = path.extname(file);
        if (!filePatterns.includes('*' + ext) && !filePatterns.includes(ext)) continue;
        
        const content = fs.readFileSync(filePath, 'utf-8');
        
        FORBIDDEN_PATTERNS.forEach(({ pattern, name }) => {
          let match;
          while ((match = pattern.exec(content)) !== null) {
            const lineNum = content.substring(0, match.index).split('\n').length;
            violations.push({
              file: filePath,
              line: lineNum,
              violation: match[0],
              type: name
            });
          }
        });
      }
    }
  }
  
  walkDir(dir);
  return violations;
}

function generateReport(violations) {
  console.log('\n🎨 Design Token Audit Report\n');
  console.log('='.repeat(50));
  
  if (violations.length === 0) {
    console.log('✅ No design token violations found!');
    return;
  }
  
  console.log(`❌ Found ${violations.length} violation(s)\n`);
  
  const byFile = {};
  violations.forEach(v => {
    if (!byFile[v.file]) byFile[v.file] = [];
    byFile[v.file].push(v);
  });
  
  Object.entries(byFile).forEach(([file, violations]) => {
    console.log(`\n📁 ${path.basename(file)}`);
    violations.forEach(v => {
      console.log(`  Line ${v.line}: ${v.violation} (${v.type})`);
    });
  });
  
  console.log('\n\n💡 Fix: Use design tokens from globals.css instead');
  console.log('   - text-gold instead of text-[#F4C542]');
  console.log('   - bg-background instead of bg-[#0e0e0e]');
  console.log('   - btn-primary instead of inline styles');
  console.log('\n' + '='.repeat(50) + '\n');
}

const srcDir = path.join(__dirname, 'src');
const violations = findViolations(srcDir);
generateReport(violations);

process.exit(violations.length > 0 ? 1 : 0);