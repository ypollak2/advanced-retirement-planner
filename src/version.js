// Version information for the Advanced Retirement Planner
const version = {
    number: "5.3.5",
    build: "2025-07-18",
    commit: "v5.3.5-bug-fixes-and-test-improvements",
    description: "Bug fixes and test improvements: resolved Dashboard selectedCurrency error, eliminated duplicate functions, and improved test suite architecture"
};

// Export version for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = version;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.versionInfo = version;
}