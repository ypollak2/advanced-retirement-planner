// UI Components for Retirement Planner App
// Reusable UI elements and layout components

// Header Component
function AppHeader({ language, setLanguage }) {
    return React.createElement('header', {
        className: "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
    }, [
        React.createElement('div', {
            key: 'header-container',
            className: "container mx-auto px-4 py-4"
        }, [
            React.createElement('div', {
                key: 'header-content',
                className: "flex justify-between items-center"
            }, [
                React.createElement('div', {
                    key: 'header-title',
                    className: "flex items-center space-x-3"
                }, [
                    React.createElement('span', {
                        key: 'icon',
                        className: "text-3xl"
                    }, '💰'),
                    React.createElement('h1', {
                        key: 'title',
                        className: "text-2xl font-bold"
                    }, window.multiLanguage[language].title)
                ]),
                React.createElement('div', {
                    key: 'header-actions',
                    className: "flex items-center space-x-4"
                }, [
                    React.createElement('div', {
                        key: 'version',
                        className: "text-sm opacity-75"
                    }, 'v7.5.11'),
                    React.createElement('button', {
                        key: 'lang-toggle',
                        onClick: () => setLanguage(language === 'en' ? 'he' : 'en'),
                        className: "px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-200"
                    }, language === 'en' ? '🇮🇱 עברית' : '🇺🇸 English')
                ])
            ])
        ])
    ]);
}

// Sidebar Component
function AppSidebar({ 
    sidebarCollapsed, 
    setSidebarCollapsed, 
    language, 
    viewMode,
    activeSection,
    onQuickAction 
}) {
    const t = window.multiLanguage[language];
    
    const menuItems = [
        { id: 'dashboard', icon: '📊', label: t.dashboard },
        { id: 'wizard', icon: '🧙‍♂️', label: t.wizard },
        { id: 'settings', icon: '⚙️', label: t.settings }
    ];
    
    const quickActions = [
        { id: 'salary', icon: '💼', label: t.updateSalary },
        { id: 'family', icon: '👨‍👩‍👧‍👦', label: t.familyPlanning },
        { id: 'stressTest', icon: '🎯', label: t.stressTest },
        { id: 'calculate', icon: '🔄', label: t.recalculate }
    ];
    
    return React.createElement('aside', {
        className: `${sidebarCollapsed ? 'w-16' : 'w-64'} bg-gray-800 text-white transition-all duration-300 flex flex-col`
    }, [
        // Toggle button
        React.createElement('button', {
            key: 'toggle',
            onClick: () => setSidebarCollapsed(!sidebarCollapsed),
            className: "p-4 hover:bg-gray-700 text-center"
        }, sidebarCollapsed ? '→' : '←'),
        
        // Menu items
        React.createElement('nav', {
            key: 'nav',
            className: "flex-1 py-4"
        }, menuItems.map(item => 
            React.createElement('button', {
                key: item.id,
                className: `w-full px-4 py-3 hover:bg-gray-700 flex items-center space-x-3 ${
                    viewMode === item.id ? 'bg-gray-700 border-l-4 border-blue-500' : ''
                }`,
                onClick: () => {} // Handle navigation
            }, [
                React.createElement('span', { key: 'icon' }, item.icon),
                !sidebarCollapsed && React.createElement('span', { key: 'label' }, item.label)
            ])
        )),
        
        // Quick actions
        !sidebarCollapsed && React.createElement('div', {
            key: 'quick-actions',
            className: "border-t border-gray-700 py-4"
        }, [
            React.createElement('h3', {
                key: 'title',
                className: "px-4 text-sm font-semibold mb-2 text-gray-400"
            }, t.quickActions),
            ...quickActions.map(action => 
                React.createElement('button', {
                    key: action.id,
                    className: "w-full px-4 py-2 hover:bg-gray-700 flex items-center space-x-3 text-sm",
                    onClick: () => onQuickAction(action.id)
                }, [
                    React.createElement('span', { key: 'icon' }, action.icon),
                    React.createElement('span', { key: 'label' }, action.label)
                ])
            )
        ])
    ]);
}

// Loading Spinner Component
function LoadingSpinner({ message }) {
    return React.createElement('div', {
        className: "flex items-center justify-center py-8"
    }, [
        React.createElement('div', {
            key: 'spinner',
            className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
        }),
        message && React.createElement('span', {
            key: 'message',
            className: "ml-4 text-gray-600"
        }, message)
    ]);
}

