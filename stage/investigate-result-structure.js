#!/usr/bin/env node

// Investigate the actual structure of the calculation result

const fs = require('fs');
const path = require('path');

console.log('🔍 INVESTIGATING CALCULATION RESULT STRUCTURE');
console.log('='.repeat(55));

// Setup environment
global.window = {};
global.Intl = Intl;

// Load dependencies
try {
    const marketConstantsPath = path.join(__dirname, 'src/data/marketConstants.js');
    const marketConstantsCode = fs.readFileSync(marketConstantsPath, 'utf8');
    eval(marketConstantsCode);
    
    const retirementCalcPath = path.join(__dirname, 'src/utils/retirementCalculations.js');
    const retirementCalcCode = fs.readFileSync(retirementCalcPath, 'utf8');
    const fixedCode = retirementCalcCode
        .replace(/calculateWeightedReturn\(/g, 'window.calculateWeightedReturn(')
        .replace(/getAdjustedReturn\(/g, 'window.getAdjustedReturn(')
        .replace(/riskScenarios\[/g, 'window.riskScenarios[')
        .replace(/countryData\[/g, 'window.countryData[')
        .replace(/window\.window\./g, 'window.');
    eval(fixedCode);
} catch (error) {
    console.error('❌ Failed to load modules:', error.message);
    process.exit(1);
}

const testInputs = {
    currentAge: 39,
    retirementAge: 67,
    monthlyExpenses: 35000,
    country: 'israel',
    planningType: 'single',
    currentSalary: 20000,
    currentSavings: 100000,
    currentRealEstate: 0,
    currentCrypto: 0,
    currentStocks: 50000,
    currentBonds: 25000,
    currentCash: 25000,
    currentTrainingFund: 50000,
    currentPersonalPortfolio: 100000,
    pensionEmployeeRate: 7.0,
    pensionEmployerRate: 14.333,
    trainingFundRate: 10.0,
    trainingFundReturn: 8.0,
    trainingFundManagementFee: 0.5,
    personalPortfolioReturn: 7.0,
    personalPortfolioMonthly: 1000,
    cryptoReturn: 15.0,
    cryptoMonthly: 0,
    realEstateReturn: 6.0,
    realEstateMonthly: 0,
    realEstateRentalYield: 4.0,
    riskTolerance: 'moderate'
};

const workPeriods = [{
    startAge: 25,
    endAge: 67,
    monthlySalary: 20000,
    country: 'israel',
    monthlyContribution: 20000 * 0.21333,
    monthlyTrainingFund: 20000 * 0.10,
    pensionReturn: 8.0,
    pensionDepositFee: 0.1,
    pensionAnnualFee: 0.5
}];

const pensionAllocation = [
    { index: 0, percentage: 60, customReturn: null },
    { index: 1, percentage: 30, customReturn: null },
    { index: 2, percentage: 10, customReturn: null }
];

const trainingFundAllocation = [
    { index: 0, percentage: 70, customReturn: null },
    { index: 1, percentage: 20, customReturn: null },
    { index: 2, percentage: 10, customReturn: null }
];

const historicalReturns = window.historicalReturns || { 20: [8.5, 4.2, 1.5] };

console.log('🧮 Running calculation...\n');

try {
    const result = window.calculateRetirement(
        testInputs,
        workPeriods,
        pensionAllocation,
        trainingFundAllocation,
        historicalReturns,
        testInputs.currentSalary * (testInputs.trainingFundRate / 100),
        []
    );
    
    console.log('✅ Calculation completed successfully!');
    console.log('\n📋 COMPLETE RESULT OBJECT STRUCTURE:');
    console.log('='.repeat(50));
    
    if (result) {
        console.log('🔍 Result type:', typeof result);
        console.log('🔍 Result keys:', Object.keys(result));
        console.log('\n📊 All properties and values:');
        
        for (const [key, value] of Object.entries(result)) {
            const type = typeof value;
            const display = type === 'number' ? 
                (isNaN(value) ? 'NaN' : value.toLocaleString('he-IL')) : 
                String(value);
            console.log(`   ${key}: ${display} (${type})`);
        }
        
        // Check for specific calculations
        console.log('\n🔬 DETAILED ANALYSIS OF KEY CALCULATIONS:');
        console.log('='.repeat(50));
        
        console.log('\n💰 TOTAL SAVINGS BREAKDOWN:');
        if (result.totalPensionSavings) console.log(`   🏛️  Pension: ${result.totalPensionSavings.toLocaleString('he-IL')} ILS`);
        if (result.totalTrainingFund) console.log(`   🎓 Training Fund: ${result.totalTrainingFund.toLocaleString('he-IL')} ILS`);
        if (result.totalPersonalPortfolio) console.log(`   📈 Personal Portfolio: ${result.totalPersonalPortfolio.toLocaleString('he-IL')} ILS`);
        if (result.totalCrypto) console.log(`   ₿ Crypto: ${result.totalCrypto.toLocaleString('he-IL')} ILS`);
        if (result.totalRealEstate) console.log(`   🏠 Real Estate: ${result.totalRealEstate.toLocaleString('he-IL')} ILS`);
        
        console.log('\n📊 INCOME CALCULATIONS:');
        if (result.monthlyPensionIncome) console.log(`   🏛️  Monthly Pension Income: ${result.monthlyPensionIncome.toLocaleString('he-IL')} ILS`);
        if (result.monthlyTrainingFundIncome) console.log(`   🎓 Monthly Training Fund Income: ${result.monthlyTrainingFundIncome.toLocaleString('he-IL')} ILS`);
        if (result.realEstateRentalIncome) console.log(`   🏠 Real Estate Rental Income: ${result.realEstateRentalIncome.toLocaleString('he-IL')} ILS`);
        
        console.log('\n🎯 VERIFICATION CALCULATIONS:');
        const yearsToRetirement = testInputs.retirementAge - testInputs.currentAge;
        console.log(`   Years to retirement: ${yearsToRetirement}`);
        
        // Manual calculation of expected pension contributions
        const monthlyPensionContribution = workPeriods[0].monthlyContribution;
        const totalMonths = yearsToRetirement * 12;
        const totalContributions = monthlyPensionContribution * totalMonths;
        console.log(`   Expected total pension contributions: ${totalContributions.toLocaleString('he-IL')} ILS`);
        
        // Manual calculation of training fund
        const monthlyTrainingFund = workPeriods[0].monthlyTrainingFund;
        const totalTrainingFundContributions = monthlyTrainingFund * totalMonths;
        console.log(`   Expected total training fund contributions: ${totalTrainingFundContributions.toLocaleString('he-IL')} ILS`);
        
    } else {
        console.log('❌ Result is null or undefined');
    }
    
} catch (error) {
    console.error('❌ Calculation failed:', error.message);
    console.error('Stack trace:', error.stack);
}

console.log('\n🎉 Investigation completed!');