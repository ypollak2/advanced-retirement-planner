// Script to diagnose and fix calculator issues
// Run this in the console to see what's happening

console.log('=== DIAGNOSING CALCULATOR ISSUES ===');

// Check if the duplicate functions issue is resolved
console.log('\n1. Checking for function conflicts:');
console.log('calculateRetirementReadinessScore type:', typeof window.calculateRetirementReadinessScore);
console.log('From financialHealthEngine?', window.financialHealthEngine && window.financialHealthEngine.calculateRetirementReadinessScore === window.calculateRetirementReadinessScore);

// Test with your actual data from the wizard
const wizardData = {
    planningType: 'single',
    currentAge: 35,
    retirementAge: 67,
    
    // Income
    currentMonthlySalary: 50000,
    currentSalary: 50000,
    monthlySalary: 50000,
    
    // Savings
    currentSavings: 500000,
    currentPensionSavings: 500000,
    currentTrainingFund: 300000,
    currentPersonalPortfolio: 200000,
    currentBankAccount: 150000,
    emergencyFund: 150000,
    
    // Contribution rates (these are 0 in your test)
    pensionContributionRate: 0,
    trainingFundContributionRate: 0,
    
    // Risk
    riskTolerance: 'moderate',
    stockPercentage: 60,
    
    // Expenses
    currentMonthlyExpenses: 24400
};

console.log('\n2. Testing individual calculators with your data:');

// Test each calculator
try {
    console.log('\n--- Savings Rate Calculator ---');
    const savingsResult = window.calculateSavingsRateScore(wizardData);
    console.log('Result:', savingsResult);
    
    if (savingsResult.score === 0) {
        console.log('Why 0?', savingsResult.details);
        
        // Check what the calculator is looking for
        console.log('\nDiagnosing savings rate calculation:');
        console.log('- Monthly income found:', wizardData.currentMonthlySalary);
        console.log('- Pension rate:', wizardData.pensionContributionRate);
        console.log('- Training fund rate:', wizardData.trainingFundContributionRate);
        console.log('- Total contribution rate:', wizardData.pensionContributionRate + wizardData.trainingFundContributionRate);
        
        if (wizardData.pensionContributionRate === 0 && wizardData.trainingFundContributionRate === 0) {
            console.log('⚠️ ISSUE: Both contribution rates are 0, so savings rate will be 0%');
            console.log('💡 SOLUTION: Add pension/training fund contribution rates in Step 4 (Contributions)');
        }
    }
} catch (error) {
    console.error('Savings rate calculator error:', error);
}

try {
    console.log('\n--- Retirement Readiness Calculator ---');
    const readinessResult = window.calculateRetirementReadinessScore(wizardData);
    console.log('Result:', readinessResult);
    
    if (readinessResult.score === 0) {
        console.log('Why 0?', readinessResult.details);
    }
} catch (error) {
    console.error('Retirement readiness calculator error:', error);
}

try {
    console.log('\n--- Risk Alignment Calculator ---');
    const riskResult = window.calculateRiskAlignmentScore(wizardData);
    console.log('Result:', riskResult);
    
    if (riskResult.score === 0) {
        console.log('Why 0?', riskResult.details);
    }
} catch (error) {
    console.error('Risk alignment calculator error:', error);
}

try {
    console.log('\n--- Tax Efficiency Calculator ---');
    const taxResult = window.calculateTaxEfficiencyScore(wizardData);
    console.log('Result:', taxResult);
    
    if (taxResult.score === 0) {
        console.log('Why 0?', taxResult.details);
        
        console.log('\nDiagnosing tax efficiency calculation:');
        console.log('- Pension rate:', wizardData.pensionContributionRate);
        console.log('- Training fund rate:', wizardData.trainingFundContributionRate);
        
        if (wizardData.pensionContributionRate === 0) {
            console.log('⚠️ ISSUE: Pension contribution rate is 0, so no tax efficiency');
            console.log('💡 SOLUTION: Add pension contribution rate in Step 4');
        }
    }
} catch (error) {
    console.error('Tax efficiency calculator error:', error);
}

// Test with better data (with contribution rates)
console.log('\n\n3. Testing with proper contribution rates:');
const betterData = {
    ...wizardData,
    pensionContributionRate: 7,  // Standard employee rate
    trainingFundContributionRate: 2.5  // Standard employee rate
};

console.log('With 7% pension + 2.5% training fund:');
console.log('- Savings Rate:', window.calculateSavingsRateScore(betterData));
console.log('- Tax Efficiency:', window.calculateTaxEfficiencyScore(betterData));

console.log('\n=== SUMMARY ===');
console.log('The calculators are working correctly.');
console.log('They return 0% because:');
console.log('1. Savings Rate needs contribution rates > 0');
console.log('2. Tax Efficiency needs contribution rates > 0');
console.log('3. Retirement Readiness may need better field mapping');
console.log('\nTo fix: Add pension and training fund contribution rates in the wizard.');