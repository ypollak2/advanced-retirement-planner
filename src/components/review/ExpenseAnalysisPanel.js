// ExpenseAnalysisPanel.js - Expense Analysis and Budget Optimization Component
// Extracted from WizardStepReview.js for better modularity

const ExpenseAnalysisPanel = ({ inputs, language = 'en', workingCurrency = 'ILS' }) => {
    const createElement = React.createElement;
    
    // Multi-language content
    const content = {
        he: {
            expenseAnalysis: 'ניתוח הוצאות',
            budgetOptimization: 'אופטימיזציה תקציבית',
            categoryBreakdown: 'פירוט לפי קטגוריה',
            monthlyExpenses: 'הוצאות חודשיות',
            expenseRatios: 'יחסי הוצאות',
            recommendations: 'המלצות לחיסכון',
            
            // Categories
            housing: 'דיור',
            transportation: 'תחבורה',
            food: 'מזון',
            insurance: 'ביטוח',
            other: 'אחר',
            debt: 'חובות',
            
            // Analysis
            totalExpenses: 'סה"כ הוצאות',
            expenseToIncomeRatio: 'יחס הוצאות להכנסה',
            highestCategory: 'קטגוריה גבוהה ביותר',
            savingsPotential: 'פוטנציאל חיסכון',
            
            // Status
            excellent: 'מעולה',
            good: 'טוב',
            moderate: 'בינוני',
            needsWork: 'דורש עבודה',
            
            // Recommendations
            reduceHousing: 'שקול אפשרויות דיור חסכוניות יותר',
            optimizeTransport: 'אופטימיזציה של הוצאות תחבורה',
            budgetFood: 'תכנון תקציב מזון חודשי',
            reviewInsurance: 'סקירת פוליסות ביטוח',
            eliminateWaste: 'ביטול הוצאות מיותרות',
            
            // No data
            noExpenseData: 'לא הוגדרו נתוני הוצאות',
            enterExpensesStep3: 'הזן נתוני הוצאות בשלב 3 לקבלת ניתוח מפורט'
        },
        en: {
            expenseAnalysis: 'Expense Analysis',
            budgetOptimization: 'Budget Optimization',
            categoryBreakdown: 'Category Breakdown',
            monthlyExpenses: 'Monthly Expenses',
            expenseRatios: 'Expense Ratios',
            recommendations: 'Savings Recommendations',
            
            // Categories
            housing: 'Housing',
            transportation: 'Transportation',
            food: 'Food',
            insurance: 'Insurance',
            other: 'Other',
            debt: 'Debt',
            
            // Analysis
            totalExpenses: 'Total Expenses',
            expenseToIncomeRatio: 'Expense-to-Income Ratio',
            highestCategory: 'Highest Category',
            savingsPotential: 'Savings Potential',
            
            // Status
            excellent: 'Excellent',
            good: 'Good',
            moderate: 'Moderate',
            needsWork: 'Needs Work',
            
            // Recommendations
            reduceHousing: 'Consider more affordable housing options',
            optimizeTransport: 'Optimize transportation expenses',
            budgetFood: 'Plan monthly food budget',
            reviewInsurance: 'Review insurance policies',
            eliminateWaste: 'Eliminate unnecessary expenses',
            
            // No data
            noExpenseData: 'No expense data defined',
            enterExpensesStep3: 'Enter expense data in Step 3 for detailed analysis'
        }
    };
    
    const t = content[language] || content.en;
    
    // Check if expense data exists
    if (!inputs.expenses) {
        return createElement('div', {
            className: "bg-yellow-50 rounded-lg p-6 border border-yellow-200 mb-6"
        }, [
            createElement('h3', {
                key: 'title',
                className: "text-xl font-semibold text-yellow-800 mb-4 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '💰'),
                t.expenseAnalysis
            ]),
            createElement('div', {
                key: 'no-data',
                className: "text-center"
            }, [
                createElement('div', {
                    key: 'message',
                    className: "text-yellow-700 mb-2"
                }, t.noExpenseData),
                createElement('div', {
                    key: 'instruction',
                    className: "text-sm text-yellow-600"
                }, t.enterExpensesStep3)
            ])
        ]);
    }
    
    // Calculate monthly income
    // Calculate net (after-tax) income for expense analysis
    const monthlyIncome = React.useMemo(() => {
        let grossIncome = 0;
        let netIncome = 0;
        
        if (inputs.planningType === 'couple') {
            // For couple mode, calculate net income for each partner
            const partner1Gross = parseFloat(inputs.partner1Salary) || 0;
            const partner2Gross = parseFloat(inputs.partner2Salary) || 0;
            grossIncome = partner1Gross + partner2Gross;
            
            if (window.TaxCalculators && window.TaxCalculators.calculateIsraeliTax) {
                const partner1Tax = window.TaxCalculators.calculateIsraeliTax(partner1Gross);
                const partner2Tax = window.TaxCalculators.calculateIsraeliTax(partner2Gross);
                netIncome = (partner1Tax?.netSalary || partner1Gross) + (partner2Tax?.netSalary || partner2Gross);
            } else {
                // Fallback: estimate 25% tax rate
                netIncome = grossIncome * 0.75;
            }
        } else {
            // Individual mode
            grossIncome = parseFloat(inputs.currentMonthlySalary) || 0;
            
            if (window.TaxCalculators && window.TaxCalculators.calculateIsraeliTax) {
                const taxResult = window.TaxCalculators.calculateIsraeliTax(grossIncome);
                netIncome = taxResult?.netSalary || grossIncome;
            } else {
                // Fallback: estimate 25% tax rate
                netIncome = grossIncome * 0.75;
            }
        }
        
        return netIncome;
    }, [inputs.planningType, inputs.partner1Salary, inputs.partner2Salary, inputs.currentMonthlySalary]);
    
    // Check if expense analysis function is available
    if (!window.analyzeExpenseRatios) {
        // Fallback analysis
        const expenseCategories = ['housing', 'transportation', 'food', 'insurance', 'other'];
        const debtCategories = ['mortgage', 'carLoan', 'creditCard', 'otherDebt'];
        
        const totalLivingExpenses = expenseCategories.reduce((sum, category) => 
            sum + (parseFloat(inputs.expenses[category]) || 0), 0);
        const totalDebtPayments = debtCategories.reduce((sum, category) => 
            sum + (parseFloat(inputs.expenses[category]) || 0), 0);
        const totalExpenses = totalLivingExpenses + totalDebtPayments;
        
        const expenseToIncomeRatio = monthlyIncome > 0 ? (totalExpenses / monthlyIncome) * 100 : 0;
        
        return createElement('div', {
            className: "bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200 mb-6"
        }, [
            createElement('h3', {
                key: 'title',
                className: "text-xl font-semibold text-green-800 mb-4 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '💰'),
                t.expenseAnalysis
            ]),
            createElement('div', {
                key: 'basic-analysis',
                className: "text-center"
            }, [
                createElement('div', {
                    key: 'total-expenses',
                    className: "text-2xl font-bold text-green-700 mb-2"
                }, `₪${totalExpenses.toLocaleString()}`),
                createElement('div', {
                    key: 'ratio',
                    className: "text-lg text-green-600"
                }, `${expenseToIncomeRatio.toFixed(1)}% of net income`)
            ])
        ]);
    }
    
    const expenseAnalysis = window.analyzeExpenseRatios(inputs.expenses, monthlyIncome, language);
    
    // Currency formatter
    const formatCurrency = (amount) => {
        const symbol = workingCurrency === 'ILS' ? '₪' : workingCurrency;
        return `${symbol}${Math.round(amount).toLocaleString()}`;
    };
    
    // Get status color
    const getStatusColor = (ratio) => {
        if (ratio <= 60) return 'green';
        if (ratio <= 75) return 'yellow';
        if (ratio <= 90) return 'orange';
        return 'red';
    };
    
    // Get status label
    const getStatusLabel = (ratio) => {
        if (ratio <= 60) return t.excellent;
        if (ratio <= 75) return t.good;
        if (ratio <= 90) return t.moderate;
        return t.needsWork;
    };
    
    const totalExpenseRatio = expenseAnalysis.totalExpenseRatio || 0;
    const statusColor = getStatusColor(totalExpenseRatio);
    const statusLabel = getStatusLabel(totalExpenseRatio);
    
    return createElement('div', {
        className: "bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200 mb-6"
    }, [
        // Header
        createElement('h3', {
            key: 'title',
            className: "text-xl font-semibold text-green-800 mb-4 flex items-center"
        }, [
            createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '💰'),
            t.expenseAnalysis
        ]),
        
        // Overall expense ratio
        createElement('div', {
            key: 'overall-ratio',
            className: `bg-${statusColor}-100 rounded-lg p-4 mb-6 border border-${statusColor}-200`
        }, [
            createElement('div', {
                key: 'ratio-display',
                className: "text-center"
            }, [
                createElement('div', {
                    key: 'ratio-number',
                    className: `text-3xl font-bold text-${statusColor}-700`
                }, `${totalExpenseRatio.toFixed(1)}%`),
                createElement('div', {
                    key: 'ratio-label',
                    className: `text-lg font-medium text-${statusColor}-600 mt-1`
                }, t.expenseToIncomeRatio),
                createElement('div', {
                    key: 'ratio-status',
                    className: `text-sm text-${statusColor}-600 mt-1`
                }, statusLabel),
                createElement('div', {
                    key: 'based-on-net',
                    className: "text-xs text-gray-500 mt-2 italic"
                }, language === 'he' ? '* מבוסס על הכנסה נטו (אחרי מס)' : '* Based on net (after-tax) income')
            ])
        ]),
        
        // Category breakdown
        expenseAnalysis.categoryBreakdown && createElement('div', {
            key: 'category-breakdown',
            className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6"
        }, Object.entries(expenseAnalysis.categoryBreakdown).map(([category, data]) => {
            const categoryColor = data.ratio > 30 ? 'red' : data.ratio > 20 ? 'orange' : data.ratio > 10 ? 'yellow' : 'green';
            
            return createElement('div', {
                key: category,
                className: "bg-white rounded-lg p-3 border border-green-100 text-center"
            }, [
                createElement('div', {
                    key: 'category-name',
                    className: "text-sm font-medium text-gray-700 mb-1"
                }, t[category] || category),
                createElement('div', {
                    key: 'category-amount',
                    className: "text-lg font-bold text-green-700"
                }, formatCurrency(data.amount)),
                createElement('div', {
                    key: 'category-ratio',
                    className: `text-sm text-${categoryColor}-600`
                }, `${data.ratio.toFixed(1)}%`)
            ]);
        })),
        
        // Highest category highlight
        expenseAnalysis.highestCategory && createElement('div', {
            key: 'highest-category',
            className: "bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200"
        }, [
            createElement('h4', {
                key: 'highest-title',
                className: "font-semibold text-blue-800 mb-2"
            }, t.highestCategory),
            createElement('div', {
                key: 'highest-details',
                className: "flex justify-between items-center"
            }, [
                createElement('span', {
                    key: 'category',
                    className: "text-blue-700"
                }, t[expenseAnalysis.highestCategory.category] || expenseAnalysis.highestCategory.category),
                createElement('div', {
                    key: 'values',
                    className: "text-right"
                }, [
                    createElement('div', {
                        key: 'amount',
                        className: "font-bold text-blue-800"
                    }, formatCurrency(expenseAnalysis.highestCategory.amount)),
                    createElement('div', {
                        key: 'percentage',
                        className: "text-sm text-blue-600"
                    }, `${expenseAnalysis.highestCategory.percentage.toFixed(1)}% of income`)
                ])
            ])
        ]),
        
        // Savings potential
        expenseAnalysis.savingsPotential && createElement('div', {
            key: 'savings-potential',
            className: "bg-orange-50 rounded-lg p-4 mb-6 border border-orange-200"
        }, [
            createElement('h4', {
                key: 'savings-title',
                className: "font-semibold text-orange-800 mb-2 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-2" }, '💡'),
                t.savingsPotential
            ]),
            createElement('div', {
                key: 'savings-amount',
                className: "text-xl font-bold text-orange-700 text-center"
            }, formatCurrency(expenseAnalysis.savingsPotential.amount)),
            createElement('div', {
                key: 'savings-description',
                className: "text-sm text-orange-600 text-center mt-1"
            }, expenseAnalysis.savingsPotential.description || 'Potential monthly savings')
        ]),
        
        // Recommendations
        // Add note about net income calculation
        createElement('div', {
            key: 'net-income-note',
            className: 'text-sm text-gray-600 italic mb-4'
        }, language === 'he' ? 
            '* הניתוח מבוסס על הכנסה נטו (אחרי מס)' : 
            '* Analysis based on net (after-tax) income'),
        
        expenseAnalysis.recommendations && expenseAnalysis.recommendations.length > 0 && createElement('div', {
            key: 'recommendations',
            className: "p-4 bg-yellow-50 rounded-lg border border-yellow-200"
        }, [
            createElement('h4', {
                key: 'rec-title',
                className: "font-semibold text-yellow-800 mb-3 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-2" }, '📝'),
                t.recommendations
            ]),
            createElement('ul', {
                key: 'rec-list',
                className: "space-y-2"
            }, expenseAnalysis.recommendations.map((recommendation, index) => 
                createElement('li', {
                    key: `rec-${index}`,
                    className: "flex items-start text-sm text-yellow-700"
                }, [
                    createElement('span', { key: 'bullet', className: "mr-2 mt-0.5" }, '•'),
                    createElement('span', { key: 'text' }, 
                        typeof recommendation === 'object' ? 
                            (recommendation.message || recommendation.text || JSON.stringify(recommendation)) : 
                            recommendation
                    )
                ])
            ))
        ]),
        
        // Additional insights
        createElement('div', {
            key: 'insights',
            className: "mt-4 p-3 bg-white rounded-lg border border-green-100"
        }, [
            createElement('div', {
                key: 'insights-grid',
                className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
            }, [
                createElement('div', {
                    key: 'income-info',
                    className: "flex justify-between"
                }, [
                    createElement('span', { key: 'label' }, 'Monthly Income:'),
                    createElement('span', { key: 'value', className: "font-medium" }, formatCurrency(monthlyIncome))
                ]),
                createElement('div', {
                    key: 'expenses-info',
                    className: "flex justify-between"
                }, [
                    createElement('span', { key: 'label' }, 'Total Expenses:'),
                    createElement('span', { key: 'value', className: "font-medium" }, formatCurrency(expenseAnalysis.totalExpenses || 0))
                ]),
                createElement('div', {
                    key: 'available-info',
                    className: "flex justify-between"
                }, [
                    createElement('span', { key: 'label' }, 'Available for Savings:'),
                    createElement('span', { 
                        key: 'value', 
                        className: `font-medium ${monthlyIncome - (expenseAnalysis.totalExpenses || 0) > 0 ? 'text-green-600' : 'text-red-600'}`
                    }, formatCurrency(monthlyIncome - (expenseAnalysis.totalExpenses || 0)))
                ]),
                createElement('div', {
                    key: 'target-info',
                    className: "flex justify-between"
                }, [
                    createElement('span', { key: 'label' }, 'Target Expense Ratio:'),
                    createElement('span', { key: 'value', className: "font-medium text-green-600" }, '≤70%')
                ])
            ])
        ])
    ]);
};

// Export to window for global access
window.ExpenseAnalysisPanel = ExpenseAnalysisPanel;

console.log('✅ ExpenseAnalysisPanel component loaded successfully');