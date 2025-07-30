# Browser Test Runner

A browser-based test runner for the Advanced Retirement Planner that executes tests in a real browser environment to catch runtime errors and validate component behavior.

## Features

- **Real Browser Execution**: Tests run in an actual browser with all JavaScript APIs available
- **Component Tests**: Validate individual components render without errors
- **Integration Tests**: Test data flow and component interactions
- **E2E Tests**: Complete user workflow testing including RSU components
- **Live Console Output**: See console logs, warnings, and errors in real-time
- **Visual Test Results**: Color-coded test results with execution times
- **Test Categories**: Organized tests by type with collapsible sections

## Running the Tests

### Method 1: Direct File Access
Simply open `test-runner-browser.html` in your browser:
```bash
open test-runner-browser.html
```

### Method 2: Local Server (Recommended)
```bash
npm run test:browser:serve
# Then open http://localhost:8080/test-runner-browser.html
```

### Method 3: Auto-run on Load
Add `?autorun=true` to the URL to automatically start tests when the page loads:
```
http://localhost:8080/test-runner-browser.html?autorun=true
```

## Test Categories

### Component Tests
- Component loading verification
- Currency API functionality
- Component rendering without errors
- Multi-language support
- Financial calculations

### Integration Tests
- App initialization
- Wizard navigation
- Financial health score calculations
- Data flow between components
- Export functionality
- Currency conversions

### E2E Tests
- Complete wizard workflows
- RSU component interactions (tests the getExchangeRates fix)
- Couple planning mode
- Data persistence
- Error handling
- Mobile responsiveness

## Writing New Tests

Tests use a Jasmine-like syntax:

```javascript
testRunner.describe('My Test Suite', () => {
    testRunner.it('should do something', async () => {
        // Your test code
        assert.equal(1 + 1, 2, 'Math should work');
        
        // For async tests
        await wait(1000);
        
        // For DOM tests
        const element = await waitFor('#my-element');
        simulate.click(element);
    });
});
```

## Assertion Methods

- `assert.equal(actual, expected, message)`
- `assert.notEqual(actual, expected, message)`
- `assert.deepEqual(actual, expected, message)`
- `assert.ok(value, message)`
- `assert.notOk(value, message)`
- `assert.throws(fn, message)`
- `assert.rejects(promise, message)`
- `assert.includes(array, value, message)`
- `assert.match(string, regex, message)`
- `assert.instanceOf(object, constructor, message)`

## Helper Functions

- `wait(ms)` - Wait for specified milliseconds
- `waitFor(selector, timeout)` - Wait for element to appear
- `simulate.click(element)` - Simulate click event
- `simulate.input(element, value)` - Simulate input event
- `simulate.select(element, value)` - Simulate select change

## Benefits Over Node.js Tests

1. **Catches Runtime Errors**: Like the `api.getExchangeRates is not a function` error
2. **Real DOM Testing**: Tests actual component rendering and interactions
3. **Browser API Testing**: Tests localStorage, fetch, and other browser APIs
4. **Visual Debugging**: See exactly what's happening in the browser
5. **Network Testing**: Test real API calls and error handling

## Debugging Failed Tests

1. Check the console output panel for error details
2. Click on failed tests to see error messages
3. Use browser DevTools for deeper debugging
4. Add `console.log` statements in your tests - they'll appear in the output panel

## CI/CD Integration

While these tests run in a browser, they can be integrated into CI/CD using tools like:
- Puppeteer
- Playwright
- Selenium
- Cypress

The test results can be extracted programmatically for automated pipelines.