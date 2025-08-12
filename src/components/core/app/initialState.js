// Initial State and Default Values for Retirement Planner App

const DEFAULT_INPUTS = {
    // Basic Information
    currentAge: 30,
    retirementAge: 67,
    currentSavings: 0,
    inflationRate: 3,
    currentMonthlyExpenses: 12000,
    targetReplacement: 75,
    riskTolerance: 'moderate',
    
    // Training Fund
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
};

const DEFAULT_CRYPTO_PRICES = {
    bitcoin: 50000,
    ethereum: 3000,
    binancecoin: 300
};

const DEFAULT_SETTINGS = {
    language: 'en',
    viewMode: 'wizard',
    workingCurrency: 'ILS',
    sidebarCollapsed: false,
    wizardCompleted: false,
    currentStep: 1,
    activeSection: null,
    showChart: false,
    showSalaryInput: false,
    showFamilyPlanning: false,
    familyPlanningEnabled: false,
    showStressTest: false,
    selectedTimeHorizon: 20
};

// Storage keys
const STORAGE_KEYS = {
    WIZARD_DATA: 'retirementWizardData',
    INPUTS: 'retirementPlannerInputs',
    SETTINGS: 'retirementPlannerSettings',
    WIZARD_INPUTS: 'retirementWizardInputs',
    WIZARD_STEP: 'wizardCurrentStep'
};

// Storage utilities
function saveToLocalStorage(key, data) {
    try {
        const serializedData = JSON.stringify(data);
        if (serializedData.length < 1024 * 1024) { // Limit to 1MB
            localStorage.setItem(key, serializedData);
            return true;
        }
        console.warn('Data too large to save to localStorage');
        return false;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function loadFromLocalStorage(key, defaultValue = null) {
    try {
        const savedData = localStorage.getItem(key);
        if (savedData) {
            return JSON.parse(savedData);
        }
        return defaultValue;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return defaultValue;
    }
}

function loadInitialState() {
    // Try to load saved wizard data first
    const wizardData = loadFromLocalStorage(STORAGE_KEYS.WIZARD_DATA);
    if (wizardData && wizardData.timestamp && Date.now() - wizardData.timestamp < 24 * 60 * 60 * 1000) {
        return {
            inputs: { ...DEFAULT_INPUTS, ...wizardData.inputs },
            wizardCompleted: wizardData.wizardCompleted || false,
            currentStep: wizardData.currentStep || 1
        };
    }
    
    // Try to load saved inputs
    const savedInputs = loadFromLocalStorage(STORAGE_KEYS.INPUTS);
    if (savedInputs) {
        return {
            inputs: { ...DEFAULT_INPUTS, ...savedInputs },
            wizardCompleted: false,
            currentStep: 1
        };
    }
    
    // Try wizard-specific storage
    const wizardInputs = loadFromLocalStorage(STORAGE_KEYS.WIZARD_INPUTS);
    const wizardStep = loadFromLocalStorage(STORAGE_KEYS.WIZARD_STEP);
    if (wizardInputs) {
        return {
            inputs: { ...DEFAULT_INPUTS, ...wizardInputs },
            wizardCompleted: false,
            currentStep: wizardStep || 1
        };
    }
    
    // Return defaults
    return {
        inputs: DEFAULT_INPUTS,
        wizardCompleted: false,
        currentStep: 1
    };
}

// Export everything
window.RetirementPlannerInitialState = {
    DEFAULT_INPUTS,
    DEFAULT_CRYPTO_PRICES,
    DEFAULT_SETTINGS,
    STORAGE_KEYS,
    saveToLocalStorage,
    loadFromLocalStorage,
    loadInitialState
};

console.log('✅ Retirement Planner Initial State loaded');