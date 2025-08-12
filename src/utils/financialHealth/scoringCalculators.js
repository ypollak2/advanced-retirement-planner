// Individual Scoring Calculators for Financial Health Engine
// Each calculator handles a specific aspect of financial health scoring

// Import dependencies
const { safeParseFloat, safeDivide, safePercentage, clampValue, enhancedSafeCalculation } = 
    window.financialHealthSafeCalcs || {};
const { getFieldValue } = window.financialHealthFieldMapper || {};
const { SCORE_FACTORS, AGE_BASED_TARGETS, RISK_PROFILES, ASSET_CLASSES, DEBT_CATEGORIES, COUNTRY_FACTORS } = 
    window.financialHealthConstants || {};

/**
 * Calculate savings rate score
 */
function calculateSavingsRateScore(inputs) {
    return enhancedSafeCalculation('SavingsRateScore', () => {
        // Get monthly income with partner combination
        const monthlyIncome = getFieldValue(inputs, 
            ['currentMonthlySalary', 'monthlySalary', 'monthlyIncome', 'currentSalary'], 
            { 
                combinePartners: true, 
                phase: 2,
                calculationContext: 'savings_rate_income' 
            }
        );
        
        // Get monthly expenses with partner combination
        const monthlyExpenses = getFieldValue(inputs, 
            ['currentMonthlyExpenses', 'monthlyExpenses', 'expenses'], 
            { 
                combinePartners: true, 
                phase: 2,
                calculationContext: 'savings_rate_expenses' 
            }
        );
        
        // Calculate savings amount and rate
        const monthlySavings = monthlyIncome - monthlyExpenses;
        const savingsRateResult = safePercentage(monthlySavings, monthlyIncome, 0, 'savings_rate');
        const savingsRate = savingsRateResult.value;
        
        // Get benchmarks
        const benchmarks = SCORE_FACTORS.savingsRate.benchmarks;
        
        // Calculate score based on savings rate
        let score = 0;
        let status = 'poor';
        
        if (savingsRate >= benchmarks.excellent) {
            score = 100;
            status = 'excellent';
        } else if (savingsRate >= benchmarks.good) {
            score = 75 + (savingsRate - benchmarks.good) / (benchmarks.excellent - benchmarks.good) * 25;
            status = 'good';
        } else if (savingsRate >= benchmarks.fair) {
            score = 50 + (savingsRate - benchmarks.fair) / (benchmarks.good - benchmarks.fair) * 25;
            status = 'fair';
        } else if (savingsRate >= benchmarks.poor) {
            score = 25 + (savingsRate - benchmarks.poor) / (benchmarks.fair - benchmarks.poor) * 25;
            status = 'poor';
        } else if (savingsRate > 0) {
            score = savingsRate / benchmarks.poor * 25;
            status = 'poor';
        }
        
        // Bonus for very high savings rates
        if (savingsRate > 30) {
            score = Math.min(100, score + 5);
        }
        
        return {
            score: clampValue(score, 0, 100),
            details: {
                monthlyIncome,
                monthlyExpenses,
                monthlySavings,
                savingsRate: Math.round(savingsRate * 10) / 10,
                status,
                recommendation: getSavingsRateRecommendation(savingsRate, benchmarks)
            }
        };
    });
}

/**
 * Calculate retirement readiness score
 */
