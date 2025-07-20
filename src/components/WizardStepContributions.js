// WizardStepContributions.js - Step 4: Contribution Settings
// Country-specific pension contribution rules and settings

const WizardStepContributions = ({ inputs, setInputs, language = 'en', workingCurrency = 'ILS' }) => {
    // Component uses React.createElement for rendering
    const createElement = React.createElement;
    
    // Multi-language content
    const content = {
        he: {
            contributionSettings: 'הגדרות הפקדות',
            pensionContribution: 'הפקדות לפנסיה',
            trainingFundContribution: 'הפקדות לקרן השתלמות',
            country: 'מדינה',
            pensionRate: 'אחוז הפקדה לפנסיה (%)',
            trainingFundRate: 'אחוז הפקדה לקרן השתלמות (%)',
            employeeContribution: 'הפקדת עובד (%)',
            employerMatching: 'השלמת מעביד (%)',
            partnerContributions: 'הפקדות בני הזוג',
            partner1Contributions: 'הפקדות בן/בת זוג 1',
            partner2Contributions: 'הפקדות בן/בת זוג 2',
            trainingFundLimits: 'מגבלות קרן השתלמות',
            salaryThreshold: 'סף משכורת (₪)',
            belowThreshold: 'מתחת לסף (%)',
            aboveThreshold: 'מעל הסף (%)',
            currentSalaryStatus: 'סטטוס משכורת נוכחי',
            israel: 'ישראל',
            usa: 'ארה״ב',
            uk: 'בריטניה',
            france: 'צרפת',
            germany: 'גרמניה',
            australia: 'אוסטרליה',
            comingSoon: 'בקרוב...',
            defaultRates: 'אחוזים ברירת מחדל',
            customRates: 'התאמה אישית'
        },
        en: {
            contributionSettings: 'Contribution Settings',
            pensionContribution: 'Pension Contributions',
            trainingFundContribution: 'Training Fund Contributions',
            country: 'Country',
            pensionRate: 'Pension Contribution Rate (%)',
            trainingFundRate: 'Training Fund Contribution Rate (%)',
            employeeContribution: 'Employee Contribution (%)',
            employerMatching: 'Employer Matching (%)',
            partnerContributions: 'Partner Contributions',
            partner1Contributions: 'Partner 1 Contributions',
            partner2Contributions: 'Partner 2 Contributions',
            trainingFundLimits: 'Training Fund Limits',
            salaryThreshold: 'Salary Threshold (₪)',
            belowThreshold: 'Below Threshold (%)',
            aboveThreshold: 'Above Threshold (%)',
            currentSalaryStatus: 'Current Salary Status',
            israel: 'Israel',
            usa: 'United States',
            uk: 'United Kingdom',
            france: 'France',
            germany: 'Germany',
            australia: 'Australia',
            comingSoon: 'Coming Soon...',
            defaultRates: 'Default Rates',
            customRates: 'Custom Rates'
        }
    };

    const t = content[language];

    // Country-specific contribution rates with employee/employer breakdown
    const countryRates = {
        israel: { 
            pension: 17.5, 
            trainingFund: 7.5,
            employee: 7.0,
            employer: 10.5,
            trainingFundThreshold: 45000, // Monthly salary threshold in ILS
            trainingFundBelowThreshold: 7.5,
            trainingFundAboveThreshold: 2.5
        },
        usa: { 
            pension: 12.0, 
            trainingFund: 0,
            employee: 6.0,
            employer: 6.0
        },
        uk: { 
            pension: 8.0, 
            trainingFund: 0,
            employee: 4.0,
            employer: 4.0
        },
        france: { 
            pension: 15.0, 
            trainingFund: 0,
            employee: 7.5,
            employer: 7.5
        },
        germany: { 
            pension: 18.6, 
            trainingFund: 0,
            employee: 9.3,
            employer: 9.3
        },
        australia: { 
            pension: 11.0, 
            trainingFund: 0,
            employee: 0,
            employer: 11.0
        }
    };

    const selectedCountry = inputs.taxCountry || 'israel';
    const defaultRates = countryRates[selectedCountry] || countryRates.israel;

    // Calculate effective training fund rate based on salary threshold
    const calculateTrainingFundRate = (monthlySalary) => {
        if (selectedCountry !== 'israel') return defaultRates.trainingFund;
        
        const threshold = defaultRates.trainingFundThreshold || 45000;
        const belowRate = defaultRates.trainingFundBelowThreshold || 7.5;
        const aboveRate = defaultRates.trainingFundAboveThreshold || 2.5;
        
        if (monthlySalary <= threshold) {
            return belowRate;
        } else {
            // Blended rate: full rate up to threshold, reduced rate above
            const belowThresholdAmount = threshold * (belowRate / 100);
            const aboveThresholdAmount = (monthlySalary - threshold) * (aboveRate / 100);
            return ((belowThresholdAmount + aboveThresholdAmount) / monthlySalary) * 100;
        }
    };

    // Get salary status for display
    const getSalaryStatus = (monthlySalary) => {
        if (selectedCountry !== 'israel') return '';
        const threshold = defaultRates.trainingFundThreshold || 45000;
        if (monthlySalary <= threshold) {
            return language === 'he' ? 'מתחת לסף - 7.5%' : 'Below threshold - 7.5%';
        } else {
            const effectiveRate = calculateTrainingFundRate(monthlySalary);
            return language === 'he' ? 
                `מעל הסף - ${effectiveRate.toFixed(1)}% ממוצע` : 
                `Above threshold - ${effectiveRate.toFixed(1)}% average`;
        }
    };

    const handleCountryChange = (country) => {
        const rates = countryRates[country];
        setInputs({
            ...inputs, 
            taxCountry: country,
            pensionContributionRate: rates.pension,
            trainingFundContributionRate: rates.trainingFund
        });
    };

    // Using React.createElement pattern for component rendering
    return createElement('div', { className: "space-y-8" }, [
        // Info Panel (moved to top)
        createElement('div', { 
            key: 'info-panel',
            className: "bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200" 
        }, [
            createElement('div', { 
                key: 'info-icon',
                className: "text-2xl mb-2" 
            }, 'ℹ️'),
            createElement('h4', { 
                key: 'info-title',
                className: "text-lg font-semibold text-blue-700 mb-2" 
            }, language === 'he' ? 'מידע על הפקדות פנסיה' : 'Pension Contribution Information'),
            createElement('p', { 
                key: 'info-text',
                className: "text-blue-600 text-sm" 
            }, language === 'he' ? 
                'האחוזים מותאמים לחוקי המדינה שנבחרה. בזוגות, כל בן זוג יכול להיות עם הגדרות שונות. ניתן לשנות ידנית לפי המצב האישי.' :
                'Rates are adjusted for the selected country\'s laws. For couples, each partner can have different settings. Can be customized based on your personal situation.')
        ]),

        // Country Selection
        createElement('div', { key: 'country-section' }, [
            createElement('h3', { 
                key: 'country-title',
                className: "text-xl font-semibold text-gray-700 mb-4 flex items-center" 
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '🌍'),
                t.country
            ]),
            createElement('div', { 
                key: 'country-grid',
                className: "grid grid-cols-2 md:grid-cols-3 gap-4" 
            }, [
                // Israel
                createElement('button', {
                    key: 'israel',
                    type: 'button',
                    onClick: () => handleCountryChange('israel'),
                    className: `p-4 rounded-xl border-2 transition-all text-center ${
                        selectedCountry === 'israel' 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-200 bg-white hover:border-blue-300'
                    }`
                }, [
                    createElement('div', { key: 'flag', className: "text-2xl mb-2" }, '🇮🇱'),
                    createElement('div', { key: 'name', className: "font-medium" }, t.israel),
                    createElement('div', { key: 'rate', className: "text-xs text-gray-500" }, '17.5% pension')
                ]),
                
                // USA
                createElement('button', {
                    key: 'usa',
                    type: 'button',
                    onClick: () => handleCountryChange('usa'),
                    className: `p-4 rounded-xl border-2 transition-all text-center ${
                        selectedCountry === 'usa' 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-200 bg-white hover:border-blue-300'
                    }`
                }, [
                    createElement('div', { key: 'flag', className: "text-2xl mb-2" }, '🇺🇸'),
                    createElement('div', { key: 'name', className: "font-medium" }, t.usa),
                    createElement('div', { key: 'rate', className: "text-xs text-gray-500" }, '12% 401k')
                ]),
                
                // UK
                createElement('button', {
                    key: 'uk',
                    type: 'button',
                    onClick: () => handleCountryChange('uk'),
                    className: `p-4 rounded-xl border-2 transition-all text-center ${
                        selectedCountry === 'uk' 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-200 bg-white hover:border-blue-300'
                    }`
                }, [
                    createElement('div', { key: 'flag', className: "text-2xl mb-2" }, '🇬🇧'),
                    createElement('div', { key: 'name', className: "font-medium" }, t.uk),
                    createElement('div', { key: 'rate', className: "text-xs text-gray-500" }, '8% auto-enroll')
                ]),
                
                // Other countries (coming soon)
                createElement('div', {
                    key: 'others',
                    className: "col-span-2 md:col-span-3 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 text-center"
                }, [
                    createElement('div', { key: 'flags', className: "text-xl mb-2" }, '🇫🇷 🇩🇪 🇦🇺'),
                    createElement('div', { key: 'text', className: "text-gray-600" }, t.comingSoon)
                ])
            ])
        ]),

        // Contribution Rates - Single Planning
        (!inputs.planningType || inputs.planningType === 'single') && createElement('div', { key: 'single-rates-section' }, [
            createElement('h3', { 
                key: 'single-rates-title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center" 
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '💰'),
                t.contributionSettings
            ]),
            createElement('div', { 
                key: 'single-rates-grid',
                className: "grid grid-cols-1 md:grid-cols-2 gap-6" 
            }, [
                // Employee Pension Contribution
                createElement('div', { 
                    key: 'employee-contribution',
                    className: "bg-blue-50 rounded-xl p-6 border border-blue-200" 
                }, [
                    createElement('label', { 
                        key: 'employee-label',
                        className: "block text-lg font-medium text-gray-700 mb-2" 
                    }, t.employeeContribution),
                    createElement('input', {
                        key: 'employee-input',
                        type: 'number',
                        step: '0.1',
                        value: inputs.employeePensionRate || defaultRates.employee,
                        onChange: (e) => setInputs({...inputs, employeePensionRate: parseFloat(e.target.value) || 0}),
                        className: "w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    }),
                    createElement('p', { 
                        key: 'employee-help',
                        className: "mt-2 text-sm text-blue-600" 
                    }, `${t.defaultRates}: ${defaultRates.employee}%`)
                ]),
                
                // Employer Matching
                createElement('div', { 
                    key: 'employer-matching',
                    className: "bg-green-50 rounded-xl p-6 border border-green-200" 
                }, [
                    createElement('label', { 
                        key: 'employer-label',
                        className: "block text-lg font-medium text-gray-700 mb-2" 
                    }, t.employerMatching),
                    createElement('input', {
                        key: 'employer-input',
                        type: 'number',
                        step: '0.1',
                        value: inputs.employerPensionRate || defaultRates.employer,
                        onChange: (e) => setInputs({...inputs, employerPensionRate: parseFloat(e.target.value) || 0}),
                        className: "w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    }),
                    createElement('p', { 
                        key: 'employer-help',
                        className: "mt-2 text-sm text-green-600" 
                    }, `${t.defaultRates}: ${defaultRates.employer}%`)
                ]),
                
                // Training Fund Contribution
                selectedCountry === 'israel' && createElement('div', { 
                    key: 'training-fund-contribution',
                    className: "bg-yellow-50 rounded-xl p-6 border border-yellow-200" 
                }, [
                    createElement('label', { 
                        key: 'training-fund-label',
                        className: "block text-lg font-medium text-gray-700 mb-2" 
                    }, t.trainingFundRate),
                    createElement('input', {
                        key: 'training-fund-input',
                        type: 'number',
                        step: '0.1',
                        value: inputs.trainingFundContributionRate || defaultRates.trainingFund,
                        onChange: (e) => setInputs({...inputs, trainingFundContributionRate: parseFloat(e.target.value) || 0}),
                        className: "w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    }),
                    createElement('p', { 
                        key: 'training-fund-help',
                        className: "mt-2 text-sm text-yellow-600" 
                    }, `${t.defaultRates}: ${defaultRates.trainingFund}%`)
                ])
            ])
        ]),

        // Contribution Rates - Couple Planning (Per Partner)
        inputs.planningType === 'couple' && createElement('div', { key: 'couple-rates-section' }, [
            createElement('h3', { 
                key: 'couple-rates-title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center" 
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '💰'),
                t.contributionSettings
            ]),
            
            createElement('div', { 
                key: 'couple-rates-grid',
                className: "grid grid-cols-1 lg:grid-cols-2 gap-8" 
            }, [
                // Main Person Contribution Rates
                createElement('div', { 
                    key: 'main-contribution-rates',
                    className: "bg-blue-50 rounded-xl p-6 border border-blue-200" 
                }, [
                    createElement('h4', { 
                        key: 'main-contribution-title',
                        className: "text-lg font-semibold text-blue-700 mb-4" 
                    }, language === 'he' ? 'הפקדות עיקריות' : 'Main Person Contributions'),
                    createElement('div', { key: 'main-contribution-fields', className: "space-y-4" }, [
                        createElement('div', { key: 'main-employee' }, [
                            createElement('label', { 
                                key: 'main-employee-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.employeeContribution),
                            createElement('input', {
                                key: 'main-employee-input',
                                type: 'number',
                                step: '0.1',
                                value: inputs.employeePensionRate || defaultRates.employee,
                                onChange: (e) => setInputs({...inputs, employeePensionRate: parseFloat(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            }),
                            createElement('p', { 
                                key: 'main-employee-help',
                                className: "mt-1 text-xs text-blue-600" 
                            }, `${t.defaultRates}: ${defaultRates.employee}%`)
                        ]),
                        createElement('div', { key: 'main-employer' }, [
                            createElement('label', { 
                                key: 'main-employer-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.employerMatching),
                            createElement('input', {
                                key: 'main-employer-input',
                                type: 'number',
                                step: '0.1',
                                value: inputs.employerPensionRate || defaultRates.employer,
                                onChange: (e) => setInputs({...inputs, employerPensionRate: parseFloat(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            }),
                            createElement('p', { 
                                key: 'main-employer-help',
                                className: "mt-1 text-xs text-blue-600" 
                            }, `${t.defaultRates}: ${defaultRates.employer}%`)
                        ]),
                        selectedCountry === 'israel' && createElement('div', { key: 'main-training' }, [
                            createElement('label', { 
                                key: 'main-training-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.trainingFundRate),
                            createElement('input', {
                                key: 'main-training-input',
                                type: 'number',
                                step: '0.1',
                                value: inputs.trainingFundContributionRate || defaultRates.trainingFund,
                                onChange: (e) => setInputs({...inputs, trainingFundContributionRate: parseFloat(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            }),
                            createElement('p', { 
                                key: 'main-training-help',
                                className: "mt-1 text-xs text-blue-600" 
                            }, `${t.defaultRates}: ${defaultRates.trainingFund}%`)
                        ])
                    ])
                ]),
                
                // Partner Contribution Rates (using existing partner contribution fields)
                createElement('div', { 
                    key: 'partner-contribution-rates',
                    className: "bg-green-50 rounded-xl p-6 border border-green-200" 
                }, [
                    createElement('h4', { 
                        key: 'partner-contribution-title',
                        className: "text-lg font-semibold text-green-700 mb-4" 
                    }, language === 'he' ? 'הפקדות בן/בת זוג' : 'Partner Contributions'),
                    createElement('div', { key: 'partner-contribution-fields', className: "space-y-4" }, [
                        createElement('div', { key: 'partner-employee' }, [
                            createElement('label', { 
                                key: 'partner-employee-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.employeeContribution),
                            createElement('input', {
                                key: 'partner-employee-input',
                                type: 'number',
                                step: '0.1',
                                value: inputs.partner1EmployeeRate || defaultRates.employee,
                                onChange: (e) => setInputs({...inputs, partner1EmployeeRate: parseFloat(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            }),
                            createElement('p', { 
                                key: 'partner-employee-help',
                                className: "mt-1 text-xs text-green-600" 
                            }, `${t.defaultRates}: ${defaultRates.employee}%`)
                        ]),
                        createElement('div', { key: 'partner-employer' }, [
                            createElement('label', { 
                                key: 'partner-employer-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.employerMatching),
                            createElement('input', {
                                key: 'partner-employer-input',
                                type: 'number',
                                step: '0.1',
                                value: inputs.partner1EmployerRate || defaultRates.employer,
                                onChange: (e) => setInputs({...inputs, partner1EmployerRate: parseFloat(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            }),
                            createElement('p', { 
                                key: 'partner-employer-help',
                                className: "mt-1 text-xs text-green-600" 
                            }, `${t.defaultRates}: ${defaultRates.employer}%`)
                        ]),
                        selectedCountry === 'israel' && createElement('div', { key: 'partner-training' }, [
                            createElement('label', { 
                                key: 'partner-training-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.trainingFundRate),
                            createElement('input', {
                                key: 'partner-training-input',
                                type: 'number',
                                step: '0.1',
                                value: inputs.partner1TrainingFundRate || defaultRates.trainingFund,
                                onChange: (e) => setInputs({...inputs, partner1TrainingFundRate: parseFloat(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            }),
                            createElement('p', { 
                                key: 'partner-training-help',
                                className: "mt-1 text-xs text-green-600" 
                            }, `${t.defaultRates}: ${defaultRates.trainingFund}%`)
                        ])
                    ])
                ])
            ])
        ]),

        // Training Fund Limits (Israel only, single mode only)
        selectedCountry === 'israel' && (!inputs.planningType || inputs.planningType === 'single') && createElement('div', { key: 'training-fund-limits-section' }, [
            createElement('h3', { 
                key: 'training-fund-limits-title',
                className: "text-xl font-semibold text-gray-700 mb-4 flex items-center" 
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '📊'),
                t.trainingFundLimits
            ]),
            createElement('div', { 
                key: 'training-fund-limits-grid',
                className: "grid grid-cols-1 md:grid-cols-3 gap-6" 
            }, [
                // Salary Threshold
                createElement('div', { 
                    key: 'salary-threshold',
                    className: "bg-yellow-50 rounded-xl p-6 border border-yellow-200" 
                }, [
                    createElement('label', { 
                        key: 'threshold-label',
                        className: "block text-lg font-medium text-gray-700 mb-2" 
                    }, t.salaryThreshold),
                    createElement('input', {
                        key: 'threshold-input',
                        type: 'number',
                        value: inputs.trainingFundThreshold || defaultRates.trainingFundThreshold,
                        onChange: (e) => setInputs({...inputs, trainingFundThreshold: parseInt(e.target.value) || 0}),
                        className: "w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    }),
                    createElement('p', { 
                        key: 'threshold-help',
                        className: "mt-2 text-sm text-yellow-600" 
                    }, `${language === 'he' ? 'ברירת מחדל' : 'Default'}: ₪${defaultRates.trainingFundThreshold?.toLocaleString()}`)
                ]),
                
                // Below Threshold Rate
                createElement('div', { 
                    key: 'below-threshold-rate',
                    className: "bg-green-50 rounded-xl p-6 border border-green-200" 
                }, [
                    createElement('label', { 
                        key: 'below-label',
                        className: "block text-lg font-medium text-gray-700 mb-2" 
                    }, t.belowThreshold),
                    createElement('input', {
                        key: 'below-input',
                        type: 'number',
                        step: '0.1',
                        value: inputs.trainingFundBelowThreshold || defaultRates.trainingFundBelowThreshold,
                        onChange: (e) => setInputs({...inputs, trainingFundBelowThreshold: parseFloat(e.target.value) || 0}),
                        className: "w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    }),
                    createElement('p', { 
                        key: 'below-help',
                        className: "mt-2 text-sm text-green-600" 
                    }, `${language === 'he' ? 'ברירת מחדל' : 'Default'}: ${defaultRates.trainingFundBelowThreshold}%`)
                ]),
                
                // Above Threshold Rate
                createElement('div', { 
                    key: 'above-threshold-rate',
                    className: "bg-orange-50 rounded-xl p-6 border border-orange-200" 
                }, [
                    createElement('label', { 
                        key: 'above-label',
                        className: "block text-lg font-medium text-gray-700 mb-2" 
                    }, t.aboveThreshold),
                    createElement('input', {
                        key: 'above-input',
                        type: 'number',
                        step: '0.1',
                        value: inputs.trainingFundAboveThreshold || defaultRates.trainingFundAboveThreshold,
                        onChange: (e) => setInputs({...inputs, trainingFundAboveThreshold: parseFloat(e.target.value) || 0}),
                        className: "w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    }),
                    createElement('p', { 
                        key: 'above-help',
                        className: "mt-2 text-sm text-orange-600" 
                    }, `${language === 'he' ? 'ברירת מחדל' : 'Default'}: ${defaultRates.trainingFundAboveThreshold}%`)
                ])
            ]),
            
            // Current Salary Status Display
            (inputs.currentMonthlySalary || inputs.partner1Salary || inputs.partner2Salary) && createElement('div', { 
                key: 'salary-status',
                className: "mt-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200" 
            }, [
                createElement('h4', { 
                    key: 'status-title',
                    className: "text-lg font-semibold text-blue-700 mb-4" 
                }, t.currentSalaryStatus),
                createElement('div', { 
                    key: 'salary-status-grid',
                    className: "space-y-3" 
                }, [
                    // Main salary status
                    inputs.currentMonthlySalary && createElement('div', { 
                        key: 'main-salary-status',
                        className: "flex justify-between items-center p-3 bg-white rounded-lg" 
                    }, [
                        createElement('span', { key: 'main-label', className: "font-medium" }, 
                            language === 'he' ? 'משכורת עיקרית' : 'Main Salary'),
                        createElement('span', { key: 'main-status', className: "text-blue-600" }, 
                            getSalaryStatus(inputs.currentMonthlySalary))
                    ]),
                    
                    // Partner 1 salary status
                    inputs.planningType === 'couple' && inputs.partner1Salary && createElement('div', { 
                        key: 'partner1-salary-status',
                        className: "flex justify-between items-center p-3 bg-white rounded-lg" 
                    }, [
                        createElement('span', { key: 'partner1-label', className: "font-medium" }, 
                            inputs.partner1Name || (language === 'he' ? 'בן/בת זוג 1' : 'Partner 1')),
                        createElement('span', { key: 'partner1-status', className: "text-pink-600" }, 
                            getSalaryStatus(inputs.partner1Salary))
                    ]),
                    
                    // Partner 2 salary status
                    inputs.planningType === 'couple' && inputs.partner2Salary && createElement('div', { 
                        key: 'partner2-salary-status',
                        className: "flex justify-between items-center p-3 bg-white rounded-lg" 
                    }, [
                        createElement('span', { key: 'partner2-label', className: "font-medium" }, 
                            inputs.partner2Name || (language === 'he' ? 'בן/בת זוג 2' : 'Partner 2')),
                        createElement('span', { key: 'partner2-status', className: "text-purple-600" }, 
                            getSalaryStatus(inputs.partner2Salary))
                    ])
                ])
            ])
        ]),

        // Partner Contributions (if couple)
        inputs.planningType === 'couple' && createElement('div', { key: 'partner-contributions-section' }, [
            createElement('h3', { 
                key: 'partner-contributions-title',
                className: "text-xl font-semibold text-gray-700 mb-4 flex items-center" 
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '👫'),
                t.partnerContributions
            ]),
            createElement('div', { 
                key: 'partner-contributions-grid',
                className: "grid grid-cols-1 lg:grid-cols-2 gap-8" 
            }, [
                // Partner 1 Contributions
                createElement('div', { 
                    key: 'partner1-contributions',
                    className: "bg-pink-50 rounded-xl p-6 border border-pink-200" 
                }, [
                    createElement('h4', { 
                        key: 'partner1-title',
                        className: "text-lg font-semibold text-pink-700 mb-4" 
                    }, inputs.partner1Name || t.partner1Contributions),
                    
                    createElement('div', { key: 'partner1-rates', className: "space-y-4" }, [
                        // Partner 1 Employee Rate
                        createElement('div', { key: 'partner1-employee' }, [
                            createElement('label', { 
                                key: 'partner1-employee-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.employeeContribution),
                            createElement('input', {
                                key: 'partner1-employee-input',
                                type: 'number',
                                step: '0.1',
                                value: inputs.partner1EmployeeRate || defaultRates.employee,
                                onChange: (e) => setInputs({...inputs, partner1EmployeeRate: parseFloat(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                            })
                        ]),
                        
                        // Partner 1 Employer Matching
                        createElement('div', { key: 'partner1-employer' }, [
                            createElement('label', { 
                                key: 'partner1-employer-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.employerMatching),
                            createElement('input', {
                                key: 'partner1-employer-input',
                                type: 'number',
                                step: '0.1',
                                value: inputs.partner1EmployerRate || defaultRates.employer,
                                onChange: (e) => setInputs({...inputs, partner1EmployerRate: parseFloat(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                            })
                        ]),
                        
                        // Partner 1 Training Fund (if Israel)
                        selectedCountry === 'israel' && createElement('div', { key: 'partner1-training' }, [
                            createElement('label', { 
                                key: 'partner1-training-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.trainingFundRate),
                            createElement('input', {
                                key: 'partner1-training-input',
                                type: 'number',
                                step: '0.1',
                                value: inputs.partner1TrainingFundRate || defaultRates.trainingFund,
                                onChange: (e) => setInputs({...inputs, partner1TrainingFundRate: parseFloat(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                            })
                        ])
                    ])
                ]),
                
                // Partner 2 Contributions
                createElement('div', { 
                    key: 'partner2-contributions',
                    className: "bg-purple-50 rounded-xl p-6 border border-purple-200" 
                }, [
                    createElement('h4', { 
                        key: 'partner2-title',
                        className: "text-lg font-semibold text-purple-700 mb-4" 
                    }, inputs.partner2Name || t.partner2Contributions),
                    
                    createElement('div', { key: 'partner2-rates', className: "space-y-4" }, [
                        // Partner 2 Employee Rate
                        createElement('div', { key: 'partner2-employee' }, [
                            createElement('label', { 
                                key: 'partner2-employee-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.employeeContribution),
                            createElement('input', {
                                key: 'partner2-employee-input',
                                type: 'number',
                                step: '0.1',
                                value: inputs.partner2EmployeeRate || defaultRates.employee,
                                onChange: (e) => setInputs({...inputs, partner2EmployeeRate: parseFloat(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            })
                        ]),
                        
                        // Partner 2 Employer Matching
                        createElement('div', { key: 'partner2-employer' }, [
                            createElement('label', { 
                                key: 'partner2-employer-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.employerMatching),
                            createElement('input', {
                                key: 'partner2-employer-input',
                                type: 'number',
                                step: '0.1',
                                value: inputs.partner2EmployerRate || defaultRates.employer,
                                onChange: (e) => setInputs({...inputs, partner2EmployerRate: parseFloat(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            })
                        ]),
                        
                        // Partner 2 Training Fund (if Israel)
                        selectedCountry === 'israel' && createElement('div', { key: 'partner2-training' }, [
                            createElement('label', { 
                                key: 'partner2-training-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.trainingFundRate),
                            createElement('input', {
                                key: 'partner2-training-input',
                                type: 'number',
                                step: '0.1',
                                value: inputs.partner2TrainingFundRate || defaultRates.trainingFund,
                                onChange: (e) => setInputs({...inputs, partner2TrainingFundRate: parseFloat(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            })
                        ])
                    ])
                ])
            ])
        ])
    ]);
};

// Export to window for global access
window.WizardStepContributions = WizardStepContributions;
console.log('✅ WizardStepContributions component loaded successfully');