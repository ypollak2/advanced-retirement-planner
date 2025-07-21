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
    // Critical fix: Add null/zero check to prevent division by zero errors
    if (!exchangeRates || !exchangeRates[currency] || exchangeRates[currency] === 0) {
        console.warn(`Exchange rate for ${currency} is invalid:`, exchangeRates[currency]);
        return 'N/A';
    }
    
    // Validate amount is a valid number
    if (isNaN(amount) || amount === null || amount === undefined) {
        console.warn(`Invalid amount for currency conversion:`, amount);
        return 'N/A';
    }
    
    const convertedAmount = amount / exchangeRates[currency];
    const formatters = {
        USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }),
        GBP: new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }),
        EUR: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }),
        ILS: new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 }),
        BTC: (amount) => `₿${(amount).toFixed(6)}`,
        ETH: (amount) => `Ξ${(amount).toFixed(4)}`
    };
    
    // Handle crypto currencies with special formatting
    if (currency === 'BTC' || currency === 'ETH') {
        return formatters[currency](convertedAmount);
    }
    
    // Handle regular currencies
    if (!formatters[currency]) {
        console.warn(`No formatter available for currency: ${currency}`);
        return `${convertedAmount.toFixed(2)} ${currency}`;
    }
    
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
    
    // Apply dynamic return assumptions if available
    const effectivePensionReturn = inputs.pensionReturn !== undefined ? inputs.pensionReturn : basePensionWeightedReturn;
    const effectiveTrainingFundReturn = inputs.trainingFundReturn !== undefined ? inputs.trainingFundReturn : baseTrainingFundWeightedReturn;
    
    const pensionWeightedReturn = getAdjustedReturn(effectivePensionReturn, inputs.riskTolerance);
    const trainingFundWeightedReturn = getAdjustedReturn(effectiveTrainingFundReturn, inputs.riskTolerance);

    let totalPensionSavings = inputs.currentSavings;
    let totalTrainingFund = inputs.currentTrainingFund;
    let totalPersonalPortfolio = inputs.currentPersonalPortfolio;
    let totalCrypto = inputs.currentCrypto;
    let totalRealEstate = inputs.currentRealEstate;
    let periodResults = [];
    
    const sortedPeriods = [...workPeriods].sort((a, b) => a.startAge - b.startAge);
    
    // Calculate pension savings from work periods
    for (const period of sortedPeriods) {
        if (!period || !period.country || !countryData[period.country]) {
            console.warn('Invalid work period or country data:', period);
            continue;
        }
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
        if (!result || !result.country || !countryData[result.country]) {
            console.warn('Invalid period result or country data:', result);
            continue;
        }
        const country = countryData[result.country];
        weightedTaxRate += country.pensionTax * result.growth;
        totalWeight += result.growth;
    }
    
    if (totalWeight > 0) {
        weightedTaxRate = weightedTaxRate / totalWeight;
    } else {
        // Fallback to default tax rate if no valid work periods
        if (workPeriods.length > 0 && workPeriods[0] && workPeriods[0].country && countryData[workPeriods[0].country]) {
            weightedTaxRate = countryData[workPeriods[0].country].pensionTax;
        } else {
            weightedTaxRate = 0.25; // Default 25% tax rate
        }
    }
    
    const pensionTax = monthlyPension * weightedTaxRate;
    const netPension = monthlyPension - pensionTax;
    const netTrainingFundIncome = monthlyTrainingFundIncome;
    
    // Get social security from last valid country or default
    let socialSecurity = 0;
    if (sortedPeriods.length > 0) {
        const lastPeriod = sortedPeriods[sortedPeriods.length - 1];
        if (lastPeriod && lastPeriod.country && countryData[lastPeriod.country]) {
            const lastCountry = countryData[lastPeriod.country];
            socialSecurity = lastCountry.socialSecurity;
        }
    }
    
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
    
    // Calculate additional income sources from wizard inputs
    const currentSalary = inputs.currentMonthlySalary || inputs.currentSalary || 0;
    const annualBonusMonthly = (parseFloat(inputs.annualBonus) || 0) / 12;
    const quarterlyRSUMonthly = (parseFloat(inputs.quarterlyRSU) || 0) / 3;
    const freelanceIncome = parseFloat(inputs.freelanceIncome) || 0;
    const rentalIncome = parseFloat(inputs.rentalIncome) || 0;
    const dividendIncome = parseFloat(inputs.dividendIncome) || 0;
    
    // Partner additional income sources
    let partnerAdditionalIncome = 0;
    if (inputs.planningType === 'couple') {
        const partner1AnnualBonusMonthly = (parseFloat(inputs.partner1AnnualBonus) || 0) / 12;
        const partner1QuarterlyRSUMonthly = (parseFloat(inputs.partner1QuarterlyRSU) || 0) / 3;
        const partner1FreelanceIncome = parseFloat(inputs.partner1FreelanceIncome) || 0;
        const partner1RentalIncome = parseFloat(inputs.partner1RentalIncome) || 0;
        const partner1DividendIncome = parseFloat(inputs.partner1DividendIncome) || 0;
        
        const partner2AnnualBonusMonthly = (parseFloat(inputs.partner2AnnualBonus) || 0) / 12;
        const partner2QuarterlyRSUMonthly = (parseFloat(inputs.partner2QuarterlyRSU) || 0) / 3;
        const partner2FreelanceIncome = parseFloat(inputs.partner2FreelanceIncome) || 0;
        const partner2RentalIncome = parseFloat(inputs.partner2RentalIncome) || 0;
        const partner2DividendIncome = parseFloat(inputs.partner2DividendIncome) || 0;
        
        partnerAdditionalIncome = partner1AnnualBonusMonthly + partner1QuarterlyRSUMonthly + partner1FreelanceIncome + partner1RentalIncome + partner1DividendIncome +
                                 partner2AnnualBonusMonthly + partner2QuarterlyRSUMonthly + partner2FreelanceIncome + partner2RentalIncome + partner2DividendIncome;
    }
    
    const additionalIncomeTotal = annualBonusMonthly + quarterlyRSUMonthly + freelanceIncome + rentalIncome + dividendIncome;
    const individualNetIncome = netPension + netTrainingFundIncome + socialSecurity + netPersonalPortfolioIncome + netCryptoIncome + netRealEstateIncome + additionalIncomeTotal;
    const totalNetIncome = individualNetIncome + partnerNetIncome + partnerAdditionalIncome;
    
    // Calculate expenses (joint if partner enabled, individual otherwise)
    const baseExpenses = inputs.partnerPlanningEnabled && inputs.jointMonthlyExpenses > 0 
        ? inputs.jointMonthlyExpenses 
        : inputs.currentMonthlyExpenses;
    const futureMonthlyExpenses = baseExpenses * Math.pow(1 + inputs.inflationRate / 100, yearsToRetirement);
    const remainingAfterExpenses = totalNetIncome - futureMonthlyExpenses;

    const finalSalary = workPeriods.length > 0 ? workPeriods[workPeriods.length - 1].salary : 0;
    const targetMonthlyIncome = (finalSalary * inputs.targetReplacement) / 100;
    const achievesTarget = totalNetIncome >= targetMonthlyIncome;

    // Enhanced helper function for precise financial calculations
    const safeRound = (value, decimals = 0) => {
        if (isNaN(value) || !isFinite(value)) return 0;
        if (decimals === 0) return Math.round(value);
        const factor = Math.pow(10, decimals);
        return Math.round(value * factor) / factor;
    };
    
    // Helper function for monetary values (whole numbers)
    const safeMoney = (value) => safeRound(value, 0);
    
    // Helper function for rates and percentages (2 decimal places)
    const safeRate = (value) => safeRound(value, 2);
    
    // Helper function for large monetary amounts with precision
    const safePreciseMoney = (value) => safeRound(value, 2);

    return {
        // Individual results (monetary values - whole numbers)
        totalSavings: safeMoney(totalPensionSavings),
        trainingFundValue: safeMoney(totalTrainingFund),
        personalPortfolioValue: safeMoney(totalPersonalPortfolio),
        currentCrypto: safeMoney(totalCrypto),
        currentRealEstate: safeMoney(totalRealEstate),
        monthlyPension: safeMoney(monthlyPension),
        monthlyTrainingFundIncome: safeMoney(monthlyTrainingFundIncome),
        monthlyPersonalPortfolioIncome: safeMoney(monthlyPersonalPortfolioIncome),
        monthlyCryptoIncome: safeMoney(monthlyCryptoIncome),
        monthlyRealEstateIncome: safeMoney(monthlyRealEstateIncome),
        realEstateRentalIncome: safeMoney(realEstateRentalIncome),
        pensionTax: safeMoney(pensionTax),
        personalPortfolioTax: safeMoney(personalPortfolioTax),
        cryptoTax: safeMoney(cryptoTax),
        realEstateTax: safeMoney(realEstateTax),
        netPension: safeMoney(netPension),
        netTrainingFundIncome: safeMoney(netTrainingFundIncome),
        netPersonalPortfolioIncome: safeMoney(netPersonalPortfolioIncome),
        netCryptoIncome: safeMoney(netCryptoIncome),
        netRealEstateIncome: safeMoney(netRealEstateIncome),
        socialSecurity: socialSecurity || 0,
        individualNetIncome: safeMoney(individualNetIncome),
        
        // Partner results (if enabled)
        partnerResults: partnerResults,
        partnerNetIncome: safeMoney(partnerNetIncome),
        partnerSocialSecurity: partnerSocialSecurity || 0,
        
        // Additional income breakdown
        annualBonusMonthly: safeMoney(annualBonusMonthly),
        quarterlyRSUMonthly: safeMoney(quarterlyRSUMonthly),
        freelanceIncome: safeMoney(freelanceIncome),
        additionalRentalIncome: safeMoney(rentalIncome),
        dividendIncome: safeRound(dividendIncome),
        additionalIncomeTotal: safeRound(additionalIncomeTotal),
        partnerAdditionalIncome: safeRound(partnerAdditionalIncome),
        
        // Combined household results
        totalNetIncome: safeRound(totalNetIncome),
        monthlyIncome: safeRound(totalNetIncome), // Add missing monthlyIncome property
        isJointPlanning: inputs.partnerPlanningEnabled || false,
        
        // Other calculations
        periodResults: periodResults || [],
        lastCountry: lastCountry,
        weightedTaxRate: safeRate(weightedTaxRate * 100),
        inflationAdjustedIncome: safePreciseMoney(totalNetIncome / Math.pow(1 + (inputs.inflationRate || 3) / 100, yearsToRetirement)),
        trainingFundNetReturn: trainingFundNetReturn || 0,
        pensionWeightedReturn: pensionWeightedReturn || 0,
        trainingFundWeightedReturn: trainingFundWeightedReturn || 0,
        futureMonthlyExpenses: safeMoney(futureMonthlyExpenses),
        remainingAfterExpenses: safeMoney(remainingAfterExpenses),
        remainingAfterExpensesInflationAdjusted: safePreciseMoney(remainingAfterExpenses / Math.pow(1 + (inputs.inflationRate || 3) / 100, yearsToRetirement)),
        targetMonthlyIncome: safeRound(targetMonthlyIncome),
        achievesTarget: achievesTarget || false,
        targetGap: safeRound(targetMonthlyIncome - totalNetIncome),
        riskLevel: inputs.riskTolerance || 'moderate',
        riskMultiplier: riskScenarios[inputs.riskTolerance]?.multiplier || 1.0,
        
        // Tax optimization analysis (if tax optimization utility is available)
        taxOptimization: (() => {
            try {
                return window.taxOptimization ? window.taxOptimization.analyzePersonalTaxSituation(inputs) : null;
            } catch (error) {
                console.warn('Tax optimization analysis failed:', error);
                return null;
            }
        })(),
        
        // Inflation-adjusted analysis (comprehensive real vs nominal values)
        inflationAnalysis: (() => {
            try {
                if (window.inflationCalculations) {
                    const inflationRate = parseFloat(inputs.inflationRate || 3);
                    const country = inputs.country || 'israel';
                    
                    // Calculate real values of all major savings components
                    const realValues = {
                        totalSavings: window.adjustForInflation(safeMoney(totalPensionSavings), inflationRate, yearsToRetirement),
                        trainingFundValue: window.adjustForInflation(safeMoney(totalTrainingFund), inflationRate, yearsToRetirement),
                        personalPortfolioValue: window.adjustForInflation(safeMoney(totalPersonalPortfolio), inflationRate, yearsToRetirement),
                        currentCrypto: window.adjustForInflation(safeMoney(totalCrypto), inflationRate, yearsToRetirement),
                        currentRealEstate: window.adjustForInflation(safeMoney(totalRealEstate), inflationRate, yearsToRetirement),
                        totalNetIncome: window.adjustForInflation(safeMoney(totalNetIncome), inflationRate, yearsToRetirement)
                    };
                    
                    // Calculate inflation protection score
                    const inflationProtection = window.inflationCalculations.calculateInflationProtection(inputs);
                    
                    // Calculate real returns
                    const nominalReturns = {
                        pensionReturn: inputs.pensionReturn || 7.0,
                        trainingFundReturn: inputs.trainingFundReturn || 6.5,
                        personalPortfolioReturn: inputs.personalPortfolioReturn || 8.0,
                        realEstateReturn: inputs.realEstateReturn || 6.0,
                        cryptoReturn: inputs.cryptoReturn || 15.0
                    };
                    const realReturns = window.inflationCalculations.calculateRealReturns(nominalReturns, inflationRate);
                    
                    return {
                        inflationRate,
                        yearsToRetirement,
                        realValues,
                        nominalValues: {
                            totalSavings: safeMoney(totalPensionSavings),
                            trainingFundValue: safeMoney(totalTrainingFund),
                            personalPortfolioValue: safeMoney(totalPersonalPortfolio),
                            currentCrypto: safeMoney(totalCrypto),
                            currentRealEstate: safeMoney(totalRealEstate),
                            totalNetIncome: safeMoney(totalNetIncome)
                        },
                        inflationProtection,
                        realReturns,
                        nominalReturns,
                        purchasingPowerErosion: ((safeMoney(totalNetIncome) - realValues.totalNetIncome) / safeMoney(totalNetIncome)) * 100,
                        realVsNominalRatio: realValues.totalNetIncome / safeMoney(totalNetIncome)
                    };
                }
                return null;
            } catch (error) {
                console.warn('Inflation analysis failed:', error);
                return null;
            }
        })(),
        
        // Readiness score calculation
        readinessScore: (() => {
            if (!targetMonthlyIncome || targetMonthlyIncome === 0) return 50;
            const incomeRatio = totalNetIncome / targetMonthlyIncome;
            if (incomeRatio >= 1.2) return 100;
            if (incomeRatio >= 1.0) return 90;
            if (incomeRatio >= 0.8) return 70;
            if (incomeRatio >= 0.6) return 50;
            if (incomeRatio >= 0.4) return 30;
            return 20;
        })()
    };
};

