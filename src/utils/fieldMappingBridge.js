// Field Mapping Bridge - Translates wizard field names to financial health engine expectations
// This provides a clean, maintainable mapping between different field naming conventions
// Uses the comprehensive FIELD_MAPPINGS from fieldMappingDictionary.js

/**
 * Find the value for a canonical field name in the input data
 * @param {Object} inputs - The input data object
 * @param {string} canonicalName - The canonical field name to search for
 * @param {Object} options - Options for field search
 * @returns {*} The field value or null if not found
 */
function findFieldValue(inputs, canonicalName, options = {}) {
    const { expectString = false, allowZero = false } = options;
    
    // Use the comprehensive field mapping dictionary
    const mappingDict = window.fieldMappingDictionary;
    if (!mappingDict) {
        console.warn('Field mapping dictionary not available, falling back to direct field access');
        const value = inputs[canonicalName];
        if (value !== undefined && value !== null && value !== '') {
            return expectString ? String(value).toLowerCase().trim() : parseFloat(value);
        }
        return null;
    }
    
    // Get all possible field names for this canonical name
    const fieldVariations = mappingDict.FIELD_MAPPINGS[canonicalName] || [canonicalName];
    
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
        const partnerFields = [
            'Salary', 'PensionRate', 'TrainingRate',
            'RsuUnits', 'RsuCompany', 'RsuCurrentStockPrice', 'RsuFrequency', 'RsuTaxRate',
            'AnnualBonus', 'FreelanceIncome', 'RentalIncome', 'DividendIncome',
            'PersonalPortfolio', 'Crypto', 'CurrentTrainingFund', 'CurrentPensionSavings'
        ];
        
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
    
    // Use the comprehensive field mapping dictionary
    const mappingDict = window.fieldMappingDictionary;
    if (!mappingDict) {
        report.criticalIssues.push('Field mapping dictionary not available');
        return report;
    }
    
    // Check each canonical field
    for (const [canonical, variations] of Object.entries(mappingDict.FIELD_MAPPINGS)) {
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
    
    // Check for critical missing fields based on canonical names from dictionary
    if (!report.foundFields.salary && inputs.planningType === 'individual') {
        report.criticalIssues.push('No monthly salary found for individual mode');
    }
    
    if (!report.foundFields.partnerSalary && inputs.planningType === 'couple') {
        report.criticalIssues.push('No partner salaries found for couple mode');
    }
    
    // Only consider missing contribution rates critical if other pension-related data exists
    if (!report.foundFields.pensionEmployeeRate && !report.foundFields.trainingFundEmployeeRate) {
        // This is expected for new users who haven't filled in contribution data yet
        // Don't treat it as a critical issue unless they have other pension data
        if (report.foundFields.currentPensionSavings || report.foundFields.currentTrainingFund) {
            report.criticalIssues.push('No contribution rates found despite having pension/training fund data');
        }
    }
    
    return report;
}

// Export functions
window.fieldMappingBridge = {
    getFieldValue: getFieldValueWithMapping,
    findFieldValue,
    getCombinedPartnerValue,
    diagnoseFieldAvailability
};

console.log('✅ Field Mapping Bridge loaded successfully');