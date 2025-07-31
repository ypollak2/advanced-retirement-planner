// src/utils/inputAdapter.js

/**
 * Adapts the wizard's input data structure to the format expected by the financialHealthEngine.
 * This promotes decoupling and makes the system more modular.
 *
 * @param {object} wizardInputs - The raw input object from the wizard.
 * @returns {object} - The adapted input object for the financialHealthEngine.
 */
window.adaptInputsForFinancialHealth = function(wizardInputs) {
    // First, preserve all original fields to prevent data loss
    const adaptedInputs = {
        ...wizardInputs
    };
    
    // Add additional mappings for fields that may have different names
    // Only override if the source field exists and target doesn't
    
    // Handle emergency fund mapping
    if (wizardInputs.emergencyFundAmount !== undefined && !adaptedInputs.emergencyFund) {
        adaptedInputs.emergencyFund = wizardInputs.emergencyFundAmount;
    }
    
    // Handle risk tolerance - the wizard uses riskTolerance, not riskProfile
    if (wizardInputs.riskTolerance !== undefined) {
        adaptedInputs.riskTolerance = wizardInputs.riskTolerance;
    }
    
    // For individual mode, map salary fields if they exist
    if (wizardInputs.planningType !== 'couple') {
        // Try multiple possible salary field names
        const salaryValue = wizardInputs.currentMonthlySalary || 
                           wizardInputs.monthlySalary || 
                           wizardInputs.salary ||
                           wizardInputs.currentSalary;
        
        if (salaryValue !== undefined && !adaptedInputs.currentMonthlySalary) {
            adaptedInputs.currentMonthlySalary = salaryValue;
        }
    }
    
    // Map contribution rates - use the actual field names from the wizard
    const pensionFields = ['pensionContributionRate', 'pensionEmployeeRate', 'employeePensionRate', 'pensionRate'];
    for (const field of pensionFields) {
        if (wizardInputs[field] !== undefined && wizardInputs[field] > 0) {
            adaptedInputs.pensionContributionRate = wizardInputs[field];
            break;
        }
    }
    
    const trainingFields = ['trainingFundContributionRate', 'trainingFundEmployeeRate', 'employeeTrainingFundRate', 'trainingFundRate'];
    for (const field of trainingFields) {
        if (wizardInputs[field] !== undefined && wizardInputs[field] > 0) {
            adaptedInputs.trainingFundContributionRate = wizardInputs[field];
            break;
        }
    }
    
    // Handle savings and asset mappings
    if (wizardInputs.totalCurrentSavings !== undefined && !adaptedInputs.currentSavings) {
        adaptedInputs.currentSavings = wizardInputs.totalCurrentSavings;
    }
    
    if (wizardInputs.totalPortfolioValue !== undefined && !adaptedInputs.currentPersonalPortfolio) {
        adaptedInputs.currentPersonalPortfolio = wizardInputs.totalPortfolioValue;
    }
    
    if (wizardInputs.totalRealEstateValue !== undefined && !adaptedInputs.currentRealEstate) {
        adaptedInputs.currentRealEstate = wizardInputs.totalRealEstateValue;
    }
    
    if (wizardInputs.totalCryptoValue !== undefined && !adaptedInputs.currentCrypto) {
        adaptedInputs.currentCrypto = wizardInputs.totalCryptoValue;
    }
    
    // Map expenses if needed
    if (wizardInputs.monthlyExpenses !== undefined && !adaptedInputs.expenses) {
        adaptedInputs.expenses = wizardInputs.monthlyExpenses;
    }
    
    // Map portfolio allocations if needed
    if (wizardInputs.investmentAllocation !== undefined && !adaptedInputs.portfolioAllocations) {
        adaptedInputs.portfolioAllocations = wizardInputs.investmentAllocation;
    }
    
    console.log("Adapted Inputs for Financial Health Engine:", {
        planningType: adaptedInputs.planningType,
        hasPartner1Salary: !!adaptedInputs.partner1Salary,
        hasPartner2Salary: !!adaptedInputs.partner2Salary,
        hasCurrentMonthlySalary: !!adaptedInputs.currentMonthlySalary,
        hasPensionRate: !!adaptedInputs.pensionContributionRate,
        hasTrainingRate: !!adaptedInputs.trainingFundContributionRate,
        hasRiskTolerance: !!adaptedInputs.riskTolerance,
        hasEmergencyFund: !!adaptedInputs.emergencyFund,
        totalFields: Object.keys(adaptedInputs).length
    });

    return adaptedInputs;
};
