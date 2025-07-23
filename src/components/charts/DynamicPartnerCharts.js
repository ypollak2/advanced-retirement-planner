// Dynamic Partner Charts Component - Real-time visualization for couples planning
// Created by Yali Pollak (יהלי פולק)

const DynamicPartnerCharts = ({ 
    inputs, 
    results, 
    partnerResults, 
    stressTestResults,
    language = 'en',
    formatCurrency,
    workingCurrency = 'ILS'
}) => {
    const [chartView, setChartView] = React.useState('household');
    const [isUpdating, setIsUpdating] = React.useState(false);
    const chartRef = React.useRef(null);
    const chartInstance = React.useRef(null);
    const [chartDataCache, setChartDataCache] = React.useState(null);
    
    // Use new progressive savings calculation engine from retirementCalculations.js
    const getUnifiedProjectionData = React.useCallback(() => {
        if (!window.calculateProgressiveSavings) {
            console.warn('DynamicPartnerCharts: Progressive savings calculation function not available');
            return { primary: [], partner: [], combined: [] };
        }

        try {
            // Use the new progressive calculation engine for accurate projections
            return window.calculateProgressiveSavings(inputs, [], []);
        } catch (error) {
            console.warn('DynamicPartnerCharts: Error generating progressive projections:', error);
            return { primary: [], partner: [], combined: [] };
        }
    }, [inputs]);
    
    // Memoize chart data to prevent unnecessary re-renders
    const memoizedChartData = React.useMemo(() => {
        const data = getUnifiedProjectionData();
        setChartDataCache(data);
        return data;
    }, [getUnifiedProjectionData, chartView]);

    // Content translations
    const content = {
        he: {
            title: 'תחזיות חיסכון דינמיות',
            subtitle: 'מעקב אחר התקדמות החיסכון לפנסיה',
            household: 'סך הכל משקי בית',
            comparison: 'השוואת בני זוג',
            partner1: inputs.userName || 'בן/בת זוג ראשי',
            partner2: inputs.partnerName || 'בן/בת זוג שני',
            nominalValue: 'ערך נומינלי',
            realValue: 'ערך ריאלי (מותאם לאינפלציה)',
            age: 'גיל',
            amount: `סכום (${workingCurrency === 'ILS' ? '₪' : workingCurrency})`,
            instructions: {
                title: 'הוראות שימוש בגרפים',
                description: 'הגרפים מציגים תחזיות חיסכון לטווח הארוך עבור תכנון פנסיה זוגי.',
                tips: [
                    'השתמש בכפתורי התצוגה כדי לעבור בין תצוגות שונות',
                    'תצוגת משקי הבית מציגה את סך החיסכון המשולב של שני בני הזוג יחד',
                    'תצוגת השוואה מציגה את החיסכון של כל בן זוג בנפרד לצורך השוואה',
                    'הקו הכחול מציג ערכים נומינליים (לא מותאמים לאינפלציה)',
                    'הקו הירוק מציג ערכים ריאליים (מותאמים לאינפלציה)',
                    'הקו הצהוב המקווקו מציג את השפעת האינפלציה על החיסכון הראשוני',
                    'הקו הכחול מציג את הערך הנומינלי (ללא התחשבות באינפלציה)',
                    'הקו הירוק מציג את הערך הריאלי (מותאם לאינפלציה)',
                    'הגרפים מתעדכנים באופן אוטומטי כאשר משנים נתונים'
                ]
            }
        },
        en: {
            title: 'Dynamic Savings Projections',
            subtitle: 'Track retirement savings progress over time',
            household: 'Household Total',
            comparison: 'Partner Comparison',
            partner1: inputs.userName || 'Primary Partner',
            partner2: inputs.partnerName || 'Secondary Partner',
            nominalValue: 'Nominal Value',
            realValue: 'Real Value (inflation-adjusted)',
            age: 'Age',
            amount: `Amount (${workingCurrency === 'ILS' ? '₪' : workingCurrency})`,
            instructions: {
                title: 'Chart Usage Instructions',
                description: 'These charts display long-term savings projections for couples retirement planning.',
                tips: [
                    'Use the view buttons to switch between different chart perspectives',
                    'Household view shows combined total savings of both partners together',
                    'Comparison view shows each partner\'s savings separately for comparison',
                    'Blue line shows nominal values (not adjusted for inflation)',
                    'Green line shows real values (adjusted for inflation)',
                    'Yellow dashed line shows inflation impact on initial savings',
                    'Blue line shows nominal value (without inflation adjustment)',
                    'Green line shows real value (adjusted for inflation)',
                    'Charts update automatically when you change input data'
                ]
            }
        }
    };

    const t = content[language] || content.en;

    // Get unified data and format for chart display - use memoized data
    const getChartData = (dataType) => {
        const unifiedData = chartDataCache || memoizedChartData;
        return unifiedData[dataType] || [];
    };

    // Enhanced chart rendering with better state synchronization
    React.useEffect(() => {
        if (!chartRef.current || !window.Chart) return;

        setIsUpdating(true);
        
        // Properly destroy existing chart with error handling
        if (chartInstance.current) {
            try {
                chartInstance.current.destroy();
                chartInstance.current = null;
            } catch (error) {
                console.warn('Chart destruction error:', error);
                chartInstance.current = null;
            }
        }

        const ctx = chartRef.current.getContext('2d');
        
        let datasets = [];
        let chartData = [];

        // Determine what data to show based on chartView using progressive data
        if (chartView === 'household' && inputs.planningType === 'couple') {
            chartData = getChartData('combined');
            
            // Generate inflation baseline showing erosion of initial value
            const inflationBaseline = chartData.map(d => {
                const yearsFromStart = d.age - chartData[0].age;
                const inflationRate = (inputs?.inflationRate || 3) / 100;
                const initialValue = chartData[0].nominal || 1000; // Use actual initial value or fallback
                return initialValue * Math.pow(1 + inflationRate, yearsFromStart);
            });
            
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
            }, {
                label: language === 'he' ? 'השפעת האינפלציה' : 'Inflation Impact',
                data: inflationBaseline,
                borderColor: '#F59E0B',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                fill: false,
                tension: 0.4,
                borderWidth: 2,
                borderDash: [10, 5]
            }];
        } else if (chartView === 'comparison' && inputs.planningType === 'couple') {
            const primaryData = getChartData('primary');
            const partnerData = getChartData('partner');
            chartData = primaryData; // Use primary partner ages for x-axis
            
            // Enhanced comparison view with better visual distinction
            datasets = [{
                label: `${t.partner1} - ${t.nominalValue}`,
                data: primaryData.map(d => d.nominal),
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                fill: false,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 2,
                pointHoverRadius: 6
            }, {
                label: `${t.partner1} - ${t.realValue}`,
                data: primaryData.map(d => d.real),
                borderColor: '#1E40AF',
                backgroundColor: 'rgba(30, 64, 175, 0.2)',
                fill: false,
                tension: 0.4,
                borderWidth: 2,
                borderDash: [8, 4],
                pointRadius: 2,
                pointHoverRadius: 6
            }, {
                label: `${t.partner2} - ${t.nominalValue}`,
                data: partnerData.map(d => d.nominal),
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                fill: false,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 2,
                pointHoverRadius: 6
            }, {
                label: `${t.partner2} - ${t.realValue}`,
                data: partnerData.map(d => d.real),
                borderColor: '#047857',
                backgroundColor: 'rgba(4, 120, 87, 0.2)',
                fill: false,
                tension: 0.4,
                borderWidth: 2,
                borderDash: [8, 4],
                pointRadius: 2,
                pointHoverRadius: 6
            }];
        } else {
            // Single person view using progressive primary data
            chartData = getChartData('primary');
            datasets = [{
                label: t.nominalValue,
                data: chartData.map(d => d.nominal),
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: false,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 3,
                pointHoverRadius: 8
            }, {
                label: t.realValue,
                data: chartData.map(d => d.real),
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: false,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 3,
                pointHoverRadius: 8
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
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 12
                            },
                            generateLabels: function(chart) {
                                const original = Chart.defaults.plugins.legend.labels.generateLabels;
                                const labels = original.call(this, chart);
                                
                                // Enhance legend labels with better formatting
                                labels.forEach(label => {
                                    if (label.text.includes('Primary Partner') && inputs.userName) {
                                        label.text = label.text.replace('Primary Partner', inputs.userName);
                                    }
                                    if (label.text.includes('Secondary Partner') && inputs.partnerName) {
                                        label.text = label.text.replace('Secondary Partner', inputs.partnerName);
                                    }
                                });
                                
                                return labels;
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#3B82F6',
                        borderWidth: 1,
                        displayColors: true,
                        callbacks: {
                            title: function(tooltipItems) {
                                const age = tooltipItems[0].label;
                                return `${t.age}: ${age}`;
                            },
                            label: function(context) {
                                const value = formatCurrency ? formatCurrency(context.parsed.y) : `₪${context.parsed.y.toLocaleString()}`;
                                const dataIndex = context.dataIndex;
                                const dataset = context.dataset;
                                
                                // Enhanced tooltip with more context
                                let label = `${dataset.label}: ${value}`;
                                
                                // Add inflation impact information for real values
                                if (dataset.label.includes(t.realValue) || dataset.label.includes('Real Value')) {
                                    const nominalValue = chartData[dataIndex]?.nominal;
                                    if (nominalValue && nominalValue !== context.parsed.y) {
                                        const inflationImpact = ((nominalValue - context.parsed.y) / nominalValue * 100).toFixed(1);
                                        label += ` (${inflationImpact}% ${language === 'he' ? 'השפעת אינפלציה' : 'inflation impact'})`;
                                    }
                                }
                                
                                return label;
                            },
                            afterBody: function(tooltipItems) {
                                if (chartData && chartData.length > 0) {
                                    const dataIndex = tooltipItems[0].dataIndex;
                                    const point = chartData[dataIndex];
                                    
                                    if (point && point.yearlyContributions) {
                                        const yearlyContrib = formatCurrency ? formatCurrency(point.yearlyContributions) : `₪${point.yearlyContributions.toLocaleString()}`;
                                        return [``, `${language === 'he' ? 'תרומה שנתית' : 'Annual Contributions'}: ${yearlyContrib}`];
                                    }
                                }
                                return [];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: t.age,
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: `${t.amount} (${workingCurrency === 'ILS' ? '₪' : workingCurrency})`,
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            callback: function(value) {
                                // Format large numbers with K/M suffixes
                                if (value >= 1000000) {
                                    return (value / 1000000).toFixed(1) + 'M';
                                } else if (value >= 1000) {
                                    return (value / 1000).toFixed(0) + 'K';
                                }
                                return value.toLocaleString();
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'index',
                    axis: 'x',
                    intersect: false
                },
                elements: {
                    point: {
                        hoverRadius: 8,
                        hoverBorderWidth: 3
                    }
                },
                animation: {
                    duration: 750,
                    easing: 'easeInOutQuart'
                }
            }
        });
        
        // Enhanced chart completion handling
        const chartCompleteTimeout = setTimeout(() => {
            setIsUpdating(false);
        }, 300);
        
        // Enhanced cleanup function with proper error handling
        return () => {
            clearTimeout(chartCompleteTimeout);
            if (chartInstance.current) {
                try {
                    chartInstance.current.destroy();
                    chartInstance.current = null;
                } catch (error) {
                    console.warn('Chart cleanup error:', error);
                    chartInstance.current = null;
                }
            }
        };
    }, [inputs, chartView, language, formatCurrency, workingCurrency, results, partnerResults]);

    return React.createElement('div', {
        className: 'professional-card animate-fade-in-up'
    }, [
        // Dynamic Chart Explanation Based on Current View
        React.createElement('div', {
            key: 'chart-explanation',
            className: 'bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-200'
        }, [
            React.createElement('div', {
                key: 'explanation-header',
                className: 'flex items-center mb-3'
            }, [
                React.createElement('span', {
                    key: 'info-icon',
                    className: 'text-2xl mr-2'
                }, '💡'),
                React.createElement('h4', {
                    key: 'explanation-title',
                    className: 'text-lg font-semibold text-blue-800'
                }, language === 'he' ? 'הסבר על התצוגה הנוכחית' : 'Current View Explanation')
            ]),
            React.createElement('div', {
                key: 'explanation-content',
                className: 'text-sm text-blue-700'
            }, (() => {
                if (chartView === 'household' && inputs.planningType === 'couple') {
                    return language === 'he' ? 
                        'תצוגת משקי הבית מציגה את סך החיסכון המשולב של שני בני הזוג. זהו הסכום הכולל שיהיה זמין למשק הבית בפרישה. הקו הכחול מציג ערכים נומינליים (המספרים בפועל), הקו הירוק מציג ערכים ריאליים (מותאמי אינפלציה), והקו הצהוב המקווקו מציג את השפעת האינפלציה על החיסכון הראשוני.' :
                        'Household view shows the combined savings of both partners. This is the total amount available to your household at retirement. The blue line shows nominal values (actual numbers), the green line shows real values (inflation-adjusted), and the yellow dashed line shows inflation impact on initial savings.';
                } else if (chartView === 'comparison' && inputs.planningType === 'couple') {
                    return language === 'he' ?
                        'תצוגת השוואה מציגה את החיסכון של כל בן זוג בנפרד. זה מאפשר לראות את התרומה של כל אחד ולזהות פערים או הזדמנויות לשיפור. קווים מלאים מציגים ערכים נומינליים וקווים מקווקווים מציגים ערכים ריאליים.' :
                        'Comparison view shows each partner\'s savings separately. This allows you to see each person\'s contribution and identify gaps or improvement opportunities. Solid lines show nominal values and dashed lines show real values.';
                } else {
                    return language === 'he' ?
                        'תצוגת יחיד מציגה את חיסכון הפרט. הקו הכחול מציג ערכים נומינליים (המספרים בפועל) והקו הירוק מציג ערכים ריאליים המותאמים לאינפלציה לאורך זמן.' :
                        'Single view shows individual retirement savings. The blue line shows nominal values (actual numbers) and the green line shows real values adjusted for inflation over time.';
                }
            })())
        ]),

        // Instructions Section (collapsed by default)
        React.createElement('details', {
            key: 'instructions',
            className: 'section-instructions mb-6'
        }, [
            React.createElement('summary', {
                key: 'instructions-summary',
                className: 'cursor-pointer text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors'
            }, [
                React.createElement('span', { key: 'icon' }, '📋 '),
                t.instructions.title
            ]),
            React.createElement('div', {
                key: 'instructions-content',
                className: 'mt-3 p-4 bg-gray-50 rounded-lg'
            }, [
                React.createElement('p', {
                    key: 'instructions-desc',
                    className: 'mb-3 text-gray-700'
                }, t.instructions.description),
                React.createElement('ul', {
                    key: 'instructions-tips',
                    className: 'space-y-2'
                }, t.instructions.tips.map((tip, index) =>
                    React.createElement('li', { 
                        key: index,
                        className: 'flex items-start'
                    }, [
                        React.createElement('span', {
                            key: 'bullet',
                            className: 'text-blue-500 mr-2 mt-1 text-sm'
                        }, '•'),
                        React.createElement('span', {
                            key: 'text',
                            className: 'text-gray-600 text-sm'
                        }, tip)
                    ])
                ))
            ])
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
                    key: 'household',
                    onClick: () => setChartView('household'),
                    className: `btn-professional ${chartView === 'household' ? 'btn-primary' : 'btn-outline'} text-sm relative group`,
                    title: language === 'he' ? 'הצג את סך החיסכון המשולב של שני בני הזוג' : 'Show combined household savings'
                }, [
                    t.household,
                    React.createElement('div', {
                        key: 'household-tooltip',
                        className: 'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10'
                    }, language === 'he' ? '💰 סך החיסכון המשולב' : '💰 Combined Total Savings')
                ]),
                React.createElement('button', {
                    key: 'comparison',
                    onClick: () => setChartView('comparison'),
                    className: `btn-professional ${chartView === 'comparison' ? 'btn-primary' : 'btn-outline'} text-sm relative group`,
                    title: language === 'he' ? 'השווה בין החיסכון של כל בן זוג בנפרד' : 'Compare each partner\'s savings separately'
                }, [
                    t.comparison,
                    React.createElement('div', {
                        key: 'comparison-tooltip',
                        className: 'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10'
                    }, language === 'he' ? '📊 השוואה בין בני הזוג' : '📊 Partner-by-Partner Comparison')
                ])
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

        // Enhanced real-time update indicator with loading state
        React.createElement('div', {
            key: 'update-indicator',
            className: 'mt-4 text-sm text-gray-500 flex items-center gap-2'
        }, [
            React.createElement('span', { 
                key: 'icon',
                className: isUpdating ? 'animate-spin' : ''
            }, isUpdating ? '⏳' : '🔄'),
            React.createElement('span', {
                key: 'text',
                className: isUpdating ? 'text-blue-600 font-medium' : ''
            }, isUpdating ? 
                (language === 'he' ? 'מעדכן נתונים...' : 'Updating data...') :
                (language === 'he' ? 'הגרף מתעדכן באופן אוטומטי עם שינויי הנתונים' : 'Chart updates automatically with data changes')
            )
        ])
    ]);
};

// Export to window for global access
window.DynamicPartnerCharts = DynamicPartnerCharts;