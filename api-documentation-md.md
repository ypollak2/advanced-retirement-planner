# API Documentation

Technical documentation for the Advanced Retirement Planner's data structures, functions, and integration points.

## 📋 Table of Contents

- [Core Data Structures](#core-data-structures)
- [Calculation Functions](#calculation-functions)
- [Configuration Objects](#configuration-objects)
- [Integration Examples](#integration-examples)
- [Customization Guide](#customization-guide)
- [Error Handling](#error-handling)

---

## 🏗️ Core Data Structures

### InputsState
Main application state containing user inputs.

```typescript
interface InputsState {
  currentAge: number;                    // User's current age (18-100)
  retirementAge: number;                 // Planned retirement age (currentAge+1 to 100)
  currentSavings: number;                // Current pension savings amount
  inflationRate: number;                 // Annual inflation rate percentage (0-20)
  currentMonthlyExpenses: number;        // Current monthly expenses
  targetReplacement: number;             // Target salary replacement percentage (0-200)
  riskTolerance: RiskLevel;              // Investment risk level
  currentTrainingFund: number;           // Current training fund balance
  trainingFundReturn: number;            // Training fund annual return percentage
  trainingFundManagementFee: number;     // Training fund management fee percentage
}

type RiskLevel = 'veryConservative' | 'conservative' | 'moderate' | 'aggressive' | 'veryAggressive';
```

### WorkPeriod
Represents a work period in a specific country.

```typescript
interface WorkPeriod {
  id: number;                           // Unique identifier
  country: CountryCode;                 // Country code
  startAge: number;                     // Start age for this period
  endAge: number;                       // End age for this period
  monthlyContribution: number;          // Monthly pension contribution
  salary: number;                       // Monthly salary
  pensionReturn: number;                // Annual pension return percentage
  pensionDepositFee: number;            // Management fee on deposits percentage
  pensionAnnualFee: number;             // Annual management fee on assets percentage
  monthlyTrainingFund: number;          // Monthly training fund contribution
}

type CountryCode = 'israel' | 'usa' | 'uk' | 'germany' | 'france';
```

### IndexAllocation
Represents investment allocation across different indices.

```typescript
interface IndexAllocation {
  index: string;                        // Index name (e.g., 'S&P 500')
  percentage: number;                   // Allocation percentage (0-100)
  customReturn: number | null;          // Custom return override or null for historical
}
```

### RetirementResults
Calculated retirement projections and analysis.

```typescript
interface RetirementResults {
  // Core Projections
  totalSavings: number;                 // Total pension savings at retirement
  trainingFundValue: number;            // Total training fund value at retirement
  monthlyPension: number;               // Gross monthly pension income
  monthlyTrainingFundIncome: number;    // Monthly income from training fund
  
  // Tax Calculations
  pensionTax: number;                   // Monthly pension tax amount
  netPension: number;                   // Net monthly pension after tax
  netTrainingFundIncome: number;        // Net monthly training fund income
  socialSecurity: number;               // Monthly social security amount
  totalNetIncome: number;               // Total monthly net income
  
  // Analysis Data
  weightedTaxRate: number;              // Weighted average tax rate percentage
  inflationAdjustedIncome: number;      // Income in today's purchasing power
  futureMonthlyExpenses: number;        // Projected monthly expenses with inflation
  remainingAfterExpenses: number;       // Income remaining after expenses
  
  // Target Analysis
  targetMonthlyIncome: number;          // Target monthly income based on replacement ratio
  achievesTarget: boolean;              // Whether projections meet target
  targetGap: number;                    // Gap between target and projected income
  
  // Risk and Returns
  riskLevel: RiskLevel;                 // Applied risk level
  riskMultiplier: number;               // Risk adjustment multiplier
  pensionWeightedReturn: number;        // Weighted pension return rate
  trainingFundWeightedReturn: number;   // Weighted training fund return rate
  trainingFundNetReturn: number;        // Net training fund return after fees
  
  // Period Analysis
  periodResults: PeriodResult[];        // Detailed results by work period
  lastCountry: CountryData;             // Last country worked in
}
```

### PeriodResult
Detailed analysis for each work period.

```typescript
interface PeriodResult {
  country: CountryCode;                 // Country code
  countryName: string;                  // Country display name
  flag: string;                         // Country flag emoji
  years: number;                        // Number of years in this period
  contributions: number;                // Total gross contributions
  netContributions: number;             // Total net contributions after fees
  growth: number;                       // Investment growth during period
  pensionReturn: number;                // Effective pension return rate
  pensionDepositFee: number;            // Deposit fee percentage
  pensionAnnualFee: number;             // Annual fee percentage
  pensionEffectiveReturn: number;       // Net return after all fees
  monthlyTrainingFund: number;          // Monthly training fund contribution
}
```

### ChartDataPoint
Data structure for chart visualization.

```typescript
interface ChartDataPoint {
  year: number;                         // Calendar year
  age: number;                          // User's age in this year
  pensionSavings: number;               // Pension savings amount
  trainingFund: number;                 // Training fund amount
  totalSavings: number;                 // Combined savings (nominal)
  inflationAdjusted: number;            // Inflation-adjusted total
  yearLabel: string;                    // Display label for chart
}
```

---

## 🧮 Calculation Functions

### Core Calculation Engine

#### `calculateRetirement()`
Main calculation function that processes all inputs and returns comprehensive results.

```javascript
const calculateRetirement = () => {
  const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
  
  // Validation
  if (yearsToRetirement <= 0) {
    setResults(null);
    return;
  }
  
  // Calculate weighted returns with risk adjustment
  const pensionWeightedReturn = getAdjustedReturn(
    calculateWeightedReturn(pensionIndexAllocation, yearsToRetirement)
  );
  
  // Process each work period
  let totalPensionSavings = inputs.currentSavings;
  // ... detailed calculation logic
  
  return results;
};
```

#### `calculateWeightedReturn(allocations, timeHorizon)`
Calculates weighted average return based on index allocations.

```javascript
const calculateWeightedReturn = (allocations, timeHorizon = 20) => {
  let totalReturn = 0;
  let totalPercentage = 0;
  
  // Find closest available time horizon
  const availableTimeHorizons = [5, 10, 15, 20, 25, 30];
  const closestTimeHorizon = availableTimeHorizons.reduce((prev, curr) => 
    Math.abs(curr - timeHorizon) < Math.abs(prev - timeHorizon) ? curr : prev
  );
  
  allocations.forEach(allocation => {
    if (allocation.percentage > 0) {
      const returnRate = allocation.customReturn !== null 
        ? allocation.customReturn 
        : historicalReturns[closestTimeHorizon][allocation.index] || 0;
      
      totalReturn += (returnRate * allocation.percentage / 100);
      totalPercentage += allocation.percentage;
    }
  });
  
  return totalPercentage > 0 ? totalReturn : 0;
};
```

#### `getAdjustedReturn(baseReturn, riskLevel)`
Applies risk tolerance adjustment to base return rates.

```javascript
const getAdjustedReturn = (baseReturn, riskLevel = inputs.riskTolerance) => {
  const riskMultiplier = riskScenarios[riskLevel]?.multiplier || 1.0;
  return baseReturn * riskMultiplier;
};
```

### Financial Calculations

#### Compound Growth with Contributions
```javascript
// Formula for savings growth with regular contributions
const futureValue = (presentValue, monthlyContribution, annualRate, years) => {
  const monthlyRate = annualRate / 12;
  const months = years * 12;
  
  // Growth of existing savings
  const existingGrowth = presentValue * Math.pow(1 + monthlyRate, months);
  
  // Growth of monthly contributions
  const contributionGrowth = monthlyContribution * 
    (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
  
  return existingGrowth + contributionGrowth;
};
```

#### Tax Calculations
```javascript
// Weighted tax rate calculation across work periods
const calculateWeightedTaxRate = (periodResults) => {
  let weightedTaxRate = 0;
  let totalWeight = 0;
  
  periodResults.forEach(result => {
    const country = countryData[result.country];
    weightedTaxRate += country.pensionTax * result.growth;
    totalWeight += result.growth;
  });
  
  return totalWeight > 0 ? weightedTaxRate / totalWeight : 0;
};
```

### Chart Data Generation

#### `generateChartData()`
Creates data points for savings progression visualization.

```javascript
const generateChartData = () => {
  const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
  const chartPoints = [];
  
  let accumulatedPensionSavings = inputs.currentSavings;
  let accumulatedTrainingFund = inputs.currentTrainingFund;
  
  // Add starting point
  chartPoints.push({
    year: inputs.currentAge,
    age: inputs.currentAge,
    pensionSavings: accumulatedPensionSavings,
    trainingFund: accumulatedTrainingFund,
    totalSavings: accumulatedPensionSavings + accumulatedTrainingFund,
    inflationAdjusted: accumulatedPensionSavings + accumulatedTrainingFund,
    yearLabel: `Age ${inputs.currentAge}`
  });
  
  // Calculate year by year progression
  for (let yearOffset = 1; yearOffset <= yearsToRetirement; yearOffset++) {
    const currentAge = inputs.currentAge + yearOffset;
    
    // Find active work period
    const activePeriod = workPeriods.find(period => 
      currentAge > period.startAge && currentAge <= period.endAge
    );
    
    // Apply growth and contributions
    if (activePeriod) {
      // Pension growth calculation
      const adjustedPensionReturn = getAdjustedReturn(activePeriod.pensionReturn);
      const pensionEffectiveReturn = adjustedPensionReturn - activePeriod.pensionAnnualFee;
      const netMonthlyContribution = activePeriod.monthlyContribution * 
        (1 - activePeriod.pensionDepositFee / 100);
      
      accumulatedPensionSavings = accumulatedPensionSavings * 
        (1 + pensionEffectiveReturn / 100) + (netMonthlyContribution * 12);
      
      // Training fund growth calculation
      const adjustedTrainingFundReturn = getAdjustedReturn(inputs.trainingFundReturn);
      const trainingFundNetReturn = (adjustedTrainingFundReturn - 
        inputs.trainingFundManagementFee) / 100;
      
      accumulatedTrainingFund = accumulatedTrainingFund * (1 + trainingFundNetReturn) + 
        (activePeriod.monthlyTrainingFund * 12);
    }
    
    const totalSavings = accumulatedPensionSavings + accumulatedTrainingFund;
    const inflationAdjustedValue = totalSavings / 
      Math.pow(1 + inputs.inflationRate / 100, yearOffset);
    
    chartPoints.push({
      year: currentAge,
      age: currentAge,
      pensionSavings: Math.round(accumulatedPensionSavings),
      trainingFund: Math.round(accumulatedTrainingFund),
      totalSavings: Math.round(totalSavings),
      inflationAdjusted: Math.round(inflationAdjustedValue),
      yearLabel: `Age ${currentAge}`
    });
  }
  
  setChartData(chartPoints);
  setShowChart(true);
};
```

---

## ⚙️ Configuration Objects

### Historical Returns Data
```javascript
const historicalReturns = {
  [timeHorizon]: {
    'S&P 500': number,          // Annual return percentage
    'NASDAQ': number,
    'MSCI World': number,
    'Dow Jones': number,
    'Tel Aviv 35': number,
    'Tel Aviv 125': number,
    'EUR STOXX 50': number,
    'FTSE 100': number,
    'Nikkei 225': number,
    'Local Index Fund': number,
    'Government Bonds': number,
    'Corporate Bonds': number,
    'Real Estate': number
  }
};

// Available time horizons: 5, 10, 15, 20, 25, 30 years
```

### Country Configuration
```javascript
const countryData = {
  [countryCode]: {
    name: string,               // Display name
    pensionTax: number,         // Tax rate (0.0 to 1.0)
    socialSecurity: number,     // Monthly amount in local currency
    flag: string,               // Unicode flag emoji
    currency?: string,          // ISO currency code
    retirementAge?: number      // Standard retirement age
  }
};
```

### Risk Scenarios
```javascript
const riskScenarios = {
  veryConservative: { multiplier: 0.7, name: 'Very Conservative' },
  conservative: { multiplier: 0.85, name: 'Conservative' },
  moderate: { multiplier: 1.0, name: 'Moderate' },
  aggressive: { multiplier: 1.15, name: 'Aggressive' },
  veryAggressive: { multiplier: 1.3, name: 'Very Aggressive' }
};
```

### Exchange Rates
```javascript
const exchangeRates = {
  USD: 3.37,    // ILS per USD
  GBP: 4.60,    // ILS per GBP  
  EUR: 3.60     // ILS per EUR
};
```

---

## 🔌 Integration Examples

### Adding a New Country

```javascript
// 1. Add to countryData
const countryData = {
  // ... existing countries
  canada: {
    name: 'Canada',
    pensionTax: 0.18,
    socialSecurity: 1800,
    flag: '🇨🇦',
    currency: 'CAD',
    retirementAge: 65
  }
};

// 2. Add to exchange rates if needed
const exchangeRates = {
  // ... existing rates
  CAD: 2.85  // ILS per CAD
};

// 3. Update currency conversion function
const convertCurrency = (amount, currency) => {
  const convertedAmount = amount / exchangeRates[currency];
  const formatters = {
    // ... existing formatters
    CAD: new Intl.NumberFormat('en-CA', { 
      style: 'currency', 
      currency: 'CAD', 
      minimumFractionDigits: 0 
    })
  };
  return formatters[currency].format(convertedAmount);
};
```

### Adding a New Investment Index

```javascript
// 1. Add historical data for all time horizons
const historicalReturns = {
  5: {
    // ... existing indices
    'TSX Composite': 9.2
  },
  10: {
    // ... existing indices  
    'TSX Composite': 8.8
  },
  15: {
    // ... existing indices
    'TSX Composite': 8.4
  },
  20: {
    // ... existing indices
    'TSX Composite': 8.0
  },
  25: {
    // ... existing indices
    'TSX Composite': 7.6
  },
  30: {
    // ... existing indices
    'TSX Composite': 7.2
  }
};

// 2. Index will automatically appear in allocation dropdowns
```

### Custom Risk Scenario

```javascript
// Add new risk level
const riskScenarios = {
  // ... existing scenarios
  ultraConservative: { 
    multiplier: 0.5, 
    name: 'Ultra Conservative' 
  },
  ultraAggressive: { 
    multiplier: 1.5, 
    name: 'Ultra Aggressive' 
  }
};

// Update TypeScript type if using
type RiskLevel = 'ultraConservative' | 'veryConservative' | 'conservative' | 
                 'moderate' | 'aggressive' | 'veryAggressive' | 'ultraAggressive';
```

---

## 🛠️ Utility Functions

### Currency Formatting
```javascript
const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};
```

### Percentage Formatting
```javascript
const formatPercentage = (value, decimals = 1) => {
  return `${value.toFixed(decimals)}%`;
};
```

### Input Validation
```javascript
const validateInputs = (inputs) => {
  const errors = [];
  
  if (inputs.currentAge < 18 || inputs.currentAge > 100) {
    errors.push('Current age must be between 18 and 100');
  }
  
  if (inputs.retirementAge <= inputs.currentAge) {
    errors.push('Retirement age must be greater than current age');
  }
  
  if (inputs.inflationRate < 0 || inputs.inflationRate > 20) {
    errors.push('Inflation rate must be between 0% and 20%');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};
```

---

## 🚨 Error Handling

### Common Error Scenarios

#### Invalid Age Range
```javascript
if (inputs.retirementAge <= inputs.currentAge) {
  return {
    error: 'INVALID_AGE_RANGE',
    message: 'Retirement age must be greater than current age',
    code: 'ERR_001'
  };
}
```

#### Division by Zero
```javascript
const calculateMonthlyReturn = (annualRate) => {
  if (annualRate === 0) {
    return 0; // Handle zero return gracefully
  }
  return annualRate / 100 / 12;
};
```

#### Missing Data
```javascript
const getHistoricalReturn = (index, timeHorizon) => {
  if (!historicalReturns[timeHorizon]) {
    console.warn(`No data for time horizon: ${timeHorizon}`);
    return 0;
  }
  
  if (!historicalReturns[timeHorizon][index]) {
    console.warn(`No data for index: ${index}`);
    return 0;
  }
  
  return historicalReturns[timeHorizon][index];
};
```

### Error Boundaries
```javascript
// React Error Boundary component
class RetirementPlannerErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Retirement Planner Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong with the retirement calculator.</h2>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## 🔧 Customization Guide

### Theming
```javascript
// Custom color scheme
const customTheme = {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    700: '#1d4ed8'
  },
  secondary: {
    50: '#f0fdf4',
    500: '#22c55e', 
    700: '#15803d'
  }
};

// Apply in Tailwind config or CSS variables
```

### Custom Calculations
```javascript
// Override default calculation
const customRetirementCalculation = (inputs, workPeriods) => {
  // Your custom logic here
  return {
    // ... custom results structure
  };
};

// Use in component
const results = customRetirementCalculation(inputs, workPeriods);
```

---

## 📊 Performance Considerations

### Optimization Tips
- Debounce input changes to avoid excessive recalculations
- Memoize expensive calculations with `useMemo`
- Lazy load chart components
- Use virtual scrolling for large datasets

### Memory Management
```javascript
// Cleanup chart data when component unmounts
useEffect(() => {
  return () => {
    setChartData(null);
    setResults(null);
  };
}, []);
```

---

For more technical details, see the source code comments and [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.