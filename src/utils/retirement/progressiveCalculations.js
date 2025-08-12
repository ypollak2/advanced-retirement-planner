// Progressive Calculations Module
// Progressive savings calculation engine

// Progressive Savings Calculation Engine - Fixes all graph issues
window.calculateProgressiveSavings = (inputs, workPeriods = [], partnerWorkPeriods = []) => {
    if (!inputs || !inputs.currentAge || !inputs.retirementAge) {
        console.warn('calculateProgressiveSavings: Invalid inputs provided.');
        return { primary: [], partner: [], combined: [] };
    }

    const currentAge = inputs.currentAge;
    const retirementAge = inputs.retirementAge;
    const inflationRate = (inputs.inflationRate || 3) / 100;
    
    // Extract rates and contributions
    const pensionReturn = (inputs.pensionReturn || 6) / 100;  // Annual return rate
    const trainingFundReturn = (inputs.trainingFundReturn || 6) / 100;
    const personalPortfolioReturn = (inputs.personalPortfolioReturn || 7) / 100;
    
    // Monthly contributions
    const monthlyPensionContrib = parseFloat(inputs.monthlyContribution || inputs.pensionContribution || 0);
    const monthlyTrainingContrib = parseFloat(inputs.trainingFundContribution || 0);
    const monthlyPersonalContrib = parseFloat(inputs.personalSavings || inputs.personalPortfolioMonthly || 0);
    
    // Initial amounts with enhanced field mapping
    let primaryPension = parseFloat(
        inputs.currentSavings || inputs.pensionSavings || inputs.currentPensionSavings || 
        inputs.retirementSavings || inputs.currentRetirementSavings || 0
    );
    let primaryTraining = parseFloat(
        inputs.currentTrainingFund || inputs.trainingFund || inputs.trainingFundValue || 0
    );
    // Apply capital gains tax to primary personal portfolio
    const grossPrimaryPortfolio = parseFloat(
        inputs.currentPersonalPortfolio || inputs.personalPortfolio || inputs.portfolioValue || 0
    );
    const primaryTaxRate = inputs.planningType === 'couple' ? 
        (inputs.partner1PortfolioTaxRate || 25) / 100 :
        (inputs.portfolioTaxRate || 25) / 100;
    let primaryPersonal = grossPrimaryPortfolio * (1 - primaryTaxRate);
    
    // Partner data extraction
    let partnerPension = 0;
    let partnerTraining = 0;
    let partnerPersonal = 0;
    let partnerMonthlyPensionContrib = 0;
    let partnerMonthlyTrainingContrib = 0;
    let partnerMonthlyPersonalContrib = 0;
    
    if (inputs.planningType === 'couple') {
        // Partner 1 savings
        const partner1Pension = parseFloat(inputs.partner1CurrentPension || inputs.partner1CurrentSavings || 0);
        const partner1Training = parseFloat(inputs.partner1CurrentTrainingFund || 0);
        const partner1Portfolio = parseFloat(inputs.partner1PersonalPortfolio || inputs.partner1CurrentPersonalPortfolio || 0);
        const partner1Real = parseFloat(inputs.partner1RealEstate || inputs.partner1CurrentRealEstate || 0);
        const partner1Crypto = parseFloat(inputs.partner1Crypto || inputs.partner1CurrentCrypto || 0);
        
        // Partner 2 savings
        const partner2Pension = parseFloat(inputs.partner2CurrentPension || inputs.partner2CurrentSavings || 0);
        const partner2Training = parseFloat(inputs.partner2CurrentTrainingFund || 0);
        const partner2Portfolio = parseFloat(inputs.partner2PersonalPortfolio || inputs.partner2CurrentPersonalPortfolio || 0);
        const partner2Real = parseFloat(inputs.partner2RealEstate || inputs.partner2CurrentRealEstate || 0);
        const partner2Crypto = parseFloat(inputs.partner2Crypto || inputs.partner2CurrentCrypto || 0);
        
        // For backward compatibility with projections
        partnerPension = partner2Pension;
        partnerTraining = partner2Training;
        
        // Apply capital gains tax to partner personal portfolio
        const grossPartner2Portfolio = parseFloat(inputs.partner2CurrentPersonalPortfolio || inputs.partnerCurrentPersonalPortfolio || 0);
        const partner2TaxRate = (inputs.partner2PortfolioTaxRate || 25) / 100;
        partnerPersonal = grossPartner2Portfolio * (1 - partner2TaxRate);
        
        // Extract partner contributions
        const partner2Salary = parseFloat(inputs.partner2Salary || 0);
        if (partner2Salary > 0) {
            const partner2PensionRate = parseFloat(inputs.partner2EmployeePensionRate || inputs.employeePensionRate || 7) / 100;
            const partner2EmployerRate = parseFloat(inputs.partner2EmployerPensionRate || inputs.employerPensionRate || 14.333) / 100;
            partnerMonthlyPensionContrib = partner2Salary * (partner2PensionRate + partner2EmployerRate);
            
            const partner2TrainingRate = parseFloat(inputs.partner2TrainingFundRate || inputs.trainingFundContributionRate || 10) / 100;
            partnerMonthlyTrainingContrib = partner2Salary * partner2TrainingRate;
        }
        partnerMonthlyPersonalContrib = parseFloat(inputs.partner2PersonalSavings || inputs.partner2PersonalPortfolioMonthly || 0);
    }

    const projections = { primary: [], partner: [], combined: [] };

    // Year-by-year progressive calculation with proper compound growth
    for (let age = currentAge; age <= retirementAge; age++) {
        const yearsFromStart = age - currentAge;
        
        // Apply compound growth to existing amounts (monthly compounding)
        if (yearsFromStart > 0) {
            const monthlyPensionReturn = pensionReturn / 12;
            const monthlyTrainingReturn = trainingFundReturn / 12;
            const monthlyPersonalReturn = personalPortfolioReturn / 12;
            
            // Primary partner growth with monthly contributions and bounds checking
            primaryPension = Math.min(primaryPension * (1 + monthlyPensionReturn) + monthlyPensionContrib, 50000000);
            primaryTraining = Math.min(primaryTraining * (1 + monthlyTrainingReturn) + monthlyTrainingContrib, 20000000);
            primaryPersonal = Math.min(primaryPersonal * (1 + monthlyPersonalReturn) + monthlyPersonalContrib, 100000000);
            
            // Partner growth with monthly contributions
            if (inputs.planningType === 'couple') {
                partnerPension = Math.min(partnerPension * (1 + monthlyPensionReturn) + partnerMonthlyPensionContrib, 50000000);
                partnerTraining = Math.min(partnerTraining * (1 + monthlyTrainingReturn) + partnerMonthlyTrainingContrib, 20000000);
                partnerPersonal = Math.min(partnerPersonal * (1 + monthlyPersonalReturn) + partnerMonthlyPersonalContrib, 100000000);
            }
        }
        
        // Calculate totals
        const primaryTotal = primaryPension + primaryTraining + primaryPersonal;
        const partnerTotal = partnerPension + partnerTraining + partnerPersonal;
        const combinedTotal = primaryTotal + partnerTotal;
        
        // CORRECT real value calculation: Apply inflation to the nominal value
        const inflationAdjuster = Math.pow(1 + inflationRate, yearsFromStart);
        
        // Primary partner data
        projections.primary.push({
            age: age,
            nominal: Math.round(primaryTotal),
            real: Math.round(primaryTotal / inflationAdjuster),
            pensionSavings: Math.round(primaryPension),
            trainingFund: Math.round(primaryTraining),
            personalPortfolio: Math.round(primaryPersonal),
            yearlyContributions: Math.round((monthlyPensionContrib + monthlyTrainingContrib + monthlyPersonalContrib) * 12)
        });

        // Partner data
        projections.partner.push({
            age: age,
            nominal: Math.round(partnerTotal),
            real: Math.round(partnerTotal / inflationAdjuster),
            pensionSavings: Math.round(partnerPension),
            trainingFund: Math.round(partnerTraining),
            personalPortfolio: Math.round(partnerPersonal),
            yearlyContributions: Math.round((partnerMonthlyPensionContrib + partnerMonthlyTrainingContrib + partnerMonthlyPersonalContrib) * 12)
        });

        // Combined household data
        projections.combined.push({
            age: age,
            nominal: Math.round(combinedTotal),
            real: Math.round(combinedTotal / inflationAdjuster),
            primaryTotal: Math.round(primaryTotal),
            partnerTotal: Math.round(partnerTotal),
            totalYearlyContributions: Math.round((
                monthlyPensionContrib + monthlyTrainingContrib + monthlyPersonalContrib +
                partnerMonthlyPensionContrib + partnerMonthlyTrainingContrib + partnerMonthlyPersonalContrib
            ) * 12)
        });
    }

    return projections;
};

// Enhanced unified projections using the new progressive engine
window.generateUnifiedPartnerProjections = (
    inputs, 
    workPeriods = [], 
    partnerWorkPeriods = [],
    pensionIndexAllocation = [],
    trainingFundIndexAllocation = [],
    historicalReturns = {}
) => {
    // Use the new progressive calculation engine
    return window.calculateProgressiveSavings(inputs, workPeriods, partnerWorkPeriods);
};

// Export the unified function for chart components to use
window.getUnifiedPartnerData = window.generateUnifiedPartnerProjections;

// Export functions
window.ProgressiveCalculations = {
    calculateProgressiveSavings: window.calculateProgressiveSavings,
    generateUnifiedPartnerProjections: window.generateUnifiedPartnerProjections,
    getUnifiedPartnerData: window.getUnifiedPartnerData
};

console.log('✅ Progressive calculations module loaded');