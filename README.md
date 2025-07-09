# 📊 Advanced Retirement Planner

Professional retirement planning tool with comprehensive investment tracking, FIRE calculator, and modular architecture.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-2.4.1-green.svg)
![Language](https://img.shields.io/badge/language-English%20%7C%20Hebrew-orange.svg)

## 🚀 Features

### Core Retirement Planning
- **Multi-country pension calculations** with country-specific tax rates
- **Training fund tracking** with management fees and net return calculations
- **Salary and income tracking** with main input section and growth projections
- **Family planning costs** with comprehensive child expense calculations and education funds
- **Risk scenario modeling** (Very Conservative to Very Aggressive)
- **Inflation-adjusted projections** with real purchasing power
- **Work period management** across different countries with dynamic period addition/removal

### Advanced Investment Tracking
- **Personal Investment Portfolio** (non-tax-advantaged)
- **Cryptocurrency Portfolio** with high volatility modeling
- **Real Estate Investments** with rental income and appreciation
- **Tax calculations** for capital gains on all investment types
- **Risk-adjusted returns** across all asset classes

### FIRE Calculator
- **Financial Independence Retire Early** calculations
- **4% safe withdrawal rule** implementation
- **Target age planning** with progress tracking
- **Total portfolio analysis** including all investment types

### Emergency Planning & Recommendations
- **Emergency Fund Calculator** with 3-12 month coverage targets
- **General Recommendations Engine** with age-based financial advice
- **Debt-to-Income Analysis** with personalized thresholds
- **Savings Rate Optimization** with smart target recommendations
- **Risk Tolerance Assessment** aligned with age and goals

### Visualization & Analysis
- **Interactive charts** with 7+ data series tracking
- **Historical index returns** from multiple markets
- **Real-time API integration** for market data with CORS proxy solutions
- **Multiple fallback data sources** (Alpha Vantage, Finnhub, IEX Cloud, FMP)
- **Serverless function support** for reliable data fetching
- **Comprehensive progress tracking** over time

### Internationalization
- **Full bilingual support** (Hebrew/English)
- **RTL/LTR layout** adaptation
- **Currency formatting** with proper localization

## 📁 Project Structure

This project offers **two versions** plus comprehensive solutions for API integration:

### 🔧 **API Integration Solutions**
- `cors-proxy-solution.js` - CORS proxy with multiple fallback services
- `yahoo-finance-cors-fix.js` - Drop-in replacement for Yahoo Finance API calls
- `serverless-solutions/` - Netlify & Vercel serverless function implementations
- `alternative-apis/` - Multi-provider finance APIs (Alpha Vantage, Finnhub, IEX, FMP)
- `IMPLEMENTATION_GUIDE.md` - Complete setup instructions for all solutions

### 1. Single File Version (`index.html`)
- ✅ **Immediate deployment** - works instantly on GitHub Pages
- ✅ **No build process** required
- ✅ **Fast loading** - everything in one file
- ✅ **Zero configuration** needed

### 2. Modular Version (`index-modular.html` + `src/`)
- ✅ **Better maintainability** - organized codebase
- ✅ **Code reusability** - shared components
- ✅ **Easier debugging** - isolated modules
- ✅ **Team collaboration** friendly

```
src/
├── components/
│   ├── RetirementBasicForm.js      # Basic form inputs
│   ├── RetirementAdvancedForm.js   # Advanced settings
│   ├── RetirementResultsPanel.js   # Results display
│   ├── StressTestingPanel.js       # Stress testing
│   ├── FinancialChart.js           # Chart visualization
│   └── RetirementPlannerApp.js     # Main app component
├── utils/
│   ├── retirementCalculations.js   # Core financial calculations
│   ├── chartDataGenerator.js       # Chart data generation
│   ├── stressTestLogic.js          # Stress test calculations
│   └── analyticsTracker.js         # Analytics tracking
├── translations/
│   └── multiLanguage.js            # Bilingual text resources
└── data/
    └── marketConstants.js          # Market data & configuration
```

## 🛠️ Development Setup

### Option 1: Docker Development (Recommended)
```bash
# Clone the repository
git clone https://github.com/ypollak2/advanced-retirement-planner.git
cd advanced-retirement-planner

# Start with Docker Compose
npm run docker:dev

# Access at http://localhost:3000
```

### Option 2: Direct Usage (Quick start)
1. Clone the repository
2. Open `index.html` in your browser (now uses modular architecture)
3. Start planning your retirement!

**Note**: The main `index.html` now uses the modular architecture. For the legacy version, use `index-legacy.html`.

### Option 3: Modular Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Docker Commands
```bash
# Build Docker image
npm run docker:build

# Run development environment
npm run docker:dev

# Run production environment
npm run docker:prod
```

### Option 2: Upload to GitHub & GitHub Pages

#### Step 1: Create Repository
```bash
# Create new directory
mkdir advanced-retirement-planner
cd advanced-retirement-planner

# Initialize Git project
git init

# Add files (after downloading them)
git add .
git commit -m "Initial commit: Advanced Retirement Planner"

# Connect to GitHub (replace USER_NAME and REPO_NAME)
git remote add origin https://github.com/USER_NAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

#### Step 2: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Select **Deploy from a branch**
4. Choose **main** branch and **/ (root)**
5. Save and wait a few minutes

🎉 **Your site will be available at:**
```
https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME
```

## 📁 Easy Upload Methods

### 🌐 **GitHub Web Interface** (Easiest!)
1. Create new repository on GitHub
2. Click "uploading an existing file"
3. Drag files from your downloads folder
4. GitHub will auto-detect it's a website and enable Pages

### 🖥️ **GitHub Desktop** (User-friendly)
1. Download GitHub Desktop app
2. Create new repository
3. Copy files to repository folder
4. Commit & Push

### ⌨️ **Command Line** (For developers)
```bash
git clone https://github.com/USERNAME/REPO.git
# Copy files to directory
git add .
git commit -m "Initial commit"
git push
```

## 🛠️ Project Structure

```
advanced-retirement-planner/
│
├── index.html          # Main file - complete application
├── README.md           # This file
├── package.json        # Project metadata (optional)
├── LICENSE             # MIT license
└── .gitignore          # Git ignore rules
```

## 💡 Recommended Website URLs

### Professional:
- `advanced-retirement-planner`
- `smart-pension-calculator`
- `retirement-planning-pro`
- `pension-calculator-tool`

### Descriptive:
- `retirement-savings-planner`
- `pension-planning-calculator`
- `financial-retirement-tool`
- `retirement-income-planner`

## 📱 Using the Tool

### 1. Basic Data
- Enter current age and retirement age
- Add existing savings and inflation rate
- Set salary replacement targets

### 2. Salary & Income
- Input current monthly salary
- Set expected annual salary growth rate
- View projected salary at retirement

### 3. Family Planning (Optional)
- Enable family planning calculations
- Set number of planned children
- Configure birth years for each child
- Define monthly cost per child
- Set years of financial support
- Plan education fund per child
- View comprehensive family cost summary

### 5. Work Periods
- Add different work periods
- Select countries and salaries
- Configure returns and management fees

### 6. Index Analysis
- View historical returns
- Use data for auto-filling
- Compare different indices

### 7. Scenarios & Stress Testing
- Test impact of risk levels
- Run comprehensive stress tests (2008 Crisis, COVID-19, High Inflation)
- Analyze goals and adjustments
- View long-term projections with crisis timeline visualization

## ⚙️ Technical Customizations

### Changing Colors and Styling
The tool uses Tailwind CSS. You can edit the HTML file and modify:
```html
<!-- Example: Change main background color -->
<div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
```

### Adding New Indices
Edit the `historicalReturns` object in JavaScript:
```javascript
const historicalReturns = {
  20: {
    'S&P 500': 10.2,
    'Your New Index': 8.5, // Add here
    // ...
  }
};
```

### Adding Countries
Edit the `countryData` object:
```javascript
const countryData = {
  newCountry: {
    name: 'Country Name',
    pensionTax: 0.15,
    socialSecurity: 2000,
    flag: '🏳️'
  }
};
```

## 📊 Data Sources & Methodology

### Index Returns
- **S&P 500**: Historical averages across different time periods
- **Tel Aviv 35**: Israeli main stock index
- **Government Bonds**: Safe government bonds
- **Current Data**: July 2025

### Exchange Rates
```javascript
const exchangeRates = {
  USD: 3.37, // Update according to current rate
  GBP: 4.60,
  EUR: 3.60
};
```

## 🔒 Security & Privacy

- **No Data Storage**: All calculations performed on your computer
- **Completely Offline**: Works without internet after loading
- **No Tracking**: No analytics or data collection

## 🐛 Common Issues & Solutions

### Tool Won't Load
- Ensure browser supports modern JavaScript
- Try different browser (Chrome, Firefox, Safari)
- Check ad blocker isn't blocking libraries

### Chart Not Displaying
- Refresh the page
- Ensure at least one valid work period exists
- Check retirement age is greater than current age

### Unrealistic Results
- Verify all fields filled with reasonable values
- Ensure returns are in 0-50% range
- Confirm work periods don't overlap

### CORS/API Issues
- **Financial data not loading**: The tool includes multiple fallback solutions
- **"Access blocked by CORS policy"**: Automatic proxy services handle this
- **Data appears stale**: Check the data source indicator and refresh
- **For developers**: See `IMPLEMENTATION_GUIDE.md` for deployment options

## 🤝 Contributing to the Project

Want to contribute? Great!

### How to Contribute:
1. Fork the project
2. Create new branch: `git checkout -b feature/amazing-feature`
3. Make changes and commit: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Contribution Ideas:
- 🌍 Support for additional countries
- 📊 New investment indices
- 🎨 UI/UX improvements
- 🔧 Performance optimizations
- 📱 Mobile responsiveness improvements
- 🌐 Additional language translations

## ✅ Recently Completed Features

### Latest Additions (Version 2.3.0)
- ✅ **Salary Space in Main Input** - Dedicated salary section with current monthly salary and growth projections
- ✅ **Family Planning Cost Calculator** - Comprehensive family expense planning with:
  - Number of children planning
  - Monthly cost per child calculations  
  - Birth year scheduling for multiple children
  - Years of financial support per child
  - Education fund planning per child
  - Complete family cost summary and projections
- ✅ **CORS Solutions for Yahoo Finance API** - Multiple robust solutions:
  - CORS proxy services with automatic fallback
  - Serverless function implementations (Netlify, Vercel)
  - Alternative API providers (Alpha Vantage, Finnhub, IEX Cloud, FMP)
  - Comprehensive error handling and data caching
- ✅ **Chart.js Error Fixes** - Resolved "crisisTimeline" controller registration issues
- ✅ **Stress Test Button Crash Fix** - Fixed missing try-catch blocks causing website crashes
- ✅ **Enhanced Financial Data Integration** - Real-time market data with multiple fallback sources

### Previous Additions (Version 2.2.3)
- ✅ **Comprehensive Security Framework** - Complete security policy with vulnerability reporting
- ✅ **GitHub Wiki Documentation** - Detailed guides for all features and usage
- ✅ **Automated Security Scanning** - Continuous vulnerability detection and updates
- ✅ **Enhanced Privacy Protection** - Advanced data protection and user privacy controls
- ✅ **Security Best Practices** - Industry-standard security implementations

### Previous Additions (Version 2.2.2)
- ✅ **Crisis Timeline Visualization** - Time-series graph showing crisis impact over retirement years
- ✅ **Enhanced Crisis Analysis** - Visual representation of crisis years vs recovery periods
- ✅ **Comprehensive Investment Tracking** - Timeline includes all investment types (pension, training fund, personal, crypto, real estate)
- ✅ **Fixed Version Display** - Corrected version tracking throughout the application

### Previous Additions (Version 2.2.1)
- ✅ **Dynamic Crisis Explanations** - Stress test explanations now adapt to actual scenario parameters
- ✅ **Enhanced Educational Content** - Crisis severity classification and duration descriptions
- ✅ **Real-time Parameter Display** - Shows exact percentages and timeframes for each scenario
- ✅ **Improved Stress Test Graph** - Dedicated comparison chart for Normal vs Crisis scenarios

### Previous Additions (Version 2.2.0)
- ✅ **Enhanced AI-Powered Stress Testing** - Natural language scenario input with intelligent parameter extraction
- ✅ **Refined User Interface** - Improved tabs design with artistic symbols instead of emojis
- ✅ **Advanced Natural Language Processing** - AI interprets user-described economic scenarios and converts to stress test parameters
- ✅ **Comprehensive Analytics Tracking** - Anonymous usage statistics and conclusion tracking across versions
- ✅ **Professional Design Updates** - Cleaner tab layout with better spacing and visual hierarchy

### Previous Additions (Version 2.1.0)
- ✅ **Emergency fund/safety cushion calculator** - Calculate recommended emergency savings with 3-12 month coverage targets
- ✅ **General recommendations based on overall situation** - Personalized advice engine with age-based logic, debt analysis, and savings rate optimization
- ✅ **Dynamic API integration for real-time financial data** - Google Finance and Yahoo Finance integration with comprehensive fallbacks
- ✅ **Comprehensive testing framework** - Regression tests for all major functionality
- ✅ **Enhanced UI/UX with refined header design** - Professional, minimalist interface

## 🚀 Future Feature Roadmap

### Core Financial Planning Features
- 👨‍👩‍👧‍👦 **Multi-generational wealth planning** - Family wealth transfer strategies
- 🌍 **Social security rights in different countries** - International pension benefits
- 🏥 **Healthcare cost projections and insurance planning** - Medical expense forecasting
- 🛡️ **Disability insurance and income protection analysis** - Risk mitigation planning

### Advanced Investment & Tax Features
- 💰 **Tax optimization strategies for different investment types** - Minimize tax burden
- 🎲 **Monte Carlo simulations for retirement outcome probabilities** - Statistical modeling
- 📜 **Estate planning and inheritance considerations** - Wealth transfer planning
- 🏠 **Debt management and mortgage optimization** - Debt vs investment strategies

### Lifestyle & Career Planning
- ✈️ **International retirement planning (visa, residency requirements)** - Global retirement
- 🏢 **Business ownership and entrepreneurship retirement planning** - Self-employed strategies
- 📊 **Lifestyle inflation modeling and expense projections** - Future cost analysis

### International & Transfer Features
- 🌐 **Pension transfer analysis for international workers** - Cross-border pension rights
- 🌱 **Climate change impact on investment portfolios** - Sustainable investing
- 🌿 **ESG (Environmental, Social, Governance) investment options** - Ethical investing

### User Experience & Analysis
- 🎯 **Retirement goal tracking with milestone celebrations** - Progress gamification
- ⚠️ **Stress testing for economic downturns and market crashes** - Scenario planning

## 📞 Support & Contact

- **Issues**: Open issue on GitHub for bug reports
- **Feature Requests**: Suggest new features via Issues
- **Questions**: Use Discussions section

## ⚖️ License

Released under MIT License - see [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This tool is for educational and initial planning purposes only. **It does not constitute professional financial advice.**

For accurate information and personalized advice, consult with:
- Licensed pension advisor
- Certified Public Accountant (CPA)
- Investment portfolio manager

---

## 🌟 Acknowledgments

Built with ❤️ using:
- [React](https://reactjs.org/) - User interface
- [Recharts](https://recharts.org/) - Charts and graphs
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide React](https://lucide.dev/) - Icons

---

## 🚀 Quick Deploy Commands

### GitHub Pages Deployment
```bash
# After uploading to GitHub
# Pages will automatically deploy from main branch
# Your site: https://username.github.io/repository-name
```

### Local Development
```bash
# Serve locally (requires Node.js)
npx serve .
# or
npx live-server --port=3000
```

---

**📈 Advanced Retirement Planner - Start planning your future today!**

---

### 🎯 Perfect for:
- **Financial Advisors** - Professional client presentations
- **Individuals** - Personal retirement planning
- **Educators** - Teaching financial planning concepts
- **Developers** - Learning React and financial calculations

### 🔧 Technical Stack:
- **Frontend**: React 18, Tailwind CSS
- **Charts**: Recharts library
- **Icons**: Lucide React
- **Deployment**: Static HTML (GitHub Pages ready)
- **No Backend Required**: Runs entirely in browser
