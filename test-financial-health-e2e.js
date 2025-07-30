#!/usr/bin/env node

// Load the financial health engine
const fs = require('fs');
const path = require('path');

// Read and evaluate the financial health engine
const enginePath = path.join(__dirname, 'src/utils/financialHealthEngine.js');
const engineCode = fs.readFileSync(enginePath, 'utf8');

// Create a minimal browser-like environment
global.window = {
    location: { hostname: 'localhost' },
    logger: {
        fieldSearch: () => {},
        fieldFound: () => {},
        debug: () => {}
    }
};
global.console = console;

// Evaluate the engine code
eval(engineCode);

// Test scenarios from AUDIT-001
const testScenarios = [
    {
        name: "Young Professional (Individual, Israel) 🇮🇱",
        description: "Tech worker starting retirement planning",
        expectedMin: 65,
        expectedMax: 75,
        data: {
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
        name: "Mid-Career Couple (Israel) 👫",
        description: "Dual-income family with mortgage",
        expectedMin: 75,
        expectedMax: 85,
        data: {
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
            expenses: {
                housing: 8000,
                transportation: 3000,
                food: 4000,
                insurance: 2000,
                other: 3000,
                mortgage: 8000,
                carLoan: 2000
            },
            pensionEmployeeRate: 7,
            pensionEmployerRate: 14.33
        }
    },
    {
        name: "Pre-Retirement (Individual, USA) 🇺🇸",
        description: "American nearing retirement with substantial savings",
        expectedMin: 80,
        expectedMax: 90,
        data: {
            planningType: "individual",
            currentAge: 58,
            retirementAge: 65,
            country: "usa",
            currentMonthlySalary: 8000,
            currency: "USD",
            current401k: 750000,
            currentIRA: 250000,
            currentBankAccount: 50000,
            currentPersonalPortfolio: 200000,
            currentMonthlyExpenses: 6000,
            riskTolerance: "conservative"
        }
    },
    {
        name: "Minimum Data Entry ⚠️",
        description: "User with minimal data provided",
        expectedMin: 15,
        expectedMax: 25,
        data: {
            planningType: "individual",
            currentAge: 40,
            retirementAge: 67,
            currentMonthlySalary: 10000,
            currency: "ILS"
        }
    }
];

// Check for NaN values in result
function hasNaN(obj) {
    if (typeof obj === 'number') {
        return isNaN(obj);
    }
    if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
            if (hasNaN(obj[key])) {
                return true;
            }
        }
    }
    return false;
}

// Run all tests
console.log('🧪 Financial Health Score E2E Tests - AUDIT-001');
console.log('='.repeat(60));

let passedTests = 0;
let failedTests = 0;
let testsWithNaN = 0;

testScenarios.forEach((scenario, index) => {
    console.log(`\n📋 Test ${index + 1}: ${scenario.name}`);
    console.log(`   ${scenario.description}`);
    console.log(`   Expected Score: ${scenario.expectedMin}-${scenario.expectedMax}/100`);
    
    try {
        const startTime = Date.now();
        const result = calculateFinancialHealthScore(scenario.data);
        const duration = Date.now() - startTime;
        
        const passed = result.totalScore >= scenario.expectedMin && 
                      result.totalScore <= scenario.expectedMax &&
                      !hasNaN(result);
        
        const hasNaNValue = hasNaN(result);
        
        console.log(`   Actual Score: ${result.totalScore}/100`);
        console.log(`   Duration: ${duration}ms`);
        console.log(`   NaN Check: ${hasNaNValue ? '❌ FAILED' : '✅ PASSED'}`);
        console.log(`   Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
        
        if (result.factors) {
            console.log('\n   Score Breakdown:');
            Object.entries(result.factors).forEach(([factor, data]) => {
                console.log(`   - ${factor}: ${data.score}/${data.maxScore}`);
            });
        }
        
        if (passed) {
            passedTests++;
        } else {
            failedTests++;
        }
        
        if (hasNaNValue) {
            testsWithNaN++;
        }
        
    } catch (error) {
        console.log(`   ❌ ERROR: ${error.message}`);
        failedTests++;
    }
});

console.log('\n' + '='.repeat(60));
console.log('📊 Test Summary:');
console.log(`   Total Tests: ${testScenarios.length}`);
console.log(`   Passed: ${passedTests} ✅`);
console.log(`   Failed: ${failedTests} ❌`);
console.log(`   NaN Issues: ${testsWithNaN} ⚠️`);
console.log(`   Success Rate: ${Math.round(passedTests / testScenarios.length * 100)}%`);
console.log('='.repeat(60));