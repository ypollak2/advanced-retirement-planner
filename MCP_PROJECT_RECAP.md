# Advanced Retirement Planner - Comprehensive Project Recap for MCP

## 🎯 Project Overview

The **Advanced Retirement Planner** is a sophisticated, browser-based financial planning application designed to help individuals and couples plan for retirement. Built with React (via CDN) and deployed on GitHub Pages, it provides comprehensive retirement analysis without requiring any server infrastructure or user accounts.

**Production URL**: https://ypollak2.github.io/advanced-retirement-planner/  
**Version**: 7.5.10 (as of August 2025)  
**Test Coverage**: 374 tests (100% pass rate required for deployment)

## 🏗️ Architecture Overview

### Technology Stack
- **Frontend**: React 18+ (CDN-based, no build step)
- **Styling**: Tailwind CSS 2.2.19 + Custom CSS
- **Language**: Pure JavaScript (no JSX, no ES6 modules)
- **Deployment**: GitHub Pages (static hosting)
- **Testing**: Custom test runner (374 tests)
- **Internationalization**: Hebrew/English support

### Key Architectural Decisions
1. **No Build Process**: Direct browser-compatible JavaScript
2. **Window-based Components**: All components export to `window` object
3. **Script Tag Loading**: Explicit load order control in index.html
4. **CDN Dependencies**: React and Tailwind loaded from CDN
5. **Client-Side Only**: All calculations happen in the browser

## 📁 Project Structure

```
advanced-retirement-planner/
├── src/
│   ├── components/        # 65 React components
│   ├── utils/            # Calculation engines & utilities
│   ├── data/             # Constants & static data
│   ├── translations/     # i18n support
│   └── styles/           # CSS files
├── tests/                # 374 comprehensive tests
├── docs/                 # Extensive documentation
├── scripts/              # Automation tools
└── plans/                # Development planning docs
```

## 🚀 Core Features

### 1. **Multi-Step Retirement Wizard** (9 Steps)
- Personal information and retirement goals
- Comprehensive income tracking (salary, bonuses, RSUs, rentals)
- Multi-asset portfolio management
- Tax optimization across countries
- Estate planning considerations

### 2. **Advanced Couple Planning Mode**
- Per-partner financial data collection
- Joint financial projections
- Partner compatibility analysis
- Different retirement age support

### 3. **Financial Analysis Tools**
- **Monte Carlo Simulations**: 10,000+ iteration probabilistic projections
- **Stress Testing**: 5 predefined scenarios + custom builder
- **Financial Health Score**: 8-factor comprehensive scoring (0-100)
- **Withdrawal Strategies**: 6 systematic approaches analyzed
- **Inflation Impact Analysis**: Real vs nominal projections

### 4. **Investment Features**
- Multi-currency support (ILS, USD, EUR, GBP, BTC, ETH)
- Real-time stock price integration (40+ tech companies)
- Portfolio optimization engine
- Tax-efficient asset location
- Risk-adjusted recommendations

### 5. **Technical Capabilities**
- Progressive Web App (offline support)
- Auto-save and session recovery
- Multiple export formats (PNG, PDF, JSON)
- Mobile-responsive design
- Debug mode for troubleshooting

## 💼 Business Context

### Target Users
- **Primary**: Israeli professionals planning for retirement
- **Secondary**: International users (USA, UK, EU support)
- **Special Focus**: Tech employees with RSU compensation

### Key Differentiators
1. **Couple Planning**: Sophisticated partner-based analysis
2. **RSU Integration**: Direct stock price fetching for tech companies
3. **Israeli Market**: Training fund and pension calculations
4. **No Registration**: Complete privacy, client-side only
5. **Comprehensive Testing**: 374 tests ensure reliability

## 🔧 Development Workflow

### Key Commands
```bash
npm test                    # Run all 374 tests
npm run deploy:production   # Deploy to GitHub Pages
npm run validate:components # Validate component rendering
npm run security:scan       # Security vulnerability check
```

### Critical Development Rules
1. **100% Test Pass Required**: No deployment with failing tests
2. **Version Management**: Use `scripts/update-version.js` only
3. **No Manual Component Edits**: Follow window export pattern
4. **Component Load Order**: Maintain script tag sequence in index.html
5. **API CORS Proxy**: Required for external API calls

### Testing Strategy
- **Unit Tests**: Core calculations and utilities
- **Integration Tests**: Component interactions
- **E2E Tests**: 25 browser-based user flow tests
- **Performance Tests**: Load time and rendering
- **Security Tests**: Input validation and XSS prevention

## 📊 Current State & Metrics

### Project Statistics
- **Components**: 65 React components
- **Tests**: 374 (all passing)
- **Code Coverage**: Comprehensive across all features
- **Languages**: 2 (Hebrew, English)
- **Currencies**: 6 (including crypto)
- **Deployment Frequency**: ~2-3 times per week

### Recent Updates (v7.5.10)
- Critical hotfix for expense panel crash
- RSU tax rate input improvements
- Emergency fund calculator addition
- Manual stock price entry for offline mode
- Salary income calculation fixes

## 🔒 Security & Compliance

### Security Features
- Client-side only (no data transmission)
- Input validation on all calculations
- XSS prevention measures
- Content Security Policy headers
- Domain whitelisting for APIs

### Privacy Compliance
- No user tracking or analytics
- LocalStorage only (no cookies)
- Export without personal identifiers
- Clear data functionality
- GDPR-friendly architecture

## 🎓 Knowledge Base

### Key Files for Understanding
1. **`CLAUDE.md`**: Comprehensive development standards
2. **`src/utils/retirementCalculations.js`**: Core calculation engine
3. **`src/utils/financialHealthEngine.js`**: Health scoring system
4. **`tests/test-runner.js`**: Test framework implementation
5. **`index.html`**: Application entry and component loading

### Common Development Tasks
1. **Adding a Feature**: Update wizard, add tests, validate couple mode
2. **Fixing Bugs**: Check console logs, run specific tests, validate edge cases
3. **Deployment**: Ensure 100% tests pass, update version, run deploy script
4. **Debugging**: Use `?debug=true` URL parameter for console export

## 🚦 MCP Integration Points

### Suggested Memory Categories
1. **Project Structure**: Directory layout, component organization
2. **Feature Set**: Core capabilities, recent additions
3. **Technical Stack**: Dependencies, APIs, deployment
4. **Development Standards**: Testing requirements, coding patterns
5. **Business Context**: User needs, market positioning

### Key Facts to Remember
- Version 7.5.10 requires 374 tests to pass
- No ES6 modules - use window exports
- Couple mode requires all features to work for both partners
- CORS proxy needed for external APIs
- Hebrew/English support is mandatory

### Frequent Issues & Solutions
1. **Test Failures**: Usually missing field validation or couple mode bugs
2. **API Timeouts**: Implement fallback data for offline scenarios
3. **Component Errors**: Check load order in index.html
4. **Calculation NaN**: Validate currency rates before division
5. **Deployment Fails**: Ensure all tests pass first

## 📈 Future Roadmap

### Planned Enhancements
- Social Security optimization calculator
- Healthcare cost projections
- Legacy planning tools
- AI-powered recommendations
- More international tax regimes

### Technical Improvements
- Performance optimizations
- Enhanced offline capabilities
- Better error recovery
- Expanded test coverage
- Accessibility improvements

---

This comprehensive recap provides the MCP with a complete understanding of the Advanced Retirement Planner project, its architecture, features, development practices, and current state. The project represents a sophisticated financial planning tool with enterprise-level quality standards and comprehensive testing.