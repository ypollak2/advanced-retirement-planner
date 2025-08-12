// Input Processing Module
// Handles input validation and field mapping for review step

// Ensure getAllInputs is available (fallback for production)
function ensureGetAllInputs(inputs) {
    if (!window.getAllInputs) {
        window.getAllInputs = function() {
            // Try localStorage first
            try {
                const savedInputs = localStorage.getItem('retirementWizardInputs');
                if (savedInputs) {
                    const parsedInputs = JSON.parse(savedInputs);
                    console.log('📋 Review Step: Retrieved', Object.keys(parsedInputs).length, 'fields from localStorage');
                    return parsedInputs;
                }
            } catch (e) {
                console.error('Review Step: Failed to get inputs from localStorage:', e);
            }
            
            // Fallback to current inputs prop
            if (inputs && Object.keys(inputs).length > 0) {
                console.log('📋 Review Step: Using current inputs prop');
                return inputs;
            }
            
            // Try window.wizardInputs
            if (window.wizardInputs) {
                console.log('📋 Review Step: Using window.wizardInputs');
                return window.wizardInputs;
            }
            
            console.warn('⚠️ Review Step: No inputs found - returning empty object');
            return {};
        };
        console.log('✅ Review Step: Added fallback getAllInputs function');
    }
}

// Input validation
function validateInputs(inputs) {
    if (window.InputValidation) {
        return window.InputValidation.validators.retirementProjectionInputs(inputs);
    }
    return { valid: true, warnings: [], errors: [] };
}

// Check if all required fields are complete
function checkComplete(inputs) {
    const validation = validateInputs(inputs);
    return validation.valid && validation.errors.length === 0;
}