// Error Message Component
function ErrorMessage({ error, onRetry }) {
    return React.createElement('div', {
        className: "bg-red-50 border border-red-200 rounded-lg p-4 mb-4"
    }, [
        React.createElement('div', {
            key: 'content',
            className: "flex items-center"
        }, [
            React.createElement('span', {
                key: 'icon',
                className: "text-red-500 mr-3"
            }, '⚠️'),
            React.createElement('div', {
                key: 'text',
                className: "flex-1"
            }, [
                React.createElement('h4', {
                    key: 'title',
                    className: "font-semibold text-red-900"
                }, 'Error'),
                React.createElement('p', {
                    key: 'message',
                    className: "text-red-700"
                }, error)
            ])
        ]),
        onRetry && React.createElement('button', {
            key: 'retry',
            onClick: onRetry,
            className: "mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        }, 'Retry')
    ]);
}

// Card Component
function Card({ title, icon, children, className = '', actions }) {
    return React.createElement('div', {
        className: `bg-white rounded-xl shadow-lg p-6 ${className}`
    }, [
        title && React.createElement('div', {
            key: 'header',
            className: "flex items-center justify-between mb-4"
        }, [
            React.createElement('div', {
                key: 'title',
                className: "flex items-center space-x-2"
            }, [
                icon && React.createElement('span', { key: 'icon' }, icon),
                React.createElement('h3', {
                    key: 'text',
                    className: "text-xl font-semibold"
                }, title)
            ]),
            actions && React.createElement('div', {
                key: 'actions',
                className: "flex space-x-2"
            }, actions)
        ]),
        React.createElement('div', {
            key: 'content'
        }, children)
    ]);
}

// Progress Bar Component
function ProgressBar({ value, max = 100, label, color = 'blue' }) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    
    return React.createElement('div', {
        className: "w-full"
    }, [
        label && React.createElement('div', {
            key: 'label',
            className: "flex justify-between text-sm text-gray-600 mb-1"
        }, [
            React.createElement('span', { key: 'text' }, label),
            React.createElement('span', { key: 'value' }, `${Math.round(percentage)}%`)
        ]),
        React.createElement('div', {
            key: 'bar',
            className: "w-full bg-gray-200 rounded-full h-2.5"
        }, React.createElement('div', {
            className: `bg-${color}-600 h-2.5 rounded-full transition-all duration-300`,
            style: { width: `${percentage}%` }
        }))
    ]);
}

// Tooltip Component
function Tooltip({ text, children }) {
    const [isVisible, setIsVisible] = React.useState(false);
    
    return React.createElement('div', {
        className: "relative inline-block",
        onMouseEnter: () => setIsVisible(true),
        onMouseLeave: () => setIsVisible(false)
    }, [
        children,
        isVisible && React.createElement('div', {
            key: 'tooltip',
            className: "absolute z-10 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg -top-10 left-1/2 transform -translate-x-1/2"
        }, [
            text,
            React.createElement('div', {
                key: 'arrow',
                className: "absolute w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 -bottom-1 left-1/2 transform -translate-x-1/2"
            })
        ])
    ]);
}

// Stat Card Component
function StatCard({ label, value, icon, trend, color = 'blue' }) {
    return React.createElement('div', {
        className: "bg-white rounded-lg shadow p-6"
    }, [
        React.createElement('div', {
            key: 'header',
            className: "flex items-center justify-between mb-2"
        }, [
            React.createElement('span', {
                key: 'icon',
                className: `text-2xl text-${color}-500`
            }, icon),
            trend && React.createElement('span', {
                key: 'trend',
                className: `text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`
            }, `${trend > 0 ? '↑' : '↓'} ${Math.abs(trend)}%`)
        ]),
        React.createElement('h3', {
            key: 'value',
            className: "text-2xl font-bold mb-1"
        }, value),
        React.createElement('p', {
            key: 'label',
            className: "text-gray-600 text-sm"
        }, label)
    ]);
}

// Export all components
window.RetirementPlannerUIComponents = {
    AppHeader,
    AppSidebar,
    LoadingSpinner,
    ErrorMessage,
    Card,
    ProgressBar,
    Tooltip,
    StatCard
};

console.log('✅ Retirement Planner UI Components loaded');