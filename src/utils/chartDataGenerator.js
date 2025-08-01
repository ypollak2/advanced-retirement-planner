// Chart data generator for GitHub Pages compatibility
// Dependencies: calculateWeightedReturn, getAdjustedReturn from retirementCalculations.js

// Enhanced precision helper function for consistency
const safeMoney = (value) => {
    if (isNaN(value) || !isFinite(value)) return 0;
    return Math.round(value);
};

window.generateChartData = (
    inputs, 
    workPeriods, 
    pensionIndexAllocation, 
    trainingFundIndexAllocation,
    historicalReturns
) => {
    const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
    
    if (yearsToRetirement <= 0) {
        return [];
    }

    const basePensionWeightedReturn = calculateWeightedReturn(pensionIndexAllocation, yearsToRetirement, historicalReturns);
    const baseTrainingFundWeightedReturn = calculateWeightedReturn(trainingFundIndexAllocation, yearsToRetirement, historicalReturns);
    
    const pensionWeightedReturn = getAdjustedReturn(basePensionWeightedReturn, inputs.riskTolerance);
    const trainingFundWeightedReturn = getAdjustedReturn(baseTrainingFundWeightedReturn, inputs.riskTolerance);

    const chartPoints = [];
    let accumulatedPensionSavings = inputs.currentSavings;
    let accumulatedTrainingFund = inputs.currentTrainingFund;
    let accumulatedPersonalPortfolio = inputs.currentPersonalPortfolio;
    let accumulatedCrypto = inputs.currentCrypto;
    let accumulatedRealEstate = inputs.currentRealEstate;
    
    const totalInitialSavings = accumulatedPensionSavings + accumulatedTrainingFund + accumulatedPersonalPortfolio + accumulatedCrypto + accumulatedRealEstate;
    
    chartPoints.push({
        year: inputs.currentAge,
        age: inputs.currentAge,
        pensionSavings: accumulatedPensionSavings,
        trainingFund: accumulatedTrainingFund,
        personalPortfolio: accumulatedPersonalPortfolio,
        crypto: accumulatedCrypto,
        realEstate: accumulatedRealEstate,
        totalSavings: totalInitialSavings,
        inflationAdjusted: totalInitialSavings,
        yearLabel: `Age ${inputs.currentAge}`
    });

    for (let yearOffset = 1; yearOffset <= yearsToRetirement; yearOffset++) {
        const currentAge = inputs.currentAge + yearOffset;
        
        const activePeriod = workPeriods.find(period => 
            currentAge > period.startAge && currentAge <= period.endAge
        );
        
        if (activePeriod) {
            const adjustedPensionReturn = getAdjustedReturn(activePeriod.pensionReturn, inputs.riskTolerance);
            const pensionEffectiveReturn = adjustedPensionReturn - activePeriod.pensionAnnualFee;
            const netMonthlyContribution = activePeriod.monthlyContribution * (1 - activePeriod.pensionDepositFee / 100);
            accumulatedPensionSavings = accumulatedPensionSavings * (1 + pensionEffectiveReturn / 100) + (netMonthlyContribution * 12);
            
            const adjustedTrainingFundReturn = getAdjustedReturn(inputs.trainingFundReturn, inputs.riskTolerance);
            const trainingFundNetReturn = (adjustedTrainingFundReturn - inputs.trainingFundManagementFee) / 100;
            accumulatedTrainingFund = accumulatedTrainingFund * (1 + trainingFundNetReturn) + (activePeriod.monthlyTrainingFund * 12);
        } else {
            const adjustedBasicReturn = getAdjustedReturn(3, inputs.riskTolerance);
            accumulatedPensionSavings = accumulatedPensionSavings * (1 + adjustedBasicReturn / 100);
            const adjustedTrainingFundReturn = getAdjustedReturn(inputs.trainingFundReturn, inputs.riskTolerance);
            const trainingFundNetReturn = (adjustedTrainingFundReturn - inputs.trainingFundManagementFee) / 100;
            accumulatedTrainingFund = accumulatedTrainingFund * (1 + trainingFundNetReturn);
        }

        // Update new investment types annually
        const adjustedPersonalPortfolioReturn = getAdjustedReturn(inputs.personalPortfolioReturn, inputs.riskTolerance);
        accumulatedPersonalPortfolio = accumulatedPersonalPortfolio * (1 + adjustedPersonalPortfolioReturn / 100) + (inputs.personalPortfolioMonthly * 12);
        
        const adjustedCryptoReturn = getAdjustedReturn(inputs.cryptoReturn, inputs.riskTolerance);
        accumulatedCrypto = accumulatedCrypto * (1 + adjustedCryptoReturn / 100) + (inputs.cryptoMonthly * 12);
        
        const adjustedRealEstateReturn = getAdjustedReturn(inputs.realEstateReturn, inputs.riskTolerance);
        accumulatedRealEstate = accumulatedRealEstate * (1 + adjustedRealEstateReturn / 100) + (inputs.realEstateMonthly * 12);
        
        const totalSavings = accumulatedPensionSavings + accumulatedTrainingFund + accumulatedPersonalPortfolio + accumulatedCrypto + accumulatedRealEstate;
        const inflationAdjustedValue = totalSavings / Math.pow(1 + inputs.inflationRate / 100, yearOffset);
        
        chartPoints.push({
            year: currentAge,
            age: currentAge,
            pensionSavings: safeMoney(accumulatedPensionSavings),
            trainingFund: safeMoney(accumulatedTrainingFund),
            personalPortfolio: safeMoney(accumulatedPersonalPortfolio),
            crypto: safeMoney(accumulatedCrypto),
            realEstate: safeMoney(accumulatedRealEstate),
            totalSavings: safeMoney(totalSavings),
            inflationAdjusted: safeMoney(inflationAdjustedValue),
            yearLabel: `Age ${currentAge}`
        });
    }

    return chartPoints;
};

