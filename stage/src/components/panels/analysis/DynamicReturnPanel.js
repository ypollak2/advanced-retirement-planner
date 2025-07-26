// Dynamic Return Assumptions Panel - UI for selecting market scenarios and customizing return assumptions
// Provides intuitive scenario selection with historical context and validation

const DynamicReturnPanel = ({ inputs, onInputChange, language = 'en' }) => {
    const createElement = React.createElement;
    
    // Multi-language content
    const content = {
        he: {
            title: 'הנחות תשואה דינמיות',
            subtitle: 'בחר תרחיש שוק והתאם ציפיות תשואה',
            scenarioSelection: 'בחירת תרחיש',
            currentScenario: 'תרחיש נוכחי',
            customizeReturns: 'התאמה אישית',
            recommendations: 'המלצות',
            validation: 'אימות',
            historicalRange: 'טווח היסטורי',
            riskWarning: 'אזהרת סיכון',
            timeAdjustment: 'התאמה לאופק זמן',
            years: 'שנים',
            percentage: '%',
            apply: 'החל',
            reset: 'אפס',
            viewDetails: 'צפה בפרטים',
            hideDetails: 'הסתר פרטים',
            assetTypes: {
                pensionReturn: 'תשואת פנסיה',
                trainingFundReturn: 'תשואת קרן השתלמות', 
                personalPortfolioReturn: 'תשואת תיק אישי',
                realEstateReturn: 'תשואת נדל״ן',
                cryptoReturn: 'תשואת קריפטו'
            },
            scenarioDescriptions: {
                conservative: 'מבוסס על השקעות נמוכות סיכון',
                moderate: 'גישה מאוזנת (מומלץ)',
                aggressive: 'ציפיות צמיחה גבוהות',
                custom: 'הגדרות מותאמות אישית'
            }
        },
        en: {
            title: 'Dynamic Return Assumptions',
            subtitle: 'Select market scenario and customize return expectations',
            scenarioSelection: 'Scenario Selection',
            currentScenario: 'Current Scenario',
            customizeReturns: 'Customize Returns',
            recommendations: 'Recommendations',
            validation: 'Validation',
            historicalRange: 'Historical Range',
            riskWarning: 'Risk Warning',
            timeAdjustment: 'Time Horizon Adjustment',
            years: 'years',
            percentage: '%',
            apply: 'Apply',
            reset: 'Reset',
            viewDetails: 'View Details',
            hideDetails: 'Hide Details',
            assetTypes: {
                pensionReturn: 'Pension Return',
                trainingFundReturn: 'Training Fund Return',
                personalPortfolioReturn: 'Personal Portfolio Return',
                realEstateReturn: 'Real Estate Return',
                cryptoReturn: 'Crypto Return'
            },
            scenarioDescriptions: {
                conservative: 'Based on lower-risk investments',
                moderate: 'Balanced approach (Recommended)',
                aggressive: 'Higher growth expectations',
                custom: 'User-defined assumptions'
            }
        }
    };
    
    const t = content[language];
    
    // State for UI
    const [selectedScenario, setSelectedScenario] = React.useState(inputs.returnScenario || 'moderate');
    const [showDetails, setShowDetails] = React.useState(false);
    const [customReturns, setCustomReturns] = React.useState({
        pensionReturn: inputs.pensionReturn || 7.0,
        trainingFundReturn: inputs.trainingFundReturn || 6.5,
        personalPortfolioReturn: inputs.personalPortfolioReturn || 8.0,
        realEstateReturn: inputs.realEstateReturn || 6.0,
        cryptoReturn: inputs.cryptoReturn || 15.0
    });
    
    // Get dynamic return assumptions utilities
    const scenarios = window.dynamicReturnAssumptions?.marketScenarios || {};
    const analyzeAssumptions = window.dynamicReturnAssumptions?.analyzeReturnAssumptions || (() => ({}));
    const applyScenario = window.dynamicReturnAssumptions?.applyScenario || ((inputs, scenario) => inputs);
    
    // Analyze current return assumptions
    const analysis = analyzeAssumptions(inputs, language);
    const yearsToRetirement = (inputs.retirementAge || 67) - (inputs.currentAge || 30);
    
    // Handle scenario selection
    const handleScenarioChange = (scenarioName) => {
        setSelectedScenario(scenarioName);
        
        if (scenarioName !== 'custom' && scenarios[scenarioName]?.returns) {
            const updatedInputs = applyScenario(inputs, scenarioName);
            setCustomReturns({
                pensionReturn: updatedInputs.pensionReturn,
                trainingFundReturn: updatedInputs.trainingFundReturn,
                personalPortfolioReturn: updatedInputs.personalPortfolioReturn,
                realEstateReturn: updatedInputs.realEstateReturn,
                cryptoReturn: updatedInputs.cryptoReturn
            });
        }
    };
    
    // Handle custom return changes
    const handleCustomReturnChange = (assetType, value) => {
        const numValue = parseFloat(value) || 0;
        setCustomReturns(prev => ({
            ...prev,
            [assetType]: numValue
        }));
    };
    
    // Apply changes to inputs
    const applyChanges = () => {
        const updatedInputs = {
            ...inputs,
            returnScenario: selectedScenario,
            ...customReturns
        };
        onInputChange(updatedInputs);
    };
    
    // Reset to current inputs
    const resetChanges = () => {
        setSelectedScenario(inputs.returnScenario || 'moderate');
        setCustomReturns({
            pensionReturn: inputs.pensionReturn || 7.0,
            trainingFundReturn: inputs.trainingFundReturn || 6.5,
            personalPortfolioReturn: inputs.personalPortfolioReturn || 8.0,
            realEstateReturn: inputs.realEstateReturn || 6.0,
            cryptoReturn: inputs.cryptoReturn || 15.0
        });
    };
    
    // Format percentage
    const formatPercentage = (value) => `${(value || 0).toFixed(1)}${t.percentage}`;
    
    // Get scenario color
    const getScenarioColor = (scenario) => {
        const colors = {
            conservative: 'border-green-300 bg-green-50',
            moderate: 'border-blue-300 bg-blue-50',
            aggressive: 'border-red-300 bg-red-50',
            custom: 'border-purple-300 bg-purple-50'
        };
        return colors[scenario] || colors.moderate;
    };
    
    return createElement('div', {
        key: 'dynamic-return-panel',
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
            }, '📊'),
            createElement('h3', {
                key: 'header-title',
                className: 'text-2xl font-bold text-gray-800 mb-2'
            }, t.title),
            createElement('p', {
                key: 'header-subtitle',
                className: 'text-gray-600'
            }, t.subtitle)
        ]),
        
        // Current Analysis Summary
        createElement('div', {
            key: 'current-analysis',
            className: 'bg-gray-50 rounded-xl p-6 border border-gray-200'
        }, [
            createElement('div', {
                key: 'analysis-header',
                className: 'flex justify-between items-center mb-4'
            }, [
                createElement('h4', {
                    key: 'analysis-title',
                    className: 'text-lg font-semibold text-gray-800'
                }, t.currentScenario),
                createElement('span', {
                    key: 'years-to-retirement',
                    className: 'text-sm text-gray-600'
                }, `${yearsToRetirement} ${t.years}`)
            ]),
            createElement('div', {
                key: 'current-scenario-info',
                className: `p-4 rounded-lg border-2 ${getScenarioColor(analysis.currentScenario)}`
            }, [
                createElement('div', {
                    key: 'scenario-name',
                    className: 'font-semibold text-lg mb-2'
                }, scenarios[analysis.currentScenario]?.name?.[language] || analysis.currentScenario),
                createElement('div', {
                    key: 'scenario-description',
                    className: 'text-sm text-gray-600 mb-3'
                }, t.scenarioDescriptions[analysis.currentScenario]),
                createElement('div', {
                    key: 'average-return',
                    className: 'text-center'
                }, [
                    createElement('span', {
                        key: 'avg-label',
                        className: 'text-sm text-gray-600'
                    }, `${language === 'he' ? 'ממוצע תשואות:' : 'Average Return:'} `),
                    createElement('span', {
                        key: 'avg-value',
                        className: 'font-bold text-lg'
                    }, formatPercentage(analysis.summary?.averageReturn))
                ])
            ])
        ]),
        
        // Scenario Selection
        createElement('div', {
            key: 'scenario-selection',
            className: 'bg-white rounded-xl p-6 border border-gray-200'
        }, [
            createElement('h4', {
                key: 'selection-title',
                className: 'text-xl font-semibold text-gray-800 mb-4 flex items-center'
            }, [
                createElement('span', { key: 'selection-icon', className: 'mr-3' }, '🎯'),
                t.scenarioSelection
            ]),
            createElement('div', {
                key: 'scenario-options',
                className: 'grid grid-cols-1 md:grid-cols-2 gap-4'
            }, Object.entries(scenarios).map(([scenarioKey, scenario]) => 
                createElement('div', {
                    key: `scenario-${scenarioKey}`,
                    className: `border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedScenario === scenarioKey 
                            ? `${getScenarioColor(scenarioKey)} border-opacity-100`
                            : 'border-gray-200 hover:border-gray-300'
                    }`
                }, [
                    createElement('input', {
                        key: `radio-${scenarioKey}`,
                        type: 'radio',
                        name: 'scenario',
                        value: scenarioKey,
                        checked: selectedScenario === scenarioKey,
                        onChange: () => handleScenarioChange(scenarioKey),
                        className: 'sr-only'
                    }),
                    createElement('div', {
                        key: `scenario-content-${scenarioKey}`,
                        onClick: () => handleScenarioChange(scenarioKey)
                    }, [
                        createElement('h5', {
                            key: `scenario-name-${scenarioKey}`,
                            className: 'font-semibold text-lg mb-2'
                        }, scenario.name?.[language] || scenarioKey),
                        createElement('p', {
                            key: `scenario-desc-${scenarioKey}`,
                            className: 'text-sm text-gray-600 mb-3'
                        }, scenario.description?.[language] || ''),
                        scenario.returns && createElement('div', {
                            key: `scenario-returns-${scenarioKey}`,
                            className: 'text-xs text-gray-500 space-y-1'
                        }, [
                            createElement('div', {
                                key: `pension-${scenarioKey}`
                            }, `${t.assetTypes.pensionReturn}: ${formatPercentage(scenario.returns.pensionReturn)}`),
                            createElement('div', {
                                key: `training-${scenarioKey}`
                            }, `${t.assetTypes.trainingFundReturn}: ${formatPercentage(scenario.returns.trainingFundReturn)}`),
                            createElement('div', {
                                key: `portfolio-${scenarioKey}`
                            }, `${t.assetTypes.personalPortfolioReturn}: ${formatPercentage(scenario.returns.personalPortfolioReturn)}`)
                        ])
                    ])
                ])
            ))
        ]),
        
        // Custom Return Inputs (show when custom scenario selected or details toggled)
        (selectedScenario === 'custom' || showDetails) && createElement('div', {
            key: 'custom-returns',
            className: 'bg-purple-50 rounded-xl p-6 border border-purple-200'
        }, [
            createElement('h4', {
                key: 'custom-title',
                className: 'text-xl font-semibold text-purple-800 mb-4 flex items-center'
            }, [
                createElement('span', { key: 'custom-icon', className: 'mr-3' }, '⚙️'),
                t.customizeReturns
            ]),
            createElement('div', {
                key: 'custom-inputs',
                className: 'grid grid-cols-1 md:grid-cols-2 gap-4'
            }, Object.entries(t.assetTypes).map(([assetType, label]) => {
                const validation = window.dynamicReturnAssumptions?.validateReturn?.(
                    assetType, customReturns[assetType], language
                ) || {};
                
                return createElement('div', {
                    key: `custom-${assetType}`,
                    className: 'space-y-2'
                }, [
                    createElement('label', {
                        key: `label-${assetType}`,
                        className: 'block text-sm font-medium text-purple-700'
                    }, label),
                    createElement('div', {
                        key: `input-container-${assetType}`,
                        className: 'relative'
                    }, [
                        createElement('input', {
                            key: `input-${assetType}`,
                            type: 'number',
                            step: '0.1',
                            min: '-20',
                            max: '50',
                            value: customReturns[assetType],
                            onChange: (e) => handleCustomReturnChange(assetType, e.target.value),
                            className: `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                validation.isValid 
                                    ? 'border-gray-300 focus:ring-purple-500' 
                                    : 'border-red-300 focus:ring-red-500'
                            }`
                        }),
                        createElement('span', {
                            key: `percent-${assetType}`,
                            className: 'absolute right-3 top-2 text-gray-500'
                        }, '%')
                    ]),
                    validation.historical && createElement('div', {
                        key: `historical-${assetType}`,
                        className: 'text-xs text-gray-600'
                    }, `${t.historicalRange}: ${validation.historical}`),
                    validation.warnings?.length > 0 && createElement('div', {
                        key: `warnings-${assetType}`,
                        className: 'text-xs text-red-600'
                    }, validation.warnings.join(', '))
                ]);
            }))
        ]),
        
        // Recommendations (if any)
        analysis.recommendations?.length > 0 && createElement('div', {
            key: 'recommendations',
            className: 'bg-yellow-50 rounded-xl p-6 border border-yellow-200'
        }, [
            createElement('h4', {
                key: 'rec-title',
                className: 'text-xl font-semibold text-yellow-800 mb-4 flex items-center'
            }, [
                createElement('span', { key: 'rec-icon', className: 'mr-3' }, '💡'),
                t.recommendations
            ]),
            createElement('div', {
                key: 'rec-list',
                className: 'space-y-3'
            }, analysis.recommendations.slice(0, 3).map((rec, index) => 
                createElement('div', {
                    key: `rec-${index}`,
                    className: 'bg-white rounded-lg p-3 border border-yellow-200'
                }, [
                    createElement('div', {
                        key: `rec-header-${index}`,
                        className: 'font-semibold text-yellow-800'
                    }, rec.title),
                    createElement('div', {
                        key: `rec-desc-${index}`,
                        className: 'text-sm text-yellow-700'
                    }, rec.description)
                ])
            ))
        ]),
        
        // Action Buttons
        createElement('div', {
            key: 'actions',
            className: 'flex justify-between items-center'
        }, [
            createElement('button', {
                key: 'details-toggle',
                onClick: () => setShowDetails(!showDetails),
                className: 'px-4 py-2 text-gray-600 hover:text-gray-800 text-sm'
            }, showDetails ? t.hideDetails : t.viewDetails),
            createElement('div', {
                key: 'action-buttons',
                className: 'space-x-3'
            }, [
                createElement('button', {
                    key: 'reset-btn',
                    onClick: resetChanges,
                    className: 'px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50'
                }, t.reset),
                createElement('button', {
                    key: 'apply-btn',
                    onClick: applyChanges,
                    className: 'px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
                }, t.apply)
            ])
        ])
    ]);
};

// Export to window for global access
window.DynamicReturnPanel = DynamicReturnPanel;