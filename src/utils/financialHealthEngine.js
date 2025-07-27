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
    // Enhanced field mapping with common variations
    const monthlyIncome = getFieldValue(inputs, [
        'currentMonthlySalary', 'currentSalary', 'partner1Salary', 
        'monthlySalary', 'salary', 'monthly_salary', 'monthlyIncome'
    ]);
    
    // Calculate monthly contributions from multiple sources with better field mapping
    let monthlyContributions = getFieldValue(inputs, [
        'monthlyContribution', 'monthly_contribution', 'monthlyContributions'
    ]);
    
    // If monthlyContribution is not set, calculate from pension/training fund rates
    if (monthlyContributions === 0 && monthlyIncome > 0) {
        const pensionRate = getFieldValue(inputs, [
            'pensionContributionRate', 'employeePensionRate', 'pensionEmployee',
            'pension_employee', 'pensionEmployeeRate', 'pensionRate', 'employeeContribution'
        ]);
        const trainingFundRate = getFieldValue(inputs, [
            'trainingFundContributionRate', 'trainingFundEmployeeRate', 'trainingFundEmployee',
            'training_fund_employee', 'trainingFundRate', 'trainingFundContribution'
        ]);
        
        // Calculate contributions as percentage of salary
        monthlyContributions = monthlyIncome * (pensionRate + trainingFundRate) / 100;
        
        // Also include additional savings if available
        const additionalSavings = getFieldValue(inputs, [
            'additionalMonthlySavings', 'monthlyInvestment', 'additionalSavings',
            'additional_savings', 'monthlyAdditionalSavings'
        ]);
        monthlyContributions += additionalSavings;
    }
    
    // Add null/zero validation
    if (monthlyIncome === 0 || isNaN(monthlyIncome)) {
        return { 
            score: 0, 
            details: { 
                rate: 0, 
                status: 'unknown', 
                monthlyAmount: 0,
                debugInfo: {
                    reason: 'No monthly income found',
                    fieldsChecked: ['currentMonthlySalary', 'currentSalary', 'partner1Salary'],
                    fieldsFound: 'none'
                }
            } 
        };
    }
    
    const savingsRate = (monthlyContributions / monthlyIncome) * 100;
    const maxScore = SCORE_FACTORS.savingsRate.weight;
    
    let score = 0;
    let status = 'poor';
    
    if (savingsRate >= SCORE_FACTORS.savingsRate.benchmarks.excellent) {
        score = maxScore;
        status = 'excellent';
    } else if (savingsRate >= SCORE_FACTORS.savingsRate.benchmarks.good) {
        score = maxScore * 0.85;
        status = 'good';
    } else if (savingsRate >= SCORE_FACTORS.savingsRate.benchmarks.fair) {
        score = maxScore * 0.70;
        status = 'fair';
    } else if (savingsRate >= SCORE_FACTORS.savingsRate.benchmarks.poor) {
        score = maxScore * 0.50;
        status = 'poor';
    } else {
        score = Math.max(0, (savingsRate / SCORE_FACTORS.savingsRate.benchmarks.poor) * maxScore * 0.50);
        status = 'critical';
    }
    
    return {
        score: Math.round(score),
        details: {
            rate: savingsRate,
            monthlyAmount: monthlyContributions,
            monthlyIncome: monthlyIncome,
            status: status,
            target: SCORE_FACTORS.savingsRate.benchmarks.good,
            improvement: Math.max(0, (SCORE_FACTORS.savingsRate.benchmarks.good - savingsRate) * monthlyIncome / 100),
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
    const currentAge = parseFloat(inputs.currentAge || 30);
    const riskTolerance = inputs.riskTolerance || 'moderate';
    const stockPercentage = parseFloat(inputs.stockPercentage || 60);
    
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
    
    return {
        score: Math.round(score),
        details: {
            stockPercentage: stockPercentage,
            recommendedPercentage: recommendedStockPercentage,
            deviation: deviation,
            alignmentScore: alignmentScore,
            status: status
        }
    };
}

/**
 * Calculate diversification score
 */
function calculateDiversificationScore(inputs) {
    let assetClasses = 0;
    
    if (parseFloat(inputs.currentSavings || 0) > 0) assetClasses++; // Pension
    if (parseFloat(inputs.currentPersonalPortfolio || 0) > 0) assetClasses++; // Stocks/Bonds
    if (parseFloat(inputs.currentRealEstate || 0) > 0) assetClasses++; // Real Estate
    if (parseFloat(inputs.currentCryptoFiatValue || inputs.currentCrypto || 0) > 0) assetClasses++; // Crypto
    if (parseFloat(inputs.currentSavingsAccount || 0) > 0) assetClasses++; // Cash
    if (parseFloat(inputs.currentTrainingFund || 0) > 0) assetClasses++; // Training Fund
    
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
    
    return {
        score: Math.round(score),
        details: {
            assetClasses: assetClasses,
            status: status,
            missingClasses: Math.max(0, SCORE_FACTORS.diversification.benchmarks.good - assetClasses)
        }
    };
}

/**
 * Calculate tax efficiency score
 */
function calculateTaxEfficiencyScore(inputs) {
    // Better field name mapping for pension and training fund rates
    const pensionRate = getFieldValue(inputs, [
        'pensionContributionRate', 'employeePensionRate', 'pensionEmployee',
        'pensionRate', 'employeeContribution', 'pension_employee',
        'pensionEmployeeRate', 'employee_pension_rate'
    ]);
    
    const trainingFundRate = getFieldValue(inputs, [
        'trainingFundContributionRate', 'trainingFundEmployeeRate', 'trainingFundEmployee',
        'trainingFundRate', 'training_fund_employee', 'trainingFundContribution',
        'employee_training_fund_rate'
    ]);
    
    // Country normalization with proper handling
    const country = (inputs.country || inputs.taxCountry || inputs.inheritanceCountry || 'ISR')
        .toString()
        .toLowerCase()
        .trim();
    
    // Calculate tax-advantaged contribution rate
    const totalTaxAdvantaged = pensionRate + trainingFundRate;
    
    // Get base salary and additional income for comprehensive tax efficiency
    const baseSalary = getFieldValue(inputs, [
        'currentMonthlySalary', 'currentSalary', 'partner1Salary', 
        'monthlySalary', 'salary', 'monthly_salary'
    ]) * 12;
    
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
    
    let efficiencyScore = 0;
    
    // Country-specific optimal rates with better mapping
    const optimalRates = {
        'isr': 21.333, 'israel': 21.333, 'il': 21.333, // Israeli pension + training fund
        'usa': 15, 'us': 15, 'united states': 15, 'united_states': 15,     // 401k + IRA
        'gbr': 12, 'uk': 12, 'gb': 12, 'united kingdom': 12, 'united_kingdom': 12,     // Workplace pension
        'eur': 10, 'eu': 10, 'germany': 10, 'de': 10, 'france': 10, 'fr': 10, 'europe': 10      // Average European pension
    };
    
    const optimalRate = optimalRates[country] || optimalRates['isr'];
    // Calculate base efficiency score
    if (optimalRate === 0 || isNaN(optimalRate)) {
        efficiencyScore = 0;
    } else {
        if (hasAdditionalIncome) {
            // Use overall tax advantage rate when additional income exists
            efficiencyScore = Math.min(100, (additionalIncomeEfficiency / optimalRate) * 100);
        } else {
            // Use traditional pension/training fund rate calculation
            efficiencyScore = Math.min(100, (totalTaxAdvantaged / optimalRate) * 100);
        }
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
            calculationMethod: hasAdditionalIncome ? 'comprehensive_with_additional_income' : 
                            (pensionRate > 0 || trainingFundRate > 0) ? 'rates_found' : 'using_defaults',
            hasAdditionalIncome: hasAdditionalIncome,
            additionalIncomeDetails: additionalIncomeDetails,
            debugInfo: {
                countryDetected: country,
                optimalRateUsed: optimalRate,
                ratesFound: {
                    pension: pensionRate > 0,
                    trainingFund: trainingFundRate > 0
                },
                additionalIncomeConsidered: hasAdditionalIncome
            }
        }
    };
}

