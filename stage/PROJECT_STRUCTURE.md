# 📁 Project Structure - Advanced Retirement Planner

This document describes the organized structure of the Advanced Retirement Planner repository after v7.0.2 reorganization.

## 🏗️ Root Directory Structure

```
advanced-retirement-planner/
├── 📄 Core Files
│   ├── README.md                    # Main project documentation
│   ├── CHANGELOG.md                 # Version history and changes
│   ├── CLAUDE.md                    # Development standards and guidelines
│   ├── PROJECT_STRUCTURE.md         # This file
│   ├── package.json                 # Node.js dependencies and scripts
│   ├── package-lock.json           # Locked dependency versions
│   └── index.html                   # Main application entry point
│
├── 📂 Source Code (/src/)
│   ├── components/                  # React components
│   ├── utils/                       # Utility functions and engines
│   ├── styles/                      # CSS styles
│   ├── translations/                # Multi-language support
│   └── data/                        # Static data and constants
│
├── 📂 Configuration (/config/)
│   ├── deployment/                  # Deployment configurations
│   ├── development/                 # Development tools
│   └── security/                    # Security configurations
│
├── 📂 Documentation (/docs/)
│   ├── operations/                  # Deployment and operational docs
│   ├── reports/                     # Analysis and audit reports  
│   ├── releases/                    # Release notes and changelogs
│   ├── checklists/                  # QA and process checklists
│   └── technical/                   # Technical specifications
│
├── 📂 Testing (/tests/)
│   ├── unit/                        # Unit tests
│   ├── integration/                 # Integration tests
│   ├── e2e/                         # End-to-end tests
│   └── performance/                 # Performance benchmarks
│
├── 📂 Scripts (/scripts/)
│   ├── deployment/                  # Deployment automation
│   ├── development/                 # Development helpers
│   └── qa/                          # Quality assurance tools
│
├── 📂 Public Assets (/public/)
│   ├── favicon.ico                  # Site favicon
│   └── sw.js                        # Service worker
│
└── 📂 Archive (/.archive/)
    ├── debug/                       # Debug scripts and logs
    ├── test-files/                  # Archived test files
    ├── reports/                     # Historical reports
    └── temp-files/                  # Temporary analysis files
```

## 🎯 Component Architecture (/src/components/)

### Core Components
- **RetirementPlannerApp.js** - Main application container
- **Dashboard.js** - Primary dashboard interface
- **LazyComponent.js** - Dynamic component loading

### Feature Components
```
components/
├── analysis/          # Financial analysis tools
│   ├── ReadinessScore.js
│   ├── StressTestInterface.js
│   └── MonteCarloResultsDashboard.js
├── charts/           # Visualization components
│   ├── FinancialChart.js
│   └── ScenarioChart.js
├── forms/            # Input forms and validation
│   ├── BasicInputs.js
│   └── RetirementAdvancedForm.js
├── panels/           # Information display panels
│   ├── analysis/
│   ├── settings/
│   └── summary/
├── wizard/           # Guided setup wizard
│   ├── RetirementWizard.js
│   └── steps/        # Individual wizard steps
└── shared/           # Reusable components
    ├── CurrencySelector.js
    ├── FinancialHealthScoreEnhanced.js
    └── ExportControls.js
```

## ⚙️ Utility Functions (/src/utils/)

### Core Engines
- **retirementCalculations.js** - Primary calculation engine
- **financialHealthEngine.js** - Health score calculations
- **monteCarloSimulation.js** - Advanced projections

### Specialized Utilities
```
utils/
├── 💰 Financial Calculations
│   ├── pensionCalculations.js
│   ├── taxOptimization.js
│   ├── debtCalculations.js
│   └── inflationCalculations.js
├── 🌐 External APIs
│   ├── currencyAPI.js
│   ├── stockPriceAPI.js
│   └── cryptoPriceAPI.js
├── 🛠️ System Utilities
│   ├── fullAppInitializer.js
│   ├── performanceMonitor.js
│   └── analyticsTracker.js
└── 📊 Analysis Tools
    ├── portfolioOptimizer.js
    ├── stressTestLogic.js
    └── withdrawalStrategies.js
```

## 🧪 Testing Structure (/tests/)

### Test Categories
- **Unit Tests** - Individual function testing
- **Integration Tests** - Component interaction testing
- **E2E Tests** - Full user workflow testing
- **Performance Tests** - Speed and efficiency testing
- **Security Tests** - Vulnerability and safety testing

### Key Test Files
- `test-runner.js` - Main test execution
- `e2e-test.js` - End-to-end user scenarios
- `security-qa-analysis.js` - Security validation
- `performance-tests.js` - Performance benchmarks

## 📝 Documentation Organization (/docs/)

### Operations
- Deployment procedures
- Production maintenance
- Infrastructure setup

### Reports
- QA audit results
- Performance analysis
- Bug fix summaries
- UX improvement reports

### Technical
- Architecture decisions
- API documentation
- Database schemas
- Integration guides

### Business
- Requirements analysis
- User experience research
- Product roadmap
- Market analysis

## 🔧 Configuration Files (/config/)

### Deployment
- Docker configurations
- Netlify settings
- GitHub Pages setup
- CI/CD pipelines

### Development
- Build tools
- Development servers
- Hot reload settings
- Debug configurations

### Security
- CORS policies
- Content security policies
- Authentication setup
- Data protection rules

## 📦 Scripts Directory (/scripts/)

### Automation Scripts
- `deployment-validator.js` - Pre-deployment checks
- `pre-commit-enhanced.js` - Git hooks
- `update-version.js` - Version management
- `test-generator.js` - Automated test creation

### Development Tools
- `dev-watcher.js` - File change monitoring
- `secret-scanner.js` - Security scanning
- `performance-profiler.js` - Performance analysis

## 🗄️ Archive Directory (/.archive/)

Contains historical files and temporary analysis:
- Debug scripts from development phases  
- Archived test files and reports
- Temporary analysis and investigation files
- Historical performance data

## 🚀 Quick Navigation

### For Developers
- Start with `/src/components/core/RetirementPlannerApp.js`
- Core calculations in `/src/utils/retirementCalculations.js`
- Add new features in `/src/components/[category]/`

### For QA/Testing
- Run tests from `/tests/test-runner.js`
- Check test coverage in `/tests/performance/`
- Review QA checklists in `/docs/checklists/`

### For Deployment
- Follow procedures in `/docs/operations/DEPLOYMENT_CHECKLIST.md`
- Use scripts in `/scripts/deployment/`
- Review configurations in `/config/deployment/`

### For Documentation
- User guides in `/docs/user/`
- Technical specs in `/docs/technical/`
- Business analysis in `/docs/business/`

## 📋 Maintenance Guidelines

### File Organization Rules
1. **Source files** only in `/src/`
2. **Documentation** organized by audience and purpose
3. **Temporary files** archived, not deleted
4. **Configuration** centralized in `/config/`
5. **Scripts** categorized by function

### Naming Conventions
- **Components**: PascalCase (e.g., `RetirementWizard.js`)
- **Utilities**: camelCase (e.g., `retirementCalculations.js`)
- **Constants**: UPPER_SNAKE_CASE
- **Directories**: kebab-case for multi-word names

### Archive Policy
- Move debug files to `.archive/debug/` after resolution
- Archive temporary analysis files monthly
- Keep test files for historical reference
- Preserve all reports for audit trails

---

**Last Updated**: v7.0.2 - July 29, 2025
**Maintained by**: Yali Pollak (יהלי פולק) - Advanced Retirement Planner Team