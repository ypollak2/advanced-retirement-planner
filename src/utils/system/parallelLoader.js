// Parallel Script Loader for Better Performance
// Enhanced script loading system for Advanced Retirement Planner
// Created by Yali Pollak (יהלי פולק) - v7.0.0

(function() {
    'use strict';
    
    // Define all utility scripts to load in parallel
    const utilityScripts = [
        'src/translations/multiLanguage.js?v=7.2.1',
        'src/data/marketConstants.js?v=7.2.1',
        'src/utils/retirementCalculations.js?v=7.2.1',
        'src/utils/chartDataGenerator.js?v=7.2.1',
        'src/utils/stockPriceAPI.js?v=7.2.1',
        'src/utils/exportFunctions.js?v=7.2.1',
        'src/utils/stressTestScenarios.js?v=7.2.1',
        'src/utils/currencyAPI.js?v=7.2.1',
        'src/utils/IsraeliNationalInsurance.js?v=7.2.1',
        'src/utils/TaxCalculators.js?v=7.2.1&t=20250723-net-salary-calculator',
        'src/utils/additionalIncomeTax.js?v=7.2.1&t=20250723-additional-income-tax',
        'src/utils/coupleValidation.js?v=7.2.1',
        'src/utils/portfolioOptimizer.js?v=7.2.1',
        'src/utils/taxOptimization.js?v=7.2.1',
        'src/utils/dynamicReturnAssumptions.js?v=7.2.1',
        'src/utils/advancedRebalancing.js?v=7.2.1',
        'src/utils/inflationCalculations.js?v=7.2.1',
        'src/utils/expenseCalculations.js?v=7.2.1',
        'src/utils/monteCarloSimulation.js?v=7.2.1',
        'src/utils/withdrawalStrategies.js?v=7.2.1',
        'src/utils/inputValidation.js?v=7.2.1',
        'src/utils/cryptoPriceAPI.js?v=7.2.1&t=20250723-digital-asset-security-fix',
        'src/utils/goalSuggestionEngine.js?v=7.2.1&t=20250723-smart-goals',
        'src/utils/financialHealthEngine.js?v=7.2.1&t=20250723-enhanced-health',
        'src/utils/financialHealthDebugger.js?v=7.2.1&t=20250728-debug-fixes',
        'src/utils/debtCalculations.js?v=7.2.1&t=20250723-debt-timeline'
    ];
    
    // Define all component scripts to load after utilities
    const componentScripts = [
        // Error handling and base components (critical first)
        'src/components/shared/ErrorBoundary.js?v=7.2.1',
        'src/components/forms/SecureInput.js?v=7.2.1',
        'src/components/shared/EnhancedRSUCompanySelector.js?v=7.2.1',
        'src/components/panels/summary/BottomLineSummary.js?v=7.2.1',
        'src/components/charts/FinancialChart.js?v=7.2.1',
        'src/components/shared/MultiCurrencySavings.js?v=7.2.1',
        'src/components/shared/CryptoPortfolioInput.js?v=7.2.1&t=20250723-digital-asset-security-fix',
        'src/components/shared/EnhancedFinancialHealthMeter.js?v=7.2.1&t=20250723-enhanced-health',
        'src/components/shared/ScoreExplanation.js?v=7.2.1&t=20250723-score-explanations',
        'src/components/panels/settings/PermanentSidePanel.js?v=7.2.1',
        
        // Core Wizard Components
        'src/components/wizard/WizardStep.js?v=7.2.1',
        'src/components/wizard/steps/WizardStepPersonal.js?v=7.2.1',
        'src/components/wizard/steps/WizardStepSalary.js?v=7.2.1&t=20250723-enhanced-validation',
        'src/components/wizard/steps/WizardStepExpenses.js?v=7.2.1',
        'src/components/wizard/steps/WizardStepSavings.js?v=7.2.1&t=20250723-crypto-enhancement',
        'src/components/wizard/steps/WizardStepContributions.js?v=7.2.1&t=20250723-partner-training-fund',
        'src/components/wizard/steps/WizardStepFees.js?v=7.2.1',
        'src/components/wizard/steps/WizardStepInvestments.js?v=7.2.1',
        'src/components/wizard/steps/WizardStepGoals.js?v=7.2.1',
        'src/components/wizard/steps/WizardStepInheritance.js?v=7.2.1',
        'src/components/wizard/steps/WizardStepTaxes.js?v=7.2.1',
        
        // Review Components
        'src/utils/reviewCalculations.js?v=7.2.1',
        'src/components/review/AdditionalIncomeTaxPanel.js?v=7.2.1',
        'src/components/review/CoupleCompatibilityPanel.js?v=7.2.1',
        'src/components/review/RetirementProjectionPanel.js?v=7.2.1',
        'src/components/review/ExpenseAnalysisPanel.js?v=7.2.1',
        'src/components/wizard/steps/WizardStepReview.js?v=7.2.1',
        'src/components/wizard/RetirementWizard.js?v=7.2.1',
        
        // Core Components
        'src/components/shared/HelpTooltip.js?v=7.2.1',
        'src/components/shared/FinancialHealthScoreEnhanced.js?v=7.2.1',
        'src/components/analysis/ReadinessScore.js?v=7.2.1',
        'src/components/forms/BasicInputs.js?v=7.2.1',
        'src/components/forms/RetirementAdvancedForm.js?v=7.2.1',
        'src/components/panels/RetirementResultsPanel.js?v=7.2.1',
        'src/components/panels/summary/SavingsSummaryPanel.js?v=7.2.1',
        
        // Advanced Components
        'src/components/charts/ScenarioChart.js?v=7.2.1',
        'src/components/scenarios/ScenarioEditor.js?v=7.2.1',
        'src/components/scenarios/ScenarioComparison.js?v=7.2.1',
        'src/components/tracking/GoalTrackingDashboard.js?v=7.2.1',
        'src/components/validation/CoupleValidationPanel.js?v=7.2.1',
        'src/components/panels/analysis/PortfolioOptimizationPanel.js?v=7.2.1',
        'src/components/panels/analysis/TaxOptimizationPanel.js?v=7.2.1',
        'src/components/panels/analysis/DynamicReturnPanel.js?v=7.2.1',
        'src/components/panels/settings/AdvancedRebalancingPanel.js?v=7.2.1',
        'src/components/panels/analysis/InflationVisualizationPanel.js?v=7.2.1',
        'src/components/panels/DebtPayoffTimelinePanel.js?v=7.2.1&t=20250723-debt-timeline',
        'src/components/panels/DynamicReturnAdjustmentPanel.js?v=7.2.1&t=20250723-dynamic-returns',
        'src/components/analysis/MonteCarloResultsDashboard.js?v=7.2.1',
        'src/components/analysis/WithdrawalStrategyInterface.js?v=7.2.1',
        'src/components/panels/settings/AdvancedSettingsPanel.js?v=7.2.1',
        'src/components/shared/CurrencySelector.js?v=7.2.1',
        'src/components/shared/ExportControls.js?v=7.2.1',
        'src/components/charts/DynamicPartnerCharts.js?v=7.2.1',
        'src/utils/performanceMonitor.js?v=7.2.1',
        'src/utils/dynamicLoader.js?v=7.2.1',
        'src/components/core/LazyComponent.js?v=7.2.1',
        'src/components/core/Dashboard.js?v=7.2.1',
        'src/components/core/RetirementPlannerApp.js?v=7.2.1'
    ];
    
    // Helper function to load scripts in parallel
    function loadScriptsInParallel(scripts) {
        return Promise.all(scripts.map(src => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = (error) => {
                    console.warn('⚠️ Failed to load:', src, error);
                    resolve(); // Continue loading other scripts
                };
                document.head.appendChild(script);
            });
        }));
    }
    
    // Load utility scripts first, then components
    function initializeParallelLoading() {
        console.log('📦 Loading', utilityScripts.length, 'utility scripts in parallel...');
        
        const utilityPromise = loadScriptsInParallel(utilityScripts);
        
        utilityPromise.then(() => {
            console.log('✅ Utility scripts loaded, loading components in parallel...');
            console.log('📦 Loading', componentScripts.length, 'component scripts in parallel...');
            
            return loadScriptsInParallel(componentScripts);
        }).then(() => {
            console.log('✅ All scripts loaded successfully');
            // Trigger application initialization
            document.dispatchEvent(new CustomEvent('scriptsLoaded'));
        }).catch(error => {
            console.error('❌ Script loading error:', error);
        });
        
        // Store promises for access by initialization code
        window.utilityScriptsLoaded = utilityPromise;
        window.componentScriptsLoaded = utilityPromise.then(() => loadScriptsInParallel(componentScripts));
    }
    
    // Initialize when DOM is ready or immediately if already ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeParallelLoading);
    } else {
        initializeParallelLoading();
    }
    
    // Export for global access
    window.ParallelLoader = {
        initializeParallelLoading,
        loadScriptsInParallel,
        utilityScripts,
        componentScripts
    };
    
    console.log('✅ Parallel loader initialized');
})();