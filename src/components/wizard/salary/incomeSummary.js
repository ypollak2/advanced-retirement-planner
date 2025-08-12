// Income Summary Components Module
// Handles income summary and tax preview display

function IncomeSummarySection({ inputs, language, workingCurrency, t, currencySymbol }) {
    const { calculateTotalIncome, calculateNetFromGross } = window.SalaryCalculations || {};
    
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat(language === 'he' ? 'he-IL' : 'en-US', {
            style: 'currency',
            currency: workingCurrency === 'ILS' ? 'ILS' : 'USD',
            minimumFractionDigits: 0
        }).format(amount);
    };
    
    return React.createElement(React.Fragment, null, [
        // Total Income Summary
        React.createElement('div', { 
            key: 'income-summary',
            className: "bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200" 
        }, [
            React.createElement('h3', { 
                key: 'total-title',
                className: "text-xl font-semibold text-green-700 mb-4 flex items-center" 
            }, [
                React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '💵'),
                t.totalMonthlyIncome + ' (NET)'
            ]),
            
            // Main person breakdown (hide in couple mode)
            inputs.planningType !== 'couple' && renderMainPersonBreakdown({ 
                inputs, language, t, formatCurrency, calculateNetFromGross, currencySymbol 
            }),
            
            // Partner breakdown (for couple planning)
            inputs.planningType === 'couple' && renderPartnerBreakdown({ 
                inputs, language, t, formatCurrency, calculateNetFromGross, currencySymbol 
            }),
            
            // Combined total
            React.createElement('div', {
                key: 'combined-total',
                className: "border-t-2 border-green-300 pt-4"
            }, [
                React.createElement('div', {
                    key: 'combined-header',
                    className: "flex justify-between items-center"
                }, [
                    React.createElement('h4', {
                        key: 'combined-title',
                        className: "text-xl font-semibold text-green-700"
                    }, language === 'he' ? 'סך הכל משותף' : 'Combined Total'),
                    React.createElement('div', { 
                        key: 'combined-amount',
                        className: "text-3xl font-bold text-green-800" 
                    }, formatCurrency(calculateTotalIncome ? calculateTotalIncome(inputs, language) : 0))
                ])
            ]),
            
            React.createElement('p', { 
                key: 'total-help',
                className: "text-sm text-green-600 mt-3" 
            }, language === 'he' ? 'כל הסכומים מוצגים נטו (אחרי מסים)' : 'All amounts shown are net (after taxes)')
        ]),
        
        // Tax Impact Preview
        renderTaxImpactPreview({ inputs, language, t, formatCurrency })
    ]);
}

