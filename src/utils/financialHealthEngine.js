// Financial Health Engine - Unified scoring system with detailed breakdowns
// Created by Yali Pollak (יהלי פולק) - v6.6.3

/**
 * Comprehensive Financial Health Scoring Engine
 * Provides detailed breakdowns, actionable insights, and peer comparisons
 */

// Enhanced field mapping utility with common variations
function getFieldValue(inputs, fieldNames) {
    for (const fieldName of fieldNames) {
        const value = inputs[fieldName];
        if (value !== undefined && value !== null && value !== '') {
            const parsed = parseFloat(value);
            if (!isNaN(parsed)) {
                return parsed;
            }
        }
    }
    return 0;
}

// Score factor definitions with weights and benchmarks
const SCORE_FACTORS = {
    savingsRate: {
        weight: 25,
        name: 'Savings Rate',
        description: 'Percentage of income saved monthly',
        benchmarks: {
            excellent: 20,  // 20%+ savings rate
            good: 15,       // 15%+ savings rate  
            fair: 10,       // 10%+ savings rate
            poor: 5         // 5%+ savings rate
        }
    },
    retirementReadiness: {
        weight: 20,
        name: 'Retirement Readiness',
        description: 'Current savings vs age-appropriate targets',
        benchmarks: {
            excellent: 1.5,  // 1.5x target savings
            good: 1.0,       // 1.0x target savings
            fair: 0.7,       // 0.7x target savings
            poor: 0.4        // 0.4x target savings
        }
    },
    timeHorizon: {
        weight: 15,
        name: 'Time to Retirement',
        description: 'Years remaining until retirement',
        benchmarks: {
            excellent: 30,   // 30+ years
            good: 20,        // 20+ years
            fair: 10,        // 10+ years
            poor: 5          // 5+ years
        }
    },
    riskAlignment: {
        weight: 12,
        name: 'Risk Alignment',
        description: 'Investment allocation matches age and goals',
        benchmarks: {
            excellent: 95,   // 95%+ alignment score
            good: 85,        // 85%+ alignment score
            fair: 70,        // 70%+ alignment score
            poor: 50         // 50%+ alignment score
        }
    },
    diversification: {
        weight: 10,
        name: 'Portfolio Diversification',
        description: 'Spread across multiple asset classes',
        benchmarks: {
            excellent: 4,    // 4+ asset classes
            good: 3,         // 3+ asset classes
            fair: 2,         // 2+ asset classes
            poor: 1          // 1+ asset class
        }
    },
    taxEfficiency: {
        weight: 8,
        name: 'Tax Optimization',
        description: 'Effective use of tax-advantaged accounts',
        benchmarks: {
            excellent: 90,   // 90%+ tax efficiency
            good: 75,        // 75%+ tax efficiency
            fair: 60,        // 60%+ tax efficiency
            poor: 40         // 40%+ tax efficiency
        }
    },
    emergencyFund: {
        weight: 7,
        name: 'Emergency Fund',
        description: 'Months of expenses covered',
        benchmarks: {
            excellent: 8,    // 8+ months
            good: 6,         // 6+ months
            fair: 3,         // 3+ months
            poor: 1          // 1+ month
        }
    },
    debtManagement: {
        weight: 3,
        name: 'Debt Management',
        description: 'Debt-to-income ratio and high-interest debt',
        benchmarks: {
            excellent: 0.1,  // <10% debt-to-income
            good: 0.2,       // <20% debt-to-income
            fair: 0.3,       // <30% debt-to-income
            poor: 0.5        // <50% debt-to-income
        }
    }
};

// Age-based peer comparison data
const PEER_BENCHMARKS = {
    '20-29': { averageScore: 45, topQuartile: 65 },
    '30-39': { averageScore: 55, topQuartile: 75 },
    '40-49': { averageScore: 65, topQuartile: 80 },
    '50-59': { averageScore: 70, topQuartile: 85 },
    '60+': { averageScore: 75, topQuartile: 90 }
};

// Country-specific adjustments
const COUNTRY_FACTORS = {
    'ISR': { socialSecurityWeight: 0.8, taxAdvantageBonus: 5 },
    'USA': { socialSecurityWeight: 0.6, taxAdvantageBonus: 8 },
    'GBR': { socialSecurityWeight: 0.5, taxAdvantageBonus: 6 },
    'EUR': { socialSecurityWeight: 0.7, taxAdvantageBonus: 4 }
};

/**
 * Calculate savings rate score
 */
