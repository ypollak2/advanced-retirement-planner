// AdditionalIncomeTaxPanel.js - Additional Income Tax Analysis Component
// Extracted from WizardStepReview.js for better modularity

const AdditionalIncomeTaxPanel = ({ inputs, language = 'en', workingCurrency = 'ILS' }) => {
    const createElement = React.createElement;
    
    // Multi-language content
    const content = {
        he: {
            additionalIncomeTax: 'ניתוח מס על הכנסה נוספת',
            noAdditionalIncome: 'לא הוגדרה הכנסה נוספת',
            totalGross: 'סה"כ ברוטו',
            totalTax: 'סה"כ מס',
            totalNet: 'סה"כ נטו',
            effectiveRate: 'שיעור מס אפקטיבי',
            monthlyNet: 'נטו חודשי',
            
            // Income types
            bonusIncome: 'הכנסה מבונוס',
            otherIncome: 'הכנסות אחרות',
            
            // Details
            bonusGross: 'בונוס ברוטו',
            bonusTax: 'מס על בונוס',
            bonusNet: 'בונוס נטו',
            otherGross: 'אחר ברוטו',
            otherTax: 'מס אחר',
            otherNet: 'אחר נטו',
            
            // Tips
            taxOptimizationTip: 'טיפ: שקול לפזר הכנסה נוספת על פני מספר שנים להפחתת מס',
            pensionContributionAdvice: 'העלאת הפקדות לקרן פנסיה יכולה להפחית את המס על הכנסה נוספת'
        },
        en: {
            additionalIncomeTax: 'Additional Income Tax Analysis',
            noAdditionalIncome: 'No additional income defined',
            totalGross: 'Total Gross',
            totalTax: 'Total Tax',
            totalNet: 'Total Net',
            effectiveRate: 'Effective Tax Rate',
            monthlyNet: 'Monthly Net',
            
            // Income types
            bonusIncome: 'Bonus Income',
            otherIncome: 'Other Income',
            
            // Details
            bonusGross: 'Bonus Gross',
            bonusTax: 'Bonus Tax',
            bonusNet: 'Bonus Net',
            otherGross: 'Other Gross',
            otherTax: 'Other Tax',
            otherNet: 'Other Net',
            
            // Tips
            taxOptimizationTip: 'Tip: Consider spreading additional income over multiple years to reduce tax burden',
            pensionContributionAdvice: 'Increasing pension contributions can reduce tax on additional income'
        }
    };
    
    const t = content[language] || content.en;
    
    // Check if additional income tax calculations are available
    if (!window.AdditionalIncomeTax || !window.TaxCalculators) {
        return null;
    }
    
    const additionalTaxInfo = window.AdditionalIncomeTax.calculateTotalAdditionalIncomeTax(inputs);
    
    // Return null if no additional income
    if (!additionalTaxInfo || additionalTaxInfo.totalAdditionalIncome === 0) {
        return null;
    }
    
    const monthlyResult = window.AdditionalIncomeTax.getMonthlyAfterTaxAdditionalIncome(inputs);
    
    // Currency formatter
    const formatCurrency = (amount) => {
        const symbol = workingCurrency === 'ILS' ? '₪' : workingCurrency;
        return `${symbol}${Math.round(amount).toLocaleString()}`;
    };
    
    return createElement('div', {
        className: "bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200 mb-6"
    }, [
        // Header
        createElement('h3', {
            key: 'tax-breakdown-title',
            className: "text-xl font-semibold text-purple-800 mb-4 flex items-center"
        }, [
            createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '📊'),
            t.additionalIncomeTax
        ]),
        
        // Summary totals
        createElement('div', {
            key: 'tax-summary', 
            className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        }, [
            createElement('div', {
                key: 'total-gross', 
                className: "text-center p-3 bg-white rounded-lg border border-purple-100"
            }, [
                createElement('div', {
                    key: 'label',
                    className: "text-sm text-gray-600 mb-1"
                }, t.totalGross),
                createElement('div', {
                    key: 'value',
                    className: "text-lg font-bold text-purple-700"
                }, formatCurrency(additionalTaxInfo.totalAdditionalIncome))
            ]),
            
            createElement('div', {
                key: 'total-tax',
                className: "text-center p-3 bg-white rounded-lg border border-purple-100"
            }, [
                createElement('div', {
                    key: 'label',
                    className: "text-sm text-gray-600 mb-1"
                }, t.totalTax),
                createElement('div', {
                    key: 'value',
                    className: "text-lg font-bold text-red-600"
                }, formatCurrency(additionalTaxInfo.totalTax))
            ]),
            
            createElement('div', {
                key: 'total-net',
                className: "text-center p-3 bg-white rounded-lg border border-purple-100"
            }, [
                createElement('div', {
                    key: 'label',
                    className: "text-sm text-gray-600 mb-1"
                }, t.totalNet),
                createElement('div', {
                    key: 'value',
                    className: "text-lg font-bold text-green-600"
                }, formatCurrency(additionalTaxInfo.totalNet))
            ]),
            
            createElement('div', {
                key: 'effective-rate',
                className: "text-center p-3 bg-white rounded-lg border border-purple-100"
            }, [
                createElement('div', {
                    key: 'label',
                    className: "text-sm text-gray-600 mb-1"
                }, t.effectiveRate),
                createElement('div', {
                    key: 'value',
                    className: "text-lg font-bold text-orange-600"
                }, `${additionalTaxInfo.effectiveRate.toFixed(1)}%`)
            ])
        ]),
        
        // Monthly net income
        monthlyResult && monthlyResult.totalMonthlyNet > 0 && createElement('div', {
            key: 'monthly-net',
            className: "bg-green-100 rounded-lg p-4 mb-6 border border-green-200"
        }, [
            createElement('div', {
                key: 'monthly-label',
                className: "text-sm font-medium text-green-700 mb-2"
            }, t.monthlyNet),
            createElement('div', {
                key: 'monthly-value',
                className: "text-2xl font-bold text-green-800"
            }, formatCurrency(monthlyResult.totalMonthlyNet))
        ]),
        
        // Detailed breakdown
        createElement('div', { key: 'detailed-breakdown', className: "space-y-4" }, [
            // Bonus income breakdown
            additionalTaxInfo.bonusDetails && additionalTaxInfo.bonusDetails.gross > 0 && createElement('div', {
                key: 'bonus-breakdown',
                className: "bg-white rounded-lg p-4 border border-purple-100"
            }, [
                createElement('h4', {
                    key: 'bonus-title',
                    className: "font-semibold text-purple-700 mb-3"
                }, t.bonusIncome),
                
                createElement('div', { key: 'bonus-details', className: "text-sm space-y-1" }, [
                    createElement('div', { key: 'bonus-gross', className: "flex justify-between" }, [
                        createElement('span', { key: 'label' }, t.bonusGross),
                        createElement('span', { key: 'value' }, formatCurrency(additionalTaxInfo.bonusDetails.gross))
                    ]),
                    createElement('div', { key: 'bonus-tax', className: "flex justify-between" }, [
                        createElement('span', { key: 'label' }, t.bonusTax),
                        createElement('span', { key: 'value', className: "text-red-600" }, formatCurrency(additionalTaxInfo.bonusDetails.tax))
                    ]),
                    createElement('div', { key: 'bonus-net', className: "flex justify-between font-medium border-t pt-1" }, [
                        createElement('span', { key: 'label' }, t.bonusNet),
                        createElement('span', { key: 'value', className: "text-green-600" }, formatCurrency(additionalTaxInfo.bonusDetails.net))
                    ])
                ])
            ]),
            
            // Other income breakdown
            additionalTaxInfo.otherDetails && additionalTaxInfo.otherDetails.gross > 0 && createElement('div', {
                key: 'other-breakdown',
                className: "bg-white rounded-lg p-4 border border-purple-100"
            }, [
                createElement('h4', {
                    key: 'other-title',
                    className: "font-semibold text-purple-700 mb-3"
                }, t.otherIncome),
                
                createElement('div', { key: 'other-details', className: "text-sm space-y-1" }, [
                    createElement('div', { key: 'other-gross', className: "flex justify-between" }, [
                        createElement('span', { key: 'label' }, t.otherGross),
                        createElement('span', { key: 'value' }, formatCurrency(additionalTaxInfo.otherDetails.gross))
                    ]),
                    createElement('div', { key: 'other-tax', className: "flex justify-between" }, [
                        createElement('span', { key: 'label' }, t.otherTax),
                        createElement('span', { key: 'value', className: "text-red-600" }, formatCurrency(additionalTaxInfo.otherDetails.tax))
                    ]),
                    createElement('div', { key: 'other-net', className: "flex justify-between font-medium border-t pt-1" }, [
                        createElement('span', { key: 'label' }, t.otherNet),
                        createElement('span', { key: 'value', className: "text-green-600" }, formatCurrency(additionalTaxInfo.otherDetails.net))
                    ])
                ])
            ])
        ]),
        
        // Tax optimization tips
        createElement('div', {
            key: 'tax-tips',
            className: "mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200"
        }, [
            createElement('h4', {
                key: 'tips-title',
                className: "font-semibold text-yellow-800 mb-2 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-2" }, '💡'),
                'Tax Optimization Tips'
            ]),
            createElement('ul', {
                key: 'tips-list',
                className: "space-y-2 text-sm text-yellow-700"
            }, [
                createElement('li', {
                    key: 'tip-1',
                    className: "flex items-start"
                }, [
                    createElement('span', { key: 'bullet', className: "mr-2" }, '•'),
                    t.taxOptimizationTip
                ]),
                createElement('li', {
                    key: 'tip-2',
                    className: "flex items-start"
                }, [
                    createElement('span', { key: 'bullet', className: "mr-2" }, '•'),
                    t.pensionContributionAdvice
                ])
            ])
        ])
    ]);
};

// Export to window for global access
window.AdditionalIncomeTaxPanel = AdditionalIncomeTaxPanel;

console.log('✅ AdditionalIncomeTaxPanel component loaded successfully');