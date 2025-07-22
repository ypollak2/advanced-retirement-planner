// WizardStep.js - Base component for multi-step retirement planner wizard
// Provides consistent layout, navigation, and progress tracking for each step

const WizardStep = ({ 
    stepNumber, 
    totalSteps, 
    title, 
    subtitle, 
    children, 
    onNext, 
    onPrevious, 
    onSkip,
    isValid = true, 
    canSkip = true,
    isFirst = false,
    isLast = false,
    language = 'en',
    progressPercent = 0
}) => {
    // Multi-language content
    const content = {
        he: {
            next: 'המשך',
            previous: 'חזור',
            skip: 'דלג',
            complete: 'סיים',
            step: 'שלב',
            of: 'מתוך',
            progress: 'התקדמות'
        },
        en: {
            next: 'Next',
            previous: 'Previous', 
            skip: 'Skip',
            complete: 'Complete',
            step: 'Step',
            of: 'of',
            progress: 'Progress'
        }
    };

    const t = content[language];

    return React.createElement('div', { 
        className: "wizard-step w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg animate-slide-up",
        'data-step': stepNumber 
    }, [
        // Progress Bar
        React.createElement('div', { 
            key: 'progress-section',
            className: "mb-6" 
        }, [
            React.createElement('div', { 
                key: 'progress-header',
                className: "flex justify-between items-center mb-2" 
            }, [
                React.createElement('span', { 
                    key: 'step-indicator',
                    className: "text-sm font-medium text-gray-600" 
                }, `${t.step} ${stepNumber} ${t.of} ${totalSteps}`),
                React.createElement('span', { 
                    key: 'progress-label',
                    className: "text-sm font-medium text-gray-600" 
                }, `${Math.round(progressPercent)}% ${t.progress}`)
            ]),
            React.createElement('div', { 
                key: 'progress-bar-container',
                className: "w-full bg-gray-200 rounded-full h-2" 
            }, [
                React.createElement('div', {
                    key: 'progress-bar',
                    className: "bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out",
                    style: { width: `${progressPercent}%` }
                })
            ])
        ]),

        // Step Header
        React.createElement('div', { 
            key: 'step-header',
            className: "text-center mb-8" 
        }, [
            React.createElement('h2', { 
                key: 'step-title',
                className: "text-3xl font-bold text-gray-800 mb-2" 
            }, title),
            subtitle && React.createElement('p', { 
                key: 'step-subtitle',
                className: "text-lg text-gray-600" 
            }, subtitle)
        ]),

        // Step Content
        React.createElement('div', { 
            key: 'step-content',
            className: "mb-8 min-h-[400px]" 
        }, children),

        // Navigation Buttons
        React.createElement('div', { 
            key: 'navigation',
            className: "flex justify-between items-center pt-6 border-t border-gray-200" 
        }, [
            // Previous Button
            React.createElement('div', { key: 'left-nav' }, [
                !isFirst && React.createElement('button', {
                    key: 'previous-btn',
                    type: 'button',
                    onClick: onPrevious,
                    className: "px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center"
                }, [
                    React.createElement('span', { key: 'prev-icon', className: "mr-2" }, '←'),
                    t.previous
                ])
            ]),

            // Skip Button (center)
            React.createElement('div', { key: 'center-nav' }, [
                canSkip && !isLast && React.createElement('button', {
                    key: 'skip-btn',
                    type: 'button',
                    onClick: onSkip,
                    className: "px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors text-sm underline"
                }, t.skip)
            ]),

            // Next/Complete Button
            React.createElement('div', { key: 'right-nav' }, [
                React.createElement('button', {
                    key: 'next-btn',
                    type: 'button',
                    onClick: onNext,
                    disabled: !isValid,
                    className: `px-6 py-3 rounded-lg font-medium flex items-center transition-colors ${
                        isValid 
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`
                }, [
                    isLast ? t.complete : t.next,
                    React.createElement('span', { key: 'next-icon', className: "ml-2" }, '→')
                ])
            ])
        ])
    ]);
};

// Export to window for global access
window.WizardStep = WizardStep;
console.log('✅ WizardStep component loaded successfully');