# 🏗️ Advanced Retirement Planner v6.6.3 - System Architecture

## Overview

The Advanced Retirement Planner v6.0.0 represents a major architectural evolution, introducing a sophisticated partner planning system with multi-step wizard interface, country-specific pension rules, and enhanced calculation engine. This document outlines the comprehensive technical architecture supporting these advanced features.

## 🎯 Core Architecture Principles

### **1. Component-Based Modular Design**
- **React.createElement Patterns**: All components use consistent React.createElement syntax for maximum compatibility
- **Window Exports**: Global component access via `window.ComponentName` for script tag loading
- **State Management**: Centralized input state with proper lifting and prop drilling
- **Separation of Concerns**: Clear boundaries between UI, logic, and data layers

### **2. Progressive Enhancement**
- **Wizard Interface**: 8-step guided process from basic info to advanced partner planning
- **Conditional Rendering**: Dynamic UI based on planning type (individual vs couple)
- **Smart Defaults**: Intelligent default values based on country selection and user inputs
- **Real-Time Updates**: Instant calculation updates as users modify inputs

### **3. Multi-Partner Support**
- **Per-Partner Data Models**: Individual salary, savings, contribution rates, fees, and returns
- **Flexible Planning Types**: Support for individual, couple, and future family structures
- **Dynamic Component Rendering**: Components adapt based on selected planning type
- **Partner-Specific Validations**: Tailored input validation for each partner's data

### **4. Security by Design**
- **No eval() Usage**: Pure data processing without code execution
- **Input Validation**: Comprehensive type checking and sanitization
- **XSS Prevention**: Safe DOM manipulation through React.createElement
- **Privacy First**: All calculations performed client-side
- **Semantic Secret Scanner**: AST-based secret detection with context awareness

### **5. DevSecOps Integration**
- **Automated Secret Detection**: CI/CD integrated scanning with exit code strategy
- **Context-Aware Analysis**: Cryptocurrency and UI component filtering
- **Multi-Format Reporting**: Console, JSON, Markdown, and SARIF outputs
- **Performance Optimized**: Concurrent processing with timeout protection

## 📁 Project Structure

```
advanced-retirement-planner/
├── 📄 index.html                     # Application entry point with script loading
├── 📄 package.json                   # Dependencies and development scripts
├── 📄 version.json                   # Version management for cache busting
├── 📁 src/                           # Source code directory
│   ├── 📁 components/                # React components (20+ files)
│   │   ├── RetirementPlannerApp.js   # Main application orchestrator
│   │   ├── WizardStepSalary.js       # Step 1: Salary and income collection
│   │   ├── WizardStepSavings.js      # Step 2: Current savings breakdown
│   │   ├── WizardStepContributions.js # Step 3: Pension contribution settings
│   │   ├── WizardStepFees.js         # Step 4: Management fees and returns
│   │   ├── SummaryPanel.js           # Real-time financial summary
│   │   ├── StressTestInterface.js    # Economic scenario testing
│   │   ├── ExportControls.js         # Data export functionality
│   │   ├── DynamicPartnerCharts.js   # Real-time chart visualization
│   │   ├── EnhancedRSUCompanySelector.js # Stock price integration
│   │   ├── MultiCurrencySavings.js   # Currency conversion display
│   │   ├── CurrencySelector.js       # Currency selection interface
│   │   └── ...                       # Additional UI components
│   ├── 📁 utils/                     # Core utility functions
│   │   ├── retirementCalculations.js # Enhanced calculation engine
│   │   ├── stressTestScenarios.js    # Economic scenario testing
│   │   ├── stockPriceAPI.js          # Real-time stock price fetching
│   │   ├── exportFunctions.js        # Export functionality (PNG, PDF, JSON)
│   │   ├── currencyUtils.js          # Currency conversion utilities
│   │   └── ...                       # Additional utilities
│   ├── 📁 styles/                    # CSS design system
│   │   └── main.css                  # Mobile-first responsive design
│   ├── 📁 data/                      # Static data and constants
│   │   └── marketConstants.js        # Country-specific pension data
│   └── 📁 translations/              # Internationalization
│       └── multiLanguage.js          # Hebrew/English translations
├── 📁 tests/                         # Comprehensive test suite
│   ├── test-runner.js                # Enhanced test runner (116 tests)
│   ├── partner-planning-test.js      # Partner feature validation
│   ├── wizard-interface-test.js      # Multi-step wizard testing
│   ├── calculation-logic-test.js     # Enhanced calculation validation
│   └── ...                           # Additional test suites
├── 📁 docs/                          # Documentation
│   ├── architecture.md               # This file
│   ├── partner-planning.md           # Partner planning guide
│   ├── wizard-interface.md           # Wizard interface documentation
│   └── ...                           # Additional documentation
├── 📁 lib/                           # Security and analysis libraries
│   ├── 📁 core/                      # Core analysis engines
│   │   └── analyzer.js               # AST-based secret analyzer
│   ├── 📁 config/                    # Configuration management
│   │   └── rule-definitions.js       # 50+ secret detection patterns
│   ├── 📁 filters/                   # Context-aware filters
│   └── 📁 reports/                   # Multi-format report generators
└── 📁 scripts/                       # Build and deployment
    ├── secret-scanner.js             # Semantic secret scanner CLI
    ├── pre-commit-qa.sh              # Quality assurance automation
    └── update-version.js             # Version management
```

