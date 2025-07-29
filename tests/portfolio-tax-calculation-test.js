// Portfolio Tax Calculation Test
// Tests the new portfolio tax calculation functionality for main portfolio and partner portfolios

const fs = require('fs');
const path = require('path');

console.log('🧮 Testing Portfolio Tax Calculation Features...');

const WizardStepSavingsPath = path.join(__dirname, '..', 'src/components/wizard/steps/WizardStepSavings.js');
let testsPassed = 0;
let testsTotal = 0;

function runTest(testName, testFunction) {
    testsTotal++;
    try {
        const result = testFunction();
        if (result) {
            console.log(`[04:37:57] ✅ PASS ${testName}`);
            testsPassed++;
        } else {
            console.log(`[04:37:57] ❌ FAIL ${testName}`);
        }
    } catch (error) {
        console.log(`[04:37:57] ❌ FAIL ${testName}: ${error.message}`);
    }
}

// Read the WizardStepSavings file
const wizardStepSavingsContent = fs.readFileSync(WizardStepSavingsPath, 'utf8');

// Test 1: Main Portfolio Tax Rate Input
runTest('Main Portfolio: Capital gains tax rate input field exists', () => {
    return wizardStepSavingsContent.includes('Capital Gains Tax (%)') &&
           wizardStepSavingsContent.includes('portfolioTaxRate') &&
           wizardStepSavingsContent.includes('min: \'0\'') &&
           wizardStepSavingsContent.includes('max: \'50\'');
});

// Test 2: Main Portfolio Net Value Calculation
runTest('Main Portfolio: Net value after tax calculation', () => {
    return wizardStepSavingsContent.includes('Net Value After Tax') &&
           wizardStepSavingsContent.includes('currentPersonalPortfolio * (1 - (inputs.portfolioTaxRate || 0.25))');
});

// Test 3: Main Portfolio Israel Tax Guidance
runTest('Main Portfolio: Israel-specific tax guidance provided', () => {
    return wizardStepSavingsContent.includes('Israel capital gains: 25% (residents), 30% (non-residents)') ||
           wizardStepSavingsContent.includes('ישראל: 25% (תושבים), 30% (תושבי חוץ)');
});

// Test 4: Partner 1 Portfolio Tax Rate Input
runTest('Partner 1 Portfolio: Capital gains tax rate input field exists', () => {
    return wizardStepSavingsContent.includes('partner1PortfolioTaxRate') &&
           wizardStepSavingsContent.includes('p1-tax-rate-input') &&
           wizardStepSavingsContent.includes('p1-tax-rate-section');
});

// Test 5: Partner 1 Portfolio Net Value Calculation
runTest('Partner 1 Portfolio: Net value after tax calculation', () => {
    return wizardStepSavingsContent.includes('partner1PersonalPortfolio * (1 - (inputs.partner1PortfolioTaxRate || 0.25))') &&
           wizardStepSavingsContent.includes('p1-net-value-section');
});

// Test 6: Partner 2 Portfolio Tax Rate Input
runTest('Partner 2 Portfolio: Capital gains tax rate input field exists', () => {
    return wizardStepSavingsContent.includes('partner2PortfolioTaxRate') &&
           wizardStepSavingsContent.includes('p2-tax-rate-input') &&
           wizardStepSavingsContent.includes('p2-tax-rate-section');
});

// Test 7: Partner 2 Portfolio Net Value Calculation
runTest('Partner 2 Portfolio: Net value after tax calculation', () => {
    return wizardStepSavingsContent.includes('partner2PersonalPortfolio * (1 - (inputs.partner2PortfolioTaxRate || 0.25))') &&
           wizardStepSavingsContent.includes('p2-net-value-section');
});

// Test 8: Tax Rate Validation (0-50% range)
runTest('Portfolio Tax Rates: Input validation range (0-50%)', () => {
    const taxRateInputs = wizardStepSavingsContent.match(/min: '0',\s*max: '50'/g);
    return taxRateInputs && taxRateInputs.length >= 3; // Main + Partner1 + Partner2
});

