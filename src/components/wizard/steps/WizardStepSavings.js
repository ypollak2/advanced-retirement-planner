// WizardStepSavings.js - Step 3: Savings & Investments
// Detailed per-partner breakdown of current savings and investments

const WizardStepSavings = ({ inputs, setInputs, language = 'en', workingCurrency = 'ILS' }) => {
    // Component uses React.createElement for rendering  
    const createElement = React.createElement;
    const { useState, useCallback, useEffect } = React;
    
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
            bankAccount: 'חשבון בנק',
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
            bankAccount: 'Bank Account',
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
            const currentCrypto = inputs.currentDigitalAssetFiatValue || inputs.currentCryptoFiatValue || inputs.currentCrypto || 0;
            const currentSavingsAccount = inputs.currentSavingsAccount || 0;
            const currentBankAccount = inputs.currentBankAccount || 0;
            
            // Partner savings if couple
            const partner1Pension = inputs.partner1CurrentPension || 0;
            const partner1TrainingFund = inputs.partner1CurrentTrainingFund || 0;
            const partner1Portfolio = inputs.partner1PersonalPortfolio || 0;
            const partner1RealEstate = inputs.partner1RealEstate || 0;
            const partner1Crypto = inputs.partner1DigitalAssetFiatValue || inputs.partner1CryptoFiatValue || inputs.partner1Crypto || 0;
            const partner2Pension = inputs.partner2CurrentPension || 0;
            const partner2TrainingFund = inputs.partner2CurrentTrainingFund || 0;
            const partner2Portfolio = inputs.partner2PersonalPortfolio || 0;
            const partner2RealEstate = inputs.partner2RealEstate || 0;
            const partner2Crypto = inputs.partner2DigitalAssetFiatValue || inputs.partner2CryptoFiatValue || inputs.partner2Crypto || 0;
            const partner1BankAccount = inputs.partner1BankAccount || 0;
            const partner2BankAccount = inputs.partner2BankAccount || 0;
            
            const total = currentSavings + currentTrainingFund + currentPersonalPortfolio + 
                         currentRealEstate + currentCrypto + currentSavingsAccount + currentBankAccount +
                         partner1Pension + partner1TrainingFund + partner1Portfolio + partner1RealEstate + partner1Crypto + partner1BankAccount +
                         partner2Pension + partner2TrainingFund + partner2Portfolio + partner2RealEstate + partner2Crypto + partner2BankAccount;
            
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

    // Enhanced tax validation function
    const validateTaxRate = (rate) => {
        const numRate = parseFloat(rate);
        if (isNaN(numRate)) return 25;
        if (numRate < 0) return 0;
        if (numRate > 50) return 50;
        return numRate;
    };

    // Enhanced currency conversion with real-time rates
    const convertCurrency = async (amount, fromCurrency = 'ILS', toCurrency = workingCurrency) => {
        if (fromCurrency === toCurrency || !amount) return amount;
        
        try {
            if (window.currencyAPI && window.currencyAPI.getRate) {
                const rate = await window.currencyAPI.getRate(fromCurrency, toCurrency);
                return amount * rate;
            } else if (window.getCurrencyRate) {
                const rate = await window.getCurrencyRate(fromCurrency, toCurrency);
                return amount * rate;
            }
        } catch (error) {
            console.warn('Currency conversion failed, using fallback:', error);
        }
        
        // Fallback rates (ILS to other currencies)
        const fallbackRates = {
            'USD': 0.27,   // 1 ILS = 0.27 USD  
            'EUR': 0.25,   // 1 ILS = 0.25 EUR
            'GBP': 0.22,   // 1 ILS = 0.22 GBP
            'BTC': 0.0000067, // 1 ILS = 0.0000067 BTC
            'ETH': 0.0001     // 1 ILS = 0.0001 ETH
        };
        
        if (fromCurrency === 'ILS') {
            const rate = fallbackRates[toCurrency] || 1;
            return amount * rate;
        } else if (toCurrency === 'ILS') {
            const rate = fallbackRates[fromCurrency] || 1;
            return amount / rate;
        }
        
        return amount; // No conversion possible
    };

    // State for tracking conversion loading
    const [conversionStates, setConversionStates] = useState({});
    
    // Effect to update conversions when currency or values change
    useEffect(() => {
        const updateConversions = async () => {
            if (workingCurrency === 'ILS') return;
            
            // Update main portfolio conversion
            if (inputs.currentPersonalPortfolio > 0) {
                calculateAndFormatNetValue(inputs.currentPersonalPortfolio, inputs.portfolioTaxRate, null);
            }
            
            // Update partner conversions if couple mode
            if (inputs.planningType === 'couple') {
                if (inputs.partner1PersonalPortfolio > 0) {
                    calculateAndFormatNetValue(inputs.partner1PersonalPortfolio, inputs.partner1PortfolioTaxRate, 'partner1');
                }
                if (inputs.partner2PersonalPortfolio > 0) {
                    calculateAndFormatNetValue(inputs.partner2PersonalPortfolio, inputs.partner2PortfolioTaxRate, 'partner2');
                }
            }
        };
        
        updateConversions();
    }, [workingCurrency, inputs.currentPersonalPortfolio, inputs.portfolioTaxRate, 
        inputs.partner1PersonalPortfolio, inputs.partner1PortfolioTaxRate,
        inputs.partner2PersonalPortfolio, inputs.partner2PortfolioTaxRate,
        inputs.planningType]);
    
    const formatCurrency = (amount, currency = workingCurrency) => {
        const roundedAmount = Math.round(amount || 0);
        const symbol = getCurrencySymbol(currency);
        
        // Format with locale-aware number formatting
        const formatted = new Intl.NumberFormat(language === 'he' ? 'he-IL' : 'en-US').format(roundedAmount);
        return `${symbol}${formatted}`;
    };
    
    // Enhanced real-time net value calculation with currency conversion
    // Main portfolio: currentPersonalPortfolio * (1 - (inputs.portfolioTaxRate || 0.25))
    // Partner portfolios: partnerPersonalPortfolio * (1 - (inputs.partnerPortfolioTaxRate || 0.25))
    const calculateAndFormatNetValue = useCallback(async (portfolioValue, taxRate, partnerId = null) => {
        if (!portfolioValue || portfolioValue <= 0) return formatCurrency(0);
        
        // Tax rate is stored as percentage (50 for 50%), convert to decimal
        const netValueILS = portfolioValue * (1 - (taxRate || 25) / 100);
        
        if (workingCurrency === 'ILS') {
            return formatCurrency(netValueILS, 'ILS');
        }
        
        const stateKey = partnerId ? `${partnerId}_portfolio` : 'main_portfolio';
        
        // Set loading state
        setConversionStates(prev => ({ ...prev, [stateKey]: { loading: true, value: null } }));
        
        try {
            const convertedValue = await convertCurrency(netValueILS, 'ILS', workingCurrency);
            const formattedValue = formatCurrency(convertedValue, workingCurrency);
            
            // Update state with converted value and the net value for comparison
            setConversionStates(prev => ({ 
                ...prev, 
                [stateKey]: { loading: false, value: formattedValue, error: null, netValue: netValueILS } 
            }));
            
            return formattedValue;
        } catch (error) {
            console.warn('Currency conversion failed:', error);
            const fallbackValue = formatCurrency(netValueILS, 'ILS');
            
            // Update state with error and the net value for comparison
            setConversionStates(prev => ({ 
                ...prev, 
                [stateKey]: { loading: false, value: fallbackValue, error: true, netValue: netValueILS } 
            }));
            
            return fallbackValue;
        }
    }, [workingCurrency, language]);

    // Helper function to render net value with loading states
    const renderNetValue = (portfolioValue, taxRate, partnerId = null, displayText = null) => {
        const stateKey = partnerId ? `${partnerId}_portfolio` : 'main_portfolio';
        const conversionState = conversionStates[stateKey];
        
        if (!portfolioValue || portfolioValue <= 0) {
            return formatCurrency(0);
        }
        
        // Check if we have a cached value AND if it's still valid (tax rate hasn't changed)
        // We need to recalculate if the tax rate has changed
        const currentNetValue = portfolioValue * (1 - (taxRate || 25) / 100);
        const needsRecalculation = conversionState && conversionState.netValue !== currentNetValue;
        
        // If we have a cached converted value and tax rate hasn't changed, use it
        if (conversionState && !conversionState.loading && conversionState.value && !needsRecalculation) {
            const display = displayText ? `${displayText}: ${conversionState.value}` : conversionState.value;
            return conversionState.error ? 
                createElement('span', { className: 'flex items-center' }, [
                    createElement('span', { key: 'value' }, display),
                    createElement('span', { key: 'warning', className: 'ml-1 text-orange-500 text-xs' }, '⚠️')
                ]) : display;
        }
        
        // If loading, show loading state
        if (conversionState && conversionState.loading) {
            const loadingText = language === 'he' ? 'מחשב...' : 'Converting...';
            return createElement('span', { className: 'flex items-center text-gray-500' }, [
                createElement('span', { key: 'spinner', className: 'animate-spin mr-1' }, '🔄'),
                createElement('span', { key: 'text' }, displayText ? `${displayText}: ${loadingText}` : loadingText)
            ]);
        }
        
        // Tax rate is stored as percentage (50 for 50%), convert to decimal
        const netValue = portfolioValue * (1 - (taxRate || 25) / 100);
        const formatted = formatCurrency(netValue, workingCurrency);
        
        // Trigger async conversion for next render
        calculateAndFormatNetValue(portfolioValue, taxRate, partnerId);
        
        return displayText ? `${displayText}: ${formatted}` : formatted;
    };

    // Add custom styles for animations
    React.useEffect(() => {
        const styleId = 'wizardStepSavings-animations';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-in-out;
                }
                .animate-pulse-gentle {
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.8; }
                }
                /* Custom slider styles */
                .slider-thumb-purple::-webkit-slider-thumb {
                    appearance: none;
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #8b5cf6;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(139, 92, 246, 0.3);
                }
                .slider-thumb-purple::-moz-range-thumb {
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #8b5cf6;
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 2px 4px rgba(139, 92, 246, 0.3);
                }
            `;
            document.head.appendChild(style);
        }
    }, []);
    
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
                        className: "w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 mb-4"
                    }),
                    // Portfolio tax rate input with smooth animation
                    inputs.currentPersonalPortfolio > 0 && createElement('div', { 
                        key: 'tax-rate-section',
                        className: 'animate-fadeIn transition-all duration-300 ease-in-out mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200'
                    }, [
                        createElement('label', { 
                            key: 'tax-rate-label',
                            className: "block text-sm font-medium text-purple-600 mb-2" 
                        }, language === 'he' ? 'מס רווחי הון (%)' : 'Capital Gains Tax (%)'),
                        // Tax input with both number input and slider
                        createElement('div', { key: 'tax-input-container', className: 'space-y-3' }, [
                            // Number input with percentage symbol
                            createElement('div', { key: 'number-input-container', className: 'relative' }, [
                            createElement('input', {
                                key: 'tax-rate-input',
                                type: 'number',
                                min: '0',
                                max: '50',
                                step: '0.1',
                                placeholder: '25',
                                value: inputs.portfolioTaxRate || 25,
                                onChange: (e) => {
                                    const validatedRate = validateTaxRate(e.target.value);
                                    setInputs({...inputs, portfolioTaxRate: validatedRate});
                                },
                                onBlur: (e) => {
                                    // Ensure value is within bounds on blur
                                    const validatedRate = validateTaxRate(e.target.value);
                                    e.target.value = validatedRate;
                                    setInputs({...inputs, portfolioTaxRate: validatedRate});
                                },
                                className: `w-full p-2 text-base border rounded focus:ring-2 focus:ring-purple-500 ${
                                    inputs.portfolioTaxRate > 50 || inputs.portfolioTaxRate < 0 ? 
                                    'border-red-300 bg-red-50' : 'border-gray-300'
                                }`
                            }),
                                createElement('span', {
                                    key: 'percentage-symbol',
                                    className: 'absolute right-3 top-2 text-gray-500 pointer-events-none'
                                }, '%')
                            ]),
                            // Range slider for easier adjustment
                            createElement('div', { key: 'slider-container', className: 'px-1' }, [
                                createElement('input', {
                                    key: 'tax-rate-slider',
                                    type: 'range',
                                    min: '0',
                                    max: '50',
                                    step: '1',
                                    value: inputs.portfolioTaxRate || 25,
                                    onChange: (e) => {
                                        const validatedRate = validateTaxRate(e.target.value);
                                        setInputs({...inputs, portfolioTaxRate: validatedRate});
                                    },
                                    className: 'w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer slider-thumb-purple'
                                }),
                                // Slider labels
                                createElement('div', { key: 'slider-labels', className: 'flex justify-between text-xs text-purple-600 mt-1' }, [
                                    createElement('span', { key: 'min-label' }, '0%'),
                                    createElement('span', { key: 'mid-label' }, '25%'),
                                    createElement('span', { key: 'max-label' }, '50%')
                                ])
                            ])
                        ])
                        // Validation feedback
                        (inputs.portfolioTaxRate > 0.5 || inputs.portfolioTaxRate < 0) && 
                        createElement('div', {
                            key: 'tax-validation-error',
                            className: 'text-xs text-red-600 mt-1 flex items-center'
                        }, [
                            createElement('span', { key: 'error-icon', className: 'mr-1' }, '⚠️'),
                            createElement('span', { key: 'error-text' }, 
                                language === 'he' ? 'שיעור המס חייב להיות בין 0% ל-50%' :
                                'Tax rate must be between 0% and 50%'
                            )
                        ]),
                        // Help text
                        createElement('div', {
                            key: 'tax-help',
                            className: "text-xs text-purple-500 mt-1"
                        }, language === 'he' ? 
                            'מס רווחי הון בישראל: 25% (אזרחים), 30% (תושבי חוץ)' :
                            'Israel: 25% (residents), 30% (non-residents)')
                    ]),
                    // Net Value After Tax
                    // Formula: currentPersonalPortfolio * (1 - (inputs.portfolioTaxRate || 0.25))
                    inputs.currentPersonalPortfolio > 0 && createElement('div', { 
                        key: 'net-value-section',
                        className: 'animate-fadeIn transition-all duration-300 ease-in-out mt-4 p-4 bg-gradient-to-r from-purple-100 to-purple-50 rounded-lg border-2 border-purple-300 shadow-sm'
                    }, [
                        createElement('label', { 
                            key: 'net-value-label',
                            className: "block text-sm font-medium text-purple-600 mb-2" 
                        }, [
                            createElement('span', { key: 'label-text' }, language === 'he' ? 'שווי נטו לאחר מס' : 'Net Value After Tax'),
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
                            }, renderNetValue(inputs.currentPersonalPortfolio, inputs.portfolioTaxRate, null)),
                            workingCurrency !== 'ILS' && createElement('div', {
                                key: 'conversion-badge',
                                className: 'bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs font-medium'
                            }, `${workingCurrency}`)
                        ])),
                        // Enhanced currency conversion indicator with icon
                        workingCurrency !== 'ILS' && createElement('div', {
                            key: 'currency-conversion-note',
                            className: 'flex items-center text-xs text-purple-500 mt-2 p-2 bg-purple-100 rounded border-l-4 border-purple-400'
                        }, [
                            createElement('span', { key: 'exchange-icon', className: 'mr-1' }, '🔄'),
                            createElement('span', { key: 'conversion-text' }, language === 'he' ? 
                                `המרה מ-ILS ל-${workingCurrency} בשער שוטף` :
                                `Converted from ILS to ${workingCurrency} at live rate`
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
                
                // Enhanced Cryptocurrency with Digital Asset Token Selection (crypto assets, not auth tokens)
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
                    }, language === 'he' ? 'חשבון חסכון' : 'Savings Account'),
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
                    }, inputs.userName || t.partner1Savings),
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
                                className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 mb-2"
                            }),
                            // Partner 1 Portfolio tax rate input with enhanced styling
                            inputs.partner1PersonalPortfolio > 0 && createElement('div', { 
                                key: 'p1-tax-rate-section',
                                className: 'animate-fadeIn transition-all duration-300 ease-in-out mt-2 p-3 bg-pink-50 rounded border border-pink-200'
                            }, [
                                createElement('label', { 
                                    key: 'p1-tax-rate-label',
                                    className: "block text-xs font-medium text-pink-600 mb-1" 
                                }, language === 'he' ? 'מס רווחי הון (%)' : 'Capital Gains Tax (%)'),
                                createElement('div', { key: 'p1-tax-input-container', className: 'relative' }, [
                                    createElement('input', {
                                        key: 'p1-tax-rate-input',
                                        id: 'p1-tax-rate-input',
                                        type: 'number',
                                        min: '0',
                                        max: '50',
                                        step: '0.1',
                                        placeholder: '25',
                                        value: (inputs.partner1PortfolioTaxRate * 100) || 25,
                                        onChange: (e) => {
                                            const validatedRate = validateTaxRate(e.target.value);
                                            setInputs({...inputs, partner1PortfolioTaxRate: validatedRate / 100});
                                        },
                                        onBlur: (e) => {
                                            const validatedRate = validateTaxRate(e.target.value);
                                            e.target.value = validatedRate;
                                            setInputs({...inputs, partner1PortfolioTaxRate: validatedRate / 100});
                                        },
                                        className: `w-full p-1 text-sm border rounded focus:ring-2 focus:ring-pink-500 ${
                                            inputs.partner1PortfolioTaxRate > 0.5 || inputs.partner1PortfolioTaxRate < 0 ? 
                                            'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`
                                    }),
                                    createElement('span', {
                                        key: 'p1-percentage-symbol',
                                        className: 'absolute right-2 top-1 text-xs text-gray-500 pointer-events-none'
                                    }, '%')
                                ]),
                                // Validation feedback for Partner 1
                                (inputs.partner1PortfolioTaxRate > 0.5 || inputs.partner1PortfolioTaxRate < 0) && 
                                createElement('div', {
                                    key: 'p1-tax-validation-error',
                                    className: 'text-xs text-red-600 mt-1'
                                }, language === 'he' ? '⚠️ שיעור המס חייב להיות בין 0% ל-50%' : '⚠️ Tax rate must be between 0% and 50%'),
                                // Help text for Partner 1
                                createElement('div', {
                                    key: 'p1-tax-help',
                                    className: "text-xs text-pink-500 mt-1"
                                }, language === 'he' ? 
                                    'ישראל: 25% (תושבים), 30% (תושבי חוץ)' :
                                    'Israel: 25% (residents), 30% (non-residents)')
                            ]),
                            // Partner 1 Net value after tax with enhanced styling
                            // Calculation: partner1PersonalPortfolio * (1 - (inputs.partner1PortfolioTaxRate || 0.25))
                            inputs.partner1PersonalPortfolio > 0 && createElement('div', { 
                                key: 'p1-net-value-section',
                                className: 'animate-fadeIn transition-all duration-300 ease-in-out mt-2 p-2 bg-gradient-to-r from-pink-100 to-pink-50 rounded border border-pink-300'
                            }, [
                                createElement('div', { 
                                    key: 'p1-net-value-amount',
                                    className: "flex items-center justify-between text-sm font-bold text-pink-700" 
                                }, [
                                    createElement('span', { key: 'p1-net-text' }, 
                                        // Using formatCurrency with tax calculation: formatCurrency(partner1PersonalPortfolio * (1 - (inputs.partner1PortfolioTaxRate)))
                                        renderNetValue(inputs.partner1PersonalPortfolio, inputs.partner1PortfolioTaxRate, 'partner1', language === 'he' ? 'נטו:' : 'Net:')
                                    ),
                                    createElement('span', { key: 'p1-money-icon' }, '💵')
                                ])
                            ])
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
                        // Enhanced Partner 1 Crypto with Digital Asset Token Selection (crypto assets, not auth tokens)
                        window.CryptoPortfolioInput ? createElement(window.CryptoPortfolioInput, {
                            key: 'p1-crypto-portfolio',
                            inputs,
                            setInputs,
                            language,
                            workingCurrency,
                            fieldPrefix: 'partner1',
                            compact: true,
                            className: "w-full"
                        }) : createElement('div', { key: 'p1-crypto-fallback' }, [
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
                        ]),
                        createElement('div', { key: 'p1-bank-account' }, [
                            createElement('label', { 
                                key: 'p1-bank-account-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.bankAccount),
                            createElement('input', {
                                key: 'p1-bank-account-input',
                                type: 'number',
                                value: inputs.partner1BankAccount || 0,
                                onChange: (e) => setInputs({...inputs, partner1BankAccount: parseInt(e.target.value) || 0}),
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
                    }, inputs.partnerName || t.partner2Savings),
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
                                className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 mb-2"
                            }),
                            // Partner 2 Portfolio tax rate input with enhanced styling
                            inputs.partner2PersonalPortfolio > 0 && createElement('div', { 
                                key: 'p2-tax-rate-section',
                                className: 'animate-fadeIn transition-all duration-300 ease-in-out mt-2 p-3 bg-purple-50 rounded border border-purple-200'
                            }, [
                                createElement('label', { 
                                    key: 'p2-tax-rate-label',
                                    className: "block text-xs font-medium text-purple-600 mb-1" 
                                }, language === 'he' ? 'מס רווחי הון (%)' : 'Capital Gains Tax (%)'),
                                createElement('div', { key: 'p2-tax-input-container', className: 'relative' }, [
                                    createElement('input', {
                                        key: 'p2-tax-rate-input',
                                        id: 'p2-tax-rate-input',
                                        type: 'number',
                                        min: '0',
                                        max: '50',
                                        step: '0.1',
                                        placeholder: '25',
                                        value: (inputs.partner2PortfolioTaxRate * 100) || 25,
                                        onChange: (e) => {
                                            const validatedRate = validateTaxRate(e.target.value);
                                            setInputs({...inputs, partner2PortfolioTaxRate: validatedRate / 100});
                                        },
                                        onBlur: (e) => {
                                            const validatedRate = validateTaxRate(e.target.value);
                                            e.target.value = validatedRate;
                                            setInputs({...inputs, partner2PortfolioTaxRate: validatedRate / 100});
                                        },
                                        className: `w-full p-1 text-sm border rounded focus:ring-2 focus:ring-purple-500 ${
                                            inputs.partner2PortfolioTaxRate > 0.5 || inputs.partner2PortfolioTaxRate < 0 ? 
                                            'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`
                                    }),
                                    createElement('span', {
                                        key: 'p2-percentage-symbol',
                                        className: 'absolute right-2 top-1 text-xs text-gray-500 pointer-events-none'
                                    }, '%')
                                ]),
                                // Validation feedback for Partner 2
                                (inputs.partner2PortfolioTaxRate > 0.5 || inputs.partner2PortfolioTaxRate < 0) && 
                                createElement('div', {
                                    key: 'p2-tax-validation-error',
                                    className: 'text-xs text-red-600 mt-1'
                                }, language === 'he' ? '⚠️ שיעור המס חייב להיות בין 0% ל-50%' : '⚠️ Tax rate must be between 0% and 50%'),
                                // Help text for Partner 2
                                createElement('div', {
                                    key: 'p2-tax-help',
                                    className: "text-xs text-purple-500 mt-1"
                                }, language === 'he' ? 
                                    'ישראל: 25% (תושבים), 30% (תושבי חוץ)' :
                                    'Israel: 25% (residents), 30% (non-residents)')
                            ]),
                            // Partner 2 Net value after tax with enhanced styling
                            // Calculation: partner2PersonalPortfolio * (1 - (inputs.partner2PortfolioTaxRate || 0.25))
                            inputs.partner2PersonalPortfolio > 0 && createElement('div', { 
                                key: 'p2-net-value-section',
                                className: 'animate-fadeIn transition-all duration-300 ease-in-out mt-2 p-2 bg-gradient-to-r from-purple-100 to-purple-50 rounded border border-purple-300'
                            }, [
                                createElement('div', { 
                                    key: 'p2-net-value-amount',
                                    className: "flex items-center justify-between text-sm font-bold text-purple-700" 
                                }, [
                                    createElement('span', { key: 'p2-net-text' }, 
                                        // Using formatCurrency with tax calculation: formatCurrency(partner2PersonalPortfolio * (1 - (inputs.partner2PortfolioTaxRate)))
                                        renderNetValue(inputs.partner2PersonalPortfolio, inputs.partner2PortfolioTaxRate, 'partner2', language === 'he' ? 'נטו:' : 'Net:')
                                    ),
                                    createElement('span', { key: 'p2-money-icon' }, '💵')
                                ])
                            ])
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
                        // Enhanced Partner 2 Crypto with Digital Asset Token Selection (crypto assets, not auth tokens)
                        window.CryptoPortfolioInput ? createElement(window.CryptoPortfolioInput, {
                            key: 'p2-crypto-portfolio',
                            inputs,
                            setInputs,
                            language,
                            workingCurrency,
                            fieldPrefix: 'partner2',
                            compact: true,
                            className: "w-full"
                        }) : createElement('div', { key: 'p2-crypto-fallback' }, [
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
                        ]),
                        createElement('div', { key: 'p2-bank-account' }, [
                            createElement('label', { 
                                key: 'p2-bank-account-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.bankAccount),
                            createElement('input', {
                                key: 'p2-bank-account-input',
                                type: 'number',
                                value: inputs.partner2BankAccount || 0,
                                onChange: (e) => setInputs({...inputs, partner2BankAccount: parseInt(e.target.value) || 0}),
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