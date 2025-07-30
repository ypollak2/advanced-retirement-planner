# TICKET-007: Fix Financial Health Score Correlation Issues

**Status:** PLANNED
**Priority:** HIGH
**Created:** 2025-01-30
**Category:** Bug Fix - Financial Health Scoring

## Problem Statement

The financial health scoring system is showing 0% scores for critical metrics (Savings Rate, Retirement Readiness, Risk Alignment, Tax Efficiency) despite the user having entered valid salary and financial data. This creates a confusing user experience where:

1. The Additional Income Tax Analysis shows correct calculations (₪19,800 gross, ₪13,254 net)
2. The Expense Analysis shows 0% expense-to-income ratio (excellent)
3. Component scores show valid data (Monthly Income: ₪13,254)
4. Yet the Financial Health Score shows 31/100 (Critical) with "Missing required data" errors

## Root Cause Analysis

### 1. Field Name Mismatch
- **Wizard Components** save data with specific field names:
  - `partner1NetSalary`, `partner2NetSalary` (NET values)
  - `partner1BonusAmount`, `partner2BonusAmount`
  - `partner1OtherIncome`, `partner2OtherIncome`

- **Financial Health Engine** expects different field names:
  - `partner1Salary`, `partner2Salary` (GROSS values expected)
  - `currentMonthlySalary`, `monthlySalary`
  - Doesn't properly handle bonus and other income in calculations

### 2. Net vs Gross Confusion
- The wizard is calculating and storing NET salary values
- The financial health engine expects GROSS salary values for savings rate calculations
- This causes the income to appear as 0 in the scoring engine

### 3. Missing Contribution Rate Data
- The scoring engine looks for `pensionContributionRate`, `trainingFundContributionRate`
- These fields may not be properly set when using couple planning mode

## Implementation Plan

### Phase 1: Add Field Mapping Enhancement
1. **Update `financialHealthEngine.js`** - Add comprehensive field mapping for couple mode:
   ```javascript
   // Add to getFieldValue() enhanced mappings
   const coupleGrossIncomeMapping = {
     'partner1GrossSalary': ['partner1GrossSalary', 'partner1Salary', 'Partner1Salary'],
     'partner2GrossSalary': ['partner2GrossSalary', 'partner2Salary', 'Partner2Salary'],
     'partner1NetSalary': ['partner1NetSalary', 'partner1NetIncome'],
     'partner2NetSalary': ['partner2NetSalary', 'partner2NetIncome']
   };
   ```

2. **Create gross salary calculation from net**:
   - If only net salary is available, calculate gross using reverse tax calculation
   - Use the tax tables already available in TaxCalculators.js

### Phase 2: Fix Income Calculation Logic
1. **Update `calculateSavingsRateScore()`**:
   - Add logic to handle both gross and net salary fields
   - Include bonus and other income in total income calculation
   - Properly aggregate all income sources

2. **Update contribution rate detection**:
   - Look for partner-specific contribution rates
   - Use default rates if not specified (as shown in the UI)

### Phase 3: Add Comprehensive Testing
1. **Create test scenarios**:
   - Couple with gross salaries only
   - Couple with net salaries only
   - Couple with bonus and other income
   - Validation that scores are calculated correctly

2. **Add debug logging**:
   - Log all field mappings attempted
   - Log calculation steps
   - Make it easy to diagnose future issues

### Phase 4: Update Related Components
1. **Update `WizardStepSalary.js`**:
   - Ensure it saves BOTH gross and net values
   - Add gross salary calculation if only net is entered

2. **Update `WizardStepReview.js`**:
   - Ensure all financial data is properly passed to scoring engine
   - Add validation for required fields

### Phase 5: Implement Fallback Calculations
1. **Add intelligent defaults**:
   - If pension rate not found, use standard 17.5%
   - If training fund rate not found, use standard 7.5%
   - Calculate savings rate from actual pension/training fund amounts if rates missing

## Success Criteria

1. Financial Health Score correctly reflects entered data
2. No "Missing required data" errors when salary information is provided
3. Scores are consistent across all views:
   - Financial Health Score panel
   - Additional Income Tax Analysis
   - Expense Analysis
   - Component Scores

## Testing Checklist

- [ ] Test with couple mode - both partners with gross salaries
- [ ] Test with couple mode - both partners with net salaries only
- [ ] Test with individual mode - gross salary
- [ ] Test with individual mode - net salary only
- [ ] Test with bonus income included
- [ ] Test with other income included
- [ ] Test with RSU income
- [ ] Verify all scores calculate correctly
- [ ] Verify no console errors
- [ ] Test data persistence (reload page, scores remain correct)

## Files to Modify

1. `/src/utils/financialHealthEngine.js` - Main scoring logic
2. `/src/components/wizard/steps/WizardStepSalary.js` - Salary input handling
3. `/src/components/wizard/steps/WizardStepReview.js` - Review calculations
4. `/tests/test-financial-health-scoring.js` - New test file

## Rollback Plan

If issues arise:
1. Revert changes to financialHealthEngine.js
2. Clear localStorage to reset any corrupted data
3. Use previous version's field mappings

## Notes

- This is a critical user-facing issue affecting the core value proposition
- The fix should be backward compatible with existing saved data
- Consider adding a data migration utility for users with saved incomplete data