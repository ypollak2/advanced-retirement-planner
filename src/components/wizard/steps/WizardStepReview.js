// WizardStepReview.js - Step 8: Final Review & Summary (Refactored)
// Comprehensive plan review using modular components

const WizardStepReview = ({ inputs, setInputs, language = 'en', workingCurrency = 'ILS' }) => {
    const createElement = React.createElement;
    
    // Multi-language content
    const content = {
        he: {
            title: 'סקירה מקיפה ותוצאות',
            subtitle: 'סיכום מקיף של תכנית הפרישה שלך עם המלצות פעולה',
            
            // Action Items
            actionItems: 'פעולות נדרשות',
            immediateActions: 'פעולות מיידיות (30 יום)',
            shortTermGoals: 'יעדים קצרי טווח (6-12 חודשים)',
            longTermStrategy: 'אסטרטגיה ארוכת טווח (5+ שנים)',
            
            // Country-specific recommendations
            countrySpecificActions: 'פעולות ספציפיות למדינה',
            regulatoryCompliance: 'רשימת ציות רגולטורי',
            contributionTiming: 'תזמון הפקדות אופטימלי',
            taxDeadlines: 'מועדי מס חשובים',
            
            // Final recommendations
            nextSteps: 'הצעדים הבאים',
            reviewSchedule: 'לוח זמנים לסקירה',
            professionalAdvice: 'ייעוץ מקצועי',
            
            // Summary
            overallAssessment: 'הערכה כוללת',
            readyForRetirement: 'מוכן לפרישה',
            needsWork: 'דורש עבודה',
            onTrack: 'במסלול הנכון'
        },
        en: {
            title: 'Comprehensive Review & Results',
            subtitle: 'Complete summary of your retirement plan with actionable recommendations',
            
            // Action Items
            actionItems: 'Required Actions',
            immediateActions: 'Immediate Actions (30 days)',
            shortTermGoals: 'Short-term Goals (6-12 months)',
            longTermStrategy: 'Long-term Strategy (5+ years)',
            
            // Country-specific recommendations
            countrySpecificActions: 'Country-specific Actions',
            regulatoryCompliance: 'Regulatory Compliance Checklist',
            contributionTiming: 'Optimal Contribution Timing',
            taxDeadlines: 'Important Tax Deadlines',
            
            // Final recommendations
            nextSteps: 'Next Steps',
            reviewSchedule: 'Review Schedule',
            professionalAdvice: 'Professional Advice',
            
            // Summary
            overallAssessment: 'Overall Assessment',
            readyForRetirement: 'Ready for Retirement',
            needsWork: 'Needs Work',
            onTrack: 'On Track'
        }
    };
    
    const t = content[language] || content.en;
    
    // Input validation
    const inputValidation = window.InputValidation ? 
        window.InputValidation.validators.retirementProjectionInputs(inputs) : 
        { valid: true, warnings: [], errors: [] };
    
    // Calculate overall assessment
    const overallScore = window.calculateOverallFinancialHealthScore ? 
        window.calculateOverallFinancialHealthScore(inputs) : 0;
    
    const getOverallStatus = (score) => {
        if (score >= 80) return { status: t.readyForRetirement, color: 'green' };
        if (score >= 60) return { status: t.onTrack, color: 'yellow' };
        return { status: t.needsWork, color: 'red' };
    };
    
    const overallStatus = getOverallStatus(overallScore);
    
    // Generate improvement suggestions
    const suggestions = window.generateImprovementSuggestions ? 
        window.generateImprovementSuggestions(inputs, language) : [];
    
    return createElement('div', { 
        className: "review-step space-y-8" 
    }, [
        // Header
        createElement('div', {
            key: 'header',
            className: 'text-center mb-8'
        }, [
            createElement('h2', {
                key: 'title',
                className: 'text-3xl font-bold text-gray-800 mb-2'
            }, t.title),
            createElement('p', {
                key: 'subtitle',
                className: 'text-gray-600 max-w-2xl mx-auto'
            }, t.subtitle)
        ]),
        
        // Overall Assessment
        createElement('div', {
            key: 'overall-assessment',
            className: `bg-${overallStatus.color}-50 rounded-xl p-6 border border-${overallStatus.color}-200 mb-8`
        }, [
            createElement('h3', {
                key: 'assessment-title',
                className: `text-xl font-semibold text-${overallStatus.color}-800 mb-4 text-center`
            }, t.overallAssessment),
            createElement('div', {
                key: 'score-display',
                className: 'text-center'
            }, [
                createElement('div', {
                    key: 'score-number',
                    className: `text-4xl font-bold text-${overallStatus.color}-700`
                }, `${overallScore}/100`),
                createElement('div', {
                    key: 'score-status',
                    className: `text-xl font-medium text-${overallStatus.color}-600 mt-2`
                }, overallStatus.status)
            ])
        ]),
        
        // Financial Health Score Enhanced Component
        window.FinancialHealthScoreEnhanced && createElement('div', {
            key: 'financial-health-score-wrapper',
            className: "mb-8"
        }, [
            createElement(window.FinancialHealthScoreEnhanced, {
                key: 'enhanced-score',
                inputs: inputs,
                language: language
            })
        ]),
        
        // Additional Income Tax Analysis
        window.AdditionalIncomeTaxPanel && createElement(window.AdditionalIncomeTaxPanel, {
            key: 'additional-income-tax',
            inputs: inputs,
            language: language,
            workingCurrency: workingCurrency
        }),
        
        // Couple Compatibility Analysis
        inputs.partnerPlanningEnabled && window.CoupleCompatibilityPanel && createElement(window.CoupleCompatibilityPanel, {
            key: 'couple-compatibility',
            inputs: inputs,
            language: language
        }),
        
        // Retirement Projection Charts
        window.RetirementProjectionPanel && createElement(window.RetirementProjectionPanel, {
            key: 'retirement-projection',
            inputs: inputs,
            language: language,
            workingCurrency: workingCurrency
        }),
        
        // Expense Analysis
        window.ExpenseAnalysisPanel && createElement(window.ExpenseAnalysisPanel, {
            key: 'expense-analysis',
            inputs: inputs,
            language: language,
            workingCurrency: workingCurrency
        }),
        
        // Action Items Section
        suggestions.length > 0 && createElement('div', {
            key: 'action-items',
            className: "bg-white rounded-xl p-6 border border-gray-200"
        }, [
            createElement('h3', {
                key: 'action-title',
                className: "text-xl font-semibold text-gray-800 mb-6 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '✅'),
                t.actionItems
            ]),
            
            // Immediate actions (high priority)
            createElement('div', {
                key: 'immediate-actions',
                className: "mb-6"
            }, [
                createElement('h4', {
                    key: 'immediate-title',
                    className: "font-medium text-red-700 mb-3"
                }, t.immediateActions),
                createElement('div', {
                    key: 'immediate-list',
                    className: "space-y-2"
                }, suggestions.filter(s => s.priority === 'high').map((suggestion, index) => 
                    createElement('div', {
                        key: `immediate-${index}`,
                        className: "p-3 bg-red-50 rounded-lg border border-red-200"
                    }, [
                        createElement('div', {
                            key: 'category',
                            className: "font-medium text-red-800"
                        }, suggestion.category),
                        createElement('div', {
                            key: 'action',
                            className: "text-sm text-red-700 mt-1"
                        }, suggestion.action)
                    ])
                ))
            ]),
            
            // Short-term goals (medium priority)
            suggestions.filter(s => s.priority === 'medium').length > 0 && createElement('div', {
                key: 'short-term-goals',
                className: "mb-6"
            }, [
                createElement('h4', {
                    key: 'short-term-title',
                    className: "font-medium text-yellow-700 mb-3"
                }, t.shortTermGoals),
                createElement('div', {
                    key: 'short-term-list',
                    className: "space-y-2"
                }, suggestions.filter(s => s.priority === 'medium').map((suggestion, index) => 
                    createElement('div', {
                        key: `short-term-${index}`,
                        className: "p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                    }, [
                        createElement('div', {
                            key: 'category',
                            className: "font-medium text-yellow-800"
                        }, suggestion.category),
                        createElement('div', {
                            key: 'action',
                            className: "text-sm text-yellow-700 mt-1"
                        }, suggestion.action)
                    ])
                ))
            ]),
            
            // Long-term strategy (low priority)
            suggestions.filter(s => s.priority === 'low').length > 0 && createElement('div', {
                key: 'long-term-strategy',
                className: "mb-6"
            }, [
                createElement('h4', {
                    key: 'long-term-title',
                    className: "font-medium text-green-700 mb-3"
                }, t.longTermStrategy),
                createElement('div', {
                    key: 'long-term-list',
                    className: "space-y-2"
                }, suggestions.filter(s => s.priority === 'low').map((suggestion, index) => 
                    createElement('div', {
                        key: `long-term-${index}`,
                        className: "p-3 bg-green-50 rounded-lg border border-green-200"
                    }, [
                        createElement('div', {
                            key: 'category',
                            className: "font-medium text-green-800"
                        }, suggestion.category),
                        createElement('div', {
                            key: 'action',
                            className: "text-sm text-green-700 mt-1"
                        }, suggestion.action)
                    ])
                ))
            ])
        ]),
        
        // Country-specific recommendations
        createElement('div', {
            key: 'country-specific',
            className: "bg-blue-50 rounded-xl p-6 border border-blue-200"
        }, [
            createElement('h3', {
                key: 'country-title',
                className: "text-xl font-semibold text-blue-800 mb-6 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '🌍'),
                t.countrySpecificActions
            ]),
            
            createElement('div', {
                key: 'country-content',
                className: "grid grid-cols-1 md:grid-cols-2 gap-4"
            }, [
                createElement('div', {
                    key: 'compliance',
                    className: "p-4 bg-white rounded-lg border border-blue-100"
                }, [
                    createElement('h4', {
                        key: 'compliance-title',
                        className: "font-medium text-blue-800 mb-2"
                    }, t.regulatoryCompliance),
                    createElement('ul', {
                        key: 'compliance-list',
                        className: "text-sm text-blue-700 space-y-1"
                    }, [
                        createElement('li', { key: 'check-1' }, '• Review pension fund performance annually'),
                        createElement('li', { key: 'check-2' }, '• Verify contribution rates meet regulations'),
                        createElement('li', { key: 'check-3' }, '• Update beneficiary information'),
                        createElement('li', { key: 'check-4' }, '• Monitor tax-deductible limits')
                    ])
                ]),
                
                createElement('div', {
                    key: 'timing',
                    className: "p-4 bg-white rounded-lg border border-blue-100"
                }, [
                    createElement('h4', {
                        key: 'timing-title',
                        className: "font-medium text-blue-800 mb-2"
                    }, t.contributionTiming),
                    createElement('ul', {
                        key: 'timing-list',
                        className: "text-sm text-blue-700 space-y-1"
                    }, [
                        createElement('li', { key: 'time-1' }, '• Maximize contributions before year-end'),
                        createElement('li', { key: 'time-2' }, '• Consider bonus allocation strategies'),
                        createElement('li', { key: 'time-3' }, '• Plan training fund distributions'),
                        createElement('li', { key: 'time-4' }, '• Review rates annually in January')
                    ])
                ])
            ])
        ]),
        
        // Input validation warnings
        (!inputValidation.valid || inputValidation.warnings.length > 0) && createElement('div', {
            key: 'validation-warnings',
            className: "bg-yellow-50 rounded-lg p-6 border border-yellow-200"
        }, [
            createElement('h4', {
                key: 'validation-title',
                className: "font-semibold text-yellow-800 mb-3"
            }, 'Data Validation Notes'),
            
            inputValidation.errors?.length > 0 && createElement('div', {
                key: 'errors',
                className: "mb-4"
            }, [
                createElement('h5', {
                    key: 'errors-title',
                    className: "font-medium text-red-700 mb-2"
                }, 'Errors:'),
                createElement('ul', {
                    key: 'errors-list',
                    className: "space-y-1"
                }, inputValidation.errors.map((error, index) => 
                    createElement('li', {
                        key: `error-${index}`,
                        className: "text-sm text-red-600"
                    }, `• ${error}`)
                ))
            ]),
            
            inputValidation.warnings?.length > 0 && createElement('div', {
                key: 'warnings',
                className: "mb-4"
            }, [
                createElement('h5', {
                    key: 'warnings-title',
                    className: "font-medium text-yellow-700 mb-2"
                }, 'Warnings:'),
                createElement('ul', {
                    key: 'warnings-list',
                    className: "space-y-1"
                }, inputValidation.warnings.map((warning, index) => 
                    createElement('li', {
                        key: `warning-${index}`,
                        className: "text-sm text-yellow-600"
                    }, `• ${warning}`)
                ))
            ])
        ]),
        
        // Next steps
        createElement('div', {
            key: 'next-steps',
            className: "bg-gray-50 rounded-xl p-6 border border-gray-200 text-center"
        }, [
            createElement('h3', {
                key: 'next-title',
                className: "text-xl font-semibold text-gray-800 mb-4"
            }, t.nextSteps),
            createElement('div', {
                key: 'next-content',
                className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600"
            }, [
                createElement('div', {
                    key: 'step-1',
                    className: "p-4 bg-white rounded-lg"
                }, [
                    createElement('div', { key: 'icon', className: "text-2xl mb-2" }, '📋'),
                    createElement('div', { key: 'text' }, 'Review and implement immediate actions')
                ]),
                createElement('div', {
                    key: 'step-2',
                    className: "p-4 bg-white rounded-lg"
                }, [
                    createElement('div', { key: 'icon', className: "text-2xl mb-2" }, '📅'),
                    createElement('div', { key: 'text' }, 'Schedule quarterly plan reviews')
                ]),
                createElement('div', {
                    key: 'step-3',
                    className: "p-4 bg-white rounded-lg"
                }, [
                    createElement('div', { key: 'icon', className: "text-2xl mb-2" }, '👥'),
                    createElement('div', { key: 'text' }, 'Consider professional financial advice')
                ])
            ])
        ])
    ]);
};

// Export to window for global access
window.WizardStepReview = WizardStepReview;

console.log('✅ WizardStepReview (refactored) component loaded successfully');