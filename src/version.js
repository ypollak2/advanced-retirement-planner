// Version information for the Advanced Retirement Planner
const version = {
    number: "5.3.1",
    build: "2025-07-15",
    commit: "v5.3.1-runtime-error-fixes",
    description: "Fixed React key warnings, PDF export errors, language toggle issues, and CORS API problems"
};

// Export version for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = version;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.versionInfo = version;
}