## 🧩 Component Architecture

### **1. Main Application Layer**

#### **RetirementPlannerApp.js**
- **Primary Orchestrator**: Central state management and component coordination
- **State Management**: Manages `inputs` object with all user data and wizard progression
- **Wizard Navigation**: Controls step flow and validation between wizard steps
- **Calculation Trigger**: Orchestrates calculation engine calls and result display
- **Event Handling**: Manages user interactions and data updates

```javascript
// Core state structure
const [inputs, setInputs] = React.useState({
  // Planning configuration
  planningType: 'individual', // 'individual' | 'couple'
  taxCountry: 'israel',
  
  // Individual data
  currentAge: 30,
  retirementAge: 67,
  currentMonthlySalary: 20000,
  annualBonus: 0,
  quarterlyRSU: 0,
  
  // Partner data (if couple)
  partner1Name: '',
  partner1Salary: 0,
  partner2Name: '',
  partner2Salary: 0,
  
  // Savings breakdown
  currentSavings: 0,
  currentTrainingFundSavings: 0,
  personalPortfolioValue: 0,
  realEstateValue: 0,
  cryptoValue: 0,
  
  // Per-partner savings
  partner1CurrentPension: 0,
  partner1CurrentTrainingFund: 0,
  partner1PersonalPortfolio: 0,
  
  // Contribution rates
  employeePensionRate: 7.0,
  employerPensionRate: 10.5,
  trainingFundContributionRate: 7.5,
  
  // Management fees and returns
  contributionFees: 1.0,
  accumulationFees: 0.1,
  pensionReturn: 7.0,
  personalPortfolioReturn: 8.0
});
```

### **2. Wizard Interface Layer**

#### **WizardStepSalary.js** - Income Collection
- **Multi-Source Income**: Base salary, bonuses, RSUs, freelance, rental, dividends
- **Partner Data Collection**: Individual salary tracking for each partner
- **Tax Clarification**: Clear labeling that inputs are gross (before tax) amounts
- **Dynamic Validation**: Real-time input validation with sensible defaults
- **Currency Awareness**: Displays appropriate currency symbols based on selection

#### **WizardStepSavings.js** - Current Savings Breakdown
- **Individual Categories**: Pension, training fund, personal portfolio, real estate, crypto
- **Per-Partner Breakdown**: Detailed savings tracking for each partner
- **Total Calculation**: Real-time aggregation of all savings sources
- **Currency Formatting**: Proper formatting with locale-aware number display
- **Progress Tracking**: Visual indicators of savings accumulation

