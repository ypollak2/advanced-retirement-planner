// Dashboard Component - Guided Intelligence UI Design  
// Created by Yali Pollak (יהלי פולק)
// Enhanced with real-time validation workflow - v6.2.0

const Dashboard = ({ 
    inputs, 
    results, 
    language = 'en',
    formatCurrency,
    onSectionExpand,
    workingCurrency = 'ILS',
    setViewMode
}) => {
    const [exchangeRates, setExchangeRates] = React.useState({});
    const [selectedCurrency, setSelectedCurrency] = React.useState(workingCurrency || 'ILS');
    
    // Partner field mapping integration for couple mode
    const processedInputs = inputs?.planningType === 'couple' && window.getFieldValue ? 
        {
            ...inputs,
            currentSalary: window.getFieldValue(inputs, 'currentSalary', { combinePartners: true }),
            monthlyExpenses: window.getFieldValue(inputs, 'currentMonthlyExpenses', { combinePartners: true }),
            currentSavings: window.getFieldValue(inputs, 'currentSavings', { combinePartners: true }),
            monthlyContribution: window.getFieldValue(inputs, 'monthlyContribution', { combinePartners: true })
        } : inputs;
    
    const [expandedSections, setExpandedSections] = React.useState({
        pension: false,
        investments: false,
        partner: false,
        scenarios: false,
        goals: false,
        inheritance: false,
        taxOptimization: false,
        nationalInsurance: false
    });

    // Content translations
    const content = {
        he: {
            dashboard: 'לוח הבקרה הפיננסי',
            healthMeter: 'מד בריאות פיננסית',
            netWorth: 'שווי נטו',
            quickActions: 'פעולות מהירות',
            planPension: 'תכנן פנסיה',
            manageInvestments: 'נהל השקעות',
            partnerPlanning: 'תכנון משותף',
            testScenarios: 'בדוק תרחישים',
            excellent: 'מעולה',
            good: 'טוב',
            needsWork: 'זקוק לשיפור',
            critical: 'דורש טיפול',
            financialHealth: 'בריאות פיננסית',
            currentAge: 'גיל נוכחי',
            targetAge: 'גיל פרישה',
            lastUpdated: 'עודכן לאחרונה',
            changeFrom: 'שינוי מ',
            yesterday: 'אתמול',
            pensionPlanning: 'תכנון פנסיה',
            investmentPortfolio: 'תיק השקעות',
            partnerPlanning: 'תכנון משותף',
            scenarioTesting: 'בדיקת תרחישים',
            goalTracking: 'מעקב יעדים',
            inheritancePlanning: 'תכנון ירושה ועזבון',
            taxOptimization: 'אופטימיזציה מיסויית',
            nationalInsurance: 'ביטוח לאומי',
            estateValue: 'שווי עזבון',
            totalAssets: 'סך נכסים',
            totalDebts: 'סך חובות',
            hasWillStatus: 'סטטוס צוואה',
            lifeInsurance: 'ביטוח חיים',
            taxEfficiency: 'יעילות מיסויית',
            pensionOptimized: 'פנסיה מותאמת',
            trainingFundOptimized: 'קרן השתלמות מותאמת',
            monthlyBenefit: 'זכאות חודשית',
            totalBenefit: 'זכאות כוללת'
        },
        en: {
            dashboard: 'Financial Dashboard',
            healthMeter: 'Financial Health Meter',
            netWorth: 'Net Worth',
            quickActions: 'Quick Actions',
            planPension: 'Plan Pension',
            manageInvestments: 'Manage Investments',
            partnerPlanning: 'Partner Planning',
            testScenarios: 'Test Scenarios',
            excellent: 'Excellent',
            good: 'Good',
            needsWork: 'Needs Work',
            critical: 'Critical',
            financialHealth: 'Financial Health',
            currentAge: 'Current Age',
            targetAge: 'Target Age',
            lastUpdated: 'Last Updated',
            changeFrom: 'Change from',
            yesterday: 'yesterday',
            pensionPlanning: 'Pension Planning',
            investmentPortfolio: 'Investment Portfolio',
            partnerPlanning: 'Partner Planning',
            scenarioTesting: 'Scenario Testing',
            goalTracking: 'Goal Tracking',
            inheritancePlanning: 'Inheritance & Estate Planning',
            taxOptimization: 'Tax Optimization',
            nationalInsurance: 'National Insurance',
            estateValue: 'Estate Value',
            totalAssets: 'Total Assets',
            totalDebts: 'Total Debts',
            hasWillStatus: 'Will Status',
            lifeInsurance: 'Life Insurance',
            taxEfficiency: 'Tax Efficiency',
            pensionOptimized: 'Optimized Pension',
            trainingFundOptimized: 'Optimized Training Fund',
            monthlyBenefit: 'Monthly Benefit',
            totalBenefit: 'Total Benefit'
        }
    };

    const t = content[language] || content.en;

    // Load exchange rates
    React.useEffect(() => {
        const loadRates = async () => {
            if (window.currencyAPI) {
                try {
                    const rates = await window.currencyAPI.fetchExchangeRates();
                    setExchangeRates(rates);
                } catch (error) {
                    console.warn('Failed to load exchange rates:', error);
                    // Use fallback rates
                    setExchangeRates({
                        USD: 3.7,
                        GBP: 4.6,
                        EUR: 4.0,
                        BTC: 0.000002
                    });
                }
            }
        };
        
        loadRates();
    }, []);

    // Enhanced financial health score calculation with integrated wizard data (0-100)
    const calculateHealthScore = () => {
        if (!inputs || !results) return 0;
        
        // Use processed inputs for couple mode compatibility
        const inputsToUse = processedInputs || inputs;
        
        const currentAge = inputsToUse.currentAge || 30;
        const retirementAge = inputsToUse.retirementAge || 67;
        const yearsToRetirement = retirementAge - currentAge;
        const currentSavings = inputsToUse.currentSavings || 0;
        const monthlyExpenses = inputsToUse.currentMonthlyExpenses || 10000;
        const targetReplacement = inputsToUse.targetReplacement || 75;
        
        let score = 0;
        
        // Factor 1: Savings rate (25 points - adjusted)
        const annualSavings = (inputsToUse.monthlyContribution || 2000) * 12;
        const annualIncome = (inputsToUse.currentSalary || 20000) * 12;
        const savingsRate = annualSavings / annualIncome * 100;
        score += Math.min(savingsRate * 1.7, 25);
        
        // Factor 2: Current savings adequacy (20 points - adjusted)
        const recommendedSavings = currentAge * annualIncome * 0.01;
        const savingsAdequacy = currentSavings / recommendedSavings;
        score += Math.min(savingsAdequacy * 20, 20);
        
        // Factor 3: Time horizon (15 points - adjusted)
        const timeScore = yearsToRetirement > 30 ? 15 : (yearsToRetirement / 30) * 15;
        score += timeScore;
        
        // Factor 4: Risk management (12 points - adjusted)
        const riskTolerance = inputs.riskTolerance || 'moderate';
        const riskScore = riskTolerance === 'aggressive' ? 12 : 
                         riskTolerance === 'moderate' ? 10 : 6;
        score += riskScore;
        
        // Factor 5: Diversification (8 points - adjusted)
        const hasMultipleStreams = (inputs.currentPersonalPortfolio || 0) > 0 || 
                                  (inputs.currentRealEstate || 0) > 0;
        score += hasMultipleStreams ? 8 : 4;
        
        // NEW Factor 6: Estate planning (10 points)
        let estateScore = 0;
        if (inputs.hasWill || inputs.willStatus === 'hasWill') estateScore += 4;
        if ((inputs.lifeInsuranceAmount || 0) > 0) estateScore += 3;
        if ((inputs.netWorth || 0) > 0) estateScore += 3;
        score += estateScore;
        
        // NEW Factor 7: Tax optimization (7 points)
        let taxScore = 0;
        if (inputs.taxEfficiencyScore) {
            taxScore = Math.min(inputs.taxEfficiencyScore * 0.07, 7);
        } else if (inputs.optimizedPensionRate || inputs.optimizedTrainingFundRate) {
            taxScore = 4; // Basic tax optimization present
        }
        score += taxScore;
        
        // NEW Factor 8: National Insurance integration (3 points)
        let niScore = 0;
        if (results && results.nationalInsurance && results.nationalInsurance.monthlyBenefit > 0) {
            niScore = 3; // Full points for having NI benefits calculated
        }
        score += niScore;
        
        return Math.round(Math.min(score, 100));
    };

    const healthScore = calculateHealthScore();
    
    // Get health status based on score
    const getHealthStatus = (score) => {
        if (score >= 85) return { status: 'excellent', class: 'health-meter-excellent status-excellent' };
        if (score >= 70) return { status: 'good', class: 'health-meter-good status-good' };
        if (score >= 50) return { status: 'needsWork', class: 'health-meter-warning status-warning' };
        return { status: 'critical', class: 'health-meter-critical status-critical' };
    };

    const healthStatus = getHealthStatus(healthScore);

    // More comprehensive check for user data
    const hasUserData = inputs && (
        inputs.currentAge || 
        inputs.currentSalary || 
        inputs.currentSavings || 
        inputs.currentTrainingFund || 
        inputs.currentPersonalPortfolio || 
        inputs.currentRealEstate || 
        inputs.currentCrypto ||
        inputs.currentSavingsAccount
    );

    // Calculate comprehensive total savings using the global function from WizardStepReview
    const calculateNetWorth = () => {
        // Always start with 0 and only calculate if we have meaningful data
        let baseNetWorth = 0;
        
        if (hasUserData && inputs) {
            // Use the comprehensive calculation function if available
            if (window.calculateTotalCurrentSavings) {
                baseNetWorth = window.calculateTotalCurrentSavings(inputs);
                console.log('Dashboard: Using comprehensive savings calculation:', baseNetWorth);
            } else {
                // Fallback to basic calculation
                baseNetWorth = (inputs?.currentSavings || 0) + 
                              (inputs?.currentPersonalPortfolio || 0) + 
                              (inputs?.currentRealEstate || 0) + 
                              (inputs?.currentCrypto || 0) +
                              (inputs?.currentTrainingFund || 0) +
                              (inputs?.currentSavingsAccount || 0);
                console.log('Dashboard: Using fallback savings calculation:', baseNetWorth);
            }
        }
        
        // Ensure we always return a valid number (0 or positive)
        baseNetWorth = Math.max(0, baseNetWorth || 0);
        
        if (selectedCurrency === 'ILS') return baseNetWorth;
        return baseNetWorth / (exchangeRates[selectedCurrency] || 1);
    };

    const netWorth = calculateNetWorth();

    // Format currency with selected currency using CurrencyAPI
    const formatSelectedCurrency = (amount) => {
        if (window.currencyAPI) {
            const convertedAmount = calculateNetWorth();
            return window.currencyAPI.formatCurrency(convertedAmount, selectedCurrency, language === 'he' ? 'he-IL' : 'en-US');
        }
        
        // Fallback formatting
        const symbols = { ILS: '₪', USD: '$', GBP: '£', EUR: '€', BTC: '₿' };
        const symbol = symbols[selectedCurrency] || '₪';
        
        if (selectedCurrency === 'BTC') {
            return `${symbol}${(amount * (exchangeRates.BTC || 1)).toFixed(6)}`;
        }
        
        return `${symbol}${amount.toLocaleString()}`;
    };

    // Handle section expansion
    const toggleSection = (sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
        
        if (onSectionExpand) {
            onSectionExpand(sectionId, !expandedSections[sectionId]);
        }
    };

    // SVG circle calculations for health meter
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (healthScore / 100) * circumference;

    return React.createElement('div', {
        className: 'dashboard-container animate-fade-in-up'
    }, [
        // Main Dashboard Content
        React.createElement('div', {
            key: 'main-content',
            className: 'space-y-6'
        }, [
            // Enhanced Financial Health Meter
            window.EnhancedFinancialHealthMeter ? React.createElement(window.EnhancedFinancialHealthMeter, {
                key: 'enhanced-health-meter',
                inputs: inputs,
                language: language,
                workingCurrency: workingCurrency,
                compact: false,
                showDetails: true
            }) : React.createElement('div', {
                key: 'fallback-health-meter',
                className: 'professional-card text-center'
            }, [
                React.createElement('h2', {
                    key: 'health-title',
                    className: 'section-title mb-6'
                }, [
                    React.createElement('span', { key: 'icon' }, '💚'),
                    ' ',
                    t.healthMeter
                ]),
                React.createElement('div', {
                    key: 'simple-score',
                    className: 'text-6xl font-bold text-green-600 mb-2'
                }, healthScore),
                React.createElement('div', {
                    key: 'simple-status',
                    className: 'text-lg text-gray-600'
                }, t[healthStatus.status])
            ]),

            // Net Worth Display (keeping existing functionality)
            React.createElement('div', {
                key: 'net-worth-display',
                className: 'professional-card'
            }, [
                React.createElement('h3', {
                    key: 'breakdown-title',
                    className: 'text-lg font-semibold text-gray-800 mb-4'
                }, language === 'he' ? 'פירוט ציוני הבריאות הפיננסית' : 'Financial Health Score Breakdown'),
                
                React.createElement('div', {
                    key: 'score-components',
                    className: 'grid grid-cols-2 md:grid-cols-5 gap-4'
                }, [
                    // Savings Rate Score
                    React.createElement('div', {
                        key: 'savings-rate',
                        className: 'text-center'
                    }, [
                        window.HelpTooltip ? React.createElement(window.HelpTooltip, {
                            key: 'savings-help',
                            term: 'savings-rate-score',
                            language: language,
                            position: 'top'
                        }, React.createElement('div', {
                            key: 'savings-content',
                            className: 'cursor-help'
                        }, [
                            React.createElement('div', {
                                key: 'savings-score',
                                className: 'text-2xl font-bold text-green-600'
                            }, Math.min(Math.round((inputs?.monthlyContribution || 2000) * 12 / ((inputs?.currentSalary || 20000) * 12) * 500), 100)),
                            React.createElement('div', {
                                key: 'savings-label',
                                className: 'text-sm text-gray-600 mt-1'
                            }, language === 'he' ? 'שיעור החיסכון' : 'Savings Rate Score')
                        ])) : React.createElement('div', {
                            key: 'savings-content'
                        }, [
                            React.createElement('div', {
                                key: 'savings-score',
                                className: 'text-2xl font-bold text-green-600'
                            }, Math.min(Math.round((inputs?.monthlyContribution || 2000) * 12 / ((inputs?.currentSalary || 20000) * 12) * 500), 100)),
                            React.createElement('div', {
                                key: 'savings-label',
                                className: 'text-sm text-gray-600 mt-1'
                            }, language === 'he' ? 'שיעור החיסכון' : 'Savings Rate Score')
                        ])
                    ]),

                    // Retirement Readiness Score
                    React.createElement('div', {
                        key: 'retirement-readiness',
                        className: 'text-center'
                    }, [
                        window.HelpTooltip ? React.createElement(window.HelpTooltip, {
                            key: 'readiness-help',
                            term: 'retirement-readiness-score',
                            language: language,
                            position: 'top'
                        }, React.createElement('div', {
                            key: 'readiness-content',
                            className: 'cursor-help'
                        }, [
                            React.createElement('div', {
                                key: 'readiness-score',
                                className: 'text-2xl font-bold text-green-600'
                            }, Math.min(Math.round(((inputs?.currentAge || 30) * (inputs?.currentSalary || 20000) * 0.012) > 0 ? (inputs?.currentSavings || 0) / ((inputs?.currentAge || 30) * (inputs?.currentSalary || 20000) * 0.012) * 100 : 50), 100)),
                            React.createElement('div', {
                                key: 'readiness-label',
                                className: 'text-sm text-gray-600 mt-1'
                            }, language === 'he' ? 'מוכנות לפנסיה' : 'Retirement Readiness')
                        ])) : React.createElement('div', {
                            key: 'readiness-content'
                        }, [
                            React.createElement('div', {
                                key: 'readiness-score',
                                className: 'text-2xl font-bold text-green-600'
                            }, Math.min(Math.round(((inputs?.currentAge || 30) * (inputs?.currentSalary || 20000) * 0.012) > 0 ? (inputs?.currentSavings || 0) / ((inputs?.currentAge || 30) * (inputs?.currentSalary || 20000) * 0.012) * 100 : 50), 100)),
                            React.createElement('div', {
                                key: 'readiness-label',
                                className: 'text-sm text-gray-600 mt-1'
                            }, language === 'he' ? 'מוכנות לפנסיה' : 'Retirement Readiness')
                        ])
                    ]),

                    // Risk Alignment Score  
                    React.createElement('div', {
                        key: 'risk-alignment',
                        className: 'text-center'
                    }, [
                        window.HelpTooltip ? React.createElement(window.HelpTooltip, {
                            key: 'risk-help',
                            term: 'risk-alignment-score',
                            language: language,
                            position: 'top'
                        }, React.createElement('div', {
                            key: 'risk-content',
                            className: 'cursor-help'
                        }, [
                            React.createElement('div', {
                                key: 'risk-score',
                                className: 'text-2xl font-bold text-yellow-600'
                            }, (() => {
                                const age = inputs?.currentAge || 30;
                                const yearsToRetirement = (inputs?.retirementAge || 67) - age;
                                const riskTolerance = inputs?.riskTolerance || 'moderate';
                                let score = yearsToRetirement > 20 ? 90 : (yearsToRetirement / 20) * 90;
                                if (riskTolerance === 'aggressive' && yearsToRetirement < 10) score -= 20;
                                if (riskTolerance === 'conservative' && yearsToRetirement > 20) score -= 20;
                                return Math.round(Math.max(30, Math.min(100, score)));
                            })()),
                            React.createElement('div', {
                                key: 'risk-label',
                                className: 'text-sm text-gray-600 mt-1'
                            }, language === 'he' ? 'התאמת סיכון' : 'Risk Alignment')
                        ])) : React.createElement('div', {
                            key: 'risk-content'
                        }, [
                            React.createElement('div', {
                                key: 'risk-score',
                                className: 'text-2xl font-bold text-yellow-600'
                            }, (() => {
                                const age = inputs?.currentAge || 30;
                                const yearsToRetirement = (inputs?.retirementAge || 67) - age;
                                const riskTolerance = inputs?.riskTolerance || 'moderate';
                                let score = yearsToRetirement > 20 ? 90 : (yearsToRetirement / 20) * 90;
                                if (riskTolerance === 'aggressive' && yearsToRetirement < 10) score -= 20;
                                if (riskTolerance === 'conservative' && yearsToRetirement > 20) score -= 20;
                                return Math.round(Math.max(30, Math.min(100, score)));
                            })()),
                            React.createElement('div', {
                                key: 'risk-label',
                                className: 'text-sm text-gray-600 mt-1'
                            }, language === 'he' ? 'התאמת סיכון' : 'Risk Alignment')
                        ])
                    ]),

                    // Tax Efficiency Score
                    React.createElement('div', {
                        key: 'tax-efficiency',
                        className: 'text-center'
                    }, [
                        window.HelpTooltip ? React.createElement(window.HelpTooltip, {
                            key: 'tax-help',
                            term: 'tax-efficiency-score',
                            language: language,
                            position: 'top'
                        }, React.createElement('div', {
                            key: 'tax-content',
                            className: 'cursor-help'
                        }, [
                            React.createElement('div', {
                                key: 'tax-score',
                                className: 'text-2xl font-bold text-green-600'
                            }, (() => {
                                let score = 0;
                                if (inputs?.pensionContribution > 0) score += 40;
                                if (inputs?.trainingFundContribution > 0) score += 30;
                                if (inputs?.optimizedPensionRate) score += 20;
                                if (inputs?.optimizedTrainingFundRate) score += 10;
                                return Math.min(100, score);
                            })()),
                            React.createElement('div', {
                                key: 'tax-label',
                                className: 'text-sm text-gray-600 mt-1'
                            }, language === 'he' ? 'יעילות מס' : 'Tax Efficiency')
                        ])) : React.createElement('div', {
                            key: 'tax-content'
                        }, [
                            React.createElement('div', {
                                key: 'tax-score',
                                className: 'text-2xl font-bold text-green-600'
                            }, (() => {
                                let score = 0;
                                if (inputs?.pensionContribution > 0) score += 40;
                                if (inputs?.trainingFundContribution > 0) score += 30;
                                if (inputs?.optimizedPensionRate) score += 20;
                                if (inputs?.optimizedTrainingFundRate) score += 10;
                                return Math.min(100, score);
                            })()),
                            React.createElement('div', {
                                key: 'tax-label',
                                className: 'text-sm text-gray-600 mt-1'
                            }, language === 'he' ? 'יעילות מס' : 'Tax Efficiency')
                        ])
                    ]),

                    // Diversification Score
                    React.createElement('div', {
                        key: 'diversification',
                        className: 'text-center'
                    }, [
                        window.HelpTooltip ? React.createElement(window.HelpTooltip, {
                            key: 'diversification-help',
                            term: 'diversification-score',
                            language: language,
                            position: 'top'
                        }, React.createElement('div', {
                            key: 'diversification-content',
                            className: 'cursor-help'
                        }, [
                            React.createElement('div', {
                                key: 'diversification-score',
                                className: 'text-2xl font-bold text-green-600'
                            }, (() => {
                                let score = 0;
                                const assetTypes = [
                                    inputs?.currentSavingsAccount > 0,
                                    inputs?.currentPersonalPortfolio > 0,
                                    inputs?.currentRealEstate > 0,
                                    inputs?.currentCrypto > 0,
                                    inputs?.currentTrainingFund > 0
                                ].filter(Boolean).length;
                                return Math.min(100, assetTypes * 20);
                            })()),
                            React.createElement('div', {
                                key: 'diversification-label',
                                className: 'text-sm text-gray-600 mt-1'
                            }, language === 'he' ? 'פיזור השקעות' : 'Diversification')
                        ])) : React.createElement('div', {
                            key: 'diversification-content'
                        }, [
                            React.createElement('div', {
                                key: 'diversification-score',
                                className: 'text-2xl font-bold text-green-600'
                            }, (() => {
                                let score = 0;
                                const assetTypes = [
                                    inputs?.currentSavingsAccount > 0,
                                    inputs?.currentPersonalPortfolio > 0,
                                    inputs?.currentRealEstate > 0,
                                    inputs?.currentCrypto > 0,
                                    inputs?.currentTrainingFund > 0
                                ].filter(Boolean).length;
                                return Math.min(100, assetTypes * 20);
                            })()),
                            React.createElement('div', {
                                key: 'diversification-label',
                                className: 'text-sm text-gray-600 mt-1'
                            }, language === 'he' ? 'פיזור השקעות' : 'Diversification')
                        ])
                    ])
                ])
            ]),

            // Net Worth Tracker (only show if user has entered data)
            hasUserData && netWorth !== null && React.createElement('div', {
                key: 'net-worth',
                className: 'net-worth-tracker'
            }, [
                React.createElement('div', {
                    key: 'header',
                    className: 'net-worth-header'
                }, [
                    React.createElement('h3', {
                        key: 'title',
                        className: 'section-title'
                    }, [
                        React.createElement('span', { key: 'icon' }, '💎'),
                        ' ',
                        t.netWorth
                    ])
                ]),
                React.createElement('div', {
                    key: 'value',
                    className: 'net-worth-value'
                }, formatSelectedCurrency(netWorth)),
                window.CurrencySelector && React.createElement(window.CurrencySelector, {
                    key: 'currency-selector',
                    selectedCurrency: selectedCurrency,
                    onCurrencyChange: setSelectedCurrency,
                    amount: netWorth,
                    language: language,
                    compact: true,
                    showRates: false
                })
            ])
        ]),

        // Progressive Disclosure Sections
        React.createElement('div', {
            key: 'disclosure-sections',
            className: 'space-y-4'
        }, [
            // Pension Planning Section
            React.createElement('div', {
                key: 'pension-section',
                className: 'planning-section'
            }, [
                React.createElement('div', {
                    key: 'pension-header',
                    className: `section-header ${expandedSections.pension ? 'expanded' : ''}`,
                    onClick: () => toggleSection('pension')
                }, [
                    React.createElement('div', {
                        key: 'title',
                        className: 'section-title'
                    }, [
                        React.createElement('div', {
                            key: 'icon',
                            className: 'section-icon'
                        }, '🏛️'),
                        t.pensionPlanning
                    ]),
                    React.createElement('div', {
                        key: 'expand',
                        className: `expand-icon ${expandedSections.pension ? 'expanded' : ''}`
                    }, '▼')
                ]),
                React.createElement('div', {
                    key: 'pension-content',
                    className: `section-content ${expandedSections.pension ? 'expanded' : ''}`
                }, expandedSections.pension ? 'Pension planning content will be rendered here when BasicInputs/AdvancedInputs components are integrated.' : null)
            ]),

            // Investment Portfolio Section
            React.createElement('div', {
                key: 'investments-section',
                className: 'planning-section'
            }, [
                React.createElement('div', {
                    key: 'investments-header',
                    className: `section-header ${expandedSections.investments ? 'expanded' : ''}`,
                    onClick: () => toggleSection('investments')
                }, [
                    React.createElement('div', {
                        key: 'title',
                        className: 'section-title'
                    }, [
                        React.createElement('div', {
                            key: 'icon',
                            className: 'section-icon'
                        }, '📈'),
                        t.investmentPortfolio
                    ]),
                    React.createElement('div', {
                        key: 'expand',
                        className: `expand-icon ${expandedSections.investments ? 'expanded' : ''}`
                    }, '▼')
                ]),
                React.createElement('div', {
                    key: 'investments-content',
                    className: `section-content ${expandedSections.investments ? 'expanded' : ''}`
                }, expandedSections.investments ? [
                    React.createElement('div', {
                        key: 'investment-tools',
                        className: 'space-y-6'
                    }, [
                        // Portfolio Optimization
                        React.createElement('div', {
                            key: 'portfolio-optimization',
                            className: 'space-y-4'
                        }, [
                            React.createElement('button', {
                                key: 'optimize-portfolio',
                                onClick: () => {
                                    if (onSectionExpand) {
                                        onSectionExpand('openOptimization', 'optimization');
                                    }
                                },
                                className: 'w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center'
                            }, [
                                React.createElement('span', { key: 'icon', className: 'mr-2' }, '📊'),
                                language === 'he' ? 'אופטימיזציה ואיזון תיק השקעות' : 'Optimize & Rebalance Portfolio'
                            ]),
                            
                            React.createElement('div', {
                                key: 'optimization-preview',
                                className: 'bg-gray-50 rounded-lg p-4 border'
                            }, [
                                React.createElement('h5', {
                                    key: 'preview-title',
                                    className: 'font-medium text-gray-700 mb-2'
                                }, language === 'he' ? 'כלי אופטימיזציה' : 'Optimization Tools'),
                                React.createElement('ul', {
                                    key: 'tools-list',
                                    className: 'space-y-1 text-sm text-gray-600'
                                }, [
                                    React.createElement('li', { key: 'asset-allocation' }, `• ${language === 'he' ? 'הקצאת נכסים אופטימלית' : 'Optimal asset allocation'}`),
                                    React.createElement('li', { key: 'rebalancing' }, `• ${language === 'he' ? 'המלצות איזון מחדש' : 'Rebalancing recommendations'}`),
                                    React.createElement('li', { key: 'risk-adjusted' }, `• ${language === 'he' ? 'תשואה מותאמת סיכון' : 'Risk-adjusted returns'}`),
                                    React.createElement('li', { key: 'implementation' }, `• ${language === 'he' ? 'תוכנית יישום מדורגת' : 'Phased implementation plan'}`)
                                ])
                            ])
                        ]),
                        
                        // Currency Management
                        window.CurrencySelector && React.createElement('div', {
                            key: 'currency-management'
                        }, [
                            React.createElement('h4', {
                                key: 'currency-title',
                                className: 'font-semibold text-gray-700 mb-4'
                            }, language === 'he' ? 'ניהול מטבעות' : 'Currency Management'),
                            React.createElement(window.CurrencySelector, {
                                key: 'currency-selector-full',
                                selectedCurrency: selectedCurrency,
                                onCurrencyChange: setSelectedCurrency,
                                amount: netWorth,
                                language: language,
                                showRates: true,
                                compact: false
                            })
                        ])
                    ])
                ] : null)
            ]),

            // Partner Planning Section
            React.createElement('div', {
                key: 'partner-section',
                className: 'planning-section'
            }, [
                React.createElement('div', {
                    key: 'partner-header',
                    className: `section-header ${expandedSections.partner ? 'expanded' : ''}`,
                    onClick: () => toggleSection('partner')
                }, [
                    React.createElement('div', {
                        key: 'title',
                        className: 'section-title'
                    }, [
                        React.createElement('div', {
                            key: 'icon',
                            className: 'section-icon'
                        }, '👥'),
                        t.partnerPlanning
                    ]),
                    React.createElement('div', {
                        key: 'expand',
                        className: `expand-icon ${expandedSections.partner ? 'expanded' : ''}`
                    }, '▼')
                ]),
                React.createElement('div', {
                    key: 'partner-content',
                    className: `section-content ${expandedSections.partner ? 'expanded' : ''}`
                }, expandedSections.partner ? [
                    // Couple Validation Panel
                    inputs && inputs.partnerPlanningEnabled && window.CoupleValidationPanel && React.createElement(window.CoupleValidationPanel, {
                        key: 'couple-validation',
                        primaryInputs: inputs,
                        partnerInputs: inputs, // Partner data is within the same inputs object
                        language: language,
                        workingCurrency: workingCurrency,
                        onValidationUpdate: (validationResults) => {
                            console.log('Couple validation results:', validationResults);
                            // Could show notification or update UI based on validation results
                        },
                        onFixIssue: (issue) => {
                            console.log('Fix issue:', issue);
                            // Could navigate to specific sections or show guided fixes
                            if (onSectionExpand) {
                                // Map issue types to appropriate sections
                                const sectionMap = {
                                    'ages': 'detailed',
                                    'salaries': 'detailed',
                                    'expenses': 'detailed',
                                    'contributions': 'detailed'
                                };
                                const targetSection = sectionMap[issue.field];
                                if (targetSection) {
                                    onSectionExpand(issue.field, targetSection);
                                }
                            }
                        }
                    }),
                    
                    // Partner planning summary when no validation issues
                    React.createElement('div', {
                        key: 'partner-summary',
                        className: 'mt-6 p-4 bg-gray-50 rounded-lg border'
                    }, [
                        React.createElement('h5', {
                            key: 'summary-title',
                            className: 'font-medium text-gray-700 mb-2'
                        }, language === 'he' ? 'סיכום תכנון זוגי' : 'Couple Planning Summary'),
                        React.createElement('p', {
                            key: 'summary-desc',
                            className: 'text-sm text-gray-600'
                        }, language === 'he' ? 
                            'תכנון פרישה משותף מאפשר אופטימיזציה של הכנסות, הוצאות וסיכונים.' :
                            'Joint retirement planning enables optimization of income, expenses, and risk management.')
                    ])
                ] : null)
            ]),

            // Scenario Testing Section
            React.createElement('div', {
                key: 'scenarios-section',
                className: 'planning-section'
            }, [
                React.createElement('div', {
                    key: 'scenarios-header',
                    className: `section-header ${expandedSections.scenarios ? 'expanded' : ''}`,
                    onClick: () => setViewMode ? setViewMode('scenarios') : toggleSection('scenarios')
                }, [
                    React.createElement('div', {
                        key: 'title',
                        className: 'section-title'
                    }, [
                        React.createElement('div', {
                            key: 'icon',
                            className: 'section-icon'
                        }, '🧪'),
                        t.scenarioTesting
                    ]),
                    React.createElement('div', {
                        key: 'expand',
                        className: `expand-icon ${expandedSections.scenarios ? 'expanded' : ''}`
                    }, '▼')
                ]),
                React.createElement('div', {
                    key: 'scenarios-content',
                    className: `section-content ${expandedSections.scenarios ? 'expanded' : ''}`
                }, expandedSections.scenarios ? [
                    // Quick scenario comparison actions
                    React.createElement('div', {
                        key: 'scenario-actions',
                        className: 'space-y-4 mb-6'
                    }, [
                        React.createElement('button', {
                            key: 'open-scenarios',
                            onClick: () => {
                                if (onSectionExpand) {
                                    onSectionExpand('openScenarios', 'scenarios');
                                }
                            },
                            className: 'w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center'
                        }, [
                            React.createElement('span', { key: 'icon', className: 'mr-2' }, '🔄'),
                            language === 'he' ? 'השוואת תרחישי פרישה' : 'Compare Retirement Scenarios'
                        ]),
                        
                        React.createElement('div', {
                            key: 'scenario-preview',
                            className: 'bg-gray-50 rounded-lg p-4 border'
                        }, [
                            React.createElement('h5', {
                                key: 'preview-title',
                                className: 'font-medium text-gray-700 mb-2'
                            }, language === 'he' ? 'תרחישים זמינים' : 'Available Scenarios'),
                            React.createElement('ul', {
                                key: 'scenario-list',
                                className: 'space-y-1 text-sm text-gray-600'
                            }, [
                                React.createElement('li', { key: 'optimistic' }, `• ${language === 'he' ? 'תרחיש אופטימי' : 'Optimistic scenario'}`),
                                React.createElement('li', { key: 'conservative' }, `• ${language === 'he' ? 'תרחיש שמרני' : 'Conservative scenario'}`),
                                React.createElement('li', { key: 'early-retirement' }, `• ${language === 'he' ? 'פרישה מוקדמת' : 'Early retirement'}`),
                                React.createElement('li', { key: 'custom' }, `• ${language === 'he' ? 'תרחיש מותאם אישית' : 'Custom scenarios'}`)
                            ])
                        ])
                    ]),
                    
                    // Stress test interface if available
                    window.StressTestInterface && React.createElement(window.StressTestInterface, {
                        key: 'stress-test',
                        inputs: inputs,
                        workPeriods: [
                            {
                                id: 1,
                                country: 'israel',
                                startAge: inputs?.currentAge || 30,
                                endAge: inputs?.retirementAge || 67,
                                monthlyContribution: 2000,
                                salary: inputs?.currentSalary || 15000,
                                pensionReturn: 7.0,
                                pensionDepositFee: 0.5,
                                pensionAnnualFee: 1.0,
                                monthlyTrainingFund: 500
                            }
                        ],
                        results: results,
                        language: language,
                        formatCurrency: formatCurrency,
                        workingCurrency: workingCurrency
                    })
                ] : null)
            ]),

            // Goal Tracking Section
            React.createElement('div', {
                key: 'goals-section',
                className: 'planning-section'
            }, [
                React.createElement('div', {
                    key: 'goals-header',
                    className: `section-header ${expandedSections.goals ? 'expanded' : ''}`,
                    onClick: () => setViewMode ? setViewMode('goals') : toggleSection('goals')
                }, [
                    React.createElement('div', {
                        key: 'title',
                        className: 'section-title'
                    }, [
                        React.createElement('div', {
                            key: 'icon',
                            className: 'section-icon'
                        }, '🎯'),
                        t.goalTracking
                    ]),
                    React.createElement('div', {
                        key: 'expand',
                        className: `expand-icon ${expandedSections.goals ? 'expanded' : ''}`
                    }, '▼')
                ]),
                React.createElement('div', {
                    key: 'goals-content',
                    className: `section-content ${expandedSections.goals ? 'expanded' : ''}`
                }, expandedSections.goals ? [
                    // Goal tracking actions
                    React.createElement('div', {
                        key: 'goal-actions',
                        className: 'space-y-4 mb-6'
                    }, [
                        React.createElement('button', {
                            key: 'open-goals',
                            onClick: () => {
                                if (onSectionExpand) {
                                    onSectionExpand('openGoals', 'goals');
                                }
                            },
                            className: 'w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center'
                        }, [
                            React.createElement('span', { key: 'icon', className: 'mr-2' }, '🎯'),
                            language === 'he' ? 'מעקב יעדי פרישה' : 'Track Retirement Goals'
                        ]),
                        
                        React.createElement('div', {
                            key: 'goals-preview',
                            className: 'bg-gray-50 rounded-lg p-4 border'
                        }, [
                            React.createElement('h5', {
                                key: 'preview-title',
                                className: 'font-medium text-gray-700 mb-2'
                            }, language === 'he' ? 'יעדים זמינים' : 'Available Goals'),
                            React.createElement('ul', {
                                key: 'goals-list',
                                className: 'space-y-1 text-sm text-gray-600'
                            }, [
                                React.createElement('li', { key: 'retirement-income' }, `• ${language === 'he' ? 'יעד הכנסה בפרישה' : 'Retirement income target'}`),
                                React.createElement('li', { key: 'total-savings' }, `• ${language === 'he' ? 'יעד חיסכון כולל' : 'Total savings target'}`),
                                React.createElement('li', { key: 'emergency-fund' }, `• ${language === 'he' ? 'קרן חירום' : 'Emergency fund'}`),
                                React.createElement('li', { key: 'custom-goals' }, `• ${language === 'he' ? 'יעדים מותאמים אישית' : 'Custom goals'}`)
                            ])
                        ])
                    ])
                ] : null)
            ]),

            // Inheritance & Estate Planning Section
            React.createElement('div', {
                key: 'inheritance-section',
                className: 'planning-section'
            }, [
                React.createElement('div', {
                    key: 'inheritance-header',
                    className: `section-header ${expandedSections.inheritance ? 'expanded' : ''}`,
                    onClick: () => toggleSection('inheritance')
                }, [
                    React.createElement('div', {
                        key: 'title',
                        className: 'section-title'
                    }, [
                        React.createElement('div', {
                            key: 'icon',
                            className: 'section-icon'
                        }, '🏛️'),
                        t.inheritancePlanning
                    ]),
                    React.createElement('div', {
                        key: 'expand',
                        className: `expand-icon ${expandedSections.inheritance ? 'expanded' : ''}`
                    }, '▼')
                ]),
                React.createElement('div', {
                    key: 'inheritance-content',
                    className: `section-content ${expandedSections.inheritance ? 'expanded' : ''}`
                }, expandedSections.inheritance ? [
                    React.createElement('div', {
                        key: 'inheritance-summary',
                        className: 'grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'
                    }, [
                        React.createElement('div', {
                            key: 'total-assets',
                            className: 'bg-green-50 p-4 rounded-lg border border-green-200'
                        }, [
                            React.createElement('h5', {
                                key: 'assets-title',
                                className: 'text-sm font-medium text-green-700 mb-1'
                            }, t.totalAssets),
                            React.createElement('p', {
                                key: 'assets-value',
                                className: 'text-lg font-bold text-green-900'
                            }, formatCurrency ? formatCurrency(inputs.totalAssets || 0, workingCurrency) : (inputs.totalAssets || 0))
                        ]),
                        React.createElement('div', {
                            key: 'total-debts',
                            className: 'bg-red-50 p-4 rounded-lg border border-red-200'
                        }, [
                            React.createElement('h5', {
                                key: 'debts-title',
                                className: 'text-sm font-medium text-red-700 mb-1'
                            }, t.totalDebts),
                            React.createElement('p', {
                                key: 'debts-value',
                                className: 'text-lg font-bold text-red-900'
                            }, formatCurrency ? formatCurrency(inputs.totalDebts || 0, workingCurrency) : (inputs.totalDebts || 0))
                        ]),
                        React.createElement('div', {
                            key: 'net-worth',
                            className: 'bg-blue-50 p-4 rounded-lg border border-blue-200'
                        }, [
                            React.createElement('h5', {
                                key: 'networth-title',
                                className: 'text-sm font-medium text-blue-700 mb-1'
                            }, t.estateValue),
                            React.createElement('p', {
                                key: 'networth-value',
                                className: 'text-lg font-bold text-blue-900'
                            }, formatCurrency ? formatCurrency(inputs.netWorth || 0, workingCurrency) : (inputs.netWorth || 0))
                        ]),
                        React.createElement('div', {
                            key: 'will-status',
                            className: 'bg-purple-50 p-4 rounded-lg border border-purple-200'
                        }, [
                            React.createElement('h5', {
                                key: 'will-title',
                                className: 'text-sm font-medium text-purple-700 mb-1'
                            }, t.hasWillStatus),
                            React.createElement('p', {
                                key: 'will-value',
                                className: 'text-lg font-bold text-purple-900'
                            }, inputs.hasWill || inputs.willStatus === 'hasWill' ? '✅' : '❌')
                        ])
                    ]),
                    inputs.lifeInsuranceAmount > 0 && React.createElement('div', {
                        key: 'life-insurance',
                        className: 'bg-yellow-50 p-4 rounded-lg border border-yellow-200'
                    }, [
                        React.createElement('h5', {
                            key: 'insurance-title',
                            className: 'text-sm font-medium text-yellow-700 mb-2'
                        }, t.lifeInsurance),
                        React.createElement('p', {
                            key: 'insurance-value',
                            className: 'text-lg font-bold text-yellow-900'
                        }, formatCurrency ? formatCurrency(inputs.lifeInsuranceAmount, workingCurrency) : inputs.lifeInsuranceAmount)
                    ])
                ] : null)
            ]),

            // Tax Optimization Section
            React.createElement('div', {
                key: 'tax-section',
                className: 'planning-section'
            }, [
                React.createElement('div', {
                    key: 'tax-header',
                    className: `section-header ${expandedSections.taxOptimization ? 'expanded' : ''}`,
                    onClick: () => setViewMode ? setViewMode('optimization') : toggleSection('taxOptimization')
                }, [
                    React.createElement('div', {
                        key: 'title',
                        className: 'section-title'
                    }, [
                        React.createElement('div', {
                            key: 'icon',
                            className: 'section-icon'
                        }, '💰'),
                        t.taxOptimization
                    ]),
                    React.createElement('div', {
                        key: 'expand',
                        className: `expand-icon ${expandedSections.taxOptimization ? 'expanded' : ''}`
                    }, '▼')
                ]),
                React.createElement('div', {
                    key: 'tax-content',
                    className: `section-content ${expandedSections.taxOptimization ? 'expanded' : ''}`
                }, expandedSections.taxOptimization ? [
                    React.createElement('div', {
                        key: 'tax-summary',
                        className: 'grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'
                    }, [
                        React.createElement('div', {
                            key: 'tax-efficiency',
                            className: 'bg-indigo-50 p-4 rounded-lg border border-indigo-200'
                        }, [
                            React.createElement('h5', {
                                key: 'efficiency-title',
                                className: 'text-sm font-medium text-indigo-700 mb-1'
                            }, t.taxEfficiency),
                            React.createElement('p', {
                                key: 'efficiency-value',
                                className: 'text-lg font-bold text-indigo-900'
                            }, `${inputs.taxEfficiencyScore || 0}/100`)
                        ]),
                        React.createElement('div', {
                            key: 'pension-optimized',
                            className: 'bg-teal-50 p-4 rounded-lg border border-teal-200'
                        }, [
                            React.createElement('h5', {
                                key: 'pension-title',
                                className: 'text-sm font-medium text-teal-700 mb-1'
                            }, t.pensionOptimized),
                            React.createElement('p', {
                                key: 'pension-value',
                                className: 'text-lg font-bold text-teal-900'
                            }, `${inputs.optimizedPensionRate || inputs.pensionContributionRate || 17.5}%`)
                        ]),
                        React.createElement('div', {
                            key: 'training-optimized',
                            className: 'bg-cyan-50 p-4 rounded-lg border border-cyan-200'
                        }, [
                            React.createElement('h5', {
                                key: 'training-title',
                                className: 'text-sm font-medium text-cyan-700 mb-1'
                            }, t.trainingFundOptimized),
                            React.createElement('p', {
                                key: 'training-value',
                                className: 'text-lg font-bold text-cyan-900'
                            }, `${inputs.optimizedTrainingFundRate || inputs.trainingFundContributionRate || 7.5}%`)
                        ])
                    ])
                ] : null)
            ]),

            // National Insurance Section
            React.createElement('div', {
                key: 'ni-section',
                className: 'planning-section'
            }, [
                React.createElement('div', {
                    key: 'ni-header',
                    className: `section-header ${expandedSections.nationalInsurance ? 'expanded' : ''}`,
                    onClick: () => toggleSection('nationalInsurance')
                }, [
                    React.createElement('div', {
                        key: 'title',
                        className: 'section-title'
                    }, [
                        React.createElement('div', {
                            key: 'icon',
                            className: 'section-icon'
                        }, '🛡️'),
                        t.nationalInsurance
                    ]),
                    React.createElement('div', {
                        key: 'expand',
                        className: `expand-icon ${expandedSections.nationalInsurance ? 'expanded' : ''}`
                    }, '▼')
                ]),
                React.createElement('div', {
                    key: 'ni-content',
                    className: `section-content ${expandedSections.nationalInsurance ? 'expanded' : ''}`
                }, expandedSections.nationalInsurance && results && results.nationalInsurance ? [
                    React.createElement('div', {
                        key: 'ni-summary',
                        className: 'grid grid-cols-1 md:grid-cols-2 gap-4'
                    }, [
                        React.createElement('div', {
                            key: 'monthly-benefit',
                            className: 'bg-emerald-50 p-4 rounded-lg border border-emerald-200'
                        }, [
                            React.createElement('h5', {
                                key: 'monthly-title',
                                className: 'text-sm font-medium text-emerald-700 mb-1'
                            }, t.monthlyBenefit),
                            React.createElement('p', {
                                key: 'monthly-value',
                                className: 'text-lg font-bold text-emerald-900'
                            }, formatCurrency ? formatCurrency(results.nationalInsurance.monthlyBenefit || 0, workingCurrency) : (results.nationalInsurance.monthlyBenefit || 0))
                        ]),
                        React.createElement('div', {
                            key: 'total-benefit',
                            className: 'bg-lime-50 p-4 rounded-lg border border-lime-200'
                        }, [
                            React.createElement('h5', {
                                key: 'total-title',
                                className: 'text-sm font-medium text-lime-700 mb-1'
                            }, t.totalBenefit),
                            React.createElement('p', {
                                key: 'total-value',
                                className: 'text-lg font-bold text-lime-900'
                            }, formatCurrency ? formatCurrency(results.nationalInsurance.totalBenefit || 0, workingCurrency) : (results.nationalInsurance.totalBenefit || 0))
                        ])
                    ])
                ] : expandedSections.nationalInsurance ? [
                    React.createElement('p', {
                        key: 'ni-placeholder',
                        className: 'text-gray-500 text-center py-4'
                    }, language === 'he' ? 
                        'חישוב ביטוח לאומי יופיע כאן לאחר השלמת האשף' :
                        'National Insurance calculation will appear here after completing the wizard')
                ] : null)
            ])
        ])
    ]);
};

// Export to window for global access
window.Dashboard = Dashboard;