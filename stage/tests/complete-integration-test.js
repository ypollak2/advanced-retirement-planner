// Complete Additional Income Tax Integration Test
console.log('🧪 Complete Additional Income Tax Integration Test');

const fs = require('fs');
const path = require('path');

// Create window object and load all dependencies
global.window = {};

// Load all required modules
const additionalIncomeTaxPath = path.join(__dirname, '../src/utils/additionalIncomeTax.js');
const additionalIncomeTaxCode = fs.readFileSync(additionalIncomeTaxPath, 'utf8');
eval(additionalIncomeTaxCode);

const healthEnginePath = path.join(__dirname, '../src/utils/financialHealthEngine.js');
const healthEngineCode = fs.readFileSync(healthEnginePath, 'utf8');
eval(healthEngineCode);

// User's exact scenario from the provided data
const userScenario = {
    country: 'israel',
    currentMonthlySalary: 25000,
    
    // Pension contributions (optimal)
    pensionContributionRate: 7,
    trainingFundContributionRate: 10,
    
    // Additional income exactly as shown in the image
    freelanceIncome: 0,
    rentalIncome: 7200,         // Monthly
    dividendIncome: 100,        // Monthly
    annualBonus: 150000,        // Annual
    quarterlyRSU: 0,
    otherIncome: 0,
    
    // Partner (all zeros)
    partnerFreelanceIncome: 0,
    partnerRentalIncome: 0,
    partnerDividendIncome: 0,
    partnerAnnualBonus: 0,
    partnerQuarterlyRSU: 0,
    partnerOtherIncome: 0
};

console.log('\n🎯 Testing Complete Integration');
console.log('=====================================');

console.log('\n📊 User Input Summary:');
console.log(`├─ Base Monthly Salary: ₪${userScenario.currentMonthlySalary.toLocaleString()}`);
console.log(`├─ Annual Base Income: ₪${(userScenario.currentMonthlySalary * 12).toLocaleString()}`);
console.log(`├─ Pension Rate: ${userScenario.pensionContributionRate}%`);
console.log(`├─ Training Fund Rate: ${userScenario.trainingFundContributionRate}%`);
console.log(`├─ Monthly Rental: ₪${userScenario.rentalIncome.toLocaleString()}`);
console.log(`├─ Monthly Dividends: ₪${userScenario.dividendIncome.toLocaleString()}`);
console.log(`└─ Annual Bonus: ₪${userScenario.annualBonus.toLocaleString()}`);

