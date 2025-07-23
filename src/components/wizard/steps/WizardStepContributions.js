// WizardStepContributions.js - Step 4: Contribution Settings
// Country-specific pension contribution rules and settings

const WizardStepContributions = ({ inputs, setInputs, language = 'en', workingCurrency = 'ILS' }) => {
    // Component uses React.createElement for rendering
    const createElement = React.createElement;
    
    // Percentage validation function (0-100)
    const validatePercentage = (value) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return 0;
        if (numValue < 0) return 0;
        if (numValue > 100) return 100;
        return numValue;
    };
    
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
            salaryThreshold: 'סף משכורת לטבות מס (₪)',
            belowThreshold: 'מתחת לסף - מוטב מס (%)',
            aboveThreshold: 'מעל הסף - חייב במס (%)',
            currentSalaryStatus: 'סטטוס משכורת נוכחי',
            taxBenefits: 'הטבות מס',
            taxableIncome: 'הכנסה חייבת במס',
            contribution2024: 'הפקדה לפי תקנות 2024',
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
            trainingFundLimits: 'Training Fund Tax Limits',
            salaryThreshold: 'Salary Threshold for Tax Benefits (₪)',
            belowThreshold: 'Below Threshold - Tax Benefited (%)',
            aboveThreshold: 'Above Threshold - Taxable (%)',
            currentSalaryStatus: 'Current Salary Status',
            taxBenefits: 'Tax Benefits',
            taxableIncome: 'Taxable Income',
            contribution2024: 'Contribution per 2024 Regulations',
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
            pension: 21.333, // Total: 7% employee + 14.333% employer 
            trainingFund: 10.0, // Total: 7.5% employer + 2.5% employee
            employee: 7.0,
            employer: 14.333,
            trainingFundThreshold: 15792, // Monthly salary threshold in ILS for 2024
            trainingFundBelowThreshold: 10.0, // 7.5% employer + 2.5% employee = 10%
            trainingFundAboveThreshold: 0, // Above threshold: taxed as income, no deduction
            trainingFundEmployeeRate: 2.5,
            trainingFundEmployerRate: 7.5,
            maxMonthlyContribution: 1579 // Maximum monthly contribution for tax benefits (10% of 15,792)
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

    // Training Fund Rate Calculator for Israeli system
    const calculateTrainingFundRate = (salary, isAboveCeiling = false) => {
        const threshold = 15792; // Israeli training fund threshold for 2024
        
        if (!salary || salary <= 0) {
            return 10.0; // Default total rate
        }
        
        if (isAboveCeiling || salary > threshold) {
            // Above threshold: 7.5% employer + 2.5% employee = 10%
            return {
                total: 10.0,
                employee: 2.5,
                employer: 7.5
            };
        } else {
            // Below threshold: 7.5% employer only = 7.5%
            return {
                total: 7.5,
                employee: 0,
                employer: 7.5
            };
        }
    };

    // Calculate training fund contribution and tax treatment based on 2024 Israeli regulations
    // Enhanced to support partner-specific parameters
    const calculateTrainingFundContribution = (monthlySalary, isUnlimited = false, employeeRate = 2.5, employerRate = 7.5) => {
        if (selectedCountry !== 'israel') return {
            totalContribution: monthlySalary * (defaultRates.trainingFund / 100),
            taxDeductible: monthlySalary * (defaultRates.trainingFund / 100),
            taxableAmount: 0,
            effectiveRate: defaultRates.trainingFund
        };
        
        const threshold = defaultRates.trainingFundThreshold || 15792;
        const maxContribution = defaultRates.maxMonthlyContribution || 1579;
        const totalRate = (employeeRate + employerRate) / 100 || 0.10;
        
        // If unlimited contribution is enabled, apply rate to full salary
        if (isUnlimited) {
            const totalContribution = monthlySalary * totalRate;
            return {
                totalContribution,
                taxDeductible: totalContribution,
                taxableAmount: 0,
                effectiveRate: employeeRate + employerRate,
                salaryStatus: 'unlimited',
                employeeRate,
                employerRate
            };
        }
        
        // Calculate total contribution (employer continues to contribute above threshold)
        const totalContribution = monthlySalary * totalRate;
        
        if (monthlySalary <= threshold) {
            // Below threshold: full tax benefits
            return {
                totalContribution,
                taxDeductible: totalContribution,
                taxableAmount: 0,
                effectiveRate: employeeRate + employerRate,
                salaryStatus: 'below_threshold',
                employeeRate,
                employerRate
            };
        } else {
            // Above threshold: only contribution up to threshold gets tax benefits
            const taxDeductibleContribution = maxContribution;
            const excessContribution = totalContribution - taxDeductibleContribution;
            
            return {
                totalContribution,
                taxDeductible: taxDeductibleContribution,
                taxableAmount: excessContribution, // This amount is taxed as income
                effectiveRate: (totalContribution / monthlySalary) * 100,
                salaryStatus: 'above_threshold',
                threshold: threshold,
                excessSalary: monthlySalary - threshold,
                employeeRate,
                employerRate
            };
        }
    };

    // Get detailed salary status for display - enhanced for partner-specific parameters
    const getSalaryStatus = (monthlySalary, isUnlimited = false, employeeRate = 2.5, employerRate = 7.5) => {
        if (selectedCountry !== 'israel') return '';
        
        const contribution = calculateTrainingFundContribution(monthlySalary, isUnlimited, employeeRate, employerRate);
        const threshold = defaultRates.trainingFundThreshold || 15792;
        
        if (contribution.salaryStatus === 'unlimited') {
            return language === 'he' ? 
                `על כל הכנסה - ${employeeRate + employerRate}% מוטב מס` : 
                `On full salary - ${employeeRate + employerRate}% tax-benefited`;
        } else if (contribution.salaryStatus === 'below_threshold') {
            return language === 'he' ? 
                `מתחת לסף (₪${threshold.toLocaleString()}) - ${employeeRate + employerRate}% מוטב מס` : 
                `Below threshold (₪${threshold.toLocaleString()}) - ${employeeRate + employerRate}% tax-benefited`;
        } else {
            const taxableAmount = contribution.taxableAmount || 0;
            return language === 'he' ? 
                `מעל הסף - ₪${contribution.taxDeductible} מוטב מס, ₪${taxableAmount.toFixed(0)} חייב במס` : 
                `Above threshold - ₪${contribution.taxDeductible} tax-benefited, ₪${taxableAmount.toFixed(0)} taxable`;
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

    // Helper function to render partner-specific Training Fund card
    const renderPartnerTrainingFundCard = (partnerKey, partnerName, partnerSalary, colorScheme) => {
        const unlimitedField = `${partnerKey}TrainingFundUnlimited`;
        const employeeRateField = `${partnerKey}TrainingFundEmployeeRate`;
        const employerRateField = `${partnerKey}TrainingFundEmployerRate`;
        
        const isUnlimited = inputs[unlimitedField] || false;
        const employeeRate = inputs[employeeRateField] || 2.5;
        const employerRate = inputs[employerRateField] || 7.5;
        
        const statusText = getSalaryStatus(partnerSalary, isUnlimited, employeeRate, employerRate);
        
        return createElement('div', {
            key: `${partnerKey}-training-fund-card`,
            className: `bg-gradient-to-r ${colorScheme.background} rounded-xl p-6 border ${colorScheme.border}`
        }, [
            // Partner name header
            createElement('h4', {
                key: 'partner-header',
                className: `text-lg font-semibold ${colorScheme.text} mb-4 flex items-center`
            }, [
                createElement('span', { key: 'icon', className: "mr-2 text-xl" }, '📊'),
                partnerName || (partnerKey === 'partner1' ? 
                    (language === 'he' ? 'בן/בת זוג ראשי' : 'Primary Partner') :
                    (language === 'he' ? 'בן/בת זוג שני' : 'Secondary Partner'))
            ]),
            
            // Unlimited contribution checkbox
            createElement('div', {
                key: 'unlimited-checkbox',
                className: "mb-4"
            }, [
                createElement('label', {
                    key: 'checkbox-label',
                    className: "flex items-center cursor-pointer"
                }, [
                    createElement('input', {
                        key: 'checkbox-input',
                        type: 'checkbox',
                        checked: isUnlimited,
                        onChange: (e) => setInputs({...inputs, [unlimitedField]: e.target.checked}),
                        className: `mr-3 w-4 h-4 ${colorScheme.checkbox} rounded focus:ring-2 focus:ring-opacity-50`
                    }),
                    createElement('span', {
                        key: 'checkbox-text',
                        className: "text-sm font-medium text-gray-700"
                    }, language === 'he' ? 
                        'הפקדה על כל הכנסה (ללא הגבלת סף)' : 
                        'Contribute on full salary (no salary cap)')
                ])
            ]),
            
            // Contribution rates
            createElement('div', {
                key: 'contribution-rates',
                className: "bg-white rounded-lg p-4 border border-gray-200"
            }, [
                createElement('h5', {
                    key: 'rates-title',
                    className: "text-sm font-semibold text-gray-700 mb-3"
                }, language === 'he' ? 'שיעורי הפקדה:' : 'Contribution Rates:'),
                
                createElement('div', {
                    key: 'rates-grid',
                    className: "grid grid-cols-2 gap-3"
                }, [
                    // Employee rate
                    createElement('div', {
                        key: 'employee-rate',
                        className: `text-center p-3 ${colorScheme.employeeBox} rounded-lg`
                    }, [
                        createElement('div', { 
                            key: 'employee-label', 
                            className: `text-xs ${colorScheme.employeeText}` 
                        }, language === 'he' ? 'עובד' : 'Employee'),
                        createElement('div', { 
                            key: 'employee-value', 
                            className: `text-lg font-bold ${colorScheme.employeeText}` 
                        }, `${employeeRate}%`)
                    ]),
                    
                    // Employer rate
                    createElement('div', {
                        key: 'employer-rate',
                        className: `text-center p-3 ${colorScheme.employerBox} rounded-lg`
                    }, [
                        createElement('div', { 
                            key: 'employer-label', 
                            className: `text-xs ${colorScheme.employerText}` 
                        }, language === 'he' ? 'מעביד' : 'Employer'),
                        createElement('div', { 
                            key: 'employer-value', 
                            className: `text-lg font-bold ${colorScheme.employerText}` 
                        }, `${employerRate}%`)
                    ])
                ])
            ]),
            
            // Current salary status
            createElement('div', {
                key: 'salary-status',
                className: "mt-4 p-3 bg-gray-50 rounded-lg"
            }, [
                createElement('h6', {
                    key: 'status-title',
                    className: "text-xs font-semibold text-gray-700 mb-1"
                }, t.currentSalaryStatus),
                createElement('div', {
                    key: 'status-text',
                    className: `text-sm ${isUnlimited ? colorScheme.statusBlue : 
                        (partnerSalary > 15792 ? 'text-red-600' : 'text-green-600')}`
                }, statusText)
            ])
        ]);
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
                className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6" 
            }, [
                // Israel
                createElement('button', {
                    key: 'israel',
                    type: 'button',
                    onClick: () => handleCountryChange('israel'),
                    className: `p-4 min-h-[80px] rounded-xl border-2 transition-all text-center ${
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
                    className: `p-4 min-h-[80px] rounded-xl border-2 transition-all text-center ${
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
                    className: `p-4 min-h-[80px] rounded-xl border-2 transition-all text-center ${
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

        // Unified Contribution Settings Section (adapts to planning type)
        createElement('div', { key: 'contribution-settings-section' }, [
            createElement('h3', { 
                key: 'contribution-title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center" 
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '💰'),
                t.contributionSettings
            ]),

            // Single Planning Layout
            (!inputs.planningType || inputs.planningType === 'single') && createElement('div', { 
                key: 'single-layout',
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
                        min: '0',
                        max: '100',
                        value: inputs.employeePensionRate || defaultRates.employee,
                        onChange: (e) => setInputs({...inputs, employeePensionRate: validatePercentage(e.target.value)}),
                        className: "w-full p-3 md:p-4 text-base md:text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        min: '0',
                        max: '100',
                        value: inputs.employerPensionRate || defaultRates.employer,
                        onChange: (e) => setInputs({...inputs, employerPensionRate: validatePercentage(e.target.value)}),
                        className: "w-full p-3 md:p-4 text-base md:text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    }),
                    createElement('p', { 
                        key: 'employer-help',
                        className: "mt-2 text-sm text-green-600" 
                    }, `${t.defaultRates}: ${defaultRates.employer}%`)
                ]),
                
                // Training Fund Contribution (Israel only)
                selectedCountry === 'israel' && createElement('div', { 
                    key: 'training-fund-contribution',
                    className: "bg-yellow-50 rounded-xl p-6 border border-yellow-200 md:col-span-2" 
                }, [
                    createElement('label', { 
                        key: 'training-fund-label',
                        className: "block text-lg font-medium text-gray-700 mb-2" 
                    }, t.trainingFundRate),
                    createElement('input', {
                        key: 'training-fund-input',
                        type: 'number',
                        step: '0.1',
                        min: '0',
                        max: '100',
                        value: inputs.trainingFundContributionRate || defaultRates.trainingFund,
                        onChange: (e) => setInputs({...inputs, trainingFundContributionRate: validatePercentage(e.target.value)}),
                        className: "w-full p-3 md:p-4 text-base md:text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    }),
                    createElement('p', { 
                        key: 'training-fund-help',
                        className: "mt-2 text-sm text-yellow-600" 
                    }, `${t.defaultRates}: ${defaultRates.trainingFund}%`)
                ])
            ]),

            // Couple Planning Layout
            inputs.planningType === 'couple' && createElement('div', { 
                key: 'couple-layout',
                className: "grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8" 
            }, [
                // Main Person Contributions
                createElement('div', { 
                    key: 'main-contributions',
                    className: "bg-blue-50 rounded-xl p-6 border border-blue-200" 
                }, [
                    createElement('h4', { 
                        key: 'main-title',
                        className: "text-lg font-semibold text-blue-700 mb-4" 
                    }, inputs.userName || (language === 'he' ? 'הפקדות עיקריות' : 'Main Person Contributions')),
                    createElement('div', { key: 'main-fields', className: "space-y-4" }, [
                        createElement('div', { key: 'main-employee' }, [
                            createElement('label', { 
                                key: 'main-employee-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.employeeContribution),
                            createElement('input', {
                                key: 'main-employee-input',
                                type: 'number',
                                step: '0.1',
                                min: '0',
                                max: '100',
                                value: inputs.employeePensionRate || defaultRates.employee,
                                onChange: (e) => setInputs({...inputs, employeePensionRate: validatePercentage(e.target.value)}),
                                className: "w-full p-4 md:p-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                                min: '0',
                                max: '100',
                                value: inputs.employerPensionRate || defaultRates.employer,
                                onChange: (e) => setInputs({...inputs, employerPensionRate: validatePercentage(e.target.value)}),
                                className: "w-full p-4 md:p-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                                min: '0',
                                max: '100',
                                value: inputs.trainingFundContributionRate || defaultRates.trainingFund,
                                onChange: (e) => setInputs({...inputs, trainingFundContributionRate: validatePercentage(e.target.value)}),
                                className: "w-full p-4 md:p-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            }),
                            createElement('p', { 
                                key: 'main-training-help',
                                className: "mt-1 text-xs text-blue-600" 
                            }, `${t.defaultRates}: ${defaultRates.trainingFund}%`)
                        ])
                    ])
                ]),
                
                // Partner Contributions
                createElement('div', { 
                    key: 'partner-contributions',
                    className: "bg-green-50 rounded-xl p-6 border border-green-200" 
                }, [
                    createElement('h4', { 
                        key: 'partner-title',
                        className: "text-lg font-semibold text-green-700 mb-4" 
                    }, inputs.partnerName || (language === 'he' ? 'הפקדות בן/בת זוג' : 'Partner Contributions')),
                    createElement('div', { key: 'partner-fields', className: "space-y-4" }, [
                        createElement('div', { key: 'partner-employee' }, [
                            createElement('label', { 
                                key: 'partner-employee-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.employeeContribution),
                            createElement('input', {
                                key: 'partner-employee-input',
                                type: 'number',
                                step: '0.1',
                                min: '0',
                                max: '100',
                                value: inputs.partner1EmployeeRate || defaultRates.employee,
                                onChange: (e) => setInputs({...inputs, partner1EmployeeRate: validatePercentage(e.target.value)}),
                                className: "w-full p-4 md:p-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
                                min: '0',
                                max: '100',
                                value: inputs.partner1EmployerRate || defaultRates.employer,
                                onChange: (e) => setInputs({...inputs, partner1EmployerRate: validatePercentage(e.target.value)}),
                                className: "w-full p-4 md:p-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
                                min: '0',
                                max: '100',
                                value: inputs.partner1TrainingFundRate || defaultRates.trainingFund,
                                onChange: (e) => setInputs({...inputs, partner1TrainingFundRate: validatePercentage(e.target.value)}),
                                className: "w-full p-4 md:p-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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

        // Enhanced Training Fund System (Israel only) - Individual Partner Settings
        selectedCountry === 'israel' && inputs.planningType === 'couple' && createElement('div', { key: 'partner-training-fund-system' }, [
            createElement('h3', { 
                key: 'partner-training-fund-title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center" 
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '📊'),
                t.trainingFundLimits
            ]),
            
            createElement('div', {
                key: 'partner-training-fund-grid',
                className: "grid grid-cols-1 lg:grid-cols-2 gap-6"
            }, [
                // Partner 1 Training Fund Card
                renderPartnerTrainingFundCard(
                    'partner1',
                    inputs.userName,
                    inputs.partner1Salary || 0,
                    {
                        background: 'from-blue-50 to-blue-100',
                        border: 'border-blue-200',
                        text: 'text-blue-700',
                        checkbox: 'text-blue-600',
                        employeeBox: 'bg-blue-50',
                        employeeText: 'text-blue-600',
                        employerBox: 'bg-blue-100',
                        employerText: 'text-blue-700',
                        statusBlue: 'text-blue-600'
                    }
                ),
                
                // Partner 2 Training Fund Card
                renderPartnerTrainingFundCard(
                    'partner2',
                    inputs.partnerName,
                    inputs.partner2Salary || 0,
                    {
                        background: 'from-green-50 to-green-100',
                        border: 'border-green-200',
                        text: 'text-green-700',
                        checkbox: 'text-green-600',
                        employeeBox: 'bg-green-50',
                        employeeText: 'text-green-600',
                        employerBox: 'bg-green-100',
                        employerText: 'text-green-700',
                        statusBlue: 'text-green-600'
                    }
                )
            ])
        ]),

        // Single User Training Fund System (Israel only) - Simplified for single mode
        selectedCountry === 'israel' && inputs.planningType !== 'couple' && createElement('div', { key: 'single-training-fund-system' }, [
            createElement('h3', { 
                key: 'single-training-fund-title',
                className: "text-xl font-semibold text-gray-700 mb-4 flex items-center" 
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '📊'),
                t.trainingFundLimits
            ]),
            renderPartnerTrainingFundCard(
                'current',
                inputs.userName,
                inputs.currentMonthlySalary || 0,
                {
                    background: 'from-blue-50 to-purple-50',
                    border: 'border-blue-200',
                    text: 'text-blue-700',
                    checkbox: 'text-blue-600',
                    employeeBox: 'bg-blue-50',
                    employeeText: 'text-blue-600',
                    employerBox: 'bg-purple-50',
                    employerText: 'text-purple-700',
                    statusBlue: 'text-blue-600'
                }
            )
        ]),

    ]);
};


// Export to window for global access
window.WizardStepContributions = WizardStepContributions;

// Export functions for test compatibility - use existing component functions
window.calculateTrainingFundRate = calculateTrainingFundRate;

window.trainingFundThreshold = 15792; // Israeli training fund threshold for 2024

console.log('✅ WizardStepContributions component loaded successfully');