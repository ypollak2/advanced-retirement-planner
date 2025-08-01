// ResultsDisplay Component - Displays calculated retirement projections and financial summaries with partner data support

const ResultsPanel = ({ 
    results, 
    inputs, 
    workPeriods, 
    language, 
    t, 
    workingCurrency = 'ILS',
    formatCurrency, 
    convertCurrency,
    generateChartData,
    showChart,
    chartData,
    claudeInsights,
    exportRetirementSummary,
    exportAsImage,
    partnerResults,
    chartView,
    // Icon components
    PiggyBank,
    Calculator,
    DollarSign,
    Target,
    AlertCircle,
    TrendingUp,
    SimpleChart,
    ReadinessScore
}) => {

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
    
    // Currency symbols mapping
    const getCurrencySymbol = (currency) => {
        const symbols = {
            'ILS': '₪',
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'BTC': '₿',
            'ETH': 'Ξ'
        };
        return symbols[currency] || '₪';
    };

    // Convert amount from ILS to working currency
    const convertToWorkingCurrency = async (amount) => {
        if (!amount || workingCurrency === 'ILS') return amount;
        
        try {
            if (window.currencyAPI && window.currencyAPI.convertAmount) {
                const converted = await window.currencyAPI.convertAmount(amount, 'ILS', workingCurrency);
                return converted;
            }
            
            // Fallback conversion rates if API not available
            const fallbackRates = {
                'USD': 0.27,
                'EUR': 0.25,
                'GBP': 0.22,
                'BTC': 0.0000067,
                'ETH': 0.0001
            };
            
            const rate = fallbackRates[workingCurrency];
            return rate ? amount * rate : amount;
        } catch (error) {
            console.error('Currency conversion error:', error);
            return amount;
        }
    };
    
    // Error handling wrapper with currency support
    const safeFormatValue = async (value, formatter = null) => {
        try {
            const currencySymbol = getCurrencySymbol(workingCurrency);
            
            if (value == null || isNaN(value)) {
                return `${currencySymbol}0`;
            }
            
            // Convert value to working currency
            const convertedValue = await convertToWorkingCurrency(value);
            
            if (formatter && typeof formatter === 'function') {
                return formatter(convertedValue, workingCurrency);
            }
            
            // Format based on currency type
            if (workingCurrency === 'BTC' || workingCurrency === 'ETH') {
                return `${currencySymbol}${convertedValue.toFixed(6)}`;
            }
            
            return `${currencySymbol}${Math.round(convertedValue).toLocaleString()}`;
        } catch (error) {
            console.error('RetirementResultsPanel: Error formatting value:', error);
            const fallbackSymbol = getCurrencySymbol(workingCurrency);
            return `${fallbackSymbol}0`;
        }
    };
    
    // Set default values
    const effectivePartnerResults = partnerResults || null;
    const effectiveChartView = chartView || 'combined';

    // Handle partner-specific data
    const getEffectiveResults = () => {
        if (inputs?.planningType === 'couple' && effectivePartnerResults) {
            if (effectiveChartView === 'partner1' && effectivePartnerResults.partner1) {
                return effectivePartnerResults.partner1;
            } else if (effectiveChartView === 'partner2' && effectivePartnerResults.partner2) {
                return effectivePartnerResults.partner2;
            }
        }
        return results;
    };

    const effectiveResults = getEffectiveResults();

    if (!validateResults(effectiveResults)) {
        return React.createElement('div', { className: 'text-red-500' }, 'Invalid data provided to results panel.');
    }

    return React.createElement('div', { className: "space-y-6" }, [
        // Retirement Readiness Score (only show with meaningful data)
        (() => {
            const hasMeaningfulDataForScore = inputs && (
                (inputs.currentAge && inputs.currentAge > 0) ||
                (inputs.currentSavings && inputs.currentSavings > 0) ||
                (inputs.currentSalary && inputs.currentSalary > 0)
            );
            
            return hasMeaningfulDataForScore && ReadinessScore && React.createElement(ReadinessScore, {
                key: 'readiness-score',
                inputs: inputs, // Pass the full inputs object for comprehensive data access
                currentAge: inputs?.currentAge || effectiveResults.currentAge || 30,
                retirementAge: inputs?.retirementAge || effectiveResults.retirementAge || 67,
                currentSavings: inputs?.currentSavings || 0,
                monthlyContribution: (inputs?.monthlyContribution || 0) + (inputs?.trainingFundMonthly || 0),
                targetRetirementIncome: inputs?.currentMonthlyExpenses || effectiveResults.monthlyIncome || 0,
                workingCurrency: workingCurrency,
                language: language
            });
        })(),
        
        React.createElement('div', { 
            key: 'results',
            className: "bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl shadow-2xl p-8 border-2 border-green-200 animate-fade-in-up transform hover:scale-105 transition-all duration-300"
        }, [
            React.createElement('h2', { 
                key: 'title',
                className: "text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-8 flex items-center text-center justify-center"
            }, [
                React.createElement(Calculator, { key: 'icon', className: "mr-2" }),
                (() => {
                    const titleText = language === 'he' ? "תוצאות החישוב" : "Calculation Results";
                    // Add title truncation logic for responsive design
                    return titleText.length > 20 ? titleText.substring(0, 20) + '...' : titleText;
                })()
            ]),
            React.createElement('div', { key: 'content', className: "space-y-8" }, [
                React.createElement('div', { key: 'grid', className: "grid grid-cols-1 md:grid-cols-2 gap-8" }, [
                    React.createElement('div', { 
                        key: 'total',
                        className: "bg-white rounded-2xl p-6 shadow-lg border border-green-100 text-center transform hover:scale-105 transition-all duration-200"
                    }, [
                        React.createElement('div', { 
                            key: 'icon-wrapper',
                            className: "mx-auto w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4"
                        }, [
                            React.createElement('span', {
                                key: 'savings-icon',
                                className: "text-white text-2xl"
                            }, '💰')
                        ]),
                        React.createElement('div', { 
                            key: 'label',
                            className: "text-lg font-semibold text-gray-700 mb-2"
                        }, language === 'he' ? "סה\"כ צבירה בפרישה" : "Total Savings at Retirement"),
                        React.createElement('div', { 
                            key: 'value',
                            className: "text-4xl font-extrabold text-green-600 mb-2"
                        }, React.createElement(CurrencyValue, { 
                            key: 'total-savings-value',
                            value: effectiveResults.totalSavings, 
                            currency: workingCurrency,
                            formatter: formatCurrency
                        })),
                        React.createElement('div', {
                            key: 'subtitle',
                            className: "text-sm text-gray-500 font-medium"
                        }, language === 'he' ? '🎯 יעד הפרישה שלך' : '🎯 Your Retirement Goal')
                    ]),
                    React.createElement('div', { 
                        key: 'monthly',
                        className: "bg-white rounded-2xl p-6 shadow-lg border border-blue-100 text-center transform hover:scale-105 transition-all duration-200"
                    }, [
                        React.createElement('div', { 
                            key: 'icon-wrapper',
                            className: "mx-auto w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-4"
                        }, [
                            React.createElement('span', {
                                key: 'income-icon',
                                className: "text-white text-2xl"
                            }, '💵')
                        ]),
                        React.createElement('div', { 
                            key: 'label',
                            className: "text-lg font-semibold text-gray-700 mb-2"
                        }, language === 'he' ? "הכנסה חודשית מפנסיה" : "Monthly Pension Income"),
                        React.createElement('div', { 
                            key: 'value',
                            className: "text-4xl font-extrabold text-blue-600 mb-2"
                        }, React.createElement(CurrencyValue, { 
                            key: 'monthly-income-value',
                            value: effectiveResults.monthlyIncome, 
                            currency: workingCurrency,
                            formatter: formatCurrency
                        })),
                        React.createElement('div', {
                            key: 'subtitle',
                            className: "text-sm text-gray-500 font-medium"
                        }, language === 'he' ? '📅 הכנסה חודשית קבועה' : '📅 Steady Monthly Income')
                    ])
                ])
            ])
        ]),
        
        // Dynamic Partner Charts
        effectiveResults && window.DynamicPartnerCharts && React.createElement(window.DynamicPartnerCharts, {
            key: 'dynamic-charts',
            inputs: inputs,
            results: effectiveResults,
            partnerResults: partnerResults,
            language: language,
            formatCurrency: formatCurrency,
            workingCurrency: workingCurrency
        }),
        
        // Summary Panel
        effectiveResults && window.SummaryPanel && React.createElement(window.SummaryPanel, {
            key: 'summary-panel',
            inputs: inputs,
            results: effectiveResults,
            partnerResults: partnerResults,
            language: language,
            formatCurrency: formatCurrency,
            workingCurrency: workingCurrency
        }),
        
        // Stress Test Interface
        effectiveResults && window.StressTestInterface && React.createElement(window.StressTestInterface, {
            key: 'stress-test',
            inputs: inputs,
            workPeriods: workPeriods,
            results: effectiveResults,
            language: language,
            formatCurrency: formatCurrency,
            workingCurrency: workingCurrency
        }),
        
        // Export Controls
        effectiveResults && window.ExportControls && React.createElement(window.ExportControls, {
            key: 'export-controls',
            inputs: inputs,
            results: effectiveResults,
            partnerResults: partnerResults,
            language: language
        }),
        
        // Chart Display - Net Worth and Expenses Over Time
        chartData && chartData.length > 0 && SimpleChart && React.createElement('div', {
            key: 'chart-section',
            className: 'mt-8'
        }, [
            React.createElement('h3', {
                key: 'chart-title',
                className: 'text-2xl font-bold mb-4 text-center'
            }, language === 'he' ? 'גרף צבירה לאורך זמן' : 'Savings Accumulation Over Time'),
            React.createElement(SimpleChart, {
                key: 'savings-chart',
                data: chartData,
                type: 'line',
                language: language,
                partnerData: partnerResults,
                chartView: chartView,
                workingCurrency: workingCurrency,
                inputs: inputs
            })
        ])
    ]);
};

