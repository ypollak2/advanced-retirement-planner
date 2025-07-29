// reviewCalculations.js - Utility functions extracted from WizardStepReview.js
// Calculation functions for review step analysis

/**
 * Calculate total current savings across all sources
 */
function calculateTotalCurrentSavings(inputs) {
    let total = 0;
    
    // Individual savings
    total += parseFloat(inputs.currentSavings || 0);
    total += parseFloat(inputs.currentTrainingFund || 0);
    total += parseFloat(inputs.currentPersonalPortfolio || 0);
    total += parseFloat(inputs.currentRealEstate || 0);
    total += parseFloat(inputs.currentCrypto || 0);
    total += parseFloat(inputs.currentSavingsAccount || 0);
    
    // Partner savings if couple mode
    if (inputs.planningType === 'couple') {
        total += parseFloat(inputs.partner1CurrentPension || 0);
        total += parseFloat(inputs.partner1CurrentTrainingFund || 0);
        total += parseFloat(inputs.partner1PersonalPortfolio || 0);
        total += parseFloat(inputs.partner1RealEstate || 0);
        total += parseFloat(inputs.partner1Crypto || 0);
        total += parseFloat(inputs.partner2CurrentPension || 0);
        total += parseFloat(inputs.partner2CurrentTrainingFund || 0);
        total += parseFloat(inputs.partner2PersonalPortfolio || 0);
        total += parseFloat(inputs.partner2RealEstate || 0);
        total += parseFloat(inputs.partner2Crypto || 0);
    }
    
    return total;
}

/**
 * Calculate tax efficiency score for specific country
 */
function calculateTaxEfficiencyScore(inputs, selectedCountry = 'israel') {
    const pensionRate = parseFloat(inputs.pensionContributionRate || 0);
    const trainingFundRate = parseFloat(inputs.trainingFundContributionRate || 0);
    
    // Validate inputs to prevent NaN
    if (isNaN(pensionRate)) return 0;
    
    // Israel-specific optimization
    if (selectedCountry === 'israel') {
        const optimalPensionRate = 7; // 7% is deductible
        const optimalTrainingFundRate = 10; // Up to threshold
        
        const pensionEfficiency = optimalPensionRate > 0 ? Math.min(100, (pensionRate / optimalPensionRate) * 100) : 0;
        const trainingFundEfficiency = optimalTrainingFundRate > 0 ? Math.min(100, (trainingFundRate / optimalTrainingFundRate) * 100) : 0;
        
        const score = (pensionEfficiency + trainingFundEfficiency) / 2;
        return isNaN(score) ? 0 : Math.round(score);
    }
    
    // General tax efficiency for other countries
    const score = pensionRate > 0 ? Math.min(100, (pensionRate / 12) * 100) : 0;
    return isNaN(score) ? 0 : Math.round(score);
}

/**
 * Calculate savings rate score
 */
function calculateSavingsRateScore(inputs) {
    const monthlyIncome = parseFloat(inputs.currentMonthlySalary || inputs.currentSalary || 0);
    const pensionRate = parseFloat(inputs.pensionContributionRate || inputs.employeePensionRate || 0);
    const trainingFundRate = parseFloat(inputs.trainingFundContributionRate || inputs.employeeTrainingFundRate || 0);
    
    if (monthlyIncome === 0) return 0;
    
    const monthlyContributions = monthlyIncome * (pensionRate + trainingFundRate) / 100;
    const savingsRate = (monthlyContributions / monthlyIncome) * 100;
    
    // Score based on savings rate benchmarks
    if (savingsRate >= 20) return 100;      // Excellent: 20%+
    if (savingsRate >= 15) return 85;       // Good: 15%+
    if (savingsRate >= 10) return 70;       // Fair: 10%+
    if (savingsRate >= 5) return 50;        // Poor: 5%+
    
    return Math.max(0, (savingsRate / 5) * 50); // Critical: <5%
}

