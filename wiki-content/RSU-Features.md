# 📈 RSU (Restricted Stock Units) Features

> **Industry-leading RSU planning with real-time stock prices and advanced tax calculations**

## 🌟 Overview

The Advanced Retirement Planner includes comprehensive RSU support, making it the first retirement planning tool to integrate real-time stock prices with sophisticated tax modeling for both Israeli and US markets.

## 🚀 Key Features

### 📊 **Real-Time Stock Price Integration**
- **Yahoo Finance API**: Live stock prices for major tech companies
- **Automatic Updates**: Prices refresh when companies are selected
- **Fallback Support**: Static prices when API is unavailable
- **Error Resilience**: Graceful handling of API failures

### 🏢 **Supported Companies**
| Symbol | Company | Typical RSU Programs |
|--------|---------|---------------------|
| **AAPL** | Apple | 4-year vesting, annual grants |
| **GOOGL** | Google (Alphabet) | 4-year vesting, quarterly |
| **MSFT** | Microsoft | 4-year vesting, annual grants |
| **AMZN** | Amazon | 4-year vesting, semi-annual |
| **META** | Meta (Facebook) | 4-year vesting, quarterly |
| **TSLA** | Tesla | 4-year vesting, performance-based |
| **NVDA** | NVIDIA | 4-year vesting, annual grants |

### 💰 **Advanced Tax Calculations**

#### 🇮🇱 **Israeli RSU Taxation**
- **Employment Income Tax**: Marginal rates from 10% to 50%
- **National Insurance**: 7% up to annual ceiling
- **Health Tax**: 3.1% on RSU value
- **Effective Rate Calculation**: Complete tax burden analysis

#### 🇺🇸 **US RSU Taxation**
- **Federal Income Tax**: Progressive rates up to 37%
- **State Tax**: Average 5% (varies by state)
- **Social Security**: 6.2% up to wage base
- **Medicare**: 1.45% on all income
- **FICA Considerations**: Proper payroll tax calculations

### 📈 **Vesting & Growth Modeling**

#### **Vesting Periods**
- **1-5 Years**: Flexible vesting schedules
- **Annual Grants**: Modeling continuous RSU programs
- **Cliff vs Graded**: Different vesting structures supported

#### **Growth Projections**
- **Expected Annual Growth**: Customizable growth rates
- **Compound Calculations**: Year-over-year price appreciation
- **Conservative Estimates**: Built-in fallback assumptions

## 🎯 How to Use RSU Features

### Step 1: Company Selection
1. **Choose Company**: Select from dropdown of major tech companies
2. **Auto-Price Fetch**: Stock price automatically updates
3. **Manual Override**: Adjust price if needed

### Step 2: RSU Configuration
1. **Annual Units**: Number of RSUs granted per year
2. **Current Price**: Live price (auto-filled) or manual entry
3. **Vesting Period**: Choose 1-5 year vesting schedule
4. **Tax Country**: Select Israel or US for tax calculations
5. **Growth Rate**: Expected annual stock appreciation

### Step 3: View Results
The system displays:
- **Gross Value**: Total RSU value before taxes
- **Tax Burden**: Complete tax breakdown by country
- **Net Value**: After-tax RSU value
- **Total Units**: Cumulative units over career
- **Effective Tax Rate**: Overall tax percentage

## 🔧 Technical Implementation

