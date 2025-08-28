#!/usr/bin/env node

/**
 * Git Commit Helper - Easy CLI Wrapper
 * 
 * Simple interface to generate commit messages and summaries for local GitHub commits
 */

const path = require('path');
const { execSync } = require('child_process');

const SCRIPTS_DIR = __dirname;
const BASIC_HELPER = path.join(SCRIPTS_DIR, 'git-commit-helper.js');
const AI_HELPER = path.join(SCRIPTS_DIR, 'ai-git-commit-helper.js');

function showHelp() {
  console.log(`
🔧 Git Commit Helper Toolkit

DESCRIPTION:
  Generate intelligent commit messages and summaries for your local GitHub commits.
  Analyzes your git changes and suggests conventional commit messages.

COMMANDS:
  analyze       Generate commit message and detailed analysis
  quick         Quick commit with auto-generated message  
  summary       Show detailed summary only
  help          Show this help message

OPTIONS:
  --save        Save analysis to files
  --ai          Use AI-enhanced analysis (requires OPENAI_API_KEY)
  --no-summary  Skip detailed summary

EXAMPLES:
  npx git-helper analyze          # Analyze changes and suggest commit
  npx git-helper quick            # Auto-commit with generated message
  npx git-helper summary --save   # Generate detailed summary and save
  npx git-helper analyze --ai     # Use AI for better analysis

WORKFLOW:
  1. Make your code changes
  2. Run: npx git-helper analyze
  3. Review the suggested commit message
  4. Commit: git commit -m "suggested message"
     OR
  5. Quick commit: npx git-helper quick

FEATURES:
  ✨ Smart commit message generation
  📊 File categorization and change analysis  
  🏷️  Conventional commit format (feat, fix, docs, etc.)
  📈 Code diff analysis with insights
  💾 Export analysis reports
  🚀 One-command commit functionality
`);
}

function executeHelper(scriptPath, args) {
  try {
    const command = `node "${scriptPath}" ${args.join(' ')}`;
    execSync(command, { 
      stdio: 'inherit', 
      cwd: process.cwd() 
    });
  } catch (error) {
    console.error('❌ Error executing helper:', error.message);
    process.exit(1);
  }
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('help') || args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }

  const command = args[0];
  const options = args.slice(1);
  
  // Determine which helper to use
  const useAI = options.includes('--ai') || process.env.OPENAI_API_KEY;
  const helperScript = useAI ? AI_HELPER : BASIC_HELPER;

  switch (command) {
    case 'analyze':
    case 'analyse':
      console.log('🔍 Analyzing git changes...\n');
      executeHelper(helperScript, options);
      break;

    case 'quick':
    case 'commit':
      console.log('🚀 Quick commit mode...\n');
      executeHelper(helperScript, ['--quick', ...options]);
      break;

    case 'summary':
    case 'report':
      console.log('📊 Generating detailed summary...\n');
      executeHelper(helperScript, ['--no-summary', ...options]);
      break;

    case 'types':
      console.log('📋 Showing commit types...\n');
      executeHelper(helperScript, ['--types']);
      break;

    default:
      console.error(`❌ Unknown command: ${command}`);
      console.log('💡 Run "npx git-helper help" for usage information');
      process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { executeHelper, showHelp };