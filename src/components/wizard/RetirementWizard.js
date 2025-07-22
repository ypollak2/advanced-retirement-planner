// RetirementWizard.js - Main wizard navigation system for retirement planning
// Manages 8 steps of data collection before showing results

const RetirementWizard = ({ 
    inputs, 
    setInputs, 
    onComplete, 
    onReturnToDashboard,
    language = 'en',
    workingCurrency = 'ILS' 
}) => {
    // Local storage key for wizard progress
    const WIZARD_STORAGE_KEY = 'retirementWizardProgress';
    const WIZARD_INPUTS_KEY = 'retirementWizardInputs';
    
    // Load saved progress from localStorage
    const loadSavedProgress = () => {
        try {
            const savedProgress = localStorage.getItem(WIZARD_STORAGE_KEY);
            const savedInputs = localStorage.getItem(WIZARD_INPUTS_KEY);
            
            if (savedProgress) {
                const progress = JSON.parse(savedProgress);
                return {
                    currentStep: progress.currentStep || 1,
                    completedSteps: progress.completedSteps || [],
                    skippedSteps: progress.skippedSteps || [],
                    lastSaved: progress.lastSaved
                };
            }
        } catch (error) {
            console.warn('Failed to load saved wizard progress:', error);
        }
        return null;
    };
    
    const savedProgress = loadSavedProgress();
    
    const [currentStep, setCurrentStep] = React.useState(savedProgress?.currentStep || 1);
    const [completedSteps, setCompletedSteps] = React.useState(savedProgress?.completedSteps || []);
    const [skippedSteps, setSkippedSteps] = React.useState(savedProgress?.skippedSteps || []);
    const [showSaveNotification, setShowSaveNotification] = React.useState(false);
    const [lastSaved, setLastSaved] = React.useState(savedProgress?.lastSaved || null);

    const totalSteps = 8;
    
    // Auto-save progress to localStorage
    React.useEffect(() => {
        const saveProgress = () => {
            try {
                const progress = {
                    currentStep,
                    completedSteps,
                    skippedSteps,
                    lastSaved: new Date().toISOString()
                };
                localStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(progress));
                localStorage.setItem(WIZARD_INPUTS_KEY, JSON.stringify(inputs));
                setLastSaved(new Date().toISOString());
                
                // Show save notification briefly
                setShowSaveNotification(true);
                setTimeout(() => setShowSaveNotification(false), 2000);
            } catch (error) {
                console.error('Failed to save wizard progress:', error);
            }
        };
        
        // Save after a short delay to debounce rapid changes
        const timer = setTimeout(saveProgress, 500);
        return () => clearTimeout(timer);
    }, [currentStep, completedSteps, skippedSteps, inputs]);
    
    // Load saved inputs on mount
    React.useEffect(() => {
        if (savedProgress) {
            try {
                const savedInputs = localStorage.getItem(WIZARD_INPUTS_KEY);
                if (savedInputs) {
                    const parsedInputs = JSON.parse(savedInputs);
                    setInputs(prevInputs => ({...prevInputs, ...parsedInputs}));
                }
            } catch (error) {
                console.warn('Failed to load saved inputs:', error);
            }
        }
    }, []);
    
    // Clear saved progress when wizard is completed
    const clearSavedProgress = () => {
        try {
            localStorage.removeItem(WIZARD_STORAGE_KEY);
            localStorage.removeItem(WIZARD_INPUTS_KEY);
        } catch (error) {
            console.error('Failed to clear saved progress:', error);
        }
    };

    // Multi-language content
    const content = {
        he: {
            wizardTitle: 'אשף תכנון פנסיה מתקדם',
            wizardSubtitle: 'נאסוף את כל המידע הדרוש לחישוב מקיף של תכנית הפנסיה שלך',
            saveStatus: 'נשמר אוטומטית',
            lastSavedAt: 'נשמר לאחרונה ב',
            clearProgress: 'נקה התקדמות',
            resumeProgress: 'המשך מהמקום שבו הפסקת',
            startFresh: 'התחל מחדש',
            steps: {
                1: { title: 'פרטים אישיים', subtitle: 'גיל, גיל פרישה וסוג התכנון' },
                2: { title: 'משכורת והכנסות', subtitle: 'משכורת חודשית ומקורות הכנסה נוספים' },
                3: { title: 'חיסכונות קיימים', subtitle: 'פנסיה, קרן השתלמות והשקעות אישיות' },
                4: { title: 'הגדרות הפקדה', subtitle: 'אחוזי הפקדה וכללים לפי מדינה' },
                5: { title: 'דמי ניהול', subtitle: 'עמלות ועלויות ניהול השקעות' },
                6: { title: 'העדפות השקעה', subtitle: 'סיכון, תשואה וחלוקת נכסים' },
                7: { title: 'יעדי פרישה', subtitle: 'הכנסה רצויה בפרישה ותכנון אורח חיים' },
                8: { title: 'סקירה מקיפה', subtitle: 'ניתוח מלא עם המלצות והערכת בריאות פיננסית' }
            }
        },
        en: {
            wizardTitle: 'Advanced Retirement Planning Wizard',
            wizardSubtitle: 'We\'ll collect all the information needed for a comprehensive retirement plan calculation',
            saveStatus: 'Auto-saved',
            lastSavedAt: 'Last saved at',
            clearProgress: 'Clear Progress',
            resumeProgress: 'Resume where you left off',
            startFresh: 'Start Fresh',
            steps: {
                1: { title: 'Personal Information', subtitle: 'Age, retirement age, and planning type' },
                2: { title: 'Salary & Income', subtitle: 'Monthly salary and additional income sources' },
                3: { title: 'Current Savings', subtitle: 'Pension, training fund, and personal investments' },
                4: { title: 'Contribution Settings', subtitle: 'Contribution percentages and country-specific rules' },
                5: { title: 'Management Fees', subtitle: 'Investment fees and management costs' },
                6: { title: 'Investment Preferences', subtitle: 'Risk tolerance, returns, and asset allocation' },
                7: { title: 'Retirement Goals', subtitle: 'Target retirement income and lifestyle planning' },
                8: { title: 'Comprehensive Review', subtitle: 'Complete analysis with recommendations and financial health scoring' }
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
            clearSavedProgress();
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

    // Beneficiary section validation for inheritance planning
    const validateBeneficiarySection = (inputs) => {
        // Check if will status is completed
        const hasWillStatus = inputs.willStatus && inputs.willStatus !== '';
        
        // Check if life insurance information is provided (if enabled)
        const hasLifeInsuranceInfo = inputs.lifeInsuranceAmount || inputs.premiumAmount;
        
        // For couple mode, check that basic inheritance planning is addressed
        if (inputs.planningType === 'couple') {
            // At minimum, will status should be set for couples
            return hasWillStatus;
        }
        
        // For single mode, either will status OR life insurance info should be provided
        return hasWillStatus || hasLifeInsuranceInfo;
    };

    // Enhanced step validation with realistic business rules
    const isCurrentStepValid = () => {
        switch (currentStep) {
            case 1: 
                // Personal Information validation
                const currentAge = inputs.currentAge || 0;
                const retirementAge = inputs.retirementAge || 0;
                return currentAge >= 18 && currentAge <= 100 && 
                       retirementAge > currentAge && retirementAge <= 75;
            
            case 2: 
                // Salary validation - at least one income source
                const mainSalary = inputs.currentMonthlySalary || 0;
                const partner1Salary = inputs.partner1Salary || 0;
                const partner2Salary = inputs.partner2Salary || 0;
                const totalSalary = mainSalary + partner1Salary + partner2Salary;
                return totalSalary > 0 && totalSalary <= 1000000; // Reasonable upper limit
            
            case 3: 
                // Savings validation - non-negative values
                return (inputs.currentSavings || 0) >= 0 && 
                       (inputs.currentTrainingFundSavings || 0) >= 0;
            
            case 4: 
                // Contribution validation - reasonable percentage ranges
                const pensionRate = inputs.pensionContributionRate || 0;
                const trainingRate = inputs.trainingFundContributionRate || 0;
                return pensionRate >= 0 && pensionRate <= 30 && 
                       trainingRate >= 0 && trainingRate <= 15;
            
            case 5: 
                // Fees validation - reasonable fee ranges
                const contribFees = inputs.contributionFees || 0;
                const accumFees = inputs.accumulationFees || 0;
                return contribFees >= 0 && contribFees <= 5 && 
                       accumFees >= 0 && accumFees <= 3;
            
            case 6: 
                // Investment validation - reasonable return expectations
                const expectedReturn = inputs.expectedReturn || 0;
                const inflationRate = inputs.inflationRate || 0;
                return expectedReturn >= 0 && expectedReturn <= 20 && 
                       inflationRate >= 0 && inflationRate <= 15;
            
            case 7: 
                // Goals validation - positive values
                return (inputs.retirementGoal || 0) > 0 && 
                       (inputs.currentMonthlyExpenses || 0) > 0;
            
            case 8: 
                // Final review step - check if we have minimum required data
                return inputs.currentAge && inputs.retirementAge && 
                       (inputs.currentMonthlySalary || inputs.partner1Salary || inputs.partner2Salary);
            
            default: 
                return true;
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
                if (window.WizardStepPersonal) {
                    return React.createElement(window.WizardStepPersonal, stepProps);
                } else {
                    return React.createElement('div', { className: 'text-center p-8' }, 
                        'Personal Information Step - To be implemented');
                }
            case 2:
                if (window.WizardStepSalary) {
                    return React.createElement(window.WizardStepSalary, stepProps);
                } else {
                    return React.createElement('div', { className: 'text-center p-8' }, 
                        'Salary & Income Step - To be implemented');
                }
            case 3:
                if (window.WizardStepSavings) {
                    return React.createElement(window.WizardStepSavings, stepProps);
                } else {
                    return React.createElement('div', { className: 'text-center p-8' }, 
                        'Current Savings Step - To be implemented');
                }
            case 4:
                if (window.WizardStepContributions) {
                    return React.createElement(window.WizardStepContributions, stepProps);
                } else {
                    return React.createElement('div', { className: 'text-center p-8' }, 
                        'Contribution Settings Step - To be implemented');
                }
            case 5:
                if (window.WizardStepFees) {
                    return React.createElement(window.WizardStepFees, stepProps);
                } else {
                    return React.createElement('div', { className: 'text-center p-8' }, 
                        'Management Fees Step - To be implemented');
                }
            case 6:
                if (window.WizardStepInvestments) {
                    return React.createElement(window.WizardStepInvestments, stepProps);
                } else {
                    return React.createElement('div', { className: 'text-center p-8' }, 
                        'Investment Preferences Step - To be implemented');
                }
            case 7:
                if (window.WizardStepGoals) {
                    return React.createElement(window.WizardStepGoals, stepProps);
                } else {
                    return React.createElement('div', { className: 'text-center p-8' }, 
                        'Retirement Goals Step - To be implemented');
                }
            case 8:
                if (window.WizardStepReview) {
                    return React.createElement(window.WizardStepReview, stepProps);
                } else {
                    return React.createElement('div', { className: 'text-center p-8' }, 
                        'Comprehensive Review Step - Loading...');
                }
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
            // Navigation and Save Status
            React.createElement('div', {
                key: 'nav-and-status',
                className: "mb-6"
            }, [
                // Return to Dashboard and Save Status Row
                React.createElement('div', {
                    key: 'top-nav',
                    className: "flex justify-between items-center mb-4"
                }, [
                    onReturnToDashboard && React.createElement('button', {
                        key: 'return-button',
                        onClick: onReturnToDashboard,
                        className: "flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    }, [
                        React.createElement('span', { key: 'arrow', className: "mr-2" }, '←'),
                        React.createElement('span', { key: 'text' }, language === 'he' ? 'חזרה ללוח הבקרה' : 'Return to Dashboard')
                    ]),
                    
                    // Save Status Indicator
                    React.createElement('div', {
                        key: 'save-status',
                        className: `flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                            showSaveNotification ? 'bg-green-100 text-green-700 opacity-100' : 'bg-gray-100 text-gray-600 opacity-75'
                        }`
                    }, [
                        React.createElement('span', {
                            key: 'save-icon',
                            className: "mr-2"
                        }, showSaveNotification ? '✓' : '💾'),
                        React.createElement('span', {
                            key: 'save-text',
                            className: "text-sm font-medium"
                        }, t.saveStatus),
                        lastSaved && React.createElement('span', {
                            key: 'save-time',
                            className: "ml-2 text-xs opacity-75"
                        }, `${t.lastSavedAt} ${new Date(lastSaved).toLocaleTimeString()}`)
                    ])
                ]),
                
                // Clear Progress Button (only show if there's saved progress)
                savedProgress && currentStep > 1 && React.createElement('div', {
                    key: 'progress-controls',
                    className: "flex justify-center"
                }, [
                    React.createElement('button', {
                        key: 'clear-progress',
                        onClick: () => {
                            if (window.confirm(language === 'he' ? 
                                'האם אתה בטוח שברצונך למחוק את ההתקדמות השמורה?' : 
                                'Are you sure you want to clear your saved progress?')) {
                                clearSavedProgress();
                                setCurrentStep(1);
                                setCompletedSteps([]);
                                setSkippedSteps([]);
                                setInputs({});
                            }
                        },
                        className: "px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    }, [
                        React.createElement('span', { key: 'icon', className: "mr-2" }, '🗑️'),
                        t.clearProgress
                    ])
                ])
            ]),
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