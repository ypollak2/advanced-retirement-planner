// AdditionalIncomeTaxPanel.js - Additional Income Tax Analysis Component
// Extracted from WizardStepReview.js for better modularity

const AdditionalIncomeTaxPanel = ({ inputs, language = 'en', workingCurrency = 'ILS' }) => {
    const createElement = React.createElement;
    
    // State for view toggle (annual, monthly, both)
    const [viewMode, setViewMode] = React.useState('annual');
    
    // Multi-language content
    const content = {
        he: {
            additionalIncomeTax: 'ניתוח מס על הכנסה נוספת',
            noAdditionalIncome: 'לא הוגדרה הכנסה נוספת',
            totalGross: 'סה"כ ברוטו',
            totalTax: 'סה"כ מס',
            totalNet: 'סה"כ נטו',
            effectiveRate: 'שיעור מס אפקטיבי',
            marginalRate: 'שיעור מס שולי',
            monthlyNet: 'נטו חודשי',
            
            // Tooltip explanations
            effectiveRateTooltip: 'שיעור המס האפקטיבי = סך המס ÷ סך ההכנסה. זה הממוצע בפועל של המס ששולמת.',
            marginalRateTooltip: 'שיעור המס השולי הוא המס שתשלם על השקל הבא שתרוויח.',
            grossTooltip: 'סכום ההכנסה הנוספת לפני מס',
            taxTooltip: 'סכום המס שנגבה על ההכנסה הנוספת',
            netTooltip: 'סכום ההכנסה הנוספת אחרי מס - מה שבאמת נכנס לכיס',
            
            // View toggles
            viewToggle: 'תצוגה',
            monthlyView: 'חודשי',
            annualView: 'שנתי',
            dualView: 'כפול',
            
            // Income types
            bonusIncome: 'הכנסה מבונוס',
            otherIncome: 'הכנסה מפרילנס',
            
            // Details
            bonusGross: 'בונוס ברוטו',
            bonusTax: 'מס על בונוס',
            bonusNet: 'בונוס נטו',
            otherGross: 'אחר ברוטו',
            otherTax: 'מס אחר',
            otherNet: 'אחר נטו',
            
            // Tips
            taxOptimizationTip: 'טיפ: שקול לפזר הכנסה נוספת על פני מספר שנים להפחתת מס',
            pensionContributionAdvice: 'העלאת הפקדות לקרן פנסיה יכולה להפחית את המס על הכנסה נוספת',
            
            // Country-specific optimization
            countrySpecificOptimization: 'אופטימיזציה לפי מדינה',
            israelOptimization: 'אופטימיזציה ישראלית',
            ukOptimization: 'אופטימיזציה בריטית',
            usOptimization: 'אופטימיזציה אמריקאית'
        },
        en: {
            additionalIncomeTax: 'Additional Income Tax Analysis',
            noAdditionalIncome: 'No additional income defined',
            totalGross: 'Total Gross',
            totalTax: 'Total Tax',
            totalNet: 'Total Net',
            effectiveRate: 'Effective Tax Rate',
            marginalRate: 'Marginal Tax Rate',
            monthlyNet: 'Monthly Net',
            
            // Tooltip explanations
            effectiveRateTooltip: 'Effective Tax Rate = Total Tax ÷ Total Income. This is the actual average percentage of tax you pay.',
            marginalRateTooltip: 'Marginal Tax Rate is the tax rate you pay on your next dollar of income.',
            grossTooltip: 'Additional income amount before taxes are deducted',
            taxTooltip: 'Amount of tax charged on the additional income',
            netTooltip: 'Additional income amount after taxes - what actually goes into your pocket',
            
            // View toggles
            viewToggle: 'View',
            monthlyView: 'Monthly',
            annualView: 'Annual',
            dualView: 'Both',
            
            // Income types
            bonusIncome: 'Bonus Income',
            otherIncome: 'Freelance Income',
            
            // Details
            bonusGross: 'Bonus Gross',
            bonusTax: 'Bonus Tax',
            bonusNet: 'Bonus Net',
            otherGross: 'Other Gross',
            otherTax: 'Other Tax',
            otherNet: 'Other Net',
            
            // Tips
            taxOptimizationTip: 'Tip: Consider spreading additional income over multiple years to reduce tax burden',
            pensionContributionAdvice: 'Increasing pension contributions can reduce tax on additional income',
            
            // Country-specific optimization
            countrySpecificOptimization: 'Country-Specific Optimization',
            israelOptimization: 'Israeli Tax Optimization',
            ukOptimization: 'UK Tax Optimization',
            usOptimization: 'US Tax Optimization'
        }
    };
    
    const t = content[language] || content.en;
    
    // Check if additional income tax calculations are available
    if (!window.AdditionalIncomeTax || !window.TaxCalculators) {
        return null;
    }
    
    const additionalTaxInfo = window.AdditionalIncomeTax.calculateTotalAdditionalIncomeTax(inputs);
    
    // Return null if no additional income
    if (!additionalTaxInfo || additionalTaxInfo.totalAdditionalIncome === 0) {
        return null;
    }
    
    const monthlyResult = window.AdditionalIncomeTax.getMonthlyAfterTaxAdditionalIncome(inputs);
    
    // Get marginal tax rate
    const marginalRate = window.AdditionalIncomeTax.getMarginalTaxRate(
        (parseFloat(inputs.currentMonthlySalary) || 0) * 12 + additionalTaxInfo.totalAdditionalIncome,
        inputs.country || 'israel'
    );
    
    // Currency formatter
    const formatCurrency = (amount) => {
        const symbol = workingCurrency === 'ILS' ? '₪' : workingCurrency;
        return `${symbol}${Math.round(amount).toLocaleString()}`;
    };
    
    // Tooltip component for explanations
    const InfoTooltip = ({ text, children }) => {
        const [showTooltip, setShowTooltip] = React.useState(false);
        
        return createElement('div', {
            className: 'relative inline-block',
            onMouseEnter: () => setShowTooltip(true),
            onMouseLeave: () => setShowTooltip(false)
        }, [
            children,
            showTooltip && createElement('div', {
                key: 'tooltip',
                className: 'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10 w-64 text-center'
            }, [
                createElement('div', {
                    key: 'text',
                    className: 'whitespace-normal'
                }, text),
                createElement('div', {
                    key: 'arrow',
                    className: 'absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800'
                })
            ])
        ]);
    };
    
    // Tax burden progress bar component
    const TaxProgressBar = ({ rate, label, maxRate = 50 }) => {
        const percentage = Math.min((rate / maxRate) * 100, 100);
        const getColor = (rate) => {
            if (rate <= 15) return 'green';
            if (rate <= 25) return 'yellow';
            if (rate <= 35) return 'orange';
            return 'red';
        };
        const color = getColor(rate);
        
        return createElement('div', {
            className: 'w-full'
        }, [
            createElement('div', {
                key: 'label-row',
                className: 'flex justify-between items-center mb-1'
            }, [
                createElement('span', {
                    key: 'label',
                    className: 'text-xs text-gray-600'
                }, label),
                createElement('span', {
                    key: 'rate',
                    className: `text-xs font-medium text-${color}-600`
                }, `${rate.toFixed(1)}%`)
            ]),
            createElement('div', {
                key: 'progress-bg',
                className: 'w-full bg-gray-200 rounded-full h-2'
            }, [
                createElement('div', {
                    key: 'progress-fill',
                    className: `bg-${color}-500 h-2 rounded-full transition-all duration-300`,
                    style: { width: `${percentage}%` }
                })
            ])
        ]);
    };
    
    return createElement('div', {
        className: "bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200 mb-6"
    }, [
        // Header
        createElement('h3', {
            key: 'tax-breakdown-title',
            className: "text-xl font-semibold text-purple-800 mb-4 flex items-center"
        }, [
            createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '📊'),
            t.additionalIncomeTax
        ]),
        
        // View Toggle
        createElement('div', {
            key: 'view-toggle',
            className: "flex justify-center mb-6"
        }, [
            createElement('div', {
                key: 'toggle-container',
                className: "bg-white border border-purple-200 rounded-lg p-1 flex"
            }, [
                ['annual', 'monthly', 'both'].map((mode, index) => 
                    createElement('button', {
                        key: `${mode}-${index}`,
                        onClick: () => setViewMode(mode),
                        className: `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            viewMode === mode 
                                ? 'bg-purple-600 text-white' 
                                : 'text-purple-600 hover:bg-purple-50'
                        }`
                    }, t[`${mode}View`])
                )
            ])
        ]),
        
        // Summary totals
        createElement('div', {
            key: 'tax-summary', 
            className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        }, [
            createElement('div', {
                key: 'total-gross', 
                className: "text-center p-3 bg-white rounded-lg border border-purple-100"
            }, [
                createElement(InfoTooltip, {
                    key: 'gross-tooltip',
                    text: t.grossTooltip
                }, createElement('div', {
                    className: "text-sm text-gray-600 mb-1 cursor-help"
                }, `${t.totalGross} ℹ️`)),
                viewMode === 'annual' && createElement('div', {
                    key: 'annual-value',
                    className: "text-lg font-bold text-purple-700"
                }, formatCurrency(additionalTaxInfo.totalAdditionalIncome)),
                viewMode === 'monthly' && createElement('div', {
                    key: 'monthly-value',
                    className: "text-lg font-bold text-purple-700"
                }, formatCurrency(additionalTaxInfo.totalAdditionalIncome / 12)),
                viewMode === 'both' && [
                    createElement('div', {
                        key: 'annual-both',
                        className: "text-sm font-bold text-purple-700"
                    }, `Annual: ${formatCurrency(additionalTaxInfo.totalAdditionalIncome)}`),
                    createElement('div', {
                        key: 'monthly-both',
                        className: "text-sm font-bold text-purple-500"
                    }, `Monthly: ${formatCurrency(additionalTaxInfo.totalAdditionalIncome / 12)}`)
                ]
            ]),
            
            createElement('div', {
                key: 'total-tax',
                className: "text-center p-3 bg-white rounded-lg border border-purple-100"
            }, [
                createElement(InfoTooltip, {
                    key: 'tax-tooltip',
                    text: t.taxTooltip
                }, createElement('div', {
                    className: "text-sm text-gray-600 mb-1 cursor-help"
                }, `${t.totalTax} ℹ️`)),
                viewMode === 'annual' && createElement('div', {
                    key: 'annual-tax',
                    className: "text-lg font-bold text-red-600"
                }, formatCurrency(additionalTaxInfo.totalAdditionalTax)),
                viewMode === 'monthly' && createElement('div', {
                    key: 'monthly-tax',
                    className: "text-lg font-bold text-red-600"
                }, formatCurrency(additionalTaxInfo.totalAdditionalTax / 12)),
                viewMode === 'both' && [
                    createElement('div', {
                        key: 'annual-tax-both',
                        className: "text-sm font-bold text-red-600"
                    }, `Annual: ${formatCurrency(additionalTaxInfo.totalAdditionalTax)}`),
                    createElement('div', {
                        key: 'monthly-tax-both',
                        className: "text-sm font-bold text-red-500"
                    }, `Monthly: ${formatCurrency(additionalTaxInfo.totalAdditionalTax / 12)}`)
                ]
            ]),
            
            createElement('div', {
                key: 'total-net',
                className: "text-center p-3 bg-white rounded-lg border border-purple-100"
            }, [
                createElement(InfoTooltip, {
                    key: 'net-tooltip',
                    text: t.netTooltip
                }, createElement('div', {
                    className: "text-sm text-gray-600 mb-1 cursor-help"
                }, `${t.totalNet} ℹ️`)),
                viewMode === 'annual' && createElement('div', {
                    key: 'annual-net',
                    className: "text-lg font-bold text-green-600"
                }, formatCurrency(additionalTaxInfo.totalAdditionalIncome - additionalTaxInfo.totalAdditionalTax)),
                viewMode === 'monthly' && createElement('div', {
                    key: 'monthly-net',
                    className: "text-lg font-bold text-green-600"
                }, formatCurrency((additionalTaxInfo.totalAdditionalIncome - additionalTaxInfo.totalAdditionalTax) / 12)),
                viewMode === 'both' && [
                    createElement('div', {
                        key: 'annual-net-both',
                        className: "text-sm font-bold text-green-600"
                    }, `Annual: ${formatCurrency(additionalTaxInfo.totalAdditionalIncome - additionalTaxInfo.totalAdditionalTax)}`),
                    createElement('div', {
                        key: 'monthly-net-both',
                        className: "text-sm font-bold text-green-500"
                    }, `Monthly: ${formatCurrency((additionalTaxInfo.totalAdditionalIncome - additionalTaxInfo.totalAdditionalTax) / 12)}`)
                ]
            ]),
            
            createElement('div', {
                key: 'effective-rate',
                className: "text-center p-3 bg-white rounded-lg border border-purple-100"
            }, [
                createElement(InfoTooltip, {
                    key: 'effective-tooltip',
                    text: t.effectiveRateTooltip
                }, createElement('div', {
                    className: "text-sm text-gray-600 mb-2 cursor-help"
                }, `${t.effectiveRate} ℹ️`)),
                createElement('div', {
                    key: 'effective-value',
                    className: "text-lg font-bold text-orange-600 mb-2"
                }, `${additionalTaxInfo.effectiveRate.toFixed(1)}%`),
                createElement(TaxProgressBar, {
                    key: 'effective-progress',
                    rate: additionalTaxInfo.effectiveRate,
                    label: 'Tax Burden'
                }),
                createElement('div', {
                    key: 'marginal-comparison',
                    className: "text-xs text-gray-500 mt-2 flex items-center justify-center"
                }, [
                    createElement('span', { key: 'marginal-text' }, `${t.marginalRate}: `),
                    createElement('span', {
                        key: 'marginal-value',
                        className: `font-medium ${
                            marginalRate <= 20 ? 'text-green-600' : 
                            marginalRate <= 30 ? 'text-yellow-600' : 
                            marginalRate <= 40 ? 'text-orange-600' : 'text-red-600'
                        }`
                    }, `${marginalRate}%`)
                ])
            ])
        ]),
        
        // Monthly net income
        monthlyResult && monthlyResult.totalMonthlyNet > 0 && createElement('div', {
            key: 'monthly-net',
            className: "bg-green-100 rounded-lg p-4 mb-6 border border-green-200"
        }, [
            createElement('div', {
                key: 'monthly-label',
                className: "text-sm font-medium text-green-700 mb-2"
            }, t.monthlyNet),
            createElement('div', {
                key: 'monthly-value',
                className: "text-2xl font-bold text-green-800"
            }, formatCurrency(monthlyResult.totalMonthlyNet))
        ]),
        
        // Tax Burden Dashboard
        createElement('div', {
            key: 'tax-burden-dashboard',
            className: "bg-white rounded-lg p-4 border border-purple-100 mb-6"
        }, [
            createElement('h4', {
                key: 'dashboard-title',
                className: "font-semibold text-purple-700 mb-4 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-2 text-lg" }, '📊'),
                language === 'he' ? 'לוח בקרת נטל מס' : 'Tax Burden Dashboard'
            ]),
            
            createElement('div', {
                key: 'dashboard-content',
                className: "grid grid-cols-1 md:grid-cols-2 gap-6"
            }, [
                // Overall tax efficiency
                createElement('div', {
                    key: 'tax-efficiency',
                    className: "space-y-3"
                }, [
                    createElement('h5', {
                        key: 'efficiency-title',
                        className: "text-sm font-medium text-gray-700"
                    }, language === 'he' ? 'יעילות מס כוללת' : 'Overall Tax Efficiency'),
                    
                    createElement(TaxProgressBar, {
                        key: 'total-burden',
                        rate: additionalTaxInfo.effectiveRate,
                        label: language === 'he' ? 'נטל מס כולל' : 'Total Tax Burden'
                    }),
                    
                    createElement('div', {
                        key: 'efficiency-status',
                        className: `text-sm p-2 rounded ${
                            additionalTaxInfo.effectiveRate <= 20 ? 'bg-green-50 text-green-700' :
                            additionalTaxInfo.effectiveRate <= 30 ? 'bg-yellow-50 text-yellow-700' :
                            additionalTaxInfo.effectiveRate <= 40 ? 'bg-orange-50 text-orange-700' :
                            'bg-red-50 text-red-700'
                        }`
                    }, 
                        additionalTaxInfo.effectiveRate <= 20 ? 
                            (language === 'he' ? 'נטל מס נמוך - מצוין!' : 'Low tax burden - Excellent!') :
                        additionalTaxInfo.effectiveRate <= 30 ? 
                            (language === 'he' ? 'נטל מס בינוני - טוב' : 'Moderate tax burden - Good') :
                        additionalTaxInfo.effectiveRate <= 40 ? 
                            (language === 'he' ? 'נטל מס גבוה - שקול אופטימיזציה' : 'High tax burden - Consider optimization') :
                            (language === 'he' ? 'נטל מס גבוה מאוד - דרושה אופטימיזציה' : 'Very high tax burden - Optimization needed')
                    )
                ]),
                
                // Tax distribution
                createElement('div', {
                    key: 'tax-distribution',
                    className: "space-y-3"
                }, [
                    createElement('h5', {
                        key: 'distribution-title',
                        className: "text-sm font-medium text-gray-700"
                    }, language === 'he' ? 'התפלגות מס לפי סוג הכנסה' : 'Tax Distribution by Income Type'),
                    
                    additionalTaxInfo.breakdown.bonus.gross > 0 && createElement(TaxProgressBar, {
                        key: 'bonus-mini',
                        rate: additionalTaxInfo.breakdown.bonus.rate,
                        label: `${language === 'he' ? 'בונוס' : 'Bonus'} (${formatCurrency(additionalTaxInfo.breakdown.bonus.gross)})`,
                        maxRate: 50
                    }),
                    
                    additionalTaxInfo.breakdown.rsu.gross > 0 && createElement(TaxProgressBar, {
                        key: 'rsu-mini',
                        rate: additionalTaxInfo.breakdown.rsu.rate,
                        label: `RSU (${formatCurrency(additionalTaxInfo.breakdown.rsu.gross)})`,
                        maxRate: 50
                    }),
                    
                    additionalTaxInfo.breakdown.otherIncome.gross > 0 && createElement(TaxProgressBar, {
                        key: 'other-mini',
                        rate: additionalTaxInfo.breakdown.otherIncome.rate,
                        label: `${language === 'he' ? 'אחר' : 'Other'} (${formatCurrency(additionalTaxInfo.breakdown.otherIncome.gross)})`,
                        maxRate: 50
                    })
                ])
            ])
        ]),
        
        // Enhanced detailed breakdown with monthly/annual views
        createElement('div', { key: 'detailed-breakdown', className: "space-y-4" }, [
            // Bonus income breakdown
            additionalTaxInfo.breakdown && additionalTaxInfo.breakdown.bonus.gross > 0 && createElement('div', {
                key: 'bonus-breakdown',
                className: "bg-white rounded-lg p-4 border border-purple-100"
            }, [
                createElement('h4', {
                    key: 'bonus-title',
                    className: "font-semibold text-purple-700 mb-3 flex items-center justify-between"
                }, [
                    createElement('span', { key: 'title-text' }, t.bonusIncome),
                    createElement('div', {
                        key: 'rate-badge',
                        className: 'flex items-center gap-2'
                    }, [
                        createElement('span', {
                            key: 'effective-rate',
                            className: `text-sm px-2 py-1 rounded font-medium ${
                                additionalTaxInfo.breakdown.bonus.rate <= 20 ? 'bg-green-100 text-green-700' :
                                additionalTaxInfo.breakdown.bonus.rate <= 30 ? 'bg-yellow-100 text-yellow-700' :
                                additionalTaxInfo.breakdown.bonus.rate <= 40 ? 'bg-orange-100 text-orange-700' :
                                'bg-red-100 text-red-700'
                            }`
                        }, `${additionalTaxInfo.breakdown.bonus.rate}% tax`)
                    ])
                ]),
                
                // Tax burden visualization
                createElement('div', {
                    key: 'bonus-tax-visual',
                    className: 'mb-3'
                }, [
                    createElement(TaxProgressBar, {
                        key: 'bonus-progress',
                        rate: additionalTaxInfo.breakdown.bonus.rate,
                        label: 'Bonus Tax Rate'
                    })
                ]),
                
                createElement('div', { key: 'bonus-details', className: "space-y-3" }, [
                    // Gross amount
                    createElement('div', { key: 'bonus-gross', className: "flex justify-between items-center" }, [
                        createElement('span', { key: 'label', className: "text-gray-600" }, t.bonusGross),
                        createElement('div', { key: 'values', className: "text-right" }, [
                            viewMode === 'annual' && createElement('div', {
                                key: 'annual-gross',
                                className: "font-medium text-gray-800"
                            }, formatCurrency(additionalTaxInfo.breakdown.bonus.gross)),
                            viewMode === 'monthly' && createElement('div', {
                                key: 'monthly-gross',
                                className: "font-medium text-gray-800"
                            }, formatCurrency(additionalTaxInfo.breakdown.bonus.gross / 12)),
                            viewMode === 'both' && [
                                createElement('div', {
                                    key: 'annual-gross-both',
                                    className: "text-sm font-medium text-gray-800"
                                }, formatCurrency(additionalTaxInfo.breakdown.bonus.gross)),
                                createElement('div', {
                                    key: 'monthly-gross-both',
                                    className: "text-xs text-gray-600"
                                }, `(${formatCurrency(additionalTaxInfo.breakdown.bonus.gross / 12)}/mo)`)
                            ]
                        ])
                    ]),
                    
                    // Tax amount
                    createElement('div', { key: 'bonus-tax', className: "flex justify-between items-center" }, [
                        createElement('span', { key: 'label', className: "text-gray-600" }, t.bonusTax),
                        createElement('div', { key: 'values', className: "text-right" }, [
                            viewMode === 'annual' && createElement('div', {
                                key: 'annual-tax',
                                className: "font-medium text-red-600"
                            }, formatCurrency(additionalTaxInfo.breakdown.bonus.tax)),
                            viewMode === 'monthly' && createElement('div', {
                                key: 'monthly-tax',
                                className: "font-medium text-red-600"
                            }, formatCurrency(additionalTaxInfo.breakdown.bonus.tax / 12)),
                            viewMode === 'both' && [
                                createElement('div', {
                                    key: 'annual-tax-both',
                                    className: "text-sm font-medium text-red-600"
                                }, formatCurrency(additionalTaxInfo.breakdown.bonus.tax)),
                                createElement('div', {
                                    key: 'monthly-tax-both',
                                    className: "text-xs text-red-500"
                                }, `(${formatCurrency(additionalTaxInfo.breakdown.bonus.tax / 12)}/mo)`)
                            ]
                        ])
                    ]),
                    
                    // Net amount
                    createElement('div', { key: 'bonus-net', className: "flex justify-between items-center border-t pt-2" }, [
                        createElement('span', { key: 'label', className: "font-medium text-gray-700" }, t.bonusNet),
                        createElement('div', { key: 'values', className: "text-right" }, [
                            viewMode === 'annual' && createElement('div', {
                                key: 'annual-net',
                                className: "font-bold text-green-600"
                            }, formatCurrency(additionalTaxInfo.breakdown.bonus.net)),
                            viewMode === 'monthly' && createElement('div', {
                                key: 'monthly-net',
                                className: "font-bold text-green-600"
                            }, formatCurrency(additionalTaxInfo.breakdown.bonus.net / 12)),
                            viewMode === 'both' && [
                                createElement('div', {
                                    key: 'annual-net-both',
                                    className: "text-sm font-bold text-green-600"
                                }, formatCurrency(additionalTaxInfo.breakdown.bonus.net)),
                                createElement('div', {
                                    key: 'monthly-net-both',
                                    className: "text-xs font-medium text-green-500"
                                }, `(${formatCurrency(additionalTaxInfo.breakdown.bonus.net / 12)}/mo)`)
                            ]
                        ])
                    ])
                ])
            ]),
            
            // RSU income breakdown
            additionalTaxInfo.breakdown && additionalTaxInfo.breakdown.rsu.gross > 0 && createElement('div', {
                key: 'rsu-breakdown',
                className: "bg-white rounded-lg p-4 border border-purple-100"
            }, [
                createElement('h4', {
                    key: 'rsu-title',
                    className: "font-semibold text-purple-700 mb-3 flex items-center justify-between"
                }, [
                    createElement('span', { key: 'title-text' }, 'RSU Income'),
                    createElement('div', {
                        key: 'rate-badge',
                        className: 'flex items-center gap-2'
                    }, [
                        createElement('span', {
                            key: 'effective-rate',
                            className: `text-sm px-2 py-1 rounded font-medium ${
                                additionalTaxInfo.breakdown.rsu.rate <= 20 ? 'bg-green-100 text-green-700' :
                                additionalTaxInfo.breakdown.rsu.rate <= 30 ? 'bg-yellow-100 text-yellow-700' :
                                additionalTaxInfo.breakdown.rsu.rate <= 40 ? 'bg-orange-100 text-orange-700' :
                                'bg-red-100 text-red-700'
                            }`
                        }, `${additionalTaxInfo.breakdown.rsu.rate}% tax`)
                    ])
                ]),
                
                // Tax burden visualization
                createElement('div', {
                    key: 'rsu-tax-visual',
                    className: 'mb-3'
                }, [
                    createElement(TaxProgressBar, {
                        key: 'rsu-progress',
                        rate: additionalTaxInfo.breakdown.rsu.rate,
                        label: 'RSU Tax Rate'
                    })
                ]),
                
                createElement('div', { key: 'rsu-details', className: "space-y-3" }, [
                    createElement('div', { key: 'rsu-gross', className: "flex justify-between items-center" }, [
                        createElement('span', { key: 'label', className: "text-gray-600" }, 'RSU Gross'),
                        createElement('div', { key: 'values', className: "text-right" }, [
                            viewMode === 'annual' && createElement('div', {
                                key: 'annual-gross',
                                className: "font-medium text-gray-800"
                            }, formatCurrency(additionalTaxInfo.breakdown.rsu.gross)),
                            viewMode === 'monthly' && createElement('div', {
                                key: 'monthly-gross',
                                className: "font-medium text-gray-800"
                            }, formatCurrency(additionalTaxInfo.breakdown.rsu.gross / 12)),
                            viewMode === 'both' && [
                                createElement('div', {
                                    key: 'annual-gross-both',
                                    className: "text-sm font-medium text-gray-800"
                                }, formatCurrency(additionalTaxInfo.breakdown.rsu.gross)),
                                createElement('div', {
                                    key: 'monthly-gross-both',
                                    className: "text-xs text-gray-600"
                                }, `(${formatCurrency(additionalTaxInfo.breakdown.rsu.gross / 12)}/mo)`)
                            ]
                        ])
                    ]),
                    createElement('div', { key: 'rsu-tax', className: "flex justify-between items-center" }, [
                        createElement('span', { key: 'label', className: "text-gray-600" }, 'RSU Tax'),
                        createElement('div', { key: 'values', className: "text-right" }, [
                            viewMode === 'annual' && createElement('div', {
                                key: 'annual-tax',
                                className: "font-medium text-red-600"
                            }, formatCurrency(additionalTaxInfo.breakdown.rsu.tax)),
                            viewMode === 'monthly' && createElement('div', {
                                key: 'monthly-tax',
                                className: "font-medium text-red-600"
                            }, formatCurrency(additionalTaxInfo.breakdown.rsu.tax / 12)),
                            viewMode === 'both' && [
                                createElement('div', {
                                    key: 'annual-tax-both',
                                    className: "text-sm font-medium text-red-600"
                                }, formatCurrency(additionalTaxInfo.breakdown.rsu.tax)),
                                createElement('div', {
                                    key: 'monthly-tax-both',
                                    className: "text-xs text-red-500"
                                }, `(${formatCurrency(additionalTaxInfo.breakdown.rsu.tax / 12)}/mo)`)
                            ]
                        ])
                    ]),
                    createElement('div', { key: 'rsu-net', className: "flex justify-between items-center border-t pt-2" }, [
                        createElement('span', { key: 'label', className: "font-medium text-gray-700" }, 'RSU Net'),
                        createElement('div', { key: 'values', className: "text-right" }, [
                            viewMode === 'annual' && createElement('div', {
                                key: 'annual-net',
                                className: "font-bold text-green-600"
                            }, formatCurrency(additionalTaxInfo.breakdown.rsu.net)),
                            viewMode === 'monthly' && createElement('div', {
                                key: 'monthly-net',
                                className: "font-bold text-green-600"
                            }, formatCurrency(additionalTaxInfo.breakdown.rsu.net / 12)),
                            viewMode === 'both' && [
                                createElement('div', {
                                    key: 'annual-net-both',
                                    className: "text-sm font-bold text-green-600"
                                }, formatCurrency(additionalTaxInfo.breakdown.rsu.net)),
                                createElement('div', {
                                    key: 'monthly-net-both',
                                    className: "text-xs font-medium text-green-500"
                                }, `(${formatCurrency(additionalTaxInfo.breakdown.rsu.net / 12)}/mo)`)
                            ]
                        ])
                    ])
                ])
            ]),
            
            // Other income breakdown (freelance, rental, dividend)
            additionalTaxInfo.breakdown && additionalTaxInfo.breakdown.otherIncome.gross > 0 && createElement('div', {
                key: 'other-breakdown',
                className: "bg-white rounded-lg p-4 border border-purple-100"
            }, [
                createElement('h4', {
                    key: 'other-title',
                    className: "font-semibold text-purple-700 mb-3 flex items-center justify-between"
                }, [
                    createElement('span', { key: 'title-text' }, t.otherIncome),
                    createElement('div', {
                        key: 'rate-badge',
                        className: 'flex items-center gap-2'
                    }, [
                        createElement('span', {
                            key: 'effective-rate',
                            className: `text-sm px-2 py-1 rounded font-medium ${
                                additionalTaxInfo.breakdown.otherIncome.rate <= 20 ? 'bg-green-100 text-green-700' :
                                additionalTaxInfo.breakdown.otherIncome.rate <= 30 ? 'bg-yellow-100 text-yellow-700' :
                                additionalTaxInfo.breakdown.otherIncome.rate <= 40 ? 'bg-orange-100 text-orange-700' :
                                'bg-red-100 text-red-700'
                            }`
                        }, `${additionalTaxInfo.breakdown.otherIncome.rate}% tax`)
                    ])
                ]),
                
                // Tax burden visualization
                createElement('div', {
                    key: 'other-tax-visual',
                    className: 'mb-3'
                }, [
                    createElement(TaxProgressBar, {
                        key: 'other-progress',
                        rate: additionalTaxInfo.breakdown.otherIncome.rate,
                        label: 'Other Income Tax Rate'
                    })
                ]),
                
                createElement('div', { key: 'other-details', className: "space-y-3" }, [
                    createElement('div', { key: 'other-gross', className: "flex justify-between items-center" }, [
                        createElement('span', { key: 'label', className: "text-gray-600" }, t.otherGross),
                        createElement('div', { key: 'values', className: "text-right" }, [
                            viewMode === 'annual' && createElement('div', {
                                key: 'annual-gross',
                                className: "font-medium text-gray-800"
                            }, formatCurrency(additionalTaxInfo.breakdown.otherIncome.gross)),
                            viewMode === 'monthly' && createElement('div', {
                                key: 'monthly-gross',
                                className: "font-medium text-gray-800"
                            }, formatCurrency(additionalTaxInfo.breakdown.otherIncome.gross / 12)),
                            viewMode === 'both' && [
                                createElement('div', {
                                    key: 'annual-gross-both',
                                    className: "text-sm font-medium text-gray-800"
                                }, formatCurrency(additionalTaxInfo.breakdown.otherIncome.gross)),
                                createElement('div', {
                                    key: 'monthly-gross-both',
                                    className: "text-xs text-gray-600"
                                }, `(${formatCurrency(additionalTaxInfo.breakdown.otherIncome.gross / 12)}/mo)`)
                            ]
                        ])
                    ]),
                    createElement('div', { key: 'other-tax', className: "flex justify-between items-center" }, [
                        createElement('span', { key: 'label', className: "text-gray-600" }, t.otherTax),
                        createElement('div', { key: 'values', className: "text-right" }, [
                            viewMode === 'annual' && createElement('div', {
                                key: 'annual-tax',
                                className: "font-medium text-red-600"
                            }, formatCurrency(additionalTaxInfo.breakdown.otherIncome.tax)),
                            viewMode === 'monthly' && createElement('div', {
                                key: 'monthly-tax',
                                className: "font-medium text-red-600"
                            }, formatCurrency(additionalTaxInfo.breakdown.otherIncome.tax / 12)),
                            viewMode === 'both' && [
                                createElement('div', {
                                    key: 'annual-tax-both',
                                    className: "text-sm font-medium text-red-600"
                                }, formatCurrency(additionalTaxInfo.breakdown.otherIncome.tax)),
                                createElement('div', {
                                    key: 'monthly-tax-both',
                                    className: "text-xs text-red-500"
                                }, `(${formatCurrency(additionalTaxInfo.breakdown.otherIncome.tax / 12)}/mo)`)
                            ]
                        ])
                    ]),
                    createElement('div', { key: 'other-net', className: "flex justify-between items-center border-t pt-2" }, [
                        createElement('span', { key: 'label', className: "font-medium text-gray-700" }, t.otherNet),
                        createElement('div', { key: 'values', className: "text-right" }, [
                            viewMode === 'annual' && createElement('div', {
                                key: 'annual-net',
                                className: "font-bold text-green-600"
                            }, formatCurrency(additionalTaxInfo.breakdown.otherIncome.net)),
                            viewMode === 'monthly' && createElement('div', {
                                key: 'monthly-net',
                                className: "font-bold text-green-600"
                            }, formatCurrency(additionalTaxInfo.breakdown.otherIncome.net / 12)),
                            viewMode === 'both' && [
                                createElement('div', {
                                    key: 'annual-net-both',
                                    className: "text-sm font-bold text-green-600"
                                }, formatCurrency(additionalTaxInfo.breakdown.otherIncome.net)),
                                createElement('div', {
                                    key: 'monthly-net-both',
                                    className: "text-xs font-medium text-green-500"
                                }, `(${formatCurrency(additionalTaxInfo.breakdown.otherIncome.net / 12)}/mo)`)
                            ]
                        ])
                    ])
                ])
            ])
        ]),
        
        // Enhanced country-specific tax optimization tips
        createElement('div', {
            key: 'tax-tips',
            className: "mt-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200"
        }, [
            createElement('h4', {
                key: 'tips-title',
                className: "font-semibold text-yellow-800 mb-3 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-2" }, '💡'),
                language === 'he' ? 'טיפים לאופטימיזציית מס' : 'Tax Optimization Strategies'
            ]),
            
            // Country-specific optimization strategies
            (() => {
                const country = inputs.country || 'israel';
                const strategies = [];
                
                if (country === 'israel' || country === 'ISR') {
                    strategies.push(
                        language === 'he' ? 'העלאת הפקדות לקרן פנסיה עד 7.5% מהשכר להפחתת מס' :
                        'Increase pension contributions up to 7.5% of salary for tax deduction',
                        language === 'he' ? 'שימוש בקרן השתלמות עד 2.5% לאופטימיזציית מס' :
                        'Use training fund up to 2.5% for additional tax optimization',
                        language === 'he' ? 'שקול לפרש הכנסה נוספת על פני מספר שנים להימנעות ממדרג מס גבוה' :
                        'Consider spreading bonus income over multiple years to avoid higher tax brackets'
                    );
                    
                    if (additionalTaxInfo.effectiveRate > 35) {
                        strategies.push(
                            language === 'he' ? 'נטל המס גבוה - שקול ייעוץ מסים לאופטימיזציה' :
                            'High tax burden - Consider professional tax consultation for optimization'
                        );
                    }
                } else if (country === 'uk' || country === 'UK') {
                    strategies.push(
                        'Maximize ISA contributions (£20,000 annually) for tax-free growth',
                        'Consider salary sacrifice schemes for pension contributions',
                        'Time bonus payments to optimize personal allowance usage'
                    );
                    
                    if (additionalTaxInfo.effectiveRate > 40) {
                        strategies.push('Consider pension contributions to reduce higher-rate tax liability');
                    }
                } else if (country === 'us' || country === 'US') {
                    strategies.push(
                        'Maximize 401(k) contributions ($22,500 in 2023) for tax deferral',
                        'Consider Roth vs Traditional IRA based on current vs future tax rates',
                        'Time RSU sales to optimize capital gains vs ordinary income treatment'
                    );
                }
                
                // Universal strategies
                strategies.push(
                    t.taxOptimizationTip,
                    t.pensionContributionAdvice
                );
                
                return createElement('ul', {
                    className: "space-y-3 text-sm text-yellow-700"
                }, strategies.map((strategy, index) => 
                    createElement('li', {
                        key: `strategy-${index}`,
                        className: "flex items-start p-2 bg-white bg-opacity-50 rounded"
                    }, [
                        createElement('span', { 
                            key: 'bullet', 
                            className: "mr-3 mt-0.5 text-yellow-600 font-bold" 
                        }, '✓'),
                        createElement('span', { key: 'text' }, strategy)
                    ])
                ));
            })()
        ])
    ]);
};

// Export to window for global access
window.AdditionalIncomeTaxPanel = AdditionalIncomeTaxPanel;

console.log('✅ AdditionalIncomeTaxPanel component loaded successfully');