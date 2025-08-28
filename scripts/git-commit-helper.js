#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Git Commit Helper - Generate meaningful commit descriptions and summaries
 * 
 * Features:
 * - Analyze git diff and generate smart commit messages
 * - Create detailed summaries of changes
 * - Support for different commit types (feat, fix, docs, etc.)
 * - File-based analysis for better context
 */

class GitCommitHelper {
  constructor() {
    this.changeTypes = {
      feat: 'New feature or enhancement',
      fix: 'Bug fix or correction',
      docs: 'Documentation changes',
      style: 'Code style changes (formatting, etc.)',
      refactor: 'Code refactoring without feature changes',
      test: 'Adding or updating tests',
      chore: 'Maintenance tasks, dependencies, etc.',
      perf: 'Performance improvements',
      ci: 'CI/CD configuration changes',
      build: 'Build system or dependencies changes'
    };
  }

  /**
   * Execute git command and return output
   */
  executeGitCommand(command) {
    try {
      return execSync(command, { 
        encoding: 'utf8', 
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe']
      }).trim();
    } catch (error) {
      console.error(`Error executing git command: ${command}`);
      console.error(error.message);
      return '';
    }
  }

  /**
   * Get current git status
   */
  getGitStatus() {
    const status = this.executeGitCommand('git status --porcelain');
    const staged = [];
    const unstaged = [];
    const untracked = [];

    status.split('\n').filter(line => line.trim()).forEach(line => {
      const statusCode = line.substring(0, 2);
      const fileName = line.substring(3);

      if (statusCode[0] !== ' ' && statusCode[0] !== '?') {
        staged.push({ status: statusCode[0], file: fileName });
      }
      if (statusCode[1] !== ' ') {
        if (statusCode[1] === '?') {
          untracked.push(fileName);
        } else {
          unstaged.push({ status: statusCode[1], file: fileName });
        }
      }
    });

    return { staged, unstaged, untracked };
  }

  /**
   * Get git diff for staged files
   */
  getStagedDiff() {
    return this.executeGitCommand('git diff --cached');
  }

  /**
   * Get git diff for unstaged files
   */
  getUnstagedDiff() {
    return this.executeGitCommand('git diff');
  }

  /**
   * Analyze file changes and categorize them
   */
  analyzeChanges(files) {
    const categories = {
      frontend: [],
      backend: [],
      config: [],
      docs: [],
      tests: [],
      styles: [],
      scripts: [],
      assets: [],
      other: []
    };

    files.forEach(file => {
      const fileName = typeof file === 'string' ? file : file.file;
      const ext = path.extname(fileName).toLowerCase();
      const dir = path.dirname(fileName);

      if (fileName.includes('README') || fileName.includes('.md') || ext === '.md') {
        categories.docs.push(fileName);
      } else if (fileName.includes('test') || fileName.includes('spec') || dir.includes('__tests__')) {
        categories.tests.push(fileName);
      } else if (ext === '.css' || ext === '.scss' || ext === '.sass' || ext === '.less') {
        categories.styles.push(fileName);
      } else if (ext === '.js' && dir.includes('scripts')) {
        categories.scripts.push(fileName);
      } else if (ext === '.json' || fileName.includes('config') || fileName.includes('.env')) {
        categories.config.push(fileName);
      } else if (dir.includes('components') || dir.includes('app') || ext === '.tsx' || ext === '.jsx') {
        categories.frontend.push(fileName);
      } else if (dir.includes('api') || dir.includes('lib') || dir.includes('server')) {
        categories.backend.push(fileName);
      } else if (ext === '.png' || ext === '.jpg' || ext === '.svg' || ext === '.ico') {
        categories.assets.push(fileName);
      } else {
        categories.other.push(fileName);
      }
    });

    return categories;
  }

