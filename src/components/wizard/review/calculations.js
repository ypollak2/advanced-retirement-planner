// Review Calculations Module
// Handles financial health score and retirement projection calculations

// Calculate health score with fallback logic
function calculateHealthScore(inputs, processedInputs) {
    const adaptedInputs = window.adaptInputsForFinancialHealth ? window.adaptInputsForFinancialHealth(inputs) : inputs;

    // Combine ALL original inputs with processed mappings to preserve all data
    const inputsToUse = { 
        ...inputs,  // Keep ALL original data first
        ...processedInputs,  // Then apply processed mappings
        ...adaptedInputs  // Finally apply any adaptations
    };
    
    // Apply fallback values for critical missing fields without overriding existing data
    const inputsWithFallbacks = {
        ...inputsToUse,
        // Only set defaults if the field is truly missing or invalid
        currentMonthlySalary: inputsToUse.currentMonthlySalary || 0,
        pensionContributionRate: inputsToUse.pensionContributionRate >= 0 ? inputsToUse.pensionContributionRate : 0,
        trainingFundContributionRate: inputsToUse.trainingFundContributionRate >= 0 ? inputsToUse.trainingFundContributionRate : 0,
        emergencyFund: inputsToUse.emergencyFund >= 0 ? inputsToUse.emergencyFund : 0,
        currentMonthlyExpenses: inputsToUse.currentMonthlyExpenses || 0,
        riskTolerance: inputsToUse.riskTolerance || 'moderate',
        portfolioAllocations: inputsToUse.portfolioAllocations || []
    };
    
    // Enhanced input validation logging with fallback status
    console.log('🔍 Enhanced inputs passed to Financial Health Score:', {
        originalPlanningType: inputs.planningType,
        preservedData: {
            partner1Salary: inputsWithFallbacks.partner1Salary,
            partner2Salary: inputsWithFallbacks.partner2Salary,
            partner1CurrentPension: inputsWithFallbacks.partner1CurrentPension,
            partner2CurrentPension: inputsWithFallbacks.partner2CurrentPension,
            partner1BankAccount: inputsWithFallbacks.partner1BankAccount,
            partner2BankAccount: inputsWithFallbacks.partner2BankAccount
        },
        finalInputs: {
            hasSalary: !!inputsWithFallbacks.currentMonthlySalary,
            salaryValue: inputsWithFallbacks.currentMonthlySalary,
            hasContributions: !!inputsWithFallbacks.monthlyContribution,
            contributionValue: inputsWithFallbacks.monthlyContribution,
            hasPortfolioAllocations: !!inputsWithFallbacks.portfolioAllocations?.length,
            portfolioCount: inputsWithFallbacks.portfolioAllocations?.length || 0,
            hasPensionContributions: inputsWithFallbacks.pensionContributionRate >= 0,
            pensionRate: inputsWithFallbacks.pensionContributionRate,
            hasTrainingFundContributions: inputsWithFallbacks.trainingFundContributionRate >= 0,
            trainingFundRate: inputsWithFallbacks.trainingFundContributionRate,
            hasEmergencyFund: inputsWithFallbacks.emergencyFund > 0,
            emergencyFundValue: inputsWithFallbacks.emergencyFund,
            hasExpenses: inputsWithFallbacks.currentMonthlyExpenses > 0,
            expensesValue: inputsWithFallbacks.currentMonthlyExpenses,
            riskTolerance: inputsWithFallbacks.riskTolerance,
            planningType: inputsWithFallbacks.planningType,
            country: inputsWithFallbacks.country || inputsWithFallbacks.taxCountry || 'unknown'
        },
        fallbacksApplied: {
            salaryFallback: inputsToUse.currentMonthlySalary !== inputsWithFallbacks.currentMonthlySalary,
            pensionFallback: inputsToUse.pensionContributionRate !== inputsWithFallbacks.pensionContributionRate,
            emergencyFallback: inputsToUse.emergencyFund !== inputsWithFallbacks.emergencyFund,
            expensesFallback: inputsToUse.currentMonthlyExpenses !== inputsWithFallbacks.currentMonthlyExpenses
        }
    });
    
    if (window.calculateFinancialHealthScore) {
        const result = window.calculateFinancialHealthScore(inputsWithFallbacks);
        
        // Log the result for debugging
        console.log('💯 Financial Health Score Result:', {
            totalScore: result.totalScore,
            hasFactors: !!result.factors,
            factorKeys: result.factors ? Object.keys(result.factors) : [],
            isValidScore: typeof result.totalScore === 'number' && result.totalScore >= 0
        });
        
        return result;
    }
    
    console.warn('⚠️ calculateFinancialHealthScore function not available');
    return { totalScore: 0, factors: {} };
}

