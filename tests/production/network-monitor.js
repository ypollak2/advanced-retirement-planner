/**
 * Production Network & API Monitor
 * Monitors external service connectivity and API performance for Advanced Retirement Planner
 */

class ProductionNetworkMonitor {
    constructor(options = {}) {
        this.options = {
            maxRequestHistory: options.maxRequestHistory || 200,
            timeoutThreshold: options.timeoutThreshold || 30000, // 30 seconds
            slowRequestThreshold: options.slowRequestThreshold || 5000, // 5 seconds
            retryAttempts: options.retryAttempts || 3,
            monitorInterval: options.monitorInterval || 60000, // 1 minute
            enablePeriodic: options.enablePeriodic !== false,
            ...options
        };
        
        this.requestHistory = [];
        this.apiEndpoints = {
            currencyAPI: 'https://api.exchangerate-api.com/v4/latest/USD',
            currencyAPIBackup: 'https://api.fxratesapi.com/latest',
            yahooFinance: 'https://query1.finance.yahoo.com/v8/finance/chart/AAPL',
            corsProxy: 'https://cors-anywhere.herokuapp.com/',
            githubPages: 'https://ypollak2.github.io/advanced-retirement-planner/'
        };
        
        this.serviceStatus = new Map();
        this.networkStats = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            averageResponseTime: 0,
            slowRequests: 0,
            timeouts: 0
        };
        
        this.periodicTimer = null;
        this.isMonitoring = false;
        
        this.initializeMonitoring();
        
