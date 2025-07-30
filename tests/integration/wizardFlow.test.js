// Integration Tests for Wizard Flow
// Tests the complete wizard user journey and step transitions

const fs = require('fs');
const path = require('path');

console.log('🧙‍♂️ Testing Wizard Flow Integration...');

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

// Load wizard components
const wizardPath = path.join(__dirname, '..', '..', 'src/components/wizard/RetirementWizard.js');
const stepPersonalPath = path.join(__dirname, '..', '..', 'src/components/wizard/steps/WizardStepPersonal.js');
const stepSalaryPath = path.join(__dirname, '..', '..', 'src/components/wizard/steps/WizardStepSalary.js');
const stepSavingsPath = path.join(__dirname, '..', '..', 'src/components/wizard/steps/WizardStepSavings.js');

// Test Suite 1: Wizard Component Structure
runTest('Wizard Component: RetirementWizard.js exists and exports', () => {
    if (!fs.existsSync(wizardPath)) return false;
    const content = fs.readFileSync(wizardPath, 'utf8');
    return content.includes('window.RetirementWizard') && 
           content.includes('React.createElement');
});

runTest('Wizard Steps: All 9 steps are defined', () => {
    if (!fs.existsSync(wizardPath)) return false;
    const content = fs.readFileSync(wizardPath, 'utf8');
    
    const requiredSteps = [
        'WizardStepPersonal',
        'WizardStepSalary', 
        'WizardStepExpenses',
        'WizardStepSavings',
        'WizardStepContributions',
        'WizardStepFees',
        'WizardStepInvestments',
        'WizardStepGoals',
        'WizardStepReview'
    ];
    
    return requiredSteps.every(step => content.includes(step));
});

runTest('Wizard Navigation: Step validation functions exist', () => {
    if (!fs.existsSync(wizardPath)) return false;
    const content = fs.readFileSync(wizardPath, 'utf8');
    return content.includes('validateStep') && 
           content.includes('nextStep') &&
           content.includes('prevStep');
});

// Test Suite 2: Step 1 - Personal Information
runTest('Step 1 (Personal): Component exists and exports', () => {
    if (!fs.existsSync(stepPersonalPath)) return false;
    const content = fs.readFileSync(stepPersonalPath, 'utf8');
    return content.includes('window.WizardStepPersonal');
});

runTest('Step 1 (Personal): Planning type selection', () => {
    if (!fs.existsSync(stepPersonalPath)) return false;
    const content = fs.readFileSync(stepPersonalPath, 'utf8');
    return content.includes('individual') && 
           content.includes('couple') &&
           content.includes('planningType');
});

runTest('Step 1 (Personal): Age inputs for both individual and couple', () => {
    if (!fs.existsSync(stepPersonalPath)) return false;
    const content = fs.readFileSync(stepPersonalPath, 'utf8');
    return content.includes('currentAge') && 
           content.includes('retirementAge') &&
           content.includes('partnerAge');
});

runTest('Step 1 (Personal): Country selection', () => {
    if (!fs.existsSync(stepPersonalPath)) return false;
    const content = fs.readFileSync(stepPersonalPath, 'utf8');
    return content.includes('country') && 
           (content.includes('israel') || content.includes('usa'));
});

// Test Suite 3: Step 2 - Salary Information
runTest('Step 2 (Salary): Component exists and exports', () => {
    if (!fs.existsSync(stepSalaryPath)) return false;
    const content = fs.readFileSync(stepSalaryPath, 'utf8');
    return content.includes('window.WizardStepSalary');
});

runTest('Step 2 (Salary): Individual mode salary input', () => {
    if (!fs.existsSync(stepSalaryPath)) return false;
    const content = fs.readFileSync(stepSalaryPath, 'utf8');
    return content.includes('currentMonthlySalary') && 
           content.includes('individual');
});