function calculateRetirementReadinessScore(inputs) {
    return enhancedSafeCalculation('RetirementReadinessScore', () => {
        // Get current age
        const currentAge = safeParseFloat(inputs.currentAge || inputs.age, 30);
        
        // Get annual income with partner combination
        const monthlyIncome = getFieldValue(inputs, 
            ['currentMonthlySalary', 'monthlySalary', 'monthlyIncome'], 
            { 
                combinePartners: true, 
                phase: 2,
                calculationContext: 'retirement_readiness_income' 
            }
        );
        const annualIncome = monthlyIncome * 12;
        
        // Get total current savings with partner combination
        const currentPension = getFieldValue(inputs, 
            ['currentPensionSavings', 'pensionSavings', 'currentPension'], 
            { 
                combinePartners: true, 
                allowZero: true,
                calculationContext: 'retirement_readiness_pension' 
            }
        );
        
        const currentTraining = getFieldValue(inputs, 
            ['currentTrainingFund', 'trainingFund', 'currentTraining'], 
            { 
                combinePartners: true, 
                allowZero: true,
                calculationContext: 'retirement_readiness_training' 
            }
        );
        
        const personalPortfolio = getFieldValue(inputs, 
            ['personalPortfolio', 'currentPortfolio', 'portfolio'], 
            { 
                combinePartners: true, 
                allowZero: true,
                calculationContext: 'retirement_readiness_portfolio' 
            }
        );
        
        const totalSavings = currentPension + currentTraining + personalPortfolio;
        
        // Get age-based target
        const ageTarget = getAgeBasedTarget(currentAge);
        const targetSavings = annualIncome * ageTarget.target;
        
        // Calculate readiness ratio
        const readinessRatioResult = safeDivide(totalSavings, targetSavings, 0, 'retirement_readiness_ratio');
        const readinessRatio = readinessRatioResult.value;
        
        // Get benchmarks
        const benchmarks = SCORE_FACTORS.retirementReadiness.benchmarks;
        
        // Calculate score
        let score = 0;
        let status = 'poor';
        
        if (readinessRatio >= benchmarks.excellent) {
            score = 100;
            status = 'excellent';
        } else if (readinessRatio >= benchmarks.good) {
            score = 75 + (readinessRatio - benchmarks.good) / (benchmarks.excellent - benchmarks.good) * 25;
            status = 'good';
        } else if (readinessRatio >= benchmarks.fair) {
            score = 50 + (readinessRatio - benchmarks.fair) / (benchmarks.good - benchmarks.fair) * 25;
            status = 'fair';
        } else if (readinessRatio >= benchmarks.poor) {
            score = 25 + (readinessRatio - benchmarks.poor) / (benchmarks.fair - benchmarks.poor) * 25;
            status = 'poor';
        } else if (readinessRatio > 0) {
            score = readinessRatio / benchmarks.poor * 25;
            status = 'poor';
        }
        
        // Age adjustment - younger people get slight bonus
        if (currentAge < 35) {
            score = Math.min(100, score + 5);
        }
        
        return {
            score: clampValue(score, 0, 100),
            details: {
                currentAge,
                annualIncome,
                totalSavings,
                targetSavings,
                readinessRatio: Math.round(readinessRatio * 100) / 100,
                ageTarget: ageTarget.label,
                status,
                breakdown: {
                    pension: currentPension,
                    trainingFund: currentTraining,
                    portfolio: personalPortfolio
                }
            }
        };
    });
}

/**
 * Calculate time horizon score
 */
function calculateTimeHorizonScore(inputs) {
    return enhancedSafeCalculation('TimeHorizonScore', () => {
        const currentAge = safeParseFloat(inputs.currentAge || inputs.age, 30);
        const retirementAge = safeParseFloat(inputs.retirementAge || inputs.targetRetirementAge, 67);
        
        const yearsToRetirement = Math.max(0, retirementAge - currentAge);
        
        // Get benchmarks
        const benchmarks = SCORE_FACTORS.timeHorizon.benchmarks;
        
        // Calculate score
        let score = 0;
        let status = 'poor';
        
        if (yearsToRetirement >= benchmarks.excellent) {
            score = 100;
            status = 'excellent';
        } else if (yearsToRetirement >= benchmarks.good) {
            score = 75 + (yearsToRetirement - benchmarks.good) / (benchmarks.excellent - benchmarks.good) * 25;
            status = 'good';
        } else if (yearsToRetirement >= benchmarks.fair) {
            score = 50 + (yearsToRetirement - benchmarks.fair) / (benchmarks.good - benchmarks.fair) * 25;
            status = 'fair';
        } else if (yearsToRetirement >= benchmarks.poor) {
            score = 25 + (yearsToRetirement - benchmarks.poor) / (benchmarks.fair - benchmarks.poor) * 25;
            status = 'poor';
        } else if (yearsToRetirement > 0) {
            score = yearsToRetirement / benchmarks.poor * 25;
            status = 'poor';
        }
        
        return {
            score: clampValue(score, 0, 100),
            details: {
                currentAge,
                retirementAge,
                yearsToRetirement,
                status,
                urgency: yearsToRetirement < 10 ? 'high' : yearsToRetirement < 20 ? 'medium' : 'low'
            }
        };
    });
}

/**
 * Calculate risk alignment score
 */
