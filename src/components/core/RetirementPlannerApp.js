// Advanced Retirement Planner - Guided Intelligence UI Design
// Created by Yali Pollak (יהלי פולק) - v7.5.1

function RetirementPlannerApp() {
    var languageState = React.useState('en');
    var language = languageState[0];
    var setLanguage = languageState[1];
    
    var viewModeState = React.useState('wizard'); // Start with wizard-first flow
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
        currentSavings: 0,
        inflationRate: 3,
        currentMonthlyExpenses: 12000,
        targetReplacement: 75,
        riskTolerance: 'moderate',
        currentTrainingFund: 0,
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
        // Partner 1 & 2 additional asset fields
        partner1RealEstate: 0,
        partner1Crypto: 0,
        partner2RealEstate: 0,
        partner2Crypto: 0,
        // Joint household expenses
        jointMonthlyExpenses: 0,
        jointRetirementExpenses: 0
    });
    var inputs = inputsState[0];
    var setInputs = inputsState[1];

    // Automatic state persistence to prevent data loss
    React.useEffect(function() {
        try {
            // Save inputs to localStorage whenever they change
            var dataToSave = {
                inputs: inputs,
                wizardCompleted: wizardCompleted,
                currentStep: currentStep,
                timestamp: Date.now()
            };
            
            // Use JSON.stringify with limited size to prevent storage issues
            var serializedData = JSON.stringify(dataToSave);
            if (serializedData.length < 1024 * 1024) { // Limit to 1MB
                localStorage.setItem('retirementWizardData', serializedData);
                console.log('\ud83d\udcbe Auto-saved inputs to localStorage:', Object.keys(inputs).length, 'fields');
            } else {
                console.warn('\ud83d\udcbe Data too large for localStorage, skipping save');
            }
        } catch (error) {
            console.warn('\ud83d\udcbe Failed to save to localStorage:', error.message);
        }
    }, [inputs, wizardCompleted, currentStep]);

    // Load saved data on app initialization
    React.useEffect(function() {
        try {
            var savedData = localStorage.getItem('retirementWizardData');
            if (savedData) {
                var parsedData = JSON.parse(savedData);
                if (parsedData.inputs && Object.keys(parsedData.inputs).length > 0) {
                    console.log('\ud83d\udcbe Loaded saved inputs from localStorage:', Object.keys(parsedData.inputs).length, 'fields');
                    setInputs(function(prev) { 
                        return { ...prev, ...parsedData.inputs }; 
                    });
                    
                    if (parsedData.wizardCompleted) {
                        setWizardCompleted(parsedData.wizardCompleted);
                    }
                    if (parsedData.currentStep && parsedData.currentStep > 1) {
                        setCurrentStep(parsedData.currentStep);
                    }
                }
            }
        } catch (error) {
            console.warn('\ud83d\udcbe Failed to load from localStorage:', error.message);
        }
    }, []); // Run only once on mount

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

    // Enhanced calculate function with full wizard data integration
    function handleCalculate() {
        try {
            // Check for meaningful data before calculating
            const hasMeaningfulData = inputs && (
                (inputs.currentAge && inputs.currentAge > 0) ||
                (inputs.currentSalary && inputs.currentSalary > 0) ||
                (inputs.currentMonthlySalary && inputs.currentMonthlySalary > 0) ||
                (inputs.currentSavings && inputs.currentSavings > 0)
            );
            
            if (!hasMeaningfulData) {
                console.log('No meaningful data for calculation - clearing results');
                setResults(null);
                return;
            }
            
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
                    
                    // Apply tax optimization from Step 9 if available
                    var optimizedPensionRate = inputs.optimizedPensionRate || inputs.pensionContributionRate || 17.5;
                    var optimizedTrainingRate = inputs.optimizedTrainingFundRate || inputs.trainingFundContributionRate || 7.5;
                    
                    // Calculate training fund contribution using Israeli threshold logic
                    var monthlyTrainingFundContribution = 0;
                    if (window.calculateTrainingFundRate && inputs.country === 'israel') {
                        var rateInfo = window.calculateTrainingFundRate(totalIncome, inputs.trainingFundContributeAboveCeiling);
                        if (typeof rateInfo === 'object') {
                            // Use the total rate from the rate info
                            monthlyTrainingFundContribution = Math.round(totalIncome * (rateInfo.total / 100));
                        } else {
                            // Fallback to simple rate calculation
                            monthlyTrainingFundContribution = Math.round(totalIncome * (rateInfo / 100));
                        }
                    } else {
                        // For non-Israeli countries, use simple percentage
                        monthlyTrainingFundContribution = Math.round(totalIncome * (optimizedTrainingRate / 100));
                    }
                    
                    updatedWorkPeriods[0] = {
                        ...updatedWorkPeriods[0],
                        salary: totalIncome,
                        monthlyContribution: Math.round(totalIncome * (optimizedPensionRate / 100)),
                        monthlyTrainingFund: monthlyTrainingFundContribution
                    };
                    
                    // Update work periods state
                    setWorkPeriods(updatedWorkPeriods);
                }
                
                // Calculate inheritance and estate data from Step 8
                var totalAssets = (inputs.realEstateAssets || 0) + 
                                 (inputs.investmentAssets || 0) + 
                                 (inputs.businessAssets || 0) + 
                                 (inputs.personalAssets || 0) + 
                                 (inputs.pensionAssets || 0);
                
                var totalDebts = (inputs.mortgageDebts || 0) + 
                                (inputs.loanDebts || 0) + 
                                (inputs.creditCardDebts || 0) + 
                                (inputs.businessDebts || 0);
                
                var netWorth = totalAssets - totalDebts;
                
                // Calculate Israeli National Insurance benefits if applicable
                var nationalInsuranceBenefits = 0;
                var nationalInsuranceMonthly = 0;
                
                if (inputs.country === 'israel' && window.IsraeliNationalInsurance) {
                    try {
                        var niCalculator = new window.IsraeliNationalInsurance();
                        var yearsContribution = (inputs.retirementAge || 67) - (inputs.currentAge || 30);
                        var avgSalary = updatedWorkPeriods[0]?.salary || inputs.currentMonthlySalary || 20000;
                        
                        var niBenefits = niCalculator.calculateOldAgePension(
                            yearsContribution,
                            avgSalary * 12, // Annual salary
                            inputs.gender || 'male'
                        );
                        
                        nationalInsuranceBenefits = niBenefits.totalPension || 0;
                        nationalInsuranceMonthly = niBenefits.monthlyPension || 0;
                        
                        console.log('National Insurance calculated:', niBenefits);
                    } catch (niError) {
                        console.warn('National Insurance calculation failed:', niError);
                    }
                }
                
                // Enhanced inputs with full wizard integration
                var updatedInputs = {
                    ...inputs,
                    currentSalary: updatedWorkPeriods[0]?.salary || inputs.currentMonthlySalary || 20000,
                    
                    // Inheritance and estate planning (Step 8)
                    totalAssets: totalAssets,
                    totalDebts: totalDebts,
                    netWorth: netWorth,
                    hasWill: inputs.willStatus === 'hasWill',
                    lifeInsuranceAmount: inputs.lifeInsuranceAmount || 0,
                    
                    // Tax optimization (Step 9)
                    taxCountry: inputs.taxCountry || inputs.country || 'israel',
                    currentTaxRate: inputs.currentTaxRate || 20,
                    marginalTaxRate: inputs.marginalTaxRate || 30,
                    effectiveTaxRate: inputs.effectiveTaxRate || 25,
                    optimizedPensionRate: optimizedPensionRate,
                    optimizedTrainingFundRate: optimizedTrainingRate,
                    taxEfficiencyScore: inputs.taxEfficiencyScore || 0,
                    
                    // National Insurance integration
                    nationalInsuranceBenefits: nationalInsuranceBenefits,
                    nationalInsuranceMonthly: nationalInsuranceMonthly,
                    
                    // Enhanced data from Review step (Step 10)
                    financialHealthScore: inputs.financialHealthScore || 0,
                    retirementReadiness: inputs.retirementReadiness || 'needs-improvement'
                };
                
                console.log('Calculate: Using enhanced inputs with full wizard integration:', updatedInputs);
                console.log('Calculate: Inheritance data - Assets:', totalAssets, 'Debts:', totalDebts, 'Net Worth:', netWorth);
                console.log('Calculate: Tax optimization - Pension:', optimizedPensionRate, '% Training Fund:', optimizedTrainingRate, '%');
                console.log('Calculate: National Insurance - Monthly:', nationalInsuranceMonthly);
                
                var result = window.calculateRetirement(
                    updatedInputs, 
                    updatedWorkPeriods, 
                    pensionIndexAllocation, 
                    trainingFundIndexAllocation,
                    historicalReturns,
                    updatedWorkPeriods[0]?.monthlyTrainingFund || 500,
                    partnerWorkPeriods
                );
                
                // Enhance result with integrated data
                if (result) {
                    result.inheritanceData = {
                        totalAssets: totalAssets,
                        totalDebts: totalDebts,
                        netWorth: netWorth,
                        hasWill: inputs.willStatus === 'hasWill'
                    };
                    result.taxOptimization = {
                        currentRate: inputs.currentTaxRate || 20,
                        optimizedPensionRate: optimizedPensionRate,
                        optimizedTrainingRate: optimizedTrainingRate,
                        efficiencyScore: inputs.taxEfficiencyScore || 0
                    };
                    result.nationalInsurance = {
                        monthlyBenefit: nationalInsuranceMonthly,
                        totalBenefit: nationalInsuranceBenefits
                    };
                }
                
                console.log('Calculate: Result received:', result);
                setResults(result);
            } else {
                console.warn('Calculate: Missing calculateRetirement function');
                // Create a basic result structure for demo
                var monthlyIncome = (inputs.currentMonthlySalary || inputs.currentSalary || 20000) * 0.8;
                setResults({
                    totalSavings: 0,
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
    
    // Automatic calculation when key inputs change
    React.useEffect(function() {
        // Only auto-calculate if wizard is completed or we have minimal required data
        if (wizardCompleted || (inputs.currentAge && inputs.retirementAge && inputs.currentSalary)) {
            // Debounce calculations to avoid excessive calls
            var timeoutId = setTimeout(function() {
                handleCalculate();
            }, 500); // 500ms delay
            
            return function() {
                clearTimeout(timeoutId);
            };
        }
    }, [
        inputs.currentAge, 
        inputs.retirementAge, 
        inputs.currentSalary,
        inputs.currentMonthlySalary,
        inputs.currentSavings,
        inputs.currentTrainingFundSavings,
        inputs.pensionContributionRate,
        inputs.trainingFundContributionRate,
        inputs.expectedReturn,
        inputs.managementFees,
        inputs.planningType,
        inputs.partner1Salary,
        inputs.partner2Salary,
        workingCurrency,
        wizardCompleted
    ]);
    
    // Wizard-first flow: redirect to wizard if trying to access dashboard without completion
    // DISABLED to allow "Return to Dashboard" functionality
    // React.useEffect(function() {
    //     if (!wizardCompleted && viewMode === 'dashboard') {
    //         setViewMode('wizard');
    //     }
    // }, [wizardCompleted, viewMode]);
    
    // Wizard completion handler
    function handleWizardComplete() {
        setWizardCompleted(true);
        setViewMode('dashboard');
        setTimeout(handleCalculate, 100);
    }

    // Handle section expansion from dashboard
    function handleSectionExpand(sectionId, isExpanded) {
        if (sectionId === 'openScenarios') {
            setViewMode('scenarios');
        } else if (sectionId === 'openGoals') {
            setViewMode('goals');
        } else if (sectionId === 'openOptimization') {
            setViewMode('optimization');
        } else if (sectionId === 'openInheritance') {
            setActiveSection('inheritance');
            setViewMode('detailed');
        } else if (sectionId === 'openTaxOptimization') {
            setActiveSection('taxOptimization');
            setViewMode('detailed');
        } else if (sectionId === 'openNationalInsurance') {
            setActiveSection('nationalInsurance');
            setViewMode('detailed');
        } else if (sectionId === 'openPartnerPlanning') {
            setActiveSection('partner');
            setViewMode('detailed');
        } else if (isExpanded) {
            // Map dashboard sections to activeSection values
            if (sectionId === 'investments') {
                setActiveSection('investments');
            } else if (sectionId === 'pension') {
                setActiveSection('pension');
            } else if (sectionId === 'partner') {
                setActiveSection('partner');
            } else if (sectionId === 'inheritance') {
                setActiveSection('inheritance');
            } else if (sectionId === 'taxOptimization') {
                setActiveSection('taxOptimization');
            } else if (sectionId === 'nationalInsurance') {
                setActiveSection('nationalInsurance');
            } else {
                setActiveSection(sectionId);
            }
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
                handleOptimize();
                break;
            case 'export':
                handleExport();
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

    // Handle portfolio optimization
    function handleOptimize() {
        try {
            if (!results) {
                alert(translations.optimizeRequiresCalculation || 'Please calculate your retirement plan first before optimizing.');
                return;
            }

            // Get current age and risk tolerance
            const currentAge = parseInt(inputs.currentAge) || 30;
            const riskTolerance = inputs.riskTolerance || 'moderate';
            const currentReturn = parseFloat(inputs.expectedReturn) || 7.0;
            
            // Risk-based asset allocation recommendations
            const riskProfiles = {
                conservative: { stocks: Math.max(20, 60 - currentAge), bonds: Math.min(80, 40 + currentAge), alternatives: 0 },
                moderate: { stocks: Math.max(30, 70 - currentAge), bonds: Math.min(70, 30 + currentAge), alternatives: 0 },
                aggressive: { stocks: Math.max(50, 90 - currentAge), bonds: Math.min(50, 10 + currentAge), alternatives: 0 }
            };
            
            const recommendedAllocation = riskProfiles[riskTolerance] || riskProfiles.moderate;
            
            // Generate optimization recommendations
            const optimizations = [];
            
            // Asset allocation optimization
            const currentStocks = parseFloat(inputs.stockPercentage) || 60;
            const currentBonds = parseFloat(inputs.bondPercentage) || 30;
            
            if (Math.abs(currentStocks - recommendedAllocation.stocks) > 10) {
                optimizations.push(`Consider adjusting your stock allocation from ${currentStocks}% to ${recommendedAllocation.stocks}% based on your age and risk tolerance.`);
            }
            
            // Fee optimization
            const contributionFees = parseFloat(inputs.contributionFees) || 1.0;
            const accumulationFees = parseFloat(inputs.accumulationFees) || 1.0;
            
            if (contributionFees > 0.5) {
                optimizations.push(`Your contribution fees (${contributionFees}%) are high. Consider switching to a provider with lower fees to save thousands over time.`);
            }
            
            if (accumulationFees > 0.75) {
                optimizations.push(`Your annual management fees (${accumulationFees}%) could be reduced. Lower fees can significantly impact long-term returns.`);
            }
            
            // Contribution rate optimization
            const pensionRate = parseFloat(inputs.pensionContributionRate) || 0;
            const country = inputs.taxCountry || 'israel';
            
            if (country === 'israel' && pensionRate < 7) {
                optimizations.push(`Consider increasing your pension contribution to 7% to maximize tax deductions in Israel.`);
            }
            
            // Show optimization results
            if (optimizations.length > 0) {
                const optimizationText = optimizations.join('\\n\\n');
                alert(`💡 Portfolio Optimization Recommendations:\\n\\n${optimizationText}\\n\\nWould you like to apply these changes automatically?`);
                
                // Auto-apply basic optimizations if user confirms
                if (confirm('Apply recommended asset allocation changes?')) {
                    setInputs(prev => ({
                        ...prev,
                        stockPercentage: recommendedAllocation.stocks,
                        bondPercentage: recommendedAllocation.bonds,
                        alternativePercentage: recommendedAllocation.alternatives
                    }));
                    
                    // Recalculate with new allocations
                    setTimeout(handleCalculate, 500);
                }
            } else {
                alert('✅ Your portfolio appears to be well-optimized for your age and risk tolerance!');
            }
            
        } catch (error) {
            console.error('Optimization error:', error);
            alert('Unable to generate optimization recommendations. Please try again.');
        }
    }

    // Handle export functionality
    // Enhanced export with multiple format options
    function handleExport() {
        // Show export format selection dialog
        const formats = [
            { id: 'pdf', name: language === 'he' ? 'PDF - דוח מקצועי' : 'PDF - Professional Report', icon: '📄' },
            { id: 'excel', name: language === 'he' ? 'Excel - גיליון אלקטרוני' : 'Excel - Spreadsheet', icon: '📊' },
            { id: 'json', name: language === 'he' ? 'JSON - נתונים גולמיים' : 'JSON - Raw Data', icon: '📝' },
            { id: 'csv', name: language === 'he' ? 'CSV - פורמט פשוט' : 'CSV - Simple Format', icon: '📋' },
            { id: 'all', name: language === 'he' ? 'כל הפורמטים' : 'All Formats', icon: '📦' }
        ];

        const formatSelector = React.createElement('div', {
            key: 'export-dialog',
            style: {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: '9999'
            }
        }, [
            React.createElement('div', {
                key: 'dialog-content',
                style: {
                    backgroundColor: 'white',
                    padding: '2rem',
                    borderRadius: '12px',
                    maxWidth: '500px',
                    width: '90%',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                }
            }, [
                React.createElement('h3', {
                    key: 'dialog-title',
                    style: { marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center' }
                }, language === 'he' ? 'בחר פורמט ייצוא' : 'Choose Export Format'),
                
                React.createElement('div', {
                    key: 'format-options',
                    style: { display: 'grid', gap: '0.5rem', marginBottom: '1rem' }
                }, formats.map(format => 
                    React.createElement('button', {
                        key: format.id,
                        onClick: () => {
                            document.body.removeChild(document.getElementById('export-dialog-overlay'));
                            performExport(format.id);
                        },
                        style: {
                            padding: '0.75rem',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            backgroundColor: '#f9fafb',
                            cursor: 'pointer',
                            textAlign: 'left',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'all 0.2s'
                        },
                        onMouseOver: (e) => {
                            e.target.style.backgroundColor = '#e5e7eb';
                            e.target.style.borderColor = '#3b82f6';
                        },
                        onMouseOut: (e) => {
                            e.target.style.backgroundColor = '#f9fafb';
                            e.target.style.borderColor = '#e5e7eb';
                        }
                    }, [
                        React.createElement('span', { 
                            key: 'icon', 
                            style: { marginRight: '0.5rem', fontSize: '1.25rem' } 
                        }, format.icon),
                        React.createElement('span', { key: 'text' }, format.name)
                    ])
                )),
                
                React.createElement('button', {
                    key: 'cancel-btn',
                    onClick: () => document.body.removeChild(document.getElementById('export-dialog-overlay')),
                    style: {
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        backgroundColor: '#f3f4f6',
                        cursor: 'pointer'
                    }
                }, language === 'he' ? 'ביטול' : 'Cancel')
            ])
        ]);

        const overlay = document.createElement('div');
        overlay.id = 'export-dialog-overlay';
        document.body.appendChild(overlay);
        ReactDOM.render(formatSelector, overlay);
    }

    function performExport(format) {
        try {
            if (!results) {
                alert(translations.exportRequiresCalculation || 'Please calculate your retirement plan first before exporting.');
                return;
            }

            const timestamp = new Date().toISOString().split('T')[0];
            const exportData = generateExportData();

            switch (format) {
                case 'pdf':
                    exportToPDF(exportData, timestamp);
                    break;
                case 'excel':
                    exportToExcel(exportData, timestamp);
                    break;
                case 'json':
                    exportToJSON(exportData, timestamp);
                    break;
                case 'csv':
                    exportToCSV(exportData, timestamp);
                    break;
                case 'all':
                    exportToJSON(exportData, timestamp);
                    exportToCSV(exportData, timestamp);
                    exportToExcel(exportData, timestamp);
                    setTimeout(() => exportToPDF(exportData, timestamp), 500);
                    break;
            }
            
        } catch (error) {
            console.error('Export error:', error);
            alert((language === 'he' ? 'שגיאה בייצוא הקובץ. אנא נסה שוב.' : 'Export error. Please try again.'));
        }
    }

    function generateExportData() {
        return {
            timestamp: new Date().toISOString(),
            version: window.APP_VERSION || '6.8.2',
            personalInfo: {
                currentAge: inputs.currentAge,
                retirementAge: inputs.retirementAge,
                planningType: inputs.planningType || 'single',
                country: inputs.taxCountry || inputs.country || 'israel'
            },
            financial: {
                currentSalary: inputs.currentMonthlySalary,
                currentSavings: inputs.totalCurrentSavings,
                pensionRate: inputs.pensionContributionRate,
                trainingFundRate: inputs.trainingFundContributionRate,
                expectedReturn: inputs.expectedReturn
            },
            inheritance: {
                totalAssets: inputs.totalAssets || 0,
                totalDebts: inputs.totalDebts || 0,
                netWorth: inputs.netWorth || 0,
                hasWill: inputs.hasWill || inputs.willStatus === 'hasWill',
                lifeInsurance: inputs.lifeInsuranceAmount || 0
            },
            taxOptimization: {
                currentTaxRate: inputs.currentTaxRate || 20,
                optimizedPensionRate: inputs.optimizedPensionRate || inputs.pensionContributionRate || 17.5,
                optimizedTrainingRate: inputs.optimizedTrainingFundRate || inputs.trainingFundContributionRate || 7.5,
                taxEfficiencyScore: inputs.taxEfficiencyScore || 0
            },
            nationalInsurance: {
                monthlyBenefit: results.nationalInsurance?.monthlyBenefit || 0,
                totalBenefit: results.nationalInsurance?.totalBenefit || 0
            },
            results: {
                totalAccumulation: results.totalAccumulation,
                monthlyIncome: results.monthlyIncome,
                inflationAdjusted: results.inflationAdjusted,
                readinessScore: results.readinessScore,
                financialHealthScore: inputs.financialHealthScore || 0
            },
            allocation: {
                stocks: inputs.stockPercentage,
                bonds: inputs.bondPercentage,
                alternatives: inputs.alternativePercentage
            }
        };
    }

    // Export to JSON format
    function exportToJSON(exportData, timestamp) {
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        downloadFile(dataBlob, `retirement-plan-${timestamp}.json`);
    }

    // Export to CSV format
    function exportToCSV(exportData, timestamp) {
        const csvData = [
            ['Field', 'Value'],
            ['Generated', new Date().toLocaleDateString()],
            ['Version', exportData.version],
            [''],
            ['Personal Information', ''],
            ['Current Age', exportData.personalInfo.currentAge],
            ['Retirement Age', exportData.personalInfo.retirementAge],
            ['Planning Type', exportData.personalInfo.planningType],
            ['Country', exportData.personalInfo.country],
            [''],
            ['Financial Information', ''],
            ['Monthly Salary', exportData.financial.currentSalary],
            ['Current Savings', exportData.financial.currentSavings],
            ['Pension Rate (%)', exportData.financial.pensionRate],
            ['Training Fund Rate (%)', exportData.financial.trainingFundRate],
            ['Expected Return (%)', exportData.financial.expectedReturn],
            [''],
            ['Estate Planning', ''],
            ['Total Assets', exportData.inheritance.totalAssets],
            ['Total Debts', exportData.inheritance.totalDebts],
            ['Net Worth', exportData.inheritance.netWorth],
            ['Has Will', exportData.inheritance.hasWill ? 'Yes' : 'No'],
            ['Life Insurance', exportData.inheritance.lifeInsurance],
            [''],
            ['Tax Optimization', ''],
            ['Current Tax Rate (%)', exportData.taxOptimization.currentTaxRate],
            ['Optimized Pension Rate (%)', exportData.taxOptimization.optimizedPensionRate],
            ['Optimized Training Rate (%)', exportData.taxOptimization.optimizedTrainingRate],
            ['Tax Efficiency Score', exportData.taxOptimization.taxEfficiencyScore],
            [''],
            ['National Insurance', ''],
            ['Monthly Benefit', exportData.nationalInsurance.monthlyBenefit],
            ['Total Benefit', exportData.nationalInsurance.totalBenefit],
            [''],
            ['Results', ''],
            ['Total Accumulation', exportData.results.totalAccumulation],
            ['Monthly Retirement Income', exportData.results.monthlyIncome],
            ['Inflation Adjusted', exportData.results.inflationAdjusted],
            ['Readiness Score', exportData.results.readinessScore],
            ['Financial Health Score', exportData.results.financialHealthScore],
            [''],
            ['Asset Allocation', ''],
            ['Stocks (%)', exportData.allocation.stocks],
            ['Bonds (%)', exportData.allocation.bonds],
            ['Alternatives (%)', exportData.allocation.alternatives]
        ];

        const csvContent = csvData.map(row => 
            row.map(cell => typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell).join(',')
        ).join('\\n');
        
        const csvBlob = new Blob([csvContent], { type: 'text/csv' });
        downloadFile(csvBlob, `retirement-plan-${timestamp}.csv`);
    }

    // Export to Excel format (using simplified XLSX structure)
    function exportToExcel(exportData, timestamp) {
        // Create a simple Excel-compatible XML structure
        const excelData = `<?xml version="1.0"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Worksheet ss:Name="Retirement Plan">
  <Table>
   <Row><Cell><Data ss:Type="String">Advanced Retirement Plan Report</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Generated: ${new Date().toLocaleDateString()}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Version: ${exportData.version}</Data></Cell></Row>
   <Row></Row>
   
   <Row><Cell><Data ss:Type="String">Personal Information</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Current Age</Data></Cell><Cell><Data ss:Type="Number">${exportData.personalInfo.currentAge}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Retirement Age</Data></Cell><Cell><Data ss:Type="Number">${exportData.personalInfo.retirementAge}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Planning Type</Data></Cell><Cell><Data ss:Type="String">${exportData.personalInfo.planningType}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Country</Data></Cell><Cell><Data ss:Type="String">${exportData.personalInfo.country}</Data></Cell></Row>
   <Row></Row>
   
   <Row><Cell><Data ss:Type="String">Financial Information</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Monthly Salary</Data></Cell><Cell><Data ss:Type="Number">${exportData.financial.currentSalary}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Current Savings</Data></Cell><Cell><Data ss:Type="Number">${exportData.financial.currentSavings}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Pension Rate (%)</Data></Cell><Cell><Data ss:Type="Number">${exportData.financial.pensionRate}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Training Fund Rate (%)</Data></Cell><Cell><Data ss:Type="Number">${exportData.financial.trainingFundRate}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Expected Return (%)</Data></Cell><Cell><Data ss:Type="Number">${exportData.financial.expectedReturn}</Data></Cell></Row>
   <Row></Row>
   
   <Row><Cell><Data ss:Type="String">Estate Planning</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Total Assets</Data></Cell><Cell><Data ss:Type="Number">${exportData.inheritance.totalAssets}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Total Debts</Data></Cell><Cell><Data ss:Type="Number">${exportData.inheritance.totalDebts}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Net Worth</Data></Cell><Cell><Data ss:Type="Number">${exportData.inheritance.netWorth}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Has Will</Data></Cell><Cell><Data ss:Type="String">${exportData.inheritance.hasWill ? 'Yes' : 'No'}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Life Insurance</Data></Cell><Cell><Data ss:Type="Number">${exportData.inheritance.lifeInsurance}</Data></Cell></Row>
   <Row></Row>
   
   <Row><Cell><Data ss:Type="String">Tax Optimization</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Current Tax Rate (%)</Data></Cell><Cell><Data ss:Type="Number">${exportData.taxOptimization.currentTaxRate}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Optimized Pension Rate (%)</Data></Cell><Cell><Data ss:Type="Number">${exportData.taxOptimization.optimizedPensionRate}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Optimized Training Rate (%)</Data></Cell><Cell><Data ss:Type="Number">${exportData.taxOptimization.optimizedTrainingRate}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Tax Efficiency Score</Data></Cell><Cell><Data ss:Type="Number">${exportData.taxOptimization.taxEfficiencyScore}</Data></Cell></Row>
   <Row></Row>
   
   <Row><Cell><Data ss:Type="String">National Insurance</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Monthly Benefit</Data></Cell><Cell><Data ss:Type="Number">${exportData.nationalInsurance.monthlyBenefit}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Total Benefit</Data></Cell><Cell><Data ss:Type="Number">${exportData.nationalInsurance.totalBenefit}</Data></Cell></Row>
   <Row></Row>
   
   <Row><Cell><Data ss:Type="String">Results</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Total Accumulation</Data></Cell><Cell><Data ss:Type="Number">${exportData.results.totalAccumulation}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Monthly Retirement Income</Data></Cell><Cell><Data ss:Type="Number">${exportData.results.monthlyIncome}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Inflation Adjusted</Data></Cell><Cell><Data ss:Type="Number">${exportData.results.inflationAdjusted}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Readiness Score</Data></Cell><Cell><Data ss:Type="Number">${exportData.results.readinessScore}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Financial Health Score</Data></Cell><Cell><Data ss:Type="Number">${exportData.results.financialHealthScore}</Data></Cell></Row>
   <Row></Row>
   
   <Row><Cell><Data ss:Type="String">Asset Allocation</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Stocks (%)</Data></Cell><Cell><Data ss:Type="Number">${exportData.allocation.stocks}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Bonds (%)</Data></Cell><Cell><Data ss:Type="Number">${exportData.allocation.bonds}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Alternatives (%)</Data></Cell><Cell><Data ss:Type="Number">${exportData.allocation.alternatives}</Data></Cell></Row>
  </Table>
 </Worksheet>
</Workbook>`;

        const excelBlob = new Blob([excelData], { type: 'application/vnd.ms-excel' });
        downloadFile(excelBlob, `retirement-plan-${timestamp}.xls`);
    }

    // Export to PDF format (using HTML to PDF conversion)
    function exportToPDF(exportData, timestamp) {
        // Create HTML content for PDF
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Retirement Plan Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin-bottom: 25px; page-break-inside: avoid; }
        .section-title { font-size: 18px; font-weight: bold; color: #2563eb; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 15px; }
        .data-row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #eee; }
        .data-label { font-weight: bold; }
        .highlight { background-color: #f0f9ff; padding: 10px; border-left: 4px solid #2563eb; margin: 10px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Advanced Retirement Plan Report</h1>
        <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        <p>Version ${exportData.version}</p>
    </div>

    <div class="section">
        <h2 class="section-title">Personal Information</h2>
        <div class="data-row"><span class="data-label">Current Age:</span><span>${exportData.personalInfo.currentAge} years</span></div>
        <div class="data-row"><span class="data-label">Target Retirement Age:</span><span>${exportData.personalInfo.retirementAge} years</span></div>
        <div class="data-row"><span class="data-label">Planning Type:</span><span>${exportData.personalInfo.planningType}</span></div>
        <div class="data-row"><span class="data-label">Country:</span><span>${exportData.personalInfo.country}</span></div>
    </div>

    <div class="section">
        <h2 class="section-title">Financial Overview</h2>
        <div class="data-row"><span class="data-label">Monthly Salary:</span><span>₪${exportData.financial.currentSalary?.toLocaleString() || 0}</span></div>
        <div class="data-row"><span class="data-label">Current Savings:</span><span>₪${exportData.financial.currentSavings?.toLocaleString() || 0}</span></div>
        <div class="data-row"><span class="data-label">Pension Contribution Rate:</span><span>${exportData.financial.pensionRate || 0}%</span></div>
        <div class="data-row"><span class="data-label">Training Fund Rate:</span><span>${exportData.financial.trainingFundRate || 0}%</span></div>
        <div class="data-row"><span class="data-label">Expected Annual Return:</span><span>${exportData.financial.expectedReturn || 0}%</span></div>
    </div>

    <div class="section">
        <h2 class="section-title">Estate Planning</h2>
        <div class="data-row"><span class="data-label">Total Assets:</span><span>₪${exportData.inheritance.totalAssets?.toLocaleString() || 0}</span></div>
        <div class="data-row"><span class="data-label">Total Debts:</span><span>₪${exportData.inheritance.totalDebts?.toLocaleString() || 0}</span></div>
        <div class="data-row"><span class="data-label">Net Worth:</span><span>₪${exportData.inheritance.netWorth?.toLocaleString() || 0}</span></div>
        <div class="data-row"><span class="data-label">Will Status:</span><span>${exportData.inheritance.hasWill ? 'Current will in place' : 'No current will'}</span></div>
        <div class="data-row"><span class="data-label">Life Insurance:</span><span>₪${exportData.inheritance.lifeInsurance?.toLocaleString() || 0}</span></div>
    </div>

    <div class="section">
        <h2 class="section-title">Tax Optimization</h2>
        <div class="data-row"><span class="data-label">Current Tax Rate:</span><span>${exportData.taxOptimization.currentTaxRate}%</span></div>
        <div class="data-row"><span class="data-label">Optimized Pension Rate:</span><span>${exportData.taxOptimization.optimizedPensionRate}%</span></div>
        <div class="data-row"><span class="data-label">Optimized Training Fund Rate:</span><span>${exportData.taxOptimization.optimizedTrainingRate}%</span></div>
        <div class="data-row"><span class="data-label">Tax Efficiency Score:</span><span>${exportData.taxOptimization.taxEfficiencyScore}/100</span></div>
    </div>

    <div class="section">
        <h2 class="section-title">National Insurance Benefits</h2>
        <div class="data-row"><span class="data-label">Projected Monthly Benefit:</span><span>₪${exportData.nationalInsurance.monthlyBenefit?.toLocaleString() || 0}</span></div>
        <div class="data-row"><span class="data-label">Total Projected Benefits:</span><span>₪${exportData.nationalInsurance.totalBenefit?.toLocaleString() || 0}</span></div>
    </div>

    <div class="highlight">
        <h2 class="section-title">Retirement Projection Results</h2>
        <div class="data-row"><span class="data-label">Total Accumulation at Retirement:</span><span>₪${exportData.results.totalAccumulation?.toLocaleString() || 0}</span></div>
        <div class="data-row"><span class="data-label">Monthly Retirement Income:</span><span>₪${exportData.results.monthlyIncome?.toLocaleString() || 0}</span></div>
        <div class="data-row"><span class="data-label">Inflation-Adjusted Value:</span><span>₪${exportData.results.inflationAdjusted?.toLocaleString() || 0}</span></div>
        <div class="data-row"><span class="data-label">Retirement Readiness Score:</span><span>${exportData.results.readinessScore || 0}/100</span></div>
        <div class="data-row"><span class="data-label">Financial Health Score:</span><span>${exportData.results.financialHealthScore || 0}/100</span></div>
    </div>

    <div class="section">
        <h2 class="section-title">Recommended Asset Allocation</h2>
        <div class="data-row"><span class="data-label">Stocks:</span><span>${exportData.allocation.stocks || 0}%</span></div>
        <div class="data-row"><span class="data-label">Bonds:</span><span>${exportData.allocation.bonds || 0}%</span></div>
        <div class="data-row"><span class="data-label">Alternative Investments:</span><span>${exportData.allocation.alternatives || 0}%</span></div>
    </div>

    <div class="footer">
        <p>This report was generated by the Advanced Retirement Planner v${exportData.version}</p>
        <p>For questions or updates, please consult with a financial advisor.</p>
        <p><em>Disclaimer: This is a projection based on assumptions and should not be considered as financial advice.</em></p>
    </div>
</body>
</html>`;

        // Convert HTML to PDF using browser's print functionality - secure method
        const printWindow = window.open('', '_blank');
        printWindow.document.open();
        
        // SECURITY: Use documentElement.innerHTML for secure content insertion
        printWindow.document.documentElement.innerHTML = htmlContent;
        printWindow.document.close();
        
        // Wait for content to load, then trigger print dialog
        setTimeout(() => {
            printWindow.print();
            
            // Provide alternative download for browsers that don't support print-to-PDF
            setTimeout(() => {
                const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
                downloadFile(htmlBlob, `retirement-plan-${timestamp}.html`);
                printWindow.close();
            }, 1000);
        }, 500);
    }

    // Helper function to download files
    function downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
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
            // View Mode Toggle - Show wizard tab always, others only after completion
            React.createElement('div', {
                key: 'view-toggle',
                className: 'professional-tabs mb-6'
            }, [
                // Dashboard tab - only show if wizard is completed
                wizardCompleted && React.createElement('button', {
                    key: 'dashboard',
                    onClick: function() { setViewMode('dashboard'); },
                    className: 'professional-tab' + (viewMode === 'dashboard' ? ' active' : '')
                }, [
                    React.createElement('span', { key: 'icon' }, '🏠'),
                    ' ',
                    language === 'en' ? 'Dashboard' : (t.dashboard || 'Dashboard')
                ]),
                wizardCompleted && React.createElement('button', {
                    key: 'detailed', 
                    onClick: function() { setViewMode('detailed'); },
                    className: 'professional-tab' + (viewMode === 'detailed' ? ' active' : '')
                }, [
                    React.createElement('span', { key: 'icon' }, '📊'),
                    ' ',
                    language === 'en' ? 'Detailed View' : (t.detailed || 'Detailed View')
                ]),
                // Wizard tab - always show, but restart wizard if clicked when completed
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
            viewMode === 'wizard' && window.RetirementWizard && React.createElement(window.RetirementWizard, {
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
            
            // Fallback for when wizard is loading
            viewMode === 'wizard' && !window.RetirementWizard && React.createElement('div', {
                key: 'wizard-loading',
                className: 'flex items-center justify-center min-h-96 bg-gray-50 rounded-lg'
            }, [
                React.createElement('div', {
                    key: 'loading-content',
                    className: 'text-center'
                }, [
                    React.createElement('div', {
                        key: 'spinner',
                        className: 'animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'
                    }),
                    React.createElement('p', {
                        key: 'loading-text',
                        className: 'text-gray-600'
                    }, language === 'en' ? 'Loading Planning Wizard...' : 'טוען אשף תכנון...')
                ])
            ]),

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
                        // Check for saved wizard progress
                        (() => {
                            const savedProgress = localStorage.getItem('retirementWizardProgress');
                            const hasSavedProgress = savedProgress && JSON.parse(savedProgress).currentStep > 1;
                            
                            if (hasSavedProgress) {
                                const progress = JSON.parse(savedProgress);
                                return React.createElement('div', {
                                    key: 'wizard-actions',
                                    className: 'space-y-2'
                                }, [
                                    React.createElement('button', {
                                        key: 'resume-wizard-btn',
                                        onClick: function() { 
                                            setViewMode('wizard'); 
                                            // Wizard will automatically load saved progress
                                        },
                                        className: 'w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center'
                                    }, [
                                        React.createElement('span', {
                                            key: 'resume-icon',
                                            className: 'mr-2'
                                        }, '▶️'),
                                        language === 'he' ? 
                                            `המשך משלב ${progress.currentStep} מתוך 10` : 
                                            `Resume from Step ${progress.currentStep} of 10`
                                    ]),
                                    React.createElement('button', {
                                        key: 'start-fresh-btn',
                                        onClick: function() { 
                                            if (window.confirm(language === 'he' ? 
                                                'האם אתה בטוח שברצונך להתחיל מחדש? ההתקדמות השמורה תימחק.' : 
                                                'Are you sure you want to start fresh? Your saved progress will be cleared.')) {
                                                localStorage.removeItem('retirementWizardProgress');
                                                localStorage.removeItem('retirementWizardInputs');
                                                setViewMode('wizard');
                                                setCurrentStep(1);
                                            }
                                        },
                                        className: 'w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center text-sm'
                                    }, [
                                        React.createElement('span', {
                                            key: 'fresh-icon',
                                            className: 'mr-2'
                                        }, '🔄'),
                                        language === 'he' ? 'התחל מחדש' : 'Start Fresh'
                                    ])
                                ]);
                            } else {
                                return React.createElement('button', {
                                    key: 'start-wizard-btn',
                                    onClick: function() { setViewMode('wizard'); setCurrentStep(1); },
                                    className: 'w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center'
                                }, [
                                    React.createElement('span', {
                                        key: 'start-icon',
                                        className: 'mr-2'
                                    }, '🚀'),
                                    language === 'he' ? 'התחל אשף תכנון' : 'Start Planning Wizard'
                                ]);
                            }
                        })()
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
                            ]),
                            React.createElement('button', {
                                key: 'scenarios-btn',
                                onClick: function() { setViewMode('scenarios'); },
                                className: 'w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium'
                            }, [
                                React.createElement('span', { key: 'icon' }, '🔄'),
                                ' ',
                                language === 'he' ? 'השוואת תרחישים' : 'Compare Scenarios'
                            ])
                        ])
                    ])
                ]),
                
                // Main Dashboard Content (right side)
                React.createElement('div', {
                    key: 'dashboard-content',
                    className: 'lg:col-span-3'
                }, !wizardCompleted ? [
                    // Pre-wizard dashboard: Show getting started message
                    React.createElement('div', {
                        key: 'getting-started',
                        className: 'bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center'
                    }, [
                        React.createElement('div', {
                            key: 'icon',
                            className: 'text-6xl mb-4'
                        }, '🧙‍♂️'),
                        React.createElement('h2', {
                            key: 'title',
                            className: 'text-2xl font-bold text-gray-800 mb-4'
                        }, language === 'he' ? 'ברוכים הבאים לתכנית הפרישה המתקדמת' : 'Welcome to Advanced Retirement Planner'),
                        React.createElement('p', {
                            key: 'description',
                            className: 'text-gray-600 mb-6 max-w-2xl mx-auto'
                        }, language === 'he' ? 
                            'השתמש באשף התכנון כדי ליצור תכנית פרישה מותאמת אישית. לחץ על "התחל תכנון" כדי להתחיל.' :
                            'Use the Planning Wizard to create a personalized retirement plan. Click "Start Planning" to begin.'
                        ),
                        React.createElement('button', {
                            key: 'start-wizard',
                            onClick: () => setViewMode('wizard'),
                            className: 'px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg'
                        }, [
                            React.createElement('span', { key: 'icon' }, '🚀'),
                            ' ',
                            language === 'he' ? 'התחל תכנון' : 'Start Planning'
                        ])
                    ])
                ] : [
                    // Dashboard Component
                    window.Dashboard && React.createElement(window.Dashboard, {
                        key: 'dashboard',
                        inputs: inputs,
                        results: results,
                        language: language,
                        workingCurrency: workingCurrency,
                        formatCurrency: window.formatCurrency,
                        onSectionExpand: handleSectionExpand,
                        setViewMode: setViewMode
                    })
                ])
            ]),

            // Scenario Comparison View
            viewMode === 'scenarios' && React.createElement('div', {
                key: 'scenarios-container',
                className: 'space-y-6'
            }, [
                // Back to Dashboard Button
                React.createElement('div', {
                    key: 'back-nav',
                    className: 'flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200'
                }, [
                    React.createElement('button', {
                        key: 'back-btn',
                        onClick: () => setViewMode('dashboard'),
                        className: 'flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'
                    }, [
                        React.createElement('span', { key: 'back-icon', className: 'mr-2' }, '← '),
                        language === 'he' ? 'חזרה ללוח הבקרה' : 'Back to Dashboard'
                    ]),
                    React.createElement('h2', {
                        key: 'view-title',
                        className: 'text-xl font-semibold text-gray-800'
                    }, language === 'he' ? 'השוואת תרחישים' : 'Scenario Comparison')
                ]),
                // Scenario Component with Fallback
                window.ScenarioComparison ? 
                    React.createElement(window.ScenarioComparison, {
                        key: 'scenario-comparison',
                        baseScenario: inputs,
                        language: language,
                        workingCurrency: workingCurrency,
                        onReturnToDashboard: () => setViewMode('dashboard'),
                        onScenarioUpdate: (scenarioId, newData) => {
                            console.log('Scenario updated:', scenarioId, newData);
                            // Handle scenario updates
                        }
                    }) :
                    React.createElement('div', {
                        key: 'scenario-fallback',
                        className: 'bg-white p-8 rounded-lg border border-gray-200 text-center'
                    }, [
                        React.createElement('div', { key: 'fallback-icon', className: 'text-6xl mb-4' }, '📊'),
                        React.createElement('h3', { 
                            key: 'fallback-title',
                            className: 'text-xl font-semibold text-gray-700 mb-2'
                        }, language === 'he' ? 'השוואת תרחישים' : 'Scenario Comparison'),
                        React.createElement('p', {
                            key: 'fallback-text',
                            className: 'text-gray-600'
                        }, language === 'he' ? 
                            'רכיב זה נטען... אנא רענן את הדף אם הבעיה נמשכת.' :
                            'This component is loading... Please refresh the page if the issue persists.')
                    ])
            ]),

            // Goal Tracking Dashboard View
            viewMode === 'goals' && React.createElement('div', {
                key: 'goals-container',
                className: 'space-y-6'
            }, [
                // Back to Dashboard Button
                React.createElement('div', {
                    key: 'back-nav',
                    className: 'flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200'
                }, [
                    React.createElement('button', {
                        key: 'back-btn',
                        onClick: () => setViewMode('dashboard'),
                        className: 'flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'
                    }, [
                        React.createElement('span', { key: 'back-icon', className: 'mr-2' }, '← '),
                        language === 'he' ? 'חזרה ללוח הבקרה' : 'Back to Dashboard'
                    ]),
                    React.createElement('h2', {
                        key: 'view-title',
                        className: 'text-xl font-semibold text-gray-800'
                    }, language === 'he' ? 'מעקב יעדים' : 'Goal Tracking')
                ]),
                // Goal Component with Fallback
                window.GoalTrackingDashboard ? 
                    React.createElement(window.GoalTrackingDashboard, {
                        key: 'goal-tracking',
                        inputs: inputs,
                        results: results,
                        language: language,
                        workingCurrency: workingCurrency,
                        onReturnToDashboard: () => setViewMode('dashboard'),
                        onGoalUpdate: (goal, action) => {
                            console.log('Goal updated:', goal, action);
                            // Handle goal updates - could save to localStorage or send to server
                            if (action === 'added' || action === 'updated') {
                                // Update inputs with goal-related data if needed
                                setInputs(prevInputs => ({
                                    ...prevInputs,
                                    // Add any goal-related fields that should be persisted
                                    lastGoalUpdate: new Date().toISOString()
                                }));
                            }
                        }
                    }) :
                    React.createElement('div', {
                        key: 'goals-fallback',
                        className: 'bg-white p-8 rounded-lg border border-gray-200 text-center'
                    }, [
                        React.createElement('div', { key: 'fallback-icon', className: 'text-6xl mb-4' }, '🎯'),
                        React.createElement('h3', { 
                            key: 'fallback-title',
                            className: 'text-xl font-semibold text-gray-700 mb-2'
                        }, language === 'he' ? 'מעקב יעדים' : 'Goal Tracking'),
                        React.createElement('p', {
                            key: 'fallback-text',
                            className: 'text-gray-600'
                        }, language === 'he' ? 
                            'רכיב זה נטען... אנא רענן את הדף אם הבעיה נמשכת.' :
                            'This component is loading... Please refresh the page if the issue persists.')
                    ])
            ]),

            // Portfolio Optimization View
            viewMode === 'optimization' && React.createElement('div', {
                key: 'optimization-container',
                className: 'space-y-6'
            }, [
                // Back to Dashboard Button
                React.createElement('div', {
                    key: 'back-nav',
                    className: 'flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200'
                }, [
                    React.createElement('button', {
                        key: 'back-btn',
                        onClick: () => setViewMode('dashboard'),
                        className: 'flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'
                    }, [
                        React.createElement('span', { key: 'back-icon', className: 'mr-2' }, '← '),
                        language === 'he' ? 'חזרה ללוח הבקרה' : 'Back to Dashboard'
                    ]),
                    React.createElement('h2', {
                        key: 'view-title',
                        className: 'text-xl font-semibold text-gray-800'
                    }, language === 'he' ? 'אופטימיזציה פרטפוליו' : 'Portfolio Optimization')
                ]),
                // Portfolio Component with Fallback
                window.PortfolioOptimizationPanel ? 
                    React.createElement(window.PortfolioOptimizationPanel, {
                        key: 'portfolio-optimization',
                        inputs: inputs,
                        language: language,
                        workingCurrency: workingCurrency,
                        onReturnToDashboard: () => setViewMode('dashboard'),
                        onRebalance: (rebalancingActions) => {
                            console.log('Rebalancing actions:', rebalancingActions);
                            // Handle rebalancing actions - could save to localStorage or trigger notifications
                            setInputs(prevInputs => ({
                                ...prevInputs,
                                lastRebalancing: new Date().toISOString(),
                                pendingRebalancing: rebalancingActions
                            }));
                        }
                    }) :
                    React.createElement('div', {
                        key: 'optimization-fallback',
                        className: 'bg-white p-8 rounded-lg border border-gray-200 text-center'
                    }, [
                        React.createElement('div', { key: 'fallback-icon', className: 'text-6xl mb-4' }, '⚙️'),
                        React.createElement('h3', { 
                            key: 'fallback-title',
                            className: 'text-xl font-semibold text-gray-700 mb-2'
                        }, language === 'he' ? 'אופטימיזציה פרטפוליו' : 'Portfolio Optimization'),
                        React.createElement('p', {
                            key: 'fallback-text',
                            className: 'text-gray-600'
                        }, language === 'he' ? 
                            'רכיב זה נטען... אנא רענן את הדף אם הבעיה נמשכת.' :
                            'This component is loading... Please refresh the page if the issue persists.')
                    ])
            ]),

            // Detailed View
            viewMode === 'detailed' && React.createElement('div', {
                key: 'detailed-view-container',
                className: 'space-y-6'
            }, [
                // Back to Dashboard Button
                React.createElement('div', {
                    key: 'detailed-back-nav',
                    className: 'flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200'
                }, [
                    React.createElement('button', {
                        key: 'detailed-back-btn',
                        onClick: () => setViewMode('dashboard'),
                        className: 'flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'
                    }, [
                        React.createElement('span', { key: 'back-icon', className: 'mr-2' }, '← '),
                        language === 'he' ? 'חזרה ללוח הבקרה' : 'Back to Dashboard'
                    ]),
                    React.createElement('h2', {
                        key: 'detailed-view-title',
                        className: 'text-xl font-semibold text-gray-800'
                    }, (() => {
                        const sectionTitles = {
                            pension: language === 'he' ? 'תכנון פנסיה' : 'Pension Planning',
                            investments: language === 'he' ? 'תיק השקעות' : 'Investment Portfolio',
                            partner: language === 'he' ? 'תכנון משותף' : 'Partner Planning',
                            inheritance: language === 'he' ? 'תכנון ירושה' : 'Inheritance Planning',
                            taxOptimization: language === 'he' ? 'אופטימיזציה מיסויית' : 'Tax Optimization',
                            nationalInsurance: language === 'he' ? 'ביטוח לאומי' : 'National Insurance'
                        };
                        return sectionTitles[activeSection] || (language === 'he' ? 'מצב מפורט' : 'Detailed View');
                    })())
                ]),
                // Main Content Grid
                React.createElement('div', {
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

                    // Partner Planning Section
                    activeSection === 'partner' && window.CoupleValidationPanel && React.createElement(window.CoupleValidationPanel, {
                        key: 'partner-form',
                        inputs,
                        setInputs,
                        language,
                        workingCurrency: workingCurrency
                    }),

                    // Inheritance Planning Section
                    activeSection === 'inheritance' && React.createElement('div', {
                        key: 'inheritance-form',
                        className: 'bg-white rounded-lg p-6 border border-gray-200'
                    }, [
                        React.createElement('h3', {
                            key: 'inheritance-title',
                            className: 'text-lg font-semibold mb-4 text-gray-800'
                        }, language === 'he' ? 'תכנון ירושה ועזבון' : 'Inheritance & Estate Planning'),
                        React.createElement('p', {
                            key: 'inheritance-desc',
                            className: 'text-gray-600 mb-4'
                        }, language === 'he' ? 
                            'תכנון מקיף לירושה ועזבון כולל צוואות, ביטוח חיים ואופטימיזציה מיסויית.' :
                            'Comprehensive inheritance and estate planning including wills, life insurance, and tax optimization.')
                    ]),

                    // Tax Optimization Section  
                    activeSection === 'taxOptimization' && window.TaxOptimizationPanel && React.createElement(window.TaxOptimizationPanel, {
                        key: 'tax-optimization-form',
                        inputs,
                        setInputs,
                        language,
                        workingCurrency: workingCurrency
                    }),

                    // National Insurance Section
                    activeSection === 'nationalInsurance' && React.createElement('div', {
                        key: 'national-insurance-form',
                        className: 'bg-white rounded-lg p-6 border border-gray-200'
                    }, [
                        React.createElement('h3', {
                            key: 'ni-title',
                            className: 'text-lg font-semibold mb-4 text-gray-800'
                        }, language === 'he' ? 'ביטוח לאומי' : 'National Insurance'),
                        React.createElement('p', {
                            key: 'ni-desc',
                            className: 'text-gray-600 mb-4'
                        }, language === 'he' ? 
                            'חישוב זכויות ביטוח לאומי לפי הרגולציות הישראליות העדכניות.' :
                            'Calculate National Insurance benefits according to current Israeli regulations.')
                    ]),
                    
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
                }, window.versionInfo ? `v${window.versionInfo.number}` : 'v7.5.1'),
                ' • Created by ',
                React.createElement('span', {
                    key: 'author',
                    className: 'author'
                }, 'Yali Pollak (יהלי פולק)'),
                ' • Professional Financial Planning Tool'
            ])
        ]),
        
        // Console Log Exporter (Debug Mode Only)
        window.ConsoleLogExporter && React.createElement(window.ConsoleLogExporter, {
            key: 'console-exporter',
            language: language
        })
    ]);
}

// Export to window for global access
window.RetirementPlannerApp = RetirementPlannerApp;