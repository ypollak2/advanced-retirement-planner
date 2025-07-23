// ReadinessScore.js - Retirement Readiness Scoring Component
// Provides 0-100 readiness score with color-coded feedback and actionable recommendations

const ReadinessScore = ({ 
    inputs = {},
    currentAge, 
    retirementAge, 
    currentSavings, 
    monthlyContribution, 
    targetRetirementIncome, 
    workingCurrency = 'ILS',
    language = 'en' 
}) => {
    // Currency symbol helper
    const getCurrencySymbol = (currency) => {
        const symbols = {
            'ILS': '₪',
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'BTC': '₿',
            'ETH': 'Ξ'
        };
        return symbols[currency] || '₪';
    };
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
        const calculateReadinessScore = async () => {
            // Extract data from inputs object if available, fallback to individual props
            const ageNow = inputs.currentAge || currentAge;
            const retireAge = inputs.retirementAge || retirementAge;
            const yearsToRetirement = retireAge - ageNow;
            
            // Calculate actual monthly income first - handle both single and couple modes
            let monthlyIncome = 0;
            if (inputs.planningType === 'couple') {
                // In couple mode, sum both partners' salaries
                monthlyIncome = parseFloat(inputs.partner1Salary || 0) + parseFloat(inputs.partner2Salary || 0);
            } else {
                // In single mode, use currentMonthlySalary
                monthlyIncome = parseFloat(inputs.currentMonthlySalary || inputs.currentSalary || 0);
            }
            
            // Calculate pension and training fund contributions
            let pensionContrib = 0;
            let trainingFundContrib = 0;
            
            if (inputs.planningType === 'couple') {
                // Partner 1 contributions
                const p1Salary = parseFloat(inputs.partner1Salary || 0);
                const p1EmployeeRate = parseFloat(inputs.partner1EmployeePensionRate || inputs.employeePensionRate || 7.0);
                const p1EmployerRate = parseFloat(inputs.partner1EmployerPensionRate || inputs.employerPensionRate || 14.333);
                const p1TotalPensionRate = (p1EmployeeRate + p1EmployerRate) / 100;
                const p1PensionContrib = p1Salary * p1TotalPensionRate;
                
                const p1TrainingFundRate = parseFloat(inputs.partner1TrainingFundRate || inputs.trainingFundContributionRate || 10.0) / 100;
                const p1TrainingFundContrib = p1Salary * p1TrainingFundRate;
                
                // Partner 2 contributions
                const p2Salary = parseFloat(inputs.partner2Salary || 0);
                const p2EmployeeRate = parseFloat(inputs.partner2EmployeePensionRate || inputs.employeePensionRate || 7.0);
                const p2EmployerRate = parseFloat(inputs.partner2EmployerPensionRate || inputs.employerPensionRate || 14.333);
                const p2TotalPensionRate = (p2EmployeeRate + p2EmployerRate) / 100;
                const p2PensionContrib = p2Salary * p2TotalPensionRate;
                
                const p2TrainingFundRate = parseFloat(inputs.partner2TrainingFundRate || inputs.trainingFundContributionRate || 10.0) / 100;
                const p2TrainingFundContrib = p2Salary * p2TrainingFundRate;
                
                // Total contributions
                pensionContrib = p1PensionContrib + p2PensionContrib;
                trainingFundContrib = p1TrainingFundContrib + p2TrainingFundContrib;
            } else {
                // Single mode calculations
                const employeeRate = parseFloat(inputs.employeePensionRate || 7.0);
                const employerRate = parseFloat(inputs.employerPensionRate || 14.333);
                const totalPensionRate = (employeeRate + employerRate) / 100;
                pensionContrib = monthlyIncome * totalPensionRate;
                
                const trainingFundRate = parseFloat(inputs.trainingFundContributionRate || 10.0) / 100;
                trainingFundContrib = monthlyIncome * trainingFundRate;
            }
            
            // Get additional personal savings (combine both partners if couple)
            let personalSavings = parseFloat(inputs.personalSavings || inputs.personalPortfolioMonthly || 0);
            if (inputs.planningType === 'couple') {
                personalSavings += parseFloat(inputs.partner2PersonalSavings || inputs.partner2PersonalPortfolioMonthly || 0);
            }
            
            // Calculate total monthly savings
            const monthlySavings = pensionContrib + trainingFundContrib + personalSavings;
            
            // Debug logging to identify calculation issues
            console.log('ReadinessScore Calculation:', {
                monthlyIncome,
                employeeRate,
                employerRate,
                totalPensionRate: totalPensionRate * 100 + '%',
                pensionContrib,
                trainingFundRate: trainingFundRate * 100 + '%',
                trainingFundContrib,
                personalSavings,
                totalMonthlySavings: monthlySavings,
                savingsRate: monthlyIncome > 0 ? ((monthlySavings / monthlyIncome) * 100).toFixed(1) + '%' : '0%'
            });
            
            const currentTotal = parseFloat(inputs.currentSavings || currentSavings || 0);
            const targetMonthlyIncome = parseFloat(inputs.targetRetirementIncome || targetRetirementIncome || monthlyIncome * 0.8);
            
            // Convert values to ILS for calculation if needed
            let currentTotalILS = currentTotal;
            let monthlySavingsILS = monthlySavings;
            let targetMonthlyIncomeILS = targetMonthlyIncome;
            let monthlyIncomeILS = monthlyIncome;
            
            if (workingCurrency !== 'ILS' && window.currencyAPI) {
                try {
                    currentTotalILS = await window.currencyAPI.convertAmount(currentTotal, workingCurrency, 'ILS');
                    monthlySavingsILS = await window.currencyAPI.convertAmount(monthlySavings, workingCurrency, 'ILS');
                    targetMonthlyIncomeILS = await window.currencyAPI.convertAmount(targetMonthlyIncome, workingCurrency, 'ILS');
                    monthlyIncomeILS = await window.currencyAPI.convertAmount(monthlyIncome, workingCurrency, 'ILS');
                } catch (error) {
                    console.warn('Currency conversion failed in ReadinessScore:', error);
                    // Use fallback conversion
                    const fallbackRates = {
                        'USD': 3.7, 'EUR': 4.0, 'GBP': 4.6, 'BTC': 150000, 'ETH': 10000
                    };
                    const rate = fallbackRates[workingCurrency] || 1;
                    currentTotalILS = currentTotal * rate;
                    monthlySavingsILS = monthlySavings * rate;
                    targetMonthlyIncomeILS = targetMonthlyIncome * rate;
                    monthlyIncomeILS = monthlyIncome * rate;
                }
            }
            
            // Estimated retirement savings needed (25x annual expenses rule)
            const targetRetirementSavings = targetMonthlyIncomeILS * 12 * 25;
            
            // Projected savings at retirement (simple compound interest at 7% annually)
            const annualReturn = 0.07;
            const monthlyReturn = annualReturn / 12;
            const totalMonths = yearsToRetirement * 12;
            
            // Future value of current savings
            const futureCurrentSavings = currentTotalILS * Math.pow(1 + annualReturn, yearsToRetirement);
            
            // Future value of monthly contributions
            const futureContributions = monthlySavingsILS * 
                (Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn;
            
            const projectedTotalSavings = futureCurrentSavings + futureContributions;
            
            // Calculate score factors using correct data sources
            const factors = {
                savingsRate: calculateSavingsRateScore(monthlySavingsILS, monthlyIncomeILS),
                timeHorizon: calculateTimeHorizonScore(yearsToRetirement),
                currentSavings: calculateCurrentSavingsScore(currentTotalILS, ageNow, monthlyIncomeILS),
                retirementGoal: calculateRetirementGoalScore(projectedTotalSavings, targetRetirementSavings),
                riskManagement: calculateRiskScore(ageNow, yearsToRetirement)
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
                projectedTotalSavings: projectedTotalSavings,
                targetSavings: targetRetirementSavings,
                shortfall: Math.max(0, targetRetirementSavings - projectedTotalSavings),
                // Add raw values for transparency
                rawValues: {
                    monthlyIncome: monthlyIncomeILS,
                    monthlySavings: monthlySavingsILS,
                    savingsRate: monthlyIncomeILS > 0 ? (monthlySavingsILS / monthlyIncomeILS) * 100 : 0,
                    pensionContrib,
                    trainingFundContrib,
                    personalSavings,
                    currentTotal: currentTotalILS,
                    yearsToRetirement
                }
            });
            
            // Generate recommendations
            setRecommendations(generateRecommendations(finalScore, factors, {
                projectedTotalSavings,
                targetRetirementSavings,
                monthlySavings,
                yearsToRetirement
            }));
        };

        const ageNow = inputs.currentAge || currentAge;
        const retireAge = inputs.retirementAge || retirementAge;
        
        if (ageNow && retireAge && retireAge > ageNow) {
            calculateReadinessScore();
        }
    }, [
        // Core inputs object
        inputs,
        // Individual props for backward compatibility
        currentAge, retirementAge, currentSavings, monthlyContribution, targetRetirementIncome,
        // Key fields from inputs that affect scoring
        inputs?.currentAge, inputs?.retirementAge, inputs?.currentMonthlySalary, inputs?.partner1Salary,
        inputs?.currentSavings, inputs?.personalSavings, inputs?.personalPortfolioMonthly, inputs?.currentMonthlyExpenses,
        // Contribution rates that affect calculations
        inputs?.employeePensionRate, inputs?.employerPensionRate, inputs?.trainingFundContributionRate,
        // Currency changes should trigger recalculation
        workingCurrency
    ]);

    // Helper functions for score calculation
    const calculateSavingsRateScore = (monthlySavings, monthlyIncome) => {
        // Use actual monthly income instead of target retirement income
        if (monthlyIncome === 0) return 0; // Cannot calculate without income
        
        const savingsRate = monthlySavings / monthlyIncome;
        
        // Score based on actual savings rate percentage
        if (savingsRate >= 0.20) return 100; // 20%+ is excellent
        if (savingsRate >= 0.15) return 85;  // 15-20% is very good
        if (savingsRate >= 0.10) return 70;  // 10-15% is good
        if (savingsRate >= 0.05) return 50;  // 5-10% is fair
        return Math.max(0, savingsRate * 250); // Below 5% scales linearly (0-50 points)
    };

    const calculateTimeHorizonScore = (years) => {
        if (years >= 30) return 100; // 30+ years is excellent
        if (years >= 20) return 85;  // 20-30 years is very good
        if (years >= 15) return 70;  // 15-20 years is good
        if (years >= 10) return 50;  // 10-15 years is fair
        if (years >= 5) return 25;   // 5-10 years is challenging
        return 10; // Less than 5 years is critical
    };

    const calculateCurrentSavingsScore = (savings, age, monthlyIncome = 0) => {
        // Rule of thumb: savings should be 1x income by 30, 3x by 40, 6x by 50, etc.
        const targetMultiplier = Math.max(0, (age - 25) / 5);
        const annualIncome = monthlyIncome * 12;
        const estimatedAnnualIncome = annualIncome > 0 ? annualIncome : 240000; // Default 20k/month if no income data
        const targetSavings = targetMultiplier * estimatedAnnualIncome;
        
        if (targetSavings === 0 || age < 25) return 50; // No target for very young people
        
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
        className: 'readiness-score bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl shadow-2xl p-8 border-2 border-indigo-200 transform hover:scale-105 transition-all duration-300',
        style: { borderLeftColor: category.color, borderLeftWidth: '6px' },
        role: 'region',
        'aria-label': t.title
    }, [
        // Header
        React.createElement('div', { key: 'header', className: 'mb-6' }, [
            React.createElement('h3', {
                key: 'title',
                className: 'text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2 text-center'
            }, t.title),
            React.createElement('p', {
                key: 'subtitle',
                className: 'text-gray-600 text-sm'
            }, t.subtitle)
        ]),

        // Score Display
        React.createElement('div', { key: 'score-display', className: 'flex flex-col items-center justify-center mb-8' }, [
            React.createElement('div', {
                key: 'score-circle',
                className: 'relative w-40 h-40 rounded-full flex items-center justify-center mb-4 shadow-xl transform hover:rotate-12 transition-transform duration-500',
                style: {
                    background: `conic-gradient(${category.color} ${score * 3.6}deg, #e5e7eb 0deg)`
                }
            }, [
                React.createElement('div', {
                    key: 'inner-circle',
                    className: 'w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-inner'
                }, [
                    React.createElement('span', {
                        key: 'score-number',
                        className: 'text-5xl font-black animate-pulse',
                        style: { color: category.color }
                    }, score),
                    React.createElement('span', {
                        key: 'out-of',
                        className: 'text-sm text-gray-500 font-semibold'
                    }, t.outOf)
                ])
            ]),
            React.createElement('div', {
                key: 'score-category',
                className: 'text-center'
            }, [
                React.createElement('div', {
                    key: 'category-label',
                    className: 'px-6 py-3 rounded-full text-lg font-bold text-white shadow-lg transform hover:scale-110 transition-transform duration-200',
                    style: { backgroundColor: category.color }
                }, t.categories[category.key])
            ])
        ]),

        // Score Details with Tooltips
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
            ).map(key => {
                const helpTermMap = {
                    'savingsRate': 'savings-rate-score',
                    'timeHorizon': 'retirement-readiness-score', 
                    'currentSavings': 'retirement-readiness-score',
                    'retirementGoal': 'retirement-readiness-score',
                    'riskManagement': 'risk-alignment-score'
                };
                
                return React.createElement('div', {
                    key: key,
                    className: 'flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
                }, [
                    // Factor name with tooltip
                    window.HelpTooltip ? React.createElement(window.HelpTooltip, {
                        key: 'factor-help',
                        term: helpTermMap[key],
                        language: language,
                        position: 'top'
                    }, React.createElement('span', {
                        key: 'factor-name',
                        className: 'text-sm text-gray-700 font-medium'
                    }, t.factors[key] || key)) : React.createElement('span', {
                        key: 'factor-name',
                        className: 'text-sm text-gray-700 font-medium'
                    }, t.factors[key] || key),
                    
                    // Score with explanation and percentage display
                    React.createElement('div', {
                        key: 'score-container',
                        className: 'flex items-center gap-2'
                    }, [
                        React.createElement('span', {
                            key: 'factor-score',
                            className: 'text-sm font-bold px-2 py-1 rounded-full text-white',
                            style: { 
                                backgroundColor: scoreDetails[key] >= 70 ? '#10B981' : 
                                               scoreDetails[key] >= 50 ? '#F59E0B' : '#EF4444' 
                            }
                        }, `${Math.round(scoreDetails[key] || 0)}`),
                        // Add percentage display for savings rate with correct calculation
                        key === 'savingsRate' && scoreDetails.rawValues && React.createElement('span', {
                            key: 'savings-percentage',
                            className: 'text-xs text-gray-600',
                            title: language === 'he' ? 
                                `חיסכון חודשי: ₪${Math.round(scoreDetails.rawValues.monthlySavings).toLocaleString()} / הכנסה: ₪${Math.round(scoreDetails.rawValues.monthlyIncome).toLocaleString()}` : 
                                `Monthly savings: ₪${Math.round(scoreDetails.rawValues.monthlySavings).toLocaleString()} / Income: ₪${Math.round(scoreDetails.rawValues.monthlyIncome).toLocaleString()}`
                        }, `(${scoreDetails.rawValues.savingsRate.toFixed(1)}%)`),
                        window.ScoreExplanation && React.createElement('button', {
                            key: 'info-btn',
                            className: 'text-blue-500 hover:text-blue-700 text-xs',
                            onClick: (e) => {
                                e.stopPropagation();
                                // Could trigger modal or tooltip
                            },
                            'aria-label': language === 'he' ? 'מידע נוסף' : 'More info'
                        }, 'ℹ️')
                    ])
                ]);
            }))
        ]),

        // Calculation Breakdown (new section)
        scoreDetails.rawValues && React.createElement('div', { 
            key: 'calculation-breakdown', 
            className: 'mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200' 
        }, [
            React.createElement('h4', {
                key: 'breakdown-title',
                className: 'text-md font-semibold text-gray-800 mb-3 flex items-center'
            }, [
                React.createElement('span', { key: 'calc-icon', className: 'mr-2' }, '🧮'),
                language === 'he' ? 'פירוט החישוב' : 'Calculation Breakdown'
            ]),
            React.createElement('div', {
                key: 'breakdown-content',
                className: 'space-y-2 text-sm'
            }, [
                // Income section
                React.createElement('div', { key: 'income-section', className: 'pb-2 border-b border-gray-200' }, [
                    React.createElement('div', { key: 'income-label', className: 'font-medium text-gray-700' },
                        language === 'he' ? 'הכנסה חודשית:' : 'Monthly Income:'
                    ),
                    React.createElement('div', { key: 'income-value', className: 'text-gray-600 pl-4' },
                        `${getCurrencySymbol(workingCurrency)}${Math.round(scoreDetails.rawValues.monthlyIncome).toLocaleString()}`
                    )
                ]),
                // Savings breakdown
                React.createElement('div', { key: 'savings-section', className: 'pb-2 border-b border-gray-200' }, [
                    React.createElement('div', { key: 'savings-label', className: 'font-medium text-gray-700' },
                        language === 'he' ? 'חיסכון חודשי:' : 'Monthly Savings:'
                    ),
                    React.createElement('div', { key: 'pension-item', className: 'text-gray-600 pl-4' },
                        `${language === 'he' ? 'פנסיה' : 'Pension'}: ${getCurrencySymbol(workingCurrency)}${Math.round(scoreDetails.rawValues.pensionContrib).toLocaleString()}`
                    ),
                    React.createElement('div', { key: 'training-item', className: 'text-gray-600 pl-4' },
                        `${language === 'he' ? 'קרן השתלמות' : 'Training Fund'}: ${getCurrencySymbol(workingCurrency)}${Math.round(scoreDetails.rawValues.trainingFundContrib).toLocaleString()}`
                    ),
                    React.createElement('div', { key: 'personal-item', className: 'text-gray-600 pl-4' },
                        `${language === 'he' ? 'חיסכון אישי' : 'Personal Savings'}: ${getCurrencySymbol(workingCurrency)}${Math.round(scoreDetails.rawValues.personalSavings).toLocaleString()}`
                    ),
                    React.createElement('div', { key: 'total-savings', className: 'font-medium text-gray-700 pl-4 mt-1 pt-1 border-t border-gray-300' },
                        `${language === 'he' ? 'סה"כ' : 'Total'}: ${getCurrencySymbol(workingCurrency)}${Math.round(scoreDetails.rawValues.monthlySavings).toLocaleString()}`
                    )
                ]),
                // Savings rate calculation
                React.createElement('div', { key: 'rate-section' }, [
                    React.createElement('div', { key: 'rate-formula', className: 'font-medium text-gray-700' },
                        language === 'he' ? 'שיעור חיסכון:' : 'Savings Rate:'
                    ),
                    React.createElement('div', { key: 'rate-calc', className: 'text-gray-600 pl-4 font-mono text-xs' },
                        `(${Math.round(scoreDetails.rawValues.monthlySavings).toLocaleString()} ÷ ${Math.round(scoreDetails.rawValues.monthlyIncome).toLocaleString()}) × 100 = ${scoreDetails.rawValues.savingsRate.toFixed(1)}%`
                    )
                ])
            ])
        ]),
        
        // What-if Impact Calculator
        React.createElement('div', { key: 'what-if-section', className: 'mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200' }, [
            React.createElement('h4', {
                key: 'what-if-title',
                className: 'text-md font-semibold text-blue-800 mb-3'
            }, language === 'he' ? 'השפעת שיפורים' : 'Impact Calculator'),
            React.createElement('div', {
                key: 'what-if-items',
                className: 'space-y-2 text-sm text-blue-700'
            }, [
                // Savings rate impact with correct calculation
                (() => {
                    if (scoreDetails.rawValues && scoreDetails.rawValues.monthlyIncome > 0) {
                        const currentRate = scoreDetails.rawValues.savingsRate;
                        const targetRate = 15; // 15% target
                        if (currentRate < targetRate) {
                            const increaseNeeded = ((targetRate - currentRate) / 100) * scoreDetails.rawValues.monthlyIncome;
                            const currencySymbol = getCurrencySymbol(workingCurrency);
                            const pointsImprovement = Math.round((targetRate - currentRate) * 2);
                            
                            return React.createElement('div', { key: 'savings-impact', className: 'flex items-start' }, [
                                React.createElement('span', { key: 'bullet', className: 'mr-2' }, '•'),
                                React.createElement('span', { key: 'text' },
                                    language === 'he' ? 
                                        `הגדלת חיסכון ב-${currencySymbol}${Math.round(increaseNeeded).toLocaleString()} לחודש (ל-${targetRate}% שיעור חיסכון) תעלה את הציון ב-${pointsImprovement} נקודות` :
                                        `Increase savings by ${currencySymbol}${Math.round(increaseNeeded).toLocaleString()}/month (to ${targetRate}% savings rate) → +${pointsImprovement} points`
                                )
                            ]);
                        } else {
                            return React.createElement('div', { key: 'savings-excellent', className: 'flex items-start text-green-700' }, [
                                React.createElement('span', { key: 'check', className: 'mr-2' }, '✓'),
                                React.createElement('span', { key: 'text' },
                                    language === 'he' ? 
                                        `שיעור החיסכון שלך (${currentRate.toFixed(1)}%) מצוין!` :
                                        `Your savings rate (${currentRate.toFixed(1)}%) is excellent!`
                                )
                            ]);
                        }
                    }
                    return null;
                })(),
                // Time horizon impact
                (() => {
                    const currentAge = inputs?.currentAge || 30;
                    const retirementAge = inputs?.retirementAge || 67;
                    const yearsLeft = retirementAge - currentAge;
                    
                    if (yearsLeft < 20) {
                        return React.createElement('div', { key: 'time-impact' },
                            `• ${language === 'he' ? 'דחיית פרישה ב-5 שנים תעלה את הציון ב' : 'Delaying retirement by 5 years would improve score by'} ~15 ${language === 'he' ? 'נקודות' : 'points'}`
                        );
                    }
                    return null;
                })()
            ])
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