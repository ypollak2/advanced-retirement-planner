// Version information for the Advanced Retirement Planner
const version = {
    number: "6.1.1",
    build: "2025-07-20",
    commit: "v6.1.1-update",
    description: "Fix title truncation test and achieve 100% test coverage"
};

// Export version for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = version;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.versionInfo = version;
}