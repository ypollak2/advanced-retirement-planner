// WizardStepSalary.js - Step 2: Salary & Income
// Collects monthly salary and additional income sources

const WizardStepSalary = ({ inputs, setInputs, language = 'en', workingCurrency = 'ILS' }) => {
    // Component uses React.createElement for rendering
    const createElement = React.createElement;
    
    // Validation state for salary inputs
    const [validationErrors, setValidationErrors] = React.useState({});
    
    // Salary validation rules
    const validateSalary = (salary) => {
        if (salary < 0) return language === 'he' ? 'משכורת לא יכולה להיות שלילית' : 'Salary cannot be negative';
        if (salary > 500000) return language === 'he' ? 'משכורת גבוהה מדי (מקסימום 500,000)' : 'Salary too high (max 500,000)';
        return null;
    };
    
    const handleSalaryChange = (salary, field) => {
        const numericSalary = parseFloat(salary) || 0; // Add default value handling
        const error = validateSalary(numericSalary);
        setValidationErrors(prev => ({...prev, [field]: error}));
        setInputs({...inputs, [field]: numericSalary});
    };
    
    // Helper function for input styling
    const getInputClassName = (fieldName, baseClassName) => {
        const error = validationErrors[fieldName];
        if (error) {
            return `${baseClassName} border-red-500 focus:ring-red-500 focus:border-red-500`;
        }
        return `${baseClassName} border-gray-300 focus:ring-blue-500 focus:border-blue-500`;
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

    // Multi-language content
    const content = {
        he: {
            mainSalary: 'משכורת חודשית עיקרית',
            grossSalary: `משכורת ברוטו לפני מסים (${currencySymbol})`,
            netSalary: `משכורת נטו (${currencySymbol})`,
            salaryInfo: 'הזן את המשכורת הברוטו לפני מסים והפרשות. זה הסכום שמופיע בחוזה העבודה שלך',
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
            partner1Salary: 'משכורת ברוטו בן/בת זוג 1 (לפני מסים)',
            partner2Salary: 'משכורת ברוטו בן/בת זוג 2 (לפני מסים)',
            optional: 'אופציונלי',
            totalMonthlyIncome: 'סך הכנסה חודשית',
            incomeBreakdown: 'פירוט ההכנסות'
        },
        en: {
            mainSalary: 'Main Monthly Salary',
            grossSalary: `Gross Salary Before Taxes (${currencySymbol})`,
            netSalary: `Net Salary (${currencySymbol})`,
            salaryInfo: 'Enter your gross salary before taxes and deductions. This is the amount in your employment contract',
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
            partner1Salary: 'Partner 1 Gross Salary (Before Taxes)',
            partner2Salary: 'Partner 2 Gross Salary (Before Taxes)',
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
        // Main Salary Section (show in all modes)
        createElement('div', { key: 'main-salary-section' }, [
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
                    className: "w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                }),
                createElement('p', { 
                    key: 'salary-help',
                    className: "mt-2 text-sm text-blue-600" 
                }, t.salaryInfo)
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
                    }, `${inputs.partner1Name || t.partner1Salary} (${currencySymbol})`),
                    createElement('input', {
                        key: 'partner1-salary-input',
                        type: 'number',
                        value: inputs.partner1Salary || 0,
                        onChange: (e) => setInputs({...inputs, partner1Salary: parseInt(e.target.value) || 0}),
                        className: "w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    }),
                    createElement('p', { 
                        key: 'partner1-salary-help',
                        className: "mt-2 text-sm text-blue-600" 
                    }, language === 'he' ? 'הזן משכורת ברוטו לפני מסים והפרשות' : 'Enter gross salary before taxes and deductions')
                ]),
                createElement('div', { 
                    key: 'partner2-salary',
                    className: "bg-blue-50 rounded-xl p-6 border border-blue-200" 
                }, [
                    createElement('label', { 
                        key: 'partner2-salary-label',
                        className: "block text-lg font-medium text-gray-700 mb-2" 
                    }, `${inputs.partner2Name || t.partner2Salary} (${currencySymbol})`),
                    createElement('input', {
                        key: 'partner2-salary-input',
                        type: 'number',
                        value: inputs.partner2Salary || 0,
                        onChange: (e) => setInputs({...inputs, partner2Salary: parseInt(e.target.value) || 0}),
                        className: "w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    }),
                    createElement('p', { 
                        key: 'partner2-salary-help',
                        className: "mt-2 text-sm text-blue-600" 
                    }, language === 'he' ? 'הזן משכורת ברוטו לפני מסים והפרשות' : 'Enter gross salary before taxes and deductions')
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
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
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
        ])
    ]);
};

// Export to window for global access
window.WizardStepSalary = WizardStepSalary;
console.log('✅ WizardStepSalary component loaded successfully');