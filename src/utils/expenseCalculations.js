// Expense Calculations Utility - Projections and analysis for expense tracking
// Handles category-based inflation, expense predictions, and savings analysis

// Category-specific inflation adjustments (relative to base inflation)
const CATEGORY_INFLATION_ADJUSTMENTS = {
    housing: 1.0,        // Typically tracks with inflation + 1%
    transportation: 0.0,  // Tracks with base inflation
    food: 2.0,           // Usually inflation + 2%
    insurance: 3.0,      // Healthcare costs rise faster than inflation
    other: 0.0           // Varies, use base rate
};

// Recommended expense ratios as percentage of income
const RECOMMENDED_EXPENSE_RATIOS = {
    housing: { min: 20, max: 30, ideal: 25 },
    transportation: { min: 10, max: 20, ideal: 15 },
    food: { min: 10, max: 20, ideal: 15 },
    insurance: { min: 5, max: 15, ideal: 10 },
    other: { min: 5, max: 20, ideal: 10 },
    savings: { min: 10, max: 30, ideal: 20 }
};

/**
 * Calculate projected expenses for a specific year
 * @param {Object} currentExpenses - Current expense breakdown by category
 * @param {number} yearlyAdjustment - Base yearly adjustment rate (%)
 * @param {number} yearsAhead - Number of years to project
 * @param {number} baseInflation - Base inflation rate (%)
 * @returns {Object} Projected expenses by category
 */
function projectExpenses(currentExpenses, yearlyAdjustment = 2.5, yearsAhead = 1, baseInflation = 2.5) {
    const projectedExpenses = {};
    
    Object.keys(currentExpenses).forEach(category => {
        if (category === 'yearlyAdjustment') return;
        
        const currentAmount = parseFloat(currentExpenses[category]) || 0;
        const categoryAdjustment = CATEGORY_INFLATION_ADJUSTMENTS[category] || 0;
        const totalAdjustmentRate = (yearlyAdjustment + categoryAdjustment) / 100;
        
        // Compound growth formula
        projectedExpenses[category] = currentAmount * Math.pow(1 + totalAdjustmentRate, yearsAhead);
    });
    
    return projectedExpenses;
}

/**
 * Calculate total expenses from category breakdown
 * @param {Object} expenses - Expense breakdown by category
 * @returns {number} Total monthly expenses
 */
function calculateTotalExpenses(expenses) {
    if (!expenses) return 0;
    
    return Object.keys(expenses)
        .filter(key => key !== 'yearlyAdjustment')
        .reduce((sum, key) => sum + (parseFloat(expenses[key]) || 0), 0);
}

/**
 * Generate expense projections for multiple years
 * @param {Object} currentExpenses - Current expense breakdown
 * @param {number} yearlyAdjustment - Base yearly adjustment rate (%)
 * @param {number} yearsToProject - Number of years to project (default 30)
 * @param {number} baseInflation - Base inflation rate (%)
 * @returns {Array} Array of yearly projections
 */
function generateExpenseProjections(currentExpenses, yearlyAdjustment = 2.5, yearsToProject = 30, baseInflation = 2.5) {
    const projections = [];
    const currentTotal = calculateTotalExpenses(currentExpenses);
    
    for (let year = 0; year <= yearsToProject; year++) {
        const projectedExpenses = projectExpenses(currentExpenses, yearlyAdjustment, year, baseInflation);
        const totalExpenses = calculateTotalExpenses(projectedExpenses);
        
        projections.push({
            year: year,
            expenses: projectedExpenses,
            total: totalExpenses,
            inflationMultiplier: Math.pow(1 + yearlyAdjustment / 100, year)
        });
    }
    
    return projections;
}

/**
 * Analyze expense ratios and provide recommendations
 * @param {Object} expenses - Current expense breakdown
 * @param {number} monthlyIncome - Monthly income
 * @param {string} language - Language for recommendations ('en' or 'he')
 * @returns {Object} Analysis results with recommendations
 */
function analyzeExpenseRatios(expenses, monthlyIncome, language = 'en') {
    if (!monthlyIncome || monthlyIncome === 0) {
        return { analysis: {}, recommendations: [] };
    }
    
    const analysis = {};
    const recommendations = [];
    const totalExpenses = calculateTotalExpenses(expenses);
    const savingsAmount = monthlyIncome - totalExpenses;
    const savingsRate = (savingsAmount / monthlyIncome) * 100;
    
    // Analyze each category
    Object.keys(expenses).forEach(category => {
        if (category === 'yearlyAdjustment') return;
        
        const amount = parseFloat(expenses[category]) || 0;
        const ratio = (amount / monthlyIncome) * 100;
        const recommended = RECOMMENDED_EXPENSE_RATIOS[category];
        
        analysis[category] = {
            amount: amount,
            ratio: ratio,
            status: ratio <= recommended.ideal ? 'good' : 
                    ratio <= recommended.max ? 'acceptable' : 'high'
        };
        
        // Generate recommendations
        if (ratio > recommended.max) {
            if (language === 'he') {
                recommendations.push({
                    category: category,
                    type: 'warning',
                    message: `הוצאות ${getCategoryNameHebrew(category)} גבוהות (${ratio.toFixed(1)}% מההכנסה). מומלץ להפחית ל-${recommended.max}% או פחות.`
                });
            } else {
                recommendations.push({
                    category: category,
                    type: 'warning',
                    message: `${category.charAt(0).toUpperCase() + category.slice(1)} expenses are high (${ratio.toFixed(1)}% of income). Consider reducing to ${recommended.max}% or less.`
                });
            }
        }
    });
    
    // Analyze savings rate
    analysis.savings = {
        amount: savingsAmount,
        ratio: savingsRate,
        status: savingsRate >= 20 ? 'excellent' : 
                savingsRate >= 10 ? 'good' : 'low'
    };
    
    if (savingsRate < 10) {
        if (language === 'he') {
            recommendations.push({
                category: 'savings',
                type: 'critical',
                message: `שיעור החיסכון נמוך (${savingsRate.toFixed(1)}%). מומלץ להגיע לפחות ל-10% חיסכון חודשי.`
            });
        } else {
            recommendations.push({
                category: 'savings',
                type: 'critical',
                message: `Savings rate is low (${savingsRate.toFixed(1)}%). Aim for at least 10% monthly savings.`
            });
        }
    }
    
    return { analysis, recommendations, savingsRate, totalExpenses };
}

