# Advanced Retirement Planner - Current Issues List

**Generated**: 2025-08-11  
**Application Version**: 7.5.10  
**Test Status**: All 374 tests passing ✅

## 🚨 Critical Issues (High Priority)

### 1. **Partner RSU Fields Missing in Couple Mode**
- **Impact**: Couples cannot enter RSU (Restricted Stock Units) data for both partners
- **Location**: WizardStepSalary component
- **User Story**: Tech employees with RSUs cannot properly plan as a couple
- **Recommendation**: Add partner1RSUUnits, partner2RSUUnits fields and UI

### 2. **Currency Conversion Errors**
- **Impact**: Incorrect financial calculations for non-ILS currencies
- **Symptoms**: NaN or incorrect values when switching currencies
- **Related**: Division by zero errors in currency rate calculations
- **Recommendation**: Validate currency rates before division, add fallback rates

### 3. **Partner Field Mapping Issues**
- **Impact**: Partner data not properly processed in couple mode
- **Location**: financialHealthEngine.js field mapping
- **Symptoms**: Missing or incorrect partner data in calculations
- **Recommendation**: Review and fix partner field mapping logic

## ⚠️ Medium Priority Issues

### 4. **LocalStorage Progress Not Restored**
- **Impact**: Users lose wizard progress when refreshing page
- **Location**: RetirementWizard.js localStorage handling
- **Expected**: Progress should restore from localStorage on page load
- **Actual**: Data saved but not loaded back

### 5. **Missing Data Modal Not Triggering**
- **Impact**: Users don't get prompted to complete missing required data
- **Location**: FinancialHealthScoreEnhanced.js modal trigger
- **Expected**: Modal should appear when clicking "Complete Missing Data"
- **Actual**: Modal state not updating properly

### 6. **API Timeout Handling**
- **Impact**: Application hangs or shows errors when external APIs fail
- **APIs Affected**: Yahoo Finance (stock prices), Currency conversion APIs
- **Recommendation**: Implement proper timeout handling and user feedback

### 7. **Net > Gross Salary Validation**
- **Impact**: Users can enter illogical values (net salary higher than gross)
- **Location**: Manual salary entry fields
- **Recommendation**: Add validation to ensure net <= gross

## 📱 Low Priority Issues

### 8. **Mobile Touch Targets Too Small**
- **Impact**: Accessibility issue on mobile devices
- **Standard**: Touch targets should be minimum 44px
- **Location**: Various buttons throughout the app
- **Recommendation**: Review and increase button sizes

### 9. **Age Validation Accepts Invalid Values**
- **Impact**: Users can enter 0 or negative ages
- **Location**: Age input fields in wizard
- **Recommendation**: Add minimum age validation (e.g., >= 18)

### 10. **Tailwind CSS CDN 404 Error**
- **Impact**: Minor - app has fallback CSS
- **URL**: https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css
- **Recommendation**: Update to working CDN or bundle Tailwind locally

## 📊 Test & Documentation Issues

### 11. **Test Count Documentation Inconsistency**
- **Issue**: Docs mention 302, 374, and 245 tests in different places
- **Actual**: 374 tests currently
- **Recommendation**: Update all documentation to reflect correct test count

### 12. **Open Development Tickets**
- Multiple TICKET-XXX files in plans/ folder indicate ongoing work
- Tickets: 001, 002, 003, 005, 006, 008, 009
- **Recommendation**: Review and close completed tickets

## 🎯 Action Items Summary

1. **Immediate Fixes Needed**:
   - Add Partner RSU fields for couple mode
   - Fix currency conversion validation
   - Repair LocalStorage restore functionality

2. **Quality of Life Improvements**:
   - Improve API error handling
   - Fix Missing Data Modal trigger
   - Add proper input validations

3. **Technical Debt**:
   - Update documentation for consistency
   - Clean up completed ticket files
   - Improve mobile accessibility

## 🔍 Monitoring Recommendations

1. **Enable Debug Mode**: Use `?debug=true` to capture console logs
2. **Watch for Common Errors**:
   - Division by zero
   - Missing required fields (undefined/0)
   - Currency conversion failures
   - Partner field mapping errors

3. **Test Scenarios**:
   - Test couple mode thoroughly
   - Test with different currencies
   - Test API failures (offline mode)
   - Test on mobile devices

## ✅ Recent Fixes (Monitor for Regression)

- RSU tax rate input improvements
- Manual entry income calculations
- NaN values in formatCurrency
- Component initialization errors
- Couple mode critical fixes

---

**Note**: Despite these issues, all 374 automated tests are passing, indicating that core functionality is stable. These issues represent edge cases, UX improvements, and specific user flows that need attention.