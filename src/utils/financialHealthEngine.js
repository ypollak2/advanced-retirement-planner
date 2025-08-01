// Financial Health Engine - Unified scoring system with detailed breakdowns
// Created by Yali Pollak (יהלי פולק) - v7.3.8

/**
 * Comprehensive Financial Health Scoring Engine
 * Provides detailed breakdowns, actionable insights, and peer comparisons
 * Enhanced with GitHub Gist session storage for debugging
 */

// Import field mapping dictionary if available
let fieldMappingDictionary = null;
if (typeof window !== 'undefined' && window.fieldMappingDictionary) {
    fieldMappingDictionary = window.fieldMappingDictionary;
} else if (typeof require !== 'undefined') {
    try {
        fieldMappingDictionary = require('./fieldMappingDictionary.js');
    } catch (e) {
        // Field mapping not available - fallback to legacy behavior
    }
}

// Safe calculation wrappers to prevent NaN/Infinity values
function safeParseFloat(value, defaultValue = 0) {
    const parsed = parseFloat(value);
    if (isNaN(parsed) || !isFinite(parsed)) {
        return defaultValue;
    }
    return parsed;
}

function safeDivide(numerator, denominator, defaultValue = 0, context = '') {
    // Enhanced validation with better error context
    if (!denominator || denominator === 0 || isNaN(denominator) || !isFinite(denominator)) {
        if (context && window.location.hostname === 'localhost') {
            console.warn(`⚠️ SafeDivide: Division by zero/invalid in ${context}`, { numerator, denominator });
        }
        return { value: defaultValue, error: 'division_by_zero', context };
    }
    
    const num = safeParseFloat(numerator, 0);
    if (num === 0 && defaultValue === 0) {
        // Allow zero results when numerator is legitimately zero
        return { value: 0, error: null, context };
    }
    
    const result = num / denominator;
    if (isNaN(result) || !isFinite(result)) {
        if (context && window.location.hostname === 'localhost') {
            console.warn(`⚠️ SafeDivide: Invalid result in ${context}`, { numerator: num, denominator, result });
        }
        return { value: defaultValue, error: 'invalid_result', context };
    }
    
    return { value: result, error: null, context };
}

function safeMultiply(a, b, defaultValue = 0, context = '') {
    const numA = safeParseFloat(a, 0);
    const numB = safeParseFloat(b, 0);
    
    // Allow zero results when inputs are legitimately zero
    if ((numA === 0 || numB === 0) && defaultValue === 0) {
        return { value: 0, error: null, context };
    }
    
    const result = numA * numB;
    if (isNaN(result) || !isFinite(result)) {
        if (context && window.location.hostname === 'localhost') {
            console.warn(`⚠️ SafeMultiply: Invalid result in ${context}`, { a: numA, b: numB, result });
        }
        return { value: defaultValue, error: 'invalid_result', context };
    }
    
    return { value: result, error: null, context };
}

function safePercentage(value, total, defaultValue = 0, context = '') {
    if (!total || total === 0) {
        if (context && window.location.hostname === 'localhost') {
            console.warn(`⚠️ SafePercentage: Division by zero in ${context}`, { value, total });
        }
        return { value: defaultValue, error: 'division_by_zero', context };
    }
    
    const divResult = safeDivide(value * 100, total, defaultValue, `${context}_percentage`);
    return {
        value: typeof divResult === 'object' ? divResult.value : divResult,
        error: typeof divResult === 'object' ? divResult.error : null,
        context
    };
}

function clampValue(value, min, max) {
    const safeValue = safeParseFloat(value, min);
    return Math.max(min, Math.min(max, safeValue));
}

// Backward compatibility wrappers for safe functions
function safeDivideCompat(numerator, denominator, defaultValue = 0) {
    const result = safeDivide(numerator, denominator, defaultValue);
    return typeof result === 'object' ? result.value : result;
}

function safeMultiplyCompat(a, b, defaultValue = 0) {
    const result = safeMultiply(a, b, defaultValue);
    return typeof result === 'object' ? result.value : result;
}

function safePercentageCompat(value, total, defaultValue = 0) {
    const result = safePercentage(value, total, defaultValue);
    return typeof result === 'object' ? result.value : result;
}

// Calculate gross salary from net salary
function calculateGrossFromNet(netSalary, taxCountry = 'israel') {
    // Use binary search to find the gross salary that results in the given net salary
    let low = netSalary;
    let high = netSalary * 2.5; // Assume max tax rate won't exceed 60%
    let epsilon = 0.01; // Precision of 1 cent
    
    // If TaxCalculators is available, use it for accurate calculation
    if (window.TaxCalculators && window.TaxCalculators.calculateNetSalary) {
        while (high - low > epsilon) {
            const mid = (low + high) / 2;
            const calculated = window.TaxCalculators.calculateNetSalary(mid, taxCountry);
            const calculatedNet = calculated.netSalary;
            
            if (calculatedNet < netSalary) {
                low = mid;
            } else {
                high = mid;
            }
        }
        return Math.round((low + high) / 2);
    }
    
    // Fallback: Use simplified calculation based on average tax rates
    const avgTaxRates = {
        'israel': 0.25, // 25% average tax rate
        'uk': 0.28,
        'us': 0.24
    };
    
    const taxRate = avgTaxRates[taxCountry] || 0.25;
    return Math.round(netSalary / (1 - taxRate));
}

// Enhanced calculation wrapper that provides detailed error context
function enhancedSafeCalculation(calculationName, calculationFn) {
    try {
        const startTime = performance.now();
        const result = calculationFn();
        const endTime = performance.now();
        
        const calculationTime = Math.round(endTime - startTime);
        
        if (calculationTime > 50) {
            console.log(`⏱️ ${calculationName} took ${calculationTime}ms`);
        }
        
        return {
            success: true,
            result,
            calculationTime,
            error: null
        };
    } catch (error) {
        console.error(`❌ ${calculationName} failed:`, error);
        return {
            success: false,
            result: null,
            calculationTime: 0,
            error: error.message
        };
    }
}

