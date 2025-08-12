// Additional Scoring Calculators for Financial Health Engine
// Handles diversification, tax efficiency, emergency fund, and debt management

// Import dependencies
const { safeParseFloat, safeDivide, safePercentage, clampValue, enhancedSafeCalculation } = 
    window.financialHealthSafeCalcs || {};
const { getFieldValue } = window.financialHealthFieldMapper || {};
const { SCORE_FACTORS, ASSET_CLASSES, DEBT_CATEGORIES, COUNTRY_FACTORS } = 
    window.financialHealthConstants || {};

/**
 * Calculate portfolio diversification score
 */
function calculateDiversificationScore(inputs) {
    return enhancedSafeCalculation('DiversificationScore', () => {
        // Count asset classes with meaningful allocation (>5%)
        const assetClasses = [];
        
        // Check stocks/equities with partner combination
        const equityAllocation = getFieldValue(inputs, 
            ['equityPercentage', 'stocksPercentage', 'equityAllocation', 'stocks'], 
            { 
                defaultValue: 0,
                allowZero: true,
                calculationContext: 'diversification_equity' 
            }
        );
        if (equityAllocation > 5) assetClasses.push('stocks');
        
        // Check bonds
        const bondAllocation = getFieldValue(inputs, 
            ['bondPercentage', 'bondsPercentage', 'bondAllocation', 'bonds'], 
            { 
                defaultValue: 0,
                allowZero: true,
                calculationContext: 'diversification_bonds' 
            }
        );
        if (bondAllocation > 5) assetClasses.push('bonds');
        
        // Check real estate
        const realEstateValue = getFieldValue(inputs, 
            ['currentRealEstate', 'realEstateValue', 'realEstate'], 
            { 
                combinePartners: true,
                allowZero: true,
                calculationContext: 'diversification_realestate' 
            }
        );
        if (realEstateValue > 0) assetClasses.push('realEstate');
        
        // Check crypto
        const cryptoValue = getFieldValue(inputs, 
            ['currentCrypto', 'cryptoValue', 'crypto'], 
            { 
                combinePartners: true,
                allowZero: true,
                calculationContext: 'diversification_crypto' 
            }
        );
        if (cryptoValue > 0) assetClasses.push('crypto');
        
        // Check commodities/gold
        const commoditiesAllocation = getFieldValue(inputs, 
            ['commoditiesPercentage', 'goldPercentage', 'commodities'], 
            { 
                defaultValue: 0,
                allowZero: true,
                calculationContext: 'diversification_commodities' 
            }
        );
        if (commoditiesAllocation > 5) assetClasses.push('commodities');
        
        // Check cash/savings
        const cashAllocation = getFieldValue(inputs, 
            ['cashPercentage', 'cashAllocation', 'cash'], 
            { 
                defaultValue: 0,
                allowZero: true,
                calculationContext: 'diversification_cash' 
            }
        );
        if (cashAllocation > 5) assetClasses.push('cash');
        
        const classCount = assetClasses.length;
        
        // Get benchmarks
        const benchmarks = SCORE_FACTORS.diversification.benchmarks;
        
        // Calculate score
        let score = 0;
        let status = 'poor';
        
        if (classCount >= benchmarks.excellent) {
            score = 100;
            status = 'excellent';
        } else if (classCount >= benchmarks.good) {
            score = 75 + (classCount - benchmarks.good) / (benchmarks.excellent - benchmarks.good) * 25;
            status = 'good';
        } else if (classCount >= benchmarks.fair) {
            score = 50 + (classCount - benchmarks.fair) / (benchmarks.good - benchmarks.fair) * 25;
            status = 'fair';
        } else if (classCount >= benchmarks.poor) {
            score = 25 + Math.max(0, classCount - benchmarks.poor) * 25;
            status = 'poor';
        } else {
            score = classCount * 25;
            status = 'poor';
        }
        
        // Bonus for international diversification
        const internationalAllocation = getFieldValue(inputs, 
            ['internationalPercentage', 'internationalAllocation'], 
            { defaultValue: 0, allowZero: true }
        );
        if (internationalAllocation > 20) {
            score = Math.min(100, score + 5);
        }
        
        return {
            score: clampValue(score, 0, 100),
            details: {
                assetClassCount: classCount,
                assetClasses,
                allocations: {
                    equity: equityAllocation,
                    bonds: bondAllocation,
                    realEstate: realEstateValue > 0,
                    crypto: cryptoValue > 0,
                    commodities: commoditiesAllocation,
                    cash: cashAllocation,
                    international: internationalAllocation
                },
                status
            }
        };
    });
}

/**
 * Calculate tax efficiency score
 */
