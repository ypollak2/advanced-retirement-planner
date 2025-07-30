// src/utils/inputAdapter.js

/**
 * Adapts the wizard's input data structure to the format expected by the financialHealthEngine.
 * This promotes decoupling and makes the system more modular.
 *
 * @param {object} wizardInputs - The raw input object from the wizard.
 * @returns {object} - The adapted input object for the financialHealthEngine.
 */
window.adaptInputsForFinancialHealth = function(wizardInputs) {
    const adaptedInputs = {
        ...wizardInputs,
        planningType: wizardInputs.planningType,
        country: wizardInputs.country || wizardInputs.taxCountry,
        currentAge: wizardInputs.currentAge,
        retirementAge: wizardInputs.retirementAge,
        
        // Direct mappings
        emergencyFund: wizardInputs.emergencyFundAmount,
        riskTolerance: wizardInputs.riskProfile,

        // Consolidate savings and assets
        currentSavings: wizardInputs.totalCurrentSavings,
        currentPersonalPortfolio: wizardInputs.totalPortfolioValue,
        currentRealEstate: wizardInputs.totalRealEstateValue,
        currentCrypto: wizardInputs.totalCryptoValue,
        
        // Consolidate income
        currentMonthlySalary: wizardInputs.currentSalary,
        partner1Salary: wizardInputs.partner1Salary,
        partner2Salary: wizardInputs.partner2Salary,

        // Consolidate contributions
        pensionContributionRate: wizardInputs.pensionEmployeeRate,
        trainingFundContributionRate: wizardInputs.trainingFundEmployeeRate,

        // Map expenses
        expenses: wizardInputs.monthlyExpenses,
        
        // Map portfolio allocations
        portfolioAllocations: wizardInputs.investmentAllocation,
    };

    console.log("Adapted Inputs for Financial Health Engine:", adaptedInputs);

    return adaptedInputs;
};
