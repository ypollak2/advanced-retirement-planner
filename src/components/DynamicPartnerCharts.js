// Dynamic Partner Charts Component - Real-time visualization for couples planning
// Created by Yali Pollak (יהלי פולק) - v5.3.1

const DynamicPartnerCharts = ({ 
    inputs, 
    results, 
    partnerResults, 
    stressTestResults,
    language = 'he',
    formatCurrency
}) => {
    const [chartView, setChartView] = React.useState('combined');
    const [isUpdating, setIsUpdating] = React.useState(false);
    const chartRef = React.useRef(null);
    const chartInstance = React.useRef(null);

    // Content translations
    const content = {
        he: {
            title: 'תחזיות חיסכון דינמיות',
            subtitle: 'מעקב אחר התקדמות החיסכון לפנסיה',
            combined: 'משולב',
            partner1: 'בן/בת זוג 1',
            partner2: 'בן/בת זוג 2',
            individual: 'אישי',
            nominalValue: 'ערך נומינלי',
            realValue: 'ערך ריאלי (מותאם לאינפלציה)',
            age: 'גיל',
            amount: 'סכום (₪)',
            instructions: {
                title: 'הוראות שימוש בגרפים',
                description: 'הגרפים מציגים תחזיות חיסכון לטווח הארוך עבור תכנון פנסיה זוגי.',
                tips: [
                    'השתמש בכפתורי התצוגה כדי לעבור בין תצוגות שונות',
                    'הגרף המשולב מציג את סך החיסכון של שני בני הזוג',
                    'תצוגה אישית מציגה את החיסכון של כל בן זוג בנפרד',
                    'הקו הכחול מציג את הערך הנומינלי (ללא התחשבות באינפלציה)',
                    'הקו הירוק מציג את הערך הריאלי (מותאם לאינפלציה)',
                    'הגרפים מתעדכנים באופן אוטומטי כאשר משנים נתונים'
                ]
            }
        },
        en: {
            title: 'Dynamic Savings Projections',
            subtitle: 'Track retirement savings progress over time',
            combined: 'Combined',
            partner1: 'Partner 1',
            partner2: 'Partner 2', 
            individual: 'Individual',
            nominalValue: 'Nominal Value',
            realValue: 'Real Value (inflation-adjusted)',
            age: 'Age',
            amount: 'Amount (₪)',
            instructions: {
                title: 'Chart Usage Instructions',
                description: 'These charts display long-term savings projections for couples retirement planning.',
                tips: [
                    'Use the view buttons to switch between different chart perspectives',
                    'Combined view shows total savings for both partners',
                    'Individual view displays each partner\'s savings separately',
                    'Blue line shows nominal value (without inflation adjustment)',
                    'Green line shows real value (adjusted for inflation)',
                    'Charts update automatically when you change input data'
                ]
            }
        }
    };

    const t = content[language] || content.he;

    // Generate projection data for visualization
    const generateProjectionData = (partnerInputs, isPartner2 = false) => {
        const currentAge = partnerInputs?.currentAge || (isPartner2 ? inputs.partnerCurrentAge : inputs.currentAge) || 30;
        const retirementAge = partnerInputs?.retirementAge || (isPartner2 ? inputs.partnerRetirementAge : inputs.retirementAge) || 67;
        const currentSavings = partnerInputs?.currentSavings || (isPartner2 ? inputs.partnerCurrentSavings : inputs.currentSavings) || 50000;
        const currentSalary = partnerInputs?.currentSalary || (isPartner2 ? inputs.partnerCurrentSalary : inputs.currentSalary) || 20000;
        const savingsRate = 0.125; // 12.5% default savings rate
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
            const annualContribution = currentSalary * savingsRate * 12;
            nominalValue = (nominalValue + annualContribution) * (1 + annualReturn);
        }
        
        return data;
    };

    // Generate combined data for couples
    const generateCombinedData = () => {
        const partner1Data = generateProjectionData(inputs, false);
        const partner2Data = generateProjectionData(inputs, true);
        
        return partner1Data.map((p1Point, index) => {
            const p2Point = partner2Data[index] || { nominal: 0, real: 0 };
            return {
                age: p1Point.age,
                nominal: p1Point.nominal + p2Point.nominal,
                real: p1Point.real + p2Point.real
            };
        });
    };

    // Chart rendering with real-time updates
    React.useEffect(() => {
        if (!chartRef.current || !window.Chart) return;

        setIsUpdating(true);
        
        // Destroy existing chart
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        
        let datasets = [];
        let chartData = [];

        // Determine what data to show based on chartView
        if (chartView === 'combined' && inputs.planningType === 'couple') {
            chartData = generateCombinedData();
            datasets = [{
                label: t.nominalValue,
                data: chartData.map(d => d.nominal),
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: false,
                tension: 0.4,
                borderWidth: 3
            }, {
                label: t.realValue,
                data: chartData.map(d => d.real),
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: false,
                tension: 0.4,
                borderWidth: 3
            }];
        } else if (chartView === 'individual' && inputs.planningType === 'couple') {
            const partner1Data = generateProjectionData(inputs, false);
            const partner2Data = generateProjectionData(inputs, true);
            chartData = partner1Data; // Use partner1 ages for x-axis
            
            datasets = [{
                label: `${t.partner1} - ${t.nominalValue}`,
                data: partner1Data.map(d => d.nominal),
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: false,
                tension: 0.4,
                borderWidth: 2
            }, {
                label: `${t.partner1} - ${t.realValue}`,
                data: partner1Data.map(d => d.real),
                borderColor: '#1E40AF',
                backgroundColor: 'rgba(30, 64, 175, 0.1)',
                fill: false,
                tension: 0.4,
                borderWidth: 2,
                borderDash: [5, 5]
            }, {
                label: `${t.partner2} - ${t.nominalValue}`,
                data: partner2Data.map(d => d.nominal),
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: false,
                tension: 0.4,
                borderWidth: 2
            }, {
                label: `${t.partner2} - ${t.realValue}`,
                data: partner2Data.map(d => d.real),
                borderColor: '#047857',
                backgroundColor: 'rgba(4, 120, 87, 0.1)',
                fill: false,
                tension: 0.4,
                borderWidth: 2,
                borderDash: [5, 5]
            }];
        } else {
            // Single person view
            chartData = generateProjectionData(inputs, false);
            datasets = [{
                label: t.nominalValue,
                data: chartData.map(d => d.nominal),
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: false,
                tension: 0.4,
                borderWidth: 3
            }, {
                label: t.realValue,
                data: chartData.map(d => d.real),
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: false,
                tension: 0.4,
                borderWidth: 3
            }];
        }
        
        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.map(d => d.age),
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: t.title,
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                const value = formatCurrency ? formatCurrency(context.parsed.y) : `₪${context.parsed.y.toLocaleString()}`;
                                return `${context.dataset.label}: ${value}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: t.age
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: t.amount
                        },
                        ticks: {
                            callback: function(value) {
                                return `₪${(value / 1000000).toFixed(1)}M`;
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
        
        setTimeout(() => setIsUpdating(false), 300);
        
        // Cleanup function
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [inputs, chartView, language, formatCurrency]);

    return React.createElement('div', {
        className: 'professional-card animate-fade-in-up'
    }, [
        // Instructions Section
        React.createElement('div', {
            key: 'instructions',
            className: 'section-instructions'
        }, [
            React.createElement('h4', {
                key: 'instructions-title'
            }, t.instructions.title),
            React.createElement('p', {
                key: 'instructions-desc'
            }, t.instructions.description),
            React.createElement('ul', {
                key: 'instructions-tips'
            }, t.instructions.tips.map((tip, index) =>
                React.createElement('li', { key: index }, tip)
            ))
        ]),

        // Header with title and view controls
        React.createElement('div', {
            key: 'header',
            className: 'flex justify-between items-center mb-6'
        }, [
            React.createElement('h2', {
                key: 'title'
            }, [
                React.createElement('span', { key: 'icon' }, '📈'),
                t.title
            ]),
            
            // Chart view selector (only show for couples)
            inputs.planningType === 'couple' && React.createElement('div', {
                key: 'view-selector',
                className: 'flex gap-2'
            }, [
                React.createElement('button', {
                    key: 'combined',
                    onClick: () => setChartView('combined'),
                    className: `btn-professional ${chartView === 'combined' ? 'btn-primary' : 'btn-outline'} text-sm`
                }, t.combined),
                React.createElement('button', {
                    key: 'individual',
                    onClick: () => setChartView('individual'),
                    className: `btn-professional ${chartView === 'individual' ? 'btn-primary' : 'btn-outline'} text-sm`
                }, t.individual)
            ])
        ]),

        // Chart container with loading state
        React.createElement('div', {
            key: 'chart-container',
            className: `professional-chart relative ${isUpdating ? 'loading' : ''}`,
            style: { height: '400px' }
        }, [
            React.createElement('canvas', {
                key: 'chart-canvas',
                ref: chartRef,
                style: { maxHeight: '100%' }
            })
        ]),

        // Real-time update indicator
        React.createElement('div', {
            key: 'update-indicator',
            className: 'mt-4 text-sm text-gray-500 flex items-center gap-2'
        }, [
            React.createElement('span', { key: 'icon' }, '🔄'),
            'הגרף מתעדכן באופן אוטומטי עם שינויי הנתונים'
        ])
    ]);
};

// Export to window for global access
window.DynamicPartnerCharts = DynamicPartnerCharts;