window.generateRetirementChartData = (inputs, workPeriods, partnerWorkPeriods, chartView = 'combined') => {
    if (!inputs || typeof inputs !== 'object' || !workPeriods) {
        console.warn('generateRetirementChartData: Invalid inputs provided.');
        return [];
    }

    const { currentAge, retirementAge, inflationRate = 3, ...rest } = inputs;
    if (currentAge >= retirementAge) {
        console.warn('generateRetirementChartData: Current age must be less than retirement age.');
        return [];
    }

    const chartData = [];
    let simulationInputs = { ...inputs };

    for (let age = currentAge; age <= retirementAge; age++) {
        const results = window.calculateRetirement(simulationInputs, workPeriods, partnerWorkPeriods);
        if (!results) continue;

        const yearsElapsed = age - currentAge;
        const inflationDivisor = Math.pow(1 + (inflationRate / 100), yearsElapsed);

        let dataPoint = {
            age: age,
            totalSavings: results.totalSavings,
            inflationAdjusted: results.totalSavings / inflationDivisor,
            pensionSavings: results.totalSavings, // Simplified for chart
            trainingFund: results.trainingFundValue,
            personalPortfolio: results.personalPortfolioValue,
            crypto: results.currentCrypto,
            realEstate: results.currentRealEstate,
        };

        if (inputs.planningType === 'couple' && results.partnerResults) {
            const partnerData = chartView === 'partner1' ? results.partnerResults.partner1 : results.partnerResults.partner2;
            if (partnerData) {
                dataPoint.totalSavings = partnerData.totalSavings;
                dataPoint.inflationAdjusted = partnerData.totalSavings / inflationDivisor;
                dataPoint.pensionSavings = partnerData.totalSavings;
            }
        }

        chartData.push(dataPoint);
        simulationInputs.currentAge++;
    }

    return chartData;
};