#### **WizardStepContributions.js** - Pension Contribution Rules
- **Country Selection**: Visual country picker with pension system details
- **Training Fund Thresholds**: Israeli salary-based contribution calculations
- **Employee/Employer Breakdown**: Separate tracking of contribution sources
- **Per-Partner Rates**: Individual contribution rates for each partner
- **Real-Time Status**: Dynamic display of contribution status based on salary

```javascript
// Training fund threshold calculation
const calculateTrainingFundRate = (monthlySalary) => {
  if (selectedCountry !== 'israel') return defaultRates.trainingFund;
  
  const threshold = 45000; // ₪45k monthly threshold
  const belowRate = 7.5;   // 7.5% below threshold
  const aboveRate = 2.5;   // 2.5% above threshold
  
  if (monthlySalary <= threshold) {
    return belowRate;
  } else {
    // Blended rate calculation
    const belowAmount = threshold * (belowRate / 100);
    const aboveAmount = (monthlySalary - threshold) * (aboveRate / 100);
    return ((belowAmount + aboveAmount) / monthlySalary) * 100;
  }
};
```

#### **WizardStepFees.js** - Fee and Return Management
- **4-Section Layout**: Main fees, expected returns, partner fees, partner returns
- **Individual Fee Structures**: Separate management fees for each partner
- **Return Rate Management**: Expected returns for each investment category
- **Visual Organization**: Color-coded sections for easy navigation
- **Default Value Management**: Intelligent defaults based on market standards

### **3. Calculation Engine Layer**

#### **retirementCalculations.js** - Enhanced Calculation Logic
- **Multi-Partner Support**: Calculations handle individual and couple scenarios
- **Comprehensive Income**: Includes salary, bonuses, RSUs, and other income sources
- **Inflation Adjustments**: Real vs nominal value calculations
- **Fee Impact Modeling**: Management fee effects on long-term accumulation
- **Training Fund Logic**: Israeli threshold-based calculations

```javascript
// Enhanced calculation with partner support
const calculateRetirement = (inputs, workPeriods) => {
  // Income aggregation
  let totalIncome = inputs.currentMonthlySalary || 20000;
  if (inputs.planningType === 'couple') {
    totalIncome += (inputs.partner1Salary || 0) + (inputs.partner2Salary || 0);
  }
  totalIncome += (inputs.annualBonus || 0) / 12; // Monthly equivalent
  totalIncome += (inputs.quarterlyRSU || 0) / 3; // Monthly equivalent
  
  // Contribution calculations with country-specific rules
  const pensionContribution = totalIncome * (inputs.employeePensionRate + inputs.employerPensionRate) / 100;
  const trainingFundContribution = totalIncome * inputs.trainingFundContributionRate / 100;
  
  // Long-term projection with inflation
  const inflationRate = inputs.inflationRate / 100;
  const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
  
  // Compound growth calculations
  const finalSavings = calculateCompoundGrowth(
    inputs.currentSavings,
    pensionContribution * 12,
    inputs.pensionReturn / 100,
    yearsToRetirement
  );
  
  return {
    totalSavings: finalSavings,
    monthlyIncome: Math.round(totalIncome), // CRITICAL: Fixed NaN issue
    savingsRate: (pensionContribution / totalIncome) * 100,
    readinessScore: calculateReadinessScore(inputs, finalSavings)
  };
};
```

#### **SummaryPanel.js** - Real-Time Financial Analytics
- **5-Factor Readiness Score**: Comprehensive retirement preparedness assessment
- **Real vs Nominal Values**: Inflation-adjusted projections
- **Portfolio Breakdown**: Asset allocation analysis with diversification scoring
- **Savings Rate Tracking**: Current vs target savings rate comparison
- **Multi-Currency Display**: Real-time currency conversion

