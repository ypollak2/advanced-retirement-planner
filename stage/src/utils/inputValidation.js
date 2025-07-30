// Comprehensive Input Validation and XSS Protection Utility
// Provides centralized validation and sanitization for all user inputs

window.InputValidation = (function() {
    'use strict';

    // XSS Protection: HTML entity encoding
    function escapeHtml(str) {
        if (typeof str !== 'string') return str;
        
        const htmlEntities = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
        };
        
        return str.replace(/[&<>"'`=\/]/g, function(match) {
            return htmlEntities[match];
        });
    }

    // Strip HTML tags completely
    function stripHtmlTags(str) {
        if (typeof str !== 'string') return str;
        return str.replace(/<[^>]*>/g, '');
    }

    // Validation rules
    const validators = {
        // Number validation with bounds
        number: function(value, options = {}) {
            const num = parseFloat(value);
            
            if (isNaN(num)) {
                return { 
                    valid: false, 
                    value: options.default || 0,
                    error: 'Must be a valid number'
                };
            }

            let finalValue = num;
            let errors = [];

            // Check minimum
            if (options.min !== undefined && num < options.min) {
                finalValue = options.min;
                errors.push(`Minimum value is ${options.min}`);
            }

            // Check maximum
            if (options.max !== undefined && num > options.max) {
                finalValue = options.max;
                errors.push(`Maximum value is ${options.max}`);
            }

            // Check integer requirement
            if (options.integer && !Number.isInteger(num)) {
                finalValue = Math.round(num);
                errors.push('Must be a whole number');
            }

            // Check decimal places
            if (options.decimals !== undefined) {
                finalValue = parseFloat(num.toFixed(options.decimals));
            }

            return {
                valid: errors.length === 0,
                value: finalValue,
                error: errors.join(', ')
            };
        },

        // Age validation (18-120)
        age: function(value) {
            return validators.number(value, {
                min: 18,
                max: 120,
                integer: true,
                default: 30
            });
        },

        // Percentage validation (0-100)
        percentage: function(value) {
            return validators.number(value, {
                min: 0,
                max: 100,
                decimals: 2,
                default: 0
            });
        },

        // Currency validation (positive values)
        currency: function(value, options = {}) {
            return validators.number(value, {
                min: 0,
                max: options.max || 999999999,
                decimals: 2,
                default: 0
            });
        },
        
        // Retirement-specific currency validation (smaller reasonable limits)
        retirementCurrency: function(value, options = {}) {
            return validators.number(value, {
                min: 0,
                max: options.max || 10000000, // ₪10M max for individual savings categories
                decimals: 2,
                default: 0
            });
        },
        
        // Expected return validation (0-12% reasonable range)
        expectedReturn: function(value) {
            const result = validators.number(value, {
                min: 0,
                max: 12, // 12% maximum reasonable return
                decimals: 2,
                default: 7
            });
            
            // Add reality check warnings
            if (result.valid && result.value > 10) {
                result.warning = 'Returns above 10% are historically rare and may lead to unrealistic projections';
            } else if (result.valid && result.value > 8) {
                result.warning = 'Returns above 8% should be used cautiously for long-term planning';
            }
            
            return result;
        },
        
        // Savings rate validation with reality checks
        savingsRate: function(value, monthlyIncome = 0) {
            const result = validators.number(value, {
                min: 0,
                max: 50, // 50% maximum savings rate
                decimals: 2,
                default: 10
            });
            
            // Reality check based on income level
            if (result.valid && monthlyIncome > 0) {
                const monthlySavings = (monthlyIncome * result.value) / 100;
                
                if (result.value > 30) {
                    result.warning = 'Savings rates above 30% are extremely difficult to maintain long-term';
                } else if (result.value > 20) {
                    result.warning = 'High savings rate - ensure this is sustainable with your lifestyle';
                } else if (monthlySavings > monthlyIncome * 0.8) {
                    result.warning = 'Saving more than 80% of income is typically unrealistic';
                }
            }
            
            return result;
        },
        
        // Retirement projection reality check
        retirementProjectionInputs: function(inputs) {
            const warnings = [];
            const errors = [];
            
            const currentAge = parseInt(inputs.currentAge || 30);
            const retirementAge = parseInt(inputs.retirementAge || 67);
            const expectedReturn = parseFloat(inputs.expectedAnnualReturn || 7);
            const savingsRate = (parseFloat(inputs.pensionContributionRate || 0) + parseFloat(inputs.trainingFundContributionRate || 0));
            const yearsToRetirement = retirementAge - currentAge;
            
            // Check for unrealistic combinations
            if ((expectedReturn > 8 && yearsToRetirement > 30) || (expectedReturn > 10 && yearsToRetirement > 20)) {
                warnings.push('High expected returns over long time periods may produce unrealistic projections');
            }
            
            if (savingsRate > 25 && expectedReturn > 8) {
                warnings.push('Combination of high savings rate and high returns may be overly optimistic');
            }
            
            if (yearsToRetirement > 40) {
                warnings.push('Very long investment horizons increase projection uncertainty');
            }
            
            // Check for extremely conservative scenarios
            if (expectedReturn < 3 && savingsRate < 5) {
                warnings.push('Very conservative assumptions may underestimate retirement readiness');
            }
            
            return {
                isValid: errors.length === 0,
                warnings: warnings,
                errors: errors,
                riskLevel: this.calculateAssumptionRiskLevel(inputs)
            };
        },
        
        // Calculate risk level of assumptions
        calculateAssumptionRiskLevel: function(inputs) {
            const expectedReturn = parseFloat(inputs.expectedAnnualReturn || 7);
            const savingsRate = (parseFloat(inputs.pensionContributionRate || 0) + parseFloat(inputs.trainingFundContributionRate || 0));
            const yearsToRetirement = (parseInt(inputs.retirementAge || 67)) - (parseInt(inputs.currentAge || 30));
            
            let riskScore = 0;
            
            // Return rate risk
            if (expectedReturn > 10) riskScore += 3;
            else if (expectedReturn > 8) riskScore += 2;
            else if (expectedReturn > 6) riskScore += 1;
            
            // Savings rate risk
            if (savingsRate > 25) riskScore += 2;
            else if (savingsRate > 15) riskScore += 1;
            
            // Time horizon risk
            if (yearsToRetirement > 35) riskScore += 2;
            else if (yearsToRetirement > 25) riskScore += 1;
            
            if (riskScore >= 5) return 'high';
            if (riskScore >= 3) return 'medium';
            return 'low';
        },
        
        // Retirement age validation with reasonable bounds
        retirementAge: function(value, currentAge = 30) {
            return validators.number(value, {
                min: currentAge + 5, // At least 5 years from current age
                max: 75, // Maximum reasonable retirement age
                integer: true,
                default: 67
            });
        },

        // String validation with XSS protection
        string: function(value, options = {}) {
            if (typeof value !== 'string') {
                return {
                    valid: false,
                    value: '',
                    error: 'Must be a string'
                };
            }

            let finalValue = value.trim();

            // Strip HTML tags if required
            if (options.stripHtml !== false) {
                finalValue = stripHtmlTags(finalValue);
            }

            // Escape HTML entities
            if (options.escapeHtml !== false) {
                finalValue = escapeHtml(finalValue);
            }

            // Check length constraints
            if (options.maxLength && finalValue.length > options.maxLength) {
                finalValue = finalValue.substring(0, options.maxLength);
            }

            if (options.minLength && finalValue.length < options.minLength) {
                return {
                    valid: false,
                    value: finalValue,
                    error: `Minimum length is ${options.minLength} characters`
                };
            }

            // Check against regex pattern
            if (options.pattern && !options.pattern.test(finalValue)) {
                return {
                    valid: false,
                    value: finalValue,
                    error: options.patternError || 'Invalid format'
                };
            }

            // Check against blacklist patterns (SQL injection, XSS)
            const dangerousPatterns = [
                /(<script|<\/script|javascript:|onerror=|onclick=)/gi,
                /(union\s+select|drop\s+table|insert\s+into|delete\s+from)/gi,
                /(\\x[0-9a-f]{2}|\\u[0-9a-f]{4})/gi
            ];

            for (const pattern of dangerousPatterns) {
                if (pattern.test(finalValue)) {
                    return {
                        valid: false,
                        value: '',
                        error: 'Invalid characters detected'
                    };
                }
            }

            return {
                valid: true,
                value: finalValue,
                error: null
            };
        },

        // Email validation
        email: function(value) {
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            
            const stringResult = validators.string(value, {
                maxLength: 254,
                pattern: emailPattern,
                patternError: 'Invalid email format'
            });

            return stringResult;
        },

        // Date validation
        date: function(value, options = {}) {
            const date = new Date(value);
            
            if (isNaN(date.getTime())) {
                return {
                    valid: false,
                    value: new Date(),
                    error: 'Invalid date'
                };
            }

            const now = new Date();
            
            // Check if future dates are allowed
            if (options.allowFuture === false && date > now) {
                return {
                    valid: false,
                    value: now,
                    error: 'Future dates are not allowed'
                };
            }

            // Check if past dates are allowed
            if (options.allowPast === false && date < now) {
                return {
                    valid: false,
                    value: now,
                    error: 'Past dates are not allowed'
                };
            }

            // Check date range
            if (options.minDate && date < new Date(options.minDate)) {
                return {
                    valid: false,
                    value: new Date(options.minDate),
                    error: `Date must be after ${options.minDate}`
                };
            }

            if (options.maxDate && date > new Date(options.maxDate)) {
                return {
                    valid: false,
                    value: new Date(options.maxDate),
                    error: `Date must be before ${options.maxDate}`
                };
            }

            return {
                valid: true,
                value: date,
                error: null
            };
        }
    };

    // Sanitize object of inputs
    function sanitizeInputs(inputs) {
        const sanitized = {};
        
        for (const key in inputs) {
            if (inputs.hasOwnProperty(key)) {
                const value = inputs[key];
                
                if (typeof value === 'string') {
                    sanitized[key] = stripHtmlTags(escapeHtml(value));
                } else if (typeof value === 'number') {
                    sanitized[key] = isNaN(value) ? 0 : value;
                } else if (value === null || value === undefined) {
                    sanitized[key] = '';
                } else {
                    sanitized[key] = value;
                }
            }
        }
        
        return sanitized;
    }

    // Create a debounced validation function
    function createDebouncedValidator(validator, delay = 300) {
        let timeoutId;
        
        return function(value, options) {
            clearTimeout(timeoutId);
            
            return new Promise(function(resolve) {
                timeoutId = setTimeout(function() {
                    resolve(validator(value, options));
                }, delay);
            });
        };
    }

    // Check if required fields are present and valid
    function validateRequiredFields(formData, requiredFields, language = 'en') {
        const errors = {};
        let isValid = true;
        
        const messages = {
            en: {
                required: 'This field is required',
                mustBeNumber: 'Must be a valid number',
                mustBePositive: 'Must be a positive number',
                ageTooLow: 'Age must be at least 18',
                ageTooHigh: 'Age must be less than 100',
                retirementAgeInvalid: 'Retirement age must be higher than current age'
            },
            he: {
                required: 'שדה זה נדרש',
                mustBeNumber: 'חייב להיות מספר תקין',
                mustBePositive: 'חייב להיות מספר חיובי',
                ageTooLow: 'גיל חייב להיות לפחות 18',
                ageTooHigh: 'גיל חייב להיות פחות מ-100',
                retirementAgeInvalid: 'גיל פרישה חייב להיות גבוה מהגיל הנוכחי'
            }
        };
        
        const t = messages[language] || messages.en;
        
        for (const field of requiredFields) {
            const value = formData[field];
            
            // Check if field exists and has a value
            if (value === undefined || value === null || value === '' || 
                (typeof value === 'string' && value.trim() === '')) {
                errors[field] = t.required;
                isValid = false;
                continue;
            }
            
            // Specific validation for age fields
            if (field.toLowerCase().includes('age')) {
                const age = parseInt(value);
                if (isNaN(age)) {
                    errors[field] = t.mustBeNumber;
                    isValid = false;
                } else if (age < 18) {
                    errors[field] = t.ageTooLow;
                    isValid = false;
                } else if (age > 100) {
                    errors[field] = t.ageTooHigh;
                    isValid = false;
                } else if (field.toLowerCase().includes('retirement')) {
                    const currentAge = parseInt(formData.currentAge) || 0;
                    if (age <= currentAge) {
                        errors[field] = t.retirementAgeInvalid;
                        isValid = false;
                    }
                }
            }
            
            // Specific validation for salary/currency fields
            if (field.toLowerCase().includes('salary') || field.toLowerCase().includes('income')) {
                const salary = parseFloat(value);
                if (isNaN(salary)) {
                    errors[field] = t.mustBeNumber;
                    isValid = false;
                } else if (salary < 0) {
                    errors[field] = t.mustBePositive;
                    isValid = false;
                }
            }
        }
        
        return { isValid, errors };
    }

    // Validate and sanitize form data
    function validateForm(formData, schema) {
        const results = {};
        const errors = {};
        const values = {};
        let isValid = true;

        for (const field in schema) {
            if (schema.hasOwnProperty(field)) {
                const fieldSchema = schema[field];
                const value = formData[field];
                const validator = validators[fieldSchema.type];

                if (!validator) {
                    console.error(`Unknown validator type: ${fieldSchema.type}`);
                    continue;
                }

                const result = validator(value, fieldSchema.options);
                results[field] = result;
                values[field] = result.value;

                if (!result.valid) {
                    errors[field] = result.error;
                    isValid = false;
                }
            }
        }

        return {
            isValid,
            values,
            errors,
            results
        };
    }

    // Public API
    return {
        validators: validators,
        escapeHtml: escapeHtml,
        stripHtmlTags: stripHtmlTags,
        sanitizeInputs: sanitizeInputs,
        validateForm: validateForm,
        validateRequiredFields: validateRequiredFields,
        createDebouncedValidator: createDebouncedValidator,
        
        // Convenience methods for common validations
        validateAge: function(value) { return validators.age(value); },
        validateCurrency: function(value, options) { return validators.currency(value, options); },
        validatePercentage: function(value) { return validators.percentage(value); },
        validateEmail: function(value) { return validators.email(value); },
        validateString: function(value, options) { return validators.string(value, options); }
    };
})();