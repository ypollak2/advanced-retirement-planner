// Dashboard Additional Sections Module
// Goal tracking, inheritance, tax optimization, and national insurance sections

// Goal Tracking Section
function GoalTrackingSection({ expanded, onToggle, setViewMode, language, t, onSectionExpand }) {
    return React.createElement('div', {
        key: 'goals-section',
        className: 'planning-section'
    }, [
        React.createElement('div', {
            key: 'goals-header',
            className: `section-header ${expanded ? 'expanded' : ''}`,
            onClick: () => setViewMode ? setViewMode('goals') : onToggle('goals')
        }, [
            React.createElement('div', {
                key: 'title',
                className: 'section-title'
            }, [
                React.createElement('div', {
                    key: 'icon',
                    className: 'section-icon'
                }, '🎯'),
                t.goalTracking
            ]),
            React.createElement('div', {
                key: 'expand',
                className: `expand-icon ${expanded ? 'expanded' : ''}`
            }, '▼')
        ]),
        React.createElement('div', {
            key: 'goals-content',
            className: `section-content ${expanded ? 'expanded' : ''}`
        }, expanded ? [
            // Goal tracking actions
            React.createElement('div', {
                key: 'goal-actions',
                className: 'space-y-4 mb-6'
            }, [
                React.createElement('button', {
                    key: 'open-goals',
                    onClick: () => {
                        if (onSectionExpand) {
                            onSectionExpand('openGoals', 'goals');
                        }
                    },
                    className: 'w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center'
                }, [
                    React.createElement('span', { key: 'icon', className: 'mr-2' }, '🎯'),
                    language === 'he' ? 'מעקב יעדי פרישה' : 'Track Retirement Goals'
                ]),
                
                React.createElement('div', {
                    key: 'goals-preview',
                    className: 'bg-gray-50 rounded-lg p-4 border'
                }, [
                    React.createElement('h5', {
                        key: 'preview-title',
                        className: 'font-medium text-gray-700 mb-2'
                    }, language === 'he' ? 'יעדים זמינים' : 'Available Goals'),
                    React.createElement('ul', {
                        key: 'goals-list',
                        className: 'space-y-1 text-sm text-gray-600'
                    }, [
                        React.createElement('li', { key: 'retirement-income' }, `• ${language === 'he' ? 'יעד הכנסה בפרישה' : 'Retirement income target'}`),
                        React.createElement('li', { key: 'total-savings' }, `• ${language === 'he' ? 'יעד חיסכון כולל' : 'Total savings target'}`),
                        React.createElement('li', { key: 'emergency-fund' }, `• ${language === 'he' ? 'קרן חירום' : 'Emergency fund'}`),
                        React.createElement('li', { key: 'custom-goals' }, `• ${language === 'he' ? 'יעדים מותאמים אישית' : 'Custom goals'}`)
                    ])
                ])
            ])
        ] : null)
    ]);
}

