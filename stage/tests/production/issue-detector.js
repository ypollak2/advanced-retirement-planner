/**
 * Production Issue Detection & Export System
 * Detects, categorizes, and exports production issues for Claude Code analysis
 */

class ProductionIssueDetector {
    constructor(options = {}) {
        this.options = {
            severityThresholds: {
                critical: {
                    errorRate: 10, // errors per minute
                    responseTime: 8000, // ms
                    failureRate: 0.5, // 50%
                    memoryUsage: 150 // MB
                },
                high: {
                    errorRate: 5,
                    responseTime: 5000,
                    failureRate: 0.2,
                    memoryUsage: 100
                },
                medium: {
                    errorRate: 2,
                    responseTime: 3000,
                    failureRate: 0.1,
                    memoryUsage: 75
                }
            },
            exportFormat: 'claude-code', // Format optimized for Claude Code
            includeStackTraces: true,
            includeContext: true,
            maxIssuesPerCategory: 50,
            ...options
        };
        
        this.detectedIssues = [];
        this.systemMetrics = {};
        this.issueCounts = {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0
        };
        
        this.issueCategories = {
            'console-errors': {
                description: 'JavaScript console errors and exceptions',
                patterns: [/error/i, /exception/i, /uncaught/i],
                priority: 'high'
            },
            'currency-api-failures': {
                description: 'Currency API connection or response issues',
                patterns: [/currency/i, /exchange/i, /getExchangeRates/i],
                priority: 'critical'
            },
            'react-component-errors': {
                description: 'React component rendering or lifecycle errors',
                patterns: [/react/i, /component/i, /render/i, /props/i],
                priority: 'high'
            },
            'network-connectivity': {
                description: 'Network requests, CORS, or API connectivity issues',
                patterns: [/cors/i, /network/i, /fetch/i, /timeout/i],
                priority: 'medium'
            },
            'performance-degradation': {
                description: 'Slow loading times or memory usage issues',
                patterns: [/slow/i, /memory/i, /performance/i, /timeout/i],
                priority: 'medium'
            },
            'service-worker-issues': {
                description: 'Service Worker registration or caching problems',
                patterns: [/service.?worker/i, /sw\.js/i, /cache/i],
                priority: 'low'
            },
            'validation-errors': {
                description: 'Form validation or data integrity issues',
                patterns: [/validation/i, /required/i, /invalid/i],
                priority: 'low'
            },
            'calculation-errors': {
                description: 'Financial calculation errors or NaN/Infinity results',
                patterns: [/calculation/i, /NaN/i, /infinity/i, /math/i],
                priority: 'critical'
            },
            'wizard-flow-issues': {
                description: 'Wizard navigation or step progression problems',
                patterns: [/wizard/i, /step/i, /navigation/i],
                priority: 'high'
            },
            'data-persistence-issues': {
                description: 'LocalStorage or data saving/loading problems',
                patterns: [/localStorage/i, /storage/i, /save/i, /load/i],
                priority: 'medium'
            }
        };
    }
    
    // Main issue detection method
    detectIssues(consoleMonitor, networkMonitor, testResults) {
        console.log('🔍 Starting production issue detection...');
        
        this.detectedIssues = [];
        this.systemMetrics = this.collectSystemMetrics(consoleMonitor, networkMonitor, testResults);
        
        // Detect different types of issues
        this.detectConsoleIssues(consoleMonitor);
        this.detectNetworkIssues(networkMonitor);
        this.detectPerformanceIssues(testResults);
        this.detectServiceIssues(networkMonitor);
        this.detectTestFailures(testResults);
        
        // Categorize and prioritize issues
        this.categorizeIssues();
        this.calculateSeverityLevels();
        
        console.log(`✅ Issue detection complete: ${this.detectedIssues.length} issues found`);
        
        return this.generateClaudeCodeReport();
    }
    
    collectSystemMetrics(consoleMonitor, networkMonitor, testResults) {
        const now = Date.now();
        const oneHourAgo = now - (60 * 60 * 1000);
        
        return {
            timestamp: new Date().toISOString(),
            productionUrl: 'https://ypollak2.github.io/advanced-retirement-planner/',
            systemStatus: {
                overallHealth: this.calculateOverallHealth(consoleMonitor, networkMonitor, testResults),
                uptime: this.calculateUptime(testResults),
                responseTime: this.getAverageResponseTime(networkMonitor),
                errorRate: this.calculateErrorRate(consoleMonitor, oneHourAgo),
                memoryUsage: this.getMemoryUsage(),
                testSuccessRate: this.getTestSuccessRate(testResults)
            },
            browserInfo: {
                userAgent: navigator.userAgent,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                cookiesEnabled: navigator.cookieEnabled,
                onlineStatus: navigator.onLine
            },
            performanceMetrics: this.collectPerformanceMetrics()
        };
    }
    
