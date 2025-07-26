// ScoreExplanation.js - Detailed score breakdown and explanation component
// Provides comprehensive explanations for financial health score components

const ScoreExplanation = ({ 
    scoreType, 
    score, 
    threshold = null,
    language = 'en',
    showThresholds = true,
    showImprovement = true 
}) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    // Score explanation content
    const explanations = {
        he: {
            'savings-rate': {
                title: 'שיעור החיסכון',
                description: 'האחוז מההכנסה החודשית שאתה מחסיף לפנסיה',
                calculation: 'חיסכון חודשי ÷ הכנסה חודשית × 100',
                thresholds: {
                    excellent: '90-100: שיעור חיסכון של 20%+ מההכנסה - מצוין!',
                    good: '70-89: שיעור חיסכון של 15-20% - טוב מאוד',
                    fair: '50-69: שיעור חיסכון של 10-15% - סביר',
                    poor: '30-49: שיעור חיסכון של 5-10% - זקוק לשיפור',
                    critical: '0-29: שיעור חיסכון מתחת ל-5% - דרוש פעולה דחופה'
                },
                improvements: [
                    'הגדל את שיעור החיסכון בהדרגה ב-1% כל חצי שנה',
                    'השתמש ב"תקציב 50/30/20" - 20% לחיסכון',
                    'הפקד העלאות שכר ישירות לחיסכון פנסיה',
                    'בדוק הוצאות שאפשר לקצץ ולהעביר לחיסכון'
                ]
            },
            'retirement-readiness': {
                title: 'מוכנות לפנסיה',
                description: 'עד כמה אתה מוכן להגיע ליעד הפנסיה שלך',
                calculation: 'צבירה צפויה ÷ יעד פנסיה × 100',
                thresholds: {
                    excellent: '90-100: צפוי להגיע ליעד הפנסיה ויותר',
                    good: '70-89: צפוי להגיע ל-80-100% מיעד הפנסיה',
                    fair: '50-69: צפוי להגיע ל-60-80% מיעד הפנסיה',
                    poor: '30-49: צפוי להגיע ל-40-60% מיעד הפנסיה',
                    critical: '0-29: צפוי להגיע לפחות מ-40% מיעד הפנסיה'
                },
                improvements: [
                    'הגדל את ההפקדות החודשיות לקרן פנסיה',
                    'שקול השקעות נוספות מחוץ לקרן פנסיה',
                    'דחה את גיל הפרישה ב-2-3 שנים',
                    'צמצם את הוצאות הפנסיה המתוכננות'
                ]
            },
            'risk-alignment': {
                title: 'התאמת סיכון',
                description: 'עד כמה חלוקת ההשקעות מתאימה לגילך ולזמן שנותר עד הפנסיה',
                calculation: 'מבוסס על גיל, זמן עד פנסיה, וחלוקת נכסים',
                thresholds: {
                    excellent: '90-100: חלוקת נכסים מושלמת לגילך',
                    good: '70-89: חלוקת נכסים טובה עם מקום לשיפור קטן',
                    fair: '50-69: חלוקת נכסים לא אופטימלית',
                    poor: '30-49: חלוקת נכסים לא מתאימה לגילך',
                    critical: '0-29: חלוקת נכסים בעייתית - דורשת תיקון מיידי'
                },
                improvements: [
                    'צעירים: הגדל את אחוז המניות לפי הנוסחה "100 מינוס הגיל"',
                    'מבוגרים: הגדל את אחוז האג"ח והנכסים הבטוחים',
                    'השתמש בקרנות מדד במקום מניות בודדות',
                    'פזר השקעות בין מטבעות ושווקים שונים'
                ]
            },
            'tax-efficiency': {
                title: 'יעילות מס',
                description: 'עד כמה אתה מנצל כלי חיסכון מוטבי מס',
                calculation: 'מבוסס על ניצול קרן פנסיה, קרן השתלמות, וחיסכון רגיל',
                thresholds: {
                    excellent: '90-100: מנצל באופן מלא את כלי החיסכון מוטבי המס',
                    good: '70-89: מנצל טוב את הכלים, עם מקום לשיפור',
                    fair: '50-69: ניצול חלקי של הכלים מוטבי המס',
                    poor: '30-49: ניצול נמוך של הכלים מוטבי המס',
                    critical: '0-29: כמעט לא מנצל כלים מוטבי מס'
                },
                improvements: [
                    'מקסם הפקדות לקרן פנסיה (עד התקרה)',
                    'הפקד לקרן השתלמות (2.5% עובד + 7.5% מעסיק)',
                    'שקול השקעה בפקדונות ואג"ח ממשלתיות',
                    'תכנן משיכות בפרישה לצמצום מס'
                ]
            },
            'diversification': {
                title: 'פיזור השקעות',
                description: 'עד כמה ההשקעות שלך מפוזרות בין נכסים, מטבעות ושווקים',
                calculation: 'מבוסס על פיזור בין מניות, אג"ח, נדל"ן, מטבח"ז',
                thresholds: {
                    excellent: '90-100: פיזור מושלם בין כל סוגי הנכסים',
                    good: '70-89: פיזור טוב עם מקום לשיפור קטן',
                    fair: '50-69: פיזור חלקי - צריך לשפר',
                    poor: '30-49: פיזור נמוך - השקעות מרוכזות מדי',
                    critical: '0-29: אין פיזור - סיכון גבוה מאוד'
                },
                improvements: [
                    'הוסף נכסים שונים: מניות, אג"ח, נדל"ן, מטבח"ז',
                    'פזר בין שווקים: ישראל, ארה"ב, אירופה, אסיה',
                    'השתמש בקרנות מדד למגזרים שונים',
                    'הגדר מטרה של לפחות 10 נכסים שונים'
                ]
            }
        },
        en: {
            'savings-rate': {
                title: 'Savings Rate Score',
                description: 'The percentage of monthly income you save for retirement',
                calculation: 'Monthly Savings ÷ Monthly Income × 100',
                thresholds: {
                    excellent: '90-100: Savings rate of 20%+  of income - Excellent!',
                    good: '70-89: Savings rate of 15-20% - Very good',
                    fair: '50-69: Savings rate of 10-15% - Fair',
                    poor: '30-49: Savings rate of 5-10% - Needs improvement',
                    critical: '0-29: Savings rate below 5% - Immediate action required'
                },
                improvements: [
                    'Gradually increase savings rate by 1% every six months',
                    'Use "50/30/20 budget" - 20% for savings',
                    'Invest salary raises directly into retirement savings',
                    'Review expenses to find areas to cut and redirect to savings'
                ]
            },
            'retirement-readiness': {
                title: 'Retirement Readiness',
                description: 'How prepared you are to reach your retirement goal',
                calculation: 'Projected Accumulation ÷ Retirement Goal × 100',
                thresholds: {
                    excellent: '90-100: Expected to reach retirement goal and beyond',
                    good: '70-89: Expected to reach 80-100% of retirement goal',
                    fair: '50-69: Expected to reach 60-80% of retirement goal',
                    poor: '30-49: Expected to reach 40-60% of retirement goal',
                    critical: '0-29: Expected to reach less than 40% of retirement goal'
                },
                improvements: [
                    'Increase monthly contributions to pension fund',
                    'Consider additional investments outside pension fund',
                    'Delay retirement by 2-3 years',
                    'Reduce planned retirement expenses'
                ]
            },
            'risk-alignment': {
                title: 'Risk Alignment',
                description: 'How well your investment allocation matches your age and time to retirement',
                calculation: 'Based on age, time to retirement, and asset allocation',
                thresholds: {
                    excellent: '90-100: Perfect asset allocation for your age',
                    good: '70-89: Good asset allocation with room for small improvement',
                    fair: '50-69: Sub-optimal asset allocation',
                    poor: '30-49: Asset allocation not suitable for your age',
                    critical: '0-29: Problematic asset allocation - requires immediate correction'
                },
                improvements: [
                    'Young: Increase stock percentage using "100 minus age" formula',
                    'Older: Increase bond and safe asset percentage',
                    'Use index funds instead of individual stocks',
                    'Diversify across currencies and markets'
                ]
            },
            'tax-efficiency': {
                title: 'Tax Efficiency',
                description: 'How well you utilize tax-advantaged savings vehicles',
                calculation: 'Based on pension fund, training fund, and regular savings utilization',
                thresholds: {
                    excellent: '90-100: Fully utilizing tax-advantaged savings tools',
                    good: '70-89: Good utilization with room for improvement',
                    fair: '50-69: Partial utilization of tax-advantaged tools',
                    poor: '30-49: Low utilization of tax-advantaged tools',
                    critical: '0-29: Barely utilizing tax-advantaged tools'
                },
                improvements: [
                    'Maximize pension fund contributions (up to ceiling)',
                    'Contribute to training fund (2.5% employee + 7.5% employer)',
                    'Consider deposits and government bonds',
                    'Plan retirement withdrawals to minimize taxes'
                ]
            },
            'diversification': {
                title: 'Diversification',
                description: 'How well your investments are spread across assets, currencies, and markets',
                calculation: 'Based on diversification across stocks, bonds, real estate, foreign currency',
                thresholds: {
                    excellent: '90-100: Perfect diversification across all asset types',
                    good: '70-89: Good diversification with room for small improvement',
                    fair: '50-69: Partial diversification - needs improvement',
                    poor: '30-49: Low diversification - investments too concentrated',
                    critical: '0-29: No diversification - very high risk'
                },
                improvements: [
                    'Add different assets: stocks, bonds, real estate, foreign currency',
                    'Diversify across markets: Israel, US, Europe, Asia',
                    'Use index funds for different sectors',
                    'Target at least 10 different assets'
                ]
            }
        }
    };

    const getScoreCategory = (score) => {
        if (score >= 90) return 'excellent';
        if (score >= 70) return 'good';
        if (score >= 50) return 'fair';
        if (score >= 30) return 'poor';
        return 'critical';
    };

    const getScoreColor = (score) => {
        if (score >= 90) return '#10B981'; // Green
        if (score >= 70) return '#3B82F6'; // Blue  
        if (score >= 50) return '#F59E0B'; // Yellow
        if (score >= 30) return '#EF4444'; // Red
        return '#DC2626'; // Dark red
    };

    const t = explanations[language] || explanations['en'];
    const explanation = t[scoreType];
    
    if (!explanation) {
        return React.createElement('div', {
            className: 'text-sm text-gray-500'
        }, language === 'he' ? 'אין הסבר זמין' : 'No explanation available');
    }

    const category = getScoreCategory(score);
    const color = getScoreColor(score);

    return React.createElement('div', {
        className: 'score-explanation border border-gray-200 rounded-lg overflow-hidden'
    }, [
        // Header with score and expand button
        React.createElement('div', {
            key: 'header',
            className: 'flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors',
            onClick: () => setIsExpanded(!isExpanded)
        }, [
            React.createElement('div', {
                key: 'score-info',
                className: 'flex items-center gap-3'
            }, [
                React.createElement('div', {
                    key: 'score-circle',
                    className: 'flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm',
                    style: { backgroundColor: color }
                }, score),
                React.createElement('div', {
                    key: 'title-desc'
                }, [
                    React.createElement('h4', {
                        key: 'title',
                        className: 'font-semibold text-gray-900'
                    }, explanation.title),
                    React.createElement('p', {
                        key: 'description',
                        className: 'text-sm text-gray-600'
                    }, explanation.description)
                ])
            ]),
            React.createElement('button', {
                key: 'expand-btn',
                className: `transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''} text-gray-400 hover:text-gray-600`,
                'aria-label': language === 'he' ? 'הרחב פרטים' : 'Expand details'
            }, '▼')
        ]),

        // Expanded content
        isExpanded && React.createElement('div', {
            key: 'expanded-content',
            className: 'p-4 space-y-4 bg-white'
        }, [
            // Calculation method
            React.createElement('div', {
                key: 'calculation'
            }, [
                React.createElement('h5', {
                    key: 'calc-title',
                    className: 'font-semibold text-gray-800 mb-1'
                }, language === 'he' ? 'איך מחושב:' : 'How it\'s calculated:'),
                React.createElement('p', {
                    key: 'calc-desc',
                    className: 'text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded'
                }, explanation.calculation)
            ]),

            // Score thresholds
            showThresholds && React.createElement('div', {
                key: 'thresholds'
            }, [
                React.createElement('h5', {
                    key: 'thresh-title',
                    className: 'font-semibold text-gray-800 mb-2'
                }, language === 'he' ? 'רמות ציון:' : 'Score Levels:'),
                React.createElement('div', {
                    key: 'thresh-list',
                    className: 'space-y-1'
                }, Object.entries(explanation.thresholds).map(([level, desc]) => 
                    React.createElement('div', {
                        key: level,
                        className: `text-sm p-2 rounded ${category === level ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`
                    }, [
                        React.createElement('span', {
                            key: 'level-indicator',
                            className: 'inline-block w-2 h-2 rounded-full mr-2',
                            style: { 
                                backgroundColor: level === 'excellent' ? '#10B981' :
                                              level === 'good' ? '#3B82F6' :
                                              level === 'fair' ? '#F59E0B' :
                                              level === 'poor' ? '#EF4444' : '#DC2626'
                            }
                        }),
                        React.createElement('span', {
                            key: 'level-desc',
                            className: category === level ? 'font-medium text-blue-800' : 'text-gray-700'
                        }, desc)
                    ])
                ))
            ]),

            // Improvement suggestions
            showImprovement && score < 90 && React.createElement('div', {
                key: 'improvements'
            }, [
                React.createElement('h5', {
                    key: 'improve-title',
                    className: 'font-semibold text-gray-800 mb-2'
                }, language === 'he' ? 'דרכים לשיפור:' : 'Ways to improve:'),
                React.createElement('ul', {
                    key: 'improve-list',
                    className: 'space-y-1'
                }, explanation.improvements.map((improvement, index) =>
                    React.createElement('li', {
                        key: index,
                        className: 'flex items-start text-sm text-gray-700'
                    }, [
                        React.createElement('span', {
                            key: 'bullet',
                            className: 'inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0'
                        }),
                        React.createElement('span', {
                            key: 'text'
                        }, improvement)
                    ])
                ))
            ])
        ])
    ]);
};

// Export to window for global access
window.ScoreExplanation = ScoreExplanation;
console.log('✅ ScoreExplanation component loaded successfully');