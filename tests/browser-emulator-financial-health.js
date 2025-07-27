// Browser Emulator Test for Financial Health Score Robustness
// Tests various missing input scenarios to ensure no crashes occur

// Test Configuration
const TEST_CONFIG = {
    showDetails: true,
    stopOnError: false,
    logLevel: 'info' // 'debug', 'info', 'error'
};

// Test Scenarios covering various edge cases
const testScenarios = [
    {
        name: 'Completely Empty Inputs',
        inputs: {},
        expectedBehavior: 'Should return 0 scores without crashing'
    },
    {
        name: 'Missing Portfolio Allocations',
        inputs: {
            currentAge: 30,
            retirementAge: 67,
            currentMonthlySalary: 10000,
            pensionContributionRate: 6.5,
            // portfolioAllocations is missing
        },
        expectedBehavior: 'Should handle missing allocations gracefully'
    },
    {
        name: 'Undefined Portfolio Allocations Array',
        inputs: {
            currentAge: 35,
            retirementAge: 65,
            currentMonthlySalary: 15000,
            portfolioAllocations: undefined
        },
        expectedBehavior: 'Should not crash on undefined array'
    },
    {
        name: 'Empty Portfolio Allocations Array',
        inputs: {
            currentAge: 40,
            retirementAge: 70,
            currentMonthlySalary: 20000,
            portfolioAllocations: []
        },
        expectedBehavior: 'Should handle empty array without errors'
    },
    {
        name: 'Zero Exchange Rates',
        inputs: {
            currentAge: 30,
            retirementAge: 67,
            currentMonthlySalary: 10000,
            workingCurrency: 'USD',
            exchangeRates: { USD: 0, EUR: 0, GBP: 0 }
        },
        expectedBehavior: 'Should handle zero exchange rates'
    },
    {
        name: 'Missing Exchange Rates Object',
        inputs: {
            currentAge: 30,
            retirementAge: 67,
            currentMonthlySalary: 10000,
            workingCurrency: 'EUR',
            exchangeRates: undefined
        },
        expectedBehavior: 'Should handle missing exchange rates'
    },
    {
        name: 'Invalid Numeric Values',
        inputs: {
            currentAge: 'thirty',
            retirementAge: NaN,
            currentMonthlySalary: 'ten thousand',
            pensionContributionRate: Infinity
        },
        expectedBehavior: 'Should handle invalid numeric inputs'
    },
    {
        name: 'Missing Expense Data',
        inputs: {
            currentAge: 45,
            retirementAge: 67,
            currentMonthlySalary: 25000,
            // expenses object is missing
        },
        expectedBehavior: 'Should calculate without expense data'
    },
    {
        name: 'Partial Expense Data',
        inputs: {
            currentAge: 50,
            retirementAge: 67,
            currentMonthlySalary: 30000,
            expenses: {
                housing: 5000,
                // other categories missing
            }
        },
        expectedBehavior: 'Should handle partial expense data'
    },
    {
        name: 'Couple Mode with Missing Partner Data',
        inputs: {
            planningType: 'couple',
            currentAge: 35,
            retirementAge: 65,
            currentMonthlySalary: 15000,
            // partner data missing
        },
        expectedBehavior: 'Should handle missing partner data in couple mode'
    },
    {
        name: 'Invalid Allocation Objects',
        inputs: {
            currentAge: 40,
            retirementAge: 67,
            currentMonthlySalary: 18000,
            portfolioAllocations: [
                null,
                undefined,
                { percentage: 'fifty' },
                { index: 'stocks' }, // missing percentage
                {} // empty object
            ]
        },
        expectedBehavior: 'Should filter out invalid allocation objects'
    },
    {
        name: 'Missing Savings Rate Inputs',
        inputs: {
            currentAge: 30,
            retirementAge: 67,
            // No salary or contribution data
        },
        expectedBehavior: 'Should handle missing savings rate inputs'
    },
    {
        name: 'Zero Monthly Income',
        inputs: {
            currentAge: 30,
            retirementAge: 67,
            currentMonthlySalary: 0,
            monthlyContribution: 1000
        },
        expectedBehavior: 'Should handle zero income scenario'
    },
    {
        name: 'Negative Values',
        inputs: {
            currentAge: 30,
            retirementAge: 67,
            currentMonthlySalary: -10000,
            currentSavings: -5000,
            monthlyContribution: -500
        },
        expectedBehavior: 'Should handle negative values appropriately'
    },
    {
        name: 'Very Large Numbers',
        inputs: {
            currentAge: 30,
            retirementAge: 67,
            currentMonthlySalary: 9999999999,
            currentSavings: 999999999999,
            monthlyContribution: 99999999
        },
        expectedBehavior: 'Should handle very large numbers'
    }
];

