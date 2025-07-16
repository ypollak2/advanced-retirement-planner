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
        // Retirement Readiness Score
        ReadinessScore && React.createElement(ReadinessScore, {
            key: 'readiness-score',
            currentAge: inputs?.currentAge || effectiveResults.currentAge || 30,
            retirementAge: inputs?.retirementAge || effectiveResults.retirementAge || 67,
            currentSavings: inputs?.currentSavings || 50000,
            monthlyContribution: (inputs?.monthlyContribution || 0) + (inputs?.trainingFundMonthly || 0),
            targetRetirementIncome: inputs?.currentMonthlyExpenses || effectiveResults.monthlyIncome || 15000,
            workingCurrency: workingCurrency,
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
                        }, React.createElement(CurrencyValue, { 
                            key: 'total-savings-value',
                            value: effectiveResults.totalSavings, 
                            currency: workingCurrency,
                            formatter: formatCurrency
                        }))
                    ]),
                    React.createElement('div', { key: 'monthly' }, [
                        React.createElement('div', { 
                            key: 'label',
                            className: "text-sm font-medium text-gray-700"
                        }, language === 'he' ? "הכנסה חודשית מפנסיה" : "Monthly Pension Income"),
                        React.createElement('div', { 
                            key: 'value',
                            className: "text-2xl font-bold text-blue-600"
                        }, React.createElement(CurrencyValue, { 
                            key: 'monthly-income-value',
                            value: effectiveResults.monthlyIncome, 
                            currency: workingCurrency,
                            formatter: formatCurrency
                        }))
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
            formatCurrency: formatCurrency
        }),
        
        // Summary Panel
        effectiveResults && window.SummaryPanel && React.createElement(window.SummaryPanel, {
            key: 'summary-panel',
            inputs: inputs,
            results: effectiveResults,
            partnerResults: partnerResults,
            language: language,
            formatCurrency: formatCurrency
        }),
        
        // Stress Test Interface
        effectiveResults && window.StressTestInterface && React.createElement(window.StressTestInterface, {
            key: 'stress-test',
            inputs: inputs,
            workPeriods: workPeriods,
            results: effectiveResults,
            language: language,
            formatCurrency: formatCurrency
        }),
        
        // Export Controls
        effectiveResults && window.ExportControls && React.createElement(window.ExportControls, {
            key: 'export-controls',
            inputs: inputs,
            results: effectiveResults,
            partnerResults: partnerResults,
            language: language
        })
    ]);
};

// Currency Value Component for async conversion
const CurrencyValue = ({ value, currency, formatter }) => {
    const [displayValue, setDisplayValue] = React.useState('Loading...');
    
    React.useEffect(() => {
        const formatValue = async () => {
            try {
                const symbols = {
                    'ILS': '₪',
                    'USD': '$',
                    'EUR': '€',
                    'GBP': '£',
                    'BTC': '₿',
                    'ETH': 'Ξ'
                };
                
                const currencySymbol = symbols[currency] || '₪';
                
                if (!value || isNaN(value)) {
                    setDisplayValue(`${currencySymbol}0`);
                    return;
                }
                
                // Convert from ILS to target currency
                let convertedValue = value;
                
                if (currency !== 'ILS' && window.currencyAPI) {
                    try {
                        convertedValue = await window.currencyAPI.convertAmount(value, 'ILS', currency);
                    } catch (error) {
                        console.warn('Currency conversion failed, using fallback:', error);
                        // Fallback conversion rates
                        const fallbackRates = {
                            'USD': 0.27,
                            'EUR': 0.25, 
                            'GBP': 0.22,
                            'BTC': 0.0000067,
                            'ETH': 0.0001
                        };
                        const rate = fallbackRates[currency];
                        convertedValue = rate ? value * rate : value;
                    }
                }
                
                // Format based on currency type
                if (currency === 'BTC' || currency === 'ETH') {
                    setDisplayValue(`${currencySymbol}${convertedValue.toFixed(6)}`);
                } else {
                    setDisplayValue(`${currencySymbol}${Math.round(convertedValue).toLocaleString()}`);
                }
            } catch (error) {
                console.error('CurrencyValue formatting error:', error);
                setDisplayValue('Error');
            }
        };
        
        formatValue();
    }, [value, currency]);
    
    return displayValue;
};

// Export to window for global access
window.ResultsPanel = ResultsPanel;
window.CurrencyValue = CurrencyValue;