// WizardStepPersonal.js - Personal Information step for retirement planning wizard
// Handles age, retirement age, and planning type (single vs couple) selection

const WizardStepPersonal = ({ inputs, setInputs, language, workingCurrency }) => {
    // Multi-language content
    const content = {
        he: {
            title: 'פרטים אישיים',
            subtitle: 'גיל, גיל פרישה וסוג תכנון',
            currentAge: 'גיל נוכחי',
            retirementAge: 'גיל פרישה',
            planningType: 'סוג תכנון',
            planningModeLabel: 'בחר סוג תכנון:',
            single: 'תכנון אישי',
            couple: 'תכנון זוגי',
            singleDescription: 'תכנון פרישה עבור אדם יחיד',
            coupleDescription: 'תכנון פרישה עבור זוג (שני בני זוג)',
            ageValidation: 'גיל חייב להיות בין 18 ל-100',
            retirementAgeValidation: 'גיל פרישה חייב להיות גבוה מהגיל הנוכחי',
            yourName: 'השם שלך',
            partnerName: 'שם בן/בת הזוג',
            yourAge: 'הגיל שלך',
            partnerAge: 'גיל בן/בת הזוג',
            yourRetirementAge: 'גיל הפרישה שלך',
            partnerRetirementAge: 'גיל פרישה של בן/בת הזוג'
        },
        en: {
            title: 'Personal Information',
            subtitle: 'Age, retirement age, and planning type',
            currentAge: 'Current Age',
            retirementAge: 'Retirement Age',
            planningType: 'Planning Type',
            planningModeLabel: 'Choose planning type:',
            single: 'Individual Planning',
            couple: 'Couple Planning',
            singleDescription: 'Retirement planning for one person',
            coupleDescription: 'Retirement planning for a couple (two partners)',
            ageValidation: 'Age must be between 18 and 100',
            retirementAgeValidation: 'Retirement age must be higher than current age',
            yourName: 'Your Name',
            partnerName: 'Partner Name',
            yourAge: 'Your Age',
            partnerAge: 'Partner Age',
            yourRetirementAge: 'Your Retirement Age',
            partnerRetirementAge: 'Partner Retirement Age'
        }
    };

    const t = content[language];

    // Determine if in couple mode
    const isCoupleMode = inputs.planningType === 'couple';

    // Handler for planning type change
    const handlePlanningTypeChange = (type) => {
        setInputs(prev => ({
            ...prev,
            planningType: type,
            // Reset partner-specific fields when switching to single mode
            ...(type === 'single' ? {
                partnerName: '',
                partnerAge: '',
                partnerRetirementAge: '',
                partner1Salary: 0,
                partner2Salary: 0
            } : {})
        }));
    };

    // Validation functions
    const isValidAge = (age) => age >= 18 && age <= 100;
    const isValidRetirementAge = (retAge, currentAge) => retAge > currentAge && retAge <= 100;
    
    // Required fields validation using InputValidation utility
    const validateStepRequiredFields = () => {
        if (!window.InputValidation) return { isValid: true, errors: {} };
        
        const requiredFields = isCoupleMode 
            ? ['currentAge', 'retirementAge', 'partnerAge', 'partnerRetirementAge'] 
            : ['currentAge', 'retirementAge'];
            
        return window.InputValidation.validateRequiredFields(inputs, requiredFields, language);
    };
    
    // Add this validation to window for external access (e.g., from wizard navigation)
    React.useEffect(() => {
        window.validateWizardStepPersonal = validateStepRequiredFields;
        return () => {
            delete window.validateWizardStepPersonal;
        };
    }, [inputs, isCoupleMode, language]);

    return React.createElement('div', { 
        className: "personal-info-step space-y-8" 
    }, [
        // Planning Type Selection
        React.createElement('div', {
            key: 'planning-type-section',
            className: "space-y-4"
        }, [
            React.createElement('h3', {
                key: 'planning-type-title',
                className: "text-xl font-semibold text-gray-800 mb-4",
                'aria-label': t.planningModeLabel,
                role: 'heading'
            }, t.planningModeLabel),
            
            React.createElement('div', {
                key: 'planning-type-options',
                className: "grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6",
                role: 'radiogroup',
                'aria-labelledby': 'planning-type-title'
            }, [
                // Single Planning Option
                React.createElement('label', {
                    key: 'single-option',
                    className: `cursor-pointer border-2 rounded-lg p-4 md:p-6 transition-all duration-200 min-h-[44px] touch-target ${
                        inputs.planningType === 'single' 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-300 hover:border-gray-400'
                    }`,
                    'aria-label': `${t.single}: ${t.singleDescription}`,
                    tabIndex: 0,
                    onKeyDown: (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handlePlanningTypeChange('single');
                        }
                    }
                }, [
                    React.createElement('input', {
                        key: 'single-radio',
                        type: 'radio',
                        name: 'planningType',
                        value: 'single',
                        checked: inputs.planningType === 'single',
                        onChange: () => handlePlanningTypeChange('single'),
                        className: "sr-only",
                        'aria-describedby': 'single-desc'
                    }),
                    React.createElement('div', {
                        key: 'single-content',
                        className: "text-center"
                    }, [
                        React.createElement('div', {
                            key: 'single-icon',
                            className: "text-4xl mb-3"
                        }, '👤'),
                        React.createElement('h4', {
                            key: 'single-title',
                            className: "text-lg font-medium text-gray-800 mb-2"
                        }, t.single),
                        React.createElement('p', {
                            key: 'single-desc',
                            className: "text-sm text-gray-600"
                        }, t.singleDescription)
                    ])
                ]),
                
                // Couple Planning Option
                React.createElement('label', {
                    key: 'couple-option',
                    className: `cursor-pointer border-2 rounded-lg p-4 md:p-6 transition-all duration-200 min-h-[44px] touch-target ${
                        inputs.planningType === 'couple' 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-300 hover:border-gray-400'
                    }`,
                    'aria-label': `${t.couple}: ${t.coupleDescription}`,
                    tabIndex: 0,
                    onKeyDown: (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handlePlanningTypeChange('couple');
                        }
                    }
                }, [
                    React.createElement('input', {
                        key: 'couple-radio',
                        type: 'radio',
                        name: 'planningType',
                        value: 'couple',
                        checked: inputs.planningType === 'couple',
                        onChange: () => handlePlanningTypeChange('couple'),
                        className: "sr-only",
                        'aria-describedby': 'couple-desc'
                    }),
                    React.createElement('div', {
                        key: 'couple-content',
                        className: "text-center"
                    }, [
                        React.createElement('div', {
                            key: 'couple-icon',
                            className: "text-4xl mb-3"
                        }, '👫'),
                        React.createElement('h4', {
                            key: 'couple-title',
                            className: "text-lg font-medium text-gray-800 mb-2"
                        }, t.couple),
                        React.createElement('p', {
                            key: 'couple-desc',
                            className: "text-sm text-gray-600"
                        }, t.coupleDescription)
                    ])
                ])
            ])
        ]),

        // Personal Information Forms
        isCoupleMode ? 
            // Couple Mode - Two Columns
            React.createElement('div', {
                key: 'couple-info',
                className: "grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8"
            }, [
                // Your Information
                React.createElement('div', {
                    key: 'your-info',
                    className: "bg-blue-50 p-6 rounded-lg space-y-4"
                }, [
                    React.createElement('h4', {
                        key: 'your-title',
                        className: "text-lg font-medium text-blue-800 mb-4 text-center"
                    }, t.yourName),
                    
                    React.createElement('div', {
                        key: 'your-name-field',
                        className: "space-y-2"
                    }, [
                        React.createElement('label', {
                            key: 'your-name-label',
                            className: "block text-sm font-medium text-gray-700"
                        }, t.yourName),
                        React.createElement('input', {
                            key: 'your-name-input',
                            type: 'text',
                            value: inputs.userName || '',
                            onChange: (e) => setInputs(prev => ({ ...prev, userName: e.target.value })),
                            className: "w-full px-4 py-3 md:px-3 md:py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                            placeholder: t.yourName
                        })
                    ]),
                    
                    React.createElement('div', {
                        key: 'your-age-field',
                        className: "space-y-2"
                    }, [
                        React.createElement('label', {
                            key: 'your-age-label',
                            className: "block text-sm font-medium text-gray-700"
                        }, t.yourAge),
                        React.createElement('input', {
                            key: 'your-age-input',
                            type: 'number',
                            min: '18',
                            max: '100',
                            value: inputs.currentAge || '',
                            onChange: (e) => setInputs(prev => ({ ...prev, currentAge: parseInt(e.target.value) || '' })),
                            className: `w-full px-4 py-3 md:px-3 md:py-2 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                inputs.currentAge && !isValidAge(inputs.currentAge) ? 'border-red-500' : 'border-gray-300'
                            }`
                        }),
                        inputs.currentAge && !isValidAge(inputs.currentAge) && React.createElement('p', {
                            key: 'your-age-error',
                            className: "text-sm text-red-600"
                        }, t.ageValidation)
                    ]),
                    
                    React.createElement('div', {
                        key: 'your-retirement-field',
                        className: "space-y-2"
                    }, [
                        React.createElement('label', {
                            key: 'your-retirement-label',
                            className: "block text-sm font-medium text-gray-700"
                        }, t.yourRetirementAge),
                        React.createElement('input', {
                            key: 'your-retirement-input',
                            type: 'number',
                            min: '50',
                            max: '100',
                            value: inputs.retirementAge || '',
                            onChange: (e) => setInputs(prev => ({ ...prev, retirementAge: parseInt(e.target.value) || '' })),
                            className: `w-full px-4 py-3 md:px-3 md:py-2 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                inputs.retirementAge && !isValidRetirementAge(inputs.retirementAge, inputs.currentAge) ? 'border-red-500' : 'border-gray-300'
                            }`
                        }),
                        inputs.retirementAge && !isValidRetirementAge(inputs.retirementAge, inputs.currentAge) && React.createElement('p', {
                            key: 'your-retirement-error',
                            className: "text-sm text-red-600"
                        }, t.retirementAgeValidation)
                    ])
                ]),
                
                // Partner Information
                React.createElement('div', {
                    key: 'partner-info',
                    className: "bg-green-50 p-6 rounded-lg space-y-4"
                }, [
                    React.createElement('h4', {
                        key: 'partner-title',
                        className: "text-lg font-medium text-green-800 mb-4 text-center"
                    }, t.partnerName),
                    
                    React.createElement('div', {
                        key: 'partner-name-field',
                        className: "space-y-2"
                    }, [
                        React.createElement('label', {
                            key: 'partner-name-label',
                            className: "block text-sm font-medium text-gray-700"
                        }, t.partnerName),
                        React.createElement('input', {
                            key: 'partner-name-input',
                            type: 'text',
                            value: inputs.partnerName || '',
                            onChange: (e) => setInputs(prev => ({ ...prev, partnerName: e.target.value })),
                            className: "w-full px-4 py-3 md:px-3 md:py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500",
                            placeholder: t.partnerName
                        })
                    ]),
                    
                    React.createElement('div', {
                        key: 'partner-age-field',
                        className: "space-y-2"
                    }, [
                        React.createElement('label', {
                            key: 'partner-age-label',
                            className: "block text-sm font-medium text-gray-700"
                        }, t.partnerAge),
                        React.createElement('input', {
                            key: 'partner-age-input',
                            type: 'number',
                            min: '18',
                            max: '100',
                            value: inputs.partnerAge || '',
                            onChange: (e) => setInputs(prev => ({ ...prev, partnerAge: parseInt(e.target.value) || '' })),
                            className: `w-full px-4 py-3 md:px-3 md:py-2 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                inputs.partnerAge && !isValidAge(inputs.partnerAge) ? 'border-red-500' : 'border-gray-300'
                            }`
                        }),
                        inputs.partnerAge && !isValidAge(inputs.partnerAge) && React.createElement('p', {
                            key: 'partner-age-error',
                            className: "text-sm text-red-600"
                        }, t.ageValidation)
                    ]),
                    
                    React.createElement('div', {
                        key: 'partner-retirement-field',
                        className: "space-y-2"
                    }, [
                        React.createElement('label', {
                            key: 'partner-retirement-label',
                            className: "block text-sm font-medium text-gray-700"
                        }, t.partnerRetirementAge),
                        React.createElement('input', {
                            key: 'partner-retirement-input',
                            type: 'number',
                            min: '50',
                            max: '100',
                            value: inputs.partnerRetirementAge || '',
                            onChange: (e) => setInputs(prev => ({ ...prev, partnerRetirementAge: parseInt(e.target.value) || '' })),
                            className: `w-full px-4 py-3 md:px-3 md:py-2 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                inputs.partnerRetirementAge && !isValidRetirementAge(inputs.partnerRetirementAge, inputs.partnerAge) ? 'border-red-500' : 'border-gray-300'
                            }`
                        }),
                        inputs.partnerRetirementAge && !isValidRetirementAge(inputs.partnerRetirementAge, inputs.partnerAge) && React.createElement('p', {
                            key: 'partner-retirement-error',
                            className: "text-sm text-red-600"
                        }, t.retirementAgeValidation)
                    ])
                ])
            ]) :
            // Single Mode - Single Column
            React.createElement('div', {
                key: 'single-info',
                className: "max-w-md mx-auto bg-blue-50 p-6 rounded-lg space-y-4"
            }, [
                React.createElement('h4', {
                    key: 'single-title',
                    className: "text-lg font-medium text-blue-800 mb-4 text-center"
                }, t.title),
                
                React.createElement('div', {
                    key: 'name-field',
                    className: "space-y-2"
                }, [
                    React.createElement('label', {
                        key: 'name-label',
                        className: "block text-sm font-medium text-gray-700"
                    }, t.yourName),
                    React.createElement('input', {
                        key: 'name-input',
                        type: 'text',
                        value: inputs.userName || '',
                        onChange: (e) => setInputs(prev => ({ ...prev, userName: e.target.value })),
                        className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                        placeholder: t.yourName
                    })
                ]),
                
                React.createElement('div', {
                    key: 'age-field',
                    className: "space-y-2"
                }, [
                    React.createElement('label', {
                        key: 'age-label',
                        className: "block text-sm font-medium text-gray-700"
                    }, t.currentAge),
                    React.createElement('input', {
                        key: 'age-input',
                        type: 'number',
                        min: '18',
                        max: '100',
                        value: inputs.currentAge || '',
                        onChange: (e) => setInputs(prev => ({ ...prev, currentAge: parseInt(e.target.value) || '' })),
                        className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            inputs.currentAge && !isValidAge(inputs.currentAge) ? 'border-red-500' : 'border-gray-300'
                        }`
                    }),
                    inputs.currentAge && !isValidAge(inputs.currentAge) && React.createElement('p', {
                        key: 'age-error',
                        className: "text-sm text-red-600"
                    }, t.ageValidation)
                ]),
                
                React.createElement('div', {
                    key: 'retirement-field',
                    className: "space-y-2"
                }, [
                    React.createElement('label', {
                        key: 'retirement-label',
                        className: "block text-sm font-medium text-gray-700"
                    }, t.retirementAge),
                    React.createElement('input', {
                        key: 'retirement-input',
                        type: 'number',
                        min: '50',
                        max: '100',
                        value: inputs.retirementAge || '',
                        onChange: (e) => setInputs(prev => ({ ...prev, retirementAge: parseInt(e.target.value) || '' })),
                        className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            inputs.retirementAge && !isValidRetirementAge(inputs.retirementAge, inputs.currentAge) ? 'border-red-500' : 'border-gray-300'
                        }`
                    }),
                    inputs.retirementAge && !isValidRetirementAge(inputs.retirementAge, inputs.currentAge) && React.createElement('p', {
                        key: 'retirement-error',
                        className: "text-sm text-red-600"
                    }, t.retirementAgeValidation)
                ])
            ])
    ]);
};

// Export to window for global access
window.WizardStepPersonal = WizardStepPersonal;
console.log('✅ WizardStepPersonal component loaded successfully');
