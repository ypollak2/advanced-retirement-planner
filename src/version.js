// Version information for the Advanced Retirement Planner
const version = {
<<<<<<< HEAD
    number: "6.5.2",
=======
    number: "6.6.0",
>>>>>>> d9baf56 (🚀 PRODUCTION RELEASE v6.6.0 - Major UX Overhaul & Runtime Fixes)
    build: "2025-07-22",
    commit: "v6.5.2-navigation-fixes",
    description: "Navigation fixes complete - Dashboard buttons connect to dedicated views with back navigation"
};

// Export version for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = version;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.versionInfo = version;
}