// Calculate overall assessment score
function calculateOverallScore(inputs, financialHealthScore) {
    return window.calculateOverallFinancialHealthScore ? 
        window.calculateOverallFinancialHealthScore(inputs) : financialHealthScore.totalScore || 0;
}

// Calculate retirement projections
function calculateRetirementProjections(processedInputs) {
    console.log('🔄 === CALCULATING RETIREMENT PROJECTIONS ===');
    
    if (!window.calculateRetirement) {
        console.error('❌ calculateRetirement function not available!');
        return {};
    }
    
    try {
        const results = window.calculateRetirement(processedInputs);
        
        console.log('✅ Retirement calculation results:', {
            totalSavings: results.totalSavings || 0,
            totalNetIncome: results.totalNetIncome || 0,
            monthlyIncome: results.monthlyIncome || 0,
            monthlyRetirementIncome: results.monthlyRetirementIncome || 0,
            pensionSavings: results.pensionSavings || 0,
            trainingFundValue: results.trainingFundValue || 0,
            personalPortfolioValue: results.personalPortfolioValue || 0,
            hasData: (results.totalSavings || 0) > 0
        });
        
        if (results.totalSavings === 0) {
            console.warn('⚠️ Total savings is 0 - checking components:');
            console.log('  - Input currentSavings:', processedInputs.currentSavings);
            console.log('  - Input partner1CurrentPension:', processedInputs.partner1CurrentPension);
            console.log('  - Input partner2CurrentPension:', processedInputs.partner2CurrentPension);
        }
        
        return results;
    } catch (error) {
        console.error('❌ Retirement calculation error:', error);
        return {};
    }
}

// Calculate total accumulation from retirement projections
function calculateTotalAccumulation(inputs, retirementProjections) {
    let totalAccumulation = 0;
    
    // For couple mode, sum up all projected values
    if (inputs.planningType === 'couple' && retirementProjections.partnerResults) {
        const partner1Results = retirementProjections.partnerResults.partner1 || {};
        const partner2Results = retirementProjections.partnerResults.partner2 || {};
        
        // Sum all projected savings components for both partners
        totalAccumulation = (partner1Results.totalSavings || 0) +
                           (partner1Results.trainingFundValue || 0) +
                           (partner1Results.personalPortfolioValue || 0) +
                           (partner1Results.currentRealEstate || 0) +
                           (partner1Results.currentCrypto || 0) +
                           (partner2Results.totalSavings || 0) +
                           (partner2Results.trainingFundValue || 0) +
                           (partner2Results.personalPortfolioValue || 0) +
                           (partner2Results.currentRealEstate || 0) +
                           (partner2Results.currentCrypto || 0);
    } else {
        // Individual mode - use all projected components
        totalAccumulation = (retirementProjections.totalSavings || 0) +
                           (retirementProjections.trainingFundValue || 0) +
                           (retirementProjections.personalPortfolioValue || 0) +
                           (retirementProjections.currentRealEstate || 0) +
                           (retirementProjections.currentCrypto || 0);
    }
    
    // If still 0, fall back to current savings (no growth calculated)
    if (totalAccumulation === 0) {
        console.warn('⚠️ No projected values available, showing current savings only');
        if (inputs.planningType === 'couple') {
            totalAccumulation = parseFloat(inputs.partner1CurrentPension || 0) +
                               parseFloat(inputs.partner2CurrentPension || 0) +
                               parseFloat(inputs.partner1BankAccount || 0) +
                               parseFloat(inputs.partner2BankAccount || 0) +
                               parseFloat(inputs.partner1TrainingFund || 0) +
                               parseFloat(inputs.partner2TrainingFund || 0);
        } else {
            totalAccumulation = parseFloat(inputs.currentSavings || 0) +
                               parseFloat(inputs.currentPension || 0) +
                               parseFloat(inputs.bankAccount || 0) +
                               parseFloat(inputs.currentTrainingFund || 0) +
                               parseFloat(inputs.currentPersonalPortfolio || 0);
        }
    }
    
    // Safety check for calculations
    const safeTotalAccumulation = isNaN(totalAccumulation) || !isFinite(totalAccumulation) ? 0 : totalAccumulation;
    
    console.log('💰 Total accumulation at retirement:', {
        planningType: inputs.planningType,
        rawTotal: totalAccumulation,
        safeTotal: safeTotalAccumulation,
        hasProjectedValues: totalAccumulation > 0,
        partnerResultsAvailable: !!retirementProjections.partnerResults
    });
    
    return safeTotalAccumulation;
}

