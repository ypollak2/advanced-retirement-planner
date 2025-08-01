// Inflation Impact Display Component
// Shows retirement projections with and without inflation adjustment
// Created by Yali Pollak (יהלי פולק) - v7.5.8

const InflationImpactDisplay = ({ retirementProjections, inputs, language, workingCurrency }) => {
    const createElement = React.createElement;
    
    // Extract inflation data
    const inflationData = retirementProjections?.inflationImpact || {};
    const hasInflationData = inflationData && inflationData.realValues;
    
    if (!hasInflationData) {
        return null; // Don't display if no inflation data available
    }
    
    const content = {
        he: {
            title: 'השפעת האינפלציה על הפנסיה',
            nominal: 'ערך נומינלי (ללא אינפלציה)',
            real: 'ערך ריאלי (מותאם לאינפלציה)',
            monthlyPension: 'פנסיה חודשית',
            totalAccumulation: 'צבירה כוללת',
            purchasingPower: 'כוח קנייה',
            inflationRate: 'שיעור אינפלציה שנתי',
            yearsToRetirement: 'שנים לפרישה',
            powerLoss: 'אובדן כוח קנייה',
            explanation: 'הערכים הריאליים מראים כמה תהיה שווה הפנסיה שלך במונחי כוח קנייה של היום'
        },
        en: {
            title: 'Inflation Impact on Retirement',
            nominal: 'Nominal Value (Without Inflation)',
            real: 'Real Value (Inflation-Adjusted)',
            monthlyPension: 'Monthly Pension',
            totalAccumulation: 'Total Accumulation',
            purchasingPower: 'Purchasing Power',
            inflationRate: 'Annual Inflation Rate',
            yearsToRetirement: 'Years to Retirement',
            powerLoss: 'Purchasing Power Loss',
            explanation: 'Real values show what your pension will be worth in today\'s purchasing power'
        }
    };
    
    const t = content[language] || content.en;
    
    // Calculate values
    const nominalMonthlyPension = retirementProjections.totalNetIncome || retirementProjections.monthlyIncome || 0;
    const realMonthlyPension = inflationData.realValues?.totalNetIncome || 0;
    
    const nominalTotalAccumulation = (inflationData.nominalValues?.totalSavings || 0) +
                                    (inflationData.nominalValues?.trainingFundValue || 0) +
                                    (inflationData.nominalValues?.personalPortfolioValue || 0);
    
    const realTotalAccumulation = (inflationData.realValues?.totalSavings || 0) +
                                 (inflationData.realValues?.trainingFundValue || 0) +
                                 (inflationData.realValues?.personalPortfolioValue || 0);
    
    const purchasingPowerLoss = inflationData.purchasingPowerErosion || 0;
    const inflationRate = inflationData.inflationRate || inputs.inflationRate || 2.5;
    const yearsToRetirement = inflationData.yearsToRetirement || (inputs.retirementAge - inputs.currentAge);
    
    return createElement('div', {
        className: 'bg-white rounded-lg shadow-lg p-6 mb-6'
    }, [
        createElement('h3', {
            key: 'title',
            className: 'text-xl font-bold mb-4 text-gray-800 flex items-center'
        }, [
            createElement('span', { key: 'icon', className: 'mr-2 text-2xl' }, '📊'),
            t.title
        ]),
        
        // Inflation Parameters
        createElement('div', {
            key: 'parameters',
            className: 'mb-4 p-3 bg-gray-50 rounded-lg text-sm'
        }, [
            createElement('div', { key: 'rate', className: 'flex justify-between mb-1' }, [
                createElement('span', { key: 'label' }, t.inflationRate + ':'),
                createElement('span', { key: 'value', className: 'font-medium' }, `${inflationRate}%`)
            ]),
            createElement('div', { key: 'years', className: 'flex justify-between' }, [
                createElement('span', { key: 'label' }, t.yearsToRetirement + ':'),
                createElement('span', { key: 'value', className: 'font-medium' }, yearsToRetirement)
            ])
        ]),
        
        // Monthly Pension Comparison
        createElement('div', {
            key: 'monthly-comparison',
            className: 'mb-6'
        }, [
            createElement('h4', {
                key: 'monthly-title',
                className: 'text-lg font-semibold mb-3 text-gray-700'
            }, t.monthlyPension),
            
            createElement('div', {
                key: 'monthly-values',
                className: 'grid grid-cols-2 gap-4'
            }, [
                // Nominal Value
                createElement('div', {
                    key: 'nominal',
                    className: 'p-4 bg-blue-50 rounded-lg text-center'
                }, [
                    createElement('div', { key: 'label', className: 'text-sm text-gray-600 mb-2' }, t.nominal),
                    createElement('div', { 
                        key: 'value', 
                        className: 'text-xl font-bold text-blue-700' 
                    }, window.formatCurrency(nominalMonthlyPension, workingCurrency))
                ]),
                
                // Real Value
                createElement('div', {
                    key: 'real',
                    className: 'p-4 bg-green-50 rounded-lg text-center'
                }, [
                    createElement('div', { key: 'label', className: 'text-sm text-gray-600 mb-2' }, t.real),
                    createElement('div', { 
                        key: 'value', 
                        className: 'text-xl font-bold text-green-700' 
                    }, window.formatCurrency(realMonthlyPension, workingCurrency))
                ])
            ])
        ]),
        
        // Total Accumulation Comparison
        createElement('div', {
            key: 'total-comparison',
            className: 'mb-6'
        }, [
            createElement('h4', {
                key: 'total-title',
                className: 'text-lg font-semibold mb-3 text-gray-700'
            }, t.totalAccumulation),
            
            createElement('div', {
                key: 'total-values',
                className: 'grid grid-cols-2 gap-4'
            }, [
                // Nominal Value
                createElement('div', {
                    key: 'nominal',
                    className: 'p-4 bg-blue-50 rounded-lg text-center'
                }, [
                    createElement('div', { key: 'label', className: 'text-sm text-gray-600 mb-2' }, t.nominal),
                    createElement('div', { 
                        key: 'value', 
                        className: 'text-lg font-bold text-blue-700' 
                    }, window.formatCurrency(nominalTotalAccumulation, workingCurrency))
                ]),
                
                // Real Value
                createElement('div', {
                    key: 'real',
                    className: 'p-4 bg-green-50 rounded-lg text-center'
                }, [
                    createElement('div', { key: 'label', className: 'text-sm text-gray-600 mb-2' }, t.real),
                    createElement('div', { 
                        key: 'value', 
                        className: 'text-lg font-bold text-green-700' 
                    }, window.formatCurrency(realTotalAccumulation, workingCurrency))
                ])
            ])
        ]),
        
        // Purchasing Power Loss
        purchasingPowerLoss > 0 && createElement('div', {
            key: 'power-loss',
            className: 'p-4 bg-orange-50 rounded-lg'
        }, [
            createElement('div', {
                key: 'loss-display',
                className: 'flex justify-between items-center mb-2'
            }, [
                createElement('span', { key: 'label', className: 'font-medium text-orange-800' }, t.powerLoss),
                createElement('span', { 
                    key: 'value', 
                    className: 'text-xl font-bold text-orange-700' 
                }, `${Math.round(purchasingPowerLoss)}%`)
            ]),
            
            // Visual indicator
            createElement('div', {
                key: 'loss-bar',
                className: 'w-full bg-orange-200 rounded-full h-3 overflow-hidden'
            }, [
                createElement('div', {
                    key: 'loss-fill',
                    className: 'bg-orange-500 h-full transition-all duration-500',
                    style: { width: `${Math.min(purchasingPowerLoss, 100)}%` }
                })
            ])
        ]),
        
        // Explanation
        createElement('div', {
            key: 'explanation',
            className: 'mt-4 p-3 bg-blue-50 rounded-lg text-sm text-gray-700'
        }, [
            createElement('span', { key: 'icon', className: 'mr-1' }, 'ℹ️'),
            t.explanation
        ])
    ]);
};

// Export to window for global access
window.InflationImpactDisplay = InflationImpactDisplay;