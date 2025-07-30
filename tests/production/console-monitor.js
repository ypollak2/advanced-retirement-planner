/**
 * Production Console Error Monitor
 * Specialized monitoring for Advanced Retirement Planner production environment
 */

class ProductionConsoleMonitor {
    constructor(options = {}) {
        this.options = {
            maxLogs: options.maxLogs || 500,
            categorizeErrors: options.categorizeErrors !== false,
            trackPerformance: options.trackPerformance !== false,
            enableAlerts: options.enableAlerts !== false,
            ...options
        };
        
        this.logs = [];
        this.errors = [];
        this.warnings = [];
        this.performance = {};
        this.categories = new Map();
        this.alertThresholds = {
            errorRate: 10, // errors per minute
            memoryUsage: 100, // MB
            responseTime: 5000 // ms
        };
        
        this.startTime = Date.now();
        this.lastErrorTime = null;
        this.errorCount = 0;
        
        this.initializeMonitoring();
        this.startPerformanceTracking();
        
        // Make globally available
        window.consoleMonitor = this;
    }
    
    initializeMonitoring() {
        this.setupConsoleInterception();
        this.setupErrorHandlers();
        this.setupNetworkMonitoring();
        this.setupMemoryTracking();
    }
    
    setupConsoleInterception() {
        const originalMethods = {
            log: console.log,
            error: console.error,
            warn: console.warn,
            info: console.info,
            debug: console.debug
        };
        
        // Intercept console.error
        console.error = (...args) => {
            originalMethods.error.apply(console, args);
            this.captureLog('error', args, {
                stack: new Error().stack,
                timestamp: new Date()
            });
        };
        
        // Intercept console.warn
        console.warn = (...args) => {
            originalMethods.warn.apply(console, args);
            this.captureLog('warn', args, {
                timestamp: new Date()
            });
        };
        
        // Intercept console.log for production analysis
        console.log = (...args) => {
            originalMethods.log.apply(console, args);
            
            // Only capture specific production logs
            const message = args.join(' ');
            if (this.isProductionRelevant(message)) {
                this.captureLog('info', args, {
                    timestamp: new Date()
                });
            }
        };
        
        // Store original methods for restoration if needed
        this.originalConsole = originalMethods;
    }
    
