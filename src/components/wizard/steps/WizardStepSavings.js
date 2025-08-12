// WizardStepSavings.js - Compatibility Layer
// This file maintains backward compatibility while loading the new modular structure
// Field name consistency: currentRealEstate, currentCrypto
// Total calculation function updated with partner fields included
// Partner savings breakdown with investment categories

console.log('💼 Loading Wizard Step Savings (modular structure)...');

// Load the modular components in order
(function() {
    // Check if already loaded
    if (window.WizardStepSavingsModulesLoaded === true) {
        console.log('✓ Wizard Step Savings already loaded');
        return;
    }
    
    // Mark as loading
    window.WizardStepSavingsModulesLoaded = 'loading';
    
    // Define the module loading sequence
    const modules = [
        'src/components/wizard/savings/content.js',
        'src/components/wizard/savings/calculations.js',
        'src/components/wizard/savings/mainPersonSavings.js',
        'src/components/wizard/savings/partnerSavings.js',
        'src/components/wizard/savings/WizardStepSavingsCore.js'
    ];
    
    let loadedCount = 0;
    
    // Load all modules
    modules.forEach((modulePath, index) => {
        const script = document.createElement('script');
        script.src = modulePath + '?v=8.0.0';
        script.async = false; // Ensure sequential loading
        
        script.onload = () => {
            loadedCount++;
            console.log(`✓ Loaded module ${loadedCount}/${modules.length}: ${modulePath.split('/').pop()}`);
            
            if (loadedCount === modules.length) {
                // All modules loaded
                window.WizardStepSavingsModulesLoaded = true;
                console.log('✅ Wizard Step Savings fully loaded (all modules)');
                
                // Dispatch ready event
                window.dispatchEvent(new CustomEvent('wizardStepSavingsReady', {
                    detail: { version: '7.5.11', modular: true }
                }));
            }
        };
        
        script.onerror = (error) => {
            console.error(`❌ Failed to load module: ${modulePath}`, error);
        };
        
        // Add script to document
        document.head.appendChild(script);
    });
    
    // Create placeholder function if needed
    if (!window.WizardStepSavings) {
        const WizardStepSavings = function(props) {
            if (window.WizardStepSavingsModulesLoaded === true && window.WizardStepSavings !== WizardStepSavings) {
                // Call the real function
                return window.WizardStepSavings(props);
            } else {
                console.warn('Wizard Step Savings still loading...');
                // Return a loading component
                return React.createElement('div', {
                    className: 'flex items-center justify-center py-8'
                }, [
                    React.createElement('div', {
                        key: 'spinner',
                        className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3'
                    }),
                    React.createElement('span', {
                        key: 'message',
                        className: 'text-gray-600'
                    }, 'Loading savings component...')
                ]);
            }
        };
        
        // Export to window
        window.WizardStepSavings = WizardStepSavings;
    }
})();

// Ensure export is available immediately for tests
if (!window.WizardStepSavings) {
    window.WizardStepSavings = function(props) {
        return React.createElement('div', { className: 'p-4' }, 'WizardStepSavings loading...');
    };
}

console.log('💼 Wizard Step Savings compatibility layer initialized');