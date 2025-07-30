// Unit Tests for Core Calculation Engine
// Tests all calculation functions in isolation with comprehensive edge cases

const fs = require('fs');
const path = require('path');

console.log('🧮 Testing Core Calculation Engine...');

let testsPassed = 0;
let testsTotal = 0;

function runTest(testName, testFunction) {
    testsTotal++;
    try {
        const result = testFunction();
        if (result) {
            console.log(`✅ PASS ${testName}`);
            testsPassed++;
        } else {
            console.log(`❌ FAIL ${testName}`);
        }
    } catch (error) {
        console.log(`❌ FAIL ${testName}: ${error.message}`);
    }
}

// Load retirement calculations module
const retirementCalcsPath = path.join(__dirname, '..', '..', 'src/utils/retirementCalculations.js');
let retirementCalculations;

try {
    const content = fs.readFileSync(retirementCalcsPath, 'utf8');
    // Create a mock window object for the calculations
    const mockWindow = {
        calculateRetirement: null,
        formatCurrency: null,
        calculateRealValue: null,
        calculateInflationAdjustedAmount: null
    };
    
    // Execute the script in a mock environment
    eval(content.replace(/window\./g, 'mockWindow.'));
    retirementCalculations = mockWindow;
} catch (error) {
    console.log(`❌ Failed to load retirement calculations: ${error.message}`);
}

// Test Suite 1: formatCurrency Function
runTest('formatCurrency: Basic USD formatting', () => {
    if (!retirementCalculations.formatCurrency) return false;
    const result = retirementCalculations.formatCurrency(1234.56, 'USD');
    return result === '$1,234.56' || result === '1,234.56$' || result.includes('1,234.56');
});

runTest('formatCurrency: ILS formatting', () => {
    if (!retirementCalculations.formatCurrency) return false;
    const result = retirementCalculations.formatCurrency(5000, 'ILS');
    return result.includes('₪') && result.includes('5,000');
});

runTest('formatCurrency: Zero value handling', () => {
    if (!retirementCalculations.formatCurrency) return false;
    const result = retirementCalculations.formatCurrency(0, 'USD');
    return result === '$0' || result === '0$' || result.includes('0');
});

runTest('formatCurrency: Negative value handling', () => {
    if (!retirementCalculations.formatCurrency) return false;
    const result = retirementCalculations.formatCurrency(-1000, 'USD');
    return result.includes('-') && result.includes('1,000');
});

runTest('formatCurrency: Large number formatting', () => {
    if (!retirementCalculations.formatCurrency) return false;
    const result = retirementCalculations.formatCurrency(1000000, 'USD');
    return result.includes('1,000,000');
});

// Test Suite 2: calculateRealValue Function
runTest('calculateRealValue: Basic inflation adjustment', () => {
    if (!retirementCalculations.calculateRealValue) return false;
    // Real value of $1000 with 3% inflation over 10 years should be less than $1000
    const result = retirementCalculations.calculateRealValue(1000, 0.03, 10);
    return result > 0 && result < 1000;
});

runTest('calculateRealValue: Zero inflation', () => {
    if (!retirementCalculations.calculateRealValue) return false;
    const result = retirementCalculations.calculateRealValue(1000, 0, 10);
    return result === 1000;
});

runTest('calculateRealValue: Zero years', () => {
    if (!retirementCalculations.calculateRealValue) return false;
    const result = retirementCalculations.calculateRealValue(1000, 0.03, 0);
    return result === 1000;
});

runTest('calculateRealValue: High inflation scenario', () => {
    if (!retirementCalculations.calculateRealValue) return false;
    const result = retirementCalculations.calculateRealValue(1000, 0.10, 20);
    return result > 0 && result < 200; // Should be significantly reduced
});

// Test Suite 3: calculateInflationAdjustedAmount Function
runTest('calculateInflationAdjustedAmount: Basic future value', () => {
    if (!retirementCalculations.calculateInflationAdjustedAmount) return false;
    // $1000 with 3% inflation over 10 years should be more than $1000
    const result = retirementCalculations.calculateInflationAdjustedAmount(1000, 0.03, 10);
    return result > 1000;
});

runTest('calculateInflationAdjustedAmount: Zero inflation', () => {
    if (!retirementCalculations.calculateInflationAdjustedAmount) return false;
    const result = retirementCalculations.calculateInflationAdjustedAmount(1000, 0, 10);
    return result === 1000;
});

runTest('calculateInflationAdjustedAmount: Compound growth validation', () => {
    if (!retirementCalculations.calculateInflationAdjustedAmount) return false;
    // Test compound growth: 1000 * (1.03)^10 ≈ 1343.92
    const result = retirementCalculations.calculateInflationAdjustedAmount(1000, 0.03, 10);
    return Math.abs(result - 1343.92) < 1; // Allow small rounding differences
});

// Test Suite 4: calculateRetirement Main Function
runTest('calculateRetirement: Basic individual scenario', () => {
    if (!retirementCalculations.calculateRetirement) return false;
    
    const inputs = {
        planningType: 'individual',
        currentAge: 30,
        retirementAge: 65,
        currentMonthlySalary: 5000,
        currentSavings: 10000,
        monthlyContribution: 500,
        expectedReturn: 0.07,
        inflationRate: 0.03,
        country: 'usa'
    };
    
    const result = retirementCalculations.calculateRetirement(inputs);
    return result && 
           typeof result.monthlyIncome === 'number' &&
           typeof result.totalSavingsAtRetirement === 'number' &&
           result.monthlyIncome > 0 &&
           result.totalSavingsAtRetirement > 10000;
});

