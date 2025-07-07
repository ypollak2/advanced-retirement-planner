# 📊 Advanced Retirement Planner

Professional retirement planning tool with comprehensive investment tracking, FIRE calculator, and modular architecture.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Language](https://img.shields.io/badge/language-English%20%7C%20Hebrew-orange.svg)

## 🚀 Features

### Core Retirement Planning
- **Multi-country pension calculations** with country-specific tax rates
- **Training fund tracking** with management fees
- **Risk scenario modeling** (Very Conservative to Very Aggressive)
- **Inflation-adjusted projections** with real purchasing power
- **Work period management** across different countries

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

### Visualization & Analysis
- **Interactive charts** with 7+ data series tracking
- **Historical index returns** from multiple markets
- **Real-time API integration** for market data
- **Comprehensive progress tracking** over time

### Internationalization
- **Full bilingual support** (Hebrew/English)
- **RTL/LTR layout** adaptation
- **Currency formatting** with proper localization

## 📁 Project Structure

This project offers **two versions**:

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
│   └── Chart.js              # Chart visualization component
├── utils/
│   ├── calculations.js       # Core financial calculations
│   └── chartData.js         # Chart data generation
├── translations/
│   └── index.js             # Bilingual text resources
└── data/
    └── constants.js         # Market data & configuration
```

## 🛠️ Development Setup

### Option 1: Direct Usage (Recommended for quick start)
1. Clone the repository
2. Open `index.html` in your browser
3. Start planning your retirement!

### Option 2: Modular Development
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

### 2. Work Periods
- Add different work periods
- Select countries and salaries
- Configure returns and management fees

### 3. Index Analysis
- View historical returns
- Use data for auto-filling
- Compare different indices

### 4. Scenarios
- Test impact of risk levels
- Analyze goals and adjustments
- View long-term projections

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
