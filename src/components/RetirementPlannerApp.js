// Main Retirement Planner Component with enhanced truncation support

// Helper function for title truncation
const truncateTitle = (title, maxLength = 50) => {
    if (!title || typeof title !== 'string') return '';
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
};

const RetirementPlanner = () => {
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

    const AppTitle = () => {
        const titleText = language === 'he' ? 'מחשבון פרישה מתקדם' : 'Advanced Retirement Planner';
        return React.createElement('h1', { 
            className: 'text-4xl font-bold text-gray-800 mb-4 truncate-multiline truncate-2-lines'
        }, titleText);
    };
};

// Export to window for global access
window.RetirementPlannerApp = RetirementPlanner;