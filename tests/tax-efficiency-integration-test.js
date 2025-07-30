// Test Tax Efficiency Score integration with additional income
console.log('🧪 Testing Tax Efficiency Score Integration');

const fs = require('fs');
const path = require('path');

// Create window object and load dependencies
global.window = {};

// Load Financial Health Engine
const healthEnginePath = path.join(__dirname, '../src/utils/financialHealthEngine.js');
const healthEngineCode = fs.readFileSync(healthEnginePath, 'utf8');
eval(healthEngineCode);

// Load AdditionalIncomeTax utility
const additionalIncomeTaxPath = path.join(__dirname, '../src/utils/additionalIncomeTax.js');
const additionalIncomeTaxCode = fs.readFileSync(additionalIncomeTaxPath, 'utf8');
eval(additionalIncomeTaxCode);

// Test scenarios
const scenarios = [
    {
        name: 'User with minimal pension contributions',
        inputs: {
            country: 'israel',
            currentMonthlySalary: 25000,
            pensionContributionRate: 3,     // Low pension rate
            trainingFundContributionRate: 1, // Low training fund rate
            
            // Additional income
            rentalIncome: 7200,
            dividendIncome: 100,
            annualBonus: 150000
        },
        expected: {
            lowTaxEfficiency: true,
            hasAdditionalIncome: true
        }
    },
    {
        name: 'User with optimal pension contributions',
        inputs: {
            country: 'israel',
            currentMonthlySalary: 25000,
            pensionContributionRate: 7,      // Optimal pension rate
            trainingFundContributionRate: 10, // Optimal training fund rate
            
            // Additional income
            rentalIncome: 7200,
            dividendIncome: 100,
            annualBonus: 150000
        },
        expected: {
            highTaxEfficiency: true,
            hasAdditionalIncome: true
        }
    },
    {
        name: 'User with no additional income',
        inputs: {
            country: 'israel',
            currentMonthlySalary: 25000,
            pensionContributionRate: 7,
            trainingFundContributionRate: 10,
            
            // No additional income
            rentalIncome: 0,
            dividendIncome: 0,
            annualBonus: 0
        },
        expected: {
            highTaxEfficiency: true,
            hasAdditionalIncome: false
        }
    }
];

console.log('\n📊 Testing Tax Efficiency Calculation...');

scenarios.forEach((scenario, index) => {
    console.log(`\n📋 Test ${index + 1}: ${scenario.name}`);
    
    try {
        // Calculate Financial Health Score
        const healthReport = window.calculateFinancialHealthScore(scenario.inputs);
        const taxEfficiencyFactor = healthReport.factors.taxEfficiency;
        
        console.log(`  Tax Efficiency Score: ${taxEfficiencyFactor.score}/${window.SCORE_FACTORS.taxEfficiency.weight}`);
        console.log(`  Tax Efficiency %: ${taxEfficiencyFactor.details.efficiencyScore.toFixed(1)}%`);
        console.log(`  Status: ${taxEfficiencyFactor.details.status}`);
        
        // Calculate additional income tax separately
        const additionalTaxInfo = window.AdditionalIncomeTax.calculateTotalAdditionalIncomeTax(scenario.inputs);
        
        if (additionalTaxInfo.totalAdditionalIncome > 0) {
            console.log(`  Additional Income: ₪${additionalTaxInfo.totalAdditionalIncome.toLocaleString()}/year`);
            console.log(`  Additional Tax: ₪${additionalTaxInfo.totalAdditionalTax.toLocaleString()}/year`);
            console.log(`  Additional Income Tax Rate: ${additionalTaxInfo.effectiveRate}%`);
        } else {
            console.log(`  Additional Income: None`);
        }
        
        // Check contribution details
        console.log(`  Pension Rate: ${taxEfficiencyFactor.details.pensionRate}%`);
        console.log(`  Training Fund Rate: ${taxEfficiencyFactor.details.trainingFundRate}%`);
        console.log(`  Total Tax-Advantaged Rate: ${taxEfficiencyFactor.details.currentRate}%`);
        console.log(`  Country: ${taxEfficiencyFactor.details.country}`);
        
        // Analyze if additional income affects tax efficiency
        const totalAnnualIncome = (scenario.inputs.currentMonthlySalary * 12) + additionalTaxInfo.totalAdditionalIncome;
        const totalTaxAdvantaged = (scenario.inputs.currentMonthlySalary * 12) * 
            (scenario.inputs.pensionContributionRate + scenario.inputs.trainingFundContributionRate) / 100;
        const overallTaxAdvantageRate = totalAnnualIncome > 0 ? (totalTaxAdvantaged / totalAnnualIncome) * 100 : 0;
        
        console.log(`  Overall Tax Advantage Rate: ${overallTaxAdvantageRate.toFixed(1)}%`);
        
        // Assessment
        if (additionalTaxInfo.totalAdditionalIncome > 0) {
            if (overallTaxAdvantageRate < taxEfficiencyFactor.details.currentRate) {
                console.log(`  ⚠️ Additional income dilutes tax efficiency`);
                console.log(`  💡 Suggestion: Consider tax-advantaged investment vehicles for additional income`);
            } else {
                console.log(`  ✅ Tax efficiency maintained despite additional income`);
            }
        }
        
        // Validate expectations
        if (scenario.expected.lowTaxEfficiency && taxEfficiencyFactor.score < 4) {
            console.log(`  ✅ Expected low tax efficiency: CORRECT`);
        } else if (scenario.expected.highTaxEfficiency && taxEfficiencyFactor.score >= 6) {
            console.log(`  ✅ Expected high tax efficiency: CORRECT`);
        } else if (scenario.expected.lowTaxEfficiency) {
            console.log(`  ❌ Expected low tax efficiency but got ${taxEfficiencyFactor.score}/8`);
        } else if (scenario.expected.highTaxEfficiency) {
            console.log(`  ❌ Expected high tax efficiency but got ${taxEfficiencyFactor.score}/8`);
        }
        
    } catch (error) {
        console.log(`  ❌ Test failed: ${error.message}`);
    }
});

console.log('\n🔍 Analysis: Current Tax Efficiency Integration');
console.log('┌─ Tax Efficiency Score focuses on pension/training fund rates');
console.log('├─ Additional income tax is calculated separately');
console.log('├─ Overall tax optimization could be enhanced');
console.log('└─ Opportunity: Include additional income tax strategy in score');

console.log('\n📋 Integration Test Complete');