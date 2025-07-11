// Analysis Engine Module - Dynamic Module for advanced retirement analysis and insights
// AI-powered analysis and comprehensive retirement planning insights

(function() {
    'use strict';

    // Icon Components
    const BarChart = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '📊');

    const Brain = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '🧠');

    const CheckCircle = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '✅');

    const AlertCircle = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '⚠️');

    const TrendingUp = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '📈');

    const Lightbulb = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '💡');

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

    // Analysis Engine Component
    const AnalysisEngine = ({ inputs, setInputs, language, t }) => {
        
        // Comprehensive retirement analysis
        const analyzeRetirement = () => {
            const currentAge = inputs.currentAge || 30;
            const retirementAge = inputs.retirementAge || 67;
            const currentSalary = inputs.currentMonthlySalary || 15000;
            const currentSavings = inputs.currentSavings || 50000;
            const expectedReturn = (inputs.expectedReturn || 7) / 100;
            const inflationRate = (inputs.inflationRate || 3) / 100;
            
            const yearsToRetirement = retirementAge - currentAge;
            const monthlyContribution = currentSalary * 0.186; // 18.6% pension contribution
            const annualContribution = monthlyContribution * 12;
            
            // Calculate projected accumulation
            const futureValue = currentSavings * Math.pow(1 + expectedReturn, yearsToRetirement) +
                annualContribution * (Math.pow(1 + expectedReturn, yearsToRetirement) - 1) / expectedReturn;
            
            const monthlyIncome = futureValue * expectedReturn / 12;
            const realMonthlyIncome = monthlyIncome / Math.pow(1 + inflationRate, yearsToRetirement);
            
            // Calculate replacement ratio
            const currentRealSalary = currentSalary / Math.pow(1 + inflationRate, yearsToRetirement);
            const replacementRatio = (realMonthlyIncome / currentRealSalary) * 100;
            
            // Analysis insights
            const insights = [];
            const recommendations = [];
            
            // Replacement ratio analysis
            if (replacementRatio >= 80) {
                insights.push({
                    type: 'success',
                    title: language === 'he' ? 'מצב מצוין' : 'Excellent Status',
                    message: language === 'he' ? 
                        `אחוז החלפה של ${replacementRatio.toFixed(0)}% מבטיח פרישה נוחה` :
                        `Replacement ratio of ${replacementRatio.toFixed(0)}% ensures comfortable retirement`
                });
            } else if (replacementRatio >= 70) {
                insights.push({
                    type: 'warning',
                    title: language === 'he' ? 'מצב טוב' : 'Good Status',
                    message: language === 'he' ? 
                        `אחוז החלפה של ${replacementRatio.toFixed(0)}% מספק, אך ניתן לשפר` :
                        `Replacement ratio of ${replacementRatio.toFixed(0)}% is adequate, but can be improved`
                });
                recommendations.push({
                    title: language === 'he' ? 'הגדל הפרשות' : 'Increase Contributions',
                    description: language === 'he' ? 
                        'שקול להגדיל את ההפרשות החודשיות או להוסיף השקעות נוספות' :
                        'Consider increasing monthly contributions or adding additional investments'
                });
            } else {
                insights.push({
                    type: 'danger',
                    title: language === 'he' ? 'זקוק לשיפור' : 'Needs Improvement',
                    message: language === 'he' ? 
                        `אחוז החלפה של ${replacementRatio.toFixed(0)}% נמוך מהמומלץ (70-80%)` :
                        `Replacement ratio of ${replacementRatio.toFixed(0)}% is below recommended (70-80%)`
                });
                recommendations.push({
                    title: language === 'he' ? 'דחה גיל פרישה' : 'Delay Retirement Age',
                    description: language === 'he' ? 
                        'דחיית גיל הפרישה ב-2-3 שנים יכולה לשפר משמעותית את המצב' :
                        'Delaying retirement by 2-3 years can significantly improve the situation'
                });
                recommendations.push({
                    title: language === 'he' ? 'הגדל חיסכון' : 'Increase Savings',
                    description: language === 'he' ? 
                        'הגדל את שיעור החיסכון או הוסף תיק השקעות אישי' :
                        'Increase savings rate or add a personal investment portfolio'
                });
            }
            
            // Age analysis
            if (currentAge < 35) {
                recommendations.push({
                    title: language === 'he' ? 'נצל את כוח הזמן' : 'Leverage Time Power',
                    description: language === 'he' ? 
                        'אתה צעיר - נצל את כוח הריבית דריבית והשקע באגרסיביות' :
                        'You are young - leverage compound interest and invest aggressively'
                });
            } else if (currentAge > 50) {
                recommendations.push({
                    title: language === 'he' ? 'התמקד בשמירה' : 'Focus on Preservation',
                    description: language === 'he' ? 
                        'קרוב לפרישה - הפחת סיכונים ושמור על הצבירה הקיימת' :
                        'Close to retirement - reduce risks and preserve existing accumulation'
                });
            }
            
            // Contribution analysis
            const contributionRate = (monthlyContribution / currentSalary) * 100;
            if (contributionRate < 15) {
                recommendations.push({
                    title: language === 'he' ? 'הגדל הפרשות פנסיה' : 'Increase Pension Contributions',
                    description: language === 'he' ? 
                        `שיעור ההפרשה הנוכחי (${contributionRate.toFixed(1)}%) נמוך מהמומלץ (18-20%)` :
                        `Current contribution rate (${contributionRate.toFixed(1)}%) is below recommended (18-20%)`
                });
            }
            
            return {
                futureValue,
                monthlyIncome,
                realMonthlyIncome,
                replacementRatio,
                insights,
                recommendations,
                contributionRate,
                yearsToRetirement
            };
        };

        // Risk assessment
        const assessRisk = () => {
            const age = inputs.currentAge || 30;
            const riskTolerance = inputs.riskTolerance || 'moderate';
            const yearsToRetirement = (inputs.retirementAge || 67) - age;
            
            let riskScore = 0;
            let riskFactors = [];
            
            // Age factor
            if (age < 35) {
                riskScore += 30;
            } else if (age < 50) {
                riskScore += 20;
            } else {
                riskScore += 10;
                riskFactors.push(language === 'he' ? 
                    'גיל מבוגר מגביל את יכולת הסיכון' : 
                    'Older age limits risk capacity');
            }
            
            // Time horizon factor
            if (yearsToRetirement > 20) {
                riskScore += 25;
            } else if (yearsToRetirement > 10) {
                riskScore += 15;
            } else {
                riskScore += 5;
                riskFactors.push(language === 'he' ? 
                    'זמן קצר עד פרישה מחייב זהירות' : 
                    'Short time to retirement requires caution');
            }
            
            // Risk tolerance factor
            if (riskTolerance === 'aggressive') {
                riskScore += 25;
            } else if (riskTolerance === 'moderate') {
                riskScore += 15;
            } else {
                riskScore += 5;
            }
            
            // Financial stability factor
            const savingsRate = ((inputs.currentMonthlySalary || 15000) * 0.186) / (inputs.currentMonthlySalary || 15000);
            if (savingsRate > 0.2) {
                riskScore += 20;
            } else if (savingsRate > 0.15) {
                riskScore += 10;
            } else {
                riskFactors.push(language === 'he' ? 
                    'שיעור חיסכון נמוך מגביל גמישות' : 
                    'Low savings rate limits flexibility');
            }
            
            let riskLevel = 'low';
            let riskColor = 'red';
            if (riskScore >= 70) {
                riskLevel = 'high';
                riskColor = 'green';
            } else if (riskScore >= 50) {
                riskLevel = 'moderate';
                riskColor = 'yellow';
            }
            
            return {
                riskScore,
                riskLevel,
                riskColor,
                riskFactors
            };
        };

        const analysis = analyzeRetirement();
        const riskAssessment = assessRisk();

        return React.createElement('div', { className: "space-y-6" }, [
            
            // Analysis Header
            React.createElement('div', { 
                key: 'header',
                className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in" 
            }, [
                React.createElement('h2', { 
                    key: 'title',
                    className: "text-2xl font-bold text-blue-700 mb-4 flex items-center" 
                }, [
                    React.createElement(Brain, { key: 'icon', className: "mr-2" }),
                    language === 'he' ? 'מנוע ניתוח מתקדם' : 'Advanced Analysis Engine'
                ]),
                React.createElement('p', {
                    key: 'description',
                    className: "text-gray-600"
                }, language === 'he' ? 
                    'ניתוח מקיף של תוכנית הפרישה שלך עם המלצות מותאמות אישית' :
                    'Comprehensive analysis of your retirement plan with personalized recommendations'
                )
            ]),

            // Key Insights
            React.createElement('div', { 
                key: 'insights',
                className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in" 
            }, [
                React.createElement('h3', { 
                    key: 'title',
                    className: "text-xl font-bold text-green-700 mb-4 flex items-center" 
                }, [
                    React.createElement(BarChart, { key: 'icon', className: "mr-2" }),
                    language === 'he' ? 'תובנות מרכזיות' : 'Key Insights'
                ]),
                React.createElement('div', { 
                    key: 'insights-list',
                    className: "space-y-3" 
                }, analysis.insights.map((insight, index) =>
                    React.createElement('div', {
                        key: insight.id || insight.title || index,
                        className: `p-4 rounded-lg border-l-4 ${
                            insight.type === 'success' ? 'bg-green-50 border-green-500' :
                            insight.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                            'bg-red-50 border-red-500'
                        }`
                    }, [
                        React.createElement('div', { 
                            key: 'title',
                            className: `font-semibold ${
                                insight.type === 'success' ? 'text-green-800' :
                                insight.type === 'warning' ? 'text-yellow-800' :
                                'text-red-800'
                            } flex items-center`
                        }, [
                            React.createElement(insight.type === 'success' ? CheckCircle : AlertCircle, { 
                                key: 'icon', 
                                className: "mr-2" 
                            }),
                            insight.title
                        ]),
                        React.createElement('div', { 
                            key: 'message',
                            className: "text-gray-700 mt-1" 
                        }, insight.message)
                    ])
                ))
            ]),

            // Financial Projections
            React.createElement('div', { 
                key: 'projections',
                className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in" 
            }, [
                React.createElement('h3', { 
                    key: 'title',
                    className: "text-xl font-bold text-purple-700 mb-4 flex items-center" 
                }, [
                    React.createElement(TrendingUp, { key: 'icon', className: "mr-2" }),
                    language === 'he' ? 'תחזיות פיננסיות' : 'Financial Projections'
                ]),
                React.createElement('div', { 
                    key: 'metrics',
                    className: "grid grid-cols-2 md:grid-cols-4 gap-4" 
                }, [
                    React.createElement('div', { 
                        key: 'accumulation',
                        className: "bg-blue-50 rounded-lg p-4 text-center" 
                    }, [
                        React.createElement('div', { 
                            key: 'value',
                            className: "text-2xl font-bold text-blue-700 currency-format" 
                        }, formatCurrency(analysis.futureValue)),
                        React.createElement('div', { 
                            key: 'label',
                            className: "text-sm text-gray-600" 
                        }, language === 'he' ? 'צבירה בפרישה' : 'Retirement Accumulation')
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-income',
                        className: "bg-green-50 rounded-lg p-4 text-center" 
                    }, [
                        React.createElement('div', { 
                            key: 'value',
                            className: "text-2xl font-bold text-green-700 currency-format" 
                        }, formatCurrency(analysis.monthlyIncome)),
                        React.createElement('div', { 
                            key: 'label',
                            className: "text-sm text-gray-600" 
                        }, language === 'he' ? 'הכנסה חודשית' : 'Monthly Income')
                    ]),
                    React.createElement('div', { 
                        key: 'replacement-ratio',
                        className: "bg-orange-50 rounded-lg p-4 text-center" 
                    }, [
                        React.createElement('div', { 
                            key: 'value',
                            className: "text-2xl font-bold text-orange-700" 
                        }, `${analysis.replacementRatio.toFixed(0)}%`),
                        React.createElement('div', { 
                            key: 'label',
                            className: "text-sm text-gray-600" 
                        }, language === 'he' ? 'אחוז החלפה' : 'Replacement Ratio')
                    ]),
                    React.createElement('div', { 
                        key: 'years-left',
                        className: "bg-purple-50 rounded-lg p-4 text-center" 
                    }, [
                        React.createElement('div', { 
                            key: 'value',
                            className: "text-2xl font-bold text-purple-700" 
                        }, analysis.yearsToRetirement),
                        React.createElement('div', { 
                            key: 'label',
                            className: "text-sm text-gray-600" 
                        }, language === 'he' ? 'שנים עד פרישה' : 'Years to Retirement')
                    ])
                ])
            ]),

            // Risk Assessment
            React.createElement('div', { 
                key: 'risk-assessment',
                className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in" 
            }, [
                React.createElement('h3', { 
                    key: 'title',
                    className: "text-xl font-bold text-red-700 mb-4 flex items-center" 
                }, [
                    React.createElement(AlertCircle, { key: 'icon', className: "mr-2" }),
                    language === 'he' ? 'הערכת סיכונים' : 'Risk Assessment'
                ]),
                React.createElement('div', { 
                    key: 'risk-content',
                    className: "grid md:grid-cols-2 gap-6" 
                }, [
                    React.createElement('div', { key: 'risk-score' }, [
                        React.createElement('div', { 
                            className: `text-center p-6 rounded-lg bg-${riskAssessment.riskColor}-50 border border-${riskAssessment.riskColor}-200` 
                        }, [
                            React.createElement('div', { 
                                className: `text-4xl font-bold text-${riskAssessment.riskColor}-700` 
                            }, `${riskAssessment.riskScore}/100`),
                            React.createElement('div', { 
                                className: "text-lg font-semibold mt-2" 
                            }, language === 'he' ? 
                                `רמת סיכון: ${riskAssessment.riskLevel === 'high' ? 'גבוהה' : 
                                             riskAssessment.riskLevel === 'moderate' ? 'בינונית' : 'נמוכה'}` :
                                `Risk Level: ${riskAssessment.riskLevel.charAt(0).toUpperCase() + riskAssessment.riskLevel.slice(1)}`
                            )
                        ])
                    ]),
                    React.createElement('div', { key: 'risk-factors' }, [
                        React.createElement('h4', { 
                            className: "font-semibold text-gray-800 mb-2" 
                        }, language === 'he' ? 'גורמי סיכון:' : 'Risk Factors:'),
                        riskAssessment.riskFactors.length > 0 ? 
                            React.createElement('ul', { className: "space-y-2" }, 
                                riskAssessment.riskFactors.map((factor, index) =>
                                    React.createElement('li', {
                                        key: factor.id || factor.title || factor || index,
                                        className: "text-sm text-gray-600 flex items-center"
                                    }, [
                                        React.createElement(AlertCircle, { key: 'icon', className: "mr-2 text-orange-500" }),
                                        factor
                                    ])
                                )
                            ) :
                            React.createElement('p', { 
                                className: "text-sm text-green-600 flex items-center" 
                            }, [
                                React.createElement(CheckCircle, { key: 'icon', className: "mr-2" }),
                                language === 'he' ? 'לא זוהו גורמי סיכון משמעותיים' : 'No significant risk factors identified'
                            ])
                    ])
                ])
            ]),

            // Recommendations
            analysis.recommendations.length > 0 && React.createElement('div', { 
                key: 'recommendations',
                className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in" 
            }, [
                React.createElement('h3', { 
                    key: 'title',
                    className: "text-xl font-bold text-indigo-700 mb-4 flex items-center" 
                }, [
                    React.createElement(Lightbulb, { key: 'icon', className: "mr-2" }),
                    language === 'he' ? 'המלצות לשיפור' : 'Improvement Recommendations'
                ]),
                React.createElement('div', { 
                    key: 'recommendations-list',
                    className: "space-y-4" 
                }, analysis.recommendations.map((rec, index) =>
                    React.createElement('div', {
                        key: rec.id || rec.title || index,
                        className: "bg-indigo-50 border border-indigo-200 rounded-lg p-4"
                    }, [
                        React.createElement('h4', { 
                            key: 'title',
                            className: "font-semibold text-indigo-800 mb-2" 
                        }, rec.title),
                        React.createElement('p', { 
                            key: 'description',
                            className: "text-gray-700 text-sm" 
                        }, rec.description)
                    ])
                ))
            ])
        ]);
    };

    // Export to global window object
    window.AnalysisEngine = AnalysisEngine;
    
    console.log('✅ Analysis Engine module loaded successfully');

})();