// Render main person income breakdown
function renderMainPersonBreakdown({ inputs, language, t, formatCurrency, calculateNetFromGross, currencySymbol }) {
    return React.createElement('div', {
        key: 'main-person-breakdown',
        className: "bg-white rounded-lg p-4 mb-4 border border-green-100"
    }, (() => {
        const mainNetSalary = inputs.currentNetSalary || (calculateNetFromGross ? calculateNetFromGross(inputs.currentMonthlySalary || 0, inputs.country) : (inputs.currentMonthlySalary || 0) * 0.66);
        
        // Calculate RSU income separately
        let mainRSUNet = 0;
        if (window.AdditionalIncomeTax?.getMonthlyAfterTaxAdditionalIncome) {
            const additionalInfo = window.AdditionalIncomeTax.getMonthlyAfterTaxAdditionalIncome(inputs);
            mainRSUNet = additionalInfo.monthlyNetRSU || 0;
        }
        
        const mainAdditionalNet = window.AdditionalIncomeTax?.getMonthlyAfterTaxAdditionalIncome 
            ? (window.AdditionalIncomeTax.getMonthlyAfterTaxAdditionalIncome(inputs)?.totalMonthlyNet || 0)
            : ((inputs.annualBonus || 0) / 12 * 0.5 + (inputs.quarterlyRSU || 0) / 3 * 0.55 + (inputs.freelanceIncome || 0) + (inputs.rentalIncome || 0) + (inputs.dividendIncome || 0));
        const mainTotal = mainNetSalary + mainAdditionalNet;
        
        return [
            React.createElement('div', {
                key: 'main-header',
                className: "flex justify-between items-center mb-3"
            }, [
                React.createElement('h4', {
                    key: 'main-title', 
                    className: "font-semibold text-gray-700"
                }, language === 'he' ? 'הכנסה עיקרית' : 'Primary Person'),
                React.createElement('div', {
                    key: 'main-total',
                    className: "text-lg font-bold text-green-700"
                }, formatCurrency(mainTotal))
            ]),
            React.createElement('div', {
                key: 'main-details',
                className: "grid grid-cols-1 md:grid-cols-2 gap-2 text-sm"
            }, [
                React.createElement('div', { key: 'salary-row', className: "flex justify-between" }, [
                    React.createElement('span', { key: 'salary-label', className: "text-gray-600" }, 
                        language === 'he' ? 'משכורת נטו:' : 'Net Salary:'),
                    React.createElement('span', { key: 'salary-value', className: "font-medium" }, 
                        formatCurrency(mainNetSalary))
                ]),
                mainRSUNet > 0 && React.createElement('div', { key: 'rsu-row', className: "flex justify-between" }, [
                    React.createElement('span', { key: 'rsu-label', className: "text-gray-600" }, 
                        language === 'he' ? 'RSU נטו:' : 'RSU Net:'),
                    React.createElement('span', { key: 'rsu-value', className: "font-medium" }, 
                        formatCurrency(mainRSUNet))
                ]),
                (mainAdditionalNet - mainRSUNet) > 0 && React.createElement('div', { key: 'other-additional-row', className: "flex justify-between" }, [
                    React.createElement('span', { key: 'other-label', className: "text-gray-600" }, 
                        language === 'he' ? 'הכנסות אחרות נטו:' : 'Other Income Net:'),
                    React.createElement('span', { key: 'other-value', className: "font-medium" }, 
                        formatCurrency(mainAdditionalNet - mainRSUNet))
                ]),
                // RSU Details
                (inputs.rsuUnits > 0 && inputs.rsuCompany) && React.createElement('div', { key: 'rsu-details', className: "text-xs text-gray-500 mt-1 col-span-2" }, 
                    `${inputs.rsuUnits} ${inputs.rsuCompany} RSU @ ${currencySymbol}${inputs.rsuCurrentStockPrice || 0} (${inputs.rsuFrequency || 'quarterly'}) - ${language === 'he' ? 'מס' : 'Tax'}: ${inputs.rsuTaxRate || 40}%`
                )
            ])
        ];
    })());
}

