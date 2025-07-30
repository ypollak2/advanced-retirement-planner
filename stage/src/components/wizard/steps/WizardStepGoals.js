// WizardStepGoals.js - Step 7: Retirement Goals
// Target retirement income and lifestyle planning with smart suggestions

const WizardStepGoals = ({ inputs, setInputs, language = 'en', workingCurrency = 'ILS' }) => {
    const [suggestions, setSuggestions] = React.useState(null);
    const [showSuggestions, setShowSuggestions] = React.useState(true);
    const [userOverrides, setUserOverrides] = React.useState({});
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
            info: 'יעדים אלו יעזרו לחשב את הסכום הנדרש לפרישה',
            suggested: 'מוצע',
            basedOnData: 'בהתבסס על הנתונים שלך, אנו ממליצים על היעדים הבאים:',
            refreshSuggestions: 'רענן הצעות',
            useSuggested: 'השתמש בהצעה',
            customValue: 'ערך מותאם אישית',
            explanation: 'הסבר',
            gapAnalysis: 'ניתוח פערים',
            onTrack: 'אתה על המסלול הנכון!',
            needsMore: 'דרוש חיסכון נוסף',
            monthlyNeeded: 'נדרש חיסכון חודשי נוסף'
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
            info: 'These goals help calculate the required retirement amount',
            suggested: 'Suggested',
            basedOnData: 'Based on your current data, we recommend the following goals:',
            refreshSuggestions: 'Refresh Suggestions',
            useSuggested: 'Use Suggested',
            customValue: 'Custom Value',
            explanation: 'Explanation',
            gapAnalysis: 'Gap Analysis',
            onTrack: 'You are on track!',
            needsMore: 'Additional savings needed',
            monthlyNeeded: 'Monthly additional savings needed'
        }
    };

    const t = content[language];

    const lifestyleMultipliers = {
        basic: 0.7,
        comfortable: 0.8,
        luxury: 1.0
    };

    const currentIncome = inputs.currentMonthlySalary || inputs.partner1Salary || 15000;

    // Generate suggestions when component mounts or key inputs change
    React.useEffect(() => {
        if (window.generateGoalSuggestions) {
            const newSuggestions = window.generateGoalSuggestions(inputs);
            setSuggestions(newSuggestions);
        }
    }, [inputs.currentAge, inputs.retirementAge, inputs.currentMonthlySalary, inputs.currentSavings, inputs.retirementLifestyle]);

    // Handle suggestion usage
    const useSuggestion = (field, value) => {
        setInputs({...inputs, [field]: value});
        setUserOverrides({...userOverrides, [field]: false});
    };

    // Handle manual input changes
    const handleManualChange = (field, value) => {
        setInputs({...inputs, [field]: value});
        setUserOverrides({...userOverrides, [field]: true});
    };

    // Get display value (user input or suggested)
    const getDisplayValue = (field, suggestedValue, defaultValue) => {
        if (inputs[field] !== undefined && inputs[field] !== null) {
            return inputs[field];
        }
        return suggestedValue || defaultValue;
    };

    // Check if value is user-overridden or suggested
    const isUserOverridden = (field) => {
        return userOverrides[field] === true;
    };

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
                    React.createElement('div', {
                        key: 'goal-header',
                        className: "flex justify-between items-center mb-2"
                    }, [
                        React.createElement('label', { 
                            key: 'goal-label',
                            className: "text-lg font-medium text-gray-700" 
                        }, t.retirementGoal),
                        suggestions && suggestions.retirementGoal && !isUserOverridden('retirementGoal') && 
                        React.createElement('span', {
                            key: 'suggested-badge',
                            className: "px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                        }, t.suggested)
                    ]),
                    React.createElement('div', {
                        key: 'goal-input-container',
                        className: "relative"
                    }, [
                        React.createElement('input', {
                            key: 'goal-input',
                            type: 'number',
                            value: getDisplayValue('retirementGoal', suggestions?.retirementGoal?.amount, 2000000),
                            onChange: (e) => handleManualChange('retirementGoal', parseInt(e.target.value) || 0),
                            className: `w-full p-4 text-xl border-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                !isUserOverridden('retirementGoal') && suggestions?.retirementGoal 
                                    ? 'border-blue-300 bg-blue-50' 
                                    : 'border-gray-300'
                            }`
                        }),
                        suggestions && suggestions.retirementGoal && isUserOverridden('retirementGoal') &&
                        React.createElement('button', {
                            key: 'use-suggested-goal',
                            type: 'button',
                            onClick: () => useSuggestion('retirementGoal', suggestions.retirementGoal.amount),
                            className: "absolute right-2 top-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                        }, t.useSuggested)
                    ]),
                    suggestions && suggestions.retirementGoal && React.createElement('div', {
                        key: 'goal-explanation',
                        className: "mt-2 p-3 bg-blue-50 rounded text-sm text-blue-800"
                    }, [
                        React.createElement('div', { key: 'explanation-text' }, suggestions.retirementGoal.explanation),
                        React.createElement('div', { key: 'suggested-amount', className: "font-medium mt-1" }, 
                            `${t.suggested}: ${currencySymbol}${suggestions.retirementGoal.amount.toLocaleString()}`)
                    ])
                ]),
                React.createElement('div', { key: 'monthly-expenses' }, [
                    React.createElement('div', {
                        key: 'expenses-header',
                        className: "flex justify-between items-center mb-2"
                    }, [
                        React.createElement('label', { 
                            key: 'expenses-label',
                            className: "text-lg font-medium text-gray-700" 
                        }, t.monthlyExpenses),
                        suggestions && suggestions.monthlyExpenses && !isUserOverridden('currentMonthlyExpenses') && 
                        React.createElement('span', {
                            key: 'suggested-badge-expenses',
                            className: "px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium"
                        }, t.suggested)
                    ]),
                    React.createElement('div', {
                        key: 'expenses-input-container',
                        className: "relative"
                    }, [
                        React.createElement('input', {
                            key: 'expenses-input',
                            type: 'number',
                            value: getDisplayValue('currentMonthlyExpenses', suggestions?.monthlyExpenses?.inflationAdjusted, Math.round(currentIncome * 0.8)),
                            onChange: (e) => handleManualChange('currentMonthlyExpenses', parseInt(e.target.value) || 0),
                            className: `w-full p-4 text-xl border-2 rounded-lg focus:ring-2 focus:ring-green-500 ${
                                !isUserOverridden('currentMonthlyExpenses') && suggestions?.monthlyExpenses 
                                    ? 'border-green-300 bg-green-50' 
                                    : 'border-gray-300'
                            }`
                        }),
                        suggestions && suggestions.monthlyExpenses && isUserOverridden('currentMonthlyExpenses') &&
                        React.createElement('button', {
                            key: 'use-suggested-expenses',
                            type: 'button',
                            onClick: () => useSuggestion('currentMonthlyExpenses', suggestions.monthlyExpenses.inflationAdjusted),
                            className: "absolute right-2 top-2 px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                        }, t.useSuggested)
                    ]),
                    suggestions && suggestions.monthlyExpenses && React.createElement('div', {
                        key: 'expenses-explanation',
                        className: "mt-2 p-3 bg-green-50 rounded text-sm text-green-800"
                    }, [
                        React.createElement('div', { key: 'explanation-text' }, suggestions.monthlyExpenses.explanation),
                        React.createElement('div', { key: 'suggested-amount', className: "font-medium mt-1" }, 
                            `${t.suggested}: ${currencySymbol}${suggestions.monthlyExpenses.inflationAdjusted.toLocaleString()}`)
                    ])
                ])
            ]),
            React.createElement('div', { key: 'emergency-fund' }, [
                React.createElement('div', {
                    key: 'emergency-header',
                    className: "flex justify-between items-center mb-2"
                }, [
                    React.createElement('label', { 
                        key: 'emergency-label',
                        className: "text-lg font-medium text-gray-700" 
                    }, t.emergencyFund),
                    suggestions && suggestions.emergencyFund && !isUserOverridden('emergencyFund') && 
                    React.createElement('span', {
                        key: 'suggested-badge-emergency',
                        className: "px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium"
                    }, t.suggested)
                ]),
                React.createElement('div', {
                    key: 'emergency-input-container',
                    className: "relative"
                }, [
                    React.createElement('input', {
                        key: 'emergency-input',
                        type: 'number',
                        value: getDisplayValue('emergencyFund', suggestions?.emergencyFund?.amount, currentIncome * 6),
                        onChange: (e) => handleManualChange('emergencyFund', parseInt(e.target.value) || 0),
                        className: `w-full p-4 text-xl border-2 rounded-lg focus:ring-2 focus:ring-yellow-500 ${
                            !isUserOverridden('emergencyFund') && suggestions?.emergencyFund 
                                ? 'border-yellow-300 bg-yellow-50' 
                                : 'border-gray-300'
                        }`
                    }),
                    suggestions && suggestions.emergencyFund && isUserOverridden('emergencyFund') &&
                    React.createElement('button', {
                        key: 'use-suggested-emergency',
                        type: 'button',
                        onClick: () => useSuggestion('emergencyFund', suggestions.emergencyFund.amount),
                        className: "absolute right-2 top-2 px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                    }, t.useSuggested)
                ]),
                suggestions && suggestions.emergencyFund && React.createElement('div', {
                    key: 'emergency-explanation',
                    className: "mt-2 p-3 bg-yellow-50 rounded text-sm text-yellow-800"
                }, [
                    React.createElement('div', { key: 'explanation-text' }, suggestions.emergencyFund.explanation),
                    React.createElement('div', { key: 'suggested-amount', className: "font-medium mt-1" }, 
                        `${t.suggested}: ${currencySymbol}${suggestions.emergencyFund.amount.toLocaleString()}`)
                ])
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
            // Suggestions summary and gap analysis
            suggestions && React.createElement('div', {
                key: 'suggestions-summary',
                className: "bg-indigo-50 rounded-xl p-6 border border-indigo-200 mt-6"
            }, [
                React.createElement('div', {
                    key: 'summary-header',
                    className: "flex justify-between items-center mb-4"
                }, [
                    React.createElement('h4', {
                        key: 'summary-title',
                        className: "text-lg font-semibold text-indigo-800"
                    }, t.basedOnData),
                    React.createElement('button', {
                        key: 'refresh-btn',
                        type: 'button',
                        onClick: () => {
                            const newSuggestions = window.generateGoalSuggestions(inputs);
                            setSuggestions(newSuggestions);
                        },
                        className: "px-3 py-1 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-600"
                    }, t.refreshSuggestions)
                ]),
                suggestions.gapAnalysis && React.createElement('div', {
                    key: 'gap-analysis',
                    className: "mt-4 p-4 bg-white rounded-lg border"
                }, [
                    React.createElement('h5', {
                        key: 'gap-title',
                        className: "font-semibold text-gray-800 mb-2"
                    }, t.gapAnalysis),
                    React.createElement('div', {
                        key: 'gap-content',
                        className: suggestions.gapAnalysis.onTrack ? "text-green-700" : "text-orange-700"
                    }, [
                        React.createElement('div', { key: 'status' }, 
                            suggestions.gapAnalysis.onTrack ? t.onTrack : t.needsMore),
                        !suggestions.gapAnalysis.onTrack && suggestions.gapAnalysis.monthlyAdditionalNeeded > 0 &&
                        React.createElement('div', { key: 'monthly-needed', className: "font-medium mt-1" },
                            `${t.monthlyNeeded}: ${currencySymbol}${suggestions.gapAnalysis.monthlyAdditionalNeeded.toLocaleString()}`)
                    ])
                ])
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