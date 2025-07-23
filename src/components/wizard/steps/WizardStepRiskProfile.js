// WizardStepRiskProfile.js - Step 5: Risk Profile Management
// Per-partner risk assessment and investment strategy preferences

const WizardStepRiskProfile = ({ inputs, setInputs, language = 'en' }) => {
    // Add slider styling CSS if not already present
    React.useEffect(() => {
        if (!document.getElementById('risk-slider-styles')) {
            const style = document.createElement('style');
            style.id = 'risk-slider-styles';
            style.textContent = `
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    height: 24px;
                    width: 24px;
                    border-radius: 50%;
                    background: #ffffff;
                    border: 3px solid #4f46e5;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    transition: all 0.2s ease;
                }
                .slider::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                }
                .slider::-moz-range-thumb {
                    height: 24px;
                    width: 24px;
                    border-radius: 50%;
                    background: #ffffff;
                    border: 3px solid #4f46e5;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    transition: all 0.2s ease;
                }
            `;
            document.head.appendChild(style);
        }
    }, []);

    const content = {
        he: {
            title: 'פרופיל סיכון והשקעות',
            subtitle: 'הגדרת רמת הסיכון והעדפות השקעה לכל בן זוג',
            riskLevels: 'רמות סיכון',
            riskSlider: 'רמת סיכון (0% - 20%)',
            riskSliderDescription: 'הזז את המחוון כדי להגדיר את רמת הסיכון המועדפת עליך',
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
            riskSlider: 'Risk Level (0% - 20%)',
            riskSliderDescription: 'Move the slider to set your preferred risk level',
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

    // Funny risk indicators for slider
    const getRiskIndicator = (riskLevel) => {
        if (riskLevel <= 3) return '😴 "Playing it safer than my grandmother\'s savings account"';
        if (riskLevel <= 6) return '🛡️ "Conservative like wearing a helmet to check the mail"';
        if (riskLevel <= 9) return '🚶 "Cautious like crossing the street twice"';
        if (riskLevel <= 12) return '🎯 "Balanced like a yoga instructor on coffee"';
        if (riskLevel <= 15) return '🎢 "Moderate thrills - like a kiddie rollercoaster"';
        if (riskLevel <= 18) return '🚀 "Adventurous like ordering the mystery dish"';
        return '🔥 "YOLO mode - like day trading with coffee money"';
    };

    // Convert percentage to risk level name
    const getRiskLevelName = (riskLevel) => {
        if (riskLevel <= 7) return 'conservative';
        if (riskLevel <= 14) return 'moderate';
        return 'aggressive';
    };

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

    // Helper function to update risk slider
    const updateRiskSlider = (partner, percentage) => {
        const riskLevelName = getRiskLevelName(percentage);
        const partnerKey = partner === 'main' ? '' : `${partner}`;
        const sliderKey = partnerKey ? `${partnerKey}RiskSlider` : 'riskSlider';
        const levelKey = partnerKey ? `${partnerKey}RiskLevel` : 'riskLevel';
        
        setInputs({
            ...inputs, 
            [sliderKey]: percentage,
            [levelKey]: riskLevelName
        });
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
            
            // Risk Slider Section
            React.createElement('div', { 
                key: 'main-risk-slider',
                className: "bg-gradient-to-r from-green-50 via-yellow-50 to-red-50 rounded-xl p-6 border border-gray-200 mb-6" 
            }, [
                React.createElement('h4', { 
                    key: 'slider-title',
                    className: "text-lg font-semibold text-gray-700 mb-4" 
                }, t.riskSlider),
                React.createElement('p', { 
                    key: 'slider-description',
                    className: "text-sm text-gray-600 mb-4" 
                }, t.riskSliderDescription),
                
                React.createElement('div', { key: 'slider-container', className: "space-y-4" }, [
                    React.createElement('input', {
                        key: 'risk-slider',
                        type: 'range',
                        min: '0',
                        max: '20',
                        step: '1',
                        value: inputs.riskSlider || 10,
                        onChange: (e) => updateRiskSlider('main', parseInt(e.target.value)),
                        className: "w-full h-3 bg-gradient-to-r from-green-300 via-yellow-300 to-red-300 rounded-lg appearance-none cursor-pointer slider"
                    }),
                    
                    React.createElement('div', { key: 'slider-labels', className: "flex justify-between text-xs text-gray-500" }, [
                        React.createElement('span', { key: 'min-label' }, '0% (Ultra Safe)'),
                        React.createElement('span', { key: 'mid-label' }, '10% (Balanced)'),
                        React.createElement('span', { key: 'max-label' }, '20% (High Risk)')
                    ]),
                    
                    React.createElement('div', { 
                        key: 'current-risk',
                        className: "text-center p-4 bg-white rounded-lg border border-gray-200" 
                    }, [
                        React.createElement('div', { 
                            key: 'risk-percentage',
                            className: "text-2xl font-bold text-blue-600 mb-2" 
                        }, `${inputs.riskSlider || 10}%`),
                        React.createElement('div', { 
                            key: 'risk-indicator',
                            className: "text-sm text-gray-600" 
                        }, getRiskIndicator(inputs.riskSlider || 10))
                    ])
                ])
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
                    
                    // Partner 1 Risk Slider
                    React.createElement('div', { 
                        key: 'partner1-risk-slider',
                        className: "bg-gradient-to-r from-green-50 via-yellow-50 to-red-50 rounded-lg p-4 border border-gray-200 mb-4" 
                    }, [
                        React.createElement('h5', { 
                            key: 'p1-slider-title',
                            className: "text-sm font-semibold text-gray-700 mb-2" 
                        }, t.riskSlider),
                        
                        React.createElement('div', { key: 'p1-slider-container', className: "space-y-3" }, [
                            React.createElement('input', {
                                key: 'p1-risk-slider',
                                type: 'range',
                                min: '0',
                                max: '20',
                                step: '1',
                                value: inputs.partner1RiskSlider || 10,
                                onChange: (e) => updateRiskSlider('partner1', parseInt(e.target.value)),
                                className: "w-full h-2 bg-gradient-to-r from-green-300 via-yellow-300 to-red-300 rounded-lg appearance-none cursor-pointer"
                            }),
                            
                            React.createElement('div', { key: 'p1-slider-labels', className: "flex justify-between text-xs text-gray-500" }, [
                                React.createElement('span', { key: 'p1-min' }, '0%'),
                                React.createElement('span', { key: 'p1-mid' }, '10%'),
                                React.createElement('span', { key: 'p1-max' }, '20%')
                            ]),
                            
                            React.createElement('div', { 
                                key: 'p1-current-risk',
                                className: "text-center p-3 bg-white rounded-lg border border-gray-200" 
                            }, [
                                React.createElement('div', { 
                                    key: 'p1-risk-percentage',
                                    className: "text-lg font-bold text-pink-600 mb-1" 
                                }, `${inputs.partner1RiskSlider || 10}%`),
                                React.createElement('div', { 
                                    key: 'p1-risk-indicator',
                                    className: "text-xs text-gray-600" 
                                }, getRiskIndicator(inputs.partner1RiskSlider || 10))
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
                    
                    // Partner 2 Risk Slider
                    React.createElement('div', { 
                        key: 'partner2-risk-slider',
                        className: "bg-gradient-to-r from-green-50 via-yellow-50 to-red-50 rounded-lg p-4 border border-gray-200 mb-4" 
                    }, [
                        React.createElement('h5', { 
                            key: 'p2-slider-title',
                            className: "text-sm font-semibold text-gray-700 mb-2" 
                        }, t.riskSlider),
                        
                        React.createElement('div', { key: 'p2-slider-container', className: "space-y-3" }, [
                            React.createElement('input', {
                                key: 'p2-risk-slider',
                                type: 'range',
                                min: '0',
                                max: '20',
                                step: '1',
                                value: inputs.partner2RiskSlider || 10,
                                onChange: (e) => updateRiskSlider('partner2', parseInt(e.target.value)),
                                className: "w-full h-2 bg-gradient-to-r from-green-300 via-yellow-300 to-red-300 rounded-lg appearance-none cursor-pointer"
                            }),
                            
                            React.createElement('div', { key: 'p2-slider-labels', className: "flex justify-between text-xs text-gray-500" }, [
                                React.createElement('span', { key: 'p2-min' }, '0%'),
                                React.createElement('span', { key: 'p2-mid' }, '10%'),
                                React.createElement('span', { key: 'p2-max' }, '20%')
                            ]),
                            
                            React.createElement('div', { 
                                key: 'p2-current-risk',
                                className: "text-center p-3 bg-white rounded-lg border border-gray-200" 
                            }, [
                                React.createElement('div', { 
                                    key: 'p2-risk-percentage',
                                    className: "text-lg font-bold text-purple-600 mb-1" 
                                }, `${inputs.partner2RiskSlider || 10}%`),
                                React.createElement('div', { 
                                    key: 'p2-risk-indicator',
                                    className: "text-xs text-gray-600" 
                                }, getRiskIndicator(inputs.partner2RiskSlider || 10))
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