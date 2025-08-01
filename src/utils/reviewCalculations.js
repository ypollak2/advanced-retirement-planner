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
    if (isNaN(pensionRate)) {
        return {
            score: 0,
            details: {
                status: 'invalid_data',
                reason: 'Invalid pension rate',
                pensionRate: 0,
                trainingFundRate: 0
            }
        };
    }
    
    let score = 0;
    let status = 'needs_improvement';
    let pensionEfficiency = 0;
    let trainingFundEfficiency = 0;
    
    // Israel-specific optimization
    if (selectedCountry === 'israel') {
        const optimalPensionRate = 7; // 7% is deductible
        const optimalTrainingFundRate = 10; // Up to threshold
        
        pensionEfficiency = optimalPensionRate > 0 ? Math.min(100, (pensionRate / optimalPensionRate) * 100) : 0;
        trainingFundEfficiency = optimalTrainingFundRate > 0 ? Math.min(100, (trainingFundRate / optimalTrainingFundRate) * 100) : 0;
        
        score = (pensionEfficiency + trainingFundEfficiency) / 2;
        score = isNaN(score) ? 0 : Math.round(score);
        
        if (score >= 80) status = 'excellent';
        else if (score >= 60) status = 'good';
        else if (score >= 40) status = 'fair';
        else status = 'poor';
    } else {
        // General tax efficiency for other countries
        score = pensionRate > 0 ? Math.min(100, (pensionRate / 12) * 100) : 0;
        score = isNaN(score) ? 0 : Math.round(score);
        status = score >= 70 ? 'good' : 'needs_improvement';
    }
    
    // Return weighted score (0-15 for 15% weight) instead of 0-100
    const weightedScore = (score / 100) * 15; // Tax efficiency has 15% weight
    
    return {
        score: weightedScore,
        details: {
            status: status,
            pensionRate: pensionRate,
            trainingFundRate: trainingFundRate,
            country: selectedCountry,
            pensionEfficiency: pensionEfficiency,
            trainingFundEfficiency: trainingFundEfficiency,
            recommendation: score < 70 ? 'Consider increasing contribution rates for better tax efficiency' : 'Good tax optimization'
        }
    };
}

/**
 * Calculate savings rate score
 */
function calculateSavingsRateScore(inputs) {
    const monthlyIncome = parseFloat(inputs.currentMonthlySalary || inputs.currentSalary || 0);
    const pensionRate = parseFloat(inputs.pensionContributionRate || inputs.employeePensionRate || 0);
    const trainingFundRate = parseFloat(inputs.trainingFundContributionRate || inputs.employeeTrainingFundRate || 0);
    
    if (monthlyIncome === 0) {
        return {
            score: 0,
            details: {
                status: 'missing_income_data',
                monthlyIncome: 0,
                monthlyContributions: 0,
                savingsRate: 0,
                reason: 'No monthly income found'
            }
        };
    }
    
    const monthlyContributions = monthlyIncome * (pensionRate + trainingFundRate) / 100;
    const savingsRate = (monthlyContributions / monthlyIncome) * 100;
    
    let score = 0;
    let status = 'critical';
    
    // Score based on savings rate benchmarks
    if (savingsRate >= 20) {
        score = 100;
        status = 'excellent';
    } else if (savingsRate >= 15) {
        score = 85;
        status = 'good';
    } else if (savingsRate >= 10) {
        score = 70;
        status = 'fair';
    } else if (savingsRate >= 5) {
        score = 50;
        status = 'poor';
    } else {
        score = Math.max(0, (savingsRate / 5) * 50);
        status = 'critical';
    }
    
    // Return weighted score (0-20 for 20% weight) instead of 0-100
    const weightedScore = (score / 100) * 20; // Savings rate has 20% weight
    
    return {
        score: weightedScore,
        details: {
            status: status,
            monthlyIncome: monthlyIncome,
            monthlyContributions: monthlyContributions,
            savingsRate: savingsRate,
            pensionRate: pensionRate,
            trainingFundRate: trainingFundRate,
            recommendation: savingsRate < 15 ? 'Aim to save at least 15% of income for retirement' : 'Maintaining good savings rate'
        }
    };
}

/**
 * Calculate retirement readiness score
 */
