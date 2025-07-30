/**
 * Field Mapping Dictionary for Financial Health Engine
 * Part of TICKET-006: Zero Fallback Achievement
 * 
 * This dictionary provides comprehensive field name mappings to handle
 * all variations of field names used across different components.
 */

const FIELD_MAPPINGS = {
    // ========== SALARY/INCOME FIELDS ==========
    salary: [
        // Individual salary variations
        'currentMonthlySalary', 'monthlySalary', 'salary', 'monthlyIncome',
        'currentSalary', 'monthly_salary', 'income', 'grossSalary',
        'netSalary', 'baseSalary', 'monthlyGrossSalary', 'monthlyNetSalary',
        'currentIncome', 'monthlyWage', 'wage', 'earnings',
        'monthlyEarnings', 'currentMonthlyIncome', 'incomeMonthly'
    ],
    
    partnerSalary: [
        // Partner salary variations - comprehensive list
        'partner1Salary', 'partner2Salary', 'Partner1Salary', 'Partner2Salary',
        'partner1Income', 'partner2Income', 'partner1MonthlySalary', 'partner2MonthlySalary',
        'partnerSalary', 'spouseSalary', 'partner1MonthlyIncome', 'partner2MonthlyIncome',
        'Partner1Income', 'Partner2Income', 'partner1CurrentSalary', 'partner2CurrentSalary',
        'partner1Wage', 'partner2Wage', 'partnerIncome', 'spouseIncome',
        'partner1GrossSalary', 'partner2GrossSalary', 'partner1NetSalary', 'partner2NetSalary'
    ],
    
    // ========== PENSION FIELDS ==========
    pensionEmployeeRate: [
        'pensionContributionRate', 'pensionEmployeeRate', 'pensionEmployee',
        'employeePensionRate', 'pension_contribution_rate', 'pension_rate',
        'pensionRateEmployee', 'employee_pension_rate', 'employeePension',
        'pensionEmployeeContribution', 'employeePensionContribution', 'pensionRate',
        'myPensionRate', 'personalPensionRate', 'pensionEmployeePercent',
        'pensionEmployeePercentage', 'employee_pension_contribution'
    ],
    
    pensionEmployerRate: [
        'pensionEmployerRate', 'employerPensionRate', 'pensionEmployer',
        'employer_pension_rate', 'pensionRateEmployer', 'employerPension',
        'pensionEmployerContribution', 'employerPensionContribution',
        'companyPensionRate', 'employerContributionRate', 'pensionEmployerPercent',
        'pensionEmployerPercentage', 'employer_pension_contribution'
    ],
    
    currentPensionSavings: [
        'currentPensionSavings', 'currentSavings', 'pensionSavings',
        'retirementSavings', 'currentRetirementSavings', 'currentPension',
        'totalPensionSavings', 'accumulatedPension', 'pensionBalance',
        'retirementBalance', 'pensionFundBalance', 'currentPensionBalance',
        'pensionValue', 'currentPensionValue', 'retirementFundBalance'
    ],
    
    // ========== TRAINING FUND FIELDS ==========
    trainingFundEmployeeRate: [
        'trainingFundContributionRate', 'trainingFundEmployeeRate', 'trainingFundEmployee',
        'employeeTrainingFundRate', 'training_fund_rate', 'trainingFund_rate',
        'trainingRateEmployee', 'employee_training_fund_rate', 'employeeTrainingFund',
        'trainingFundRateEmployee', 'trainingFundEmployeeContribution',
        'employeeTrainingContribution', 'trainingEmployeeRate', 'kerenHishtalmutEmployee',
        'kerenHishtalmutEmployeeRate', 'advancedTrainingEmployee'
    ],
    
    trainingFundEmployerRate: [
        'trainingFundEmployerRate', 'employerTrainingFundRate', 'trainingFundEmployer',
        'employer_training_fund_rate', 'trainingRateEmployer', 'employerTrainingFund',
        'trainingFundRateEmployer', 'trainingFundEmployerContribution',
        'employerTrainingContribution', 'trainingEmployerRate', 'kerenHishtalmutEmployer',
        'kerenHishtalmutEmployerRate', 'advancedTrainingEmployer'
    ],
    
    currentTrainingFund: [
        'currentTrainingFund', 'trainingFund', 'trainingFundValue',
        'trainingFundBalance', 'kerenHishtalmut', 'kerenHishtalmutBalance',
        'advancedTrainingBalance', 'studyFund', 'studyFundBalance',
        'trainingFundSavings', 'currentTrainingFundValue', 'trainingBalance'
    ],
    
    // ========== PARTNER TRAINING FUND FIELDS ==========
    partner1TrainingFundContributionRate: [
        'partner1TrainingFundContributionRate', 'partner1TrainingFundEmployeeRate',
        'partner1TrainingFundRate', 'partner1TrainingRate', 'partner1KerenHishtalmutRate'
    ],
    
    partner2TrainingFundContributionRate: [
        'partner2TrainingFundContributionRate', 'partner2TrainingFundEmployeeRate',
        'partner2TrainingFundRate', 'partner2TrainingRate', 'partner2KerenHishtalmutRate'
    ],
    
    partnerTrainingFund: [
        'partner1CurrentTrainingFund', 'partner2CurrentTrainingFund', 'partnerTrainingFund',
        'partner1TrainingFundBalance', 'partner2TrainingFundBalance', 'partnerTrainingBalance',
        'partner1KerenHishtalmut', 'partner2KerenHishtalmut', 'partnerKerenHishtalmut'
    ],
    
    // ========== PORTFOLIO/INVESTMENT FIELDS ==========
    portfolio: [
        'currentPersonalPortfolio', 'personalPortfolio', 'stockPortfolio',
        'investmentPortfolio', 'currentStockPortfolio', 'stocksAndBonds',
        'portfolio', 'investments', 'equityPortfolio', 'currentInvestments',
        'investmentBalance', 'portfolioValue', 'currentPortfolioValue',
        'securitiesPortfolio', 'tradingAccount', 'brokerageAccount'
    ],
    
    partnerPortfolio: [
        'partner1PersonalPortfolio', 'partner2PersonalPortfolio', 'partnerPortfolio',
        'partner1Portfolio', 'partner2Portfolio', 'partner1Investments',
        'partner2Investments', 'partnerInvestments', 'partner1StockPortfolio',
        'partner2StockPortfolio', 'partnerStockPortfolio'
    ],
    
    // ========== REAL ESTATE FIELDS ==========
    realEstate: [
        'currentRealEstate', 'realEstate', 'realEstateValue',
        'currentRealEstateValue', 'propertyValue', 'currentProperty',
        'property', 'realEstateAssets', 'propertyAssets', 'homeValue',
        'houseValue', 'apartmentValue', 'realEstateInvestments',
        'investmentProperty', 'rentalProperty'
    ],
    
    // ========== CRYPTOCURRENCY FIELDS ==========
    crypto: [
        'currentCrypto', 'currentCryptoFiatValue', 'cryptoValue',
        'currentCryptocurrency', 'cryptoPortfolio', 'digitalAssets',
        'cryptocurrency', 'cryptoAssets', 'bitcoinValue', 'ethereumValue',
        'digitalCurrency', 'cryptoInvestments', 'currentCryptoValue',
        'cryptoHoldings', 'virtualCurrency'
    ],
    
    partnerCrypto: [
        'partner1Crypto', 'partner2Crypto', 'partnerCrypto',
        'partner1CryptoValue', 'partner2CryptoValue', 'partnerCryptoValue',
        'partner1Cryptocurrency', 'partner2Cryptocurrency', 'partnerCryptocurrency'
    ],
    
    // ========== SAVINGS/EMERGENCY FUND FIELDS ==========
    emergencyFund: [
        'emergencyFund', 'currentBankAccount', 'currentSavingsAccount',
        'emergencyFundAmount', 'cashReserves', 'liquidSavings',
        'savingsAccount', 'bankAccount', 'cashSavings', 'emergencySavings',
        'currentEmergencyFund', 'emergencyReserve', 'emergencyMoney',
        'rainyDayFund', 'cashBuffer', 'liquidCash', 'availableCash'
    ],
    
    savingsAccount: [
        'currentSavingsAccount', 'savingsAccount', 'currentBankAccount',
        'bankAccount', 'cashSavings', 'liquidSavings', 'currentCash',
        'cashBalance', 'bankBalance', 'savingsBalance', 'liquidAssets',
        'cashAssets', 'bankDeposits', 'savingsDeposits'
    ],
    
    // ========== ADDITIONAL SAVINGS FIELDS ==========
    additionalSavings: [
        'additionalMonthlySavings', 'monthlyAdditionalSavings', 'extraSavings',
        'monthlySavings', 'additionalSavings', 'extraMonthly',
        'monthlyExtra', 'additionalContribution', 'voluntarySavings',
        'extraContribution', 'additionalMonthlyContribution', 'monthlySurplus',
        'monthlyInvestment', 'regularSavings', 'plannedSavings'
    ],
    
    // ========== US RETIREMENT ACCOUNTS ==========
    retirement401k: [
        'current401k', 'current401K', 'retirement401k', '401kBalance',
        'fourOhOneK', '401kValue', 'current401kBalance', 'retirement401kBalance',
        '401kAccount', 'company401k', 'employer401k', 'work401k'
    ],
    
    partner401k: [
        'partner401k', 'partner1_401k', 'partner2_401k', 'partner401kBalance',
        'partner1Current401k', 'partner2Current401k', 'partnerFourOhOneK'
    ],
    
    retirementIRA: [
        'currentIRA', 'currentIra', 'iraBalance', 'retirementIRA',
        'traditionalIRA', 'rothIRA', 'sepIRA', 'simpleIRA',
        'iraAccount', 'individualRetirementAccount', 'currentIraBalance',
        'retirementIraBalance', 'iraValue'
    ],
    
    // ========== EXPENSE FIELDS ==========
    monthlyExpenses: [
        'currentMonthlyExpenses', 'monthlyExpenses', 'expenses',
        'monthlySpending', 'monthlyCosts', 'livingExpenses',
        'monthlyBudget', 'totalMonthlyExpenses', 'expensesMonthly',
        'monthlyOutgoings', 'costOfLiving', 'monthlyExpenditures'
    ],
    
    // ========== DEBT FIELDS ==========
    monthlyDebt: [
        'monthlyDebt', 'debtPayments', 'monthlyDebtPayments',
        'loanPayments', 'monthlyLoanPayments', 'debtService',
        'monthlyDebtService', 'debtRepayments', 'monthlyObligations'
    ],
    
    totalDebt: [
        'totalDebt', 'outstandingDebt', 'totalOwed', 'debtBalance',
        'totalLiabilities', 'totalLoans', 'debtAmount', 'liabilities'
    ],
    
    // ========== RSU/STOCK FIELDS ==========
    rsuUnits: [
        'rsuUnits', 'rsuShares', 'stockUnits', 'restrictedStockUnits',
        'vestingUnits', 'grantedUnits', 'rsuAmount', 'stockOptions'
    ],
    
    rsuCompany: [
        'rsuCompany', 'stockCompany', 'employerStock', 'companyStock',
        'stockTicker', 'companyTicker', 'rsuTicker', 'stockSymbol'
    ],
    
    // ========== WORK PERIOD FIELDS ==========
    workPeriods: [
        'workPeriods', 'employmentHistory', 'workHistory', 'careerHistory',
        'employmentPeriods', 'jobHistory', 'workExperience'
    ],
    
    // ========== MISCELLANEOUS FIELDS ==========
    annualBonus: [
        'annualBonus', 'yearlyBonus', 'bonusAmount', 'annualBonusAmount',
        'expectedBonus', 'typicalBonus', 'averageBonus', 'bonusIncome'
    ],
    
    foreignPension: [
        'foreignPension', 'overseasPension', 'internationalPension',
        'abroadPension', 'expatPension', 'foreignRetirement', 'overseasRetirement'
    ],
    
    personalPortfolioReturn: [
        'personalPortfolioReturn', 'portfolioReturn', 'investmentReturn',
        'expectedReturn', 'annualReturn', 'portfolioGrowthRate', 'returnRate'
    ],
    
    cryptoReturn: [
        'cryptoReturn', 'cryptoGrowthRate', 'cryptoExpectedReturn',
        'digitalAssetReturn', 'cryptocurrencyReturn', 'cryptoROI'
    ],
    
    // ========== PENSION INCOME (RETIREES) ==========
    monthlyPensionIncome: [
        'monthlyPensionIncome', 'pensionIncome', 'retirementIncome',
        'monthlyRetirementIncome', 'pensionPayment', 'monthlyPensionPayment',
        'retirementPayment', 'pensionBenefit', 'monthlyBenefit'
    ],
    
    partnerMonthlyPensionIncome: [
        'partnerMonthlyPensionIncome', 'partnerPensionIncome', 'partner1PensionIncome',
        'partner2PensionIncome', 'spousePensionIncome', 'partnerRetirementIncome'
    ]
};

