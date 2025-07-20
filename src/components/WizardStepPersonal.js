// WizardStepPersonal.js - Step 1: Personal Information
// Collects age, retirement age, planning type (single/couple), and partner details

const WizardStepPersonal = ({ inputs, setInputs, language = 'en' }) => {
    // Validation state
    const [validationErrors, setValidationErrors] = React.useState({});
    
    // Validation rules
    const validateAge = (age) => {
        if (!age || age < 18) return language === 'he' ? 'גיל מינימלי: 18' : 'Minimum age: 18';
        if (age > 100) return language === 'he' ? 'גיל מקסימלי: 100' : 'Maximum age: 100';
        return null;
    };
    
    const validateRetirementAge = (retirementAge, currentAge) => {
        if (!retirementAge) return null;
        if (retirementAge <= currentAge) return language === 'he' ? 'גיל פרישה חייב להיות גבוה מהגיל הנוכחי' : 'Retirement age must be higher than current age';
        if (retirementAge > 75) return language === 'he' ? 'גיל פרישה מקסימלי: 75' : 'Maximum retirement age: 75';
        return null;
    };
    
    const validateName = (name) => {
        if (name && name.length < 2) return language === 'he' ? 'שם קצר מדי' : 'Name too short';
        return null;
    };
    
    // Real-time validation
    const handleAgeChange = (age, field) => {
        const error = validateAge(age);
        setValidationErrors(prev => ({...prev, [field]: error}));
        setInputs({...inputs, [field]: age});
        
        // Also validate retirement age when current age changes
        if (field === 'currentAge') {
            const retirementError = validateRetirementAge(inputs.retirementAge, age);
            setValidationErrors(prev => ({...prev, retirementAge: retirementError}));
        }
    };
    
    const handleRetirementAgeChange = (retirementAge) => {
        const error = validateRetirementAge(retirementAge, inputs.currentAge);
        setValidationErrors(prev => ({...prev, retirementAge: error}));
        setInputs({...inputs, retirementAge});
    };
    
    const handleNameChange = (name, field) => {
        const error = validateName(name);
        setValidationErrors(prev => ({...prev, [field]: error}));
        setInputs({...inputs, [field]: name});
    };
    
    // Multi-language content
    const content = {
        he: {
            planningType: 'סוג התכנון',
            single: 'רווק/ה',
            singleDesc: 'תכנון אישי',
            couple: 'זוג',
            coupleDesc: 'תכנון משותף',
            currentAge: 'גיל נוכחי',
            retirementAge: 'גיל פרישה',
            partnerInfo: 'פרטי בני הזוג',
            partner1: 'בן/בת זוג 1',
            partner2: 'בן/בת זוג 2',
            name: 'שם',
            age: 'גיל',
            enterName: 'הזן שם',
            ageInfo: 'גילך הנוכחי קובע את אופק הזמן להשקעה',
            retirementInfo: 'גיל הפרישה המתוכנן שלך',
            coupleInfo: 'תכנון זוגי מאפשר אופטימיזציה משותפת של החיסכון והתשואות',
            validInput: 'תקין',
            invalidInput: 'שגיאה'
        },
        en: {
            planningType: 'Planning Type',
            single: 'Single',
            singleDesc: 'Individual planning',
            couple: 'Couple',
            coupleDesc: 'Joint planning',
            currentAge: 'Current Age',
            retirementAge: 'Retirement Age',
            partnerInfo: 'Partner Information',
            partner1: 'Partner 1',
            partner2: 'Partner 2',
            name: 'Name',
            age: 'Age',
            enterName: 'Enter name',
            ageInfo: 'Your current age determines your investment time horizon',
            retirementInfo: 'Your planned retirement age',
            coupleInfo: 'Joint planning enables shared optimization of savings and returns',
            validInput: 'Valid',
            invalidInput: 'Error'
        }
    };

    const t = content[language];
    
    // Helper function for input styling based on validation
    const getInputClassName = (fieldName, baseClassName) => {
        const error = validationErrors[fieldName];
        if (error) {
            return `${baseClassName} border-red-500 focus:ring-red-500 focus:border-red-500`;
        }
        return `${baseClassName} border-gray-300 focus:ring-purple-500 focus:border-purple-500`;
    };

    return React.createElement('div', { className: "space-y-8" }, [
        // Planning Type Selection
        React.createElement('div', { key: 'planning-type-section' }, [
            React.createElement('h3', { 
                key: 'planning-type-title',
                className: "text-xl font-semibold text-gray-700 mb-4 flex items-center" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '👤'),
                t.planningType
            ]),
            React.createElement('div', { 
                key: 'planning-type-buttons',
                className: "grid grid-cols-2 gap-6" 
            }, [
                React.createElement('button', {
                    key: 'single-planning',
                    type: 'button',
                    onClick: () => setInputs({...inputs, planningType: 'single'}),
                    className: `p-6 rounded-xl border-2 transition-all text-center ${
                        (inputs.planningType || 'single') === 'single' 
                            ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-lg transform scale-105' 
                            : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                    }`
                }, [
                    React.createElement('div', { key: 'single-icon', className: "text-3xl mb-2" }, '👤'),
                    React.createElement('div', { key: 'single-title', className: "text-lg font-semibold mb-1" }, t.single),
                    React.createElement('div', { key: 'single-desc', className: "text-sm opacity-75" }, t.singleDesc)
                ]),
                React.createElement('button', {
                    key: 'couple-planning',
                    type: 'button',
                    onClick: () => setInputs({...inputs, planningType: 'couple'}),
                    className: `p-6 rounded-xl border-2 transition-all text-center ${
                        inputs.planningType === 'couple' 
                            ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-lg transform scale-105' 
                            : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                    }`
                }, [
                    React.createElement('div', { key: 'couple-icon', className: "text-3xl mb-2" }, '👥'),
                    React.createElement('div', { key: 'couple-title', className: "text-lg font-semibold mb-1" }, t.couple),
                    React.createElement('div', { key: 'couple-desc', className: "text-sm opacity-75" }, t.coupleDesc)
                ])
            ])
        ]),

        // Age Information
        React.createElement('div', { 
            key: 'age-section',
            className: "grid grid-cols-1 md:grid-cols-2 gap-8" 
        }, [
            React.createElement('div', { key: 'current-age' }, [
                React.createElement('label', { 
                    key: 'current-age-label',
                    className: "block text-lg font-medium text-gray-700 mb-2" 
                }, t.currentAge),
                React.createElement('input', {
                    key: 'current-age-input',
                    type: 'number',
                    min: 18,
                    max: 100,
                    value: inputs.currentAge || 30,
                    onChange: (e) => handleAgeChange(parseInt(e.target.value) || 0, 'currentAge'),
                    className: getInputClassName('currentAge', "w-full p-4 text-xl border-2 rounded-lg focus:ring-2")
                }),
                validationErrors.currentAge && React.createElement('p', { 
                    key: 'current-age-error',
                    className: "mt-1 text-sm text-red-600 flex items-center" 
                }, [
                    React.createElement('span', { key: 'error-icon', className: "mr-1" }, '⚠️'),
                    validationErrors.currentAge
                ]),
                React.createElement('p', { 
                    key: 'current-age-help',
                    className: "mt-2 text-sm text-gray-600" 
                }, t.ageInfo)
            ]),
            React.createElement('div', { key: 'retirement-age' }, [
                React.createElement('label', { 
                    key: 'retirement-age-label',
                    className: "block text-lg font-medium text-gray-700 mb-2" 
                }, t.retirementAge),
                React.createElement('input', {
                    key: 'retirement-age-input',
                    type: 'number',
                    min: (inputs.currentAge || 18) + 1,
                    max: 75,
                    value: inputs.retirementAge || 67,
                    onChange: (e) => handleRetirementAgeChange(parseInt(e.target.value) || 0),
                    className: getInputClassName('retirementAge', "w-full p-4 text-xl border-2 rounded-lg focus:ring-2")
                }),
                validationErrors.retirementAge && React.createElement('p', { 
                    key: 'retirement-age-error',
                    className: "mt-1 text-sm text-red-600 flex items-center" 
                }, [
                    React.createElement('span', { key: 'error-icon', className: "mr-1" }, '⚠️'),
                    validationErrors.retirementAge
                ]),
                React.createElement('p', { 
                    key: 'retirement-age-help',
                    className: "mt-2 text-sm text-gray-600" 
                }, t.retirementInfo)
            ])
        ]),

        // Partner Information (if couple selected)
        inputs.planningType === 'couple' && React.createElement('div', { 
            key: 'partner-section',
            className: "bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-200" 
        }, [
            React.createElement('h3', { 
                key: 'partner-title',
                className: "text-xl font-semibold text-pink-700 mb-4 flex items-center" 
            }, [
                React.createElement('span', { key: 'partner-icon', className: "mr-3 text-2xl" }, '👫'),
                t.partnerInfo
            ]),
            React.createElement('p', { 
                key: 'partner-info-text',
                className: "text-pink-600 mb-6" 
            }, t.coupleInfo),
            React.createElement('div', { 
                key: 'partners-grid',
                className: "grid grid-cols-1 md:grid-cols-2 gap-6" 
            }, [
                // Partner 1
                React.createElement('div', { 
                    key: 'partner1',
                    className: "bg-white rounded-lg p-4 border border-pink-300" 
                }, [
                    React.createElement('h4', { 
                        key: 'partner1-title',
                        className: "font-semibold text-pink-700 mb-4 text-lg" 
                    }, inputs.partner1Name || t.partner1),
                    React.createElement('div', { key: 'partner1-fields', className: "space-y-4" }, [
                        React.createElement('div', { key: 'partner1-name' }, [
                            React.createElement('label', { 
                                key: 'partner1-name-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.name),
                            React.createElement('input', {
                                key: 'partner1-name-input',
                                type: 'text',
                                value: inputs.partner1Name || '',
                                onChange: (e) => setInputs({...inputs, partner1Name: e.target.value}),
                                placeholder: t.enterName,
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                            })
                        ]),
                        React.createElement('div', { key: 'partner1-age' }, [
                            React.createElement('label', { 
                                key: 'partner1-age-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.age),
                            React.createElement('input', {
                                key: 'partner1-age-input',
                                type: 'number',
                                value: inputs.partner1Age || 30,
                                onChange: (e) => setInputs({...inputs, partner1Age: parseInt(e.target.value) || 30}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                            })
                        ])
                    ])
                ]),
                // Partner 2
                React.createElement('div', { 
                    key: 'partner2',
                    className: "bg-white rounded-lg p-4 border border-pink-300" 
                }, [
                    React.createElement('h4', { 
                        key: 'partner2-title',
                        className: "font-semibold text-pink-700 mb-4 text-lg" 
                    }, inputs.partner2Name || t.partner2),
                    React.createElement('div', { key: 'partner2-fields', className: "space-y-4" }, [
                        React.createElement('div', { key: 'partner2-name' }, [
                            React.createElement('label', { 
                                key: 'partner2-name-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.name),
                            React.createElement('input', {
                                key: 'partner2-name-input',
                                type: 'text',
                                value: inputs.partner2Name || '',
                                onChange: (e) => setInputs({...inputs, partner2Name: e.target.value}),
                                placeholder: t.enterName,
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                            })
                        ]),
                        React.createElement('div', { key: 'partner2-age' }, [
                            React.createElement('label', { 
                                key: 'partner2-age-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.age),
                            React.createElement('input', {
                                key: 'partner2-age-input',
                                type: 'number',
                                value: inputs.partner2Age || 30,
                                onChange: (e) => setInputs({...inputs, partner2Age: parseInt(e.target.value) || 30}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                            })
                        ])
                    ])
                ])
            ])
        ])
    ]);
};

// Export to window for global access
window.WizardStepPersonal = WizardStepPersonal;
console.log('✅ WizardStepPersonal component loaded successfully');