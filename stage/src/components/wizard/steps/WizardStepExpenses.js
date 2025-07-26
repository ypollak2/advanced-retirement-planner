// WizardStepExpenses.js - Monthly expense tracking with categorization and predictions
// Tracks current expenses across 5 main categories with yearly adjustment capabilities

const WizardStepExpenses = ({ inputs, setInputs, language, workingCurrency, formatCurrency }) => {
    // Multi-language content
    const content = {
        he: {
            title: 'הוצאות חודשיות',
            subtitle: 'עקוב אחר ההוצאות הנוכחיות שלך לפי קטגוריות',
            housing: 'דיור ושירותים',
            housingHint: 'שכירות/משכנתא, חשמל, מים, גז, ארנונה',
            transportation: 'תחבורה',
            transportationHint: 'רכב, דלק, תחבורה ציבורית, תחזוקה',
            food: 'מזון וצריכה יומית',
            foodHint: 'מכולת, אוכל בחוץ, טיפוח אישי',
            insurance: 'ביטוח ובריאות',
            insuranceHint: 'ביטוח בריאות, חיים, תרופות, טיפולים',
            other: 'הוצאות אחרות',
            otherHint: 'כרטיסי אשראי, בידור, שונות',
            total: 'סה"כ הוצאות חודשיות',
            yearlyAdjustment: 'התאמה שנתית צפויה',
            adjustmentHint: 'כמה אתה צופה שההוצאות שלך ישתנו בשנה',
            categoryBreakdown: 'פירוט לפי קטגוריה',
            savingsRate: 'שיעור חיסכון',
            monthlyIncome: 'הכנסה חודשית',
            monthlySavings: 'חיסכון חודשי',
            expenseRatio: 'יחס הוצאות',
            suggestions: {
                title: 'המלצות חכמות',
                highHousing: 'הוצאות הדיור שלך גבוהות מהממוצע. שקול לבדוק אפשרויות חיסכון.',
                goodSavings: 'שיעור חיסכון מצוין! אתה בדרך הנכונה.',
                lowSavings: 'שיעור החיסכון נמוך. נסה לצמצם הוצאות לא הכרחיות.',
                balanced: 'חלוקת ההוצאות שלך מאוזנת.'
            }
        },
        en: {
            title: 'Monthly Expenses',
            subtitle: 'Track your current expenses by category',
            housing: 'Housing & Utilities',
            housingHint: 'Rent/mortgage, electricity, water, gas, property tax',
            transportation: 'Transportation',
            transportationHint: 'Car, fuel, public transport, maintenance',
            food: 'Food & Daily Living',
            foodHint: 'Groceries, dining out, personal care',
            insurance: 'Insurance & Healthcare',
            insuranceHint: 'Health insurance, life insurance, medications, treatments',
            other: 'Other Expenses',
            otherHint: 'Credit cards, entertainment, miscellaneous',
            total: 'Total Monthly Expenses',
            yearlyAdjustment: 'Expected Yearly Adjustment',
            adjustmentHint: 'How much you expect your expenses to change per year',
            categoryBreakdown: 'Category Breakdown',
            savingsRate: 'Savings Rate',
            monthlyIncome: 'Monthly Income',
            monthlySavings: 'Monthly Savings',
            expenseRatio: 'Expense Ratio',
            suggestions: {
                title: 'Smart Suggestions',
                highHousing: 'Your housing expenses are above average. Consider exploring savings options.',
                goodSavings: 'Excellent savings rate! You\'re on the right track.',
                lowSavings: 'Low savings rate. Try to reduce non-essential expenses.',
                balanced: 'Your expense distribution is well balanced.'
            }
        }
    };

    const t = content[language] || content.en;

    // Calculate monthly income for savings rate
    const monthlyIncome = React.useMemo(() => {
        if (inputs.planningType === 'couple') {
            return (parseFloat(inputs.partner1Salary) || 0) + (parseFloat(inputs.partner2Salary) || 0);
        }
        return parseFloat(inputs.currentMonthlySalary) || 0;
    }, [inputs.planningType, inputs.partner1Salary, inputs.partner2Salary, inputs.currentMonthlySalary]);

    // Initialize expense categories if not present
    React.useEffect(() => {
        if (!inputs.expenses) {
            setInputs(prev => ({
                ...prev,
                expenses: {
                    housing: 0,
                    transportation: 0,
                    food: 0,
                    insurance: 0,
                    other: 0,
                    yearlyAdjustment: 2.5 // Default inflation rate
                }
            }));
        }
    }, []);

    // Calculate total expenses
    const totalExpenses = React.useMemo(() => {
        if (!inputs.expenses) return 0;
        return Object.keys(inputs.expenses)
            .filter(key => key !== 'yearlyAdjustment')
            .reduce((sum, key) => sum + (parseFloat(inputs.expenses[key]) || 0), 0);
    }, [inputs.expenses]);

    // Calculate savings rate
    const savingsRate = React.useMemo(() => {
        if (!monthlyIncome || monthlyIncome === 0) return 0;
        const savings = monthlyIncome - totalExpenses;
        return Math.max(0, (savings / monthlyIncome) * 100);
    }, [monthlyIncome, totalExpenses]);

    // Calculate category percentages
    const categoryPercentages = React.useMemo(() => {
        if (!totalExpenses || totalExpenses === 0) return {};
        const percentages = {};
        Object.keys(inputs.expenses || {}).forEach(key => {
            if (key !== 'yearlyAdjustment') {
                percentages[key] = ((parseFloat(inputs.expenses[key]) || 0) / totalExpenses) * 100;
            }
        });
        return percentages;
    }, [inputs.expenses, totalExpenses]);

    // Handle expense input change
    const handleExpenseChange = (category, value) => {
        const numValue = parseFloat(value) || 0;
        setInputs(prev => ({
            ...prev,
            expenses: {
                ...prev.expenses,
                [category]: numValue
            }
        }));
    };

    // Handle yearly adjustment change
    const handleAdjustmentChange = (value) => {
        const numValue = parseFloat(value) || 0;
        setInputs(prev => ({
            ...prev,
            expenses: {
                ...prev.expenses,
                yearlyAdjustment: numValue
            }
        }));
    };

    // Smart suggestions based on expense patterns
    const getSmartSuggestions = () => {
        const suggestions = [];
        
        // Check housing expenses (typically should be < 30% of income)
        if (monthlyIncome > 0 && inputs.expenses?.housing > monthlyIncome * 0.3) {
            suggestions.push(t.suggestions.highHousing);
        }
        
        // Check savings rate
        if (savingsRate >= 20) {
            suggestions.push(t.suggestions.goodSavings);
        } else if (savingsRate < 10) {
            suggestions.push(t.suggestions.lowSavings);
        } else {
            suggestions.push(t.suggestions.balanced);
        }
        
        return suggestions;
    };

    const suggestions = getSmartSuggestions();

    // Expense categories with icons
    const expenseCategories = [
        { key: 'housing', label: t.housing, hint: t.housingHint, icon: '🏠', color: 'blue' },
        { key: 'transportation', label: t.transportation, hint: t.transportationHint, icon: '🚗', color: 'green' },
        { key: 'food', label: t.food, hint: t.foodHint, icon: '🛒', color: 'yellow' },
        { key: 'insurance', label: t.insurance, hint: t.insuranceHint, icon: '🏥', color: 'red' },
        { key: 'other', label: t.other, hint: t.otherHint, icon: '💳', color: 'purple' }
    ];

    return React.createElement('div', { 
        className: "expense-tracking-step space-y-8" 
    }, [
        // Header
        React.createElement('div', {
            key: 'header',
            className: 'text-center mb-8'
        }, [
            React.createElement('h2', {
                key: 'title',
                className: 'text-2xl font-bold text-gray-800 mb-2'
            }, t.title),
            React.createElement('p', {
                key: 'subtitle',
                className: 'text-gray-600'
            }, t.subtitle)
        ]),

        // Expense Categories
        React.createElement('div', {
            key: 'expense-categories',
            className: 'space-y-4'
        }, expenseCategories.map(category => 
            React.createElement('div', {
                key: category.key,
                className: 'bg-white p-4 rounded-lg shadow-sm border border-gray-200'
            }, [
                React.createElement('div', {
                    key: 'category-header',
                    className: 'flex items-center justify-between mb-2'
                }, [
                    React.createElement('div', {
                        key: 'label-container',
                        className: 'flex items-center gap-3'
                    }, [
                        React.createElement('span', {
                            key: 'icon',
                            className: 'text-2xl'
                        }, category.icon),
                        React.createElement('div', {
                            key: 'label-text'
                        }, [
                            React.createElement('label', {
                                key: 'label',
                                htmlFor: `expense-${category.key}`,
                                className: 'font-medium text-gray-800'
                            }, category.label),
                            React.createElement('p', {
                                key: 'hint',
                                className: 'text-sm text-gray-500'
                            }, category.hint)
                        ])
                    ]),
                    categoryPercentages[category.key] > 0 && React.createElement('span', {
                        key: 'percentage',
                        className: `text-sm font-medium text-${category.color}-600`
                    }, `${categoryPercentages[category.key].toFixed(1)}%`)
                ]),
                React.createElement('div', {
                    key: 'input-container',
                    className: 'flex items-center gap-2'
                }, [
                    React.createElement('span', {
                        key: 'currency',
                        className: 'text-gray-500'
                    }, workingCurrency === 'ILS' ? '₪' : workingCurrency),
                    React.createElement('input', {
                        key: 'input',
                        id: `expense-${category.key}`,
                        type: 'number',
                        min: '0',
                        step: '100',
                        value: inputs.expenses?.[category.key] || '',
                        onChange: (e) => handleExpenseChange(category.key, e.target.value),
                        className: 'flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                        placeholder: '0'
                    })
                ])
            ])
        )),

        // Total and Summary
        React.createElement('div', {
            key: 'summary',
            className: 'bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200'
        }, [
            React.createElement('div', {
                key: 'total-row',
                className: 'flex justify-between items-center mb-4'
            }, [
                React.createElement('h3', {
                    key: 'total-label',
                    className: 'text-lg font-semibold text-gray-800'
                }, t.total),
                React.createElement('div', {
                    key: 'total-value',
                    className: 'text-2xl font-bold text-blue-600'
                }, formatCurrency ? formatCurrency(totalExpenses, workingCurrency) : `${workingCurrency} ${totalExpenses.toLocaleString()}`)
            ]),
            
            // Savings Analysis
            monthlyIncome > 0 && React.createElement('div', {
                key: 'savings-analysis',
                className: 'grid grid-cols-2 gap-4 pt-4 border-t border-blue-200'
            }, [
                React.createElement('div', {
                    key: 'savings-rate'
                }, [
                    React.createElement('p', {
                        key: 'label',
                        className: 'text-sm text-gray-600'
                    }, t.savingsRate),
                    React.createElement('p', {
                        key: 'value',
                        className: `text-xl font-bold ${savingsRate >= 20 ? 'text-green-600' : savingsRate >= 10 ? 'text-yellow-600' : 'text-red-600'}`
                    }, `${savingsRate.toFixed(1)}%`)
                ]),
                React.createElement('div', {
                    key: 'monthly-savings'
                }, [
                    React.createElement('p', {
                        key: 'label',
                        className: 'text-sm text-gray-600'
                    }, t.monthlySavings),
                    React.createElement('p', {
                        key: 'value',
                        className: 'text-xl font-bold text-gray-800'
                    }, formatCurrency ? formatCurrency(monthlyIncome - totalExpenses, workingCurrency) : `${workingCurrency} ${(monthlyIncome - totalExpenses).toLocaleString()}`)
                ])
            ])
        ]),

        // Yearly Adjustment
        React.createElement('div', {
            key: 'yearly-adjustment',
            className: 'bg-white p-6 rounded-lg shadow-sm border border-gray-200'
        }, [
            React.createElement('div', {
                key: 'adjustment-header',
                className: 'mb-4'
            }, [
                React.createElement('label', {
                    key: 'label',
                    htmlFor: 'yearly-adjustment',
                    className: 'block font-medium text-gray-800 mb-1'
                }, t.yearlyAdjustment),
                React.createElement('p', {
                    key: 'hint',
                    className: 'text-sm text-gray-500'
                }, t.adjustmentHint)
            ]),
            React.createElement('div', {
                key: 'adjustment-controls',
                className: 'flex items-center gap-4'
            }, [
                React.createElement('input', {
                    key: 'slider',
                    id: 'yearly-adjustment',
                    type: 'range',
                    min: '-5',
                    max: '10',
                    step: '0.5',
                    value: inputs.expenses?.yearlyAdjustment || 2.5,
                    onChange: (e) => handleAdjustmentChange(e.target.value),
                    className: 'flex-1'
                }),
                React.createElement('div', {
                    key: 'value',
                    className: 'w-20 text-center'
                }, [
                    React.createElement('span', {
                        key: 'percentage',
                        className: `text-lg font-bold ${(inputs.expenses?.yearlyAdjustment || 2.5) < 0 ? 'text-green-600' : 'text-red-600'}`
                    }, `${(inputs.expenses?.yearlyAdjustment || 2.5) > 0 ? '+' : ''}${inputs.expenses?.yearlyAdjustment || 2.5}%`)
                ])
            ])
        ]),

        // Smart Suggestions
        suggestions.length > 0 && React.createElement('div', {
            key: 'suggestions',
            className: 'bg-yellow-50 p-4 rounded-lg border border-yellow-200'
        }, [
            React.createElement('h4', {
                key: 'title',
                className: 'font-medium text-yellow-800 mb-2 flex items-center gap-2'
            }, [
                React.createElement('span', { key: 'icon' }, '💡'),
                t.suggestions.title
            ]),
            React.createElement('ul', {
                key: 'list',
                className: 'space-y-1'
            }, suggestions.map((suggestion, index) => 
                React.createElement('li', {
                    key: index,
                    className: 'text-sm text-yellow-700'
                }, `• ${suggestion}`)
            ))
        ])
    ]);
};

// Export to window for global access
window.WizardStepExpenses = WizardStepExpenses;