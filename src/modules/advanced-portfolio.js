// Advanced Portfolio Module - Dynamic Module for Advanced Portfolio Management
// Comprehensive portfolio management with multi-asset allocation and work periods

(function() {
    'use strict';

    // Icon Components - Same as core
    const Settings = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '⚙️');

    const PiggyBank = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '🏛️');

    const DollarSign = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '💰');

    const Building = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '🏢');

    const TrendingUp = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '📈');

    const Globe = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '🌍');

    const Plus = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '➕');

    const Trash2 = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '🗑️');

    // Advanced Portfolio Component - Advanced portfolio management component
    const AdvancedPortfolio = ({ inputs, setInputs, language, t }) => {
        
        // State for portfolio allocations
        const [pensionIndexAllocation, setPensionIndexAllocation] = React.useState([
            { index: 'S&P 500', percentage: 60, customReturn: null },
            { index: 'Government Bonds', percentage: 40, customReturn: null }
        ]);

        const [trainingFundIndexAllocation, setTrainingFundIndexAllocation] = React.useState([
            { index: 'Tel Aviv 35', percentage: 100, customReturn: null }
        ]);

        const [workPeriods, setWorkPeriods] = React.useState([
            {
                id: 1,
                country: 'israel',
                startAge: inputs.currentAge || 30,
                endAge: inputs.retirementAge || 67,
                monthlyContribution: 2000,
                salary: inputs.currentMonthlySalary || 15000,
                pensionReturn: 7.0,
                pensionDepositFee: 0.5,
                pensionAnnualFee: 0.8,
                monthlyTrainingFund: 500
            }
        ]);

        // Effect to sync inputs with work periods
        React.useEffect(() => {
            if (workPeriods.length > 0) {
                setWorkPeriods(workPeriods.map(period => ({
                    ...period,
                    startAge: period.startAge || inputs.currentAge,
                    endAge: period.endAge || inputs.retirementAge,
                    salary: period.salary || inputs.currentMonthlySalary
                })));
            }
        }, [inputs.currentAge, inputs.retirementAge, inputs.currentMonthlySalary]);

        // Available indices for portfolio allocation
        const availableIndices = [
            'S&P 500', 'NASDAQ', 'MSCI World', 'FTSE 100', 'יורו סטוקס 50', 'ניקיי 225',
            'ת"א 35', 'ת"א 125', 'אג״ח ממשלתיות', 'אג״ח קונצרניות',
            'נדל״ן ארה״ב', 'נדל״ן ישראל', 'נדל״ן אירופה', 'נדל״ן עולמי', 'נדל״ן אסיה'
        ];

        // Country options for work periods
        const countryOptions = [
            { value: 'israel', label: language === 'he' ? 'ישראל' : 'Israel' },
            { value: 'usa', label: language === 'he' ? 'ארה״ב' : 'USA' },
            { value: 'germany', label: language === 'he' ? 'גרמניה' : 'Germany' },
            { value: 'uk', label: language === 'he' ? 'בריטניה' : 'United Kingdom' },
            { value: 'canada', label: language === 'he' ? 'קנדה' : 'Canada' },
            { value: 'australia', label: language === 'he' ? 'אוסטרליה' : 'Australia' }
        ];

        // Add new work period
        const addWorkPeriod = () => {
            const newPeriod = {
                id: Math.max(...workPeriods.map(p => p.id)) + 1,
                country: 'israel',
                startAge: workPeriods[workPeriods.length - 1]?.endAge || inputs.currentAge,
                endAge: inputs.retirementAge,
                monthlyContribution: 2000,
                salary: 15000,
                pensionReturn: 7.0,
                pensionDepositFee: 0.5,
                pensionAnnualFee: 0.8,
                monthlyTrainingFund: 500
            };
            setWorkPeriods([...workPeriods, newPeriod]);
        };

        // Remove work period
        const removeWorkPeriod = (id) => {
            if (workPeriods.length > 1) {
                setWorkPeriods(workPeriods.filter(p => p.id !== id));
            }
        };

        // Update work period
        const updateWorkPeriod = (id, updates) => {
            setWorkPeriods(workPeriods.map(p => 
                p.id === id ? { ...p, ...updates } : p
            ));
        };

        // Add index to allocation
        const addIndexToAllocation = (allocationType) => {
            const newIndex = {
                index: availableIndices[0],
                percentage: 0,
                customReturn: null
            };
            
            if (allocationType === 'pension') {
                setPensionIndexAllocation([...pensionIndexAllocation, newIndex]);
            } else {
                setTrainingFundIndexAllocation([...trainingFundIndexAllocation, newIndex]);
            }
        };

        // Remove index from allocation
        const removeIndexFromAllocation = (allocationType, indexToRemove) => {
            if (allocationType === 'pension' && pensionIndexAllocation.length > 1) {
                setPensionIndexAllocation(pensionIndexAllocation.filter((_, i) => i !== indexToRemove));
            } else if (allocationType === 'training' && trainingFundIndexAllocation.length > 1) {
                setTrainingFundIndexAllocation(trainingFundIndexAllocation.filter((_, i) => i !== indexToRemove));
            }
        };

        // Update index allocation
        const updateIndexAllocation = (allocationType, index, updates) => {
            if (allocationType === 'pension') {
                setPensionIndexAllocation(pensionIndexAllocation.map((item, i) => 
                    i === index ? { ...item, ...updates } : item
                ));
            } else {
                setTrainingFundIndexAllocation(trainingFundIndexAllocation.map((item, i) => 
                    i === index ? { ...item, ...updates } : item
                ));
            }
        };

        // Calculate total allocation percentage
        const getTotalAllocation = (allocation) => {
            return allocation.reduce((sum, item) => sum + (item.percentage || 0), 0);
        };

        return React.createElement('div', { className: "space-y-6" }, [
            
            // Advanced Settings Section
            React.createElement('div', { 
                key: 'advanced-settings',
                className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in" 
            }, [
                React.createElement('h2', { 
                    key: 'title',
                    className: "text-2xl font-bold text-orange-700 mb-6 flex items-center" 
                }, [
                    React.createElement(Settings, { key: 'icon', className: "mr-2" }),
                    language === 'he' ? "הגדרות מתקדמות" : "Advanced Settings"
                ]),
                React.createElement('div', { 
                    key: 'content',
                    className: "space-y-4" 
                }, [
                    React.createElement('div', { 
                        key: 'row1',
                        className: "grid grid-cols-2 gap-4" 
                    }, [
                        React.createElement('div', { key: 'expenses' }, [
                            React.createElement('label', { 
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, language === 'he' ? "הוצאות חודשיות נוכחיות (₪)" : "Current Monthly Expenses (₪)"),
                            React.createElement('input', {
                                type: 'number',
                                value: inputs.currentMonthlyExpenses || 12000,
                                onChange: (e) => setInputs({...inputs, currentMonthlyExpenses: parseInt(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            })
                        ]),
                        React.createElement('div', { key: 'replacement' }, [
                            React.createElement('label', { 
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, language === 'he' ? "אחוז החלפת הכנסה (%)" : "Income Replacement Rate (%)"),
                            React.createElement('input', {
                                type: 'number',
                                value: inputs.targetReplacement || 75,
                                onChange: (e) => setInputs({...inputs, targetReplacement: parseInt(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            })
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'row2',
                        className: "grid grid-cols-2 gap-4" 
                    }, [
                        React.createElement('div', { key: 'tolerance' }, [
                            React.createElement('label', { 
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, language === 'he' ? "סובלנות לסיכון" : "Risk Tolerance"),
                            React.createElement('select', {
                                value: inputs.riskTolerance || 'moderate',
                                onChange: (e) => setInputs({...inputs, riskTolerance: e.target.value}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            }, [
                                React.createElement('option', { key: 'conservative', value: 'conservative' }, 
                                    language === 'he' ? 'שמרני' : 'Conservative'),
                                React.createElement('option', { key: 'moderate', value: 'moderate' }, 
                                    language === 'he' ? 'מתון' : 'Moderate'),
                                React.createElement('option', { key: 'aggressive', value: 'aggressive' }, 
                                    language === 'he' ? 'אגרסיבי' : 'Aggressive')
                            ])
                        ]),
                        React.createElement('div', { key: 'salary-growth' }, [
                            React.createElement('label', { 
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, language === 'he' ? "צמיחה שנתית במשכורת (%)" : "Annual Salary Growth (%)"),
                            React.createElement('input', {
                                type: 'number',
                                step: '0.1',
                                value: inputs.expectedSalaryGrowth || 3.0,
                                onChange: (e) => setInputs({...inputs, expectedSalaryGrowth: parseFloat(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            })
                        ])
                    ])
                ])
            ]),

            // Work Periods Section
            React.createElement('div', { 
                key: 'work-periods',
                className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in" 
            }, [
                React.createElement('div', { 
                    key: 'header',
                    className: "flex justify-between items-center mb-6" 
                }, [
                    React.createElement('h2', { 
                        key: 'title',
                        className: "text-2xl font-bold text-blue-700 flex items-center" 
                    }, [
                        React.createElement(Building, { key: 'icon', className: "mr-2" }),
                        language === 'he' ? "תקופות עבודה" : "Work Periods"
                    ]),
                    React.createElement('button', {
                        key: 'add',
                        onClick: addWorkPeriod,
                        className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    }, [
                        React.createElement(Plus, { key: 'icon', className: "mr-1" }),
                        language === 'he' ? 'הוסף תקופה' : 'Add Period'
                    ])
                ]),
                React.createElement('div', { 
                    key: 'periods',
                    className: "space-y-4" 
                }, workPeriods.map((period, index) =>
                    React.createElement('div', {
                        key: period.id,
                        className: "border border-gray-200 rounded-lg p-4 bg-white/50"
                    }, [
                        React.createElement('div', {
                            key: 'header',
                            className: "flex justify-between items-center mb-4"
                        }, [
                            React.createElement('h3', {
                                key: 'title',
                                className: "text-lg font-semibold text-blue-800"
                            }, `${language === 'he' ? 'תקופה' : 'Period'} ${index + 1}`),
                            workPeriods.length > 1 && React.createElement('button', {
                                key: 'remove',
                                onClick: () => removeWorkPeriod(period.id),
                                className: "text-red-600 hover:text-red-800 transition-colors"
                            }, React.createElement(Trash2, {}))
                        ]),
                        React.createElement('div', {
                            key: 'content',
                            className: "grid grid-cols-2 gap-4"
                        }, [
                            React.createElement('div', { key: 'country' }, [
                                React.createElement('label', {
                                    className: "block text-sm font-medium text-gray-700 mb-1"
                                }, language === 'he' ? 'מדינה' : 'Country'),
                                React.createElement('select', {
                                    value: period.country,
                                    onChange: (e) => updateWorkPeriod(period.id, { country: e.target.value }),
                                    className: "w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                }, countryOptions.map(option =>
                                    React.createElement('option', {
                                        key: option.value,
                                        value: option.value
                                    }, option.label)
                                ))
                            ]),
                            React.createElement('div', { key: 'ages' }, [
                                React.createElement('label', {
                                    className: "block text-sm font-medium text-gray-700 mb-1"
                                }, language === 'he' ? 'גילאים' : 'Ages'),
                                React.createElement('div', { className: "flex gap-2" }, [
                                    React.createElement('input', {
                                        type: 'number',
                                        placeholder: language === 'he' ? 'מגיל' : 'From',
                                        value: period.startAge,
                                        onChange: (e) => updateWorkPeriod(period.id, { startAge: parseInt(e.target.value) || 0 }),
                                        className: "w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    }),
                                    React.createElement('input', {
                                        type: 'number',
                                        placeholder: language === 'he' ? 'עד גיל' : 'To',
                                        value: period.endAge,
                                        onChange: (e) => updateWorkPeriod(period.id, { endAge: parseInt(e.target.value) || 0 }),
                                        className: "w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    })
                                ])
                            ]),
                            React.createElement('div', { key: 'salary' }, [
                                React.createElement('label', {
                                    className: "block text-sm font-medium text-gray-700 mb-1"
                                }, language === 'he' ? 'משכורת חודשית (₪)' : 'Monthly Salary (₪)'),
                                React.createElement('input', {
                                    type: 'number',
                                    value: period.salary,
                                    onChange: (e) => updateWorkPeriod(period.id, { salary: parseInt(e.target.value) || 0 }),
                                    className: "w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                })
                            ]),
                            React.createElement('div', { key: 'contribution' }, [
                                React.createElement('label', {
                                    className: "block text-sm font-medium text-gray-700 mb-1"
                                }, language === 'he' ? 'הפרשה חודשית לפנסיה (₪)' : 'Monthly Pension Contribution (₪)'),
                                React.createElement('input', {
                                    type: 'number',
                                    value: period.monthlyContribution,
                                    onChange: (e) => updateWorkPeriod(period.id, { monthlyContribution: parseInt(e.target.value) || 0 }),
                                    className: "w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                })
                            ])
                        ])
                    ])
                ))
            ]),

            // Portfolio Allocation Section
            React.createElement('div', { 
                key: 'portfolio-allocation',
                className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in" 
            }, [
                React.createElement('h2', { 
                    key: 'title',
                    className: "text-2xl font-bold text-purple-700 mb-6 flex items-center" 
                }, [
                    React.createElement(TrendingUp, { key: 'icon', className: "mr-2" }),
                    language === 'he' ? "הקצאת תיק השקעות" : "Portfolio Allocation"
                ]),
                
                // Pension Fund Allocation
                React.createElement('div', { 
                    key: 'pension-allocation',
                    className: "mb-6" 
                }, [
                    React.createElement('div', {
                        key: 'header',
                        className: "flex justify-between items-center mb-4"
                    }, [
                        React.createElement('h3', {
                            key: 'title',
                            className: "text-lg font-semibold text-purple-800"
                        }, language === 'he' ? 'הקצאת קרן פנסיה' : 'Pension Fund Allocation'),
                        React.createElement('button', {
                            key: 'add',
                            onClick: () => addIndexToAllocation('pension'),
                            className: "px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center text-sm"
                        }, [
                            React.createElement(Plus, { key: 'icon', className: "mr-1" }),
                            language === 'he' ? 'הוסף מדד' : 'Add Index'
                        ])
                    ]),
                    React.createElement('div', {
                        key: 'allocations',
                        className: "space-y-2"
                    }, pensionIndexAllocation.map((allocation, index) =>
                        React.createElement('div', {
                            key: index,
                            className: "flex gap-2 items-center"
                        }, [
                            React.createElement('select', {
                                key: 'index',
                                value: allocation.index,
                                onChange: (e) => updateIndexAllocation('pension', index, { index: e.target.value }),
                                className: "flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                            }, availableIndices.map(indexName =>
                                React.createElement('option', {
                                    key: indexName,
                                    value: indexName
                                }, indexName)
                            )),
                            React.createElement('input', {
                                key: 'percentage',
                                type: 'number',
                                min: '0',
                                max: '100',
                                value: allocation.percentage,
                                onChange: (e) => updateIndexAllocation('pension', index, { percentage: parseInt(e.target.value) || 0 }),
                                className: "w-20 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                            }),
                            React.createElement('span', {
                                key: 'percent',
                                className: "text-sm text-gray-600"
                            }, '%'),
                            pensionIndexAllocation.length > 1 && React.createElement('button', {
                                key: 'remove',
                                onClick: () => removeIndexFromAllocation('pension', index),
                                className: "text-red-600 hover:text-red-800 transition-colors"
                            }, React.createElement(Trash2, { size: 16 }))
                        ])
                    )),
                    React.createElement('div', {
                        key: 'total',
                        className: `text-sm mt-2 ${getTotalAllocation(pensionIndexAllocation) === 100 ? 'text-green-600' : 'text-red-600'}`
                    }, `${language === 'he' ? 'סה"כ' : 'Total'}: ${getTotalAllocation(pensionIndexAllocation)}%`)
                ]),

                // Training Fund Allocation
                React.createElement('div', { 
                    key: 'training-allocation'
                }, [
                    React.createElement('div', {
                        key: 'header',
                        className: "flex justify-between items-center mb-4"
                    }, [
                        React.createElement('h3', {
                            key: 'title',
                            className: "text-lg font-semibold text-green-800"
                        }, language === 'he' ? 'הקצאת קרן השתלמות' : 'Training Fund Allocation'),
                        React.createElement('button', {
                            key: 'add',
                            onClick: () => addIndexToAllocation('training'),
                            className: "px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center text-sm"
                        }, [
                            React.createElement(Plus, { key: 'icon', className: "mr-1" }),
                            language === 'he' ? 'הוסף מדד' : 'Add Index'
                        ])
                    ]),
                    React.createElement('div', {
                        key: 'allocations',
                        className: "space-y-2"
                    }, trainingFundIndexAllocation.map((allocation, index) =>
                        React.createElement('div', {
                            key: index,
                            className: "flex gap-2 items-center"
                        }, [
                            React.createElement('select', {
                                key: 'index',
                                value: allocation.index,
                                onChange: (e) => updateIndexAllocation('training', index, { index: e.target.value }),
                                className: "flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                            }, availableIndices.map(indexName =>
                                React.createElement('option', {
                                    key: indexName,
                                    value: indexName
                                }, indexName)
                            )),
                            React.createElement('input', {
                                key: 'percentage',
                                type: 'number',
                                min: '0',
                                max: '100',
                                value: allocation.percentage,
                                onChange: (e) => updateIndexAllocation('training', index, { percentage: parseInt(e.target.value) || 0 }),
                                className: "w-20 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                            }),
                            React.createElement('span', {
                                key: 'percent',
                                className: "text-sm text-gray-600"
                            }, '%'),
                            trainingFundIndexAllocation.length > 1 && React.createElement('button', {
                                key: 'remove',
                                onClick: () => removeIndexFromAllocation('training', index),
                                className: "text-red-600 hover:text-red-800 transition-colors"
                            }, React.createElement(Trash2, { size: 16 }))
                        ])
                    )),
                    React.createElement('div', {
                        key: 'total',
                        className: `text-sm mt-2 ${getTotalAllocation(trainingFundIndexAllocation) === 100 ? 'text-green-600' : 'text-red-600'}`
                    }, `${language === 'he' ? 'סה"כ' : 'Total'}: ${getTotalAllocation(trainingFundIndexAllocation)}%`)
                ])
            ]),

            // Additional Investment Options
            React.createElement('div', { 
                key: 'additional-investments',
                className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in" 
            }, [
                React.createElement('h2', { 
                    key: 'title',
                    className: "text-2xl font-bold text-indigo-700 mb-6 flex items-center" 
                }, [
                    React.createElement(Globe, { key: 'icon', className: "mr-2" }),
                    language === 'he' ? "השקעות נוספות" : "Additional Investments"
                ]),
                React.createElement('div', { 
                    key: 'content',
                    className: "grid grid-cols-2 gap-6" 
                }, [
                    // Personal Portfolio
                    React.createElement('div', { key: 'personal' }, [
                        React.createElement('h3', {
                            className: "text-lg font-semibold text-indigo-800 mb-3"
                        }, language === 'he' ? 'תיק אישי' : 'Personal Portfolio'),
                        React.createElement('div', { className: "space-y-3" }, [
                            React.createElement('div', {}, [
                                React.createElement('label', {
                                    className: "block text-sm font-medium text-gray-700 mb-1"
                                }, language === 'he' ? 'יתרה נוכחית (₪)' : 'Current Balance (₪)'),
                                React.createElement('input', {
                                    type: 'number',
                                    value: inputs.currentPersonalPortfolio || 0,
                                    onChange: (e) => setInputs({...inputs, currentPersonalPortfolio: parseInt(e.target.value) || 0}),
                                    className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                                })
                            ]),
                            React.createElement('div', {}, [
                                React.createElement('label', {
                                    className: "block text-sm font-medium text-gray-700 mb-1"
                                }, language === 'he' ? 'הפקדה חודשית (₪)' : 'Monthly Contribution (₪)'),
                                React.createElement('input', {
                                    type: 'number',
                                    value: inputs.personalPortfolioMonthly || 0,
                                    onChange: (e) => setInputs({...inputs, personalPortfolioMonthly: parseInt(e.target.value) || 0}),
                                    className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                                })
                            ]),
                            React.createElement('div', {}, [
                                React.createElement('label', {
                                    className: "block text-sm font-medium text-gray-700 mb-1"
                                }, language === 'he' ? 'תשואה צפויה (%)' : 'Expected Return (%)'),
                                React.createElement('input', {
                                    type: 'number',
                                    step: '0.1',
                                    value: inputs.personalPortfolioReturn || 8.0,
                                    onChange: (e) => setInputs({...inputs, personalPortfolioReturn: parseFloat(e.target.value) || 0}),
                                    className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                                })
                            ])
                        ])
                    ]),

                    // Real Estate
                    React.createElement('div', { key: 'realestate' }, [
                        React.createElement('h3', {
                            className: "text-lg font-semibold text-green-800 mb-3"
                        }, language === 'he' ? 'נדל״ן' : 'Real Estate'),
                        React.createElement('div', { className: "space-y-3" }, [
                            React.createElement('div', {}, [
                                React.createElement('label', {
                                    className: "block text-sm font-medium text-gray-700 mb-1"
                                }, language === 'he' ? 'יתרה נוכחית (₪)' : 'Current Balance (₪)'),
                                React.createElement('input', {
                                    type: 'number',
                                    value: inputs.currentRealEstate || 0,
                                    onChange: (e) => setInputs({...inputs, currentRealEstate: parseInt(e.target.value) || 0}),
                                    className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                                })
                            ]),
                            React.createElement('div', {}, [
                                React.createElement('label', {
                                    className: "block text-sm font-medium text-gray-700 mb-1"
                                }, language === 'he' ? 'הפקדה חודשית (₪)' : 'Monthly Contribution (₪)'),
                                React.createElement('input', {
                                    type: 'number',
                                    value: inputs.realEstateMonthly || 0,
                                    onChange: (e) => setInputs({...inputs, realEstateMonthly: parseInt(e.target.value) || 0}),
                                    className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                                })
                            ]),
                            React.createElement('div', {}, [
                                React.createElement('label', {
                                    className: "block text-sm font-medium text-gray-700 mb-1"
                                }, language === 'he' ? 'תשואה צפויה (%)' : 'Expected Return (%)'),
                                React.createElement('input', {
                                    type: 'number',
                                    step: '0.1',
                                    value: inputs.realEstateReturn || 6.0,
                                    onChange: (e) => setInputs({...inputs, realEstateReturn: parseFloat(e.target.value) || 0}),
                                    className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                                })
                            ])
                        ])
                    ]),

                    // Cryptocurrency
                    React.createElement('div', { key: 'crypto' }, [
                        React.createElement('h3', {
                            className: "text-lg font-semibold text-yellow-800 mb-3"
                        }, language === 'he' ? 'קריפטו' : 'Cryptocurrency'),
                        React.createElement('div', { className: "space-y-3" }, [
                            React.createElement('div', {}, [
                                React.createElement('label', {
                                    className: "block text-sm font-medium text-gray-700 mb-1"
                                }, language === 'he' ? 'יתרה נוכחית (₪)' : 'Current Balance (₪)'),
                                React.createElement('input', {
                                    type: 'number',
                                    value: inputs.currentCrypto || 0,
                                    onChange: (e) => setInputs({...inputs, currentCrypto: parseInt(e.target.value) || 0}),
                                    className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500"
                                })
                            ]),
                            React.createElement('div', {}, [
                                React.createElement('label', {
                                    className: "block text-sm font-medium text-gray-700 mb-1"
                                }, language === 'he' ? 'הפקדה חודשית (₪)' : 'Monthly Contribution (₪)'),
                                React.createElement('input', {
                                    type: 'number',
                                    value: inputs.cryptoMonthly || 0,
                                    onChange: (e) => setInputs({...inputs, cryptoMonthly: parseInt(e.target.value) || 0}),
                                    className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500"
                                })
                            ]),
                            React.createElement('div', {}, [
                                React.createElement('label', {
                                    className: "block text-sm font-medium text-gray-700 mb-1"
                                }, language === 'he' ? 'תשואה צפויה (%)' : 'Expected Return (%)'),
                                React.createElement('input', {
                                    type: 'number',
                                    step: '0.1',
                                    value: inputs.cryptoReturn || 15.0,
                                    onChange: (e) => setInputs({...inputs, cryptoReturn: parseFloat(e.target.value) || 0}),
                                    className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500"
                                })
                            ])
                        ])
                    ])
                ])
            ])
        ]);
    };

    // Export to global window object
    window.AdvancedPortfolio = AdvancedPortfolio;
    
    console.log('✅ Advanced Portfolio module loaded successfully');

})();