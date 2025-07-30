// Debug script for getFieldValue function
const fs = require('fs');
const path = require('path');

// Load the financial health engine
const enginePath = path.join(__dirname, 'src/utils/financialHealthEngine.js');
const engineContent = fs.readFileSync(enginePath, 'utf8');

// Extract getFieldValue function
const getFieldValueMatch = engineContent.match(/function getFieldValue\([\s\S]*?\n\}\n/);
if (!getFieldValueMatch) {
    console.error('Could not find getFieldValue function');
    process.exit(1);
}

// Create a mock logger
const logger = {
    fieldSearch: (msg) => console.log('🔍 SEARCH:', msg),
    fieldFound: (msg) => console.log('✅ FOUND:', msg),
    debug: (msg) => console.log('🐛 DEBUG:', msg)
};

// Mock window object
global.window = { logger };

// Create the function
eval(getFieldValueMatch[0]);

// Test cases
const testInput = {
    planningType: "individual",
    currentAge: 40,
    retirementAge: 67,
    currentMonthlySalary: 10000,
    currency: "ILS"
};

console.log('\n=== Testing Field Mappings ===\n');

// Test 1: Finding existing field
console.log('Test 1: Finding currentMonthlySalary');
const salary = getFieldValue(testInput, ['currentMonthlySalary', 'monthlySalary'], { debugMode: true });
console.log('Result:', salary);

// Test 2: Finding non-existent field with defaults
console.log('\nTest 2: Finding pensionEmployeeRate (not in input)');
const pensionRate = getFieldValue(testInput, [
    'pensionContributionRate', 'pensionEmployeeRate', 'pensionEmployee',
    'employeePensionRate', 'pension_contribution_rate', 'pension_rate'
], { debugMode: true });
console.log('Result:', pensionRate);

// Test 3: Finding with allowZero option
console.log('\nTest 3: Finding currentBankAccount with allowZero');
const bankAccount = getFieldValue(testInput, [
    'currentBankAccount', 'currentSavingsAccount', 'savingsAccount'
], { allowZero: true, debugMode: true });
console.log('Result:', bankAccount);

// Test 4: Add a field and test again
console.log('\nTest 4: Adding pensionEmployeeRate and testing');
testInput.pensionEmployeeRate = 6.5;
const pensionRate2 = getFieldValue(testInput, [
    'pensionContributionRate', 'pensionEmployeeRate', 'pensionEmployee'
], { debugMode: true });
console.log('Result:', pensionRate2);

// Test 5: Test with zero value
console.log('\nTest 5: Testing with zero value');
testInput.currentBankAccount = 0;
const bankAccount2 = getFieldValue(testInput, [
    'currentBankAccount', 'currentSavingsAccount'
], { allowZero: true, debugMode: true });
console.log('Result with allowZero=true:', bankAccount2);

const bankAccount3 = getFieldValue(testInput, [
    'currentBankAccount', 'currentSavingsAccount'
], { allowZero: false, debugMode: true });
console.log('Result with allowZero=false:', bankAccount3);

// Test 6: Test couple mode
console.log('\nTest 6: Testing couple mode');
const coupleInput = {
    planningType: "couple",
    partner1Salary: 8000,
    partner2Salary: 7000
};
const coupleSalary = getFieldValue(coupleInput, [
    'partner1Salary', 'partner2Salary', 'currentMonthlySalary'
], { combinePartners: true, debugMode: true });
console.log('Result:', coupleSalary);