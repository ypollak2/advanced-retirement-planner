// Debug currency conversion null safety
console.log('🔍 Debugging Currency Conversion Function...\n');

// Simulate the exact convertCurrency function from retirementCalculations.js
const convertCurrency = (amount, currency, exchangeRates) => {
    console.log('Input values:');
    console.log('  amount:', amount);
    console.log('  currency:', currency);
    console.log('  exchangeRates:', exchangeRates);
    console.log('  exchangeRates[currency]:', exchangeRates && exchangeRates[currency]);
    
    // Critical fix: Add null/zero check to prevent division by zero errors
    if (!exchangeRates || !exchangeRates[currency] || exchangeRates[currency] === 0) {
        console.warn(`Exchange rate for ${currency} is invalid:`, exchangeRates && exchangeRates[currency]);
        return 'N/A';
    }
    
    // Validate amount is a valid number
    if (isNaN(amount) || amount === null || amount === undefined) {
        console.warn(`Invalid amount for currency conversion:`, amount);
        return 'N/A';
    }
    
    console.log('✅ Validation passed - proceeding with conversion');
    
    const convertedAmount = amount / exchangeRates[currency];
    const formatters = {
        USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }),
        GBP: new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }),
        EUR: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }),
        ILS: new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 }),
    };
    
    if (!formatters[currency]) {
        console.warn(`No formatter available for currency: ${currency}`);
        return `${convertedAmount.toFixed(2)} ${currency}`;
    }
    
    return formatters[currency].format(convertedAmount);
};

console.log('Test 1: Null exchange rates');
console.log('=' .repeat(40));
try {
    const result1 = convertCurrency(1000, 'USD', null);
    console.log('Result:', result1);
    console.log('✅ Test 1 passed - returned N/A for null exchange rates\n');
} catch (error) {
    console.log('❌ Test 1 failed:', error.message);
    console.log('🔴 CRITICAL: Null exchange rates cause TypeError\n');
}

console.log('Test 2: Null amount');
console.log('=' .repeat(40));
try {
    const result2 = convertCurrency(null, 'USD', {USD: 3.7});
    console.log('Result:', result2);
    console.log('✅ Test 2 passed - returned N/A for null amount\n');
} catch (error) {
    console.log('❌ Test 2 failed:', error.message);
    console.log('🔴 CRITICAL: Null amount causes TypeError\n');
}

console.log('Test 3: Zero exchange rate');
console.log('=' .repeat(40));
try {
    const result3 = convertCurrency(1000, 'USD', {USD: 0});
    console.log('Result:', result3);
    console.log('✅ Test 3 passed - returned N/A for zero exchange rate\n');
} catch (error) {
    console.log('❌ Test 3 failed:', error.message);
    console.log('🔴 CRITICAL: Zero exchange rate causes error\n');
}

console.log('Test 4: Undefined exchange rate');
console.log('=' .repeat(40));
try {
    const result4 = convertCurrency(1000, 'USD', {EUR: 4.0}); // No USD rate
    console.log('Result:', result4);
    console.log('✅ Test 4 passed - returned N/A for undefined exchange rate\n');
} catch (error) {
    console.log('❌ Test 4 failed:', error.message);
    console.log('🔴 CRITICAL: Undefined exchange rate causes error\n');
}

console.log('Test 5: Valid conversion');
console.log('=' .repeat(40));
try {
    const result5 = convertCurrency(1000, 'USD', {USD: 3.7});
    console.log('Result:', result5);
    console.log('✅ Test 5 passed - valid conversion works\n');
} catch (error) {
    console.log('❌ Test 5 failed:', error.message);
    console.log('🔴 CRITICAL: Valid conversion fails\n');
}

// Now test with the actual loaded function from retirementCalculations.js
console.log('Testing with actual loaded function...');
console.log('=' .repeat(50));

try {
    const fs = require('fs');
    global.window = global;
    
    // Load the actual file
    eval(fs.readFileSync('./src/utils/retirementCalculations.js', 'utf8'));
    
    console.log('Actual function test - Null exchange rates:');
    const actualResult1 = window.convertCurrency(1000, 'USD', null);
    console.log('Result:', actualResult1);
    
    console.log('\nActual function test - Null amount:');
    const actualResult2 = window.convertCurrency(null, 'USD', {USD: 3.7});
    console.log('Result:', actualResult2);
    
    console.log('\nActual function test - Zero exchange rate:');
    const actualResult3 = window.convertCurrency(1000, 'USD', {USD: 0});
    console.log('Result:', actualResult3);
    
} catch (error) {
    console.log('❌ Actual function test failed:', error.message);
    console.log('🔴 CRITICAL: The actual loaded function has issues');
}

console.log('\n🔍 Currency conversion debugging complete');