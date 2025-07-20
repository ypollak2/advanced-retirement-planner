// Pension and Training Fund Calculations
// Comprehensive Israeli retirement planning calculations

class PensionCalculations {
    constructor() {
        this.DEFAULT_PENSION_RATE = 0.21; // 21% total pension contribution
        this.DEFAULT_TRAINING_FUND_RATE = 0.075; // 7.5% training fund contribution
        this.DEFAULT_INFLATION_RATE = 0.03; // 3% annual inflation
        this.DEFAULT_EXPECTED_RETURN = 0.07; // 7% annual return
        this.DEFAULT_ACCUMULATION_FEES = 0.01; // 1% accumulation fees
        this.DEFAULT_TRAINING_FUND_FEES = 0.006; // 0.6% training fund fees
    }

    // Calculate monthly pension contributions
    calculateMonthlyPensionContribution(monthlySalary, pensionRate = this.DEFAULT_PENSION_RATE) {
        return monthlySalary * pensionRate;
    }

    // Calculate monthly training fund contributions with 2024 Israeli tax regulations
    calculateMonthlyTrainingFundContribution(monthlySalary, country = 'israel') {
        if (country !== 'israel') {
            return {
                totalContribution: monthlySalary * this.DEFAULT_TRAINING_FUND_RATE,
                taxDeductible: monthlySalary * this.DEFAULT_TRAINING_FUND_RATE,
                taxableAmount: 0
            };
        }
        
        // 2024 Israeli regulations
        const threshold = 15712; // Monthly salary threshold
        const maxContribution = 1571; // Maximum monthly tax-benefited contribution
        const rate = 0.10; // 10% total (7.5% employer + 2.5% employee)
        
        const totalContribution = monthlySalary * rate;
        
        if (monthlySalary <= threshold) {
            return {
                totalContribution,
                taxDeductible: totalContribution,
                taxableAmount: 0,
                salaryStatus: 'below_threshold'
            };
        } else {
            return {
                totalContribution,
                taxDeductible: maxContribution,
                taxableAmount: totalContribution - maxContribution,
                salaryStatus: 'above_threshold'
            };
        }
    }

    // Calculate net return after fees
    calculateNetReturn(expectedReturn, fees) {
        return Math.max(0.001, expectedReturn - fees); // Minimum 0.1% return
    }

    // Calculate future value with compound interest
    calculateFutureValue(presentValue, annualReturn, years, monthlyContribution = 0) {
        const monthlyReturn = annualReturn / 12;
        const months = years * 12;
        
        // Future value of current savings
        const futureValueCurrent = presentValue * Math.pow(1 + monthlyReturn, months);
        
        // Future value of monthly contributions (annuity)
        let futureValueContributions = 0;
        if (monthlyContribution > 0 && monthlyReturn > 0) {
            futureValueContributions = monthlyContribution * 
                ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn);
        }
        
