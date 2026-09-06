#!/usr/bin/env node
/**
 * AI Code Optimizer CLI
 * Scans project files and sends them for AI analysis
 * 
 * Usage:
 *   npm run optimize:scan
 *   npm run optimize:scan --path ./src/components
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  baseDir: process.cwd(),
  include: ['**/*.{ts,tsx,js,jsx}'],
  exclude: ['node_modules', 'dist', '.next', 'coverage', '**/*.test.*', '**/*.spec.*'],
  maxFileSize: 1024 * 1024, // 1MB
  batchSize: 5
};

interface OptimizationResult {
  file: string;
  status: 'success' | 'error' | 'skipped';
  issues: string[];
  suggestions: string[];
  duration: number;
}

class CodeOptimizer {
  private results: OptimizationResult[] = [];
  private processed = 0;
  private total = 0;

  async scan(directory: string = CONFIG.baseDir) {
    console.log('🚀 Starting AI Code Optimization Scan...\n');

    const pattern = CONFIG.include.length === 1 
      ? CONFIG.include[0] 
      : `{${CONFIG.include.join(',')}}`;

    const files = await glob(pattern, {
      cwd: directory,
      ignore: CONFIG.exclude,
      nodir: true
    });

    // Filter by size
    const filteredFiles = files.filter(file => {
      const fullPath = path.join(directory, file);
      try {
        const stats = fs.statSync(fullPath);
        return stats.size <= CONFIG.maxFileSize;
      } catch {
        return false;
      }
    });

    this.total = filteredFiles.length;

    console.log(`📁 Found ${this.total} files to analyze\n`);

    if (this.total === 0) {
      console.log('⚠️  No files to analyze');
      return;
    }

    // Process in batches
    for (let i = 0; i < filteredFiles.length; i += CONFIG.batchSize) {
      const batch = filteredFiles.slice(i, i + CONFIG.batchSize);
      await this.processBatch(batch, directory);
    }

    this.printSummary();
  }

  private async processBatch(files: string[], baseDir: string) {
    const promises = files.map(file => this.analyzeFile(file, baseDir));
    await Promise.all(promises);
  }

  private async analyzeFile(filePath: string, baseDir: string): Promise<void> {
    const fullPath = path.join(baseDir, filePath);
    const startTime = Date.now();

    try {
      const content = fs.readFileSync(fullPath, 'utf-8');

      
      // Skip if file is too short
      if (content.trim().length < 50) {
        this.results.push({
          file: filePath,
          status: 'skipped',
          issues: [],
          suggestions: [],
          duration: Date.now() - startTime
        });
        this.printProgress();
        return;
      }

      // Check for common issues
      const issues = this.staticAnalysis(content, filePath);
      const suggestions = this.generateSuggestions(issues, filePath);

      this.results.push({
        file: filePath,
        status: issues.length > 0 ? 'success' : 'skipped',
        issues,
        suggestions,
        duration: Date.now() - startTime
      });

    } catch (error) {
      this.results.push({
        file: filePath,
        status: 'error',
        issues: [(error as Error).message],
        suggestions: [],
        duration: Date.now() - startTime
      });
    } finally {
      this.printProgress();
    }
  }

