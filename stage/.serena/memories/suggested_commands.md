# Advanced Retirement Planner - Development Commands

## Essential Commands

### Testing (CRITICAL - Must pass 100% before any deployment)
- `npm test` - Run all 302 tests (must show 302/302 passing)
- `npm run test:enhanced` - Run tests with enhanced reporting
- `npm run test:unit` - Run unit tests only
- `npm run test:integration` - Run integration tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:security` - Run security tests
- `npm run test:financial-health` - Test financial health scoring
- `npm run test:scenarios` - Open browser-based scenario tests

### Development
- `npm run dev` - Start Vite development server
- `npm run serve` - Python HTTP server on port 8080
- `npm run dev:watch` - Run development watcher
- `npm run validate:pre-work` - Pre-work validation check

### Code Quality & Validation
- `npm run qa:syntax` - Syntax validation with enhanced checks
- `npm run validate:syntax` - Validate all JS files
- `npm run validate:browser` - Check browser compatibility
- `npm run validate:quick` - Quick validation suite
- `npm run qa:full` - Full QA suite (all tests + validations)
- `npm run security:scan` - Scan for security issues

### Version Management
- `node scripts/update-version.js X.Y.Z` - Update version (111+ locations)
- `npm run sync-version` - Sync version across files

### Deployment
- `npm run deploy:pre-check` - Pre-deployment validation
- `npm run deploy:production` - Deploy to production (interactive)
- `npm run deploy:verify` - Verify deployment success
- `npm run deploy:stage` - Deploy to staging

### Git Operations
- `git status` - Check file changes
- `git diff` - View unstaged changes
- `git log --oneline -10` - Recent commits
- `git push origin main` - Push to main branch

### System Utilities (Darwin/macOS)
- `ls -la` - List files with details
- `find . -name "*.js" -type f` - Find JavaScript files
- `rg "pattern"` - Fast file content search (ripgrep)
- `grep -r "pattern" .` - Recursive search
- `python3 -m http.server 8080` - Local HTTP server

### Debugging & Analysis
- `npm run qa:business-logic` - Validate business logic
- `npm run qa:performance` - Performance validation
- `npm run test:accessibility` - Accessibility testing
- `npm run test:ux` - User experience testing

## Important Notes
- NEVER deploy without 100% test pass rate (302/302)
- Always use version update script, not manual edits
- Run `npm run validate:pre-work` before starting development
- Use `npm run qa:full` before any commit to main