// SIMPLIFIED: Field mapping utility using the field mapping bridge
function getFieldValue(inputs, fieldNames, options = {}) {
    const { combinePartners = false, allowZero = false, debugMode = true, expectString = false, combineMethod = 'sum' } = options;
    const logger = window.logger || { fieldSearch: () => {}, fieldFound: () => {}, debug: () => {} };
    
    // Use the field mapping bridge if available
    if (window.fieldMappingBridge) {
        logger.debug('Using field mapping bridge for enhanced field detection');
        
        // Try each field name using the bridge
        for (const fieldName of fieldNames) {
            const value = window.fieldMappingBridge.getFieldValue(inputs, fieldName, {
                ...options,
                combinePartners: combinePartners && inputs.planningType === 'couple'
            });
            
            if (value !== null && (allowZero || value !== 0)) {
                logger.fieldFound(`Found field "${fieldName}" via bridge: ${value}`);
                return value;
            }
        }
        
        // If no value found and we need to return something
        return allowZero ? 0 : null;
    }
    
    // Fallback to original implementation if bridge not available
    logger.fieldSearch(`Searching for fields: ${fieldNames.join(', ')}`);
    logger.debug(`Planning type: ${inputs.planningType}, Combine partners: ${combinePartners}, Expect string: ${expectString}`);
    
    // TICKET-009 FIX: Define string fields that should not be parsed as numbers
    const STRING_FIELDS = [
        'riskTolerance', 'riskProfile', 'investmentRisk', 'riskLevel',
        'taxCountry', 'country', 'taxLocation', 'location', 'countryCode',
        'planningType', 'rsuFrequency', 'currency', 'baseCurrency',
        'pensionFundProvider', 'bankName', 'insuranceProvider'
    ];
    
    // Helper function to process field value based on expected type
    const processFieldValue = (rawValue, fieldName) => {
        if (rawValue === undefined || rawValue === null || rawValue === '') {
            return null;
        }
        
        // Check if this is a string field or if we explicitly expect a string
        const isStringField = expectString || STRING_FIELDS.some(sf => 
            fieldName.toLowerCase().includes(sf.toLowerCase()) || 
            sf.toLowerCase().includes(fieldName.toLowerCase())
        );
        
        if (isStringField) {
            // For string fields, return the string value
            const stringValue = String(rawValue).toLowerCase().trim();
            logger.fieldFound(`Found string field ${fieldName}: "${stringValue}"`);
            return stringValue;
        } else {
            // For numeric fields, parse as number
            const numericValue = parseFloat(rawValue);
            if (!isNaN(numericValue) && (allowZero || numericValue > 0)) {
                logger.fieldFound(`Found numeric field ${fieldName}: ${numericValue}`);
                return numericValue;
            }
            return null;
        }
    };
    
    // PHASE 0.5: Direct E2E Test field mapping
    // Map common E2E test field names to standard patterns before normal lookup
    const e2eFieldMappings = {
        'currentMonthlySalary': ['currentMonthlySalary', 'monthlySalary', 'salary'],
        'current401k': ['current401k', 'current401K', '401k', '401K'],
        'currentCrypto': ['currentCrypto', 'cryptoValue', 'cryptocurrency'],
        'currentPersonalPortfolio': ['currentPersonalPortfolio', 'currentPortfolio', 'portfolio'],
        'currentBankAccount': ['currentBankAccount', 'bankAccount', 'savingsAccount'],
        'currentRealEstate': ['currentRealEstate', 'realEstate', 'propertyValue'],
        'monthlyAdditionalSavings': ['monthlyAdditionalSavings', 'additionalMonthlySavings', 'monthlyContribution'],
        'emergencyFund': ['emergencyFund', 'currentEmergencyFund', 'emergencySavings'],
        'currentPensionSavings': ['currentPensionSavings', 'pensionSavings', 'currentSavings']
    };
    
    // Check if any fieldName has a direct E2E mapping and if that field exists
    for (const fieldName of fieldNames) {
        if (e2eFieldMappings[fieldName]) {
            for (const e2eField of e2eFieldMappings[fieldName]) {
                if (inputs[e2eField] !== undefined) {
                    const processedValue = processFieldValue(inputs[e2eField], e2eField);
                    if (processedValue !== null) {
                        return processedValue;
                    }
                }
            }
        }
    }
    
    // Also check if inputs contain E2E field names that match our target patterns
    for (const [e2eField, mappings] of Object.entries(e2eFieldMappings)) {
        if (inputs[e2eField] !== undefined && fieldNames.some(f => mappings.includes(f))) {
            const processedValue = processFieldValue(inputs[e2eField], e2eField);
            if (processedValue !== null) {
                return processedValue;
            }
        }
    }

    // PHASE 0: Use field mapping dictionary if available
    if (fieldMappingDictionary && fieldMappingDictionary.FIELD_MAPPINGS) {
        logger.debug('Using field mapping dictionary for enhanced field detection');
        
        // Try to find fields using the mapping dictionary
        for (const fieldName of fieldNames) {
            // Check all possible variations from the dictionary
            const canonicalField = fieldMappingDictionary.findCanonicalField(fieldName);
            if (canonicalField) {
                const variations = fieldMappingDictionary.getFieldVariations(canonicalField);
                
                for (const variation of variations) {
                    const value = inputs[variation];
                    if (value !== undefined && value !== null && value !== '') {
                        const parsed = parseFloat(value);
                        if (!isNaN(parsed) && (allowZero || parsed > 0)) {
                            logger.fieldFound(`Found field "${variation}" (mapped from "${fieldName}"): ${parsed}`);
                            return parsed;
                        }
                    }
                }
            }
            
            // Also try to find a suggested field based on available fields
            const suggestion = fieldMappingDictionary.suggestFieldName(fieldName, Object.keys(inputs));
            if (suggestion) {
                const value = inputs[suggestion];
                if (value !== undefined && value !== null && value !== '') {
                    const parsed = parseFloat(value);
                    if (!isNaN(parsed) && (allowZero || parsed > 0)) {
                        logger.fieldFound(`Found suggested field "${suggestion}" for "${fieldName}": ${parsed}`);
                        return parsed;
                    }
                }
            }
        }
    }
    
    // Helper function to detect and convert salary values
    const detectSalaryType = (fieldName, value) => {
        const lowerField = fieldName.toLowerCase();
        let finalValue = value;
        
        // If value seems too high for monthly (> 50k), likely annual - convert to monthly
        if (value > 50000 && (lowerField.includes('monthly') || !lowerField.includes('annual'))) {
            logger.debug(`Converting suspected annual salary to monthly: ${value} -> ${value/12}`);
            finalValue = value / 12;
        }
        
        // For savings rate calculation, we need GROSS income
        // If field name indicates NET salary, convert to gross
        if (lowerField.includes('net') && !lowerField.includes('gross')) {
            const taxCountry = inputs.taxCountry || 'israel';
            const grossValue = calculateGrossFromNet(finalValue, taxCountry);
            logger.debug(`Converting net salary to gross: ${finalValue} -> ${grossValue} (${taxCountry})`);
            return grossValue;
        }
        
        return finalValue;
    };
    
    // PHASE 1: Direct field lookup with enhanced validation and salary conversion
    // Skip Phase 1 entirely if we need to combine partners
    if (!(combinePartners && inputs.planningType === 'couple')) {
        for (const fieldName of fieldNames) {
            const value = inputs[fieldName];
            logger.debug(`  Checking field "${fieldName}": ${value} (type: ${typeof value})`);
            
            if (value !== undefined && value !== null && value !== '') {
                const parsed = parseFloat(value);
                if (!isNaN(parsed) && (allowZero || parsed > 0)) {
                    const convertedValue = detectSalaryType(fieldName, parsed);
                    logger.fieldFound(`Found valid field "${fieldName}": ${convertedValue}`);
                    return convertedValue;
                } else {
                    logger.debug(`  Field "${fieldName}" exists but value invalid: ${parsed}`);
                }
            }
        }
    } else {
        logger.debug(`Skipping Phase 1 direct lookup to combine partners...`);
    }
    
    // PHASE 1.5: Enhanced wizard step-specific field detection
    // Skip Phase 1.5 entirely if we need to combine partners
    if (!(combinePartners && inputs.planningType === 'couple')) {
        logger.debug(`Checking wizard step-specific patterns...`);
        
        // Check for step-based field structures (step1, step2, etc.)
        for (let stepNum = 1; stepNum <= 10; stepNum++) {
            const stepData = inputs[`step${stepNum}`];
            if (stepData && typeof stepData === 'object') {
                for (const fieldName of fieldNames) {
                    const stepValue = stepData[fieldName];
                    if (stepValue !== undefined && stepValue !== null && stepValue !== '') {
                        const parsed = parseFloat(stepValue);
                        if (!isNaN(parsed) && (allowZero || parsed > 0)) {
                            logger.fieldFound(`Found in step${stepNum}.${fieldName}: ${parsed}`);
                            return parsed;
                        }
                    }
                }
            }
        }
    } else {
        logger.debug(`Skipping Phase 1.5 wizard steps to combine partners...`);
    }
    
    // PHASE 2: Enhanced partner field combination for couple mode
    if (combinePartners && inputs.planningType === 'couple') {
        logger.debug(`Attempting to combine partner fields with enhanced detection...`);
        let combinedValue = 0;
        let partnersFound = 0;
        
        // Enhanced partner field detection with comprehensive patterns
        const partnerFieldMappings = [];
        
        // Determine which field types we're looking for based on input field names
        const isLookingForBank = fieldNames.some(f => f.toLowerCase().includes('bank') || f.toLowerCase().includes('emergency'));
        const isLookingForSalary = fieldNames.some(f => f.toLowerCase().includes('salary') || f.toLowerCase().includes('income'));
        const isLookingForPensionRate = fieldNames.some(f => f.toLowerCase().includes('pension') && (f.toLowerCase().includes('rate') || f.toLowerCase().includes('contribution')));
        const isLookingForTrainingRate = fieldNames.some(f => f.toLowerCase().includes('training') && (f.toLowerCase().includes('rate') || f.toLowerCase().includes('contribution')));
        
        if (isLookingForBank) {
            partnerFieldMappings.push(
                { partner1: 'partner1BankAccount', partner2: 'partner2BankAccount' },
                { partner1: 'partner1Bank', partner2: 'partner2Bank' },
                { partner1: 'partner1Emergency', partner2: 'partner2Emergency' }
            );
        }
        
        if (isLookingForPensionRate) {
            partnerFieldMappings.push(
                { partner1: 'partner1PensionEmployeeRate', partner2: 'partner2PensionEmployeeRate' },
                { partner1: 'partner1PensionContributionRate', partner2: 'partner2PensionContributionRate' },
                { partner1: 'partner1PensionRate', partner2: 'partner2PensionRate' }
            );
        }
        
        if (isLookingForTrainingRate) {
            partnerFieldMappings.push(
                { partner1: 'partner1TrainingFundEmployeeRate', partner2: 'partner2TrainingFundEmployeeRate' },
                { partner1: 'partner1TrainingFundContributionRate', partner2: 'partner2TrainingFundContributionRate' },
                { partner1: 'partner1TrainingFundRate', partner2: 'partner2TrainingFundRate' }
            );
        }
        
        if (isLookingForSalary || partnerFieldMappings.length === 0) {
            partnerFieldMappings.push(
                // Net salary fields (PRIORITIZE THESE)
                { partner1: 'partner1NetSalary', partner2: 'partner2NetSalary' },
                { partner1: 'partner1NetIncome', partner2: 'partner2NetIncome' },
                // Gross salary fields
                { partner1: 'partner1GrossSalary', partner2: 'partner2GrossSalary' },
                { partner1: 'partner1Salary', partner2: 'partner2Salary' },
                { partner1: 'Partner1Salary', partner2: 'Partner2Salary' },
                { partner1: 'partner1Income', partner2: 'partner2Income' },
                { partner1: 'partner1MonthlySalary', partner2: 'partner2MonthlySalary' },
                { partner1: 'partner_1_salary', partner2: 'partner_2_salary' },
                { partner1: 'partnerOneSalary', partner2: 'partnerTwoSalary' }
            );
        }
        
        // Also check in wizard step structures
        for (let stepNum = 1; stepNum <= 10; stepNum++) {
            const stepData = inputs[`step${stepNum}`];
            if (stepData && typeof stepData === 'object') {
                for (const mapping of partnerFieldMappings) {
                    const p1Value = parseFloat(stepData[mapping.partner1] || 0);
                    const p2Value = parseFloat(stepData[mapping.partner2] || 0);
                    
                    if (!isNaN(p1Value) && p1Value > 0) {
                        combinedValue += p1Value;
                        partnersFound++;
                        logger.debug(`  Added step${stepNum}.${mapping.partner1}: ${p1Value}`);
                    }
                    
                    if (!isNaN(p2Value) && p2Value > 0) {
                        combinedValue += p2Value;
                        partnersFound++;
                        logger.debug(`  Added step${stepNum}.${mapping.partner2}: ${p2Value}`);
                    }
                    
                    if (partnersFound > 0) break;
                }
                if (partnersFound > 0) break;
            }
        }
        
        // If no step data found, try direct fields
        if (partnersFound === 0) {
            for (const mapping of partnerFieldMappings) {
                const p1Value = parseFloat(inputs[mapping.partner1] || 0);
                const p2Value = parseFloat(inputs[mapping.partner2] || 0);
                
                if (!isNaN(p1Value) && p1Value > 0) {
                    const convertedP1 = detectSalaryType(mapping.partner1, p1Value);
                    combinedValue += convertedP1;
                    partnersFound++;
                    logger.debug(`  Added ${mapping.partner1}: ${convertedP1}`);
                }
                
                if (!isNaN(p2Value) && p2Value > 0) {
                    const convertedP2 = detectSalaryType(mapping.partner2, p2Value);
                    combinedValue += convertedP2;
                    partnersFound++;
                    logger.debug(`  Added ${mapping.partner2}: ${convertedP2}`);
                }
                
                // If we found data, don't keep looking in other mappings
                if (partnersFound > 0) break;
            }
        }
        
        if (combinedValue > 0) {
            // For rates (percentages), average the values instead of summing
            if (combineMethod === 'average' && partnersFound > 1) {
                combinedValue = combinedValue / partnersFound;
                logger.fieldFound(`Averaged ${partnersFound} partner fields: ${combinedValue}`);
            } else {
                logger.fieldFound(`Combined ${partnersFound} partner fields: ${combinedValue}`);
            }
            return combinedValue;
        } else {
            logger.debug(`  No valid partner field data found in any structure`);
        }
    }
    
    // PHASE 3: Enhanced fallback attempts with comprehensive field patterns
    logger.debug(`Trying enhanced fallback field patterns...`);
    const fallbackPatterns = [];
    
    // Generate comprehensive fallback patterns based on original field names
    fieldNames.forEach(fieldName => {
        const lowerField = fieldName.toLowerCase();
        
        // For salary fields, try ALL variations
        if (lowerField.includes('salary') || lowerField.includes('income')) {
            fallbackPatterns.push(
                'monthlySalary', 'grossSalary', 'currentSalary', 'salary', 'income', 'monthlyIncome',
                'currentMonthlySalary', 'monthly_salary', 'gross_salary', 'current_salary',
                'netSalary', 'baseSalary', 'annualSalary', 'yearlyIncome', 'totalIncome',
                'monthlyIncomeAmount', 'mainMonthlySalary', 'mainSalary',
                // Partner variations
                'partner1Salary', 'partner2Salary', 'Partner1Salary', 'Partner2Salary',
                'partner1Income', 'partner2Income', 'partner1MonthlySalary', 'partner2MonthlySalary'
            );
        }
        
        // For contribution fields, try ALL variations
        if (lowerField.includes('pension') && (lowerField.includes('rate') || lowerField.includes('contribution'))) {
            fallbackPatterns.push(
                'pensionRate', 'pension_rate', 'employeePensionRate', 'pensionEmployeeRate',
                'pensionContributionRate', 'pension_contribution_rate', 'pensionEmployee',
                'pensionRateEmployee', 'employee_pension_rate', 'employeePension'
            );
        }
        
        if (lowerField.includes('training') && (lowerField.includes('rate') || lowerField.includes('contribution'))) {
            fallbackPatterns.push(
                'trainingFundRate', 'training_fund_rate', 'employeeTrainingFundRate', 'trainingFundEmployeeRate',
                'trainingFundContributionRate', 'training_fund_contribution_rate', 'trainingFundEmployee',
                'trainingRateEmployee', 'employee_training_fund_rate', 'employeeTrainingFund'
            );
        }
        
        // For asset fields, try ALL variations
        if (lowerField.includes('current') && lowerField.includes('saving')) {
            fallbackPatterns.push(
                'currentSavings', 'totalSavings', 'savings', 'currentSavingsAmount',
                'pensionSavings', 'retirementSavings', 'totalCurrentSavings'
            );
        }
        
        // For portfolio fields from E2E tests
        if (lowerField.includes('portfolio')) {
            fallbackPatterns.push(
                'currentPortfolio', 'currentPersonalPortfolio', 'personalPortfolio', 'portfolio',
                'portfolioValue', 'currentPortfolioValue', 'stockPortfolio', 'investmentPortfolio',
                'partnerPortfolio', 'partner1Portfolio', 'partner2Portfolio'
            );
        }
        
        // For crypto fields from E2E tests
        if (lowerField.includes('crypto')) {
            fallbackPatterns.push(
                'currentCrypto', 'cryptoValue', 'cryptocurrency', 'cryptoPortfolio',
                'currentCryptocurrency', 'cryptoInvestments', 'cryptoHoldings'
            );
        }
        
        // For bank account fields from E2E tests
        if (lowerField.includes('bank') || lowerField.includes('account')) {
            fallbackPatterns.push(
                'currentBankAccount', 'bankAccount', 'savingsAccount', 'currentSavingsAccount',
                'cashSavings', 'currentCash', 'liquidSavings', 'checkingAccount'
            );
        }
        
        // For real estate fields from E2E tests
        if (lowerField.includes('real') || lowerField.includes('estate') || lowerField.includes('property')) {
            fallbackPatterns.push(
                'currentRealEstate', 'realEstate', 'realEstateValue', 'currentRealEstateValue',
                'propertyValue', 'currentProperty', 'realEstateInvestments'
            );
        }
        
        // For 401k fields from E2E tests
        if (lowerField.includes('401k') || lowerField.includes('401')) {
            fallbackPatterns.push(
                'current401k', 'current401K', 'retirement401k', '401kBalance',
                '401k', '401K', 'fourOhOneK'
            );
        }
        
        // For monthly savings fields from E2E tests
        if (lowerField.includes('monthly') && lowerField.includes('savings')) {
            fallbackPatterns.push(
                'monthlyAdditionalSavings', 'additionalMonthlySavings', 'extraSavings',
                'monthlyContribution', 'monthlyContributions', 'monthlySavings',
                'totalMonthlyContributions', 'currentMonthlyContribution'
            );
        }
        
        if (lowerField.includes('emergency')) {
            fallbackPatterns.push(
                'emergencyFund', 'emergencyFundAmount', 'currentBankAccount', 'currentSavingsAccount', 'liquidSavings',
                'cashReserves', 'savingsAccount', 'emergency_fund', 'current_savings_account',
                // Add wizard-specific emergency fund patterns
                'currentSavings', 'savingsAccountBalance', 'emergencySavings', 'currentCashSavings',
                'bankAccount', 'partner1BankAccount', 'partner2BankAccount'
            );
        }
        
        if (lowerField.includes('portfolio') || lowerField.includes('personal')) {
            fallbackPatterns.push(
                'currentPersonalPortfolio', 'personalPortfolio', 'portfolioValue', 'investments',
                'currentInvestments', 'stocksAndBonds', 'securities', 'marketInvestments'
            );
        }
        
        if (lowerField.includes('real') && lowerField.includes('estate')) {
            fallbackPatterns.push(
                'currentRealEstate', 'realEstate', 'realEstateValue', 'propertyValue',
                'currentProperty', 'realEstateInvestments', 'real_estate', 'property'
            );
        }
        
        if (lowerField.includes('crypto')) {
            fallbackPatterns.push(
                'currentCrypto', 'currentCryptoFiatValue', 'cryptoValue', 'cryptocurrency',
                'digitalAssets', 'crypto_value', 'currentCryptocurrency'
            );
        }
    });
    
    // Remove duplicates and try fallback patterns with salary conversion
    const uniqueFallbacks = [...new Set(fallbackPatterns)];
    for (const fallbackField of uniqueFallbacks) {
        const value = inputs[fallbackField];
        if (value !== undefined && value !== null && value !== '') {
            const parsed = parseFloat(value);
            if (!isNaN(parsed) && (allowZero || parsed > 0)) {
                const convertedValue = detectSalaryType(fallbackField, parsed);
                logger.fieldFound(`Found fallback field "${fallbackField}": ${convertedValue}`);
                return convertedValue;
            }
        }
    }
    
    // PHASE 4: Special handling for wizard-specific field structures
    logger.debug(`Checking wizard-specific field structures...`);
    
    // Try to extract from nested structures
    if (inputs.expenses && typeof inputs.expenses === 'object') {
        // For debt/expense related fields
        if (fieldNames.some(field => field.toLowerCase().includes('debt') || field.toLowerCase().includes('expense'))) {
            const expenseCategories = ['mortgage', 'carLoan', 'creditCard', 'otherDebt'];
            let totalDebt = 0;
            expenseCategories.forEach(category => {
                const categoryValue = parseFloat(inputs.expenses[category] || 0);
                if (!isNaN(categoryValue)) totalDebt += categoryValue;
            });
            if (totalDebt > 0) {
                logger.fieldFound(`Found debt from expenses structure: ${totalDebt}`);
                return totalDebt;
            }
        }
    }
    
    // Try to extract from portfolio allocations for risk-related fields
    if (inputs.portfolioAllocations && Array.isArray(inputs.portfolioAllocations)) {
        if (fieldNames.some(field => field.toLowerCase().includes('stock') || field.toLowerCase().includes('equity'))) {
            const stockAllocation = inputs.portfolioAllocations.find(allocation => 
                allocation && allocation.index && 
                (allocation.index.toLowerCase().includes('stock') || 
                 allocation.index.toLowerCase().includes('equity') ||
                 allocation.index.toLowerCase().includes('shares'))
            );
            if (stockAllocation && stockAllocation.percentage) {
                const stockPercentage = parseFloat(stockAllocation.percentage);
                if (!isNaN(stockPercentage)) {
                    logger.fieldFound(`Found stock percentage from portfolio allocations: ${stockPercentage}`);
                    return stockPercentage;
                }
            }
        }
    }
    
    // Enhanced fallback logging for better debugging
    // Only warn if field mapping dictionary is not available or didn't help
    if (!fieldMappingDictionary || !fieldMappingDictionary.FIELD_MAPPINGS) {
        console.warn(`⚠️ Fallback Activated: No value found for fields: [${fieldNames.join(', ')}]. Defaulting to 0.`);
        console.log(`🕵️‍♂️ Debug Info: Available input keys: [${Object.keys(inputs).join(', ')}]`);
    } else {
        // With field mapping dictionary, this is a genuine missing field
        if (debugMode) {
            console.log(`📊 Field not found in inputs: [${fieldNames.join(', ')}]`);
            console.log(`📋 Available fields: [${Object.keys(inputs).slice(0, 10).join(', ')}${Object.keys(inputs).length > 10 ? '...' : ''}]`);
            
            // Suggest possible fields from the dictionary
            const suggestions = [];
            fieldNames.forEach(field => {
                const suggestion = fieldMappingDictionary.suggestFieldName(field, Object.keys(inputs));
                if (suggestion) {
                    suggestions.push(`${field} → ${suggestion}`);
                }
            });
            
            if (suggestions.length > 0) {
                console.log(`💡 Suggestions: ${suggestions.join(', ')}`);
            }
        }
    }

    // Log a more detailed warning if critical fields are missing
    const criticalFields = ['salary', 'income', 'pension', 'savings', 'emergency', 'portfolio'];
    if (fieldNames.some(f => criticalFields.some(c => f.toLowerCase().includes(c)))) {
        if (!fieldMappingDictionary) {
            console.warn(`CRITICAL: A key financial field was not found. This will significantly impact score accuracy.`);
        }
    }
    
    return allowZero ? 0 : null;
}

