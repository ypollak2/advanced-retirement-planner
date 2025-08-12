// Safe Calculation Utilities for Financial Health Engine
// Prevents NaN/Infinity values in calculations

// Safe calculation wrappers to prevent NaN/Infinity values
function safeParseFloat(value, defaultValue = 0) {
    const parsed = parseFloat(value);
    if (isNaN(parsed) || !isFinite(parsed)) {
        return defaultValue;
    }
    return parsed;
}

function safeDivide(numerator, denominator, defaultValue = 0, context = '') {
    // Enhanced validation with better error context
    if (!denominator || denominator === 0 || isNaN(denominator) || !isFinite(denominator)) {
        if (context && window.location.hostname === 'localhost') {
            console.warn(`⚠️ SafeDivide: Division by zero/invalid in ${context}`, { numerator, denominator });
        }
        return { value: defaultValue, error: 'division_by_zero', context };
    }
    
    const num = safeParseFloat(numerator, 0);
    if (num === 0 && defaultValue === 0) {
        // Allow zero results when numerator is legitimately zero
        return { value: 0, error: null, context };
    }
    
    const result = num / denominator;
    if (isNaN(result) || !isFinite(result)) {
        if (context && window.location.hostname === 'localhost') {
            console.warn(`⚠️ SafeDivide: Invalid result in ${context}`, { numerator: num, denominator, result });
        }
        return { value: defaultValue, error: 'invalid_result', context };
    }
    
    return { value: result, error: null, context };
}

function safeMultiply(a, b, defaultValue = 0, context = '') {
    const numA = safeParseFloat(a, 0);
    const numB = safeParseFloat(b, 0);
    
    // Allow zero results when inputs are legitimately zero
    if ((numA === 0 || numB === 0) && defaultValue === 0) {
        return { value: 0, error: null, context };
    }
    
    const result = numA * numB;
    if (isNaN(result) || !isFinite(result)) {
        if (context && window.location.hostname === 'localhost') {
            console.warn(`⚠️ SafeMultiply: Invalid result in ${context}`, { a: numA, b: numB, result });
        }
        return { value: defaultValue, error: 'invalid_result', context };
    }
    
    return { value: result, error: null, context };
}

function safePercentage(value, total, defaultValue = 0, context = '') {
    if (!total || total === 0) {
        if (context && window.location.hostname === 'localhost') {
            console.warn(`⚠️ SafePercentage: Division by zero in ${context}`, { value, total });
        }
        return { value: defaultValue, error: 'division_by_zero', context };
    }
    
    const divResult = safeDivide(value * 100, total, defaultValue, `${context}_percentage`);
    return {
        value: typeof divResult === 'object' ? divResult.value : divResult,
        error: typeof divResult === 'object' ? divResult.error : null,
        context
    };
}

function clampValue(value, min, max) {
    const safeValue = safeParseFloat(value, min);
    return Math.max(min, Math.min(max, safeValue));
}

// Backward compatibility wrappers for safe functions
function safeDivideCompat(numerator, denominator, defaultValue = 0) {
    const result = safeDivide(numerator, denominator, defaultValue);
    return typeof result === 'object' ? result.value : result;
}

function safeMultiplyCompat(a, b, defaultValue = 0) {
    const result = safeMultiply(a, b, defaultValue);
    return typeof result === 'object' ? result.value : result;
}

function safePercentageCompat(value, total, defaultValue = 0) {
    const result = safePercentage(value, total, defaultValue);
    return typeof result === 'object' ? result.value : result;
}

function calculateGrossFromNet(netSalary, taxCountry = 'israel') {
    // Calculate gross salary from net based on tax rates
    const taxRates = {
        israel: { base: 0.65, high: 0.55 }, // 35% tax for base, 45% for high earners
        us: { base: 0.75, high: 0.63 },     // 25% tax for base, 37% for high
        uk: { base: 0.80, high: 0.60 },     // 20% tax for base, 40% for high
        default: { base: 0.70, high: 0.60 } // 30% tax average
    };
    
    const rates = taxRates[taxCountry] || taxRates.default;
    const highEarnerThreshold = 15000; // Monthly net threshold for high earners
    
    const multiplier = netSalary > highEarnerThreshold ? rates.high : rates.base;
    return Math.round(netSalary / multiplier);
}

// Enhanced safe calculation with better error handling
function enhancedSafeCalculation(calculationName, calculationFn) {
    try {
        const result = calculationFn();
        
        // Check if the result contains any calculation errors
        if (result && typeof result === 'object') {
            if (result.error) {
                console.warn(`⚠️ Calculation warning in ${calculationName}:`, result.error);
            }
            
            // Ensure we always have a valid numeric value
            if (result.value !== undefined) {
                const finalValue = safeParseFloat(result.value, 0);
                if (!isFinite(finalValue)) {
                    console.error(`❌ Invalid result in ${calculationName}:`, result);
                    return 0;
                }
                return finalValue;
            }
        }
        
        // Handle simple numeric returns
        const finalValue = safeParseFloat(result, 0);
        if (!isFinite(finalValue)) {
            console.error(`❌ Invalid result in ${calculationName}:`, result);
            return 0;
        }
        
        return finalValue;
    } catch (error) {
        console.error(`❌ Error in ${calculationName}:`, error);
        return 0;
    }
}

// Export all functions
window.financialHealthSafeCalcs = {
    safeParseFloat,
    safeDivide,
    safeMultiply,
    safePercentage,
    clampValue,
    safeDivideCompat,
    safeMultiplyCompat,
    safePercentageCompat,
    calculateGrossFromNet,
    enhancedSafeCalculation
};

// Also export directly for backward compatibility
window.safeParseFloat = safeParseFloat;
window.safeDivide = safeDivide;
window.safeMultiply = safeMultiply;
window.safePercentage = safePercentage;
window.clampValue = clampValue;
window.calculateGrossFromNet = calculateGrossFromNet;

console.log('✅ Financial Health Safe Calculations loaded');