// ManagementFeesCalculator.js - Calculate and display total management fees over time
// Shows potential savings with different fee percentages

const ManagementFeesCalculator = ({ inputs, language = 'en', formatCurrency, workingCurrency = 'ILS' }) => {
    const createElement = React.createElement;
    const [showDetails, setShowDetails] = React.useState(false);
    const [alternativeFees, setAlternativeFees] = React.useState({
        contributionFees: 0.5,
        accumulationFees: 0.05,
        trainingFundFees: 0.3
    });
    
    const content = {
        he: {
            title: 'חישוב דמי ניהול כוללים',
            subtitle: 'כמה דמי ניהול תשלמו לאורך השנים',
            currentFees: 'דמי ניהול נוכחיים',
            alternativeFees: 'דמי ניהול חלופיים',
            totalCostLabel: 'סך דמי ניהול צפויים',
            potentialSavings: 'חיסכון פוטנציאלי',
            yearsToRetirement: 'שנים עד פרישה',
            fromContributions: 'מהפקדות',
            fromAccumulation: 'מצבירה',
            fromTrainingFund: 'מקרן השתלמות',
            totalFees: 'סך הכל דמי ניהול',
            calculateAlternative: 'חשב עם דמי ניהול חלופיים',
            savingsMessage: 'תוכלו לחסוך',
            overYears: 'לאורך',
            years: 'שנים',
            detailsButton: 'הצג פירוט',
            hideDetails: 'הסתר פירוט',
            partner1: 'בן/בת זוג 1',
            partner2: 'בן/בת זוג 2',
            combined: 'סה"כ משותף'
        },
        en: {
            title: 'Total Management Fees Calculator',
            subtitle: 'How much management fees will you pay over the years',
            currentFees: 'Current Fees',
            alternativeFees: 'Alternative Fees',
            totalCostLabel: 'Total Expected Fees',
            potentialSavings: 'Potential Savings',
            yearsToRetirement: 'Years to Retirement',
            fromContributions: 'From Contributions',
            fromAccumulation: 'From Accumulation',
            fromTrainingFund: 'From Training Fund',
            totalFees: 'Total Fees',
            calculateAlternative: 'Calculate with Alternative Fees',
            savingsMessage: 'You could save',
            overYears: 'over',
            years: 'years',
            detailsButton: 'Show Details',
            hideDetails: 'Hide Details',
            partner1: 'Partner 1',
            partner2: 'Partner 2',
            combined: 'Combined Total'
        }
    };
    
    const t = content[language] || content.en;
    
    // Calculate fees for a single person
    const calculateIndividualFees = (prefix = '') => {
        // Get values with prefix for partner support
        const monthlyContribution = parseFloat(inputs[prefix + 'currentMonthlySalary'] || inputs[prefix + 'currentSalary'] || 0) * 0.175;
        const currentSavings = parseFloat(inputs[prefix + 'currentSavings'] || inputs[prefix + 'currentPension'] || 0);
        const trainingFund = parseFloat(inputs[prefix + 'currentTrainingFund'] || 0);
        const monthlyTrainingContribution = parseFloat(inputs[prefix + 'currentMonthlySalary'] || inputs[prefix + 'currentSalary'] || 0) * 0.075;
        
        const contributionFeeRate = (inputs[prefix + 'contributionFees'] || 1.0) / 100;
        const accumulationFeeRate = (inputs[prefix + 'accumulationFees'] || 0.1) / 100;
        const trainingFundFeeRate = (inputs[prefix + 'trainingFundFees'] || 0.6) / 100;
        
        const currentAge = parseInt(inputs[prefix + 'currentAge'] || inputs.currentAge || 30);
        const retirementAge = parseInt(inputs[prefix + 'retirementAge'] || inputs.retirementAge || 67);
        const yearsToRetirement = Math.max(0, retirementAge - currentAge);
        
        const pensionReturn = (inputs[prefix + 'pensionReturn'] || 7.0) / 100;
        const trainingReturn = (inputs[prefix + 'trainingFundReturn'] || 6.5) / 100;
        
        let totalContributionFees = 0;
        let totalAccumulationFees = 0;
        let totalTrainingFundFees = 0;
        let pensionBalance = currentSavings;
        let trainingBalance = trainingFund;
        
        // Calculate fees year by year
        for (let year = 1; year <= yearsToRetirement; year++) {
            // Annual contributions
            const annualContribution = monthlyContribution * 12;
            const annualTrainingContribution = monthlyTrainingContribution * 12;
            
            // Contribution fees
            const yearContributionFees = annualContribution * contributionFeeRate;
            totalContributionFees += yearContributionFees;
            
            // Add net contribution to balance
            pensionBalance += (annualContribution - yearContributionFees);
            trainingBalance += annualTrainingContribution;
            
            // Calculate returns
            pensionBalance *= (1 + pensionReturn);
            trainingBalance *= (1 + trainingReturn);
            
            // Accumulation fees on balance
            const yearAccumulationFees = pensionBalance * accumulationFeeRate;
            totalAccumulationFees += yearAccumulationFees;
            pensionBalance -= yearAccumulationFees;
            
            // Training fund fees
            const yearTrainingFees = trainingBalance * trainingFundFeeRate;
            totalTrainingFundFees += yearTrainingFees;
            trainingBalance -= yearTrainingFees;
        }
        
        return {
            contributionFees: totalContributionFees,
            accumulationFees: totalAccumulationFees,
            trainingFundFees: totalTrainingFundFees,
            totalFees: totalContributionFees + totalAccumulationFees + totalTrainingFundFees,
            yearsToRetirement
        };
    };
    
    // Calculate fees with alternative rates
    const calculateAlternativeFees = (prefix = '') => {
        const monthlyContribution = parseFloat(inputs[prefix + 'currentMonthlySalary'] || inputs[prefix + 'currentSalary'] || 0) * 0.175;
        const currentSavings = parseFloat(inputs[prefix + 'currentSavings'] || inputs[prefix + 'currentPension'] || 0);
        const trainingFund = parseFloat(inputs[prefix + 'currentTrainingFund'] || 0);
        const monthlyTrainingContribution = parseFloat(inputs[prefix + 'currentMonthlySalary'] || inputs[prefix + 'currentSalary'] || 0) * 0.075;
        
        const contributionFeeRate = alternativeFees.contributionFees / 100;
        const accumulationFeeRate = alternativeFees.accumulationFees / 100;
        const trainingFundFeeRate = alternativeFees.trainingFundFees / 100;
        
        const currentAge = parseInt(inputs[prefix + 'currentAge'] || inputs.currentAge || 30);
        const retirementAge = parseInt(inputs[prefix + 'retirementAge'] || inputs.retirementAge || 67);
        const yearsToRetirement = Math.max(0, retirementAge - currentAge);
        
        const pensionReturn = (inputs[prefix + 'pensionReturn'] || 7.0) / 100;
        const trainingReturn = (inputs[prefix + 'trainingFundReturn'] || 6.5) / 100;
        
        let totalContributionFees = 0;
        let totalAccumulationFees = 0;
        let totalTrainingFundFees = 0;
        let pensionBalance = currentSavings;
        let trainingBalance = trainingFund;
        
        for (let year = 1; year <= yearsToRetirement; year++) {
            const annualContribution = monthlyContribution * 12;
            const annualTrainingContribution = monthlyTrainingContribution * 12;
            
            const yearContributionFees = annualContribution * contributionFeeRate;
            totalContributionFees += yearContributionFees;
            
            pensionBalance += (annualContribution - yearContributionFees);
            trainingBalance += annualTrainingContribution;
            
            pensionBalance *= (1 + pensionReturn);
            trainingBalance *= (1 + trainingReturn);
            
            const yearAccumulationFees = pensionBalance * accumulationFeeRate;
            totalAccumulationFees += yearAccumulationFees;
            pensionBalance -= yearAccumulationFees;
            
            const yearTrainingFees = trainingBalance * trainingFundFeeRate;
            totalTrainingFundFees += yearTrainingFees;
            trainingBalance -= yearTrainingFees;
        }
        
        return {
            contributionFees: totalContributionFees,
            accumulationFees: totalAccumulationFees,
            trainingFundFees: totalTrainingFundFees,
            totalFees: totalContributionFees + totalAccumulationFees + totalTrainingFundFees
        };
    };
    
    // Calculate fees based on planning type
    const calculateTotalFees = () => {
        if (inputs.planningType === 'couple') {
            const partner1Fees = calculateIndividualFees('partner1');
            const partner2Fees = calculateIndividualFees('partner2');
            
            return {
                partner1: partner1Fees,
                partner2: partner2Fees,
                combined: {
                    contributionFees: partner1Fees.contributionFees + partner2Fees.contributionFees,
                    accumulationFees: partner1Fees.accumulationFees + partner2Fees.accumulationFees,
                    trainingFundFees: partner1Fees.trainingFundFees + partner2Fees.trainingFundFees,
                    totalFees: partner1Fees.totalFees + partner2Fees.totalFees,
                    yearsToRetirement: Math.max(partner1Fees.yearsToRetirement, partner2Fees.yearsToRetirement)
                }
            };
        } else {
            return calculateIndividualFees();
        }
    };
    
    const currentFees = calculateTotalFees();
    const altFees = inputs.planningType === 'couple' ? 
        {
            partner1: calculateAlternativeFees('partner1'),
            partner2: calculateAlternativeFees('partner2'),
            combined: {
                totalFees: calculateAlternativeFees('partner1').totalFees + calculateAlternativeFees('partner2').totalFees
            }
        } : 
        calculateAlternativeFees();
    
    const savings = inputs.planningType === 'couple' ? 
        currentFees.combined.totalFees - altFees.combined.totalFees :
        currentFees.totalFees - altFees.totalFees;
    
    return createElement('div', { className: 'bg-white rounded-xl shadow-lg p-6 border border-gray-200' }, [
        // Header
        createElement('div', { key: 'header', className: 'mb-6' }, [
            createElement('h3', { 
                key: 'title',
                className: 'text-2xl font-bold text-gray-800 flex items-center gap-2'
            }, [
                createElement('span', { key: 'icon' }, '💰'),
                t.title
            ]),
            createElement('p', { 
                key: 'subtitle',
                className: 'text-gray-600 mt-1'
            }, t.subtitle)
        ]),
        
        // Current Fees Summary
        createElement('div', { 
            key: 'current-summary',
            className: 'bg-red-50 rounded-lg p-4 mb-4'
        }, [
            createElement('div', { 
                key: 'current-header',
                className: 'flex justify-between items-center mb-2'
            }, [
                createElement('span', { 
                    key: 'label',
                    className: 'text-lg font-semibold text-red-800'
                }, t.currentFees),
                createElement('button', {
                    key: 'details-btn',
                    onClick: () => setShowDetails(!showDetails),
                    className: 'text-sm text-red-600 hover:text-red-800 underline'
                }, showDetails ? t.hideDetails : t.detailsButton)
            ]),
            
            // Total fees display
            inputs.planningType === 'couple' ? 
                createElement('div', { key: 'couple-fees', className: 'space-y-2' }, [
                    createElement('div', { key: 'p1', className: 'text-red-700' }, 
                        `${t.partner1}: ${formatCurrency(currentFees.partner1.totalFees)}`),
                    createElement('div', { key: 'p2', className: 'text-red-700' }, 
                        `${t.partner2}: ${formatCurrency(currentFees.partner2.totalFees)}`),
                    createElement('div', { key: 'total', className: 'text-2xl font-bold text-red-900 pt-2 border-t border-red-200' }, 
                        `${t.combined}: ${formatCurrency(currentFees.combined.totalFees)}`)
                ]) :
                createElement('div', { 
                    key: 'single-total',
                    className: 'text-2xl font-bold text-red-900'
                }, formatCurrency(currentFees.totalFees)),
            
            createElement('div', { 
                key: 'years',
                className: 'text-sm text-red-600 mt-1'
            }, `${t.overYears} ${currentFees.yearsToRetirement || currentFees.combined?.yearsToRetirement} ${t.years}`)
        ]),
        
        // Detailed breakdown
        showDetails && createElement('div', { 
            key: 'details',
            className: 'bg-gray-50 rounded-lg p-4 mb-4 space-y-3'
        }, [
            inputs.planningType !== 'couple' ? [
                createElement('div', { key: 'contrib', className: 'flex justify-between' }, [
                    createElement('span', { key: 'label' }, `${t.fromContributions} (${(inputs.contributionFees || 1.0).toFixed(2)}%)`),
                    createElement('span', { key: 'value', className: 'font-semibold' }, 
                        formatCurrency(currentFees.contributionFees))
                ]),
                createElement('div', { key: 'accum', className: 'flex justify-between' }, [
                    createElement('span', { key: 'label' }, `${t.fromAccumulation} (${(inputs.accumulationFees || 0.1).toFixed(2)}%)`),
                    createElement('span', { key: 'value', className: 'font-semibold' }, 
                        formatCurrency(currentFees.accumulationFees))
                ]),
                createElement('div', { key: 'training', className: 'flex justify-between' }, [
                    createElement('span', { key: 'label' }, `${t.fromTrainingFund} (${(inputs.trainingFundFees || 0.6).toFixed(2)}%)`),
                    createElement('span', { key: 'value', className: 'font-semibold' }, 
                        formatCurrency(currentFees.trainingFundFees))
                ])
            ] : [
                createElement('div', { key: 'combined-details', className: 'space-y-2' }, [
                    createElement('div', { key: 'contrib', className: 'flex justify-between' }, [
                        createElement('span', { key: 'label' }, t.fromContributions),
                        createElement('span', { key: 'value', className: 'font-semibold' }, 
                            formatCurrency(currentFees.combined.contributionFees))
                    ]),
                    createElement('div', { key: 'accum', className: 'flex justify-between' }, [
                        createElement('span', { key: 'label' }, t.fromAccumulation),
                        createElement('span', { key: 'value', className: 'font-semibold' }, 
                            formatCurrency(currentFees.combined.accumulationFees))
                    ]),
                    createElement('div', { key: 'training', className: 'flex justify-between' }, [
                        createElement('span', { key: 'label' }, t.fromTrainingFund),
                        createElement('span', { key: 'value', className: 'font-semibold' }, 
                            formatCurrency(currentFees.combined.trainingFundFees))
                    ])
                ])
            ]
        ]),
        
        // Alternative fees calculator
        createElement('div', { 
            key: 'alternative',
            className: 'bg-green-50 rounded-lg p-4'
        }, [
            createElement('h4', { 
                key: 'alt-title',
                className: 'text-lg font-semibold text-green-800 mb-3'
            }, t.calculateAlternative),
            
            createElement('div', { 
                key: 'alt-inputs',
                className: 'grid grid-cols-3 gap-3 mb-4'
            }, [
                createElement('div', { key: 'alt-contrib' }, [
                    createElement('label', { 
                        key: 'label',
                        className: 'text-xs text-green-700'
                    }, t.fromContributions),
                    createElement('input', {
                        key: 'input',
                        type: 'number',
                        step: '0.01',
                        value: alternativeFees.contributionFees.toFixed(2),
                        onChange: (e) => setAlternativeFees({
                            ...alternativeFees,
                            contributionFees: parseFloat(e.target.value) || 0
                        }),
                        className: 'w-full p-2 border border-green-300 rounded text-sm'
                    })
                ]),
                createElement('div', { key: 'alt-accum' }, [
                    createElement('label', { 
                        key: 'label',
                        className: 'text-xs text-green-700'
                    }, t.fromAccumulation),
                    createElement('input', {
                        key: 'input',
                        type: 'number',
                        step: '0.01',
                        value: alternativeFees.accumulationFees.toFixed(2),
                        onChange: (e) => setAlternativeFees({
                            ...alternativeFees,
                            accumulationFees: parseFloat(e.target.value) || 0
                        }),
                        className: 'w-full p-2 border border-green-300 rounded text-sm'
                    })
                ]),
                createElement('div', { key: 'alt-training' }, [
                    createElement('label', { 
                        key: 'label',
                        className: 'text-xs text-green-700'
                    }, t.fromTrainingFund),
                    createElement('input', {
                        key: 'input',
                        type: 'number',
                        step: '0.01',
                        value: alternativeFees.trainingFundFees.toFixed(2),
                        onChange: (e) => setAlternativeFees({
                            ...alternativeFees,
                            trainingFundFees: parseFloat(e.target.value) || 0
                        }),
                        className: 'w-full p-2 border border-green-300 rounded text-sm'
                    })
                ])
            ]),
            
            // Savings display
            savings > 0 && createElement('div', { 
                key: 'savings',
                className: 'bg-green-100 rounded-lg p-3 text-center'
            }, [
                createElement('div', { 
                    key: 'message',
                    className: 'text-green-700'
                }, t.savingsMessage),
                createElement('div', { 
                    key: 'amount',
                    className: 'text-2xl font-bold text-green-900'
                }, formatCurrency(savings))
            ])
        ])
    ]);
};

// Export to window for global access
window.ManagementFeesCalculator = ManagementFeesCalculator;