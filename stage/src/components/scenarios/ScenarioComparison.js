// ScenarioComparison.js - Multiple Retirement Plan Scenario Analysis Tool
// Created by Yali Pollak (יהלי פולק) - Advanced Retirement Planner v6.3.0

const ScenarioComparison = ({ 
    baseScenario, 
    language = 'en', 
    workingCurrency = 'ILS',
    onScenarioUpdate,
    onReturnToDashboard
}) => {
    const createElement = React.createElement;
    
    // State for managing multiple scenarios
    const [scenarios, setScenarios] = React.useState([
        {
            id: 'base',
            name: language === 'he' ? 'תוכנית בסיס' : 'Base Plan',
            description: language === 'he' ? 'התוכנית הנוכחית שלך' : 'Your current plan',
            data: baseScenario || {},
            color: 'blue',
            isBase: true
        }
    ]);
    
    const [activeScenario, setActiveScenario] = React.useState('base');
    const [comparisonView, setComparisonView] = React.useState('summary'); // summary, detailed, charts
    const [showCreateModal, setShowCreateModal] = React.useState(false);
    
    // Multi-language content
    const content = {
        he: {
            title: 'השוואת תרחישי פרישה',
            subtitle: 'השווה תוכניות פרישה שונות כדי לקבל החלטות מושכלות',
            
            // Scenario management
            createScenario: 'צור תרחיש חדש',
            duplicateScenario: 'שכפל תרחיש',
            deleteScenario: 'מחק תרחיש',
            renameScenario: 'שנה שם תרחיש',
            
            // Scenario types
            scenarioTypes: {
                optimistic: 'תרחיש אופטימי',
                conservative: 'תרחיש שמרני',
                aggressive: 'תרחיש אגרסיבי',
                earlyRetirement: 'פרישה מוקדמת',
                lateRetirement: 'פרישה מאוחרת',
                increasedSavings: 'חיסכון מוגבר',
                reducedExpenses: 'הוצאות מופחתות',
                careerChange: 'שינוי קריירה',
                international: 'תרחיש בינלאומי',
                custom: 'תרחיש מותאם אישית'
            },
            
            // Comparison views
            summaryView: 'תצוגת סיכום',
            detailedView: 'תצוגה מפורטת',
            chartsView: 'תצוגת גרפים',
            
            // Comparison metrics
            totalAccumulation: 'סך צבירה',
            monthlyIncome: 'הכנסה חודשית',
            yearsToGoal: 'שנים למטרה',
            successProbability: 'הסתברות הצלחה',
            riskScore: 'ציון סיכון',
            
            // Analysis
            bestScenario: 'התרחיש הטוב ביותר',
            worstScenario: 'התרחיש הגרוע ביותר',
            recommendedAction: 'פעולה מומלצת',
            keyDifferences: 'הבדלים מרכזיים',
            
            // Actions
            selectScenario: 'בחר תרחיש',
            modifyScenario: 'שנה תרחיש',
            exportComparison: 'יצא השוואה',
            saveComparison: 'שמור השוואה',
            
            // Stress testing
            stressTest: 'בדיקת עמידות',
            marketCrash: 'קריסת שוק',
            inflation: 'אינפלציה',
            unemployment: 'אבטלה',
            healthCosts: 'עלויות בריאות',
            
            // Recommendations
            recommendations: 'המלצות',
            optimize: 'בצע אופטימיזציה',
            rebalance: 'אזן מחדש',
            adjustContributions: 'התאם הפקדות',
            
            info: 'השוואת תרחישים מאפשרת לך לראות את ההשפעה של החלטות שונות על עתיד הפרישה שלך'
        },
        en: {
            title: 'Retirement Scenario Comparison',
            subtitle: 'Compare different retirement plans to make informed decisions',
            
            // Scenario management
            createScenario: 'Create New Scenario',
            duplicateScenario: 'Duplicate Scenario',
            deleteScenario: 'Delete Scenario',
            renameScenario: 'Rename Scenario',
            
            // Scenario types
            scenarioTypes: {
                optimistic: 'Optimistic Scenario',
                conservative: 'Conservative Scenario',
                aggressive: 'Aggressive Growth',
                earlyRetirement: 'Early Retirement',
                lateRetirement: 'Late Retirement',
                increasedSavings: 'Increased Savings',
                reducedExpenses: 'Reduced Expenses',
                careerChange: 'Career Change',
                international: 'International Scenario',
                custom: 'Custom Scenario'
            },
            
            // Comparison views
            summaryView: 'Summary View',
            detailedView: 'Detailed View',
            chartsView: 'Charts View',
            
            // Comparison metrics
            totalAccumulation: 'Total Accumulation',
            monthlyIncome: 'Monthly Income',
            yearsToGoal: 'Years to Goal',
            successProbability: 'Success Probability',
            riskScore: 'Risk Score',
            
            // Analysis
            bestScenario: 'Best Scenario',
            worstScenario: 'Worst Scenario',
            recommendedAction: 'Recommended Action',
            keyDifferences: 'Key Differences',
            
            // Actions
            selectScenario: 'Select Scenario',
            modifyScenario: 'Modify Scenario',
            exportComparison: 'Export Comparison',
            saveComparison: 'Save Comparison',
            
            // Stress testing
            stressTest: 'Stress Test',
            marketCrash: 'Market Crash',
            inflation: 'Inflation',
            unemployment: 'Unemployment',
            healthCosts: 'Health Costs',
            
            // Recommendations
            recommendations: 'Recommendations',
            optimize: 'Optimize',
            rebalance: 'Rebalance',
            adjustContributions: 'Adjust Contributions',
            
            info: 'Scenario comparison allows you to see the impact of different decisions on your retirement future'
        }
    };

    const t = content[language];

    // Scenario templates for quick creation
    const scenarioTemplates = {
        optimistic: {
            expectedReturn: 9.0,
            inflationRate: 2.0,
            salaryGrowth: 4.0,
            marketVolatility: 12.0
        },
        conservative: {
            expectedReturn: 5.0,
            inflationRate: 3.5,
            salaryGrowth: 2.0,
            marketVolatility: 8.0
        },
        aggressive: {
            expectedReturn: 11.0,
            inflationRate: 2.5,
            salaryGrowth: 5.0,
            marketVolatility: 18.0
        },
        earlyRetirement: {
            retirementAge: 55,
            pensionContributionRate: 25,
            trainingFundContributionRate: 10
        },
        lateRetirement: {
            retirementAge: 70,
            pensionContributionRate: 15,
            workingYearsExtension: 5
        }
    };

    // Color scheme for scenarios
    const scenarioColors = ['blue', 'green', 'purple', 'orange', 'red', 'indigo', 'pink', 'yellow'];

    // Calculate scenario results using retirement calculations
    const calculateScenarioResults = (scenarioData) => {
        if (!window.calculateRetirement) {
            return {
                totalAccumulation: 0,
                monthlyIncome: 0,
                yearsToGoal: 0,
                successProbability: 0,
                riskScore: 50
            };
        }
        
        try {
            const results = window.calculateRetirement(scenarioData);
            
            return {
                totalAccumulation: results.totalAccumulated || 0,
                monthlyIncome: results.monthlyIncome || 0,
                yearsToGoal: (scenarioData.retirementAge || 67) - (scenarioData.currentAge || 30),
                successProbability: calculateSuccessProbability(scenarioData, results),
                riskScore: calculateRiskScore(scenarioData),
                inflationAdjustedTotal: results.inflationAdjustedTotal || 0,
                realMonthlyIncome: results.realMonthlyIncome || 0
            };
        } catch (error) {
            console.error('Error calculating scenario results:', error);
            return {
                totalAccumulation: 0,
                monthlyIncome: 0,
                yearsToGoal: 0,
                successProbability: 0,
                riskScore: 50
            };
        }
    };

    // Calculate success probability based on Monte Carlo-style analysis
    const calculateSuccessProbability = (scenarioData, results) => {
        const targetReplacement = parseFloat(scenarioData.targetReplacement || 75) / 100;
        const currentSalary = parseFloat(scenarioData.currentMonthlySalary || 0) * 12;
        const targetIncome = currentSalary * targetReplacement;
        const projectedIncome = results.monthlyIncome * 12;
        
        const ratio = projectedIncome / targetIncome;
        
        // Simple probability model based on target achievement
        if (ratio >= 1.2) return 95;
        if (ratio >= 1.0) return 85;
        if (ratio >= 0.8) return 65;
        if (ratio >= 0.6) return 40;
        return 20;
    };

    // Calculate risk score based on portfolio allocation and volatility
    const calculateRiskScore = (scenarioData) => {
        const stockPercentage = parseFloat(scenarioData.stockPercentage || 60);
        const expectedReturn = parseFloat(scenarioData.expectedReturn || 7);
        const marketVolatility = parseFloat(scenarioData.marketVolatility || 15);
        
        // Risk score from 0-100 (higher = more risky)
        const allocationRisk = stockPercentage * 0.8; // 80% stocks = 64 points
        const returnRisk = Math.max(0, (expectedReturn - 5) * 5); // Above 5% adds risk
        const volatilityRisk = Math.min(30, marketVolatility * 2); // Cap at 30 points
        
        return Math.min(100, allocationRisk + returnRisk + volatilityRisk);
    };

    // Create new scenario
    const createNewScenario = (type, customData = {}) => {
        const template = scenarioTemplates[type] || {};
        const baseData = scenarios.find(s => s.isBase)?.data || {};
        
        const newScenario = {
            id: `scenario_${Date.now()}`,
            name: t.scenarioTypes[type] || t.scenarioTypes.custom,
            description: `Created on ${new Date().toLocaleDateString()}`,
            data: { ...baseData, ...template, ...customData },
            color: scenarioColors[scenarios.length % scenarioColors.length],
            isBase: false,
            createdAt: new Date().toISOString()
        };
        
        setScenarios(prev => [...prev, newScenario]);
        setActiveScenario(newScenario.id);
        setShowCreateModal(false);
    };

    // Duplicate existing scenario
    const duplicateScenario = (scenarioId) => {
        const scenario = scenarios.find(s => s.id === scenarioId);
        if (!scenario) return;
        
        const duplicated = {
            ...scenario,
            id: `scenario_${Date.now()}`,
            name: `${scenario.name} (Copy)`,
            color: scenarioColors[scenarios.length % scenarioColors.length],
            isBase: false,
            createdAt: new Date().toISOString()
        };
        
        setScenarios(prev => [...prev, duplicated]);
    };

    // Delete scenario
    const deleteScenario = (scenarioId) => {
        if (scenarios.find(s => s.id === scenarioId)?.isBase) return; // Can't delete base
        
        setScenarios(prev => prev.filter(s => s.id !== scenarioId));
        if (activeScenario === scenarioId) {
            setActiveScenario('base');
        }
    };

    // Update scenario data
    const updateScenarioData = (scenarioId, newData) => {
        setScenarios(prev => prev.map(scenario => 
            scenario.id === scenarioId 
                ? { ...scenario, data: { ...scenario.data, ...newData } }
                : scenario
        ));
    };

    // Get scenario analysis
    const getScenarioAnalysis = () => {
        const results = scenarios.map(scenario => ({
            ...scenario,
            results: calculateScenarioResults(scenario.data)
        }));
        
        // Find best and worst scenarios
        const sortedByAccumulation = [...results].sort((a, b) => 
            b.results.totalAccumulation - a.results.totalAccumulation
        );
        
        const best = sortedByAccumulation[0];
        const worst = sortedByAccumulation[sortedByAccumulation.length - 1];
        
        return {
            scenarios: results,
            best,
            worst,
            average: {
                totalAccumulation: results.reduce((sum, s) => sum + s.results.totalAccumulation, 0) / results.length,
                monthlyIncome: results.reduce((sum, s) => sum + s.results.monthlyIncome, 0) / results.length,
                successProbability: results.reduce((sum, s) => sum + s.results.successProbability, 0) / results.length
            }
        };
    };

    // Render scenario creation modal
    const renderCreateScenarioModal = () => {
        if (!showCreateModal) return null;
        
        return createElement('div', {
            key: 'create-modal',
            className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
        }, [
            createElement('div', {
                key: 'modal-content',
                className: 'bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto'
            }, [
                createElement('div', {
                    key: 'modal-header',
                    className: 'flex justify-between items-center mb-6'
                }, [
                    createElement('h2', {
                        key: 'modal-title',
                        className: 'text-2xl font-bold text-gray-800'
                    }, t.createScenario),
                    createElement('button', {
                        key: 'close-button',
                        onClick: () => setShowCreateModal(false),
                        className: 'text-gray-500 hover:text-gray-700 text-2xl'
                    }, '×')
                ]),
                
                createElement('div', {
                    key: 'scenario-templates',
                    className: 'grid grid-cols-1 md:grid-cols-2 gap-4'
                }, Object.keys(t.scenarioTypes).map(type => 
                    createElement('button', {
                        key: type,
                        onClick: () => createNewScenario(type),
                        className: 'p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left'
                    }, [
                        createElement('h3', {
                            key: 'template-title',
                            className: 'font-semibold text-gray-800 mb-2'
                        }, t.scenarioTypes[type]),
                        createElement('p', {
                            key: 'template-desc',
                            className: 'text-sm text-gray-600'
                        }, getScenarioDescription(type))
                    ])
                ))
            ])
        ]);
    };

    // Get scenario description
    const getScenarioDescription = (type) => {
        const descriptions = {
            optimistic: language === 'he' ? 'תשואות גבוהות ואינפלציה נמוכה' : 'High returns, low inflation',
            conservative: language === 'he' ? 'תשואות נמוכות יותר, יציבות רבה' : 'Lower returns, more stability',
            aggressive: language === 'he' ? 'צמיחה מהירה עם סיכון גבוה' : 'High growth with increased risk',
            earlyRetirement: language === 'he' ? 'פרישה בגיל 55 עם חיסכון מוגבר' : 'Retire at 55 with increased savings',
            lateRetirement: language === 'he' ? 'עבודה עד גיל 70 לבטחון פיננסי' : 'Work until 70 for financial security'
        };
        return descriptions[type] || '';
    };

    // Render scenario card
    const renderScenarioCard = (scenario) => {
        const results = calculateScenarioResults(scenario.data);
        const isActive = activeScenario === scenario.id;
        
        return createElement('div', {
            key: scenario.id,
            className: `bg-white rounded-xl p-6 border-2 transition-all cursor-pointer ${
                isActive 
                    ? `border-${scenario.color}-500 shadow-lg` 
                    : 'border-gray-200 hover:border-gray-300'
            }`
        }, [
            // Card header
            createElement('div', {
                key: 'card-header',
                className: 'flex justify-between items-start mb-4'
            }, [
                createElement('div', {
                    key: 'scenario-info',
                    onClick: () => setActiveScenario(scenario.id),
                    className: 'flex-1'
                }, [
                    createElement('h3', {
                        key: 'scenario-name',
                        className: `text-lg font-semibold text-${scenario.color}-700 mb-1`
                    }, scenario.name),
                    createElement('p', {
                        key: 'scenario-desc',
                        className: 'text-sm text-gray-600'
                    }, scenario.description)
                ]),
                
                // Action buttons
                !scenario.isBase && createElement('div', {
                    key: 'action-buttons',
                    className: 'flex space-x-2 ml-4'
                }, [
                    createElement('button', {
                        key: 'duplicate-btn',
                        onClick: (e) => {
                            e.stopPropagation();
                            duplicateScenario(scenario.id);
                        },
                        className: 'text-gray-500 hover:text-blue-600 p-1'
                    }, '📋'),
                    createElement('button', {
                        key: 'delete-btn',
                        onClick: (e) => {
                            e.stopPropagation();
                            if (window.confirm(language === 'he' ? 'האם למחוק תרחיש זה?' : 'Delete this scenario?')) {
                                deleteScenario(scenario.id);
                            }
                        },
                        className: 'text-gray-500 hover:text-red-600 p-1'
                    }, '🗑️')
                ])
            ]),
            
            // Key metrics
            createElement('div', {
                key: 'metrics-grid',
                className: 'grid grid-cols-2 gap-4 mb-4'
            }, [
                createElement('div', {
                    key: 'total-accumulation',
                    className: `bg-${scenario.color}-50 rounded-lg p-3 border border-${scenario.color}-200`
                }, [
                    createElement('div', {
                        key: 'accumulation-label',
                        className: `text-sm font-medium text-${scenario.color}-700`
                    }, t.totalAccumulation),
                    createElement('div', {
                        key: 'accumulation-value',
                        className: `text-lg font-bold text-${scenario.color}-800`
                    }, formatCurrency(results.totalAccumulation, workingCurrency))
                ]),
                
                createElement('div', {
                    key: 'monthly-income',
                    className: `bg-${scenario.color}-50 rounded-lg p-3 border border-${scenario.color}-200`
                }, [
                    createElement('div', {
                        key: 'income-label',
                        className: `text-sm font-medium text-${scenario.color}-700`
                    }, t.monthlyIncome),
                    createElement('div', {
                        key: 'income-value',
                        className: `text-lg font-bold text-${scenario.color}-800`
                    }, formatCurrency(results.monthlyIncome, workingCurrency))
                ])
            ]),
            
            // Success probability indicator
            createElement('div', {
                key: 'success-indicator',
                className: 'mb-4'
            }, [
                createElement('div', {
                    key: 'success-label',
                    className: 'flex justify-between text-sm font-medium text-gray-700 mb-1'
                }, [
                    createElement('span', { key: 'label' }, t.successProbability),
                    createElement('span', { key: 'value' }, `${Math.round(results.successProbability)}%`)
                ]),
                createElement('div', {
                    key: 'progress-bar',
                    className: 'w-full bg-gray-200 rounded-full h-2'
                }, [
                    createElement('div', {
                        key: 'progress-fill',
                        className: `bg-${scenario.color}-500 h-2 rounded-full transition-all`,
                        style: { width: `${results.successProbability}%` }
                    })
                ])
            ])
        ]);
    };

    // Format currency helper
    const formatCurrency = (amount, currency) => {
        if (window.formatCurrency) {
            return window.formatCurrency(amount, currency);
        }
        
        const symbols = { ILS: '₪', USD: '$', GBP: '£', EUR: '€' };
        const symbol = symbols[currency] || '₪';
        return `${symbol}${Math.round(amount).toLocaleString()}`;
    };

    // Render comparison summary
    const renderComparisonSummary = () => {
        const analysis = getScenarioAnalysis();
        
        return createElement('div', {
            key: 'comparison-summary',
            className: 'bg-white rounded-xl p-6 border border-gray-200'
        }, [
            createElement('h3', {
                key: 'summary-title',
                className: 'text-xl font-semibold text-gray-800 mb-6'
            }, language === 'he' ? 'סיכום השוואה' : 'Comparison Summary'),
            
            createElement('div', {
                key: 'summary-grid',
                className: 'grid grid-cols-1 md:grid-cols-3 gap-6'
            }, [
                // Best scenario
                createElement('div', {
                    key: 'best-scenario',
                    className: 'bg-green-50 rounded-lg p-4 border border-green-200'
                }, [
                    createElement('h4', {
                        key: 'best-title',
                        className: 'font-semibold text-green-700 mb-2'
                    }, t.bestScenario),
                    createElement('p', {
                        key: 'best-name',
                        className: 'text-green-800 font-medium mb-1'
                    }, analysis.best?.name),
                    createElement('p', {
                        key: 'best-value',
                        className: 'text-green-600 text-sm'
                    }, formatCurrency(analysis.best?.results.totalAccumulation || 0, workingCurrency))
                ]),
                
                // Average
                createElement('div', {
                    key: 'average-scenario',
                    className: 'bg-blue-50 rounded-lg p-4 border border-blue-200'
                }, [
                    createElement('h4', {
                        key: 'avg-title',
                        className: 'font-semibold text-blue-700 mb-2'
                    }, language === 'he' ? 'ממוצע' : 'Average'),
                    createElement('p', {
                        key: 'avg-value',
                        className: 'text-blue-600 text-sm'
                    }, formatCurrency(analysis.average.totalAccumulation, workingCurrency))
                ]),
                
                // Worst scenario
                createElement('div', {
                    key: 'worst-scenario',
                    className: 'bg-red-50 rounded-lg p-4 border border-red-200'
                }, [
                    createElement('h4', {
                        key: 'worst-title',
                        className: 'font-semibold text-red-700 mb-2'
                    }, t.worstScenario),
                    createElement('p', {
                        key: 'worst-name',
                        className: 'text-red-800 font-medium mb-1'
                    }, analysis.worst?.name),
                    createElement('p', {
                        key: 'worst-value',
                        className: 'text-red-600 text-sm'
                    }, formatCurrency(analysis.worst?.results.totalAccumulation || 0, workingCurrency))
                ])
            ])
        ]);
    };

    return createElement('div', { className: "scenario-comparison space-y-6" }, [
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

        // Action buttons
        createElement('div', {
            key: 'action-buttons',
            className: 'flex justify-between items-center'
        }, [
            createElement('div', {
                key: 'view-controls',
                className: 'flex space-x-4'
            }, [
                ['summary', t.summaryView],
                ['detailed', t.detailedView],
                ['charts', t.chartsView]
            ].map(([view, label]) =>
                createElement('button', {
                    key: view,
                    onClick: () => setComparisonView(view),
                    className: `px-4 py-2 rounded-lg transition-colors ${
                        comparisonView === view
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`
                }, label)
            )),
            
            createElement('button', {
                key: 'create-button',
                onClick: () => setShowCreateModal(true),
                className: 'px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
            }, t.createScenario)
        ]),

        // Scenarios grid
        createElement('div', {
            key: 'scenarios-grid',
            className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        }, scenarios.map(scenario => renderScenarioCard(scenario))),

        // Comparison summary
        comparisonView === 'summary' && renderComparisonSummary(),

        // Create scenario modal
        renderCreateScenarioModal(),

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
window.ScenarioComparison = ScenarioComparison;

console.log('✅ ScenarioComparison component loaded successfully');