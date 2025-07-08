// Enhanced Yahoo Finance API Implementation with CORS Fix
// Replace the existing fetchIndexData function with this improved version

// Load the CORS proxy solution
const loadCORSProxySolution = () => {
    return new Promise((resolve, reject) => {
        if (window.MultiSourceFinanceAPI) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = './cors-proxy-solution.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
};

// Enhanced fetchIndexData function with CORS proxy support
const fetchIndexDataWithCORSFix = async () => {
    try {
        console.log('🚀 Starting enhanced index data fetch with CORS fix...');
        
        // Load CORS solution if not already loaded
        await loadCORSProxySolution();
        
        // Initialize the multi-source API
        const financeAPI = new window.MultiSourceFinanceAPI();
        
        // Define all symbols we need
        const symbols = [
            'TA35.TA',     // Tel Aviv 35
            'TA125.TA',    // Tel Aviv 125
            '^GSPC',       // S&P 500
            '^IXIC',       // NASDAQ
            'URTH',        // MSCI World
            '^STOXX50E',   // Euro Stoxx 50
            '^FTSE',       // FTSE 100
            '^N225',       // Nikkei 225
            'IEF',         // Government Bonds
            'LQD'          // Corporate Bonds
        ];

        // Fetch data using the multi-source API
        console.log('📊 Fetching data for symbols:', symbols);
        const indexData = await financeAPI.getIndexData(symbols);
        
        // Process and format the data for the retirement planner
        const formattedData = {};
        
        for (const [symbol, data] of Object.entries(indexData)) {
            formattedData[symbol] = {
                name: getIndexName(symbol),
                return1Year: Math.round(data.returnRate * 100 * 100) / 100, // Convert to percentage with 2 decimals
                return2Year: Math.round(data.returnRate * 0.95 * 100 * 100) / 100, // Slightly lower for longer periods
                return3Year: Math.round(data.returnRate * 0.90 * 100 * 100) / 100,
                return5Year: Math.round(data.returnRate * 0.85 * 100 * 100) / 100,
                volatility: Math.round(data.risk * 100 * 100) / 100,
                currentPrice: data.currentPrice,
                currency: data.currency,
                lastUpdated: data.lastUpdated,
                confidence: data.confidence,
                source: data.source
            };
        }

        console.log('✅ Successfully processed index data:', formattedData);
        
        // Update global variables
        window.indexReturns = formattedData;
        window.lastIndexUpdate = new Date().toISOString();
        
        // Show success message
        showIndexUpdateStatus(true, Object.keys(formattedData).length);
        
        return formattedData;
        
    } catch (error) {
        console.error('❌ Failed to fetch index data:', error);
        
        // Show error message
        showIndexUpdateStatus(false, 0, error.message);
        
        // Return fallback data
        return getFallbackIndexData();
    }
};

// Helper function to get readable index names
const getIndexName = (symbol) => {
    const names = {
        'TA35.TA': 'ת"א 35',
        'TA125.TA': 'ת"א 125',
        '^GSPC': 'S&P 500',
        '^IXIC': 'NASDAQ',
        'URTH': 'MSCI World',
        '^STOXX50E': 'יורו סטוקס 50',
        '^FTSE': 'FTSE 100',
        '^N225': 'ניקיי 225',
        'IEF': 'אג״ח ממשלתיות',
        'LQD': 'אג״ח קונצרניות'
    };
    return names[symbol] || symbol;
};

// Show status message to user
const showIndexUpdateStatus = (success, count, errorMessage = '') => {
    const statusElement = document.getElementById('index-status') || createStatusElement();
    
    if (success) {
        statusElement.innerHTML = `
            <div class="flex items-center text-green-600 text-sm">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                נתונים עדכניים נטענו (${count} מדדים) • ${new Date().toLocaleTimeString('he-IL')}
            </div>
        `;
        statusElement.className = 'mb-4 p-2 bg-green-50 border border-green-200 rounded';
    } else {
        statusElement.innerHTML = `
            <div class="flex items-center text-amber-600 text-sm">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                משתמש בנתונים היסטוריים (${errorMessage || 'בעיית רשת'})
            </div>
        `;
        statusElement.className = 'mb-4 p-2 bg-amber-50 border border-amber-200 rounded';
    }
};

// Create status element if it doesn't exist
const createStatusElement = () => {
    const element = document.createElement('div');
    element.id = 'index-status';
    
    // Insert at the top of the main content area
    const mainContent = document.querySelector('.max-w-4xl') || document.body;
    mainContent.insertBefore(element, mainContent.firstChild);
    
    return element;
};

// Fallback data if all APIs fail
const getFallbackIndexData = () => {
    console.log('🔄 Using fallback index data');
    
    return {
        'TA35.TA': {
            name: 'ת"א 35',
            return1Year: 8.5,
            return2Year: 8.0,
            return3Year: 7.5,
            return5Year: 7.0,
            volatility: 18.0,
            source: 'fallback'
        },
        'TA125.TA': {
            name: 'ת"א 125',
            return1Year: 7.8,
            return2Year: 7.3,
            return3Year: 6.8,
            return5Year: 6.3,
            volatility: 16.5,
            source: 'fallback'
        },
        '^GSPC': {
            name: 'S&P 500',
            return1Year: 10.2,
            return2Year: 9.8,
            return3Year: 9.3,
            return5Year: 8.8,
            volatility: 15.2,
            source: 'fallback'
        },
        '^IXIC': {
            name: 'NASDAQ',
            return1Year: 11.5,
            return2Year: 11.0,
            return3Year: 10.5,
            return5Year: 10.0,
            volatility: 20.8,
            source: 'fallback'
        },
        'URTH': {
            name: 'MSCI World',
            return1Year: 8.8,
            return2Year: 8.3,
            return3Year: 7.8,
            return5Year: 7.3,
            volatility: 14.5,
            source: 'fallback'
        },
        '^STOXX50E': {
            name: 'יורו סטוקס 50',
            return1Year: 7.2,
            return2Year: 6.8,
            return3Year: 6.3,
            return5Year: 5.8,
            volatility: 16.8,
            source: 'fallback'
        },
        '^FTSE': {
            name: 'FTSE 100',
            return1Year: 6.5,
            return2Year: 6.0,
            return3Year: 5.5,
            return5Year: 5.0,
            volatility: 14.8,
            source: 'fallback'
        },
        '^N225': {
            name: 'ניקיי 225',
            return1Year: 5.8,
            return2Year: 5.3,
            return3Year: 4.8,
            return5Year: 4.3,
            volatility: 18.5,
            source: 'fallback'
        },
        'IEF': {
            name: 'אג״ח ממשלתיות',
            return1Year: 2.5,
            return2Year: 2.3,
            return3Year: 2.0,
            return5Year: 1.8,
            volatility: 5.2,
            source: 'fallback'
        },
        'LQD': {
            name: 'אג״ח קונצרניות',
            return1Year: 3.8,
            return2Year: 3.5,
            return3Year: 3.2,
            return5Year: 2.9,
            volatility: 8.5,
            source: 'fallback'
        }
    };
};

// Enhanced initialization function
const initializeFinanceDataWithCORSFix = async () => {
    console.log('🔧 Initializing finance data with CORS fix...');
    
    try {
        // Load the enhanced fetch function
        await loadCORSProxySolution();
        
        // Replace the global fetchIndexData function
        window.fetchIndexData = fetchIndexDataWithCORSFix;
        
        // Fetch initial data
        await fetchIndexDataWithCORSFix();
        
        console.log('✅ Finance data initialization complete');
        
    } catch (error) {
        console.error('❌ Failed to initialize finance data:', error);
        
        // Set fallback data
        window.indexReturns = getFallbackIndexData();
    }
};

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFinanceDataWithCORSFix);
} else {
    initializeFinanceDataWithCORSFix();
}

// Export for manual usage
window.initializeFinanceDataWithCORSFix = initializeFinanceDataWithCORSFix;
window.fetchIndexDataWithCORSFix = fetchIndexDataWithCORSFix;