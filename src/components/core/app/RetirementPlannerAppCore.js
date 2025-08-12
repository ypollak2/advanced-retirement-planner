// Retirement Planner App Core Component
// Main application component that orchestrates all functionality

function RetirementPlannerApp() {
    // Get dependencies
    const { 
        DEFAULT_SETTINGS, 
        DEFAULT_CRYPTO_PRICES,
        loadInitialState,
        saveToLocalStorage,
        STORAGE_KEYS
    } = window.RetirementPlannerInitialState || {};
    
    const {
        handleCalculate,
        handleWizardComplete,
        handleSectionExpand,
        handleQuickAction,
        handleInputChange,
        handleCurrencyChange,
        handleOptimize,
        handleExport
    } = window.RetirementPlannerHandlers || {};
    
    const {
        AppHeader,
        AppSidebar,
        LoadingSpinner,
        ErrorMessage
    } = window.RetirementPlannerUIComponents || {};
    
    // Initialize state from saved data
    const initialData = loadInitialState ? loadInitialState() : { inputs: {}, wizardCompleted: false, currentStep: 1 };
    
    // Core state
    const [language, setLanguage] = React.useState(DEFAULT_SETTINGS?.language || 'en');
    const [viewMode, setViewMode] = React.useState(DEFAULT_SETTINGS?.viewMode || 'wizard');
    const [wizardCompleted, setWizardCompleted] = React.useState(initialData.wizardCompleted);
    const [activeSection, setActiveSection] = React.useState(null);
    const [currentStep, setCurrentStep] = React.useState(initialData.currentStep);
    const [workingCurrency, setWorkingCurrency] = React.useState(DEFAULT_SETTINGS?.workingCurrency || 'ILS');
    const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
    
    // Data state
    const [inputs, setInputs] = React.useState(initialData.inputs);
    const [results, setResults] = React.useState(null);
    const [chartData, setChartData] = React.useState([]);
    const [showChart, setShowChart] = React.useState(false);
    
    // UI state
    const [showSalaryInput, setShowSalaryInput] = React.useState(false);
    const [showFamilyPlanning, setShowFamilyPlanning] = React.useState(false);
    const [familyPlanningEnabled, setFamilyPlanningEnabled] = React.useState(false);
    const [children, setChildren] = React.useState([]);
    const [showStressTest, setShowStressTest] = React.useState(false);
    const [stressTestResults, setStressTestResults] = React.useState(null);
    
    // Market data state
    const [cryptoPrices, setCryptoPrices] = React.useState(DEFAULT_CRYPTO_PRICES || {});
    const [cryptoPricesLoading, setCryptoPricesLoading] = React.useState(false);
    const [exchangeRatesLoading, setExchangeRatesLoading] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    
    // Step navigation functions
    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 8));
    const previousStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
    
    // Auto-save state
    React.useEffect(() => {
        if (saveToLocalStorage) {
            const dataToSave = {
                inputs,
                wizardCompleted,
                currentStep,
                timestamp: Date.now()
            };
            saveToLocalStorage(STORAGE_KEYS.WIZARD_DATA, dataToSave);
        }
    }, [inputs, wizardCompleted, currentStep]);
    
    // Load saved data on mount
    React.useEffect(() => {
        const loadSavedData = async () => {
            try {
                setLoading(true);
                
                // Load exchange rates
                if (window.currencyAPI?.fetchExchangeRates) {
                    setExchangeRatesLoading(true);
                    await window.currencyAPI.fetchExchangeRates();
                    setExchangeRatesLoading(false);
                }
                
                // Load crypto prices
                if (window.CryptoPriceAPI?.fetchPrices) {
                    setCryptoPricesLoading(true);
                    const prices = await window.CryptoPriceAPI.fetchPrices();
                    if (prices) setCryptoPrices(prices);
                    setCryptoPricesLoading(false);
                }
                
                setLoading(false);
            } catch (err) {
                console.error('Error loading data:', err);
                setError(err.message);
                setLoading(false);
            }
        };
        
        loadSavedData();
    }, []);
    
    // Handle calculation
    const calculate = () => {
        if (handleCalculate) {
            handleCalculate(inputs, setResults, setChartData, setShowChart);
        }
    };
    
    // Handle wizard completion
    const completeWizard = () => {
        if (handleWizardComplete) {
            handleWizardComplete(inputs, setWizardCompleted, setViewMode, setResults, setChartData, setShowChart);
        }
    };
    
    // Handle quick actions
    const quickAction = (action) => {
        if (handleQuickAction) {
            handleQuickAction(action, {
                setShowSalaryInput,
                setShowFamilyPlanning,
                setShowStressTest,
                setActiveSection,
                setViewMode,
                inputs,
                setResults,
                setChartData,
                setShowChart
            });
        }
    };
    
    // Handle input changes
    const updateInput = (field, value) => {
        if (handleInputChange) {
            handleInputChange(field, value, inputs, setInputs);
        }
    };
    
    // Handle currency change
    const changeCurrency = (newCurrency) => {
        if (handleCurrencyChange) {
            handleCurrencyChange(newCurrency, workingCurrency, inputs, setInputs, setWorkingCurrency);
        }
    };
    
    // Loading state
    if (loading) {
        return React.createElement('div', {
            className: 'min-h-screen flex items-center justify-center bg-gray-100'
        }, React.createElement(LoadingSpinner, { message: 'Loading application...' }));
    }
    
    // Error state
    if (error) {
        return React.createElement('div', {
            className: 'min-h-screen flex items-center justify-center bg-gray-100 p-4'
        }, React.createElement(ErrorMessage, { 
            error: error,
            onRetry: () => window.location.reload()
        }));
    }
    
    // Main render
    return React.createElement('div', {
        className: 'min-h-screen bg-gray-100 flex flex-col'
    }, [
        // Header
        AppHeader && React.createElement(AppHeader, {
            key: 'header',
            language,
            setLanguage
        }),
        
        // Main content area
        React.createElement('div', {
            key: 'main',
            className: 'flex flex-1'
        }, [
            // Sidebar
            AppSidebar && React.createElement(AppSidebar, {
                key: 'sidebar',
                sidebarCollapsed,
                setSidebarCollapsed,
                language,
                viewMode,
                activeSection,
                onQuickAction: quickAction
            }),
            
            // Content area
            React.createElement('main', {
                key: 'content',
                className: 'flex-1 p-6 overflow-auto'
            }, [
                // Render based on view mode
                viewMode === 'wizard' && window.RetirementWizard && 
                    React.createElement(window.RetirementWizard, {
                        key: 'wizard',
                        inputs,
                        setInputs: updateInput,
                        onComplete: completeWizard,
                        onReturnToDashboard: () => setViewMode('dashboard'),
                        language,
                        workingCurrency
                    }),
                    
                viewMode === 'dashboard' && window.Dashboard &&
                    React.createElement(window.Dashboard, {
                        key: 'dashboard',
                        inputs,
                        results,
                        language,
                        workingCurrency,
                        onSectionExpand: (id, expanded) => 
                            handleSectionExpand(id, expanded, setActiveSection, setViewMode),
                        onCalculate: calculate
                    }),
                    
                viewMode === 'detail' && activeSection && window.DetailView &&
                    React.createElement(window.DetailView, {
                        key: 'detail',
                        section: activeSection,
                        inputs,
                        setInputs: updateInput,
                        language,
                        workingCurrency,
                        onBack: () => setViewMode('dashboard')
                    })
            ])
        ]),
        
        // Modals
        showSalaryInput && window.SalaryInputModal &&
            React.createElement(window.SalaryInputModal, {
                key: 'salary-modal',
                inputs,
                setInputs: updateInput,
                onClose: () => setShowSalaryInput(false),
                language,
                workingCurrency
            }),
            
        showFamilyPlanning && window.FamilyPlanningModal &&
            React.createElement(window.FamilyPlanningModal, {
                key: 'family-modal',
                children,
                setChildren,
                familyPlanningEnabled,
                setFamilyPlanningEnabled,
                onClose: () => setShowFamilyPlanning(false),
                language
            }),
            
        showStressTest && window.StressTestModal &&
            React.createElement(window.StressTestModal, {
                key: 'stress-modal',
                inputs,
                results: stressTestResults,
                onClose: () => setShowStressTest(false),
                language
            })
    ]);
}

// Export to window
window.RetirementPlannerApp = RetirementPlannerApp;

console.log('✅ Retirement Planner App Core loaded');