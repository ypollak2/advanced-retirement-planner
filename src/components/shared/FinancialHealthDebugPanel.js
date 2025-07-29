// Financial Health Debug Panel - Comprehensive input analysis and debugging
// Created for TICKET-004: Financial Health Score System Repair

(function() {
    'use strict';

    const FinancialHealthDebugPanel = ({ inputs, language = 'en', isOpen = false, onClose }) => {
        const { createElement, useState, useEffect } = React;
        
        // State for debug data
        const [debugData, setDebugData] = useState(null);
        const [activeTab, setActiveTab] = useState('inputs');
        
        // Translations
        const content = {
            en: {
                title: 'Financial Health Score Debug Panel',
                subtitle: 'Diagnostic information for troubleshooting score calculations',
                tabs: {
                    inputs: 'Raw Inputs',
                    mapping: 'Field Mapping',
                    calculations: 'Score Calculations',
                    validation: 'Data Validation'
                },
                inputsSection: {
                    title: 'All Input Fields',
                    totalFields: 'Total Fields',
                    planningType: 'Planning Type',
                    fieldCategories: 'Field Categories',
                    salaryFields: 'Salary Fields',
                    pensionFields: 'Pension Fields',
                    savingsFields: 'Savings Fields',
                    expenseFields: 'Expense Fields'
                },
                mappingSection: {
                    title: 'Field Mapping Analysis',
                    expectedFields: 'Expected Fields',
                    foundFields: 'Fields Found',
                    missingFields: 'Missing Fields',
                    testMapping: 'Test Field Mapping'
                },
                calculationsSection: {
                    title: 'Score Calculation Breakdown',
                    totalScore: 'Total Score',
                    factorScores: 'Individual Factor Scores',
                    calculationErrors: 'Calculation Errors',
                    debugLogs: 'Debug Logs'
                },
                validationSection: {
                    title: 'Data Validation Results',
                    requiredFields: 'Required Fields Check',
                    dataTypes: 'Data Type Validation',
                    valueRanges: 'Value Range Validation',
                    recommendations: 'Fix Recommendations'
                },
                close: 'Close Debug Panel',
                refresh: 'Refresh Data',
                export: 'Export Debug Report'
            },
            he: {
                title: 'פאנל ניפוי שגיאות - ציון בריאות פיננסית',
                subtitle: 'מידע אבחוני לפתרון בעיות בחישובי הציון',
                tabs: {
                    inputs: 'נתוני קלט',
                    mapping: 'מיפוי שדות',
                    calculations: 'חישובי ציון',
                    validation: 'אימות נתונים'
                },
                close: 'סגור פאנל ניפוי',
                refresh: 'רענן נתונים',
                export: 'יצא דוח ניפוי'
            }
        };

        const t = content[language] || content.en;

        // Analyze inputs on mount and when inputs change
        useEffect(() => {
            if (inputs && isOpen) {
                analyzeInputs();
            }
        }, [inputs, isOpen]);

        const analyzeInputs = () => {
            console.log('🔍 DEBUG PANEL: Starting input analysis...');
            
            const analysis = {
                timestamp: new Date().toISOString(),
                inputSummary: analyzeInputSummary(inputs),
                fieldMapping: analyzeFieldMapping(inputs),
                scoreCalculations: analyzeScoreCalculations(inputs),
                validation: analyzeValidation(inputs)
            };
            
            setDebugData(analysis);
            console.log('📊 DEBUG PANEL: Analysis complete', analysis);
        };

        const analyzeInputSummary = (inputs) => {
            const allFields = Object.keys(inputs);
            const categorizeField = (fieldName) => {
                const name = fieldName.toLowerCase();
                if (name.includes('salary') || name.includes('income')) return 'salary';
                if (name.includes('pension') || name.includes('retirement')) return 'pension';
                if (name.includes('savings') || name.includes('investment')) return 'savings';
                if (name.includes('expense') || name.includes('cost')) return 'expense';
                if (name.includes('debt') || name.includes('loan')) return 'debt';
                if (name.includes('tax')) return 'tax';
                return 'other';
            };

            const fieldsByCategory = allFields.reduce((acc, field) => {
                const category = categorizeField(field);
                if (!acc[category]) acc[category] = [];
                acc[category].push({
                    name: field,
                    value: inputs[field],
                    type: typeof inputs[field],
                    isEmpty: !inputs[field] || inputs[field] === '' || inputs[field] === 0
                });
                return acc;
            }, {});

            return {
                totalFields: allFields.length,
                planningType: inputs.planningType || 'unknown',
                fieldsByCategory,
                nonEmptyFields: allFields.filter(f => inputs[f] && inputs[f] !== '' && inputs[f] !== 0).length,
                partnerFields: allFields.filter(f => f.toLowerCase().includes('partner')).length
            };
        };

        const analyzeFieldMapping = (inputs) => {
            // Test field mapping for each score component
            const mappingTests = [
                {
                    component: 'Savings Rate',
                    expectedFields: ['currentMonthlySalary', 'monthlySalary', 'salary', 'monthlyIncome']
                },
                {
                    component: 'Retirement Readiness',
                    expectedFields: ['currentPensionSavings', 'pensionSavings', 'retirementSavings']
                },
                {
                    component: 'Emergency Fund',
                    expectedFields: ['emergencyFund', 'currentSavings', 'liquidSavings']
                },
                {
                    component: 'Tax Efficiency',
                    expectedFields: ['pensionEmployeeRate', 'pensionEmployerRate', 'trainingFundRate']
                }
            ];

            // Safe static test function execution
            const executeFieldValueTest = (testFields) => {
                if (!window.getFieldValue) return null;
                try {
                    return window.getFieldValue(inputs, testFields, { debugMode: true });
                } catch (e) {
                    return { error: e.message };
                }
            };

            return mappingTests.map(test => {
                // Use safe static function call instead of dynamic testFunction
                const result = executeFieldValueTest(test.expectedFields);
                const error = result && result.error ? result.error : null;

                const foundFields = test.expectedFields.filter(field => 
                    inputs[field] !== undefined && inputs[field] !== null && inputs[field] !== ''
                );

                const missingFields = test.expectedFields.filter(field => 
                    inputs[field] === undefined || inputs[field] === null || inputs[field] === ''
                );

                return {
                    component: test.component,
                    expectedFields: test.expectedFields,
                    foundFields,
                    missingFields,
                    mappingResult: result,
                    mappingError: error,
                    status: foundFields.length > 0 ? 'success' : 'missing_data'
                };
            });
        };

        const analyzeScoreCalculations = (inputs) => {
            // Test each score calculation individually
            const calculationTests = [];
            
            if (window.financialHealthEngine) {
                const engine = window.financialHealthEngine;
                const testCalculators = [
                    { name: 'Savings Rate', func: engine.calculateSavingsRateScore },
                    { name: 'Retirement Readiness', func: engine.calculateRetirementReadinessScore },
                    { name: 'Emergency Fund', func: engine.calculateEmergencyFundScore },
                    { name: 'Debt Management', func: engine.calculateDebtManagementScore }
                ];

                testCalculators.forEach(calc => {
                    if (calc.func) {
                        try {
                            const startTime = Date.now();
                            const result = calc.func(inputs);
                            const endTime = Date.now();
                            
                            calculationTests.push({
                                name: calc.name,
                                result,
                                executionTime: endTime - startTime,
                                status: 'success',
                                error: null
                            });
                        } catch (error) {
                            calculationTests.push({
                                name: calc.name,
                                result: null,
                                executionTime: null,
                                status: 'error',
                                error: error.message
                            });
                        }
                    } else {
                        calculationTests.push({
                            name: calc.name,
                            result: null,
                            executionTime: null,
                            status: 'not_available',
                            error: 'Calculator function not found'
                        });
                    }
                });
            }

            // Test full score calculation
            let fullScoreTest = null;
            if (window.calculateFinancialHealthScore) {
                try {
                    const startTime = Date.now();
                    const fullResult = window.calculateFinancialHealthScore(inputs);
                    const endTime = Date.now();
                    
                    fullScoreTest = {
                        result: fullResult,
                        executionTime: endTime - startTime,
                        status: 'success',
                        error: null
                    };
                } catch (error) {
                    fullScoreTest = {
                        result: null,
                        executionTime: null,
                        status: 'error',
                        error: error.message
                    };
                }
            }

            return {
                individualCalculators: calculationTests,
                fullCalculation: fullScoreTest
            };
        };

        const analyzeValidation = (inputs) => {
            const validationResults = [];
            
            // Check required fields for basic functionality
            const requiredChecks = [
                { field: 'planningType', required: true, expectedValues: ['individual', 'couple'] },
                { field: 'currentAge', required: true, expectedType: 'number', min: 18, max: 100 },
                { field: 'retirementAge', required: true, expectedType: 'number', min: 50, max: 100 },
                { field: 'currentMonthlySalary', required: false, expectedType: 'number', min: 0 }
            ];

            requiredChecks.forEach(check => {
                const value = inputs[check.field];
                const result = {
                    field: check.field,
                    value,
                    status: 'success',
                    issues: []
                };

                if (check.required && (value === undefined || value === null || value === '')) {
                    result.status = 'error';
                    result.issues.push('Required field is missing');
                }

                if (value !== undefined && value !== null && value !== '') {
                    if (check.expectedType === 'number') {
                        const numValue = parseFloat(value);
                        if (isNaN(numValue)) {
                            result.status = 'error';
                            result.issues.push('Expected number but got non-numeric value');
                        } else {
                            if (check.min !== undefined && numValue < check.min) {
                                result.status = 'warning';
                                result.issues.push(`Value ${numValue} is below minimum ${check.min}`);
                            }
                            if (check.max !== undefined && numValue > check.max) {
                                result.status = 'warning';
                                result.issues.push(`Value ${numValue} is above maximum ${check.max}`);
                            }
                        }
                    }

                    if (check.expectedValues && !check.expectedValues.includes(value)) {
                        result.status = 'warning';
                        result.issues.push(`Unexpected value. Expected one of: ${check.expectedValues.join(', ')}`);
                    }
                }

                validationResults.push(result);
            });

            return validationResults;
        };

        const renderTabContent = () => {
            if (!debugData) {
                return createElement('div', { className: 'p-4' }, 
                    createElement('p', {}, 'Loading debug data...')
                );
            }

            switch (activeTab) {
                case 'inputs':
                    return renderInputsTab();
                case 'mapping':
                    return renderMappingTab();
                case 'calculations':
                    return renderCalculationsTab();
                case 'validation':
                    return renderValidationTab();
                default:
                    return null;
            }
        };

        const renderInputsTab = () => {
            const { inputSummary } = debugData;
            
            return createElement('div', { className: 'p-4 space-y-4' }, [
                // Summary stats
                createElement('div', { key: 'summary', className: 'grid grid-cols-3 gap-4' }, [
                    createElement('div', { key: 'total', className: 'bg-blue-50 p-3 rounded' }, [
                        createElement('div', { key: 'label', className: 'text-sm text-gray-600' }, t.inputsSection.totalFields),
                        createElement('div', { key: 'value', className: 'text-2xl font-bold' }, inputSummary.totalFields)
                    ]),
                    createElement('div', { key: 'non-empty', className: 'bg-green-50 p-3 rounded' }, [
                        createElement('div', { key: 'label', className: 'text-sm text-gray-600' }, 'Non-empty Fields'),
                        createElement('div', { key: 'value', className: 'text-2xl font-bold' }, inputSummary.nonEmptyFields)
                    ]),
                    createElement('div', { key: 'planning', className: 'bg-purple-50 p-3 rounded' }, [
                        createElement('div', { key: 'label', className: 'text-sm text-gray-600' }, t.inputsSection.planningType),
                        createElement('div', { key: 'value', className: 'text-lg font-bold' }, inputSummary.planningType)
                    ])
                ]),
                
                // Field categories
                createElement('div', { key: 'categories' }, [
                    createElement('h4', { key: 'title', className: 'font-semibold mb-2' }, t.inputsSection.fieldCategories),
                    ...Object.entries(inputSummary.fieldsByCategory).map(([category, fields]) =>
                        createElement('div', { key: category, className: 'mb-4' }, [
                            createElement('h5', { key: 'cat-title', className: 'font-medium capitalize mb-2' }, 
                                `${category} (${fields.length})`),
                            createElement('div', { key: 'fields', className: 'grid grid-cols-2 gap-2 text-sm' },
                                fields.map(field => 
                                    createElement('div', { 
                                        key: field.name, 
                                        className: `p-2 rounded ${field.isEmpty ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`
                                    }, [
                                        createElement('div', { key: 'name', className: 'font-medium' }, field.name),
                                        createElement('div', { key: 'value', className: 'text-xs' }, 
                                            `${field.type}: ${field.isEmpty ? 'empty' : String(field.value).substring(0, 50)}`)
                                    ])
                                )
                            )
                        ])
                    )
                ])
            ]);
        };

        const renderMappingTab = () => {
            const { fieldMapping } = debugData;
            
            return createElement('div', { className: 'p-4 space-y-4' }, 
                fieldMapping.map(mapping => 
                    createElement('div', { 
                        key: mapping.component, 
                        className: `border rounded p-4 ${mapping.status === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`
                    }, [
                        createElement('h4', { key: 'title', className: 'font-semibold mb-2' }, mapping.component),
                        createElement('div', { key: 'status', className: 'mb-2' }, [
                            createElement('span', { 
                                key: 'badge',
                                className: `px-2 py-1 rounded text-xs ${mapping.status === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`
                            }, mapping.status)
                        ]),
                        createElement('div', { key: 'details', className: 'grid grid-cols-2 gap-4 text-sm' }, [
                            createElement('div', { key: 'found' }, [
                                createElement('div', { key: 'label', className: 'font-medium' }, 'Found Fields'),
                                createElement('ul', { key: 'list', className: 'list-disc list-inside' },
                                    mapping.foundFields.map(field =>
                                        createElement('li', { key: field, className: 'text-green-600' }, field)
                                    )
                                )
                            ]),
                            createElement('div', { key: 'missing' }, [
                                createElement('div', { key: 'label', className: 'font-medium' }, 'Missing Fields'),
                                createElement('ul', { key: 'list', className: 'list-disc list-inside' },
                                    mapping.missingFields.map(field =>
                                        createElement('li', { key: field, className: 'text-red-600' }, field)
                                    )
                                )
                            ])
                        ]),
                        mapping.mappingResult !== null && createElement('div', { key: 'result', className: 'mt-2' }, [
                            createElement('div', { key: 'label', className: 'font-medium text-xs' }, 'Mapping Result:'),
                            createElement('div', { key: 'value', className: 'text-sm font-mono' }, String(mapping.mappingResult))
                        ]),
                        mapping.mappingError && createElement('div', { key: 'error', className: 'mt-2 text-red-600 text-sm' }, 
                            `Error: ${mapping.mappingError}`)
                    ])
                )
            );
        };

        const renderCalculationsTab = () => {
            const { scoreCalculations } = debugData;
            
            return createElement('div', { className: 'p-4 space-y-4' }, [
                // Full calculation result
                scoreCalculations.fullCalculation && createElement('div', { 
                    key: 'full-calc', 
                    className: `border rounded p-4 ${scoreCalculations.fullCalculation.status === 'success' ? 'border-blue-200 bg-blue-50' : 'border-red-200 bg-red-50'}`
                }, [
                    createElement('h4', { key: 'title', className: 'font-semibold mb-2' }, 'Full Score Calculation'),
                    createElement('div', { key: 'result' }, [
                        scoreCalculations.fullCalculation.result && createElement('div', { key: 'score', className: 'text-2xl font-bold' }, 
                            `${scoreCalculations.fullCalculation.result.totalScore}/100`),
                        createElement('div', { key: 'time', className: 'text-sm text-gray-600' }, 
                            `Execution time: ${scoreCalculations.fullCalculation.executionTime}ms`),
                        scoreCalculations.fullCalculation.error && createElement('div', { key: 'error', className: 'text-red-600 text-sm' }, 
                            scoreCalculations.fullCalculation.error)
                    ])
                ]),
                
                // Individual calculators
                createElement('div', { key: 'individual' }, [
                    createElement('h4', { key: 'title', className: 'font-semibold mb-2' }, 'Individual Calculator Tests'),
                    createElement('div', { key: 'calculators', className: 'space-y-2' },
                        scoreCalculations.individualCalculators.map(calc => 
                            createElement('div', { 
                                key: calc.name, 
                                className: `p-3 rounded border ${calc.status === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`
                            }, [
                                createElement('div', { key: 'header', className: 'flex justify-between items-center' }, [
                                    createElement('span', { key: 'name', className: 'font-medium' }, calc.name),
                                    createElement('span', { key: 'status', className: `px-2 py-1 rounded text-xs ${getStatusColor(calc.status)}` }, 
                                        calc.status)
                                ]),
                                calc.result && createElement('div', { key: 'result', className: 'mt-2 text-sm' }, [
                                    createElement('div', { key: 'score' }, `Score: ${calc.result.score}`),
                                    calc.executionTime && createElement('div', { key: 'time' }, `Time: ${calc.executionTime}ms`)
                                ]),
                                calc.error && createElement('div', { key: 'error', className: 'mt-2 text-red-600 text-sm' }, calc.error)
                            ])
                        )
                    )
                ])
            ]);
        };

        const renderValidationTab = () => {
            const { validation } = debugData;
            
            return createElement('div', { className: 'p-4 space-y-4' },
                validation.map(result => 
                    createElement('div', { 
                        key: result.field, 
                        className: `p-3 rounded border ${getValidationColor(result.status)}`
                    }, [
                        createElement('div', { key: 'header', className: 'flex justify-between items-center mb-2' }, [
                            createElement('span', { key: 'field', className: 'font-medium' }, result.field),
                            createElement('span', { key: 'status', className: `px-2 py-1 rounded text-xs ${getStatusColor(result.status)}` }, 
                                result.status)
                        ]),
                        createElement('div', { key: 'value', className: 'text-sm mb-2' }, 
                            `Value: ${result.value === undefined || result.value === null ? 'undefined' : String(result.value)}`),
                        result.issues.length > 0 && createElement('ul', { key: 'issues', className: 'list-disc list-inside text-sm text-red-600' },
                            result.issues.map((issue, idx) => 
                                createElement('li', { key: idx }, issue)
                            )
                        )
                    ])
                )
            );
        };

        const getStatusColor = (status) => {
            switch (status) {
                case 'success': return 'bg-green-200 text-green-800';
                case 'warning': return 'bg-yellow-200 text-yellow-800';
                case 'error': return 'bg-red-200 text-red-800';
                default: return 'bg-gray-200 text-gray-800';
            }
        };

        const getValidationColor = (status) => {
            switch (status) {
                case 'success': return 'border-green-200 bg-green-50';
                case 'warning': return 'border-yellow-200 bg-yellow-50';
                case 'error': return 'border-red-200 bg-red-50';
                default: return 'border-gray-200 bg-gray-50';
            }
        };

        if (!isOpen) return null;

        return createElement('div', { 
            className: 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'
        }, [
            createElement('div', { 
                key: 'modal',
                className: 'bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-screen overflow-hidden flex flex-col'
            }, [
                // Header
                createElement('div', { key: 'header', className: 'border-b p-4 flex justify-between items-center' }, [
                    createElement('div', { key: 'title-section' }, [
                        createElement('h2', { key: 'title', className: 'text-xl font-bold' }, t.title),
                        createElement('p', { key: 'subtitle', className: 'text-sm text-gray-600' }, t.subtitle)
                    ]),
                    createElement('div', { key: 'actions', className: 'flex space-x-2' }, [
                        createElement('button', {
                            key: 'refresh',
                            onClick: analyzeInputs,
                            className: 'px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600'
                        }, t.refresh),
                        createElement('button', {
                            key: 'close',
                            onClick: onClose,
                            className: 'px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600'
                        }, t.close)
                    ])
                ]),
                
                // Tabs
                createElement('div', { key: 'tabs', className: 'border-b' }, 
                    createElement('nav', { className: 'flex space-x-8 px-4' },
                        Object.entries(t.tabs).map(([key, label]) =>
                            createElement('button', {
                                key,
                                onClick: () => setActiveTab(key),
                                className: `py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === key 
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`
                            }, label)
                        )
                    )
                ),
                
                // Content
                createElement('div', { key: 'content', className: 'flex-1 overflow-auto' }, 
                    renderTabContent()
                )
            ])
        ]);
    };

    // Export to window for global access
    window.FinancialHealthDebugPanel = FinancialHealthDebugPanel;
    console.log('✅ Financial Health Debug Panel loaded');

})();