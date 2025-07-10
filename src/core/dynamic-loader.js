// Dynamic Module Loader for Advanced Retirement Planner
// System for dynamic loading of advanced feature modules

class DynamicModuleLoader {
    constructor() {
        this.loadedModules = new Map();
        this.loadingPromises = new Map();
        this.cache = new Map();
    }

    // Load module with caching and error handling
    async loadModule(moduleName, modulePath) {
        // If module already loaded, return from cache
        if (this.loadedModules.has(moduleName)) {
            return this.loadedModules.get(moduleName);
        }

        // If module is currently loading, wait for existing load
        if (this.loadingPromises.has(moduleName)) {
            return this.loadingPromises.get(moduleName);
        }

        // Start new loading process
        const loadingPromise = this.loadModuleInternal(moduleName, modulePath);
        this.loadingPromises.set(moduleName, loadingPromise);

        try {
            const module = await loadingPromise;
            this.loadedModules.set(moduleName, module);
            this.loadingPromises.delete(moduleName);
            return module;
        } catch (error) {
            this.loadingPromises.delete(moduleName);
            throw error;
        }
    }

    // Internal module loading implementation
    async loadModuleInternal(moduleName, modulePath) {
        try {
            console.log(`🔄 Loading module: ${moduleName} from ${modulePath}`);
            
            // Load script dynamically
            const script = document.createElement('script');
            script.src = `${modulePath}?v=${Date.now()}`;
            script.async = true;
            
            const loadPromise = new Promise((resolve, reject) => {
                script.onload = () => {
                    console.log(`✅ Module loaded: ${moduleName}`);
                    // Check that module was loaded to global window
                    if (window[moduleName]) {
                        resolve(window[moduleName]);
                    } else {
                        reject(new Error(`Module ${moduleName} not found on window object`));
                    }
                };
                
                script.onerror = () => {
                    reject(new Error(`Failed to load module: ${moduleName}`));
                };
            });

            document.head.appendChild(script);
            return await loadPromise;

        } catch (error) {
            console.error(`❌ Error loading module ${moduleName}:`, error);
            throw error;
        }
    }

    // Load advanced tab modules
    async loadAdvancedTab() {
        return this.loadModule('AdvancedPortfolio', './src/modules/advanced-portfolio.js');
    }

    async loadAnalysisTab() {
        return this.loadModule('AnalysisEngine', './src/modules/analysis-engine.js');
    }

    async loadScenariosTab() {
        return this.loadModule('ScenariosStress', './src/modules/scenarios-stress.js');
    }

    async loadFireTab() {
        return this.loadModule('FireCalculator', './src/modules/fire-calculator.js');
    }

    async loadStressTestTab() {
        return this.loadModule('StressTestEngine', './src/modules/stress-test.js');
    }

    // Load utility modules
    async loadAPIIntegrations() {
        return this.loadModule('APIIntegrations', './src/modules/api-integrations.js');
    }

    async loadExportFeatures() {
        return this.loadModule('ExportFeatures', './src/modules/export-features.js');
    }

    async loadAdvancedCalculations() {
        return this.loadModule('AdvancedCalculations', './src/modules/advanced-calculations.js');
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
        console.log('🧹 Module cache cleared');
    }

    // Check status of loaded modules
    getLoadedModules() {
        return Array.from(this.loadedModules.keys());
    }

    // Preload critical modules
    async preloadCriticalModules() {
        try {
            // Load modules that users are likely to need soon
            await Promise.all([
                this.loadAdvancedTab(),
                this.loadAnalysisTab()
            ]);
            console.log('✅ Critical modules preloaded');
        } catch (error) {
            console.warn('⚠️ Preloading failed, will load on demand:', error);
        }
    }
}

// Create global instance
window.moduleLoader = new DynamicModuleLoader();

// Add global loading indicator
window.showModuleLoading = function(moduleName) {
    const indicator = document.createElement('div');
    indicator.id = 'module-loading-indicator';
    indicator.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                    background: rgba(0,0,0,0.8); color: white; padding: 20px; 
                    border-radius: 10px; z-index: 9999; text-align: center;">
            <div style="animation: spin 1s linear infinite; width: 20px; height: 20px; 
                        border: 2px solid white; border-top: 2px solid transparent; 
                        border-radius: 50%; margin: 0 auto 10px;"></div>
            <div>Loading ${moduleName}...</div>
        </div>
        <style>
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        </style>
    `;
    document.body.appendChild(indicator);
};

window.hideModuleLoading = function() {
    const indicator = document.getElementById('module-loading-indicator');
    if (indicator) {
        indicator.remove();
    }
};

// Export to global window
window.DynamicModuleLoader = DynamicModuleLoader;

console.log('🚀 Dynamic Module Loader initialized');