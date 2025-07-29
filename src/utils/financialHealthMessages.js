// Financial Health Bilingual Error and Validation Messages
// Supports Hebrew and English for all validation scenarios

(function() {
    'use strict';
    
    // Message definitions
    const messages = {
        // Validation errors
        errors: {
            ageInvalid: {
                en: "Current age must be between 18 and 100 years",
                he: "הגיל הנוכחי חייב להיות בין 18 ל-100 שנים"
            },
            retirementAgeInvalid: {
                en: "Retirement age must be between current age and 100",
                he: "גיל הפרישה חייב להיות בין הגיל הנוכחי ל-100"
            },
            retirementBeforeCurrent: {
                en: "Retirement age cannot be before current age",
                he: "גיל הפרישה לא יכול להיות לפני הגיל הנוכחי"
            },
            invalidPlanningType: {
                en: "Planning type must be 'individual' or 'couple'",
                he: "סוג התכנון חייב להיות 'יחיד' או 'זוג'"
            },
            invalidCurrency: {
                en: "Invalid currency selected",
                he: "נבחר מטבע לא חוקי"
            },
            negativeSalary: {
                en: "Salary cannot be negative",
                he: "המשכורת לא יכולה להיות שלילית"
            },
            negativeSavings: {
                en: "Savings cannot be negative",
                he: "החיסכון לא יכול להיות שלילי"
            },
            invalidPercentage: {
                en: "Percentage must be between 0 and 100",
                he: "האחוז חייב להיות בין 0 ל-100"
            },
            missingRequiredField: {
                en: "This field is required",
                he: "שדה זה הוא חובה"
            },
            invalidNumericValue: {
                en: "Please enter a valid number",
                he: "אנא הזן מספר תקין"
            },
            calculationError: {
                en: "An error occurred during calculation",
                he: "אירעה שגיאה במהלך החישוב"
            },
            dataIncomplete: {
                en: "Some required data is missing",
                he: "חסרים נתונים נדרשים"
            }
        },
        
        // Validation warnings
        warnings: {
            lowSavingsRate: {
                en: "Your savings rate is below recommended levels",
                he: "שיעור החיסכון שלך נמוך מהמומלץ"
            },
            highDebtRatio: {
                en: "Your debt-to-income ratio is high",
                he: "יחס החוב להכנסה שלך גבוה"
            },
            noEmergencyFund: {
                en: "Consider building an emergency fund",
                he: "כדאי לבנות קרן חירום"
            },
            retirementSoon: {
                en: "You're approaching retirement - review your plan",
                he: "אתה מתקרב לפרישה - בדוק את התוכנית שלך"
            },
            lowPensionContribution: {
                en: "Consider increasing pension contributions",
                he: "שקול להגדיל את ההפרשות לפנסיה"
            },
            missingPartnerData: {
                en: "Some partner data is missing",
                he: "חסרים נתונים של בן/בת הזוג"
            },
            incompleteProfile: {
                en: "Complete your profile for more accurate results",
                he: "השלם את הפרופיל שלך לתוצאות מדויקות יותר"
            },
            noInvestments: {
                en: "Consider diversifying with investments",
                he: "שקול לגוון עם השקעות"
            }
        },
        
        // Success messages
        success: {
            calculationComplete: {
                en: "Financial health score calculated successfully",
                he: "ציון הבריאות הפיננסית חושב בהצלחה"
            },
            dataValid: {
                en: "All data validated successfully",
                he: "כל הנתונים אומתו בהצלחה"
            },
            profileComplete: {
                en: "Your financial profile is complete",
                he: "הפרופיל הפיננסי שלך שלם"
            },
            goodHealth: {
                en: "Your financial health is strong",
                he: "הבריאות הפיננסית שלך חזקה"
            }
        },
        
        // Field-specific messages
        fieldErrors: {
            currentAge: {
                en: "Please enter a valid age between 18 and 100",
                he: "אנא הזן גיל תקף בין 18 ל-100"
            },
            retirementAge: {
                en: "Please enter a retirement age after your current age",
                he: "אנא הזן גיל פרישה אחרי הגיל הנוכחי שלך"
            },
            currentMonthlySalary: {
                en: "Please enter your monthly salary",
                he: "אנא הזן את המשכורת החודשית שלך"
            },
            pensionEmployeeRate: {
                en: "Employee pension rate must be between 0% and 20%",
                he: "שיעור הפנסיה של העובד חייב להיות בין 0% ל-20%"
            },
            pensionEmployerRate: {
                en: "Employer pension rate must be between 0% and 25%",
                he: "שיעור הפנסיה של המעסיק חייב להיות בין 0% ל-25%"
            },
            emergencyFund: {
                en: "Emergency fund amount cannot be negative",
                he: "סכום קרן החירום לא יכול להיות שלילי"
            },
            totalDebt: {
                en: "Total debt amount cannot be negative",
                he: "סך החוב לא יכול להיות שלילי"
            },
            monthlyDebtPayments: {
                en: "Monthly debt payments cannot exceed monthly income",
                he: "תשלומי החוב החודשיים לא יכולים לעלות על ההכנסה החודשית"
            },
            rsuUnits: {
                en: "RSU units must be a positive number",
                he: "מספר יחידות RSU חייב להיות חיובי"
            },
            rsuCurrentStockPrice: {
                en: "Stock price must be greater than 0",
                he: "מחיר המניה חייב להיות גדול מ-0"
            }
        },
        
        // Score explanations
        scoreExplanations: {
            excellent: {
                en: "Excellent financial health - keep up the great work!",
                he: "בריאות פיננסית מצוינת - המשך כך!"
            },
            good: {
                en: "Good financial health with room for improvement",
                he: "בריאות פיננסית טובה עם מקום לשיפור"
            },
            fair: {
                en: "Fair financial health - consider the suggested improvements",
                he: "בריאות פיננסית סבירה - שקול את השיפורים המוצעים"
            },
            needsImprovement: {
                en: "Your financial health needs attention",
                he: "הבריאות הפיננסית שלך דורשת תשומת לב"
            }
        },
        
        // Improvement suggestions
        suggestions: {
            increaseSavings: {
                en: "Increase your monthly savings by at least",
                he: "הגדל את החיסכון החודשי שלך בלפחות"
            },
            buildEmergencyFund: {
                en: "Build an emergency fund of 3-6 months expenses",
                he: "בנה קרן חירום של 3-6 חודשי הוצאות"
            },
            reduceDebt: {
                en: "Focus on reducing high-interest debt",
                he: "התמקד בהפחתת חובות בריבית גבוהה"
            },
            diversifyInvestments: {
                en: "Diversify your investment portfolio",
                he: "גוון את תיק ההשקעות שלך"
            },
            increasePension: {
                en: "Maximize pension contributions for tax benefits",
                he: "מקסם הפרשות לפנסיה להטבות מס"
            },
            reviewExpenses: {
                en: "Review and optimize monthly expenses",
                he: "בדוק ואופטם את ההוצאות החודשיות"
            }
        }
    };
    
    // Get message function
    function getMessage(category, key, language = 'en', params = {}) {
        const categoryMessages = messages[category];
        if (!categoryMessages) {
            console.warn(`Message category '${category}' not found`);
            return key;
        }
        
        const messageObj = categoryMessages[key];
        if (!messageObj) {
            console.warn(`Message key '${key}' not found in category '${category}'`);
            return key;
        }
        
        let message = messageObj[language] || messageObj['en'] || key;
        
        // Replace parameters in message
        Object.keys(params).forEach(param => {
            message = message.replace(`{${param}}`, params[param]);
        });
        
        return message;
    }
    
    // Get all messages for a category in a specific language
    function getCategoryMessages(category, language = 'en') {
        const categoryMessages = messages[category];
        if (!categoryMessages) return {};
        
        const result = {};
        Object.keys(categoryMessages).forEach(key => {
            result[key] = categoryMessages[key][language] || categoryMessages[key]['en'];
        });
        
        return result;
    }
    
    // Format validation result with bilingual messages
    function formatValidationResult(validation, language = 'en') {
        const formatted = {
            isValid: validation.isValid,
            errors: [],
            warnings: [],
            summary: {}
        };
        
        // Format errors
        if (validation.errors) {
            formatted.errors = validation.errors.map(error => {
                if (typeof error === 'string') {
                    // Try to find a matching error message
                    const errorKey = Object.keys(messages.errors).find(key => 
                        messages.errors[key].en.toLowerCase().includes(error.toLowerCase())
                    );
                    if (errorKey) {
                        return getMessage('errors', errorKey, language);
                    }
                    return error;
                }
                return error;
            });
        }
        
        // Format warnings
        if (validation.warnings) {
            formatted.warnings = validation.warnings.map(warning => {
                if (typeof warning === 'string') {
                    // Try to find a matching warning message
                    const warningKey = Object.keys(messages.warnings).find(key => 
                        messages.warnings[key].en.toLowerCase().includes(warning.toLowerCase())
                    );
                    if (warningKey) {
                        return getMessage('warnings', warningKey, language);
                    }
                    return warning;
                }
                return warning;
            });
        }
        
        // Format summary
        if (validation.summary) {
            formatted.summary = validation.summary;
        }
        
        return formatted;
    }
    
    // Get score explanation based on score value
    function getScoreExplanation(score, language = 'en') {
        if (score >= 80) {
            return getMessage('scoreExplanations', 'excellent', language);
        } else if (score >= 60) {
            return getMessage('scoreExplanations', 'good', language);
        } else if (score >= 40) {
            return getMessage('scoreExplanations', 'fair', language);
        } else {
            return getMessage('scoreExplanations', 'needsImprovement', language);
        }
    }
    
    // Export to window
    window.financialHealthMessages = {
        getMessage,
        getCategoryMessages,
        formatValidationResult,
        getScoreExplanation,
        messages
    };
    
    console.log('🌐 Financial Health Messages loaded (Hebrew/English support)');
})();