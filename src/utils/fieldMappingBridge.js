// Field Mapping Bridge - Translates wizard field names to financial health engine expectations
// This provides a clean, maintainable mapping between different field naming conventions

/**
 * Field mapping configuration
 * Maps canonical field names to all possible variations found in wizard components
 */
const FIELD_MAPPINGS = {
    // Income fields
    monthlySalary: [
        'currentMonthlySalary', 'monthlySalary', 'salary', 'monthlyIncome',
        'currentSalary', 'monthly_salary', 'income', 'grossSalary',
        'netSalary', 'baseSalary', 'totalIncome', 'monthlyIncomeAmount'
    ],
    
    // Partner income fields (couple mode)
    partner1Salary: [
        'partner1Salary', 'Partner1Salary', 'partner1Income', 'partner1MonthlySalary',
        'partner1NetSalary', 'partner1GrossSalary', 'partner1NetIncome',
        'partner_1_salary', 'partnerOneSalary'
    ],
    
    partner2Salary: [
        'partner2Salary', 'Partner2Salary', 'partner2Income', 'partner2MonthlySalary',
        'partner2NetSalary', 'partner2GrossSalary', 'partner2NetIncome',
        'partner_2_salary', 'partnerTwoSalary'
    ],
    
    // Pension contribution rates
    pensionEmployeeRate: [
        'pensionContributionRate', 'pensionEmployeeRate', 'pensionEmployee',
        'employeePensionRate', 'pension_contribution_rate', 'pension_rate',
        'pensionRate', 'employeePension'
    ],
    
    partner1PensionRate: [
        'partner1PensionEmployeeRate', 'partner1PensionContributionRate', 
        'partner1PensionRate', 'partner1PensionEmployee'
    ],
    
    partner2PensionRate: [
        'partner2PensionEmployeeRate', 'partner2PensionContributionRate',
        'partner2PensionRate', 'partner2PensionEmployee'
    ],
    
    // Training fund contribution rates
    trainingFundEmployeeRate: [
        'trainingFundContributionRate', 'trainingFundEmployeeRate', 'trainingFundEmployee',
        'employeeTrainingFundRate', 'training_fund_rate', 'trainingFund_rate',
        'trainingFundRate', 'employeeTrainingFund'
    ],
    
    partner1TrainingRate: [
        'partner1TrainingFundEmployeeRate', 'partner1TrainingFundContributionRate',
        'partner1TrainingFundRate', 'partner1TrainingFundEmployee'
    ],
    
    partner2TrainingRate: [
        'partner2TrainingFundEmployeeRate', 'partner2TrainingFundContributionRate',
        'partner2TrainingFundRate', 'partner2TrainingFundEmployee'
    ],
    
    // Current savings - Pension
    currentPensionSavings: [
        'currentPensionSavings', 'currentSavings', 'pensionSavings',
        'retirementSavings', 'currentRetirementSavings', 'currentPension',
        'pensionBalance', 'pensionValue'
    ],
    
    // Current savings - Training Fund
    currentTrainingFund: [
        'currentTrainingFund', 'trainingFund', 'trainingFundValue',
        'trainingFundBalance', 'kerenHishtalmut', 'kerenHishtalmutBalance'
    ],
    
    // Current savings - Portfolio
    currentPortfolio: [
        'currentPersonalPortfolio', 'personalPortfolio', 'currentPortfolio',
        'portfolio', 'stockPortfolio', 'investmentPortfolio', 
        'currentStockPortfolio', 'portfolioValue'
    ],
    
    // Current savings - Real Estate
    currentRealEstate: [
        'currentRealEstate', 'realEstate', 'realEstateValue',
        'currentRealEstateValue', 'propertyValue', 'properties'
    ],
    
    // Current savings - Crypto
    currentCrypto: [
        'currentCrypto', 'currentCryptoFiatValue', 'cryptoValue',
        'currentCryptocurrency', 'cryptoPortfolio', 'cryptocurrency'
    ],
    
    // Current savings - Bank/Emergency
    currentBankAccount: [
        'currentBankAccount', 'currentSavingsAccount', 'emergencyFund',
        'emergencyFundAmount', 'bankAccount', 'savingsAccount',
        'cashReserves', 'liquidSavings', 'cashSavings'
    ],
    
    // Risk tolerance
    riskTolerance: [
        'riskTolerance', 'riskProfile', 'investmentRisk', 'riskLevel',
        'risk_tolerance', 'riskToleranceLevel', 'investmentRiskLevel'
    ],
    
    // Country/Tax location
    taxCountry: [
        'taxCountry', 'country', 'taxLocation', 'location', 'countryCode',
        'tax_country', 'residenceCountry'
    ],
    
    // Age
    currentAge: [
        'currentAge', 'age', 'userAge', 'myAge', 'current_age'
    ],
    
    // Monthly expenses
    monthlyExpenses: [
        'currentMonthlyExpenses', 'monthlyExpenses', 'expenses',
        'monthly_expenses', 'totalMonthlyExpenses'
    ],
    
    // RSU fields
    rsuUnits: [
        'rsuUnits', 'rsu_units', 'stockUnits', 'restrictedStockUnits'
    ],
    
    rsuStockPrice: [
        'rsuCurrentStockPrice', 'rsuStockPrice', 'stockPrice', 'currentStockPrice'
    ]
};

