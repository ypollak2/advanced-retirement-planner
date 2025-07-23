// InflationAnalysis.js - Comprehensive purchasing power and inflation impact analysis
// Shows how inflation affects retirement planning over time

const InflationAnalysis = ({ inputs, results, language = 'en', workingCurrency = 'ILS' }) => {
    const [selectedTimeframe, setSelectedTimeframe] = React.useState('retirement');
    const [showDetailedBreakdown, setShowDetailedBreakdown] = React.useState(false);

    const content = {
        he: {
            title: 'ניתוח השפעת האינפלציה',
            subtitle: 'כיצד האינפלציה משפיעה על כוח הקנייה שלך לאורך זמן',
            timeframes: {
                retirement: 'בגיל פרישה',
                milestone10: 'בעוד 10 שנים',
                milestone20: 'בעוד 20 שנים',
                current: 'היום'
            },
            metrics: {
                purchasingPower: 'כוח קנייה',
                inflationImpact: 'השפעת אינפלציה',
                realValue: 'ערך ריאלי',
                nominalValue: 'ערך נומינלי',
                purchasingPowerLoss: 'אובדן כוח קנייה',
                equivalentToday: 'שווה ערך היום',
                costIncrease: 'עלייה בעלויות',
                salaryAdjustment: 'התאמת שכר נדרשת'
            },
            categories: {
                basicExpenses: 'הוצאות בסיסיות',
                housing: 'דיור',
                food: 'מזון',
                healthcare: 'בריאות',
                transportation: 'תחבורה',
                entertainment: 'בילויים'
            },
            scenarios: {
                current: 'אינפלציה נוכחית',
                moderate: 'אינפלציה מתונה',
                high: 'אינפלציה גבוהה'
            },
            insights: {
                title: 'תובנות מפתח',
                description: 'הבנת השפעת האינפלציה על התכנון שלך'
            },
            toggleDetails: 'הצג/הסתר פירוט מפורט'
        },
        en: {
            title: 'Inflation Impact Analysis',
            subtitle: 'How inflation affects your purchasing power over time',
            timeframes: {
                retirement: 'At Retirement',
                milestone10: 'In 10 Years',
                milestone20: 'In 20 Years',
                current: 'Today'
            },
            metrics: {
                purchasingPower: 'Purchasing Power',
                inflationImpact: 'Inflation Impact',
                realValue: 'Real Value',
                nominalValue: 'Nominal Value',
                purchasingPowerLoss: 'Purchasing Power Loss',
                equivalentToday: 'Equivalent Today',
                costIncrease: 'Cost Increase',
                salaryAdjustment: 'Required Salary Adjustment'
            },
            categories: {
                basicExpenses: 'Basic Expenses',
                housing: 'Housing',
                food: 'Food',
                healthcare: 'Healthcare',
                transportation: 'Transportation',
                entertainment: 'Entertainment'
            },
            scenarios: {
                current: 'Current Inflation',
                moderate: 'Moderate Inflation',
                high: 'High Inflation'
            },
            insights: {
                title: 'Key Insights',
                description: 'Understanding inflation\'s impact on your planning'
            },
            toggleDetails: 'Show/Hide Detailed Breakdown'
        }
    };

    const t = content[language] || content.en;

    // Calculate inflation metrics
    const calculateInflationMetrics = (years, inflationRate) => {
        const inflationFactor = Math.pow(1 + inflationRate / 100, years);
        const purchasingPowerLoss = ((1 - (1 / inflationFactor)) * 100);
        
        return {
            inflationFactor,
            purchasingPowerLoss,
            realValue: 1 / inflationFactor,
            costMultiplier: inflationFactor
        };
    };

    // Get timeframe data
    const getTimeframeData = () => {
        const currentAge = inputs.currentAge || 30;
        const retirementAge = inputs.retirementAge || 67;
        const yearsToRetirement = retirementAge - currentAge;
        const inflationRate = inputs.inflationRate || 3;

        const timeframes = {
            current: { years: 0, label: t.timeframes.current },
            milestone10: { years: 10, label: t.timeframes.milestone10 },
            milestone20: { years: 20, label: t.timeframes.milestone20 },
            retirement: { years: yearsToRetirement, label: t.timeframes.retirement }
        };

        return Object.entries(timeframes).map(([key, data]) => ({
            key,
            ...data,
            metrics: calculateInflationMetrics(data.years, inflationRate)
        }));
    };

    // Calculate category-specific inflation impact
    const calculateCategoryImpact = (baseAmount, years, categoryInflationRate) => {
        const inflationFactor = Math.pow(1 + categoryInflationRate / 100, years);
        return {
            currentCost: baseAmount,
            futureCost: baseAmount * inflationFactor,
            increase: (baseAmount * inflationFactor) - baseAmount,
            increasePercentage: ((inflationFactor - 1) * 100)
        };
    };

    // Get expense categories with different inflation rates
    const getExpenseCategories = () => {
        const baseInflation = inputs.inflationRate || 3;
        const years = selectedTimeframe === 'retirement' 
            ? (inputs.retirementAge || 67) - (inputs.currentAge || 30)
            : selectedTimeframe === 'milestone10' ? 10
            : selectedTimeframe === 'milestone20' ? 20
            : 0;

        const monthlyExpenses = inputs.currentMonthlyExpenses || 15000;
        
        return [
            {
                category: 'housing',
                name: t.categories.housing,
                baseAmount: monthlyExpenses * 0.35, // 35% of expenses
                inflationRate: baseInflation + 1, // Housing typically higher
                color: 'blue'
            },
            {
                category: 'food',
                name: t.categories.food,
                baseAmount: monthlyExpenses * 0.15, // 15% of expenses
                inflationRate: baseInflation + 0.5, // Food slightly higher
                color: 'green'
            },
            {
                category: 'healthcare',
                name: t.categories.healthcare,
                baseAmount: monthlyExpenses * 0.10, // 10% of expenses
                inflationRate: baseInflation + 2, // Healthcare much higher
                color: 'red'
            },
            {
                category: 'transportation',
                name: t.categories.transportation,
                baseAmount: monthlyExpenses * 0.15, // 15% of expenses
                inflationRate: baseInflation + 1, // Transportation higher
                color: 'yellow'
            },
            {
                category: 'entertainment',
                name: t.categories.entertainment,
                baseAmount: monthlyExpenses * 0.10, // 10% of expenses
                inflationRate: baseInflation, // Same as general inflation
                color: 'purple'
            },
            {
                category: 'basicExpenses',
                name: t.categories.basicExpenses,
                baseAmount: monthlyExpenses * 0.15, // 15% of expenses
                inflationRate: baseInflation - 0.5, // Basic goods slightly lower
                color: 'gray'
            }
        ].map(cat => ({
            ...cat,
            impact: calculateCategoryImpact(cat.baseAmount, years, cat.inflationRate)
        }));
    };

    // Get inflation scenarios
    const getInflationScenarios = () => {
        const baseInflation = inputs.inflationRate || 3;
        const years = selectedTimeframe === 'retirement' 
            ? (inputs.retirementAge || 67) - (inputs.currentAge || 30)
            : selectedTimeframe === 'milestone10' ? 10
            : selectedTimeframe === 'milestone20' ? 20
            : 0;

        return [
            {
                name: t.scenarios.current,
                rate: baseInflation,
                metrics: calculateInflationMetrics(years, baseInflation),
                color: 'blue'
            },
            {
                name: t.scenarios.moderate,
                rate: baseInflation + 2,
                metrics: calculateInflationMetrics(years, baseInflation + 2),
                color: 'yellow'
            },
            {
                name: t.scenarios.high,
                rate: baseInflation + 4,
                metrics: calculateInflationMetrics(years, baseInflation + 4),
                color: 'red'
            }
        ];
    };

    const timeframeData = getTimeframeData();
    const selectedData = timeframeData.find(t => t.key === selectedTimeframe);
    const expenseCategories = getExpenseCategories();
    const inflationScenarios = getInflationScenarios();

    return React.createElement('div', { className: "bg-white rounded-xl shadow-lg p-6 border border-gray-200" }, [
        // Header
        React.createElement('div', { key: 'header', className: "mb-6" }, [
            React.createElement('h2', { 
                key: 'title',
                className: "text-xl font-bold text-gray-800 flex items-center mb-2" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '📈'),
                t.title
            ]),
            React.createElement('p', { 
                key: 'subtitle',
                className: "text-sm text-gray-600" 
            }, t.subtitle)
        ]),

        // Timeframe Selector
        React.createElement('div', { key: 'timeframe-selector', className: "mb-6" }, [
            React.createElement('div', { 
                key: 'selector-buttons',
                className: "grid grid-cols-2 md:grid-cols-4 gap-2" 
            }, timeframeData.map(tf => 
                React.createElement('button', {
                    key: tf.key,
                    onClick: () => setSelectedTimeframe(tf.key),
                    className: `p-3 rounded-lg text-sm font-medium transition-all ${
                        selectedTimeframe === tf.key
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`
                }, tf.label)
            ))
        ]),

        // Main Metrics Display
        selectedData && React.createElement('div', { key: 'main-metrics', className: "mb-6" }, [
            React.createElement('div', { 
                key: 'metrics-grid',
                className: "grid grid-cols-1 md:grid-cols-3 gap-4" 
            }, [
                // Purchasing Power Loss
                React.createElement('div', { 
                    key: 'power-loss',
                    className: "p-4 bg-red-50 border border-red-200 rounded-lg" 
                }, [
                    React.createElement('h3', { 
                        key: 'power-loss-title',
                        className: "font-semibold text-red-700 mb-2" 
                    }, t.metrics.purchasingPowerLoss),
                    React.createElement('div', { 
                        key: 'power-loss-value',
                        className: "text-2xl font-bold text-red-800" 
                    }, `${selectedData.metrics.purchasingPowerLoss.toFixed(1)}%`),
                    React.createElement('p', { 
                        key: 'power-loss-desc',
                        className: "text-xs text-red-600 mt-1" 
                    }, `${selectedData.years} ${language === 'he' ? 'שנים' : 'years'}`)
                ]),

                // Cost Multiplier
                React.createElement('div', { 
                    key: 'cost-multiplier',
                    className: "p-4 bg-yellow-50 border border-yellow-200 rounded-lg" 
                }, [
                    React.createElement('h3', { 
                        key: 'cost-title',
                        className: "font-semibold text-yellow-700 mb-2" 
                    }, t.metrics.costIncrease),
                    React.createElement('div', { 
                        key: 'cost-value',
                        className: "text-2xl font-bold text-yellow-800" 
                    }, `${selectedData.metrics.costMultiplier.toFixed(2)}x`),
                    React.createElement('p', { 
                        key: 'cost-desc',
                        className: "text-xs text-yellow-600 mt-1" 
                    }, language === 'he' ? 'יותר יקר מהיום' : 'more expensive than today')
                ]),

                // Real Value
                React.createElement('div', { 
                    key: 'real-value',
                    className: "p-4 bg-blue-50 border border-blue-200 rounded-lg" 
                }, [
                    React.createElement('h3', { 
                        key: 'real-title',
                        className: "font-semibold text-blue-700 mb-2" 
                    }, t.metrics.realValue),
                    React.createElement('div', { 
                        key: 'real-value-amount',
                        className: "text-2xl font-bold text-blue-800" 
                    }, `₪${(1000 * selectedData.metrics.realValue).toFixed(0)}`),
                    React.createElement('p', { 
                        key: 'real-desc',
                        className: "text-xs text-blue-600 mt-1" 
                    }, language === 'he' ? 'ערך ₪1,000 של היום' : 'value of today\'s ₪1,000')
                ])
            ])
        ]),

        // Inflation Scenarios Comparison
        React.createElement('div', { key: 'scenarios', className: "mb-6" }, [
            React.createElement('h3', { 
                key: 'scenarios-title',
                className: "font-semibold text-gray-700 mb-4" 
            }, language === 'he' ? 'השוואת תרחישי אינפלציה' : 'Inflation Scenarios Comparison'),
            React.createElement('div', { 
                key: 'scenarios-grid',
                className: "grid grid-cols-1 md:grid-cols-3 gap-4" 
            }, inflationScenarios.map(scenario => 
                React.createElement('div', {
                    key: scenario.name,
                    className: `p-4 border-2 rounded-lg ${
                        scenario.color === 'blue' ? 'border-blue-200 bg-blue-50' :
                        scenario.color === 'yellow' ? 'border-yellow-200 bg-yellow-50' :
                        'border-red-200 bg-red-50'
                    }`
                }, [
                    React.createElement('h4', {
                        key: 'scenario-name',
                        className: `font-semibold mb-2 ${
                            scenario.color === 'blue' ? 'text-blue-700' :
                            scenario.color === 'yellow' ? 'text-yellow-700' :
                            'text-red-700'
                        }`
                    }, scenario.name),
                    React.createElement('div', {
                        key: 'scenario-rate',
                        className: `text-lg font-bold ${
                            scenario.color === 'blue' ? 'text-blue-800' :
                            scenario.color === 'yellow' ? 'text-yellow-800' :
                            'text-red-800'
                        }`
                    }, `${scenario.rate}% ${language === 'he' ? 'שנתי' : 'annual'}`),
                    React.createElement('p', {
                        key: 'scenario-loss',
                        className: `text-sm mt-2 ${
                            scenario.color === 'blue' ? 'text-blue-600' :
                            scenario.color === 'yellow' ? 'text-yellow-600' :
                            'text-red-600'
                        }`
                    }, `${scenario.metrics.purchasingPowerLoss.toFixed(1)}% ${language === 'he' ? 'אובדן כוח קנייה' : 'purchasing power loss'}`)
                ])
            ))
        ]),

        // Detailed Breakdown Toggle
        React.createElement('div', { key: 'toggle', className: "mb-4" }, [
            React.createElement('button', {
                key: 'toggle-btn',
                onClick: () => setShowDetailedBreakdown(!showDetailedBreakdown),
                className: "w-full p-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 transition-colors"
            }, t.toggleDetails)
        ]),

        // Detailed Category Breakdown
        showDetailedBreakdown && React.createElement('div', { key: 'detailed-breakdown', className: "space-y-4" }, [
            React.createElement('h3', { 
                key: 'breakdown-title',
                className: "font-semibold text-gray-700 mb-4" 
            }, language === 'he' ? 'פירוט לפי קטגוריות הוצאה' : 'Breakdown by Expense Categories'),
            
            ...expenseCategories.map(category => 
                React.createElement('div', {
                    key: category.category,
                    className: "p-4 border border-gray-200 rounded-lg"
                }, [
                    React.createElement('div', { key: 'cat-header', className: "flex justify-between items-center mb-3" }, [
                        React.createElement('h4', {
                            key: 'cat-name',
                            className: "font-medium text-gray-800"
                        }, category.name),
                        React.createElement('span', {
                            key: 'cat-rate',
                            className: "text-sm text-gray-600"
                        }, `${category.inflationRate}% ${language === 'he' ? 'שנתי' : 'annual'}`)
                    ]),
                    React.createElement('div', { key: 'cat-comparison', className: "grid grid-cols-2 gap-4" }, [
                        React.createElement('div', { key: 'current' }, [
                            React.createElement('p', {
                                key: 'current-label',
                                className: "text-xs text-gray-600 mb-1"
                            }, language === 'he' ? 'עלות היום' : 'Current Cost'),
                            React.createElement('p', {
                                key: 'current-value',
                                className: "font-semibold text-gray-800"
                            }, `₪${category.impact.currentCost.toLocaleString()}`)
                        ]),
                        React.createElement('div', { key: 'future' }, [
                            React.createElement('p', {
                                key: 'future-label',
                                className: "text-xs text-gray-600 mb-1"
                            }, language === 'he' ? 'עלות עתידית' : 'Future Cost'),
                            React.createElement('p', {
                                key: 'future-value',
                                className: "font-semibold text-red-600"
                            }, `₪${category.impact.futureCost.toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', {
                        key: 'cat-increase',
                        className: "mt-2 text-sm text-red-600"
                    }, `+₪${category.impact.increase.toLocaleString()} (+${category.impact.increasePercentage.toFixed(1)}%)`)
                ])
            )
        ])
    ]);
};

window.InflationAnalysis = InflationAnalysis;
console.log('✅ InflationAnalysis component loaded successfully');