// ResultsDisplay Component - Displays calculated retirement projections and financial summaries
const { createElement } = React;

const ResultsDisplay = ({ 
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
    // Icon components
    PiggyBank,
    Calculator,
    DollarSign,
    Target,
    AlertCircle,
    TrendingUp,
    SimpleChart
}) => {
    // Don't render anything if no results
    if (!results) return null;

    return createElement('div', { className: "space-y-6" }, [
        createElement('div', { 
            key: 'results',
            className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in"
        }, [
            createElement('h2', { 
                key: 'title',
                className: "text-2xl font-bold text-green-700 mb-6 flex items-center"
            }, [
                createElement(Calculator, { key: 'icon', className: "mr-2" }),
                language === 'he' ? "תוצאות החישוב" : "Calculation Results"
            ]),
            createElement('div', { key: 'content', className: "space-y-4" }, [
                createElement('div', { key: 'grid', className: "grid grid-cols-2 gap-4" }, [
                    createElement('div', { key: 'total' }, [
                        createElement('div', { 
                            key: 'label',
                            className: "text-sm font-medium text-gray-700"
                        }, language === 'he' ? "סה\"כ צבירה בפרישה" : "Total Savings at Retirement"),
                        createElement('div', { 
                            key: 'value',
                            className: "text-2xl font-bold text-green-600"
                        }, formatCurrency ? formatCurrency(results.totalSavings || 0) : `₪${(results.totalSavings || 0).toLocaleString()}`)
                    ]),
                    createElement('div', { key: 'monthly' }, [
                        createElement('div', { 
                            key: 'label',
                            className: "text-sm font-medium text-gray-700"
                        }, language === 'he' ? "הכנסה חודשית מפנסיה" : "Monthly Pension Income"),
                        createElement('div', { 
                            key: 'value',
                            className: "text-2xl font-bold text-blue-600"
                        }, formatCurrency ? formatCurrency(results.monthlyIncome || 0) : `₪${(results.monthlyIncome || 0).toLocaleString()}`)
                    ])
                ])
            ])
        ])
    ]);
};

// Export to window for global access
window.ResultsPanel = ResultsDisplay;