    detectConsoleIssues(consoleMonitor) {
        if (!consoleMonitor || !consoleMonitor.errors) return;
        
        const recentErrors = consoleMonitor.errors.filter(error => {
            const errorTime = new Date(error.timestamp).getTime();
            const oneHourAgo = Date.now() - (60 * 60 * 1000);
            return errorTime > oneHourAgo;
        });
        
        recentErrors.forEach(error => {
            const issue = {
                id: this.generateIssueId(),
                type: 'console-error',
                category: this.categorizeError(error.message),
                severity: this.assessErrorSeverity(error),
                title: this.generateIssueTitle(error),
                description: error.message,
                details: {
                    errorType: error.type,
                    stack: error.stack,
                    filename: error.filename,
                    line: error.line,
                    column: error.column,
                    timestamp: error.timestamp,
                    sessionTime: error.sessionTime,
                    url: error.url
                },
                context: {
                    userAction: this.inferUserAction(error),
                    componentInvolved: this.identifyComponent(error),
                    reproducible: this.assessReproducibility(error)
                },
                impact: {
                    userExperienceImpact: this.assessUXImpact(error),
                    functionalityAffected: this.identifyAffectedFunctionality(error),
                    businessImpact: this.assessBusinessImpact(error)
                },
                metadata: {
                    detectedAt: new Date().toISOString(),
                    source: 'console-monitor',
                    frequency: this.calculateErrorFrequency(error, recentErrors),
                    relatedErrors: this.findRelatedErrors(error, recentErrors)
                }
            };
            
            this.detectedIssues.push(issue);
        });
    }
    
    detectNetworkIssues(networkMonitor) {
        if (!networkMonitor || !networkMonitor.requestHistory) return;
        
        const recentRequests = networkMonitor.requestHistory.filter(request => {
            const requestTime = new Date(request.timestamp).getTime();
            const oneHourAgo = Date.now() - (60 * 60 * 1000);
            return requestTime > oneHourAgo;
        });
        
        // Detect failed requests
        const failedRequests = recentRequests.filter(request => !request.success);
        
        failedRequests.forEach(request => {
            const issue = {
                id: this.generateIssueId(),
                type: 'network-failure',
                category: 'network-connectivity',
                severity: this.assessNetworkIssueSeverity(request),
                title: `Network request failed: ${this.sanitizeUrl(request.url)}`,
                description: `HTTP request to ${request.url} failed with error: ${request.error}`,
                details: {
                    url: this.sanitizeUrl(request.url),
                    method: request.method,
                    status: request.status,
                    error: request.error,
                    errorType: request.errorType,
                    duration: request.duration,
                    timestamp: request.timestamp
                },
                context: {
                    service: this.identifyService(request.url),
                    critical: this.isServiceCritical(request.url),
                    retryable: this.isRetryableError(request.error)
                },
                impact: {
                    userExperienceImpact: this.assessNetworkUXImpact(request),
                    functionalityAffected: this.identifyNetworkAffectedFunctionality(request),
                    businessImpact: this.assessNetworkBusinessImpact(request)
                },
                metadata: {
                    detectedAt: new Date().toISOString(),
                    source: 'network-monitor',
                    frequency: this.calculateRequestFailureFrequency(request, failedRequests)
                }
            };
            
            this.detectedIssues.push(issue);
        });
        
        // Detect slow requests
        const slowRequests = recentRequests.filter(request => 
            request.success && request.duration > this.options.severityThresholds.medium.responseTime
        );
        
        if (slowRequests.length > 0) {
            const avgSlowTime = slowRequests.reduce((sum, req) => sum + req.duration, 0) / slowRequests.length;
            
            const issue = {
                id: this.generateIssueId(),
                type: 'performance-degradation',
                category: 'performance-degradation',
                severity: avgSlowTime > this.options.severityThresholds.critical.responseTime ? 'critical' : 'medium',
                title: `Slow network requests detected`,
                description: `${slowRequests.length} requests exceeded performance thresholds (avg: ${avgSlowTime.toFixed(0)}ms)`,
                details: {
                    slowRequestCount: slowRequests.length,
                    averageResponseTime: avgSlowTime,
                    slowestRequest: {
                        url: this.sanitizeUrl(slowRequests[0].url),
                        duration: Math.max(...slowRequests.map(r => r.duration))
                    }
                },
                context: {
                    threshold: this.options.severityThresholds.medium.responseTime,
                    timeframe: '1 hour'
                },
                impact: {
                    userExperienceImpact: 'high',
                    functionalityAffected: ['page-loading', 'user-interactions'],
                    businessImpact: 'medium'
                },
                metadata: {
                    detectedAt: new Date().toISOString(),
                    source: 'network-monitor'
                }
            };
            
            this.detectedIssues.push(issue);
        }
    }
    
