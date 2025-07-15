// Advanced Retirement Planner - Guided Intelligence UI Design
// Created by Yali Pollak (יהלי פולק) - v5.3.2

function RetirementPlannerApp() {
    const [language, setLanguage] = React.useState('en');
    const [viewMode, setViewMode] = React.useState('dashboard'); // 'dashboard' or 'detailed'
    const [activeSection, setActiveSection] = React.useState(null);
    const [workingCurrency, setWorkingCurrency] = React.useState('ILS'); // User's working currency
    const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
    const [results, setResults] = React.useState(null);
    const [chartData, setChartData] = React.useState([]);
    const [showChart, setShowChart] = React.useState(false);
    const [showSalaryInput, setShowSalaryInput] = React.useState(false);
    const [showFamilyPlanning, setShowFamilyPlanning] = React.useState(false);
    const [familyPlanningEnabled, setFamilyPlanningEnabled] = React.useState(false);
    const [children, setChildren] = React.useState([]);
    const [stressTestResults, setStressTestResults] = React.useState(null);
    const [showStressTest, setShowStressTest] = React.useState(false);
    const [selectedScenario, setSelectedScenario] = React.useState(null);
    const [selectedTimeHorizon, setSelectedTimeHorizon] = React.useState(20);
    const [historicalReturns, setHistoricalReturns] = React.useState({});
    const [exchangeRatesLoading, setExchangeRatesLoading] = React.useState(false);
    const [exchangeRatesLastUpdated, setExchangeRatesLastUpdated] = React.useState(null);
    const [cryptoPrices, setCryptoPrices] = React.useState({
        bitcoin: 50000,
        ethereum: 3000,
        binancecoin: 300
    });
    const [cryptoPricesLoading, setCryptoPricesLoading] = React.useState(false);
    const [cryptoPricesLastUpdated, setCryptoPricesLastUpdated] = React.useState(null);
    const [indexDataLoading, setIndexDataLoading] = React.useState(false);
    const [lastUpdated, setLastUpdated] = React.useState(null);

    // Initial state with all investment types
    const [inputs, setInputs] = React.useState({
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

    const [workPeriods, setWorkPeriods] = React.useState([
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

    const [partnerWorkPeriods, setPartnerWorkPeriods] = React.useState([
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

    const [pensionIndexAllocation, setPensionIndexAllocation] = React.useState([
        { index: 'S&P 500', percentage: 60, customReturn: null },
        { index: 'Government Bonds', percentage: 40, customReturn: null }
    ]);

    const [trainingFundIndexAllocation, setTrainingFundIndexAllocation] = React.useState([
        { index: 'Tel Aviv 35', percentage: 100, customReturn: null }
    ]);

    // Translation support with proper fallbacks
    const getTranslations = () => {
        if (window.multiLanguage && window.multiLanguage[language]) {
            return window.multiLanguage[language];
        }
        
        // Fallback translations based on language
        if (language === 'en') {
            return {
                title: 'Advanced Retirement Planner',
                subtitle: 'Professional Pension Planning Tool with Investment Tracking',
                dashboard: 'Dashboard',
                detailed: 'Detailed View',
                calculate: 'Calculate'
            };
        } else {
            return {
                title: 'מחשבון פנסיה מתקדם',
                subtitle: 'כלי מקצועי לתכנון פנסיה עם מעקב השקעות מקיף',
                dashboard: 'לוח הבקרה',
                detailed: 'מצב מפורט',
                calculate: 'חשב'
            };
        }
    };
    
    const t = getTranslations();

    // Calculate function with error handling
    const handleCalculate = () => {
        try {
            if (window.calculateRetirement && workPeriods && workPeriods.length > 0) {
                const result = window.calculateRetirement(inputs, workPeriods, [], []);
                setResults(result);
            } else {
                console.warn('Calculate: Missing calculateRetirement function or work periods');
                // Create a basic result structure for demo
                setResults({
                    totalSavings: (inputs.currentSavings || 0) * 2,
                    monthlyIncome: (inputs.currentMonthlyExpenses || 10000) * 0.8,
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
    };

    // Handle section expansion from dashboard
    const handleSectionExpand = (sectionId, isExpanded) => {
        if (isExpanded) {
            setActiveSection(sectionId);
            setViewMode('detailed');
        }
    };

    // Handle quick actions from sidebar
    const handleQuickAction = (action) => {
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
    };

    // Handle input changes from sidebar
    const handleInputChange = (field, value) => {
        setInputs(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return React.createElement('div', {
        className: 'min-h-screen',
        dir: language === 'he' ? 'rtl' : 'ltr'
    }, [
        // Permanent Side Panel
        window.PermanentSidePanel && React.createElement(window.PermanentSidePanel, {
            key: 'permanent-sidebar',
            inputs: inputs,
            results: results,
            workingCurrency: workingCurrency,
            language: language,
            formatCurrency: window.formatCurrency,
            onInputChange: handleInputChange,
            onQuickAction: handleQuickAction
        }),
        // Enhanced Professional Header
        React.createElement('header', {
            key: 'header',
            className: 'professional-header-enhanced'
        }, [
            // Header content wrapper
            React.createElement('div', {
                key: 'header-content',
                className: 'header-content-wrapper'
            }, [
                // Left side - Title and subtitle
                React.createElement('div', {
                    key: 'title-section',
                    className: 'header-title-section'
                }, [
                    React.createElement('h1', {
                        key: 'title',
                        className: 'header-title animate-fade-in-up'
                    }, t.title),
                    React.createElement('p', {
                        key: 'subtitle',
                        className: 'header-subtitle animate-fade-in-up'
                    }, t.subtitle)
                ]),
                
                // Right side - Language toggle and version
                React.createElement('div', {
                    key: 'header-controls',
                    className: 'header-controls'
                }, [
                    React.createElement('div', {
                        key: 'version-display',
                        className: 'header-version'
                    }, 'v5.3.2'),
                    
                    // Currency selector
                    React.createElement('select', {
                        key: 'currency-selector',
                        value: workingCurrency,
                        onChange: (e) => setWorkingCurrency(e.target.value),
                        className: 'currency-selector'
                    }, [
                        React.createElement('option', { key: 'ils', value: 'ILS' }, '₪ ILS'),
                        React.createElement('option', { key: 'usd', value: 'USD' }, '$ USD'),
                        React.createElement('option', { key: 'eur', value: 'EUR' }, '€ EUR'),
                        React.createElement('option', { key: 'gbp', value: 'GBP' }, '£ GBP'),
                        React.createElement('option', { key: 'btc', value: 'BTC' }, '₿ BTC')
                    ]),
                    
                    React.createElement('button', {
                        key: 'language-toggle',
                        onClick: () => setLanguage(language === 'he' ? 'en' : 'he'),
                        className: 'language-toggle-btn'
                    }, [
                        React.createElement('span', {
                            key: 'flag',
                            className: 'language-flag'
                        }, language === 'he' ? '🇺🇸' : '🇮🇱'),
                        React.createElement('span', {
                            key: 'text',
                            className: 'language-text'
                        }, language === 'he' ? 'English' : 'עברית')
                    ])
                ])
            ])
        ]),

        // Main Container with Dashboard-Centric Design
        React.createElement('div', {
            key: 'container',
            className: `main-content-with-sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${language === 'he' ? 'rtl' : ''} max-w-7xl mx-auto px-4 py-8`
        }, [
            // View Mode Toggle
            React.createElement('div', {
                key: 'view-toggle',
                className: 'professional-tabs mb-6'
            }, [
                React.createElement('button', {
                    key: 'dashboard',
                    onClick: () => setViewMode('dashboard'),
                    className: `professional-tab ${viewMode === 'dashboard' ? 'active' : ''}`
                }, [
                    React.createElement('span', { key: 'icon' }, '🏠'),
                    ' ',
                    t.dashboard || 'לוח הבקרה'
                ]),
                React.createElement('button', {
                    key: 'detailed', 
                    onClick: () => setViewMode('detailed'),
                    className: `professional-tab ${viewMode === 'detailed' ? 'active' : ''}`
                }, [
                    React.createElement('span', { key: 'icon' }, '📊'),
                    ' ',
                    t.detailed || 'מצב מפורט'
                ])
            ]),

            // Dashboard View
            viewMode === 'dashboard' && React.createElement('div', {
                key: 'dashboard-view'
            }, [
                // Dashboard Component
                window.Dashboard && React.createElement(window.Dashboard, {
                    key: 'dashboard',
                    inputs: inputs,
                    results: results,
                    language: language,
                    formatCurrency: window.formatCurrency,
                    onSectionExpand: handleSectionExpand
                }),
                
                // Quick Calculate Button for Dashboard
                !results && React.createElement('div', {
                    key: 'quick-calculate',
                    className: 'text-center mt-8'
                }, React.createElement('button', {
                    onClick: handleCalculate,
                    className: 'btn-professional btn-primary btn-large'
                }, [
                    React.createElement('span', { key: 'icon' }, '🚀'),
                    ' ',
                    t.calculate || 'חשב את התכנית שלי'
                ]))
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
                        Calculator: () => React.createElement('span', {}, '📊'),
                        PiggyBank: () => React.createElement('span', {}, '🏛️'),
                        DollarSign: () => React.createElement('span', {}, '💰')
                    }),
                    
                    activeSection === 'investments' && window.AdvancedInputs && React.createElement(window.AdvancedInputs, {
                        key: 'investments-form',
                        inputs,
                        setInputs,
                        language,
                        t,
                        Settings: () => React.createElement('span', {}, '⚙️'),
                        PiggyBank: () => React.createElement('span', {}, '🏛️'),
                        DollarSign: () => React.createElement('span', {}, '💰'),
                        TrendingUp: () => React.createElement('span', {}, '📈'),
                        Building: () => React.createElement('span', {}, '🏢'),
                        Globe: () => React.createElement('span', {}, '🌍'),
                        Plus: () => React.createElement('span', {}, '➕'),
                        Trash2: () => React.createElement('span', {}, '🗑️')
                    }),
                    
                    // Default to basic form if no specific section
                    !activeSection && window.BasicInputs && React.createElement(window.BasicInputs, {
                        key: 'default-form',
                        inputs,
                        setInputs,
                        language,
                        t,
                        Calculator: () => React.createElement('span', {}, '📊'),
                        PiggyBank: () => React.createElement('span', {}, '🏛️'),
                        DollarSign: () => React.createElement('span', {}, '💰')
                    }),
                    
                    // Calculate Button
                    React.createElement('div', {
                        key: 'calculate-button',
                        className: 'text-center'
                    }, React.createElement('button', {
                        onClick: handleCalculate,
                        className: 'btn-professional btn-primary'
                    }, t.calculate || 'חשב'))
                ]),

                // Results Column
                React.createElement('div', {
                    key: 'results',
                    className: 'space-y-6'
                }, results && window.ResultsPanel && React.createElement(window.ResultsPanel, {
                    results,
                    inputs: inputs,
                    workPeriods: workPeriods || [],
                    language,
                    t,
                    formatCurrency: window.formatCurrency,
                    convertCurrency: window.convertCurrency,
                    generateChartData: window.generateChartData,
                    showChart: false,
                    chartData: [],
                    claudeInsights: null,
                    exportRetirementSummary: () => {},
                    exportAsImage: () => {},
                    PiggyBank: () => React.createElement('span', {}, '🏛️'),
                    Calculator: () => React.createElement('span', {}, '📊'),
                    DollarSign: () => React.createElement('span', {}, '💰'),
                    Target: () => React.createElement('span', {}, '🎯'),
                    AlertCircle: () => React.createElement('span', {}, '⚠️'),
                    TrendingUp: () => React.createElement('span', {}, '📈'),
                    SimpleChart: window.SimpleChart,
                    ReadinessScore: window.ReadinessScore
                }))
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
                }, 'v5.3.2'),
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