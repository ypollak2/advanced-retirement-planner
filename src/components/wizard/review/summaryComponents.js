// Summary Components Module
// UI components for displaying review summary information

// Overall Assessment Component
function OverallAssessment({ overallScore, overallStatus, language }) {
    const t = window.ReviewContent ? window.ReviewContent.getReviewContent()[language] : {};
    
    return React.createElement('div', {
        key: 'overall-assessment',
        className: `bg-${overallStatus.color}-50 rounded-xl p-6 border border-${overallStatus.color}-200 mb-8`
    }, [
        React.createElement('h3', {
            key: 'assessment-title',
            className: `text-xl font-semibold text-${overallStatus.color}-800 mb-4 text-center`
        }, t.overallAssessment),
        React.createElement('div', {
            key: 'score-display',
            className: 'text-center'
        }, [
            React.createElement('div', {
                key: 'score-number',
                className: `text-4xl font-bold text-${overallStatus.color}-700`
            }, `${overallScore}/100`),
            React.createElement('div', {
                key: 'score-status',
                className: `text-xl font-medium text-${overallStatus.color}-600 mt-2`
            }, overallStatus.status)
        ])
    ]);
}

// Component Scores Section
function ComponentScores({ financialHealthScore, overallScore, safeTotalAccumulation, safeTotalMonthlyIncome, language, workingCurrency }) {
    const t = window.ReviewContent ? window.ReviewContent.getReviewContent()[language] : {};
    
    return React.createElement('div', {
        key: 'component-scores',
        className: "component-scores mb-8",
        id: "component-scores"
    }, [
        React.createElement('h3', {
            key: 'scores-title',
            className: "text-xl font-semibold text-gray-800 mb-4"
        }, t.componentScores || 'Component Scores'),
        
        React.createElement('div', {
            key: 'scores-grid',
            className: "grid grid-cols-2 md:grid-cols-4 gap-4"
        }, [
            React.createElement('div', {
                key: 'health-score',
                className: "p-3 bg-blue-50 rounded-lg text-center"
            }, [
                React.createElement('div', { key: 'health-value', className: "text-2xl font-bold text-blue-600" }, 
                    `${Math.round(financialHealthScore.totalScore || 0)}`),
                React.createElement('div', { key: 'health-label', className: "text-sm text-blue-700" }, 
                    t.financialHealth || 'Financial Health')
            ]),
            
            React.createElement('div', {
                key: 'retirement-readiness',
                className: "p-3 bg-green-50 rounded-lg text-center"
            }, [
                React.createElement('div', { key: 'readiness-value', className: "text-2xl font-bold text-green-600" }, 
                    `${Math.round(overallScore)}`),
                React.createElement('div', { key: 'readiness-label', className: "text-sm text-green-700" }, 
                    t.retirementReadiness || 'Retirement Readiness')
            ]),
            
            React.createElement('div', {
                key: 'accumulation-progress',
                className: "p-3 bg-purple-50 rounded-lg text-center"
            }, [
                React.createElement('div', { key: 'accumulation-value', className: "text-lg font-bold text-purple-600" }, 
                    window.formatCurrency ? window.formatCurrency(safeTotalAccumulation, workingCurrency) : `${workingCurrency}${safeTotalAccumulation.toLocaleString()}`),
                React.createElement('div', { key: 'accumulation-label', className: "text-sm text-purple-700" }, 
                    t.totalAccumulation || 'Total Accumulation')
            ]),
            
            React.createElement('div', {
                key: 'monthly-income',
                className: "p-3 bg-orange-50 rounded-lg text-center"
            }, [
                React.createElement('div', { key: 'income-value', className: "text-lg font-bold text-orange-600" }, 
                    window.formatCurrency ? window.formatCurrency(safeTotalMonthlyIncome, workingCurrency) : `${workingCurrency}${safeTotalMonthlyIncome.toLocaleString()}`),
                React.createElement('div', { key: 'income-label', className: "text-sm text-orange-700" }, 
                    t.totalMonthlyIncome || 'Total Monthly Income (Gross)')
            ])
        ])
    ]);
}

