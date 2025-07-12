# Component Props System - Advanced Retirement Planner

## 🚨 CRITICAL: Component Prop Management

This document outlines the critical prop passing system to prevent `ReferenceError: variable is not defined` errors in React components.

## ⚡ Key Rule

**ALL calculated values used within components MUST be passed as props from the parent scope.**

## 📋 Component Prop Requirements

### SavingsSummaryPanel Component

**Required Props:**
- `inputs` - User input data
- `language` - Current language ('he'/'en')
- `t` - Translation object
- `totalMonthlySalary` - Calculated total monthly salary
- `yearsToRetirement` - Calculated years until retirement
- `estimatedMonthlyIncome` - Calculated monthly income at retirement
- `projectedWithGrowth` - Projected savings with growth
- `buyingPowerToday` - Today's buying power value
- `monthlyTotal` - Total monthly contributions
- `avgNetReturn` - Average net return percentage

**Safe Fallbacks:** Each prop has a fallback calculation in the component to ensure robust operation.

### BottomLineSummary Component

**Required Props:**
- `inputs` - User input data
- `language` - Current language
- `totalMonthlySalary` - Calculated total monthly salary
- `yearsToRetirement` - Calculated years until retirement
- `estimatedMonthlyIncome` - Calculated monthly income at retirement
- `projectedWithGrowth` - Projected savings with growth
- `buyingPowerToday` - Today's buying power value
- `formatCurrency` - Currency formatting function

## 🔧 How to Add New Calculated Values

### 1. Calculate in Parent Scope
```javascript
// In RetirementPlannerCore, around line 1805
const newCalculatedValue = someCalculation(inputs);
```

### 2. Pass as Prop
```javascript
React.createElement(SavingsSummaryPanel, {
    // ... existing props
    newCalculatedValue  // Add new prop
});
```

### 3. Update Component Definition
```javascript
const SavingsSummaryPanel = ({ 
    inputs, language, t, /* ... existing props */, 
    newCalculatedValue  // Add to destructuring
}) => {
```

### 4. Add Safe Fallback
```javascript
const safeNewCalculatedValue = newCalculatedValue || defaultCalculation(inputs);
```

### 5. Use Safe Variable
```javascript
// Use safeNewCalculatedValue instead of newCalculatedValue
formatCurrency(safeNewCalculatedValue)
```

## 🚫 Common Mistakes to Avoid

### ❌ DON'T: Reference parent scope variables directly
```javascript
const SavingsSummaryPanel = ({ inputs, language }) => {
    // This will cause ReferenceError!
    return formatCurrency(avgNetReturn); 
};
```

### ✅ DO: Pass as prop and use safe fallback
```javascript
const SavingsSummaryPanel = ({ inputs, language, avgNetReturn }) => {
    const safeAvgNetReturn = avgNetReturn || defaultCalculation(inputs);
    return formatCurrency(safeAvgNetReturn);
};
```

## 🧪 Testing Component Props

When testing components, ensure all calculated props are provided:

```javascript
React.createElement(SavingsSummaryPanel, {
    inputs: testInputs,
    language: 'he',
    t: testTranslations,
    totalMonthlySalary: 15000,
    yearsToRetirement: 37,
    estimatedMonthlyIncome: 5000,
    projectedWithGrowth: 2500000,
    buyingPowerToday: 1200000,
    monthlyTotal: 2790,
    avgNetReturn: 6.2
});
```

## 🔍 Debugging Undefined Variables

If you encounter `ReferenceError: variableName is not defined`:

1. **Check if variable is calculated in parent scope** (around line 1805)
2. **Verify it's passed as prop** in `React.createElement()` call
3. **Ensure it's in component destructuring** `({ ..., variableName })`
4. **Add safe fallback** `const safeVariableName = variableName || default`
5. **Use safe variable** in component JSX

## 📚 Related Files

- `/src/core/app-main.js` - Main component definitions and prop passing
- `/TESTING_WIKI.md` - Testing procedures for component props
- `/SECURITY_WIKI.md` - Security considerations for prop validation

---

**Last Updated**: July 11, 2025  
**Related Issues**: Fixed `avgNetReturn` and `monthlyTotal` undefined errors  
**Next Review**: When adding new calculated values