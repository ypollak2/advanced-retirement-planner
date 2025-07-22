// ScenarioEditor.js - Detailed Scenario Parameter Editor
// Created by Yali Pollak (יהלי פולק) - Advanced Retirement Planner v6.3.0

const ScenarioEditor = ({ 
    scenario, 
    onUpdateScenario, 
    onClose,
    language = 'en', 
    workingCurrency = 'ILS' 
}) => {
    const createElement = React.createElement;
    
    const [editedData, setEditedData] = React.useState({ ...scenario.data });
    const [activeTab, setActiveTab] = React.useState('basic');
    
    // Multi-language content
    const content = {
        he: {
            title: 'עריכת תרחיש',
            
            // Tabs
            basicTab: 'בסיסי',
            advancedTab: 'מתקדם',
            investmentTab: 'השקעות',
            taxTab: 'מס',
            
            // Basic parameters
            scenarioName: 'שם התרחיש',
            currentAge: 'גיל נוכחי',
            retirementAge: 'גיל פרישה',
            currentSalary: 'משכורת חודשית נוכחית',
            salaryGrowth: 'צמיחת שכר שנתית (%)',
            
            // Investment parameters
            expectedReturn: 'תשואה צפויה שנתית (%)',
            inflationRate: 'שיעור אינפלציה (%)',
            marketVolatility: 'תנודתיות שוק (%)',
            stockPercentage: 'אחוז מניות בתיק (%)',
            bondPercentage: 'אחוז אגרות חוב (%)',
            alternativePercentage: 'אחוז השקעות אלטרנטיביות (%)',
            
            // Contributions
            pensionContribution: 'הפקדה לפנסיה (%)',
            trainingFundContribution: 'הפקדה לקרן השתלמות (%)',
            personalSavings: 'חיסכון אישי חודשי',
            
            // Tax optimization
            taxCountry: 'מדינת מס',
            marginalTaxRate: 'שיעור מס שולי (%)',
            taxOptimization: 'אופטימיזציה מיסויית',
            
            // Stress testing
            marketCrashImpact: 'השפעת קריסת שוק (%)',
            inflationSpike: 'זינוק אינפלציה (%)',
            unemploymentPeriod: 'תקופת אבטלה (חודשים)',
            healthCareCosts: 'עלויות בריאות נוספות',
            
            // Actions
            save: 'שמור שינויים',
            cancel: 'ביטול',
            reset: 'איפוס לברירת מחדל',
            preview: 'תצוגה מקדימה',
            
            // Validation messages
            invalidAge: 'גיל לא תקין',
            invalidSalary: 'משכורת לא תקינה',
            invalidPercentage: 'אחוז לא תקין (0-100)',
            
            info: 'שנה פרמטרים לראות כיצד הם משפיעים על תוצאות הפרישה'
        },
        en: {
            title: 'Edit Scenario',
            
            // Tabs
            basicTab: 'Basic',
            advancedTab: 'Advanced',
            investmentTab: 'Investments',
            taxTab: 'Tax',
            
            // Basic parameters
            scenarioName: 'Scenario Name',
            currentAge: 'Current Age',
            retirementAge: 'Retirement Age',
            currentSalary: 'Current Monthly Salary',
            salaryGrowth: 'Annual Salary Growth (%)',
            
            // Investment parameters
            expectedReturn: 'Expected Annual Return (%)',
            inflationRate: 'Inflation Rate (%)',
            marketVolatility: 'Market Volatility (%)',
            stockPercentage: 'Stock Percentage (%)',
            bondPercentage: 'Bond Percentage (%)',
            alternativePercentage: 'Alternative Investments (%)',
            
            // Contributions
            pensionContribution: 'Pension Contribution (%)',
            trainingFundContribution: 'Training Fund Contribution (%)',
            personalSavings: 'Monthly Personal Savings',
            
            // Tax optimization
            taxCountry: 'Tax Country',
            marginalTaxRate: 'Marginal Tax Rate (%)',
            taxOptimization: 'Tax Optimization',
            
            // Stress testing
            marketCrashImpact: 'Market Crash Impact (%)',
            inflationSpike: 'Inflation Spike (%)',
            unemploymentPeriod: 'Unemployment Period (months)',
            healthCareCosts: 'Additional Healthcare Costs',
            
            // Actions
            save: 'Save Changes',
            cancel: 'Cancel',
            reset: 'Reset to Default',
            preview: 'Preview Results',
            
            // Validation messages
            invalidAge: 'Invalid age',
            invalidSalary: 'Invalid salary',
            invalidPercentage: 'Invalid percentage (0-100)',
            
            info: 'Modify parameters to see how they affect retirement outcomes'
        }
    };

    const t = content[language];

    // Validation functions
    const validateAge = (age) => age >= 18 && age <= 100;
    const validatePercentage = (value) => value >= 0 && value <= 100;
    const validateSalary = (salary) => salary > 0 && salary <= 1000000;

    // Handle input changes with validation
    const handleInputChange = (field, value) => {
        setEditedData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Calculate preview results
    const calculatePreviewResults = () => {
        if (!window.calculateRetirement) return null;
        
        try {
            return window.calculateRetirement(editedData);
        } catch (error) {
            console.error('Error calculating preview:', error);
            return null;
        }
    };

    // Reset to default values
    const resetToDefaults = () => {
        const defaults = {
            currentAge: 30,
            retirementAge: 67,
            currentMonthlySalary: 15000,
            salaryGrowthRate: 3,
            expectedReturn: 7,
            inflationRate: 3,
            marketVolatility: 15,
            stockPercentage: 60,
            bondPercentage: 30,
            alternativePercentage: 10,
            pensionContributionRate: 17.5,
            trainingFundContributionRate: 7.5,
            personalMonthlySavings: 1000,
            marginalTaxRate: 31
        };
        
        setEditedData(prev => ({ ...prev, ...defaults }));
    };

    // Save changes
    const saveChanges = () => {
        // Validate critical fields
        if (!validateAge(editedData.currentAge)) {
            alert(t.invalidAge);
            return;
        }
        if (!validateAge(editedData.retirementAge)) {
            alert(t.invalidAge);
            return;
        }
        if (!validateSalary(editedData.currentMonthlySalary)) {
            alert(t.invalidSalary);
            return;
        }
        
        onUpdateScenario(scenario.id, editedData);
        onClose();
    };

    // Render input field
    const renderInputField = (field, label, type = 'number', step = '1', min = '0', max = null) => {
        return createElement('div', {
            key: field,
            className: 'mb-4'
        }, [
            createElement('label', {
                key: 'label',
                className: 'block text-sm font-medium text-gray-700 mb-2'
            }, label),
            createElement('input', {
                key: 'input',
                type: type,
                value: editedData[field] || '',
                onChange: (e) => handleInputChange(field, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value),
                step: step,
                min: min,
                max: max,
                className: 'w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            })
        ]);
    };

    // Render slider field
    const renderSliderField = (field, label, min = 0, max = 100, step = 1) => {
        const value = editedData[field] || 0;
        
        return createElement('div', {
            key: field,
            className: 'mb-4'
        }, [
            createElement('label', {
                key: 'label',
                className: 'block text-sm font-medium text-gray-700 mb-2'
            }, `${label}: ${value}%`),
            createElement('input', {
                key: 'slider',
                type: 'range',
                value: value,
                onChange: (e) => handleInputChange(field, parseFloat(e.target.value)),
                min: min,
                max: max,
                step: step,
                className: 'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider'
            })
        ]);
    };

    // Render basic tab
    const renderBasicTab = () => {
        return createElement('div', { key: 'basic-tab', className: 'space-y-4' }, [
            renderInputField('scenarioName', t.scenarioName, 'text'),
            
            createElement('div', {
                key: 'age-grid',
                className: 'grid grid-cols-2 gap-4'
            }, [
                renderInputField('currentAge', t.currentAge, 'number', '1', '18', '100'),
                renderInputField('retirementAge', t.retirementAge, 'number', '1', '50', '80')
            ]),
            
            renderInputField('currentMonthlySalary', t.currentSalary, 'number', '100', '0'),
            renderSliderField('salaryGrowthRate', t.salaryGrowth, 0, 10, 0.1)
        ]);
    };

    // Render investment tab
    const renderInvestmentTab = () => {
        return createElement('div', { key: 'investment-tab', className: 'space-y-4' }, [
            renderSliderField('expectedReturn', t.expectedReturn, 0, 20, 0.1),
            renderSliderField('inflationRate', t.inflationRate, 0, 10, 0.1),
            renderSliderField('marketVolatility', t.marketVolatility, 5, 30, 0.5),
            
            createElement('h4', {
                key: 'allocation-title',
                className: 'text-lg font-semibold text-gray-700 mt-6 mb-4'
            }, language === 'he' ? 'הקצאת תיק השקעות' : 'Portfolio Allocation'),
            
            renderSliderField('stockPercentage', t.stockPercentage, 0, 100, 1),
            renderSliderField('bondPercentage', t.bondPercentage, 0, 100, 1),
            renderSliderField('alternativePercentage', t.alternativePercentage, 0, 100, 1),
            
            // Allocation validation
            createElement('div', {
                key: 'allocation-check',
                className: 'bg-gray-50 rounded-lg p-4 border'
            }, [
                createElement('p', {
                    key: 'allocation-total',
                    className: `text-sm ${
                        (editedData.stockPercentage + editedData.bondPercentage + editedData.alternativePercentage) === 100
                            ? 'text-green-600'
                            : 'text-red-600'
                    }`
                }, `${language === 'he' ? 'סך הכל' : 'Total'}: ${
                    (editedData.stockPercentage || 0) + 
                    (editedData.bondPercentage || 0) + 
                    (editedData.alternativePercentage || 0)
                }%`)
            ])
        ]);
    };

    // Render advanced tab
    const renderAdvancedTab = () => {
        return createElement('div', { key: 'advanced-tab', className: 'space-y-4' }, [
            renderSliderField('pensionContributionRate', t.pensionContribution, 0, 30, 0.5),
            renderSliderField('trainingFundContributionRate', t.trainingFundContribution, 0, 15, 0.5),
            renderInputField('personalMonthlySavings', t.personalSavings, 'number', '100', '0'),
            
            createElement('h4', {
                key: 'stress-title',
                className: 'text-lg font-semibold text-gray-700 mt-6 mb-4'
            }, language === 'he' ? 'בדיקות עמידות' : 'Stress Testing'),
            
            renderSliderField('marketCrashImpact', t.marketCrashImpact, 0, 50, 1),
            renderSliderField('inflationSpike', t.inflationSpike, 0, 15, 0.5),
            renderInputField('unemploymentPeriod', t.unemploymentPeriod, 'number', '1', '0', '60'),
            renderInputField('healthCareCosts', t.healthCareCosts, 'number', '100', '0')
        ]);
    };

    // Render tax tab
    const renderTaxTab = () => {
        return createElement('div', { key: 'tax-tab', className: 'space-y-4' }, [
            createElement('div', { key: 'tax-country', className: 'mb-4' }, [
                createElement('label', {
                    key: 'tax-country-label',
                    className: 'block text-sm font-medium text-gray-700 mb-2'
                }, t.taxCountry),
                createElement('select', {
                    key: 'tax-country-select',
                    value: editedData.taxCountry || 'israel',
                    onChange: (e) => handleInputChange('taxCountry', e.target.value),
                    className: 'w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                }, [
                    createElement('option', { key: 'israel', value: 'israel' }, '🇮🇱 Israel'),
                    createElement('option', { key: 'uk', value: 'uk' }, '🇬🇧 United Kingdom'),
                    createElement('option', { key: 'us', value: 'us' }, '🇺🇸 United States'),
                    createElement('option', { key: 'eu', value: 'eu' }, '🇪🇺 European Union')
                ])
            ]),
            
            renderSliderField('marginalTaxRate', t.marginalTaxRate, 0, 60, 1),
            
            createElement('div', {
                key: 'tax-optimization',
                className: 'bg-blue-50 rounded-lg p-4 border border-blue-200'
            }, [
                createElement('h4', {
                    key: 'optimization-title',
                    className: 'font-semibold text-blue-700 mb-2'
                }, t.taxOptimization),
                createElement('p', {
                    key: 'optimization-desc',
                    className: 'text-blue-600 text-sm'
                }, language === 'he' ? 
                    'אופטימיזציה מיסויית יכולה לחסוך אלפי שקלים בשנה' :
                    'Tax optimization can save thousands per year in retirement planning')
            ])
        ]);
    };

    // Render preview results
    const renderPreviewResults = () => {
        const results = calculatePreviewResults();
        if (!results) return null;
        
        return createElement('div', {
            key: 'preview-results',
            className: 'bg-gray-50 rounded-lg p-4 border'
        }, [
            createElement('h4', {
                key: 'preview-title',
                className: 'font-semibold text-gray-700 mb-4'
            }, t.preview),
            
            createElement('div', {
                key: 'preview-grid',
                className: 'grid grid-cols-2 gap-4'
            }, [
                createElement('div', { key: 'total-preview' }, [
                    createElement('div', {
                        key: 'total-label',
                        className: 'text-sm text-gray-600'
                    }, language === 'he' ? 'סך צבירה' : 'Total Accumulation'),
                    createElement('div', {
                        key: 'total-value',
                        className: 'text-lg font-bold text-gray-800'
                    }, formatCurrency(results.totalAccumulated || 0, workingCurrency))
                ]),
                
                createElement('div', { key: 'monthly-preview' }, [
                    createElement('div', {
                        key: 'monthly-label',
                        className: 'text-sm text-gray-600'
                    }, language === 'he' ? 'הכנסה חודשית' : 'Monthly Income'),
                    createElement('div', {
                        key: 'monthly-value',
                        className: 'text-lg font-bold text-gray-800'
                    }, formatCurrency(results.monthlyIncome || 0, workingCurrency))
                ])
            ])
        ]);
    };

    // Format currency helper
    const formatCurrency = (amount, currency) => {
        if (window.formatCurrency) {
            return window.formatCurrency(amount, currency);
        }
        
        const symbols = { ILS: '₪', USD: '$', GBP: '£', EUR: '€' };
        const symbol = symbols[currency] || '₪';
        return `${symbol}${Math.round(amount).toLocaleString()}`;
    };

    return createElement('div', {
        className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
    }, [
        createElement('div', {
            key: 'editor-modal',
            className: 'bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col'
        }, [
            // Header
            createElement('div', {
                key: 'editor-header',
                className: 'flex justify-between items-center p-6 border-b'
            }, [
                createElement('h2', {
                    key: 'editor-title',
                    className: 'text-2xl font-bold text-gray-800'
                }, `${t.title}: ${scenario.name}`),
                createElement('button', {
                    key: 'close-btn',
                    onClick: onClose,
                    className: 'text-gray-500 hover:text-gray-700 text-2xl'
                }, '×')
            ]),
            
            // Tab navigation
            createElement('div', {
                key: 'tab-nav',
                className: 'flex border-b bg-gray-50'
            }, [
                ['basic', t.basicTab],
                ['investment', t.investmentTab],
                ['advanced', t.advancedTab],
                ['tax', t.taxTab]
            ].map(([tab, label]) =>
                createElement('button', {
                    key: tab,
                    onClick: () => setActiveTab(tab),
                    className: `px-6 py-3 font-medium transition-colors ${
                        activeTab === tab
                            ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                            : 'text-gray-600 hover:text-gray-800'
                    }`
                }, label)
            )),
            
            // Content area
            createElement('div', {
                key: 'editor-content',
                className: 'flex-1 overflow-y-auto p-6'
            }, [
                activeTab === 'basic' && renderBasicTab(),
                activeTab === 'investment' && renderInvestmentTab(),
                activeTab === 'advanced' && renderAdvancedTab(),
                activeTab === 'tax' && renderTaxTab(),
                
                // Preview results
                renderPreviewResults()
            ]),
            
            // Footer actions
            createElement('div', {
                key: 'editor-footer',
                className: 'flex justify-between items-center p-6 border-t bg-gray-50'
            }, [
                createElement('button', {
                    key: 'reset-btn',
                    onClick: resetToDefaults,
                    className: 'px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors'
                }, t.reset),
                
                createElement('div', {
                    key: 'action-buttons',
                    className: 'flex space-x-4'
                }, [
                    createElement('button', {
                        key: 'cancel-btn',
                        onClick: onClose,
                        className: 'px-6 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors'
                    }, t.cancel),
                    createElement('button', {
                        key: 'save-btn',
                        onClick: saveChanges,
                        className: 'px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                    }, t.save)
                ])
            ])
        ])
    ]);
};

// Export the component
window.ScenarioEditor = ScenarioEditor;

console.log('✅ ScenarioEditor component loaded successfully');