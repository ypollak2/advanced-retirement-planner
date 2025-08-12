// Event Handlers for Retirement Planner App
// Handles all user interactions and state updates

// Calculate retirement results
function handleCalculate(inputs, setResults, setChartData, setShowChart) {
    try {
        if (window.calculateRetirement) {
            // Call the main calculation function with all inputs
            const calculationInputs = {
                ...inputs,
                // Ensure numeric values
                currentAge: parseFloat(inputs.currentAge) || 30,
                retirementAge: parseFloat(inputs.retirementAge) || 67,
                currentSavings: parseFloat(inputs.currentSavings) || 0,
                currentTrainingFund: parseFloat(inputs.currentTrainingFund) || 0,
                currentPersonalPortfolio: parseFloat(inputs.currentPersonalPortfolio) || 0,
                currentCrypto: parseFloat(inputs.currentCrypto) || 0,
                currentRealEstate: parseFloat(inputs.currentRealEstate) || 0,
                currentSalary: parseFloat(inputs.currentSalary) || 0,
                currentMonthlyExpenses: parseFloat(inputs.currentMonthlyExpenses) || 12000
            };
            
            const result = window.calculateRetirement(calculationInputs);
            setResults(result);
            
            // Generate chart data
            if (window.generateChartData) {
                const data = window.generateChartData(result, inputs);
                setChartData(data);
                setShowChart(true);
            }
            
            // Scroll to results
            setTimeout(() => {
                const resultsElement = document.getElementById('results-section');
                if (resultsElement) {
                    resultsElement.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
            
            // Trigger recalculation event for other components
            if (window.dispatchEvent) {
                window.dispatchEvent(new CustomEvent('retirementCalculated', { 
                    detail: { inputs: calculationInputs, results: result } 
                }));
            }
            
            return result;
        }
    } catch (error) {
        console.error('Error calculating retirement:', error);
        alert('Error calculating retirement: ' + error.message);
        return null;
    }
}

// Handle wizard completion
function handleWizardComplete(inputs, setWizardCompleted, setViewMode, setResults, setChartData, setShowChart) {
    setWizardCompleted(true);
    setViewMode('dashboard');
    
    // Automatically calculate results
    handleCalculate(inputs, setResults, setChartData, setShowChart);
}

// Handle section expansion from dashboard
function handleSectionExpand(sectionId, isExpanded, setActiveSection, setViewMode) {
    if (isExpanded) {
        setActiveSection(sectionId);
        setViewMode('detail');
    } else {
        setActiveSection(null);
        setViewMode('dashboard');
    }
}

// Handle quick actions from sidebar
function handleQuickAction(action, state, setState) {
    const { 
        setShowSalaryInput, 
        setShowFamilyPlanning, 
        setShowStressTest,
        setActiveSection,
        setViewMode,
        inputs,
        setResults,
        setChartData,
        setShowChart
    } = state;
    
    switch(action) {
        case 'salary':
            setShowSalaryInput(true);
            break;
        case 'family':
            setShowFamilyPlanning(true);
            break;
        case 'stressTest':
            setShowStressTest(true);
            break;
        case 'calculate':
            handleCalculate(inputs, setResults, setChartData, setShowChart);
            break;
        default:
            console.warn('Unknown quick action:', action);
    }
}

// Handle input changes
function handleInputChange(field, value, inputs, setInputs) {
    setInputs(prev => ({
        ...prev,
        [field]: value
    }));
    
    // Save to localStorage
    if (window.RetirementPlannerInitialState) {
        const { saveToLocalStorage, STORAGE_KEYS } = window.RetirementPlannerInitialState;
        saveToLocalStorage(STORAGE_KEYS.INPUTS, {
            ...inputs,
            [field]: value
        });
    }
}

// Handle currency change with conversion
function handleCurrencyChange(newCurrency, workingCurrency, inputs, setInputs, setWorkingCurrency) {
    if (window.currencyAPI && window.currencyAPI.convertAmount) {
        // Convert relevant fields
        const fieldsToConvert = [
            'currentSavings', 'currentMonthlyExpenses', 'currentSalary',
            'currentTrainingFund', 'currentPersonalPortfolio', 'currentCrypto',
            'currentRealEstate', 'personalPortfolioMonthly', 'cryptoMonthly',
            'realEstateMonthly', 'fireMonthlyExpenses'
        ];
        
        const convertedInputs = { ...inputs };
        fieldsToConvert.forEach(field => {
            if (inputs[field]) {
                convertedInputs[field] = window.currencyAPI.convertAmount(
                    inputs[field], 
                    workingCurrency, 
                    newCurrency
                );
            }
        });
        
        setInputs(convertedInputs);
        setWorkingCurrency(newCurrency);
    }
}

// Handle portfolio optimization
function handleOptimize(inputs, setInputs, setResults, setChartData, setShowChart) {
    if (window.portfolioOptimizer) {
        const optimized = window.portfolioOptimizer.optimize({
            currentAge: inputs.currentAge,
            retirementAge: inputs.retirementAge,
            riskTolerance: inputs.riskTolerance,
            currentAllocation: {
                stocks: 60,
                bonds: 30,
                realEstate: 5,
                commodities: 5
            }
        });
        
        console.log('Optimized portfolio:', optimized);
        
        // Apply optimized allocation to inputs
        if (optimized.allocation) {
            const totalPortfolio = parseFloat(inputs.currentPersonalPortfolio) || 0;
            const newInputs = {
                ...inputs,
                portfolioStocks: (optimized.allocation.stocks / 100) * totalPortfolio,
                portfolioBonds: (optimized.allocation.bonds / 100) * totalPortfolio,
                portfolioRealEstate: (optimized.allocation.realEstate / 100) * totalPortfolio,
                portfolioCommodities: (optimized.allocation.commodities / 100) * totalPortfolio
            };
            
            setInputs(newInputs);
            
            // Recalculate with optimized portfolio
            setTimeout(() => {
                handleCalculate(newInputs, setResults, setChartData, setShowChart);
            }, 100);
        }
    }
}

// Handle export functionality
function handleExport(inputs, results, language) {
    if (window.exportForLLMAnalysis) {
        const dataToExport = {
            inputs: inputs,
            results: results,
            metadata: {
                version: '7.5.11',
                exportDate: new Date().toISOString(),
                language: language
            }
        };
        
        window.exportForLLMAnalysis(dataToExport);
    } else {
        console.error('Export functionality not available');
    }
}

// Handle stress test scenarios
function handleStressTest(scenario, inputs, setStressTestResults) {
    if (window.stressTestScenarios && window.calculateRetirement) {
        const scenarioData = window.stressTestScenarios[scenario];
        if (scenarioData) {
            const stressedInputs = {
                ...inputs,
                ...scenarioData.adjustments
            };
            
            const results = window.calculateRetirement(stressedInputs);
            setStressTestResults({
                scenario: scenario,
                results: results,
                impact: scenarioData.description
            });
        }
    }
}

// Export all handlers
window.RetirementPlannerHandlers = {
    handleCalculate,
    handleWizardComplete,
    handleSectionExpand,
    handleQuickAction,
    handleInputChange,
    handleCurrencyChange,
    handleOptimize,
    handleExport,
    handleStressTest
};

console.log('✅ Retirement Planner Event Handlers loaded');