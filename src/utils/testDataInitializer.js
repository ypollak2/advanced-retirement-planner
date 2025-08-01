// Test Data Initializer for v7.5.9
// Pre-fills the wizard with test data to verify functionality
// This will be removed after testing

const TEST_DATA = {
    // Step 1 - Personal Information
    currentAge: 39,
    retirementAge: 67,
    planningType: 'couple',
    partner1Age: 39,
    partner2Age: 39,
    partner1RetirementAge: 67,
    partner2RetirementAge: 67,
    riskTolerance: 'moderate',
    
    // Step 2 - Income
    partner1Salary: 53500,
    partner2Salary: 33000,
    partner1AnnualBonus: 0,
    partner2AnnualBonus: 0,
    partner1QuarterlyRSU: 0,
    partner2QuarterlyRSU: 0,
    
    // Step 3 - Expenses (currently 0 in the test data)
    sharedMonthlyExpenses: 0,
    partner1MonthlyExpenses: 0,
    partner2MonthlyExpenses: 0,
    
    // Step 4 - Current Savings
    partner1CurrentPension: 1550000,
    partner1CurrentTrainingFund: 470000,
    partner1PersonalPortfolio: 1050000,
    partner2CurrentPension: 550000,
    partner2CurrentTrainingFund: 227000,
    partner2PersonalPortfolio: 307000,
    
    // Step 5 - Contribution Rates (typical Israeli rates)
    partner1EmployeeRate: 6,
    partner1EmployerRate: 6.5,
    partner1TrainingFundEmployeeRate: 2.5,
    partner1TrainingFundEmployerRate: 5,
    employeePensionRate: 6,
    employerPensionRate: 6.5,
    trainingFundEmployeeRate: 2.5,
    trainingFundEmployerRate: 5,
    
    // Step 6 - Fees
    pensionManagementFee: 0.5,
    trainingFundManagementFee: 0.5,
    personalPortfolioFee: 1,
    
    // Step 7 - Expected Returns
    pensionReturn: 5,
    trainingFundReturn: 5,
    personalPortfolioReturn: 6,
    expectedAnnualReturn: 5.5,
    
    // Step 8 - Goals
    targetReplacement: 70,
    inflationRate: 2.5,
    
    // Additional fields
    workingCurrency: 'ILS',
    country: 'israel',
    
    // Mark as test data
    isTestData: true,
    testDataVersion: '7.5.9'
};

// Function to initialize test data
window.initializeTestData = function() {
    try {
        // Check if we should load test data (only in development or with ?testdata=true)
        const urlParams = new URLSearchParams(window.location.search);
        const shouldLoadTestData = urlParams.get('testdata') === 'true' || 
                                  window.location.hostname === 'localhost';
        
        if (!shouldLoadTestData) {
            console.log('Test data initialization skipped (use ?testdata=true to enable)');
            return false;
        }
        
        // Check if data already exists
        const existingData = localStorage.getItem('retirementWizardInputs');
        if (existingData) {
            const parsed = JSON.parse(existingData);
            if (!parsed.isTestData) {
                console.log('Existing user data found, not overwriting with test data');
                return false;
            }
        }
        
        // Save test data to localStorage
        localStorage.setItem('retirementWizardInputs', JSON.stringify(TEST_DATA));
        
        // Set wizard to review step (step 9)
        localStorage.setItem('wizardCurrentStep', '9');
        
        console.log('✅ Test data initialized successfully');
        console.log('📊 Test data summary:', {
            planningType: TEST_DATA.planningType,
            partner1TotalSavings: TEST_DATA.partner1CurrentPension + TEST_DATA.partner1CurrentTrainingFund + TEST_DATA.partner1PersonalPortfolio,
            partner2TotalSavings: TEST_DATA.partner2CurrentPension + TEST_DATA.partner2CurrentTrainingFund + TEST_DATA.partner2PersonalPortfolio,
            totalMonthlyIncome: TEST_DATA.partner1Salary + TEST_DATA.partner2Salary,
            totalExpenses: TEST_DATA.sharedMonthlyExpenses + TEST_DATA.partner1MonthlyExpenses + TEST_DATA.partner2MonthlyExpenses
        });
        
        return true;
    } catch (error) {
        console.error('Failed to initialize test data:', error);
        return false;
    }
};

// Function to clear test data
window.clearTestData = function() {
    const existingData = localStorage.getItem('retirementWizardInputs');
    if (existingData) {
        const parsed = JSON.parse(existingData);
        if (parsed.isTestData) {
            localStorage.removeItem('retirementWizardInputs');
            localStorage.removeItem('wizardCurrentStep');
            console.log('✅ Test data cleared');
            window.location.reload();
        } else {
            console.log('⚠️ Not test data, keeping user data intact');
        }
    }
};

// Auto-initialize on load if appropriate
document.addEventListener('DOMContentLoaded', function() {
    // Only auto-initialize if URL has testdata=true
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('testdata') === 'true') {
        window.initializeTestData();
    }
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TEST_DATA, initializeTestData: window.initializeTestData };
}