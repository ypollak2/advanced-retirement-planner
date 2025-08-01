// Financial Health Score Field Mapping Patch v7.4.8
// This patch ensures proper field detection for all scoring components

/**
 * Enhanced field detection function that handles wizard field name variations
 */
window.enhancedGetFieldValue = function(inputs, fieldNames, options = {}) {
    const { combinePartners = false, allowZero = false, expectString = false, debugMode = false } = options;
    
    if (debugMode) {
        console.log(`🔍 Searching for fields: [${fieldNames.join(', ')}]`);
        console.log(`   Options: combinePartners=${combinePartners}, allowZero=${allowZero}, expectString=${expectString}`);
    }
    
    // For string fields, return the first found value
    if (expectString) {
        for (const fieldName of fieldNames) {
            const value = inputs[fieldName];
            if (value !== undefined && value !== null && value !== '') {
                const stringValue = String(value).toLowerCase().trim();
                if (debugMode) console.log(`✅ Found string field ${fieldName}: "${stringValue}"`);
                return stringValue;
            }
        }
        return null;
    }
    
    // For numeric fields
    let values = [];
    
    for (const fieldName of fieldNames) {
        const value = inputs[fieldName];
        if (value !== undefined && value !== null && value !== '') {
            const numericValue = parseFloat(value);
            if (!isNaN(numericValue) && (allowZero || numericValue > 0)) {
                values.push(numericValue);
                if (debugMode) console.log(`✅ Found numeric field ${fieldName}: ${numericValue}`);
            }
        }
    }
    
    if (values.length === 0) {
        if (debugMode) console.log('❌ No valid values found');
        return 0;
    }
    
    // For partner combination, sum the values
    if (combinePartners && values.length > 1) {
        const sum = values.reduce((acc, val) => acc + val, 0);
        if (debugMode) console.log(`💑 Combined partner values: ${sum}`);
        return sum;
    }
    
    // Return the first found value
    return values[0];
};

/**
 * Patch the financial health engine to fix field detection issues
 */