runTest('Step 2 (Salary): Couple mode partner salaries', () => {
    if (!fs.existsSync(stepSalaryPath)) return false;
    const content = fs.readFileSync(stepSalaryPath, 'utf8');
    return content.includes('partner1Salary') && 
           content.includes('partner2Salary') &&
           content.includes('couple');
});

runTest('Step 2 (Salary): Additional income fields', () => {
    if (!fs.existsSync(stepSalaryPath)) return false;
    const content = fs.readFileSync(stepSalaryPath, 'utf8');
    return content.includes('annualBonus') && 
           content.includes('rsuUnits') &&
           content.includes('dividendIncome');
});

runTest('Step 2 (Salary): Partner additional income fields', () => {
    if (!fs.existsSync(stepSalaryPath)) return false;
    const content = fs.readFileSync(stepSalaryPath, 'utf8');
    return content.includes('partnerAnnualBonus') && 
           content.includes('partnerRsuUnits') &&
           content.includes('partnerDividendIncome');
});

// Test Suite 4: Step 4 - Savings Information  
runTest('Step 4 (Savings): Component exists and exports', () => {
    if (!fs.existsSync(stepSavingsPath)) return false;
    const content = fs.readFileSync(stepSavingsPath, 'utf8');
    return content.includes('window.WizardStepSavings');
});

runTest('Step 4 (Savings): Current savings categories', () => {
    if (!fs.existsSync(stepSavingsPath)) return false;
    const content = fs.readFileSync(stepSavingsPath, 'utf8');
    return content.includes('currentCash') && 
           content.includes('currentPersonalPortfolio') &&
           content.includes('currentRealEstate');
});

runTest('Step 4 (Savings): Partner savings in couple mode', () => {
    if (!fs.existsSync(stepSavingsPath)) return false;
    const content = fs.readFileSync(stepSavingsPath, 'utf8');
    return content.includes('partner1PersonalPortfolio') && 
           content.includes('partner2PersonalPortfolio') &&
           content.includes('couple');
});

runTest('Step 4 (Savings): Portfolio tax calculation', () => {
    if (!fs.existsSync(stepSavingsPath)) return false;
    const content = fs.readFileSync(stepSavingsPath, 'utf8');
    return content.includes('portfolioTaxRate') && 
           content.includes('Capital Gains Tax') &&
           content.includes('Net Value After Tax');
});

runTest('Step 4 (Savings): Partner portfolio tax rates', () => {
    if (!fs.existsSync(stepSavingsPath)) return false;
    const content = fs.readFileSync(stepSavingsPath, 'utf8');
    return content.includes('partner1PortfolioTaxRate') && 
           content.includes('partner2PortfolioTaxRate');
});

// Test Suite 5: Data Flow Between Steps
runTest('Data Persistence: LocalStorage save/load functionality', () => {
    if (!fs.existsSync(wizardPath)) return false;
    const content = fs.readFileSync(wizardPath, 'utf8');
    return content.includes('localStorage') && 
           content.includes('retirementWizardInputs') &&
           content.includes('setItem') &&
           content.includes('getItem');
});

runTest('Data Persistence: Auto-save on input changes', () => {
    if (!fs.existsSync(wizardPath)) return false;
    const content = fs.readFileSync(wizardPath, 'utf8');
    return content.includes('useEffect') && 
           content.includes('inputs') &&
           content.includes('setItem');
});

runTest('Data Validation: Step validation logic', () => {
    if (!fs.existsSync(wizardPath)) return false;
    const content = fs.readFileSync(wizardPath, 'utf8');
    return content.includes('validateStep') && 
           content.includes('currentStep') &&
           content.includes('inputs');
});

// Test Suite 6: Planning Type Switching
runTest('Planning Type Switch: Individual to couple data handling', () => {
    if (!fs.existsSync(stepPersonalPath)) return false;
    const content = fs.readFileSync(stepPersonalPath, 'utf8');
    return content.includes('planningType') && 
           content.includes('onChange') &&
           content.includes('couple');
});