// Render partner income breakdown
function renderPartnerBreakdown({ inputs, language, t, formatCurrency, calculateNetFromGross, currencySymbol }) {
    return React.createElement('div', {
        key: 'partner-breakdown',
        className: "bg-white rounded-lg p-4 mb-4 border border-green-100"
    }, (() => {
        const partner1NetSalary = inputs.partner1NetSalary || (calculateNetFromGross ? calculateNetFromGross(inputs.partner1Salary || 0, inputs.country) : (inputs.partner1Salary || 0) * 0.66);
        const partner2NetSalary = inputs.partner2NetSalary || (calculateNetFromGross ? calculateNetFromGross(inputs.partner2Salary || 0, inputs.country) : (inputs.partner2Salary || 0) * 0.66);
        
        // Calculate partner RSU income separately
        let partner1RSUNet = 0;
        let partner2RSUNet = 0;
        let partner1MainRSUNet = 0; // Main person's RSU attributed to Partner 1
        
        // Calculate Partner 1 and Partner 2 RSU from partner-specific fields
        if (window.AdditionalIncomeTax?.calculatePartnerRSUIncome) {
            const partner1RSUInfo = window.AdditionalIncomeTax.calculatePartnerRSUIncome(inputs, 'partner1');
            const partner2RSUInfo = window.AdditionalIncomeTax.calculatePartnerRSUIncome(inputs, 'partner2');
            partner1RSUNet = partner1RSUInfo.monthlyNet || 0;
            partner2RSUNet = partner2RSUInfo.monthlyNet || 0;
        }
        
        // Calculate Partner 1's additional income (includes main person fields in couple mode)
        let partner1AdditionalNet = 0;
        if (window.AdditionalIncomeTax?.getMonthlyAfterTaxAdditionalIncome) {
            // Partner 1 gets the main person's additional income fields
            const partner1TaxResult = window.AdditionalIncomeTax.getMonthlyAfterTaxAdditionalIncome(inputs);
            partner1AdditionalNet = partner1TaxResult.totalMonthlyNet || 0;
            partner1MainRSUNet = partner1TaxResult.monthlyNetRSU || 0; // Extract RSU portion for display
        } else {
            // Fallback calculation
            const freelanceIncome = inputs.freelanceIncome || 0;
            const rentalIncome = inputs.rentalIncome || 0;
            const dividendIncome = inputs.dividendIncome || 0;
            const annualBonusMonthly = (inputs.annualBonus || 0) / 12 * 0.5;
            const quarterlyRSUMonthly = (inputs.quarterlyRSU || 0) / 3 * 0.55;
            const otherIncome = inputs.otherIncome || 0;
            partner1AdditionalNet = freelanceIncome + rentalIncome + dividendIncome + 
                                  annualBonusMonthly + quarterlyRSUMonthly + otherIncome;
            partner1MainRSUNet = quarterlyRSUMonthly;
        }
        
        // Calculate Partner 2's additional income (partner-specific fields)
        let partner2AdditionalNet = 0;
        const partner2Inputs = {
            country: inputs.country || 'israel',
            currentMonthlySalary: inputs.partner2Salary || 0,
            annualBonus: inputs.partnerAnnualBonus || 0,
            quarterlyRSU: inputs.partnerQuarterlyRSU || 0, // Include RSU here to avoid double calculation
            // Enhanced partner RSU fields - use partner2 specific fields
            rsuUnits: inputs.partner2RsuUnits || inputs.partnerRsuUnits || 0,
            rsuCurrentStockPrice: inputs.partner2RsuCurrentStockPrice || inputs.partnerRsuCurrentStockPrice || 0,
            rsuFrequency: inputs.partner2RsuFrequency || inputs.partnerRsuFrequency || 'quarterly',
            freelanceIncome: inputs.partnerFreelanceIncome || 0,
            rentalIncome: inputs.partnerRentalIncome || 0,
            dividendIncome: inputs.partnerDividendIncome || 0,
            otherIncome: inputs.partnerOtherIncome || 0
        };
        
        if (window.AdditionalIncomeTax?.getMonthlyAfterTaxAdditionalIncome) {
            const partner2TaxResult = window.AdditionalIncomeTax.getMonthlyAfterTaxAdditionalIncome(partner2Inputs);
            partner2AdditionalNet = partner2TaxResult.totalMonthlyNet || 0;
        } else {
            partner2AdditionalNet = (inputs.partnerAnnualBonus || 0) / 12 * 0.55 + 
                                  (inputs.partnerFreelanceIncome || 0) + 
                                  (inputs.partnerRentalIncome || 0) + 
                                  (inputs.partnerDividendIncome || 0) + 
                                  (inputs.partnerOtherIncome || 0);
        }
        
        const partnerTotal = partner1NetSalary + partner2NetSalary + partner1AdditionalNet + partner2AdditionalNet;
        
        return [
            React.createElement('div', {
                key: 'partner-header',
                className: "flex justify-between items-center mb-3"
            }, [
                React.createElement('h4', {
                    key: 'partner-title', 
                    className: "font-semibold text-gray-700"
                }, language === 'he' ? 'בני הזוג' : 'Partners'),
                React.createElement('div', {
                    key: 'partner-total',
                    className: "text-lg font-bold text-green-700"
                }, formatCurrency(partnerTotal))
            ]),
            React.createElement('div', {
                key: 'partner-details',
                className: "grid grid-cols-1 md:grid-cols-2 gap-2 text-sm"
            }, [
                partner1NetSalary > 0 && React.createElement('div', { key: 'p1-salary-row', className: "flex justify-between" }, [
                    React.createElement('span', { key: 'p1-salary-label', className: "text-gray-600" }, 
                        language === 'he' ? 'בן/בת זוג 1 נטו:' : 'Partner 1 Net:'),
                    React.createElement('span', { key: 'p1-salary-value', className: "font-medium" }, 
                        formatCurrency(partner1NetSalary))
                ]),
                partner2NetSalary > 0 && React.createElement('div', { key: 'p2-salary-row', className: "flex justify-between" }, [
                    React.createElement('span', { key: 'p2-salary-label', className: "text-gray-600" }, 
                        language === 'he' ? 'בן/בת זוג 2 נטו:' : 'Partner 2 Net:'),
                    React.createElement('span', { key: 'p2-salary-value', className: "font-medium" }, 
                        formatCurrency(partner2NetSalary))
                ]),
                partner1MainRSUNet > 0 && React.createElement('div', { key: 'p1-main-rsu-row', className: "flex justify-between" }, [
                    React.createElement('span', { key: 'p1-main-rsu-label', className: "text-gray-600" }, 
                        language === 'he' ? 'RSU בן/בת זוג 1 (ראשי):' : 'Partner 1 RSU (Main):'),
                    React.createElement('span', { key: 'p1-main-rsu-value', className: "font-medium" }, 
                        formatCurrency(partner1MainRSUNet))
                ]),
                partner1RSUNet > 0 && React.createElement('div', { key: 'p1-rsu-row', className: "flex justify-between" }, [
                    React.createElement('span', { key: 'p1-rsu-label', className: "text-gray-600" }, 
                        language === 'he' ? 'RSU בן/בת זוג 1:' : 'Partner 1 RSU:'),
                    React.createElement('span', { key: 'p1-rsu-value', className: "font-medium" }, 
                        formatCurrency(partner1RSUNet))
                ]),
                partner2RSUNet > 0 && React.createElement('div', { key: 'p2-rsu-row', className: "flex justify-between" }, [
                    React.createElement('span', { key: 'p2-rsu-label', className: "text-gray-600" }, 
                        language === 'he' ? 'RSU בן/בת זוג 2:' : 'Partner 2 RSU:'),
                    React.createElement('span', { key: 'p2-rsu-value', className: "font-medium" }, 
                        formatCurrency(partner2RSUNet))
                ]),
                (partner1AdditionalNet - partner1MainRSUNet - partner1RSUNet) > 0 && React.createElement('div', { key: 'p1-additional-row', className: "flex justify-between" }, [
                    React.createElement('span', { key: 'p1-additional-label', className: "text-gray-600" }, 
                        language === 'he' ? 'הכנסות אחרות בן/בת זוג 1:' : 'Partner 1 Other Income:'),
                    React.createElement('span', { key: 'p1-additional-value', className: "font-medium" }, 
                        formatCurrency(partner1AdditionalNet - partner1MainRSUNet - partner1RSUNet))
                ]),
                (partner2AdditionalNet - partner2RSUNet) > 0 && React.createElement('div', { key: 'p2-additional-row', className: "flex justify-between" }, [
                    React.createElement('span', { key: 'p2-additional-label', className: "text-gray-600" }, 
                        language === 'he' ? 'הכנסות אחרות בן/בת זוג 2:' : 'Partner 2 Other Income:'),
                    React.createElement('span', { key: 'p2-additional-value', className: "font-medium" }, 
                        formatCurrency(partner2AdditionalNet - partner2RSUNet))
                ]),
                // RSU Details
                renderRSUDetails({ inputs, language, currencySymbol })
            ])
        ];
    })());
}

