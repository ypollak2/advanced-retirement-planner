// ResultsDisplay Component - Displays calculated retirement projections and financial summaries
export const ResultsDisplay = ({ 
    results, 
    inputs, 
    workPeriods, 
    language, 
    t, 
    formatCurrency, 
    convertCurrency,
    generateChartData,
    showChart,
    chartData,
    claudeInsights,
    exportRetirementSummary,
    exportAsImage,
    // Icon components
    PiggyBank,
    Calculator,
    DollarSign,
    Target,
    AlertCircle,
    TrendingUp,
    SimpleChart
}) => {
    // Don't render anything if no results
    if (!results) return null;

    // Generate general recommendations
    const generateGeneralRecommendations = () => {
        const recommendations = [];
        const currentSalary = workPeriods[workPeriods.length - 1]?.salary || 0;
        const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
        const currentAge = inputs.currentAge;
        
        // Emergency Fund Analysis
        const emergencyFundTarget = inputs.currentMonthlyExpenses * inputs.emergencyFundTarget;
        const emergencyFundGap = Math.max(0, emergencyFundTarget - inputs.currentEmergencyFund);
        const emergencyFundCoverage = inputs.currentMonthlyExpenses > 0 ? 
            inputs.currentEmergencyFund / inputs.currentMonthlyExpenses : 0;
        
        // Savings Rate Analysis
        const totalMonthlySavings = (workPeriods[workPeriods.length - 1]?.monthlyContribution || 0) +
            (workPeriods[workPeriods.length - 1]?.monthlyTrainingFund || 0) +
            inputs.personalPortfolioMonthly +
            inputs.cryptoMonthly +
            inputs.realEstateMonthly +
            inputs.emergencyFundMonthly;
        const savingsRate = currentSalary > 0 ? (totalMonthlySavings / currentSalary) * 100 : 0;
        
        // Debt-to-Income Ratio
        const totalMonthlyDebt = inputs.mortgageMonthlyPayment +
            inputs.personalLoansMonthly +
            inputs.creditCardMonthly +
            inputs.otherDebtsMonthly;
        const debtToIncomeRatio = currentSalary > 0 ? (totalMonthlyDebt / currentSalary) * 100 : 0;
        
        // Age-Based Recommendations
        if (currentAge < 30) {
            if (savingsRate < 10) {
                recommendations.push({
                    type: 'warning',
                    priority: 'high',
                    title: language === 'he' ? '💡 הגדל חיסכון בגיל צעיר' : '💡 Increase Savings While Young',
                    text: language === 'he' 
                        ? 'בגיל צעיר, כדאי לחסוך לפחות 10-15% מהשכר. יש לך יתרון זמן רב להנדס עליית ערך.'
                        : 'At a young age, aim to save at least 10-15% of salary. You have the advantage of time for compound growth.'
                });
            }
            if (inputs.riskTolerance === 'conservative') {
                recommendations.push({
                    type: 'suggestion',
                    priority: 'medium',
                    title: language === 'he' ? '📈 שקול סיכון גבוה יותר' : '📈 Consider Higher Risk',
                    text: language === 'he' 
                        ? 'בגיל צעיר, תוכל לקחת יותר סיכון בהשקעות עבור פוטנציאל תשואה גבוה יותר.'
                        : 'At a young age, you can take more investment risk for higher return potential.'
                });
            }
        } else if (currentAge >= 30 && currentAge < 45) {
            if (savingsRate < 15) {
                recommendations.push({
                    type: 'warning',
                    priority: 'high',
                    title: language === 'he' ? '⚡ הגדל חיסכון בגיל הפריים' : '⚡ Increase Prime Years Savings',
                    text: language === 'he' 
                        ? 'בשנות הפריים שלך (30-45), כדאי לחסוך 15-20% מהשכר כדי למקסם את הצבירה.'
                        : 'In your prime years (30-45), aim to save 15-20% of salary to maximize accumulation.'
                });
            }
            if (!results.achievesTarget) {
                recommendations.push({
                    type: 'warning',
                    priority: 'high',
                    title: language === 'he' ? '🎯 סגור פערים עכשיו' : '🎯 Close Gaps Now',
                    text: language === 'he' 
                        ? `יש פער של ${formatCurrency(results.targetGap)} מהיעד. זה הזמן הטוב ביותר לסגור פערים.`
                        : `There's a ${formatCurrency(results.targetGap)} gap from target. This is the best time to close gaps.`
                });
            }
        } else if (currentAge >= 45 && currentAge < 60) {
            if (inputs.riskTolerance === 'veryAggressive') {
                recommendations.push({
                    type: 'caution',
                    priority: 'medium',
                    title: language === 'he' ? '⚖️ שקול להפחית סיכון' : '⚖️ Consider Reducing Risk',
                    text: language === 'he' 
                        ? 'בגיל מתקדם יותר, כדאי להתחיל להפחית סיכון ולשמור על הצבירה.'
                        : 'At a more advanced age, consider starting to reduce risk and preserve accumulation.'
                });
            }
            if (savingsRate < 20) {
                recommendations.push({
                    type: 'warning',
                    priority: 'high',
                    title: language === 'he' ? '🏃‍♂️ האצה לפני פרישה' : '🏃‍♂️ Accelerate Before Retirement',
                    text: language === 'he' 
                        ? 'בשנים לפני הפרישה, כדאי להגדיל חיסכון ל-20-25% מהשכר.'
                        : 'In the years before retirement, consider increasing savings to 20-25% of salary.'
                });
            }
        } else if (currentAge >= 60) {
            if (inputs.riskTolerance === 'aggressive' || inputs.riskTolerance === 'veryAggressive') {
                recommendations.push({
                    type: 'warning',
                    priority: 'high',
                    title: language === 'he' ? '🛡️ שמור על הצבירה' : '🛡️ Preserve Accumulation',
                    text: language === 'he' 
                        ? 'בקרבת הפרישה, כדאי לעבור לאסטרטגיה שמרנית יותר לשמירה על הצבירה.'
                        : 'Near retirement, consider moving to a more conservative strategy to preserve accumulation.'
                });
            }
        }

        // Emergency Fund Recommendations
        if (emergencyFundCoverage < 3) {
            recommendations.push({
                type: 'critical',
                priority: 'critical',
                title: language === 'he' ? '🚨 קרן חירום דחופה' : '🚨 Urgent Emergency Fund',
                text: language === 'he' 
                    ? `יש לך כיסוי של ${emergencyFundCoverage.toFixed(1)} חודשים בלבד. צריך לפחות 3-6 חודשים.`
                    : `You have only ${emergencyFundCoverage.toFixed(1)} months coverage. Need at least 3-6 months.`
            });
        } else if (emergencyFundCoverage < 6) {
            recommendations.push({
                type: 'warning',
                priority: 'high',
                title: language === 'he' ? '🛡️ השלם קרן חירום' : '🛡️ Complete Emergency Fund',
                text: language === 'he' 
                    ? `קרן החירום שלך מכסה ${emergencyFundCoverage.toFixed(1)} חודשים. כדאי להשלים ל-6 חודשים.`
                    : `Your emergency fund covers ${emergencyFundCoverage.toFixed(1)} months. Consider completing to 6 months.`
            });
        }

        // Debt-to-Income Recommendations
        if (debtToIncomeRatio > 40) {
            recommendations.push({
                type: 'critical',
                priority: 'critical',
                title: language === 'he' ? '💳 חובות גבוהים מדי' : '💳 Debt Too High',
                text: language === 'he' 
                    ? `יחס החובות להכנסה שלך הוא ${debtToIncomeRatio.toFixed(1)}%. כדאי להוריד מתחת ל-30%.`
                    : `Your debt-to-income ratio is ${debtToIncomeRatio.toFixed(1)}%. Consider reducing below 30%.`
            });
        } else if (debtToIncomeRatio > 30) {
            recommendations.push({
                type: 'warning',
                priority: 'medium',
                title: language === 'he' ? '⚠️ שמור על חובות' : '⚠️ Monitor Debt',
                text: language === 'he' 
                    ? `יחס החובות להכנסה שלך הוא ${debtToIncomeRatio.toFixed(1)}%. כדאי לא לעלות מעל 30%.`
                    : `Your debt-to-income ratio is ${debtToIncomeRatio.toFixed(1)}%. Consider not exceeding 30%.`
            });
        }

        // Savings Rate Recommendations
        if (savingsRate < 10) {
            recommendations.push({
                type: 'warning',
                priority: 'high',
                title: language === 'he' ? '📊 שיעור חיסכון נמוך' : '📊 Low Savings Rate',
                text: language === 'he' 
                    ? `שיעור החיסכון שלך הוא ${savingsRate.toFixed(1)}%. מומלץ לפחות 10-15%.`
                    : `Your savings rate is ${savingsRate.toFixed(1)}%. Recommended at least 10-15%.`
            });
        } else if (savingsRate >= 20) {
            recommendations.push({
                type: 'success',
                priority: 'low',
                title: language === 'he' ? '🎉 שיעור חיסכון מצוין' : '🎉 Excellent Savings Rate',
                text: language === 'he' 
                    ? `שיעור החיסכון שלך הוא ${savingsRate.toFixed(1)}%. זה מצוין!`
                    : `Your savings rate is ${savingsRate.toFixed(1)}%. This is excellent!`
            });
        }

        // Investment Diversification Recommendations
        const hasPersonalInvestments = inputs.currentPersonalPortfolio > 0 || inputs.personalPortfolioMonthly > 0;
        const hasCrypto = inputs.currentCrypto > 0 || inputs.cryptoMonthly > 0;
        const hasRealEstate = inputs.currentRealEstate > 0 || inputs.realEstateMonthly > 0;
        
        if (!hasPersonalInvestments && !hasCrypto && !hasRealEstate) {
            recommendations.push({
                type: 'suggestion',
                priority: 'medium',
                title: language === 'he' ? '🌟 פזר השקעות' : '🌟 Diversify Investments',
                text: language === 'he' 
                    ? 'שקול להוסיף השקעות אישיות נוספות כמו מניות או נדל״ן לפיזור סיכונים.'
                    : 'Consider adding personal investments like stocks or real estate for risk diversification.'
            });
        }

        // Risk Tolerance vs Age Recommendations
        if (currentAge > 55 && (inputs.riskTolerance === 'aggressive' || inputs.riskTolerance === 'veryAggressive')) {
            recommendations.push({
                type: 'caution',
                priority: 'medium',
                title: language === 'he' ? '⚖️ התאם סיכון לגיל' : '⚖️ Adjust Risk to Age',
                text: language === 'he' 
                    ? 'ככל שמתקרבים לפרישה, כדאי להפחית סיכון והגדיל חלק של אג״ח.'
                    : 'As you approach retirement, consider reducing risk and increasing bond allocation.'
            });
        }

        // Positive Reinforcement for Good Planning
        if (results.achievesTarget && emergencyFundCoverage >= 6 && savingsRate >= 15) {
            recommendations.push({
                type: 'success',
                priority: 'low',
                title: language === 'he' ? '🏆 תכנון מצוין' : '🏆 Excellent Planning',
                text: language === 'he' 
                    ? 'הכל נראה נהדר! יש לך קרן חירום מספקת, שיעור חיסכון טוב ואתה עומד ליעד הפרישה.'
                    : 'Everything looks great! You have adequate emergency fund, good savings rate and meeting retirement target.'
            });
        }

        // Sort by priority
        const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
        return recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    };

    const recommendations = generateGeneralRecommendations();

    return React.createElement('div', { className: "space-y-6" }, [
        // Monthly Income Display
        React.createElement('div', { className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in" }, [
            React.createElement('div', { className: "flex justify-between items-center mb-6" }, [
                React.createElement('h2', { className: "text-2xl font-bold text-green-700 flex items-center" }, [
                    React.createElement(PiggyBank, { className: "mr-2" }),
                    t.monthlyIncome
                ]),
                React.createElement('button', {
                    onClick: generateChartData,
                    className: "bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg flex items-center hover:from-green-600 hover:to-teal-600 transition-all shadow-lg"
                }, [
                    React.createElement(TrendingUp, { size: 16, className: "mr-1" }),
                    t.showChart
                ])
            ]),
            React.createElement('div', { className: "grid grid-cols-1 gap-4" }, [
                React.createElement('div', { className: "bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-4" }, [
                    React.createElement('div', { className: "text-center" }, [
                        React.createElement('div', { className: "text-3xl font-bold text-green-700 currency-format" }, formatCurrency(results.totalNetIncome)),
                        React.createElement('div', { className: "text-sm text-gray-600" }, t.totalMonthly)
                    ])
                ]),
                React.createElement('div', { className: "grid grid-cols-3 gap-2" }, [
                    React.createElement('div', { className: "bg-blue-50 rounded-lg p-3" }, [
                        React.createElement('div', { className: "text-lg font-bold text-blue-700 currency-format" }, formatCurrency(results.netPension)),
                        React.createElement('div', { className: "text-xs text-gray-600" }, t.fromPension)
                    ]),
                    React.createElement('div', { className: "bg-green-50 rounded-lg p-3" }, [
                        React.createElement('div', { className: "text-lg font-bold text-green-700 currency-format" }, formatCurrency(results.netTrainingFundIncome)),
                        React.createElement('div', { className: "text-xs text-gray-600" }, t.fromTrainingFund)
                    ]),
                    React.createElement('div', { className: "bg-purple-50 rounded-lg p-3" }, [
                        React.createElement('div', { className: "text-lg font-bold text-purple-700 currency-format" }, formatCurrency(results.socialSecurity)),
                        React.createElement('div', { className: "text-xs text-gray-600" }, `${t.socialSecurity} ${results.lastCountry.flag}`)
                    ])
                ]),
                React.createElement('div', { className: "bg-yellow-50 rounded-lg p-3 border-l-4 border-yellow-400" }, [
                    React.createElement('div', { className: "flex items-center" }, [
                        React.createElement(AlertCircle, { className: "text-yellow-600 mr-2", size: 16 }),
                        React.createElement('div', null, [
                            React.createElement('div', { className: "font-medium text-yellow-800" }, `${t.withInflation} ${formatCurrency(results.inflationAdjustedIncome)}`),
                            React.createElement('div', { className: "text-xs text-yellow-600" }, t.purchasingPower)
                        ])
                    ])
                ]),
                // Currency conversion - compact version
                React.createElement('div', { className: "bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-lg p-3 border border-indigo-200" }, [
                    React.createElement('h4', { className: "font-semibold text-indigo-800 mb-3 text-center" }, 
                        language === 'he' ? "🌍 המרת מטבעות" : "🌍 Currency Conversion"),
                    React.createElement('div', { className: "grid grid-cols-3 gap-3" }, [
                        React.createElement('div', { className: "text-center" }, [
                            React.createElement('div', { className: "text-xs text-gray-600" }, 
                                language === 'he' ? "USD" : "USD"),
                            React.createElement('div', { className: "font-bold text-green-700 currency-format" }, convertCurrency(results.totalNetIncome, 'USD'))
                        ]),
                        React.createElement('div', { className: "text-center" }, [
                            React.createElement('div', { className: "text-xs text-gray-600" }, 
                                language === 'he' ? "GBP" : "GBP"),
                            React.createElement('div', { className: "font-bold text-green-700 currency-format" }, convertCurrency(results.totalNetIncome, 'GBP'))
                        ]),
                        React.createElement('div', { className: "text-center" }, [
                            React.createElement('div', { className: "text-xs text-gray-600" }, 
                                language === 'he' ? "EUR" : "EUR"),
                            React.createElement('div', { className: "font-bold text-green-700 currency-format" }, convertCurrency(results.totalNetIncome, 'EUR'))
                        ])
                    ])
                ])
            ])
        ]),

        // Savings Breakdown
        React.createElement('div', { className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in" }, [
            React.createElement('h3', { className: "text-xl font-bold text-blue-700 mb-4 flex items-center" }, [
                React.createElement(Calculator, { className: "mr-2" }),
                language === 'he' ? "פירוט חסכונות" : "Savings Breakdown"
            ]),
            React.createElement('div', { className: "space-y-3" }, [
                React.createElement('div', { className: "flex justify-between p-3 bg-blue-50 rounded-lg" }, [
                    React.createElement('span', null, 
                        language === 'he' ? "חיסכון פנסיה:" : "Pension Savings:"),
                    React.createElement('span', { className: "font-bold text-blue-700 currency-format" }, formatCurrency(results.totalSavings))
                ]),
                React.createElement('div', { className: "flex justify-between p-3 bg-green-50 rounded-lg" }, [
                    React.createElement('span', null, 
                        language === 'he' ? "קרן השתלמות:" : "Training Fund:"),
                    React.createElement('span', { className: "font-bold text-green-700 currency-format" }, formatCurrency(results.trainingFundValue))
                ]),
                React.createElement('div', { className: "flex justify-between p-3 bg-gray-50 rounded-lg border-2 border-gray-300" }, [
                    React.createElement('span', { className: "font-bold" }, 
                        language === 'he' ? "סה״כ חסכונות:" : "Total Savings:"),
                    React.createElement('span', { className: "font-bold text-gray-800 currency-format" }, formatCurrency(results.totalSavings + results.trainingFundValue))
                ])
            ])
        ]),

        // Comprehensive Savings Breakdown
        React.createElement('div', { className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in" }, [
            React.createElement('h3', { className: "text-xl font-bold text-purple-700 mb-4 flex items-center" }, [
                React.createElement('span', { className: "mr-2" }, "💎"),
                language === 'he' ? "פירוט מלא של הצבירה" : "Complete Accumulation Breakdown"
            ]),
            React.createElement('div', { className: "space-y-3" }, [
                // Pension Savings
                results.totalSavings > 0 && React.createElement('div', { className: "flex justify-between p-3 bg-blue-50 rounded-lg border border-blue-200" }, [
                    React.createElement('span', { className: "flex items-center" }, [
                        React.createElement('span', { className: "w-3 h-3 bg-blue-500 rounded-full mr-2" }),
                        language === 'he' ? "פנסיה:" : "Pension:"
                    ]),
                    React.createElement('span', { className: "font-bold text-blue-700 currency-format" }, formatCurrency(results.totalSavings))
                ]),
                // Training Fund
                results.trainingFundValue > 0 && React.createElement('div', { className: "flex justify-between p-3 bg-green-50 rounded-lg border border-green-200" }, [
                    React.createElement('span', { className: "flex items-center" }, [
                        React.createElement('span', { className: "w-3 h-3 bg-green-500 rounded-full mr-2" }),
                        language === 'he' ? "קרן השתלמות:" : "Training Fund:"
                    ]),
                    React.createElement('span', { className: "font-bold text-green-700 currency-format" }, formatCurrency(results.trainingFundValue))
                ]),
                // Personal Portfolio
                results.personalPortfolioValue > 0 && React.createElement('div', { className: "flex justify-between p-3 bg-purple-50 rounded-lg border border-purple-200" }, [
                    React.createElement('span', { className: "flex items-center" }, [
                        React.createElement('span', { className: "w-3 h-3 bg-purple-500 rounded-full mr-2" }),
                        language === 'he' ? "תיק אישי:" : "Personal Portfolio:"
                    ]),
                    React.createElement('span', { className: "font-bold text-purple-700 currency-format" }, formatCurrency(results.personalPortfolioValue))
                ]),
                // Cryptocurrency
                results.cryptoValue > 0 && React.createElement('div', { className: "flex justify-between p-3 bg-orange-50 rounded-lg border border-orange-200" }, [
                    React.createElement('span', { className: "flex items-center" }, [
                        React.createElement('span', { className: "w-3 h-3 bg-orange-500 rounded-full mr-2" }),
                        language === 'he' ? "קריפטו:" : "Cryptocurrency:"
                    ]),
                    React.createElement('span', { className: "font-bold text-orange-700 currency-format" }, formatCurrency(results.cryptoValue))
                ]),
                // Real Estate
                results.realEstateValue > 0 && React.createElement('div', { className: "flex justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200" }, [
                    React.createElement('span', { className: "flex items-center" }, [
                        React.createElement('span', { className: "w-3 h-3 bg-emerald-500 rounded-full mr-2" }),
                        language === 'he' ? "נדל״ן:" : "Real Estate:"
                    ]),
                    React.createElement('span', { className: "font-bold text-emerald-700 currency-format" }, formatCurrency(results.realEstateValue))
                ]),
                // Total Line
                React.createElement('div', { className: "flex justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-300" }, [
                    React.createElement('span', { className: "font-bold text-lg flex items-center" }, [
                        React.createElement('span', { className: "w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-2" }),
                        language === 'he' ? "סה״כ צבירה:" : "Total Accumulation:"
                    ]),
                    React.createElement('span', { className: "font-bold text-xl text-indigo-700 currency-format" }, 
                        formatCurrency(
                            results.totalSavings + 
                            results.trainingFundValue + 
                            results.personalPortfolioValue + 
                            results.cryptoValue + 
                            results.realEstateValue
                        ))
                ])
            ])
        ]),

        // Tax Breakdown
        React.createElement('div', { className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in" }, [
            React.createElement('h3', { className: "text-xl font-bold text-red-700 mb-4 flex items-center" }, [
                React.createElement(DollarSign, { className: "mr-2" }),
                language === 'he' ? "פירוט מיסים" : "Tax Breakdown"
            ]),
            React.createElement('div', { className: "space-y-3" }, [
                React.createElement('div', { className: "flex justify-between p-3 bg-gray-50 rounded-lg" }, [
                    React.createElement('span', null, 
                        language === 'he' ? "פנסיה ברוטו:" : "Gross Pension:"),
                    React.createElement('span', { className: "font-bold currency-format" }, formatCurrency(results.monthlyPension))
                ]),
                React.createElement('div', { className: "flex justify-between p-3 bg-red-50 rounded-lg" }, [
                    React.createElement('span', { className: "text-red-700" }, 
                        language === 'he' ? `מס (${results.weightedTaxRate}%):` : `Tax (${results.weightedTaxRate}%):`),
                    React.createElement('span', { className: "font-bold text-red-700 currency-format" }, `-${formatCurrency(results.pensionTax)}`)
                ]),
                React.createElement('div', { className: "flex justify-between p-3 bg-green-50 rounded-lg border-2 border-green-200" }, [
                    React.createElement('span', { className: "text-green-700 font-bold" }, 
                        language === 'he' ? "סכום נטו:" : "Net Amount:"),
                    React.createElement('span', { className: "font-bold text-green-700 currency-format" }, formatCurrency(results.netPension))
                ])
            ])
        ]),

        // Expense Gap Analysis
        React.createElement('div', { className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in" }, [
            React.createElement('h3', { className: "text-xl font-bold text-orange-700 mb-4 flex items-center" }, [
                React.createElement(Target, { className: "mr-2" }),
                language === 'he' ? "📊 ניתוח פערי הוצאות ויעדים" : "📊 Expense Gap Analysis"
            ]),
            React.createElement('div', { className: "space-y-4" }, [
                // Current vs Future Expenses
                React.createElement('div', { className: "grid grid-cols-2 gap-3" }, [
                    React.createElement('div', { className: "bg-blue-50 rounded-lg p-3" }, [
                        React.createElement('div', { className: "text-sm text-gray-600" }, 
                            language === 'he' ? "הוצאות חודשיות כיום" : "Current Monthly Expenses"),
                        React.createElement('div', { className: "font-bold text-blue-700 currency-format" }, 
                            formatCurrency(inputs.currentMonthlyExpenses))
                    ]),
                    React.createElement('div', { className: "bg-orange-50 rounded-lg p-3" }, [
                        React.createElement('div', { className: "text-sm text-gray-600" }, 
                            language === 'he' ? "הוצאות עתידיות (עם אינפלציה)" : "Future Expenses (with inflation)"),
                        React.createElement('div', { className: "font-bold text-orange-700 currency-format" }, 
                            formatCurrency(results.futureMonthlyExpenses))
                    ])
                ]),
                
                // Retirement Income vs Expenses
                React.createElement('div', { 
                    className: `p-4 rounded-lg border-2 ${
                        results.remainingAfterExpenses >= 0 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                    }`
                }, [
                    React.createElement('div', { className: "flex justify-between items-center mb-2" }, [
                        React.createElement('span', { className: "font-medium" }, 
                            language === 'he' ? "הכנסה נטו בפנסיה:" : "Net Retirement Income:"),
                        React.createElement('span', { className: "font-bold currency-format" }, 
                            formatCurrency(results.totalNetIncome))
                    ]),
                    React.createElement('div', { className: "flex justify-between items-center mb-2" }, [
                        React.createElement('span', { className: "font-medium" }, 
                            language === 'he' ? "הוצאות עתידיות:" : "Future Monthly Expenses:"),
                        React.createElement('span', { className: "font-bold currency-format" }, 
                            `-${formatCurrency(results.futureMonthlyExpenses)}`)
                    ]),
                    React.createElement('hr', { className: "my-2 border-gray-300" }),
                    React.createElement('div', { className: "flex justify-between items-center" }, [
                        React.createElement('span', { className: "font-bold text-lg" }, 
                            language === 'he' ? "יתרה חודשית:" : "Monthly Surplus/Deficit:"),
                        React.createElement('span', { 
                            className: `font-bold text-xl currency-format ${
                                results.remainingAfterExpenses >= 0 ? 'text-green-700' : 'text-red-700'
                            }`
                        }, formatCurrency(results.remainingAfterExpenses))
                    ])
                ]),
                
                // Target Analysis
                React.createElement('div', { 
                    className: `p-4 rounded-lg border-2 ${
                        results.achievesTarget 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-yellow-50 border-yellow-200'
                    }`
                }, [
                    React.createElement('div', { className: "space-y-1 mb-2" }, [
                        React.createElement('div', { className: "flex justify-between items-center" }, [
                            React.createElement('span', { className: "font-medium" }, 
                                language === 'he' ? `יעד החלפת ${inputs.targetReplacement}% ממשכורת:` : `Target ${inputs.targetReplacement}% salary replacement:`),
                            React.createElement('span', { className: "font-bold currency-format" }, 
                                formatCurrency(results.targetMonthlyIncome))
                        ]),
                        React.createElement('div', { className: "flex justify-between items-center text-sm text-gray-600" }, [
                            React.createElement('span', null, 
                                language === 'he' ? "(בכוח קנייה של היום):" : "(in today's purchasing power):"),
                            React.createElement('span', { className: "font-semibold currency-format" }, 
                                formatCurrency(results.targetMonthlyIncomeInflationAdjusted))
                        ])
                    ]),
                    React.createElement('div', { className: "flex justify-between items-center mb-2" }, [
                        React.createElement('span', { className: "font-medium" }, 
                            language === 'he' ? "הכנסה צפויה בפנסיה:" : "Expected retirement income:"),
                        React.createElement('span', { className: "font-bold currency-format" }, 
                            formatCurrency(results.totalNetIncome))
                    ]),
                    React.createElement('hr', { className: "my-2 border-gray-300" }),
                    React.createElement('div', { className: "space-y-1" }, [
                        React.createElement('div', { className: "flex justify-between items-center" }, [
                            React.createElement('span', { className: "font-bold text-lg" }, 
                                results.achievesTarget 
                                    ? (language === 'he' ? "✅ היעד מושג! עודף:" : "✅ Target achieved! Surplus:")
                                    : (language === 'he' ? "⚠️ פער מהיעד:" : "⚠️ Gap from target:")),
                            React.createElement('span', { 
                                className: `font-bold text-xl currency-format ${
                                    results.achievesTarget ? 'text-green-700' : 'text-yellow-700'
                                }`
                            }, results.achievesTarget 
                                ? formatCurrency(-results.targetGap)
                                : formatCurrency(results.targetGap))
                        ]),
                        React.createElement('div', { className: "flex justify-between items-center text-sm" }, [
                            React.createElement('span', { className: "text-gray-600" }, 
                                language === 'he' ? "(בכוח קנייה של היום):" : "(in today's purchasing power):"),
                            React.createElement('span', { 
                                className: `font-semibold currency-format ${
                                    results.achievesTarget ? 'text-green-600' : 'text-yellow-600'
                                }`
                            }, results.achievesTarget 
                                ? formatCurrency(-results.targetGapInflationAdjusted)
                                : formatCurrency(results.targetGapInflationAdjusted))
                        ])
                    ])
                ]),
                
                // Summary insights
                React.createElement('div', { className: "bg-gray-50 rounded-lg p-4" }, [
                    React.createElement('h4', { className: "font-bold text-gray-800 mb-2" }, 
                        language === 'he' ? "💡 תובנות מרכזיות:" : "💡 Key Insights:"),
                    React.createElement('ul', { className: "space-y-2 text-sm text-gray-700" }, [
                        React.createElement('li', { className: "bg-blue-50 p-2 rounded border-l-4 border-blue-400" }, 
                            language === 'he' 
                                ? `📊 השפעת אינפלציה: הכנסה של ${formatCurrency(results.totalNetIncome)} תהיה שווה ${formatCurrency(results.inflationAdjustedIncome)} בכוח קנייה של היום`
                                : `📊 Inflation impact: Income of ${formatCurrency(results.totalNetIncome)} equals ${formatCurrency(results.inflationAdjustedIncome)} in today's purchasing power`),
                        React.createElement('li', null, 
                            language === 'he' 
                                ? `• עודף/גירעון אחרי הוצאות (בכוח קנייה של היום): ${formatCurrency(results.remainingAfterExpensesInflationAdjusted)}`
                                : `• Surplus/deficit after expenses (today's purchasing power): ${formatCurrency(results.remainingAfterExpensesInflationAdjusted)}`),
                        React.createElement('li', null, 
                            language === 'he' 
                                ? `• אחוז החלפה נומינלי: ${Math.round((results.totalNetIncome / (workPeriods[workPeriods.length - 1]?.salary || 1)) * 100)}% | בכוח קנייה של היום: ${Math.round((results.inflationAdjustedIncome / (workPeriods[workPeriods.length - 1]?.salary || 1)) * 100)}%`
                                : `• Replacement ratio nominal: ${Math.round((results.totalNetIncome / (workPeriods[workPeriods.length - 1]?.salary || 1)) * 100)}% | Today's purchasing power: ${Math.round((results.inflationAdjustedIncome / (workPeriods[workPeriods.length - 1]?.salary || 1)) * 100)}%`),
                        results.remainingAfterExpenses < 0 && React.createElement('li', { className: "text-red-600 font-medium bg-red-50 p-2 rounded" }, 
                            language === 'he' 
                                ? "⚠️ נדרש להגדיל הפקדות או להקטין הוצאות צפויות"
                                : "⚠️ Consider increasing contributions or reducing expected expenses")
                    ])
                ])
            ])
        ]),

        // Claude AI Insights Section
        claudeInsights && React.createElement('div', { className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in" }, [
            React.createElement('h3', { className: "text-xl font-bold text-indigo-700 mb-4 flex items-center" }, [
                React.createElement('span', { className: "mr-2" }, "🤖"),
                language === 'he' ? "מסקנות מרכזיות מקלאוד" : "Claude's Key Insights"
            ]),
            React.createElement('div', { className: "bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-5 border border-indigo-200" }, [
                claudeInsights && React.createElement('div', { className: "space-y-3 text-gray-700" }, 
                    claudeInsights.map((insight, index) => 
                        React.createElement('p', { 
                            key: index,
                            className: index === claudeInsights.length - 1 
                                ? "text-sm leading-relaxed font-medium text-indigo-800" 
                                : "text-sm leading-relaxed"
                        }, insight)
                    )
                )
            ]),
            
            // Export Buttons
            React.createElement('div', { className: "mt-4 pt-4 border-t border-indigo-200" }, [
                React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-3" }, [
                    React.createElement('button', {
                        onClick: () => exportRetirementSummary(),
                        className: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-3 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg flex items-center justify-center font-medium"
                    }, [
                        React.createElement('span', { className: "mr-2" }, "📱"),
                        language === 'he' ? "שיתוף טקסט" : "Share Text"
                    ]),
                    React.createElement('button', {
                        onClick: () => exportAsImage(),
                        className: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-3 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg flex items-center justify-center font-medium"
                    }, [
                        React.createElement('span', { className: "mr-2" }, "🖼️"),
                        language === 'he' ? "שמירה כתמונה" : "Save as Image"
                    ])
                ])
            ])
        ]),

        // General Recommendations Section
        recommendations.length > 0 && React.createElement('div', { className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in" }, [
            React.createElement('h3', { className: "text-xl font-bold text-orange-700 mb-4 flex items-center" }, [
                React.createElement('span', { className: "mr-2" }, "🎯"),
                language === 'he' ? "המלצות כלליות" : "General Recommendations"
            ]),
            React.createElement('div', { className: "space-y-3" }, 
                recommendations.map((rec, index) => {
                    const bgColor = rec.type === 'critical' ? 'bg-red-50 border-red-200' :
                                   rec.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                                   rec.type === 'caution' ? 'bg-orange-50 border-orange-200' :
                                   rec.type === 'success' ? 'bg-green-50 border-green-200' :
                                   'bg-blue-50 border-blue-200';
                    
                    const textColor = rec.type === 'critical' ? 'text-red-800' :
                                     rec.type === 'warning' ? 'text-yellow-800' :
                                     rec.type === 'caution' ? 'text-orange-800' :
                                     rec.type === 'success' ? 'text-green-800' :
                                     'text-blue-800';
                    
                    return React.createElement('div', { 
                        key: index,
                        className: `p-4 rounded-lg border-2 ${bgColor}`
                    }, [
                        React.createElement('div', { className: `font-bold ${textColor} mb-2` }, rec.title),
                        React.createElement('div', { className: "text-gray-700 text-sm" }, rec.text)
                    ]);
                })
            ),
            React.createElement('div', { className: "mt-4 pt-4 border-t border-orange-200 text-center text-xs text-gray-500" }, 
                language === 'he' 
                    ? "💡 המלצות אלו מבוססות על המידע שהוזן ואינן מחליפות ייעוץ פיננסי מקצועי"
                    : "💡 These recommendations are based on entered information and don't replace professional financial advice")
        ])
    ]);
};

