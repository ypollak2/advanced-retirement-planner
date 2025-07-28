// Test Financial Health Score Debug Fix
// Simulate the exact scenario from the screenshots to verify the fix

console.log('🧪 === TESTING FINANCIAL HEALTH SCORE DEBUG FIX ===\n');

// Simulate browser environment
global.window = global;
global.console = console;

// Load required utilities
const fs = require('fs');
const path = require('path');

// Load the enhanced financial health engine
const enginePath = path.join(__dirname, 'src/utils/financialHealthEngine.js');
const engineCode = fs.readFileSync(enginePath, 'utf8');
eval(engineCode);

// Load the debugger
const debuggerPath = path.join(__dirname, 'src/utils/financialHealthDebugger.js');
const debuggerCode = fs.readFileSync(debuggerPath, 'utf8');
eval(debuggerCode);

console.log('✅ Financial Health Engine and Debugger loaded\n');

// Test Case 1: Simulate the exact problem scenario from the screenshots
console.log('🔍 TEST CASE 1: Simulating the exact problem scenario\n');

const problemInputs = {
    planningType: 'individual',
    currentMonthlySalary: 15000,
    pensionContributionRate: 21.333,
    trainingFundContributionRate: 10.0,
    currentSavings: 50000,
    currentPersonalPortfolio: 30000,
    currentRealEstate: 200000,
    emergencyFund: 18000,
    currentAge: 35,
    retirementAge: 67,
    country: 'israel',
    taxCountry: 'israel',
    expenses: {
        housing: 4000,
        transportation: 800,
        food: 1200,
        insurance: 500,
        other: 1000,
        mortgage: 2000,
        carLoan: 600,
        creditCard: 300,
        otherDebt: 0
    },
    portfolioAllocations: [
        { index: 'stocks', percentage: 60 },
        { index: 'bonds', percentage: 30 },
        { index: 'cash', percentage: 10 }
    ]
};

console.log('📋 Test inputs:', problemInputs);

// Run the debug analysis
console.log('\n🔍 === DEBUG ANALYSIS ===');
const debugResults = debugFinancialHealthInputs(problemInputs);

console.log('\n🧮 === CALCULATING FINANCIAL HEALTH SCORE ===');
const healthScore = calculateFinancialHealthScore(problemInputs);

console.log('\n📊 === RESULTS COMPARISON ===');
console.log('Final Health Score:', healthScore.totalScore);
console.log('Score Status:', healthScore.status);

// Check individual component scores
console.log('\n🔍 === COMPONENT SCORE BREAKDOWN ===');
Object.entries(healthScore.factors).forEach(([factorName, factorData]) => {
    const maxScore = window.SCORE_FACTORS[factorName]?.weight || 'unknown';
    console.log(`${factorName}: ${factorData.score}/${maxScore} (${factorData.details?.status || 'no status'})`);
    
    if (factorData.score === 0) {
        console.log(`  ⚠️ Zero score reason:`, factorData.details?.debugInfo?.reason || 'Unknown');
        console.log(`  💡 Suggestion:`, factorData.details?.debugInfo?.suggestion || 'No suggestion');
    }
});

console.log('\n🎯 === EXPECTED VS ACTUAL ===');
const expectedNonZeroScores = ['savingsRate', 'taxEfficiency', 'diversification', 'riskAlignment', 'retirementReadiness'];
const actualNonZeroScores = Object.entries(healthScore.factors)
    .filter(([_, factorData]) => factorData.score > 0)
    .map(([factorName]) => factorName);

console.log('Expected non-zero scores:', expectedNonZeroScores);
console.log('Actual non-zero scores:', actualNonZeroScores);

const fixSuccess = expectedNonZeroScores.every(score => actualNonZeroScores.includes(score));
console.log(`\n${fixSuccess ? '✅' : '❌'} Fix Status: ${fixSuccess ? 'SUCCESS' : 'FAILED'}`);

if (fixSuccess) {
    console.log('🎉 All expected components now have non-zero scores!');
} else {
    const stillZero = expectedNonZeroScores.filter(score => !actualNonZeroScores.includes(score));
    console.log('❌ Still showing zero scores:', stillZero);
}

console.log('\n🔍 === DEBUGGING MISSING SCORES ===');
if (!fixSuccess) {
    console.log('Analyzing why scores are still zero...');
    
    expectedNonZeroScores.forEach(scoreName => {
        if (!actualNonZeroScores.includes(scoreName)) {
            const factorData = healthScore.factors[scoreName];
            console.log(`\n❌ ${scoreName} is still zero:`);
            console.log('  Status:', factorData.details?.status);
            console.log('  Debug info:', factorData.details?.debugInfo);
            console.log('  Calculation method:', factorData.details?.calculationMethod);
        }
    });
}

// Test Case 2: Couple mode test
console.log('\n\n🔍 TEST CASE 2: Testing couple mode\n');

const coupleInputs = {
    planningType: 'couple',
    partner1Salary: 12000,
    partner2Salary: 8000,
    pensionContributionRate: 21.333,
    trainingFundContributionRate: 10.0,
    currentSavings: 80000,
    currentPersonalPortfolio: 50000,
    emergencyFund: 25000,
    currentAge: 30,
    retirementAge: 67,
    country: 'israel'
};

console.log('📋 Couple test inputs:', coupleInputs);

const coupleHealthScore = calculateFinancialHealthScore(coupleInputs);
console.log('\n📊 Couple Health Score:', coupleHealthScore.totalScore);

const coupleNonZeroScores = Object.entries(coupleHealthScore.factors)
    .filter(([_, factorData]) => factorData.score > 0)
    .map(([factorName]) => factorName);

console.log('Couple non-zero scores:', coupleNonZeroScores);

const coupleSavingsRate = coupleHealthScore.factors.savingsRate;
console.log('\nCouple Savings Rate Details:');
console.log('  Score:', coupleSavingsRate.score);
console.log('  Rate:', coupleSavingsRate.details?.rate);
console.log('  Monthly Income:', coupleSavingsRate.details?.monthlyIncome);
console.log('  Monthly Contributions:', coupleSavingsRate.details?.monthlyAmount);

console.log('\n🎯 === FINAL TEST RESULTS ===');
console.log(`Individual mode fix: ${fixSuccess ? '✅ SUCCESS' : '❌ FAILED'}`);
console.log(`Couple mode working: ${coupleNonZeroScores.includes('savingsRate') ? '✅ SUCCESS' : '❌ FAILED'}`);

const overallSuccess = fixSuccess && coupleNonZeroScores.includes('savingsRate');
console.log(`\n🎉 Overall fix status: ${overallSuccess ? '✅ SUCCESS - All scenarios working!' : '❌ NEEDS MORE WORK'}`);

console.log('\n✅ Test completed!');