  /**
   * Determine commit type based on changes
   */
  determineCommitType(categories, diff) {
    const diffLower = diff.toLowerCase();
    
    // Check for specific patterns
    if (diffLower.includes('fix') || diffLower.includes('bug') || diffLower.includes('error')) {
      return 'fix';
    }
    
    if (categories.docs.length > 0 && 
        categories.frontend.length === 0 && 
        categories.backend.length === 0) {
      return 'docs';
    }
    
    if (categories.tests.length > 0 && 
        categories.frontend.length === 0 && 
        categories.backend.length === 0) {
      return 'test';
    }
    
    if (categories.config.length > 0 && 
        (diffLower.includes('dependency') || diffLower.includes('package'))) {
      return 'build';
    }
    
    if (categories.styles.length > 0 && 
        categories.frontend.length === 0 && 
        categories.backend.length === 0) {
      return 'style';
    }
    
    if (diffLower.includes('refactor') || diffLower.includes('cleanup')) {
      return 'refactor';
    }
    
    if (diffLower.includes('performance') || diffLower.includes('optimize')) {
      return 'perf';
    }
    
    // Default to feat for new features
    return 'feat';
  }

  /**
   * Generate a descriptive commit message
   */
  generateCommitMessage(type, categories, diff) {
    const typeLabel = type;
    let scope = '';
    let description = '';

    // Determine scope
    if (categories.frontend.length > 0 && categories.backend.length > 0) {
      scope = 'full-stack';
    } else if (categories.frontend.length > 0) {
      scope = 'ui';
    } else if (categories.backend.length > 0) {
      scope = 'api';
    } else if (categories.docs.length > 0) {
      scope = 'docs';
    } else if (categories.tests.length > 0) {
      scope = 'tests';
    } else if (categories.config.length > 0) {
      scope = 'config';
    }

    // Generate description based on file changes
    const totalFiles = Object.values(categories).flat().length;
    
    if (categories.frontend.length > 0) {
      if (categories.frontend.some(f => f.includes('component'))) {
        description = 'update UI components and user interface';
      } else if (categories.frontend.some(f => f.includes('page'))) {
        description = 'enhance page layouts and functionality';
      } else {
        description = 'improve frontend user experience';
      }
    } else if (categories.backend.length > 0) {
      if (categories.backend.some(f => f.includes('api'))) {
        description = 'enhance API endpoints and business logic';
      } else if (categories.backend.some(f => f.includes('auth'))) {
        description = 'improve authentication and security';
      } else {
        description = 'optimize backend functionality';
      }
    } else if (categories.docs.length > 0) {
      description = 'update documentation and guides';
    } else if (categories.tests.length > 0) {
      description = 'add comprehensive test coverage';
    } else if (categories.config.length > 0) {
      description = 'update configuration and dependencies';
    } else {
      description = 'implement system improvements';
    }

    // Build the commit message
    let message = `${typeLabel}`;
    if (scope) {
      message += `(${scope})`;
    }
    message += `: ${description}`;

    return message;
  }

  /**
   * Generate detailed summary of changes
   */
  generateSummary(categories, status, diff) {
    const summary = [];
    
    summary.push('='.repeat(60));
    summary.push('GIT COMMIT SUMMARY');
    summary.push('='.repeat(60));
    summary.push('');
    
    // File changes summary
    const totalFiles = Object.values(categories).flat().length;
    summary.push(`📊 CHANGES OVERVIEW:`);
    summary.push(`   • Total files modified: ${totalFiles}`);
    summary.push(`   • Staged files: ${status.staged.length}`);
    summary.push(`   • Unstaged files: ${status.unstaged.length}`);
    summary.push(`   • Untracked files: ${status.untracked.length}`);
    summary.push('');

    // Changes by category
    summary.push(`📂 CHANGES BY CATEGORY:`);
    Object.entries(categories).forEach(([category, files]) => {
      if (files.length > 0) {
        summary.push(`   • ${category.toUpperCase()}: ${files.length} files`);
        files.slice(0, 3).forEach(file => {
          summary.push(`     - ${file}`);
        });
        if (files.length > 3) {
          summary.push(`     ... and ${files.length - 3} more files`);
        }
        summary.push('');
      }
    });

    // Diff analysis
    if (diff) {
      const lines = diff.split('\n');
      const additions = lines.filter(line => line.startsWith('+')).length;
      const deletions = lines.filter(line => line.startsWith('-')).length;
      
      summary.push(`📈 CODE CHANGES:`);
      summary.push(`   • Lines added: ${additions}`);
      summary.push(`   • Lines removed: ${deletions}`);
      summary.push(`   • Net change: ${additions - deletions}`);
      summary.push('');
    }

    // Recommendations
    summary.push(`💡 RECOMMENDATIONS:`);
    
    if (status.unstaged.length > 0) {
      summary.push(`   • Stage ${status.unstaged.length} unstaged files before committing`);
    }
    
    if (status.untracked.length > 0) {
      summary.push(`   • Consider adding ${status.untracked.length} untracked files`);
    }
    
    if (categories.tests.length === 0 && (categories.frontend.length > 0 || categories.backend.length > 0)) {
      summary.push(`   • Consider adding tests for new functionality`);
    }
    
    if (categories.docs.length === 0 && totalFiles > 5) {
      summary.push(`   • Consider updating documentation for major changes`);
    }

    return summary.join('\n');
  }

