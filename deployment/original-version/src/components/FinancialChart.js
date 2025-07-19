// FinancialChart.js - Chart component using Chart.js with partner data support

const SimpleChart = ({ data, type = 'line', language = 'en', partnerData = null, chartView = 'combined', workingCurrency = 'ILS' }) => {
    const chartRef = React.useRef(null);
    const chartInstance = React.useRef(null);
    
    // Data validation helper
    const validateChartData = (chartData, view) => {
        if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
            console.warn('FinancialChart: Chart data is invalid or empty.');
            return false;
        }

        if ((view === 'partner1' || view === 'partner2') && !partnerData) {
            console.warn(`FinancialChart: chartView is '${view}' but no partnerData is provided.`)
            return false;
        }

        const requiredProps = ['age', 'totalSavings', 'inflationAdjusted'];
        for (const prop of requiredProps) {
            if (!(prop in chartData[0])) {
                console.warn(`FinancialChart: Missing required property '${prop}' in chart data.`);
                return false;
            }
        }
        return true;
    };

    const safeRenderChart = () => {
        try {
            const effectiveData = (chartView === 'partner1' || chartView === 'partner2') ? partnerData : data;
            if (!validateChartData(effectiveData, chartView)) {
                console.error('FinancialChart: Data validation failed. Cannot render chart.');
                return;
            }
            renderChart();
        } catch (error) {
            console.error('FinancialChart: An unexpected error occurred during chart rendering:', error);
        }
    };
    
    React.useEffect(() => {
        safeRenderChart();
    }, [data, partnerData, chartView, language]);
    
    React.useEffect(() => {
        if (chartRef.current && data && data.length > 0 && window.Chart) {
            const ctx = chartRef.current.getContext('2d');
            
            // Destroy existing chart
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            
            let chartData;
            
            // Use language prop instead of global variable
            const isHebrew = language === 'he';
            
            // Partner data handling - check if we have partner-specific data
            const hasPartnerData = partnerData && (chartView === 'partner1' || chartView === 'partner2');
            const effectiveData = hasPartnerData ? partnerData : data;
            
            // Check if this is accumulation chart (has pensionSavings property) or index chart
            if (effectiveData[0] && effectiveData[0].pensionSavings !== undefined) {
                // Enhanced accumulation chart with stacked area chart for component breakdown
                chartData = {
                    labels: effectiveData.map(d => isHebrew ? `גיל ${d.age}` : `Age ${d.age}`),
                    datasets: [
                        // Stacked area chart for savings breakdown
                        {
                            label: isHebrew ? 'פנסיה (נומינלי)' : 'Pension (Nominal)',
                            data: effectiveData.map(d => d.pensionSavings || 0),
                            borderColor: '#3B82F6',
                            backgroundColor: 'rgba(59, 130, 246, 0.8)',
                            fill: 'start',
                            tension: 0.4,
                            order: 1
                        },
                        {
                            label: isHebrew ? 'קרן השתלמות (נומינלי)' : 'Training Fund (Nominal)',
                            data: effectiveData.map(d => d.trainingFund || 0),
                            borderColor: '#10B981',
                            backgroundColor: 'rgba(16, 185, 129, 0.8)',
                            fill: '-1',
                            tension: 0.4,
                            order: 2
                        },
                        {
                            label: isHebrew ? 'תיק אישי (נומינלי)' : 'Personal Portfolio (Nominal)',
                            data: effectiveData.map(d => d.personalPortfolio || d.personalSavings || 0),
                            borderColor: '#8B5CF6',
                            backgroundColor: 'rgba(139, 92, 246, 0.8)',
                            fill: '-1',
                            tension: 0.4,
                            order: 3
                        },
                        {
                            label: isHebrew ? 'קריפטו (נומינלי)' : 'Crypto (Nominal)',
                            data: effectiveData.map(d => d.crypto || 0),
                            borderColor: '#F97316',
                            backgroundColor: 'rgba(249, 115, 22, 0.8)',
                            fill: '-1',
                            tension: 0.4,
                            order: 4
                        },
                        {
                            label: isHebrew ? 'נדל״ן (נומינלי)' : 'Real Estate (Nominal)',
                            data: effectiveData.map(d => d.realEstate || 0),
                            borderColor: '#059669',
                            backgroundColor: 'rgba(5, 150, 105, 0.8)',
                            fill: '-1',
                            tension: 0.4,
                            order: 5
                        },
                        // Total line overlay (not stacked)
                        {
                            label: isHebrew ? 'סה"כ צבירה (נומינלי)' : 'Total Accumulation (Nominal)',
                            data: effectiveData.map(d => d.totalSavings),
                            borderColor: '#DC2626',
                            backgroundColor: 'rgba(220, 38, 38, 0.0)',
                            fill: false,
                            tension: 0.4,
                            borderWidth: 3,
                            order: 0,
                            pointRadius: 4,
                            pointHoverRadius: 8
                        },
                        // Inflation-adjusted line overlay
                        {
                            label: isHebrew ? 'ערך אמיתי (מותאם אינפלציה)' : 'Real Value (Inflation Adjusted)',
                            data: effectiveData.map(d => d.inflationAdjusted),
                            borderColor: '#F59E0B',
                            backgroundColor: 'rgba(245, 158, 11, 0.0)',
                            fill: false,
                            tension: 0.4,
                            borderDash: [5, 5],
                            borderWidth: 2,
                            order: 0,
                            pointRadius: 3,
                            pointHoverRadius: 6
                        }
                    ]
                };
            } else {
                // Index returns chart (single dataset)
                chartData = {
                    labels: data.map(d => d.name),
                    datasets: [{
                        label: isHebrew ? 'תשואה שנתית ממוצעת (%)' : 'Average Annual Return (%)',
                        data: data.map(d => d.value),
                        borderColor: '#8B5CF6',
                        backgroundColor: 'rgba(139, 92, 246, 0.6)',
                        fill: true
                    }]
                };
            }
            
            chartInstance.current = new window.Chart(ctx, {
                type: type,
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    scales: {
                        x: {
                            display: true,
                            grid: {
                                display: true,
                                color: 'rgba(0, 0, 0, 0.1)'
                            }
                        },
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            stacked: data[0] && data[0].pensionSavings !== undefined,
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    if (data[0] && data[0].pensionSavings !== undefined) {
                                        // Accumulation chart - show currency
                                        const getCurrencySymbol = (currency) => {
                                            const symbols = { 'ILS': '₪', 'USD': '$', 'EUR': '€', 'GBP': '£', 'BTC': '₿', 'ETH': 'Ξ' };
                                            return symbols[currency] || '₪';
                                        };
                                        const symbol = getCurrencySymbol(workingCurrency);
                                        if (value >= 1000000) {
                                            return symbol + (value / 1000000).toFixed(1) + 'M';
                                        } else if (value >= 1000) {
                                            return symbol + (value / 1000).toFixed(0) + 'K';
                                        } else {
                                            return symbol + value.toFixed(0);
                                        }
                                    } else {
                                        // Index chart - show percentage
                                        return value.toFixed(1) + '%';
                                    }
                                }
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: data[0] && data[0].pensionSavings !== undefined 
                                ? (isHebrew ? 'פירוט צבירה לפי רכיבים' : 'Savings Breakdown by Components')
                                : (isHebrew ? 'תשואות היסטוריות במדדים' : 'Historical Index Returns'),
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        },
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                                padding: 15,
                                font: {
                                    size: 12
                                }
                            }
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        if (data[0] && data[0].pensionSavings !== undefined) {
                                            // Currency formatting for accumulation chart
                                            const value = context.parsed.y;
                                            const getCurrencySymbol = (currency) => {
                                                const symbols = { 'ILS': '₪', 'USD': '$', 'EUR': '€', 'GBP': '£', 'BTC': '₿', 'ETH': 'Ξ' };
                                                return symbols[currency] || '₪';
                                            };
                                            const symbol = getCurrencySymbol(workingCurrency);
                                            if (value >= 1000000) {
                                                label += symbol + (value / 1000000).toFixed(1) + 'M';
                                            } else if (value >= 1000) {
                                                label += symbol + (value / 1000).toFixed(0) + 'K';
                                            } else {
                                                label += symbol + value.toLocaleString();
                                            }
                                        } else {
                                            label += context.parsed.y.toFixed(1) + '%';
                                        }
                                    }
                                    return label;
                                },
                                afterLabel: function(context) {
                                    if (data[0] && data[0].pensionSavings !== undefined) {
                                        // Show percentage of total for stacked chart
                                        const dataIndex = context.dataIndex;
                                        const total = effectiveData[dataIndex].totalSavings;
                                        const value = context.parsed.y;
                                        if (total > 0 && context.dataset.label !== 'Total Accumulation (Nominal)' && context.dataset.label !== 'Real Value (Inflation Adjusted)') {
                                            const percentage = ((value / total) * 100).toFixed(1);
                                            return `(${percentage}% of total)`;
                                        }
                                    }
                                    return null;
                                }
                            }
                        }
                    },
                    elements: {
                        point: {
                            radius: 2,
                            hoverRadius: 6
                        }
                    }
                }
            });
        }
    }, [data, type, language]);
    
    return React.createElement('canvas', { ref: chartRef, style: { maxHeight: '400px' } });
};

// Export to window for global access
window.SimpleChart = SimpleChart;