# Release Notes - v7.5.1

## Critical Issues Fixed

### 1. **Portfolio Tax Calculation in Couple Mode** ✅
- **Issue**: Personal portfolio tax changes not updating net value in couple mode
- **Fix**: Enhanced cache invalidation to include tax rate changes
- **Files Modified**: `src/components/wizard/steps/WizardStepSavings.js`
- **Implementation**: Added `taxRate` to conversion cache state for proper invalidation

### 2. **Financial Health Score Components** ✅
- **Issue**: Savings Rate and Tax Efficiency showing 0% in couple mode
- **Fix**: Corrected partner field mappings to match actual field names
- **Files Modified**: `src/utils/financialHealthFieldPatch.js`
- **Field Corrections**:
  - `partner1EmployeeRate` (not `partner1PensionEmployeeRate`)
  - `partner1TrainingFundRate` (not `partner1TrainingFundEmployeeRate`)
  - Same pattern for partner2

### 3. **Component Scores Calculations** ✅
- **Issue**: Total accumulation and monthly income showing ₪0
- **Fix**: Added fallback getAllInputs function and fixed field mappings
- **Files Modified**: 
  - `src/components/wizard/steps/WizardStepReview.js`
  - `src/utils/wizardDataHelper.js`
- **Implementation**: Direct localStorage access when React props unavailable

### 4. **Retirement Projection Data** ✅
- **Issue**: "Missing data for projection calculation" despite having data
- **Fix**: Corrected chart data structure validation
- **Files Modified**: `src/components/review/RetirementProjectionPanel.js`
- **Implementation**: Check for array instead of projections property

### 5. **Monthly Income Calculation** ✅
- **Issue**: Only showing salary, not including bonuses/RSUs/other income
- **Fix**: Comprehensive income aggregation including all sources
- **Files Modified**: `src/components/wizard/steps/WizardStepReview.js`
- **Implementation**: Added bonuses (annual/12), RSUs (quarterly/3), freelance, rental, dividends

## Production Hotfixes Available

### Quick Fix Script
```javascript
// Run in browser console if issues persist
fetch('https://raw.githubusercontent.com/ypollak2/advanced-retirement-planner/main/production-fix-getAllInputs.js')
  .then(r => r.text())
  .then(eval);
```

## Testing Results
- **All 374 unit tests passing** ✅
- **E2E tests created** for production validation
- **Manual test scripts** available for each issue

## Known Issues Being Monitored
1. Portfolio tax reactivity may need page refresh in some cases
2. Component scores require getAllInputs function (now has fallback)
3. Financial health calculations depend on correct field mappings

## Deployment Status
- Version 7.5.1 deployed to production
- All critical fixes included
- Backward compatibility maintained

## Next Steps
1. Monitor production for any edge cases
2. Gather user feedback on fixes
3. Plan v7.5.2 for any remaining issues