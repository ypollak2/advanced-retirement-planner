// Goal Suggestion Engine - Smart retirement goal recommendations
// Created by Yali Pollak (יהלי פולק) - v6.6.3

/**
 * Smart goal suggestion engine that analyzes user's financial profile
 * and provides intelligent retirement goal recommendations
 */

// Lifestyle multipliers for retirement expense calculation
const LIFESTYLE_MULTIPLIERS = {
    basic: 0.7,      // 70% of current income
    comfortable: 0.8, // 80% of current income
    luxury: 1.0      // 100% of current income
};

// Safe withdrawal rates by age at retirement
const SAFE_WITHDRAWAL_RATES = {
    55: 0.035,  // 3.5% for early retirement
    60: 0.04,   // 4.0% for standard early retirement
    65: 0.045,  // 4.5% for normal retirement
    67: 0.05,   // 5.0% for full retirement age
    70: 0.055   // 5.5% for delayed retirement
};

// Emergency fund multipliers by country (months of expenses)
const EMERGENCY_FUND_MONTHS = {
    'ISR': 6,   // Israel - 6 months
    'USA': 8,   // USA - 8 months  
    'GBR': 6,   // UK - 6 months
    'EUR': 8    // Europe - 8 months
};

/**
 * Calculate total current savings across all asset types
 */
function calculateTotalCurrentSavings(inputs) {
    const assets = [
        'currentSavings',           // Pension savings
        'currentTrainingFund',      // Training fund
        'currentPersonalPortfolio', // Personal portfolio
        'currentCryptoFiatValue',   // Cryptocurrency (fiat value)
        'currentSavingsAccount',    // Savings account
        'currentRealEstate'         // Real estate
    ];
    
    let total = 0;
    
    // Add individual savings
    assets.forEach(asset => {
        total += parseFloat(inputs[asset]) || 0;
    });
    
    // Add partner savings if couple mode
    if (inputs.relationshipStatus === 'couple') {
        assets.forEach(asset => {
            const partner1Field = asset.replace('current', 'partner1');
            const partner2Field = asset.replace('current', 'partner2');
            total += parseFloat(inputs[partner1Field]) || 0;
            total += parseFloat(inputs[partner2Field]) || 0;
        });
    }
    
    return total;
}

/**
 * Calculate combined monthly income
 */
function calculateMonthlyIncome(inputs) {
    let income = 0;
    
    if (inputs.relationshipStatus === 'couple') {
        income += parseFloat(inputs.partner1Salary) || 0;
        income += parseFloat(inputs.partner2Salary) || 0;
    } else {
        income += parseFloat(inputs.currentMonthlySalary) || 0;
    }
    
    return income;
}

/**
 * Get safe withdrawal rate based on retirement age
 */
function getSafeWithdrawalRate(retirementAge) {
    const ages = Object.keys(SAFE_WITHDRAWAL_RATES).map(Number).sort((a, b) => a - b);
    
    // Find closest age bracket
    let closestAge = ages[0];
    for (let age of ages) {
        if (Math.abs(age - retirementAge) < Math.abs(closestAge - retirementAge)) {
            closestAge = age;
        }
    }
    
    return SAFE_WITHDRAWAL_RATES[closestAge];
}

/**
 * Project future value with compound growth
 */
function projectFutureValue(currentValue, annualGrowthRate, years) {
    if (years <= 0) return currentValue;
    return currentValue * Math.pow(1 + annualGrowthRate, years);
}

/**
 * Calculate suggested monthly retirement expenses
 */
function suggestMonthlyRetirementExpenses(inputs) {
    const monthlyIncome = calculateMonthlyIncome(inputs);
    const lifestyle = inputs.retirementLifestyle || 'comfortable';
    const multiplier = LIFESTYLE_MULTIPLIERS[lifestyle];
    
    // Base suggestion on current income adjusted for lifestyle
    const suggestedExpenses = Math.round(monthlyIncome * multiplier);
    
    // Add inflation adjustment for future purchasing power
    const yearsToRetirement = (inputs.retirementAge || 67) - (inputs.currentAge || 30);
    const inflationRate = parseFloat(inputs.inflationRate) || 0.025; // 2.5% default
    const inflationAdjustedExpenses = Math.round(suggestedExpenses * Math.pow(1 + inflationRate, yearsToRetirement));
    
    return {
        baseAmount: suggestedExpenses,
        inflationAdjusted: inflationAdjustedExpenses,
        lifestyle: lifestyle,
        explanation: `Based on ${Math.round(multiplier * 100)}% of current income (${lifestyle} lifestyle)`
    };
}

/**
 * Calculate suggested retirement savings goal
 */
function suggestRetirementSavingsGoal(inputs) {
    const monthlyExpensesSuggestion = suggestMonthlyRetirementExpenses(inputs);
    const annualExpenses = monthlyExpensesSuggestion.inflationAdjusted * 12;
    const retirementAge = inputs.retirementAge || 67;
    const safeWithdrawalRate = getSafeWithdrawalRate(retirementAge);
    
    // Calculate required savings using safe withdrawal rate
    const requiredSavings = Math.round(annualExpenses / safeWithdrawalRate);
    
    // Project current savings growth
    const currentSavings = calculateTotalCurrentSavings(inputs);
    const yearsToRetirement = retirementAge - (inputs.currentAge || 30);
    
    // Use blended return rate from pension and portfolio allocations
    const expectedReturn = calculateBlendedReturnRate(inputs);
    const projectedCurrentSavings = projectFutureValue(currentSavings, expectedReturn, yearsToRetirement);
    
    // Suggested goal is the larger of: required savings or projected current savings + buffer
    const suggestedGoal = Math.max(requiredSavings, Math.round(projectedCurrentSavings * 1.2));
    
    return {
        amount: suggestedGoal,
        requiredSavings: requiredSavings,
        projectedSavings: Math.round(projectedCurrentSavings),
        safeWithdrawalRate: safeWithdrawalRate,
        explanation: `Based on ${(safeWithdrawalRate * 100).toFixed(1)}% safe withdrawal rate for age ${retirementAge} retirement`
    };
}

