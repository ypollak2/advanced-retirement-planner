// Field Mapping Utilities for Financial Health Engine
// Handles flexible field name mapping for partner data and legacy compatibility

// Import field mapping dictionary if available
let fieldMappingDictionary = null;
if (typeof window !== 'undefined' && window.fieldMappingDictionary) {
    fieldMappingDictionary = window.fieldMappingDictionary;
}

// Import safe calculations
const { safeParseFloat } = window.financialHealthSafeCalcs || {};

/**
 * Enhanced field value getter with partner combination logic
 * Supports flexible field name mapping and partner data aggregation
 * @param {Object} inputs - User inputs object
 * @param {Array|String} fieldNames - Field name(s) to get value for
 * @param {Object} options - Configuration options
 * @returns {Number} The field value or combined partner values
 */
function getFieldValue(inputs, fieldNames, options = {}) {
    const {
        defaultValue = 0,
        combinePartners = false,
        allowZero = true,
        phase = 2,
        calculationContext = '',
        forcePartnerOnly = false,
        skipPartnerInSingleMode = true
    } = options;
    
    // Ensure fieldNames is an array
    const fields = Array.isArray(fieldNames) ? fieldNames : [fieldNames];
    
    // Helper function to validate value
    const isValidValue = (val) => {
        if (!allowZero && val === 0) return false;
        return val !== undefined && val !== null && val !== '' && !isNaN(val);
    };
    
    // Helper function to get value with fallback
    const getValueWithFallback = (fieldList) => {
        for (const field of fieldList) {
            const value = inputs[field];
            if (isValidValue(value)) {
                return safeParseFloat(value, defaultValue);
            }
        }
        return defaultValue;
    };
    
    // Phase 1 & 1.5: Skip partner combination logic for specific fields
    if (phase < 2 && combinePartners) {
        // In early phases, don't combine partners for certain critical fields
        const skipCombineFields = [
            'currentMonthlySalary', 'currentSalary', 'monthlySalary',
            'currentMonthlyExpenses', 'monthlyExpenses'
        ];
        
        const shouldSkipCombine = fields.some(field => 
            skipCombineFields.some(skipField => 
                field.toLowerCase().includes(skipField.toLowerCase())
            )
        );
        
        if (shouldSkipCombine) {
            // Just return the main value without partner combination
            return getValueWithFallback(fields);
        }
    }
    
    // Handle couple planning mode
    if (inputs.planningType === 'couple' || forcePartnerOnly) {
        if (combinePartners) {
            let total = 0;
            let hasValidPartnerData = false;
            
            // Get partner 1 value
            const partner1Fields = fields.map(field => {
                // Use field mapping dictionary if available
                if (fieldMappingDictionary && fieldMappingDictionary[`partner1${field.charAt(0).toUpperCase() + field.slice(1)}`]) {
                    return fieldMappingDictionary[`partner1${field.charAt(0).toUpperCase() + field.slice(1)}`];
                }
                // Fallback patterns
                return [
                    `partner1${field.charAt(0).toUpperCase() + field.slice(1)}`,
                    `partner1_${field}`,
                    `partner1${field}`,
                    `p1${field.charAt(0).toUpperCase() + field.slice(1)}`
                ];
            }).flat();
            
            const partner1Value = getValueWithFallback(partner1Fields);
            if (partner1Value !== defaultValue) {
                total += partner1Value;
                hasValidPartnerData = true;
            }
            
            // Get partner 2 value
            const partner2Fields = fields.map(field => {
                // Use field mapping dictionary if available
                if (fieldMappingDictionary && fieldMappingDictionary[`partner2${field.charAt(0).toUpperCase() + field.slice(1)}`]) {
                    return fieldMappingDictionary[`partner2${field.charAt(0).toUpperCase() + field.slice(1)}`];
                }
                // Fallback patterns
                return [
                    `partner2${field.charAt(0).toUpperCase() + field.slice(1)}`,
                    `partner2_${field}`,
                    `partner2${field}`,
                    `partnerAdditional${field.charAt(0).toUpperCase() + field.slice(1)}`,
                    `partner${field.charAt(0).toUpperCase() + field.slice(1)}`,
                    `p2${field.charAt(0).toUpperCase() + field.slice(1)}`
                ];
            }).flat();
            
            const partner2Value = getValueWithFallback(partner2Fields);
            if (partner2Value !== defaultValue) {
                total += partner2Value;
                hasValidPartnerData = true;
            }
            
            // Log combined values in development for debugging with allowZero flag
            if (window.location.hostname === 'localhost' && calculationContext) {
                console.log(`📊 Partner combination for ${calculationContext}:`, {
                    fields: fields.join(', '),
                    partner1Value,
                    partner2Value,
                    total,
                    hasValidPartnerData,
                    allowZero,
                    phase
                });
            }
            
            // Return combined total if we have valid partner data
            if (hasValidPartnerData || (allowZero && (partner1Value === 0 || partner2Value === 0))) {
                return total;
            }
            
            // In couple mode with no partner data, check if we should fall back to main fields
            if (!forcePartnerOnly && phase >= 2) {
                // Phase 2+: Try main fields as fallback
                const mainValue = getValueWithFallback(fields);
                if (mainValue !== defaultValue || (allowZero && mainValue === 0)) {
                    if (window.location.hostname === 'localhost') {
                        console.warn(`⚠️ Using main field value in couple mode for ${calculationContext}:`, mainValue);
                    }
                    return mainValue;
                }
            }
            
            return defaultValue;
        } else {
            // Single partner field request in couple mode
            const partnerFields = [];
            
            // Build comprehensive field list including mapping dictionary
            fields.forEach(field => {
                // Check if this is already a partner field
                if (field.includes('partner')) {
                    partnerFields.push(field);
                } else {
                    // Add partner variants
                    if (fieldMappingDictionary) {
                        // Check dictionary for partner1 variant
                        const partner1Key = `partner1${field.charAt(0).toUpperCase() + field.slice(1)}`;
                        if (fieldMappingDictionary[partner1Key]) {
                            partnerFields.push(...fieldMappingDictionary[partner1Key]);
                        }
                        // Check dictionary for partner2 variant
                        const partner2Key = `partner2${field.charAt(0).toUpperCase() + field.slice(1)}`;
                        if (fieldMappingDictionary[partner2Key]) {
                            partnerFields.push(...fieldMappingDictionary[partner2Key]);
                        }
                    }
                    
                    // Add standard partner field patterns
                    partnerFields.push(
                        `partner1${field.charAt(0).toUpperCase() + field.slice(1)}`,
                        `partner2${field.charAt(0).toUpperCase() + field.slice(1)}`,
                        `partner${field.charAt(0).toUpperCase() + field.slice(1)}`,
                        `partner1_${field}`,
                        `partner2_${field}`,
                        `partner_${field}`
                    );
                }
            });
            
            // Try to get value from partner fields first
            const partnerValue = getValueWithFallback(partnerFields);
            if (partnerValue !== defaultValue || (allowZero && partnerValue === 0)) {
                return partnerValue;
            }
            
            // In couple mode, optionally fall back to main fields
            if (!forcePartnerOnly && phase >= 2) {
                const mainValue = getValueWithFallback(fields);
                if (mainValue !== defaultValue || (allowZero && mainValue === 0)) {
                    if (window.location.hostname === 'localhost' && calculationContext) {
                        console.warn(`⚠️ Using main field in couple mode for ${calculationContext}:`, {
                            fields,
                            mainValue
                        });
                    }
                    return mainValue;
                }
            }
            
            return defaultValue;
        }
    } else {
        // Individual planning mode
        if (skipPartnerInSingleMode) {
            // Filter out partner-specific fields
            const nonPartnerFields = fields.filter(field => 
                !field.toLowerCase().includes('partner') &&
                !field.toLowerCase().includes('spouse')
            );
            
            if (nonPartnerFields.length > 0) {
                return getValueWithFallback(nonPartnerFields);
            }
        }
        
        // Standard field value retrieval
        return getValueWithFallback(fields);
    }
}

// Export functions
window.financialHealthFieldMapper = {
    getFieldValue
};

// Export directly for backward compatibility
window.getFieldValue = getFieldValue;

console.log('✅ Financial Health Field Mapper loaded');