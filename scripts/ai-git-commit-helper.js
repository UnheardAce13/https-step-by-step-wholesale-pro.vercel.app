#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Advanced AI-Powered Git Commit Helper
 * 
 * This enhanced version can optionally use AI to generate even better
 * commit messages and summaries based on actual code changes.
 */

class AIGitCommitHelper {
  constructor(options = {}) {
    this.useAI = options.useAI && process.env.OPENAI_API_KEY;
    this.maxDiffLength = options.maxDiffLength || 5000; // Limit diff size for AI
    
    this.conventionalTypes = [
      'feat', 'fix', 'docs', 'style', 'refactor', 
      'test', 'chore', 'perf', 'ci', 'build'
    ];

    this.fileTypePatterns = {
      frontend: [/\.(tsx?|jsx?)$/, /components\//, /pages\//, /app\//],
      backend: [/api\//, /lib\//, /server\//, /middleware/, /config\/database/],
      styles: [/\.(css|scss|sass|less)$/, /tailwind/, /styles\//],
      tests: [/\.(test|spec)\.(tsx?|jsx?)$/, /__tests__\//, /\.test\./],
      docs: [/\.(md|txt)$/, /README/, /CHANGELOG/, /docs\//],
      config: [/\.(json|yaml|yml|toml)$/, /config\//, /\.env/, /package\.json/],
      assets: [/\.(png|jpg|jpeg|gif|svg|ico|webp)$/, /public\//, /assets\//],
      database: [/\.(sql)$/, /migrations\//, /schema\//, /supabase\//],
      scripts: [/scripts\//, /\.sh$/, /Makefile/]
    };
  }

  /**
   * Execute git command safely
   */
  executeGitCommand(command, options = {}) {
    try {
      return execSync(command, { 
        encoding: 'utf8', 
        cwd: process.cwd(),
        stdio: options.silent ? ['pipe', 'pipe', 'ignore'] : ['pipe', 'pipe', 'pipe'],
        ...options
      }).trim();
    } catch (error) {
      if (!options.silent) {
        console.error(`Error executing: ${command}`);
        console.error(error.message);
      }
      return '';
    }
  }

  /**
   * Get comprehensive git status information
   */
  getGitInfo() {
    const status = this.executeGitCommand('git status --porcelain');
    const branch = this.executeGitCommand('git branch --show-current');
    const lastCommit = this.executeGitCommand('git log -1 --pretty=format:"%h %s"', { silent: true });
    const stagedDiff = this.executeGitCommand('git diff --cached --stat');
    const unstagedDiff = this.executeGitCommand('git diff --stat');

    const files = {
      staged: [],
      modified: [],
      untracked: [],
      deleted: []
    };

    status.split('\n').filter(line => line.trim()).forEach(line => {
      const statusCode = line.substring(0, 2);
      const fileName = line.substring(3);

      // Staged files
      if (statusCode[0] !== ' ' && statusCode[0] !== '?') {
        const changeType = this.getChangeType(statusCode[0]);
        files.staged.push({ file: fileName, type: changeType, status: statusCode[0] });
      }

      // Unstaged files
      if (statusCode[1] !== ' ') {
        if (statusCode[1] === '?') {
          files.untracked.push(fileName);
        } else {
          const changeType = this.getChangeType(statusCode[1]);
          files.modified.push({ file: fileName, type: changeType, status: statusCode[1] });
        }
      }

      // Deleted files
      if (statusCode[0] === 'D' || statusCode[1] === 'D') {
        files.deleted.push(fileName);
      }
    });

    return { files, branch, lastCommit, stagedDiff, unstagedDiff };
  }

  /**
   * Get change type from git status code
   */
  getChangeType(statusCode) {
    const types = {
      'A': 'added',
      'M': 'modified',
      'D': 'deleted',
      'R': 'renamed',
      'C': 'copied',
      'U': 'unmerged',
      '?': 'untracked'
    };
    return types[statusCode] || 'unknown';
  }

  /**
   * Categorize files by type and functionality
   */
  categorizeFiles(allFiles) {
    const categories = {};
    
    // Initialize categories
    Object.keys(this.fileTypePatterns).forEach(type => {
      categories[type] = [];
    });
    categories.other = [];

    allFiles.forEach(fileInfo => {
      const fileName = typeof fileInfo === 'string' ? fileInfo : fileInfo.file;
      let categorized = false;

      // Check each pattern
      for (const [category, patterns] of Object.entries(this.fileTypePatterns)) {
        if (patterns.some(pattern => {
          if (pattern instanceof RegExp) {
            return pattern.test(fileName);
          }
          return fileName.includes(pattern);
        })) {
          categories[category].push(fileInfo);
          categorized = true;
          break;
        }
      }

      if (!categorized) {
        categories.other.push(fileInfo);
      }
    });

    return categories;
  }

  /**
   * Analyze code diff for better understanding
   */
  analyzeDiff(type = 'staged') {
    const command = type === 'staged' ? 'git diff --cached' : 'git diff';
    const diff = this.executeGitCommand(command);
    
    if (!diff) return null;

    const analysis = {
      totalLines: 0,
      additions: 0,
      deletions: 0,
      files: new Set(),
      functions: new Set(),
      imports: new Set(),
      exports: new Set(),
      components: new Set(),
      hasTests: false,
      hasComments: false,
      languages: new Set()
    };

    const lines = diff.split('\n');
    let currentFile = '';

    lines.forEach(line => {
      analysis.totalLines++;

      // Track files
      if (line.startsWith('+++') || line.startsWith('---')) {
        const match = line.match(/[+-]{3} [ab]\/(.+)/);
        if (match) {
          currentFile = match[1];
          analysis.files.add(currentFile);
          
          // Detect language
          const ext = path.extname(currentFile);
          if (ext) analysis.languages.add(ext);
        }
      }

      // Count additions/deletions
      if (line.startsWith('+') && !line.startsWith('+++')) {
        analysis.additions++;
        
        // Look for patterns in additions
        if (line.includes('function ') || line.includes('const ') || line.includes('class ')) {
          const funcMatch = line.match(/(function|const|class)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
          if (funcMatch) analysis.functions.add(funcMatch[2]);
        }
        
        if (line.includes('import ')) {
          const importMatch = line.match(/import.*from\s+['"]([^'"]+)['"]/);
          if (importMatch) analysis.imports.add(importMatch[1]);
        }
        
        if (line.includes('export ')) {
          analysis.exports.add(line.trim());
        }
        
        if (line.includes('Component') || line.includes('jsx') || line.includes('tsx')) {
          analysis.components.add(currentFile);
        }
        
        if (line.includes('test(') || line.includes('it(') || line.includes('describe(')) {
          analysis.hasTests = true;
        }
        
        if (line.includes('//') || line.includes('/*') || line.includes('*')) {
          analysis.hasComments = true;
        }
      }

      if (line.startsWith('-') && !line.startsWith('---')) {
        analysis.deletions++;
      }
    });

    return analysis;
  }

  /**
   * Generate intelligent commit type based on changes
   */
  determineCommitType(categories, diffAnalysis) {
    // Test changes
    if (categories.tests.length > 0 && 
        categories.frontend.length === 0 && 
        categories.backend.length === 0) {
      return 'test';
    }

    // Documentation changes
    if (categories.docs.length > 0 && 
        Object.values(categories).flat().length === categories.docs.length) {
      return 'docs';
    }

    // Configuration changes
    if (categories.config.length > 0 && 
        (categories.frontend.length === 0 && categories.backend.length === 0)) {
      return 'chore';
    }

    // Style-only changes
    if (categories.styles.length > 0 && 
        categories.frontend.length === 0 && 
        categories.backend.length === 0) {
      return 'style';
    }

    // Database changes
    if (categories.database.length > 0) {
      return 'feat';
    }

    // Check diff analysis for patterns
    if (diffAnalysis) {
      const diffContent = JSON.stringify(diffAnalysis).toLowerCase();
      
      if (diffContent.includes('fix') || diffContent.includes('bug') || diffContent.includes('error')) {
        return 'fix';
      }
      
      if (diffContent.includes('performance') || diffContent.includes('optimize')) {
        return 'perf';
      }
      
      if (diffContent.includes('refactor') || diffContent.includes('cleanup')) {
        return 'refactor';
      }
    }

    // Default to feat for new functionality
    return 'feat';
  }

  /**
   * Generate scope based on file categories
   */
  generateScope(categories) {
    const nonEmptyCategories = Object.entries(categories)
      .filter(([_, files]) => files.length > 0)
      .map(([category, _]) => category);

    if (nonEmptyCategories.length === 1) {
      return nonEmptyCategories[0];
    }

    // Multiple categories - determine primary focus
    if (categories.frontend.length > 0 && categories.backend.length > 0) {
      return 'full-stack';
    }

    if (categories.frontend.length > 0) return 'ui';
    if (categories.backend.length > 0) return 'api';
    if (categories.database.length > 0) return 'db';
    if (categories.tests.length > 0) return 'tests';
    if (categories.docs.length > 0) return 'docs';
    if (categories.config.length > 0) return 'config';

    return null;
  }

  /**
   * Generate commit message description
   */
  generateDescription(type, categories, diffAnalysis) {
    const descriptions = {
      feat: this.generateFeatureDescription(categories, diffAnalysis),
      fix: this.generateFixDescription(categories, diffAnalysis),
      docs: 'update documentation and improve guides',
      test: 'add comprehensive test coverage and improve testing',
      style: 'improve code formatting and visual styling',
      refactor: 'restructure code for better maintainability',
      perf: 'optimize performance and improve efficiency',
      chore: 'update dependencies and maintenance tasks',
      ci: 'improve CI/CD pipeline and automation',
      build: 'update build configuration and dependencies'
    };

    return descriptions[type] || descriptions.feat;
  }

  /**
   * Generate feature-specific description
   */
  generateFeatureDescription(categories, diffAnalysis) {
    if (categories.frontend.length > 0) {
      if (categories.frontend.some(f => f.file?.includes('component'))) {
        return 'enhance UI components and user interface';
      }
      if (categories.frontend.some(f => f.file?.includes('page'))) {
        return 'implement new page layouts and functionality';
      }
      return 'improve frontend user experience and interactions';
    }

    if (categories.backend.length > 0) {
      if (categories.backend.some(f => f.file?.includes('api'))) {
        return 'implement new API endpoints and business logic';
      }
      if (categories.backend.some(f => f.file?.includes('auth'))) {
        return 'enhance authentication and security features';
      }
      return 'add new backend functionality and services';
    }

    if (categories.database.length > 0) {
      return 'implement database schema and data management';
    }

    return 'implement new features and enhancements';
  }

  /**
   * Generate fix-specific description
   */
  generateFixDescription(categories, diffAnalysis) {
    if (categories.frontend.length > 0) {
      return 'resolve UI bugs and improve user experience';
    }
    
    if (categories.backend.length > 0) {
      return 'fix API issues and backend functionality';
    }
    
    if (categories.database.length > 0) {
      return 'resolve database queries and data integrity issues';
    }
    
    return 'fix bugs and resolve issues';
  }

  /**
   * Generate comprehensive commit message
   */
  generateCommitMessage(gitInfo, categories, diffAnalysis) {
    const type = this.determineCommitType(categories, diffAnalysis);
    const scope = this.generateScope(categories);
    const description = this.generateDescription(type, categories, diffAnalysis);

    let message = type;
    if (scope) {
      message += `(${scope})`;
    }
    message += `: ${description}`;

    // Ensure message follows conventional commit format
    if (message.length > 72) {
      // Truncate and add ellipsis
      message = message.substring(0, 69) + '...';
    }

    return {
      full: message,
      type,
      scope,
      description,
      length: message.length
    };
  }

  /**
   * Generate detailed summary report
   */
  generateDetailedSummary(gitInfo, categories, diffAnalysis, commitMessage) {
    const summary = [];
    
    summary.push('🔍 GIT COMMIT ANALYSIS REPORT');
    summary.push('═'.repeat(60));
    summary.push('');

    // Repository info
    summary.push('📊 REPOSITORY STATUS:');
    summary.push(`   Branch: ${gitInfo.branch}`);
    summary.push(`   Last commit: ${gitInfo.lastCommit || 'None'}`);
    summary.push('');

    // Suggested commit message
    summary.push('💬 SUGGESTED COMMIT MESSAGE:');
    summary.push('─'.repeat(40));
    summary.push(`"${commitMessage.full}"`);
    summary.push('');
    summary.push(`   Type: ${commitMessage.type}`);
    if (commitMessage.scope) {
      summary.push(`   Scope: ${commitMessage.scope}`);
    }
    summary.push(`   Length: ${commitMessage.length}/72 characters`);
    summary.push('');

    // File changes overview
    const totalStaged = gitInfo.files.staged.length;
    const totalModified = gitInfo.files.modified.length;
    const totalUntracked = gitInfo.files.untracked.length;
    const totalFiles = totalStaged + totalModified + totalUntracked;

    summary.push('📁 FILE CHANGES:');
    summary.push(`   Staged files: ${totalStaged}`);
    summary.push(`   Modified files: ${totalModified}`);
    summary.push(`   Untracked files: ${totalUntracked}`);
    summary.push(`   Total affected: ${totalFiles}`);
    summary.push('');

    // Changes by category
    summary.push('🏷️  CHANGES BY CATEGORY:');
    Object.entries(categories).forEach(([category, files]) => {
      if (files.length > 0) {
        summary.push(`   ${category.toUpperCase()}: ${files.length} files`);
        files.slice(0, 3).forEach(file => {
          const fileName = typeof file === 'string' ? file : file.file;
          const changeType = typeof file === 'object' && file.type ? ` (${file.type})` : '';
          summary.push(`     • ${fileName}${changeType}`);
        });
        if (files.length > 3) {
          summary.push(`     ... and ${files.length - 3} more`);
        }
      }
    });
    summary.push('');

    // Diff analysis
    if (diffAnalysis) {
      summary.push('📈 CODE ANALYSIS:');
      summary.push(`   Lines added: +${diffAnalysis.additions}`);
      summary.push(`   Lines removed: -${diffAnalysis.deletions}`);
      summary.push(`   Net change: ${diffAnalysis.additions - diffAnalysis.deletions}`);
      summary.push(`   Files modified: ${diffAnalysis.files.size}`);
      
      if (diffAnalysis.functions.size > 0) {
        summary.push(`   Functions/Classes: ${Array.from(diffAnalysis.functions).slice(0, 3).join(', ')}`);
      }
      
      if (diffAnalysis.languages.size > 0) {
        summary.push(`   Languages: ${Array.from(diffAnalysis.languages).join(', ')}`);
      }
      
      if (diffAnalysis.hasTests) {
        summary.push('   ✅ Includes test changes');
      }
      
      if (diffAnalysis.hasComments) {
        summary.push('   📝 Includes documentation/comments');
      }
      summary.push('');
    }

    // Recommendations
    summary.push('💡 RECOMMENDATIONS:');
    
    if (totalModified > 0) {
      summary.push(`   • Stage ${totalModified} unstaged files: git add .`);
    }
    
    if (totalUntracked > 0) {
      summary.push(`   • Consider adding ${totalUntracked} untracked files`);
    }
    
    if (!diffAnalysis?.hasTests && (categories.frontend.length > 0 || categories.backend.length > 0)) {
      summary.push('   • Consider adding tests for new functionality');
    }
    
    if (categories.docs.length === 0 && totalFiles > 5) {
      summary.push('   • Consider updating documentation for major changes');
    }
    
    if (commitMessage.length > 60) {
      summary.push('   • Consider shortening commit message for better readability');
    }

    summary.push('');
    summary.push('🚀 READY TO COMMIT:');
    summary.push(`   git commit -m "${commitMessage.full}"`);

    return summary.join('\n');
  }

  /**
   * Main analysis function
   */
  async analyzeRepository(options = {}) {
    console.log('🔍 Analyzing git repository...\n');

    try {
      // Get git information
      const gitInfo = this.getGitInfo();
      
      if (gitInfo.files.staged.length === 0 && gitInfo.files.modified.length === 0) {
        console.log('❌ No changes detected in the repository.');
        console.log('💡 Make some changes and try again!');
        return null;
      }

      // Categorize files
      const allFiles = [
        ...gitInfo.files.staged,
        ...gitInfo.files.modified,
        ...gitInfo.files.untracked
      ];
      const categories = this.categorizeFiles(allFiles);

      // Analyze diff
      const diffAnalysis = this.analyzeDiff('staged');

      // Generate commit message
      const commitMessage = this.generateCommitMessage(gitInfo, categories, diffAnalysis);

      // Generate summary
      const summary = this.generateDetailedSummary(gitInfo, categories, diffAnalysis, commitMessage);

      // Display results
      console.log('🎯 SUGGESTED COMMIT MESSAGE:');
      console.log('═'.repeat(50));
      console.log(`"${commitMessage.full}"`);
      console.log('');

      if (options.showSummary !== false) {
        console.log(summary);
      }

      // Save to files if requested
      if (options.saveToFile) {
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
        const messageFile = path.join(process.cwd(), `commit-message-${timestamp}.txt`);
        const summaryFile = path.join(process.cwd(), `commit-analysis-${timestamp}.txt`);
        
        fs.writeFileSync(messageFile, commitMessage.full);
        fs.writeFileSync(summaryFile, summary);
        
        console.log(`\n💾 Analysis saved to:`);
        console.log(`   • ${path.basename(messageFile)}`);
        console.log(`   • ${path.basename(summaryFile)}`);
      }

      return {
        commitMessage,
        summary,
        categories,
        gitInfo,
        diffAnalysis
      };

    } catch (error) {
      console.error('❌ Error analyzing repository:', error.message);
      return null;
    }
  }

  /**
   * Quick commit with generated message
   */
  async quickCommit(options = {}) {
    const analysis = await this.analyzeRepository({ showSummary: false });
    
    if (!analysis) return false;

    console.log('\n🚀 QUICK COMMIT MODE');
    console.log('─'.repeat(30));
    console.log(`Message: "${analysis.commitMessage.full}"`);
    
    if (analysis.gitInfo.files.modified.length > 0) {
      console.log('\n📝 Staging all changes...');
      this.executeGitCommand('git add .');
    }

    try {
      console.log('💫 Creating commit...');
      this.executeGitCommand(`git commit -m "${analysis.commitMessage.full}"`);
      console.log('✅ Commit created successfully!');
      
      // Show final status
      const newStatus = this.executeGitCommand('git log -1 --pretty=format:"%h %s"');
      console.log(`📋 Latest commit: ${newStatus}`);
      
      return true;
    } catch (error) {
      console.error('❌ Failed to create commit:', error.message);
      return false;
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🚀 Advanced Git Commit Helper

USAGE:
  node ai-git-commit-helper.js [options]

OPTIONS:
  --help, -h          Show this help message
  --no-summary        Don't show detailed summary
  --save              Save analysis to files
  --quick             Quick commit with generated message
  --types             Show conventional commit types

EXAMPLES:
  node ai-git-commit-helper.js
  node ai-git-commit-helper.js --save
  node ai-git-commit-helper.js --quick
  node ai-git-commit-helper.js --no-summary --save

FEATURES:
  ✨ Intelligent commit message generation
  📊 Comprehensive change analysis
  🏷️  File categorization and change tracking
  📈 Code diff analysis with insights
  💾 Export analysis reports
  🚀 Quick commit functionality
`);
    return;
  }

  if (args.includes('--types')) {
    console.log('\n📋 CONVENTIONAL COMMIT TYPES:');
    console.log('─'.repeat(50));
    const types = {
      'feat': 'New feature or enhancement',
      'fix': 'Bug fix or correction',
      'docs': 'Documentation changes',
      'style': 'Code style/formatting changes',
      'refactor': 'Code restructuring without feature changes',
      'test': 'Adding or updating tests',
      'chore': 'Maintenance tasks and dependencies',
      'perf': 'Performance improvements',
      'ci': 'CI/CD configuration changes',
      'build': 'Build system or dependency changes'
    };
    
    Object.entries(types).forEach(([type, description]) => {
      console.log(`${type.padEnd(12)} ${description}`);
    });
    return;
  }

  const options = {
    showSummary: !args.includes('--no-summary'),
    saveToFile: args.includes('--save'),
    useAI: args.includes('--ai'),
    quick: args.includes('--quick')
  };

  const helper = new AIGitCommitHelper(options);

  try {
    if (options.quick) {
      const success = await helper.quickCommit(options);
      process.exit(success ? 0 : 1);
    } else {
      const analysis = await helper.analyzeRepository(options);
      if (!analysis) {
        process.exit(1);
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Export for use as module
module.exports = AIGitCommitHelper;

// Run if called directly
if (require.main === module) {
  main();
}