// Generate retirement projection chart data for year-by-year visualization
window.generateRetirementProjectionChart = (inputs) => {
    const currentAge = parseFloat(inputs.currentAge || 30);
    const retirementAge = parseFloat(inputs.retirementAge || 67);
    
    // Calculate monthly income based on planning type
    let monthlyIncome = 0;
    let savingsRate = 0;
    
    if (inputs.planningType === 'couple') {
        // Couple mode: sum partner incomes
        const partner1Salary = parseFloat(inputs.partner1Salary || 0);
        const partner2Salary = parseFloat(inputs.partner2Salary || 0);
        monthlyIncome = partner1Salary + partner2Salary;
        
        // Calculate weighted average savings rate
        const partner1PensionRate = parseFloat(inputs.partner1EmployeeRate || 0) + parseFloat(inputs.partner1EmployerRate || 0);
        const partner1TrainingRate = parseFloat(inputs.partner1TrainingFundEmployeeRate || 0) + parseFloat(inputs.partner1TrainingFundEmployerRate || 0);
        const partner2PensionRate = parseFloat(inputs.employeePensionRate || 0) + parseFloat(inputs.employerPensionRate || 0);
        const partner2TrainingRate = parseFloat(inputs.trainingFundEmployeeRate || 0) + parseFloat(inputs.trainingFundEmployerRate || 0);
        
        const totalIncome = partner1Salary + partner2Salary;
        if (totalIncome > 0) {
            savingsRate = ((partner1Salary * (partner1PensionRate + partner1TrainingRate) + 
                           partner2Salary * (partner2PensionRate + partner2TrainingRate)) / totalIncome) / 100;
        }
    } else {
        // Individual mode
        monthlyIncome = parseFloat(inputs.currentMonthlySalary || inputs.currentSalary || 0);
        savingsRate = (parseFloat(inputs.pensionContributionRate || 0) + parseFloat(inputs.trainingFundContributionRate || 0)) / 100;
    }
    
    const expectedReturn = parseFloat(inputs.expectedAnnualReturn || 7) / 100;
    const inflationRate = parseFloat(inputs.inflationRate || 3) / 100;
    
    const yearsToRetirement = retirementAge - currentAge;
    const annualSavings = monthlyIncome * 12 * savingsRate;
    
    // Calculate current total savings
    let currentSavings = 0;
    currentSavings += parseFloat(inputs.currentSavings || 0);
    currentSavings += parseFloat(inputs.currentTrainingFund || 0);
    currentSavings += parseFloat(inputs.currentPersonalPortfolio || 0);
    currentSavings += parseFloat(inputs.currentRealEstate || 0);
    currentSavings += parseFloat(inputs.currentCrypto || 0);
    currentSavings += parseFloat(inputs.currentSavingsAccount || 0);
    
    // Partner savings if couple mode
    if (inputs.planningType === 'couple') {
        currentSavings += parseFloat(inputs.partner1CurrentPension || 0);
        currentSavings += parseFloat(inputs.partner1CurrentTrainingFund || 0);
        currentSavings += parseFloat(inputs.partner1PersonalPortfolio || 0);
        currentSavings += parseFloat(inputs.partner1RealEstate || 0);
        currentSavings += parseFloat(inputs.partner1Crypto || 0);
        currentSavings += parseFloat(inputs.partner2CurrentPension || 0);
        currentSavings += parseFloat(inputs.partner2CurrentTrainingFund || 0);
        currentSavings += parseFloat(inputs.partner2PersonalPortfolio || 0);
        currentSavings += parseFloat(inputs.partner2RealEstate || 0);
        currentSavings += parseFloat(inputs.partner2Crypto || 0);
    }
    
    const chartData = [];
    let runningTotal = currentSavings;
    let cumulativeInflation = 1.0;
    
    // Generate year-by-year data points
    for (let year = 0; year <= yearsToRetirement; year++) {
        const currentYearAge = currentAge + year;
        
        if (year > 0) {
            // Apply return to existing savings
            runningTotal *= (1 + expectedReturn);
            
            // Add annual contributions (only during working years)
            if (year < yearsToRetirement) {
                runningTotal += annualSavings;
            }
            
            // Update cumulative inflation
            cumulativeInflation *= (1 + inflationRate);
        }
        
        // Calculate inflation-adjusted values
        const inflationAdjustedTotal = runningTotal / cumulativeInflation;
        
        // Calculate monthly income (4% withdrawal rule)
        let withdrawalRate = 0.04;
        if (runningTotal > 20000000) {
            withdrawalRate = 0.035;
        } else if (runningTotal > 10000000) {
            withdrawalRate = 0.038;
        }
        
        const monthlyIncome = (runningTotal * withdrawalRate) / 12;
        const inflationAdjustedMonthlyIncome = monthlyIncome / cumulativeInflation;
        
        chartData.push({
            year: year,
            age: currentYearAge,
            totalAccumulation: safeMoney(runningTotal),
            inflationAdjustedTotal: safeMoney(inflationAdjustedTotal),
            monthlyIncome: safeMoney(monthlyIncome),
            inflationAdjustedMonthlyIncome: safeMoney(inflationAdjustedMonthlyIncome),
            isRetirementYear: currentYearAge === retirementAge,
            yearLabel: year === 0 ? `Today (Age ${currentAge})` : 
                      currentYearAge === retirementAge ? `Retirement (Age ${retirementAge})` :
                      `Age ${currentYearAge}`
        });
    }
    
    return chartData;
};