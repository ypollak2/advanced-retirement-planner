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

// Extended test scenarios - 10 additional diverse cases
const extendedTestScenarios = [
    {
        name: "Crypto Investor (Individual, USA) ₿",
        description: "Tech-savvy investor with crypto focus",
        expectedMin: 55,
        expectedMax: 65,
        data: {
            planningType: "individual",
            currentAge: 30,
            retirementAge: 65,
            country: "usa",
            currentMonthlySalary: 6000,
            currency: "USD",
            current401k: 50000,
            currentCrypto: 400000,
            cryptoReturn: 25,
            cryptoMonthly: 2000,
            currentPersonalPortfolio: 20000,
            emergencyFund: 0,
            riskTolerance: "aggressive"
        }
    },
    {
        name: "Conservative Retiree (Individual, UK) 🇬🇧",
        description: "Recently retired with conservative portfolio",
        expectedMin: 40,
        expectedMax: 50,
        data: {
            planningType: "individual",
            currentAge: 65,
            retirementAge: 65,
            country: "uk",
            monthlyPensionIncome: 3000,
            currency: "GBP",
            currentPersonalPortfolio: 500000,
            personalPortfolioReturn: 4,
            emergencyFund: 30000,
            currentMonthlyExpenses: 2500,
            riskTolerance: "conservative",
            portfolioAllocation: {
                bonds: 70,
                stocks: 30
            }
        }
    },
    {
        name: "International Worker (Individual, Multi-country) 🌍",
        description: "Expat with multi-country work history",
        expectedMin: 70,
        expectedMax: 80,
        data: {
            planningType: "individual",
            currentAge: 45,
            retirementAge: 65,
            country: "israel",
            currentMonthlySalary: 20000,
            currency: "ILS",
            currentPensionSavings: 400000,
            emergencyFund: 80000,
            pensionEmployeeRate: 7,
            pensionEmployerRate: 14.33,
            currentPersonalPortfolio: 150000,
            currentBankAccount: 50000,
            riskTolerance: "moderate"
        }
    },
    {
        name: "Maximum Optimization 🏆",
        description: "Perfectly optimized retirement plan",
        expectedMin: 90,
        expectedMax: 100,
        data: {
            planningType: "individual",
            currentAge: 40,
            retirementAge: 65,
            country: "israel",
            currentMonthlySalary: 30000,
            currency: "ILS",
            pensionEmployeeRate: 7,
            pensionEmployerRate: 14.33,
            trainingFundEmployeeRate: 2.5,
            trainingFundEmployerRate: 7.5,
            currentPensionSavings: 800000,
            currentTrainingFund: 200000,
            currentPersonalPortfolio: 400000,
            currentRealEstate: 300000,
            currentCrypto: 100000,
            emergencyFund: 360000,
            currentMonthlyExpenses: 20000,
            monthlyAdditionalSavings: 3000,
            riskTolerance: "moderate",
            portfolioAllocation: {
                stocks: 40,
                bonds: 20,
                realEstate: 20,
                international: 15,
                crypto: 5
            }
        }
    },
    {
        name: "Self-Employed Freelancer (Individual, Israel) 💻",
        description: "Freelancer with irregular income",
        expectedMin: 75,
        expectedMax: 85,
        data: {
            planningType: "individual",
            currentAge: 35,
            retirementAge: 67,
            country: "israel",
            currentMonthlySalary: 18000,
            currency: "ILS",
            currentPensionSavings: 120000,
            currentPersonalPortfolio: 80000,
            emergencyFund: 100000,
            currentMonthlyExpenses: 14000,
            monthlyAdditionalSavings: 2000,
            riskTolerance: "moderate",
            selfEmployed: true
        }
    },
    {
        name: "High Net Worth Couple (Israel) 💎",
        description: "Wealthy couple with diverse investments",
        expectedMin: 75,
        expectedMax: 85,
        data: {
            planningType: "couple",
            currentAge: 50,
            partnerCurrentAge: 48,
            retirementAge: 62,
            partnerRetirementAge: 62,
            country: "israel",
            partner1Salary: 50000,
            partner2Salary: 40000,
            currency: "ILS",
            currentPensionSavings: 2000000,
            partnerCurrentSavings: 1500000,
            currentPersonalPortfolio: 1000000,
            currentRealEstate: 2000000,
            emergencyFund: 500000,
            expenses: {
                housing: 10000,
                transportation: 5000,
                food: 5000,
                insurance: 3000,
                other: 7000,
                mortgage: 0,
                carLoan: 0
            },
            pensionEmployeeRate: 7,
            pensionEmployerRate: 14.33,
            riskTolerance: "moderate"
        }
    },
    {
        name: "Recent Graduate (Individual, USA) 🎓",
        description: "New graduate starting career",
        expectedMin: 50,
        expectedMax: 60,
        data: {
            planningType: "individual",
            currentAge: 23,
            retirementAge: 67,
            country: "usa",
            currentMonthlySalary: 4000,
            currency: "USD",
            current401k: 0,
            currentBankAccount: 5000,
            emergencyFund: 2000,
            currentMonthlyExpenses: 3000,
            monthlyAdditionalSavings: 500,
            studentLoan: 30000,
            expenses: {
                housing: 1200,
                transportation: 400,
                food: 600,
                insurance: 200,
                other: 400,
                studentLoan: 200
            },
            riskTolerance: "aggressive"
        }
    },
    {
        name: "Single Parent (Individual, Israel) 👨‍👧",
        description: "Single parent balancing savings and expenses",
        expectedMin: 75,
        expectedMax: 85,
        data: {
            planningType: "individual",
            currentAge: 38,
            retirementAge: 67,
            country: "israel",
            currentMonthlySalary: 16000,
            currency: "ILS",
            pensionEmployeeRate: 7,
            pensionEmployerRate: 14.33,
            currentPensionSavings: 250000,
            currentPersonalPortfolio: 30000,
            emergencyFund: 40000,
            currentMonthlyExpenses: 13000,
            monthlyAdditionalSavings: 500,
            expenses: {
                housing: 5000,
                transportation: 2000,
                food: 3000,
                insurance: 1000,
                childcare: 2000
            },
            riskTolerance: "conservative"
        }
    },
    {
        name: "Early Retirement Seeker (Individual, USA) 🏖️",
        description: "FIRE movement follower",
        expectedMin: 75,
        expectedMax: 85,
        data: {
            planningType: "individual",
            currentAge: 35,
            retirementAge: 50,
            country: "usa",
            currentMonthlySalary: 10000,
            currency: "USD",
            current401k: 300000,
            currentIRA: 150000,
            currentPersonalPortfolio: 200000,
            currentBankAccount: 50000,
            emergencyFund: 60000,
            currentMonthlyExpenses: 4000,
            monthlyAdditionalSavings: 5000,
            riskTolerance: "aggressive"
        }
    },
    {
        name: "Medical Professional Couple (Israel) 👨‍⚕️👩‍⚕️",
        description: "High-income medical professionals",
        expectedMin: 85,
        expectedMax: 95,
        data: {
            planningType: "couple",
            currentAge: 45,
            partnerCurrentAge: 43,
            retirementAge: 65,
            partnerRetirementAge: 65,
            country: "israel",
            partner1Salary: 35000,
            partner2Salary: 32000,
            currency: "ILS",
            currentPensionSavings: 1200000,
            partnerCurrentSavings: 1000000,
            currentPersonalPortfolio: 600000,
            emergencyFund: 200000,
            currentMonthlyExpenses: 30000,
            monthlyAdditionalSavings: 10000,
            expenses: {
                housing: 12000,
                transportation: 4000,
                food: 5000,
                insurance: 3000,
                other: 6000,
                mortgage: 8000,
                carLoan: 0
            },
            pensionEmployeeRate: 7,
            pensionEmployerRate: 14.33,
            trainingFundEmployeeRate: 2.5,
            trainingFundEmployerRate: 7.5,
            riskTolerance: "moderate"
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
console.log('🧪 Extended Financial Health Score E2E Tests');
console.log('='.repeat(60));

let passedTests = 0;
let failedTests = 0;
let testsWithNaN = 0;

// Suppress verbose logging for cleaner output
const originalLog = console.log;
const suppressedKeywords = ['🔍', '📋', '👤', '💰', '🏦', '🎯', '📊', '✅', '💸', '📈', '⚠️', '🕵️‍♂️'];

extendedTestScenarios.forEach((scenario, index) => {
    // Temporarily suppress verbose logs
    console.log = (...args) => {
        const message = args.join(' ');
        if (!suppressedKeywords.some(keyword => message.includes(keyword))) {
            originalLog.apply(console, args);
        }
    };

    console.log = originalLog; // Restore for test header
    console.log(`\n📋 Test ${index + 1}: ${scenario.name}`);
    console.log(`   ${scenario.description}`);
    console.log(`   Expected Score: ${scenario.expectedMin}-${scenario.expectedMax}/100`);
    
    // Suppress logs during calculation
    console.log = (...args) => {
        const message = args.join(' ');
        if (!suppressedKeywords.some(keyword => message.includes(keyword))) {
            originalLog.apply(console, args);
        }
    };
    
    try {
        const startTime = Date.now();
        const result = calculateFinancialHealthScore(scenario.data);
        const duration = Date.now() - startTime;
        
        console.log = originalLog; // Restore for results
        
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
                const status = data.details?.status || 'unknown';
                console.log(`   - ${factor}: ${data.score}/${data.maxScore} (${status})`);
            });
        }
        
        if (!passed && !hasNaNValue) {
            console.log(`\n   ⚠️  Score outside expected range: ${result.totalScore} not in [${scenario.expectedMin}-${scenario.expectedMax}]`);
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
        console.log = originalLog;
        console.log(`   ❌ ERROR: ${error.message}`);
        console.log(`   Stack: ${error.stack}`);
        failedTests++;
    }
});

console.log = originalLog; // Ensure console is restored

console.log('\n' + '='.repeat(60));
console.log('📊 Extended Test Summary:');
console.log(`   Total Tests: ${extendedTestScenarios.length}`);
console.log(`   Passed: ${passedTests} ✅`);
console.log(`   Failed: ${failedTests} ❌`);
console.log(`   NaN Issues: ${testsWithNaN} ⚠️`);
console.log(`   Success Rate: ${Math.round(passedTests / extendedTestScenarios.length * 100)}%`);
console.log('='.repeat(60));

// Overall summary
console.log('\n🎯 Key Insights:');
if (testsWithNaN === 0) {
    console.log('   ✅ No NaN values detected - calculations are stable');
} else {
    console.log(`   ⚠️  ${testsWithNaN} tests had NaN values - investigation needed`);
}

if (passedTests === extendedTestScenarios.length) {
    console.log('   ✅ All scenarios passed - system is working correctly');
} else if (passedTests >= extendedTestScenarios.length * 0.8) {
    console.log('   🟡 Most scenarios passed - minor adjustments may be needed');
} else {
    console.log('   🔴 Many scenarios failed - significant issues detected');
}