function calculateSavingsRateScore(inputs) {
    // CRITICAL FIX: Use actual field names from wizard
    let monthlyIncome = 0;
    
    // Calculate total monthly income based on planning type
    if (inputs.planningType === 'couple') {
        // For couples, sum both partner salaries
        const partner1Income = parseFloat(inputs.partner1Salary || 0);
        const partner2Income = parseFloat(inputs.partner2Salary || 0);
        monthlyIncome = partner1Income + partner2Income;
    } else {
        // For individuals, use current monthly salary
        monthlyIncome = parseFloat(inputs.currentMonthlySalary || 0);
    }
    
    // Calculate monthly contributions from pension/training fund rates
    let monthlyContributions = 0;
    
    // CRITICAL FIX: Use correct field names from wizard
    const pensionRate = parseFloat(inputs.pensionContributionRate || 0);
    const trainingFundRate = parseFloat(inputs.trainingFundContributionRate || 0);
    
    console.log('💰 Savings Rate Debug:', {
        monthlyIncome,
        pensionRate,
        trainingFundRate,
        planningType: inputs.planningType,
        partner1Salary: inputs.partner1Salary,
        partner2Salary: inputs.partner2Salary,
        currentMonthlySalary: inputs.currentMonthlySalary
    });
    
    if (monthlyIncome > 0 && (pensionRate > 0 || trainingFundRate > 0)) {
        // Calculate contributions as percentage of salary
        monthlyContributions = monthlyIncome * (pensionRate + trainingFundRate) / 100;
        
        // Add additional monthly savings if available
        const additionalSavings = parseFloat(inputs.additionalMonthlySavings || 0);
        monthlyContributions += additionalSavings;
    } else {
        // Fallback: try to get direct monthly contribution amount
        monthlyContributions = parseFloat(inputs.monthlyContribution || 0);
    }
    
    // Add null/zero validation with enhanced debugging
    if (monthlyIncome === 0 || isNaN(monthlyIncome)) {
        const missingFields = [];
        if (inputs.planningType === 'couple') {
            if (!inputs.partner1Salary) missingFields.push('partner1Salary');
            if (!inputs.partner2Salary) missingFields.push('partner2Salary');
        } else {
            if (!inputs.currentMonthlySalary) missingFields.push('currentMonthlySalary');
        }
        
        return { 
            score: 0, 
            details: { 
                rate: 0, 
                status: 'missing_income_data', 
                monthlyAmount: 0,
                debugInfo: {
                    reason: 'No monthly income found',
                    missingFields: missingFields,
                    planningType: inputs.planningType,
                    fieldsFound: {
                        currentMonthlySalary: !!inputs.currentMonthlySalary,
                        partner1Salary: !!inputs.partner1Salary,
                        partner2Salary: !!inputs.partner2Salary
                    },
                    suggestion: inputs.planningType === 'couple' ? 
                        'Add partner salary information in Step 2' : 
                        'Add monthly salary information in Step 2'
                }
            } 
        };
    }
    
    // Check if contribution rates are missing
    if (monthlyContributions === 0 && pensionRate === 0 && trainingFundRate === 0) {
        return {
            score: 0,
            details: {
                rate: 0,
                status: 'missing_contribution_data',
                monthlyAmount: 0,
                monthlyIncome: monthlyIncome,
                debugInfo: {
                    reason: 'No contribution rates found',
                    missingFields: ['pensionContributionRate', 'trainingFundContributionRate'],
                    fieldsFound: {
                        pensionContributionRate: !!inputs.pensionContributionRate,
                        trainingFundContributionRate: !!inputs.trainingFundContributionRate
                    },
                    suggestion: 'Add contribution rates in Step 4 - Contributions'
                }
            }
        };
    }
    
    // CRITICAL FIX: Add NaN prevention for division
    const savingsRate = (monthlyIncome > 0) ? (monthlyContributions / monthlyIncome) * 100 : 0;
    
    // Validate savingsRate is a finite number
    const validSavingsRate = (isNaN(savingsRate) || !isFinite(savingsRate)) ? 0 : savingsRate;
    
    const maxScore = SCORE_FACTORS.savingsRate.weight;
    
    let score = 0;
    let status = 'poor';
    
    if (validSavingsRate >= SCORE_FACTORS.savingsRate.benchmarks.excellent) {
        score = maxScore;
        status = 'excellent';
    } else if (validSavingsRate >= SCORE_FACTORS.savingsRate.benchmarks.good) {
        score = maxScore * 0.85;
        status = 'good';
    } else if (validSavingsRate >= SCORE_FACTORS.savingsRate.benchmarks.fair) {
        score = maxScore * 0.70;
        status = 'fair';
    } else if (validSavingsRate >= SCORE_FACTORS.savingsRate.benchmarks.poor) {
        score = maxScore * 0.50;
        status = 'poor';
    } else {
        score = Math.max(0, (validSavingsRate / SCORE_FACTORS.savingsRate.benchmarks.poor) * maxScore * 0.50);
        status = 'critical';
    }
    
    // Ensure final score is valid
    score = (isNaN(score) || !isFinite(score)) ? 0 : score;
    
    return {
        score: Math.round(score),
        details: {
            rate: validSavingsRate,
            monthlyAmount: monthlyContributions,
            monthlyIncome: monthlyIncome,
            status: status,
            target: SCORE_FACTORS.savingsRate.benchmarks.good,
            improvement: Math.max(0, (SCORE_FACTORS.savingsRate.benchmarks.good - validSavingsRate) * monthlyIncome / 100),
            calculationMethod: monthlyContributions > 0 ? 
                (inputs.monthlyContribution ? 'direct' : 'calculated_from_rates') : 'no_contributions',
            debugInfo: {
                monthlyIncomeFound: monthlyIncome > 0,
                contributionsFound: monthlyContributions > 0,
                fieldsUsed: {
                    income: monthlyIncome > 0 ? 'found' : 'missing',
                    contributions: monthlyContributions > 0 ? 'found' : 'missing'
                }
            }
        }
    };
}

/**
 * Calculate retirement readiness score
 */
function calculateRetirementReadinessScore(inputs) {
    const currentAge = parseFloat(inputs.currentAge || 30);
    const annualIncome = parseFloat(inputs.currentMonthlySalary || 0) * 12;
    const currentSavings = window.calculateTotalCurrentSavings ? 
        window.calculateTotalCurrentSavings(inputs) : 
        parseFloat(inputs.currentSavings || 0);
    
    if (annualIncome === 0) return { score: 0, details: { ratio: 0, status: 'unknown' } };
    
    // Age-based savings targets (rule of thumb: 1x by 30, 3x by 40, etc.)
    const targetMultiplier = Math.max(1, (currentAge - 20) / 10);
    const targetSavings = annualIncome * targetMultiplier;
    const savingsRatio = currentSavings / targetSavings;
    
    const maxScore = SCORE_FACTORS.retirementReadiness.weight;
    let score = 0;
    let status = 'poor';
    
    if (savingsRatio >= SCORE_FACTORS.retirementReadiness.benchmarks.excellent) {
        score = maxScore;
        status = 'excellent';
    } else if (savingsRatio >= SCORE_FACTORS.retirementReadiness.benchmarks.good) {
        score = maxScore * 0.85;
        status = 'good';
    } else if (savingsRatio >= SCORE_FACTORS.retirementReadiness.benchmarks.fair) {
        score = maxScore * 0.70;
        status = 'fair';
    } else if (savingsRatio >= SCORE_FACTORS.retirementReadiness.benchmarks.poor) {
        score = maxScore * 0.50;
        status = 'poor';
    } else {
        score = Math.max(0, savingsRatio * maxScore * 0.50);
        status = 'critical';
    }
    
    return {
        score: Math.round(score),
        details: {
            ratio: savingsRatio,
            currentSavings: currentSavings,
            targetSavings: targetSavings,
            gap: Math.max(0, targetSavings - currentSavings),
            status: status
        }
    };
}

/**
 * Calculate time horizon score
 */
