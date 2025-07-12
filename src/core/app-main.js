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

    // Enhanced Chart Component with multiple datasets and inflation adjustment
    const SimpleChart = ({ data, type = 'line', language = 'he', showInflationAdjusted = false }) => {
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
                    datasets: [
                        {
                            label: isHebrew ? 'קרן פנסיה' : 'Pension Fund',
                            data: data.map(d => showInflationAdjusted ? (d.pensionSavings || 0) : (d.pensionSavings || 0)),
                            borderColor: 'rgb(59, 130, 246)',
                            backgroundColor: 'rgba(59, 130, 246, 0.2)',
                            fill: true,
                            tension: 0.4,
                            borderWidth: 2
                        },
                        {
                            label: isHebrew ? 'קרן השתלמות' : 'Training Fund',
                            data: data.map(d => showInflationAdjusted ? (d.trainingFund || 0) : (d.trainingFund || 0)),
                            borderColor: 'rgb(16, 185, 129)',
                            backgroundColor: 'rgba(16, 185, 129, 0.2)',
                            fill: true,
                            tension: 0.4,
                            borderWidth: 2
                        },
                        {
                            label: isHebrew ? 'חיסכון אישי' : 'Personal Savings',
                            data: data.map(d => showInflationAdjusted ? (d.personalSavings || 0) : (d.personalSavings || 0)),
                            borderColor: 'rgb(245, 158, 11)',
                            backgroundColor: 'rgba(245, 158, 11, 0.2)',
                            fill: true,
                            tension: 0.4,
                            borderWidth: 2
                        },
                        {
                            label: isHebrew ? 'סה"כ צבירה' : 'Total Accumulation',
                            data: data.map(d => showInflationAdjusted ? (d.totalInflationAdjusted || d.totalSavings || d.value) : (d.totalSavings || d.value)),
                            borderColor: 'rgb(139, 69, 19)',
                            backgroundColor: 'rgba(139, 69, 19, 0.1)',
                            fill: false,
                            tension: 0.4,
                            borderWidth: 3,
                            borderDash: showInflationAdjusted ? [] : [5, 5]
                        }
                    ]
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
                                text: showInflationAdjusted ? 
                                    (isHebrew ? 'התפתחות הצבירה (מותאמת אינפלציה)' : 'Accumulation Progress (Inflation Adjusted)') :
                                    (isHebrew ? 'התפתחות הצבירה (ערך נומינלי)' : 'Accumulation Progress (Nominal Value)')
                            },
                            legend: {
                                display: true,
                                position: 'top'
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
                    React.createElement('div', { key: 'salary-title', className: "text-sm text-blue-700 font-medium mb-2" }, 
                        language === 'he' ? `משכורת חודשית (${countryName})` : `Monthly Salary (${countryName})`),
                    React.createElement('div', { key: 'salary-values', className: "grid grid-cols-2 gap-2 text-xs" }, [
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
                    React.createElement('div', { key: 'tax-rate-info', className: "text-xs text-blue-600 mt-1" }, 
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
        const BasicInputs = ({ inputs, setInputs, language, t, monthlyTrainingFundContribution }) => {
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
                    React.createElement('span', { key: 'text' }, t.basic || 'Basic Information')
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
                                value: Math.round(monthlyTrainingFundContribution),
                                readOnly: true,
                                className: "financial-input bg-gray-100"
                            })
                        ]),
                        React.createElement('div', { key: 'training-fund-options' }, [
                            React.createElement('label', {
                                className: "block text-sm font-medium text-gray-700 mb-1"
                            }, language === 'he' ? "אפשרויות קרן השתלמות" : "Training Fund Options"),
                            React.createElement('div', { className: 'flex items-center' }, [
                                React.createElement('input', {
                                    type: 'checkbox',
                                    id: 'has-training-fund',
                                    checked: inputs.hasTrainingFund,
                                    onChange: (e) => setInputs({ ...inputs, hasTrainingFund: e.target.checked }),
                                    className: 'h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
                                }),
                                React.createElement('label', {
                                    htmlFor: 'has-training-fund',
                                    className: 'ml-2 block text-sm text-gray-900'
                                }, language === 'he' ? "כולל קרן השתלמות" : "Include Training Fund")
                            ]),
                            React.createElement('div', { className: 'flex items-center' }, [
                                React.createElement('input', {
                                    type: 'checkbox',
                                    id: 'contribute-above-ceiling',
                                    checked: inputs.trainingFundContributeAboveCeiling,
                                    onChange: (e) => setInputs({ ...inputs, trainingFundContributeAboveCeiling: e.target.checked }),
                                    className: 'h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
                                }),
                                React.createElement('label', {
                                    htmlFor: 'contribute-above-ceiling',
                                    className: 'ml-2 block text-sm text-gray-900'
                                }, language === 'he' ? "הפרשה מעל התקרה" : "Contribute Above Ceiling")
                            ])
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
    const BasicResults = ({ results, inputs, language, t, formatCurrency }) => {
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
                    React.createElement('span', { key: 'icon', className: "mr-2" }, '🎯'),
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
                                formatCurrency(results?.monthlyIncomeAtRetirement || 0))
                        ])
                    ])
                ])
            ])
        ]);
    };

    // Main Retirement Planner Core Component
    const RetirementPlannerCore = () => {
        const [inputs, setInputs] = React.useState({
            currentAge: 30,
            retirementAge: 67,
            currentMonthlySalary: 15000,
            pensionContribution: 18.5,
            expectedReturn: 7.0,
            contributionFees: 1.0,
            accumulationFees: 1.0,
            currentPensionSavings: 0,
            // Training Fund (קרן השתלמות) Settings
            hasTrainingFund: true,
            trainingFundContributeAboveCeiling: false,
            trainingFundEmployeeRate: 2.5,
            trainingFundEmployerRate: 7.5,
            trainingFundCeiling: 15972,
            trainingFundFees: 0.6,
            currentTrainingFundSavings: 0,
            inflationRate: 3.0,
            taxCountry: 'israel',
            planningType: 'single',
            partner1Salary: 15000,
            partner2Salary: 12000,
            partner1Age: 30,
            partner2Age: 28
        });

        const [activeTab, setActiveTab] = React.useState('basic');
        const [language, setLanguage] = React.useState('he');
        const [showChart, setShowChart] = React.useState(false);
        const [showInflationChart, setShowInflationChart] = React.useState(false);
        const [llmAnalysis, setLlmAnalysis] = React.useState('');
        const [showWelcome, setShowWelcome] = React.useState(true);

        React.useEffect(() => {
            if (results) {
                setShowProgressBar(true);
            }
        }, [results]);
        const [showTutorial, setShowTutorial] = React.useState(false);
        const [showProgressBar, setShowProgressBar] = React.useState(false);

        const handleTakeTour = () => {
            setShowWelcome(false);
            setShowTutorial(true);
        };

        // Financial calculations
        const yearsToRetirement = Math.max(0, (inputs.retirementAge || 67) - (inputs.currentAge || 30));
        const totalMonthlySalary = inputs.planningType === 'couple' 
            ? (inputs.partner1Salary || 0) + (inputs.partner2Salary || 0)
            : (inputs.currentMonthlySalary || 0);

        const monthlyPensionContribution = totalMonthlySalary * (inputs.pensionContribution || 18.5) / 100;
        
        // קרן השתלמות - חישוב נכון לפי החוק הישראלי
        const calculateTrainingFundContribution = () => {
            if (!inputs.hasTrainingFund) return 0;
            
            const employeeRate = inputs.trainingFundEmployeeRate || 2.5;
            const employerRate = inputs.trainingFundEmployerRate || 7.5;
            const totalRate = employeeRate + employerRate; // 10% בסך הכל
            const ceiling = inputs.trainingFundCeiling || 15972;
            
            if (inputs.trainingFundContributeAboveCeiling) {
                // הפרשה על כל הסכום (עם מס על החלק מעל התקרה)
                return totalMonthlySalary * totalRate / 100;
            } else {
                // הפרשה רק עד התקרה
                const salaryForTrainingFund = Math.min(totalMonthlySalary, ceiling);
                return salaryForTrainingFund * totalRate / 100;
            }
        };
        
        const monthlyTrainingFundContribution = calculateTrainingFundContribution();
        const monthlyTotal = monthlyPensionContribution + monthlyTrainingFundContribution;

        const netPensionReturn = Math.max(0.1, (inputs.expectedReturn || 7) - (inputs.accumulationFees || 1.0));
        const netTrainingReturn = Math.max(0.1, (inputs.expectedReturn || 7) - (inputs.trainingFundFees || 0.6));
        const avgNetReturn = (netPensionReturn + netTrainingReturn) / 2;

        // Calculate projected savings
        const calculateProjections = () => {
            if (yearsToRetirement <= 0) return null;

            const pensionMonthly = monthlyPensionContribution * (1 - (inputs.contributionFees || 1.0) / 100);
            const trainingMonthly = monthlyTrainingFundContribution * (1 - (inputs.contributionFees || 1.0) / 100);
            
            const pensionFV = calculateFutureValue(pensionMonthly, netPensionReturn, yearsToRetirement, inputs.currentPensionSavings || 0);
            const trainingFV = calculateFutureValue(trainingMonthly, netTrainingReturn, yearsToRetirement, inputs.currentTrainingFundSavings || 0);
            
            const totalSavings = pensionFV + trainingFV;
            const monthlyIncomeAtRetirement = totalSavings / (25 * 12); // 4% rule approximation
            
            return {
                pensionSavings: pensionFV,
                trainingFundSavings: trainingFV,
                totalSavings,
                monthlyIncomeAtRetirement
            };
        };

        const calculateFutureValue = (monthlyPayment, annualRate, years, presentValue = 0) => {
            const monthlyRate = annualRate / 100 / 12;
            const numPayments = years * 12;

            if (monthlyRate === 0) {
                return presentValue + monthlyPayment * numPayments;
            }

            const futureValuePV = presentValue * Math.pow(1 + monthlyRate, numPayments);
            const futureValueAnnuity = monthlyPayment * (Math.pow(1 + monthlyRate, numPayments) - 1) / monthlyRate;
            
            return futureValuePV + futureValueAnnuity;
        };

        const results = calculateProjections();
        const projectedWithGrowth = results?.totalSavings || 0;
        const buyingPowerToday = projectedWithGrowth / Math.pow(1 + (inputs.inflationRate || 3) / 100, yearsToRetirement);
        const estimatedMonthlyIncome = results?.monthlyIncomeAtRetirement || 0;

        // Currency formatting
        const formatCurrency = (amount) => {
            return `₪${Math.round(amount).toLocaleString()}`;
        };

        // Translations object
        const t = {
            basic: language === 'he' ? 'מידע בסיסי' : 'Basic Information',
            advanced: language === 'he' ? 'הגדרות מתקדמות' : 'Advanced Settings',
            results: language === 'he' ? 'תוצאות' : 'Results'
        };

        // Export Functions
        const exportToPNG = async () => {
            try {
                console.log('🖼️ Exporting to PNG...');
                
                // Create a canvas for the export
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Set canvas size
                canvas.width = 800;
                canvas.height = 1000;
                
                // Fill background
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Add title
                ctx.fillStyle = '#1e40af';
                ctx.font = 'bold 28px Inter, Arial, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(language === 'he' ? 'מתכנן הפרישה המתקדם' : 'Advanced Retirement Planner', 400, 50);
                
                // Add key metrics
                ctx.font = '18px Inter, Arial, sans-serif';
                ctx.fillStyle = '#374151';
                ctx.textAlign = 'left';
                
                let y = 120;
                const lineHeight = 35;
                
                // Add user data
                ctx.fillText(`${language === 'he' ? 'גיל נוכחי:' : 'Current Age:'} ${inputs.currentAge || 30}`, 50, y);
                y += lineHeight;
                ctx.fillText(`${language === 'he' ? 'גיל פרישה:' : 'Retirement Age:'} ${inputs.retirementAge || 67}`, 50, y);
                y += lineHeight;
                ctx.fillText(`${language === 'he' ? 'משכורת חודשית:' : 'Monthly Salary:'} ${formatCurrency(totalMonthlySalary)}`, 50, y);
                y += lineHeight;
                ctx.fillText(`${language === 'he' ? 'סך חיסכון חודשי:' : 'Total Monthly Savings:'} ${formatCurrency(monthlyTotal)}`, 50, y);
                y += lineHeight;
                ctx.fillText(`${language === 'he' ? 'צפי חיסכון כולל:' : 'Projected Total Savings:'} ${formatCurrency(projectedWithGrowth)}`, 50, y);
                y += lineHeight;
                ctx.fillText(`${language === 'he' ? 'הכנסה חודשית בפרישה:' : 'Monthly Retirement Income:'} ${formatCurrency(estimatedMonthlyIncome)}`, 50, y);
                
                // Add footer
                y = canvas.height - 50;
                ctx.font = '14px Inter, Arial, sans-serif';
                ctx.fillStyle = '#6b7280';
                ctx.textAlign = 'center';
                ctx.fillText(`${language === 'he' ? 'נוצר ב-' : 'Generated on'} ${new Date().toLocaleDateString()}`, 400, y);
                
                // Download the image
                const link = document.createElement('a');
                link.download = `retirement-plan-${new Date().toISOString().split('T')[0]}.png`;
                link.href = canvas.toDataURL();
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                console.log('✅ PNG export completed successfully');
                
            } catch (error) {
                console.error('Error exporting PNG:', error);
                alert(language === 'he' ? 'שגיאה בייצוא PNG' : 'Error exporting PNG');
            }
        };

        const exportForAI = () => {
            try {
                // Create comprehensive AI-ready export data
                const exportData = {
                    metadata: {
                        exportDate: new Date().toISOString(),
                        version: "4.3.3",
                        language: language,
                        planningType: inputs.planningType
                    },
                    userProfile: {
                        currentAge: inputs.currentAge,
                        retirementAge: inputs.retirementAge,
                        yearsToRetirement: yearsToRetirement,
                        country: inputs.country || 'Israel',
                        planningType: inputs.planningType
                    },
                    financialInputs: {
                        monthlyIncome: {
                            gross: totalMonthlySalary,
                            currency: "ILS"
                        },
                        currentSavings: {
                            pension: inputs.currentSavings || 0,
                            trainingFund: inputs.trainingFund || 0,
                            total: (inputs.currentSavings || 0) + (inputs.trainingFund || 0)
                        },
                        monthlyContributions: {
                            pensionContribution: inputs.pensionContribution || 18.5,
                            employerContribution: inputs.employerContribution || 6,
                            trainingFundContribution: inputs.trainingFundContribution || 2.5,
                            totalMonthly: monthlyTotal
                        },
                        fees: {
                            contributionFees: inputs.contributionFees || 1.0,
                            accumulationFees: inputs.accumulationFees || 0.1,
                            trainingFundFees: inputs.trainingFundFees || 0.6
                        },
                        expectedReturn: inputs.expectedReturn || 7,
                        inflationRate: inputs.inflationRate || 3
                    },
                    projections: {
                        totalSavingsAtRetirement: {
                            nominal: projectedWithGrowth,
                            realValue: buyingPowerToday,
                            currency: "ILS"
                        },
                        monthlyRetirementIncome: {
                            nominal: estimatedMonthlyIncome,
                            currency: "ILS"
                        },
                        averageNetReturn: avgNetReturn
                    },
                    aiPromptSuggestion: language === 'he' ? 
                        "אנא נתח את נתוני התכנון הפנסיוני הבאים וספק המלצות לשיפור האסטרטגיה הפיננסית:" :
                        "Please analyze the following retirement planning data and provide recommendations for improving the financial strategy:"
                };
                
                // Create downloadable JSON file
                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `retirement-analysis-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                
                // Also copy to clipboard for convenience
                navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
                
                console.log('✅ AI export completed successfully');
                alert(language === 'he' ? 'נתוני AI הורדו בהצלחה ונועתקו ללוח' : 'AI data downloaded successfully and copied to clipboard');
                
            } catch (error) {
                console.error('Error exporting for AI:', error);
                alert(language === 'he' ? 'שגיאה בייצוא נתונים' : 'Error exporting data');
            }
        };

        const generateLLMAnalysis = () => {
            try {
                const analysis = `Retirement Analysis Summary:
- Current Age: ${inputs.currentAge}
- Retirement Age: ${inputs.retirementAge}
- Years to Retirement: ${yearsToRetirement}
- Monthly Salary: ${formatCurrency(totalMonthlySalary)}
- Total Monthly Contributions: ${formatCurrency(monthlyTotal)}
- Projected Total Savings: ${formatCurrency(projectedWithGrowth)}
- Buying Power Today: ${formatCurrency(buyingPowerToday)}
- Monthly Retirement Income: ${formatCurrency(estimatedMonthlyIncome)}

Recommendations: Continue regular contributions and review portfolio allocation annually.`;
                
                setLlmAnalysis(analysis);
                alert(language === 'he' ? 'ניתוח נוצר בהצלחה' : 'Analysis generated successfully');
            } catch (error) {
                console.error('Error generating LLM analysis:', error);
            }
        };

        const handleTabClick = (tabName) => {
            setActiveTab(tabName);
            if (tabName !== 'basic' && window.moduleLoader) {
                if (tabName === 'advanced') {
                    window.moduleLoader.loadAdvancedTab();
                } else if (tabName === 'stress') {
                    window.moduleLoader.loadStressTestTab();
                } else if (tabName === 'analysis') {
                    window.moduleLoader.loadAnalysisTab();
                }
            }
        };

        // Main UI
        return React.createElement('div', {
            className: "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50",
            dir: language === 'he' ? 'rtl' : 'ltr'
        }, [
            // Header
            React.createElement('div', { 
                key: 'header',
                className: "text-center py-8 px-4" 
            }, [
                React.createElement('h1', { 
                    key: 'title',
                    className: "header-primary text-4xl md:text-5xl font-black mb-4" 
                }, language === 'he' ? 'מתכנן הפרישה המתקדם' : 'Advanced Retirement Planner'),
                
                React.createElement('p', { 
                    key: 'subtitle',
                    className: "text-lg text-gray-600 max-w-2xl mx-auto mb-6" 
                }, language === 'he' ? 
                    'כלי מתקדם לתכנון פרישה עם חישובי פנסיה וקרן השתלמות, תמיכה בזוגות ובדיקות עמידות' :
                    'Advanced retirement planning tool with pension and training fund calculations, couple support, and stress testing'),
                
                // Language Toggle
                React.createElement('div', { 
                    key: 'language-toggle',
                    className: "flex justify-center space-x-4 mb-6" 
                }, [
                    React.createElement('button', {
                        key: 'he',
                        onClick: () => setLanguage('he'),
                        className: `px-4 py-2 rounded-lg transition-colors ${language === 'he' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`
                    }, 'עברית'),
                    React.createElement('button', {
                        key: 'en',
                        onClick: () => setLanguage('en'),
                        className: `px-4 py-2 rounded-lg transition-colors ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`
                    }, 'English')
                ])
            ]),

            // Welcome Banner
            showWelcome ? React.createElement('div', {
                key: 'welcome-banner',
                className: "welcome-banner mx-4 animate-fade-in-up"
            }, [
                React.createElement('div', {
                    key: 'welcome-content',
                    className: "relative z-10"
                }, [
                    React.createElement('h2', {
                        key: 'welcome-title',
                        className: "text-3xl font-bold mb-4"
                    }, language === 'he' ? '👋 ברוכים הבאים למתכנן הפרישה המתקדם!' : '👋 Welcome to Advanced Retirement Planner!'),
                    
                    React.createElement('p', {
                        key: 'welcome-description',
                        className: "text-lg mb-6 opacity-90"
                    }, language === 'he' ? 
                        'תכננו את עתידכם הכלכלי בביטחון עם כלי התכנון המתקדם ביותר לפרישה בישראל' :
                        'Plan your financial future with confidence using the most advanced retirement planning tool for Israeli standards'),
                    
                    React.createElement('div', {
                        key: 'welcome-features',
                        className: "feature-grid mb-6"
                    }, [
                        React.createElement('div', {
                            key: 'feature-1',
                            className: "feature-card animate-delay-100"
                        }, [
                            React.createElement('span', {
                                key: 'icon-1',
                                className: "feature-icon"
                            }, '📊'),
                            React.createElement('h3', {
                                key: 'title-1',
                                className: "feature-title"
                            }, language === 'he' ? 'תחזיות מדויקות' : 'Accurate Projections'),
                            React.createElement('p', {
                                key: 'desc-1',
                                className: "feature-description"
                            }, language === 'he' ? 'חישובי פנסיה וקרן השתלמות מדויקים לפי התקינה הישראלית' : 'Precise pension and training fund calculations per Israeli standards')
                        ]),
                        
                        React.createElement('div', {
                            key: 'feature-2',
                            className: "feature-card animate-delay-200"
                        }, [
                            React.createElement('span', {
                                key: 'icon-2',
                                className: "feature-icon"
                            }, '👥'),
                            React.createElement('h3', {
                                key: 'title-2',
                                className: "feature-title"
                            }, language === 'he' ? 'תכנון זוגי' : 'Couple Planning'),
                            React.createElement('p', {
                                key: 'desc-2',
                                className: "feature-description"
                            }, language === 'he' ? 'תמיכה מלאה בתכנון פרישה משותף לזוגות' : 'Full support for joint retirement planning for couples')
                        ]),
                        
                        React.createElement('div', {
                            key: 'feature-3',
                            className: "feature-card animate-delay-300"
                        }, [
                            React.createElement('span', {
                                key: 'icon-3',
                                className: "feature-icon"
                            }, '🌍'),
                            React.createElement('h3', {
                                key: 'title-3',
                                className: "feature-title"
                            }, language === 'he' ? 'תמיכה בינלאומית' : 'Multi-Country Support'),
                            React.createElement('p', {
                                key: 'desc-3',
                                className: "feature-description"
                            }, language === 'he' ? 'חישובי מס לישראל, בריטניה וארה״ב' : 'Tax calculations for Israel, UK, and US')
                        ])
                    ]),
                    
                    React.createElement('div', {
                        key: 'welcome-actions',
                        className: "flex flex-col sm:flex-row gap-4 justify-center"
                    }, [
                        React.createElement('button', {
                            key: 'start-planning',
                            onClick: () => {
                                setShowWelcome(false);
                                document.querySelector('.financial-input')?.focus();
                            },
                            className: "btn-primary"
                        }, language === 'he' ? '🚀 התחילו לתכנן עכשיו' : '🚀 Start Planning Now'),
                        
                        React.createElement('button', {
                            key: 'take-tour',
                            onClick: () => {
                                setShowWelcome(false);
                                setShowTutorial(true);
                            },
                            className: "btn-secondary"
                        }, language === 'he' ? '🎯 סיור מודרך' : '🎯 Take a Tour'),
                        
                        React.createElement('button', {
                            key: 'skip-welcome',
                            onClick: () => setShowWelcome(false),
                            className: "text-white hover:text-gray-200 transition-colors text-sm"
                        }, language === 'he' ? 'דלג' : 'Skip')
                    ])
                ])
            ]) : null,

            // Interactive Tutorial
            showTutorial ? React.createElement('div', {
                key: 'tutorial-overlay',
                className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            }, [
                React.createElement('div', {
                    key: 'tutorial-content',
                    className: "bg-white rounded-xl p-6 max-w-2xl max-h-96 overflow-auto",
                    onClick: (e) => e.stopPropagation()
                }, [
                    React.createElement('h3', {
                        key: 'tutorial-title',
                        className: "text-2xl font-bold mb-4 text-center"
                    }, language === 'he' ? '🎓 מדריך מהיר לשימוש' : '🎓 Quick Start Guide'),
                    
                    React.createElement('div', {
                        key: 'tutorial-steps',
                        className: "space-y-4"
                    }, [
                        React.createElement('div', {
                            key: 'step-1',
                            className: "flex items-start space-x-3"
                        }, [
                            React.createElement('span', {
                                key: 'step-num-1',
                                className: "flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold"
                            }, '1'),
                            React.createElement('div', {}, [
                                React.createElement('h4', {
                                    className: "font-semibold"
                                }, language === 'he' ? 'הכנסת פרטים בסיסיים' : 'Enter Basic Information'),
                                React.createElement('p', {
                                    className: "text-gray-600 text-sm"
                                }, language === 'he' ? 'הזינו את הגיל, המשכורת והתשואה הצפויה' : 'Enter your age, salary, and expected returns')
                            ])
                        ]),
                        
                        React.createElement('div', {
                            key: 'step-2',
                            className: "flex items-start space-x-3"
                        }, [
                            React.createElement('span', {
                                key: 'step-num-2',
                                className: "flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold"
                            }, '2'),
                            React.createElement('div', {}, [
                                React.createElement('h4', {
                                    className: "font-semibold"
                                }, language === 'he' ? 'צפייה בתוצאות' : 'View Results'),
                                React.createElement('p', {
                                    className: "text-gray-600 text-sm"
                                }, language === 'he' ? 'התוצאות מתעדכנות באופן אוטומטי בעמודה הימנית' : 'Results update automatically in the right column')
                            ])
                        ]),
                        
                        React.createElement('div', {
                            key: 'step-3',
                            className: "flex items-start space-x-3"
                        }, [
                            React.createElement('span', {
                                key: 'step-num-3',
                                className: "flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold"
                            }, '3'),
                            React.createElement('div', {}, [
                                React.createElement('h4', {
                                    className: "font-semibold"
                                }, language === 'he' ? 'תכונות מתקדמות' : 'Advanced Features'),
                                React.createElement('p', {
                                    className: "text-gray-600 text-sm"
                                }, language === 'he' ? 'השתמשו בלשוניות "מתקדם" ו"בדיקות עמידות" לניתוח מעמיק' : 'Use "Advanced" and "Stress Test" tabs for deeper analysis')
                            ])
                        ])
                    ]),
                    
                    React.createElement('div', {
                        key: 'tutorial-actions',
                        className: "flex justify-center space-x-4 mt-6"
                    }, [
                        React.createElement('button', {
                            key: 'start-now',
                            onClick: () => setShowTutorial(false),
                            className: "btn-primary"
                        }, language === 'he' ? 'התחל עכשיו' : 'Start Now'),
                        
                        React.createElement('button', {
                            key: 'back-welcome',
                            onClick: () => {
                                setShowTutorial(false);
                                setShowWelcome(true);
                            },
                            className: "btn-secondary"
                        }, language === 'he' ? 'חזור' : 'Back')
                    ])
                ])
            ]) : null,

            // Tab Navigation
            React.createElement('div', { 
                key: 'tabs',
                className: "flex justify-center space-x-2 px-4 mb-8" 
            }, [
                React.createElement('button', {
                    key: 'basic-tab',
                    onClick: () => handleTabClick('basic'),
                    className: `tab-modern ${activeTab === 'basic' ? 'active' : ''}`
                }, language === 'he' ? 'חישוב בסיסי' : 'Basic'),
                React.createElement('button', {
                    key: 'advanced-tab',
                    onClick: () => handleTabClick('advanced'),
                    className: `tab-modern ${activeTab === 'advanced' ? 'active' : ''}`
                }, language === 'he' ? 'הגדרות מתקדמות' : 'Advanced'),
                React.createElement('button', {
                    key: 'stress-tab',
                    onClick: () => handleTabClick('stress'),
                    className: `tab-modern ${activeTab === 'stress' ? 'active' : ''}`
                }, language === 'he' ? 'בדיקת עמידות' : 'Stress Test'),
                React.createElement('button', {
                    key: 'analysis-tab',
                    onClick: () => handleTabClick('analysis'),
                    className: `tab-modern ${activeTab === 'analysis' ? 'active' : ''}`
                }, language === 'he' ? 'ניתוח מתקדם' : 'Analysis')
            ]),

            // Main Content
            React.createElement('div', { 
                key: 'main-content',
                className: "dashboard-grid px-4 pb-8" 
            }, [
                // Left Column - Inputs
                React.createElement('div', { 
                    key: 'inputs-column',
                    className: "space-y-6" 
                }, [
                    activeTab === 'basic' ? React.createElement(BasicInputs, {
                        key: 'basic-inputs',
                        inputs,
                        setInputs,
                        language,
                        t,
                        monthlyTrainingFundContribution
                    }) : null,
                    
                    activeTab === 'advanced' && window.AdvancedPortfolio ? 
                        React.createElement(window.AdvancedPortfolio, {
                            key: 'advanced-portfolio',
                            inputs,
                            setInputs,
                            language
                        }) : activeTab === 'advanced' ? 
                        React.createElement('div', { className: "financial-card p-6" }, 
                            language === 'he' ? 'טוען הגדרות מתקדמות...' : 'Loading advanced settings...') : null,
                    
                    activeTab === 'stress' && window.ScenariosStress ?
                        React.createElement(window.ScenariosStress, {
                            key: 'stress-testing',
                            inputs,
                            language
                        }) : activeTab === 'stress' ?
                        React.createElement('div', { className: "financial-card p-6" }, 
                            language === 'he' ? 'טוען בדיקת עמידות...' : 'Loading stress testing...') : null,
                    
                    activeTab === 'analysis' && window.AnalysisTools ?
                        React.createElement(window.AnalysisTools, {
                            key: 'analysis-tools',
                            inputs,
                            results,
                            language
                        }) : activeTab === 'analysis' ?
                        React.createElement('div', { className: "financial-card p-6" }, 
                            language === 'he' ? 'טוען כלי ניתוח...' : 'Loading analysis tools...') : null
                ]),

                // Right Column - Results
                React.createElement('div', { 
                    key: 'results-column',
                    className: "results-column sidebar-panel space-y-6" 
                }, [
                    activeTab === 'basic' ? React.createElement(BasicResults, {
                        key: 'basic-results',
                        results,
                        inputs,
                        language,
                        t,
                        formatCurrency
                    }) : null,

                    React.createElement(SavingsSummaryPanel, {
                        key: 'savings-summary',
                        inputs,
                        language,
                        t,
                        totalMonthlySalary,
                        yearsToRetirement,
                        estimatedMonthlyIncome,
                        projectedWithGrowth,
                        buyingPowerToday,
                        monthlyTotal,
                        avgNetReturn,
                        exportToPNG,
                        exportForAI,
                        setShowChart,
                        generateLLMAnalysis
                    }),

                    React.createElement(BottomLineSummary, {
                        key: 'bottom-line',
                        inputs,
                        language,
                        totalMonthlySalary,
                        yearsToRetirement,
                        estimatedMonthlyIncome,
                        projectedWithGrowth,
                        buyingPowerToday,
                        formatCurrency
                    }),

                    // Enhanced Chart Display with Components and Inflation Toggle
                    showChart ? React.createElement('div', {
                        key: 'chart-container',
                        className: "financial-card p-6 mt-4"
                    }, [
                        React.createElement('div', {
                            key: 'chart-header',
                            className: "flex justify-between items-center mb-4"
                        }, [
                            React.createElement('h3', {
                                key: 'chart-title',
                                className: "text-lg font-bold text-gray-800"
                            }, language === 'he' ? 'גרף התקדמות החיסכון' : 'Savings Progress Chart'),
                            React.createElement('div', {
                                key: 'chart-controls',
                                className: "flex space-x-2"
                            }, [
                                React.createElement('button', {
                                    key: 'inflation-toggle',
                                    onClick: () => setShowInflationChart(!showInflationChart),
                                    className: `px-3 py-1 text-sm rounded ${showInflationChart ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-600`
                                }, language === 'he' ? 'מותאם אינפלציה' : 'Inflation Adjusted'),
                                React.createElement('button', {
                                    key: 'hide-chart',
                                    onClick: () => setShowChart(false),
                                    className: "px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                                }, language === 'he' ? 'הסתר' : 'Hide')
                            ])
                        ]),
                        React.createElement(SimpleChart, {
                            key: 'enhanced-savings-chart',
                            data: (() => {
                                const chartData = [];
                                const currentAge = inputs.currentAge || 30;
                                const retirementAge = inputs.retirementAge || 67;
                                const inflationRate = (inputs.inflationRate || 3) / 100;
                                const pensionReturn = ((inputs.expectedReturn || 7) - (inputs.accumulationFees || 0.1)) / 100;
                                const trainingReturn = ((inputs.expectedReturn || 7) - (inputs.trainingFundFees || 0.6)) / 100;
                                const personalReturn = (inputs.expectedReturn || 7) / 100;
                                
                                for (let age = currentAge; age <= retirementAge; age += 3) {
                                    const yearsInvested = age - currentAge;
                                    
                                    // Calculate individual components
                                    const pensionContribution = (totalMonthlySalary * (inputs.pensionContribution || 18.5) / 100) + 
                                                               (totalMonthlySalary * (inputs.employerContribution || 6) / 100);
                                    const trainingContribution = totalMonthlySalary * (inputs.trainingFundContribution || 2.5) / 100;
                                    const personalContribution = Math.max(0, monthlyTotal - pensionContribution - trainingContribution);
                                    
                                    const pensionFV = pensionContribution * 12 * ((Math.pow(1 + pensionReturn, yearsInvested) - 1) / pensionReturn) * (1 + pensionReturn);
                                    const trainingFV = trainingContribution * 12 * ((Math.pow(1 + trainingReturn, yearsInvested) - 1) / trainingReturn) * (1 + trainingReturn);
                                    const personalFV = personalContribution * 12 * ((Math.pow(1 + personalReturn, yearsInvested) - 1) / personalReturn) * (1 + personalReturn);
                                    
                                    const totalNominal = pensionFV + trainingFV + personalFV + (inputs.currentSavings || 0) * Math.pow(1 + pensionReturn, yearsInvested);
                                    const totalInflationAdjusted = totalNominal / Math.pow(1 + inflationRate, yearsInvested);
                                    
                                    chartData.push({
                                        age: age,
                                        pensionSavings: showInflationChart ? pensionFV / Math.pow(1 + inflationRate, yearsInvested) : pensionFV,
                                        trainingFund: showInflationChart ? trainingFV / Math.pow(1 + inflationRate, yearsInvested) : trainingFV,
                                        personalSavings: showInflationChart ? personalFV / Math.pow(1 + inflationRate, yearsInvested) : personalFV,
                                        totalSavings: totalNominal,
                                        totalInflationAdjusted: totalInflationAdjusted,
                                        value: showInflationChart ? totalInflationAdjusted : totalNominal
                                    });
                                }
                                return chartData;
                            })(),
                            type: 'line',
                            language,
                            showInflationAdjusted: showInflationChart
                        }),
                        React.createElement('div', {
                            key: 'chart-info',
                            className: "mt-3 text-xs text-gray-600"
                        }, showInflationChart ? 
                            (language === 'he' ? 'הערכים מותאמים לכוח הקנייה של היום' : 'Values adjusted to today\'s purchasing power') :
                            (language === 'he' ? 'הערכים בשווי נומינלי עתידי' : 'Values in future nominal terms'))
                    ]) : null
                ])
            ]),

            // LLM Analysis Display
            llmAnalysis ? React.createElement('div', {
                key: 'llm-analysis',
                className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50",
                onClick: () => setLlmAnalysis('')
            }, [
                React.createElement('div', {
                    key: 'analysis-content',
                    className: "bg-white rounded-lg p-6 max-w-2xl max-h-96 overflow-auto",
                    onClick: (e) => e.stopPropagation()
                }, [
                    React.createElement('h3', { 
                        key: 'analysis-title',
                        className: "text-xl font-bold mb-4" 
                    }, language === 'he' ? 'ניתוח AI' : 'AI Analysis'),
                    React.createElement('pre', { 
                        key: 'analysis-text',
                        className: "text-sm whitespace-pre-wrap" 
                    }, llmAnalysis),
                    React.createElement('button', {
                        key: 'close-analysis',
                        onClick: () => setLlmAnalysis(''),
                        className: "mt-4 btn-primary"
                    }, language === 'he' ? 'סגור' : 'Close')
                ])
            ]) : null
        ]);
    };

    // Global initialization
    window.initializeRetirementPlannerCore = () => {
        console.log('🎯 Initializing Retirement Planner Core...');
        const rootElement = document.getElementById('root');
        if (rootElement) {
            // Use React 18 createRoot API
            if (typeof ReactDOM.createRoot === 'function') {
                const root = ReactDOM.createRoot(rootElement);
                root.render(React.createElement(RetirementPlannerCore));
            } else {
                // Fallback for older React versions
                ReactDOM.render(React.createElement(RetirementPlannerCore), rootElement);
            }
            console.log('✅ Retirement Planner Core initialized successfully');
        } else {
            console.error('❌ Root element not found');
        }
    };

})();