// Score factor definitions with weights and benchmarks
const SCORE_FACTORS = {
    savingsRate: {
        weight: 25,
        name: 'Savings Rate',
        description: 'Percentage of income saved monthly',
        benchmarks: {
            excellent: 20,  // 20%+ savings rate
            good: 15,       // 15%+ savings rate  
            fair: 10,       // 10%+ savings rate
            poor: 5         // 5%+ savings rate
        }
    },
    retirementReadiness: {
        weight: 20,
        name: 'Retirement Readiness',
        description: 'Current savings vs age-appropriate targets',
        benchmarks: {
            excellent: 1.5,  // 1.5x target savings
            good: 1.0,       // 1.0x target savings
            fair: 0.7,       // 0.7x target savings
            poor: 0.4        // 0.4x target savings
        }
    },
    timeHorizon: {
        weight: 15,
        name: 'Time to Retirement',
        description: 'Years remaining until retirement',
        benchmarks: {
            excellent: 30,   // 30+ years
            good: 20,        // 20+ years
            fair: 10,        // 10+ years
            poor: 5          // 5+ years
        }
    },
    riskAlignment: {
        weight: 12,
        name: 'Risk Alignment',
        description: 'Investment allocation matches age and goals',
        benchmarks: {
            excellent: 95,   // 95%+ alignment score
            good: 85,        // 85%+ alignment score
            fair: 70,        // 70%+ alignment score
            poor: 50         // 50%+ alignment score
        }
    },
    diversification: {
        weight: 10,
        name: 'Portfolio Diversification',
        description: 'Spread across multiple asset classes',
        benchmarks: {
            excellent: 4,    // 4+ asset classes
            good: 3,         // 3+ asset classes
            fair: 2,         // 2+ asset classes
            poor: 1          // 1+ asset class
        }
    },
    taxEfficiency: {
        weight: 8,
        name: 'Tax Optimization',
        description: 'Effective use of tax-advantaged accounts',
        benchmarks: {
            excellent: 90,   // 90%+ tax efficiency
            good: 75,        // 75%+ tax efficiency
            fair: 60,        // 60%+ tax efficiency
            poor: 40         // 40%+ tax efficiency
        }
    },
    emergencyFund: {
        weight: 7,
        name: 'Emergency Fund',
        description: 'Months of expenses covered',
        benchmarks: {
            excellent: 8,    // 8+ months
            good: 6,         // 6+ months
            fair: 3,         // 3+ months
            poor: 1          // 1+ month
        }
    },
    debtManagement: {
        weight: 3,
        name: 'Debt Management',
        description: 'Debt-to-income ratio and high-interest debt',
        benchmarks: {
            excellent: 0.1,  // <10% debt-to-income
            good: 0.2,       // <20% debt-to-income
            fair: 0.3,       // <30% debt-to-income
            poor: 0.5        // <50% debt-to-income
        }
    }
};

// Age-based peer comparison data
const PEER_BENCHMARKS = {
    '20-29': { averageScore: 45, topQuartile: 65 },
    '30-39': { averageScore: 55, topQuartile: 75 },
    '40-49': { averageScore: 65, topQuartile: 80 },
    '50-59': { averageScore: 70, topQuartile: 85 },
    '60+': { averageScore: 75, topQuartile: 90 }
};

// Country-specific adjustments
const COUNTRY_FACTORS = {
    'ISR': { socialSecurityWeight: 0.8, taxAdvantageBonus: 5 },
    'USA': { socialSecurityWeight: 0.6, taxAdvantageBonus: 8 },
    'GBR': { socialSecurityWeight: 0.5, taxAdvantageBonus: 6 },
    'EUR': { socialSecurityWeight: 0.7, taxAdvantageBonus: 4 }
};

/**
 * Calculate savings rate score
 */
function calculateSavingsRateScore(inputs) {
    console.log('🔍 === CALCULATING SAVINGS RATE SCORE ===');
    console.log('📋 Input planning type:', inputs.planningType);
    console.log('📋 Available fields:', Object.keys(inputs).length);
    
    // PHASE 1: Get monthly income using simplified field mapping
    let monthlyIncome = 0;
    
    if (inputs.planningType === 'couple') {
        console.log('👫 Couple mode: Looking for partner salary fields...');
        
        // Use field mapping bridge for couple income
        if (window.fieldMappingBridge) {
            monthlyIncome = window.fieldMappingBridge.getCombinedPartnerValue(inputs, 'Salary', { allowZero: true });
        }
        
        // Fallback to legacy method if no income found
        if (!monthlyIncome) {
            monthlyIncome = getFieldValue(inputs, [
                'partner1Salary', 'partner2Salary', 'Partner1Salary', 'Partner2Salary',
                'partner1Income', 'partner2Income', 'partner1MonthlySalary', 'partner2MonthlySalary'
            ], { combinePartners: true, debugMode: true });
        }
        
        console.log('👫 Combined partner income:', monthlyIncome);
        
    } else {
        console.log('👤 Individual mode: Looking for salary fields...');
        
        // Use field mapping bridge for individual income
        if (window.fieldMappingBridge) {
            monthlyIncome = window.fieldMappingBridge.findFieldValue(inputs, 'monthlySalary', { allowZero: true }) || 0;
        }
        
        // Fallback to legacy method if no income found
        if (!monthlyIncome) {
            monthlyIncome = getFieldValue(inputs, [
                'currentMonthlySalary', 'monthlySalary', 'salary', 'monthlyIncome'
            ], { debugMode: true });
        }
        
        console.log('👤 Individual income:', monthlyIncome);
    }
    
    // PHASE 1.5: Add RSU income if available
    let monthlyRSUIncome = 0;
    if (inputs.rsuUnits && inputs.rsuCurrentStockPrice) {
        const rsuUnits = safeParseFloat(inputs.rsuUnits, 0);
        const stockPrice = safeParseFloat(inputs.rsuCurrentStockPrice, 0);
        const frequency = inputs.rsuFrequency || 'quarterly';
        
        // Calculate monthly RSU income based on frequency
        if (frequency === 'monthly') {
            monthlyRSUIncome = rsuUnits * stockPrice;
        } else if (frequency === 'quarterly') {
            monthlyRSUIncome = (rsuUnits * stockPrice * 4) / 12; // Convert annual to monthly
        } else if (frequency === 'yearly' || frequency === 'annual') {
            monthlyRSUIncome = (rsuUnits * stockPrice) / 12; // Convert annual to monthly
        }
        
        console.log(`💰 RSU Income: ${rsuUnits} units × $${stockPrice} (${frequency}) = $${monthlyRSUIncome.toFixed(2)}/month`);
        
        // Handle currency conversion if needed
        if (inputs.currency === 'ILS' && monthlyRSUIncome > 0) {
            // RSUs are typically in USD, convert to ILS if base currency is ILS
            const usdToILS = 3.5; // Default exchange rate, should ideally come from inputs.exchangeRates
            const convertedRSUIncome = monthlyRSUIncome * usdToILS;
            console.log(`💱 Converting RSU income: $${monthlyRSUIncome.toFixed(2)} USD = ₪${convertedRSUIncome.toFixed(2)} ILS`);
            monthlyRSUIncome = convertedRSUIncome;
        }
        
        // Add RSU income to total monthly income
        monthlyIncome += monthlyRSUIncome;
        console.log(`💰 Total monthly income with RSUs: ${monthlyIncome}`);
    } else {
        console.log('💰 No RSU income found');
    }
    
    // PHASE 1.6: Add bonus and other income if available
    let monthlyBonusIncome = 0;
    let monthlyOtherIncome = 0;
    
    if (inputs.planningType === 'couple') {
        // Partner bonus income
        const partner1Bonus = safeParseFloat(inputs.partner1BonusAmount, 0);
        const partner2Bonus = safeParseFloat(inputs.partner2BonusAmount, 0);
        monthlyBonusIncome = (partner1Bonus + partner2Bonus) / 12; // Convert annual to monthly
        
        // Partner other income
        const partner1Other = safeParseFloat(inputs.partner1OtherIncome, 0);
        const partner2Other = safeParseFloat(inputs.partner2OtherIncome, 0);
        monthlyOtherIncome = (partner1Other + partner2Other) / 12; // Convert annual to monthly
        
        console.log(`💰 Bonus Income: Partner1: ₪${partner1Bonus}/year, Partner2: ₪${partner2Bonus}/year = ₪${monthlyBonusIncome.toFixed(2)}/month`);
        console.log(`💰 Other Income: Partner1: ₪${partner1Other}/year, Partner2: ₪${partner2Other}/year = ₪${monthlyOtherIncome.toFixed(2)}/month`);
    } else {
        // Individual bonus income
        const bonusAmount = safeParseFloat(inputs.bonusAmount || inputs.annualBonus || inputs.yearlyBonus, 0);
        monthlyBonusIncome = bonusAmount / 12; // Convert annual to monthly
        
        // Individual other income
        const otherIncome = safeParseFloat(inputs.otherIncome || inputs.additionalIncome, 0);
        monthlyOtherIncome = otherIncome / 12; // Convert annual to monthly
        
        console.log(`💰 Bonus Income: ₪${bonusAmount}/year = ₪${monthlyBonusIncome.toFixed(2)}/month`);
        console.log(`💰 Other Income: ₪${otherIncome}/year = ₪${monthlyOtherIncome.toFixed(2)}/month`);
    }
    
    // Add bonus and other income to total
    monthlyIncome += monthlyBonusIncome + monthlyOtherIncome;
    console.log(`💰 Total monthly income with all sources: ₪${monthlyIncome.toFixed(2)}`);
    
    // CRITICAL: If income is still 0, this is the problem
    if (monthlyIncome === 0) {
        console.error('❌ SAVINGS RATE ISSUE: Monthly income is 0!');
        console.log('🔍 Available input fields:', Object.keys(inputs));
        console.log('🔍 Salary fields found:', Object.keys(inputs).filter(k => 
            k.toLowerCase().includes('salary') || k.toLowerCase().includes('income')
        ));
        return {
            score: 0,
            details: {
                status: 'missing_income_data',
                calculationMethod: 'enhanced_field_mapping',
                monthlyIncome: 0,
                monthlyRSUIncome: 0,
                debugInfo: {
                    totalInputFields: Object.keys(inputs).length,
                    salaryFieldsFound: Object.keys(inputs).filter(k => 
                        k.toLowerCase().includes('salary') || k.toLowerCase().includes('income')
                    ),
                    reason: 'No valid income fields found in inputs'
                }
            }
        };
    }
    
    // PHASE 2: Get contribution rates with enhanced field detection
    console.log('💰 Looking for contribution rates...');
    console.log('💰 Current monthly income for savings rate calculation:', monthlyIncome);
    
    let pensionRate = 0;
    let trainingFundRate = 0;
    
    if (window.fieldMappingBridge) {
        if (inputs.planningType === 'couple') {
            // Get combined partner rates using average
            pensionRate = window.fieldMappingBridge.getCombinedPartnerValue(inputs, 'PensionRate', { 
                allowZero: true, 
                combineMethod: 'average' 
            });
        } else {
            // Get individual rates
            pensionRate = window.fieldMappingBridge.findFieldValue(inputs, 'pensionEmployeeRate', { allowZero: true }) || 0;
        }
    }
    
    // Fallback to legacy method if rates not found
    if (!pensionRate) {
        pensionRate = getFieldValue(inputs, [
            'pensionContributionRate', 'pensionEmployeeRate', 'pensionEmployee',
            'employeePensionRate', 'pension_contribution_rate', 'pension_rate',
            'pensionEmployeeContribution', 'employeePensionContribution'
        ], { debugMode: true, combinePartners: inputs.planningType === 'couple', combineMethod: 'average' });
    }
    
    // Get training fund rate
    if (window.fieldMappingBridge) {
        if (inputs.planningType === 'couple') {
            trainingFundRate = window.fieldMappingBridge.getCombinedPartnerValue(inputs, 'TrainingRate', { 
                allowZero: true, 
                combineMethod: 'average' 
            });
        } else {
            trainingFundRate = window.fieldMappingBridge.findFieldValue(inputs, 'trainingFundEmployeeRate', { allowZero: true }) || 0;
        }
    }
    
    // Fallback to legacy method if rates not found
    if (!trainingFundRate) {
        trainingFundRate = getFieldValue(inputs, [
            'trainingFundContributionRate', 'trainingFundEmployeeRate', 'trainingFundEmployee',
            'employeeTrainingFundRate', 'training_fund_rate', 'trainingFund_rate',
            'trainingFundEmployeeContribution', 'employeeTrainingFundContribution'
        ], { debugMode: true, combinePartners: inputs.planningType === 'couple', combineMethod: 'average' });
    }
    
    // Use default rates if not found (standard Israeli rates)
    const DEFAULT_PENSION_RATE = 17.5;  // Standard employee + employer pension contribution
    const DEFAULT_TRAINING_FUND_RATE = 7.5;  // Standard employee + employer training fund
    
    const finalPensionRate = pensionRate || DEFAULT_PENSION_RATE;
    const finalTrainingFundRate = trainingFundRate || DEFAULT_TRAINING_FUND_RATE;
    
    console.log('💰 Contribution rates:', {
        pension: finalPensionRate,
        trainingFund: finalTrainingFundRate,
        total: finalPensionRate + finalTrainingFundRate,
        usingDefaults: !pensionRate || !trainingFundRate
    });
    
    // PHASE 3: Calculate monthly contributions
    let monthlyContributions = 0;
    let calculationMethod = 'none';
    
    if (monthlyIncome > 0) {
        // Method 1: Calculate from rates
        monthlyContributions = monthlyIncome * (finalPensionRate + finalTrainingFundRate) / 100;
        calculationMethod = 'calculated_from_rates';
        
        // Add additional monthly savings if available
        const additionalSavings = getFieldValue(inputs, [
            'additionalMonthlySavings', 'monthlyAdditionalSavings', 'extraSavings'
        ], { allowZero: true, debugMode: true });
        
        monthlyContributions += additionalSavings;
        console.log('💰 Contributions calculated from rates:', {
            monthlyIncome,
            totalRate: finalPensionRate + finalTrainingFundRate,
            calculatedContributions: monthlyIncome * (finalPensionRate + finalTrainingFundRate) / 100,
            additionalSavings,
            totalContributions: monthlyContributions
        });
        
    } else {
        // Method 2: Try to get direct monthly contribution amount
        monthlyContributions = getFieldValue(inputs, [
            'monthlyContribution', 'monthlyContributions', 'monthlySavings',
            'totalMonthlyContributions', 'currentMonthlyContribution'
        ], { allowZero: true, debugMode: true });
        
        calculationMethod = monthlyContributions > 0 ? 'direct_amount' : 'none';
        console.log('💰 Direct monthly contributions:', monthlyContributions);
    }
    
    // PHASE 4: Comprehensive validation with enhanced debugging
    console.log('🔍 Validating calculation inputs...');
    
    if (monthlyIncome === 0 || isNaN(monthlyIncome)) {
        console.warn('❌ FINANCIAL HEALTH SCORE: No monthly income found');
        console.warn('🔍 Available income-related fields:', Object.keys(inputs).filter(key => 
            key.toLowerCase().includes('salary') || key.toLowerCase().includes('income')
        ));
        console.warn('📋 Planning type:', inputs.planningType);
        
        const availableIncomeFields = Object.keys(inputs).filter(key => 
            key.toLowerCase().includes('salary') || key.toLowerCase().includes('income')
        );
        
        const missingFieldSuggestions = [];
        if (inputs.planningType === 'couple') {
            if (!inputs.partner1Salary && !inputs.Partner1Salary) missingFieldSuggestions.push('partner1Salary');
            if (!inputs.partner2Salary && !inputs.Partner2Salary) missingFieldSuggestions.push('partner2Salary');
        } else {
            if (!inputs.currentMonthlySalary) missingFieldSuggestions.push('currentMonthlySalary');
        }
        
        return { 
            score: 0, 
            details: { 
                rate: 0, 
                status: 'missing_income_data', 
                monthlyAmount: 0,
                calculationMethod: 'failed_no_income',
                debugInfo: {
                    phase: 'income_detection',
                    reason: 'No monthly income data found in any expected fields',
                    planningType: inputs.planningType,
                    availableIncomeFields: availableIncomeFields,
                    missingFieldSuggestions: missingFieldSuggestions,
                    fieldsChecked: inputs.planningType === 'couple' ? 
                        ['partner1Salary', 'partner2Salary', 'Partner1Salary', 'Partner2Salary'] : 
                        ['currentMonthlySalary', 'monthlySalary', 'salary', 'monthlyIncome'],
                    suggestion: inputs.planningType === 'couple' ? 
                        'Add partner salary information in Wizard Step 2 (Salary & Income)' : 
                        'Add monthly salary information in Wizard Step 2 (Salary & Income)',
                    userGuidance: 'Complete the salary section in the wizard to enable savings rate calculation'
                }
            } 
        };
    }
    
    // Check if contribution data is completely missing
    if (monthlyContributions === 0 && pensionRate === 0 && trainingFundRate === 0) {
        console.warn('❌ FINANCIAL HEALTH SCORE: No contribution data found');
        console.warn('💰 Pension rate found:', pensionRate);
        console.warn('🎓 Training fund rate found:', trainingFundRate);
        console.warn('💼 Monthly contributions found:', monthlyContributions);
        console.warn('🔍 Available contribution-related fields:', Object.keys(inputs).filter(key => 
            key.toLowerCase().includes('contribution') || 
            key.toLowerCase().includes('pension') || 
            key.toLowerCase().includes('training')
        ));
        
        const availableContributionFields = Object.keys(inputs).filter(key => 
            key.toLowerCase().includes('contribution') || 
            key.toLowerCase().includes('pension') || 
            key.toLowerCase().includes('training')
        );
        
        return {
            score: 0,
            details: {
                rate: 0,
                status: 'missing_contribution_data',
                monthlyAmount: 0,
                monthlyIncome: monthlyIncome,
                calculationMethod: 'failed_no_contributions',
                debugInfo: {
                    phase: 'contribution_detection',
                    reason: 'No contribution rates or amounts found in any expected fields',
                    monthlyIncomeFound: monthlyIncome,
                    availableContributionFields: availableContributionFields,
                    missingFieldSuggestions: ['pensionContributionRate', 'trainingFundContributionRate'],
                    fieldsChecked: [
                        'pensionContributionRate', 'trainingFundContributionRate', 
                        'monthlyContribution', 'monthlyContributions'
                    ],
                    suggestion: 'Add contribution rates in Wizard Step 4 (Contributions)',
                    userGuidance: 'Set your pension and training fund contribution percentages to calculate savings rate'
                }
            }
        };
    }
    
    // PHASE 5: Calculate savings rate with comprehensive validation
    console.log('📊 Calculating savings rate...');
    
    const savingsRate = safePercentageCompat(monthlyContributions, monthlyIncome, 0);
    const validSavingsRate = clampValue(savingsRate, 0, 100); // Savings rate should be 0-100%
    
    console.log('📊 Savings rate calculation:', {
        monthlyIncome,
        monthlyContributions,
        rawSavingsRate: savingsRate,
        validSavingsRate: validSavingsRate,
        calculationValid: validSavingsRate > 0
    });
    
    // PHASE 6: Score calculation with benchmarking
    const maxScore = SCORE_FACTORS.savingsRate.weight;
    const benchmarks = SCORE_FACTORS.savingsRate.benchmarks;
    
    let score = 0;
    let status = 'poor';
    let benchmarkLevel = 'none';
    
    if (validSavingsRate >= benchmarks.excellent) {
        score = maxScore;
        status = 'excellent';
        benchmarkLevel = 'excellent';
    } else if (validSavingsRate >= benchmarks.good) {
        score = maxScore * 0.85;
        status = 'good';
        benchmarkLevel = 'good';
    } else if (validSavingsRate >= benchmarks.fair) {
        score = maxScore * 0.70;
        status = 'fair';
        benchmarkLevel = 'fair';
    } else if (validSavingsRate >= benchmarks.poor) {
        score = maxScore * 0.50;
        status = 'poor';
        benchmarkLevel = 'poor';
    } else {
        score = Math.max(0, (validSavingsRate / benchmarks.poor) * maxScore * 0.50);
        status = 'critical';
        benchmarkLevel = 'critical';
    }
    
    // Final score validation
    const finalScore = (isNaN(score) || !isFinite(score)) ? 0 : Math.round(score);
    
    console.log('✅ Savings Rate Score Calculated:', {
        finalScore: finalScore,
        maxPossible: maxScore,
        status: status,
        benchmarkLevel: benchmarkLevel,
        savingsRate: validSavingsRate.toFixed(2) + '%'
    });
    
    // Calculate improvement suggestion
    const targetRate = benchmarks.good; // 15%
    const improvementAmount = validSavingsRate < targetRate ? 
        Math.max(0, (targetRate - validSavingsRate) * monthlyIncome / 100) : 0;
    
    return {
        score: finalScore,
        details: {
            rate: validSavingsRate,
            monthlyAmount: monthlyContributions,
            monthlyIncome: monthlyIncome,
            status: status,
            benchmarkLevel: benchmarkLevel,
            target: targetRate,
            improvement: improvementAmount,
            calculationMethod: calculationMethod,
            pensionRate: pensionRate,
            trainingFundRate: trainingFundRate,
            successfulCalculation: true,
            debugInfo: {
                phase: 'successful_calculation',
                dataQuality: {
                    monthlyIncomeFound: monthlyIncome > 0,
                    contributionDataFound: monthlyContributions > 0 || pensionRate > 0 || trainingFundRate > 0,
                    calculationSuccessful: validSavingsRate >= 0,
                    benchmarkMet: validSavingsRate >= benchmarks.fair
                },
                fieldsUsed: {
                    income: monthlyIncome > 0 ? 'found' : 'missing',
                    contributions: monthlyContributions > 0 ? 'found' : 'missing',
                    pensionRate: pensionRate > 0 ? 'found' : 'missing',
                    trainingFundRate: trainingFundRate > 0 ? 'found' : 'missing'
                },
                recommendations: validSavingsRate < targetRate ? [{
                    category: 'Savings Rate Improvement',
                    suggestion: `Increase monthly savings by ₪${Math.round(improvementAmount)} to reach ${targetRate}% target`,
                    impact: `Would improve score by ${Math.round((maxScore * 0.85) - finalScore)} points`,
                    priority: validSavingsRate < benchmarks.poor ? 'high' : 'medium'
                }] : []
            }
        }
    };
}

