// Component Tests for Browser Execution
// Tests individual components in isolation

testRunner.describe('Component Loading Tests', () => {
    testRunner.it('should load all required utilities', () => {
        // Check core utilities
        assert.ok(window.calculateRetirement, 'calculateRetirement function should be loaded');
        assert.ok(window.formatCurrency, 'formatCurrency function should be loaded');
        assert.ok(window.multiLanguage, 'multiLanguage object should be loaded');
        assert.ok(window.countryData, 'countryData object should be loaded');
        
        // Check financial utilities
        assert.ok(window.financialHealthEngine, 'financialHealthEngine should be loaded');
        assert.ok(window.CurrencyAPI, 'CurrencyAPI class should be loaded');
        assert.ok(window.currencyAPI, 'currencyAPI instance should be loaded');
        
        // Check validation utilities
        assert.ok(window.coupleValidation, 'coupleValidation should be loaded');
        assert.ok(window.performanceOptimizer, 'performanceOptimizer should be loaded');
    });
    
    testRunner.it('should load all React components', () => {
        // Core components
        assert.ok(window.RetirementPlannerApp, 'RetirementPlannerApp should be loaded');
        assert.ok(window.ErrorBoundary, 'ErrorBoundary should be loaded');
        
        // Form components
        assert.ok(window.BasicInputs, 'BasicInputs should be loaded');
        assert.ok(window.AdvancedInputs, 'AdvancedInputs should be loaded');
        
        // Wizard components
        assert.ok(window.RetirementWizard, 'RetirementWizard should be loaded');
        assert.ok(window.WizardStep, 'WizardStep should be loaded');
        assert.ok(window.WizardStepPersonal, 'WizardStepPersonal should be loaded');
        assert.ok(window.WizardStepSalary, 'WizardStepSalary should be loaded');
        assert.ok(window.WizardStepSavings, 'WizardStepSavings should be loaded');
        
        // Panel components
        assert.ok(window.ResultsPanel, 'ResultsPanel should be loaded');
        assert.ok(window.SavingsSummaryPanel, 'SavingsSummaryPanel should be loaded');
        assert.ok(window.FinancialHealthScoreEnhanced, 'FinancialHealthScoreEnhanced should be loaded');
    });
    
    testRunner.it('should have correct React version', () => {
        assert.ok(window.React, 'React should be available globally');
        assert.ok(window.ReactDOM, 'ReactDOM should be available globally');
        
        const reactVersion = React.version;
        assert.ok(reactVersion.startsWith('18'), `React version should be 18.x, got ${reactVersion}`);
    });
});

testRunner.describe('Currency API Tests', () => {
    testRunner.it('should create CurrencyAPI instance correctly', () => {
        const api = new window.CurrencyAPI();
        assert.ok(api, 'Should create CurrencyAPI instance');
        assert.equal(typeof api.fetchExchangeRates, 'function', 'Should have fetchExchangeRates method');
        assert.equal(typeof api.getRate, 'function', 'Should have getRate method');
        assert.equal(typeof api.convertAmount, 'function', 'Should have convertAmount method');
    });
    
    testRunner.it('should have fetchExchangeRates method (not getExchangeRates)', () => {
        const api = new window.CurrencyAPI();
        assert.ok(api.fetchExchangeRates, 'Should have fetchExchangeRates method');
        assert.notOk(api.getExchangeRates, 'Should NOT have getExchangeRates method');
    });
    
    testRunner.it('should handle currency conversion with fallback rates', async () => {
        const api = new window.CurrencyAPI();
        
        // Test conversion with fallback rates
        const usdRate = await api.getRate('USD', 'ILS');
        assert.ok(usdRate > 0, 'USD to ILS rate should be positive');
        assert.ok(usdRate >= 3 && usdRate <= 5, `USD to ILS rate should be reasonable (3-5), got ${usdRate}`);
        
        // Test amount conversion
        const amount = await api.convertAmount(100, 'USD', 'ILS');
        assert.ok(amount > 0, 'Converted amount should be positive');
        assert.ok(amount >= 300 && amount <= 500, `100 USD should convert to 300-500 ILS, got ${amount}`);
    });
});

