// Salary Input Components Module
// Handles main salary and partner salary input UI components

function SalaryInputSection({ inputs, setInputs, language, workingCurrency, t, currencySymbol }) {
    const { validateSalary, validateNetSalary, getInputClassName, calculateTakeHomePercentage, getPercentageDisplay } = window.SalaryValidation || {};
    const { calculateNetFromGross } = window.SalaryCalculations || {};
    const [validationErrors, setValidationErrors] = React.useState({});
    
    const handleSalaryChange = (salary, field) => {
        const numericSalary = parseFloat(salary) || 0;
        const error = validateSalary ? validateSalary(numericSalary, language) : null;
        setValidationErrors(prev => ({...prev, [field]: error}));
        setInputs({...inputs, [field]: numericSalary});
        
        // Auto-update net salary if not in manual mode
        if (field === 'currentMonthlySalary' && !inputs.manualNetSalary) {
            const autoNetSalary = calculateNetFromGross ? calculateNetFromGross(numericSalary, inputs.country) : numericSalary * 0.66;
            setInputs(prev => ({...prev, currentMonthlySalary: numericSalary, currentNetSalary: autoNetSalary}));
        }
        if (field === 'partner1Salary' && !inputs.manualPartner1NetSalary) {
            const autoNetSalary = calculateNetFromGross ? calculateNetFromGross(numericSalary, inputs.country) : numericSalary * 0.66;
            setInputs(prev => ({...prev, partner1Salary: numericSalary, partner1NetSalary: autoNetSalary}));
        }
        if (field === 'partner2Salary' && !inputs.manualPartner2NetSalary) {
            const autoNetSalary = calculateNetFromGross ? calculateNetFromGross(numericSalary, inputs.country) : numericSalary * 0.66;
            setInputs(prev => ({...prev, partner2Salary: numericSalary, partner2NetSalary: autoNetSalary}));
        }
    };
    
    // Handle net salary changes with validation
    const handleNetSalaryChange = (netSalary, grossSalary, netField, grossField) => {
        const numericNetSalary = parseFloat(netSalary) || 0;
        const numericGrossSalary = parseFloat(grossSalary) || 0;
        const error = validateNetSalary ? validateNetSalary(numericNetSalary, numericGrossSalary, language) : null;
        setValidationErrors(prev => ({...prev, [netField]: error}));
        setInputs(prev => ({...prev, [netField]: numericNetSalary}));
    };
    
    return React.createElement('div', { className: "space-y-8" }, [
        // Main Salary Section (hide in couple mode)
        inputs.planningType !== 'couple' && React.createElement('div', { key: 'main-salary-section' }, [
            React.createElement('h3', { 
                key: 'main-salary-title',
                className: "text-xl font-semibold text-gray-700 mb-4 flex items-center" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '💰'),
                inputs.planningType === 'couple' ? 
                    (language === 'he' ? 'משכורת ברוטו עיקרית (לפני מסים)' : 'Main Gross Salary (Before Taxes)') : 
                    t.mainSalary
            ]),
            React.createElement('div', { 
                key: 'salary-input',
                className: "bg-blue-50 rounded-xl p-6 border border-blue-200" 
            }, [
                React.createElement('label', { 
                    key: 'gross-salary-label',
                    className: "block text-lg font-medium text-gray-700 mb-2" 
                }, t.grossSalary),
                React.createElement('input', {
                    key: 'gross-salary-input',
                    type: 'number',
                    value: inputs.currentMonthlySalary || 15000,
                    onChange: (e) => handleSalaryChange(e.target.value, 'currentMonthlySalary'),
                    placeholder: "15000",
                    min: "0",
                    max: "500000",
                    className: "w-full p-3 md:p-4 text-base md:text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                    'aria-invalid': validationErrors.currentMonthlySalary ? 'true' : 'false',
                    'aria-describedby': validationErrors.currentMonthlySalary ? 'salary-error' : undefined
                }),
                React.createElement('p', { 
                    key: 'salary-help',
                    className: "mt-2 text-sm text-blue-600" 
                }, t.salaryInfo),
                
                // Net Salary Input (Auto-calculated with manual override)
                React.createElement('div', { 
                    key: 'net-salary-section',
                    className: "mt-4 pt-4 border-t border-blue-200" 
                }, [
                    React.createElement('div', { 
                        key: 'net-salary-header',
                        className: "flex items-center justify-between mb-2" 
                    }, [
                        React.createElement('label', { 
                            key: 'net-salary-label',
                            className: "block text-lg font-medium text-green-700" 
                        }, t.netSalary),
                        React.createElement('button', {
                            key: 'toggle-manual',
                            type: 'button',
                            onClick: () => setInputs({...inputs, manualNetSalary: !inputs.manualNetSalary}),
                            className: "text-xs px-3 py-2 min-h-[44px] rounded bg-gray-100 hover:bg-gray-200 text-gray-600"
                        }, inputs.manualNetSalary ? t.switchToAuto : t.switchToManual)
                    ]),
                    React.createElement('input', {
                        key: 'net-salary-input',
                        type: 'number',
                        value: inputs.manualNetSalary ? 
                            (inputs.currentNetSalary || 0) : 
                            (calculateNetFromGross ? calculateNetFromGross(inputs.currentMonthlySalary || 15000, inputs.country) : (inputs.currentMonthlySalary || 15000) * 0.66),
                        onChange: (e) => {
                            if (inputs.manualNetSalary) {
                                handleNetSalaryChange(e.target.value, inputs.currentMonthlySalary || 0, 'currentNetSalary', 'currentMonthlySalary');
                            }
                        },
                        readOnly: !inputs.manualNetSalary,
                        placeholder: inputs.manualNetSalary ? "10000" : "Auto-calculated",
                        className: inputs.manualNetSalary ? 
                            (getInputClassName ? getInputClassName('currentNetSalary', 'w-full p-3 md:p-4 text-base md:text-lg border-2 rounded-lg focus:ring-2 bg-white', validationErrors, true) :
                            'w-full p-3 md:p-4 text-base md:text-lg border-2 rounded-lg focus:ring-2 bg-white') :
                            'w-full p-3 md:p-4 text-base md:text-lg border-2 border-green-200 bg-green-50 text-green-700 cursor-not-allowed rounded-lg'
                    }),
                    renderNetSalaryHelp({
                        inputs, t, language, currencySymbol,
                        calculateNetFromGross, calculateTakeHomePercentage, getPercentageDisplay,
                        validationErrors, field: 'currentNetSalary'
                    })
                ])
            ])
        ]),
        
        // Partner Salaries (if couple)
        inputs.planningType === 'couple' && renderPartnerSalaries({
            inputs, setInputs, language, workingCurrency, t, currencySymbol,
            handleSalaryChange, handleNetSalaryChange, validationErrors,
            calculateNetFromGross, getInputClassName, calculateTakeHomePercentage, getPercentageDisplay
        })
    ]);
}

