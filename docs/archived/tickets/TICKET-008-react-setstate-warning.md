# TICKET-008: React setState Warning Optimization

## Issue Description
**Warning:** `Cannot update a component (ConsoleLogExporter) while rendering a different component (WizardStepSalary)`

**Priority:** Low (Non-critical, no user impact)
**Type:** Performance optimization / React best practices

## Root Cause Analysis

The warning occurs when the WizardStepSalary component triggers console.log() calls during its render cycle, which are intercepted by the ConsoleLogExporter component that tries to update its state during the render of another component.

### Potential Triggers:
1. `calculateTotalIncome()` function calls during render
2. Tax calculation debug logs in `AdditionalIncomeTax.getMonthlyAfterTaxAdditionalIncome()`
3. Currency validation logs in financial calculations
4. Partner field mapping debug logs

## Technical Analysis

### Current Architecture:
- ConsoleLogExporter intercepts all console.log() calls
- WizardStepSalary performs calculations during render
- Tax calculations include debug logging
- React detects cross-component state updates during render

### React Best Practices Violation:
- State updates should not happen during render cycles
- Console logging during render can trigger this warning
- Performance impact: potential render loop or delayed logging

## Proposed Solutions

### Option 1: Move Calculations to useEffect (Recommended)
```javascript
// BEFORE: Calculations during render
const calculateTotalIncome = () => {
    // Calculations with console.log() calls
    console.log('🧮 Calculating income...', data);
    return result;
};

// AFTER: Calculations in useEffect
React.useEffect(() => {
    const result = calculateTotalIncome();
    setTotalIncome(result);
}, [inputs]);
```

### Option 2: Debounce Console Logging
```javascript
const deferredLog = (message, data) => {
    setTimeout(() => {
        console.log(message, data);
    }, 0);
};
```

### Option 3: Conditional Development Logging
```javascript
const isDev = window.location.hostname === 'localhost';
if (isDev && !isRendering) {
    console.log('Debug info:', data);
}
```

### Option 4: Memoize Expensive Calculations
```javascript
const totalIncome = React.useMemo(() => {
    return calculateTotalIncome(inputs);
}, [inputs.partner1Salary, inputs.partner2Salary, inputs.annualBonus]);
```

## Implementation Plan

### Phase 1: Analysis (30 minutes)
1. Identify all console.log() calls in WizardStepSalary component
2. Map which calculations trigger the warning
3. Profile render performance impact

### Phase 2: Quick Fix (15 minutes)
1. Wrap debug logs in setTimeout (Option 2)
2. Test that warning disappears
3. Verify functionality unchanged

### Phase 3: Proper Solution (1 hour)
1. Move income calculations to useEffect (Option 1)
2. Implement useMemo for expensive calculations (Option 4)
3. Add proper dependency arrays
4. Test couple mode and individual mode

### Phase 4: Validation (15 minutes)
1. Run full test suite (302 tests)
2. Verify no React warnings in console
3. Performance testing with React DevTools

## Success Criteria

### ✅ Primary Goals:
- [ ] No React setState warnings in console
- [ ] All 302 tests still passing
- [ ] No functional changes to income calculations
- [ ] Performance improvement or neutral

### ✅ Secondary Goals:
- [ ] Cleaner React component architecture
- [ ] Better separation of calculation and rendering logic
- [ ] Improved development debugging experience

## Risk Assessment

### Low Risk:
- Warning is non-critical (no user impact)
- Can be fixed with minimal code changes
- Unlikely to introduce bugs

### Mitigation:
- Comprehensive testing after changes
- Rollback plan: revert to current working state
- Test in both development and production modes

## Timeline Estimate
- **Total Time:** 2 hours
- **Complexity:** Low-Medium
- **Dependencies:** None (independent of TICKET-007)

## Notes
- This optimization can be implemented separately from TICKET-007
- No urgency - can be scheduled for next maintenance cycle
- Good opportunity to improve React best practices across the app

---

**Status:** Ready for implementation when time permits
**Assigned:** Available for future sprint
**Dependencies:** None