/**
 * Calculate retirement readiness score
 */
function calculateRetirementReadinessScore(inputs) {
    console.log('🏦 === CALCULATING RETIREMENT READINESS SCORE ===');
    console.log('🔍 DEBUG: All pension/savings fields in inputs:');
    Object.keys(inputs).filter(key => 
        key.toLowerCase().includes('pension') || 
        key.toLowerCase().includes('saving') ||
        key.toLowerCase().includes('retirement') ||
        key.toLowerCase().includes('training')
    ).forEach(key => {
        console.log(`  ${key}: ${inputs[key]} (type: ${typeof inputs[key]})`);
    });
    
    const currentAge = parseFloat(inputs.currentAge || 30);
    
    // Enhanced income calculation using field mapping bridge
    let monthlyIncome = 0;
    
    // Check if person is already retired (has pension income)
    const pensionIncome = getFieldValue(inputs, [
        'monthlyPensionIncome', 'pensionIncome', 'retirementIncome', 'monthlyRetirementIncome'
    ], { allowZero: true, debugMode: true });
    
    if (pensionIncome > 0) {
        // Person is retired, use pension income
        monthlyIncome = pensionIncome;
        console.log('👴 Retiree pension income:', monthlyIncome);
    } else if (window.fieldMappingBridge) {
        // Use field mapping bridge for better field detection
        if (inputs.planningType === 'couple') {
            monthlyIncome = window.fieldMappingBridge.getCombinedPartnerValue(inputs, 'Salary', { allowZero: true });
            console.log('👫 Couple income found via bridge:', monthlyIncome);
        } else {
            monthlyIncome = window.fieldMappingBridge.findFieldValue(inputs, 'monthlySalary', { allowZero: true }) || 0;
            console.log('👤 Individual income found via bridge:', monthlyIncome);
        }
    }
    
    // Fallback to legacy method if no income found
    if (!monthlyIncome) {
        if (inputs.planningType === 'couple') {
            monthlyIncome = getFieldValue(inputs, [
                'partner1Salary', 'partner2Salary', 'Partner1Salary', 'Partner2Salary'
            ], { combinePartners: true, debugMode: true });
        } else {
            monthlyIncome = getFieldValue(inputs, [
                'currentMonthlySalary', 'monthlySalary', 'salary', 'monthlyIncome'
            ], { debugMode: true });
        }
    }
    
    // Add RSU income if available (similar to savings rate calculation)
    let monthlyRSUIncome = 0;
    if (inputs.rsuUnits && inputs.rsuCurrentStockPrice) {
        const rsuUnits = safeParseFloat(inputs.rsuUnits, 0);
        const stockPrice = safeParseFloat(inputs.rsuCurrentStockPrice, 0);
        const frequency = inputs.rsuFrequency || 'quarterly';
        
        // Calculate monthly RSU income based on frequency
        if (frequency === 'monthly') {
            monthlyRSUIncome = rsuUnits * stockPrice;
        } else if (frequency === 'quarterly') {
            monthlyRSUIncome = (rsuUnits * stockPrice * 4) / 12; // Convert annual to monthly
        } else if (frequency === 'yearly' || frequency === 'annual') {
            monthlyRSUIncome = (rsuUnits * stockPrice) / 12; // Convert annual to monthly
        }
        
        console.log(`💰 RSU Income for retirement calc: ${rsuUnits} units × $${stockPrice} (${frequency}) = $${monthlyRSUIncome.toFixed(2)}/month`);
        
        // Handle currency conversion if needed
        if (inputs.currency === 'ILS' && monthlyRSUIncome > 0) {
            const usdToILS = 3.5; // Default exchange rate
            const convertedRSUIncome = monthlyRSUIncome * usdToILS;
            console.log(`💱 Converting RSU: $${monthlyRSUIncome.toFixed(2)} USD = ₪${convertedRSUIncome.toFixed(2)} ILS`);
            monthlyRSUIncome = convertedRSUIncome;
        }
        
        monthlyIncome += monthlyRSUIncome;
        console.log(`💰 Total monthly income with RSUs: ${monthlyIncome}`);
    }
    
    const annualIncome = monthlyIncome * 12;
    
    // Enhanced calculation for total current savings using field mapping bridge
    console.log('💰 Calculating total current savings...');
    let currentSavings = 0;
    
    // Use field mapping bridge for better field detection
    if (window.fieldMappingBridge) {
        // Get individual asset values
        const pensionSavings = window.fieldMappingBridge.findFieldValue(inputs, 'currentPensionSavings', { allowZero: true }) || 0;
        const trainingFund = window.fieldMappingBridge.findFieldValue(inputs, 'currentTrainingFund', { allowZero: true }) || 0;
        const portfolio = window.fieldMappingBridge.findFieldValue(inputs, 'currentPortfolio', { allowZero: true }) || 0;
        const realEstate = window.fieldMappingBridge.findFieldValue(inputs, 'currentRealEstate', { allowZero: true }) || 0;
        const crypto = window.fieldMappingBridge.findFieldValue(inputs, 'currentCrypto', { allowZero: true }) || 0;
        const bankAccount = window.fieldMappingBridge.findFieldValue(inputs, 'currentBankAccount', { allowZero: true }) || 0;
        
        currentSavings = pensionSavings + trainingFund + portfolio + realEstate + crypto + bankAccount;
        
        console.log('  Asset breakdown via bridge:');
        console.log('  - Pension:', pensionSavings);
        console.log('  - Training Fund:', trainingFund);
        console.log('  - Portfolio:', portfolio);
        console.log('  - Real Estate:', realEstate);
        console.log('  - Crypto:', crypto);
        console.log('  - Bank/Emergency:', bankAccount);
    } else {
        // Fallback to legacy method
        const pensionSavings = getFieldValue(inputs, [
            'currentPensionSavings', 'currentSavings', 'pensionSavings', 
            'retirementSavings', 'currentRetirementSavings', 'currentPension'
        ], { allowZero: true, debugMode: true });
        currentSavings += pensionSavings;
        console.log('  Pension savings (legacy):', pensionSavings);
    }
    
    // Get US retirement accounts (401k, IRA)
    const retirement401k = getFieldValue(inputs, [
        'current401k', 'current401K', 'retirement401k', '401kBalance'
    ], { allowZero: true, debugMode: true });
    currentSavings += retirement401k;
    console.log('  401k savings:', retirement401k);
    
    const retirementIRA = getFieldValue(inputs, [
        'currentIRA', 'currentIra', 'iraBalance', 'retirementIRA'
    ], { allowZero: true, debugMode: true });
    currentSavings += retirementIRA;
    console.log('  IRA savings:', retirementIRA);
    
    // Get training fund
    const trainingFund = getFieldValue(inputs, [
        'currentTrainingFund', 'trainingFund', 'trainingFundValue'
    ], { allowZero: true, debugMode: true });
    currentSavings += trainingFund;
    console.log('  Training fund:', trainingFund);
    
    // Get personal portfolio
    const portfolio = getFieldValue(inputs, [
        'currentPersonalPortfolio', 'personalPortfolio', 'stockPortfolio',
        'investmentPortfolio', 'currentStockPortfolio'
    ], { allowZero: true, debugMode: true });
    currentSavings += portfolio;
    console.log('  Portfolio:', portfolio);
    
    // Get real estate
    const realEstate = getFieldValue(inputs, [
        'currentRealEstate', 'realEstate', 'realEstateValue', 
        'currentRealEstateValue', 'propertyValue'
    ], { allowZero: true, debugMode: true });
    currentSavings += realEstate;
    console.log('  Real estate:', realEstate);
    
    // Get crypto
    const crypto = getFieldValue(inputs, [
        'currentCrypto', 'currentCryptoFiatValue', 'cryptoValue', 
        'currentCryptocurrency', 'cryptoPortfolio'
    ], { allowZero: true, debugMode: true });
    currentSavings += crypto;
    console.log('  Crypto:', crypto);
    
    // Get savings account/emergency fund
    const savingsAccount = getFieldValue(inputs, [
        'currentSavingsAccount', 'savingsAccount', 'currentBankAccount',
        'emergencyFund', 'cashSavings', 'liquidSavings'
    ], { allowZero: true, debugMode: true });
    currentSavings += savingsAccount;
    console.log('  Savings account:', savingsAccount);
    
    // Add partner savings for couple mode
    if (inputs.planningType === 'couple') {
        const partnerPension = getFieldValue(inputs, [
            'partnerCurrentSavings', 'partner1CurrentPension', 'partner2CurrentPension',
            'partnerPensionSavings', 'partnerRetirementSavings'
        ], { allowZero: true, debugMode: true });
        currentSavings += partnerPension;
        console.log('  Partner pension:', partnerPension);
        
        const partnerTrainingFund = getFieldValue(inputs, [
            'partner1CurrentTrainingFund', 'partner2CurrentTrainingFund',
            'partnerTrainingFund'
        ], { allowZero: true, debugMode: true });
        currentSavings += partnerTrainingFund;
        console.log('  Partner training fund:', partnerTrainingFund);
        
        const partnerPortfolio = getFieldValue(inputs, [
            'partner1PersonalPortfolio', 'partner2PersonalPortfolio',
            'partnerPortfolio'
        ], { allowZero: true, debugMode: true });
        currentSavings += partnerPortfolio;
        console.log('  Partner portfolio:', partnerPortfolio);
    }
    
    console.log('💰 Total current savings:', currentSavings);
    
    if (annualIncome === 0) {
        console.warn('❌ No annual income found for retirement readiness calculation');
        return { 
            score: 0, 
            details: { 
                ratio: 0, 
                status: 'unknown',
                currentSavings: currentSavings,
                targetSavings: 0,
                gap: 0,
                debugInfo: {
                    reason: 'No income data found',
                    monthlyIncomeFound: false,
                    currentSavingsFound: currentSavings > 0
                }
            } 
        };
    }
    
    // Age-based savings targets (rule of thumb: 1x by 30, 3x by 40, etc.)
    const targetMultiplier = Math.max(1, (currentAge - 20) / 10);
    const targetSavings = safeMultiplyCompat(annualIncome, targetMultiplier);
    const savingsRatio = safeDivideCompat(currentSavings, targetSavings, 0);
    
    console.log('🎯 Retirement readiness calculation:', {
        currentAge,
        annualIncome,
        targetMultiplier,
        targetSavings,
        currentSavings,
        savingsRatio
    });
    
    const maxScore = SCORE_FACTORS.retirementReadiness.weight;
    let score = 0;
    let status = 'poor';
    
    if (savingsRatio >= SCORE_FACTORS.retirementReadiness.benchmarks.excellent) {
        score = maxScore;
        status = 'excellent';
    } else if (savingsRatio >= SCORE_FACTORS.retirementReadiness.benchmarks.good) {
        score = maxScore * 0.85;
        status = 'good';
    } else if (savingsRatio >= SCORE_FACTORS.retirementReadiness.benchmarks.fair) {
        score = maxScore * 0.70;
        status = 'fair';
    } else if (savingsRatio >= SCORE_FACTORS.retirementReadiness.benchmarks.poor) {
        score = maxScore * 0.50;
        status = 'poor';
    } else {
        score = Math.max(0, savingsRatio * maxScore * 0.50);
        status = 'critical';
    }
    
    const finalScore = Math.round(score);
    console.log(`✅ Retirement Readiness Score: ${finalScore}/${maxScore} (${status})`);
    
    return {
        score: finalScore,
        details: {
            ratio: savingsRatio,
            currentSavings: currentSavings,
            targetSavings: targetSavings,
            gap: Math.max(0, targetSavings - currentSavings),
            status: status,
            currentAge: currentAge,
            targetMultiplier: targetMultiplier,
            annualIncome: annualIncome,
            debugInfo: {
                savingsComponents: {
                    pension: pensionSavings,
                    trainingFund: trainingFund,
                    portfolio: portfolio,
                    realEstate: realEstate,
                    crypto: crypto,
                    savingsAccount: savingsAccount
                },
                incomeFound: monthlyIncome > 0,
                savingsFound: currentSavings > 0,
                calculationSuccessful: true
            }
        }
    };
}