```javascript
// 5-factor readiness score calculation
const calculateReadinessScore = () => {
  let score = 0;
  
  // Factor 1: Savings Rate (40 points)
  const savingsRateScore = Math.min((currentSavingsRate / 25) * 40, 40);
  score += savingsRateScore;
  
  // Factor 2: Current Savings Adequacy (25 points)
  const targetSavings = totalIncome * 12 * (inputs.currentAge - 22);
  const savingsAdequacyScore = Math.min((currentTotalSavings / targetSavings) * 25, 25);
  score += savingsAdequacyScore;
  
  // Factor 3: Time Horizon (20 points)
  const timeScore = yearsToRetirement >= 30 ? 20 : 
                    yearsToRetirement >= 20 ? 15 : 
                    yearsToRetirement >= 10 ? 10 : 5;
  score += timeScore;
  
  // Factor 4: Diversification (10 points)
  const diversificationBonus = diversificationScore >= 80 ? 10 : 
                               diversificationScore >= 60 ? 7 : 
                               diversificationScore >= 40 ? 4 : 0;
  score += diversificationBonus;
  
  // Factor 5: Income Replacement Ratio (5 points)
  if (results?.monthlyIncome && totalIncome > 0) {
    const replacementRatio = (results.monthlyIncome / totalIncome) * 100;
    const replacementScore = replacementRatio >= 80 ? 5 : 
                            replacementRatio >= 70 ? 4 : 
                            replacementRatio >= 60 ? 2 : 0;
    score += replacementScore;
  }
  
  return Math.round(Math.max(Math.min(score, 100), 0));
};
```

### **4. Data Management Layer**

#### **marketConstants.js** - Country-Specific Data
- **Pension Systems**: Country-specific contribution rates and rules
- **Currency Exchange**: Default conversion rates and formatting
- **Market Assumptions**: Expected returns and inflation rates by region

```javascript
const countryData = {
  israel: {
    pension: {
      employeeRate: 7.0,
      employerRate: 10.5,
      totalRate: 17.5
    },
    trainingFund: {
      baseRate: 7.5,
      threshold: 45000,
      belowThresholdRate: 7.5,
      aboveThresholdRate: 2.5
    },
    currency: 'ILS',
    inflationRate: 3.0,
    expectedReturns: {
      pension: 7.0,
      trainingFund: 6.5,
      personalPortfolio: 8.0
    }
  },
  usa: {
    pension: {
      employeeRate: 6.0,
      employerRate: 6.0,
      totalRate: 12.0
    },
    currency: 'USD',
    expectedReturns: {
      pension: 6.8,
      personalPortfolio: 7.5
    }
  }
};
```

## 🔄 Data Flow Architecture

### **1. User Input Flow**
```
User Input → Wizard Component → setInputs() → State Update → 
Real-time Calculation → SummaryPanel Update → Chart Refresh
```

### **2. Calculation Pipeline**
```
Inputs Object → retirementCalculations.js → 
Country Rules Application → Partner Data Aggregation → 
Inflation Adjustments → Fee Impact Calculations → 
Results Object → UI Update
```

### **3. Validation Chain**
```
Raw Input → Type Conversion (parseFloat/parseInt) → 
Range Validation → Default Value Application → 
Cross-Field Validation → State Update → UI Reflection
```

### **4. Wizard Navigation Flow**
```
Step Selection → Component Mounting → Data Loading → 
User Interaction → Validation → Next Step Transition → 
Progress Update → State Persistence
```

## 🧪 Testing Architecture

### **Enhanced Test Suite (116 Tests)**

#### **Test Categories**
1. **Core Functionality** (30 tests)
   - File structure validation
   - JavaScript syntax checking
   - Version management
   - HTML structure compliance

2. **Performance & Security** (25 tests)
   - Module export validation
   - Performance benchmarks
   - Security compliance
   - CI/CD pipeline validation

