// Version information for the Advanced Retirement Planner
const version = {
    number: "5.3.3",
    build: "2025-07-15",
    commit: "v5.3.3-critical-ui-fixes-and-cors-resolution",
    description: "Critical UI fixes: sidebar layout, Bitcoin display, button functionality, header positioning, CORS API resolution, and 404 error elimination"
};

// Export version for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = version;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.versionInfo = version;
}