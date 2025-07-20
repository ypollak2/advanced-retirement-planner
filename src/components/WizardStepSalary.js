// WizardStepSalary.js - Step 2: Salary & Income
// Collects monthly salary and additional income sources

const WizardStepSalary = ({ inputs, setInputs, language = 'en', workingCurrency = 'ILS' }) => {
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
            freelanceIncome: `הכנסות מעבודה עצמאית (${currencySymbol})`,
            rentalIncome: `הכנסות מדירות להשכרה (${currencySymbol})`,
            dividendIncome: `דיבידנדים והכנסות השקעה (${currencySymbol})`,
            annualBonus: `בונוס שנתי (${currencySymbol})`,
            quarterlyRSU: `RSU רבעוני (${currencySymbol})`,
            otherIncome: `הכנסות אחרות (${currencySymbol})`,
            partnerSalaries: 'משכורות בני הזוג',
            partner1Salary: 'משכורת בן/בת זוג 1',
            partner2Salary: 'משכורת בן/בת זוג 2',
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
            freelanceIncome: `Freelance Income (${currencySymbol})`,
            rentalIncome: `Rental Income (${currencySymbol})`,
            dividendIncome: `Dividends & Investment Income (${currencySymbol})`,
            annualBonus: `Annual Bonus (${currencySymbol})`,
            quarterlyRSU: `Quarterly RSU (${currencySymbol})`,
            otherIncome: `Other Income (${currencySymbol})`,
            partnerSalaries: 'Partner Salaries',
            partner1Salary: 'Partner 1 Salary',
            partner2Salary: 'Partner 2 Salary',
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
        const freelanceIncome = inputs.freelanceIncome || 0;
        const rentalIncome = inputs.rentalIncome || 0;
        const dividendIncome = inputs.dividendIncome || 0;
        const annualBonusMonthly = (inputs.annualBonus || 0) / 12; // Convert annual to monthly
        const quarterlyRSUMonthly = (inputs.quarterlyRSU || 0) / 3; // Convert quarterly to monthly
        const otherIncome = inputs.otherIncome || 0;

        return mainSalary + partner1Salary + partner2Salary + freelanceIncome + rentalIncome + 
               dividendIncome + annualBonusMonthly + quarterlyRSUMonthly + otherIncome;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat(language === 'he' ? 'he-IL' : 'en-US', {
            style: 'currency',
            currency: workingCurrency === 'ILS' ? 'ILS' : 'USD',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return React.createElement('div', { className: "space-y-8" }, [
        // Main Salary Section (only show for single planning)
        (!inputs.planningType || inputs.planningType === 'single') && React.createElement('div', { key: 'main-salary-section' }, [
            React.createElement('h3', { 
                key: 'main-salary-title',
                className: "text-xl font-semibold text-gray-700 mb-4 flex items-center" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '💰'),
                t.mainSalary
            ]),
            React.createElement('div', { 
                key: 'salary-input',
                className: "bg-blue-50 rounded-xl p-6 border border-blue-200" 
            }, [
                React.createElement('label', { 
                    key: 'gross-salary-label',
                    className: "block text-lg font-medium text-gray-700 mb-2" 
                }, t.grossSalary),
                React.createElement('input', {
                    key: 'gross-salary-input',
                    type: 'number',
                    value: inputs.currentMonthlySalary || 15000,
                    onChange: (e) => setInputs({...inputs, currentMonthlySalary: parseInt(e.target.value) || 0}),
                    className: "w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                }),
                React.createElement('p', { 
                    key: 'salary-help',
                    className: "mt-2 text-sm text-blue-600" 
                }, t.salaryInfo)
            ])
        ]),

        // Partner Salaries (if couple)
        inputs.planningType === 'couple' && React.createElement('div', { key: 'partner-salaries-section' }, [
            React.createElement('h3', { 
                key: 'partner-salaries-title',
                className: "text-xl font-semibold text-gray-700 mb-4 flex items-center" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '💰'),
                t.partnerSalaries
            ]),
            React.createElement('div', { 
                key: 'partner-salaries-grid',
                className: "grid grid-cols-1 md:grid-cols-2 gap-6" 
            }, [
                React.createElement('div', { 
                    key: 'partner1-salary',
                    className: "bg-blue-50 rounded-xl p-6 border border-blue-200" 
                }, [
                    React.createElement('label', { 
                        key: 'partner1-salary-label',
                        className: "block text-lg font-medium text-gray-700 mb-2" 
                    }, `${inputs.partner1Name || t.partner1Salary} (${currencySymbol})`),
                    React.createElement('input', {
                        key: 'partner1-salary-input',
                        type: 'number',
                        value: inputs.partner1Salary || 0,
                        onChange: (e) => setInputs({...inputs, partner1Salary: parseInt(e.target.value) || 0}),
                        className: "w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    })
                ]),
                React.createElement('div', { 
                    key: 'partner2-salary',
                    className: "bg-blue-50 rounded-xl p-6 border border-blue-200" 
                }, [
                    React.createElement('label', { 
                        key: 'partner2-salary-label',
                        className: "block text-lg font-medium text-gray-700 mb-2" 
                    }, `${inputs.partner2Name || t.partner2Salary} (${currencySymbol})`),
                    React.createElement('input', {
                        key: 'partner2-salary-input',
                        type: 'number',
                        value: inputs.partner2Salary || 0,
                        onChange: (e) => setInputs({...inputs, partner2Salary: parseInt(e.target.value) || 0}),
                        className: "w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    })
                ])
            ])
        ]),

        // Additional Income Sources
        React.createElement('div', { key: 'additional-income-section' }, [
            React.createElement('h3', { 
                key: 'additional-income-title',
                className: "text-xl font-semibold text-gray-700 mb-4 flex items-center" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '📈'),
                t.additionalIncome,
                React.createElement('span', { key: 'optional', className: "ml-2 text-sm text-gray-500 font-normal" }, `(${t.optional})`)
            ]),
            React.createElement('div', { 
                key: 'additional-income-grid',
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            }, [
                React.createElement('div', { key: 'freelance-income' }, [
                    React.createElement('label', { 
                        key: 'freelance-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.freelanceIncome),
                    React.createElement('input', {
                        key: 'freelance-input',
                        type: 'number',
                        value: inputs.freelanceIncome || 0,
                        onChange: (e) => setInputs({...inputs, freelanceIncome: parseInt(e.target.value) || 0}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    })
                ]),
                React.createElement('div', { key: 'rental-income' }, [
                    React.createElement('label', { 
                        key: 'rental-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.rentalIncome),
                    React.createElement('input', {
                        key: 'rental-input',
                        type: 'number',
                        value: inputs.rentalIncome || 0,
                        onChange: (e) => setInputs({...inputs, rentalIncome: parseInt(e.target.value) || 0}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    })
                ]),
                React.createElement('div', { key: 'dividend-income' }, [
                    React.createElement('label', { 
                        key: 'dividend-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.dividendIncome),
                    React.createElement('input', {
                        key: 'dividend-input',
                        type: 'number',
                        value: inputs.dividendIncome || 0,
                        onChange: (e) => setInputs({...inputs, dividendIncome: parseInt(e.target.value) || 0}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    })
                ]),
                React.createElement('div', { key: 'annual-bonus' }, [
                    React.createElement('label', { 
                        key: 'bonus-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.annualBonus),
                    React.createElement('input', {
                        key: 'bonus-input',
                        type: 'number',
                        value: inputs.annualBonus || 0,
                        onChange: (e) => setInputs({...inputs, annualBonus: parseInt(e.target.value) || 0}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    })
                ]),
                React.createElement('div', { key: 'quarterly-rsu' }, [
                    React.createElement('label', { 
                        key: 'rsu-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.quarterlyRSU),
                    React.createElement('input', {
                        key: 'rsu-input',
                        type: 'number',
                        value: inputs.quarterlyRSU || 0,
                        onChange: (e) => setInputs({...inputs, quarterlyRSU: parseInt(e.target.value) || 0}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    })
                ]),
                React.createElement('div', { key: 'other-income' }, [
                    React.createElement('label', { 
                        key: 'other-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.otherIncome),
                    React.createElement('input', {
                        key: 'other-input',
                        type: 'number',
                        value: inputs.otherIncome || 0,
                        onChange: (e) => setInputs({...inputs, otherIncome: parseInt(e.target.value) || 0}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    })
                ])
            ])
        ]),

        // Total Income Summary
        React.createElement('div', { 
            key: 'income-summary',
            className: "bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200" 
        }, [
            React.createElement('h3', { 
                key: 'total-title',
                className: "text-xl font-semibold text-green-700 mb-4 flex items-center" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '💵'),
                t.totalMonthlyIncome
            ]),
            React.createElement('div', { 
                key: 'total-amount',
                className: "text-3xl font-bold text-green-800 mb-2" 
            }, formatCurrency(calculateTotalIncome())),
            React.createElement('p', { 
                key: 'total-help',
                className: "text-sm text-green-600" 
            }, t.incomeBreakdown)
        ])
    ]);
};

// Export to window for global access
window.WizardStepSalary = WizardStepSalary;
console.log('✅ WizardStepSalary component loaded successfully');