// WizardStepTaxes.js - Step 7: Tax Planning & Optimization
// Country-specific tax optimization strategies for retirement planning

const WizardStepTaxes = ({ inputs, setInputs, language = 'en', workingCurrency = 'ILS' }) => {
    const createElement = React.createElement;
    
    // Multi-language content with tax-specific terms
    const content = {
        he: {
            title: 'תכנון מיסוי ואופטימיזציה',
            subtitle: 'אסטרטגיות אופטימיזציה מיסויית לפי מדינה ותכנון פרישה',
            countrySelect: 'מדינה לתכנון מיסוי',
            
            // Tax optimization areas
            contributionOptimization: 'אופטימיזציית הפקדות',
            withdrawalStrategies: 'אסטרטגיות משיכה',
            internationalTax: 'מיסוי בינלאומי',
            
            // Israeli tax features
            israeliTaxBenefits: 'הטבות מס ישראליות',
            trainingFundBenefits: 'הטבות קרן השתלמות',
            pensionDeductions: 'ניכויים בפנסיה',
            capitalGainsExemption: 'פטור מס רווחי הון',
            
            // UK tax features
            ukIsaPensions: 'ISA מול פנסיה',
            ukBasicHigherRate: 'מס בסיסי מול גבוה',
            ukPensionRelief: 'הקלות מס פנסיה',
            ukInheritanceTax: 'מס ירושה בריטי',
            
            // US tax features
            us401kRoth: '401(k) מול Roth IRA',
            usRmdPlanning: 'תכנון משיכות חובה',
            usTaxDeferral: 'דחיית מס',
            usStateConsiderations: 'שיקולי מדינה',
            
            // EU tax features
            euPillar2Pillar3: 'עמוד 2 מול עמוד 3',
            euCrossBorderTax: 'מיסוי חוצה גבולות',
            euDirectives: 'הנחיות האיחוד',
            
            // Tax strategies
            taxEfficiencyScore: 'ציון יעילות מס',
            currentTaxRate: 'שיעור מס נוכחי',
            retirementTaxRate: 'שיעור מס בפרישה',
            taxSavingsOpportunity: 'הזדמנות לחיסכון במס',
            
            // Optimization recommendations
            immediateActions: 'פעולות מיידיות',
            shortTermStrategy: 'אסטרטגיה קצרת טווח',
            longTermPlanning: 'תכנון ארוך טווח',
            professionalAdvice: 'ייעוץ מקצועי',
            
            // Tax-deferred vs tax-free
            taxDeferredContributions: 'הפקדות דחיית מס',
            taxFreeContributions: 'הפקדות פטורות מס',
            taxDeferredWithdrawals: 'משיכות דחיית מס',
            taxFreeWithdrawals: 'משיכות פטורות מס',
            
            // Forms and calculations
            estimatedTaxSavings: 'חיסכון מס משוער',
            marginalTaxRate: 'שיעור מס שולי',
            effectiveTaxRate: 'שיעור מס אפקטיבי',
            taxCredit: 'זיכוי מס',
            taxDeduction: 'ניכוי מס',
            
            info: 'תכנון מס יעיל יכול לחסוך אלפי שקלים בשנה ולהגדיל משמעותית את חיסכוני הפרישה'
        },
        en: {
            title: 'Tax Planning & Optimization',
            subtitle: 'Country-specific tax optimization strategies for retirement planning',
            countrySelect: 'Country for Tax Planning',
            
            // Tax optimization areas
            contributionOptimization: 'Contribution Optimization',
            withdrawalStrategies: 'Withdrawal Strategies',
            internationalTax: 'International Tax',
            
            // Israeli tax features
            israeliTaxBenefits: 'Israeli Tax Benefits',
            trainingFundBenefits: 'Training Fund Benefits',
            pensionDeductions: 'Pension Deductions',
            capitalGainsExemption: 'Capital Gains Exemption',
            
            // UK tax features
            ukIsaPensions: 'ISA vs Pensions',
            ukBasicHigherRate: 'Basic vs Higher Rate Tax',
            ukPensionRelief: 'Pension Tax Relief',
            ukInheritanceTax: 'UK Inheritance Tax',
            
            // US tax features
            us401kRoth: '401(k) vs Roth IRA',
            usRmdPlanning: 'RMD Planning',
            usTaxDeferral: 'Tax Deferral',
            usStateConsiderations: 'State Tax Considerations',
            
            // EU tax features
            euPillar2Pillar3: 'Pillar 2 vs Pillar 3',
            euCrossBorderTax: 'Cross-Border Taxation',
            euDirectives: 'EU Directives',
            
            // Tax strategies
            taxEfficiencyScore: 'Tax Efficiency Score',
            currentTaxRate: 'Current Tax Rate',
            retirementTaxRate: 'Retirement Tax Rate',
            taxSavingsOpportunity: 'Tax Savings Opportunity',
            
            // Optimization recommendations
            immediateActions: 'Immediate Actions',
            shortTermStrategy: 'Short-Term Strategy',
            longTermPlanning: 'Long-Term Planning',
            professionalAdvice: 'Professional Advice',
            
            // Tax-deferred vs tax-free
            taxDeferredContributions: 'Tax-Deferred Contributions',
            taxFreeContributions: 'Tax-Free Contributions',
            taxDeferredWithdrawals: 'Tax-Deferred Withdrawals',
            taxFreeWithdrawals: 'Tax-Free Withdrawals',
            
            // Forms and calculations
            estimatedTaxSavings: 'Estimated Tax Savings',
            marginalTaxRate: 'Marginal Tax Rate',
            effectiveTaxRate: 'Effective Tax Rate',
            taxCredit: 'Tax Credit',
            taxDeduction: 'Tax Deduction',
            
            info: 'Effective tax planning can save thousands per year and significantly increase retirement savings'
        }
    };

    const t = content[language];

    // Country-specific tax rules and strategies
    const taxRules = {
        israel: {
            currency: '₪',
            marginalTaxRates: [0.1, 0.14, 0.2, 0.31, 0.35, 0.47, 0.5], // 2025 rates
            taxBrackets: [0, 81480, 116760, 188280, 269280, 558240, 718440],
            pensionDeductionLimit: 0.07, // 7% of income
            trainingFundDeductionLimit: 15792, // Monthly threshold
            capitalGainsExemption: true,
            israeliTaxRates: {
                basic: 0.1,
                medium: 0.31,
                high: 0.47,
                maximum: 0.5
            },
            features: [
                t.trainingFundBenefits,
                t.pensionDeductions,
                t.capitalGainsExemption
            ],
            strategies: [
                'Maximize training fund contributions up to ₪15,792/month',
                'Use pension tax deductions up to 7% of income',
                'Consider Keren Hishtalmut for tax-deferred growth',
                'Plan withdrawals to minimize tax brackets'
            ]
        },
        uk: {
            currency: '£',
            marginalTaxRates: [0, 0.2, 0.4, 0.45], // Basic, Higher, Additional
            taxBrackets: [0, 12570, 50270, 125140],
            pensionAnnualAllowance: 60000, // £60k per year
            isaAllowance: 20000, // £20k per year
            lifetimeAllowance: 1073100, // £1.073M
            ukTaxRates: {
                basic: 0.2,
                higher: 0.4,
                additional: 0.45
            },
            features: [
                t.ukIsaPensions,
                t.ukBasicHigherRate,
                t.ukPensionRelief,
                t.ukInheritanceTax
            ],
            strategies: [
                'Maximize pension contributions for tax relief',
                'Use ISA allowance for tax-free growth',
                'Consider salary sacrifice schemes',
                'Plan pension withdrawals with 25% tax-free lump sum'
            ]
        },
        us: {
            currency: '$',
            marginalTaxRates: [0, 0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37],
            taxBrackets: [0, 11000, 44725, 95375, 182050, 231250, 578125, 693750], // Single filer 2024
            standard401kLimit: 23000, // 2024 limit
            catchUpContribution: 7500, // Age 50+
            rothIraIncomeLimit: 153000, // Phase-out starts
            usTaxRates: {
                federal: 0.22,
                state: 0.05,
                combined: 0.27
            },
            features: [
                t.us401kRoth,
                t.usRmdPlanning,
                t.usTaxDeferral,
                t.usStateConsiderations
            ],
            strategies: [
                'Maximize 401(k) contributions for tax deferral',
                'Consider Roth conversions in low-income years',
                'Plan for Required Minimum Distributions at 73',
                'Use tax-loss harvesting in taxable accounts'
            ]
        },
        eu: {
            currency: '€',
            marginalTaxRates: [0.2, 0.3, 0.4, 0.5], // Varies by country
            features: [
                t.euPillar2Pillar3,
                t.euCrossBorderTax,
                t.euDirectives
            ],
            strategies: [
                'Maximize Pillar 2 contributions for tax benefits',
                'Consider Pillar 3 for additional tax advantages',
                'Plan for cross-border tax implications',
                'Use EU pension portability directives'
            ]
        }
    };

    const selectedCountry = inputs.taxCountry || 'israel';
    const rules = taxRules[selectedCountry] || taxRules.israel;

    // Tax calculation functions
    const calculateMarginalTaxRate = (income) => {
        if (!rules.taxBrackets) return 0.2; // Default 20%
        
        for (let i = rules.taxBrackets.length - 1; i >= 0; i--) {
            if (income > rules.taxBrackets[i]) {
                return rules.marginalTaxRates[i] || 0.2;
            }
        }
        return rules.marginalTaxRates[0] || 0;
    };

    const calculateEffectiveTaxRate = (income) => {
        if (!rules.taxBrackets) return 0.15; // Default 15%
        
        let totalTax = 0;
        let remainingIncome = income;
        
        for (let i = 1; i < rules.taxBrackets.length && remainingIncome > 0; i++) {
            const bracketMin = rules.taxBrackets[i - 1];
            const bracketMax = rules.taxBrackets[i];
            const taxableInBracket = Math.min(remainingIncome, bracketMax - bracketMin);
            const rate = rules.marginalTaxRates[i - 1] || 0;
            
            totalTax += taxableInBracket * rate;
            remainingIncome -= taxableInBracket;
        }
        
        // Handle top bracket
        if (remainingIncome > 0) {
            const topRate = rules.marginalTaxRates[rules.marginalTaxRates.length - 1] || 0.2;
            totalTax += remainingIncome * topRate;
        }
        
        return income > 0 ? totalTax / income : 0;
    };

    const calculateTaxSavings = (contribution, marginalRate) => {
        return contribution * marginalRate;
    };

    const calculateTaxEfficiency = () => {
        const currentIncome = parseFloat(inputs.currentMonthlySalary || 0) * 12;
        const pensionContribution = parseFloat(inputs.pensionContributionRate || 0) / 100 * currentIncome;
        const trainingFundContribution = parseFloat(inputs.trainingFundContributionRate || 0) / 100 * currentIncome;
        
        const marginalRate = calculateMarginalTaxRate(currentIncome);
        const effectiveRate = calculateEffectiveTaxRate(currentIncome);
        const pensionSavings = calculateTaxSavings(pensionContribution, marginalRate);
        const trainingFundSavings = calculateTaxSavings(trainingFundContribution, marginalRate);
        
        const totalSavings = pensionSavings + trainingFundSavings;
        const maxPossibleSavings = currentIncome * 0.15; // Assume 15% max tax-efficient contribution
        
        return Math.min(100, (totalSavings / maxPossibleSavings) * 100);
    };

    const calculateTaxEfficiencyScore = calculateTaxEfficiency;

    // Optimize tax contributions based on country-specific rules
    const calculateOptimal = (type) => {
        const currentIncome = parseFloat(inputs.currentMonthlySalary || 0) * 12;
        const marginalRate = calculateMarginalTaxRate(currentIncome);
        
        if (type === 'pension') {
            // Calculate optimal pension contribution rate
            if (selectedCountry === 'israel') {
                return Math.min(7.0, marginalRate * 100); // Israeli pension deduction limit
            } else if (selectedCountry === 'uk') {
                return Math.min(40.0, marginalRate * 100); // UK pension relief
            } else if (selectedCountry === 'us') {
                return Math.min(22.5, marginalRate * 100); // US 401k limit percentage
            }
            return 17.5; // Default
        } else if (type === 'training') {
            // Calculate optimal training fund contribution rate
            if (selectedCountry === 'israel') {
                const monthlyThreshold = 15792;
                const monthlyIncome = currentIncome / 12;
                return Math.min(7.5, (monthlyThreshold / monthlyIncome) * 100);
            }
            return 7.5; // Default
        }
        return 0;
    };

    const optimizeTax = () => {
        const optimalPensionRate = calculateOptimal('pension');
        const optimalTrainingFundRate = calculateOptimal('training');
        
        setInputs(prev => ({
            ...prev,
            optimizedPensionRate: optimalPensionRate,
            optimizedTrainingFundRate: optimalTrainingFundRate,
            taxEfficiencyScore: calculateTaxEfficiencyScore()
        }));
    };

    // Render country-specific tax information
    const renderCountryTaxInfo = () => {
        return createElement('div', {
            key: 'country-tax-info',
            className: "bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 mb-8"
        }, [
            createElement('div', { key: 'tax-header', className: "flex items-center mb-4" }, [
                createElement('span', { key: 'flag', className: "mr-3 text-2xl" }, 
                    selectedCountry === 'israel' ? '🇮🇱' : 
                    selectedCountry === 'uk' ? '🇬🇧' :
                    selectedCountry === 'us' ? '🇺🇸' : '🇪🇺'
                ),
                createElement('h4', {
                    key: 'country-title',
                    className: "text-lg font-semibold text-green-700"
                }, `${selectedCountry.charAt(0).toUpperCase() + selectedCountry.slice(1)} Tax Optimization`)
            ]),
            createElement('div', { key: 'features-list', className: "space-y-2" }, 
                rules.features.map((feature, index) => 
                    createElement('div', {
                        key: `tax-feature-${index}`,
                        className: "flex items-center text-green-600 text-sm"
                    }, [
                        createElement('span', { key: 'check', className: "mr-2" }, '✓'),
                        createElement('span', { key: 'text' }, feature)
                    ])
                )
            )
        ]);
    };

    // Render tax efficiency dashboard
    const renderTaxEfficiencyDashboard = () => {
        const currentIncome = parseFloat(inputs.currentMonthlySalary || 0) * 12;
        const marginalRate = calculateMarginalTaxRate(currentIncome);
        const effectiveRate = calculateEffectiveTaxRate(currentIncome);
        const efficiencyScore = calculateTaxEfficiencyScore();
        
        return createElement('div', {
            key: 'tax-efficiency-dashboard',
            className: "bg-white rounded-xl p-6 border border-gray-200 mb-8"
        }, [
            createElement('h3', {
                key: 'dashboard-title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '📊'),
                t.taxEfficiencyScore
            ]),
            
            createElement('div', { key: 'efficiency-grid', className: "grid grid-cols-1 md:grid-cols-4 gap-6" }, [
                // Tax Efficiency Score
                createElement('div', {
                    key: 'efficiency-score',
                    className: `bg-${efficiencyScore >= 80 ? 'green' : efficiencyScore >= 60 ? 'yellow' : 'red'}-50 rounded-lg p-4 border border-${efficiencyScore >= 80 ? 'green' : efficiencyScore >= 60 ? 'yellow' : 'red'}-200`
                }, [
                    createElement('div', {
                        key: 'score-label',
                        className: `text-sm font-medium text-${efficiencyScore >= 80 ? 'green' : efficiencyScore >= 60 ? 'yellow' : 'red'}-700`
                    }, t.taxEfficiencyScore),
                    createElement('div', {
                        key: 'score-value',
                        className: `text-2xl font-bold text-${efficiencyScore >= 80 ? 'green' : efficiencyScore >= 60 ? 'yellow' : 'red'}-800`
                    }, `${Math.round(efficiencyScore)}/100`)
                ]),
                
                // Marginal Tax Rate
                createElement('div', {
                    key: 'marginal-rate',
                    className: "bg-blue-50 rounded-lg p-4 border border-blue-200"
                }, [
                    createElement('div', {
                        key: 'marginal-label',
                        className: "text-sm font-medium text-blue-700"
                    }, t.marginalTaxRate),
                    createElement('div', {
                        key: 'marginal-value',
                        className: "text-2xl font-bold text-blue-800"
                    }, `${(marginalRate * 100).toFixed(1)}%`)
                ]),
                
                // Effective Tax Rate
                createElement('div', {
                    key: 'effective-rate',
                    className: "bg-purple-50 rounded-lg p-4 border border-purple-200"
                }, [
                    createElement('div', {
                        key: 'effective-label',
                        className: "text-sm font-medium text-purple-700"
                    }, t.effectiveTaxRate),
                    createElement('div', {
                        key: 'effective-value',
                        className: "text-2xl font-bold text-purple-800"
                    }, `${(effectiveRate * 100).toFixed(1)}%`)
                ]),
                
                // Estimated Annual Tax Savings
                createElement('div', {
                    key: 'tax-savings',
                    className: "bg-orange-50 rounded-lg p-4 border border-orange-200"
                }, [
                    createElement('div', {
                        key: 'savings-label',
                        className: "text-sm font-medium text-orange-700"
                    }, t.estimatedTaxSavings),
                    createElement('div', {
                        key: 'savings-value',
                        className: "text-2xl font-bold text-orange-800"
                    }, `${rules.currency}${Math.round(
                        calculateTaxSavings(
                            currentIncome * ((parseFloat(inputs.pensionContributionRate || 0) + parseFloat(inputs.trainingFundContributionRate || 0)) / 100),
                            marginalRate
                        )
                    ).toLocaleString()}`)
                ])
            ])
        ]);
    };

    // Render optimization strategies
    const renderOptimizationStrategies = () => {
        return createElement('div', {
            key: 'optimization-strategies',
            className: "space-y-6"
        }, [
            createElement('h3', {
                key: 'strategies-title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '🎯'),
                'Tax Optimization Strategies'
            ]),
            
            createElement('div', { key: 'strategies-grid', className: "grid grid-cols-1 lg:grid-cols-3 gap-6" }, [
                // Immediate Actions
                createElement('div', {
                    key: 'immediate-actions',
                    className: "bg-red-50 rounded-xl p-6 border border-red-200"
                }, [
                    createElement('h4', {
                        key: 'immediate-title',
                        className: "text-lg font-semibold text-red-700 mb-4"
                    }, t.immediateActions),
                    createElement('ul', { key: 'immediate-list', className: "space-y-2 text-red-600 text-sm" }, 
                        rules.strategies.slice(0, 2).map((strategy, index) => 
                            createElement('li', { key: `immediate-${index}` }, `• ${strategy}`)
                        )
                    )
                ]),
                
                // Short-Term Strategy
                createElement('div', {
                    key: 'short-term-strategy',
                    className: "bg-yellow-50 rounded-xl p-6 border border-yellow-200"
                }, [
                    createElement('h4', {
                        key: 'short-term-title',
                        className: "text-lg font-semibold text-yellow-700 mb-4"
                    }, t.shortTermStrategy),
                    createElement('ul', { key: 'short-term-list', className: "space-y-2 text-yellow-600 text-sm" }, [
                        createElement('li', { key: 'review-contributions' }, '• Review contribution percentages quarterly'),
                        createElement('li', { key: 'tax-brackets' }, '• Monitor tax bracket changes'),
                        createElement('li', { key: 'rebalance' }, '• Rebalance tax-advantaged accounts')
                    ])
                ]),
                
                // Long-Term Planning
                createElement('div', {
                    key: 'long-term-planning',
                    className: "bg-green-50 rounded-xl p-6 border border-green-200"
                }, [
                    createElement('h4', {
                        key: 'long-term-title',
                        className: "text-lg font-semibold text-green-700 mb-4"
                    }, t.longTermPlanning),
                    createElement('ul', { key: 'long-term-list', className: "space-y-2 text-green-600 text-sm" }, 
                        rules.strategies.slice(2).map((strategy, index) => 
                            createElement('li', { key: `long-term-${index}` }, `• ${strategy}`)
                        )
                    )
                ])
            ])
        ]);
    };

    // Render contribution optimization
    const renderContributionOptimization = () => {
        const currentIncome = parseFloat(inputs.currentMonthlySalary || 0) * 12;
        const currentPensionRate = parseFloat(inputs.pensionContributionRate || 0);
        const currentTrainingFundRate = parseFloat(inputs.trainingFundContributionRate || 0);
        
        return createElement('div', {
            key: 'contribution-optimization',
            className: "bg-blue-50 rounded-xl p-6 border border-blue-200"
        }, [
            createElement('h3', {
                key: 'contribution-title',
                className: "text-xl font-semibold text-blue-700 mb-6 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '💰'),
                t.contributionOptimization
            ]),
            
            createElement('div', { key: 'contribution-inputs', className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, [
                // Pension Contribution Rate
                createElement('div', { key: 'pension-optimization' }, [
                    createElement('label', {
                        key: 'pension-label',
                        className: "block text-sm font-medium text-gray-700 mb-2"
                    }, 'Optimized Pension Contribution (%)'),
                    createElement('input', {
                        key: 'pension-input',
                        type: 'number',
                        step: '0.1',
                        min: '0',
                        max: selectedCountry === 'israel' ? '7' : '15',
                        value: inputs.optimizedPensionRate || currentPensionRate,
                        onChange: (e) => setInputs({...inputs, optimizedPensionRate: e.target.value}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    }),
                    createElement('div', {
                        key: 'pension-savings',
                        className: "mt-2 text-sm text-blue-600"
                    }, `Annual tax savings: ${rules.currency}${Math.round(
                        calculateTaxSavings(
                            currentIncome * (parseFloat(inputs.optimizedPensionRate || currentPensionRate) / 100),
                            calculateMarginalTaxRate(currentIncome)
                        )
                    ).toLocaleString()}`)
                ]),
                
                // Training Fund Rate (Israel only)
                selectedCountry === 'israel' && createElement('div', { key: 'training-fund-optimization' }, [
                    createElement('label', {
                        key: 'training-fund-label',
                        className: "block text-sm font-medium text-gray-700 mb-2"
                    }, 'Optimized Training Fund Contribution (%)'),
                    createElement('input', {
                        key: 'training-fund-input',
                        type: 'number',
                        step: '0.1',
                        min: '0',
                        max: '10',
                        value: inputs.optimizedTrainingFundRate || currentTrainingFundRate,
                        onChange: (e) => setInputs({...inputs, optimizedTrainingFundRate: e.target.value}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    }),
                    createElement('div', {
                        key: 'training-fund-savings',
                        className: "mt-2 text-sm text-blue-600"
                    }, `Annual tax savings: ${rules.currency}${Math.round(
                        calculateTaxSavings(
                            Math.min(currentIncome * (parseFloat(inputs.optimizedTrainingFundRate || currentTrainingFundRate) / 100), rules.trainingFundDeductionLimit * 12),
                            calculateMarginalTaxRate(currentIncome)
                        )
                    ).toLocaleString()}`)
                ])
            ])
        ]);
    };

    return createElement('div', { className: "space-y-8" }, [
        // Country Selection
        createElement('div', { key: 'country-selection' }, [
            createElement('h3', {
                key: 'main-title',
                className: "text-2xl font-bold text-gray-800 mb-6 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-3xl" }, '💼'),
                t.title
            ]),
            
            createElement('div', { key: 'country-selector', className: "mb-6" }, [
                createElement('label', {
                    key: 'country-label',
                    className: "block text-sm font-medium text-gray-700 mb-2"
                }, t.countrySelect),
                createElement('select', {
                    key: 'country-select',
                    value: selectedCountry,
                    onChange: (e) => setInputs({...inputs, taxCountry: e.target.value}),
                    className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                }, [
                    createElement('option', { key: 'israel', value: 'israel' }, '🇮🇱 Israel'),
                    createElement('option', { key: 'uk', value: 'uk' }, '🇬🇧 United Kingdom'),
                    createElement('option', { key: 'us', value: 'us' }, '🇺🇸 United States'),
                    createElement('option', { key: 'eu', value: 'eu' }, '🇪🇺 European Union')
                ])
            ])
        ]),

        // Country-specific tax information
        renderCountryTaxInfo(),

        // Tax efficiency dashboard
        renderTaxEfficiencyDashboard(),

        // Tax rate inputs section
        createElement('div', {
            key: 'tax-rates-section',
            className: "bg-white rounded-xl p-6 border border-gray-200 mb-8"
        }, [
            createElement('h3', {
                key: 'rates-title',
                className: "text-xl font-semibold text-gray-700 mb-6"
            }, 'Tax Rate Configuration'),
            
            createElement('div', { key: 'rates-grid', className: "grid grid-cols-1 md:grid-cols-3 gap-6" }, [
                createElement('div', { key: 'current-tax-rate' }, [
                    createElement('label', {
                        key: 'current-label',
                        className: "block text-sm font-medium text-gray-700 mb-2"
                    }, t.currentTaxRate || 'Current Tax Rate (%)'),
                    createElement('input', {
                        key: 'current-input',
                        type: 'number',
                        min: 0,
                        max: 100,
                        step: 0.1,
                        value: inputs.currentTaxRate || '',
                        onChange: (e) => setInputs({...inputs, currentTaxRate: e.target.value}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    })
                ]),
                
                createElement('div', { key: 'marginal-tax-rate' }, [
                    createElement('label', {
                        key: 'marginal-label',
                        className: "block text-sm font-medium text-gray-700 mb-2"
                    }, t.marginalTaxRate || 'Marginal Tax Rate (%)'),
                    createElement('input', {
                        key: 'marginal-input',
                        type: 'number',
                        min: 0,
                        max: 100,
                        step: 0.1,
                        value: inputs.marginalTaxRate || '',
                        onChange: (e) => setInputs({...inputs, marginalTaxRate: e.target.value}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    })
                ]),
                
                createElement('div', { key: 'effective-tax-rate' }, [
                    createElement('label', {
                        key: 'effective-label',
                        className: "block text-sm font-medium text-gray-700 mb-2"
                    }, t.effectiveTaxRate || 'Effective Tax Rate (%)'),
                    createElement('input', {
                        key: 'effective-input',
                        type: 'number',
                        min: 0,
                        max: 100,
                        step: 0.1,
                        value: inputs.effectiveTaxRate || '',
                        onChange: (e) => setInputs({...inputs, effectiveTaxRate: e.target.value}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    })
                ])
            ]),
            
            // Auto-calculate button
            createElement('div', { key: 'auto-calculate', className: "mt-6 text-center" }, [
                createElement('button', {
                    key: 'auto-calc-btn',
                    onClick: () => {
                        const currentIncome = parseFloat(inputs.currentMonthlySalary || 0) * 12;
                        const marginal = calculateMarginalTaxRate(currentIncome) * 100;
                        const effective = calculateEffectiveTaxRate(currentIncome) * 100;
                        setInputs({
                            ...inputs,
                            marginalTaxRate: marginal.toFixed(1),
                            effectiveTaxRate: effective.toFixed(1),
                            currentTaxRate: effective.toFixed(1)
                        });
                    },
                    className: "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                }, 'Auto-Calculate Based on Income')
            ])
        ]),

        // Contribution optimization
        renderContributionOptimization(),

        // Optimization strategies
        renderOptimizationStrategies(),

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
window.WizardStepTaxes = WizardStepTaxes;

console.log('✅ WizardStepTaxes component loaded successfully');