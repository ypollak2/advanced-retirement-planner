// Main Person Savings Module
// Individual mode savings input component

function MainPersonSavings({ inputs, setInputs, language, workingCurrency, t }) {
    const createElement = React.createElement;
    const { validateTaxRate, renderNetValue } = window.SavingsCalculations || {};
    const currencySymbol = window.SavingsContent ? window.SavingsContent.getCurrencySymbol(workingCurrency) : '₪';
    
    return createElement('div', { 
        key: 'main-savings-section',
        className: "mb-8" 
    }, [
        createElement('h3', { 
            key: 'main-savings-title',
            className: "text-xl font-semibold text-gray-700 mb-6 flex items-center" 
        }, [
            createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '💼'),
            t.currentSavings
        ]),
        createElement('div', { 
            key: 'savings-grid',
            className: "grid grid-cols-1 md:grid-cols-2 gap-6" 
        }, [
            // Pension Savings
            createElement('div', { 
                key: 'pension-savings',
                className: "bg-blue-50 rounded-xl p-6 border border-blue-200" 
            }, [
                createElement('label', { 
                    key: 'pension-label',
                    className: "block text-lg font-medium text-blue-700 mb-2" 
                }, t.pensionSavings),
                createElement('input', {
                    key: 'pension-input',
                    type: 'number',
                    value: inputs.currentSavings || 0,
                    onChange: (e) => setInputs({...inputs, currentSavings: parseInt(e.target.value) || 0}),
                    className: "w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                })
            ]),
            
            // Training Fund
            createElement('div', { 
                key: 'training-fund',
                className: "bg-green-50 rounded-xl p-6 border border-green-200" 
            }, [
                createElement('label', { 
                    key: 'training-label',
                    className: "block text-lg font-medium text-green-700 mb-2" 
                }, t.trainingFund),
                createElement('input', {
                    key: 'training-input',
                    type: 'number',
                    value: inputs.currentTrainingFund || 0,
                    onChange: (e) => setInputs({...inputs, currentTrainingFund: parseInt(e.target.value) || 0}),
                    className: "w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                })
            ]),
            
            // Emergency Fund
            createElement('div', { 
                key: 'emergency-fund',
                className: "bg-yellow-50 rounded-xl p-6 border border-yellow-200" 
            }, [
                createElement('label', { 
                    key: 'emergency-label',
                    className: "block text-lg font-medium text-yellow-700 mb-2" 
                }, t.emergencyFund),
                createElement('input', {
                    key: 'emergency-input',
                    type: 'number',
                    value: inputs.emergencyFund || 0,
                    onChange: (e) => setInputs({...inputs, emergencyFund: parseInt(e.target.value) || 0}),
                    className: "w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                })
            ]),
            
            // Personal Portfolio with Tax
            createElement('div', { 
                key: 'personal-portfolio',
                className: "bg-purple-50 rounded-xl p-6 border border-purple-200" 
            }, [
                createElement('label', { 
                    key: 'portfolio-label',
                    className: "block text-lg font-medium text-purple-700 mb-2" 
                }, t.personalPortfolio),
                createElement('input', {
                    key: 'portfolio-input',
                    type: 'number',
                    value: inputs.currentPersonalPortfolio || 0,
                    onChange: (e) => setInputs({...inputs, currentPersonalPortfolio: parseInt(e.target.value) || 0}),
                    className: "w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 mb-4"
                }),
                // Tax rate input
                inputs.currentPersonalPortfolio > 0 && createElement('div', { 
                    key: 'tax-rate-section',
                    className: 'animate-fadeIn transition-all duration-300 ease-in-out'
                }, [
                    createElement('label', { 
                        key: 'tax-rate-label',
                        className: "block text-sm font-medium text-purple-600 mb-2" 
                    }, t.capitalGainsTax),
                    createElement('div', { key: 'tax-input-container', className: 'relative' }, [
                        createElement('input', {
                            key: 'tax-rate-input',
                            type: 'number',
                            min: '0',
                            max: '50',
                            step: '0.1',
                            placeholder: '25',
                            value: inputs.portfolioTaxRate !== undefined && inputs.portfolioTaxRate !== null ? inputs.portfolioTaxRate : 25,
                            onChange: (e) => {
                                if (validateTaxRate) {
                                    const validatedRate = validateTaxRate(e.target.value);
                                    setInputs({...inputs, portfolioTaxRate: validatedRate});
                                }
                            },
                            onBlur: (e) => {
                                if (validateTaxRate) {
                                    const validatedRate = validateTaxRate(e.target.value);
                                    e.target.value = validatedRate;
                                    setInputs({...inputs, portfolioTaxRate: validatedRate});
                                }
                            },
                            className: `w-full p-2 text-sm border-2 rounded-lg focus:ring-2 focus:ring-purple-500 ${
                                inputs.portfolioTaxRate > 50 || inputs.portfolioTaxRate < 0 ? 
                                'border-red-300 bg-red-50' : 'border-gray-300'
                            }`
                        }),
                        createElement('span', {
                            key: 'percentage-symbol',
                            className: 'absolute right-3 top-2 text-sm text-gray-500 pointer-events-none'
                        }, '%')
                    ]),
                    // Validation error
                    (inputs.portfolioTaxRate > 50 || inputs.portfolioTaxRate < 0) && 
                    createElement('div', {
                        key: 'tax-validation-error',
                        className: 'text-xs text-red-600 mt-1 flex items-center'
                    }, [
                        createElement('span', { key: 'error-icon', className: 'mr-1' }, '⚠️'),
                        createElement('span', { key: 'error-text' }, t.taxRateError)
                    ]),
                    // Help text
                    createElement('div', {
                        key: 'tax-help',
                        className: "text-xs text-purple-500 mt-1"
                    }, t.israelTaxRates)
                ]),
                // Net Value After Tax
                inputs.currentPersonalPortfolio > 0 && createElement('div', { 
                    key: 'net-value-section',
                    className: 'animate-fadeIn transition-all duration-300 ease-in-out mt-4 p-4 bg-gradient-to-r from-purple-100 to-purple-50 rounded-lg border-2 border-purple-300 shadow-sm'
                }, [
                    createElement('label', { 
                        key: 'net-value-label',
                        className: "block text-sm font-medium text-purple-600 mb-2" 
                    }, [
                        createElement('span', { key: 'label-text' }, t.netValueAfterTax),
                        createElement('span', { key: 'label-icon', className: 'ml-2' }, '💰')
                    ]),
                    createElement('div', { 
                        key: 'net-value-amount',
                        className: "text-lg font-bold text-purple-800" 
                    }, createElement('div', {
                        key: 'net-value-display',
                        className: 'flex items-center justify-between'
                    }, [
                        createElement('span', {
                            key: 'net-amount',
                            className: 'text-xl font-bold text-purple-800'
                        }, renderNetValue ? renderNetValue(inputs.currentPersonalPortfolio, inputs.portfolioTaxRate) : ''),
                        workingCurrency !== 'ILS' && createElement('div', {
                            key: 'conversion-badge',
                            className: 'bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs font-medium'
                        }, `${workingCurrency}`)
                    ])),
                    // Currency conversion indicator
                    workingCurrency !== 'ILS' && createElement('div', {
                        key: 'currency-conversion-note',
                        className: 'flex items-center text-xs text-purple-500 mt-2 p-2 bg-purple-100 rounded border-l-4 border-purple-400'
                    }, [
                        createElement('span', { key: 'exchange-icon', className: 'mr-1' }, '🔄'),
                        createElement('span', { key: 'conversion-text' }, 
                            t.currencyConversion.replace('{currency}', workingCurrency)
                        )
                    ])
                ])
            ]),
            
            // Real Estate
            createElement('div', { 
                key: 'real-estate',
                className: "bg-orange-50 rounded-xl p-6 border border-orange-200" 
            }, [
                createElement('label', { 
                    key: 'realestate-label',
                    className: "block text-lg font-medium text-orange-700 mb-2" 
                }, t.realEstate),
                createElement('input', {
                    key: 'realestate-input',
                    type: 'number',
                    value: inputs.currentRealEstate || 0,
                    onChange: (e) => setInputs({...inputs, currentRealEstate: parseInt(e.target.value) || 0}),
                    className: "w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                })
            ]),
            
            // Cryptocurrency
            window.CryptoPortfolioInput ? createElement(window.CryptoPortfolioInput, {
                key: 'crypto-portfolio',
                inputs,
                setInputs,
                language,
                workingCurrency,
                fieldPrefix: 'current',
                className: "bg-yellow-50 rounded-xl p-6 border border-yellow-200"
            }) : createElement('div', { 
                key: 'cryptocurrency-fallback',
                className: "bg-yellow-50 rounded-xl p-6 border border-yellow-200" 
            }, [
                createElement('label', { 
                    key: 'crypto-label',
                    className: "block text-lg font-medium text-yellow-700 mb-2" 
                }, t.cryptocurrency),
                createElement('input', {
                    key: 'crypto-input',
                    type: 'number',
                    value: inputs.currentCrypto || 0,
                    onChange: (e) => setInputs({...inputs, currentCrypto: parseInt(e.target.value) || 0}),
                    className: "w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                })
            ]),
            
            // Savings Account
            createElement('div', { 
                key: 'savings-account',
                className: "bg-gray-50 rounded-xl p-6 border border-gray-200" 
            }, [
                createElement('label', { 
                    key: 'savings-account-label',
                    className: "block text-lg font-medium text-gray-700 mb-2" 
                }, t.savingsAccount),
                createElement('input', {
                    key: 'savings-account-input',
                    type: 'number',
                    value: inputs.currentSavingsAccount || 0,
                    onChange: (e) => setInputs({...inputs, currentSavingsAccount: parseInt(e.target.value) || 0}),
                    className: "w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500"
                })
            ]),
            
            // Bank Account
            createElement('div', { 
                key: 'bank-account',
                className: "bg-gray-50 rounded-xl p-6 border border-gray-200" 
            }, [
                createElement('label', { 
                    key: 'bank-account-label',
                    className: "block text-lg font-medium text-gray-700 mb-2" 
                }, t.bankAccount),
                createElement('input', {
                    key: 'bank-account-input',
                    type: 'number',
                    value: inputs.currentBankAccount || 0,
                    onChange: (e) => setInputs({...inputs, currentBankAccount: parseInt(e.target.value) || 0}),
                    className: "w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500"
                })
            ])
        ])
    ]);
}

// Export to window
window.MainPersonSavings = MainPersonSavings;

console.log('✅ Main person savings module loaded');