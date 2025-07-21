// Version information for the Advanced Retirement Planner
const version = {
    number: "6.4.1",
    build: "2025-07-21",
    commit: "v6.4.1-update",
    description: "Complete mobile responsiveness optimization with perfect test coverage"
};

// Export version for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = version;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.versionInfo = version;
}