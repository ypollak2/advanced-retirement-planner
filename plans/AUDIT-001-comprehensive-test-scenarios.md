# AUDIT-001: Advanced Retirement Planner - Comprehensive Test Scenarios & Audit Plan

**Created:** 2025-07-29  
**Status:** In Progress  
**Priority:** High  
**Estimated Completion:** 5 weeks  

## Executive Summary

This document outlines a comprehensive audit and testing plan for the Advanced Retirement Planner application, identifying critical issues and providing 10 detailed test scenarios with expected outcomes to validate the financial health scoring system.

## Current State Analysis

### Financial Health Score Components (Total: 100 points)
1. **Savings Rate** (25 points) - Percentage of income saved monthly
2. **Retirement Readiness** (20 points) - Current savings vs age-appropriate targets
3. **Time Horizon** (15 points) - Years remaining until retirement
4. **Risk Alignment** (12 points) - Investment allocation matches age and goals
5. **Diversification** (10 points) - Spread across multiple asset classes
6. **Tax Efficiency** (8 points) - Effective use of tax-advantaged accounts
7. **Emergency Fund** (7 points) - Months of expenses covered
8. **Debt Management** (3 points) - Debt-to-income ratio and high-interest debt

### Critical Issues Identified

#### 1. Field Mapping Complexity
- **Location:** `src/utils/financialHealthEngine.js:10-306`
- **Issue:** Complex field mapping logic with 100+ lines of conditional checks
- **Risk:** Silent failures when partner fields don't match expected patterns
- **Impact:** Incorrect score calculations, especially in couple mode

#### 2. Couple Mode Calculation Errors
- **Location:** `src/utils/financialHealthEngine.js:74-170`
- **Issue:** Partner field combination logic may fail silently
- **Risk:** Combined income calculations returning 0 or NaN
- **Impact:** Severely underestimated financial health scores

#### 3. Currency Conversion Edge Cases
- **Location:** `src/components/shared/EnhancedRSUCompanySelector.js`
- **Issue:** Recent fixes for USD/ILS conversion but validation needed
- **Risk:** Stock prices showing in wrong currency
- **Impact:** Incorrect RSU valuations affecting income calculations

#### 4. Score Calculation Bounds
- **Location:** Multiple files in calculation logic
- **Issue:** Insufficient guards against NaN/Infinity values
- **Risk:** Division by zero, invalid rate calculations
- **Impact:** App crashes or misleading scores

#### 5. Tax Calculation Complexity
- **Location:** `src/utils/financialHealthEngine.js:1100-1255`
- **Issue:** Multi-country tax logic with assumptions
- **Risk:** Incorrect tax efficiency scores
- **Impact:** Poor optimization recommendations

## Detailed Test Scenarios

### Scenario 1: Young Professional (Individual, Israel) 🇮🇱
**Profile:** Tech worker starting retirement planning

**Input Data:**
```json
{
    "planningType": "individual",
    "currentAge": 28,
    "retirementAge": 67,
    "country": "israel",
    "currentMonthlySalary": 15000,
    "currency": "ILS",
    "pensionEmployeeRate": 7,
    "pensionEmployerRate": 14.33,
    "trainingFundEmployeeRate": 2.5,
    "trainingFundEmployerRate": 7.5,
    "currentBankAccount": 30000,
    "currentPersonalPortfolio": 50000,
    "personalPortfolioReturn": 8,
    "currentMonthlyExpenses": 12000,
    "monthlyAdditionalSavings": 1000,
    "riskTolerance": "moderate"
}
```

**Expected Score: 65-75/100**
- **Savings Rate:** 18-20/25 (21.3% pension + 6.7% additional = ~28%)
- **Retirement Readiness:** 8-12/20 (early career, minimal savings)
- **Time Horizon:** 13-15/15 (39 years remaining - excellent)
- **Risk Alignment:** 10-12/12 (moderate risk appropriate for age)
- **Diversification:** 6-8/10 (2 asset classes: pension, personal)
- **Tax Efficiency:** 6-7/8 (good pension usage)
- **Emergency Fund:** 4-6/7 (2.5 months coverage)
- **Debt Management:** 3/3 (no debt)

**Critical Validations:**
- [ ] Monthly salary correctly detected in ILS
- [ ] Pension rates calculated accurately (21.3% total)
- [ ] Emergency fund months = 30,000 / 12,000 = 2.5 months
- [ ] No NaN values in any calculation

