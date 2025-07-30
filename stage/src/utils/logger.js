// Environment-aware logging utility
// Created by Yali Pollak (יהלי פולק) - v7.0.6

class Logger {
    constructor() {
        // Detect environment - development vs production
        this.isDevelopment = this.detectEnvironment();
        this.logLevels = {
            ERROR: 0,
            WARN: 1,
            INFO: 2,
            DEBUG: 3
        };
        // Set default log level based on environment
        this.currentLevel = this.isDevelopment ? this.logLevels.DEBUG : this.logLevels.WARN;
    }

    detectEnvironment() {
        // Multiple methods to detect development environment
        try {
            // Method 1: Check for development indicators
            if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
                return true;
            }
            
            // Method 2: Check for localhost/development URLs
            if (typeof window !== 'undefined') {
                const hostname = window.location.hostname;
                if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('dev')) {
                    return true;
                }
            }
            
            // Method 3: Check for console availability and debug mode
            if (typeof console !== 'undefined' && window.location.search.includes('debug=true')) {
                return true;
            }
            
            // Default to production (safer)
            return false;
        } catch (error) {
            // If any detection fails, assume production
            return false;
        }
    }

    error(...args) {
        if (this.currentLevel >= this.logLevels.ERROR) {
            console.error('🔴 ERROR:', ...args);
        }
    }

    warn(...args) {
        if (this.currentLevel >= this.logLevels.WARN) {
            console.warn('🟡 WARN:', ...args);
        }
    }

    info(...args) {
        if (this.currentLevel >= this.logLevels.INFO) {
            console.info('🔵 INFO:', ...args);
        }
    }

    debug(...args) {
        if (this.currentLevel >= this.logLevels.DEBUG) {
            console.log('🔧 DEBUG:', ...args);
        }
    }

    // Financial Health Engine specific logging
    fieldSearch(message, ...args) {
        if (this.isDevelopment) {
            console.log('🔍', message, ...args);
        }
    }

    fieldFound(message, ...args) {
        if (this.isDevelopment) {
            console.log('✅', message, ...args);
        }
    }

    calculation(message, ...args) {
        if (this.isDevelopment) {
            console.log('🧮', message, ...args);
        }
    }

    // Set log level programmatically
    setLevel(level) {
        if (typeof level === 'string') {
            this.currentLevel = this.logLevels[level.toUpperCase()] || this.logLevels.WARN;
        } else {
            this.currentLevel = level;
        }
    }

    // Enable/disable debugging mode
    setDebugMode(enabled) {
        this.currentLevel = enabled ? this.logLevels.DEBUG : this.logLevels.WARN;
    }
}

// Create singleton instance
const logger = new Logger();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = logger;
}

// Export to window for global access
window.logger = logger;

console.log(`📋 Logger initialized - Environment: ${logger.isDevelopment ? 'development' : 'production'}, Level: ${Object.keys(logger.logLevels)[logger.currentLevel]}`);