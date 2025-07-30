# Claude Code Development Standards for Advanced Retirement Planner

[... existing content remains unchanged ...]

## Deployment Rules (STRICT - NO EXCEPTIONS)

**CRITICAL**: 100% test pass rate required before ANY deployment
- Run `npm test` and ensure 302/302 tests pass (updated from 245)
- NO exceptions for "critical fixes" or "urgent deployments"  
- If tests fail, fix the tests FIRST, then deploy
- NEVER commit or push with failing tests
- This rule supercedes all other priorities

## Test Compliance Requirements

- All 302 tests must pass (100% success rate)
- Performance test requires < 5 inline script tags in index.html
- Security tests must pass (no vulnerabilities)
- Syntax validation must pass for all JavaScript files
- Component export validation must pass
- AFTER DEPLOYMENT: Run E2E tests on production URL
  - Use test-production-financial-health.html for financial health scoring validation
  - Verify all 5 test cases pass on https://ypollak2.github.io/advanced-retirement-planner/
  - Document any production-specific issues found

## Memory Log

- To memorize - you need to have 100% QA testing pass
- NEVER deploy unless `npm test` shows 302/302 tests passing
- Fix any failing tests before deployment, no matter how urgent the fix seems
- When user shares error messages, use different specialized agents to investigate:
  - Use Search agent for finding related error patterns in codebase
  - Use Debug agent for analyzing console logs and stack traces
  - Use Test agent for running specific test scenarios
  - Split complex debugging across multiple agents working in parallel

## Audit Process Documentation

**AUDIT-001 Complete:** Comprehensive test framework implemented for financial health scoring
- 10 test scenarios covering all user types and edge cases
- Professional web-based test runner with real-time results
- Environment validation utility with mock fallbacks
- Complete documentation preserved for future audits

**For Future Audits:**
- Use `/docs/AUDIT-PROCESS-TEMPLATE.md` as blueprint
- Reference AUDIT-001 implementation files as working examples
- Follow 5-phase process: Analysis → Framework → Execution → Fixes → Documentation
- All audit files preserved in `/plans/`, `/tests/scenarios/`, and `/docs/` directories

## Task Planning Standards

When planning a task, follow these rules:
1. Create a detailed plan in markdown format in `plans/` folder
2. Give each plan a ticket number for easy reference (e.g., TICKET-001)
3. Include all implementation steps, files to create/modify, and success criteria
4. Reference the plan file in each related todo item
5. When all tasks for a plan are completed, delete the plan file
6. Plans should be as detailed as possible to ensure nothing is missed

## Component Architecture Standards

- NO ES6 modules - all components use window exports and React.createElement
- Components MUST be loaded via script tags in index.html in correct order
- Use `window.ComponentName = ComponentName` pattern for all exports
- React components use `React.createElement` NOT JSX
- Dependencies must be loaded BEFORE components that use them

## Financial Calculation Rules

- ALWAYS validate currency rates before division (prevent NaN/Infinity)
- Currency conversion MUST handle 6 types: ILS, USD, EUR, GBP, BTC, ETH
- All financial amounts must use formatCurrency() for display
- RSU calculations: units × stock price × frequency (not dollar amounts)
- NEVER modify core calculation logic without running all test scenarios

## Couple Planning Mode Rules

- Every new field MUST work in both individual AND couple modes
- Partner fields follow pattern: partner1FieldName, partner2FieldName
- Use getFieldValue() from financialHealthEngine.js for field access
- Test all features with planningType: 'couple' AND 'individual'
- Main Person sections hidden in couple mode (show Partner 1/2 instead)

## External API Integration Rules

- ALL external APIs need CORS proxy for GitHub Pages deployment
- Implement fallback data for offline scenarios
- Cache API responses (5-minute TTL minimum)
- Add domain validation for security (Yahoo Finance only)
- Handle API failures gracefully with user-friendly messages

## Version Update Protocol

- NEVER manually edit version numbers
- Use: `node scripts/update-version.js X.Y.Z`
- Version updates 111+ locations automatically
- Commit message format: "chore: Bump version to vX.Y.Z"
- Version format: MAJOR.MINOR.PATCH (semantic versioning)

## Updated Test Requirements