  private staticAnalysis(code: string, filename: string): string[] {
    const issues: string[] = [];
    const lines = code.split('\n');

    // Check for large components
    if (lines.length > 300) {
      issues.push('Large component (300+ lines) - consider splitting');
    }

    // Check for multiple useState calls
    const useStateCount = (code.match(/useState\s*\(/g) || []).length;
    if (useStateCount > 3) {
      issues.push(`Multiple useState calls (${useStateCount}) - consider using useReducer`);
    }

    // Check for missing useCallback
    if (code.includes('useEffect') && !code.includes('useCallback')) {
      const depsMatch = code.match(/useEffect\([\s\S]*?\[[^\]]*\]/g);
      if (depsMatch && depsMatch.length > 0) {
        issues.push('useEffect with dependencies but no useCallback');
      }
    }

    // Check for inline functions in render
    const inlineFunctionMatches = code.match(/={[^{]*=>/g);
    if (inlineFunctionMatches && inlineFunctionMatches.length > 2) {
      issues.push('Multiple inline functions - memoize with useCallback');
    }

    // Check for console.log in non-test files
    if (!filename.includes('.test.') && !filename.includes('.spec.')) {
      if (code.includes('console.') && !code.includes('console.error')) {
        issues.push('console statements found - remove before production');
      }
    }

    // Check for missing error boundaries
    if (filename.includes('Component') || filename.includes('Page')) {
      if (!code.includes('ErrorBoundary') && !code.includes('error')) {
        issues.push('Consider adding error handling');
      }
    }

    // Check for hardcoded values
    const hardcodedStrings = (code.match(/['"]\w{20,}['"]/g) || []).length;
    if (hardcodedStrings > 2) {
      issues.push('Potential hardcoded values - consider constants or config');
    }

    return issues;
  }

  private generateSuggestions(issues: string[], filename: string): string[] {
    const suggestions: string[] = [];

    for (const issue of issues) {
      if (issue.includes('Large component')) {
        suggestions.push('Extract into smaller components or custom hooks');
      }
      if (issue.includes('useState')) {
        suggestions.push('Use useReducer for complex state logic');
      }
      if (issue.includes('useEffect')) {
        suggestions.push('Add useCallback for stable function references');
      }
      if (issue.includes('inline functions')) {
        suggestions.push('Memoize callbacks with useCallback');
      }
      if (issue.includes('console')) {
        suggestions.push('Remove console statements or use proper logging');
      }
      if (issue.includes('error handling')) {
        suggestions.push('Wrap with ErrorBoundary component');
      }
    }

    // Add general optimization suggestion
    suggestions.push('Consider performance profiling with React DevTools');

    // Remove duplicates while preserving order
    const seen = new Set();
    const uniqueSuggestions = suggestions.filter(s => {
      const duplicate = seen.has(s);
      seen.add(s);
      return !duplicate;
    });

    return uniqueSuggestions;
  }

  private printProgress() {
    this.processed++;
    const percentage = Math.round((this.processed / this.total) * 100);
    process.stdout.write(`\r📊 Progress: [${'█'.repeat(Math.floor(percentage / 5)).padEnd(20)}] ${percentage}%`);
  }

  private printSummary() {
    console.log('\n\n📈 Optimization Summary\n');

    const successCount = this.results.filter(r => r.status === 'success').length;
    const errorCount = this.results.filter(r => r.status === 'error').length;
    const skippedCount = this.results.filter(r => r.status === 'skipped').length;

    console.log(`✅ Analyzed: ${successCount} files with suggestions`);
    console.log(`⏭️  Skipped: ${skippedCount} files`);
    console.log(`❌ Errors: ${errorCount} files\n`);

    // Files with issues
    const filesWithIssues = this.results.filter(r => r.issues.length > 0);
    
    if (filesWithIssues.length > 0) {
      console.log('🔍 Files Requiring Attention:\n');
      
      filesWithIssues.slice(0, 10).forEach(result => {
        console.log(`\n📄 ${result.file}`);
        console.log('├─ Issues:');
        result.issues.forEach(issue => {
          console.log(`│  • ${issue}`);
        });
        console.log('├─ Suggestions:');
        result.suggestions.slice(0, 3).forEach(suggestion => {
          console.log(`│  • ${suggestion}`);
        });
        console.log(`└─ Duration: ${result.duration}ms`);
      });

      if (filesWithIssues.length > 10) {
        console.log(`\n... and ${filesWithIssues.length - 10} more files`);
      }
    }

    // Top suggestions
    const allSuggestions = this.results.flatMap(r => r.suggestions);
    const suggestionCounts: Record<string, number> = {};
    
    allSuggestions.forEach(sug => {
      suggestionCounts[sug] = (suggestionCounts[sug] || 0) + 1;
    });

    const topSuggestions = Object.entries(suggestionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    if (topSuggestions.length > 0) {
      console.log('\n🏆 Most Common Suggestions:\n');
      topSuggestions.forEach(([suggestion, count]) => {
        console.log(`  • ${suggestion} (${count} files)`);
      });
    }

    // Performance metrics
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    const avgDuration = Math.round(totalDuration / this.results.length);

    console.log(`\n⏱️  Performance: ${totalDuration}ms total, ${avgDuration}ms avg per file\n`);

    // Save report
    this.saveReport();
  }

  private saveReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.total,
        analyzed: this.results.filter(r => r.status === 'success').length,
        errors: this.results.filter(r => r.status === 'error').length,
        skipped: this.results.filter(r => r.status === 'skipped').length
      },
      files: this.results.map(r => ({
        file: r.file,
        status: r.status,
        issues: r.issues,
        suggestions: r.suggestions,
        duration: r.duration
      }))
    };

    const reportPath = path.join(process.cwd(), 'optimization-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log(`📄 Report saved to: ${reportPath}\n`);
  }
}

// CLI interface
function main() {
  const args = process.argv.slice(2);
  const customPath = args.find(arg => arg.startsWith('--path='))?.split('=')[1];

  console.log('╔═══════════════════════════════════════════╗');
  console.log('║    AI Code Optimizer - Divine Tarot      ║');
  console.log('╚═══════════════════════════════════════════╝\n');

  const optimizer = new CodeOptimizer();
  const targetDir = customPath || process.cwd();

  optimizer.scan(targetDir).catch(error => {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  });
}

if (process.argv[1] === __filename) {
  main();
}

export { CodeOptimizer };
