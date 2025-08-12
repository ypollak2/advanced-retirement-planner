// Financial Health Engine - Main orchestrator
// Combines all scoring components to calculate comprehensive financial health score

// Import all dependencies
const { clampValue, safeParseFloat } = window.financialHealthSafeCalcs || {};
const { SCORE_FACTORS, PEER_BENCHMARKS, SCORE_INTERPRETATION } = window.financialHealthConstants || {};
const { 
    calculateSavingsRateScore,
    calculateRetirementReadinessScore,
    calculateTimeHorizonScore,
    calculateRiskAlignmentScore
} = window.financialHealthCalculators || {};
const {
    calculateDiversificationScore,
    calculateTaxEfficiencyScore,
    calculateEmergencyFundScore,
    calculateDebtManagementScore
} = window.financialHealthAdditionalCalcs || {};

/**
 * Main function to calculate comprehensive financial health score
 * @param {Object} inputs - User financial inputs
 * @returns {Object} Complete financial health assessment
 */
function calculateFinancialHealthScore(inputs) {
    try {
        // Validate inputs first
        const validation = validateFinancialInputs(inputs);
        if (!validation.isValid) {
            console.warn('Financial Health: Invalid inputs detected', validation);
        }
        
        // Calculate individual scores
        const scoreBreakdown = {
            savingsRate: calculateSavingsRateScore(inputs),
            retirementReadiness: calculateRetirementReadinessScore(inputs),
            timeHorizon: calculateTimeHorizonScore(inputs),
            riskAlignment: calculateRiskAlignmentScore(inputs),
            diversification: calculateDiversificationScore(inputs),
            taxEfficiency: calculateTaxEfficiencyScore(inputs),
            emergencyFund: calculateEmergencyFundScore(inputs),
            debtManagement: calculateDebtManagementScore(inputs)
        };
        
        // Calculate weighted total score
        let totalScore = 0;
        let totalWeight = 0;
        const zeroScoreFactors = [];
        
        Object.entries(scoreBreakdown).forEach(([factor, result]) => {
            const weight = SCORE_FACTORS[factor]?.weight || 0;
            const score = typeof result === 'object' ? result.score : result;
            
            totalScore += score * weight;
            totalWeight += weight;
            
            // Track factors with zero scores for missing data modal
            if (score === 0) {
                zeroScoreFactors.push({
                    factor,
                    name: SCORE_FACTORS[factor]?.name || factor,
                    weight,
                    description: SCORE_FACTORS[factor]?.description || ''
                });
            }
        });
        
        // Normalize score to 0-100
        const finalScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
        
        // Get interpretation
        const interpretation = getScoreInterpretation(finalScore);
        
        // Get peer comparison
        const peerComparison = getPeerComparison(inputs, finalScore);
        
        // Generate improvement suggestions
        const suggestions = generateImprovementSuggestions(scoreBreakdown);
        
        return {
            score: finalScore,
            interpretation,
            scoreBreakdown,
            peerComparison,
            suggestions,
            validation,
            zeroScoreFactors,
            metadata: {
                calculatedAt: new Date().toISOString(),
                version: '7.5.11',
                planningType: inputs.planningType || 'single'
            }
        };
        
    } catch (error) {
        console.error('Error calculating financial health score:', error);
        return {
            score: 0,
            interpretation: { label: 'Error', color: '#ef4444', emoji: '❌' },
            error: error.message,
            scoreBreakdown: {},
            suggestions: [],
            validation: { isValid: false, errors: [error.message] }
        };
    }
}

/**
 * Get score interpretation based on final score
 */
function getScoreInterpretation(score) {
    if (score >= SCORE_INTERPRETATION.excellent.min) {
        return SCORE_INTERPRETATION.excellent;
    } else if (score >= SCORE_INTERPRETATION.good.min) {
        return SCORE_INTERPRETATION.good;
    } else if (score >= SCORE_INTERPRETATION.fair.min) {
        return SCORE_INTERPRETATION.fair;
    } else {
        return SCORE_INTERPRETATION.poor;
    }
}

/**
 * Get peer comparison based on age group
 */
