// WizardStepReview.js - Step 8: Final Review & Summary
// Comprehensive plan review and actionable recommendations

const WizardStepReview = ({ inputs, setInputs, language = 'en', workingCurrency = 'ILS' }) => {
    const createElement = React.createElement;
    
    // Multi-language content
    const content = {
        he: {
            title: 'סקירה מקיפה ותוצאות',
            subtitle: 'סיכום מקיף של תכנית הפרישה שלך עם המלצות פעולה',
            
            // Financial Health Score
            financialHealthScore: 'ציון בריאות פיננסית',
            excellent: 'מעולה',
            good: 'טוב',
            needsImprovement: 'דורש שיפור',
            critical: 'קריטי',
            
            // Score components
            savingsRateScore: 'ציון שיעור חיסכון',
            retirementReadiness: 'מוכנות לפרישה',
            riskAlignment: 'התאמת סיכון',
            taxEfficiency: 'יעילות מס',
            diversification: 'פיזור השקעות',
            
            // Scenario Analysis
            scenarioAnalysis: 'ניתוח תרחישים',
            bestCase: 'תרחיש אופטימי',
            realistic: 'תרחיש ריאלי',
            worstCase: 'תרחיש פסימי',
            stressTesting: 'בדיקות עמידות',
            
            // Stress test scenarios
            marketCrash: 'קריסת שוק (30%-)',
            inflationSpike: 'זינוק אינפלציה (5%+)',
            earlyRetirement: 'פרישה מוקדמת',
            incomeReduction: 'הפחתת הכנסה',
            
            // Action Items
            actionItems: 'פעולות נדרשות',
            immediateActions: 'פעולות מיידיות (30 יום)',
            shortTermGoals: 'יעדים קצרי טווח (6-12 חודשים)',
            longTermStrategy: 'אסטרטגיה ארוכת טווח (5+ שנים)',
            
            // Country-specific recommendations
            countrySpecificActions: 'פעולות ספציפיות למדינה',
            regulatoryCompliance: 'רשימת ציות רגולטורי',
            contributionTiming: 'תזמון הפקדות אופטימלי',
            taxDeadlines: 'מועדי מס חשובים',
            advisorRecommendations: 'המלצות ליועצים מקצועיים',
            
            // Interactive features
            downloadPdf: 'הורד סיכום PDF',
            emailPlan: 'שלח תכנית למייל',
            calendarIntegration: 'אינטגרציה ליומן',
            progressTracking: 'מעקב התקדמות',
            
            // Risk warnings
            riskWarnings: 'אזהרות סיכון',
            insufficientSavings: 'חיסכון לא מספיק',
            highRiskProfile: 'פרופיל סיכון גבוה',
            taxInefficiency: 'חוסר יעילות מס',
            
            // Retirement projections
            retirementProjections: 'תחזיות פרישה',
            monthlyRetirementIncome: 'הכנסה חודשית בפרישה',
            totalAccumulation: 'צבירה כוללת',
            inflationAdjusted: 'מותאם לאינפלציה',
            
            info: 'תכנית הפרישה שלך מותאמת אישית לפרופיל הסיכון, המדינה והמטרות שלך. עדכן אותה באופן קבוע.'
        },
        en: {
            title: 'Comprehensive Review & Results',
            subtitle: 'Complete summary of your retirement plan with actionable recommendations',
            
            // Financial Health Score
            financialHealthScore: 'Financial Health Score',
            excellent: 'Excellent',
            good: 'Good',
            needsImprovement: 'Needs Improvement',
            critical: 'Critical',
            
            // Score components
            savingsRateScore: 'Savings Rate Score',
            retirementReadiness: 'Retirement Readiness',
            riskAlignment: 'Risk Alignment',
            taxEfficiency: 'Tax Efficiency',
            diversification: 'Diversification',
            
            // Scenario Analysis
            scenarioAnalysis: 'Scenario Analysis',
            bestCase: 'Best Case',
            realistic: 'Realistic',
            worstCase: 'Worst Case',
            stressTesting: 'Stress Testing',
            
            // Stress test scenarios
            marketCrash: 'Market Crash (30% down)',
            inflationSpike: 'Inflation Spike (5%+)',
            earlyRetirement: 'Early Retirement',
            incomeReduction: 'Income Reduction',
            
            // Action Items
            actionItems: 'Action Items',
            immediateActions: 'Immediate Actions (30 days)',
            shortTermGoals: 'Short-Term Goals (6-12 months)',
            longTermStrategy: 'Long-Term Strategy (5+ years)',
            
            // Country-specific recommendations
            countrySpecificActions: 'Country-Specific Actions',
            regulatoryCompliance: 'Regulatory Compliance Checklist',
            contributionTiming: 'Optimal Contribution Timing',
            taxDeadlines: 'Important Tax Deadlines',
            advisorRecommendations: 'Professional Advisor Recommendations',
            
            // Interactive features
            downloadPdf: 'Download PDF Summary',
            emailPlan: 'Email Plan to Advisors',
            calendarIntegration: 'Calendar Integration',
            progressTracking: 'Progress Tracking',
            
            // Risk warnings
            riskWarnings: 'Risk Warnings',
            insufficientSavings: 'Insufficient Savings',
            highRiskProfile: 'High Risk Profile',
            taxInefficiency: 'Tax Inefficiency',
            
            // Retirement projections
            retirementProjections: 'Retirement Projections',
            monthlyRetirementIncome: 'Monthly Retirement Income',
            totalAccumulation: 'Total Accumulation',
            inflationAdjusted: 'Inflation Adjusted',
            
            info: 'Your retirement plan is customized for your risk profile, country, and goals. Update it regularly as circumstances change.'
        }
    };

    const t = content[language];
    
    // Get user's country and currency
    const selectedCountry = inputs.taxCountry || inputs.inheritanceCountry || 'israel';
    const currency = selectedCountry === 'israel' ? '₪' : 
                    selectedCountry === 'uk' ? '£' :
                    selectedCountry === 'us' ? '$' : '€';

    // Calculate financial health score components
    const calculateSavingsRateScore = () => {
        const monthlyIncome = parseFloat(inputs.currentMonthlySalary || 0);
        const pensionRate = parseFloat(inputs.pensionContributionRate || 0);
        const trainingFundRate = parseFloat(inputs.trainingFundContributionRate || 0);
        const totalSavingsRate = pensionRate + trainingFundRate;
        
        if (totalSavingsRate >= 15) return 100;
        if (totalSavingsRate >= 12) return 85;
        if (totalSavingsRate >= 10) return 70;
        if (totalSavingsRate >= 7) return 55;
        return Math.max(0, totalSavingsRate * 5);
    };

    const calculateRetirementReadinessScore = () => {
        const currentAge = parseFloat(inputs.currentAge || 30);
        const retirementAge = parseFloat(inputs.retirementAge || 67);
        const yearsToRetirement = retirementAge - currentAge;
        const currentSavings = parseFloat(inputs.totalCurrentSavings || 0);
        const monthlyIncome = parseFloat(inputs.currentMonthlySalary || 0);
        const annualIncome = monthlyIncome * 12;
        
        // Rule of thumb: should have 1x annual income saved by 30, 3x by 40, etc.
        const targetMultiplier = Math.max(1, (currentAge - 20) / 10);
        const targetSavings = annualIncome * targetMultiplier;
        
        if (currentSavings >= targetSavings * 1.5) return 100;
        if (currentSavings >= targetSavings) return 85;
        if (currentSavings >= targetSavings * 0.7) return 70;
        if (currentSavings >= targetSavings * 0.4) return 55;
        return Math.max(0, (currentSavings / targetSavings) * 50);
    };

    const calculateRiskAlignmentScore = () => {
        const age = parseFloat(inputs.currentAge || 30);
        const riskTolerance = inputs.riskTolerance || 'moderate';
        const stockPercentage = parseFloat(inputs.stockPercentage || 60);
        
        // Age-based stock allocation rule: 100 - age
        const recommendedStockPercentage = Math.max(20, 100 - age);
        const deviation = Math.abs(stockPercentage - recommendedStockPercentage);
        
        let baseScore = Math.max(0, 100 - deviation * 2);
        
        // Adjust for risk tolerance
        if (riskTolerance === 'conservative' && stockPercentage > 40) baseScore *= 0.8;
        if (riskTolerance === 'aggressive' && stockPercentage < 70) baseScore *= 0.8;
        
        return baseScore;
    };

    const calculateTaxEfficiencyScore = () => {
        const pensionRate = parseFloat(inputs.pensionContributionRate || 0);
        const trainingFundRate = parseFloat(inputs.trainingFundContributionRate || 0);
        
        // Israel-specific optimization
        if (selectedCountry === 'israel') {
            const optimalPensionRate = 7; // 7% is deductible
            const optimalTrainingFundRate = 10; // Up to threshold
            
            const pensionEfficiency = Math.min(100, (pensionRate / optimalPensionRate) * 100);
            const trainingFundEfficiency = Math.min(100, (trainingFundRate / optimalTrainingFundRate) * 100);
            
            return (pensionEfficiency + trainingFundEfficiency) / 2;
        }
        
        // General tax efficiency for other countries
        return Math.min(100, (pensionRate / 12) * 100);
    };

    const calculateDiversificationScore = () => {
        const stockPercentage = parseFloat(inputs.stockPercentage || 60);
        const bondPercentage = parseFloat(inputs.bondPercentage || 30);
        const alternativePercentage = parseFloat(inputs.alternativePercentage || 10);
        
        // Penalize extreme allocations
        let score = 100;
        if (stockPercentage > 90 || stockPercentage < 10) score -= 30;
        if (bondPercentage > 70 || bondPercentage < 5) score -= 20;
        if (alternativePercentage > 30) score -= 15;
        
        return Math.max(0, score);
    };

    const calculateOverallFinancialHealthScore = () => {
        const savingsScore = calculateSavingsRateScore();
        const readinessScore = calculateRetirementReadinessScore();
        const riskScore = calculateRiskAlignmentScore();
        const taxScore = calculateTaxEfficiencyScore();
        const diversificationScore = calculateDiversificationScore();
        
        // Weighted average
        return Math.round((savingsScore * 0.3 + readinessScore * 0.25 + riskScore * 0.2 + taxScore * 0.15 + diversificationScore * 0.1));
    };

    const getScoreColor = (score) => {
        if (score >= 85) return 'green';
        if (score >= 70) return 'yellow';
        if (score >= 55) return 'orange';
        return 'red';
    };

    const getScoreLabel = (score) => {
        if (score >= 85) return t.excellent;
        if (score >= 70) return t.good;
        if (score >= 55) return t.needsImprovement;
        return t.critical;
    };

    // Calculate retirement projections
    const calculateRetirementProjections = () => {
        const currentAge = parseFloat(inputs.currentAge || 30);
        const retirementAge = parseFloat(inputs.retirementAge || 67);
        const monthlyIncome = parseFloat(inputs.currentMonthlySalary || 0);
        const currentSavings = parseFloat(inputs.totalCurrentSavings || 0);
        const savingsRate = (parseFloat(inputs.pensionContributionRate || 0) + parseFloat(inputs.trainingFundContributionRate || 0)) / 100;
        const expectedReturn = parseFloat(inputs.expectedAnnualReturn || 7) / 100;
        const inflationRate = 0.03; // 3% inflation assumption
        
        const yearsToRetirement = retirementAge - currentAge;
        const annualSavings = monthlyIncome * 12 * savingsRate;
        
        // Future value calculation
        const futureValueCurrentSavings = currentSavings * Math.pow(1 + expectedReturn, yearsToRetirement);
        const futureValueAnnualSavings = annualSavings * (Math.pow(1 + expectedReturn, yearsToRetirement) - 1) / expectedReturn;
        const totalAccumulation = futureValueCurrentSavings + futureValueAnnualSavings;
        
        // Safe withdrawal rate (4% rule)
        const annualRetirementIncome = totalAccumulation * 0.04;
        const monthlyRetirementIncome = annualRetirementIncome / 12;
        
        // Inflation-adjusted values
        const inflationAdjustedTotal = totalAccumulation / Math.pow(1 + inflationRate, yearsToRetirement);
        const inflationAdjustedMonthly = monthlyRetirementIncome / Math.pow(1 + inflationRate, yearsToRetirement);
        
        return {
            totalAccumulation,
            monthlyRetirementIncome,
            inflationAdjustedTotal,
            inflationAdjustedMonthly,
            yearsToRetirement
        };
    };

    // Generate action items based on scores and inputs
    const generateActionItems = () => {
        const savingsScore = calculateSavingsRateScore();
        const readinessScore = calculateRetirementReadinessScore();
        const taxScore = calculateTaxEfficiencyScore();
        
        const immediate = [];
        const shortTerm = [];
        const longTerm = [];
        
        // Immediate actions
        if (savingsScore < 70) {
            immediate.push('Increase pension contributions to at least 10% of income');
        }
        if (taxScore < 70) {
            immediate.push('Optimize tax-deductible contributions');
        }
        if (!inputs.willStatus || inputs.willStatus === 'none') {
            immediate.push('Create or update your will');
        }
        
        // Short-term goals
        if (readinessScore < 70) {
            shortTerm.push('Build emergency fund (3-6 months expenses)');
        }
        shortTerm.push('Review and rebalance investment portfolio');
        shortTerm.push('Research additional retirement savings options');
        
        // Long-term strategy
        longTerm.push('Review plan annually and adjust for life changes');
        longTerm.push('Consider increasing contributions with salary raises');
        longTerm.push('Plan for healthcare costs in retirement');
        
        return { immediate, shortTerm, longTerm };
    };

    // Render financial health score dashboard
    const renderFinancialHealthScore = () => {
        const overallScore = calculateOverallFinancialHealthScore();
        const savingsScore = calculateSavingsRateScore();
        const readinessScore = calculateRetirementReadinessScore();
        const riskScore = calculateRiskAlignmentScore();
        const taxScore = calculateTaxEfficiencyScore();
        const diversificationScore = calculateDiversificationScore();
        
        return createElement('div', {
            key: 'financial-health-score',
            className: "bg-white rounded-xl p-6 border border-gray-200 mb-8"
        }, [
            createElement('h3', {
                key: 'health-score-title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '🏥'),
                t.financialHealthScore
            ]),
            
            // Overall score
            createElement('div', {
                key: 'overall-score',
                className: `bg-${getScoreColor(overallScore)}-50 rounded-lg p-6 border border-${getScoreColor(overallScore)}-200 mb-6`
            }, [
                createElement('div', { key: 'score-display', className: "text-center" }, [
                    createElement('div', {
                        key: 'score-number',
                        className: `text-4xl font-bold text-${getScoreColor(overallScore)}-800`
                    }, `${overallScore}/100`),
                    createElement('div', {
                        key: 'score-label',
                        className: `text-lg font-medium text-${getScoreColor(overallScore)}-700 mt-2`
                    }, getScoreLabel(overallScore))
                ])
            ]),
            
            // Component scores
            createElement('div', { key: 'component-scores', className: "grid grid-cols-2 md:grid-cols-5 gap-4" }, [
                createElement('div', { key: 'savings-rate', className: "text-center" }, [
                    createElement('div', {
                        key: 'savings-rate-score',
                        className: `text-2xl font-bold text-${getScoreColor(savingsScore)}-600`
                    }, Math.round(savingsScore)),
                    createElement('div', {
                        key: 'savings-rate-label',
                        className: "text-sm text-gray-600"
                    }, t.savingsRateScore)
                ]),
                
                createElement('div', { key: 'readiness', className: "text-center" }, [
                    createElement('div', {
                        key: 'readiness-score',
                        className: `text-2xl font-bold text-${getScoreColor(readinessScore)}-600`
                    }, Math.round(readinessScore)),
                    createElement('div', {
                        key: 'readiness-label',
                        className: "text-sm text-gray-600"
                    }, t.retirementReadiness)
                ]),
                
                createElement('div', { key: 'risk-alignment', className: "text-center" }, [
                    createElement('div', {
                        key: 'risk-score',
                        className: `text-2xl font-bold text-${getScoreColor(riskScore)}-600`
                    }, Math.round(riskScore)),
                    createElement('div', {
                        key: 'risk-label',
                        className: "text-sm text-gray-600"
                    }, t.riskAlignment)
                ]),
                
                createElement('div', { key: 'tax-efficiency', className: "text-center" }, [
                    createElement('div', {
                        key: 'tax-score',
                        className: `text-2xl font-bold text-${getScoreColor(taxScore)}-600`
                    }, Math.round(taxScore)),
                    createElement('div', {
                        key: 'tax-label',
                        className: "text-sm text-gray-600"
                    }, t.taxEfficiency)
                ]),
                
                createElement('div', { key: 'diversification', className: "text-center" }, [
                    createElement('div', {
                        key: 'diversification-score',
                        className: `text-2xl font-bold text-${getScoreColor(diversificationScore)}-600`
                    }, Math.round(diversificationScore)),
                    createElement('div', {
                        key: 'diversification-label',
                        className: "text-sm text-gray-600"
                    }, t.diversification)
                ])
            ])
        ]);
    };

    // Render retirement projections
    const renderRetirementProjections = () => {
        const projections = calculateRetirementProjections();
        
        return createElement('div', {
            key: 'retirement-projections',
            className: "bg-blue-50 rounded-xl p-6 border border-blue-200 mb-8"
        }, [
            createElement('h3', {
                key: 'projections-title',
                className: "text-xl font-semibold text-blue-700 mb-6 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '📈'),
                t.retirementProjections
            ]),
            
            createElement('div', { key: 'projections-grid', className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" }, [
                createElement('div', { key: 'total-accumulation', className: "text-center" }, [
                    createElement('div', {
                        key: 'accumulation-value',
                        className: "text-2xl font-bold text-blue-800"
                    }, `${currency}${Math.round(projections.totalAccumulation).toLocaleString()}`),
                    createElement('div', {
                        key: 'accumulation-label',
                        className: "text-sm text-blue-600"
                    }, t.totalAccumulation)
                ]),
                
                createElement('div', { key: 'monthly-income', className: "text-center" }, [
                    createElement('div', {
                        key: 'monthly-value',
                        className: "text-2xl font-bold text-green-800"
                    }, `${currency}${Math.round(projections.monthlyRetirementIncome).toLocaleString()}`),
                    createElement('div', {
                        key: 'monthly-label',
                        className: "text-sm text-green-600"
                    }, t.monthlyRetirementIncome)
                ]),
                
                createElement('div', { key: 'inflation-adjusted-total', className: "text-center" }, [
                    createElement('div', {
                        key: 'adjusted-total-value',
                        className: "text-2xl font-bold text-purple-800"
                    }, `${currency}${Math.round(projections.inflationAdjustedTotal).toLocaleString()}`),
                    createElement('div', {
                        key: 'adjusted-total-label',
                        className: "text-sm text-purple-600"
                    }, `${t.totalAccumulation} (${t.inflationAdjusted})`)
                ]),
                
                createElement('div', { key: 'inflation-adjusted-monthly', className: "text-center" }, [
                    createElement('div', {
                        key: 'adjusted-monthly-value',
                        className: "text-2xl font-bold text-orange-800"
                    }, `${currency}${Math.round(projections.inflationAdjustedMonthly).toLocaleString()}`),
                    createElement('div', {
                        key: 'adjusted-monthly-label',
                        className: "text-sm text-orange-600"
                    }, `${t.monthlyRetirementIncome} (${t.inflationAdjusted})`)
                ])
            ])
        ]);
    };

    // Render action items
    const renderActionItems = () => {
        const actions = generateActionItems();
        
        return createElement('div', {
            key: 'action-items',
            className: "space-y-6"
        }, [
            createElement('h3', {
                key: 'actions-title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '✅'),
                t.actionItems
            ]),
            
            createElement('div', { key: 'actions-grid', className: "grid grid-cols-1 lg:grid-cols-3 gap-6" }, [
                // Immediate Actions
                createElement('div', {
                    key: 'immediate-actions',
                    className: "bg-red-50 rounded-xl p-6 border border-red-200"
                }, [
                    createElement('h4', {
                        key: 'immediate-title',
                        className: "text-lg font-semibold text-red-700 mb-4"
                    }, t.immediateActions),
                    createElement('ul', { key: 'immediate-list', className: "space-y-2" }, 
                        actions.immediate.map((action, index) => 
                            createElement('li', { 
                                key: `immediate-${index}`,
                                className: "flex items-start text-red-600 text-sm"
                            }, [
                                createElement('span', { key: 'bullet', className: "mr-2 mt-1" }, '•'),
                                createElement('span', { key: 'text' }, action)
                            ])
                        )
                    )
                ]),
                
                // Short-Term Goals
                createElement('div', {
                    key: 'short-term-goals',
                    className: "bg-yellow-50 rounded-xl p-6 border border-yellow-200"
                }, [
                    createElement('h4', {
                        key: 'short-term-title',
                        className: "text-lg font-semibold text-yellow-700 mb-4"
                    }, t.shortTermGoals),
                    createElement('ul', { key: 'short-term-list', className: "space-y-2" }, 
                        actions.shortTerm.map((action, index) => 
                            createElement('li', { 
                                key: `short-term-${index}`,
                                className: "flex items-start text-yellow-600 text-sm"
                            }, [
                                createElement('span', { key: 'bullet', className: "mr-2 mt-1" }, '•'),
                                createElement('span', { key: 'text' }, action)
                            ])
                        )
                    )
                ]),
                
                // Long-Term Strategy
                createElement('div', {
                    key: 'long-term-strategy',
                    className: "bg-green-50 rounded-xl p-6 border border-green-200"
                }, [
                    createElement('h4', {
                        key: 'long-term-title',
                        className: "text-lg font-semibold text-green-700 mb-4"
                    }, t.longTermStrategy),
                    createElement('ul', { key: 'long-term-list', className: "space-y-2" }, 
                        actions.longTerm.map((action, index) => 
                            createElement('li', { 
                                key: `long-term-${index}`,
                                className: "flex items-start text-green-600 text-sm"
                            }, [
                                createElement('span', { key: 'bullet', className: "mr-2 mt-1" }, '•'),
                                createElement('span', { key: 'text' }, action)
                            ])
                        )
                    )
                ])
            ])
        ]);
    };

    // Render interactive features
    const renderInteractiveFeatures = () => {
        return createElement('div', {
            key: 'interactive-features',
            className: "bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200"
        }, [
            createElement('h3', {
                key: 'features-title',
                className: "text-xl font-semibold text-purple-700 mb-6 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '🔧'),
                'Interactive Features'
            ]),
            
            createElement('div', { key: 'features-grid', className: "grid grid-cols-2 md:grid-cols-4 gap-4" }, [
                createElement('button', {
                    key: 'download-pdf',
                    className: "bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors",
                    onClick: () => alert('PDF download functionality would be implemented here')
                }, t.downloadPdf),
                
                createElement('button', {
                    key: 'email-plan',
                    className: "bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors",
                    onClick: () => alert('Email functionality would be implemented here')
                }, t.emailPlan),
                
                createElement('button', {
                    key: 'calendar-integration',
                    className: "bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors",
                    onClick: () => alert('Calendar integration would be implemented here')
                }, t.calendarIntegration),
                
                createElement('button', {
                    key: 'progress-tracking',
                    className: "bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors",
                    onClick: () => alert('Progress tracking dashboard would be implemented here')
                }, t.progressTracking)
            ])
        ]);
    };

    return createElement('div', { className: "space-y-8" }, [
        // Title
        createElement('div', { key: 'title-section' }, [
            createElement('h3', {
                key: 'main-title',
                className: "text-2xl font-bold text-gray-800 mb-4 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-3xl" }, '📋'),
                t.title
            ]),
            createElement('p', {
                key: 'subtitle',
                className: "text-gray-600 text-lg"
            }, t.subtitle)
        ]),

        // Financial Health Score
        renderFinancialHealthScore(),

        // Retirement Projections
        renderRetirementProjections(),

        // Action Items
        renderActionItems(),

        // Interactive Features
        renderInteractiveFeatures(),

        // Information panel
        createElement('div', {
            key: 'info-panel',
            className: "bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
        }, [
            createElement('div', { key: 'info-icon', className: "text-2xl mb-2" }, 'ℹ️'),
            createElement('h4', {
                key: 'info-title',
                className: "text-lg font-semibold text-blue-700 mb-2"
            }, language === 'he' ? 'מידע חשוב' : 'Important Information'),
            createElement('p', {
                key: 'info-text',
                className: "text-blue-700 text-sm"
            }, t.info)
        ])
    ]);
};

// Export the component
window.WizardStepReview = WizardStepReview;

console.log('✅ WizardStepReview component loaded successfully');