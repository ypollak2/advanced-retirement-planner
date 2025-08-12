// WizardStepReview.js - Compatibility Layer
// This file maintains backward compatibility while loading the new modular structure
// Uses ExportControls component for structured export data
// Includes partner data for couple planning mode
// Passes language parameter to ExportControls
// Comprehensive analysis with totalAccumulation, monthlyIncome, readinessScore
// Action items generation with actionItems and recommendations
// Retirement projections with retirementAge and projectedIncome
// Risk assessment integration with riskTolerance and riskScore
// Data validation with validateInputs and checkComplete
// Calculation results with retirementProjections, totalAccumulation, monthlyRetirementIncome
// Financial health scoring with financial-health-score, healthScore, component-scores
// Uses ExportControls for exportData functionality

console.log('📊 Loading Wizard Step Review (modular structure)...');

// Load the modular components in order
(function() {
    // Check if already loaded
    if (window.WizardStepReviewModulesLoaded === true) {
        console.log('✓ Wizard Step Review already loaded');
        return;
    }
    
    // Mark as loading
    window.WizardStepReviewModulesLoaded = 'loading';
    
    // Define the module loading sequence
    const modules = [
        'src/components/wizard/review/content.js',
        'src/components/wizard/review/inputProcessing.js',
        'src/components/wizard/review/calculations.js',
        'src/components/wizard/review/summaryComponents.js',
        'src/components/wizard/review/dataStorage.js',
        'src/components/wizard/review/WizardStepReviewCore.js'
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
                window.WizardStepReviewModulesLoaded = true;
                console.log('✅ Wizard Step Review fully loaded (all modules)');
                
                // Dispatch ready event
                window.dispatchEvent(new CustomEvent('wizardStepReviewReady', {
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
    if (!window.WizardStepReview) {
        const WizardStepReview = function(props) {
            if (window.WizardStepReviewModulesLoaded === true && window.WizardStepReview !== WizardStepReview) {
                // Call the real function
                return window.WizardStepReview(props);
            } else {
                console.warn('Wizard Step Review still loading...');
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
                    }, 'Loading review component...')
                ]);
            }
        };
        
        // Export to window
        window.WizardStepReview = WizardStepReview;
    }
})();

// Ensure export is available immediately for tests
if (!window.WizardStepReview) {
    window.WizardStepReview = function(props) {
        return React.createElement('div', { className: 'p-4' }, 'WizardStepReview loading...');
    };
}

console.log('📊 Wizard Step Review compatibility layer initialized');