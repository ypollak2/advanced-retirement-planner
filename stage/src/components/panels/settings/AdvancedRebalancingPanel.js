// Advanced Rebalancing Panel - UX for portfolio rebalancing analysis and automation
// Provides intelligent rebalancing suggestions with tax optimization and scheduling

const AdvancedRebalancingPanel = ({ inputs, results, onInputChange, language = 'en' }) => {
    const createElement = React.createElement;
    
    // Multi-language content
    const content = {
        he: {
            title: 'איזון תיק מתקדם',
            subtitle: 'ניתוח והמלצות לאיזון אופטימלי של תיק ההשקעות',
            noData: 'אין נתונים זמינים לאיזון תיק',
            currentStatus: 'מצב נוכחי',
            rebalancingNeeds: 'צרכי איזון',
            taxImplications: 'השלכות מס',
            recommendations: 'המלצות',
            automationSettings: 'הגדרות אוטומציה',
            implementation: 'יישום',
            schedule: 'לוח זמנים',
            costBenefit: 'ניתוח עלות-תועלת',
            deviations: 'סטיות מהיעד',
            urgency: 'דחיפות',
            urgencyLevels: {
                none: 'אין צורך',
                low: 'נמוכה',
                medium: 'בינונית', 
                high: 'גבוהה',
                critical: 'קריטית'
            },
            triggers: 'טריגרים',
            lastRebalance: 'איזון אחרון',
            nextScheduled: 'הבא מתוכנן',
            portfolio: 'תיק השקעות',
            target: 'יעד',
            current: 'נוכחי',
            deviation: 'סטייה',
            action: 'פעולה',
            buy: 'רכוש',
            sell: 'מכור',
            hold: 'החזק',
            costs: 'עלויות',
            benefits: 'יתרונות',
            netBenefit: 'תועלת נטו',
            taxCost: 'עלות מס',
            tradingCost: 'עלות מסחר',
            annualBenefit: 'תועלת שנתית',
            paybackPeriod: 'תקופת החזר',
            proceed: 'המשך',
            consider: 'שקול',
            defer: 'דחה',
            frequency: 'תדירות',
            threshold: 'סף סטייה',
            autoExecute: 'ביצוע אוטומטי',
            notifications: 'התראות',
            enable: 'אפשר',
            disable: 'השבת',
            configure: 'הגדר',
            analyze: 'נתח',
            implement: 'יישם',
            quarterly: 'רבעוני',
            semiAnnual: 'חצי שנתי',
            annual: 'שנתי',
            percentage: '%',
            currency: '₪',
            months: 'חודשים',
            weeks: 'שבועות',
            days: 'ימים',
            high: 'גבוה',
            medium: 'בינוני',
            low: 'נמוך'
        },
        en: {
            title: 'Advanced Portfolio Rebalancing',
            subtitle: 'Intelligent rebalancing analysis and optimization for your investment portfolio',
            noData: 'No data available for portfolio rebalancing',
            currentStatus: 'Current Status',
            rebalancingNeeds: 'Rebalancing Needs',
            taxImplications: 'Tax Implications',
            recommendations: 'Recommendations',
            automationSettings: 'Automation Settings',
            implementation: 'Implementation',
            schedule: 'Schedule',
            costBenefit: 'Cost-Benefit Analysis',
            deviations: 'Target Deviations',
            urgency: 'Urgency',
            urgencyLevels: {
                none: 'None',
                low: 'Low',
                medium: 'Medium',
                high: 'High',
                critical: 'Critical'
            },
            triggers: 'Triggers',
            lastRebalance: 'Last Rebalance',
            nextScheduled: 'Next Scheduled',
            portfolio: 'Portfolio',
            target: 'Target',
            current: 'Current',
            deviation: 'Deviation',
            action: 'Action',
            buy: 'Buy',
            sell: 'Sell',
            hold: 'Hold',
            costs: 'Costs',
            benefits: 'Benefits',
            netBenefit: 'Net Benefit',
            taxCost: 'Tax Cost',
            tradingCost: 'Trading Cost',
            annualBenefit: 'Annual Benefit',
            paybackPeriod: 'Payback Period',
            proceed: 'Proceed',
            consider: 'Consider',
            defer: 'Defer',
            frequency: 'Frequency',
            threshold: 'Threshold',
            autoExecute: 'Auto Execute',
            notifications: 'Notifications',
            enable: 'Enable',
            disable: 'Disable',
            configure: 'Configure',
            analyze: 'Analyze',
            implement: 'Implement',
            quarterly: 'Quarterly',
            semiAnnual: 'Semi-Annual',
            annual: 'Annual',
            percentage: '%',
            currency: '₪',
            months: 'months',
            weeks: 'weeks',
            days: 'days',
            high: 'High',
            medium: 'Medium',
            low: 'Low'
        }
    };
    
    const t = content[language];
    
    // State for UI
    const [analysisResults, setAnalysisResults] = React.useState(null);
    const [showDetails, setShowDetails] = React.useState(false);
    const [automationEnabled, setAutomationEnabled] = React.useState(false);
    const [rebalanceSchedule, setRebalanceSchedule] = React.useState(null);
    const [selectedFrequency, setSelectedFrequency] = React.useState('quarterly');
    const [thresholdSetting, setThresholdSetting] = React.useState(8);
    
    // Perform rebalancing analysis on mount and when inputs change
    React.useEffect(() => {
        if (results && window.advancedRebalancing && window.PortfolioOptimizer) {
            try {
                const currentPortfolio = window.PortfolioOptimizer.parseCurrentPortfolio(inputs);
                const targetPortfolio = window.PortfolioOptimizer.calculateOptimalAllocation(
                    inputs.currentAge || 30,
                    inputs.retirementAge || 67,
                    inputs.riskTolerance || 'moderate',
                    inputs
                );
                
                const lastRebalanceDate = inputs.lastRebalanceDate || new Date(Date.now() - 180 * 24 * 60 * 60 * 1000); // 6 months ago default
                
                const analysis = window.advancedRebalancing.analyzeRebalancingNeeds(
                    inputs,
                    currentPortfolio,
                    targetPortfolio,
                    lastRebalanceDate,
                    language
                );
                
                setAnalysisResults(analysis);
                
                // Generate schedule
                const schedule = window.advancedRebalancing.createRebalancingSchedule(
                    inputs,
                    { frequency: selectedFrequency, threshold: thresholdSetting },
                    language
                );
                setRebalanceSchedule(schedule);
                
            } catch (error) {
                console.error('Error analyzing rebalancing needs:', error);
            }
        }
    }, [inputs, results, selectedFrequency, thresholdSetting, language]);
    
    if (!results || !analysisResults) {
        return createElement('div', {
            key: 'no-rebalancing-data',
            className: "bg-gray-50 rounded-xl p-6 border border-gray-200"
        }, [
            createElement('div', {
                key: 'no-data-icon',
                className: "text-center text-gray-400 text-4xl mb-4"
            }, '⚖️'),
            createElement('p', {
                key: 'no-data-text',
                className: "text-gray-600 text-center"
            }, t.noData)
        ]);
    }
    
    // Helper functions
    const formatCurrency = (amount) => {
        return `${t.currency}${Math.round(amount || 0).toLocaleString()}`;
    };
    
    const formatPercentage = (value) => {
        return `${(value || 0).toFixed(1)}${t.percentage}`;
    };
    
    const getUrgencyColor = (urgency) => {
        const colors = {
            none: 'text-green-600 bg-green-50 border-green-200',
            low: 'text-blue-600 bg-blue-50 border-blue-200',
            medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
            high: 'text-orange-600 bg-orange-50 border-orange-200',
            critical: 'text-red-600 bg-red-50 border-red-200'
        };
        return colors[urgency] || colors.medium;
    };
    
    const getPriorityColor = (priority) => {
        const colors = {
            low: 'text-green-600 bg-green-50 border-green-200',
            medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
            high: 'text-orange-600 bg-orange-50 border-orange-200',
            critical: 'text-red-600 bg-red-50 border-red-200'
        };
        return colors[priority] || colors.medium;
    };
    
    const handleAutomationToggle = () => {
        setAutomationEnabled(!automationEnabled);
        if (onInputChange) {
            onInputChange({
                ...inputs,
                rebalancingAutomation: !automationEnabled,
                rebalancingFrequency: selectedFrequency,
                rebalancingThreshold: thresholdSetting
            });
        }
    };
    
    return createElement('div', {
        key: 'advanced-rebalancing-panel',
        className: 'space-y-6'
    }, [
        // Header
        createElement('div', {
            key: 'header',
            className: 'text-center'
        }, [
            createElement('div', {
                key: 'header-icon',
                className: 'text-4xl mb-3'
            }, '⚖️'),
            createElement('h3', {
                key: 'header-title',
                className: 'text-2xl font-bold text-gray-800 mb-2'
            }, t.title),
            createElement('p', {
                key: 'header-subtitle',
                className: 'text-gray-600'
            }, t.subtitle)
        ]),
        
        // Current Status Overview
        createElement('div', {
            key: 'current-status',
            className: 'bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200'
        }, [
            createElement('h4', {
                key: 'status-title',
                className: 'text-xl font-semibold text-blue-800 mb-4 flex items-center'
            }, [
                createElement('span', { key: 'status-icon', className: 'mr-3' }, '📊'),
                t.currentStatus
            ]),
            createElement('div', {
                key: 'status-grid',
                className: 'grid grid-cols-1 md:grid-cols-3 gap-4'
            }, [
                // Urgency Level
                createElement('div', {
                    key: 'urgency-card',
                    className: `text-center p-4 rounded-lg border-2 ${getUrgencyColor(analysisResults.urgency)}`
                }, [
                    createElement('div', {
                        key: 'urgency-label',
                        className: 'text-sm font-medium mb-2'
                    }, t.urgency),
                    createElement('div', {
                        key: 'urgency-value',
                        className: 'text-lg font-bold'
                    }, t.urgencyLevels[analysisResults.urgency])
                ]),
                
                // Triggers Count
                createElement('div', {
                    key: 'triggers-card',
                    className: 'text-center p-4 rounded-lg border-2 border-gray-200 bg-gray-50'
                }, [
                    createElement('div', {
                        key: 'triggers-label',
                        className: 'text-sm font-medium mb-2 text-gray-600'
                    }, t.triggers),
                    createElement('div', {
                        key: 'triggers-value',
                        className: 'text-lg font-bold text-gray-800'
                    }, analysisResults.triggers.length)
                ]),
                
                // Needs Rebalancing
                createElement('div', {
                    key: 'needs-card',
                    className: `text-center p-4 rounded-lg border-2 ${
                        analysisResults.needsRebalancing 
                            ? 'bg-red-50 border-red-200 text-red-600' 
                            : 'bg-green-50 border-green-200 text-green-600'
                    }`
                }, [
                    createElement('div', {
                        key: 'needs-label',
                        className: 'text-sm font-medium mb-2'
                    }, t.rebalancingNeeds),
                    createElement('div', {
                        key: 'needs-value',
                        className: 'text-lg font-bold'
                    }, analysisResults.needsRebalancing ? 
                        (language === 'he' ? 'דרוש' : 'Required') : 
                        (language === 'he' ? 'לא דרוש' : 'Not Required'))
                ])
            ])
        ]),
        
        // Triggers Detail (if any)
        analysisResults.triggers.length > 0 && createElement('div', {
            key: 'triggers-detail',
            className: 'bg-yellow-50 rounded-xl p-6 border border-yellow-200'
        }, [
            createElement('h4', {
                key: 'triggers-title',
                className: 'text-xl font-semibold text-yellow-800 mb-4 flex items-center'
            }, [
                createElement('span', { key: 'triggers-icon', className: 'mr-3' }, '⚠️'),
                t.triggers
            ]),
            createElement('div', {
                key: 'triggers-list',
                className: 'space-y-3'
            }, analysisResults.triggers.map((trigger, index) => 
                createElement('div', {
                    key: `trigger-${index}`,
                    className: 'bg-white rounded-lg p-4 border border-yellow-200'
                }, [
                    createElement('div', {
                        key: `trigger-type-${index}`,
                        className: 'font-semibold text-yellow-800 mb-1'
                    }, trigger.type),
                    createElement('div', {
                        key: `trigger-message-${index}`,
                        className: 'text-sm text-yellow-700'
                    }, trigger.message)
                ])
            ))
        ]),
        
        // Cost-Benefit Analysis
        analysisResults.costBenefit && createElement('div', {
            key: 'cost-benefit',
            className: 'bg-green-50 rounded-xl p-6 border border-green-200'
        }, [
            createElement('h4', {
                key: 'costbenefit-title',
                className: 'text-xl font-semibold text-green-800 mb-4 flex items-center'
            }, [
                createElement('span', { key: 'costbenefit-icon', className: 'mr-3' }, '💰'),
                t.costBenefit
            ]),
            createElement('div', {
                key: 'costbenefit-grid',
                className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'
            }, [
                // Tax Cost
                createElement('div', {
                    key: 'tax-cost',
                    className: 'text-center'
                }, [
                    createElement('div', {
                        key: 'tax-cost-label',
                        className: 'text-sm text-green-600 mb-1'
                    }, t.taxCost),
                    createElement('div', {
                        key: 'tax-cost-value',
                        className: 'text-lg font-bold text-red-600'
                    }, formatCurrency(analysisResults.costBenefit.costs.taxes))
                ]),
                
                // Trading Cost
                createElement('div', {
                    key: 'trading-cost',
                    className: 'text-center'
                }, [
                    createElement('div', {
                        key: 'trading-cost-label',
                        className: 'text-sm text-green-600 mb-1'
                    }, t.tradingCost),
                    createElement('div', {
                        key: 'trading-cost-value',
                        className: 'text-lg font-bold text-orange-600'
                    }, formatCurrency(analysisResults.costBenefit.costs.trading))
                ]),
                
                // Annual Benefit
                createElement('div', {
                    key: 'annual-benefit',
                    className: 'text-center'
                }, [
                    createElement('div', {
                        key: 'annual-benefit-label',
                        className: 'text-sm text-green-600 mb-1'
                    }, t.annualBenefit),
                    createElement('div', {
                        key: 'annual-benefit-value',
                        className: 'text-lg font-bold text-green-600'
                    }, formatCurrency(analysisResults.costBenefit.benefits.annualBenefit))
                ]),
                
                // Net Benefit
                createElement('div', {
                    key: 'net-benefit',
                    className: 'text-center'
                }, [
                    createElement('div', {
                        key: 'net-benefit-label',
                        className: 'text-sm text-green-600 mb-1'
                    }, t.netBenefit),
                    createElement('div', {
                        key: 'net-benefit-value',
                        className: `text-lg font-bold ${
                            analysisResults.costBenefit.netBenefit > 0 ? 'text-green-600' : 'text-red-600'
                        }`
                    }, formatCurrency(analysisResults.costBenefit.netBenefit))
                ])
            ]),
            
            // Recommendation
            createElement('div', {
                key: 'recommendation-banner',
                className: `mt-4 p-3 rounded-lg text-center ${
                    analysisResults.costBenefit.recommendation === 'proceed' ? 
                        'bg-green-100 border border-green-300 text-green-800' :
                    analysisResults.costBenefit.recommendation === 'consider' ?
                        'bg-yellow-100 border border-yellow-300 text-yellow-800' :
                        'bg-red-100 border border-red-300 text-red-800'
                }`
            }, [
                createElement('div', {
                    key: 'recommendation-text',
                    className: 'font-semibold'
                }, `${language === 'he' ? 'המלצה:' : 'Recommendation:'} ${t[analysisResults.costBenefit.recommendation]}`)
            ])
        ]),
        
        // Recommendations
        analysisResults.recommendations?.length > 0 && createElement('div', {
            key: 'recommendations',
            className: 'bg-purple-50 rounded-xl p-6 border border-purple-200'
        }, [
            createElement('h4', {
                key: 'recommendations-title',
                className: 'text-xl font-semibold text-purple-800 mb-4 flex items-center'
            }, [
                createElement('span', { key: 'recommendations-icon', className: 'mr-3' }, '💡'),
                t.recommendations
            ]),
            createElement('div', {
                key: 'recommendations-list',
                className: 'space-y-4'
            }, analysisResults.recommendations.slice(0, 4).map((rec, index) => 
                createElement('div', {
                    key: `recommendation-${index}`,
                    className: `border rounded-lg p-4 ${getPriorityColor(rec.priority)}`
                }, [
                    createElement('div', {
                        key: `rec-header-${index}`,
                        className: 'flex justify-between items-start mb-2'
                    }, [
                        createElement('h5', {
                            key: `rec-title-${index}`,
                            className: 'font-semibold'
                        }, rec.title),
                        createElement('span', {
                            key: `rec-priority-${index}`,
                            className: 'text-xs px-2 py-1 rounded-full bg-white bg-opacity-50'
                        }, t[rec.priority])
                    ]),
                    createElement('p', {
                        key: `rec-description-${index}`,
                        className: 'text-sm mb-3'
                    }, rec.description),
                    rec.actions && createElement('div', {
                        key: `rec-actions-${index}`,
                        className: 'space-y-1'
                    }, rec.actions.map((action, actionIndex) => 
                        createElement('div', {
                            key: `action-${index}-${actionIndex}`,
                            className: 'text-xs flex items-center'
                        }, [
                            createElement('span', {
                                key: `action-bullet-${index}-${actionIndex}`,
                                className: 'mr-2'
                            }, '•'),
                            action
                        ])
                    ))
                ])
            ))
        ]),
        
        // Automation Settings
        createElement('div', {
            key: 'automation-settings',
            className: 'bg-indigo-50 rounded-xl p-6 border border-indigo-200'
        }, [
            createElement('h4', {
                key: 'automation-title',
                className: 'text-xl font-semibold text-indigo-800 mb-4 flex items-center'
            }, [
                createElement('span', { key: 'automation-icon', className: 'mr-3' }, '🤖'),
                t.automationSettings
            ]),
            
            // Enable/Disable Toggle
            createElement('div', {
                key: 'automation-toggle',
                className: 'flex items-center justify-between mb-6'
            }, [
                createElement('span', {
                    key: 'automation-label',
                    className: 'text-indigo-700 font-medium'
                }, language === 'he' ? 'אפשר איזון אוטומטי' : 'Enable Automatic Rebalancing'),
                createElement('button', {
                    key: 'automation-button',
                    onClick: handleAutomationToggle,
                    className: `px-4 py-2 rounded-lg font-semibold ${
                        automationEnabled 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-300 text-gray-700'
                    }`
                }, automationEnabled ? t.enable : t.disable)
            ]),
            
            // Settings (when automation is enabled)
            automationEnabled && createElement('div', {
                key: 'automation-controls',
                className: 'space-y-4'
            }, [
                // Frequency Setting
                createElement('div', {
                    key: 'frequency-setting',
                    className: 'grid grid-cols-1 md:grid-cols-2 gap-4'
                }, [
                    createElement('div', {
                        key: 'frequency-control'
                    }, [
                        createElement('label', {
                            key: 'frequency-label',
                            className: 'block text-sm font-medium text-indigo-700 mb-2'
                        }, t.frequency),
                        createElement('select', {
                            key: 'frequency-select',
                            value: selectedFrequency,
                            onChange: (e) => setSelectedFrequency(e.target.value),
                            className: 'w-full px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        }, [
                            createElement('option', {
                                key: 'quarterly-option',
                                value: 'quarterly'
                            }, t.quarterly),
                            createElement('option', {
                                key: 'semiannual-option',
                                value: 'semiAnnual'
                            }, t.semiAnnual),
                            createElement('option', {
                                key: 'annual-option',
                                value: 'annual'
                            }, t.annual)
                        ])
                    ]),
                    
                    // Threshold Setting
                    createElement('div', {
                        key: 'threshold-control'
                    }, [
                        createElement('label', {
                            key: 'threshold-label',
                            className: 'block text-sm font-medium text-indigo-700 mb-2'
                        }, `${t.threshold} (${thresholdSetting}%)`),
                        createElement('input', {
                            key: 'threshold-input',
                            type: 'range',
                            min: '3',
                            max: '15',
                            step: '1',
                            value: thresholdSetting,
                            onChange: (e) => setThresholdSetting(parseInt(e.target.value)),
                            className: 'w-full'
                        })
                    ])
                ])
            ])
        ]),
        
        // Next Steps / Schedule Preview
        rebalanceSchedule && createElement('div', {
            key: 'schedule-preview',
            className: 'bg-gray-50 rounded-xl p-6 border border-gray-200'
        }, [
            createElement('h4', {
                key: 'schedule-title',
                className: 'text-xl font-semibold text-gray-800 mb-4 flex items-center'
            }, [
                createElement('span', { key: 'schedule-icon', className: 'mr-3' }, '📅'),
                t.schedule
            ]),
            createElement('div', {
                key: 'upcoming-dates',
                className: 'space-y-3'
            }, rebalanceSchedule.upcomingDates.slice(0, 6).map((event, index) => 
                createElement('div', {
                    key: `event-${index}`,
                    className: 'flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200'
                }, [
                    createElement('div', {
                        key: `event-info-${index}`
                    }, [
                        createElement('div', {
                            key: `event-date-${index}`,
                            className: 'font-medium text-gray-800'
                        }, event.date.toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US')),
                        createElement('div', {
                            key: `event-desc-${index}`,
                            className: 'text-sm text-gray-600'
                        }, event.description)
                    ]),
                    createElement('span', {
                        key: `event-type-${index}`,
                        className: `px-2 py-1 rounded text-xs ${
                            event.type === 'scheduled' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-gray-100 text-gray-700'
                        }`
                    }, event.type === 'scheduled' ? 
                        (language === 'he' ? 'מתוכנן' : 'Scheduled') : 
                        (language === 'he' ? 'בדיקה' : 'Check'))
                ])
            ))
        ]),
        
        // Action Buttons
        createElement('div', {
            key: 'action-buttons',
            className: 'flex justify-between items-center'
        }, [
            createElement('button', {
                key: 'details-toggle',
                onClick: () => setShowDetails(!showDetails),
                className: 'px-4 py-2 text-gray-600 hover:text-gray-800 text-sm'
            }, showDetails ? 
                (language === 'he' ? 'הסתר פרטים' : 'Hide Details') : 
                (language === 'he' ? 'הצג פרטים' : 'Show Details')),
            createElement('div', {
                key: 'main-actions',
                className: 'space-x-3'
            }, [
                createElement('button', {
                    key: 'analyze-btn',
                    className: 'px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50'
                }, t.analyze),
                analysisResults.needsRebalancing && createElement('button', {
                    key: 'implement-btn',
                    className: 'px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
                }, t.implement)
            ])
        ])
    ]);
};

// Export to window for global access
window.AdvancedRebalancingPanel = AdvancedRebalancingPanel;