/**
 * Find the value for a canonical field name in the input data
 * @param {Object} inputs - The input data object
 * @param {string} canonicalName - The canonical field name to search for
 * @param {Object} options - Options for field search
 * @returns {*} The field value or null if not found
 */
function findFieldValue(inputs, canonicalName, options = {}) {
    const { expectString = false, allowZero = false } = options;
    
    // Get all possible field names for this canonical name
    const fieldVariations = FIELD_MAPPINGS[canonicalName] || [canonicalName];
    
    // Search through all variations
    for (const fieldName of fieldVariations) {
        const value = inputs[fieldName];
        
        if (value !== undefined && value !== null && value !== '') {
            if (expectString) {
                return String(value).toLowerCase().trim();
            } else {
                const numValue = parseFloat(value);
                if (!isNaN(numValue) && (allowZero || numValue > 0)) {
                    return numValue;
                }
            }
        }
    }
    
    return null;
}

/**
 * Get combined value for partner fields in couple mode
 * @param {Object} inputs - The input data object
 * @param {string} baseFieldName - Base field name (without partner prefix)
 * @param {Object} options - Options for field search
 * @returns {number} Combined value or 0
 */
function getCombinedPartnerValue(inputs, baseFieldName, options = {}) {
    const { combineMethod = 'sum' } = options;
    
    const partner1Value = findFieldValue(inputs, `partner1${baseFieldName}`, options) || 0;
    const partner2Value = findFieldValue(inputs, `partner2${baseFieldName}`, options) || 0;
    
    if (combineMethod === 'average') {
        const count = (partner1Value > 0 ? 1 : 0) + (partner2Value > 0 ? 1 : 0);
        return count > 0 ? (partner1Value + partner2Value) / count : 0;
    }
    
    return partner1Value + partner2Value;
}

/**
 * Main function to get field value with partner combination support
 * @param {Object} inputs - The input data object
 * @param {string} fieldName - The field name to search for
 * @param {Object} options - Options for field search
 * @returns {*} The field value
 */
function getFieldValueWithMapping(inputs, fieldName, options = {}) {
    const { combinePartners = false } = options;
    
    // Handle couple mode with partner combination
    if (combinePartners && inputs.planningType === 'couple') {
        // Check if this is a field that should be combined from partners
        const partnerFields = ['Salary', 'PensionRate', 'TrainingRate'];
        
        for (const pField of partnerFields) {
            if (fieldName.includes(pField)) {
                return getCombinedPartnerValue(inputs, pField, options);
            }
        }
    }
    
    // Regular field lookup
    return findFieldValue(inputs, fieldName, options) || (options.allowZero ? 0 : null);
}

/**
 * Diagnostic function to check which fields are available
 * @param {Object} inputs - The input data object
 * @returns {Object} Report of available fields
 */
function diagnoseFieldAvailability(inputs) {
    const report = {
        planningType: inputs.planningType,
        availableFields: Object.keys(inputs).length,
        foundFields: {},
        missingFields: {},
        criticalIssues: []
    };
    
    // Check each canonical field
    for (const [canonical, variations] of Object.entries(FIELD_MAPPINGS)) {
        const value = findFieldValue(inputs, canonical, { allowZero: true });
        
        if (value !== null) {
            report.foundFields[canonical] = {
                value,
                matchedField: variations.find(v => inputs[v] !== undefined)
            };
        } else {
            report.missingFields[canonical] = {
                searchedFields: variations,
                allMissing: true
            };
        }
    }
    
    // Check for critical missing fields
    if (!report.foundFields.monthlySalary && inputs.planningType === 'individual') {
        report.criticalIssues.push('No monthly salary found for individual mode');
    }
    
    if (!report.foundFields.partner1Salary && !report.foundFields.partner2Salary && inputs.planningType === 'couple') {
        report.criticalIssues.push('No partner salaries found for couple mode');
    }
    
    if (!report.foundFields.pensionEmployeeRate && !report.foundFields.trainingFundEmployeeRate) {
        report.criticalIssues.push('No contribution rates found');
    }
    
    return report;
}

// Export functions
window.fieldMappingBridge = {
    getFieldValue: getFieldValueWithMapping,
    findFieldValue,
    getCombinedPartnerValue,
    diagnoseFieldAvailability,
    FIELD_MAPPINGS
};

console.log('✅ Field Mapping Bridge loaded successfully');