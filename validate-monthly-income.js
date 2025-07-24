#!/usr/bin/env node

// Validate Monthly Income Calculation - Debug the 0 value issue

const fs = require('fs');
const path = require('path');

console.log('🔍 MONTHLY INCOME CALCULATION VALIDATION');
console.log('=' .repeat(50));

// Setup
global.window = {};
global.Intl = Intl;

// Load modules
try {
    const marketConstantsPath = path.join(__dirname, 'src/data/marketConstants.js');
    eval(fs.readFileSync(marketConstantsPath, 'utf8'));
    
    const retirementCalcPath = path.join(__dirname, 'src/utils/retirementCalculations.js');
    const retirementCalcCode = fs.readFileSync(retirementCalcPath, 'utf8');
    const fixedCode = retirementCalcCode
        .replace(/calculateWeightedReturn\(/g, 'window.calculateWeightedReturn(')
        .replace(/getAdjustedReturn\(/g, 'window.getAdjustedReturn(')
        .replace(/riskScenarios\[/g, 'window.riskScenarios[')
        .replace(/countryData\[/g, 'window.countryData[')
        .replace(/window\.window\./g, 'window.');
    eval(fixedCode);
    console.log('✅ Modules loaded\n');
} catch (error) {
    console.error('❌ Module loading failed:', error.message);
    process.exit(1);
}

// Test inputs
const inputs = {
    currentAge: 39, retirementAge: 67, monthlyExpenses: 35000,
    country: 'israel', planningType: 'single', currentSalary: 20000,
    currentSavings: 100000, currentRealEstate: 0, currentCrypto: 0,
    currentStocks: 50000, currentBonds: 25000, currentCash: 25000,
    currentTrainingFund: 50000, currentPersonalPortfolio: 100000,
    pensionEmployeeRate: 7.0, pensionEmployerRate: 14.333, trainingFundRate: 10.0,
    trainingFundReturn: 8.0, trainingFundManagementFee: 0.5,
    personalPortfolioReturn: 7.0, personalPortfolioMonthly: 1000,
    cryptoReturn: 15.0, cryptoMonthly: 0, realEstateReturn: 6.0,
    realEstateMonthly: 0, realEstateRentalYield: 4.0, riskTolerance: 'moderate'
};

const workPeriods = [{
    startAge: 25, endAge: 67, monthlySalary: 20000, country: 'israel',
    monthlyContribution: 20000 * 0.21333, monthlyTrainingFund: 20000 * 0.10,
    pensionReturn: 8.0, pensionDepositFee: 0.1, pensionAnnualFee: 0.5
}];

const result = window.calculateRetirement(
    inputs, workPeriods,
    [{ index: 0, percentage: 60, customReturn: null }, { index: 1, percentage: 30, customReturn: null }, { index: 2, percentage: 10, customReturn: null }],
    [{ index: 0, percentage: 70, customReturn: null }, { index: 1, percentage: 20, customReturn: null }, { index: 2, percentage: 10, customReturn: null }],
    window.historicalReturns || { 20: [8.5, 4.2, 1.5] },
    inputs.currentSalary * (inputs.trainingFundRate / 100), []
);

console.log('📊 MONTHLY INCOME COMPONENT ANALYSIS');
console.log('='.repeat(40));

if (result) {
    // Individual components
    const netPension = result.netPension || 0;
    const netTrainingFund = result.netTrainingFundIncome || 0;
    const netPersonalPortfolio = result.netPersonalPortfolioIncome || 0;
    const netCrypto = result.netCryptoIncome || 0;
    const netRealEstate = result.netRealEstateIncome || 0;
    const socialSecurity = result.socialSecurity || 0;
    const additionalIncome = result.additionalIncomeTotal || 0;
    
    console.log(`🏛️  Net Pension Income: ${netPension.toLocaleString('he-IL')} ILS`);
    console.log(`🎓 Net Training Fund Income: ${netTrainingFund.toLocaleString('he-IL')} ILS`);
    console.log(`📈 Net Personal Portfolio: ${netPersonalPortfolio.toLocaleString('he-IL')} ILS`);
    console.log(`₿ Net Crypto Income: ${netCrypto.toLocaleString('he-IL')} ILS`);
    console.log(`🏠 Net Real Estate Income: ${netRealEstate.toLocaleString('he-IL')} ILS`);
    console.log(`🏛️  Social Security: ${socialSecurity.toLocaleString('he-IL')} ILS`);
    console.log(`💰 Additional Income: ${additionalIncome.toLocaleString('he-IL')} ILS`);
    
    // Manual calculation
    const manualTotal = netPension + netTrainingFund + netPersonalPortfolio + 
                       netCrypto + netRealEstate + socialSecurity + additionalIncome;
    
    console.log('\n🧮 CALCULATION VERIFICATION:');
    console.log(`➕ Manual Sum: ${manualTotal.toLocaleString('he-IL')} ILS`);
    console.log(`📊 Result.monthlyIncome: ${(result.monthlyIncome || 0).toLocaleString('he-IL')} ILS`);
    console.log(`📊 Result.totalNetIncome: ${(result.totalNetIncome || 0).toLocaleString('he-IL')} ILS`);
    console.log(`📊 Result.individualNetIncome: ${(result.individualNetIncome || 0).toLocaleString('he-IL')} ILS`);
    
    const difference = Math.abs(manualTotal - (result.monthlyIncome || 0));
    console.log(`🔍 Difference: ${difference.toLocaleString('he-IL')} ILS`);
    
    if (difference < 0.01) {
        console.log('✅ Monthly income calculation is CORRECT');
    } else {
        console.log('⚠️  Monthly income calculation discrepancy detected');
    }
    
    // Income replacement analysis
    console.log('\n📊 INCOME REPLACEMENT ANALYSIS:');
    const targetExpenses = inputs.monthlyExpenses;
    const actualIncome = manualTotal; // Use our manual calculation
    const replacementRatio = (actualIncome / targetExpenses) * 100;
    
    console.log(`🎯 Target Monthly Expenses: ${targetExpenses.toLocaleString('he-IL')} ILS`);
    console.log(`💰 Actual Monthly Income: ${actualIncome.toLocaleString('he-IL')} ILS`);
    console.log(`📊 Income Replacement Ratio: ${replacementRatio.toFixed(1)}%`);
    
    if (replacementRatio >= 70) {
        console.log('✅ EXCEEDS recommended 70% replacement ratio');
    } else {
        console.log('⚠️  Below recommended 70% replacement ratio');
    }
    
    const surplus = actualIncome - targetExpenses;
    console.log(`💎 Monthly Surplus/Deficit: ${surplus.toLocaleString('he-IL')} ILS`);
    
    // Years of coverage
    const totalSavings = result.totalSavings || 0;
    const yearsOfCoverage = totalSavings / (actualIncome * 12);
    console.log(`⏳ Years of Income Coverage: ${yearsOfCoverage.toFixed(1)} years`);
    
} else {
    console.log('❌ No result to analyze');
}

console.log('\n🎉 Validation completed!');