// Test additional income tax calculations
console.log('🧪 Testing Additional Income Tax Calculations');

// Load required modules
const fs = require('fs');
const path = require('path');

// Create a window object for browser compatibility
global.window = {};

// Load the additional income tax utility
const additionalIncomeTaxPath = path.join(__dirname, '../src/utils/additionalIncomeTax.js');
const additionalIncomeTaxCode = fs.readFileSync(additionalIncomeTaxPath, 'utf8');
eval(additionalIncomeTaxCode);

// Test cases
const testCases = [
    {
        name: 'Israeli High Earner with Bonus and RSUs',
        inputs: {
            country: 'israel',
            currentMonthlySalary: 50000,  // High salary
            annualBonus: 200000,          // 200k annual bonus
            quarterlyRSU: 100000,         // 100k quarterly RSUs (400k annual)
            freelanceIncome: 5000,        // 5k monthly freelance
            rentalIncome: 0,
            dividendIncome: 0
        },
        expected: {
            totalAdditionalIncome: 660000,  // 200k + 400k + 60k
            marginalRate: 50,                // Top tax bracket in Israel
            hasHighTax: true
        }
    },
    {
        name: 'UK Medium Earner with Bonus',
        inputs: {
            country: 'UK',
            currentMonthlySalary: 5000,   // ~60k annual
            annualBonus: 15000,           // 15k bonus
            quarterlyRSU: 0,
            freelanceIncome: 0,
            rentalIncome: 1000,           // 1k monthly rental
            dividendIncome: 0
        },
        expected: {
            totalAdditionalIncome: 27000,  // 15k + 12k
            marginalRate: 40,               // Higher rate bracket
            hasHighTax: false
        }
    },
    {
        name: 'US Tech Worker with RSUs',
        inputs: {
            country: 'US',
            currentMonthlySalary: 15000,  // 180k annual
            annualBonus: 30000,
            quarterlyRSU: 50000,          // 200k annual RSUs
            freelanceIncome: 0,
            rentalIncome: 0,
            dividendIncome: 2000          // 2k monthly dividends
        },
        expected: {
            totalAdditionalIncome: 254000,  // 30k + 200k + 24k
            marginalRate: 32,                // US federal tax bracket
            hasHighTax: true
        }
    }
];

// Run tests
let passed = 0;
let failed = 0;

testCases.forEach(testCase => {
    console.log(`\n📋 Testing: ${testCase.name}`);
    
    try {
        const result = window.AdditionalIncomeTax.calculateTotalAdditionalIncomeTax(testCase.inputs);
        
        // Validate results
        console.log(`  Total Additional Income: ${result.totalAdditionalIncome} (expected: ${testCase.expected.totalAdditionalIncome})`);
        console.log(`  Total Tax: ${result.totalAdditionalTax}`);
        console.log(`  Effective Rate: ${result.effectiveRate}%`);
        console.log(`  Marginal Rate: ${result.marginalRate}% (expected: ${testCase.expected.marginalRate}%)`);
        
        // Check total additional income
        if (result.totalAdditionalIncome === testCase.expected.totalAdditionalIncome) {
            console.log('  ✅ Total additional income correct');
        } else {
            console.log('  ❌ Total additional income mismatch');
            failed++;
            return;
        }
        
        // Check marginal rate
        if (result.marginalRate === testCase.expected.marginalRate) {
            console.log('  ✅ Marginal tax rate correct');
        } else {
            console.log('  ❌ Marginal tax rate mismatch');
            failed++;
            return;
        }
        
        // Check that tax is being calculated
        if (result.totalAdditionalTax > 0 && testCase.expected.hasHighTax) {
            console.log('  ✅ Tax calculation working');
        } else if (result.totalAdditionalTax > 0) {
            console.log('  ✅ Tax calculation working');
        } else {
            console.log('  ❌ No tax calculated');
            failed++;
            return;
        }
        
        // Detailed breakdown
        console.log('\n  Breakdown:');
        if (result.breakdown.bonus.gross > 0) {
            console.log(`    Bonus: ${result.breakdown.bonus.gross} → ${result.breakdown.bonus.net} (${result.breakdown.bonus.rate}% tax)`);
        }
        if (result.breakdown.rsu.gross > 0) {
            console.log(`    RSU: ${result.breakdown.rsu.gross} → ${result.breakdown.rsu.net} (${result.breakdown.rsu.rate}% tax)`);
        }
        if (result.breakdown.otherIncome.gross > 0) {
            console.log(`    Other: ${result.breakdown.otherIncome.gross} → ${result.breakdown.otherIncome.net} (${result.breakdown.otherIncome.rate}% tax)`);
        }
        
        passed++;
    } catch (error) {
        console.log(`  ❌ Test failed with error: ${error.message}`);
        failed++;
    }
});

// Test monthly after-tax calculations
console.log('\n\n📊 Testing Monthly After-Tax Calculations');

const monthlyTestCase = {
    country: 'israel',
    currentMonthlySalary: 30000,
    annualBonus: 120000,  // 10k monthly average
    quarterlyRSU: 60000,  // 20k monthly average
    freelanceIncome: 5000,
    rentalIncome: 3000,
    dividendIncome: 2000
};

const monthlyResult = window.AdditionalIncomeTax.getMonthlyAfterTaxAdditionalIncome(monthlyTestCase);
console.log('Monthly After-Tax Income:');
console.log(`  Net Bonus: ${monthlyResult.monthlyNetBonus}/month`);
console.log(`  Net RSU: ${monthlyResult.monthlyNetRSU}/month`);
console.log(`  Net Other: ${monthlyResult.monthlyNetOther}/month`);
console.log(`  Total Monthly Net: ${monthlyResult.totalMonthlyNet}/month`);

// Summary
console.log('\n\n📈 Test Summary:');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`Total: ${passed + failed}`);

if (failed === 0) {
    console.log('\n🎉 All additional income tax tests passed!');
    process.exit(0);
} else {
    console.log('\n⚠️ Some tests failed!');
    process.exit(1);
}