function calculateTaxEfficiencyScore(inputs) {
    return enhancedSafeCalculation('TaxEfficiencyScore', () => {
        const country = inputs.country || inputs.taxCountry || 'ISR';
        const countryFactor = COUNTRY_FACTORS[country] || COUNTRY_FACTORS.ISR;
        
        // Get tax-advantaged savings with partner combination
        const pensionSavings = getFieldValue(inputs, 
            ['currentPensionSavings', 'pensionSavings'], 
            { 
                combinePartners: true,
                allowZero: true,
                calculationContext: 'tax_efficiency_pension' 
            }
        );
        
        const trainingFund = getFieldValue(inputs, 
            ['currentTrainingFund', 'trainingFund'], 
            { 
                combinePartners: true,
                allowZero: true,
                calculationContext: 'tax_efficiency_training' 
            }
        );
        
        // Get total investment portfolio
        const totalPortfolio = getFieldValue(inputs, 
            ['personalPortfolio', 'totalPortfolio', 'portfolio'], 
            { 
                combinePartners: true,
                allowZero: true,
                calculationContext: 'tax_efficiency_portfolio' 
            }
        );
        
        const totalSavings = pensionSavings + trainingFund + totalPortfolio;
        const taxAdvantaged = pensionSavings + trainingFund;
        
        // Calculate tax efficiency percentage
        const taxEfficiencyResult = safePercentage(taxAdvantaged, totalSavings, 0, 'tax_efficiency');
        const taxEfficiency = taxEfficiencyResult.value;
        
        // Get benchmarks
        const benchmarks = SCORE_FACTORS.taxEfficiency.benchmarks;
        
        // Calculate base score
        let score = 0;
        let status = 'poor';
        
        if (taxEfficiency >= benchmarks.excellent) {
            score = 100;
            status = 'excellent';
        } else if (taxEfficiency >= benchmarks.good) {
            score = 75 + (taxEfficiency - benchmarks.good) / (benchmarks.excellent - benchmarks.good) * 25;
            status = 'good';
        } else if (taxEfficiency >= benchmarks.fair) {
            score = 50 + (taxEfficiency - benchmarks.fair) / (benchmarks.good - benchmarks.fair) * 25;
            status = 'fair';
        } else if (taxEfficiency >= benchmarks.poor) {
            score = 25 + (taxEfficiency - benchmarks.poor) / (benchmarks.fair - benchmarks.poor) * 25;
            status = 'poor';
        } else if (taxEfficiency > 0) {
            score = taxEfficiency / benchmarks.poor * 25;
            status = 'poor';
        }
        
        // Apply country-specific bonus
        score = Math.min(100, score + countryFactor.taxAdvantageBonus);
        
        // Check if maximizing contributions
        const pensionContribRate = safeParseFloat(inputs.pensionContributionRate || inputs.pensionRate, 0);
        const trainingContribRate = safeParseFloat(inputs.trainingFundContributionRate || inputs.trainingRate, 0);
        
        const isMaximizing = (pensionContribRate >= 15 && trainingContribRate >= 7.5);
        if (isMaximizing) {
            score = Math.min(100, score + 5);
        }
        
        return {
            score: clampValue(score, 0, 100),
            details: {
                totalSavings,
                taxAdvantaged,
                taxEfficiencyPercentage: Math.round(taxEfficiency),
                country,
                isMaximizingContributions: isMaximizing,
                breakdown: {
                    pension: pensionSavings,
                    trainingFund: trainingFund,
                    taxable: totalPortfolio
                },
                status
            }
        };
    });
}

/**
 * Calculate emergency fund score
 */
function calculateEmergencyFundScore(inputs) {
    return enhancedSafeCalculation('EmergencyFundScore', () => {
        // Get emergency fund amount with partner combination
        const emergencyFund = getFieldValue(inputs, 
            ['emergencyFund', 'emergencySavings', 'cashSavings'], 
            { 
                combinePartners: true,
                allowZero: true,
                calculationContext: 'emergency_fund_amount' 
            }
        );
        
        // Get monthly expenses with partner combination
        const monthlyExpenses = getFieldValue(inputs, 
            ['currentMonthlyExpenses', 'monthlyExpenses', 'expenses'], 
            { 
                combinePartners: true,
                defaultValue: 1,
                calculationContext: 'emergency_fund_expenses' 
            }
        );
        
        // Calculate months of coverage
        const monthsCoveredResult = safeDivide(emergencyFund, monthlyExpenses, 0, 'emergency_fund_coverage');
        const monthsCovered = monthsCoveredResult.value;
        
        // Get benchmarks
        const benchmarks = SCORE_FACTORS.emergencyFund.benchmarks;
        
        // Calculate score
        let score = 0;
        let status = 'poor';
        
        if (monthsCovered >= benchmarks.excellent) {
            score = 100;
            status = 'excellent';
        } else if (monthsCovered >= benchmarks.good) {
            score = 75 + (monthsCovered - benchmarks.good) / (benchmarks.excellent - benchmarks.good) * 25;
            status = 'good';
        } else if (monthsCovered >= benchmarks.fair) {
            score = 50 + (monthsCovered - benchmarks.fair) / (benchmarks.good - benchmarks.fair) * 25;
            status = 'fair';
        } else if (monthsCovered >= benchmarks.poor) {
            score = 25 + (monthsCovered - benchmarks.poor) / (benchmarks.fair - benchmarks.poor) * 25;
            status = 'poor';
        } else if (monthsCovered > 0) {
            score = monthsCovered / benchmarks.poor * 25;
            status = 'poor';
        }
        
        // Adjust for job stability
        const jobStability = inputs.jobStability || inputs.employmentStability || 'stable';
        if (jobStability === 'unstable' || jobStability === 'contract') {
            // Unstable jobs need larger emergency fund
            score = Math.max(0, score - 10);
        } else if (jobStability === 'veryStable' || jobStability === 'government') {
            // Very stable jobs can have smaller emergency fund
            score = Math.min(100, score + 5);
        }
        
        return {
            score: clampValue(score, 0, 100),
            details: {
                emergencyFund,
                monthlyExpenses,
                monthsCovered: Math.round(monthsCovered * 10) / 10,
                targetMonths: benchmarks.good,
                shortfall: Math.max(0, (benchmarks.good * monthlyExpenses) - emergencyFund),
                status,
                jobStability
            }
        };
    });
}