// Inheritance & Estate Planning Section
function InheritancePlanningSection({ expanded, onToggle, language, t, inputs, formatCurrency, workingCurrency }) {
    return React.createElement('div', {
        key: 'inheritance-section',
        className: 'planning-section'
    }, [
        React.createElement('div', {
            key: 'inheritance-header',
            className: `section-header ${expanded ? 'expanded' : ''}`,
            onClick: () => onToggle('inheritance')
        }, [
            React.createElement('div', {
                key: 'title',
                className: 'section-title'
            }, [
                React.createElement('div', {
                    key: 'icon',
                    className: 'section-icon'
                }, '🏛️'),
                t.inheritancePlanning
            ]),
            React.createElement('div', {
                key: 'expand',
                className: `expand-icon ${expanded ? 'expanded' : ''}`
            }, '▼')
        ]),
        React.createElement('div', {
            key: 'inheritance-content',
            className: `section-content ${expanded ? 'expanded' : ''}`
        }, expanded ? [
            React.createElement('div', {
                key: 'inheritance-summary',
                className: 'grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'
            }, [
                React.createElement('div', {
                    key: 'total-assets',
                    className: 'bg-green-50 p-4 rounded-lg border border-green-200'
                }, [
                    React.createElement('h5', {
                        key: 'assets-title',
                        className: 'text-sm font-medium text-green-700 mb-1'
                    }, t.totalAssets),
                    React.createElement('p', {
                        key: 'assets-value',
                        className: 'text-lg font-bold text-green-900'
                    }, formatCurrency ? formatCurrency(inputs.totalAssets || 0, workingCurrency) : (inputs.totalAssets || 0))
                ]),
                React.createElement('div', {
                    key: 'total-debts',
                    className: 'bg-red-50 p-4 rounded-lg border border-red-200'
                }, [
                    React.createElement('h5', {
                        key: 'debts-title',
                        className: 'text-sm font-medium text-red-700 mb-1'
                    }, t.totalDebts),
                    React.createElement('p', {
                        key: 'debts-value',
                        className: 'text-lg font-bold text-red-900'
                    }, formatCurrency ? formatCurrency(inputs.totalDebts || 0, workingCurrency) : (inputs.totalDebts || 0))
                ]),
                React.createElement('div', {
                    key: 'net-worth',
                    className: 'bg-blue-50 p-4 rounded-lg border border-blue-200'
                }, [
                    React.createElement('h5', {
                        key: 'networth-title',
                        className: 'text-sm font-medium text-blue-700 mb-1'
                    }, t.estateValue),
                    React.createElement('p', {
                        key: 'networth-value',
                        className: 'text-lg font-bold text-blue-900'
                    }, formatCurrency ? formatCurrency(inputs.netWorth || 0, workingCurrency) : (inputs.netWorth || 0))
                ]),
                React.createElement('div', {
                    key: 'will-status',
                    className: 'bg-purple-50 p-4 rounded-lg border border-purple-200'
                }, [
                    React.createElement('h5', {
                        key: 'will-title',
                        className: 'text-sm font-medium text-purple-700 mb-1'
                    }, t.hasWillStatus),
                    React.createElement('p', {
                        key: 'will-value',
                        className: 'text-lg font-bold text-purple-900'
                    }, inputs.hasWill || inputs.willStatus === 'hasWill' ? '✅' : '❌')
                ])
            ]),
            inputs.lifeInsuranceAmount > 0 && React.createElement('div', {
                key: 'life-insurance',
                className: 'bg-yellow-50 p-4 rounded-lg border border-yellow-200'
            }, [
                React.createElement('h5', {
                    key: 'insurance-title',
                    className: 'text-sm font-medium text-yellow-700 mb-2'
                }, t.lifeInsurance),
                React.createElement('p', {
                    key: 'insurance-value',
                    className: 'text-lg font-bold text-yellow-900'
                }, formatCurrency ? formatCurrency(inputs.lifeInsuranceAmount, workingCurrency) : inputs.lifeInsuranceAmount)
            ])
        ] : null)
    ]);
}

// Tax Optimization Section
function TaxOptimizationSection({ expanded, onToggle, setViewMode, language, t, inputs }) {
    return React.createElement('div', {
        key: 'tax-section',
        className: 'planning-section'
    }, [
        React.createElement('div', {
            key: 'tax-header',
            className: `section-header ${expanded ? 'expanded' : ''}`,
            onClick: () => setViewMode ? setViewMode('optimization') : onToggle('taxOptimization')
        }, [
            React.createElement('div', {
                key: 'title',
                className: 'section-title'
            }, [
                React.createElement('div', {
                    key: 'icon',
                    className: 'section-icon'
                }, '💰'),
                t.taxOptimization
            ]),
            React.createElement('div', {
                key: 'expand',
                className: `expand-icon ${expanded ? 'expanded' : ''}`
            }, '▼')
        ]),
        React.createElement('div', {
            key: 'tax-content',
            className: `section-content ${expanded ? 'expanded' : ''}`
        }, expanded ? [
            React.createElement('div', {
                key: 'tax-summary',
                className: 'grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'
            }, [
                React.createElement('div', {
                    key: 'tax-efficiency',
                    className: 'bg-indigo-50 p-4 rounded-lg border border-indigo-200'
                }, [
                    React.createElement('h5', {
                        key: 'efficiency-title',
                        className: 'text-sm font-medium text-indigo-700 mb-1'
                    }, t.taxEfficiency),
                    React.createElement('p', {
                        key: 'efficiency-value',
                        className: 'text-lg font-bold text-indigo-900'
                    }, `${inputs.taxEfficiencyScore || 0}/100`)
                ]),
                React.createElement('div', {
                    key: 'pension-optimized',
                    className: 'bg-teal-50 p-4 rounded-lg border border-teal-200'
                }, [
                    React.createElement('h5', {
                        key: 'pension-title',
                        className: 'text-sm font-medium text-teal-700 mb-1'
                    }, t.pensionOptimized),
                    React.createElement('p', {
                        key: 'pension-value',
                        className: 'text-lg font-bold text-teal-900'
                    }, `${inputs.optimizedPensionRate || inputs.pensionContributionRate || 17.5}%`)
                ]),
                React.createElement('div', {
                    key: 'training-optimized',
                    className: 'bg-cyan-50 p-4 rounded-lg border border-cyan-200'
                }, [
                    React.createElement('h5', {
                        key: 'training-title',
                        className: 'text-sm font-medium text-cyan-700 mb-1'
                    }, t.trainingFundOptimized),
                    React.createElement('p', {
                        key: 'training-value',
                        className: 'text-lg font-bold text-cyan-900'
                    }, `${inputs.optimizedTrainingFundRate || inputs.trainingFundContributionRate || 7.5}%`)
                ])
            ])
        ] : null)
    ]);
}

