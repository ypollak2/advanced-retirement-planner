// Permanent Side Panel Component - Always visible sidebar that adapts to user inputs
// Created by Yali Pollak (יהלי פולק) - v5.3.2

const PermanentSidePanel = ({ 
    inputs, 
    results, 
    workingCurrency,
    language = 'en',
    formatCurrency,
    onInputChange,
    onQuickAction 
}) => {
    const [activeTab, setActiveTab] = React.useState('overview');
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    // Content translations
    const content = {
        he: {
            overview: 'סקירה כללית',
            savings: 'חיסכון',
            investments: 'השקעות',
            scenarios: 'תרחישים',
            settings: 'הגדרות',
            collapse: 'כווץ',
            expand: 'פרוס',
            quickStats: 'סטטיסטיקות מהירות',
            currentAge: 'גיל נוכחי',
            retirementAge: 'גיל פרישה',
            yearsToRetirement: 'שנים עד פרישה',
            totalSavings: 'סה"כ חיסכון',
            monthlyGoal: 'יעד חודשי',
            readinessScore: 'ציון מוכנות',
            currentSavings: 'חיסכון נוכחי',
            monthlyContribution: 'הפקדה חודשית',
            targetIncome: 'הכנסה מטרה',
            inflationRate: 'שיעור אינפלציה',
            quickActions: 'פעולות מהירות',
            calculate: 'חשב',
            optimize: 'אופטימיזצה',
            exportReport: 'ייצוא דוח',
            savingsBreakdown: 'פירוט חיסכון',
            pensionFund: 'קרן פנסיה',
            trainingFund: 'קרן השתלמות',
            personalPortfolio: 'תיק אישי',
            realEstate: 'נדל"ן',
            cryptocurrency: 'קריפטו',
            riskLevel: 'רמת סיכון',
            conservative: 'שמרני',
            moderate: 'מתון',
            aggressive: 'אגרסיבי',
            lastUpdated: 'עודכן לאחרונה',
            now: 'כעת'
        },
        en: {
            overview: 'Overview',
            savings: 'Savings',
            investments: 'Investments',
            scenarios: 'Scenarios',
            settings: 'Settings',
            collapse: 'Collapse',
            expand: 'Expand',
            quickStats: 'Quick Stats',
            currentAge: 'Current Age',
            retirementAge: 'Retirement Age',
            yearsToRetirement: 'Years to Retirement',
            totalSavings: 'Total Savings',
            monthlyGoal: 'Monthly Goal',
            readinessScore: 'Readiness Score',
            currentSavings: 'Current Savings',
            monthlyContribution: 'Monthly Contribution',
            targetIncome: 'Target Income',
            inflationRate: 'Inflation Rate',
            quickActions: 'Quick Actions',
            calculate: 'Calculate',
            optimize: 'Optimize',
            exportReport: 'Export Report',
            savingsBreakdown: 'Savings Breakdown',
            pensionFund: 'Pension Fund',
            trainingFund: 'Training Fund',
            personalPortfolio: 'Personal Portfolio',
            realEstate: 'Real Estate',
            cryptocurrency: 'Cryptocurrency',
            riskLevel: 'Risk Level',
            conservative: 'Conservative',
            moderate: 'Moderate',
            aggressive: 'Aggressive',
            lastUpdated: 'Last Updated',
            now: 'now'
        }
    };

    const t = content[language] || content.en;

    // Calculate derived values
    const yearsToRetirement = (inputs?.retirementAge || 67) - (inputs?.currentAge || 30);
    const totalSavings = (inputs?.currentSavings || 0) + 
                        (inputs?.currentTrainingFund || 0) + 
                        (inputs?.currentPersonalPortfolio || 0) + 
                        (inputs?.currentRealEstate || 0) + 
                        (inputs?.currentCrypto || 0);
    
    // Calculate basic readiness score (simplified)
    const calculateReadinessScore = () => {
        const savingsRate = totalSavings / ((inputs?.currentSalary || 20000) * 12);
        const timeScore = yearsToRetirement > 20 ? 100 : (yearsToRetirement / 20) * 100;
        const savingsScore = Math.min(savingsRate * 100, 100);
        return Math.round((timeScore * 0.4 + savingsScore * 0.6));
    };

    const readinessScore = calculateReadinessScore();

    // Tab configuration
    const tabs = [
        { id: 'overview', label: t.overview, icon: '📊' },
        { id: 'savings', label: t.savings, icon: '💰' },
        { id: 'investments', label: t.investments, icon: '📈' },
        { id: 'scenarios', label: t.scenarios, icon: '🧪' },
        { id: 'settings', label: t.settings, icon: '⚙️' }
    ];

    // Render tab content
    const renderTabContent = () => {
        switch(activeTab) {
            case 'overview':
                return renderOverviewTab();
            case 'savings':
                return renderSavingsTab();
            case 'investments':
                return renderInvestmentsTab();
            case 'scenarios':
                return renderScenariosTab();
            case 'settings':
                return renderSettingsTab();
            default:
                return renderOverviewTab();
        }
    };

    const renderOverviewTab = () => {
        return React.createElement('div', {
            key: 'overview-tab',
            className: 'space-y-4'
        }, [
            // Quick Stats
            React.createElement('div', {
                key: 'quick-stats',
                className: 'bg-white rounded-lg p-4 shadow-sm'
            }, [
                React.createElement('h3', {
                    key: 'stats-title',
                    className: 'text-lg font-semibold text-gray-800 mb-3'
                }, t.quickStats),
                React.createElement('div', {
                    key: 'stats-grid',
                    className: 'grid grid-cols-2 gap-3'
                }, [
                    React.createElement('div', {
                        key: 'age-stat',
                        className: 'text-center p-2 bg-blue-50 rounded'
                    }, [
                        React.createElement('div', {
                            key: 'age-value',
                            className: 'text-2xl font-bold text-blue-600'
                        }, inputs?.currentAge || 30),
                        React.createElement('div', {
                            key: 'age-label',
                            className: 'text-xs text-gray-600'
                        }, t.currentAge)
                    ]),
                    React.createElement('div', {
                        key: 'retirement-stat',
                        className: 'text-center p-2 bg-green-50 rounded'
                    }, [
                        React.createElement('div', {
                            key: 'retirement-value',
                            className: 'text-2xl font-bold text-green-600'
                        }, inputs?.retirementAge || 67),
                        React.createElement('div', {
                            key: 'retirement-label',
                            className: 'text-xs text-gray-600'
                        }, t.retirementAge)
                    ]),
                    React.createElement('div', {
                        key: 'years-stat',
                        className: 'text-center p-2 bg-orange-50 rounded col-span-2'
                    }, [
                        React.createElement('div', {
                            key: 'years-value',
                            className: 'text-3xl font-bold text-orange-600'
                        }, yearsToRetirement),
                        React.createElement('div', {
                            key: 'years-label',
                            className: 'text-xs text-gray-600'
                        }, t.yearsToRetirement)
                    ])
                ])
            ]),

            // Readiness Score
            React.createElement('div', {
                key: 'readiness-score',
                className: 'bg-white rounded-lg p-4 shadow-sm'
            }, [
                React.createElement('h3', {
                    key: 'readiness-title',
                    className: 'text-lg font-semibold text-gray-800 mb-3'
                }, t.readinessScore),
                React.createElement('div', {
                    key: 'readiness-display',
                    className: 'flex items-center justify-center'
                }, [
                    React.createElement('div', {
                        key: 'readiness-circle',
                        className: 'relative w-20 h-20 rounded-full flex items-center justify-center',
                        style: {
                            background: `conic-gradient(${readinessScore >= 70 ? '#10B981' : readinessScore >= 50 ? '#F59E0B' : '#EF4444'} ${readinessScore * 3.6}deg, #e5e7eb 0deg)`
                        }
                    }, [
                        React.createElement('div', {
                            key: 'readiness-inner',
                            className: 'w-16 h-16 bg-white rounded-full flex items-center justify-center'
                        }, [
                            React.createElement('span', {
                                key: 'readiness-number',
                                className: 'text-xl font-bold',
                                style: { color: readinessScore >= 70 ? '#10B981' : readinessScore >= 50 ? '#F59E0B' : '#EF4444' }
                            }, readinessScore)
                        ])
                    ])
                ])
            ]),

            // Total Savings
            React.createElement('div', {
                key: 'total-savings',
                className: 'bg-white rounded-lg p-4 shadow-sm'
            }, [
                React.createElement('h3', {
                    key: 'savings-title',
                    className: 'text-lg font-semibold text-gray-800 mb-3'
                }, t.totalSavings),
                React.createElement('div', {
                    key: 'savings-amount',
                    className: 'text-2xl font-bold text-green-600 mb-2'
                }, formatCurrency ? formatCurrency(totalSavings) : `₪${totalSavings.toLocaleString()}`),
                // Multi-currency display
                totalSavings > 0 && window.MultiCurrencySavings ? React.createElement(window.MultiCurrencySavings, {
                    key: 'multi-currency-display',
                    amount: totalSavings,
                    title: '',
                    language: language,
                    compact: true,
                    showLoading: false,
                    currencies: ['USD', 'EUR', 'GBP', 'BTC']
                }) : null
            ]),

            // Quick Actions
            React.createElement('div', {
                key: 'quick-actions',
                className: 'bg-white rounded-lg p-4 shadow-sm'
            }, [
                React.createElement('h3', {
                    key: 'actions-title',
                    className: 'text-lg font-semibold text-gray-800 mb-3'
                }, t.quickActions),
                React.createElement('div', {
                    key: 'actions-buttons',
                    className: 'space-y-2'
                }, [
                    React.createElement('button', {
                        key: 'calculate-btn',
                        onClick: () => onQuickAction && onQuickAction('calculate'),
                        className: 'w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
                    }, t.calculate),
                    React.createElement('button', {
                        key: 'optimize-btn',
                        onClick: () => onQuickAction && onQuickAction('optimize'),
                        className: 'w-full p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'
                    }, t.optimize),
                    React.createElement('button', {
                        key: 'export-btn',
                        onClick: () => onQuickAction && onQuickAction('export'),
                        className: 'w-full p-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors'
                    }, t.exportReport)
                ])
            ])
        ]);
    };

    const renderSavingsTab = () => {
        return React.createElement('div', {
            key: 'savings-tab',
            className: 'space-y-4'
        }, [
            React.createElement('div', {
                key: 'savings-breakdown',
                className: 'bg-white rounded-lg p-4 shadow-sm'
            }, [
                React.createElement('h3', {
                    key: 'breakdown-title',
                    className: 'text-lg font-semibold text-gray-800 mb-3'
                }, t.savingsBreakdown),
                React.createElement('div', {
                    key: 'breakdown-items',
                    className: 'space-y-2'
                }, [
                    React.createElement('div', {
                        key: 'pension-item',
                        className: 'flex justify-between items-center p-2 bg-blue-50 rounded'
                    }, [
                        React.createElement('span', {
                            key: 'pension-label',
                            className: 'text-sm font-medium text-blue-700'
                        }, t.pensionFund),
                        React.createElement('span', {
                            key: 'pension-value',
                            className: 'text-sm font-bold text-blue-800'
                        }, formatCurrency ? formatCurrency(inputs?.currentSavings || 0) : `₪${(inputs?.currentSavings || 0).toLocaleString()}`)
                    ]),
                    React.createElement('div', {
                        key: 'training-item',
                        className: 'flex justify-between items-center p-2 bg-green-50 rounded'
                    }, [
                        React.createElement('span', {
                            key: 'training-label',
                            className: 'text-sm font-medium text-green-700'
                        }, t.trainingFund),
                        React.createElement('span', {
                            key: 'training-value',
                            className: 'text-sm font-bold text-green-800'
                        }, formatCurrency ? formatCurrency(inputs?.currentTrainingFund || 0) : `₪${(inputs?.currentTrainingFund || 0).toLocaleString()}`)
                    ]),
                    React.createElement('div', {
                        key: 'personal-item',
                        className: 'flex justify-between items-center p-2 bg-purple-50 rounded'
                    }, [
                        React.createElement('span', {
                            key: 'personal-label',
                            className: 'text-sm font-medium text-purple-700'
                        }, t.personalPortfolio),
                        React.createElement('span', {
                            key: 'personal-value',
                            className: 'text-sm font-bold text-purple-800'
                        }, formatCurrency ? formatCurrency(inputs?.currentPersonalPortfolio || 0) : `₪${(inputs?.currentPersonalPortfolio || 0).toLocaleString()}`)
                    ]),
                    React.createElement('div', {
                        key: 'realestate-item',
                        className: 'flex justify-between items-center p-2 bg-yellow-50 rounded'
                    }, [
                        React.createElement('span', {
                            key: 'realestate-label',
                            className: 'text-sm font-medium text-yellow-700'
                        }, t.realEstate),
                        React.createElement('span', {
                            key: 'realestate-value',
                            className: 'text-sm font-bold text-yellow-800'
                        }, formatCurrency ? formatCurrency(inputs?.currentRealEstate || 0) : `₪${(inputs?.currentRealEstate || 0).toLocaleString()}`)
                    ]),
                    React.createElement('div', {
                        key: 'crypto-item',
                        className: 'flex justify-between items-center p-2 bg-indigo-50 rounded'
                    }, [
                        React.createElement('span', {
                            key: 'crypto-label',
                            className: 'text-sm font-medium text-indigo-700'
                        }, t.cryptocurrency),
                        React.createElement('span', {
                            key: 'crypto-value',
                            className: 'text-sm font-bold text-indigo-800'
                        }, formatCurrency ? formatCurrency(inputs?.currentCrypto || 0) : `₪${(inputs?.currentCrypto || 0).toLocaleString()}`)
                    ])
                ])
            ])
        ]);
    };

    const renderInvestmentsTab = () => {
        return React.createElement('div', {
            key: 'investments-tab',
            className: 'space-y-4'
        }, [
            React.createElement('div', {
                key: 'risk-level',
                className: 'bg-white rounded-lg p-4 shadow-sm'
            }, [
                React.createElement('h3', {
                    key: 'risk-title',
                    className: 'text-lg font-semibold text-gray-800 mb-3'
                }, t.riskLevel),
                React.createElement('div', {
                    key: 'risk-display',
                    className: 'text-center p-4 bg-gray-50 rounded'
                }, [
                    React.createElement('div', {
                        key: 'risk-value',
                        className: 'text-xl font-bold text-gray-800'
                    }, t[inputs?.riskTolerance || 'moderate']),
                    React.createElement('div', {
                        key: 'risk-desc',
                        className: 'text-sm text-gray-600 mt-2'
                    }, language === 'he' ? 'רמת הסיכון הנוכחית שלך' : 'Your current risk level')
                ])
            ]),
            React.createElement('div', {
                key: 'investment-placeholder',
                className: 'bg-white rounded-lg p-4 shadow-sm'
            }, [
                React.createElement('p', {
                    key: 'placeholder-text',
                    className: 'text-sm text-gray-600 text-center'
                }, language === 'he' ? 'כלי ניהול השקעות יתווספו בקרוב' : 'Investment management tools coming soon')
            ])
        ]);
    };

    const renderScenariosTab = () => {
        return React.createElement('div', {
            key: 'scenarios-tab',
            className: 'space-y-4'
        }, [
            React.createElement('div', {
                key: 'scenarios-placeholder',
                className: 'bg-white rounded-lg p-4 shadow-sm'
            }, [
                React.createElement('p', {
                    key: 'placeholder-text',
                    className: 'text-sm text-gray-600 text-center'
                }, language === 'he' ? 'מבחני תרחישים יתווספו בקרוב' : 'Scenario testing coming soon')
            ])
        ]);
    };

    const renderSettingsTab = () => {
        return React.createElement('div', {
            key: 'settings-tab',
            className: 'space-y-4'
        }, [
            React.createElement('div', {
                key: 'settings-placeholder',
                className: 'bg-white rounded-lg p-4 shadow-sm'
            }, [
                React.createElement('p', {
                    key: 'placeholder-text',
                    className: 'text-sm text-gray-600 text-center'
                }, language === 'he' ? 'הגדרות מתקדמות יתווספו בקרוב' : 'Advanced settings coming soon')
            ])
        ]);
    };

    return React.createElement('div', {
        className: `permanent-side-panel ${isCollapsed ? 'collapsed' : ''} ${language === 'he' ? 'rtl' : 'ltr'}`,
        style: {
            width: isCollapsed ? '60px' : '320px',
            minHeight: '100vh',
            backgroundColor: '#f8fafc',
            borderRight: language === 'he' ? 'none' : '1px solid #e2e8f0',
            borderLeft: language === 'he' ? '1px solid #e2e8f0' : 'none',
            transition: 'width 0.3s ease',
            position: 'fixed',
            top: 0,
            left: language === 'he' ? 'auto' : 0,
            right: language === 'he' ? 0 : 'auto',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column'
        }
    }, [
        // Header with collapse button
        React.createElement('div', {
            key: 'panel-header',
            className: 'flex items-center justify-between p-4 border-b border-gray-200 bg-white'
        }, [
            !isCollapsed && React.createElement('h2', {
                key: 'panel-title',
                className: 'text-lg font-semibold text-gray-800'
            }, language === 'he' ? 'פאנל בקרה' : 'Control Panel'),
            React.createElement('button', {
                key: 'collapse-btn',
                onClick: () => setIsCollapsed(!isCollapsed),
                className: 'p-2 hover:bg-gray-100 rounded-lg transition-colors',
                title: isCollapsed ? t.expand : t.collapse
            }, isCollapsed ? (language === 'he' ? '◀' : '▶') : (language === 'he' ? '▶' : '◀'))
        ]),

        // Tabs
        !isCollapsed && React.createElement('div', {
            key: 'tabs',
            className: 'flex border-b border-gray-200 bg-white'
        }, tabs.map(tab => 
            React.createElement('button', {
                key: tab.id,
                onClick: () => setActiveTab(tab.id),
                className: `flex-1 p-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id 
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`
            }, [
                React.createElement('span', { key: 'icon' }, tab.icon),
                ' ',
                tab.label
            ])
        )),

        // Tab Content
        !isCollapsed && React.createElement('div', {
            key: 'tab-content',
            className: 'flex-1 p-4 overflow-y-auto'
        }, renderTabContent()),

        // Collapsed state icons
        isCollapsed && React.createElement('div', {
            key: 'collapsed-icons',
            className: 'p-2 space-y-2'
        }, tabs.map(tab => 
            React.createElement('button', {
                key: tab.id,
                onClick: () => {
                    setActiveTab(tab.id);
                    setIsCollapsed(false);
                },
                className: `w-full p-3 text-xl hover:bg-gray-200 rounded-lg transition-colors ${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                }`,
                title: tab.label
            }, tab.icon)
        )),

        // Last updated timestamp
        !isCollapsed && React.createElement('div', {
            key: 'last-updated',
            className: 'p-4 border-t border-gray-200 bg-white'
        }, [
            React.createElement('p', {
                key: 'timestamp',
                className: 'text-xs text-gray-500 text-center'
            }, `${t.lastUpdated}: ${t.now}`)
        ])
    ]);
};

// Export to window for global access
window.PermanentSidePanel = PermanentSidePanel;

console.log('PermanentSidePanel component loaded successfully');