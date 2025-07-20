// WizardStepInheritance.js - Step 6: Inheritance & Estate Planning
// Per-partner inheritance planning and estate management

const WizardStepInheritance = ({ inputs, setInputs, language = 'en' }) => {
    const content = {
        he: {
            title: 'תכנון ירושה ונכסים',
            subtitle: 'הגדרת תכנון ירושה ונושאי עזבון לכל בן זוג',
            inheritanceGoals: 'יעדי ירושה',
            estateValue: 'שווי עזבון צפוי',
            legacyAmount: 'סכום ירושה רצוי',
            beneficiaries: 'מוטבים',
            children: 'ילדים',
            spouse: 'בן/בת זוג',
            charity: 'צדקה',
            other: 'אחר',
            inheritanceTax: 'מס ירושה',
            taxOptimization: 'אופטימיזציה מיסויית',
            willStatus: 'סטטוס צוואה',
            hasWill: 'יש צוואה מעודכנת',
            needsWill: 'נדרשת צוואה חדשה',
            noWill: 'אין צוואה',
            trustFund: 'קרן נאמנות',
            lifeInsurance: 'ביטוח חיים',
            insuranceAmount: 'סכום ביטוח',
            premiumAmount: 'דמי ביטוח חודשיים',
            partner1Inheritance: 'תכנון ירושה בן/בת זוג 1',
            partner2Inheritance: 'תכנון ירושה בן/בת זוג 2',
            expectedInheritance: 'ירושה צפויה',
            familyInheritance: 'ירושה ממשפחה',
            realEstate: 'נדל״ן',
            investments: 'השקעות',
            businessAssets: 'נכסי עסק',
            personalAssets: 'רכוש אישי',
            debts: 'חובות',
            mortgages: 'משכנתאות',
            loans: 'הלוואות',
            netWorth: 'הון נקי',
            estatePlanning: 'תכנון עזבון',
            guardianship: 'אפוטרופסות',
            powerOfAttorney: 'ייפוי כח',
            healthDirectives: 'הנחיות רפואיות',
            financialPlanning: 'תכנון פיננסי',
            info: 'תכנון ירושה משפיע על אסטרטגיית ההשקעה וההקצאה לטווח ארוך'
        },
        en: {
            title: 'Inheritance & Estate Planning',
            subtitle: 'Define inheritance planning and estate matters for each partner',
            inheritanceGoals: 'Inheritance Goals',
            estateValue: 'Expected Estate Value',
            legacyAmount: 'Desired Legacy Amount',
            beneficiaries: 'Beneficiaries',
            children: 'Children',
            spouse: 'Spouse',
            charity: 'Charity',
            other: 'Other',
            inheritanceTax: 'Inheritance Tax',
            taxOptimization: 'Tax Optimization',
            willStatus: 'Will Status',
            hasWill: 'Has Updated Will',
            needsWill: 'Needs New Will',
            noWill: 'No Will',
            trustFund: 'Trust Fund',
            lifeInsurance: 'Life Insurance',
            insuranceAmount: 'Insurance Amount',
            premiumAmount: 'Monthly Premium',
            partner1Inheritance: 'Partner 1 Inheritance Planning',
            partner2Inheritance: 'Partner 2 Inheritance Planning',
            expectedInheritance: 'Expected Inheritance',
            familyInheritance: 'Family Inheritance',
            realEstate: 'Real Estate',
            investments: 'Investments',
            businessAssets: 'Business Assets',
            personalAssets: 'Personal Assets',
            debts: 'Debts',
            mortgages: 'Mortgages',
            loans: 'Loans',
            netWorth: 'Net Worth',
            estatePlanning: 'Estate Planning',
            guardianship: 'Guardianship',
            powerOfAttorney: 'Power of Attorney',
            healthDirectives: 'Health Directives',
            financialPlanning: 'Financial Planning',
            info: 'Inheritance planning affects long-term investment strategy and asset allocation'
        }
    };

    const t = content[language];

    // Helper function to update inheritance data
    const updateInheritanceData = (partner, field, value) => {
        const partnerKey = partner === 'main' ? '' : `${partner}`;
        const fieldKey = partnerKey ? `${partnerKey}${field.charAt(0).toUpperCase() + field.slice(1)}` : field;
        setInputs({...inputs, [fieldKey]: value});
    };

    // Helper function to calculate net worth
    const calculateNetWorth = (partner) => {
        const prefix = partner === 'main' ? '' : `${partner}`;
        const realEstate = parseFloat(inputs[`${prefix}realEstateValue`] || 0);
        const investments = parseFloat(inputs[`${prefix}investmentAssets`] || 0);
        const business = parseFloat(inputs[`${prefix}businessAssets`] || 0);
        const personal = parseFloat(inputs[`${prefix}personalAssets`] || 0);
        const mortgages = parseFloat(inputs[`${prefix}mortgageDebt`] || 0);
        const loans = parseFloat(inputs[`${prefix}loanDebt`] || 0);
        
        const assets = realEstate + investments + business + personal;
        const debts = mortgages + loans;
        return assets - debts;
    };

    return React.createElement('div', { className: "space-y-8" }, [
        // Main Inheritance Planning (if individual planning)
        inputs.planningType !== 'couple' && React.createElement('div', { key: 'main-inheritance-section' }, [
            React.createElement('h3', { 
                key: 'main-inheritance-title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '🏛️'),
                t.title
            ]),
            
            // Main inheritance form content would go here
            React.createElement('div', { 
                key: 'main-inheritance-content',
                className: "bg-white rounded-xl p-6 border border-gray-200" 
            }, [
                React.createElement('p', { 
                    key: 'main-placeholder',
                    className: "text-gray-600" 
                }, 'Individual inheritance planning form')
            ])
        ]),

        // Partner Inheritance Planning (if couple planning)
        inputs.planningType === 'couple' && React.createElement('div', { key: 'partner-inheritance-section' }, [
            React.createElement('h3', { 
                key: 'partner-inheritance-title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '👫'),
                t.title
            ]),
            
            React.createElement('div', { 
                key: 'partner-inheritance-grid',
                className: "grid grid-cols-1 lg:grid-cols-2 gap-8" 
            }, [
                // Partner 1 Inheritance Planning
                React.createElement('div', { 
                    key: 'partner1-inheritance',
                    className: "bg-pink-50 rounded-xl p-6 border border-pink-200" 
                }, [
                    React.createElement('h4', { 
                        key: 'partner1-inheritance-title',
                        className: "text-lg font-semibold text-pink-700 mb-6" 
                    }, inputs.partner1Name || t.partner1Inheritance),
                    
                    React.createElement('div', { key: 'partner1-inheritance-content', className: "space-y-6" }, [
                        // Will Status
                        React.createElement('div', { key: 'p1-will-status' }, [
                            React.createElement('label', { 
                                key: 'p1-will-label',
                                className: "block text-sm font-medium text-gray-700 mb-2" 
                            }, t.willStatus),
                            React.createElement('select', {
                                key: 'p1-will-select',
                                value: inputs.partner1WillStatus || '',
                                onChange: (e) => updateInheritanceData('partner1', 'willStatus', e.target.value),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            }, [
                                React.createElement('option', { key: 'p1-will-empty', value: '' }, 'Select...'),
                                React.createElement('option', { key: 'p1-will-has', value: 'has' }, t.hasWill),
                                React.createElement('option', { key: 'p1-will-needs', value: 'needs' }, t.needsWill),
                                React.createElement('option', { key: 'p1-will-none', value: 'none' }, t.noWill)
                            ])
                        ]),
                        
                        // Life Insurance
                        React.createElement('div', { key: 'p1-life-insurance' }, [
                            React.createElement('label', { 
                                key: 'p1-insurance-label',
                                className: "block text-sm font-medium text-gray-700 mb-2" 
                            }, t.lifeInsurance),
                            React.createElement('div', { key: 'p1-insurance-grid', className: "grid grid-cols-2 gap-3" }, [
                                React.createElement('input', {
                                    key: 'p1-insurance-amount',
                                    type: 'number',
                                    placeholder: t.insuranceAmount,
                                    value: inputs.partner1InsuranceAmount || '',
                                    onChange: (e) => updateInheritanceData('partner1', 'insuranceAmount', e.target.value),
                                    className: "p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                }),
                                React.createElement('input', {
                                    key: 'p1-insurance-premium',
                                    type: 'number',
                                    placeholder: t.premiumAmount,
                                    value: inputs.partner1InsurancePremium || '',
                                    onChange: (e) => updateInheritanceData('partner1', 'insurancePremium', e.target.value),
                                    className: "p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                })
                            ])
                        ]),
                        
                        // Assets
                        React.createElement('div', { key: 'p1-assets' }, [
                            React.createElement('h5', { 
                                key: 'p1-assets-title',
                                className: "text-md font-medium text-gray-700 mb-3" 
                            }, 'Assets'),
                            React.createElement('div', { key: 'p1-assets-grid', className: "grid grid-cols-2 gap-3" }, [
                                React.createElement('input', {
                                    key: 'p1-real-estate',
                                    type: 'number',
                                    placeholder: t.realEstate,
                                    value: inputs.partner1RealEstateValue || '',
                                    onChange: (e) => updateInheritanceData('partner1', 'realEstateValue', e.target.value),
                                    className: "p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                }),
                                React.createElement('input', {
                                    key: 'p1-investment-assets',
                                    type: 'number',
                                    placeholder: t.investments,
                                    value: inputs.partner1InvestmentAssets || '',
                                    onChange: (e) => updateInheritanceData('partner1', 'investmentAssets', e.target.value),
                                    className: "p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                }),
                                React.createElement('input', {
                                    key: 'p1-business-assets',
                                    type: 'number',
                                    placeholder: t.businessAssets,
                                    value: inputs.partner1BusinessAssets || '',
                                    onChange: (e) => updateInheritanceData('partner1', 'businessAssets', e.target.value),
                                    className: "p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                }),
                                React.createElement('input', {
                                    key: 'p1-personal-assets',
                                    type: 'number',
                                    placeholder: t.personalAssets,
                                    value: inputs.partner1PersonalAssets || '',
                                    onChange: (e) => updateInheritanceData('partner1', 'personalAssets', e.target.value),
                                    className: "p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                })
                            ])
                        ]),
                        
                        // Debts
                        React.createElement('div', { key: 'p1-debts' }, [
                            React.createElement('h5', { 
                                key: 'p1-debts-title',
                                className: "text-md font-medium text-gray-700 mb-3" 
                            }, t.debts),
                            React.createElement('div', { key: 'p1-debts-grid', className: "grid grid-cols-2 gap-3" }, [
                                React.createElement('input', {
                                    key: 'p1-mortgage-debt',
                                    type: 'number',
                                    placeholder: t.mortgages,
                                    value: inputs.partner1MortgageDebt || '',
                                    onChange: (e) => updateInheritanceData('partner1', 'mortgageDebt', e.target.value),
                                    className: "p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                }),
                                React.createElement('input', {
                                    key: 'p1-loan-debt',
                                    type: 'number',
                                    placeholder: t.loans,
                                    value: inputs.partner1LoanDebt || '',
                                    onChange: (e) => updateInheritanceData('partner1', 'loanDebt', e.target.value),
                                    className: "p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                })
                            ])
                        ]),
                        
                        // Net Worth Display
                        React.createElement('div', { 
                            key: 'p1-net-worth',
                            className: "bg-pink-100 rounded-lg p-4 border border-pink-300" 
                        }, [
                            React.createElement('div', { 
                                key: 'p1-net-worth-label',
                                className: "text-sm font-medium text-pink-700" 
                            }, t.netWorth),
                            React.createElement('div', { 
                                key: 'p1-net-worth-value',
                                className: "text-lg font-bold text-pink-800" 
                            }, `₪${calculateNetWorth('partner1').toLocaleString()}`)
                        ])
                    ])
                ]),
                
                // Partner 2 Inheritance Planning
                React.createElement('div', { 
                    key: 'partner2-inheritance',
                    className: "bg-purple-50 rounded-xl p-6 border border-purple-200" 
                }, [
                    React.createElement('h4', { 
                        key: 'partner2-inheritance-title',
                        className: "text-lg font-semibold text-purple-700 mb-6" 
                    }, inputs.partner2Name || t.partner2Inheritance),
                    
                    React.createElement('div', { key: 'partner2-inheritance-content', className: "space-y-6" }, [
                        // Will Status
                        React.createElement('div', { key: 'p2-will-status' }, [
                            React.createElement('label', { 
                                key: 'p2-will-label',
                                className: "block text-sm font-medium text-gray-700 mb-2" 
                            }, t.willStatus),
                            React.createElement('select', {
                                key: 'p2-will-select',
                                value: inputs.partner2WillStatus || '',
                                onChange: (e) => updateInheritanceData('partner2', 'willStatus', e.target.value),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            }, [
                                React.createElement('option', { key: 'p2-will-empty', value: '' }, 'Select...'),
                                React.createElement('option', { key: 'p2-will-has', value: 'has' }, t.hasWill),
                                React.createElement('option', { key: 'p2-will-needs', value: 'needs' }, t.needsWill),
                                React.createElement('option', { key: 'p2-will-none', value: 'none' }, t.noWill)
                            ])
                        ]),
                        
                        // Life Insurance
                        React.createElement('div', { key: 'p2-life-insurance' }, [
                            React.createElement('label', { 
                                key: 'p2-insurance-label',
                                className: "block text-sm font-medium text-gray-700 mb-2" 
                            }, t.lifeInsurance),
                            React.createElement('div', { key: 'p2-insurance-grid', className: "grid grid-cols-2 gap-3" }, [
                                React.createElement('input', {
                                    key: 'p2-insurance-amount',
                                    type: 'number',
                                    placeholder: t.insuranceAmount,
                                    value: inputs.partner2InsuranceAmount || '',
                                    onChange: (e) => updateInheritanceData('partner2', 'insuranceAmount', e.target.value),
                                    className: "p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                }),
                                React.createElement('input', {
                                    key: 'p2-insurance-premium',
                                    type: 'number',
                                    placeholder: t.premiumAmount,
                                    value: inputs.partner2InsurancePremium || '',
                                    onChange: (e) => updateInheritanceData('partner2', 'insurancePremium', e.target.value),
                                    className: "p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                })
                            ])
                        ]),
                        
                        // Assets
                        React.createElement('div', { key: 'p2-assets' }, [
                            React.createElement('h5', { 
                                key: 'p2-assets-title',
                                className: "text-md font-medium text-gray-700 mb-3" 
                            }, 'Assets'),
                            React.createElement('div', { key: 'p2-assets-grid', className: "grid grid-cols-2 gap-3" }, [
                                React.createElement('input', {
                                    key: 'p2-real-estate',
                                    type: 'number',
                                    placeholder: t.realEstate,
                                    value: inputs.partner2RealEstateValue || '',
                                    onChange: (e) => updateInheritanceData('partner2', 'realEstateValue', e.target.value),
                                    className: "p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                }),
                                React.createElement('input', {
                                    key: 'p2-investment-assets',
                                    type: 'number',
                                    placeholder: t.investments,
                                    value: inputs.partner2InvestmentAssets || '',
                                    onChange: (e) => updateInheritanceData('partner2', 'investmentAssets', e.target.value),
                                    className: "p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                }),
                                React.createElement('input', {
                                    key: 'p2-business-assets',
                                    type: 'number',
                                    placeholder: t.businessAssets,
                                    value: inputs.partner2BusinessAssets || '',
                                    onChange: (e) => updateInheritanceData('partner2', 'businessAssets', e.target.value),
                                    className: "p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                }),
                                React.createElement('input', {
                                    key: 'p2-personal-assets',
                                    type: 'number',
                                    placeholder: t.personalAssets,
                                    value: inputs.partner2PersonalAssets || '',
                                    onChange: (e) => updateInheritanceData('partner2', 'personalAssets', e.target.value),
                                    className: "p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                })
                            ])
                        ]),
                        
                        // Debts
                        React.createElement('div', { key: 'p2-debts' }, [
                            React.createElement('h5', { 
                                key: 'p2-debts-title',
                                className: "text-md font-medium text-gray-700 mb-3" 
                            }, t.debts),
                            React.createElement('div', { key: 'p2-debts-grid', className: "grid grid-cols-2 gap-3" }, [
                                React.createElement('input', {
                                    key: 'p2-mortgage-debt',
                                    type: 'number',
                                    placeholder: t.mortgages,
                                    value: inputs.partner2MortgageDebt || '',
                                    onChange: (e) => updateInheritanceData('partner2', 'mortgageDebt', e.target.value),
                                    className: "p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                }),
                                React.createElement('input', {
                                    key: 'p2-loan-debt',
                                    type: 'number',
                                    placeholder: t.loans,
                                    value: inputs.partner2LoanDebt || '',
                                    onChange: (e) => updateInheritanceData('partner2', 'loanDebt', e.target.value),
                                    className: "p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                })
                            ])
                        ]),
                        
                        // Net Worth Display
                        React.createElement('div', { 
                            key: 'p2-net-worth',
                            className: "bg-purple-100 rounded-lg p-4 border border-purple-300" 
                        }, [
                            React.createElement('div', { 
                                key: 'p2-net-worth-label',
                                className: "text-sm font-medium text-purple-700" 
                            }, t.netWorth),
                            React.createElement('div', { 
                                key: 'p2-net-worth-value',
                                className: "text-lg font-bold text-purple-800" 
                            }, `₪${calculateNetWorth('partner2').toLocaleString()}`)
                        ])
                    ])
                ])
            ])
        ]),

        // Beneficiaries & Legacy Planning
        React.createElement('div', { key: 'beneficiaries-section' }, [
            React.createElement('h3', { 
                key: 'beneficiaries-title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '👨‍👩‍👧‍👦'),
                t.beneficiaries
            ]),
            React.createElement('div', { 
                key: 'beneficiaries-grid',
                className: "grid grid-cols-2 md:grid-cols-4 gap-4" 
            }, [
                // Children
                React.createElement('div', { key: 'children-beneficiary' }, [
                    React.createElement('label', { 
                        key: 'children-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.children),
                    React.createElement('input', {
                        key: 'children-percentage',
                        type: 'number',
                        placeholder: '% of estate',
                        max: 100,
                        value: inputs.childrenBeneficiaryPercentage || '',
                        onChange: (e) => setInputs({...inputs, childrenBeneficiaryPercentage: e.target.value}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    })
                ]),
                
                // Spouse
                React.createElement('div', { key: 'spouse-beneficiary' }, [
                    React.createElement('label', { 
                        key: 'spouse-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.spouse),
                    React.createElement('input', {
                        key: 'spouse-percentage',
                        type: 'number',
                        placeholder: '% of estate',
                        max: 100,
                        value: inputs.spouseBeneficiaryPercentage || '',
                        onChange: (e) => setInputs({...inputs, spouseBeneficiaryPercentage: e.target.value}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    })
                ]),
                
                // Charity
                React.createElement('div', { key: 'charity-beneficiary' }, [
                    React.createElement('label', { 
                        key: 'charity-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.charity),
                    React.createElement('input', {
                        key: 'charity-percentage',
                        type: 'number',
                        placeholder: '% of estate',
                        max: 100,
                        value: inputs.charityBeneficiaryPercentage || '',
                        onChange: (e) => setInputs({...inputs, charityBeneficiaryPercentage: e.target.value}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    })
                ]),
                
                // Other
                React.createElement('div', { key: 'other-beneficiary' }, [
                    React.createElement('label', { 
                        key: 'other-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.other),
                    React.createElement('input', {
                        key: 'other-percentage',
                        type: 'number',
                        placeholder: '% of estate',
                        max: 100,
                        value: inputs.otherBeneficiaryPercentage || '',
                        onChange: (e) => setInputs({...inputs, otherBeneficiaryPercentage: e.target.value}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    })
                ])
            ])
        ]),

        // Info Panel
        React.createElement('div', { 
            key: 'info',
            className: "bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200" 
        }, [
            React.createElement('div', { key: 'info-icon', className: "text-2xl mb-2" }, 'ℹ️'),
            React.createElement('h4', { 
                key: 'info-title',
                className: "text-lg font-semibold text-blue-700 mb-2" 
            }, language === 'he' ? 'מידע חשוב' : 'Important Information'),
            React.createElement('p', { 
                key: 'info-text',
                className: "text-blue-700 text-sm" 
            }, t.info)
        ])
    ]);
};

window.WizardStepInheritance = WizardStepInheritance;
console.log('✅ WizardStepInheritance component loaded successfully');