    detectPerformanceIssues(testResults) {
        if (!testResults || !testResults.performance) return;
        
        const performance = testResults.performance;
        
        // Detect slow page load
        if (performance.loadTime && performance.loadTime > this.options.severityThresholds.medium.responseTime) {
            const severity = performance.loadTime > this.options.severityThresholds.critical.responseTime ? 'critical' : 'medium';
            
            const issue = {
                id: this.generateIssueId(),
                type: 'performance-degradation',
                category: 'performance-degradation',
                severity: severity,
                title: `Page load time exceeds threshold`,
                description: `Page load time of ${performance.loadTime}ms exceeds acceptable threshold`,
                details: {
                    loadTime: performance.loadTime,
                    domContentLoaded: performance.domContentLoaded,
                    threshold: this.options.severityThresholds.medium.responseTime,
                    exceedsThresholdBy: performance.loadTime - this.options.severityThresholds.medium.responseTime
                },
                context: {
                    measurementType: 'navigation-timing',
                    browserPerformanceAPI: 'available'
                },
                impact: {
                    userExperienceImpact: 'high',
                    functionalityAffected: ['initial-page-load', 'user-engagement'],
                    businessImpact: severity === 'critical' ? 'high' : 'medium'
                },
                recommendations: [
                    'Optimize JavaScript bundle size',
                    'Implement lazy loading for non-critical resources',
                    'Review and optimize external API calls',
                    'Consider CDN implementation for static assets'
                ],
                metadata: {
                    detectedAt: new Date().toISOString(),
                    source: 'performance-monitor'
                }
            };
            
            this.detectedIssues.push(issue);
        }
        
        // Detect memory issues
        if (performance.memory && performance.memory.used > this.options.severityThresholds.medium.memoryUsage) {
            const severity = performance.memory.used > this.options.severityThresholds.critical.memoryUsage ? 'critical' : 'medium';
            
            const issue = {
                id: this.generateIssueId(),
                type: 'memory-issue',
                category: 'performance-degradation',
                severity: severity,
                title: `High memory usage detected`,
                description: `Memory usage of ${performance.memory.used}MB exceeds threshold`,
                details: {
                    usedMemory: performance.memory.used,
                    totalMemory: performance.memory.total,
                    memoryLimit: performance.memory.limit,
                    threshold: this.options.severityThresholds.medium.memoryUsage,
                    utilizationPercentage: ((performance.memory.used / performance.memory.total) * 100).toFixed(1)
                },
                context: {
                    browserSupport: 'performance.memory API available',
                    potentialCauses: ['memory leaks', 'large object retention', 'excessive DOM nodes']
                },
                impact: {
                    userExperienceImpact: 'medium',
                    functionalityAffected: ['app-responsiveness', 'browser-stability'],
                    businessImpact: 'low'
                },
                recommendations: [
                    'Profile memory usage with browser dev tools',
                    'Check for event listener cleanup',
                    'Review global variable usage',
                    'Implement proper component lifecycle management'
                ],
                metadata: {
                    detectedAt: new Date().toISOString(),
                    source: 'performance-monitor'
                }
            };
            
            this.detectedIssues.push(issue);
        }
    }
    
