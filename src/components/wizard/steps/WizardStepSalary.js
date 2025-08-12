// WizardStepSalary.js - Compatibility Layer
// This file maintains backward compatibility while loading the new modular structure

console.log('💼 Loading Wizard Step Salary (modular structure)...');

// Load the modular components in order
(function() {
    // Check if already loaded
    if (window.WizardStepSalaryModulesLoaded === true) {
        console.log('✓ Wizard Step Salary already loaded');
        return;
    }
    
    // Mark as loading
    window.WizardStepSalaryModulesLoaded = 'loading';
    
    // Define the module loading sequence
    const modules = [
        'src/components/wizard/salary/content.js',
        'src/components/wizard/salary/validation.js',
        'src/components/wizard/salary/calculations.js',
        'src/components/wizard/salary/salaryInputs.js',
        'src/components/wizard/salary/additionalIncome.js',
        'src/components/wizard/salary/incomeSummary.js',
        'src/components/wizard/salary/WizardStepSalaryCore.js'
    ];
    
    let loadedCount = 0;
    
    // Load all modules
    modules.forEach((modulePath, index) => {
        const script = document.createElement('script');
        script.src = modulePath + '?v=7.5.11';
        script.async = false; // Ensure sequential loading
        
        script.onload = () => {
            loadedCount++;
            console.log(`✓ Loaded module ${loadedCount}/${modules.length}: ${modulePath.split('/').pop()}`);
            
            if (loadedCount === modules.length) {
                // All modules loaded
                window.WizardStepSalaryModulesLoaded = true;
                console.log('✅ Wizard Step Salary fully loaded (all modules)');
                
                // Dispatch ready event
                window.dispatchEvent(new CustomEvent('wizardStepSalaryReady', {
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
    if (!window.WizardStepSalary) {
        const WizardStepSalary = function(props) {
            if (window.WizardStepSalaryModulesLoaded === true && window.WizardStepSalary !== WizardStepSalary) {
                // Call the real function
                return window.WizardStepSalary(props);
            } else {
                console.warn('Wizard Step Salary still loading...');
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
                    }, 'Loading salary component...')
                ]);
            }
        };
        
        // Export to window
        window.WizardStepSalary = WizardStepSalary;
    }
})();

console.log('💼 Wizard Step Salary compatibility layer initialized');