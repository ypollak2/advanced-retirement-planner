// Version information for the Advanced Retirement Planner
const version = {
    number: "5.3.4",
    build: "2025-07-18",
    commit: "v5.3.4-comprehensive-currency-integration-fixes",
    description: "Comprehensive currency integration fixes: resolved all hardcoded currency symbols in charts, graphs, summary panels, and stress test scenarios"
};

// Export version for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = version;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.versionInfo = version;
}