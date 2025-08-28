# Git Commit Helper Tools 🚀

Intelligent commit message generation and analysis tools for your local GitHub commits. These tools analyze your git changes and generate meaningful, conventional commit messages with detailed summaries.

## Features ✨

- 🤖 **Smart Commit Message Generation** - Automatically generates conventional commit messages
- 📊 **Comprehensive Change Analysis** - Detailed breakdown of your code changes
- 🏷️ **File Categorization** - Organizes changes by type (frontend, backend, docs, tests, etc.)
- 📈 **Code Diff Analysis** - Analyzes actual code changes for better context
- 💾 **Export Reports** - Save analysis and commit messages to files
- 🚀 **Quick Commit Mode** - One-command commit with auto-generated messages
- 🎯 **Conventional Commits** - Follows conventional commit format (feat, fix, docs, etc.)

## Installation & Setup 🔧

The tools are already included in your project. No additional installation required!

## Usage 📖

### Quick Start

```bash
# Analyze your changes and get a commit message suggestion
npm run git:analyze

# Quick commit with auto-generated message
npm run git:quick

# Generate detailed summary and save to file
npm run git:summary
```

### Available Commands

#### NPM Scripts (Recommended)

```bash
# Get help and see all options
npm run git:help

# Analyze changes and suggest commit message
npm run git:analyze

# Quick commit with generated message (stages all changes)
npm run git:quick

# Generate detailed summary report
npm run git:summary

# Advanced analysis with detailed breakdown
npm run commit:analyze

# Quick commit using advanced analyzer
npm run commit:quick

# Save detailed analysis to files
npm run commit:summary
```

#### Direct Script Usage

```bash
# Basic analysis
node scripts/git-commit-helper.js

# Advanced AI-powered analysis
node scripts/ai-git-commit-helper.js

# Quick commit mode
node scripts/ai-git-commit-helper.js --quick

# Save analysis to files
node scripts/ai-git-commit-helper.js --save

# Show help
node scripts/git-helper.js help
```

## Workflow Examples 🔄

### Standard Workflow

1. **Make your code changes**
   ```bash
   # Edit your files, add features, fix bugs, etc.
   ```

2. **Analyze changes**
   ```bash
   npm run git:analyze
   ```

3. **Review suggested commit message**
   ```
   🎯 SUGGESTED COMMIT MESSAGE:
   ═══════════════════════════════════════════════════════════
   "feat(ui): enhance UI components and user interface"
   ```

4. **Commit using suggested message**
   ```bash
   git add .
   git commit -m "feat(ui): enhance UI components and user interface"
   ```

### Quick Workflow

1. **Make your changes**
2. **One-command commit**
   ```bash
   npm run git:quick
   ```
   This will:
   - Analyze your changes
   - Generate a commit message
   - Stage all changes (`git add .`)
   - Create the commit automatically

### Analysis & Documentation Workflow

1. **Make significant changes**
2. **Generate detailed analysis**
   ```bash
   npm run git:summary
   ```
3. **Review the generated files:**
   - `commit-message-TIMESTAMP.txt` - Generated commit message
   - `commit-analysis-TIMESTAMP.txt` - Detailed analysis report

## What The Tools Analyze 🔍

### File Categories
- **Frontend**: React components, pages, UI files
- **Backend**: API routes, server logic, middleware
- **Database**: SQL files, schema, migrations
- **Tests**: Test files and test utilities
- **Documentation**: README files, markdown docs
- **Configuration**: Package.json, config files, environment
- **Styles**: CSS, SCSS, Tailwind files
- **Assets**: Images, icons, static files

### Code Analysis
- Lines added/removed
- Functions and classes modified
- Import/export changes
- Test coverage additions
- Comment and documentation updates
- Language detection

