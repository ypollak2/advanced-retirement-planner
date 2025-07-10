// AdvancedInputs.js - Advanced inputs section component
const { createElement } = React;

export const AdvancedInputs = ({ 
    inputs, 
    setInputs, 
    language, 
    t,
    workPeriods,
    setWorkPeriods,
    addWorkPeriod,
    removeWorkPeriod,
    updateWorkPeriod,
    countryData,
    formatCurrency,
    Settings,
    PiggyBank,
    DollarSign,
    TrendingUp,
    Building,
    Globe,
    Plus,
    Trash2
}) => {
    return createElement('div', { className: "space-y-6" }, [
        createElement('div', { 
            key: 'advanced',
            className: "glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in"
        }, [
            createElement('h2', { 
                key: 'title',
                className: "text-2xl font-bold text-orange-700 mb-6 flex items-center"
            }, [
                createElement(Settings, { key: 'icon', className: "mr-2" }),
                language === 'he' ? "הגדרות מתקדמות" : "Advanced Settings"
            ]),
            createElement('div', { key: 'content', className: "space-y-4" }, [
                createElement('div', { key: 'grid', className: "grid grid-cols-2 gap-4" }, [
                    createElement('div', { key: 'expenses' }, [
                        createElement('label', { 
                            key: 'label',
                            className: "block text-sm font-medium text-gray-700 mb-1"
                        }, language === 'he' ? "הוצאות חודשיות נוכחיות (₪)" : "Current Monthly Expenses (₪)"),
                        createElement('input', {
                            key: 'input',
                            type: "number",
                            value: inputs.currentMonthlyExpenses || 0,
                            onChange: (e) => setInputs({...inputs, currentMonthlyExpenses: parseInt(e.target.value) || 0}),
                            className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        })
                    ]),
                    createElement('div', { key: 'replacement' }, [
                        createElement('label', { 
                            key: 'label',
                            className: "block text-sm font-medium text-gray-700 mb-1"
                        }, language === 'he' ? "יעד: החלפת % ממשכורת" : "Target: Replace % of Salary"),
                        createElement('input', {
                            key: 'input',
                            type: "number",
                            value: inputs.targetReplacement || 75,
                            onChange: (e) => setInputs({...inputs, targetReplacement: parseInt(e.target.value) || 0}),
                            className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        })
                    ])
                ])
            ])
        ])
    ]);
};

// Export to window for global access
window.AdvancedInputs = AdvancedInputs;