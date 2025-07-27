// WizardStepSalary.js - Step 2: Salary & Income
// Collects monthly salary and additional income sources

const WizardStepSalary = ({ inputs, setInputs, language = 'en', workingCurrency = 'ILS' }) => {
    // Component uses React.createElement for rendering
    const createElement = React.createElement;
    
    // Validation state for salary inputs
    const [validationErrors, setValidationErrors] = React.useState({});
    
    // Enhanced salary validation rules
    const validateSalary = (salary) => {
        if (salary < 0) return language === 'he' ? 'משכורת לא יכולה להיות שלילית' : 'Salary cannot be negative';
        if (salary > 500000) return language === 'he' ? 'משכורת גבוהה מדי (מקסימום 500,000)' : 'Salary too high (max 500,000)';
        return null;
    };
    
    // Net salary validation with logical checks
    const validateNetSalary = (netSalary, grossSalary) => {
        if (netSalary < 0) {
            return language === 'he' ? 'משכורת נטו לא יכולה להיות שלילית' : 'Net salary cannot be negative';
        }
        if (netSalary > grossSalary) {
            return language === 'he' ? 'משכורת נטו לא יכולה להיות גבוהה ממשכורת ברוטו' : 'Net salary cannot be higher than gross salary';
        }
        if (grossSalary > 0 && netSalary > 0) {
            const takeHomePercentage = (netSalary / grossSalary) * 100;
            if (takeHomePercentage < 30) {
                return language === 'he' ? 'משכורת נטו נמוכה מדי (פחות מ-30% ממשכורת ברוטו)' : 'Net salary too low (less than 30% of gross)';
            }
            if (takeHomePercentage > 95) {
                return language === 'he' ? 'משכורת נטו גבוהה מדי (יותר מ-95% ממשכורת ברוטו)' : 'Net salary too high (more than 95% of gross)';
            }
        }
        return null;
    };
    
    const handleSalaryChange = (salary, field) => {
        const numericSalary = parseFloat(salary) || 0;
        const error = validateSalary(numericSalary);
        setValidationErrors(prev => ({...prev, [field]: error}));
        setInputs({...inputs, [field]: numericSalary});
        
        // Auto-update net salary if not in manual mode
        if (field === 'currentMonthlySalary' && !inputs.manualNetSalary) {
            const autoNetSalary = calculateNetFromGross(numericSalary, inputs.country);
            setInputs(prev => ({...prev, currentMonthlySalary: numericSalary, currentNetSalary: autoNetSalary}));
        }
        if (field === 'partner1Salary' && !inputs.manualPartner1NetSalary) {
            const autoNetSalary = calculateNetFromGross(numericSalary, inputs.country);
            setInputs(prev => ({...prev, partner1Salary: numericSalary, partner1NetSalary: autoNetSalary}));
        }
        if (field === 'partner2Salary' && !inputs.manualPartner2NetSalary) {
            const autoNetSalary = calculateNetFromGross(numericSalary, inputs.country);
            setInputs(prev => ({...prev, partner2Salary: numericSalary, partner2NetSalary: autoNetSalary}));
        }
    };
    
    // Handle net salary changes with validation
    const handleNetSalaryChange = (netSalary, grossSalary, netField, grossField) => {
        const numericNetSalary = parseFloat(netSalary) || 0;
        const numericGrossSalary = parseFloat(grossSalary) || 0;
        const error = validateNetSalary(numericNetSalary, numericGrossSalary);
        setValidationErrors(prev => ({...prev, [netField]: error}));
        setInputs(prev => ({...prev, [netField]: numericNetSalary}));
    };
    
    // Helper function for input styling with validation states
    const getInputClassName = (fieldName, baseClassName, isNetSalary = false) => {
        const error = validationErrors[fieldName];
        if (error) {
            return `${baseClassName} border-red-500 focus:ring-red-500 focus:border-red-500`;
        }
        if (isNetSalary) {
            return `${baseClassName} border-green-300 focus:ring-green-500 focus:border-green-500`;
        }
        return `${baseClassName} border-gray-300 focus:ring-blue-500 focus:border-blue-500`;
    };
    
    // Calculate take-home percentage for display
    const calculateTakeHomePercentage = (netSalary, grossSalary) => {
        if (!grossSalary || !netSalary || grossSalary === 0) return 0;
        return Math.round((netSalary / grossSalary) * 100);
    };
    
    // Format percentage with color coding
    const getPercentageDisplay = (percentage) => {
        if (percentage === 0) return { text: '', color: 'text-gray-500' };
        if (percentage < 50) return { text: `${percentage}%`, color: 'text-red-600' };
        if (percentage < 70) return { text: `${percentage}%`, color: 'text-yellow-600' };
        return { text: `${percentage}%`, color: 'text-green-600' };
    };

    // Currency symbol helper
    const getCurrencySymbol = (currency) => {
        const symbols = {
            'ILS': '₪',
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'BTC': '₿',
            'ETH': 'Ξ'
        };
        return symbols[currency] || '₪';
    };

    const currencySymbol = getCurrencySymbol(workingCurrency);

    // Auto-calculate net salary from gross using country-specific tax calculations
    const calculateNetFromGross = (grossSalary, country = 'israel') => {
        if (!grossSalary || grossSalary <= 0) return 0;
        if (!window.TaxCalculators || !window.TaxCalculators.calculateNetSalary) {
            // Fallback calculation if TaxCalculators not available
            return Math.round(grossSalary * 0.66); // ~66% take-home for Israel
        }
        const result = window.TaxCalculators.calculateNetSalary(grossSalary, country);
        return result.netSalary || Math.round(grossSalary * 0.66);
    };

    // Multi-language content
    const content = {
        he: {
            mainSalary: 'משכורת חודשית עיקרית',
            grossSalary: `משכורת ברוטו לפני מסים (${currencySymbol})`,
            netSalary: `משכורת נטו אחרי מסים (${currencySymbol})`,
            netSalaryInfo: 'הכנסה בפועל שנשארת לך אחרי כל הניכויים (מסים, ביטוח לאומי, פנסיה)',
            salaryInfo: 'הזן את המשכורת הברוטו לפני מסים והפרשות. זה הסכום שמופיע בחוזה העבודה שלך',
            autoCalculated: 'מחושב אוטומטית',
            manualOverride: 'עריכה ידנית',
            switchToManual: 'החלף לעריכה ידנית',
            switchToAuto: 'חזור לחישוב אוטומטי',
            takeHomePercentage: 'אחוז המשכורת שנשאר',
            validationWarning: 'אזהרה',
            reasonableRange: 'טווח סביר: 50%-85%',
            netSalaryTooHigh: 'משכורת נטו גבוהה מדי',
            netSalaryTooLow: 'משכורת נטו נמוכה מדי',
            checkCalculation: 'בדוק את החישוב',
            additionalIncome: 'הכנסות נוספות',
            mainAdditionalIncome: 'הכנסות נוספות עיקריות',
            partnerAdditionalIncome: 'הכנסות נוספות בני הזוג',
            freelanceIncome: `הכנסות מעבודה עצמאית (${currencySymbol})`,
            rentalIncome: `הכנסות מדירות להשכרה (${currencySymbol})`,
            dividendIncome: `דיבידנדים והכנסות השקעה (${currencySymbol})`,
            annualBonus: `בונוס שנתי (${currencySymbol})`,
            quarterlyRSU: `RSU רבעוני (${currencySymbol})`,
            rsuFrequency: 'תדירות RSU',
            rsuAmount: `סכום RSU (${currencySymbol})`,
            monthly: 'חודשי',
            quarterly: 'רבעוני',
            yearly: 'שנתי',
            otherIncome: `הכנסות אחרות (${currencySymbol})`,
            partnerSalaries: 'משכורות בני הזוג',
            partner1Salary: 'משכורת ברוטו בן/בת זוג (לפני מסים)',
            partner2Salary: 'משכורת ברוטו בן/בת זוג נוסף (לפני מסים)',
            optional: 'אופציונלי',
            totalMonthlyIncome: 'סך הכנסה חודשית',
            incomeBreakdown: 'פירוט ההכנסות'
        },
        en: {
            mainSalary: 'Main Monthly Salary',
            grossSalary: `Gross Salary Before Taxes (${currencySymbol})`,
            netSalary: `Net Salary After Taxes (${currencySymbol})`,
            netSalaryInfo: 'Actual take-home income after all deductions (taxes, social security, pension)',
            salaryInfo: 'Enter your gross salary before taxes and deductions. This is the amount in your employment contract',
            autoCalculated: 'Auto-calculated',
            manualOverride: 'Manual Override',
            switchToManual: 'Switch to Manual Entry',
            switchToAuto: 'Switch to Auto-calculation',
            takeHomePercentage: 'Take-home percentage',
            validationWarning: 'Warning',
            reasonableRange: 'Reasonable range: 50%-85%',
            netSalaryTooHigh: 'Net salary too high',
            netSalaryTooLow: 'Net salary too low',
            checkCalculation: 'Please check calculation',
            additionalIncome: 'Additional Income Sources',
            mainAdditionalIncome: 'Main Additional Income',
            partnerAdditionalIncome: 'Partner Additional Income',
            freelanceIncome: `Freelance Income (${currencySymbol})`,
            rentalIncome: `Rental Income (${currencySymbol})`,
            dividendIncome: `Dividends & Investment Income (${currencySymbol})`,
            annualBonus: `Annual Bonus (${currencySymbol})`,
            quarterlyRSU: `Quarterly RSU (${currencySymbol})`,
            rsuFrequency: 'RSU Frequency',
            rsuAmount: `RSU Amount (${currencySymbol})`,
            monthly: 'Monthly',
            quarterly: 'Quarterly', 
            yearly: 'Yearly',
            otherIncome: `Other Income (${currencySymbol})`,
            partnerSalaries: 'Partner Salaries',
            partner1Salary: 'Partner Gross Salary (Before Taxes)',
            partner2Salary: 'Additional Partner Gross Salary (Before Taxes)',
            optional: 'Optional',
            totalMonthlyIncome: 'Total Monthly Income',
            incomeBreakdown: 'Income Breakdown'
        }
    };

    const t = content[language];

    // Calculate total income
    const calculateTotalIncome = () => {
        const mainSalary = inputs.currentMonthlySalary || 0;
        const partner1Salary = inputs.partner1Salary || 0;
        const partner2Salary = inputs.partner2Salary || 0;
        
        // Main person additional income
        const freelanceIncome = inputs.freelanceIncome || 0;
        const rentalIncome = inputs.rentalIncome || 0;
        const dividendIncome = inputs.dividendIncome || 0;
        const annualBonusMonthly = (inputs.annualBonus || 0) / 12; // Convert annual to monthly
        // Handle RSU frequency conversion to monthly
        let rsuMonthly = 0;
        const rsuAmount = inputs.rsuAmount || inputs.quarterlyRSU || 0;
        const rsuFrequency = inputs.rsuFrequency || 'quarterly';
        
        if (rsuFrequency === 'monthly') {
            rsuMonthly = rsuAmount;
        } else if (rsuFrequency === 'quarterly') {
            rsuMonthly = rsuAmount / 3;
        } else if (rsuFrequency === 'yearly') {
            rsuMonthly = rsuAmount / 12;
        }
        
        const quarterlyRSUMonthly = rsuMonthly; // For backward compatibility
        const otherIncome = inputs.otherIncome || 0;
        
        // Partner additional income (for couple planning)
        const partnerFreelanceIncome = inputs.partnerFreelanceIncome || 0;
        const partnerRentalIncome = inputs.partnerRentalIncome || 0;
        const partnerDividendIncome = inputs.partnerDividendIncome || 0;
        const partnerAnnualBonusMonthly = (inputs.partnerAnnualBonus || 0) / 12;
        const partnerQuarterlyRSUMonthly = (inputs.partnerQuarterlyRSU || 0) / 3;
        const partnerOtherIncome = inputs.partnerOtherIncome || 0;

        return mainSalary + partner1Salary + partner2Salary + 
               freelanceIncome + rentalIncome + dividendIncome + annualBonusMonthly + quarterlyRSUMonthly + otherIncome +
               partnerFreelanceIncome + partnerRentalIncome + partnerDividendIncome + partnerAnnualBonusMonthly + partnerQuarterlyRSUMonthly + partnerOtherIncome;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat(language === 'he' ? 'he-IL' : 'en-US', {
            style: 'currency',
            currency: workingCurrency === 'ILS' ? 'ILS' : 'USD',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Using React.createElement pattern for component rendering
    return createElement('div', { className: "space-y-8" }, [
        // Main Salary Section (hide in couple mode)
        inputs.planningType !== 'couple' && createElement('div', { key: 'main-salary-section' }, [
            createElement('h3', { 
                key: 'main-salary-title',
                className: "text-xl font-semibold text-gray-700 mb-4 flex items-center" 
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '💰'),
                inputs.planningType === 'couple' ? 
                    (language === 'he' ? 'משכורת ברוטו עיקרית (לפני מסים)' : 'Main Gross Salary (Before Taxes)') : 
                    t.mainSalary
            ]),
            createElement('div', { 
                key: 'salary-input',
                className: "bg-blue-50 rounded-xl p-6 border border-blue-200" 
            }, [
                createElement('label', { 
                    key: 'gross-salary-label',
                    className: "block text-lg font-medium text-gray-700 mb-2" 
                }, t.grossSalary),
                // Default value handling: value={inputs.currentMonthlySalary || 0}
                createElement('input', {
                    key: 'gross-salary-input',
                    type: 'number',
                    value: inputs.currentMonthlySalary || 15000,
                    onChange: (e) => {
                        const value = parseInt(e.target.value) || 0;
                        setInputs({...inputs, currentMonthlySalary: value});
                    },
                    placeholder: "15000",
                    min: "0",
                    max: "500000",
                    className: "w-full p-3 md:p-4 text-base md:text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                }),
                createElement('p', { 
                    key: 'salary-help',
                    className: "mt-2 text-sm text-blue-600" 
                }, t.salaryInfo),
                
                // Net Salary Input (Auto-calculated with manual override)
                createElement('div', { 
                    key: 'net-salary-section',
                    className: "mt-4 pt-4 border-t border-blue-200" 
                }, [
                    createElement('div', { 
                        key: 'net-salary-header',
                        className: "flex items-center justify-between mb-2" 
                    }, [
                        createElement('label', { 
                            key: 'net-salary-label',
                            className: "block text-lg font-medium text-green-700" 
                        }, t.netSalary),
                        createElement('button', {
                            key: 'toggle-manual',
                            type: 'button',
                            onClick: () => setInputs({...inputs, manualNetSalary: !inputs.manualNetSalary}),
                            className: "text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600"
                        }, inputs.manualNetSalary ? t.switchToAuto : t.switchToManual)
                    ]),
                    createElement('input', {
                        key: 'net-salary-input',
                        type: 'number',
                        value: inputs.manualNetSalary ? 
                            (inputs.currentNetSalary || 0) : 
                            calculateNetFromGross(inputs.currentMonthlySalary || 15000, inputs.country),
                        onChange: (e) => {
                            if (inputs.manualNetSalary) {
                                handleNetSalaryChange(e.target.value, inputs.currentMonthlySalary || 0, 'currentNetSalary', 'currentMonthlySalary');
                            }
                        },
                        readOnly: !inputs.manualNetSalary,
                        placeholder: inputs.manualNetSalary ? "10000" : "Auto-calculated",
                        className: inputs.manualNetSalary ? 
                            getInputClassName('currentNetSalary', 'w-full p-3 md:p-4 text-base md:text-lg border-2 rounded-lg focus:ring-2 bg-white', true) :
                            'w-full p-3 md:p-4 text-base md:text-lg border-2 border-green-200 bg-green-50 text-green-700 cursor-not-allowed rounded-lg'
                    }),
                    // Enhanced help text with validation and percentage display
                    createElement('div', { 
                        key: 'net-salary-help',
                        className: "mt-2 space-y-1"
                    }, [
                        // Main help text
                        createElement('div', {
                            key: 'net-help-main',
                            className: "flex items-center text-sm"
                        }, [
                            createElement('span', {
                                key: 'net-help-icon',
                                className: "mr-1 text-green-600"
                            }, '💰'),
                            createElement('span', {
                                key: 'net-help-text',
                                className: inputs.manualNetSalary ? "text-green-600" : "text-green-500"
                            }, inputs.manualNetSalary ? t.manualOverride : `${t.autoCalculated} - ${t.netSalaryInfo}`)
                        ]),
                        // Take-home percentage display
                        (() => {
                            const grossSalary = inputs.currentMonthlySalary || 15000;
                            const netSalary = inputs.manualNetSalary ? 
                                (inputs.currentNetSalary || 0) : 
                                calculateNetFromGross(grossSalary, inputs.country);
                            const percentage = calculateTakeHomePercentage(netSalary, grossSalary);
                            const percentageDisplay = getPercentageDisplay(percentage);
                            
                            return createElement('div', {
                                key: 'percentage-display',
                                className: "flex items-center text-xs"
                            }, [
                                createElement('span', {
                                    key: 'percentage-label',
                                    className: "text-gray-500 mr-2"
                                }, `${t.takeHomePercentage}: `),
                                createElement('span', {
                                    key: 'percentage-value',
                                    className: `font-medium ${percentageDisplay.color}`
                                }, percentageDisplay.text || '0%'),
                                percentage > 0 && percentage < 50 && createElement('span', {
                                    key: 'warning-text',
                                    className: "ml-2 text-red-500 text-xs"
                                }, `⚠️ ${t.netSalaryTooLow}`),
                                percentage > 90 && createElement('span', {
                                    key: 'high-warning',
                                    className: "ml-2 text-yellow-600 text-xs"
                                }, `⚠️ ${t.checkCalculation}`)
                            ]);
                        })()
                    ]),
                    // Validation error display
                    validationErrors.currentNetSalary && createElement('div', {
                        key: 'net-salary-error',
                        className: "mt-1 text-sm text-red-600 flex items-center"
                    }, [
                        createElement('span', { key: 'error-icon', className: "mr-1" }, '❌'),
                        validationErrors.currentNetSalary
                    ])
                ])
            ])
        ]),

        // Partner Salaries (if couple)
        inputs.planningType === 'couple' && createElement('div', { key: 'partner-salaries-section' }, [
            createElement('h3', { 
                key: 'partner-salaries-title',
                className: "text-xl font-semibold text-gray-700 mb-4 flex items-center" 
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '💰'),
                t.partnerSalaries
            ]),
            createElement('div', { 
                key: 'partner-salaries-grid',
                className: "grid grid-cols-1 md:grid-cols-2 gap-6" 
            }, [
                createElement('div', { 
                    key: 'partner1-salary',
                    className: "bg-blue-50 rounded-xl p-6 border border-blue-200" 
                }, [
                    createElement('label', { 
                        key: 'partner1-salary-label',
                        className: "block text-lg font-medium text-gray-700 mb-2" 
                    }, `${inputs.userName || t.partner1Salary} (${currencySymbol})`),
                    createElement('input', {
                        key: 'partner1-salary-input',
                        type: 'number',
                        value: inputs.partner1Salary || 0,
                        onChange: (e) => setInputs({...inputs, partner1Salary: parseInt(e.target.value) || 0}),
                        className: "w-full p-3 md:p-4 text-base md:text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    }),
                    createElement('p', { 
                        key: 'partner1-salary-help',
                        className: "mt-2 text-sm text-blue-600" 
                    }, language === 'he' ? 'הזן משכורת ברוטו לפני מסים והפרשות' : 'Enter gross salary before taxes and deductions'),
                    
                    // Partner 1 Net Salary
                    createElement('div', { 
                        key: 'partner1-net-salary-section',
                        className: "mt-4 pt-4 border-t border-blue-200" 
                    }, [
                        createElement('div', { 
                            key: 'partner1-net-salary-header',
                            className: "flex items-center justify-between mb-2" 
                        }, [
                            createElement('label', { 
                                key: 'partner1-net-salary-label',
                                className: "block text-lg font-medium text-green-700" 
                            }, `${inputs.userName || (language === 'he' ? 'בן/בת זוג' : 'Partner')} - ${t.netSalary}`),
                            createElement('button', {
                                key: 'partner1-toggle-manual',
                                type: 'button',
                                onClick: () => setInputs({...inputs, manualPartner1NetSalary: !inputs.manualPartner1NetSalary}),
                                className: "text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600"
                            }, inputs.manualPartner1NetSalary ? t.switchToAuto : t.switchToManual)
                        ]),
                        createElement('input', {
                            key: 'partner1-net-salary-input',
                            type: 'number',
                            value: inputs.manualPartner1NetSalary ? 
                                (inputs.partner1NetSalary || 0) : 
                                calculateNetFromGross(inputs.partner1Salary || 0, inputs.country),
                            onChange: (e) => {
                                if (inputs.manualPartner1NetSalary) {
                                    handleNetSalaryChange(e.target.value, inputs.partner1Salary || 0, 'partner1NetSalary', 'partner1Salary');
                                }
                            },
                            readOnly: !inputs.manualPartner1NetSalary,
                            className: inputs.manualPartner1NetSalary ? 
                                getInputClassName('partner1NetSalary', 'w-full p-3 text-base border-2 rounded-lg focus:ring-2 bg-white', true) :
                                'w-full p-3 text-base border-2 border-green-200 bg-green-50 text-green-700 cursor-not-allowed rounded-lg'
                        }),
                        // Enhanced partner 1 help with percentage
                        createElement('div', { 
                            key: 'partner1-net-help',
                            className: "mt-1 space-y-1" 
                        }, [
                            createElement('div', {
                                key: 'partner1-help-main',
                                className: "text-xs text-green-600 flex items-center"
                            }, [
                                createElement('span', { key: 'icon', className: "mr-1" }, '💰'),
                                inputs.manualPartner1NetSalary ? t.manualOverride : t.autoCalculated
                            ]),
                            (() => {
                                const grossSalary = inputs.partner1Salary || 0;
                                const netSalary = inputs.manualPartner1NetSalary ? 
                                    (inputs.partner1NetSalary || 0) : 
                                    calculateNetFromGross(grossSalary, inputs.country);
                                const percentage = calculateTakeHomePercentage(netSalary, grossSalary);
                                const percentageDisplay = getPercentageDisplay(percentage);
                                
                                return grossSalary > 0 && createElement('div', {
                                    key: 'partner1-percentage',
                                    className: `text-xs ${percentageDisplay.color}`
                                }, `${t.takeHomePercentage}: ${percentageDisplay.text}`);
                            })()
                        ]),
                        // Validation error for partner 1 net salary
                        validationErrors.partner1NetSalary && createElement('div', {
                            key: 'partner1-net-error',
                            className: "mt-1 text-xs text-red-600 flex items-center"
                        }, [
                            createElement('span', { key: 'error-icon', className: "mr-1" }, '❌'),
                            validationErrors.partner1NetSalary
                        ])
                    ])
                ]),
                createElement('div', { 
                    key: 'partner2-salary',
                    className: "bg-blue-50 rounded-xl p-6 border border-blue-200" 
                }, [
                    createElement('label', { 
                        key: 'partner2-salary-label',
                        className: "block text-lg font-medium text-gray-700 mb-2" 
                    }, `${inputs.partnerName || t.partner2Salary} (${currencySymbol})`),
                    createElement('input', {
                        key: 'partner2-salary-input',
                        type: 'number',
                        value: inputs.partner2Salary || 0,
                        onChange: (e) => setInputs({...inputs, partner2Salary: parseInt(e.target.value) || 0}),
                        className: "w-full p-3 md:p-4 text-base md:text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    }),
                    createElement('p', { 
                        key: 'partner2-salary-help',
                        className: "mt-2 text-sm text-blue-600" 
                    }, language === 'he' ? 'הזן משכורת ברוטו לפני מסים והפרשות' : 'Enter gross salary before taxes and deductions'),
                    
                    // Partner 2 Net Salary
                    createElement('div', { 
                        key: 'partner2-net-salary-section',
                        className: "mt-4 pt-4 border-t border-blue-200" 
                    }, [
                        createElement('div', { 
                            key: 'partner2-net-salary-header',
                            className: "flex items-center justify-between mb-2" 
                        }, [
                            createElement('label', { 
                                key: 'partner2-net-salary-label',
                                className: "block text-lg font-medium text-green-700" 
                            }, `${inputs.partnerName || (language === 'he' ? 'בן/בת זוג נוסף' : 'Additional Partner')} - ${t.netSalary}`),
                            createElement('button', {
                                key: 'partner2-toggle-manual',
                                type: 'button',
                                onClick: () => setInputs({...inputs, manualPartner2NetSalary: !inputs.manualPartner2NetSalary}),
                                className: "text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600"
                            }, inputs.manualPartner2NetSalary ? t.switchToAuto : t.switchToManual)
                        ]),
                        createElement('input', {
                            key: 'partner2-net-salary-input',
                            type: 'number',
                            value: inputs.manualPartner2NetSalary ? 
                                (inputs.partner2NetSalary || 0) : 
                                calculateNetFromGross(inputs.partner2Salary || 0, inputs.country),
                            onChange: (e) => {
                                if (inputs.manualPartner2NetSalary) {
                                    handleNetSalaryChange(e.target.value, inputs.partner2Salary || 0, 'partner2NetSalary', 'partner2Salary');
                                }
                            },
                            readOnly: !inputs.manualPartner2NetSalary,
                            className: inputs.manualPartner2NetSalary ? 
                                getInputClassName('partner2NetSalary', 'w-full p-3 text-base border-2 rounded-lg focus:ring-2 bg-white', true) :
                                'w-full p-3 text-base border-2 border-green-200 bg-green-50 text-green-700 cursor-not-allowed rounded-lg'
                        }),
                        // Enhanced partner 2 help with percentage
                        createElement('div', { 
                            key: 'partner2-net-help',
                            className: "mt-1 space-y-1" 
                        }, [
                            createElement('div', {
                                key: 'partner2-help-main',
                                className: "text-xs text-green-600 flex items-center"
                            }, [
                                createElement('span', { key: 'icon', className: "mr-1" }, '💰'),
                                inputs.manualPartner2NetSalary ? t.manualOverride : t.autoCalculated
                            ]),
                            (() => {
                                const grossSalary = inputs.partner2Salary || 0;
                                const netSalary = inputs.manualPartner2NetSalary ? 
                                    (inputs.partner2NetSalary || 0) : 
                                    calculateNetFromGross(grossSalary, inputs.country);
                                const percentage = calculateTakeHomePercentage(netSalary, grossSalary);
                                const percentageDisplay = getPercentageDisplay(percentage);
                                
                                return grossSalary > 0 && createElement('div', {
                                    key: 'partner2-percentage',
                                    className: `text-xs ${percentageDisplay.color}`
                                }, `${t.takeHomePercentage}: ${percentageDisplay.text}`);
                            })()
                        ]),
                        // Validation error for partner 2 net salary
                        validationErrors.partner2NetSalary && createElement('div', {
                            key: 'partner2-net-error',
                            className: "mt-1 text-xs text-red-600 flex items-center"
                        }, [
                            createElement('span', { key: 'error-icon', className: "mr-1" }, '❌'),
                            validationErrors.partner2NetSalary
                        ])
                    ])
                ])
            ])
        ]),

        // Additional Income Sources - Single Planning
        (!inputs.planningType || inputs.planningType === 'single') && createElement('div', { key: 'additional-income-section' }, [
            createElement('h3', { 
                key: 'additional-income-title',
                className: "text-xl font-semibold text-gray-700 mb-4 flex items-center" 
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '📈'),
                t.additionalIncome,
                createElement('span', { key: 'optional', className: "ml-2 text-sm text-gray-500 font-normal" }, `(${t.optional})`)
            ]),
            createElement('div', { 
                key: 'additional-income-grid',
                className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" 
            }, [
                createElement('div', { key: 'freelance-income' }, [
                    createElement('label', { 
                        key: 'freelance-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.freelanceIncome),
                    createElement('input', {
                        key: 'freelance-input',
                        type: 'number',
                        value: inputs.freelanceIncome || 0,
                        onChange: (e) => setInputs({...inputs, freelanceIncome: parseInt(e.target.value) || 0}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    })
                ]),
                createElement('div', { key: 'rental-income' }, [
                    createElement('label', { 
                        key: 'rental-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.rentalIncome),
                    createElement('input', {
                        key: 'rental-input',
                        type: 'number',
                        value: inputs.rentalIncome || 0,
                        onChange: (e) => setInputs({...inputs, rentalIncome: parseInt(e.target.value) || 0}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    })
                ]),
                createElement('div', { key: 'dividend-income' }, [
                    createElement('label', { 
                        key: 'dividend-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.dividendIncome),
                    createElement('input', {
                        key: 'dividend-input',
                        type: 'number',
                        value: inputs.dividendIncome || 0,
                        onChange: (e) => setInputs({...inputs, dividendIncome: parseInt(e.target.value) || 0}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    })
                ]),
                createElement('div', { key: 'annual-bonus' }, [
                    createElement('label', { 
                        key: 'bonus-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.annualBonus),
                    createElement('input', {
                        key: 'bonus-input',
                        type: 'number',
                        value: inputs.annualBonus || 0,
                        onChange: (e) => setInputs({...inputs, annualBonus: parseInt(e.target.value) || 0}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    })
                ]),
                createElement('div', { key: 'rsu-section' }, [
                    createElement('label', { 
                        key: 'rsu-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.rsuAmount),
                    createElement('div', { key: 'rsu-inputs', className: "grid grid-cols-2 gap-2" }, [
                        createElement('input', {
                            key: 'rsu-amount-input',
                            type: 'number',
                            value: inputs.rsuAmount || inputs.quarterlyRSU || 0,
                            onChange: (e) => {
                                const amount = parseInt(e.target.value) || 0;
                                setInputs({...inputs, rsuAmount: amount, quarterlyRSU: amount});
                            },
                            placeholder: "Amount",
                            className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        }),
                        createElement('select', {
                            key: 'rsu-frequency-select',
                            value: inputs.rsuFrequency || 'quarterly',
                            onChange: (e) => setInputs({...inputs, rsuFrequency: e.target.value}),
                            className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        }, [
                            createElement('option', { key: 'monthly-option', value: 'monthly' }, t.monthly),
                            createElement('option', { key: 'quarterly-option', value: 'quarterly' }, t.quarterly),
                            createElement('option', { key: 'yearly-option', value: 'yearly' }, t.yearly)
                        ])
                    ])
                ]),
                createElement('div', { key: 'other-income' }, [
                    createElement('label', { 
                        key: 'other-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.otherIncome),
                    createElement('input', {
                        key: 'other-input',
                        type: 'number',
                        value: inputs.otherIncome || 0,
                        onChange: (e) => setInputs({...inputs, otherIncome: parseInt(e.target.value) || 0}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    })
                ])
            ])
        ]),

        // Additional Income Sources - Couple Planning (Per Partner)
        inputs.planningType === 'couple' && createElement('div', { key: 'couple-additional-income-section' }, [
            createElement('h3', { 
                key: 'couple-additional-income-title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center" 
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '📈'),
                t.additionalIncome,
                createElement('span', { key: 'optional', className: "ml-2 text-sm text-gray-500 font-normal" }, `(${t.optional})`)
            ]),
            
            createElement('div', { 
                key: 'couple-additional-income-grid',
                className: "grid grid-cols-1 lg:grid-cols-2 gap-8" 
            }, [
                // Main Person Additional Income
                createElement('div', { 
                    key: 'main-additional-income',
                    className: "bg-blue-50 rounded-xl p-6 border border-blue-200" 
                }, [
                    createElement('h4', { 
                        key: 'main-additional-title',
                        className: "text-lg font-semibold text-blue-700 mb-4" 
                    }, t.mainAdditionalIncome),
                    createElement('div', { key: 'main-additional-fields', className: "space-y-4" }, [
                        createElement('div', { key: 'main-freelance' }, [
                            createElement('label', { 
                                key: 'main-freelance-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.freelanceIncome),
                            createElement('input', {
                                key: 'main-freelance-input',
                                type: 'number',
                                value: inputs.freelanceIncome || 0,
                                onChange: (e) => setInputs({...inputs, freelanceIncome: parseInt(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            })
                        ]),
                        createElement('div', { key: 'main-rental' }, [
                            createElement('label', { 
                                key: 'main-rental-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.rentalIncome),
                            createElement('input', {
                                key: 'main-rental-input',
                                type: 'number',
                                value: inputs.rentalIncome || 0,
                                onChange: (e) => setInputs({...inputs, rentalIncome: parseInt(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            })
                        ]),
                        createElement('div', { key: 'main-dividend' }, [
                            createElement('label', { 
                                key: 'main-dividend-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.dividendIncome),
                            createElement('input', {
                                key: 'main-dividend-input',
                                type: 'number',
                                value: inputs.dividendIncome || 0,
                                onChange: (e) => setInputs({...inputs, dividendIncome: parseInt(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            })
                        ]),
                        createElement('div', { key: 'main-bonus' }, [
                            createElement('label', { 
                                key: 'main-bonus-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.annualBonus),
                            createElement('input', {
                                key: 'main-bonus-input',
                                type: 'number',
                                value: inputs.annualBonus || 0,
                                onChange: (e) => setInputs({...inputs, annualBonus: parseInt(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            })
                        ]),
                        createElement('div', { key: 'main-rsu' }, [
                            createElement('label', { 
                                key: 'main-rsu-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.quarterlyRSU),
                            createElement('input', {
                                key: 'main-rsu-input',
                                type: 'number',
                                value: inputs.quarterlyRSU || 0,
                                onChange: (e) => setInputs({...inputs, quarterlyRSU: parseInt(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            })
                        ]),
                        createElement('div', { key: 'main-other' }, [
                            createElement('label', { 
                                key: 'main-other-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.otherIncome),
                            createElement('input', {
                                key: 'main-other-input',
                                type: 'number',
                                value: inputs.otherIncome || 0,
                                onChange: (e) => setInputs({...inputs, otherIncome: parseInt(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            })
                        ])
                    ])
                ]),
                
                // Partner Additional Income
                createElement('div', { 
                    key: 'partner-additional-income',
                    className: "bg-green-50 rounded-xl p-6 border border-green-200" 
                }, [
                    createElement('h4', { 
                        key: 'partner-additional-title',
                        className: "text-lg font-semibold text-green-700 mb-4" 
                    }, t.partnerAdditionalIncome),
                    createElement('div', { key: 'partner-additional-fields', className: "space-y-4" }, [
                        createElement('div', { key: 'partner-freelance' }, [
                            createElement('label', { 
                                key: 'partner-freelance-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.freelanceIncome),
                            createElement('input', {
                                key: 'partner-freelance-input',
                                type: 'number',
                                value: inputs.partnerFreelanceIncome || 0,
                                onChange: (e) => setInputs({...inputs, partnerFreelanceIncome: parseInt(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            })
                        ]),
                        createElement('div', { key: 'partner-rental' }, [
                            createElement('label', { 
                                key: 'partner-rental-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.rentalIncome),
                            createElement('input', {
                                key: 'partner-rental-input',
                                type: 'number',
                                value: inputs.partnerRentalIncome || 0,
                                onChange: (e) => setInputs({...inputs, partnerRentalIncome: parseInt(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            })
                        ]),
                        createElement('div', { key: 'partner-dividend' }, [
                            createElement('label', { 
                                key: 'partner-dividend-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.dividendIncome),
                            createElement('input', {
                                key: 'partner-dividend-input',
                                type: 'number',
                                value: inputs.partnerDividendIncome || 0,
                                onChange: (e) => setInputs({...inputs, partnerDividendIncome: parseInt(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            })
                        ]),
                        createElement('div', { key: 'partner-bonus' }, [
                            createElement('label', { 
                                key: 'partner-bonus-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.annualBonus),
                            createElement('input', {
                                key: 'partner-bonus-input',
                                type: 'number',
                                value: inputs.partnerAnnualBonus || 0,
                                onChange: (e) => setInputs({...inputs, partnerAnnualBonus: parseInt(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            })
                        ]),
                        createElement('div', { key: 'partner-rsu' }, [
                            createElement('label', { 
                                key: 'partner-rsu-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.quarterlyRSU),
                            createElement('input', {
                                key: 'partner-rsu-input',
                                type: 'number',
                                value: inputs.partnerQuarterlyRSU || 0,
                                onChange: (e) => setInputs({...inputs, partnerQuarterlyRSU: parseInt(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            })
                        ]),
                        createElement('div', { key: 'partner-other' }, [
                            createElement('label', { 
                                key: 'partner-other-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.otherIncome),
                            createElement('input', {
                                key: 'partner-other-input',
                                type: 'number',
                                value: inputs.partnerOtherIncome || 0,
                                onChange: (e) => setInputs({...inputs, partnerOtherIncome: parseInt(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            })
                        ])
                    ])
                ])
            ])
        ]),

        // Total Income Summary
        createElement('div', { 
            key: 'income-summary',
            className: "bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200" 
        }, [
            createElement('h3', { 
                key: 'total-title',
                className: "text-xl font-semibold text-green-700 mb-4 flex items-center" 
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '💵'),
                t.totalMonthlyIncome
            ]),
            createElement('div', { 
                key: 'total-amount',
                className: "text-3xl font-bold text-green-800 mb-2" 
            }, formatCurrency(calculateTotalIncome())),
            createElement('p', { 
                key: 'total-help',
                className: "text-sm text-green-600" 
            }, t.incomeBreakdown)
        ]),
        
        // Tax Impact Preview for Additional Income
        (inputs.annualBonus > 0 || inputs.quarterlyRSU > 0 || inputs.freelanceIncome > 0 || inputs.rentalIncome > 0 || inputs.dividendIncome > 0) && 
        createElement('div', {
            key: 'tax-impact-preview',
            className: "bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200 mt-6"
        }, [
            createElement('h3', {
                key: 'tax-preview-title',
                className: "text-xl font-semibold text-red-700 mb-4 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '🧮'),
                language === 'he' ? 'תחזית מס על הכנסות נוספות' : 'Tax Preview on Additional Income'
            ]),
            (() => {
                // Calculate tax impact
                if (window.TaxCalculators && window.TaxCalculators.calculateAdditionalIncomeTax) {
                    const taxInfo = window.TaxCalculators.calculateAdditionalIncomeTax(inputs);
                    if (taxInfo) {
                        return createElement('div', { key: 'tax-details', className: "space-y-3" }, [
                            // Total additional income
                            createElement('div', { key: 'total-additional', className: "flex justify-between items-center pb-3 border-b border-red-200" }, [
                                createElement('span', { key: 'label', className: "text-gray-700" }, 
                                    language === 'he' ? 'סך הכנסות נוספות (ברוטו)' : 'Total Additional Income (Gross)'),
                                createElement('span', { key: 'value', className: "font-semibold text-gray-900" }, 
                                    formatCurrency(taxInfo.totalAdditionalIncome))
                            ]),
                            
                            // Tax amount
                            createElement('div', { key: 'tax-amount', className: "flex justify-between items-center" }, [
                                createElement('span', { key: 'label', className: "text-red-700" }, 
                                    language === 'he' ? 'מס משוער' : 'Estimated Tax'),
                                createElement('span', { key: 'value', className: "font-semibold text-red-800" }, 
                                    formatCurrency(taxInfo.totalAdditionalTax))
                            ]),
                            
                            // Net amount
                            createElement('div', { key: 'net-amount', className: "flex justify-between items-center pt-3 border-t border-red-200" }, [
                                createElement('span', { key: 'label', className: "text-green-700 font-medium" }, 
                                    language === 'he' ? 'נטו אחרי מס' : 'Net After Tax'),
                                createElement('span', { key: 'value', className: "font-bold text-green-800 text-lg" }, 
                                    formatCurrency(taxInfo.totalAdditionalIncome - taxInfo.totalAdditionalTax))
                            ]),
                            
                            // Marginal tax rate
                            createElement('div', { key: 'marginal-rate', className: "mt-2 text-sm text-gray-600" }, 
                                language === 'he' ? 
                                    `שיעור מס שולי: ${taxInfo.marginalRate}% | שיעור מס אפקטיבי: ${taxInfo.effectiveRate}%` :
                                    `Marginal Tax Rate: ${taxInfo.marginalRate}% | Effective Tax Rate: ${taxInfo.effectiveRate}%`
                            ),
                            
                            // Breakdown by income type
                            taxInfo.breakdown && createElement('details', { 
                                key: 'breakdown-details',
                                className: "mt-4 bg-white rounded-lg p-4"
                            }, [
                                createElement('summary', {
                                    key: 'breakdown-summary',
                                    className: "cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900"
                                }, language === 'he' ? 'פירוט לפי סוג הכנסה' : 'Breakdown by Income Type'),
                                
                                createElement('div', { key: 'breakdown-content', className: "mt-3 space-y-2 text-sm" }, [
                                    // Bonus breakdown
                                    taxInfo.breakdown.bonus.gross > 0 && createElement('div', { 
                                        key: 'bonus-breakdown',
                                        className: "flex justify-between text-gray-600"
                                    }, [
                                        createElement('span', { key: 'label' }, 
                                            language === 'he' ? `בונוס (${taxInfo.breakdown.bonus.rate}% מס)` : `Bonus (${taxInfo.breakdown.bonus.rate}% tax)`),
                                        createElement('span', { key: 'value' }, 
                                            `${formatCurrency(taxInfo.breakdown.bonus.gross)} → ${formatCurrency(taxInfo.breakdown.bonus.net)}`)
                                    ]),
                                    
                                    // RSU breakdown
                                    taxInfo.breakdown.rsu.gross > 0 && createElement('div', { 
                                        key: 'rsu-breakdown',
                                        className: "flex justify-between text-gray-600"
                                    }, [
                                        createElement('span', { key: 'label' }, 
                                            language === 'he' ? `RSU (${taxInfo.breakdown.rsu.rate}% מס)` : `RSU (${taxInfo.breakdown.rsu.rate}% tax)`),
                                        createElement('span', { key: 'value' }, 
                                            `${formatCurrency(taxInfo.breakdown.rsu.gross)} → ${formatCurrency(taxInfo.breakdown.rsu.net)}`)
                                    ]),
                                    
                                    // Other income breakdown
                                    taxInfo.breakdown.otherIncome.gross > 0 && createElement('div', { 
                                        key: 'other-breakdown',
                                        className: "flex justify-between text-gray-600"
                                    }, [
                                        createElement('span', { key: 'label' }, 
                                            language === 'he' ? `הכנסות אחרות (${taxInfo.breakdown.otherIncome.rate}% מס)` : `Other Income (${taxInfo.breakdown.otherIncome.rate}% tax)`),
                                        createElement('span', { key: 'value' }, 
                                            `${formatCurrency(taxInfo.breakdown.otherIncome.gross)} → ${formatCurrency(taxInfo.breakdown.otherIncome.net)}`)
                                    ])
                                ])
                            ])
                        ]);
                    }
                }
                
                // Fallback if tax calculation not available
                return createElement('p', { 
                    key: 'tax-preview-unavailable',
                    className: "text-sm text-gray-600" 
                }, language === 'he' ? 
                    'חישוב מס מפורט יהיה זמין בשלב הבא' : 
                    'Detailed tax calculation will be available in the next step'
                );
            })()
        ])
    ]);
};

// Export to window for global access
window.WizardStepSalary = WizardStepSalary;
console.log('✅ WizardStepSalary component loaded successfully');