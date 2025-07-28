// Simple test for financial health score engine
// Run with: node test-health-score-simple.js

// Mock global window object and required functions
global.window = {};
global.console = console;

// Mock SCORE_FACTORS configuration
global.window.SCORE_FACTORS = {
    savingsRate: { weight: 20, benchmarks: { excellent: 0.20, good: 0.15, fair: 0.10, poor: 0.05 } },
    retirementReadiness: { weight: 25, benchmarks: { excellent: 2.0, good: 1.5, fair: 1.0, poor: 0.5 } },
    timeHorizon: { weight: 10, benchmarks: { excellent: 30, good: 20, fair: 15, poor: 10 } },
    riskAlignment: { weight: 10, benchmarks: { excellent: 90, good: 80, fair: 70, poor: 60 } },
    diversification: { weight: 15, benchmarks: { excellent: 5, good: 4, fair: 3, poor: 2 } },
    taxEfficiency: { weight: 10, benchmarks: { excellent: 90, good: 80, fair: 70, poor: 60 } },
    emergencyFund: { weight: 5, benchmarks: { excellent: 6, good: 4, fair: 3, poor: 1 } },
    debtManagement: { weight: 5, benchmarks: { excellent: 90, good: 80, fair: 70, poor: 60 } }
};

// Load the financial health engine
const fs = require('fs');
const path = require('path');

const enginePath = path.join(__dirname, 'src/utils/financialHealthEngine.js');
const engineCode = fs.readFileSync(enginePath, 'utf8');

// Execute the engine code in the current context
eval(engineCode);

// Test inputs that should work
const testInputs = {
    planningType: 'individual',
    currentAge: 35,
    retirementAge: 67,
    currentMonthlySalary: 25000,
    pensionContributionRate: 17.5,
    trainingFundContributionRate: 7.5,
    currentSavings: 150000,
    currentPersonalPortfolio: 50000,
    currentRealEstate: 800000,
    currentSavingsAccount: 25000,
    expectedReturn: 7.0,
    inflationRate: 3.0,
    riskProfile: 'moderate'
};

console.log('🧪 Testing Financial Health Score Engine');
console.log('📋 Test inputs:', testInputs);
console.log('');

try {
    const result = global.window.calculateFinancialHealthScore(testInputs);
    console.log('🎯 Final result:', JSON.stringify(result, null, 2));
} catch (error) {
    console.error('❌ Error during calculation:', error);
    console.error('Stack trace:', error.stack);
}