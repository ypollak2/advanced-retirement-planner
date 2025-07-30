// CoupleCompatibilityPanel.js - Couple Financial Compatibility Analysis Component
// Extracted from WizardStepReview.js for better modularity

const CoupleCompatibilityPanel = ({ inputs, language = 'en' }) => {
    const createElement = React.createElement;
    
    // Multi-language content
    const content = {
        he: {
            coupleCompatibility: 'תאימות פיננסית לזוגות',
            financialAlignment: 'התאמה פיננסית',
            riskTolerance: 'סובלנות סיכון',
            savingsGoals: 'יעדי חיסכון',
            retirementTiming: 'תזמון פרישה',
            
            // Compatibility levels
            excellent: 'מעולה',
            good: 'טוב',
            moderate: 'בינוני',
            needsWork: 'דורש עבודה',
            
            // Analysis areas
            incomeBalance: 'איזון הכנסות',
            goalAlignment: 'התאמת יעדים',
            riskAlignment: 'התאמת סיכון',
            timelineSync: 'סנכרון זמנים',
            
            // Recommendations
            recommendations: 'המלצות לשיפור התאימות',
            communicationAdvice: 'דיון פתוח על יעדים פיננסיים',
            compromiseStrategy: 'מציאת פשרות באסטרטגיית השקעות',
            regularReview: 'סקירה רגילה של התקדמות',
            
            // Partner labels
            partner1: 'בן/בת זוג ראשון/ה',
            partner2: 'בן/בת זוג שני/ה',
            
            // Scores
            compatibilityScore: 'ציון תאימות',
            overallCompatibility: 'תאימות כללית'
        },
        en: {
            coupleCompatibility: 'Couple Financial Compatibility',
            financialAlignment: 'Financial Alignment',
            riskTolerance: 'Risk Tolerance',
            savingsGoals: 'Savings Goals',
            retirementTiming: 'Retirement Timing',
            
            // Compatibility levels
            excellent: 'Excellent',
            good: 'Good',
            moderate: 'Moderate',
            needsWork: 'Needs Work',
            
            // Analysis areas
            incomeBalance: 'Income Balance',
            goalAlignment: 'Goal Alignment',
            riskAlignment: 'Risk Alignment',
            timelineSync: 'Timeline Sync',
            
            // Recommendations
            recommendations: 'Recommendations for Improving Compatibility',
            communicationAdvice: 'Open discussion about financial goals',
            compromiseStrategy: 'Finding compromises in investment strategy',
            regularReview: 'Regular review of progress',
            
            // Partner labels
            partner1: 'Partner 1',
            partner2: 'Partner 2',
            
            // Scores
            compatibilityScore: 'Compatibility Score',
            overallCompatibility: 'Overall Compatibility'
        }
    };
    
    const t = content[language] || content.en;
    
    // Only show for couple planning
    if (!inputs.partnerPlanningEnabled || !window.CoupleValidation) {
        return null;
    }
    
    const coupleValidation = window.CoupleValidation.validateCoupleData(inputs, inputs, language);
    
    // Helper function to get compatibility color
    const getCompatibilityColor = (score) => {
        if (score >= 85) return 'green';
        if (score >= 70) return 'yellow';
        if (score >= 55) return 'orange';
        return 'red';
    };
    
    // Helper function to get compatibility label
    const getCompatibilityLabel = (score) => {
        if (score >= 85) return t.excellent;
        if (score >= 70) return t.good;
        if (score >= 55) return t.moderate;
        return t.needsWork;
    };
    
    // Calculate compatibility metrics
    const partner1Salary = parseFloat(inputs.partner1Salary || 0);
    const partner2Salary = parseFloat(inputs.partner2Salary || 0);
    const totalIncome = partner1Salary + partner2Salary;
    
    const incomeBalance = totalIncome > 0 ? 
        Math.min(partner1Salary, partner2Salary) / Math.max(partner1Salary, partner2Salary) * 100 : 0;
    
    const partner1Age = parseFloat(inputs.partner1Age || inputs.currentAge || 0);
    const partner2Age = parseFloat(inputs.partner2Age || inputs.partnerAge || 0);
    const ageDifference = Math.abs(partner1Age - partner2Age);
    const timelineSync = Math.max(0, 100 - (ageDifference * 5)); // Reduce score by 5% per year difference
    
    // Risk alignment (simplified calculation)
    const partner1Risk = inputs.partner1RiskTolerance || inputs.riskTolerance || 'moderate';
    const partner2Risk = inputs.partner2RiskTolerance || inputs.riskTolerance || 'moderate';
    const riskMapping = { conservative: 1, moderate: 2, aggressive: 3 };
    const riskDifference = Math.abs((riskMapping[partner1Risk] || 2) - (riskMapping[partner2Risk] || 2));
    const riskAlignment = Math.max(0, 100 - (riskDifference * 25));
    
    // Overall compatibility score
    const overallScore = Math.round((incomeBalance + timelineSync + riskAlignment) / 3);
    
    return createElement('div', {
        className: "bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-6 border border-pink-200 mb-6"
    }, [
        // Header
        createElement('h3', {
            key: 'compatibility-title',
            className: "text-xl font-semibold text-pink-800 mb-4 flex items-center"
        }, [
            createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '💑'),
            t.coupleCompatibility
        ]),
        
        // Overall compatibility score
        createElement('div', {
            key: 'overall-score',
            className: `bg-${getCompatibilityColor(overallScore)}-100 rounded-lg p-4 mb-6 border border-${getCompatibilityColor(overallScore)}-200`
        }, [
            createElement('div', {
                key: 'score-display',
                className: "text-center"
            }, [
                createElement('div', {
                    key: 'score-number',
                    className: `text-3xl font-bold text-${getCompatibilityColor(overallScore)}-700`
                }, `${overallScore}/100`),
                createElement('div', {
                    key: 'score-label',
                    className: `text-lg font-medium text-${getCompatibilityColor(overallScore)}-600 mt-1`
                }, t.overallCompatibility),
                createElement('div', {
                    key: 'score-status',
                    className: `text-sm text-${getCompatibilityColor(overallScore)}-600 mt-1`
                }, getCompatibilityLabel(overallScore))
            ])
        ]),
        
        // Compatibility breakdown grid
        createElement('div', { key: 'compatibility-grid', className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" }, [
            // Income Balance
            createElement('div', {
                key: 'income-balance',
                className: "bg-white rounded-lg p-4 border border-pink-100"
            }, [
                createElement('h4', {
                    key: 'income-title',
                    className: "font-semibold text-pink-700 mb-3 flex items-center"
                }, [
                    createElement('span', { key: 'icon', className: "mr-2" }, '💰'),
                    t.incomeBalance
                ]),
                createElement('div', {
                    key: 'income-score',
                    className: `text-2xl font-bold text-${getCompatibilityColor(incomeBalance)}-600 mb-2`
                }, `${Math.round(incomeBalance)}%`),
                createElement('div', {
                    key: 'income-details',
                    className: "text-sm text-gray-600"
                }, [
                    createElement('div', { key: 'p1-income' }, `${t.partner1}: ₪${partner1Salary.toLocaleString()}`),
                    createElement('div', { key: 'p2-income' }, `${t.partner2}: ₪${partner2Salary.toLocaleString()}`)
                ])
            ]),
            
            // Timeline Sync
            createElement('div', {
                key: 'timeline-sync',
                className: "bg-white rounded-lg p-4 border border-pink-100"
            }, [
                createElement('h4', {
                    key: 'timeline-title',
                    className: "font-semibold text-pink-700 mb-3 flex items-center"
                }, [
                    createElement('span', { key: 'icon', className: "mr-2" }, '⏰'),
                    t.timelineSync
                ]),
                createElement('div', {
                    key: 'timeline-score',
                    className: `text-2xl font-bold text-${getCompatibilityColor(timelineSync)}-600 mb-2`
                }, `${Math.round(timelineSync)}%`),
                createElement('div', {
                    key: 'timeline-details',
                    className: "text-sm text-gray-600"
                }, [
                    createElement('div', { key: 'age-diff' }, `Age difference: ${ageDifference} years`),
                    partner1Age > 0 && createElement('div', { key: 'ages' }, `Ages: ${partner1Age}, ${partner2Age}`)
                ])
            ]),
            
            // Risk Alignment
            createElement('div', {
                key: 'risk-alignment',
                className: "bg-white rounded-lg p-4 border border-pink-100"
            }, [
                createElement('h4', {
                    key: 'risk-title',
                    className: "font-semibold text-pink-700 mb-3 flex items-center"
                }, [
                    createElement('span', { key: 'icon', className: "mr-2" }, '📊'),
                    t.riskAlignment
                ]),
                createElement('div', {
                    key: 'risk-score',
                    className: `text-2xl font-bold text-${getCompatibilityColor(riskAlignment)}-600 mb-2`
                }, `${Math.round(riskAlignment)}%`),
                createElement('div', {
                    key: 'risk-details',
                    className: "text-sm text-gray-600"
                }, [
                    createElement('div', { key: 'p1-risk' }, `${t.partner1}: ${partner1Risk}`),
                    createElement('div', { key: 'p2-risk' }, `${t.partner2}: ${partner2Risk}`)
                ])
            ])
        ]),
        
        // Recommendations section
        overallScore < 70 && createElement('div', {
            key: 'recommendations',
            className: "mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200"
        }, [
            createElement('h4', {
                key: 'rec-title',
                className: "font-semibold text-orange-800 mb-3 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-2" }, '💡'),
                t.recommendations
            ]),
            createElement('ul', {
                key: 'rec-list',
                className: "space-y-2 text-sm text-orange-700"
            }, [
                incomeBalance < 60 && createElement('li', {
                    key: 'income-rec',
                    className: "flex items-start"
                }, [
                    createElement('span', { key: 'bullet', className: "mr-2" }, '•'),
                    'Consider strategies to balance income contributions or adjust savings rates proportionally'
                ]),
                riskAlignment < 60 && createElement('li', {
                    key: 'risk-rec',
                    className: "flex items-start"
                }, [
                    createElement('span', { key: 'bullet', className: "mr-2" }, '•'),
                    t.compromiseStrategy
                ]),
                createElement('li', {
                    key: 'comm-rec',
                    className: "flex items-start"
                }, [
                    createElement('span', { key: 'bullet', className: "mr-2" }, '•'),
                    t.communicationAdvice
                ]),
                createElement('li', {
                    key: 'review-rec',
                    className: "flex items-start"
                }, [
                    createElement('span', { key: 'bullet', className: "mr-2" }, '•'),
                    t.regularReview
                ])
            ])
        ]),
        
        // Validation messages from CoupleValidation
        coupleValidation && coupleValidation.issues && coupleValidation.issues.length > 0 && createElement('div', {
            key: 'validation-issues',
            className: "mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200"
        }, [
            createElement('h4', {
                key: 'issues-title',
                className: "font-semibold text-yellow-800 mb-2"
            }, 'Data Validation Issues'),
            createElement('ul', {
                key: 'issues-list',
                className: "space-y-1 text-sm text-yellow-700"
            }, coupleValidation.issues.map((issue, index) => 
                createElement('li', {
                    key: `issue-${index}`,
                    className: "flex items-start"
                }, [
                    createElement('span', { key: 'bullet', className: "mr-2" }, '⚠️'),
                    issue.message || issue
                ])
            ))
        ])
    ]);
};

// Export to window for global access
window.CoupleCompatibilityPanel = CoupleCompatibilityPanel;

console.log('✅ CoupleCompatibilityPanel component loaded successfully');