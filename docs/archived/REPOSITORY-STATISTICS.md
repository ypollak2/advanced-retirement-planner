# Advanced Retirement Planner - Repository Statistics

## Overview
This document provides comprehensive statistics and metrics for the Advanced Retirement Planner repository as of July 30, 2025.

## Table of Contents
- [File Statistics](#file-statistics)
- [Code Metrics](#code-metrics)
- [Directory Structure](#directory-structure)
- [Component Architecture](#component-architecture)
- [Test Coverage](#test-coverage)
- [Git History](#git-history)
- [File Size Analysis](#file-size-analysis)
- [Documentation Metrics](#documentation-metrics)
- [Development Tools](#development-tools)

## File Statistics

### Total Files by Type
| File Type | Count | Lines of Code |
|-----------|-------|---------------|
| JavaScript (.js) | 229 | 100,947 |
| Markdown (.md) | 96 | 27,082 |
| JSON (.json) | 25 | 9,030 |
| HTML (.html) | 9 | 5,002 |
| CSS (.css) | 2 | 2,026 |
| **Total** | **361** | **144,087** |

### Code vs Documentation Ratio
- Total code lines: 117,005
- Documentation lines: 27,082
- Documentation ratio: **18.79%**

## Code Metrics

### Component Distribution
- Total React components: **67**
- Component categories:
  - Wizard components: 14
  - Shared components: 14
  - Panel components: 13
  - Analysis components: 6
  - Review components: 5
  - Form components: 4
  - Core components: 3
  - Chart components: 3
  - Scenario components: 2
  - Other (validation, tracking, debug): 3

### Utility Functions
- Total utility files: **46**
- Total utility functions: ~522
- Average functions per file: **11**

### Module Architecture
- Core modules in `/src/modules/`: 4
- Main application entry: `/src/app.js`
- Service Worker: `/sw.js`

## Directory Structure

### Top-Level Directories
| Directory | Purpose | File Count |
|-----------|---------|------------|
| `/src` | Source code | 115 files |
| `/tests` | Test suites | 66 files |
| `/docs` | Documentation | 48 files |
| `/scripts` | Build & deployment tools | 16 files |
| `/.archive` | Archived code & tests | 23 files |
| `/plans` | Development plans | 7 files |
| `/config` | Configuration files | 3 files |
| `/lib` | Library code | 2 files |
| `/dist` | Production build | 3 files |

### Source Code Organization
```
/src
├── /components (67 files)
│   ├── /analysis (6)
│   ├── /charts (3)
│   ├── /core (3)
│   ├── /forms (4)
│   ├── /panels (13)
│   ├── /review (5)
│   ├── /scenarios (2)
│   ├── /shared (14)
│   ├── /wizard (14)
│   └── /validation, /tracking, /debug (3)
├── /utils (46 files)
├── /data (1 file)
├── /modules (4 files)
├── /styles (1 file)
└── /translations (1 file)
```

## Test Coverage

### Test Statistics
- Total test files: **66**
- Test categories:
  - Unit tests: `/tests/unit/`
  - Integration tests: `/tests/integration/`
  - E2E tests: `/tests/e2e/`
  - Performance tests: `/tests/performance/`
  - Security tests: `/tests/security/`
  - Browser tests: `/tests/browser/`
  - Manual tests: `/tests/manual/`

### Test Requirements
- Total test suite: **302 tests**
- Required pass rate: **100%**
- Test runner: `/tests/test-runner.js` (156.8 KB)

## Git History

### Repository Timeline
- First commit: **July 6, 2025**
- Latest commit: **July 30, 2025**
- Total commits: **504**
- Total contributors: **2**
- Development period: **24 days**
- Average commits/day: **21**

## File Size Analysis

### Storage Metrics
- Total repository size: **5.73 MB**
- Average file size: **16.25 KB**
- Total tracked files: **361**

### Largest Files (Top 10)
| File | Size |
|------|------|
| `/tests/test-runner.js` | 156.8 KB |
| `/package-lock.json` | 118.5 KB |
| `/src/utils/financialHealthEngine.js` | 118.1 KB |
| `/src/components/core/RetirementPlannerApp.js` | 103.7 KB |
| `/src/components/wizard/steps/WizardStepSalary.js` | 81.2 KB |
| `/CHANGELOG.md` | 63.4 KB |
| `/src/components/core/Dashboard.js` | 62.5 KB |
| `/docs/archived/code-review-report.json` | 54.8 KB |
| `/src/components/wizard/steps/WizardStepSavings.js` | 54.7 KB |
| `/src/utils/retirementCalculations.js` | 51.5 KB |

## Documentation Metrics

### Documentation Distribution
- Main documentation: `/docs/` (48 files)
- Claude AI instructions: `/CLAUDE.md`
- Project documentation: `/README.md`
- Changelog: `/CHANGELOG.md`
- Deployment guides: 8 files
- Testing guides: 7 files
- Architecture docs: 5 files
- Process templates: 4 files

### Documentation Categories
- Technical documentation: ~60%
- Process documentation: ~25%
- User guides: ~15%

## Development Tools

### Scripts and Automation (16 files)
- **Version Management**: `update-version.js`, `simulate-version-bump.js`
- **Deployment**: `pre-deployment-check.js`, `deployment-validator.js`, `deployment-verification.js`
- **Quality Assurance**: `pre-release-qa.js`, `pre-commit-enhanced.js`, `pre-push-validator.js`
- **Security**: `secret-scanner.js`, `security-check.js`
- **Testing**: `run-financial-health-tests.js`, `test-generator.js`
- **Development**: `dev-watcher.js`, `analyze-fallback-logs.js`

### Configuration Files
- Build config: `/config/vite.config.js`
- CORS proxy: `/config/cors-proxy-solution.js`
- Package management: `/package.json`, `/package-lock.json`
- Version tracking: `/version.json`

## Code Quality Indicators

### Architectural Patterns
- Component-based architecture (React)
- Utility-first design pattern
- Modular code organization
- Comprehensive test coverage
- Multi-language support (Hebrew/English)

### Best Practices Implementation
- Error boundaries for React components
- Service Worker for offline functionality
- Performance monitoring utilities
- Security scanning in CI/CD
- Automated version management
- Comprehensive documentation

## Interesting Metrics

### Development Velocity
- **21 commits/day** average
- **6,003 lines/day** written (including docs)
- **15 files/day** created or modified

### Code Density
- **442 lines/file** average for JS files
- **11 functions/utility file** average
- **67 components** serving multiple features

### Test Coverage Density
- **1 test file per 3.5 source files**
- **302 tests** for comprehensive coverage
- **5 different test categories**

## Additional Insights

### Internationalization
- Hebrew translations: **203**
- English translations: **215**
- Full bilingual support throughout the application

### API Integration
- Files with API calls: **25**
- External services integrated:
  - Yahoo Finance (stock prices)
  - Currency exchange rates
  - Cryptocurrency prices
  - CORS proxy for GitHub Pages compatibility

### React Architecture
- Class components: **2** (legacy)
- Functional components: **~61**
- Component pattern: **97% functional**
- No JSX - uses `React.createElement` throughout

### Code Documentation
- Single-line comments: **3,759**
- Multi-line comment blocks: **69**
- Comment density: **~3.8%** of total lines
- Inline documentation for complex calculations

### Performance Optimizations
- Service Worker for offline functionality
- Lazy loading for components
- Parallel script loading
- Cache-busting with version strings
- Stale-while-revalidate caching strategy

### Security Features
- Input validation on all forms
- XSS protection
- Secret scanning in CI/CD
- Domain whitelisting for CORS proxy
- No API keys in frontend code

---

*Generated on July 30, 2025*
*Repository: advanced-retirement-planner*
*Total development time: 24 days*