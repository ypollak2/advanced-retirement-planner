// WizardStepFees.js - Step 5: Management Fees
// Investment management costs and fees

const WizardStepFees = ({ inputs, setInputs, language = 'en' }) => {
    const content = {
        he: {
            title: 'דמי ניהול והוצאות',
            contributionFees: 'דמי ניהול מהפקדות (%)',
            accumulationFees: 'דמי ניהול מצבירה (%)',
            trainingFundFees: 'דמי ניהול קרן השתלמות (%)',
            expectedReturns: 'תשואות צפויות',
            pensionReturn: 'תשואת פנסיה (%)',
            trainingFundReturn: 'תשואת קרן השתלמות (%)',
            personalPortfolioReturn: 'תשואת תיק אישי (%)',
            partnerFees: 'דמי ניהול בני הזוג',
            partner1Fees: 'דמי ניהול בן/בת זוג 1',
            partner2Fees: 'דמי ניהול בן/בת זוג 2',
            partnerReturns: 'תשואות בני הזוג',
            partner1Returns: 'תשואות בן/בת זוג 1',
            partner2Returns: 'תשואות בן/בת זוג 2',
            info: 'דמי הניהול משפיעים על התשואה הסופית של החיסכון'
        },
        en: {
            title: 'Management Fees & Costs',
            contributionFees: 'Management Fees on Contributions (%)',
            accumulationFees: 'Management Fees on Accumulation (%)',
            trainingFundFees: 'Training Fund Management Fees (%)',
            expectedReturns: 'Expected Returns',
            pensionReturn: 'Pension Return (%)',
            trainingFundReturn: 'Training Fund Return (%)',
            personalPortfolioReturn: 'Personal Portfolio Return (%)',
            partnerFees: 'Partner Management Fees',
            partner1Fees: 'Partner 1 Fees',
            partner2Fees: 'Partner 2 Fees',
            partnerReturns: 'Partner Returns',
            partner1Returns: 'Partner 1 Returns',
            partner2Returns: 'Partner 2 Returns',
            info: 'Management fees affect the final returns on your savings'
        }
    };

    const t = content[language];

    return React.createElement('div', { className: "space-y-8" }, [
        // Main Fees Section
        React.createElement('div', { key: 'main-fees-section' }, [
            React.createElement('h3', { 
                key: 'fees-title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '💰'),
                t.title
            ]),
            React.createElement('div', { 
                key: 'main-fees-grid',
                className: "grid grid-cols-1 md:grid-cols-3 gap-6" 
            }, [
                React.createElement('div', { 
                    key: 'contribution-fees',
                    className: "bg-red-50 rounded-xl p-6 border border-red-200"
                }, [
                    React.createElement('label', { 
                        key: 'contribution-label',
                        className: "block text-lg font-medium text-gray-700 mb-2" 
                    }, t.contributionFees),
                    React.createElement('input', {
                        key: 'contribution-input',
                        type: 'number',
                        step: '0.1',
                        value: inputs.contributionFees || 1.0,
                        onChange: (e) => setInputs({...inputs, contributionFees: parseFloat(e.target.value) || 0}),
                        className: "w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    })
                ]),
                React.createElement('div', { 
                    key: 'accumulation-fees',
                    className: "bg-orange-50 rounded-xl p-6 border border-orange-200"
                }, [
                    React.createElement('label', { 
                        key: 'accumulation-label',
                        className: "block text-lg font-medium text-gray-700 mb-2" 
                    }, t.accumulationFees),
                    React.createElement('input', {
                        key: 'accumulation-input',
                        type: 'number',
                        step: '0.1',
                        value: inputs.accumulationFees || 0.1,
                        onChange: (e) => setInputs({...inputs, accumulationFees: parseFloat(e.target.value) || 0}),
                        className: "w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    })
                ]),
                React.createElement('div', { 
                    key: 'training-fund-fees',
                    className: "bg-yellow-50 rounded-xl p-6 border border-yellow-200"
                }, [
                    React.createElement('label', { 
                        key: 'training-fund-label',
                        className: "block text-lg font-medium text-gray-700 mb-2" 
                    }, t.trainingFundFees),
                    React.createElement('input', {
                        key: 'training-fund-input',
                        type: 'number',
                        step: '0.1',
                        value: inputs.trainingFundFees || 0.6,
                        onChange: (e) => setInputs({...inputs, trainingFundFees: parseFloat(e.target.value) || 0}),
                        className: "w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    })
                ])
            ])
        ]),

        // Expected Returns Section
        React.createElement('div', { key: 'returns-section' }, [
            React.createElement('h3', { 
                key: 'returns-title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '📈'),
                t.expectedReturns
            ]),
            React.createElement('div', { 
                key: 'returns-grid',
                className: "grid grid-cols-1 md:grid-cols-3 gap-6" 
            }, [
                React.createElement('div', { 
                    key: 'pension-return',
                    className: "bg-blue-50 rounded-xl p-6 border border-blue-200"
                }, [
                    React.createElement('label', { 
                        key: 'pension-return-label',
                        className: "block text-lg font-medium text-gray-700 mb-2" 
                    }, t.pensionReturn),
                    React.createElement('input', {
                        key: 'pension-return-input',
                        type: 'number',
                        step: '0.1',
                        value: inputs.pensionReturn || 7.0,
                        onChange: (e) => setInputs({...inputs, pensionReturn: parseFloat(e.target.value) || 0}),
                        className: "w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    })
                ]),
                React.createElement('div', { 
                    key: 'training-fund-return',
                    className: "bg-green-50 rounded-xl p-6 border border-green-200"
                }, [
                    React.createElement('label', { 
                        key: 'training-fund-return-label',
                        className: "block text-lg font-medium text-gray-700 mb-2" 
                    }, t.trainingFundReturn),
                    React.createElement('input', {
                        key: 'training-fund-return-input',
                        type: 'number',
                        step: '0.1',
                        value: inputs.trainingFundReturn || 6.5,
                        onChange: (e) => setInputs({...inputs, trainingFundReturn: parseFloat(e.target.value) || 0}),
                        className: "w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    })
                ]),
                React.createElement('div', { 
                    key: 'personal-portfolio-return',
                    className: "bg-purple-50 rounded-xl p-6 border border-purple-200"
                }, [
                    React.createElement('label', { 
                        key: 'personal-portfolio-return-label',
                        className: "block text-lg font-medium text-gray-700 mb-2" 
                    }, t.personalPortfolioReturn),
                    React.createElement('input', {
                        key: 'personal-portfolio-return-input',
                        type: 'number',
                        step: '0.1',
                        value: inputs.personalPortfolioReturn || 8.0,
                        onChange: (e) => setInputs({...inputs, personalPortfolioReturn: parseFloat(e.target.value) || 0}),
                        className: "w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    })
                ])
            ])
        ]),

        // Partner Fees Section (if couple)
        inputs.planningType === 'couple' && React.createElement('div', { key: 'partner-fees-section' }, [
            React.createElement('h3', { 
                key: 'partner-fees-title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '👫'),
                t.partnerFees
            ]),
            React.createElement('div', { 
                key: 'partner-fees-grid',
                className: "grid grid-cols-1 lg:grid-cols-2 gap-8" 
            }, [
                // Partner 1 Fees
                React.createElement('div', { 
                    key: 'partner1-fees',
                    className: "bg-pink-50 rounded-xl p-6 border border-pink-200" 
                }, [
                    React.createElement('h4', { 
                        key: 'partner1-fees-title',
                        className: "text-lg font-semibold text-pink-700 mb-4" 
                    }, inputs.partner1Name || t.partner1Fees),
                    React.createElement('div', { key: 'partner1-fees-inputs', className: "space-y-4" }, [
                        React.createElement('div', { key: 'partner1-contrib-fees' }, [
                            React.createElement('label', { 
                                key: 'partner1-contrib-fees-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.contributionFees),
                            React.createElement('input', {
                                key: 'partner1-contrib-fees-input',
                                type: 'number',
                                step: '0.1',
                                value: inputs.partner1ContributionFees || 1.0,
                                onChange: (e) => setInputs({...inputs, partner1ContributionFees: parseFloat(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                            })
                        ]),
                        React.createElement('div', { key: 'partner1-accum-fees' }, [
                            React.createElement('label', { 
                                key: 'partner1-accum-fees-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.accumulationFees),
                            React.createElement('input', {
                                key: 'partner1-accum-fees-input',
                                type: 'number',
                                step: '0.1',
                                value: inputs.partner1AccumulationFees || 0.1,
                                onChange: (e) => setInputs({...inputs, partner1AccumulationFees: parseFloat(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                            })
                        ]),
                        React.createElement('div', { key: 'partner1-training-fees' }, [
                            React.createElement('label', { 
                                key: 'partner1-training-fees-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.trainingFundFees),
                            React.createElement('input', {
                                key: 'partner1-training-fees-input',
                                type: 'number',
                                step: '0.1',
                                value: inputs.partner1TrainingFundFees || 0.6,
                                onChange: (e) => setInputs({...inputs, partner1TrainingFundFees: parseFloat(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                            })
                        ])
                    ])
                ]),
                
                // Partner 2 Fees
                React.createElement('div', { 
                    key: 'partner2-fees',
                    className: "bg-purple-50 rounded-xl p-6 border border-purple-200" 
                }, [
                    React.createElement('h4', { 
                        key: 'partner2-fees-title',
                        className: "text-lg font-semibold text-purple-700 mb-4" 
                    }, inputs.partner2Name || t.partner2Fees),
                    React.createElement('div', { key: 'partner2-fees-inputs', className: "space-y-4" }, [
                        React.createElement('div', { key: 'partner2-contrib-fees' }, [
                            React.createElement('label', { 
                                key: 'partner2-contrib-fees-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.contributionFees),
                            React.createElement('input', {
                                key: 'partner2-contrib-fees-input',
                                type: 'number',
                                step: '0.1',
                                value: inputs.partner2ContributionFees || 1.0,
                                onChange: (e) => setInputs({...inputs, partner2ContributionFees: parseFloat(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            })
                        ]),
                        React.createElement('div', { key: 'partner2-accum-fees' }, [
                            React.createElement('label', { 
                                key: 'partner2-accum-fees-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.accumulationFees),
                            React.createElement('input', {
                                key: 'partner2-accum-fees-input',
                                type: 'number',
                                step: '0.1',
                                value: inputs.partner2AccumulationFees || 0.1,
                                onChange: (e) => setInputs({...inputs, partner2AccumulationFees: parseFloat(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            })
                        ]),
                        React.createElement('div', { key: 'partner2-training-fees' }, [
                            React.createElement('label', { 
                                key: 'partner2-training-fees-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.trainingFundFees),
                            React.createElement('input', {
                                key: 'partner2-training-fees-input',
                                type: 'number',
                                step: '0.1',
                                value: inputs.partner2TrainingFundFees || 0.6,
                                onChange: (e) => setInputs({...inputs, partner2TrainingFundFees: parseFloat(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            })
                        ])
                    ])
                ])
            ])
        ]),

        // Partner Returns Section (if couple)
        inputs.planningType === 'couple' && React.createElement('div', { key: 'partner-returns-section' }, [
            React.createElement('h3', { 
                key: 'partner-returns-title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '📊'),
                t.partnerReturns
            ]),
            React.createElement('div', { 
                key: 'partner-returns-grid',
                className: "grid grid-cols-1 lg:grid-cols-2 gap-8" 
            }, [
                // Partner 1 Returns
                React.createElement('div', { 
                    key: 'partner1-returns',
                    className: "bg-pink-50 rounded-xl p-6 border border-pink-200" 
                }, [
                    React.createElement('h4', { 
                        key: 'partner1-returns-title',
                        className: "text-lg font-semibold text-pink-700 mb-4" 
                    }, inputs.partner1Name || t.partner1Returns),
                    React.createElement('div', { key: 'partner1-returns-inputs', className: "space-y-4" }, [
                        React.createElement('div', { key: 'partner1-pension-return' }, [
                            React.createElement('label', { 
                                key: 'partner1-pension-return-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.pensionReturn),
                            React.createElement('input', {
                                key: 'partner1-pension-return-input',
                                type: 'number',
                                step: '0.1',
                                value: inputs.partner1PensionReturn || 7.0,
                                onChange: (e) => setInputs({...inputs, partner1PensionReturn: parseFloat(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                            })
                        ]),
                        React.createElement('div', { key: 'partner1-training-return' }, [
                            React.createElement('label', { 
                                key: 'partner1-training-return-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.trainingFundReturn),
                            React.createElement('input', {
                                key: 'partner1-training-return-input',
                                type: 'number',
                                step: '0.1',
                                value: inputs.partner1TrainingFundReturn || 6.5,
                                onChange: (e) => setInputs({...inputs, partner1TrainingFundReturn: parseFloat(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                            })
                        ]),
                        React.createElement('div', { key: 'partner1-portfolio-return' }, [
                            React.createElement('label', { 
                                key: 'partner1-portfolio-return-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.personalPortfolioReturn),
                            React.createElement('input', {
                                key: 'partner1-portfolio-return-input',
                                type: 'number',
                                step: '0.1',
                                value: inputs.partner1PersonalPortfolioReturn || 8.0,
                                onChange: (e) => setInputs({...inputs, partner1PersonalPortfolioReturn: parseFloat(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                            })
                        ])
                    ])
                ]),
                
                // Partner 2 Returns
                React.createElement('div', { 
                    key: 'partner2-returns',
                    className: "bg-purple-50 rounded-xl p-6 border border-purple-200" 
                }, [
                    React.createElement('h4', { 
                        key: 'partner2-returns-title',
                        className: "text-lg font-semibold text-purple-700 mb-4" 
                    }, inputs.partner2Name || t.partner2Returns),
                    React.createElement('div', { key: 'partner2-returns-inputs', className: "space-y-4" }, [
                        React.createElement('div', { key: 'partner2-pension-return' }, [
                            React.createElement('label', { 
                                key: 'partner2-pension-return-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.pensionReturn),
                            React.createElement('input', {
                                key: 'partner2-pension-return-input',
                                type: 'number',
                                step: '0.1',
                                value: inputs.partner2PensionReturn || 7.0,
                                onChange: (e) => setInputs({...inputs, partner2PensionReturn: parseFloat(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            })
                        ]),
                        React.createElement('div', { key: 'partner2-training-return' }, [
                            React.createElement('label', { 
                                key: 'partner2-training-return-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.trainingFundReturn),
                            React.createElement('input', {
                                key: 'partner2-training-return-input',
                                type: 'number',
                                step: '0.1',
                                value: inputs.partner2TrainingFundReturn || 6.5,
                                onChange: (e) => setInputs({...inputs, partner2TrainingFundReturn: parseFloat(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            })
                        ]),
                        React.createElement('div', { key: 'partner2-portfolio-return' }, [
                            React.createElement('label', { 
                                key: 'partner2-portfolio-return-label',
                                className: "block text-sm font-medium text-gray-700 mb-1" 
                            }, t.personalPortfolioReturn),
                            React.createElement('input', {
                                key: 'partner2-portfolio-return-input',
                                type: 'number',
                                step: '0.1',
                                value: inputs.partner2PersonalPortfolioReturn || 8.0,
                                onChange: (e) => setInputs({...inputs, partner2PersonalPortfolioReturn: parseFloat(e.target.value) || 0}),
                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            })
                        ])
                    ])
                ])
            ])
        ]),

        // Info Panel
        React.createElement('div', { 
            key: 'info',
            className: "bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200" 
        }, [
            React.createElement('div', { key: 'info-icon', className: "text-2xl mb-2" }, 'ℹ️'),
            React.createElement('h4', { 
                key: 'info-title',
                className: "text-lg font-semibold text-yellow-700 mb-2" 
            }, language === 'he' ? 'מידע חשוב' : 'Important Information'),
            React.createElement('p', { 
                key: 'info-text',
                className: "text-yellow-700 text-sm" 
            }, t.info)
        ])
    ]);
};

window.WizardStepFees = WizardStepFees;
console.log('✅ WizardStepFees component loaded successfully');