// Unified Partner Data Generation Function
// This function ensures all chart components use the same calculation logic
window.generateUnifiedPartnerProjections = (
    inputs, 
    workPeriods = [], 
    partnerWorkPeriods = [],
    pensionIndexAllocation = [],
    trainingFundIndexAllocation = [],
    historicalReturns = {}
) => {
    const projections = {
        primary: [],
        partner: [],
        combined: []
    };

    if (!inputs || !inputs.currentAge || !inputs.retirementAge) {
        console.warn('generateUnifiedPartnerProjections: Invalid inputs provided.');
        return projections;
    }

    const currentAge = inputs.currentAge;
    const retirementAge = inputs.retirementAge;
    const inflationRate = (inputs.inflationRate || 3) / 100;

    // Generate year-by-year projections using the main calculation logic
    for (let age = currentAge; age <= retirementAge; age++) {
        const yearsFromStart = age - currentAge;
        const tempInputs = { ...inputs, currentAge: age };
        
        try {
            // Calculate using the main retirement calculation function
            const results = window.calculateRetirement(
                tempInputs, 
                workPeriods, 
                pensionIndexAllocation,
                trainingFundIndexAllocation,
                historicalReturns,
                inputs.monthlyTrainingFund || 0,
                partnerWorkPeriods
            );

            if (results) {
                const inflationAdjuster = Math.pow(1 + inflationRate, yearsFromStart);
                
                // Primary partner data
                const primaryTotal = results.totalSavings || 0;
                projections.primary.push({
                    age: age,
                    nominal: Math.round(primaryTotal),
                    real: Math.round(primaryTotal / inflationAdjuster),
                    pensionSavings: Math.round(results.totalSavings || 0),
                    trainingFund: Math.round(results.trainingFundValue || 0),
                    personalPortfolio: Math.round(results.personalPortfolioValue || 0),
                    crypto: Math.round(results.currentCrypto || 0),
                    realEstate: Math.round(results.currentRealEstate || 0)
                });

                // Partner data (if available)
                let partnerTotal = 0;
                if (results.partnerResults) {
                    partnerTotal = (results.partnerResults.totalPensionSavings || 0) +
                                  (results.partnerResults.totalTrainingFund || 0) +
                                  (results.partnerResults.totalPersonalPortfolio || 0);
                }

                projections.partner.push({
                    age: age,
                    nominal: Math.round(partnerTotal),
                    real: Math.round(partnerTotal / inflationAdjuster),
                    pensionSavings: Math.round(results.partnerResults?.totalPensionSavings || 0),
                    trainingFund: Math.round(results.partnerResults?.totalTrainingFund || 0),
                    personalPortfolio: Math.round(results.partnerResults?.totalPersonalPortfolio || 0)
                });

                // Combined household data
                const combinedTotal = primaryTotal + partnerTotal;
                projections.combined.push({
                    age: age,
                    nominal: Math.round(combinedTotal),
                    real: Math.round(combinedTotal / inflationAdjuster),
                    primaryTotal: Math.round(primaryTotal),
                    partnerTotal: Math.round(partnerTotal)
                });
            }
        } catch (error) {
            console.warn(`generateUnifiedPartnerProjections: Error calculating for age ${age}:`, error);
        }
    }

    return projections;
};

