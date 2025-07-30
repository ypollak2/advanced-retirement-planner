// Withdrawal Strategy Comparison Interface - UX for comparing systematic withdrawal methods
// Provides strategy comparison, scenario analysis, and tax optimization visualization

const WithdrawalStrategyInterface = ({ inputs, results, language = 'en' }) => {
    const createElement = React.createElement;
    
    // Multi-language content
    const content = {
        he: {
            title: 'השוואת אסטרטגיות משיכה',
            subtitle: 'השוואה וניתוח של שיטות משיכה שיטתיות לפרישה',
            noData: 'אין נתונים זמינים להשוואת אסטרטגיות משיכה',
            strategies: 'אסטרטגיות',
            selectedStrategy: 'אסטרטגיה נבחרת',
            compareStrategies: 'השווה אסטרטגיות',
            results: 'תוצאות',
            projections: 'תחזיות',
            taxAnalysis: 'ניתוח מס',
            recommendations: 'המלצות',
            runAnalysis: 'הרץ ניתוח',
            runningAnalysis: 'מריץ ניתוח...',
            fixedDollar: 'סכום קבוע בש״ח',
            fixedPercentage: 'אחוז קבוע (4%)',
            totalReturn: 'תשואה כוללת',
            bucketStrategy: 'אסטרטגיית דליים',
            dynamicWithdrawal: 'משיכה דינמית',
            floorCeiling: 'רצפה ותקרה',
            averageIncome: 'הכנסה ממוצעת',
            totalWithdrawn: 'סך נמשך',
            finalValue: 'ערך סופי',
            taxPaid: 'מס ששולם',
            depletionRisk: 'סיכון תמיכת תיק',
            incomeVolatility: 'תנודתיות הכנסה',
            taxEfficiency: 'יעילות מס',
            suitability: 'התאמה',
            pros: 'יתרונות',
            cons: 'חסרונות',
            years: 'שנים',
            currency: '₪',
            percentage: '%',
            monthly: 'חודשי',
            annually: 'שנתי',
            never: 'לעולם לא',
            high: 'גבוה',
            medium: 'בינוני',
            low: 'נמוך',
            excellent: 'מעולה',
            good: 'טוב',
            fair: 'בינוני',
            poor: 'גרוע',
            conservative: 'שמרני',
            moderate: 'מתון',
            aggressive: 'אגרסיבי',
            settings: 'הגדרות',
            export: 'יצא נתונים',
            viewDetails: 'הצג פרטים',
            hideDetails: 'הסתר פרטים',
            comparison: 'השוואה',
            scenarioAnalysis: 'ניתוח תרחישים',
            strategyDetails: 'פרטי אסטרטגיה',
            taxOptimization: 'אופטימיזציית מס',
            riskMetrics: 'מדדי סיכון',
            timeHorizon: 'אופק זמן',
            withdrawalRate: 'שיעור משיכה',
            targetIncome: 'הכנסת יעד',
            minimumIncome: 'הכנסה מינימלית',
            maximumIncome: 'הכנסה מקסימלית'
        },
        en: {
            title: 'Withdrawal Strategy Comparison',
            subtitle: 'Compare and analyze systematic withdrawal methods for retirement',
            noData: 'No data available for withdrawal strategy comparison',
            strategies: 'Strategies',
            selectedStrategy: 'Selected Strategy',
            compareStrategies: 'Compare Strategies',
            results: 'Results',
            projections: 'Projections',
            taxAnalysis: 'Tax Analysis',
            recommendations: 'Recommendations',
            runAnalysis: 'Run Analysis',
            runningAnalysis: 'Running Analysis...',
            fixedDollar: 'Fixed Dollar Amount',
            fixedPercentage: 'Fixed Percentage (4%)',
            totalReturn: 'Total Return Strategy',
            bucketStrategy: 'Bucket Strategy',
            dynamicWithdrawal: 'Dynamic Withdrawal',
            floorCeiling: 'Floor and Ceiling',
            averageIncome: 'Average Income',
            totalWithdrawn: 'Total Withdrawn',
            finalValue: 'Final Value',
            taxPaid: 'Tax Paid',
            depletionRisk: 'Depletion Risk',
            incomeVolatility: 'Income Volatility',
            taxEfficiency: 'Tax Efficiency',
            suitability: 'Suitability',
            pros: 'Pros',
            cons: 'Cons',
            years: 'Years',
            currency: '₪',
            percentage: '%',
            monthly: 'Monthly',
            annually: 'Annually',
            never: 'Never',
            high: 'High',
            medium: 'Medium',
            low: 'Low',
            excellent: 'Excellent',
            good: 'Good',
            fair: 'Fair',
            poor: 'Poor',
            conservative: 'Conservative',
            moderate: 'Moderate',
            aggressive: 'Aggressive',
            settings: 'Settings',
            export: 'Export Data',
            viewDetails: 'View Details',
            hideDetails: 'Hide Details',
            comparison: 'Comparison',
            scenarioAnalysis: 'Scenario Analysis',
            strategyDetails: 'Strategy Details',
            taxOptimization: 'Tax Optimization',
            riskMetrics: 'Risk Metrics',
            timeHorizon: 'Time Horizon',
            withdrawalRate: 'Withdrawal Rate',
            targetIncome: 'Target Income',
            minimumIncome: 'Minimum Income',
            maximumIncome: 'Maximum Income'
        }
    };
    
    const t = content[language];
    
    // State for UI
    const [selectedStrategy, setSelectedStrategy] = React.useState('fixedPercentage');
    const [comparisonStrategies, setComparisonStrategies] = React.useState(['fixedPercentage', 'dynamicWithdrawal']);
    const [strategyResults, setStrategyResults] = React.useState({});
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const [viewMode, setViewMode] = React.useState('comparison'); // 'comparison', 'details', 'scenarios'
    const [showSettings, setShowSettings] = React.useState(false);
    const [projectionYears, setProjectionYears] = React.useState(30);
    
    // Strategy configuration
    const [strategyParams, setStrategyParams] = React.useState({
        withdrawalRate: 4.0,
        targetIncome: parseFloat(inputs.targetMonthlyIncome || 10000) * 12,
        minimumIncome: 8000 * 12,
        maximumIncome: 15000 * 12
    });
    
    // Available strategies with metadata
    const availableStrategies = React.useMemo(() => {
        if (!window.withdrawalStrategies) return {};
        return window.getWithdrawalStrategies ? window.getWithdrawalStrategies() : window.withdrawalStrategies.strategies;
    }, []);
    
    // Run withdrawal strategy analysis
    const runWithdrawalAnalysis = async (strategies = comparisonStrategies) => {
        if (!window.calculateWithdrawalStrategy) {
            console.error('Withdrawal strategies not available');
            return;
        }
        
        setIsAnalyzing(true);
        const results = {};
        
        try {
            for (const strategy of strategies) {
                // Add small delay to avoid blocking UI
                await new Promise(resolve => setTimeout(resolve, 50));
                
                const result = window.calculateWithdrawalStrategy(
                    { ...inputs, ...strategyParams },
                    strategy,
                    projectionYears,
                    language
                );
                results[strategy] = result;
            }
            
            setStrategyResults(results);
        } catch (error) {
            console.error('Withdrawal analysis failed:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };
    
    // Auto-run analysis when component mounts
    React.useEffect(() => {
        if (results && Object.keys(availableStrategies).length > 0) {
            runWithdrawalAnalysis([selectedStrategy]);
        }
    }, [inputs, results, selectedStrategy, projectionYears]);
    
    if (!results) {
        return createElement('div', {
            key: 'no-withdrawal-data',
            className: "bg-gray-50 rounded-xl p-6 border border-gray-200"
        }, [
            createElement('div', {
                key: 'no-data-icon',
                className: "text-center text-gray-400 text-4xl mb-4"
            }, '💰'),
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
    
    const getStrategyName = (strategy) => {
        return t[strategy] || strategy;
    };
    
    const getRiskColor = (level) => {
        const colors = {
            low: 'text-green-600 bg-green-50 border-green-200',
            medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
            high: 'text-red-600 bg-red-50 border-red-200'
        };
        return colors[level] || colors.medium;
    };
    
    const getEfficiencyColor = (level) => {
        const colors = {
            excellent: 'text-green-600 bg-green-50',
            good: 'text-blue-600 bg-blue-50',
            fair: 'text-yellow-600 bg-yellow-50',
            poor: 'text-red-600 bg-red-50'
        };
        return colors[level] || colors.fair;
    };
    
    return createElement('div', {
        key: 'withdrawal-strategy-interface',
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
            }, '💰'),
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
                // Strategy Selector
                createElement('div', {
                    key: 'strategy-selector',
                    className: 'flex items-center gap-3'
                }, [
                    createElement('label', {
                        key: 'strategy-label',
                        className: 'text-sm font-medium text-gray-700'
                    }, `${t.selectedStrategy}:`),
                    createElement('select', {
                        key: 'strategy-select',
                        value: selectedStrategy,
                        onChange: (e) => setSelectedStrategy(e.target.value),
                        className: 'px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    }, Object.keys(availableStrategies).map(strategy => 
                        createElement('option', {
                            key: strategy,
                            value: strategy
                        }, getStrategyName(strategy))
                    ))
                ]),
                
                // View Mode Toggle
                createElement('div', {
                    key: 'view-toggle',
                    className: 'flex bg-gray-100 rounded-lg p-1'
                }, [
                    createElement('button', {
                        key: 'comparison-btn',
                        onClick: () => setViewMode('comparison'),
                        className: `px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                            viewMode === 'comparison' 
                                ? 'bg-white text-blue-600 shadow' 
                                : 'text-gray-600 hover:text-gray-800'
                        }`
                    }, t.comparison),
                    createElement('button', {
                        key: 'details-btn',
                        onClick: () => setViewMode('details'),
                        className: `px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                            viewMode === 'details' 
                                ? 'bg-white text-blue-600 shadow' 
                                : 'text-gray-600 hover:text-gray-800'
                        }`
                    }, t.strategyDetails),
                    createElement('button', {
                        key: 'scenarios-btn',
                        onClick: () => setViewMode('scenarios'),
                        className: `px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                            viewMode === 'scenarios' 
                                ? 'bg-white text-blue-600 shadow' 
                                : 'text-gray-600 hover:text-gray-800'
                        }`
                    }, t.scenarioAnalysis)
                ]),
                
                // Action Buttons
                createElement('div', {
                    key: 'action-buttons',
                    className: 'flex gap-2'
                }, [
                    createElement('button', {
                        key: 'compare-btn',
                        onClick: () => runWithdrawalAnalysis(['fixedPercentage', 'dynamicWithdrawal', 'bucketStrategy']),
                        disabled: isAnalyzing,
                        className: `px-4 py-2 rounded-lg font-medium transition-colors ${
                            isAnalyzing 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`
                    }, isAnalyzing ? t.runningAnalysis : t.compareStrategies),
                    createElement('button', {
                        key: 'settings-btn',
                        onClick: () => setShowSettings(!showSettings),
                        className: 'px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50'
                    }, t.settings)
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
                className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'
            }, [
                // Withdrawal Rate
                createElement('div', {
                    key: 'withdrawal-rate-setting'
                }, [
                    createElement('label', {
                        key: 'withdrawal-rate-label',
                        className: 'block text-sm font-medium text-gray-700 mb-2'
                    }, `${t.withdrawalRate}: ${strategyParams.withdrawalRate}${t.percentage}`),
                    createElement('input', {
                        key: 'withdrawal-rate-input',
                        type: 'range',
                        min: '2',
                        max: '8',
                        step: '0.5',
                        value: strategyParams.withdrawalRate,
                        onChange: (e) => setStrategyParams({
                            ...strategyParams,
                            withdrawalRate: parseFloat(e.target.value)
                        }),
                        className: 'w-full'
                    })
                ]),
                
                // Target Income
                createElement('div', {
                    key: 'target-income-setting'
                }, [
                    createElement('label', {
                        key: 'target-income-label',
                        className: 'block text-sm font-medium text-gray-700 mb-2'
                    }, `${t.targetIncome} (${t.annually})`),
                    createElement('input', {
                        key: 'target-income-input',
                        type: 'number',
                        step: '1000',
                        value: strategyParams.targetIncome,
                        onChange: (e) => setStrategyParams({
                            ...strategyParams,
                            targetIncome: parseFloat(e.target.value) || 0
                        }),
                        className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    })
                ]),
                
                // Time Horizon
                createElement('div', {
                    key: 'time-horizon-setting'
                }, [
                    createElement('label', {
                        key: 'time-horizon-label',
                        className: 'block text-sm font-medium text-gray-700 mb-2'
                    }, `${t.timeHorizon}: ${projectionYears} ${t.years}`),
                    createElement('input', {
                        key: 'time-horizon-input',
                        type: 'range',
                        min: '10',
                        max: '50',
                        step: '5',
                        value: projectionYears,
                        onChange: (e) => setProjectionYears(parseInt(e.target.value)),
                        className: 'w-full'
                    })
                ])
            ])
        ]),
        
        // Strategy Information Card (for selected strategy)
        strategyResults[selectedStrategy] && createElement('div', {
            key: 'strategy-info',
            className: 'bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200'
        }, [
            createElement('div', {
                key: 'strategy-header',
                className: 'flex justify-between items-start mb-4'
            }, [
                createElement('div', {
                    key: 'strategy-title-section'
                }, [
                    createElement('h4', {
                        key: 'strategy-name',
                        className: 'text-xl font-bold text-blue-800'
                    }, availableStrategies[selectedStrategy]?.name?.[language] || getStrategyName(selectedStrategy)),
                    createElement('p', {
                        key: 'strategy-description',
                        className: 'text-blue-700 mt-1'
                    }, availableStrategies[selectedStrategy]?.description?.[language] || '')
                ]),
                createElement('div', {
                    key: 'strategy-metrics',
                    className: 'text-right'
                }, [
                    createElement('div', {
                        key: 'avg-income-metric',
                        className: 'text-2xl font-bold text-blue-800'
                    }, formatCurrency(strategyResults[selectedStrategy].averageAnnualIncome / 12)),
                    createElement('div', {
                        key: 'avg-income-label',
                        className: 'text-sm text-blue-600'
                    }, `${t.averageIncome} (${t.monthly})`)
                ])
            ]),
            
            // Key Results Grid
            createElement('div', {
                key: 'strategy-results-grid',
                className: 'grid grid-cols-1 md:grid-cols-4 gap-4'
            }, [
                // Total Withdrawn
                createElement('div', {
                    key: 'total-withdrawn',
                    className: 'bg-white rounded-lg p-4 border border-blue-200'
                }, [
                    createElement('div', {
                        key: 'withdrawn-label',
                        className: 'text-sm text-blue-600 mb-1'
                    }, t.totalWithdrawn),
                    createElement('div', {
                        key: 'withdrawn-value',
                        className: 'text-lg font-bold text-blue-800'
                    }, formatCurrency(strategyResults[selectedStrategy].totalWithdrawn))
                ]),
                
                // Final Portfolio Value
                createElement('div', {
                    key: 'final-value',
                    className: `bg-white rounded-lg p-4 border ${
                        strategyResults[selectedStrategy].finalPortfolioValue > 0 
                            ? 'border-green-200' : 'border-red-200'
                    }`
                }, [
                    createElement('div', {
                        key: 'final-label',
                        className: `text-sm mb-1 ${
                            strategyResults[selectedStrategy].finalPortfolioValue > 0 
                                ? 'text-green-600' : 'text-red-600'
                        }`
                    }, t.finalValue),
                    createElement('div', {
                        key: 'final-value-amount',
                        className: `text-lg font-bold ${
                            strategyResults[selectedStrategy].finalPortfolioValue > 0 
                                ? 'text-green-800' : 'text-red-800'
                        }`
                    }, formatCurrency(strategyResults[selectedStrategy].finalPortfolioValue))
                ]),
                
                // Tax Efficiency
                createElement('div', {
                    key: 'tax-efficiency',
                    className: 'bg-white rounded-lg p-4 border border-blue-200'
                }, [
                    createElement('div', {
                        key: 'tax-label',
                        className: 'text-sm text-blue-600 mb-1'
                    }, t.taxPaid),
                    createElement('div', {
                        key: 'tax-value',
                        className: 'text-lg font-bold text-blue-800'
                    }, formatCurrency(strategyResults[selectedStrategy].taxOptimization?.totalTaxes || 0))
                ]),
                
                // Depletion Risk
                createElement('div', {
                    key: 'depletion-risk',
                    className: `bg-white rounded-lg p-4 border ${
                        strategyResults[selectedStrategy].depletionYear 
                            ? 'border-red-200' : 'border-green-200'
                    }`
                }, [
                    createElement('div', {
                        key: 'depletion-label',
                        className: `text-sm mb-1 ${
                            strategyResults[selectedStrategy].depletionYear 
                                ? 'text-red-600' : 'text-green-600'
                        }`
                    }, t.depletionRisk),
                    createElement('div', {
                        key: 'depletion-value',
                        className: `text-lg font-bold ${
                            strategyResults[selectedStrategy].depletionYear 
                                ? 'text-red-800' : 'text-green-800'
                        }`
                    }, strategyResults[selectedStrategy].depletionYear ? 
                        `${strategyResults[selectedStrategy].depletionYear} ${t.years}` : 
                        t.never)
                ])
            ])
        ]),
        
        // Main Content Area - depends on view mode
        createElement('div', {
            key: 'main-content',
            className: 'bg-white rounded-xl p-6 border border-gray-200 shadow-sm'
        }, [
            // Comparison View
            viewMode === 'comparison' && Object.keys(strategyResults).length > 1 ?
                createElement('div', {
                    key: 'comparison-content'
                }, [
                    createElement('h4', {
                        key: 'comparison-title',
                        className: 'text-lg font-semibold text-gray-800 mb-6'
                    }, t.compareStrategies),
                    createElement('div', {
                        key: 'comparison-table',
                        className: 'overflow-x-auto'
                    }, [
                        createElement('table', {
                            key: 'strategy-comparison-table',
                            className: 'w-full table-auto'
                        }, [
                            createElement('thead', {
                                key: 'table-head',
                                className: 'bg-gray-50'
                            }, [
                                createElement('tr', {
                                    key: 'table-header-row'
                                }, [
                                    createElement('th', { key: 'strategy-header', className: 'px-4 py-3 text-left text-sm font-medium text-gray-900' }, t.strategies),
                                    createElement('th', { key: 'income-header', className: 'px-4 py-3 text-right text-sm font-medium text-gray-900' }, `${t.averageIncome} (${t.monthly})`),
                                    createElement('th', { key: 'final-header', className: 'px-4 py-3 text-right text-sm font-medium text-gray-900' }, t.finalValue),
                                    createElement('th', { key: 'tax-header', className: 'px-4 py-3 text-right text-sm font-medium text-gray-900' }, t.taxEfficiency),
                                    createElement('th', { key: 'risk-header', className: 'px-4 py-3 text-center text-sm font-medium text-gray-900' }, t.depletionRisk)
                                ])
                            ]),
                            createElement('tbody', {
                                key: 'table-body',
                                className: 'bg-white divide-y divide-gray-200'
                            }, 
                                Object.entries(strategyResults).map(([strategy, result], index) => 
                                    createElement('tr', {
                                        key: `strategy-row-${strategy}`,
                                        className: index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                    }, [
                                        createElement('td', { 
                                            key: `name-${strategy}`, 
                                            className: 'px-4 py-3 text-sm font-medium text-gray-900' 
                                        }, getStrategyName(strategy)),
                                        createElement('td', { 
                                            key: `income-${strategy}`, 
                                            className: 'px-4 py-3 text-sm text-gray-900 text-right font-medium' 
                                        }, formatCurrency(result.averageAnnualIncome / 12)),
                                        createElement('td', { 
                                            key: `final-${strategy}`, 
                                            className: `px-4 py-3 text-sm text-right font-medium ${
                                                result.finalPortfolioValue > 0 ? 'text-green-600' : 'text-red-600'
                                            }`
                                        }, formatCurrency(result.finalPortfolioValue)),
                                        createElement('td', { 
                                            key: `tax-${strategy}`, 
                                            className: 'px-4 py-3 text-sm text-gray-900 text-right' 
                                        }, formatPercentage(result.taxOptimization?.effectiveTaxRate || 0)),
                                        createElement('td', { 
                                            key: `risk-${strategy}`, 
                                            className: `px-4 py-3 text-sm text-center font-medium ${
                                                result.depletionYear ? 'text-red-600' : 'text-green-600'
                                            }`
                                        }, result.depletionYear ? `${result.depletionYear}y` : '✓')
                                    ])
                                )
                            )
                        ])
                    ])
                ]) :
            
            // Strategy Details View  
            viewMode === 'details' && strategyResults[selectedStrategy] ?
                createElement('div', {
                    key: 'details-content'
                }, [
                    createElement('h4', {
                        key: 'details-title',
                        className: 'text-lg font-semibold text-gray-800 mb-6'
                    }, `${getStrategyName(selectedStrategy)} - ${t.strategyDetails}`),
                    createElement('div', {
                        key: 'details-grid',
                        className: 'grid grid-cols-1 lg:grid-cols-2 gap-6'
                    }, [
                        // Strategy Characteristics
                        createElement('div', {
                            key: 'strategy-characteristics',
                            className: 'space-y-4'
                        }, [
                            availableStrategies[selectedStrategy]?.pros && createElement('div', {
                                key: 'pros-section',
                                className: 'bg-green-50 rounded-lg p-4 border border-green-200'
                            }, [
                                createElement('h5', {
                                    key: 'pros-title',
                                    className: 'font-semibold text-green-800 mb-2'
                                }, t.pros),
                                createElement('ul', {
                                    key: 'pros-list',
                                    className: 'space-y-1'
                                }, availableStrategies[selectedStrategy].pros.map((pro, index) =>
                                    createElement('li', {
                                        key: `pro-${index}`,
                                        className: 'text-sm text-green-700 flex items-center'
                                    }, [
                                        createElement('span', { key: `pro-bullet-${index}`, className: 'mr-2' }, '✓'),
                                        pro
                                    ])
                                ))
                            ]),
                            
                            availableStrategies[selectedStrategy]?.cons && createElement('div', {
                                key: 'cons-section',
                                className: 'bg-red-50 rounded-lg p-4 border border-red-200'
                            }, [
                                createElement('h5', {
                                    key: 'cons-title',
                                    className: 'font-semibold text-red-800 mb-2'
                                }, t.cons),
                                createElement('ul', {
                                    key: 'cons-list',
                                    className: 'space-y-1'
                                }, availableStrategies[selectedStrategy].cons.map((con, index) =>
                                    createElement('li', {
                                        key: `con-${index}`,
                                        className: 'text-sm text-red-700 flex items-center'
                                    }, [
                                        createElement('span', { key: `con-bullet-${index}`, className: 'mr-2' }, '⚠'),
                                        con
                                    ])
                                ))
                            ])
                        ]),
                        
                        // Risk Metrics
                        createElement('div', {
                            key: 'risk-metrics-details',
                            className: 'space-y-4'
                        }, [
                            createElement('h5', {
                                key: 'risk-metrics-title',
                                className: 'font-semibold text-gray-800'
                            }, t.riskMetrics),
                            createElement('div', {
                                key: 'risk-metrics-grid',
                                className: 'space-y-3'
                            }, [
                                createElement('div', {
                                    key: 'income-volatility-metric',
                                    className: 'flex justify-between items-center p-3 bg-gray-50 rounded-lg'
                                }, [
                                    createElement('span', {
                                        key: 'volatility-label',
                                        className: 'text-sm text-gray-700'
                                    }, t.incomeVolatility),
                                    createElement('span', {
                                        key: 'volatility-value',
                                        className: `text-sm font-medium px-2 py-1 rounded ${
                                            getRiskColor(
                                                strategyResults[selectedStrategy].riskMetrics?.incomeVolatility > 0.25 ? 'high' :
                                                strategyResults[selectedStrategy].riskMetrics?.incomeVolatility > 0.15 ? 'medium' : 'low'
                                            )
                                        }`
                                    }, formatPercentage(strategyResults[selectedStrategy].riskMetrics?.incomeVolatility || 0))
                                ])
                            ])
                        ])
                    ])
                ]) :
            
            // Scenario Analysis View
            viewMode === 'scenarios' ?
                createElement('div', {
                    key: 'scenarios-content'
                }, [
                    createElement('h4', {
                        key: 'scenarios-title',
                        className: 'text-lg font-semibold text-gray-800 mb-6'
                    }, t.scenarioAnalysis),
                    createElement('div', {
                        key: 'scenarios-placeholder',
                        className: 'h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300'
                    }, [
                        createElement('div', {
                            key: 'scenarios-placeholder-content',
                            className: 'text-center'
                        }, [
                            createElement('div', {
                                key: 'scenarios-icon',
                                className: 'text-4xl mb-2'
                            }, '📊'),
                            createElement('p', {
                                key: 'scenarios-text'
                            }, `${t.scenarioAnalysis} - Coming Soon`)
                        ])
                    ])
                ]) :
            
            // Default placeholder
            createElement('div', {
                key: 'default-placeholder',
                className: 'text-center py-12'
            }, [
                createElement('div', {
                    key: 'placeholder-icon',
                    className: 'text-6xl mb-4 text-gray-400'
                }, '💰'),
                createElement('p', {
                    key: 'placeholder-text',
                    className: 'text-gray-600'
                }, `${t.runAnalysis} - ${getStrategyName(selectedStrategy)}`)
            ])
        ]),
        
        // Recommendations
        strategyResults[selectedStrategy]?.recommendations?.length > 0 && createElement('div', {
            key: 'withdrawal-recommendations',
            className: 'bg-orange-50 rounded-xl p-6 border border-orange-200'
        }, [
            createElement('h4', {
                key: 'recommendations-title',
                className: 'text-xl font-semibold text-orange-800 mb-4 flex items-center'
            }, [
                createElement('span', { key: 'recommendations-icon', className: 'mr-3' }, '🎯'),
                t.recommendations
            ]),
            createElement('div', {
                key: 'recommendations-list',
                className: 'space-y-4'
            }, strategyResults[selectedStrategy].recommendations.slice(0, 3).map((rec, index) => 
                createElement('div', {
                    key: `withdrawal-rec-${index}`,
                    className: 'bg-white rounded-lg p-4 border border-orange-200'
                }, [
                    createElement('div', {
                        key: `rec-header-${index}`,
                        className: 'flex justify-between items-start mb-2'
                    }, [
                        createElement('h5', {
                            key: `rec-title-${index}`,
                            className: 'font-semibold text-orange-800'
                        }, rec.title),
                        createElement('span', {
                            key: `rec-priority-${index}`,
                            className: `text-xs px-2 py-1 rounded-full ${
                                rec.priority === 'critical' ? 'bg-red-100 text-red-700' :
                                rec.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                            }`
                        }, rec.priority)
                    ]),
                    createElement('p', {
                        key: `rec-description-${index}`,
                        className: 'text-sm text-orange-700 mb-3'
                    }, rec.description),
                    rec.actions && createElement('div', {
                        key: `rec-actions-${index}`,
                        className: 'space-y-1'
                    }, rec.actions.map((action, actionIndex) => 
                        createElement('div', {
                            key: `action-${index}-${actionIndex}`,
                            className: 'text-xs text-orange-600 flex items-center'
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
window.WithdrawalStrategyInterface = WithdrawalStrategyInterface;