/**
 * Calculate time horizon score
 */
function calculateTimeHorizonScore(inputs) {
    const currentAge = parseFloat(inputs.currentAge || 30);
    const retirementAge = parseFloat(inputs.retirementAge || 67);
    const yearsToRetirement = Math.max(0, retirementAge - currentAge);
    
    const maxScore = SCORE_FACTORS.timeHorizon.weight;
    let score = 0;
    let status = 'poor';
    
    if (yearsToRetirement >= SCORE_FACTORS.timeHorizon.benchmarks.excellent) {
        score = maxScore;
        status = 'excellent';
    } else if (yearsToRetirement >= SCORE_FACTORS.timeHorizon.benchmarks.good) {
        score = maxScore * 0.85;
        status = 'good';
    } else if (yearsToRetirement >= SCORE_FACTORS.timeHorizon.benchmarks.fair) {
        score = maxScore * 0.70;
        status = 'fair';
    } else if (yearsToRetirement >= SCORE_FACTORS.timeHorizon.benchmarks.poor) {
        score = maxScore * 0.50;
        status = 'poor';
    } else {
        score = Math.max(0, (yearsToRetirement / SCORE_FACTORS.timeHorizon.benchmarks.poor) * maxScore * 0.50);
        status = 'critical';
    }
    
    return {
        score: Math.round(score),
        details: {
            yearsToRetirement: yearsToRetirement,
            status: status
        }
    };
}

/**
 * Calculate risk alignment score
 */
function calculateRiskAlignmentScore(inputs) {
    try {
        // Validate inputs exist
        if (!inputs || typeof inputs !== 'object') {
            console.warn('calculateRiskAlignmentScore: Invalid inputs provided');
            return { score: 0, details: { status: 'no_data', message: 'Invalid inputs' } };
        }
        
        const currentAge = parseFloat(inputs.currentAge || 30);
        
        // Get risk tolerance using field mapping bridge
        let riskTolerance = 'moderate';
        if (window.fieldMappingBridge) {
            riskTolerance = window.fieldMappingBridge.findFieldValue(inputs, 'riskTolerance', { expectString: true }) || 'moderate';
        } else {
            riskTolerance = inputs.riskTolerance || inputs.riskProfile || 'moderate';
        }
        
        // Check if portfolio allocations exist for better stock percentage calculation
        let stockPercentage = 0;
        if (inputs.portfolioAllocations && Array.isArray(inputs.portfolioAllocations)) {
            // Calculate stock percentage from portfolio allocations
            const stockAllocation = inputs.portfolioAllocations.find(a => 
                a && a.index && (a.index.toLowerCase().includes('stock') || a.index.toLowerCase().includes('equity'))
            );
            stockPercentage = stockAllocation ? parseFloat(stockAllocation.percentage || 0) : 0;
        } else {
            // Fallback to direct field
            stockPercentage = parseFloat(inputs.stockPercentage || 60);
        }
        
        // If still no stock percentage, use age-based default
        if (stockPercentage === 0 && !inputs.portfolioAllocations && !inputs.stockPercentage) {
            // Use age-based default: 100 - age
            stockPercentage = Math.max(20, 100 - currentAge);
            console.log(`📊 Using age-based default stock allocation: ${stockPercentage}%`);
        }
        
        // If no allocation data available, return minimal score
        if (stockPercentage === 0 && !inputs.portfolioAllocations && !inputs.stockPercentage) {
            return { 
                score: 0, 
                details: { 
                    status: 'no_data', 
                    message: 'No portfolio allocation data available',
                    stockPercentage: 0,
                    recommendedPercentage: Math.max(20, 100 - currentAge)
                } 
            };
        }
        
        // Age-based recommended stock allocation: 100 - age, with min 20%
        const recommendedStockPercentage = Math.max(20, 100 - currentAge);
        const deviation = Math.abs(stockPercentage - recommendedStockPercentage);
        
        let alignmentScore = Math.max(0, 100 - deviation * 2);
        
        // Adjust for risk tolerance
        if (riskTolerance === 'conservative' && stockPercentage > 40) alignmentScore *= 0.8;
        if (riskTolerance === 'aggressive' && stockPercentage < 70) alignmentScore *= 0.8;
        
        const maxScore = SCORE_FACTORS.riskAlignment.weight;
        const score = (alignmentScore / 100) * maxScore;
        
        let status = 'poor';
        if (alignmentScore >= 95) status = 'excellent';
        else if (alignmentScore >= 85) status = 'good';
        else if (alignmentScore >= 70) status = 'fair';
        else if (alignmentScore >= 50) status = 'poor';
        else status = 'critical';
        
        // Ensure score is valid
        const finalScore = isNaN(score) || !isFinite(score) ? 0 : Math.round(score);
        
        return {
            score: finalScore,
            details: {
                stockPercentage: stockPercentage,
                recommendedPercentage: recommendedStockPercentage,
                deviation: deviation,
                alignmentScore: alignmentScore,
                status: status,
                dataSource: inputs.portfolioAllocations ? 'portfolio_allocations' : 'direct_field'
            }
        };
    } catch (error) {
        console.error('calculateRiskAlignmentScore: Error during calculation', error);
        return { score: 0, details: { status: 'error', message: error.message } };
    }
}

/**
 * Calculate diversification score
 */
function calculateDiversificationScore(inputs) {
    console.log('🎯 === CALCULATING DIVERSIFICATION SCORE ===');
    console.log('📋 Input data:', inputs);
    
    try {
        // Validate inputs
        if (!inputs || typeof inputs !== 'object') {
            console.warn('calculateDiversificationScore: Invalid inputs provided');
            return { score: 0, details: { status: 'no_data', assetClasses: 0 } };
        }
        
        let assetClasses = 0;
        const assetDetails = [];
        
        // ENHANCED ASSET DETECTION using getFieldValue function
        console.log('🔍 Detecting asset classes with enhanced field mapping...');
        
        // 1. Pension/Retirement Savings
        const pensionAmount = getFieldValue(inputs, [
            'currentSavings', 'currentPensionSavings', 'pensionSavings', 
            'retirementSavings', 'currentRetirementSavings'
        ], { allowZero: false, debugMode: true });
        if (pensionAmount > 0) {
            assetClasses++;
            assetDetails.push({ type: 'Pension/Retirement', amount: pensionAmount });
            console.log(`✅ Found Pension/Retirement: ${pensionAmount}`);
        }
        
        // 2. Personal Portfolio (Stocks/Bonds)
        const portfolioAmount = getFieldValue(inputs, [
            'currentPersonalPortfolio', 'personalPortfolio', 'stockPortfolio',
            'investmentPortfolio', 'currentStockPortfolio', 'stocksAndBonds'
        ], { allowZero: false, debugMode: true });
        if (portfolioAmount > 0) {
            assetClasses++;
            assetDetails.push({ type: 'Stocks/Bonds Portfolio', amount: portfolioAmount });
            console.log(`✅ Found Portfolio: ${portfolioAmount}`);
        }
        
        // 3. Real Estate
        const realEstateAmount = getFieldValue(inputs, [
            'currentRealEstate', 'realEstate', 'realEstateValue', 
            'currentRealEstateValue', 'propertyValue', 'currentProperty'
        ], { allowZero: false, debugMode: true });
        if (realEstateAmount > 0) {
            assetClasses++;
            assetDetails.push({ type: 'Real Estate', amount: realEstateAmount });
            console.log(`✅ Found Real Estate: ${realEstateAmount}`);
        }
        
        // 4. Cryptocurrency
        const cryptoAmount = getFieldValue(inputs, [
            'currentCrypto', 'currentCryptoFiatValue', 'cryptoValue', 
            'currentCryptocurrency', 'cryptoPortfolio', 'digitalAssets'
        ], { allowZero: false, debugMode: true });
        if (cryptoAmount > 0) {
            assetClasses++;
            assetDetails.push({ type: 'Cryptocurrency', amount: cryptoAmount });
            console.log(`✅ Found Cryptocurrency: ${cryptoAmount}`);
        }
        
        // 5. Cash/Savings Account
        const cashAmount = getFieldValue(inputs, [
            'currentBankAccount', 'currentSavingsAccount', 'savingsAccount', 'cashSavings',
            'currentCash', 'liquidSavings', 'bankAccount'
        ], { allowZero: false, debugMode: true });
        if (cashAmount > 0) {
            assetClasses++;
            assetDetails.push({ type: 'Cash/Savings', amount: cashAmount });
            console.log(`✅ Found Cash/Savings: ${cashAmount}`);
        }
        
        // 6. Emergency Fund (separate from savings)
        const emergencyFundAmount = getFieldValue(inputs, [
            'emergencyFund', 'currentEmergencyFund', 'emergencySavings'
        ], { allowZero: false, debugMode: true });
        if (emergencyFundAmount > 0) {
            assetClasses++;
            assetDetails.push({ type: 'Emergency Fund', amount: emergencyFundAmount });
            console.log(`✅ Found Emergency Fund: ${emergencyFundAmount}`);
        }
        
        // 7. Training Fund (Israeli specific)
        const trainingFundAmount = getFieldValue(inputs, [
            'currentTrainingFund', 'trainingFund', 'trainingFundValue'
        ], { allowZero: false, debugMode: true });
        if (trainingFundAmount > 0) {
            assetClasses++;
            assetDetails.push({ type: 'Training Fund', amount: trainingFundAmount });
            console.log(`✅ Found Training Fund: ${trainingFundAmount}`);
        }
        
        // 8. US Retirement Accounts (401k, IRA)
        const us401kAmount = getFieldValue(inputs, [
            'current401k', 'current401K', 'retirement401k', '401kBalance'
        ], { allowZero: false, debugMode: true });
        const iraAmount = getFieldValue(inputs, [
            'currentIRA', 'currentIra', 'iraBalance', 'retirementIRA'
        ], { allowZero: false, debugMode: true });
        
        if (us401kAmount > 0 || iraAmount > 0) {
            assetClasses++;
            assetDetails.push({ 
                type: 'US Retirement Accounts', 
                amount: us401kAmount + iraAmount,
                breakdown: { '401k': us401kAmount, 'IRA': iraAmount }
            });
            console.log(`✅ Found US Retirement Accounts: 401k=${us401kAmount}, IRA=${iraAmount}`);
        }
        
        console.log(`📊 Total asset classes found: ${assetClasses}`);
        console.log('📝 Asset details:', assetDetails);
        
        const maxScore = SCORE_FACTORS.diversification.weight;
        let score = 0;
        let status = 'poor';
        
        // Enhanced scoring with proper benchmarks
        if (assetClasses >= SCORE_FACTORS.diversification.benchmarks.excellent) {
            score = maxScore;
            status = 'excellent';
        } else if (assetClasses >= SCORE_FACTORS.diversification.benchmarks.good) {
            score = maxScore * 0.85;
            status = 'good';
        } else if (assetClasses >= SCORE_FACTORS.diversification.benchmarks.fair) {
            score = maxScore * 0.70;
            status = 'fair';
        } else if (assetClasses >= SCORE_FACTORS.diversification.benchmarks.poor) {
            score = maxScore * 0.50;
            status = 'poor';
        } else {
            score = 0;
            status = 'critical';
        }
        
        // Ensure score is valid
        const finalScore = isNaN(score) || !isFinite(score) ? 0 : Math.round(score);
        
        console.log(`🎯 Final diversification score: ${finalScore}/${maxScore} (${status})`);
        
        const result = {
            score: finalScore,
            details: {
                assetClasses: assetClasses,
                status: status,
                missingClasses: Math.max(0, SCORE_FACTORS.diversification.benchmarks.good - assetClasses),
                assets: assetDetails,
                debugInfo: {
                    totalAssetClassesFound: assetClasses,
                    assetsDetected: assetDetails.map(a => `${a.type}: ${a.amount}`),
                    calculationMethod: 'enhanced_field_mapping',
                    benchmarkTargets: SCORE_FACTORS.diversification.benchmarks,
                    userGuidance: assetClasses === 0 ? 
                        'Add information about your investments, savings, real estate, or other assets in the wizard' :
                        `Good diversification! You have ${assetClasses} asset classes. Consider adding ${Math.max(0, SCORE_FACTORS.diversification.benchmarks.good - assetClasses)} more for better diversification.`
                }
            }
        };
        
        console.log('📋 Diversification result:', result);
        return result;
        
    } catch (error) {
        console.error('calculateDiversificationScore: Error during calculation', error);
        return { 
            score: 0, 
            details: { 
                status: 'error', 
                message: error.message, 
                assetClasses: 0,
                debugInfo: {
                    error: error.message,
                    calculationMethod: 'failed_with_error'
                }
            } 
        };
    }
}