// Calculate monthly retirement income
function calculateMonthlyRetirementIncome(retirementProjections, processedInputs) {
    // For couple mode, sum partner incomes
    if (processedInputs.planningType === 'couple' && retirementProjections.partnerResults) {
        const partner1Income = retirementProjections.partnerResults.partner1?.monthlyRetirementIncome || 0;
        const partner2Income = retirementProjections.partnerResults.partner2?.monthlyRetirementIncome || 0;
        return partner1Income + partner2Income;
    }
    
    // Individual mode or fallback
    return retirementProjections.monthlyRetirementIncome || 
           retirementProjections.monthlyIncome || 0;
}

// Calculate total monthly income (current income)
function calculateTotalMonthlyIncome(inputs) {
    if (inputs.planningType === 'couple') {
        const partner1Income = parseFloat(inputs.partner1Salary || 0) + 
                              parseFloat(inputs.partner1AdditionalIncome || 0);
        const partner2Income = parseFloat(inputs.partner2Salary || 0) + 
                              parseFloat(inputs.partner2AdditionalIncome || 0);
        return partner1Income + partner2Income;
    }
    
    return parseFloat(inputs.currentMonthlySalary || 0) + 
           parseFloat(inputs.additionalIncome || 0) +
           parseFloat(inputs.freelanceIncome || 0) +
           parseFloat(inputs.rentalIncome || 0) +
           parseFloat(inputs.dividendIncome || 0) +
           (parseFloat(inputs.annualBonus || 0) / 12) +
           (parseFloat(inputs.quarterlyRSU || 0) / 3);
}

// Prepare export data
function prepareExportData(inputs, financialHealthScore, retirementProjections, processedInputs) {
    const exportData = {
        inputs: { ...inputs },
        results: {
            overallScore: financialHealthScore.totalScore || 0,
            componentScores: financialHealthScore.factors || {},
            retirement: {
                totalSavings: retirementProjections.totalSavings || 0,
                monthlyIncome: retirementProjections.monthlyIncome || 0,
                projectedNetWorth: retirementProjections.projectedNetWorth || 0
            },
            timestamp: new Date().toISOString(),
            version: '7.5.11'
        },
        partnerResults: null
    };
    
    // Add partner results for couple mode
    if (processedInputs.planningType === 'couple' && retirementProjections.partnerResults) {
        exportData.partnerResults = {
            partner1: retirementProjections.partnerResults.partner1 || {},
            partner2: retirementProjections.partnerResults.partner2 || {},
            combined: {
                totalSavings: (retirementProjections.partnerResults.partner1?.totalSavings || 0) +
                             (retirementProjections.partnerResults.partner2?.totalSavings || 0),
                monthlyIncome: (retirementProjections.partnerResults.partner1?.monthlyRetirementIncome || 0) +
                              (retirementProjections.partnerResults.partner2?.monthlyRetirementIncome || 0)
            }
        };
    }
    
    return exportData;
}

// Export to window
window.ReviewCalculations = {
    calculateHealthScore,
    calculateOverallScore,
    calculateRetirementProjections,
    calculateTotalAccumulation,
    calculateMonthlyRetirementIncome,
    calculateTotalMonthlyIncome,
    prepareExportData
};

console.log('✅ Review calculations module loaded');