function calculateTimeHorizonScore(inputs) {
    const currentAge = parseFloat(inputs.currentAge || 30);
    const retirementAge = parseFloat(inputs.retirementAge || 67);
    const yearsToRetirement = Math.max(0, retirementAge - currentAge);
    
    const maxScore = SCORE_FACTORS.timeHorizon.weight;
    let score = 0;
    let status = 'poor';
    
    if (yearsToRetirement >= SCORE_FACTORS.timeHorizon.benchmarks.excellent) {
        score = maxScore;
        status = 'excellent';
    } else if (yearsToRetirement >= SCORE_FACTORS.timeHorizon.benchmarks.good) {
        score = maxScore * 0.85;
        status = 'good';
    } else if (yearsToRetirement >= SCORE_FACTORS.timeHorizon.benchmarks.fair) {
        score = maxScore * 0.70;
        status = 'fair';
    } else if (yearsToRetirement >= SCORE_FACTORS.timeHorizon.benchmarks.poor) {
        score = maxScore * 0.50;
        status = 'poor';
    } else {
        score = Math.max(0, (yearsToRetirement / SCORE_FACTORS.timeHorizon.benchmarks.poor) * maxScore * 0.50);
        status = 'critical';
    }
    
    return {
        score: Math.round(score),
        details: {
            yearsToRetirement: yearsToRetirement,
            status: status
        }
    };
}

/**
 * Calculate risk alignment score
 */
function calculateRiskAlignmentScore(inputs) {
    try {
        // Validate inputs exist
        if (!inputs || typeof inputs !== 'object') {
            console.warn('calculateRiskAlignmentScore: Invalid inputs provided');
            return { score: 0, details: { status: 'no_data', message: 'Invalid inputs' } };
        }
        
        const currentAge = parseFloat(inputs.currentAge || 30);
        const riskTolerance = inputs.riskTolerance || 'moderate';
        
        // Check if portfolio allocations exist for better stock percentage calculation
        let stockPercentage = 0;
        if (inputs.portfolioAllocations && Array.isArray(inputs.portfolioAllocations)) {
            // Calculate stock percentage from portfolio allocations
            const stockAllocation = inputs.portfolioAllocations.find(a => 
                a && a.index && (a.index.toLowerCase().includes('stock') || a.index.toLowerCase().includes('equity'))
            );
            stockPercentage = stockAllocation ? parseFloat(stockAllocation.percentage || 0) : 0;
        } else {
            // Fallback to direct field
            stockPercentage = parseFloat(inputs.stockPercentage || 60);
        }
        
        // If no allocation data available, return minimal score
        if (stockPercentage === 0 && !inputs.portfolioAllocations && !inputs.stockPercentage) {
            return { 
                score: 0, 
                details: { 
                    status: 'no_data', 
                    message: 'No portfolio allocation data available',
                    stockPercentage: 0,
                    recommendedPercentage: Math.max(20, 100 - currentAge)
                } 
            };
        }
        
        // Age-based recommended stock allocation: 100 - age, with min 20%
        const recommendedStockPercentage = Math.max(20, 100 - currentAge);
        const deviation = Math.abs(stockPercentage - recommendedStockPercentage);
        
        let alignmentScore = Math.max(0, 100 - deviation * 2);
        
        // Adjust for risk tolerance
        if (riskTolerance === 'conservative' && stockPercentage > 40) alignmentScore *= 0.8;
        if (riskTolerance === 'aggressive' && stockPercentage < 70) alignmentScore *= 0.8;
        
        const maxScore = SCORE_FACTORS.riskAlignment.weight;
        const score = (alignmentScore / 100) * maxScore;
        
        let status = 'poor';
        if (alignmentScore >= 95) status = 'excellent';
        else if (alignmentScore >= 85) status = 'good';
        else if (alignmentScore >= 70) status = 'fair';
        else if (alignmentScore >= 50) status = 'poor';
        else status = 'critical';
        
        // Ensure score is valid
        const finalScore = isNaN(score) || !isFinite(score) ? 0 : Math.round(score);
        
        return {
            score: finalScore,
            details: {
                stockPercentage: stockPercentage,
                recommendedPercentage: recommendedStockPercentage,
                deviation: deviation,
                alignmentScore: alignmentScore,
                status: status,
                dataSource: inputs.portfolioAllocations ? 'portfolio_allocations' : 'direct_field'
            }
        };
    } catch (error) {
        console.error('calculateRiskAlignmentScore: Error during calculation', error);
        return { score: 0, details: { status: 'error', message: error.message } };
    }
}

/**
 * Calculate diversification score
 */
function calculateDiversificationScore(inputs) {
    try {
        // Validate inputs
        if (!inputs || typeof inputs !== 'object') {
            console.warn('calculateDiversificationScore: Invalid inputs provided');
            return { score: 0, details: { status: 'no_data', assetClasses: 0 } };
        }
        
        let assetClasses = 0;
        const assetDetails = [];
        
        // Check each asset class with proper validation
        const pensionAmount = parseFloat(inputs.currentSavings || 0);
        if (pensionAmount > 0) {
            assetClasses++;
            assetDetails.push({ type: 'Pension', amount: pensionAmount });
        }
        
        const portfolioAmount = parseFloat(inputs.currentPersonalPortfolio || 0);
        if (portfolioAmount > 0) {
            assetClasses++;
            assetDetails.push({ type: 'Stocks/Bonds', amount: portfolioAmount });
        }
        
        const realEstateAmount = parseFloat(inputs.currentRealEstate || 0);
        if (realEstateAmount > 0) {
            assetClasses++;
            assetDetails.push({ type: 'Real Estate', amount: realEstateAmount });
        }
        
        const cryptoAmount = parseFloat(inputs.currentCryptoFiatValue || inputs.currentCrypto || 0);
        if (cryptoAmount > 0) {
            assetClasses++;
            assetDetails.push({ type: 'Crypto', amount: cryptoAmount });
        }
        
        const cashAmount = parseFloat(inputs.currentSavingsAccount || inputs.emergencyFund || 0);
        if (cashAmount > 0) {
            assetClasses++;
            assetDetails.push({ type: 'Cash/Savings', amount: cashAmount });
        }
        
        const trainingFundAmount = parseFloat(inputs.currentTrainingFund || 0);
        if (trainingFundAmount > 0) {
            assetClasses++;
            assetDetails.push({ type: 'Training Fund', amount: trainingFundAmount });
        }
        
        const maxScore = SCORE_FACTORS.diversification.weight;
        let score = 0;
        let status = 'poor';
        
        if (assetClasses >= SCORE_FACTORS.diversification.benchmarks.excellent) {
            score = maxScore;
            status = 'excellent';
        } else if (assetClasses >= SCORE_FACTORS.diversification.benchmarks.good) {
            score = maxScore * 0.85;
            status = 'good';
        } else if (assetClasses >= SCORE_FACTORS.diversification.benchmarks.fair) {
            score = maxScore * 0.70;
            status = 'fair';
        } else if (assetClasses >= SCORE_FACTORS.diversification.benchmarks.poor) {
            score = maxScore * 0.50;
            status = 'poor';
        } else {
            score = 0;
            status = 'critical';
        }
        
        // Ensure score is valid
        const finalScore = isNaN(score) || !isFinite(score) ? 0 : Math.round(score);
        
        return {
            score: finalScore,
            details: {
                assetClasses: assetClasses,
                status: status,
                missingClasses: Math.max(0, SCORE_FACTORS.diversification.benchmarks.good - assetClasses),
                assets: assetDetails
            }
        };
    } catch (error) {
        console.error('calculateDiversificationScore: Error during calculation', error);
        return { score: 0, details: { status: 'error', message: error.message, assetClasses: 0 } };
    }
}

