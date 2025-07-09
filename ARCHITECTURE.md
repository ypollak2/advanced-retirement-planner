# Advanced Retirement Planner - Architecture & Software Design

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Patterns](#architecture-patterns)
3. [File Structure](#file-structure)
4. [Component Design](#component-design)
5. [Data Flow](#data-flow)
6. [API Integration](#api-integration)
7. [Development Environment](#development-environment)
8. [Deployment](#deployment)
9. [Security Considerations](#security-considerations)
10. [Future Enhancements](#future-enhancements)

## System Overview

The Advanced Retirement Planner is a **client-side React application** that provides comprehensive retirement planning tools with multi-language support (Hebrew/English). The system now uses a **modular architecture** with ES6 modules, making it more maintainable and solving file size limitations. The system calculates pension projections, investment returns, and stress testing scenarios without requiring server-side processing.

### Key Features
- **Multi-investment tracking**: Pension, training funds, personal portfolio, crypto, real estate
- **FIRE calculator**: Financial Independence Retire Early calculations
- **Stress testing**: Economic crisis scenario modeling
- **Real-time data**: Live market data integration with CORS proxy solutions
- **Bilingual support**: Hebrew (RTL) and English (LTR) interfaces
- **Modular architecture**: Component-based design for maintainability

## Architecture Patterns

### 1. Component-Based Architecture
```
┌─────────────────────────────────────────┐
│             index.html                   │
│  ┌─────────────────────────────────────┐ │
│  │        RetirementPlanner            │ │
│  │  ┌─────────────────────────────────┐ │ │
│  │  │        BasicInputs              │ │ │
│  │  │        AdvancedInputs           │ │ │
│  │  │        Results                  │ │ │
│  │  │        StressTest               │ │ │
│  │  │        Chart                    │ │ │
│  │  └─────────────────────────────────┘ │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### 2. State Management Pattern
- **React Hooks**: `useState`, `useEffect` for component state
- **Props passing**: Parent-to-child component communication
- **Event callbacks**: Child-to-parent communication
- **Local storage**: Persistence for user preferences and analytics

### 3. Data Processing Pattern
```
User Input → Validation → Calculation → Results → Visualization
     ↓           ↓            ↓          ↓           ↓
 BasicInputs → calculations.js → Results → Chart.js → Display
```

## File Structure

```
advanced-retirement-planner/
├── index.html                    # Main entry point (stable monolithic version)
├── index-modular-broken.html     # Modular version (ES6 import issues on GitHub Pages)
├── package.json                 # Dependencies and scripts
├── vite.config.js              # Build configuration
├── Dockerfile                  # Docker configuration
├── docker-compose.yml          # Docker compose setup
├── src/
│   ├── components/
│   │   ├── RetirementBasicForm.js      # Basic form inputs ✅
│   │   ├── RetirementAdvancedForm.js   # Advanced settings ✅
│   │   ├── RetirementResultsPanel.js   # Results display ✅
│   │   ├── StressTestingPanel.js       # Stress testing
│   │   ├── FinancialChart.js           # Chart visualization ✅
│   │   └── RetirementPlannerApp.js     # Main app component ✅
│   ├── utils/
│   │   ├── retirementCalculations.js  # Core calculations ✅
│   │   ├── chartDataGenerator.js      # Chart data processing ✅
│   │   ├── stressTestLogic.js         # Stress test logic
│   │   └── analyticsTracker.js        # Analytics tracking
│   ├── data/
│   │   └── marketConstants.js         # Constants and configs ✅
│   └── translations/
│       └── multiLanguage.js           # Multi-language support ✅
├── cors-proxy-solution.js      # CORS proxy for APIs
├── yahoo-finance-cors-fix.js   # Yahoo Finance integration
├── alternative-apis/           # Alternative API providers
├── serverless-solutions/       # Serverless functions
└── docs/
    ├── ARCHITECTURE.md         # This file
    ├── API_DOCUMENTATION.md    # API documentation
    └── DEPLOYMENT_GUIDE.md     # Deployment instructions
```

## Component Design

### 1. RetirementBasicForm Component
**Purpose**: Handle user input for basic retirement planning data

**Props**:
- `inputs`: Current form values
- `setInputs`: State setter function
- `language`: Current language ('he'/'en')
- `showSalaryInput`: Boolean for salary section visibility
- `showFamilyPlanning`: Boolean for family planning section

**Sections**:
- Basic data (age, savings, inflation)
- Training fund configuration
- Salary and income projections
- Family planning costs
- Personal portfolio settings

### 2. RetirementAdvancedForm Component
**Purpose**: Advanced investment and allocation settings

**Props**:
- `inputs`, `setInputs`: Main state management
- `language`, `t`: Internationalization support
- `workPeriods`, `setWorkPeriods`: Work period configurations
- `addWorkPeriod`, `removeWorkPeriod`, `updateWorkPeriod`: Work period management
- `countryData`: Country selection data
- `formatCurrency`: Currency formatting function
- Icon components: `Settings`, `PiggyBank`, `DollarSign`, `TrendingUp`, `Building`, `Globe`, `Plus`, `Trash2`

**Sections**:
- Advanced retirement settings (expenses, age, savings, inflation, target replacement)
- Training fund configuration with net return calculations
- Salary and income projections
- Family planning with children costs and education funds
- Personal investment portfolio settings
- Cryptocurrency portfolio with risk warnings
- Real estate investment configuration
- Emergency fund planning and analysis
- Dynamic work periods management

### 3. RetirementResultsPanel Component
**Purpose**: Display calculated retirement projections

**Props**:
- `results`: Calculation results object
- `language`: Current language
- `formatCurrency`: Currency formatting function

**Display Sections**:
- Total accumulation summary
- Monthly income projections
- Investment breakdown
- Tax calculations
- Expense gap analysis
- AI insights and recommendations

### 4. StressTestingPanel Component
**Purpose**: Economic scenario stress testing

**Props**:
- `inputs`: Current inputs
- `results`: Base results
- `language`: Current language

**Features**:
- Predefined crisis scenarios
- Custom scenario creation
- Impact calculations
- Recommendations generation

### 5. FinancialChart Component
**Purpose**: Data visualization using Chart.js

**Props**:
- `data`: Chart data array
- `type`: Chart type ('line', 'bar', 'pie')
- `language`: Current language

**Chart Types**:
- Accumulation progress (line chart)
- Index returns (bar chart)
- Investment allocation (pie chart)

## Data Flow

### 1. Input Processing
```javascript
User Input → Validation → State Update → Calculation Trigger
```

### 2. Calculation Flow
```javascript
calculateRetirement(inputs, workPeriods, allocations) → {
  totalSavings,
  monthlyIncome,
  taxCalculations,
  investmentBreakdown
}
```

### 3. Chart Data Generation
```javascript
generateChartData(inputs, workPeriods) → {
  chartPoints: [
    { age, pensionSavings, trainingFund, totalSavings }
  ]
}
```

## API Integration

### 1. Yahoo Finance Integration
**File**: `yahoo-finance-cors-fix.js`
**Purpose**: Real-time market data retrieval
**CORS Solution**: Proxy service with fallback options

### 2. Alternative API Providers
**Directory**: `alternative-apis/`
**Providers**:
- Alpha Vantage
- Finnhub
- IEX Cloud
- Financial Modeling Prep

### 3. Serverless Functions
**Directory**: `serverless-solutions/`
**Platforms**:
- Netlify Functions
- Vercel Functions
- AWS Lambda ready

## Development Environment

### Local Development with Docker

#### Prerequisites
- Docker
- Docker Compose

#### Setup Commands
```bash
# Clone repository
git clone https://github.com/ypollak2/advanced-retirement-planner.git
cd advanced-retirement-planner

# Build and run with Docker
docker-compose up --build

# Access application
open http://localhost:3000
```

#### Docker Configuration
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

### Development Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run deploy   # Deploy to GitHub Pages
```

## Deployment

### GitHub Pages Deployment
**Primary deployment target**: GitHub Pages static hosting

**Build Process**:
1. Vite builds static files
2. GitHub Actions deploys to `gh-pages` branch
3. Automatic deployment on main branch push

**Configuration**:
```json
{
  "homepage": "https://ypollak2.github.io/advanced-retirement-planner",
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

### Alternative Deployment Options
- **Netlify**: Automatic deployments with serverless functions
- **Vercel**: Edge deployments with API routes
- **AWS S3**: Static website hosting with CloudFront

## Security Considerations

### 1. Data Privacy
- **No server-side storage**: All calculations client-side
- **Local storage only**: User preferences stored locally
- **No personal data transmission**: Privacy-first approach

### 2. API Security
- **CORS proxy**: Secure API access without exposing keys
- **Rate limiting**: Prevent API abuse
- **Error handling**: Graceful degradation on API failures

### 3. Input Validation
- **Number validation**: Prevent invalid calculations
- **Range checking**: Ensure reasonable input values
- **XSS prevention**: Sanitized user inputs

## Future Enhancements

### 1. Technical Improvements
- **TypeScript migration**: Type safety and better development experience
- **React 18 features**: Concurrent rendering and Suspense
- **PWA support**: Offline functionality and mobile app experience
- **WebAssembly**: Performance optimization for complex calculations

### 2. Feature Additions
- **Multi-currency support**: International retirement planning
- **Monte Carlo simulations**: Advanced probability modeling
- **Social Security integration**: Government benefit calculations
- **Tax optimization**: Advanced tax planning strategies

### 3. User Experience
- **Guided onboarding**: Interactive tutorial for new users
- **Report generation**: PDF export of retirement plans
- **Comparison tools**: Side-by-side scenario analysis
- **Mobile optimization**: Touch-friendly responsive design

---

## MCP Integration Notes

This architecture document serves as the foundation for:
- **Component extraction**: Systematic breakdown of monolithic code
- **API integration**: Structured approach to external data sources
- **Testing strategy**: Component-based testing methodology
- **Performance optimization**: Modular loading and code splitting
- **Maintenance planning**: Clear separation of concerns

**Usage for MCP Tasks**:
1. Reference this document for component structure
2. Use file organization patterns for new features
3. Follow data flow patterns for state management
4. Apply security guidelines for new integrations
5. Leverage Docker setup for consistent development environment

---

*Last updated: $(date)*
*Version: 2.4.3*
*Contributors: Advanced Retirement Planner Team*