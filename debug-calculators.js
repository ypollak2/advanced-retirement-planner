// Debug script to test calculator functions
console.log('=== DEBUGGING CALCULATOR FUNCTIONS ===');

// Test data that should produce non-zero scores
const testData = {
    // Basic info
    currentAge: 35,
    retirementAge: 67,
    planningType: 'individual',
    
    // Income data
    currentMonthlySalary: 20000,
    monthlySalary: 20000,
    salary: 20000,
    
    // Savings data
    currentSavings: 500000,
    currentPensionSavings: 300000,
    currentTrainingFund: 200000,
    
    // Contribution rates
    pensionEmployeeRate: 7,
    pensionContributionRate: 7,
    trainingFundEmployeeRate: 2.5,
    trainingFundContributionRate: 2.5,
    
    // Additional savings
    monthlyAdditionalSavings: 2000,
    
    // Risk profile
    riskTolerance: 'moderate',
    stockPercentage: 60,
    
    // Tax data
    taxCountry: 'israel'
};

// Test if window.financialHealthEngine exists
console.log('\n1. Checking if financialHealthEngine exists:');
console.log('window.financialHealthEngine:', typeof window.financialHealthEngine);
console.log('Available methods:', window.financialHealthEngine ? Object.keys(window.financialHealthEngine) : 'NOT FOUND');

// Test if individual calculator functions exist
console.log('\n2. Checking individual calculator functions:');
console.log('window.calculateSavingsRateScore:', typeof window.calculateSavingsRateScore);
console.log('window.calculateRetirementReadinessScore:', typeof window.calculateRetirementReadinessScore);
console.log('window.calculateRiskAlignmentScore:', typeof window.calculateRiskAlignmentScore);
console.log('window.calculateTaxEfficiencyScore:', typeof window.calculateTaxEfficiencyScore);

// Test calling the functions
console.log('\n3. Testing calculator functions with sample data:');

try {
    // Test savings rate
    console.log('\nTesting savingsRate calculator:');
    const savingsResult = window.calculateSavingsRateScore ? 
        window.calculateSavingsRateScore(testData) : 
        window.financialHealthEngine.calculateSavingsRateScore(testData);
    console.log('Result:', savingsResult);
} catch (error) {
    console.error('Error calling savingsRate calculator:', error);
}

try {
    // Test retirement readiness
    console.log('\nTesting retirementReadiness calculator:');
    const readinessResult = window.calculateRetirementReadinessScore ? 
        window.calculateRetirementReadinessScore(testData) : 
        window.financialHealthEngine.calculateRetirementReadinessScore(testData);
    console.log('Result:', readinessResult);
} catch (error) {
    console.error('Error calling retirementReadiness calculator:', error);
}

try {
    // Test risk alignment
    console.log('\nTesting riskAlignment calculator:');
    const riskResult = window.calculateRiskAlignmentScore ? 
        window.calculateRiskAlignmentScore(testData) : 
        window.financialHealthEngine.calculateRiskAlignmentScore(testData);
    console.log('Result:', riskResult);
} catch (error) {
    console.error('Error calling riskAlignment calculator:', error);
}

try {
    // Test tax efficiency
    console.log('\nTesting taxEfficiency calculator:');
    const taxResult = window.calculateTaxEfficiencyScore ? 
        window.calculateTaxEfficiencyScore(testData) : 
        window.financialHealthEngine.calculateTaxEfficiencyScore(testData);
    console.log('Result:', taxResult);
} catch (error) {
    console.error('Error calling taxEfficiency calculator:', error);
}

// Test field mapping bridge
console.log('\n4. Testing field mapping bridge:');
console.log('window.fieldMappingBridge:', typeof window.fieldMappingBridge);
if (window.fieldMappingBridge) {
    console.log('Available methods:', Object.keys(window.fieldMappingBridge));
    
    // Test finding a field
    try {
        const salaryField = window.fieldMappingBridge.findFieldValue(testData, 'currentMonthlySalary');
        console.log('Found salary field:', salaryField);
    } catch (error) {
        console.error('Error using fieldMappingBridge:', error);
    }
}

// Check for missing dependencies
console.log('\n5. Checking dependencies:');
console.log('window.fieldMappingDictionary:', typeof window.fieldMappingDictionary);
console.log('window.getFieldValue:', typeof window.getFieldValue);

console.log('\n=== END DEBUG ===');