// Version information for the Advanced Retirement Planner
const version = {
    number: "6.2.0",
    build: "2025-07-20",
    commit: "v6.2.0-performance-revolution",
    description: "Major Performance & Optimization Revolution with advanced caching, service worker, and code splitting"
};

// Export version for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = version;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.versionInfo = version;
}