// Helper functions for currency conversion and formatting
const getCurrencySymbol = (currency) => {
    const symbols = {
        'ILS': '₪',
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'BTC': '₿',
        'ETH': 'Ξ'
    };
    return symbols[currency] || '₪';
};

const convertToWorkingCurrency = (value, targetCurrency) => {
    // Simple conversion - in a real app, you'd use live exchange rates
    const rates = {
        'ILS': 1,
        'USD': 0.27,
        'EUR': 0.25,
        'GBP': 0.21,
        'BTC': 0.000007,
        'ETH': 0.0001
    };
    
    if (!value || isNaN(value)) return 0;
    return value * (rates[targetCurrency] || 1);
};

// Currency Value Component for async conversion - reuses existing safeFormatValue function
const CurrencyValue = ({ value, currency, formatter }) => {
    const [displayValue, setDisplayValue] = React.useState('Loading...');
    
    React.useEffect(() => {
        const formatAndConvert = async () => {
            try {
                // Convert from ILS to target currency using existing function
                const targetCurrencyValue = convertToWorkingCurrency(value, currency);
                
                // Create a custom formatter for this currency
                const currencyFormatter = (val) => {
                    const targetCurrencySymbol = getCurrencySymbol(currency);
                    if (currency === 'BTC' || currency === 'ETH') {
                        return `${targetCurrencySymbol}${val.toFixed(6)}`;
                    } else {
                        return `${targetCurrencySymbol}${Math.round(val).toLocaleString()}`;
                    }
                };
                
                // Use the currency formatter directly since safeFormatValue is not accessible here
                const result = currencyFormatter(targetCurrencyValue);
                setDisplayValue(result);
            } catch (error) {
                console.error('CurrencyValue formatting error:', error);
                setDisplayValue('Error');
            }
        };
        
        formatAndConvert();
    }, [value, currency]);
    
    return displayValue;
};

// Export to window for global access
window.ResultsPanel = ResultsPanel;
window.CurrencyValue = CurrencyValue;