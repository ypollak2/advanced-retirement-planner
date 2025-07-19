// Summary Panel Component - Side panel with key financial summaries and insights
// Created by Yali Pollak (יהלי פולק)

const SummaryPanel = ({ 
    inputs, 
    results, 
    partnerResults,
    stressTestResults,
    language = 'en',
    formatCurrency,
    workingCurrency = 'ILS'
}) => {
    // Content translations
    const content = {
        he: {
            title: 'סיכום מפתח',
            subtitle: 'נתונים חשובים לתכנון הפנסיה',
            nominalValues: 'ערכים נומינליים',
            realValues: 'ערכים ריאליים (מותאם לאינפלציה)',
            currentAge: 'גיל נוכחי',
            retirementAge: 'גיל פרישה',
            yearsToRetirement: 'שנים עד פרישה',
            totalSavingsNominal: 'סה"כ חיסכון (נומינלי)',
            totalSavingsReal: 'סה"כ חיסכון (ריאלי)',
            monthlyIncomeNominal: 'הכנסה חודשית (נומינלי)',
            monthlyIncomeReal: 'הכנסה חודשית (ריאלי)',
            inflationImpact: 'השפעת האינפלציה',
            inflationRate: 'שיעור אינפלציה',
            purchasingPowerLoss: 'אובדן כוח קנייה',
            portfolioBreakdown: 'פילוח תיק ההשקעות',
            pensionFund: 'קרן פנסיה',
            trainingFund: 'קרן השתלמות',
            personalPortfolio: 'תיק אישי',
            realEstate: 'נדל"ן',
            cryptocurrency: 'קריפטו',
            riskAnalysis: 'ניתוח סיכונים',
            lowRisk: 'סיכון נמוך',
            mediumRisk: 'סיכון בינוני',
            highRisk: 'סיכון גבוה',
            diversificationScore: 'ציון פיזור סיכונים',
            monthlyContributions: 'הפקדות חודשיות',
            currentContributions: 'הפקדות נוכחיות',
            recommendedContributions: 'הפקדות מומלצות',
            savingsRate: 'שיעור חיסכון',
            currentRate: 'שיעור נוכחי',
            targetRate: 'שיעור יעד',
            keyInsights: 'תובנות מפתח',
            readinessScore: 'ציון מוכנות לפרישה',
            onTrack: 'על המסלול הנכון',
            needsAttention: 'דורש תשומת לב',
            criticalAction: 'נדרש פעולה דחופה'
        },
        en: {
            title: 'Key Summary',
            subtitle: 'Important data for retirement planning',
            nominalValues: 'Nominal Values',
            realValues: 'Real Values (inflation-adjusted)',
            currentAge: 'Current Age',
            retirementAge: 'Retirement Age',
            yearsToRetirement: 'Years to Retirement',
            totalSavingsNominal: 'Total Savings (Nominal)',
            totalSavingsReal: 'Total Savings (Real)',
            monthlyIncomeNominal: 'Monthly Income (Nominal)',
            monthlyIncomeReal: 'Monthly Income (Real)',
            inflationImpact: 'Inflation Impact',
            inflationRate: 'Inflation Rate',
            purchasingPowerLoss: 'Purchasing Power Loss',
            portfolioBreakdown: 'Portfolio Breakdown',
            pensionFund: 'Pension Fund',
            trainingFund: 'Training Fund',
            personalPortfolio: 'Personal Portfolio',
            realEstate: 'Real Estate',
            cryptocurrency: 'Cryptocurrency',
            riskAnalysis: 'Risk Analysis',
            lowRisk: 'Low Risk',
            mediumRisk: 'Medium Risk',
            highRisk: 'High Risk',
            diversificationScore: 'Diversification Score',
            monthlyContributions: 'Monthly Contributions',
            currentContributions: 'Current Contributions',
            recommendedContributions: 'Recommended Contributions',
            savingsRate: 'Savings Rate',
            currentRate: 'Current Rate',
            targetRate: 'Target Rate',
            keyInsights: 'Key Insights',
            readinessScore: 'Retirement Readiness Score',
            onTrack: 'On Track',
            needsAttention: 'Needs Attention',
            criticalAction: 'Critical Action Required'
        }
    };

    const t = content[language] || content.en;

    // Calculate derived values
    const yearsToRetirement = (inputs.retirementAge || 67) - (inputs.currentAge || 30);
    const inflationRate = (inputs.inflationRate || 3) / 100;
    
    // Calculate real values (inflation-adjusted)
    const inflationFactor = Math.pow(1 + inflationRate, yearsToRetirement);
    const totalSavingsReal = results?.totalSavings ? results.totalSavings / inflationFactor : 0;
    const monthlyIncomeReal = results?.monthlyIncome ? results.monthlyIncome / inflationFactor : 0;
    
    // Calculate purchasing power loss
    const purchasingPowerLoss = ((1 - (1 / inflationFactor)) * 100);
    
    // Calculate portfolio breakdown
    const calculatePortfolioBreakdown = () => {
        const pension = (inputs.currentSavings || 0);
        const training = (inputs.currentTrainingFund || 0);
        const personal = (inputs.currentPersonalPortfolio || 0);
        const realEstate = (inputs.currentRealEstate || 0);
        const crypto = (inputs.currentCrypto || 0);
        
        const total = pension + training + personal + realEstate + crypto;
        
        if (total === 0) return null;
        
        return {
            pension: (pension / total) * 100,
            training: (training / total) * 100,
            personal: (personal / total) * 100,
            realEstate: (realEstate / total) * 100,
            crypto: (crypto / total) * 100
        };
    };
    
    const portfolioBreakdown = calculatePortfolioBreakdown();
    
    // Calculate diversification score
    const calculateDiversificationScore = () => {
        if (!portfolioBreakdown) return 0;
        
        const values = Object.values(portfolioBreakdown);
        const nonZeroValues = values.filter(v => v > 0);
        
        if (nonZeroValues.length <= 1) return 20; // Poor diversification
        if (nonZeroValues.length === 2) return 40;
        if (nonZeroValues.length === 3) return 60;
        if (nonZeroValues.length === 4) return 80;
        if (nonZeroValues.length === 5) return 100; // Excellent diversification
        
        return 50;
    };
    
    const diversificationScore = calculateDiversificationScore();
    
    // Calculate current savings rate
    const currentSalary = inputs.currentMonthlySalary || inputs.currentSalary || 20000;
    const currentContributions = (inputs.monthlyContribution || 0) + (inputs.trainingFundMonthly || 0) + (inputs.personalPortfolioMonthly || 0);
    const currentSavingsRate = currentSalary > 0 ? (currentContributions / currentSalary) * 100 : 0;
    
    // Calculate readiness score
    const calculateReadinessScore = () => {
        if (!results?.readinessScore) {
            // Simple calculation based on available data
            const savingsScore = Math.min((currentSavingsRate / 20) * 100, 100); // Target 20% savings rate
            const diversificationPenalty = diversificationScore < 60 ? -20 : 0;
            const agePenalty = yearsToRetirement < 20 ? -10 : 0;
            
            return Math.max(savingsScore + diversificationPenalty + agePenalty, 0);
        }
        return results.readinessScore;
    };
    
    const readinessScore = calculateReadinessScore();
    
    // Get readiness status
    const getReadinessStatus = () => {
        if (readinessScore >= 80) return { text: t.onTrack, color: 'text-green-600', bg: 'bg-green-50' };
        if (readinessScore >= 60) return { text: t.needsAttention, color: 'text-yellow-600', bg: 'bg-yellow-50' };
        return { text: t.criticalAction, color: 'text-red-600', bg: 'bg-red-50' };
    };
    
    const readinessStatus = getReadinessStatus();

    return React.createElement('div', {
        className: 'professional-card animate-fade-in-up'
    }, [
        // Header
        React.createElement('div', {
            key: 'header',
            className: 'mb-6'
        }, [
            React.createElement('h2', {
                key: 'title',
                className: 'text-xl font-bold text-gray-800 mb-2'
            }, [
                React.createElement('span', { key: 'icon' }, '📊'),
                ' ',
                t.title
            ]),
            React.createElement('p', {
                key: 'subtitle',
                className: 'text-sm text-gray-600'
            }, t.subtitle)
        ]),

        // Readiness Score
        React.createElement('div', {
            key: 'readiness',
            className: `p-4 rounded-lg mb-6 ${readinessStatus.bg}`
        }, [
            React.createElement('div', {
                key: 'readiness-header',
                className: 'flex items-center justify-between mb-2'
            }, [
                React.createElement('span', {
                    key: 'readiness-label',
                    className: 'font-semibold text-gray-700'
                }, t.readinessScore),
                React.createElement('span', {
                    key: 'readiness-value',
                    className: `font-bold text-2xl ${readinessStatus.color}`
                }, `${Math.round(readinessScore)}%`)
            ]),
            React.createElement('div', {
                key: 'readiness-status',
                className: `text-sm ${readinessStatus.color}`
            }, readinessStatus.text)
        ]),

        // Basic Info
        React.createElement('div', {
            key: 'basic-info',
            className: 'mb-6'
        }, [
            React.createElement('div', {
                key: 'info-grid',
                className: 'grid grid-cols-2 gap-4'
            }, [
                React.createElement('div', {
                    key: 'current-age',
                    className: 'text-center p-3 bg-gray-50 rounded-lg'
                }, [
                    React.createElement('div', {
                        key: 'age-label',
                        className: 'text-xs text-gray-600'
                    }, t.currentAge),
                    React.createElement('div', {
                        key: 'age-value',
                        className: 'text-lg font-bold text-gray-800'
                    }, inputs.currentAge || 30)
                ]),
                React.createElement('div', {
                    key: 'retirement-age',
                    className: 'text-center p-3 bg-gray-50 rounded-lg'
                }, [
                    React.createElement('div', {
                        key: 'ret-age-label',
                        className: 'text-xs text-gray-600'
                    }, t.retirementAge),
                    React.createElement('div', {
                        key: 'ret-age-value',
                        className: 'text-lg font-bold text-gray-800'
                    }, inputs.retirementAge || 67)
                ]),
                React.createElement('div', {
                    key: 'years-to-retirement',
                    className: 'text-center p-3 bg-blue-50 rounded-lg col-span-2'
                }, [
                    React.createElement('div', {
                        key: 'years-label',
                        className: 'text-xs text-blue-600'
                    }, t.yearsToRetirement),
                    React.createElement('div', {
                        key: 'years-value',
                        className: 'text-xl font-bold text-blue-800'
                    }, yearsToRetirement)
                ])
            ])
        ]),

        // Nominal vs Real Values
        React.createElement('div', {
            key: 'nominal-real',
            className: 'mb-6'
        }, [
            React.createElement('h3', {
                key: 'values-title',
                className: 'font-semibold text-gray-700 mb-3'
            }, '💰 ' + t.nominalValues + ' vs ' + t.realValues),
            
            React.createElement('div', {
                key: 'values-grid',
                className: 'space-y-3'
            }, [
                React.createElement('div', {
                    key: 'total-savings',
                    className: 'p-3 bg-white border border-gray-200 rounded-lg'
                }, [
                    React.createElement('div', {
                        key: 'savings-label',
                        className: 'text-xs text-gray-600 mb-1'
                    }, t.totalSavingsNominal),
                    React.createElement('div', {
                        key: 'savings-nominal',
                        className: 'text-lg font-bold text-green-600'
                    }, formatCurrency ? formatCurrency(results?.totalSavings, workingCurrency) : `₪${results?.totalSavings?.toLocaleString()}`),
                    React.createElement('div', {
                        key: 'savings-real-label',
                        className: 'text-xs text-gray-500 mt-2'
                    }, t.totalSavingsReal),
                    React.createElement('div', {
                        key: 'savings-real',
                        className: 'text-sm font-semibold text-gray-700'
                    }, formatCurrency ? formatCurrency(totalSavingsReal, workingCurrency) : `₪${totalSavingsReal?.toLocaleString()}`),
                    
                    // Multi-currency display for total savings
                    results?.totalSavings && window.MultiCurrencySavings ? React.createElement('div', {
                        key: 'multi-currency-savings',
                        className: 'mt-3 pt-3 border-t border-gray-100'
                    }, [
                        React.createElement('div', {
                            key: 'multi-currency-label',
                            className: 'text-xs text-gray-500 mb-2'
                        }, language === 'he' ? 'ערכים במטבעות נוספים' : 'Other Currencies'),
                        React.createElement(window.MultiCurrencySavings, {
                            key: 'multi-currency-component',
                            amount: results.totalSavings,
                            title: '',
                            language: language,
                            compact: true,
                            showLoading: false,
                            currencies: ['USD', 'EUR', 'GBP', 'BTC']
                        })
                    ]) : null
                ]),
                
                React.createElement('div', {
                    key: 'monthly-income',
                    className: 'p-3 bg-white border border-gray-200 rounded-lg'
                }, [
                    React.createElement('div', {
                        key: 'income-label',
                        className: 'text-xs text-gray-600 mb-1'
                    }, t.monthlyIncomeNominal),
                    React.createElement('div', {
                        key: 'income-nominal',
                        className: 'text-lg font-bold text-blue-600'
                    }, formatCurrency ? formatCurrency(results?.monthlyIncome, workingCurrency) : `₪${results?.monthlyIncome?.toLocaleString()}`),
                    React.createElement('div', {
                        key: 'income-real-label',
                        className: 'text-xs text-gray-500 mt-2'
                    }, t.monthlyIncomeReal),
                    React.createElement('div', {
                        key: 'income-real',
                        className: 'text-sm font-semibold text-gray-700'
                    }, formatCurrency ? formatCurrency(monthlyIncomeReal, workingCurrency) : `₪${monthlyIncomeReal?.toLocaleString()}`)
                ])
            ])
        ]),

        // Inflation Impact
        React.createElement('div', {
            key: 'inflation',
            className: 'mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg'
        }, [
            React.createElement('h3', {
                key: 'inflation-title',
                className: 'font-semibold text-orange-800 mb-3'
            }, '📈 ' + t.inflationImpact),
            React.createElement('div', {
                key: 'inflation-grid',
                className: 'grid grid-cols-2 gap-3'
            }, [
                React.createElement('div', {
                    key: 'inflation-rate'
                }, [
                    React.createElement('div', {
                        key: 'rate-label',
                        className: 'text-xs text-orange-600'
                    }, t.inflationRate),
                    React.createElement('div', {
                        key: 'rate-value',
                        className: 'text-lg font-bold text-orange-800'
                    }, `${inputs.inflationRate || 3}%`)
                ]),
                React.createElement('div', {
                    key: 'power-loss'
                }, [
                    React.createElement('div', {
                        key: 'loss-label',
                        className: 'text-xs text-orange-600'
                    }, t.purchasingPowerLoss),
                    React.createElement('div', {
                        key: 'loss-value',
                        className: 'text-lg font-bold text-orange-800'
                    }, `${purchasingPowerLoss.toFixed(1)}%`)
                ])
            ])
        ]),

        // Portfolio Breakdown
        portfolioBreakdown && React.createElement('div', {
            key: 'portfolio',
            className: 'mb-6'
        }, [
            React.createElement('h3', {
                key: 'portfolio-title',
                className: 'font-semibold text-gray-700 mb-3'
            }, '🎯 ' + t.portfolioBreakdown),
            React.createElement('div', {
                key: 'portfolio-items',
                className: 'space-y-2'
            }, [
                portfolioBreakdown.pension > 0 && React.createElement('div', {
                    key: 'pension',
                    className: 'flex justify-between items-center p-2 bg-blue-50 rounded'
                }, [
                    React.createElement('span', {
                        key: 'pension-label',
                        className: 'text-sm text-blue-700'
                    }, t.pensionFund),
                    React.createElement('span', {
                        key: 'pension-value',
                        className: 'text-sm font-semibold text-blue-800'
                    }, `${portfolioBreakdown.pension.toFixed(1)}%`)
                ]),
                portfolioBreakdown.training > 0 && React.createElement('div', {
                    key: 'training',
                    className: 'flex justify-between items-center p-2 bg-green-50 rounded'
                }, [
                    React.createElement('span', {
                        key: 'training-label',
                        className: 'text-sm text-green-700'
                    }, t.trainingFund),
                    React.createElement('span', {
                        key: 'training-value',
                        className: 'text-sm font-semibold text-green-800'
                    }, `${portfolioBreakdown.training.toFixed(1)}%`)
                ]),
                portfolioBreakdown.personal > 0 && React.createElement('div', {
                    key: 'personal',
                    className: 'flex justify-between items-center p-2 bg-purple-50 rounded'
                }, [
                    React.createElement('span', {
                        key: 'personal-label',
                        className: 'text-sm text-purple-700'
                    }, t.personalPortfolio),
                    React.createElement('span', {
                        key: 'personal-value',
                        className: 'text-sm font-semibold text-purple-800'
                    }, `${portfolioBreakdown.personal.toFixed(1)}%`)
                ]),
                portfolioBreakdown.realEstate > 0 && React.createElement('div', {
                    key: 'real-estate',
                    className: 'flex justify-between items-center p-2 bg-yellow-50 rounded'
                }, [
                    React.createElement('span', {
                        key: 'realestate-label',
                        className: 'text-sm text-yellow-700'
                    }, t.realEstate),
                    React.createElement('span', {
                        key: 'realestate-value',
                        className: 'text-sm font-semibold text-yellow-800'
                    }, `${portfolioBreakdown.realEstate.toFixed(1)}%`)
                ]),
                portfolioBreakdown.crypto > 0 && React.createElement('div', {
                    key: 'crypto',
                    className: 'flex justify-between items-center p-2 bg-indigo-50 rounded'
                }, [
                    React.createElement('span', {
                        key: 'crypto-label',
                        className: 'text-sm text-indigo-700'
                    }, t.cryptocurrency),
                    React.createElement('span', {
                        key: 'crypto-value',
                        className: 'text-sm font-semibold text-indigo-800'
                    }, `${portfolioBreakdown.crypto.toFixed(1)}%`)
                ])
            ]),
            React.createElement('div', {
                key: 'diversification',
                className: 'mt-3 p-2 bg-gray-50 rounded flex justify-between items-center'
            }, [
                React.createElement('span', {
                    key: 'div-label',
                    className: 'text-sm text-gray-700'
                }, t.diversificationScore),
                React.createElement('span', {
                    key: 'div-value',
                    className: `text-sm font-semibold ${diversificationScore >= 80 ? 'text-green-600' : diversificationScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`
                }, `${diversificationScore}/100`)
            ])
        ]),

        // Savings Rate
        React.createElement('div', {
            key: 'savings-rate',
            className: 'mb-6'
        }, [
            React.createElement('h3', {
                key: 'rate-title',
                className: 'font-semibold text-gray-700 mb-3'
            }, '💪 ' + t.savingsRate),
            React.createElement('div', {
                key: 'rate-comparison',
                className: 'grid grid-cols-2 gap-3'
            }, [
                React.createElement('div', {
                    key: 'current-rate',
                    className: 'text-center p-3 bg-gray-50 rounded-lg'
                }, [
                    React.createElement('div', {
                        key: 'current-label',
                        className: 'text-xs text-gray-600'
                    }, t.currentRate),
                    React.createElement('div', {
                        key: 'current-value',
                        className: `text-lg font-bold ${currentSavingsRate >= 20 ? 'text-green-600' : currentSavingsRate >= 15 ? 'text-yellow-600' : 'text-red-600'}`
                    }, `${currentSavingsRate.toFixed(1)}%`)
                ]),
                React.createElement('div', {
                    key: 'target-rate',
                    className: 'text-center p-3 bg-blue-50 rounded-lg'
                }, [
                    React.createElement('div', {
                        key: 'target-label',
                        className: 'text-xs text-blue-600'
                    }, t.targetRate),
                    React.createElement('div', {
                        key: 'target-value',
                        className: 'text-lg font-bold text-blue-800'
                    }, '20%')
                ])
            ])
        ])
    ]);
};

// Export to window for global access
window.SummaryPanel = SummaryPanel;