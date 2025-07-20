// WizardStepSavings.js - Step 3: Current Savings
// Collects existing pension, training fund, and personal investments

const WizardStepSavings = ({ inputs, setInputs, language = 'en', workingCurrency = 'ILS' }) => {
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
            pensionSavings: 'חיסכון פנסיוני קיים',
            currentPension: `פנסיה צוברת נוכחית (${currencySymbol})`,
            pensionInfo: 'סכום שצברת עד כה בקרן הפנסיה שלך',
            trainingFund: 'קרן השתלמות',
            currentTrainingFund: `קרן השתלמות נוכחית (${currencySymbol})`,
            trainingFundInfo: 'סכום שצברת בקרן השתלמות (ניתן למשיכה אחרי 6 שנים)',
            personalInvestments: 'השקעות אישיות',
            portfolioValue: `תיק השקעות אישי (${currencySymbol})`,
            realEstateValue: `נכסי נדל"ן (${currencySymbol})`,
            cryptoValue: `קריפטו ומטבעות דיגיטליים (${currencySymbol})`,
            savingsAccount: `חשבון חיסכון/פקדונות (${currencySymbol})`,
            partnerSavings: 'חיסכונות בני הזוג',
            partner1Savings: 'חיסכונות בן/בת זוג 1',
            partner2Savings: 'חיסכונות בן/בת זוג 2',
            totalSavings: 'סך החיסכון הנוכחי',
            savingsBreakdown: 'פירוט החיסכונות',
            optional: 'אופציונלי'
        },
        en: {
            pensionSavings: 'Current Pension Savings',
            currentPension: `Current Pension Fund (${currencySymbol})`,
            pensionInfo: 'Amount you have accumulated in your pension fund so far',
            trainingFund: 'Training Fund',
            currentTrainingFund: `Current Training Fund (${currencySymbol})`,
            trainingFundInfo: 'Amount accumulated in training fund (withdrawable after 6 years)',
            personalInvestments: 'Personal Investments',
            portfolioValue: `Personal Investment Portfolio (${currencySymbol})`,
            realEstateValue: `Real Estate Assets (${currencySymbol})`,
            cryptoValue: `Crypto & Digital Assets (${currencySymbol})`,
            savingsAccount: `Savings Account/Deposits (${currencySymbol})`,
            partnerSavings: 'Partner Savings',
            partner1Savings: 'Partner 1 Savings',
            partner2Savings: 'Partner 2 Savings',
            totalSavings: 'Total Current Savings',
            savingsBreakdown: 'Savings Breakdown',
            optional: 'Optional'
        }
    };

    const t = content[language];

    // Calculate total savings with detailed partner breakdown
    const calculateTotalSavings = () => {
        // Individual savings
        const pension = inputs.currentSavings || 0;
        const trainingFund = inputs.currentTrainingFundSavings || 0;
        const portfolio = inputs.personalPortfolioValue || 0;
        const realEstate = inputs.realEstateValue || 0;
        const crypto = inputs.cryptoValue || 0;
        const savings = inputs.savingsAccountValue || 0;
        
        // Partner 1 savings breakdown
        const partner1Pension = inputs.partner1CurrentPension || 0;
        const partner1TrainingFund = inputs.partner1CurrentTrainingFund || 0;
        const partner1Portfolio = inputs.partner1PersonalPortfolio || 0;
        const partner1RealEstate = inputs.partner1RealEstate || 0;
        const partner1Crypto = inputs.partner1Crypto || 0;
        
        // Partner 2 savings breakdown
        const partner2Pension = inputs.partner2CurrentPension || 0;
        const partner2TrainingFund = inputs.partner2CurrentTrainingFund || 0;
        const partner2Portfolio = inputs.partner2PersonalPortfolio || 0;
        const partner2RealEstate = inputs.partner2RealEstate || 0;
        const partner2Crypto = inputs.partner2Crypto || 0;

        const individualTotal = pension + trainingFund + portfolio + realEstate + crypto + savings;
        const partner1Total = partner1Pension + partner1TrainingFund + partner1Portfolio + partner1RealEstate + partner1Crypto;
        const partner2Total = partner2Pension + partner2TrainingFund + partner2Portfolio + partner2RealEstate + partner2Crypto;

        return individualTotal + partner1Total + partner2Total;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat(language === 'he' ? 'he-IL' : 'en-US', {
            style: 'currency',
            currency: workingCurrency === 'ILS' ? 'ILS' : 'USD',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return React.createElement('div', { className: "space-y-8" }, [
        // Pension Savings Section
        React.createElement('div', { key: 'pension-section' }, [
            React.createElement('h3', { 
                key: 'pension-title',
                className: "text-xl font-semibold text-gray-700 mb-4 flex items-center" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '🏦'),
                t.pensionSavings
            ]),
            React.createElement('div', { 
                key: 'pension-input',
                className: "bg-blue-50 rounded-xl p-6 border border-blue-200" 
            }, [
                React.createElement('label', { 
                    key: 'pension-label',
                    className: "block text-lg font-medium text-gray-700 mb-2" 
                }, t.currentPension),
                React.createElement('input', {
                    key: 'pension-input-field',
                    type: 'number',
                    value: inputs.currentSavings || 0,
                    onChange: (e) => setInputs({...inputs, currentSavings: parseInt(e.target.value) || 0}),
                    className: "w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                }),
                React.createElement('p', { 
                    key: 'pension-help',
                    className: "mt-2 text-sm text-blue-600" 
                }, t.pensionInfo)
            ])
        ]),

        // Training Fund Section
        React.createElement('div', { key: 'training-fund-section' }, [
            React.createElement('h3', { 
                key: 'training-fund-title',
                className: "text-xl font-semibold text-gray-700 mb-4 flex items-center" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '🎓'),
                t.trainingFund
            ]),
            React.createElement('div', { 
                key: 'training-fund-input',
                className: "bg-green-50 rounded-xl p-6 border border-green-200" 
            }, [
                React.createElement('label', { 
                    key: 'training-fund-label',
                    className: "block text-lg font-medium text-gray-700 mb-2" 
                }, t.currentTrainingFund),
                React.createElement('input', {
                    key: 'training-fund-input-field',
                    type: 'number',
                    value: inputs.currentTrainingFundSavings || 0,
                    onChange: (e) => setInputs({...inputs, currentTrainingFundSavings: parseInt(e.target.value) || 0}),
                    className: "w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                }),
                React.createElement('p', { 
                    key: 'training-fund-help',
                    className: "mt-2 text-sm text-green-600" 
                }, t.trainingFundInfo)
            ])
        ]),

        // Personal Investments Section
        React.createElement('div', { key: 'personal-investments-section' }, [
            React.createElement('h3', { 
                key: 'personal-investments-title',
                className: "text-xl font-semibold text-gray-700 mb-4 flex items-center" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '📈'),
                t.personalInvestments,
                React.createElement('span', { key: 'optional', className: "ml-2 text-sm text-gray-500 font-normal" }, `(${t.optional})`)
            ]),
            React.createElement('div', { 
                key: 'personal-investments-grid',
                className: "grid grid-cols-1 md:grid-cols-2 gap-6" 
            }, [
                React.createElement('div', { key: 'portfolio-value' }, [
                    React.createElement('label', { 
                        key: 'portfolio-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.portfolioValue),
                    React.createElement('input', {
                        key: 'portfolio-input',
                        type: 'number',
                        value: inputs.personalPortfolioValue || 0,
                        onChange: (e) => setInputs({...inputs, personalPortfolioValue: parseInt(e.target.value) || 0}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    })
                ]),
                React.createElement('div', { key: 'real-estate-value' }, [
                    React.createElement('label', { 
                        key: 'real-estate-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.realEstateValue),
                    React.createElement('input', {
                        key: 'real-estate-input',
                        type: 'number',
                        value: inputs.realEstateValue || 0,
                        onChange: (e) => setInputs({...inputs, realEstateValue: parseInt(e.target.value) || 0}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    })
                ]),
                React.createElement('div', { key: 'crypto-value' }, [
                    React.createElement('label', { 
                        key: 'crypto-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.cryptoValue),
                    React.createElement('input', {
                        key: 'crypto-input',
                        type: 'number',
                        value: inputs.cryptoValue || 0,
                        onChange: (e) => setInputs({...inputs, cryptoValue: parseInt(e.target.value) || 0}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    })
                ]),
                React.createElement('div', { key: 'savings-account-value' }, [
                    React.createElement('label', { 
                        key: 'savings-account-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.savingsAccount),
                    React.createElement('input', {
                        key: 'savings-account-input',
                        type: 'number',
                        value: inputs.savingsAccountValue || 0,
                        onChange: (e) => setInputs({...inputs, savingsAccountValue: parseInt(e.target.value) || 0}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    })
                ])
            ])
        ]),

        // Partner Savings (if couple) - Detailed Breakdown
        inputs.planningType === 'couple' && React.createElement('div', { key: 'partner-savings-section' }, [
            React.createElement('h3', { 
                key: 'partner-savings-title',
                className: "text-xl font-semibold text-gray-700 mb-4 flex items-center" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '👫'),
                t.partnerSavings
            ]),
            React.createElement('div', { 
                key: 'partner-savings-grid',
                className: "grid grid-cols-1 lg:grid-cols-2 gap-8" 
            }, [
                // Partner 1 Detailed Savings
                React.createElement('div', { 
                    key: 'partner1-detailed-savings',
                    className: "bg-pink-50 rounded-xl p-6 border border-pink-200" 
                }, [
                    React.createElement('h4', { 
                        key: 'partner1-title',
                        className: "text-lg font-semibold text-pink-700 mb-4" 
                    }, inputs.partner1Name || t.partner1Savings),
                    
                    // Partner 1 Pension
                    React.createElement('div', { key: 'partner1-pension', className: "mb-4" }, [
                        React.createElement('label', { 
                            key: 'partner1-pension-label',
                            className: "block text-sm font-medium text-gray-700 mb-1" 
                        }, `🏦 ${t.currentPension}`),
                        React.createElement('input', {
                            key: 'partner1-pension-input',
                            type: 'number',
                            value: inputs.partner1CurrentPension || 0,
                            onChange: (e) => setInputs({...inputs, partner1CurrentPension: parseInt(e.target.value) || 0}),
                            className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                        })
                    ]),
                    
                    // Partner 1 Training Fund
                    React.createElement('div', { key: 'partner1-training', className: "mb-4" }, [
                        React.createElement('label', { 
                            key: 'partner1-training-label',
                            className: "block text-sm font-medium text-gray-700 mb-1" 
                        }, `🎓 ${t.currentTrainingFund}`),
                        React.createElement('input', {
                            key: 'partner1-training-input',
                            type: 'number',
                            value: inputs.partner1CurrentTrainingFund || 0,
                            onChange: (e) => setInputs({...inputs, partner1CurrentTrainingFund: parseInt(e.target.value) || 0}),
                            className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                        })
                    ]),
                    
                    // Partner 1 Investments
                    React.createElement('div', { key: 'partner1-investments', className: "space-y-3" }, [
                        React.createElement('div', { key: 'partner1-portfolio' }, [
                            React.createElement('label', { 
                                key: 'partner1-portfolio-label',
                                className: "block text-xs font-medium text-gray-600 mb-1" 
                            }, `📈 ${t.portfolioValue}`),
                            React.createElement('input', {
                                key: 'partner1-portfolio-input',
                                type: 'number',
                                value: inputs.partner1PersonalPortfolio || 0,
                                onChange: (e) => setInputs({...inputs, partner1PersonalPortfolio: parseInt(e.target.value) || 0}),
                                className: "w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-pink-500"
                            })
                        ]),
                        React.createElement('div', { key: 'partner1-realestate' }, [
                            React.createElement('label', { 
                                key: 'partner1-realestate-label',
                                className: "block text-xs font-medium text-gray-600 mb-1" 
                            }, `🏠 ${t.realEstateValue}`),
                            React.createElement('input', {
                                key: 'partner1-realestate-input',
                                type: 'number',
                                value: inputs.partner1RealEstate || 0,
                                onChange: (e) => setInputs({...inputs, partner1RealEstate: parseInt(e.target.value) || 0}),
                                className: "w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-pink-500"
                            })
                        ]),
                        React.createElement('div', { key: 'partner1-crypto' }, [
                            React.createElement('label', { 
                                key: 'partner1-crypto-label',
                                className: "block text-xs font-medium text-gray-600 mb-1" 
                            }, `₿ ${t.cryptoValue}`),
                            React.createElement('input', {
                                key: 'partner1-crypto-input',
                                type: 'number',
                                value: inputs.partner1Crypto || 0,
                                onChange: (e) => setInputs({...inputs, partner1Crypto: parseInt(e.target.value) || 0}),
                                className: "w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-pink-500"
                            })
                        ])
                    ])
                ]),
                
                // Partner 2 Detailed Savings
                React.createElement('div', { 
                    key: 'partner2-detailed-savings',
                    className: "bg-purple-50 rounded-xl p-6 border border-purple-200" 
                }, [
                    React.createElement('h4', { 
                        key: 'partner2-title',
                        className: "text-lg font-semibold text-purple-700 mb-4" 
                    }, inputs.partner2Name || t.partner2Savings),
                    
                    // Partner 2 Pension
                    React.createElement('div', { key: 'partner2-pension', className: "mb-4" }, [
                        React.createElement('label', { 
                            key: 'partner2-pension-label',
                            className: "block text-sm font-medium text-gray-700 mb-1" 
                        }, `🏦 ${t.currentPension}`),
                        React.createElement('input', {
                            key: 'partner2-pension-input',
                            type: 'number',
                            value: inputs.partner2CurrentPension || 0,
                            onChange: (e) => setInputs({...inputs, partner2CurrentPension: parseInt(e.target.value) || 0}),
                            className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        })
                    ]),
                    
                    // Partner 2 Training Fund
                    React.createElement('div', { key: 'partner2-training', className: "mb-4" }, [
                        React.createElement('label', { 
                            key: 'partner2-training-label',
                            className: "block text-sm font-medium text-gray-700 mb-1" 
                        }, `🎓 ${t.currentTrainingFund}`),
                        React.createElement('input', {
                            key: 'partner2-training-input',
                            type: 'number',
                            value: inputs.partner2CurrentTrainingFund || 0,
                            onChange: (e) => setInputs({...inputs, partner2CurrentTrainingFund: parseInt(e.target.value) || 0}),
                            className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        })
                    ]),
                    
                    // Partner 2 Investments
                    React.createElement('div', { key: 'partner2-investments', className: "space-y-3" }, [
                        React.createElement('div', { key: 'partner2-portfolio' }, [
                            React.createElement('label', { 
                                key: 'partner2-portfolio-label',
                                className: "block text-xs font-medium text-gray-600 mb-1" 
                            }, `📈 ${t.portfolioValue}`),
                            React.createElement('input', {
                                key: 'partner2-portfolio-input',
                                type: 'number',
                                value: inputs.partner2PersonalPortfolio || 0,
                                onChange: (e) => setInputs({...inputs, partner2PersonalPortfolio: parseInt(e.target.value) || 0}),
                                className: "w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
                            })
                        ]),
                        React.createElement('div', { key: 'partner2-realestate' }, [
                            React.createElement('label', { 
                                key: 'partner2-realestate-label',
                                className: "block text-xs font-medium text-gray-600 mb-1" 
                            }, `🏠 ${t.realEstateValue}`),
                            React.createElement('input', {
                                key: 'partner2-realestate-input',
                                type: 'number',
                                value: inputs.partner2RealEstate || 0,
                                onChange: (e) => setInputs({...inputs, partner2RealEstate: parseInt(e.target.value) || 0}),
                                className: "w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
                            })
                        ]),
                        React.createElement('div', { key: 'partner2-crypto' }, [
                            React.createElement('label', { 
                                key: 'partner2-crypto-label',
                                className: "block text-xs font-medium text-gray-600 mb-1" 
                            }, `₿ ${t.cryptoValue}`),
                            React.createElement('input', {
                                key: 'partner2-crypto-input',
                                type: 'number',
                                value: inputs.partner2Crypto || 0,
                                onChange: (e) => setInputs({...inputs, partner2Crypto: parseInt(e.target.value) || 0}),
                                className: "w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
                            })
                        ])
                    ])
                ])
            ])
        ]),

        // Total Savings Summary
        React.createElement('div', { 
            key: 'savings-summary',
            className: "bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200" 
        }, [
            React.createElement('h3', { 
                key: 'total-title',
                className: "text-xl font-semibold text-blue-700 mb-4 flex items-center" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '💎'),
                t.totalSavings
            ]),
            React.createElement('div', { 
                key: 'total-amount',
                className: "text-3xl font-bold text-blue-800 mb-2" 
            }, formatCurrency(calculateTotalSavings())),
            React.createElement('p', { 
                key: 'total-help',
                className: "text-sm text-blue-600" 
            }, t.savingsBreakdown)
        ])
    ]);
};

// Export to window for global access
window.WizardStepSavings = WizardStepSavings;
console.log('✅ WizardStepSavings component loaded successfully');