// National Insurance Section
function NationalInsuranceSection({ expanded, onToggle, language, t, results, formatCurrency, workingCurrency }) {
    return React.createElement('div', {
        key: 'ni-section',
        className: 'planning-section'
    }, [
        React.createElement('div', {
            key: 'ni-header',
            className: `section-header ${expanded ? 'expanded' : ''}`,
            onClick: () => onToggle('nationalInsurance')
        }, [
            React.createElement('div', {
                key: 'title',
                className: 'section-title'
            }, [
                React.createElement('div', {
                    key: 'icon',
                    className: 'section-icon'
                }, '🛡️'),
                t.nationalInsurance
            ]),
            React.createElement('div', {
                key: 'expand',
                className: `expand-icon ${expanded ? 'expanded' : ''}`
            }, '▼')
        ]),
        React.createElement('div', {
            key: 'ni-content',
            className: `section-content ${expanded ? 'expanded' : ''}`
        }, expanded && results && results.nationalInsurance ? [
            React.createElement('div', {
                key: 'ni-summary',
                className: 'grid grid-cols-1 md:grid-cols-2 gap-4'
            }, [
                React.createElement('div', {
                    key: 'monthly-benefit',
                    className: 'bg-emerald-50 p-4 rounded-lg border border-emerald-200'
                }, [
                    React.createElement('h5', {
                        key: 'monthly-title',
                        className: 'text-sm font-medium text-emerald-700 mb-1'
                    }, t.monthlyBenefit),
                    React.createElement('p', {
                        key: 'monthly-value',
                        className: 'text-lg font-bold text-emerald-900'
                    }, formatCurrency ? formatCurrency(results.nationalInsurance.monthlyBenefit || 0, workingCurrency) : (results.nationalInsurance.monthlyBenefit || 0))
                ]),
                React.createElement('div', {
                    key: 'total-benefit',
                    className: 'bg-lime-50 p-4 rounded-lg border border-lime-200'
                }, [
                    React.createElement('h5', {
                        key: 'total-title',
                        className: 'text-sm font-medium text-lime-700 mb-1'
                    }, t.totalBenefit),
                    React.createElement('p', {
                        key: 'total-value',
                        className: 'text-lg font-bold text-lime-900'
                    }, formatCurrency ? formatCurrency(results.nationalInsurance.totalBenefit || 0, workingCurrency) : (results.nationalInsurance.totalBenefit || 0))
                ])
            ])
        ] : expanded ? [
            React.createElement('p', {
                key: 'ni-placeholder',
                className: 'text-gray-500 text-center py-4'
            }, language === 'he' ? 
                'חישוב ביטוח לאומי יופיע כאן לאחר השלמת האשף' :
                'National Insurance calculation will appear here after completing the wizard')
        ] : null)
    ]);
}

// Export all additional sections
window.DashboardAdditionalSections = {
    GoalTrackingSection,
    InheritancePlanningSection,
    TaxOptimizationSection,
    NationalInsuranceSection
};

console.log('✅ Dashboard additional sections module loaded');