// Helper function to render RSU details
function renderRSUDetails({ inputs, language, currencySymbol }) {
    const details = [];
    
    // Main person RSU Details (attributed to Partner 1 in couple mode)
    if (inputs.rsuUnits > 0 && inputs.rsuCompany) {
        details.push(React.createElement('div', { key: 'main-rsu-details', className: "text-xs text-gray-500 mt-1 col-span-2" }, 
            `P1 Main: ${inputs.rsuUnits} ${inputs.rsuCompany} @ ${currencySymbol}${inputs.rsuCurrentStockPrice || 0} (${inputs.rsuFrequency || 'quarterly'}) - ${language === 'he' ? 'מס' : 'Tax'}: ${inputs.rsuTaxRate || 40}%`
        ));
    }
    
    // Partner 1 RSU Details
    if (inputs.partner1RsuUnits > 0 && inputs.partner1RsuCompany) {
        details.push(React.createElement('div', { key: 'p1-rsu-details', className: "text-xs text-gray-500 mt-1 col-span-2" }, 
            `P1: ${inputs.partner1RsuUnits} ${inputs.partner1RsuCompany} @ ${currencySymbol}${inputs.partner1RsuCurrentStockPrice || 0} - ${language === 'he' ? 'מס' : 'Tax'}: ${inputs.partner1RsuTaxRate || 40}%`
        ));
    }
    
    // Partner 2 RSU Details
    if (inputs.partner2RsuUnits > 0 && inputs.partner2RsuCompany) {
        details.push(React.createElement('div', { key: 'p2-rsu-details', className: "text-xs text-gray-500 mt-1 col-span-2" }, 
            `P2: ${inputs.partner2RsuUnits} ${inputs.partner2RsuCompany} @ ${currencySymbol}${inputs.partner2RsuCurrentStockPrice || 0} - ${language === 'he' ? 'מס' : 'Tax'}: ${inputs.partner2RsuTaxRate || 40}%`
        ));
    }
    
    return details;
}