// Test Runner Function
function runTest(scenario) {
    const results = {
        name: scenario.name,
        passed: true,
        errors: [],
        scores: {},
        warnings: []
    };
    
    try {
        // Test calculateWeightedReturn with various inputs
        if (window.calculateWeightedReturn) {
            // Test with undefined allocations
            const weightedReturn1 = window.calculateWeightedReturn(undefined, 20);
            results.scores.weightedReturnUndefined = weightedReturn1;
            
            // Test with empty array
            const weightedReturn2 = window.calculateWeightedReturn([], 20);
            results.scores.weightedReturnEmpty = weightedReturn2;
            
            // Test with invalid allocations from scenario
            if (scenario.inputs.portfolioAllocations) {
                const weightedReturn3 = window.calculateWeightedReturn(
                    scenario.inputs.portfolioAllocations, 
                    20,
                    scenario.inputs.historicalReturns
                );
                results.scores.weightedReturnScenario = weightedReturn3;
            }
        }
        
        // Test Financial Health Score
        if (window.calculateFinancialHealthScore) {
            const healthScore = window.calculateFinancialHealthScore(scenario.inputs);
            results.scores.financialHealth = healthScore;
            
            // Validate score structure
            if (!healthScore || typeof healthScore.totalScore !== 'number') {
                results.warnings.push('Invalid health score structure');
            }
            if (isNaN(healthScore.totalScore) || !isFinite(healthScore.totalScore)) {
                results.warnings.push('Health score is NaN or Infinity');
            }
        }
        
        // Test Retirement Calculations
        if (window.calculateRetirement) {
            const retirement = window.calculateRetirement(scenario.inputs);
            results.scores.retirement = {
                totalSavings: retirement?.totalSavings || 0,
                monthlyIncome: retirement?.monthlyIncome || 0
            };
            
            // Check for NaN values
            if (retirement) {
                Object.entries(retirement).forEach(([key, value]) => {
                    if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) {
                        results.warnings.push(`Retirement.${key} is NaN or Infinity`);
                    }
                });
            }
        }
        
        // Test currency conversion with edge cases
        if (window.convertCurrency && scenario.inputs.exchangeRates) {
            const converted = window.convertCurrency(
                1000, 
                'USD', 
                scenario.inputs.exchangeRates
            );
            results.scores.currencyConversion = converted;
        }
        
    } catch (error) {
        results.passed = false;
        results.errors.push({
            message: error.message,
            stack: error.stack,
            type: error.constructor.name
        });
    }
    
    return results;
}

// Main Test Execution
function runAllTests() {
    console.log('🧪 Starting Financial Health Browser Emulator Tests');
    console.log('=' .repeat(60));
    
    const testResults = {
        total: testScenarios.length,
        passed: 0,
        failed: 0,
        warnings: 0,
        results: []
    };
    
    testScenarios.forEach((scenario, index) => {
        if (TEST_CONFIG.logLevel === 'debug' || TEST_CONFIG.showDetails) {
            console.log(`\n📋 Test ${index + 1}/${testScenarios.length}: ${scenario.name}`);
            console.log(`   Expected: ${scenario.expectedBehavior}`);
        }
        
        const result = runTest(scenario);
        testResults.results.push(result);
        
        if (result.passed) {
            testResults.passed++;
            console.log(`   ✅ PASSED`);
            
            if (result.warnings.length > 0) {
                testResults.warnings += result.warnings.length;
                if (TEST_CONFIG.showDetails) {
                    result.warnings.forEach(warning => {
                        console.log(`   ⚠️  Warning: ${warning}`);
                    });
                }
            }
            
            if (TEST_CONFIG.logLevel === 'debug') {
                console.log('   Scores:', JSON.stringify(result.scores, null, 2));
            }
        } else {
            testResults.failed++;
            console.log(`   ❌ FAILED`);
            result.errors.forEach(error => {
                console.error(`   Error: ${error.message}`);
                if (TEST_CONFIG.logLevel === 'debug') {
                    console.error(`   Stack: ${error.stack}`);
                }
            });
            
            if (TEST_CONFIG.stopOnError) {
                console.log('\n⛔ Stopping tests due to error (stopOnError = true)');
                return;
            }
        }
    });
    
    // Summary Report
    console.log('\n' + '=' .repeat(60));
    console.log('📊 Test Summary:');
    console.log(`   Total Tests: ${testResults.total}`);
    console.log(`   ✅ Passed: ${testResults.passed}`);
    console.log(`   ❌ Failed: ${testResults.failed}`);
    console.log(`   ⚠️  Warnings: ${testResults.warnings}`);
    console.log(`   Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
    
    // Detailed failure analysis
    if (testResults.failed > 0) {
        console.log('\n❌ Failed Tests:');
        testResults.results
            .filter(r => !r.passed)
            .forEach(result => {
                console.log(`   - ${result.name}`);
                result.errors.forEach(error => {
                    console.log(`     ${error.message}`);
                });
            });
    }
    
    // Return results for programmatic use
    return testResults;
}

// Auto-run tests if in browser environment
if (typeof window !== 'undefined') {
    // Wait for all scripts to load
    window.addEventListener('load', () => {
        setTimeout(() => {
            console.log('🚀 Auto-running Financial Health Emulator Tests...\n');
            const results = runAllTests();
            
            // Store results globally for inspection
            window.financialHealthTestResults = results;
            
            // Alert if any tests failed
            if (results.failed > 0) {
                console.error(`\n🚨 ${results.failed} tests failed! Check the console for details.`);
            } else {
                console.log('\n✨ All tests passed successfully!');
            }
        }, 1000); // Give time for all modules to initialize
    });
}

// Export for use in test runners
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runAllTests, testScenarios };
}