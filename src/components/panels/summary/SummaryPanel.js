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
            emergencyFund: 'קרן חירום',
            personalPortfolio: 'תיק אישי',
            realEstate: 'נדל"ן',
            cryptocurrency: 'קריפטו',
            riskAnalysis: 'ניתוח סיכונים',
            lowRisk: 'סיכון נמוך',
            mediumRisk: 'סיכון בינוני',
            highRisk: 'סיכון גבוה',
            diversificationScore: 'ציון פיזור סיכונים',
            diversificationExplanation: 'פיזור נכסים על פני סוגי השקעה שונים מפחית סיכון ומשפר תשואות לטווח הארוך',
            diversificationScoreDetails: {
                excellent: '90-100: פיזור מעולה על פני 4-5 סוגי נכסים עם חלוקה מאוזנת',
                good: '70-89: פיזור טוב על פני 3-4 סוגי נכסים',
                fair: '50-69: פיזור בינוני על פני 2-3 סוגי נכסים',
                poor: '20-49: פיזור לקוי - ריכוז יתר ב-1-2 נכסים',
                critical: '0-19: קריטי - תיק מרוכז מאוד, סיכון גבוה'
            },
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
            emergencyFund: 'Emergency Fund',
            personalPortfolio: 'Personal Portfolio',
            realEstate: 'Real Estate',
            cryptocurrency: 'Cryptocurrency',
            riskAnalysis: 'Risk Analysis',
            lowRisk: 'Low Risk',
            mediumRisk: 'Medium Risk',
            highRisk: 'High Risk',
            diversificationScore: 'Diversification Score',
            diversificationExplanation: 'Asset diversification across different investment types reduces risk and improves long-term returns',
            diversificationScoreDetails: {
                excellent: '90-100: Excellent diversification across 4-5 asset types with balanced allocation',
                good: '70-89: Good diversification across 3-4 asset types', 
                fair: '50-69: Fair diversification across 2-3 asset types',
                poor: '20-49: Poor diversification - too concentrated in 1-2 assets',
                critical: '0-19: Critical - extremely concentrated portfolio, high risk'
            },
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
    
    // Calculate enhanced portfolio breakdown with partner planning support
    const calculatePortfolioBreakdown = () => {
        // Individual assets
        const pension = parseFloat(inputs.currentSavings || 0);
        const training = parseFloat(inputs.currentTrainingFund || 0);
        const emergencyFund = parseFloat(inputs.emergencyFund || 0);
        const personal = parseFloat(inputs.currentPersonalPortfolio || 0);
        const realEstate = parseFloat(inputs.currentRealEstate || 0);
        const crypto = parseFloat(inputs.currentCrypto || 0);
        
        // Partner assets (if couple planning)
        let partnerAssets = 0;
        let partnerEmergencyFunds = 0;
        if (inputs.planningType === 'couple') {
            const partner1Pension = parseFloat(inputs.partner1PensionSavings || 0);
            const partner1Training = parseFloat(inputs.partner1TrainingFund || 0);
            const partner1Emergency = parseFloat(inputs.partner1EmergencyFund || 0);
            const partner1Personal = parseFloat(inputs.partner1PersonalPortfolio || 0);
            const partner1RealEstate = parseFloat(inputs.partner1RealEstate || 0);
            const partner1Crypto = parseFloat(inputs.partner1Crypto || 0);
            
            const partner2Pension = parseFloat(inputs.partner2PensionSavings || 0);
            const partner2Training = parseFloat(inputs.partner2TrainingFund || 0);
            const partner2Emergency = parseFloat(inputs.partner2EmergencyFund || 0);
            const partner2Personal = parseFloat(inputs.partner2PersonalPortfolio || 0);
            const partner2RealEstate = parseFloat(inputs.partner2RealEstate || 0);
            const partner2Crypto = parseFloat(inputs.partner2Crypto || 0);
            
            partnerEmergencyFunds = partner1Emergency + partner2Emergency;
            partnerAssets = partner1Pension + partner1Training + partner1Personal + partner1RealEstate + partner1Crypto +
                           partner2Pension + partner2Training + partner2Personal + partner2RealEstate + partner2Crypto;
        }
        
        // Use results data if available for more accurate calculations
        const resultsPension = results?.totalSavings || pension;
        const resultsTraining = results?.trainingFundValue || training;
        const resultsEmergency = emergencyFund + partnerEmergencyFunds;
        const resultsPersonal = results?.personalPortfolioValue || personal;
        const resultsRealEstate = results?.currentRealEstate || realEstate;
        const resultsCrypto = results?.currentCrypto || crypto;
        
        const total = resultsPension + resultsTraining + resultsEmergency + resultsPersonal + resultsRealEstate + resultsCrypto + partnerAssets;
        
        if (total === 0) return null;
        
        return {
            pension: (resultsPension / total) * 100,
            training: (resultsTraining / total) * 100,
            emergencyFund: (resultsEmergency / total) * 100,
            personal: (resultsPersonal / total) * 100,
            realEstate: (resultsRealEstate / total) * 100,
            crypto: (resultsCrypto / total) * 100,
            partnerAssets: (partnerAssets / total) * 100,
            total: total
        };
    };
    
    const portfolioBreakdown = calculatePortfolioBreakdown();
    
    // Calculate enhanced diversification score
    const calculateDiversificationScore = () => {
        if (!portfolioBreakdown) return 0;
        
        // Exclude total and partnerAssets from the score calculation as they are summaries
        const assetCategories = ['pension', 'training', 'emergencyFund', 'personal', 'realEstate', 'crypto'];
        const categoryValues = assetCategories.map(cat => portfolioBreakdown[cat] || 0);
        const nonZeroValues = categoryValues.filter(v => v > 0);
        const maxConcentration = Math.max(...categoryValues);
        
        // Base score on number of asset classes
        let baseScore = 0;
        if (nonZeroValues.length <= 1) baseScore = 20; // Poor diversification
        else if (nonZeroValues.length === 2) baseScore = 40;
        else if (nonZeroValues.length === 3) baseScore = 60;
        else if (nonZeroValues.length === 4) baseScore = 80;
        else if (nonZeroValues.length === 5) baseScore = 90;
        else if (nonZeroValues.length >= 6) baseScore = 100; // Excellent diversification
        
        // Penalty for over-concentration (any single asset > 70%)
        if (maxConcentration > 70) baseScore = Math.max(baseScore - 20, 10);
        else if (maxConcentration > 50) baseScore = Math.max(baseScore - 10, 20);
        
        // Bonus for partner planning (better diversification across partners)
        if (inputs.planningType === 'couple' && portfolioBreakdown.partnerAssets > 0) {
            baseScore = Math.min(baseScore + 10, 100);
        }
        
        return Math.round(baseScore);
    };
    
    const diversificationScore = calculateDiversificationScore();
    
    // Calculate current savings rate with proper field mapping
    const currentSalary = inputs.currentMonthlySalary || inputs.currentSalary || 20000;
    
    // Calculate total income including all sources
    let totalIncome = currentSalary;
    if (inputs.planningType === 'couple') {
        totalIncome += (inputs.partner1Salary || 0) + (inputs.partner2Salary || 0);
    }
    totalIncome += (inputs.freelanceIncome || 0) + (inputs.rentalIncome || 0) + 
                   (inputs.dividendIncome || 0) + 
                   ((inputs.annualBonus || 0) / 12) + // Convert annual to monthly
                   ((inputs.quarterlyRSU || 0) / 3) + // Convert quarterly to monthly
                   (inputs.otherIncome || 0);
    
    // Calculate total contributions (pension + training fund + personal investments)
    const pensionContribution = totalIncome * 0.175; // Default 17.5% pension
    const trainingFundContribution = totalIncome * 0.075; // Default 7.5% training fund
    const personalPortfolioContribution = inputs.personalPortfolioMonthly || 0;
    const currentContributions = pensionContribution + trainingFundContribution + personalPortfolioContribution;
    
    // Ensure safe calculation with proper fallbacks
    let currentSavingsRate = 0;
    if (totalIncome > 0 && currentContributions > 0) {
        currentSavingsRate = (currentContributions / totalIncome) * 100;
        // Validate the result
        if (isNaN(currentSavingsRate) || !isFinite(currentSavingsRate)) {
            currentSavingsRate = 0;
        }
    }
    
    // Calculate readiness score with comprehensive factors
    const calculateReadinessScore = () => {
        if (!results?.readinessScore) {
            let score = 0;
            
            // Factor 1: Savings Rate (40 points)
            const savingsRateScore = Math.min((currentSavingsRate / 25) * 40, 40); // Target 25% savings rate
            score += savingsRateScore;
            
            // Factor 2: Current Savings Adequacy (25 points)
            const targetSavings = totalIncome * 12 * (inputs.currentAge - 22); // Rule of thumb: 1x annual income per working year
            const currentTotalSavings = (inputs.currentSavings || 0) + 
                                      (inputs.currentTrainingFund || 0) + 
                                      (inputs.currentPersonalPortfolio || 0);
            const savingsAdequacyScore = Math.min((currentTotalSavings / targetSavings) * 25, 25);
            score += savingsAdequacyScore;
            
            // Factor 3: Time Horizon (20 points)
            const timeScore = yearsToRetirement >= 30 ? 20 : 
                            yearsToRetirement >= 20 ? 15 : 
                            yearsToRetirement >= 10 ? 10 : 5;
            score += timeScore;
            
            // Factor 4: Diversification (10 points)
            const diversificationBonus = diversificationScore >= 80 ? 10 : 
                                       diversificationScore >= 60 ? 7 : 
                                       diversificationScore >= 40 ? 4 : 0;
            score += diversificationBonus;
            
            // Factor 5: Income Replacement Ratio (5 points)
            if (results?.monthlyIncome && totalIncome > 0) {
                const replacementRatio = (results.monthlyIncome / totalIncome) * 100;
                const replacementScore = replacementRatio >= 80 ? 5 : 
                                       replacementRatio >= 70 ? 4 : 
                                       replacementRatio >= 60 ? 2 : 0;
                score += replacementScore;
            }
            
            return Math.round(Math.max(Math.min(score, 100), 0));
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
                portfolioBreakdown.emergencyFund > 0 && React.createElement('div', {
                    key: 'emergency',
                    className: 'flex justify-between items-center p-2 bg-yellow-50 rounded'
                }, [
                    React.createElement('span', {
                        key: 'emergency-label',
                        className: 'text-sm text-yellow-700'
                    }, t.emergencyFund),
                    React.createElement('span', {
                        key: 'emergency-value',
                        className: 'text-sm font-semibold text-yellow-800'
                    }, `${portfolioBreakdown.emergencyFund.toFixed(1)}%`)
                ]),
                portfolioBreakdown.personal > 0 && React.createElement('div', {
                    key: 'personal-section',
                    className: 'space-y-2'
                }, [
                    React.createElement('div', {
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
                    // Show tax breakdown if user has personal portfolio
                    (inputs.currentPersonalPortfolio > 0) && React.createElement('div', {
                        key: 'personal-tax-breakdown',
                        className: 'ml-4 p-2 bg-purple-25 border-l-2 border-purple-200 text-xs space-y-1'
                    }, [
                        React.createElement('div', {
                            key: 'tax-note',
                            className: 'text-purple-600 font-medium'
                        }, language === 'he' ? '💰 מוצג ערך נטו לאחר מס רווחי הון' : '💰 Shown as net value after capital gains tax'),
                        React.createElement('div', {
                            key: 'gross-value',
                            className: 'text-purple-600'
                        }, `${language === 'he' ? 'ערך ברוטו:' : 'Gross value:'} ${formatCurrency(inputs.currentPersonalPortfolio)}`),
                        React.createElement('div', {
                            key: 'tax-rate',
                            className: 'text-purple-600'
                        }, `${language === 'he' ? 'מס רווחי הון:' : 'Capital gains tax:'} ${inputs.portfolioTaxRate || 25}%`),
                        React.createElement('div', {
                            key: 'net-value',
                            className: 'text-purple-700 font-semibold'
                        }, `${language === 'he' ? 'ערך נטו:' : 'Net value:'} ${formatCurrency(inputs.currentPersonalPortfolio * (1 - (inputs.portfolioTaxRate || 25) / 100))}`)
                    ])
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
                ]),
                portfolioBreakdown.partnerAssets > 0 && React.createElement('div', {
                    key: 'partner-assets',
                    className: 'flex justify-between items-center p-2 bg-pink-50 rounded border-2 border-pink-200'
                }, [
                    React.createElement('span', {
                        key: 'partner-label',
                        className: 'text-sm text-pink-700 font-medium'
                    }, language === 'he' ? '👫 נכסי בני הזוג' : '👫 Partner Assets'),
                    React.createElement('span', {
                        key: 'partner-value',
                        className: 'text-sm font-bold text-pink-800'
                    }, `${portfolioBreakdown.partnerAssets.toFixed(1)}%`)
                ])
            ]),
            React.createElement('div', {
                key: 'diversification',
                className: 'mt-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200'
            }, [
                React.createElement('div', {
                    key: 'div-header',
                    className: 'flex justify-between items-center mb-2'
                }, [
                    React.createElement('span', {
                        key: 'div-label',
                        className: 'text-sm font-medium text-gray-700'
                    }, '📊 ' + t.diversificationScore),
                    React.createElement('span', {
                        key: 'div-value',
                        className: `text-lg font-bold ${diversificationScore >= 80 ? 'text-green-600' : diversificationScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`
                    }, `${diversificationScore}/100`)
                ]),
                React.createElement('div', {
                    key: 'div-explanation',
                    className: 'text-xs text-gray-600 mb-2'
                }, t.diversificationExplanation),
                React.createElement('div', {
                    key: 'div-rating',
                    className: 'text-xs font-medium'
                }, (() => {
                    if (diversificationScore >= 90) return React.createElement('span', { className: 'text-green-700' }, t.diversificationScoreDetails.excellent);
                    if (diversificationScore >= 70) return React.createElement('span', { className: 'text-green-600' }, t.diversificationScoreDetails.good);
                    if (diversificationScore >= 50) return React.createElement('span', { className: 'text-yellow-600' }, t.diversificationScoreDetails.fair);
                    if (diversificationScore >= 20) return React.createElement('span', { className: 'text-orange-600' }, t.diversificationScoreDetails.poor);
                    return React.createElement('span', { className: 'text-red-600' }, t.diversificationScoreDetails.critical);
                })())
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
                    }, `${(currentSavingsRate || 0).toFixed(1)}%`)
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
        ]),
        
        // Management Fees Calculator
        window.ManagementFeesCalculator && React.createElement('div', {
            key: 'fees-section',
            className: 'mt-6 pt-6 border-t border-gray-200'
        }, [
            React.createElement(window.ManagementFeesCalculator, {
                key: 'fees-calculator',
                inputs: inputs,
                language: language,
                formatCurrency: formatCurrency,
                workingCurrency: workingCurrency
            })
        ])
    ]);
};

// Export to window for global access
window.SummaryPanel = SummaryPanel;