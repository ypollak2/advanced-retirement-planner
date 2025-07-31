# TICKET-009: Financial Health Score Field Mapping Issue

**Priority**: Critical  
**Status**: In Progress  
**Created**: 2025-07-31  
**Assignee**: Claude Code

## Problem Summary

User is experiencing a Financial Health Score calculation failure:
- **Actual Score**: 31/100
- **Expected Score**: 70-80
- **Key Issue**: Savings Rate showing 0/25 instead of expected value
- **Root Cause**: Field mapping failures in `getFieldValue()` function

## User Impact

- **Severity**: High - Core feature not working correctly
- **Affected Users**: Anyone using Financial Health Score feature
- **Business Impact**: Users getting incorrect financial advice/scores

## Technical Analysis

### Field Mapping System Investigation

1. **getFieldValue() Function Issues**
   - Searches for income fields using predefined field name lists
   - Individual mode: `currentMonthlySalary`, `monthlySalary`, `salary`, etc.
   - Couple mode: `partner1Salary`, `partner2Salary`, etc.
   - **Problem**: If form field names don't match patterns → income = 0

2. **Planning Type Logic**
   - Different search logic for `individual` vs `couple` modes
   - Mismatch between actual planning type and field search patterns

3. **Contribution Calculation Failure**
   - System requires: pension rates, training fund rates, or direct contributions
   - Missing data chain: No income → No contributions → Savings Rate = 0 → Score = 0/25

### Console Error Patterns Expected

```javascript
console.warn('❌ FINANCIAL HEALTH SCORE: No monthly income found');
console.warn('🔍 Available income-related fields:', [...]);
console.warn('📋 Planning type:', inputs.planningType);
```

## Implementation Plan

### Phase 1: Diagnostic Tools ⚡ **HIGH PRIORITY**

#### 1.1 Create Enhanced Debug Tool
**File**: `debug-field-mapping.js`
- Log all available input fields
- Test field mapping against known patterns
- Show field discovery results
- Test both individual and couple modes

#### 1.2 Create Financial Health Debug Panel
**File**: Update existing debug components
- Real-time field mapping visualization
- Step-by-step calculation display
- Actual vs expected field name comparison

### Phase 2: Field Mapping Fixes ⚡ **HIGH PRIORITY**

#### 2.1 Analyze Form Field Names
**Target Files**: Wizard step components
- `src/components/wizard/steps/WizardStepSalary.js`
- `src/components/wizard/steps/WizardStepSavings.js`
- `src/components/wizard/steps/WizardStepContributions.js`

#### 2.2 Expand Field Mapping Dictionary
**File**: `src/utils/fieldMappingDictionary.js`
- Add missing field name variations
- Include form-specific patterns
- Add couple-mode specific mappings

#### 2.3 Fix getFieldValue() Logic
**File**: `src/utils/financialHealthEngine.js`
- Improve field matching algorithms
- Fix couple mode field combination
- Add better fallback mechanisms

### Phase 3: Calculation Engine Fixes 🔧 **MEDIUM PRIORITY**

#### 3.1 Savings Rate Calculation
- Ensure proper income detection
- Fix contribution rate calculations  
- Improve training fund threshold logic

#### 3.2 Input Validation & Sanitization
- Validate input data structure
- Handle missing/malformed data gracefully
- Add data type conversion safeguards

### Phase 4: Testing & Validation 🧪 **MEDIUM PRIORITY**

#### 4.1 Comprehensive Test Scenarios
- Test various input patterns
- Test individual vs couple modes
- Test edge cases and missing data

#### 4.2 Browser-Based Testing Tool
**File**: `test-financial-health-field-mapping.html`
- Interactive test runner
- Real wizard data testing
- Score calculation validation

### Phase 5: User Experience 🎨 **LOW PRIORITY**

#### 5.1 Better Error Messages
- Show users missing fields
- Provide specific improvement guidance
- Add field mapping diagnostics to UI

#### 5.2 Debug Console Integration
- Add debug mode with `?debug=true`
- Show field mapping results
- Export diagnostic data

## Files to Create

### New Files
```
debug-field-mapping.js                           # Diagnostic tool
test-financial-health-field-mapping.html        # Browser test tool
plans/TICKET-009-financial-health-field-mapping-fix.md  # This file
```

### Files to Modify
```
src/utils/fieldMappingDictionary.js             # Expand field mappings
src/utils/financialHealthEngine.js              # Fix getFieldValue() logic
tests/financial-health-test.js                  # Add field mapping tests
src/components/shared/FinancialHealthScoreEnhanced.js  # Better error display
```

## Success Criteria

### Definition of Done
- [ ] **Primary Goal**: User gets expected 70-80 score with proper data
- [ ] **Key Metric**: Savings Rate shows proper percentage (not 0/25)
- [ ] **Diagnostic**: Field mapping tool shows 100% field detection rate
- [ ] **Regression**: All 374 existing tests continue to pass
- [ ] **Compatibility**: Both couple and individual modes work correctly

### Testing Validation
- [ ] Manual testing with various user input patterns
- [ ] Automated tests for field mapping scenarios
- [ ] Browser-based interactive testing tool
- [ ] Production console log analysis (if needed)

## Risk Assessment

### High Risk
- **Breaking Changes**: Modifying core financial calculation logic
- **Test Failures**: Field mapping changes affecting existing functionality
- **Performance**: Additional field searching may impact performance

### Mitigation Strategies
- **Incremental Changes**: Implement fixes in small, testable increments
- **Comprehensive Testing**: Run full 374-test suite after each change
- **Fallback Logic**: Maintain backward compatibility with existing field patterns
- **Debug Logging**: Extensive logging for production troubleshooting

## Rollback Plan

If issues arise:
1. **Immediate**: Revert `financialHealthEngine.js` to previous version
2. **Diagnostic**: Use debug tool to analyze field mapping issues
3. **Selective Rollback**: Revert specific functions while keeping improvements
4. **Hotfix**: Deploy targeted fixes for critical issues

## Timeline Estimate

- **Phase 1 (Diagnostic)**: 2-3 hours
- **Phase 2 (Field Mapping)**: 3-4 hours  
- **Phase 3 (Calculations)**: 2-3 hours
- **Phase 4 (Testing)**: 3-4 hours
- **Phase 5 (UX)**: 2-3 hours

**Total Estimate**: 12-17 hours over 2-3 days

## Dependencies

### Technical Dependencies
- Financial Health Engine system understanding
- Form field name conventions
- Wizard component data flow
- Test framework compatibility

### Business Dependencies
- User availability for testing validation
- Production console log access (if needed)
- QA sign-off on calculation changes

## Notes

### Discovery Questions
1. What specific input data did the user enter?
2. Was this individual or couple planning mode?
3. Are there console error messages available?
4. Has this issue been reported by other users?

### Technical Considerations
- Field mapping system is complex with many fallback layers
- Changes may affect other calculation components
- Couple mode has additional complexity for partner field combination
- Backward compatibility with existing saved data important

---

**Last Updated**: 2025-07-31  
**Next Review**: After Phase 1 completion  
**Ticket Priority**: Critical - User experience issue with core feature