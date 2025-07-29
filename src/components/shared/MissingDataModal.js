// Missing Data Modal Component - Interactive data completion for Financial Health Score
// Created by Yali Pollak (יהלי פולק) - v7.0.3

(function() {
    'use strict';

    const MissingDataModal = ({ 
        isOpen, 
        onClose, 
        inputs, 
        onInputUpdate, 
        language = 'en',
        healthReport 
    }) => {
        const { createElement, useState, useEffect } = React;
        
        const [formData, setFormData] = useState({});
        const [currentStep, setCurrentStep] = useState(0);
        const [isCalculating, setIsCalculating] = useState(false);
        const [previewScore, setPreviewScore] = useState(null);
        const [validationErrors, setValidationErrors] = useState({});

        // Multi-language content
        const content = {
            he: {
                title: 'השלמת נתונים חסרים',
                subtitle: 'השלם את הנתונים החסרים כדי לשפר את ציון הבריאות הפיננסית שלך',
                currentScore: 'ציון נוכחי',
                projectedScore: 'ציון צפוי',
                improvement: 'שיפור',
                step: 'שלב',
                of: 'מתוך',
                next: 'הבא',
                previous: 'הקודם',
                complete: 'סיום',
                cancel: 'ביטול',
                save: 'שמור',
                calculating: 'מחשב...',
                required: 'שדה חובה',
                invalidValue: 'ערך לא תקין',
                success: 'הנתונים נשמרו בהצלחה!',
                
                // Field labels
                monthlySalary: 'שכר חודשי ברוטו',
                monthlyExpenses: 'הוצאות חודשיות',
                pensionRate: 'שיעור הפקדה לפנסיה (%)',
                trainingFundRate: 'שיעור הפקדה לקופת גמל (%)',
                emergencyFund: 'קרן חירום (₪)',
                personalPortfolio: 'תיק השקעות אישי (₪)',
                realEstate: 'נדלן (₪)',
                currentAge: 'גיל נוכחי',
                retirementAge: 'גיל פרישה מתוכנן',
                
                // Partner fields
                partner1Salary: 'שכר בן/בת הזוג הראשון',
                partner2Salary: 'שכר בן/בת הזוג השני',
                partner1Pension: 'חסכון פנסיוני - בן/בת זוג ראשון',
                partner2Pension: 'חסכון פנסיוני - בן/בת זוג שני',
                
                // Instructions
                instructions: {
                    salary: 'הזן את השכר החודשי הברוטו (לפני מיסים)',
                    pension: 'הזן את שיעור ההפקדה החודשית לפנסיה כאחוז מהמשכורת',
                    trainingFund: 'הזן את שיעור ההפקדה לקופת גמל/קרן השתלמות',
                    emergency: 'הזן את סכום קרן החירום הנוכחית שלך',
                    portfolio: 'הזן את ערך תיק ההשקעות האישי שלך (מניות, אגח, קרנות)',
                    realEstate: 'הזן את הערך המוערך של נכסי הנדלן שלך'
                },
                
                // Step titles
                stepTitles: {
                    salary: 'מידע על הכנסות',
                    savings: 'חסכונות ופנסיה',
                    investments: 'השקעות ונכסים',
                    personal: 'מידע אישי'
                }
            },
            en: {
                title: 'Complete Missing Data',
                subtitle: 'Fill in the missing information to improve your financial health score',
                currentScore: 'Current Score',
                projectedScore: 'Projected Score',
                improvement: 'Improvement',
                step: 'Step',
                of: 'of',
                next: 'Next',
                previous: 'Previous', 
                complete: 'Complete',
                cancel: 'Cancel',
                save: 'Save',
                calculating: 'Calculating...',
                required: 'Required field',
                invalidValue: 'Invalid value',
                success: 'Data saved successfully!',
                
                // Field labels
                monthlySalary: 'Monthly Gross Salary',
                monthlyExpenses: 'Monthly Expenses',
                pensionRate: 'Pension Contribution Rate (%)',
                trainingFundRate: 'Training Fund Contribution Rate (%)',
                emergencyFund: 'Emergency Fund (₪)',
                personalPortfolio: 'Personal Investment Portfolio (₪)',
                realEstate: 'Real Estate (₪)',
                currentAge: 'Current Age',
                retirementAge: 'Planned Retirement Age',
                
                // Partner fields
                partner1Salary: 'Partner 1 Salary',
                partner2Salary: 'Partner 2 Salary',
                partner1Pension: 'Partner 1 Pension Savings',
                partner2Pension: 'Partner 2 Pension Savings',
                
                // Instructions
                instructions: {
                    salary: 'Enter your monthly gross salary (before taxes)',
                    pension: 'Enter your monthly pension contribution rate as a percentage of salary',
                    trainingFund: 'Enter your training fund/provident fund contribution rate',
                    emergency: 'Enter your current emergency fund amount',
                    portfolio: 'Enter the value of your personal investment portfolio (stocks, bonds, funds)',
                    realEstate: 'Enter the estimated value of your real estate assets'
                },
                
                // Step titles
                stepTitles: {
                    salary: 'Income Information',
                    savings: 'Savings & Pension',
                    investments: 'Investments & Assets',
                    personal: 'Personal Information'
                }
            }
        };

        const t = content[language] || content.en;

        // Analyze missing data from health report
        const analyzeMissingData = () => {
            if (!healthReport || !healthReport.factors) return [];

            const missingItems = [];
            
            Object.entries(healthReport.factors).forEach(([factorName, factorData]) => {
                if (factorData.score === 0) {
                    const details = factorData.details || {};
                    const status = details.status || 'unknown';
                    
                    switch (factorName) {
                        case 'savingsRate':
                            if (status === 'missing_income_data') {
                                if (inputs.planningType === 'couple') {
                                    missingItems.push({
                                        field: 'partner1Salary',
                                        label: t.partner1Salary,
                                        type: 'currency',
                                        step: 'salary',
                                        priority: 'high',
                                        instruction: t.instructions.salary,
                                        wizardStep: 2
                                    });
                                    missingItems.push({
                                        field: 'partner2Salary',
                                        label: t.partner2Salary,
                                        type: 'currency', 
                                        step: 'salary',
                                        priority: 'high',
                                        instruction: t.instructions.salary,
                                        wizardStep: 2
                                    });
                                } else {
                                    missingItems.push({
                                        field: 'monthlySalary',
                                        label: t.monthlySalary,
                                        type: 'currency',
                                        step: 'salary',
                                        priority: 'high',
                                        instruction: t.instructions.salary,
                                        wizardStep: 2
                                    });
                                }
                            } else if (status === 'missing_contribution_data') {
                                missingItems.push({
                                    field: 'pensionRate',
                                    label: t.pensionRate,
                                    type: 'percentage',
                                    step: 'savings',
                                    priority: 'high',
                                    instruction: t.instructions.pension,
                                    wizardStep: 4
                                });
                                missingItems.push({
                                    field: 'trainingFundRate',
                                    label: t.trainingFundRate,
                                    type: 'percentage',
                                    step: 'savings',
                                    priority: 'medium',
                                    instruction: t.instructions.trainingFund,
                                    wizardStep: 4
                                });
                            }
                            break;
                            
                        case 'taxEfficiency':
                            if (status === 'missing_contribution_data') {
                                missingItems.push({
                                    field: 'pensionRate',
                                    label: t.pensionRate,
                                    type: 'percentage',
                                    step: 'savings',
                                    priority: 'high',
                                    instruction: t.instructions.pension,
                                    wizardStep: 4
                                });
                            }
                            break;
                            
                        case 'emergencyFund':
                            missingItems.push({
                                field: 'emergencyFund',
                                label: t.emergencyFund,
                                type: 'currency',
                                step: 'investments',
                                priority: 'medium',
                                instruction: t.instructions.emergency,
                                wizardStep: 3
                            });
                            break;
                            
                        case 'diversification':
                            missingItems.push({
                                field: 'personalPortfolio',
                                label: t.personalPortfolio,
                                type: 'currency',
                                step: 'investments',
                                priority: 'medium',
                                instruction: t.instructions.portfolio,
                                wizardStep: 3
                            });
                            missingItems.push({
                                field: 'realEstate',
                                label: t.realEstate,
                                type: 'currency',
                                step: 'investments',
                                priority: 'low',
                                instruction: t.instructions.realEstate,
                                wizardStep: 3
                            });
                            break;
                    }
                }
            });

            // Remove duplicates and group by step
            const uniqueItems = missingItems.filter((item, index, arr) => 
                arr.findIndex(i => i.field === item.field) === index
            );

            return uniqueItems;
        };

        const missingDataItems = analyzeMissingData();

        // Group missing items by step
        const groupedSteps = missingDataItems.reduce((acc, item) => {
            if (!acc[item.step]) {
                acc[item.step] = [];
            }
            acc[item.step].push(item);
            return acc;
        }, {});

        const stepKeys = Object.keys(groupedSteps);

        // Initialize form data
        useEffect(() => {
            const initialData = {};
            missingDataItems.forEach(item => {
                initialData[item.field] = inputs[item.field] || '';
            });
            setFormData(initialData);
        }, [missingDataItems, inputs]);

        // Calculate preview score when form data changes
        useEffect(() => {
            if (Object.keys(formData).length > 0) {
                setIsCalculating(true);
                
                // Simulate calculation delay
                const timer = setTimeout(() => {
                    if (window.calculateFinancialHealthScore) {
                        const updatedInputs = { ...inputs, ...formData };
                        const newReport = window.calculateFinancialHealthScore(updatedInputs, {
                            combinePartners: inputs.planningType === 'couple',
                            debugMode: false
                        });
                        setPreviewScore(newReport?.totalScore || 0);
                    }
                    setIsCalculating(false);
                }, 500);

                return () => clearTimeout(timer);
            }
        }, [formData, inputs]);

        // Validate field values
        const validateField = (field, value) => {
            const errors = {};
            
            if (!value || value === '') {
                errors[field] = t.required;
                return errors;
            }

            const numValue = parseFloat(value);
            if (isNaN(numValue) || numValue < 0) {
                errors[field] = t.invalidValue;
                return errors;
            }

            const item = missingDataItems.find(i => i.field === field);
            if (item) {
                if (item.type === 'percentage' && numValue > 100) {
                    errors[field] = 'Maximum 100%';
                }
                if (item.type === 'currency' && numValue > 1000000) {
                    errors[field] = 'Value seems too high';
                }
            }

            return errors;
        };

        // Handle input changes
        const handleInputChange = (field, value) => {
            setFormData(prev => ({ ...prev, [field]: value }));
            
            // Clear validation error for this field
            if (validationErrors[field]) {
                setValidationErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[field];
                    return newErrors;
                });
            }
        };

        // Handle form submission
        const handleSave = () => {
            // Validate all fields
            let hasErrors = false;
            const newErrors = {};

            Object.entries(formData).forEach(([field, value]) => {
                const fieldErrors = validateField(field, value);
                if (Object.keys(fieldErrors).length > 0) {
                    Object.assign(newErrors, fieldErrors);
                    hasErrors = true;
                }
            });

            setValidationErrors(newErrors);

            if (!hasErrors) {
                // Update inputs and close modal
                onInputUpdate(formData);
                onClose();
            }
        };

        // Render input field
        const renderInputField = (item) => {
            const value = formData[item.field] || '';
            const hasError = validationErrors[item.field];

            return createElement('div', {
                key: item.field,
                className: 'mb-6'
            }, [
                createElement('label', {
                    key: 'label',
                    className: 'block text-sm font-medium text-gray-700 mb-2',
                    htmlFor: item.field
                }, [
                    item.label,
                    item.priority === 'high' && createElement('span', {
                        key: 'required',
                        className: 'text-red-500 ml-1'
                    }, '*')
                ]),
                
                createElement('div', {
                    key: 'input-container',
                    className: 'relative'
                }, [
                    createElement('input', {
                        key: 'input',
                        id: item.field,
                        type: 'number',
                        value: value,
                        onChange: (e) => handleInputChange(item.field, e.target.value),
                        className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            hasError ? 'border-red-500' : 'border-gray-300'
                        }`,
                        placeholder: item.type === 'currency' ? '0' : '0%',
                        min: '0',
                        max: item.type === 'percentage' ? '100' : undefined,
                        step: item.type === 'percentage' ? '0.1' : '1'
                    }),
                    
                    item.type === 'currency' && createElement('div', {
                        key: 'currency-symbol',
                        className: 'absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'
                    }, createElement('span', {
                        className: 'text-gray-500 text-sm'
                    }, '₪')),
                    
                    item.type === 'percentage' && createElement('div', {
                        key: 'percentage-symbol',
                        className: 'absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'
                    }, createElement('span', {
                        className: 'text-gray-500 text-sm'
                    }, '%'))
                ]),
                
                hasError && createElement('p', {
                    key: 'error',
                    className: 'mt-1 text-sm text-red-600'
                }, hasError),
                
                createElement('p', {
                    key: 'instruction',
                    className: 'mt-1 text-sm text-gray-500'
                }, item.instruction)
            ]);
        };

        // Don't render if modal is not open or no missing data
        if (!isOpen || missingDataItems.length === 0) {
            return null;
        }

        const currentStepKey = stepKeys[currentStep];
        const currentStepItems = groupedSteps[currentStepKey] || [];

        return createElement('div', {
            className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4',
            onClick: (e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }
        }, [
            createElement('div', {
                key: 'modal',
                className: 'bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl',
                onClick: (e) => e.stopPropagation()
            }, [
                // Header
                createElement('div', {
                    key: 'header',
                    className: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6'
                }, [
                    createElement('div', {
                        key: 'title-section',
                        className: 'flex items-center justify-between'
                    }, [
                        createElement('div', { key: 'title-info' }, [
                            createElement('h2', {
                                key: 'title',
                                className: 'text-2xl font-bold mb-2'
                            }, t.title),
                            createElement('p', {
                                key: 'subtitle',
                                className: 'text-blue-100'
                            }, t.subtitle)
                        ]),
                        
                        createElement('button', {
                            key: 'close',
                            onClick: onClose,
                            className: 'text-white hover:text-gray-200 text-2xl font-bold'
                        }, '×')
                    ]),
                    
                    // Progress indicator
                    stepKeys.length > 1 && createElement('div', {
                        key: 'progress',
                        className: 'mt-4 flex items-center justify-between text-sm'
                    }, [
                        createElement('span', { key: 'step-info' }, 
                            `${t.step} ${currentStep + 1} ${t.of} ${stepKeys.length}`),
                        
                        createElement('div', {
                            key: 'progress-bar',
                            className: 'flex-1 mx-4 bg-blue-500 bg-opacity-30 rounded-full h-2'
                        }, [
                            createElement('div', {
                                key: 'progress-fill',
                                className: 'bg-white rounded-full h-2 transition-all duration-300',
                                style: { width: `${((currentStep + 1) / stepKeys.length) * 100}%` }
                            })
                        ])
                    ])
                ]),

                // Score Preview
                createElement('div', {
                    key: 'score-preview',
                    className: 'bg-gray-50 px-6 py-4 border-b'
                }, [
                    createElement('div', {
                        key: 'score-comparison',
                        className: 'flex items-center justify-between'
                    }, [
                        createElement('div', {
                            key: 'current',
                            className: 'text-center'
                        }, [
                            createElement('div', {
                                key: 'label',
                                className: 'text-sm text-gray-600 mb-1'
                            }, t.currentScore),
                            createElement('div', {
                                key: 'value',
                                className: 'text-2xl font-bold text-gray-800'
                            }, `${healthReport?.totalScore || 0}/100`)
                        ]),
                        
                        createElement('div', {
                            key: 'arrow',
                            className: 'text-3xl text-green-500 mx-4'
                        }, '→'),
                        
                        createElement('div', {
                            key: 'projected',
                            className: 'text-center'
                        }, [
                            createElement('div', {
                                key: 'label',
                                className: 'text-sm text-gray-600 mb-1'
                            }, t.projectedScore),
                            createElement('div', {
                                key: 'value',
                                className: `text-2xl font-bold ${isCalculating ? 'text-gray-400' : 'text-green-600'}`
                            }, isCalculating ? t.calculating : `${previewScore || 0}/100`)
                        ]),
                        
                        previewScore > (healthReport?.totalScore || 0) && createElement('div', {
                            key: 'improvement',
                            className: 'text-center ml-4'
                        }, [
                            createElement('div', {
                                key: 'label',
                                className: 'text-sm text-green-600 mb-1'
                            }, t.improvement),
                            createElement('div', {
                                key: 'value',
                                className: 'text-lg font-bold text-green-600'
                            }, `+${previewScore - (healthReport?.totalScore || 0)}`)
                        ])
                    ])
                ]),
                
                // Form Content
                createElement('div', {
                    key: 'content',
                    className: 'p-6 overflow-y-auto max-h-96'
                }, [
                    createElement('h3', {
                        key: 'step-title',
                        className: 'text-lg font-semibold text-gray-800 mb-4'
                    }, t.stepTitles[currentStepKey]),
                    
                    createElement('div', {
                        key: 'form-fields',
                        className: 'space-y-4'
                    }, currentStepItems.map(renderInputField))
                ]),
                
                // Footer
                createElement('div', {
                    key: 'footer',
                    className: 'bg-gray-50 px-6 py-4 flex items-center justify-between border-t'
                }, [
                    createElement('button', {
                        key: 'cancel',
                        onClick: onClose,
                        className: 'px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors'
                    }, t.cancel),
                    
                    createElement('div', {
                        key: 'action-buttons',
                        className: 'flex items-center space-x-3'
                    }, [
                        currentStep > 0 && createElement('button', {
                            key: 'previous',
                            onClick: () => setCurrentStep(prev => prev - 1),
                            className: 'px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors'
                        }, t.previous),
                        
                        currentStep < stepKeys.length - 1 ? createElement('button', {
                            key: 'next',
                            onClick: () => setCurrentStep(prev => prev + 1),
                            className: 'px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
                        }, t.next) : createElement('button', {
                            key: 'complete',
                            onClick: handleSave,
                            className: 'px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium'
                        }, t.complete)
                    ])
                ])
            ])
        ]);
    };

    // Export to window
    window.MissingDataModal = MissingDataModal;

    console.log('✅ MissingDataModal component loaded successfully');
})();