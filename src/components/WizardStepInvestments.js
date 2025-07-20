// WizardStepInvestments.js - Step 6: Investment Preferences
// Risk tolerance, expected returns, and asset allocation

const WizardStepInvestments = ({ inputs, setInputs, language = 'en' }) => {
    const content = {
        he: {
            title: 'העדפות השקעה',
            expectedReturn: 'תשואה שנתית צפויה (%)',
            inflationRate: 'שיעור אינפלציה שנתי (%)',
            riskProfile: 'פרופיל סיכון',
            conservative: 'שמרני',
            moderate: 'מתון',
            aggressive: 'אגרסיבי',
            info: 'הגדרות אלו משפיעות על חישובי התשואה והסיכון'
        },
        en: {
            title: 'Investment Preferences',
            expectedReturn: 'Expected Annual Return (%)',
            inflationRate: 'Annual Inflation Rate (%)',
            riskProfile: 'Risk Profile',
            conservative: 'Conservative',
            moderate: 'Moderate',
            aggressive: 'Aggressive',
            info: 'These settings affect return and risk calculations'
        }
    };

    const t = content[language];

    const riskProfiles = {
        conservative: { return: 5, risk: 'Low' },
        moderate: { return: 7, risk: 'Medium' },
        aggressive: { return: 9, risk: 'High' }
    };

    return React.createElement('div', { className: "space-y-8" }, [
        React.createElement('div', { key: 'investments-section' }, [
            React.createElement('h3', { 
                key: 'title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '📈'),
                t.title
            ]),
            React.createElement('div', { 
                key: 'investments-grid',
                className: "grid grid-cols-1 md:grid-cols-2 gap-6" 
            }, [
                React.createElement('div', { key: 'expected-return' }, [
                    React.createElement('label', { 
                        key: 'return-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.expectedReturn),
                    React.createElement('input', {
                        key: 'return-input',
                        type: 'number',
                        step: '0.1',
                        value: inputs.expectedReturn || 7,
                        onChange: (e) => setInputs({...inputs, expectedReturn: parseFloat(e.target.value) || 0}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    })
                ]),
                React.createElement('div', { key: 'inflation-rate' }, [
                    React.createElement('label', { 
                        key: 'inflation-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.inflationRate),
                    React.createElement('input', {
                        key: 'inflation-input',
                        type: 'number',
                        step: '0.1',
                        value: inputs.inflationRate || 3,
                        onChange: (e) => setInputs({...inputs, inflationRate: parseFloat(e.target.value) || 0}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    })
                ])
            ]),
            React.createElement('div', { 
                key: 'risk-profiles',
                className: "mt-6" 
            }, [
                React.createElement('label', { 
                    key: 'risk-label',
                    className: "block text-sm font-medium text-gray-700 mb-4" 
                }, t.riskProfile),
                React.createElement('div', { 
                    key: 'risk-buttons',
                    className: "grid grid-cols-3 gap-4" 
                }, Object.keys(riskProfiles).map(profile => 
                    React.createElement('button', {
                        key: profile,
                        type: 'button',
                        onClick: () => setInputs({...inputs, riskProfile: profile, expectedReturn: riskProfiles[profile].return}),
                        className: `p-4 rounded-lg border-2 transition-all text-center ${
                            (inputs.riskProfile || 'moderate') === profile 
                                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                : 'border-gray-200 bg-white hover:border-blue-300'
                        }`
                    }, [
                        React.createElement('div', { key: 'name', className: "font-medium" }, t[profile]),
                        React.createElement('div', { key: 'return', className: "text-sm text-gray-500" }, `${riskProfiles[profile].return}%`)
                    ])
                ))
            ]),
            React.createElement('div', { 
                key: 'info',
                className: "bg-blue-50 rounded-xl p-4 border border-blue-200 mt-6" 
            }, [
                React.createElement('p', { 
                    key: 'info-text',
                    className: "text-blue-700 text-sm" 
                }, t.info)
            ])
        ])
    ]);
};

window.WizardStepInvestments = WizardStepInvestments;
console.log('✅ WizardStepInvestments component loaded successfully');