// Core Retirement Calculations Module
// Main retirement calculation engine

window.calculateRetirement = (
    inputs, 
    workPeriods = [], 
    pensionIndexAllocation = [], 
    trainingFundIndexAllocation = [],
    historicalReturns = {},
    monthlyTrainingFundContribution = 0,
    partnerWorkPeriods = []
) => {
    const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
    
    if (yearsToRetirement <= 0) {
        return null;
    }
    
    // Partner salary aggregation for couple mode
    const calculateTotalIncome = (inputs) => {
        if (inputs.planningType === 'couple') {
            // In couple mode, ONLY use partner fields - no fallback to main person fields
            const partner1Salary = parseFloat(inputs.partner1Salary || 0);
            const partner2Salary = parseFloat(inputs.partner2Salary || inputs.partnerSalary || 0);
            return partner1Salary + partner2Salary;
        }
        return parseFloat(inputs.currentSalary || 0);
    };
    
    const combinedIncome = calculateTotalIncome(inputs);
    const totalIncome = combinedIncome; // Alias for test compatibility

    // Apply dynamic return adjustments based on age and risk tolerance
    let enhancedInputs = inputs;
    if (window.dynamicReturnAssumptions && window.dynamicReturnAssumptions.applyDynamicReturns) {
        try {
            enhancedInputs = window.dynamicReturnAssumptions.applyDynamicReturns(inputs);
            console.log('✅ Dynamic return adjustments applied to calculation', {
                originalReturns: {
                    pension: inputs.pensionReturn,
                    trainingFund: inputs.trainingFundReturn,
                    personalPortfolio: inputs.personalPortfolioReturn
                },
                adjustedReturns: {
                    pension: enhancedInputs.pensionReturn,
                    trainingFund: enhancedInputs.trainingFundReturn,
                    personalPortfolio: enhancedInputs.personalPortfolioReturn
                }
            });
        } catch (error) {
            console.warn('⚠️ Error applying dynamic return adjustments, using original inputs:', error);
            enhancedInputs = inputs;
        }
    }
    
    // Use enhanced inputs for all calculations
    inputs = enhancedInputs;

    // Provide default allocations if not specified
    const defaultPensionAllocation = [
        { name: 'Mixed Portfolio', allocation: 100, historicalReturn: 6.5 }
    ];
    const defaultTrainingFundAllocation = [
        { name: 'Conservative Portfolio', allocation: 100, historicalReturn: 5.5 }
    ];
    
    const validPensionAllocation = Array.isArray(pensionIndexAllocation) && pensionIndexAllocation.length > 0 
        ? pensionIndexAllocation : defaultPensionAllocation;
    const validTrainingFundAllocation = Array.isArray(trainingFundIndexAllocation) && trainingFundIndexAllocation.length > 0 
        ? trainingFundIndexAllocation : defaultTrainingFundAllocation;
    
    const basePensionWeightedReturn = window.calculateWeightedReturn(validPensionAllocation, yearsToRetirement, historicalReturns);
    const baseTrainingFundWeightedReturn = window.calculateWeightedReturn(validTrainingFundAllocation, yearsToRetirement, historicalReturns);
    
    // Apply dynamic return assumptions if available
    const effectivePensionReturn = inputs.pensionReturn !== undefined ? inputs.pensionReturn : basePensionWeightedReturn;
    const effectiveTrainingFundReturn = inputs.trainingFundReturn !== undefined ? inputs.trainingFundReturn : baseTrainingFundWeightedReturn;
    
    const pensionWeightedReturn = window.getAdjustedReturn(effectivePensionReturn, inputs.riskTolerance);
    const trainingFundWeightedReturn = window.getAdjustedReturn(effectiveTrainingFundReturn, inputs.riskTolerance);

    // Enhanced field mapping for savings values
    let totalPensionSavings = parseFloat(
        inputs.currentSavings || inputs.pensionSavings || inputs.currentPensionSavings || 
        inputs.retirementSavings || inputs.currentRetirementSavings || 0
    );
    let totalTrainingFund = parseFloat(
        inputs.currentTrainingFund || inputs.trainingFund || inputs.trainingFundValue || 0
    );
    
    // Personal portfolio - don't apply tax here, apply it on withdrawal income
    let totalPersonalPortfolio = parseFloat(
        inputs.currentPersonalPortfolio || inputs.personalPortfolio || inputs.portfolioValue || 0
    );
    
    let totalCrypto = parseFloat(
        inputs.currentCrypto || inputs.crypto || inputs.cryptoValue || inputs.currentCryptoFiatValue || 0
    );
    let totalRealEstate = parseFloat(
        inputs.currentRealEstate || inputs.realEstate || inputs.realEstateValue || 0
    );
    let periodResults = [];
    
    // Ensure workPeriods is an array to prevent iteration errors
    const validWorkPeriods = Array.isArray(workPeriods) ? workPeriods : [];
    const sortedPeriods = [...validWorkPeriods].sort((a, b) => a.startAge - b.startAge);
    
    // Calculate pension savings from work periods
    for (const period of sortedPeriods) {
        if (!period || !period.country || !window.countryData || !window.countryData[period.country]) {
            console.warn('Invalid work period or country data:', period);
            continue;
        }
        const country = window.countryData[period.country];
        const periodYears = Math.max(0, Math.min(period.endAge, inputs.retirementAge) - Math.max(period.startAge, inputs.currentAge));
        
        if (periodYears > 0) {
            const adjustedPensionReturn = window.getAdjustedReturn(period.pensionReturn, inputs.riskTolerance);
            const effectiveReturn = adjustedPensionReturn - period.pensionAnnualFee;
            const monthlyReturn = effectiveReturn / 100 / 12;
            const periodMonths = periodYears * 12;
            
            const existingGrowth = totalPensionSavings * Math.pow(1 + monthlyReturn, periodMonths);
            
            const netMonthlyContribution = period.monthlyContribution * (1 - period.pensionDepositFee / 100);
            const contributionsValue = netMonthlyContribution * (Math.pow(1 + monthlyReturn, periodMonths) - 1) / monthlyReturn;
            
            const newTotal = existingGrowth + contributionsValue;
            
            periodResults.push({
                country: period.country,
                countryName: country.name,
                flag: country.flag,
                years: periodYears,
                contributions: period.monthlyContribution * periodMonths,
                netContributions: netMonthlyContribution * periodMonths,
                growth: newTotal - totalPensionSavings,
                pensionReturn: adjustedPensionReturn,
                pensionDepositFee: period.pensionDepositFee,
                pensionAnnualFee: period.pensionAnnualFee,
                pensionEffectiveReturn: effectiveReturn,
                monthlyTrainingFund: period.monthlyTrainingFund
            });
            
            totalPensionSavings = newTotal;
        }
    }

    // Calculate training fund
    const adjustedTrainingFundReturn = window.getAdjustedReturn(inputs.trainingFundReturn, inputs.riskTolerance);
    const trainingFundNetReturn = adjustedTrainingFundReturn - inputs.trainingFundManagementFee;
    
    totalTrainingFund = totalTrainingFund * Math.pow(1 + trainingFundNetReturn / 100, yearsToRetirement);
    
    for (const period of sortedPeriods) {
        const periodYears = Math.max(0, Math.min(period.endAge, inputs.retirementAge) - Math.max(period.startAge, inputs.currentAge));
        if (periodYears > 0) {
            const monthlyReturn = trainingFundNetReturn / 100 / 12;
            const periodMonths = periodYears * 12;
            const contributionsValue = monthlyTrainingFundContribution * (Math.pow(1 + monthlyReturn, periodMonths) - 1) / monthlyReturn;
            totalTrainingFund += contributionsValue;
        }
    }

    // Calculate Personal Portfolio
    const adjustedPersonalPortfolioReturn = window.getAdjustedReturn(inputs.personalPortfolioReturn, inputs.riskTolerance);
    const personalPortfolioMonthlyReturn = adjustedPersonalPortfolioReturn / 100 / 12;
    const personalPortfolioMonths = yearsToRetirement * 12;
    
    const personalPortfolioGrowth = totalPersonalPortfolio * Math.pow(1 + personalPortfolioMonthlyReturn, personalPortfolioMonths);
    const personalPortfolioContributions = inputs.personalPortfolioMonthly * (Math.pow(1 + personalPortfolioMonthlyReturn, personalPortfolioMonths) - 1) / personalPortfolioMonthlyReturn;
    totalPersonalPortfolio = personalPortfolioGrowth + personalPortfolioContributions;

    // Calculate Cryptocurrency
    const adjustedCryptoReturn = window.getAdjustedReturn(inputs.cryptoReturn, inputs.riskTolerance);
    const cryptoMonthlyReturn = adjustedCryptoReturn / 100 / 12;
    const cryptoMonths = yearsToRetirement * 12;
    
    const cryptoGrowth = totalCrypto * Math.pow(1 + cryptoMonthlyReturn, cryptoMonths);
    const cryptoContributions = inputs.cryptoMonthly * (Math.pow(1 + cryptoMonthlyReturn, cryptoMonths) - 1) / cryptoMonthlyReturn;
    totalCrypto = cryptoGrowth + cryptoContributions;

    // Calculate Real Estate
    const adjustedRealEstateReturn = window.getAdjustedReturn(inputs.realEstateReturn, inputs.riskTolerance);
    const realEstateMonthlyReturn = adjustedRealEstateReturn / 100 / 12;
    const realEstateMonths = yearsToRetirement * 12;
    
    const realEstateGrowth = totalRealEstate * Math.pow(1 + realEstateMonthlyReturn, realEstateMonths);
    const realEstateContributions = inputs.realEstateMonthly * (Math.pow(1 + realEstateMonthlyReturn, realEstateMonths) - 1) / realEstateMonthlyReturn;
    totalRealEstate = realEstateGrowth + realEstateContributions;

    // Calculate Real Estate Rental Income
    const realEstateRentalIncome = totalRealEstate * (inputs.realEstateRentalYield / 100) / 12;
    
    // Partner Calculations (if enabled)
    let partnerResults = null;
    if (inputs.partnerPlanningEnabled && partnerWorkPeriods.length > 0) {
        const partnerYearsToRetirement = inputs.partnerRetirementAge - inputs.partnerCurrentAge;
        
        if (partnerYearsToRetirement > 0) {
            // Calculate partner pension
            let totalPartnerPensionSavings = inputs.partnerCurrentSavings;
            const partnerPeriodResults = [];
            
            for (const period of partnerWorkPeriods) {
                const startAge = Math.max(period.startAge, inputs.partnerCurrentAge);
                const endAge = Math.min(period.endAge, inputs.partnerRetirementAge);
                const years = endAge - startAge;
                
                if (years > 0) {
                    const partnerPensionReturn = window.calculateWeightedReturn(pensionIndexAllocation, years, historicalReturns);
                    const adjustedPartnerPensionReturn = window.getAdjustedReturn(partnerPensionReturn, inputs.riskTolerance);
                    const partnerMonthlyReturn = adjustedPartnerPensionReturn / 100 / 12;
                    const months = years * 12;
                    
                    const partnerGrowth = totalPartnerPensionSavings * Math.pow(1 + partnerMonthlyReturn, months);
                    const partnerContributions = period.monthlyContribution * (Math.pow(1 + partnerMonthlyReturn, months) - 1) / partnerMonthlyReturn;
                    
                    totalPartnerPensionSavings = partnerGrowth + partnerContributions;
                    
                    partnerPeriodResults.push({
                        country: period.country,
                        years: years,
                        growth: partnerGrowth + partnerContributions,
                        contributions: period.monthlyContribution * months
                    });
                }
            }
            
            // Calculate partner training fund
            let totalPartnerTrainingFund = inputs.partnerCurrentTrainingFund;
            const partnerTrainingReturn = window.calculateWeightedReturn(trainingFundIndexAllocation, partnerYearsToRetirement, historicalReturns);
            const adjustedPartnerTrainingReturn = window.getAdjustedReturn(partnerTrainingReturn, inputs.riskTolerance);
            const partnerTrainingMonthlyReturn = adjustedPartnerTrainingReturn / 100 / 12;
            const partnerTrainingMonths = partnerYearsToRetirement * 12;
            
            const partnerTrainingGrowth = totalPartnerTrainingFund * Math.pow(1 + partnerTrainingMonthlyReturn, partnerTrainingMonths);
            const partnerTrainingContributions = partnerWorkPeriods.reduce((sum, period) => sum + period.monthlyTrainingFund, 0) * (Math.pow(1 + partnerTrainingMonthlyReturn, partnerTrainingMonths) - 1) / partnerTrainingMonthlyReturn;
            totalPartnerTrainingFund = partnerTrainingGrowth + partnerTrainingContributions;
            
            // Calculate partner personal portfolio with capital gains tax applied
            const grossPartnerPortfolio = inputs.partnerCurrentPersonalPortfolio || 0;
            const partnerPortfolioTaxRate = (inputs.partnerPersonalPortfolioTaxRate || 25) / 100;
            let totalPartnerPersonalPortfolio = grossPartnerPortfolio * (1 - partnerPortfolioTaxRate);
            const adjustedPartnerPersonalReturn = window.getAdjustedReturn(inputs.partnerPersonalPortfolioReturn, inputs.riskTolerance);
            const partnerPersonalMonthlyReturn = adjustedPartnerPersonalReturn / 100 / 12;
            const partnerPersonalMonths = partnerYearsToRetirement * 12;
            
            const partnerPersonalGrowth = totalPartnerPersonalPortfolio * Math.pow(1 + partnerPersonalMonthlyReturn, partnerPersonalMonths);
            const partnerPersonalContributions = inputs.partnerPersonalPortfolioMonthly * (Math.pow(1 + partnerPersonalMonthlyReturn, partnerPersonalMonths) - 1) / partnerPersonalMonthlyReturn;
            totalPartnerPersonalPortfolio = partnerPersonalGrowth + partnerPersonalContributions;
            
            partnerResults = {
                totalPensionSavings: totalPartnerPensionSavings,
                totalTrainingFund: totalPartnerTrainingFund,
                totalPersonalPortfolio: totalPartnerPersonalPortfolio,
                periodResults: partnerPeriodResults,
                yearsToRetirement: partnerYearsToRetirement
            };
        }
    }

    // Delegate income calculations to income module
    if (window.RetirementIncome && window.RetirementIncome.calculateRetirementIncome) {
        return window.RetirementIncome.calculateRetirementIncome({
            inputs,
            yearsToRetirement,
            totalPensionSavings,
            totalTrainingFund,
            totalPersonalPortfolio,
            totalCrypto,
            totalRealEstate,
            realEstateRentalIncome,
            periodResults,
            sortedPeriods,
            workPeriods,
            partnerResults,
            weightedTaxRate: 0, // Will be calculated in income module
            pensionWeightedReturn,
            trainingFundWeightedReturn,
            trainingFundNetReturn,
            combinedIncome,
            totalIncome
        });
    }

    // Fallback - return basic results
    return {
        totalSavings: totalPensionSavings,
        trainingFundValue: totalTrainingFund,
        personalPortfolioValue: totalPersonalPortfolio,
        currentCrypto: totalCrypto,
        currentRealEstate: totalRealEstate,
        periodResults,
        error: 'Income calculation module not loaded'
    };
};

// Export function
window.CoreCalculations = {
    calculateRetirement: window.calculateRetirement
};

console.log('✅ Core retirement calculations module loaded');