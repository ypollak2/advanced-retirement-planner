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
            
            // Debt Payments Section
            debtPayments: 'תשלומי חובות',
            debtPaymentsSubtitle: 'תשלומים חודשיים על חובות (לא יתרת החוב הכוללת)',
            mortgage: 'תשלומי משכנתא',
            mortgageHint: 'תשלום חודשי למשכנתא (קרן + ריבית)',
            carLoan: 'הלוואת רכב',
            carLoanHint: 'תשלום חודשי על הלוואת רכב',
            creditCard: 'כרטיסי אשראי',
            creditCardHint: 'תשלום מינימלי או קבוע על כרטיסי אשראי',
            otherDebt: 'הלוואות אחרות', 
            otherDebtHint: 'הלוואות אישיות, חובות אחרים',
            totalDebt: 'סך תשלומי חובות',
            debtToIncomeRatio: 'יחס חוב להכנסה',
            
            // Debt Balances Section
            debtBalances: 'יתרות חובות',
            debtBalancesSubtitle: 'סכומי החוב הכוללים שנותרו לפירעון',
            mortgageBalance: 'יתרת משכנתא',
            mortgageBalanceHint: 'סכום המשכנתא שנותר לפירעון',
            carLoanBalance: 'יתרת הלוואת רכב',
            carLoanBalanceHint: 'סכום הלוואת הרכב שנותר לפירעון',
            creditCardBalance: 'יתרת כרטיסי אשראי',
            creditCardBalanceHint: 'סכום החוב בכרטיסי האשראי',
            otherDebtBalance: 'יתרות חובות אחרים',
            otherDebtBalanceHint: 'הלוואות אישיות וחובות אחרים',
            totalDebtBalance: 'סך יתרות החובות',
            netWorth: 'שווי נטו',
            netWorthHint: 'סך הנכסים פחות סך החובות',
            
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
                balanced: 'חלוקת ההוצאות שלך מאוזנת.',
                lowDebt: 'יחס החוב שלך נמוך - מצוין! יש לך מרחב נוסף לחיסכון.',
                moderateDebt: 'יחס החוב שלך בסדר. שקול לשלם יותר על חובות עם ריבית גבוהה.',
                highDebt: 'יחס החוב שלך גבוה. שקול לאחד חובות או להגדיל תשלומים.',
                criticalDebt: 'יחס החוב שלך קריטי. דרושה תכנית דחופה לצמצום חובות.',
                negativeIncome: 'הוצאות + חובות עולים על ההכנסה. נדרש תכנון מיידי.'
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
            
            // Debt Payments Section
            debtPayments: 'Debt Payments',
            debtPaymentsSubtitle: 'Monthly debt service payments (not total loan balances)',
            mortgage: 'Mortgage Payments',
            mortgageHint: 'Monthly mortgage payment (principal + interest)',
            carLoan: 'Car Loan Payments',
            carLoanHint: 'Monthly car loan payment',
            creditCard: 'Credit Card Payments',
            creditCardHint: 'Minimum or regular credit card payments',
            otherDebt: 'Other Loan Payments',
            otherDebtHint: 'Personal loans, other debt obligations',
            totalDebt: 'Total Monthly Debt Payments',
            debtToIncomeRatio: 'Debt-to-Income Ratio',
            
            // Debt Balances Section
            debtBalances: 'Debt Balances',
            debtBalancesSubtitle: 'Total remaining debt amounts owed',
            mortgageBalance: 'Mortgage Balance',
            mortgageBalanceHint: 'Remaining amount owed on mortgage',
            carLoanBalance: 'Car Loan Balance', 
            carLoanBalanceHint: 'Remaining amount owed on car loan',
            creditCardBalance: 'Credit Card Balance',
            creditCardBalanceHint: 'Total credit card debt amount',
            otherDebtBalance: 'Other Debt Balances',
            otherDebtBalanceHint: 'Personal loans and other debt amounts',
            totalDebtBalance: 'Total Debt Balance',
            netWorth: 'Net Worth',
            netWorthHint: 'Total assets minus total debts',
            
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
                balanced: 'Your expense distribution is well balanced.',
                lowDebt: 'Excellent debt management! You have more room for savings.',
                moderateDebt: 'Manageable debt load. Consider paying extra on high-interest debt.',
                highDebt: 'High debt load. Consider debt consolidation or accelerated payments.',
                criticalDebt: 'Critical debt situation. Urgent debt reduction plan needed.',
                negativeIncome: 'Expenses + debt exceed income. Immediate budgeting required.',
                debtDurationNote: 'Note: Long-term debt (mortgage, car loans) may end before retirement.',
                mortgageAdvice: 'Mortgage will likely be paid off before retirement - factor this into your planning.'
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
                    // Debt payment categories
                    mortgage: 0,
                    carLoan: 0,
                    creditCard: 0,
                    otherDebt: 0,
                    yearlyAdjustment: 2.5 // Default inflation rate
                }
            }));
        }
    }, []);

    // Calculate total expenses (now includes debt payments via global utility)
    const totalExpenses = React.useMemo(() => {
        if (!inputs.expenses || !window.calculateTotalExpenses) return 0;
        return window.calculateTotalExpenses(inputs.expenses);
    }, [inputs.expenses]);

    // Calculate total debt payments
    const totalDebtPayments = React.useMemo(() => {
        if (!inputs.expenses) return 0;
        const debtCategories = ['mortgage', 'carLoan', 'creditCard', 'otherDebt'];
        return debtCategories.reduce((sum, key) => sum + (parseFloat(inputs.expenses[key]) || 0), 0);
    }, [inputs.expenses]);

    // Calculate debt-to-income ratio
    const debtToIncomeRatio = React.useMemo(() => {
        if (!monthlyIncome || monthlyIncome === 0) return 0;
        return (totalDebtPayments / monthlyIncome) * 100;
    }, [monthlyIncome, totalDebtPayments]);

    // Calculate savings rate (updated to account for debt)
    const savingsRate = React.useMemo(() => {
        if (!monthlyIncome || monthlyIncome === 0) return 0;
        const netIncome = monthlyIncome - totalExpenses - totalDebtPayments;
        const savings = Math.max(0, netIncome);
        return (savings / monthlyIncome) * 100;
    }, [monthlyIncome, totalExpenses, totalDebtPayments]);

    // Calculate total debt balances
    const totalDebtBalances = React.useMemo(() => {
        if (!inputs.debtBalances) return 0;
        const debtBalanceCategories = ['mortgageBalance', 'carLoanBalance', 'creditCardBalance', 'otherDebtBalance'];
        return debtBalanceCategories.reduce((sum, key) => sum + (parseFloat(inputs.debtBalances[key]) || 0), 0);
    }, [inputs.debtBalances]);

    // Calculate category percentages (for expense categories only)
    const categoryPercentages = React.useMemo(() => {
        if (!totalExpenses || totalExpenses === 0) return {};
        const percentages = {};
        const expenseCategories = ['housing', 'transportation', 'food', 'insurance', 'other'];
        expenseCategories.forEach(key => {
            percentages[key] = ((parseFloat(inputs.expenses?.[key]) || 0) / totalExpenses) * 100;
        });
        return percentages;
    }, [inputs.expenses, totalExpenses]);

    // Handle expense input change with validation
    const handleExpenseChange = (category, value) => {
        const numValue = parseFloat(value) || 0;
        
        // Validation: Prevent negative values
        if (numValue < 0) {
            console.warn(`Negative value not allowed for ${category}: ${value}`);
            return;
        }
        
        // Validation: Reasonable maximum limits to prevent data entry errors
        const maxLimits = {
            housing: 50000,      // Maximum ₪50,000 housing
            transportation: 20000, // Maximum ₪20,000 transportation
            food: 15000,         // Maximum ₪15,000 food
            insurance: 10000,    // Maximum ₪10,000 insurance
            other: 75000,        // Maximum ₪75,000 other expenses
            mortgage: 40000,     // Maximum ₪40,000 mortgage
            carLoan: 15000,      // Maximum ₪15,000 car loan
            creditCard: 10000,   // Maximum ₪10,000 credit card
            otherDebt: 20000     // Maximum ₪20,000 other debt
        };
        
        if (numValue > maxLimits[category]) {
            console.warn(`Value ${numValue} exceeds reasonable limit for ${category}: ${maxLimits[category]}`);
            // Still allow but warn - user might have high expenses
        }
        
        setInputs(prev => ({
            ...prev,
            expenses: {
                ...prev.expenses,
                [category]: numValue
            }
        }));
    };

    // Handle yearly adjustment change with validation
    const handleAdjustmentChange = (value) => {
        const numValue = parseFloat(value) || 0;
        
        // Validation: Reasonable range for yearly adjustment (-10% to +15%)
        if (numValue < -10 || numValue > 15) {
            console.warn(`Yearly adjustment ${numValue}% is outside reasonable range (-10% to +15%)`);
        }
        
        setInputs(prev => ({
            ...prev,
            expenses: {
                ...prev.expenses,
                yearlyAdjustment: numValue
            }
        }));
    };

    // Smart suggestions based on expense patterns and debt analysis with enhanced validation
    const getSmartSuggestions = () => {
        const suggestions = [];
        
        // Validation: Check for data completeness
        if (!monthlyIncome || monthlyIncome === 0) {
            suggestions.push(language === 'he' ? 
                'הוסף מידע על הכנסה חודשית בשלב 2 לקבלת המלצות מדויקות' :
                'Add monthly income information in Step 2 for accurate recommendations');
            return suggestions;
        }
        
        // Check for negative cash flow (critical validation)
        const netIncome = monthlyIncome - totalExpenses - totalDebtPayments;
        if (netIncome < 0) {
            suggestions.push(t.suggestions.negativeIncome);
            return suggestions; // Critical situation - only show this warning
        }
        
        // Validation: Check for extremely low income vs expenses
        if (totalExpenses > monthlyIncome * 0.9) {
            suggestions.push(language === 'he' ? 
                'ההוצאות שלך כמעט שוות להכנסה - שקול לצמצם הוצאות או להגדיל הכנסה' :
                'Your expenses nearly equal your income - consider reducing expenses or increasing income');
        }
        
        // Check housing expenses (typically should be < 30% of income)
        if (inputs.expenses?.housing > monthlyIncome * 0.3) {
            suggestions.push(t.suggestions.highHousing);
        }
        
        // Enhanced debt analysis with specific recommendations
        if (debtToIncomeRatio <= 10) {
            suggestions.push(t.suggestions.lowDebt);
        } else if (debtToIncomeRatio <= 20) {
            suggestions.push(t.suggestions.moderateDebt);
            
            // Specific credit card debt warning
            if (inputs.expenses?.creditCard > inputs.expenses?.mortgage) {
                suggestions.push(language === 'he' ? 
                    'חוב כרטיסי האשראי גבוה מהמשכנתא - שקול להעביר לחוב עם ריבית נמוכה יותר' :
                    'Credit card debt is higher than mortgage - consider transferring to lower-interest debt');
            }
        } else if (debtToIncomeRatio <= 35) {
            suggestions.push(t.suggestions.highDebt);
        } else if (debtToIncomeRatio > 35) {
            suggestions.push(t.suggestions.criticalDebt);
        }
        
        // Add debt duration awareness
        if (totalDebtPayments > 0 && (inputs.expenses?.mortgage > 0 || inputs.expenses?.carLoan > 0)) {
            suggestions.push(t.suggestions.debtDurationNote);
        }
        
        // Enhanced savings rate analysis
        if (savingsRate >= 20) {
            suggestions.push(t.suggestions.goodSavings);
        } else if (savingsRate < 10) {
            suggestions.push(t.suggestions.lowSavings);
        } else if (debtToIncomeRatio <= 10) {
            suggestions.push(t.suggestions.balanced);
        }
        
        // Validation: Check for unusually high individual expense categories
        if (inputs.expenses) {
            const expenseWarnings = [];
            
            if (inputs.expenses.transportation > monthlyIncome * 0.2) {
                expenseWarnings.push(language === 'he' ? 
                    'הוצאות התחבורה גבוהות מהממוצע (>20% מההכנסה)' :
                    'Transportation expenses are above average (>20% of income)');
            }
            
            if (inputs.expenses.food > monthlyIncome * 0.15) {
                expenseWarnings.push(language === 'he' ? 
                    'הוצאות מזון גבוהות מהממוצע (>15% מההכנסה)' :
                    'Food expenses are above average (>15% of income)');
            }
            
            suggestions.push(...expenseWarnings);
        }
        
        // Edge case: Very low debt with high savings potential
        if (debtToIncomeRatio < 5 && savingsRate < 15) {
            suggestions.push(language === 'he' ? 
                'החוב שלך נמוך - זו הזדמנות מצוינת להגדיל את החיסכון לפרישה' :
                'Your debt is low - great opportunity to increase retirement savings');
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

    // Debt payment categories with icons
    const debtCategories = [
        { key: 'mortgage', label: t.mortgage, hint: t.mortgageHint, icon: '🏡', color: 'orange' },
        { key: 'carLoan', label: t.carLoan, hint: t.carLoanHint, icon: '🚙', color: 'orange' },
        { key: 'creditCard', label: t.creditCard, hint: t.creditCardHint, icon: '💳', color: 'red' },
        { key: 'otherDebt', label: t.otherDebt, hint: t.otherDebtHint, icon: '📋', color: 'orange' }
    ];

    // Debt balance categories with icons
    const debtBalanceCategories = [
        { key: 'mortgageBalance', label: t.mortgageBalance, hint: t.mortgageBalanceHint, icon: '🏡', color: 'orange' },
        { key: 'carLoanBalance', label: t.carLoanBalance, hint: t.carLoanBalanceHint, icon: '🚙', color: 'orange' },
        { key: 'creditCardBalance', label: t.creditCardBalance, hint: t.creditCardBalanceHint, icon: '💳', color: 'red' },
        { key: 'otherDebtBalance', label: t.otherDebtBalance, hint: t.otherDebtBalanceHint, icon: '📋', color: 'orange' }
    ];

    // Helper function to get debt color based on ratio
    const getDebtColor = (ratio) => {
        if (ratio <= 10) return 'green';
        if (ratio <= 20) return 'yellow';
        if (ratio <= 35) return 'orange';
        return 'red';
    };

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

        // Debt Payments Section
        React.createElement('div', {
            key: 'debt-payments-section',
            className: 'space-y-4'
        }, [
            // Debt section header
            React.createElement('div', {
                key: 'debt-header',
                className: 'border-t border-gray-200 pt-6'
            }, [
                React.createElement('h3', {
                    key: 'debt-title',
                    className: 'text-xl font-semibold text-gray-800 mb-2 flex items-center gap-3'
                }, [
                    React.createElement('span', { key: 'icon', className: 'text-2xl' }, '💰'),
                    t.debtPayments
                ]),
                React.createElement('p', {
                    key: 'debt-subtitle',
                    className: 'text-gray-600 text-sm mb-4'
                }, t.debtPaymentsSubtitle)
            ]),

            // Debt input fields
            ...debtCategories.map(category => 
                React.createElement('div', {
                    key: category.key,
                    className: 'bg-white p-4 rounded-lg shadow-sm border border-orange-200'
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
                                    htmlFor: `debt-${category.key}`,
                                    className: 'font-medium text-gray-800'
                                }, category.label),
                                React.createElement('p', {
                                    key: 'hint',
                                    className: 'text-sm text-gray-500'
                                }, category.hint)
                            ])
                        ])
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
                            id: `debt-${category.key}`,
                            type: 'number',
                            min: '0',
                            step: '100',
                            value: inputs.expenses?.[category.key] || '',
                            onChange: (e) => handleExpenseChange(category.key, e.target.value),
                            className: 'flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500',
                            placeholder: '0'
                        })
                    ])
                ])
            ),

            // Debt Summary
            totalDebtPayments > 0 && React.createElement('div', {
                key: 'debt-summary',
                className: `bg-${getDebtColor(debtToIncomeRatio)}-50 p-4 rounded-lg border border-${getDebtColor(debtToIncomeRatio)}-200`
            }, [
                React.createElement('div', {
                    key: 'debt-totals',
                    className: 'grid grid-cols-2 gap-4'
                }, [
                    React.createElement('div', {
                        key: 'total-debt'
                    }, [
                        React.createElement('p', {
                            key: 'label',
                            className: 'text-sm text-gray-600'
                        }, t.totalDebt),
                        React.createElement('p', {
                            key: 'value',
                            className: `text-xl font-bold text-${getDebtColor(debtToIncomeRatio)}-700`
                        }, formatCurrency ? formatCurrency(totalDebtPayments, workingCurrency) : `${workingCurrency} ${totalDebtPayments.toLocaleString()}`)
                    ]),
                    React.createElement('div', {
                        key: 'debt-ratio'
                    }, [
                        React.createElement('p', {
                            key: 'label',
                            className: 'text-sm text-gray-600'
                        }, t.debtToIncomeRatio),
                        React.createElement('p', {
                            key: 'value',
                            className: `text-xl font-bold text-${getDebtColor(debtToIncomeRatio)}-700`
                        }, `${debtToIncomeRatio.toFixed(1)}%`)
                    ])
                ])
            ])
        ]),

        // Debt Balances Section
        React.createElement('div', {
            key: 'debt-balances-section',
            className: 'bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg border border-red-200'
        }, [
            React.createElement('h3', {
                key: 'debt-balances-title',
                className: 'text-xl font-bold text-red-700 mb-2 flex items-center'
            }, [
                React.createElement('span', { key: 'icon', className: 'mr-3 text-2xl' }, '📊'),
                t.debtBalances
            ]),
            React.createElement('p', {
                key: 'debt-balances-subtitle',
                className: 'text-sm text-red-600 mb-4'
            }, t.debtBalancesSubtitle),

            // Debt Balance Categories
            React.createElement('div', {
                key: 'debt-balance-categories',
                className: 'space-y-4 mb-6'
            }, debtBalanceCategories.map(category => 
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
                                className: 'text-xl'
                            }, category.icon),
                            React.createElement('span', {
                                key: 'label',
                                className: 'font-medium text-gray-700'
                            }, category.label)
                        ]),
                        React.createElement('span', {
                            key: 'hint',
                            className: 'text-xs text-gray-500'
                        }, category.hint)
                    ]),
                    React.createElement('input', {
                        key: 'input',
                        type: 'number',
                        min: '0',
                        value: inputs.debtBalances?.[category.key] || 0,
                        onChange: (e) => {
                            const newDebtBalances = { ...inputs.debtBalances };
                            newDebtBalances[category.key] = parseFloat(e.target.value) || 0;
                            setInputs({ ...inputs, debtBalances: newDebtBalances });
                        },
                        className: `w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${category.color}-500 focus:border-transparent`
                    })
                ])
            )),

            // Total Debt Balance
            totalDebtBalances > 0 && React.createElement('div', {
                key: 'total-debt-balance',
                className: 'bg-white p-4 rounded-lg border border-red-300'
            }, [
                React.createElement('div', {
                    key: 'total-header',
                    className: 'flex justify-between items-center mb-2'
                }, [
                    React.createElement('h4', {
                        key: 'total-label',
                        className: 'font-semibold text-red-700'
                    }, t.totalDebtBalance),
                    React.createElement('div', {
                        key: 'total-amount',
                        className: 'text-xl font-bold text-red-800'
                    }, formatCurrency ? formatCurrency(totalDebtBalances, workingCurrency) : `${workingCurrency} ${totalDebtBalances.toLocaleString()}`)
                ])
            ])
        ]),

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
                    }, formatCurrency ? formatCurrency(monthlyIncome - totalExpenses - totalDebtPayments, workingCurrency) : `${workingCurrency} ${(monthlyIncome - totalExpenses - totalDebtPayments).toLocaleString()}`)
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