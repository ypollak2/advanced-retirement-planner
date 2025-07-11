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

    // Savings Summary Panel Component - Real-time savings overview with multi-currency support
    const SavingsSummaryPanel = ({ inputs, language, t }) => {
        const [exchangeRates, setExchangeRates] = React.useState({
            USD: 3.6, EUR: 4.0, GBP: 4.7, BTC: 180000, ETH: 9000
        });
        
        // Calculate real-time totals
        const totalSavings = (inputs.currentSavings || 0) + (inputs.trainingFund || 0);
        const yearsToRetirement = (inputs.retirementAge || 67) - (inputs.currentAge || 30);
        const monthlyTotal = (inputs.currentMonthlySalary || 15000) * 0.18 + (inputs.trainingFundContribution || 0); // 18% pension contribution + training fund
        const totalProjected = totalSavings + (monthlyTotal * 12 * yearsToRetirement);
        
        // Inflation calculations
        const inflationRate = (inputs.inflationRate || 3) / 100;
        const buyingPowerToday = totalProjected / Math.pow(1 + inflationRate, yearsToRetirement);
        
        const formatCurrency = (amount, symbol = '₪') => {
            return `${symbol}${amount.toLocaleString()}`;
        };
        
        return React.createElement('div', { 
            className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in sticky top-4" 
        }, [
            React.createElement('h3', { 
                key: 'title',
                className: "text-xl font-bold text-purple-700 mb-4 flex items-center" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-2" }, '💰'),
                language === 'he' ? 'סיכום חיסכון' : 'Savings Summary'
            ]),
            
            // Current Totals
            React.createElement('div', {
                key: 'current',
                className: "space-y-3 mb-6"
            }, [
                React.createElement('div', {
                    key: 'pension',
                    className: "bg-blue-50 rounded-lg p-3 border border-blue-200"
                }, [
                    React.createElement('div', { className: "text-sm text-blue-700 font-medium" }, 
                        language === 'he' ? 'פנסיה נוכחית' : 'Current Pension'),
                    React.createElement('div', { className: "text-lg font-bold text-blue-800" }, 
                        formatCurrency(inputs.currentSavings || 0))
                ]),
                
                React.createElement('div', {
                    key: 'training',
                    className: "bg-green-50 rounded-lg p-3 border border-green-200"
                }, [
                    React.createElement('div', { className: "text-sm text-green-700 font-medium" }, 
                        language === 'he' ? 'קרן השתלמות' : 'Training Fund'),
                    React.createElement('div', { className: "text-lg font-bold text-green-800" }, 
                        formatCurrency(inputs.trainingFund || 0))
                ]),
                
                React.createElement('div', {
                    key: 'total',
                    className: "bg-purple-50 rounded-lg p-3 border border-purple-200"
                }, [
                    React.createElement('div', { className: "text-sm text-purple-700 font-medium" }, 
                        language === 'he' ? 'סך הכל נוכחי' : 'Total Current'),
                    React.createElement('div', { className: "text-xl font-bold text-purple-800" }, 
                        formatCurrency(totalSavings))
                ])
            ]),
            
            // Monthly Contributions
            React.createElement('div', {
                key: 'monthly',
                className: "bg-gray-50 rounded-lg p-3 mb-4"
            }, [
                React.createElement('div', { className: "text-sm text-gray-700 font-medium mb-2" }, 
                    language === 'he' ? 'הפקדות חודשיות' : 'Monthly Contributions'),
                React.createElement('div', { className: "text-base font-bold text-gray-800" }, 
                    formatCurrency(monthlyTotal))
            ]),
            
            // Projected at Retirement
            React.createElement('div', {
                key: 'projected',
                className: "bg-yellow-50 rounded-lg p-3 mb-4 border border-yellow-200"
            }, [
                React.createElement('div', { className: "text-sm text-yellow-700 font-medium" }, 
                    language === 'he' ? 'צפי בפרישה' : 'Projected at Retirement'),
                React.createElement('div', { className: "text-lg font-bold text-yellow-800" }, 
                    formatCurrency(totalProjected))
            ]),
            
            // Buying Power
            React.createElement('div', {
                key: 'buying-power',
                className: "bg-orange-50 rounded-lg p-3 mb-4 border border-orange-200"
            }, [
                React.createElement('div', { className: "text-sm text-orange-700 font-medium" }, 
                    language === 'he' ? 'כוח קנייה היום' : 'Today\'s Buying Power'),
                React.createElement('div', { className: "text-lg font-bold text-orange-800" }, 
                    formatCurrency(buyingPowerToday))
            ]),
            
            // Multi-Currency Display
            React.createElement('div', {
                key: 'currencies',
                className: "border-t border-gray-200 pt-4"
            }, [
                React.createElement('div', { 
                    key: 'currency-title',
                    className: "text-sm font-medium text-gray-700 mb-3" 
                }, language === 'he' ? 'בערכי מטבעות' : 'In Other Currencies'),
                
                React.createElement('div', {
                    key: 'currency-grid',
                    className: "grid grid-cols-2 gap-2 text-xs"
                }, [
                    ['USD', '$'], ['EUR', '€'], ['GBP', '£'], ['BTC', '₿'], ['ETH', 'Ξ']
                ].map(([currency, symbol]) => 
                    React.createElement('div', {
                        key: currency,
                        className: "bg-gray-100 rounded px-2 py-1"
                    }, [
                        React.createElement('div', { className: "font-medium" }, currency),
                        React.createElement('div', { className: "text-gray-600" }, 
                            currency === 'BTC' || currency === 'ETH' ? 
                                `${symbol}${(totalSavings / exchangeRates[currency]).toFixed(4)}` :
                                `${symbol}${Math.round(totalSavings / exchangeRates[currency]).toLocaleString()}`
                        )
                    ])
                ))
            ])
        ]);
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
                        React.createElement('div', { key: 'training-fund' }, [
                            React.createElement('label', { 
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, language === 'he' ? "קרן השתלמות נוכחית (₪)" : "Current Training Fund (₪)"),
                            React.createElement('input', {
                                type: 'number',
                                value: inputs.trainingFund || 0,
                                onChange: (e) => setInputs({...inputs, trainingFund: parseInt(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            })
                        ])
                    ]),
                    React.createElement('div', { 
                        key: 'row3',
                        className: "grid grid-cols-2 gap-4" 
                    }, [
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
                        ]),
                        React.createElement('div', { key: 'training-contribution' }, [
                            React.createElement('label', { 
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, language === 'he' ? "הפקדה חודשית לקרן השתלמות (₪)" : "Monthly Training Fund Contribution (₪)"),
                            React.createElement('input', {
                                type: 'number',
                                value: inputs.trainingFundContribution || Math.round((inputs.currentMonthlySalary || 15000) * 0.075), // 7.5% default
                                onChange: (e) => setInputs({...inputs, trainingFundContribution: parseInt(e.target.value) || 0}),
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
            trainingFund: 25000,
            trainingFundContribution: 1125, // 7.5% of 15000
            inflationRate: 3,
            expectedReturn: 7
        });
        const [results, setResults] = React.useState(null);
        const [loadingTabs, setLoadingTabs] = React.useState({});

        // Auto-load advanced modules for better UX (like versions 2.3-2.4)
        React.useEffect(() => {
            console.log('🎯 RetirementPlannerCore component mounted');
            
            // Immediately preload critical modules for better UX (like versions 2.3-2.4)
            setTimeout(async () => {
                if (window.moduleLoader) {
                    console.log('🚀 Auto-loading critical modules for rich feature set...');
                    try {
                        // Load Advanced Portfolio first (most commonly used)
                        if (!window.AdvancedPortfolio) {
                            await window.moduleLoader.loadAdvancedTab();
                            console.log('✅ Advanced Portfolio auto-loaded');
                        }
                        
                        // Load Analysis Engine for insights
                        if (!window.AnalysisEngine) {
                            await window.moduleLoader.loadAnalysisTab();
                            console.log('✅ Analysis Engine auto-loaded');
                        }
                        
                        // Load FIRE Calculator for early retirement planning
                        if (!window.FireCalculator) {
                            await window.moduleLoader.loadFireTab();
                            console.log('✅ FIRE Calculator auto-loaded');
                        }
                        
                        setLoadingTabs(prev => ({...prev, advanced: false, analysis: false, fire: false}));
                        console.log('🎉 All critical modules auto-loaded successfully');
                    } catch (error) {
                        console.warn('⚠️ Failed to auto-load some modules:', error);
                        setLoadingTabs(prev => ({...prev, advanced: false, analysis: false, fire: false}));
                    }
                }
            }, 1500); // Load after initial render is complete
        }, []);

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

                    // Results Column with Side Panel
                    React.createElement('div', {
                        key: 'results',
                        className: 'lg:col-span-1 space-y-6'
                    }, [
                        // Real-time Summary Panel
                        React.createElement(SavingsSummaryPanel, {
                            key: 'summary-panel',
                            inputs,
                            language,
                            t: currentT
                        }),
                        
                        // Basic Results
                        React.createElement(BasicResults, {
                            key: 'basic-results',
                            results,
                            language,
                            t: currentT
                        })
                    ])
                ])
            ])
        ]);
    };

    // Error Boundary - Class component for proper React error boundary functionality
    window.ErrorBoundary = class ErrorBoundary extends React.Component {
        constructor(props) {
            super(props);
            this.state = { hasError: false, error: null, errorInfo: null };
        }

        static getDerivedStateFromError(error) {
            // Update state so the next render will show the fallback UI
            return { hasError: true };
        }

        componentDidCatch(error, errorInfo) {
            // Log the error for debugging
            console.error('ErrorBoundary caught an error:', error, errorInfo);
            this.setState({
                error: error,
                errorInfo: errorInfo
            });
        }

        render() {
            if (this.state.hasError) {
                // Fallback UI
                return React.createElement('div', {
                    className: 'flex items-center justify-center min-h-screen p-8'
                }, React.createElement('div', {
                    className: 'glass-effect rounded-2xl p-8 max-w-md mx-auto text-center'
                }, [
                    React.createElement('h2', {
                        key: 'title',
                        className: 'text-2xl font-bold text-red-600 mb-4'
                    }, '⚠️ Application Error'),
                    React.createElement('p', {
                        key: 'message',
                        className: 'text-gray-600 mb-4'
                    }, 'Something went wrong. Please refresh the page to try again.'),
                    this.state.error && React.createElement('details', {
                        key: 'details',
                        className: 'text-left bg-red-50 p-3 rounded mb-4 text-sm'
                    }, [
                        React.createElement('summary', { key: 'summary', className: 'cursor-pointer text-red-700 font-medium' }, 'Error Details'),
                        React.createElement('pre', { key: 'error', className: 'mt-2 text-red-600' }, this.state.error.toString()),
                        this.state.errorInfo && React.createElement('pre', { key: 'info', className: 'mt-2 text-gray-500' }, this.state.errorInfo.componentStack)
                    ]),
                    React.createElement('button', {
                        key: 'refresh',
                        className: 'px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors',
                        onClick: () => window.location.reload()
                    }, 'Refresh Page')
                ]));
            }

            return this.props.children;
        }
    };

    // Initialize application
    function initializeRetirementPlannerCore() {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(
            React.createElement(window.ErrorBoundary, {}, 
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