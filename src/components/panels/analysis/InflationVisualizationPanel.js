// Inflation Impact Visualization Panel - UX for inflation analysis with interactive charts
// Shows real vs nominal values with comprehensive purchasing power analysis

const InflationVisualizationPanel = ({ inputs, results, language = 'en' }) => {
    const createElement = React.createElement;
    
    // Multi-language content
    const content = {
        he: {
            title: 'ניתוח השפעת אינפלציה',
            subtitle: 'הדמיה של ערכים ריאליים מול נומינליים עם ניתוח כוח קנייה',
            noData: 'אין נתונים זמינים לניתוח אינפלציה',
            realVsNominal: 'ריאלי מול נומינלי',
            purchasingPower: 'כוח קנייה',
            inflationScenarios: 'תרחישי אינפלציה',
            protectionScore: 'ציון הגנה מאינפלציה',
            currentValues: 'ערכים נוכחיים',
            projectedValues: 'ערכים חזויים',
            realValue: 'ערך ריאלי',
            nominalValue: 'ערך נומינלי',
            inflationRate: 'שיעור אינפלציה',
            erosion: 'שחיקה',
            protection: 'הגנה',
            years: 'שנים',
            currency: '₪',
            percentage: '%',
            optimistic: 'אופטימי',
            moderate: 'מתון',
            pessimistic: 'פסימי',
            historical: 'היסטורי',
            assetProtection: 'הגנת נכסים',
            recommendations: 'המלצות',
            viewChart: 'הצג גרף',
            viewTable: 'הצג טבלה',
            export: 'יצא נתונים',
            settings: 'הגדרות',
            scenarioAnalysis: 'ניתוח תרחישים',
            totalSavings: 'סך חיסכונות',
            monthlyIncome: 'הכנסה חודשית',
            purchasingPowerLoss: 'אובדן כוח קנייה',
            inflationHedge: 'גידור אינפלציה',
            riskLevel: 'רמת סיכון',
            timeHorizon: 'אופק זמן',
            compoundEffect: 'השפעה מצטברת'
        },
        en: {
            title: 'Inflation Impact Analysis',
            subtitle: 'Real vs nominal values visualization with purchasing power analysis',
            noData: 'No data available for inflation analysis',
            realVsNominal: 'Real vs Nominal',
            purchasingPower: 'Purchasing Power',
            inflationScenarios: 'Inflation Scenarios',
            protectionScore: 'Inflation Protection Score',
            currentValues: 'Current Values',
            projectedValues: 'Projected Values',
            realValue: 'Real Value',
            nominalValue: 'Nominal Value',
            inflationRate: 'Inflation Rate',
            erosion: 'Erosion',
            protection: 'Protection',
            years: 'Years',
            currency: '₪',
            percentage: '%',
            optimistic: 'Optimistic',
            moderate: 'Moderate',
            pessimistic: 'Pessimistic',
            historical: 'Historical',
            assetProtection: 'Asset Protection',
            recommendations: 'Recommendations',
            viewChart: 'View Chart',
            viewTable: 'View Table',
            export: 'Export Data',
            settings: 'Settings',
            scenarioAnalysis: 'Scenario Analysis',
            totalSavings: 'Total Savings',
            monthlyIncome: 'Monthly Income',
            purchasingPowerLoss: 'Purchasing Power Loss',
            inflationHedge: 'Inflation Hedge',
            riskLevel: 'Risk Level',
            timeHorizon: 'Time Horizon',
            compoundEffect: 'Compound Effect'
        }
    };
    
    const t = content[language];
    
    // State for UI
    const [viewMode, setViewMode] = React.useState('chart'); // 'chart' or 'table'
    const [selectedScenario, setSelectedScenario] = React.useState('moderate');
    const [inflationAnalysis, setInflationAnalysis] = React.useState(null);
    const [chartData, setChartData] = React.useState(null);
    const [showSettings, setShowSettings] = React.useState(false);
    const [timeHorizon, setTimeHorizon] = React.useState(30);
    
    // Perform inflation analysis on mount and when inputs change
    React.useEffect(() => {
        if (results && window.inflationCalculations) {
            try {
                const yearsToRetirement = (inputs.retirementAge || 67) - (inputs.currentAge || 30);
                const projectionYears = Math.min(timeHorizon, yearsToRetirement + 30);
                
                const analysis = window.analyzeInflationImpact(
                    inputs,
                    projectionYears,
                    inputs.country || 'israel',
                    language
                );
                
                setInflationAnalysis(analysis);
                
                // Generate chart data
                const chartDataGenerated = generateChartData(analysis, projectionYears);
                setChartData(chartDataGenerated);
                
            } catch (error) {
                console.error('Error analyzing inflation impact:', error);
            }
        }
    }, [inputs, results, timeHorizon, language]);
    
    // Generate chart data for visualization
    const generateChartData = (analysis, projectionYears) => {
        if (!analysis) return null;
        
        const data = {
            labels: [],
            datasets: []
        };
        
        // Generate year labels
        for (let year = 0; year <= projectionYears; year += 5) {
            data.labels.push(`${year} ${t.years}`);
        }
        
        const scenarios = ['optimistic', 'moderate', 'pessimistic', 'historical'];
        const colors = {
            optimistic: 'rgb(34, 197, 94)',    // Green
            moderate: 'rgb(59, 130, 246)',     // Blue  
            pessimistic: 'rgb(239, 68, 68)',  // Red
            historical: 'rgb(168, 85, 247)'   // Purple
        };
        
        // Create datasets for each scenario
        scenarios.forEach(scenario => {
            if (analysis.purchasing_power[scenario]) {
                const realValueData = [];
                const nominalValueData = [];
                
                for (let year = 0; year <= projectionYears; year += 5) {
                    const dataPoint = analysis.purchasing_power[scenario].find(p => p.year === year) ||
                                     analysis.purchasing_power[scenario][0];
                    
                    if (dataPoint) {
                        realValueData.push(dataPoint.realValue);
                        nominalValueData.push(dataPoint.equivalentNominal);
                    }
                }
                
                // Real value dataset
                data.datasets.push({
                    label: `${t[scenario]} - ${t.realValue}`,
                    data: realValueData,
                    borderColor: colors[scenario],
                    backgroundColor: colors[scenario] + '20',
                    fill: false,
                    tension: 0.1,
                    borderDash: scenario === selectedScenario ? [] : [5, 5]
                });
                
                // Nominal value dataset (dotted line)
                data.datasets.push({
                    label: `${t[scenario]} - ${t.nominalValue}`,
                    data: nominalValueData,
                    borderColor: colors[scenario],
                    backgroundColor: colors[scenario] + '10',
                    fill: false,
                    tension: 0.1,
                    borderDash: [2, 2],
                    pointRadius: 2
                });
            }
        });
        
        return data;
    };
    
    if (!results || !inflationAnalysis) {
        return createElement('div', {
            key: 'no-inflation-data',
            className: "bg-gray-50 rounded-xl p-6 border border-gray-200"
        }, [
            createElement('div', {
                key: 'no-data-icon',
                className: "text-center text-gray-400 text-4xl mb-4"
            }, '📊'),
            createElement('p', {
                key: 'no-data-text',
                className: "text-gray-600 text-center"
            }, t.noData)
        ]);
    }
    
    // Helper functions
    const formatCurrency = (amount) => {
        return `${t.currency}${Math.round(amount || 0).toLocaleString()}`;
    };
    
    const formatPercentage = (value) => {
        return `${(value || 0).toFixed(1)}${t.percentage}`;
    };
    
    const getProtectionColor = (score) => {
        if (score >= 70) return 'text-green-600 bg-green-50 border-green-200';
        if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };
    
    const handleScenarioChange = (scenario) => {
        setSelectedScenario(scenario);
    };
    
    return createElement('div', {
        key: 'inflation-visualization-panel',
        className: 'space-y-6'
    }, [
        // Header
        createElement('div', {
            key: 'header',
            className: 'text-center'
        }, [
            createElement('div', {
                key: 'header-icon',
                className: 'text-4xl mb-3'
            }, '📈'),
            createElement('h3', {
                key: 'header-title',
                className: 'text-2xl font-bold text-gray-800 mb-2'
            }, t.title),
            createElement('p', {
                key: 'header-subtitle',
                className: 'text-gray-600'
            }, t.subtitle)
        ]),
        
        // Control Panel
        createElement('div', {
            key: 'controls',
            className: 'bg-white rounded-xl p-4 border border-gray-200 shadow-sm'
        }, [
            createElement('div', {
                key: 'control-buttons',
                className: 'flex flex-wrap justify-between items-center gap-4'
            }, [
                // View Mode Toggle
                createElement('div', {
                    key: 'view-toggle',
                    className: 'flex bg-gray-100 rounded-lg p-1'
                }, [
                    createElement('button', {
                        key: 'chart-view-btn',
                        onClick: () => setViewMode('chart'),
                        className: `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            viewMode === 'chart' 
                                ? 'bg-white text-blue-600 shadow' 
                                : 'text-gray-600 hover:text-gray-800'
                        }`
                    }, t.viewChart),
                    createElement('button', {
                        key: 'table-view-btn',
                        onClick: () => setViewMode('table'),
                        className: `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            viewMode === 'table' 
                                ? 'bg-white text-blue-600 shadow' 
                                : 'text-gray-600 hover:text-gray-800'
                        }`
                    }, t.viewTable)
                ]),
                
                // Scenario Selector
                createElement('div', {
                    key: 'scenario-selector',
                    className: 'flex items-center gap-2'
                }, [
                    createElement('span', {
                        key: 'scenario-label',
                        className: 'text-sm font-medium text-gray-700'
                    }, t.inflationScenarios + ':'),
                    createElement('select', {
                        key: 'scenario-select',
                        value: selectedScenario,
                        onChange: (e) => handleScenarioChange(e.target.value),
                        className: 'px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                    }, [
                        createElement('option', { key: 'opt-optimistic', value: 'optimistic' }, t.optimistic),
                        createElement('option', { key: 'opt-moderate', value: 'moderate' }, t.moderate),
                        createElement('option', { key: 'opt-pessimistic', value: 'pessimistic' }, t.pessimistic),
                        createElement('option', { key: 'opt-historical', value: 'historical' }, t.historical)
                    ])
                ]),
                
                // Action Buttons
                createElement('div', {
                    key: 'action-buttons',
                    className: 'flex gap-2'
                }, [
                    createElement('button', {
                        key: 'settings-btn',
                        onClick: () => setShowSettings(!showSettings),
                        className: 'px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50'
                    }, t.settings),
                    createElement('button', {
                        key: 'export-btn',
                        className: 'px-3 py-1 text-sm text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50'
                    }, t.export)
                ])
            ])
        ]),
        
        // Settings Panel (collapsible)
        showSettings && createElement('div', {
            key: 'settings-panel',
            className: 'bg-gray-50 rounded-xl p-6 border border-gray-200'
        }, [
            createElement('h4', {
                key: 'settings-title',
                className: 'text-lg font-semibold text-gray-800 mb-4'
            }, t.settings),
            createElement('div', {
                key: 'settings-grid',
                className: 'grid grid-cols-1 md:grid-cols-2 gap-4'
            }, [
                // Time Horizon Setting
                createElement('div', {
                    key: 'time-horizon-setting'
                }, [
                    createElement('label', {
                        key: 'time-horizon-label',
                        className: 'block text-sm font-medium text-gray-700 mb-2'
                    }, `${t.timeHorizon}: ${timeHorizon} ${t.years}`),
                    createElement('input', {
                        key: 'time-horizon-input',
                        type: 'range',
                        min: '10',
                        max: '50',
                        step: '5',
                        value: timeHorizon,
                        onChange: (e) => setTimeHorizon(parseInt(e.target.value)),
                        className: 'w-full'
                    })
                ])
            ])
        ]),
        
        // Key Metrics Summary
        createElement('div', {
            key: 'metrics-summary',
            className: 'grid grid-cols-1 md:grid-cols-4 gap-4'
        }, [
            // Inflation Protection Score
            createElement('div', {
                key: 'protection-score',
                className: `p-4 rounded-lg border-2 text-center ${getProtectionColor(inflationAnalysis.realValueAnalysis.inflationProtection)}`
            }, [
                createElement('div', {
                    key: 'protection-label',
                    className: 'text-sm font-medium mb-1'
                }, t.protectionScore),
                createElement('div', {
                    key: 'protection-value',
                    className: 'text-2xl font-bold'
                }, `${inflationAnalysis.realValueAnalysis.inflationProtection}${t.percentage}`)
            ]),
            
            // Current vs Future Purchasing Power
            createElement('div', {
                key: 'purchasing-power',
                className: 'p-4 rounded-lg border-2 border-blue-200 bg-blue-50 text-center'
            }, [
                createElement('div', {
                    key: 'purchasing-label',
                    className: 'text-sm font-medium text-blue-700 mb-1'
                }, t.purchasingPowerLoss),
                createElement('div', {
                    key: 'purchasing-value',
                    className: 'text-2xl font-bold text-blue-800'
                }, formatPercentage(
                    inflationAnalysis.purchasing_power[selectedScenario] ? 
                        inflationAnalysis.purchasing_power[selectedScenario].find(p => p.year === 20)?.erosionPercentage || 0 : 0
                ))
            ]),
            
            // Real Value at Retirement
            createElement('div', {
                key: 'real-value',
                className: 'p-4 rounded-lg border-2 border-green-200 bg-green-50 text-center'
            }, [
                createElement('div', {
                    key: 'real-label',
                    className: 'text-sm font-medium text-green-700 mb-1'
                }, `${t.realValue} (20 ${t.years})`),
                createElement('div', {
                    key: 'real-value-amount',
                    className: 'text-2xl font-bold text-green-800'
                }, formatCurrency(
                    inflationAnalysis.realValueAnalysis.projectedReal[selectedScenario] || 0
                ))
            ]),
            
            // Inflation Rate Used
            createElement('div', {
                key: 'inflation-rate-display',
                className: 'p-4 rounded-lg border-2 border-purple-200 bg-purple-50 text-center'
            }, [
                createElement('div', {
                    key: 'inflation-label',
                    className: 'text-sm font-medium text-purple-700 mb-1'
                }, `${t.inflationRate} (${t[selectedScenario]})`),
                createElement('div', {
                    key: 'inflation-value',
                    className: 'text-2xl font-bold text-purple-800'
                }, formatPercentage(
                    selectedScenario === 'optimistic' ? 2.0 :
                    selectedScenario === 'moderate' ? 2.5 :
                    selectedScenario === 'pessimistic' ? 3.2 : 2.1
                ))
            ])
        ]),
        
        // Main Visualization Area
        createElement('div', {
            key: 'visualization-area',
            className: 'bg-white rounded-xl p-6 border border-gray-200 shadow-sm'
        }, [
            viewMode === 'chart' ? 
                // Chart View
                createElement('div', {
                    key: 'chart-container',
                    className: 'relative'
                }, [
                    createElement('canvas', {
                        key: 'inflation-chart',
                        id: 'inflationChart',
                        width: '800',
                        height: '400',
                        style: { maxHeight: '400px' }
                    }),
                    // Chart will be rendered by Chart.js - placeholder for now
                    createElement('div', {
                        key: 'chart-placeholder',
                        className: 'absolute inset-0 flex items-center justify-center text-gray-500'
                    }, [
                        createElement('div', {
                            key: 'chart-placeholder-content',
                            className: 'text-center'
                        }, [
                            createElement('div', {
                                key: 'chart-icon',
                                className: 'text-4xl mb-2'
                            }, '📊'),
                            createElement('p', {
                                key: 'chart-text'
                            }, `${t.realVsNominal} ${t.viewChart} - ${t[selectedScenario]} ${t.inflationScenarios}`)
                        ])
                    ])
                ]) :
                
                // Table View
                createElement('div', {
                    key: 'table-container',
                    className: 'overflow-x-auto'
                }, [
                    createElement('table', {
                        key: 'inflation-table',
                        className: 'w-full table-auto'
                    }, [
                        createElement('thead', {
                            key: 'table-head',
                            className: 'bg-gray-50'
                        }, [
                            createElement('tr', {
                                key: 'table-header-row'
                            }, [
                                createElement('th', { key: 'year-header', className: 'px-4 py-3 text-left text-sm font-medium text-gray-900' }, t.years),
                                createElement('th', { key: 'nominal-header', className: 'px-4 py-3 text-right text-sm font-medium text-gray-900' }, t.nominalValue),
                                createElement('th', { key: 'real-header', className: 'px-4 py-3 text-right text-sm font-medium text-gray-900' }, t.realValue),
                                createElement('th', { key: 'erosion-header', className: 'px-4 py-3 text-right text-sm font-medium text-gray-900' }, `${t.erosion} ${t.percentage}`)
                            ])
                        ]),
                        createElement('tbody', {
                            key: 'table-body',
                            className: 'bg-white divide-y divide-gray-200'
                        }, 
                            inflationAnalysis.purchasing_power[selectedScenario] ?
                                inflationAnalysis.purchasing_power[selectedScenario].filter((_, index) => index % 5 === 0).map((dataPoint, index) => 
                                    createElement('tr', {
                                        key: `table-row-${index}`,
                                        className: index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                    }, [
                                        createElement('td', { 
                                            key: `year-${index}`, 
                                            className: 'px-4 py-3 text-sm text-gray-900' 
                                        }, dataPoint.year),
                                        createElement('td', { 
                                            key: `nominal-${index}`, 
                                            className: 'px-4 py-3 text-sm text-gray-900 text-right' 
                                        }, formatCurrency(dataPoint.equivalentNominal)),
                                        createElement('td', { 
                                            key: `real-${index}`, 
                                            className: 'px-4 py-3 text-sm text-gray-900 text-right font-medium' 
                                        }, formatCurrency(dataPoint.realValue)),
                                        createElement('td', { 
                                            key: `erosion-${index}`, 
                                            className: `px-4 py-3 text-sm text-right font-medium ${
                                                dataPoint.erosionPercentage > 30 ? 'text-red-600' : 
                                                dataPoint.erosionPercentage > 15 ? 'text-yellow-600' : 'text-green-600'
                                            }`
                                        }, formatPercentage(dataPoint.erosionPercentage))
                                    ])
                                ) : []
                        )
                    ])
                ])
        ]),
        
        // Recommendations
        inflationAnalysis.recommendations?.length > 0 && createElement('div', {
            key: 'inflation-recommendations',
            className: 'bg-yellow-50 rounded-xl p-6 border border-yellow-200'
        }, [
            createElement('h4', {
                key: 'recommendations-title',
                className: 'text-xl font-semibold text-yellow-800 mb-4 flex items-center'
            }, [
                createElement('span', { key: 'recommendations-icon', className: 'mr-3' }, '💡'),
                t.recommendations
            ]),
            createElement('div', {
                key: 'recommendations-list',
                className: 'space-y-4'
            }, inflationAnalysis.recommendations.slice(0, 3).map((rec, index) => 
                createElement('div', {
                    key: `inflation-rec-${index}`,
                    className: 'bg-white rounded-lg p-4 border border-yellow-200'
                }, [
                    createElement('h5', {
                        key: `rec-title-${index}`,
                        className: 'font-semibold text-yellow-800 mb-2'
                    }, rec.title),
                    createElement('p', {
                        key: `rec-desc-${index}`,
                        className: 'text-sm text-yellow-700 mb-3'
                    }, rec.description),
                    rec.actions && createElement('div', {
                        key: `rec-actions-${index}`,
                        className: 'space-y-1'
                    }, rec.actions.map((action, actionIndex) => 
                        createElement('div', {
                            key: `action-${index}-${actionIndex}`,
                            className: 'text-xs text-yellow-600 flex items-center'
                        }, [
                            createElement('span', {
                                key: `action-bullet-${index}-${actionIndex}`,
                                className: 'mr-2'
                            }, '•'),
                            action
                        ])
                    ))
                ])
            ))
        ])
    ]);
};

// Export to window for global access
window.InflationVisualizationPanel = InflationVisualizationPanel;