// Main Retirement Planner Component
const { useState } = React;

const RetirementPlanner = () => {
    const [language, setLanguage] = useState('he');
    const [activeTab, setActiveTab] = useState('basic');
    const [results, setResults] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [showChart, setShowChart] = useState(false);
    const [showSalaryInput, setShowSalaryInput] = useState(false);
    const [showFamilyPlanning, setShowFamilyPlanning] = useState(false);
    const [familyPlanningEnabled, setFamilyPlanningEnabled] = useState(false);
    const [children, setChildren] = useState([]);
    const [stressTestResults, setStressTestResults] = useState(null);
    const [showStressTest, setShowStressTest] = useState(false);
    const [selectedScenario, setSelectedScenario] = useState(null);
    const [selectedTimeHorizon, setSelectedTimeHorizon] = useState(20);
    const [historicalReturns, setHistoricalReturns] = useState({});
    const [exchangeRatesLoading, setExchangeRatesLoading] = useState(false);
    const [exchangeRatesLastUpdated, setExchangeRatesLastUpdated] = useState(null);
    const [cryptoPrices, setCryptoPrices] = useState({
        bitcoin: 50000,
        ethereum: 3000,
        binancecoin: 300
    });
    const [cryptoPricesLoading, setCryptoPricesLoading] = useState(false);
    const [cryptoPricesLastUpdated, setCryptoPricesLastUpdated] = useState(null);
    const [indexDataLoading, setIndexDataLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    // Initial state with all investment types
    const [inputs, setInputs] = useState({
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

    const [workPeriods, setWorkPeriods] = useState([
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

    const [partnerWorkPeriods, setPartnerWorkPeriods] = useState([
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

    const [pensionIndexAllocation, setPensionIndexAllocation] = useState([
        { index: 'S&P 500', percentage: 60, customReturn: null },
        { index: 'Government Bonds', percentage: 40, customReturn: null }
    ]);

    const [trainingFundIndexAllocation, setTrainingFundIndexAllocation] = useState([
        { index: 'Tel Aviv 35', percentage: 100, customReturn: null }
    ]);

    return { 
        language, setLanguage,
        activeTab, setActiveTab,
        results, setResults,
        chartData, setChartData,
        showChart, setShowChart,
        showSalaryInput, setShowSalaryInput,
        showFamilyPlanning, setShowFamilyPlanning,
        familyPlanningEnabled, setFamilyPlanningEnabled,
        children, setChildren,
        stressTestResults, setStressTestResults,
        showStressTest, setShowStressTest,
        selectedScenario, setSelectedScenario,
        selectedTimeHorizon, setSelectedTimeHorizon,
        historicalReturns, setHistoricalReturns,
        exchangeRatesLoading, setExchangeRatesLoading,
        exchangeRatesLastUpdated, setExchangeRatesLastUpdated,
        cryptoPrices, setCryptoPrices,
        cryptoPricesLoading, setCryptoPricesLoading,
        cryptoPricesLastUpdated, setCryptoPricesLastUpdated,
        indexDataLoading, setIndexDataLoading,
        lastUpdated, setLastUpdated,
        inputs, setInputs,
        workPeriods, setWorkPeriods,
        partnerWorkPeriods, setPartnerWorkPeriods,
        pensionIndexAllocation, setPensionIndexAllocation,
        trainingFundIndexAllocation, setTrainingFundIndexAllocation
    };
};

// Export to window for global access
window.RetirementPlannerApp = RetirementPlanner;