/**
 * Calculate emergency fund score
 */
function calculateEmergencyFundScore(inputs) {
    const monthlyExpenses = parseFloat(inputs.currentMonthlyExpenses || inputs.currentSalary || 0);
    const emergencyFund = parseFloat(inputs.emergencyFund || inputs.currentSavingsAccount || 0);
    
    if (monthlyExpenses === 0) return { score: 0, details: { months: 0, status: 'unknown' } };
    
    const monthsCovered = emergencyFund / monthlyExpenses;
    const maxScore = SCORE_FACTORS.emergencyFund.weight;
    
    let score = 0;
    let status = 'poor';
    
    if (monthsCovered >= SCORE_FACTORS.emergencyFund.benchmarks.excellent) {
        score = maxScore;
        status = 'excellent';
    } else if (monthsCovered >= SCORE_FACTORS.emergencyFund.benchmarks.good) {
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
            targetAmount: monthlyExpenses * SCORE_FACTORS.emergencyFund.benchmarks.good,
            gap: Math.max(0, (monthlyExpenses * SCORE_FACTORS.emergencyFund.benchmarks.good) - emergencyFund),
            status: status
        }
    };
}

/**
 * Calculate debt management score
 */
function calculateDebtManagementScore(inputs) {
    const monthlyIncome = parseFloat(inputs.currentMonthlySalary || 0);
    const monthlyDebtPayments = parseFloat(inputs.monthlyDebtPayments || 0);
    
    if (monthlyIncome === 0) return { score: SCORE_FACTORS.debtManagement.weight, details: { ratio: 0, status: 'unknown' } };
    
    const debtToIncomeRatio = monthlyDebtPayments / monthlyIncome;
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
    
    return {
        score: Math.round(score),
        details: {
            ratio: debtToIncomeRatio,
            monthlyPayments: monthlyDebtPayments,
            status: status
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
                        suggestions.push({
                            priority: 'high',
                            category: 'Emergency Fund',
                            issue: `Only ${factorData.details.months.toFixed(1)} months of expenses covered`,
                            action: `Save additional ₪${Math.round(factorData.details.gap).toLocaleString()} for 6-month emergency fund`,
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
        
        const factors = {
            savingsRate: calculateSavingsRateScore(inputs),
            retirementReadiness: calculateRetirementReadinessScore(inputs),
            timeHorizon: calculateTimeHorizonScore(inputs),
            riskAlignment: calculateRiskAlignmentScore(inputs),
            diversification: calculateDiversificationScore(inputs),
            taxEfficiency: calculateTaxEfficiencyScore(inputs),
            emergencyFund: calculateEmergencyFundScore(inputs),
            debtManagement: calculateDebtManagementScore(inputs)
        };
        
        // Debug logging for factor scores
        console.log('📈 Factor Scores Breakdown:');
        Object.entries(factors).forEach(([name, factor]) => {
            console.log(`  ${name}: ${factor.score}/${window.SCORE_FACTORS[name]?.weight || 'unknown'} (${factor.details?.status || 'no status'})`);
        });
        
        const totalScore = Object.values(factors).reduce((sum, factor) => sum + factor.score, 0);
        
        const scoreBreakdown = {
            totalScore: Math.round(totalScore),
            factors: factors,
            status: totalScore >= 85 ? 'excellent' : 
                   totalScore >= 70 ? 'good' : 
                   totalScore >= 50 ? 'needsWork' : 'critical',
            suggestions: generateImprovementSuggestions({ factors }),
            peerComparison: getPeerComparison(inputs, totalScore),
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