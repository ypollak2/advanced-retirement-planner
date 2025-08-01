# Test Data Usage Guide

## v7.5.9 Testing Release

This release includes a test data initializer to verify that the application works correctly with pre-filled data.

### How to Use Test Data

1. **Local Development**:
   - Simply open the application on localhost
   - Test data will be automatically loaded
   - You'll be taken directly to the Review step

2. **Production Testing**:
   - Add `?testdata=true` to the URL
   - Example: `https://ypollak2.github.io/advanced-retirement-planner/?testdata=true`
   - This will load the test data and jump to the Review step

### Test Data Contents

The test data represents a couple with:
- **Ages**: Both partners are 39, retiring at 67
- **Risk Tolerance**: Moderate
- **Monthly Income**: 
  - Partner 1: ₪53,500
  - Partner 2: ₪33,000
  - Total: ₪86,500
- **Current Savings**:
  - Partner 1: ₪3,070,000 (Pension: ₪1,550,000, Training: ₪470,000, Portfolio: ₪1,050,000)
  - Partner 2: ₪1,084,000 (Pension: ₪550,000, Training: ₪227,000, Portfolio: ₪307,000)
  - Total: ₪4,154,000
- **Expenses**: ₪0 (for testing purposes)
- **Contribution Rates**: Standard Israeli rates (6%+6.5% pension, 2.5%+5% training fund)

### Available Functions

```javascript
// Initialize test data
window.initializeTestData()

// Clear test data (only clears if it's test data, not user data)
window.clearTestData()
```

### What to Test

1. **Review Step Display**:
   - Total Accumulation should show ~₪7.96M (projected)
   - Monthly Income should show ₪86,500
   - Component Scores should display correctly
   - No NaN values anywhere

2. **Financial Summary Panel**:
   - Income breakdown correct
   - Expense showing as ₪0
   - Tax calculations working
   - Expense ratio 0%

3. **Inflation Impact**:
   - Both nominal and real values displayed
   - Purchasing power loss calculated

4. **Charts**:
   - Savings trajectory chart displays
   - Data points are reasonable

5. **Export Functions**:
   - Claude recommendations include all data
   - PDF/Image export works
   - JSON export has complete data

### Important Notes

- Test data is marked with `isTestData: true` to prevent accidental deletion of real user data
- The `clearTestData()` function only removes data if it's marked as test data
- Test data persists in localStorage until explicitly cleared
- After testing, we'll create default values based on this structure

### Removing Test Data Feature

After testing is complete, remove:
1. The `testDataInitializer.js` script from index.html
2. The test data file itself
3. This documentation