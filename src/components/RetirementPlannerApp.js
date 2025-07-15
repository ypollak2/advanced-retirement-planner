// Advanced Retirement Planner - Guided Intelligence UI Design
// Created by Yali Pollak (יהלי פולק) - v5.3.3

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
    function getTranslations() {
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
    }
    
    const t = getTranslations();

    // Calculate function with error handling
    function handleCalculate() {
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
            React.createElement('div', {
                key: 'view-toggle',
                className: 'professional-tabs mb-6'
            }, [
                React.createElement('button', {
                    key: 'dashboard',
                    onClick: function() { setViewMode('dashboard'); },
                    className: `professional-tab ${viewMode === 'dashboard' ? 'active' : ''}`
                }, [
                    React.createElement('span', { key: 'icon' }, '🏠'),
                    ' ',
                    t.dashboard || 'לוח הבקרה'
                ]),
                React.createElement('button', {
                    key: 'detailed', 
                    onClick: function() { setViewMode('detailed'); },
                    className: `professional-tab ${viewMode === 'detailed' ? 'active' : ''}`
                }, [
                    React.createElement('span', { key: 'icon' }, '📊'),
                    ' ',
                    t.detailed || 'מצב מפורט'
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
                    // Quick Stats Card
                    React.createElement('div', {
                        key: 'quick-stats',
                        className: 'bg-white rounded-xl p-6 shadow-sm border border-gray-200'
                    }, [
                        React.createElement('h3', {
                            key: 'stats-title',
                            className: 'text-lg font-semibold text-gray-800 mb-4'
                        }, language === 'he' ? 'סטטיסטיקות מהירות' : 'Quick Stats'),
                        React.createElement('div', {
                            key: 'stats-grid',
                            className: 'space-y-3'
                        }, [
                            React.createElement('div', {
                                key: 'age-stat',
                                className: 'flex justify-between'
                            }, [
                                React.createElement('span', {
                                    key: 'age-label',
                                    className: 'text-gray-600'
                                }, language === 'he' ? 'גיל נוכחי' : 'Current Age'),
                                React.createElement('span', {
                                    key: 'age-value',
                                    className: 'font-semibold text-blue-600'
                                }, inputs?.currentAge || 30)
                            ]),
                            React.createElement('div', {
                                key: 'retirement-stat',
                                className: 'flex justify-between'
                            }, [
                                React.createElement('span', {
                                    key: 'retirement-label',
                                    className: 'text-gray-600'
                                }, language === 'he' ? 'גיל פרישה' : 'Retirement Age'),
                                React.createElement('span', {
                                    key: 'retirement-value',
                                    className: 'font-semibold text-green-600'
                                }, inputs?.retirementAge || 67)
                            ]),
                            React.createElement('div', {
                                key: 'savings-stat',
                                className: 'flex justify-between'
                            }, [
                                React.createElement('span', {
                                    key: 'savings-label',
                                    className: 'text-gray-600'
                                }, language === 'he' ? 'חיסכון נוכחי' : 'Current Savings'),
                                React.createElement('span', {
                                    key: 'savings-value',
                                    className: 'font-semibold text-purple-600'
                                }, window.formatCurrency ? window.formatCurrency(inputs?.currentSavings || 0) : `₪${(inputs?.currentSavings || 0).toLocaleString()}`)
                            ])
                        ])
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
                }, 'v5.3.3'),
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