// Chart Section (separate component that can be conditionally rendered)
export const ChartSection = ({ 
    results, 
    showChart, 
    chartData, 
    language, 
    t, 
    TrendingUp, 
    SimpleChart 
}) => {
    if (!results || !showChart || !chartData || chartData.length <= 1) return null;

    return React.createElement('div', { 
        className: "mt-8 glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in" 
    }, [
        React.createElement('h3', { className: "text-2xl font-bold text-purple-700 mb-6 flex items-center" }, [
            React.createElement(TrendingUp, { className: "mr-2" }),
            t.progressChart
        ]),
        React.createElement('div', { className: "h-96 mb-4" },
            React.createElement(SimpleChart, { 
                data: chartData,
                type: 'line',
                language: language
            })
        ),
        React.createElement('div', { className: "bg-gray-50 rounded-lg p-4" }, [
            React.createElement('div', { className: "grid md:grid-cols-2 gap-4 text-sm" }, [
                React.createElement('div', { className: "flex items-start" }, [
                    React.createElement('div', { className: "w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-700 rounded mr-2 mt-1" }),
                    React.createElement('div', null, [
                        React.createElement('div', { className: "font-bold text-blue-700" }, 
                            language === 'he' ? "פנסיה" : "Pension"),
                        React.createElement('div', { className: "text-gray-600" }, 
                            language === 'he' ? "חיסכון פנסיה בלבד" : "Pension savings only")
                    ])
                ]),
                React.createElement('div', { className: "flex items-start" }, [
                    React.createElement('div', { className: "w-4 h-4 bg-gradient-to-r from-green-500 to-green-700 rounded mr-2 mt-1" }),
                    React.createElement('div', null, [
                        React.createElement('div', { className: "font-bold text-green-700" }, 
                            language === 'he' ? "קרן השתלמות" : "Training Fund"),
                        React.createElement('div', { className: "text-gray-600" }, 
                            language === 'he' ? "חיסכון קרן השתלמות בלבד" : "Training fund savings only")
                    ])
                ]),
                React.createElement('div', { className: "flex items-start" }, [
                    React.createElement('div', { className: "w-4 h-4 bg-gradient-to-r from-purple-500 to-purple-700 rounded mr-2 mt-1" }),
                    React.createElement('div', null, [
                        React.createElement('div', { className: "font-bold text-purple-700" }, 
                            language === 'he' ? "סה״כ נומינלי" : "Total Nominal"),
                        React.createElement('div', { className: "text-gray-600" }, 
                            language === 'he' ? "הסכום הנומינלי שיצטבר" : "Actual amount that will accumulate")
                    ])
                ]),
                React.createElement('div', { className: "flex items-start" }, [
                    React.createElement('div', { className: "w-4 h-4 bg-gradient-to-r from-red-500 to-red-700 rounded mr-2 mt-1" }),
                    React.createElement('div', null, [
                        React.createElement('div', { className: "font-bold text-red-700" }, 
                            language === 'he' ? "בכוח קנייה נוכחי" : "Current Purchasing Power"),
                        React.createElement('div', { className: "text-gray-600" }, 
                            language === 'he' ? "הערך האמיתי בכוח קנייה של היום" : "Real value in today's purchasing power")
                    ])
                ])
            ])
        ])
    ]);
};