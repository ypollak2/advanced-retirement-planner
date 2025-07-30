#!/usr/bin/env node
/**
 * Financial Health Test Runner
 * Runs all 20 scenarios and captures fallback warnings
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Load required files
function loadScript(filePath) {
    const code = fs.readFileSync(path.join(__dirname, '..', filePath), 'utf8');
    return code;
}

// Create a mock browser environment
const mockWindow = {
    localStorage: {
        getItem: () => null,
        setItem: () => {},
    },
    location: {
        hostname: 'localhost'
    },
    logger: {
        fieldSearch: () => {},
        fieldFound: () => {},
        debug: () => {}
    }
};

const mockDocument = {};

// Enhanced console to capture warnings
const capturedLogs = {
    warnings: [],
    errors: [],
    logs: [],
    fallbacks: []
};

const mockConsole = {
    log: (...args) => {
        const message = args.join(' ');
        capturedLogs.logs.push({ message, timestamp: Date.now() });
        
        // Only show critical logs
        if (message.includes('Financial health score calculated') || 
            message.includes('✅') || 
            message.includes('❌')) {
            console.log(...args);
        }
    },
    warn: (...args) => {
        const message = args.join(' ');
        capturedLogs.warnings.push({ message, timestamp: Date.now() });
        
        if (message.includes('Fallback Activated')) {
            capturedLogs.fallbacks.push({ message, timestamp: Date.now() });
            console.warn(...args);
        }
    },
    error: (...args) => {
        const message = args.join(' ');
        capturedLogs.errors.push({ message, timestamp: Date.now() });
        console.error(...args);
    }
};

// Create sandbox context
const sandbox = {
    window: mockWindow,
    document: mockDocument,
    console: mockConsole,
    require: require,
    module: { exports: {} },
    exports: {},
    parseFloat: parseFloat,
    parseInt: parseInt,
    isNaN: isNaN,
    isFinite: isFinite,
    Math: Math,
    Date: Date,
    performance: { now: () => Date.now() }
};

// Load scripts in order
console.log('Loading financial health engine...');

try {
    // Load field mapping dictionary
    const fieldMappingCode = loadScript('src/utils/fieldMappingDictionary.js');
    vm.runInNewContext(fieldMappingCode, sandbox);
    
    // Make it available globally in sandbox
    sandbox.window.fieldMappingDictionary = sandbox.window.fieldMappingDictionary || sandbox.fieldMappingDictionary;
    
    // Load other dependencies
    const scriptsToLoad = [
        'src/data/marketConstants.js',
        'src/translations/multiLanguage.js',
        'src/utils/retirementCalculations.js',
        'src/utils/financialHealthEngine.js'
    ];
    
    scriptsToLoad.forEach(script => {
        console.log(`Loading ${script}...`);
        const code = loadScript(script);
        vm.runInNewContext(code, sandbox);
    });
    
    // Make calculateFinancialHealthScore available
    sandbox.window.calculateFinancialHealthScore = sandbox.calculateFinancialHealthScore;
    
} catch (error) {
    console.error('Error loading scripts:', error.message);
    process.exit(1);
}

// Test scenarios - all 20 comprehensive scenarios
const scenarios = [
    // Individual Mode Scenarios
    {
        name: "1. Young Professional (Israel)",
        inputs: {
            planningType: "individual",
            currentAge: 28,
            retirementAge: 67,
            country: "israel",
            currentMonthlySalary: 15000,
            currency: "ILS",
            pensionEmployeeRate: 7,
            pensionEmployerRate: 14.33,
            trainingFundEmployeeRate: 2.5,
            trainingFundEmployerRate: 7.5,
            currentBankAccount: 30000,
            currentPersonalPortfolio: 50000,
            personalPortfolioReturn: 8,
            currentMonthlyExpenses: 12000,
            monthlyAdditionalSavings: 1000,
            riskTolerance: "moderate"
        }
    },
    {
        name: "2. Mid-Career (USA)",
        inputs: {
            planningType: "individual",
            currentAge: 42,
            retirementAge: 65,
            country: "usa",
            currentMonthlySalary: 8000,
            currency: "USD",
            current401k: 300000,
            currentIRA: 150000,
            currentPersonalPortfolio: 200000,
            currentBankAccount: 50000,
            monthlyContribution401k: 1500,
            monthlyContributionIRA: 500,
            currentMonthlyExpenses: 6000,
            riskTolerance: "moderate"
        }
    },
    {
        name: "3. Pre-Retiree (UK)",
        inputs: {
            planningType: "individual",
            currentAge: 58,
            retirementAge: 65,
            country: "uk",
            currentMonthlySalary: 6000,
            currency: "GBP",
            currentPensionSavings: 500000,
            currentPersonalPortfolio: 300000,
            currentRealEstate: 400000,
            emergencyFund: 50000,
            currentMonthlyExpenses: 4500,
            riskTolerance: "conservative"
        }
    },
    {
        name: "4. High Earner with RSUs (Israel)",
        inputs: {
            planningType: "individual",
            currentAge: 35,
            retirementAge: 60,
            country: "israel",
            currentMonthlySalary: 40000,
            currency: "ILS",
            rsuCompany: "AAPL",
            rsuUnits: 100,
            rsuFrequency: "quarterly",
            rsuCurrentStockPrice: 190.75,
            annualBonus: 150000,
            currentPensionSavings: 300000,
            currentCrypto: 100000,
            currentPersonalPortfolio: 500000,
            emergencyFund: 200000,
            pensionEmployeeRate: 7,
            pensionEmployerRate: 14.33,
            riskTolerance: "aggressive"
        }
    },
    {
        name: "5. Freelancer (Israel)",
        inputs: {
            planningType: "individual",
            currentAge: 38,
            retirementAge: 67,
            country: "israel",
            currentMonthlySalary: 20000,
            currency: "ILS",
            selfEmployed: true,
            pensionEmployeeRate: 16,
            currentPensionSavings: 150000,
            currentPersonalPortfolio: 100000,
            emergencyFund: 120000,
            currentMonthlyExpenses: 15000,
            riskTolerance: "moderate"
        }
    },
    {
        name: "6. Minimal Data",
        inputs: {
            planningType: "individual",
            currentAge: 40,
            retirementAge: 67,
            currentMonthlySalary: 10000,
            currency: "ILS"
        }
    },
    {
        name: "7. Maximum Data",
        inputs: {
            planningType: "individual",
            currentAge: 45,
            retirementAge: 65,
            country: "israel",
            currentMonthlySalary: 35000,
            currency: "ILS",
            pensionEmployeeRate: 7,
            pensionEmployerRate: 14.33,
            trainingFundEmployeeRate: 2.5,
            trainingFundEmployerRate: 7.5,
            currentPensionSavings: 800000,
            currentTrainingFund: 200000,
            current401k: 100000,
            currentIRA: 50000,
            currentPersonalPortfolio: 400000,
            currentRealEstate: 1500000,
            currentCrypto: 50000,
            emergencyFund: 300000,
            currentBankAccount: 100000,
            monthlyAdditionalSavings: 5000,
            annualBonus: 100000,
            currentMonthlyExpenses: 25000,
            riskTolerance: "moderate"
        }
    },
    {
        name: "8. Retired Individual",
        inputs: {
            planningType: "individual",
            currentAge: 68,
            retirementAge: 65,
            country: "israel",
            monthlyPensionIncome: 12000,
            currency: "ILS",
            currentPensionSavings: 1000000,
            currentPersonalPortfolio: 500000,
            emergencyFund: 100000,
            currentMonthlyExpenses: 10000,
            riskTolerance: "conservative"
        }
    },
    {
        name: "9. International Worker",
        inputs: {
            planningType: "individual",
            currentAge: 45,
            retirementAge: 65,
            country: "israel",
            currentMonthlySalary: 20000,
            currency: "ILS",
            currentPensionSavings: 400000,
            foreignPension: 200000,
            current401k: 150000,
            emergencyFund: 80000,
            currentMonthlyExpenses: 15000,
            riskTolerance: "moderate"
        }
    },
    {
        name: "10. Debt Situation",
        inputs: {
            planningType: "individual",
            currentAge: 35,
            retirementAge: 67,
            country: "israel",
            currentMonthlySalary: 15000,
            currency: "ILS",
            currentPensionSavings: 50000,
            emergencyFund: 5000,
            monthlyDebt: 5000,
            totalDebt: 200000,
            currentMonthlyExpenses: 12000,
            riskTolerance: "conservative"
        }
    },
    
    // Couple Mode Scenarios
    {
        name: "11. Young Couple (Israel)",
        inputs: {
            planningType: "couple",
            currentAge: 30,
            partnerCurrentAge: 28,
            retirementAge: 67,
            partnerRetirementAge: 67,
            country: "israel",
            partner1Salary: 12000,
            partner2Salary: 10000,
            currency: "ILS",
            currentPensionSavings: 50000,
            partnerCurrentSavings: 30000,
            emergencyFund: 40000,
            expenses: 18000,
            pensionEmployeeRate: 7,
            pensionEmployerRate: 14.33
        }
    },
    {
        name: "12. Mid-Career Family",
        inputs: {
            planningType: "couple",
            currentAge: 42,
            partnerCurrentAge: 40,
            retirementAge: 67,
            partnerRetirementAge: 65,
            country: "israel",
            partner1Salary: 25000,
            partner2Salary: 20000,
            currency: "ILS",
            currentPensionSavings: 800000,
            partnerCurrentSavings: 600000,
            emergencyFund: 150000,
            currentPersonalPortfolio: 300000,
            expenses: 30000,
            monthlyDebt: 10000,
            pensionEmployeeRate: 7,
            pensionEmployerRate: 14.33
        }
    },
    {
        name: "13. Single Earner Couple",
        inputs: {
            planningType: "couple",
            currentAge: 45,
            partnerCurrentAge: 43,
            retirementAge: 67,
            partnerRetirementAge: 67,
            country: "israel",
            partner1Salary: 30000,
            partner2Salary: 0,
            currency: "ILS",
            currentPensionSavings: 500000,
            partnerCurrentSavings: 100000,
            emergencyFund: 100000,
            expenses: 20000,
            pensionEmployeeRate: 7,
            pensionEmployerRate: 14.33
        }
    },
    {
        name: "14. Both Retired",
        inputs: {
            planningType: "couple",
            currentAge: 70,
            partnerCurrentAge: 68,
            retirementAge: 65,
            partnerRetirementAge: 65,
            country: "israel",
            monthlyPensionIncome: 8000,
            partnerMonthlyPensionIncome: 6000,
            currency: "ILS",
            currentPensionSavings: 600000,
            partnerCurrentSavings: 400000,
            emergencyFund: 150000,
            expenses: 12000,
            riskTolerance: "conservative"
        }
    },
    {
        name: "15. Mixed Employment",
        inputs: {
            planningType: "couple",
            currentAge: 38,
            partnerCurrentAge: 36,
            retirementAge: 67,
            partnerRetirementAge: 67,
            country: "israel",
            partner1Salary: 18000,
            partner2Salary: 15000,
            currency: "ILS",
            partner2SelfEmployed: true,
            currentPensionSavings: 200000,
            partnerCurrentSavings: 150000,
            emergencyFund: 80000,
            expenses: 25000,
            pensionEmployeeRate: 7,
            pensionEmployerRate: 14.33
        }
    },
    {
        name: "16. International Couple",
        inputs: {
            planningType: "couple",
            currentAge: 40,
            partnerCurrentAge: 38,
            retirementAge: 65,
            partnerRetirementAge: 65,
            country: "israel",
            partner1Salary: 20000,
            partner2Salary: 5000,
            partner2Currency: "USD",
            currency: "ILS",
            currentPensionSavings: 300000,
            partnerCurrentSavings: 100000,
            partner2Foreign401k: 200000,
            emergencyFund: 100000,
            expenses: 22000,
            pensionEmployeeRate: 7,
            pensionEmployerRate: 14.33
        }
    },
    {
        name: "17. High Net Worth Couple",
        inputs: {
            planningType: "couple",
            currentAge: 50,
            partnerCurrentAge: 48,
            retirementAge: 65,
            partnerRetirementAge: 65,
            country: "israel",
            partner1Salary: 50000,
            partner2Salary: 40000,
            currency: "ILS",
            currentPensionSavings: 1500000,
            partnerCurrentSavings: 1200000,
            currentPersonalPortfolio: 800000,
            partnerPersonalPortfolio: 600000,
            currentRealEstate: 3000000,
            currentCrypto: 200000,
            emergencyFund: 500000,
            expenses: 50000,
            pensionEmployeeRate: 7,
            pensionEmployerRate: 14.33,
            riskTolerance: "moderate"
        }
    },
    {
        name: "18. Debt-Heavy Couple",
        inputs: {
            planningType: "couple",
            currentAge: 35,
            partnerCurrentAge: 33,
            retirementAge: 67,
            partnerRetirementAge: 67,
            country: "israel",
            partner1Salary: 15000,
            partner2Salary: 12000,
            currency: "ILS",
            currentPensionSavings: 80000,
            partnerCurrentSavings: 60000,
            emergencyFund: 10000,
            expenses: 25000,
            monthlyDebt: 12000,
            totalDebt: 500000,
            pensionEmployeeRate: 7,
            pensionEmployerRate: 14.33
        }
    },
    {
        name: "19. Minimal Couple Data",
        inputs: {
            planningType: "couple",
            currentAge: 40,
            partnerCurrentAge: 38,
            retirementAge: 67,
            partnerRetirementAge: 67,
            partner1Salary: 15000,
            partner2Salary: 12000,
            currency: "ILS"
        }
    },
    {
        name: "20. Complex Portfolio Couple",
        inputs: {
            planningType: "couple",
            currentAge: 45,
            partnerCurrentAge: 43,
            retirementAge: 65,
            partnerRetirementAge: 65,
            country: "israel",
            partner1Salary: 35000,
            partner2Salary: 30000,
            currency: "ILS",
            currentPensionSavings: 1000000,
            partnerCurrentSavings: 800000,
            currentTrainingFund: 300000,
            partnerTrainingFund: 250000,
            current401k: 200000,
            partner401k: 150000,
            currentIRA: 100000,
            partnerIRA: 80000,
            currentPersonalPortfolio: 600000,
            partnerPersonalPortfolio: 400000,
            currentRealEstate: 2000000,
            currentCrypto: 150000,
            partnerCrypto: 100000,
            emergencyFund: 400000,
            monthlyAdditionalSavings: 8000,
            expenses: 40000,
            pensionEmployeeRate: 7,
            pensionEmployerRate: 14.33,
            trainingFundEmployeeRate: 2.5,
            trainingFundEmployerRate: 7.5,
            riskTolerance: "moderate"
        }
    }
];

// Run tests
console.log('\n' + '='.repeat(60));
console.log('RUNNING FINANCIAL HEALTH TESTS');
console.log('='.repeat(60) + '\n');

const results = [];

scenarios.forEach((scenario, index) => {
    console.log(`\nRunning scenario ${index + 1}: ${scenario.name}`);
    
    // Clear captured logs
    capturedLogs.warnings = [];
    capturedLogs.errors = [];
    capturedLogs.fallbacks = [];
    
    try {
        const startTime = Date.now();
        const result = sandbox.window.calculateFinancialHealthScore(scenario.inputs);
        const endTime = Date.now();
        
        const testResult = {
            scenario: scenario.name,
            score: result.totalScore,
            category: result.category,
            executionTime: endTime - startTime,
            fallbackCount: capturedLogs.fallbacks.length,
            warningCount: capturedLogs.warnings.length,
            errorCount: capturedLogs.errors.length,
            fallbacks: capturedLogs.fallbacks,
            status: capturedLogs.fallbacks.length === 0 ? 'PASS' : 'FAIL'
        };
        
        results.push(testResult);
        
        console.log(`  Score: ${result.totalScore}/100 (${result.category})`);
        console.log(`  Execution time: ${testResult.executionTime}ms`);
        console.log(`  Fallback warnings: ${testResult.fallbackCount}`);
        
        if (testResult.fallbackCount > 0) {
            console.log('  ❌ FAILED - Fallbacks detected:');
            testResult.fallbacks.forEach(f => {
                const match = f.message.match(/No value found for fields: \[([^\]]+)\]/);
                if (match) {
                    console.log(`    - Missing: ${match[1]}`);
                }
            });
        } else {
            console.log('  ✅ PASSED - No fallbacks!');
        }
        
    } catch (error) {
        console.error(`  ❌ ERROR: ${error.message}`);
        results.push({
            scenario: scenario.name,
            error: error.message,
            status: 'ERROR'
        });
    }
});

// Summary
console.log('\n' + '='.repeat(60));
console.log('TEST SUMMARY');
console.log('='.repeat(60));

const passed = results.filter(r => r.status === 'PASS').length;
const failed = results.filter(r => r.status === 'FAIL').length;
const errors = results.filter(r => r.status === 'ERROR').length;

console.log(`\nTotal scenarios: ${results.length}`);
console.log(`Passed: ${passed} ✅`);
console.log(`Failed: ${failed} ❌`);
console.log(`Errors: ${errors} 🚨`);

// Analyze all fallbacks
const allFallbacks = {};
results.forEach(result => {
    if (result.fallbacks) {
        result.fallbacks.forEach(f => {
            const match = f.message.match(/No value found for fields: \[([^\]]+)\]/);
            if (match) {
                const fields = match[1].split(', ').map(f => f.trim());
                fields.forEach(field => {
                    allFallbacks[field] = (allFallbacks[field] || 0) + 1;
                });
            }
        });
    }
});

if (Object.keys(allFallbacks).length > 0) {
    console.log('\n' + '='.repeat(60));
    console.log('MISSING FIELD MAPPINGS');
    console.log('='.repeat(60));
    
    const sortedFields = Object.entries(allFallbacks)
        .sort((a, b) => b[1] - a[1]);
    
    sortedFields.forEach(([field, count]) => {
        console.log(`  ${field}: ${count} occurrence(s)`);
    });
    
    console.log('\n💡 Add these fields to fieldMappingDictionary.js to fix the issues.');
}

// Save results
const reportPath = path.join(__dirname, '..', `test-results-${Date.now()}.json`);
fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: { total: results.length, passed, failed, errors },
    results,
    missingFields: allFallbacks
}, null, 2));

console.log(`\n📄 Detailed report saved to: ${reportPath}`);

process.exit(failed > 0 || errors > 0 ? 1 : 0);