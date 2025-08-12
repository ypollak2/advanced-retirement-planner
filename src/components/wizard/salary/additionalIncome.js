// Additional Income Components Module
// Handles additional income sources UI components

function AdditionalIncomeSection({ inputs, setInputs, language, workingCurrency, t, currencySymbol }) {
    // Single planning mode additional income
    if (!inputs.planningType || inputs.planningType === 'single') {
        return renderSingleAdditionalIncome({ inputs, setInputs, language, workingCurrency, t, currencySymbol });
    }
    
    // Couple planning mode additional income
    if (inputs.planningType === 'couple') {
        return renderCoupleAdditionalIncome({ inputs, setInputs, language, workingCurrency, t, currencySymbol });
    }
    
    return null;
}

// Render additional income for single planning mode
function renderSingleAdditionalIncome({ inputs, setInputs, language, workingCurrency, t, currencySymbol }) {
    return React.createElement('div', { key: 'additional-income-section' }, [
        React.createElement('h3', { 
            key: 'additional-income-title',
            className: "text-xl font-semibold text-gray-700 mb-4 flex items-center" 
        }, [
            React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '📈'),
            t.additionalIncome,
            React.createElement('span', { key: 'optional', className: "ml-2 text-sm text-gray-500 font-normal" }, `(${t.optional})`)
        ]),
        React.createElement('div', { 
            key: 'additional-income-grid',
            className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" 
        }, [
            // Freelance Income
            renderIncomeField({
                key: 'freelance-income',
                label: t.freelanceIncome,
                valueField: 'freelanceIncome',
                frequencyField: 'freelanceIncomeFrequency',
                afterTaxField: 'freelanceIncomeAfterTax',
                taxRateField: 'freelanceIncomeTaxRate',
                defaultFrequency: 'monthly',
                defaultTaxRate: 30,
                inputs, setInputs, t
            }),
            // Rental Income
            renderIncomeField({
                key: 'rental-income',
                label: t.rentalIncome,
                valueField: 'rentalIncome',
                frequencyField: 'rentalIncomeFrequency',
                afterTaxField: 'rentalIncomeAfterTax',
                taxRateField: 'rentalIncomeTaxRate',
                defaultFrequency: 'monthly',
                defaultTaxRate: 31,
                inputs, setInputs, t
            }),
            // Dividend Income
            renderIncomeField({
                key: 'dividend-income',
                label: t.dividendIncome,
                valueField: 'dividendIncome',
                frequencyField: 'dividendIncomeFrequency',
                afterTaxField: 'dividendIncomeAfterTax',
                taxRateField: 'dividendIncomeTaxRate',
                defaultFrequency: 'quarterly',
                defaultTaxRate: 25,
                inputs, setInputs, t
            }),
            // Annual Bonus
            React.createElement('div', { key: 'annual-bonus' }, [
                React.createElement('label', { 
                    key: 'bonus-label',
                    className: "block text-sm font-medium text-gray-700 mb-2" 
                }, t.annualBonus),
                React.createElement('input', {
                    key: 'bonus-input',
                    type: 'number',
                    value: inputs.annualBonus || 0,
                    onChange: (e) => setInputs({...inputs, annualBonus: parseInt(e.target.value) || 0}),
                    className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                })
            ]),
            // RSU Section
            renderRSUSection({ inputs, setInputs, language, workingCurrency, t, currencySymbol }),
            // Other Income
            renderIncomeField({
                key: 'other-income',
                label: t.otherIncome,
                valueField: 'otherIncome',
                frequencyField: 'otherIncomeFrequency',
                afterTaxField: 'otherIncomeAfterTax',
                taxRateField: 'otherIncomeTaxRate',
                defaultFrequency: 'monthly',
                defaultTaxRate: 30,
                inputs, setInputs, t
            })
        ])
    ]);
}

// Render additional income for couple planning mode
function renderCoupleAdditionalIncome({ inputs, setInputs, language, workingCurrency, t, currencySymbol }) {
    return React.createElement('div', { key: 'couple-additional-income-section' }, [
        React.createElement('h3', { 
            key: 'couple-additional-income-title',
            className: "text-xl font-semibold text-gray-700 mb-6 flex items-center" 
        }, [
            React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '📈'),
            t.additionalIncome,
            React.createElement('span', { key: 'optional', className: "ml-2 text-sm text-gray-500 font-normal" }, `(${t.optional})`)
        ]),
        
        React.createElement('div', { 
            key: 'couple-additional-income-grid',
            className: "grid grid-cols-1 lg:grid-cols-2 gap-8" 
        }, [
            // Primary Person Additional Income
            renderPartnerAdditionalIncome({
                key: 'main-additional-income',
                title: t.mainAdditionalIncome,
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200',
                titleColor: 'text-blue-700',
                focusColor: 'focus:ring-blue-500',
                prefix: '',
                inputs, setInputs, language, workingCurrency, t, currencySymbol
            }),
            
            // Partner Additional Income
            renderPartnerAdditionalIncome({
                key: 'partner-additional-income',
                title: t.partnerAdditionalIncome,
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200',
                titleColor: 'text-green-700',
                focusColor: 'focus:ring-green-500',
                prefix: 'partner',
                inputs, setInputs, language, workingCurrency, t, currencySymbol
            })
        ])
    ]);
}