// Render tax impact preview
function renderTaxImpactPreview({ inputs, language, t, formatCurrency }) {
    // Check if there are any additional income sources
    const hasAdditionalIncome = inputs.annualBonus > 0 || inputs.quarterlyRSU > 0 || 
                               inputs.freelanceIncome > 0 || inputs.rentalIncome > 0 || 
                               inputs.dividendIncome > 0;
    
    if (!hasAdditionalIncome) return null;
    
    return React.createElement('div', {
        key: 'tax-impact-preview',
        className: "bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200 mt-6"
    }, [
        React.createElement('h3', {
            key: 'tax-preview-title',
            className: "text-xl font-semibold text-red-700 mb-4 flex items-center"
        }, [
            React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '🧮'),
            language === 'he' ? 'תחזית מס על הכנסות נוספות' : 'Tax Preview on Additional Income'
        ]),
        renderTaxCalculationDetails({ inputs, language, formatCurrency })
    ]);
}

// Render tax calculation details
function renderTaxCalculationDetails({ inputs, language, formatCurrency }) {
    // Calculate tax impact
    if (window.TaxCalculators && window.TaxCalculators.calculateAdditionalIncomeTax) {
        const taxInfo = window.TaxCalculators.calculateAdditionalIncomeTax(inputs);
        if (taxInfo) {
            return React.createElement('div', { key: 'tax-details', className: "space-y-3" }, [
                // Total additional income
                React.createElement('div', { key: 'total-additional', className: "flex justify-between items-center pb-3 border-b border-red-200" }, [
                    React.createElement('span', { key: 'label', className: "text-gray-700" }, 
                        language === 'he' ? 'סך הכנסות נוספות (ברוטו)' : 'Total Additional Income (Gross)'),
                    React.createElement('span', { key: 'value', className: "font-semibold text-gray-900" }, 
                        formatCurrency(taxInfo.totalAdditionalIncome))
                ]),
                
                // Tax amount
                React.createElement('div', { key: 'tax-amount', className: "flex justify-between items-center" }, [
                    React.createElement('span', { key: 'label', className: "text-red-700" }, 
                        language === 'he' ? 'מס משוער' : 'Estimated Tax'),
                    React.createElement('span', { key: 'value', className: "font-semibold text-red-800" }, 
                        formatCurrency(taxInfo.totalAdditionalTax))
                ]),
                
                // Net amount
                React.createElement('div', { key: 'net-amount', className: "flex justify-between items-center pt-3 border-t border-red-200" }, [
                    React.createElement('span', { key: 'label', className: "text-green-700 font-medium" }, 
                        language === 'he' ? 'נטו אחרי מס' : 'Net After Tax'),
                    React.createElement('span', { key: 'value', className: "font-bold text-green-800 text-lg" }, 
                        formatCurrency(taxInfo.totalAdditionalIncome - taxInfo.totalAdditionalTax))
                ]),
                
                // Marginal tax rate
                React.createElement('div', { key: 'marginal-rate', className: "mt-2 text-sm text-gray-600" }, 
                    language === 'he' ? 
                        `שיעור מס שולי: ${taxInfo.marginalRate}% | שיעור מס אפקטיבי: ${taxInfo.effectiveRate}%` :
                        `Marginal Tax Rate: ${taxInfo.marginalRate}% | Effective Tax Rate: ${taxInfo.effectiveRate}%`
                ),
                
                // Breakdown by income type
                taxInfo.breakdown && renderTaxBreakdown({ taxInfo, language, formatCurrency })
            ]);
        }
    }
    
    // Fallback if tax calculation not available
    return React.createElement('p', { 
        key: 'tax-preview-unavailable',
        className: "text-sm text-gray-600" 
    }, language === 'he' ? 
        'חישוב מס מפורט יהיה זמין בשלב הבא' : 
        'Detailed tax calculation will be available in the next step'
    );
}

