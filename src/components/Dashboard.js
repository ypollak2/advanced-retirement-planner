// Dashboard Component - Guided Intelligence UI Design
// Created by Yali Pollak (יהלי פולק) - v5.3.0

const Dashboard = ({ 
    inputs, 
    results, 
    language = 'he',
    formatCurrency,
    onSectionExpand
}) => {
    const [selectedCurrency, setSelectedCurrency] = React.useState('ILS');
    const [exchangeRates, setExchangeRates] = React.useState({});
    const [expandedSections, setExpandedSections] = React.useState({
        pension: false,
        investments: false,
        partner: false,
        scenarios: false
    });

    // Content translations
    const content = {
        he: {
            dashboard: 'לוח הבקרה הפיננסי',
            healthMeter: 'מד בריאות פיננסית',
            retirementCountdown: 'ספירה לאחור לפרישה',
            netWorth: 'שווי נטו',
            quickActions: 'פעולות מהירות',
            planPension: 'תכנן פנסיה',
            manageInvestments: 'נהל השקעות',
            partnerPlanning: 'תכנון משותף',
            testScenarios: 'בדוק תרחישים',
            years: 'שנים',
            untilRetirement: 'עד הפרישה',
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
            scenarioTesting: 'בדיקת תרחישים'
        },
        en: {
            dashboard: 'Financial Dashboard',
            healthMeter: 'Financial Health Meter',
            retirementCountdown: 'Retirement Countdown',
            netWorth: 'Net Worth',
            quickActions: 'Quick Actions',
            planPension: 'Plan Pension',
            manageInvestments: 'Manage Investments',
            partnerPlanning: 'Partner Planning',
            testScenarios: 'Test Scenarios',
            years: 'years',
            untilRetirement: 'until retirement',
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
            scenarioTesting: 'Scenario Testing'
        }
    };

    const t = content[language] || content.he;

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

    // Calculate financial health score (0-100)
    const calculateHealthScore = () => {
        if (!inputs || !results) return 0;
        
        const currentAge = inputs.currentAge || 30;
        const retirementAge = inputs.retirementAge || 67;
        const yearsToRetirement = retirementAge - currentAge;
        const currentSavings = inputs.currentSavings || 0;
        const monthlyExpenses = inputs.currentMonthlyExpenses || 10000;
        const targetReplacement = inputs.targetReplacement || 75;
        
        let score = 0;
        
        // Factor 1: Savings rate (30 points)
        const annualSavings = (inputs.monthlyContribution || 2000) * 12;
        const annualIncome = (inputs.currentSalary || 20000) * 12;
        const savingsRate = annualSavings / annualIncome * 100;
        score += Math.min(savingsRate * 2, 30);
        
        // Factor 2: Current savings adequacy (25 points)
        const recommendedSavings = currentAge * annualIncome * 0.01;
        const savingsAdequacy = currentSavings / recommendedSavings;
        score += Math.min(savingsAdequacy * 25, 25);
        
        // Factor 3: Time horizon (20 points)
        const timeScore = yearsToRetirement > 30 ? 20 : (yearsToRetirement / 30) * 20;
        score += timeScore;
        
        // Factor 4: Risk management (15 points)
        const riskTolerance = inputs.riskTolerance || 'moderate';
        const riskScore = riskTolerance === 'aggressive' ? 15 : 
                         riskTolerance === 'moderate' ? 12 : 8;
        score += riskScore;
        
        // Factor 5: Diversification (10 points)
        const hasMultipleStreams = (inputs.currentPersonalPortfolio || 0) > 0 || 
                                  (inputs.currentRealEstate || 0) > 0;
        score += hasMultipleStreams ? 10 : 5;
        
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

    // Calculate years until retirement
    const yearsToRetirement = (inputs?.retirementAge || 67) - (inputs?.currentAge || 30);

    // Calculate net worth with currency conversion
    const calculateNetWorth = () => {
        const baseNetWorth = (inputs?.currentSavings || 0) + 
                            (inputs?.currentPersonalPortfolio || 0) + 
                            (inputs?.currentRealEstate || 0) + 
                            (inputs?.currentCrypto || 0);
        
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
            // Financial Health Meter
            React.createElement('div', {
                key: 'health-meter',
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
                    key: 'meter-container',
                    className: 'financial-health-meter'
                }, [
                    React.createElement('svg', {
                        key: 'meter-svg',
                        className: 'health-meter-circle'
                    }, [
                        React.createElement('circle', {
                            key: 'background',
                            className: 'health-meter-background',
                            cx: '140',
                            cy: '140',
                            r: radius,
                            strokeDasharray: strokeDasharray
                        }),
                        React.createElement('circle', {
                            key: 'progress',
                            className: `health-meter-progress ${healthStatus.class.split(' ')[0]}`,
                            cx: '140',
                            cy: '140',
                            r: radius,
                            strokeDasharray: strokeDasharray,
                            strokeDashoffset: strokeDashoffset
                        })
                    ]),
                    React.createElement('div', {
                        key: 'meter-center',
                        className: 'health-meter-center'
                    }, [
                        React.createElement('div', {
                            key: 'score',
                            className: 'health-score-value'
                        }, healthScore),
                        React.createElement('div', {
                            key: 'label',
                            className: 'health-score-label'
                        }, t.financialHealth),
                        React.createElement('div', {
                            key: 'status',
                            className: `health-score-status ${healthStatus.class.split(' ')[1]}`
                        }, t[healthStatus.status])
                    ])
                ])
            ]),

            // Retirement Countdown
            React.createElement('div', {
                key: 'countdown',
                className: 'retirement-countdown'
            }, [
                React.createElement('div', {
                    key: 'countdown-main'
                }, [
                    React.createElement('div', {
                        key: 'years',
                        className: 'countdown-years'
                    }, yearsToRetirement),
                    React.createElement('div', {
                        key: 'label',
                        className: 'countdown-label'
                    }, `${t.years} ${t.untilRetirement}`)
                ]),
                React.createElement('div', {
                    key: 'details',
                    className: 'countdown-details'
                }, [
                    React.createElement('div', { key: 'current' }, `${t.currentAge}: ${inputs?.currentAge || 30}`),
                    React.createElement('div', { key: 'target' }, `${t.targetAge}: ${inputs?.retirementAge || 67}`)
                ])
            ]),

            // Net Worth Tracker
            React.createElement('div', {
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
                React.createElement('div', {
                    key: 'change',
                    className: 'net-worth-change change-positive'
                }, [
                    React.createElement('span', { key: 'arrow' }, '↗'),
                    ' +2.3% ',
                    t.changeFrom,
                    ' ',
                    t.yesterday
                ]),
                window.CurrencySelector && React.createElement(window.CurrencySelector, {
                    key: 'currency-selector',
                    selectedCurrency: selectedCurrency,
                    onCurrencyChange: setSelectedCurrency,
                    amount: netWorth,
                    language: language,
                    compact: true,
                    showRates: false
                })
            ]),

            // Quick Actions Grid
            React.createElement('div', {
                key: 'quick-actions'
            }, [
                React.createElement('h3', {
                    key: 'actions-title',
                    className: 'section-title mb-4'
                }, [
                    React.createElement('span', { key: 'icon' }, '⚡'),
                    ' ',
                    t.quickActions
                ]),
                React.createElement('div', {
                    key: 'actions-grid',
                    className: 'quick-actions-grid'
                }, [
                    React.createElement('div', {
                        key: 'pension',
                        className: 'quick-action-card',
                        onClick: () => toggleSection('pension')
                    }, [
                        React.createElement('div', {
                            key: 'icon',
                            className: 'quick-action-icon action-pension'
                        }, '🏛️'),
                        React.createElement('div', {
                            key: 'title',
                            className: 'quick-action-title'
                        }, t.planPension),
                        React.createElement('div', {
                            key: 'desc',
                            className: 'quick-action-description'
                        }, 'Set up and optimize pension planning')
                    ]),
                    React.createElement('div', {
                        key: 'investments',
                        className: 'quick-action-card',
                        onClick: () => toggleSection('investments')
                    }, [
                        React.createElement('div', {
                            key: 'icon',
                            className: 'quick-action-icon action-investment'
                        }, '📈'),
                        React.createElement('div', {
                            key: 'title',
                            className: 'quick-action-title'
                        }, t.manageInvestments),
                        React.createElement('div', {
                            key: 'desc',
                            className: 'quick-action-description'
                        }, 'Portfolio management and tracking')
                    ]),
                    React.createElement('div', {
                        key: 'partner',
                        className: 'quick-action-card',
                        onClick: () => toggleSection('partner')
                    }, [
                        React.createElement('div', {
                            key: 'icon',
                            className: 'quick-action-icon action-partner'
                        }, '👥'),
                        React.createElement('div', {
                            key: 'title',
                            className: 'quick-action-title'
                        }, t.partnerPlanning),
                        React.createElement('div', {
                            key: 'desc',
                            className: 'quick-action-description'
                        }, 'Joint financial planning tools')
                    ]),
                    React.createElement('div', {
                        key: 'scenarios',
                        className: 'quick-action-card',
                        onClick: () => toggleSection('scenarios')
                    }, [
                        React.createElement('div', {
                            key: 'icon',
                            className: 'quick-action-icon action-scenario'
                        }, '🧪'),
                        React.createElement('div', {
                            key: 'title',
                            className: 'quick-action-title'
                        }, t.testScenarios),
                        React.createElement('div', {
                            key: 'desc',
                            className: 'quick-action-description'
                        }, 'Stress test different economic scenarios')
                    ])
                ])
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
                        ]),
                        
                        // Placeholder for other investment tools
                        React.createElement('div', {
                            key: 'investment-placeholder',
                            className: 'p-4 border border-gray-200 rounded-lg bg-gray-50'
                        }, [
                            React.createElement('h5', {
                                key: 'placeholder-title',
                                className: 'font-medium text-gray-600 mb-2'
                            }, language === 'he' ? 'כלי השקעה נוספים' : 'Additional Investment Tools'),
                            React.createElement('p', {
                                key: 'placeholder-desc',
                                className: 'text-sm text-gray-500'
                            }, language === 'he' ? 
                                'ניהול תיק השקעות, מעקב אחר מניות וקרנות נאמנות יתווספו בקרוב.' :
                                'Portfolio management, stock tracking, and mutual funds will be added soon.')
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
                }, expandedSections.partner ? 'Partner planning interface will be rendered here.' : null)
            ]),

            // Scenario Testing Section
            React.createElement('div', {
                key: 'scenarios-section',
                className: 'planning-section'
            }, [
                React.createElement('div', {
                    key: 'scenarios-header',
                    className: `section-header ${expandedSections.scenarios ? 'expanded' : ''}`,
                    onClick: () => toggleSection('scenarios')
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
                }, expandedSections.scenarios && window.StressTestInterface ? 
                    React.createElement(window.StressTestInterface, {
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
                        formatCurrency: formatCurrency
                    }) : 
                    (expandedSections.scenarios ? 'Scenario testing interface will be rendered here.' : null)
                )
            ])
        ])
    ]);
};

// Export to window for global access
window.Dashboard = Dashboard;