  /**
   * Main function to analyze and generate commit information
   */
  async analyze(options = {}) {
    console.log('🔍 Analyzing git repository...\n');

    // Get current status
    const status = this.getGitStatus();
    const stagedDiff = this.getStagedDiff();
    const unstagedDiff = this.getUnstagedDiff();

    if (status.staged.length === 0 && status.unstaged.length === 0) {
      console.log('❌ No changes detected in the repository.');
      return;
    }

    // Analyze changes
    const allFiles = [...status.staged, ...status.unstaged, ...status.untracked];
    const categories = this.analyzeChanges(allFiles);
    
    // Determine commit type and generate message
    const commitType = this.determineCommitType(categories, stagedDiff + unstagedDiff);
    const commitMessage = this.generateCommitMessage(commitType, categories, stagedDiff);
    
    // Generate summary
    const summary = this.generateSummary(categories, status, stagedDiff);

    // Output results
    console.log('🎯 SUGGESTED COMMIT MESSAGE:');
    console.log('─'.repeat(50));
    console.log(`"${commitMessage}"`);
    console.log('');

    if (options.showSummary !== false) {
      console.log(summary);
    }

    // Save to files if requested
    if (options.saveToFile) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const messageFile = `commit-message-${timestamp}.txt`;
      const summaryFile = `commit-summary-${timestamp}.txt`;
      
      fs.writeFileSync(messageFile, commitMessage);
      fs.writeFileSync(summaryFile, summary);
      
      console.log(`\n💾 Files saved:`);
      console.log(`   • ${messageFile}`);
      console.log(`   • ${summaryFile}`);
    }

    return {
      commitMessage,
      summary,
      categories,
      status,
      type: commitType
    };
  }

  /**
   * Interactive commit helper
   */
  async interactiveCommit() {
    const analysis = await this.analyze({ showSummary: true });
    
    if (!analysis) return;

    console.log('\n🤖 COMMIT ACTIONS:');
    console.log('─'.repeat(30));
    console.log('1. Use suggested message');
    console.log('2. Edit message');
    console.log('3. Show detailed diff');
    console.log('4. Cancel');
    
    // In a real implementation, you would add readline for user input
    // For now, we'll just show the suggested workflow
    
    console.log('\n💡 To commit with this message, run:');
    console.log(`git commit -m "${analysis.commitMessage}"`);
    
    if (analysis.status.unstaged.length > 0) {
      console.log('\n⚠️  Don\'t forget to stage your changes first:');
      console.log('git add .');
    }
  }
}

// CLI Interface
async function main() {
  const helper = new GitCommitHelper();
  const args = process.argv.slice(2);
  
  const options = {
    showSummary: !args.includes('--no-summary'),
    saveToFile: args.includes('--save'),
    interactive: args.includes('--interactive')
  };

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🚀 Git Commit Helper

USAGE:
  node git-commit-helper.js [options]

OPTIONS:
  --help, -h        Show this help message
  --no-summary      Don't show detailed summary
  --save            Save commit message and summary to files
  --interactive     Interactive commit mode
  --types           Show available commit types

EXAMPLES:
  node git-commit-helper.js
  node git-commit-helper.js --save
  node git-commit-helper.js --interactive --save
`);
    return;
  }

  if (args.includes('--types')) {
    console.log('\n📋 AVAILABLE COMMIT TYPES:');
    console.log('─'.repeat(40));
    Object.entries(helper.changeTypes).forEach(([type, description]) => {
      console.log(`${type.padEnd(10)} ${description}`);
    });
    return;
  }

  try {
    if (options.interactive) {
      await helper.interactiveCommit();
    } else {
      await helper.analyze(options);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Export for use as module
module.exports = GitCommitHelper;

// Run if called directly
if (require.main === module) {
  main();
}