### Commit Types Generated
- `feat`: New features or enhancements
- `fix`: Bug fixes and corrections
- `docs`: Documentation changes
- `style`: Code style and formatting
- `refactor`: Code restructuring
- `test`: Test additions and updates
- `chore`: Maintenance and dependencies
- `perf`: Performance improvements
- `ci`: CI/CD changes
- `build`: Build system updates

## Sample Output 📊

```
🔍 GIT COMMIT ANALYSIS REPORT
═══════════════════════════════════════════════════════════

📊 REPOSITORY STATUS:
   Branch: main
   Last commit: a1b2c3d Add user authentication

💬 SUGGESTED COMMIT MESSAGE:
────────────────────────────────────────
"feat(full-stack): implement user authentication and dashboard"

   Type: feat
   Scope: full-stack
   Length: 58/72 characters

📁 FILE CHANGES:
   Staged files: 8
   Modified files: 2
   Untracked files: 1
   Total affected: 11

🏷️ CHANGES BY CATEGORY:
   FRONTEND: 4 files
     • components/auth/LoginForm.tsx (added)
     • components/dashboard/UserDashboard.tsx (added)
     • app/login/page.tsx (modified)
     ... and 1 more

   BACKEND: 3 files
     • app/api/auth/login/route.ts (added)
     • lib/auth.ts (added)
     • middleware.ts (modified)

   DOCS: 1 files
     • README.md (modified)

📈 CODE ANALYSIS:
   Lines added: +247
   Lines removed: -15
   Net change: 232
   Files modified: 8
   Functions/Classes: LoginForm, UserDashboard, authenticate
   Languages: .tsx, .ts, .md
   ✅ Includes test changes
   📝 Includes documentation/comments

💡 RECOMMENDATIONS:
   • Stage 2 unstaged files: git add .
   • Consider adding 1 untracked files

🚀 READY TO COMMIT:
   git commit -m "feat(full-stack): implement user authentication and dashboard"
```

## Advanced Features 🚀

### AI-Enhanced Analysis

If you have an OpenAI API key, set it as an environment variable for enhanced analysis:

```bash
export OPENAI_API_KEY="your-api-key-here"
# Then use any command - AI analysis will be automatically enabled
```

### File Export

All commands support saving analysis to files:

```bash
npm run git:summary  # Saves analysis automatically
node scripts/ai-git-commit-helper.js --save
```

This creates timestamped files:
- `commit-message-2024-01-15T10-30-45.txt`
- `commit-analysis-2024-01-15T10-30-45.txt`

### Customization

The tools automatically detect your project structure and adapt the analysis accordingly. File categorization is based on:
- File extensions
- Directory structure
- Naming patterns
- Content analysis

## Tips & Best Practices 💡

1. **Use before committing**: Run analysis before creating commits to get better messages
2. **Review suggestions**: Always review the generated commit message before using it
3. **Stage important changes**: The tools work best when you stage the changes you want to commit
4. **Regular usage**: Use consistently to maintain good commit history
5. **Combine with conventional commits**: The generated messages follow conventional commit standards

## Troubleshooting 🔧

### Common Issues

**"No changes detected"**
- Make sure you have unstaged or staged changes
- Run `git status` to check your repository state

**"Command not found"**
- Make sure you're in the project root directory
- Check that the scripts exist in the `scripts/` folder

**Scripts not executable**
- On Unix systems, make scripts executable: `chmod +x scripts/*.js`

### Getting Help

```bash
npm run git:help           # Show general help
node scripts/git-helper.js help    # Detailed help
node scripts/ai-git-commit-helper.js --help  # Advanced options
```

## Contributing 🤝

Feel free to improve these tools! The scripts are located in the `scripts/` directory:

- `git-commit-helper.js` - Basic commit helper
- `ai-git-commit-helper.js` - Advanced AI-powered helper  
- `git-helper.js` - CLI wrapper and interface

## License 📄

These tools are part of your project and follow the same license terms.

---

**Happy Committing!** 🎉

Made with ❤️ for better git commit messages and development workflow.