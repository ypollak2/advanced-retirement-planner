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

    // Content translations
    const content = {
        he: {
            title: 'תחזיות חיסכון דינמיות',
            subtitle: 'מעקב אחר התקדמות החיסכון לפנסיה',
            household: 'סך הכל משקי בית',
            comparison: 'השוואת בני זוג',
            partner1: inputs.partner1Name || 'בן/בת זוג ראשי',
            partner2: inputs.partner2Name || 'בן/בת זוג שני',
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
            partner1: inputs.partner1Name || 'Primary Partner',
            partner2: inputs.partner2Name || 'Secondary Partner',
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

    // Use unified partner data generation from retirementCalculations.js
    const getUnifiedProjectionData = () => {
        if (!window.generateUnifiedPartnerProjections) {
            console.warn('DynamicPartnerCharts: Unified partner projection function not available');
            return { primary: [], partner: [], combined: [] };
        }

        try {
            return window.generateUnifiedPartnerProjections(
                inputs,
                [], // workPeriods - would need to be passed as prop if needed
                [], // partnerWorkPeriods - would need to be passed as prop if needed
                [], // pensionIndexAllocation - would need to be passed as prop if needed
                [], // trainingFundIndexAllocation - would need to be passed as prop if needed
                {} // historicalReturns - would need to be passed as prop if needed
            );
        } catch (error) {
            console.warn('DynamicPartnerCharts: Error generating unified projections:', error);
            return { primary: [], partner: [], combined: [] };
        }
    };

    // Get unified data and format for chart display
    const getChartData = (dataType) => {
        const unifiedData = getUnifiedProjectionData();
        return unifiedData[dataType] || [];
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

        // Determine what data to show based on chartView using unified data
        if (chartView === 'household' && inputs.planningType === 'couple') {
            chartData = getChartData('combined');
            
            // Generate inflation baseline for comparison
            const inflationBaseline = chartData.map(d => {
                const yearsFromStart = d.age - chartData[0].age;
                const inflationRate = (inputs?.inflationRate || 3) / 100;
                return chartData[0].nominal * Math.pow(1 + inflationRate, yearsFromStart);
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
            
            datasets = [{
                label: `${t.partner1} - ${t.nominalValue}`,
                data: primaryData.map(d => d.nominal),
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: false,
                tension: 0.4,
                borderWidth: 2
            }, {
                label: `${t.partner1} - ${t.realValue}`,
                data: primaryData.map(d => d.real),
                borderColor: '#1E40AF',
                backgroundColor: 'rgba(30, 64, 175, 0.1)',
                fill: false,
                tension: 0.4,
                borderWidth: 2,
                borderDash: [5, 5]
            }, {
                label: `${t.partner2} - ${t.nominalValue}`,
                data: partnerData.map(d => d.nominal),
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: false,
                tension: 0.4,
                borderWidth: 2
            }, {
                label: `${t.partner2} - ${t.realValue}`,
                data: partnerData.map(d => d.real),
                borderColor: '#047857',
                backgroundColor: 'rgba(4, 120, 87, 0.1)',
                fill: false,
                tension: 0.4,
                borderWidth: 2,
                borderDash: [5, 5]
            }];
        } else {
            // Single person view using unified primary data
            chartData = getChartData('primary');
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
                scales: window.standardChartFormatting ? 
                    window.standardChartFormatting.getStandardScaleConfig(workingCurrency, language) : 
                    {
                        x: { title: { display: true, text: t.age } },
                        y: { title: { display: true, text: t.amount } }
                    },
                plugins: {
                    tooltip: window.standardChartFormatting ? 
                        window.standardChartFormatting.getStandardTooltipConfig(workingCurrency, language) :
                        {
                            mode: 'index',
                            intersect: false
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