// Render tax breakdown by income type
function renderTaxBreakdown({ taxInfo, language, formatCurrency }) {
    return React.createElement('details', { 
        key: 'breakdown-details',
        className: "mt-4 bg-white rounded-lg p-4"
    }, [
        React.createElement('summary', {
            key: 'breakdown-summary',
            className: "cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900"
        }, language === 'he' ? 'פירוט לפי סוג הכנסה' : 'Breakdown by Income Type'),
        
        React.createElement('div', { key: 'breakdown-content', className: "mt-3 space-y-2 text-sm" }, [
            // Bonus breakdown
            taxInfo.breakdown.bonus.gross > 0 && React.createElement('div', { 
                key: 'bonus-breakdown',
                className: "flex justify-between text-gray-600"
            }, [
                React.createElement('span', { key: 'label' }, 
                    language === 'he' ? `בונוס (${taxInfo.breakdown.bonus.rate}% מס)` : `Bonus (${taxInfo.breakdown.bonus.rate}% tax)`),
                React.createElement('span', { key: 'value' }, 
                    `${formatCurrency(taxInfo.breakdown.bonus.gross)} → ${formatCurrency(taxInfo.breakdown.bonus.net)}`)
            ]),
            
            // RSU breakdown
            taxInfo.breakdown.rsu.gross > 0 && React.createElement('div', { 
                key: 'rsu-breakdown',
                className: "flex justify-between text-gray-600"
            }, [
                React.createElement('span', { key: 'label' }, 
                    language === 'he' ? `RSU (${taxInfo.breakdown.rsu.rate}% מס)` : `RSU (${taxInfo.breakdown.rsu.rate}% tax)`),
                React.createElement('span', { key: 'value' }, 
                    `${formatCurrency(taxInfo.breakdown.rsu.gross)} → ${formatCurrency(taxInfo.breakdown.rsu.net)}`)
            ]),
            
            // Other income breakdown
            taxInfo.breakdown.otherIncome.gross > 0 && React.createElement('div', { 
                key: 'other-breakdown',
                className: "flex justify-between text-gray-600"
            }, [
                React.createElement('span', { key: 'label' }, 
                    language === 'he' ? `הכנסות אחרות (${taxInfo.breakdown.otherIncome.rate}% מס)` : `Other Income (${taxInfo.breakdown.otherIncome.rate}% tax)`),
                React.createElement('span', { key: 'value' }, 
                    `${formatCurrency(taxInfo.breakdown.otherIncome.gross)} → ${formatCurrency(taxInfo.breakdown.otherIncome.net)}`)
            ])
        ])
    ]);
}

// Export to window
window.IncomeSummaryComponents = {
    IncomeSummarySection,
    renderMainPersonBreakdown,
    renderPartnerBreakdown,
    renderTaxImpactPreview,
    renderTaxCalculationDetails
};

console.log('✅ Income summary components module loaded');