// Scenarios & Stress Testing Module - Dynamic Module for risk scenarios and stress testing
// Comprehensive scenario modeling and stress testing for retirement planning

(function() {
    'use strict';

    // Icon Components
    const Target = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '🎯');

    const AlertTriangle = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '⚠️');

    const TrendingDown = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '📉');

    const Shield = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '🛡️');

    // Currency formatting utility
    const formatCurrency = (amount) => {
        if (amount >= 1000000) {
            return `₪${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `₪${(amount / 1000).toFixed(0)}K`;
        } else {
            return `₪${Math.round(amount).toLocaleString()}`;
        }
    };

    // Scenarios & Stress Testing Component
    const ScenariosStress = ({ inputs, setInputs, language, t }) => {
        
        // Risk scenarios definitions
        const riskScenarios = {
            conservative: {
                name: { 
                    he: 'שמרני',
                    en: 'Conservative'
                },
                multiplier: 0.7,
                description: { 
                    he: 'השקעה בטוחה עם תשואות נמוכות יחסית',
                    en: 'Safe investment with relatively low returns'
                },
                color: 'blue'
            },
            moderate: {
                name: { 
                    he: 'מתון',
                    en: 'Moderate'
                },
                multiplier: 1.0,
                description: { 
                    he: 'איזון בין סיכון לתשואה',
                    en: 'Balance between risk and return'
                },
                color: 'green'
            },
            aggressive: {
                name: { 
                    he: 'אגרסיבי',
                    en: 'Aggressive'
                },
                multiplier: 1.4,
                description: { 
                    he: 'השקעה בסיכון גבוה עם פוטנציאל לתשואות גבוהות',
                    en: 'High-risk investment with potential for high returns'
                },
                color: 'red'
            }
        };

        // Economic crisis scenarios
        const crisisScenarios = {
            mild: {
                name: { 
                    he: 'משבר קל',
                    en: 'Mild Crisis'
                },
                returnReduction: 0.15, // 15% reduction
                duration: 2, // years
                description: { 
                    he: 'משבר כלכלי קל עם השפעה מוגבלת על התשואות',
                    en: 'Mild economic crisis with limited impact on returns'
                }
            },
            moderate: {
                name: { 
                    he: 'משבר בינוני',
                    en: 'Moderate Crisis'
                },
                returnReduction: 0.30, // 30% reduction
                duration: 3, // years
                description: { 
                    he: 'משבר כלכלי בינוני עם השפעה משמעותית על השווקים',
                    en: 'Moderate economic crisis with significant market impact'
                }
            },
            severe: {
                name: { 
                    he: 'משבר חמור',
                    en: 'Severe Crisis'
                },
                returnReduction: 0.50, // 50% reduction
                duration: 5, // years
                description: { 
                    he: 'משבר כלכלי חמור דומה למשבר 2008 או קורונה',
                    en: 'Severe economic crisis similar to 2008 or Corona crisis'
                }
            }
        };

        // Calculate stress test results
        const calculateStressTest = (scenario) => {
            const yearsToRetirement = (inputs.retirementAge || 67) - (inputs.currentAge || 30);
            const monthlyContribution = (inputs.currentMonthlySalary || 15000) * 0.186; // 18.6% pension contribution
            const annualContribution = monthlyContribution * 12;
            
            const baseReturn = (inputs.expectedReturn || 7) / 100;
            const crisisReturn = baseReturn * (1 - scenario.returnReduction);
            
            let totalAccumulation = inputs.currentSavings || 50000;
            
            // Simulate year by year with crisis impact
            for (let year = 1; year <= yearsToRetirement; year++) {
                const currentReturn = year <= scenario.duration ? crisisReturn : baseReturn;
                totalAccumulation = totalAccumulation * (1 + currentReturn) + annualContribution;
            }
            
            const monthlyIncome = totalAccumulation * (baseReturn) / 12;
            const reductionPercent = ((totalAccumulation - calculateNormalScenario()) / calculateNormalScenario() * 100);
            
            return {
                totalAccumulation: Math.round(totalAccumulation),
                monthlyIncome: Math.round(monthlyIncome),
                reductionPercent: Math.round(reductionPercent)
            };
        };

        // Calculate normal scenario for comparison
        const calculateNormalScenario = () => {
            const yearsToRetirement = (inputs.retirementAge || 67) - (inputs.currentAge || 30);
            const monthlyContribution = (inputs.currentMonthlySalary || 15000) * 0.186;
            const annualContribution = monthlyContribution * 12;
            const baseReturn = (inputs.expectedReturn || 7) / 100;
            
            return (inputs.currentSavings || 50000) * Math.pow(1 + baseReturn, yearsToRetirement) +
                   annualContribution * (Math.pow(1 + baseReturn, yearsToRetirement) - 1) / baseReturn;
        };

        // Generate chart data for crisis timeline
        const generateCrisisChartData = (scenario) => {
            const yearsToRetirement = (inputs.retirementAge || 67) - (inputs.currentAge || 30);
            const data = [];
            
            let normalAccumulation = inputs.currentSavings || 50000;
            let crisisAccumulation = inputs.currentSavings || 50000;
            const monthlyContribution = (inputs.currentMonthlySalary || 15000) * 0.186;
            const annualContribution = monthlyContribution * 12;
            const baseReturn = (inputs.expectedReturn || 7) / 100;
            const crisisReturn = baseReturn * (1 - scenario.returnReduction);
            
            for (let year = 0; year <= yearsToRetirement; year++) {
                if (year > 0) {
                    normalAccumulation = normalAccumulation * (1 + baseReturn) + annualContribution;
                    const currentReturn = year <= scenario.duration ? crisisReturn : baseReturn;
                    crisisAccumulation = crisisAccumulation * (1 + currentReturn) + annualContribution;
                }
                
                data.push({
                    age: (inputs.currentAge || 30) + year,
                    normalAccumulation: Math.round(normalAccumulation),
                    stressedAccumulation: Math.round(crisisAccumulation)
                });
            }
            
            return data;
        };

        // State for selected crisis scenario
        const [selectedCrisisScenario, setSelectedCrisisScenario] = React.useState('moderate');
        const [showChart, setShowChart] = React.useState(false);

        const currentCrisis = crisisScenarios[selectedCrisisScenario];
        const stressResults = calculateStressTest(currentCrisis);
        const normalResults = calculateNormalScenario();

        return React.createElement('div', { className: "space-y-6" }, [
            
            // Risk Scenarios Section
            React.createElement('div', { 
                key: 'risk-scenarios',
                className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in" 
            }, [
                React.createElement('h2', { 
                    key: 'title',
                    className: "text-2xl font-bold text-green-700 mb-6 flex items-center" 
                }, [
                    React.createElement(Target, { key: 'icon', className: "mr-2" }),
                    language === 'he' ? 'תרחישי סיכון' : 'Risk Scenarios'
                ]),
                React.createElement('p', {
                    key: 'description',
                    className: "text-gray-600 mb-4"
                }, language === 'he' ? 
                    'בחר את רמת הסיכון המתאימה לך כדי לראות איך היא משפיעה על תוכנית הפרישה שלך' :
                    'Choose your appropriate risk level to see how it affects your retirement plan'
                ),
                React.createElement('div', { 
                    key: 'scenarios',
                    className: "grid md:grid-cols-3 gap-4" 
                }, Object.entries(riskScenarios).map(([key, scenario]) =>
                    React.createElement('div', {
                        key: key,
                        className: `p-4 rounded-xl border-2 transition-all cursor-pointer ${
                            (inputs.riskTolerance || 'moderate') === key 
                                ? `border-${scenario.color}-500 bg-${scenario.color}-50` 
                                : 'border-gray-200 bg-white hover:border-gray-300'
                        }`,
                        onClick: () => setInputs({...inputs, riskTolerance: key})
                    }, [
                        React.createElement('h3', { 
                            key: 'name',
                            className: "font-bold text-lg text-gray-800 mb-2" 
                        }, scenario.name[language]),
                        React.createElement('p', { 
                            key: 'multiplier',
                            className: "text-gray-600 mb-3" 
                        }, language === 'he' ? `מכפיל תשואה: ${scenario.multiplier}x` : `Return multiplier: ${scenario.multiplier}x`),
                        React.createElement('div', { 
                            key: 'description',
                            className: "text-sm text-gray-500" 
                        }, scenario.description[language])
                    ])
                ))
            ]),

            // Stress Testing Section
            React.createElement('div', { 
                key: 'stress-testing',
                className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in" 
            }, [
                React.createElement('h2', { 
                    key: 'title',
                    className: "text-2xl font-bold text-red-700 mb-6 flex items-center" 
                }, [
                    React.createElement(AlertTriangle, { key: 'icon', className: "mr-2" }),
                    language === 'he' ? 'מבחני עמידות' : 'Stress Tests'
                ]),
                React.createElement('p', {
                    key: 'description',
                    className: "text-gray-600 mb-4"
                }, language === 'he' ? 
                    'בדוק איך תוכנית הפרישה שלך תתמודד עם משברים כלכליים שונים' :
                    'Test how your retirement plan would handle different economic crises'
                ),
                
                // Crisis Scenario Selection
                React.createElement('div', { 
                    key: 'crisis-selection',
                    className: "mb-6" 
                }, [
                    React.createElement('h3', { 
                        key: 'title',
                        className: "text-lg font-semibold text-gray-800 mb-3" 
                    }, language === 'he' ? 'בחר תרחיש משבר:' : 'Select Crisis Scenario:'),
                    React.createElement('div', { 
                        key: 'options',
                        className: "grid md:grid-cols-3 gap-3" 
                    }, Object.entries(crisisScenarios).map(([key, scenario]) =>
                        React.createElement('button', {
                            key: key,
                            className: `p-3 rounded-lg border-2 transition-all text-left ${
                                selectedCrisisScenario === key 
                                    ? 'border-red-500 bg-red-50 text-red-700' 
                                    : 'border-gray-200 bg-white hover:border-red-300'
                            }`,
                            onClick: () => setSelectedCrisisScenario(key)
                        }, [
                            React.createElement('div', { 
                                key: 'name',
                                className: "font-semibold" 
                            }, scenario.name[language]),
                            React.createElement('div', { 
                                key: 'impact',
                                className: "text-sm opacity-75" 
                            }, `${Math.round(scenario.returnReduction * 100)}% ${language === 'he' ? 'ירידה' : 'reduction'} • ${scenario.duration} ${language === 'he' ? 'שנים' : 'years'}`)
                        ])
                    ))
                ]),

                // Stress Test Results
                React.createElement('div', { 
                    key: 'results',
                    className: "grid md:grid-cols-2 gap-6" 
                }, [
                    // Normal Scenario
                    React.createElement('div', { 
                        key: 'normal',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('h4', { 
                            key: 'title',
                            className: "font-semibold text-green-800 mb-2 flex items-center" 
                        }, [
                            React.createElement(Shield, { key: 'icon', className: "mr-2" }),
                            language === 'he' ? 'תרחיש רגיל' : 'Normal Scenario'
                        ]),
                        React.createElement('div', { 
                            key: 'amount',
                            className: "text-2xl font-bold text-green-700 currency-format" 
                        }, formatCurrency(normalResults)),
                        React.createElement('div', { 
                            key: 'description',
                            className: "text-sm text-green-600" 
                        }, language === 'he' ? 'צבירה צפויה בגיל פרישה' : 'Expected accumulation at retirement age')
                    ]),
                    
                    // Crisis Scenario
                    React.createElement('div', { 
                        key: 'crisis',
                        className: "bg-red-50 rounded-lg p-4 border border-red-200" 
                    }, [
                        React.createElement('h4', { 
                            key: 'title',
                            className: "font-semibold text-red-800 mb-2 flex items-center" 
                        }, [
                            React.createElement(TrendingDown, { key: 'icon', className: "mr-2" }),
                            currentCrisis.name[language]
                        ]),
                        React.createElement('div', { 
                            key: 'amount',
                            className: "text-2xl font-bold text-red-700 currency-format" 
                        }, formatCurrency(stressResults.totalAccumulation)),
                        React.createElement('div', { 
                            key: 'reduction',
                            className: "text-sm text-red-600" 
                        }, `${stressResults.reductionPercent}% ${language === 'he' ? 'פחות מהתרחיש הרגיל' : 'less than normal scenario'}`),
                        React.createElement('div', { 
                            key: 'description',
                            className: "text-xs text-gray-500 mt-1" 
                        }, currentCrisis.description[language])
                    ])
                ]),

                // Chart Toggle
                React.createElement('div', { 
                    key: 'chart-toggle',
                    className: "mt-6 text-center" 
                }, [
                    React.createElement('button', {
                        key: 'toggle-btn',
                        onClick: () => setShowChart(!showChart),
                        className: "px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    }, showChart ? 
                        (language === 'he' ? 'הסתר גרף השוואה' : 'Hide Comparison Chart') :
                        (language === 'he' ? 'הצג גרף השוואה' : 'Show Comparison Chart')
                    )
                ])
            ]),

            // Scenario Timeline Visualization
            React.createElement('div', { 
                key: 'scenario-timeline',
                className: "financial-card p-6 animate-slide-up" 
            }, [
                React.createElement('h3', { 
                    key: 'title',
                    className: "text-xl font-bold text-indigo-700 mb-4 flex items-center" 
                }, [
                    React.createElement('span', { key: 'icon', className: "mr-2" }, '📅'),
                    language === 'he' ? 'ציר זמן השפעת התרחיש' : 'Scenario Impact Timeline'
                ]),
                React.createElement('div', { 
                    key: 'timeline-content',
                    className: "space-y-4" 
                }, [
                    // Timeline visualization
                    React.createElement('div', { 
                        key: 'timeline',
                        className: "relative" 
                    }, [
                        // Timeline track
                        React.createElement('div', { 
                            className: "absolute left-0 top-6 w-full h-2 bg-gray-200 rounded" 
                        }),
                        
                        // Crisis period indicator
                        React.createElement('div', { 
                            className: "absolute left-0 top-6 h-2 bg-red-400 rounded",
                            style: { 
                                width: `${(currentCrisis.duration / ((inputs.retirementAge || 67) - (inputs.currentAge || 30))) * 100}%` 
                            }
                        }),
                        
                        // Timeline labels
                        React.createElement('div', { 
                            className: "flex justify-between items-start pt-10" 
                        }, [
                            React.createElement('div', { 
                                key: 'start',
                                className: "text-center" 
                            }, [
                                React.createElement('div', { 
                                    className: "w-4 h-4 bg-blue-500 rounded-full mx-auto mb-1 relative -top-6" 
                                }),
                                React.createElement('div', { className: "text-sm font-medium" }, 
                                    language === 'he' ? 'התחלה' : 'Start'),
                                React.createElement('div', { className: "text-xs text-gray-500" }, 
                                    `${language === 'he' ? 'גיל' : 'Age'} ${inputs.currentAge || 30}`)
                            ]),
                            
                            React.createElement('div', { 
                                key: 'crisis-end',
                                className: "text-center",
                                style: { 
                                    marginLeft: `${(currentCrisis.duration / ((inputs.retirementAge || 67) - (inputs.currentAge || 30))) * 100 - 10}%` 
                                }
                            }, [
                                React.createElement('div', { 
                                    className: "w-4 h-4 bg-red-500 rounded-full mx-auto mb-1 relative -top-6" 
                                }),
                                React.createElement('div', { className: "text-sm font-medium text-red-600" }, 
                                    language === 'he' ? 'סוף משבר' : 'Crisis Ends'),
                                React.createElement('div', { className: "text-xs text-red-500" }, 
                                    `${currentCrisis.duration} ${language === 'he' ? 'שנים' : 'years'}`)
                            ]),
                            
                            React.createElement('div', { 
                                key: 'retirement',
                                className: "text-center" 
                            }, [
                                React.createElement('div', { 
                                    className: "w-4 h-4 bg-green-500 rounded-full mx-auto mb-1 relative -top-6" 
                                }),
                                React.createElement('div', { className: "text-sm font-medium" }, 
                                    language === 'he' ? 'פרישה' : 'Retirement'),
                                React.createElement('div', { className: "text-xs text-gray-500" }, 
                                    `${language === 'he' ? 'גיל' : 'Age'} ${inputs.retirementAge || 67}`)
                            ])
                        ])
                    ]),
                    
                    // Impact phases explanation
                    React.createElement('div', { 
                        key: 'phases',
                        className: "grid grid-cols-1 md:grid-cols-3 gap-4 mt-6" 
                    }, [
                        React.createElement('div', { 
                            key: 'crisis-phase',
                            className: "metric-card metric-warning p-4" 
                        }, [
                            React.createElement('h4', { 
                                className: "font-semibold text-red-700 mb-2 flex items-center" 
                            }, [
                                React.createElement('span', { key: 'icon', className: "mr-2" }, '⚠️'),
                                language === 'he' ? 'שלב המשבר' : 'Crisis Phase'
                            ]),
                            React.createElement('div', { className: "text-sm space-y-1" }, [
                                React.createElement('div', {}, 
                                    `${language === 'he' ? 'משך:' : 'Duration:'} ${currentCrisis.duration} ${language === 'he' ? 'שנים' : 'years'}`),
                                React.createElement('div', {}, 
                                    `${language === 'he' ? 'ירידה בתשואה:' : 'Return reduction:'} ${Math.round(currentCrisis.returnReduction * 100)}%`),
                                React.createElement('div', { className: "text-red-600" }, 
                                    language === 'he' ? 'השפעה שלילית על צבירה' : 'Negative impact on accumulation')
                            ])
                        ]),
                        
                        React.createElement('div', { 
                            key: 'recovery-phase',
                            className: "metric-card metric-neutral p-4" 
                        }, [
                            React.createElement('h4', { 
                                className: "font-semibold text-blue-700 mb-2 flex items-center" 
                            }, [
                                React.createElement('span', { key: 'icon', className: "mr-2" }, '🔄'),
                                language === 'he' ? 'שלב ההתאוששות' : 'Recovery Phase'
                            ]),
                            React.createElement('div', { className: "text-sm space-y-1" }, [
                                React.createElement('div', {}, 
                                    `${language === 'he' ? 'משך:' : 'Duration:'} ${((inputs.retirementAge || 67) - (inputs.currentAge || 30)) - currentCrisis.duration} ${language === 'he' ? 'שנים' : 'years'}`),
                                React.createElement('div', {}, 
                                    `${language === 'he' ? 'תשואה רגילה:' : 'Normal return:'} ${inputs.expectedReturn || 7}%`),
                                React.createElement('div', { className: "text-blue-600" }, 
                                    language === 'he' ? 'חזרה לתשואות רגילות' : 'Return to normal yields')
                            ])
                        ]),
                        
                        React.createElement('div', { 
                            key: 'final-impact',
                            className: "metric-card metric-positive p-4" 
                        }, [
                            React.createElement('h4', { 
                                className: "font-semibold text-green-700 mb-2 flex items-center" 
                            }, [
                                React.createElement('span', { key: 'icon', className: "mr-2" }, '📊'),
                                language === 'he' ? 'השפעה סופית' : 'Final Impact'
                            ]),
                            React.createElement('div', { className: "text-sm space-y-1" }, [
                                React.createElement('div', {}, 
                                    `${language === 'he' ? 'הפסד כולל:' : 'Total loss:'} ${Math.abs(stressResults.reductionPercent)}%`),
                                React.createElement('div', {}, 
                                    `${language === 'he' ? 'צבירה במשבר:' : 'Crisis accumulation:'} ${formatCurrency(stressResults.totalAccumulation)}`),
                                React.createElement('div', { className: stressResults.reductionPercent < -10 ? "text-red-600" : "text-yellow-600" }, 
                                    stressResults.reductionPercent < -10 ? 
                                        (language === 'he' ? 'השפעה משמעותית' : 'Significant impact') :
                                        (language === 'he' ? 'השפעה מתונה' : 'Moderate impact'))
                            ])
                        ])
                    ])
                ])
            ]),

            // Crisis Timeline Chart
            showChart && React.createElement('div', { 
                key: 'crisis-chart',
                className: "financial-card p-6 animate-slide-up" 
            }, [
                React.createElement('h3', { 
                    key: 'title',
                    className: "text-xl font-bold text-purple-700 mb-4" 
                }, language === 'he' ? 'השוואת תרחישים לאורך זמן' : 'Scenario Comparison Over Time'),
                React.createElement('div', { 
                    key: 'chart-container',
                    className: "h-96 relative" 
                }, [
                    React.createElement('canvas', { 
                        key: 'chart',
                        ref: (ref) => {
                            if (ref && window.Chart) {
                                const ctx = ref.getContext('2d');
                                const chartData = generateCrisisChartData(currentCrisis);
                                
                                // Destroy existing chart if any
                                if (ref.chartInstance) {
                                    ref.chartInstance.destroy();
                                }
                                
                                ref.chartInstance = new Chart(ctx, {
                                    type: 'line',
                                    data: {
                                        labels: chartData.map(d => language === 'he' ? `גיל ${d.age}` : `Age ${d.age}`),
                                        datasets: [
                                            {
                                                label: language === 'he' ? 'תרחיש רגיל' : 'Normal Scenario',
                                                data: chartData.map(d => d.normalAccumulation),
                                                borderColor: 'rgb(34, 197, 94)',
                                                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                                fill: false,
                                                tension: 0.4,
                                                borderWidth: 3
                                            },
                                            {
                                                label: currentCrisis.name[language],
                                                data: chartData.map(d => d.stressedAccumulation),
                                                borderColor: 'rgb(239, 68, 68)',
                                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                                fill: false,
                                                tension: 0.4,
                                                borderWidth: 3,
                                                borderDash: [5, 5]
                                            }
                                        ]
                                    },
                                    options: {
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: language === 'he' ? 'השוואת צבירה: רגיל מול משבר' : 'Accumulation Comparison: Normal vs Crisis'
                                            },
                                            legend: {
                                                display: true,
                                                position: 'top'
                                            }
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                ticks: {
                                                    callback: function(value) {
                                                        if (value >= 1000000) {
                                                            return '₪' + (value / 1000000).toFixed(1) + 'M';
                                                        } else if (value >= 1000) {
                                                            return '₪' + (value / 1000).toFixed(0) + 'K';
                                                        }
                                                        return '₪' + value.toFixed(0);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    })
                ])
            ])
        ]);
    };

    // Export to global window object
    window.ScenariosStress = ScenariosStress;
    
    console.log('✅ Scenarios & Stress Testing module loaded successfully');

})();