    setupErrorHandlers() {
        // Global JavaScript errors
        window.addEventListener('error', (event) => {
            this.captureError({
                type: 'javascript-error',
                message: event.message,
                filename: event.filename,
                line: event.lineno,
                column: event.colno,
                stack: event.error?.stack,
                timestamp: new Date(),
                url: window.location.href
            });
        });
        
        // Unhandled Promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.captureError({
                type: 'unhandled-promise-rejection',
                message: event.reason?.message || String(event.reason),
                stack: event.reason?.stack,
                promise: event.promise,
                timestamp: new Date(),
                url: window.location.href
            });
        });
        
        // Resource loading errors
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.captureError({
                    type: 'resource-error',
                    message: `Failed to load resource: ${event.target.src || event.target.href}`,
                    element: event.target.tagName,
                    source: event.target.src || event.target.href,
                    timestamp: new Date(),
                    url: window.location.href
                });
            }
        }, true);
    }
    
    setupNetworkMonitoring() {
        // Monitor fetch requests
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const startTime = performance.now();
            const url = args[0];
            
            try {
                const response = await originalFetch(...args);
                const endTime = performance.now();
                
                this.trackNetworkRequest({
                    url,
                    method: args[1]?.method || 'GET',
                    status: response.status,
                    duration: endTime - startTime,
                    success: response.ok,
                    timestamp: new Date()
                });
                
                return response;
            } catch (error) {
                const endTime = performance.now();
                
                this.trackNetworkRequest({
                    url,
                    method: args[1]?.method || 'GET',
                    status: 0,
                    duration: endTime - startTime,
                    success: false,
                    error: error.message,
                    timestamp: new Date()
                });
                
                this.captureError({
                    type: 'network-error',
                    message: `Network request failed: ${error.message}`,
                    url: url,
                    timestamp: new Date()
                });
                
                throw error;
            }
        };
    }
    
    setupMemoryTracking() {
        if ('memory' in performance) {
            setInterval(() => {
                const memInfo = performance.memory;
                this.performance.memory = {
                    used: Math.round(memInfo.usedJSHeapSize / 1024 / 1024),
                    total: Math.round(memInfo.totalJSHeapSize / 1024 / 1024),
                    limit: Math.round(memInfo.jsHeapSizeLimit / 1024 / 1024),
                    timestamp: new Date()
                };
                
                // Alert on high memory usage
                if (this.options.enableAlerts && memInfo.usedJSHeapSize / 1024 / 1024 > this.alertThresholds.memoryUsage) {
                    this.triggerAlert('high-memory-usage', `Memory usage: ${this.performance.memory.used}MB`);
                }
            }, 30000); // Check every 30 seconds
        }
    }
    
    startPerformanceTracking() {
        // Track page load performance
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    this.performance.pageLoad = {
                        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                        totalTime: perfData.loadEventEnd - perfData.navigationStart,
                        timestamp: new Date()
                    };
                }
            }, 100);
        });
        
        // Track long tasks
        if ('PerformanceObserver' in window) {
            try {
                const longTaskObserver = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                        if (entry.duration > 50) { // Tasks longer than 50ms
                            this.captureLog('warn', [`Long task detected: ${entry.duration.toFixed(2)}ms`], {
                                type: 'performance',
                                duration: entry.duration,
                                timestamp: new Date()
                            });
                        }
                    });
                });
                longTaskObserver.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                console.warn('Long task monitoring not supported');
            }
        }
    }
    
    captureLog(level, args, metadata = {}) {
        const logEntry = {
            level,
            message: args.join(' '),
            args: args.map(arg => this.serializeArg(arg)),
            metadata,
            category: this.options.categorizeErrors ? this.categorizeMessage(args.join(' ')) : null,
            timestamp: metadata.timestamp || new Date(),
            sessionTime: Date.now() - this.startTime
        };
        
        this.logs.push(logEntry);
        
        // Categorize by level
        if (level === 'error') {
            this.errors.push(logEntry);
            this.errorCount++;
            this.lastErrorTime = Date.now();
            
            // Check error rate
            if (this.options.enableAlerts) {
                this.checkErrorRate();
            }
        } else if (level === 'warn') {
            this.warnings.push(logEntry);
        }
        
        // Maintain log size limit
        if (this.logs.length > this.options.maxLogs) {
            this.logs = this.logs.slice(-this.options.maxLogs);
        }
        
        // Update categories
        if (logEntry.category && this.options.categorizeErrors) {
            this.updateCategory(logEntry.category, logEntry);
        }
        
        // Trigger callbacks if registered
        this.triggerCallbacks('log', logEntry);
    }
    
    captureError(errorInfo) {
        const errorEntry = {
            ...errorInfo,
            category: this.categorizeError(errorInfo),
            severity: this.assessSeverity(errorInfo),
            sessionTime: Date.now() - this.startTime,
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
        
        this.errors.push(errorEntry);
        this.errorCount++;
        this.lastErrorTime = Date.now();
        
        // Update categories
        if (this.options.categorizeErrors) {
            this.updateCategory(errorEntry.category, errorEntry);
        }
        
        // Auto-report critical errors
        if (errorEntry.severity === 'critical' && this.options.enableAlerts) {
            this.triggerAlert('critical-error', errorEntry.message);
        }
        
        this.triggerCallbacks('error', errorEntry);
    }
    
    trackNetworkRequest(requestInfo) {
        if (!this.performance.network) {
            this.performance.network = [];
        }
        
        this.performance.network.push(requestInfo);
        
        // Keep only last 100 network requests
        if (this.performance.network.length > 100) {
            this.performance.network = this.performance.network.slice(-100);
        }
        
        // Alert on slow requests
        if (this.options.enableAlerts && requestInfo.duration > this.alertThresholds.responseTime) {
            this.triggerAlert('slow-request', `Slow request: ${requestInfo.url} (${requestInfo.duration.toFixed(2)}ms)`);
        }
    }
    
    isProductionRelevant(message) {
        const relevantPatterns = [
            /error/i,
            /warning/i,
            /failed/i,
            /undefined/i,
            /null/i,
            /currency/i,
            /api/i,
            /calculation/i,
            /wizard/i,
            /retirement/i
        ];
        
        return relevantPatterns.some(pattern => pattern.test(message));
    }
    
    categorizeMessage(message) {
        const categories = {
            'currency-api': /currency|exchange|rate|api/i,
            'react-component': /react|component|render|props/i,
            'calculation-error': /calculation|math|number|NaN|infinity/i,
            'wizard-flow': /wizard|step|navigation|form/i,
            'data-persistence': /storage|localStorage|save|load/i,
            'network-issue': /fetch|request|network|cors|timeout/i,
            'validation-error': /validation|required|invalid|error/i,
            'performance': /slow|performance|memory|time/i,
            'unknown': /.*/
        };
        
        for (const [category, pattern] of Object.entries(categories)) {
            if (pattern.test(message)) {
                return category;
            }
        }
        
        return 'unknown';
    }
    
    categorizeError(errorInfo) {
        const message = errorInfo.message || '';
        const filename = errorInfo.filename || '';
        const type = errorInfo.type || '';
        
        // Specific categorization for Advanced Retirement Planner
        if (message.includes('getExchangeRates') || message.includes('CurrencyAPI')) {
            return 'currency-api-error';
        }
        
        if (message.includes('React') || message.includes('Component') || filename.includes('react')) {
            return 'react-error';
        }
        
        if (message.includes('calculation') || message.includes('NaN') || message.includes('Infinity')) {
            return 'calculation-error';
        }
        
        if (type === 'unhandled-promise-rejection') {
            return 'promise-rejection';
        }
        
        if (type === 'network-error' || message.includes('fetch') || message.includes('cors')) {
            return 'network-error';
        }
        
        if (type === 'resource-error') {
            return 'resource-loading-error';
        }
        
        return 'general-error';
    }
    
    assessSeverity(errorInfo) {
        const criticalPatterns = [
            /is not defined/i,
            /Cannot read property/i,
            /Cannot access before initialization/i,
            /Script error/i
        ];
        
        const highPatterns = [
            /React/i,
            /Component/i,
            /calculation/i,
            /currency/i
        ];
        
        const message = errorInfo.message || '';
        
        if (criticalPatterns.some(pattern => pattern.test(message))) {
            return 'critical';
        }
        
        if (highPatterns.some(pattern => pattern.test(message))) {
            return 'high';
        }
        
        if (errorInfo.type === 'unhandled-promise-rejection') {
            return 'high';
        }
        
        return 'medium';
    }
    
    updateCategory(categoryName, entry) {
        if (!this.categories.has(categoryName)) {
            this.categories.set(categoryName, {
                name: categoryName,
                count: 0,
                entries: [],
                firstOccurrence: entry.timestamp,
                lastOccurrence: entry.timestamp
            });
        }
        
        const category = this.categories.get(categoryName);
        category.count++;
        category.entries.push(entry);
        category.lastOccurrence = entry.timestamp;
        
        // Keep only last 50 entries per category
        if (category.entries.length > 50) {
            category.entries = category.entries.slice(-50);
        }
    }
    
    checkErrorRate() {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        
        const recentErrors = this.errors.filter(error => 
            new Date(error.timestamp).getTime() > oneMinuteAgo
        );
        
        if (recentErrors.length > this.alertThresholds.errorRate) {
            this.triggerAlert('high-error-rate', `${recentErrors.length} errors in the last minute`);
        }
    }
    
    triggerAlert(type, message) {
        const alert = {
            type,
            message,
            timestamp: new Date(),
            severity: type.includes('critical') ? 'critical' : 'warning'
        };
        
        console.warn(`🚨 Production Alert [${type}]: ${message}`);
        
        // Could integrate with external alerting systems here
        this.triggerCallbacks('alert', alert);
    }
    
    serializeArg(arg) {
        try {
            if (typeof arg === 'object' && arg !== null) {
                return JSON.stringify(arg, null, 2);
            }
            return String(arg);
        } catch (e) {
            return '[Unserializable Object]';
        }
    }
    
    // Public API Methods
    getErrorSummary() {
        const now = Date.now();
        return {
            totalErrors: this.errors.length,
            totalWarnings: this.warnings.length,
            sessionDuration: now - this.startTime,
            errorRate: this.errors.length / ((now - this.startTime) / 60000), // errors per minute
            categories: Array.from(this.categories.entries()).map(([name, data]) => ({
                name,
                count: data.count,
                firstOccurrence: data.firstOccurrence,
                lastOccurrence: data.lastOccurrence
            })),
            lastErrorTime: this.lastErrorTime,
            performance: this.performance
        };
    }
    
    getErrorsByCategory(categoryName) {
        const category = this.categories.get(categoryName);
        return category ? category.entries : [];
    }
    
    getRecentErrors(minutes = 5) {
        const cutoff = Date.now() - (minutes * 60000);
        return this.errors.filter(error => 
            new Date(error.timestamp).getTime() > cutoff
        );
    }
    
    exportReport() {
        return {
            summary: this.getErrorSummary(),
            errors: this.errors,
            warnings: this.warnings,
            logs: this.logs.slice(-100), // Last 100 logs
            performance: this.performance,
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        };
    }
    
    clearLogs() {
        this.logs = [];
        this.errors = [];
        this.warnings = [];
        this.categories.clear();
        this.errorCount = 0;
        this.lastErrorTime = null;
    }
    
    // Callback system for integration
    callbacks = new Map();
    
    on(event, callback) {
        if (!this.callbacks.has(event)) {
            this.callbacks.set(event, []);
        }
        this.callbacks.get(event).push(callback);
    }
    
    off(event, callback) {
        if (this.callbacks.has(event)) {
            const callbacks = this.callbacks.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }
    
    triggerCallbacks(event, data) {
        if (this.callbacks.has(event)) {
            this.callbacks.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (e) {
                    console.error('Callback error:', e);
                }
            });
        }
    }
}

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
    window.ProductionConsoleMonitor = ProductionConsoleMonitor;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductionConsoleMonitor;
}