/**
 * Calculate debt management score
 */
function calculateDebtManagementScore(inputs) {
    return enhancedSafeCalculation('DebtManagementScore', () => {
        // Get monthly income with partner combination
        const monthlyIncome = getFieldValue(inputs, 
            ['currentMonthlySalary', 'monthlySalary', 'monthlyIncome'], 
            { 
                combinePartners: true,
                defaultValue: 1,
                calculationContext: 'debt_management_income' 
            }
        );
        
        // Get total debt with partner combination
        const totalDebt = getFieldValue(inputs, 
            ['totalDebt', 'currentDebt', 'debt'], 
            { 
                combinePartners: true,
                allowZero: true,
                calculationContext: 'debt_management_total' 
            }
        );
        
        // Get high-interest debt
        const highInterestDebt = getFieldValue(inputs, 
            ['highInterestDebt', 'creditCardDebt'], 
            { 
                combinePartners: true,
                allowZero: true,
                calculationContext: 'debt_management_high_interest' 
            }
        );
        
        // Calculate debt-to-income ratio (annual)
        const annualIncome = monthlyIncome * 12;
        const debtToIncomeResult = safeDivide(totalDebt, annualIncome, 0, 'debt_to_income_ratio');
        const debtToIncomeRatio = debtToIncomeResult.value;
        
        // Get benchmarks
        const benchmarks = SCORE_FACTORS.debtManagement.benchmarks;
        
        // Calculate base score from debt-to-income ratio
        let score = 100;
        let status = 'excellent';
        
        if (debtToIncomeRatio <= benchmarks.excellent) {
            score = 100;
            status = 'excellent';
        } else if (debtToIncomeRatio <= benchmarks.good) {
            score = 90 - (debtToIncomeRatio - benchmarks.excellent) / (benchmarks.good - benchmarks.excellent) * 15;
            status = 'good';
        } else if (debtToIncomeRatio <= benchmarks.fair) {
            score = 75 - (debtToIncomeRatio - benchmarks.good) / (benchmarks.fair - benchmarks.good) * 25;
            status = 'fair';
        } else if (debtToIncomeRatio <= benchmarks.poor) {
            score = 50 - (debtToIncomeRatio - benchmarks.fair) / (benchmarks.poor - benchmarks.fair) * 25;
            status = 'poor';
        } else {
            score = Math.max(0, 25 - (debtToIncomeRatio - benchmarks.poor) * 50);
            status = 'poor';
        }
        
        // Heavy penalty for high-interest debt
        if (highInterestDebt > 0) {
            const highInterestPenalty = Math.min(30, (highInterestDebt / monthlyIncome) * 10);
            score = Math.max(0, score - highInterestPenalty);
        }
        
        // Bonus for no debt
        if (totalDebt === 0) {
            score = 100;
            status = 'excellent';
        }
        
        return {
            score: clampValue(score, 0, 100),
            details: {
                totalDebt,
                highInterestDebt,
                monthlyIncome,
                annualIncome,
                debtToIncomeRatio: Math.round(debtToIncomeRatio * 100) / 100,
                hasHighInterestDebt: highInterestDebt > 0,
                status,
                monthlyDebtPayments: getFieldValue(inputs, 
                    ['monthlyDebtPayments', 'debtPayments'], 
                    { combinePartners: true, allowZero: true }
                )
            }
        };
    });
}

// Export all calculators
window.financialHealthAdditionalCalcs = {
    calculateDiversificationScore,
    calculateTaxEfficiencyScore,
    calculateEmergencyFundScore,
    calculateDebtManagementScore
};

// Export directly for backward compatibility
window.calculateDiversificationScore = calculateDiversificationScore;
window.calculateTaxEfficiencyScore = calculateTaxEfficiencyScore;
window.calculateEmergencyFundScore = calculateEmergencyFundScore;
window.calculateDebtManagementScore = calculateDebtManagementScore;

console.log('✅ Financial Health Additional Calculators loaded');