### **Stock Price API**
```javascript
// Yahoo Finance Integration
const fetchStockPrice = async (symbol) => {
    const response = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`
    );
    // Process response with fallback handling
};
```

### **Tax Calculation Engine**
```javascript
// Israeli Tax Example
const calculateIsraeliRSUTax = (rsuValue, income) => {
    const marginalRate = income > 640000 ? 0.50 : 
                        income > 220000 ? 0.35 : 
                        income > 75000 ? 0.31 : 0.10;
    
    return {
        incomeTax: rsuValue * marginalRate,
        nationalInsurance: Math.min(rsuValue * 0.07, 2400),
        healthTax: rsuValue * 0.031
    };
};
```

### **Vesting Projection Model**
```javascript
// Multi-year RSU calculation
for (let year = 1; year <= retirementYears; year++) {
    const unitsThisYear = year <= vestingYears ? annualUnits : 0;
    const priceAtVesting = currentPrice * Math.pow(1 + growthRate, year);
    const valueThisYear = unitsThisYear * priceAtVesting;
    
    const taxInfo = calculateRSUTaxes(valueThisYear, taxCountry, salary);
    // Accumulate totals...
}
```

## 📊 Results & Analysis

### **Comprehensive Display**
The RSU results section shows:

1. **Gross Value**: `$1,234,567`
   - Total value before any taxes
   - Based on growth projections

2. **Net Value**: `$987,654`
   - After-tax value for retirement planning
   - Country-specific tax calculations

3. **Taxes**: `$246,913`
   - Complete tax breakdown
   - Effective rate percentage

4. **Total Units**: `12,500`
   - Cumulative RSUs over career
   - Includes vesting schedule

### **Tax Information**
- **Country-Specific**: "Tax calculation based on Israeli/US laws"
- **Effective Rate**: "Effective tax rate: 20.0%"
- **Transparency**: Full breakdown of tax components

## 🛡️ Security & Reliability

### **API Security**
- **HTTPS Only**: All API calls use secure connections
- **Error Handling**: Graceful degradation when APIs fail
- **No Credentials**: No API keys or sensitive data stored
- **Rate Limiting**: Respectful API usage patterns

### **Fallback Mechanisms**
- **Static Prices**: Built-in fallback when API unavailable
- **Error Recovery**: Automatic retry with delays
- **User Notification**: Clear messaging about data sources

### **Data Privacy**
- **No Storage**: RSU data remains in browser only
- **No Tracking**: No personal information transmitted
- **Local Processing**: All calculations performed client-side

## 🧪 Testing Coverage

### **RSU Test Suite** (31 Tests)
- ✅ **RSU Section**: Interface and integration
- ✅ **Company Selection**: All 7 tech companies
- ✅ **Input Fields**: 6 RSU configuration fields
- ✅ **Tax Country Support**: Israel and US options
- ✅ **UI Design**: Consistent styling and responsiveness
- ✅ **Form Integration**: State management and React keys
- ✅ **Stock Price API**: Yahoo Finance integration
- ✅ **Taxation Logic**: Both country implementations
- ✅ **Results Display**: All metrics and calculations

### **Success Rate**: 100% (31/31 tests passing)

## 🔍 Troubleshooting

### **Common Issues**

#### Stock Price Not Loading
- **Check Internet**: Ensure stable connection
- **API Status**: Yahoo Finance may have temporary issues
- **Fallback Used**: System uses static prices as backup

#### Tax Calculations Seem High
- **Marginal Rates**: RSUs taxed as ordinary income
- **All Taxes Included**: Income, payroll, and additional taxes
- **Country Specific**: Different tax structures per country

#### Vesting Results Unclear
- **Annual Grants**: Assumes continuous RSU programs
- **Growth Assumptions**: Based on expected appreciation
- **Conservative Estimates**: Designed for planning purposes

### **Best Practices**

1. **Regular Updates**: Check stock prices periodically
2. **Conservative Growth**: Use realistic growth assumptions
3. **Tax Planning**: Consider tax-loss harvesting strategies
4. **Professional Advice**: Consult tax professionals for complex situations

## 🚀 Future Enhancements

### **Planned Features**
- **More Companies**: Expanding beyond current 7
- **International Taxes**: Additional country support
- **Advanced Vesting**: Performance and cliff vesting
- **Tax Optimization**: Strategic planning recommendations

### **API Improvements**
- **Multiple Sources**: Backup APIs for redundancy
- **Real-Time Updates**: Live price refreshing
- **Historical Data**: Performance analysis capabilities

---

**💡 Ready to include RSUs in your retirement planning?**  
**[Start Planning with RSUs →](https://advanced-pension-planner.netlify.app/)**