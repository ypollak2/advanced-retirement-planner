import { calculateWeightedReturn, getAdjustedReturn } from './retirementCalculations.js';

export const generateChartData = (
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
            pensionSavings: Math.round(accumulatedPensionSavings),
            trainingFund: Math.round(accumulatedTrainingFund),
            personalPortfolio: Math.round(accumulatedPersonalPortfolio),
            crypto: Math.round(accumulatedCrypto),
            realEstate: Math.round(accumulatedRealEstate),
            totalSavings: Math.round(totalSavings),
            inflationAdjusted: Math.round(inflationAdjustedValue),
            yearLabel: `Age ${currentAge}`
        });
    }

    return chartPoints;
};