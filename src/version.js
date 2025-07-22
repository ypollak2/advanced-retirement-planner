// Version information for the Advanced Retirement Planner
const version = {
    number: "6.6.0",
    build: "2025-07-22",
    commit: "v6.6.0-major-ux-overhaul",
    description: "Major UX overhaul with intelligent results display and critical runtime fixes"
};

// Export version for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = version;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.versionInfo = version;
}