// Helper function to render income field with frequency and tax options
function renderIncomeField({ key, label, valueField, frequencyField, afterTaxField, taxRateField, 
                            defaultFrequency, defaultTaxRate, inputs, setInputs, t, className = "bg-gray-50 p-4 rounded-lg" }) {
    return React.createElement('div', { key, className }, [
        React.createElement('label', { 
            key: 'label',
            className: "block text-sm font-medium text-gray-700 mb-2" 
        }, label),
        React.createElement('input', {
            key: 'input',
            type: 'number',
            value: inputs[valueField] || 0,
            onChange: (e) => setInputs({...inputs, [valueField]: parseInt(e.target.value) || 0}),
            className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        }),
        // Frequency selector
        React.createElement('select', {
            key: 'frequency',
            value: inputs[frequencyField] || defaultFrequency,
            onChange: (e) => setInputs({...inputs, [frequencyField]: e.target.value}),
            className: "w-full mt-2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
        }, [
            React.createElement('option', { key: 'monthly', value: 'monthly' }, t.monthly),
            React.createElement('option', { key: 'quarterly', value: 'quarterly' }, t.quarterly),
            React.createElement('option', { key: 'yearly', value: 'yearly' }, t.yearly)
        ]),
        // Tax toggle
        React.createElement('div', { key: 'tax-toggle', className: "mt-2 flex items-center" }, [
            React.createElement('input', {
                key: 'after-tax',
                type: 'checkbox',
                id: `${valueField}AfterTax`,
                checked: inputs[afterTaxField] || false,
                onChange: (e) => setInputs({...inputs, [afterTaxField]: e.target.checked}),
                className: "mr-2"
            }),
            React.createElement('label', {
                key: 'after-tax-label',
                htmlFor: `${valueField}AfterTax`,
                className: "text-sm text-gray-600"
            }, t.afterTax || 'After Tax')
        ]),
        // Tax rate input (only show if before tax)
        !inputs[afterTaxField] && React.createElement('input', {
            key: 'tax-rate',
            type: 'number',
            value: inputs[taxRateField] || defaultTaxRate,
            onChange: (e) => setInputs({...inputs, [taxRateField]: parseInt(e.target.value) || 0}),
            placeholder: t.taxRate || 'Tax Rate %',
            className: "w-full mt-2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
        })
    ]);
}

