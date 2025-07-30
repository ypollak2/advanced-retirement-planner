// AdvancedInputs.js - Enhanced Advanced inputs section component with comprehensive financial planning

const AdvancedInputs = ({ 
    inputs, 
    setInputs, 
    language, 
    t,
    workPeriods,
    setWorkPeriods,
    addWorkPeriod,
    removeWorkPeriod,
    updateWorkPeriod,
    countryData,
    formatCurrency,
    Settings,
    PiggyBank,
    DollarSign,
    TrendingUp,
    Building,
    Globe,
    Plus,
    Trash2
}) => {
    return React.createElement('div', { className: "space-y-6" }, [
        React.createElement('div', { 
            key: 'advanced',
            className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in"
        }, [
            React.createElement('h2', { 
                key: 'title',
                className: "text-2xl font-bold text-orange-700 mb-6 flex items-center truncate"
            }, [
                React.createElement(Settings, { key: 'icon', className: "mr-2" }),
                language === 'he' ? "הגדרות מתקדמות" : "Advanced Financial Planning"
            ]),
            React.createElement('div', { key: 'content', className: "space-y-6" }, [
                
                // Financial Planning Section
                React.createElement('div', { key: 'financial-section', className: "space-y-4" }, [
                    React.createElement('h3', {
                        key: 'financial-title',
                        className: "text-lg font-semibold text-orange-600 mb-4 flex items-center"
                    }, [
                        React.createElement('span', { key: 'icon' }, '💰'),
                        React.createElement('span', { key: 'text', className: 'ml-2' }, 
                            language === 'he' ? 'תכנון כלכלי בסיסי' : 'Basic Financial Planning')
                    ]),
                    React.createElement('div', { key: 'financial-grid', className: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                        React.createElement('div', { key: 'expenses' }, [
                            React.createElement('div', { key: 'expense-label-wrapper', className: 'flex items-center gap-2 mb-1' }, [
                                React.createElement('label', { 
                                    key: 'label',
                                    className: "block text-sm font-medium text-gray-700"
                                }, language === 'he' ? "הוצאות חודשיות נוכחיות (₪)" : "Current Monthly Expenses (₪)"),
                                window.HelpTooltip && React.createElement(window.HelpTooltip, {
                                    key: 'expense-help',
                                    term: 'monthlyExpenses',
                                    language: language
                                }, '❓')
                            ]),
                            React.createElement('input', {
                                key: 'input',
                                type: "number",
                                value: inputs.currentMonthlyExpenses || 12000,
                                onChange: (e) => setInputs({...inputs, currentMonthlyExpenses: parseInt(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            })
                        ]),
                        React.createElement('div', { key: 'replacement' }, [
                            React.createElement('div', { key: 'replacement-label-wrapper', className: 'flex items-center gap-2 mb-1' }, [
                                React.createElement('label', { 
                                    key: 'label',
                                    className: "block text-sm font-medium text-gray-700"
                                }, language === 'he' ? "יעד: החלפת % ממשכורת" : "Target: Replace % of Salary"),
                                window.HelpTooltip && React.createElement(window.HelpTooltip, {
                                    key: 'replacement-help',
                                    term: 'replacementRatio',
                                    language: language
                                }, '❓')
                            ]),
                            React.createElement('input', {
                                key: 'input',
                                type: "number",
                                value: inputs.targetReplacement || 75,
                                onChange: (e) => setInputs({...inputs, targetReplacement: parseInt(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            })
                        ]),
                        // Current Salary
                        React.createElement('div', { key: 'salary' }, [
                            React.createElement('div', { key: 'salary-label-wrapper', className: 'flex items-center gap-2 mb-1' }, [
                                React.createElement('label', { 
                                    key: 'label',
                                    className: "block text-sm font-medium text-gray-700"
                                }, language === 'he' ? "משכורת נוכחית (₪)" : "Current Salary (₪)"),
                                window.HelpTooltip && React.createElement(window.HelpTooltip, {
                                    key: 'salary-help',
                                    term: 'grossSalary',
                                    language: language
                                }, '❓')
                            ]),
                            React.createElement('input', {
                                key: 'input',
                                type: "number",
                                value: inputs.currentSalary || 20000,
                                onChange: (e) => setInputs({...inputs, currentSalary: parseInt(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            })
                        ]),
                        // Current Savings
                        React.createElement('div', { key: 'savings' }, [
                            React.createElement('div', { key: 'savings-label-wrapper', className: 'flex items-center gap-2 mb-1' }, [
                                React.createElement('label', { 
                                    key: 'label',
                                    className: "block text-sm font-medium text-gray-700"
                                }, language === 'he' ? "חיסכון נוכחי (₪)" : "Current Savings (₪)"),
                                window.HelpTooltip && React.createElement(window.HelpTooltip, {
                                    key: 'savings-help',
                                    term: 'currentSavings',
                                    language: language
                                }, '❓')
                            ]),
                            React.createElement('input', {
                                key: 'input',
                                type: "number",
                                value: inputs.currentSavings || 0,
                                onChange: (e) => setInputs({...inputs, currentSavings: parseInt(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            })
                        ])
                    ])
                ]),
                
                // Risk & Investment Section
                React.createElement('div', { key: 'risk-section', className: "space-y-4" }, [
                    React.createElement('h3', {
                        key: 'risk-title',
                        className: "text-lg font-semibold text-orange-600 mb-4 flex items-center"
                    }, [
                        React.createElement('span', { key: 'icon' }, '📈'),
                        React.createElement('span', { key: 'text', className: 'ml-2' }, 
                            language === 'he' ? 'סיכון והשקעות' : 'Risk & Investment Strategy')
                    ]),
                    React.createElement('div', { key: 'risk-grid', className: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                        // Risk Tolerance
                        React.createElement('div', { key: 'risk-tolerance' }, [
                            React.createElement('div', { key: 'risk-label-wrapper', className: 'flex items-center gap-2 mb-1' }, [
                                React.createElement('label', { 
                                    key: 'label',
                                    className: "block text-sm font-medium text-gray-700"
                                }, language === 'he' ? "סובלנות לסיכון" : "Risk Tolerance"),
                                window.HelpTooltip && React.createElement(window.HelpTooltip, {
                                    key: 'risk-help',
                                    term: 'riskTolerance',
                                    language: language
                                }, '❓')
                            ]),
                            React.createElement('select', {
                                key: 'select',
                                value: inputs.riskTolerance || 'moderate',
                                onChange: (e) => setInputs({...inputs, riskTolerance: e.target.value}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            }, [
                                React.createElement('option', { key: 'conservative', value: 'conservative' }, 
                                    language === 'he' ? 'שמרני (4-6% תשואה)' : 'Conservative (4-6% return)'),
                                React.createElement('option', { key: 'moderate', value: 'moderate' }, 
                                    language === 'he' ? 'מתון (6-8% תשואה)' : 'Moderate (6-8% return)'),
                                React.createElement('option', { key: 'aggressive', value: 'aggressive' }, 
                                    language === 'he' ? 'אגרסיבי (8-12% תשואה)' : 'Aggressive (8-12% return)')
                            ])
                        ]),
                        // Inflation Rate
                        React.createElement('div', { key: 'inflation' }, [
                            React.createElement('div', { key: 'inflation-label-wrapper', className: 'flex items-center gap-2 mb-1' }, [
                                React.createElement('label', { 
                                    key: 'label',
                                    className: "block text-sm font-medium text-gray-700"
                                }, language === 'he' ? "שיעור אינפלציה צפוי (%)" : "Expected Inflation Rate (%)"),
                                window.HelpTooltip && React.createElement(window.HelpTooltip, {
                                    key: 'inflation-help',
                                    term: 'inflation',
                                    language: language
                                }, '❓')
                            ]),
                            React.createElement('input', {
                                key: 'input',
                                type: "number",
                                step: "0.1",
                                value: inputs.inflationRate || 3,
                                onChange: (e) => setInputs({...inputs, inflationRate: parseFloat(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            })
                        ])
                    ])
                ]),

                // Healthcare & Lifestyle Section
                React.createElement('div', { key: 'healthcare-section', className: "space-y-4" }, [
                    React.createElement('h3', {
                        key: 'healthcare-title',
                        className: "text-lg font-semibold text-orange-600 mb-4 flex items-center"
                    }, [
                        React.createElement('span', { key: 'icon' }, '🏥'),
                        React.createElement('span', { key: 'text', className: 'ml-2' }, 
                            language === 'he' ? 'בריאות ואורח חיים' : 'Healthcare & Lifestyle')
                    ]),
                    React.createElement('div', { key: 'healthcare-grid', className: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                        // Healthcare Costs
                        React.createElement('div', { key: 'healthcare-costs' }, [
                            React.createElement('div', { key: 'healthcare-label-wrapper', className: 'flex items-center gap-2 mb-1' }, [
                                React.createElement('label', { 
                                    key: 'label',
                                    className: "block text-sm font-medium text-gray-700"
                                }, language === 'he' ? "עלויות בריאות חודשיות (₪)" : "Monthly Healthcare Costs (₪)"),
                                window.HelpTooltip && React.createElement(window.HelpTooltip, {
                                    key: 'healthcare-help',
                                    term: 'healthcareCosts',
                                    language: language
                                }, '❓')
                            ]),
                            React.createElement('input', {
                                key: 'input',
                                type: "number",
                                value: inputs.healthcareCosts || 1500,
                                onChange: (e) => setInputs({...inputs, healthcareCosts: parseInt(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            })
                        ]),
                        // Lifestyle Target
                        React.createElement('div', { key: 'lifestyle' }, [
                            React.createElement('div', { key: 'lifestyle-label-wrapper', className: 'flex items-center gap-2 mb-1' }, [
                                React.createElement('label', { 
                                    key: 'label',
                                    className: "block text-sm font-medium text-gray-700"
                                }, language === 'he' ? "יעד אורח חיים" : "Lifestyle Target"),
                                window.HelpTooltip && React.createElement(window.HelpTooltip, {
                                    key: 'lifestyle-help',
                                    term: 'lifestyle',
                                    language: language
                                }, '❓')
                            ]),
                            React.createElement('select', {
                                key: 'select',
                                value: inputs.lifestyleTarget || 'comfortable',
                                onChange: (e) => setInputs({...inputs, lifestyleTarget: e.target.value}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            }, [
                                React.createElement('option', { key: 'basic', value: 'basic' }, 
                                    language === 'he' ? 'בסיסי - 60% ממשכורת' : 'Basic - 60% of salary'),
                                React.createElement('option', { key: 'comfortable', value: 'comfortable' }, 
                                    language === 'he' ? 'נוח - 75% ממשכורת' : 'Comfortable - 75% of salary'),
                                React.createElement('option', { key: 'luxury', value: 'luxury' }, 
                                    language === 'he' ? 'יוקרתי - 90% ממשכורת' : 'Luxury - 90% of salary')
                            ])
                        ])
                    ])
                ]),

                // RSU/Stock Options Section
                React.createElement('div', { key: 'rsu-section', className: "space-y-4" }, [
                    React.createElement('h3', {
                        key: 'rsu-title',
                        className: "text-lg font-semibold text-orange-600 mb-4 flex items-center"
                    }, [
                        React.createElement('span', { key: 'icon' }, '💼'),
                        React.createElement('span', { key: 'text', className: 'ml-2' }, 
                            language === 'he' ? 'אופציות עובדים (RSU)' : 'Stock Options & RSUs')
                    ]),
                    React.createElement('div', { key: 'rsu-grid', className: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                        // Company Selection
                        React.createElement('div', { key: 'company' }, [
                            React.createElement('div', { key: 'company-label-wrapper', className: 'flex items-center gap-2 mb-1' }, [
                                React.createElement('label', { 
                                    key: 'label',
                                    className: "block text-sm font-medium text-gray-700"
                                }, language === 'he' ? "חברה" : "Company"),
                                window.HelpTooltip && React.createElement(window.HelpTooltip, {
                                    key: 'company-help',
                                    term: 'rsuCompany',
                                    language: language
                                }, '❓')
                            ]),
                            React.createElement('select', {
                                key: 'select',
                                value: inputs.rsuCompany || '',
                                onChange: (e) => setInputs({...inputs, rsuCompany: e.target.value}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            }, [
                                React.createElement('option', { key: 'none', value: '' }, 
                                    language === 'he' ? 'ללא אופציות' : 'No Stock Options'),
                                React.createElement('option', { key: 'apple', value: 'AAPL' }, 'Apple (AAPL)'),
                                React.createElement('option', { key: 'google', value: 'GOOGL' }, 'Google (GOOGL)'),
                                React.createElement('option', { key: 'microsoft', value: 'MSFT' }, 'Microsoft (MSFT)'),
                                React.createElement('option', { key: 'meta', value: 'META' }, 'Meta (META)'),
                                React.createElement('option', { key: 'nvidia', value: 'NVDA' }, 'NVIDIA (NVDA)'),
                                React.createElement('option', { key: 'amazon', value: 'AMZN' }, 'Amazon (AMZN)'),
                                React.createElement('option', { key: 'tesla', value: 'TSLA' }, 'Tesla (TSLA)')
                            ])
                        ]),
                        // RSU Value
                        React.createElement('div', { key: 'rsu-value' }, [
                            React.createElement('div', { key: 'rsu-label-wrapper', className: 'flex items-center gap-2 mb-1' }, [
                                React.createElement('label', { 
                                    key: 'label',
                                    className: "block text-sm font-medium text-gray-700"
                                }, language === 'he' ? "ערך אופציות שנתי ($)" : "Annual RSU Value ($)"),
                                window.HelpTooltip && React.createElement(window.HelpTooltip, {
                                    key: 'rsu-help',
                                    term: 'rsuValue',
                                    language: language
                                }, '❓')
                            ]),
                            React.createElement('input', {
                                key: 'input',
                                type: "number",
                                value: inputs.annualRsuValue || 0,
                                onChange: (e) => setInputs({...inputs, annualRsuValue: parseInt(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all",
                                placeholder: language === 'he' ? "0" : "e.g., 50000"
                            })
                        ]),
                        // Vesting Period
                        React.createElement('div', { key: 'vesting' }, [
                            React.createElement('div', { key: 'vesting-label-wrapper', className: 'flex items-center gap-2 mb-1' }, [
                                React.createElement('label', { 
                                    key: 'label',
                                    className: "block text-sm font-medium text-gray-700"
                                }, language === 'he' ? "תקופת הבשלה (שנים)" : "Vesting Period (years)"),
                                window.HelpTooltip && React.createElement(window.HelpTooltip, {
                                    key: 'vesting-help',
                                    term: 'vestingPeriod',
                                    language: language
                                }, '❓')
                            ]),
                            React.createElement('select', {
                                key: 'select',
                                value: inputs.vestingPeriod || 4,
                                onChange: (e) => setInputs({...inputs, vestingPeriod: parseInt(e.target.value)}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            }, [
                                React.createElement('option', { key: '1', value: 1 }, '1 ' + (language === 'he' ? 'שנה' : 'year')),
                                React.createElement('option', { key: '2', value: 2 }, '2 ' + (language === 'he' ? 'שנים' : 'years')),
                                React.createElement('option', { key: '3', value: 3 }, '3 ' + (language === 'he' ? 'שנים' : 'years')),
                                React.createElement('option', { key: '4', value: 4 }, '4 ' + (language === 'he' ? 'שנים' : 'years')),
                                React.createElement('option', { key: '5', value: 5 }, '5 ' + (language === 'he' ? 'שנים' : 'years'))
                            ])
                        ]),
                        // Tax Rate
                        React.createElement('div', { key: 'tax-rate' }, [
                            React.createElement('div', { key: 'tax-label-wrapper', className: 'flex items-center gap-2 mb-1' }, [
                                React.createElement('label', { 
                                    key: 'label',
                                    className: "block text-sm font-medium text-gray-700"
                                }, language === 'he' ? "שיעור מס על רווחים (%)" : "Capital Gains Tax (%)"),
                                window.HelpTooltip && React.createElement(window.HelpTooltip, {
                                    key: 'tax-help',
                                    term: 'capitalGainsTax',
                                    language: language
                                }, '❓')
                            ]),
                            React.createElement('input', {
                                key: 'input',
                                type: "number",
                                step: "0.1",
                                value: inputs.capitalGainsTax || 25,
                                onChange: (e) => setInputs({...inputs, capitalGainsTax: parseFloat(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            })
                        ])
                    ])
                ])
            ])
        ])
    ]);
};

// Export to window for global access
window.AdvancedInputs = AdvancedInputs;