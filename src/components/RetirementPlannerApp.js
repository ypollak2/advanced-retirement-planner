// Advanced Retirement Planner - Guided Intelligence UI Design
// Created by Yali Pollak (יהלי פולק) - v6.1.0

function RetirementPlannerApp() {
    var languageState = React.useState('en');
    var language = languageState[0];
    var setLanguage = languageState[1];
    
    var viewModeState = React.useState('dashboard');
    var viewMode = viewModeState[0];
    var setViewMode = viewModeState[1];
    
    var wizardCompletedState = React.useState(false);
    var wizardCompleted = wizardCompletedState[0];
    var setWizardCompleted = wizardCompletedState[1];
    
    var activeSectionState = React.useState(null);
    var activeSection = activeSectionState[0];
    var setActiveSection = activeSectionState[1];
    
    // Step navigation state for wizard
    var currentStepState = React.useState(1);
    var currentStep = currentStepState[0];
    var setCurrentStep = currentStepState[1];
    
    // Step navigation functions
    function nextStep() {
        setCurrentStep(function(prev) { return Math.min(prev + 1, 8); });
    }
    
    function previousStep() {
        setCurrentStep(function(prev) { return Math.max(prev - 1, 1); });
    }
    
    var workingCurrencyState = React.useState('ILS');
    var workingCurrency = workingCurrencyState[0];
    var setWorkingCurrency = workingCurrencyState[1];
    
    var sidebarCollapsedState = React.useState(false);
    var sidebarCollapsed = sidebarCollapsedState[0];
    var setSidebarCollapsed = sidebarCollapsedState[1];
    
    var resultsState = React.useState(null);
    var results = resultsState[0];
    var setResults = resultsState[1];
    
    var chartDataState = React.useState([]);
    var chartData = chartDataState[0];
    var setChartData = chartDataState[1];
    
    var showChartState = React.useState(false);
    var showChart = showChartState[0];
    var setShowChart = showChartState[1];
    
    var showSalaryInputState = React.useState(false);
    var showSalaryInput = showSalaryInputState[0];
    var setShowSalaryInput = showSalaryInputState[1];
    
    var showFamilyPlanningState = React.useState(false);
    var showFamilyPlanning = showFamilyPlanningState[0];
    var setShowFamilyPlanning = showFamilyPlanningState[1];
    
    var familyPlanningEnabledState = React.useState(false);
    var familyPlanningEnabled = familyPlanningEnabledState[0];
    var setFamilyPlanningEnabled = familyPlanningEnabledState[1];
    
    var childrenState = React.useState([]);
    var children = childrenState[0];
    var setChildren = childrenState[1];
    
    var stressTestResultsState = React.useState(null);
    var stressTestResults = stressTestResultsState[0];
    var setStressTestResults = stressTestResultsState[1];
    
    var showStressTestState = React.useState(false);
    var showStressTest = showStressTestState[0];
    var setShowStressTest = showStressTestState[1];
    
    var selectedScenarioState = React.useState(null);
    var selectedScenario = selectedScenarioState[0];
    var setSelectedScenario = selectedScenarioState[1];
    
    var selectedTimeHorizonState = React.useState(20);
    var selectedTimeHorizon = selectedTimeHorizonState[0];
    var setSelectedTimeHorizon = selectedTimeHorizonState[1];
    
    var historicalReturnsState = React.useState({});
    var historicalReturns = historicalReturnsState[0];
    var setHistoricalReturns = historicalReturnsState[1];
    
    var exchangeRatesLoadingState = React.useState(false);
    var exchangeRatesLoading = exchangeRatesLoadingState[0];
    var setExchangeRatesLoading = exchangeRatesLoadingState[1];
    
    var exchangeRatesLastUpdatedState = React.useState(null);
    var exchangeRatesLastUpdated = exchangeRatesLastUpdatedState[0];
    var setExchangeRatesLastUpdated = exchangeRatesLastUpdatedState[1];
    
    var cryptoPricesState = React.useState({
        bitcoin: 50000,
        ethereum: 3000,
        binancecoin: 300
    });
    var cryptoPrices = cryptoPricesState[0];
    var setCryptoPrices = cryptoPricesState[1];
    
    var cryptoPricesLoadingState = React.useState(false);
    var cryptoPricesLoading = cryptoPricesLoadingState[0];
    var setCryptoPricesLoading = cryptoPricesLoadingState[1];
    
    var cryptoPricesLastUpdatedState = React.useState(null);
    var cryptoPricesLastUpdated = cryptoPricesLastUpdatedState[0];
    var setCryptoPricesLastUpdated = cryptoPricesLastUpdatedState[1];
    
    var indexDataLoadingState = React.useState(false);
    var indexDataLoading = indexDataLoadingState[0];
    var setIndexDataLoading = indexDataLoadingState[1];
    
    var lastUpdatedState = React.useState(null);
    var lastUpdated = lastUpdatedState[0];
    var setLastUpdated = lastUpdatedState[1];

    // Initial state with all investment types
    var inputsState = React.useState({
        currentAge: 30,
        retirementAge: 67,
        currentSavings: 50000,
        inflationRate: 3,
        currentMonthlyExpenses: 12000,
        targetReplacement: 75,
        riskTolerance: 'moderate',
        currentTrainingFund: 25000,
        trainingFundReturn: 6.5,
        trainingFundManagementFee: 0.5,
        // Personal investment portfolio (no tax benefits)
        currentPersonalPortfolio: 0,
        personalPortfolioMonthly: 0,
        personalPortfolioReturn: 8.0,
        personalPortfolioTaxRate: 25,
        // Cryptocurrency portfolio
        currentCrypto: 0,
        cryptoMonthly: 0,
        cryptoReturn: 15.0,
        cryptoTaxRate: 25,
        // FIRE calculation
        fireTargetAge: 50,
        fireMonthlyExpenses: 15000,
        fireSafeWithdrawlRate: 4.0,
        // Real Estate Investment
        currentRealEstate: 0,
        realEstateMonthly: 0,
        realEstateReturn: 6.0,
        realEstateRentalYield: 4.0,
        realEstateTaxRate: 10,
        // Salary and family planning
        currentSalary: 20000,
        salaryGrowthRate: 3.5,
        familyPlanningCosts: 0,
        // Partner planning
        partnerPlanningEnabled: false,
        partnerCurrentAge: 30,
        partnerRetirementAge: 67,
        partnerCurrentSavings: 0,
        partnerCurrentSalary: 0,
        partnerSalaryGrowthRate: 3.5,
        partnerCurrentTrainingFund: 0,
        partnerTrainingFundReturn: 6.5,
        partnerTrainingFundManagementFee: 0.5,
        partnerCurrentPersonalPortfolio: 0,
        partnerPersonalPortfolioMonthly: 0,
        partnerPersonalPortfolioReturn: 8.0,
        partnerPersonalPortfolioTaxRate: 25,
        // Joint household expenses
        jointMonthlyExpenses: 0,
        jointRetirementExpenses: 0
    });
    var inputs = inputsState[0];
    var setInputs = inputsState[1];

    var workPeriodsState = React.useState([
        {
            id: 1,
            country: 'israel',
            startAge: 30,
            endAge: 67,
            monthlyContribution: 2000,
            salary: 15000,
            pensionReturn: 7.0,
            pensionDepositFee: 0.5,
            pensionAnnualFee: 1.0,
            monthlyTrainingFund: 500
        }
    ]);
    var workPeriods = workPeriodsState[0];
    var setWorkPeriods = workPeriodsState[1];

    var partnerWorkPeriodsState = React.useState([
        {
            id: 1,
            country: 'israel',
            startAge: 30,
            endAge: 67,
            monthlyContribution: 1500,
            salary: 12000,
            pensionReturn: 7.0,
            pensionDepositFee: 0.5,
            pensionAnnualFee: 1.0,
            monthlyTrainingFund: 400
        }
    ]);
    var partnerWorkPeriods = partnerWorkPeriodsState[0];
    var setPartnerWorkPeriods = partnerWorkPeriodsState[1];

    var pensionIndexAllocationState = React.useState([
        { index: 'S&P 500', percentage: 60, customReturn: null },
        { index: 'Government Bonds', percentage: 40, customReturn: null }
    ]);
    var pensionIndexAllocation = pensionIndexAllocationState[0];
    var setPensionIndexAllocation = pensionIndexAllocationState[1];

    var trainingFundIndexAllocationState = React.useState([
        { index: 'Tel Aviv 35', percentage: 100, customReturn: null }
    ]);
    var trainingFundIndexAllocation = trainingFundIndexAllocationState[0];
    var setTrainingFundIndexAllocation = trainingFundIndexAllocationState[1];

    // Translation support with proper fallbacks
    function getTranslations() {
        // Force English when language is 'en', regardless of window.multiLanguage
        if (language === 'en') {
            return {
                title: 'Advanced Retirement Planner',
                subtitle: 'Professional Pension Planning Tool with Investment Tracking',
                dashboard: 'Dashboard',
                detailed: 'Detailed View',
                calculate: 'Calculate'
            };
        }
        
        // For Hebrew, try window.multiLanguage first, then fallback
        if (window.multiLanguage && window.multiLanguage[language]) {
            return window.multiLanguage[language];
        }
        
        // Hebrew fallback
        return {
            title: 'מחשבון פנסיה מתקדם',
            subtitle: 'כלי מקצועי לתכנון פנסיה עם מעקב השקעות מקיף',
            dashboard: 'לוח הבקרה',
            detailed: 'מצב מפורט',
            calculate: 'חשב'
        };
    }
    
    var t = getTranslations();
    
    // Currency symbol helper
    function getCurrencySymbol(currency) {
        var symbols = {
            'ILS': '₪',
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'BTC': '₿',
            'ETH': 'Ξ'
        };
        return symbols[currency] || '₪';
    }
    
    // Currency Value Component for async conversion
    function CurrencyValue(props) {
        var value = props.value;
        var currency = props.currency;
        var formatter = props.formatter;
        
        var displayValueState = React.useState('Loading...');
        var displayValue = displayValueState[0];
        var setDisplayValue = displayValueState[1];
        
        React.useEffect(function() {
            var formatValue = function() {
                try {
                    var symbols = {
                        'ILS': '₪',
                        'USD': '$',
                        'EUR': '€',
                        'GBP': '£',
                        'BTC': '₿',
                        'ETH': 'Ξ'
                    };
                    
                    var currencySymbol = symbols[currency] || '₪';
                    
                    if (!value || isNaN(value)) {
                        setDisplayValue(currencySymbol + '0');
                        return;
                    }
                    
                    // Convert from ILS to target currency
                    var convertedValue = value;
                    
                    if (currency !== 'ILS') {
                        // Fallback conversion rates (used if API fails or unavailable)
                        var fallbackRates = {
                            'USD': 0.27,
                            'EUR': 0.25, 
                            'GBP': 0.22,
                            'BTC': 0.0000067,
                            'ETH': 0.0001
                        };
                        
                        if (window.currencyAPI) {
                        console.log('CurrencyValue: Converting', value, 'from ILS to', currency);
                        window.currencyAPI.convertAmount(value, 'ILS', currency).then(function(converted) {
                            console.log('CurrencyValue: Conversion successful:', converted, currency);
                            if (currency === 'BTC' || currency === 'ETH') {
                                setDisplayValue(currencySymbol + converted.toFixed(6));
                            } else {
                                setDisplayValue(currencySymbol + Math.round(converted).toLocaleString());
                            }
                        }).catch(function(error) {
                            console.warn('Currency conversion failed, using fallback rates for', currency, ':', error);
                            var rate = fallbackRates[currency];
                            convertedValue = rate ? value * rate : value;
                            console.log('CurrencyValue: Using fallback rate', rate, 'converted value:', convertedValue);
                            
                            if (currency === 'BTC' || currency === 'ETH') {
                                setDisplayValue(currencySymbol + convertedValue.toFixed(6));
                            } else {
                                setDisplayValue(currencySymbol + Math.round(convertedValue).toLocaleString());
                            }
                        });
                        } else {
                            // No API available, use fallback rates immediately
                            console.log('CurrencyValue: No API available, using fallback rates for', currency);
                            var rate = fallbackRates[currency];
                            convertedValue = rate ? value * rate : value;
                            console.log('CurrencyValue: Using fallback rate', rate, 'converted value:', convertedValue);
                            
                            if (currency === 'BTC' || currency === 'ETH') {
                                setDisplayValue(currencySymbol + convertedValue.toFixed(6));
                            } else {
                                setDisplayValue(currencySymbol + Math.round(convertedValue).toLocaleString());
                            }
                        }
                    } else {
                        // ILS or no conversion needed
                        if (currency === 'BTC' || currency === 'ETH') {
                            setDisplayValue(currencySymbol + convertedValue.toFixed(6));
                        } else {
                            setDisplayValue(currencySymbol + Math.round(convertedValue).toLocaleString());
                        }
                    }
                } catch (error) {
                    console.error('CurrencyValue formatting error:', error);
                    setDisplayValue('Error');
                }
            };
            
            formatValue();
        }, [value, currency]);
        
        return displayValue;
    }

    // Calculate function with error handling and wizard data sync
    function handleCalculate() {
        try {
            if (window.calculateRetirement) {
                // Sync wizard data with workPeriods
                var updatedWorkPeriods = [...workPeriods];
                
                if (updatedWorkPeriods.length > 0) {
                    // Update the work period with wizard-collected salary data
                    var mainSalary = inputs.currentMonthlySalary || inputs.currentSalary || 20000;
                    var totalIncome = mainSalary;
                    
                    // Add partner salaries if couple planning
                    if (inputs.planningType === 'couple') {
                        totalIncome += (inputs.partner1Salary || 0) + (inputs.partner2Salary || 0);
                    }
                    
                    // Add additional income sources
                    totalIncome += (inputs.freelanceIncome || 0) + 
                                  (inputs.rentalIncome || 0) + 
                                  (inputs.dividendIncome || 0) + 
                                  ((inputs.annualBonus || 0) / 12) + // Convert annual to monthly
                                  ((inputs.quarterlyRSU || 0) / 3) + // Convert quarterly to monthly
                                  (inputs.otherIncome || 0);
                    
                    updatedWorkPeriods[0] = {
                        ...updatedWorkPeriods[0],
                        salary: totalIncome,
                        monthlyContribution: Math.round(totalIncome * 0.175), // Default 17.5% pension contribution
                        monthlyTrainingFund: Math.round(totalIncome * 0.075) // Default 7.5% training fund
                    };
                    
                    // Update work periods state
                    setWorkPeriods(updatedWorkPeriods);
                }
                
                // Update inputs with calculated total income for the calculation
                var updatedInputs = {
                    ...inputs,
                    currentSalary: updatedWorkPeriods[0]?.salary || inputs.currentMonthlySalary || 20000
                };
                
                console.log('Calculate: Using updated inputs:', updatedInputs);
                console.log('Calculate: Using updated work periods:', updatedWorkPeriods);
                
                var result = window.calculateRetirement(
                    updatedInputs, 
                    updatedWorkPeriods, 
                    pensionIndexAllocation, 
                    trainingFundIndexAllocation,
                    historicalReturns,
                    updatedWorkPeriods[0]?.monthlyTrainingFund || 500,
                    partnerWorkPeriods
                );
                
                console.log('Calculate: Result received:', result);
                setResults(result);
            } else {
                console.warn('Calculate: Missing calculateRetirement function');
                // Create a basic result structure for demo
                var monthlyIncome = (inputs.currentMonthlySalary || inputs.currentSalary || 20000) * 0.8;
                setResults({
                    totalSavings: (inputs.currentSavings || 0) * 2,
                    monthlyIncome: Math.round(monthlyIncome),
                    currentAge: inputs.currentAge || 30,
                    retirementAge: inputs.retirementAge || 67
                });
            }
        } catch (error) {
            console.error('Calculate error:', error);
            setResults({
                totalSavings: 0,
                monthlyIncome: 0,
                error: error.message
            });
        }
    }
    
    // Wizard completion handler
    function handleWizardComplete() {
        setWizardCompleted(true);
        setViewMode('dashboard');
        setTimeout(handleCalculate, 100);
    }

    // Handle section expansion from dashboard
    function handleSectionExpand(sectionId, isExpanded) {
        if (isExpanded) {
            setActiveSection(sectionId);
            setViewMode('detailed');
        }
    }

    // Handle quick actions from sidebar
    function handleQuickAction(action) {
        switch(action) {
            case 'calculate':
                handleCalculate();
                break;
            case 'optimize':
                // TODO: Implement optimization logic
                console.log('Optimization feature coming soon');
                break;
            case 'export':
                // TODO: Implement export logic
                console.log('Export feature coming soon');
                break;
            default:
                console.log('Unknown action:', action);
        }
    }

    // Handle input changes from sidebar
    function handleInputChange(field, value) {
        setInputs(function(prev) {
            var newInputs = {};
            for (var key in prev) {
                newInputs[key] = prev[key];
            }
            newInputs[field] = value;
            return newInputs;
        });
    }
    
    // Handle currency change with conversion
    function handleCurrencyChange(newCurrency) {
        if (newCurrency === workingCurrency) return;
        
        setWorkingCurrency(newCurrency);
        
        // Force recalculation with new currency
        if (results) {
            setTimeout(handleCalculate, 100);
        }
    }

    return React.createElement('div', {
        className: 'min-h-screen',
        dir: language === 'he' ? 'rtl' : 'ltr'
    }, [
        // Simplified Professional Header
        React.createElement('header', {
            key: 'header',
            className: 'professional-header-simple'
        }, [
            React.createElement('div', {
                key: 'header-content',
                className: 'max-w-7xl mx-auto px-4 py-6 flex justify-between items-center'
            }, [
                // Title section
                React.createElement('div', {
                    key: 'title-section'
                }, [
                    React.createElement('h1', {
                        key: 'title',
                        className: 'text-2xl font-bold text-white'
                    }, t.title),
                    React.createElement('p', {
                        key: 'subtitle',
                        className: 'text-blue-100 text-sm'
                    }, t.subtitle)
                ]),
                
                // Simple controls
                React.createElement('div', {
                    key: 'header-controls',
                    className: 'flex items-center gap-4'
                }, [
                    React.createElement('button', {
                        key: 'language-toggle',
                        onClick: function() { setLanguage(language === 'he' ? 'en' : 'he'); },
                        className: 'px-3 py-1 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors'
                    }, language === 'he' ? 'English' : 'עברית')
                ])
            ])
        ]),

        // Main Container with Integrated Control Panel
        React.createElement('div', {
            key: 'container',
            className: 'max-w-7xl mx-auto px-4 py-8'
        }, [
            // View Mode Toggle
            wizardCompleted && React.createElement('div', {
                key: 'view-toggle',
                className: 'professional-tabs mb-6'
            }, [
                React.createElement('button', {
                    key: 'dashboard',
                    onClick: function() { setViewMode('dashboard'); },
                    className: 'professional-tab' + (viewMode === 'dashboard' ? ' active' : '')
                }, [
                    React.createElement('span', { key: 'icon' }, '🏠'),
                    ' ',
                    language === 'en' ? 'Dashboard' : (t.dashboard || 'Dashboard')
                ]),
                React.createElement('button', {
                    key: 'detailed', 
                    onClick: function() { setViewMode('detailed'); },
                    className: 'professional-tab' + (viewMode === 'detailed' ? ' active' : '')
                }, [
                    React.createElement('span', { key: 'icon' }, '📊'),
                    ' ',
                    language === 'en' ? 'Detailed View' : (t.detailed || 'Detailed View')
                ]),
                React.createElement('button', {
                    key: 'wizard', 
                    onClick: function() { setViewMode('wizard'); setWizardCompleted(false); setCurrentStep(1); },
                    className: 'professional-tab' + (viewMode === 'wizard' ? ' active' : '')
                }, [
                    React.createElement('span', { key: 'icon' }, '🧙‍♂️'),
                    ' ',
                    language === 'en' ? 'Planning Wizard' : 'אשף תכנון'
                ])
            ]),
            
            // Wizard View with lazy-loaded components
            // Includes: WizardStepSalary, WizardStepSavings, WizardStepContributions, WizardStepFees
            viewMode === 'wizard' && React.createElement(window.LazyWizard, {
                key: 'wizard',
                inputs: inputs,
                setInputs: setInputs,
                onComplete: handleWizardComplete,
                onReturnToDashboard: () => setViewMode('dashboard'),
                language: language,
                workingCurrency: workingCurrency,
                // Wizard step integration: WizardStepSalary, WizardStepSavings, WizardStepContributions, WizardStepFees
                WizardStepSalary: window.WizardStepSalary,
                WizardStepSavings: window.WizardStepSavings,
                WizardStepContributions: window.WizardStepContributions,
                WizardStepFees: window.WizardStepFees,
                // Step navigation integration
                currentStep: currentStep,
                nextStep: nextStep,
                previousStep: previousStep,
                setCurrentStep: setCurrentStep
            }),

            // Dashboard View with Integrated Control Panel
            viewMode === 'dashboard' && React.createElement('div', {
                key: 'dashboard-view',
                className: 'grid grid-cols-1 lg:grid-cols-4 gap-6'
            }, [
                // Integrated Control Panel (left side)
                React.createElement('div', {
                    key: 'control-panel',
                    className: 'lg:col-span-1 space-y-6'
                }, [
                    // Wizard Description Card  
                    React.createElement('div', {
                        key: 'wizard-description',
                        className: 'bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm border border-blue-200'
                    }, [
                        React.createElement('h3', {
                            key: 'wizard-title',
                            className: 'text-lg font-semibold text-blue-800 mb-3 flex items-center'
                        }, [
                            React.createElement('span', {
                                key: 'wizard-icon',
                                className: 'mr-2 text-xl'
                            }, '🧙‍♂️'),
                            language === 'he' ? 'אשף תכנון פרישה' : 'Retirement Planning Wizard'
                        ]),
                        React.createElement('p', {
                            key: 'wizard-description-text',
                            className: 'text-blue-700 mb-4 text-sm leading-relaxed'
                        }, language === 'he' ? 
                            'האשף שלנו יאסוף את כל המידע הדרוש לחישוב מקיף של תכנית הפרישה שלך. תוכל לבחור בין תכנון אישי או זוגי, להזין פרטי משכורת וחיסכונות, ולקבל תחזית מפורטת לפרישה.' :
                            'Our wizard will collect all the information needed for a comprehensive retirement plan calculation. Choose between individual or couple planning, enter salary and savings details, and get a detailed retirement projection.'
                        ),
                        React.createElement('div', {
                            key: 'wizard-benefits',
                            className: 'space-y-2 mb-4'
                        }, [
                            React.createElement('div', {
                                key: 'benefit-1',
                                className: 'flex items-center text-sm text-blue-600'
                            }, [
                                React.createElement('span', {
                                    key: 'check-1',
                                    className: 'mr-2 text-green-500'
                                }, '✓'),
                                language === 'he' ? 'תכנון אישי או זוגי' : 'Individual or couple planning'
                            ]),
                            React.createElement('div', {
                                key: 'benefit-2',
                                className: 'flex items-center text-sm text-blue-600'
                            }, [
                                React.createElement('span', {
                                    key: 'check-2',
                                    className: 'mr-2 text-green-500'
                                }, '✓'),
                                language === 'he' ? 'חישוב פנסיה וקרנות השתלמות' : 'Pension and training fund calculations'
                            ]),
                            React.createElement('div', {
                                key: 'benefit-3',
                                className: 'flex items-center text-sm text-blue-600'
                            }, [
                                React.createElement('span', {
                                    key: 'check-3',
                                    className: 'mr-2 text-green-500'
                                }, '✓'),
                                language === 'he' ? 'תחזית תשואות וניתוח סיכונים' : 'Return projections and risk analysis'
                            ])
                        ]),
                        React.createElement('button', {
                            key: 'start-wizard-btn',
                            onClick: function() { setViewMode('wizard'); setCurrentStep(1); },
                            className: 'w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center'
                        }, [
                            React.createElement('span', {
                                key: 'start-icon',
                                className: 'mr-2'
                            }, '🚀'),
                            language === 'he' ? 'התחל אשף תכנון' : 'Start Planning Wizard'
                        ])
                    ]),
                    
                    // Currency Selector Card
                    React.createElement('div', {
                        key: 'currency-selector',
                        className: 'bg-white rounded-xl p-6 shadow-sm border border-gray-200'
                    }, [
                        React.createElement('h3', {
                            key: 'currency-title',
                            className: 'text-lg font-semibold text-gray-800 mb-4'
                        }, language === 'he' ? 'מטבע תצוגה' : 'Display Currency'),
                        window.CurrencySelector && React.createElement(window.CurrencySelector, {
                            key: 'currency-selector-component',
                            selectedCurrency: workingCurrency,
                            onCurrencyChange: handleCurrencyChange,
                            language: language,
                            compact: true,
                            showRates: false
                        })
                    ]),
                    
                    // Quick Actions Card
                    React.createElement('div', {
                        key: 'quick-actions',
                        className: 'bg-white rounded-xl p-6 shadow-sm border border-gray-200'
                    }, [
                        React.createElement('h3', {
                            key: 'actions-title',
                            className: 'text-lg font-semibold text-gray-800 mb-4'
                        }, language === 'he' ? 'פעולות מהירות' : 'Quick Actions'),
                        React.createElement('div', {
                            key: 'actions-buttons',
                            className: 'space-y-3'
                        }, [
                            React.createElement('button', {
                                key: 'calculate-btn',
                                onClick: handleCalculate,
                                className: 'w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
                            }, [
                                React.createElement('span', { key: 'icon' }, '🚀'),
                                ' ',
                                language === 'he' ? 'חשב תכנית' : 'Calculate Plan'
                            ]),
                            React.createElement('button', {
                                key: 'detailed-btn',
                                onClick: function() { setViewMode('detailed'); },
                                className: 'w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium'
                            }, [
                                React.createElement('span', { key: 'icon' }, '📊'),
                                ' ',
                                language === 'he' ? 'מצב מפורט' : 'Detailed View'
                            ])
                        ])
                    ])
                ]),
                
                // Main Dashboard Content (right side)
                React.createElement('div', {
                    key: 'dashboard-content',
                    className: 'lg:col-span-3'
                }, [
                    // Dashboard Component
                    window.Dashboard && React.createElement(window.Dashboard, {
                        key: 'dashboard',
                        inputs: inputs,
                        results: results,
                        language: language,
                        workingCurrency: workingCurrency,
                        formatCurrency: window.formatCurrency,
                        onSectionExpand: handleSectionExpand
                    })
                ])
            ]),

            // Detailed View
            viewMode === 'detailed' && React.createElement('div', {
                key: 'detailed-view',
                className: 'professional-grid professional-grid-2'
            }, [
                // Forms Column
                React.createElement('div', {
                    key: 'forms',
                    className: 'space-y-6'
                }, [
                    // Section-specific forms based on activeSection
                    activeSection === 'pension' && window.BasicInputs && React.createElement(window.BasicInputs, {
                        key: 'pension-form',
                        inputs,
                        setInputs,
                        language,
                        t,
                        workingCurrency: workingCurrency,
                        Calculator: function() { return React.createElement('span', {}, '📊'); },
                        PiggyBank: function() { return React.createElement('span', {}, '🏛️'); },
                        DollarSign: function() { return React.createElement('span', {}, '💰'); }
                    }),
                    
                    activeSection === 'investments' && window.AdvancedInputs && React.createElement(window.AdvancedInputs, {
                        key: 'investments-form',
                        inputs,
                        setInputs,
                        language,
                        t,
                        workingCurrency: workingCurrency,
                        Settings: function() { return React.createElement('span', {}, '⚙️'); },
                        PiggyBank: function() { return React.createElement('span', {}, '🏛️'); },
                        DollarSign: function() { return React.createElement('span', {}, '💰'); },
                        TrendingUp: function() { return React.createElement('span', {}, '📈'); },
                        Building: function() { return React.createElement('span', {}, '🏢'); },
                        Globe: function() { return React.createElement('span', {}, '🌍'); },
                        Plus: function() { return React.createElement('span', {}, '➕'); },
                        Trash2: function() { return React.createElement('span', {}, '🗑️'); }
                    }),
                    
                    // Default to basic form if no specific section
                    !activeSection && window.BasicInputs && React.createElement(window.BasicInputs, {
                        key: 'default-form',
                        inputs,
                        setInputs,
                        language,
                        t,
                        workingCurrency: workingCurrency,
                        Calculator: function() { return React.createElement('span', {}, '📊'); },
                        PiggyBank: function() { return React.createElement('span', {}, '🏛️'); },
                        DollarSign: function() { return React.createElement('span', {}, '💰'); }
                    }),
                    
                    // Calculate Button
                    React.createElement('div', {
                        key: 'calculate-button',
                        className: 'text-center'
                    }, React.createElement('button', {
                        onClick: handleCalculate,
                        className: 'btn-professional btn-primary'
                    }, language === 'en' ? 'Calculate' : (t.calculate || 'Calculate')))
                ]),

                // Results Column
                React.createElement('div', {
                    key: 'results',
                    className: 'space-y-6'
                }, [
                    // Claude AI Recommendations - Prominent Position
                    results && window.ClaudeRecommendations && React.createElement('div', {
                        key: 'prominent-claude-wrapper',
                        className: 'bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-1 border-2 border-indigo-200 shadow-md'
                    }, [
                        React.createElement(window.ClaudeRecommendations, {
                            key: 'prominent-claude-recommendations',
                            inputs: inputs,
                            results: results,
                            partnerResults: null,
                            language: language,
                            workingCurrency: workingCurrency
                        })
                    ]),
                    
                    // Main Results Panel
                    results && window.ResultsPanel && React.createElement(window.ResultsPanel, {
                        key: 'main-results',
                        results,
                        inputs: inputs,
                        workPeriods: workPeriods || [],
                        language,
                        t,
                        workingCurrency: workingCurrency,
                        formatCurrency: window.formatCurrency,
                        convertCurrency: window.convertCurrency,
                        generateChartData: window.generateChartData,
                        showChart: false,
                        chartData: [],
                        claudeInsights: null,
                        exportRetirementSummary: function() {},
                        exportAsImage: function() {},
                        PiggyBank: function() { return React.createElement('span', {}, '🏛️'); },
                        Calculator: function() { return React.createElement('span', {}, '📊'); },
                        DollarSign: function() { return React.createElement('span', {}, '💰'); },
                        Target: function() { return React.createElement('span', {}, '🎯'); },
                        AlertCircle: function() { return React.createElement('span', {}, '⚠️'); },
                        TrendingUp: function() { return React.createElement('span', {}, '📈'); },
                        SimpleChart: window.SimpleChart,
                        ReadinessScore: window.ReadinessScore
                    }),
                    
                    // Inflation Analysis
                    results && window.InflationAnalysis && React.createElement(window.InflationAnalysis, {
                        key: 'inflation-analysis',
                        inputs: inputs,
                        results: results,
                        language: language,
                        workingCurrency: workingCurrency
                    })
                ])
            ])
        ]),

        // Bottom Attribution
        React.createElement('footer', {
            key: 'footer',
            className: 'bottom-attribution'
        }, [
            React.createElement('p', {
                key: 'attribution'
            }, [
                'Advanced Retirement Planner ',
                React.createElement('span', {
                    key: 'version',
                    className: 'version'
                }, window.versionInfo ? `v${window.versionInfo.number}` : 'v6.0.0'),
                ' • Created by ',
                React.createElement('span', {
                    key: 'author',
                    className: 'author'
                }, 'Yali Pollak (יהלי פולק)'),
                ' • Professional Financial Planning Tool'
            ])
        ])
    ]);
}

// Export to window for global access
window.RetirementPlannerApp = RetirementPlannerApp;