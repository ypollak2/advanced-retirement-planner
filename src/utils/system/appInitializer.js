// Application Initializer for Advanced Retirement Planner
// Handles proper initialization after all scripts are loaded
// Created by Yali Pollak (יהלי פולק) - v7.0.0

(function() {
    'use strict';
    
    // Enhanced error handling and component validation
    function validateComponents() {
        const requiredComponents = [
            'RetirementPlannerApp', 'Dashboard', 'CurrencySelector', 'BasicInputs', 'AdvancedInputs', 'ResultsPanel',
            'ReadinessScore', 'HelpTooltip', 'calculateRetirement', 'formatCurrency', 'currencyAPI',
            'ScenarioComparison', 'ScenarioEditor', 'ScenarioChart', 'GoalTrackingDashboard', 
            'CoupleValidationPanel', 'CoupleValidation', 'PortfolioOptimizer', 'PortfolioOptimizationPanel'
        ];
        
        const missing = requiredComponents.filter(comp => !window[comp]);
        if (missing.length > 0) {
            console.warn('⚠️ Missing components:', missing);
            return false;
        }
        return true;
    }
    
    // Initialize the complete RetirementPlannerApp after all components load
    function attemptInitialization(attempt = 1, maxAttempts = 10) {
        try {
            if (window.RetirementPlannerApp && validateComponents()) {
                if (ReactDOM.createRoot) {
                    const root = ReactDOM.createRoot(document.getElementById('root'));
                    root.render(React.createElement(window.RetirementPlannerApp));
                    console.log(`✅ Advanced Retirement Planner v${window.APP_VERSION || '7.0.0'} initialized successfully`);
                } else if (ReactDOM.render) {
                    ReactDOM.render(
                        React.createElement(window.RetirementPlannerApp),
                        document.getElementById('root')
                    );
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
    
    // Initialize application
    function initializeApp() {
        console.log('🚀 Initializing RetirementPlannerApp...');
        
        try {
            attemptInitialization();
        } catch (error) {
            console.error('❌ Application initialization error:', error);
            document.getElementById('root').innerHTML = `
                <div style="text-align: center; padding: 50px; font-family: Arial;">
                    <h2 style="color: #e53e3e;">Application Loading Error</h2>
                    <p>The retirement planner could not initialize: ${error.message}</p>
                    <p><small>Check browser console for details</small></p>
                    <button id="refresh-btn" style="padding: 10px 20px; background: #4299e1; color: white; border: none; border-radius: 5px; cursor: pointer;">Refresh Page</button>
                    <script>document.getElementById('refresh-btn').addEventListener('click', () => location.reload());</script>
                </div>
            `;
        }
    }
    
    // Set up event listeners for initialization
    document.addEventListener('DOMContentLoaded', function() {
        // Wait for all scripts to load before initializing  
        if (window.componentScriptsLoaded) {
            window.componentScriptsLoaded.then(initializeApp);
        } else {
            // Fallback if promises not available
            setTimeout(initializeApp, 2000);
        }
    });
    
    document.addEventListener('scriptsLoaded', function() {
        initializeApp();
    });
    
    // Export for global access
    window.AppInitializer = {
        initializeApp,
        validateComponents,
        attemptInitialization
    };
    
    console.log('✅ App initializer loaded');
})();