// WizardStepInheritance.js - Step 6: Comprehensive Inheritance & Estate Planning
// Country-specific inheritance planning for ISR, UK, US, EU with single/couple scenarios

const WizardStepInheritance = ({ inputs, setInputs, language = 'en', workingCurrency = 'ILS' }) => {
    const createElement = React.createElement;
    
    // Multi-language content with country-specific terms
    const content = {
        he: {
            title: 'תכנון ירושה ועזבון',
            subtitle: 'תכנון מקיף לירושה ועזבון לפי חוקי המדינה',
            countrySelect: 'מדינה לתכנון ירושה',
            planningType: 'סוג התכנון',
            single: 'יחיד',
            couple: 'זוג',
            
            // Israeli terms
            israeliLaws: 'חוקי ירושה ישראליים',
            spouseExemption: 'פטור מלא לבן/בת זוג',
            childrenExemption: 'פטור לילדים: ₪2.5 מיליון לכל ילד',
            pensionSurvivor: 'זכויות שורד בפנסיה',
            propertyTransfer: 'העברת נכסים',
            
            // UK terms
            ukInheritanceTax: 'מס ירושה בריטי: 40% מעל £325,000',
            ukSpouseExempt: 'פטור מלא לבן/בת זוג בריטי',
            ukPensionDeath: 'זכויות מוות בפנסיה: 25% ללא מס',
            ukJointOwnership: 'בעלות משותפת מול יחידה',
            
            // US terms
            usFederalExemption: 'פטור פדרלי: $12.92 מיליון לאדם',
            usStateInheritance: 'מיסוי ירושה מדינתי',
            us401kBeneficiary: 'מוטבי 401(k)/IRA',
            usTrustPlanning: 'תכנון נאמנויות',
            
            // EU terms
            euSuccessionLaws: 'חוקי ירושה אירופיים',
            euCrossBorder: 'ירושה חוצת גבולות',
            euRegulations: 'תקנות האיחוד האירופי',
            
            // Common terms
            willStatus: 'סטטוס צוואה',
            hasWill: 'יש צוואה מעודכנת',
            needsWill: 'נדרשת צוואה חדשה',
            noWill: 'אין צוואה',
            lifeInsurance: 'ביטוח חיים',
            insuranceAmount: 'סכום ביטוח',
            premiumAmount: 'דמי ביטוח חודשיים',
            
            // Assets
            realEstate: 'נדל״ן',
            investments: 'השקעות',
            businessAssets: 'נכסי עסק',
            personalAssets: 'רכוש אישי',
            pensionAssets: 'נכסי פנסיה',
            
            // Debts
            mortgages: 'משכנתאות',
            loans: 'הלוואות',
            creditCards: 'אשראי',
            businessDebts: 'חובות עסק',
            
            // Beneficiaries
            beneficiaries: 'מוטבים',
            children: 'ילדים',
            spouse: 'בן/בת זוג',
            parents: 'הורים',
            siblings: 'אחים',
            charity: 'צדקה',
            other: 'אחר',
            
            // Tax optimization
            taxOptimization: 'אופטימיזציה מיסויית',
            giftTax: 'מס מתנה',
            trustFunds: 'קרנות נאמנות',
            charitableDonations: 'תרומות לצדקה',
            
            // Recommendations
            recommendations: 'המלצות',
            urgentActions: 'פעולות דחופות',
            planningSteps: 'שלבי תכנון',
            professionalAdvice: 'ייעוץ מקצועי',
            
            info: 'תכנון ירושה משפיע על אסטרטגיית ההשקעה לטווח ארוך ומצריך התאמה לחוקי המדינה'
        },
        en: {
            title: 'Inheritance & Estate Planning',
            subtitle: 'Comprehensive inheritance and estate planning according to country laws',
            countrySelect: 'Country for Inheritance Planning',
            planningType: 'Planning Type',
            single: 'Single',
            couple: 'Couple',
            
            // Israeli terms
            israeliLaws: 'Israeli Inheritance Laws',
            spouseExemption: 'Full spouse exemption',
            childrenExemption: 'Children exemption: ₪2.5M each',
            pensionSurvivor: 'Pension survivor benefits',
            propertyTransfer: 'Property transfer considerations',
            
            // UK terms
            ukInheritanceTax: 'UK Inheritance Tax: 40% over £325k',
            ukSpouseExempt: 'Full UK spouse exemption',
            ukPensionDeath: 'Pension death benefits: 25% tax-free',
            ukJointOwnership: 'Joint vs. individual ownership',
            
            // US terms
            usFederalExemption: 'Federal exemption: $12.92M per person',
            usStateInheritance: 'State inheritance taxes',
            us401kBeneficiary: '401(k)/IRA beneficiary designations',
            usTrustPlanning: 'Trust planning recommendations',
            
            // EU terms
            euSuccessionLaws: 'EU succession laws',
            euCrossBorder: 'Cross-border inheritance',
            euRegulations: 'EU succession regulations',
            
            // Common terms
            willStatus: 'Will Status',
            hasWill: 'Has Updated Will',
            needsWill: 'Needs New Will',
            noWill: 'No Will',
            lifeInsurance: 'Life Insurance',
            insuranceAmount: 'Insurance Amount',
            premiumAmount: 'Monthly Premium',
            
            // Assets
            realEstate: 'Real Estate',
            investments: 'Investments',
            businessAssets: 'Business Assets',
            personalAssets: 'Personal Assets',
            pensionAssets: 'Pension Assets',
            
            // Debts
            mortgages: 'Mortgages',
            loans: 'Loans',
            creditCards: 'Credit Cards',
            businessDebts: 'Business Debts',
            
            // Beneficiaries
            beneficiaries: 'Beneficiaries',
            children: 'Children',
            spouse: 'Spouse',
            parents: 'Parents',
            siblings: 'Siblings',
            charity: 'Charity',
            other: 'Other',
            
            // Tax optimization
            taxOptimization: 'Tax Optimization',
            giftTax: 'Gift Tax',
            trustFunds: 'Trust Funds',
            charitableDonations: 'Charitable Donations',
            
            // Recommendations
            recommendations: 'Recommendations',
            urgentActions: 'Urgent Actions',
            planningSteps: 'Planning Steps',
            professionalAdvice: 'Professional Advice',
            
            info: 'Inheritance planning affects long-term investment strategy and requires adaptation to country laws'
        }
    };

    const t = content[language];

    // Country-specific inheritance rules
    const inheritanceRules = {
        israel: {
            spouseTaxExemption: 'unlimited',
            childTaxExemption: 2500000, // ₪2.5M per child
            inheritanceTaxRate: 0,
            pensionSurvivorBenefit: 0.6, // 60% of pension
            currency: '₪',
            features: [
                t.spouseExemption,
                t.childrenExemption,
                t.pensionSurvivor,
                t.propertyTransfer
            ]
        },
        uk: {
            spouseTaxExemption: 'unlimited',
            inheritanceTaxThreshold: 325000, // £325k
            inheritanceTaxRate: 0.4, // 40%
            pensionTaxFreeAmount: 0.25, // 25% tax-free
            currency: '£',
            features: [
                t.ukInheritanceTax,
                t.ukSpouseExempt,
                t.ukPensionDeath,
                t.ukJointOwnership
            ]
        },
        us: {
            spouseTaxExemption: 'unlimited',
            federalExemption: 12920000, // $12.92M
            inheritanceTaxRate: 0.4, // 40% above exemption
            currency: '$',
            features: [
                t.usFederalExemption,
                t.usStateInheritance,
                t.us401kBeneficiary,
                t.usTrustPlanning
            ]
        },
        eu: {
            spouseTaxExemption: 'varies',
            inheritanceTaxRate: 'varies',
            currency: '€',
            features: [
                t.euSuccessionLaws,
                t.euCrossBorder,
                t.euRegulations
            ]
        }
    };

    const selectedCountry = inputs.inheritanceCountry || inputs.taxCountry || 'israel';
    const rules = inheritanceRules[selectedCountry] || inheritanceRules.israel;

    // Asset and debt calculation functions
    const calculateTotalAssets = (partner = '') => {
        const prefix = partner ? `${partner}` : '';
        const realEstate = parseFloat(inputs[`${prefix}realEstateAssets`] || 0);
        const investments = parseFloat(inputs[`${prefix}investmentAssets`] || 0);
        const business = parseFloat(inputs[`${prefix}businessAssets`] || 0);
        const personal = parseFloat(inputs[`${prefix}personalAssets`] || 0);
        const pension = parseFloat(inputs[`${prefix}pensionAssets`] || 0);
        return realEstate + investments + business + personal + pension;
    };

    const calculateTotalDebts = (partner = '') => {
        const prefix = partner ? `${partner}` : '';
        const mortgages = parseFloat(inputs[`${prefix}mortgageDebts`] || 0);
        const loans = parseFloat(inputs[`${prefix}loanDebts`] || 0);
        const credit = parseFloat(inputs[`${prefix}creditCardDebts`] || 0);
        const business = parseFloat(inputs[`${prefix}businessDebts`] || 0);
        return mortgages + loans + credit + business;
    };

    const calculateNetWorth = (partner = '') => {
        return calculateTotalAssets(partner) - calculateTotalDebts(partner);
    };

    const calculateInheritanceTax = (netWorth, partner = '') => {
        if (selectedCountry === 'israel') {
            return 0; // No inheritance tax in Israel for direct family
        } else if (selectedCountry === 'uk') {
            const threshold = rules.inheritanceTaxThreshold;
            if (netWorth > threshold) {
                return (netWorth - threshold) * rules.inheritanceTaxRate;
            }
            return 0;
        } else if (selectedCountry === 'us') {
            const exemption = rules.federalExemption;
            if (netWorth > exemption) {
                return (netWorth - exemption) * rules.inheritanceTaxRate;
            }
            return 0;
        }
        return 0; // EU varies by country
    };

    // Helper function to update inheritance data
    const updateInheritanceData = (field, value, partner = '') => {
        const key = partner ? `${partner}${field.charAt(0).toUpperCase() + field.slice(1)}` : field;
        setInputs({...inputs, [key]: value});
    };

    // Render country-specific information panel
    const renderCountryInfo = () => {
        return createElement('div', {
            key: 'country-info',
            className: "bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 mb-8"
        }, [
            createElement('div', { key: 'info-header', className: "flex items-center mb-4" }, [
                createElement('span', { key: 'flag', className: "mr-3 text-2xl" }, 
                    selectedCountry === 'israel' ? '🇮🇱' : 
                    selectedCountry === 'uk' ? '🇬🇧' :
                    selectedCountry === 'us' ? '🇺🇸' : '🇪🇺'
                ),
                createElement('h4', {
                    key: 'country-title',
                    className: "text-lg font-semibold text-blue-700"
                }, `${selectedCountry.charAt(0).toUpperCase() + selectedCountry.slice(1)} Inheritance Laws`)
            ]),
            createElement('div', { key: 'features-list', className: "space-y-2" }, 
                rules.features.map((feature, index) => 
                    createElement('div', {
                        key: `feature-${index}`,
                        className: "flex items-center text-blue-600 text-sm"
                    }, [
                        createElement('span', { key: 'check', className: "mr-2" }, '✓'),
                        createElement('span', { key: 'text' }, feature)
                    ])
                )
            )
        ]);
    };

    // Render asset input section
    const renderAssetInputs = (partner = '', colorScheme = 'blue') => {
        const prefix = partner ? `${partner}` : '';
        const title = partner ? 
            (inputs[`${partner}Name`] || `${t.title} - ${partner.charAt(0).toUpperCase() + partner.slice(1)}`) : 
            t.title;

        return createElement('div', {
            key: `${partner}assets`,
            className: `bg-${colorScheme}-50 rounded-xl p-6 border border-${colorScheme}-200`
        }, [
            createElement('h4', {
                key: 'asset-title',
                className: `text-lg font-semibold text-${colorScheme}-700 mb-6`
            }, title),
            
            // Will Status
            createElement('div', { key: 'will-status', className: "mb-6" }, [
                createElement('label', {
                    key: 'will-label',
                    className: "block text-sm font-medium text-gray-700 mb-2"
                }, t.willStatus),
                createElement('select', {
                    key: 'will-select',
                    value: inputs[`${prefix}willStatus`] || '',
                    onChange: (e) => {
                        updateInheritanceData('willStatus', e.target.value, partner);
                        // Also set hasWill for compatibility
                        updateInheritanceData('hasWill', e.target.value === 'hasWill', partner);
                    },
                    className: `w-full p-4 md:p-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-${colorScheme}-500 focus:border-${colorScheme}-500`
                }, [
                    createElement('option', { key: 'will-empty', value: '' }, 'Select...'),
                    createElement('option', { key: 'will-has', value: 'hasWill' }, t.hasWill),
                    createElement('option', { key: 'will-needs', value: 'needs' }, t.needsWill),
                    createElement('option', { key: 'will-none', value: 'none' }, t.noWill)
                ])
            ]),

            // Life Insurance
            createElement('div', { key: 'life-insurance', className: "mb-6" }, [
                createElement('h5', {
                    key: 'insurance-title',
                    className: "text-md font-medium text-gray-700 mb-3"
                }, t.lifeInsurance),
                createElement('div', { key: 'insurance-grid', className: "grid grid-cols-2 gap-3" }, [
                    createElement('input', {
                        key: 'insurance-amount',
                        type: 'number',
                        placeholder: t.insuranceAmount,
                        value: inputs[`${prefix}lifeInsuranceAmount`] || '',
                        onChange: (e) => updateInheritanceData('lifeInsuranceAmount', e.target.value, partner),
                        className: `p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${colorScheme}-500 focus:border-${colorScheme}-500`
                    }),
                    createElement('input', {
                        key: 'insurance-premium',
                        type: 'number',
                        placeholder: t.premiumAmount,
                        value: inputs[`${prefix}premiumAmount`] || '',
                        onChange: (e) => updateInheritanceData('premiumAmount', e.target.value, partner),
                        className: `p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${colorScheme}-500 focus:border-${colorScheme}-500`
                    })
                ])
            ]),

            // Assets
            createElement('div', { key: 'assets', className: "mb-6" }, [
                createElement('h5', {
                    key: 'assets-title',
                    className: "text-md font-medium text-gray-700 mb-3"
                }, 'Assets'),
                createElement('div', { key: 'assets-grid', className: "grid grid-cols-2 gap-3" }, [
                    createElement('input', {
                        key: 'real-estate',
                        type: 'number',
                        placeholder: t.realEstate,
                        value: inputs[`${prefix}realEstateAssets`] || '',
                        onChange: (e) => updateInheritanceData('realEstateAssets', e.target.value, partner),
                        className: `p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${colorScheme}-500 focus:border-${colorScheme}-500`
                    }),
                    createElement('input', {
                        key: 'investments',
                        type: 'number',
                        placeholder: t.investments,
                        value: inputs[`${prefix}investmentAssets`] || '',
                        onChange: (e) => updateInheritanceData('investmentAssets', e.target.value, partner),
                        className: `p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${colorScheme}-500 focus:border-${colorScheme}-500`
                    }),
                    createElement('input', {
                        key: 'business-assets',
                        type: 'number',
                        placeholder: t.businessAssets,
                        value: inputs[`${prefix}businessAssets`] || '',
                        onChange: (e) => updateInheritanceData('businessAssets', e.target.value, partner),
                        className: `p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${colorScheme}-500 focus:border-${colorScheme}-500`
                    }),
                    createElement('input', {
                        key: 'personal-assets',
                        type: 'number',
                        placeholder: t.personalAssets,
                        value: inputs[`${prefix}personalAssets`] || '',
                        onChange: (e) => updateInheritanceData('personalAssets', e.target.value, partner),
                        className: `p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${colorScheme}-500 focus:border-${colorScheme}-500`
                    }),
                    createElement('input', {
                        key: 'pension-assets',
                        type: 'number',
                        placeholder: t.pensionAssets,
                        value: inputs[`${prefix}pensionAssets`] || '',
                        onChange: (e) => updateInheritanceData('pensionAssets', e.target.value, partner),
                        className: `p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${colorScheme}-500 focus:border-${colorScheme}-500`
                    })
                ])
            ]),

            // Debts
            createElement('div', { key: 'debts', className: "mb-6" }, [
                createElement('h5', {
                    key: 'debts-title',
                    className: "text-md font-medium text-gray-700 mb-3"
                }, 'Debts'),
                createElement('div', { key: 'debts-grid', className: "grid grid-cols-2 gap-3" }, [
                    createElement('input', {
                        key: 'mortgages',
                        type: 'number',
                        placeholder: t.mortgages,
                        value: inputs[`${prefix}mortgageDebts`] || '',
                        onChange: (e) => updateInheritanceData('mortgageDebts', e.target.value, partner),
                        className: `p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${colorScheme}-500 focus:border-${colorScheme}-500`
                    }),
                    createElement('input', {
                        key: 'loans',
                        type: 'number',
                        placeholder: t.loans,
                        value: inputs[`${prefix}loanDebts`] || '',
                        onChange: (e) => updateInheritanceData('loanDebts', e.target.value, partner),
                        className: `p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${colorScheme}-500 focus:border-${colorScheme}-500`
                    }),
                    createElement('input', {
                        key: 'credit-cards',
                        type: 'number',
                        placeholder: t.creditCards,
                        value: inputs[`${prefix}creditCardDebts`] || '',
                        onChange: (e) => updateInheritanceData('creditCardDebts', e.target.value, partner),
                        className: `p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${colorScheme}-500 focus:border-${colorScheme}-500`
                    }),
                    createElement('input', {
                        key: 'business-debts',
                        type: 'number',
                        placeholder: t.businessDebts,
                        value: inputs[`${prefix}businessDebts`] || '',
                        onChange: (e) => updateInheritanceData('businessDebts', e.target.value, partner),
                        className: `p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${colorScheme}-500 focus:border-${colorScheme}-500`
                    })
                ])
            ]),

            // Store calculated values for dashboard integration
            React.useEffect(() => {
                const totalAssets = calculateTotalAssets(partner);
                const totalDebts = calculateTotalDebts(partner);
                const netWorth = calculateNetWorth(partner);
                
                // Update inputs with calculated values for dashboard integration
                const updates = {
                    [`${partner || ''}totalAssets`]: totalAssets,
                    [`${partner || ''}totalDebts`]: totalDebts,
                    [`${partner || ''}netWorth`]: netWorth
                };
                
                setInputs(prev => ({...prev, ...updates}));
            }, [inputs[`${prefix}realEstateAssets`], inputs[`${prefix}investmentAssets`], inputs[`${prefix}businessAssets`], inputs[`${prefix}personalAssets`], inputs[`${prefix}pensionAssets`], inputs[`${prefix}mortgageDebts`], inputs[`${prefix}loanDebts`], inputs[`${prefix}creditCardDebts`], inputs[`${prefix}businessDebts`]]),

            // Net Worth Summary
            createElement('div', {
                key: 'net-worth-summary',
                className: `bg-${colorScheme}-100 rounded-lg p-4 border border-${colorScheme}-300`
            }, [
                createElement('div', { key: 'summary-grid', className: "grid grid-cols-3 gap-4 text-center" }, [
                    createElement('div', { key: 'total-assets' }, [
                        createElement('div', { 
                            key: 'assets-label',
                            className: `text-sm font-medium text-${colorScheme}-700`
                        }, 'Total Assets'),
                        createElement('div', {
                            key: 'assets-value',
                            className: `text-lg font-bold text-${colorScheme}-800`
                        }, `${rules.currency}${calculateTotalAssets(prefix).toLocaleString()}`)
                    ]),
                    createElement('div', { key: 'total-debts' }, [
                        createElement('div', {
                            key: 'debts-label',
                            className: `text-sm font-medium text-${colorScheme}-700`
                        }, 'Total Debts'),
                        createElement('div', {
                            key: 'debts-value',
                            className: `text-lg font-bold text-red-600`
                        }, `${rules.currency}${calculateTotalDebts(prefix).toLocaleString()}`)
                    ]),
                    createElement('div', { key: 'net-worth' }, [
                        createElement('div', {
                            key: 'net-worth-label',
                            className: `text-sm font-medium text-${colorScheme}-700`
                        }, 'Net Worth'),
                        createElement('div', {
                            key: 'net-worth-value',
                            className: `text-lg font-bold text-green-600`
                        }, `${rules.currency}${calculateNetWorth(prefix).toLocaleString()}`)
                    ])
                ]),
                // Inheritance Tax Estimate
                createElement('div', {
                    key: 'inheritance-tax',
                    className: "mt-4 pt-4 border-t border-gray-300"
                }, [
                    createElement('div', { key: 'tax-grid', className: "grid grid-cols-2 gap-4 text-center" }, [
                        createElement('div', { key: 'estimated-tax' }, [
                            createElement('div', {
                                key: 'tax-label',
                                className: `text-sm font-medium text-${colorScheme}-700`
                            }, 'Estimated Inheritance Tax'),
                            createElement('div', {
                                key: 'tax-value',
                                className: `text-lg font-bold text-red-600`
                            }, `${rules.currency}${calculateInheritanceTax(calculateNetWorth(prefix), prefix).toLocaleString()}`)
                        ]),
                        createElement('div', { key: 'after-tax' }, [
                            createElement('div', {
                                key: 'after-tax-label',
                                className: `text-sm font-medium text-${colorScheme}-700`
                            }, 'After-Tax Inheritance'),
                            createElement('div', {
                                key: 'after-tax-value',
                                className: `text-lg font-bold text-green-600`
                            }, `${rules.currency}${(calculateNetWorth(prefix) - calculateInheritanceTax(calculateNetWorth(prefix), prefix)).toLocaleString()}`)
                        ])
                    ])
                ])
            ])
        ]);
    };

    // Render beneficiaries section
    const renderBeneficiariesSection = () => {
        return createElement('div', { key: 'beneficiaries-section', className: "space-y-6" }, [
            createElement('h3', {
                key: 'beneficiaries-title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '👨‍👩‍👧‍👦'),
                t.beneficiaries
            ]),
            
            createElement('div', {
                key: 'beneficiaries-grid',
                className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
            }, [
                // Children
                createElement('div', { key: 'children' }, [
                    createElement('label', {
                        key: 'children-label',
                        className: "block text-sm font-medium text-gray-700 mb-2"
                    }, t.children),
                    createElement('input', {
                        key: 'children-input',
                        type: 'number',
                        placeholder: '%',
                        max: 100,
                        value: inputs.childrenBeneficiaryPercentage || '',
                        onChange: (e) => setInputs({...inputs, childrenBeneficiaryPercentage: e.target.value}),
                        className: "w-full p-4 md:p-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    })
                ]),
                
                // Spouse
                createElement('div', { key: 'spouse' }, [
                    createElement('label', {
                        key: 'spouse-label',
                        className: "block text-sm font-medium text-gray-700 mb-2"
                    }, t.spouse),
                    createElement('input', {
                        key: 'spouse-input',
                        type: 'number',
                        placeholder: '%',
                        max: 100,
                        value: inputs.spouseBeneficiaryPercentage || '',
                        onChange: (e) => setInputs({...inputs, spouseBeneficiaryPercentage: e.target.value}),
                        className: "w-full p-4 md:p-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    })
                ]),
                
                // Parents
                createElement('div', { key: 'parents' }, [
                    createElement('label', {
                        key: 'parents-label',
                        className: "block text-sm font-medium text-gray-700 mb-2"
                    }, t.parents),
                    createElement('input', {
                        key: 'parents-input',
                        type: 'number',
                        placeholder: '%',
                        max: 100,
                        value: inputs.parentsBeneficiaryPercentage || '',
                        onChange: (e) => setInputs({...inputs, parentsBeneficiaryPercentage: e.target.value}),
                        className: "w-full p-4 md:p-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    })
                ]),
                
                // Siblings
                createElement('div', { key: 'siblings' }, [
                    createElement('label', {
                        key: 'siblings-label',
                        className: "block text-sm font-medium text-gray-700 mb-2"
                    }, t.siblings),
                    createElement('input', {
                        key: 'siblings-input',
                        type: 'number',
                        placeholder: '%',
                        max: 100,
                        value: inputs.siblingsBeneficiaryPercentage || '',
                        onChange: (e) => setInputs({...inputs, siblingsBeneficiaryPercentage: e.target.value}),
                        className: "w-full p-4 md:p-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    })
                ]),
                
                // Charity
                createElement('div', { key: 'charity' }, [
                    createElement('label', {
                        key: 'charity-label',
                        className: "block text-sm font-medium text-gray-700 mb-2"
                    }, t.charity),
                    createElement('input', {
                        key: 'charity-input',
                        type: 'number',
                        placeholder: '%',
                        max: 100,
                        value: inputs.charityBeneficiaryPercentage || '',
                        onChange: (e) => setInputs({...inputs, charityBeneficiaryPercentage: e.target.value}),
                        className: "w-full p-4 md:p-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    })
                ]),
                
                // Other
                createElement('div', { key: 'other' }, [
                    createElement('label', {
                        key: 'other-label',
                        className: "block text-sm font-medium text-gray-700 mb-2"
                    }, t.other),
                    createElement('input', {
                        key: 'other-input',
                        type: 'number',
                        placeholder: '%',
                        max: 100,
                        value: inputs.otherBeneficiaryPercentage || '',
                        onChange: (e) => setInputs({...inputs, otherBeneficiaryPercentage: e.target.value}),
                        className: "w-full p-4 md:p-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    })
                ])
            ]),

            // Beneficiary percentage validation
            createElement('div', {
                key: 'percentage-validation',
                className: "bg-yellow-50 rounded-lg p-4 border border-yellow-200"
            }, [
                createElement('div', {
                    key: 'validation-text',
                    className: "text-sm text-yellow-700"
                }, [
                    'Total percentage: ',
                    createElement('span', {
                        key: 'total-percentage',
                        className: "font-bold"
                    }, `${(
                        parseFloat(inputs.childrenBeneficiaryPercentage || 0) +
                        parseFloat(inputs.spouseBeneficiaryPercentage || 0) +
                        parseFloat(inputs.parentsBeneficiaryPercentage || 0) +
                        parseFloat(inputs.siblingsBeneficiaryPercentage || 0) +
                        parseFloat(inputs.charityBeneficiaryPercentage || 0) +
                        parseFloat(inputs.otherBeneficiaryPercentage || 0)
                    )}%`)
                ])
            ])
        ]);
    };

    return createElement('div', { className: "space-y-8" }, [
        // Country Selection
        createElement('div', { key: 'country-selection' }, [
            createElement('h3', {
                key: 'main-title',
                className: "text-2xl font-bold text-gray-800 mb-6 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-3xl" }, '🏛️'),
                t.title
            ]),
            
            createElement('div', { key: 'country-selector', className: "mb-6" }, [
                createElement('label', {
                    key: 'country-label',
                    className: "block text-sm font-medium text-gray-700 mb-2"
                }, t.countrySelect),
                createElement('select', {
                    key: 'country-select',
                    value: selectedCountry,
                    onChange: (e) => setInputs({...inputs, inheritanceCountry: e.target.value}),
                    className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                }, [
                    createElement('option', { key: 'israel', value: 'israel' }, '🇮🇱 Israel'),
                    createElement('option', { key: 'uk', value: 'uk' }, '🇬🇧 United Kingdom'),
                    createElement('option', { key: 'us', value: 'us' }, '🇺🇸 United States'),
                    createElement('option', { key: 'eu', value: 'eu' }, '🇪🇺 European Union')
                ])
            ])
        ]),

        // Country-specific information
        renderCountryInfo(),

        // Asset planning - Single or Couple
        inputs.planningType === 'couple' ? 
            createElement('div', { key: 'couple-planning', className: "grid grid-cols-1 lg:grid-cols-2 gap-8" }, [
                renderAssetInputs('partner1', 'pink'),
                renderAssetInputs('partner2', 'purple')
            ]) :
            renderAssetInputs('', 'blue'),

        // Beneficiaries section
        renderBeneficiariesSection(),

        // Tax optimization recommendations
        createElement('div', {
            key: 'tax-optimization',
            className: "bg-green-50 rounded-xl p-6 border border-green-200"
        }, [
            createElement('h3', {
                key: 'optimization-title',
                className: "text-xl font-semibold text-green-700 mb-4 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '💡'),
                t.taxOptimization
            ]),
            createElement('div', { key: 'optimization-grid', className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, [
                createElement('div', { key: 'optimization-items' }, [
                    createElement('ul', { key: 'optimization-list', className: "space-y-2 text-green-700" }, [
                        createElement('li', { key: 'gift-tax' }, `• ${t.giftTax}`),
                        createElement('li', { key: 'trust-funds' }, `• ${t.trustFunds}`),
                        createElement('li', { key: 'charitable-donations' }, `• ${t.charitableDonations}`)
                    ])
                ]),
                createElement('div', { key: 'urgent-actions' }, [
                    createElement('h4', {
                        key: 'urgent-title',
                        className: "font-semibold text-green-700 mb-2"
                    }, t.urgentActions),
                    createElement('ul', { key: 'urgent-list', className: "space-y-1 text-green-600 text-sm" }, [
                        createElement('li', { key: 'update-will' }, '• Update/create will'),
                        createElement('li', { key: 'beneficiary-designations' }, '• Review beneficiary designations'),
                        createElement('li', { key: 'professional-advice' }, `• ${t.professionalAdvice}`)
                    ])
                ])
            ])
        ]),

        // Information panel
        createElement('div', {
            key: 'info-panel',
            className: "bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
        }, [
            createElement('div', { key: 'info-icon', className: "text-2xl mb-2" }, 'ℹ️'),
            createElement('h4', {
                key: 'info-title',
                className: "text-lg font-semibold text-blue-700 mb-2"
            }, language === 'he' ? 'מידע חשוב' : 'Important Information'),
            createElement('p', {
                key: 'info-text',
                className: "text-blue-700 text-sm"
            }, t.info)
        ])
    ]);
};

// Export the component
window.WizardStepInheritance = WizardStepInheritance;

console.log('✅ WizardStepInheritance component loaded successfully');