---

### Scenario 2: Mid-Career Couple (Israel) 👫
**Profile:** Dual-income family with mortgage

**Input Data:**
```json
{
    "planningType": "couple",
    "currentAge": 42,
    "partnerCurrentAge": 40,
    "retirementAge": 67,
    "partnerRetirementAge": 65,
    "country": "israel",
    "partner1Salary": 25000,
    "partner2Salary": 20000,
    "currency": "ILS",
    "currentPensionSavings": 800000,
    "partnerCurrentSavings": 600000,
    "emergencyFund": 150000,
    "currentPersonalPortfolio": 300000,
    "expenses": {
        "housing": 8000,
        "transportation": 3000,
        "food": 4000,
        "insurance": 2000,
        "other": 3000,
        "mortgage": 8000,
        "carLoan": 2000
    },
    "pensionEmployeeRate": 7,
    "pensionEmployerRate": 14.33
}
```

**Expected Score: 75-85/100**
- **Savings Rate:** 20-22/25 (high combined income, good contribution rates)
- **Retirement Readiness:** 15-18/20 (good accumulated savings)
- **Time Horizon:** 10-12/15 (25-27 years remaining)
- **Risk Alignment:** 10-12/12 (appropriate for mid-career)
- **Diversification:** 7-9/10 (pension, personal portfolio)
- **Tax Efficiency:** 6-7/8 (optimal pension contributions)
- **Emergency Fund:** 6-7/7 (5+ months coverage: 150k/30k)
- **Debt Management:** 1-2/3 (22% debt-to-income ratio)

**Critical Validations:**
- [ ] Partner salaries combined correctly: 45,000 ILS
- [ ] Pension savings combined: 1,400,000 ILS
- [ ] Debt ratio = 10,000 / 45,000 = 22.2%
- [ ] Emergency fund = 150,000 / 30,000 = 5 months

---

### Scenario 3: Pre-Retirement (Individual, USA) 🇺🇸
**Profile:** American nearing retirement with substantial savings

**Input Data:**
```json
{
    "planningType": "individual",
    "currentAge": 58,
    "retirementAge": 65,
    "country": "usa",
    "currentMonthlySalary": 8000,
    "currency": "USD",
    "current401k": 750000,
    "currentIRA": 250000,
    "currentBankAccount": 50000,
    "currentPersonalPortfolio": 200000,
    "currentMonthlyExpenses": 6000,
    "riskTolerance": "conservative"
}
```

**Expected Score: 80-90/100**
- **Savings Rate:** 15-18/25 (lower current savings due to pre-retirement)
- **Retirement Readiness:** 18-20/20 (excellent accumulated savings)
- **Time Horizon:** 6-8/15 (7 years remaining - limited time)
- **Risk Alignment:** 11-12/12 (conservative appropriate for age)
- **Diversification:** 8-10/10 (401k, IRA, personal, cash)
- **Tax Efficiency:** 7-8/8 (excellent tax-advantaged usage)
- **Emergency Fund:** 6-7/7 (8+ months coverage)
- **Debt Management:** 3/3 (no debt assumed)

**Critical Validations:**
- [ ] USD amounts handled correctly
- [ ] Multiple retirement accounts combined
- [ ] Age-appropriate risk tolerance validation
- [ ] Currency conversion if display in ILS

---

### Scenario 4: High Earner with RSUs (Individual, Israel) 📈
**Profile:** Tech executive with stock compensation

**Input Data:**
```json
{
    "planningType": "individual",
    "currentAge": 35,
    "retirementAge": 60,
    "country": "israel",
    "currentMonthlySalary": 40000,
    "currency": "ILS",
    "rsuCompany": "AAPL",
    "rsuUnits": 100,
    "rsuFrequency": "quarterly",
    "rsuCurrentStockPrice": 190.75,
    "annualBonus": 150000,
    "currentPensionSavings": 300000,
    "currentCrypto": 100000,
    "currentPersonalPortfolio": 500000,
    "emergencyFund": 200000,
    "pensionEmployeeRate": 7,
    "pensionEmployerRate": 14.33,
    "riskTolerance": "aggressive"
}
```