/**
 * Calculate tax efficiency score
 */
function calculateTaxEfficiencyScore(inputs) {
    console.log('🔍 Calculating Tax Efficiency Score...');
    
    // Enhanced field detection for contribution rates using field mapping bridge
    let pensionRate = 0;
    let trainingFundRate = 0;
    
    if (window.fieldMappingBridge) {
        if (inputs.planningType === 'couple') {
            // Get combined partner rates using average
            pensionRate = window.fieldMappingBridge.getCombinedPartnerValue(inputs, 'PensionRate', { 
                allowZero: true, 
                combineMethod: 'average' 
            });
            trainingFundRate = window.fieldMappingBridge.getCombinedPartnerValue(inputs, 'TrainingRate', { 
                allowZero: true, 
                combineMethod: 'average' 
            });
        } else {
            // Get individual rates
            pensionRate = window.fieldMappingBridge.findFieldValue(inputs, 'pensionEmployeeRate', { allowZero: true }) || 0;
            trainingFundRate = window.fieldMappingBridge.findFieldValue(inputs, 'trainingFundEmployeeRate', { allowZero: true }) || 0;
        }
    }
    
    // Fallback to legacy method if rates not found
    if (!pensionRate) {
        pensionRate = getFieldValue(inputs, [
            'employeePensionRate', 'pensionContributionRate', 'pensionEmployeeRate', 
            'pensionEmployee', 'pensionEmployeeContribution', 'employeePensionContribution', 
            'pensionRate'
        ]) || 0;
    }
    
    if (!trainingFundRate) {
        trainingFundRate = getFieldValue(inputs, [
            'trainingFundEmployeeRate', 'trainingFundContributionRate', 
            'trainingFundEmployee', 'trainingFundEmployeeContribution', 
            'employeeTrainingFundContribution', 'trainingFundRate'
        ]) || 0;
    }
    
    // Country normalization with proper handling
    const country = (inputs.country || inputs.taxCountry || inputs.inheritanceCountry || 'ISR')
        .toString()
        .toLowerCase()
        .trim();
    
    console.log('💸 Tax Efficiency Debug:', {
        pensionRate,
        trainingFundRate,
        country,
        taxCountry: inputs.taxCountry,
        hasTaxCalculators: !!window.TaxCalculators,
        hasAdditionalIncomeTax: !!window.AdditionalIncomeTax
    });
    
    // Calculate tax-advantaged contribution rate
    const totalTaxAdvantaged = pensionRate + trainingFundRate;
    
    // Get base salary based on planning type
    let baseSalary = 0;
    let salaryDataFound = false;
    
    if (inputs.planningType === 'couple') {
        const partner1Income = parseFloat(inputs.partner1Salary || 0);
        const partner2Income = parseFloat(inputs.partner2Salary || 0);
        baseSalary = (partner1Income + partner2Income) * 12;
        salaryDataFound = inputs.partner1Salary !== undefined || inputs.partner2Salary !== undefined;
    } else {
        // Check for salary field existence first
        const salaryFields = [
            'currentMonthlySalary', 'monthlySalary', 'salary', 'monthlyIncome', 
            'currentSalary', 'monthly_salary', 'income', 'grossSalary', 
            'netSalary', 'baseSalary', 'totalIncome', 'monthlyIncomeAmount'
        ];
        
        // Check if any salary field exists in the inputs
        salaryDataFound = salaryFields.some(field => inputs[field] !== undefined);
        
        if (salaryDataFound) {
            // Enhanced field mapping for salary - check multiple field variations
            const monthlySalary = getFieldValue(inputs, salaryFields, { allowZero: true });
            baseSalary = monthlySalary * 12;
        }
    }
    
    // Enhanced tax efficiency calculation using existing tax system
    let effectiveTaxRate = 0;
    let taxSavingsFromContributions = 0;
    
    // Try to use existing TaxCalculators if available
    if (window.TaxCalculators && baseSalary > 0) {
        try {
            const grossMonthlySalary = baseSalary / 12;
            const taxResult = window.TaxCalculators.calculateNetSalary(grossMonthlySalary, inputs.taxCountry || 'israel');
            effectiveTaxRate = taxResult.taxRate || 0;
            
            // Calculate tax savings from pension/training fund contributions
            const monthlyContributions = grossMonthlySalary * totalTaxAdvantaged / 100;
            taxSavingsFromContributions = monthlyContributions * (effectiveTaxRate / 100) * 12;
            
            console.log('💸 Using TaxCalculators:', {
                grossMonthlySalary,
                effectiveTaxRate,
                monthlyContributions,
                taxSavingsFromContributions
            });
        } catch (error) {
            console.warn('Error using TaxCalculators:', error);
        }
    }
    
    // Check for missing data and return appropriate error states
    if (!salaryDataFound) {
        return {
            score: 0,
            details: {
                currentRate: 0,
                optimalRate: 0,
                efficiencyScore: 0,
                status: 'missing_income_data',
                debugInfo: {
                    reason: 'No salary data found',
                    missingFields: inputs.planningType === 'couple' ? 
                        ['partner1Salary', 'partner2Salary'] : ['monthlySalary', 'currentMonthlySalary'],
                    suggestion: 'Add salary information in Step 2'
                }
            }
        };
    }
    
    if (totalTaxAdvantaged === 0) {
        return {
            score: 0,
            details: {
                currentRate: 0,
                optimalRate: getOptimalTaxAdvantageRate(country),
                efficiencyScore: 0,
                status: 'missing_contribution_data',
                debugInfo: {
                    reason: 'No contribution rates found',
                    missingFields: ['pensionContributionRate', 'trainingFundContributionRate'],
                    suggestion: 'Add contribution rates in Step 4'
                }
            }
        };
    }
    
    // Calculate additional income impact if AdditionalIncomeTax is available
    let additionalIncomeEfficiency = 0;
    let hasAdditionalIncome = false;
    let additionalIncomeDetails = {};
    
    if (window.AdditionalIncomeTax && typeof window.AdditionalIncomeTax.calculateTotalAdditionalIncomeTax === 'function') {
        try {
            const additionalTaxInfo = window.AdditionalIncomeTax.calculateTotalAdditionalIncomeTax(inputs);
            if (additionalTaxInfo.totalAdditionalIncome > 0) {
                hasAdditionalIncome = true;
                const totalIncome = baseSalary + additionalTaxInfo.totalAdditionalIncome;
                const totalTaxAdvantaged = safeMultiplyCompat(baseSalary, (pensionRate + trainingFundRate) / 100);
                const overallTaxAdvantageRate = safePercentageCompat(totalTaxAdvantaged, totalIncome, 0);
                
                // Adjust efficiency score based on overall tax advantage
                additionalIncomeEfficiency = overallTaxAdvantageRate;
                additionalIncomeDetails = {
                    totalAdditionalIncome: additionalTaxInfo.totalAdditionalIncome,
                    additionalTaxRate: additionalTaxInfo.effectiveRate,
                    overallTaxAdvantageRate: overallTaxAdvantageRate,
                    dilutionEffect: (pensionRate + trainingFundRate) - overallTaxAdvantageRate
                };
            }
        } catch (error) {
            console.warn('Error calculating additional income tax efficiency:', error);
        }
    }

    // Helper function to get optimal tax advantage rate by country
    function getOptimalTaxAdvantageRate(country) {
        const optimalRates = {
            'isr': 21.333, 'israel': 21.333, 'il': 21.333,
            'usa': 15, 'us': 15, 'united states': 15, 'united_states': 15,
            'gbr': 12, 'uk': 12, 'gb': 12, 'united kingdom': 12, 'united_kingdom': 12,
            'eur': 10, 'eu': 10, 'germany': 10, 'de': 10, 'france': 10, 'fr': 10, 'europe': 10
        };
        return optimalRates[country] || optimalRates['isr'];
    }
    
    // Calculate efficiency score based on current vs optimal contribution rates
    const optimalRate = getOptimalTaxAdvantageRate(country);
    let efficiencyScore = 0;
    
    if (hasAdditionalIncome) {
        // Use overall tax advantage rate when additional income exists
        efficiencyScore = Math.min(100, (additionalIncomeEfficiency / optimalRate) * 100);
    } else {
        // Use traditional pension/training fund rate calculation
        efficiencyScore = Math.min(100, (totalTaxAdvantaged / optimalRate) * 100);
    }
    
    const maxScore = SCORE_FACTORS.taxEfficiency.weight;
    const score = safeMultiplyCompat(efficiencyScore / 100, maxScore);
    
    let status = 'poor';
    if (efficiencyScore >= 90) status = 'excellent';
    else if (efficiencyScore >= 75) status = 'good';
    else if (efficiencyScore >= 60) status = 'fair';
    else if (efficiencyScore >= 40) status = 'poor';
    else status = 'critical';
    
    return {
        score: Math.round(score),
        details: {
            currentRate: hasAdditionalIncome ? additionalIncomeEfficiency : totalTaxAdvantaged,
            optimalRate: optimalRate,
            efficiencyScore: efficiencyScore,
            status: status,
            pensionRate: pensionRate,
            trainingFundRate: trainingFundRate,
            country: country,
            baseSalary: baseSalary,
            effectiveTaxRate: effectiveTaxRate,
            taxSavingsFromContributions: taxSavingsFromContributions,
            calculationMethod: hasAdditionalIncome ? 'comprehensive_with_additional_income' : 
                            (pensionRate > 0 || trainingFundRate > 0) ? 'rates_found_with_tax_integration' : 'using_defaults',
            hasAdditionalIncome: hasAdditionalIncome,
            additionalIncomeDetails: additionalIncomeDetails,
            debugInfo: {
                countryDetected: country,
                optimalRateUsed: optimalRate,
                taxSystemIntegration: {
                    usedTaxCalculators: !!window.TaxCalculators && baseSalary > 0,
                    effectiveTaxRate: effectiveTaxRate,
                    taxSavings: taxSavingsFromContributions
                },
                ratesFound: {
                    pension: pensionRate > 0,
                    trainingFund: trainingFundRate > 0
                },
                incomeData: {
                    baseSalaryFound: baseSalary > 0,
                    planningType: inputs.planningType,
                    salaryFields: {
                        currentMonthlySalary: !!inputs.currentMonthlySalary,
                        partner1Salary: !!inputs.partner1Salary,
                        partner2Salary: !!inputs.partner2Salary
                    }
                },
                additionalIncomeConsidered: hasAdditionalIncome
            }
        }
    };
}

/**
 * Calculate emergency fund score with debt load consideration
 */
function calculateEmergencyFundScore(inputs) {
    console.log('💵 === CALCULATING EMERGENCY FUND SCORE ===');
    
    // Calculate total monthly expenses including debt payments
    let monthlyExpenses = 0;
    
    // Get basic living expenses from expenses structure
    if (inputs.expenses) {
        const expenseCategories = ['housing', 'transportation', 'food', 'insurance', 'other'];
        monthlyExpenses = expenseCategories.reduce((sum, category) => {
            return sum + (parseFloat(inputs.expenses[category]) || 0);
        }, 0);
        
        // Add debt payments to monthly expenses for emergency fund calculation
        const debtCategories = ['mortgage', 'carLoan', 'creditCard', 'otherDebt'];
        const monthlyDebtPayments = debtCategories.reduce((sum, category) => {
            return sum + (parseFloat(inputs.expenses[category]) || 0);
        }, 0);
        
        monthlyExpenses += monthlyDebtPayments;
        console.log('💸 Monthly expenses from structure:', monthlyExpenses);
    } else {
        // Fallback to legacy field or estimate from salary
        monthlyExpenses = parseFloat(inputs.currentMonthlyExpenses || 0);
        
        // If still no expenses, estimate from salary (common rule: 70-80% of income)
        if (monthlyExpenses === 0) {
            const monthlyIncome = getFieldValue(inputs, [
                'currentMonthlySalary', 'monthlySalary', 'salary', 'monthlyIncome'
            ], { allowZero: true });
            
            if (monthlyIncome > 0) {
                monthlyExpenses = monthlyIncome * 0.75; // Estimate 75% of income as expenses
                console.log('💸 Estimated monthly expenses from income:', monthlyExpenses);
            }
        }
    }
    
    // Get emergency fund amount with enhanced field mapping
    // For couple mode, combine partner bank accounts
    let emergencyFund = 0;
    if (inputs.planningType === 'couple') {
        emergencyFund = getFieldValue(inputs, [
            'emergencyFund', 'currentBankAccount', 'currentSavingsAccount', 'emergencyFundAmount',
            'cashReserves', 'liquidSavings', 'savingsAccount', 'bankAccount',
            'partner1BankAccount', 'partner2BankAccount'
        ], { combinePartners: true, allowZero: true });
    } else {
        emergencyFund = getFieldValue(inputs, [
            'emergencyFund', 'currentBankAccount', 'currentSavingsAccount', 'emergencyFundAmount',
            'cashReserves', 'liquidSavings', 'savingsAccount', 'bankAccount'
        ], { allowZero: true });
    }
    
    console.log('💰 Emergency fund found:', emergencyFund);
    console.log('💸 Monthly expenses:', monthlyExpenses);
    
    // Handle case where we have no expense data
    if (monthlyExpenses === 0) {
        // If we have an emergency fund but no expenses, give partial credit
        if (emergencyFund > 0) {
            const maxScore = SCORE_FACTORS.emergencyFund.weight;
            return {
                score: Math.round(maxScore * 0.3), // Give 30% of max score for having any emergency fund
                details: {
                    months: Infinity, // Can't calculate months without expenses
                    currentAmount: emergencyFund,
                    targetAmount: 0,
                    gap: 0,
                    status: 'partial',
                    debugInfo: {
                        reason: 'No monthly expenses found but emergency fund exists',
                        emergencyFundAmount: emergencyFund,
                        expensesFound: false,
                        partialCredit: true
                    }
                }
            };
        }
        
        return { 
            score: 0, 
            details: { 
                months: 0,
                currentAmount: 0,
                targetAmount: 0,
                gap: 0,
                status: 'unknown',
                debugInfo: {
                    reason: 'No monthly expenses found',
                    fieldsChecked: ['expenses structure', 'currentMonthlyExpenses', 'salary estimate'],
                    expensesFound: false
                }
            } 
        };
    }
    
    // Calculate months covered, handling edge cases
    const monthsCovered = safeDivideCompat(emergencyFund, monthlyExpenses, 0);
    
    // Calculate debt-to-income ratio to adjust emergency fund recommendations
    const monthlyIncome = getFieldValue(inputs, [
        'currentMonthlySalary', 'currentSalary', 'partner1Salary', 
        'monthlySalary', 'salary', 'monthly_salary', 'monthlyIncome'
    ]);
    
    let totalMonthlyIncome = monthlyIncome;
    if (inputs.planningType === 'couple') {
        const partner1Income = parseFloat(inputs.partner1Salary || 0);
        const partner2Income = parseFloat(inputs.partner2Salary || 0);
        totalMonthlyIncome = partner1Income + partner2Income;
    }
    
    // Calculate debt load for enhanced recommendations
    let monthlyDebtPayments = 0;
    if (inputs.expenses) {
        const debtCategories = ['mortgage', 'carLoan', 'creditCard', 'otherDebt'];
        monthlyDebtPayments = debtCategories.reduce((sum, category) => {
            return sum + (parseFloat(inputs.expenses[category]) || 0);
        }, 0);
    }
    
    const debtToIncomeRatio = safeDivideCompat(monthlyDebtPayments, totalMonthlyIncome, 0);
    
    // Adjust target months based on debt load
    let targetMonths = SCORE_FACTORS.emergencyFund.benchmarks.good; // Default 6 months
    if (debtToIncomeRatio > 0.3) {
        targetMonths = 8; // High debt requires more emergency fund
    } else if (debtToIncomeRatio > 0.2) {
        targetMonths = 7; // Moderate debt requires slightly more
    }
    
    const maxScore = SCORE_FACTORS.emergencyFund.weight;
    let score = 0;
    let status = 'poor';
    
    if (monthsCovered >= SCORE_FACTORS.emergencyFund.benchmarks.excellent) {
        score = maxScore;
        status = 'excellent';
    } else if (monthsCovered >= targetMonths) {
        score = maxScore * 0.85;
        status = 'good';
    } else if (monthsCovered >= SCORE_FACTORS.emergencyFund.benchmarks.fair) {
        score = maxScore * 0.70;
        status = 'fair';
    } else if (monthsCovered >= SCORE_FACTORS.emergencyFund.benchmarks.poor) {
        score = maxScore * 0.50;
        status = 'poor';
    } else {
        score = Math.max(0, (monthsCovered / SCORE_FACTORS.emergencyFund.benchmarks.poor) * maxScore * 0.50);
        status = 'critical';
    }
    
    const finalScore = Math.round(score);
    console.log(`✅ Emergency Fund Score: ${finalScore}/${maxScore} (${status})`);
    console.log(`  Months covered: ${monthsCovered.toFixed(1)}, Target: ${targetMonths}`);
    
    return {
        score: finalScore,
        details: {
            months: Math.max(0, monthsCovered), // Ensure non-negative months
            currentAmount: Math.max(0, emergencyFund), // Ensure non-negative amount
            targetAmount: monthlyExpenses * targetMonths,
            gap: Math.max(0, (monthlyExpenses * targetMonths) - emergencyFund),
            status: status,
            monthlyExpenses: monthlyExpenses,
            adjustedTarget: targetMonths !== SCORE_FACTORS.emergencyFund.benchmarks.good,
            debtAdjustment: {
                debtToIncomeRatio: debtToIncomeRatio,
                recommendedMonths: targetMonths,
                reason: debtToIncomeRatio > 0.3 ? 'high_debt' : 
                       debtToIncomeRatio > 0.2 ? 'moderate_debt' : 'standard'
            },
            calculationMethod: inputs.expenses ? 'expense_structure_with_debt' : 
                             monthlyExpenses === monthlyIncome * 0.75 ? 'estimated_from_income' : 'legacy_field',
            debugInfo: {
                monthlyExpensesFound: monthlyExpenses > 0,
                emergencyFundFound: emergencyFund >= 0,
                emergencyFundAmount: emergencyFund,
                monthlyExpensesAmount: monthlyExpenses,
                debtConsideration: monthlyDebtPayments > 0 ? 'included' : 'none',
                fieldsUsed: {
                    expenses: monthlyExpenses > 0 ? 'found' : 'missing',
                    emergencyFund: emergencyFund >= 0 ? 'found' : 'missing'
                },
                scoreCalculation: {
                    monthsCovered: monthsCovered,
                    targetMonths: targetMonths,
                    benchmarks: SCORE_FACTORS.emergencyFund.benchmarks,
                    finalScore: finalScore
                }
            }
        }
    };
}