// Helper function to render RSU section
function renderRSUSection({ inputs, setInputs, language, workingCurrency, t, currencySymbol, prefix = '' }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat(language === 'he' ? 'he-IL' : 'en-US', {
            style: 'currency',
            currency: workingCurrency === 'ILS' ? 'ILS' : 'USD',
            minimumFractionDigits: 0
        }).format(amount);
    };
    
    const rsuUnitsField = prefix ? `${prefix}RsuUnits` : 'rsuUnits';
    const rsuFrequencyField = prefix ? `${prefix}RsuFrequency` : 'rsuFrequency';
    const rsuStockPriceField = prefix ? `${prefix}RsuCurrentStockPrice` : 'rsuCurrentStockPrice';
    const rsuCompanyField = prefix ? `${prefix}RsuCompany` : 'rsuCompany';
    
    return React.createElement('div', { key: 'rsu-section' }, [
        React.createElement('label', { 
            key: 'rsu-label',
            className: "block text-sm font-medium text-gray-700 mb-2" 
        }, t.rsuAmount || 'RSU Amount'),
        
        // Enhanced RSU Company Selector
        window.EnhancedRSUCompanySelector && React.createElement(window.EnhancedRSUCompanySelector, {
            key: 'rsu-company-selector',
            inputs: inputs,
            setInputs: setInputs,
            language: language,
            workingCurrency: workingCurrency,
            prefix: prefix
        }),
        
        // RSU Units and Frequency
        React.createElement('div', { key: 'rsu-details', className: "mt-3 grid grid-cols-2 gap-2" }, [
            React.createElement('div', { key: 'rsu-units-container' }, [
                React.createElement('label', {
                    key: 'rsu-units-label',
                    className: "block text-xs font-medium text-gray-600 mb-1"
                }, language === 'he' ? 'מספר יחידות RSU' : 'RSU Units'),
                React.createElement('input', {
                    key: 'rsu-units-input',
                    type: 'number',
                    value: inputs[rsuUnitsField] || 0,
                    onChange: (e) => {
                        const units = parseInt(e.target.value) || 0;
                        // Update quarterlyRSU for backward compatibility
                        if (inputs[rsuStockPriceField]) {
                            const frequency = inputs[rsuFrequencyField] || 'quarterly';
                            let annualValue = 0;
                            if (frequency === 'monthly') {
                                annualValue = units * inputs[rsuStockPriceField] * 12;
                            } else if (frequency === 'quarterly') {
                                annualValue = units * inputs[rsuStockPriceField] * 4;
                            } else if (frequency === 'yearly') {
                                annualValue = units * inputs[rsuStockPriceField];
                            }
                            const quarterlyValue = annualValue / 4;
                            const quarterlyField = prefix ? `${prefix}QuarterlyRSU` : 'quarterlyRSU';
                            setInputs(prev => ({...prev, [rsuUnitsField]: units, [quarterlyField]: quarterlyValue}));
                        } else {
                            setInputs({...inputs, [rsuUnitsField]: units});
                        }
                    },
                    placeholder: language === 'he' ? "כמות" : "Units",
                    className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                })
            ]),
            React.createElement('div', { key: 'rsu-frequency-container' }, [
                React.createElement('label', {
                    key: 'rsu-frequency-label',
                    className: "block text-xs font-medium text-gray-600 mb-1"
                }, language === 'he' ? 'תדירות הענקה' : 'Vesting Frequency'),
                React.createElement('select', {
                    key: 'rsu-frequency-select',
                    value: inputs[rsuFrequencyField] || 'quarterly',
                    onChange: (e) => setInputs({...inputs, [rsuFrequencyField]: e.target.value}),
                    className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                }, [
                    React.createElement('option', { key: 'monthly-option', value: 'monthly' }, t.monthly),
                    React.createElement('option', { key: 'quarterly-option', value: 'quarterly' }, t.quarterly),
                    React.createElement('option', { key: 'yearly-option', value: 'yearly' }, t.yearly)
                ])
            ])
        ]),
        
        // RSU Value Display
        (inputs[rsuUnitsField] > 0 && inputs[rsuStockPriceField] > 0) && React.createElement('div', {
            key: 'rsu-value-display',
            className: "mt-2 p-2 bg-green-50 rounded-lg text-sm"
        }, [
            React.createElement('div', {
                key: 'rsu-calculation',
                className: "text-green-700"
            }, [
                React.createElement('span', { key: 'calc-text' }, 
                    `${inputs[rsuUnitsField]} ${language === 'he' ? 'יחידות' : 'units'} × ${currencySymbol}${inputs[rsuStockPriceField]} = `),
                React.createElement('span', { 
                    key: 'calc-value',
                    className: "font-semibold"
                }, formatCurrency(inputs[rsuUnitsField] * inputs[rsuStockPriceField]))
            ]),
            React.createElement('div', {
                key: 'rsu-frequency-info',
                className: "text-xs text-green-600 mt-1"
            }, language === 'he' ? 
                `הענקה ${inputs[rsuFrequencyField] === 'monthly' ? 'חודשית' : inputs[rsuFrequencyField] === 'quarterly' ? 'רבעונית' : 'שנתית'}` :
                `Vesting ${inputs[rsuFrequencyField] || 'quarterly'}`)
        ])
    ]);
}

