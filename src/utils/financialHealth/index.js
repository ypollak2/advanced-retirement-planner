// Financial Health Engine Index
// Loads all modules in the correct order and provides unified interface

// This file serves as the main entry point for the financial health engine
// It ensures all dependencies are loaded in the correct order

// Module loading order is critical:
// 1. Safe calculations (no dependencies)
// 2. Constants (no dependencies)
// 3. Field mapper (depends on safe calculations)
// 4. Scoring calculators (depends on all above)
// 5. Additional calculators (depends on all above)
// 6. Main engine (depends on all above)

// Check if modules are already loaded
if (!window.financialHealthModulesLoaded) {
    console.log('📊 Loading Financial Health Engine modules...');
    
    // Mark that we're loading to prevent duplicate loads
    window.financialHealthModulesLoaded = 'loading';
    
    // Module load status tracking
    const moduleStatus = {
        safeCalculations: false,
        constants: false,
        fieldMapper: false,
        scoringCalculators: false,
        additionalCalculators: false,
        engine: false
    };
    
    // Check if all modules are loaded
    const checkAllModulesLoaded = () => {
        const allLoaded = Object.values(moduleStatus).every(status => status === true);
        if (allLoaded) {
            window.financialHealthModulesLoaded = true;
            console.log('✅ All Financial Health Engine modules loaded successfully');
            
            // Dispatch event to notify other components
            window.dispatchEvent(new CustomEvent('financialHealthEngineReady', {
                detail: { version: '7.5.11' }
            }));
        }
    };
    
    // Module load callbacks
    window.financialHealthModuleLoaded = (moduleName) => {
        moduleStatus[moduleName] = true;
        console.log(`✓ Loaded: ${moduleName}`);
        checkAllModulesLoaded();
    };
    
    // Export unified interface
    window.FinancialHealthEngine = {
        // Main calculation function
        calculate: (inputs) => {
            if (window.financialHealthModulesLoaded !== true) {
                console.warn('Financial Health Engine not fully loaded yet');
                return null;
            }
            return window.calculateFinancialHealthScore(inputs);
        },
        
        // Individual calculators
        calculators: {
            savingsRate: (inputs) => window.calculateSavingsRateScore?.(inputs),
            retirementReadiness: (inputs) => window.calculateRetirementReadinessScore?.(inputs),
            timeHorizon: (inputs) => window.calculateTimeHorizonScore?.(inputs),
            riskAlignment: (inputs) => window.calculateRiskAlignmentScore?.(inputs),
            diversification: (inputs) => window.calculateDiversificationScore?.(inputs),
            taxEfficiency: (inputs) => window.calculateTaxEfficiencyScore?.(inputs),
            emergencyFund: (inputs) => window.calculateEmergencyFundScore?.(inputs),
            debtManagement: (inputs) => window.calculateDebtManagementScore?.(inputs)
        },
        
        // Utilities
        utils: {
            validateInputs: (inputs) => window.validateFinancialInputs?.(inputs),
            getPeerComparison: (inputs, score) => window.getPeerComparison?.(inputs, score),
            generateSuggestions: (breakdown) => window.generateImprovementSuggestions?.(breakdown),
            getFieldValue: (inputs, fields, options) => window.getFieldValue?.(inputs, fields, options)
        },
        
        // Constants
        constants: {
            SCORE_FACTORS: () => window.SCORE_FACTORS,
            PEER_BENCHMARKS: () => window.PEER_BENCHMARKS,
            COUNTRY_FACTORS: () => window.COUNTRY_FACTORS
        },
        
        // Check if ready
        isReady: () => window.financialHealthModulesLoaded === true,
        
        // Version info
        version: '7.5.11',
        modules: moduleStatus
    };
    
    // For backward compatibility, ensure the old function names work
    const ensureBackwardCompatibility = () => {
        // These will be overwritten by the actual modules when they load
        // But provide a temporary function that waits for module load
        const createWaitingFunction = (functionName) => {
            return (...args) => {
                if (window.financialHealthModulesLoaded === true && window[functionName]) {
                    return window[functionName](...args);
                }
                console.warn(`Waiting for Financial Health Engine to load: ${functionName}`);
                return null;
            };
        };
        
        // Only create if not already exists
        if (!window.calculateFinancialHealthScore) {
            window.calculateFinancialHealthScore = createWaitingFunction('calculateFinancialHealthScore');
        }
    };
    
    ensureBackwardCompatibility();
    
} else if (window.financialHealthModulesLoaded === true) {
    console.log('✓ Financial Health Engine already loaded');
}

// Export a function to manually trigger module loading if needed
window.loadFinancialHealthModules = () => {
    const baseUrl = '/src/utils/financialHealth/';
    const modules = [
        'safeCalculations.js',
        'constants.js', 
        'fieldMapper.js',
        'scoringCalculators.js',
        'additionalCalculators.js',
        'engine.js'
    ];
    
    // Load modules sequentially
    const loadNextModule = (index) => {
        if (index >= modules.length) return;
        
        const script = document.createElement('script');
        script.src = baseUrl + modules[index];
        script.onload = () => loadNextModule(index + 1);
        script.onerror = (e) => {
            console.error(`Failed to load module: ${modules[index]}`, e);
        };
        document.head.appendChild(script);
    };
    
    loadNextModule(0);
};

console.log('📊 Financial Health Engine index loaded - awaiting module loads');