function getPeerComparison(inputs, totalScore) {
    const age = safeParseFloat(inputs.currentAge || inputs.age, 30);
    
    // Determine age group
    let ageGroup = '30-39'; // default
    if (age < 30) ageGroup = '20-29';
    else if (age < 40) ageGroup = '30-39';
    else if (age < 50) ageGroup = '40-49';
    else if (age < 60) ageGroup = '50-59';
    else ageGroup = '60+';
    
    const benchmark = PEER_BENCHMARKS[ageGroup];
    const percentile = calculatePercentile(totalScore, benchmark);
    
    return {
        ageGroup,
        averageScore: benchmark.averageScore,
        topQuartileScore: benchmark.topQuartile,
        userPercentile: percentile,
        comparison: totalScore >= benchmark.topQuartile ? 'Above Top 25%' :
                   totalScore >= benchmark.averageScore ? 'Above Average' : 'Below Average'
    };
}

/**
 * Calculate percentile based on normal distribution assumption
 */
function calculatePercentile(score, benchmark) {
    // Simplified percentile calculation
    // Assumes scores are normally distributed with mean at average and top quartile at 75th percentile
    const mean = benchmark.averageScore;
    const topQuartile = benchmark.topQuartile;
    const stdDev = (topQuartile - mean) / 0.674; // 0.674 is z-score for 75th percentile
    
    if (score >= topQuartile) {
        // Linear interpolation between 75th and 99th percentile
        return Math.min(99, 75 + (score - topQuartile) / (100 - topQuartile) * 24);
    } else if (score >= mean) {
        // Linear interpolation between 50th and 75th percentile
        return 50 + (score - mean) / (topQuartile - mean) * 25;
    } else {
        // Linear interpolation between 1st and 50th percentile
        return Math.max(1, score / mean * 50);
    }
}

/**
 * Generate improvement suggestions based on scores
 */
function generateImprovementSuggestions(scoreBreakdown) {
    const suggestions = [];
    
    // Sort factors by score (lowest first) and weight
    const factors = Object.entries(scoreBreakdown)
        .map(([factor, result]) => ({
            factor,
            score: typeof result === 'object' ? result.score : result,
            weight: SCORE_FACTORS[factor]?.weight || 0,
            details: typeof result === 'object' ? result.details : null
        }))
        .sort((a, b) => {
            // Prioritize low scores with high weights
            const priorityA = (100 - a.score) * a.weight;
            const priorityB = (100 - b.score) * b.weight;
            return priorityB - priorityA;
        });
    
    // Generate suggestions for worst performing factors
    factors.slice(0, 3).forEach(({ factor, score, details }) => {
        if (score < 70) {
            suggestions.push(generateFactorSuggestion(factor, score, details));
        }
    });
    
    // Add general suggestions if doing well
    if (suggestions.length === 0) {
        suggestions.push({
            priority: 'low',
            category: 'general',
            title: 'Keep up the excellent work!',
            description: 'Your financial health is in great shape. Continue your current habits.',
            impact: 'Maintaining your current trajectory will ensure long-term financial success.'
        });
    }
    
    return suggestions;
}

/**
 * Generate specific suggestion for a factor
 */
function generateFactorSuggestion(factor, score, details) {
    const suggestions = {
        savingsRate: {
            title: 'Increase your savings rate',
            description: details?.savingsRate < 10 ? 
                'Try to save at least 10% of your income. Start by reducing discretionary expenses.' :
                'Aim for 15-20% savings rate by optimizing your budget.',
            impact: 'Each 5% increase in savings rate can reduce retirement age by 3-5 years.'
        },
        retirementReadiness: {
            title: 'Boost retirement savings',
            description: 'You\'re behind on age-appropriate savings targets. Consider increasing contributions.',
            impact: 'Catching up now will significantly improve your retirement lifestyle.'
        },
        timeHorizon: {
            title: 'Limited time to retirement',
            description: 'With limited years until retirement, maximize contributions and consider working longer.',
            impact: 'Each additional year of work can increase retirement income by 5-8%.'
        },
        emergencyFund: {
            title: 'Build emergency reserves',
            description: `You have ${details?.monthsCovered || 0} months of expenses saved. Target 6 months minimum.`,
            impact: 'Adequate emergency fund prevents retirement savings withdrawals during crises.'
        },
        debtManagement: {
            title: 'Reduce debt burden',
            description: details?.hasHighInterestDebt ? 
                'Focus on eliminating high-interest debt first.' :
                'Work on reducing overall debt to improve cash flow.',
            impact: 'Eliminating debt frees up money for retirement savings.'
        },
        taxEfficiency: {
            title: 'Optimize tax strategies',
            description: 'Maximize contributions to tax-advantaged accounts like pension and training funds.',
            impact: 'Tax savings can add 10-20% to your retirement nest egg.'
        },
        diversification: {
            title: 'Diversify investments',
            description: `You have ${details?.assetClassCount || 1} asset classes. Add more for better risk management.`,
            impact: 'Proper diversification can reduce portfolio volatility by 20-30%.'
        },
        riskAlignment: {
            title: 'Align risk with age',
            description: 'Your portfolio allocation doesn\'t match your age and risk profile.',
            impact: 'Proper alignment protects wealth while ensuring growth.'
        }
    };
    
    const suggestion = suggestions[factor] || {
        title: 'Improve ' + SCORE_FACTORS[factor]?.name,
        description: 'Focus on improving this aspect of your financial health.',
        impact: 'This will contribute to your overall financial wellbeing.'
    };
    
    return {
        priority: score < 25 ? 'high' : score < 50 ? 'medium' : 'low',
        category: factor,
        ...suggestion
    };
}

