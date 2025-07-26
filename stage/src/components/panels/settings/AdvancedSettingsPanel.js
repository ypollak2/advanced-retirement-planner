// Advanced Settings Panel - Comprehensive settings for all advanced features
// Centralized configuration for rebalancing, inflation, Monte Carlo, and withdrawal settings

const AdvancedSettingsPanel = ({ inputs, onInputChange, language = 'en' }) => {
    const createElement = React.createElement;
    
    // Multi-language content
    const content = {
        he: {
            title: 'הגדרות מתקדמות',
            subtitle: 'הגדרות מרכזיות לכל התכונות המתקדמות',
            generalSettings: 'הגדרות כלליות',
            rebalancingSettings: 'הגדרות איזון תיק',
            inflationSettings: 'הגדרות אינפלציה',
            monteCarloSettings: 'הגדרות מונטה קארלו',
            withdrawalSettings: 'הגדרות משיכה',
            taxSettings: 'הגדרות מס',
            notificationSettings: 'הגדרות התראות',
            dataSettings: 'הגדרות נתונים',
            language: 'שפה',
            currency: 'מטבע',
            country: 'מדינה',
            riskTolerance: 'סובלנות סיכון',
            timeHorizon: 'אופק זמן',
            automationEnabled: 'אוטומציה מופעלת',
            frequency: 'תדירות',
            threshold: 'סף סטייה',
            taxOptimization: 'אופטימיזציית מס',
            inflationRate: 'שיעור אינפלציה',
            inflationScenario: 'תרחיש אינפלציה',
            protectionScore: 'ציון הגנה',
            simulations: 'מספר סימולציות',
            projectionYears: 'שנות תחזית',
            confidenceLevel: 'רמת ביטחון',
            randomSeed: 'זרע אקראי',
            defaultStrategy: 'אסטרטגיה ברירת מחדל',
            withdrawalRate: 'שיעור משיכה',
            taxStrategy: 'אסטרטגיית מס',
            emailNotifications: 'התראות דוא״ל',
            pushNotifications: 'התראות דחיפה',
            rebalanceAlerts: 'התראות איזון',
            performanceAlerts: 'התראות ביצועים',
            dataBackup: 'גיבוי נתונים',
            dataExport: 'יצוא נתונים',
            dataImport: 'יבוא נתונים',
            resetSettings: 'איפוס הגדרות',
            saveSettings: 'שמור הגדרות',
            loadDefaults: 'טען ברירות מחדל',
            exportSettings: 'יצא הגדרות',
            importSettings: 'יבא הגדרות',
            years: 'שנים',
            months: 'חודשים',
            percentage: '%',
            enabled: 'מופעל',
            disabled: 'מושבת',
            low: 'נמוך',
            medium: 'בינוני',
            high: 'גבוה',
            conservative: 'שמרני',
            moderate: 'מתון',
            aggressive: 'אגרסיבי',
            quarterly: 'רבעוני',
            semiAnnual: 'חצי שנתי',
            annual: 'שנתי',
            optimistic: 'אופטימי',
            pessimistic: 'פסימי',
            historical: 'היסטורי',
            fixedPercentage: 'אחוז קבוע',
            dynamicWithdrawal: 'משיכה דינמית',
            bucketStrategy: 'אסטרטגיית דליים',
            taxEfficient: 'יעיל ממבחינת מס',
            assetLocation: 'מיקום נכסים',
            lossHarvesting: 'קציר הפסדים'
        },
        en: {
            title: 'Advanced Settings',
            subtitle: 'Centralized configuration for all advanced features',
            generalSettings: 'General Settings',
            rebalancingSettings: 'Rebalancing Settings',
            inflationSettings: 'Inflation Settings',
            monteCarloSettings: 'Monte Carlo Settings',
            withdrawalSettings: 'Withdrawal Settings',
            taxSettings: 'Tax Settings',
            notificationSettings: 'Notification Settings',
            dataSettings: 'Data Settings',
            language: 'Language',
            currency: 'Currency',
            country: 'Country',
            riskTolerance: 'Risk Tolerance',
            timeHorizon: 'Time Horizon',
            automationEnabled: 'Automation Enabled',
            frequency: 'Frequency',
            threshold: 'Deviation Threshold',
            taxOptimization: 'Tax Optimization',
            inflationRate: 'Inflation Rate',
            inflationScenario: 'Inflation Scenario',
            protectionScore: 'Protection Score',
            simulations: 'Number of Simulations',
            projectionYears: 'Projection Years',
            confidenceLevel: 'Confidence Level',
            randomSeed: 'Random Seed',
            defaultStrategy: 'Default Strategy',
            withdrawalRate: 'Withdrawal Rate',
            taxStrategy: 'Tax Strategy',
            emailNotifications: 'Email Notifications',
            pushNotifications: 'Push Notifications',
            rebalanceAlerts: 'Rebalance Alerts',
            performanceAlerts: 'Performance Alerts',
            dataBackup: 'Data Backup',
            dataExport: 'Data Export',
            dataImport: 'Data Import',
            resetSettings: 'Reset Settings',
            saveSettings: 'Save Settings',
            loadDefaults: 'Load Defaults',
            exportSettings: 'Export Settings',
            importSettings: 'Import Settings',
            years: 'Years',
            months: 'Months',
            percentage: '%',
            enabled: 'Enabled',
            disabled: 'Disabled',
            low: 'Low',
            medium: 'Medium',
            high: 'High',
            conservative: 'Conservative',
            moderate: 'Moderate',
            aggressive: 'Aggressive',
            quarterly: 'Quarterly',
            semiAnnual: 'Semi-Annual',
            annual: 'Annual',
            optimistic: 'Optimistic',
            pessimistic: 'Pessimistic',
            historical: 'Historical',
            fixedPercentage: 'Fixed Percentage',
            dynamicWithdrawal: 'Dynamic Withdrawal',
            bucketStrategy: 'Bucket Strategy',
            taxEfficient: 'Tax Efficient',
            assetLocation: 'Asset Location',
            lossHarvesting: 'Loss Harvesting'
        }
    };
    
    const t = content[language];
    
    // State for settings
    const [settings, setSettings] = React.useState({
        // General Settings
        language: language || 'en',
        currency: inputs.currency || 'ILS',
        country: inputs.country || 'israel',
        riskTolerance: inputs.riskTolerance || 'moderate',
        timeHorizon: (inputs.retirementAge || 67) - (inputs.currentAge || 30),
        
        // Rebalancing Settings
        rebalancingAutomation: inputs.rebalancingAutomation || false,
        rebalancingFrequency: inputs.rebalancingFrequency || 'quarterly',
        rebalancingThreshold: inputs.rebalancingThreshold || 8,
        taxOptimizedRebalancing: inputs.taxOptimizedRebalancing !== false,
        
        // Inflation Settings
        inflationRate: inputs.inflationRate || 2.5,
        inflationScenario: inputs.inflationScenario || 'moderate',
        inflationProtectionTarget: inputs.inflationProtectionTarget || 60,
        
        // Monte Carlo Settings
        monteCarloSimulations: inputs.monteCarloSimulations || 10000,
        monteCarloProjectionYears: inputs.monteCarloProjectionYears || 30,
        confidenceLevel: inputs.confidenceLevel || 95,
        randomSeed: inputs.randomSeed || null,
        
        // Withdrawal Settings
        defaultWithdrawalStrategy: inputs.defaultWithdrawalStrategy || 'fixedPercentage',
        withdrawalRate: inputs.withdrawalRate || 4.0,
        withdrawalTaxStrategy: inputs.withdrawalTaxStrategy || 'taxEfficient',
        
        // Tax Settings
        taxOptimizationEnabled: inputs.taxOptimizationEnabled !== false,
        taxLossHarvestingEnabled: inputs.taxLossHarvestingEnabled !== false,
        assetLocationOptimization: inputs.assetLocationOptimization !== false,
        
        // Notification Settings
        emailNotifications: inputs.emailNotifications || false,
        pushNotifications: inputs.pushNotifications || false,
        rebalanceAlerts: inputs.rebalanceAlerts !== false,
        performanceAlerts: inputs.performanceAlerts || false,
        
        // Data Settings
        autoDataBackup: inputs.autoDataBackup || false,
        dataRetentionPeriod: inputs.dataRetentionPeriod || 24 // months
    });
    
    const [activeSection, setActiveSection] = React.useState('general');
    
    // Update settings and propagate to parent
    const updateSetting = (key, value) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        
        // Propagate to parent component
        if (onInputChange) {
            onInputChange({ ...inputs, [key]: value });
        }
    };
    
    // Save all settings
    const saveAllSettings = () => {
        if (onInputChange) {
            onInputChange({ ...inputs, ...settings });
        }
        
        // Save to localStorage for persistence
        try {
            localStorage.setItem('advancedRetirementSettings', JSON.stringify(settings));
            console.log('Settings saved successfully');
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    };
    
    // Load default settings
    const loadDefaultSettings = () => {
        const defaultSettings = {
            language: 'en',
            currency: 'ILS',
            country: 'israel',
            riskTolerance: 'moderate',
            rebalancingAutomation: false,
            rebalancingFrequency: 'quarterly',
            rebalancingThreshold: 8,
            inflationRate: 2.5,
            monteCarloSimulations: 10000,
            withdrawalRate: 4.0,
            taxOptimizationEnabled: true
        };
        
        setSettings(defaultSettings);
        if (onInputChange) {
            onInputChange({ ...inputs, ...defaultSettings });
        }
    };
    
    // Export settings as JSON
    const exportSettings = () => {
        const dataStr = JSON.stringify(settings, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'retirement-planner-settings.json';
        link.click();
        URL.revokeObjectURL(url);
    };
    
    // Section navigation
    const sections = [
        { id: 'general', title: t.generalSettings, icon: '⚙️' },
        { id: 'rebalancing', title: t.rebalancingSettings, icon: '⚖️' },
        { id: 'inflation', title: t.inflationSettings, icon: '📈' },
        { id: 'montecarlo', title: t.monteCarloSettings, icon: '🎲' },
        { id: 'withdrawal', title: t.withdrawalSettings, icon: '💰' },
        { id: 'tax', title: t.taxSettings, icon: '🏛️' },
        { id: 'notifications', title: t.notificationSettings, icon: '🔔' },
        { id: 'data', title: t.dataSettings, icon: '💾' }
    ];
    
    const renderSettingInput = (key, label, type = 'text', options = {}) => {
        const value = settings[key];
        
        switch (type) {
            case 'select':
                return createElement('div', {
                    key: `${key}-container`,
                    className: 'space-y-2'
                }, [
                    createElement('label', {
                        key: `${key}-label`,
                        className: 'block text-sm font-medium text-gray-700'
                    }, label),
                    createElement('select', {
                        key: `${key}-select`,
                        value: value,
                        onChange: (e) => updateSetting(key, e.target.value),
                        className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    }, options.choices?.map(choice => 
                        createElement('option', {
                            key: choice.value,
                            value: choice.value
                        }, choice.label)
                    ))
                ]);
                
            case 'toggle':
                return createElement('div', {
                    key: `${key}-container`,
                    className: 'flex items-center justify-between'
                }, [
                    createElement('label', {
                        key: `${key}-label`,
                        className: 'text-sm font-medium text-gray-700'
                    }, label),
                    createElement('button', {
                        key: `${key}-toggle`,
                        onClick: () => updateSetting(key, !value),
                        className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            value ? 'bg-blue-600' : 'bg-gray-200'
                        }`
                    }, [
                        createElement('span', {
                            key: `${key}-toggle-span`,
                            className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                value ? 'translate-x-6' : 'translate-x-1'
                            }`
                        })
                    ])
                ]);
                
            case 'range':
                return createElement('div', {
                    key: `${key}-container`,
                    className: 'space-y-2'
                }, [
                    createElement('label', {
                        key: `${key}-label`,
                        className: 'block text-sm font-medium text-gray-700'
                    }, `${label}: ${value}${options.suffix || ''}`),
                    createElement('input', {
                        key: `${key}-range`,
                        type: 'range',
                        min: options.min || 0,
                        max: options.max || 100,
                        step: options.step || 1,
                        value: value,
                        onChange: (e) => updateSetting(key, parseFloat(e.target.value)),
                        className: 'w-full'
                    })
                ]);
                
            case 'number':
                return createElement('div', {
                    key: `${key}-container`,
                    className: 'space-y-2'
                }, [
                    createElement('label', {
                        key: `${key}-label`,
                        className: 'block text-sm font-medium text-gray-700'
                    }, label),
                    createElement('input', {
                        key: `${key}-number`,
                        type: 'number',
                        min: options.min,
                        max: options.max,
                        step: options.step || 0.1,
                        value: value,
                        onChange: (e) => updateSetting(key, parseFloat(e.target.value) || 0),
                        className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    })
                ]);
                
            default:
                return createElement('div', {
                    key: `${key}-container`,
                    className: 'space-y-2'
                }, [
                    createElement('label', {
                        key: `${key}-label`,
                        className: 'block text-sm font-medium text-gray-700'
                    }, label),
                    createElement('input', {
                        key: `${key}-input`,
                        type: type,
                        value: value,
                        onChange: (e) => updateSetting(key, e.target.value),
                        className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    })
                ]);
        }
    };
    
    const renderSectionContent = () => {
        switch (activeSection) {
            case 'general':
                return createElement('div', {
                    key: 'general-content',
                    className: 'space-y-6'
                }, [
                    renderSettingInput('language', t.language, 'select', {
                        choices: [
                            { value: 'en', label: 'English' },
                            { value: 'he', label: 'עברית' }
                        ]
                    }),
                    renderSettingInput('currency', t.currency, 'select', {
                        choices: [
                            { value: 'ILS', label: '₪ ILS' },
                            { value: 'USD', label: '$ USD' },
                            { value: 'EUR', label: '€ EUR' }
                        ]
                    }),
                    renderSettingInput('country', t.country, 'select', {
                        choices: [
                            { value: 'israel', label: 'Israel' },
                            { value: 'usa', label: 'United States' },
                            { value: 'eurozone', label: 'Eurozone' }
                        ]
                    }),
                    renderSettingInput('riskTolerance', t.riskTolerance, 'select', {
                        choices: [
                            { value: 'conservative', label: t.conservative },
                            { value: 'moderate', label: t.moderate },
                            { value: 'aggressive', label: t.aggressive }
                        ]
                    }),
                    renderSettingInput('timeHorizon', t.timeHorizon, 'range', {
                        min: 5, max: 50, step: 1, suffix: ` ${t.years}`
                    })
                ]);
                
            case 'rebalancing':
                return createElement('div', {
                    key: 'rebalancing-content',
                    className: 'space-y-6'
                }, [
                    renderSettingInput('rebalancingAutomation', t.automationEnabled, 'toggle'),
                    settings.rebalancingAutomation && renderSettingInput('rebalancingFrequency', t.frequency, 'select', {
                        choices: [
                            { value: 'quarterly', label: t.quarterly },
                            { value: 'semiAnnual', label: t.semiAnnual },
                            { value: 'annual', label: t.annual }
                        ]
                    }),
                    renderSettingInput('rebalancingThreshold', t.threshold, 'range', {
                        min: 3, max: 15, step: 1, suffix: t.percentage
                    }),
                    renderSettingInput('taxOptimizedRebalancing', t.taxOptimization, 'toggle')
                ]);
                
            case 'inflation':
                return createElement('div', {
                    key: 'inflation-content',
                    className: 'space-y-6'
                }, [
                    renderSettingInput('inflationRate', t.inflationRate, 'range', {
                        min: 0, max: 10, step: 0.1, suffix: t.percentage
                    }),
                    renderSettingInput('inflationScenario', t.inflationScenario, 'select', {
                        choices: [
                            { value: 'optimistic', label: t.optimistic },
                            { value: 'moderate', label: t.moderate },
                            { value: 'pessimistic', label: t.pessimistic },
                            { value: 'historical', label: t.historical }
                        ]
                    }),
                    renderSettingInput('inflationProtectionTarget', t.protectionScore, 'range', {
                        min: 30, max: 90, step: 5, suffix: t.percentage
                    })
                ]);
                
            case 'montecarlo':
                return createElement('div', {
                    key: 'montecarlo-content',
                    className: 'space-y-6'
                }, [
                    renderSettingInput('monteCarloSimulations', t.simulations, 'select', {
                        choices: [
                            { value: 1000, label: '1,000' },
                            { value: 5000, label: '5,000' },
                            { value: 10000, label: '10,000' },
                            { value: 25000, label: '25,000' }
                        ]
                    }),
                    renderSettingInput('monteCarloProjectionYears', t.projectionYears, 'range', {
                        min: 10, max: 50, step: 5, suffix: ` ${t.years}`
                    }),
                    renderSettingInput('confidenceLevel', t.confidenceLevel, 'select', {
                        choices: [
                            { value: 90, label: '90%' },
                            { value: 95, label: '95%' },
                            { value: 99, label: '99%' }
                        ]
                    })
                ]);
                
            case 'withdrawal':
                return createElement('div', {
                    key: 'withdrawal-content',
                    className: 'space-y-6'
                }, [
                    renderSettingInput('defaultWithdrawalStrategy', t.defaultStrategy, 'select', {
                        choices: [
                            { value: 'fixedPercentage', label: t.fixedPercentage },
                            { value: 'dynamicWithdrawal', label: t.dynamicWithdrawal },
                            { value: 'bucketStrategy', label: t.bucketStrategy }
                        ]
                    }),
                    renderSettingInput('withdrawalRate', t.withdrawalRate, 'range', {
                        min: 2, max: 8, step: 0.1, suffix: t.percentage
                    }),
                    renderSettingInput('withdrawalTaxStrategy', t.taxStrategy, 'select', {
                        choices: [
                            { value: 'taxEfficient', label: t.taxEfficient },
                            { value: 'assetLocation', label: t.assetLocation },
                            { value: 'lossHarvesting', label: t.lossHarvesting }
                        ]
                    })
                ]);
                
            case 'tax':
                return createElement('div', {
                    key: 'tax-content',
                    className: 'space-y-6'
                }, [
                    renderSettingInput('taxOptimizationEnabled', t.taxOptimization, 'toggle'),
                    renderSettingInput('taxLossHarvestingEnabled', t.lossHarvesting, 'toggle'),
                    renderSettingInput('assetLocationOptimization', t.assetLocation, 'toggle')
                ]);
                
            case 'notifications':
                return createElement('div', {
                    key: 'notifications-content',
                    className: 'space-y-6'
                }, [
                    renderSettingInput('emailNotifications', t.emailNotifications, 'toggle'),
                    renderSettingInput('pushNotifications', t.pushNotifications, 'toggle'),
                    renderSettingInput('rebalanceAlerts', t.rebalanceAlerts, 'toggle'),
                    renderSettingInput('performanceAlerts', t.performanceAlerts, 'toggle')
                ]);
                
            case 'data':
                return createElement('div', {
                    key: 'data-content',
                    className: 'space-y-6'
                }, [
                    renderSettingInput('autoDataBackup', t.dataBackup, 'toggle'),
                    renderSettingInput('dataRetentionPeriod', t.dataRetentionPeriod, 'range', {
                        min: 6, max: 60, step: 6, suffix: ` ${t.months}`
                    }),
                    createElement('div', {
                        key: 'data-actions',
                        className: 'flex gap-3 pt-4 border-t border-gray-200'
                    }, [
                        createElement('button', {
                            key: 'export-btn',
                            onClick: exportSettings,
                            className: 'px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700'
                        }, t.exportSettings),
                        createElement('button', {
                            key: 'reset-btn',
                            onClick: loadDefaultSettings,
                            className: 'px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700'
                        }, t.resetSettings)
                    ])
                ]);
                
            default:
                return createElement('div', {
                    key: 'default-content',
                    className: 'text-center py-8 text-gray-500'
                }, t.generalSettings);
        }
    };
    
    return createElement('div', {
        key: 'advanced-settings-panel',
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
            }, '⚙️'),
            createElement('h3', {
                key: 'header-title',
                className: 'text-2xl font-bold text-gray-800 mb-2'
            }, t.title),
            createElement('p', {
                key: 'header-subtitle',
                className: 'text-gray-600'
            }, t.subtitle)
        ]),
        
        // Settings Layout
        createElement('div', {
            key: 'settings-layout',
            className: 'grid grid-cols-1 lg:grid-cols-4 gap-6'
        }, [
            // Navigation Sidebar
            createElement('div', {
                key: 'settings-nav',
                className: 'lg:col-span-1'
            }, [
                createElement('nav', {
                    key: 'nav-menu',
                    className: 'space-y-1'
                }, sections.map(section =>
                    createElement('button', {
                        key: `nav-${section.id}`,
                        onClick: () => setActiveSection(section.id),
                        className: `w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                            activeSection === section.id
                                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`
                    }, [
                        createElement('span', {
                            key: `nav-icon-${section.id}`,
                            className: 'mr-3'
                        }, section.icon),
                        section.title
                    ])
                ))
            ]),
            
            // Settings Content
            createElement('div', {
                key: 'settings-content',
                className: 'lg:col-span-3'
            }, [
                createElement('div', {
                    key: 'content-container',
                    className: 'bg-white rounded-xl p-6 border border-gray-200 shadow-sm'
                }, [
                    createElement('h4', {
                        key: 'section-title',
                        className: 'text-lg font-semibold text-gray-800 mb-6'
                    }, sections.find(s => s.id === activeSection)?.title),
                    
                    // Dynamic section content
                    renderSectionContent()
                ])
            ])
        ]),
        
        // Action Bar
        createElement('div', {
            key: 'action-bar',
            className: 'flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200'
        }, [
            createElement('div', {
                key: 'action-info',
                className: 'text-sm text-gray-600'
            }, `${Object.keys(settings).length} ${language === 'he' ? 'הגדרות מוגדרות' : 'settings configured'}`),
            
            createElement('div', {
                key: 'action-buttons',
                className: 'flex gap-3'
            }, [
                createElement('button', {
                    key: 'defaults-btn',
                    onClick: loadDefaultSettings,
                    className: 'px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50'
                }, t.loadDefaults),
                createElement('button', {
                    key: 'save-btn',
                    onClick: saveAllSettings,
                    className: 'px-6 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700'
                }, t.saveSettings)
            ])
        ])
    ]);
};

// Export to window for global access
window.AdvancedSettingsPanel = AdvancedSettingsPanel;