/**
 * Calculate debt management score with enhanced field mapping
 */
function calculateDebtManagementScore(inputs) {
    // Enhanced field mapping for monthly income
    const monthlyIncome = getFieldValue(inputs, [
        'currentMonthlySalary', 'currentSalary', 'partner1Salary', 
        'monthlySalary', 'salary', 'monthly_salary', 'monthlyIncome'
    ]);
    
    // Calculate monthly debt payments from expenses structure or legacy field
    let monthlyDebtPayments = 0;
    
    // First try the new expenses structure with individual debt categories
    if (inputs.expenses) {
        const debtCategories = ['mortgage', 'carLoan', 'creditCard', 'otherDebt'];
        monthlyDebtPayments = debtCategories.reduce((sum, category) => {
            return sum + (parseFloat(inputs.expenses[category]) || 0);
        }, 0);
    }
    
    // Fallback to legacy monthlyDebtPayments field if no expenses structure
    if (monthlyDebtPayments === 0) {
        monthlyDebtPayments = parseFloat(inputs.monthlyDebtPayments || 0);
    }
    
    // For couple planning, combine partner incomes
    let totalMonthlyIncome = monthlyIncome;
    if (inputs.planningType === 'couple') {
        const partner1Income = parseFloat(inputs.partner1Salary || 0);
        const partner2Income = parseFloat(inputs.partner2Salary || 0);
        totalMonthlyIncome = partner1Income + partner2Income;
    }
    
    if (totalMonthlyIncome === 0) {
        return { 
            score: SCORE_FACTORS.debtManagement.weight, 
            details: { 
                ratio: 0, 
                status: 'unknown',
                debugInfo: {
                    reason: 'No monthly income found',
                    fieldsChecked: ['currentMonthlySalary', 'partner1Salary', 'partner2Salary'],
                    incomeFound: false,
                    debtPaymentsFound: monthlyDebtPayments > 0
                }
            } 
        };
    }
    
    const debtToIncomeRatio = safeDivideCompat(monthlyDebtPayments, totalMonthlyIncome, 0);
    const maxScore = SCORE_FACTORS.debtManagement.weight;
    
    let score = maxScore;
    let status = 'excellent';
    
    if (debtToIncomeRatio <= SCORE_FACTORS.debtManagement.benchmarks.excellent) {
        score = maxScore;
        status = 'excellent';
    } else if (debtToIncomeRatio <= SCORE_FACTORS.debtManagement.benchmarks.good) {
        score = maxScore * 0.85;
        status = 'good';
    } else if (debtToIncomeRatio <= SCORE_FACTORS.debtManagement.benchmarks.fair) {
        score = maxScore * 0.70;
        status = 'fair';
    } else if (debtToIncomeRatio <= SCORE_FACTORS.debtManagement.benchmarks.poor) {
        score = maxScore * 0.50;
        status = 'poor';
    } else {
        score = 0;
        status = 'critical';
    }
    
    // Calculate debt breakdown for detailed analysis
    const debtBreakdown = {};
    if (inputs.expenses) {
        debtBreakdown.mortgage = parseFloat(inputs.expenses.mortgage || 0);
        debtBreakdown.carLoan = parseFloat(inputs.expenses.carLoan || 0);
        debtBreakdown.creditCard = parseFloat(inputs.expenses.creditCard || 0);
        debtBreakdown.otherDebt = parseFloat(inputs.expenses.otherDebt || 0);
    }
    
    return {
        score: Math.round(score),
        details: {
            ratio: debtToIncomeRatio,
            monthlyPayments: monthlyDebtPayments,
            monthlyIncome: totalMonthlyIncome,
            status: status,
            debtBreakdown: debtBreakdown,
            calculationMethod: inputs.expenses ? 'expense_categories' : 'legacy_field',
            debugInfo: {
                incomeSource: inputs.planningType === 'couple' ? 'combined_partners' : 'individual',
                debtSource: inputs.expenses ? 'expense_structure' : 'legacy_field',
                totalIncomeFound: totalMonthlyIncome > 0,
                debtPaymentsFound: monthlyDebtPayments > 0,
                fieldsUsed: {
                    income: totalMonthlyIncome > 0 ? 'found' : 'missing',
                    debt: monthlyDebtPayments > 0 ? 'found' : 'missing'
                }
            }
        }
    };
}

/**
 * Generate actionable improvement suggestions
 */
function generateImprovementSuggestions(scoreBreakdown) {
    const suggestions = [];
    
    // Sort factors by lowest scores first (biggest improvement opportunities)
    const factors = Object.entries(scoreBreakdown.factors)
        .sort((a, b) => a[1].score - b[1].score);
    
    factors.forEach(([factorName, factorData]) => {
        // CRITICAL FIX: Add null safety checks to prevent "Cannot read properties of undefined (reading 'status')" error
        const status = factorData?.details?.status || 'unknown';
        if (status === 'critical' || status === 'poor') {
            // Ensure factorData.details exists before accessing properties
            if (!factorData?.details) {
                console.warn(`Missing details for factor: ${factorName}`);
                return;
            }
            
            switch (factorName) {
                case 'savingsRate':
                    if (factorData.details.rate !== undefined && factorData.details.improvement !== undefined) {
                        suggestions.push({
                            priority: 'high',
                            category: 'Savings Rate',
                            issue: `Currently saving only ${factorData.details.rate.toFixed(1)}% of income`,
                            action: `Increase monthly savings by ₪${Math.round(factorData.details.improvement)} to reach 15% target`,
                            impact: `+${Math.round((SCORE_FACTORS.savingsRate.weight * 0.85) - factorData.score)} points`
                        });
                    }
                    break;
                case 'retirementReadiness':
                    if (factorData.details.gap !== undefined) {
                        suggestions.push({
                            priority: 'high',
                            category: 'Retirement Readiness',
                            issue: `₪${Math.round(factorData.details.gap).toLocaleString()} behind age-appropriate savings target`,
                            action: `Increase retirement contributions or consider working longer`,
                            impact: `+${Math.round((SCORE_FACTORS.retirementReadiness.weight * 0.85) - factorData.score)} points`
                        });
                    }
                    break;
                case 'diversification':
                    if (factorData.details.assetClasses !== undefined && factorData.details.missingClasses !== undefined) {
                        suggestions.push({
                            priority: 'medium',
                            category: 'Portfolio Diversification',
                            issue: `Only ${factorData.details.assetClasses} asset classes in portfolio`,
                            action: `Add ${factorData.details.missingClasses} more asset class(es) like real estate or international stocks`,
                            impact: `+${Math.round((SCORE_FACTORS.diversification.weight * 0.85) - factorData.score)} points`
                        });
                    }
                    break;
                case 'emergencyFund':
                    if (factorData.details.months !== undefined && factorData.details.gap !== undefined) {
                        const targetMonths = factorData.details.debtAdjustment?.recommendedMonths || 6;
                        const debtAdjustment = factorData.details.adjustedTarget ? ` (${targetMonths} months recommended due to debt load)` : '';
                        
                        suggestions.push({
                            priority: 'high',
                            category: 'Emergency Fund',
                            issue: `Only ${factorData.details.months.toFixed(1)} months of expenses covered`,
                            action: `Save additional ₪${Math.round(factorData.details.gap).toLocaleString()} for ${targetMonths}-month emergency fund${debtAdjustment}`,
                            impact: `+${Math.round((SCORE_FACTORS.emergencyFund.weight * 0.85) - factorData.score)} points`
                        });
                    }
                    break;
                case 'taxEfficiency':
                    if (factorData.details.efficiencyScore !== undefined) {
                        suggestions.push({
                            priority: 'medium',
                            category: 'Tax Optimization',
                            issue: `${factorData.details.efficiencyScore.toFixed(0)}% tax efficiency vs optimal`,
                            action: `Maximize pension and training fund contributions`,
                            impact: `+${Math.round((SCORE_FACTORS.taxEfficiency.weight * 0.85) - factorData.score)} points`
                        });
                    }
                    break;
                case 'debtManagement':
                    if (factorData.details.ratio !== undefined && factorData.details.monthlyPayments !== undefined) {
                        const debtRatioPercent = (factorData.details.ratio * 100).toFixed(1);
                        let actionText = '';
                        
                        if (factorData.details.ratio > 0.35) {
                            actionText = 'Consider debt consolidation, sell non-essential assets, or increase income';
                        } else if (factorData.details.ratio > 0.2) {
                            actionText = 'Focus on paying off high-interest debt first (credit cards)';
                        } else if (factorData.details.ratio > 0.1) {
                            actionText = 'Make extra payments toward principal on highest-rate loans';
                        } else {
                            actionText = 'Maintain current debt levels while maximizing retirement savings';
                        }
                        
                        // Enhanced debt breakdown suggestions
                        if (factorData.details.debtBreakdown) {
                            const breakdown = factorData.details.debtBreakdown;
                            if (breakdown.creditCard > breakdown.mortgage && breakdown.creditCard > 0) {
                                actionText += '. Prioritize credit card debt (typically highest interest rate)';
                            }
                        }
                        
                        suggestions.push({
                            priority: factorData.details.ratio > 0.3 ? 'high' : 'medium',
                            category: 'Debt Management',
                            issue: `${debtRatioPercent}% debt-to-income ratio (₪${Math.round(factorData.details.monthlyPayments)} monthly)`,
                            action: actionText,
                            impact: `+${Math.round((SCORE_FACTORS.debtManagement.weight * 0.85) - factorData.score)} points`
                        });
                    }
                    break;
            }
        }
    });
    
    return suggestions.slice(0, 5); // Top 5 suggestions
}

/**
 * Get peer comparison data
 */
function getPeerComparison(inputs, totalScore) {
    const age = parseFloat(inputs.currentAge || 30);
    let ageGroup = '30-39';
    
    if (age < 30) ageGroup = '20-29';
    else if (age < 40) ageGroup = '30-39';
    else if (age < 50) ageGroup = '40-49';
    else if (age < 60) ageGroup = '50-59';
    else ageGroup = '60+';
    
    const benchmark = PEER_BENCHMARKS[ageGroup];
    
    return {
        ageGroup: ageGroup,
        yourScore: totalScore,
        peerAverage: benchmark.averageScore,
        topQuartile: benchmark.topQuartile,
        percentile: totalScore > benchmark.topQuartile ? 90 : 
                   totalScore > benchmark.averageScore ? 70 : 
                   totalScore > (benchmark.averageScore * 0.8) ? 50 : 25
    };
}

/**
 * Main function to calculate comprehensive financial health score
 */