**Expected Score: 85-95/100**
- **Savings Rate:** 23-25/25 (RSUs: 100 × $190.75 × 4 = $76,300/year additional)
- **Retirement Readiness:** 16-18/20 (high income, good start)
- **Time Horizon:** 12-14/15 (25 years remaining)
- **Risk Alignment:** 9-11/12 (aggressive appropriate but monitor)
- **Diversification:** 9-10/10 (stocks, crypto, pension, RSUs)
- **Tax Efficiency:** 5-7/8 (RSUs create tax complexity)
- **Emergency Fund:** 6-7/7 (good coverage)
- **Debt Management:** 3/3 (no debt)

**Critical Validations:**
- [ ] RSU calculation: 100 units × $190.75 × 4 per year
- [ ] Stock price converted from USD to ILS correctly
- [ ] Bonus included in annual income calculation
- [ ] Crypto portfolio recognized as separate asset class

---

### Scenario 5: Debt-Heavy Young Family (Couple, Israel) ⚠️
**Profile:** Young couple struggling with debt

**Input Data:**
```json
{
    "planningType": "couple",
    "currentAge": 32,
    "partnerCurrentAge": 30,
    "retirementAge": 67,
    "partnerRetirementAge": 67,
    "country": "israel",
    "partner1Salary": 12000,
    "partner2Salary": 10000,
    "currency": "ILS",
    "currentPensionSavings": 50000,
    "partnerCurrentSavings": 30000,
    "emergencyFund": 10000,
    "expenses": {
        "housing": 3000,
        "transportation": 2000,
        "food": 3000,
        "insurance": 1000,
        "other": 2000,
        "mortgage": 7000,
        "carLoan": 2000,
        "creditCard": 1500
    },
    "pensionEmployeeRate": 7,
    "pensionEmployerRate": 14.33
}
```

**Expected Score: 25-35/100**
- **Savings Rate:** 4-6/25 (minimal after debt payments)
- **Retirement Readiness:** 3-5/20 (very low savings for age)
- **Time Horizon:** 12-14/15 (35+ years remaining)
- **Risk Alignment:** 8-10/12 (limited by debt situation)
- **Diversification:** 2-4/10 (only pension savings)
- **Tax Efficiency:** 6-7/8 (pension contributions good)
- **Emergency Fund:** 1-2/7 (less than 1 month coverage)
- **Debt Management:** 0-1/3 (48% debt-to-income ratio)

**Critical Validations:**
- [ ] High debt-to-income ratio calculated correctly
- [ ] Emergency fund critically low (10k / 21.5k = 0.46 months)
- [ ] Low scores don't cause calculation errors
- [ ] Missing data modal should trigger

---

### Scenario 6: Crypto Investor (Individual, USA) ₿
**Profile:** Tech-savvy investor with crypto focus

**Input Data:**
```json
{
    "planningType": "individual",
    "currentAge": 30,
    "retirementAge": 65,
    "country": "usa",
    "currentMonthlySalary": 6000,
    "currency": "USD",
    "current401k": 50000,
    "currentCrypto": 400000,
    "cryptoReturn": 25,
    "cryptoMonthly": 2000,
    "currentPersonalPortfolio": 20000,
    "emergencyFund": 0,
    "riskTolerance": "aggressive"
}
```

**Expected Score: 55-65/100**
- **Savings Rate:** 15-18/25 (high crypto savings rate)
- **Retirement Readiness:** 8-12/20 (good for age but risky)
- **Time Horizon:** 13-15/15 (35 years remaining)
- **Risk Alignment:** 6-9/12 (too aggressive, crypto-heavy)
- **Diversification:** 5-7/10 (crypto dominates portfolio)
- **Tax Efficiency:** 4-6/8 (some 401k usage)
- **Emergency Fund:** 0/7 (critical issue)
- **Debt Management:** 3/3 (no debt)

**Critical Validations:**
- [ ] Crypto portfolio valued correctly
- [ ] High risk tolerance vs age appropriateness
- [ ] Zero emergency fund flagged as critical
- [ ] Diversification penalty for crypto concentration

---

### Scenario 7: Conservative Retiree (Individual, UK) 🇬🇧
**Profile:** Recently retired with conservative portfolio

**Input Data:**
```json
{
    "planningType": "individual",
    "currentAge": 65,
    "retirementAge": 65,
    "country": "uk",
    "monthlyPensionIncome": 3000,
    "currency": "GBP",
    "currentPersonalPortfolio": 500000,
    "personalPortfolioReturn": 4,
    "emergencyFund": 30000,
    "currentMonthlyExpenses": 2500,
    "riskTolerance": "conservative",
    "portfolioAllocation": {
        "bonds": 70,
        "stocks": 30
    }
}
```

