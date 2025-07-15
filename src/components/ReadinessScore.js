// ReadinessScore.js - Retirement Readiness Scoring Component
// Provides 0-100 readiness score with color-coded feedback and actionable recommendations

const ReadinessScore = ({ 
    currentAge, 
    retirementAge, 
    currentSavings, 
    monthlyContribution, 
    targetRetirementIncome, 
    language = 'en' 
}) => {
    const [score, setScore] = React.useState(0);
    const [scoreDetails, setScoreDetails] = React.useState({});
    const [recommendations, setRecommendations] = React.useState([]);

    // Multi-language content
    const content = {
        he: {
            title: 'דירוג מוכנות לפנסיה',
            subtitle: 'הערכת מצבך הנוכחי ודרכים לשיפור',
            scoreLabel: 'ציון מוכנות',
            outOf: 'מתוך 100',
            categories: {
                excellent: 'מצוין',
                good: 'טוב',
                fair: 'בינוני',
                poor: 'זקוק לשיפור',
                critical: 'דרוש פעולה דחופה'
            },
            factors: {
                savingsRate: 'שיעור החיסכון',
                timeHorizon: 'זמן עד הפנסיה',
                currentSavings: 'חיסכון נוכחי',
                retirementGoal: 'התקדמות ליעד הפנסיה',
                riskManagement: 'ניהול סיכונים'
            },
            recommendations: {
                title: 'המלצות לשיפור',
                increaseSavings: 'הגדל את שיעור החיסכון ב-{amount}%',
                diversifyInvestments: 'פזר את ההשקעות על פני נכסים שונים',
                delayRetirement: 'שקול דחיית גיל הפנסיה ב-{years} שנים',
                reduceExpenses: 'הפחת הוצאות בפנסיה ב-{amount}%',
                increaseIncome: 'שקול דרכים להגדיל את ההכנסה הנוכחית',
                emergencyFund: 'בנה קרן חירום של 6-12 חודשים הוצאות'
            }
        },
        en: {
            title: 'Retirement Readiness Score',
            subtitle: 'Assessment of your current status and improvement paths',
            scoreLabel: 'Readiness Score',
            outOf: 'out of 100',
            categories: {
                excellent: 'Excellent',
                good: 'Good',
                fair: 'Fair',
                poor: 'Needs Improvement',
                critical: 'Immediate Action Required'
            },
            factors: {
                savingsRate: 'Savings Rate',
                timeHorizon: 'Time to Retirement',
                currentSavings: 'Current Savings',
                retirementGoal: 'Retirement Goal Progress',
                riskManagement: 'Risk Management'
            },
            recommendations: {
                title: 'Recommendations for Improvement',
                increaseSavings: 'Increase savings rate by {amount}%',
                diversifyInvestments: 'Diversify investments across asset classes',
                delayRetirement: 'Consider delaying retirement by {years} years',
                reduceExpenses: 'Reduce retirement expenses by {amount}%',
                increaseIncome: 'Explore ways to increase current income',
                emergencyFund: 'Build emergency fund of 6-12 months expenses'
            }
        }
    };

    const t = content[language];

    // Calculate retirement readiness score
    React.useEffect(() => {
        const calculateReadinessScore = () => {
            const yearsToRetirement = retirementAge - currentAge;
            const monthlySavings = monthlyContribution || 0;
            const currentTotal = currentSavings || 0;
            const targetMonthlyIncome = targetRetirementIncome || 0;
            
            // Estimated retirement savings needed (25x annual expenses rule)
            const targetRetirementSavings = targetMonthlyIncome * 12 * 25;
            
            // Projected savings at retirement (simple compound interest at 7% annually)
            const annualReturn = 0.07;
            const monthlyReturn = annualReturn / 12;
            const totalMonths = yearsToRetirement * 12;
            
            // Future value of current savings
            const futureCurrentSavings = currentTotal * Math.pow(1 + annualReturn, yearsToRetirement);
            
            // Future value of monthly contributions
            const futureContributions = monthlySavings * 
                (Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn;
            
            const projectedTotalSavings = futureCurrentSavings + futureContributions;
            
            // Calculate score factors
            const factors = {
                savingsRate: calculateSavingsRateScore(monthlySavings, targetMonthlyIncome),
                timeHorizon: calculateTimeHorizonScore(yearsToRetirement),
                currentSavings: calculateCurrentSavingsScore(currentTotal, currentAge),
                retirementGoal: calculateRetirementGoalScore(projectedTotalSavings, targetRetirementSavings),
                riskManagement: calculateRiskScore(currentAge, yearsToRetirement)
            };
            
            // Weighted average (different weights for different factors)
            const weights = {
                savingsRate: 0.3,
                timeHorizon: 0.2,
                currentSavings: 0.2,
                retirementGoal: 0.2,
                riskManagement: 0.1
            };
            
            const totalScore = Object.keys(factors).reduce((sum, key) => {
                return sum + (factors[key] * weights[key]);
            }, 0);
            
            const finalScore = Math.round(Math.max(0, Math.min(100, totalScore)));
            
            setScore(finalScore);
            setScoreDetails({
                ...factors,
                retirementGoal: projectedTotalSavings,
                targetSavings: targetRetirementSavings,
                shortfall: Math.max(0, targetRetirementSavings - projectedTotalSavings)
            });
            
            // Generate recommendations
            setRecommendations(generateRecommendations(finalScore, factors, {
                projectedTotalSavings,
                targetRetirementSavings,
                monthlySavings,
                yearsToRetirement
            }));
        };

        if (currentAge && retirementAge && retirementAge > currentAge) {
            calculateReadinessScore();
        }
    }, [currentAge, retirementAge, currentSavings, monthlyContribution, targetRetirementIncome]);

    // Helper functions for score calculation
    const calculateSavingsRateScore = (monthlySavings, targetIncome) => {
        const annualSavings = monthlySavings * 12;
        const annualTargetIncome = targetIncome * 12;
        
        if (annualTargetIncome === 0) return 50; // Default if no target set
        
        const savingsRate = annualSavings / annualTargetIncome;
        
        // Score based on savings rate relative to target income
        if (savingsRate >= 0.2) return 100; // 20%+ is excellent
        if (savingsRate >= 0.15) return 85;  // 15-20% is very good
        if (savingsRate >= 0.10) return 70;  // 10-15% is good
        if (savingsRate >= 0.05) return 50;  // 5-10% is fair
        return Math.max(0, savingsRate * 1000); // Below 5% scales linearly
    };

    const calculateTimeHorizonScore = (years) => {
        if (years >= 30) return 100; // 30+ years is excellent
        if (years >= 20) return 85;  // 20-30 years is very good
        if (years >= 15) return 70;  // 15-20 years is good
        if (years >= 10) return 50;  // 10-15 years is fair
        if (years >= 5) return 25;   // 5-10 years is challenging
        return 10; // Less than 5 years is critical
    };

    const calculateCurrentSavingsScore = (savings, age) => {
        // Rule of thumb: savings should be 1x income by 30, 3x by 40, 6x by 50, etc.
        const targetMultiplier = Math.max(0, (age - 25) / 5);
        const estimatedAnnualIncome = 60000; // Default assumption, could be improved
        const targetSavings = targetMultiplier * estimatedAnnualIncome;
        
        if (targetSavings === 0) return 50; // No target for very young people
        
        const ratio = savings / targetSavings;
        return Math.min(100, ratio * 100);
    };

    const calculateRetirementGoalScore = (projected, target) => {
        if (target === 0) return 50; // Default if no target
        
        const ratio = projected / target;
        if (ratio >= 1.2) return 100; // 120%+ of target is excellent
        if (ratio >= 1.0) return 90;  // 100-120% is very good
        if (ratio >= 0.8) return 75;  // 80-100% is good
        if (ratio >= 0.6) return 60;  // 60-80% is fair
        if (ratio >= 0.4) return 40;  // 40-60% needs work
        return Math.max(0, ratio * 100); // Below 40% scales linearly
    };

    const calculateRiskScore = (age, yearsToRetirement) => {
        // Risk management score based on age and time horizon
        if (yearsToRetirement > 20) return 90; // Plenty of time to recover
        if (yearsToRetirement > 10) return 75; // Moderate time
        if (yearsToRetirement > 5) return 60;  // Limited time
        return 40; // Very limited time, high risk
    };

    const generateRecommendations = (score, factors, details) => {
        const recs = [];
        
        if (factors.savingsRate < 70) {
            const increaseNeeded = Math.ceil((70 - factors.savingsRate) / 10);
            recs.push({
                type: 'savings',
                priority: 'high',
                text: t.recommendations.increaseSavings.replace('{amount}', increaseNeeded * 2)
            });
        }
        
        if (factors.retirementGoal < 80) {
            const yearsDelay = Math.ceil((100 - factors.retirementGoal) / 20);
            recs.push({
                type: 'timeline',
                priority: 'medium',
                text: t.recommendations.delayRetirement.replace('{years}', yearsDelay)
            });
        }
        
        if (factors.currentSavings < 50) {
            recs.push({
                type: 'income',
                priority: 'high',
                text: t.recommendations.increaseIncome
            });
        }
        
        if (score < 60) {
            recs.push({
                type: 'expenses',
                priority: 'medium',
                text: t.recommendations.reduceExpenses.replace('{amount}', '10-20')
            });
        }
        
        // Always recommend diversification
        recs.push({
            type: 'risk',
            priority: 'low',
            text: t.recommendations.diversifyInvestments
        });
        
        return recs;
    };

    const getScoreCategory = (score) => {
        if (score >= 90) return { key: 'excellent', color: '#10B981' };
        if (score >= 75) return { key: 'good', color: '#3B82F6' };
        if (score >= 60) return { key: 'fair', color: '#F59E0B' };
        if (score >= 40) return { key: 'poor', color: '#EF4444' };
        return { key: 'critical', color: '#DC2626' };
    };

    const category = getScoreCategory(score);

    return React.createElement('div', {
        className: 'readiness-score bg-white rounded-lg shadow-lg p-6 border-r-4',
        style: { borderRightColor: category.color },
        role: 'region',
        'aria-label': t.title
    }, [
        // Header
        React.createElement('div', { key: 'header', className: 'mb-6' }, [
            React.createElement('h3', {
                key: 'title',
                className: 'text-xl font-bold text-gray-800 mb-2'
            }, t.title),
            React.createElement('p', {
                key: 'subtitle',
                className: 'text-gray-600 text-sm'
            }, t.subtitle)
        ]),

        // Score Display
        React.createElement('div', { key: 'score-display', className: 'flex items-center justify-center mb-6' }, [
            React.createElement('div', {
                key: 'score-circle',
                className: 'relative w-32 h-32 rounded-full flex items-center justify-center',
                style: {
                    background: `conic-gradient(${category.color} ${score * 3.6}deg, #e5e7eb 0deg)`
                }
            }, [
                React.createElement('div', {
                    key: 'inner-circle',
                    className: 'w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center'
                }, [
                    React.createElement('span', {
                        key: 'score-number',
                        className: 'text-3xl font-bold',
                        style: { color: category.color }
                    }, score),
                    React.createElement('span', {
                        key: 'out-of',
                        className: 'text-xs text-gray-500'
                    }, t.outOf)
                ])
            ]),
            React.createElement('div', {
                key: 'score-category',
                className: 'ml-6'
            }, [
                React.createElement('div', {
                    key: 'category-label',
                    className: 'px-3 py-1 rounded-full text-sm font-semibold text-white',
                    style: { backgroundColor: category.color }
                }, t.categories[category.key])
            ])
        ]),

        // Score Details
        React.createElement('div', { key: 'score-details', className: 'mb-6' }, [
            React.createElement('h4', {
                key: 'factors-title',
                className: 'text-lg font-semibold text-gray-800 mb-3'
            }, language === 'he' ? 'פירוט הציון' : 'Score Breakdown'),
            React.createElement('div', {
                key: 'factors-grid',
                className: 'grid grid-cols-1 md:grid-cols-2 gap-3'
            }, Object.keys(scoreDetails).filter(key => 
                ['savingsRate', 'timeHorizon', 'currentSavings', 'retirementGoal', 'riskManagement'].includes(key)
            ).map(key => 
                React.createElement('div', {
                    key: key,
                    className: 'flex justify-between items-center p-2 bg-gray-50 rounded'
                }, [
                    React.createElement('span', {
                        key: 'factor-name',
                        className: 'text-sm text-gray-700'
                    }, t.factors[key] || key),
                    React.createElement('span', {
                        key: 'factor-score',
                        className: 'text-sm font-semibold',
                        style: { color: scoreDetails[key] >= 70 ? '#10B981' : scoreDetails[key] >= 50 ? '#F59E0B' : '#EF4444' }
                    }, `${Math.round(scoreDetails[key] || 0)}/100`)
                ])
            ))
        ]),

        // Recommendations
        recommendations.length > 0 && React.createElement('div', { key: 'recommendations', className: 'mt-6' }, [
            React.createElement('h4', {
                key: 'rec-title',
                className: 'text-lg font-semibold text-gray-800 mb-3'
            }, t.recommendations.title),
            React.createElement('ul', {
                key: 'rec-list',
                className: 'space-y-2'
            }, recommendations.map((rec, index) => 
                React.createElement('li', {
                    key: index,
                    className: 'flex items-start'
                }, [
                    React.createElement('span', {
                        key: 'bullet',
                        className: `inline-block w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0`,
                        style: {
                            backgroundColor: rec.priority === 'high' ? '#EF4444' : 
                                           rec.priority === 'medium' ? '#F59E0B' : '#3B82F6'
                        }
                    }),
                    React.createElement('span', {
                        key: 'text',
                        className: 'text-sm text-gray-700'
                    }, rec.text)
                ])
            ))
        ])
    ]);
};

// Export to window for global access
window.ReadinessScore = ReadinessScore;