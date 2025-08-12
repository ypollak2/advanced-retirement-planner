// Partner Savings Module  
// Individual partner savings input component

function PartnerSavingsInput({ partnerId, inputs, setInputs, language, workingCurrency, t, partnerName }) {
    const createElement = React.createElement;
    const { validateTaxRate, renderNetValue } = window.SavingsCalculations || {};
    
    const isPartner1 = partnerId === 1;
    const prefix = isPartner1 ? 'partner1' : 'partner2';
    const bgColor = isPartner1 ? 'pink' : 'purple';
    const displayName = isPartner1 ? (inputs.userName || t.partner1Savings) : (inputs.partnerName || t.partner2Savings);
    
    return createElement('div', { 
        key: `${prefix}-savings`,
        className: `bg-${bgColor}-50 rounded-xl p-6 border border-${bgColor}-200` 
    }, [
        createElement('h4', { 
            key: `${prefix}-title`,
            className: `text-lg font-semibold text-${bgColor}-700 mb-4` 
        }, displayName),
        createElement('div', { key: `${prefix}-fields`, className: "space-y-4" }, [
            // Pension
            createElement('div', { key: `${prefix}-pension` }, [
                createElement('label', { 
                    key: `${prefix}-pension-label`,
                    className: "block text-sm font-medium text-gray-700 mb-1" 
                }, t.pensionSavings),
                createElement('input', {
                    key: `${prefix}-pension-input`,
                    type: 'number',
                    value: inputs[`${prefix}CurrentPension`] || 0,
                    onChange: (e) => setInputs({...inputs, [`${prefix}CurrentPension`]: parseInt(e.target.value) || 0}),
                    className: `w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-${bgColor}-500`
                })
            ]),
            // Training Fund
            createElement('div', { key: `${prefix}-training` }, [
                createElement('label', { 
                    key: `${prefix}-training-label`,
                    className: "block text-sm font-medium text-gray-700 mb-1" 
                }, t.trainingFund),
                createElement('input', {
                    key: `${prefix}-training-input`,
                    type: 'number',
                    value: inputs[`${prefix}CurrentTrainingFund`] || 0,
                    onChange: (e) => setInputs({...inputs, [`${prefix}CurrentTrainingFund`]: parseInt(e.target.value) || 0}),
                    className: `w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-${bgColor}-500`
                })
            ]),
            // Emergency Fund
            createElement('div', { key: `${prefix}-emergency` }, [
                createElement('label', { 
                    key: `${prefix}-emergency-label`,
                    className: "block text-sm font-medium text-gray-700 mb-1" 
                }, t.emergencyFund),
                createElement('input', {
                    key: `${prefix}-emergency-input`,
                    type: 'number',
                    value: inputs[`${prefix}EmergencyFund`] || 0,
                    onChange: (e) => setInputs({...inputs, [`${prefix}EmergencyFund`]: parseInt(e.target.value) || 0}),
                    className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500"
                })
            ]),
            // Personal Portfolio with Tax
            createElement('div', { key: `${prefix}-portfolio` }, [
                createElement('label', { 
                    key: `${prefix}-portfolio-label`,
                    className: "block text-sm font-medium text-gray-700 mb-1" 
                }, t.personalPortfolio),
                createElement('input', {
                    key: `${prefix}-portfolio-input`,
                    type: 'number',
                    value: inputs[`${prefix}PersonalPortfolio`] || 0,
                    onChange: (e) => setInputs({...inputs, [`${prefix}PersonalPortfolio`]: parseInt(e.target.value) || 0}),
                    className: `w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-${bgColor}-500 mb-2`
                }),
                // Tax rate input
                inputs[`${prefix}PersonalPortfolio`] > 0 && createElement('div', { 
                    key: `${prefix}-tax-rate-section`,
                    className: `animate-fadeIn transition-all duration-300 ease-in-out mt-2 p-3 bg-${bgColor}-50 rounded border border-${bgColor}-200`
                }, [
                    createElement('label', { 
                        key: `${prefix}-tax-rate-label`,
                        className: `block text-xs font-medium text-${bgColor}-600 mb-1` 
                    }, t.capitalGainsTax),
                    createElement('div', { key: `${prefix}-tax-input-container`, className: 'relative' }, [
                        createElement('input', {
                            key: `${prefix}-tax-rate-input`,
                            id: `${prefix}-tax-rate-input`,
                            type: 'number',
                            min: '0',
                            max: '50',
                            step: '0.1',
                            placeholder: '25',
                            value: inputs[`${prefix}PortfolioTaxRate`] !== undefined && inputs[`${prefix}PortfolioTaxRate`] !== null ? inputs[`${prefix}PortfolioTaxRate`] : 25,
                            onChange: (e) => {
                                if (validateTaxRate) {
                                    const validatedRate = validateTaxRate(e.target.value);
                                    setInputs({...inputs, [`${prefix}PortfolioTaxRate`]: validatedRate});
                                }
                            },
                            onBlur: (e) => {
                                if (validateTaxRate) {
                                    const validatedRate = validateTaxRate(e.target.value);
                                    e.target.value = validatedRate;
                                    setInputs({...inputs, [`${prefix}PortfolioTaxRate`]: validatedRate});
                                }
                            },
                            className: `w-full p-1 text-sm border rounded focus:ring-2 focus:ring-${bgColor}-500 ${
                                inputs[`${prefix}PortfolioTaxRate`] > 50 || inputs[`${prefix}PortfolioTaxRate`] < 0 ? 
                                'border-red-300 bg-red-50' : 'border-gray-300'
                            }`
                        }),
                        createElement('span', {
                            key: `${prefix}-percentage-symbol`,
                            className: 'absolute right-2 top-1 text-xs text-gray-500 pointer-events-none'
                        }, '%')
                    ]),
                    // Validation feedback
                    (inputs[`${prefix}PortfolioTaxRate`] > 50 || inputs[`${prefix}PortfolioTaxRate`] < 0) && 
                    createElement('div', {
                        key: `${prefix}-tax-validation-error`,
                        className: 'text-xs text-red-600 mt-1'
                    }, `⚠️ ${t.taxRateError}`),
                    // Help text
                    createElement('div', {
                        key: `${prefix}-tax-help`,
                        className: `text-xs text-${bgColor}-500 mt-1`
                    }, t.israelTaxRatesShort)
                ]),
                // Net value after tax
                inputs[`${prefix}PersonalPortfolio`] > 0 && createElement('div', { 
                    key: `${prefix}-net-value-section`,
                    className: `animate-fadeIn transition-all duration-300 ease-in-out mt-2 p-2 bg-gradient-to-r from-${bgColor}-100 to-${bgColor}-50 rounded border border-${bgColor}-300`
                }, [
                    createElement('div', { 
                        key: `${prefix}-net-value-amount`,
                        className: `flex items-center justify-between text-sm font-bold text-${bgColor}-700` 
                    }, [
                        createElement('span', { key: `${prefix}-net-text` }, 
                            renderNetValue ? renderNetValue(inputs[`${prefix}PersonalPortfolio`], inputs[`${prefix}PortfolioTaxRate`], prefix, t.net) : ''
                        ),
                        createElement('span', { key: `${prefix}-money-icon` }, '💵')
                    ])
                ])
            ]),
            // Real Estate
            createElement('div', { key: `${prefix}-real-estate` }, [
                createElement('label', { 
                    key: `${prefix}-real-estate-label`,
                    className: "block text-sm font-medium text-gray-700 mb-1" 
                }, t.realEstate),
                createElement('input', {
                    key: `${prefix}-real-estate-input`,
                    type: 'number',
                    value: inputs[`${prefix}RealEstate`] || 0,
                    onChange: (e) => setInputs({...inputs, [`${prefix}RealEstate`]: parseInt(e.target.value) || 0}),
                    className: `w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-${bgColor}-500`
                })
            ]),
            // Cryptocurrency
            window.CryptoPortfolioInput ? createElement(window.CryptoPortfolioInput, {
                key: `${prefix}-crypto-portfolio`,
                inputs,
                setInputs,
                language,
                workingCurrency,
                fieldPrefix: prefix,
                compact: true,
                className: "w-full"
            }) : createElement('div', { key: `${prefix}-crypto-fallback` }, [
                createElement('label', { 
                    key: `${prefix}-crypto-label`,
                    className: "block text-sm font-medium text-gray-700 mb-1" 
                }, t.cryptocurrency),
                createElement('input', {
                    key: `${prefix}-crypto-input`,
                    type: 'number',
                    value: inputs[`${prefix}Crypto`] || 0,
                    onChange: (e) => setInputs({...inputs, [`${prefix}Crypto`]: parseInt(e.target.value) || 0}),
                    className: `w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-${bgColor}-500`
                })
            ]),
            // Bank Account
            createElement('div', { key: `${prefix}-bank-account` }, [
                createElement('label', { 
                    key: `${prefix}-bank-account-label`,
                    className: "block text-sm font-medium text-gray-700 mb-1" 
                }, t.bankAccount),
                createElement('input', {
                    key: `${prefix}-bank-account-input`,
                    type: 'number',
                    value: inputs[`${prefix}BankAccount`] || 0,
                    onChange: (e) => setInputs({...inputs, [`${prefix}BankAccount`]: parseInt(e.target.value) || 0}),
                    className: `w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-${bgColor}-500`
                })
            ])
        ])
    ]);
}

// Partner Savings Section wrapper
function PartnerSavingsSection({ inputs, setInputs, language, workingCurrency, t }) {
    const createElement = React.createElement;
    
    return createElement('div', { key: 'partner-savings-section' }, [
        createElement('h3', { 
            key: 'partner-savings-title',
            className: "text-xl font-semibold text-gray-700 mb-6 flex items-center" 
        }, [
            createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '👫'),
            t.partnerBreakdown
        ]),
        createElement('div', { 
            key: 'partner-savings-grid',
            className: "grid grid-cols-1 lg:grid-cols-2 gap-8" 
        }, [
            // Partner 1 Savings
            createElement(PartnerSavingsInput, {
                key: 'partner1',
                partnerId: 1,
                inputs,
                setInputs,
                language,
                workingCurrency,
                t
            }),
            
            // Partner 2 Savings
            createElement(PartnerSavingsInput, {
                key: 'partner2',
                partnerId: 2,
                inputs,
                setInputs,
                language,
                workingCurrency,
                t
            })
        ])
    ]);
}

// Export to window
window.PartnerSavingsSection = PartnerSavingsSection;
window.PartnerSavingsInput = PartnerSavingsInput;

console.log('✅ Partner savings module loaded');