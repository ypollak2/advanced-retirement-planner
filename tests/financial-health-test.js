#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('\n💰 Financial Health Score Test Suite');
console.log('=====================================\n');

let testsPassed = 0;
let testsFailed = 0;

function logTest(name, passed, message = '') {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${name}`);
    if (message) {
        console.log(`    ${message}`);
    }
    
    if (passed) {
        testsPassed++;
    } else {
        testsFailed++;
    }
}

// Load the financial health engine in a DOM environment
async function loadFinancialHealthEngine() {
    const html = `
        <!DOCTYPE html>
        <html>
        <head></head>
        <body>
            <script>
                // Mock window.logger
                window.logger = {
                    fieldSearch: () => {},
                    fieldFound: () => {},
                    debug: () => {}
                };
            </script>
        </body>
        </html>
    `;
    
    const dom = new JSDOM(html, { 
        runScripts: "dangerously",
        resources: "usable",
        pretendToBeVisual: true
    });
    
    const window = dom.window;
    const document = window.document;
    
    // Load the financial health engine
    const enginePath = path.join(__dirname, '..', 'src', 'utils', 'financialHealthEngine.js');
    const engineCode = fs.readFileSync(enginePath, 'utf8');
    
    const scriptElement = document.createElement('script');
    scriptElement.textContent = engineCode;
    document.body.appendChild(scriptElement);
    
    // Load test scenarios
    const scenariosPath = path.join(__dirname, 'scenarios', 'financial-health-scenarios.test.js');
    const scenariosCode = fs.readFileSync(scenariosPath, 'utf8');
    
    const scenariosScript = document.createElement('script');
    scenariosScript.textContent = scenariosCode;
    document.body.appendChild(scenariosScript);
    
    return window;
}

// Test individual scenario
function testScenario(window, scenario) {
    try {
        const result = window.calculateFinancialHealthScore(scenario.input);
        
        // Check if result is within expected range
        const totalScore = result.totalScore;
        const expected = scenario.expected.totalScore;
        const passed = totalScore >= expected.min && totalScore <= expected.max;
        
        // Check for specific issues
        const issues = [];
        
        // Check retirement readiness
        if (result.factors.retirementReadiness) {
            const rrScore = result.factors.retirementReadiness.score;
            if (rrScore === 0 && scenario.input.currentPensionSavings > 0) {
                issues.push('Retirement readiness still returning 0 despite savings');
            }
        }
        
        // Check emergency fund
        if (result.factors.emergencyFund) {
            const efDetails = result.factors.emergencyFund.details;
            if (efDetails.months < 0) {
                issues.push('Emergency fund returning negative months');
            }
        }
        
        // Check for NaN/Infinity
        const hasInvalidValues = checkForInvalidValues(result);
        if (hasInvalidValues) {
            issues.push('Contains NaN or Infinity values');
        }
        
        const overallPassed = passed && issues.length === 0;
        
        logTest(
            `Scenario ${scenario.id}: ${scenario.name}`,
            overallPassed,
            overallPassed ? 
                `Score: ${totalScore} (expected: ${expected.min}-${expected.max})` :
                `Score: ${totalScore} (expected: ${expected.min}-${expected.max}), Issues: ${issues.join(', ')}`
        );
        
        // Log factor details if test failed
        if (!overallPassed && result.factors) {
            console.log('    Factor breakdown:');
            Object.entries(result.factors).forEach(([name, factor]) => {
                if (factor && factor.score !== undefined) {
                    console.log(`      ${name}: ${factor.score}/${window.SCORE_FACTORS[name]?.weight || '?'}`);
                }
            });
        }
        
        return overallPassed;
        
    } catch (error) {
        logTest(
            `Scenario ${scenario.id}: ${scenario.name}`,
            false,
            `Error: ${error.message}`
        );
        return false;
    }
}

// Check for NaN/Infinity values recursively
function checkForInvalidValues(obj, path = '') {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            const currentPath = path ? `${path}.${key}` : key;
            
            if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) {
                console.log(`    Invalid value at ${currentPath}: ${value}`);
                return true;
            }
            if (typeof value === 'object' && value !== null) {
                if (checkForInvalidValues(value, currentPath)) return true;
            }
        }
    }
    return false;
}

// Run all tests
async function runTests() {
    try {
        console.log('Loading Financial Health Engine...');
        const window = await loadFinancialHealthEngine();
        
        // Verify engine loaded
        if (!window.calculateFinancialHealthScore) {
            logTest('Financial Health Engine loaded', false, 'calculateFinancialHealthScore not found');
            return;
        }
        logTest('Financial Health Engine loaded', true);
        
        // Verify test scenarios loaded
        if (!window.TEST_SCENARIOS || !Array.isArray(window.TEST_SCENARIOS)) {
            logTest('Test scenarios loaded', false, 'TEST_SCENARIOS not found or not an array');
            return;
        }
        logTest('Test scenarios loaded', true, `Found ${window.TEST_SCENARIOS.length} scenarios`);
        
        // Test each scenario
        console.log('\n🧪 Testing Individual Scenarios...\n');
        
        let scenariosPassed = 0;
        let scenariosFailed = 0;
        
        for (const scenario of window.TEST_SCENARIOS) {
            const passed = testScenario(window, scenario);
            if (passed) {
                scenariosPassed++;
            } else {
                scenariosFailed++;
            }
        }
        
        // Summary
        console.log('\n📊 Financial Health Test Summary');
        console.log('================================');
        console.log(`Scenarios Passed: ${scenariosPassed}/${window.TEST_SCENARIOS.length}`);
        console.log(`Scenarios Failed: ${scenariosFailed}/${window.TEST_SCENARIOS.length}`);
        console.log(`Overall Success Rate: ${Math.round((scenariosPassed / window.TEST_SCENARIOS.length) * 100)}%`);
        
        // Test specific fixes
        console.log('\n🔧 Testing Specific Fixes...\n');
        
        // Test RSU calculation
        testRSUCalculation(window);
        
        // Test safe calculations
        testSafeCalculations(window);
        
        // Test validation
        testValidation(window);
        
    } catch (error) {
        console.error('Test runner error:', error);
        process.exit(1);
    }
    
    // Final summary
    console.log('\n📋 Final Test Results');
    console.log('====================');
    console.log(`Total Tests Passed: ${testsPassed}`);
    console.log(`Total Tests Failed: ${testsFailed}`);
    console.log(`Success Rate: ${testsPassed + testsFailed > 0 ? Math.round((testsPassed / (testsPassed + testsFailed)) * 100) : 0}%`);
    
    process.exit(testsFailed > 0 ? 1 : 0);
}

// Test RSU calculation specifically
function testRSUCalculation(window) {
    const testInput = {
        planningType: "individual",
        currentAge: 38,
        currentMonthlySalary: 40000,
        currency: "ILS",
        rsuUnits: 100,
        rsuFrequency: "quarterly",
        rsuCurrentStockPrice: 190.75,
        pensionEmployeeRate: 7
    };
    
    const result = window.calculateFinancialHealthScore(testInput);
    const monthlyIncome = result.factors.savingsRate?.details?.monthlyIncome || 0;
    
    // Expected: 40000 + (100 * 190.75 * 4 / 12 * 3.5) = 40000 + 22254.17
    const expectedIncome = 40000 + (100 * 190.75 * 4 / 12 * 3.5);
    const rsuIncluded = Math.abs(monthlyIncome - expectedIncome) < 1; // Allow small rounding difference
    
    logTest(
        'RSU income calculation',
        rsuIncluded,
        rsuIncluded ? 
            `Monthly income correctly includes RSU: ₪${monthlyIncome.toFixed(2)}` :
            `RSU not properly included. Expected: ₪${expectedIncome.toFixed(2)}, Got: ₪${monthlyIncome.toFixed(2)}`
    );
}

// Test safe calculations
function testSafeCalculations(window) {
    // Test division by zero
    const testInput1 = {
        planningType: "individual",
        currentAge: 30,
        retirementAge: 65,
        currentMonthlySalary: 0, // Zero income
        emergencyFund: 10000,
        currentMonthlyExpenses: 0 // Zero expenses
    };
    
    try {
        const result = window.calculateFinancialHealthScore(testInput1);
        const hasNaN = checkForInvalidValues(result);
        logTest(
            'Safe calculation - division by zero',
            !hasNaN,
            hasNaN ? 'Found NaN/Infinity values' : 'No invalid values found'
        );
    } catch (error) {
        logTest('Safe calculation - division by zero', false, `Error: ${error.message}`);
    }
}

// Test validation
function testValidation(window) {
    if (!window.validateFinancialInputs) {
        logTest('Validation function exists', false, 'validateFinancialInputs not found');
        return;
    }
    
    // Test with minimal valid input
    const minimalInput = {
        currentAge: 30,
        retirementAge: 65,
        planningType: 'individual',
        currency: 'ILS'
    };
    
    const validation1 = window.validateFinancialInputs(minimalInput);
    logTest(
        'Validation - minimal valid input',
        validation1.isValid,
        `Errors: ${validation1.errors.length}, Warnings: ${validation1.warnings.length}`
    );
    
    // Test with invalid input
    const invalidInput = {
        currentAge: 15, // Too young
        retirementAge: 30, // Before current age
        planningType: 'invalid',
        currency: 'INVALID'
    };
    
    const validation2 = window.validateFinancialInputs(invalidInput);
    logTest(
        'Validation - invalid input detection',
        !validation2.isValid && validation2.errors.length >= 3,
        `Found ${validation2.errors.length} errors as expected`
    );
    
    // Test data completeness
    const completeInput = {
        currentAge: 30,
        retirementAge: 65,
        planningType: 'individual',
        currency: 'ILS',
        currentMonthlySalary: 10000,
        currentPensionSavings: 100000,
        emergencyFund: 50000,
        pensionEmployeeRate: 7,
        pensionEmployerRate: 14,
        currentPersonalPortfolio: 50000
    };
    
    const validation3 = window.validateFinancialInputs(completeInput);
    const completeness = validation3.summary?.dataCompleteness || 0;
    logTest(
        'Validation - data completeness assessment',
        completeness > 50,
        `Data completeness: ${completeness}%`
    );
}

// Run the tests
runTests();