/**
 * Calculate savings potential by optimizing expenses
 * @param {Object} expenses - Current expense breakdown
 * @param {number} monthlyIncome - Monthly income
 * @returns {Object} Potential savings by category
 */
function calculateSavingsPotential(expenses, monthlyIncome) {
    const potential = {};
    let totalPotentialSavings = 0;
    
    Object.keys(expenses).forEach(category => {
        if (category === 'yearlyAdjustment') return;
        
        const amount = parseFloat(expenses[category]) || 0;
        const ratio = (amount / monthlyIncome) * 100;
        const recommended = RECOMMENDED_EXPENSE_RATIOS[category];
        
        if (ratio > recommended.ideal) {
            const idealAmount = (recommended.ideal / 100) * monthlyIncome;
            const potentialSaving = amount - idealAmount;
            
            potential[category] = {
                currentAmount: amount,
                idealAmount: idealAmount,
                potentialSaving: potentialSaving,
                percentReduction: ((potentialSaving / amount) * 100).toFixed(1)
            };
            
            totalPotentialSavings += potentialSaving;
        }
    });
    
    potential.total = totalPotentialSavings;
    potential.additionalSavingsRate = (totalPotentialSavings / monthlyIncome) * 100;
    
    return potential;
}

/**
 * Get category name in Hebrew
 * @param {string} category - Category key
 * @returns {string} Hebrew category name
 */
function getCategoryNameHebrew(category) {
    const names = {
        housing: 'דיור',
        transportation: 'תחבורה',
        food: 'מזון',
        insurance: 'ביטוח ובריאות',
        other: 'אחר'
    };
    return names[category] || category;
}

/**
 * Calculate expense breakdown percentages
 * @param {Object} expenses - Expense breakdown by category
 * @returns {Object} Percentage breakdown by category
 */
function calculateExpenseBreakdown(expenses) {
    const total = calculateTotalExpenses(expenses);
    if (!total || total === 0) return {};
    
    const breakdown = {};
    
    Object.keys(expenses).forEach(category => {
        if (category === 'yearlyAdjustment') return;
        const amount = parseFloat(expenses[category]) || 0;
        breakdown[category] = (amount / total) * 100;
    });
    
    return breakdown;
}

/**
 * Generate expense summary for retirement planning
 * @param {Object} inputs - User inputs including expenses
 * @param {number} yearsToRetirement - Years until retirement
 * @returns {Object} Expense summary for retirement calculations
 */
function generateExpenseSummaryForRetirement(inputs, yearsToRetirement) {
    const currentExpenses = inputs.expenses || {};
    const yearlyAdjustment = currentExpenses.yearlyAdjustment || 2.5;
    
    // Project expenses to retirement
    const projectedExpenses = projectExpenses(currentExpenses, yearlyAdjustment, yearsToRetirement);
    const projectedTotal = calculateTotalExpenses(projectedExpenses);
    
    // Calculate current total
    const currentTotal = calculateTotalExpenses(currentExpenses);
    
    return {
        currentMonthlyExpenses: currentTotal,
        projectedMonthlyExpenses: projectedTotal,
        yearlyAdjustmentRate: yearlyAdjustment,
        categoryBreakdown: calculateExpenseBreakdown(currentExpenses),
        inflationMultiplier: Math.pow(1 + yearlyAdjustment / 100, yearsToRetirement)
    };
}

// Export functions to window for global access
window.projectExpenses = projectExpenses;
window.calculateTotalExpenses = calculateTotalExpenses;
window.generateExpenseProjections = generateExpenseProjections;
window.analyzeExpenseRatios = analyzeExpenseRatios;
window.calculateSavingsPotential = calculateSavingsPotential;
window.calculateExpenseBreakdown = calculateExpenseBreakdown;
window.generateExpenseSummaryForRetirement = generateExpenseSummaryForRetirement;
window.RECOMMENDED_EXPENSE_RATIOS = RECOMMENDED_EXPENSE_RATIOS;

console.log('✅ Expense Calculations utility loaded successfully');