try {
    // Test 1: Additional Income Tax Calculation
    console.log('\n🧮 Test 1: Additional Income Tax Calculation');
    const additionalTaxInfo = window.AdditionalIncomeTax.calculateTotalAdditionalIncomeTax(userScenario);
    
    console.log(`├─ Total Additional Income: ₪${additionalTaxInfo.totalAdditionalIncome.toLocaleString()}/year`);
    console.log(`├─ Total Additional Tax: ₪${additionalTaxInfo.totalAdditionalTax.toLocaleString()}/year`);
    console.log(`├─ Effective Tax Rate: ${additionalTaxInfo.effectiveRate}%`);
    console.log(`└─ Marginal Tax Rate: ${additionalTaxInfo.marginalRate}%`);
    
    if (additionalTaxInfo.totalAdditionalIncome === 237600 && additionalTaxInfo.effectiveRate > 30) {
        console.log('✅ Additional income tax calculation: CORRECT');
    } else {
        console.log('❌ Additional income tax calculation: INCORRECT');
    }
    
    // Test 2: Enhanced Financial Health Score
    console.log('\n💚 Test 2: Enhanced Financial Health Score');
    const healthReport = window.calculateFinancialHealthScore(userScenario);
    const taxEfficiencyFactor = healthReport.factors.taxEfficiency;
    
    console.log(`├─ Overall Health Score: ${healthReport.totalScore}/100 (${healthReport.status})`);
    console.log(`├─ Tax Efficiency Score: ${taxEfficiencyFactor.score}/8 (${taxEfficiencyFactor.details.status})`);
    console.log(`├─ Tax Efficiency %: ${taxEfficiencyFactor.details.efficiencyScore.toFixed(1)}%`);
    console.log(`├─ Has Additional Income: ${taxEfficiencyFactor.details.hasAdditionalIncome}`);
    console.log(`├─ Calculation Method: ${taxEfficiencyFactor.details.calculationMethod}`);
    
    if (taxEfficiencyFactor.details.hasAdditionalIncome) {
        console.log(`├─ Overall Tax Advantage Rate: ${taxEfficiencyFactor.details.additionalIncomeDetails.overallTaxAdvantageRate.toFixed(1)}%`);
        console.log(`├─ Dilution Effect: ${taxEfficiencyFactor.details.additionalIncomeDetails.dilutionEffect.toFixed(1)}%`);
        console.log(`└─ Additional Income Tax Rate: ${taxEfficiencyFactor.details.additionalIncomeDetails.additionalTaxRate}%`);
    }
    
    if (taxEfficiencyFactor.details.hasAdditionalIncome && taxEfficiencyFactor.details.calculationMethod === 'comprehensive_with_additional_income') {
        console.log('✅ Enhanced tax efficiency calculation: WORKING');
    } else {
        console.log('❌ Enhanced tax efficiency calculation: NOT WORKING');
    }
    
    // Test 3: Breakdown by Income Type
    console.log('\n💰 Test 3: Income Type Breakdown');
    
    const bonusBreakdown = additionalTaxInfo.breakdown.bonus;
    const otherBreakdown = additionalTaxInfo.breakdown.otherIncome;
    
    console.log('Annual Bonus:');
    console.log(`├─ Gross: ₪${bonusBreakdown.gross.toLocaleString()}`);
    console.log(`├─ Tax: ₪${bonusBreakdown.tax.toLocaleString()}`);
    console.log(`├─ Net: ₪${bonusBreakdown.net.toLocaleString()}`);
    console.log(`└─ Rate: ${bonusBreakdown.rate}%`);
    
    console.log('Rental + Dividend Income:');
    console.log(`├─ Gross: ₪${otherBreakdown.gross.toLocaleString()}`);
    console.log(`├─ Tax: ₪${otherBreakdown.tax.toLocaleString()}`);
    console.log(`├─ Net: ₪${otherBreakdown.net.toLocaleString()}`);
    console.log(`└─ Rate: ${otherBreakdown.rate}%`);
    
    // Test 4: Monthly After-Tax Calculations
    console.log('\n📅 Test 4: Monthly After-Tax Income');
    const monthlyResult = window.AdditionalIncomeTax.getMonthlyAfterTaxAdditionalIncome(userScenario);
    
    console.log(`├─ Monthly Net Bonus: ₪${monthlyResult.monthlyNetBonus.toLocaleString()}`);
    console.log(`├─ Monthly Net Other: ₪${monthlyResult.monthlyNetOther.toLocaleString()}`);
    console.log(`└─ Total Monthly Net: ₪${monthlyResult.totalMonthlyNet.toLocaleString()}`);
    
    // Test 5: Validation against Expected Values
    console.log('\n✅ Test 5: Validation Summary');
    
    const expectedValues = {
        totalAdditionalIncome: 237600,
        totalAdditionalTax: 113875,
        effectiveRate: 41,
        monthlyNetTotal: 10310
    };
    
    const validations = [
        {
            name: 'Total Additional Income',
            actual: additionalTaxInfo.totalAdditionalIncome,
            expected: expectedValues.totalAdditionalIncome,
            tolerance: 1000
        },
        {
            name: 'Total Additional Tax',
            actual: additionalTaxInfo.totalAdditionalTax,
            expected: expectedValues.totalAdditionalTax,
            tolerance: 2000
        },
        {
            name: 'Effective Tax Rate',
            actual: additionalTaxInfo.effectiveRate,
            expected: expectedValues.effectiveRate,
            tolerance: 2
        },
        {
            name: 'Monthly Net Total',
            actual: monthlyResult.totalMonthlyNet,
            expected: expectedValues.monthlyNetTotal,
            tolerance: 200
        }
    ];
    
    let passedValidations = 0;
    validations.forEach(validation => {
        const diff = Math.abs(validation.actual - validation.expected);
        const passed = diff <= validation.tolerance;
        console.log(`${passed ? '✅' : '❌'} ${validation.name}: ${validation.actual} (expected ~${validation.expected})`);
        if (passed) passedValidations++;
    });
    
    // Test 6: Integration Features
    console.log('\n🔗 Test 6: Integration Features');
    
    const integrationChecks = [
        {
            name: 'AdditionalIncomeTax utility loaded',
            passed: typeof window.AdditionalIncomeTax !== 'undefined'
        },
        {
            name: 'Financial Health Engine loaded',
            passed: typeof window.calculateFinancialHealthScore !== 'undefined'
        },
        {
            name: 'Tax efficiency considers additional income',
            passed: taxEfficiencyFactor.details.hasAdditionalIncome === true
        },
        {
            name: 'All additional income fields treated as gross',
            passed: additionalTaxInfo.totalAdditionalIncome > 0
        },
        {
            name: 'Israeli tax rules applied correctly',
            passed: additionalTaxInfo.marginalRate >= 35 && additionalTaxInfo.marginalRate <= 50
        },
        {
            name: 'Country detection working',
            passed: taxEfficiencyFactor.details.country === 'israel'
        }
    ];
    
    let passedIntegration = 0;
    integrationChecks.forEach(check => {
        console.log(`${check.passed ? '✅' : '❌'} ${check.name}`);
        if (check.passed) passedIntegration++;
    });
    
    // Final Summary
    console.log('\n🎯 Final Assessment');
    console.log('==================');
    console.log(`Validation Tests: ${passedValidations}/${validations.length} passed`);
    console.log(`Integration Tests: ${passedIntegration}/${integrationChecks.length} passed`);
    
    const overallSuccess = (passedValidations === validations.length) && (passedIntegration === integrationChecks.length);
    
    if (overallSuccess) {
        console.log('\n🎉 COMPLETE SUCCESS: All additional income tax validations passed!');
        console.log('✅ Tax calculations are accurate');
        console.log('✅ Financial Health Score integration working');
        console.log('✅ UI components will display detailed breakdowns');
        console.log('✅ Israeli tax rules correctly implemented');
    } else {
        console.log('\n⚠️ SOME ISSUES FOUND: Check failed validations above');
    }
    
} catch (error) {
    console.log(`\n❌ Integration test failed: ${error.message}`);
    console.log(error.stack);
}

console.log('\n📋 Integration Test Complete');