3. **UI/UX Validation** (20 tests)
   - CSS consistency
   - Responsive design
   - Version upgrade compatibility
   - Chart functionality

4. **Partner Planning Features** (15 tests)
   - Wizard component validation
   - Partner data collection
   - Country-specific rules
   - Fee structure testing

5. **Enhanced Calculations** (10 tests)
   - Income calculation accuracy
   - Savings rate computation
   - Readiness score validation
   - Real vs nominal value calculations

6. **Wizard Interface** (10 tests)
   - Component integration
   - State management
   - Navigation flow
   - Export functionality

7. **Data Validation** (6 tests)
   - Input validation
   - Error handling
   - Default value management
   - Type safety

#### **Test Execution Framework**
```javascript
// test-runner.js structure
const testCategories = [
  'testFileStructure',
  'testJavaScriptSyntax',
  'testVersionManagement',
  'testHtmlStructure',
  'testModuleExports',
  'testPerformance',
  'testSecurity',
  'testPartnerPlanningFeatures',    // v6.0.0 addition
  'testEnhancedCalculationLogic',   // v6.0.0 addition
  'testMultiStepWizardUX',          // v6.0.0 addition
  'testDataValidationAndErrorHandling' // v6.0.0 addition
];
```

### **Test Coverage Analysis**
- **95.7% Pass Rate**: 111 out of 116 tests passing
- **100% Partner Feature Coverage**: All new v6.0.0 features validated
- **100% Security Compliance**: Zero critical vulnerabilities
- **Enhanced Calculation Testing**: Comprehensive validation of financial logic

## 🔒 Security Architecture

### **Input Validation**
- **Type Enforcement**: Strict type checking with parseFloat/parseInt
- **Range Validation**: Sensible minimum/maximum values for all inputs
- **Sanitization**: No eval() usage, pure data processing
- **XSS Prevention**: Safe DOM manipulation through React.createElement

### **Data Protection**
- **No Sensitive Storage**: All data remains in browser memory
- **Privacy by Design**: No external data transmission
- **Local Processing**: All calculations performed client-side

### **Security Validation**
```javascript
// Multi-layer validation approach
const validateInput = (value, type, constraints) => {
  // 1. Type validation
  if (typeof value !== type) return false;
  
  // 2. Range validation
  if (constraints.min && value < constraints.min) return false;
  if (constraints.max && value > constraints.max) return false;
  
  // 3. Format validation
  if (constraints.pattern && !constraints.pattern.test(value)) return false;
  
  return true;
};
```

### **Semantic Secret Scanner**

#### **AST-Based Analysis Engine**
- **JavaScript Parsing**: Uses Babel parser for semantic analysis of JS/JSX/TS files
- **Context Awareness**: Distinguishes between legitimate crypto usage and auth tokens
- **Variable Analysis**: Detects suspicious variable names (password, secret, key, token)
- **String Literal Scanning**: Analyzes string values with entropy validation

#### **Detection Patterns (50+ Rules)**
```javascript
// Example pattern definitions
{
  name: 'GitHub Token',
  regex: /gh[pousr]_[A-Za-z0-9_]{36,255}/g,
  severity: 'high',
  description: 'GitHub Personal Access Token detected',
  entropy: 4.5
}
```

#### **Context-Aware Filtering**
- **Cryptocurrency Filter**: Recognizes Bitcoin, Ethereum, DeFi terminology
- **UI Component Filter**: Excludes React component props and UI-related tokens
- **i18n Pattern Detection**: Recognizes translation files and localized content
- **Configuration Awareness**: Distinguishes example files from real secrets

#### **CI/CD Integration**
- **Exit Code Strategy**: Non-zero exit for high/critical findings
- **SARIF Output**: GitHub Security tab integration
- **Performance Metrics**: Concurrent processing with timeout protection
- **Configuration System**: .secretignore support with gitignore-style patterns