        return futureValueCurrent + futureValueContributions;
    }

    // Calculate pension fund projection
    calculatePensionProjection(inputs) {
        const currentAge = inputs.currentAge || 30;
        const retirementAge = inputs.retirementAge || 67;
        const yearsToRetirement = Math.max(0, retirementAge - currentAge);
        
        const currentSavings = inputs.currentSavings || 0;
        const monthlySalary = inputs.currentMonthlySalary || 15000;
        const monthlyContribution = this.calculateMonthlyPensionContribution(monthlySalary);
        
        const expectedReturn = (inputs.expectedReturn || 7) / 100;
        const fees = (inputs.accumulationFees || 1.0) / 100;
        const netReturn = this.calculateNetReturn(expectedReturn, fees);
        
        return this.calculateFutureValue(
            currentSavings, 
            netReturn, 
            yearsToRetirement, 
            monthlyContribution
        );
    }

    // Calculate training fund projection with proper tax treatment
    calculateTrainingFundProjection(inputs) {
        const currentAge = inputs.currentAge || 30;
        const retirementAge = inputs.retirementAge || 67;
        const yearsToRetirement = Math.max(0, retirementAge - currentAge);
        
        const currentSavings = inputs.currentTrainingFundSavings || 0;
        const monthlySalary = inputs.currentMonthlySalary || 15000;
        const contributionInfo = this.calculateMonthlyTrainingFundContribution(monthlySalary, inputs.taxCountry);
        
        const expectedReturn = (inputs.expectedReturn || 7) / 100;
        const fees = (inputs.trainingFundFees || 0.6) / 100;
        const netReturn = this.calculateNetReturn(expectedReturn, fees);
        
        // Calculate projections for both tax-deductible and taxable portions
        const taxDeductibleProjection = this.calculateFutureValue(
            currentSavings, 
            netReturn, 
            yearsToRetirement, 
            contributionInfo.taxDeductible || contributionInfo.totalContribution
        );
        
        // For amounts above threshold, factor in tax implications
        let taxableProjection = 0;
        if (contributionInfo.taxableAmount > 0) {
            // Above-threshold contributions are subject to different tax treatment
            const taxableReturn = netReturn * 0.75; // 25% tax on gains for above-threshold amounts
            taxableProjection = this.calculateFutureValue(
                0, 
                taxableReturn, 
                yearsToRetirement, 
                contributionInfo.taxableAmount
            );
        }
        
        return {
            total: taxDeductibleProjection + taxableProjection,
            taxDeductible: taxDeductibleProjection,
            taxable: taxableProjection,
            monthlyContribution: contributionInfo.totalContribution,
            salaryStatus: contributionInfo.salaryStatus
        };
    }

    // Calculate combined projection for couples
    calculateCoupleProjection(inputs) {
        if (inputs.planningType !== 'couple') {
            return this.calculatePensionProjection(inputs) + this.calculateTrainingFundProjection(inputs);
        }

        // Partner 1 calculations
        const partner1Inputs = {
            ...inputs,
            currentMonthlySalary: inputs.partner1Salary || 15000,
            currentSavings: inputs.partner1PensionSavings || 0,
            currentTrainingFundSavings: inputs.partner1TrainingFundSavings || 0
        };

        // Partner 2 calculations
        const partner2Inputs = {
            ...inputs,
            currentMonthlySalary: inputs.partner2Salary || 12000,
            currentSavings: inputs.partner2PensionSavings || 0,
            currentTrainingFundSavings: inputs.partner2TrainingFundSavings || 0
        };

        const partner1Pension = this.calculatePensionProjection(partner1Inputs);
        const partner1Training = this.calculateTrainingFundProjection(partner1Inputs);
        const partner2Pension = this.calculatePensionProjection(partner2Inputs);
        const partner2Training = this.calculateTrainingFundProjection(partner2Inputs);

        return {
            partner1Total: partner1Pension + partner1Training,
            partner2Total: partner2Pension + partner2Training,
            combinedTotal: partner1Pension + partner1Training + partner2Pension + partner2Training,
            partner1Pension,
            partner1Training,
            partner2Pension,
            partner2Training
        };
    }

    // Calculate inflation-adjusted value (buying power)
    calculateInflationAdjustedValue(futureValue, years, inflationRate = this.DEFAULT_INFLATION_RATE) {
        return futureValue / Math.pow(1 + inflationRate, years);
    }

    // Calculate monthly retirement income
    calculateMonthlyRetirementIncome(totalSavings, withdrawalRate = 0.04) {
        return (totalSavings * withdrawalRate) / 12;
    }

    // Generate year-by-year projection data for charts
    generateYearlyProjections(inputs) {
        const currentAge = inputs.currentAge || 30;
        const retirementAge = inputs.retirementAge || 67;
        const projections = [];

        for (let age = currentAge; age <= retirementAge; age++) {
            const yearsFromNow = age - currentAge;
            
            // Calculate projections at this age
            const tempInputs = { ...inputs, currentAge: age };
            const pensionValue = this.calculatePensionProjection(tempInputs);
            const trainingValue = this.calculateTrainingFundProjection(tempInputs);
            const totalValue = pensionValue + trainingValue;
            const inflationAdjusted = this.calculateInflationAdjustedValue(totalValue, yearsFromNow);

            projections.push({
                age,
                year: new Date().getFullYear() + yearsFromNow,
                pensionFund: pensionValue,
                trainingFund: trainingValue,
                total: totalValue,
                inflationAdjusted,
                monthlyIncome: this.calculateMonthlyRetirementIncome(totalValue)
            });
        }

        return projections;
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PensionCalculations;
} else {
    window.PensionCalculations = PensionCalculations;
}