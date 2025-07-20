// WizardStepFees.js - Step 5: Management Fees
// Investment management costs and fees

const WizardStepFees = ({ inputs, setInputs, language = 'en' }) => {
    const content = {
        he: {
            title: 'דמי ניהול והוצאות',
            contributionFees: 'דמי ניהול מהפקדות (%)',
            accumulationFees: 'דמי ניהול מצבירה (%)',
            trainingFundFees: 'דמי ניהול קרן השתלמות (%)',
            info: 'דמי הניהול משפיעים על התשואה הסופית של החיסכון'
        },
        en: {
            title: 'Management Fees & Costs',
            contributionFees: 'Management Fees on Contributions (%)',
            accumulationFees: 'Management Fees on Accumulation (%)',
            trainingFundFees: 'Training Fund Management Fees (%)',
            info: 'Management fees affect the final returns on your savings'
        }
    };

    const t = content[language];

    return React.createElement('div', { className: "space-y-8" }, [
        React.createElement('div', { key: 'fees-section' }, [
            React.createElement('h3', { 
                key: 'title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '📊'),
                t.title
            ]),
            React.createElement('div', { 
                key: 'fees-grid',
                className: "grid grid-cols-1 md:grid-cols-3 gap-6" 
            }, [
                React.createElement('div', { key: 'contribution-fees' }, [
                    React.createElement('label', { 
                        key: 'contribution-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.contributionFees),
                    React.createElement('input', {
                        key: 'contribution-input',
                        type: 'number',
                        step: '0.1',
                        value: inputs.contributionFees || 1.0,
                        onChange: (e) => setInputs({...inputs, contributionFees: parseFloat(e.target.value) || 0}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    })
                ]),
                React.createElement('div', { key: 'accumulation-fees' }, [
                    React.createElement('label', { 
                        key: 'accumulation-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.accumulationFees),
                    React.createElement('input', {
                        key: 'accumulation-input',
                        type: 'number',
                        step: '0.1',
                        value: inputs.accumulationFees || 0.1,
                        onChange: (e) => setInputs({...inputs, accumulationFees: parseFloat(e.target.value) || 0}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    })
                ]),
                React.createElement('div', { key: 'training-fund-fees' }, [
                    React.createElement('label', { 
                        key: 'training-fund-label',
                        className: "block text-sm font-medium text-gray-700 mb-2" 
                    }, t.trainingFundFees),
                    React.createElement('input', {
                        key: 'training-fund-input',
                        type: 'number',
                        step: '0.1',
                        value: inputs.trainingFundFees || 0.6,
                        onChange: (e) => setInputs({...inputs, trainingFundFees: parseFloat(e.target.value) || 0}),
                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    })
                ])
            ]),
            React.createElement('div', { 
                key: 'info',
                className: "bg-yellow-50 rounded-xl p-4 border border-yellow-200 mt-6" 
            }, [
                React.createElement('p', { 
                    key: 'info-text',
                    className: "text-yellow-700 text-sm" 
                }, t.info)
            ])
        ])
    ]);
};

window.WizardStepFees = WizardStepFees;
console.log('✅ WizardStepFees component loaded successfully');