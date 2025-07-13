// Centralized Version Configuration
// Update this file to automatically update version across entire application
// DEPLOYMENT ID: deploy-1752415469639

const APP_VERSION = {
    major: 5,
    minor: 0,
    patch: 1,
    
    // Build information
    buildDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    qaScore: 100,
    deploymentId: 'v5.0.1-deployment-' + Date.now(),
    cacheVersion: 'v5.0.1-cache-' + Date.now(),
    buildTimestamp: new Date().toISOString(),
    
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
        return `Built: ${this.buildDate} • Production Ready • ${this.qaScore}% QA Score • Deploy: ${this.deploymentId}`;
    },
    
    // Cache-busting helpers
    get cacheParam() {
        return `v=${this.full}&cache=${this.cacheVersion}&t=${Date.now()}`;
    }
};

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APP_VERSION;
} else {
    window.APP_VERSION = APP_VERSION;
}