    detectServiceIssues(networkMonitor) {
        if (!networkMonitor || !networkMonitor.serviceStatus) return;
        
        networkMonitor.serviceStatus.forEach((service, serviceName) => {
            if (service.status === 'unhealthy' || service.availability < 90) {
                const severity = service.availability < 50 ? 'critical' : 'high';
                
                const issue = {
                    id: this.generateIssueId(),
                    type: 'service-unavailable',
                    category: this.mapServiceToCategory(serviceName),
                    severity: severity,
                    title: `Service unavailable: ${serviceName}`,
                    description: `Service ${serviceName} is ${service.status} with ${service.availability.toFixed(1)}% availability`,
                    details: {
                        serviceName: serviceName,
                        serviceUrl: service.url,
                        status: service.status,
                        availability: service.availability,
                        lastCheck: service.lastCheck,
                        responseTime: service.responseTime,
                        errorCount: service.errorCount,
                        successCount: service.successCount,
                        lastError: service.lastError
                    },
                    context: {
                        critical: this.isServiceCritical(serviceName),
                        hasBackup: this.hasServiceBackup(serviceName),
                        dependencies: this.getServiceDependencies(serviceName)
                    },
                    impact: {
                        userExperienceImpact: this.assessServiceUXImpact(serviceName),
                        functionalityAffected: this.identifyServiceAffectedFunctionality(serviceName),
                        businessImpact: this.assessServiceBusinessImpact(serviceName)
                    },
                    recommendations: this.getServiceRecommendations(serviceName, service),
                    metadata: {
                        detectedAt: new Date().toISOString(),
                        source: 'service-monitor'
                    }
                };
                
                this.detectedIssues.push(issue);
            }
        });
    }
    
    detectTestFailures(testResults) {
        if (!testResults || !testResults.errors) return;
        
        testResults.errors.forEach(error => {
            if (error.test) { // This is a test failure
                const issue = {
                    id: this.generateIssueId(),
                    type: 'test-failure',
                    category: this.categorizeTestFailure(error.test),
                    severity: this.assessTestFailureSeverity(error.test),
                    title: `Test failure: ${error.test}`,
                    description: `E2E test "${error.test}" failed with error: ${error.error}`,
                    details: {
                        testName: error.test,
                        error: error.error,
                        duration: error.duration,
                        timestamp: error.timestamp,
                        browser: error.browser || 'unknown'
                    },
                    context: {
                        testCategory: this.identifyTestCategory(error.test),
                        reproducible: true,
                        automated: true
                    },
                    impact: {
                        userExperienceImpact: this.assessTestFailureUXImpact(error.test),
                        functionalityAffected: this.identifyTestAffectedFunctionality(error.test),
                        businessImpact: this.assessTestFailureBusinessImpact(error.test)
                    },
                    recommendations: this.getTestFailureRecommendations(error.test, error.error),
                    metadata: {
                        detectedAt: new Date().toISOString(),
                        source: 'test-runner'
                    }
                };
                
                this.detectedIssues.push(issue);
            }
        });
    }
    
    categorizeIssues() {
        this.detectedIssues.forEach(issue => {
            // Enhanced categorization based on patterns
            for (const [categoryName, categoryInfo] of Object.entries(this.issueCategories)) {
                const matchesPattern = categoryInfo.patterns.some(pattern => 
                    pattern.test(issue.description) || pattern.test(issue.title)
                );
                
                if (matchesPattern) {
                    issue.enhancedCategory = {
                        name: categoryName,
                        description: categoryInfo.description,
                        suggestedPriority: categoryInfo.priority
                    };
                    break;
                }
            }
            
            // If no pattern matches, use existing category
            if (!issue.enhancedCategory) {
                issue.enhancedCategory = {
                    name: issue.category || 'unknown',
                    description: 'Uncategorized issue',
                    suggestedPriority: 'medium'
                };
            }
        });
    }
    
    calculateSeverityLevels() {
        this.detectedIssues.forEach(issue => {
            // Count issues by severity
            if (this.issueCounts[issue.severity] !== undefined) {
                this.issueCounts[issue.severity]++;
            }
            
            // Add severity explanation
            issue.severityInfo = this.getSeverityExplanation(issue.severity);
        });
    }
    