/**
 * Calculate tax efficiency score
 */
function calculateTaxEfficiencyScore(inputs) {
    // CRITICAL FIX: Use actual wizard field names and integrate with existing tax system
    const pensionRate = parseFloat(inputs.pensionContributionRate || 0);
    const trainingFundRate = parseFloat(inputs.trainingFundContributionRate || 0);
    
    // Country normalization with proper handling
    const country = (inputs.country || inputs.taxCountry || inputs.inheritanceCountry || 'ISR')
        .toString()
        .toLowerCase()
        .trim();
    
    console.log('💸 Tax Efficiency Debug:', {
        pensionRate,
        trainingFundRate,
        country,
        taxCountry: inputs.taxCountry,
        hasTaxCalculators: !!window.TaxCalculators,
        hasAdditionalIncomeTax: !!window.AdditionalIncomeTax
    });
    
    // Calculate tax-advantaged contribution rate
    const totalTaxAdvantaged = pensionRate + trainingFundRate;
    
    // Get base salary based on planning type
    let baseSalary = 0;
    if (inputs.planningType === 'couple') {
        const partner1Income = parseFloat(inputs.partner1Salary || 0);
        const partner2Income = parseFloat(inputs.partner2Salary || 0);
        baseSalary = (partner1Income + partner2Income) * 12;
    } else {
        baseSalary = parseFloat(inputs.currentMonthlySalary || 0) * 12;
    }
    
    // Enhanced tax efficiency calculation using existing tax system
    let effectiveTaxRate = 0;
    let taxSavingsFromContributions = 0;
    
    // Try to use existing TaxCalculators if available
    if (window.TaxCalculators && baseSalary > 0) {
        try {
            const grossMonthlySalary = baseSalary / 12;
            const taxResult = window.TaxCalculators.calculateNetSalary(grossMonthlySalary, inputs.taxCountry || 'israel');
            effectiveTaxRate = taxResult.taxRate || 0;
            
            // Calculate tax savings from pension/training fund contributions
            const monthlyContributions = grossMonthlySalary * totalTaxAdvantaged / 100;
            taxSavingsFromContributions = monthlyContributions * (effectiveTaxRate / 100) * 12;
            
            console.log('💸 Using TaxCalculators:', {
                grossMonthlySalary,
                effectiveTaxRate,
                monthlyContributions,
                taxSavingsFromContributions
            });
        } catch (error) {
            console.warn('Error using TaxCalculators:', error);
        }
    }
    
    // Check for missing data and return appropriate error states
    if (baseSalary === 0) {
        return {
            score: 0,
            details: {
                currentRate: 0,
                optimalRate: 0,
                efficiencyScore: 0,
                status: 'missing_income_data',
                debugInfo: {
                    reason: 'No salary data found',
                    missingFields: inputs.planningType === 'couple' ? 
                        ['partner1Salary', 'partner2Salary'] : ['currentMonthlySalary'],
                    suggestion: 'Add salary information in Step 2'
                }
            }
        };
    }
    
    if (totalTaxAdvantaged === 0) {
        return {
            score: 0,
            details: {
                currentRate: 0,
                optimalRate: getOptimalTaxAdvantageRate(country),
                efficiencyScore: 0,
                status: 'missing_contribution_data',
                debugInfo: {
                    reason: 'No contribution rates found',
                    missingFields: ['pensionContributionRate', 'trainingFundContributionRate'],
                    suggestion: 'Add contribution rates in Step 4'
                }
            }
        };
    }
    
    // Calculate additional income impact if AdditionalIncomeTax is available
    let additionalIncomeEfficiency = 0;
    let hasAdditionalIncome = false;
    let additionalIncomeDetails = {};
    
    if (window.AdditionalIncomeTax && typeof window.AdditionalIncomeTax.calculateTotalAdditionalIncomeTax === 'function') {
        try {
            const additionalTaxInfo = window.AdditionalIncomeTax.calculateTotalAdditionalIncomeTax(inputs);
            if (additionalTaxInfo.totalAdditionalIncome > 0) {
                hasAdditionalIncome = true;
                const totalIncome = baseSalary + additionalTaxInfo.totalAdditionalIncome;
                const totalTaxAdvantaged = baseSalary * (pensionRate + trainingFundRate) / 100;
                const overallTaxAdvantageRate = totalIncome > 0 ? (totalTaxAdvantaged / totalIncome) * 100 : 0;
                
                // Adjust efficiency score based on overall tax advantage
                additionalIncomeEfficiency = overallTaxAdvantageRate;
                additionalIncomeDetails = {
                    totalAdditionalIncome: additionalTaxInfo.totalAdditionalIncome,
                    additionalTaxRate: additionalTaxInfo.effectiveRate,
                    overallTaxAdvantageRate: overallTaxAdvantageRate,
                    dilutionEffect: (pensionRate + trainingFundRate) - overallTaxAdvantageRate
                };
            }
        } catch (error) {
            console.warn('Error calculating additional income tax efficiency:', error);
        }
    }

    // Helper function to get optimal tax advantage rate by country
    function getOptimalTaxAdvantageRate(country) {
        const optimalRates = {
            'isr': 21.333, 'israel': 21.333, 'il': 21.333,
            'usa': 15, 'us': 15, 'united states': 15, 'united_states': 15,
            'gbr': 12, 'uk': 12, 'gb': 12, 'united kingdom': 12, 'united_kingdom': 12,
            'eur': 10, 'eu': 10, 'germany': 10, 'de': 10, 'france': 10, 'fr': 10, 'europe': 10
        };
        return optimalRates[country] || optimalRates['isr'];
    }
    
    // Calculate efficiency score based on current vs optimal contribution rates
    const optimalRate = getOptimalTaxAdvantageRate(country);
    let efficiencyScore = 0;
    
    if (hasAdditionalIncome) {
        // Use overall tax advantage rate when additional income exists
        efficiencyScore = Math.min(100, (additionalIncomeEfficiency / optimalRate) * 100);
    } else {
        // Use traditional pension/training fund rate calculation
        efficiencyScore = Math.min(100, (totalTaxAdvantaged / optimalRate) * 100);
    }
    
    const maxScore = SCORE_FACTORS.taxEfficiency.weight;
    const score = (efficiencyScore / 100) * maxScore;
    
    let status = 'poor';
    if (efficiencyScore >= 90) status = 'excellent';
    else if (efficiencyScore >= 75) status = 'good';
    else if (efficiencyScore >= 60) status = 'fair';
    else if (efficiencyScore >= 40) status = 'poor';
    else status = 'critical';
    
    return {
        score: Math.round(score),
        details: {
            currentRate: hasAdditionalIncome ? additionalIncomeEfficiency : totalTaxAdvantaged,
            optimalRate: optimalRate,
            efficiencyScore: efficiencyScore,
            status: status,
            pensionRate: pensionRate,
            trainingFundRate: trainingFundRate,
            country: country,
            baseSalary: baseSalary,
            effectiveTaxRate: effectiveTaxRate,
            taxSavingsFromContributions: taxSavingsFromContributions,
            calculationMethod: hasAdditionalIncome ? 'comprehensive_with_additional_income' : 
                            (pensionRate > 0 || trainingFundRate > 0) ? 'rates_found_with_tax_integration' : 'using_defaults',
            hasAdditionalIncome: hasAdditionalIncome,
            additionalIncomeDetails: additionalIncomeDetails,
            debugInfo: {
                countryDetected: country,
                optimalRateUsed: optimalRate,
                taxSystemIntegration: {
                    usedTaxCalculators: !!window.TaxCalculators && baseSalary > 0,
                    effectiveTaxRate: effectiveTaxRate,
                    taxSavings: taxSavingsFromContributions
                },
                ratesFound: {
                    pension: pensionRate > 0,
                    trainingFund: trainingFundRate > 0
                },
                incomeData: {
                    baseSalaryFound: baseSalary > 0,
                    planningType: inputs.planningType,
                    salaryFields: {
                        currentMonthlySalary: !!inputs.currentMonthlySalary,
                        partner1Salary: !!inputs.partner1Salary,
                        partner2Salary: !!inputs.partner2Salary
                    }
                },
                additionalIncomeConsidered: hasAdditionalIncome
            }
        }
    };
}

