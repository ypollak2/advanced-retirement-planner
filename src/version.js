// Version information for the Advanced Retirement Planner
const version = {
    number: "7.0.5",
    build: "2025-07-29",
    commit: "v7.0.5-version-update",
    description: "Complete Missing Data Modal: Interactive data completion for Financial Health Score optimization"
};

// Export version for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = version;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.versionInfo = version;
}