// Debt Payoff Timeline Panel - Interactive debt analysis and payoff visualization
// Created by Yali Pollak (יהלי פולק) - v6.6.5

(function() {
    'use strict';

    const DebtPayoffTimelinePanel = ({ inputs, language = 'en', workingCurrency = 'ILS' }) => {
        const { createElement } = React;

        // Multi-language content
        const content = {
            en: {
                title: 'Debt Payoff Timeline',
                subtitle: 'Strategic debt elimination plan with payoff schedules',
                
                // Overview
                debtSummary: 'Debt Summary',
                totalDebt: 'Total Debt',
                monthlyPayments: 'Monthly Payments',
                debtToIncomeRatio: 'Debt-to-Income Ratio',
                payoffTime: 'Estimated Payoff Time',
                
                // Strategy comparison
                payoffStrategies: 'Payoff Strategies',
                avalancheStrategy: 'Debt Avalanche',
                snowballStrategy: 'Debt Snowball',
                avalancheDesc: 'Pay highest interest rate first (saves money)',
                snowballDesc: 'Pay lowest balance first (builds momentum)',
                interestSavings: 'Interest Savings',
                timeDifference: 'Time Difference',
                recommended: 'Recommended',
                
                // Timeline details
                timelineDetails: 'Payoff Timeline Details',
                debt: 'Debt',
                balance: 'Balance',
                rate: 'Interest Rate',
                payment: 'Monthly Payment',
                payoffIn: 'Payoff In',
                totalInterest: 'Total Interest',
                
                // Consolidation
                consolidationAnalysis: 'Debt Consolidation Analysis',
                currentScenario: 'Current Scenario',
                consolidatedScenario: 'Consolidated Scenario',
                potentialSavings: 'Potential Savings',
                consolidationFee: 'Consolidation Fee',
                
                // Risk levels
                excellent: 'Excellent',
                good: 'Good',
                moderate: 'Moderate Risk',
                high: 'High Risk',
                critical: 'Critical',
                
                // Actions
                addExtraPayment: 'Add Extra Payment',
                simulatePayoff: 'Simulate Payoff',
                exportPlan: 'Export Plan',
                
                // Timeline labels
                year: 'Year',
                years: 'Years',
                month: 'Month',
                months: 'Months',
                remainingBalance: 'Remaining Balance',
                principalPaid: 'Principal Paid',
                interestPaid: 'Interest Paid'
            },
            he: {
                title: 'לוח זמנים לפירעון חובות',
                subtitle: 'תכנית אסטרטגית לביטול חובות עם לוחות פירעון',
                
                // Overview
                debtSummary: 'סיכום חובות',
                totalDebt: 'סה״כ חובות',
                monthlyPayments: 'תשלומים חודשיים',
                debtToIncomeRatio: 'יחס חוב להכנסה',
                payoffTime: 'זמן פירעון משוער',
                
                // Strategy comparison
                payoffStrategies: 'אסטרטגיות פירעון',
                avalancheStrategy: 'מפולת חובות',
                snowballStrategy: 'כדור שלג',
                avalancheDesc: 'שלם ריבית גבוהה ראשון (חוסך כסף)',
                snowballDesc: 'שלם יתרה נמוכה ראשון (בונה מומנטום)',
                interestSavings: 'חיסכון בריביות',
                timeDifference: 'הפרש זמן',
                recommended: 'מומלץ',
                
                // Timeline details
                timelineDetails: 'פרטי לוח זמנים לפירעון',
                debt: 'חוב',
                balance: 'יתרה',
                rate: 'ריבית',
                payment: 'תשלום חודשי',
                payoffIn: 'פירעון תוך',
                totalInterest: 'סה״כ ריבית',
                
                // Consolidation
                consolidationAnalysis: 'ניתוח איחוד חובות',
                currentScenario: 'מצב נוכחי',
                consolidatedScenario: 'מצב מאוחד',
                potentialSavings: 'חיסכון פוטנציאלי',
                consolidationFee: 'עמלת איחוד',
                
                // Risk levels
                excellent: 'מצוין',
                good: 'טוב',
                moderate: 'סיכון בינוני',
                high: 'סיכון גבוה',
                critical: 'קריטי',
                
                // Actions
                addExtraPayment: 'הוסף תשלום נוסף',
                simulatePayoff: 'סימולציה של פירעון',
                exportPlan: 'ייצא תכנית',
                
                // Timeline labels
                year: 'שנה',
                years: 'שנים',
                month: 'חודש',
                months: 'חודשים',
                remainingBalance: 'יתרה נותרת',
                principalPaid: 'קרן ששולמה',
                interestPaid: 'ריבית ששולמה'
            }
        };

        const t = content[language] || content.en;

        // Get comprehensive debt analysis
        const debtAnalysis = window.analyzeAllDebts ? window.analyzeAllDebts(inputs) : { debts: [] };
        
        if (!debtAnalysis.debts || debtAnalysis.debts.length === 0) {
            return createElement('div', {
                className: "bg-green-50 rounded-xl p-6 border border-green-200 text-center"
            }, [
                createElement('div', { key: 'icon', className: "text-4xl mb-3" }, '🎉'),
                createElement('h3', { 
                    key: 'title', 
                    className: "text-xl font-semibold text-green-800 mb-2" 
                }, language === 'he' ? 'אין חובות!' : 'No Debts!'),
                createElement('p', { 
                    key: 'message', 
                    className: "text-green-700" 
                }, language === 'he' ? 
                    'מעולה! אין לך חובות צרכניים להצגה.' : 
                    'Excellent! You have no consumer debts to display.')
            ]);
        }

        const formatCurrency = (amount) => {
            if (window.formatCurrency) {
                return window.formatCurrency(amount, workingCurrency);
            }
            return `${workingCurrency} ${amount.toLocaleString()}`;
        };

        const formatTime = (months) => {
            const years = Math.floor(months / 12);
            const remainingMonths = months % 12;
            
            if (years === 0) {
                return `${remainingMonths} ${remainingMonths === 1 ? t.month : t.months}`;
            } else if (remainingMonths === 0) {
                return `${years} ${years === 1 ? t.year : t.years}`;
            } else {
                return `${years} ${years === 1 ? t.year : t.years}, ${remainingMonths} ${remainingMonths === 1 ? t.month : t.months}`;
            }
        };

        const getRiskColor = (riskLevel) => {
            switch (riskLevel) {
                case 'excellent': return 'green';
                case 'low': return 'blue';
                case 'moderate': return 'yellow';
                case 'high': return 'orange';
                case 'critical': return 'red';
                default: return 'gray';
            }
        };

        const getRiskLabel = (riskLevel) => {
            return t[riskLevel] || riskLevel;
        };

        // Calculate totals
        const totalDebt = debtAnalysis.debts.reduce((sum, debt) => sum + (parseFloat(debt.balance) || 0), 0);
        const totalMonthlyPayments = debtAnalysis.debts.reduce((sum, debt) => sum + (parseFloat(debt.monthlyPayment) || 0), 0);
        const totalInterest = debtAnalysis.payoffTimelines.reduce((sum, timeline) => 
            sum + (timeline.timeline?.financial?.totalInterestPaid || 0), 0);

        return createElement('div', {
            className: "debt-payoff-timeline-panel space-y-6"
        }, [
            // Header
            createElement('div', {
                key: 'header',
                className: 'text-center mb-6'
            }, [
                createElement('h3', {
                    key: 'title',
                    className: 'text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3'
                }, [
                    createElement('span', { key: 'icon' }, '💳'),
                    t.title
                ]),
                createElement('p', {
                    key: 'subtitle',
                    className: 'text-gray-600'
                }, t.subtitle)
            ]),

            // Debt Summary Overview
            createElement('div', {
                key: 'debt-summary',
                className: "bg-white rounded-xl p-6 border border-gray-200"
            }, [
                createElement('h4', {
                    key: 'summary-title',
                    className: "text-lg font-semibold text-gray-800 mb-4"
                }, t.debtSummary),

                createElement('div', {
                    key: 'summary-grid',
                    className: "grid grid-cols-2 md:grid-cols-4 gap-4"
                }, [
                    createElement('div', {
                        key: 'total-debt',
                        className: "p-3 bg-red-50 rounded-lg text-center"
                    }, [
                        createElement('div', { 
                            key: 'debt-value', 
                            className: "text-2xl font-bold text-red-600" 
                        }, formatCurrency(totalDebt)),
                        createElement('div', { 
                            key: 'debt-label', 
                            className: "text-sm text-red-700" 
                        }, t.totalDebt)
                    ]),

                    createElement('div', {
                        key: 'monthly-payments',
                        className: "p-3 bg-orange-50 rounded-lg text-center"
                    }, [
                        createElement('div', { 
                            key: 'payment-value', 
                            className: "text-2xl font-bold text-orange-600" 
                        }, formatCurrency(totalMonthlyPayments)),
                        createElement('div', { 
                            key: 'payment-label', 
                            className: "text-sm text-orange-700" 
                        }, t.monthlyPayments)
                    ]),

                    debtAnalysis.debtToIncomeRatio?.isValid && createElement('div', {
                        key: 'debt-ratio',
                        className: `p-3 bg-${getRiskColor(debtAnalysis.debtToIncomeRatio.riskLevel)}-50 rounded-lg text-center`
                    }, [
                        createElement('div', { 
                            key: 'ratio-value', 
                            className: `text-2xl font-bold text-${getRiskColor(debtAnalysis.debtToIncomeRatio.riskLevel)}-600` 
                        }, `${debtAnalysis.debtToIncomeRatio.percentage.toFixed(1)}%`),
                        createElement('div', { 
                            key: 'ratio-label', 
                            className: `text-sm text-${getRiskColor(debtAnalysis.debtToIncomeRatio.riskLevel)}-700` 
                        }, t.debtToIncomeRatio)
                    ]),

                    createElement('div', {
                        key: 'total-interest',
                        className: "p-3 bg-purple-50 rounded-lg text-center"
                    }, [
                        createElement('div', { 
                            key: 'interest-value', 
                            className: "text-2xl font-bold text-purple-600" 
                        }, formatCurrency(totalInterest)),
                        createElement('div', { 
                            key: 'interest-label', 
                            className: "text-sm text-purple-700" 
                        }, t.totalInterest)
                    ])
                ])
            ]),

            // Individual Debt Timeline Details
            createElement('div', {
                key: 'timeline-details',
                className: "bg-white rounded-xl p-6 border border-gray-200"
            }, [
                createElement('h4', {
                    key: 'details-title',
                    className: "text-lg font-semibold text-gray-800 mb-4"
                }, t.timelineDetails),

                createElement('div', {
                    key: 'debt-cards',
                    className: "space-y-4"
                }, debtAnalysis.payoffTimelines.map((debt, index) => {
                    const timeline = debt.timeline;
                    if (!timeline.isValid) return null;

                    return createElement('div', {
                        key: `debt-${index}`,
                        className: "p-4 border border-gray-200 rounded-lg"
                    }, [
                        createElement('div', {
                            key: 'debt-header',
                            className: "flex justify-between items-start mb-3"
                        }, [
                            createElement('div', { key: 'debt-info' }, [
                                createElement('h5', {
                                    key: 'debt-name',
                                    className: "font-semibold text-gray-800"
                                }, debt.name),
                                createElement('div', {
                                    key: 'debt-details',
                                    className: "text-sm text-gray-600 mt-1"
                                }, `${formatCurrency(debt.balance)} at ${debt.interestRate}%`)
                            ]),
                            createElement('div', {
                                key: 'payoff-time',
                                className: "text-right"
                            }, [
                                createElement('div', {
                                    key: 'time-value',
                                    className: "font-semibold text-blue-600"
                                }, formatTime(timeline.payoffTime.totalMonths)),
                                createElement('div', {
                                    key: 'time-label',
                                    className: "text-xs text-gray-500"
                                }, t.payoffIn)
                            ])
                        ]),

                        createElement('div', {
                            key: 'progress-bar',
                            className: "w-full bg-gray-200 rounded-full h-2 mb-3"
                        }, [
                            createElement('div', {
                                key: 'progress-fill',
                                className: "bg-blue-600 h-2 rounded-full transition-all",
                                style: { 
                                    width: `${Math.min(100, (debt.monthlyPayment / debt.balance) * 100 * 12)}%` 
                                }
                            })
                        ]),

                        createElement('div', {
                            key: 'debt-metrics',
                            className: "grid grid-cols-3 gap-4 text-sm"
                        }, [
                            createElement('div', { key: 'payment-info', className: "text-center" }, [
                                createElement('div', { 
                                    key: 'payment-amount', 
                                    className: "font-semibold text-gray-800" 
                                }, formatCurrency(debt.monthlyPayment)),
                                createElement('div', { 
                                    key: 'payment-label-text', 
                                    className: "text-gray-600" 
                                }, t.payment)
                            ]),
                            createElement('div', { key: 'interest-info', className: "text-center" }, [
                                createElement('div', { 
                                    key: 'interest-amount', 
                                    className: "font-semibold text-red-600" 
                                }, formatCurrency(timeline.financial.totalInterestPaid)),
                                createElement('div', { 
                                    key: 'interest-label-text', 
                                    className: "text-gray-600" 
                                }, t.totalInterest)
                            ]),
                            createElement('div', { key: 'total-info', className: "text-center" }, [
                                createElement('div', { 
                                    key: 'total-amount', 
                                    className: "font-semibold text-purple-600" 
                                }, formatCurrency(timeline.financial.totalAmountPaid)),
                                createElement('div', { 
                                    key: 'total-label', 
                                    className: "text-gray-600" 
                                }, language === 'he' ? 'סה״כ תשלום' : 'Total Paid')
                            ])
                        ])
                    ]);
                }).filter(Boolean))
            ]),

            // Payoff Strategies Comparison
            debtAnalysis.strategies && createElement('div', {
                key: 'strategies',
                className: "bg-white rounded-xl p-6 border border-gray-200"
            }, [
                createElement('h4', {
                    key: 'strategies-title',
                    className: "text-lg font-semibold text-gray-800 mb-4"
                }, t.payoffStrategies),

                createElement('div', {
                    key: 'strategy-comparison',
                    className: "grid grid-cols-1 md:grid-cols-2 gap-6"
                }, [
                    // Debt Avalanche
                    createElement('div', {
                        key: 'avalanche',
                        className: "p-4 border border-blue-200 rounded-lg"
                    }, [
                        createElement('h5', {
                            key: 'avalanche-title',
                            className: "font-semibold text-blue-800 mb-2"
                        }, t.avalancheStrategy),
                        createElement('p', {
                            key: 'avalanche-desc',
                            className: "text-sm text-blue-600 mb-3"
                        }, t.avalancheDesc),
                        createElement('div', {
                            key: 'avalanche-metrics',
                            className: "space-y-2 text-sm"
                        }, [
                            createElement('div', { key: 'avalanche-interest' }, [
                                createElement('span', { className: "font-medium" }, `${t.totalInterest}: `),
                                createElement('span', { className: "text-blue-700" }, 
                                    formatCurrency(debtAnalysis.strategies.avalanche.results.totalInterestPaid))
                            ]),
                            createElement('div', { key: 'avalanche-time' }, [
                                createElement('span', { className: "font-medium" }, `${t.payoffTime}: `),
                                createElement('span', { className: "text-blue-700" }, 
                                    formatTime(debtAnalysis.strategies.avalanche.results.totalPayoffTime))
                            ])
                        ])
                    ]),

                    // Debt Snowball
                    createElement('div', {
                        key: 'snowball',
                        className: "p-4 border border-green-200 rounded-lg"
                    }, [
                        createElement('h5', {
                            key: 'snowball-title',
                            className: "font-semibold text-green-800 mb-2"
                        }, t.snowballStrategy),
                        createElement('p', {
                            key: 'snowball-desc',
                            className: "text-sm text-green-600 mb-3"
                        }, t.snowballDesc),
                        createElement('div', {
                            key: 'snowball-metrics',
                            className: "space-y-2 text-sm"
                        }, [
                            createElement('div', { key: 'snowball-interest' }, [
                                createElement('span', { className: "font-medium" }, `${t.totalInterest}: `),
                                createElement('span', { className: "text-green-700" }, 
                                    formatCurrency(debtAnalysis.strategies.snowball.results.totalInterestPaid))
                            ]),
                            createElement('div', { key: 'snowball-time' }, [
                                createElement('span', { className: "font-medium" }, `${t.payoffTime}: `),
                                createElement('span', { className: "text-green-700" }, 
                                    formatTime(debtAnalysis.strategies.snowball.results.totalPayoffTime))
                            ])
                        ])
                    ])
                ]),

                // Strategy Recommendation
                debtAnalysis.strategies.comparison && createElement('div', {
                    key: 'recommendation',
                    className: `mt-4 p-4 bg-${debtAnalysis.strategies.comparison.recommendedStrategy === 'avalanche' ? 'blue' : 'green'}-50 rounded-lg border border-${debtAnalysis.strategies.comparison.recommendedStrategy === 'avalanche' ? 'blue' : 'green'}-200`
                }, [
                    createElement('h5', {
                        key: 'rec-title',
                        className: `font-semibold text-${debtAnalysis.strategies.comparison.recommendedStrategy === 'avalanche' ? 'blue' : 'green'}-800 mb-2`
                    }, `${t.recommended}: ${debtAnalysis.strategies.comparison.recommendedStrategy === 'avalanche' ? t.avalancheStrategy : t.snowballStrategy}`),
                    createElement('div', {
                        key: 'rec-details',
                        className: `text-sm text-${debtAnalysis.strategies.comparison.recommendedStrategy === 'avalanche' ? 'blue' : 'green'}-700`
                    }, [
                        createElement('div', { key: 'savings' }, 
                            `${t.interestSavings}: ${formatCurrency(Math.abs(debtAnalysis.strategies.comparison.interestSavings))}`),
                        createElement('div', { key: 'time' }, 
                            `${t.timeDifference}: ${formatTime(Math.abs(debtAnalysis.strategies.comparison.timeDifference))}`)
                    ])
                ])
            ]),

            // Debt Consolidation Analysis
            debtAnalysis.consolidationAnalysis && createElement('div', {
                key: 'consolidation',
                className: "bg-white rounded-xl p-6 border border-gray-200"
            }, [
                createElement('h4', {
                    key: 'consolidation-title',
                    className: "text-lg font-semibold text-gray-800 mb-4"
                }, t.consolidationAnalysis),

                createElement('div', {
                    key: 'consolidation-grid',
                    className: "grid grid-cols-1 md:grid-cols-2 gap-6"
                }, [
                    createElement('div', {
                        key: 'current-scenario',
                        className: "p-4 bg-gray-50 rounded-lg"
                    }, [
                        createElement('h5', {
                            key: 'current-title',
                            className: "font-semibold text-gray-800 mb-3"
                        }, t.currentScenario),
                        createElement('div', {
                            key: 'current-details',
                            className: "space-y-2 text-sm"
                        }, [
                            createElement('div', { key: 'current-balance' }, [
                                createElement('span', { className: "font-medium" }, `${t.totalDebt}: `),
                                formatCurrency(debtAnalysis.consolidationAnalysis.current.totalBalance)
                            ]),
                            createElement('div', { key: 'current-rate' }, [
                                createElement('span', { className: "font-medium" }, `${t.rate}: `),
                                `${debtAnalysis.consolidationAnalysis.current.weightedInterestRate.toFixed(2)}%`
                            ]),
                            createElement('div', { key: 'current-interest' }, [
                                createElement('span', { className: "font-medium" }, `${t.totalInterest}: `),
                                formatCurrency(debtAnalysis.consolidationAnalysis.current.totalInterestPaid)
                            ])
                        ])
                    ]),

                    createElement('div', {
                        key: 'consolidated-scenario',
                        className: "p-4 bg-blue-50 rounded-lg"
                    }, [
                        createElement('h5', {
                            key: 'consolidated-title',
                            className: "font-semibold text-blue-800 mb-3"
                        }, t.consolidatedScenario),
                        createElement('div', {
                            key: 'consolidated-details',
                            className: "space-y-2 text-sm"
                        }, [
                            createElement('div', { key: 'consolidated-balance' }, [
                                createElement('span', { className: "font-medium" }, `${t.balance}: `),
                                formatCurrency(debtAnalysis.consolidationAnalysis.consolidated.balance)
                            ]),
                            createElement('div', { key: 'consolidated-rate' }, [
                                createElement('span', { className: "font-medium" }, `${t.rate}: `),
                                `${debtAnalysis.consolidationAnalysis.consolidated.interestRate.toFixed(2)}%`
                            ]),
                            debtAnalysis.consolidationAnalysis.consolidated.scenario.isValid && createElement('div', { key: 'consolidated-interest' }, [
                                createElement('span', { className: "font-medium" }, `${t.totalInterest}: `),
                                formatCurrency(debtAnalysis.consolidationAnalysis.consolidated.scenario.financial.totalInterestPaid)
                            ])
                        ])
                    ])
                ]),

                // Consolidation Recommendation
                createElement('div', {
                    key: 'consolidation-recommendation',
                    className: `mt-4 p-4 bg-${debtAnalysis.consolidationAnalysis.comparison.isConsolidationBetter ? 'green' : 'red'}-50 rounded-lg border border-${debtAnalysis.consolidationAnalysis.comparison.isConsolidationBetter ? 'green' : 'red'}-200`
                }, [
                    createElement('h5', {
                        key: 'rec-title',
                        className: `font-semibold text-${debtAnalysis.consolidationAnalysis.comparison.isConsolidationBetter ? 'green' : 'red'}-800 mb-2`
                    }, debtAnalysis.consolidationAnalysis.comparison.isConsolidationBetter ? 
                        (language === 'he' ? 'איחוד חובות מומלץ' : 'Debt Consolidation Recommended') :
                        (language === 'he' ? 'איחוד חובות לא מומלץ' : 'Debt Consolidation Not Recommended')),
                    createElement('div', {
                        key: 'savings-details',
                        className: `text-sm text-${debtAnalysis.consolidationAnalysis.comparison.isConsolidationBetter ? 'green' : 'red'}-700`
                    }, [
                        createElement('div', { key: 'interest-savings' }, 
                            `${t.interestSavings}: ${formatCurrency(debtAnalysis.consolidationAnalysis.comparison.interestSavings)}`),
                        createElement('div', { key: 'time-savings' }, 
                            `${t.timeDifference}: ${formatTime(Math.abs(debtAnalysis.consolidationAnalysis.comparison.timeSavings))}`)
                    ])
                ])
            ])
        ]);
    };

    // Export to window
    window.DebtPayoffTimelinePanel = DebtPayoffTimelinePanel;

    console.log('✅ Debt Payoff Timeline Panel component loaded successfully');
})();