runTest('calculateRetirement: Couple planning scenario', () => {
    if (!retirementCalculations.calculateRetirement) return false;
    
    const inputs = {
        planningType: 'couple',
        currentAge: 30,
        retirementAge: 65,
        partner1Salary: 5000,
        partner2Salary: 4000,
        currentSavings: 20000,
        monthlyContribution: 800,
        expectedReturn: 0.07,
        inflationRate: 0.03,
        country: 'israel'
    };
    
    const result = retirementCalculations.calculateRetirement(inputs);
    return result && 
           typeof result.monthlyIncome === 'number' &&
           result.monthlyIncome > 0 &&
           result.totalSavingsAtRetirement > 20000;
});

runTest('calculateRetirement: Edge case - retirement age equals current age', () => {
    if (!retirementCalculations.calculateRetirement) return false;
    
    const inputs = {
        planningType: 'individual',
        currentAge: 65,
        retirementAge: 65,
        currentMonthlySalary: 5000,
        currentSavings: 100000,
        monthlyContribution: 0,
        expectedReturn: 0.07,
        inflationRate: 0.03,
        country: 'usa'
    };
    
    const result = retirementCalculations.calculateRetirement(inputs);
    return result && result.totalSavingsAtRetirement >= 100000;
});

runTest('calculateRetirement: Edge case - zero savings and contributions', () => {
    if (!retirementCalculations.calculateRetirement) return false;
    
    const inputs = {
        planningType: 'individual',
        currentAge: 30,
        retirementAge: 65,
        currentMonthlySalary: 5000,
        currentSavings: 0,
        monthlyContribution: 0,
        expectedReturn: 0.07,
        inflationRate: 0.03,
        country: 'usa'
    };
    
    const result = retirementCalculations.calculateRetirement(inputs);
    return result && result.totalSavingsAtRetirement === 0 && result.monthlyIncome === 0;
});

runTest('calculateRetirement: High return scenario validation', () => {
    if (!retirementCalculations.calculateRetirement) return false;
    
    const inputs = {
        planningType: 'individual',
        currentAge: 25,
        retirementAge: 65,
        currentMonthlySalary: 5000,
        currentSavings: 10000,
        monthlyContribution: 1000,
        expectedReturn: 0.12, // 12% return
        inflationRate: 0.03,
        country: 'usa'
    };
    
    const result = retirementCalculations.calculateRetirement(inputs);
    return result && result.totalSavingsAtRetirement > 1000000; // Should be substantial with high returns
});

// Test Suite 5: Input Validation and Error Handling
runTest('calculateRetirement: Handles missing required fields', () => {
    if (!retirementCalculations.calculateRetirement) return false;
    
    const inputs = {
        planningType: 'individual'
        // Missing required fields
    };
    
    try {
        const result = retirementCalculations.calculateRetirement(inputs);
        return result && (result.monthlyIncome === 0 || result.error);
    } catch (error) {
        return true; // Expected to throw error or handle gracefully
    }
});

runTest('calculateRetirement: Handles negative values gracefully', () => {
    if (!retirementCalculations.calculateRetirement) return false;
    
    const inputs = {
        planningType: 'individual',
        currentAge: 30,
        retirementAge: 65,
        currentMonthlySalary: -1000, // Negative salary
        currentSavings: -5000, // Negative savings
        monthlyContribution: 500,
        expectedReturn: 0.07,
        inflationRate: 0.03,
        country: 'usa'
    };
    
    try {
        const result = retirementCalculations.calculateRetirement(inputs);
        return result !== null; // Should handle gracefully, not crash
    } catch (error) {
        return false;
    }
});

// Test Suite 6: Mathematical Accuracy
runTest('Compound Interest Formula Accuracy', () => {
    if (!retirementCalculations.calculateInflationAdjustedAmount) return false;
    
    // Test known compound interest: $1000 at 5% for 20 years = $2653.30
    const result = retirementCalculations.calculateInflationAdjustedAmount(1000, 0.05, 20);
    const expected = 1000 * Math.pow(1.05, 20); // 2653.30
    
    return Math.abs(result - expected) < 1;
});

runTest('Present Value Formula Accuracy', () => {
    if (!retirementCalculations.calculateRealValue) return false;
    
    // Test known present value: $2653.30 at 5% for 20 years = $1000
    const futureValue = 2653.30;
    const result = retirementCalculations.calculateRealValue(futureValue, 0.05, 20);
    
    return Math.abs(result - 1000) < 1;
});

// Test Suite 7: Currency Handling
runTest('Currency Conversion Consistency', () => {
    if (!retirementCalculations.formatCurrency) return false;
    
    const usdResult = retirementCalculations.formatCurrency(1000, 'USD');
    const ilsResult = retirementCalculations.formatCurrency(1000, 'ILS');
    
    return usdResult.includes('$') && ilsResult.includes('₪');
});

// Summary
console.log(`\n📊 Core Calculation Engine Test Summary`);
console.log(`======================================`);
console.log(`✅ Tests Passed: ${testsPassed}`);
console.log(`❌ Tests Failed: ${testsTotal - testsPassed}`);
console.log(`📈 Success Rate: ${((testsPassed / testsTotal) * 100).toFixed(1)}%`);

if (testsPassed === testsTotal) {
    console.log(`\n🎉 All core calculation tests passed! Engine is mathematically sound.`);
} else {
    console.log(`\n⚠️ Some calculation tests failed. Review mathematical implementations.`);
}

// Export results for main test runner
module.exports = {
    testsPassed,
    testsTotal,
    testSuiteName: 'Core Calculation Engine Tests'
};