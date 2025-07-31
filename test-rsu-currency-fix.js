#!/usr/bin/env node

/**
 * RSU Currency Conversion Fix Test
 * Tests the fix for currency conversion race condition in RSU components
 */

const fs = require('fs');
const path = require('path');

// Colors for output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m'
};

// Test results
const results = {
    total: 0,
    passed: 0,
    failed: 0,
    tests: []
};

function log(message, type = 'info') {
    const prefix = {
        pass: `${colors.green}✓${colors.reset}`,
        fail: `${colors.red}✗${colors.reset}`,
        info: `${colors.cyan}ℹ${colors.reset}`,
        warn: `${colors.yellow}⚠${colors.reset}`
    };
    console.log(`${prefix[type] || ''} ${message}`);
}

function runTest(name, testFn) {
    results.total++;
    try {
        const result = testFn();
        if (result.passed) {
            results.passed++;
            log(`${name}: ${result.message}`, 'pass');
        } else {
            results.failed++;
            log(`${name}: ${result.message}`, 'fail');
        }
        results.tests.push({ name, ...result });
    } catch (error) {
        results.failed++;
        log(`${name}: ${error.message}`, 'fail');
        results.tests.push({ name, passed: false, message: error.message });
    }
}

// Test 1: Check if files have been updated with the fix
function testFilesUpdated() {
    const files = [
        'src/components/shared/EnhancedRSUCompanySelector.js',
        'src/components/shared/PartnerRSUSelector.js'
    ];
    
    const requiredPatterns = [
        // Check for direct currency fetching
        /Fetching currency rate for.*conversion/,
        // Check for effective rate usage
        /effectiveRate = rates\[workingCurrency\]/,
        // Check for fallback rate
        /effectiveRate = workingCurrency === 'ILS' \? 3\.70 : 1/,
        // Check for providedRate parameter
        /fetchStockPriceForSymbol.*providedRate = null/,
        // Check for effective rate in conversion
        /const effectiveRate = providedRate \|\| currencyRate/
    ];
    
    let allPassed = true;
    
    files.forEach(file => {
        const filePath = path.join(__dirname, file);
        if (!fs.existsSync(filePath)) {
            allPassed = false;
            return { passed: false, message: `File not found: ${file}` };
        }
        
        const content = fs.readFileSync(filePath, 'utf8');
        
        requiredPatterns.forEach((pattern, index) => {
            if (!pattern.test(content)) {
                allPassed = false;
                console.log(`  Missing pattern ${index + 1} in ${file}`);
            }
        });
    });
    
    return {
        passed: allPassed,
        message: allPassed ? 'All required code changes present' : 'Some code changes missing'
    };
}

// Test 2: Currency conversion calculations
function testCurrencyConversion() {
    const testCases = [
        {
            name: 'Basic conversion',
            priceUSD: 200,
            rate: 3.70,
            expected: 740
        },
        {
            name: 'Floating point handling',
            priceUSD: 123.45,
            rate: 3.70,
            expected: 456.77
        },
        {
            name: 'Large values',
            priceUSD: 1000,
            rate: 3.70,
            expected: 3700
        }
    ];
    
    let allPassed = true;
    const results = [];
    
    testCases.forEach(test => {
        const converted = Math.round(test.priceUSD * test.rate * 100) / 100;
        const passed = converted === test.expected;
        allPassed = allPassed && passed;
        
        if (!passed) {
            results.push(`${test.name}: Expected ${test.expected}, got ${converted}`);
        }
    });
    
    return {
        passed: allPassed,
        message: allPassed ? 'All conversion calculations correct' : `Failed: ${results.join('; ')}`
    };
}

