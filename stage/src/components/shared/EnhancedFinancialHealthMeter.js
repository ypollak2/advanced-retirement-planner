// Enhanced Financial Health Meter - Detailed breakdown with actionable insights
// Created by Yali Pollak (יהלי פולק) - v6.6.3

const EnhancedFinancialHealthMeter = ({ 
    inputs, 
    language = 'en', 
    workingCurrency = 'ILS',
    compact = false,
    showDetails = true 
}) => {
    const createElement = React.createElement;
    const [scoreData, setScoreData] = React.useState(null);
    const [expandedFactor, setExpandedFactor] = React.useState(null);
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    
    // Multi-language content
    const content = {
        he: {
            healthMeter: 'מד בריאות פיננסית',
            overallScore: 'ציון כללי',
            excellent: 'מעולה',
            good: 'טוב',
            needsWork: 'זקוק לשיפור',
            critical: 'דורש טיפול',
            scoreBreakdown: 'פירוט הציון',
            improvementSuggestions: 'הצעות לשיפור',
            peerComparison: 'השוואה לעמיתים',
            yourScore: 'הציון שלך',
            peerAverage: 'ממוצע עמיתים',
            topQuartile: 'רבעון עליון',
            percentile: 'אחוזון',
            quickFixes: 'תיקונים מהירים',
            
            // Factor names
            savingsRate: 'שיעור חיסכון',
            retirementReadiness: 'מוכנות לפרישה',
            timeHorizon: 'זמן עד פרישה',
            riskAlignment: 'התאמת סיכון',
            diversification: 'פיזור השקעות',
            taxEfficiency: 'יעילות מס',
            emergencyFund: 'קרן חירום',
            debtManagement: 'ניהול חובות',
            
            // Status descriptions
            savingsRateDesc: 'אחוז ההכנסה שנחסך מדי חודש',
            retirementReadinessDesc: 'צבירה נוכחית לעומת יעדי גיל',
            timeHorizonDesc: 'שנים שנותרו עד פרישה',
            riskAlignmentDesc: 'התאמת החלוקה לגיל ויעדים',
            diversificationDesc: 'פיזור בין סוגי נכסים שונים',
            taxEfficiencyDesc: 'ניצול חשבונות פטורי מס',
            emergencyFundDesc: 'חודשי הוצאות בקרן חירום',
            debtManagementDesc: 'יחס חובות להכנסה',
            
            clickForDetails: 'לחץ לפרטים',
            hideDetails: 'הסתר פרטים',
            showSuggestions: 'הצג הצעות',
            hideSuggestions: 'הסתר הצעות',
            highPriority: 'עדיפות גבוהה',
            mediumPriority: 'עדיפות בינונית',
            impact: 'השפעה',
            points: 'נקודות'
        },
        en: {
            healthMeter: 'Financial Health Meter',
            overallScore: 'Overall Score',
            excellent: 'Excellent',
            good: 'Good',
            needsWork: 'Needs Work',
            critical: 'Critical',
            scoreBreakdown: 'Score Breakdown',
            improvementSuggestions: 'Improvement Suggestions',
            peerComparison: 'Peer Comparison',
            yourScore: 'Your Score',
            peerAverage: 'Peer Average',
            topQuartile: 'Top Quartile',
            percentile: 'Percentile',
            quickFixes: 'Quick Wins',
            
            // Factor names
            savingsRate: 'Savings Rate',
            retirementReadiness: 'Retirement Readiness',
            timeHorizon: 'Time Horizon',
            riskAlignment: 'Risk Alignment',
            diversification: 'Diversification',
            taxEfficiency: 'Tax Efficiency',
            emergencyFund: 'Emergency Fund',
            debtManagement: 'Debt Management',
            
            // Status descriptions
            savingsRateDesc: 'Percentage of income saved monthly',
            retirementReadinessDesc: 'Current savings vs age-appropriate targets',
            timeHorizonDesc: 'Years remaining until retirement',
            riskAlignmentDesc: 'Investment allocation matches age and goals',
            diversificationDesc: 'Spread across multiple asset classes',
            taxEfficiencyDesc: 'Effective use of tax-advantaged accounts',
            emergencyFundDesc: 'Months of expenses covered',
            debtManagementDesc: 'Debt-to-income ratio management',
            
            clickForDetails: 'Click for details',
            hideDetails: 'Hide details',
            showSuggestions: 'Show Suggestions',
            hideSuggestions: 'Hide Suggestions',
            highPriority: 'High Priority',
            mediumPriority: 'Medium Priority',
            impact: 'Impact',
            points: 'points'
        }
    };
    
    const t = content[language];
    
    // Currency symbol helper
    const getCurrencySymbol = () => {
        const symbols = { 'ILS': '₪', 'USD': '$', 'EUR': '€', 'GBP': '£' };
        return symbols[workingCurrency] || '₪';
    };
    
    // Calculate score when inputs change
    React.useEffect(() => {
        if (window.calculateFinancialHealthScore && inputs) {
            const newScoreData = window.calculateFinancialHealthScore(inputs);
            setScoreData(newScoreData);
        }
    }, [inputs]);
    
    // Get status color class
    const getStatusColor = (status) => {
        const colors = {
            excellent: 'text-green-700 bg-green-100 border-green-300',
            good: 'text-blue-700 bg-blue-100 border-blue-300',
            fair: 'text-yellow-700 bg-yellow-100 border-yellow-300',
            poor: 'text-orange-700 bg-orange-100 border-orange-300',
            critical: 'text-red-700 bg-red-100 border-red-300',
            needsWork: 'text-orange-700 bg-orange-100 border-orange-300'
        };
        return colors[status] || colors.critical;
    };
    
    // Get score color for progress bars
    const getScoreColor = (score, maxScore) => {
        const percentage = (score / maxScore) * 100;
        if (percentage >= 85) return 'bg-green-500';
        if (percentage >= 70) return 'bg-blue-500';
        if (percentage >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };
    
    // Get factor description
    const getFactorDescription = (factorName) => {
        const descriptions = {
            savingsRate: t.savingsRateDesc,
            retirementReadiness: t.retirementReadinessDesc,
            timeHorizon: t.timeHorizonDesc,
            riskAlignment: t.riskAlignmentDesc,
            diversification: t.diversificationDesc,
            taxEfficiency: t.taxEfficiencyDesc,
            emergencyFund: t.emergencyFundDesc,
            debtManagement: t.debtManagementDesc
        };
        return descriptions[factorName] || '';
    };
    
    if (!scoreData) {
        return createElement('div', {
            className: compact ? 
                "animate-pulse bg-gray-200 rounded-lg h-32 w-full" :
                "animate-pulse bg-gray-200 rounded-xl h-48 w-full"
        });
    }
    
    return createElement('div', { 
        className: compact ? 
            "bg-white rounded-lg border-2 border-gray-200 p-4" :
            "bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg"
    }, [
        // Header with main score
        createElement('div', {
            key: 'header',
            className: "flex items-center justify-between mb-4"
        }, [
            createElement('div', { key: 'title-section' }, [
                createElement('h3', {
                    key: 'title',
                    className: compact ? "text-lg font-semibold text-gray-800" : "text-xl font-bold text-gray-800"
                }, [
                    createElement('span', { key: 'icon', className: "mr-2" }, '💚'),
                    t.healthMeter
                ]),
                createElement('p', {
                    key: 'subtitle',
                    className: "text-sm text-gray-600 mt-1"
                }, t.overallScore)
            ]),
            createElement('div', {
                key: 'score-display',
                className: "text-center"
            }, [
                createElement('div', {
                    key: 'score-circle',
                    className: `relative inline-flex items-center justify-center ${compact ? 'w-16 h-16' : 'w-20 h-20'} rounded-full border-4 ${getStatusColor(scoreData.status)}`
                }, [
                    createElement('span', {
                        key: 'score-number',
                        className: compact ? "text-xl font-bold" : "text-2xl font-bold"
                    }, scoreData.totalScore),
                    createElement('span', {
                        key: 'score-max',
                        className: "text-xs opacity-75 ml-0.5"
                    }, '/100')
                ]),
                createElement('div', {
                    key: 'status-text',
                    className: `text-xs font-medium mt-1 px-2 py-1 rounded ${getStatusColor(scoreData?.status || 'needsWork')}`
                }, t[scoreData?.status] || t.needsWork)
            ])
        ]),
        
        // Score breakdown (if not compact and showDetails)
        showDetails && !compact && createElement('div', {
            key: 'score-breakdown',
            className: "mb-6"
        }, [
            createElement('h4', {
                key: 'breakdown-title',
                className: "text-md font-semibold text-gray-700 mb-3"
            }, t.scoreBreakdown),
            createElement('div', {
                key: 'factors-grid',
                className: "space-y-3"
            }, Object.entries(scoreData.factors).map(([factorName, factorData]) =>
                createElement('div', {
                    key: factorName,
                    className: `border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${
                        expandedFactor === factorName ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                    }`,
                    onClick: () => setExpandedFactor(expandedFactor === factorName ? null : factorName)
                }, [
                    createElement('div', {
                        key: 'factor-header',
                        className: "flex items-center justify-between"
                    }, [
                        createElement('div', {
                            key: 'factor-info',
                            className: "flex-1"
                        }, [
                            createElement('div', {
                                key: 'factor-name',
                                className: "font-medium text-gray-800"
                            }, t[factorName] || factorName),
                            createElement('div', {
                                key: 'factor-desc',
                                className: "text-xs text-gray-600"
                            }, getFactorDescription(factorName))
                        ]),
                        createElement('div', {
                            key: 'factor-score',
                            className: "flex items-center space-x-3"
                        }, [
                            createElement('div', {
                                key: 'progress-container',
                                className: "w-16 bg-gray-200 rounded-full h-2"
                            }, [
                                createElement('div', {
                                    key: 'progress-bar',
                                    className: `h-2 rounded-full transition-all ${getScoreColor(factorData.score, window.SCORE_FACTORS[factorName]?.weight || 25)}`,
                                    style: { width: `${(factorData.score / (window.SCORE_FACTORS[factorName]?.weight || 25)) * 100}%` }
                                })
                            ]),
                            createElement('span', {
                                key: 'score-text',
                                className: "text-sm font-medium w-12 text-right"
                            }, `${factorData.score}/${window.SCORE_FACTORS[factorName]?.weight || 25}`)
                        ])
                    ]),
                    
                    // Expanded details
                    expandedFactor === factorName && createElement('div', {
                        key: 'factor-details',
                        className: "mt-3 pt-3 border-t border-gray-200"
                    }, [
                        createElement('div', {
                            key: 'status-indicator',
                            className: `inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(factorData?.details?.status || 'unknown')}`
                        }, t[factorData?.details?.status] || factorData?.details?.status || 'Unknown'),
                        
                        // Factor-specific details
                        factorName === 'savingsRate' && factorData.details.rate !== undefined && createElement('div', {
                            key: 'savings-details',
                            className: "mt-2 text-sm text-gray-700"
                        }, [
                            createElement('div', { key: 'rate' }, `Current rate: ${factorData.details.rate.toFixed(1)}%`),
                            createElement('div', { key: 'target' }, `Target: ${factorData.details.target}%`),
                            factorData.details.improvement > 0 && createElement('div', { key: 'improvement' }, 
                                `Need: +${getCurrencySymbol()}${Math.round(factorData.details.improvement).toLocaleString()}/month`)
                        ]),
                        
                        factorName === 'retirementReadiness' && factorData.details.gap > 0 && createElement('div', {
                            key: 'readiness-details',
                            className: "mt-2 text-sm text-gray-700"
                        }, [
                            createElement('div', { key: 'gap' }, 
                                `Savings gap: ${getCurrencySymbol()}${Math.round(factorData.details.gap).toLocaleString()}`),
                            createElement('div', { key: 'ratio' }, 
                                `Progress: ${(factorData.details.ratio * 100).toFixed(0)}% of target`)
                        ]),
                        
                        factorName === 'diversification' && createElement('div', {
                            key: 'diversification-details',
                            className: "mt-2 text-sm text-gray-700"
                        }, [
                            createElement('div', { key: 'classes' }, 
                                `Asset classes: ${factorData.details.assetClasses}/6`),
                            factorData.details.missingClasses > 0 && createElement('div', { key: 'missing' }, 
                                `Consider adding: ${factorData.details.missingClasses} more asset types`)
                        ]),
                        
                        factorName === 'emergencyFund' && createElement('div', {
                            key: 'emergency-details',
                            className: "mt-2 text-sm text-gray-700"
                        }, [
                            createElement('div', { key: 'months' }, 
                                `Coverage: ${factorData.details.months.toFixed(1)} months`),
                            factorData.details.gap > 0 && createElement('div', { key: 'gap' }, 
                                `Need: ${getCurrencySymbol()}${Math.round(factorData.details.gap).toLocaleString()} more`)
                        ])
                    ])
                ])
            ))
        ]),
        
        // Peer comparison (if not compact)
        !compact && scoreData.peerComparison && createElement('div', {
            key: 'peer-comparison',
            className: "mb-6 p-4 bg-gray-50 rounded-lg border"
        }, [
            createElement('h4', {
                key: 'peer-title',
                className: "text-md font-semibold text-gray-700 mb-3"
            }, t.peerComparison),
            createElement('div', {
                key: 'peer-stats',
                className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm"
            }, [
                createElement('div', { key: 'your-score', className: "text-center" }, [
                    createElement('div', { key: 'label', className: "text-gray-600" }, t.yourScore),
                    createElement('div', { key: 'value', className: "font-bold text-lg" }, scoreData.totalScore)
                ]),
                createElement('div', { key: 'peer-avg', className: "text-center" }, [
                    createElement('div', { key: 'label', className: "text-gray-600" }, t.peerAverage),
                    createElement('div', { key: 'value', className: "font-bold text-lg" }, scoreData.peerComparison.peerAverage)
                ]),
                createElement('div', { key: 'top-quartile', className: "text-center" }, [
                    createElement('div', { key: 'label', className: "text-gray-600" }, t.topQuartile),
                    createElement('div', { key: 'value', className: "font-bold text-lg" }, scoreData.peerComparison.topQuartile)
                ]),
                createElement('div', { key: 'percentile', className: "text-center" }, [
                    createElement('div', { key: 'label', className: "text-gray-600" }, t.percentile),
                    createElement('div', { key: 'value', className: "font-bold text-lg text-blue-600" }, 
                        `${scoreData.peerComparison.percentile}th`)
                ])
            ])
        ]),
        
        // Improvement suggestions
        !compact && scoreData.suggestions.length > 0 && createElement('div', {
            key: 'suggestions-section',
            className: "border-t pt-4"
        }, [
            createElement('div', {
                key: 'suggestions-header',
                className: "flex items-center justify-between mb-3"
            }, [
                createElement('h4', {
                    key: 'suggestions-title',
                    className: "text-md font-semibold text-gray-700"
                }, t.improvementSuggestions),
                createElement('button', {
                    key: 'toggle-suggestions',
                    type: 'button',
                    onClick: () => setShowSuggestions(!showSuggestions),
                    className: "text-sm text-blue-600 hover:text-blue-800"
                }, showSuggestions ? t.hideSuggestions : t.showSuggestions)
            ]),
            
            showSuggestions && createElement('div', {
                key: 'suggestions-list',
                className: "space-y-3"
            }, scoreData.suggestions.map((suggestion, index) =>
                createElement('div', {
                    key: index,
                    className: `p-3 rounded-lg border-l-4 ${
                        suggestion.priority === 'high' ? 'border-red-400 bg-red-50' : 'border-yellow-400 bg-yellow-50'
                    }`
                }, [
                    createElement('div', {
                        key: 'suggestion-header',
                        className: "flex items-center justify-between mb-2"
                    }, [
                        createElement('span', {
                            key: 'category',
                            className: "font-medium text-gray-800"
                        }, suggestion.category),
                        createElement('div', {
                            key: 'priority-impact',
                            className: "flex items-center space-x-2"
                        }, [
                            createElement('span', {
                                key: 'priority',
                                className: `text-xs px-2 py-1 rounded ${
                                    suggestion.priority === 'high' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
                                }`
                            }, suggestion.priority === 'high' ? t.highPriority : t.mediumPriority),
                            createElement('span', {
                                key: 'impact',
                                className: "text-xs text-gray-600"
                            }, `${t.impact}: ${suggestion.impact}`)
                        ])
                    ]),
                    createElement('div', {
                        key: 'issue',
                        className: "text-sm text-gray-700 mb-1"
                    }, suggestion.issue),
                    createElement('div', {
                        key: 'action',
                        className: "text-sm font-medium text-gray-900"
                    }, suggestion.action)
                ])
            ))
        ])
    ]);
};

// Export to window for global access
window.EnhancedFinancialHealthMeter = EnhancedFinancialHealthMeter;
console.log('✅ Enhanced Financial Health Meter component loaded successfully');