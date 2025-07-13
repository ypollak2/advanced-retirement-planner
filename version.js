// Centralized Version Configuration
// Update this file to automatically update version across entire application

const APP_VERSION = {
    major: 4,
    minor: 10,
    patch: 4,
    
    // Build information
    buildDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    qaScore: 94.6,
    
    // Auto-generated version string
    get full() {
        return `${this.major}.${this.minor}.${this.patch}`;
    },
    
    get display() {
        return `Advanced Retirement Planner v${this.full}`;
    },
    
    get badge() {
        return `v${this.full}`;
    },
    
    get buildInfo() {
        return `Built: ${this.buildDate} • Production Ready • ${this.qaScore}% QA Score`;
    }
};

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APP_VERSION;
} else {
    window.APP_VERSION = APP_VERSION;
}