- All 302 tests must pass (increased from 245)
- Test categories:
  - File structure tests
  - Syntax validation tests  
  - Component export tests
  - Integration tests
  - Couple mode tests
  - Financial calculation tests
- Run `npm test` before EVERY commit
- New features require corresponding tests

## State and Data Persistence

- Use localStorage for wizard progress (auto-save)
- localStorage keys: 'retirementWizardInputs', 'wizardCurrentStep'
- Validate loaded data before use (may be from older versions)
- Handle backward compatibility for legacy fields
- Clear localStorage only with user confirmation

## Error Handling Requirements

- NEVER let errors crash the app - use try/catch
- Log errors with context: `console.error('Component: Error details', error)`
- Provide user-friendly error messages (Hebrew & English)
- API errors need specific handling with fallbacks
- Division by zero checks mandatory in calculations

## Performance Optimization Rules

- Load scripts in parallel using Promise.all pattern
- Maximum 5 inline script tags in index.html
- Use cache-busting: `?v=X.Y.Z` on all script/CSS loads
- Implement stale-while-revalidate for API caching
- Limit cache sizes (50 entries max) to prevent memory leaks

## Security Requirements

- Validate ALL user inputs before calculations
- Domain whitelist for CORS proxy (Yahoo Finance only)
- No API keys in frontend code
- Sanitize data before localStorage save
- XSS prevention: use textContent not innerHTML

## Internationalization Rules

- Support Hebrew (he) and English (en) for ALL text
- Use multiLanguage.js translations consistently
- RTL support required for Hebrew UI
- Currency symbols must match locale
- Date formats respect user's language setting

## Pre-Deployment Code Review

Before ANY deployment:
1. [ ] All 302 tests passing
2. [ ] Version bumped correctly
3. [ ] CHANGELOG.md updated
4. [ ] No console.error in browser
5. [ ] Tested in couple mode
6. [ ] Tested offline scenario
7. [ ] Currency conversion working
8. [ ] Mobile responsive tested
9. [ ] Hebrew/English both working
10. [ ] Backward compatibility verified

## Debug and Logging Standards

- Production logs should be minimal
- Use environment detection: `isDev = hostname === 'localhost'`
- Debug logs only in development
- Financial calculations log warnings for invalid data
- Partner field mapping has verbose debug mode

## Do Not Touch List

Files requiring extreme caution:
1. src/utils/retirementCalculations.js - Core engine
2. src/utils/financialHealthEngine.js - Field mapping
3. src/data/marketConstants.js - Financial constants
4. tests/test-runner.js - Test definitions
5. scripts/update-version.js - Version automation

Changes to these files require:
- Team review
- Full regression testing
- Couple mode validation

## Production Deployment Checklist

### Pre-Deployment Requirements (MANDATORY)
1. **Test Coverage**: 100% pass rate (245/245 tests) - NO EXCEPTIONS
2. **Version Management**: Update in version.json, package.json, README.md
3. **Documentation**: Update README "What's New" section
4. **Security**: Run `npm audit` and `npm run security:scan`
5. **Build Date**: Update in version.json to deployment date

### Deployment Commands
```bash
# Step 1: Run comprehensive pre-deployment check
npm run deploy:pre-check

# Step 2: Deploy to production (interactive)
npm run deploy:production

# Step 3: Verify deployment (after 3-5 minutes)
npm run deploy:verify
```

### Automated Deployment Process
1. Runs all 245 tests (must pass 100%)
2. Validates version consistency
3. Checks security vulnerabilities
4. Verifies build readiness
5. Creates git tag for version
6. Pushes to main branch (triggers GitHub Actions)
7. Waits for deployment completion
8. Runs post-deployment verification

### Post-Deployment Verification
- Production URL: https://ypollak2.github.io/advanced-retirement-planner/
- Mirror URL: https://advanced-retirement-planner.netlify.app/
- Check version displays correctly
- Test core functionality
- Verify Service Worker registered
- Monitor for console errors

### Rollback Procedures
```bash
# Quick rollback (reverts last commit)
git revert HEAD --no-edit && git push origin main

# Manual rollback to specific version
git reset --hard [COMMIT_HASH] && git push origin main --force
```

### Deployment Schedule
- **Best**: Tuesday-Thursday, 10 AM - 2 PM
- **Avoid**: Fridays, weekends, holidays
- **Never**: Deploy with failing tests