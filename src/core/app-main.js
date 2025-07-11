// Core Application - Advanced Retirement Planner
// Core application with basic components and dynamic loading

(function() {
    'use strict';

    // Add at the top of the file, after the opening IIFE and 'use strict':

    const style = document.createElement('style');
    style.innerHTML = `
      body {
        background: linear-gradient(135deg, #f7f9fb 0%, #e9eaf3 100%);
        font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
        color: #222;
      }
      .header-primary {
        font-size: 2.5rem;
        font-weight: 800;
        color: #6c63ff;
        letter-spacing: -1px;
        margin-bottom: 0.5rem;
      }
      .financial-card, .glass-effect, .metric-card {
        background: #fff;
        border-radius: 18px;
        box-shadow: 0 4px 32px rgba(60,60,90,0.10);
        border: 1.5px solid #e5e7eb;
        padding: 2rem 1.5rem;
        margin-bottom: 2rem;
        transition: box-shadow 0.2s;
      }
      .financial-card:hover, .glass-effect:hover, .metric-card:hover {
        box-shadow: 0 8px 40px rgba(60,60,90,0.16);
      }
      .btn-primary {
        background: linear-gradient(90deg, #6c63ff 0%, #00bfae 100%);
        color: #fff;
        border: none;
        border-radius: 12px;
        font-weight: 600;
        font-size: 1.1rem;
        padding: 0.85rem 1.5rem;
        box-shadow: 0 2px 8px rgba(108,99,255,0.08);
        transition: background 0.2s, box-shadow 0.2s;
        outline: none;
      }
      .btn-primary:hover, .btn-primary:focus {
        background: linear-gradient(90deg, #5a54e8 0%, #009e8e 100%);
        box-shadow: 0 4px 16px rgba(108,99,255,0.16);
      }
      input, select, textarea {
        border-radius: 10px;
        border: 1.5px solid #e0e3ea;
        padding: 0.75rem 1rem;
        font-size: 1rem;
        background: #f7f9fb;
        transition: border 0.2s, box-shadow 0.2s;
      }
      input:focus, select:focus, textarea:focus {
        border-color: #6c63ff;
        box-shadow: 0 0 0 2px #6c63ff33;
        outline: none;
      }
      .tab-modern {
        background: #f4f6fa;
        border-radius: 999px;
        padding: 0.5rem 1.5rem;
        font-weight: 600;
        color: #6c63ff;
        margin: 0 0.25rem;
        border: none;
        transition: background 0.2s, color 0.2s;
      }
      .tab-modern.active {
        background: linear-gradient(90deg, #6c63ff 0%, #00bfae 100%);
        color: #fff;
        box-shadow: 0 2px 8px rgba(108,99,255,0.08);
      }
      .dashboard-grid {
        display: grid;
        grid-template-columns: 1fr 480px;
        gap: 3rem;
        align-items: flex-start;
        width: 100%;
        max-width: 1400px;
        margin: 0 auto;
      }
      @media (max-width: 1200px) {
        .dashboard-grid {
          grid-template-columns: 1fr;
        }
        .results-column {
          position: static;
          width: 100%;
          max-width: 100%;
          margin-top: 2rem;
        }
      }
      .results-column.sidebar-panel {
        position: sticky;
        top: 2rem;
        width: 480px;
        min-width: 440px;
        max-width: 520px;
        background: linear-gradient(120deg, #fff 80%, #f3eaff 100%);
        border-radius: 22px;
        box-shadow: 0 8px 48px rgba(60,60,90,0.13);
        border-left: 6px solid #a084f3;
        border-top: 1.5px solid #e5e7eb;
        border-bottom: 1.5px solid #e5e7eb;
        border-right: 1.5px solid #e5e7eb;
        padding: 2.5rem 2rem;
        z-index: 5;
        overflow-y: auto;
        overflow-x: visible;
        margin-left: auto;
        margin-right: 0;
        transition: box-shadow 0.2s, border 0.2s;
      }
      .forms-column {
        min-width: 0;
        width: 100%;
      }
      ::-webkit-scrollbar {
        width: 8px;
        background: #e9eaf3;
      }
      ::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 8px;
      }
    `;
    document.head.appendChild(style);

    // Add a comment to the user to add Inter font to their HTML head if not already present.
    // <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">

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
            if (chartRef.current && data && data.length > 0 && window.Chart) {
                const ctx = chartRef.current.getContext('2d');
                
                try {
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
                    console.log('✅ Chart rendered successfully');
                } catch (error) {
                    console.error('❌ Chart rendering error:', error);
                }
            } else if (!window.Chart) {
                console.error('❌ Chart.js not loaded');
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

    // Bottom Line Summary Component - Key metrics display
    const BottomLineSummary = ({ inputs, language, totalMonthlySalary, yearsToRetirement, estimatedMonthlyIncome, projectedWithGrowth, buyingPowerToday, formatCurrency }) => {
        return React.createElement('div', {
            className: "border-t border-gray-200 pt-4 mb-4"
        }, [
            React.createElement('div', { 
                key: 'summary-title',
                className: "header-primary text-sm font-bold text-gray-900 mb-3 flex items-center" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-2" }, '📍'),
                language === 'he' ? 'השורה התחתונה' : 'Bottom Line'
            ]),
            
            // Key Metrics Cards
            React.createElement('div', { 
                key: 'key-metrics',
                className: "space-y-2" 
            }, [
                // Monthly income in retirement
                React.createElement('div', {
                    key: 'monthly-retirement',
                    className: "metric-card p-4 border-2 border-indigo-300 bg-indigo-50"
                }, [
                    React.createElement('div', { className: "text-xs font-semibold text-indigo-600 uppercase tracking-wide" }, 
                        language === 'he' ? 'הכנסה חודשית בפרישה' : 'Monthly Retirement Income'),
                    React.createElement('div', { className: "text-2xl font-bold text-indigo-800 wealth-amount mt-1" }, 
                        formatCurrency(estimatedMonthlyIncome || 0)),
                    React.createElement('div', { className: "text-xs text-indigo-600 mt-1" }, 
                        `${totalMonthlySalary > 0 ? ((estimatedMonthlyIncome / totalMonthlySalary) * 100).toFixed(0) : 0}% ${language === 'he' ? 'מהמשכורת הנוכחית' : 'of current salary'}`)
                ]),
                
                // Years to retirement
                React.createElement('div', {
                    key: 'years-countdown',
                    className: "metric-card p-3 border-2 border-purple-300 bg-purple-50"
                }, [
                    React.createElement('div', { className: "text-xs font-semibold text-purple-600 uppercase tracking-wide" }, 
                        language === 'he' ? 'זמן לפרישה' : 'Time to Retirement'),
                    React.createElement('div', { className: "text-xl font-bold text-purple-800" }, 
                        `${yearsToRetirement || 0} ${language === 'he' ? 'שנים' : 'years'}`),
                    React.createElement('div', { className: "text-xs text-purple-600" }, 
                        `${language === 'he' ? 'עד גיל' : 'Until age'} ${inputs.retirementAge || 67}`)
                ]),
                
                // Total projected savings
                React.createElement('div', {
                    key: 'total-savings',
                    className: "metric-card p-3 border-2 border-green-300 bg-green-50"
                }, [
                    React.createElement('div', { className: "text-xs font-semibold text-green-600 uppercase tracking-wide" }, 
                        language === 'he' ? 'צבירה כוללת צפויה' : 'Total Projected Savings'),
                    React.createElement('div', { className: "text-xl font-bold text-green-800 wealth-amount" }, 
                        formatCurrency(projectedWithGrowth || 0)),
                    React.createElement('div', { className: "text-xs text-green-600" }, 
                        `${language === 'he' ? 'כוח קנייה:' : 'Buying power:'} ${formatCurrency(buyingPowerToday || 0)}`)
                ])
            ])
        ]);
    };

    // Savings Summary Panel Component - Real-time savings overview with multi-currency support
    // CRITICAL: All calculated values MUST be passed as props to prevent undefined errors
    // Props: inputs, language, t, totalMonthlySalary, yearsToRetirement, estimatedMonthlyIncome, 
    //        projectedWithGrowth, buyingPowerToday, monthlyTotal, avgNetReturn
    // Each prop has a safe fallback calculation to ensure robust operation
    const SavingsSummaryPanel = ({ 
        inputs, language, t, totalMonthlySalary, yearsToRetirement, 
        estimatedMonthlyIncome, projectedWithGrowth, buyingPowerToday, 
        monthlyTotal, avgNetReturn, exportToPNG, exportForAI, 
        setShowChart, generateLLMAnalysis
    }) => {
        const [exchangeRates, setExchangeRates] = React.useState({
            USD: 3.6, EUR: 4.0, GBP: 4.7, BTC: 180000, ETH: 9000
        });
        
        // Use passed-in calculated values (or defaults if not provided)
        const safeYearsToRetirement = yearsToRetirement || Math.max(0, (inputs.retirementAge || 67) - (inputs.currentAge || 30));
        const safeTotalMonthlySalary = totalMonthlySalary || (inputs.currentMonthlySalary || 15000);
        const safeEstimatedMonthlyIncome = estimatedMonthlyIncome || 0;
        const safeProjectedWithGrowth = projectedWithGrowth || 0;
        const safeBuyingPowerToday = buyingPowerToday || 0;
        const safeAvgNetReturn = avgNetReturn || Math.max(0.1, ((inputs.expectedReturn || 7) - (inputs.accumulationFees || 1.0) + (inputs.expectedReturn || 7) - (inputs.trainingFundFees || 0.6)) / 2);
        const totalSavings = Math.max(0, (inputs.currentSavings || 0) + (inputs.trainingFund || 0));
        
        const formatCurrency = (amount, symbol = '₪') => {
            // Safety check for invalid numbers
            if (!amount || isNaN(amount) || !isFinite(amount)) {
                return `${symbol}0`;
            }
            return `${symbol}${Math.round(Math.abs(amount)).toLocaleString()}`;
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
                    language === 'he' ? `תשואה נטו ממוצעת: ${safeAvgNetReturn.toFixed(1)}%` : `Avg Net Return: ${safeAvgNetReturn.toFixed(1)}%`)
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
                            formatCurrency(buyingPowerToday * (safeAvgNetReturn/100) / 12))
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
                ].map(([currency, symbol]) => React.createElement('div', { key: currency, className: "bg-gray-100 rounded px-2 py-1" }, [
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
                            formatCurrency(projectedWithGrowth * (safeAvgNetReturn/100) / 12)),
                        React.createElement('div', { className: "text-xs text-gray-500 mt-1" }, 
                            `${(safeAvgNetReturn).toFixed(1)}% ${language === 'he' ? 'תשואה שנתית' : 'annual return'}`)
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
            
            // Bottom Line Summary is now rendered inside SavingsSummaryPanel
            
            // Export Buttons
            React.createElement('div', {
                key: 'export-buttons',
                className: "mt-6 bg-white rounded-lg shadow p-4 border border-gray-200 flex flex-col gap-3"
            }, [
                React.createElement('div', { 
                    key: 'export-title',
                    className: "text-sm font-medium text-gray-700 mb-3" 
                }, language === 'he' ? 'ייצוא נתונים' : 'Export Data'),
                
                React.createElement('button', {
                    key: 'export-png',
                    onClick: exportToPNG,
                    className: "btn-primary w-full text-sm flex items-center justify-center space-x-2 py-3 text-base"
                }, [
                    React.createElement('span', { key: 'icon' }, '🖼️'),
                    React.createElement('span', { key: 'text' }, language === 'he' ? 'ייצא כתמונה' : 'Export as PNG')
                ]),
                
                React.createElement('button', {
                    key: 'export-ai',
                    onClick: exportForAI,
                    className: "btn-primary w-full text-sm flex items-center justify-center space-x-2 py-3 text-base"
                }, [
                    React.createElement('span', { key: 'icon' }, '🤖'),
                    React.createElement('span', { key: 'text' }, language === 'he' ? 'ייצא לכלי AI' : 'Export for AI Tools')
                ]),
                
                React.createElement('button', {
                    key: 'show-chart',
                    onClick: () => setShowChart(true),
                    className: "btn-primary w-full text-sm flex items-center justify-center space-x-2 py-3 text-base"
                }, [
                    React.createElement('span', { key: 'icon' }, '📊'),
                    React.createElement('span', { key: 'text' }, language === 'he' ? 'ייצוג גרפי' : 'Graphical View')
                ]),
                
                React.createElement('button', {
                    key: 'llm-analysis',
                    onClick: generateLLMAnalysis,
                    className: "btn-primary w-full text-sm flex items-center justify-center space-x-2 py-3 text-base"
                }, [
                    React.createElement('span', { key: 'icon' }, '🧠'),
                    React.createElement('span', { key: 'text' }, language === 'he' ? 'ניתוח AI' : 'LLM Analysis')
                ])
            ]),
            
            // Bottom Line Summary - Key metrics at a glance
            React.createElement(BottomLineSummary, {
                key: 'bottom-line-summary',
                inputs,
                language,
                totalMonthlySalary: safeTotalMonthlySalary,
                yearsToRetirement: safeYearsToRetirement,
                estimatedMonthlyIncome: safeEstimatedMonthlyIncome,
                projectedWithGrowth: safeProjectedWithGrowth,
                buyingPowerToday: safeBuyingPowerToday,
                formatCurrency
            })
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
                                `₪${Math.round(results.monthlyRetirementIncome || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-savings',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "צבירה כוללת צפויה:" : "Total Expected Accumulation:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1 wealth-amount" }, 
                                `₪${Math.round(results.totalSavings || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-savings',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה צפויה:" : "Pension Savings:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1 wealth-amount" }, 
                                `₪${Math.round(results.pensionSavings || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-savings',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות צפויה:" : "Training Fund Savings:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1 wealth-amount" }, 
                                `₪${Math.round(results.trainingFundSavings || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-retirement-income',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הכנסה חודשית בפרישה:" : "Monthly Retirement Income:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.monthlyRetirementIncome || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-return',
                        className: "bg-yellow-50 rounded-lg p-4 border border-yellow-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-yellow-700" }, [
                            React.createElement('strong', null, language === 'he' ? "תשואה נטו ממוצעת:" : "Average Net Return:"),
                            React.createElement('div', { className: "text-2xl font-bold text-yellow-800 mt-1" }, 
                                `${(results.avgNetReturn || 0).toFixed(1)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'buying-power-today',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "כוח קנייה היום:" : "Today's Buying Power:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.buyingPowerToday || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'years-to-retirement',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "זמן לפרישה:" : "Years to Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `${(results.yearsToRetirement || 0).toFixed(0)}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-current',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סך הכל נוכחי:" : "Total Current:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.totalCurrent || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-current',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה נוכחית:" : "Current Pension:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.currentPension || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-current',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות נוכחית:" : "Current Training Fund:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.currentTrainingFund || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'tax-rate',
                        className: "bg-red-50 rounded-lg p-4 border border-red-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-red-700" }, [
                            React.createElement('strong', null, language === 'he' ? "שיעור מס:" : "Tax Rate:"),
                            React.createElement('div', { className: "text-2xl font-bold text-red-800 mt-1" }, 
                                `${(results.taxRate || 0).toFixed(0)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-salary',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "נטו שכר:" : "Net Salary:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.netSalary || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'gross-salary',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "ברוטו שכר:" : "Gross Salary:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.grossSalary || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-contributions',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הפקדות חודשיות:" : "Monthly Contributions:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.monthlyContributions || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-contributions',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סה״כ הפקדות:" : "Total Contributions:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.totalContributions || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-savings-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "צבירה כוללת צפויה בגיל פרישה:" : "Total Projected Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.projectedSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-savings-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה צפויה בגיל פרישה:" : "Pension Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.pensionSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-savings-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות צפויה בגיל פרישה:" : "Training Fund Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.trainingFundSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-retirement-income-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הכנסה חודשית בפרישה צפויה:" : "Monthly Retirement Income at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.monthlyRetirementIncomeAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-return-breakdown',
                        className: "bg-yellow-50 rounded-lg p-4 border border-yellow-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-yellow-700" }, [
                            React.createElement('strong', null, language === 'he' ? "תשואה נטו ממוצעת צפויה:" : "Average Net Return at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-yellow-800 mt-1" }, 
                                `${(results.avgNetReturnAtRetirement || 0).toFixed(1)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'buying-power-today-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "כוח קנייה היום צפוי:" : "Buying Power Today at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.buyingPowerTodayAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'years-to-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "זמן לפרישה צפוי:" : "Years to Retirement at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `${(results.yearsToRetirementAtRetirement || 0).toFixed(0)}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-current-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סך הכל נוכחי צפוי:" : "Total Current at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.totalCurrentAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-current-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה נוכחית צפויה:" : "Current Pension at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.currentPensionAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-current-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות נוכחית צפויה:" : "Current Training Fund at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.currentTrainingFundAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'tax-rate-breakdown',
                        className: "bg-red-50 rounded-lg p-4 border border-red-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-red-700" }, [
                            React.createElement('strong', null, language === 'he' ? "שיעור מס צפוי:" : "Tax Rate at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-red-800 mt-1" }, 
                                `${(results.taxRateAtRetirement || 0).toFixed(0)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-salary-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "נטו שכר צפוי:" : "Net Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.netSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'gross-salary-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "ברוטו שכר צפוי:" : "Gross Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.grossSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-contributions-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הפקדות חודשיות צפויות:" : "Monthly Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.monthlyContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-contributions-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סה״כ הפקדות צפויות:" : "Total Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.totalContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-savings-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "צבירה כוללת צפויה בגיל פרישה:" : "Total Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.totalSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-savings-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה צפויה בגיל פרישה:" : "Pension Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.pensionSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-savings-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות צפויה בגיל פרישה:" : "Training Fund Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.trainingFundSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-retirement-income-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הכנסה חודשית בפרישה צפויה:" : "Monthly Retirement Income at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.monthlyRetirementIncomeAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-return-at-retirement-breakdown',
                        className: "bg-yellow-50 rounded-lg p-4 border border-yellow-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-yellow-700" }, [
                            React.createElement('strong', null, language === 'he' ? "תשואה נטו ממוצעת צפויה:" : "Average Net Return at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-yellow-800 mt-1" }, 
                                `${(results.avgNetReturnAtRetirement || 0).toFixed(1)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'buying-power-today-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "כוח קנייה היום צפוי:" : "Buying Power Today at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.buyingPowerTodayAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'years-to-retirement-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "זמן לפרישה צפוי:" : "Years to Retirement at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `${(results.yearsToRetirementAtRetirement || 0).toFixed(0)}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סך הכל נוכחי צפוי:" : "Total Current at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.totalCurrentAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה נוכחית צפויה:" : "Current Pension at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.currentPensionAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-current-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות נוכחית צפויה:" : "Current Training Fund at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.currentTrainingFundAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'tax-rate-at-retirement-breakdown',
                        className: "bg-red-50 rounded-lg p-4 border border-red-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-red-700" }, [
                            React.createElement('strong', null, language === 'he' ? "שיעור מס צפוי:" : "Tax Rate at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-red-800 mt-1" }, 
                                `${(results.taxRateAtRetirement || 0).toFixed(0)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-salary-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "נטו שכר צפוי:" : "Net Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.netSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'gross-salary-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "ברוטו שכר צפוי:" : "Gross Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.grossSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הפקדות חודשיות צפויות:" : "Monthly Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.monthlyContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סה״כ הפקדות צפויות:" : "Total Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.totalContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-savings-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "צבירה כוללת צפויה בגיל פרישה:" : "Total Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.totalSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-savings-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה צפויה בגיל פרישה:" : "Pension Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.pensionSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-savings-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות צפויה בגיל פרישה:" : "Training Fund Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.trainingFundSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-retirement-income-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הכנסה חודשית בפרישה צפויה:" : "Monthly Retirement Income at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.monthlyRetirementIncomeAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-return-at-retirement-breakdown',
                        className: "bg-yellow-50 rounded-lg p-4 border border-yellow-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-yellow-700" }, [
                            React.createElement('strong', null, language === 'he' ? "תשואה נטו ממוצעת צפויה:" : "Average Net Return at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-yellow-800 mt-1" }, 
                                `${(results.avgNetReturnAtRetirement || 0).toFixed(1)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'buying-power-today-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "כוח קנייה היום צפוי:" : "Buying Power Today at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.buyingPowerTodayAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'years-to-retirement-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "זמן לפרישה צפוי:" : "Years to Retirement at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `${(results.yearsToRetirementAtRetirement || 0).toFixed(0)}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סך הכל נוכחי צפוי:" : "Total Current at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.totalCurrentAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה נוכחית צפויה:" : "Current Pension at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.currentPensionAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-current-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות נוכחית צפויה:" : "Current Training Fund at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.currentTrainingFundAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'tax-rate-at-retirement-breakdown',
                        className: "bg-red-50 rounded-lg p-4 border border-red-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-red-700" }, [
                            React.createElement('strong', null, language === 'he' ? "שיעור מס צפוי:" : "Tax Rate at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-red-800 mt-1" }, 
                                `${(results.taxRateAtRetirement || 0).toFixed(0)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-salary-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "נטו שכר צפוי:" : "Net Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.netSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'gross-salary-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "ברוטו שכר צפוי:" : "Gross Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.grossSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הפקדות חודשיות צפויות:" : "Monthly Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.monthlyContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סה״כ הפקדות צפויות:" : "Total Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.totalContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-savings-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "צבירה כוללת צפויה בגיל פרישה:" : "Total Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.totalSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-savings-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה צפויה בגיל פרישה:" : "Pension Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.pensionSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-savings-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות צפויה בגיל פרישה:" : "Training Fund Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.trainingFundSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-retirement-income-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הכנסה חודשית בפרישה צפויה:" : "Monthly Retirement Income at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.monthlyRetirementIncomeAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-return-at-retirement-breakdown',
                        className: "bg-yellow-50 rounded-lg p-4 border border-yellow-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-yellow-700" }, [
                            React.createElement('strong', null, language === 'he' ? "תשואה נטו ממוצעת צפויה:" : "Average Net Return at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-yellow-800 mt-1" }, 
                                `${(results.avgNetReturnAtRetirement || 0).toFixed(1)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'buying-power-today-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "כוח קנייה היום צפוי:" : "Buying Power Today at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.buyingPowerTodayAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'years-to-retirement-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "זמן לפרישה צפוי:" : "Years to Retirement at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `${(results.yearsToRetirementAtRetirement || 0).toFixed(0)}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סך הכל נוכחי צפוי:" : "Total Current at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.totalCurrentAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה נוכחית צפויה:" : "Current Pension at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.currentPensionAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-current-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות נוכחית צפויה:" : "Current Training Fund at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.currentTrainingFundAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'tax-rate-at-retirement-breakdown',
                        className: "bg-red-50 rounded-lg p-4 border border-red-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-red-700" }, [
                            React.createElement('strong', null, language === 'he' ? "שיעור מס צפוי:" : "Tax Rate at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-red-800 mt-1" }, 
                                `${(results.taxRateAtRetirement || 0).toFixed(0)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-salary-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "נטו שכר צפוי:" : "Net Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.netSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'gross-salary-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "ברוטו שכר צפוי:" : "Gross Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.grossSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הפקדות חודשיות צפויות:" : "Monthly Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.monthlyContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סה״כ הפקדות צפויות:" : "Total Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.totalContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-savings-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "צבירה כוללת צפויה בגיל פרישה:" : "Total Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.totalSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-savings-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה צפויה בגיל פרישה:" : "Pension Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.pensionSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-savings-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות צפויה בגיל פרישה:" : "Training Fund Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.trainingFundSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-retirement-income-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הכנסה חודשית בפרישה צפויה:" : "Monthly Retirement Income at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.monthlyRetirementIncomeAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-return-at-retirement-breakdown',
                        className: "bg-yellow-50 rounded-lg p-4 border border-yellow-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-yellow-700" }, [
                            React.createElement('strong', null, language === 'he' ? "תשואה נטו ממוצעת צפויה:" : "Average Net Return at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-yellow-800 mt-1" }, 
                                `${(results.avgNetReturnAtRetirement || 0).toFixed(1)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'buying-power-today-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "כוח קנייה היום צפוי:" : "Buying Power Today at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.buyingPowerTodayAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'years-to-retirement-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "זמן לפרישה צפוי:" : "Years to Retirement at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `${(results.yearsToRetirementAtRetirement || 0).toFixed(0)}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סך הכל נוכחי צפוי:" : "Total Current at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.totalCurrentAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה נוכחית צפויה:" : "Current Pension at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.currentPensionAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-current-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות נוכחית צפויה:" : "Current Training Fund at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.currentTrainingFundAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'tax-rate-at-retirement-breakdown',
                        className: "bg-red-50 rounded-lg p-4 border border-red-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-red-700" }, [
                            React.createElement('strong', null, language === 'he' ? "שיעור מס צפוי:" : "Tax Rate at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-red-800 mt-1" }, 
                                `${(results.taxRateAtRetirement || 0).toFixed(0)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-salary-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "נטו שכר צפוי:" : "Net Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.netSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'gross-salary-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "ברוטו שכר צפוי:" : "Gross Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.grossSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הפקדות חודשיות צפויות:" : "Monthly Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.monthlyContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סה״כ הפקדות צפויות:" : "Total Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.totalContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-savings-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "צבירה כוללת צפויה בגיל פרישה:" : "Total Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.totalSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-savings-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה צפויה בגיל פרישה:" : "Pension Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.pensionSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-savings-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות צפויה בגיל פרישה:" : "Training Fund Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.trainingFundSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-retirement-income-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הכנסה חודשית בפרישה צפויה:" : "Monthly Retirement Income at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.monthlyRetirementIncomeAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-return-at-retirement-breakdown',
                        className: "bg-yellow-50 rounded-lg p-4 border border-yellow-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-yellow-700" }, [
                            React.createElement('strong', null, language === 'he' ? "תשואה נטו ממוצעת צפויה:" : "Average Net Return at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-yellow-800 mt-1" }, 
                                `${(results.avgNetReturnAtRetirement || 0).toFixed(1)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'buying-power-today-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "כוח קנייה היום צפוי:" : "Buying Power Today at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.buyingPowerTodayAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'years-to-retirement-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "זמן לפרישה צפוי:" : "Years to Retirement at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `${(results.yearsToRetirementAtRetirement || 0).toFixed(0)}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סך הכל נוכחי צפוי:" : "Total Current at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.totalCurrentAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה נוכחית צפויה:" : "Current Pension at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.currentPensionAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-current-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות נוכחית צפויה:" : "Current Training Fund at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.currentTrainingFundAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'tax-rate-at-retirement-breakdown',
                        className: "bg-red-50 rounded-lg p-4 border border-red-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-red-700" }, [
                            React.createElement('strong', null, language === 'he' ? "שיעור מס צפוי:" : "Tax Rate at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-red-800 mt-1" }, 
                                `${(results.taxRateAtRetirement || 0).toFixed(0)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-salary-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "נטו שכר צפוי:" : "Net Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.netSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'gross-salary-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "ברוטו שכר צפוי:" : "Gross Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.grossSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הפקדות חודשיות צפויות:" : "Monthly Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.monthlyContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סה״כ הפקדות צפויות:" : "Total Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.totalContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-savings-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "צבירה כוללת צפויה בגיל פרישה:" : "Total Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.totalSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-savings-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה צפויה בגיל פרישה:" : "Pension Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.pensionSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-savings-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות צפויה בגיל פרישה:" : "Training Fund Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.trainingFundSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-retirement-income-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הכנסה חודשית בפרישה צפויה:" : "Monthly Retirement Income at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.monthlyRetirementIncomeAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-return-at-retirement-breakdown',
                        className: "bg-yellow-50 rounded-lg p-4 border border-yellow-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-yellow-700" }, [
                            React.createElement('strong', null, language === 'he' ? "תשואה נטו ממוצעת צפויה:" : "Average Net Return at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-yellow-800 mt-1" }, 
                                `${(results.avgNetReturnAtRetirement || 0).toFixed(1)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'buying-power-today-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "כוח קנייה היום צפוי:" : "Buying Power Today at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.buyingPowerTodayAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'years-to-retirement-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "זמן לפרישה צפוי:" : "Years to Retirement at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `${(results.yearsToRetirementAtRetirement || 0).toFixed(0)}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סך הכל נוכחי צפוי:" : "Total Current at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.totalCurrentAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה נוכחית צפויה:" : "Current Pension at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.currentPensionAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-current-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות נוכחית צפויה:" : "Current Training Fund at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.currentTrainingFundAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'tax-rate-at-retirement-breakdown',
                        className: "bg-red-50 rounded-lg p-4 border border-red-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-red-700" }, [
                            React.createElement('strong', null, language === 'he' ? "שיעור מס צפוי:" : "Tax Rate at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-red-800 mt-1" }, 
                                `${(results.taxRateAtRetirement || 0).toFixed(0)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-salary-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "נטו שכר צפוי:" : "Net Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.netSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'gross-salary-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "ברוטו שכר צפוי:" : "Gross Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.grossSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הפקדות חודשיות צפויות:" : "Monthly Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.monthlyContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סה״כ הפקדות צפויות:" : "Total Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.totalContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-savings-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "צבירה כוללת צפויה בגיל פרישה:" : "Total Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.totalSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-savings-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה צפויה בגיל פרישה:" : "Pension Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.pensionSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-savings-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות צפויה בגיל פרישה:" : "Training Fund Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.trainingFundSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-retirement-income-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הכנסה חודשית בפרישה צפויה:" : "Monthly Retirement Income at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.monthlyRetirementIncomeAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-return-at-retirement-breakdown',
                        className: "bg-yellow-50 rounded-lg p-4 border border-yellow-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-yellow-700" }, [
                            React.createElement('strong', null, language === 'he' ? "תשואה נטו ממוצעת צפויה:" : "Average Net Return at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-yellow-800 mt-1" }, 
                                `${(results.avgNetReturnAtRetirement || 0).toFixed(1)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'buying-power-today-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "כוח קנייה היום צפוי:" : "Buying Power Today at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.buyingPowerTodayAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'years-to-retirement-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "זמן לפרישה צפוי:" : "Years to Retirement at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `${(results.yearsToRetirementAtRetirement || 0).toFixed(0)}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סך הכל נוכחי צפוי:" : "Total Current at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.totalCurrentAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה נוכחית צפויה:" : "Current Pension at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.currentPensionAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-current-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות נוכחית צפויה:" : "Current Training Fund at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.currentTrainingFundAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'tax-rate-at-retirement-breakdown',
                        className: "bg-red-50 rounded-lg p-4 border border-red-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-red-700" }, [
                            React.createElement('strong', null, language === 'he' ? "שיעור מס צפוי:" : "Tax Rate at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-red-800 mt-1" }, 
                                `${(results.taxRateAtRetirement || 0).toFixed(0)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-salary-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "נטו שכר צפוי:" : "Net Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.netSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'gross-salary-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "ברוטו שכר צפוי:" : "Gross Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.grossSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הפקדות חודשיות צפויות:" : "Monthly Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.monthlyContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סה״כ הפקדות צפויות:" : "Total Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.totalContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-savings-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "צבירה כוללת צפויה בגיל פרישה:" : "Total Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.totalSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-savings-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה צפויה בגיל פרישה:" : "Pension Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.pensionSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-savings-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות צפויה בגיל פרישה:" : "Training Fund Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.trainingFundSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-retirement-income-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הכנסה חודשית בפרישה צפויה:" : "Monthly Retirement Income at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.monthlyRetirementIncomeAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-return-at-retirement-breakdown',
                        className: "bg-yellow-50 rounded-lg p-4 border border-yellow-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-yellow-700" }, [
                            React.createElement('strong', null, language === 'he' ? "תשואה נטו ממוצעת צפויה:" : "Average Net Return at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-yellow-800 mt-1" }, 
                                `${(results.avgNetReturnAtRetirement || 0).toFixed(1)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'buying-power-today-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "כוח קנייה היום צפוי:" : "Buying Power Today at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.buyingPowerTodayAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'years-to-retirement-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "זמן לפרישה צפוי:" : "Years to Retirement at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `${(results.yearsToRetirementAtRetirement || 0).toFixed(0)}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סך הכל נוכחי צפוי:" : "Total Current at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.totalCurrentAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה נוכחית צפויה:" : "Current Pension at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.currentPensionAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-current-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות נוכחית צפויה:" : "Current Training Fund at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.currentTrainingFundAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'tax-rate-at-retirement-breakdown',
                        className: "bg-red-50 rounded-lg p-4 border border-red-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-red-700" }, [
                            React.createElement('strong', null, language === 'he' ? "שיעור מס צפוי:" : "Tax Rate at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-red-800 mt-1" }, 
                                `${(results.taxRateAtRetirement || 0).toFixed(0)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-salary-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "נטו שכר צפוי:" : "Net Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.netSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'gross-salary-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "ברוטו שכר צפוי:" : "Gross Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.grossSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הפקדות חודשיות צפויות:" : "Monthly Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.monthlyContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סה״כ הפקדות צפויות:" : "Total Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.totalContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-savings-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "צבירה כוללת צפויה בגיל פרישה:" : "Total Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.totalSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-savings-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה צפויה בגיל פרישה:" : "Pension Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.pensionSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-savings-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות צפויה בגיל פרישה:" : "Training Fund Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.trainingFundSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-retirement-income-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הכנסה חודשית בפרישה צפויה:" : "Monthly Retirement Income at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.monthlyRetirementIncomeAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-return-at-retirement-breakdown',
                        className: "bg-yellow-50 rounded-lg p-4 border border-yellow-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-yellow-700" }, [
                            React.createElement('strong', null, language === 'he' ? "תשואה נטו ממוצעת צפויה:" : "Average Net Return at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-yellow-800 mt-1" }, 
                                `${(results.avgNetReturnAtRetirement || 0).toFixed(1)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'buying-power-today-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "כוח קנייה היום צפוי:" : "Buying Power Today at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.buyingPowerTodayAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'years-to-retirement-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "זמן לפרישה צפוי:" : "Years to Retirement at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `${(results.yearsToRetirementAtRetirement || 0).toFixed(0)}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סך הכל נוכחי צפוי:" : "Total Current at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.totalCurrentAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה נוכחית צפויה:" : "Current Pension at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.currentPensionAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-current-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות נוכחית צפויה:" : "Current Training Fund at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.currentTrainingFundAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'tax-rate-at-retirement-breakdown',
                        className: "bg-red-50 rounded-lg p-4 border border-red-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-red-700" }, [
                            React.createElement('strong', null, language === 'he' ? "שיעור מס צפוי:" : "Tax Rate at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-red-800 mt-1" }, 
                                `${(results.taxRateAtRetirement || 0).toFixed(0)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-salary-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "נטו שכר צפוי:" : "Net Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.netSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'gross-salary-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "ברוטו שכר צפוי:" : "Gross Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.grossSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הפקדות חודשיות צפויות:" : "Monthly Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.monthlyContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סה״כ הפקדות צפויות:" : "Total Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.totalContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-savings-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "צבירה כוללת צפויה בגיל פרישה:" : "Total Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.totalSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-savings-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה צפויה בגיל פרישה:" : "Pension Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.pensionSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-savings-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות צפויה בגיל פרישה:" : "Training Fund Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.trainingFundSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-retirement-income-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הכנסה חודשית בפרישה צפויה:" : "Monthly Retirement Income at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.monthlyRetirementIncomeAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-return-at-retirement-breakdown',
                        className: "bg-yellow-50 rounded-lg p-4 border border-yellow-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-yellow-700" }, [
                            React.createElement('strong', null, language === 'he' ? "תשואה נטו ממוצעת צפויה:" : "Average Net Return at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-yellow-800 mt-1" }, 
                                `${(results.avgNetReturnAtRetirement || 0).toFixed(1)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'buying-power-today-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "כוח קנייה היום צפוי:" : "Buying Power Today at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.buyingPowerTodayAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'years-to-retirement-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "זמן לפרישה צפוי:" : "Years to Retirement at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `${(results.yearsToRetirementAtRetirement || 0).toFixed(0)}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סך הכל נוכחי צפוי:" : "Total Current at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.totalCurrentAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה נוכחית צפויה:" : "Current Pension at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.currentPensionAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-current-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות נוכחית צפויה:" : "Current Training Fund at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.currentTrainingFundAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'tax-rate-at-retirement-breakdown',
                        className: "bg-red-50 rounded-lg p-4 border border-red-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-red-700" }, [
                            React.createElement('strong', null, language === 'he' ? "שיעור מס צפוי:" : "Tax Rate at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-red-800 mt-1" }, 
                                `${(results.taxRateAtRetirement || 0).toFixed(0)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-salary-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "נטו שכר צפוי:" : "Net Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.netSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'gross-salary-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "ברוטו שכר צפוי:" : "Gross Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.grossSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הפקדות חודשיות צפויות:" : "Monthly Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.monthlyContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סה״כ הפקדות צפויות:" : "Total Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.totalContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-savings-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "צבירה כוללת צפויה בגיל פרישה:" : "Total Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.totalSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-savings-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה צפויה בגיל פרישה:" : "Pension Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.pensionSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-savings-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות צפויה בגיל פרישה:" : "Training Fund Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.trainingFundSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-retirement-income-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הכנסה חודשית בפרישה צפויה:" : "Monthly Retirement Income at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.monthlyRetirementIncomeAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-return-at-retirement-breakdown',
                        className: "bg-yellow-50 rounded-lg p-4 border border-yellow-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-yellow-700" }, [
                            React.createElement('strong', null, language === 'he' ? "תשואה נטו ממוצעת צפויה:" : "Average Net Return at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-yellow-800 mt-1" }, 
                                `${(results.avgNetReturnAtRetirement || 0).toFixed(1)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'buying-power-today-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "כוח קנייה היום צפוי:" : "Buying Power Today at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.buyingPowerTodayAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'years-to-retirement-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "זמן לפרישה צפוי:" : "Years to Retirement at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `${(results.yearsToRetirementAtRetirement || 0).toFixed(0)}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סך הכל נוכחי צפוי:" : "Total Current at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.totalCurrentAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה נוכחית צפויה:" : "Current Pension at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.currentPensionAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-current-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות נוכחית צפויה:" : "Current Training Fund at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.currentTrainingFundAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'tax-rate-at-retirement-breakdown',
                        className: "bg-red-50 rounded-lg p-4 border border-red-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-red-700" }, [
                            React.createElement('strong', null, language === 'he' ? "שיעור מס צפוי:" : "Tax Rate at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-red-800 mt-1" }, 
                                `${(results.taxRateAtRetirement || 0).toFixed(0)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-salary-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "נטו שכר צפוי:" : "Net Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.netSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'gross-salary-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "ברוטו שכר צפוי:" : "Gross Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.grossSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הפקדות חודשיות צפויות:" : "Monthly Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.monthlyContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סה״כ הפקדות צפויות:" : "Total Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.totalContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-savings-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "צבירה כוללת צפויה בגיל פרישה:" : "Total Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.totalSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-savings-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה צפויה בגיל פרישה:" : "Pension Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.pensionSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-savings-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות צפויה בגיל פרישה:" : "Training Fund Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.trainingFundSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-retirement-income-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הכנסה חודשית בפרישה צפויה:" : "Monthly Retirement Income at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.monthlyRetirementIncomeAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-return-at-retirement-breakdown',
                        className: "bg-yellow-50 rounded-lg p-4 border border-yellow-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-yellow-700" }, [
                            React.createElement('strong', null, language === 'he' ? "תשואה נטו ממוצעת צפויה:" : "Average Net Return at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-yellow-800 mt-1" }, 
                                `${(results.avgNetReturnAtRetirement || 0).toFixed(1)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'buying-power-today-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "כוח קנייה היום צפוי:" : "Buying Power Today at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.buyingPowerTodayAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'years-to-retirement-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "זמן לפרישה צפוי:" : "Years to Retirement at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `${(results.yearsToRetirementAtRetirement || 0).toFixed(0)}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סך הכל נוכחי צפוי:" : "Total Current at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.totalCurrentAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה נוכחית צפויה:" : "Current Pension at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.currentPensionAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-current-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות נוכחית צפויה:" : "Current Training Fund at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.currentTrainingFundAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'tax-rate-at-retirement-breakdown',
                        className: "bg-red-50 rounded-lg p-4 border border-red-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-red-700" }, [
                            React.createElement('strong', null, language === 'he' ? "שיעור מס צפוי:" : "Tax Rate at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-red-800 mt-1" }, 
                                `${(results.taxRateAtRetirement || 0).toFixed(0)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-salary-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "נטו שכר צפוי:" : "Net Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.netSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'gross-salary-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "ברוטו שכר צפוי:" : "Gross Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.grossSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הפקדות חודשיות צפויות:" : "Monthly Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.monthlyContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סה״כ הפקדות צפויות:" : "Total Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.totalContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-savings-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "צבירה כוללת צפויה בגיל פרישה:" : "Total Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.totalSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-savings-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה צפויה בגיל פרישה:" : "Pension Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.pensionSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-savings-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות צפויה בגיל פרישה:" : "Training Fund Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.trainingFundSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-retirement-income-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הכנסה חודשית בפרישה צפויה:" : "Monthly Retirement Income at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.monthlyRetirementIncomeAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-return-at-retirement-breakdown',
                        className: "bg-yellow-50 rounded-lg p-4 border border-yellow-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-yellow-700" }, [
                            React.createElement('strong', null, language === 'he' ? "תשואה נטו ממוצעת צפויה:" : "Average Net Return at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-yellow-800 mt-1" }, 
                                `${(results.avgNetReturnAtRetirement || 0).toFixed(1)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'buying-power-today-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "כוח קנייה היום צפוי:" : "Buying Power Today at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.buyingPowerTodayAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'years-to-retirement-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "זמן לפרישה צפוי:" : "Years to Retirement at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `${(results.yearsToRetirementAtRetirement || 0).toFixed(0)}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סך הכל נוכחי צפוי:" : "Total Current at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.totalCurrentAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה נוכחית צפויה:" : "Current Pension at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.currentPensionAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-current-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות נוכחית צפויה:" : "Current Training Fund at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.currentTrainingFundAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'tax-rate-at-retirement-breakdown',
                        className: "bg-red-50 rounded-lg p-4 border border-red-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-red-700" }, [
                            React.createElement('strong', null, language === 'he' ? "שיעור מס צפוי:" : "Tax Rate at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-red-800 mt-1" }, 
                                `${(results.taxRateAtRetirement || 0).toFixed(0)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-salary-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "נטו שכר צפוי:" : "Net Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.netSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'gross-salary-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "ברוטו שכר צפוי:" : "Gross Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.grossSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הפקדות חודשיות צפויות:" : "Monthly Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.monthlyContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סה״כ הפקדות צפויות:" : "Total Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.totalContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-savings-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "צבירה כוללת צפויה בגיל פרישה:" : "Total Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.totalSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-savings-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה צפויה בגיל פרישה:" : "Pension Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.pensionSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-savings-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות צפויה בגיל פרישה:" : "Training Fund Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.trainingFundSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-retirement-income-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הכנסה חודשית בפרישה צפויה:" : "Monthly Retirement Income at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.monthlyRetirementIncomeAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-return-at-retirement-breakdown',
                        className: "bg-yellow-50 rounded-lg p-4 border border-yellow-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-yellow-700" }, [
                            React.createElement('strong', null, language === 'he' ? "תשואה נטו ממוצעת צפויה:" : "Average Net Return at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-yellow-800 mt-1" }, 
                                `${(results.avgNetReturnAtRetirement || 0).toFixed(1)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'buying-power-today-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "כוח קנייה היום צפוי:" : "Buying Power Today at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.buyingPowerTodayAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'years-to-retirement-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "זמן לפרישה צפוי:" : "Years to Retirement at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `${(results.yearsToRetirementAtRetirement || 0).toFixed(0)}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סך הכל נוכחי צפוי:" : "Total Current at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.totalCurrentAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה נוכחית צפויה:" : "Current Pension at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.currentPensionAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-current-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות נוכחית צפויה:" : "Current Training Fund at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.currentTrainingFundAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'tax-rate-at-retirement-breakdown',
                        className: "bg-red-50 rounded-lg p-4 border border-red-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-red-700" }, [
                            React.createElement('strong', null, language === 'he' ? "שיעור מס צפוי:" : "Tax Rate at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-red-800 mt-1" }, 
                                `${(results.taxRateAtRetirement || 0).toFixed(0)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-salary-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "נטו שכר צפוי:" : "Net Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.netSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'gross-salary-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "ברוטו שכר צפוי:" : "Gross Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.grossSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הפקדות חודשיות צפויות:" : "Monthly Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.monthlyContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סה״כ הפקדות צפויות:" : "Total Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.totalContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-savings-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "צבירה כוללת צפויה בגיל פרישה:" : "Total Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.totalSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-savings-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה צפויה בגיל פרישה:" : "Pension Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.pensionSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-savings-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות צפויה בגיל פרישה:" : "Training Fund Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.trainingFundSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-retirement-income-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הכנסה חודשית בפרישה צפויה:" : "Monthly Retirement Income at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.monthlyRetirementIncomeAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-return-at-retirement-breakdown',
                        className: "bg-yellow-50 rounded-lg p-4 border border-yellow-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-yellow-700" }, [
                            React.createElement('strong', null, language === 'he' ? "תשואה נטו ממוצעת צפויה:" : "Average Net Return at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-yellow-800 mt-1" }, 
                                `${(results.avgNetReturnAtRetirement || 0).toFixed(1)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'buying-power-today-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "כוח קנייה היום צפוי:" : "Buying Power Today at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.buyingPowerTodayAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'years-to-retirement-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "זמן לפרישה צפוי:" : "Years to Retirement at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `${(results.yearsToRetirementAtRetirement || 0).toFixed(0)}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סך הכל נוכחי צפוי:" : "Total Current at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.totalCurrentAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה נוכחית צפויה:" : "Current Pension at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.currentPensionAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-current-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות נוכחית צפויה:" : "Current Training Fund at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.currentTrainingFundAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'tax-rate-at-retirement-breakdown',
                        className: "bg-red-50 rounded-lg p-4 border border-red-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-red-700" }, [
                            React.createElement('strong', null, language === 'he' ? "שיעור מס צפוי:" : "Tax Rate at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-red-800 mt-1" }, 
                                `${(results.taxRateAtRetirement || 0).toFixed(0)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-salary-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "נטו שכר צפוי:" : "Net Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.netSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'gross-salary-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "ברוטו שכר צפוי:" : "Gross Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.grossSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הפקדות חודשיות צפויות:" : "Monthly Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.monthlyContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סה״כ הפקדות צפויות:" : "Total Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.totalContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-savings-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "צבירה כוללת צפויה בגיל פרישה:" : "Total Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.totalSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-savings-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה צפויה בגיל פרישה:" : "Pension Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.pensionSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-savings-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות צפויה בגיל פרישה:" : "Training Fund Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.trainingFundSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-retirement-income-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הכנסה חודשית בפרישה צפויה:" : "Monthly Retirement Income at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.monthlyRetirementIncomeAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-return-at-retirement-breakdown',
                        className: "bg-yellow-50 rounded-lg p-4 border border-yellow-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-yellow-700" }, [
                            React.createElement('strong', null, language === 'he' ? "תשואה נטו ממוצעת צפויה:" : "Average Net Return at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-yellow-800 mt-1" }, 
                                `${(results.avgNetReturnAtRetirement || 0).toFixed(1)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'buying-power-today-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "כוח קנייה היום צפוי:" : "Buying Power Today at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.buyingPowerTodayAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'years-to-retirement-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "זמן לפרישה צפוי:" : "Years to Retirement at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `${(results.yearsToRetirementAtRetirement || 0).toFixed(0)}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סך הכל נוכחי צפוי:" : "Total Current at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.totalCurrentAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה נוכחית צפויה:" : "Current Pension at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.currentPensionAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-current-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות נוכחית צפויה:" : "Current Training Fund at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.currentTrainingFundAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'tax-rate-at-retirement-breakdown',
                        className: "bg-red-50 rounded-lg p-4 border border-red-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-red-700" }, [
                            React.createElement('strong', null, language === 'he' ? "שיעור מס צפוי:" : "Tax Rate at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-red-800 mt-1" }, 
                                `${(results.taxRateAtRetirement || 0).toFixed(0)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-salary-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "נטו שכר צפוי:" : "Net Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.netSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'gross-salary-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "ברוטו שכר צפוי:" : "Gross Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.grossSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הפקדות חודשיות צפויות:" : "Monthly Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.monthlyContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סה״כ הפקדות צפויות:" : "Total Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.totalContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-savings-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "צבירה כוללת צפויה בגיל פרישה:" : "Total Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.totalSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-savings-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה צפויה בגיל פרישה:" : "Pension Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.pensionSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-savings-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות צפויה בגיל פרישה:" : "Training Fund Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.trainingFundSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-retirement-income-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הכנסה חודשית בפרישה צפויה:" : "Monthly Retirement Income at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.monthlyRetirementIncomeAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-return-at-retirement-breakdown',
                        className: "bg-yellow-50 rounded-lg p-4 border border-yellow-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-yellow-700" }, [
                            React.createElement('strong', null, language === 'he' ? "תשואה נטו ממוצעת צפויה:" : "Average Net Return at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-yellow-800 mt-1" }, 
                                `${(results.avgNetReturnAtRetirement || 0).toFixed(1)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'buying-power-today-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "כוח קנייה היום צפוי:" : "Buying Power Today at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.buyingPowerTodayAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'years-to-retirement-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "זמן לפרישה צפוי:" : "Years to Retirement at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `${(results.yearsToRetirementAtRetirement || 0).toFixed(0)}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סך הכל נוכחי צפוי:" : "Total Current at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.totalCurrentAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה נוכחית צפויה:" : "Current Pension at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.currentPensionAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-current-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות נוכחית צפויה:" : "Current Training Fund at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.currentTrainingFundAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'tax-rate-at-retirement-breakdown',
                        className: "bg-red-50 rounded-lg p-4 border border-red-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-red-700" }, [
                            React.createElement('strong', null, language === 'he' ? "שיעור מס צפוי:" : "Tax Rate at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-red-800 mt-1" }, 
                                `${(results.taxRateAtRetirement || 0).toFixed(0)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-salary-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "נטו שכר צפוי:" : "Net Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.netSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'gross-salary-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "ברוטו שכר צפוי:" : "Gross Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.grossSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הפקדות חודשיות צפויות:" : "Monthly Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.monthlyContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סה״כ הפקדות צפויות:" : "Total Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.totalContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-savings-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "צבירה כוללת צפויה בגיל פרישה:" : "Total Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.totalSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-savings-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה צפויה בגיל פרישה:" : "Pension Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.pensionSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-savings-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות צפויה בגיל פרישה:" : "Training Fund Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.trainingFundSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-retirement-income-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הכנסה חודשית בפרישה צפויה:" : "Monthly Retirement Income at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.monthlyRetirementIncomeAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-return-at-retirement-breakdown',
                        className: "bg-yellow-50 rounded-lg p-4 border border-yellow-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-yellow-700" }, [
                            React.createElement('strong', null, language === 'he' ? "תשואה נטו ממוצעת צפויה:" : "Average Net Return at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-yellow-800 mt-1" }, 
                                `${(results.avgNetReturnAtRetirement || 0).toFixed(1)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'buying-power-today-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "כוח קנייה היום צפוי:" : "Buying Power Today at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.buyingPowerTodayAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'years-to-retirement-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "זמן לפרישה צפוי:" : "Years to Retirement at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `${(results.yearsToRetirementAtRetirement || 0).toFixed(0)}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סך הכל נוכחי צפוי:" : "Total Current at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.totalCurrentAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה נוכחית צפויה:" : "Current Pension at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.currentPensionAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-current-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות נוכחית צפויה:" : "Current Training Fund at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.currentTrainingFundAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'tax-rate-at-retirement-breakdown',
                        className: "bg-red-50 rounded-lg p-4 border border-red-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-red-700" }, [
                            React.createElement('strong', null, language === 'he' ? "שיעור מס צפוי:" : "Tax Rate at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-red-800 mt-1" }, 
                                `${(results.taxRateAtRetirement || 0).toFixed(0)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-salary-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "נטו שכר צפוי:" : "Net Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.netSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'gross-salary-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "ברוטו שכר צפוי:" : "Gross Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.grossSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הפקדות חודשיות צפויות:" : "Monthly Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.monthlyContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סה״כ הפקדות צפויות:" : "Total Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.totalContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-savings-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "צבירה כוללת צפויה בגיל פרישה:" : "Total Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.totalSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-savings-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה צפויה בגיל פרישה:" : "Pension Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.pensionSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-savings-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות צפויה בגיל פרישה:" : "Training Fund Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.trainingFundSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-retirement-income-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הכנסה חודשית בפרישה צפויה:" : "Monthly Retirement Income at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.monthlyRetirementIncomeAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-return-at-retirement-breakdown',
                        className: "bg-yellow-50 rounded-lg p-4 border border-yellow-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-yellow-700" }, [
                            React.createElement('strong', null, language === 'he' ? "תשואה נטו ממוצעת צפויה:" : "Average Net Return at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-yellow-800 mt-1" }, 
                                `${(results.avgNetReturnAtRetirement || 0).toFixed(1)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'buying-power-today-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "כוח קנייה היום צפוי:" : "Buying Power Today at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.buyingPowerTodayAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'years-to-retirement-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "זמן לפרישה צפוי:" : "Years to Retirement at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `${(results.yearsToRetirementAtRetirement || 0).toFixed(0)}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סך הכל נוכחי צפוי:" : "Total Current at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.totalCurrentAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה נוכחית צפויה:" : "Current Pension at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.currentPensionAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-current-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות נוכחית צפויה:" : "Current Training Fund at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.currentTrainingFundAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'tax-rate-at-retirement-breakdown',
                        className: "bg-red-50 rounded-lg p-4 border border-red-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-red-700" }, [
                            React.createElement('strong', null, language === 'he' ? "שיעור מס צפוי:" : "Tax Rate at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-red-800 mt-1" }, 
                                `${(results.taxRateAtRetirement || 0).toFixed(0)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-salary-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "נטו שכר צפוי:" : "Net Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.netSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'gross-salary-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "ברוטו שכר צפוי:" : "Gross Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.grossSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הפקדות חודשיות צפויות:" : "Monthly Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.monthlyContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סה״כ הפקדות צפויות:" : "Total Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.totalContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-savings-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "צבירה כוללת צפויה בגיל פרישה:" : "Total Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.totalSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-savings-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה צפויה בגיל פרישה:" : "Pension Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.pensionSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-savings-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות צפויה בגיל פרישה:" : "Training Fund Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.trainingFundSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-retirement-income-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הכנסה חודשית בפרישה צפויה:" : "Monthly Retirement Income at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.monthlyRetirementIncomeAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-return-at-retirement-breakdown',
                        className: "bg-yellow-50 rounded-lg p-4 border border-yellow-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-yellow-700" }, [
                            React.createElement('strong', null, language === 'he' ? "תשואה נטו ממוצעת צפויה:" : "Average Net Return at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-yellow-800 mt-1" }, 
                                `${(results.avgNetReturnAtRetirement || 0).toFixed(1)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'buying-power-today-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "כוח קנייה היום צפוי:" : "Buying Power Today at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.buyingPowerTodayAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'years-to-retirement-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "זמן לפרישה צפוי:" : "Years to Retirement at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `${(results.yearsToRetirementAtRetirement || 0).toFixed(0)}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סך הכל נוכחי צפוי:" : "Total Current at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.totalCurrentAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה נוכחית צפויה:" : "Current Pension at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.currentPensionAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-current-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות נוכחית צפויה:" : "Current Training Fund at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.currentTrainingFundAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'tax-rate-at-retirement-breakdown',
                        className: "bg-red-50 rounded-lg p-4 border border-red-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-red-700" }, [
                            React.createElement('strong', null, language === 'he' ? "שיעור מס צפוי:" : "Tax Rate at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-red-800 mt-1" }, 
                                `${(results.taxRateAtRetirement || 0).toFixed(0)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-salary-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "נטו שכר צפוי:" : "Net Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.netSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'gross-salary-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "ברוטו שכר צפוי:" : "Gross Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.grossSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הפקדות חודשיות צפויות:" : "Monthly Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.monthlyContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סה״כ הפקדות צפויות:" : "Total Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.totalContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-savings-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "צבירה כוללת צפויה בגיל פרישה:" : "Total Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.totalSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-savings-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה צפויה בגיל פרישה:" : "Pension Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.pensionSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-savings-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות צפויה בגיל פרישה:" : "Training Fund Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.trainingFundSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-retirement-income-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הכנסה חודשית בפרישה צפויה:" : "Monthly Retirement Income at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.monthlyRetirementIncomeAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-return-at-retirement-breakdown',
                        className: "bg-yellow-50 rounded-lg p-4 border border-yellow-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-yellow-700" }, [
                            React.createElement('strong', null, language === 'he' ? "תשואה נטו ממוצעת צפויה:" : "Average Net Return at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-yellow-800 mt-1" }, 
                                `${(results.avgNetReturnAtRetirement || 0).toFixed(1)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'buying-power-today-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "כוח קנייה היום צפוי:" : "Buying Power Today at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.buyingPowerTodayAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'years-to-retirement-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "זמן לפרישה צפוי:" : "Years to Retirement at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `${(results.yearsToRetirementAtRetirement || 0).toFixed(0)}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סך הכל נוכחי צפוי:" : "Total Current at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.totalCurrentAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה נוכחית צפויה:" : "Current Pension at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.currentPensionAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-current-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות נוכחית צפויה:" : "Current Training Fund at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.currentTrainingFundAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'tax-rate-at-retirement-breakdown',
                        className: "bg-red-50 rounded-lg p-4 border border-red-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-red-700" }, [
                            React.createElement('strong', null, language === 'he' ? "שיעור מס צפוי:" : "Tax Rate at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-red-800 mt-1" }, 
                                `${(results.taxRateAtRetirement || 0).toFixed(0)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-salary-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "נטו שכר צפוי:" : "Net Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.netSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'gross-salary-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "ברוטו שכר צפוי:" : "Gross Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.grossSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הפקדות חודשיות צפויות:" : "Monthly Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.monthlyContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סה״כ הפקדות צפויות:" : "Total Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.totalContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-savings-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "צבירה כוללת צפויה בגיל פרישה:" : "Total Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.totalSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-savings-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה צפויה בגיל פרישה:" : "Pension Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.pensionSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-savings-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות צפויה בגיל פרישה:" : "Training Fund Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.trainingFundSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-retirement-income-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הכנסה חודשית בפרישה צפויה:" : "Monthly Retirement Income at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.monthlyRetirementIncomeAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-return-at-retirement-breakdown',
                        className: "bg-yellow-50 rounded-lg p-4 border border-yellow-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-yellow-700" }, [
                            React.createElement('strong', null, language === 'he' ? "תשואה נטו ממוצעת צפויה:" : "Average Net Return at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-yellow-800 mt-1" }, 
                                `${(results.avgNetReturnAtRetirement || 0).toFixed(1)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'buying-power-today-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "כוח קנייה היום צפוי:" : "Buying Power Today at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.buyingPowerTodayAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'years-to-retirement-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "זמן לפרישה צפוי:" : "Years to Retirement at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `${(results.yearsToRetirementAtRetirement || 0).toFixed(0)}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סך הכל נוכחי צפוי:" : "Total Current at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.totalCurrentAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה נוכחית צפויה:" : "Current Pension at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.currentPensionAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-current-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות נוכחית צפויה:" : "Current Training Fund at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.currentTrainingFundAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'tax-rate-at-retirement-breakdown',
                        className: "bg-red-50 rounded-lg p-4 border border-red-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-red-700" }, [
                            React.createElement('strong', null, language === 'he' ? "שיעור מס צפוי:" : "Tax Rate at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-red-800 mt-1" }, 
                                `${(results.taxRateAtRetirement || 0).toFixed(0)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-salary-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "נטו שכר צפוי:" : "Net Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.netSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'gross-salary-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "ברוטו שכר צפוי:" : "Gross Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.grossSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הפקדות חודשיות צפויות:" : "Monthly Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.monthlyContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סה״כ הפקדות צפויות:" : "Total Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.totalContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-savings-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "צבירה כוללת צפויה בגיל פרישה:" : "Total Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.totalSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-savings-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה צפויה בגיל פרישה:" : "Pension Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.pensionSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-savings-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות צפויה בגיל פרישה:" : "Training Fund Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.trainingFundSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-retirement-income-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הכנסה חודשית בפרישה צפויה:" : "Monthly Retirement Income at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.monthlyRetirementIncomeAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-return-at-retirement-breakdown',
                        className: "bg-yellow-50 rounded-lg p-4 border border-yellow-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-yellow-700" }, [
                            React.createElement('strong', null, language === 'he' ? "תשואה נטו ממוצעת צפויה:" : "Average Net Return at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-yellow-800 mt-1" }, 
                                `${(results.avgNetReturnAtRetirement || 0).toFixed(1)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'buying-power-today-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "כוח קנייה היום צפוי:" : "Buying Power Today at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.buyingPowerTodayAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'years-to-retirement-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "זמן לפרישה צפוי:" : "Years to Retirement at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `${(results.yearsToRetirementAtRetirement || 0).toFixed(0)}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סך הכל נוכחי צפוי:" : "Total Current at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.totalCurrentAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה נוכחית צפויה:" : "Current Pension at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.currentPensionAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-current-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות נוכחית צפויה:" : "Current Training Fund at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.currentTrainingFundAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'tax-rate-at-retirement-breakdown',
                        className: "bg-red-50 rounded-lg p-4 border border-red-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-red-700" }, [
                            React.createElement('strong', null, language === 'he' ? "שיעור מס צפוי:" : "Tax Rate at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-red-800 mt-1" }, 
                                `${(results.taxRateAtRetirement || 0).toFixed(0)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-salary-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "נטו שכר צפוי:" : "Net Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.netSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'gross-salary-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "ברוטו שכר צפוי:" : "Gross Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.grossSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הפקדות חודשיות צפויות:" : "Monthly Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.monthlyContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סה״כ הפקדות צפויות:" : "Total Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.totalContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-savings-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "צבירה כוללת צפויה בגיל פרישה:" : "Total Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.totalSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-savings-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה צפויה בגיל פרישה:" : "Pension Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.pensionSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-savings-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות צפויה בגיל פרישה:" : "Training Fund Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.trainingFundSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-retirement-income-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הכנסה חודשית בפרישה צפויה:" : "Monthly Retirement Income at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.monthlyRetirementIncomeAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-return-at-retirement-breakdown',
                        className: "bg-yellow-50 rounded-lg p-4 border border-yellow-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-yellow-700" }, [
                            React.createElement('strong', null, language === 'he' ? "תשואה נטו ממוצעת צפויה:" : "Average Net Return at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-yellow-800 mt-1" }, 
                                `${(results.avgNetReturnAtRetirement || 0).toFixed(1)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'buying-power-today-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "כוח קנייה היום צפוי:" : "Buying Power Today at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.buyingPowerTodayAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'years-to-retirement-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "זמן לפרישה צפוי:" : "Years to Retirement at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `${(results.yearsToRetirementAtRetirement || 0).toFixed(0)}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סך הכל נוכחי צפוי:" : "Total Current at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.totalCurrentAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה נוכחית צפויה:" : "Current Pension at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.currentPensionAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-current-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות נוכחית צפויה:" : "Current Training Fund at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.currentTrainingFundAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'tax-rate-at-retirement-breakdown',
                        className: "bg-red-50 rounded-lg p-4 border border-red-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-red-700" }, [
                            React.createElement('strong', null, language === 'he' ? "שיעור מס צפוי:" : "Tax Rate at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-red-800 mt-1" }, 
                                `${(results.taxRateAtRetirement || 0).toFixed(0)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-salary-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "נטו שכר צפוי:" : "Net Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.netSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'gross-salary-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "ברוטו שכר צפוי:" : "Gross Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.grossSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הפקדות חודשיות צפויות:" : "Monthly Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.monthlyContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סה״כ הפקדות צפויות:" : "Total Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.totalContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-savings-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "צבירה כוללת צפויה בגיל פרישה:" : "Total Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.totalSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-savings-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה צפויה בגיל פרישה:" : "Pension Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.pensionSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-savings-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות צפויה בגיל פרישה:" : "Training Fund Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.trainingFundSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-retirement-income-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הכנסה חודשית בפרישה צפויה:" : "Monthly Retirement Income at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.monthlyRetirementIncomeAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-return-at-retirement-breakdown',
                        className: "bg-yellow-50 rounded-lg p-4 border border-yellow-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-yellow-700" }, [
                            React.createElement('strong', null, language === 'he' ? "תשואה נטו ממוצעת צפויה:" : "Average Net Return at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-yellow-800 mt-1" }, 
                                `${(results.avgNetReturnAtRetirement || 0).toFixed(1)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'buying-power-today-at-retirement-breakdown',
                        className: "bg-orange-50 rounded-lg p-4 border border-orange-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-orange-700" }, [
                            React.createElement('strong', null, language === 'he' ? "כוח קנייה היום צפוי:" : "Buying Power Today at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-orange-800 mt-1" }, 
                                `₪${Math.round(results.buyingPowerTodayAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'years-to-retirement-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "זמן לפרישה צפוי:" : "Years to Retirement at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `${(results.yearsToRetirementAtRetirement || 0).toFixed(0)}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סך הכל נוכחי צפוי:" : "Total Current at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.totalCurrentAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-current-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה נוכחית צפויה:" : "Current Pension at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.currentPensionAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-current-at-retirement-breakdown',
                        className: "bg-purple-50 rounded-lg p-4 border border-purple-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-purple-700" }, [
                            React.createElement('strong', null, language === 'he' ? "קרן השתלמות נוכחית צפויה:" : "Current Training Fund at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-purple-800 mt-1" }, 
                                `₪${Math.round(results.currentTrainingFundAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'tax-rate-at-retirement-breakdown',
                        className: "bg-red-50 rounded-lg p-4 border border-red-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-red-700" }, [
                            React.createElement('strong', null, language === 'he' ? "שיעור מס צפוי:" : "Tax Rate at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-red-800 mt-1" }, 
                                `${(results.taxRateAtRetirement || 0).toFixed(0)}%`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'net-salary-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "נטו שכר צפוי:" : "Net Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.netSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'gross-salary-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "ברוטו שכר צפוי:" : "Gross Salary at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.grossSalaryAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הפקדות חודשיות צפויות:" : "Monthly Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.monthlyContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-contributions-at-retirement-breakdown',
                        className: "bg-gray-50 rounded-lg p-4 border border-gray-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-gray-700" }, [
                            React.createElement('strong', null, language === 'he' ? "סה״כ הפקדות צפויות:" : "Total Contributions at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-gray-800 mt-1" }, 
                                `₪${Math.round(results.totalContributionsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'total-savings-at-retirement-breakdown',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "צבירה כוללת צפויה בגיל פרישה:" : "Total Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${Math.round(results.totalSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'pension-savings-at-retirement-breakdown',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "פנסיה צפויה בגיל פרישה:" : "Pension Savings at Retirement:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${Math.round(results.pensionSavingsAtRetirement || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'training-fund-savings-at-retirement-breakdown',
                        className: