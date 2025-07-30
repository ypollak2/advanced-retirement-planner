// PortfolioOptimizationPanel.js - Portfolio Optimization and Rebalancing Interface
// Created by Yali Pollak (יהלי פולק) - Advanced Retirement Planner v6.3.0

const PortfolioOptimizationPanel = ({ 
    inputs, 
    language = 'en',
    workingCurrency = 'ILS',
    onRebalance,
    onReturnToDashboard
}) => {
    const createElement = React.createElement;
    
    // State management
    const [optimization, setOptimization] = React.useState(null);
    const [isOptimizing, setIsOptimizing] = React.useState(false);
    const [viewMode, setViewMode] = React.useState('overview'); // overview, allocation, rebalancing, implementation
    const [selectedAction, setSelectedAction] = React.useState(null);
    
    // Multi-language content
    const content = {
        he: {
            title: 'אופטימיזציה ואיזון תיק השקעות',
            subtitle: 'המלצות מותאמות אישית לתיק ההשקעות שלך',
            
            // View modes
            viewModes: {
                overview: 'סקירה כללית',
                allocation: 'הקצאת נכסים',
                rebalancing: 'פעולות איזון',
                implementation: 'תוכנית יישום'
            },
            
            // Metrics
            metrics: {
                expectedReturn: 'תשואה צפויה',
                volatility: 'תנודתיות',
                sharpeRatio: 'יחס שארפ',
                diversificationScore: 'ציון פיזור',
                riskScore: 'ציון סיכון'
            },
            
            // Asset categories
            assetCategories: {
                stocks: 'מניות',
                bonds: 'אג"ח',
                alternatives: 'השקעות אלטרנטיביות',
                cash: 'מזומן'
            },
            
            // Allocation status
            current: 'הקצאה נוכחית',
            optimal: 'הקצאה מומלצת',
            difference: 'הפרש',
            
            // Actions
            optimizePortfolio: 'בצע אופטימיזציה',
            applyRebalancing: 'החל איזון מחדש',
            viewDetails: 'הצג פרטים',
            implementNow: 'יישם כעת',
            
            // Implementation timeline
            immediate: 'מיידי',
            shortTerm: 'טווח קצר (1-3 חודשים)',
            longTerm: 'טווח ארוך (3-12 חודשים)',
            
            // Status messages
            optimizing: 'מבצע אופטימיזציה...',
            noOptimizationNeeded: 'התיק שלך מאוזן היטב',
            significantRebalancingNeeded: 'נדרש איזון משמעותי',
            
            // Chart labels
            chartTitle: 'השוואת הקצאות',
            percentageLabel: 'אחוז מהתיק',
            
            info: 'אופטימיזציה של תיק ההשקעות מבוססת על גיל, סובלנות סיכון ויעדי פרישה'
        },
        en: {
            title: 'Portfolio Optimization & Rebalancing',
            subtitle: 'Personalized recommendations for your investment portfolio',
            
            // View modes
            viewModes: {
                overview: 'Overview',
                allocation: 'Asset Allocation',
                rebalancing: 'Rebalancing Actions',
                implementation: 'Implementation Plan'
            },
            
            // Metrics
            metrics: {
                expectedReturn: 'Expected Return',
                volatility: 'Volatility',
                sharpeRatio: 'Sharpe Ratio',
                diversificationScore: 'Diversification Score',
                riskScore: 'Risk Score'
            },
            
            // Asset categories
            assetCategories: {
                stocks: 'Stocks',
                bonds: 'Bonds',
                alternatives: 'Alternative Investments',
                cash: 'Cash'
            },
            
            // Allocation status
            current: 'Current Allocation',
            optimal: 'Optimal Allocation',
            difference: 'Difference',
            
            // Actions
            optimizePortfolio: 'Optimize Portfolio',
            applyRebalancing: 'Apply Rebalancing',
            viewDetails: 'View Details',
            implementNow: 'Implement Now',
            
            // Implementation timeline
            immediate: 'Immediate',
            shortTerm: 'Short Term (1-3 months)',
            longTerm: 'Long Term (3-12 months)',
            
            // Status messages
            optimizing: 'Optimizing portfolio...',
            noOptimizationNeeded: 'Your portfolio is well balanced',
            significantRebalancingNeeded: 'Significant rebalancing needed',
            
            // Chart labels
            chartTitle: 'Allocation Comparison',
            percentageLabel: 'Percentage of Portfolio',
            
            info: 'Portfolio optimization is based on your age, risk tolerance, and retirement goals'
        }
    };

    const t = content[language];

    // Run optimization when component mounts or inputs change
    React.useEffect(() => {
        runOptimization();
    }, [inputs]);

    // Run portfolio optimization
    const runOptimization = async () => {
        if (!window.PortfolioOptimizer) {
            console.warn('PortfolioOptimizer utility not loaded');
            return;
        }

        setIsOptimizing(true);
        
        try {
            // Simulate async operation
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const results = window.PortfolioOptimizer.optimizePortfolio(inputs, language);
            setOptimization(results);
        } catch (error) {
            console.error('Optimization error:', error);
        } finally {
            setIsOptimizing(false);
        }
    };

    // Format currency
    const formatCurrency = (amount, currency) => {
        if (window.formatCurrency) {
            return window.formatCurrency(amount, currency);
        }
        
        const symbols = { ILS: '₪', USD: '$', GBP: '£', EUR: '€' };
        const symbol = symbols[currency] || '₪';
        return `${symbol}${Math.round(amount).toLocaleString()}`;
    };

    // Get metric color
    const getMetricColor = (metric, value) => {
        switch (metric) {
            case 'expectedReturn':
                return value >= 8 ? 'green' : value >= 5 ? 'blue' : 'yellow';
            case 'volatility':
                return value <= 10 ? 'green' : value <= 20 ? 'blue' : 'red';
            case 'sharpeRatio':
                return value >= 1 ? 'green' : value >= 0.5 ? 'blue' : 'yellow';
            case 'diversificationScore':
                return value >= 80 ? 'green' : value >= 60 ? 'blue' : 'red';
            case 'riskScore':
                return value <= 30 ? 'green' : value <= 60 ? 'blue' : 'red';
            default:
                return 'gray';
        }
    };

    // Render portfolio metrics
    const renderPortfolioMetrics = (metrics, title) => {
        return createElement('div', {
            key: title,
            className: 'bg-white rounded-xl p-6 border border-gray-200'
        }, [
            createElement('h3', {
                key: 'title',
                className: 'text-lg font-semibold text-gray-800 mb-4'
            }, title),
            
            createElement('div', {
                key: 'metrics-grid',
                className: 'grid grid-cols-2 md:grid-cols-5 gap-4'
            }, Object.keys(t.metrics).map(metric => {
                const value = metrics[metric];
                const color = getMetricColor(metric, value);
                
                return createElement('div', {
                    key: metric,
                    className: `text-center p-3 bg-${color}-50 rounded-lg border border-${color}-200`
                }, [
                    createElement('div', {
                        key: 'value',
                        className: `text-xl font-bold text-${color}-700`
                    }, metric === 'expectedReturn' || metric === 'volatility' ? 
                        `${value.toFixed(1)}%` : value.toFixed(2)),
                    createElement('div', {
                        key: 'label',
                        className: `text-xs text-${color}-600 mt-1`
                    }, t.metrics[metric])
                ]);
            }))
        ]);
    };

    // Render allocation comparison
    const renderAllocationComparison = () => {
        if (!optimization) return null;
        
        const { currentAllocation, optimalAllocation } = optimization;
        
        return createElement('div', {
            key: 'allocation-comparison',
            className: 'bg-white rounded-xl p-6 border border-gray-200'
        }, [
            createElement('h3', {
                key: 'title',
                className: 'text-xl font-semibold text-gray-800 mb-6'
            }, t.chartTitle),
            
            createElement('div', {
                key: 'allocation-table',
                className: 'overflow-x-auto'
            }, [
                createElement('table', {
                    key: 'table',
                    className: 'w-full'
                }, [
                    createElement('thead', {
                        key: 'thead',
                        className: 'border-b-2 border-gray-200'
                    }, [
                        createElement('tr', { key: 'header-row' }, [
                            createElement('th', {
                                key: 'asset-class',
                                className: 'text-left py-3 px-4 font-semibold text-gray-700'
                            }, language === 'he' ? 'סוג נכס' : 'Asset Class'),
                            createElement('th', {
                                key: 'current',
                                className: 'text-center py-3 px-4 font-semibold text-gray-700'
                            }, t.current),
                            createElement('th', {
                                key: 'optimal',
                                className: 'text-center py-3 px-4 font-semibold text-gray-700'
                            }, t.optimal),
                            createElement('th', {
                                key: 'difference',
                                className: 'text-center py-3 px-4 font-semibold text-gray-700'
                            }, t.difference)
                        ])
                    ]),
                    
                    createElement('tbody', { key: 'tbody' }, 
                        Object.keys(t.assetCategories).map(category => {
                            const assets = currentAllocation[category];
                            const rows = [];
                            
                            // Category header
                            rows.push(createElement('tr', {
                                key: `${category}-header`,
                                className: 'bg-gray-50 font-semibold'
                            }, [
                                createElement('td', {
                                    key: 'category',
                                    className: 'py-2 px-4',
                                    colSpan: 4
                                }, t.assetCategories[category])
                            ]));
                            
                            // Asset rows
                            Object.keys(assets).forEach(asset => {
                                const current = currentAllocation[category][asset] || 0;
                                const optimal = optimalAllocation[category][asset] || 0;
                                const diff = optimal - current;
                                
                                if (current > 0 || optimal > 0) {
                                    rows.push(createElement('tr', {
                                        key: `${category}-${asset}`,
                                        className: 'border-b border-gray-100 hover:bg-gray-50'
                                    }, [
                                        createElement('td', {
                                            key: 'name',
                                            className: 'py-3 px-4 pl-8'
                                        }, window.PortfolioOptimizer.assetClasses[category][asset].name[language]),
                                        createElement('td', {
                                            key: 'current',
                                            className: 'text-center py-3 px-4'
                                        }, `${current.toFixed(1)}%`),
                                        createElement('td', {
                                            key: 'optimal',
                                            className: 'text-center py-3 px-4 font-medium'
                                        }, `${optimal.toFixed(1)}%`),
                                        createElement('td', {
                                            key: 'difference',
                                            className: `text-center py-3 px-4 font-medium ${
                                                Math.abs(diff) > 5 ? (diff > 0 ? 'text-green-600' : 'text-red-600') : 'text-gray-600'
                                            }`
                                        }, `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%`)
                                    ]));
                                }
                            });
                            
                            return rows;
                        }).flat()
                    )
                ])
            ])
        ]);
    };

    // Render rebalancing actions
    const renderRebalancingActions = () => {
        if (!optimization || !optimization.rebalancingActions.length) {
            return createElement('div', {
                key: 'no-actions',
                className: 'text-center py-12'
            }, [
                createElement('div', {
                    key: 'icon',
                    className: 'text-6xl mb-4'
                }, '✅'),
                createElement('h3', {
                    key: 'title',
                    className: 'text-xl font-semibold text-green-600 mb-2'
                }, t.noOptimizationNeeded),
                createElement('p', {
                    key: 'desc',
                    className: 'text-gray-600'
                }, language === 'he' ? 
                    'התיק שלך קרוב להקצאה האופטימלית' : 
                    'Your portfolio is close to optimal allocation')
            ]);
        }
        
        return createElement('div', {
            key: 'rebalancing-actions',
            className: 'space-y-4'
        }, optimization.rebalancingActions.map((action, index) => {
            const assetName = window.PortfolioOptimizer.assetClasses[action.category][action.asset].name[language];
            const actionColor = action.action === 'buy' ? 'green' : 'red';
            
            return createElement('div', {
                key: `action-${index}`,
                className: `bg-white rounded-lg p-6 border-2 border-${actionColor}-200 hover:border-${actionColor}-300 transition-colors cursor-pointer`,
                onClick: () => setSelectedAction(action)
            }, [
                createElement('div', {
                    key: 'header',
                    className: 'flex justify-between items-start mb-4'
                }, [
                    createElement('div', {
                        key: 'action-info',
                        className: 'flex-1'
                    }, [
                        createElement('h4', {
                            key: 'asset-name',
                            className: `text-lg font-semibold text-${actionColor}-700 mb-1`
                        }, assetName),
                        createElement('p', {
                            key: 'action-type',
                            className: `text-${actionColor}-600`
                        }, `${action.action === 'buy' ? t.actions.buy : t.actions.sell} ${Math.abs(action.differencePercentage).toFixed(1)}%`)
                    ]),
                    
                    createElement('div', {
                        key: 'amount',
                        className: 'text-right'
                    }, [
                        createElement('div', {
                            key: 'amount-value',
                            className: 'text-xl font-bold text-gray-800'
                        }, formatCurrency(action.amount, workingCurrency)),
                        createElement('div', {
                            key: 'priority',
                            className: `text-sm ${action.priority === 'high' ? 'text-red-600' : 'text-yellow-600'}`
                        }, action.priority === 'high' ? 
                            (language === 'he' ? 'עדיפות גבוהה' : 'High Priority') :
                            (language === 'he' ? 'עדיפות בינונית' : 'Medium Priority'))
                    ])
                ]),
                
                createElement('div', {
                    key: 'progress',
                    className: 'mt-4'
                }, [
                    createElement('div', {
                        key: 'progress-labels',
                        className: 'flex justify-between text-sm text-gray-600 mb-1'
                    }, [
                        createElement('span', { key: 'current' }, `${t.current}: ${action.currentPercentage.toFixed(1)}%`),
                        createElement('span', { key: 'target' }, `${t.optimal}: ${action.targetPercentage.toFixed(1)}%`)
                    ]),
                    createElement('div', {
                        key: 'progress-bar',
                        className: 'w-full bg-gray-200 rounded-full h-2'
                    }, [
                        createElement('div', {
                            key: 'current-bar',
                            className: `bg-${actionColor}-500 h-2 rounded-full transition-all`,
                            style: { width: `${(action.currentPercentage / action.targetPercentage) * 100}%` }
                        })
                    ])
                ])
            ]);
        }));
    };

    // Render implementation plan
    const renderImplementationPlan = () => {
        if (!optimization || !optimization.implementationPlan) return null;
        
        const { immediate, shortTerm, longTerm } = optimization.implementationPlan;
        
        return createElement('div', {
            key: 'implementation-plan',
            className: 'space-y-6'
        }, [
            // Immediate actions
            immediate.length > 0 && createElement('div', {
                key: 'immediate',
                className: 'bg-red-50 rounded-xl p-6 border border-red-200'
            }, [
                createElement('h3', {
                    key: 'title',
                    className: 'text-lg font-semibold text-red-700 mb-4 flex items-center'
                }, [
                    createElement('span', { key: 'icon', className: 'mr-2' }, '🚨'),
                    t.immediate
                ]),
                createElement('ul', {
                    key: 'actions',
                    className: 'space-y-3'
                }, immediate.map((step, index) =>
                    createElement('li', {
                        key: `immediate-${index}`,
                        className: 'flex items-start'
                    }, [
                        createElement('span', { key: 'bullet', className: 'mr-2 text-red-500' }, '•'),
                        createElement('div', { key: 'content' }, [
                            createElement('span', { key: 'action', className: 'font-medium' }, 
                                `${step.action} ${step.asset}: `),
                            createElement('span', { key: 'amount' }, 
                                formatCurrency(step.amount, workingCurrency)),
                            step.reason && createElement('span', { 
                                key: 'reason', 
                                className: 'text-sm text-red-600 ml-2' 
                            }, `(${step.reason})`)
                        ])
                    ])
                ))
            ]),
            
            // Short-term actions
            shortTerm.length > 0 && createElement('div', {
                key: 'short-term',
                className: 'bg-yellow-50 rounded-xl p-6 border border-yellow-200'
            }, [
                createElement('h3', {
                    key: 'title',
                    className: 'text-lg font-semibold text-yellow-700 mb-4 flex items-center'
                }, [
                    createElement('span', { key: 'icon', className: 'mr-2' }, '⏱️'),
                    t.shortTerm
                ]),
                createElement('ul', {
                    key: 'actions',
                    className: 'space-y-3'
                }, shortTerm.map((step, index) =>
                    createElement('li', {
                        key: `short-${index}`,
                        className: 'flex items-start'
                    }, [
                        createElement('span', { key: 'bullet', className: 'mr-2 text-yellow-500' }, '•'),
                        createElement('div', { key: 'content' }, [
                            createElement('span', { key: 'action', className: 'font-medium' }, 
                                `${step.action} ${step.asset}: `),
                            createElement('span', { key: 'amount' }, 
                                formatCurrency(step.amount, workingCurrency))
                        ])
                    ])
                ))
            ]),
            
            // Long-term actions
            longTerm.length > 0 && createElement('div', {
                key: 'long-term',
                className: 'bg-blue-50 rounded-xl p-6 border border-blue-200'
            }, [
                createElement('h3', {
                    key: 'title',
                    className: 'text-lg font-semibold text-blue-700 mb-4 flex items-center'
                }, [
                    createElement('span', { key: 'icon', className: 'mr-2' }, '📅'),
                    t.longTerm
                ]),
                createElement('ul', {
                    key: 'actions',
                    className: 'space-y-3'
                }, longTerm.map((step, index) =>
                    createElement('li', {
                        key: `long-${index}`,
                        className: 'flex items-start'
                    }, [
                        createElement('span', { key: 'bullet', className: 'mr-2 text-blue-500' }, '•'),
                        createElement('div', { key: 'content' }, [
                            createElement('span', { key: 'action', className: 'font-medium' }, 
                                `${step.action} ${step.asset}: `),
                            createElement('span', { key: 'amount' }, 
                                formatCurrency(step.amount, workingCurrency))
                        ])
                    ])
                ))
            ])
        ]);
    };

    // Render recommendations
    const renderRecommendations = () => {
        if (!optimization || !optimization.recommendations.length) return null;
        
        return createElement('div', {
            key: 'recommendations',
            className: 'bg-indigo-50 rounded-xl p-6 border border-indigo-200 mt-6'
        }, [
            createElement('h3', {
                key: 'title',
                className: 'text-lg font-semibold text-indigo-700 mb-4 flex items-center'
            }, [
                createElement('span', { key: 'icon', className: 'mr-2' }, '💡'),
                language === 'he' ? 'המלצות' : 'Recommendations'
            ]),
            
            createElement('div', {
                key: 'recommendations-list',
                className: 'space-y-4'
            }, optimization.recommendations.map((rec, index) => {
                const priorityColors = {
                    high: 'red',
                    medium: 'yellow',
                    low: 'blue'
                };
                const color = priorityColors[rec.priority] || 'gray';
                
                return createElement('div', {
                    key: `rec-${index}`,
                    className: `border-l-4 border-${color}-500 pl-4`
                }, [
                    createElement('h4', {
                        key: 'title',
                        className: `font-semibold text-${color}-700 mb-1`
                    }, rec.title),
                    createElement('p', {
                        key: 'description',
                        className: 'text-gray-600 text-sm mb-2'
                    }, rec.description),
                    rec.action && createElement('p', {
                        key: 'action',
                        className: `text-${color}-600 text-sm font-medium`
                    }, `➜ ${rec.action}`)
                ]);
            }))
        ]);
    };

    return createElement('div', { className: "portfolio-optimization-panel space-y-6" }, [
        // Header with return button
        createElement('div', { key: 'header', className: "text-center" }, [
            createElement('div', {
                key: 'nav',
                className: "flex justify-between items-center mb-6"
            }, [
                createElement('button', {
                    key: 'return-btn',
                    onClick: onReturnToDashboard || (() => {
                        if (window.RetirementPlannerApp && window.RetirementPlannerApp.setViewMode) {
                            window.RetirementPlannerApp.setViewMode('dashboard');
                        } else {
                            window.location.reload();
                        }
                    }),
                    className: "flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                }, [
                    createElement('span', { key: 'arrow', className: "mr-2" }, '←'),
                    createElement('span', { key: 'text' }, language === 'he' ? 'חזרה ללוח הבקרה' : 'Return to Dashboard')
                ]),
                createElement('div', { key: 'spacer' }) // Empty div for spacing
            ]),
            createElement('h1', {
                key: 'title',
                className: "text-3xl font-bold text-gray-800 mb-4"
            }, t.title),
            createElement('p', {
                key: 'subtitle',
                className: "text-lg text-gray-600"
            }, t.subtitle)
        ]),

        // View mode tabs
        createElement('div', {
            key: 'view-tabs',
            className: 'flex justify-center space-x-4 mb-6'
        }, Object.keys(t.viewModes).map(mode =>
            createElement('button', {
                key: mode,
                onClick: () => setViewMode(mode),
                className: `px-4 py-2 rounded-lg transition-colors ${
                    viewMode === mode
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`
            }, t.viewModes[mode])
        )),

        // Optimization button
        createElement('div', {
            key: 'optimize-button-container',
            className: 'flex justify-center mb-6'
        }, [
            createElement('button', {
                key: 'optimize-button',
                onClick: runOptimization,
                disabled: isOptimizing,
                className: `px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center ${isOptimizing ? 'animate-pulse' : ''}`
            }, [
                createElement('span', { key: 'icon', className: 'mr-2' }, isOptimizing ? '⏳' : '🎯'),
                isOptimizing ? t.optimizing : t.optimizePortfolio
            ])
        ]),

        // Content based on view mode
        isOptimizing ? 
            createElement('div', {
                key: 'loading',
                className: 'text-center py-12'
            }, [
                createElement('div', {
                    key: 'spinner',
                    className: 'animate-spin text-6xl mb-4'
                }, '⚙️'),
                createElement('p', {
                    key: 'loading-text',
                    className: 'text-gray-600'
                }, t.optimizing)
            ]) :
            optimization && (() => {
                switch (viewMode) {
                    case 'overview':
                        return createElement('div', { key: 'overview', className: 'space-y-6' }, [
                            renderPortfolioMetrics(optimization.currentMetrics, 
                                language === 'he' ? 'מדדי תיק נוכחיים' : 'Current Portfolio Metrics'),
                            renderPortfolioMetrics(optimization.optimalMetrics, 
                                language === 'he' ? 'מדדי תיק אופטימליים' : 'Optimal Portfolio Metrics'),
                            renderRecommendations()
                        ]);
                    
                    case 'allocation':
                        return renderAllocationComparison();
                    
                    case 'rebalancing':
                        return renderRebalancingActions();
                    
                    case 'implementation':
                        return renderImplementationPlan();
                    
                    default:
                        return null;
                }
            })(),

        // Information panel
        createElement('div', {
            key: 'info-panel',
            className: "bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
        }, [
            createElement('div', { key: 'info-icon', className: "text-2xl mb-2" }, 'ℹ️'),
            createElement('h4', {
                key: 'info-title',
                className: "text-lg font-semibold text-blue-700 mb-2"
            }, language === 'he' ? 'מידע חשוב' : 'Important Information'),
            createElement('p', {
                key: 'info-text',
                className: "text-blue-700 text-sm"
            }, t.info)
        ])
    ]);
};

// Export the component
window.PortfolioOptimizationPanel = PortfolioOptimizationPanel;

console.log('✅ PortfolioOptimizationPanel component loaded successfully');