// Export the unified function for chart components to use
window.getUnifiedPartnerData = window.generateUnifiedPartnerProjections;

// Standardized Chart Currency Formatting System
window.standardChartFormatting = {
    // Get currency symbol
    getCurrencySymbol: (currency) => {
        const symbols = {
            'ILS': '₪',
            'USD': '$',
            'EUR': '€', 
            'GBP': '£',
            'BTC': '₿',
            'ETH': 'Ξ',
            'JPY': '¥',
            'CAD': 'C$',
            'AUD': 'A$'
        };
        return symbols[currency] || '₪';
    },

    // Standardized Y-axis formatter for charts
    formatYAxisValue: (value, currency = 'ILS') => {
        const symbol = window.standardChartFormatting.getCurrencySymbol(currency);
        
        if (Math.abs(value) >= 1000000) {
            return `${symbol}${(value / 1000000).toFixed(1)}M`;
        } else if (Math.abs(value) >= 1000) {
            return `${symbol}${(value / 1000).toFixed(0)}K`;
        } else {
            return `${symbol}${Math.round(value).toLocaleString()}`;
        }
    },

    // Standardized tooltip formatter for charts
    formatTooltipValue: (value, currency = 'ILS', language = 'en') => {
        const symbol = window.standardChartFormatting.getCurrencySymbol(currency);
        const formattedValue = Math.round(value).toLocaleString(language === 'he' ? 'he-IL' : 'en-US');
        return `${symbol}${formattedValue}`;
    },

    // Standardized chart scale configuration
    getStandardScaleConfig: (currency = 'ILS', language = 'en') => {
        return {
            x: {
                title: {
                    display: true,
                    text: language === 'he' ? 'גיל' : 'Age',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: `${language === 'he' ? 'סכום' : 'Amount'} (${window.standardChartFormatting.getCurrencySymbol(currency)})`,
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
                ticks: {
                    callback: function(value) {
                        return window.standardChartFormatting.formatYAxisValue(value, currency);
                    },
                    font: {
                        size: 12
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                beginAtZero: true
            }
        };
    },

    // Standardized tooltip configuration
    getStandardTooltipConfig: (currency = 'ILS', language = 'en') => {
        return {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
            cornerRadius: 8,
            callbacks: {
                label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += window.standardChartFormatting.formatTooltipValue(context.parsed.y, currency, language);
                    }
                    return label;
                }
            }
        };
    }
};

// Data validation helper
window.validatePartnerData = (partnerData) => {
    if (!partnerData || typeof partnerData !== 'object') {
        return false;
    }
    
    const requiredFields = ['age', 'salary'];
    return requiredFields.every(field => field in partnerData && 
        typeof partnerData[field] === 'number' && partnerData[field] > 0);
};