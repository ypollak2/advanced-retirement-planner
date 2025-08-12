// Dashboard Sections Module
// Individual section components

// Pension Planning Section
function PensionPlanningSection({ expanded, onToggle, onSectionExpand, language, t, validationIssues }) {
    return React.createElement('div', {
        key: 'pension-section',
        className: 'planning-section'
    }, [
        React.createElement('div', {
            key: 'pension-header',
            className: `section-header ${expanded ? 'expanded' : ''}`,
            onClick: () => onToggle('pension')
        }, [
            React.createElement('div', {
                key: 'title',
                className: 'section-title'
            }, [
                React.createElement('div', {
                    key: 'icon',
                    className: 'section-icon'
                }, '💰'),
                t.pensionPlanning
            ]),
            React.createElement('div', {
                key: 'expand',
                className: `expand-icon ${expanded ? 'expanded' : ''}`
            }, '▼')
        ]),
        React.createElement('div', {
            key: 'pension-content',
            className: `section-content ${expanded ? 'expanded' : ''}`
        }, expanded ? [
            // Validation issues if any
            validationIssues && validationIssues.length > 0 && React.createElement('div', {
                key: 'validation-issues',
                className: 'mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg'
            }, [
                React.createElement('h5', {
                    key: 'issues-title',
                    className: 'font-medium text-yellow-800 mb-2'
                }, language === 'he' ? 'נושאים לתשומת לב:' : 'Issues to address:'),
                React.createElement('ul', {
                    key: 'issues-list',
                    className: 'space-y-1 text-sm text-yellow-700'
                }, validationIssues.map((issue, index) => 
                    React.createElement('li', {
                        key: index,
                        className: 'cursor-pointer hover:text-yellow-900',
                        onClick: () => {
                            if (onSectionExpand && issue.field) {
                                onSectionExpand(issue.field, 'pension');
                            }
                        }
                    }, `• ${issue.message}`)
                ))
            ]),
            
            // Pension summary
            React.createElement('div', {
                key: 'pension-summary',
                className: 'mt-4 p-4 bg-gray-50 rounded-lg border'
            }, [
                React.createElement('h5', {
                    key: 'summary-title',
                    className: 'font-medium text-gray-700 mb-2'
                }, language === 'he' ? 'סיכום פנסיה' : 'Pension Summary'),
                React.createElement('p', {
                    key: 'summary-desc',
                    className: 'text-sm text-gray-600'
                }, language === 'he' ? 
                    'חסכון פנסיוני הוא הבסיס לביטחון כלכלי בגיל הפרישה.' :
                    'Pension savings form the foundation of financial security in retirement.')
            ])
        ] : null)
    ]);
}

// Investment Portfolio Section
function InvestmentPortfolioSection({ expanded, onToggle, setViewMode, language, t }) {
    return React.createElement('div', {
        key: 'investments-section',
        className: 'planning-section'
    }, [
        React.createElement('div', {
            key: 'investments-header',
            className: `section-header ${expanded ? 'expanded' : ''}`,
            onClick: () => setViewMode ? setViewMode('investments') : onToggle('investments')
        }, [
            React.createElement('div', {
                key: 'title',
                className: 'section-title'
            }, [
                React.createElement('div', {
                    key: 'icon',
                    className: 'section-icon'
                }, '📈'),
                t.investmentPortfolio
            ]),
            React.createElement('div', {
                key: 'expand',
                className: `expand-icon ${expanded ? 'expanded' : ''}`
            }, '▼')
        ]),
        React.createElement('div', {
            key: 'investments-content',
            className: `section-content ${expanded ? 'expanded' : ''}`
        }, expanded && window.ComprehensiveFinancialSummary ? [
            React.createElement(window.ComprehensiveFinancialSummary, {
                key: 'financial-summary',
                inputs: {},
                language: language,
                workingCurrency: 'ILS'
            })
        ] : null)
    ]);
}