function calculateRiskAlignmentScore(inputs) {
    return enhancedSafeCalculation('RiskAlignmentScore', () => {
        const currentAge = safeParseFloat(inputs.currentAge || inputs.age, 30);
        const riskProfile = inputs.riskProfile || inputs.investmentRiskProfile || 'moderate';
        
        // Get actual portfolio allocation with partner combination
        const equityPercentage = getFieldValue(inputs, 
            ['equityPercentage', 'stocksPercentage', 'equityAllocation'], 
            { 
                defaultValue: 60,
                calculationContext: 'risk_alignment_equity' 
            }
        );
        
        const bondPercentage = getFieldValue(inputs, 
            ['bondPercentage', 'bondsPercentage', 'bondAllocation'], 
            { 
                defaultValue: 40,
                calculationContext: 'risk_alignment_bonds' 
            }
        );
        
        // Get recommended allocation based on age and risk profile
        const recommendedAllocation = getRecommendedAllocation(currentAge, riskProfile);
        
        // Calculate alignment score
        const equityDiff = Math.abs(equityPercentage - recommendedAllocation.equity);
        const bondDiff = Math.abs(bondPercentage - recommendedAllocation.bonds);
        const totalDiff = (equityDiff + bondDiff) / 2;
        
        // Convert difference to score (0 diff = 100 score, 50 diff = 0 score)
        const alignmentScore = Math.max(0, 100 - totalDiff * 2);
        
        // Get benchmarks
        const benchmarks = SCORE_FACTORS.riskAlignment.benchmarks;
        
        // Determine status
        let status = 'poor';
        if (alignmentScore >= benchmarks.excellent) status = 'excellent';
        else if (alignmentScore >= benchmarks.good) status = 'good';
        else if (alignmentScore >= benchmarks.fair) status = 'fair';
        
        return {
            score: clampValue(alignmentScore, 0, 100),
            details: {
                currentAge,
                riskProfile,
                actualAllocation: {
                    equity: equityPercentage,
                    bonds: bondPercentage
                },
                recommendedAllocation,
                alignmentDifference: totalDiff,
                status
            }
        };
    });
}

// Helper functions
function getSavingsRateRecommendation(rate, benchmarks) {
    if (rate >= benchmarks.excellent) {
        return 'Excellent savings rate! Keep up the great work.';
    } else if (rate >= benchmarks.good) {
        return 'Good savings rate. Consider increasing to reach excellent status.';
    } else if (rate >= benchmarks.fair) {
        return 'Fair savings rate. Try to increase savings by reducing expenses.';
    } else {
        return 'Low savings rate. Focus on budgeting and expense reduction.';
    }
}

function getAgeBasedTarget(age) {
    // Find the appropriate target based on age
    const ages = Object.keys(AGE_BASED_TARGETS).map(Number).sort((a, b) => a - b);
    
    for (let i = ages.length - 1; i >= 0; i--) {
        if (age >= ages[i]) {
            return AGE_BASED_TARGETS[ages[i]];
        }
    }
    
    // Default for very young savers
    return { target: 0.25, label: '0.25x annual income' };
}

function getRecommendedAllocation(age, riskProfile) {
    // Basic age-based allocation rule
    const baseEquity = Math.max(20, 100 - age);
    
    // Adjust based on risk profile
    const profiles = RISK_PROFILES;
    const profile = profiles[riskProfile] || profiles.moderate;
    
    // Ensure allocation is within profile bounds
    const equity = clampValue(baseEquity, profile.equityRange.min, profile.equityRange.max);
    const bonds = Math.min(100 - equity, profile.bondRange.max);
    
    return {
        equity,
        bonds,
        other: 100 - equity - bonds
    };
}

// Export all calculators
window.financialHealthCalculators = {
    calculateSavingsRateScore,
    calculateRetirementReadinessScore,
    calculateTimeHorizonScore,
    calculateRiskAlignmentScore
};

// Export directly for backward compatibility
window.calculateSavingsRateScore = calculateSavingsRateScore;
window.calculateRetirementReadinessScore = calculateRetirementReadinessScore;
window.calculateTimeHorizonScore = calculateTimeHorizonScore;
window.calculateRiskAlignmentScore = calculateRiskAlignmentScore;

console.log('✅ Financial Health Scoring Calculators loaded');