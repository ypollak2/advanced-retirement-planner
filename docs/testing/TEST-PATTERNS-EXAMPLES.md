# Test Patterns and Examples

## Common Testing Patterns for Retirement Planner

This document provides specific test patterns and examples for the Advanced Retirement Planner application.

## Table of Contents
1. [Financial Calculation Tests](#financial-calculation-tests)
2. [Form Validation Tests](#form-validation-tests)
3. [Component Integration Tests](#component-integration-tests)
4. [Wizard Flow Tests](#wizard-flow-tests)
5. [Currency and Localization Tests](#currency-and-localization-tests)
6. [State Management Tests](#state-management-tests)
7. [API and External Service Tests](#api-and-external-service-tests)
8. [Performance Tests](#performance-tests)

## Financial Calculation Tests

### Testing Pension Calculations

```javascript
test.describe('Pension Calculations', () => {
    test.it('should calculate monthly pension with standard contribution rates', () => {
        const inputs = {
            monthlySalary: 15000,
            yearsOfService: 30,
            employeeRate: 6.5,
            employerRate: 6.5,
            severanceRate: 8.33
        };
        
        const result = calculateMonthlyPension(inputs);
        
        // Employee contribution: 15000 * 0.065 * 30 * 12 = 351,000
        // Employer contribution: 15000 * 0.065 * 30 * 12 = 351,000
        // Total accumulation: 702,000
        // Monthly pension (assuming 240 months): 2,925
        
        test.expect(result.monthlyPension).toBe(2925);
        test.expect(result.totalAccumulation).toBe(702000);
    });
    
    test.it('should handle partial years of service', () => {
        const inputs = {
            monthlySalary: 10000,
            yearsOfService: 15.5,
            employeeRate: 6.5,
            employerRate: 6.5
        };
        
        const result = calculateMonthlyPension(inputs);
        test.expect(result.yearsUsed).toBe(15.5);
        test.expect(result.monthsOfService).toBe(186);
    });
    
    test.it('should apply maximum pension limits', () => {
        const inputs = {
            monthlySalary: 100000, // Very high salary
            yearsOfService: 40,
            employeeRate: 6.5,
            employerRate: 6.5
        };
        
        const result = calculateMonthlyPension(inputs);
        test.expect(result.limitApplied).toBe(true);
        test.expect(result.monthlyPension).toBeLessThanOrEqual(50000); // Max limit
    });
});
```

### Testing Investment Returns

```javascript
test.describe('Investment Return Calculations', () => {
    const testPortfolios = [
        {
            name: 'Conservative',
            allocations: [
                { index: 0, percentage: 20, assetClass: 'stocks' },
                { index: 1, percentage: 70, assetClass: 'bonds' },
                { index: 2, percentage: 10, assetClass: 'cash' }
            ],
            expectedReturn: 4.5
        },
        {
            name: 'Aggressive',
            allocations: [
                { index: 0, percentage: 80, assetClass: 'stocks' },
                { index: 1, percentage: 15, assetClass: 'bonds' },
                { index: 2, percentage: 5, assetClass: 'alternatives' }
            ],
            expectedReturn: 8.5
        }
    ];
    
    testPortfolios.forEach(portfolio => {
        test.it(`should calculate ${portfolio.name} portfolio returns`, () => {
            const historicalReturns = {
                20: { 0: 10, 1: 4, 2: 2, 3: 12 } // 20-year returns
            };
            
            const result = calculateWeightedReturn(
                portfolio.allocations,
                20,
                historicalReturns
            );
            
            test.expect(result).toBeCloseTo(portfolio.expectedReturn, 1);
        });
    });
    
    test.it('should adjust returns for fees', () => {
        const grossReturn = 8.0;
        const managementFee = 1.2;
        
        const netReturn = getNetReturn(grossReturn, managementFee);
        test.expect(netReturn).toBe(6.8);
    });
});
```

### Testing Tax Calculations

```javascript
test.describe('Tax Calculations', () => {
    test.it('should calculate capital gains tax correctly', () => {
        const testCases = [
            { gain: 100000, rate: 25, expected: 25000 },
            { gain: 500000, rate: 25, expected: 125000 },
            { gain: 0, rate: 25, expected: 0 }
        ];
        
        testCases.forEach(({ gain, rate, expected }) => {
            const tax = calculateCapitalGainsTax(gain, rate);
            test.expect(tax).toBe(expected);
        });
    });
    
    test.it('should apply tax brackets for retirement income', () => {
        const income = 20000; // Monthly income
        const brackets = [
            { min: 0, max: 6790, rate: 10 },
            { min: 6790, max: 9730, rate: 14 },
            { min: 9730, max: 15620, rate: 20 },
            { min: 15620, max: 21710, rate: 31 }
        ];
        
        const tax = calculateIncomeTax(income, brackets);
        
        // Expected calculation:
        // 6790 * 0.10 = 679
        // (9730 - 6790) * 0.14 = 411.60
        // (15620 - 9730) * 0.20 = 1178
        // (20000 - 15620) * 0.31 = 1357.80
        // Total = 3626.40
        
        test.expect(tax).toBeCloseTo(3626.40, 2);
    });
});
```

## Form Validation Tests

### Testing Input Validation

```javascript
test.describe('Form Input Validation', () => {
    test.describe('Age Validation', () => {
        const validAges = [18, 25, 50, 67, 100, 120];
        const invalidAges = [-1, 0, 17, 121, 150, 'thirty', null, undefined, NaN];
        
        validAges.forEach(age => {
            test.it(`should accept valid age: ${age}`, () => {
                const result = validateAge(age);
                test.expect(result.isValid).toBe(true);
            });
        });
        
        invalidAges.forEach(age => {
            test.it(`should reject invalid age: ${age}`, () => {
                const result = validateAge(age);
                test.expect(result.isValid).toBe(false);
                test.expect(result.error).toBeDefined();
            });
        });
    });
    
    test.it('should validate retirement age is greater than current age', () => {
        const result = validateRetirementAge(30, 25);
        test.expect(result.isValid).toBe(false);
        test.expect(result.error).toBe('Retirement age must be greater than current age');
    });
    
    test.it('should validate salary within reasonable bounds', () => {
        const testCases = [
            { salary: 5000, valid: true },
            { salary: 100000, valid: true },
            { salary: 1000000, valid: false, error: 'Salary seems too high' },
            { salary: 0, valid: false, error: 'Salary must be positive' },
            { salary: -5000, valid: false, error: 'Salary must be positive' }
        ];
        
        testCases.forEach(({ salary, valid, error }) => {
            const result = validateSalary(salary);
            test.expect(result.isValid).toBe(valid);
            if (error) {
                test.expect(result.error).toBe(error);
            }
        });
    });
});
```

### Testing Cross-Field Validation

```javascript
test.describe('Cross-Field Validation', () => {
    test.it('should validate expenses do not exceed income', () => {
        const validData = {
            monthlySalary: 15000,
            monthlyExpenses: 10000
        };
        
        const invalidData = {
            monthlySalary: 10000,
            monthlyExpenses: 15000
        };
        
        test.expect(validateExpenseRatio(validData)).toBe(true);
        test.expect(validateExpenseRatio(invalidData)).toBe(false);
    });
    
    test.it('should validate couple data consistency', () => {
        const coupleData = {
            planningType: 'couple',
            partner1CurrentAge: 35,
            partner1RetirementAge: 67,
            partner2CurrentAge: 33,
            partner2RetirementAge: 65
        };
        
        const validation = validateCoupleData(coupleData);
        test.expect(validation.isValid).toBe(true);
        
        // Test age gap validation
        coupleData.partner2CurrentAge = 50; // 15 year gap
        const validation2 = validateCoupleData(coupleData);
        test.expect(validation2.warnings).toContain('Large age gap between partners');
    });
});
```

## Component Integration Tests

### Testing Form and Calculator Integration

```javascript
test.describe('Form Calculator Integration', () => {
    let form;
    let calculator;
    
    test.beforeEach(() => {
        form = mountComponent('RetirementForm');
        calculator = getCalculatorInstance();
    });
    
    test.it('should update calculations when form values change', async () => {
        // Initial state
        const initialResult = calculator.getResults();
        test.expect(initialResult.monthlyPension).toBe(0);
        
        // Update form
        await form.updateField('monthlySalary', 20000);
        await form.updateField('currentAge', 30);
        await form.updateField('retirementAge', 67);
        
        // Wait for calculation
        await waitFor(() => calculator.isCalculating() === false);
        
        // Check updated results
        const updatedResult = calculator.getResults();
        test.expect(updatedResult.monthlyPension).toBeGreaterThan(0);
        test.expect(updatedResult.yearsToRetirement).toBe(37);
    });
    
    test.it('should sync form state with localStorage', async () => {
        // Fill form
        await form.fillFields({
            monthlySalary: 15000,
            currentAge: 35,
            currentSavings: 200000
        });
        
        // Verify saved to localStorage
        const saved = JSON.parse(localStorage.getItem('retirementWizardInputs'));
        test.expect(saved.monthlySalary).toBe(15000);
        test.expect(saved.currentAge).toBe(35);
        
        // Reload form
        const newForm = mountComponent('RetirementForm');
        await newForm.loadSavedData();
        
        // Verify restored
        test.expect(newForm.getFieldValue('monthlySalary')).toBe(15000);
        test.expect(newForm.getFieldValue('currentAge')).toBe(35);
    });
});
```

### Testing Component Communication

```javascript
test.describe('Component Communication', () => {
    test.it('should update results panel when basic form changes', async () => {
        const app = mountApp();
        const basicForm = app.getComponent('BasicForm');
        const resultsPanel = app.getComponent('ResultsPanel');
        
        // Initial state
        test.expect(resultsPanel.isVisible()).toBe(false);
        
        // Fill required fields
        await basicForm.fill({
            currentAge: 40,
            retirementAge: 65,
            monthlySalary: 18000,
            monthlyExpenses: 12000
        });
        
        // Submit form
        await basicForm.submit();
        
        // Results should appear
        test.expect(resultsPanel.isVisible()).toBe(true);
        test.expect(resultsPanel.getMonthlyIncome()).toBeGreaterThan(0);
    });
    
    test.it('should update advanced form when planning type changes', async () => {
        const app = mountApp();
        const planningSelector = app.getComponent('PlanningTypeSelector');
        const advancedForm = app.getComponent('AdvancedForm');
        
        // Individual mode
        await planningSelector.select('individual');
        test.expect(advancedForm.hasPartnerFields()).toBe(false);
        
        // Couple mode
        await planningSelector.select('couple');
        test.expect(advancedForm.hasPartnerFields()).toBe(true);
        test.expect(advancedForm.getPartnerTabs()).toHaveLength(2);
    });
});
```

## Wizard Flow Tests

### Testing Multi-Step Wizard

```javascript
test.describe('Retirement Wizard Flow', () => {
    let wizard;
    
    test.beforeEach(async () => {
        wizard = await launchWizard();
    });
    
    test.it('should complete individual planning wizard', async () => {
        // Step 1: Planning Type
        test.expect(wizard.getCurrentStep()).toBe(1);
        await wizard.selectPlanningType('individual');
        await wizard.next();
        
        // Step 2: Basic Info
        test.expect(wizard.getCurrentStep()).toBe(2);
        await wizard.fillStep({
            currentAge: 35,
            retirementAge: 67,
            monthlyExpenses: 10000
        });
        test.expect(wizard.canProceed()).toBe(true);
        await wizard.next();
        
        // Step 3: Income
        await wizard.fillStep({
            monthlySalary: 15000,
            yearlyBonus: 30000,
            otherIncome: 2000
        });
        await wizard.next();
        
        // Continue through all steps...
        
        // Final step: Review
        test.expect(wizard.getCurrentStep()).toBe(10);
        const summary = wizard.getReviewSummary();
        test.expect(summary.monthlyRetirementIncome).toBeGreaterThan(0);
        test.expect(summary.replacementRatio).toBeGreaterThan(0.6);
        
        // Complete wizard
        await wizard.complete();
        test.expect(wizard.isComplete()).toBe(true);
    });
    
    test.it('should validate required fields before proceeding', async () => {
        await wizard.selectPlanningType('individual');
        await wizard.next();
        
        // Try to proceed without filling required fields
        await wizard.next();
        
        // Should show validation errors
        const errors = wizard.getValidationErrors();
        test.expect(errors).toContain('Current age is required');
        test.expect(errors).toContain('Retirement age is required');
        test.expect(wizard.getCurrentStep()).toBe(2); // Still on same step
    });
    
    test.it('should allow navigation between steps', async () => {
        // Complete first 3 steps
        await wizard.completeSteps(1, 2, 3);
        test.expect(wizard.getCurrentStep()).toBe(4);
        
        // Go back
        await wizard.previous();
        test.expect(wizard.getCurrentStep()).toBe(3);
        
        // Jump to specific step
        await wizard.goToStep(1);
        test.expect(wizard.getCurrentStep()).toBe(1);
        
        // Can't jump to uncompleted step
        await wizard.goToStep(5);
        test.expect(wizard.getCurrentStep()).toBe(1); // Still on step 1
    });
});
```

### Testing Wizard State Persistence

```javascript
test.describe('Wizard State Persistence', () => {
    test.it('should save and restore wizard progress', async () => {
        const wizard = await launchWizard();
        
        // Complete partial wizard
        await wizard.selectPlanningType('couple');
        await wizard.next();
        await wizard.fillStep({
            partner1CurrentAge: 40,
            partner1RetirementAge: 67,
            partner2CurrentAge: 38,
            partner2RetirementAge: 65
        });
        
        // Simulate page reload
        const savedState = wizard.getState();
        await wizard.close();
        
        // Relaunch wizard
        const newWizard = await launchWizard();
        await newWizard.restoreState(savedState);
        
        // Verify restoration
        test.expect(newWizard.getCurrentStep()).toBe(2);
        test.expect(newWizard.getPlanningType()).toBe('couple');
        test.expect(newWizard.getFieldValue('partner1CurrentAge')).toBe(40);
    });
});
```

## Currency and Localization Tests

### Testing Currency Conversion

```javascript
test.describe('Currency Conversion', () => {
    const mockRates = {
        ILS: 1,
        USD: 3.5,
        EUR: 4.0,
        GBP: 4.5,
        BTC: 120000,
        ETH: 8000
    };
    
    test.it('should convert between all supported currencies', () => {
        const amount = 10000; // ILS
        
        const conversions = [
            { to: 'USD', expected: '$2,857' },
            { to: 'EUR', expected: '€2,500' },
            { to: 'GBP', expected: '£2,222' },
            { to: 'BTC', expected: '₿0.083333' },
            { to: 'ETH', expected: 'Ξ1.2500' }
        ];
        
        conversions.forEach(({ to, expected }) => {
            const result = convertCurrency(amount, to, mockRates);
            test.expect(result).toBe(expected);
        });
    });
    
    test.it('should handle currency conversion errors gracefully', () => {
        const testCases = [
            { amount: 1000, currency: 'XXX', rates: mockRates, expected: 'N/A' },
            { amount: 1000, currency: 'USD', rates: null, expected: 'N/A' },
            { amount: null, currency: 'USD', rates: mockRates, expected: 'N/A' },
            { amount: 1000, currency: 'USD', rates: { USD: 0 }, expected: 'N/A' }
        ];
        
        testCases.forEach(({ amount, currency, rates, expected }) => {
            const result = convertCurrency(amount, currency, rates);
            test.expect(result).toBe(expected);
        });
    });
});
```

### Testing Multi-Language Support

```javascript
test.describe('Localization', () => {
    let app;
    
    test.beforeEach(() => {
        app = mountApp();
    });
    
    test.it('should switch between Hebrew and English', async () => {
        // Default language
        test.expect(app.getCurrentLanguage()).toBe('he');
        test.expect(app.getTitle()).toBe('מחשבון פרישה מתקדם');
        
        // Switch to English
        await app.changeLanguage('en');
        test.expect(app.getCurrentLanguage()).toBe('en');
        test.expect(app.getTitle()).toBe('Advanced Retirement Calculator');
        
        // Verify form labels changed
        const labels = app.getFormLabels();
        test.expect(labels.currentAge).toBe('Current Age');
        test.expect(labels.monthlyIncome).toBe('Monthly Income');
    });
    
    test.it('should apply RTL for Hebrew', async () => {
        await app.changeLanguage('he');
        test.expect(app.getDirection()).toBe('rtl');
        test.expect(app.getTextAlign()).toBe('right');
        
        await app.changeLanguage('en');
        test.expect(app.getDirection()).toBe('ltr');
        test.expect(app.getTextAlign()).toBe('left');
    });
    
    test.it('should format numbers according to locale', async () => {
        const number = 1234567.89;
        
        await app.changeLanguage('he');
        test.expect(app.formatNumber(number)).toBe('1,234,568');
        
        await app.changeLanguage('en');
        test.expect(app.formatNumber(number)).toBe('1,234,568');
    });
});
```

## State Management Tests

### Testing Application State

```javascript
test.describe('Application State Management', () => {
    let stateManager;
    
    test.beforeEach(() => {
        stateManager = createStateManager();
    });
    
    test.it('should update calculation results when inputs change', () => {
        // Subscribe to state changes
        const stateChanges = [];
        stateManager.subscribe(state => stateChanges.push(state));
        
        // Update input
        stateManager.updateInput('monthlySalary', 15000);
        
        // Verify state updated
        test.expect(stateChanges).toHaveLength(1);
        test.expect(stateChanges[0].inputs.monthlySalary).toBe(15000);
        test.expect(stateChanges[0].isDirty).toBe(true);
        
        // Trigger calculation
        stateManager.calculate();
        
        // Verify results updated
        test.expect(stateChanges).toHaveLength(2);
        test.expect(stateChanges[1].results).toBeDefined();
        test.expect(stateChanges[1].isDirty).toBe(false);
    });
    
    test.it('should handle undo/redo operations', () => {
        // Make changes
        stateManager.updateInput('currentAge', 30);
        stateManager.updateInput('currentAge', 35);
        stateManager.updateInput('currentAge', 40);
        
        // Undo
        stateManager.undo();
        test.expect(stateManager.getInput('currentAge')).toBe(35);
        
        stateManager.undo();
        test.expect(stateManager.getInput('currentAge')).toBe(30);
        
        // Redo
        stateManager.redo();
        test.expect(stateManager.getInput('currentAge')).toBe(35);
    });
    
    test.it('should validate state consistency', () => {
        // Set invalid state
        stateManager.updateInput('currentAge', 65);
        stateManager.updateInput('retirementAge', 60);
        
        // Validate
        const validation = stateManager.validate();
        test.expect(validation.isValid).toBe(false);
        test.expect(validation.errors).toContain('Retirement age must be greater than current age');
        
        // Auto-fix
        stateManager.autoFix();
        test.expect(stateManager.getInput('retirementAge')).toBe(67); // Default retirement age
    });
});
```

## API and External Service Tests

### Testing Stock Price API

```javascript
test.describe('Stock Price API', () => {
    let api;
    let mockFetch;
    
    test.beforeEach(() => {
        mockFetch = createMock('fetch');
        global.fetch = mockFetch;
        api = createStockPriceAPI();
    });
    
    test.afterEach(() => {
        delete global.fetch;
    });
    
    test.it('should fetch stock price successfully', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                symbol: 'AAPL',
                price: 175.50,
                currency: 'USD'
            })
        });
        
        const result = await api.getStockPrice('AAPL');
        
        test.expect(result.price).toBe(175.50);
        test.expect(result.currency).toBe('USD');
        test.expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('AAPL')
        );
    });
    
    test.it('should handle API errors gracefully', async () => {
        mockFetch.mockRejectedValue(new Error('Network error'));
        
        const result = await api.getStockPrice('AAPL');
        
        test.expect(result.error).toBe('Failed to fetch stock price');
        test.expect(result.price).toBe(null);
    });
    
    test.it('should use cache for recent requests', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({ price: 175.50 })
        });
        
        // First call
        await api.getStockPrice('AAPL');
        test.expect(mockFetch).toHaveBeenCalledTimes(1);
        
        // Second call within cache period
        await api.getStockPrice('AAPL');
        test.expect(mockFetch).toHaveBeenCalledTimes(1); // Still 1
        
        // Wait for cache to expire
        await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000));
        
        // Third call after cache expiry
        await api.getStockPrice('AAPL');
        test.expect(mockFetch).toHaveBeenCalledTimes(2);
    });
});
```

### Testing CORS Proxy

```javascript
test.describe('CORS Proxy', () => {
    test.it('should only allow whitelisted domains', async () => {
        const proxy = createCORSProxy();
        
        // Allowed domain
        const yahooRequest = await proxy.request('https://finance.yahoo.com/quote/AAPL');
        test.expect(yahooRequest.allowed).toBe(true);
        
        // Blocked domain
        const unknownRequest = await proxy.request('https://malicious-site.com/data');
        test.expect(unknownRequest.allowed).toBe(false);
        test.expect(unknownRequest.error).toBe('Domain not whitelisted');
    });
    
    test.it('should add appropriate headers', async () => {
        const proxy = createCORSProxy();
        const request = await proxy.buildRequest('https://finance.yahoo.com/api');
        
        test.expect(request.headers['X-Requested-With']).toBe('XMLHttpRequest');
        test.expect(request.mode).toBe('cors');
    });
});
```

## Performance Tests

### Testing Calculation Performance

```javascript
test.describe('Performance Benchmarks', () => {
    test.it('should calculate retirement projection within 50ms', () => {
        const inputs = generateComplexInputs(); // Large dataset
        
        const startTime = performance.now();
        const result = calculateRetirement(inputs);
        const duration = performance.now() - startTime;
        
        test.expect(duration).toBeLessThan(50);
        test.expect(result).toBeDefined();
    });
    
    test.it('should handle 1000 Monte Carlo simulations efficiently', () => {
        const scenarios = 1000;
        const inputs = {
            initialAmount: 500000,
            monthlyContribution: 5000,
            years: 30
        };
        
        const startTime = performance.now();
        const results = runMonteCarloSimulation(inputs, scenarios);
        const duration = performance.now() - startTime;
        
        test.expect(duration).toBeLessThan(1000); // 1 second for 1000 simulations
        test.expect(results.scenarios).toHaveLength(scenarios);
        test.expect(results.percentiles).toBeDefined();
    });
    
    test.it('should not leak memory during repeated calculations', () => {
        const initialMemory = performance.memory?.usedJSHeapSize || 0;
        
        // Run 100 calculations
        for (let i = 0; i < 100; i++) {
            const inputs = generateRandomInputs();
            calculateRetirement(inputs);
        }
        
        // Force garbage collection if available
        if (global.gc) global.gc();
        
        const finalMemory = performance.memory?.usedJSHeapSize || 0;
        const memoryGrowth = finalMemory - initialMemory;
        
        // Should not grow more than 10MB
        test.expect(memoryGrowth).toBeLessThan(10 * 1024 * 1024);
    });
});
```

---

These patterns demonstrate real-world testing scenarios specific to the Advanced Retirement Planner application. Use them as templates for writing comprehensive tests for new features.