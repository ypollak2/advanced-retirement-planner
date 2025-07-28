// Main Application Script - Advanced Retirement Planner
// This file contains the core React application logic

function initializeApp() {
    try {
        // Use React hooks directly for better compatibility
        
        // Enhanced Chart component with multiple datasets
        const SimpleChart = ({ data, type = 'line', language = 'en' }) => {
            const chartRef = React.useRef(null);
            const chartInstance = React.useRef(null);
            
            React.useEffect(() => {
                if (chartRef.current && data && data.length > 0) {
                    const ctx = chartRef.current.getContext('2d');
                    
                    if (chartInstance.current) {
                        chartInstance.current.destroy();
                    }
                    
                    let chartData;
                    const isHebrew = language === 'he';
                    
                    if (type === 'crisisTimeline') {
                        chartData = {
                            labels: data.map(d => isHebrew ? `גיל ${d.age}` : `Age ${d.age}`),
                            datasets: [
                                {
                                    label: isHebrew ? 'צבירה רגילה' : 'Normal Accumulation',
                                    data: data.map(d => d.normalAccumulation),
                                    borderColor: 'rgb(34, 197, 94)',
                                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                    fill: false,
                                    tension: 0.4,
                                    borderWidth: 3
                                },
                                {
                                    label: isHebrew ? 'צבירה במשבר' : 'Crisis Accumulation',
                                    data: data.map(d => d.stressedAccumulation),
                                    borderColor: 'rgb(239, 68, 68)',
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                    fill: false,
                                    tension: 0.4,
                                    borderWidth: 3
                                }
                            ]
                        };
                    }
                    
                    // Chart configuration
                    const config = {
                        type: type === 'stressComparison' ? 'bar' : 'line',
                        data: chartData,
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                title: {
                                    display: true,
                                    text: isHebrew ? 'ניתוח פיננסי' : 'Financial Analysis'
                                },
                                legend: {
                                    position: 'top'
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        callback: function(value) {
                                            return value.toLocaleString() + (isHebrew ? ' ₪' : ' ₪');
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

        // Export SimpleChart to window for global access
        window.SimpleChart = SimpleChart;

        // Main Retirement Planner Component
        const RetirementPlanner = () => {
            // All state declared at the top level to prevent React hooks error
            const [language, setLanguage] = React.useState('he');
            
            React.useEffect(() => {
                window.currentLanguage = language;
            }, [language]);
            
            const [activeTab, setActiveTab] = React.useState('basic');
            const [inputs, setInputs] = React.useState({
                currentAge: 30,
                retirementAge: 67,
                currentSavings: 0,
                inflationRate: 3,
                currentMonthlyExpenses: 12000,
                targetReplacement: 75,
                riskTolerance: 'moderate'
            });

            const [results, setResults] = React.useState(null);
            const [chartData, setChartData] = React.useState(null);
            const [showChart, setShowChart] = React.useState(false);

            // Simple calculate function
            const handleCalculate = () => {
                if (window.calculateRetirement) {
                    const workPeriods = [{
                        id: 1,
                        country: 'israel',
                        startAge: inputs.currentAge,
                        endAge: inputs.retirementAge,
                        monthlyContribution: 2000,
                        salary: 15000,
                        pensionReturn: 7.0,
                        pensionDepositFee: 0.5,
                        pensionAnnualFee: 1.0,
                        monthlyTrainingFund: 500
                    }];
                    
                    const result = window.calculateRetirement(inputs, workPeriods, [], []);
                    setResults(result);
                }
            };

            const t = window.multiLanguage ? window.multiLanguage[language] : {
                title: 'Advanced Retirement Planner',
                subtitle: 'Professional Pension Planning Tool',
                basic: 'Basic',
                advanced: 'Advanced',
                calculate: 'Calculate'
            };

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
                    }, t.title),
                    React.createElement('p', {
                        key: 'subtitle',
                        className: 'text-xl text-white/90 animate-fade-in'
                    }, t.subtitle),
                    // Language Toggle
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
                        className: 'flex justify-center mb-8'
                    }, React.createElement('div', {
                        className: 'glass-effect rounded-xl p-2 inline-flex space-x-2'
                    }, [
                        React.createElement('button', {
                            key: 'basic',
                            onClick: () => setActiveTab('basic'),
                            className: `px-6 py-3 rounded-lg font-semibold transition-all ${
                                activeTab === 'basic'
                                    ? 'bg-purple-600 text-white shadow-lg'
                                    : 'text-purple-700 hover:bg-purple-100'
                            }`
                        }, t.basic),
                        React.createElement('button', {
                            key: 'advanced',
                            onClick: () => setActiveTab('advanced'),
                            className: `px-6 py-3 rounded-lg font-semibold transition-all ${
                                activeTab === 'advanced'
                                    ? 'bg-purple-600 text-white shadow-lg'
                                    : 'text-purple-700 hover:bg-purple-100'
                            }`
                        }, t.advanced)
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
                            // Basic Form
                            activeTab === 'basic' && window.BasicInputs && React.createElement(window.BasicInputs, {
                                key: 'basic-form',
                                inputs,
                                setInputs,
                                language,
                                t,
                                Calculator: () => React.createElement('span', {}, '📊'),
                                PiggyBank: () => React.createElement('span', {}, '🏛️'),
                                DollarSign: () => React.createElement('span', {}, '💰')
                            }),
                            // Advanced Form
                            activeTab === 'advanced' && window.AdvancedInputs && React.createElement(window.AdvancedInputs, {
                                key: 'advanced-form',
                                inputs,
                                setInputs,
                                language,
                                t,
                                Settings: () => React.createElement('span', {}, '⚙️'),
                                PiggyBank: () => React.createElement('span', {}, '🏛️'),
                                DollarSign: () => React.createElement('span', {}, '💰'),
                                TrendingUp: () => React.createElement('span', {}, '📈'),
                                Building: () => React.createElement('span', {}, '🏢'),
                                Globe: () => React.createElement('span', {}, '🌍'),
                                Plus: () => React.createElement('span', {}, '➕'),
                                Trash2: () => React.createElement('span', {}, '🗑️')
                            }),
                            
                            // Calculate Button
                            React.createElement('div', {
                                key: 'calculate-button',
                                className: 'text-center'
                            }, React.createElement('button', {
                                onClick: handleCalculate,
                                className: 'px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg'
                            }, t.calculate || 'Calculate'))
                        ]),

                        // Results Column
                        React.createElement('div', {
                            key: 'results',
                            className: 'lg:col-span-1'
                        }, results && window.ResultsPanel && React.createElement(window.ResultsPanel, {
                            results,
                            inputs: {},
                            workPeriods: [],
                            language,
                            t,
                            formatCurrency: window.formatCurrency,
                            convertCurrency: window.convertCurrency,
                            generateChartData: window.generateChartData,
                            showChart: false,
                            chartData: [],
                            claudeInsights: null,
                            exportRetirementSummary: () => {},
                            exportAsImage: () => {},
                            PiggyBank: () => React.createElement('span', {}, '🏛️'),
                            Calculator: () => React.createElement('span', {}, '📊'),
                            DollarSign: () => React.createElement('span', {}, '💰'),
                            Target: () => React.createElement('span', {}, '🎯'),
                            AlertCircle: () => React.createElement('span', {}, '⚠️'),
                            TrendingUp: () => React.createElement('span', {}, '📈'),
                            SimpleChart: window.SimpleChart
                        }))
                    ])
                ])
            ]);
        };

        // Error boundary component
        const ErrorBoundary = ({ children }) => {
            const [hasError, setHasError] = React.useState(false);
            const [error, setError] = React.useState(null);

            React.useEffect(() => {
                const handleError = (event) => {
                    console.error('Application error:', event.error);
                    setError(event.error);
                    setHasError(true);
                };

                window.addEventListener('error', handleError);
                window.addEventListener('unhandledrejection', handleError);

                return () => {
                    window.removeEventListener('error', handleError);
                    window.removeEventListener('unhandledrejection', handleError);
                };
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
                    React.createElement('p', {
                        key: 'message',
                        className: 'text-gray-700 mb-4'
                    }, 'The application encountered an error. Please refresh the page to try again.'),
                    React.createElement('button', {
                        key: 'refresh',
                        className: 'px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors',
                        onClick: () => window.location.reload()
                    }, 'Refresh Page')
                ]));
            }

            return children;
        };

        // Render the app with error boundary
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(
            React.createElement(ErrorBoundary, {}, 
                React.createElement(RetirementPlanner)
            )
        );
        
    } catch (error) {
        console.error('Error initializing app:', error);
        document.getElementById('root').innerHTML = `
            <div class="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
                <div class="text-center max-w-md">
                    <div class="text-red-500 text-6xl mb-4">💥</div>
                    <h2 class="text-2xl font-bold text-red-700 mb-4">Application Error</h2>
                    <p class="text-gray-700 mb-4">
                        An error occurred while loading the application:
                    </p>
                    <div class="bg-red-100 border border-red-300 rounded-lg p-3 mb-4">
                        <code class="text-red-700 text-sm">${error.message}</code>
                    </div>
                    <button id="retryBtn" class="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors">
                        Reload Page
                    </button>
                </div>
            </div>
        `;
        // Add event listener for retry button
        setTimeout(() => {
            const retryBtn = document.getElementById('retryBtn');
            if (retryBtn) {
                retryBtn.addEventListener('click', () => location.reload());
            }
        }, 100);
    }
}

// Export the function for global access
window.initializeApp = initializeApp;