/**
 * Validate financial inputs
 */
function validateFinancialInputs(inputs) {
    const errors = [];
    const warnings = [];
    const criticalMissing = [];
    
    // Check critical fields
    if (!inputs.currentAge && !inputs.age) {
        criticalMissing.push('Current age is required');
    }
    
    if (!inputs.currentMonthlySalary && !inputs.monthlySalary && 
        !inputs.partner1Salary && !inputs.partner2Salary) {
        criticalMissing.push('Monthly income is required');
    }
    
    // Check for negative values
    const numericFields = [
        'currentAge', 'retirementAge', 'currentMonthlySalary', 
        'currentMonthlyExpenses', 'currentPensionSavings'
    ];
    
    numericFields.forEach(field => {
        const value = inputs[field];
        if (value !== undefined && value !== null && value < 0) {
            errors.push(`${field} cannot be negative`);
        }
    });
    
    // Check logical consistency
    const currentAge = safeParseFloat(inputs.currentAge || inputs.age, 0);
    const retirementAge = safeParseFloat(inputs.retirementAge, 67);
    
    if (currentAge > 0 && retirementAge > 0 && currentAge >= retirementAge) {
        warnings.push('Current age is greater than or equal to retirement age');
    }
    
    // Check data completeness
    const optionalFields = [
        'emergencyFund', 'personalPortfolio', 'currentTrainingFund',
        'equityPercentage', 'bondPercentage'
    ];
    
    let filledOptional = 0;
    optionalFields.forEach(field => {
        if (inputs[field] !== undefined && inputs[field] !== null && inputs[field] !== '') {
            filledOptional++;
        }
    });
    
    const completenessPercentage = Math.round((filledOptional / optionalFields.length) * 100);
    
    return {
        isValid: errors.length === 0 && criticalMissing.length === 0,
        errors,
        warnings,
        criticalMissing,
        recommendations: warnings.length > 0 ? 
            ['Review and correct any warnings for more accurate results'] : [],
        summary: {
            errorCount: errors.length,
            warningCount: warnings.length,
            hasRequiredFields: criticalMissing.length === 0,
            hasCompleteData: warnings.length === 0,
            dataCompleteness: completenessPercentage,
            validationLevel: errors.length === 0 ? 
                (warnings.length === 0 ? 'complete' : 'partial') : 'invalid'
        }
    };
}

// Export main function and utilities
window.calculateFinancialHealthScore = calculateFinancialHealthScore;
window.generateImprovementSuggestions = generateImprovementSuggestions;
window.getPeerComparison = getPeerComparison;
window.validateFinancialInputs = validateFinancialInputs;

// Export the complete engine
window.financialHealthEngine = {
    calculateFinancialHealthScore,
    generateImprovementSuggestions,
    getPeerComparison,
    validateFinancialInputs,
    // Re-export individual calculators for backward compatibility
    calculateSavingsRateScore,
    calculateRetirementReadinessScore,
    calculateTimeHorizonScore,
    calculateRiskAlignmentScore,
    calculateDiversificationScore,
    calculateTaxEfficiencyScore,
    calculateEmergencyFundScore,
    calculateDebtManagementScore,
    // Re-export utilities
    getFieldValue: window.getFieldValue
};

console.log('✅ Financial Health Engine (Main) loaded');