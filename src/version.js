// Version information for the Advanced Retirement Planner
const version = {
    number: "7.0.1",
    build: "2025-07-25",
    commit: "v7.0.1-version-update",
    description: "Comprehensive expense tracking with category analysis and projections"
};

// Export version for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = version;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.versionInfo = version;
}