// Enhanced Financial Health Validation with Bilingual Support
// Integrates with financialHealthMessages for Hebrew/English error messages

(function() {
    'use strict';
    
    // Enhanced validation function with bilingual support
    function enhancedValidateFinancialInputs(inputs) {
        const errors = [];
        const warnings = [];
        const criticalMissing = [];
        const language = inputs.language || window.currentLanguage || 'en';
        const msg = window.financialHealthMessages;
        
        // Helper function for safe validation with bilingual messages
        const validateNumericField = (fieldName, value, min, max, required = false) => {
            if (value === undefined || value === null || value === '') {
                if (required) {
                    const errorMsg = msg ? 
                        msg.getMessage('fieldErrors', fieldName, language) || 
                        msg.getMessage('errors', 'missingRequiredField', language) :
                        `${fieldName} is required`;
                    errors.push(errorMsg);
                    criticalMissing.push(fieldName);
                }
                return false;
            }
            
            const numValue = parseFloat(value);
            if (isNaN(numValue)) {
                const errorMsg = msg ?
                    msg.getMessage('errors', 'invalidNumericValue', language) :
                    `${fieldName} must be a valid number`;
                errors.push(errorMsg);
                return false;
            }
            
            if (min !== undefined && numValue < min) {
                const errorMsg = msg ?
                    msg.getMessage('fieldErrors', fieldName, language) :
                    `${fieldName} must be at least ${min}`;
                errors.push(errorMsg);
                return false;
            }
            
            if (max !== undefined && numValue > max) {
                const errorMsg = msg ?
                    msg.getMessage('fieldErrors', fieldName, language) :
                    `${fieldName} must be at most ${max}`;
                errors.push(errorMsg);
                return false;
            }
            
            return true;
        };
        
        // Age validations
        if (!validateNumericField('currentAge', inputs.currentAge, 18, 100, true)) {
            // Error already added
        }
        
        if (!validateNumericField('retirementAge', inputs.retirementAge, inputs.currentAge || 18, 100, true)) {
            // Error already added
        } else if (inputs.retirementAge && inputs.currentAge && inputs.retirementAge < inputs.currentAge) {
            const errorMsg = msg ?
                msg.getMessage('errors', 'retirementBeforeCurrent', language) :
                'Retirement age cannot be before current age';
            errors.push(errorMsg);
        }
        
        // Planning type validation
        if (!inputs.planningType || !['individual', 'couple'].includes(inputs.planningType)) {
            const errorMsg = msg ?
                msg.getMessage('errors', 'invalidPlanningType', language) :
                'Planning type must be individual or couple';
            errors.push(errorMsg);
        }
        
        // Currency validation
        const validCurrencies = ['ILS', 'USD', 'EUR', 'GBP', 'BTC', 'ETH'];
        if (!inputs.currency || !validCurrencies.includes(inputs.currency)) {
            const errorMsg = msg ?
                msg.getMessage('errors', 'invalidCurrency', language) :
                'Invalid currency selected';
            errors.push(errorMsg);
        }
        
        // Salary validation
        const salaryFields = inputs.planningType === 'couple' ? 
            ['partner1Salary', 'partner2Salary'] : 
            ['currentMonthlySalary'];
            
        salaryFields.forEach(field => {
            if (inputs[field] !== undefined && inputs[field] < 0) {
                const errorMsg = msg ?
                    msg.getMessage('errors', 'negativeSalary', language) :
                    'Salary cannot be negative';
                errors.push(errorMsg);
            }
        });
        
        // Pension rate validations
        validateNumericField('pensionEmployeeRate', inputs.pensionEmployeeRate, 0, 20);
        validateNumericField('pensionEmployerRate', inputs.pensionEmployerRate, 0, 25);
        
        // Savings validations
        if (inputs.currentPensionSavings !== undefined && inputs.currentPensionSavings < 0) {
            const errorMsg = msg ?
                msg.getMessage('errors', 'negativeSavings', language) :
                'Savings cannot be negative';
            errors.push(errorMsg);
        }
        
        // Emergency fund validation
        validateNumericField('emergencyFund', inputs.emergencyFund, 0);
        
        // Debt validations
        validateNumericField('totalDebt', inputs.totalDebt, 0);
        validateNumericField('monthlyDebtPayments', inputs.monthlyDebtPayments, 0);
        
        // Check debt payments don't exceed income
        const monthlyIncome = inputs.planningType === 'couple' ?
            (parseFloat(inputs.partner1Salary || 0) + parseFloat(inputs.partner2Salary || 0)) :
            parseFloat(inputs.currentMonthlySalary || 0);
            
        if (inputs.monthlyDebtPayments && monthlyIncome && inputs.monthlyDebtPayments > monthlyIncome) {
            const errorMsg = msg ?
                msg.getMessage('fieldErrors', 'monthlyDebtPayments', language) :
                'Monthly debt payments cannot exceed monthly income';
            errors.push(errorMsg);
        }
        
        // RSU validations
        if (inputs.rsuUnits) {
            validateNumericField('rsuUnits', inputs.rsuUnits, 0);
            validateNumericField('rsuCurrentStockPrice', inputs.rsuCurrentStockPrice, 0.01);
        }
        
        // Generate warnings
        if (errors.length === 0) {
            // Low savings rate warning
            const savingsRate = calculateSavingsRate(inputs);
            if (savingsRate < 10) {
                const warningMsg = msg ?
                    msg.getMessage('warnings', 'lowSavingsRate', language) :
                    'Your savings rate is below recommended levels';
                warnings.push(warningMsg);
            }
            
            // No emergency fund warning
            if (!inputs.emergencyFund || inputs.emergencyFund === 0) {
                const warningMsg = msg ?
                    msg.getMessage('warnings', 'noEmergencyFund', language) :
                    'Consider building an emergency fund';
                warnings.push(warningMsg);
            }
            
            // High debt ratio warning
            if (inputs.totalDebt && monthlyIncome) {
                const debtToIncomeRatio = inputs.totalDebt / (monthlyIncome * 12);
                if (debtToIncomeRatio > 3) {
                    const warningMsg = msg ?
                        msg.getMessage('warnings', 'highDebtRatio', language) :
                        'Your debt-to-income ratio is high';
                    warnings.push(warningMsg);
                }
            }
            
            // Approaching retirement warning
            if (inputs.currentAge && inputs.retirementAge) {
                const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
                if (yearsToRetirement <= 5) {
                    const warningMsg = msg ?
                        msg.getMessage('warnings', 'retirementSoon', language) :
                        "You're approaching retirement - review your plan";
                    warnings.push(warningMsg);
                }
            }
            
            // Missing partner data warning (couple mode)
            if (inputs.planningType === 'couple') {
                const partner1Complete = inputs.partner1Salary && inputs.partner1Age;
                const partner2Complete = inputs.partner2Salary && inputs.partner2Age;
                if (!partner1Complete || !partner2Complete) {
                    const warningMsg = msg ?
                        msg.getMessage('warnings', 'missingPartnerData', language) :
                        'Some partner data is missing';
                    warnings.push(warningMsg);
                }
            }
        }
        
        // Calculate data completeness
        const expectedFields = [
            'currentAge', 'retirementAge', 'planningType', 'currency',
            inputs.planningType === 'couple' ? 'partner1Salary' : 'currentMonthlySalary',
            'pensionEmployeeRate', 'pensionEmployerRate', 'currentPensionSavings',
            'emergencyFund', 'totalDebt', 'monthlyDebtPayments'
        ];
        
        const providedFields = expectedFields.filter(field => 
            inputs[field] !== undefined && inputs[field] !== null && inputs[field] !== ''
        );
        
        const dataCompleteness = Math.round((providedFields.length / expectedFields.length) * 100);
        
        // Add incomplete profile warning if needed
        if (dataCompleteness < 80 && errors.length === 0) {
            const warningMsg = msg ?
                msg.getMessage('warnings', 'incompleteProfile', language) :
                'Complete your profile for more accurate results';
            warnings.push(warningMsg);
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors,
            warnings: warnings,
            criticalMissing: criticalMissing,
            summary: {
                totalErrors: errors.length,
                totalWarnings: warnings.length,
                dataCompleteness: dataCompleteness,
                criticalFieldsMissing: criticalMissing.length
            }
        };
    }
    
    // Helper function to calculate savings rate
    function calculateSavingsRate(inputs) {
        const monthlyIncome = inputs.planningType === 'couple' ?
            (parseFloat(inputs.partner1Salary || 0) + parseFloat(inputs.partner2Salary || 0)) :
            parseFloat(inputs.currentMonthlySalary || 0);
            
        if (!monthlyIncome) return 0;
        
        const pensionEmployee = parseFloat(inputs.pensionEmployeeRate || 0) / 100;
        const pensionEmployer = parseFloat(inputs.pensionEmployerRate || 0) / 100;
        const totalSavingsRate = (pensionEmployee + pensionEmployer) * 100;
        
        return totalSavingsRate;
    }
    
    // Replace the original validation function if it exists
    if (window.validateFinancialInputs) {
        window.originalValidateFinancialInputs = window.validateFinancialInputs;
    }
    
    // Export enhanced validation
    window.validateFinancialInputs = enhancedValidateFinancialInputs;
    window.financialHealthValidation = {
        validate: enhancedValidateFinancialInputs,
        calculateSavingsRate: calculateSavingsRate
    };
    
    console.log('✅ Enhanced Financial Health Validation loaded (with bilingual support)');
})();