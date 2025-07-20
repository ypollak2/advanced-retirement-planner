// Version information for the Advanced Retirement Planner
const version = {
    number: "6.0.0",
    build: "2025-07-20",
    commit: "v6.0.0-major-partner-planning-overhaul",
    description: "Major partner planning overhaul with comprehensive wizard interface, AI recommendations, inflation analysis, risk profiles, and inheritance planning"
};

// Export version for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = version;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.versionInfo = version;
}