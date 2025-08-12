// WizardStepSalary Core Component
// Main component that orchestrates all salary step modules

const WizardStepSalary = ({ inputs, setInputs, language = 'en', workingCurrency = 'ILS' }) => {
    // Get dependencies from modules
    const { getSalaryContent, getCurrencySymbol } = window.SalaryContent || {};
    const { SalaryInputSection } = window.SalaryInputComponents || {};
    const { AdditionalIncomeSection } = window.AdditionalIncomeComponents || {};
    const { IncomeSummarySection } = window.IncomeSummaryComponents || {};
    
    // Get currency symbol and content
    const currencySymbol = getCurrencySymbol ? getCurrencySymbol(workingCurrency) : '₪';
    const content = getSalaryContent ? getSalaryContent(currencySymbol) : { en: {}, he: {} };
    const t = content[language];
    
    // Component uses React.createElement for rendering
    const createElement = React.createElement;
    
    // Render the component
    return createElement('div', { className: "space-y-8" }, [
        // Salary Input Section
        SalaryInputSection && createElement(SalaryInputSection, {
            key: 'salary-inputs',
            inputs,
            setInputs,
            language,
            workingCurrency,
            t,
            currencySymbol
        }),
        
        // Additional Income Section
        AdditionalIncomeSection && createElement(AdditionalIncomeSection, {
            key: 'additional-income',
            inputs,
            setInputs,
            language,
            workingCurrency,
            t,
            currencySymbol
        }),
        
        // Income Summary Section
        IncomeSummarySection && createElement(IncomeSummarySection, {
            key: 'income-summary',
            inputs,
            language,
            workingCurrency,
            t,
            currencySymbol
        })
    ]);
};

// Export to window for global access
window.WizardStepSalary = WizardStepSalary;

console.log('✅ WizardStepSalary Core component loaded');