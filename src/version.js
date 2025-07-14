// Version information for the Advanced Retirement Planner
const version = {
    number: "5.1.4",
    build: "2024-12-14",
    commit: "v5.1.4-deployment-fix",
    description: "Fixed Node.js compatibility and deployment pipeline"
};

// Export version for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = version;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.versionInfo = version;
}