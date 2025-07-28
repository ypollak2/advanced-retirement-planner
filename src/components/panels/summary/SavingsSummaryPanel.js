const SavingsSummaryPanel = ({ 
        inputs, language, t, totalMonthlySalary, yearsToRetirement, 
        estimatedMonthlyIncome, projectedWithGrowth, buyingPowerToday, 
        monthlyTotal, avgNetReturn, exportToPNG, exportForAI, 
        setShowChart, generateLLMAnalysis, workingCurrency = 'ILS'
    }) => {
        const [exchangeRates, setExchangeRates] = React.useState({
            USD: 0.27, EUR: 0.25, GBP: 0.21, BTC: 0.000025, ETH: 0.0003
        });
        const [currencyLoading, setCurrencyLoading] = React.useState(false);
        const [currencyError, setCurrencyError] = React.useState(null);
        
        // Load exchange rates when component mounts
        React.useEffect(() => {
            if (window.CurrencyExchangeAPI) {
                setCurrencyLoading(true);
                const currencyAPI = new window.CurrencyExchangeAPI();
                currencyAPI.getAllRates()
                    .then(rates => {
                        setExchangeRates(rates);
                        setCurrencyError(null);
                    })
                    .catch(error => {
                        console.error('Failed to load currency rates:', error);
                        setCurrencyError('Failed to load rates');
                    })
                    .finally(() => {
                        setCurrencyLoading(false);
                    });
            }
        }, []);
        
        // Use passed-in calculated values (or defaults if not provided)
        const safeYearsToRetirement = yearsToRetirement || Math.max(0, (inputs.retirementAge || 67) - (inputs.currentAge || 30));
        const safeTotalMonthlySalary = totalMonthlySalary || (inputs.planningType === 'couple' 
            ? (inputs.partner1Salary || 15000) + (inputs.partner2Salary || 12000)
            : (inputs.currentMonthlySalary || 15000));
        const safeEstimatedMonthlyIncome = estimatedMonthlyIncome || (safeTotalMonthlySalary * 0.21 * 12 * safeYearsToRetirement * 1.07 / (25 * 12));
        const safeProjectedWithGrowth = projectedWithGrowth || (safeTotalMonthlySalary * 0.21 * 12 * safeYearsToRetirement * 1.07);
        const safeBuyingPowerToday = buyingPowerToday || (safeProjectedWithGrowth / Math.pow(1.03, safeYearsToRetirement));
        const pensionNetReturn = Math.max(0.1, (inputs.expectedReturn || 7) - (inputs.accumulationFees || 1.0));
        const trainingNetReturn = Math.max(0.1, (inputs.expectedReturn || 7) - (inputs.trainingFundFees || 0.6));
        const safeAvgNetReturn = avgNetReturn || Math.max(0.1, (pensionNetReturn + trainingNetReturn) / 2);
        
        // Respect user inputs and show actual values, including zeros
        // Only use estimates when values are undefined/null (not when explicitly set to 0)
        const rawPensionSavings = inputs.currentSavings;
        const rawTrainingFundSavings = inputs.currentTrainingFund;
        const userAge = inputs.currentAge || 30;
        
        // Use actual input values; only provide age-based estimates for truly undefined values
        const safeCurrentPensionSavings = (rawPensionSavings !== undefined && rawPensionSavings !== null) ? 
            rawPensionSavings : Math.max((userAge - 22) * 12000, 50000);
        const safeCurrentTrainingFundSavings = (rawTrainingFundSavings !== undefined && rawTrainingFundSavings !== null) ? 
            rawTrainingFundSavings : Math.max((userAge - 22) * 8000, 25000);
        // Include crypto and other investment savings in total (with correct field names)
        const currentCrypto = inputs.currentDigitalAssetFiatValue || inputs.currentCryptoFiatValue || inputs.currentCrypto || 0;
        const currentSavingsAccount = inputs.currentSavingsAccount || 0;
        const currentRealEstate = inputs.currentRealEstate || 0;
        const currentInvestments = inputs.currentInvestments || 0;
        
        // Include partner crypto assets if in couple mode
        const partner1Crypto = inputs.partner1DigitalAssetFiatValue || inputs.partner1Crypto || 0;
        const partner2Crypto = inputs.partner2DigitalAssetFiatValue || inputs.partner2Crypto || 0;
        
        // Calculate total debt balances
        const calculateTotalDebtBalances = () => {
            const debtFields = ['mortgageBalance', 'carLoanBalance', 'creditCardBalance', 'otherDebtBalance'];
            const debtBalances = inputs.debtBalances || {};
            return debtFields.reduce((total, field) => total + (parseFloat(debtBalances[field]) || 0), 0);
        };
        
        const totalDebtBalances = calculateTotalDebtBalances();
        const totalSavings = safeCurrentPensionSavings + safeCurrentTrainingFundSavings + 
                           currentCrypto + partner1Crypto + partner2Crypto + 
                           currentSavingsAccount + currentRealEstate + currentInvestments;
        
        // Calculate net worth (assets - debts)
        const netWorth = totalSavings - totalDebtBalances;
        
        // Debug logging for crypto inclusion
        if (currentCrypto > 0 || partner1Crypto > 0 || partner2Crypto > 0) {
            console.log(`💎 Crypto Assets in Total Savings:`, {
                currentCrypto,
                partner1Crypto,
                partner2Crypto,
                totalCrypto: currentCrypto + partner1Crypto + partner2Crypto,
                totalSavings,
                allInputFields: {
                    currentDigitalAssetFiatValue: inputs.currentDigitalAssetFiatValue,
                    currentDigitalAssetAmount: inputs.currentDigitalAssetAmount,
                    currentDigitalAssetToken: inputs.currentDigitalAssetToken,
                    partner1DigitalAssetFiatValue: inputs.partner1DigitalAssetFiatValue,
                    partner2DigitalAssetFiatValue: inputs.partner2DigitalAssetFiatValue
                }
            });
        }
        
        const formatCurrency = (amount, currency = workingCurrency) => {
            const symbols = { 'ILS': '₪', 'USD': '$', 'EUR': '€', 'GBP': '£', 'BTC': '₿', 'ETH': 'Ξ' };
            const symbol = symbols[currency] || '₪';
            // Safety check for invalid numbers
            if (!amount || isNaN(amount) || !isFinite(amount)) {
                return `${symbol}0`;
            }
            // Always round to whole numbers - no decimals/cents
            return `${symbol}${Math.round(Math.abs(amount)).toLocaleString()}`;
        };
        
        return React.createElement('div', { 
            className: "financial-card p-6 animate-slide-up sticky top-4" 
        }, [
            React.createElement('h3', { 
                key: 'title',
                className: "text-xl font-bold text-purple-700 mb-4 flex items-center" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-2" }, '💰'),
                language === 'he' ? 'סיכום חיסכון' : 'Savings Summary'
            ]),
            
            // Current Totals
            React.createElement('div', {
                key: 'current',
                className: "space-y-3 mb-6"
            }, [
                React.createElement('div', {
                    key: 'pension',
                    className: "metric-card metric-neutral p-4 border-l-4 border-blue-500"
                }, [
                    React.createElement('div', { className: "flex items-center justify-between mb-2" }, [
                        React.createElement('div', { key: 'pension-label', className: "flex items-center" }, [
                            React.createElement('span', { key: 'pension-icon', className: "text-lg mr-2" }, '🏛️'),
                            React.createElement('span', { key: 'pension-text', className: "text-sm text-blue-700 font-medium" }, 
                                language === 'he' ? 'פנסיה נוכחית' : 'Current Pension')
                        ]),
                        React.createElement('span', { key: 'pension-trend', className: "text-xs text-green-600" }, '📈')
                    ]),
                    React.createElement('div', { className: "text-xl font-bold text-blue-800 wealth-amount" }, 
                        formatCurrency(safeCurrentPensionSavings, workingCurrency))
                ]),
                
                React.createElement('div', {
                    key: 'training',
                    className: "metric-card metric-positive p-4 border-l-4 border-green-500"
                }, [
                    React.createElement('div', { className: "flex items-center justify-between mb-2" }, [
                        React.createElement('div', { key: 'training-label', className: "flex items-center" }, [
                            React.createElement('span', { key: 'training-icon', className: "text-lg mr-2" }, '🎓'),
                            React.createElement('span', { key: 'training-text', className: "text-sm text-green-700 font-medium" }, 
                                language === 'he' ? 'קרן השתלמות' : 'Training Fund')
                        ]),
                        React.createElement('span', { key: 'training-trend', className: "text-xs text-green-600" }, '💪')
                    ]),
                    React.createElement('div', { className: "text-xl font-bold text-green-800 wealth-amount" }, 
                        formatCurrency(safeCurrentTrainingFundSavings, workingCurrency))
                ]),
                
                // Crypto Assets (only show if there are any)
                (currentCrypto > 0 || partner1Crypto > 0 || partner2Crypto > 0) && React.createElement('div', {
                    key: 'crypto',
                    className: "metric-card metric-positive p-4 border-l-4 border-yellow-500"
                }, [
                    React.createElement('div', { className: "flex items-center justify-between mb-2" }, [
                        React.createElement('div', { key: 'crypto-label', className: "flex items-center" }, [
                            React.createElement('span', { key: 'crypto-icon', className: "text-lg mr-2" }, '₿'),
                            React.createElement('span', { key: 'crypto-text', className: "text-sm text-yellow-700 font-medium" }, 
                                language === 'he' ? 'נכסים דיגיטליים' : 'Digital Assets')
                        ]),
                        React.createElement('span', { key: 'crypto-trend', className: "text-xs text-green-600" }, '🚀')
                    ]),
                    React.createElement('div', { className: "text-xl font-bold text-yellow-800 wealth-amount" }, 
                        formatCurrency(currentCrypto + partner1Crypto + partner2Crypto, workingCurrency)),
                    // Show breakdown if multiple sources
                    (currentCrypto > 0 && (partner1Crypto > 0 || partner2Crypto > 0)) && React.createElement('div', {
                        key: 'crypto-breakdown',
                        className: "text-xs text-yellow-600 mt-1"
                    }, [
                        currentCrypto > 0 && React.createElement('div', { key: 'main-crypto' }, 
                            `${language === 'he' ? 'עיקרי' : 'Main'}: ${formatCurrency(currentCrypto, workingCurrency)}`),
                        partner1Crypto > 0 && React.createElement('div', { key: 'p1-crypto' }, 
                            `${language === 'he' ? 'בן/בת זוג 1' : 'Partner 1'}: ${formatCurrency(partner1Crypto, workingCurrency)}`),
                        partner2Crypto > 0 && React.createElement('div', { key: 'p2-crypto' }, 
                            `${language === 'he' ? 'בן/בת זוג 2' : 'Partner 2'}: ${formatCurrency(partner2Crypto, workingCurrency)}`)
                    ])
                ]),
                
                // Debt Balances (only show if there are any)
                totalDebtBalances > 0 && React.createElement('div', {
                    key: 'debt-balances',
                    className: "metric-card metric-negative p-4 border-l-4 border-red-500"
                }, [
                    React.createElement('div', { className: "flex items-center justify-between mb-2" }, [
                        React.createElement('div', { key: 'debt-label', className: "flex items-center" }, [
                            React.createElement('span', { key: 'debt-icon', className: "text-lg mr-2" }, '💳'),
                            React.createElement('span', { key: 'debt-text', className: "text-sm text-red-700 font-medium" }, 
                                language === 'he' ? 'חובות נוכחיים' : 'Current Debt')
                        ]),
                        React.createElement('span', { key: 'debt-trend', className: "text-xs text-red-600" }, '📉')
                    ]),
                    React.createElement('div', { className: "text-xl font-bold text-red-800 wealth-amount" }, 
                        formatCurrency(totalDebtBalances, workingCurrency)),
                    // Show debt breakdown if multiple sources
                    inputs.debtBalances && React.createElement('div', {
                        key: 'debt-breakdown',
                        className: "text-xs text-red-600 mt-1 space-y-1"
                    }, [
                        (inputs.debtBalances.mortgageBalance > 0) && React.createElement('div', { key: 'mortgage' }, 
                            `${language === 'he' ? 'משכנתא' : 'Mortgage'}: ${formatCurrency(inputs.debtBalances.mortgageBalance, workingCurrency)}`),
                        (inputs.debtBalances.carLoanBalance > 0) && React.createElement('div', { key: 'car-loan' }, 
                            `${language === 'he' ? 'הלוואת רכב' : 'Car Loan'}: ${formatCurrency(inputs.debtBalances.carLoanBalance, workingCurrency)}`),
                        (inputs.debtBalances.creditCardBalance > 0) && React.createElement('div', { key: 'credit-card' }, 
                            `${language === 'he' ? 'כרטיס אשראי' : 'Credit Card'}: ${formatCurrency(inputs.debtBalances.creditCardBalance, workingCurrency)}`),
                        (inputs.debtBalances.otherDebtBalance > 0) && React.createElement('div', { key: 'other-debt' }, 
                            `${language === 'he' ? 'חובות אחרים' : 'Other Debt'}: ${formatCurrency(inputs.debtBalances.otherDebtBalance, workingCurrency)}`)
                    ])
                ]),
                
                // Total Assets Section
                React.createElement('div', {
                    key: 'total-assets',
                    className: totalSavings === 0 ? "metric-card metric-neutral p-3 opacity-60" : "metric-card metric-positive p-3"
                }, [
                    React.createElement('div', { className: "text-sm text-blue-700 font-medium" }, 
                        language === 'he' ? 'סך הנכסים' : 'Total Assets'),
                    React.createElement('div', { 
                        className: totalSavings === 0 ? 
                            "text-lg font-bold text-gray-500 wealth-amount" : 
                            "text-lg font-bold text-blue-800 wealth-amount" 
                    }, totalSavings === 0 ? 
                        (language === 'he' ? 'לא הוזנו חיסכונות' : 'No savings entered yet') :
                        formatCurrency(totalSavings, workingCurrency)
                    )
                ]),
                
                // Net Worth Section (Assets - Debts)
                React.createElement('div', {
                    key: 'net-worth',
                    className: netWorth >= 0 ? 
                        "metric-card metric-positive p-4 border-l-4 border-purple-600 bg-gradient-to-r from-purple-50 to-blue-50" :
                        "metric-card metric-negative p-4 border-l-4 border-red-600 bg-gradient-to-r from-red-50 to-orange-50"
                }, [
                    React.createElement('div', { className: "flex items-center justify-between mb-2" }, [
                        React.createElement('div', { key: 'networth-label', className: "flex items-center" }, [
                            React.createElement('span', { key: 'networth-icon', className: "text-xl mr-2" }, 
                                netWorth >= 0 ? '💎' : '⚠️'),
                            React.createElement('span', { key: 'networth-text', className: `text-sm font-bold ${netWorth >= 0 ? 'text-purple-700' : 'text-red-700'}` }, 
                                language === 'he' ? 'שווי נטו' : 'Net Worth')
                        ]),
                        React.createElement('span', { key: 'networth-trend', className: "text-xs" }, 
                            netWorth >= 0 ? '💪' : '📉')
                    ]),
                    React.createElement('div', { className: `text-2xl font-bold wealth-amount ${netWorth >= 0 ? 'text-purple-800' : 'text-red-800'}` }, 
                        formatCurrency(netWorth, workingCurrency)),
                    React.createElement('div', { className: `text-xs mt-1 ${netWorth >= 0 ? 'text-purple-600' : 'text-red-600'}` }, 
                        `${formatCurrency(totalSavings, workingCurrency)} ${language === 'he' ? 'נכסים' : 'assets'} - ${formatCurrency(totalDebtBalances, workingCurrency)} ${language === 'he' ? 'חובות' : 'debts'}`)
                ])
            ]),
            
            // Monthly Salary & Tax Calculation (only for single planning)
            inputs.planningType !== 'couple' ? React.createElement('div', {
                key: 'salary-section',
                className: "bg-blue-50 rounded-lg p-3 mb-4 border border-blue-200"
            }, (() => {
                const taxResult = window.TaxCalculators ? 
                    window.TaxCalculators.calculateNetSalary(inputs.currentMonthlySalary || 15000, inputs.taxCountry || 'israel') :
                    { netSalary: Math.round((inputs.currentMonthlySalary || 15000) * 0.66), taxRate: 34 };
                const countryName = inputs.taxCountry === 'israel' ? (language === 'he' ? 'ישראל' : 'Israel') :
                                   inputs.taxCountry === 'uk' ? (language === 'he' ? 'בריטניה' : 'UK') :
                                   inputs.taxCountry === 'us' ? (language === 'he' ? 'ארה״ב' : 'US') : '';
                
                return [
                    React.createElement('div', { key: 'salary-title', className: "text-sm text-blue-700 font-medium mb-2" }, 
                        language === 'he' ? `משכורת חודשית (${countryName})` : `Monthly Salary (${countryName})`),
                    React.createElement('div', { key: 'salary-values', className: "grid grid-cols-2 gap-2 text-xs" }, [
                        React.createElement('div', { key: 'gross' }, [
                            React.createElement('div', { key: 'gross-label', className: "text-blue-600" }, 
                                language === 'he' ? 'ברוטו:' : 'Gross:'),
                            React.createElement('div', { key: 'gross-amount', className: "font-bold" }, 
                                formatCurrency(inputs.currentMonthlySalary || 15000, workingCurrency))
                        ]),
                        React.createElement('div', { key: 'net' }, [
                            React.createElement('div', { key: 'net-label', className: "text-blue-600" }, 
                                language === 'he' ? 'נטו:' : 'Net:'),
                            React.createElement('div', { key: 'net-amount', className: "font-bold text-blue-800" }, 
                                formatCurrency(taxResult.netSalary, workingCurrency))
                        ])
                    ]),
                    React.createElement('div', { key: 'tax-rate-info', className: "text-xs text-blue-600 mt-1" }, 
                        language === 'he' ? `שיעור מס: ${taxResult.taxRate}%` : `Tax Rate: ${taxResult.taxRate}%`)
                ];
            })()) : null,

            // Monthly Contributions
            React.createElement('div', {
                key: 'monthly',
                className: "bg-gray-50 rounded-lg p-3 mb-4"
            }, [
                React.createElement('div', { className: "text-sm text-gray-700 font-medium mb-2" }, 
                    language === 'he' ? 'הפקדות חודשיות' : 'Monthly Contributions'),
                React.createElement('div', { className: "text-base font-bold text-gray-800" }, 
                    formatCurrency(monthlyTotal || (safeTotalMonthlySalary * 0.21), workingCurrency))
            ]),
            
            // Projected at Retirement
            React.createElement('div', {
                key: 'projected',
                className: "bg-yellow-50 rounded-lg p-3 mb-4 border border-yellow-200"
            }, [
                React.createElement('div', { className: "text-sm text-yellow-700 font-medium" }, 
                    language === 'he' ? 'צפי בפרישה (אחרי דמי ניהול)' : 'Projected at Retirement (After Fees)'),
                React.createElement('div', { className: "text-lg font-bold text-yellow-800" }, 
                    formatCurrency(safeProjectedWithGrowth, workingCurrency)),
                React.createElement('div', { className: "text-xs text-yellow-600 mt-1" }, 
                    language === 'he' ? `תשואה נטו ממוצעת: ${safeAvgNetReturn.toFixed(1)}%` : `Avg Net Return: ${safeAvgNetReturn.toFixed(1)}%`)
            ]),
            
            // Buying Power - Total and Monthly
            React.createElement('div', {
                key: 'buying-power',
                className: "bg-orange-50 rounded-lg p-3 mb-4 border border-orange-200"
            }, [
                React.createElement('div', { className: "text-sm text-orange-700 font-medium mb-2" }, 
                    language === 'he' ? 'כוח קנייה היום' : 'Today\'s Buying Power'),
                React.createElement('div', { key: 'buying-power-grid', className: "grid grid-cols-2 gap-2" }, [
                    React.createElement('div', { key: 'total' }, [
                        React.createElement('div', { className: "text-xs text-orange-600" }, 
                            language === 'he' ? 'סה״כ:' : 'Total:'),
                        React.createElement('div', { className: "text-base font-bold text-orange-800" }, 
                            formatCurrency(safeBuyingPowerToday, workingCurrency))
                    ]),
                    React.createElement('div', { key: 'monthly' }, [
                        React.createElement('div', { className: "text-xs text-orange-600" }, 
                            language === 'he' ? 'חודשי:' : 'Monthly:'),
                        React.createElement('div', { className: "text-base font-bold text-orange-800" }, 
                            formatCurrency(safeBuyingPowerToday * (safeAvgNetReturn/100) / 12, workingCurrency))
                    ])
                ])
            ]),
            
            // Multi-Currency Display
            React.createElement('div', {
                key: 'currencies',
                className: "border-t border-gray-200 pt-4 mb-4"
            }, [
                React.createElement('div', { 
                    key: 'currency-title',
                    className: "text-sm font-medium text-gray-700 mb-3" 
                }, language === 'he' ? 'בערכי מטבעות' : 'In Other Currencies'),
                
                React.createElement('div', {
                    key: 'currency-grid',
                    className: "currency-grid"
                }, [
                    ['USD', '$'], ['EUR', '€'], ['GBP', '£'], ['BTC', '₿'], ['ETH', 'Ξ']
                ].map(([currency, symbol]) => React.createElement('div', { 
                    key: currency, 
                    className: "currency-card" 
                }, [
                    React.createElement('div', { 
                        key: `${currency}-symbol`, 
                        className: "currency-symbol" 
                    }, currency),
                    React.createElement('div', { 
                        key: `${currency}-value`, 
                        className: currencyLoading ? "currency-loading" : 
                                 currencyError ? "currency-error" : "currency-rate"
                    }, 
                        currencyLoading ? "Loading..." :
                        currencyError ? "Error" :
                        exchangeRates[currency] ? 
                            (currency === 'BTC' || currency === 'ETH' ? 
                                `${symbol}${Math.round(totalSavings * exchangeRates[currency] * 100000) / 100000}` :
                                `${symbol}${Math.round(totalSavings * exchangeRates[currency]).toLocaleString()}`) :
                            "N/A"
                    )
                ])))
            ]),
            
            // Enhanced Financial Forecast
            React.createElement('div', {
                key: 'financial-forecast',
                className: "border-t border-gray-200 pt-4 space-y-3"
            }, [
                React.createElement('div', { 
                    key: 'forecast-title',
                    className: "section-header text-sm font-medium text-gray-700 mb-3 flex items-center" 
                }, [
                    React.createElement('span', { key: 'icon', className: "mr-2" }, '🔮'),
                    language === 'he' ? 'תחזית פיננסית' : 'Financial Forecast'
                ]),
                
                // Retirement projections
                React.createElement('div', { 
                    key: 'projections',
                    className: "space-y-2" 
                }, [
                    React.createElement('div', {
                        key: 'projected-value',
                        className: "metric-card metric-positive p-3"
                    }, [
                        React.createElement('div', { className: "text-xs text-gray-600" }, 
                            language === 'he' ? 'צבירה צפויה בגיל פרישה' : 'Projected Retirement Value'),
                        React.createElement('div', { className: "text-lg font-bold text-green-700 wealth-amount" }, 
                            formatCurrency(projectedWithGrowth, workingCurrency)),
                        React.createElement('div', { className: "text-xs text-gray-500 mt-1" }, 
                            `${language === 'he' ? 'בעוד' : 'In'} ${yearsToRetirement} ${language === 'he' ? 'שנים' : 'years'}`)
                    ]),
                    
                    React.createElement('div', {
                        key: 'buying-power',
                        className: "metric-card metric-warning p-3"
                    }, [
                        React.createElement('div', { className: "text-xs text-gray-600" }, 
                            language === 'he' ? 'כוח קנייה (נכון להיום)' : 'Buying Power (Today\'s Value)'),
                        React.createElement('div', { className: "text-lg font-bold text-orange-700 wealth-amount" }, 
                            formatCurrency(buyingPowerToday, workingCurrency)),
                        React.createElement('div', { className: "text-xs text-gray-500 mt-1" }, 
                            `${language === 'he' ? 'לאחר אינפלציה של' : 'After'} ${(inputs.inflationRate || 3)}% ${language === 'he' ? '' : 'inflation'}`)
                    ]),
                    
                    React.createElement('div', {
                        key: 'monthly-income',
                        className: "metric-card metric-neutral p-3"
                    }, [
                        React.createElement('div', { className: "text-xs text-gray-600" }, 
                            language === 'he' ? 'הכנסה חודשית בפרישה' : 'Monthly Retirement Income'),
                        React.createElement('div', { className: "text-lg font-bold text-blue-700 wealth-amount" }, 
                            formatCurrency(projectedWithGrowth * (safeAvgNetReturn/100) / 12, workingCurrency)),
                        React.createElement('div', { className: "text-xs text-gray-500 mt-1" }, 
                            `${(safeAvgNetReturn).toFixed(1)}% ${language === 'he' ? 'תשואה שנתית' : 'annual return'}`)
                    ])
                ]),
                
                // Enhanced Progress Timeline with Instructions
                React.createElement('div', { 
                    key: 'progress-timeline',
                    className: "border-t border-gray-200 pt-4 mt-4 space-y-4" 
                }, [
                    React.createElement('div', { 
                        key: 'timeline-title',
                        className: "text-sm font-bold text-purple-700 mb-3 flex items-center" 
                    }, [
                        React.createElement('span', { key: 'icon', className: "mr-2" }, '🛤️'),
                        language === 'he' ? 'מסלול הדרך לפרישה' : 'Retirement Journey Timeline'
                    ]),
                    
                    // Timeline Visual
                    React.createElement('div', { 
                        key: 'timeline-visual',
                        className: "relative bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 mb-4" 
                    }, [
                        // Progress track
                        React.createElement('div', { 
                            key: 'progress-track',
                            className: "relative h-3 bg-gray-200 rounded-full overflow-hidden" 
                        }, [
                            React.createElement('div', { 
                                key: 'progress-fill',
                                className: "h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-1000 ease-out",
                                style: { 
                                    width: `${Math.min(100, Math.max(0, ((inputs.currentAge || 30) - 22) / ((inputs.retirementAge || 67) - 22) * 100))}%` 
                                }
                            })
                        ]),
                        
                        // Timeline markers
                        React.createElement('div', { 
                            key: 'timeline-markers',
                            className: "flex justify-between items-center mt-3 text-xs" 
                        }, [
                            React.createElement('div', { 
                                key: 'start-marker',
                                className: "text-center" 
                            }, [
                                React.createElement('div', { className: "w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1" }),
                                React.createElement('div', { className: "font-medium text-blue-700" }, 
                                    language === 'he' ? 'התחלה' : 'Start'),
                                React.createElement('div', { className: "text-gray-500" }, 
                                    `${language === 'he' ? 'גיל' : 'Age'} 22`)
                            ]),
                            
                            React.createElement('div', { 
                                key: 'current-marker',
                                className: "text-center" 
                            }, [
                                React.createElement('div', { className: "w-4 h-4 bg-purple-500 rounded-full mx-auto mb-1 animate-pulse" }),
                                React.createElement('div', { className: "font-bold text-purple-700" }, 
                                    language === 'he' ? 'כרגע' : 'Now'),
                                React.createElement('div', { className: "text-purple-600" }, 
                                    `${language === 'he' ? 'גיל' : 'Age'} ${inputs.currentAge || 30}`)
                            ]),
                            
                            React.createElement('div', { 
                                key: 'retirement-marker',
                                className: "text-center" 
                            }, [
                                React.createElement('div', { className: "w-3 h-3 bg-green-500 rounded-full mx-auto mb-1" }),
                                React.createElement('div', { className: "font-medium text-green-700" }, 
                                    language === 'he' ? 'פרישה' : 'Retirement'),
                                React.createElement('div', { className: "text-gray-500" }, 
                                    `${language === 'he' ? 'גיל' : 'Age'} ${inputs.retirementAge || 67}`)
                            ])
                        ]),
                        
                        // Progress percentage
                        React.createElement('div', { 
                            key: 'progress-percentage',
                            className: "text-center mt-3" 
                        }, [
                            React.createElement('div', { className: "text-2xl font-bold text-purple-600" }, 
                                `${Math.round(Math.max(0, ((inputs.currentAge || 30) - 22) / ((inputs.retirementAge || 67) - 22) * 100))}%`),
                            React.createElement('div', { className: "text-sm text-gray-600" }, 
                                language === 'he' ? 'מהדרך אל הפרישה' : 'of the way to retirement')
                        ])
                    ]),
                    
                    // Key Milestones & Instructions
                    React.createElement('div', { 
                        key: 'milestones',
                        className: "space-y-3" 
                    }, [
                        React.createElement('div', { 
                            key: 'milestone-title',
                            className: "text-sm font-semibold text-gray-700 mb-2" 
                        }, language === 'he' ? 'נקודות ציון חשובות:' : 'Important Milestones:'),
                        
                        // Current status
                        React.createElement('div', { 
                            key: 'current-status',
                            className: "bg-purple-50 rounded-lg p-3 border border-purple-200" 
                        }, [
                            React.createElement('div', { key: 'status-header', className: "flex items-center mb-2" }, [
                                React.createElement('span', { key: 'status-icon', className: "text-lg mr-2" }, '📍'),
                                React.createElement('span', { key: 'status-title', className: "font-semibold text-purple-700" }, 
                                    language === 'he' ? 'המצב הנוכחי שלך' : 'Your Current Status')
                            ]),
                            React.createElement('div', { key: 'status-content', className: "text-sm text-purple-600 space-y-1" }, [
                                React.createElement('div', { key: 'years-remaining' }, 
                                    `${language === 'he' ? 'עוד' : 'Only'} ${(inputs.retirementAge || 67) - (inputs.currentAge || 30)} ${language === 'he' ? 'שנים עד הפרישה' : 'years until retirement'}`),
                                React.createElement('div', { key: 'monthly-savings' }, 
                                    `${language === 'he' ? 'חיסכון חודשי:' : 'Monthly savings:'} ${formatCurrency(monthlyTotal || (safeTotalMonthlySalary * 0.21), workingCurrency)}`),
                                React.createElement('div', { key: 'projected-total' }, 
                                    `${language === 'he' ? 'צפי צבירה:' : 'Projected total:'} ${formatCurrency(safeProjectedWithGrowth, workingCurrency)}`)
                            ])
                        ]),
                        
                        // Next steps
                        React.createElement('div', { 
                            key: 'next-steps',
                            className: "bg-blue-50 rounded-lg p-3 border border-blue-200" 
                        }, [
                            React.createElement('div', { key: 'steps-header', className: "flex items-center mb-2" }, [
                                React.createElement('span', { key: 'steps-icon', className: "text-lg mr-2" }, '🎯'),
                                React.createElement('span', { key: 'steps-title', className: "font-semibold text-blue-700" }, 
                                    language === 'he' ? 'הצעדים הבאים' : 'Next Steps')
                            ]),
                            React.createElement('div', { key: 'steps-content', className: "text-sm text-blue-600 space-y-1" }, [
                                React.createElement('div', { key: 'step-1' }, 
                                    language === 'he' ? '✓ המשך להפקיד בקביעות' : '✓ Continue regular contributions'),
                                React.createElement('div', { key: 'step-2' }, 
                                    language === 'he' ? '✓ בדוק דמי ניהול מידי שנה' : '✓ Review management fees annually'),
                                React.createElement('div', { key: 'step-3' }, 
                                    language === 'he' ? '✓ עדכן תוכנית כל 2-3 שנים' : '✓ Update plan every 2-3 years')
                            ])
                        ]),
                        
                        // Time remaining insight
                        React.createElement('div', { 
                            key: 'time-insight',
                            className: "bg-green-50 rounded-lg p-3 border border-green-200" 
                        }, [
                            React.createElement('div', { key: 'time-header', className: "flex items-center mb-2" }, [
                                React.createElement('span', { key: 'time-icon', className: "text-lg mr-2" }, '⏰'),
                                React.createElement('span', { key: 'time-title', className: "font-semibold text-green-700" }, 
                                    language === 'he' ? 'זמן הוא הנכס שלך' : 'Time is Your Asset')
                            ]),
                            React.createElement('div', { key: 'time-content', className: "text-sm text-green-600" }, 
                                language === 'he' ? 
                                    `יש לך עוד ${((inputs.retirementAge || 67) - (inputs.currentAge || 30)) * 12} תשלומים חודשיים להשקיע. כל תשלום נוסף משפיע משמעותית על הצבירה הסופית בזכות הריבית דריבית.` :
                                    `You have ${((inputs.retirementAge || 67) - (inputs.currentAge || 30)) * 12} more monthly payments to make. Each additional payment significantly impacts your final accumulation through compound interest.`)
                        ])
                    ])
                ])
            ]),
            
            // Bottom Line Summary is now rendered inside SavingsSummaryPanel
            
            // Enhanced Export Buttons with elegant design
            React.createElement('div', {
                key: 'export-buttons',
                className: "mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg p-6 border border-blue-200"
            }, [
                React.createElement('div', { 
                    key: 'export-header',
                    className: "flex items-center gap-3 mb-4" 
                }, [
                    React.createElement('div', {
                        key: 'export-icon',
                        className: "w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold"
                    }, '📊'),
                    React.createElement('h3', { 
                        key: 'export-title',
                        className: "text-lg font-semibold text-gray-800" 
                    }, language === 'he' ? 'ייצוא והדפסה' : 'Export & Share'),
                    React.createElement('div', {
                        key: 'export-badge',
                        className: "px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                    }, language === 'he' ? 'מקצועי' : 'Professional')
                ]),
                
                React.createElement('div', {
                    key: 'export-buttons-grid',
                    className: "grid grid-cols-1 md:grid-cols-2 gap-3"
                }, [
                    React.createElement('button', {
                        key: 'export-png',
                        onClick: exportToPNG,
                        className: "group relative bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-300 rounded-xl p-4 transition-all duration-200 hover:shadow-md"
                    }, [
                        React.createElement('div', {
                            key: 'png-content',
                            className: "flex items-center gap-3"
                        }, [
                            React.createElement('div', {
                                key: 'png-icon-bg',
                                className: "w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-lg group-hover:scale-110 transition-transform"
                            }, '🖼️'),
                            React.createElement('div', {
                                key: 'png-text-content',
                                className: "text-left"
                            }, [
                                React.createElement('div', {
                                    key: 'png-title',
                                    className: "font-semibold text-gray-800 text-sm"
                                }, language === 'he' ? 'ייצא כתמונה' : 'Export as Image'),
                                React.createElement('div', {
                                    key: 'png-subtitle',
                                    className: "text-xs text-gray-500"
                                }, language === 'he' ? 'PNG באיכות גבוהה' : 'High-quality PNG')
                            ])
                        ])
                    ]),
                    
                    React.createElement('button', {
                        key: 'export-ai',
                        onClick: exportForAI,
                        className: "group relative bg-white hover:bg-purple-50 border-2 border-purple-200 hover:border-purple-300 rounded-xl p-4 transition-all duration-200 hover:shadow-md"
                    }, [
                        React.createElement('div', {
                            key: 'ai-content',
                            className: "flex items-center gap-3"
                        }, [
                            React.createElement('div', {
                                key: 'ai-icon-bg',
                                className: "w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-lg group-hover:scale-110 transition-transform"
                            }, '🤖'),
                            React.createElement('div', {
                                key: 'ai-text-content',
                                className: "text-left"
                            }, [
                                React.createElement('div', {
                                    key: 'ai-title',
                                    className: "font-semibold text-gray-800 text-sm"
                                }, language === 'he' ? 'ייצא לכלי AI' : 'Export for AI'),
                                React.createElement('div', {
                                    key: 'ai-subtitle',
                                    className: "text-xs text-gray-500"
                                }, language === 'he' ? 'ניתוח מתקדם' : 'Advanced Analysis')
                            ])
                        ])
                    ])
                ]),
                
                React.createElement('button', {
                    key: 'show-chart',
                    onClick: () => setShowChart(true),
                    className: "btn-primary w-full text-sm flex items-center justify-center space-x-2 py-3 text-base"
                }, [
                    React.createElement('span', { key: 'icon' }, '📊'),
                    React.createElement('span', { key: 'text' }, language === 'he' ? 'ייצוג גרפי' : 'Graphical View')
                ]),
                
                React.createElement('button', {
                    key: 'llm-analysis',
                    onClick: generateLLMAnalysis,
                    className: "btn-primary w-full text-sm flex items-center justify-center space-x-2 py-3 text-base"
                }, [
                    React.createElement('span', { key: 'icon' }, '🧠'),
                    React.createElement('span', { key: 'text' }, language === 'he' ? 'ניתוח AI' : 'LLM Analysis')
                ])
            ]),
            
            // Bottom Line Summary - Key metrics at a glance
            React.createElement(BottomLineSummary, {
                key: 'bottom-line-summary',
                inputs,
                language,
                totalMonthlySalary: safeTotalMonthlySalary,
                yearsToRetirement: safeYearsToRetirement,
                estimatedMonthlyIncome: safeEstimatedMonthlyIncome,
                projectedWithGrowth: safeProjectedWithGrowth,
                buyingPowerToday: safeBuyingPowerToday,
                formatCurrency
            })
        ]);
    };

// Export to window for global access
window.SavingsSummaryPanel = SavingsSummaryPanel;