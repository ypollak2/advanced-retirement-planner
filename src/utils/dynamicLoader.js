// Dynamic Component Loader for Code Splitting
// Created by Yali Pollak (יהלי פולק) - v8.0.0

// Cache for loaded components
const componentCache = new Map();
const loadingPromises = new Map();

// Component paths for lazy loading
const COMPONENT_PATHS = {
    // Wizard Steps (loaded on demand)
    'WizardStep': '/src/components/wizard/WizardStep.js',
    'WizardStepPersonal': '/src/components/wizard/steps/WizardStepPersonal.js',
    'WizardStepSalary': '/src/components/wizard/steps/WizardStepSalary.js',
    'WizardStepSavings': '/src/components/wizard/steps/WizardStepSavings.js',
    'WizardStepContributions': '/src/components/wizard/steps/WizardStepContributions.js',
    'WizardStepFees': '/src/components/wizard/steps/WizardStepFees.js',
    'WizardStepRiskProfile': '/src/components/wizard/steps/WizardStepRiskProfile.js',
    'WizardStepInheritance': '/src/components/wizard/steps/WizardStepInheritance.js',
    'WizardStepInvestments': '/src/components/wizard/steps/WizardStepInvestments.js',
    'WizardStepGoals': '/src/components/wizard/steps/WizardStepGoals.js',
    'WizardStepReview': '/src/components/wizard/steps/WizardStepReview.js',
    'WizardStepExpenses': '/src/components/wizard/steps/WizardStepExpenses.js',
    'WizardStepTaxes': '/src/components/wizard/steps/WizardStepTaxes.js',
    
    // Dashboard Components (loaded on demand)
    'SummaryPanel': '/src/components/SummaryPanel.js',
    'SavingsSummaryPanel': '/src/components/SavingsSummaryPanel.js',
    'PermanentSidePanel': '/src/components/PermanentSidePanel.js',
    'DynamicPartnerCharts': '/src/components/DynamicPartnerCharts.js',
    'ExportControls': '/src/components/ExportControls.js',
    'StressTestInterface': '/src/components/StressTestInterface.js',
    'ClaudeRecommendations': '/src/components/ClaudeRecommendations.js',
    'InflationAnalysis': '/src/components/InflationAnalysis.js',
    'RetirementAdvancedForm': '/src/components/RetirementAdvancedForm.js',
    'RetirementResultsPanel': '/src/components/RetirementResultsPanel.js',
    
    // Advanced Modules (loaded on demand)
    'AdvancedPortfolio': '/src/modules/advanced-portfolio.js',
    'ScenariosStress': '/src/modules/scenarios-stress.js',
    'MarketAnalytics': '/src/modules/market-analytics.js',
    
    // Utilities (loaded on demand)
    'StockPriceAPI': '/src/utils/stockPriceAPI.js',
    'CurrencyAPI': '/src/utils/currencyAPI.js',
    'AnalyticsTracker': '/src/utils/analyticsTracker.js'
};

// Loading states
const LoadingStates = {
    IDLE: 'idle',
    LOADING: 'loading',
    LOADED: 'loaded',
    ERROR: 'error'
};

class ComponentLoader {
    constructor() {
        this.loadingStates = new Map();
        this.errorRetryCount = new Map();
        this.maxRetries = 3;
    }

    // Get loading state for a component
    getLoadingState(componentName) {
        return this.loadingStates.get(componentName) || LoadingStates.IDLE;
    }

    // Load component dynamically with caching
    async loadComponent(componentName, priority = 'normal') {
        // Return cached component if available
        if (componentCache.has(componentName)) {
            return componentCache.get(componentName);
        }

        // Return existing loading promise if component is being loaded
        if (loadingPromises.has(componentName)) {
            return loadingPromises.get(componentName);
        }

        const componentPath = COMPONENT_PATHS[componentName];
        if (!componentPath) {
            throw new Error(`Unknown component: ${componentName}`);
        }

        // Set loading state
        this.loadingStates.set(componentName, LoadingStates.LOADING);

        // Create loading promise
        const loadingPromise = this._loadComponentScript(componentPath, componentName, priority);
        loadingPromises.set(componentName, loadingPromise);

        try {
            const component = await loadingPromise;
            
            // Cache the loaded component
            componentCache.set(componentName, component);
            this.loadingStates.set(componentName, LoadingStates.LOADED);
            
            // Clean up loading promise
            loadingPromises.delete(componentName);
            
            console.log(`✅ Component loaded: ${componentName}`);
            return component;
        } catch (error) {
            this.loadingStates.set(componentName, LoadingStates.ERROR);
            loadingPromises.delete(componentName);
            
            // Retry logic
            const retryCount = this.errorRetryCount.get(componentName) || 0;
            if (retryCount < this.maxRetries) {
                this.errorRetryCount.set(componentName, retryCount + 1);
                console.warn(`⚠️ Retrying component load: ${componentName} (attempt ${retryCount + 1})`);
                return this.loadComponent(componentName, priority);
            }
            
            console.error(`❌ Failed to load component: ${componentName}`, error);
            throw error;
        }
    }

