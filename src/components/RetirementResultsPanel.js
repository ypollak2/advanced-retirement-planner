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
        ])
    ]);
};

// Export to window for global access
window.ResultsPanel = ResultsPanel;