// GoalTrackingDashboard.js - Long-term Progress Monitoring for Retirement Goals
// Created by Yali Pollak (יהלי פולק) - Advanced Retirement Planner v6.3.0

const GoalTrackingDashboard = ({ 
    inputs, 
    results, 
    language = 'en', 
    workingCurrency = 'ILS',
    onGoalUpdate,
    onReturnToDashboard
}) => {
    const createElement = React.createElement;
    
    // State for goals management
    const [goals, setGoals] = React.useState([
        {
            id: 'retirement-income',
            type: 'income',
            title: language === 'he' ? 'הכנסה בפרישה' : 'Retirement Income',
            targetAmount: (inputs?.currentMonthlySalary || 15000) * 0.75,
            currentAmount: results?.monthlyIncome || 0,
            targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + ((inputs?.retirementAge || 67) - (inputs?.currentAge || 30)))),
            category: 'retirement',
            priority: 'high',
            status: 'active'
        },
        {
            id: 'total-accumulation',
            type: 'savings',
            title: language === 'he' ? 'צבירה כוללת' : 'Total Accumulation',
            targetAmount: (inputs?.currentMonthlySalary || 15000) * 12 * 10, // 10 years salary equivalent
            currentAmount: results?.totalAccumulated || inputs?.currentSavings || 0,
            targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + ((inputs?.retirementAge || 67) - (inputs?.currentAge || 30)))),
            category: 'savings',
            priority: 'high',
            status: 'active'
        }
    ]);
    
    const [progressHistory, setProgressHistory] = React.useState([]);
    const [showAddGoal, setShowAddGoal] = React.useState(false);
    const [selectedTimeframe, setSelectedTimeframe] = React.useState('yearly');
    const [selectedCategory, setSelectedCategory] = React.useState('all');
    
    // Multi-language content
    const content = {
        he: {
            title: 'מעקב יעדי פרישה',
            subtitle: 'עקוב אחר התקדמותך לעבר יעדי הפרישה שלך',
            
            // Goal types
            goalTypes: {
                income: 'יעד הכנסה',
                savings: 'יעד חיסכון',
                investment: 'יעד השקעה',
                debt: 'יעד פרעון חובות',
                emergency: 'קרן חירום',
                custom: 'יעד מותאם'
            },
            
            // Categories
            categories: {
                all: 'כל הקטגוריות',
                retirement: 'פרישה',
                savings: 'חיסכון',
                investment: 'השקעות',
                protection: 'הגנה',
                lifestyle: 'אורח חיים'
            },
            
            // Status
            statusLabels: {
                active: 'פעיל',
                completed: 'הושלם',
                paused: 'מושהה',
                overdue: 'באיחור'
            },
            
            // Priority
            priorityLabels: {
                high: 'גבוהה',
                medium: 'בינונית',
                low: 'נמוכה'
            },
            
            // Actions
            addGoal: 'הוסף יעד חדש',
            editGoal: 'ערוך יעד',
            deleteGoal: 'מחק יעד',
            markCompleted: 'סמן כהושלם',
            viewProgress: 'צפה בהתקדמות',
            
            // Timeframes
            timeframes: {
                monthly: 'חודשי',
                quarterly: 'רבעוני',
                yearly: 'שנתי',
                all: 'כל הזמנים'
            },
            
            // Progress
            progress: 'התקדמות',
            onTrack: 'במסלול',
            ahead: 'מקדימים',
            behind: 'מפגרים',
            
            // Statistics
            totalGoals: 'סך יעדים',
            completedGoals: 'יעדים שהושלמו',
            activeGoals: 'יעדים פעילים',
            averageProgress: 'התקדמות ממוצעת',
            
            // Milestones
            milestones: 'אבני דרך',
            nextMilestone: 'אבן הדרך הבאה',
            recentAchievements: 'הישגים אחרונים',
            
            // Insights
            insights: 'תובנות',
            recommendations: 'המלצות',
            trends: 'מגמות',
            
            // Messages
            noGoals: 'לא הוגדרו יעדים עדיין',
            goalCompleted: 'יעד הושלם בהצלחה!',
            goalBehindSchedule: 'יעד מפגר מהלוח זמנים',
            adjustContributions: 'שקול להעלות הפקדות',
            
            info: 'מעקב אחר יעדים מאפשר לך לוודא שאתה במסלול הנכון לעבר פרישה מוצלחת'
        },
        en: {
            title: 'Retirement Goal Tracking',
            subtitle: 'Monitor your progress towards retirement objectives',
            
            // Goal types
            goalTypes: {
                income: 'Income Goal',
                savings: 'Savings Goal',
                investment: 'Investment Goal',
                debt: 'Debt Payoff Goal',
                emergency: 'Emergency Fund',
                custom: 'Custom Goal'
            },
            
            // Categories
            categories: {
                all: 'All Categories',
                retirement: 'Retirement',
                savings: 'Savings',
                investment: 'Investments',
                protection: 'Protection',
                lifestyle: 'Lifestyle'
            },
            
            // Status
            statusLabels: {
                active: 'Active',
                completed: 'Completed',
                paused: 'Paused',
                overdue: 'Overdue'
            },
            
            // Priority
            priorityLabels: {
                high: 'High',
                medium: 'Medium',
                low: 'Low'
            },
            
            // Actions
            addGoal: 'Add New Goal',
            editGoal: 'Edit Goal',
            deleteGoal: 'Delete Goal',
            markCompleted: 'Mark Completed',
            viewProgress: 'View Progress',
            
            // Timeframes
            timeframes: {
                monthly: 'Monthly',
                quarterly: 'Quarterly',
                yearly: 'Yearly',
                all: 'All Time'
            },
            
            // Progress
            progress: 'Progress',
            onTrack: 'On Track',
            ahead: 'Ahead',
            behind: 'Behind',
            
            // Statistics
            totalGoals: 'Total Goals',
            completedGoals: 'Completed Goals',
            activeGoals: 'Active Goals',
            averageProgress: 'Average Progress',
            
            // Milestones
            milestones: 'Milestones',
            nextMilestone: 'Next Milestone',
            recentAchievements: 'Recent Achievements',
            
            // Insights
            insights: 'Insights',
            recommendations: 'Recommendations',
            trends: 'Trends',
            
            // Messages
            noGoals: 'No goals defined yet',
            goalCompleted: 'Goal completed successfully!',
            goalBehindSchedule: 'Goal behind schedule',
            adjustContributions: 'Consider increasing contributions',
            
            info: 'Goal tracking helps ensure you stay on course toward a successful retirement'
        }
    };

    const t = content[language];

    // Calculate goal progress
    const calculateGoalProgress = (goal) => {
        if (goal.targetAmount === 0) return 0;
        const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
        return Math.round(progress);
    };

    // Determine goal status based on progress and timeline
    const getGoalStatus = (goal) => {
        const progress = calculateGoalProgress(goal);
        const now = new Date();
        const timeToTarget = goal.targetDate - now;
        const totalTime = goal.targetDate - new Date(goal.createdAt || now.getTime() - 365 * 24 * 60 * 60 * 1000);
        const timeProgress = Math.max(0, (totalTime - timeToTarget) / totalTime * 100);
        
        if (progress >= 100) return 'completed';
        if (timeToTarget < 0) return 'overdue';
        if (progress >= timeProgress - 10) return 'on-track';
        if (progress >= timeProgress + 10) return 'ahead';
        return 'behind';
    };

    // Get progress color
    const getProgressColor = (status) => {
        const colors = {
            'on-track': 'blue',
            'ahead': 'green', 
            'behind': 'red',
            'completed': 'green',
            'overdue': 'red'
        };
        return colors[status] || 'gray';
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

    // Generate goal statistics
    const getGoalStatistics = () => {
        const total = goals.length;
        const completed = goals.filter(g => getGoalStatus(g) === 'completed').length;
        const active = goals.filter(g => g.status === 'active').length;
        const averageProgress = goals.length > 0 
            ? Math.round(goals.reduce((sum, goal) => sum + calculateGoalProgress(goal), 0) / goals.length)
            : 0;
        
        return { total, completed, active, averageProgress };
    };

    // Add new goal
    const addNewGoal = (goalData) => {
        const newGoal = {
            id: `goal_${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: 'active',
            ...goalData
        };
        
        setGoals(prev => [...prev, newGoal]);
        setShowAddGoal(false);
        
        if (onGoalUpdate) {
            onGoalUpdate(newGoal, 'added');
        }
    };

    // Update goal
    const updateGoal = (goalId, updates) => {
        setGoals(prev => prev.map(goal =>
            goal.id === goalId ? { ...goal, ...updates } : goal
        ));
        
        if (onGoalUpdate) {
            onGoalUpdate({ id: goalId, ...updates }, 'updated');
        }
    };

    // Delete goal
    const deleteGoal = (goalId) => {
        if (window.confirm(language === 'he' ? 'האם למחוק יעד זה?' : 'Delete this goal?')) {
            setGoals(prev => prev.filter(g => g.id !== goalId));
            
            if (onGoalUpdate) {
                onGoalUpdate({ id: goalId }, 'deleted');
            }
        }
    };

    // Render goal card
    const renderGoalCard = (goal) => {
        const progress = calculateGoalProgress(goal);
        const status = getGoalStatus(goal);
        const color = getProgressColor(status);
        
        return createElement('div', {
            key: goal.id,
            className: `bg-white rounded-xl p-6 border-2 border-${color}-200 hover:border-${color}-300 transition-all`
        }, [
            // Goal header
            createElement('div', {
                key: 'goal-header',
                className: 'flex justify-between items-start mb-4'
            }, [
                createElement('div', {
                    key: 'goal-info',
                    className: 'flex-1'
                }, [
                    createElement('h3', {
                        key: 'goal-title',
                        className: `text-lg font-semibold text-${color}-700 mb-1`
                    }, goal.title),
                    createElement('div', {
                        key: 'goal-meta',
                        className: 'flex items-center space-x-4 text-sm text-gray-600'
                    }, [
                        createElement('span', {
                            key: 'category',
                            className: `px-2 py-1 bg-${color}-100 text-${color}-700 rounded-full text-xs font-medium`
                        }, t.categories[goal.category] || goal.category),
                        createElement('span', {
                            key: 'priority',
                            className: `px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs`
                        }, t.priorityLabels[goal.priority] || goal.priority),
                        createElement('span', {
                            key: 'target-date',
                            className: 'text-gray-500'
                        }, `${language === 'he' ? 'יעד:' : 'Target:'} ${new Date(goal.targetDate).toLocaleDateString()}`)
                    ])
                ]),
                
                // Action buttons
                createElement('div', {
                    key: 'actions',
                    className: 'flex space-x-2 ml-4'
                }, [
                    createElement('button', {
                        key: 'edit-btn',
                        onClick: () => {/* Edit goal functionality */},
                        className: 'text-gray-500 hover:text-blue-600 p-1'
                    }, '✏️'),
                    createElement('button', {
                        key: 'delete-btn',
                        onClick: () => deleteGoal(goal.id),
                        className: 'text-gray-500 hover:text-red-600 p-1'
                    }, '🗑️')
                ])
            ]),
            
            // Progress section
            createElement('div', {
                key: 'progress-section',
                className: 'mb-4'
            }, [
                createElement('div', {
                    key: 'progress-header',
                    className: 'flex justify-between items-center mb-2'
                }, [
                    createElement('span', {
                        key: 'progress-label',
                        className: 'text-sm font-medium text-gray-700'
                    }, t.progress),
                    createElement('span', {
                        key: 'progress-percent',
                        className: `text-sm font-bold text-${color}-600`
                    }, `${progress}%`)
                ]),
                createElement('div', {
                    key: 'progress-bar',
                    className: 'w-full bg-gray-200 rounded-full h-3'
                }, [
                    createElement('div', {
                        key: 'progress-fill',
                        className: `bg-${color}-500 h-3 rounded-full transition-all duration-500`,
                        style: { width: `${progress}%` }
                    })
                ])
            ]),
            
            // Amount section
            createElement('div', {
                key: 'amounts',
                className: 'grid grid-cols-2 gap-4 mb-4'
            }, [
                createElement('div', {
                    key: 'current-amount',
                    className: `bg-${color}-50 rounded-lg p-3 border border-${color}-200`
                }, [
                    createElement('div', {
                        key: 'current-label',
                        className: `text-sm font-medium text-${color}-700`
                    }, language === 'he' ? 'מצב נוכחי' : 'Current'),
                    createElement('div', {
                        key: 'current-value',
                        className: `text-lg font-bold text-${color}-800`
                    }, formatCurrency(goal.currentAmount, workingCurrency))
                ]),
                
                createElement('div', {
                    key: 'target-amount',
                    className: `bg-gray-50 rounded-lg p-3 border border-gray-200`
                }, [
                    createElement('div', {
                        key: 'target-label',
                        className: 'text-sm font-medium text-gray-700'
                    }, language === 'he' ? 'יעד' : 'Target'),
                    createElement('div', {
                        key: 'target-value',
                        className: 'text-lg font-bold text-gray-800'
                    }, formatCurrency(goal.targetAmount, workingCurrency))
                ])
            ]),
            
            // Status indicator
            createElement('div', {
                key: 'status',
                className: 'flex items-center justify-between'
            }, [
                createElement('span', {
                    key: 'status-badge',
                    className: `px-3 py-1 bg-${color}-100 text-${color}-700 rounded-full text-sm font-medium`
                }, getStatusLabel(status)),
                
                goal.status === 'active' && status !== 'completed' && createElement('button', {
                    key: 'complete-btn',
                    onClick: () => updateGoal(goal.id, { status: 'completed' }),
                    className: `px-3 py-1 bg-${color}-600 text-white rounded-lg text-sm hover:bg-${color}-700 transition-colors`
                }, t.markCompleted)
            ])
        ]);
    };

    // Get status label
    const getStatusLabel = (status) => {
        const labels = {
            'on-track': t.onTrack,
            'ahead': t.ahead,
            'behind': t.behind,
            'completed': t.statusLabels.completed,
            'overdue': t.statusLabels.overdue
        };
        return labels[status] || status;
    };

    // Render statistics summary
    const renderStatistics = () => {
        const stats = getGoalStatistics();
        
        return createElement('div', {
            key: 'statistics',
            className: 'grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'
        }, [
            createElement('div', {
                key: 'total-goals',
                className: 'bg-blue-50 rounded-lg p-4 border border-blue-200'
            }, [
                createElement('h4', {
                    key: 'total-label',
                    className: 'text-sm font-medium text-blue-700 mb-1'
                }, t.totalGoals),
                createElement('p', {
                    key: 'total-value',
                    className: 'text-2xl font-bold text-blue-900'
                }, stats.total)
            ]),
            
            createElement('div', {
                key: 'active-goals',
                className: 'bg-green-50 rounded-lg p-4 border border-green-200'
            }, [
                createElement('h4', {
                    key: 'active-label',
                    className: 'text-sm font-medium text-green-700 mb-1'
                }, t.activeGoals),
                createElement('p', {
                    key: 'active-value',
                    className: 'text-2xl font-bold text-green-900'
                }, stats.active)
            ]),
            
            createElement('div', {
                key: 'completed-goals',
                className: 'bg-purple-50 rounded-lg p-4 border border-purple-200'
            }, [
                createElement('h4', {
                    key: 'completed-label',
                    className: 'text-sm font-medium text-purple-700 mb-1'
                }, t.completedGoals),
                createElement('p', {
                    key: 'completed-value',
                    className: 'text-2xl font-bold text-purple-900'
                }, stats.completed)
            ]),
            
            createElement('div', {
                key: 'average-progress',
                className: 'bg-orange-50 rounded-lg p-4 border border-orange-200'
            }, [
                createElement('h4', {
                    key: 'average-label',
                    className: 'text-sm font-medium text-orange-700 mb-1'
                }, t.averageProgress),
                createElement('p', {
                    key: 'average-value',
                    className: 'text-2xl font-bold text-orange-900'
                }, `${stats.averageProgress}%`)
            ])
        ]);
    };

    const filteredGoals = selectedCategory === 'all' 
        ? goals 
        : goals.filter(goal => goal.category === selectedCategory);

    return createElement('div', { className: "goal-tracking-dashboard space-y-6" }, [
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

        // Statistics summary
        renderStatistics(),

        // Filters and actions
        createElement('div', {
            key: 'controls',
            className: 'flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0'
        }, [
            createElement('div', {
                key: 'filters',
                className: 'flex space-x-4'
            }, [
                createElement('select', {
                    key: 'category-filter',
                    value: selectedCategory,
                    onChange: (e) => setSelectedCategory(e.target.value),
                    className: 'px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                }, Object.keys(t.categories).map(category =>
                    createElement('option', {
                        key: category,
                        value: category
                    }, t.categories[category])
                ))
            ]),
            
            createElement('button', {
                key: 'add-goal-btn',
                onClick: () => setShowAddGoal(true),
                className: 'px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
            }, t.addGoal)
        ]),

        // Goals grid
        filteredGoals.length > 0 ? createElement('div', {
            key: 'goals-grid',
            className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        }, filteredGoals.map(goal => renderGoalCard(goal))) : createElement('div', {
            key: 'no-goals',
            className: 'text-center py-12'
        }, [
            createElement('div', {
                key: 'icon',
                className: 'text-6xl mb-4'
            }, '🎯'),
            createElement('h3', {
                key: 'no-goals-title',
                className: 'text-xl font-semibold text-gray-600 mb-2'
            }, t.noGoals),
            createElement('p', {
                key: 'no-goals-desc',
                className: 'text-gray-500 mb-4'
            }, language === 'he' ? 'התחל בהוספת יעדי פרישה כדי לעקוב אחר ההתקדמות שלך' : 'Start by adding retirement goals to track your progress'),
            createElement('button', {
                key: 'add-first-goal',
                onClick: () => setShowAddGoal(true),
                className: 'px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            }, t.addGoal)
        ]),

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
window.GoalTrackingDashboard = GoalTrackingDashboard;

console.log('✅ GoalTrackingDashboard component loaded successfully');