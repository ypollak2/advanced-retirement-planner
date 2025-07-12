// Retirement calculations for GitHub Pages compatibility
// Dependencies: countryData, riskScenarios from marketConstants.js

window.formatCurrency = (amount) => {
    return new Intl.NumberFormat('he-IL', {
        style: 'currency',
        currency: 'ILS',
        minimumFractionDigits: 0
    }).format(amount);
};

window.convertCurrency = (amount, currency, exchangeRates) => {
    const convertedAmount = amount / exchangeRates[currency];
    const formatters = {
        USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }),
        GBP: new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }),
        EUR: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })
    };
    return formatters[currency].format(convertedAmount);
};

window.getNetReturn = (grossReturn, managementFee) => {
    return grossReturn - managementFee;
};

window.calculateWeightedReturn = (allocations, timeHorizon = 20, historicalReturns) => {
    let totalReturn = 0;
    let totalPercentage = 0;
    
    const availableTimeHorizons = [5, 10, 15, 20, 25, 30];
    const closestTimeHorizon = availableTimeHorizons.reduce((prev, curr) => 
        Math.abs(curr - timeHorizon) < Math.abs(prev - timeHorizon) ? curr : prev
    );
    
    allocations.forEach(allocation => {
        if (allocation.percentage > 0) {
            const returnRate = allocation.customReturn !== null 
                ? allocation.customReturn 
                : (historicalReturns[closestTimeHorizon] && historicalReturns[closestTimeHorizon][allocation.index]) || 0;
            
            totalReturn += (returnRate * allocation.percentage / 100);
            totalPercentage += allocation.percentage;
        }
    });
    
    return totalPercentage > 0 ? totalReturn : 0;
};

window.getAdjustedReturn = (baseReturn, riskLevel = 'moderate') => {
    const riskMultiplier = riskScenarios[riskLevel]?.multiplier || 1.0;
    return baseReturn * riskMultiplier;
};

