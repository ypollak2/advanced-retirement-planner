// FIRE Calculator Module - Dynamic Module for Financial Independence Retire Early calculations
// Comprehensive FIRE planning with debt management and early retirement scenarios

(function() {
    'use strict';

    // Icon Components
    const TrendingUp = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '📈');

    const Target = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '🎯');

    const Calculator = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '📊');

    const DollarSign = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '💰');

    // Currency formatting utility
    const formatCurrency = (amount) => {
        if (amount >= 1000000) {
            return `₪${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `₪${(amount / 1000).toFixed(0)}K`;
        } else {
            return `₪${Math.round(amount).toLocaleString()}`;
        }
    };

    // FIRE Calculator Component
    const FireCalculator = ({ inputs, setInputs, language, t }) => {
        
        // Initialize FIRE-specific inputs if not present
        React.useEffect(() => {
            const fireDefaults = {
                fireTargetAge: inputs.fireTargetAge || 50,
                fireMonthlyExpenses: inputs.fireMonthlyExpenses || 12000,
                fireSafeWithdrawlRate: inputs.fireSafeWithdrawlRate || 4.0,
                currentPersonalPortfolio: inputs.currentPersonalPortfolio || 0,
                personalPortfolioMonthly: inputs.personalPortfolioMonthly || 0,
                personalPortfolioReturn: inputs.personalPortfolioReturn || 8.0,
                currentCrypto: inputs.currentCrypto || 0,
                cryptoMonthly: inputs.cryptoMonthly || 0,
                cryptoReturn: inputs.cryptoReturn || 15.0,
                currentRealEstate: inputs.currentRealEstate || 0,
                realEstateMonthly: inputs.realEstateMonthly || 0,
                realEstateReturn: inputs.realEstateReturn || 6.0,
                currentTrainingFund: inputs.currentTrainingFund || 0,
                trainingFundReturn: inputs.trainingFundReturn || 7.0,
                // Debt management
                mortgageBalance: inputs.mortgageBalance || 0,
                mortgageMonthlyPayment: inputs.mortgageMonthlyPayment || 0,
                personalLoans: inputs.personalLoans || 0,
                personalLoansMonthly: inputs.personalLoansMonthly || 0,
                creditCardDebt: inputs.creditCardDebt || 0,
                creditCardMonthly: inputs.creditCardMonthly || 0,
                otherDebts: inputs.otherDebts || 0,
                otherDebtsMonthly: inputs.otherDebtsMonthly || 0
            };

            const needsUpdate = Object.keys(fireDefaults).some(key => 
                inputs[key] === undefined || inputs[key] === null
            );

            if (needsUpdate) {
                setInputs(prev => ({
                    ...prev,
                    ...fireDefaults
                }));
            }
        }, []);

        // Calculate FIRE metrics
        const calculateFireMetrics = () => {
            const currentTotalAssets = (inputs.currentSavings || 0) + 
                                     (inputs.currentTrainingFund || 0) + 
                                     (inputs.currentPersonalPortfolio || 0) + 
                                     (inputs.currentCrypto || 0) + 
                                     (inputs.currentRealEstate || 0);
            
            const totalDebts = (inputs.mortgageBalance || 0) + 
                              (inputs.personalLoans || 0) + 
                              (inputs.creditCardDebt || 0) + 
                              (inputs.otherDebts || 0);
            
            const currentNetWorth = currentTotalAssets - totalDebts;
            
            const monthlyTotalSavings = (inputs.currentMonthlySalary || 0) * 0.186 + // Pension contribution
                                       (inputs.personalPortfolioMonthly || 0) + 
                                       (inputs.cryptoMonthly || 0) + 
                                       (inputs.realEstateMonthly || 0);
            
            const totalMonthlyDebtPayments = (inputs.mortgageMonthlyPayment || 0) + 
                                           (inputs.personalLoansMonthly || 0) + 
                                           (inputs.creditCardMonthly || 0) + 
                                           (inputs.otherDebtsMonthly || 0);
            
            const netMonthlySavings = monthlyTotalSavings - totalMonthlyDebtPayments;
            
            // FIRE target includes debt payoff + living expenses
            const fireMonthlyExpensesWithDebt = (inputs.fireMonthlyExpenses || 0) + totalMonthlyDebtPayments;
            const fireTarget = fireMonthlyExpensesWithDebt * 12 * (100 / (inputs.fireSafeWithdrawlRate || 4));
            const remainingNeeded = Math.max(0, fireTarget - currentNetWorth);
            const yearsToFire = netMonthlySavings > 0 ? remainingNeeded / (netMonthlySavings * 12) : Infinity;
            const fireAge = (inputs.currentAge || 30) + yearsToFire;

            return {
                currentNetWorth,
                totalDebts,
                fireTarget,
                remainingNeeded,
                yearsToFire,
                fireAge,
                netMonthlySavings,
                totalMonthlyDebtPayments
            };
        };

        const fireMetrics = calculateFireMetrics();

        return React.createElement('div', { className: "space-y-6" }, [
            
            // FIRE Calculator Header
            React.createElement('div', { 
                key: 'header',
                className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in" 
            }, [
                React.createElement('h2', { 
                    key: 'title',
                    className: "text-2xl font-bold text-orange-600 mb-6 flex items-center" 
                }, [
                    React.createElement(TrendingUp, { key: 'icon', className: "mr-2" }),
                    language === 'he' ? 'מחשבון FIRE' : 'FIRE Calculator'
                ]),
                React.createElement('p', {
                    key: 'description',
                    className: "text-gray-600 mb-4"
                }, language === 'he' ? 
                    'עצמאות פיננסית ופרישה מוקדמת - חישוב הסכום הדרוש להשגת עצמאות פיננסית מלאה' :
                    'Financial Independence, Retire Early - Calculate the amount needed to achieve complete financial independence'
                )
            ]),

            // FIRE Settings
            React.createElement('div', { 
                key: 'settings',
                className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in" 
            }, [
                React.createElement('h3', { 
                    key: 'title',
                    className: "text-xl font-bold text-orange-700 mb-4 flex items-center" 
                }, [
                    React.createElement(Target, { key: 'icon', className: "mr-2" }),
                    language === 'he' ? 'הגדרות FIRE' : 'FIRE Settings'
                ]),
                React.createElement('div', { 
                    key: 'content',
                    className: "grid grid-cols-2 gap-4" 
                }, [
                    React.createElement('div', { key: 'target-age' }, [
                        React.createElement('label', { 
                            className: "block text-sm font-medium text-gray-700 mb-1" 
                        }, language === 'he' ? 'גיל יעד לעצמאות פיננסית' : 'Target Age for Financial Independence'),
                        React.createElement('input', {
                            type: 'number',
                            value: inputs.fireTargetAge || 50,
                            onChange: (e) => setInputs({...inputs, fireTargetAge: parseInt(e.target.value) || 0}),
                            className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        })
                    ]),
                    React.createElement('div', { key: 'monthly-expenses' }, [
                        React.createElement('label', { 
                            className: "block text-sm font-medium text-gray-700 mb-1" 
                        }, language === 'he' ? 'הוצאות חודשיות צפויות (₪)' : 'Expected Monthly Expenses (₪)'),
                        React.createElement('input', {
                            type: 'number',
                            value: inputs.fireMonthlyExpenses || 12000,
                            onChange: (e) => setInputs({...inputs, fireMonthlyExpenses: parseInt(e.target.value) || 0}),
                            className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        })
                    ]),
                    React.createElement('div', { key: 'withdrawal-rate' }, [
                        React.createElement('label', { 
                            className: "block text-sm font-medium text-gray-700 mb-1" 
                        }, language === 'he' ? 'שיעור משיכה בטוח (%)' : 'Safe Withdrawal Rate (%)'),
                        React.createElement('input', {
                            type: 'number',
                            step: '0.1',
                            value: inputs.fireSafeWithdrawlRate || 4.0,
                            onChange: (e) => setInputs({...inputs, fireSafeWithdrawlRate: parseFloat(e.target.value) || 0}),
                            className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        })
                    ])
                ])
            ]),

            // FIRE Results
            React.createElement('div', { 
                key: 'results',
                className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in" 
            }, [
                React.createElement('h3', { 
                    key: 'title',
                    className: "text-xl font-bold text-green-700 mb-4 flex items-center" 
                }, [
                    React.createElement(Calculator, { key: 'icon', className: "mr-2" }),
                    language === 'he' ? 'תוצאות FIRE' : 'FIRE Results'
                ]),
                React.createElement('div', { 
                    key: 'content',
                    className: "grid grid-cols-2 gap-6" 
                }, [
                    // Current Status
                    React.createElement('div', { key: 'current-status', className: "space-y-4" }, [
                        React.createElement('div', { className: "bg-blue-50 rounded-lg p-4" }, [
                            React.createElement('div', { className: "text-2xl font-bold text-blue-700 currency-format" }, 
                                formatCurrency(fireMetrics.currentNetWorth)),
                            React.createElement('div', { className: "text-sm text-gray-600" }, 
                                language === 'he' ? 'שווי נטו נוכחי' : 'Current Net Worth'),
                            fireMetrics.totalDebts > 0 && React.createElement('div', { className: "text-xs text-red-600 mt-1" }, 
                                `${language === 'he' ? 'חובות:' : 'Debts:'} ${formatCurrency(fireMetrics.totalDebts)}`)
                        ]),
                        React.createElement('div', { className: "bg-green-50 rounded-lg p-4" }, [
                            React.createElement('div', { className: "text-lg font-bold text-green-700 currency-format" }, 
                                formatCurrency(fireMetrics.netMonthlySavings)),
                            React.createElement('div', { className: "text-sm text-gray-600" }, 
                                language === 'he' ? 'חיסכון נטו חודשי' : 'Net Monthly Savings'),
                            fireMetrics.totalMonthlyDebtPayments > 0 && React.createElement('div', { className: "text-xs text-red-600 mt-1" }, 
                                `${language === 'he' ? 'תשלומי חובות:' : 'Debt payments:'} ${formatCurrency(fireMetrics.totalMonthlyDebtPayments)}`)
                        ])
                    ]),
                    
                    // FIRE Target
                    React.createElement('div', { key: 'fire-target', className: "space-y-4" }, [
                        React.createElement('div', { className: "bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-4 border border-orange-200" }, [
                            React.createElement('div', { className: "text-center" }, [
                                React.createElement('div', { className: "text-3xl font-bold text-orange-700 currency-format" }, 
                                    formatCurrency(fireMetrics.fireTarget)),
                                React.createElement('div', { className: "text-sm text-gray-600" }, 
                                    language === 'he' ? 'יעד FIRE' : 'FIRE Target'),
                                React.createElement('div', { className: "text-xs text-gray-500 mt-2" }, 
                                    `${language === 'he' ? 'מבוסס על' : 'Based on'} ${inputs.fireSafeWithdrawlRate || 4}% ${language === 'he' ? 'שיעור משיכה' : 'withdrawal rate'}`)
                            ])
                        ]),
                        React.createElement('div', { className: "bg-purple-50 rounded-lg p-4" }, [
                            React.createElement('div', { className: "text-lg font-bold text-purple-700" }, 
                                fireMetrics.yearsToFire === Infinity ? 
                                    (language === 'he' ? '∞ שנים' : '∞ Years') :
                                    `${fireMetrics.yearsToFire.toFixed(1)} ${language === 'he' ? 'שנים' : 'Years'}`),
                            React.createElement('div', { className: "text-sm text-gray-600" }, 
                                language === 'he' ? 'שנים עד עצמאות פיננסית' : 'Years to Financial Independence'),
                            fireMetrics.yearsToFire !== Infinity && React.createElement('div', { className: "text-xs text-purple-600 mt-1" }, 
                                `${language === 'he' ? 'גיל FIRE צפוי:' : 'Expected FIRE age:'} ${fireMetrics.fireAge.toFixed(0)}`)
                        ])
                    ])
                ])
            ]),

            // Debt Management Section
            React.createElement('div', { 
                key: 'debt-management',
                className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in" 
            }, [
                React.createElement('h3', { 
                    key: 'title',
                    className: "text-xl font-bold text-red-700 mb-4 flex items-center" 
                }, [
                    React.createElement(DollarSign, { key: 'icon', className: "mr-2" }),
                    language === 'he' ? 'ניהול חובות' : 'Debt Management'
                ]),
                React.createElement('p', {
                    key: 'description',
                    className: "text-gray-600 mb-4 text-sm"
                }, language === 'he' ? 
                    'חובות משפיעים על יעד ה-FIRE שלך. נהל את החובות שלך לשיפור המסלול לעצמאות פיננסית.' :
                    'Debts affect your FIRE target. Manage your debts to improve your path to financial independence.'
                ),
                React.createElement('div', { 
                    key: 'content',
                    className: "grid grid-cols-2 gap-4" 
                }, [
                    React.createElement('div', { key: 'mortgage' }, [
                        React.createElement('h4', { className: "font-semibold text-gray-800 mb-2" }, 
                            language === 'he' ? 'משכנתא' : 'Mortgage'),
                        React.createElement('div', { className: "space-y-2" }, [
                            React.createElement('input', {
                                type: 'number',
                                placeholder: language === 'he' ? 'יתרת משכנתא (₪)' : 'Mortgage Balance (₪)',
                                value: inputs.mortgageBalance || '',
                                onChange: (e) => setInputs({...inputs, mortgageBalance: parseInt(e.target.value) || 0}),
                                className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                            }),
                            React.createElement('input', {
                                type: 'number',
                                placeholder: language === 'he' ? 'תשלום חודשי (₪)' : 'Monthly Payment (₪)',
                                value: inputs.mortgageMonthlyPayment || '',
                                onChange: (e) => setInputs({...inputs, mortgageMonthlyPayment: parseInt(e.target.value) || 0}),
                                className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                            })
                        ])
                    ]),
                    React.createElement('div', { key: 'personal-loans' }, [
                        React.createElement('h4', { className: "font-semibold text-gray-800 mb-2" }, 
                            language === 'he' ? 'הלוואות אישיות' : 'Personal Loans'),
                        React.createElement('div', { className: "space-y-2" }, [
                            React.createElement('input', {
                                type: 'number',
                                placeholder: language === 'he' ? 'יתרת הלוואות (₪)' : 'Loan Balance (₪)',
                                value: inputs.personalLoans || '',
                                onChange: (e) => setInputs({...inputs, personalLoans: parseInt(e.target.value) || 0}),
                                className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                            }),
                            React.createElement('input', {
                                type: 'number',
                                placeholder: language === 'he' ? 'תשלום חודשי (₪)' : 'Monthly Payment (₪)',
                                value: inputs.personalLoansMonthly || '',
                                onChange: (e) => setInputs({...inputs, personalLoansMonthly: parseInt(e.target.value) || 0}),
                                className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                            })
                        ])
                    ]),
                    React.createElement('div', { key: 'credit-card' }, [
                        React.createElement('h4', { className: "font-semibold text-gray-800 mb-2" }, 
                            language === 'he' ? 'חובות כרטיסי אשראי' : 'Credit Card Debt'),
                        React.createElement('div', { className: "space-y-2" }, [
                            React.createElement('input', {
                                type: 'number',
                                placeholder: language === 'he' ? 'יתרת כרטיסי אשראי (₪)' : 'Credit Card Balance (₪)',
                                value: inputs.creditCardDebt || '',
                                onChange: (e) => setInputs({...inputs, creditCardDebt: parseInt(e.target.value) || 0}),
                                className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                            }),
                            React.createElement('input', {
                                type: 'number',
                                placeholder: language === 'he' ? 'תשלום חודשי (₪)' : 'Monthly Payment (₪)',
                                value: inputs.creditCardMonthly || '',
                                onChange: (e) => setInputs({...inputs, creditCardMonthly: parseInt(e.target.value) || 0}),
                                className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                            })
                        ])
                    ]),
                    React.createElement('div', { key: 'other-debts' }, [
                        React.createElement('h4', { className: "font-semibold text-gray-800 mb-2" }, 
                            language === 'he' ? 'חובות אחרים' : 'Other Debts'),
                        React.createElement('div', { className: "space-y-2" }, [
                            React.createElement('input', {
                                type: 'number',
                                placeholder: language === 'he' ? 'יתרת חובות אחרים (₪)' : 'Other Debt Balance (₪)',
                                value: inputs.otherDebts || '',
                                onChange: (e) => setInputs({...inputs, otherDebts: parseInt(e.target.value) || 0}),
                                className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                            }),
                            React.createElement('input', {
                                type: 'number',
                                placeholder: language === 'he' ? 'תשלום חודשי (₪)' : 'Monthly Payment (₪)',
                                value: inputs.otherDebtsMonthly || '',
                                onChange: (e) => setInputs({...inputs, otherDebtsMonthly: parseInt(e.target.value) || 0}),
                                className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                            })
                        ])
                    ])
                ])
            ])
        ]);
    };

    // Export to global window object
    window.FireCalculator = FireCalculator;
    
    console.log('✅ FIRE Calculator module loaded successfully');

})();