// Helper function to render net salary help text
function renderNetSalaryHelp(props) {
    const { inputs, t, language, calculateNetFromGross, calculateTakeHomePercentage, getPercentageDisplay, validationErrors, field } = props;
    const grossField = field === 'currentNetSalary' ? 'currentMonthlySalary' : 
                      field === 'partner1NetSalary' ? 'partner1Salary' : 'partner2Salary';
    const manualField = field === 'currentNetSalary' ? 'manualNetSalary' : 
                       field === 'partner1NetSalary' ? 'manualPartner1NetSalary' : 'manualPartner2NetSalary';
    
    return React.createElement('div', { 
        key: 'net-salary-help',
        className: "mt-2 space-y-1"
    }, [
        // Main help text
        React.createElement('div', {
            key: 'net-help-main',
            className: "flex items-center text-sm"
        }, [
            React.createElement('span', {
                key: 'net-help-icon',
                className: "mr-1 text-green-600"
            }, '💰'),
            React.createElement('span', {
                key: 'net-help-text',
                className: inputs[manualField] ? "text-green-600" : "text-green-500"
            }, inputs[manualField] ? t.manualOverride : `${t.autoCalculated} - ${t.netSalaryInfo}`)
        ]),
        // Take-home percentage display
        (() => {
            const grossSalary = inputs[grossField] || 0;
            const netSalary = inputs[manualField] ? 
                (inputs[field] || 0) : 
                (calculateNetFromGross ? calculateNetFromGross(grossSalary, inputs.country) : grossSalary * 0.66);
            const percentage = calculateTakeHomePercentage ? calculateTakeHomePercentage(netSalary, grossSalary) : 0;
            const percentageDisplay = getPercentageDisplay ? getPercentageDisplay(percentage) : { text: '0%', color: 'text-gray-500' };
            
            return React.createElement('div', {
                key: 'percentage-display',
                className: "flex items-center text-xs"
            }, [
                React.createElement('span', {
                    key: 'percentage-label',
                    className: "text-gray-500 mr-2"
                }, `${t.takeHomePercentage}: `),
                React.createElement('span', {
                    key: 'percentage-value',
                    className: `font-medium ${percentageDisplay.color}`
                }, percentageDisplay.text || '0%'),
                percentage > 0 && percentage < 50 && React.createElement('span', {
                    key: 'warning-text',
                    className: "ml-2 text-red-500 text-xs"
                }, `⚠️ ${t.netSalaryTooLow}`),
                percentage > 90 && React.createElement('span', {
                    key: 'high-warning',
                    className: "ml-2 text-yellow-600 text-xs"
                }, `⚠️ ${t.checkCalculation}`)
            ]);
        })(),
        // Validation error display
        validationErrors[field] && React.createElement('div', {
            key: 'net-salary-error',
            className: "mt-1 text-sm text-red-600 flex items-center"
        }, [
            React.createElement('span', { key: 'error-icon', className: "mr-1" }, '❌'),
            validationErrors[field]
        ])
    ]);
}