/**
 * Calculate blended expected return rate from user's allocations
 */
function calculateBlendedReturnRate(inputs) {
    // Default conservative estimates if no specific returns provided
    const pensionReturn = parseFloat(inputs.pensionReturn) || 0.06;  // 6% default
    const portfolioReturn = parseFloat(inputs.portfolioReturn) || 0.07; // 7% default
    
    const currentSavings = calculateTotalCurrentSavings(inputs);
    const pensionSavings = parseFloat(inputs.currentSavings) || 0;
    const portfolioSavings = parseFloat(inputs.currentPersonalPortfolio) || 0;
    
    if (currentSavings === 0) return 0.06; // Default 6% if no savings
    
    // Weight returns by current allocations
    const pensionWeight = pensionSavings / currentSavings;
    const portfolioWeight = portfolioSavings / currentSavings;
    const otherWeight = 1 - pensionWeight - portfolioWeight;
    
    return (pensionReturn * pensionWeight) + 
           (portfolioReturn * portfolioWeight) + 
           (0.05 * otherWeight); // 5% for other assets
}

/**
 * Calculate suggested emergency fund
 */
function suggestEmergencyFund(inputs) {
    const monthlyIncome = calculateMonthlyIncome(inputs);
    const country = inputs.country || 'ISR';
    const months = EMERGENCY_FUND_MONTHS[country] || 6;
    
    const suggestedAmount = Math.round(monthlyIncome * months);
    
    return {
        amount: suggestedAmount,
        months: months,
        monthlyIncome: monthlyIncome,
        explanation: `${months} months of income for ${country} residents`
    };
}

/**
 * Calculate gap analysis between current trajectory and goals
 */
function calculateGapAnalysis(inputs, suggestions) {
    const currentSavings = calculateTotalCurrentSavings(inputs);
    const yearsToRetirement = (inputs.retirementAge || 67) - (inputs.currentAge || 30);
    const expectedReturn = calculateBlendedReturnRate(inputs);
    
    const projectedSavings = projectFutureValue(currentSavings, expectedReturn, yearsToRetirement);
    const suggestedGoal = suggestions.retirementGoal.amount;
    
    const gap = suggestedGoal - projectedSavings;
    const monthlyGap = gap > 0 ? Math.round(gap / (yearsToRetirement * 12)) : 0;
    
    return {
        currentSavings: Math.round(currentSavings),
        projectedSavings: Math.round(projectedSavings),
        targetGoal: suggestedGoal,
        gap: Math.round(gap),
        monthlyAdditionalNeeded: monthlyGap,
        onTrack: gap <= 0
    };
}

/**
 * Main function to generate all goal suggestions
 */
function generateGoalSuggestions(inputs) {
    try {
        const retirementGoal = suggestRetirementSavingsGoal(inputs);
        const monthlyExpenses = suggestMonthlyRetirementExpenses(inputs);
        const emergencyFund = suggestEmergencyFund(inputs);
        
        const suggestions = {
            retirementGoal: retirementGoal,
            monthlyExpenses: monthlyExpenses,
            emergencyFund: emergencyFund,
            gapAnalysis: calculateGapAnalysis(inputs, { retirementGoal }),
            metadata: {
                generatedAt: new Date().toISOString(),
                yearsToRetirement: (inputs.retirementAge || 67) - (inputs.currentAge || 30),
                currentTotalSavings: calculateTotalCurrentSavings(inputs),
                monthlyIncome: calculateMonthlyIncome(inputs),
                blendedReturnRate: calculateBlendedReturnRate(inputs)
            }
        };
        
        console.log('✅ Goal suggestions generated successfully:', suggestions);
        return suggestions;
        
    } catch (error) {
        console.error('❌ Error generating goal suggestions:', error);
        return null;
    }
}

/**
 * Check if inputs have changed significantly to warrant suggestion refresh
 */
function shouldRefreshSuggestions(previousInputs, currentInputs) {
    const significantFields = [
        'currentAge', 'retirementAge', 'currentMonthlySalary',
        'currentSavings', 'currentPersonalPortfolio', 'currentCryptoFiatValue',
        'retirementLifestyle', 'inflationRate', 'pensionReturn', 'portfolioReturn',
        'partner1Salary', 'partner2Salary', 'relationshipStatus'
    ];
    
    if (!previousInputs) return true;
    
    return significantFields.some(field => {
        const oldValue = parseFloat(previousInputs[field]) || 0;
        const newValue = parseFloat(currentInputs[field]) || 0;
        const changePercent = oldValue === 0 ? 1 : Math.abs((newValue - oldValue) / oldValue);
        return changePercent > 0.05; // 5% change threshold
    });
}

// Export functions to window for global access
window.generateGoalSuggestions = generateGoalSuggestions;
window.shouldRefreshSuggestions = shouldRefreshSuggestions;
window.calculateTotalCurrentSavings = calculateTotalCurrentSavings;
window.calculateMonthlyIncome = calculateMonthlyIncome;
window.suggestMonthlyRetirementExpenses = suggestMonthlyRetirementExpenses;
window.suggestRetirementSavingsGoal = suggestRetirementSavingsGoal;
window.suggestEmergencyFund = suggestEmergencyFund;

console.log('✅ Goal Suggestion Engine loaded successfully');