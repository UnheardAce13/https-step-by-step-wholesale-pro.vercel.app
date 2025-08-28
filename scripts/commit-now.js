#!/usr/bin/env node

/**
 * One-Line Git Commit Generator
 * 
 * Ultra-simple interface for quick commit message generation
 * Usage: node commit-now.js
 */

const { execSync } = require('child_process');
const path = require('path');

function quickCommit() {
  try {
    console.log('🚀 Analyzing your changes and generating commit message...\n');
    
    // Use the AI helper for best results
    const helperScript = path.join(__dirname, 'ai-git-commit-helper.js');
    execSync(`node "${helperScript}"`, { 
      stdio: 'inherit', 
      cwd: process.cwd() 
    });
    
    console.log('\n💡 To commit with the suggested message, copy it and run:');
    console.log('   git add . && git commit -m "your-suggested-message"');
    console.log('\n🚀 Or for ultra-quick commit, run:');
    console.log('   npm run git:quick');
    
  } catch (error) {
    console.error('❌ Error generating commit message:', error.message);
    console.log('\n💡 Make sure you have changes in your git repository.');
    console.log('   Run "git status" to check your changes.');
  }
}

console.log('📝 Git Commit Message Generator');
console.log('═'.repeat(40));
quickCommit();