        // Make globally available
        window.networkMonitor = this;
    }
    
    initializeMonitoring() {
        this.setupFetchInterception();
        this.initializeServiceStatus();
        
        if (this.options.enablePeriodic) {
            this.startPeriodicMonitoring();
        }
    }
    
    setupFetchInterception() {
        const originalFetch = window.fetch;
        
        window.fetch = async (...args) => {
            const startTime = performance.now();
            const url = args[0];
            const options = args[1] || {};
            
            const requestInfo = {
                url: this.sanitizeUrl(url),
                method: options.method || 'GET',
                startTime: new Date(),
                timestamp: Date.now()
            };
            
            try {
                const response = await originalFetch(...args);
                const endTime = performance.now();
                const duration = endTime - startTime;
                
                this.recordRequest({
                    ...requestInfo,
                    status: response.status,
                    success: response.ok,
                    duration,
                    endTime: new Date(),
                    headers: this.extractResponseHeaders(response),
                    size: this.getResponseSize(response)
                });
                
                return response;
            } catch (error) {
                const endTime = performance.now();
                const duration = endTime - startTime;
                
                this.recordRequest({
                    ...requestInfo,
                    status: 0,
                    success: false,
                    duration,
                    endTime: new Date(),
                    error: error.message,
                    errorType: this.categorizeNetworkError(error)
                });
                
                throw error;
            }
        };
    }
    
    initializeServiceStatus() {
        Object.keys(this.apiEndpoints).forEach(service => {
            this.serviceStatus.set(service, {
                name: service,
                url: this.apiEndpoints[service],
                status: 'unknown',
                lastCheck: null,
                responseTime: null,
                errorCount: 0,
                successCount: 0,
                availability: 0
            });
        });
    }
    
    recordRequest(requestData) {
        this.requestHistory.push(requestData);
        
        // Maintain history size limit
        if (this.requestHistory.length > this.options.maxRequestHistory) {
            this.requestHistory = this.requestHistory.slice(-this.options.maxRequestHistory);
        }
        
        // Update statistics
        this.updateNetworkStats(requestData);
        
        // Update service status if it's a monitored endpoint
        this.updateServiceStatus(requestData);
        
        // Check for performance issues
        this.checkPerformanceIssues(requestData);
    }
    
    updateNetworkStats(requestData) {
        this.networkStats.totalRequests++;
        
        if (requestData.success) {
            this.networkStats.successfulRequests++;
        } else {
            this.networkStats.failedRequests++;
        }
        
        // Update average response time
        const totalTime = (this.networkStats.averageResponseTime * (this.networkStats.totalRequests - 1)) + requestData.duration;
        this.networkStats.averageResponseTime = totalTime / this.networkStats.totalRequests;
        
        // Track slow requests
        if (requestData.duration > this.options.slowRequestThreshold) {
            this.networkStats.slowRequests++;
        }
        
        // Track timeouts
        if (requestData.duration > this.options.timeoutThreshold) {
            this.networkStats.timeouts++;
        }
    }
    
    updateServiceStatus(requestData) {
        const serviceName = this.identifyService(requestData.url);
        if (!serviceName) return;
        
        const service = this.serviceStatus.get(serviceName);
        if (!service) return;
        
        service.lastCheck = requestData.endTime;
        service.responseTime = requestData.duration;
        
        if (requestData.success) {
            service.status = 'healthy';
            service.successCount++;
        } else {
            service.status = 'unhealthy';
            service.errorCount++;
        }
        
        // Calculate availability percentage
        const totalChecks = service.successCount + service.errorCount;
        service.availability = totalChecks > 0 ? (service.successCount / totalChecks) * 100 : 0;
        
        this.serviceStatus.set(serviceName, service);
    }
    
    identifyService(url) {
        for (const [serviceName, serviceUrl] of Object.entries(this.apiEndpoints)) {
            if (url.includes(this.getDomain(serviceUrl))) {
                return serviceName;
            }
        }
        return null;
    }
    
    getDomain(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch (e) {
            return url;
        }
    }
    
    sanitizeUrl(url) {
        // Remove query parameters that might contain sensitive data
        try {
            const urlObj = new URL(url);
            const sensitiveParams = ['key', 'token', 'secret', 'password', 'auth'];
            
            sensitiveParams.forEach(param => {
                if (urlObj.searchParams.has(param)) {
                    urlObj.searchParams.set(param, '[REDACTED]');
                }
            });
            
            return urlObj.toString();
        } catch (e) {
            return url;
        }
    }
    
    extractResponseHeaders(response) {
        const headers = {};
        const relevantHeaders = [
            'content-type',
            'content-length',
            'cache-control',
            'x-ratelimit-remaining',
            'x-ratelimit-limit'
        ];
        
        relevantHeaders.forEach(header => {
            const value = response.headers.get(header);
            if (value) {
                headers[header] = value;
            }
        });
        
        return headers;
    }
    
    getResponseSize(response) {
        const contentLength = response.headers.get('content-length');
        return contentLength ? parseInt(contentLength, 10) : null;
    }
    
    categorizeNetworkError(error) {
        const message = error.message.toLowerCase();
        
        if (message.includes('cors')) {
            return 'cors-error';
        }
        if (message.includes('timeout')) {
            return 'timeout-error';
        }
        if (message.includes('network')) {
            return 'network-error';
        }
        if (message.includes('abort')) {
            return 'aborted-request';
        }
        if (message.includes('refused')) {
            return 'connection-refused';
        }
        
        return 'unknown-error';
    }
    
    checkPerformanceIssues(requestData) {
        // Alert on very slow requests
        if (requestData.duration > this.options.slowRequestThreshold) {
            console.warn(`🐌 Slow request detected: ${requestData.url} took ${requestData.duration.toFixed(2)}ms`);
        }
        
        // Alert on timeouts
        if (requestData.duration > this.options.timeoutThreshold) {
            console.error(`⏰ Request timeout: ${requestData.url} took ${requestData.duration.toFixed(2)}ms`);
        }
        
        // Alert on failed requests to critical services
        if (!requestData.success && this.identifyService(requestData.url)) {
            console.error(`❌ Critical service request failed: ${requestData.url} - ${requestData.error}`);
        }
    }
    
    startPeriodicMonitoring() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        console.log('🔄 Starting periodic network monitoring...');
        
        this.periodicTimer = setInterval(() => {
            this.performHealthCheck();
        }, this.options.monitorInterval);
        
        // Perform initial health check
        setTimeout(() => this.performHealthCheck(), 5000);
    }
    
    stopPeriodicMonitoring() {
        if (this.periodicTimer) {
            clearInterval(this.periodicTimer);
            this.periodicTimer = null;
        }
        this.isMonitoring = false;
        console.log('⏹️ Stopped periodic network monitoring');
    }
    
    async performHealthCheck() {
        console.log('🔍 Performing network health check...');
        
        const healthCheckPromises = Object.entries(this.apiEndpoints).map(
            ([serviceName, url]) => this.checkServiceHealth(serviceName, url)
        );
        
        try {
            await Promise.allSettled(healthCheckPromises);
            this.generateHealthReport();
        } catch (error) {
            console.error('Health check error:', error);
        }
    }
    
    async checkServiceHealth(serviceName, url) {
        const startTime = performance.now();
        
        try {
            // Special handling for different services
            let testUrl = url;
            let options = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            };
            
            // Adjust for specific services
            if (serviceName === 'yahooFinance') {
                // Yahoo Finance might block direct requests
                testUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/AAPL';
                options.mode = 'no-cors'; // This will limit response access but prevent CORS errors
            } else if (serviceName === 'corsProxy') {
                // Test CORS proxy with a simple request
                testUrl = 'https://cors-anywhere.herokuapp.com/https://httpbin.org/json';
                options.headers['X-Requested-With'] = 'XMLHttpRequest';
            }
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            options.signal = controller.signal;
            
            const response = await fetch(testUrl, options);
            const endTime = performance.now();
            
            clearTimeout(timeoutId);
            
            const service = this.serviceStatus.get(serviceName);
            service.lastCheck = new Date();
            service.responseTime = endTime - startTime;
            
            if (response.ok || (response.type === 'opaque' && serviceName === 'yahooFinance')) {
                service.status = 'healthy';
                service.successCount++;
            } else {
                service.status = 'degraded';
                service.errorCount++;
            }
            
        } catch (error) {
            const endTime = performance.now();
            
            const service = this.serviceStatus.get(serviceName);
            service.lastCheck = new Date();
            service.responseTime = endTime - startTime;
            service.status = 'unhealthy';
            service.errorCount++;
            service.lastError = error.message;
            
            console.warn(`❌ Service ${serviceName} health check failed:`, error.message);
        }
        
        // Update availability
        const service = this.serviceStatus.get(serviceName);
        const totalChecks = service.successCount + service.errorCount;
        service.availability = totalChecks > 0 ? (service.successCount / totalChecks) * 100 : 0;
    }
    
    generateHealthReport() {
        const report = {
            timestamp: new Date().toISOString(),
            overallHealth: this.calculateOverallHealth(),
            services: Array.from(this.serviceStatus.values()),
            networkStats: { ...this.networkStats },
            recentIssues: this.getRecentIssues()
        };
        
        console.log('📊 Network Health Report:', report);
        
        // Check for critical issues
        const criticalServices = report.services.filter(service => 
            service.status === 'unhealthy' && this.isCriticalService(service.name)
        );
        
        if (criticalServices.length > 0) {
            console.error('🚨 Critical services are down:', criticalServices.map(s => s.name));
        }
        
        return report;
    }
    
    calculateOverallHealth() {
        const services = Array.from(this.serviceStatus.values());
        if (services.length === 0) return 0;
        
        const totalAvailability = services.reduce((sum, service) => sum + service.availability, 0);
        return totalAvailability / services.length;
    }
    
    isCriticalService(serviceName) {
        const criticalServices = ['currencyAPI', 'githubPages'];
        return criticalServices.includes(serviceName);
    }
    
    getRecentIssues(minutes = 30) {
        const cutoff = Date.now() - (minutes * 60000);
        
        return this.requestHistory
            .filter(request => request.timestamp > cutoff && !request.success)
            .map(request => ({
                url: request.url,
                error: request.error,
                errorType: request.errorType,
                timestamp: request.startTime,
                duration: request.duration
            }))
            .slice(-10); // Last 10 issues
    }
    
    // API Testing Methods
    async testCurrencyAPI() {
        const testResults = [];
        
        // Test primary currency API
        try {
            const response = await fetch(this.apiEndpoints.currencyAPI);
            const data = await response.json();
            
            testResults.push({
                service: 'currencyAPI',
                success: response.ok && data.rates,
                responseTime: null, // Would be tracked by fetch interception
                data: data.rates ? Object.keys(data.rates).length + ' currencies' : 'No rates'
            });
        } catch (error) {
            testResults.push({
                service: 'currencyAPI',
                success: false,
                error: error.message
            });
        }
        
        // Test backup currency API
        try {
            const response = await fetch(this.apiEndpoints.currencyAPIBackup);
            const data = await response.json();
            
            testResults.push({
                service: 'currencyAPIBackup',
                success: response.ok && data.rates,
                responseTime: null,
                data: data.rates ? Object.keys(data.rates).length + ' currencies' : 'No rates'
            });
        } catch (error) {
            testResults.push({
                service: 'currencyAPIBackup',
                success: false,
                error: error.message
            });
        }
        
        return testResults;
    }
    
    async testProductionConnectivity() {
        try {
            const response = await fetch(this.apiEndpoints.githubPages, {
                method: 'HEAD', // Just check if it's reachable
                cache: 'no-cache'
            });
            
            return {
                success: response.ok,
                status: response.status,
                statusText: response.statusText,
                responseTime: null // Tracked by interception
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async testCORSProxy() {
        try {
            const testUrl = 'https://cors-anywhere.herokuapp.com/https://httpbin.org/json';
            const response = await fetch(testUrl, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            return {
                success: response.ok,
                status: response.status,
                available: true
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                available: false
            };
        }
    }
    
    // Utility Methods
    getNetworkSummary() {
        return {
            stats: { ...this.networkStats },
            services: Array.from(this.serviceStatus.values()),
            recentRequests: this.requestHistory.slice(-20),
            overallHealth: this.calculateOverallHealth()
        };
    }
    
    getServiceStatus(serviceName) {
        return this.serviceStatus.get(serviceName) || null;
    }
    
    getSlowRequests(threshold = this.options.slowRequestThreshold) {
        return this.requestHistory.filter(request => request.duration > threshold);
    }
    
    getFailedRequests(minutes = 60) {
        const cutoff = Date.now() - (minutes * 60000);
        return this.requestHistory.filter(request => 
            request.timestamp > cutoff && !request.success
        );
    }
    
    exportNetworkReport() {
        return {
            timestamp: new Date().toISOString(),
            summary: this.getNetworkSummary(),
            detailedStats: {
                requestHistory: this.requestHistory,
                serviceStatus: Array.from(this.serviceStatus.entries()),
                performanceMetrics: {
                    averageResponseTime: this.networkStats.averageResponseTime,
                    slowRequestsPercentage: (this.networkStats.slowRequests / this.networkStats.totalRequests) * 100,
                    failureRate: (this.networkStats.failedRequests / this.networkStats.totalRequests) * 100
                }
            },
            configuration: {
                timeoutThreshold: this.options.timeoutThreshold,
                slowRequestThreshold: this.options.slowRequestThreshold,
                monitorInterval: this.options.monitorInterval
            }
        };
    }
    
    clearHistory() {
        this.requestHistory = [];
        this.networkStats = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            averageResponseTime: 0,
            slowRequests: 0,
            timeouts: 0
        };
        
        // Reset service counters but keep current status
        this.serviceStatus.forEach(service => {
            service.successCount = 0;
            service.errorCount = 0;
            service.availability = 0;
        });
        
        console.log('🧹 Network monitoring history cleared');
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.ProductionNetworkMonitor = ProductionNetworkMonitor;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductionNetworkMonitor;
}