// Version information for the Advanced Retirement Planner
const version = {
    number: "7.5.11",
    build: "2025-07-29",
    commit: "v7.5.11-version-update",
    description: "Enhanced RSU input with stock symbol selection and real-time price lookup"
};

// Export version for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = version;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.versionInfo = version;
}