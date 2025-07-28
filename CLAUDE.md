# Claude Code Development Standards for Advanced Retirement Planner

[... existing content remains unchanged ...]

## Deployment Rules (STRICT - NO EXCEPTIONS)

**CRITICAL**: 100% test pass rate required before ANY deployment
- Run `npm test` and ensure 245/245 tests pass
- NO exceptions for "critical fixes" or "urgent deployments"  
- If tests fail, fix the tests FIRST, then deploy
- NEVER commit or push with failing tests
- This rule supercedes all other priorities

## Test Compliance Requirements

- All 245 tests must pass (100% success rate)
- Performance test requires < 5 inline script tags in index.html
- Security tests must pass (no vulnerabilities)
- Syntax validation must pass for all JavaScript files
- Component export validation must pass

## Memory Log

- To memorize - you need to have 100% QA testing pass
- NEVER deploy unless `npm test` shows 245/245 tests passing
- Fix any failing tests before deployment, no matter how urgent the fix seems