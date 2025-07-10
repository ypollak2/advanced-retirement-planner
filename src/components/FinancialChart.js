// FinancialChart.js - Chart component using Chart.js
const { useRef, useEffect, createElement } = React;

const SimpleChart = ({ data, type = 'line', language = 'he' }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    
    useEffect(() => {
        if (chartRef.current && data && data.length > 0 && window.Chart) {
            const ctx = chartRef.current.getContext('2d');
            
            // Destroy existing chart
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            
            let chartData;
            
            // Use language prop instead of global variable
            const isHebrew = language === 'he';
            
            // Check if this is accumulation chart (has pensionSavings property) or index chart
            if (data[0] && data[0].pensionSavings !== undefined) {
                // Accumulation chart with multiple lines
                chartData = {
                    labels: data.map(d => isHebrew ? `גיל ${d.age}` : `Age ${d.age}`),
                    datasets: [
                        {
                            label: isHebrew ? 'פנסיה (נומינלי)' : 'Pension (Nominal)',
                            data: data.map(d => d.pensionSavings),
                            borderColor: '#3B82F6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            fill: false,
                            tension: 0.4
                        },
                        {
                            label: isHebrew ? 'קרן השתלמות (נומינלי)' : 'Training Fund (Nominal)',
                            data: data.map(d => d.trainingFund),
                            borderColor: '#10B981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            fill: false,
                            tension: 0.4
                        },
                        {
                            label: isHebrew ? 'תיק אישי (נומינלי)' : 'Personal Portfolio (Nominal)',
                            data: data.map(d => d.personalPortfolio || 0),
                            borderColor: '#8B5CF6',
                            backgroundColor: 'rgba(139, 92, 246, 0.1)',
                            fill: false,
                            tension: 0.4
                        },
                        {
                            label: isHebrew ? 'קריפטו (נומינלי)' : 'Crypto (Nominal)',
                            data: data.map(d => d.crypto || 0),
                            borderColor: '#F97316',
                            backgroundColor: 'rgba(249, 115, 22, 0.1)',
                            fill: false,
                            tension: 0.4
                        },
                        {
                            label: isHebrew ? 'נדל״ן (נומינלי)' : 'Real Estate (Nominal)',
                            data: data.map(d => d.realEstate || 0),
                            borderColor: '#059669',
                            backgroundColor: 'rgba(5, 150, 105, 0.1)',
                            fill: false,
                            tension: 0.4
                        },
                        {
                            label: isHebrew ? 'סה"כ צבירה (נומינלי)' : 'Total Accumulation (Nominal)',
                            data: data.map(d => d.totalSavings),
                            borderColor: '#DC2626',
                            backgroundColor: 'rgba(220, 38, 38, 0.1)',
                            fill: false,
                            tension: 0.4,
                            borderWidth: 3
                        },
                        {
                            label: isHebrew ? 'ערך אמיתי (מותאם אינפלציה)' : 'Real Value (Inflation Adjusted)',
                            data: data.map(d => d.inflationAdjusted),
                            borderColor: '#F59E0B',
                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                            fill: false,
                            tension: 0.4,
                            borderDash: [5, 5]
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
                    plugins: {
                        title: {
                            display: true,
                            text: data[0] && data[0].pensionSavings !== undefined 
                                ? (isHebrew ? 'התפתחות הצבירה לאורך השנים' : 'Accumulation Progress Over Years')
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
                                padding: 20
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    if (data[0] && data[0].pensionSavings !== undefined) {
                                        // Accumulation chart - show currency
                                        if (value >= 1000000) {
                                            return '₪' + (value / 1000000).toFixed(1) + 'M';
                                        } else if (value >= 1000) {
                                            return '₪' + (value / 1000).toFixed(0) + 'K';
                                        } else {
                                            return '₪' + value.toFixed(0);
                                        }
                                    } else {
                                        // Index chart - show percentage
                                        return value.toFixed(1) + '%';
                                    }
                                }
                            }
                        },
                        x: {
                            grid: {
                                display: true,
                                color: 'rgba(0, 0, 0, 0.1)'
                            }
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    elements: {
                        point: {
                            radius: 4,
                            hoverRadius: 8
                        }
                    }
                }
            });
        }
    }, [data, type, language]);
    
    return createElement('canvas', { ref: chartRef, style: { maxHeight: '400px' } });
};

// Export to window for global access
window.SimpleChart = SimpleChart;