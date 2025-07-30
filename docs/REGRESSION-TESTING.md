# Automated Regression Testing Guide

## Overview

This document describes the automated regression testing setup for the Advanced Retirement Planner application. The system ensures code quality and prevents regressions through multiple layers of automated testing.

## Testing Layers

### 1. Local Git Hooks

#### Pre-commit Hook
- **Purpose**: Quick syntax validation before commits
- **Runtime**: < 5 seconds
- **What it checks**:
  - JavaScript syntax validation
  - File structure integrity
  - No console.log statements in production code

#### Pre-push Hook
- **Purpose**: Comprehensive testing before pushing to remote
- **Runtime**: 1-2 minutes
- **What it checks**:
  - Full test suite (354+ tests)
  - Financial health scenarios
  - Security vulnerabilities
  - Version consistency
  - Performance benchmarks

### 2. GitHub Actions CI/CD

#### Regression Test Workflow
- **Triggers**:
  - Every push to main/master/stage branches
  - All pull requests
  - Daily at 2 AM UTC
  - Manual trigger via GitHub UI
  
- **Test Matrix**:
  - Node.js versions: 18.x, 20.x
  - All test suites run in parallel
  
- **Test Coverage**:
  1. Main test suite (354+ tests)
  2. Financial health tests (52+ tests)
  3. Performance tests
  4. Security tests
  5. Accessibility tests
  6. User experience tests
  7. Language consistency tests
  8. Version consistency tests
  9. Currency consistency tests
  10. Component integration tests

### 3. Test Categories

#### Critical Tests (Must Pass)
- Syntax validation
- Main test suite
- Financial health calculations
- Security vulnerabilities
- Version consistency

#### Important Tests (Should Pass)
- Performance benchmarks
- Accessibility standards
- UX consistency
- Language translations
- Component integration

#### Informational Tests
- Code coverage reports
- Performance metrics
- Bundle size analysis

## Setup Instructions

### 1. Install Git Hooks

```bash
npm run hooks:install
```

This will install:
- Pre-commit hook for syntax validation
- Pre-push hook for regression tests

### 2. Run Regression Tests Manually

```bash
# Run all regression tests
npm run test:regression

# Run specific test suites
npm test                      # Main test suite
npm run test:financial-health # Financial health tests
npm run test:performance      # Performance tests
npm run test:security        # Security tests
```

### 3. Configure GitHub Actions

The workflow is automatically configured in `.github/workflows/regression-tests.yml`. No additional setup needed.

## Test Scenarios

### Financial Health Scenarios (10 scenarios)
1. Young Professional (Individual, Israel)
2. Mid-Career Couple (Couple, USA)
3. Pre-Retirement Individual (Individual, UK)
4. High Earner with RSUs (Individual, Israel)
5. Debt-Heavy Young Family (Couple, Israel)
6. Crypto Investor (Individual, USA)
7. International Expat (Individual, EUR)
8. Conservative Retiree (Individual, Israel)
9. FIRE Aspirant (Individual, USA)
10. Multi-Currency Portfolio (Couple, Multiple)

### Performance Benchmarks
- Initial calculation: < 100ms
- Cached calculation: < 10ms
- Memory usage: < 10MB for 100 calculations
- Cache hit rate: > 80% after warmup

## Bypassing Tests (Not Recommended)

In emergency situations only:

```bash
# Skip pre-commit hook
git commit --no-verify

# Skip pre-push hook
git push --no-verify
```

⚠️ **WARNING**: Bypassing tests may introduce bugs or regressions. Use only when absolutely necessary and ensure manual testing is performed.

## Monitoring and Alerts

### GitHub Actions Dashboard
- View all workflow runs: Actions tab in GitHub
- Failed tests create issues automatically
- PR comments show test results

### Local Test Reports
- Test results saved to `test-report.md`
- Performance metrics logged to console
- Failed tests show detailed error messages

## Best Practices

1. **Run tests before committing**
   ```bash
   npm test
   ```

2. **Fix failing tests immediately**
   - Don't accumulate test debt
   - Each commit should have passing tests

3. **Add tests for new features**
   - Write tests alongside feature development
   - Aim for > 80% code coverage

4. **Monitor performance**
   - Check performance test results regularly
   - Investigate any performance regressions

5. **Keep tests fast**
   - Unit tests should run in < 100ms
   - Integration tests should run in < 1s
   - Use mocking for external dependencies

## Troubleshooting

### Common Issues

1. **Tests failing locally but passing in CI**
   - Check Node.js version: `node --version`
   - Clear cache: `npm run test:clear-cache`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

2. **Performance tests failing**
   - Clear performance cache
   - Check for memory leaks
   - Profile slow calculations

3. **Git hooks not running**
   - Reinstall hooks: `npm run hooks:install`
   - Check file permissions: `ls -la .git/hooks/`
   - Ensure scripts are executable

### Getting Help

- Check test output for specific error messages
- Run tests with debug flag: `DEBUG=true npm test`
- Review recent commits for breaking changes
- Open an issue with test failure details

## Maintenance

### Weekly Tasks
- Review test performance metrics
- Check for flaky tests
- Update test baselines if needed

### Monthly Tasks
- Review and update test scenarios
- Check GitHub Actions usage/costs
- Update Node.js versions in test matrix

### Quarterly Tasks
- Full regression test audit
- Performance baseline updates
- Security vulnerability scan

---

Last Updated: July 29, 2025
Version: 1.0.0