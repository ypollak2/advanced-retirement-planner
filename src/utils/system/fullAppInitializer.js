// Complete Application Initializer for Advanced Retirement Planner
// Handles proper React app initialization after all scripts are loaded
// Created by Yali Pollak (יהלי פולק) - v7.0.2

(function() {
    'use strict';
    
    // Track initialization state to prevent double initialization
    let isInitialized = false;
    let reactRoot = null;
    
    // Enhanced error handling and component validation
    function validateComponents() {
        // Only check for truly essential components that are needed at startup
        const essentialComponents = [
            'RetirementPlannerApp', 
            'calculateRetirement', 
            'formatCurrency'
        ];
        
        // Optional components that can be lazy-loaded
        const optionalComponents = [
            'Dashboard', 'CurrencySelector', 'BasicInputs', 'AdvancedInputs', 'ResultsPanel',
            'ReadinessScore', 'HelpTooltip', 'currencyAPI',
            'ScenarioComparison', 'ScenarioEditor', 'ScenarioChart', 'GoalTrackingDashboard', 
            'CoupleValidationPanel', 'CoupleValidation', 'PortfolioOptimizer', 'PortfolioOptimizationPanel'
        ];
        
        const missingEssential = essentialComponents.filter(comp => !window[comp]);
        const missingOptional = optionalComponents.filter(comp => !window[comp]);
        
        if (missingEssential.length > 0) {
            console.error('❌ Missing ESSENTIAL components:', missingEssential);
            return false;
        }
        
        if (missingOptional.length > 0) {
            console.warn('⚠️ Missing optional components (will load later):', missingOptional);
        }
        
        return true;
    }

    // Enhanced component loading with retry logic
    function attemptInitialization(attempt = 1, maxAttempts = 10) {
        try {
            // Prevent double initialization
            if (isInitialized) {
                console.log('ℹ️ App already initialized, skipping...');
                return;
            }
            
            if (window.RetirementPlannerApp && validateComponents()) {
                const rootElement = document.getElementById('root');
                
                if (!rootElement) {
                    throw new Error('Root element not found');
                }
                
                if (ReactDOM.createRoot) {
                    // React 18+ mode
                    if (!reactRoot) {
                        reactRoot = ReactDOM.createRoot(rootElement);
                    }
                    reactRoot.render(React.createElement(window.RetirementPlannerApp));
                    isInitialized = true;
                    console.log(`✅ Advanced Retirement Planner v${window.APP_VERSION || '7.0.0'} initialized successfully`);
                } else if (ReactDOM.render) {
                    // React 17 mode
                    ReactDOM.render(
                        React.createElement(window.RetirementPlannerApp),
                        rootElement
                    );
                    isInitialized = true;
                    console.log(`✅ Advanced Retirement Planner v${window.APP_VERSION || '7.0.0'} initialized (React 17 mode)`);
                }
            } else {
                if (attempt < maxAttempts) {
                    console.log(`⏳ Waiting for components to load... (attempt ${attempt}/${maxAttempts})`);
                    // Progressive delay: 100ms, 200ms, 400ms, 800ms, etc.
                    const delay = Math.min(100 * Math.pow(1.5, attempt - 1), 2000);
                    setTimeout(() => attemptInitialization(attempt + 1, maxAttempts), delay);
                } else {
                    throw new Error('Required components failed to load after multiple attempts');
                }
            }
        } catch (error) {
            if (attempt < maxAttempts) {
                console.warn(`⚠️ Initialization attempt ${attempt} failed, retrying...`, error.message);
                const delay = Math.min(200 * attempt, 2000);
                setTimeout(() => attemptInitialization(attempt + 1, maxAttempts), delay);
            } else {
                throw error;
            }
        }
    }

    // Error UI for failed initialization
    function showErrorUI(error) {
        document.getElementById('root').innerHTML = `
            <div style="text-align: center; padding: 50px; font-family: Arial;">
                <h2 style="color: #e53e3e;">Application Loading Error</h2>
                <p>The retirement planner could not initialize: ${error.message}</p>
                <p><small>Check browser console for details</small></p>
                <button onclick="location.reload()" style="padding: 10px 20px; background: #4299e1; color: white; border: none; border-radius: 5px; cursor: pointer;">Refresh Page</button>
            </div>
        `;
    }

    // Initialize on DOM ready
    function initializeOnDOMReady() {
        try {
            attemptInitialization();
        } catch (error) {
            console.error('❌ Application initialization error:', error);
            showErrorUI(error);
        }
    }

    // Initialize when scripts are loaded
    function initializeOnScriptsLoaded() {
        console.log('🚀 Scripts loaded event received, attempting initialization...');
        try {
            attemptInitialization();
        } catch (error) {
            console.error('❌ Application initialization error:', error);
            showErrorUI(error);
        }
    }

    // Set up event listeners
    document.addEventListener('DOMContentLoaded', initializeOnDOMReady);
    document.addEventListener('scriptsLoaded', initializeOnScriptsLoaded);

    // Export functions for debugging
    window.AppInitializer = {
        validateComponents,
        attemptInitialization,
        initializeOnDOMReady,
        initializeOnScriptsLoaded
    };

    console.log('📋 Full Application initialization system ready for RetirementPlannerApp');
})();