// WizardStepSavings.js - Step 3: Savings & Investments
// Detailed per-partner breakdown of current savings and investments

const WizardStepSavings = ({ inputs, setInputs, language = 'en', workingCurrency = 'ILS' }) => {
    // Component uses React.createElement for rendering  
    const createElement = React.createElement;
    
    // Multi-language content
    const content = {
        he: {
            title: 'חיסכונות והשקעות',
            subtitle: 'פירוט החיסכונות וההשקעות הנוכחים לכל בן זוג',
            currentSavings: 'חיסכונות נוכחים',
            pensionSavings: 'חיסכון פנסיוני',
            trainingFund: 'קרן השתלמות',
            personalPortfolio: 'תיק השקעות אישי',
            realEstate: 'נדל״ן',
            cryptocurrency: 'מטבעות דיגיטליים',
            totalSavings: 'סך החיסכונות',
            investmentCategories: 'קטגוריות השקעה',
            partnerBreakdown: 'פירוט בני הזוג',
            partner1Savings: 'חיסכונות בן/בת זוג 1',
            partner2Savings: 'חיסכונות בן/בת זוג 2',
            currentValue: 'ערך נוכחי',
            monthlyContribution: 'הפקדה חודשית'
        },
        en: {
            title: 'Savings & Investments',
            subtitle: 'Detailed breakdown of current savings and investments for each partner',
            currentSavings: 'Current Savings',
            pensionSavings: 'Pension Savings',
            trainingFund: 'Training Fund',
            personalPortfolio: 'Personal Portfolio',
            realEstate: 'Real Estate',
            cryptocurrency: 'Cryptocurrency',
            totalSavings: 'Total Savings',
            investmentCategories: 'Investment Categories',
            partnerBreakdown: 'Partner Breakdown',
            partner1Savings: 'Partner 1 Savings',
            partner2Savings: 'Partner 2 Savings',
            currentValue: 'Current Value',
            monthlyContribution: 'Monthly Contribution'
        }
    };

    const t = content[language];

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

    // Calculate total savings with error handling
    const calculateTotalSavings = () => {
        try {
            const currentSavings = inputs.currentSavings || 0;
            const currentTrainingFund = inputs.currentTrainingFund || 0;
            const currentPersonalPortfolio = inputs.currentPersonalPortfolio || 0;
            const currentRealEstate = inputs.currentRealEstate || 0;
            const currentCrypto = inputs.currentCrypto || 0;
            const currentSavingsAccount = inputs.currentSavingsAccount || 0;
            
            // Partner savings if couple
            const partner1Pension = inputs.partner1CurrentPension || 0;
            const partner1TrainingFund = inputs.partner1CurrentTrainingFund || 0;
            const partner1Portfolio = inputs.partner1PersonalPortfolio || 0;
            const partner1RealEstate = inputs.partner1RealEstate || 0;
            const partner1Crypto = inputs.partner1Crypto || 0;
            const partner2Pension = inputs.partner2CurrentPension || 0;
            const partner2TrainingFund = inputs.partner2CurrentTrainingFund || 0;
            const partner2Portfolio = inputs.partner2PersonalPortfolio || 0;
            const partner2RealEstate = inputs.partner2RealEstate || 0;
            const partner2Crypto = inputs.partner2Crypto || 0;
            
            const total = currentSavings + currentTrainingFund + currentPersonalPortfolio + 
                         currentRealEstate + currentCrypto + currentSavingsAccount +
                         partner1Pension + partner1TrainingFund + partner1Portfolio + partner1RealEstate + partner1Crypto +
                         partner2Pension + partner2TrainingFund + partner2Portfolio + partner2RealEstate + partner2Crypto;
            
            // Validate result
            if (isNaN(total) || !isFinite(total)) {
                console.warn('Invalid total savings calculation, returning 0');
                return 0;
            }
            
            return total;
        } catch (error) {
            console.error('Error calculating total savings:', error);
            return 0;
        }
    };

    const formatCurrency = (amount) => {
        return `${currencySymbol}${Math.round(amount || 0).toLocaleString()}`;
    };

    // Using React.createElement pattern for component rendering
    return createElement('div', { className: "space-y-8" }, [
        // Main Savings Section (if single planning)
        (!inputs.planningType || inputs.planningType === 'single') && createElement('div', { key: 'main-savings-section' }, [
            createElement('h3', { 
                key: 'main-savings-title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center" 
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '💰'),
                t.currentSavings
            ]),
            createElement('div', { 
                key: 'savings-grid',
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
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
                
                // Personal Portfolio
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
                        className: "w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    })
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
                createElement('div', { 
                    key: 'cryptocurrency',
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
                    }, language === 'he' ? 'חשבון חסכון' : 'Savings Account'),
                    createElement('input', {
                        key: 'savings-account-input',
                        type: 'number',
                        value: inputs.currentSavingsAccount || 0,
                        onChange: (e) => setInputs({...inputs, currentSavingsAccount: parseInt(e.target.value) || 0}),
                        className: "w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500"
                    })
                ])
            ])
        ]),

        // Partner Savings (if couple)
        inputs.planningType === 'couple' && createElement('div', { key: 'partner-savings-section' }, [
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
                createElement('div', { 
                    key: 'partner1-savings',
                    className: "bg-pink-50 rounded-xl p-6 border border-pink-200" 
                }, [
                    createElement('h4', { 
                        key: 'partner1-title',
                        className: "text-lg font-semibold text-pink-700 mb-4" 
                    }, inputs.partner1Name || t.partner1Savings),
                    createElement('div', { key: 'partner1-fields', className: "space-y-4" }, [
                        createElement('div', { key: 'p1-pension' }, [
                            createElement('label', { 
                                key: 'p1-pension-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.pensionSavings),
                            createElement('input', {
                                key: 'p1-pension-input',
                                type: 'number',
                                value: inputs.partner1CurrentPension || 0,
                                onChange: (e) => setInputs({...inputs, partner1CurrentPension: parseInt(e.target.value) || 0}),
                                className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500"
                            })
                        ]),
                        createElement('div', { key: 'p1-training' }, [
                            createElement('label', { 
                                key: 'p1-training-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.trainingFund),
                            createElement('input', {
                                key: 'p1-training-input',
                                type: 'number',
                                value: inputs.partner1CurrentTrainingFund || 0,
                                onChange: (e) => setInputs({...inputs, partner1CurrentTrainingFund: parseInt(e.target.value) || 0}),
                                className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500"
                            })
                        ]),
                        createElement('div', { key: 'p1-portfolio' }, [
                            createElement('label', { 
                                key: 'p1-portfolio-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.personalPortfolio),
                            createElement('input', {
                                key: 'p1-portfolio-input',
                                type: 'number',
                                value: inputs.partner1PersonalPortfolio || 0,
                                onChange: (e) => setInputs({...inputs, partner1PersonalPortfolio: parseInt(e.target.value) || 0}),
                                className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500"
                            })
                        ]),
                        createElement('div', { key: 'p1-real-estate' }, [
                            createElement('label', { 
                                key: 'p1-real-estate-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.realEstate),
                            createElement('input', {
                                key: 'p1-real-estate-input',
                                type: 'number',
                                value: inputs.partner1RealEstate || 0,
                                onChange: (e) => setInputs({...inputs, partner1RealEstate: parseInt(e.target.value) || 0}),
                                className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500"
                            })
                        ]),
                        createElement('div', { key: 'p1-crypto' }, [
                            createElement('label', { 
                                key: 'p1-crypto-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.cryptocurrency),
                            createElement('input', {
                                key: 'p1-crypto-input',
                                type: 'number',
                                value: inputs.partner1Crypto || 0,
                                onChange: (e) => setInputs({...inputs, partner1Crypto: parseInt(e.target.value) || 0}),
                                className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500"
                            })
                        ])
                    ])
                ]),
                
                // Partner 2 Savings
                createElement('div', { 
                    key: 'partner2-savings',
                    className: "bg-purple-50 rounded-xl p-6 border border-purple-200" 
                }, [
                    createElement('h4', { 
                        key: 'partner2-title',
                        className: "text-lg font-semibold text-purple-700 mb-4" 
                    }, inputs.partner2Name || t.partner2Savings),
                    createElement('div', { key: 'partner2-fields', className: "space-y-4" }, [
                        createElement('div', { key: 'p2-pension' }, [
                            createElement('label', { 
                                key: 'p2-pension-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.pensionSavings),
                            createElement('input', {
                                key: 'p2-pension-input',
                                type: 'number',
                                value: inputs.partner2CurrentPension || 0,
                                onChange: (e) => setInputs({...inputs, partner2CurrentPension: parseInt(e.target.value) || 0}),
                                className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                            })
                        ]),
                        createElement('div', { key: 'p2-training' }, [
                            createElement('label', { 
                                key: 'p2-training-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.trainingFund),
                            createElement('input', {
                                key: 'p2-training-input',
                                type: 'number',
                                value: inputs.partner2CurrentTrainingFund || 0,
                                onChange: (e) => setInputs({...inputs, partner2CurrentTrainingFund: parseInt(e.target.value) || 0}),
                                className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                            })
                        ]),
                        createElement('div', { key: 'p2-portfolio' }, [
                            createElement('label', { 
                                key: 'p2-portfolio-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.personalPortfolio),
                            createElement('input', {
                                key: 'p2-portfolio-input',
                                type: 'number',
                                value: inputs.partner2PersonalPortfolio || 0,
                                onChange: (e) => setInputs({...inputs, partner2PersonalPortfolio: parseInt(e.target.value) || 0}),
                                className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                            })
                        ]),
                        createElement('div', { key: 'p2-real-estate' }, [
                            createElement('label', { 
                                key: 'p2-real-estate-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.realEstate),
                            createElement('input', {
                                key: 'p2-real-estate-input',
                                type: 'number',
                                value: inputs.partner2RealEstate || 0,
                                onChange: (e) => setInputs({...inputs, partner2RealEstate: parseInt(e.target.value) || 0}),
                                className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                            })
                        ]),
                        createElement('div', { key: 'p2-crypto' }, [
                            createElement('label', { 
                                key: 'p2-crypto-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.cryptocurrency),
                            createElement('input', {
                                key: 'p2-crypto-input',
                                type: 'number',
                                value: inputs.partner2Crypto || 0,
                                onChange: (e) => setInputs({...inputs, partner2Crypto: parseInt(e.target.value) || 0}),
                                className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                            })
                        ])
                    ])
                ])
            ])
        ]),

        // Total Savings Summary
        createElement('div', { 
            key: 'total-summary',
            className: "bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200" 
        }, [
            createElement('h3', { 
                key: 'total-title',
                className: "text-xl font-semibold text-blue-700 mb-4 flex items-center" 
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '💎'),
                t.totalSavings
            ]),
            createElement('div', { 
                key: 'total-amount',
                className: "text-3xl font-bold text-blue-800" 
            }, formatCurrency(calculateTotalSavings()))
        ])
    ]);
};

// Export to window for global access
window.WizardStepSavings = WizardStepSavings;
console.log('✅ WizardStepSavings component loaded successfully');