# Test Data Management Guide

## Overview

Effective test data management is crucial for maintaining reliable, maintainable, and fast tests. This guide covers strategies for creating, organizing, and managing test data in the Advanced Retirement Planner.

## Table of Contents
1. [Test Data Principles](#test-data-principles)
2. [Data Organization Structure](#data-organization-structure)
3. [Test Data Fixtures](#test-data-fixtures)
4. [Data Builders and Factories](#data-builders-and-factories)
5. [Mock Data Generation](#mock-data-generation)
6. [Database and Storage Management](#database-and-storage-management)
7. [Data Privacy and Security](#data-privacy-and-security)
8. [Best Practices](#best-practices)

## Test Data Principles

### Core Principles

1. **Isolation**: Each test should have its own data
2. **Repeatability**: Same data produces same results
3. **Clarity**: Data intent should be obvious
4. **Minimalism**: Use minimum data needed
5. **Realism**: Data should reflect real scenarios

### Data Categories

```
Test Data
├── Static Fixtures      (Unchanging reference data)
├── Dynamic Fixtures     (Generated per test)
├── Seed Data           (Initial state data)
├── Mock Responses      (External API data)
└── Edge Cases         (Boundary test data)
```

## Data Organization Structure

### Directory Structure

```
tests/
├── fixtures/
│   ├── users/
│   │   ├── young-professional.json
│   │   ├── near-retirement.json
│   │   └── high-earner.json
│   ├── market-data/
│   │   ├── historical-returns.json
│   │   ├── exchange-rates.json
│   │   └── stock-prices.json
│   ├── calculations/
│   │   ├── pension-scenarios.json
│   │   ├── tax-brackets.json
│   │   └── inflation-rates.json
│   └── api-responses/
│       ├── yahoo-finance/
│       └── currency-api/
├── builders/
│   ├── UserBuilder.js
│   ├── PortfolioBuilder.js
│   └── ScenarioBuilder.js
├── generators/
│   ├── randomUser.js
│   ├── marketData.js
│   └── timeSeriesData.js
└── seeds/
    ├── development.js
    ├── testing.js
    └── demo.js
```

## Test Data Fixtures

### User Personas

```javascript
// tests/fixtures/users/personas.js
module.exports = {
  youngProfessional: {
    id: 'user-young-prof',
    demographics: {
      currentAge: 28,
      retirementAge: 65,
      planningType: 'individual',
      riskTolerance: 'moderate'
    },
    financial: {
      monthlySalary: 12000,
      currentSavings: 50000,
      monthlyExpenses: 8000,
      emergencyFund: 30000
    },
    pension: {
      employeeRate: 6.5,
      employerRate: 6.5,
      severanceRate: 8.33,
      yearsOfService: 5
    },
    goals: {
      targetMonthlyIncome: 10000,
      legacyGoal: 500000,
      majorPurchases: [
        { type: 'home', targetAge: 35, amount: 1500000 }
      ]
    }
  },
  
  coupleNearRetirement: {
    id: 'couple-near-retire',
    demographics: {
      planningType: 'couple'
    },
    partner1: {
      currentAge: 58,
      retirementAge: 67,
      monthlySalary: 25000,
      currentSavings: 800000,
      pensionBalance: 1200000
    },
    partner2: {
      currentAge: 56,
      retirementAge: 65,
      monthlySalary: 18000,
      currentSavings: 600000,
      pensionBalance: 900000
    },
    shared: {
      monthlyExpenses: 20000,
      propertyValue: 3000000,
      investmentProperty: 2000000
    }
  },
  
  highEarnerWithRSU: {
    id: 'user-high-earner',
    demographics: {
      currentAge: 42,
      retirementAge: 55,
      planningType: 'individual'
    },
    financial: {
      monthlySalary: 60000,
      yearlyBonus: 200000,
      currentSavings: 2500000
    },
    rsu: {
      stockSymbol: 'AAPL',
      unitsPerYear: 1000,
      vestingSchedule: 'quarterly',
      currentPrice: 175.50,
      strikePrice: 100
    },
    portfolio: {
      stocks: 70,
      bonds: 20,
      alternatives: 10,
      cryptoAllocation: 5
    }
  }
};
```

### Market Data Fixtures

```javascript
// tests/fixtures/market-data/scenarios.js
module.exports = {
  normalMarket: {
    id: 'market-normal',
    annualReturns: {
      stocks: 8.5,
      bonds: 4.2,
      cash: 2.0,
      realEstate: 6.5,
      commodities: 3.8
    },
    inflation: 2.5,
    exchangeRates: {
      USD: 3.50,
      EUR: 4.00,
      GBP: 4.50,
      BTC: 150000,
      ETH: 10000
    }
  },
  
  bearMarket: {
    id: 'market-bear',
    annualReturns: {
      stocks: -15.0,
      bonds: 1.5,
      cash: 0.5,
      realEstate: -5.0,
      commodities: -8.0
    },
    inflation: 5.0,
    exchangeRates: {
      USD: 3.80,
      EUR: 4.30,
      GBP: 4.80
    }
  },
  
  highInflation: {
    id: 'market-high-inflation',
    annualReturns: {
      stocks: 12.0,
      bonds: -2.0,
      cash: 5.0,
      realEstate: 15.0,
      commodities: 20.0
    },
    inflation: 8.0
  }
};
```

### Calculation Test Cases

```javascript
// tests/fixtures/calculations/test-cases.json
{
  "pensionCalculations": [
    {
      "description": "Standard pension accumulation",
      "input": {
        "monthlySalary": 15000,
        "yearsOfService": 30,
        "employeeRate": 6.5,
        "employerRate": 6.5,
        "managementFee": 0.5
      },
      "expected": {
        "totalAccumulation": 1404000,
        "monthlyPension": 5850,
        "replacementRatio": 0.39
      }
    },
    {
      "description": "High earner with contribution limits",
      "input": {
        "monthlySalary": 100000,
        "yearsOfService": 25,
        "employeeRate": 6.5,
        "employerRate": 6.5
      },
      "expected": {
        "totalAccumulation": 3900000,
        "monthlyPension": 16250,
        "limitApplied": true,
        "effectiveRate": 13.0
      }
    }
  ],
  
  "taxCalculations": [
    {
      "description": "Progressive tax brackets",
      "input": {
        "monthlyIncome": 25000,
        "capitalGains": 100000,
        "taxYear": 2024
      },
      "expected": {
        "incomeTax": 7854,
        "capitalGainsTax": 25000,
        "totalTax": 32854,
        "effectiveRate": 0.314
      }
    }
  ]
}
```

## Data Builders and Factories

### User Data Builder

```javascript
// tests/builders/UserBuilder.js
class UserBuilder {
  constructor() {
    this.data = {
      id: this.generateId(),
      currentAge: 40,
      retirementAge: 67,
      monthlySalary: 15000,
      currentSavings: 200000,
      monthlyExpenses: 10000,
      planningType: 'individual'
    };
  }
  
  generateId() {
    return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Demographic methods
  withAge(age) {
    this.data.currentAge = age;
    return this;
  }
  
  withRetirementAge(age) {
    this.data.retirementAge = age;
    return this;
  }
  
  asCouple() {
    this.data.planningType = 'couple';
    this.data.partner1 = { ...this.data };
    this.data.partner2 = {
      currentAge: this.data.currentAge - 2,
      retirementAge: this.data.retirementAge,
      monthlySalary: this.data.monthlySalary * 0.8,
      currentSavings: this.data.currentSavings * 0.7
    };
    return this;
  }
  
  // Financial presets
  asYoungProfessional() {
    return this
      .withAge(28)
      .withRetirementAge(65)
      .withSalary(12000)
      .withSavings(50000)
      .withExpenses(8000);
  }
  
  asHighEarner() {
    return this
      .withAge(45)
      .withRetirementAge(60)
      .withSalary(50000)
      .withSavings(2000000)
      .withExpenses(25000)
      .withRSU('AAPL', 1000);
  }
  
  nearRetirement() {
    return this
      .withAge(62)
      .withRetirementAge(67)
      .withSalary(30000)
      .withSavings(1500000)
      .withExpenses(20000);
  }
  
  // Financial methods
  withSalary(amount) {
    this.data.monthlySalary = amount;
    return this;
  }
  
  withSavings(amount) {
    this.data.currentSavings = amount;
    return this;
  }
  
  withExpenses(amount) {
    this.data.monthlyExpenses = amount;
    return this;
  }
  
  withDebt(type, amount, rate) {
    if (!this.data.debts) this.data.debts = [];
    this.data.debts.push({ type, amount, rate });
    return this;
  }
  
  withRSU(symbol, units) {
    this.data.rsu = {
      stockSymbol: symbol,
      unitsPerYear: units,
      vestingSchedule: 'quarterly',
      currentPrice: 150 // Default price
    };
    return this;
  }
  
  // Portfolio methods
  withPortfolio(allocations) {
    this.data.portfolio = allocations;
    return this;
  }
  
  withConservativePortfolio() {
    return this.withPortfolio({
      stocks: 30,
      bonds: 60,
      cash: 10
    });
  }
  
  withAggressivePortfolio() {
    return this.withPortfolio({
      stocks: 80,
      bonds: 15,
      alternatives: 5
    });
  }
  
  // Build method
  build() {
    // Validate data consistency
    if (this.data.retirementAge <= this.data.currentAge) {
      this.data.retirementAge = this.data.currentAge + 5;
    }
    
    if (this.data.monthlyExpenses > this.data.monthlySalary * 1.5) {
      console.warn('Warning: Expenses exceed reasonable ratio to income');
    }
    
    return { ...this.data };
  }
  
  // Bulk generation
  static createMany(count, customizer) {
    const users = [];
    for (let i = 0; i < count; i++) {
      const builder = new UserBuilder();
      if (customizer) {
        customizer(builder, i);
      }
      users.push(builder.build());
    }
    return users;
  }
}

// Usage examples
const youngUser = new UserBuilder()
  .asYoungProfessional()
  .withAggressivePortfolio()
  .build();

const couple = new UserBuilder()
  .nearRetirement()
  .asCouple()
  .withConservativePortfolio()
  .build();

// Generate multiple users
const testUsers = UserBuilder.createMany(10, (builder, index) => {
  builder
    .withAge(25 + index * 5)
    .withSalary(10000 + index * 2000);
});

module.exports = UserBuilder;
```

### Portfolio Builder

```javascript
// tests/builders/PortfolioBuilder.js
class PortfolioBuilder {
  constructor() {
    this.assets = [];
    this.totalValue = 0;
  }
  
  addStock(symbol, shares, price) {
    this.assets.push({
      type: 'stock',
      symbol,
      shares,
      price,
      value: shares * price
    });
    this.totalValue += shares * price;
    return this;
  }
  
  addBond(name, faceValue, coupon, maturity) {
    this.assets.push({
      type: 'bond',
      name,
      faceValue,
      coupon,
      maturity,
      value: faceValue
    });
    this.totalValue += faceValue;
    return this;
  }
  
  addMutualFund(name, units, nav) {
    this.assets.push({
      type: 'mutual_fund',
      name,
      units,
      nav,
      value: units * nav
    });
    this.totalValue += units * nav;
    return this;
  }
  
  addCrypto(symbol, amount, price) {
    this.assets.push({
      type: 'crypto',
      symbol,
      amount,
      price,
      value: amount * price
    });
    this.totalValue += amount * price;
    return this;
  }
  
  withDiversifiedPortfolio(totalValue) {
    const allocations = {
      stocks: 0.60,
      bonds: 0.30,
      cash: 0.05,
      crypto: 0.05
    };
    
    // Add stocks
    this.addStock('SPY', Math.floor(totalValue * allocations.stocks / 450), 450);
    
    // Add bonds
    this.addBond('US Treasury 10Y', totalValue * allocations.bonds, 3.5, '2034-01-01');
    
    // Add crypto
    this.addCrypto('BTC', totalValue * allocations.crypto / 60000, 60000);
    
    return this;
  }
  
  calculateMetrics() {
    const allocation = {};
    let totalDividends = 0;
    let totalCoupon = 0;
    
    this.assets.forEach(asset => {
      allocation[asset.type] = (allocation[asset.type] || 0) + asset.value;
      
      if (asset.type === 'stock' && asset.dividendYield) {
        totalDividends += asset.value * asset.dividendYield;
      }
      if (asset.type === 'bond') {
        totalCoupon += asset.faceValue * (asset.coupon / 100);
      }
    });
    
    return {
      totalValue: this.totalValue,
      allocation,
      expectedIncome: totalDividends + totalCoupon,
      assetCount: this.assets.length
    };
  }
  
  build() {
    return {
      assets: this.assets,
      metrics: this.calculateMetrics(),
      createdAt: new Date().toISOString()
    };
  }
}

module.exports = PortfolioBuilder;
```

## Mock Data Generation

### Random Data Generators

```javascript
// tests/generators/randomData.js
const crypto = require('crypto');

class RandomDataGenerator {
  // User data generators
  static generateAge(min = 18, max = 70) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  static generateSalary(min = 5000, max = 50000) {
    return Math.round((Math.random() * (max - min) + min) / 100) * 100;
  }
  
  static generateName() {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'];
    return {
      first: firstNames[Math.floor(Math.random() * firstNames.length)],
      last: lastNames[Math.floor(Math.random() * lastNames.length)]
    };
  }
  
  static generateEmail(name) {
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${name.first.toLowerCase()}.${name.last.toLowerCase()}@${domain}`;
  }
  
  // Financial data generators
  static generateStockPrice(base = 100, volatility = 0.02) {
    const change = (Math.random() - 0.5) * 2 * volatility;
    return +(base * (1 + change)).toFixed(2);
  }
  
  static generateMarketData(days = 30) {
    const data = [];
    let price = 100;
    
    for (let i = 0; i < days; i++) {
      price = this.generateStockPrice(price);
      data.push({
        date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000),
        open: price,
        high: price * 1.02,
        low: price * 0.98,
        close: this.generateStockPrice(price),
        volume: Math.floor(Math.random() * 1000000) + 500000
      });
    }
    
    return data;
  }
  
  static generatePortfolioReturns(years = 10) {
    const returns = [];
    const baseReturn = 0.08; // 8% average
    
    for (let i = 0; i < years; i++) {
      // Add randomness with mean reversion
      const randomFactor = (Math.random() - 0.5) * 0.3;
      const annualReturn = baseReturn + randomFactor;
      returns.push({
        year: new Date().getFullYear() - years + i,
        return: +annualReturn.toFixed(4),
        cumulative: returns.length > 0 
          ? +((1 + returns[returns.length - 1].cumulative) * (1 + annualReturn) - 1).toFixed(4)
          : annualReturn
      });
    }
    
    return returns;
  }
  
  // Scenario generators
  static generateRetirementScenario() {
    const age = this.generateAge(25, 60);
    const salary = this.generateSalary();
    
    return {
      currentAge: age,
      retirementAge: Math.min(age + this.generateAge(5, 40), 70),
      monthlySalary: salary,
      currentSavings: salary * this.generateAge(1, 20),
      monthlyExpenses: salary * (0.6 + Math.random() * 0.3),
      pensionYears: this.generateAge(0, age - 22)
    };
  }
  
  // Bulk generation
  static generateTestCases(count, generator) {
    const cases = [];
    for (let i = 0; i < count; i++) {
      cases.push(generator());
    }
    return cases;
  }
}

// Property-based testing helpers
class PropertyTesting {
  static forAll(generators, property, runs = 100) {
    const failures = [];
    
    for (let i = 0; i < runs; i++) {
      const inputs = generators.map(gen => gen());
      try {
        if (!property(...inputs)) {
          failures.push({ inputs, run: i });
        }
      } catch (error) {
        failures.push({ inputs, error: error.message, run: i });
      }
    }
    
    return {
      passed: failures.length === 0,
      failures,
      runs
    };
  }
}

module.exports = { RandomDataGenerator, PropertyTesting };
```

### API Mock Responses

```javascript
// tests/fixtures/api-responses/mockApi.js
class MockAPIResponses {
  static stockPrice(symbol) {
    const prices = {
      'AAPL': { price: 175.50, change: 2.34, changePercent: 1.35 },
      'GOOGL': { price: 142.80, change: -1.20, changePercent: -0.83 },
      'MSFT': { price: 378.90, change: 5.60, changePercent: 1.50 }
    };
    
    return prices[symbol] || { 
      price: 100 + Math.random() * 200,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 5
    };
  }
  
  static exchangeRates(base = 'ILS') {
    const rates = {
      'ILS': {
        'USD': 0.285,
        'EUR': 0.250,
        'GBP': 0.222,
        'JPY': 42.857
      },
      'USD': {
        'ILS': 3.509,
        'EUR': 0.877,
        'GBP': 0.780,
        'JPY': 150.432
      }
    };
    
    return {
      base,
      date: new Date().toISOString().split('T')[0],
      rates: rates[base] || rates['ILS']
    };
  }
  
  static cryptoPrices() {
    return {
      'BTC': {
        usd: 65432.10,
        ils: 229678.25,
        change24h: 3.45
      },
      'ETH': {
        usd: 3456.78,
        ils: 12130.50,
        change24h: -1.23
      }
    };
  }
}

module.exports = MockAPIResponses;
```

## Database and Storage Management

### localStorage Mock

```javascript
// tests/mocks/localStorage.js
class LocalStorageMock {
  constructor() {
    this.store = new Map();
  }
  
  getItem(key) {
    return this.store.get(key) || null;
  }
  
  setItem(key, value) {
    this.store.set(key, String(value));
  }
  
  removeItem(key) {
    this.store.delete(key);
  }
  
  clear() {
    this.store.clear();
  }
  
  get length() {
    return this.store.size;
  }
  
  key(index) {
    return Array.from(this.store.keys())[index] || null;
  }
  
  // Test helpers
  snapshot() {
    return Object.fromEntries(this.store);
  }
  
  restore(snapshot) {
    this.clear();
    Object.entries(snapshot).forEach(([key, value]) => {
      this.setItem(key, value);
    });
  }
  
  getAllKeys() {
    return Array.from(this.store.keys());
  }
  
  hasItem(key) {
    return this.store.has(key);
  }
}

// Usage in tests
global.localStorage = new LocalStorageMock();

// Test example
test.beforeEach(() => {
  localStorage.clear();
});

test.it('should save user data', () => {
  const userData = { name: 'John', age: 30 };
  localStorage.setItem('userData', JSON.stringify(userData));
  
  const saved = JSON.parse(localStorage.getItem('userData'));
  test.expect(saved).toEqual(userData);
});
```

### Test Data Cleanup

```javascript
// tests/helpers/cleanup.js
class TestDataCleanup {
  constructor() {
    this.cleanupTasks = [];
  }
  
  register(task) {
    this.cleanupTasks.push(task);
  }
  
  async cleanup() {
    for (const task of this.cleanupTasks.reverse()) {
      try {
        await task();
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    }
    this.cleanupTasks = [];
  }
  
  // Common cleanup tasks
  clearLocalStorage() {
    this.register(() => localStorage.clear());
  }
  
  clearSessionStorage() {
    this.register(() => sessionStorage.clear());
  }
  
  removeTempFiles(pattern) {
    this.register(async () => {
      const fs = require('fs').promises;
      const glob = require('glob');
      const files = glob.sync(pattern);
      
      for (const file of files) {
        await fs.unlink(file);
      }
    });
  }
  
  resetGlobalState() {
    this.register(() => {
      // Reset any global state
      global.testState = {};
      global.mockData = {};
    });
  }
}

// Usage in tests
const cleanup = new TestDataCleanup();

test.beforeEach(() => {
  cleanup.clearLocalStorage();
  cleanup.resetGlobalState();
});

test.afterEach(async () => {
  await cleanup.cleanup();
});
```

## Data Privacy and Security

### Anonymizing Test Data

```javascript
// tests/helpers/anonymizer.js
class TestDataAnonymizer {
  static anonymizeName(name) {
    return name.replace(/[a-zA-Z]/g, char => {
      const isUpperCase = char === char.toUpperCase();
      const base = isUpperCase ? 65 : 97;
      return String.fromCharCode(base + Math.floor(Math.random() * 26));
    });
  }
  
  static anonymizeEmail(email) {
    const [local, domain] = email.split('@');
    return `user${Math.random().toString(36).substr(2, 8)}@${domain}`;
  }
  
  static anonymizePhone(phone) {
    return phone.replace(/\d/g, () => Math.floor(Math.random() * 10));
  }
  
  static anonymizeFinancialData(data) {
    const factor = 0.8 + Math.random() * 0.4; // ±20%
    
    return {
      ...data,
      monthlySalary: Math.round(data.monthlySalary * factor),
      currentSavings: Math.round(data.currentSavings * factor),
      monthlyExpenses: Math.round(data.monthlyExpenses * factor)
    };
  }
  
  static createAnonymizedDataset(realData) {
    return realData.map(record => ({
      ...record,
      name: this.anonymizeName(record.name),
      email: this.anonymizeEmail(record.email),
      phone: record.phone ? this.anonymizePhone(record.phone) : undefined,
      financial: this.anonymizeFinancialData(record.financial)
    }));
  }
}
```

### Secure Test Data Handling

```javascript
// tests/helpers/secureData.js
class SecureTestData {
  static sanitizeForLogs(data) {
    const sensitive = ['password', 'apiKey', 'token', 'ssn', 'creditCard'];
    
    const sanitized = { ...data };
    
    Object.keys(sanitized).forEach(key => {
      if (sensitive.some(s => key.toLowerCase().includes(s))) {
        sanitized[key] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }
  
  static generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }
  
  static hashSensitiveData(data) {
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(data))
      .digest('hex');
  }
}
```

## Best Practices

### 1. Data Isolation

```javascript
// Each test gets fresh data
test.describe('Calculator Tests', () => {
  let testData;
  
  test.beforeEach(() => {
    testData = new UserBuilder()
      .withAge(35)
      .withSalary(15000)
      .build();
  });
  
  test.it('should calculate correctly', () => {
    // Use testData - isolated from other tests
    const result = calculate(testData);
    test.expect(result).toBeDefined();
  });
});
```

### 2. Minimal Data Sets

```javascript
// Use only required fields
test.it('should calculate age difference', () => {
  // Don't create full user object
  const minimal = {
    currentAge: 30,
    retirementAge: 65
  };
  
  const difference = calculateYearsToRetirement(minimal);
  test.expect(difference).toBe(35);
});
```

### 3. Descriptive Test Data

```javascript
// Make data intent clear
const userNearRetirement = {
  currentAge: 64,
  retirementAge: 65,
  monthlyExpenses: 15000 // High expenses to test warnings
};

const userWithNoSavings = {
  currentAge: 45,
  currentSavings: 0, // Testing edge case
  monthlySalary: 20000
};
```

### 4. Centralized Test Constants

```javascript
// tests/constants/testConstants.js
module.exports = {
  RETIREMENT_AGE: {
    MIN: 50,
    DEFAULT: 67,
    MAX: 75
  },
  
  SALARY_LIMITS: {
    MIN: 5000,
    MAX: 200000,
    AVERAGE: 15000
  },
  
  TEST_DATES: {
    CURRENT: '2024-01-15',
    FUTURE: '2030-01-15',
    PAST: '2020-01-15'
  },
  
  MOCK_DELAYS: {
    API_CALL: 100,
    DATABASE: 50,
    CALCULATION: 10
  }
};
```

### 5. Data Versioning

```javascript
// Track test data versions
const TEST_DATA_VERSION = '2.1.0';

class TestDataMigration {
  static migrate(data, fromVersion, toVersion) {
    let migrated = { ...data };
    
    if (fromVersion < '2.0.0' && toVersion >= '2.0.0') {
      // Migrate from v1 to v2
      migrated.planningType = migrated.planningType || 'individual';
      delete migrated.deprecated_field;
    }
    
    if (fromVersion < '2.1.0' && toVersion >= '2.1.0') {
      // Add new required fields
      migrated.riskProfile = migrated.riskProfile || 'moderate';
    }
    
    return migrated;
  }
}
```

### 6. Performance Considerations

```javascript
// Lazy loading for large datasets
class LazyTestData {
  constructor() {
    this._cache = new Map();
  }
  
  getLargeDataset(key) {
    if (!this._cache.has(key)) {
      this._cache.set(key, this.loadDataset(key));
    }
    return this._cache.get(key);
  }
  
  loadDataset(key) {
    // Load only when needed
    return require(`./fixtures/large/${key}.json`);
  }
  
  clear() {
    this._cache.clear();
  }
}
```

### 7. Documentation

```javascript
/**
 * Test Data Catalog
 * 
 * User Personas:
 * - youngProfessional: Age 28, starting career, moderate risk
 * - midCareer: Age 45, peak earning, balanced portfolio
 * - nearRetirement: Age 62, conservative, wealth preservation
 * 
 * Market Scenarios:
 * - bullMarket: +15% stocks, low inflation
 * - bearMarket: -15% stocks, high inflation
 * - normal: Historical averages
 * 
 * Edge Cases:
 * - zeroSavings: Testing from scratch
 * - highDebt: Debt exceeds assets
 * - earlyRetirement: Age 50 retirement
 */
```

---

Remember: Good test data is **realistic**, **minimal**, and **maintainable**. Invest time in building proper test data infrastructure - it pays dividends in test reliability and development speed.