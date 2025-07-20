// Version information for the Advanced Retirement Planner
const version = {
    number: "6.3.0",
    build: "2025-07-20",
    commit: "v6.3.0-wizard-enhancements",
    description: "Complete wizard Steps 6-8, fix training fund threshold, and update terminology"
};

// Export version for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = version;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.versionInfo = version;
}