    // Load component script with priority hints
    async _loadComponentScript(path, componentName, priority) {
        return new Promise((resolve, reject) => {
            // Check if component is already available
            if (window[componentName]) {
                resolve(window[componentName]);
                return;
            }

            const script = document.createElement('script');
            script.src = path;
            script.async = true;
            
            // Add priority hints for better loading performance
            if (priority === 'high') {
                script.setAttribute('fetchpriority', 'high');
            } else if (priority === 'low') {
                script.setAttribute('fetchpriority', 'low');
            }

            script.onload = () => {
                if (window[componentName]) {
                    resolve(window[componentName]);
                } else {
                    reject(new Error(`Component ${componentName} not found after script load`));
                }
            };

            script.onerror = () => {
                reject(new Error(`Failed to load script: ${path}`));
            };

            // Add timeout for loading
            const timeout = setTimeout(() => {
                reject(new Error(`Timeout loading component: ${componentName}`));
            }, 10000); // 10 second timeout

            script.onload = () => {
                clearTimeout(timeout);
                if (window[componentName]) {
                    resolve(window[componentName]);
                } else {
                    reject(new Error(`Component ${componentName} not found after script load`));
                }
            };

            document.head.appendChild(script);
        });
    }

    // Preload components for better UX
    async preloadComponents(componentNames, priority = 'low') {
        const preloadPromises = componentNames.map(name => 
            this.loadComponent(name, priority).catch(error => {
                console.warn(`Preload failed for ${name}:`, error.message);
                return null;
            })
        );

        const results = await Promise.allSettled(preloadPromises);
        const loaded = results.filter(result => result.status === 'fulfilled' && result.value).length;
        
        console.log(`📦 Preloaded ${loaded}/${componentNames.length} components`);
        return results;
    }

    // Load components in batches to avoid overwhelming the browser
    async loadComponentBatch(componentNames, batchSize = 3, delay = 100) {
        const results = [];
        
        for (let i = 0; i < componentNames.length; i += batchSize) {
            const batch = componentNames.slice(i, i + batchSize);
            const batchPromises = batch.map(name => this.loadComponent(name));
            
            try {
                const batchResults = await Promise.allSettled(batchPromises);
                results.push(...batchResults);
                
                // Small delay between batches to prevent blocking
                if (i + batchSize < componentNames.length) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            } catch (error) {
                console.error('Batch loading error:', error);
            }
        }
        
        return results;
    }

    // Get cache statistics
    getCacheStats() {
        return {
            cached: componentCache.size,
            loading: loadingPromises.size,
            states: Object.fromEntries(this.loadingStates),
            totalComponents: Object.keys(COMPONENT_PATHS).length
        };
    }

    // Clear cache (useful for development)
    clearCache() {
        componentCache.clear();
        loadingPromises.clear();
        this.loadingStates.clear();
        this.errorRetryCount.clear();
        console.log('🗑️ Component cache cleared');
    }
}

// Create global instance
const componentLoader = new ComponentLoader();

// Preload strategy based on user behavior
function initializePreloadStrategy() {
    // Preload critical components after initial page load
    setTimeout(() => {
        const criticalComponents = ['SavingsSummaryPanel', 'PermanentSidePanel'];
        componentLoader.preloadComponents(criticalComponents, 'high');
    }, 2000);

    // Preload wizard components when user shows intent to use wizard
    document.addEventListener('mouseover', (event) => {
        if (event.target.closest('[data-wizard-trigger]')) {
            const wizardComponents = [
                'WizardStepSalary', 'WizardStepSavings', 
                'WizardStepContributions', 'WizardStepFees'
            ];
            componentLoader.preloadComponents(wizardComponents, 'normal');
        }
    }, { once: true });

    // Preload advanced features on demand
    document.addEventListener('click', (event) => {
        if (event.target.closest('[data-advanced-features]')) {
            const advancedComponents = ['AdvancedPortfolio', 'ScenariosStress'];
            componentLoader.preloadComponents(advancedComponents, 'normal');
        }
    }, { once: true });
}

// Initialize preload strategy when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePreloadStrategy);
} else {
    initializePreloadStrategy();
}

// Export for global use
window.ComponentLoader = componentLoader;

// Helper function for React components
window.loadComponent = (componentName, priority) => 
    componentLoader.loadComponent(componentName, priority);

// Export component paths for external use
window.COMPONENT_PATHS = COMPONENT_PATHS;

console.log('📦 Dynamic Component Loader initialized');