**Expected Score: 70-80/100**
- **Savings Rate:** 10-15/25 (retired, drawing down)
- **Retirement Readiness:** 18-20/20 (successfully retired)
- **Time Horizon:** 3-5/15 (already retired)
- **Risk Alignment:** 12/12 (perfect for age)
- **Diversification:** 6-8/10 (bonds + stocks)
- **Tax Efficiency:** 5-7/8 (pension income optimization)
- **Emergency Fund:** 7/7 (12 months coverage)
- **Debt Management:** 3/3 (no debt)

**Critical Validations:**
- [ ] Retirement status handled correctly
- [ ] GBP currency conversion
- [ ] Conservative allocation appropriate
- [ ] Post-retirement scoring adjustments

---

### Scenario 8: International Worker (Individual, Multi-country) 🌍
**Profile:** Expat with multi-country work history

**Input Data:**
```json
{
    "planningType": "individual",
    "currentAge": 45,
    "retirementAge": 65,
    "country": "israel",
    "currentMonthlySalary": 20000,
    "currency": "ILS",
    "workPeriods": [
        {
            "country": "israel",
            "startAge": 35,
            "endAge": 45,
            "monthlyContribution": 3000
        },
        {
            "country": "usa",
            "startAge": 28,
            "endAge": 33,
            "monthlyContribution": 2000
        },
        {
            "country": "uk",
            "startAge": 23,
            "endAge": 28,
            "monthlyContribution": 1500
        }
    ],
    "currentPensionSavings": 400000,
    "emergencyFund": 80000
}
```

**Expected Score: 60-70/100**
- **Savings Rate:** 15-18/25 (current contributions good)
- **Retirement Readiness:** 12-16/20 (complex calculation)
- **Time Horizon:** 8-10/15 (20 years remaining)
- **Risk Alignment:** 9-11/12 (age-appropriate)
- **Diversification:** 6-8/10 (multi-country diversification)
- **Tax Efficiency:** 4-6/8 (complex multi-country taxes)
- **Emergency Fund:** 5-6/7 (good coverage)
- **Debt Management:** 3/3 (no debt)

**Critical Validations:**
- [ ] Multi-country pension calculations
- [ ] Currency conversions for different periods
- [ ] Tax efficiency across jurisdictions
- [ ] Complex work period handling

---

### Scenario 9: Minimum Data Entry ⚠️
**Profile:** User with minimal data provided

**Input Data:**
```json
{
    "planningType": "individual",
    "currentAge": 40,
    "retirementAge": 67,
    "currentMonthlySalary": 10000,
    "currency": "ILS"
}
```

**Expected Score: 15-25/100**
- **Savings Rate:** 0-5/25 (no contribution data)
- **Retirement Readiness:** 0-3/20 (no savings data)
- **Time Horizon:** 11-13/15 (27 years remaining)
- **Risk Alignment:** 0-2/12 (no portfolio data)
- **Diversification:** 0-2/10 (no asset data)
- **Tax Efficiency:** 0-2/8 (no contribution data)
- **Emergency Fund:** 0/7 (no emergency fund data)
- **Debt Management:** 2-3/3 (no debt data = good)

**Critical Validations:**
- [ ] Missing data modal triggers
- [ ] Graceful handling of missing fields
- [ ] No calculation errors with minimal data
- [ ] Clear indicators of incomplete score

---

### Scenario 10: Maximum Optimization 🏆
**Profile:** Perfectly optimized retirement plan

**Input Data:**
```json
{
    "planningType": "individual",
    "currentAge": 40,
    "retirementAge": 65,
    "country": "israel",
    "currentMonthlySalary": 30000,
    "currency": "ILS",
    "pensionEmployeeRate": 7,
    "pensionEmployerRate": 14.33,
    "trainingFundEmployeeRate": 2.5,
    "trainingFundEmployerRate": 7.5,
    "currentPensionSavings": 800000,
    "currentTrainingFund": 200000,
    "currentPersonalPortfolio": 400000,
    "currentRealEstate": 300000,
    "currentCrypto": 100000,
    "emergencyFund": 360000,
    "currentMonthlyExpenses": 20000,
    "monthlyAdditionalSavings": 3000,
    "riskTolerance": "moderate",
    "portfolioAllocation": {
        "stocks": 40,
        "bonds": 20,
        "realEstate": 20,
        "international": 15,
        "crypto": 5
    }
}
```