// Helper function to render partner additional income
function renderPartnerAdditionalIncome({ key, title, bgColor, borderColor, titleColor, focusColor, prefix, 
                                        inputs, setInputs, language, workingCurrency, t, currencySymbol }) {
    return React.createElement('div', { 
        key,
        className: `${bgColor} rounded-xl p-6 border ${borderColor}` 
    }, [
        React.createElement('h4', { 
            key: 'title',
            className: `text-lg font-semibold ${titleColor} mb-4` 
        }, title),
        React.createElement('div', { key: 'fields', className: "space-y-4" }, [
            // Freelance income
            renderPartnerIncomeField({
                key: 'freelance',
                label: t.freelanceIncome,
                valueField: `${prefix}FreelanceIncome`,
                frequencyField: `${prefix}FreelanceIncomeFrequency`,
                afterTaxField: `${prefix}FreelanceIncomeAfterTax`,
                taxRateField: `${prefix}FreelanceIncomeTaxRate`,
                defaultFrequency: 'monthly',
                defaultTaxRate: 30,
                inputs, setInputs, t, focusColor
            }),
            // Simple fields without frequency/tax
            renderSimpleIncomeField({ key: 'rental', label: t.rentalIncome, field: `${prefix}RentalIncome`, inputs, setInputs, focusColor }),
            renderSimpleIncomeField({ key: 'dividend', label: t.dividendIncome, field: `${prefix}DividendIncome`, inputs, setInputs, focusColor }),
            renderSimpleIncomeField({ key: 'bonus', label: t.annualBonus, field: `${prefix}AnnualBonus`, inputs, setInputs, focusColor }),
            // RSU for partner
            prefix === 'partner' ? React.createElement('div', { key: 'partner-rsu' }, [
                React.createElement('label', { 
                    key: 'partner-rsu-label',
                    className: "block text-sm font-medium text-gray-700 mb-3" 
                }, language === 'he' ? 'מניות RSU בן/בת זוג' : 'Partner RSU Stock Options'),
                
                // Enhanced Partner RSU Selector
                window.PartnerRSUSelector && React.createElement(window.PartnerRSUSelector, {
                    key: 'partner-rsu-selector',
                    inputs: inputs,
                    setInputs: setInputs,
                    language: language,
                    workingCurrency: workingCurrency,
                    partnerKey: 'partner'
                })
            ]) : renderRSUSection({ inputs, setInputs, language, workingCurrency, t, currencySymbol, prefix }),
            renderSimpleIncomeField({ key: 'other', label: t.otherIncome, field: `${prefix}OtherIncome`, inputs, setInputs, focusColor })
        ])
    ]);
}

// Helper function for partner income field with frequency and tax
function renderPartnerIncomeField({ key, label, valueField, frequencyField, afterTaxField, taxRateField, 
                                   defaultFrequency, defaultTaxRate, inputs, setInputs, t, focusColor }) {
    return React.createElement('div', { key }, [
        React.createElement('label', { 
            key: 'label',
            className: "block text-sm font-medium text-gray-700 mb-1" 
        }, label),
        React.createElement('input', {
            key: 'input',
            type: 'number',
            value: inputs[valueField] || 0,
            onChange: (e) => setInputs({...inputs, [valueField]: parseInt(e.target.value) || 0}),
            className: `w-full p-3 border border-gray-300 rounded-lg focus:ring-2 ${focusColor}`
        }),
        React.createElement('div', { key: 'options', className: "mt-2 grid grid-cols-2 gap-2" }, [
            React.createElement('select', {
                key: 'frequency',
                value: inputs[frequencyField] || defaultFrequency,
                onChange: (e) => setInputs({...inputs, [frequencyField]: e.target.value}),
                className: "p-2 border border-gray-300 rounded-lg text-sm"
            }, [
                React.createElement('option', { key: 'monthly', value: 'monthly' }, t.monthly),
                React.createElement('option', { key: 'quarterly', value: 'quarterly' }, t.quarterly),
                React.createElement('option', { key: 'yearly', value: 'yearly' }, t.yearly)
            ]),
            React.createElement('div', { key: 'tax', className: "flex items-center" }, [
                React.createElement('input', {
                    key: 'checkbox',
                    type: 'checkbox',
                    id: valueField + 'AfterTax',
                    checked: inputs[afterTaxField] || false,
                    onChange: (e) => setInputs({...inputs, [afterTaxField]: e.target.checked}),
                    className: "mr-2"
                }),
                React.createElement('label', {
                    key: 'label',
                    htmlFor: valueField + 'AfterTax',
                    className: "text-sm text-gray-600"
                }, t.afterTax)
            ])
        ]),
        !inputs[afterTaxField] && React.createElement('input', {
            key: 'tax-rate',
            type: 'number',
            value: inputs[taxRateField] || defaultTaxRate,
            onChange: (e) => setInputs({...inputs, [taxRateField]: parseInt(e.target.value) || 0}),
            placeholder: t.taxRate,
            className: "w-full mt-2 p-2 border border-gray-300 rounded-lg text-sm"
        })
    ]);
}

// Helper function for simple income field
function renderSimpleIncomeField({ key, label, field, inputs, setInputs, focusColor }) {
    return React.createElement('div', { key }, [
        React.createElement('label', { 
            key: 'label',
            className: "block text-sm font-medium text-gray-700 mb-1" 
        }, label),
        React.createElement('input', {
            key: 'input',
            type: 'number',
            value: inputs[field] || 0,
            onChange: (e) => setInputs({...inputs, [field]: parseInt(e.target.value) || 0}),
            className: `w-full p-3 border border-gray-300 rounded-lg focus:ring-2 ${focusColor}`
        })
    ]);
}

// Export to window
window.AdditionalIncomeComponents = {
    AdditionalIncomeSection,
    renderSingleAdditionalIncome,
    renderCoupleAdditionalIncome,
    renderIncomeField,
    renderRSUSection,
    renderPartnerAdditionalIncome
};

console.log('✅ Additional income components module loaded');