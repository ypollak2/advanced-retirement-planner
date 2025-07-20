// WizardStepContributions.js - Step 4: Contribution Settings
// Country-specific pension contribution rules and settings

const WizardStepContributions = ({ inputs, setInputs, language = 'en', workingCurrency = 'ILS' }) => {
    // Multi-language content
    const content = {
        he: {
            contributionSettings: 'הגדרות הפקדות',
            pensionContribution: 'הפקדות לפנסיה',
            trainingFundContribution: 'הפקדות לקרן השתלמות',
            country: 'מדינה',
            pensionRate: 'אחוז הפקדה לפנסיה (%)',
            trainingFundRate: 'אחוז הפקדה לקרן השתלמות (%)',
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

    // Country-specific contribution rates
    const countryRates = {
        israel: { pension: 17.5, trainingFund: 7.5 },
        usa: { pension: 12.0, trainingFund: 0 },
        uk: { pension: 8.0, trainingFund: 0 },
        france: { pension: 15.0, trainingFund: 0 },
        germany: { pension: 18.6, trainingFund: 0 },
        australia: { pension: 11.0, trainingFund: 0 }
    };

    const selectedCountry = inputs.taxCountry || 'israel';
    const defaultRates = countryRates[selectedCountry] || countryRates.israel;

    const handleCountryChange = (country) => {
        const rates = countryRates[country];
        setInputs({
            ...inputs, 
            taxCountry: country,
            pensionContributionRate: rates.pension,
            trainingFundContributionRate: rates.trainingFund
        });
    };

    return React.createElement('div', { className: "space-y-8" }, [
        // Country Selection
        React.createElement('div', { key: 'country-section' }, [
            React.createElement('h3', { 
                key: 'country-title',
                className: "text-xl font-semibold text-gray-700 mb-4 flex items-center" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '🌍'),
                t.country
            ]),
            React.createElement('div', { 
                key: 'country-grid',
                className: "grid grid-cols-2 md:grid-cols-3 gap-4" 
            }, [
                // Israel
                React.createElement('button', {
                    key: 'israel',
                    type: 'button',
                    onClick: () => handleCountryChange('israel'),
                    className: `p-4 rounded-xl border-2 transition-all text-center ${
                        selectedCountry === 'israel' 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-200 bg-white hover:border-blue-300'
                    }`
                }, [
                    React.createElement('div', { key: 'flag', className: "text-2xl mb-2" }, '🇮🇱'),
                    React.createElement('div', { key: 'name', className: "font-medium" }, t.israel),
                    React.createElement('div', { key: 'rate', className: "text-xs text-gray-500" }, '17.5% pension')
                ]),
                
                // USA
                React.createElement('button', {
                    key: 'usa',
                    type: 'button',
                    onClick: () => handleCountryChange('usa'),
                    className: `p-4 rounded-xl border-2 transition-all text-center ${
                        selectedCountry === 'usa' 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-200 bg-white hover:border-blue-300'
                    }`
                }, [
                    React.createElement('div', { key: 'flag', className: "text-2xl mb-2" }, '🇺🇸'),
                    React.createElement('div', { key: 'name', className: "font-medium" }, t.usa),
                    React.createElement('div', { key: 'rate', className: "text-xs text-gray-500" }, '12% 401k')
                ]),
                
                // UK
                React.createElement('button', {
                    key: 'uk',
                    type: 'button',
                    onClick: () => handleCountryChange('uk'),
                    className: `p-4 rounded-xl border-2 transition-all text-center ${
                        selectedCountry === 'uk' 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-200 bg-white hover:border-blue-300'
                    }`
                }, [
                    React.createElement('div', { key: 'flag', className: "text-2xl mb-2" }, '🇬🇧'),
                    React.createElement('div', { key: 'name', className: "font-medium" }, t.uk),
                    React.createElement('div', { key: 'rate', className: "text-xs text-gray-500" }, '8% auto-enroll')
                ]),
                
                // Other countries (coming soon)
                React.createElement('div', {
                    key: 'others',
                    className: "col-span-2 md:col-span-3 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 text-center"
                }, [
                    React.createElement('div', { key: 'flags', className: "text-xl mb-2" }, '🇫🇷 🇩🇪 🇦🇺'),
                    React.createElement('div', { key: 'text', className: "text-gray-600" }, t.comingSoon)
                ])
            ])
        ]),

        // Contribution Rates
        React.createElement('div', { key: 'rates-section' }, [
            React.createElement('h3', { 
                key: 'rates-title',
                className: "text-xl font-semibold text-gray-700 mb-4 flex items-center" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '💰'),
                t.contributionSettings
            ]),
            React.createElement('div', { 
                key: 'rates-grid',
                className: "grid grid-cols-1 md:grid-cols-2 gap-6" 
            }, [
                // Pension Contribution
                React.createElement('div', { 
                    key: 'pension-contribution',
                    className: "bg-blue-50 rounded-xl p-6 border border-blue-200" 
                }, [
                    React.createElement('label', { 
                        key: 'pension-label',
                        className: "block text-lg font-medium text-gray-700 mb-2" 
                    }, t.pensionRate),
                    React.createElement('input', {
                        key: 'pension-input',
                        type: 'number',
                        step: '0.1',
                        value: inputs.pensionContributionRate || defaultRates.pension,
                        onChange: (e) => setInputs({...inputs, pensionContributionRate: parseFloat(e.target.value) || 0}),
                        className: "w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    }),
                    React.createElement('p', { 
                        key: 'pension-help',
                        className: "mt-2 text-sm text-blue-600" 
                    }, `${t.defaultRates}: ${defaultRates.pension}%`)
                ]),
                
                // Training Fund Contribution
                selectedCountry === 'israel' && React.createElement('div', { 
                    key: 'training-fund-contribution',
                    className: "bg-green-50 rounded-xl p-6 border border-green-200" 
                }, [
                    React.createElement('label', { 
                        key: 'training-fund-label',
                        className: "block text-lg font-medium text-gray-700 mb-2" 
                    }, t.trainingFundRate),
                    React.createElement('input', {
                        key: 'training-fund-input',
                        type: 'number',
                        step: '0.1',
                        value: inputs.trainingFundContributionRate || defaultRates.trainingFund,
                        onChange: (e) => setInputs({...inputs, trainingFundContributionRate: parseFloat(e.target.value) || 0}),
                        className: "w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    }),
                    React.createElement('p', { 
                        key: 'training-fund-help',
                        className: "mt-2 text-sm text-green-600" 
                    }, `${t.defaultRates}: ${defaultRates.trainingFund}%`)
                ])
            ])
        ]),

        // Info Panel
        React.createElement('div', { 
            key: 'info-panel',
            className: "bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200" 
        }, [
            React.createElement('div', { 
                key: 'info-icon',
                className: "text-2xl mb-2" 
            }, 'ℹ️'),
            React.createElement('h4', { 
                key: 'info-title',
                className: "text-lg font-semibold text-blue-700 mb-2" 
            }, language === 'he' ? 'מידע על הפקדות' : 'Contribution Information'),
            React.createElement('p', { 
                key: 'info-text',
                className: "text-blue-600 text-sm" 
            }, language === 'he' ? 
                'האחוזים מותאמים לחוקי המדינה שנבחרה. ניתן לשנות ידנית לפי המצב האישי.' :
                'Rates are adjusted for the selected country\'s laws. Can be customized based on your personal situation.')
        ])
    ]);
};

// Export to window for global access
window.WizardStepContributions = WizardStepContributions;
console.log('✅ WizardStepContributions component loaded successfully');