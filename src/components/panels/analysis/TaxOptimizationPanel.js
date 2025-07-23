// Tax Optimization Panel - Displays tax benefit analysis and recommendations
// Shows detailed tax savings, optimal contributions, and actionable recommendations

const TaxOptimizationPanel = ({ inputs, results, language = 'en' }) => {
    const createElement = React.createElement;
    
    // Multi-language content
    const content = {
        he: {
            title: 'אופטימיזציה מס',
            subtitle: 'ניתוח חיסכון במס ותשואות מההשקעות הפנסיוניות',
            noData: 'אין מידע זמין לאופטימיזציה מס',
            pensionBenefits: 'הטבות מס פנסיה',
            trainingFundBenefits: 'הטבות מס קרן השתלמות',
            currentSituation: 'מצב נוכחי',
            monthlySalary: 'משכורת חודשית',
            marginalRate: 'שיעור מס שולי',
            pensionContribution: 'הפקדה פנסיונית',
            taxSavings: 'חיסכון במס',
            netCost: 'עלות נטו',
            monthly: 'חודשי',
            annual: 'שנתי',
            recommendations: 'המלצות',
            highPriority: 'עדיפות גבוהה',
            mediumPriority: 'עדיפות בינונית',
            lowPriority: 'עדיפות נמוכה',
            summary: 'סיכום',
            totalSavings: 'סך חיסכון במס',
            effectiveReduction: 'הפחתה אפקטיבית',
            optimization: 'אופטימיזציה',
            percentage: '%',
            currency: '₪'
        },
        en: {
            title: 'Tax Optimization',
            subtitle: 'Tax savings analysis and retirement investment benefits',
            noData: 'No data available for tax optimization',
            pensionBenefits: 'Pension Tax Benefits',
            trainingFundBenefits: 'Training Fund Tax Benefits',
            currentSituation: 'Current Situation',
            monthlySalary: 'Monthly Salary',
            marginalRate: 'Marginal Tax Rate',
            pensionContribution: 'Pension Contribution',
            taxSavings: 'Tax Savings',
            netCost: 'Net Cost',
            monthly: 'Monthly',
            annual: 'Annual',
            recommendations: 'Recommendations',
            highPriority: 'High Priority',
            mediumPriority: 'Medium Priority', 
            lowPriority: 'Low Priority',
            summary: 'Summary',
            totalSavings: 'Total Tax Savings',
            effectiveReduction: 'Effective Reduction',
            optimization: 'Optimization',
            percentage: '%',
            currency: '₪'
        }
    };
    
    const t = content[language];
    
    if (!results?.taxOptimization) {
        return createElement('div', {
            key: 'no-tax-data',
            className: "bg-gray-50 rounded-xl p-6 border border-gray-200"
        }, [
            createElement('div', {
                key: 'no-data-icon',
                className: "text-center text-gray-400 text-4xl mb-4"
            }, '📊'),
            createElement('p', {
                key: 'no-data-text',
                className: "text-gray-600 text-center"
            }, t.noData)
        ]);
    }
    
    const taxData = results.taxOptimization;
    
    const formatCurrency = (amount) => {
        return `${t.currency}${Math.round(amount || 0).toLocaleString()}`;
    };
    
    const formatPercentage = (rate) => {
        return `${(rate || 0).toFixed(1)}${t.percentage}`;
    };
    
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'text-red-600 bg-red-50 border-red-200';
            case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'low': return 'text-green-600 bg-green-50 border-green-200';
            default: return 'text-blue-600 bg-blue-50 border-blue-200';
        }
    };
    
    const getPriorityLabel = (priority) => {
        switch (priority) {
            case 'high': return t.highPriority;
            case 'medium': return t.mediumPriority;
            case 'low': return t.lowPriority;
            default: return t.mediumPriority;
        }
    };
    
    return createElement('div', { 
        key: 'tax-optimization-panel',
        className: "space-y-6" 
    }, [
        // Header
        createElement('div', {
            key: 'header',
            className: "text-center"
        }, [
            createElement('div', {
                key: 'header-icon',
                className: "text-4xl mb-3"
            }, '🏛️'),
            createElement('h3', {
                key: 'header-title',
                className: "text-2xl font-bold text-gray-800 mb-2"
            }, t.title),
            createElement('p', {
                key: 'header-subtitle',
                className: "text-gray-600"
            }, t.subtitle)
        ]),
        
        // Current Situation Overview
        createElement('div', {
            key: 'current-situation',
            className: "bg-blue-50 rounded-xl p-6 border border-blue-200"
        }, [
            createElement('h4', {
                key: 'current-title',
                className: "text-xl font-semibold text-blue-800 mb-4 flex items-center"
            }, [
                createElement('span', { key: 'current-icon', className: "mr-3" }, '📈'),
                t.currentSituation
            ]),
            createElement('div', {
                key: 'current-grid',
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            }, [
                // Monthly Salary
                createElement('div', {
                    key: 'monthly-salary',
                    className: "text-center"
                }, [
                    createElement('div', {
                        key: 'salary-label',
                        className: "text-sm text-blue-600 mb-1"
                    }, t.monthlySalary),
                    createElement('div', {
                        key: 'salary-value',
                        className: "text-lg font-bold text-blue-800"
                    }, formatCurrency(taxData.salary?.monthly))
                ]),
                
                // Marginal Tax Rate
                createElement('div', {
                    key: 'marginal-rate',
                    className: "text-center"
                }, [
                    createElement('div', {
                        key: 'rate-label',
                        className: "text-sm text-blue-600 mb-1"
                    }, t.marginalRate),
                    createElement('div', {
                        key: 'rate-value',
                        className: "text-lg font-bold text-blue-800"
                    }, formatPercentage(taxData.salary?.marginalTaxRate))
                ]),
                
                // Total Monthly Savings
                createElement('div', {
                    key: 'total-savings',
                    className: "text-center"
                }, [
                    createElement('div', {
                        key: 'savings-label',
                        className: "text-sm text-blue-600 mb-1"
                    }, `${t.taxSavings} (${t.monthly})`),
                    createElement('div', {
                        key: 'savings-value',
                        className: "text-lg font-bold text-green-600"
                    }, formatCurrency(taxData.summary?.totalMonthlySavings))
                ]),
                
                // Effective Reduction
                createElement('div', {
                    key: 'effective-reduction',
                    className: "text-center"
                }, [
                    createElement('div', {
                        key: 'reduction-label',
                        className: "text-sm text-blue-600 mb-1"
                    }, t.effectiveReduction),
                    createElement('div', {
                        key: 'reduction-value',
                        className: "text-lg font-bold text-green-600"
                    }, formatPercentage(taxData.summary?.effectiveTaxReduction))
                ])
            ])
        ]),
        
        // Detailed Breakdown
        createElement('div', {
            key: 'detailed-breakdown',
            className: "grid grid-cols-1 lg:grid-cols-2 gap-6"
        }, [
            // Pension Benefits
            taxData.pension && createElement('div', {
                key: 'pension-benefits',
                className: "bg-green-50 rounded-xl p-6 border border-green-200"
            }, [
                createElement('h4', {
                    key: 'pension-title',
                    className: "text-lg font-semibold text-green-800 mb-4 flex items-center"
                }, [
                    createElement('span', { key: 'pension-icon', className: "mr-3" }, '🏦'),
                    t.pensionBenefits
                ]),
                createElement('div', {
                    key: 'pension-details',
                    className: "space-y-3"
                }, [
                    createElement('div', {
                        key: 'pension-contribution-row',
                        className: "flex justify-between items-center"
                    }, [
                        createElement('span', {
                            key: 'pension-contribution-label',
                            className: "text-green-700"
                        }, `${t.pensionContribution} (${t.monthly})`),
                        createElement('span', {
                            key: 'pension-contribution-value',
                            className: "font-semibold text-green-800"
                        }, formatCurrency(taxData.pension.monthlyPensionContribution))
                    ]),
                    createElement('div', {
                        key: 'pension-savings-row',
                        className: "flex justify-between items-center"
                    }, [
                        createElement('span', {
                            key: 'pension-savings-label',
                            className: "text-green-700"
                        }, `${t.taxSavings} (${t.monthly})`),
                        createElement('span', {
                            key: 'pension-savings-value',
                            className: "font-semibold text-green-600"
                        }, formatCurrency(taxData.pension.monthlyTaxSavings))
                    ]),
                    createElement('div', {
                        key: 'pension-net-row',
                        className: "flex justify-between items-center border-t pt-2 mt-2"
                    }, [
                        createElement('span', {
                            key: 'pension-net-label',
                            className: "text-green-700 font-medium"
                        }, `${t.netCost} (${t.monthly})`),
                        createElement('span', {
                            key: 'pension-net-value',
                            className: "font-bold text-green-800"
                        }, formatCurrency(taxData.pension.monthlyPensionContribution - taxData.pension.monthlyTaxSavings))
                    ])
                ])
            ]),
            
            // Training Fund Benefits  
            taxData.trainingFund && createElement('div', {
                key: 'training-fund-benefits',
                className: "bg-purple-50 rounded-xl p-6 border border-purple-200"
            }, [
                createElement('h4', {
                    key: 'training-title',
                    className: "text-lg font-semibold text-purple-800 mb-4 flex items-center"
                }, [
                    createElement('span', { key: 'training-icon', className: "mr-3" }, '🎓'),
                    t.trainingFundBenefits
                ]),
                createElement('div', {
                    key: 'training-details',
                    className: "space-y-3"
                }, [
                    createElement('div', {
                        key: 'training-contribution-row',
                        className: "flex justify-between items-center"
                    }, [
                        createElement('span', {
                            key: 'training-contribution-label',
                            className: "text-purple-700"
                        }, `${t.pensionContribution} (${t.monthly})`),
                        createElement('span', {
                            key: 'training-contribution-value',
                            className: "font-semibold text-purple-800"
                        }, formatCurrency(taxData.trainingFund.monthlyContribution))
                    ]),
                    createElement('div', {
                        key: 'training-savings-row',
                        className: "flex justify-between items-center"
                    }, [
                        createElement('span', {
                            key: 'training-savings-label',
                            className: "text-purple-700"
                        }, `${t.taxSavings} (${t.monthly})`),
                        createElement('span', {
                            key: 'training-savings-value',
                            className: "font-semibold text-green-600"
                        }, formatCurrency(taxData.trainingFund.monthlyTaxSavings))
                    ]),
                    taxData.trainingFund.isAboveThreshold && createElement('div', {
                        key: 'training-warning',
                        className: "bg-yellow-100 border border-yellow-200 rounded p-2 mt-2"
                    }, [
                        createElement('div', {
                            key: 'warning-text',
                            className: "text-sm text-yellow-800"
                        }, language === 'he' ? 
                            'מעל סף הכנסה - חלק מההפקדה לא מוכרת במס' :
                            'Above income threshold - part of contribution not tax-deductible')
                    ])
                ])
            ])
        ]),
        
        // Recommendations
        taxData.recommendations && taxData.recommendations.length > 0 && createElement('div', {
            key: 'recommendations',
            className: "bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
        }, [
            createElement('h4', {
                key: 'recommendations-title',
                className: "text-xl font-semibold text-blue-800 mb-4 flex items-center"
            }, [
                createElement('span', { key: 'recommendations-icon', className: "mr-3" }, '💡'),
                t.recommendations
            ]),
            createElement('div', {
                key: 'recommendations-list',
                className: "space-y-4"
            }, taxData.recommendations.map((rec, index) => 
                createElement('div', {
                    key: `recommendation-${index}`,
                    className: `border rounded-lg p-4 ${getPriorityColor(rec.priority)}`
                }, [
                    createElement('div', {
                        key: `rec-header-${index}`,
                        className: "flex justify-between items-start mb-2"
                    }, [
                        createElement('h5', {
                            key: `rec-title-${index}`,
                            className: "font-semibold"
                        }, rec.title),
                        createElement('span', {
                            key: `rec-priority-${index}`,
                            className: "text-xs px-2 py-1 rounded-full bg-white bg-opacity-50"
                        }, getPriorityLabel(rec.priority))
                    ]),
                    createElement('p', {
                        key: `rec-description-${index}`,
                        className: "text-sm mb-2"
                    }, rec.description),
                    rec.impact && createElement('p', {
                        key: `rec-impact-${index}`,
                        className: "text-sm font-medium mb-2"
                    }, `${language === 'he' ? 'השפעה:' : 'Impact:'} ${rec.impact}`),
                    rec.action && createElement('p', {
                        key: `rec-action-${index}`,
                        className: "text-sm font-medium"
                    }, `${language === 'he' ? 'פעולה:' : 'Action:'} ${rec.action}`)
                ])
            ))
        ])
    ]);
};

// Export to window for global access
window.TaxOptimizationPanel = TaxOptimizationPanel;