/**
 * Calculate retirement readiness score
 */
function calculateRetirementReadinessScore(inputs) {
    const currentAge = parseFloat(inputs.currentAge || 30);
    const currentSavings = calculateTotalCurrentSavings(inputs);
    const annualIncome = parseFloat(inputs.currentMonthlySalary || 0) * 12;
    
    if (annualIncome === 0) return 0;
    
    // Age-based savings targets (rule of thumb)
    const targetMultiplier = Math.max(0, (currentAge - 25) / 5); // 1x by 30, 2x by 35, etc.
    const targetSavings = annualIncome * targetMultiplier;
    
    if (targetSavings === 0) return 100; // Young age, no target yet
    
    const ratio = currentSavings / targetSavings;
    
    if (ratio >= 1.5) return 100;        // Excellent: 150% of target
    if (ratio >= 1.0) return 85;         // Good: 100% of target
    if (ratio >= 0.7) return 70;         // Fair: 70% of target
    if (ratio >= 0.4) return 50;         // Poor: 40% of target
    
    return Math.max(0, ratio * 50);      // Critical: <40%
}

/**
 * Calculate diversification score
 */
function calculateDiversificationScore(inputs) {
    let assetClasses = 0;
    
    // Count asset classes with meaningful amounts
    if (parseFloat(inputs.currentSavings || 0) > 1000) assetClasses++;           // Pension
    if (parseFloat(inputs.currentPersonalPortfolio || 0) > 1000) assetClasses++; // Stocks/Bonds
    if (parseFloat(inputs.currentRealEstate || 0) > 1000) assetClasses++;        // Real Estate
    if (parseFloat(inputs.currentCrypto || 0) > 1000) assetClasses++;            // Crypto
    if (parseFloat(inputs.currentSavingsAccount || 0) > 1000) assetClasses++;    // Cash
    if (parseFloat(inputs.currentTrainingFund || 0) > 1000) assetClasses++;      // Training Fund
    
    // Score based on number of asset classes
    if (assetClasses >= 5) return 100;   // Excellent: 5+ classes
    if (assetClasses >= 4) return 85;    // Good: 4 classes
    if (assetClasses >= 3) return 70;    // Fair: 3 classes
    if (assetClasses >= 2) return 50;    // Poor: 2 classes
    if (assetClasses >= 1) return 25;    // Critical: 1 class
    
    return 0; // No investments
}

/**
 * Calculate risk alignment score
 */
function calculateRiskAlignmentScore(inputs) {
    const currentAge = parseFloat(inputs.currentAge || 30);
    const riskTolerance = inputs.riskTolerance || 'moderate';
    const stockPercentage = parseFloat(inputs.stockPercentage || 60);
    
    // Age-based recommended stock allocation
    const recommendedStockPercentage = Math.max(20, 100 - currentAge);
    const deviation = Math.abs(stockPercentage - recommendedStockPercentage);
    
    let alignmentScore = Math.max(0, 100 - deviation * 2);
    
    // Adjust for risk tolerance
    if (riskTolerance === 'conservative' && stockPercentage > 40) {
        alignmentScore *= 0.8;
    }
    if (riskTolerance === 'aggressive' && stockPercentage < 70) {
        alignmentScore *= 0.8;
    }
    
    return Math.round(alignmentScore);
}

/**
 * Calculate overall financial health score
 */
function calculateOverallFinancialHealthScore(inputs) {
    // Always use the comprehensive financial health engine
    // This prevents calling the local number-returning functions
    if (window.calculateFinancialHealthScore) {
        const healthReport = window.calculateFinancialHealthScore(inputs);
        return healthReport.totalScore || 0;
    }
    
    // If financial health engine is not loaded, return 0
    console.warn('Financial Health Engine not loaded - returning 0');
    return 0;
}

/**
 * Generate improvement suggestions based on scores
 */
