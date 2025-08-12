// retirementCalculations.js - Compatibility Layer
// This file maintains backward compatibility while loading the new modular structure

console.log('📊 Loading Retirement Calculations (modular structure)...');

// Load the modular components in order
(function() {
    // Check if already loaded
    if (window.RetirementCalculationsModulesLoaded === true) {
        console.log('✓ Retirement Calculations already loaded');
        return;
    }
    
    // Mark as loading
    window.RetirementCalculationsModulesLoaded = 'loading';
    
    // Define the module loading sequence
    const modules = [
        'src/utils/retirement/currencyHelpers.js',
        'src/utils/retirement/returnCalculators.js',
        'src/utils/retirement/progressiveCalculations.js',
        'src/utils/retirement/chartFormatting.js',
        'src/utils/retirement/incomeCalculations.js',
        'src/utils/retirement/coreCalculations.js',
        'src/utils/retirement/chartData.js'
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
                window.RetirementCalculationsModulesLoaded = true;
                console.log('✅ Retirement Calculations fully loaded (all modules)');
                
                // Dispatch ready event
                window.dispatchEvent(new CustomEvent('retirementCalculationsReady', {
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
    
    // Create placeholder functions if needed to prevent errors
    const placeholderFunctions = [
        'formatCurrency',
        'convertCurrency',
        'getNetReturn',
        'calculateWeightedReturn',
        'calculateRetirement',
        'generateRetirementChartData',
        'calculateProgressiveSavings',
        'generateUnifiedPartnerProjections',
        'getUnifiedPartnerData',
        'standardChartFormatting',
        'validatePartnerData',
        'calculatePartnerData',
        'formatNumber',
        'calculateInvestmentReturns',
        'generateChartData',
        'calculateProgressive',
        'calculateNominal'
    ];
    
    placeholderFunctions.forEach(funcName => {
        if (!window[funcName]) {
            window[funcName] = function() {
                console.warn(`${funcName} called before modules loaded`);
                return funcName.includes('calculate') ? {} : null;
            };
        }
    });
})();

console.log('📊 Retirement Calculations compatibility layer initialized');