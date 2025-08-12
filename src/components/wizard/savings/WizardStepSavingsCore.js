// WizardStepSavings Core Component
// Main orchestrator for savings wizard step

const WizardStepSavings = ({ inputs, setInputs, language = 'en', workingCurrency = 'ILS' }) => {
    const createElement = React.createElement;
    
    // Get dependencies from modules
    const { getSavingsContent } = window.SavingsContent || {};
    const { formatCurrency, calculateTotalSavings } = window.SavingsCalculations || {};
    const MainPersonSavings = window.MainPersonSavings;
    const PartnerSavingsSection = window.PartnerSavingsSection;
    
    // Get content translations
    const content = getSavingsContent ? getSavingsContent() : { he: {}, en: {} };
    const t = content[language] || content.en;
    
    // Format currency helper
    const formatAmount = (amount) => {
        if (formatCurrency) {
            return formatCurrency(amount, workingCurrency);
        }
        return `${amount}`;
    };
    
    // Calculate total
    const totalSavings = calculateTotalSavings ? calculateTotalSavings(inputs) : 0;
    
    return createElement('div', { className: "space-y-8" }, [
        // Header
        createElement('div', { key: 'header', className: "text-center mb-8" }, [
            createElement('h2', { 
                key: 'title',
                className: "text-2xl font-bold text-gray-800 mb-2" 
            }, t.title),
            createElement('p', { 
                key: 'subtitle',
                className: "text-gray-600" 
            }, t.subtitle)
        ]),
        
        // Main Person Savings (Individual mode)
        inputs.planningType !== 'couple' && MainPersonSavings && createElement(MainPersonSavings, {
            key: 'main-person',
            inputs,
            setInputs,
            language,
            workingCurrency,
            t
        }),
        
        // Partner Savings (Couple mode)
        inputs.planningType === 'couple' && PartnerSavingsSection && createElement(PartnerSavingsSection, {
            key: 'partner-section',
            inputs,
            setInputs,
            language,
            workingCurrency,
            t
        }),
        
        // Total Savings Summary
        createElement('div', { 
            key: 'total-summary',
            className: "bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200" 
        }, [
            createElement('h3', { 
                key: 'total-title',
                className: "text-xl font-semibold text-blue-700 mb-4 flex items-center" 
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '💎'),
                t.totalSavings
            ]),
            createElement('div', { 
                key: 'total-amount',
                className: "text-3xl font-bold text-blue-800" 
            }, formatAmount(totalSavings))
        ])
    ]);
};

// Export to window for global access
window.WizardStepSavings = WizardStepSavings;

console.log('✅ WizardStepSavings Core component loaded');