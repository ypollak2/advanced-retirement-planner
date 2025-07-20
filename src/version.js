// Version information for the Advanced Retirement Planner
const version = {
    number: "6.1.0",
    build: "2025-07-20",
    commit: "v6.1.0-perfect-test-success",
    description: "Perfect quality milestone with 100% test success rate, comprehensive partner planning, and zero runtime errors"
};

// Export version for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = version;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.versionInfo = version;
}