**Expected Score: 90-100/100**
- **Savings Rate:** 24-25/25 (excellent contribution rates)
- **Retirement Readiness:** 19-20/20 (on track for goals)
- **Time Horizon:** 10-12/15 (25 years remaining)
- **Risk Alignment:** 12/12 (perfectly balanced)
- **Diversification:** 10/10 (5+ asset classes)
- **Tax Efficiency:** 8/8 (optimal contributions)
- **Emergency Fund:** 7/7 (18 months coverage)
- **Debt Management:** 3/3 (no debt)

**Critical Validations:**
- [ ] All asset classes recognized
- [ ] Optimal allocation scored correctly
- [ ] Maximum scores don't exceed limits
- [ ] Perfect score calculations accurate

## Issues to Mitigate

### A. Data Validation Issues
**Problem:** Silent failures when fields are missing or invalid
**Root Cause:** Insufficient input validation and error handling
**Solution:**
```javascript
// Add comprehensive validation layer
function validateFinancialInputs(inputs) {
    const errors = [];
    const warnings = [];
    
    // Required fields validation
    if (!inputs.currentAge || inputs.currentAge < 18 || inputs.currentAge > 100) {
        errors.push('Valid age required (18-100)');
    }
    
    // Currency validation
    if (!['ILS', 'USD', 'EUR', 'GBP'].includes(inputs.currency)) {
        warnings.push('Unsupported currency, using ILS');
        inputs.currency = 'ILS';
    }
    
    return { isValid: errors.length === 0, errors, warnings };
}
```

### B. Score Calculation Accuracy
**Problem:** Edge cases causing NaN/Infinity values
**Root Cause:** Missing guards for division operations
**Solution:**
```javascript
// Add safe calculation wrappers
function safeDivide(numerator, denominator, fallback = 0) {
    if (!denominator || denominator === 0 || !isFinite(denominator)) {
        return fallback;
    }
    const result = numerator / denominator;
    return isFinite(result) ? result : fallback;
}

function boundScore(score, min = 0, max = 100) {
    return Math.max(min, Math.min(max, score || 0));
}
```

### C. Couple Mode Complexity
**Problem:** Partner field mapping failures leading to incorrect calculations
**Root Cause:** Complex field name variations and missing standardization
**Solution:**
```javascript
// Standardize partner field access
function getPartnerValue(inputs, fieldName, options = {}) {
    const patterns = [
        `partner1${fieldName}`,
        `partner2${fieldName}`,
        `Partner1${fieldName}`,
        `Partner2${fieldName}`
    ];
    
    let total = 0;
    let found = 0;
    
    for (const pattern of patterns) {
        const value = parseFloat(inputs[pattern]);
        if (value && isFinite(value)) {
            total += value;
            found++;
        }
    }
    
    return options.combine ? total : (found > 0 ? total / found : 0);
}
```

### D. Currency Conversion
**Problem:** Inconsistent currency handling across components
**Root Cause:** Multiple conversion points and cached rates
**Solution:**
```javascript
// Centralized currency handling
class CurrencyManager {
    constructor() {
        this.baseCurrency = 'ILS';
        this.rates = new Map();
    }
    
    async convert(amount, fromCurrency, toCurrency = this.baseCurrency) {
        if (fromCurrency === toCurrency) return amount;
        
        const rate = await this.getRate(fromCurrency, toCurrency);
        return amount * rate;
    }
    
    format(amount, currency, locale = 'he-IL') {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency
        }).format(amount);
    }
}
```

### E. Test Coverage
**Problem:** Complex scenarios not covered by automated tests
**Root Cause:** Manual testing only, no regression detection
**Solution:**
```javascript
// Automated scenario testing
describe('Financial Health Scenarios', () => {
    scenarios.forEach((scenario, index) => {
        test(`Scenario ${index + 1}: ${scenario.name}`, async () => {
            const result = calculateFinancialHealthScore(scenario.input);
            
            expect(result.totalScore).toBeGreaterThanOrEqual(scenario.expectedMin);
            expect(result.totalScore).toBeLessThanOrEqual(scenario.expectedMax);
            expect(result.totalScore).not.toBeNaN();
            expect(result.factors).toBeDefined();
            
            // Validate individual factor scores
            Object.keys(result.factors).forEach(factor => {
                expect(result.factors[factor].score).toBeGreaterThanOrEqual(0);
                expect(result.factors[factor].score).not.toBeNaN();
            });
        });
    });
});
```