/**
 * Calculate emergency fund score with debt load consideration
 */
function calculateEmergencyFundScore(inputs) {
    // Calculate total monthly expenses including debt payments
    let monthlyExpenses = 0;
    
    // Get basic living expenses from expenses structure
    if (inputs.expenses) {
        const expenseCategories = ['housing', 'transportation', 'food', 'insurance', 'other'];
        monthlyExpenses = expenseCategories.reduce((sum, category) => {
            return sum + (parseFloat(inputs.expenses[category]) || 0);
        }, 0);
        
        // Add debt payments to monthly expenses for emergency fund calculation
        const debtCategories = ['mortgage', 'carLoan', 'creditCard', 'otherDebt'];
        const monthlyDebtPayments = debtCategories.reduce((sum, category) => {
            return sum + (parseFloat(inputs.expenses[category]) || 0);
        }, 0);
        
        monthlyExpenses += monthlyDebtPayments;
    } else {
        // Fallback to legacy field
        monthlyExpenses = parseFloat(inputs.currentMonthlyExpenses || inputs.currentSalary || 0);
    }
    
    // Get emergency fund amount with enhanced field mapping
    const emergencyFund = getFieldValue(inputs, [
        'emergencyFund', 'currentSavingsAccount', 'emergencyFundAmount',
        'cashReserves', 'liquidSavings', 'savingsAccount'
    ]);
    
    if (monthlyExpenses === 0) {
        return { 
            score: 0, 
            details: { 
                months: 0, 
                status: 'unknown',
                debugInfo: {
                    reason: 'No monthly expenses found',
                    fieldsChecked: ['expenses structure', 'currentMonthlyExpenses'],
                    expensesFound: false
                }
            } 
        };
    }
    
    const monthsCovered = emergencyFund / monthlyExpenses;
    
    // Calculate debt-to-income ratio to adjust emergency fund recommendations
    const monthlyIncome = getFieldValue(inputs, [
        'currentMonthlySalary', 'currentSalary', 'partner1Salary', 
        'monthlySalary', 'salary', 'monthly_salary', 'monthlyIncome'
    ]);
    
    let totalMonthlyIncome = monthlyIncome;
    if (inputs.planningType === 'couple') {
        const partner1Income = parseFloat(inputs.partner1Salary || 0);
        const partner2Income = parseFloat(inputs.partner2Salary || 0);
        totalMonthlyIncome = partner1Income + partner2Income;
    }
    
    // Calculate debt load for enhanced recommendations
    let monthlyDebtPayments = 0;
    if (inputs.expenses) {
        const debtCategories = ['mortgage', 'carLoan', 'creditCard', 'otherDebt'];
        monthlyDebtPayments = debtCategories.reduce((sum, category) => {
            return sum + (parseFloat(inputs.expenses[category]) || 0);
        }, 0);
    }
    
    const debtToIncomeRatio = totalMonthlyIncome > 0 ? monthlyDebtPayments / totalMonthlyIncome : 0;
    
    // Adjust target months based on debt load
    let targetMonths = SCORE_FACTORS.emergencyFund.benchmarks.good; // Default 6 months
    if (debtToIncomeRatio > 0.3) {
        targetMonths = 8; // High debt requires more emergency fund
    } else if (debtToIncomeRatio > 0.2) {
        targetMonths = 7; // Moderate debt requires slightly more
    }
    
    const maxScore = SCORE_FACTORS.emergencyFund.weight;
    let score = 0;
    let status = 'poor';
    
    if (monthsCovered >= SCORE_FACTORS.emergencyFund.benchmarks.excellent) {
        score = maxScore;
        status = 'excellent';
    } else if (monthsCovered >= targetMonths) {
        score = maxScore * 0.85;
        status = 'good';
    } else if (monthsCovered >= SCORE_FACTORS.emergencyFund.benchmarks.fair) {
        score = maxScore * 0.70;
        status = 'fair';
    } else if (monthsCovered >= SCORE_FACTORS.emergencyFund.benchmarks.poor) {
        score = maxScore * 0.50;
        status = 'poor';
    } else {
        score = Math.max(0, (monthsCovered / SCORE_FACTORS.emergencyFund.benchmarks.poor) * maxScore * 0.50);
        status = 'critical';
    }
    
    return {
        score: Math.round(score),
        details: {
            months: monthsCovered,
            currentAmount: emergencyFund,
            targetAmount: monthlyExpenses * targetMonths,
            gap: Math.max(0, (monthlyExpenses * targetMonths) - emergencyFund),
            status: status,
            adjustedTarget: targetMonths !== SCORE_FACTORS.emergencyFund.benchmarks.good,
            debtAdjustment: {
                debtToIncomeRatio: debtToIncomeRatio,
                recommendedMonths: targetMonths,
                reason: debtToIncomeRatio > 0.3 ? 'high_debt' : 
                       debtToIncomeRatio > 0.2 ? 'moderate_debt' : 'standard'
            },
            calculationMethod: inputs.expenses ? 'expense_structure_with_debt' : 'legacy_field',
            debugInfo: {
                monthlyExpensesFound: monthlyExpenses > 0,
                emergencyFundFound: emergencyFund > 0,
                debtConsideration: monthlyDebtPayments > 0 ? 'included' : 'none',
                fieldsUsed: {
                    expenses: monthlyExpenses > 0 ? 'found' : 'missing',
                    emergencyFund: emergencyFund > 0 ? 'found' : 'missing'
                }
            }
        }
    };
}

