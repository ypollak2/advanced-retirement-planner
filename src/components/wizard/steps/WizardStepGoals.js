// WizardStepGoals.js - Step 7: Retirement Goals
// Target retirement income and lifestyle planning

const WizardStepGoals = ({ inputs, setInputs, language = 'en', workingCurrency = 'ILS' }) => {
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

    const content = {
        he: {
            title: 'יעדי פרישה',
            retirementGoal: `יעד חיסכון לפרישה (${currencySymbol})`,
            monthlyExpenses: `הוצאות חודשיות רצויות בפרישה (${currencySymbol})`,
            emergencyFund: `קרן חירום (${currencySymbol})`,
            lifestyle: 'אורח חיים בפרישה',
            basic: 'בסיסי',
            comfortable: 'נוח',
            luxury: 'יוקרתי',
            info: 'יעדים אלו יעזרו לחשב את הסכום הנדרש לפרישה'
        },
        en: {
            title: 'Retirement Goals',
            retirementGoal: `Retirement Savings Goal (${currencySymbol})`,
            monthlyExpenses: `Desired Monthly Expenses in Retirement (${currencySymbol})`,
            emergencyFund: `Emergency Fund (${currencySymbol})`,
            lifestyle: 'Retirement Lifestyle',
            basic: 'Basic',
            comfortable: 'Comfortable',
            luxury: 'Luxury',
            info: 'These goals help calculate the required retirement amount'
        }
    };

    const t = content[language];

    const lifestyleMultipliers = {
        basic: 0.7,
        comfortable: 0.8,
        luxury: 1.0
    };

    const currentIncome = inputs.currentMonthlySalary || inputs.partner1Salary || 15000;

    return React.createElement('div', { className: "space-y-8" }, [
        React.createElement('div', { key: 'goals-section' }, [
            React.createElement('h3', { 
                key: 'title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '🎯'),
                t.title
            ]),
            React.createElement('div', { 
                key: 'goals-grid',
                className: "grid grid-cols-1 md:grid-cols-2 gap-6" 
            }, [
                React.createElement('div', { key: 'retirement-goal' }, [
                    React.createElement('label', { 
                        key: 'goal-label',
                        className: "block text-lg font-medium text-gray-700 mb-2" 
                    }, t.retirementGoal),
                    React.createElement('input', {
                        key: 'goal-input',
                        type: 'number',
                        value: inputs.retirementGoal || 2000000,
                        onChange: (e) => setInputs({...inputs, retirementGoal: parseInt(e.target.value) || 0}),
                        className: "w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    })
                ]),
                React.createElement('div', { key: 'monthly-expenses' }, [
                    React.createElement('label', { 
                        key: 'expenses-label',
                        className: "block text-lg font-medium text-gray-700 mb-2" 
                    }, t.monthlyExpenses),
                    React.createElement('input', {
                        key: 'expenses-input',
                        type: 'number',
                        value: inputs.currentMonthlyExpenses || Math.round(currentIncome * 0.8),
                        onChange: (e) => setInputs({...inputs, currentMonthlyExpenses: parseInt(e.target.value) || 0}),
                        className: "w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    })
                ])
            ]),
            React.createElement('div', { key: 'emergency-fund' }, [
                React.createElement('label', { 
                    key: 'emergency-label',
                    className: "block text-lg font-medium text-gray-700 mb-2" 
                }, t.emergencyFund),
                React.createElement('input', {
                    key: 'emergency-input',
                    type: 'number',
                    value: inputs.emergencyFund || (currentIncome * 6),
                    onChange: (e) => setInputs({...inputs, emergencyFund: parseInt(e.target.value) || 0}),
                    className: "w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                })
            ]),
            React.createElement('div', { 
                key: 'lifestyle',
                className: "mt-6" 
            }, [
                React.createElement('label', { 
                    key: 'lifestyle-label',
                    className: "block text-sm font-medium text-gray-700 mb-4" 
                }, t.lifestyle),
                React.createElement('div', { 
                    key: 'lifestyle-buttons',
                    className: "grid grid-cols-3 gap-4" 
                }, Object.keys(lifestyleMultipliers).map(lifestyle => 
                    React.createElement('button', {
                        key: lifestyle,
                        type: 'button',
                        onClick: () => setInputs({...inputs, retirementLifestyle: lifestyle}),
                        className: `p-4 rounded-lg border-2 transition-all text-center ${
                            (inputs.retirementLifestyle || 'comfortable') === lifestyle 
                                ? 'border-purple-500 bg-purple-50 text-purple-700' 
                                : 'border-gray-200 bg-white hover:border-purple-300'
                        }`
                    }, [
                        React.createElement('div', { key: 'name', className: "font-medium" }, t[lifestyle]),
                        React.createElement('div', { key: 'multiplier', className: "text-sm text-gray-500" }, 
                            `${Math.round(lifestyleMultipliers[lifestyle] * 100)}% of income`)
                    ])
                ))
            ]),
            React.createElement('div', { 
                key: 'info',
                className: "bg-purple-50 rounded-xl p-4 border border-purple-200 mt-6" 
            }, [
                React.createElement('p', { 
                    key: 'info-text',
                    className: "text-purple-700 text-sm" 
                }, t.info)
            ])
        ])
    ]);
};

window.WizardStepGoals = WizardStepGoals;
console.log('✅ WizardStepGoals component loaded successfully');