testRunner.describe('Component Rendering Tests', () => {
    testRunner.it('should render EnhancedRSUCompanySelector without errors', async () => {
        // Create a test container
        const container = document.createElement('div');
        container.id = 'test-container';
        document.body.appendChild(container);
        
        try {
            // Test that component can be created
            const component = React.createElement(window.EnhancedRSUCompanySelector, {
                inputs: { workingCurrency: 'ILS' },
                updateInputs: () => {},
                language: 'en'
            });
            
            // Render the component
            const root = ReactDOM.createRoot(container);
            
            // This should not throw an error about getExchangeRates
            await new Promise((resolve, reject) => {
                try {
                    root.render(component);
                    setTimeout(resolve, 100); // Give time for useEffect to run
                } catch (error) {
                    reject(error);
                }
            });
            
            // Check that component rendered
            const rendered = container.querySelector('div');
            assert.ok(rendered, 'Component should render');
            
        } finally {
            // Cleanup
            document.body.removeChild(container);
        }
    });
    
    testRunner.it('should render PartnerRSUSelector without errors', async () => {
        const container = document.createElement('div');
        container.id = 'test-container';
        document.body.appendChild(container);
        
        try {
            const component = React.createElement(window.PartnerRSUSelector, {
                partner: 'partner1',
                inputs: { planningType: 'couple', partner1Currency: 'ILS' },
                updateInputs: () => {},
                language: 'en'
            });
            
            const root = ReactDOM.createRoot(container);
            
            await new Promise((resolve, reject) => {
                try {
                    root.render(component);
                    setTimeout(resolve, 100);
                } catch (error) {
                    reject(error);
                }
            });
            
            const rendered = container.querySelector('div');
            assert.ok(rendered, 'Component should render');
            
        } finally {
            document.body.removeChild(container);
        }
    });
});

testRunner.describe('Financial Calculations Tests', () => {
    testRunner.it('should calculate retirement correctly', () => {
        const inputs = {
            currentAge: 30,
            retirementAge: 65,
            currentSavings: 100000,
            monthlySalary: 10000,
            monthlyExpenses: 6000,
            inflationRate: 3,
            returnRate: 7,
            // Add required pension contribution fields
            pensionEmployeeRate: 6.5,
            pensionEmployerRate: 6.5,
            monthlyContribution: 1300, // monthlySalary * 0.13
            pensionSavings: 50000,
            trainingFundValue: 30000
        };
        
        const result = window.calculateRetirement(inputs);
        assert.ok(result, 'Should return calculation result');
        assert.ok(result.totalSavings > 0, 'Total savings should be positive');
        assert.ok(result.monthlyRetirementIncome > 0, 'Monthly retirement income should be positive');
    });
    
    testRunner.it('should format currency correctly', () => {
        const formatted = window.formatCurrency(1234567);
        assert.ok(formatted.includes('1,234,567'), 'Should format with thousand separators');
        
        // Test different currencies
        const usd = window.formatCurrency(100, 'USD');
        assert.ok(usd.includes('$'), 'USD should include dollar sign');
        
        const ils = window.formatCurrency(100, 'ILS');
        assert.ok(ils.includes('₪'), 'ILS should include shekel sign');
    });
});

testRunner.describe('Multi-language Support Tests', () => {
    testRunner.it('should have Hebrew and English translations', () => {
        assert.ok(window.multiLanguage.he, 'Should have Hebrew translations');
        assert.ok(window.multiLanguage.en, 'Should have English translations');
        
        // Check key translation sections exist
        assert.ok(window.multiLanguage.he.common, 'Hebrew should have common section');
        assert.ok(window.multiLanguage.en.common, 'English should have common section');
        
        // Test specific translations
        assert.equal(window.multiLanguage.en.common.next, 'Next', 'English Next button');
        assert.equal(window.multiLanguage.he.common.next, 'הבא', 'Hebrew Next button');
    });
});

testRunner.describe('Couple Mode Tests', () => {
    testRunner.it('should handle couple mode field mapping', () => {
        const inputs = {
            planningType: 'couple',
            partner1Salary: 10000,
            partner2Salary: 8000,
            partner1CurrentAge: 35,
            partner2CurrentAge: 33
        };
        
        // Test getFieldValue function
        const combinedSalary = window.getFieldValue(inputs, ['partner1Salary', 'partner2Salary'], {
            combinePartners: true
        });
        
        assert.equal(combinedSalary, 18000, 'Should combine partner salaries correctly');
    });
    
    testRunner.it('should validate couple data correctly', () => {
        const validation = window.coupleValidation;
        assert.ok(validation, 'Couple validation should be loaded');
        
        // Test validation functions
        assert.equal(typeof validation.validateCoupleData, 'function', 'Should have validateCoupleData function');
        assert.equal(typeof validation.validatePartnerAge, 'function', 'Should have validatePartnerAge function');
    });
});

testRunner.describe('Performance Tests', () => {
    testRunner.it('should track performance metrics', () => {
        assert.ok(window.performanceMonitor, 'Performance monitor should be loaded');
        
        // Check that performance tracking is set up
        const metrics = window.performanceMonitor.getMetrics();
        assert.ok(metrics, 'Should have performance metrics');
    });
    
    testRunner.it('should optimize calculations', () => {
        assert.ok(window.performanceOptimizer, 'Performance optimizer should be loaded');
        
        // Test cache functionality
        const testKey = 'test-calculation';
        const testValue = { result: 42 };
        
        window.performanceOptimizer.cacheResult(testKey, testValue);
        const cached = window.performanceOptimizer.getCachedResult(testKey);
        
        assert.deepEqual(cached, testValue, 'Should cache and retrieve results');
    });
});

console.log('✅ Component tests loaded');