## Implementation Phases

### Phase 1: Input Validation (Week 1)
**Deliverables:**
- [ ] Comprehensive validation schema
- [ ] Real-time validation feedback UI
- [ ] Missing data detection and modal
- [ ] Error message localization (Hebrew/English)

**Files to Modify:**
- `src/utils/inputValidation.js` (new)
- `src/components/shared/ValidationErrorDisplay.js` (new)
- `src/components/wizard/RetirementWizard.js`

### Phase 2: Score Calculation Fixes (Week 2)
**Deliverables:**
- [ ] Safe calculation wrappers
- [ ] Division by zero guards
- [ ] Score bounds checking
- [ ] NaN/Infinity prevention

**Files to Modify:**
- `src/utils/financialHealthEngine.js`
- `src/utils/retirementCalculations.js`
- `src/utils/safeCalculations.js` (new)

### Phase 3: Test Implementation (Week 3)
**Deliverables:**
- [ ] 10 scenario test cases
- [ ] Automated score validation
- [ ] Regression test suite
- [ ] Performance benchmarks

**Files to Create:**
- `tests/scenarios/financial-health-scenarios.test.js`
- `tests/data/test-scenarios.json`
- `tests/utils/scenario-validator.js`

### Phase 4: UI/UX Improvements (Week 4)
**Deliverables:**
- [ ] Score breakdown visualization
- [ ] Progress indicators
- [ ] Scenario comparison tool
- [ ] Enhanced error displays

**Files to Modify:**
- `src/components/shared/FinancialHealthScoreEnhanced.js`
- `src/components/analysis/ScoreBreakdown.js` (new)
- `src/components/tools/ScenarioComparison.js` (new)

### Phase 5: Documentation (Week 5)
**Deliverables:**
- [ ] Score calculation documentation
- [ ] User scenario guide
- [ ] Troubleshooting documentation
- [ ] API reference

**Files to Create:**
- `docs/scoring-methodology.md`
- `docs/user-scenarios.md`
- `docs/troubleshooting.md`
- `docs/api/financial-health-api.md`

## Success Metrics

### Quantitative Metrics
1. **Score Accuracy:** All 10 test scenarios pass with expected scores ± 5 points
2. **Error Prevention:** Zero NaN/Infinity errors in any calculation path
3. **Field Mapping:** 100% success rate for partner field combination
4. **Performance:** Score calculation completes in < 500ms for complex scenarios
5. **Test Coverage:** 95%+ code coverage for financial calculations

### Qualitative Metrics
1. **User Experience:** Clear error messages for all validation failures
2. **Reliability:** Couple mode calculations match individual mode accuracy
3. **Transparency:** Users understand how their score is calculated
4. **Accessibility:** All scoring features work in Hebrew and English
5. **Maintainability:** New scenarios can be added without code changes

## Risk Assessment

### High Risk
- **Field mapping failures in couple mode** - Could affect 40%+ of users
- **Currency conversion errors** - Affects international users and RSU calculations
- **Score calculation edge cases** - Could cause app crashes

### Medium Risk
- **Missing data handling** - Affects user experience but not calculations
- **Performance with complex scenarios** - May cause delays but not errors
- **Documentation gaps** - Affects maintainability but not functionality

### Low Risk
- **UI/UX improvements** - Optional enhancements
- **Additional test scenarios** - Nice to have but core 10 cover main cases

## Conclusion

This comprehensive audit and test plan addresses critical issues in the Advanced Retirement Planner's financial health scoring system. The 10 detailed scenarios cover the full spectrum of user types and edge cases, ensuring robust validation of the application's accuracy and reliability.

The phased implementation approach allows for systematic improvement while maintaining system stability. Regular testing against these scenarios will prevent regressions and ensure consistent scoring accuracy as the application evolves.

---

**Next Steps:**
1. Review and approve this plan
2. Begin Phase 1 implementation
3. Set up automated testing infrastructure
4. Schedule weekly progress reviews

**Dependencies:**
- Access to production data for baseline validation
- Approval for UI changes in Phase 4
- Translation resources for Hebrew error messages

**Completion Criteria:**
- All 10 scenarios pass automated tests
- Zero critical calculation errors
- Documentation complete and reviewed
- Performance benchmarks met