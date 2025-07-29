#!/usr/bin/env node

// Debug test for retirement calculations

const fs = require('fs');
const path = require('path');

console.log('🔍 Debug Test - Loading Dependencies Step by Step\n');

// Mock browser globals
global.window = {};
global.Intl = Intl;

// Step 1: Load market constants
console.log('📊 Loading market constants...');
try {
    const marketConstantsPath = path.join(__dirname, 'src/data/marketConstants.js');
    const marketConstantsCode = fs.readFileSync(marketConstantsPath, 'utf8');
    eval(marketConstantsCode);
    
    console.log('✅ Market constants loaded');
    console.log('   - exchangeRates:', Object.keys(window.exchangeRates || {}));
    console.log('   - countryData keys:', Object.keys(window.countryData || {})); 
    console.log('   - riskScenarios keys:', Object.keys(window.riskScenarios || {}));
    console.log('   - historicalReturns keys:', Object.keys(window.historicalReturns || {}));
} catch (error) {
    console.error('❌ Failed to load market constants:', error.message);
    process.exit(1);
}

// Step 2: Load retirement calculations
console.log('\n🧮 Loading retirement calculations...');
try {
    const retirementCalcPath = path.join(__dirname, 'src/utils/retirementCalculations.js');
    const retirementCalcCode = fs.readFileSync(retirementCalcPath, 'utf8');
    
    // Fix function references to use window. prefix
    const fixedCode = retirementCalcCode
        .replace(/calculateWeightedReturn\(/g, 'window.calculateWeightedReturn(')
        .replace(/getAdjustedReturn\(/g, 'window.getAdjustedReturn(')
        .replace(/riskScenarios\[/g, 'window.riskScenarios[')
        .replace(/countryData\[/g, 'window.countryData[')
        .replace(/window\.window\./g, 'window.');
    
    eval(fixedCode);
    
    console.log('✅ Retirement calculations loaded');
    console.log('   - formatCurrency:', typeof window.formatCurrency);
    console.log('   - convertCurrency:', typeof window.convertCurrency);
    console.log('   - calculateWeightedReturn:', typeof window.calculateWeightedReturn);
    console.log('   - getAdjustedReturn:', typeof window.getAdjustedReturn);
    console.log('   - calculateRetirement:', typeof window.calculateRetirement);
} catch (error) {
    console.error('❌ Failed to load retirement calculations:', error.message);
    process.exit(1);
}

// Step 3: Test basic functions
console.log('\n🧪 Testing basic functions...');

// Test formatCurrency
if (typeof window.formatCurrency === 'function') {
    try {
        const formatted = window.formatCurrency(100000);
        console.log('✅ formatCurrency(100000):', formatted);
    } catch (e) {
        console.log('❌ formatCurrency error:', e.message);
    }
} else {
    console.log('❌ formatCurrency not available');
}

// Test convertCurrency
if (typeof window.convertCurrency === 'function') {
    try {
        const converted = window.convertCurrency(100000, 'USD', window.exchangeRates);
        console.log('✅ convertCurrency(100000, USD):', converted);
    } catch (e) {
        console.log('❌ convertCurrency error:', e.message);
    }
} else {
    console.log('❌ convertCurrency not available');
}

// Test calculateWeightedReturn
if (typeof window.calculateWeightedReturn === 'function') {
    try {
        const mockAllocations = [
            { index: 0, percentage: 60, customReturn: null },
            { index: 1, percentage: 30, customReturn: null },
            { index: 2, percentage: 10, customReturn: null }
        ];
        const timeHorizon = 20;
        const mockHistoricalReturns = {
            20: [8.5, 4.2, 1.5]
        };
        
        const weightedReturn = window.calculateWeightedReturn(mockAllocations, timeHorizon, mockHistoricalReturns);
        console.log('✅ calculateWeightedReturn:', weightedReturn.toFixed(2) + '%');
    } catch (e) {
        console.log('❌ calculateWeightedReturn error:', e.message);
    }
} else {
    console.log('❌ calculateWeightedReturn not available');
}

// Test getAdjustedReturn
if (typeof window.getAdjustedReturn === 'function') {
    try {
        const adjustedReturn = window.getAdjustedReturn(8.0, 'moderate');
        console.log('✅ getAdjustedReturn(8.0, moderate):', adjustedReturn.toFixed(2) + '%');
    } catch (e) {
        console.log('❌ getAdjustedReturn error:', e.message);
    }
} else {
    console.log('❌ getAdjustedReturn not available');
}

// Step 4: Test full calculation with minimal inputs
console.log('\n🎯 Testing full retirement calculation...');

if (typeof window.calculateRetirement === 'function') {
    try {
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
            cryptoMonthly: 500,
            realEstateReturn: 6.0,
            realEstateMonthly: 0,
            realEstateRentalYield: 4.0,
            riskTolerance: 'moderate'
        };
        
        const mockWorkPeriods = [
            {
                startAge: 25,
                endAge: 67,
                monthlySalary: 20000,
                country: 'israel',
                monthlyContribution: 20000 * 0.21333,
                monthlyTrainingFund: 20000 * 0.10,
                pensionReturn: 8.0,
                pensionDepositFee: 0.1,
                pensionAnnualFee: 0.5
            }
        ];
        
        const mockPensionAllocation = [
            { index: 0, percentage: 60, customReturn: null },
            { index: 1, percentage: 30, customReturn: null },
            { index: 2, percentage: 10, customReturn: null }
        ];
        
        const mockTrainingFundAllocation = [
            { index: 0, percentage: 70, customReturn: null },
            { index: 1, percentage: 20, customReturn: null },
            { index: 2, percentage: 10, customReturn: null }
        ];
        
        const mockHistoricalReturns = window.historicalReturns || {
            20: [8.5, 4.2, 1.5]
        };
        
        const monthlyTrainingFundContribution = testInputs.currentSalary * (testInputs.trainingFundRate / 100);
        
        console.log('🔄 Running calculation...');
        const result = window.calculateRetirement(
            testInputs,
            mockWorkPeriods,
            mockPensionAllocation,
            mockTrainingFundAllocation,
            mockHistoricalReturns,
            monthlyTrainingFundContribution,
            []
        );
        
        if (result) {
            console.log('✅ Calculation successful!');
            console.log('   📊 Results:');
            if (result.totalSavings) console.log(`   💰 Total Savings: ${result.totalSavings.toLocaleString('he-IL')} ILS`);
            if (result.monthlyIncome) console.log(`   🏦 Monthly Income: ${result.monthlyIncome.toLocaleString('he-IL')} ILS`);
            if (result.pensionTotal) console.log(`   🏛️  Pension Total: ${result.pensionTotal.toLocaleString('he-IL')} ILS`);
            if (result.trainingFundTotal) console.log(`   🎓 Training Fund: ${result.trainingFundTotal.toLocaleString('he-IL')} ILS`);
            if (result.readinessScore) console.log(`   📈 Readiness Score: ${result.readinessScore}%`);
        } else {
            console.log('⚠️  Calculation returned null');
        }
        
    } catch (e) {
        console.log('❌ calculateRetirement error:', e.message);
        console.log('   Stack:', e.stack);
    }
} else {
    console.log('❌ calculateRetirement not available');
}

console.log('\n🎉 Debug test completed!');