// ResultsDisplay Component - Displays calculated retirement projections and financial summaries with partner data support

const ResultsPanel = ({ 
    results, 
    inputs, 
    workPeriods, 
    language, 
    t, 
    formatCurrency, 
    convertCurrency,
    generateChartData,
    showChart,
    chartData,
    claudeInsights,
    exportRetirementSummary,
    exportAsImage,
    partnerResults = null,
    chartView = 'combined',
    // Icon components
    PiggyBank,
    Calculator,
    DollarSign,
    Target,
    AlertCircle,
    TrendingUp,
    SimpleChart,
    ReadinessScore
) => {
    const chartRef = React.useRef(null);
    const chartInstance = React.useRef(null);

    // Chart rendering effect
    React.useEffect(() => {
        if (effectiveResults && chartRef.current && window.Chart) {
            // Destroy existing chart
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');
            
            // Generate sample projection data
            const generateProjectionData = () => {
                const currentAge = inputs?.currentAge || 30;
                const retirementAge = inputs?.retirementAge || 67;
                const currentSavings = inputs?.currentSavings || 50000;
                const monthlySavings = ((inputs?.currentSalary || 20000) * 0.125) + (inputs?.healthcareCosts || 0); // 12.5% savings rate
                const annualReturn = 0.07; // 7% annual return
                const inflationRate = (inputs?.inflationRate || 3) / 100;
                
                const data = [];
                let nominalValue = currentSavings;
                
                for (let age = currentAge; age <= retirementAge; age++) {
                    const realValue = nominalValue / Math.pow(1 + inflationRate, age - currentAge);
                    data.push({
                        age: age,
                        nominal: Math.round(nominalValue),
                        real: Math.round(realValue)
                    });
                    
                    // Add annual contributions and growth
                    nominalValue = (nominalValue + monthlySavings * 12) * (1 + annualReturn);
                }
                
                return data;
            };

            const projectionData = generateProjectionData();
            
            chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: projectionData.map(d => d.age),
                    datasets: [{
                        label: language === 'he' ? 'ערך נומינלי' : 'Nominal Value',
                        data: projectionData.map(d => d.nominal),
                        borderColor: '#3B82F6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        fill: false,
                        tension: 0.1
                    }, {
                        label: language === 'he' ? 'ערך ריאלי' : 'Real Value',
                        data: projectionData.map(d => d.real),
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: false,
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: language === 'he' ? 'תחזית חיסכון לפנסיה' : 'Retirement Savings Projection'
                        },
                        legend: {
                            display: false // We have custom legend
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: language === 'he' ? 'גיל' : 'Age'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: language === 'he' ? 'סכום (₪)' : 'Amount (₪)'
                            },
                            ticks: {
                                callback: function(value) {
                                    return '₪' + (value / 1000000).toFixed(1) + 'M';
                                }
                            }
                        }
                    }
                }
            });
        }
        
        // Cleanup function
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [effectiveResults, inputs, language]);

    // Data validation for results
    const validateResults = (resultData) => {
        if (!resultData) {
            console.warn('RetirementResultsPanel: No results data provided');
            return false;
        }
        
        if (typeof resultData !== 'object') {
            console.warn('RetirementResultsPanel: Results data must be an object');
            return false;
        }
        
        return true;
    };
    
    // Error handling wrapper
    const safeFormatValue = (value, formatter = null) => {
        try {
            if (value == null || isNaN(value)) return '₪0';
            
            if (formatter && typeof formatter === 'function') {
                return formatter(value);
            }
            
            return `₪${value.toLocaleString()}`;
        } catch (error) {
            console.error('RetirementResultsPanel: Error formatting value:', error);
            return '₪0';
        }
    };
    
    // Handle partner-specific data
    const getEffectiveResults = () => {
        if (inputs?.planningType === 'couple' && partnerResults) {
            if (chartView === 'partner1' && partnerResults.partner1) {
                return partnerResults.partner1;
            } else if (chartView === 'partner2' && partnerResults.partner2) {
                return partnerResults.partner2;
            }
        }
        return results;
    };

    const effectiveResults = getEffectiveResults();

    if (!validateResults(effectiveResults)) {
        return React.createElement('div', { className: 'text-red-500' }, 'Invalid data provided to results panel.');
    }

    return React.createElement('div', { className: "space-y-6" }, [
        // Retirement Readiness Score
        ReadinessScore && React.createElement(ReadinessScore, {
            key: 'readiness-score',
            currentAge: inputs?.currentAge || effectiveResults.currentAge || 30,
            retirementAge: inputs?.retirementAge || effectiveResults.retirementAge || 67,
            currentSavings: inputs?.currentSavings || 50000,
            monthlyContribution: (inputs?.monthlyContribution || 0) + (inputs?.trainingFundMonthly || 0),
            targetRetirementIncome: inputs?.currentMonthlyExpenses || effectiveResults.monthlyIncome || 15000,
            language: language
        }),
        
        React.createElement('div', { 
            key: 'results',
            className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in"
        }, [
            React.createElement('h2', { 
                key: 'title',
                className: "text-2xl font-bold text-green-700 mb-6 flex items-center truncate-multiline truncate-2-lines"
            }, [
                React.createElement(Calculator, { key: 'icon', className: "mr-2" }),
                language === 'he' ? "תוצאות החישוב" : "Calculation Results"
            ]),
            React.createElement('div', { key: 'content', className: "space-y-4" }, [
                React.createElement('div', { key: 'grid', className: "grid grid-cols-2 gap-4" }, [
                    React.createElement('div', { key: 'total' }, [
                        React.createElement('div', { 
                            key: 'label',
                            className: "text-sm font-medium text-gray-700"
                        }, language === 'he' ? "סה\"כ צבירה בפרישה" : "Total Savings at Retirement"),
                        React.createElement('div', { 
                            key: 'value',
                            className: "text-2xl font-bold text-green-600"
                        }, safeFormatValue(effectiveResults.totalSavings, formatCurrency))
                    ]),
                    React.createElement('div', { key: 'monthly' }, [
                        React.createElement('div', { 
                            key: 'label',
                            className: "text-sm font-medium text-gray-700"
                        }, language === 'he' ? "הכנסה חודשית מפנסיה" : "Monthly Pension Income"),
                        React.createElement('div', { 
                            key: 'value',
                            className: "text-2xl font-bold text-blue-600"
                        }, safeFormatValue(effectiveResults.monthlyIncome, formatCurrency))
                    ])
                ])
            ])
        ]),
        
        // Financial Projection Chart
        effectiveResults && React.createElement('div', { 
            key: 'chart-section',
            className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in"
        }, [
            React.createElement('h3', { 
                key: 'chart-title',
                className: "text-xl font-bold text-blue-700 mb-4 flex items-center"
            }, [
                React.createElement('span', { key: 'icon', className: "mr-2" }, '📊'),
                language === 'he' ? "תחזית חיסכון לפנסיה" : "Retirement Savings Projection"
            ]),
            React.createElement('div', {
                key: 'chart-container',
                className: "bg-white rounded-lg p-4"
            }, [
                React.createElement('canvas', {
                    key: 'chart-canvas',
                    id: 'retirementChart',
                    width: 400,
                    height: 200,
                    ref: chartRef
                }),
                // Chart Legend
                React.createElement('div', {
                    key: 'chart-legend',
                    className: "mt-4 grid grid-cols-2 gap-4 text-sm"
                }, [
                    React.createElement('div', {
                        key: 'nominal-legend',
                        className: "flex items-center"
                    }, [
                        React.createElement('div', {
                            key: 'nominal-color',
                            className: "w-4 h-4 bg-blue-500 rounded mr-2"
                        }),
                        React.createElement('span', { key: 'nominal-text' },
                            language === 'he' ? 'ערך נומינלי' : 'Nominal Value')
                    ]),
                    React.createElement('div', {
                        key: 'real-legend', 
                        className: "flex items-center"
                    }, [
                        React.createElement('div', {
                            key: 'real-color',
                            className: "w-4 h-4 bg-green-500 rounded mr-2"
                        }),
                        React.createElement('span', { key: 'real-text' },
                            language === 'he' ? 'ערך ריאלי (מול אינפלציה)' : 'Real Value (inflation-adjusted)')
                    ])
                ])
            ])
        ])
    ]);
};

// Export to window for global access
window.ResultsPanel = ResultsPanel;