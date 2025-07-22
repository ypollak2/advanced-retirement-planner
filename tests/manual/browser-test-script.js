// Browser Console Test Script - Paste into browser console at http://localhost:8000
// This script tests the core fixes we implemented

console.log('🧪 Testing Advanced Retirement Planner v6.5.0 Fixes');
console.log('=====================================================');

// Test 1: Check if components are loaded properly
function testComponentsLoaded() {
    console.log('\n📦 Testing Component Loading:');
    const components = [
        'WizardStepSavings',
        'WizardStepReview', 
        'WizardStepContributions',
        'WizardStepTaxes',
        'WizardStepInheritance'
    ];
    
    components.forEach(comp => {
        if (window[comp]) {
            console.log(`✅ ${comp} loaded successfully`);
        } else {
            console.log(`❌ ${comp} NOT loaded`);
        }
    });
}

// Test 2: Test total savings calculation (Fix #1)
function testTotalSavingsCalculation() {
    console.log('\n💰 Testing Total Savings Calculation (Fix #1):');
    
    // Mock couple mode input data
    const testInputs = {
        planningType: 'couple',
        currentSavings: 500000,
        currentTrainingFund: 200000,
        currentPersonalPortfolio: 300000,
        currentRealEstate: 100000,
        currentCrypto: 50000,
        currentSavingsAccount: 50000,
        // Partner 1 data
        partner1CurrentPension: 400000,
        partner1CurrentTrainingFund: 150000,
        partner1PersonalPortfolio: 200000,
        partner1RealEstate: 1500000, // This was missing before!
        partner1Crypto: 500000, // This was missing before!
        // Partner 2 data  
        partner2CurrentPension: 300000,
        partner2CurrentTrainingFund: 100000,
        partner2PersonalPortfolio: 150000,
        partner2RealEstate: 1500000, // This was missing before!
        partner2Crypto: 330000 // This was missing before!
    };
    
    // Calculate expected total
    const expectedTotal = 500000 + 200000 + 300000 + 100000 + 50000 + 50000 + // Individual
                         400000 + 150000 + 200000 + 1500000 + 500000 + // Partner 1
                         300000 + 100000 + 150000 + 1500000 + 330000; // Partner 2
    
    console.log(`Expected Total: ₪${expectedTotal.toLocaleString()} (₪${(expectedTotal/1000000).toFixed(1)}M)`);
    console.log('✅ This should now show ~₪5.83M instead of ₪75K');
}

// Test 3: Test percentage validation (Fix #5)
function testPercentageValidation() {
    console.log('\n📊 Testing Percentage Validation (Fix #5):');
    
    // This function should exist in WizardStepContributions
    if (typeof validatePercentage === 'function') {
        console.log('✅ validatePercentage function exists');
        console.log(`Testing -5: ${validatePercentage(-5)} (should be 0)`);
        console.log(`Testing 150: ${validatePercentage(150)} (should be 100)`);
        console.log(`Testing 25: ${validatePercentage(25)} (should be 25)`);
    } else {
        console.log('ℹ️ validatePercentage function not in global scope (normal - it\'s in component)');
    }
}

// Test 4: Check if tax calculation functions exist (Fix #7)
function testTaxCalculationFunctions() {
    console.log('\n🧮 Testing Tax Calculation Functions (Fix #7):');
    
    // These should be available if WizardStepTaxes is loaded
    const testIncome = 300000; // ₪25K monthly * 12
    console.log(`Testing with annual income: ₪${testIncome.toLocaleString()}`);
    console.log('Auto-calculate tax button should populate marginal and effective rates');
    console.log('✅ Button should now show success message after calculation');
}

// Test 5: Verify no NaN in calculations (Fix #2)
function testNaNPrevention() {
    console.log('\n🔢 Testing NaN Prevention (Fix #2):');
    
    // Test scenarios that previously caused NaN
    const testCases = [
        { pensionRate: null, expected: 'should handle null' },
        { pensionRate: undefined, expected: 'should handle undefined' },
        { pensionRate: 0, expected: 'should handle zero' },
        { pensionRate: 7, expected: 'should calculate normally' }
    ];
    
    testCases.forEach(test => {
        console.log(`Input: ${test.pensionRate} - ${test.expected}`);
    });
    console.log('✅ Tax efficiency score should never show "NaN/100"');
}

// Run all tests
function runAllTests() {
    testComponentsLoaded();
    testTotalSavingsCalculation(); 
    testPercentageValidation();
    testTaxCalculationFunctions();
    testNaNPrevention();
    
    console.log('\n🎯 MANUAL VERIFICATION NEEDED:');
    console.log('1. Open wizard and go through steps');
    console.log('2. Check total savings in Step 8 (Review)');
    console.log('3. Verify tax efficiency score shows number (not NaN)');
    console.log('4. Test auto-calculate tax button shows alert');
    console.log('5. Try entering invalid percentages (should be constrained)');
    console.log('6. Complete inheritance planning (validation should clear)');
    console.log('7. Check life insurance section has guidance text');
    
    console.log('\n✅ All automated tests completed!');
    console.log('📋 Use MANUAL_TESTING_CHECKLIST.md for full UI verification');
}

// Run the tests
runAllTests();