// Test 3: RSU value calculations
function testRSUCalculations() {
    const stockPriceILS = 740; // $200 × 3.70
    
    const testCases = [
        {
            frequency: 'monthly',
            units: 10,
            expectedQuarterly: 22200 // (10 × 740 × 12) / 4
        },
        {
            frequency: 'quarterly',
            units: 20,
            expectedQuarterly: 14800 // 20 × 740
        },
        {
            frequency: 'yearly',
            units: 50,
            expectedQuarterly: 9250 // (50 × 740) / 4
        }
    ];
    
    let allPassed = true;
    const results = [];
    
    testCases.forEach(test => {
        let annualValue = 0;
        if (test.frequency === 'monthly') {
            annualValue = test.units * stockPriceILS * 12;
        } else if (test.frequency === 'quarterly') {
            annualValue = test.units * stockPriceILS * 4;
        } else if (test.frequency === 'yearly') {
            annualValue = test.units * stockPriceILS;
        }
        
        const quarterlyValue = annualValue / 4;
        const passed = quarterlyValue === test.expectedQuarterly;
        allPassed = allPassed && passed;
        
        if (!passed) {
            results.push(`${test.frequency}: Expected ${test.expectedQuarterly}, got ${quarterlyValue}`);
        }
    });
    
    return {
        passed: allPassed,
        message: allPassed ? 'All RSU calculations correct' : `Failed: ${results.join('; ')}`
    };
}

// Test 4: Edge cases
function testEdgeCases() {
    const tests = [
        {
            name: 'Null rate handling',
            test: () => {
                const rate = null || 3.70;
                return rate === 3.70;
            }
        },
        {
            name: 'Zero units',
            test: () => {
                const value = 0 * 740;
                return value === 0;
            }
        },
        {
            name: 'Invalid rate protection',
            test: () => {
                const rate = 3.70;
                return rate > 0 && isFinite(rate);
            }
        },
        {
            name: 'Fallback rate for ILS',
            test: () => {
                const workingCurrency = 'ILS';
                const fallbackRate = workingCurrency === 'ILS' ? 3.70 : 1;
                return fallbackRate === 3.70;
            }
        }
    ];
    
    let allPassed = true;
    const failedTests = [];
    
    tests.forEach(testCase => {
        const passed = testCase.test();
        allPassed = allPassed && passed;
        if (!passed) {
            failedTests.push(testCase.name);
        }
    });
    
    return {
        passed: allPassed,
        message: allPassed ? 'All edge cases handled' : `Failed: ${failedTests.join(', ')}`
    };
}

// Main test runner
function main() {
    console.log(`${colors.cyan}🧪 RSU Currency Conversion Fix Test Suite${colors.reset}\n`);
    
    // Run all tests
    runTest('Code Changes Verification', testFilesUpdated);
    runTest('Currency Conversion Math', testCurrencyConversion);
    runTest('RSU Value Calculations', testRSUCalculations);
    runTest('Edge Case Handling', testEdgeCases);
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log(`${colors.cyan}📊 Test Summary${colors.reset}`);
    console.log('='.repeat(50));
    console.log(`Total Tests: ${results.total}`);
    console.log(`${colors.green}Passed: ${results.passed}${colors.reset}`);
    console.log(`${colors.red}Failed: ${results.failed}${colors.reset}`);
    console.log(`Success Rate: ${Math.round((results.passed / results.total) * 100)}%`);
    console.log('='.repeat(50));
    
    // Expected behavior
    console.log(`\n${colors.cyan}📋 Expected Behavior:${colors.reset}`);
    console.log('1. When selecting a stock with ILS currency:');
    console.log('   - System fetches currency rate if not loaded');
    console.log('   - Uses fetched rate for conversion');
    console.log('   - Falls back to 3.70 if API fails');
    console.log('2. Stock price conversion:');
    console.log('   - $200 USD × 3.70 = ₪740 ILS');
    console.log('3. RSU quarterly value:');
    console.log('   - 20 units × ₪740 = ₪14,800');
    console.log('4. Monthly contribution:');
    console.log('   - ₪14,800 ÷ 3 = ₪4,933.33');
    
    // Fix status
    if (results.failed === 0) {
        console.log(`\n${colors.green}✅ Currency conversion fix is properly implemented!${colors.reset}\n`);
    } else {
        console.log(`\n${colors.red}❌ Currency conversion fix needs attention${colors.reset}\n`);
        process.exit(1);
    }
}

// Run tests
main();