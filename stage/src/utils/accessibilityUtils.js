// Accessibility Utilities for Advanced Retirement Planner
// Provides keyboard navigation and ARIA support
// Created by Yali Pollak - v7.2.2

// Keyboard navigation handler for wizard steps
function handleWizardKeyNavigation(event, currentStep, totalSteps, onNext, onPrev, language) {
    const key = event.key;
    
    // Alt + Arrow keys for step navigation
    if (event.altKey) {
        switch(key) {
            case 'ArrowRight':
            case 'ArrowLeft':
                // RTL support for Hebrew
                const isRTL = language === 'he';
                const isNext = (key === 'ArrowRight' && !isRTL) || (key === 'ArrowLeft' && isRTL);
                
                if (isNext && currentStep < totalSteps) {
                    event.preventDefault();
                    onNext();
                } else if (!isNext && currentStep > 1) {
                    event.preventDefault();
                    onPrev();
                }
                break;
        }
    }
    
    // Number keys for direct step navigation
    if (!event.ctrlKey && !event.altKey && !event.shiftKey) {
        const num = parseInt(key);
        if (num >= 1 && num <= totalSteps && num <= 9) {
            event.preventDefault();
            // This would need to be connected to a step change handler
            window.dispatchEvent(new CustomEvent('wizardStepChange', { detail: { step: num } }));
        }
    }
}

// Focus management for form inputs
function manageFocus(container, direction = 'forward') {
    if (!container) return;
    
    const focusableElements = container.querySelectorAll(
        'button:not([disabled]), ' +
        'input:not([disabled]), ' +
        'select:not([disabled]), ' +
        'textarea:not([disabled]), ' +
        '[tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
    let nextIndex;
    
    if (direction === 'forward') {
        nextIndex = currentIndex + 1 >= focusableElements.length ? 0 : currentIndex + 1;
    } else {
        nextIndex = currentIndex - 1 < 0 ? focusableElements.length - 1 : currentIndex - 1;
    }
    
    focusableElements[nextIndex].focus();
}

// ARIA live region announcements
function announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Generate unique IDs for form elements
function generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Create ARIA-compliant error message
function createErrorMessage(fieldId, errorText, language = 'en') {
    const errorId = `${fieldId}-error`;
    return {
        id: errorId,
        props: {
            id: errorId,
            role: 'alert',
            'aria-live': 'polite',
            className: 'text-sm text-red-600 mt-1'
        },
        text: errorText
    };
}

// Enhanced input props with ARIA attributes
function getAccessibleInputProps(fieldName, label, error, required = false, language = 'en') {
    const fieldId = generateId(fieldName);
    const labelId = `${fieldId}-label`;
    const errorId = error ? `${fieldId}-error` : null;
    const descriptionId = `${fieldId}-desc`;
    
    return {
        input: {
            id: fieldId,
            name: fieldName,
            'aria-labelledby': labelId,
            'aria-describedby': [descriptionId, errorId].filter(Boolean).join(' '),
            'aria-invalid': error ? 'true' : 'false',
            'aria-required': required ? 'true' : 'false'
        },
        label: {
            id: labelId,
            htmlFor: fieldId
        },
        error: error ? {
            id: errorId,
            role: 'alert',
            'aria-live': 'polite'
        } : null,
        description: {
            id: descriptionId
        }
    };
}

// Skip navigation link component props
function getSkipNavProps(targetId, language = 'en') {
    return {
        href: `#${targetId}`,
        className: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50',
        onClick: (e) => {
            e.preventDefault();
            const target = document.getElementById(targetId);
            if (target) {
                target.focus();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        },
        children: language === 'he' ? 'דלג לתוכן הראשי' : 'Skip to main content'
    };
}

// Keyboard shortcuts help text
function getKeyboardShortcuts(language = 'en') {
    const shortcuts = {
        en: {
            title: 'Keyboard Shortcuts',
            shortcuts: [
                'Alt + Right Arrow: Next step',
                'Alt + Left Arrow: Previous step',
                'Number keys (1-9): Jump to step',
                'Tab: Move between fields',
                'Shift + Tab: Move backwards',
                'Enter: Submit form',
                'Escape: Close dialog'
            ]
        },
        he: {
            title: 'קיצורי מקלדת',
            shortcuts: [
                'Alt + חץ ימינה: השלב הבא',
                'Alt + חץ שמאלה: השלב הקודם',
                'מקשי מספרים (1-9): קפיצה לשלב',
                'Tab: מעבר בין שדות',
                'Shift + Tab: מעבר אחורה',
                'Enter: שליחת טופס',
                'Escape: סגירת חלון'
            ]
        }
    };
    
    return shortcuts[language] || shortcuts.en;
}

// Export utilities
window.a11yUtils = {
    handleWizardKeyNavigation,
    manageFocus,
    announceToScreenReader,
    generateId,
    createErrorMessage,
    getAccessibleInputProps,
    getSkipNavProps,
    getKeyboardShortcuts
};

console.log('✅ Accessibility utilities loaded successfully');