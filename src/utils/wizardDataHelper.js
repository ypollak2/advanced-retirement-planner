// Wizard Data Helper - Provides utilities for accessing wizard data
// This ensures Review step can access all collected data

(function() {
    'use strict';
    
    // Get all wizard inputs from current state or localStorage
    window.getAllInputs = function() {
        // First try to get from React component if available
        const wizardElement = document.querySelector('[data-wizard-inputs]');
        if (wizardElement && wizardElement._reactInternalInstance) {
            const props = wizardElement._reactInternalInstance.memoizedProps;
            if (props && props.inputs) {
                console.log('📋 Got inputs from React props');
                return props.inputs;
            }
        }
        
        // Fallback to localStorage
        try {
            const savedInputs = localStorage.getItem('retirementWizardInputs');
            if (savedInputs) {
                const inputs = JSON.parse(savedInputs);
                console.log('📋 Got inputs from localStorage:', Object.keys(inputs).length, 'fields');
                return inputs;
            }
        } catch (error) {
            console.error('Failed to parse saved inputs:', error);
        }
        
        // Last resort - try to find inputs in window scope
        if (window.wizardInputs) {
            console.log('📋 Got inputs from window.wizardInputs');
            return window.wizardInputs;
        }
        
        console.warn('⚠️ No inputs found - returning empty object');
        return {};
    };
    
    // Set all wizard inputs
    window.setAllInputs = function(newInputs) {
        // Save to localStorage
        try {
            localStorage.setItem('retirementWizardInputs', JSON.stringify(newInputs));
            console.log('✅ Saved inputs to localStorage');
        } catch (error) {
            console.error('Failed to save inputs:', error);
        }
        
        // Also store in window for easy access
        window.wizardInputs = newInputs;
        
        // Dispatch event for any listeners
        window.dispatchEvent(new CustomEvent('wizardInputsUpdated', { 
            detail: { inputs: newInputs } 
        }));
    };
    
    // Update specific input fields
    window.updateInputs = function(updates) {
        const currentInputs = window.getAllInputs();
        const newInputs = { ...currentInputs, ...updates };
        window.setAllInputs(newInputs);
        return newInputs;
    };
    
    // Debug helper to validate wizard data
    window.validateWizardData = function() {
        const inputs = window.getAllInputs();
        const validation = {
            hasData: Object.keys(inputs).length > 0,
            planningType: inputs.planningType || 'NOT SET',
            fields: Object.keys(inputs).length,
            criticalFields: {
                age: !!inputs.currentAge,
                retirementAge: !!inputs.retirementAge,
                salary: !!(inputs.currentMonthlySalary || inputs.partner1Salary),
                savings: !!(inputs.currentSavings || inputs.partner1CurrentPension)
            }
        };
        
        console.log('🔍 Wizard Data Validation:', validation);
        return validation;
    };
    
    // Listen for wizard updates to keep data in sync
    window.addEventListener('wizardDataUpdated', function(event) {
        if (event.detail && event.detail.inputs) {
            window.wizardInputs = event.detail.inputs;
            console.log('📝 Updated wizard inputs from event');
        }
    });
    
    console.log('✅ Wizard Data Helper loaded - window.getAllInputs() available');
})();