/**
 * Calculate debt management score with enhanced field mapping
 */
function calculateDebtManagementScore(inputs) {
    // Enhanced field mapping for monthly income
    const monthlyIncome = getFieldValue(inputs, [
        'currentMonthlySalary', 'currentSalary', 'partner1Salary', 
        'monthlySalary', 'salary', 'monthly_salary', 'monthlyIncome'
    ]);
    
    // Calculate monthly debt payments from expenses structure or legacy field
    let monthlyDebtPayments = 0;
    
    // First try the new expenses structure with individual debt categories
    if (inputs.expenses) {
        const debtCategories = ['mortgage', 'carLoan', 'creditCard', 'otherDebt'];
        monthlyDebtPayments = debtCategories.reduce((sum, category) => {
            return sum + (parseFloat(inputs.expenses[category]) || 0);
        }, 0);
    }
    
    // Fallback to legacy monthlyDebtPayments field if no expenses structure
    if (monthlyDebtPayments === 0) {
        monthlyDebtPayments = parseFloat(inputs.monthlyDebtPayments || 0);
    }
    
    // For couple planning, combine partner incomes
    let totalMonthlyIncome = monthlyIncome;
    if (inputs.planningType === 'couple') {
        const partner1Income = parseFloat(inputs.partner1Salary || 0);
        const partner2Income = parseFloat(inputs.partner2Salary || 0);
        totalMonthlyIncome = partner1Income + partner2Income;
    }
    
    if (totalMonthlyIncome === 0) {
        return { 
            score: SCORE_FACTORS.debtManagement.weight, 
            details: { 
                ratio: 0, 
                status: 'unknown',
                debugInfo: {
                    reason: 'No monthly income found',
                    fieldsChecked: ['currentMonthlySalary', 'partner1Salary', 'partner2Salary'],
                    incomeFound: false,
                    debtPaymentsFound: monthlyDebtPayments > 0
                }
            } 
        };
    }
    
    const debtToIncomeRatio = monthlyDebtPayments / totalMonthlyIncome;
    const maxScore = SCORE_FACTORS.debtManagement.weight;
    
    let score = maxScore;
    let status = 'excellent';
    
    if (debtToIncomeRatio <= SCORE_FACTORS.debtManagement.benchmarks.excellent) {
        score = maxScore;
        status = 'excellent';
    } else if (debtToIncomeRatio <= SCORE_FACTORS.debtManagement.benchmarks.good) {
        score = maxScore * 0.85;
        status = 'good';
    } else if (debtToIncomeRatio <= SCORE_FACTORS.debtManagement.benchmarks.fair) {
        score = maxScore * 0.70;
        status = 'fair';
    } else if (debtToIncomeRatio <= SCORE_FACTORS.debtManagement.benchmarks.poor) {
        score = maxScore * 0.50;
        status = 'poor';
    } else {
        score = 0;
        status = 'critical';
    }
    
    // Calculate debt breakdown for detailed analysis
    const debtBreakdown = {};
    if (inputs.expenses) {
        debtBreakdown.mortgage = parseFloat(inputs.expenses.mortgage || 0);
        debtBreakdown.carLoan = parseFloat(inputs.expenses.carLoan || 0);
        debtBreakdown.creditCard = parseFloat(inputs.expenses.creditCard || 0);
        debtBreakdown.otherDebt = parseFloat(inputs.expenses.otherDebt || 0);
    }
    
    return {
        score: Math.round(score),
        details: {
            ratio: debtToIncomeRatio,
            monthlyPayments: monthlyDebtPayments,
            monthlyIncome: totalMonthlyIncome,
            status: status,
            debtBreakdown: debtBreakdown,
            calculationMethod: inputs.expenses ? 'expense_categories' : 'legacy_field',
            debugInfo: {
                incomeSource: inputs.planningType === 'couple' ? 'combined_partners' : 'individual',
                debtSource: inputs.expenses ? 'expense_structure' : 'legacy_field',
                totalIncomeFound: totalMonthlyIncome > 0,
                debtPaymentsFound: monthlyDebtPayments > 0,
                fieldsUsed: {
                    income: totalMonthlyIncome > 0 ? 'found' : 'missing',
                    debt: monthlyDebtPayments > 0 ? 'found' : 'missing'
                }
            }
        }
    };
}

