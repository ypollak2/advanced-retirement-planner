// Test the exact bug in the currency conversion function
console.log('🔍 Testing the exact bug...\n');

// Simulate the problematic line 15
function testProblematicLine(exchangeRates, currency) {
    console.log('Testing line 15 behavior:');
    console.log('exchangeRates:', exchangeRates);
    console.log('currency:', currency);
    
    try {
        // This is the problematic line from the actual code
        console.warn(`Exchange rate for ${currency} is invalid:`, exchangeRates[currency]);
        console.log('✅ Line 15 executed without error');
    } catch (error) {
        console.log('❌ Line 15 failed:', error.message);
        return false;
    }
    return true;
}

// Test cases
console.log('Test 1: exchangeRates = null');
testProblematicLine(null, 'USD');

console.log('\nTest 2: exchangeRates = undefined');
testProblematicLine(undefined, 'USD');

console.log('\nTest 3: exchangeRates = {}');
testProblematicLine({}, 'USD');

console.log('\nTest 4: exchangeRates = {USD: 3.7}');
testProblematicLine({USD: 3.7}, 'USD');

// Now test the corrected version
console.log('\n' + '='.repeat(50));
console.log('Testing corrected version:');

function correctedCurrencyConversion(amount, currency, exchangeRates) {
    // Critical fix: Add null/zero check to prevent division by zero errors
    if (!exchangeRates || !exchangeRates[currency] || exchangeRates[currency] === 0) {
        // FIXED: Safe access to exchangeRates[currency] only after null check
        const rateValue = exchangeRates ? exchangeRates[currency] : 'null object';
        console.warn(`Exchange rate for ${currency} is invalid:`, rateValue);
        return 'N/A';
    }
    
    // Validate amount is a valid number
    if (isNaN(amount) || amount === null || amount === undefined) {
        console.warn(`Invalid amount for currency conversion:`, amount);
        return 'N/A';
    }
    
    console.log('✅ Validation passed');
    return 'SUCCESS';
}

console.log('\nTesting corrected function:');
console.log('Result 1 (null exchangeRates):', correctedCurrencyConversion(1000, 'USD', null));
console.log('Result 2 (null amount):', correctedCurrencyConversion(null, 'USD', {USD: 3.7}));
console.log('Result 3 (zero rate):', correctedCurrencyConversion(1000, 'USD', {USD: 0}));
console.log('Result 4 (valid):', correctedCurrencyConversion(1000, 'USD', {USD: 3.7}));

console.log('\n🔍 Bug testing complete');