// BasicInputs.js - Basic inputs section component
const { createElement } = React;

const BasicInputs = ({ 
    inputs, 
    setInputs, 
    language, 
    t, 
    Calculator, 
    PiggyBank, 
    DollarSign 
}) => {
    return createElement('div', { className: "space-y-6" }, [
        createElement('div', { 
            key: 'basic',
            className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in"
        }, [
            createElement('h2', { 
                key: 'title',
                className: "text-2xl font-bold text-purple-700 mb-6 flex items-center"
            }, [
                createElement(Calculator, { key: 'icon', className: "mr-2" }),
                t.basic
            ]),
            createElement('div', { key: 'content', className: "space-y-4" }, [
                createElement('div', { key: 'grid', className: "grid grid-cols-2 gap-4" }, [
                    createElement('div', { key: 'age' }, [
                        createElement('label', { 
                            key: 'label',
                            className: "block text-sm font-medium text-gray-700 mb-1"
                        }, t.currentAge),
                        createElement('input', {
                            key: 'input',
                            type: "number",
                            value: inputs.currentAge,
                            onChange: (e) => setInputs({...inputs, currentAge: parseInt(e.target.value) || 0}),
                            className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        })
                    ]),
                    createElement('div', { key: 'retirement' }, [
                        createElement('label', { 
                            key: 'label',
                            className: "block text-sm font-medium text-gray-700 mb-1"
                        }, t.retirementAge),
                        createElement('input', {
                            key: 'input',
                            type: "number",
                            value: inputs.retirementAge,
                            onChange: (e) => setInputs({...inputs, retirementAge: parseInt(e.target.value) || 0}),
                            className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        })
                    ])
                ])
            ])
        ])
    ]);
};

// Export to window for global access
window.BasicInputs = BasicInputs;