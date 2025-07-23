// Version information for the Advanced Retirement Planner
const version = {
    number: "6.6.4",
    build: "2025-07-22",
    commit: "v6.6.2-update",
    description: "Deployment synchronization and professional README cleanup"
};

// Export version for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = version;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.versionInfo = version;
}