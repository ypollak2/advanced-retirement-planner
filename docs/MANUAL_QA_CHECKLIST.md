# Manual QA Checklist - Training Fund Updates

## Pre-Push Validation Checklist

### ✅ Logic Testing (Automated - PASSED)
- [x] Training fund calculation logic (2.5% + 7.5% = 10%)
- [x] Ceiling implementation (₪15,972)
- [x] Above ceiling contribution option
- [x] No training fund option
- [x] Future value calculations
- [x] Input validation

### 🎯 Manual UI Testing Required

#### 1. Training Fund Form Elements
- [ ] **Training Fund Checkbox**: Verify "Include Training Fund" checkbox exists and works
  - Test: Uncheck should set contribution to ₪0
  - Test: Check should calculate proper contribution
  
- [ ] **Above Ceiling Checkbox**: Verify "Contribute Above Ceiling" checkbox exists and works
  - Test: With ₪20,000 salary, should show ₪1,597 when unchecked
  - Test: With ₪20,000 salary, should show ₪2,000 when checked

#### 2. Calculation Accuracy
- [ ] **Under Ceiling Test**: 
  - Set salary: ₪10,000
  - Expected training fund: ₪1,000 (10%)
  
- [ ] **At Ceiling Test**:
  - Set salary: ₪15,972 (exact ceiling)
  - Expected training fund: ₪1,597.20 (10%)
  
- [ ] **Above Ceiling Test (Standard)**:
  - Set salary: ₪20,000
  - Uncheck "Contribute Above Ceiling"
  - Expected training fund: ₪1,597.20 (10% of ceiling only)
  
- [ ] **Above Ceiling Test (Full)**:
  - Set salary: ₪20,000
  - Check "Contribute Above Ceiling"
  - Expected training fund: ₪2,000 (10% of full salary)

#### 3. Results Display
- [ ] **Training Fund Results**: Verify training fund savings are displayed correctly in results
- [ ] **Total Savings**: Verify pension + training fund = total savings
- [ ] **Currency Formatting**: Verify proper ₪ symbol and number formatting

#### 4. Language Support
- [ ] **Hebrew Labels**: Check Hebrew text for training fund elements
- [ ] **English Labels**: Check English text for training fund elements
- [ ] **Language Toggle**: Verify language switching works properly

#### 5. Edge Cases
- [ ] **Zero Salary**: Set salary to ₪0, training fund should be ₪0
- [ ] **Maximum Values**: Test with very high salaries (₪100,000+)
- [ ] **Decimal Values**: Test with salary like ₪15,500.50

#### 6. Integration Testing
- [ ] **Complete Calculation**: Fill all fields, verify final retirement projections
- [ ] **Chart Display**: If charts exist, verify training fund is included
- [ ] **Export Functions**: Test any export functionality includes training fund

#### 7. Browser Compatibility
- [ ] **Chrome**: Test in Chrome browser
- [ ] **Firefox**: Test in Firefox browser
- [ ] **Safari**: Test in Safari browser
- [ ] **Mobile**: Test responsive design on mobile

#### 8. Performance
- [ ] **Load Time**: App loads within 3 seconds
- [ ] **Calculation Speed**: Results update within 1 second of input change
- [ ] **Memory Usage**: No significant memory leaks during extended use

### 🚀 Final Checklist Before Push

#### Code Quality
- [ ] No console errors in browser developer tools
- [ ] No JavaScript errors in browser developer tools
- [ ] All form inputs work correctly
- [ ] All calculations produce reasonable results

#### Documentation
- [ ] README updated with new training fund features
- [ ] CHANGELOG updated with version changes
- [ ] QA test results documented

#### Deployment Readiness
- [ ] All automated tests passing (✅ Already passed)
- [ ] Manual UI tests completed successfully
- [ ] Performance metrics acceptable
- [ ] Cross-browser compatibility verified

---

## Test Data Templates

### Standard Test Case
```
Current Age: 30
Retirement Age: 67
Monthly Salary: ₪15,000
Training Fund: Enabled
Above Ceiling: Disabled
Expected Training Fund: ₪1,500/month
```

### Above Ceiling Test Case
```
Current Age: 35
Retirement Age: 65
Monthly Salary: ₪25,000
Training Fund: Enabled
Above Ceiling: Enabled
Expected Training Fund: ₪2,500/month
```

### No Training Fund Test Case
```
Current Age: 40
Retirement Age: 67
Monthly Salary: ₪18,000
Training Fund: Disabled
Expected Training Fund: ₪0/month
```

---

## Sign-off

- [ ] **Developer**: Logic implementation complete and tested
- [ ] **QA Tester**: Manual UI testing completed successfully
- [ ] **Product Owner**: Features meet requirements
- [ ] **Ready for Production Push**: All tests passed, documentation updated

**Date**: ___________  
**Tester**: ___________  
**Version**: ___________  

---

*This checklist ensures comprehensive validation before any production deployment.*