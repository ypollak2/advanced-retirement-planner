// Production Fix for Missing getAllInputs Function
// Run this in the browser console on production to fix Component Scores showing NaN

(function() {
    console.log('🔧 Applying getAllInputs hotfix...');
    
    // Add the missing getAllInputs function
    if (!window.getAllInputs) {
        window.getAllInputs = function() {
            // Try localStorage first
            try {
                const savedInputs = localStorage.getItem('retirementWizardInputs');
                if (savedInputs) {
                    const inputs = JSON.parse(savedInputs);
                    console.log('✅ Retrieved', Object.keys(inputs).length, 'fields from localStorage');
                    return inputs;
                }
            } catch (e) {
                console.error('Failed to get inputs from localStorage:', e);
            }
            
            // Try window.wizardInputs
            if (window.wizardInputs) {
                console.log('✅ Retrieved inputs from window.wizardInputs');
                return window.wizardInputs;
            }
            
            console.warn('⚠️ No inputs found');
            return {};
        };
        console.log('✅ Added window.getAllInputs()');
    }
    
    // Also add setAllInputs if missing
    if (!window.setAllInputs) {
        window.setAllInputs = function(newInputs) {
            try {
                localStorage.setItem('retirementWizardInputs', JSON.stringify(newInputs));
                window.wizardInputs = newInputs;
                console.log('✅ Saved inputs to localStorage and window');
            } catch (error) {
                console.error('Failed to save inputs:', error);
            }
        };
        console.log('✅ Added window.setAllInputs()');
    }
    
    // Force a recalculation by triggering an event
    const inputs = window.getAllInputs();
    if (Object.keys(inputs).length > 0) {
        console.log('🔄 Triggering recalculation with', Object.keys(inputs).length, 'fields');
        window.dispatchEvent(new CustomEvent('wizardInputsUpdated', { 
            detail: { inputs: inputs } 
        }));
        
        // Force re-render of Review step if we're on it
        const reviewStep = document.querySelector('[class*="WizardStepReview"]');
        if (reviewStep) {
            console.log('🔄 Attempting to refresh Review step...');
            // Trigger a small DOM change to force React re-render
            reviewStep.style.opacity = '0.99';
            setTimeout(() => {
                reviewStep.style.opacity = '1';
            }, 10);
        }
    }
    
    console.log('✅ Hotfix applied! You may need to navigate away and back to the Review step.');
    
    // Test the fix
    const testInputs = window.getAllInputs();
    console.log('📋 Test result:', {
        getAllInputs: typeof window.getAllInputs === 'function',
        setAllInputs: typeof window.setAllInputs === 'function',
        inputCount: Object.keys(testInputs).length,
        planningType: testInputs.planningType || 'NOT SET'
    });
})();