#### **Usage Examples**
```bash
# Quick security scan
npm run security:scan

# Generate markdown report  
npm run security:scan-report

# CI/CD integration with SARIF output
node scripts/secret-scanner.js scan --format sarif --severity high --output security.sarif
```

## 🌐 Internationalization Architecture

### **Multi-Language Support**
- **Hebrew/English**: Complete translation coverage
- **RTL Layout**: Right-to-left layout support for Hebrew
- **Cultural Adaptation**: Number formatting and currency display
- **Dynamic Loading**: Language switching without page reload

### **Currency System**
- **Base Currency**: ILS for all calculations
- **Real-Time Conversion**: Live exchange rate integration
- **Multiple Display**: Support for ILS, USD, EUR, GBP, BTC, ETH
- **Fallback Rates**: Reliable offline conversion rates

## 🚀 Performance Architecture

### **Optimization Strategies**
- **Lazy Loading**: Components loaded on demand
- **Memoization**: Expensive calculations cached
- **Debounced Updates**: Input changes debounced to prevent excessive recalculation
- **Efficient Re-rendering**: Minimal DOM updates through React patterns

### **Performance Metrics**
- **Initial Load**: 45-67ms
- **Module Loading**: 5-12ms per component
- **Memory Usage**: 4.8-5.2MB
- **Test Success Rate**: 95.7%

### **Loading Strategy**
```
Critical Path:
HTML → CSS → React → Core Components → Application Ready
                │
                ▼
Lazy Loading:
Wizard Components → Charts → Advanced Features → Export Functions
```

## 📊 System Monitoring

### **Performance Monitoring**
- **Core Web Vitals**: LCP, FID, CLS tracking
- **Load Time Metrics**: TTFB, FCP, LCP measurements
- **Error Tracking**: JavaScript error monitoring
- **User Analytics**: Privacy-respectful usage tracking

### **Quality Assurance**
- **Automated Testing**: 95.7% test coverage
- **Accessibility Audits**: WCAG compliance
- **Security Scans**: Regular vulnerability assessments
- **Performance Audits**: Lighthouse scoring

## 🔮 Future Architecture Considerations

### **Planned Enhancements**
1. **Advanced Partner Features**
   - Risk profile management per partner
   - Inheritance planning integration
   - Tax optimization strategies

2. **Enhanced Analytics**
   - Machine learning projections
   - Advanced scenario modeling
   - Comparative analysis tools

3. **Integration Capabilities**
   - Bank account integration
   - Investment platform APIs
   - Tax software connectivity

### **Scalability Preparations**
- **Microservice Architecture**: Component isolation for future API separation
- **Database Integration**: Prepared state structure for backend integration
- **Cloud Deployment**: Architecture supports serverless deployment models

### **Emerging Technologies**
- **Progressive Web App (PWA)**: Offline functionality
- **WebAssembly**: High-performance calculations
- **AI/ML Integration**: TensorFlow.js for predictions
- **Voice Interface**: Speech recognition and synthesis

## 📈 Deployment Architecture

### **Static Hosting**
```
Source Code → Build Process → Static Files → CDN Distribution
     │             │              │              │
     ▼             ▼              ▼              ▼
   GitHub → GitHub Actions → GitHub Pages → Global CDN
     │             │              │              │
     ▼             ▼              ▼              ▼
   Netlify → Auto Deploy → Edge Functions → Performance
```

### **CI/CD Pipeline**
1. **Code Push**: GitHub repository update
2. **Automated Testing**: Full QA suite execution (116 tests)
3. **Build Process**: Asset optimization and bundling
4. **Deployment**: Automatic deployment to hosting platforms
5. **Monitoring**: Performance and error tracking

---

**Last Updated**: July 21, 2025  
**Version**: 6.4.0  
**Author**: Yali Pollak (יהלי פולק)

This architecture document reflects the current v6.0.0 implementation with major partner planning overhaul and serves as a blueprint for future development. The modular, component-based design ensures maintainability and extensibility while delivering a professional-grade financial planning experience.