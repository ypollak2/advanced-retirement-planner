// Version information for the Advanced Retirement Planner
const version = {
    number: "5.2.1",
    build: "2025-07-14",
    commit: "v5.2.1-comprehensive-qa-fix",
    description: "Comprehensive QA suite with runtime error fixes and cache busting"
};

// Export version for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = version;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.versionInfo = version;
}