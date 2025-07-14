// Advanced Retirement Planner - Professional UI Component
// Created by Yali Pollak (יהלי פולק) - v5.2.1

const RetirementPlannerApp = () => {
    const [language, setLanguage] = React.useState('he');
    const [activeTab, setActiveTab] = React.useState('basic');
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

    // Translation support
    const t = window.multiLanguage ? window.multiLanguage[language] : {
        title: 'מחשבון פנסיה מתקדם',
        subtitle: 'כלי מקצועי לתכנון פנסיה עם מעקב השקעות מקיף',
        basic: 'נתונים בסיסיים',
        advanced: 'נתונים מתקדמים', 
        calculate: 'חשב'
    };

    // Calculate function
    const handleCalculate = () => {
        if (window.calculateRetirement) {
            const result = window.calculateRetirement(inputs, workPeriods, [], []);
            setResults(result);
        }
    };

    return React.createElement('div', {
        className: 'min-h-screen',
        dir: language === 'he' ? 'rtl' : 'ltr'
    }, [
        // Professional Header
        React.createElement('header', {
            key: 'header',
            className: 'professional-header'
        }, [
            React.createElement('h1', {
                key: 'title',
                className: 'animate-fade-in-up'
            }, t.title || 'מחשבון פנסיה מתקדם'),
            React.createElement('p', {
                key: 'subtitle',
                className: 'animate-fade-in-up'
            }, t.subtitle || 'כלי מקצועי לתכנון פנסיה עם מעקב השקעות מקיף'),
            // Language Toggle
            React.createElement('div', {
                key: 'language',
                className: 'mt-4'
            }, React.createElement('button', {
                onClick: () => setLanguage(language === 'he' ? 'en' : 'he'),
                className: 'btn-professional btn-outline'
            }, language === 'he' ? 'English' : 'עברית'))
        ]),

        // Main Container
        React.createElement('div', {
            key: 'container',
            className: 'max-w-7xl mx-auto px-4 py-8'
        }, [

            // Tab Navigation
            React.createElement('div', {
                key: 'tabs',
                className: 'professional-tabs'
            }, [
                React.createElement('button', {
                    key: 'basic',
                    onClick: () => setActiveTab('basic'),
                    className: `professional-tab ${activeTab === 'basic' ? 'active' : ''}`
                }, t.basic || 'נתונים בסיסיים'),
                React.createElement('button', {
                    key: 'advanced', 
                    onClick: () => setActiveTab('advanced'),
                    className: `professional-tab ${activeTab === 'advanced' ? 'active' : ''}`
                }, t.advanced || 'נתונים מתקדמים')
            ]),

            // Tab Content
            React.createElement('div', {
                key: 'tab-content',
                className: 'professional-grid professional-grid-2'
            }, [
                // Forms Column
                React.createElement('div', {
                    key: 'forms',
                    className: 'space-y-6'
                }, [
                    // Basic Form
                    activeTab === 'basic' && window.BasicInputs && React.createElement(window.BasicInputs, {
                        key: 'basic-form',
                        inputs,
                        setInputs,
                        language,
                        t,
                        Calculator: () => React.createElement('span', {}, '📊'),
                        PiggyBank: () => React.createElement('span', {}, '🏛️'),
                        DollarSign: () => React.createElement('span', {}, '💰')
                    }),
                    // Advanced Form  
                    activeTab === 'advanced' && window.AdvancedInputs && React.createElement(window.AdvancedInputs, {
                        key: 'advanced-form',
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
                    workPeriods: [],
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
                }, 'v5.2.1'),
                ' • Created by ',
                React.createElement('span', {
                    key: 'author',
                    className: 'author'
                }, 'Yali Pollak (יהלי פולק)'),
                ' • Professional Financial Planning Tool'
            ])
        ])
    ]);
};

// Export to window for global access
window.RetirementPlannerApp = RetirementPlannerApp;