// Helper function to normalize field names for comparison
function normalizeFieldName(fieldName) {
    if (!fieldName) return '';
    
    return fieldName
        .toLowerCase()
        .replace(/[_-]/g, '')  // Remove underscores and hyphens
        .replace(/\s+/g, '')   // Remove spaces
        .replace(/1|2/g, '');  // Remove partner numbers for base comparison
}

// Find the canonical field name for a given input field
function findCanonicalField(inputFieldName) {
    const normalized = normalizeFieldName(inputFieldName);
    
    // First, try exact match
    for (const [canonical, variations] of Object.entries(FIELD_MAPPINGS)) {
        if (variations.includes(inputFieldName)) {
            return canonical;
        }
    }
    
    // Then, try normalized match
    for (const [canonical, variations] of Object.entries(FIELD_MAPPINGS)) {
        if (variations.some(v => normalizeFieldName(v) === normalized)) {
            return canonical;
        }
    }
    
    return null;
}

// Get all variations of a canonical field name
function getFieldVariations(canonicalFieldName) {
    return FIELD_MAPPINGS[canonicalFieldName] || [];
}

// Check if two field names are equivalent
function areFieldsEquivalent(field1, field2) {
    // Direct match
    if (field1 === field2) return true;
    
    // Check if they map to the same canonical field
    const canonical1 = findCanonicalField(field1);
    const canonical2 = findCanonicalField(field2);
    
    return canonical1 && canonical2 && canonical1 === canonical2;
}

// Get suggested field name based on available fields
function suggestFieldName(desiredField, availableFields) {
    // First, check if the desired field exists
    if (availableFields.includes(desiredField)) {
        return desiredField;
    }
    
    // Find canonical field
    const canonical = findCanonicalField(desiredField);
    if (!canonical) return null;
    
    // Check all variations
    const variations = getFieldVariations(canonical);
    for (const variation of variations) {
        if (availableFields.includes(variation)) {
            return variation;
        }
    }
    
    return null;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FIELD_MAPPINGS,
        normalizeFieldName,
        findCanonicalField,
        getFieldVariations,
        areFieldsEquivalent,
        suggestFieldName
    };
}

// Also make available globally for browser usage
if (typeof window !== 'undefined') {
    window.fieldMappingDictionary = {
        FIELD_MAPPINGS,
        normalizeFieldName,
        findCanonicalField,
        getFieldVariations,
        areFieldsEquivalent,
        suggestFieldName
    };
}