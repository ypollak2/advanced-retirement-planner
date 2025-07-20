// WizardStepRiskProfile.js - Step 5: Risk Profile Management
// Per-partner risk assessment and investment strategy preferences

const WizardStepRiskProfile = ({ inputs, setInputs, language = 'en' }) => {
    const content = {
        he: {
            title: 'פרופיל סיכון והשקעות',
            subtitle: 'הגדרת רמת הסיכון והעדפות השקעה לכל בן זוג',
            riskLevels: 'רמות סיכון',
            conservative: 'שמרני',
            moderate: 'מתון',
            aggressive: 'אגרסיבי',
            riskDescription: 'תיאור הסיכון',
            conservativeDesc: 'השקעות בטוחות עם תשואה נמוכה יותר (אג״ח, פקדונות)',
            moderateDesc: 'איזון בין בטיחות לצמיחה (מיקס מניות ואג״ח)',
            aggressiveDesc: 'השקעות צמיחה עם פוטנציאל תשואה גבוה (מניות, נדל״ן)',
            timeHorizon: 'אופק זמן להשקעה',
            shortTerm: 'קצר טווח (1-5 שנים)',
            mediumTerm: 'בינוני (5-15 שנים)',
            longTerm: 'ארוך טווח (15+ שנים)',
            investmentPreferences: 'העדפות השקעה',
            localMarkets: 'שוקים מקומיים',
            internationalMarkets: 'שוקים בינלאומיים',
            realEstate: 'נדל״ן',
            commodities: 'סחורות וזהב',
            cryptocurrency: 'מטבעות דיגיטליים',
            partnerRiskProfiles: 'פרופילי סיכון בני הזוג',
            partner1Risk: 'פרופיל סיכון בן/בת זוג 1',
            partner2Risk: 'פרופיל סיכון בן/בת זוג 2',
            riskTolerance: 'סובלנות לסיכון',
            expectedReturns: 'תשואות צפויות',
            portfolioAllocation: 'חלוקת תיק השקעות',
            stocks: 'מניות',
            bonds: 'אג״ח',
            alternatives: 'השקעות אלטרנטיביות',
            info: 'פרופיל הסיכון משפיע על אסטרטגיית ההשקעה וההקצאה'
        },
        en: {
            title: 'Risk Profile & Investment Strategy',
            subtitle: 'Define risk level and investment preferences for each partner',
            riskLevels: 'Risk Levels',
            conservative: 'Conservative',
            moderate: 'Moderate',
            aggressive: 'Aggressive',
            riskDescription: 'Risk Description',
            conservativeDesc: 'Safe investments with lower returns (bonds, deposits)',
            moderateDesc: 'Balance between safety and growth (stocks and bonds mix)',
            aggressiveDesc: 'Growth investments with high return potential (stocks, real estate)',
            timeHorizon: 'Investment Time Horizon',
            shortTerm: 'Short Term (1-5 years)',
            mediumTerm: 'Medium Term (5-15 years)',
            longTerm: 'Long Term (15+ years)',
            investmentPreferences: 'Investment Preferences',
            localMarkets: 'Local Markets',
            internationalMarkets: 'International Markets',
            realEstate: 'Real Estate',
            commodities: 'Commodities & Gold',
            cryptocurrency: 'Cryptocurrency',
            partnerRiskProfiles: 'Partner Risk Profiles',
            partner1Risk: 'Partner 1 Risk Profile',
            partner2Risk: 'Partner 2 Risk Profile',
            riskTolerance: 'Risk Tolerance',
            expectedReturns: 'Expected Returns',
            portfolioAllocation: 'Portfolio Allocation',
            stocks: 'Stocks',
            bonds: 'Bonds',
            alternatives: 'Alternative Investments',
            info: 'Risk profile affects investment strategy and asset allocation'
        }
    };

    const t = content[language];

    // Risk level configurations
    const riskLevels = {
        conservative: {
            expectedReturn: 5.5,
            volatility: 8,
            allocation: { stocks: 30, bonds: 60, alternatives: 10 }
        },
        moderate: {
            expectedReturn: 7.0,
            volatility: 12,
            allocation: { stocks: 60, bonds: 30, alternatives: 10 }
        },
        aggressive: {
            expectedReturn: 9.0,
            volatility: 18,
            allocation: { stocks: 80, bonds: 10, alternatives: 10 }
        }
    };

    // Helper function to get risk level details
    const getRiskDetails = (riskLevel) => {
        return riskLevels[riskLevel] || riskLevels.moderate;
    };

    // Helper function to update risk profile
    const updateRiskProfile = (partner, field, value) => {
        const partnerKey = partner === 'main' ? '' : `${partner}`;
        const fieldKey = partnerKey ? `${partnerKey}${field.charAt(0).toUpperCase() + field.slice(1)}` : field;
        setInputs({...inputs, [fieldKey]: value});
    };

    return React.createElement('div', { className: "space-y-8" }, [
        // Main Risk Profile (if individual planning)
        inputs.planningType !== 'couple' && React.createElement('div', { key: 'main-risk-section' }, [
            React.createElement('h3', { 
                key: 'main-risk-title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '⚖️'),
                t.title
            ]),
            React.createElement('div', { 
                key: 'main-risk-grid',
                className: "grid grid-cols-1 md:grid-cols-3 gap-6" 
            }, [
                // Conservative
                React.createElement('div', {
                    key: 'conservative',
                    className: `p-6 rounded-xl border-2 cursor-pointer transition-all ${
                        inputs.riskLevel === 'conservative' 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 bg-white hover:border-green-300'
                    }`
                }, [
                    React.createElement('input', {
                        key: 'conservative-radio',
                        type: 'radio',
                        name: 'riskLevel',
                        value: 'conservative',
                        checked: inputs.riskLevel === 'conservative',
                        onChange: (e) => updateRiskProfile('main', 'riskLevel', e.target.value),
                        className: "mb-3"
                    }),
                    React.createElement('h4', { 
                        key: 'conservative-title',
                        className: "text-lg font-semibold text-green-700 mb-2" 
                    }, t.conservative),
                    React.createElement('p', { 
                        key: 'conservative-desc',
                        className: "text-sm text-gray-600 mb-3" 
                    }, t.conservativeDesc),
                    React.createElement('div', { key: 'conservative-stats', className: "text-xs space-y-1" }, [
                        React.createElement('div', { key: 'return' }, `Expected Return: 5.5%`),
                        React.createElement('div', { key: 'volatility' }, `Volatility: 8%`),
                        React.createElement('div', { key: 'allocation' }, `Stocks: 30% | Bonds: 60%`)
                    ])
                ]),
                
                // Moderate
                React.createElement('div', {
                    key: 'moderate',
                    className: `p-6 rounded-xl border-2 cursor-pointer transition-all ${
                        inputs.riskLevel === 'moderate' 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 bg-white hover:border-blue-300'
                    }`
                }, [
                    React.createElement('input', {
                        key: 'moderate-radio',
                        type: 'radio',
                        name: 'riskLevel',
                        value: 'moderate',
                        checked: inputs.riskLevel === 'moderate',
                        onChange: (e) => updateRiskProfile('main', 'riskLevel', e.target.value),
                        className: "mb-3"
                    }),
                    React.createElement('h4', { 
                        key: 'moderate-title',
                        className: "text-lg font-semibold text-blue-700 mb-2" 
                    }, t.moderate),
                    React.createElement('p', { 
                        key: 'moderate-desc',
                        className: "text-sm text-gray-600 mb-3" 
                    }, t.moderateDesc),
                    React.createElement('div', { key: 'moderate-stats', className: "text-xs space-y-1" }, [
                        React.createElement('div', { key: 'return' }, `Expected Return: 7.0%`),
                        React.createElement('div', { key: 'volatility' }, `Volatility: 12%`),
                        React.createElement('div', { key: 'allocation' }, `Stocks: 60% | Bonds: 30%`)
                    ])
                ]),
                
                // Aggressive
                React.createElement('div', {
                    key: 'aggressive',
                    className: `p-6 rounded-xl border-2 cursor-pointer transition-all ${
                        inputs.riskLevel === 'aggressive' 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-gray-200 bg-white hover:border-red-300'
                    }`
                }, [
                    React.createElement('input', {
                        key: 'aggressive-radio',
                        type: 'radio',
                        name: 'riskLevel',
                        value: 'aggressive',
                        checked: inputs.riskLevel === 'aggressive',
                        onChange: (e) => updateRiskProfile('main', 'riskLevel', e.target.value),
                        className: "mb-3"
                    }),
                    React.createElement('h4', { 
                        key: 'aggressive-title',
                        className: "text-lg font-semibold text-red-700 mb-2" 
                    }, t.aggressive),
                    React.createElement('p', { 
                        key: 'aggressive-desc',
                        className: "text-sm text-gray-600 mb-3" 
                    }, t.aggressiveDesc),
                    React.createElement('div', { key: 'aggressive-stats', className: "text-xs space-y-1" }, [
                        React.createElement('div', { key: 'return' }, `Expected Return: 9.0%`),
                        React.createElement('div', { key: 'volatility' }, `Volatility: 18%`),
                        React.createElement('div', { key: 'allocation' }, `Stocks: 80% | Bonds: 10%`)
                    ])
                ])
            ])
        ]),

        // Partner Risk Profiles (if couple planning)
        inputs.planningType === 'couple' && React.createElement('div', { key: 'partner-risk-section' }, [
            React.createElement('h3', { 
                key: 'partner-risk-title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '👫'),
                t.partnerRiskProfiles
            ]),
            React.createElement('div', { 
                key: 'partner-risk-grid',
                className: "grid grid-cols-1 lg:grid-cols-2 gap-8" 
            }, [
                // Partner 1 Risk Profile
                React.createElement('div', { 
                    key: 'partner1-risk',
                    className: "bg-pink-50 rounded-xl p-6 border border-pink-200" 
                }, [
                    React.createElement('h4', { 
                        key: 'partner1-risk-title',
                        className: "text-lg font-semibold text-pink-700 mb-4" 
                    }, inputs.partner1Name || t.partner1Risk),
                    
                    React.createElement('div', { key: 'partner1-risk-options', className: "space-y-3" }, [
                        // Conservative Option
                        React.createElement('label', {
                            key: 'p1-conservative',
                            className: `flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                                inputs.partner1RiskLevel === 'conservative' 
                                    ? 'border-green-500 bg-green-50' 
                                    : 'border-gray-200 bg-white hover:border-green-300'
                            }`
                        }, [
                            React.createElement('input', {
                                key: 'p1-conservative-radio',
                                type: 'radio',
                                name: 'partner1RiskLevel',
                                value: 'conservative',
                                checked: inputs.partner1RiskLevel === 'conservative',
                                onChange: (e) => updateRiskProfile('partner1', 'riskLevel', e.target.value),
                                className: "mr-3"
                            }),
                            React.createElement('div', { key: 'p1-conservative-content' }, [
                                React.createElement('div', { 
                                    key: 'p1-conservative-name',
                                    className: "font-medium text-green-700" 
                                }, t.conservative),
                                React.createElement('div', { 
                                    key: 'p1-conservative-desc',
                                    className: "text-xs text-gray-600" 
                                }, `Expected: 5.5% | Risk: Low`)
                            ])
                        ]),
                        
                        // Moderate Option
                        React.createElement('label', {
                            key: 'p1-moderate',
                            className: `flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                                inputs.partner1RiskLevel === 'moderate' 
                                    ? 'border-blue-500 bg-blue-50' 
                                    : 'border-gray-200 bg-white hover:border-blue-300'
                            }`
                        }, [
                            React.createElement('input', {
                                key: 'p1-moderate-radio',
                                type: 'radio',
                                name: 'partner1RiskLevel',
                                value: 'moderate',
                                checked: inputs.partner1RiskLevel === 'moderate',
                                onChange: (e) => updateRiskProfile('partner1', 'riskLevel', e.target.value),
                                className: "mr-3"
                            }),
                            React.createElement('div', { key: 'p1-moderate-content' }, [
                                React.createElement('div', { 
                                    key: 'p1-moderate-name',
                                    className: "font-medium text-blue-700" 
                                }, t.moderate),
                                React.createElement('div', { 
                                    key: 'p1-moderate-desc',
                                    className: "text-xs text-gray-600" 
                                }, `Expected: 7.0% | Risk: Medium`)
                            ])
                        ]),
                        
                        // Aggressive Option
                        React.createElement('label', {
                            key: 'p1-aggressive',
                            className: `flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                                inputs.partner1RiskLevel === 'aggressive' 
                                    ? 'border-red-500 bg-red-50' 
                                    : 'border-gray-200 bg-white hover:border-red-300'
                            }`
                        }, [
                            React.createElement('input', {
                                key: 'p1-aggressive-radio',
                                type: 'radio',
                                name: 'partner1RiskLevel',
                                value: 'aggressive',
                                checked: inputs.partner1RiskLevel === 'aggressive',
                                onChange: (e) => updateRiskProfile('partner1', 'riskLevel', e.target.value),
                                className: "mr-3"
                            }),
                            React.createElement('div', { key: 'p1-aggressive-content' }, [
                                React.createElement('div', { 
                                    key: 'p1-aggressive-name',
                                    className: "font-medium text-red-700" 
                                }, t.aggressive),
                                React.createElement('div', { 
                                    key: 'p1-aggressive-desc',
                                    className: "text-xs text-gray-600" 
                                }, `Expected: 9.0% | Risk: High`)
                            ])
                        ])
                    ])
                ]),
                
                // Partner 2 Risk Profile
                React.createElement('div', { 
                    key: 'partner2-risk',
                    className: "bg-purple-50 rounded-xl p-6 border border-purple-200" 
                }, [
                    React.createElement('h4', { 
                        key: 'partner2-risk-title',
                        className: "text-lg font-semibold text-purple-700 mb-4" 
                    }, inputs.partner2Name || t.partner2Risk),
                    
                    React.createElement('div', { key: 'partner2-risk-options', className: "space-y-3" }, [
                        // Conservative Option
                        React.createElement('label', {
                            key: 'p2-conservative',
                            className: `flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                                inputs.partner2RiskLevel === 'conservative' 
                                    ? 'border-green-500 bg-green-50' 
                                    : 'border-gray-200 bg-white hover:border-green-300'
                            }`
                        }, [
                            React.createElement('input', {
                                key: 'p2-conservative-radio',
                                type: 'radio',
                                name: 'partner2RiskLevel',
                                value: 'conservative',
                                checked: inputs.partner2RiskLevel === 'conservative',
                                onChange: (e) => updateRiskProfile('partner2', 'riskLevel', e.target.value),
                                className: "mr-3"
                            }),
                            React.createElement('div', { key: 'p2-conservative-content' }, [
                                React.createElement('div', { 
                                    key: 'p2-conservative-name',
                                    className: "font-medium text-green-700" 
                                }, t.conservative),
                                React.createElement('div', { 
                                    key: 'p2-conservative-desc',
                                    className: "text-xs text-gray-600" 
                                }, `Expected: 5.5% | Risk: Low`)
                            ])
                        ]),
                        
                        // Moderate Option
                        React.createElement('label', {
                            key: 'p2-moderate',
                            className: `flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                                inputs.partner2RiskLevel === 'moderate' 
                                    ? 'border-blue-500 bg-blue-50' 
                                    : 'border-gray-200 bg-white hover:border-blue-300'
                            }`
                        }, [
                            React.createElement('input', {
                                key: 'p2-moderate-radio',
                                type: 'radio',
                                name: 'partner2RiskLevel',
                                value: 'moderate',
                                checked: inputs.partner2RiskLevel === 'moderate',
                                onChange: (e) => updateRiskProfile('partner2', 'riskLevel', e.target.value),
                                className: "mr-3"
                            }),
                            React.createElement('div', { key: 'p2-moderate-content' }, [
                                React.createElement('div', { 
                                    key: 'p2-moderate-name',
                                    className: "font-medium text-blue-700" 
                                }, t.moderate),
                                React.createElement('div', { 
                                    key: 'p2-moderate-desc',
                                    className: "text-xs text-gray-600" 
                                }, `Expected: 7.0% | Risk: Medium`)
                            ])
                        ]),
                        
                        // Aggressive Option
                        React.createElement('label', {
                            key: 'p2-aggressive',
                            className: `flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                                inputs.partner2RiskLevel === 'aggressive' 
                                    ? 'border-red-500 bg-red-50' 
                                    : 'border-gray-200 bg-white hover:border-red-300'
                            }`
                        }, [
                            React.createElement('input', {
                                key: 'p2-aggressive-radio',
                                type: 'radio',
                                name: 'partner2RiskLevel',
                                value: 'aggressive',
                                checked: inputs.partner2RiskLevel === 'aggressive',
                                onChange: (e) => updateRiskProfile('partner2', 'riskLevel', e.target.value),
                                className: "mr-3"
                            }),
                            React.createElement('div', { key: 'p2-aggressive-content' }, [
                                React.createElement('div', { 
                                    key: 'p2-aggressive-name',
                                    className: "font-medium text-red-700" 
                                }, t.aggressive),
                                React.createElement('div', { 
                                    key: 'p2-aggressive-desc',
                                    className: "text-xs text-gray-600" 
                                }, `Expected: 9.0% | Risk: High`)
                            ])
                        ])
                    ])
                ])
            ])
        ]),

        // Investment Preferences Section
        React.createElement('div', { key: 'investment-preferences-section' }, [
            React.createElement('h3', { 
                key: 'preferences-title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '🎯'),
                t.investmentPreferences
            ]),
            React.createElement('div', { 
                key: 'preferences-grid',
                className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4" 
            }, [
                // Local Markets
                React.createElement('label', {
                    key: 'local-markets',
                    className: "flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300"
                }, [
                    React.createElement('input', {
                        key: 'local-checkbox',
                        type: 'checkbox',
                        checked: inputs.investmentPreferences?.localMarkets || false,
                        onChange: (e) => setInputs({
                            ...inputs, 
                            investmentPreferences: {
                                ...inputs.investmentPreferences,
                                localMarkets: e.target.checked
                            }
                        }),
                        className: "mr-2"
                    }),
                    React.createElement('span', { key: 'local-text', className: "text-sm" }, t.localMarkets)
                ]),
                
                // International Markets
                React.createElement('label', {
                    key: 'international-markets',
                    className: "flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300"
                }, [
                    React.createElement('input', {
                        key: 'international-checkbox',
                        type: 'checkbox',
                        checked: inputs.investmentPreferences?.internationalMarkets || false,
                        onChange: (e) => setInputs({
                            ...inputs, 
                            investmentPreferences: {
                                ...inputs.investmentPreferences,
                                internationalMarkets: e.target.checked
                            }
                        }),
                        className: "mr-2"
                    }),
                    React.createElement('span', { key: 'international-text', className: "text-sm" }, t.internationalMarkets)
                ]),
                
                // Real Estate
                React.createElement('label', {
                    key: 'real-estate',
                    className: "flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300"
                }, [
                    React.createElement('input', {
                        key: 'realestate-checkbox',
                        type: 'checkbox',
                        checked: inputs.investmentPreferences?.realEstate || false,
                        onChange: (e) => setInputs({
                            ...inputs, 
                            investmentPreferences: {
                                ...inputs.investmentPreferences,
                                realEstate: e.target.checked
                            }
                        }),
                        className: "mr-2"
                    }),
                    React.createElement('span', { key: 'realestate-text', className: "text-sm" }, t.realEstate)
                ]),
                
                // Commodities
                React.createElement('label', {
                    key: 'commodities',
                    className: "flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300"
                }, [
                    React.createElement('input', {
                        key: 'commodities-checkbox',
                        type: 'checkbox',
                        checked: inputs.investmentPreferences?.commodities || false,
                        onChange: (e) => setInputs({
                            ...inputs, 
                            investmentPreferences: {
                                ...inputs.investmentPreferences,
                                commodities: e.target.checked
                            }
                        }),
                        className: "mr-2"
                    }),
                    React.createElement('span', { key: 'commodities-text', className: "text-sm" }, t.commodities)
                ]),
                
                // Cryptocurrency
                React.createElement('label', {
                    key: 'cryptocurrency',
                    className: "flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300"
                }, [
                    React.createElement('input', {
                        key: 'crypto-checkbox',
                        type: 'checkbox',
                        checked: inputs.investmentPreferences?.cryptocurrency || false,
                        onChange: (e) => setInputs({
                            ...inputs, 
                            investmentPreferences: {
                                ...inputs.investmentPreferences,
                                cryptocurrency: e.target.checked
                            }
                        }),
                        className: "mr-2"
                    }),
                    React.createElement('span', { key: 'crypto-text', className: "text-sm" }, t.cryptocurrency)
                ])
            ])
        ]),

        // Time Horizon Section
        React.createElement('div', { key: 'time-horizon-section' }, [
            React.createElement('h3', { 
                key: 'horizon-title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '⏰'),
                t.timeHorizon
            ]),
            React.createElement('div', { 
                key: 'horizon-grid',
                className: "grid grid-cols-1 md:grid-cols-3 gap-4" 
            }, [
                // Short Term
                React.createElement('label', {
                    key: 'short-term',
                    className: `p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        inputs.timeHorizon === 'short' 
                            ? 'border-orange-500 bg-orange-50' 
                            : 'border-gray-200 bg-white hover:border-orange-300'
                    }`
                }, [
                    React.createElement('input', {
                        key: 'short-radio',
                        type: 'radio',
                        name: 'timeHorizon',
                        value: 'short',
                        checked: inputs.timeHorizon === 'short',
                        onChange: (e) => setInputs({...inputs, timeHorizon: e.target.value}),
                        className: "mb-2"
                    }),
                    React.createElement('div', { 
                        key: 'short-label',
                        className: "font-medium text-orange-700" 
                    }, t.shortTerm)
                ]),
                
                // Medium Term
                React.createElement('label', {
                    key: 'medium-term',
                    className: `p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        inputs.timeHorizon === 'medium' 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 bg-white hover:border-blue-300'
                    }`
                }, [
                    React.createElement('input', {
                        key: 'medium-radio',
                        type: 'radio',
                        name: 'timeHorizon',
                        value: 'medium',
                        checked: inputs.timeHorizon === 'medium',
                        onChange: (e) => setInputs({...inputs, timeHorizon: e.target.value}),
                        className: "mb-2"
                    }),
                    React.createElement('div', { 
                        key: 'medium-label',
                        className: "font-medium text-blue-700" 
                    }, t.mediumTerm)
                ]),
                
                // Long Term
                React.createElement('label', {
                    key: 'long-term',
                    className: `p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        inputs.timeHorizon === 'long' 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 bg-white hover:border-green-300'
                    }`
                }, [
                    React.createElement('input', {
                        key: 'long-radio',
                        type: 'radio',
                        name: 'timeHorizon',
                        value: 'long',
                        checked: inputs.timeHorizon === 'long',
                        onChange: (e) => setInputs({...inputs, timeHorizon: e.target.value}),
                        className: "mb-2"
                    }),
                    React.createElement('div', { 
                        key: 'long-label',
                        className: "font-medium text-green-700" 
                    }, t.longTerm)
                ])
            ])
        ]),

        // Info Panel
        React.createElement('div', { 
            key: 'info',
            className: "bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200" 
        }, [
            React.createElement('div', { key: 'info-icon', className: "text-2xl mb-2" }, 'ℹ️'),
            React.createElement('h4', { 
                key: 'info-title',
                className: "text-lg font-semibold text-blue-700 mb-2" 
            }, language === 'he' ? 'מידע חשוב' : 'Important Information'),
            React.createElement('p', { 
                key: 'info-text',
                className: "text-blue-700 text-sm" 
            }, t.info)
        ])
    ]);
};

window.WizardStepRiskProfile = WizardStepRiskProfile;
console.log('✅ WizardStepRiskProfile component loaded successfully');