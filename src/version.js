// Version information for the Advanced Retirement Planner
const version = {
    number: "5.3.2",
    build: "2025-07-15",
    commit: "v5.3.2-ui-redesign-with-permanent-sidebar",
    description: "Major UI redesign with permanent side panel, tabbed navigation, enhanced chart breakdowns, multi-currency support, and improved terminology"
};

// Export version for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = version;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.versionInfo = version;
}