window.calculateRetirement = (
    inputs, 
    workPeriods, 
    pensionIndexAllocation, 
    trainingFundIndexAllocation,
    historicalReturns,
    monthlyTrainingFundContribution,
    partnerWorkPeriods = []
) => {
    const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
    
    if (yearsToRetirement <= 0) {
        return null;
    }

    const basePensionWeightedReturn = calculateWeightedReturn(pensionIndexAllocation, yearsToRetirement, historicalReturns);
    const baseTrainingFundWeightedReturn = calculateWeightedReturn(trainingFundIndexAllocation, yearsToRetirement, historicalReturns);
    
    const pensionWeightedReturn = getAdjustedReturn(basePensionWeightedReturn, inputs.riskTolerance);
    const trainingFundWeightedReturn = getAdjustedReturn(baseTrainingFundWeightedReturn, inputs.riskTolerance);

    let totalPensionSavings = inputs.currentSavings;
    let totalTrainingFund = inputs.currentTrainingFund;
    let totalPersonalPortfolio = inputs.currentPersonalPortfolio;
    let totalCrypto = inputs.currentCrypto;
    let totalRealEstate = inputs.currentRealEstate;
    let periodResults = [];
    
    const sortedPeriods = [...workPeriods].sort((a, b) => a.startAge - b.startAge);
    
    // Calculate pension savings from work periods
    for (const period of sortedPeriods) {
        const country = countryData[period.country];
        const periodYears = Math.max(0, Math.min(period.endAge, inputs.retirementAge) - Math.max(period.startAge, inputs.currentAge));
        
        if (periodYears > 0) {
            const adjustedPensionReturn = getAdjustedReturn(period.pensionReturn, inputs.riskTolerance);
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
    const adjustedTrainingFundReturn = getAdjustedReturn(inputs.trainingFundReturn, inputs.riskTolerance);
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
    const adjustedPersonalPortfolioReturn = getAdjustedReturn(inputs.personalPortfolioReturn, inputs.riskTolerance);
    const personalPortfolioMonthlyReturn = adjustedPersonalPortfolioReturn / 100 / 12;
    const personalPortfolioMonths = yearsToRetirement * 12;
    
    const personalPortfolioGrowth = totalPersonalPortfolio * Math.pow(1 + personalPortfolioMonthlyReturn, personalPortfolioMonths);
    const personalPortfolioContributions = inputs.personalPortfolioMonthly * (Math.pow(1 + personalPortfolioMonthlyReturn, personalPortfolioMonths) - 1) / personalPortfolioMonthlyReturn;
    totalPersonalPortfolio = personalPortfolioGrowth + personalPortfolioContributions;

    // Calculate Cryptocurrency
    const adjustedCryptoReturn = getAdjustedReturn(inputs.cryptoReturn, inputs.riskTolerance);
    const cryptoMonthlyReturn = adjustedCryptoReturn / 100 / 12;
    const cryptoMonths = yearsToRetirement * 12;
    
    const cryptoGrowth = totalCrypto * Math.pow(1 + cryptoMonthlyReturn, cryptoMonths);
    const cryptoContributions = inputs.cryptoMonthly * (Math.pow(1 + cryptoMonthlyReturn, cryptoMonths) - 1) / cryptoMonthlyReturn;
    totalCrypto = cryptoGrowth + cryptoContributions;

    // Calculate Real Estate
    const adjustedRealEstateReturn = getAdjustedReturn(inputs.realEstateReturn, inputs.riskTolerance);
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
                    const partnerPensionReturn = calculateWeightedReturn(pensionIndexAllocation, years, historicalReturns);
                    const adjustedPartnerPensionReturn = getAdjustedReturn(partnerPensionReturn, inputs.riskTolerance);
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
            const partnerTrainingReturn = calculateWeightedReturn(trainingFundIndexAllocation, partnerYearsToRetirement, historicalReturns);
            const adjustedPartnerTrainingReturn = getAdjustedReturn(partnerTrainingReturn, inputs.riskTolerance);
            const partnerTrainingMonthlyReturn = adjustedPartnerTrainingReturn / 100 / 12;
            const partnerTrainingMonths = partnerYearsToRetirement * 12;
            
            const partnerTrainingGrowth = totalPartnerTrainingFund * Math.pow(1 + partnerTrainingMonthlyReturn, partnerTrainingMonths);
            const partnerTrainingContributions = partnerWorkPeriods.reduce((sum, period) => sum + period.monthlyTrainingFund, 0) * (Math.pow(1 + partnerTrainingMonthlyReturn, partnerTrainingMonths) - 1) / partnerTrainingMonthlyReturn;
            totalPartnerTrainingFund = partnerTrainingGrowth + partnerTrainingContributions;
            
            // Calculate partner personal portfolio
            let totalPartnerPersonalPortfolio = inputs.partnerCurrentPersonalPortfolio;
            const adjustedPartnerPersonalReturn = getAdjustedReturn(inputs.partnerPersonalPortfolioReturn, inputs.riskTolerance);
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
    
    // Calculate monthly incomes
    const monthlyPension = totalPensionSavings * 0.04 / 12;
    const monthlyTrainingFundIncome = totalTrainingFund * 0.05 / 12;
    
    // Calculate monthly income from new investment types
    const monthlyPersonalPortfolioIncome = totalPersonalPortfolio * 0.04 / 12;
    const monthlyCryptoIncome = totalCrypto * 0.04 / 12;
    const monthlyRealEstateIncome = totalRealEstate * 0.04 / 12; // Capital gains withdrawal
    
    // Apply taxes to new investment types
    const personalPortfolioTax = monthlyPersonalPortfolioIncome * (inputs.personalPortfolioTaxRate / 100);
    const cryptoTax = monthlyCryptoIncome * (inputs.cryptoTaxRate / 100);
    const realEstateTax = monthlyRealEstateIncome * (inputs.realEstateTaxRate / 100);
    
    const netPersonalPortfolioIncome = monthlyPersonalPortfolioIncome - personalPortfolioTax;
    const netCryptoIncome = monthlyCryptoIncome - cryptoTax;
    const netRealEstateIncome = monthlyRealEstateIncome - realEstateTax + realEstateRentalIncome;
    
    // Calculate pension tax
    let weightedTaxRate = 0;
    let totalWeight = 0;
    
    for (const result of periodResults) {
        const country = countryData[result.country];
        weightedTaxRate += country.pensionTax * result.growth;
        totalWeight += result.growth;
    }
    
    if (totalWeight > 0) {
        weightedTaxRate = weightedTaxRate / totalWeight;
    } else {
        weightedTaxRate = countryData[workPeriods[0].country].pensionTax;
    }
    
    const pensionTax = monthlyPension * weightedTaxRate;
    const netPension = monthlyPension - pensionTax;
    const netTrainingFundIncome = monthlyTrainingFundIncome;
    
    const lastCountry = countryData[sortedPeriods[sortedPeriods.length - 1].country];
    const socialSecurity = lastCountry.socialSecurity;
    
    // Calculate partner income (if applicable)
    let partnerNetIncome = 0;
    let partnerSocialSecurity = 0;
    if (partnerResults) {
        const partnerMonthlyPension = partnerResults.totalPensionSavings * 0.04 / 12;
        const partnerMonthlyTrainingFund = partnerResults.totalTrainingFund * 0.05 / 12;
        const partnerMonthlyPersonalPortfolio = partnerResults.totalPersonalPortfolio * 0.04 / 12;
        
        // Apply taxes to partner income
        const partnerPensionTax = partnerMonthlyPension * (weightedTaxRate / 100);
        const partnerPersonalTax = partnerMonthlyPersonalPortfolio * (inputs.partnerPersonalPortfolioTaxRate / 100);
        
        const partnerNetPension = partnerMonthlyPension - partnerPensionTax;
        const partnerNetTrainingFund = partnerMonthlyTrainingFund; // Usually tax-free
        const partnerNetPersonalPortfolio = partnerMonthlyPersonalPortfolio - partnerPersonalTax;
        
        partnerSocialSecurity = lastCountry.socialSecurity; // Same country assumed
        partnerNetIncome = partnerNetPension + partnerNetTrainingFund + partnerNetPersonalPortfolio + partnerSocialSecurity;
    }
    
    const individualNetIncome = netPension + netTrainingFundIncome + socialSecurity + netPersonalPortfolioIncome + netCryptoIncome + netRealEstateIncome;
    const totalNetIncome = individualNetIncome + partnerNetIncome;
    
    // Calculate expenses (joint if partner enabled, individual otherwise)
    const baseExpenses = inputs.partnerPlanningEnabled && inputs.jointMonthlyExpenses > 0 
        ? inputs.jointMonthlyExpenses 
        : inputs.currentMonthlyExpenses;
    const futureMonthlyExpenses = baseExpenses * Math.pow(1 + inputs.inflationRate / 100, yearsToRetirement);
    const remainingAfterExpenses = totalNetIncome - futureMonthlyExpenses;

    const currentSalary = workPeriods.length > 0 ? workPeriods[workPeriods.length - 1].salary : 0;
    const targetMonthlyIncome = (currentSalary * inputs.targetReplacement) / 100;
    const achievesTarget = totalNetIncome >= targetMonthlyIncome;

    return {
        // Individual results
        totalSavings: Math.round(totalPensionSavings),
        trainingFundValue: Math.round(totalTrainingFund),
        personalPortfolioValue: Math.round(totalPersonalPortfolio),
        cryptoValue: Math.round(totalCrypto),
        realEstateValue: Math.round(totalRealEstate),
        monthlyPension: Math.round(monthlyPension),
        monthlyTrainingFundIncome: Math.round(monthlyTrainingFundIncome),
        monthlyPersonalPortfolioIncome: Math.round(monthlyPersonalPortfolioIncome),
        monthlyCryptoIncome: Math.round(monthlyCryptoIncome),
        monthlyRealEstateIncome: Math.round(monthlyRealEstateIncome),
        realEstateRentalIncome: Math.round(realEstateRentalIncome),
        pensionTax: Math.round(pensionTax),
        personalPortfolioTax: Math.round(personalPortfolioTax),
        cryptoTax: Math.round(cryptoTax),
        realEstateTax: Math.round(realEstateTax),
        netPension: Math.round(netPension),
        netTrainingFundIncome: Math.round(netTrainingFundIncome),
        netPersonalPortfolioIncome: Math.round(netPersonalPortfolioIncome),
        netCryptoIncome: Math.round(netCryptoIncome),
        netRealEstateIncome: Math.round(netRealEstateIncome),
        socialSecurity: socialSecurity,
        individualNetIncome: Math.round(individualNetIncome),
        
        // Partner results (if enabled)
        partnerResults: partnerResults,
        partnerNetIncome: Math.round(partnerNetIncome),
        partnerSocialSecurity: partnerSocialSecurity,
        
        // Combined household results
        totalNetIncome: Math.round(totalNetIncome),
        isJointPlanning: inputs.partnerPlanningEnabled,
        
        // Other calculations
        periodResults,
        lastCountry,
        weightedTaxRate: Math.round(weightedTaxRate * 100),
        inflationAdjustedIncome: Math.round(totalNetIncome / Math.pow(1 + inputs.inflationRate / 100, yearsToRetirement)),
        trainingFundNetReturn: trainingFundNetReturn,
        pensionWeightedReturn: pensionWeightedReturn,
        trainingFundWeightedReturn: trainingFundWeightedReturn,
        futureMonthlyExpenses: Math.round(futureMonthlyExpenses),
        remainingAfterExpenses: Math.round(remainingAfterExpenses),
        remainingAfterExpensesInflationAdjusted: Math.round(remainingAfterExpenses / Math.pow(1 + inputs.inflationRate / 100, yearsToRetirement)),
        targetMonthlyIncome: Math.round(targetMonthlyIncome),
        achievesTarget: achievesTarget,
        targetGap: Math.round(targetMonthlyIncome - totalNetIncome),
        riskLevel: inputs.riskTolerance,
        riskMultiplier: riskScenarios[inputs.riskTolerance]?.multiplier || 1.0
    };
};