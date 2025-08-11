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
            
            const result = {};
            
            if (savedProgress) {
                const progress = JSON.parse(savedProgress);
                result.progress = {
                    currentStep: progress.currentStep || 1,
                    completedSteps: progress.completedSteps || [],
                    skippedSteps: progress.skippedSteps || [],
                    lastSaved: progress.lastSaved
                };
            }
            
            if (savedInputs) {
                result.inputs = JSON.parse(savedInputs);
            }
            
            return result;
        } catch (error) {
            console.warn('Failed to load saved wizard progress:', error);
        }
        return {};
    };
    
    const totalSteps = 9;
    const savedData = loadSavedProgress();
    
    // Ensure saved step doesn't exceed new total (fixing 10->8 step reduction)
    const initialStep = savedData?.progress?.currentStep ? 
        Math.min(savedData.progress.currentStep, totalSteps) : 1;
    
    const [currentStep, setCurrentStep] = React.useState(initialStep);
    const [completedSteps, setCompletedSteps] = React.useState(savedData?.progress?.completedSteps || []);
    const [skippedSteps, setSkippedSteps] = React.useState(savedData?.progress?.skippedSteps || []);
    const [showSaveNotification, setShowSaveNotification] = React.useState(false);
    const [lastSaved, setLastSaved] = React.useState(savedData?.progress?.lastSaved || null);
    
    // Use refs to store current values and prevent infinite loops
    const currentStepRef = React.useRef(currentStep);
    const completedStepsRef = React.useRef(completedSteps);
    const skippedStepsRef = React.useRef(skippedSteps);
    const inputsRef = React.useRef(inputs);
    
    // Load saved inputs on mount
    React.useEffect(() => {
        if (savedData?.inputs && Object.keys(savedData.inputs).length > 0) {
            console.log('Loading saved wizard inputs...');
            setInputs(prevInputs => ({
                ...prevInputs,
                ...savedData.inputs
            }));
        }
    }, []); // Run only on mount
    
    // Update refs when values change
    React.useEffect(() => {
        currentStepRef.current = currentStep;
    }, [currentStep]);
    
    React.useEffect(() => {
        completedStepsRef.current = completedSteps;
    }, [completedSteps]);
    
    React.useEffect(() => {
        skippedStepsRef.current = skippedSteps;
    }, [skippedSteps]);
    
    React.useEffect(() => {
        inputsRef.current = inputs;
        // Also update window.wizardInputs for global access
        if (window.setAllInputs) {
            window.setAllInputs(inputs);
        } else {
            window.wizardInputs = inputs;
        }
    }, [inputs]);
    
    // Immediate save function for critical operations - now dependency-free
    const saveProgressImmediate = React.useCallback((criticalData = false) => {
        try {
            const progress = {
                currentStep: currentStepRef.current,
                completedSteps: completedStepsRef.current,
                skippedSteps: skippedStepsRef.current,
                lastSaved: new Date().toISOString()
            };
            localStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(progress));
            localStorage.setItem(WIZARD_INPUTS_KEY, JSON.stringify(inputsRef.current));
            setLastSaved(new Date().toISOString());
            
            if (criticalData) {
                // Trigger immediate Financial Health recalculation
                setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('wizardDataUpdated', { 
                        detail: { inputs: inputsRef.current, immediate: true } 
                    }));
                }, 0);
            }
        } catch (error) {
            console.error('Failed to save wizard progress:', error);
        }
    }, []);

    // Clear saved progress when wizard is completed
    const clearSavedProgress = React.useCallback(() => {
        try {
            localStorage.removeItem(WIZARD_STORAGE_KEY);
            localStorage.removeItem(WIZARD_INPUTS_KEY);
        } catch (error) {
            console.error('Failed to clear saved progress:', error);
        }
    }, []);
    
    // Define navigation handlers early to avoid initialization errors
    const handleNext = React.useCallback(() => {
        if (currentStep < totalSteps) {
            setCompletedSteps(prev => [...new Set([...prev, currentStep])]);
            setCurrentStep(Math.min(currentStep + 1, totalSteps));
            
            // Immediate save for step completion
            setTimeout(() => {
                saveProgressImmediate(true);
            }, 0);
        } else {
            // Final step - ensure all data is saved before completion
            saveProgressImmediate(true);
            setTimeout(() => {
                clearSavedProgress();
                onComplete && onComplete();
            }, 100);
        }
    }, [currentStep, totalSteps, saveProgressImmediate, clearSavedProgress, onComplete]);

    const handlePrevious = React.useCallback(() => {
        if (currentStep > 1) {
            setCurrentStep(Math.max(currentStep - 1, 1));
        }
    }, [currentStep]);
    
    // Multi-language content - Define BEFORE using in useEffect
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
                3: { title: 'הוצאות חודשיות', subtitle: 'מעקב אחר הוצאות לפי קטגוריות ותחזית שנתית' },
                4: { title: 'חיסכונות קיימים', subtitle: 'פנסיה, קרן השתלמות והשקעות אישיות' },
                5: { title: 'הגדרות הפקדה', subtitle: 'אחוזי הפקדה וכללים לפי מדינה' },
                6: { title: 'דמי ניהול', subtitle: 'עמלות ועלויות ניהול השקעות' },
                7: { title: 'העדפות השקעה', subtitle: 'סיכון, תשואה וחלוקת נכסים' },
                8: { title: 'יעדי פרישה', subtitle: 'הכנסה רצויה בפרישה ותכנון אורח חיים' },
                9: { title: 'סקירה מקיפה', subtitle: 'ניתוח מלא עם המלצות והערכת בריאות פיננסית' }
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
                3: { title: 'Monthly Expenses', subtitle: 'Track expenses by category and yearly predictions' },
                4: { title: 'Current Savings', subtitle: 'Pension, training fund, and personal investments' },
                5: { title: 'Contribution Settings', subtitle: 'Contribution percentages and country-specific rules' },
                6: { title: 'Management Fees', subtitle: 'Investment fees and management costs' },
                7: { title: 'Investment Preferences', subtitle: 'Risk tolerance, returns, and asset allocation' },
                8: { title: 'Retirement Goals', subtitle: 'Target retirement income and lifestyle planning' },
                9: { title: 'Comprehensive Review', subtitle: 'Complete analysis with recommendations and financial health scoring' }
            }
        }
    };

    const t = content[language];
    
    // Keyboard navigation support
    React.useEffect(() => {
        const handleKeyDown = (event) => {
            if (window.a11yUtils && window.a11yUtils.handleWizardKeyNavigation) {
                window.a11yUtils.handleWizardKeyNavigation(
                    event,
                    currentStep,
                    totalSteps,
                    handleNext,
                    handlePrevious,
                    language
                );
            }
        };
        
        // Listen for custom step change events
        const handleStepChange = (event) => {
            const { step } = event.detail;
            if (step >= 1 && step <= totalSteps) {
                setCurrentStep(step);
                // Announce step change to screen readers
                if (window.a11yUtils && window.a11yUtils.announceToScreenReader) {
                    const stepInfo = t.steps[step];
                    window.a11yUtils.announceToScreenReader(
                        `${language === 'he' ? 'שלב' : 'Step'} ${step}: ${stepInfo.title}`,
                        'polite'
                    );
                }
            }
        };
        
        document.addEventListener('keydown', handleKeyDown);
        window.addEventListener('wizardStepChange', handleStepChange);
        
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('wizardStepChange', handleStepChange);
        };
    }, [currentStep, totalSteps, handleNext, handlePrevious, language, t.steps]);

    // Auto-save progress to localStorage with enhanced timing
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
        
        // Reduced debounce delay for better responsiveness
        const timer = setTimeout(saveProgress, 200);
        return () => clearTimeout(timer);
    }, [currentStep, completedSteps, skippedSteps, inputs]);
    
    // Load saved inputs on mount only (runs once)
    React.useEffect(() => {
        if (savedData?.progress) {
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
    }, []); // Empty dependency array - runs only on mount
    
    // Modal completion handler - separate effect with no inputs dependency
    React.useEffect(() => {
        const handleModalCompletion = (event) => {
            const { updatedInputs } = event.detail;
            
            // Merge modal data with current inputs from ref
            const mergedInputs = { ...inputsRef.current, ...updatedInputs };
            setInputs(mergedInputs);
            
            // Immediate save and recalculation
            setTimeout(() => {
                saveProgressImmediate(true);
            }, 0);
        };
        
        window.addEventListener('modalDataCompleted', handleModalCompletion);
        return () => window.removeEventListener('modalDataCompleted', handleModalCompletion);
    }, [saveProgressImmediate]); // Only depends on saveProgressImmediate (now stable)

    // Calculate progress percentage
    const getProgressPercent = (step) => {
        return ((step - 1) / (totalSteps - 1)) * 100;
    };

    // Skip handler
    const handleSkip = () => {
        if (currentStep < totalSteps) {
            setSkippedSteps(prev => [...new Set([...prev, currentStep])]);
            setCurrentStep(Math.min(currentStep + 1, totalSteps));
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

    // Enhanced step validation with localStorage data support
    const isCurrentStepValid = () => {
        // Helper function to get saved data from localStorage
        const getSavedInputs = () => {
            try {
                const savedInputs = localStorage.getItem(WIZARD_INPUTS_KEY);
                return savedInputs ? JSON.parse(savedInputs) : {};
            } catch (error) {
                return {};
            }
        };
        
        // Merge current inputs with saved data for validation
        const savedInputs = getSavedInputs();
        const mergedInputs = { ...savedInputs, ...inputs };
        
        switch (currentStep) {
            case 1: 
                // Personal Information validation - check both current and saved data
                const currentAge = mergedInputs.currentAge || 0;
                const retirementAge = mergedInputs.retirementAge || 0;
                return currentAge >= 18 && currentAge <= 100 && 
                       retirementAge > currentAge && retirementAge <= 75;
            
            case 2: 
                // Salary validation - at least one income source from current or saved data
                const mainSalary = mergedInputs.currentMonthlySalary || 0;
                const partner1Salary = mergedInputs.partner1Salary || 0;
                const partner2Salary = mergedInputs.partner2Salary || 0;
                const totalSalary = mainSalary + partner1Salary + partner2Salary;
                return totalSalary > 0 && totalSalary <= 1000000; // Reasonable upper limit
            
            case 3: 
                // Expenses validation - non-negative values from current or saved data
                return (mergedInputs.currentMonthlyExpenses || 0) >= 0;
            
            case 4: 
                // Current Savings validation - non-negative values from current or saved data
                return (mergedInputs.currentSavings || 0) >= 0 && 
                       (mergedInputs.currentTrainingFund || 0) >= 0;
            
            case 5: 
                // Contribution validation - reasonable percentage ranges from current or saved data
                const pensionRate = mergedInputs.pensionContributionRate || 0;
                const trainingRate = mergedInputs.trainingFundContributionRate || 0;
                return pensionRate >= 0 && pensionRate <= 30 && 
                       trainingRate >= 0 && trainingRate <= 15;
            
            case 6: 
                // Fees validation - reasonable fee ranges from current or saved data
                const contribFees = mergedInputs.contributionFees || 0;
                const accumFees = mergedInputs.accumulationFees || 0;
                return contribFees >= 0 && contribFees <= 5 && 
                       accumFees >= 0 && accumFees <= 3;
            
            case 7: 
                // Investment validation - reasonable return expectations from current or saved data
                const expectedReturn = mergedInputs.expectedReturn || 0;
                const inflationRate = mergedInputs.inflationRate || 0;
                
                // Check couple mode partner investments
                if (mergedInputs.planningType === 'couple') {
                    // Use default values if not set - be lenient with validation
                    const partner1RiskProfile = mergedInputs.partner1RiskProfile || 'moderate';
                    const partner1ExpectedReturn = mergedInputs.partner1ExpectedReturn || 7.0;
                    const partner2RiskProfile = mergedInputs.partner2RiskProfile || 'moderate';
                    const partner2ExpectedReturn = mergedInputs.partner2ExpectedReturn || 7.0;
                    
                    // Validate partner 1 investment preferences (using defaults if not set)
                    const partner1Valid = partner1RiskProfile && 
                                        (partner1ExpectedReturn >= 0 && partner1ExpectedReturn <= 25);
                    
                    // Validate partner 2 investment preferences (using defaults if not set)
                    const partner2Valid = partner2RiskProfile && 
                                        (partner2ExpectedReturn >= 0 && partner2ExpectedReturn <= 25);
                    
                    // All partner fields must be valid
                    return partner1Valid && partner2Valid && 
                           inflationRate >= 0 && inflationRate <= 15;
                }
                
                // Individual mode validation
                return expectedReturn >= 0 && expectedReturn <= 25 && 
                       inflationRate >= 0 && inflationRate <= 15;
            
            case 8: 
                // Goals validation - always allow progression, goals are optional
                // User can proceed with default retirement goal calculations
                return true;
            
            case 9: 
                // Final review step - check if we have minimum required data from current or saved
                return mergedInputs.currentAge && mergedInputs.retirementAge && 
                       (mergedInputs.currentMonthlySalary || mergedInputs.partner1Salary || mergedInputs.partner2Salary);
            
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
                if (window.WizardStepExpenses) {
                    return React.createElement(window.WizardStepExpenses, {
                        ...stepProps,
                        formatCurrency: window.formatCurrency
                    });
                } else {
                    return React.createElement('div', { className: 'text-center p-8' }, 
                        'Monthly Expenses Step - To be implemented');
                }
            case 4:
                if (window.WizardStepSavings) {
                    return React.createElement(window.WizardStepSavings, stepProps);
                } else {
                    return React.createElement('div', { className: 'text-center p-8' }, 
                        'Current Savings Step - To be implemented');
                }
            case 5:
                if (window.WizardStepContributions) {
                    return React.createElement(window.WizardStepContributions, stepProps);
                } else {
                    return React.createElement('div', { className: 'text-center p-8' }, 
                        'Contribution Settings Step - To be implemented');
                }
            case 6:
                if (window.WizardStepFees) {
                    return React.createElement(window.WizardStepFees, stepProps);
                } else {
                    return React.createElement('div', { className: 'text-center p-8' }, 
                        'Management Fees Step - To be implemented');
                }
            case 7:
                if (window.WizardStepInvestments) {
                    return React.createElement(window.WizardStepInvestments, stepProps);
                } else {
                    return React.createElement('div', { className: 'text-center p-8' }, 
                        'Investment Preferences Step - To be implemented');
                }
            case 8:
                if (window.WizardStepGoals) {
                    return React.createElement(window.WizardStepGoals, stepProps);
                } else {
                    return React.createElement('div', { className: 'text-center p-8' }, 
                        'Retirement Goals Step - To be implemented');
                }
            case 9:
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
                ])
            ]),
            
            // Clear Progress Button (only show if there's saved progress)
            (savedData?.progress && currentStep > 1) ? React.createElement('div', {
                key: 'progress-controls',
                className: "flex justify-center mb-6"
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
                ]),
                // Temporary button to clear all local storage for debugging
                React.createElement('button', {
                    key: 'clear-all-storage',
                    onClick: () => {
                        if (window.confirm('DEBUG: Are you sure you want to clear ALL local storage for this app? This will reset everything.')) {
                            localStorage.clear();
                            window.location.reload();
                        }
                    },
                    className: "ml-2 px-4 py-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                }, 'DEBUG: Clear All Storage')
            ]) : null,
            
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
            title: t.steps[currentStep]?.title || 'Step ' + currentStep,
            subtitle: t.steps[currentStep]?.subtitle || '',
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