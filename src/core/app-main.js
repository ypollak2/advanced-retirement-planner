// Core Application - Advanced Retirement Planner
// Core application with basic components and dynamic loading

(function() {
    'use strict';

    // Icon Components - Simple icon components
    const Calculator = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '📊');

    const TrendingUp = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '📈');

    const DollarSign = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '💰');

    const PiggyBank = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '🏛️');

    const Target = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '🎯');

    const AlertCircle = ({ size = 16, className = "" }) => React.createElement('span', { 
        className: className + " inline-flex items-center justify-center", 
        style: { fontSize: `${size}px` } 
    }, '⚠️');

    // Basic Chart Component - Simple chart component
    const SimpleChart = ({ data, type = 'line', language = 'he' }) => {
        const chartRef = React.useRef(null);
        const chartInstance = React.useRef(null);
        
        React.useEffect(() => {
            if (chartRef.current && data && data.length > 0) {
                const ctx = chartRef.current.getContext('2d');
                
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }
                
                const isHebrew = language === 'he';
                
                const chartData = {
                    labels: data.map(d => isHebrew ? `גיל ${d.age}` : `Age ${d.age}`),
                    datasets: [{
                        label: isHebrew ? 'צבירה כוללת' : 'Total Accumulation',
                        data: data.map(d => d.totalSavings || d.value),
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        fill: false,
                        tension: 0.4,
                        borderWidth: 3
                    }]
                };
                
                const config = {
                    type: 'line',
                    data: chartData,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            title: {
                                display: true,
                                text: isHebrew ? 'התפתחות הצבירה לאורך השנים' : 'Accumulation Progress Over Years'
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
                };
                
                chartInstance.current = new Chart(ctx, config);
            }
            
            return () => {
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }
            };
        }, [data, type, language]);
        
        return React.createElement('canvas', { 
            ref: chartRef,
            style: { maxHeight: '400px' }
        });
    };

    // Basic Inputs Component - Basic input form
    const BasicInputs = ({ inputs, setInputs, language, t }) => {
        return React.createElement('div', { className: "space-y-6" }, [
            // Basic Data Section
            React.createElement('div', { 
                key: 'basic-data',
                className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in" 
            }, [
                React.createElement('h2', { 
                    key: 'title',
                    className: "text-2xl font-bold text-purple-700 mb-6 flex items-center" 
                }, [
                    React.createElement(Calculator, { key: 'icon', className: "mr-2" }),
                    t.basic || 'Basic Information'
                ]),
                React.createElement('div', { 
                    key: 'content',
                    className: "space-y-4" 
                }, [
                    React.createElement('div', { 
                        key: 'row1',
                        className: "grid grid-cols-2 gap-4" 
                    }, [
                        React.createElement('div', { key: 'age' }, [
                            React.createElement('label', { 
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.currentAge || 'Current Age'),
                            React.createElement('input', {
                                type: 'number',
                                value: inputs.currentAge,
                                onChange: (e) => setInputs({...inputs, currentAge: parseInt(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            })
                        ]),
                        React.createElement('div', { key: 'retirement' }, [
                            React.createElement('label', { 
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.retirementAge || 'Retirement Age'),
                            React.createElement('input', {
                                type: 'number',
                                value: inputs.retirementAge,
                                onChange: (e) => setInputs({...inputs, retirementAge: parseInt(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            })
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'row2',
                        className: "grid grid-cols-2 gap-4" 
                    }, [
                        React.createElement('div', { key: 'savings' }, [
                            React.createElement('label', { 
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, language === 'he' ? "חיסכון נוכחי בפנסיה (₪)" : "Current Pension Savings (₪)"),
                            React.createElement('input', {
                                type: 'number',
                                value: inputs.currentSavings,
                                onChange: (e) => setInputs({...inputs, currentSavings: parseInt(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            })
                        ]),
                        React.createElement('div', { key: 'salary' }, [
                            React.createElement('label', { 
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, language === 'he' ? "משכורת חודשית (₪)" : "Monthly Salary (₪)"),
                            React.createElement('input', {
                                type: 'number',
                                value: inputs.currentMonthlySalary || 15000,
                                onChange: (e) => setInputs({...inputs, currentMonthlySalary: parseInt(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            })
                        ])
                    ])
                ])
            ])
        ]);
    };

    // Basic Results Component - Basic results display
    const BasicResults = ({ results, language, t }) => {
        if (!results) return null;

        return React.createElement('div', { className: "space-y-4" }, [
            React.createElement('div', { 
                key: 'results',
                className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in" 
            }, [
                React.createElement('h2', { 
                    key: 'title',
                    className: "text-2xl font-bold text-green-700 mb-6 flex items-center" 
                }, [
                    React.createElement(Target, { key: 'icon', className: "mr-2" }),
                    language === 'he' ? 'תוצאות חישוב' : 'Calculation Results'
                ]),
                React.createElement('div', { 
                    key: 'content',
                    className: "space-y-4" 
                }, [
                    React.createElement('div', { 
                        key: 'total',
                        className: "bg-green-50 rounded-lg p-4 border border-green-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-green-700" }, [
                            React.createElement('strong', null, language === 'he' ? "צבירה כוללת צפויה:" : "Total Expected Accumulation:"),
                            React.createElement('div', { className: "text-2xl font-bold text-green-800 mt-1" }, 
                                `₪${(results.totalSavings || 0).toLocaleString()}`)
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'monthly',
                        className: "bg-blue-50 rounded-lg p-4 border border-blue-200" 
                    }, [
                        React.createElement('div', { className: "text-sm text-blue-700" }, [
                            React.createElement('strong', null, language === 'he' ? "הכנסה חודשית בפרישה:" : "Monthly Retirement Income:"),
                            React.createElement('div', { className: "text-2xl font-bold text-blue-800 mt-1" }, 
                                `₪${(results.monthlyIncome || 0).toLocaleString()}`)
                        ])
                    ])
                ])
            ])
        ]);
    };

    // Loading Component - Loading indicator component
    const LoadingComponent = ({ message }) => {
        return React.createElement('div', { 
            className: "flex items-center justify-center py-8" 
        }, [
            React.createElement('div', { 
                key: 'spinner',
                className: "animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mr-3" 
            }),
            React.createElement('span', { 
                key: 'text',
                className: "text-purple-600 font-semibold" 
            }, message || 'Loading...')
        ]);
    };

    // Main Application Component - Main application component
    const RetirementPlannerCore = () => {
        // State management
        const [language, setLanguage] = React.useState('he');
        const [activeTab, setActiveTab] = React.useState('basic');
        const [inputs, setInputs] = React.useState({
            currentAge: 30,
            retirementAge: 67,
            currentSavings: 50000,
            currentMonthlySalary: 15000,
            inflationRate: 3,
            expectedReturn: 7
        });
        const [results, setResults] = React.useState(null);
        const [loadingTabs, setLoadingTabs] = React.useState({});

        // Basic calculation function
        const calculateBasic = () => {
            const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
            const monthlyContribution = inputs.currentMonthlySalary * 0.186; // 18.6% pension contribution
            const annualContribution = monthlyContribution * 12;
            
            // Simple compound interest calculation
            const futureValue = inputs.currentSavings * Math.pow(1 + inputs.expectedReturn/100, yearsToRetirement) +
                annualContribution * (Math.pow(1 + inputs.expectedReturn/100, yearsToRetirement) - 1) / (inputs.expectedReturn/100);
            
            const monthlyIncome = futureValue * (inputs.expectedReturn/100) / 12;
            
            setResults({
                totalSavings: Math.round(futureValue),
                monthlyIncome: Math.round(monthlyIncome),
                achievesTarget: monthlyIncome > (inputs.currentMonthlySalary * 0.75)
            });
        };

        // Tab click handler with dynamic loading
        const handleTabClick = async (tabName) => {
            if (tabName === 'basic') {
                setActiveTab(tabName);
                return;
            }

            // Load advanced modules dynamically
            setLoadingTabs(prev => ({...prev, [tabName]: true}));
            
            try {
                let moduleLoaded = false;
                
                switch(tabName) {
                    case 'advanced':
                        await window.moduleLoader.loadAdvancedTab();
                        moduleLoaded = true;
                        break;
                    case 'analysis':
                        await window.moduleLoader.loadAnalysisTab();
                        moduleLoaded = true;
                        break;
                    case 'scenarios':
                        await window.moduleLoader.loadScenariosTab();
                        moduleLoaded = true;
                        break;
                    case 'fire':
                        await window.moduleLoader.loadFireTab();
                        moduleLoaded = true;
                        break;
                    case 'stress':
                        await window.moduleLoader.loadStressTestTab();
                        moduleLoaded = true;
                        break;
                }

                if (moduleLoaded) {
                    setActiveTab(tabName);
                }
                
            } catch (error) {
                console.error(`Failed to load ${tabName} module:`, error);
                alert(`שגיאה בטעינת המודול ${tabName}. אנא נסה שוב.`);
            } finally {
                setLoadingTabs(prev => ({...prev, [tabName]: false}));
            }
        };

        // Translations - Basic translations
        const t = {
            he: {
                title: 'מתכנן הפרישה המתקדם',
                subtitle: 'כלי מקצועי לתכנון פנסיה',
                basic: 'בסיסי',
                advanced: 'מתקדם', 
                analysis: 'אנליזה',
                scenarios: 'תרחישים',
                fire: 'FIRE',
                stress: 'בדיקות לחץ',
                calculate: 'חשב',
                currentAge: 'גיל נוכחי',
                retirementAge: 'גיל פרישה'
            },
            en: {
                title: 'Advanced Retirement Planner',
                subtitle: 'Professional Pension Planning Tool',
                basic: 'Basic',
                advanced: 'Advanced',
                analysis: 'Analysis', 
                scenarios: 'Scenarios',
                fire: 'FIRE',
                stress: 'Stress Tests',
                calculate: 'Calculate',
                currentAge: 'Current Age',
                retirementAge: 'Retirement Age'
            }
        };

        const currentT = t[language];

        return React.createElement('div', {
            className: 'min-h-screen gradient-bg py-8 px-4',
            dir: language === 'he' ? 'rtl' : 'ltr'
        }, [
            // Header
            React.createElement('div', {
                key: 'header',
                className: 'text-center mb-8'
            }, [
                React.createElement('h1', {
                    key: 'title',
                    className: 'text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in'
                }, currentT.title),
                React.createElement('p', {
                    key: 'subtitle',
                    className: 'text-xl text-white/90 animate-fade-in'
                }, currentT.subtitle),
                React.createElement('div', {
                    key: 'language',
                    className: 'mt-6'
                }, React.createElement('button', {
                    onClick: () => setLanguage(language === 'he' ? 'en' : 'he'),
                    className: 'px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all backdrop-blur-sm border border-white/30'
                }, language === 'he' ? 'English' : 'עברית'))
            ]),

            // Main Content
            React.createElement('div', {
                key: 'content',
                className: 'max-w-7xl mx-auto'
            }, [
                // Tab Navigation
                React.createElement('div', {
                    key: 'tabs',
                    className: 'flex justify-center mb-8 overflow-x-auto'
                }, React.createElement('div', {
                    className: 'glass-effect rounded-xl p-2 inline-flex space-x-2'
                }, [
                    ['basic', 'advanced', 'analysis', 'scenarios', 'fire', 'stress'].map(tab => 
                        React.createElement('button', {
                            key: tab,
                            onClick: () => handleTabClick(tab),
                            disabled: loadingTabs[tab],
                            className: `px-4 py-2 rounded-lg font-semibold transition-all min-w-max ${
                                activeTab === tab
                                    ? 'bg-purple-600 text-white shadow-lg'
                                    : 'text-purple-700 hover:bg-purple-100'
                            } ${loadingTabs[tab] ? 'opacity-50 cursor-not-allowed' : ''}`
                        }, loadingTabs[tab] ? '...' : currentT[tab])
                    )
                ])),

                // Tab Content
                React.createElement('div', {
                    key: 'tab-content',
                    className: 'grid grid-cols-1 lg:grid-cols-3 gap-8'
                }, [
                    // Forms Column
                    React.createElement('div', {
                        key: 'forms',
                        className: 'lg:col-span-2 space-y-6'
                    }, [
                        // Basic Tab
                        activeTab === 'basic' && React.createElement(BasicInputs, {
                            key: 'basic-form',
                            inputs,
                            setInputs,
                            language,
                            t: currentT
                        }),

                        // Advanced Tabs (dynamically loaded)
                        activeTab !== 'basic' && loadingTabs[activeTab] && React.createElement(LoadingComponent, {
                            key: 'loading',
                            message: `Loading ${currentT[activeTab]}...`
                        }),

                        // Advanced tab content will be rendered by dynamically loaded modules
                        activeTab === 'advanced' && window.AdvancedPortfolio && React.createElement(window.AdvancedPortfolio, {
                            key: 'advanced-form',
                            inputs, setInputs, language, t: currentT
                        }),

                        activeTab === 'analysis' && window.AnalysisEngine && React.createElement(window.AnalysisEngine, {
                            key: 'analysis-form', 
                            inputs, setInputs, language, t: currentT
                        }),

                        activeTab === 'scenarios' && window.ScenariosStress && React.createElement(window.ScenariosStress, {
                            key: 'scenarios-form',
                            inputs, setInputs, language, t: currentT
                        }),

                        activeTab === 'fire' && window.FireCalculator && React.createElement(window.FireCalculator, {
                            key: 'fire-form',
                            inputs, setInputs, language, t: currentT
                        }),

                        activeTab === 'stress' && window.StressTestEngine && React.createElement(window.StressTestEngine, {
                            key: 'stress-form',
                            inputs, setInputs, language, t: currentT
                        }),
                        
                        // Calculate Button
                        React.createElement('div', {
                            key: 'calculate-button',
                            className: 'text-center'
                        }, React.createElement('button', {
                            onClick: calculateBasic,
                            className: 'px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg'
                        }, currentT.calculate))
                    ]),

                    // Results Column
                    React.createElement('div', {
                        key: 'results',
                        className: 'lg:col-span-1'
                    }, React.createElement(BasicResults, {
                        results,
                        language,
                        t: currentT
                    }))
                ])
            ])
        ]);
    };

    // Error Boundary
    const ErrorBoundary = ({ children }) => {
        const [hasError, setHasError] = React.useState(false);

        React.useEffect(() => {
            const handleError = (event) => {
                console.error('Application error:', event.error);
                setHasError(true);
            };

            window.addEventListener('error', handleError);
            return () => window.removeEventListener('error', handleError);
        }, []);

        if (hasError) {
            return React.createElement('div', {
                className: 'flex items-center justify-center min-h-screen p-8'
            }, React.createElement('div', {
                className: 'glass-effect rounded-2xl p-8 max-w-md mx-auto text-center'
            }, [
                React.createElement('h2', {
                    key: 'title',
                    className: 'text-2xl font-bold text-red-600 mb-4'
                }, '⚠️ Application Error'),
                React.createElement('button', {
                    key: 'refresh',
                    className: 'px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors',
                    onClick: () => window.location.reload()
                }, 'Refresh Page')
            ]));
        }

        return children;
    };

    // Initialize application
    function initializeRetirementPlannerCore() {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(
            React.createElement(ErrorBoundary, {}, 
                React.createElement(RetirementPlannerCore)
            )
        );
    }

    // Export to global scope
    window.RetirementPlannerCore = RetirementPlannerCore;
    window.BasicInputs = BasicInputs;
    window.BasicResults = BasicResults;
    window.SimpleChart = SimpleChart;
    window.initializeRetirementPlannerCore = initializeRetirementPlannerCore;

    console.log('🚀 Retirement Planner Core loaded successfully');

})();