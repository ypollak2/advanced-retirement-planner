// Test Financial Health Score calculation for AUDIT-001 scenario
const fs = require('fs');
const path = require('path');

// Load the financial health engine
const enginePath = path.join(__dirname, 'src/utils/financialHealthEngine.js');
const engineCode = fs.readFileSync(enginePath, 'utf8');

// Create a mock window object
global.window = {
    location: { hostname: 'localhost' }
};
global.console = console;

// Execute the engine code
eval(engineCode);

// Test data from AUDIT-001
const testData = {
    planningType: "individual",
    currentAge: 28,
    retirementAge: 67,
    country: "israel",
    currentMonthlySalary: 15000,
    currency: "ILS",
    pensionEmployeeRate: 7,
    pensionEmployerRate: 14.33,
    trainingFundEmployeeRate: 2.5,
    trainingFundEmployerRate: 7.5,
    currentBankAccount: 30000,
    currentPersonalPortfolio: 50000,
    personalPortfolioReturn: 8,
    currentMonthlyExpenses: 12000,
    monthlyAdditionalSavings: 1000,
    riskTolerance: "moderate"
};

console.log('Testing Financial Health Score calculation...');
console.log('Test scenario: Young Professional (Individual, Israel)');
console.log('Expected score: 65-75/100\n');

try {
    const result = window.calculateFinancialHealthScore(testData);
    
    console.log('✅ Test completed successfully!');
    console.log(`Total Score: ${result.totalScore}/100`);
    console.log(`Status: ${result.totalScore >= 65 && result.totalScore <= 75 ? 'PASS - Within expected range' : 'FAIL - Outside expected range'}\n`);
    
    console.log('Score Breakdown:');
    Object.entries(result.categories).forEach(([category, data]) => {
        console.log(`  ${category}: ${data.score}/${data.weight}`);
    });
    
    console.log('\nDetailed Results:');
    console.log(JSON.stringify(result, null, 2));
    
} catch (error) {
    console.error('❌ Test FAILED!');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
}