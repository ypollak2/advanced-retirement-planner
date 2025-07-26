// Monte Carlo Results Dashboard - UX for probabilistic retirement projections
// Shows probability distributions, success rates, and risk analysis with interactive visualizations

const MonteCarloResultsDashboard = ({ inputs, results, language = 'en' }) => {
    const createElement = React.createElement;
    
    // Multi-language content
    const content = {
        he: {
            title: 'לוח בקרה תוצאות מונטה קארלו',
            subtitle: 'ניתוח הסתברותי של תוצאות פרישה עם הדמיות אינטראקטיביות',
            noData: 'אין נתונים זמינים לסימולציית מונטה קארלו',
            runSimulation: 'הרץ סימולציה',
            runningSimulation: 'מריץ סימולציה...',
            successProbability: 'הסתברות הצלחה',
            shortfallRisk: 'סיכון מחסור',
            portfolioDistribution: 'התפלגות תיק',
            incomeDistribution: 'התפלגות הכנסה',
            riskMetrics: 'מדדי סיכון',
            simulations: 'סימולציות',
            projectionYears: 'שנות חיזוי',
            meanValue: 'ערך ממוצע',
            medianValue: 'חציון',
            percentile: 'אחוזון',
            standardDeviation: 'סטיית תקן',
            worstCase: 'מקרה גרוע ביותר',
            bestCase: 'מקרה טוב ביותר',
            maxDrawdown: 'ירידה מקסימלית',
            valueAtRisk: 'ערך בסיכון',
            expectedShortfall: 'מחסור צפוי',
            confidenceInterval: 'רווח ביטחון',
            probability: 'הסתברות',
            finalPortfolioValue: 'ערך תיק סופי',
            monthlyIncome: 'הכנסה חודשית',
            inflationAdjusted: 'מותאם אינפלציה',
            years: 'שנים',
            currency: '₪',
            percentage: '%',
            statistics: 'סטטיסטיקות',
            recommendations: 'המלצות',
            scenarioAnalysis: 'ניתוח תרחישים',
            economicScenarios: 'תרחישים כלכליים',
            recession: 'מיתון',
            expansion: 'צמיחה',
            boom: 'פריחה',
            stagflation: 'סטגפלציה',
            distributionChart: 'גרף התפלגות',
            histogramView: 'תצוגת היסטוגרמה',
            timeSeriesView: 'תצוגת סדרות זמן',
            riskAnalysis: 'ניתוח סיכונים',
            settings: 'הגדרות',
            exportResults: 'יצא תוצאות',
            runNewSimulation: 'הרץ סימולציה חדשה'
        },
        en: {
            title: 'Monte Carlo Results Dashboard',
            subtitle: 'Probabilistic analysis of retirement outcomes with interactive visualizations',
            noData: 'No data available for Monte Carlo simulation',
            runSimulation: 'Run Simulation',
            runningSimulation: 'Running Simulation...',
            successProbability: 'Success Probability',
            shortfallRisk: 'Shortfall Risk',
            portfolioDistribution: 'Portfolio Distribution',
            incomeDistribution: 'Income Distribution',
            riskMetrics: 'Risk Metrics',
            simulations: 'Simulations',
            projectionYears: 'Projection Years',
            meanValue: 'Mean Value',
            medianValue: 'Median Value',
            percentile: 'Percentile',
            standardDeviation: 'Standard Deviation',
            worstCase: 'Worst Case',
            bestCase: 'Best Case',
            maxDrawdown: 'Max Drawdown',
            valueAtRisk: 'Value at Risk',
            expectedShortfall: 'Expected Shortfall',
            confidenceInterval: 'Confidence Interval',
            probability: 'Probability',
            finalPortfolioValue: 'Final Portfolio Value',
            monthlyIncome: 'Monthly Income',
            inflationAdjusted: 'Inflation Adjusted',
            years: 'Years',
            currency: '₪',
            percentage: '%',
            statistics: 'Statistics',
            recommendations: 'Recommendations',
            scenarioAnalysis: 'Scenario Analysis',
            economicScenarios: 'Economic Scenarios',
            recession: 'Recession',
            expansion: 'Expansion',
            boom: 'Boom',
            stagflation: 'Stagflation',
            distributionChart: 'Distribution Chart',
            histogramView: 'Histogram View',
            timeSeriesView: 'Time Series View',
            riskAnalysis: 'Risk Analysis',
            settings: 'Settings',
            exportResults: 'Export Results',
            runNewSimulation: 'Run New Simulation'
        }
    };
    
    const t = content[language];
    
    // State for UI and simulation
    const [simulationResults, setSimulationResults] = React.useState(null);
    const [isRunning, setIsRunning] = React.useState(false);
    const [viewMode, setViewMode] = React.useState('histogram'); // 'histogram', 'timeSeries', 'risk'
    const [simulationParams, setSimulationParams] = React.useState({
        simulations: 10000,
        projectionYears: 30
    });
    const [showSettings, setShowSettings] = React.useState(false);
    
    // Ref for timeout cleanup
    const simulationTimeoutRef = React.useRef(null);
    
    // Cleanup timeout on unmount
    React.useEffect(() => {
        return () => {
            if (simulationTimeoutRef.current) {
                clearTimeout(simulationTimeoutRef.current);
            }
        };
    }, []);
    
    // Auto-run simulation when component mounts or inputs change significantly
    React.useEffect(() => {
        if (results && window.monteCarloSimulation && !simulationResults) {
            runMonteCarloSimulation();
        }
    }, [inputs, results]);
    
    // Run Monte Carlo simulation
    const runMonteCarloSimulation = async () => {
        if (!window.runMonteCarloSimulation) {
            console.error('Monte Carlo simulation not available');
            return;
        }
        
        setIsRunning(true);
        
        try {
            // Run simulation asynchronously to avoid blocking UI
            if (simulationTimeoutRef.current) {
                clearTimeout(simulationTimeoutRef.current);
            }
            simulationTimeoutRef.current = setTimeout(() => {
                const results = window.runMonteCarloSimulation(
                    inputs,
                    simulationParams.projectionYears,
                    simulationParams.simulations,
                    language
                );
                setSimulationResults(results);
                setIsRunning(false);
                simulationTimeoutRef.current = null;
            }, 100);
            
        } catch (error) {
            console.error('Monte Carlo simulation failed:', error);
            setIsRunning(false);
        }
    };
    
    if (!results) {
        return createElement('div', {
            key: 'no-montecarlo-data',
            className: "bg-gray-50 rounded-xl p-6 border border-gray-200"
        }, [
            createElement('div', {
                key: 'no-data-icon',
                className: "text-center text-gray-400 text-4xl mb-4"
            }, '🎲'),
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
        return `${(value * 100 || 0).toFixed(1)}${t.percentage}`;
    };
    
    const getSuccessColor = (probability) => {
        if (probability >= 0.8) return 'text-green-600 bg-green-50 border-green-200';
        if (probability >= 0.6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };
    
    const getRiskColor = (risk) => {
        if (risk <= 0.2) return 'text-green-600 bg-green-50 border-green-200';
        if (risk <= 0.4) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };
    
    return createElement('div', {
        key: 'montecarlo-dashboard',
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
            }, '🎲'),
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
            key: 'control-panel',
            className: 'bg-white rounded-xl p-4 border border-gray-200 shadow-sm'
        }, [
            createElement('div', {
                key: 'controls',
                className: 'flex flex-wrap justify-between items-center gap-4'
            }, [
                // Simulation Controls
                createElement('div', {
                    key: 'simulation-controls',
                    className: 'flex items-center gap-3'
                }, [
                    createElement('button', {
                        key: 'run-simulation-btn',
                        onClick: runMonteCarloSimulation,
                        disabled: isRunning,
                        className: `px-4 py-2 rounded-lg font-semibold transition-colors ${
                            isRunning 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`
                    }, isRunning ? t.runningSimulation : (simulationResults ? t.runNewSimulation : t.runSimulation)),
                    
                    simulationResults && createElement('span', {
                        key: 'simulation-info',
                        className: 'text-sm text-gray-600'
                    }, `${simulationResults.simulations.toLocaleString()} ${t.simulations}`)
                ]),
                
                // View Mode Toggle
                simulationResults && createElement('div', {
                    key: 'view-toggle',
                    className: 'flex bg-gray-100 rounded-lg p-1'
                }, [
                    createElement('button', {
                        key: 'histogram-btn',
                        onClick: () => setViewMode('histogram'),
                        className: `px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                            viewMode === 'histogram' 
                                ? 'bg-white text-blue-600 shadow' 
                                : 'text-gray-600 hover:text-gray-800'
                        }`
                    }, t.histogramView),
                    createElement('button', {
                        key: 'timeseries-btn',
                        onClick: () => setViewMode('timeSeries'),
                        className: `px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                            viewMode === 'timeSeries' 
                                ? 'bg-white text-blue-600 shadow' 
                                : 'text-gray-600 hover:text-gray-800'
                        }`
                    }, t.timeSeriesView),
                    createElement('button', {
                        key: 'risk-btn',
                        onClick: () => setViewMode('risk'),
                        className: `px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                            viewMode === 'risk' 
                                ? 'bg-white text-blue-600 shadow' 
                                : 'text-gray-600 hover:text-gray-800'
                        }`
                    }, t.riskAnalysis)
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
                    simulationResults && createElement('button', {
                        key: 'export-btn',
                        className: 'px-3 py-1 text-sm text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50'
                    }, t.exportResults)
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
                // Number of Simulations
                createElement('div', {
                    key: 'simulations-setting'
                }, [
                    createElement('label', {
                        key: 'simulations-label',
                        className: 'block text-sm font-medium text-gray-700 mb-2'
                    }, `${t.simulations}: ${simulationParams.simulations.toLocaleString()}`),
                    createElement('select', {
                        key: 'simulations-select',
                        value: simulationParams.simulations,
                        onChange: (e) => setSimulationParams({
                            ...simulationParams,
                            simulations: parseInt(e.target.value)
                        }),
                        className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    }, [
                        createElement('option', { key: '1000', value: 1000 }, '1,000'),
                        createElement('option', { key: '5000', value: 5000 }, '5,000'),
                        createElement('option', { key: '10000', value: 10000 }, '10,000'),
                        createElement('option', { key: '25000', value: 25000 }, '25,000')
                    ])
                ]),
                
                // Projection Years
                createElement('div', {
                    key: 'projection-setting'
                }, [
                    createElement('label', {
                        key: 'projection-label',
                        className: 'block text-sm font-medium text-gray-700 mb-2'
                    }, `${t.projectionYears}: ${simulationParams.projectionYears}`),
                    createElement('input', {
                        key: 'projection-input',
                        type: 'range',
                        min: '10',
                        max: '50',
                        step: '5',
                        value: simulationParams.projectionYears,
                        onChange: (e) => setSimulationParams({
                            ...simulationParams,
                            projectionYears: parseInt(e.target.value)
                        }),
                        className: 'w-full'
                    })
                ])
            ])
        ]),
        
        // Results Summary (if simulation completed)
        simulationResults && createElement('div', {
            key: 'results-summary',
            className: 'grid grid-cols-1 md:grid-cols-4 gap-4'
        }, [
            // Success Probability
            createElement('div', {
                key: 'success-probability',
                className: `p-4 rounded-lg border-2 text-center ${getSuccessColor(simulationResults.riskMetrics.successProbability)}`
            }, [
                createElement('div', {
                    key: 'success-label',
                    className: 'text-sm font-medium mb-1'
                }, t.successProbability),
                createElement('div', {
                    key: 'success-value',
                    className: 'text-2xl font-bold'
                }, formatPercentage(simulationResults.riskMetrics.successProbability))
            ]),
            
            // Shortfall Risk
            createElement('div', {
                key: 'shortfall-risk',
                className: `p-4 rounded-lg border-2 text-center ${getRiskColor(simulationResults.riskMetrics.shortfallProbability)}`
            }, [
                createElement('div', {
                    key: 'shortfall-label',
                    className: 'text-sm font-medium mb-1'
                }, t.shortfallRisk),
                createElement('div', {
                    key: 'shortfall-value',
                    className: 'text-2xl font-bold'
                }, formatPercentage(simulationResults.riskMetrics.shortfallProbability))
            ]),
            
            // Median Portfolio Value
            createElement('div', {
                key: 'median-portfolio',
                className: 'p-4 rounded-lg border-2 border-blue-200 bg-blue-50 text-center'
            }, [
                createElement('div', {
                    key: 'median-label',
                    className: 'text-sm font-medium text-blue-700 mb-1'
                }, `${t.medianValue} ${t.finalPortfolioValue}`),
                createElement('div', {
                    key: 'median-value',
                    className: 'text-2xl font-bold text-blue-800'
                }, formatCurrency(simulationResults.statistics.portfolio.median))
            ]),
            
            // Median Monthly Income
            createElement('div', {
                key: 'median-income',
                className: 'p-4 rounded-lg border-2 border-green-200 bg-green-50 text-center'
            }, [
                createElement('div', {
                    key: 'income-label',
                    className: 'text-sm font-medium text-green-700 mb-1'
                }, `${t.medianValue} ${t.monthlyIncome}`),
                createElement('div', {
                    key: 'income-value',
                    className: 'text-2xl font-bold text-green-800'
                }, formatCurrency(simulationResults.statistics.income.median))
            ])
        ]),
        
        // Main Visualization Area
        simulationResults && createElement('div', {
            key: 'visualization-area',
            className: 'bg-white rounded-xl p-6 border border-gray-200 shadow-sm'
        }, [
            // View Mode Specific Content
            viewMode === 'histogram' ? 
                // Histogram View
                createElement('div', {
                    key: 'histogram-container'
                }, [
                    createElement('h4', {
                        key: 'histogram-title',
                        className: 'text-lg font-semibold text-gray-800 mb-4'
                    }, t.portfolioDistribution),
                    createElement('div', {
                        key: 'histogram-placeholder',
                        className: 'h-96 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300'
                    }, [
                        createElement('div', {
                            key: 'histogram-placeholder-content',
                            className: 'text-center'
                        }, [
                            createElement('div', {
                                key: 'histogram-icon',
                                className: 'text-4xl mb-2'
                            }, '📊'),
                            createElement('p', {
                                key: 'histogram-text'
                            }, `${t.distributionChart} - ${simulationResults.simulations.toLocaleString()} ${t.simulations}`)
                        ])
                    ])
                ]) :
            
            viewMode === 'timeSeries' ?
                // Time Series View
                createElement('div', {
                    key: 'timeseries-container'
                }, [
                    createElement('h4', {
                        key: 'timeseries-title',
                        className: 'text-lg font-semibold text-gray-800 mb-4'
                    }, `${t.finalPortfolioValue} - ${t.timeSeriesView}`),
                    createElement('div', {
                        key: 'timeseries-placeholder',
                        className: 'h-96 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300'
                    }, [
                        createElement('div', {
                            key: 'timeseries-placeholder-content',
                            className: 'text-center'
                        }, [
                            createElement('div', {
                                key: 'timeseries-icon',
                                className: 'text-4xl mb-2'
                            }, '📈'),
                            createElement('p', {
                                key: 'timeseries-text'
                            }, `${simulationResults.projectionYears} ${t.years} ${t.projectionYears}`)
                        ])
                    ])
                ]) :
                
                // Risk Analysis View
                createElement('div', {
                    key: 'risk-container'
                }, [
                    createElement('h4', {
                        key: 'risk-title',
                        className: 'text-lg font-semibold text-gray-800 mb-4'
                    }, t.riskAnalysis),
                    createElement('div', {
                        key: 'risk-metrics-grid',
                        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    }, [
                        // Value at Risk
                        createElement('div', {
                            key: 'var-metric',
                            className: 'bg-red-50 rounded-lg p-4 border border-red-200'
                        }, [
                            createElement('h5', {
                                key: 'var-title',
                                className: 'text-sm font-medium text-red-700 mb-2'
                            }, `${t.valueAtRisk} (95%)`),
                            createElement('div', {
                                key: 'var-value',
                                className: 'text-xl font-bold text-red-800'
                            }, formatCurrency(simulationResults.riskMetrics.valueAtRisk.var95))
                        ]),
                        
                        // Max Drawdown
                        createElement('div', {
                            key: 'drawdown-metric',
                            className: 'bg-yellow-50 rounded-lg p-4 border border-yellow-200'
                        }, [
                            createElement('h5', {
                                key: 'drawdown-title',
                                className: 'text-sm font-medium text-yellow-700 mb-2'
                            }, `${t.maxDrawdown} (90th ${t.percentile})`),
                            createElement('div', {
                                key: 'drawdown-value',
                                className: 'text-xl font-bold text-yellow-800'
                            }, formatPercentage(simulationResults.statistics.drawdown.percentiles.p90))
                        ]),
                        
                        // Expected Shortfall
                        createElement('div', {
                            key: 'shortfall-metric',
                            className: 'bg-orange-50 rounded-lg p-4 border border-orange-200'
                        }, [
                            createElement('h5', {
                                key: 'shortfall-title',
                                className: 'text-sm font-medium text-orange-700 mb-2'
                            }, t.expectedShortfall),
                            createElement('div', {
                                key: 'shortfall-value',
                                className: 'text-xl font-bold text-orange-800'
                            }, formatCurrency(simulationResults.riskMetrics.expectedShortfall))
                        ])
                    ])
                ])
        ]),
        
        // Statistical Summary Table
        simulationResults && createElement('div', {
            key: 'statistics-table',
            className: 'bg-white rounded-xl p-6 border border-gray-200 shadow-sm'
        }, [
            createElement('h4', {
                key: 'stats-title',
                className: 'text-lg font-semibold text-gray-800 mb-4'
            }, t.statistics),
            createElement('div', {
                key: 'stats-tables',
                className: 'grid grid-cols-1 lg:grid-cols-2 gap-6'
            }, [
                // Portfolio Statistics
                createElement('div', {
                    key: 'portfolio-stats'
                }, [
                    createElement('h5', {
                        key: 'portfolio-stats-title',
                        className: 'text-md font-medium text-gray-700 mb-3'
                    }, t.finalPortfolioValue),
                    createElement('div', {
                        key: 'portfolio-stats-grid',
                        className: 'space-y-2 text-sm'
                    }, [
                        createElement('div', {
                            key: 'portfolio-mean',
                            className: 'flex justify-between'
                        }, [
                            createElement('span', { key: 'portfolio-mean-label' }, `${t.meanValue}:`),
                            createElement('span', { key: 'portfolio-mean-value', className: 'font-medium' }, 
                                formatCurrency(simulationResults.statistics.portfolio.mean))
                        ]),
                        createElement('div', {
                            key: 'portfolio-median',
                            className: 'flex justify-between'
                        }, [
                            createElement('span', { key: 'portfolio-median-label' }, `${t.medianValue}:`),
                            createElement('span', { key: 'portfolio-median-value', className: 'font-medium' }, 
                                formatCurrency(simulationResults.statistics.portfolio.median))
                        ]),
                        createElement('div', {
                            key: 'portfolio-std',
                            className: 'flex justify-between'
                        }, [
                            createElement('span', { key: 'portfolio-std-label' }, `${t.standardDeviation}:`),
                            createElement('span', { key: 'portfolio-std-value', className: 'font-medium' }, 
                                formatCurrency(simulationResults.statistics.portfolio.std))
                        ]),
                        createElement('div', {
                            key: 'portfolio-p10',
                            className: 'flex justify-between'
                        }, [
                            createElement('span', { key: 'portfolio-p10-label' }, `10th ${t.percentile}:`),
                            createElement('span', { key: 'portfolio-p10-value', className: 'font-medium text-red-600' }, 
                                formatCurrency(simulationResults.statistics.portfolio.percentiles.p10))
                        ]),
                        createElement('div', {
                            key: 'portfolio-p90',
                            className: 'flex justify-between'
                        }, [
                            createElement('span', { key: 'portfolio-p90-label' }, `90th ${t.percentile}:`),
                            createElement('span', { key: 'portfolio-p90-value', className: 'font-medium text-green-600' }, 
                                formatCurrency(simulationResults.statistics.portfolio.percentiles.p90))
                        ])
                    ])
                ]),
                
                // Income Statistics
                createElement('div', {
                    key: 'income-stats'
                }, [
                    createElement('h5', {
                        key: 'income-stats-title',
                        className: 'text-md font-medium text-gray-700 mb-3'
                    }, `${t.monthlyIncome} (${t.inflationAdjusted})`),
                    createElement('div', {
                        key: 'income-stats-grid',
                        className: 'space-y-2 text-sm'
                    }, [
                        createElement('div', {
                            key: 'income-mean',
                            className: 'flex justify-between'
                        }, [
                            createElement('span', { key: 'income-mean-label' }, `${t.meanValue}:`),
                            createElement('span', { key: 'income-mean-value', className: 'font-medium' }, 
                                formatCurrency(simulationResults.statistics.income.mean))
                        ]),
                        createElement('div', {
                            key: 'income-median',
                            className: 'flex justify-between'
                        }, [
                            createElement('span', { key: 'income-median-label' }, `${t.medianValue}:`),
                            createElement('span', { key: 'income-median-value', className: 'font-medium' }, 
                                formatCurrency(simulationResults.statistics.income.median))
                        ]),
                        createElement('div', {
                            key: 'income-std',
                            className: 'flex justify-between'
                        }, [
                            createElement('span', { key: 'income-std-label' }, `${t.standardDeviation}:`),
                            createElement('span', { key: 'income-std-value', className: 'font-medium' }, 
                                formatCurrency(simulationResults.statistics.income.std))
                        ]),
                        createElement('div', {
                            key: 'income-p10',
                            className: 'flex justify-between'
                        }, [
                            createElement('span', { key: 'income-p10-label' }, `10th ${t.percentile}:`),
                            createElement('span', { key: 'income-p10-value', className: 'font-medium text-red-600' }, 
                                formatCurrency(simulationResults.statistics.income.percentiles.p10))
                        ]),
                        createElement('div', {
                            key: 'income-p90',
                            className: 'flex justify-between'
                        }, [
                            createElement('span', { key: 'income-p90-label' }, `90th ${t.percentile}:`),
                            createElement('span', { key: 'income-p90-value', className: 'font-medium text-green-600' }, 
                                formatCurrency(simulationResults.statistics.income.percentiles.p90))
                        ])
                    ])
                ])
            ])
        ]),
        
        // Recommendations
        simulationResults?.recommendations?.length > 0 && createElement('div', {
            key: 'montecarlo-recommendations',
            className: 'bg-blue-50 rounded-xl p-6 border border-blue-200'
        }, [
            createElement('h4', {
                key: 'recommendations-title',
                className: 'text-xl font-semibold text-blue-800 mb-4 flex items-center'
            }, [
                createElement('span', { key: 'recommendations-icon', className: 'mr-3' }, '🎯'),
                t.recommendations
            ]),
            createElement('div', {
                key: 'recommendations-list',
                className: 'space-y-4'
            }, simulationResults.recommendations.map((rec, index) => 
                createElement('div', {
                    key: `montecarlo-rec-${index}`,
                    className: 'bg-white rounded-lg p-4 border border-blue-200'
                }, [
                    createElement('div', {
                        key: `rec-header-${index}`,
                        className: 'flex justify-between items-start mb-2'
                    }, [
                        createElement('h5', {
                            key: `rec-title-${index}`,
                            className: 'font-semibold text-blue-800'
                        }, rec.title),
                        createElement('span', {
                            key: `rec-priority-${index}`,
                            className: `text-xs px-2 py-1 rounded-full ${
                                rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                                rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                            }`
                        }, rec.priority)
                    ]),
                    createElement('p', {
                        key: `rec-description-${index}`,
                        className: 'text-sm text-blue-700 mb-3'
                    }, rec.description),
                    rec.actions && createElement('div', {
                        key: `rec-actions-${index}`,
                        className: 'space-y-1'
                    }, rec.actions.map((action, actionIndex) => 
                        createElement('div', {
                            key: `action-${index}-${actionIndex}`,
                            className: 'text-xs text-blue-600 flex items-center'
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
window.MonteCarloResultsDashboard = MonteCarloResultsDashboard;