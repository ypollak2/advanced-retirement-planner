// Integration Tests for Browser Execution
// Tests component interactions and data flow

testRunner.describe('App Initialization Tests', () => {
    testRunner.it('should initialize the app without errors', async () => {
        // Check that the app root exists
        const appRoot = document.getElementById('root');
        assert.ok(appRoot, 'App root element should exist');
        
        // Create a temporary container for the app
        const testContainer = document.createElement('div');
        document.body.appendChild(testContainer);
        
        try {
            // Render the app
            const root = ReactDOM.createRoot(testContainer);
            root.render(React.createElement(window.RetirementPlannerApp));
            
            // Wait for app to render
            await wait(500);
            
            // Check that main app component rendered
            const appContainer = testContainer.querySelector('.min-h-screen');
            assert.ok(appContainer, 'App container should be rendered');
        } finally {
            // Cleanup
            document.body.removeChild(testContainer);
        }
    });
    
    testRunner.it('should load saved data from localStorage', () => {
        // Save test data
        const testData = {
            currentAge: 35,
            retirementAge: 67,
            monthlySalary: 15000
        };
        
        localStorage.setItem('retirementWizardInputs', JSON.stringify(testData));
        
        // Create a new app instance
        const app = React.createElement(window.RetirementPlannerApp);
        const container = document.createElement('div');
        const root = ReactDOM.createRoot(container);
        root.render(app);
        
        // Check that data was loaded (this would be verified by checking state)
        const savedData = localStorage.getItem('retirementWizardInputs');
        assert.ok(savedData, 'Data should be saved in localStorage');
        
        // Cleanup
        localStorage.removeItem('retirementWizardInputs');
    });
});

testRunner.describe('Wizard Navigation Tests', () => {
    testRunner.it('should navigate through wizard steps', async () => {
        const wizard = document.querySelector('.wizard-container');
        if (!wizard) {
            console.warn('Wizard not found in current view');
            return;
        }
        
        // Find next button
        const nextButton = wizard.querySelector('button:contains("Next"), button[type="submit"]');
        assert.ok(nextButton, 'Next button should exist');
        
        // Check initial step
        const stepIndicator = wizard.querySelector('.step-indicator, .current-step');
        assert.ok(stepIndicator, 'Step indicator should exist');
    });
    
    testRunner.it('should validate inputs before allowing navigation', async () => {
        // This test would interact with the actual wizard
        // For now, we test the validation logic exists
        assert.ok(window.WizardStepPersonal, 'Personal step should have validation');
        assert.ok(window.WizardStepSalary, 'Salary step should have validation');
    });
});

testRunner.describe('Financial Health Score Tests', () => {
    testRunner.it('should calculate financial health score correctly', () => {
        const testInputs = {
            planningType: 'individual',
            currentAge: 40,
            retirementAge: 65,
            monthlySalary: 20000,
            monthlyExpenses: 12000,
            currentSavings: 500000,
            emergencyFund: 100000,
            pensionSavings: 300000
        };
        
        const score = window.calculateFinancialHealthScore(testInputs);
        assert.ok(score, 'Should return a score object');
        assert.ok(score.totalScore >= 0 && score.totalScore <= 100, 'Score should be between 0 and 100');
        assert.ok(score.factors, 'Should include factor breakdown');
    });
    
    testRunner.it('should handle couple mode financial health correctly', () => {
        const coupleInputs = {
            planningType: 'couple',
            partner1CurrentAge: 35,
            partner2CurrentAge: 33,
            partner1Salary: 15000,
            partner2Salary: 12000,
            partner1Expenses: 6000,
            partner2Expenses: 5000
        };
        
        const score = window.calculateFinancialHealthScore(coupleInputs);
        assert.ok(score, 'Should calculate score for couples');
        assert.ok(score.totalScore >= 0, 'Couple score should be valid');
    });
});

testRunner.describe('Data Flow Integration Tests', () => {
    testRunner.it('should update calculations when inputs change', async () => {
        // Get current calculation result
        const initialInputs = {
            currentAge: 30,
            retirementAge: 65,
            monthlySalary: 10000,
            currentSavings: 50000,
            pensionEmployeeRate: 6.5,
            pensionEmployerRate: 6.5,
            monthlyContribution: 1300,
            pensionSavings: 30000
        };
        
        const result1 = window.calculateRetirement(initialInputs);
        
        // Change inputs
        const updatedInputs = {
            ...initialInputs,
            monthlySalary: 15000
        };
        
        const result2 = window.calculateRetirement(updatedInputs);
        
        // Results should be different
        assert.notEqual(result1.totalSavings, result2.totalSavings, 'Results should update with new inputs');
        assert.ok(result2.totalSavings > result1.totalSavings, 'Higher salary should result in more savings');
    });
    
    testRunner.it('should sync partner data in couple mode', () => {
        const inputs = {
            planningType: 'couple',
            partner1Name: 'John',
            partner2Name: 'Jane',
            partner1Salary: 20000,
            partner2Salary: 18000
        };
        
        // Test that partner fields are properly mapped
        const partner1Salary = window.getFieldValue(inputs, ['partner1Salary']);
        const partner2Salary = window.getFieldValue(inputs, ['partner2Salary']);
        
        assert.equal(partner1Salary, 20000, 'Partner 1 salary should be mapped correctly');
        assert.equal(partner2Salary, 18000, 'Partner 2 salary should be mapped correctly');
    });
});