function calculateRetirementReadinessScore(inputs) {
    const currentAge = parseFloat(inputs.currentAge || 30);
    const currentSavings = calculateTotalCurrentSavings(inputs);
    const annualIncome = parseFloat(inputs.currentMonthlySalary || 0) * 12;
    
    if (annualIncome === 0) {
        return {
            score: 0,
            details: {
                status: 'missing_income_data',
                currentAge: currentAge,
                currentSavings: currentSavings,
                annualIncome: 0,
                targetSavings: 0,
                reason: 'No annual income found'
            }
        };
    }
    
    // Age-based savings targets (rule of thumb)
    const targetMultiplier = Math.max(0, (currentAge - 25) / 5); // 1x by 30, 2x by 35, etc.
    const targetSavings = annualIncome * targetMultiplier;
    
    let score = 0;
    let status = 'on_track';
    let ratio = 0;
    
    if (targetSavings === 0) {
        // Young age, no target yet
        score = 100;
        status = 'on_track';
    } else {
        ratio = currentSavings / targetSavings;
        
        if (ratio >= 1.5) {
            score = 100;
            status = 'excellent';
        } else if (ratio >= 1.0) {
            score = 85;
            status = 'good';
        } else if (ratio >= 0.7) {
            score = 70;
            status = 'fair';
        } else if (ratio >= 0.4) {
            score = 50;
            status = 'poor';
        } else {
            score = Math.max(0, ratio * 50);
            status = 'critical';
        }
    }
    
    // Return weighted score (0-20 for 20% weight) instead of 0-100
    const weightedScore = (score / 100) * 20; // Retirement readiness has 20% weight
    
    return {
        score: weightedScore,
        details: {
            status: status,
            currentAge: currentAge,
            currentSavings: currentSavings,
            annualIncome: annualIncome,
            targetSavings: targetSavings,
            savingsRatio: ratio,
            targetMultiplier: targetMultiplier,
            recommendation: ratio < 1.0 ? 'Consider increasing savings to meet age-based targets' : 'On track with age-based savings targets'
        }
    };
}

/**
 * Calculate diversification score
 */
function calculateSimpleDiversificationScore(inputs) {
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
function calculateSimpleRiskAlignmentScore(inputs) {
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
    
    const savingsRateResult = calculateSavingsRateScore(inputs);
    const readinessResult = calculateRetirementReadinessScore(inputs);
    const diversification = calculateSimpleDiversificationScore(inputs);
    const taxEfficiencyResult = calculateTaxEfficiencyScore(inputs);
    
    // Extract scores from objects or use directly for simple scores
    const savingsRateScore = typeof savingsRateResult === 'object' ? savingsRateResult.score : savingsRateResult;
    const readinessScore = typeof readinessResult === 'object' ? readinessResult.score : readinessResult;
    const taxEfficiencyScore = typeof taxEfficiencyResult === 'object' ? taxEfficiencyResult.score : taxEfficiencyResult;
    
    if (savingsRateScore < 70) {
        suggestions.push({
            priority: 'high',
            category: language === 'he' ? 'שיעור חיסכון' : 'Savings Rate',
            issue: language === 'he' ? 'שיעור חיסכון נמוך' : 'Low savings rate',
            action: language === 'he' ? 'העלה את שיעור ההפקדות לקרן הפנסיה' : 'Increase pension contribution rate'
        });
    }
    
    if (readinessScore < 70) {
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
    
    if (taxEfficiencyScore < 70) {
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
// Don't export these as they conflict with financialHealthEngine.js versions
// window.calculateTaxEfficiencyScore = calculateTaxEfficiencyScore;
// window.calculateSavingsRateScore = calculateSavingsRateScore;
// window.calculateRetirementReadinessScore = calculateRetirementReadinessScore;
// Export renamed functions to avoid conflicts with financialHealthEngine.js
window.calculateSimpleDiversificationScore = calculateSimpleDiversificationScore;
window.calculateSimpleRiskAlignmentScore = calculateSimpleRiskAlignmentScore;
window.calculateOverallFinancialHealthScore = calculateOverallFinancialHealthScore;
window.generateImprovementSuggestions = generateImprovementSuggestions;
window.validateReviewInputs = validateReviewInputs;

console.log('✅ Review calculations utility functions loaded successfully');