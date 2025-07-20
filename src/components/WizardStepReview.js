// WizardStepReview.js - Step 8: Review & Calculate
// Final review of all collected data and calculation trigger

const WizardStepReview = ({ inputs, setInputs, language = 'en', workingCurrency = 'ILS' }) => {
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
            reviewTitle: 'סקירת הנתונים שלך',
            reviewSubtitle: 'אנא וודא שכל הפרטים נכונים לפני החישוב הסופי',
            personalInfo: 'פרטים אישיים',
            salaryInfo: 'משכורת והכנסות',
            savingsInfo: 'חיסכונות קיימים',
            age: 'גיל',
            retirementAge: 'גיל פרישה',
            planningType: 'סוג תכנון',
            single: 'רווק/ה',
            couple: 'זוג',
            monthlySalary: 'משכורת חודשית',
            totalIncome: 'סך הכנסה חודשית',
            pensionSavings: 'חיסכון פנסיוני',
            trainingFund: 'קרן השתלמות',
            totalSavings: 'סך החיסכון',
            readyToCalculate: 'מוכן לחישוב',
            dataComplete: 'כל הנתונים נאספו בהצלחה',
            missingData: 'חסרים נתונים חיוניים',
            edit: 'עריכה',
            yearsToRetirement: 'שנים עד פרישה'
        },
        en: {
            reviewTitle: 'Review Your Information',
            reviewSubtitle: 'Please verify all details are correct before final calculation',
            personalInfo: 'Personal Information',
            salaryInfo: 'Salary & Income',
            savingsInfo: 'Current Savings',
            age: 'Age',
            retirementAge: 'Retirement Age',
            planningType: 'Planning Type',
            single: 'Single',
            couple: 'Couple',
            monthlySalary: 'Monthly Salary',
            totalIncome: 'Total Monthly Income',
            pensionSavings: 'Pension Savings',
            trainingFund: 'Training Fund',
            totalSavings: 'Total Savings',
            readyToCalculate: 'Ready to Calculate',
            dataComplete: 'All data collected successfully',
            missingData: 'Missing essential data',
            edit: 'Edit',
            yearsToRetirement: 'Years to Retirement'
        }
    };

    const t = content[language];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat(language === 'he' ? 'he-IL' : 'en-US', {
            style: 'currency',
            currency: workingCurrency === 'ILS' ? 'ILS' : 'USD',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Calculate totals
    const calculateTotalIncome = () => {
        const mainSalary = inputs.currentMonthlySalary || 0;
        const partner1Salary = inputs.partner1Salary || 0;
        const partner2Salary = inputs.partner2Salary || 0;
        return mainSalary + partner1Salary + partner2Salary;
    };

    const calculateTotalSavings = () => {
        const pension = inputs.currentSavings || 0;
        const trainingFund = inputs.currentTrainingFundSavings || 0;
        const partner1Savings = inputs.partner1CurrentSavings || 0;
        const partner2Savings = inputs.partner2CurrentSavings || 0;
        return pension + trainingFund + partner1Savings + partner2Savings;
    };

    const yearsToRetirement = (inputs.retirementAge || 67) - (inputs.currentAge || 30);

    const isDataComplete = () => {
        return inputs.currentAge && inputs.retirementAge && 
               (inputs.currentMonthlySalary || inputs.partner1Salary || inputs.partner2Salary);
    };

    return React.createElement('div', { className: "space-y-8" }, [
        // Review Header
        React.createElement('div', { key: 'review-header', className: "text-center" }, [
            React.createElement('h3', { 
                key: 'review-title',
                className: "text-2xl font-bold text-gray-800 mb-2" 
            }, t.reviewTitle),
            React.createElement('p', { 
                key: 'review-subtitle',
                className: "text-gray-600" 
            }, t.reviewSubtitle)
        ]),

        // Review Grid
        React.createElement('div', { 
            key: 'review-grid',
            className: "grid grid-cols-1 md:grid-cols-3 gap-6" 
        }, [
            // Personal Information
            React.createElement('div', { 
                key: 'personal-info',
                className: "bg-blue-50 rounded-xl p-6 border border-blue-200" 
            }, [
                React.createElement('h4', { 
                    key: 'personal-title',
                    className: "text-lg font-semibold text-blue-700 mb-4 flex items-center" 
                }, [
                    React.createElement('span', { key: 'icon', className: "mr-2 text-xl" }, '👤'),
                    t.personalInfo
                ]),
                React.createElement('div', { key: 'personal-details', className: "space-y-2 text-sm" }, [
                    React.createElement('div', { key: 'age-display' }, [
                        React.createElement('span', { key: 'age-label', className: "font-medium" }, `${t.age}: `),
                        React.createElement('span', { key: 'age-value' }, inputs.currentAge || 30)
                    ]),
                    React.createElement('div', { key: 'retirement-age-display' }, [
                        React.createElement('span', { key: 'retirement-age-label', className: "font-medium" }, `${t.retirementAge}: `),
                        React.createElement('span', { key: 'retirement-age-value' }, inputs.retirementAge || 67)
                    ]),
                    React.createElement('div', { key: 'years-display' }, [
                        React.createElement('span', { key: 'years-label', className: "font-medium" }, `${t.yearsToRetirement}: `),
                        React.createElement('span', { key: 'years-value', className: "text-blue-600 font-semibold" }, yearsToRetirement)
                    ]),
                    React.createElement('div', { key: 'planning-type-display' }, [
                        React.createElement('span', { key: 'planning-type-label', className: "font-medium" }, `${t.planningType}: `),
                        React.createElement('span', { key: 'planning-type-value' }, 
                            inputs.planningType === 'couple' ? t.couple : t.single)
                    ])
                ])
            ]),

            // Salary & Income
            React.createElement('div', { 
                key: 'salary-info',
                className: "bg-green-50 rounded-xl p-6 border border-green-200" 
            }, [
                React.createElement('h4', { 
                    key: 'salary-title',
                    className: "text-lg font-semibold text-green-700 mb-4 flex items-center" 
                }, [
                    React.createElement('span', { key: 'icon', className: "mr-2 text-xl" }, '💰'),
                    t.salaryInfo
                ]),
                React.createElement('div', { key: 'salary-details', className: "space-y-2 text-sm" }, [
                    inputs.planningType !== 'couple' && React.createElement('div', { key: 'monthly-salary-display' }, [
                        React.createElement('span', { key: 'monthly-salary-label', className: "font-medium" }, `${t.monthlySalary}: `),
                        React.createElement('span', { key: 'monthly-salary-value' }, formatCurrency(inputs.currentMonthlySalary || 0))
                    ]),
                    inputs.planningType === 'couple' && React.createElement('div', { key: 'partner-salaries' }, [
                        React.createElement('div', { key: 'partner1-salary-display', className: "mb-1" }, [
                            React.createElement('span', { key: 'partner1-label', className: "font-medium" }, `${inputs.partner1Name || 'Partner 1'}: `),
                            React.createElement('span', { key: 'partner1-value' }, formatCurrency(inputs.partner1Salary || 0))
                        ]),
                        React.createElement('div', { key: 'partner2-salary-display' }, [
                            React.createElement('span', { key: 'partner2-label', className: "font-medium" }, `${inputs.partner2Name || 'Partner 2'}: `),
                            React.createElement('span', { key: 'partner2-value' }, formatCurrency(inputs.partner2Salary || 0))
                        ])
                    ]),
                    React.createElement('div', { key: 'total-income-display', className: "pt-2 border-t" }, [
                        React.createElement('span', { key: 'total-income-label', className: "font-medium" }, `${t.totalIncome}: `),
                        React.createElement('span', { key: 'total-income-value', className: "text-green-600 font-semibold" }, 
                            formatCurrency(calculateTotalIncome()))
                    ])
                ])
            ]),

            // Current Savings
            React.createElement('div', { 
                key: 'savings-info',
                className: "bg-purple-50 rounded-xl p-6 border border-purple-200" 
            }, [
                React.createElement('h4', { 
                    key: 'savings-title',
                    className: "text-lg font-semibold text-purple-700 mb-4 flex items-center" 
                }, [
                    React.createElement('span', { key: 'icon', className: "mr-2 text-xl" }, '💎'),
                    t.savingsInfo
                ]),
                React.createElement('div', { key: 'savings-details', className: "space-y-2 text-sm" }, [
                    React.createElement('div', { key: 'pension-savings-display' }, [
                        React.createElement('span', { key: 'pension-label', className: "font-medium" }, `${t.pensionSavings}: `),
                        React.createElement('span', { key: 'pension-value' }, formatCurrency(inputs.currentSavings || 0))
                    ]),
                    React.createElement('div', { key: 'training-fund-display' }, [
                        React.createElement('span', { key: 'training-fund-label', className: "font-medium" }, `${t.trainingFund}: `),
                        React.createElement('span', { key: 'training-fund-value' }, formatCurrency(inputs.currentTrainingFundSavings || 0))
                    ]),
                    React.createElement('div', { key: 'total-savings-display', className: "pt-2 border-t" }, [
                        React.createElement('span', { key: 'total-savings-label', className: "font-medium" }, `${t.totalSavings}: `),
                        React.createElement('span', { key: 'total-savings-value', className: "text-purple-600 font-semibold" }, 
                            formatCurrency(calculateTotalSavings()))
                    ])
                ])
            ])
        ]),

        // Status Indicator
        React.createElement('div', { 
            key: 'status-indicator',
            className: `rounded-xl p-6 border text-center ${
                isDataComplete() 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-yellow-50 border-yellow-200'
            }`
        }, [
            React.createElement('div', { 
                key: 'status-icon',
                className: "text-4xl mb-2" 
            }, isDataComplete() ? '✅' : '⚠️'),
            React.createElement('h4', { 
                key: 'status-title',
                className: `text-lg font-semibold mb-2 ${
                    isDataComplete() ? 'text-green-700' : 'text-yellow-700'
                }`
            }, isDataComplete() ? t.readyToCalculate : t.missingData),
            React.createElement('p', { 
                key: 'status-message',
                className: `text-sm ${
                    isDataComplete() ? 'text-green-600' : 'text-yellow-600'
                }`
            }, isDataComplete() ? t.dataComplete : t.missingData)
        ])
    ]);
};

// Export to window for global access
window.WizardStepReview = WizardStepReview;
console.log('✅ WizardStepReview component loaded successfully');