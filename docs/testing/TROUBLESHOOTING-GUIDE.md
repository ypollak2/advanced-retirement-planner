# Test Troubleshooting Guide

## Quick Reference

| Problem | Common Cause | Quick Fix |
|---------|--------------|-----------|
| Test timeout | Missing `await` | Add `await` to async calls |
| Cannot find module | Wrong path | Check relative paths |
| Flaky tests | Race conditions | Add explicit waits |
| Memory leaks | Missing cleanup | Add `afterEach` cleanup |
| False failures | Stale data | Clear localStorage/state |

## Table of Contents
1. [Common Test Failures](#common-test-failures)
2. [Environment Issues](#environment-issues)
3. [Async Testing Problems](#async-testing-problems)
4. [Browser Testing Issues](#browser-testing-issues)
5. [Performance Problems](#performance-problems)
6. [CI/CD Failures](#cicd-failures)
7. [Debugging Techniques](#debugging-techniques)
8. [Prevention Strategies](#prevention-strategies)

## Common Test Failures

### 1. Module Not Found Errors

**Error:**
```
Error: Cannot find module '../../src/utils/calculator'
    at Object.<anonymous> (tests/unit/calc.test.js:1:20)
```

**Causes:**
- Incorrect relative path
- Missing file extension
- File moved/renamed
- Case sensitivity issues

**Solutions:**

1. **Check the path:**
   ```javascript
   // From: tests/unit/calc.test.js
   // Wrong paths:
   require('../utils/calculator');        // Missing ../
   require('../../src/Utils/calculator'); // Wrong case
   require('../../src/utils/calculator.js'); // May need extension
   
   // Correct path:
   require('../../src/utils/calculator');
   ```

2. **Use path helpers:**
   ```javascript
   const path = require('path');
   const calculatorPath = path.join(__dirname, '../../src/utils/calculator');
   const calculator = require(calculatorPath);
   ```

3. **Check file exists:**
   ```bash
   # From project root
   ls src/utils/calculator.js
   
   # Find the file
   find . -name "calculator*" -type f
   ```

### 2. Timeout Errors

**Error:**
```
Error: Timeout of 5000ms exceeded. For async tests, make sure "done()" is called
```

**Causes:**
- Missing `await` keyword
- Promise not resolving
- Infinite loops
- Slow operations

**Solutions:**

1. **Add missing await:**
   ```javascript
   // ❌ Wrong - Missing await
   test.it('should fetch data', () => {
       const data = fetchData(); // Returns promise
       test.expect(data.length).toBe(5); // data is Promise, not array!
   });
   
   // ✅ Correct - With await
   test.it('should fetch data', async () => {
       const data = await fetchData();
       test.expect(data.length).toBe(5);
   });
   ```

2. **Increase timeout for slow operations:**
   ```javascript
   // Set timeout for specific test
   test.it('should process large dataset', async () => {
       const result = await processLargeData();
       test.expect(result).toBeDefined();
   }, 30000); // 30 second timeout
   
   // Set global timeout
   test.configure({ timeout: 10000 });
   ```

3. **Add explicit waits:**
   ```javascript
   // Wait for specific condition
   async function waitFor(condition, options = {}) {
       const { timeout = 5000, interval = 100 } = options;
       const startTime = Date.now();
       
       while (Date.now() - startTime < timeout) {
           if (await condition()) return true;
           await new Promise(resolve => setTimeout(resolve, interval));
       }
       
       throw new Error('Timeout waiting for condition');
   }
   
   // Usage
   await waitFor(() => document.querySelector('.results'));
   ```

### 3. Assertion Failures

**Error:**
```
Expected: 1000
Received: "1,000"
```

**Causes:**
- Type mismatches
- Formatting differences
- Precision issues
- Timing issues

**Solutions:**

1. **Handle type conversions:**
   ```javascript
   // ❌ Wrong - Type mismatch
   test.expect(formattedValue).toBe(1000);
   
   // ✅ Correct - Match types
   test.expect(formattedValue).toBe("1,000");
   // Or parse it
   test.expect(parseFloat(formattedValue.replace(/,/g, ''))).toBe(1000);
   ```

2. **Use appropriate matchers:**
   ```javascript
   // For floating point
   test.expect(0.1 + 0.2).toBeCloseTo(0.3, 5);
   
   // For partial matches
   test.expect(message).toContain('success');
   
   // For object equality
   test.expect(result).toEqual({ name: 'John', age: 30 });
   ```

3. **Handle async updates:**
   ```javascript
   // Wait for DOM update
   await act(async () => {
       fireEvent.click(button);
   });
   
   // Or wait for specific element
   await waitFor(() => {
       test.expect(screen.getByText('Updated')).toBeInTheDocument();
   });
   ```

## Environment Issues

### 1. Missing Global Variables

**Error:**
```
ReferenceError: window is not defined
```

**Solutions:**

1. **Mock browser globals:**
   ```javascript
   // In test setup
   global.window = {
       location: { href: 'http://localhost' },
       localStorage: {
           getItem: jest.fn(),
           setItem: jest.fn(),
           clear: jest.fn()
       }
   };
   
   global.document = {
       querySelector: jest.fn(),
       getElementById: jest.fn()
   };
   ```

2. **Use jsdom for browser environment:**
   ```javascript
   // jest.config.js
   module.exports = {
       testEnvironment: 'jsdom'
   };
   ```

### 2. Path Resolution Issues

**Error:**
```
Module not found: Can't resolve '@/components/Calculator'
```

**Solutions:**

1. **Configure module aliases:**
   ```javascript
   // jest.config.js
   module.exports = {
       moduleNameMapper: {
           '^@/(.*)$': '<rootDir>/src/$1'
       }
   };
   ```

2. **Use absolute imports:**
   ```javascript
   // package.json
   {
       "jest": {
           "modulePaths": ["<rootDir>/src"]
       }
   }
   ```

## Async Testing Problems

### 1. Unhandled Promise Rejections

**Error:**
```
UnhandledPromiseRejectionWarning: TypeError: Cannot read property 'data' of undefined
```

**Solutions:**

1. **Always handle errors:**
   ```javascript
   // ❌ Wrong - No error handling
   test.it('should fetch data', async () => {
       const response = await fetch('/api/data');
       const data = response.data; // May fail
   });
   
   // ✅ Correct - With error handling
   test.it('should fetch data', async () => {
       try {
           const response = await fetch('/api/data');
           if (!response.ok) throw new Error('Failed to fetch');
           const data = await response.json();
           test.expect(data).toBeDefined();
       } catch (error) {
           test.fail(`Failed to fetch data: ${error.message}`);
       }
   });
   ```

2. **Test error scenarios:**
   ```javascript
   test.it('should handle fetch errors', async () => {
       // Mock fetch to reject
       global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
       
       await test.expect(fetchData()).rejects.toThrow('Network error');
   });
   ```

### 2. Race Conditions

**Problem:** Tests pass individually but fail when run together

**Solutions:**

1. **Isolate test state:**
   ```javascript
   test.describe('Calculator', () => {
       let calculator;
       
       // Fresh instance for each test
       test.beforeEach(() => {
           calculator = new Calculator();
       });
       
       // Clean up after each test
       test.afterEach(() => {
           calculator.reset();
           localStorage.clear();
           jest.clearAllMocks();
       });
   });
   ```

2. **Use unique identifiers:**
   ```javascript
   test.it('should save data', async () => {
       const uniqueKey = `test-${Date.now()}-${Math.random()}`;
       await saveData(uniqueKey, testData);
       const saved = await getData(uniqueKey);
       test.expect(saved).toEqual(testData);
   });
   ```

## Browser Testing Issues

### 1. Element Not Found

**Error:**
```
Error: Unable to find element with selector: .submit-button
```

**Solutions:**

1. **Wait for elements:**
   ```javascript
   // ❌ Wrong - Element may not exist yet
   const button = await page.$('.submit-button');
   await button.click();
   
   // ✅ Correct - Wait for element
   await page.waitForSelector('.submit-button');
   const button = await page.$('.submit-button');
   await button.click();
   
   // Or combine
   const button = await page.waitForSelector('.submit-button');
   await button.click();
   ```

2. **Use more specific selectors:**
   ```javascript
   // Instead of class selectors
   await page.click('.button');
   
   // Use data attributes
   await page.click('[data-testid="submit-button"]');
   
   // Or accessible roles
   await page.click('button[type="submit"]');
   ```

### 2. Screenshot Failures

**Problem:** Screenshots not capturing correct state

**Solutions:**

1. **Wait for animations:**
   ```javascript
   // Wait for animations to complete
   await page.waitForTimeout(500);
   
   // Or wait for specific conditions
   await page.waitForFunction(() => {
       const element = document.querySelector('.modal');
       return element && !element.classList.contains('animating');
   });
   
   await page.screenshot({ path: 'modal-open.png' });
   ```

2. **Ensure viewport size:**
   ```javascript
   // Set consistent viewport
   await page.setViewport({ width: 1280, height: 720 });
   
   // For responsive testing
   const viewports = [
       { width: 375, height: 667, name: 'mobile' },
       { width: 768, height: 1024, name: 'tablet' },
       { width: 1920, height: 1080, name: 'desktop' }
   ];
   
   for (const viewport of viewports) {
       await page.setViewport(viewport);
       await page.screenshot({ 
           path: `screenshot-${viewport.name}.png`,
           fullPage: true 
       });
   }
   ```

## Performance Problems

### 1. Slow Test Suite

**Problem:** Tests take too long to run

**Solutions:**

1. **Run tests in parallel:**
   ```javascript
   // jest.config.js
   module.exports = {
       maxWorkers: '50%' // Use 50% of CPU cores
   };
   
   // Or for custom runner
   npm run test:enhanced -- --parallel
   ```

2. **Mock expensive operations:**
   ```javascript
   // Mock API calls
   jest.mock('../api', () => ({
       fetchData: jest.fn().mockResolvedValue(mockData)
   }));
   
   // Mock timers
   jest.useFakeTimers();
   ```

3. **Use test data builders:**
   ```javascript
   // Instead of creating full objects
   const user = createUser(); // Expensive
   
   // Use minimal required data
   const user = { id: 1, name: 'Test' };
   ```

### 2. Memory Leaks

**Problem:** Tests consume increasing memory

**Solutions:**

1. **Clean up resources:**
   ```javascript
   test.describe('Browser Tests', () => {
       let browser;
       let page;
       
       test.beforeAll(async () => {
           browser = await puppeteer.launch();
       });
       
       test.beforeEach(async () => {
           page = await browser.newPage();
       });
       
       test.afterEach(async () => {
           await page.close(); // Important!
       });
       
       test.afterAll(async () => {
           await browser.close(); // Critical!
       });
   });
   ```

2. **Clear large objects:**
   ```javascript
   test.afterEach(() => {
       // Clear large data structures
       largeDataset = null;
       
       // Remove event listeners
       emitter.removeAllListeners();
       
       // Clear intervals/timeouts
       clearInterval(intervalId);
   });
   ```

## CI/CD Failures

### 1. Works Locally, Fails in CI

**Common causes:**
- Different Node versions
- Missing environment variables
- Timezone differences
- File system case sensitivity

**Solutions:**

1. **Match CI environment locally:**
   ```bash
   # Use same Node version
   nvm use 18
   
   # Run with CI environment
   CI=true npm test
   
   # Use Docker to match CI
   docker run -it node:18 npm test
   ```

2. **Handle environment differences:**
   ```javascript
   // Set consistent timezone
   process.env.TZ = 'UTC';
   
   // Use environment variables
   const API_URL = process.env.API_URL || 'http://localhost:3000';
   
   // Handle CI-specific settings
   const isCI = process.env.CI === 'true';
   const timeout = isCI ? 30000 : 5000;
   ```

### 2. Flaky Tests in CI

**Solutions:**

1. **Add retries for flaky tests:**
   ```javascript
   // jest.config.js
   module.exports = {
       testRetries: process.env.CI ? 2 : 0
   };
   ```

2. **Increase timeouts in CI:**
   ```javascript
   const timeout = process.env.CI ? 30000 : 5000;
   
   test.it('should complete operation', async () => {
       // test code
   }, timeout);
   ```

## Debugging Techniques

### 1. Interactive Debugging

**Using debugger statements:**
```javascript
test.it('should calculate correctly', async () => {
    const input = { salary: 15000 };
    
    debugger; // Pause here when running with --inspect
    
    const result = calculate(input);
    test.expect(result).toBe(expected);
});

// Run with:
// node --inspect-brk node_modules/.bin/jest path/to/test.js
```

**Using console logs:**
```javascript
test.it('should process data', () => {
    console.log('Input:', JSON.stringify(input, null, 2));
    
    const result = process(input);
    
    console.log('Result:', result);
    console.log('Expected:', expected);
    
    test.expect(result).toEqual(expected);
});
```

### 2. Visual Debugging

**For browser tests:**
```javascript
// Run in headed mode
const browser = await puppeteer.launch({ 
    headless: false,
    slowMo: 100, // Slow down actions
    devtools: true // Open DevTools
});

// Take screenshots at each step
await page.screenshot({ path: 'step1.png' });
await page.click('#submit');
await page.screenshot({ path: 'step2.png' });

// Pause for manual inspection
await page.evaluate(() => debugger);
```

### 3. Debugging Async Issues

```javascript
// Log async operations
async function debugAsync(promise, label) {
    console.log(`${label}: Starting...`);
    try {
        const result = await promise;
        console.log(`${label}: Success`, result);
        return result;
    } catch (error) {
        console.log(`${label}: Error`, error);
        throw error;
    }
}

// Usage
const data = await debugAsync(fetchData(), 'Fetch Data');
```

## Prevention Strategies

### 1. Pre-commit Hooks

```bash
# .husky/pre-commit
#!/bin/sh
npm run test:unit -- --changedSince=main
```

### 2. Test Guidelines Checklist

Before committing tests, verify:
- [ ] Tests run in isolation
- [ ] No hardcoded values
- [ ] Proper async handling
- [ ] Resources cleaned up
- [ ] Meaningful test names
- [ ] Edge cases covered

### 3. Regular Maintenance

```javascript
// Mark flaky tests
test.it.skip('flaky test - issue #123', () => {
    // Test that needs fixing
});

// Add test metadata
test.it('should calculate tax @slow @integration', () => {
    // Test implementation
});
```

### 4. Monitor Test Health

```bash
# Generate test report
npm run test:report

# Check test coverage
npm run test:coverage

# Find slow tests
npm test -- --verbose --expand
```

## Quick Debug Commands

```bash
# Run single test file
npm test tests/unit/calculator.test.js

# Run tests matching pattern
npm test -- --testNamePattern="should calculate"

# Run with verbose output
npm test -- --verbose

# Run in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage

# Debug in Chrome
node --inspect-brk node_modules/.bin/jest --runInBand

# Run specific test suite
npm test -- --testPathPattern=unit
```

---

Remember: A failing test is providing valuable information. Don't ignore it - fix it!