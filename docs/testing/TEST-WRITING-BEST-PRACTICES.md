# Test Writing Best Practices

## Table of Contents
1. [Test Quality Standards](#test-quality-standards)
2. [Test Patterns](#test-patterns)
3. [Anti-Patterns to Avoid](#anti-patterns-to-avoid)
4. [Code Examples](#code-examples)
5. [Test Data Management](#test-data-management)
6. [Performance Considerations](#performance-considerations)
7. [Maintenance Guidelines](#maintenance-guidelines)

## Test Quality Standards

### The FIRST Principles

Tests should be:
- **F**ast: Execute quickly for rapid feedback
- **I**ndependent: Not rely on other tests
- **R**epeatable: Produce same results every time
- **S**elf-validating: Pass or fail clearly
- **T**imely: Written with or before the code

### Test Naming Convention

```javascript
// Format: should [expected behavior] when [condition/context]

// ✅ Good examples
test.it('should return monthly pension of 6500 when salary is 10000 and years of service is 30', () => {});
test.it('should throw error when age is negative', () => {});
test.it('should display partner fields when planning type is couple', () => {});

// ❌ Bad examples
test.it('test pension calculation', () => {});
test.it('works correctly', () => {});
test.it('test 1', () => {});
```

### Test Structure: AAA Pattern

```javascript
test.it('should calculate retirement savings with compound interest', () => {
    // Arrange - Set up test data and conditions
    const initialSavings = 100000;
    const monthlyContribution = 5000;
    const annualReturn = 0.07;
    const years = 20;
    
    // Act - Execute the function/action being tested
    const result = calculateFutureValue({
        initialSavings,
        monthlyContribution,
        annualReturn,
        years
    });
    
    // Assert - Verify the outcome
    test.expect(result).toBeGreaterThan(initialSavings);
    test.expect(result).toBe(2598272.95); // Specific expected value
});
```

## Test Patterns

### 1. Testing Pure Functions

```javascript
// Pure functions are easiest to test - same input always produces same output
test.describe('Financial Calculations', () => {
    test.it('should calculate net return correctly', () => {
        // Simple, predictable test
        test.expect(getNetReturn(7.5, 1.2)).toBe(6.3);
        test.expect(getNetReturn(10, 2.5)).toBe(7.5);
        test.expect(getNetReturn(-5, 1)).toBe(-6);
    });
});
```

### 2. Testing with Dependencies

```javascript
test.describe('API Integration', () => {
    let mockFetch;
    
    test.beforeEach(() => {
        // Mock external dependencies
        mockFetch = createMock('fetch');
        global.fetch = mockFetch.getMockFunction();
    });
    
    test.afterEach(() => {
        // Clean up
        delete global.fetch;
    });
    
    test.it('should fetch stock price from API', async () => {
        // Arrange
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({ price: 150.50 })
        });
        
        // Act
        const price = await fetchStockPrice('AAPL');
        
        // Assert
        test.expect(price).toBe(150.50);
        test.expect(mockFetch.mock.calls[0][0]).toContain('AAPL');
    });
});
```

### 3. Testing Async Operations

```javascript
test.describe('Async Operations', () => {
    test.it('should handle successful data load', async () => {
        // Always use async/await for clarity
        const data = await loadRetirementData();
        test.expect(data).toBeDefined();
        test.expect(data.status).toBe('success');
    });
    
    test.it('should handle timeout gracefully', async () => {
        // Test timeout scenarios
        const slowOperation = new Promise((resolve) => {
            setTimeout(resolve, 10000);
        });
        
        await test.expect(
            Promise.race([
                slowOperation,
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Timeout')), 1000)
                )
            ])
        ).rejects.toThrow('Timeout');
    });
});
```

### 4. Testing Error Conditions

```javascript
test.describe('Error Handling', () => {
    test.it('should validate age boundaries', () => {
        // Test valid cases
        test.expect(() => validateAge(18)).not.toThrow();
        test.expect(() => validateAge(120)).not.toThrow();
        
        // Test invalid cases
        test.expect(() => validateAge(-1)).toThrow('Age must be positive');
        test.expect(() => validateAge(150)).toThrow('Age must be realistic');
        test.expect(() => validateAge('thirty')).toThrow('Age must be a number');
        test.expect(() => validateAge(null)).toThrow('Age is required');
    });
});
```

### 5. Testing State Changes

```javascript
test.describe('State Management', () => {
    let component;
    
    test.beforeEach(() => {
        component = new RetirementCalculator();
    });
    
    test.it('should update calculations when inputs change', () => {
        // Initial state
        test.expect(component.getMonthlyPension()).toBe(0);
        
        // Update salary
        component.setSalary(15000);
        test.expect(component.getMonthlyPension()).toBe(975); // 6.5% of salary
        
        // Update years of service
        component.setYearsOfService(30);
        test.expect(component.getMonthlyPension()).toBe(4500); // 30% of salary
    });
});
```

### 6. Parameterized Tests

```javascript
test.describe('Currency Conversion', () => {
    const testCases = [
        { amount: 1000, from: 'ILS', to: 'USD', rate: 3.5, expected: '$285.71' },
        { amount: 1000, from: 'ILS', to: 'EUR', rate: 4.0, expected: '€250.00' },
        { amount: 1000, from: 'ILS', to: 'GBP', rate: 4.5, expected: '£222.22' },
    ];
    
    testCases.forEach(({ amount, from, to, rate, expected }) => {
        test.it(`should convert ${from} to ${to} correctly`, () => {
            const result = convertCurrency(amount, to, { [to]: rate });
            test.expect(result).toBe(expected);
        });
    });
});
```

## Anti-Patterns to Avoid

### 1. Testing Implementation Details

```javascript
// ❌ Bad - Testing private methods/implementation
test.it('should call internal calculation method', () => {
    const spy = spyOn(calculator, '_internalMethod');
    calculator.calculate();
    test.expect(spy).toHaveBeenCalled();
});

// ✅ Good - Testing public behavior
test.it('should calculate correct result', () => {
    const result = calculator.calculate();
    test.expect(result).toBe(expectedValue);
});
```

### 2. Overly Complex Tests

```javascript
// ❌ Bad - Too many assertions, unclear intent
test.it('should handle user flow', () => {
    login(user);
    navigateToForm();
    fillForm(data);
    submitForm();
    checkRedirect();
    verifyData();
    logout();
    checkCleanup();
    // Too much in one test!
});

// ✅ Good - Focused, single responsibility
test.it('should save form data on submit', () => {
    fillForm(validData);
    submitForm();
    test.expect(getSavedData()).toEqual(validData);
});
```

### 3. Hardcoded Test Data

```javascript
// ❌ Bad - Magic numbers and strings
test.it('should calculate tax', () => {
    const result = calculateTax(50000);
    test.expect(result).toBe(12500); // What does this number mean?
});

// ✅ Good - Clear, documented values
test.it('should calculate tax at 25% rate', () => {
    const income = 50000;
    const taxRate = 0.25;
    const expectedTax = income * taxRate;
    
    const result = calculateTax(income);
    test.expect(result).toBe(expectedTax);
});
```

### 4. Time-Dependent Tests

```javascript
// ❌ Bad - Depends on current time
test.it('should calculate age', () => {
    const birthDate = '1990-01-01';
    const age = calculateAge(birthDate);
    test.expect(age).toBe(34); // Fails next year!
});

// ✅ Good - Control time in tests
test.it('should calculate age', () => {
    const birthDate = '1990-01-01';
    const referenceDate = '2024-01-01';
    const age = calculateAge(birthDate, referenceDate);
    test.expect(age).toBe(34);
});
```

### 5. Shared State Between Tests

```javascript
// ❌ Bad - Tests affect each other
let calculator;

test.beforeAll(() => {
    calculator = new Calculator();
});

test.it('test 1', () => {
    calculator.add(5);
    test.expect(calculator.total).toBe(5);
});

test.it('test 2', () => {
    // Fails because total is already 5!
    test.expect(calculator.total).toBe(0);
});

// ✅ Good - Fresh state for each test
test.beforeEach(() => {
    calculator = new Calculator();
});
```

## Code Examples

### Complete Test Suite Example

```javascript
const { TestFramework, createMock } = require('../utils/test-framework');
const { RetirementCalculator } = require('../../src/utils/retirementCalculator');

const test = new TestFramework();

test.describe('Retirement Calculator', () => {
    let calculator;
    let mockExchangeRates;
    
    // Test data
    const testUser = {
        age: 35,
        retirementAge: 67,
        monthlySalary: 15000,
        currentSavings: 200000,
        monthlyExpenses: 10000
    };
    
    test.beforeEach(() => {
        // Fresh instance for each test
        calculator = new RetirementCalculator();
        
        // Mock external dependencies
        mockExchangeRates = {
            USD: 3.5,
            EUR: 4.0,
            GBP: 4.5
        };
    });
    
    test.describe('Basic Calculations', () => {
        test.it('should calculate years to retirement', () => {
            calculator.setUserData(testUser);
            test.expect(calculator.getYearsToRetirement()).toBe(32);
        });
        
        test.it('should calculate monthly pension contribution', () => {
            calculator.setMonthlySalary(testUser.monthlySalary);
            const contribution = calculator.getMonthlyPensionContribution();
            
            // Employee (6.5%) + Employer (6.5%) + Severance (8.33%)
            const expected = testUser.monthlySalary * 0.2133;
            test.expect(contribution).toBe(expected);
        });
    });
    
    test.describe('Advanced Projections', () => {
        test.it('should project retirement savings with compound interest', () => {
            calculator.setUserData(testUser);
            calculator.setAnnualReturn(0.07);
            
            const projection = calculator.projectRetirementSavings();
            
            // Should grow over time
            test.expect(projection.finalAmount).toBeGreaterThan(testUser.currentSavings);
            
            // Should have reasonable value after 32 years
            test.expect(projection.finalAmount).toBeGreaterThan(2000000);
            test.expect(projection.finalAmount).toBeLessThan(10000000);
        });
        
        test.it('should handle different return scenarios', () => {
            calculator.setUserData(testUser);
            
            const scenarios = calculator.runScenarios();
            
            test.expect(scenarios.conservative.finalAmount)
                .toBeLessThan(scenarios.moderate.finalAmount);
            test.expect(scenarios.moderate.finalAmount)
                .toBeLessThan(scenarios.aggressive.finalAmount);
        });
    });
    
    test.describe('Currency Support', () => {
        test.it('should display results in different currencies', () => {
            calculator.setSavings(350000); // ILS
            
            const usdAmount = calculator.getAmountInCurrency('USD', mockExchangeRates);
            test.expect(usdAmount).toBe('$100,000');
            
            const eurAmount = calculator.getAmountInCurrency('EUR', mockExchangeRates);
            test.expect(eurAmount).toBe('€87,500');
        });
    });
    
    test.describe('Validation and Error Handling', () => {
        test.it('should validate retirement age is greater than current age', () => {
            test.expect(() => {
                calculator.setCurrentAge(65);
                calculator.setRetirementAge(60);
            }).toThrow('Retirement age must be greater than current age');
        });
        
        test.it('should handle missing required fields gracefully', () => {
            // Don't set any data
            const result = calculator.calculate();
            
            test.expect(result.status).toBe('error');
            test.expect(result.errors).toContain('Monthly salary is required');
        });
        
        test.it('should validate numeric inputs', () => {
            test.expect(() => calculator.setMonthlySalary('abc'))
                .toThrow('Salary must be a number');
            test.expect(() => calculator.setMonthlySalary(-1000))
                .toThrow('Salary must be positive');
            test.expect(() => calculator.setMonthlySalary(1000000))
                .toThrow('Salary seems unrealistic');
        });
    });
    
    test.describe('Edge Cases', () => {
        test.it('should handle zero current savings', () => {
            calculator.setUserData({ ...testUser, currentSavings: 0 });
            const projection = calculator.projectRetirementSavings();
            
            test.expect(projection.finalAmount).toBeGreaterThan(0);
        });
        
        test.it('should handle very early retirement', () => {
            calculator.setUserData({
                ...testUser,
                age: 55,
                retirementAge: 60
            });
            
            const result = calculator.calculate();
            test.expect(result.warnings).toContain('Short accumulation period');
        });
        
        test.it('should handle high inflation scenarios', () => {
            calculator.setUserData(testUser);
            calculator.setInflationRate(0.10); // 10% inflation
            
            const result = calculator.calculateRealReturns();
            test.expect(result.realReturnRate).toBeLessThan(0.07);
        });
    });
});

test.run();
```

## Test Data Management

### Using Fixtures

```javascript
// tests/fixtures/users.js
module.exports = {
    youngProfessional: {
        age: 28,
        retirementAge: 65,
        monthlySalary: 12000,
        currentSavings: 50000,
        monthlyExpenses: 8000,
        riskProfile: 'moderate'
    },
    
    midCareer: {
        age: 45,
        retirementAge: 67,
        monthlySalary: 25000,
        currentSavings: 500000,
        monthlyExpenses: 15000,
        riskProfile: 'conservative'
    },
    
    nearRetirement: {
        age: 62,
        retirementAge: 67,
        monthlySalary: 30000,
        currentSavings: 1500000,
        monthlyExpenses: 20000,
        riskProfile: 'conservative'
    }
};

// tests/fixtures/market-scenarios.js
module.exports = {
    bullMarket: {
        stockReturns: 0.15,
        bondReturns: 0.05,
        inflation: 0.02
    },
    
    bearMarket: {
        stockReturns: -0.10,
        bondReturns: 0.02,
        inflation: 0.04
    },
    
    normal: {
        stockReturns: 0.08,
        bondReturns: 0.04,
        inflation: 0.03
    }
};
```

### Test Data Builders

```javascript
class UserDataBuilder {
    constructor() {
        // Default values
        this.data = {
            age: 40,
            retirementAge: 67,
            monthlySalary: 15000,
            currentSavings: 200000,
            monthlyExpenses: 10000,
            pensionContributions: {
                employee: 6.5,
                employer: 6.5,
                severance: 8.33
            }
        };
    }
    
    withAge(age) {
        this.data.age = age;
        return this;
    }
    
    withYoungProfile() {
        this.data.age = 25;
        this.data.currentSavings = 10000;
        this.data.monthlySalary = 8000;
        return this;
    }
    
    withHighEarnerProfile() {
        this.data.monthlySalary = 50000;
        this.data.currentSavings = 1000000;
        this.data.monthlyExpenses = 25000;
        return this;
    }
    
    withCoupleData(partner2Data) {
        this.data.planningType = 'couple';
        this.data.partner1 = { ...this.data };
        this.data.partner2 = partner2Data;
        return this;
    }
    
    build() {
        return { ...this.data };
    }
}

// Usage in tests
test.it('should calculate for high earner', () => {
    const userData = new UserDataBuilder()
        .withHighEarnerProfile()
        .withAge(45)
        .build();
    
    const result = calculator.calculate(userData);
    test.expect(result.monthlyPension).toBeGreaterThan(20000);
});
```

### Random Test Data Generation

```javascript
// For property-based testing
function generateRandomUser() {
    return {
        age: randomInt(18, 70),
        retirementAge: randomInt(60, 75),
        monthlySalary: randomInt(5000, 100000),
        currentSavings: randomInt(0, 5000000),
        monthlyExpenses: randomInt(3000, 50000)
    };
}

test.it('should never return negative pension for valid inputs', () => {
    // Test with 100 random inputs
    for (let i = 0; i < 100; i++) {
        const user = generateRandomUser();
        
        // Ensure retirement age > current age
        if (user.retirementAge <= user.age) {
            user.retirementAge = user.age + 5;
        }
        
        const result = calculator.calculate(user);
        test.expect(result.monthlyPension).toBeGreaterThanOrEqual(0);
    }
});
```

## Performance Considerations

### 1. Keep Tests Fast

```javascript
// ❌ Bad - Slow test
test.it('should handle large dataset', () => {
    const data = generateLargeDataset(1000000); // Too much!
    const result = processData(data);
    test.expect(result).toBeDefined();
});

// ✅ Good - Fast with representative data
test.it('should handle large dataset efficiently', () => {
    // Use smaller representative sample
    const data = generateDataset(100);
    const startTime = Date.now();
    
    const result = processData(data);
    
    const duration = Date.now() - startTime;
    test.expect(duration).toBeLessThan(100); // Should be fast
    test.expect(result).toBeDefined();
});
```

### 2. Avoid Real Network Calls

```javascript
// ❌ Bad - Real API call
test.it('should fetch stock price', async () => {
    const price = await fetchStockPrice('AAPL'); // Slow, flaky
    test.expect(price).toBeGreaterThan(0);
});

// ✅ Good - Mocked response
test.it('should fetch stock price', async () => {
    mockApi.fetchStockPrice.mockResolvedValue(150.00);
    
    const price = await fetchStockPrice('AAPL');
    test.expect(price).toBe(150.00);
});
```

### 3. Optimize Test Setup

```javascript
// ❌ Bad - Expensive setup for each test
test.beforeEach(async () => {
    await initializeDatabase();
    await loadAllData();
    await createComplexState();
});

// ✅ Good - Minimal necessary setup
let sharedData;

test.beforeAll(async () => {
    // One-time expensive setup
    sharedData = await loadTestData();
});

test.beforeEach(() => {
    // Quick reset
    calculator = new Calculator(sharedData);
});
```

## Maintenance Guidelines

### 1. Regular Test Review

```javascript
// Add metadata to track test health
test.it('should calculate compound interest', () => {
    // @last-modified: 2024-01-15
    // @reviewer: TeamLead
    // @flakiness: low
    // @performance: <50ms
    
    const result = calculateCompoundInterest(1000, 0.05, 10);
    test.expect(result).toBe(1628.89);
});
```

### 2. Test Refactoring

```javascript
// Before - Duplicated setup
test.it('test 1', () => {
    const user = { age: 30, salary: 10000 };
    const calc = new Calculator(user);
    // ...
});

test.it('test 2', () => {
    const user = { age: 30, salary: 10000 };
    const calc = new Calculator(user);
    // ...
});

// After - Extracted helper
function createTestCalculator(overrides = {}) {
    const defaultUser = { age: 30, salary: 10000 };
    const user = { ...defaultUser, ...overrides };
    return new Calculator(user);
}

test.it('test 1', () => {
    const calc = createTestCalculator();
    // ...
});

test.it('test 2', () => {
    const calc = createTestCalculator({ salary: 20000 });
    // ...
});
```

### 3. Test Documentation

```javascript
test.describe('Retirement Projections', () => {
    /**
     * These tests verify the core retirement projection algorithm.
     * Key scenarios tested:
     * - Normal retirement (age 67)
     * - Early retirement (age 60)
     * - Different market conditions
     * - Various contribution rates
     * 
     * Note: All monetary values are in ILS unless specified
     */
    
    test.it('should project normal retirement scenario', () => {
        // Standard case: 30-year accumulation period
        // Expected to follow compound interest formula
        // ...
    });
});
```

### 4. Handling Flaky Tests

```javascript
// Identify and fix flaky tests immediately
test.it('should update UI after calculation', async () => {
    // Mark flaky tests
    // @flaky: Sometimes fails due to timing
    // @issue: #123
    
    await calculator.calculate();
    
    // Add explicit wait instead of hoping
    await waitFor(() => {
        const result = getUIElement('.result');
        return result && result.textContent !== '';
    }, { timeout: 5000 });
    
    test.expect(getUIElement('.result').textContent).toBe('₪1,234,567');
});
```

---

Remember: Good tests are an investment in code quality and team productivity. Take time to write them well!