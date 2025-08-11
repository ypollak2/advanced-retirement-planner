// Comprehensive Financial Summary Panel
// Shows detailed Income/Expense/Tax breakdown with professional formatting
// Created by Yali Pollak (יהלי פולק) - v7.5.8

const ComprehensiveFinancialSummary = ({ inputs, language, workingCurrency }) => {
    const isCoupleMode = inputs.planningType === 'couple';
    
    // Calculate income breakdown
    const calculateIncomeBreakdown = () => {
        const breakdown = {
            salaries: 0,
            bonuses: 0,
            rsu: 0,
            freelance: 0,
            rental: 0,
            dividends: 0,
            other: 0
        };
        
        if (isCoupleMode) {
            // Partner 1
            breakdown.salaries += parseFloat(inputs.partner1Salary || 0);
            breakdown.bonuses += parseFloat(inputs.partner1AnnualBonus || 0) / 12;
            breakdown.rsu += parseFloat(inputs.partner1QuarterlyRSU || 0) / 3;
            breakdown.freelance += parseFloat(inputs.partner1FreelanceIncome || 0);
            breakdown.rental += parseFloat(inputs.partner1RentalIncome || 0);
            breakdown.dividends += parseFloat(inputs.partner1DividendIncome || 0);
            
            // Partner 2
            breakdown.salaries += parseFloat(inputs.partner2Salary || 0);
            breakdown.bonuses += parseFloat(inputs.partner2AnnualBonus || 0) / 12;
            breakdown.rsu += parseFloat(inputs.partner2QuarterlyRSU || 0) / 3;
            breakdown.freelance += parseFloat(inputs.partner2FreelanceIncome || 0);
            breakdown.rental += parseFloat(inputs.partner2RentalIncome || 0);
            breakdown.dividends += parseFloat(inputs.partner2DividendIncome || 0);
        } else {
            breakdown.salaries = parseFloat(inputs.currentSalary || inputs.currentMonthlySalary || 0);
            breakdown.bonuses = parseFloat(inputs.annualBonus || 0) / 12;
            breakdown.rsu = parseFloat(inputs.quarterlyRSU || 0) / 3;
            breakdown.freelance = parseFloat(inputs.freelanceIncome || 0);
            breakdown.rental = parseFloat(inputs.rentalIncome || 0);
            breakdown.dividends = parseFloat(inputs.dividendIncome || 0);
        }
        
        breakdown.total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
        return breakdown;
    };
    
    // Calculate expense breakdown
    const calculateExpenseBreakdown = () => {
        const categories = {
            housing: { name: language === 'he' ? 'דיור' : 'Housing', amount: 0 },
            transportation: { name: language === 'he' ? 'תחבורה' : 'Transportation', amount: 0 },
            food: { name: language === 'he' ? 'מזון' : 'Food & Groceries', amount: 0 },
            healthcare: { name: language === 'he' ? 'בריאות' : 'Healthcare', amount: 0 },
            education: { name: language === 'he' ? 'חינוך' : 'Education', amount: 0 },
            entertainment: { name: language === 'he' ? 'בילויים' : 'Entertainment', amount: 0 },
            insurance: { name: language === 'he' ? 'ביטוח' : 'Insurance', amount: 0 },
            savings: { name: language === 'he' ? 'חיסכון' : 'Savings', amount: 0 },
            debt: { name: language === 'he' ? 'חובות' : 'Debt Payments', amount: 0 },
            other: { name: language === 'he' ? 'אחר' : 'Other', amount: 0 }
        };
        
        // Map expense fields to categories
        if (inputs.expenses) {
            // Housing
            categories.housing.amount = parseFloat(inputs.expenses.rent || 0) +
                                       parseFloat(inputs.expenses.mortgagePayment || 0) +
                                       parseFloat(inputs.expenses.utilities || 0) +
                                       parseFloat(inputs.expenses.propertyTax || 0) +
                                       parseFloat(inputs.expenses.homeInsurance || 0);
            
            // Transportation
            categories.transportation.amount = parseFloat(inputs.expenses.carLoan || 0) +
                                             parseFloat(inputs.expenses.carInsurance || 0) +
                                             parseFloat(inputs.expenses.fuel || 0) +
                                             parseFloat(inputs.expenses.publicTransport || 0) +
                                             parseFloat(inputs.expenses.carMaintenance || 0);
            
            // Food
            categories.food.amount = parseFloat(inputs.expenses.groceries || 0) +
                                    parseFloat(inputs.expenses.diningOut || 0);
            
            // Healthcare
            categories.healthcare.amount = parseFloat(inputs.expenses.healthInsurance || 0) +
                                          parseFloat(inputs.expenses.medications || 0) +
                                          parseFloat(inputs.expenses.medicalExpenses || 0);
            
            // Education
            categories.education.amount = parseFloat(inputs.expenses.tuition || 0) +
                                         parseFloat(inputs.expenses.childcare || 0) +
                                         parseFloat(inputs.expenses.courses || 0);
            
            // Entertainment
            categories.entertainment.amount = parseFloat(inputs.expenses.entertainment || 0) +
                                            parseFloat(inputs.expenses.hobbies || 0) +
                                            parseFloat(inputs.expenses.subscriptions || 0) +
                                            parseFloat(inputs.expenses.vacations || 0);
            
            // Insurance (other than home/car/health)
            categories.insurance.amount = parseFloat(inputs.expenses.lifeInsurance || 0) +
                                         parseFloat(inputs.expenses.disabilityInsurance || 0);
            
            // Debt
            categories.debt.amount = parseFloat(inputs.expenses.creditCard || 0) +
                                    parseFloat(inputs.expenses.studentLoans || 0) +
                                    parseFloat(inputs.expenses.otherDebt || 0);
            
            // Other
            categories.other.amount = parseFloat(inputs.expenses.clothing || 0) +
                                     parseFloat(inputs.expenses.personalCare || 0) +
                                     parseFloat(inputs.expenses.pets || 0) +
                                     parseFloat(inputs.expenses.charity || 0) +
                                     parseFloat(inputs.expenses.other || 0);
        } else {
            // Fallback to simple expense tracking
            const totalExpenses = isCoupleMode ? 
                parseFloat(inputs.sharedMonthlyExpenses || 0) + 
                parseFloat(inputs.partner1MonthlyExpenses || 0) + 
                parseFloat(inputs.partner2MonthlyExpenses || 0) :
                parseFloat(inputs.currentMonthlyExpenses || 0);
            
            categories.other.amount = totalExpenses;
        }
        
        const total = Object.values(categories).reduce((sum, cat) => sum + cat.amount, 0);
        return { categories, total };
    };
    
    // Calculate tax breakdown
    const calculateTaxBreakdown = () => {
        const taxes = {
            incomeTax: 0,
            nationalInsurance: 0,
            healthTax: 0,
            capitalGainsTax: 0,
            total: 0
        };
        
        // Use TaxCalculators if available
        if (window.TaxCalculators && window.TaxCalculators.calculateMonthlyTax) {
            const income = calculateIncomeBreakdown();
            
            if (isCoupleMode) {
                // Calculate for each partner
                const partner1Income = {
                    salary: parseFloat(inputs.partner1Salary || 0),
                    annualBonus: parseFloat(inputs.partner1AnnualBonus || 0),
                    quarterlyRSU: parseFloat(inputs.partner1QuarterlyRSU || 0)
                };
                
                const partner2Income = {
                    salary: parseFloat(inputs.partner2Salary || 0),
                    annualBonus: parseFloat(inputs.partner2AnnualBonus || 0),
                    quarterlyRSU: parseFloat(inputs.partner2QuarterlyRSU || 0)
                };
                
                const partner1Tax = window.TaxCalculators.calculateMonthlyTax(partner1Income.salary, partner1Income);
                const partner2Tax = window.TaxCalculators.calculateMonthlyTax(partner2Income.salary, partner2Income);
                
                taxes.incomeTax = partner1Tax.incomeTax + partner2Tax.incomeTax;
                taxes.nationalInsurance = partner1Tax.nationalInsurance + partner2Tax.nationalInsurance;
                taxes.healthTax = partner1Tax.healthTax + partner2Tax.healthTax;
            } else {
                const monthlyTax = window.TaxCalculators.calculateMonthlyTax(income.salaries, {
                    annualBonus: parseFloat(inputs.annualBonus || 0),
                    quarterlyRSU: parseFloat(inputs.quarterlyRSU || 0)
                });
                
                taxes.incomeTax = monthlyTax.incomeTax;
                taxes.nationalInsurance = monthlyTax.nationalInsurance;
                taxes.healthTax = monthlyTax.healthTax;
            }
            
            // Add capital gains tax on portfolio income
            const portfolioTaxRate = parseFloat(inputs.personalPortfolioTaxRate || 25) / 100;
            const monthlyPortfolioIncome = parseFloat(inputs.personalPortfolioMonthly || 0);
            taxes.capitalGainsTax = monthlyPortfolioIncome * portfolioTaxRate;
        } else {
            // Fallback: estimate 30% total tax rate
            const grossIncome = calculateIncomeBreakdown().total;
            taxes.total = grossIncome * 0.3;
        }
        
        taxes.total = taxes.incomeTax + taxes.nationalInsurance + taxes.healthTax + taxes.capitalGainsTax;
        return taxes;
    };
    
    const income = calculateIncomeBreakdown();
    const expenses = calculateExpenseBreakdown();
    const taxes = calculateTaxBreakdown();
    
    const netIncome = income.total - taxes.total;
    const disposableIncome = netIncome - expenses.total;
    const savingsRate = income.total > 0 ? (disposableIncome / income.total) * 100 : 0;
    const expenseRatio = income.total > 0 ? (expenses.total / income.total) * 100 : 0;
    
    const content = {
        he: {
            title: 'סיכום פיננסי מקיף',
            income: 'הכנסות',
            expenses: 'הוצאות',
            taxes: 'מיסים',
            salaries: 'משכורות',
            bonuses: 'בונוסים (חודשי)',
            rsu: 'RSU (חודשי)',
            freelance: 'עצמאי',
            rental: 'השכרה',
            dividends: 'דיבידנדים',
            other: 'אחר',
            total: 'סה"כ',
            incomeTax: 'מס הכנסה',
            nationalInsurance: 'ביטוח לאומי',
            healthTax: 'מס בריאות',
            capitalGainsTax: 'מס רווחי הון',
            netIncome: 'הכנסה נטו',
            disposableIncome: 'הכנסה פנויה',
            savingsRate: 'שיעור חיסכון',
            expenseRatio: 'יחס הוצאות להכנסה'
        },
        en: {
            title: 'Comprehensive Financial Summary',
            income: 'Income',
            expenses: 'Expenses',
            taxes: 'Taxes',
            salaries: 'Salaries',
            bonuses: 'Bonuses (Monthly)',
            rsu: 'RSU (Monthly)',
            freelance: 'Freelance',
            rental: 'Rental',
            dividends: 'Dividends',
            other: 'Other',
            total: 'Total',
            incomeTax: 'Income Tax',
            nationalInsurance: 'National Insurance',
            healthTax: 'Health Tax',
            capitalGainsTax: 'Capital Gains Tax',
            netIncome: 'Net Income',
            disposableIncome: 'Disposable Income',
            savingsRate: 'Savings Rate',
            expenseRatio: 'Expense-to-Income Ratio'
        }
    };
    
    const t = content[language] || content.en;
    
    return React.createElement('div', {
        className: 'bg-white rounded-lg shadow-lg p-6 mb-6'
    }, [
        React.createElement('h3', {
            key: 'title',
            className: 'text-xl font-bold mb-6 text-gray-800'
        }, t.title),
        
        // Income Section
        React.createElement('div', {
            key: 'income-section',
            className: 'mb-6'
        }, [
            React.createElement('h4', {
                key: 'income-title',
                className: 'text-lg font-semibold mb-3 text-green-700'
            }, `${t.income} (${t.total}: ${window.formatCurrency(income.total, workingCurrency)})`),
            
            React.createElement('div', {
                key: 'income-breakdown',
                className: 'space-y-2'
            }, [
                income.salaries > 0 && React.createElement('div', {
                    key: 'salaries',
                    className: 'flex justify-between text-sm'
                }, [
                    React.createElement('span', { key: 'label' }, t.salaries),
                    React.createElement('span', { key: 'value', className: 'font-medium' }, 
                        window.formatCurrency(income.salaries, workingCurrency))
                ]),
                
                income.bonuses > 0 && React.createElement('div', {
                    key: 'bonuses',
                    className: 'flex justify-between text-sm'
                }, [
                    React.createElement('span', { key: 'label' }, t.bonuses),
                    React.createElement('span', { key: 'value', className: 'font-medium' }, 
                        window.formatCurrency(income.bonuses, workingCurrency))
                ]),
                
                income.rsu > 0 && React.createElement('div', {
                    key: 'rsu',
                    className: 'flex justify-between text-sm'
                }, [
                    React.createElement('span', { key: 'label' }, t.rsu),
                    React.createElement('span', { key: 'value', className: 'font-medium' }, 
                        window.formatCurrency(income.rsu, workingCurrency))
                ]),
                
                income.freelance > 0 && React.createElement('div', {
                    key: 'freelance',
                    className: 'flex justify-between text-sm'
                }, [
                    React.createElement('span', { key: 'label' }, t.freelance),
                    React.createElement('span', { key: 'value', className: 'font-medium' }, 
                        window.formatCurrency(income.freelance, workingCurrency))
                ]),
                
                income.rental > 0 && React.createElement('div', {
                    key: 'rental',
                    className: 'flex justify-between text-sm'
                }, [
                    React.createElement('span', { key: 'label' }, t.rental),
                    React.createElement('span', { key: 'value', className: 'font-medium' }, 
                        window.formatCurrency(income.rental, workingCurrency))
                ]),
                
                income.dividends > 0 && React.createElement('div', {
                    key: 'dividends',
                    className: 'flex justify-between text-sm'
                }, [
                    React.createElement('span', { key: 'label' }, t.dividends),
                    React.createElement('span', { key: 'value', className: 'font-medium' }, 
                        window.formatCurrency(income.dividends, workingCurrency))
                ])
            ])
        ]),
        
        // Expense Section
        React.createElement('div', {
            key: 'expense-section',
            className: 'mb-6'
        }, [
            React.createElement('h4', {
                key: 'expense-title',
                className: 'text-lg font-semibold mb-3 text-red-700'
            }, `${t.expenses} (${t.total}: ${window.formatCurrency(expenses.total, workingCurrency)})`),
            
            React.createElement('div', {
                key: 'expense-breakdown',
                className: 'space-y-2'
            }, Object.entries(expenses.categories).map(([key, category]) => 
                category.amount > 0 && React.createElement('div', {
                    key: key,
                    className: 'flex justify-between text-sm'
                }, [
                    React.createElement('span', { key: 'label' }, category.name),
                    React.createElement('span', { key: 'value', className: 'font-medium' }, 
                        window.formatCurrency(category.amount, workingCurrency))
                ])
            ))
        ]),
        
        // Tax Section
        React.createElement('div', {
            key: 'tax-section',
            className: 'mb-6'
        }, [
            React.createElement('h4', {
                key: 'tax-title',
                className: 'text-lg font-semibold mb-3 text-orange-700'
            }, `${t.taxes} (${t.total}: ${window.formatCurrency(taxes.total, workingCurrency)})`),
            
            React.createElement('div', {
                key: 'tax-breakdown',
                className: 'space-y-2'
            }, [
                taxes.incomeTax > 0 && React.createElement('div', {
                    key: 'income-tax',
                    className: 'flex justify-between text-sm'
                }, [
                    React.createElement('span', { key: 'label' }, t.incomeTax),
                    React.createElement('span', { key: 'value', className: 'font-medium' }, 
                        window.formatCurrency(taxes.incomeTax, workingCurrency))
                ]),
                
                taxes.nationalInsurance > 0 && React.createElement('div', {
                    key: 'national-insurance',
                    className: 'flex justify-between text-sm'
                }, [
                    React.createElement('span', { key: 'label' }, t.nationalInsurance),
                    React.createElement('span', { key: 'value', className: 'font-medium' }, 
                        window.formatCurrency(taxes.nationalInsurance, workingCurrency))
                ]),
                
                taxes.healthTax > 0 && React.createElement('div', {
                    key: 'health-tax',
                    className: 'flex justify-between text-sm'
                }, [
                    React.createElement('span', { key: 'label' }, t.healthTax),
                    React.createElement('span', { key: 'value', className: 'font-medium' }, 
                        window.formatCurrency(taxes.healthTax, workingCurrency))
                ]),
                
                taxes.capitalGainsTax > 0 && React.createElement('div', {
                    key: 'capital-gains-tax',
                    className: 'flex justify-between text-sm'
                }, [
                    React.createElement('span', { key: 'label' }, t.capitalGainsTax),
                    React.createElement('span', { key: 'value', className: 'font-medium' }, 
                        window.formatCurrency(taxes.capitalGainsTax, workingCurrency))
                ])
            ])
        ]),
        
        // Summary Section
        React.createElement('div', {
            key: 'summary-section',
            className: 'border-t pt-4 space-y-3'
        }, [
            React.createElement('div', {
                key: 'net-income',
                className: 'flex justify-between font-semibold'
            }, [
                React.createElement('span', { key: 'label' }, t.netIncome),
                React.createElement('span', { key: 'value', className: 'text-green-600' }, 
                    window.formatCurrency(netIncome, workingCurrency))
            ]),
            
            React.createElement('div', {
                key: 'disposable-income',
                className: 'flex justify-between font-semibold'
            }, [
                React.createElement('span', { key: 'label' }, t.disposableIncome),
                React.createElement('span', { 
                    key: 'value', 
                    className: disposableIncome >= 0 ? 'text-green-600' : 'text-red-600' 
                }, window.formatCurrency(disposableIncome, workingCurrency))
            ]),
            
            // Visual Expense Ratio Indicator
            React.createElement('div', {
                key: 'expense-ratio',
                className: 'mt-4'
            }, [
                React.createElement('div', {
                    key: 'ratio-label',
                    className: 'flex justify-between mb-2'
                }, [
                    React.createElement('span', { key: 'label', className: 'text-sm font-medium' }, t.expenseRatio),
                    React.createElement('span', { 
                        key: 'value', 
                        className: `text-sm font-bold ${
                            expenseRatio < 70 ? 'text-green-600' : 
                            expenseRatio < 85 ? 'text-yellow-600' : 'text-red-600'
                        }`
                    }, `${Math.round(expenseRatio)}%`)
                ]),
                
                React.createElement('div', {
                    key: 'ratio-bar',
                    className: 'w-full bg-gray-200 rounded-full h-6 relative overflow-hidden'
                }, [
                    React.createElement('div', {
                        key: 'ratio-fill',
                        className: `h-full transition-all duration-500 ${
                            expenseRatio < 70 ? 'bg-green-500' : 
                            expenseRatio < 85 ? 'bg-yellow-500' : 'bg-red-500'
                        }`,
                        style: { width: `${Math.min(expenseRatio, 100)}%` }
                    }),
                    React.createElement('div', {
                        key: 'ratio-text',
                        className: 'absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700'
                    }, `${Math.round(expenseRatio)}%`)
                ])
            ]),
            
            React.createElement('div', {
                key: 'savings-rate',
                className: 'flex justify-between font-semibold mt-3'
            }, [
                React.createElement('span', { key: 'label' }, t.savingsRate),
                React.createElement('span', { 
                    key: 'value', 
                    className: savingsRate >= 20 ? 'text-green-600' : 
                              savingsRate >= 10 ? 'text-yellow-600' : 'text-red-600'
                }, `${Math.round(savingsRate)}%`)
            ])
        ])
    ]);
};

// Export to window for global access
window.ComprehensiveFinancialSummary = ComprehensiveFinancialSummary;