// Next Steps Component
function NextSteps({ language }) {
    const t = window.ReviewContent ? window.ReviewContent.getReviewContent()[language] : {};
    
    return React.createElement('div', {
        key: 'next-steps',
        className: "bg-gray-50 rounded-xl p-6 border border-gray-200 text-center"
    }, [
        React.createElement('h3', {
            key: 'next-title',
            className: "text-xl font-semibold text-gray-800 mb-4"
        }, t.nextSteps),
        React.createElement('div', {
            key: 'next-content',
            className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600"
        }, [
            React.createElement('div', {
                key: 'step-1',
                className: "p-4 bg-white rounded-lg"
            }, [
                React.createElement('div', { key: 'icon', className: "text-2xl mb-2" }, '📋'),
                React.createElement('div', { key: 'text' }, t.reviewImplementActions || 'Review and implement immediate actions')
            ]),
            React.createElement('div', {
                key: 'step-2',
                className: "p-4 bg-white rounded-lg"
            }, [
                React.createElement('div', { key: 'icon', className: "text-2xl mb-2" }, '📅'),
                React.createElement('div', { key: 'text' }, t.scheduleReviews || 'Schedule quarterly plan reviews')
            ]),
            React.createElement('div', {
                key: 'step-3',
                className: "p-4 bg-white rounded-lg"
            }, [
                React.createElement('div', { key: 'icon', className: "text-2xl mb-2" }, '👥'),
                React.createElement('div', { key: 'text' }, t.considerAdvice || 'Consider professional financial advice')
            ])
        ])
    ]);
}

// Validation Results Component
function ValidationResults({ inputValidation, language }) {
    if (!inputValidation.warnings?.length && !inputValidation.errors?.length) {
        return null;
    }
    
    return React.createElement('div', {
        key: 'validation-results',
        className: "mb-8"
    }, [
        inputValidation.errors?.length > 0 && React.createElement('div', {
            key: 'errors',
            className: "bg-red-50 rounded-xl p-6 border border-red-200 mb-4"
        }, [
            React.createElement('h4', {
                key: 'error-title',
                className: "text-lg font-semibold text-red-800 mb-3"
            }, language === 'he' ? 'שגיאות' : 'Errors'),
            React.createElement('ul', {
                key: 'error-list',
                className: "space-y-2"
            }, inputValidation.errors.map((error, index) => 
                React.createElement('li', {
                    key: `error-${index}`,
                    className: "text-sm text-red-600"
                }, `• ${error}`)
            ))
        ]),
        
        inputValidation.warnings?.length > 0 && React.createElement('div', {
            key: 'warnings',
            className: "bg-yellow-50 rounded-xl p-6 border border-yellow-200"
        }, [
            React.createElement('h4', {
                key: 'warning-title',
                className: "text-lg font-semibold text-yellow-800 mb-3"
            }, language === 'he' ? 'אזהרות' : 'Warnings'),
            React.createElement('ul', {
                key: 'warning-list',
                className: "space-y-2"
            }, inputValidation.warnings.map((warning, index) => 
                React.createElement('li', {
                    key: `warning-${index}`,
                    className: "text-sm text-yellow-600"
                }, `• ${warning}`)
            ))
        ])
    ]);
}

// Debug Panel Wrapper
function DebugPanelWrapper({ financialHealthScore, processedInputs, language }) {
    const showDebug = (new URLSearchParams(window.location.search)).get('debug') === 'true' || 
                    (financialHealthScore.totalScore !== undefined && financialHealthScore.totalScore < 30);
    
    return showDebug && window.ScoreDebugPanel && React.createElement('div', {
        key: 'debug-panel-wrapper',
        className: 'mb-8'
    }, [
        React.createElement(window.ScoreDebugPanel, {
            key: 'debug-panel',
            financialHealthScore: financialHealthScore,
            inputs: processedInputs,
            language: language
        })
    ]);
}

// Export to window
window.ReviewSummaryComponents = {
    OverallAssessment,
    ComponentScores,
    NextSteps,
    ValidationResults,
    DebugPanelWrapper
};

console.log('✅ Review summary components module loaded');