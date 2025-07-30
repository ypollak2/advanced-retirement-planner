// Dynamic Return Adjustment Panel - Age and risk-based return optimization
// Created by Yali Pollak (יהלי פולק) - v6.6.5

(function() {
    'use strict';

    const DynamicReturnAdjustmentPanel = ({ inputs, language = 'en', workingCurrency = 'ILS' }) => {
        const { createElement } = React;

        // Multi-language content
        const content = {
            en: {
                title: 'Dynamic Return Adjustments',
                subtitle: 'Age and risk-based optimization of expected returns',
                
                // Overview
                adjustment: 'Adjustment Applied',
                baseReturns: 'Base Returns',
                adjustedReturns: 'Age-Adjusted Returns',
                yourProfile: 'Your Profile',
                
                // Profile details
                age: 'Age',
                yearsToRetirement: 'Years to Retirement',
                riskTolerance: 'Risk Tolerance',
                adjustmentFactor: 'Overall Adjustment',
                
                // Asset types
                pension: 'Pension Fund',
                trainingFund: 'Training Fund',
                personalPortfolio: 'Personal Portfolio',
                realEstate: 'Real Estate',
                crypto: 'Cryptocurrency',
                
                // Adjustments
                noAdjustments: 'No Adjustments Applied',
                noAdjustmentsDesc: 'Your current return assumptions are appropriate for your age and risk profile',
                
                // Analysis
                impact: 'Impact Analysis',
                increaseReturn: 'Increased Return',
                decreaseReturn: 'Decreased Return',
                noChange: 'No Change',
                
                // Recommendations
                recommendations: 'Recommendations',
                riskLevel: 'Risk Level',
                conservative: 'Conservative',
                moderate: 'Moderate',
                aggressive: 'Aggressive',
                
                // Explanations
                youngInvestor: 'Young Investor Advantage',
                youngDesc: 'At your age, you can afford higher volatility for potentially higher returns',
                matureInvestor: 'Mature Investor Focus',
                matureDesc: 'Focus on capital preservation as you approach retirement',
                
                // Glide path
                glidePath: 'Age-Based Glide Path',
                glidePathDesc: 'Returns automatically adjusted based on your time horizon',
                timeHorizon: 'Time Horizon',
                
                // Actions
                applyAdjustments: 'Apply Adjustments',
                reviewReturns: 'Review Returns',
                customizeSettings: 'Customize Settings'
            },
            he: {
                title: 'התאמות תשואה דינמיות',
                subtitle: 'אופטימיזציה של תשואות צפויות על בסיס גיל וסיכון',
                
                // Overview
                adjustment: 'התאמה הוחלה',
                baseReturns: 'תשואות בסיס',
                adjustedReturns: 'תשואות מותאמות גיל',
                yourProfile: 'הפרופיל שלך',
                
                // Profile details
                age: 'גיל',
                yearsToRetirement: 'שנים לפרישה',
                riskTolerance: 'סובלנות סיכון',
                adjustmentFactor: 'מקדם התאמה כללי',
                
                // Asset types
                pension: 'קרן פנסיה',
                trainingFund: 'קרן השתלמות',
                personalPortfolio: 'תיק השקעות אישי',
                realEstate: 'נדל"ן',
                crypto: 'מטבעות דיגיטליים',
                
                // Adjustments
                noAdjustments: 'לא הוחלו התאמות',
                noAdjustmentsDesc: 'הנחות התשואה הנוכחיות שלך מתאימות לגיל ולפרופיל הסיכון שלך',
                
                // Analysis
                impact: 'ניתוח השפעה',
                increaseReturn: 'תשואה מוגברת',
                decreaseReturn: 'תשואה מופחתת',
                noChange: 'ללא שינוי',
                
                // Recommendations
                recommendations: 'המלצות',
                riskLevel: 'רמת סיכון',
                conservative: 'שמרני',
                moderate: 'מתון',
                aggressive: 'אגרסיבי',
                
                // Explanations
                youngInvestor: 'יתרון משקיע צעיר',
                youngDesc: 'בגילך, אתה יכול להרשות לעצמך תנודתיות גבוהה יותר עבור תשואות פוטנציאליות גבוהות יותר',
                matureInvestor: 'התמקדות משקיע בוגר',
                matureDesc: 'התמקדות בשימור הון כשאתה מתקרב לפרישה',
                
                // Glide path
                glidePath: 'מסלול התאמה על בסיס גיל',
                glidePathDesc: 'תשואות מותאמות אוטומטית על בסיס אופק הזמן שלך',
                timeHorizon: 'אופק זמן',
                
                // Actions
                applyAdjustments: 'החל התאמות',
                reviewReturns: 'סקור תשואות',
                customizeSettings: 'התאם אישית הגדרות'
            }
        };

        const t = content[language] || content.en;

        // Get dynamic return analysis
        const dynamicSummary = window.dynamicReturnAssumptions?.getDynamicReturnSummary ? 
            window.dynamicReturnAssumptions.getDynamicReturnSummary(inputs, language) : 
            { hasAdjustments: false };

        const currentAge = inputs.currentAge || 30;
        const retirementAge = inputs.retirementAge || 67;
        const yearsToRetirement = retirementAge - currentAge;
        const riskTolerance = inputs.riskTolerance || 'moderate';

        const formatReturn = (returnValue) => {
            return `${returnValue.toFixed(1)}%`;
        };

        const getChangeColor = (change) => {
            if (change > 0.1) return 'text-green-600';
            if (change < -0.1) return 'text-red-600';
            return 'text-gray-600';
        };

        const getChangeIcon = (change) => {
            if (change > 0.1) return '↗️';
            if (change < -0.1) return '↘️';
            return '➡️';
        };

        const getRiskLabel = (risk) => {
            switch (risk) {
                case 'conservative': return t.conservative;
                case 'aggressive': return t.aggressive;
                case 'moderate': 
                default: return t.moderate;
            }
        };

        if (!dynamicSummary.hasAdjustments) {
            return createElement('div', {
                className: "dynamic-return-panel bg-green-50 rounded-xl p-6 border border-green-200"
            }, [
                createElement('div', {
                    key: 'header',
                    className: 'text-center mb-4'
                }, [
                    createElement('div', { key: 'icon', className: "text-4xl mb-3" }, '✅'),
                    createElement('h3', {
                        key: 'title',
                        className: 'text-xl font-semibold text-green-800 mb-2'
                    }, t.noAdjustments),
                    createElement('p', {
                        key: 'description',
                        className: 'text-green-700'
                    }, t.noAdjustmentsDesc)
                ])
            ]);
        }

        return createElement('div', {
            className: "dynamic-return-panel space-y-6"
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
                    createElement('span', { key: 'icon' }, '📊'),
                    t.title
                ]),
                createElement('p', {
                    key: 'subtitle',
                    className: 'text-gray-600'
                }, t.subtitle)
            ]),

            // Profile Overview
            createElement('div', {
                key: 'profile-overview',
                className: "bg-white rounded-xl p-6 border border-gray-200"
            }, [
                createElement('h4', {
                    key: 'profile-title',
                    className: "text-lg font-semibold text-gray-800 mb-4"
                }, t.yourProfile),

                createElement('div', {
                    key: 'profile-grid',
                    className: "grid grid-cols-2 md:grid-cols-4 gap-4"
                }, [
                    createElement('div', {
                        key: 'age-info',
                        className: "text-center p-3 bg-blue-50 rounded-lg"
                    }, [
                        createElement('div', { 
                            key: 'age-value', 
                            className: "text-2xl font-bold text-blue-600" 
                        }, currentAge),
                        createElement('div', { 
                            key: 'age-label', 
                            className: "text-sm text-blue-700" 
                        }, t.age)
                    ]),

                    createElement('div', {
                        key: 'years-info',
                        className: "text-center p-3 bg-green-50 rounded-lg"
                    }, [
                        createElement('div', { 
                            key: 'years-value', 
                            className: "text-2xl font-bold text-green-600" 
                        }, yearsToRetirement),
                        createElement('div', { 
                            key: 'years-label', 
                            className: "text-sm text-green-700" 
                        }, t.yearsToRetirement)
                    ]),

                    createElement('div', {
                        key: 'risk-info',
                        className: "text-center p-3 bg-purple-50 rounded-lg"
                    }, [
                        createElement('div', { 
                            key: 'risk-value', 
                            className: "text-lg font-bold text-purple-600" 
                        }, getRiskLabel(riskTolerance)),
                        createElement('div', { 
                            key: 'risk-label', 
                            className: "text-sm text-purple-700" 
                        }, t.riskTolerance)
                    ]),

                    createElement('div', {
                        key: 'adjustment-info',
                        className: "text-center p-3 bg-orange-50 rounded-lg"
                    }, [
                        createElement('div', { 
                            key: 'adjustment-value', 
                            className: "text-lg font-bold text-orange-600" 
                        }, `${dynamicSummary.metadata?.timeHorizonEffect > 0 ? '+' : ''}${dynamicSummary.metadata?.timeHorizonEffect || 0}%`),
                        createElement('div', { 
                            key: 'adjustment-label', 
                            className: "text-sm text-orange-700" 
                        }, t.adjustmentFactor)
                    ])
                ])
            ]),

            // Return Adjustments Table
            createElement('div', {
                key: 'adjustments-table',
                className: "bg-white rounded-xl p-6 border border-gray-200"
            }, [
                createElement('h4', {
                    key: 'adjustments-title',
                    className: "text-lg font-semibold text-gray-800 mb-4"
                }, t.adjustment),

                createElement('div', {
                    key: 'adjustments-content',
                    className: "overflow-x-auto"
                }, [
                    createElement('table', {
                        key: 'adjustments-table-content',
                        className: "w-full"
                    }, [
                        createElement('thead', { key: 'table-head' }, [
                            createElement('tr', { key: 'header-row' }, [
                                createElement('th', { 
                                    key: 'asset-header', 
                                    className: "text-left py-2 px-4 font-medium text-gray-700" 
                                }, language === 'he' ? 'נכס' : 'Asset'),
                                createElement('th', { 
                                    key: 'base-header', 
                                    className: "text-center py-2 px-4 font-medium text-gray-700" 
                                }, t.baseReturns),
                                createElement('th', { 
                                    key: 'adjusted-header', 
                                    className: "text-center py-2 px-4 font-medium text-gray-700" 
                                }, t.adjustedReturns),
                                createElement('th', { 
                                    key: 'change-header', 
                                    className: "text-center py-2 px-4 font-medium text-gray-700" 
                                }, language === 'he' ? 'שינוי' : 'Change')
                            ])
                        ]),
                        createElement('tbody', { key: 'table-body' }, 
                            dynamicSummary.changes.map((change, index) => 
                                createElement('tr', {
                                    key: `change-${index}`,
                                    className: "border-t border-gray-100"
                                }, [
                                    createElement('td', { 
                                        key: 'asset-name', 
                                        className: "py-3 px-4 font-medium text-gray-800" 
                                    }, change.assetType),
                                    createElement('td', { 
                                        key: 'base-return', 
                                        className: "py-3 px-4 text-center text-gray-600" 
                                    }, formatReturn(change.baseReturn)),
                                    createElement('td', { 
                                        key: 'adjusted-return', 
                                        className: "py-3 px-4 text-center font-medium text-gray-800" 
                                    }, formatReturn(change.adjustedReturn)),
                                    createElement('td', { 
                                        key: 'change-value', 
                                        className: `py-3 px-4 text-center font-medium ${getChangeColor(change.change)}` 
                                    }, [
                                        createElement('span', { key: 'change-icon', className: "mr-1" }, 
                                            getChangeIcon(change.change)),
                                        `${change.change > 0 ? '+' : ''}${formatReturn(change.change)}`
                                    ])
                                ])
                            )
                        )
                    ])
                ])
            ]),

            // Impact Analysis
            createElement('div', {
                key: 'impact-analysis',
                className: "bg-blue-50 rounded-xl p-6 border border-blue-200"
            }, [
                createElement('h4', {
                    key: 'impact-title',
                    className: "text-lg font-semibold text-blue-800 mb-4"
                }, t.impact),

                createElement('div', {
                    key: 'impact-content',
                    className: "grid grid-cols-1 md:grid-cols-2 gap-4"
                }, [
                    createElement('div', {
                        key: 'explanation',
                        className: "p-4 bg-white rounded-lg"
                    }, [
                        createElement('h5', {
                            key: 'explanation-title',
                            className: "font-medium text-blue-800 mb-2"
                        }, currentAge <= 40 ? t.youngInvestor : t.matureInvestor),
                        createElement('p', {
                            key: 'explanation-text',
                            className: "text-sm text-blue-700"
                        }, currentAge <= 40 ? t.youngDesc : t.matureDesc)
                    ]),

                    createElement('div', {
                        key: 'glide-path',
                        className: "p-4 bg-white rounded-lg"
                    }, [
                        createElement('h5', {
                            key: 'glide-title',
                            className: "font-medium text-blue-800 mb-2"
                        }, t.glidePath),
                        createElement('p', {
                            key: 'glide-text',
                            className: "text-sm text-blue-700 mb-2"
                        }, t.glidePathDesc),
                        createElement('div', {
                            key: 'time-horizon',
                            className: "text-xs text-blue-600"
                        }, `${t.timeHorizon}: ${yearsToRetirement} ${language === 'he' ? 'שנים' : 'years'}`)
                    ])
                ])
            ]),

            // Recommendations
            window.dynamicReturnAssumptions?.getReturnRecommendations && 
            (() => {
                const recommendations = window.dynamicReturnAssumptions.getReturnRecommendations(inputs, language);
                
                if (recommendations.length === 0) return null;

                return createElement('div', {
                    key: 'recommendations',
                    className: "bg-white rounded-xl p-6 border border-gray-200"
                }, [
                    createElement('h4', {
                        key: 'rec-title',
                        className: "text-lg font-semibold text-gray-800 mb-4"
                    }, t.recommendations),

                    createElement('div', {
                        key: 'rec-list',
                        className: "space-y-3"
                    }, recommendations.map((rec, index) => 
                        createElement('div', {
                            key: `rec-${index}`,
                            className: `p-4 rounded-lg border ${
                                rec.priority === 'high' ? 'bg-red-50 border-red-200' :
                                rec.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                                'bg-green-50 border-green-200'
                            }`
                        }, [
                            createElement('h5', {
                                key: 'rec-title',
                                className: `font-medium mb-2 ${
                                    rec.priority === 'high' ? 'text-red-800' :
                                    rec.priority === 'medium' ? 'text-yellow-800' :
                                    'text-green-800'
                                }`
                            }, rec.title),
                            createElement('p', {
                                key: 'rec-description',
                                className: `text-sm mb-2 ${
                                    rec.priority === 'high' ? 'text-red-700' :
                                    rec.priority === 'medium' ? 'text-yellow-700' :
                                    'text-green-700'
                                }`
                            }, rec.description),
                            createElement('div', {
                                key: 'rec-suggestion',
                                className: `text-sm font-medium ${
                                    rec.priority === 'high' ? 'text-red-800' :
                                    rec.priority === 'medium' ? 'text-yellow-800' :
                                    'text-green-800'
                                }`
                            }, `→ ${rec.suggestion}`)
                        ])
                    ))
                ]);
            })(),

            // Summary
            createElement('div', {
                key: 'summary',
                className: "bg-gray-50 rounded-xl p-6 border border-gray-200 text-center"
            }, [
                createElement('div', {
                    key: 'summary-content',
                    className: "text-sm text-gray-700"
                }, dynamicSummary.summary),
                
                dynamicSummary.overallImpact && createElement('div', {
                    key: 'overall-impact',
                    className: `mt-3 text-lg font-medium ${getChangeColor(dynamicSummary.overallImpact)}`
                }, [
                    language === 'he' ? 'השפעה כוללת: ' : 'Overall Impact: ',
                    `${dynamicSummary.overallImpact > 0 ? '+' : ''}${formatReturn(dynamicSummary.overallImpact)}`
                ])
            ])
        ]);
    };

    // Export to window
    window.DynamicReturnAdjustmentPanel = DynamicReturnAdjustmentPanel;

    console.log('✅ Dynamic Return Adjustment Panel component loaded successfully');
})();