// Helper function to render partner salaries section
function renderPartnerSalaries(props) {
    const { inputs, setInputs, language, t, currencySymbol, handleSalaryChange, handleNetSalaryChange, 
            validationErrors, calculateNetFromGross, getInputClassName, calculateTakeHomePercentage, getPercentageDisplay } = props;
    
    return React.createElement('div', { key: 'partner-salaries-section' }, [
        React.createElement('h3', { 
            key: 'partner-salaries-title',
            className: "text-xl font-semibold text-gray-700 mb-4 flex items-center" 
        }, [
            React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '💰'),
            t.partnerSalaries
        ]),
        React.createElement('div', { 
            key: 'partner-salaries-grid',
            className: "grid grid-cols-1 md:grid-cols-2 gap-6" 
        }, [
            // Partner 1 Salary
            renderPartnerSalaryCard({
                partnerNumber: 1,
                partnerName: inputs.userName || t.partner1Salary,
                salaryField: 'partner1Salary',
                netSalaryField: 'partner1NetSalary',
                manualField: 'manualPartner1NetSalary',
                inputs, setInputs, language, t, currencySymbol,
                handleSalaryChange, handleNetSalaryChange, validationErrors,
                calculateNetFromGross, getInputClassName, calculateTakeHomePercentage, getPercentageDisplay
            }),
            // Partner 2 Salary
            renderPartnerSalaryCard({
                partnerNumber: 2,
                partnerName: inputs.partnerName || t.partner2Salary,
                salaryField: 'partner2Salary',
                netSalaryField: 'partner2NetSalary',
                manualField: 'manualPartner2NetSalary',
                inputs, setInputs, language, t, currencySymbol,
                handleSalaryChange, handleNetSalaryChange, validationErrors,
                calculateNetFromGross, getInputClassName, calculateTakeHomePercentage, getPercentageDisplay
            })
        ])
    ]);
}