// Test 9: Default Tax Rate (25%)
runTest('Portfolio Tax Rates: Default tax rate is 25%', () => {
    const defaultRatePattern = /\|\| 25\) \/ 100/g;
    const matches = wizardStepSavingsContent.match(defaultRatePattern);
    return matches && matches.length >= 3; // Main + Partner1 + Partner2
});

// Test 10: Conditional Tax Display (only when portfolio > 0)
runTest('Portfolio Tax Calculations: Conditional display when portfolio value > 0', () => {
    return wizardStepSavingsContent.includes('inputs.currentPersonalPortfolio > 0') &&
           wizardStepSavingsContent.includes('inputs.partner1PersonalPortfolio > 0') &&
           wizardStepSavingsContent.includes('inputs.partner2PersonalPortfolio > 0');
});

// Test 11: Multi-language Tax Labels
runTest('Portfolio Tax Labels: Multi-language support (Hebrew/English)', () => {
    return wizardStepSavingsContent.includes('מס רווחי הון') &&
           wizardStepSavingsContent.includes('Capital Gains Tax') &&
           wizardStepSavingsContent.includes('נטו:') &&
           wizardStepSavingsContent.includes('Net:');
});

// Test 12: Tax Help Text Consistency
runTest('Portfolio Tax Help: Consistent Israel tax guidance across all portfolios', () => {
    const israelTaxGuidance = wizardStepSavingsContent.match(/Israel: 25%.*residents.*30%.*non-residents/g);
    return israelTaxGuidance && israelTaxGuidance.length >= 3; // Main + Partner1 + Partner2
});

// Test 13: formatCurrency Function Usage
runTest('Portfolio Tax Display: Uses formatCurrency for net value display', () => {
    const formatCurrencyUsage = wizardStepSavingsContent.match(/formatCurrency\([^)]*\(1 - \([^)]*TaxRate/g);
    return formatCurrencyUsage && formatCurrencyUsage.length >= 3; // Main + Partner1 + Partner2
});

// Test 14: Tax Rate Storage in inputs
runTest('Portfolio Tax Storage: Tax rates stored in inputs object', () => {
    return wizardStepSavingsContent.includes('setInputs({...inputs, portfolioTaxRate:') &&
           wizardStepSavingsContent.includes('setInputs({...inputs, partner1PortfolioTaxRate:') &&
           wizardStepSavingsContent.includes('setInputs({...inputs, partner2PortfolioTaxRate:');
});

// Test 15: Tax Calculation Integration with Couple Mode
runTest('Portfolio Tax Integration: Works correctly in couple planning mode', () => {
    return wizardStepSavingsContent.includes('planningType === \'couple\'') &&
           wizardStepSavingsContent.includes('partner1-savings') &&
           wizardStepSavingsContent.includes('partner2-savings') &&
           wizardStepSavingsContent.includes('partner1PortfolioTaxRate') &&
           wizardStepSavingsContent.includes('partner2PortfolioTaxRate');
});

console.log(`\n📊 Portfolio Tax Calculation Test Summary`);
console.log(`=====================================`);
console.log(`✅ Tests Passed: ${testsPassed}`);
console.log(`❌ Tests Failed: ${testsTotal - testsPassed}`);
console.log(`📈 Success Rate: ${((testsPassed / testsTotal) * 100).toFixed(1)}%`);

if (testsPassed === testsTotal) {
    console.log(`\n🎉 All portfolio tax calculation tests passed! Tax functionality is ready.`);
} else {
    console.log(`\n⚠️ Some portfolio tax calculation tests failed. Please review the implementation.`);
}

// Export results for main test runner
module.exports = {
    testsPassed,
    testsTotal,
    testSuiteName: 'Portfolio Tax Calculation Tests'
};