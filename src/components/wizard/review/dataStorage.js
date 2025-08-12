// Data Storage Component Module
// Hidden data storage for debugging and test inspection

function HiddenDataStorage({ inputs, processedInputs, financialHealthScore, retirementProjections, overallScore, inputValidation }) {
    // Data validation object for field mapping status
    const dataValidation = {
        hasSalary: processedInputs.currentMonthlySalary > 0,
        hasPensionRate: processedInputs.pensionContributionRate >= 0,
        hasTrainingFundRate: processedInputs.trainingFundContributionRate >= 0,
        hasEmergencyFund: processedInputs.emergencyFund > 0,
        hasExpenses: processedInputs.currentMonthlyExpenses > 0,
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
    
    return React.createElement('div', {
        key: 'hidden-data-storage',
        id: 'wizard-data-storage',
        style: { display: 'none' },
        'data-testid': 'wizard-complete-data',
        'data-original-inputs': JSON.stringify(inputs),
        'data-processed-inputs': JSON.stringify(processedInputs),
        'data-financial-health-score': JSON.stringify(financialHealthScore),
        'data-retirement-projections': JSON.stringify(retirementProjections),
        'data-overall-score': overallScore,
        'data-validation-results': JSON.stringify(inputValidation),
        'data-planning-type': inputs.planningType || 'individual',
        'data-field-mapping-status': JSON.stringify({
            currentMonthlySalary: {
                original: inputs.currentMonthlySalary || null,
                processed: processedInputs.currentMonthlySalary,
                status: processedInputs.currentMonthlySalary > 0 ? 'valid' : 'missing',
                isCoupleMode: inputs.planningType === 'couple',
                coupleModeCombined: inputs.planningType === 'couple' ? {
                    partner1: inputs.partner1Salary || 0,
                    partner2: inputs.partner2Salary || 0,
                    combined: processedInputs.currentMonthlySalary
                } : null
            },
            pensionContributionRate: {
                original: inputs.pensionContributionRate || null,
                processed: processedInputs.pensionContributionRate,
                status: processedInputs.pensionContributionRate >= 0 ? 'valid' : 'missing',
                coupleData: inputs.planningType === 'couple' ? {
                    partner1Rate: inputs.partner1PensionRate || 0,
                    partner2Rate: inputs.partner2PensionRate || 0,
                    weightedAverage: processedInputs.pensionContributionRate
                } : null
            },
            trainingFundContributionRate: {
                original: inputs.trainingFundContributionRate || null,
                processed: processedInputs.trainingFundContributionRate,
                status: processedInputs.trainingFundContributionRate >= 0 ? 'valid' : 'missing',
                coupleData: inputs.planningType === 'couple' ? {
                    partner1Rate: inputs.partner1TrainingFundRate || 0,
                    partner2Rate: inputs.partner2TrainingFundRate || 0,
                    weightedAverage: processedInputs.trainingFundContributionRate
                } : null
            },
            emergencyFund: {
                original: inputs.emergencyFund || null,
                processed: processedInputs.emergencyFund,
                status: processedInputs.emergencyFund >= 0 ? 'valid' : 'missing',
                coupleData: inputs.planningType === 'couple' ? {
                    partner1Fund: inputs.partner1EmergencyFund || 0,
                    partner2Fund: inputs.partner2EmergencyFund || 0,
                    combined: processedInputs.emergencyFund
                } : null
            },
            monthlyExpenses: {
                original: inputs.currentMonthlyExpenses || null,
                processed: processedInputs.currentMonthlyExpenses,
                status: processedInputs.currentMonthlyExpenses >= 0 ? 'valid' : 'missing',
                coupleData: inputs.planningType === 'couple' ? {
                    partner1Expenses: inputs.partner1MonthlyExpenses || 0,
                    partner2Expenses: inputs.partner2MonthlyExpenses || 0,
                    sharedExpenses: inputs.sharedMonthlyExpenses || 0,
                    combined: processedInputs.currentMonthlyExpenses
                } : null
            },
            dataValidation: dataValidation,
            calculatorReadiness: {
                hasAllRequiredFields: processedInputs.currentMonthlySalary > 0 && 
                                     processedInputs.pensionContributionRate >= 0 && 
                                     processedInputs.trainingFundContributionRate >= 0,
                missingCriticalData: dataValidation.missingFields,
                coupleModeStatus: inputs.planningType === 'couple' ? 'enabled' : 'disabled'
            }
        }),
        'data-couple-mode-details': inputs.planningType === 'couple' ? JSON.stringify({
            detectedPartnerFields: {
                partner1Fields: Object.keys(inputs).filter(key => key.includes('partner1')),
                partner2Fields: Object.keys(inputs).filter(key => key.includes('partner2')),
                sharedFields: Object.keys(inputs).filter(key => key.includes('shared'))
            },
            combinationLogic: {
                salaryLogic: 'partner1Salary + partner2Salary = currentMonthlySalary',
                pensionLogic: 'weighted average by salary',
                emergencyLogic: 'partner1EmergencyFund + partner2EmergencyFund = emergencyFund',
                expensesLogic: 'partner1Expenses + partner2Expenses + sharedExpenses = currentMonthlyExpenses'
            }
        }) : null
    }, [
        React.createElement('div', {
            key: 'data-summary',
            className: 'data-summary'
        }, 'Complete wizard data stored for debugging and testing')
    ]);
}

// Export to window
window.ReviewDataStorage = {
    HiddenDataStorage
};

console.log('✅ Review data storage module loaded');