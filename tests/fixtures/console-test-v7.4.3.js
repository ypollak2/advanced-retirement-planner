// Console test for v7.4.3 fixes
// Copy and paste this entire script into the browser console at https://ypollak2.github.io/advanced-retirement-planner/

console.log('=== TESTING v7.4.3 FIXES ===');

// Test data with all required fields
const testData = {
    // Basic info
    currentAge: 35,
    retirementAge: 67,
    planningType: 'individual',
    
    // Income data - multiple field names to ensure compatibility
    currentMonthlySalary: 25000,
    currentSalary: 25000,
    monthlySalary: 25000,
    salary: 25000,
    monthlyIncome: 25000,
    
    // Savings data
    currentSavings: 500000,
    currentPensionSavings: 300000,
    currentTrainingFund: 200000,
    currentPersonalPortfolio: 100000,
    currentBankAccount: 50000,
    currentEmergencyFund: 100000,
    emergencyFund: 100000,
    
    // Monthly contributions
    monthlyContribution: 2500,
    monthlyAdditionalSavings: 1000,
    additionalMonthlySavings: 1000,
    personalPortfolioMonthly: 500,
    monthlyTrainingFundContribution: 625,
    
    // Contribution rates
    pensionEmployeeRate: 7,
    pensionContributionRate: 7,
    pensionEmployee: 7,
    trainingFundEmployeeRate: 2.5,
    trainingFundContributionRate: 2.5,
    trainingFundEmployee: 2.5,
    
    // Returns
    pensionReturn: 5,
    trainingFundReturn: 4,
    personalPortfolioReturn: 6,
    trainingFundManagementFee: 0.5,
    
    // Risk and tax
    riskTolerance: 'moderate',
    riskProfile: 'moderate',
    stockPercentage: 60,
    taxCountry: 'israel',
    
    // Expenses
    monthlyExpenses: 15000,
    currentMonthlyExpenses: 15000,
    
    // Other
    inflationRate: 2,
    targetReplacement: 70,
    
    // Work periods (for some calculators)
    workPeriods: [{
        startAge: 25,
        endAge: 67,
        monthlyContribution: 2500,
        monthlyTrainingFund: 625
    }]
};

// 1. Test Tax Optimization
console.log('\n1. Testing Tax Optimization Fix:');
try {
    if (window.taxOptimization) {
        const taxResult = window.taxOptimization.analyzePersonalTaxSituation(testData);
        console.log('✅ Tax optimization working:', taxResult);
        console.log('   Monthly tax savings:', taxResult.summary.totalMonthlySavings);
        console.log('   Annual tax savings:', taxResult.summary.totalAnnualSavings);
    } else {
        console.error('❌ taxOptimization not found on window');
    }
} catch (error) {
    console.error('❌ Tax optimization error:', error.message);
}

// 2. Test Financial Health Calculators
console.log('\n2. Testing Financial Health Calculators:');
const calculators = [
    { name: 'savingsRate', func: window.calculateSavingsRateScore },
    { name: 'retirementReadiness', func: window.calculateRetirementReadinessScore },
    { name: 'riskAlignment', func: window.calculateRiskAlignmentScore },
    { name: 'taxEfficiency', func: window.calculateTaxEfficiencyScore },
    { name: 'timeHorizon', func: window.calculateTimeHorizonScore },
    { name: 'diversification', func: window.calculateDiversificationScore },
    { name: 'emergencyFund', func: window.calculateEmergencyFundScore },
    { name: 'debtManagement', func: window.calculateDebtManagementScore }
];

let totalScore = 0;
const results = {};

calculators.forEach(calc => {
    try {
        if (calc.func) {
            const result = calc.func(testData);
            results[calc.name] = result;
            totalScore += result.score || 0;
            
            if (result.score === 0) {
                console.warn(`⚠️ ${calc.name}: Score = 0`, result.details);
            } else {
                console.log(`✅ ${calc.name}: Score = ${result.score}`, result.details);
            }
        } else {
            console.error(`❌ ${calc.name}: Function not found`);
        }
    } catch (error) {
        console.error(`❌ ${calc.name}: Error -`, error.message);
    }
});

console.log(`\nTotal Financial Health Score: ${totalScore}/100`);

// 3. Test Chart Component
console.log('\n3. Testing Chart Component:');
if (window.SimpleChart) {
    console.log('✅ SimpleChart component is available');
} else {
    console.error('❌ SimpleChart component not found');
}

// 4. Check if chart is rendered in DOM
const chartElements = document.querySelectorAll('canvas');
if (chartElements.length > 0) {
    console.log(`✅ Found ${chartElements.length} chart canvas element(s) in DOM`);
} else {
    console.log('⚠️ No chart canvas elements found - navigate to Results tab to see chart');
}

// 5. Test Field Mapping Bridge
console.log('\n4. Testing Field Mapping Bridge:');
if (window.fieldMappingBridge) {
    console.log('✅ Field mapping bridge available');
    
    // Test finding salary field
    const salaryValue = window.fieldMappingBridge.findFieldValue(testData, 'currentMonthlySalary');
    console.log('   Found salary:', salaryValue);
    
    // Test finding pension rate
    const pensionRate = window.fieldMappingBridge.findFieldValue(testData, 'pensionEmployeeRate');
    console.log('   Found pension rate:', pensionRate);
} else {
    console.error('❌ Field mapping bridge not found');
}

// 6. Detailed Calculator Diagnostics
console.log('\n5. Detailed Diagnostics for 0% Scores:');
Object.entries(results).forEach(([name, result]) => {
    if (result.score === 0) {
        console.log(`\n${name} returned 0 because:`);
        if (result.details) {
            console.log('   Status:', result.details.status);
            console.log('   Details:', result.details);
            
            if (result.details.debugInfo) {
                console.log('   Debug Info:', result.details.debugInfo);
                if (result.details.debugInfo.missingFieldSuggestions) {
                    console.log('   Missing fields:', result.details.debugInfo.missingFieldSuggestions);
                }
                if (result.details.debugInfo.suggestion) {
                    console.log('   Suggestion:', result.details.debugInfo.suggestion);
                }
            }
        }
    }
});

// Summary
console.log('\n=== SUMMARY ===');
console.log('Version:', window.APP_VERSION || 'Unknown');
console.log('Tax Optimization:', window.taxOptimization ? '✅ Fixed' : '❌ Not Fixed');
console.log('Calculators Available:', calculators.filter(c => c.func).length + '/' + calculators.length);
console.log('Zero Scores:', Object.values(results).filter(r => r.score === 0).length);
console.log('Chart Component:', window.SimpleChart ? '✅ Available' : '❌ Not Available');

console.log('\n💡 If calculators return 0, check the debug info above for missing fields.');
console.log('💡 To see the chart, navigate to the Results tab after running calculations.');

// Return results for further inspection
window.testResults = {
    testData,
    results,
    totalScore
};