function generateImprovementSuggestions(inputs, language = 'en') {
    const suggestions = [];
    
    const savingsRate = calculateSavingsRateScore(inputs);
    const readiness = calculateRetirementReadinessScore(inputs);
    const diversification = calculateDiversificationScore(inputs);
    const taxEfficiency = calculateTaxEfficiencyScore(inputs);
    
    if (savingsRate < 70) {
        suggestions.push({
            priority: 'high',
            category: language === 'he' ? 'שיעור חיסכון' : 'Savings Rate',
            issue: language === 'he' ? 'שיעור חיסכון נמוך' : 'Low savings rate',
            action: language === 'he' ? 'העלה את שיעור ההפקדות לקרן הפנסיה' : 'Increase pension contribution rate'
        });
    }
    
    if (readiness < 70) {
        suggestions.push({
            priority: 'high',
            category: language === 'he' ? 'מוכנות לפרישה' : 'Retirement Readiness',
            issue: language === 'he' ? 'פיגור ביחס ליעד הגיל' : 'Behind age-appropriate savings target',
            action: language === 'he' ? 'הגדל את החיסכון החודשי' : 'Increase monthly savings'
        });
    }
    
    if (diversification < 70) {
        suggestions.push({
            priority: 'medium',
            category: language === 'he' ? 'פיזור השקעות' : 'Diversification',
            issue: language === 'he' ? 'פיזור השקעות לא מספיק' : 'Insufficient investment diversification',
            action: language === 'he' ? 'הוסף סוגי נכסים נוספים' : 'Add more asset classes'
        });
    }
    
    if (taxEfficiency < 70) {
        suggestions.push({
            priority: 'medium',
            category: language === 'he' ? 'יעילות מס' : 'Tax Efficiency',
            issue: language === 'he' ? 'יעילות מס לא אופטימלית' : 'Suboptimal tax efficiency',
            action: language === 'he' ? 'מקסם הפקדות מוכרות למס' : 'Maximize tax-deductible contributions'
        });
    }
    
    return suggestions.slice(0, 5); // Top 5 suggestions
}

/**
 * Validate review step inputs
 */
function validateReviewInputs(inputs) {
    const warnings = [];
    const errors = [];
    
    // Check for basic required inputs
    if (!inputs.currentAge || inputs.currentAge < 18 || inputs.currentAge > 100) {
        errors.push('Invalid age');
    }
    
    if (!inputs.currentMonthlySalary || inputs.currentMonthlySalary <= 0) {
        errors.push('Monthly salary required');
    }
    
    if (!inputs.retirementAge || inputs.retirementAge < inputs.currentAge) {
        errors.push('Invalid retirement age');
    }
    
    // Check for missing contribution rates
    if (!inputs.pensionContributionRate) {
        warnings.push('Pension contribution rate not set');
    }
    
    if (!inputs.trainingFundContributionRate) {
        warnings.push('Training fund contribution rate not set');
    }
    
    // Check for unrealistic values
    if (inputs.pensionContributionRate > 25) {
        warnings.push('Pension contribution rate seems high');
    }
    
    return { warnings, errors };
}

// Export functions to window for global access
window.calculateTotalCurrentSavings = calculateTotalCurrentSavings;
window.calculateTaxEfficiencyScore = calculateTaxEfficiencyScore;
window.calculateSavingsRateScore = calculateSavingsRateScore;
window.calculateRetirementReadinessScore = calculateRetirementReadinessScore;
// NOTE: calculateDiversificationScore and calculateRiskAlignmentScore are NOT exported
// to avoid conflicts with the proper implementations in financialHealthEngine.js
window.calculateOverallFinancialHealthScore = calculateOverallFinancialHealthScore;
window.generateImprovementSuggestions = generateImprovementSuggestions;
window.validateReviewInputs = validateReviewInputs;

console.log('✅ Review calculations utility functions loaded successfully');