    generateClaudeCodeReport() {
        const report = {
            metadata: {
                generatedAt: new Date().toISOString(),
                generatedBy: 'ProductionIssueDetector v1.0.0',
                productionUrl: this.systemMetrics.productionUrl,
                reportFormat: 'claude-code-optimized',
                version: '1.0.0'
            },
            
            summary: {
                totalIssues: this.detectedIssues.length,
                issueCounts: { ...this.issueCounts },
                overallHealthScore: this.calculateOverallHealthScore(),
                urgentActionRequired: this.issueCounts.critical > 0,
                recommendedActions: this.generateRecommendedActions()
            },
            
            systemMetrics: this.systemMetrics,
            
            issues: this.detectedIssues.map(issue => this.formatIssueForClaudeCode(issue)),
            
            insights: {
                patterns: this.analyzeIssuePatterns(),
                trends: this.analyzeTrends(),
                rootCauses: this.identifyRootCauses(),
                prioritizedActions: this.prioritizeActions()
            },
            
            claudeCodeInstructions: {
                analysisGuidance: [
                    "Focus on critical and high severity issues first",
                    "Look for patterns across multiple issues that might indicate a common root cause",
                    "Consider the impact on user experience and business functionality",
                    "Prioritize fixes that resolve multiple issues simultaneously"
                ],
                suggestedAnalysisFlow: [
                    "1. Review summary for urgent issues requiring immediate attention",
                    "2. Analyze critical issues for system stability threats",
                    "3. Group related issues by category for efficient resolution",
                    "4. Review recommendations and implement fixes systematically",
                    "5. Monitor system metrics for improvement verification"
                ],
                contextualHints: {
                    productionEnvironment: "GitHub Pages deployment with Service Worker",
                    primaryUsers: "Financial planning application users",
                    criticalFunctionality: ["currency conversion", "financial calculations", "data persistence"],
                    businessImpact: "High - affects user financial planning accuracy"
                }
            }
        };
        
        return report;
    }
    
    formatIssueForClaudeCode(issue) {
        return {
            id: issue.id,
            title: issue.title,
            severity: issue.severity,
            category: issue.enhancedCategory.name,
            description: issue.description,
            
            // Structured details for easy parsing
            technicalDetails: {
                type: issue.type,
                source: issue.metadata.source,
                timestamp: issue.details.timestamp || issue.metadata.detectedAt,
                ...this.extractTechnicalDetails(issue)
            },
            
            // Impact assessment for prioritization
            impact: {
                user: issue.impact?.userExperienceImpact || 'unknown',
                functionality: issue.impact?.functionalityAffected || [],
                business: issue.impact?.businessImpact || 'unknown'
            },
            
            // Context for debugging
            context: {
                ...issue.context,
                reproducible: issue.context?.reproducible || false,
                frequency: issue.metadata?.frequency || 'unknown'
            },
            
            // Actionable recommendations
            recommendations: issue.recommendations || this.generateGenericRecommendations(issue),
            
            // Additional metadata for Claude Code
            claudeCodeMetadata: {
                analysisComplexity: this.assessAnalysisComplexity(issue),
                debuggingHints: this.generateDebuggingHints(issue),
                relatedFiles: this.identifyRelatedFiles(issue),
                testingStrategy: this.suggestTestingStrategy(issue)
            }
        };
    }
    
