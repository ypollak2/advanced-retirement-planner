// WizardStepReview Core Component
// Main component that orchestrates all review modules

const WizardStepReview = ({ inputs, setInputs, language = 'en', workingCurrency = 'ILS' }) => {
    const createElement = React.createElement;
    
    // Get dependencies from modules
    const { getReviewContent, getOverallStatus } = window.ReviewContent || {};
    const { ensureGetAllInputs, validateInputs, checkComplete, processInputs } = window.ReviewInputProcessing || {};
    const { 
        calculateHealthScore, 
        calculateOverallScore, 
        calculateRetirementProjections,
        calculateTotalAccumulation,
        calculateMonthlyRetirementIncome,
        calculateTotalMonthlyIncome,
        prepareExportData
    } = window.ReviewCalculations || {};
    const { 
        OverallAssessment, 
        ComponentScores, 
        NextSteps, 
        ValidationResults, 
        DebugPanelWrapper 
    } = window.ReviewSummaryComponents || {};
    const { HiddenDataStorage } = window.ReviewDataStorage || {};
    
    // Ensure getAllInputs is available
    if (ensureGetAllInputs) {
        ensureGetAllInputs(inputs);
    }
    
    // Get content
    const t = getReviewContent ? getReviewContent()[language] : {};
    
    // Input validation
    const inputValidation = validateInputs ? validateInputs(inputs) : { valid: true, warnings: [], errors: [] };
    
    // Process inputs
    const processedInputs = processInputs ? processInputs(inputs) : inputs;
    
    // Calculate financial health score (memoized)
    const financialHealthScore = React.useMemo(() => {
        return calculateHealthScore ? calculateHealthScore(inputs, processedInputs) : { totalScore: 0, factors: {} };
    }, [inputs.currentMonthlySalary, inputs.pensionContributionRate, inputs.trainingFundContributionRate, 
        inputs.emergencyFund, inputs.currentMonthlyExpenses, inputs.riskTolerance, 
        inputs.portfolioAllocations, inputs.planningType]);
    
    // Calculate overall assessment (memoized)
    const overallScore = React.useMemo(() => {
        return calculateOverallScore ? calculateOverallScore(inputs, financialHealthScore) : 0;
    }, [inputs.currentMonthlySalary, inputs.pensionContributionRate, inputs.trainingFundContributionRate, 
        inputs.emergencyFund, inputs.currentMonthlyExpenses, inputs.riskTolerance, 
        inputs.portfolioAllocations, inputs.planningType, financialHealthScore.totalScore]);
    
    const overallStatus = getOverallStatus ? getOverallStatus(overallScore, language) : { status: '', color: 'gray' };
    
    // Calculate retirement projections (memoized)
    const retirementProjections = React.useMemo(() => {
        return calculateRetirementProjections ? calculateRetirementProjections(processedInputs) : {};
    }, [processedInputs.currentAge, processedInputs.retirementAge, processedInputs.currentSavings, 
        processedInputs.currentTrainingFund, processedInputs.currentPersonalPortfolio,
        processedInputs.currentMonthlySalary, processedInputs.monthlyContribution, 
        processedInputs.inflationRate]);
    
    // Calculate accumulation and income
    const totalAccumulation = calculateTotalAccumulation ? 
        calculateTotalAccumulation(inputs, retirementProjections) : 0;
    const monthlyRetirementIncome = calculateMonthlyRetirementIncome ? 
        calculateMonthlyRetirementIncome(retirementProjections, processedInputs) : 0;
    const totalMonthlyIncome = calculateTotalMonthlyIncome ? 
        calculateTotalMonthlyIncome(inputs) : 0;
    
    // Safety checks for display values
    const safeTotalAccumulation = isNaN(totalAccumulation) || !isFinite(totalAccumulation) ? 0 : totalAccumulation;
    const safeTotalMonthlyIncome = isNaN(totalMonthlyIncome) || !isFinite(totalMonthlyIncome) ? 0 : totalMonthlyIncome;
    
    // Prepare export data
    const exportData = prepareExportData ? 
        prepareExportData(inputs, financialHealthScore, retirementProjections, processedInputs) : 
        { inputs: {}, results: {}, partnerResults: null };
    
    // Log inputs for debugging
    console.log('📊 Inputs passed to Retirement Calculations:', {
        currentAge: inputs.currentAge,
        retirementAge: inputs.retirementAge,
        currentSavings: inputs.currentSavings,
        monthlyContribution: inputs.monthlyContribution,
        pensionIndexAllocation: inputs.pensionIndexAllocation,
        hasWorkPeriods: !!(inputs.workPeriods || inputs.employment),
        inflationRate: inputs.inflationRate,
        exchangeRates: inputs.exchangeRates ? Object.keys(inputs.exchangeRates) : 'none'
    });
    
    // Main render
    return createElement('div', {
        className: "space-y-8 p-6 max-w-7xl mx-auto"
    }, [
        // Header Section
        createElement('div', {
            key: 'header',
            className: "text-center mb-8"
        }, [
            createElement('h2', {
                key: 'title',
                className: 'text-3xl font-bold text-gray-800 mb-2'
            }, t.title),
            createElement('p', {
                key: 'subtitle',
                className: 'text-gray-600 max-w-2xl mx-auto'
            }, t.subtitle)
        ]),
        
        // Overall Assessment
        OverallAssessment && createElement(OverallAssessment, {
            key: 'overall-assessment',
            overallScore,
            overallStatus,
            language
        }),
        
        // Financial Health Score Enhanced Component
        window.FinancialHealthScoreEnhanced && createElement('div', {
            key: 'financial-health-score-wrapper',
            className: "mb-8 financial-health-score"
        }, [
            createElement(window.FinancialHealthScoreEnhanced, {
                key: 'enhanced-score',
                inputs: processedInputs,
                language: language,
                className: "financial-health-score"
            })
        ]),
        
        // Debug Panel
        DebugPanelWrapper && createElement(DebugPanelWrapper, {
            key: 'debug-panel',
            financialHealthScore,
            processedInputs,
            language
        }),
        
        // Component Scores Section
        ComponentScores && createElement(ComponentScores, {
            key: 'component-scores',
            financialHealthScore,
            overallScore,
            safeTotalAccumulation,
            safeTotalMonthlyIncome,
            language,
            workingCurrency
        }),
        
        // Additional Panels (conditional rendering)
        window.ComprehensiveFinancialSummary && createElement(window.ComprehensiveFinancialSummary, {
            key: 'comprehensive-financial-summary',
            inputs: inputs,
            language: language,
            workingCurrency: workingCurrency
        }),
        
        window.InflationImpactDisplay && createElement(window.InflationImpactDisplay, {
            key: 'inflation-impact',
            retirementProjections: retirementProjections,
            inputs: inputs,
            language: language,
            workingCurrency: workingCurrency
        }),
        
        window.AdditionalIncomeTaxPanel && createElement(window.AdditionalIncomeTaxPanel, {
            key: 'additional-income-tax',
            inputs: inputs,
            language: language,
            workingCurrency: workingCurrency
        }),
        
        inputs.partnerPlanningEnabled && window.CoupleCompatibilityPanel && createElement(window.CoupleCompatibilityPanel, {
            key: 'couple-compatibility',
            inputs: inputs,
            language: language
        }),
        
        window.RetirementProjectionPanel && createElement(window.RetirementProjectionPanel, {
            key: 'retirement-projection',
            inputs: inputs,
            language: language,
            workingCurrency: workingCurrency
        }),
        
        window.ExpenseAnalysisPanel && createElement(window.ExpenseAnalysisPanel, {
            key: 'expense-analysis',
            inputs: inputs,
            language: language,
            workingCurrency: workingCurrency
        }),
        
        window.DebtPayoffTimelinePanel && createElement(window.DebtPayoffTimelinePanel, {
            key: 'debt-payoff-timeline',
            inputs: inputs,
            language: language,
            workingCurrency: workingCurrency
        }),
        
        window.DynamicReturnAdjustmentPanel && createElement(window.DynamicReturnAdjustmentPanel, {
            key: 'dynamic-return-adjustment',
            inputs: inputs,
            language: language,
            workingCurrency: workingCurrency
        }),
        
        window.StressTestPanel && createElement(window.StressTestPanel, {
            key: 'stress-test',
            inputs: inputs,
            language: language,
            workingCurrency: workingCurrency
        }),
        
        window.ActionItemsPanel && createElement(window.ActionItemsPanel, {
            key: 'action-items',
            inputs: inputs,
            language: language,
            workingCurrency: workingCurrency
        }),
        
        window.CountrySpecificRecommendations && createElement(window.CountrySpecificRecommendations, {
            key: 'country-specific',
            inputs: inputs,
            language: language,
            workingCurrency: workingCurrency
        }),
        
        // Validation Results
        ValidationResults && createElement(ValidationResults, {
            key: 'validation-results',
            inputValidation,
            language
        }),
        
        // Export Controls
        window.ExportControls && createElement('div', {
            key: 'export-section',
            className: "mb-8"
        }, [
            createElement(window.ExportControls, {
                key: 'export-controls',
                inputs: exportData.inputs,
                results: exportData.results,
                partnerResults: exportData.partnerResults,
                language: language
            })
        ]),
        
        // Hidden Data Storage
        HiddenDataStorage && createElement(HiddenDataStorage, {
            key: 'hidden-data',
            inputs,
            processedInputs,
            financialHealthScore,
            retirementProjections,
            overallScore,
            inputValidation
        }),
        
        // Next Steps
        NextSteps && createElement(NextSteps, {
            key: 'next-steps',
            language
        })
    ]);
};

// Export to window for global access
window.WizardStepReview = WizardStepReview;

// Initialize particle background on first render of review step
if (window.ParticleBackground && !window.particleBackgroundInitialized) {
    window.ParticleBackground.init();
    window.addParticleToggle && window.addParticleToggle();
    window.particleBackgroundInitialized = true;
}

console.log('✅ WizardStepReview Core component loaded');