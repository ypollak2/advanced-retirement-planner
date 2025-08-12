// Retirement Planner App - Compatibility Layer
// This file maintains backward compatibility while loading the new modular structure

console.log('📊 Loading Retirement Planner App (modular structure)...');

// Load the modular components in order
(function() {
    // Check if already loaded
    if (window.RetirementPlannerModulesLoaded === true) {
        console.log('✓ Retirement Planner App already loaded');
        return;
    }
    
    // Mark as loading
    window.RetirementPlannerModulesLoaded = 'loading';
    
    // Define the module loading sequence
    const modules = [
        'src/components/core/app/initialState.js',
        'src/components/core/app/eventHandlers.js',
        'src/components/core/app/uiComponents.js',
        'src/components/core/app/RetirementPlannerAppCore.js'
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
                window.RetirementPlannerModulesLoaded = true;
                console.log('✅ Retirement Planner App fully loaded (all modules)');
                
                // Dispatch ready event
                window.dispatchEvent(new CustomEvent('retirementPlannerAppReady', {
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
    if (!window.RetirementPlannerApp) {
        window.RetirementPlannerApp = function() {
            if (window.RetirementPlannerModulesLoaded === true) {
                // Call the real function
                return window.RetirementPlannerApp.apply(this, arguments);
            } else {
                console.warn('Retirement Planner App still loading...');
                // Return a loading component
                return React.createElement('div', {
                    className: 'min-h-screen flex items-center justify-center bg-gray-100'
                }, React.createElement('div', {
                    className: 'text-center'
                }, [
                    React.createElement('div', {
                        key: 'spinner',
                        className: 'animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'
                    }),
                    React.createElement('p', {
                        key: 'message',
                        className: 'text-gray-600'
                    }, 'Loading Retirement Planner...')
                ]));
            }
        };
    }
})();

console.log('📊 Retirement Planner App compatibility layer initialized');