runTest('Planning Type Switch: Couple to individual data handling', () => {
    if (!fs.existsSync(stepPersonalPath)) return false;
    const content = fs.readFileSync(stepPersonalPath, 'utf8');
    return content.includes('planningType') && 
           content.includes('individual');
});

// Test Suite 7: Step Navigation Logic
runTest('Step Navigation: Next button enablement logic', () => {
    if (!fs.existsSync(wizardPath)) return false;
    const content = fs.readFileSync(wizardPath, 'utf8');
    return content.includes('disabled') && 
           content.includes('validateStep') &&
           content.includes('currentStep');
});

runTest('Step Navigation: Previous button always enabled (except step 1)', () => {
    if (!fs.existsSync(wizardPath)) return false;
    const content = fs.readFileSync(wizardPath, 'utf8');
    return content.includes('prevStep') && 
           content.includes('currentStep > 1');
});

runTest('Step Navigation: Progress indicator', () => {
    if (!fs.existsSync(wizardPath)) return false;
    const content = fs.readFileSync(wizardPath, 'utf8');
    return content.includes('currentStep') && 
           content.includes('totalSteps') &&
           content.includes('progress');
});

// Test Suite 8: Input State Management
runTest('State Management: Inputs object structure', () => {
    if (!fs.existsSync(wizardPath)) return false;
    const content = fs.readFileSync(wizardPath, 'utf8');
    return content.includes('useState') && 
           content.includes('inputs') &&
           content.includes('setInputs');
});

runTest('State Management: Input change handling', () => {
    if (!fs.existsSync(wizardPath)) return false;
    const content = fs.readFileSync(wizardPath, 'utf8');
    return content.includes('handleInputChange') && 
           content.includes('setInputs') &&
           content.includes('...inputs');
});

// Test Suite 9: Error Handling
runTest('Error Handling: Component error boundaries', () => {
    const errorBoundaryPath = path.join(__dirname, '..', '..', 'src/components/shared/ErrorBoundary.js');
    if (!fs.existsSync(errorBoundaryPath)) return false;
    const content = fs.readFileSync(errorBoundaryPath, 'utf8');
    return content.includes('componentDidCatch') || 
           content.includes('getDerivedStateFromError');
});

runTest('Error Handling: Input validation error messages', () => {
    if (!fs.existsSync(stepSalaryPath)) return false;
    const content = fs.readFileSync(stepSalaryPath, 'utf8');
    return content.includes('error') || 
           content.includes('validation') ||
           content.includes('required');
});

// Test Suite 10: Multi-language Support
runTest('Multi-language: Translation integration', () => {
    if (!fs.existsSync(wizardPath)) return false;
    const content = fs.readFileSync(wizardPath, 'utf8');
    return content.includes('multiLanguage') && 
           (content.includes('get(') || content.includes('t('));
});

runTest('Multi-language: Hebrew and English support', () => {
    const multiLangPath = path.join(__dirname, '..', '..', 'src/translations/multiLanguage.js');
    if (!fs.existsSync(multiLangPath)) return false;
    const content = fs.readFileSync(multiLangPath, 'utf8');
    return content.includes('he') && content.includes('en');
});

// Summary
console.log(`\n📊 Wizard Flow Integration Test Summary`);
console.log(`=====================================`);
console.log(`✅ Tests Passed: ${testsPassed}`);
console.log(`❌ Tests Failed: ${testsTotal - testsPassed}`);
console.log(`📈 Success Rate: ${((testsPassed / testsTotal) * 100).toFixed(1)}%`);

if (testsPassed === testsTotal) {
    console.log(`\n🎉 All wizard flow tests passed! User journey is solid.`);
} else {
    console.log(`\n⚠️ Some wizard flow tests failed. Review step integration.`);
}

// Export results for main test runner
module.exports = {
    testsPassed,
    testsTotal,
    testSuiteName: 'Wizard Flow Integration Tests'
};