// Stress Test Interface Component - Advanced scenario testing for retirement planning
// Created by Yali Pollak (יהלי פולק) - v5.3.0

const StressTestInterface = ({ 
    inputs, 
    workPeriods,
    results,
    language = 'he',
    formatCurrency
}) => {
    const [activeScenario, setActiveScenario] = React.useState('baseline');
    const [customScenario, setCustomScenario] = React.useState('');
    const [stressTestResults, setStressTestResults] = React.useState(null);
    const [isCalculating, setIsCalculating] = React.useState(false);
    const [comparisonData, setComparisonData] = React.useState(null);
    const [showClaudeTranslator, setShowClaudeTranslator] = React.useState(false);

    // Content translations
    const content = {
        he: {
            title: 'מבחני עקה למשבר כלכלי',
            subtitle: 'בדוק איך התכנית שלך מתמודדת עם תרחישים שונים',
            scenarios: 'תרחישים',
            baseline: 'תרחיש בסיס',
            conservative: 'שמרני',
            optimistic: 'אופטימי',
            marketCrash: 'קריסת שוק',
            highInflation: 'אינפלציה גבוהה',
            economicStagnation: 'קיפאון כלכלי',
            customScenario: 'תרחיש מותאם',
            claudeTranslator: 'מתרגם Claude',
            translatePrompt: 'תאר תרחיש כלכלי והמערכת תתרגם אותו למבחן עקה:',
            translate: 'תרגם לתרחיש',
            runTest: 'הרץ מבחן',
            runAll: 'הרץ את כל התרחישים',
            calculating: 'מחשב...',
            results: 'תוצאות מבחן העקה',
            comparison: 'השוואת תרחישים',
            totalSavings: 'סה"כ חיסכון',
            monthlyIncome: 'הכנסה חודשית',
            difference: 'הפרש מהבסיס',
            impact: 'השפעה',
            instructions: {
                title: 'הוראות מבחני עקה',
                description: 'מבחני עקה בודקים איך התכנית שלך מתמודדת עם תרחישים כלכליים שונים.',
                tips: [
                    'תרחיש בסיס - התכנית המקורית שלך',
                    'תרחיש שמרני - תשואות נמוכות ואינפלציה גבוהה',
                    'תרחיש אופטימי - תשואות גבוהות וצמיחה כלכלית',
                    'קריסת שוק - קריסה של 35% בשוק בעוד 10 שנים',
                    'אינפלציה גבוהה - אינפלציה מתמשכת כמו בשנות ה-70',
                    'קיפאון כלכלי - צמיחה איטית ותשואות נמוכות',
                    'השתמש במתרגם Claude כדי ליצור תרחישים מותאמים'
                ]
            }
        },
        en: {
            title: 'Economic Stress Testing',
            subtitle: 'Test how your plan handles different economic scenarios',
            scenarios: 'Scenarios',
            baseline: 'Baseline',
            conservative: 'Conservative',
            optimistic: 'Optimistic',
            marketCrash: 'Market Crash',
            highInflation: 'High Inflation',
            economicStagnation: 'Economic Stagnation',
            customScenario: 'Custom Scenario',
            claudeTranslator: 'Claude Translator',
            translatePrompt: 'Describe an economic scenario and the system will translate it to a stress test:',
            translate: 'Translate to Scenario',
            runTest: 'Run Test',
            runAll: 'Run All Scenarios',
            calculating: 'Calculating...',
            results: 'Stress Test Results',
            comparison: 'Scenario Comparison',
            totalSavings: 'Total Savings',
            monthlyIncome: 'Monthly Income',
            difference: 'Difference from Baseline',
            impact: 'Impact',
            instructions: {
                title: 'Stress Testing Instructions',
                description: 'Stress tests examine how your plan performs under different economic scenarios.',
                tips: [
                    'Baseline - Your original plan',
                    'Conservative - Low returns and high inflation',
                    'Optimistic - High returns and economic growth',
                    'Market Crash - 35% market crash in 10 years',
                    'High Inflation - Persistent inflation like the 1970s',
                    'Economic Stagnation - Slow growth and low returns',
                    'Use Claude translator to create custom scenarios'
                ]
            }
        }
    };

    const t = content[language] || content.he;

    // Initialize comparison data on component mount
    React.useEffect(() => {
        if (window.generateStressTestComparison && inputs && workPeriods) {
            const comparison = window.generateStressTestComparison(inputs, workPeriods, language);
            setComparisonData(comparison);
        }
    }, [inputs, workPeriods, language]);

    // Handle scenario selection
    const handleScenarioSelect = (scenarioId) => {
        setActiveScenario(scenarioId);
        
        if (scenarioId === 'baseline') {
            setStressTestResults(results);
        } else if (comparisonData && comparisonData.scenarios[scenarioId]) {
            setStressTestResults(comparisonData.scenarios[scenarioId].results);
        }
    };

    // Handle Claude scenario translation
    const handleClaudeTranslation = () => {
        if (!window.translateClaudeScenario || !customScenario.trim()) return;
        
        setIsCalculating(true);
        
        try {
            const translatedScenario = window.translateClaudeScenario(customScenario, language);
            const testResults = window.runStressTest(inputs, workPeriods, translatedScenario);
            
            setStressTestResults(testResults);
            setActiveScenario('claude_custom');
            
            // Add to comparison data
            if (comparisonData) {
                comparisonData.scenarios.claude_custom = {
                    scenario: translatedScenario,
                    results: testResults
                };
                setComparisonData({...comparisonData});
            }
            
        } catch (error) {
            console.error('Claude translation failed:', error);
        } finally {
            setIsCalculating(false);
        }
    };

    // Handle running all scenarios
    const handleRunAllScenarios = () => {
        if (!window.generateStressTestComparison) return;
        
        setIsCalculating(true);
        
        setTimeout(() => {
            const comparison = window.generateStressTestComparison(inputs, workPeriods, language);
            setComparisonData(comparison);
            setIsCalculating(false);
        }, 1000);
    };

    // Format percentage difference
    const formatDifference = (current, baseline) => {
        if (!baseline || baseline === 0) return '0%';
        const diff = ((current - baseline) / baseline) * 100;
        const sign = diff >= 0 ? '+' : '';
        return `${sign}${diff.toFixed(1)}%`;
    };

    // Get scenario display data
    const getScenarioData = () => {
        if (!comparisonData) return null;
        
        const scenarios = [
            { id: 'baseline', name: t.baseline, data: comparisonData.baseline },
            ...Object.entries(comparisonData.scenarios).map(([id, data]) => ({
                id,
                name: window.STRESS_TEST_SCENARIOS[id]?.name[language] || t.customScenario,
                data: data
            }))
        ];
        
        return scenarios;
    };

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

        // Header
        React.createElement('div', {
            key: 'header',
            className: 'mb-6'
        }, [
            React.createElement('h2', {
                key: 'title',
                className: 'text-xl font-bold text-gray-800 mb-2'
            }, [
                React.createElement('span', { key: 'icon' }, '🧪'),
                ' ',
                t.title
            ]),
            React.createElement('p', {
                key: 'subtitle',
                className: 'text-sm text-gray-600'
            }, t.subtitle)
        ]),

        // Scenario Selection
        React.createElement('div', {
            key: 'scenario-selection',
            className: 'mb-6'
        }, [
            React.createElement('h3', {
                key: 'scenarios-title',
                className: 'font-semibold text-gray-700 mb-3'
            }, t.scenarios),
            
            React.createElement('div', {
                key: 'scenario-grid',
                className: 'grid grid-cols-2 md:grid-cols-3 gap-2'
            }, [
                React.createElement('button', {
                    key: 'baseline',
                    onClick: () => handleScenarioSelect('baseline'),
                    className: `btn-professional ${activeScenario === 'baseline' ? 'btn-primary' : 'btn-outline'} text-sm`
                }, t.baseline),
                React.createElement('button', {
                    key: 'conservative',
                    onClick: () => handleScenarioSelect('conservative'),
                    className: `btn-professional ${activeScenario === 'conservative' ? 'btn-primary' : 'btn-outline'} text-sm`
                }, t.conservative),
                React.createElement('button', {
                    key: 'optimistic',
                    onClick: () => handleScenarioSelect('optimistic'),
                    className: `btn-professional ${activeScenario === 'optimistic' ? 'btn-primary' : 'btn-outline'} text-sm`
                }, t.optimistic),
                React.createElement('button', {
                    key: 'marketCrash',
                    onClick: () => handleScenarioSelect('marketCrash'),
                    className: `btn-professional ${activeScenario === 'marketCrash' ? 'btn-primary' : 'btn-outline'} text-sm`
                }, t.marketCrash),
                React.createElement('button', {
                    key: 'highInflation',
                    onClick: () => handleScenarioSelect('highInflation'),
                    className: `btn-professional ${activeScenario === 'highInflation' ? 'btn-primary' : 'btn-outline'} text-sm`
                }, t.highInflation),
                React.createElement('button', {
                    key: 'economicStagnation',
                    onClick: () => handleScenarioSelect('economicStagnation'),
                    className: `btn-professional ${activeScenario === 'economicStagnation' ? 'btn-primary' : 'btn-outline'} text-sm`
                }, t.economicStagnation)
            ])
        ]),

        // Claude Scenario Translator
        React.createElement('div', {
            key: 'claude-translator',
            className: 'mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg'
        }, [
            React.createElement('div', {
                key: 'translator-header',
                className: 'flex items-center justify-between mb-3'
            }, [
                React.createElement('h3', {
                    key: 'translator-title',
                    className: 'font-semibold text-indigo-800'
                }, [
                    React.createElement('span', { key: 'icon' }, '🧠'),
                    ' ',
                    t.claudeTranslator
                ]),
                React.createElement('button', {
                    key: 'toggle-translator',
                    onClick: () => setShowClaudeTranslator(!showClaudeTranslator),
                    className: 'btn-professional btn-outline text-xs'
                }, showClaudeTranslator ? '▼' : '▶')
            ]),
            
            showClaudeTranslator && React.createElement('div', {
                key: 'translator-content',
                className: 'space-y-3'
            }, [
                React.createElement('p', {
                    key: 'translator-prompt',
                    className: 'text-sm text-indigo-700'
                }, t.translatePrompt),
                React.createElement('textarea', {
                    key: 'scenario-input',
                    value: customScenario,
                    onChange: (e) => setCustomScenario(e.target.value),
                    placeholder: language === 'he' ? 
                        'לדוגמה: "מלחמה עולמית שלישית עם אינפלציה של 15% וקריסת שוק של 50%"' :
                        'Example: "Third world war with 15% inflation and 50% market crash"',
                    className: 'w-full p-3 border border-indigo-300 rounded-lg text-sm resize-none',
                    rows: 3
                }),
                React.createElement('button', {
                    key: 'translate-btn',
                    onClick: handleClaudeTranslation,
                    disabled: isCalculating || !customScenario.trim(),
                    className: 'btn-professional btn-primary text-sm disabled:opacity-50'
                }, isCalculating ? t.calculating : t.translate)
            ])
        ]),

        // Control Buttons
        React.createElement('div', {
            key: 'controls',
            className: 'mb-6 flex gap-3'
        }, [
            React.createElement('button', {
                key: 'run-all',
                onClick: handleRunAllScenarios,
                disabled: isCalculating,
                className: 'btn-professional btn-primary disabled:opacity-50'
            }, isCalculating ? t.calculating : t.runAll)
        ]),

        // Results Display
        stressTestResults && React.createElement('div', {
            key: 'results',
            className: 'mt-6'
        }, [
            React.createElement('h3', {
                key: 'results-title',
                className: 'font-semibold text-gray-700 mb-4'
            }, t.results + ' - ' + (
                stressTestResults.scenarioName?.[language] || 
                window.STRESS_TEST_SCENARIOS[activeScenario]?.name[language] || 
                t.baseline
            )),
            
            React.createElement('div', {
                key: 'results-grid',
                className: 'grid grid-cols-1 md:grid-cols-2 gap-4'
            }, [
                React.createElement('div', {
                    key: 'total-savings',
                    className: 'p-4 bg-white border border-gray-200 rounded-lg'
                }, [
                    React.createElement('div', {
                        key: 'savings-label',
                        className: 'text-sm font-medium text-gray-600'
                    }, t.totalSavings),
                    React.createElement('div', {
                        key: 'savings-value',
                        className: 'text-2xl font-bold text-green-600'
                    }, formatCurrency ? formatCurrency(stressTestResults.totalSavings) : `₪${stressTestResults.totalSavings?.toLocaleString()}`)
                ]),
                React.createElement('div', {
                    key: 'monthly-income',
                    className: 'p-4 bg-white border border-gray-200 rounded-lg'
                }, [
                    React.createElement('div', {
                        key: 'income-label',
                        className: 'text-sm font-medium text-gray-600'
                    }, t.monthlyIncome),
                    React.createElement('div', {
                        key: 'income-value',
                        className: 'text-2xl font-bold text-blue-600'
                    }, formatCurrency ? formatCurrency(stressTestResults.monthlyIncome) : `₪${stressTestResults.monthlyIncome?.toLocaleString()}`)
                ])
            ])
        ]),

        // Scenario Comparison Table
        comparisonData && React.createElement('div', {
            key: 'comparison',
            className: 'mt-6'
        }, [
            React.createElement('h3', {
                key: 'comparison-title',
                className: 'font-semibold text-gray-700 mb-4'
            }, t.comparison),
            
            React.createElement('div', {
                key: 'comparison-table',
                className: 'overflow-x-auto'
            }, [
                React.createElement('table', {
                    key: 'table',
                    className: 'w-full border border-gray-200 rounded-lg'
                }, [
                    React.createElement('thead', {
                        key: 'table-head',
                        className: 'bg-gray-50'
                    }, [
                        React.createElement('tr', { key: 'header-row' }, [
                            React.createElement('th', {
                                key: 'scenario-header',
                                className: 'px-4 py-2 text-left text-sm font-medium text-gray-600'
                            }, t.scenarios),
                            React.createElement('th', {
                                key: 'savings-header',
                                className: 'px-4 py-2 text-left text-sm font-medium text-gray-600'
                            }, t.totalSavings),
                            React.createElement('th', {
                                key: 'income-header',
                                className: 'px-4 py-2 text-left text-sm font-medium text-gray-600'
                            }, t.monthlyIncome),
                            React.createElement('th', {
                                key: 'difference-header',
                                className: 'px-4 py-2 text-left text-sm font-medium text-gray-600'
                            }, t.difference)
                        ])
                    ]),
                    React.createElement('tbody', {
                        key: 'table-body'
                    }, getScenarioData()?.map((scenario, index) => 
                        React.createElement('tr', {
                            key: scenario.id,
                            className: `border-t border-gray-200 ${scenario.id === activeScenario ? 'bg-indigo-50' : 'hover:bg-gray-50'}`
                        }, [
                            React.createElement('td', {
                                key: 'name',
                                className: 'px-4 py-3 text-sm font-medium text-gray-800'
                            }, scenario.name),
                            React.createElement('td', {
                                key: 'savings',
                                className: 'px-4 py-3 text-sm text-gray-600'
                            }, formatCurrency ? formatCurrency(scenario.data.results?.totalSavings) : `₪${scenario.data.results?.totalSavings?.toLocaleString()}`),
                            React.createElement('td', {
                                key: 'income',
                                className: 'px-4 py-3 text-sm text-gray-600'
                            }, formatCurrency ? formatCurrency(scenario.data.results?.monthlyIncome) : `₪${scenario.data.results?.monthlyIncome?.toLocaleString()}`),
                            React.createElement('td', {
                                key: 'difference',
                                className: `px-4 py-3 text-sm font-medium ${
                                    scenario.id === 'baseline' ? 'text-gray-500' :
                                    (scenario.data.results?.totalSavings || 0) >= (comparisonData.baseline.results?.totalSavings || 0) ? 'text-green-600' : 'text-red-600'
                                }`
                            }, scenario.id === 'baseline' ? '-' : formatDifference(scenario.data.results?.totalSavings, comparisonData.baseline.results?.totalSavings))
                        ])
                    ))
                ])
            ])
        ])
    ]);
};

// Export to window for global access
window.StressTestInterface = StressTestInterface;