// Performance Monitoring and Metrics Collection
// Created by Yali Pollak (יהלי פולק) - v6.1.0

class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.observers = [];
        this.isEnabled = true;
        this.startTime = performance.now();
        
        // Size management configuration
        this.maxMetricsPerType = 50; // Maximum entries per metric type
        this.maxPayloadSize = 1024 * 1024; // 1MB max payload size
        this.lastSaveTime = 0;
        this.saveInterval = 30000; // Save every 30 seconds minimum
        
        this.initializeObservers();
        this.setupEventListeners();
    }

    // Initialize performance observers
    initializeObservers() {
        if ('PerformanceObserver' in window) {
            // Monitor navigation timing
            try {
                const navObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        this.recordNavigationMetrics(entry);
                    }
                });
                navObserver.observe({ entryTypes: ['navigation'] });
                this.observers.push(navObserver);
            } catch (error) {
                console.warn('Navigation observer not supported:', error);
            }

            // Monitor resource loading
            try {
                const resourceObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        this.recordResourceMetrics(entry);
                    }
                });
                resourceObserver.observe({ entryTypes: ['resource'] });
                this.observers.push(resourceObserver);
            } catch (error) {
                console.warn('Resource observer not supported:', error);
            }

            // Monitor largest contentful paint
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    this.recordMetric('lcp', lastEntry.startTime);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
                this.observers.push(lcpObserver);
            } catch (error) {
                console.warn('LCP observer not supported:', error);
            }

            // Monitor first input delay
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        this.recordMetric('fid', entry.processingStart - entry.startTime);
                    }
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
                this.observers.push(fidObserver);
            } catch (error) {
                console.warn('FID observer not supported:', error);
            }

            // Monitor cumulative layout shift
            try {
                const clsObserver = new PerformanceObserver((list) => {
                    let clsValue = 0;
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    }
                    this.recordMetric('cls', clsValue);
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
                this.observers.push(clsObserver);
            } catch (error) {
                console.warn('CLS observer not supported:', error);
            }
        }
    }

    // Setup custom event listeners with smart saving
    setupEventListeners() {
        // Page visibility changes - smart saving
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.recordMetric('session_duration', performance.now() - this.startTime);
                // Only save if enough time has passed since last save
                this.smartSave();
            }
        });

        // Window unload - force save
        window.addEventListener('beforeunload', () => {
            this.recordMetric('session_duration', performance.now() - this.startTime);
            this.sendMetrics(true); // Force save on unload
        });

        // Periodic saving every 30 seconds
        setInterval(() => {
            this.smartSave();
        }, this.saveInterval);

        // React component lifecycle tracking
        this.setupReactMonitoring();
    }

    // Setup React component monitoring
    setupReactMonitoring() {
        // Monitor component render times
        const originalCreateElement = React.createElement;
        React.createElement = (...args) => {
            const startTime = performance.now();
            const result = originalCreateElement.apply(React, args);
            const endTime = performance.now();
            
            if (args[0] && typeof args[0] === 'string') {
                this.recordMetric(`component_render_${args[0]}`, endTime - startTime);
            }
            
            return result;
        };
    }

    // Record navigation metrics
    recordNavigationMetrics(entry) {
        const metrics = {
            dns_lookup: entry.domainLookupEnd - entry.domainLookupStart,
            tcp_connect: entry.connectEnd - entry.connectStart,
            tls_handshake: entry.secureConnectionStart > 0 ? entry.connectEnd - entry.secureConnectionStart : 0,
            server_response: entry.responseStart - entry.requestStart,
            dom_content_loaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
            page_load: entry.loadEventEnd - entry.loadEventStart,
            total_load_time: entry.loadEventEnd - entry.fetchStart
        };

        for (const [key, value] of Object.entries(metrics)) {
            if (value > 0) {
                this.recordMetric(`nav_${key}`, value);
            }
        }
    }

    // Record resource loading metrics
    recordResourceMetrics(entry) {
        if (entry.name.includes('.js')) {
            this.recordMetric('js_load_time', entry.duration);
            this.recordMetric('js_size', entry.transferSize || 0);
        } else if (entry.name.includes('.css')) {
            this.recordMetric('css_load_time', entry.duration);
            this.recordMetric('css_size', entry.transferSize || 0);
        }
    }

    // Record custom metrics with size management
    recordMetric(name, value, tags = {}) {
        if (!this.isEnabled) return;

        const metric = {
            name,
            value,
            timestamp: Date.now(),
            tags: {
                ...tags,
                url: window.location.pathname.slice(0, 50), // Limit URL length
                userAgent: navigator.userAgent.slice(0, 50), // Reduce userAgent length
                connection: this.getConnectionInfo()
            }
        };

        // Store metric with size management
        if (!this.metrics.has(name)) {
            this.metrics.set(name, []);
        }
        
        const metricsArray = this.metrics.get(name);
        metricsArray.push(metric);
        
        // Implement FIFO cleanup - keep only latest entries
        if (metricsArray.length > this.maxMetricsPerType) {
            metricsArray.splice(0, metricsArray.length - this.maxMetricsPerType);
        }

        // Console logging for development (reduced verbosity)
        if (value > 200) { // Only log more significant metrics
            console.log(`📊 ${name}: ${Math.round(value)}ms`);
        }
    }

    // Get connection information
    getConnectionInfo() {
        if ('connection' in navigator) {
            return {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            };
        }
        return null;
    }

    // Start timing a custom operation
    startTiming(operation) {
        const startTime = performance.now();
        return {
            end: (tags = {}) => {
                const duration = performance.now() - startTime;
                this.recordMetric(`timing_${operation}`, duration, tags);
                return duration;
            }
        };
    }

    // Record user interaction metrics
    recordUserAction(action, details = {}) {
        this.recordMetric(`user_${action}`, 1, {
            ...details,
            timestamp: Date.now()
        });
    }

    // Record API call metrics
    recordAPICall(endpoint, duration, success = true) {
        this.recordMetric('api_call_duration', duration, {
            endpoint,
            success,
            timestamp: Date.now()
        });
    }

    // Record error metrics with reduced payload size
    recordError(error, context = {}) {
        this.recordMetric('error_count', 1, {
            message: (error.message || error).slice(0, 100), // Reduce message length
            stack: error.stack ? error.stack.slice(0, 100) : '', // Reduce stack trace length
            context: JSON.stringify(context).slice(0, 50), // Reduce context length
            timestamp: Date.now()
        });
    }

    // Get performance summary
    getPerformanceSummary() {
        const summary = {};
        
        for (const [name, measurements] of this.metrics.entries()) {
            const values = measurements.map(m => m.value).filter(v => typeof v === 'number');
            if (values.length > 0) {
                summary[name] = {
                    count: values.length,
                    avg: values.reduce((a, b) => a + b, 0) / values.length,
                    min: Math.min(...values),
                    max: Math.max(...values),
                    latest: values[values.length - 1]
                };
            }
        }
        
        return summary;
    }

    // Smart save - only save if enough time has passed
    smartSave() {
        const now = Date.now();
        if (now - this.lastSaveTime < this.saveInterval) {
            return; // Too soon since last save
        }
        this.sendMetrics();
    }

    // Send metrics with storage quota management
    sendMetrics(forceSave = false) {
        if (!this.isEnabled || (!forceSave && this.metrics.size === 0)) return;

        // Create optimized payload with essential info only
        const payload = {
            session_id: this.generateSessionId(),
            timestamp: Date.now(),
            summary: this.getPerformanceSummary(), // Only summary, not full metrics
            browser_info: {
                language: navigator.language,
                platform: navigator.platform.slice(0, 20),
                screen: {
                    width: screen.width,
                    height: screen.height
                }
            }
        };

        // Check payload size before saving
        const payloadString = JSON.stringify(payload);
        const payloadSize = new Blob([payloadString]).size;

        if (payloadSize > this.maxPayloadSize) {
            console.warn('📊 Payload too large, skipping save:', Math.round(payloadSize / 1024) + 'KB');
            this.clearOldMetrics(); // Clear old data
            return;
        }

        // Store locally with error recovery
        try {
            // Check available localStorage space
            this.checkLocalStorageQuota();
            
            localStorage.setItem('retirement_planner_metrics', payloadString);
            this.lastSaveTime = Date.now();
            console.log('📊 Performance metrics saved:', Math.round(payloadSize / 1024) + 'KB');
        } catch (error) {
            this.handleStorageError(error);
        }
    }

    // Check localStorage quota and availability
    checkLocalStorageQuota() {
        try {
            // Estimate current localStorage usage
            let totalSize = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    totalSize += localStorage[key].length + key.length;
                }
            }
            
            // If approaching 4MB (browsers typically limit to 5-10MB), clear old data
            if (totalSize > 4 * 1024 * 1024) {
                console.warn('📊 localStorage approaching quota, clearing old metrics');
                this.clearOldMetrics();
            }
        } catch (error) {
            console.warn('📊 Could not check localStorage quota:', error);
        }
    }

    // Handle storage errors with graceful recovery
    handleStorageError(error) {
        if (error.name === 'QuotaExceededError') {
            console.warn('📊 localStorage quota exceeded, clearing old data and disabling metrics');
            
            // Clear old metrics data
            this.clearOldMetrics();
            
            // Try one more time with minimal data
            try {
                const minimalPayload = {
                    session_id: this.generateSessionId(),
                    timestamp: Date.now(),
                    summary: { status: 'quota_exceeded' }
                };
                localStorage.setItem('retirement_planner_metrics', JSON.stringify(minimalPayload));
                console.log('📊 Minimal metrics saved after quota error');
            } catch (retryError) {
                console.warn('📊 Complete localStorage failure, disabling performance monitoring');
                this.setEnabled(false);
            }
        } else {
            console.warn('📊 Failed to save metrics:', error);
        }
    }

    // Clear old metrics data to free up space
    clearOldMetrics() {
        // Clear in-memory metrics, keeping only recent data
        for (const [name, metrics] of this.metrics.entries()) {
            if (metrics.length > 10) {
                // Keep only the last 10 entries for each metric
                this.metrics.set(name, metrics.slice(-10));
            }
        }
        
        // Remove old localStorage entries
        try {
            localStorage.removeItem('retirement_planner_metrics');
            console.log('📊 Old metrics data cleared');
        } catch (error) {
            console.warn('📊 Could not clear old metrics:', error);
        }
    }

    // Generate session ID
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Enable/disable monitoring
    setEnabled(enabled) {
        this.isEnabled = enabled;
        if (!enabled) {
            this.cleanup();
        }
    }

    // Cleanup observers and metrics data
    cleanup() {
        this.observers.forEach(observer => {
            try {
                observer.disconnect();
            } catch (error) {
                console.warn('Error disconnecting observer:', error);
            }
        });
        this.observers = [];
        
        // Clear metrics data
        this.metrics.clear();
        
        // Clear localStorage metrics
        try {
            localStorage.removeItem('retirement_planner_metrics');
        } catch (error) {
            console.warn('Could not clear localStorage metrics:', error);
        }
    }

    // Get storage information
    getStorageInfo() {
        try {
            let totalSize = 0;
            let metricsSize = 0;
            
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    const itemSize = localStorage[key].length + key.length;
                    totalSize += itemSize;
                    
                    if (key === 'retirement_planner_metrics') {
                        metricsSize = itemSize;
                    }
                }
            }
            
            return {
                totalUsed: Math.round(totalSize / 1024) + 'KB',
                metricsUsed: Math.round(metricsSize / 1024) + 'KB',
                metricsCount: this.metrics.size,
                lastSave: new Date(this.lastSaveTime).toLocaleTimeString(),
                enabled: this.isEnabled
            };
        } catch (error) {
            return { error: 'Could not access localStorage' };
        }
    }

    // Get real-time performance info
    getRealTimeInfo() {
        return {
            memory: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
            } : null,
            timing: {
                navigation: performance.getEntriesByType('navigation')[0],
                paint: performance.getEntriesByType('paint')
            },
            connection: this.getConnectionInfo()
        };
    }
}

