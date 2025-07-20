const BasicInputs = ({ inputs, setInputs, language, t, workingCurrency = 'ILS', Calculator, PiggyBank, DollarSign }) => {
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
        return React.createElement('div', { className: "space-y-6" }, [
            // Basic Data Section
            React.createElement('div', { 
                key: 'basic-data',
                className: "financial-card p-6 animate-slide-up" 
            }, [
                React.createElement('h2', { 
                    key: 'title',
                    className: "text-2xl font-bold text-purple-700 mb-6 flex items-center" 
                }, [
                    React.createElement(Calculator, { key: 'icon', className: "mr-2" }),
                    React.createElement('span', { key: 'text' }, t.basic || 'Basic Information')
                ]),
                React.createElement('div', { 
                    key: 'content',
                    className: "space-y-4" 
                }, [
                    // Planning Type Selection (Single/Couple)
                    React.createElement('div', { 
                        key: 'planning-type',
                        className: "mb-6" 
                    }, [
                        React.createElement('label', { 
                            key: 'planning-type-label',
                            className: "block text-sm font-medium text-gray-700 mb-3" 
                        }, language === 'he' ? "סוג התכנון" : "Planning Type"),
                        React.createElement('div', { 
                            key: 'planning-type-buttons',
                            className: "grid grid-cols-2 gap-3" 
                        }, [
                            React.createElement('button', {
                                key: 'single-planning',
                                type: 'button',
                                onClick: () => setInputs({...inputs, planningType: 'single'}),
                                className: `p-3 rounded-lg border-2 transition-all text-center ${
                                    (inputs.planningType || 'single') === 'single' 
                                        ? 'border-purple-500 bg-purple-50 text-purple-700' 
                                        : 'border-gray-200 bg-white hover:border-purple-300'
                                }`
                            }, [
                                React.createElement('div', { key: 'single-title', className: "font-medium" }, 
                                    language === 'he' ? 'רווק/ה' : 'Single'),
                                React.createElement('div', { key: 'single-desc', className: "text-xs opacity-75" }, 
                                    language === 'he' ? 'תכנון אישי' : 'Individual planning')
                            ]),
                            React.createElement('button', {
                                key: 'couple-planning',
                                type: 'button',
                                onClick: () => setInputs({...inputs, planningType: 'couple'}),
                                className: `p-3 rounded-lg border-2 transition-all text-center ${
                                    inputs.planningType === 'couple' 
                                        ? 'border-purple-500 bg-purple-50 text-purple-700' 
                                        : 'border-gray-200 bg-white hover:border-purple-300'
                                }`
                            }, [
                                React.createElement('div', { key: 'couple-title', className: "font-medium" }, 
                                    language === 'he' ? 'זוג' : 'Couple'),
                                React.createElement('div', { key: 'couple-desc', className: "text-xs opacity-75" }, 
                                    language === 'he' ? 'תכנון משותף' : 'Joint planning')
                            ])
                        ])
                    ]),
                    
                    // Partner Information (if couple selected)
                    inputs.planningType === 'couple' && React.createElement('div', { 
                        key: 'partner-info',
                        className: "bg-pink-50 rounded-lg p-4 border border-pink-200 mb-4" 
                    }, [
                        React.createElement('h3', { 
                            key: 'partner-info-title',
                            className: "text-lg font-semibold text-pink-700 mb-4 flex items-center" 
                        }, [
                            React.createElement('span', { key: 'icon', className: "mr-2" }, '👫'),
                            React.createElement('span', { key: 'text' }, language === 'he' ? 'פרטי בני הזוג' : 'Partner Information')
                        ]),
                        React.createElement('div', { 
                            key: 'partners-grid',
                            className: "grid grid-cols-1 md:grid-cols-2 gap-6" 
                        }, [
                            // Partner 1
                            React.createElement('div', { 
                                key: 'partner1',
                                className: "bg-white rounded-lg p-4 border border-pink-300" 
                            }, [
                                React.createElement('h4', { 
                                    key: 'partner1-title',
                                    className: "font-medium text-pink-700 mb-3" 
                                }, inputs.partner1Name || (language === 'he' ? 'בן/בת זוג 1' : 'Partner 1')),
                                React.createElement('div', { key: 'partner1-fields', className: "space-y-3" }, [
                                    React.createElement('div', { key: 'partner1-name' }, [
                                        React.createElement('label', { 
                                            key: 'partner1-name-label',
                                            className: "block text-sm font-medium text-gray-700 mb-1" 
                                        }, language === 'he' ? 'שם' : 'Name'),
                                        React.createElement('input', {
                                            key: 'partner1-name-input',
                                            type: 'text',
                                            value: inputs.partner1Name || '',
                                            onChange: (e) => setInputs({...inputs, partner1Name: e.target.value}),
                                            placeholder: language === 'he' ? 'הזן שם' : 'Enter name',
                                            className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 text-sm"
                                        })
                                    ]),
                                    React.createElement('div', { key: 'partner1-age' }, [
                                        React.createElement('label', { 
                                            key: 'partner1-age-label',
                                            className: "block text-sm font-medium text-gray-700 mb-1" 
                                        }, language === 'he' ? 'גיל' : 'Age'),
                                        React.createElement('input', {
                                            key: 'partner1-age-input',
                                            type: 'number',
                                            value: inputs.partner1Age || 0,
                                            onChange: (e) => setInputs({...inputs, partner1Age: parseInt(e.target.value) || 0}),
                                            className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 text-sm"
                                        })
                                    ]),
                                    React.createElement('div', { key: 'partner1-salary' }, [
                                        React.createElement('label', { 
                                            key: 'partner1-salary-label',
                                            className: "block text-sm font-medium text-gray-700 mb-1" 
                                        }, language === 'he' ? `משכורת חודשית - ברוטו (${currencySymbol})` : `Monthly Salary - Gross (${currencySymbol})`),
                                        React.createElement('input', {
                                            key: 'partner1-salary-input',
                                            type: 'number',
                                            value: inputs.partner1Salary || 0,
                                            onChange: (e) => setInputs({...inputs, partner1Salary: parseInt(e.target.value) || 0}),
                                            className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 text-sm"
                                        })
                                    ]),
                                    React.createElement('div', { key: 'partner1-training-fund' }, [
                                        React.createElement('label', { 
                                            key: 'partner1-training-fund-label',
                                            className: "block text-sm font-medium text-gray-700 mb-1" 
                                        }, language === 'he' ? 'קרן השתלמות (%)' : 'Training Fund (%)'),
                                        React.createElement('input', {
                                            key: 'partner1-training-fund-input',
                                            type: 'number',
                                            step: '0.1',
                                            value: inputs.partner1TrainingFundRate || 10.0,
                                            onChange: (e) => setInputs({...inputs, partner1TrainingFundRate: parseFloat(e.target.value) || 0}),
                                            className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 text-sm"
                                        })
                                    ]),
                                    React.createElement('div', { key: 'partner1-management-fees' }, [
                                        React.createElement('label', { 
                                            key: 'partner1-management-fees-label',
                                            className: "block text-sm font-medium text-gray-700 mb-1" 
                                        }, language === 'he' ? 'דמי ניהול (%)' : 'Management Fees (%)'),
                                        React.createElement('input', {
                                            key: 'partner1-management-fees-input',
                                            type: 'number',
                                            step: '0.1',
                                            value: inputs.partner1ManagementFees || 1.0,
                                            onChange: (e) => setInputs({...inputs, partner1ManagementFees: parseFloat(e.target.value) || 0}),
                                            className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 text-sm"
                                        })
                                    ]),
                                    React.createElement('div', { key: 'partner1-current-savings' }, [
                                        React.createElement('label', { 
                                            key: 'partner1-current-savings-label',
                                            className: "block text-sm font-medium text-gray-700 mb-1" 
                                        }, language === 'he' ? `חיסכון קיים (${currencySymbol})` : `Current Savings (${currencySymbol})`),
                                        React.createElement('input', {
                                            key: 'partner1-current-savings-input',
                                            type: 'number',
                                            value: inputs.partner1CurrentSavings || 0,
                                            onChange: (e) => setInputs({...inputs, partner1CurrentSavings: parseInt(e.target.value) || 0}),
                                            className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 text-sm"
                                        })
                                    ])
                                ])
                            ]),
                            // Partner 2
                            React.createElement('div', { 
                                key: 'partner2',
                                className: "bg-white rounded-lg p-4 border border-pink-300" 
                            }, [
                                React.createElement('h4', { 
                                    key: 'partner2-title',
                                    className: "font-medium text-pink-700 mb-3" 
                                }, inputs.partner2Name || (language === 'he' ? 'בן/בת זוג 2' : 'Partner 2')),
                                React.createElement('div', { key: 'partner2-fields', className: "space-y-3" }, [
                                    React.createElement('div', { key: 'partner2-name' }, [
                                        React.createElement('label', { 
                                            key: 'partner2-name-label',
                                            className: "block text-sm font-medium text-gray-700 mb-1" 
                                        }, language === 'he' ? 'שם' : 'Name'),
                                        React.createElement('input', {
                                            key: 'partner2-name-input',
                                            type: 'text',
                                            value: inputs.partner2Name || '',
                                            onChange: (e) => setInputs({...inputs, partner2Name: e.target.value}),
                                            placeholder: language === 'he' ? 'הזן שם' : 'Enter name',
                                            className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 text-sm"
                                        })
                                    ]),
                                    React.createElement('div', { key: 'partner2-age' }, [
                                        React.createElement('label', { 
                                            key: 'partner2-age-label',
                                            className: "block text-sm font-medium text-gray-700 mb-1" 
                                        }, language === 'he' ? 'גיל' : 'Age'),
                                        React.createElement('input', {
                                            key: 'partner2-age-input',
                                            type: 'number',
                                            value: inputs.partner2Age || 0,
                                            onChange: (e) => setInputs({...inputs, partner2Age: parseInt(e.target.value) || 0}),
                                            className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 text-sm"
                                        })
                                    ]),
                                    React.createElement('div', { key: 'partner2-salary' }, [
                                        React.createElement('label', { 
                                            key: 'partner2-salary-label',
                                            className: "block text-sm font-medium text-gray-700 mb-1" 
                                        }, language === 'he' ? `משכורת חודשית - ברוטו (${currencySymbol})` : `Monthly Salary - Gross (${currencySymbol})`),
                                        React.createElement('input', {
                                            key: 'partner2-salary-input',
                                            type: 'number',
                                            value: inputs.partner2Salary || 0,
                                            onChange: (e) => setInputs({...inputs, partner2Salary: parseInt(e.target.value) || 0}),
                                            className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 text-sm"
                                        })
                                    ]),
                                    React.createElement('div', { key: 'partner2-training-fund' }, [
                                        React.createElement('label', { 
                                            key: 'partner2-training-fund-label',
                                            className: "block text-sm font-medium text-gray-700 mb-1" 
                                        }, language === 'he' ? 'קרן השתלמות (%)' : 'Training Fund (%)'),
                                        React.createElement('input', {
                                            key: 'partner2-training-fund-input',
                                            type: 'number',
                                            step: '0.1',
                                            value: inputs.partner2TrainingFundRate || 10.0,
                                            onChange: (e) => setInputs({...inputs, partner2TrainingFundRate: parseFloat(e.target.value) || 0}),
                                            className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 text-sm"
                                        })
                                    ]),
                                    React.createElement('div', { key: 'partner2-management-fees' }, [
                                        React.createElement('label', { 
                                            key: 'partner2-management-fees-label',
                                            className: "block text-sm font-medium text-gray-700 mb-1" 
                                        }, language === 'he' ? 'דמי ניהול (%)' : 'Management Fees (%)'),
                                        React.createElement('input', {
                                            key: 'partner2-management-fees-input',
                                            type: 'number',
                                            step: '0.1',
                                            value: inputs.partner2ManagementFees || 1.0,
                                            onChange: (e) => setInputs({...inputs, partner2ManagementFees: parseFloat(e.target.value) || 0}),
                                            className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 text-sm"
                                        })
                                    ]),
                                    React.createElement('div', { key: 'partner2-current-savings' }, [
                                        React.createElement('label', { 
                                            key: 'partner2-current-savings-label',
                                            className: "block text-sm font-medium text-gray-700 mb-1" 
                                        }, language === 'he' ? `חיסכון קיים (${currencySymbol})` : `Current Savings (${currencySymbol})`),
                                        React.createElement('input', {
                                            key: 'partner2-current-savings-input',
                                            type: 'number',
                                            value: inputs.partner2CurrentSavings || 0,
                                            onChange: (e) => setInputs({...inputs, partner2CurrentSavings: parseInt(e.target.value) || 0}),
                                            className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 text-sm"
                                        })
                                    ])
                                ])
                            ])
                        ])
                    ]),

                    React.createElement('div', { 
                        key: 'row1',
                        className: "grid grid-cols-2 gap-4" 
                    }, [
                        React.createElement('div', { key: 'age' }, [
                            React.createElement('div', { key: 'age-label-wrapper', className: 'flex items-center gap-2 mb-1' }, [
                                React.createElement('label', { 
                                    key: 'age-label',
                                    className: "block text-sm font-medium text-gray-700" 
                                }, t.currentAge || 'Current Age'),
                                window.HelpTooltip && React.createElement(window.HelpTooltip, {
                                    key: 'age-help',
                                    term: 'currentAge',
                                    language: language
                                }, '❓')
                            ]),
                            React.createElement('input', {
                                key: 'current-age-input',
                                type: 'number',
                                value: inputs.currentAge,
                                onChange: (e) => setInputs({...inputs, currentAge: parseInt(e.target.value) || 0}),
                                className: "financial-input"
                            })
                        ]),
                        React.createElement('div', { key: 'retirement' }, [
                            React.createElement('div', { key: 'retirement-label-wrapper', className: 'flex items-center gap-2 mb-1' }, [
                                React.createElement('label', { 
                                    key: 'retirement-label',
                                    className: "block text-sm font-medium text-gray-700" 
                                }, t.retirementAge || 'Retirement Age'),
                                window.HelpTooltip && React.createElement(window.HelpTooltip, {
                                    key: 'retirement-help',
                                    term: 'retirementAge',
                                    language: language
                                }, '❓')
                            ]),
                            React.createElement('input', {
                                key: 'retirement-age-input',
                                type: 'number',
                                value: inputs.retirementAge,
                                onChange: (e) => setInputs({...inputs, retirementAge: parseInt(e.target.value) || 0}),
                                className: "financial-input"
                            })
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'row2',
                        className: "grid grid-cols-2 gap-4" 
                    }, [
                        React.createElement('div', { key: 'savings' }, [
                            React.createElement('label', { 
                                key: 'savings-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, language === 'he' ? `חיסכון נוכחי בפנסיה (${currencySymbol})` : `Current Pension Savings (${currencySymbol})`),
                            React.createElement('input', {
                                key: 'current-savings-input',
                                type: 'number',
                                value: inputs.currentSavings,
                                onChange: (e) => setInputs({...inputs, currentSavings: parseInt(e.target.value) || 0}),
                                className: "financial-input"
                            })
                        ]),
                        React.createElement('div', { key: 'training-fund' }, [
                            React.createElement('label', { 
                                key: 'training-fund-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, language === 'he' ? `קרן השתלמות נוכחית (${currencySymbol})` : `Current Training Fund (${currencySymbol})`),
                            React.createElement('input', {
                                key: 'training-fund-input',
                                type: 'number',
                                value: inputs.currentTrainingFundSavings || 0,
                                onChange: (e) => setInputs({...inputs, currentTrainingFundSavings: parseInt(e.target.value) || 0}),
                                className: "financial-input"
                            })
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'row3',
                        className: "grid grid-cols-2 gap-4" 
                    }, [
                        inputs.planningType !== 'couple' ? React.createElement('div', { key: 'salary' }, [
                            React.createElement('label', { 
                                key: 'salary-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, language === 'he' ? `משכורת חודשית - ברוטו (${currencySymbol})` : `Monthly Salary - Gross (${currencySymbol})`),
                            React.createElement('input', {
                                key: 'monthly-salary-input',
                                type: 'number',
                                value: inputs.currentMonthlySalary || 15000,
                                onChange: (e) => setInputs({...inputs, currentMonthlySalary: parseInt(e.target.value) || 0}),
                                className: "financial-input"
                            })
                        ]) : React.createElement('div', { 
                            key: 'couple-salary-info',
                            className: "col-span-1 bg-blue-50 rounded-lg p-3 border border-blue-200"
                        }, [
                            React.createElement('div', {
                                key: 'info-icon',
                                className: "flex items-center text-blue-700 text-sm font-medium mb-1"
                            }, [
                                React.createElement('span', { key: 'icon', className: "mr-2" }, 'ℹ️'),
                                language === 'he' ? 'תכנון זוגי' : 'Couple Planning'
                            ]),
                            React.createElement('p', {
                                key: 'info-text',
                                className: "text-blue-600 text-xs"
                            }, language === 'he' ? 
                                'המשכורות מוגדרות למעלה עבור כל בן/בת זוג בנפרד. התוצאות יחושבו על בסיס המשכורות המשולבות.' :
                                'Salaries are defined above for each partner separately. Results will be calculated based on combined salaries.')
                        ]),
                        React.createElement('div', { key: 'training-contribution' }, [
                            React.createElement('label', { 
                                key: 'training-contribution-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, language === 'he' ? `הפקדה חודשית לקרן השתלמות (${currencySymbol})` : `Monthly Training Fund Contribution (${currencySymbol})`),
                            React.createElement('input', {
                                key: 'training-contribution-display',
                                type: 'number',
                                value: Math.round((inputs.currentSalary || 20000) * 0.075),
                                readOnly: true,
                                className: "financial-input bg-gray-100"
                            })
                        ]),
                        React.createElement('div', { key: 'training-fund-options' }, [
                            React.createElement('label', {
                                key: 'training-fund-options-label',
                                className: "block text-sm font-medium text-gray-700 mb-1"
                            }, language === 'he' ? "אפשרויות קרן השתלמות" : "Training Fund Options"),
                            React.createElement('div', { key: 'has-training-fund-option', className: 'flex items-center' }, [
                                React.createElement('input', {
                                    key: 'has-training-fund-checkbox',
                                    type: 'checkbox',
                                    id: 'has-training-fund',
                                    checked: inputs.hasTrainingFund,
                                    onChange: (e) => setInputs({ ...inputs, hasTrainingFund: e.target.checked }),
                                    className: 'h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
                                }),
                                React.createElement('label', {
                                    key: 'has-training-fund-label',
                                    htmlFor: 'has-training-fund',
                                    className: 'ml-2 block text-sm text-gray-900'
                                }, language === 'he' ? "כולל קרן השתלמות" : "Include Training Fund")
                            ]),
                            React.createElement('div', { key: 'above-ceiling-option', className: 'flex items-center' }, [
                                React.createElement('input', {
                                    key: 'above-ceiling-checkbox',
                                    type: 'checkbox',
                                    id: 'contribute-above-ceiling',
                                    checked: inputs.trainingFundContributeAboveCeiling,
                                    onChange: (e) => setInputs({ ...inputs, trainingFundContributeAboveCeiling: e.target.checked }),
                                    className: 'h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
                                }),
                                React.createElement('label', {
                                    key: 'above-ceiling-label',
                                    htmlFor: 'contribute-above-ceiling',
                                    className: 'ml-2 block text-sm text-gray-900'
                                }, language === 'he' ? "הפרשה מעל התקרה" : "Contribute Above Ceiling")
                            ])
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'row4',
                        className: "grid grid-cols-2 gap-4" 
                    }, [
                        React.createElement('div', { key: 'contribution-fees' }, [
                            React.createElement('label', { 
                                key: 'contribution-fees-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, language === 'he' ? "דמי ניהול מהפקדות (%)" : "Management Fees on Contributions (%)"),
                            React.createElement('input', {
                                key: 'contribution-fees-input',
                                type: 'number',
                                step: '0.1',
                                value: inputs.contributionFees || 1.0,
                                onChange: (e) => setInputs({...inputs, contributionFees: parseFloat(e.target.value) || 0}),
                                className: "financial-input"
                            })
                        ]),
                        React.createElement('div', { key: 'expected-yield' }, [
                            React.createElement('label', { 
                                key: 'expected-yield-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, language === 'he' ? "תשואה שנתית צפויה (%)" : "Expected Annual Yield (%)"),
                            React.createElement('input', {
                                key: 'expected-return-input',
                                type: 'number',
                                step: '0.1',
                                value: inputs.expectedReturn || 7,
                                onChange: (e) => setInputs({...inputs, expectedReturn: parseFloat(e.target.value) || 0}),
                                className: "financial-input"
                            })
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'row5',
                        className: "grid grid-cols-2 gap-4" 
                    }, [
                        React.createElement('div', { key: 'accumulation-fees' }, [
                            React.createElement('label', { 
                                key: 'accumulation-fees-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, language === 'he' ? "דמי ניהול מצבירה (%)" : "Management Fees on Accumulation (%)"),
                            React.createElement('input', {
                                key: 'accumulation-fees-input',
                                type: 'number',
                                step: '0.1',
                                value: inputs.accumulationFees || 0.1,
                                onChange: (e) => setInputs({...inputs, accumulationFees: parseFloat(e.target.value) || 0}),
                                className: "financial-input"
                            })
                        ]),
                        React.createElement('div', { key: 'inflation' }, [
                            React.createElement('label', { 
                                key: 'inflation-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, language === 'he' ? "שיעור אינפלציה שנתי (%)" : "Annual Inflation Rate (%)"),
                            React.createElement('input', {
                                key: 'inflation-rate-input',
                                type: 'number',
                                step: '0.1',
                                value: inputs.inflationRate || 3,
                                onChange: (e) => setInputs({...inputs, inflationRate: parseFloat(e.target.value) || 0}),
                                className: "financial-input"
                            })
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'row6',
                        className: "grid grid-cols-2 gap-4" 
                    }, [
                        React.createElement('div', { key: 'training-fund-fees' }, [
                            React.createElement('label', { 
                                key: 'training-fund-fees-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, language === 'he' ? "דמי ניהול קרן השתלמות (%)" : "Training Fund Management Fees (%)"),
                            React.createElement('input', {
                                key: 'training-fund-fees-input',
                                type: 'number',
                                step: '0.1',
                                value: inputs.trainingFundFees || 0.6,
                                onChange: (e) => setInputs({...inputs, trainingFundFees: parseFloat(e.target.value) || 0}),
                                className: "financial-input"
                            })
                        ]),
                        React.createElement('div', { key: 'tax-country' }, [
                            React.createElement('label', { 
                                key: 'tax-country-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, language === 'he' ? "מדינה למס הכנסה" : "Tax Country"),
                            React.createElement('select', {
                                key: 'tax-country-select',
                                value: inputs.taxCountry || 'israel',
                                onChange: (e) => setInputs({...inputs, taxCountry: e.target.value}),
                                className: "financial-input"
                            }, [
                                React.createElement('option', { key: 'israel', value: 'israel' }, 
                                    language === 'he' ? 'ישראל' : 'Israel'),
                                React.createElement('option', { key: 'uk', value: 'uk' }, 
                                    language === 'he' ? 'בריטניה' : 'United Kingdom'),
                                React.createElement('option', { key: 'us', value: 'us' }, 
                                    language === 'he' ? 'ארה״ב' : 'United States')
                            ])
                        ])
                    ]),

                    // RSU (Restricted Stock Units) Section
                    React.createElement('div', {
                        key: 'rsu-section',
                        className: "bg-indigo-50 rounded-lg p-4 border border-indigo-200 mt-6"
                    }, [
                        React.createElement('h3', {
                            key: 'rsu-title',
                            className: "text-lg font-semibold text-indigo-700 mb-4 flex items-center"
                        }, [
                            React.createElement('span', { key: 'rsu-icon', className: "mr-2" }, '📈'),
                            language === 'he' ? 'יחידות מניה מוגבלות (RSU)' : 'Restricted Stock Units (RSU)'
                        ]),
                        
                        React.createElement('div', {
                            key: 'rsu-grid',
                            className: "grid grid-cols-1 md:grid-cols-2 gap-4"
                        }, [
                            // Enhanced RSU Company Selection with Search
                            React.createElement(EnhancedRSUCompanySelector, {
                                key: 'rsu-company-enhanced',
                                inputs,
                                setInputs,
                                language
                            }),

                            React.createElement('div', { key: 'rsu-units' }, [
                                React.createElement('label', {
                                    key: 'rsu-units-label',
                                    className: "block text-sm font-medium text-gray-700 mb-1"
                                }, language === 'he' ? 'מספר יחידות שנתי' : 'Annual RSU Units'),
                                React.createElement('input', {
                                    key: 'rsu-units-input',
                                    type: 'number',
                                    value: inputs.rsuUnits || 0,
                                    onChange: (e) => setInputs({...inputs, rsuUnits: parseInt(e.target.value) || 0}),
                                    placeholder: language === 'he' ? 'מספר יחידות' : 'Number of units',
                                    className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 text-sm"
                                })
                            ]),

                            React.createElement('div', { key: 'rsu-current-price' }, [
                                React.createElement('label', {
                                    key: 'rsu-current-price-label',
                                    className: "block text-sm font-medium text-gray-700 mb-1"
                                }, language === 'he' ? 'מחיר נוכחי ($)' : 'Current Price ($)'),
                                React.createElement('input', {
                                    key: 'rsu-current-price-input',
                                    type: 'number',
                                    step: '0.01',
                                    value: inputs.rsuCurrentPrice || 0,
                                    onChange: (e) => setInputs({...inputs, rsuCurrentPrice: parseFloat(e.target.value) || 0}),
                                    placeholder: language === 'he' ? 'מחיר למניה' : 'Price per share',
                                    className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 text-sm"
                                })
                            ]),

                            React.createElement('div', { key: 'rsu-vesting-years' }, [
                                React.createElement('label', {
                                    key: 'rsu-vesting-years-label',
                                    className: "block text-sm font-medium text-gray-700 mb-1"
                                }, language === 'he' ? 'תקופת הבשלה (שנים)' : 'Vesting Period (Years)'),
                                React.createElement('select', {
                                    key: 'rsu-vesting-years-select',
                                    value: inputs.rsuVestingYears || 4,
                                    onChange: (e) => setInputs({...inputs, rsuVestingYears: parseInt(e.target.value)}),
                                    className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 text-sm"
                                }, [
                                    React.createElement('option', { key: 'vest-1', value: 1 }, '1 ' + (language === 'he' ? 'שנה' : 'year')),
                                    React.createElement('option', { key: 'vest-2', value: 2 }, '2 ' + (language === 'he' ? 'שנים' : 'years')),
                                    React.createElement('option', { key: 'vest-3', value: 3 }, '3 ' + (language === 'he' ? 'שנים' : 'years')),
                                    React.createElement('option', { key: 'vest-4', value: 4 }, '4 ' + (language === 'he' ? 'שנים' : 'years')),
                                    React.createElement('option', { key: 'vest-5', value: 5 }, '5 ' + (language === 'he' ? 'שנים' : 'years'))
                                ])
                            ]),

                            React.createElement('div', { key: 'rsu-tax-country' }, [
                                React.createElement('label', {
                                    key: 'rsu-tax-country-label',
                                    className: "block text-sm font-medium text-gray-700 mb-1"
                                }, language === 'he' ? 'מדינת מס RSU' : 'RSU Tax Country'),
                                React.createElement('select', {
                                    key: 'rsu-tax-country-select',
                                    value: inputs.rsuTaxCountry || 'israel',
                                    onChange: (e) => setInputs({...inputs, rsuTaxCountry: e.target.value}),
                                    className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 text-sm"
                                }, [
                                    React.createElement('option', { key: 'rsu-israel', value: 'israel' }, 
                                        language === 'he' ? 'ישראל' : 'Israel'),
                                    React.createElement('option', { key: 'rsu-us', value: 'us' }, 
                                        language === 'he' ? 'ארה״ב' : 'United States')
                                ])
                            ]),

                            React.createElement('div', { key: 'rsu-expected-growth' }, [
                                React.createElement('label', {
                                    key: 'rsu-expected-growth-label',
                                    className: "block text-sm font-medium text-gray-700 mb-1"
                                }, language === 'he' ? 'צמיחה צפויה שנתית (%)' : 'Expected Annual Growth (%)'),
                                React.createElement('input', {
                                    key: 'rsu-expected-growth-input',
                                    type: 'number',
                                    step: '0.1',
                                    value: inputs.rsuExpectedGrowth || 10,
                                    onChange: (e) => setInputs({...inputs, rsuExpectedGrowth: parseFloat(e.target.value) || 0}),
                                    className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 text-sm"
                                })
                            ])
                        ]),

                        React.createElement('div', {
                            key: 'rsu-info',
                            className: "mt-3 p-3 bg-indigo-100 rounded text-sm text-indigo-700"
                        }, language === 'he' ? 
                            '💡 יחידות מניה מוגבלות (RSU) הן הטבה שכיחה בחברות טכנולוגיה. המחיר יתעדכן אוטומטית מ-API' :
                            '💡 Restricted Stock Units (RSUs) are common tech company benefits. Stock prices will update automatically via API')
                    ])
                ])
            ])
        ]);
    };

// Export to window for global access
window.BasicInputs = BasicInputs;