// Process and map inputs for financial health compatibility
function processInputs(inputs) {
    const baseInputs = { ...inputs };
    
    // Debug: Log the original inputs structure
    console.log('🔍 WizardStepReview - Original inputs structure:', {
        keys: Object.keys(inputs),
        planningType: inputs.planningType,
        hasPartner1Salary: !!inputs.partner1Salary,
        hasPartner2Salary: !!inputs.partner2Salary,
        hasCurrentMonthlySalary: !!inputs.currentMonthlySalary,
        hasCurrentSalary: !!inputs.currentSalary,
        hasPensionContributionRate: !!inputs.pensionContributionRate,
        hasTrainingFundContributionRate: !!inputs.trainingFundContributionRate,
        hasEmergencyFund: !!inputs.emergencyFund
    });
    
    // Fix field mapping: currentSalary -> currentMonthlySalary
    if (!baseInputs.currentMonthlySalary && baseInputs.currentSalary) {
        baseInputs.currentMonthlySalary = baseInputs.currentSalary;
    }
    
    // Enhanced field mapping for Financial Health Score engine compatibility
    const mappedInputs = {
        ...baseInputs,
        
        // IMPORTANT: Keep the original contribution rate fields for financial health engine
        employeePensionRate: inputs.employeePensionRate,
        employerPensionRate: inputs.employerPensionRate,
        trainingFundEmployeeRate: inputs.trainingFundEmployeeRate,
        trainingFundEmployerRate: inputs.trainingFundEmployerRate,
        
        // Enhanced salary field mapping with couple mode support
        currentMonthlySalary: (() => {
            // For couple mode, prioritize combining partner salaries
            if (inputs.planningType === 'couple') {
                const partner1 = parseFloat(inputs.partner1Salary) || 0;
                const partner2 = parseFloat(inputs.partner2Salary) || 0;
                
                if (partner1 > 0 || partner2 > 0) {
                    const combinedSalary = partner1 + partner2;
                    console.log('🤝 Couple mode: Combined partner salaries', { partner1, partner2, combined: combinedSalary });
                    return combinedSalary;
                }
            }
            
            // Fall back to individual salary fields
            let salary = baseInputs.currentMonthlySalary ||  // Include the mapped value from baseInputs
                       inputs.currentMonthlySalary || 
                       inputs.monthlySalary || 
                       inputs.salary ||
                       inputs.monthlyIncome ||
                       inputs.currentSalary ||
                       0;
            
            return salary;
        })(),
        
        // Enhanced contribution rate field mapping with couple mode support
        pensionContributionRate: (() => {
            // For couple mode, combine partner rates if available
            if (inputs.planningType === 'couple') {
                // Correct field names: partner1EmployeeRate + partner1EmployerRate
                const partner1Employee = parseFloat(inputs.partner1EmployeeRate) || 0;
                const partner1Employer = parseFloat(inputs.partner1EmployerRate) || 0;
                const partner1Total = partner1Employee + partner1Employer;
                
                // For partner 2, use main person rates
                const partner2Employee = parseFloat(inputs.employeePensionRate) || 0;
                const partner2Employer = parseFloat(inputs.employerPensionRate) || 0;
                const partner2Total = partner2Employee + partner2Employer;
                
                if (partner1Total > 0 || partner2Total > 0) {
                    // Use weighted average based on salaries
                    const partner1Salary = parseFloat(inputs.partner1Salary) || 0;
                    const partner2Salary = parseFloat(inputs.partner2Salary) || 0;
                    const totalSalary = partner1Salary + partner2Salary;
                    
                    let combinedRate;
                    if (totalSalary > 0) {
                        combinedRate = ((partner1Total * partner1Salary) + (partner2Total * partner2Salary)) / totalSalary;
                    } else {
                        combinedRate = (partner1Total + partner2Total) / 2;
                    }
                    console.log('🤝 Couple mode: Combined pension rates', { 
                        partner1: partner1Total, 
                        partner2: partner2Total, 
                        combined: combinedRate 
                    });
                    return combinedRate;
                }
            }
            
            // Fall back to individual rates
            const employeeRate = parseFloat(inputs.employeePensionRate) || 0;
            const employerRate = parseFloat(inputs.employerPensionRate) || 0;
            const combinedRate = employeeRate + employerRate;
            
            return inputs.pensionContributionRate !== undefined ? 
                   inputs.pensionContributionRate : combinedRate;
        })(),
        
        // Training fund contribution rate mapping
        trainingFundContributionRate: (() => {
            // For couple mode, combine partner rates
            if (inputs.planningType === 'couple') {
                const partner1TfEmployee = parseFloat(inputs.partner1TrainingFundEmployeeRate) || 0;
                const partner1TfEmployer = parseFloat(inputs.partner1TrainingFundEmployerRate) || 0;
                const partner1TfTotal = partner1TfEmployee + partner1TfEmployer;
                
                const partner2TfEmployee = parseFloat(inputs.trainingFundEmployeeRate) || 0;
                const partner2TfEmployer = parseFloat(inputs.trainingFundEmployerRate) || 0;
                const partner2TfTotal = partner2TfEmployee + partner2TfEmployer;
                
                if (partner1TfTotal > 0 || partner2TfTotal > 0) {
                    const partner1Salary = parseFloat(inputs.partner1Salary) || 0;
                    const partner2Salary = parseFloat(inputs.partner2Salary) || 0;
                    const totalSalary = partner1Salary + partner2Salary;
                    
                    let combinedTfRate;
                    if (totalSalary > 0) {
                        combinedTfRate = ((partner1TfTotal * partner1Salary) + (partner2TfTotal * partner2Salary)) / totalSalary;
                    } else {
                        combinedTfRate = (partner1TfTotal + partner2TfTotal) / 2;
                    }
                    console.log('🤝 Couple mode: Combined training fund rates', { 
                        partner1: partner1TfTotal, 
                        partner2: partner2TfTotal, 
                        combined: combinedTfRate 
                    });
                    return combinedTfRate;
                }
            }
            
            // Fall back to individual rates
            const tfEmployeeRate = parseFloat(inputs.trainingFundEmployeeRate) || 0;
            const tfEmployerRate = parseFloat(inputs.trainingFundEmployerRate) || 0;
            const combinedTfRate = tfEmployeeRate + tfEmployerRate;
            
            return inputs.trainingFundContributionRate !== undefined ? 
                   inputs.trainingFundContributionRate : combinedTfRate;
        })(),
        
        // Emergency fund mapping with couple mode support
        emergencyFund: (() => {
            if (inputs.planningType === 'couple') {
                const partner1Fund = parseFloat(inputs.partner1BankAccount) || parseFloat(inputs.partner1EmergencyFund) || 0;
                const partner2Fund = parseFloat(inputs.partner2BankAccount) || parseFloat(inputs.partner2EmergencyFund) || 0;
                
                if (partner1Fund > 0 || partner2Fund > 0) {
                    const combinedFund = partner1Fund + partner2Fund;
                    console.log('🤝 Couple mode: Combined emergency funds', { 
                        partner1: partner1Fund, 
                        partner2: partner2Fund, 
                        combined: combinedFund 
                    });
                    return combinedFund;
                }
            }
            
            return parseFloat(inputs.emergencyFund) || 
                   parseFloat(inputs.bankAccount) || 
                   parseFloat(inputs.bankBalance) || 
                   0;
        })(),
        
        // Monthly expenses mapping with couple mode support
        currentMonthlyExpenses: (() => {
            if (inputs.planningType === 'couple') {
                const partner1Expenses = parseFloat(inputs.partner1MonthlyExpenses) || 0;
                const partner2Expenses = parseFloat(inputs.partner2MonthlyExpenses) || 0;
                const sharedExpenses = parseFloat(inputs.sharedMonthlyExpenses) || 0;
                
                if (partner1Expenses > 0 || partner2Expenses > 0 || sharedExpenses > 0) {
                    const totalExpenses = partner1Expenses + partner2Expenses + sharedExpenses;
                    console.log('🤝 Couple mode: Combined expenses', { 
                        partner1: partner1Expenses, 
                        partner2: partner2Expenses, 
                        shared: sharedExpenses, 
                        total: totalExpenses 
                    });
                    return totalExpenses;
                }
            }
            
            return parseFloat(inputs.currentMonthlyExpenses) || 
                   parseFloat(inputs.monthlyExpenses) || 
                   parseFloat(inputs.expenses) || 
                   0;
        })(),
        
        // Preserve all other fields
        riskTolerance: inputs.riskTolerance || 'moderate',
        portfolioAllocations: inputs.portfolioAllocations || [],
        
        // Monthly contribution calculation
        monthlyContribution: inputs.monthlyContribution || 
                            inputs.monthlyInvestment ||
                            inputs.monthlySavings || 0
    };
    
    // Log field mapping results for debugging
    const dataValidation = {
        hasSalary: mappedInputs.currentMonthlySalary > 0,
        hasPensionRate: mappedInputs.pensionContributionRate >= 0,
        hasTrainingFundRate: mappedInputs.trainingFundContributionRate >= 0,
        hasEmergencyFund: mappedInputs.emergencyFund > 0,
        hasExpenses: mappedInputs.currentMonthlyExpenses > 0,
        planningType: inputs.planningType || 'individual',
        country: inputs.country || inputs.taxCountry || 'israel',
        missingFields: []
    };
    
    // Identify missing critical fields
    if (!dataValidation.hasSalary) dataValidation.missingFields.push('currentMonthlySalary');
    if (!dataValidation.hasPensionRate) dataValidation.missingFields.push('pensionContributionRate');
    if (!dataValidation.hasTrainingFundRate) dataValidation.missingFields.push('trainingFundContributionRate');
    if (!dataValidation.hasEmergencyFund) dataValidation.missingFields.push('emergencyFund');
    if (!dataValidation.hasExpenses) dataValidation.missingFields.push('currentMonthlyExpenses');
    
    console.log('📋 Enhanced field mapping results:', {
        currentMonthlySalary: mappedInputs.currentMonthlySalary,
        pensionContributionRate: mappedInputs.pensionContributionRate,
        trainingFundContributionRate: mappedInputs.trainingFundContributionRate,
        emergencyFund: mappedInputs.emergencyFund,
        currentMonthlyExpenses: mappedInputs.currentMonthlyExpenses,
        dataValidation: dataValidation,
        missingCriticalFields: dataValidation.missingFields
    });
    
    return mappedInputs;
}

// Export to window
window.ReviewInputProcessing = {
    ensureGetAllInputs,
    validateInputs,
    checkComplete,
    processInputs
};

console.log('✅ Review input processing module loaded');