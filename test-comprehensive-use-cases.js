#!/usr/bin/env node

// Comprehensive Use Case Testing for Advanced Retirement Planner
// Testing script for specific scenarios and mathematical consistency validation

const fs = require('fs');
const path = require('path');

console.log('🧪 Advanced Retirement Planner - Comprehensive Use Case Testing');
console.log('================================================================\n');

// Load the application modules in Node.js environment
const mockWindow = {
    formatCurrency: null,
    convertCurrency: null,
    calculateRetirement: null,
    calculateWeightedReturn: null,
    getAdjustedReturn: null
};

// Mock browser globals for Node.js environment
global.window = mockWindow;
global.Intl = Intl;

// Load market constants first (has dependencies)
try {
    const marketConstantsPath = path.join(__dirname, 'src/data/marketConstants.js');
    const marketConstantsCode = fs.readFileSync(marketConstantsPath, 'utf8');
    
    // Execute the code in our mock environment
    eval(marketConstantsCode);
    
    console.log('✅ Successfully loaded market constants');
} catch (error) {
    console.error('❌ Failed to load market constants:', error.message);
    process.exit(1);
}

// Load retirement calculations (depends on market constants)
try {
    const retirementCalcPath = path.join(__dirname, 'src/utils/retirementCalculations.js');
    const retirementCalcCode = fs.readFileSync(retirementCalcPath, 'utf8');
    
    // Fix function references to use window. prefix for Node.js compatibility
    const fixedCode = retirementCalcCode
        .replace(/calculateWeightedReturn\(/g, 'window.calculateWeightedReturn(')
        .replace(/getAdjustedReturn\(/g, 'window.getAdjustedReturn(')
        .replace(/riskScenarios\[/g, 'window.riskScenarios[')
        .replace(/countryData\[/g, 'window.countryData[')
        .replace(/window\.window\./g, 'window.');
    
    // Execute the fixed code in our mock environment
    eval(fixedCode);
    
    console.log('✅ Successfully loaded retirement calculations module');
} catch (error) {
    console.error('❌ Failed to load retirement calculations:', error.message);
    process.exit(1);
}

// Test Case 1: Primary Test Case from User Requirements
console.log('\n📋 Test Case 1: Primary Scenario');
console.log('Age: 39, Retirement: 67, Monthly Expenses: 35000 ILS, Crypto: 0, Real Estate: 0');
console.log('='.repeat(80));

const primaryTestInputs = {
    currentAge: 39,
    retirementAge: 67,
    monthlyExpenses: 35000,
    country: 'israel',
    planningType: 'single',
    // Financial inputs
    currentSalary: 20000, // Monthly salary in ILS
    currentSavings: 100000, // Current pension savings
    currentRealEstate: 0,
    currentCrypto: 0,
    currentStocks: 50000,
    currentBonds: 25000,
    currentCash: 25000,
    currentTrainingFund: 50000,
    currentPersonalPortfolio: 100000,
    // Contribution rates
    pensionEmployeeRate: 7.0,
    pensionEmployerRate: 14.333,
    trainingFundRate: 10.0,
    // Return assumptions
    trainingFundReturn: 8.0,
    trainingFundManagementFee: 0.5,
    personalPortfolioReturn: 7.0,
    personalPortfolioMonthly: 1000,
    cryptoReturn: 15.0,
    cryptoMonthly: 0, // Set to 0 as per user requirements
    realEstateReturn: 6.0,
    realEstateMonthly: 0, // Set to 0 as per user requirements
    realEstateRentalYield: 4.0,
    riskTolerance: 'moderate'
};

// Mock work periods for calculations
const mockWorkPeriods = [
    {
        startAge: 25,
        endAge: 67,
        monthlySalary: 20000,
        country: 'israel',
        monthlyContribution: 20000 * 0.21333, // Total pension contribution
        monthlyTrainingFund: 20000 * 0.10,    // Training fund contribution
        pensionReturn: 8.0,
        pensionDepositFee: 0.1,
        pensionAnnualFee: 0.5
    }
];

// Mock index allocations
const mockPensionAllocation = [
    { index: 0, percentage: 60, customReturn: null }, // Stocks
    { index: 1, percentage: 30, customReturn: null }, // Bonds
    { index: 2, percentage: 10, customReturn: null }  // Cash
];

const mockTrainingFundAllocation = [
    { index: 0, percentage: 70, customReturn: null }, // Stocks
    { index: 1, percentage: 20, customReturn: null }, // Bonds
    { index: 2, percentage: 10, customReturn: null }  // Cash
];

// Mock historical returns (simplified)
const mockHistoricalReturns = {
    5: [8.5, 4.2, 1.5],  // 5-year returns: [stocks, bonds, cash]
    10: [9.2, 4.5, 1.8],
    15: [8.8, 4.3, 1.6],
    20: [9.0, 4.4, 1.7],
    25: [8.7, 4.2, 1.5],
    30: [8.9, 4.3, 1.6]
};

// Function to run calculation multiple times and check for consistency
function runConsistencyTest(inputs, iterations = 5) {
    console.log(`\n🔄 Running calculation ${iterations} times to test consistency...`);
    
    const results = [];
    
    for (let i = 0; i < iterations; i++) {
        try {
            const result = window.calculateRetirement(
                inputs,
                mockWorkPeriods,
                mockPensionAllocation,
                mockTrainingFundAllocation,
                mockHistoricalReturns,
                inputs.currentSalary * (inputs.trainingFundRate / 100),
                [] // No partner work periods for single mode
            );
            
            if (result) {
                results.push({
                    iteration: i + 1,
                    totalSavings: result.totalSavings,
                    monthlyIncome: result.monthlyIncome,
                    pensionTotal: result.pensionTotal,
                    trainingFundTotal: result.trainingFundTotal,
                    readinessScore: result.readinessScore
                });
            } else {
                console.log(`⚠️  Iteration ${i + 1}: Calculation returned null`);
            }
        } catch (error) {
            console.log(`❌ Iteration ${i + 1}: Error - ${error.message}`);
        }
    }
    
    return results;
}

// Function to validate mathematical consistency
function validateMathematicalConsistency(results) {
    if (results.length === 0) {
        console.log('❌ No results to validate');
        return false;
    }
    
    console.log('\n🧮 Mathematical Consistency Validation:');
    
    const firstResult = results[0];
    let isConsistent = true;
    
    // Check if all results are identical
    const tolerance = 0.01; // 1 cent tolerance for floating point precision
    
    for (let i = 1; i < results.length; i++) {
        const current = results[i];
        
        const totalSavingsDiff = Math.abs(current.totalSavings - firstResult.totalSavings);
        const monthlyIncomeDiff = Math.abs(current.monthlyIncome - firstResult.monthlyIncome);
        
        if (totalSavingsDiff > tolerance) {
            console.log(`⚠️  Total savings inconsistency: Iteration 1: ${firstResult.totalSavings}, Iteration ${i + 1}: ${current.totalSavings} (diff: ${totalSavingsDiff})`);
            isConsistent = false;
        }
        
        if (monthlyIncomeDiff > tolerance) {
            console.log(`⚠️  Monthly income inconsistency: Iteration 1: ${firstResult.monthlyIncome}, Iteration ${i + 1}: ${current.monthlyIncome} (diff: ${monthlyIncomeDiff})`);
            isConsistent = false;
        }
    }
    
    if (isConsistent) {
        console.log('✅ All calculations are mathematically consistent');
    }
    
    return isConsistent;
}

// Function to display detailed results
function displayDetailedResults(results) {
    if (results.length === 0) {
        console.log('❌ No results to display');
        return;
    }
    
    console.log('\n📊 Detailed Calculation Results:');
    console.log('-'.repeat(60));
    
    const result = results[0]; // Use first result as they should all be identical
    
    console.log(`🏦 Total Savings at Retirement: ${window.formatCurrency ? window.formatCurrency(result.totalSavings) : result.totalSavings?.toLocaleString('he-IL') || 'N/A'} ILS`);
    console.log(`💰 Monthly Retirement Income: ${window.formatCurrency ? window.formatCurrency(result.monthlyIncome) : result.monthlyIncome?.toLocaleString('he-IL') || 'N/A'} ILS`);
    console.log(`🏛️  Pension Fund Total: ${window.formatCurrency ? window.formatCurrency(result.pensionTotal) : result.pensionTotal?.toLocaleString('he-IL') || 'N/A'} ILS`);
    console.log(`🎓 Training Fund Total: ${window.formatCurrency ? window.formatCurrency(result.trainingFundTotal) : result.trainingFundTotal?.toLocaleString('he-IL') || 'N/A'} ILS`);
    console.log(`📈 Readiness Score: ${result.readinessScore || 'N/A'}%`);
    
    // Calculate some derived metrics
    if (result.totalSavings && result.monthlyIncome) {
        const yearsOfIncome = result.totalSavings / (result.monthlyIncome * 12);
        console.log(`⏳ Years of retirement income: ${yearsOfIncome.toFixed(1)} years`);
        
        const replacementRatio = (result.monthlyIncome / primaryTestInputs.monthlyExpenses) * 100;
        console.log(`🔄 Income replacement ratio: ${replacementRatio.toFixed(1)}%`);
    }
}

// Test for training fund calculations specifically
function testTrainingFundCalculations() {
    console.log('\n🎓 Training Fund Calculation Testing:');
    console.log('-'.repeat(50));
    
    // Test threshold calculations
    const israeliThreshold = 15792; // 2024 threshold in ILS
    const testSalaries = [10000, 15792, 20000, 30000];
    
    testSalaries.forEach(salary => {
        console.log(`\n💼 Testing salary: ${salary} ILS`);
        
        if (salary <= israeliThreshold) {
            const employeeRate = 2.5;
            const employerRate = 7.5;
            console.log(`  📉 Below threshold - Employee: ${employeeRate}%, Employer: ${employerRate}%`);
            console.log(`  💰 Employee contribution: ${(salary * employeeRate / 100).toFixed(2)} ILS`);
            console.log(`  🏢 Employer contribution: ${(salary * employerRate / 100).toFixed(2)} ILS`);
        } else {
            const employeeRate = 2.5;
            const employerRate = 7.5;
            console.log(`  📈 Above threshold - Employee: ${employeeRate}%, Employer: ${employerRate}%`);
            console.log(`  💰 Employee contribution: ${(salary * employeeRate / 100).toFixed(2)} ILS`);
            console.log(`  🏢 Employer contribution: ${(salary * employerRate / 100).toFixed(2)} ILS`);
        }
    });
}

// Test edge cases and boundary conditions
function testEdgeCases() {
    console.log('\n🚨 Edge Case Testing:');
    console.log('-'.repeat(40));
    
    const edgeCases = [
        {
            name: 'Very young person (age 22)',
            inputs: { ...primaryTestInputs, currentAge: 22, retirementAge: 67 }
        },
        {
            name: 'Close to retirement (age 65)',
            inputs: { ...primaryTestInputs, currentAge: 65, retirementAge: 67 }
        },
        {
            name: 'High salary scenario',
            inputs: { ...primaryTestInputs, currentSalary: 50000 }
        },
        {
            name: 'Low salary scenario',
            inputs: { ...primaryTestInputs, currentSalary: 8000 }
        },
        {
            name: 'Zero current savings',
            inputs: { ...primaryTestInputs, currentSavings: 0, currentStocks: 0, currentBonds: 0, currentCash: 0 }
        }
    ];
    
    edgeCases.forEach(testCase => {
        console.log(`\n🧪 Testing: ${testCase.name}`);
        try {
            const result = window.calculateRetirement(
                testCase.inputs,
                mockWorkPeriods,
                mockPensionAllocation,
                mockTrainingFundAllocation,
                mockHistoricalReturns,
                testCase.inputs.currentSalary * (testCase.inputs.trainingFundRate / 100),
                []
            );
            
            if (result) {
                console.log(`  ✅ Success - Total savings: ${result.totalSavings?.toLocaleString('he-IL') || 'N/A'} ILS`);
                console.log(`  📊 Monthly income: ${result.monthlyIncome?.toLocaleString('he-IL') || 'N/A'} ILS`);
            } else {
                console.log(`  ⚠️  Calculation returned null`);
            }
        } catch (error) {
            console.log(`  ❌ Error: ${error.message}`);
        }
    });
}

// Test currency conversion functionality
function testCurrencyConversion() {
    console.log('\n💱 Currency Conversion Testing:');
    console.log('-'.repeat(45));
    
    const mockExchangeRates = {
        USD: 3.7,
        EUR: 4.0,
        GBP: 4.6,
        ILS: 1.0
    };
    
    const testAmount = 100000; // 100K ILS
    
    Object.keys(mockExchangeRates).forEach(currency => {
        if (window.convertCurrency) {
            const converted = window.convertCurrency(testAmount, currency, mockExchangeRates);
            console.log(`💰 ${testAmount.toLocaleString()} ILS = ${converted} ${currency}`);
        }
    });
    
    // Test edge cases for currency conversion
    console.log('\n🚨 Currency conversion edge cases:');
    if (window.convertCurrency) {
        try {
            console.log('Null exchange rates:', window.convertCurrency(100000, 'USD', null));
        } catch (e) { console.log('Null exchange rates: Error -', e.message); }
        
        try {
            console.log('Zero exchange rate:', window.convertCurrency(100000, 'USD', {USD: 0}));
        } catch (e) { console.log('Zero exchange rate: Error -', e.message); }
        
        try {
            console.log('Invalid amount:', window.convertCurrency(null, 'USD', mockExchangeRates));
        } catch (e) { console.log('Invalid amount: Error -', e.message); }
        
        try {
            console.log('NaN amount:', window.convertCurrency(NaN, 'USD', mockExchangeRates));
        } catch (e) { console.log('NaN amount: Error -', e.message); }
    }
}

// Test couple vs single planning differences
function testCoupleVsSingle() {
    console.log('\n👫 Couple vs Single Planning Comparison:');
    console.log('-'.repeat(50));
    
    // Single planning
    const singleInputs = { ...primaryTestInputs, planningType: 'single' };
    
    // Couple planning
    const coupleInputs = {
        ...primaryTestInputs,
        planningType: 'couple',
        partnerAge: 37,
        partnerSalary: 18000,
        partnerSavings: 80000,
        partnerStocks: 40000,
        partnerBonds: 20000,
        partnerCash: 20000
    };
    
    const partnerWorkPeriods = [
        {
            startAge: 23,
            endAge: 67,
            monthlySalary: 18000,
            country: 'ISR'
        }
    ];
    
    console.log('\n👤 Single Planning Results:');
    try {
        const singleResult = window.calculateRetirement(
            singleInputs,
            mockWorkPeriods,
            mockPensionAllocation,
            mockTrainingFundAllocation,
            mockHistoricalReturns,
            singleInputs.currentSalary * (singleInputs.trainingFundRate / 100),
            []
        );
        
        if (singleResult) {
            console.log(`  💰 Total savings: ${singleResult.totalSavings?.toLocaleString('he-IL') || 'N/A'} ILS`);
            console.log(`  📊 Monthly income: ${singleResult.monthlyIncome?.toLocaleString('he-IL') || 'N/A'} ILS`);
        }
    } catch (error) {
        console.log(`  ❌ Error: ${error.message}`);
    }
    
    console.log('\n👫 Couple Planning Results:');
    try {
        const coupleResult = window.calculateRetirement(
            coupleInputs,
            mockWorkPeriods,
            mockPensionAllocation,
            mockTrainingFundAllocation,
            mockHistoricalReturns,
            coupleInputs.currentSalary * (coupleInputs.trainingFundRate / 100),
            partnerWorkPeriods
        );
        
        if (coupleResult) {
            console.log(`  💰 Total savings: ${coupleResult.totalSavings?.toLocaleString('he-IL') || 'N/A'} ILS`);
            console.log(`  📊 Monthly income: ${coupleResult.monthlyIncome?.toLocaleString('he-IL') || 'N/A'} ILS`);
        }
    } catch (error) {
        console.log(`  ❌ Error: ${error.message}`);
    }
}

// Main test execution
async function runComprehensiveTests() {
    console.log('🚀 Starting comprehensive use case testing...\n');
    
    // Test 1: Primary scenario with consistency checking
    const consistencyResults = runConsistencyTest(primaryTestInputs, 5);
    const isConsistent = validateMathematicalConsistency(consistencyResults);
    displayDetailedResults(consistencyResults);
    
    // Test 2: Training fund calculations
    testTrainingFundCalculations();
    
    // Test 3: Edge cases
    testEdgeCases();
    
    // Test 4: Currency conversion
    testCurrencyConversion();
    
    // Test 5: Couple vs single
    testCoupleVsSingle();
    
    // Summary
    console.log('\n📋 Test Summary:');
    console.log('='.repeat(50));
    console.log(`✅ Primary calculation consistency: ${isConsistent ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Retirement calculations module: LOADED`);
    console.log(`✅ Market constants module: LOADED`);
    console.log(`✅ Edge case testing: COMPLETED`);
    console.log(`✅ Currency conversion testing: COMPLETED`);
    console.log(`✅ Couple vs single comparison: COMPLETED`);
    
    console.log('\n🎉 Comprehensive testing completed!');
    
    if (consistencyResults.length > 0) {
        console.log('\n📊 Key Findings:');
        const result = consistencyResults[0];
        console.log(`• Total retirement savings: ${result.totalSavings?.toLocaleString('he-IL') || 'N/A'} ILS`);
        console.log(`• Monthly retirement income: ${result.monthlyIncome?.toLocaleString('he-IL') || 'N/A'} ILS`);
        console.log(`• Calculation consistency: ${isConsistent ? '100%' : 'INCONSISTENT'}`);
        
        if (result.monthlyIncome && primaryTestInputs.monthlyExpenses) {
            const replacementRatio = (result.monthlyIncome / primaryTestInputs.monthlyExpenses) * 100;
            console.log(`• Income replacement ratio: ${replacementRatio.toFixed(1)}%`);
            
            if (replacementRatio >= 70) {
                console.log('✅ Meets standard retirement income replacement target (70%+)');
            } else {
                console.log('⚠️  Below recommended retirement income replacement target (70%)');
            }
        }
    }
}

// Execute the tests
runComprehensiveTests().catch(error => {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
});