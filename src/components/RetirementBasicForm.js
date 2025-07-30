// BasicInputs.js - Basic inputs section component

const BasicInputs = ({ 
    inputs, 
    setInputs, 
    language, 
    t, 
    Calculator, 
    PiggyBank, 
    DollarSign 
}) => {
    return React.createElement('div', { className: "space-y-6 container-responsive" }, [
        React.createElement('div', { 
            key: 'basic',
            className: "glass-effect rounded-2xl shadow-xl p-4 sm:p-6 border border-white/20 animate-fade-in"
        }, [
            React.createElement('h2', { 
                key: 'title',
                className: "text-xl sm:text-2xl font-bold text-purple-700 mb-6 flex items-center text-truncate"
            }, [
                React.createElement(Calculator, { key: 'icon', className: "mr-2" }),
                t.basic
            ]),
            React.createElement('div', { key: 'content', className: "space-y-4" }, [
                React.createElement('div', { key: 'grid', className: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                    React.createElement('div', { key: 'age' }, [
                        React.createElement('label', { 
                            key: 'label',
                            className: "block text-sm font-medium text-gray-700 mb-1"
                        }, t.currentAge),
                        React.createElement('input', {
                            key: 'input',
                            type: "number",
                            value: inputs.currentAge,
                            onChange: (e) => setInputs({...inputs, currentAge: parseInt(e.target.value) || 0}),
                            className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        })
                    ]),
                    React.createElement('div', { key: 'retirement' }, [
                        React.createElement('label', { 
                            key: 'label',
                            className: "block text-sm font-medium text-gray-700 mb-1"
                        }, t.retirementAge),
                        React.createElement('input', {
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