// Helper function to render individual partner salary card
function renderPartnerSalaryCard(props) {
    const { partnerNumber, partnerName, salaryField, netSalaryField, manualField,
            inputs, setInputs, language, t, currencySymbol,
            handleSalaryChange, handleNetSalaryChange, validationErrors,
            calculateNetFromGross, getInputClassName } = props;
    
    return React.createElement('div', { 
        key: `partner${partnerNumber}-salary`,
        className: "bg-blue-50 rounded-xl p-6 border border-blue-200" 
    }, [
        React.createElement('label', { 
            key: `partner${partnerNumber}-salary-label`,
            className: "block text-lg font-medium text-gray-700 mb-2" 
        }, `${partnerName} (${currencySymbol})`),
        React.createElement('input', {
            key: `partner${partnerNumber}-salary-input`,
            type: 'number',
            value: inputs[salaryField] || 0,
            onChange: (e) => handleSalaryChange(e.target.value, salaryField),
            className: "w-full p-3 md:p-4 text-base md:text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        }),
        React.createElement('p', { 
            key: `partner${partnerNumber}-salary-help`,
            className: "mt-2 text-sm text-blue-600" 
        }, language === 'he' ? 'הזן משכורת ברוטו לפני מסים והפרשות' : 'Enter gross salary before taxes and deductions'),
        
        // Partner Net Salary
        React.createElement('div', { 
            key: `partner${partnerNumber}-net-salary-section`,
            className: "mt-4 pt-4 border-t border-blue-200" 
        }, [
            React.createElement('div', { 
                key: `partner${partnerNumber}-net-salary-header`,
                className: "flex items-center justify-between mb-2" 
            }, [
                React.createElement('label', { 
                    key: `partner${partnerNumber}-net-salary-label`,
                    className: "block text-lg font-medium text-green-700" 
                }, `${partnerName.split('(')[0].trim()} - ${t.netSalary}`),
                React.createElement('button', {
                    key: `partner${partnerNumber}-toggle-manual`,
                    type: 'button',
                    onClick: () => setInputs({...inputs, [manualField]: !inputs[manualField]}),
                    className: "text-xs px-3 py-2 min-h-[44px] rounded bg-gray-100 hover:bg-gray-200 text-gray-600"
                }, inputs[manualField] ? t.switchToAuto : t.switchToManual)
            ]),
            React.createElement('input', {
                key: `partner${partnerNumber}-net-salary-input`,
                type: 'number',
                value: inputs[manualField] ? 
                    (inputs[netSalaryField] || 0) : 
                    (calculateNetFromGross ? calculateNetFromGross(inputs[salaryField] || 0, inputs.country) : (inputs[salaryField] || 0) * 0.66),
                onChange: (e) => {
                    if (inputs[manualField]) {
                        handleNetSalaryChange(e.target.value, inputs[salaryField] || 0, netSalaryField, salaryField);
                    }
                },
                readOnly: !inputs[manualField],
                className: inputs[manualField] ? 
                    (getInputClassName ? getInputClassName(netSalaryField, 'w-full p-3 text-base border-2 rounded-lg focus:ring-2 bg-white', validationErrors, true) :
                    'w-full p-3 text-base border-2 rounded-lg focus:ring-2 bg-white') :
                    'w-full p-3 text-base border-2 border-green-200 bg-green-50 text-green-700 cursor-not-allowed rounded-lg'
            }),
            renderNetSalaryHelp({
                inputs, t, language, currencySymbol,
                calculateNetFromGross, calculateTakeHomePercentage: props.calculateTakeHomePercentage, 
                getPercentageDisplay: props.getPercentageDisplay,
                validationErrors, field: netSalaryField
            })
        ])
    ]);
}

// Export to window
window.SalaryInputComponents = {
    SalaryInputSection,
    renderNetSalaryHelp,
    renderPartnerSalaries,
    renderPartnerSalaryCard
};

console.log('✅ Salary input components module loaded');