// Tax Optimization Calculator for Advanced Retirement Planner
// Provides detailed tax benefit calculations for pension and training fund contributions

window.taxOptimization = {
    
    // Calculate precise tax savings from pension contributions
    calculatePensionTaxSavings: (grossAnnualSalary, pensionContributionRate, country = 'israel') => {
        if (country !== 'israel') {
            // For now, focus on Israeli calculations - can expand later
            return { taxSavings: 0, effectiveRate: 0, details: {} };
        }
        
        const pensionContribution = grossAnnualSalary * (pensionContributionRate / 100);
        const taxableIncomeWithoutPension = grossAnnualSalary;
        const taxableIncomeWithPension = grossAnnualSalary - pensionContribution;
        
        const taxWithoutPension = this.calculateIsraeliIncomeTax(taxableIncomeWithoutPension);
        const taxWithPension = this.calculateIsraeliIncomeTax(taxableIncomeWithPension);
        
        const annualTaxSavings = taxWithoutPension.totalTax - taxWithPension.totalTax;
        const monthlyTaxSavings = annualTaxSavings / 12;
        const effectiveRate = pensionContribution > 0 ? (annualTaxSavings / pensionContribution) * 100 : 0;
        
        return {
            annualPensionContribution: Math.round(pensionContribution),
            monthlyPensionContribution: Math.round(pensionContribution / 12),
            annualTaxSavings: Math.round(annualTaxSavings),
            monthlyTaxSavings: Math.round(monthlyTaxSavings),
            effectiveRate: Math.round(effectiveRate * 100) / 100, // 2 decimal places
            marginalTaxRate: taxWithoutPension.marginalRate,
            netCostOfContribution: Math.round(pensionContribution - annualTaxSavings),
            details: {
                taxWithoutPension: taxWithoutPension,
                taxWithPension: taxWithPension,
                taxableReduction: Math.round(pensionContribution)
            }
        };
    },
    
    // Calculate training fund tax benefits
    calculateTrainingFundTaxSavings: (grossMonthlySalary, contributionAmount, country = 'israel') => {
        if (country !== 'israel') {
            return { taxSavings: 0, isDeductible: false, details: {} };
        }
        
        const annualSalary = grossMonthlySalary * 12;
        const annualContribution = contributionAmount * 12;
        const threshold = 15792 * 12; // ₪15,792/month = ₪189,504/year
        
        let deductibleAmount = 0;
        let taxableAmount = 0;
        
        if (annualSalary <= threshold) {
            // Below threshold - full deduction
            deductibleAmount = annualContribution;
            taxableAmount = 0;
        } else {
            // Above threshold - limited deduction
            const maxDeductible = threshold * 0.10; // 10% of threshold
            deductibleAmount = Math.min(annualContribution, maxDeductible);
            taxableAmount = annualContribution - deductibleAmount;
        }
        
        const taxSavings = this.calculateTaxSavingsFromDeduction(annualSalary, deductibleAmount);
        
        return {
            monthlyContribution: Math.round(contributionAmount),
            annualContribution: Math.round(annualContribution),
            deductibleAmount: Math.round(deductibleAmount),
            taxableAmount: Math.round(taxableAmount),
            annualTaxSavings: Math.round(taxSavings.savings),
            monthlyTaxSavings: Math.round(taxSavings.savings / 12),
            effectiveRate: annualContribution > 0 ? Math.round((taxSavings.savings / annualContribution) * 10000) / 100 : 0,
            isAboveThreshold: annualSalary > threshold,
            marginalRate: taxSavings.marginalRate
        };
    },
    
    // Calculate optimal pension contribution for maximum tax efficiency
    calculateOptimalContribution: (grossMonthlySalary, country = 'israel') => {
        if (country !== 'israel') {
            return { optimalRate: 7, reasoning: 'Default rate for non-Israeli calculations' };
        }
        
        const annualSalary = grossMonthlySalary * 12;
        const marginalRate = this.getMarginalTaxRate(annualSalary);
        
        let optimalRate = 7; // Israeli legal maximum for tax deduction
        let reasoning = '';
        
        if (marginalRate >= 35) {
            optimalRate = 7;
            reasoning = 'Maximum 7% recommended due to high marginal tax rate (35%+)';
        } else if (marginalRate >= 20) {
            optimalRate = 7;
            reasoning = 'Maximum 7% recommended due to good marginal tax rate (20%+)';
        } else if (marginalRate >= 14) {
            optimalRate = 5;
            reasoning = 'Consider 5% due to moderate marginal tax rate (14%)';
        } else {
            optimalRate = 3;
            reasoning = 'Lower contribution may be sufficient due to low marginal tax rate (10%)';
        }
        
        const savings = window.taxOptimization.calculatePensionTaxSavings(annualSalary, optimalRate, country);
        
        return {
            optimalRate,
            reasoning,
            marginalTaxRate: marginalRate,
            projectedAnnualSavings: savings.annualTaxSavings,
            projectedMonthlySavings: savings.monthlyTaxSavings,
            netMonthlyCost: Math.round((annualSalary * optimalRate / 100 / 12) - savings.monthlyTaxSavings)
        };
    },
    
    // Israeli income tax calculation (matching TaxCalculators.js)
    calculateIsraeliIncomeTax: (annualIncome) => {
        const brackets = [
            { min: 0, max: 81480, rate: 0.10 },
            { min: 81480, max: 116760, rate: 0.14 },
            { min: 116760, max: 188280, rate: 0.20 },
            { min: 188280, max: 269280, rate: 0.31 },
            { min: 269280, max: 558240, rate: 0.35 },
            { min: 558240, max: 718440, rate: 0.47 },
            { min: 718440, max: Infinity, rate: 0.50 }
        ];
        
        let totalTax = 0;
        let remainingIncome = annualIncome;
        let marginalRate = 0;
        
        for (const bracket of brackets) {
            if (remainingIncome <= 0) break;
            
            const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
            if (taxableInBracket > 0) {
                totalTax += taxableInBracket * bracket.rate;
                marginalRate = bracket.rate; // Track the highest rate used
                remainingIncome -= taxableInBracket;
            }
        }
        
        return {
            totalTax,
            marginalRate: marginalRate * 100, // Convert to percentage
            effectiveRate: annualIncome > 0 ? (totalTax / annualIncome) * 100 : 0
        };
    },
    
    // Get marginal tax rate for income level
    getMarginalTaxRate: (annualIncome) => {
        const taxResult = this.calculateIsraeliIncomeTax(annualIncome);
        return taxResult.marginalRate;
    },
    
    // Calculate tax savings from any deduction
    calculateTaxSavingsFromDeduction: (annualIncome, deductionAmount) => {
        const taxWithoutDeduction = this.calculateIsraeliIncomeTax(annualIncome);
        const taxWithDeduction = this.calculateIsraeliIncomeTax(annualIncome - deductionAmount);
        
        return {
            savings: taxWithoutDeduction.totalTax - taxWithDeduction.totalTax,
            marginalRate: taxWithoutDeduction.marginalRate
        };
    },
    
    // Comprehensive tax optimization analysis
    analyzePersonalTaxSituation: (inputs) => {
        const monthlySalary = inputs.currentMonthlySalary || 0;
        const annualSalary = monthlySalary * 12;
        const country = inputs.taxCountry || 'israel';
        
        if (country !== 'israel' || monthlySalary === 0) {
            return { analysis: 'Limited analysis for non-Israeli or zero salary' };
        }
        
        const currentPensionRate = inputs.pensionContributionRate || 7;
        const currentTrainingFund = inputs.monthlyTrainingFundContribution || 0;
        
        const pensionAnalysis = window.taxOptimization.calculatePensionTaxSavings(annualSalary, currentPensionRate, country);
        const trainingFundAnalysis = window.taxOptimization.calculateTrainingFundTaxSavings(monthlySalary, currentTrainingFund, country);
        const optimalSuggestion = window.taxOptimization.calculateOptimalContribution(monthlySalary, country);
        
        const totalMonthlySavings = pensionAnalysis.monthlyTaxSavings + trainingFundAnalysis.monthlyTaxSavings;
        const totalAnnualSavings = pensionAnalysis.annualTaxSavings + trainingFundAnalysis.annualTaxSavings;
        
        return {
            salary: {
                monthly: Math.round(monthlySalary),
                annual: Math.round(annualSalary),
                marginalTaxRate: pensionAnalysis.marginalTaxRate
            },
            pension: pensionAnalysis,
            trainingFund: trainingFundAnalysis,
            optimal: optimalSuggestion,
            summary: {
                totalMonthlySavings: Math.round(totalMonthlySavings),
                totalAnnualSavings: Math.round(totalAnnualSavings),
                effectiveTaxReduction: annualSalary > 0 ? Math.round((totalAnnualSavings / annualSalary) * 10000) / 100 : 0
            },
            recommendations: window.taxOptimization.generateRecommendations(pensionAnalysis, trainingFundAnalysis, optimalSuggestion, inputs)
        };
    },
    
    // Generate personalized tax optimization recommendations
    generateRecommendations: (pensionAnalysis, trainingFundAnalysis, optimalSuggestion, inputs) => {
        const recommendations = [];
        const currentRate = inputs.pensionContributionRate || 7;
        
        // Pension contribution recommendations
        if (currentRate < optimalSuggestion.optimalRate) {
            recommendations.push({
                type: 'pension_increase',
                priority: 'high',
                title: 'Increase Pension Contribution',
                description: `Consider increasing pension contribution from ${currentRate}% to ${optimalSuggestion.optimalRate}%`,
                impact: `Additional monthly tax savings: ₪${Math.round((optimalSuggestion.projectedMonthlySavings - pensionAnalysis.monthlyTaxSavings))}`,
                action: `Set pension rate to ${optimalSuggestion.optimalRate}%`
            });
        }
        
        // Training fund recommendations
        if (trainingFundAnalysis.isAboveThreshold && trainingFundAnalysis.taxableAmount > 0) {
            recommendations.push({
                type: 'training_fund_optimization',
                priority: 'medium',
                title: 'Optimize Training Fund Contribution',
                description: 'You are above the training fund threshold - consider reducing excess contribution',
                impact: `₪${trainingFundAnalysis.taxableAmount} annually is not tax-deductible`,
                action: 'Consider reducing training fund to maximize tax efficiency'
            });
        } else if (!trainingFundAnalysis.isAboveThreshold && trainingFundAnalysis.monthlyContribution < 1579) {
            recommendations.push({
                type: 'training_fund_increase',
                priority: 'medium',
                title: 'Consider Training Fund Contribution',
                description: 'You can contribute more to training fund with full tax benefits',
                impact: 'Additional tax-deductible savings opportunity',
                action: 'Consider increasing training fund contribution'
            });
        }
        
        // High earner recommendations
        if (pensionAnalysis.marginalTaxRate >= 35) {
            recommendations.push({
                type: 'high_earner_strategy',
                priority: 'high',
                title: 'High Earner Tax Strategy',
                description: 'At your income level, maximizing tax-advantaged savings is crucial',
                impact: `Your marginal tax rate is ${pensionAnalysis.marginalTaxRate}%`,
                action: 'Maximize all available tax-deferred savings options'
            });
        }
        
        return recommendations;
    }
};

// Export function for global access
window.calculateTaxOptimization = window.taxOptimization.analyzePersonalTaxSituation;
window.calculateOptimalPensionRate = window.taxOptimization.calculateOptimalContribution;