function calculateFinancialHealthScore(inputs) {
    try {
        // Log to session storage for debugging
        if (window.sessionStorageGist) {
            window.sessionStorageGist.logDebugInfo('Financial Health Score Calculation Started', {
                planningType: inputs.planningType,
                totalFields: Object.keys(inputs).length,
                inputKeys: Object.keys(inputs)
            });
        }
        
        // Enhanced debug logging for input validation
        console.log('🔍 Financial Health Score Calculation Started');
        console.log('📋 Input Summary:', {
            planningType: inputs.planningType,
            totalFields: Object.keys(inputs).length,
            salaryFields: Object.keys(inputs).filter(k => k.toLowerCase().includes('salary')),
            pensionFields: Object.keys(inputs).filter(k => k.toLowerCase().includes('pension')),
            trainingFields: Object.keys(inputs).filter(k => k.toLowerCase().includes('training')),
            savingsFields: Object.keys(inputs).filter(k => k.toLowerCase().includes('savings')),
            expenseFields: Object.keys(inputs).filter(k => k.toLowerCase().includes('expense')),
            hasExpensesStructure: !!inputs.expenses,
            country: inputs.country || inputs.taxCountry || 'unknown'
        });
        
        // Run field availability diagnostics if bridge is available
        let fieldDiagnostics = null;
        if (window.fieldMappingBridge && window.fieldMappingBridge.diagnoseFieldAvailability) {
            fieldDiagnostics = window.fieldMappingBridge.diagnoseFieldAvailability(inputs);
            console.log('🔧 Field Diagnostics:', fieldDiagnostics);
            
            // Log field mapping diagnosis to session storage
            if (window.sessionStorageGist) {
                window.sessionStorageGist.logFieldMappingDiagnosis(inputs, fieldDiagnostics);
            }
            
            if (fieldDiagnostics.criticalIssues.length > 0) {
                console.warn('⚠️ Critical field issues detected:', fieldDiagnostics.criticalIssues);
                
                // Log critical issues to session storage
                if (window.sessionStorageGist) {
                    window.sessionStorageGist.logError({
                        message: 'Critical field mapping issues detected',
                        details: fieldDiagnostics.criticalIssues
                    }, { context: 'financial-health-calculation' });
                }
            }
        }
        
        // Calculate each factor with error handling
        const factors = {};
        
        // Helper function to safely calculate each factor
        const safeCalculate = (factorName, calculator) => {
            try {
                const result = calculator(inputs);
                
                // Validate result structure - be more specific about what we expect
                if (!result) {
                    console.warn(`${factorName}: Calculator returned null/undefined, using default`);
                    return { score: 0, details: { status: 'error', message: 'Calculator returned null' } };
                }
                if (typeof result !== 'object') {
                    console.warn(`${factorName}: Calculator returned non-object (${typeof result}), using default`);
                    return { score: 0, details: { status: 'error', message: `Expected object, got ${typeof result}` } };
                }
                if (typeof result.score !== 'number') {
                    console.warn(`${factorName}: Score is not a number (${typeof result.score}: ${result.score}), using default`);
                    return { score: 0, details: { status: 'error', message: `Score not a number: ${typeof result.score}` } };
                }
                // Ensure score is finite and valid
                if (!isFinite(result.score) || isNaN(result.score)) {
                    console.warn(`${factorName}: Invalid score value (${result.score}), using 0`);
                    result.score = 0;
                }
                return result;
            } catch (error) {
                console.error(`${factorName}: Calculation failed`, error);
                return { score: 0, details: { status: 'error', message: error.message } };
            }
        };
        
        // Calculate each factor with safety wrapper
        factors.savingsRate = safeCalculate('savingsRate', calculateSavingsRateScore);
        factors.retirementReadiness = safeCalculate('retirementReadiness', calculateRetirementReadinessScore);
        factors.timeHorizon = safeCalculate('timeHorizon', calculateTimeHorizonScore);
        factors.riskAlignment = safeCalculate('riskAlignment', calculateRiskAlignmentScore);
        factors.diversification = safeCalculate('diversification', calculateDiversificationScore);
        factors.taxEfficiency = safeCalculate('taxEfficiency', calculateTaxEfficiencyScore);
        factors.emergencyFund = safeCalculate('emergencyFund', calculateEmergencyFundScore);
        factors.debtManagement = safeCalculate('debtManagement', calculateDebtManagementScore);
        
        // Debug logging for factor scores
        console.log('📈 Factor Scores Breakdown:');
        Object.entries(factors).forEach(([name, factor]) => {
            console.log(`  ${name}: ${factor.score}/${SCORE_FACTORS[name]?.weight || 'unknown'} (${factor.details?.status || 'no status'})`);
        });
        
        // CRITICAL FIX: Add comprehensive NaN prevention and validation
        const factorScores = Object.values(factors).map(factor => {
            const score = factor?.score || 0;
            // Ensure score is a valid finite number
            if (isNaN(score) || !isFinite(score)) {
                console.warn(`Invalid factor score detected: ${score}, using 0 instead`);
                return 0;
            }
            return score;
        });
        
        const totalScore = factorScores.reduce((sum, score) => sum + score, 0);
        
        // Final validation: ensure totalScore is valid
        const validatedTotalScore = (isNaN(totalScore) || !isFinite(totalScore)) ? 0 : totalScore;
        
        const scoreBreakdown = {
            totalScore: Math.round(validatedTotalScore),
            factors: factors,
            status: validatedTotalScore >= 85 ? 'excellent' : 
                   validatedTotalScore >= 70 ? 'good' : 
                   validatedTotalScore >= 50 ? 'needsWork' : 'critical',
            suggestions: generateImprovementSuggestions({ factors }),
            peerComparison: getPeerComparison(inputs, validatedTotalScore),
            generatedAt: new Date().toISOString(),
            debugInfo: {
                inputFieldsFound: Object.keys(inputs).length,
                calculationMethod: 'enhanced_field_mapping',
                zeroScoreFactors: Object.entries(factors)
                    .filter(([_, factor]) => factor.score === 0)
                    .map(([name, factor]) => ({ name, reason: factor.details?.calculationMethod || 'unknown' })),
                fieldDiagnostics: fieldDiagnostics ? {
                    foundFields: Object.keys(fieldDiagnostics.foundFields),
                    missingFields: Object.keys(fieldDiagnostics.missingFields),
                    criticalIssues: fieldDiagnostics.criticalIssues
                } : null,
                usingFieldMappingBridge: !!window.fieldMappingBridge
            }
        };
        
        console.log('✅ Financial health score calculated:', scoreBreakdown.totalScore, scoreBreakdown.status);
        console.log('⚠️ Zero score factors:', scoreBreakdown.debugInfo.zeroScoreFactors);
        
        // Log final score to session storage
        if (window.sessionStorageGist) {
            window.sessionStorageGist.logFinancialHealthScore({
                totalScore: scoreBreakdown.totalScore,
                status: scoreBreakdown.status,
                factors: Object.keys(scoreBreakdown.factors).reduce((acc, key) => {
                    acc[key] = {
                        score: scoreBreakdown.factors[key].score,
                        status: scoreBreakdown.factors[key].details?.status || 'calculated'
                    };
                    return acc;
                }, {}),
                criticalFactors: scoreBreakdown.debugInfo?.zeroScoreFactors || [],
                calculationSuccessful: true
            });
        }
        
        return scoreBreakdown;
        
    } catch (error) {
        console.error('❌ Error calculating financial health score:', error);
        
        // Log error to session storage
        if (window.sessionStorageGist) {
            window.sessionStorageGist.logError(error, { 
                context: 'financial-health-calculation',
                inputs: inputs ? Object.keys(inputs) : []
            });
            
            window.sessionStorageGist.logFinancialHealthScore({
                totalScore: 0,
                status: 'error',
                factors: {},
                error: error.message,
                calculationSuccessful: false
            });
        }
        
        return {
            totalScore: 0,
            factors: {},
            status: 'error',
            suggestions: [],
            peerComparison: null,
            error: error.message
        };
    }
}

// Validate financial inputs for completeness and correctness
function validateFinancialInputs(inputs) {
    const errors = [];
    const warnings = [];
    const criticalMissing = [];
    
    // Helper function for safe validation
    const validateNumericField = (fieldName, value, min, max, required = false) => {
        if (value === undefined || value === null || value === '') {
            if (required) {
                errors.push(`${fieldName} is required`);
            }
            return false;
        }
        
        const numValue = safeParseFloat(value, NaN);
        if (isNaN(numValue)) {
            errors.push(`${fieldName} must be a valid number`);
            return false;
        }
        
        if (min !== undefined && numValue < min) {
            errors.push(`${fieldName} must be at least ${min}`);
            return false;
        }
        
        if (max !== undefined && numValue > max) {
            errors.push(`${fieldName} must be no more than ${max}`);
            return false;
        }
        
        return true;
    };
    
    // Required fields validation
    if (!validateNumericField('Current age', inputs.currentAge, 18, 100, true)) {
        criticalMissing.push('currentAge');
    }
    
    if (!inputs.retirementAge) {
        errors.push('Retirement age is required');
        criticalMissing.push('retirementAge');
    } else {
        const currentAge = safeParseFloat(inputs.currentAge, 30);
        const retirementAge = safeParseFloat(inputs.retirementAge, 67);
        if (retirementAge <= currentAge) {
            errors.push('Retirement age must be greater than current age');
        }
        if (retirementAge > 100) {
            errors.push('Retirement age must be less than 100');
        }
    }
    
    // Currency validation
    const validCurrencies = ['ILS', 'USD', 'EUR', 'GBP', 'BTC', 'ETH'];
    if (!inputs.currency || !validCurrencies.includes(inputs.currency)) {
        warnings.push('Unsupported currency, using ILS as default');
        inputs.currency = 'ILS';
    }
    
    // Planning type validation
    if (!inputs.planningType || !['individual', 'couple'].includes(inputs.planningType)) {
        errors.push('Planning type must be either "individual" or "couple"');
    }
    
    // Couple mode specific validation
    if (inputs.planningType === 'couple') {
        // Check for partner age
        if (!inputs.partnerCurrentAge || inputs.partnerCurrentAge < 18 || inputs.partnerCurrentAge > 100) {
            warnings.push('Partner age missing or invalid');
        }
        
        // Check for partner retirement age
        if (!inputs.partnerRetirementAge || inputs.partnerRetirementAge <= inputs.partnerCurrentAge) {
            warnings.push('Partner retirement age should be greater than partner current age');
        }
        
        // Check for partner salary data
        if (!inputs.partner1Salary && !inputs.partner2Salary) {
            warnings.push('No partner salary data provided');
        }
    }
    
    // Numeric field validation
    const numericFields = [
        'currentMonthlySalary', 'monthlyPensionIncome', 'currentMonthlyExpenses',
        'currentPensionSavings', 'currentPersonalPortfolio', 'emergencyFund',
        'currentBankAccount', 'currentCrypto', 'currentRealEstate'
    ];
    
    numericFields.forEach(field => {
        if (inputs[field] !== undefined && inputs[field] !== null && inputs[field] !== '') {
            const value = parseFloat(inputs[field]);
            if (isNaN(value) || value < 0) {
                warnings.push(`${field} must be a positive number`);
            }
        }
    });
    
    // Percentage validation
    const percentageFields = [
        'pensionEmployeeRate', 'pensionEmployerRate', 
        'trainingFundEmployeeRate', 'trainingFundEmployerRate',
        'personalPortfolioReturn', 'cryptoReturn'
    ];
    
    percentageFields.forEach(field => {
        if (inputs[field] !== undefined && inputs[field] !== null && inputs[field] !== '') {
            const value = parseFloat(inputs[field]);
            if (isNaN(value) || value < 0 || value > 100) {
                warnings.push(`${field} must be between 0 and 100`);
            }
        }
    });
    
    // RSU validation
    if (inputs.rsuUnits || inputs.rsuCurrentStockPrice) {
        if (!inputs.rsuUnits || inputs.rsuUnits <= 0) {
            warnings.push('RSU units must be greater than 0');
        }
        if (!inputs.rsuCurrentStockPrice || inputs.rsuCurrentStockPrice <= 0) {
            warnings.push('RSU stock price must be greater than 0');
        }
        if (!inputs.rsuFrequency) {
            warnings.push('RSU frequency not specified');
        }
    }
    
    // Expense validation
    if (inputs.expenses && typeof inputs.expenses === 'object') {
        Object.entries(inputs.expenses).forEach(([category, amount]) => {
            const value = parseFloat(amount);
            if (isNaN(value) || value < 0) {
                warnings.push(`Expense category "${category}" must be a positive number`);
            }
        });
    }
    
    // Risk tolerance validation
    const validRiskLevels = ['conservative', 'moderate', 'aggressive'];
    if (inputs.riskTolerance && !validRiskLevels.includes(inputs.riskTolerance)) {
        warnings.push('Risk tolerance should be conservative, moderate, or aggressive');
    }
    
    // Data quality assessment
    let dataCompleteness = 0;
    const dataFields = [
        'currentMonthlySalary', 'currentPensionSavings', 'emergencyFund',
        'pensionEmployeeRate', 'pensionEmployerRate', 'currentPersonalPortfolio',
        'currentRealEstate', 'currentCrypto', 'expenses'
    ];
    
    dataFields.forEach(field => {
        if (inputs[field] && inputs[field] !== '0') {
            dataCompleteness++;
        }
    });
    
    const completenessPercentage = Math.round((dataCompleteness / dataFields.length) * 100);
    
    if (completenessPercentage < 30) {
        warnings.push(`Low data completeness (${completenessPercentage}%). Consider adding more financial information for accurate scoring.`);
    }
    
    // Generate recommendations based on missing data
    const recommendations = [];
    
    if (!inputs.currentMonthlySalary && !inputs.monthlyIncome) {
        recommendations.push({
            field: 'income',
            message: 'Add monthly income for accurate savings rate calculation',
            impact: 'high'
        });
    }
    
    if (!inputs.emergencyFund && !inputs.currentBankAccount) {
        recommendations.push({
            field: 'emergencyFund',
            message: 'Add emergency fund amount to assess financial resilience',
            impact: 'medium'
        });
    }
    
    if (!inputs.pensionEmployeeRate && !inputs.pensionContributionRate) {
        recommendations.push({
            field: 'contributions',
            message: 'Add pension contribution rates to calculate savings rate',
            impact: 'high'
        });
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors,
        warnings: warnings,
        criticalMissing: criticalMissing,
        recommendations: recommendations,
        summary: {
            errorCount: errors.length,
            warningCount: warnings.length,
            hasRequiredFields: criticalMissing.length === 0,
            hasCompleteData: warnings.length === 0,
            dataCompleteness: completenessPercentage,
            validationLevel: errors.length === 0 ? 
                (warnings.length === 0 ? 'complete' : 'partial') : 'invalid'
        }
    };
}

// Export functions to window for global access
window.calculateFinancialHealthScore = calculateFinancialHealthScore;
window.SCORE_FACTORS = SCORE_FACTORS;
window.generateImprovementSuggestions = generateImprovementSuggestions;
window.getPeerComparison = getPeerComparison;
window.validateFinancialInputs = validateFinancialInputs;

// Export individual calculator functions to prevent conflicts
window.financialHealthEngine = {
    calculateSavingsRateScore,
    calculateRetirementReadinessScore,
    calculateTimeHorizonScore,
    calculateRiskAlignmentScore,
    calculateDiversificationScore,
    calculateTaxEfficiencyScore,
    calculateEmergencyFundScore,
    calculateDebtManagementScore,
    validateFinancialInputs,
    getFieldValue
};

// Also export individual calculator functions directly to window for backward compatibility
window.calculateSavingsRateScore = calculateSavingsRateScore;
window.calculateRetirementReadinessScore = calculateRetirementReadinessScore;
window.calculateTimeHorizonScore = calculateTimeHorizonScore;
window.calculateRiskAlignmentScore = calculateRiskAlignmentScore;
window.calculateDiversificationScore = calculateDiversificationScore;
window.calculateTaxEfficiencyScore = calculateTaxEfficiencyScore;
window.calculateEmergencyFundScore = calculateEmergencyFundScore;
window.calculateDebtManagementScore = calculateDebtManagementScore;

// Also export getFieldValue directly for backward compatibility
window.getFieldValue = getFieldValue;

console.log('✅ Financial Health Engine loaded successfully');