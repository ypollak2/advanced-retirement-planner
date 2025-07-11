// Core Application - Advanced Retirement Planner
// Core application with basic components and dynamic loading

(function() {
    'use strict';

    // Icon Components - Simple icon components
    const Calculator = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '📊');

    const TrendingUp = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '📈');

    const DollarSign = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '💰');

    const PiggyBank = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '🏛️');

    const Target = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '🎯');

    const AlertCircle = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '⚠️');

    // Basic Chart Component - Simple chart component
    const SimpleChart = ({ data, type = 'line', language = 'he' }) => {
        const chartRef = React.useRef(null);
        const chartInstance = React.useRef(null);
        
        React.useEffect(() => {
            if (chartRef.current && data && data.length > 0) {
                const ctx = chartRef.current.getContext('2d');
                
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }
                
                const isHebrew = language === 'he';
                
                const chartData = {
                    labels: data.map(d => isHebrew ? `גיל ${d.age}` : `Age ${d.age}`),
                    datasets: [{
                        label: isHebrew ? 'צבירה כוללת' : 'Total Accumulation',
                        data: data.map(d => d.totalSavings || d.value),
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        fill: false,
                        tension: 0.4,
                        borderWidth: 3
                    }]
                };
                
                const config = {
                    type: 'line',
                    data: chartData,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            title: {
                                display: true,
                                text: isHebrew ? 'התפתחות הצבירה לאורך השנים' : 'Accumulation Progress Over Years'
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function(value) {
                                        if (value >= 1000000) {
                                            return '₪' + (value / 1000000).toFixed(1) + 'M';
                                        } else if (value >= 1000) {
                                            return '₪' + (value / 1000).toFixed(0) + 'K';
                                        }
                                        return '₪' + value.toFixed(0);
                                    }
                                }
                            }
                        }
                    }
                };
                
                chartInstance.current = new Chart(ctx, config);
            }
            
            return () => {
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }
            };
        }, [data, type, language]);
        
        return React.createElement('canvas', { 
            ref: chartRef,
            style: { maxHeight: '400px' }
        });
    };

    // Savings Summary Panel Component - Real-time savings overview with multi-currency support
    const SavingsSummaryPanel = ({ inputs, language, t }) => {
        const [exchangeRates, setExchangeRates] = React.useState({
            USD: 3.6, EUR: 4.0, GBP: 4.7, BTC: 180000, ETH: 9000
        });
        
        // Calculate real-time totals with separate contribution and accumulation fees
        const totalSavings = (inputs.currentSavings || 0) + (inputs.trainingFund || 0);
        const yearsToRetirement = (inputs.retirementAge || 67) - (inputs.currentAge || 30);
        const monthlyTotal = (inputs.currentMonthlySalary || 15000) * 0.18 + (inputs.trainingFundContribution || 0); // 18% pension contribution + training fund
        
        // Calculate projected value with separate contribution and accumulation fees (ensure minimum 0.1% to avoid division by zero)
        const netPensionReturn = Math.max(0.1, (inputs.expectedReturn || 7) - (inputs.accumulationFees || 1.0));
        const netTrainingReturn = Math.max(0.1, (inputs.expectedReturn || 7) - (inputs.trainingFundFees || 0.5));
        const avgNetReturn = (netPensionReturn + netTrainingReturn) / 2; // Average return
        
        const projectedWithGrowth = totalSavings * Math.pow(1 + avgNetReturn/100, yearsToRetirement) + 
            (monthlyTotal * 12) * (Math.pow(1 + avgNetReturn/100, yearsToRetirement) - 1) / (avgNetReturn/100);
        
        // Inflation calculations
        const inflationRate = (inputs.inflationRate || 3) / 100;
        const buyingPowerToday = projectedWithGrowth / Math.pow(1 + inflationRate, yearsToRetirement);
        
        const formatCurrency = (amount, symbol = '₪') => {
            return `${symbol}${Math.round(amount).toLocaleString()}`;
        };
        
        return React.createElement('div', { 
            className: "financial-card p-6 animate-slide-up sticky top-4" 
        }, [
            React.createElement('h3', { 
                key: 'title',
                className: "text-xl font-bold text-purple-700 mb-4 flex items-center" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-2" }, '💰'),
                language === 'he' ? 'סיכום חיסכון' : 'Savings Summary'
            ]),
            
            // Current Totals
            React.createElement('div', {
                key: 'current',
                className: "space-y-3 mb-6"
            }, [
                React.createElement('div', {
                    key: 'pension',
                    className: "metric-card metric-neutral p-3"
                }, [
                    React.createElement('div', { className: "text-sm text-blue-700 font-medium" }, 
                        language === 'he' ? 'פנסיה נוכחית' : 'Current Pension'),
                    React.createElement('div', { className: "text-lg font-bold text-blue-800 wealth-amount" }, 
                        formatCurrency(inputs.currentSavings || 0))
                ]),
                
                React.createElement('div', {
                    key: 'training',
                    className: "metric-card metric-positive p-3"
                }, [
                    React.createElement('div', { className: "text-sm text-green-700 font-medium" }, 
                        language === 'he' ? 'קרן השתלמות' : 'Training Fund'),
                    React.createElement('div', { className: "text-lg font-bold text-green-800 wealth-amount" }, 
                        formatCurrency(inputs.trainingFund || 0))
                ]),
                
                React.createElement('div', {
                    key: 'total',
                    className: "metric-card metric-positive p-3"
                }, [
                    React.createElement('div', { className: "text-sm text-purple-700 font-medium" }, 
                        language === 'he' ? 'סך הכל נוכחי' : 'Total Current'),
                    React.createElement('div', { className: "text-xl font-bold text-purple-800 wealth-amount" }, 
                        formatCurrency(totalSavings))
                ])
            ]),
            
            // Monthly Salary & Tax Calculation
            React.createElement('div', {
                key: 'salary-section',
                className: "bg-blue-50 rounded-lg p-3 mb-4 border border-blue-200"
            }, (() => {
                const taxResult = calculateNetSalary(inputs.currentMonthlySalary || 15000, inputs.taxCountry || 'israel');
                const countryName = inputs.taxCountry === 'israel' ? (language === 'he' ? 'ישראל' : 'Israel') :
                                   inputs.taxCountry === 'uk' ? (language === 'he' ? 'בריטניה' : 'UK') :
                                   inputs.taxCountry === 'us' ? (language === 'he' ? 'ארה״ב' : 'US') : '';
                
                return [
                    React.createElement('div', { className: "text-sm text-blue-700 font-medium mb-2" }, 
                        language === 'he' ? `משכורת חודשית (${countryName})` : `Monthly Salary (${countryName})`),
                    React.createElement('div', { className: "grid grid-cols-2 gap-2 text-xs" }, [
                        React.createElement('div', { key: 'gross' }, [
                            React.createElement('div', { className: "text-blue-600" }, 
                                language === 'he' ? 'ברוטו:' : 'Gross:'),
                            React.createElement('div', { className: "font-bold" }, 
                                formatCurrency(inputs.currentMonthlySalary || 15000))
                        ]),
                        React.createElement('div', { key: 'net' }, [
                            React.createElement('div', { className: "text-blue-600" }, 
                                language === 'he' ? 'נטו:' : 'Net:'),
                            React.createElement('div', { className: "font-bold text-blue-800" }, 
                                formatCurrency(taxResult.netSalary))
                        ])
                    ]),
                    React.createElement('div', { className: "text-xs text-blue-600 mt-1" }, 
                        language === 'he' ? `שיעור מס: ${taxResult.taxRate}%` : `Tax Rate: ${taxResult.taxRate}%`)
                ];
            })()),

            // Monthly Contributions
            React.createElement('div', {
                key: 'monthly',
                className: "bg-gray-50 rounded-lg p-3 mb-4"
            }, [
                React.createElement('div', { className: "text-sm text-gray-700 font-medium mb-2" }, 
                    language === 'he' ? 'הפקדות חודשיות' : 'Monthly Contributions'),
                React.createElement('div', { className: "text-base font-bold text-gray-800" }, 
                    formatCurrency(monthlyTotal))
            ]),
            
            // Projected at Retirement
            React.createElement('div', {
                key: 'projected',
                className: "bg-yellow-50 rounded-lg p-3 mb-4 border border-yellow-200"
            }, [
                React.createElement('div', { className: "text-sm text-yellow-700 font-medium" }, 
                    language === 'he' ? 'צפי בפרישה (אחרי דמי ניהול)' : 'Projected at Retirement (After Fees)'),
                React.createElement('div', { className: "text-lg font-bold text-yellow-800" }, 
                    formatCurrency(projectedWithGrowth)),
                React.createElement('div', { className: "text-xs text-yellow-600 mt-1" }, 
                    language === 'he' ? `תשואה נטו ממוצעת: ${avgNetReturn.toFixed(1)}%` : `Avg Net Return: ${avgNetReturn.toFixed(1)}%`)
            ]),
            
            // Buying Power - Total and Monthly
            React.createElement('div', {
                key: 'buying-power',
                className: "bg-orange-50 rounded-lg p-3 mb-4 border border-orange-200"
            }, [
                React.createElement('div', { className: "text-sm text-orange-700 font-medium mb-2" }, 
                    language === 'he' ? 'כוח קנייה היום' : 'Today\'s Buying Power'),
                React.createElement('div', { className: "grid grid-cols-2 gap-2" }, [
                    React.createElement('div', { key: 'total' }, [
                        React.createElement('div', { className: "text-xs text-orange-600" }, 
                            language === 'he' ? 'סה״כ:' : 'Total:'),
                        React.createElement('div', { className: "text-base font-bold text-orange-800" }, 
                            formatCurrency(buyingPowerToday))
                    ]),
                    React.createElement('div', { key: 'monthly' }, [
                        React.createElement('div', { className: "text-xs text-orange-600" }, 
                            language === 'he' ? 'חודשי:' : 'Monthly:'),
                        React.createElement('div', { className: "text-base font-bold text-orange-800" }, 
                            formatCurrency(buyingPowerToday * (avgNetReturn/100) / 12))
                    ])
                ])
            ]),
            
            // Multi-Currency Display
            React.createElement('div', {
                key: 'currencies',
                className: "border-t border-gray-200 pt-4 mb-4"
            }, [
                React.createElement('div', { 
                    key: 'currency-title',
                    className: "text-sm font-medium text-gray-700 mb-3" 
                }, language === 'he' ? 'בערכי מטבעות' : 'In Other Currencies'),
                
                React.createElement('div', {
                    key: 'currency-grid',
                    className: "grid grid-cols-2 gap-2 text-xs"
                }, [
                    ['USD', '$'], ['EUR', '€'], ['GBP', '£'], ['BTC', '₿'], ['ETH', 'Ξ']
                ].map(([currency, symbol]) => 
                    React.createElement('div', {
                        key: currency,
                        className: "bg-gray-100 rounded px-2 py-1"
                    }, [
                        React.createElement('div', { className: "font-medium" }, currency),
                        React.createElement('div', { className: "text-gray-600" }, 
                            currency === 'BTC' || currency === 'ETH' ? 
                                `${symbol}${(totalSavings / exchangeRates[currency]).toFixed(4)}` :
                                `${symbol}${Math.round(totalSavings / exchangeRates[currency]).toLocaleString()}`
                        )
                    ])
                ))
            ]),
            
            // Enhanced Financial Forecast
            React.createElement('div', {
                key: 'financial-forecast',
                className: "border-t border-gray-200 pt-4 space-y-3"
            }, [
                React.createElement('div', { 
                    key: 'forecast-title',
                    className: "section-header text-sm font-medium text-gray-700 mb-3 flex items-center" 
                }, [
                    React.createElement('span', { key: 'icon', className: "mr-2" }, '🔮'),
                    language === 'he' ? 'תחזית פיננסית' : 'Financial Forecast'
                ]),
                
                // Retirement projections
                React.createElement('div', { 
                    key: 'projections',
                    className: "space-y-2" 
                }, [
                    React.createElement('div', {
                        key: 'projected-value',
                        className: "metric-card metric-positive p-3"
                    }, [
                        React.createElement('div', { className: "text-xs text-gray-600" }, 
                            language === 'he' ? 'צבירה צפויה בגיל פרישה' : 'Projected Retirement Value'),
                        React.createElement('div', { className: "text-lg font-bold text-green-700 wealth-amount" }, 
                            formatCurrency(projectedWithGrowth)),
                        React.createElement('div', { className: "text-xs text-gray-500 mt-1" }, 
                            `${language === 'he' ? 'בעוד' : 'In'} ${yearsToRetirement} ${language === 'he' ? 'שנים' : 'years'}`)
                    ]),
                    
                    React.createElement('div', {
                        key: 'buying-power',
                        className: "metric-card metric-warning p-3"
                    }, [
                        React.createElement('div', { className: "text-xs text-gray-600" }, 
                            language === 'he' ? 'כוח קנייה (נכון להיום)' : 'Buying Power (Today\'s Value)'),
                        React.createElement('div', { className: "text-lg font-bold text-orange-700 wealth-amount" }, 
                            formatCurrency(buyingPowerToday)),
                        React.createElement('div', { className: "text-xs text-gray-500 mt-1" }, 
                            `${language === 'he' ? 'לאחר אינפלציה של' : 'After'} ${(inputs.inflationRate || 3)}% ${language === 'he' ? '' : 'inflation'}`)
                    ]),
                    
                    React.createElement('div', {
                        key: 'monthly-income',
                        className: "metric-card metric-neutral p-3"
                    }, [
                        React.createElement('div', { className: "text-xs text-gray-600" }, 
                            language === 'he' ? 'הכנסה חודשית בפרישה' : 'Monthly Retirement Income'),
                        React.createElement('div', { className: "text-lg font-bold text-blue-700 wealth-amount" }, 
                            formatCurrency(projectedWithGrowth * (avgNetReturn/100) / 12)),
                        React.createElement('div', { className: "text-xs text-gray-500 mt-1" }, 
                            `${(avgNetReturn).toFixed(1)}% ${language === 'he' ? 'תשואה שנתית' : 'annual return'}`)
                    ])
                ]),
                
                // Progress indicators
                React.createElement('div', { 
                    key: 'progress',
                    className: "space-y-2 mt-4" 
                }, [
                    React.createElement('div', { className: "text-xs text-gray-600 mb-1" }, 
                        language === 'he' ? 'התקדמות לקראת פרישה' : 'Progress to Retirement'),
                    React.createElement('div', { className: "progress-bar" }, [
                        React.createElement('div', { 
                            className: "progress-fill",
                            style: { 
                                width: `${Math.min(100, ((inputs.currentAge || 30) - 25) / ((inputs.retirementAge || 67) - 25) * 100)}%` 
                            }
                        })
                    ]),
                    React.createElement('div', { className: "text-xs text-gray-500 text-center" }, 
                        `${Math.round(((inputs.currentAge || 30) - 25) / ((inputs.retirementAge || 67) - 25) * 100)}% ${language === 'he' ? 'מהדרך' : 'complete'}`)
                ])
            ]),
            
            // Export Buttons
            React.createElement('div', {
                key: 'export-buttons',
                className: "border-t border-gray-200 pt-4 space-y-2"
            }, [
                React.createElement('div', { 
                    key: 'export-title',
                    className: "text-sm font-medium text-gray-700 mb-3" 
                }, language === 'he' ? 'ייצוא נתונים' : 'Export Data'),
                
                React.createElement('button', {
                    key: 'export-png',
                    onClick: exportToPNG,
                    className: "btn-primary w-full text-sm flex items-center justify-center space-x-2"
                }, [
                    React.createElement('span', { key: 'icon' }, '🖼️'),
                    React.createElement('span', { key: 'text' }, language === 'he' ? 'ייצא כתמונה' : 'Export as PNG')
                ]),
                
                React.createElement('button', {
                    key: 'export-ai',
                    onClick: exportForAI,
                    className: "btn-primary w-full text-sm flex items-center justify-center space-x-2"
                }, [
                    React.createElement('span', { key: 'icon' }, '🤖'),
                    React.createElement('span', { key: 'text' }, language === 'he' ? 'ייצא לכלי AI' : 'Export for AI Tools')
                ]),
                
                React.createElement('button', {
                    key: 'show-chart',
                    onClick: () => setShowChart(true),
                    className: "btn-primary w-full text-sm flex items-center justify-center space-x-2"
                }, [
                    React.createElement('span', { key: 'icon' }, '📊'),
                    React.createElement('span', { key: 'text' }, language === 'he' ? 'ייצוג גרפי' : 'Graphical View')
                ]),
                
                React.createElement('button', {
                    key: 'llm-analysis',
                    onClick: generateLLMAnalysis,
                    className: "btn-primary w-full text-sm flex items-center justify-center space-x-2"
                }, [
                    React.createElement('span', { key: 'icon' }, '🧠'),
                    React.createElement('span', { key: 'text' }, language === 'he' ? 'ניתוח AI' : 'LLM Analysis')
                ])
            ])
        ]);
    };

    // Basic Inputs Component - Basic input form
    const BasicInputs = ({ inputs, setInputs, language, t }) => {
        return React.createElement('div', { className: "space-y-6" }, [
            // Basic Data Section
            React.createElement('div', { 
                key: 'basic-data',
                className: "financial-card p-6 animate-slide-up" 
            }, [
                React.createElement('h2', { 
                    key: 'title',
                    className: "text-2xl font-bold text-purple-700 mb-6 flex items-center" 
                }, [
                    React.createElement(Calculator, { key: 'icon', className: "mr-2" }),
                    t.basic || 'Basic Information'
                ]),
                React.createElement('div', { 
                    key: 'content',
                    className: "space-y-4" 
                }, [
                    // Planning Type Selection (Single/Couple)
                    React.createElement('div', { 
                        key: 'planning-type',
                        className: "mb-6" 
                    }, [
                        React.createElement('label', { 
                            className: "block text-sm font-medium text-gray-700 mb-3" 
                        }, language === 'he' ? "סוג התכנון" : "Planning Type"),
                        React.createElement('div', { 
                            className: "grid grid-cols-2 gap-3" 
                        }, [
                            React.createElement('button', {
                                type: 'button',
                                onClick: () => setInputs({...inputs, planningType: 'single'}),
                                className: `p-3 rounded-lg border-2 transition-all text-center ${
                                    (inputs.planningType || 'single') === 'single' 
                                        ? 'border-purple-500 bg-purple-50 text-purple-700' 
                                        : 'border-gray-200 bg-white hover:border-purple-300'
                                }`
                            }, [
                                React.createElement('div', { className: "font-medium" }, 
                                    language === 'he' ? 'רווק/ה' : 'Single'),
                                React.createElement('div', { className: "text-xs opacity-75" }, 
                                    language === 'he' ? 'תכנון אישי' : 'Individual planning')
                            ]),
                            React.createElement('button', {
                                type: 'button',
                                onClick: () => setInputs({...inputs, planningType: 'couple'}),
                                className: `p-3 rounded-lg border-2 transition-all text-center ${
                                    inputs.planningType === 'couple' 
                                        ? 'border-purple-500 bg-purple-50 text-purple-700' 
                                        : 'border-gray-200 bg-white hover:border-purple-300'
                                }`
                            }, [
                                React.createElement('div', { className: "font-medium" }, 
                                    language === 'he' ? 'זוג' : 'Couple'),
                                React.createElement('div', { className: "text-xs opacity-75" }, 
                                    language === 'he' ? 'תכנון משותף' : 'Joint planning')
                            ])
                        ])
                    ]),
                    
                    // Partner Information (if couple selected)
                    inputs.planningType === 'couple' && React.createElement('div', { 
                        key: 'partner-info',
                        className: "bg-pink-50 rounded-lg p-4 border border-pink-200 mb-4" 
                    }, [
                        React.createElement('h3', { 
                            className: "text-lg font-semibold text-pink-700 mb-4 flex items-center" 
                        }, [
                            React.createElement('span', { key: 'icon', className: "mr-2" }, '👫'),
                            language === 'he' ? 'פרטי בני הזוג' : 'Partner Information'
                        ]),
                        React.createElement('div', { 
                            className: "grid grid-cols-1 md:grid-cols-2 gap-6" 
                        }, [
                            // Partner 1
                            React.createElement('div', { 
                                key: 'partner1',
                                className: "bg-white rounded-lg p-4 border border-pink-300" 
                            }, [
                                React.createElement('h4', { 
                                    className: "font-medium text-pink-700 mb-3" 
                                }, language === 'he' ? 'בן/בת זוג 1' : 'Partner 1'),
                                React.createElement('div', { className: "space-y-3" }, [
                                    React.createElement('div', {}, [
                                        React.createElement('label', { 
                                            className: "block text-sm font-medium text-gray-700 mb-1" 
                                        }, language === 'he' ? 'גיל' : 'Age'),
                                        React.createElement('input', {
                                            type: 'number',
                                            value: inputs.partner1Age || '',
                                            onChange: (e) => setInputs({...inputs, partner1Age: parseInt(e.target.value) || 0}),
                                            className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 text-sm"
                                        })
                                    ]),
                                    React.createElement('div', {}, [
                                        React.createElement('label', { 
                                            className: "block text-sm font-medium text-gray-700 mb-1" 
                                        }, language === 'he' ? 'משכורת חודשית' : 'Monthly Salary'),
                                        React.createElement('input', {
                                            type: 'number',
                                            value: inputs.partner1Salary || '',
                                            onChange: (e) => setInputs({...inputs, partner1Salary: parseInt(e.target.value) || 0}),
                                            className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 text-sm"
                                        })
                                    ])
                                ])
                            ]),
                            // Partner 2
                            React.createElement('div', { 
                                key: 'partner2',
                                className: "bg-white rounded-lg p-4 border border-pink-300" 
                            }, [
                                React.createElement('h4', { 
                                    className: "font-medium text-pink-700 mb-3" 
                                }, language === 'he' ? 'בן/בת זוג 2' : 'Partner 2'),
                                React.createElement('div', { className: "space-y-3" }, [
                                    React.createElement('div', {}, [
                                        React.createElement('label', { 
                                            className: "block text-sm font-medium text-gray-700 mb-1" 
                                        }, language === 'he' ? 'גיל' : 'Age'),
                                        React.createElement('input', {
                                            type: 'number',
                                            value: inputs.partner2Age || '',
                                            onChange: (e) => setInputs({...inputs, partner2Age: parseInt(e.target.value) || 0}),
                                            className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 text-sm"
                                        })
                                    ]),
                                    React.createElement('div', {}, [
                                        React.createElement('label', { 
                                            className: "block text-sm font-medium text-gray-700 mb-1" 
                                        }, language === 'he' ? 'משכורת חודשית' : 'Monthly Salary'),
                                        React.createElement('input', {
                                            type: 'number',
                                            value: inputs.partner2Salary || '',
                                            onChange: (e) => setInputs({...inputs, partner2Salary: parseInt(e.target.value) || 0}),
                                            className: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 text-sm"
                                        })
                                    ])
                                ])
                            ])
                        ])
                    ]),

                    React.createElement('div', { 
                        key: 'row1',
                        className: "grid grid-cols-2 gap-4" 
                    }, [
                        React.createElement('div', { key: 'age' }, [
                            React.createElement('label', { 
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.currentAge || 'Current Age'),
                            React.createElement('input', {
                                type: 'number',
                                value: inputs.currentAge,
                                onChange: (e) => setInputs({...inputs, currentAge: parseInt(e.target.value) || 0}),
                                className: "financial-input"
                            })
                        ]),
                        React.createElement('div', { key: 'retirement' }, [
                            React.createElement('label', { 
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.retirementAge || 'Retirement Age'),
                            React.createElement('input', {
                                type: 'number',
                                value: inputs.retirementAge,
                                onChange: (e) => setInputs({...inputs, retirementAge: parseInt(e.target.value) || 0}),
                                className: "financial-input"
                            })
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'row2',
                        className: "grid grid-cols-2 gap-4" 
                    }, [
                        React.createElement('div', { key: 'savings' }, [
                            React.createElement('label', { 
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, language === 'he' ? "חיסכון נוכחי בפנסיה (₪)" : "Current Pension Savings (₪)"),
                            React.createElement('input', {
                                type: 'number',
                                value: inputs.currentSavings,
                                onChange: (e) => setInputs({...inputs, currentSavings: parseInt(e.target.value) || 0}),
                                className: "financial-input"
                            })
                        ]),
                        React.createElement('div', { key: 'training-fund' }, [
                            React.createElement('label', { 
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, language === 'he' ? "קרן השתלמות נוכחית (₪)" : "Current Training Fund (₪)"),
                            React.createElement('input', {
                                type: 'number',
                                value: inputs.trainingFund || 0,
                                onChange: (e) => setInputs({...inputs, trainingFund: parseInt(e.target.value) || 0}),
                                className: "financial-input"
                            })
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'row3',
                        className: "grid grid-cols-2 gap-4" 
                    }, [
                        React.createElement('div', { key: 'salary' }, [
                            React.createElement('label', { 
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, language === 'he' ? "משכורת חודשית (₪)" : "Monthly Salary (₪)"),
                            React.createElement('input', {
                                type: 'number',
                                value: inputs.currentMonthlySalary || 15000,
                                onChange: (e) => setInputs({...inputs, currentMonthlySalary: parseInt(e.target.value) || 0}),
                                className: "financial-input"
                            })
                        ]),
                        React.createElement('div', { key: 'training-contribution' }, [
                            React.createElement('label', { 
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, language === 'he' ? "הפקדה חודשית לקרן השתלמות (₪)" : "Monthly Training Fund Contribution (₪)"),
                            React.createElement('input', {
                                type: 'number',
                                value: inputs.trainingFundContribution || Math.round((inputs.currentMonthlySalary || 15000) * 0.075), // 7.5% default
                                onChange: (e) => setInputs({...inputs, trainingFundContribution: parseInt(e.target.value) || 0}),
                                className: "financial-input"
                            })
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'row4',
                        className: "grid grid-cols-2 gap-4" 
                    }, [
                        React.createElement('div', { key: 'contribution-fees' }, [
                            React.createElement('label', { 
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, language === 'he' ? "דמי ניהול מהפקדות (%)" : "Management Fees on Contributions (%)"),
                            React.createElement('input', {
                                type: 'number',
                                step: '0.1',
                                value: inputs.contributionFees || 1.0,
                                onChange: (e) => setInputs({...inputs, contributionFees: parseFloat(e.target.value) || 0}),
                                className: "financial-input"
                            })
                        ]),
                        React.createElement('div', { key: 'expected-yield' }, [
                            React.createElement('label', { 
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, language === 'he' ? "תשואה שנתית צפויה (%)" : "Expected Annual Yield (%)"),
                            React.createElement('input', {
                                type: 'number',
                                step: '0.1',
                                value: inputs.expectedReturn || 7,
                                onChange: (e) => setInputs({...inputs, expectedReturn: parseFloat(e.target.value) || 0}),
                                className: "financial-input"
                            })
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'row5',
                        className: "grid grid-cols-2 gap-4" 
                    }, [
                        React.createElement('div', { key: 'accumulation-fees' }, [
                            React.createElement('label', { 
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, language === 'he' ? "דמי ניהול מצבירה (%)" : "Management Fees on Accumulation (%)"),
                            React.createElement('input', {
                                type: 'number',
                                step: '0.1',
                                value: inputs.accumulationFees || 0.1,
                                onChange: (e) => setInputs({...inputs, accumulationFees: parseFloat(e.target.value) || 0}),
                                className: "financial-input"
                            })
                        ]),
                        React.createElement('div', { key: 'inflation' }, [
                            React.createElement('label', { 
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, language === 'he' ? "שיעור אינפלציה שנתי (%)" : "Annual Inflation Rate (%)"),
                            React.createElement('input', {
                                type: 'number',
                                step: '0.1',
                                value: inputs.inflationRate || 3,
                                onChange: (e) => setInputs({...inputs, inflationRate: parseFloat(e.target.value) || 0}),
                                className: "financial-input"
                            })
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'row6',
                        className: "grid grid-cols-2 gap-4" 
                    }, [
                        React.createElement('div', { key: 'training-fund-fees' }, [
                            React.createElement('label', { 
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, language === 'he' ? "דמי ניהול קרן השתלמות (%)" : "Training Fund Management Fees (%)"),
                            React.createElement('input', {
                                type: 'number',
                                step: '0.1',
                                value: inputs.trainingFundFees || 0.6,
                                onChange: (e) => setInputs({...inputs, trainingFundFees: parseFloat(e.target.value) || 0}),
                                className: "financial-input"
                            })
                        ]),
                        React.createElement('div', { key: 'tax-country' }, [
                            React.createElement('label', { 
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, language === 'he' ? "מדינה למס הכנסה" : "Tax Country"),
                            React.createElement('select', {
                                value: inputs.taxCountry || 'israel',
                                onChange: (e) => setInputs({...inputs, taxCountry: e.target.value}),
                                className: "financial-input"
                            }, [
                                React.createElement('option', { key: 'israel', value: 'israel' }, 
                                    language === 'he' ? 'ישראל' : 'Israel'),
                                React.createElement('option', { key: 'uk', value: 'uk' }, 
                                    language === 'he' ? 'בריטניה' : 'United Kingdom'),
                                React.createElement('option', { key: 'us', value: 'us' }, 
                                    language === 'he' ? 'ארה״ב' : 'United States')
                            ])
                        ])
                    ])
                ])
            ])
        ]);
    };

    // Tax Calculation Functions - Calculate net take-home salary by country
    const calculateNetSalary = (grossSalary, taxCountry) => {
        switch (taxCountry) {
            case 'israel':
                return calculateIsraeliTax(grossSalary);
            case 'uk':
                return calculateUKTax(grossSalary);
            case 'us':
                return calculateUSTax(grossSalary);
            default:
                return { netSalary: grossSalary, taxRate: 0 };
        }
    };

    // Israeli Tax Calculation (2024 rates)
    const calculateIsraeliTax = (monthlyGross) => {
        const annualGross = monthlyGross * 12;
        let totalTax = 0;
        let remainingIncome = annualGross;

        // Israeli tax brackets 2024 (NIS)
        const brackets = [
            { min: 0, max: 81480, rate: 0.10 },
            { min: 81480, max: 116760, rate: 0.14 },
            { min: 116760, max: 188280, rate: 0.20 },
            { min: 188280, max: 269280, rate: 0.31 },
            { min: 269280, max: 558240, rate: 0.35 },
            { min: 558240, max: 718440, rate: 0.47 },
            { min: 718440, max: Infinity, rate: 0.50 }
        ];

        // Calculate tax by brackets
        for (const bracket of brackets) {
            if (remainingIncome <= 0) break;
            
            const taxableInThisBracket = Math.min(remainingIncome, bracket.max - bracket.min);
            if (taxableInThisBracket > 0) {
                totalTax += taxableInThisBracket * bracket.rate;
                remainingIncome -= taxableInThisBracket;
            }
        }

        // Health insurance (2.5%) and National Insurance (12% up to ceiling)
        const healthInsurance = annualGross * 0.025;
        const nationalInsuranceCeiling = 481620; // 2024 ceiling
        const nationalInsurance = Math.min(annualGross, nationalInsuranceCeiling) * 0.12;

        const totalDeductions = totalTax + healthInsurance + nationalInsurance;
        const netAnnual = annualGross - totalDeductions;
        const netMonthly = netAnnual / 12;

        return {
            netSalary: Math.round(netMonthly),
            taxRate: Math.round((totalDeductions / annualGross) * 100),
            breakdown: {
                incomeTax: Math.round(totalTax),
                healthInsurance: Math.round(healthInsurance),
                nationalInsurance: Math.round(nationalInsurance)
            }
        };
    };

    // UK Tax Calculation (2024/25 rates) - Simplified
    const calculateUKTax = (monthlyGross) => {
        const annualGross = monthlyGross * 12;
        let incomeTax = 0;
        
        // UK tax brackets 2024/25 (GBP converted to NIS at ~4.7 rate)
        const personalAllowance = 12570 * 4.7; // £12,570 -> NIS
        const basicRateLimit = 50270 * 4.7; // £50,270 -> NIS
        const higherRateLimit = 125140 * 4.7; // £125,140 -> NIS

        if (annualGross > personalAllowance) {
            const taxableIncome = annualGross - personalAllowance;
            
            if (taxableIncome <= basicRateLimit - personalAllowance) {
                incomeTax = taxableIncome * 0.20;
            } else if (taxableIncome <= higherRateLimit - personalAllowance) {
                incomeTax = (basicRateLimit - personalAllowance) * 0.20 + 
                           (taxableIncome - (basicRateLimit - personalAllowance)) * 0.40;
            } else {
                incomeTax = (basicRateLimit - personalAllowance) * 0.20 + 
                           (higherRateLimit - basicRateLimit) * 0.40 + 
                           (taxableIncome - (higherRateLimit - personalAllowance)) * 0.45;
            }
        }

        // National Insurance (12% on income above £12,570)
        const nationalInsurance = Math.max(0, (annualGross - personalAllowance) * 0.12);
        
        const totalDeductions = incomeTax + nationalInsurance;
        const netMonthly = (annualGross - totalDeductions) / 12;

        return {
            netSalary: Math.round(netMonthly),
            taxRate: Math.round((totalDeductions / annualGross) * 100),
            breakdown: {
                incomeTax: Math.round(incomeTax),
                nationalInsurance: Math.round(nationalInsurance)
            }
        };
    };

    // US Tax Calculation (2024 rates) - Simplified federal only
    const calculateUSTax = (monthlyGross) => {
        const annualGross = monthlyGross * 12;
        let federalTax = 0;
        
        // US federal tax brackets 2024 (USD converted to NIS at ~3.6 rate)
        const standardDeduction = 14600 * 3.6; // $14,600 -> NIS
        const brackets = [
            { min: 0, max: 11000 * 3.6, rate: 0.10 },
            { min: 11000 * 3.6, max: 44725 * 3.6, rate: 0.12 },
            { min: 44725 * 3.6, max: 95375 * 3.6, rate: 0.22 },
            { min: 95375 * 3.6, max: 182050 * 3.6, rate: 0.24 },
            { min: 182050 * 3.6, max: 231250 * 3.6, rate: 0.32 },
            { min: 231250 * 3.6, max: 578125 * 3.6, rate: 0.35 },
            { min: 578125 * 3.6, max: Infinity, rate: 0.37 }
        ];

        const taxableIncome = Math.max(0, annualGross - standardDeduction);
        let remainingIncome = taxableIncome;

        for (const bracket of brackets) {
            if (remainingIncome <= 0) break;
            
            const taxableInThisBracket = Math.min(remainingIncome, bracket.max - bracket.min);
            if (taxableInThisBracket > 0) {
                federalTax += taxableInThisBracket * bracket.rate;
                remainingIncome -= taxableInThisBracket;
            }
        }

        // Social Security and Medicare (7.65% total)
        const socialSecurityLimit = 160200 * 3.6; // $160,200 -> NIS
        const socialSecurity = Math.min(annualGross, socialSecurityLimit) * 0.062;
        const medicare = annualGross * 0.0145;
        
        const totalDeductions = federalTax + socialSecurity + medicare;
        const netMonthly = (annualGross - totalDeductions) / 12;

        return {
            netSalary: Math.round(netMonthly),
            taxRate: Math.round((totalDeductions / annualGross) * 100),
            breakdown: {
                federalTax: Math.round(federalTax),
                socialSecurity: Math.round(socialSecurity),
                medicare: Math.round(medicare)
            }
        };
    };

    // Export Functions - PNG and AI-compatible exports
    const exportToPNG = async () => {
        try {
            // Create a canvas element for export
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 800;
            canvas.height = 1000;
            
            // Set background
            ctx.fillStyle = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add white background for content
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.roundRect = function(x, y, width, height, radius) {
                this.beginPath();
                this.moveTo(x + radius, y);
                this.lineTo(x + width - radius, y);
                this.quadraticCurveTo(x + width, y, x + width, y + radius);
                this.lineTo(x + width, y + height - radius);
                this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                this.lineTo(x + radius, y + height);
                this.quadraticCurveTo(x, y + height, x, y + height - radius);
                this.lineTo(x, y + radius);
                this.quadraticCurveTo(x, y, x + radius, y);
                this.closePath();
            };
            ctx.roundRect(50, 50, 700, 900, 20);
            ctx.fill();
            
            // Add title
            ctx.fillStyle = '#4C1D95';
            ctx.font = 'bold 32px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(language === 'he' ? 'סיכום תכנון פרישה' : 'Retirement Planning Summary', 400, 120);
            
            // Add current data
            const taxResult = calculateNetSalary(inputs.currentMonthlySalary || 15000, inputs.taxCountry || 'israel');
            const totalSavings = (inputs.currentSavings || 0) + (inputs.trainingFund || 0);
            
            let yPos = 180;
            ctx.font = '18px Arial';
            ctx.textAlign = 'left';
            
            // Personal Info
            ctx.fillStyle = '#1F2937';
            ctx.fillText(language === 'he' ? 'פרטים אישיים:' : 'Personal Information:', 80, yPos);
            yPos += 40;
            ctx.font = '16px Arial';
            ctx.fillText(`${language === 'he' ? 'גיל:' : 'Age:'} ${inputs.currentAge}`, 100, yPos);
            yPos += 30;
            ctx.fillText(`${language === 'he' ? 'גיל פרישה:' : 'Retirement Age:'} ${inputs.retirementAge}`, 100, yPos);
            yPos += 30;
            
            // Financial Info
            yPos += 20;
            ctx.font = '18px Arial';
            ctx.fillText(language === 'he' ? 'מידע פיננסי:' : 'Financial Information:', 80, yPos);
            yPos += 40;
            ctx.font = '16px Arial';
            ctx.fillText(`${language === 'he' ? 'משכורת ברוטו:' : 'Gross Salary:'} ₪${(inputs.currentMonthlySalary || 0).toLocaleString()}`, 100, yPos);
            yPos += 30;
            ctx.fillText(`${language === 'he' ? 'משכורת נטו:' : 'Net Salary:'} ₪${taxResult.netSalary.toLocaleString()}`, 100, yPos);
            yPos += 30;
            ctx.fillText(`${language === 'he' ? 'חיסכון נוכחי:' : 'Current Savings:'} ₪${totalSavings.toLocaleString()}`, 100, yPos);
            yPos += 30;
            
            // Tax & Fees Info
            yPos += 20;
            ctx.font = '18px Arial';
            ctx.fillText(language === 'he' ? 'מסים ודמי ניהול:' : 'Taxes & Fees:', 80, yPos);
            yPos += 40;
            ctx.font = '16px Arial';
            ctx.fillText(`${language === 'he' ? 'שיעור מס:' : 'Tax Rate:'} ${taxResult.taxRate}%`, 100, yPos);
            yPos += 30;
            ctx.fillText(`${language === 'he' ? 'דמי ניהול הפקדות:' : 'Contribution Fees:'} ${inputs.contributionFees || 0.5}%`, 100, yPos);
            yPos += 30;
            ctx.fillText(`${language === 'he' ? 'דמי ניהול צבירה:' : 'Accumulation Fees:'} ${inputs.accumulationFees || 1.0}%`, 100, yPos);
            yPos += 30;
            
            // Results (if available)
            if (results) {
                yPos += 20;
                ctx.font = '18px Arial';
                ctx.fillText(language === 'he' ? 'תוצאות:' : 'Results:', 80, yPos);
                yPos += 40;
                ctx.font = '16px Arial';
                ctx.fillText(`${language === 'he' ? 'צבירה צפויה:' : 'Expected Total:'} ₪${Math.round(results.totalSavings).toLocaleString()}`, 100, yPos);
                yPos += 30;
                ctx.fillText(`${language === 'he' ? 'הכנסה חודשית:' : 'Monthly Income:'} ₪${Math.round(results.monthlyIncome).toLocaleString()}`, 100, yPos);
                yPos += 30;
            }
            
            // Footer
            ctx.font = '12px Arial';
            ctx.fillStyle = '#6B7280';
            ctx.textAlign = 'center';
            ctx.fillText(`Generated on ${new Date().toLocaleDateString()} | Advanced Retirement Planner v4.0.0`, 400, 920);
            
            // Convert to blob and download
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `retirement-summary-${new Date().toISOString().split('T')[0]}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });
            
        } catch (error) {
            console.error('Error exporting PNG:', error);
            alert(language === 'he' ? 'שגיאה בייצוא PNG' : 'Error exporting PNG');
        }
    };

    // LLM Analysis Generation - Generate insights about retirement plan
    const generateLLMAnalysis = () => {
        try {
            const taxResult = calculateNetSalary(inputs.currentMonthlySalary || 15000, inputs.taxCountry || 'israel');
            const totalSavings = (inputs.currentSavings || 0) + (inputs.trainingFund || 0);
            const yearsToRetirement = (inputs.retirementAge || 67) - (inputs.currentAge || 30);
            
            let analysis = "## Retirement Plan Analysis\n\n";
            
            // Current Status Analysis
            analysis += "### Current Financial Status\n";
            analysis += `- Age: ${inputs.currentAge}, planning to retire at ${inputs.retirementAge} (${yearsToRetirement} years)\n`;
            analysis += `- Monthly gross salary: ₪${(inputs.currentMonthlySalary || 0).toLocaleString()}\n`;
            analysis += `- Monthly net salary: ₪${taxResult.netSalary.toLocaleString()} (${taxResult.taxRate}% tax)\n`;
            analysis += `- Current total savings: ₪${totalSavings.toLocaleString()}\n\n`;
            
            // Results Analysis
            if (results) {
                analysis += "### Projected Retirement Outlook\n";
                analysis += `- Expected total accumulation: ₪${Math.round(results.totalSavings).toLocaleString()}\n`;
                analysis += `- Monthly retirement income: ₪${Math.round(results.monthlyIncome).toLocaleString()}\n`;
                analysis += `- Replacement ratio: ${((results.monthlyIncome / inputs.currentMonthlySalary) * 100).toFixed(1)}% of current salary\n\n`;
                
                // Recommendations based on results
                analysis += "### Recommendations\n";
                const replacementRatio = (results.monthlyIncome / inputs.currentMonthlySalary) * 100;
                
                if (replacementRatio >= 70) {
                    analysis += "✅ **Excellent**: Your plan provides a strong replacement ratio of " + replacementRatio.toFixed(1) + "%\n";
                } else if (replacementRatio >= 50) {
                    analysis += "⚠️ **Moderate**: Your plan provides " + replacementRatio.toFixed(1) + "% replacement. Consider:\n";
                    analysis += "- Increasing monthly contributions\n";
                    analysis += "- Extending working years\n";
                    analysis += "- Reducing management fees if possible\n";
                } else {
                    analysis += "🚨 **Attention Needed**: Only " + replacementRatio.toFixed(1) + "% replacement ratio. Urgent action required:\n";
                    analysis += "- Significantly increase savings rate\n";
                    analysis += "- Consider postponing retirement\n";
                    analysis += "- Optimize investment strategy\n";
                }
                
                // Fee Impact Analysis
                const feeImpactPercent = (results.managementFeeImpact / results.totalSavings) * 100;
                analysis += `\n### Fee Impact Analysis\n`;
                analysis += `- Total fee impact: ₪${Math.round(results.managementFeeImpact).toLocaleString()} (${feeImpactPercent.toFixed(1)}% of total)\n`;
                analysis += `- Annual fee structure: ${inputs.contributionFees}% on contributions + ${inputs.accumulationFees}% on accumulation\n`;
                
                if (feeImpactPercent > 15) {
                    analysis += "⚠️ **High fees**: Consider negotiating lower fees or changing providers\n";
                } else if (feeImpactPercent > 10) {
                    analysis += "💡 **Moderate fees**: Reasonable but monitor for better options\n";
                } else {
                    analysis += "✅ **Low fees**: Excellent fee structure\n";
                }
            }
            
            // Tax Optimization
            analysis += `\n### Tax Considerations (${inputs.taxCountry?.toUpperCase()})\n`;
            analysis += `- Current effective tax rate: ${taxResult.taxRate}%\n`;
            if (inputs.taxCountry === 'israel') {
                analysis += "- Consider maximizing pension contributions for tax benefits\n";
                analysis += "- Training fund provides tax-free withdrawals after 6 years\n";
            }
            
            // Next Steps
            analysis += "\n### Recommended Next Steps\n";
            analysis += "1. Review and adjust savings rate based on replacement ratio\n";
            analysis += "2. Optimize fee structure with your pension provider\n";
            analysis += "3. Consider additional savings vehicles (real estate, stocks)\n";
            analysis += "4. Plan for inflation impact on purchasing power\n";
            analysis += "5. Reassess plan annually or after major life changes\n";
            
            setLlmAnalysis(analysis);
            
        } catch (error) {
            console.error('Error generating LLM analysis:', error);
            setLlmAnalysis("Error generating analysis. Please ensure all required fields are filled.");
        }
    };

    // AI Tools Export - Generate structured data for Gemini/OpenAI
    const exportForAI = () => {
        try {
            const taxResult = calculateNetSalary(inputs.currentMonthlySalary || 15000, inputs.taxCountry || 'israel');
            const totalSavings = (inputs.currentSavings || 0) + (inputs.trainingFund || 0);
            
            const aiData = {
                version: "4.0.0",
                timestamp: new Date().toISOString(),
                language: language,
                personalInfo: {
                    currentAge: inputs.currentAge,
                    retirementAge: inputs.retirementAge,
                    yearsToRetirement: (inputs.retirementAge || 67) - (inputs.currentAge || 30)
                },
                financial: {
                    grossMonthlySalary: inputs.currentMonthlySalary || 0,
                    netMonthlySalary: taxResult.netSalary,
                    currentSavings: inputs.currentSavings || 0,
                    trainingFund: inputs.trainingFund || 0,
                    totalCurrentSavings: totalSavings,
                    currency: "NIS"
                },
                taxAndFees: {
                    taxCountry: inputs.taxCountry || 'israel',
                    taxRate: taxResult.taxRate,
                    contributionFees: inputs.contributionFees || 0.5,
                    accumulationFees: inputs.accumulationFees || 1.0,
                    trainingFundFees: inputs.trainingFundFees || 0.5
                },
                assumptions: {
                    expectedReturn: inputs.expectedReturn || 7,
                    inflationRate: inputs.inflationRate || 3,
                    pensionContributionRate: 18.6
                },
                results: results ? {
                    totalExpectedSavings: Math.round(results.totalSavings),
                    pensionSavings: Math.round(results.pensionSavings),
                    trainingFundSavings: Math.round(results.trainingFundSavings),
                    monthlyRetirementIncome: Math.round(results.monthlyIncome),
                    managementFeeImpact: Math.round(results.managementFeeImpact),
                    achievesTarget: results.achievesTarget
                } : null,
                metadata: {
                    calculationDate: new Date().toISOString(),
                    plannerVersion: "4.0.0",
                    autoCalculation: true,
                    exportFormat: "AI_COMPATIBLE"
                }
            };
            
            // Create downloadable JSON file
            const jsonString = JSON.stringify(aiData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `retirement-plan-ai-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Also copy to clipboard for easy pasting
            navigator.clipboard.writeText(jsonString).then(() => {
                alert(language === 'he' ? 'נתונים הועתקו ללוח והורדו כקובץ JSON' : 'Data copied to clipboard and downloaded as JSON file');
            }).catch(() => {
                alert(language === 'he' ? 'נתונים הורדו כקובץ JSON' : 'Data downloaded as JSON file');
            });
            
        } catch (error) {
            console.error('Error exporting for AI:', error);
            alert(language === 'he' ? 'שגיאה בייצוא נתונים' : 'Error exporting data');
        }
    };

    // Basic Results Component - Basic results display
    const BasicResults = ({ results, inputs, language, t }) => {
        // Check if we have minimum required inputs
        const hasRequiredInputs = inputs.currentAge && inputs.retirementAge && 
                                 inputs.currentMonthlySalary && inputs.expectedReturn && 
                                 inputs.currentAge < inputs.retirementAge;
        
        if (!results && !hasRequiredInputs) {
            return React.createElement('div', { 
                className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in" 
            }, [
                React.createElement('h2', { 
                    key: 'title',
                    className: "text-2xl font-bold text-gray-600 mb-6 flex items-center" 
                }, [
                    React.createElement('span', { key: 'icon', className: "mr-2" }, '📋'),
                    language === 'he' ? 'תוצאות חישוב' : 'Calculation Results'
                ]),
                React.createElement('div', {
                    key: 'placeholder',
                    className: "text-center py-8"
                }, [
                    React.createElement('div', { className: "text-6xl mb-4" }, '💡'),
                    React.createElement('p', { 
                        className: "text-gray-600 text-lg mb-2" 
                    }, language === 'he' ? 'יש להזין פרטים בסיסיים לחישוב' : 'Enter basic information to start calculations'),
                    React.createElement('p', { 
                        className: "text-gray-500 text-sm" 
                    }, language === 'he' ? 'הזן גיל, משכורת ותשואה צפויה' : 'Enter age, salary, and expected return')
                ])
            ]);
        }
        
        if (!results) return null;

        return React.createElement('div', { className: "space-y-4" }, [
            React.createElement('div', { 
                key: 'results',
                className: "financial-card p-6 animate-slide-up" 
            }, [
                React.createElement('h2', { 
                    key: 'title',
                    className: "text-2xl font-bold text-green-700 mb-6 flex items-center" 
                }, [
                    React.createElement(Target, { key: 'icon', className: "mr-2" }),
                    language === 'he' ? 'תוצאות חישוב' : 'Calculation Results'
                ]),
                React.createElement('div', { 
                    key: 'content',
                    className: "space-y-4" 
                }, [
                    React.createElement('div', { 
                        key: 'total',
                        className: "metric-card metric-positive p-4" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "צבירה כוללת צפויה:" : "Total Expected Accumulation:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1 wealth-amount" }, 
                                `₪${Math.round(results.totalSavings || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-breakdown',
                        className: "grid grid-cols-2 gap-4" 
                    }, [
                        React.createElement('div', { 
                            key: 'pension',
                            className: "metric-card metric-neutral p-3" 
                        }, [
                            React.createElement('div', { className: "text-sm text-blue-700" }, [
                                React.createElement('strong', null, language === 'he' ? "פנסיה:" : "Pension:"),
                                React.createElement('div', { className: "text-lg font-bold text-blue-800 mt-1 wealth-amount" }, 
                                    `₪${Math.round(results.pensionSavings || 0).toLocaleString()}`)
                            ])
                        ]),
                        React.createElement('div', { 
                            key: 'training',
                            className: "bg-purple-50 rounded-lg p-3 border border-purple-200" 
                        }, [
                            React.createElement('div', { className: "text-sm text-purple-700" }, [
                                React.createElement('strong', null, language === 'he' ? "קרן השתלמות:" : "Training Fund:"),
                                React.createElement('div', { className: "text-lg font-bold text-purple-800 mt-1" }, 
                                    `₪${Math.round(results.trainingFundSavings || 0).toLocaleString()}`)
                            ])
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הכנסה חודשית בפרישה:" : "Monthly Retirement Income:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.monthlyIncome || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'fees-impact',
                        className: "bg-red-50 rounded-lg p-3 border border-red-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-red-700" }, [
                            React.createElement('strong', null, language === 'he' ? "השפעת דמי ניהול:" : "Management Fees Impact:"),
                            React.createElement('div', { className: "text-base font-bold text-red-800 mt-1" }, 
                                `₪${Math.round(results.managementFeeImpact || 0).toLocaleString()}`),
                            React.createElement('div', { className: "text-xs text-red-600 mt-1" }, 
                                language === 'he' ? `דמי ניהול: ${(inputs.contributionFees || 1.0)}% הפקדות + ${(inputs.accumulationFees || 0.1)}% צבירה` : `Fees: ${(inputs.contributionFees || 1.0)}% contributions + ${(inputs.accumulationFees || 0.1)}% accumulation`),
                            React.createElement('div', { className: "text-xs text-red-600 mt-1" }, 
                                language === 'he' ? `תשואה נטו: ${(results.netReturn || 0).toFixed(1)}%` : `Net Return: ${(results.netReturn || 0).toFixed(1)}%`)
                        ])
                    ])
                ])
            ])
        ]);
    };

    // Loading Component - Loading indicator component
    const LoadingComponent = ({ message }) => {
        return React.createElement('div', { 
            className: "flex items-center justify-center py-8" 
        }, [
            React.createElement('div', { 
                key: 'spinner',
                className: "animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mr-3" 
            }),
            React.createElement('span', { 
                key: 'text',
                className: "text-purple-600 font-semibold" 
            }, message || 'Loading...')
        ]);
    };

    // Main Application Component - Main application component
    const RetirementPlannerCore = () => {
        // State management
        const [language, setLanguage] = React.useState('en');
        const [activeTab, setActiveTab] = React.useState('basic');
        const [inputs, setInputs] = React.useState({
            currentAge: 30,
            retirementAge: 67,
            currentSavings: 50000,
            currentMonthlySalary: 15000,
            trainingFund: 25000,
            trainingFundContribution: 1125, // 7.5% of 15000
            inflationRate: 3,
            expectedReturn: 7,
            contributionFees: 1.0, // Management fees on contributions (%)
            accumulationFees: 0.1, // Management fees on accumulation (%)
            trainingFundFees: 0.6, // 0.6% annual management fees for training fund
            taxCountry: 'israel' // Tax calculation country
        });
        const [results, setResults] = React.useState(null);
        const [loadingTabs, setLoadingTabs] = React.useState({});
        const [showChart, setShowChart] = React.useState(false);
        const [llmAnalysis, setLlmAnalysis] = React.useState(null);

        // Auto-calculation effect - calculate when required inputs change
        React.useEffect(() => {
            // Check if we have minimum required inputs for calculation
            const hasRequiredInputs = inputs.currentAge && inputs.retirementAge && 
                                     inputs.currentMonthlySalary && inputs.expectedReturn && 
                                     inputs.currentAge < inputs.retirementAge;
            
            if (hasRequiredInputs) {
                // Automatically calculate with a small delay to avoid excessive calculations
                const timeoutId = setTimeout(() => {
                    calculateBasic();
                }, 300); // 300ms delay for debouncing
                
                return () => clearTimeout(timeoutId);
            }
        }, [
            inputs.currentAge,
            inputs.retirementAge, 
            inputs.currentSavings,
            inputs.currentMonthlySalary,
            inputs.trainingFund,
            inputs.trainingFundContribution,
            inputs.inflationRate,
            inputs.expectedReturn,
            inputs.contributionFees,
            inputs.accumulationFees,
            inputs.trainingFundFees,
            inputs.taxCountry
        ]);

        // Auto-load advanced modules for better UX (like versions 2.3-2.4)
        React.useEffect(() => {
            console.log('🎯 RetirementPlannerCore component mounted');
            
            // Immediately preload critical modules for better UX (like versions 2.3-2.4)
            setTimeout(async () => {
                if (window.moduleLoader) {
                    console.log('🚀 Auto-loading critical modules for rich feature set...');
                    try {
                        // Load modules with individual error handling
                        const loadModule = async (loadFn, moduleName, windowProperty) => {
                            try {
                                if (!window[windowProperty]) {
                                    await loadFn();
                                    console.log(`✅ ${moduleName} auto-loaded`);
                                }
                            } catch (error) {
                                console.warn(`⚠️ Failed to load ${moduleName}:`, error.message);
                                // Don't fail the entire loading process
                            }
                        };
                        
                        // Load modules individually with error isolation
                        await loadModule(
                            () => window.moduleLoader.loadAdvancedTab(),
                            'Advanced Portfolio',
                            'AdvancedPortfolio'
                        );
                        
                        await loadModule(
                            () => window.moduleLoader.loadAnalysisTab(),
                            'Analysis Engine',
                            'AnalysisEngine'
                        );
                        
                        await loadModule(
                            () => window.moduleLoader.loadFireTab(),
                            'FIRE Calculator',
                            'FireCalculator'
                        );
                        
                        setLoadingTabs(prev => ({...prev, advanced: false, analysis: false, fire: false}));
                        console.log('🎉 Module auto-loading completed');
                    } catch (error) {
                        console.warn('⚠️ Module auto-loading encountered issues:', error);
                        setLoadingTabs(prev => ({...prev, advanced: false, analysis: false, fire: false}));
                    }
                } else {
                    console.warn('⚠️ Module loader not available for auto-loading');
                    // Don't fail - just disable loading states
                    setLoadingTabs(prev => ({...prev, advanced: false, analysis: false, fire: false}));
                }
            }, 2000); // Increased delay to ensure moduleLoader is ready
        }, []);

        // Generate chart data for accumulation over time
        const generateChartData = () => {
            if (!results) return [];
            
            const chartData = [];
            const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
            const monthlyContribution = inputs.currentMonthlySalary * 0.186;
            const annualContribution = monthlyContribution * 12;
            const netPensionReturn = Math.max(0.1, (inputs.expectedReturn || 7) - (inputs.accumulationFees || 0.1));
            
            for (let year = 0; year <= yearsToRetirement; year++) {
                const age = inputs.currentAge + year;
                const futureValue = inputs.currentSavings * Math.pow(1 + netPensionReturn/100, year) +
                    annualContribution * (year > 0 ? (Math.pow(1 + netPensionReturn/100, year) - 1) / (netPensionReturn/100) : 0);
                
                chartData.push({
                    age: age,
                    value: Math.round(futureValue),
                    totalSavings: Math.round(futureValue)
                });
            }
            
            return chartData;
        };

        // Basic calculation function with separate contribution and accumulation fees
        const calculateBasic = () => {
            const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
            
            // Calculate contributions based on planning type
            let totalMonthlySalary = inputs.currentMonthlySalary || 0;
            let totalCurrentSavings = inputs.currentSavings || 0;
            let totalTrainingFund = inputs.trainingFund || 0;
            
            if (inputs.planningType === 'couple') {
                // Add partner salaries and savings
                totalMonthlySalary += (inputs.partner1Salary || 0) + (inputs.partner2Salary || 0);
                // Assume proportional current savings for partners (could be made configurable)
                const salaryRatio1 = (inputs.partner1Salary || 0) / Math.max(1, totalMonthlySalary);
                const salaryRatio2 = (inputs.partner2Salary || 0) / Math.max(1, totalMonthlySalary);
                // For now, assume equal distribution - this could be enhanced later
            }
            
            const monthlyContribution = totalMonthlySalary * 0.186; // 18.6% pension contribution
            const annualContribution = monthlyContribution * 12;
            
            // Calculate net returns after separate contribution and accumulation fees (ensure minimum 0.1% to avoid division by zero)
            const netPensionReturn = Math.max(0.1, (inputs.expectedReturn || 7) - (inputs.accumulationFees || 1.0));
            const netTrainingReturn = Math.max(0.1, (inputs.expectedReturn || 7) - (inputs.trainingFundFees || 0.5));
            
            // Apply contribution fees to annual contributions
            const netAnnualContribution = annualContribution * (1 - (inputs.contributionFees || 1.0) / 100);
            const netTrainingAnnualContribution = (inputs.trainingFundContribution || 0) * 12 * (1 - (inputs.contributionFees || 1.0) / 100);
            
            // Pension calculation with separate contribution and accumulation fees
            const pensionFutureValue = totalCurrentSavings * Math.pow(1 + netPensionReturn/100, yearsToRetirement) +
                netAnnualContribution * (Math.pow(1 + netPensionReturn/100, yearsToRetirement) - 1) / (netPensionReturn/100);
            
            // Training fund calculation with its own fees
            const trainingFutureValue = totalTrainingFund * Math.pow(1 + netTrainingReturn/100, yearsToRetirement) +
                netTrainingAnnualContribution * (Math.pow(1 + netTrainingReturn/100, yearsToRetirement) - 1) / (netTrainingReturn/100);
            
            const totalFutureValue = pensionFutureValue + trainingFutureValue;
            const monthlyIncome = totalFutureValue * (netPensionReturn/100) / 12;
            
            // Calculate total fees impact (contribution fees + accumulation fees)
            const totalContributionFeesImpact = (annualContribution + (inputs.trainingFundContribution || 0) * 12) * (inputs.contributionFees || 1.0) / 100 * yearsToRetirement;
            const totalAccumulationFeesImpact = totalFutureValue * (inputs.accumulationFees || 0.1) / 100 * yearsToRetirement;
            
            setResults({
                totalSavings: Math.round(totalFutureValue),
                pensionSavings: Math.round(pensionFutureValue),
                trainingFundSavings: Math.round(trainingFutureValue),
                monthlyIncome: Math.round(monthlyIncome),
                achievesTarget: monthlyIncome > (totalMonthlySalary * 0.75),
                netReturn: netPensionReturn,
                managementFeeImpact: Math.round(totalContributionFeesImpact + totalAccumulationFeesImpact),
                planningType: inputs.planningType || 'single',
                totalMonthlySalary: Math.round(totalMonthlySalary)
            });
        };

        // Tab click handler with dynamic loading
        const handleTabClick = async (tabName) => {
            if (tabName === 'basic') {
                setActiveTab(tabName);
                return;
            }

            // Load advanced modules dynamically
            setLoadingTabs(prev => ({...prev, [tabName]: true}));
            
            try {
                let moduleLoaded = false;
                
                switch(tabName) {
                    case 'advanced':
                        await window.moduleLoader.loadAdvancedTab();
                        moduleLoaded = true;
                        break;
                    case 'analysis':
                        await window.moduleLoader.loadAnalysisTab();
                        moduleLoaded = true;
                        break;
                    case 'scenarios':
                        await window.moduleLoader.loadScenariosTab();
                        moduleLoaded = true;
                        break;
                    case 'fire':
                        await window.moduleLoader.loadFireTab();
                        moduleLoaded = true;
                        break;
                    case 'stress':
                        await window.moduleLoader.loadStressTestTab();
                        moduleLoaded = true;
                        break;
                }

                if (moduleLoaded) {
                    setActiveTab(tabName);
                }
                
            } catch (error) {
                console.error(`Failed to load ${tabName} module:`, error);
                alert(`שגיאה בטעינת המודול ${tabName}. אנא נסה שוב.`);
            } finally {
                setLoadingTabs(prev => ({...prev, [tabName]: false}));
            }
        };

        // Translations - Basic translations
        const t = {
            he: {
                title: 'מתכנן הפרישה המתקדם',
                subtitle: 'כלי מקצועי לתכנון פנסיה',
                basic: 'בסיסי',
                advanced: 'מתקדם', 
                analysis: 'אנליזה',
                scenarios: 'תרחישים',
                fire: 'FIRE',
                stress: 'בדיקות לחץ',
                currentAge: 'גיל נוכחי',
                retirementAge: 'גיל פרישה',
                autoCalcActive: 'חישוב אוטומטי פעיל',
                enterBasicInfo: 'יש להזין פרטים בסיסיים לחישוב'
            },
            en: {
                title: 'Advanced Retirement Planner',
                subtitle: 'Professional Pension Planning Tool',
                basic: 'Basic',
                advanced: 'Advanced',
                analysis: 'Analysis', 
                scenarios: 'Scenarios',
                fire: 'FIRE',
                stress: 'Stress Tests',
                currentAge: 'Current Age',
                retirementAge: 'Retirement Age',
                autoCalcActive: 'Auto-calculation active',
                enterBasicInfo: 'Enter basic information to start calculations'
            }
        };

        const currentT = t[language];

        return React.createElement('div', {
            className: 'min-h-screen py-6 px-4',
            dir: language === 'he' ? 'rtl' : 'ltr',
            style: { background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }
        }, [
            // Header
            React.createElement('div', {
                key: 'header',
                className: 'text-center mb-8'
            }, [
                React.createElement('h1', {
                    key: 'title',
                    className: 'text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in'
                }, currentT.title),
                React.createElement('p', {
                    key: 'subtitle',
                    className: 'text-xl text-white/90 animate-fade-in'
                }, currentT.subtitle),
                React.createElement('div', {
                    key: 'language',
                    className: 'mt-6'
                }, React.createElement('button', {
                    onClick: () => setLanguage(language === 'he' ? 'en' : 'he'),
                    className: 'px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all backdrop-blur-sm border border-white/30'
                }, language === 'he' ? 'English' : 'עברית'))
            ]),

            // Main Content
            React.createElement('div', {
                key: 'content',
                className: 'max-w-7xl mx-auto'
            }, [
                // Tab Navigation
                React.createElement('div', {
                    key: 'tabs',
                    className: 'flex justify-center mb-8 overflow-x-auto'
                }, React.createElement('div', {
                    className: 'financial-card p-2 inline-flex space-x-2'
                }, [
                    ['basic', 'advanced', 'analysis', 'scenarios', 'fire', 'stress'].map(tab => 
                        React.createElement('button', {
                            key: tab,
                            onClick: () => handleTabClick(tab),
                            disabled: loadingTabs[tab],
                            className: `tab-modern ${
                                activeTab === tab ? 'active' : ''
                            } ${loadingTabs[tab] ? 'opacity-50 cursor-not-allowed' : ''}`
                        }, loadingTabs[tab] ? '...' : currentT[tab])
                    )
                ])),

                // Tab Content
                React.createElement('div', {
                    key: 'tab-content',
                    className: 'dashboard-grid'
                }, [
                    // Forms Column
                    React.createElement('div', {
                        key: 'forms',
                        className: 'lg:col-span-2 space-y-6'
                    }, [
                        // Basic Tab
                        activeTab === 'basic' && React.createElement(BasicInputs, {
                            key: 'basic-form',
                            inputs,
                            setInputs,
                            language,
                            t: currentT
                        }),

                        // Advanced Tabs (dynamically loaded)
                        activeTab !== 'basic' && loadingTabs[activeTab] && React.createElement(LoadingComponent, {
                            key: 'loading',
                            message: `Loading ${currentT[activeTab]}...`
                        }),

                        // Advanced tab content will be rendered by dynamically loaded modules
                        activeTab === 'advanced' && window.AdvancedPortfolio && React.createElement(window.AdvancedPortfolio, {
                            key: 'advanced-form',
                            inputs, setInputs, language, t: currentT
                        }),

                        activeTab === 'analysis' && window.AnalysisEngine && React.createElement(window.AnalysisEngine, {
                            key: 'analysis-form', 
                            inputs, setInputs, language, t: currentT
                        }),

                        activeTab === 'scenarios' && window.ScenariosStress && React.createElement(window.ScenariosStress, {
                            key: 'scenarios-form',
                            inputs, setInputs, language, t: currentT
                        }),

                        activeTab === 'fire' && window.FireCalculator && React.createElement(window.FireCalculator, {
                            key: 'fire-form',
                            inputs, setInputs, language, t: currentT
                        }),

                        activeTab === 'stress' && window.ScenariosStress && React.createElement(window.ScenariosStress, {
                            key: 'stress-form',
                            inputs, setInputs, language, t: currentT
                        }),
                        
                        // Auto-calculation status indicator
                        React.createElement('div', {
                            key: 'auto-calc-status',
                            className: 'text-center text-sm text-white/70 mt-4'
                        }, React.createElement('div', {
                            className: 'flex items-center justify-center space-x-2'
                        }, [
                            React.createElement('span', { key: 'icon', className: 'text-green-400' }, '⚡'),
                            React.createElement('span', { key: 'text' }, currentT.autoCalcActive)
                        ]))
                    ]),

                    // Results Column with Side Panel
                    React.createElement('div', {
                        key: 'results',
                        className: 'lg:col-span-1 space-y-6 sidebar-panel'
                    }, [
                        // Real-time Summary Panel
                        React.createElement(SavingsSummaryPanel, {
                            key: 'summary-panel',
                            inputs,
                            language,
                            t: currentT
                        }),
                        
                        // Basic Results
                        React.createElement(BasicResults, {
                            key: 'basic-results',
                            results,
                            inputs,
                            language,
                            t: currentT
                        }),
                        
                        // LLM Analysis Display
                        llmAnalysis && React.createElement('div', {
                            key: 'llm-analysis',
                            className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in"
                        }, [
                            React.createElement('div', {
                                className: "flex justify-between items-center mb-4"
                            }, [
                                React.createElement('h3', {
                                    className: "text-xl font-bold text-indigo-700"
                                }, '🧠 AI Analysis & Recommendations'),
                                React.createElement('button', {
                                    onClick: () => setLlmAnalysis(null),
                                    className: "text-gray-500 hover:text-gray-700"
                                }, '✕')
                            ]),
                            React.createElement('div', {
                                className: "prose prose-sm max-w-none text-gray-700",
                                style: { whiteSpace: 'pre-line' }
                            }, llmAnalysis)
                        ])
                    ])
                ])
            ]),
            
            // Chart Modal
            showChart && React.createElement('div', {
                key: 'chart-modal',
                className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
                onClick: () => setShowChart(false)
            }, React.createElement('div', {
                className: 'bg-white rounded-2xl p-6 max-w-4xl max-h-[90vh] overflow-auto m-4',
                onClick: (e) => e.stopPropagation()
            }, [
                React.createElement('div', {
                    key: 'header',
                    className: 'flex justify-between items-center mb-6'
                }, [
                    React.createElement('h2', {
                        className: 'text-2xl font-bold text-gray-800'
                    }, '📊 Retirement Accumulation Projection'),
                    React.createElement('button', {
                        onClick: () => setShowChart(false),
                        className: 'text-gray-500 hover:text-gray-700 text-2xl'
                    }, '✕')
                ]),
                React.createElement('div', {
                    key: 'chart-container',
                    className: 'h-96'
                }, results ? React.createElement(SimpleChart, {
                    data: generateChartData(),
                    type: 'line',
                    language: language
                }) : React.createElement('div', {
                    className: 'flex items-center justify-center h-full text-gray-500'
                }, 'Complete your inputs to see the chart'))
            ]))
        ]);
    };

    // Error Boundary - Class component for proper React error boundary functionality
    window.ErrorBoundary = class ErrorBoundary extends React.Component {
        constructor(props) {
            super(props);
            this.state = { hasError: false, error: null, errorInfo: null };
        }

        static getDerivedStateFromError(error) {
            // Update state so the next render will show the fallback UI
            return { hasError: true };
        }

        componentDidCatch(error, errorInfo) {
            // Log the error for debugging
            console.error('ErrorBoundary caught an error:', error, errorInfo);
            this.setState({
                error: error,
                errorInfo: errorInfo
            });
        }

        render() {
            if (this.state.hasError) {
                // Fallback UI
                return React.createElement('div', {
                    className: 'flex items-center justify-center min-h-screen p-8'
                }, React.createElement('div', {
                    className: 'glass-effect rounded-2xl p-8 max-w-md mx-auto text-center'
                }, [
                    React.createElement('h2', {
                        key: 'title',
                        className: 'text-2xl font-bold text-red-600 mb-4'
                    }, '⚠️ Application Error'),
                    React.createElement('p', {
                        key: 'message',
                        className: 'text-gray-600 mb-4'
                    }, 'Something went wrong. Please refresh the page to try again.'),
                    this.state.error && React.createElement('details', {
                        key: 'details',
                        className: 'text-left bg-red-50 p-3 rounded mb-4 text-sm'
                    }, [
                        React.createElement('summary', { key: 'summary', className: 'cursor-pointer text-red-700 font-medium' }, 'Error Details'),
                        React.createElement('pre', { key: 'error', className: 'mt-2 text-red-600' }, this.state.error.toString()),
                        this.state.errorInfo && React.createElement('pre', { key: 'info', className: 'mt-2 text-gray-500' }, this.state.errorInfo.componentStack)
                    ]),
                    React.createElement('button', {
                        key: 'refresh',
                        className: 'px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors',
                        onClick: () => window.location.reload()
                    }, 'Refresh Page')
                ]));
            }

            return this.props.children;
        }
    };

    // Initialize application
    function initializeRetirementPlannerCore() {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(
            React.createElement(window.ErrorBoundary, {}, 
                React.createElement(RetirementPlannerCore)
            )
        );
    }

    // Export to global scope
    window.RetirementPlannerCore = RetirementPlannerCore;
    window.BasicInputs = BasicInputs;
    window.BasicResults = BasicResults;
    window.SimpleChart = SimpleChart;
    window.initializeRetirementPlannerCore = initializeRetirementPlannerCore;

    console.log('🚀 Retirement Planner Core loaded successfully');

})();