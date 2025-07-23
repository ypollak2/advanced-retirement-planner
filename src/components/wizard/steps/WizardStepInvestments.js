// WizardStepInvestments.js - Step 6: Investment Preferences
// Comprehensive risk profiling, asset allocation, and investment strategy

const WizardStepInvestments = ({ inputs, setInputs, language = 'en', workingCurrency = 'ILS' }) => {
    const createElement = React.createElement;
    
    // Multi-language content
    const content = {
        he: {
            title: 'העדפות השקעה',
            riskAssessment: 'הערכת סיכון',
            assetAllocation: 'חלוקת נכסים',
            investmentStrategy: 'אסטרטגיית השקעה',
            timeHorizon: 'אופק זמן להשקעה',
            riskProfile: 'פרופיל סיכון',
            conservative: 'שמרני',
            moderate: 'מתון',
            aggressive: 'אגרסיבי',
            customAllocation: 'חלוקה מותאמת אישית',
            stocks: 'מניות (%)',
            bonds: 'אגרות חוב (%)',
            alternatives: 'השקעות אלטרנטיביות (%)',
            cash: 'מזומנים (%)',
            expectedReturn: 'תשואה שנתית צפויה (%)',
            inflationRate: 'שיעור אינפלציה שנתי (%)',
            volatility: 'תנודתיות צפויה (%)',
            riskTolerance: 'סובלנות לסיכון',
            lowRisk: 'סיכון נמוך',
            mediumRisk: 'סיכון בינוני',
            highRisk: 'סיכון גבוה',
            investmentExperience: 'ניסיון השקעה',
            beginner: 'מתחיל',
            intermediate: 'בינוני',
            advanced: 'מתקדם',
            monthlyInvestment: 'השקעה חודשית נוספת',
            rebalancingFrequency: 'תדירות איזון מחדש',
            quarterly: 'רבעוני',
            semiAnnual: 'חצי שנתי',
            annual: 'שנתי',
            conservativeDesc: 'סיכון נמוך, תשואה יציבה, השקעה בטוחה',
            moderateDesc: 'איזון בין סיכון לתשואה, מגוון השקעות',
            aggressiveDesc: 'סיכון גבוה, פוטנציאל תשואה גבוהה',
            yearsToRetirement: 'שנים עד פרישה',
            partnerInvestments: 'השקעות בני הזוג',
            partner1Investments: 'השקעות בן/בת זוג 1',
            partner2Investments: 'השקעות בן/בת זוג 2',
            info: 'פרופיל ההשקעה משפיע על התשואה הצפויה והסיכון',
            totalAllocation: 'סה"כ חלוקה',
            mustEqual100: 'חייב להסתכם ב-100%'
        },
        en: {
            title: 'Investment Preferences',
            riskAssessment: 'Risk Assessment',
            assetAllocation: 'Asset Allocation',
            investmentStrategy: 'Investment Strategy',
            timeHorizon: 'Investment Time Horizon',
            riskProfile: 'Risk Profile',
            conservative: 'Conservative',
            moderate: 'Moderate',
            aggressive: 'Aggressive',
            customAllocation: 'Custom Allocation',
            stocks: 'Stocks (%)',
            bonds: 'Bonds (%)',
            alternatives: 'Alternatives (%)',
            cash: 'Cash (%)',
            expectedReturn: 'Expected Annual Return (%)',
            inflationRate: 'Annual Inflation Rate (%)',
            volatility: 'Expected Volatility (%)',
            riskTolerance: 'Risk Tolerance',
            lowRisk: 'Low Risk',
            mediumRisk: 'Medium Risk',
            highRisk: 'High Risk',
            investmentExperience: 'Investment Experience',
            beginner: 'Beginner',
            intermediate: 'Intermediate',
            advanced: 'Advanced',
            monthlyInvestment: 'Additional Monthly Investment',
            rebalancingFrequency: 'Rebalancing Frequency',
            quarterly: 'Quarterly',
            semiAnnual: 'Semi-Annual',
            annual: 'Annual',
            conservativeDesc: 'Low risk, stable returns, safe investments',
            moderateDesc: 'Balanced risk and return, diversified investments',
            aggressiveDesc: 'High risk, high return potential',
            yearsToRetirement: 'Years to Retirement',
            partnerInvestments: 'Partner Investments',
            partner1Investments: 'Partner 1 Investments',
            partner2Investments: 'Partner 2 Investments',
            info: 'Investment profile affects expected returns and risk',
            totalAllocation: 'Total Allocation',
            mustEqual100: 'Must equal 100%'
        }
    };

    const t = content[language];

    // Risk profiles with detailed allocations and returns
    const riskProfiles = {
        conservative: {
            stocks: 30,
            bonds: 60,
            alternatives: 5,
            cash: 5,
            expectedReturn: 5.0,
            volatility: 8.0,
            description: t.conservativeDesc
        },
        moderate: {
            stocks: 60,
            bonds: 30,
            alternatives: 8,
            cash: 2,
            expectedReturn: 7.0,
            volatility: 12.0,
            description: t.moderateDesc
        },
        aggressive: {
            stocks: 80,
            bonds: 10,
            alternatives: 8,
            cash: 2,
            expectedReturn: 9.0,
            volatility: 18.0,
            description: t.aggressiveDesc
        }
    };

    // Calculate years to retirement
    const yearsToRetirement = (inputs.retirementAge || 67) - (inputs.currentAge || 30);

    // Age-based recommended allocation
    const getRecommendedAllocation = () => {
        const age = inputs.currentAge || 30;
        if (age < 35) return 'aggressive';
        if (age < 50) return 'moderate';
        return 'conservative';
    };

    // Handle risk profile selection
    const handleRiskProfileChange = (profile) => {
        const allocation = riskProfiles[profile];
        setInputs({
            ...inputs,
            riskProfile: profile,
            stockAllocation: allocation.stocks,
            bondAllocation: allocation.bonds,
            alternativeAllocation: allocation.alternatives,
            cashAllocation: allocation.cash,
            expectedReturn: allocation.expectedReturn,
            expectedVolatility: allocation.volatility
        });
    };

    // Calculate total allocation
    const getTotalAllocation = () => {
        const stocks = inputs.stockAllocation || 0;
        const bonds = inputs.bondAllocation || 0;
        const alternatives = inputs.alternativeAllocation || 0;
        const cash = inputs.cashAllocation || 0;
        return stocks + bonds + alternatives + cash;
    };

    const currentProfile = inputs.riskProfile || getRecommendedAllocation();
    const totalAllocation = getTotalAllocation();
    const isValidAllocation = Math.abs(totalAllocation - 100) < 0.1;

    return createElement('div', { className: "space-y-8" }, [
        // Risk Assessment Section
        createElement('div', { key: 'risk-assessment-section' }, [
            createElement('h3', { 
                key: 'risk-title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center" 
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '📊'),
                t.riskAssessment
            ]),
            createElement('div', { 
                key: 'risk-grid',
                className: "grid grid-cols-1 md:grid-cols-2 gap-6" 
            }, [
                // Investment Experience
                createElement('div', { key: 'experience' }, [
                    createElement('label', { 
                        key: 'experience-label',
                        className: "block text-sm font-medium text-gray-700 mb-3" 
                    }, t.investmentExperience),
                    createElement('div', { 
                        key: 'experience-options',
                        className: "space-y-2" 
                    }, [
                        ['beginner', 'intermediate', 'advanced'].map(level => 
                            createElement('label', {
                                key: level,
                                className: "flex items-center cursor-pointer"
                            }, [
                                createElement('input', {
                                    key: 'radio',
                                    type: 'radio',
                                    name: 'investmentExperience',
                                    value: level,
                                    checked: inputs.investmentExperience === level,
                                    onChange: (e) => setInputs({...inputs, investmentExperience: e.target.value}),
                                    className: "mr-3"
                                }),
                                createElement('span', { key: 'text' }, t[level])
                            ])
                        )
                    ])
                ]),
                
                // Time Horizon
                createElement('div', { key: 'time-horizon' }, [
                    createElement('label', { 
                        key: 'horizon-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.yearsToRetirement),
                    createElement('div', { 
                        key: 'horizon-display',
                        className: "text-2xl font-bold text-blue-600 bg-blue-50 rounded-lg p-4 text-center" 
                    }, `${yearsToRetirement} ${language === 'he' ? 'שנים' : 'years'}`),
                    createElement('p', { 
                        key: 'horizon-note',
                        className: "text-sm text-gray-500 mt-2" 
                    }, language === 'he' ? 
                        'אופק זמן ארוך יותר מאפשר סיכון גבוה יותר' : 
                        'Longer time horizon allows for higher risk tolerance')
                ])
            ])
        ]),

        // Risk Profile Selection
        createElement('div', { key: 'risk-profile-section' }, [
            createElement('h3', { 
                key: 'profile-title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center" 
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '🎯'),
                t.riskProfile
            ]),
            createElement('div', { 
                key: 'profile-grid',
                className: "grid grid-cols-1 md:grid-cols-3 gap-6" 
            }, Object.keys(riskProfiles).map(profile => {
                const profileData = riskProfiles[profile];
                const isSelected = currentProfile === profile;
                const isRecommended = getRecommendedAllocation() === profile;
                
                return createElement('div', {
                    key: profile,
                    onClick: () => handleRiskProfileChange(profile),
                    className: `cursor-pointer border-2 rounded-xl p-6 transition-all duration-200 ${
                        isSelected 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                    }`
                }, [
                    isRecommended && createElement('div', {
                        key: 'recommended',
                        className: "bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded mb-3 inline-block"
                    }, language === 'he' ? 'מומלץ לגילך' : 'Recommended for your age'),
                    
                    createElement('div', { key: 'profile-content' }, [
                        createElement('h4', { 
                            key: 'profile-name',
                            className: "text-lg font-semibold text-gray-800 mb-2" 
                        }, t[profile]),
                        
                        createElement('p', { 
                            key: 'profile-desc',
                            className: "text-sm text-gray-600 mb-4" 
                        }, profileData.description),
                        
                        createElement('div', { 
                            key: 'profile-stats',
                            className: "space-y-2" 
                        }, [
                            createElement('div', { 
                                key: 'return',
                                className: "flex justify-between" 
                            }, [
                                createElement('span', { key: 'return-label' }, language === 'he' ? 'תשואה:' : 'Return:'),
                                createElement('span', { key: 'return-value', className: "font-medium" }, `${profileData.expectedReturn}%`)
                            ]),
                            createElement('div', { 
                                key: 'volatility',
                                className: "flex justify-between" 
                            }, [
                                createElement('span', { key: 'vol-label' }, language === 'he' ? 'תנודתיות:' : 'Volatility:'),
                                createElement('span', { key: 'vol-value', className: "font-medium" }, `${profileData.volatility}%`)
                            ]),
                            createElement('div', { 
                                key: 'allocation',
                                className: "text-xs text-gray-500 mt-3" 
                            }, `${profileData.stocks}% ${language === 'he' ? 'מניות' : 'stocks'}, ${profileData.bonds}% ${language === 'he' ? 'אגח' : 'bonds'}`)
                        ])
                    ])
                ]);
            }))
        ]),

        // Asset Allocation Details
        createElement('div', { key: 'allocation-section' }, [
            createElement('h3', { 
                key: 'allocation-title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center" 
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '📈'),
                t.assetAllocation
            ]),
            
            createElement('div', { 
                key: 'allocation-grid',
                className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6" 
            }, [
                createElement('div', { key: 'stocks' }, [
                    createElement('label', { 
                        key: 'stocks-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.stocks),
                    createElement('input', {
                        key: 'stocks-input',
                        type: 'number',
                        min: '0',
                        max: '100',
                        value: inputs.stockAllocation || riskProfiles[currentProfile].stocks,
                        onChange: (e) => setInputs({...inputs, stockAllocation: parseFloat(e.target.value) || 0}),
                        className: "w-full p-4 md:p-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    })
                ]),
                createElement('div', { key: 'bonds' }, [
                    createElement('label', { 
                        key: 'bonds-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.bonds),
                    createElement('input', {
                        key: 'bonds-input',
                        type: 'number',
                        min: '0',
                        max: '100',
                        value: inputs.bondAllocation || riskProfiles[currentProfile].bonds,
                        onChange: (e) => setInputs({...inputs, bondAllocation: parseFloat(e.target.value) || 0}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    })
                ]),
                createElement('div', { key: 'alternatives' }, [
                    createElement('label', { 
                        key: 'alternatives-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.alternatives),
                    createElement('input', {
                        key: 'alternatives-input',
                        type: 'number',
                        min: '0',
                        max: '100',
                        value: inputs.alternativeAllocation || riskProfiles[currentProfile].alternatives,
                        onChange: (e) => setInputs({...inputs, alternativeAllocation: parseFloat(e.target.value) || 0}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    })
                ]),
                createElement('div', { key: 'cash' }, [
                    createElement('label', { 
                        key: 'cash-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.cash),
                    createElement('input', {
                        key: 'cash-input',
                        type: 'number',
                        min: '0',
                        max: '100',
                        value: inputs.cashAllocation || riskProfiles[currentProfile].cash,
                        onChange: (e) => setInputs({...inputs, cashAllocation: parseFloat(e.target.value) || 0}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    })
                ])
            ]),
            
            // Total Allocation Check
            createElement('div', { 
                key: 'allocation-check',
                className: `p-4 rounded-lg ${isValidAllocation ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}` 
            }, [
                createElement('div', { 
                    key: 'total-text',
                    className: `font-medium ${isValidAllocation ? 'text-green-700' : 'text-red-700'}` 
                }, `${t.totalAllocation}: ${totalAllocation.toFixed(1)}%`),
                !isValidAllocation && createElement('p', { 
                    key: 'error-text',
                    className: "text-red-600 text-sm mt-1" 
                }, t.mustEqual100)
            ])
        ]),

        // Investment Parameters
        createElement('div', { key: 'parameters-section' }, [
            createElement('h3', { 
                key: 'parameters-title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center" 
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '⚙️'),
                t.investmentStrategy
            ]),
            createElement('div', { 
                key: 'parameters-grid',
                className: "grid grid-cols-1 md:grid-cols-3 gap-6" 
            }, [
                createElement('div', { key: 'expected-return' }, [
                    createElement('label', { 
                        key: 'return-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.expectedReturn),
                    createElement('input', {
                        key: 'return-input',
                        type: 'number',
                        step: '0.1',
                        value: inputs.expectedReturn || riskProfiles[currentProfile].expectedReturn,
                        onChange: (e) => setInputs({...inputs, expectedReturn: parseFloat(e.target.value) || 0}),
                        className: "w-full p-4 md:p-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    })
                ]),
                createElement('div', { key: 'inflation-rate' }, [
                    createElement('label', { 
                        key: 'inflation-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.inflationRate),
                    createElement('input', {
                        key: 'inflation-input',
                        type: 'number',
                        step: '0.1',
                        value: inputs.inflationRate || 3.0,
                        onChange: (e) => setInputs({...inputs, inflationRate: parseFloat(e.target.value) || 0}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    })
                ]),
                createElement('div', { key: 'volatility' }, [
                    createElement('label', { 
                        key: 'volatility-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.volatility),
                    createElement('input', {
                        key: 'volatility-input',
                        type: 'number',
                        step: '0.1',
                        value: inputs.expectedVolatility || riskProfiles[currentProfile].volatility,
                        onChange: (e) => setInputs({...inputs, expectedVolatility: parseFloat(e.target.value) || 0}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    })
                ])
            ])
        ]),

        // Partner Investment Preferences (if couple)
        inputs.planningType === 'couple' && createElement('div', { key: 'partner-investments-section' }, [
            createElement('h3', { 
                key: 'partner-title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center" 
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '👫'),
                t.partnerInvestments
            ]),
            createElement('div', { 
                key: 'partner-grid',
                className: "grid grid-cols-1 lg:grid-cols-2 gap-8" 
            }, [
                // Partner 1 Investments
                createElement('div', { 
                    key: 'partner1-investments',
                    className: "bg-blue-50 rounded-xl p-6 border border-blue-200" 
                }, [
                    createElement('h4', { 
                        key: 'partner1-title',
                        className: "text-lg font-semibold text-blue-700 mb-4" 
                    }, inputs.userName || t.partner1Investments),
                    createElement('div', { key: 'partner1-fields', className: "space-y-4" }, [
                        createElement('div', { key: 'partner1-risk' }, [
                            createElement('label', { 
                                key: 'partner1-risk-label',
                                className: "block text-sm font-medium text-gray-700 mb-2" 
                            }, t.riskProfile),
                            createElement('select', {
                                key: 'partner1-risk-select',
                                value: inputs.partner1RiskProfile || 'moderate',
                                onChange: (e) => setInputs({...inputs, partner1RiskProfile: e.target.value}),
                                className: "w-full p-4 md:p-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            }, [
                                createElement('option', { key: 'conservative', value: 'conservative' }, t.conservative),
                                createElement('option', { key: 'moderate', value: 'moderate' }, t.moderate),
                                createElement('option', { key: 'aggressive', value: 'aggressive' }, t.aggressive)
                            ])
                        ]),
                        createElement('div', { key: 'partner1-return' }, [
                            createElement('label', { 
                                key: 'partner1-return-label',
                                className: "block text-sm font-medium text-gray-700 mb-2" 
                            }, t.expectedReturn),
                            createElement('input', {
                                key: 'partner1-return-input',
                                type: 'number',
                                step: '0.1',
                                value: inputs.partner1ExpectedReturn || 7.0,
                                onChange: (e) => setInputs({...inputs, partner1ExpectedReturn: parseFloat(e.target.value) || 0}),
                                className: "w-full p-4 md:p-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            })
                        ])
                    ])
                ]),
                
                // Partner 2 Investments
                createElement('div', { 
                    key: 'partner2-investments',
                    className: "bg-green-50 rounded-xl p-6 border border-green-200" 
                }, [
                    createElement('h4', { 
                        key: 'partner2-title',
                        className: "text-lg font-semibold text-green-700 mb-4" 
                    }, inputs.partnerName || t.partner2Investments),
                    createElement('div', { key: 'partner2-fields', className: "space-y-4" }, [
                        createElement('div', { key: 'partner2-risk' }, [
                            createElement('label', { 
                                key: 'partner2-risk-label',
                                className: "block text-sm font-medium text-gray-700 mb-2" 
                            }, t.riskProfile),
                            createElement('select', {
                                key: 'partner2-risk-select',
                                value: inputs.partner2RiskProfile || 'moderate',
                                onChange: (e) => setInputs({...inputs, partner2RiskProfile: e.target.value}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            }, [
                                createElement('option', { key: 'conservative', value: 'conservative' }, t.conservative),
                                createElement('option', { key: 'moderate', value: 'moderate' }, t.moderate),
                                createElement('option', { key: 'aggressive', value: 'aggressive' }, t.aggressive)
                            ])
                        ]),
                        createElement('div', { key: 'partner2-return' }, [
                            createElement('label', { 
                                key: 'partner2-return-label',
                                className: "block text-sm font-medium text-gray-700 mb-2" 
                            }, t.expectedReturn),
                            createElement('input', {
                                key: 'partner2-return-input',
                                type: 'number',
                                step: '0.1',
                                value: inputs.partner2ExpectedReturn || 7.0,
                                onChange: (e) => setInputs({...inputs, partner2ExpectedReturn: parseFloat(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            })
                        ])
                    ])
                ])
            ])
        ]),

        // Info Panel
        createElement('div', { 
            key: 'info',
            className: "bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200" 
        }, [
            createElement('div', { 
                key: 'info-icon',
                className: "text-2xl mb-2" 
            }, 'ℹ️'),
            createElement('h4', { 
                key: 'info-title',
                className: "text-lg font-semibold text-blue-700 mb-2" 
            }, language === 'he' ? 'מידע על השקעות' : 'Investment Information'),
            createElement('p', { 
                key: 'info-text',
                className: "text-blue-600 text-sm" 
            }, t.info),
            createElement('div', { 
                key: 'info-details',
                className: "mt-3 text-xs text-blue-500" 
            }, language === 'he' ? 
                'פרופיל הסיכון מותאם לגיל ולניסיון ההשקעה שלך. ניתן לשנות ידנית.' :
                'Risk profile is adapted to your age and investment experience. Can be customized manually.')
        ])
    ]);
};

// Export to window for global access
window.WizardStepInvestments = WizardStepInvestments;
console.log('✅ WizardStepInvestments component loaded successfully');