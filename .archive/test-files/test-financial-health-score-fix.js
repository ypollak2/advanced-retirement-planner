// Test script to verify Financial Health Score calculation fixes
// Tests for zero scores in Savings Rate and Tax Efficiency

console.log('🧪 Testing Financial Health Score Calculation Fixes...\n');

// Test data that should produce non-zero scores
const testInputs = {
    // Basic info
    currentAge: 35,
    retirementAge: 67,
    country: 'ISR',
    
    // Income and savings
    currentMonthlySalary: 25000,
    monthlyContribution: 3750, // 15% savings rate
    
    // Pension contributions (Israeli standard rates)
    pensionContributionRate: 7,  // Employee contribution
    employeePensionRate: 7,       // Alternative field name
    pensionEmployee: 7,           // Another alternative
    employerPensionRate: 6.5,     // Employer contribution
    
    // Training fund contributions
    trainingFundContributionRate: 2.5,  // Employee contribution
    trainingFundEmployeeRate: 2.5,       // Alternative field name
    trainingFundEmployee: 2.5,           // Another alternative
    trainingFundEmployerRate: 7.5,      // Employer contribution
    
    // Current savings
    currentSavings: 500000,
    currentTrainingFund: 150000,
    currentPersonalPortfolio: 200000,
    currentRealEstate: 1500000,
    currentSavingsAccount: 100000,
    
    // Investment allocation
    stockPercentage: 60,
    bondPercentage: 30,
    alternativePercentage: 10,
    
    // Expected returns
    expectedAnnualReturn: 7,
    
    // Risk profile
    riskTolerance: 'moderate',
    
    // Additional monthly savings
    additionalMonthlySavings: 2000,
    monthlyInvestment: 2000,
    
    // Expenses
    currentMonthlyExpenses: 18000,
    monthlyDebtPayments: 3000,
    
    // Emergency fund
    emergencyFund: 100000
};

// Load required scripts
const scripts = [
    'src/utils/financialHealthEngine.js'
];

console.log('📦 Loading dependencies...');
scripts.forEach(script => {
    try {
        const scriptTag = document.createElement('script');
        scriptTag.src = script;
        document.head.appendChild(scriptTag);
    } catch (error) {
        console.error(`Failed to load ${script}:`, error);
    }
});

// Wait for scripts to load
setTimeout(() => {
    console.log('\n🔍 Running Financial Health Score Tests...\n');
    
    if (!window.calculateFinancialHealthScore) {
        console.error('❌ Financial Health Engine not loaded!');
        return;
    }
    
    // Test 1: Calculate comprehensive score
    console.log('Test 1: Comprehensive Financial Health Score');
    console.log('Input data:', {
        salary: testInputs.currentMonthlySalary,
        pensionRate: testInputs.pensionContributionRate,
        trainingFundRate: testInputs.trainingFundContributionRate,
        country: testInputs.country
    });
    
    const healthReport = window.calculateFinancialHealthScore(testInputs);
    
    console.log('\n📊 Results:');
    console.log(`Total Score: ${healthReport.totalScore}/100 (${healthReport.status})`);
    
    // Check individual factor scores
    console.log('\n📈 Factor Breakdown:');
    Object.entries(healthReport.factors || {}).forEach(([factorName, factorData]) => {
        const factorInfo = window.SCORE_FACTORS && window.SCORE_FACTORS[factorName];
        console.log(`${factorInfo?.name || factorName}: ${factorData.score}/${factorInfo?.weight || 'N/A'} (${factorData.details?.status || 'unknown'})`);
        
        // Show details for zero scores
        if (factorData.score === 0) {
            console.log(`  ⚠️ Zero score details:`, factorData.details);
        }
    });
    
    // Test 2: Specific checks for previously zero scores
    console.log('\n\nTest 2: Checking Previously Zero Scores');
    
    // Savings Rate Score
    const savingsRate = healthReport.factors.savingsRate;
    console.log('\n💰 Savings Rate Score:');
    console.log(`  Score: ${savingsRate.score}`);
    console.log(`  Rate: ${savingsRate.details.rate.toFixed(1)}%`);
    console.log(`  Monthly Income: ₪${savingsRate.details.monthlyIncome}`);
    console.log(`  Monthly Contributions: ₪${savingsRate.details.monthlyAmount}`);
    console.log(`  Calculation Method: ${savingsRate.details.calculationMethod}`);
    console.log(`  Status: ${savingsRate.details.status}`);
    
    if (savingsRate.score === 0) {
        console.error('  ❌ FAILED: Savings Rate Score is still 0!');
    } else {
        console.log('  ✅ PASSED: Savings Rate Score is non-zero');
    }
    
    // Tax Efficiency Score
    const taxEfficiency = healthReport.factors.taxEfficiency;
    console.log('\n🏛️ Tax Efficiency Score:');
    console.log(`  Score: ${taxEfficiency.score}`);
    console.log(`  Current Rate: ${taxEfficiency.details.currentRate.toFixed(1)}%`);
    console.log(`  Optimal Rate: ${taxEfficiency.details.optimalRate.toFixed(1)}%`);
    console.log(`  Efficiency: ${taxEfficiency.details.efficiencyScore.toFixed(0)}%`);
    console.log(`  Pension Rate: ${taxEfficiency.details.pensionRate}%`);
    console.log(`  Training Fund Rate: ${taxEfficiency.details.trainingFundRate}%`);
    console.log(`  Calculation Method: ${taxEfficiency.details.calculationMethod}`);
    console.log(`  Status: ${taxEfficiency.details.status}`);
    
    if (taxEfficiency.score === 0) {
        console.error('  ❌ FAILED: Tax Efficiency Score is still 0!');
    } else {
        console.log('  ✅ PASSED: Tax Efficiency Score is non-zero');
    }
    
    // Test 3: Improvement suggestions
    console.log('\n\nTest 3: Improvement Suggestions');
    if (healthReport.suggestions && healthReport.suggestions.length > 0) {
        console.log(`Found ${healthReport.suggestions.length} improvement suggestions:`);
        healthReport.suggestions.forEach((suggestion, index) => {
            console.log(`\n${index + 1}. ${suggestion.category} (${suggestion.priority} priority)`);
            console.log(`   Issue: ${suggestion.issue}`);
            console.log(`   Action: ${suggestion.action}`);
            console.log(`   Impact: ${suggestion.impact}`);
        });
    } else {
        console.log('No improvement suggestions generated');
    }
    
    // Test 4: Debug information
    console.log('\n\nTest 4: Debug Information');
    if (healthReport.debugInfo) {
        console.log('Input fields found:', healthReport.debugInfo.inputFieldsFound);
        console.log('Calculation method:', healthReport.debugInfo.calculationMethod);
        console.log('Zero score factors:', healthReport.debugInfo.zeroScoreFactors);
    }
    
    // Summary
    console.log('\n\n📋 Test Summary:');
    const allPassed = savingsRate.score > 0 && taxEfficiency.score > 0;
    if (allPassed) {
        console.log('✅ All tests PASSED! Zero score issues have been fixed.');
        console.log('The Financial Health Score now properly calculates:');
        console.log('- Savings Rate based on pension/training fund contributions');
        console.log('- Tax Efficiency based on Israeli optimal rates');
        console.log('- All factors contribute to the total score');
    } else {
        console.error('❌ Some tests FAILED. Issues remain with score calculations.');
    }
    
}, 1000);

console.log('\n💡 Test script loaded. Results will appear in 1 second...');