window.patchFinancialHealthEngine = function() {
    console.log('🔧 Applying Financial Health Field Mapping Patch v7.4.8...');
    
    // Check if functions exist before storing
    if (!window.calculateSavingsRateScore || !window.calculateRiskAlignmentScore || !window.calculateTaxEfficiencyScore) {
        console.warn('⚠️ Financial health scoring functions not found, deferring patch...');
        return false;
    }
    
    // Store original functions
    const originalCalculateSavingsRateScore = window.calculateSavingsRateScore;
    const originalCalculateRiskAlignmentScore = window.calculateRiskAlignmentScore;
    const originalCalculateTaxEfficiencyScore = window.calculateTaxEfficiencyScore;
    
    // Patch savings rate calculation
    window.calculateSavingsRateScore = function(inputs) {
        console.log('💰 [PATCHED] Calculating Savings Rate Score...');
        
        // Enhanced income detection
        let monthlyIncome = 0;
        
        if (inputs.planningType === 'couple') {
            // Try partner salary fields with all variations
            monthlyIncome = window.enhancedGetFieldValue(inputs, [
                'partner1Salary', 'partner2Salary',
                'partner1MonthlySalary', 'partner2MonthlySalary',
                'partner1Income', 'partner2Income',
                'Partner1Salary', 'Partner2Salary'
            ], { combinePartners: true, allowZero: false, debugMode: true });
        } else {
            // Try individual salary fields
            monthlyIncome = window.enhancedGetFieldValue(inputs, [
                'currentMonthlySalary', 'monthlySalary', 
                'salary', 'monthlyIncome', 'currentSalary'
            ], { allowZero: false, debugMode: true });
        }
        
        // If no income found, return clear error
        if (monthlyIncome === 0) {
            console.error('❌ No monthly income found - check salary fields');
            return {
                score: 0,
                details: {
                    status: 'missing_income',
                    monthlyIncome: 0,
                    reason: 'No salary/income fields found',
                    checkedFields: inputs.planningType === 'couple' 
                        ? ['partner1Salary', 'partner2Salary']
                        : ['currentMonthlySalary', 'monthlySalary']
                }
            };
        }
        
        // Get contribution rates with enhanced field detection
        const pensionRate = window.enhancedGetFieldValue(inputs, [
            'employeePensionRate', 'pensionEmployeeRate',
            'pensionContributionRate', 'pensionRate',
            'pensionEmployeeContribution', 'employeePensionContribution'
        ], { allowZero: true, debugMode: true });
        
        const trainingRate = window.enhancedGetFieldValue(inputs, [
            'trainingFundEmployeeRate', 'trainingFundContributionRate',
            'trainingFundRate', 'employeeTrainingFundRate',
            'trainingFundEmployeeContribution', 'employeeTrainingFundContribution'
        ], { allowZero: true, debugMode: true });
        
        // If no rates found, check if we should use defaults
        const finalPensionRate = pensionRate || (inputs.taxCountry === 'israel' || inputs.country === 'israel' ? 6.5 : 5.0);
        const finalTrainingRate = trainingRate || (inputs.taxCountry === 'israel' || inputs.country === 'israel' ? 2.5 : 0);
        
        if (!pensionRate && !trainingRate) {
            console.warn('⚠️ No contribution rates found, using defaults:', {
                pension: finalPensionRate,
                trainingFund: finalTrainingRate,
                country: inputs.taxCountry || inputs.country || 'unknown'
            });
        }
        
        // Calculate savings rate
        const totalContributionRate = finalPensionRate + finalTrainingRate;
        const savingsRate = (monthlyIncome * totalContributionRate / 100) / monthlyIncome * 100;
        
        // Calculate score (0-25 scale)
        let score = 0;
        if (savingsRate >= 25) score = 25;
        else if (savingsRate >= 20) score = 22;
        else if (savingsRate >= 15) score = 18;
        else if (savingsRate >= 10) score = 12;
        else if (savingsRate >= 5) score = 6;
        else if (savingsRate > 0) score = 3;
        
        console.log(`✅ Savings Rate: ${savingsRate.toFixed(2)}%, Score: ${score}/25`);
        
        return {
            score: score,
            details: {
                status: score >= 15 ? 'good' : score >= 10 ? 'fair' : 'poor',
                savingsRate: savingsRate,
                monthlyIncome: monthlyIncome,
                contributionRates: {
                    pension: finalPensionRate,
                    trainingFund: finalTrainingRate,
                    total: totalContributionRate
                }
            }
        };
    };
    
    // Patch risk alignment calculation
    window.calculateRiskAlignmentScore = function(inputs) {
        console.log('📊 [PATCHED] Calculating Risk Alignment Score...');
        
        const currentAge = parseFloat(inputs.currentAge || 30);
        
        // Get risk tolerance
        const riskTolerance = window.enhancedGetFieldValue(inputs, [
            'riskTolerance', 'riskProfile', 'investmentRisk', 'riskLevel'
        ], { expectString: true, debugMode: true }) || 'moderate';
        
        // Get stock percentage
        let stockPercentage = window.enhancedGetFieldValue(inputs, [
            'stockPercentage', 'equityPercentage', 'stockAllocation'
        ], { allowZero: true, debugMode: true });
        
        // If no stock percentage, use age-based default
        if (stockPercentage === 0 && !inputs.stockPercentage) {
            stockPercentage = Math.max(20, 100 - currentAge);
            console.log(`📊 Using age-based stock allocation: ${stockPercentage}%`);
        }
        
        // Calculate alignment
        const targetStock = riskTolerance === 'aggressive' ? 80 :
                          riskTolerance === 'moderate' ? 60 : 40;
        
        const deviation = Math.abs(stockPercentage - targetStock);
        let score = 12; // Max score
        
        if (deviation <= 10) score = 12;
        else if (deviation <= 20) score = 9;
        else if (deviation <= 30) score = 6;
        else if (deviation <= 40) score = 3;
        else score = 1;
        
        console.log(`✅ Risk Alignment: ${riskTolerance}, Stock: ${stockPercentage}%, Score: ${score}/12`);
        
        return {
            score: score,
            details: {
                status: score >= 9 ? 'good' : score >= 6 ? 'fair' : 'poor',
                riskTolerance: riskTolerance,
                stockPercentage: stockPercentage,
                targetPercentage: targetStock,
                deviation: deviation
            }
        };
    };
    
    // Patch tax efficiency calculation
    window.calculateTaxEfficiencyScore = function(inputs) {
        console.log('💸 [PATCHED] Calculating Tax Efficiency Score...');
        
        // Get country
        const country = window.enhancedGetFieldValue(inputs, [
            'taxCountry', 'country', 'location', 'countryCode'
        ], { expectString: true, debugMode: true }) || 'israel';
        
        // Get age
        const age = window.enhancedGetFieldValue(inputs, [
            'currentAge', 'age', 'userAge'
        ], { allowZero: false, debugMode: true }) || 30;
        
        // Get contribution rates for tax efficiency
        const pensionRate = window.enhancedGetFieldValue(inputs, [
            'employeePensionRate', 'pensionEmployeeRate',
            'pensionContributionRate', 'pensionRate'
        ], { allowZero: true, debugMode: true }) || 6.5;
        
        // Calculate tax efficiency score based on country and contributions
        let score = 8; // Max score
        
        if (country === 'israel' || country === 'isr') {
            // Israeli tax efficiency based on contribution optimization
            if (pensionRate >= 6 && pensionRate <= 7) score = 8;
            else if (pensionRate >= 5 && pensionRate <= 8) score = 6;
            else if (pensionRate >= 4 && pensionRate <= 10) score = 4;
            else score = 2;
        } else {
            // Basic score for other countries
            score = 5;
        }
        
        console.log(`✅ Tax Efficiency: Country=${country}, Age=${age}, Score: ${score}/8`);
        
        return {
            score: score,
            details: {
                status: score >= 6 ? 'good' : score >= 4 ? 'fair' : 'poor',
                country: country,
                age: age,
                pensionRate: pensionRate,
                optimizationLevel: score >= 6 ? 'optimized' : 'sub-optimal'
            }
        };
    };
    
    console.log('✅ Financial Health Field Mapping Patch Applied Successfully');
    return true;
};

// Auto-apply patch on load with retry logic
let patchAttempts = 0;
const maxAttempts = 5;

function tryApplyPatch() {
    if (window.calculateSavingsRateScore && window.calculateRiskAlignmentScore && window.calculateTaxEfficiencyScore) {
        if (window.patchFinancialHealthEngine()) {
            console.log('✅ Patch applied successfully on attempt', patchAttempts + 1);
            return true;
        }
    }
    
    patchAttempts++;
    if (patchAttempts < maxAttempts) {
        console.log(`⏳ Waiting for financial health engine... attempt ${patchAttempts}/${maxAttempts}`);
        setTimeout(tryApplyPatch, 1000);
    } else {
        console.warn('⚠️ Could not apply financial health patch after', maxAttempts, 'attempts');
    }
    return false;
}

// Start trying to apply patch
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(tryApplyPatch, 500);
});

console.log('✅ Financial Health Field Patch loaded');