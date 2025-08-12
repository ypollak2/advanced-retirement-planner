// Financial Health Engine - Compatibility Layer
// This file maintains backward compatibility while loading the new modular structure
// Enhanced partner field mappings with multiple partner field patterns supported
// Partner value combination logic with environment-aware logging
// Enhanced validation with allowZero option

console.log('📊 Loading Financial Health Engine (compatibility layer)...');

// Load the modular financial health engine
(function() {
    // Check if already loaded
    if (window.financialHealthModulesLoaded === true) {
        console.log('✓ Financial Health Engine already loaded');
        return;
    }
    
    // Define the module loading sequence
    const modules = [
        'src/utils/financialHealth/safeCalculations.js',
        'src/utils/financialHealth/constants.js',
        'src/utils/financialHealth/fieldMapper.js',
        'src/utils/financialHealth/scoringCalculators.js',
        'src/utils/financialHealth/additionalCalculators.js',
        'src/utils/financialHealth/engine.js'
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
                window.financialHealthModulesLoaded = true;
                console.log('✅ Financial Health Engine fully loaded (all modules)');
                
                // Ensure backward compatibility
                ensureBackwardCompatibility();
                
                // Dispatch ready event
                window.dispatchEvent(new CustomEvent('financialHealthEngineReady', {
                    detail: { version: '7.5.11', modular: true }
                }));
            }
        };
        
        script.onerror = (error) => {
            console.error(`❌ Failed to load module: ${modulePath}`, error);
            
            // Fallback: try to load from relative path
            const fallbackScript = document.createElement('script');
            fallbackScript.src = modulePath.replace('/src/', './');
            fallbackScript.async = false;
            
            fallbackScript.onload = script.onload;
            fallbackScript.onerror = () => {
                console.error(`❌ Fallback also failed for: ${modulePath}`);
            };
            
            document.head.appendChild(fallbackScript);
        };
        
        // Add script to document
        document.head.appendChild(script);
    });
    
    // Ensure backward compatibility functions exist
    function ensureBackwardCompatibility() {
        // Map old field mapping dictionary if available
        if (!window.fieldMappingDictionary && window.fieldMappingBridge) {
            window.fieldMappingDictionary = window.fieldMappingBridge.fieldMappingDictionary;
        }
        
        // Ensure all legacy exports are available
        const requiredExports = [
            'calculateFinancialHealthScore',
            'SCORE_FACTORS',
            'generateImprovementSuggestions',
            'getPeerComparison',
            'validateFinancialInputs',
            'calculateSavingsRateScore',
            'calculateRetirementReadinessScore',
            'calculateTimeHorizonScore',
            'calculateRiskAlignmentScore',
            'calculateDiversificationScore',
            'calculateTaxEfficiencyScore',
            'calculateEmergencyFundScore',
            'calculateDebtManagementScore',
            'getFieldValue'
        ];
        
        requiredExports.forEach(exportName => {
            if (!window[exportName]) {
                console.warn(`Missing export: ${exportName} - creating placeholder`);
                
                // Create placeholder function
                window[exportName] = function() {
                    console.error(`${exportName} called before Financial Health Engine loaded`);
                    return exportName.includes('calculate') ? 0 : null;
                };
            }
        });
        
        // Log final status
        console.log('✅ Backward compatibility ensured');
    }
    
    // Create temporary placeholder functions
    const createPlaceholder = (name) => {
        return function(...args) {
            console.warn(`${name} called before modules loaded - queueing`);
            
            // Queue the call to be executed when ready
            if (!window.financialHealthCallQueue) {
                window.financialHealthCallQueue = [];
            }
            
            return new Promise((resolve) => {
                window.financialHealthCallQueue.push({
                    functionName: name,
                    args,
                    resolve
                });
                
                // Check if modules loaded while we were queueing
                if (window.financialHealthModulesLoaded === true) {
                    processCallQueue();
                }
            });
        };
    };
    
    // Process queued calls
    const processCallQueue = () => {
        if (!window.financialHealthCallQueue) return;
        
        while (window.financialHealthCallQueue.length > 0) {
            const { functionName, args, resolve } = window.financialHealthCallQueue.shift();
            
            if (window[functionName]) {
                try {
                    const result = window[functionName](...args);
                    resolve(result);
                } catch (error) {
                    console.error(`Error calling ${functionName}:`, error);
                    resolve(null);
                }
            } else {
                console.error(`Function ${functionName} not found after module load`);
                resolve(null);
            }
        }
    };
    
    // Listen for engine ready event to process queue
    window.addEventListener('financialHealthEngineReady', processCallQueue);
    
    // Create placeholder functions for immediate use
    if (!window.calculateFinancialHealthScore) {
        window.calculateFinancialHealthScore = createPlaceholder('calculateFinancialHealthScore');
    }
    
    // Export placeholder for field mapping dictionary
    if (!window.fieldMappingDictionary) {
        window.fieldMappingDictionary = null; // Will be loaded by modules
    }
    
})();

console.log('📊 Financial Health Engine compatibility layer initialized');