// RetirementWizard.js - Main wizard navigation system for retirement planning
// Manages 8 steps of data collection before showing results

const RetirementWizard = ({ 
    inputs, 
    setInputs, 
    onComplete, 
    language = 'en',
    workingCurrency = 'ILS' 
}) => {
    const [currentStep, setCurrentStep] = React.useState(1);
    const [completedSteps, setCompletedSteps] = React.useState([]);
    const [skippedSteps, setSkippedSteps] = React.useState([]);

    const totalSteps = 8;

    // Multi-language content
    const content = {
        he: {
            wizardTitle: 'אשף תכנון פנסיה מתקדם',
            wizardSubtitle: 'נאסוף את כל המידע הדרוש לחישוב מקיף של תכנית הפנסיה שלך',
            steps: {
                1: { title: 'פרטים אישיים', subtitle: 'גיל, גיל פרישה וסוג התכנון' },
                2: { title: 'משכורת והכנסות', subtitle: 'משכורת חודשית ומקורות הכנסה נוספים' },
                3: { title: 'חיסכונות קיימים', subtitle: 'פנסיה, קרן השתלמות והשקעות אישיות' },
                4: { title: 'הגדרות הפקדה', subtitle: 'אחוזי הפקדה וכללים לפי מדינה' },
                5: { title: 'דמי ניהול', subtitle: 'עמלות ועלויות ניהול השקעות' },
                6: { title: 'העדפות השקעה', subtitle: 'סיכון, תשואה וחלוקת נכסים' },
                7: { title: 'יעדי פרישה', subtitle: 'הכנסה רצויה בפרישה ותכנון אורח חיים' },
                8: { title: 'סקירה וחישוב', subtitle: 'סיכום כל הנתונים וחישוב תוצאות' }
            }
        },
        en: {
            wizardTitle: 'Advanced Retirement Planning Wizard',
            wizardSubtitle: 'We\'ll collect all the information needed for a comprehensive retirement plan calculation',
            steps: {
                1: { title: 'Personal Information', subtitle: 'Age, retirement age, and planning type' },
                2: { title: 'Salary & Income', subtitle: 'Monthly salary and additional income sources' },
                3: { title: 'Current Savings', subtitle: 'Pension, training fund, and personal investments' },
                4: { title: 'Contribution Settings', subtitle: 'Contribution percentages and country-specific rules' },
                5: { title: 'Management Fees', subtitle: 'Investment fees and management costs' },
                6: { title: 'Investment Preferences', subtitle: 'Risk tolerance, returns, and asset allocation' },
                7: { title: 'Retirement Goals', subtitle: 'Target retirement income and lifestyle planning' },
                8: { title: 'Review & Calculate', subtitle: 'Summary of all data and results calculation' }
            }
        }
    };

    const t = content[language];

    // Calculate progress percentage
    const getProgressPercent = (step) => {
        return ((step - 1) / (totalSteps - 1)) * 100;
    };

    // Navigation handlers
    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCompletedSteps(prev => [...new Set([...prev, currentStep])]);
            setCurrentStep(currentStep + 1);
        } else {
            // Final step - complete wizard
            onComplete && onComplete();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = () => {
        if (currentStep < totalSteps) {
            setSkippedSteps(prev => [...new Set([...prev, currentStep])]);
            setCurrentStep(currentStep + 1);
        }
    };

    // Step validation - basic validation for now, can be enhanced per step
    const isCurrentStepValid = () => {
        switch (currentStep) {
            case 1: return inputs.currentAge && inputs.retirementAge;
            case 2: return inputs.currentMonthlySalary || inputs.partner1Salary || inputs.partner2Salary;
            case 3: return true; // Optional step
            case 4: return true; // Will have country-specific validation
            case 5: return true; // Optional step
            case 6: return true; // Optional step  
            case 7: return true; // Optional step
            case 8: return true; // Review step
            default: return true;
        }
    };

    // Render current step content
    const renderStepContent = () => {
        const stepProps = {
            inputs,
            setInputs,
            language,
            workingCurrency
        };

        switch (currentStep) {
            case 1:
                return React.createElement(window.WizardStepPersonal || 'div', stepProps, 
                    'Personal Information Step - To be implemented');
            case 2:
                return React.createElement(window.WizardStepSalary || 'div', stepProps, 
                    'Salary & Income Step - To be implemented');
            case 3:
                return React.createElement(window.WizardStepSavings || 'div', stepProps, 
                    'Current Savings Step - To be implemented');
            case 4:
                return React.createElement(window.WizardStepContributions || 'div', stepProps, 
                    'Contribution Settings Step - To be implemented');
            case 5:
                return React.createElement(window.WizardStepFees || 'div', stepProps, 
                    'Management Fees Step - To be implemented');
            case 6:
                return React.createElement(window.WizardStepInvestments || 'div', stepProps, 
                    'Investment Preferences Step - To be implemented');
            case 7:
                return React.createElement(window.WizardStepGoals || 'div', stepProps, 
                    'Retirement Goals Step - To be implemented');
            case 8:
                return React.createElement(window.WizardStepReview || 'div', stepProps, 
                    'Review & Calculate Step - To be implemented');
            default:
                return React.createElement('div', { className: 'text-center p-8' }, 'Invalid step');
        }
    };

    return React.createElement('div', { 
        className: "retirement-wizard w-full max-w-6xl mx-auto p-4" 
    }, [
        // Wizard Header
        React.createElement('div', { 
            key: 'wizard-header',
            className: "text-center mb-8" 
        }, [
            React.createElement('h1', { 
                key: 'wizard-title',
                className: "text-4xl font-bold text-gray-800 mb-4" 
            }, t.wizardTitle),
            React.createElement('p', { 
                key: 'wizard-subtitle',
                className: "text-lg text-gray-600 max-w-2xl mx-auto" 
            }, t.wizardSubtitle)
        ]),

        // Current Step
        React.createElement(window.WizardStep, {
            key: 'current-step',
            stepNumber: currentStep,
            totalSteps: totalSteps,
            title: t.steps[currentStep].title,
            subtitle: t.steps[currentStep].subtitle,
            onNext: handleNext,
            onPrevious: handlePrevious,
            onSkip: handleSkip,
            isValid: isCurrentStepValid(),
            canSkip: currentStep !== 8, // Can't skip final review step
            isFirst: currentStep === 1,
            isLast: currentStep === totalSteps,
            language: language,
            progressPercent: getProgressPercent(currentStep)
        }, renderStepContent())
    ]);
};

// Export to window for global access
window.RetirementWizard = RetirementWizard;
console.log('✅ RetirementWizard component loaded successfully');