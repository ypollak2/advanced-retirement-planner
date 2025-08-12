# TICKET-002: Enhanced Investment Tax Handler for Personal Portfolio

## Overview
Enhance the existing Personal Portfolio tax calculation feature to provide real-time currency conversion, improved UX, and better integration with the global currency system. The feature is already partially implemented but needs refinement for production readiness.

## Current State Analysis
- ✅ Tax input fields already exist in WizardStepSavings.js
- ✅ Net value calculation is implemented (portfolio * (1 - tax/100))
- ✅ Default 25% tax rate is set
- ✅ Works for individual and couple modes
- ❌ Missing real-time currency conversion
- ❌ Tax field validation could be improved
- ❌ UX needs enhancement (better spacing, formatting)

## Detailed Implementation Plan

### Step 1: Enhance Tax Input Validation
**File**: `src/components/wizard/steps/WizardStepSavings.js`
**Changes**:
- Add input validation for tax percentage (0-60% range)
- Add real-time validation feedback
- Improve error handling for invalid inputs
- Add tooltip explaining tax calculation

### Step 2: Implement Real-time Currency Conversion
**File**: `src/components/wizard/steps/WizardStepSavings.js`
**Changes**:
- Integrate with existing `CurrencyAPI` class
- Convert net portfolio value to user's selected currency
- Add loading states during currency conversion
- Implement fallback to cached rates if API fails
- Update `formatCurrency` function to use converted values

### Step 3: Improve User Experience
**File**: `src/components/wizard/steps/WizardStepSavings.js`
**Changes**:
- Add smooth animations when tax fields appear
- Improve visual hierarchy (better spacing, colors)
- Add percentage slider as alternative to text input
- Show calculation breakdown tooltip
- Add currency indicator next to net value

### Step 4: Enhance Multi-language Support
**File**: `src/components/wizard/steps/WizardStepSavings.js`
**Changes**:
- Add Hebrew translations for new tax-related messages
- Include validation error messages in both languages
- Add currency-specific formatting (locale-aware)

### Step 5: Update Currency Integration
**File**: `src/utils/currencyAPI.js` (if needed)
**Changes**:
- Ensure portfolio tax calculations use the same FX rates
- Add specific method for portfolio value conversion
- Implement caching for tax calculation results

### Step 6: Add Comprehensive Testing
**Files**: 
- `tests/unit/wizardStepSavings.test.js` (new)
- `tests/scenarios/portfolio-tax-scenarios.test.js` (new)
**Changes**:
- Unit tests for tax calculation logic
- Integration tests with currency API
- Edge case testing (0%, 60%, invalid inputs)
- Cross-currency conversion accuracy tests

## Technical Specifications

### Tax Calculation Formula
```javascript
netValue = portfolioValue * (1 - taxRate / 100)
convertedNetValue = await currencyAPI.convert(netValue, 'ILS', userCurrency)
```

### Input Field Specifications
- **Type**: Number input with step="0.1"
- **Range**: 0-60 (validated)
- **Default**: 25%
- **Placeholder**: "25" (localized)
- **Format**: Percentage with % symbol

### Currency Display Format
- **Individual Mode**: "After Tax Value: $12,345"
- **Couple Mode**: "Net: $12,345" (compact format)
- **Loading State**: "Calculating..." with spinner
- **Error State**: "Using cached rate" with warning icon

### Visual Design Enhancements
- **Tax Input**: Smaller, inline with portfolio input
- **Net Value**: Highlighted with colored background
- **Animation**: Fade-in when portfolio value > 0
- **Spacing**: Consistent 8px margins between elements

## Implementation Order
1. **Phase 1**: Enhance validation and error handling
2. **Phase 2**: Implement real-time currency conversion
3. **Phase 3**: Improve UI/UX and animations
4. **Phase 4**: Add comprehensive testing
5. **Phase 5**: Update documentation and translations

## Testing Strategy
- Test with different currencies (ILS, USD, EUR, GBP)
- Test edge cases (0% tax, 60% tax, invalid inputs)
- Test offline behavior (fallback to cached rates)
- Test couple vs individual mode calculations
- Test rapid input changes (debounced calculations)

## Success Criteria
- ✅ Tax input appears when portfolio value > 0
- ✅ Net value updates in real-time
- ✅ Currency conversion works for all supported currencies
- ✅ Validation prevents invalid tax percentages
- ✅ UI is responsive and visually appealing
- ✅ Feature works identically in couple and individual modes
- ✅ All tests pass with 100% coverage

## Files to Modify
- `src/components/wizard/steps/WizardStepSavings.js` (main implementation)
- `tests/unit/wizardStepSavings.test.js` (new - unit tests)
- `tests/scenarios/portfolio-tax-scenarios.test.js` (new - integration tests)

## Estimated Completion Time
- Development: 2-3 hours
- Testing: 1 hour
- Documentation: 30 minutes
- **Total**: 3.5-4.5 hours

## Dependencies
- Existing `CurrencyAPI` class
- Existing `formatCurrency` function
- React.createElement pattern (no JSX)
- Multi-language support system

## Rollback Plan
If issues arise, the feature can be disabled by:
1. Removing tax input visibility conditions
2. Reverting to simple portfolio display
3. Rolling back to previous commit

## Notes
- Feature is already 70% implemented, needs enhancement
- Must maintain React.createElement pattern (no JSX)
- Must preserve existing couple mode functionality
- Currency conversion should be cached for performance

## Progress Tracking
- [ ] Phase 1: Enhance validation and error handling
- [ ] Phase 2: Implement real-time currency conversion  
- [ ] Phase 3: Improve UI/UX and animations
- [ ] Phase 4: Add comprehensive testing
- [ ] Phase 5: Update documentation

## Date Created: July 29, 2025
## Assigned To: Claude Code Assistant
## Priority: High
## Status: In Progress