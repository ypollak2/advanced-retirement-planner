// Version information for the Advanced Retirement Planner
const version = {
    number: "6.2.0",
    build: "2025-07-20",
    commit: "v6.2.0-dashboard-fixes-chart-analysis",
    description: "Dashboard improvements with conditional display, removed confusing indicators, and comprehensive chart analysis for partner data clarity"
};

// Export version for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = version;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.versionInfo = version;
}