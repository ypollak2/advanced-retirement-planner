// Dashboard.js - Compatibility Layer
// This file maintains backward compatibility while loading the new modular structure
// Supports partner field mapping and couple mode integration

console.log('📊 Loading Dashboard (modular structure)...');

// Load the modular components in order
(function() {
    // Check if already loaded
    if (window.DashboardModulesLoaded === true) {
        console.log('✓ Dashboard already loaded');
        return;
    }
    
    // Mark as loading
    window.DashboardModulesLoaded = 'loading';
    
    // Define the module loading sequence
    const modules = [
        'src/components/core/dashboard/content.js',
        'src/components/core/dashboard/healthScore.js',
        'src/components/core/dashboard/sections.js',
        'src/components/core/dashboard/additionalSections.js',
        'src/components/core/dashboard/DashboardCore.js'
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
                window.DashboardModulesLoaded = true;
                console.log('✅ Dashboard fully loaded (all modules)');
                
                // Dispatch ready event
                window.dispatchEvent(new CustomEvent('dashboardReady', {
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
    if (!window.Dashboard) {
        const Dashboard = function(props) {
            if (window.DashboardModulesLoaded === true && window.Dashboard !== Dashboard) {
                // Call the real function
                return window.Dashboard(props);
            } else {
                console.warn('Dashboard still loading...');
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
                    }, 'Loading dashboard...')
                ]);
            }
        };
        
        // Export to window
        window.Dashboard = Dashboard;
    }
})();

console.log('📊 Dashboard compatibility layer initialized');