// Create global instance
const performanceMonitor = new PerformanceMonitor();

// Enhancement for existing stock API to track performance
if (window.fetchStockPrice) {
    const originalFetchStockPrice = window.fetchStockPrice;
    window.fetchStockPrice = async function(...args) {
        const timer = performanceMonitor.startTiming('stock_price_fetch');
        try {
            const result = await originalFetchStockPrice.apply(this, args);
            timer.end({ symbol: args[0], success: true });
            return result;
        } catch (error) {
            timer.end({ symbol: args[0], success: false });
            performanceMonitor.recordError(error, { operation: 'stock_price_fetch', symbol: args[0] });
            throw error;
        }
    };
}

// Enhancement for React component loading
if (window.ComponentLoader) {
    const originalLoadComponent = window.ComponentLoader.loadComponent;
    window.ComponentLoader.loadComponent = async function(componentName, priority) {
        const timer = performanceMonitor.startTiming('component_load');
        try {
            const result = await originalLoadComponent.call(this, componentName, priority);
            timer.end({ component: componentName, priority, success: true });
            return result;
        } catch (error) {
            timer.end({ component: componentName, priority, success: false });
            performanceMonitor.recordError(error, { operation: 'component_load', component: componentName });
            throw error;
        }
    };
}

// Global error handling
window.addEventListener('error', (event) => {
    performanceMonitor.recordError(event.error || event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
    });
});

window.addEventListener('unhandledrejection', (event) => {
    performanceMonitor.recordError(event.reason, {
        type: 'unhandled_promise_rejection'
    });
});

// Export for global use
window.PerformanceMonitor = performanceMonitor;

// Utility functions
window.recordUserAction = (action, details) => performanceMonitor.recordUserAction(action, details);
window.recordAPICall = (endpoint, duration, success) => performanceMonitor.recordAPICall(endpoint, duration, success);
window.getPerformanceInfo = () => performanceMonitor.getRealTimeInfo();
window.getStorageInfo = () => performanceMonitor.getStorageInfo();
window.clearPerformanceMetrics = () => performanceMonitor.clearOldMetrics();

console.log('📊 Performance Monitor initialized');