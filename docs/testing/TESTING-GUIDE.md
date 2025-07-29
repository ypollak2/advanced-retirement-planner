# Advanced Retirement Planner Testing Guide

## Table of Contents
1. [Overview](#overview)
2. [Testing Philosophy](#testing-philosophy)
3. [Test Structure](#test-structure)
4. [Writing Tests](#writing-tests)
5. [Running Tests](#running-tests)
6. [Test Categories](#test-categories)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)
9. [CI/CD Integration](#cicd-integration)
10. [Contributing](#contributing)

## Overview

The Advanced Retirement Planner uses a comprehensive testing framework to ensure reliability, performance, and security. This guide provides everything you need to write, run, and maintain tests.

### Quick Start

```bash
# Run all tests
npm test

# Run enhanced test suite
npm run test:enhanced

# Run specific category
npm run test:unit
npm run test:e2e

# Watch mode for development
npm run test:watch
```

## Testing Philosophy

### Core Principles

1. **100% Pass Rate Required**: No deployment without all tests passing
2. **Test Early, Test Often**: Write tests as you develop features
3. **Meaningful Tests**: Each test should validate real behavior
4. **Fast Feedback**: Tests should run quickly for rapid development
5. **Clear Failures**: Failed tests should clearly indicate the problem

### Testing Pyramid

```
         /\
        /E2E\        <- User journeys (10%)
       /------\
      /Integration\   <- Component interaction (20%)
     /------------\
    /     Unit     \  <- Business logic (70%)
   /----------------\
```

## Test Structure

### Directory Organization

```
tests/
├── config/
│   └── test-config.js          # Centralized configuration
├── utils/
│   └── test-framework.js       # Test utilities and helpers
├── unit/
│   ├── retirementCalculations.test.js
│   └── financialHealthEngine.test.js
├── integration/
│   └── component-integration.test.js
├── e2e/
│   └── wizard-flow.test.js
├── performance/
│   └── performance-benchmarks.js
├── security/
│   └── security-vulnerability-tests.js
├── fixtures/
│   └── test-data.json         # Shared test data
└── enhanced-test-runner.js     # Main test runner
```

### Test File Naming

- Unit tests: `[module-name].test.js`
- Integration tests: `[feature-name]-integration.test.js`
- E2E tests: `[user-journey].test.js`
- Performance tests: `[metric]-benchmarks.js`
- Security tests: `[vulnerability-type]-tests.js`

## Writing Tests

### Basic Test Structure

```javascript
const { TestFramework } = require('../utils/test-framework');
const test = new TestFramework();

test.describe('Module Name', () => {
    // Setup
    test.beforeAll(async () => {
        // Global setup for test suite
    });
    
    test.beforeEach(async () => {
        // Setup before each test
    });
    
    // Tests
    test.it('should do something specific', async () => {
        // Arrange
        const input = { value: 10 };
        
        // Act
        const result = functionUnderTest(input);
        
        // Assert
        test.expect(result).toBe(20);
    });
    
    // Cleanup
    test.afterEach(async () => {
        // Cleanup after each test
    });
    
    test.afterAll(async () => {
        // Global cleanup
    });
});

// Run tests
test.run();
```

### Assertions

```javascript
// Equality
test.expect(actual).toBe(expected);          // Strict equality
test.expect(actual).toEqual(expected);       // Deep equality

// Comparisons
test.expect(value).toBeGreaterThan(5);
test.expect(value).toBeLessThan(10);

// Truthiness
test.expect(value).toBeTruthy();
test.expect(value).toBeFalsy();
test.expect(value).toBeDefined();
test.expect(value).toBeNull();

// Arrays and Strings
test.expect(array).toContain(item);
test.expect(array).toHaveLength(3);
test.expect(string).toMatch(/pattern/);

// Objects
test.expect(object).toHaveProperty('key');
test.expect(object).toHaveProperty('key', 'value');

// Functions
test.expect(() => dangerousFunction()).toThrow();
test.expect(() => dangerousFunction()).toThrow('Specific error');

// Negation
test.expect(value).not.toBe(wrongValue);
```

### Mocking

```javascript
const { createMock, spyOn } = require('../utils/test-framework');

// Create a mock function
const mockFn = createMock('myFunction');
mockFn.mockReturnValue(42);
mockFn.mockImplementation((x) => x * 2);

// Spy on existing function
const spy = spyOn(object, 'method');
spy.mockReturnValue('mocked result');

// Verify calls
test.expect(mockFn.mock.calls).toHaveLength(2);
test.expect(mockFn.mock.calls[0]).toEqual([arg1, arg2]);

// Restore original
spy.mockRestore();
```

## Running Tests

### Command Line Options

```bash
# Run all tests
npm test

# Enhanced test runner with options
npm run test:enhanced -- [options]

# Options:
#   --category=unit|integration|e2e|performance|security
#   --verbose                    # Show detailed output
#   --watch                     # Watch mode
#   --coverage                  # Generate coverage report
#   --reporter=json|junit|html  # Output format
#   --parallel                  # Run tests in parallel
```

### Development Workflow

```bash
# 1. Start watch mode
npm run test:watch

# 2. Make changes to code

# 3. Tests run automatically

# 4. Fix failures immediately

# 5. Commit when all tests pass
```

### Pre-commit Testing

```bash
# Run quick validation
npm run validate:quick

# Run full test suite before push
npm run pre-push
```

## Test Categories

### Unit Tests

**Purpose**: Test individual functions and modules in isolation

**Example**:
```javascript
test.describe('Currency Conversion', () => {
    test.it('should convert ILS to USD correctly', () => {
        const result = convertCurrency(3500, 'USD', { USD: 3.5 });
        test.expect(result).toBe('$1,000');
    });
    
    test.it('should handle invalid rates', () => {
        const result = convertCurrency(1000, 'USD', null);
        test.expect(result).toBe('N/A');
    });
});
```

**Best Practices**:
- Test one thing per test
- Use descriptive test names
- Test edge cases and error conditions
- Keep tests independent

### Integration Tests

**Purpose**: Test component interaction and data flow

**Example**:
```javascript
test.describe('Form Integration', () => {
    test.it('should update calculations when salary changes', async () => {
        // Setup component
        const form = await mountComponent('RetirementForm');
        
        // Change salary
        await form.updateField('monthlySalary', 15000);
        
        // Verify calculations updated
        const results = await form.getCalculationResults();
        test.expect(results.monthlyPension).toBeGreaterThan(0);
    });
});
```

**Best Practices**:
- Test realistic user interactions
- Verify data flow between components
- Test state management
- Include error scenarios

### E2E Tests

**Purpose**: Test complete user journeys

**Example**:
```javascript
test.describe('Retirement Planning Wizard', () => {
    test.it('should complete wizard for young professional', async () => {
        // Start wizard
        await page.goto(APP_URL);
        await page.select('#planningType', 'individual');
        
        // Fill basic info
        await page.type('#currentAge', '28');
        await page.type('#retirementAge', '65');
        
        // Continue through wizard
        await clickNext(page);
        
        // Verify results
        await page.waitForSelector('.results-container');
        const monthlyIncome = await page.$eval(
            '.monthly-income', 
            el => el.textContent
        );
        test.expect(monthlyIncome).not.toBe('0');
    });
});
```

**Best Practices**:
- Test critical user paths
- Use realistic test data
- Take screenshots on failure
- Test across browsers

### Performance Tests

**Purpose**: Ensure app meets performance requirements

**Example**:
```javascript
test.describe('Page Load Performance', () => {
    test.it('should load within 3 seconds', async () => {
        const startTime = Date.now();
        await page.goto(APP_URL, { waitUntil: 'networkidle0' });
        const loadTime = Date.now() - startTime;
        
        test.expect(loadTime).toBeLessThan(3000);
    });
    
    test.it('should not exceed memory threshold', async () => {
        const metrics = await page.metrics();
        test.expect(metrics.JSHeapUsedSize).toBeLessThan(50 * 1024 * 1024);
    });
});
```

**Thresholds**:
- Page load: < 3 seconds
- Script count: < 5 inline scripts
- Memory usage: < 50MB
- DOM nodes: < 1500

### Security Tests

**Purpose**: Validate security measures

**Example**:
```javascript
test.describe('XSS Prevention', () => {
    test.it('should sanitize user input', async () => {
        const xssAttempt = '<script>alert("xss")</script>';
        
        await page.type('#userName', xssAttempt);
        await page.click('#submit');
        
        // Verify script was not executed
        const alerts = await page.evaluate(() => window.xssAttempts);
        test.expect(alerts).toHaveLength(0);
    });
});
```

**Test Patterns**:
- XSS: Script injection, event handlers
- SQL Injection: Malicious queries
- Input validation: Invalid data types
- Data exposure: Sensitive info in DOM

## Best Practices

### General Guidelines

1. **Descriptive Names**
   ```javascript
   // ❌ Bad
   test.it('test 1', () => {});
   
   // ✅ Good
   test.it('should calculate retirement age correctly for early retirement', () => {});
   ```

2. **Arrange-Act-Assert Pattern**
   ```javascript
   test.it('should calculate monthly pension', () => {
       // Arrange
       const inputs = { salary: 10000, years: 30 };
       
       // Act
       const result = calculatePension(inputs);
       
       // Assert
       test.expect(result).toBe(6500);
   });
   ```

3. **Test Independence**
   ```javascript
   // ❌ Bad - depends on previous test
   let sharedState;
   test.it('test 1', () => {
       sharedState = createData();
   });
   test.it('test 2', () => {
       updateData(sharedState); // Fails if test 1 didn't run
   });
   
   // ✅ Good - independent tests
   test.it('test 1', () => {
       const data = createData();
       // test data
   });
   test.it('test 2', () => {
       const data = createData();
       updateData(data);
       // test update
   });
   ```

4. **Meaningful Assertions**
   ```javascript
   // ❌ Bad - vague assertion
   test.expect(result).toBeTruthy();
   
   // ✅ Good - specific assertion
   test.expect(result.status).toBe('success');
   test.expect(result.data.length).toBe(5);
   ```

5. **Edge Cases**
   ```javascript
   test.describe('Age Validation', () => {
       test.it('should handle minimum age', () => {
           test.expect(validateAge(18)).toBe(true);
       });
       
       test.it('should handle maximum age', () => {
           test.expect(validateAge(120)).toBe(true);
       });
       
       test.it('should reject negative age', () => {
           test.expect(validateAge(-1)).toBe(false);
       });
       
       test.it('should handle null', () => {
           test.expect(validateAge(null)).toBe(false);
       });
   });
   ```

### Component Testing

1. **Test User Behavior, Not Implementation**
   ```javascript
   // ❌ Bad - testing implementation
   test.it('should call calculateTotal function', () => {
       const spy = spyOn(component, 'calculateTotal');
       component.updatePrice(100);
       test.expect(spy).toHaveBeenCalled();
   });
   
   // ✅ Good - testing behavior
   test.it('should update total when price changes', () => {
       component.updatePrice(100);
       test.expect(component.getTotal()).toBe(110); // includes tax
   });
   ```

2. **Test State Changes**
   ```javascript
   test.it('should update planning type', async () => {
       const component = await mountComponent('PlanningTypeSelector');
       
       // Initial state
       test.expect(component.getSelectedType()).toBe('individual');
       
       // Change state
       await component.selectType('couple');
       
       // Verify change
       test.expect(component.getSelectedType()).toBe('couple');
       test.expect(component.showsPartnerFields()).toBe(true);
   });
   ```

### Async Testing

1. **Proper Async Handling**
   ```javascript
   // ❌ Bad - missing await
   test.it('should load data', () => {
       const data = fetchData(); // Returns promise
       test.expect(data.length).toBe(5); // Fails!
   });
   
   // ✅ Good - proper async
   test.it('should load data', async () => {
       const data = await fetchData();
       test.expect(data.length).toBe(5);
   });
   ```

2. **Waiting for Elements**
   ```javascript
   test.it('should show results after calculation', async () => {
       await page.click('#calculate');
       
       // Wait for results to appear
       await page.waitForSelector('.results', { timeout: 5000 });
       
       const results = await page.$eval('.results', el => el.textContent);
       test.expect(results).toContain('Monthly Income');
   });
   ```

### Test Data Management

1. **Use Fixtures**
   ```javascript
   // tests/fixtures/users.json
   {
     "youngProfessional": {
       "age": 28,
       "salary": 12000,
       "savings": 50000
     },
     "nearRetirement": {
       "age": 62,
       "salary": 25000,
       "savings": 1500000
     }
   }
   
   // In test
   const users = require('../fixtures/users.json');
   
   test.it('should calculate for young professional', () => {
       const result = calculate(users.youngProfessional);
       test.expect(result.yearsToRetirement).toBe(37);
   });
   ```

2. **Test Data Builders**
   ```javascript
   class UserBuilder {
       constructor() {
           this.data = {
               age: 30,
               salary: 10000,
               savings: 100000
           };
       }
       
       withAge(age) {
           this.data.age = age;
           return this;
       }
       
       withHighIncome() {
           this.data.salary = 50000;
           return this;
       }
       
       build() {
           return this.data;
       }
   }
   
   // Usage
   const user = new UserBuilder()
       .withAge(45)
       .withHighIncome()
       .build();
   ```

## Troubleshooting

### Common Issues and Solutions

#### 1. Tests Timing Out

**Problem**: Test exceeds timeout limit
```
Error: Test timeout after 5000ms
```

**Solutions**:
- Increase timeout for specific test:
  ```javascript
  test.it('slow operation', async () => {
      // Test code
  }, 10000); // 10 second timeout
  ```
- Check for missing `await`:
  ```javascript
  // ❌ Missing await causes timeout
  test.it('async test', () => {
      fetchData(); // Never completes
  });
  
  // ✅ Proper async
  test.it('async test', async () => {
      await fetchData();
  });
  ```

#### 2. Flaky Tests

**Problem**: Tests pass sometimes, fail others

**Solutions**:
- Add explicit waits:
  ```javascript
  // ❌ Race condition
  await page.click('#submit');
  const result = await page.$('.result'); // May not exist yet
  
  // ✅ Wait for element
  await page.click('#submit');
  await page.waitForSelector('.result');
  const result = await page.$('.result');
  ```
- Clean up between tests:
  ```javascript
  test.afterEach(async () => {
      // Clear localStorage
      await page.evaluate(() => localStorage.clear());
      // Reset global state
      await resetApplication();
  });
  ```

#### 3. Cannot Find Module

**Problem**: Module import errors
```
Error: Cannot find module '../src/utils/calculator'
```

**Solutions**:
- Check file paths:
  ```javascript
  // From: tests/unit/calc.test.js
  // To: src/utils/calculator.js
  const calculator = require('../../src/utils/calculator');
  ```
- Ensure module exports:
  ```javascript
  // calculator.js
  module.exports = { calculate, validate };
  ```

#### 4. Assertion Failures

**Problem**: Expected value doesn't match
```
Expected 1000 but got "1,000"
```

**Solutions**:
- Check data types:
  ```javascript
  // ❌ Type mismatch
  test.expect(formattedNumber).toBe(1000);
  
  // ✅ Correct comparison
  test.expect(formattedNumber).toBe("1,000");
  // or
  test.expect(parseFloat(formattedNumber.replace(/,/g, ''))).toBe(1000);
  ```

#### 5. Memory Leaks in Tests

**Problem**: Tests consume increasing memory

**Solutions**:
- Clean up resources:
  ```javascript
  let browser;
  
  test.beforeAll(async () => {
      browser = await puppeteer.launch();
  });
  
  test.afterAll(async () => {
      await browser.close(); // Important!
  });
  ```
- Clear large data:
  ```javascript
  test.afterEach(() => {
      largeDataSet = null;
      global.gc && global.gc(); // Force garbage collection if available
  });
  ```

### Debugging Tests

#### 1. Verbose Output
```bash
# Run with verbose flag
npm run test:enhanced -- --verbose

# Or set in test
test.configure({ verbose: true });
```

#### 2. Focus on Single Test
```javascript
// Only run this test
test.it.only('specific test', () => {
    // This test runs in isolation
});

// Skip test temporarily
test.it.skip('broken test', () => {
    // This test is skipped
});
```

#### 3. Debug in Browser
```javascript
// For E2E tests, run in headed mode
const browser = await puppeteer.launch({ 
    headless: false,
    devtools: true 
});

// Add debugger statement
await page.evaluate(() => {
    debugger; // Pauses in browser DevTools
});
```

#### 4. Console Logging
```javascript
test.it('debug test', async () => {
    const data = await fetchData();
    console.log('Data received:', data); // Will show in test output
    
    // In browser tests
    page.on('console', msg => console.log('Browser:', msg.text()));
});
```

### Performance Optimization

#### 1. Parallel Execution
```bash
# Run tests in parallel
npm run test:parallel

# Configure in test runner
test.configure({ maxParallel: 4 });
```

#### 2. Selective Testing
```bash
# Run only changed tests
npm run test:enhanced -- --changed

# Run specific file
npm run test:enhanced -- tests/unit/calculator.test.js
```

#### 3. Mock External Dependencies
```javascript
// Mock API calls
const mockApi = {
    fetchStockPrice: jest.fn().mockResolvedValue(150.00)
};

// Mock timers
test.beforeEach(() => {
    jest.useFakeTimers();
});

test.it('should handle timeout', () => {
    const callback = jest.fn();
    setTimeout(callback, 1000);
    
    jest.advanceTimersByTime(1000);
    test.expect(callback).toHaveBeenCalled();
});
```

## CI/CD Integration

### GitHub Actions Workflow

The project uses GitHub Actions for continuous testing:

```yaml
# .github/workflows/test-ci.yml
name: Comprehensive Test Suite CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * *' # Daily at 2 AM
```

### Pipeline Stages

1. **Unit Tests** - Fast feedback on logic
2. **Integration Tests** - Component interaction
3. **E2E Tests** - User journeys (Chrome & Firefox)
4. **Performance Tests** - Speed and efficiency
5. **Security Tests** - Vulnerability scanning
6. **Test Report** - Consolidated results

### Deployment Gates

```yaml
deployment-gate:
  needs: [full-test-suite]
  if: ${{ github.ref == 'refs/heads/main' }}
  steps:
    - name: Verify deployment readiness
      run: |
        if [ "$TEST_PASS_RATE" != "100" ]; then
          echo "❌ Deployment blocked: Tests must pass 100%"
          exit 1
        fi
```

### Local CI Simulation

```bash
# Run same tests as CI locally
npm run qa:full

# Pre-push validation
npm run validate:pre-push
```

## Contributing

### Adding New Tests

1. **Choose appropriate category** (unit/integration/e2e/etc.)
2. **Create test file** following naming convention
3. **Write comprehensive tests** covering happy path and edge cases
4. **Run locally** to ensure tests pass
5. **Update test count** in CLAUDE.md if needed
6. **Submit PR** with test results

### Test Review Checklist

- [ ] Tests follow naming conventions
- [ ] All assertions are meaningful
- [ ] Edge cases are covered
- [ ] No hardcoded values
- [ ] Tests are independent
- [ ] Cleanup is implemented
- [ ] Documentation is updated

### Maintaining Test Quality

1. **Regular Review**: Review tests during code review
2. **Refactor Tests**: Keep tests clean and maintainable
3. **Update Fixtures**: Keep test data current
4. **Monitor Flakiness**: Fix flaky tests immediately
5. **Performance**: Ensure tests run quickly

## Resources

### Internal Documentation
- [Test Framework API](./TEST-FRAMEWORK-API.md)
- [CI/CD Workflows](./CI-CD-WORKFLOWS.md)
- [Performance Benchmarks](./PERFORMANCE-BENCHMARKS.md)

### External Resources
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Puppeteer API](https://pptr.dev/)
- [Testing Best Practices](https://testingjavascript.com/)
- [GitHub Actions](https://docs.github.com/en/actions)

---

Remember: **Quality is not negotiable. Every test matters.**