// RetirementProjectionPanel.js - Retirement Projection Charts and Analysis Component
// Extracted from WizardStepReview.js for better modularity

const RetirementProjectionPanel = ({ inputs, language = 'en', workingCurrency = 'ILS' }) => {
    const createElement = React.createElement;
    
    // Multi-language content
    const content = {
        he: {
            retirementProjection: 'תחזית פרישה',
            projectedSavings: 'חיסכון צפוי',
            monthlyIncome: 'הכנסה חודשית בפרישה',
            savingsTrajectory: 'מסלול חיסכון',
            scenarioAnalysis: 'ניתוח תרחישים',
            
            // Scenarios
            optimistic: 'אופטימי',
            realistic: 'ריאלי',
            conservative: 'שמרני',
            
            // Chart elements
            currentAge: 'גיל נוכחי',
            retirementAge: 'גיל פרישה',
            projectedAmount: 'סכום צפוי',
            monthlyPension: 'פנסיה חודשית',
            
            // Status indicators
            onTrack: 'במסלול',
            needsImprovement: 'דורש שיפור',
            critical: 'קריטי',
            
            // Recommendations
            increaseContributions: 'העלה הפקדות',
            extendWorkingYears: 'הארך שנות עבודה',
            improveReturns: 'שפר תשואות',
            reduceExpenses: 'צמצם הוצאות',
            
            // Chart not available
            chartNotAvailable: 'תרשים לא זמין - אנא ודא שכל הנתונים הנדרשים הוזנו',
            missingData: 'נתונים חסרים לחישוב תחזית'
        },
        en: {
            retirementProjection: 'Retirement Projection',
            projectedSavings: 'Projected Savings',
            monthlyIncome: 'Monthly Retirement Income',
            savingsTrajectory: 'Savings Trajectory',
            scenarioAnalysis: 'Scenario Analysis',
            
            // Scenarios
            optimistic: 'Optimistic',
            realistic: 'Realistic',
            conservative: 'Conservative',
            
            // Chart elements
            currentAge: 'Current Age',
            retirementAge: 'Retirement Age',
            projectedAmount: 'Projected Amount',
            monthlyPension: 'Monthly Pension',
            
            // Status indicators
            onTrack: 'On Track',
            needsImprovement: 'Needs Improvement',
            critical: 'Critical',
            
            // Recommendations
            increaseContributions: 'Increase Contributions',
            extendWorkingYears: 'Extend Working Years',
            improveReturns: 'Improve Returns',
            reduceExpenses: 'Reduce Expenses',
            
            // Chart not available
            chartNotAvailable: 'Chart not available - please ensure all required data is entered',
            missingData: 'Missing data for projection calculation'
        }
    };
    
    const t = content[language] || content.en;
    
    // Currency formatter
    const formatCurrency = (amount) => {
        const symbol = workingCurrency === 'ILS' ? '₪' : workingCurrency;
        return `${symbol}${Math.round(amount).toLocaleString()}`;
    };
    
    // Check if chart generation is available
    if (!window.generateRetirementProjectionChart) {
        return createElement('div', {
            className: "bg-gray-50 rounded-lg p-6 border border-gray-200 mb-6"
        }, [
            createElement('h3', {
                key: 'title',
                className: "text-xl font-semibold text-gray-700 mb-4 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '📈'),
                t.retirementProjection
            ]),
            createElement('div', {
                key: 'message',
                className: "text-center text-gray-600"
            }, t.chartNotAvailable)
        ]);
    }
    
    // Generate chart data
    const chartData = window.generateRetirementProjectionChart(inputs);
    
    if (!chartData || !chartData.projections) {
        return createElement('div', {
            className: "bg-yellow-50 rounded-lg p-6 border border-yellow-200 mb-6"
        }, [
            createElement('h3', {
                key: 'title',
                className: "text-xl font-semibold text-yellow-800 mb-4 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '⚠️'),
                t.retirementProjection
            ]),
            createElement('div', {
                key: 'message',
                className: "text-center text-yellow-700"
            }, t.missingData)
        ]);
    }
    
    // Get projection status and color
    const getProjectionStatus = (finalAmount, targetAmount) => {
        const ratio = targetAmount > 0 ? finalAmount / targetAmount : 1;
        if (ratio >= 1.0) return { status: t.onTrack, color: 'green' };
        if (ratio >= 0.8) return { status: t.needsImprovement, color: 'yellow' };
        return { status: t.critical, color: 'red' };
    };
    
    const currentAge = parseFloat(inputs.currentAge || 30);
    const retirementAge = parseFloat(inputs.retirementAge || 67);
    const yearsToRetirement = retirementAge - currentAge;
    
    // Calculate target retirement amount (rough estimate)
    const monthlyIncome = parseFloat(inputs.currentMonthlySalary || 0);
    const targetMonthlyPension = monthlyIncome * 0.7; // 70% replacement ratio
    const targetRetirementAmount = targetMonthlyPension * 12 * 25; // 25 years of retirement
    
    const realisticProjection = chartData.projections.realistic || chartData.projections[0];
    const projectionStatus = getProjectionStatus(realisticProjection?.finalAmount || 0, targetRetirementAmount);
    
    return createElement('div', {
        className: "bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 mb-6"
    }, [
        // Header
        createElement('h3', {
            key: 'title',
            className: "text-xl font-semibold text-blue-800 mb-4 flex items-center"
        }, [
            createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '📈'),
            t.retirementProjection
        ]),
        
        // Key metrics summary
        createElement('div', {
            key: 'metrics-summary',
            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        }, [
            // Current Age
            createElement('div', {
                key: 'current-age',
                className: "text-center p-3 bg-white rounded-lg border border-blue-100"
            }, [
                createElement('div', {
                    key: 'label',
                    className: "text-sm text-gray-600 mb-1"
                }, t.currentAge),
                createElement('div', {
                    key: 'value',
                    className: "text-lg font-bold text-blue-700"
                }, currentAge)
            ]),
            
            // Years to Retirement
            createElement('div', {
                key: 'years-to-retirement',
                className: "text-center p-3 bg-white rounded-lg border border-blue-100"
            }, [
                createElement('div', {
                    key: 'label',
                    className: "text-sm text-gray-600 mb-1"
                }, 'Years to Retirement'),
                createElement('div', {
                    key: 'value',
                    className: "text-lg font-bold text-blue-700"
                }, yearsToRetirement)
            ]),
            
            // Projected Amount
            realisticProjection && createElement('div', {
                key: 'projected-amount',
                className: "text-center p-3 bg-white rounded-lg border border-blue-100"
            }, [
                createElement('div', {
                    key: 'label',
                    className: "text-sm text-gray-600 mb-1"
                }, t.projectedAmount),
                createElement('div', {
                    key: 'value',
                    className: `text-lg font-bold text-${projectionStatus.color}-600`
                }, formatCurrency(realisticProjection.finalAmount))
            ]),
            
            // Monthly Pension
            realisticProjection && createElement('div', {
                key: 'monthly-pension',
                className: "text-center p-3 bg-white rounded-lg border border-blue-100"
            }, [
                createElement('div', {
                    key: 'label',
                    className: "text-sm text-gray-600 mb-1"
                }, t.monthlyPension),
                createElement('div', {
                    key: 'value',
                    className: `text-lg font-bold text-${projectionStatus.color}-600`
                }, formatCurrency((realisticProjection.finalAmount * 0.04) / 12)) // 4% withdrawal rule
            ])
        ]),
        
        // Status indicator
        createElement('div', {
            key: 'status-indicator',
            className: `bg-${projectionStatus.color}-100 rounded-lg p-4 mb-6 border border-${projectionStatus.color}-200`
        }, [
            createElement('div', {
                key: 'status-display',
                className: "text-center"
            }, [
                createElement('div', {
                    key: 'status-label',
                    className: `text-lg font-semibold text-${projectionStatus.color}-800`
                }, projectionStatus.status),
                createElement('div', {
                    key: 'status-detail',
                    className: `text-sm text-${projectionStatus.color}-700 mt-1`
                }, targetRetirementAmount > 0 ? 
                    `${Math.round((realisticProjection?.finalAmount || 0) / targetRetirementAmount * 100)}% of target retirement savings` :
                    'Calculating retirement target...')
            ])
        ]),
        
        // Scenario projections
        chartData.projections.length > 1 && createElement('div', {
            key: 'scenario-projections',
            className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        }, [
            // Optimistic scenario
            chartData.projections.optimistic && createElement('div', {
                key: 'optimistic',
                className: "bg-green-50 rounded-lg p-4 border border-green-200"
            }, [
                createElement('h4', {
                    key: 'title',
                    className: "font-semibold text-green-800 mb-2"
                }, `📈 ${t.optimistic}`),
                createElement('div', {
                    key: 'amount',
                    className: "text-xl font-bold text-green-700"
                }, formatCurrency(chartData.projections.optimistic.finalAmount)),
                createElement('div', {
                    key: 'assumptions',
                    className: "text-xs text-green-600 mt-1"
                }, 'Higher returns scenario')
            ]),
            
            // Realistic scenario
            chartData.projections.realistic && createElement('div', {
                key: 'realistic',
                className: "bg-blue-50 rounded-lg p-4 border border-blue-200"
            }, [
                createElement('h4', {
                    key: 'title',
                    className: "font-semibold text-blue-800 mb-2"
                }, `📊 ${t.realistic}`),
                createElement('div', {
                    key: 'amount',
                    className: "text-xl font-bold text-blue-700"
                }, formatCurrency(chartData.projections.realistic.finalAmount)),
                createElement('div', {
                    key: 'assumptions',
                    className: "text-xs text-blue-600 mt-1"
                }, 'Expected returns scenario')
            ]),
            
            // Conservative scenario
            chartData.projections.conservative && createElement('div', {
                key: 'conservative',
                className: "bg-orange-50 rounded-lg p-4 border border-orange-200"
            }, [
                createElement('h4', {
                    key: 'title',
                    className: "font-semibold text-orange-800 mb-2"
                }, `📉 ${t.conservative}`),
                createElement('div', {
                    key: 'amount',
                    className: "text-xl font-bold text-orange-700"
                }, formatCurrency(chartData.projections.conservative.finalAmount)),
                createElement('div', {
                    key: 'assumptions',
                    className: "text-xs text-orange-600 mt-1"
                }, 'Lower returns scenario')
            ])
        ]),
        
        // Chart placeholder (actual chart would be rendered here)
        createElement('div', {
            key: 'chart-container',
            className: "bg-white rounded-lg p-6 border border-blue-100 mb-6"
        }, [
            createElement('h4', {
                key: 'chart-title',
                className: "font-semibold text-blue-800 mb-4"
            }, t.savingsTrajectory),
            createElement('div', {
                key: 'chart-placeholder',
                className: "h-64 bg-gray-100 rounded flex items-center justify-center"
            }, [
                createElement('div', {
                    key: 'chart-message',
                    className: "text-gray-500 text-center"
                }, [
                    createElement('div', { key: 'icon', className: "text-4xl mb-2" }, '📊'),
                    createElement('div', { key: 'text' }, 'Interactive chart would be rendered here'),
                    createElement('div', { key: 'note', className: "text-sm mt-2" }, 
                        `Showing savings growth from age ${currentAge} to ${retirementAge}`)
                ])
            ])
        ]),
        
        // Improvement recommendations
        projectionStatus.color !== 'green' && createElement('div', {
            key: 'recommendations',
            className: "p-4 bg-yellow-50 rounded-lg border border-yellow-200"
        }, [
            createElement('h4', {
                key: 'rec-title',
                className: "font-semibold text-yellow-800 mb-3 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-2" }, '💡'),
                'Improvement Recommendations'
            ]),
            createElement('div', {
                key: 'rec-grid',
                className: "grid grid-cols-1 md:grid-cols-2 gap-3"
            }, [
                createElement('div', {
                    key: 'increase-contrib',
                    className: "flex items-center p-2 bg-white rounded border border-yellow-100"
                }, [
                    createElement('span', { key: 'icon', className: "mr-2" }, '💰'),
                    t.increaseContributions
                ]),
                createElement('div', {
                    key: 'extend-work',
                    className: "flex items-center p-2 bg-white rounded border border-yellow-100"
                }, [
                    createElement('span', { key: 'icon', className: "mr-2" }, '⏰'),
                    t.extendWorkingYears
                ]),
                createElement('div', {
                    key: 'improve-returns',
                    className: "flex items-center p-2 bg-white rounded border border-yellow-100"
                }, [
                    createElement('span', { key: 'icon', className: "mr-2" }, '📈'),
                    t.improveReturns
                ]),
                createElement('div', {
                    key: 'reduce-expenses',
                    className: "flex items-center p-2 bg-white rounded border border-yellow-100"
                }, [
                    createElement('span', { key: 'icon', className: "mr-2" }, '💸'),
                    t.reduceExpenses
                ])
            ])
        ])
    ]);
};

// Export to window for global access
window.RetirementProjectionPanel = RetirementProjectionPanel;

console.log('✅ RetirementProjectionPanel component loaded successfully');