// Partner Planning Section
function PartnerPlanningSection({ expanded, onToggle, setViewMode, language, t, inputs, validationIssues, onSectionExpand }) {
    return React.createElement('div', {
        key: 'partner-section',
        className: 'planning-section'
    }, [
        React.createElement('div', {
            key: 'partner-header',
            className: `section-header ${expanded ? 'expanded' : ''}`,
            onClick: () => setViewMode ? setViewMode('couple') : onToggle('partner')
        }, [
            React.createElement('div', {
                key: 'title',
                className: 'section-title'
            }, [
                React.createElement('div', {
                    key: 'icon',
                    className: 'section-icon'
                }, '👫'),
                t.partnerPlanning
            ]),
            React.createElement('div', {
                key: 'expand',
                className: `expand-icon ${expanded ? 'expanded' : ''}`
            }, '▼')
        ]),
        React.createElement('div', {
            key: 'partner-content',
            className: `section-content ${expanded ? 'expanded' : ''}`
        }, expanded ? [
            // Couple validation issues
            validationIssues && validationIssues.length > 0 && React.createElement('div', {
                key: 'couple-validation',
                className: 'mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg'
            }, [
                React.createElement('h5', {
                    key: 'issues-title',
                    className: 'font-medium text-yellow-800 mb-2'
                }, language === 'he' ? 'נושאים לתשומת לב בתכנון זוגי:' : 'Couple planning issues:'),
                React.createElement('ul', {
                    key: 'issues-list',
                    className: 'space-y-1 text-sm text-yellow-700'
                }, validationIssues.map((issue, index) => 
                    React.createElement('li', {
                        key: index,
                        className: 'cursor-pointer hover:text-yellow-900',
                        onClick: () => {
                            if (onSectionExpand && issue.field) {
                                const sectionMap = {
                                    'partner1Salary': 'salary',
                                    'partner2Salary': 'salary',
                                    'partner1PensionRate': 'pension',
                                    'partner2PensionRate': 'pension'
                                };
                                const targetSection = sectionMap[issue.field];
                                if (targetSection) {
                                    onSectionExpand(issue.field, targetSection);
                                }
                            }
                        }
                    }, `• ${issue.message}`)
                ))
            ]),
            
            // Partner planning summary
            React.createElement('div', {
                key: 'partner-summary',
                className: 'mt-6 p-4 bg-gray-50 rounded-lg border'
            }, [
                React.createElement('h5', {
                    key: 'summary-title',
                    className: 'font-medium text-gray-700 mb-2'
                }, language === 'he' ? 'סיכום תכנון זוגי' : 'Couple Planning Summary'),
                React.createElement('p', {
                    key: 'summary-desc',
                    className: 'text-sm text-gray-600'
                }, language === 'he' ? 
                    'תכנון פרישה משותף מאפשר אופטימיזציה של הכנסות, הוצאות וסיכונים.' :
                    'Joint retirement planning enables optimization of income, expenses, and risk management.')
            ])
        ] : null)
    ]);
}

// Scenario Testing Section
function ScenarioTestingSection({ expanded, onToggle, setViewMode, language, t, inputs, results, formatCurrency, workingCurrency, onSectionExpand }) {
    return React.createElement('div', {
        key: 'scenarios-section',
        className: 'planning-section'
    }, [
        React.createElement('div', {
            key: 'scenarios-header',
            className: `section-header ${expanded ? 'expanded' : ''}`,
            onClick: () => setViewMode ? setViewMode('scenarios') : onToggle('scenarios')
        }, [
            React.createElement('div', {
                key: 'title',
                className: 'section-title'
            }, [
                React.createElement('div', {
                    key: 'icon',
                    className: 'section-icon'
                }, '🧪'),
                t.scenarioTesting
            ]),
            React.createElement('div', {
                key: 'expand',
                className: `expand-icon ${expanded ? 'expanded' : ''}`
            }, '▼')
        ]),
        React.createElement('div', {
            key: 'scenarios-content',
            className: `section-content ${expanded ? 'expanded' : ''}`
        }, expanded ? [
            // Quick scenario comparison actions
            React.createElement('div', {
                key: 'scenario-actions',
                className: 'space-y-4 mb-6'
            }, [
                React.createElement('button', {
                    key: 'open-scenarios',
                    onClick: () => {
                        if (onSectionExpand) {
                            onSectionExpand('openScenarios', 'scenarios');
                        }
                    },
                    className: 'w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center'
                }, [
                    React.createElement('span', { key: 'icon', className: 'mr-2' }, '🔄'),
                    language === 'he' ? 'השוואת תרחישי פרישה' : 'Compare Retirement Scenarios'
                ]),
                
                React.createElement('div', {
                    key: 'scenario-preview',
                    className: 'bg-gray-50 rounded-lg p-4 border'
                }, [
                    React.createElement('h5', {
                        key: 'preview-title',
                        className: 'font-medium text-gray-700 mb-2'
                    }, language === 'he' ? 'תרחישים זמינים' : 'Available Scenarios'),
                    React.createElement('ul', {
                        key: 'scenario-list',
                        className: 'space-y-1 text-sm text-gray-600'
                    }, [
                        React.createElement('li', { key: 'optimistic' }, `• ${language === 'he' ? 'תרחיש אופטימי' : 'Optimistic scenario'}`),
                        React.createElement('li', { key: 'conservative' }, `• ${language === 'he' ? 'תרחיש שמרני' : 'Conservative scenario'}`),
                        React.createElement('li', { key: 'early-retirement' }, `• ${language === 'he' ? 'פרישה מוקדמת' : 'Early retirement'}`),
                        React.createElement('li', { key: 'custom' }, `• ${language === 'he' ? 'תרחיש מותאם אישית' : 'Custom scenarios'}`)
                    ])
                ])
            ]),
            
            // Stress test interface if available
            window.StressTestInterface && React.createElement(window.StressTestInterface, {
                key: 'stress-test',
                inputs: inputs,
                workPeriods: [
                    {
                        id: 1,
                        country: 'israel',
                        startAge: inputs?.currentAge || 30,
                        endAge: inputs?.retirementAge || 67,
                        monthlyContribution: 2000,
                        salary: inputs?.currentSalary || 15000,
                        pensionReturn: 7.0,
                        pensionDepositFee: 0.5,
                        pensionAnnualFee: 1.0,
                        monthlyTrainingFund: 500
                    }
                ],
                results: results,
                language: language,
                formatCurrency: formatCurrency,
                workingCurrency: workingCurrency
            })
        ] : null)
    ]);
}

// Export all sections
window.DashboardSections = {
    PensionPlanningSection,
    InvestmentPortfolioSection,
    PartnerPlanningSection,
    ScenarioTestingSection
};

console.log('✅ Dashboard sections module loaded');