    // Export methods
    exportToFile(filename = null) {
        const report = this.generateClaudeCodeReport();
        const timestamp = new Date().toISOString().split('T')[0];
        const defaultFilename = `production-issues-${timestamp}.json`;
        const finalFilename = filename || defaultFilename;
        
        try {
            const reportString = JSON.stringify(report, null, 2);
            
            // For browser environment
            if (typeof window !== 'undefined') {
                this.downloadInBrowser(reportString, finalFilename);
            } 
            // For Node.js environment
            else if (typeof require !== 'undefined') {
                const fs = require('fs');
                const path = require('path');
                const fullPath = path.resolve(finalFilename);
                fs.writeFileSync(fullPath, reportString);
                console.log(`✅ Issues exported to: ${fullPath}`);
            }
            
            return {
                success: true,
                filename: finalFilename,
                issueCount: this.detectedIssues.length,
                filePath: finalFilename
            };
            
        } catch (error) {
            console.error('❌ Failed to export issues:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    downloadInBrowser(content, filename) {
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log(`✅ Issues exported to download: ${filename}`);
    }
    
    // Utility methods for issue analysis
    generateIssueId() {
        return `issue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    sanitizeUrl(url) {
        try {
            const urlObj = new URL(url);
            // Remove sensitive query parameters
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
    
    calculateOverallHealthScore() {
        const totalIssues = this.detectedIssues.length;
        if (totalIssues === 0) return 100;
        
        const weightedScore = (
            (this.issueCounts.critical * 10) +
            (this.issueCounts.high * 5) +
            (this.issueCounts.medium * 2) +
            (this.issueCounts.low * 1)
        );
        
        const maxPossibleScore = totalIssues * 10;
        const healthScore = Math.max(0, 100 - ((weightedScore / maxPossibleScore) * 100));
        
        return Math.round(healthScore);
    }
    
    generateRecommendedActions() {
        const actions = [];
        
        if (this.issueCounts.critical > 0) {
            actions.push({
                priority: 'immediate',
                action: `Address ${this.issueCounts.critical} critical issue(s) immediately`,
                impact: 'system-stability'
            });
        }
        
        if (this.issueCounts.high > 3) {
            actions.push({
                priority: 'urgent',
                action: `Investigate pattern of ${this.issueCounts.high} high-severity issues`,
                impact: 'user-experience'
            });
        }
        
        if (this.detectedIssues.some(issue => issue.category === 'currency-api-failures')) {
            actions.push({
                priority: 'high',
                action: 'Verify currency API connectivity and implement fallback',
                impact: 'core-functionality'
            });
        }
        
        return actions;
    }
    
    analyzeIssuePatterns() {
        const patterns = {};
        
        // Group by category
        this.detectedIssues.forEach(issue => {
            const category = issue.enhancedCategory.name;
            if (!patterns[category]) {
                patterns[category] = [];
            }
            patterns[category].push(issue);
        });
        
        // Identify frequent patterns
        const frequentPatterns = Object.entries(patterns)
            .filter(([category, issues]) => issues.length > 1)
            .map(([category, issues]) => ({
                category,
                count: issues.length,
                commonality: this.findCommonalities(issues)
            }));
        
        return frequentPatterns;
    }
    
    findCommonalities(issues) {
        // Find common elements across issues
        const commonalities = {};
        
        issues.forEach(issue => {
            // Common error messages
            if (issue.description) {
                const words = issue.description.toLowerCase().split(/\s+/);
                words.forEach(word => {
                    if (word.length > 3) { // Skip short words
                        commonalities[word] = (commonalities[word] || 0) + 1;
                    }
                });
            }
        });
        
        // Return most common terms
        return Object.entries(commonalities)
            .filter(([word, count]) => count > 1)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([word, count]) => ({ term: word, frequency: count }));
    }
    
    // Additional helper methods would be implemented here...
    // (Abbreviated for space - would include methods for severity assessment,
    // category mapping, impact analysis, etc.)
    
    assessErrorSeverity(error) {
        const message = (error.message || '').toLowerCase();
        
        if (message.includes('is not defined') || 
            message.includes('cannot read property') ||
            message.includes('script error')) {
            return 'critical';
        }
        
        if (message.includes('react') || 
            message.includes('component') ||
            message.includes('currency')) {
            return 'high';
        }
        
        return 'medium';
    }
    
    categorizeError(message) {
        const msg = message.toLowerCase();
        
        if (msg.includes('currency') || msg.includes('exchange')) return 'currency-api-failures';
        if (msg.includes('react') || msg.includes('component')) return 'react-component-errors';
        if (msg.includes('network') || msg.includes('fetch')) return 'network-connectivity';
        if (msg.includes('calculation') || msg.includes('nan')) return 'calculation-errors';
        if (msg.includes('wizard') || msg.includes('step')) return 'wizard-flow-issues';
        
        return 'console-errors';
    }
    
    getSeverityExplanation(severity) {
        const explanations = {
            critical: 'Immediate action required - system stability at risk',
            high: 'Urgent attention needed - significant impact on functionality',
            medium: 'Should be addressed soon - affects user experience',
            low: 'Monitor and address when convenient - minor impact'
        };
        
        return explanations[severity] || 'Unknown severity level';
    }
    
    generateGenericRecommendations(issue) {
        const recommendations = [];
        
        switch (issue.type) {
            case 'console-error':
                recommendations.push('Check browser console for detailed error information');
                recommendations.push('Review recent code changes for potential causes');
                break;
            case 'network-failure':
                recommendations.push('Verify API endpoint availability');
                recommendations.push('Check network connectivity and CORS configuration');
                break;
            case 'performance-degradation':
                recommendations.push('Profile application performance using browser dev tools');
                recommendations.push('Review resource loading and optimization strategies');
                break;
            default:
                recommendations.push('Investigate issue details and context');
                recommendations.push('Check related system components');
        }
        
        return recommendations;
    }
}

// Make available globally and for module systems
if (typeof window !== 'undefined') {
    window.ProductionIssueDetector = ProductionIssueDetector;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductionIssueDetector;
}