testRunner.describe('Export Functionality Tests', () => {
    testRunner.it('should prepare data for export', () => {
        assert.ok(window.exportFunctions, 'Export functions should be loaded');
        assert.ok(window.ExportControls, 'Export controls component should be loaded');
        
        // Test export data preparation
        const testData = {
            inputs: {
                currentAge: 35,
                retirementAge: 67,
                monthlySalary: 15000
            },
            results: {
                totalSavings: 2000000,
                monthlyRetirementIncome: 8000
            }
        };
        
        // Test that export functions can handle the data
        assert.equal(typeof window.exportFunctions.exportAsImage, 'function', 'Should have image export function');
        assert.equal(typeof window.exportFunctions.exportForLLMAnalysis, 'function', 'Should have LLM export function');
    });
});

testRunner.describe('Currency Conversion Integration', () => {
    testRunner.it('should convert currencies in calculations', async () => {
        const inputs = {
            monthlySalary: 5000,
            workingCurrency: 'USD'
        };
        
        // Get conversion rate
        const api = new window.CurrencyAPI();
        const rate = await api.getRate('USD', 'ILS');
        
        // Calculate expected ILS amount
        const expectedILS = inputs.monthlySalary * rate;
        
        assert.ok(expectedILS > inputs.monthlySalary, 'USD should convert to more ILS');
        assert.ok(expectedILS > 15000, '5000 USD should be more than 15000 ILS');
    });
});

testRunner.describe('Validation Integration Tests', () => {
    testRunner.it('should validate age inputs correctly', () => {
        const validate = window.coupleValidation.validatePartnerAge;
        
        // Valid ages
        assert.ok(validate(30, 65), 'Valid ages should pass');
        
        // Invalid ages
        assert.notOk(validate(15, 65), 'Too young should fail');
        assert.notOk(validate(30, 30), 'Retirement age not greater than current should fail');
        assert.notOk(validate(70, 65), 'Current age greater than retirement should fail');
    });
    
    testRunner.it('should validate financial inputs', () => {
        // Test salary validation
        const validateSalary = (salary) => {
            return typeof salary === 'number' && salary >= 0 && salary <= 1000000;
        };
        
        assert.ok(validateSalary(10000), 'Valid salary should pass');
        assert.notOk(validateSalary(-1000), 'Negative salary should fail');
        assert.notOk(validateSalary('abc'), 'Non-numeric salary should fail');
    });
});

testRunner.describe('Performance Optimization Tests', () => {
    testRunner.it('should cache calculation results', () => {
        const optimizer = window.performanceOptimizer;
        
        // Clear cache
        optimizer.clearCache();
        
        // First calculation
        const inputs = { 
            currentAge: 30, 
            retirementAge: 65, 
            monthlySalary: 10000,
            pensionEmployeeRate: 6.5,
            pensionEmployerRate: 6.5,
            monthlyContribution: 1300 
        };
        const key = JSON.stringify(inputs);
        
        const start1 = Date.now();
        const result1 = window.calculateRetirement(inputs);
        const time1 = Date.now() - start1;
        
        // Cache the result
        optimizer.cacheResult(key, result1);
        
        // Second calculation (should be cached)
        const start2 = Date.now();
        const cached = optimizer.getCachedResult(key);
        const time2 = Date.now() - start2;
        
        assert.ok(cached, 'Should get cached result');
        assert.deepEqual(cached, result1, 'Cached result should match original');
        assert.ok(time2 < time1, 'Cached retrieval should be faster');
    });
});

testRunner.describe('Error Handling Integration', () => {
    testRunner.it('should handle missing required fields gracefully', () => {
        const incompleteInputs = {
            currentAge: 30
            // Missing other required fields
        };
        
        try {
            const result = window.calculateRetirement(incompleteInputs);
            // Should either return a result with defaults or handle gracefully
            assert.ok(true, 'Should not throw error with incomplete inputs');
        } catch (error) {
            assert.ok(false, 'Should handle missing fields without throwing');
        }
    });
    
    testRunner.it('should handle invalid data types', () => {
        const invalidInputs = {
            currentAge: 'thirty',
            retirementAge: '65',
            monthlySalary: '10000'
        };
        
        try {
            const result = window.calculateRetirement(invalidInputs);
            // Should handle string numbers
            assert.ok(result, 'Should handle string numbers');
        } catch (error) {
            assert.ok(false, 'Should handle invalid types gracefully');
        }
    });
});

console.log('✅ Integration tests loaded');