/**
 * Generate actionable improvement suggestions
 */
function generateImprovementSuggestions(scoreBreakdown) {
    const suggestions = [];
    
    // Sort factors by lowest scores first (biggest improvement opportunities)
    const factors = Object.entries(scoreBreakdown.factors)
        .sort((a, b) => a[1].score - b[1].score);
    
    factors.forEach(([factorName, factorData]) => {
        // CRITICAL FIX: Add null safety checks to prevent "Cannot read properties of undefined (reading 'status')" error
        const status = factorData?.details?.status || 'unknown';
        if (status === 'critical' || status === 'poor') {
            // Ensure factorData.details exists before accessing properties
            if (!factorData?.details) {
                console.warn(`Missing details for factor: ${factorName}`);
                return;
            }
            
            switch (factorName) {
                case 'savingsRate':
                    if (factorData.details.rate !== undefined && factorData.details.improvement !== undefined) {
                        suggestions.push({
                            priority: 'high',
                            category: 'Savings Rate',
                            issue: `Currently saving only ${factorData.details.rate.toFixed(1)}% of income`,
                            action: `Increase monthly savings by ₪${Math.round(factorData.details.improvement)} to reach 15% target`,
                            impact: `+${Math.round((SCORE_FACTORS.savingsRate.weight * 0.85) - factorData.score)} points`
                        });
                    }
                    break;
                case 'retirementReadiness':
                    if (factorData.details.gap !== undefined) {
                        suggestions.push({
                            priority: 'high',
                            category: 'Retirement Readiness',
                            issue: `₪${Math.round(factorData.details.gap).toLocaleString()} behind age-appropriate savings target`,
                            action: `Increase retirement contributions or consider working longer`,
                            impact: `+${Math.round((SCORE_FACTORS.retirementReadiness.weight * 0.85) - factorData.score)} points`
                        });
                    }
                    break;
                case 'diversification':
                    if (factorData.details.assetClasses !== undefined && factorData.details.missingClasses !== undefined) {
                        suggestions.push({
                            priority: 'medium',
                            category: 'Portfolio Diversification',
                            issue: `Only ${factorData.details.assetClasses} asset classes in portfolio`,
                            action: `Add ${factorData.details.missingClasses} more asset class(es) like real estate or international stocks`,
                            impact: `+${Math.round((SCORE_FACTORS.diversification.weight * 0.85) - factorData.score)} points`
                        });
                    }
                    break;
                case 'emergencyFund':
                    if (factorData.details.months !== undefined && factorData.details.gap !== undefined) {
                        const targetMonths = factorData.details.debtAdjustment?.recommendedMonths || 6;
                        const debtAdjustment = factorData.details.adjustedTarget ? ` (${targetMonths} months recommended due to debt load)` : '';
                        
                        suggestions.push({
                            priority: 'high',
                            category: 'Emergency Fund',
                            issue: `Only ${factorData.details.months.toFixed(1)} months of expenses covered`,
                            action: `Save additional ₪${Math.round(factorData.details.gap).toLocaleString()} for ${targetMonths}-month emergency fund${debtAdjustment}`,
                            impact: `+${Math.round((SCORE_FACTORS.emergencyFund.weight * 0.85) - factorData.score)} points`
                        });
                    }
                    break;
                case 'taxEfficiency':
                    if (factorData.details.efficiencyScore !== undefined) {
                        suggestions.push({
                            priority: 'medium',
                            category: 'Tax Optimization',
                            issue: `${factorData.details.efficiencyScore.toFixed(0)}% tax efficiency vs optimal`,
                            action: `Maximize pension and training fund contributions`,
                            impact: `+${Math.round((SCORE_FACTORS.taxEfficiency.weight * 0.85) - factorData.score)} points`
                        });
                    }
                    break;
                case 'debtManagement':
                    if (factorData.details.ratio !== undefined && factorData.details.monthlyPayments !== undefined) {
                        const debtRatioPercent = (factorData.details.ratio * 100).toFixed(1);
                        let actionText = '';
                        
                        if (factorData.details.ratio > 0.35) {
                            actionText = 'Consider debt consolidation, sell non-essential assets, or increase income';
                        } else if (factorData.details.ratio > 0.2) {
                            actionText = 'Focus on paying off high-interest debt first (credit cards)';
                        } else if (factorData.details.ratio > 0.1) {
                            actionText = 'Make extra payments toward principal on highest-rate loans';
                        } else {
                            actionText = 'Maintain current debt levels while maximizing retirement savings';
                        }
                        
                        // Enhanced debt breakdown suggestions
                        if (factorData.details.debtBreakdown) {
                            const breakdown = factorData.details.debtBreakdown;
                            if (breakdown.creditCard > breakdown.mortgage && breakdown.creditCard > 0) {
                                actionText += '. Prioritize credit card debt (typically highest interest rate)';
                            }
                        }
                        
                        suggestions.push({
                            priority: factorData.details.ratio > 0.3 ? 'high' : 'medium',
                            category: 'Debt Management',
                            issue: `${debtRatioPercent}% debt-to-income ratio (₪${Math.round(factorData.details.monthlyPayments)} monthly)`,
                            action: actionText,
                            impact: `+${Math.round((SCORE_FACTORS.debtManagement.weight * 0.85) - factorData.score)} points`
                        });
                    }
                    break;
            }
        }
    });
    
    return suggestions.slice(0, 5); // Top 5 suggestions
}

/**
 * Get peer comparison data
 */
function getPeerComparison(inputs, totalScore) {
    const age = parseFloat(inputs.currentAge || 30);
    let ageGroup = '30-39';
    
    if (age < 30) ageGroup = '20-29';
    else if (age < 40) ageGroup = '30-39';
    else if (age < 50) ageGroup = '40-49';
    else if (age < 60) ageGroup = '50-59';
    else ageGroup = '60+';
    
    const benchmark = PEER_BENCHMARKS[ageGroup];
    
    return {
        ageGroup: ageGroup,
        yourScore: totalScore,
        peerAverage: benchmark.averageScore,
        topQuartile: benchmark.topQuartile,
        percentile: totalScore > benchmark.topQuartile ? 90 : 
                   totalScore > benchmark.averageScore ? 70 : 
                   totalScore > (benchmark.averageScore * 0.8) ? 50 : 25
    };
}

/**
 * Main function to calculate comprehensive financial health score
 */
function calculateFinancialHealthScore(inputs) {
    try {
        // Debug logging for input validation
        console.log('🔍 Financial Health Score Calculation Started');
        console.log('📊 Available input fields:', Object.keys(inputs).filter(key => 
            key.includes('salary') || key.includes('pension') || key.includes('training') || 
            key.includes('contribution') || key.includes('savings')
        ));
        
        // Calculate each factor with error handling
        const factors = {};
        
        // Helper function to safely calculate each factor
        const safeCalculate = (factorName, calculator) => {
            try {
                console.log(`🔧 Calculating ${factorName}...`);
                const result = calculator(inputs);
                console.log(`🔧 ${factorName} result:`, result);
                // Validate result structure - be more specific about what we expect
                if (!result) {
                    console.warn(`${factorName}: Calculator returned null/undefined, using default`);
                    return { score: 0, details: { status: 'error', message: 'Calculator returned null' } };
                }
                if (typeof result !== 'object') {
                    console.warn(`${factorName}: Calculator returned non-object (${typeof result}), using default`);
                    return { score: 0, details: { status: 'error', message: `Expected object, got ${typeof result}` } };
                }
                if (typeof result.score !== 'number') {
                    console.warn(`${factorName}: Score is not a number (${typeof result.score}: ${result.score}), using default`);
                    return { score: 0, details: { status: 'error', message: `Score not a number: ${typeof result.score}` } };
                }
                // Ensure score is finite and valid
                if (!isFinite(result.score) || isNaN(result.score)) {
                    console.warn(`${factorName}: Invalid score value (${result.score}), using 0`);
                    result.score = 0;
                }
                return result;
            } catch (error) {
                console.error(`${factorName}: Calculation failed`, error);
                return { score: 0, details: { status: 'error', message: error.message } };
            }
        };
        
        // Calculate each factor with safety wrapper
        factors.savingsRate = safeCalculate('savingsRate', calculateSavingsRateScore);
        factors.retirementReadiness = safeCalculate('retirementReadiness', calculateRetirementReadinessScore);
        factors.timeHorizon = safeCalculate('timeHorizon', calculateTimeHorizonScore);
        factors.riskAlignment = safeCalculate('riskAlignment', calculateRiskAlignmentScore);
        factors.diversification = safeCalculate('diversification', calculateDiversificationScore);
        factors.taxEfficiency = safeCalculate('taxEfficiency', calculateTaxEfficiencyScore);
        factors.emergencyFund = safeCalculate('emergencyFund', calculateEmergencyFundScore);
        factors.debtManagement = safeCalculate('debtManagement', calculateDebtManagementScore);
        
        // Debug logging for factor scores
        console.log('📈 Factor Scores Breakdown:');
        Object.entries(factors).forEach(([name, factor]) => {
            console.log(`  ${name}: ${factor.score}/${window.SCORE_FACTORS[name]?.weight || 'unknown'} (${factor.details?.status || 'no status'})`);
        });
        
        // CRITICAL FIX: Add comprehensive NaN prevention and validation
        const factorScores = Object.values(factors).map(factor => {
            const score = factor?.score || 0;
            // Ensure score is a valid finite number
            if (isNaN(score) || !isFinite(score)) {
                console.warn(`Invalid factor score detected: ${score}, using 0 instead`);
                return 0;
            }
            return score;
        });
        
        const totalScore = factorScores.reduce((sum, score) => sum + score, 0);
        
        // Final validation: ensure totalScore is valid
        const validatedTotalScore = (isNaN(totalScore) || !isFinite(totalScore)) ? 0 : totalScore;
        
        const scoreBreakdown = {
            totalScore: Math.round(validatedTotalScore),
            factors: factors,
            status: validatedTotalScore >= 85 ? 'excellent' : 
                   validatedTotalScore >= 70 ? 'good' : 
                   validatedTotalScore >= 50 ? 'needsWork' : 'critical',
            suggestions: generateImprovementSuggestions({ factors }),
            peerComparison: getPeerComparison(inputs, validatedTotalScore),
            generatedAt: new Date().toISOString(),
            debugInfo: {
                inputFieldsFound: Object.keys(inputs).length,
                calculationMethod: 'enhanced_field_mapping',
                zeroScoreFactors: Object.entries(factors)
                    .filter(([_, factor]) => factor.score === 0)
                    .map(([name, factor]) => ({ name, reason: factor.details?.calculationMethod || 'unknown' }))
            }
        };
        
        console.log('✅ Financial health score calculated:', scoreBreakdown.totalScore, scoreBreakdown.status);
        console.log('⚠️ Zero score factors:', scoreBreakdown.debugInfo.zeroScoreFactors);
        return scoreBreakdown;
        
    } catch (error) {
        console.error('❌ Error calculating financial health score:', error);
        return {
            totalScore: 0,
            factors: {},
            status: 'error',
            suggestions: [],
            peerComparison: null,
            error: error.message
        };
    }
}

// Export functions to window for global access
window.calculateFinancialHealthScore = calculateFinancialHealthScore;
window.SCORE_FACTORS = SCORE_FACTORS;
window.generateImprovementSuggestions = generateImprovementSuggestions;
window.getPeerComparison = getPeerComparison;

console.log('✅ Financial Health Engine loaded successfully');