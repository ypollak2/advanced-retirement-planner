#!/usr/bin/env node

/**
 * Export Production Issues for Claude Code
 * Standalone CLI tool to detect and export production issues in Claude Code format
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class ProductionIssueExporter {
    constructor() {
        this.productionUrl = 'https://ypollak2.github.io/advanced-retirement-planner/';
        this.outputDir = './production-issues';
        this.issues = [];
        this.consoleLogs = [];
        this.networkRequests = [];
        this.performanceMetrics = {};
    }
    
    async exportIssues() {
        console.log('🚀 Starting Production Issue Export for Claude Code...\n');
        console.log(`🎯 Target: ${this.productionUrl}\n`);
        
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            viewport: { width: 1280, height: 720 }
        });
        
        try {
            await this.collectProductionData(context);
            await this.analyzeIssues();
            const exportResult = await this.exportForClaudeCode();
            
            console.log('\n' + '='.repeat(60));
            console.log('📊 PRODUCTION ISSUE EXPORT COMPLETE');
            console.log('='.repeat(60));
            console.log(`📁 Output File: ${exportResult.filename}`);
            console.log(`📊 Issues Found: ${exportResult.totalIssues}`);
            console.log(`🚨 Critical: ${exportResult.critical}`);
            console.log(`⚠️ High: ${exportResult.high}`);
            console.log(`📝 Medium: ${exportResult.medium}`);
            console.log(`ℹ️ Low: ${exportResult.low}`);
            console.log(`💯 Health Score: ${exportResult.healthScore}/100`);
            console.log('='.repeat(60));
            
            if (exportResult.critical > 0) {
                console.log('\n🚨 CRITICAL ISSUES DETECTED - Immediate action required!');
                process.exit(1);
            } else if (exportResult.high > 0) {
                console.log('\n⚠️ High priority issues found - Review recommended');
                process.exit(0);
            } else {
                console.log('\n✅ Production environment appears healthy');
                process.exit(0);
            }
            
        } finally {
            await browser.close();
        }
    }
    
    async collectProductionData(context) {
        const page = await context.newPage();
        
        console.log('📡 Collecting production data...');
        
        // Capture console logs
        page.on('console', msg => {
            this.consoleLogs.push({
                type: msg.type(),
                text: msg.text(),
                timestamp: new Date(),
                url: page.url()
            });
        });
        
        // Capture JavaScript errors
        page.on('pageerror', err => {
            this.issues.push({
                type: 'javascript-error',
                severity: 'high',
                title: 'JavaScript Runtime Error',
                description: err.message,
                details: {
                    message: err.message,
                    stack: err.stack,
                    timestamp: new Date(),
                    url: page.url()
                },
                source: 'page-error'
            });
        });
        
        // Capture network requests
        page.on('response', response => {
            this.networkRequests.push({
                url: response.url(),
                status: response.status(),
                statusText: response.statusText(),
                timestamp: new Date(),
                success: response.ok()
            });
        });
        
        // Navigate to production site
        console.log('🌐 Loading production site...');
        const response = await page.goto(this.productionUrl, {
            waitUntil: 'networkidle',
            timeout: 30000
        });
        
        if (!response.ok()) {
            this.issues.push({
                type: 'site-unavailable',
                severity: 'critical',
                title: 'Production Site Unavailable',
                description: `Site returned HTTP ${response.status()} ${response.statusText()}`,
                details: {
                    status: response.status(),
                    statusText: response.statusText(),
                    url: this.productionUrl,
                    timestamp: new Date()
                },
                source: 'site-check'
            });
        }
        
        // Wait for page to stabilize and app to initialize
        console.log('⏳ Waiting for app initialization...');
        await page.waitForTimeout(8000);
        
        // Collect performance metrics
        console.log('⚡ Collecting performance metrics...');
        this.performanceMetrics = await page.evaluate(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            const memData = performance.memory;
            
            return {
                loadTime: perfData ? perfData.loadEventEnd - perfData.navigationStart : null,
                domContentLoaded: perfData ? perfData.domContentLoadedEventEnd - perfData.navigationStart : null,
                firstContentfulPaint: null, // Would need additional setup
                memory: memData ? {
                    used: Math.round(memData.usedJSHeapSize / 1024 / 1024),
                    total: Math.round(memData.totalJSHeapSize / 1024 / 1024),
                    limit: Math.round(memData.jsHeapSizeLimit / 1024 / 1024)
                } : null,
                timestamp: new Date().toISOString()
            };
        });
        
        // Test key functionality
        console.log('🧪 Testing key functionality...');
        await this.testKeyFunctionality(page);
        
        console.log('✅ Data collection complete');
    }
    
    async testKeyFunctionality(page) {
        // Test if main components are present
        const components = await page.evaluate(() => {
            const tests = [];
            
            // Check for key elements
            const elements = {
                'Main App Container': '#root, [id*="app"], [class*="app"], main, #main',
                'Wizard Elements': '.wizard, [class*="wizard"], [id*="wizard"]',
                'Form Elements': 'input, select, textarea',
                'Button Elements': 'button, .btn, [role="button"]',
                'Currency Elements': '[id*="currency"], [name*="currency"], .currency, [class*="currency"], select[name*="Currency"]'
            };
            
            for (const [name, selector] of Object.entries(elements)) {
                try {
                    const element = document.querySelector(selector);
                    tests.push({
                        name,
                        found: !!element,
                        count: document.querySelectorAll(selector).length
                    });
                } catch (e) {
                    tests.push({
                        name,
                        found: false,
                        error: e.message
                    });
                }
            }
            
            return tests;
        });
        
        // Analyze component test results
        components.forEach(test => {
            if (!test.found) {
                this.issues.push({
                    type: 'component-missing',
                    severity: test.name.includes('Main App') ? 'critical' : 
                         test.name.includes('Currency') || test.name.includes('Wizard') ? 'low' : 'medium',
                    title: `Missing Component: ${test.name}`,
                    description: `Key UI component "${test.name}" not found on page`,
                    details: {
                        componentName: test.name,
                        error: test.error,
                        timestamp: new Date()
                    },
                    source: 'component-test'
                });
            }
        });
        
        // Test Service Worker
        const serviceWorkerStatus = await page.evaluate(async () => {
            if ('serviceWorker' in navigator) {
                try {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    return {
                        supported: true,
                        registered: registrations.length > 0,
                        count: registrations.length
                    };
                } catch (error) {
                    return {
                        supported: true,
                        registered: false,
                        error: error.message
                    };
                }
            }
            return { supported: false };
        });
        
        if (serviceWorkerStatus.supported && !serviceWorkerStatus.registered) {
            this.issues.push({
                type: 'service-worker-issue',
                severity: 'low',
                title: 'Service Worker Not Registered',
                description: 'Service Worker is supported but not registered',
                details: serviceWorkerStatus,
                source: 'service-worker-test'
            });
        }
    }
    
    async analyzeIssues() {
        console.log('🔍 Analyzing collected data...');
        
        // Analyze console logs for errors
        const errorLogs = this.consoleLogs.filter(log => log.type === 'error');
        errorLogs.forEach(log => {
            this.issues.push({
                type: 'console-error',
                severity: this.categorizeConsoleError(log.text),
                title: 'Console Error Detected',
                description: log.text,
                details: {
                    message: log.text,
                    timestamp: log.timestamp,
                    url: log.url
                },
                source: 'console-monitor'
            });
        });
        
        // Analyze network requests for failures
        const failedRequests = this.networkRequests.filter(req => !req.success);
        failedRequests.forEach(req => {
            const severity = this.categorizeNetworkError(req);
            // Skip CDN redirects as they're normal behavior
            if (severity !== null) {
                this.issues.push({
                    type: 'network-failure',
                    severity: severity,
                    title: `Network Request Failed: ${this.getServiceName(req.url)}`,
                    description: `HTTP ${req.status} ${req.statusText} for ${req.url}`,
                    details: {
                        url: req.url,
                        status: req.status,
                        statusText: req.statusText,
                        timestamp: req.timestamp
                    },
                    source: 'network-monitor'
                });
            }
        });
        
        // Analyze performance metrics
        if (this.performanceMetrics.loadTime > 5000) {
            this.issues.push({
                type: 'performance-issue',
                severity: this.performanceMetrics.loadTime > 10000 ? 'high' : 'medium',
                title: 'Slow Page Load Time',
                description: `Page load time of ${this.performanceMetrics.loadTime}ms exceeds threshold`,
                details: this.performanceMetrics,
                source: 'performance-monitor'
            });
        }
        
        if (this.performanceMetrics.memory && this.performanceMetrics.memory.used > 100) {
            this.issues.push({
                type: 'memory-issue',
                severity: this.performanceMetrics.memory.used > 200 ? 'high' : 'medium',
                title: 'High Memory Usage',
                description: `Memory usage of ${this.performanceMetrics.memory.used}MB is elevated`,
                details: this.performanceMetrics.memory,
                source: 'performance-monitor'
            });
        }
        
        console.log(`✅ Analysis complete - ${this.issues.length} issues identified`);
    }
    
    async exportForClaudeCode() {
        // Ensure output directory exists
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
        
        // Calculate issue counts by severity
        const issueCounts = {
            critical: this.issues.filter(i => i.severity === 'critical').length,
            high: this.issues.filter(i => i.severity === 'high').length,
            medium: this.issues.filter(i => i.severity === 'medium').length,
            low: this.issues.filter(i => i.severity === 'low').length
        };
        
        // Calculate health score
        const totalIssues = this.issues.length;
        const weightedScore = (
            (issueCounts.critical * 10) +
            (issueCounts.high * 5) +
            (issueCounts.medium * 2) +
            (issueCounts.low * 1)
        );
        const maxPossibleScore = totalIssues * 10;
        const healthScore = totalIssues === 0 ? 100 : Math.max(0, 100 - ((weightedScore / maxPossibleScore) * 100));
        
        // Generate Claude Code optimized report
        const report = {
            metadata: {
                generatedAt: new Date().toISOString(),
                generatedBy: 'ProductionIssueExporter v1.0.0',
                productionUrl: this.productionUrl,
                reportFormat: 'claude-code-optimized',
                exportTool: 'CLI',
                dataCollectionMethod: 'playwright-automation'
            },
            
            summary: {
                totalIssues: totalIssues,
                issueCounts: issueCounts,
                overallHealthScore: Math.round(healthScore),
                urgentActionRequired: issueCounts.critical > 0,
                dataPoints: {
                    consoleLogs: this.consoleLogs.length,
                    networkRequests: this.networkRequests.length,
                    performanceMetrics: Object.keys(this.performanceMetrics).length,
                    testDuration: 'automated-collection'
                }
            },
            
            systemMetrics: {
                timestamp: new Date().toISOString(),
                productionUrl: this.productionUrl,
                performance: this.performanceMetrics,
                networkSummary: {
                    totalRequests: this.networkRequests.length,
                    failedRequests: this.networkRequests.filter(r => !r.success).length,
                    successRate: this.networkRequests.length > 0 
                        ? ((this.networkRequests.filter(r => r.success).length / this.networkRequests.length) * 100).toFixed(1) + '%'
                        : '100%'
                },
                consoleSummary: {
                    totalLogs: this.consoleLogs.length,
                    errorLogs: this.consoleLogs.filter(l => l.type === 'error').length,
                    warningLogs: this.consoleLogs.filter(l => l.type === 'warn').length
                }
            },
            
            issues: this.issues.map(issue => ({
                id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
                title: issue.title,
                severity: issue.severity,
                category: this.categorizeIssue(issue),
                description: issue.description,
                
                technicalDetails: {
                    type: issue.type,
                    source: issue.source,
                    timestamp: issue.details?.timestamp || new Date().toISOString(),
                    ...this.extractTechnicalDetails(issue)
                },
                
                impact: {
                    user: this.assessUserImpact(issue),
                    functionality: this.identifyAffectedFunctionality(issue),
                    business: this.assessBusinessImpact(issue)
                },
                
                context: {
                    reproducible: true,
                    automated: true,
                    environment: 'production'
                },
                
                recommendations: this.generateRecommendations(issue),
                
                claudeCodeMetadata: {
                    analysisComplexity: this.assessComplexity(issue),
                    debuggingHints: this.generateDebuggingHints(issue),
                    relatedFiles: this.identifyRelatedFiles(issue),
                    testingStrategy: this.suggestTestingStrategy(issue)
                }
            })),
            
            insights: {
                patterns: this.analyzePatterns(),
                recommendations: this.generateOverallRecommendations(),
                prioritizedActions: this.prioritizeActions(issueCounts)
            },
            
            claudeCodeInstructions: {
                analysisGuidance: [
                    "Review summary section first for critical issues requiring immediate attention",
                    "Focus on issues with 'critical' or 'high' severity levels",
                    "Look for patterns in issue categories that might indicate systemic problems",
                    "Use the recommendations section for actionable next steps",
                    "Review system metrics to understand overall production health"
                ],
                suggestedWorkflow: [
                    "1. Address any critical issues immediately (system stability risk)",
                    "2. Investigate high-severity issues (significant functionality impact)",
                    "3. Group related issues by category for efficient resolution",
                    "4. Implement monitoring for recurring issue patterns",
                    "5. Use debugging hints and testing strategies for systematic fixes"
                ],
                contextualInfo: {
                    deploymentPlatform: "GitHub Pages",
                    applicationFramework: "Vanilla JavaScript with React createElement",
                    externalDependencies: ["Currency APIs", "Yahoo Finance", "Service Worker"],
                    criticalFunctionality: ["Financial calculations", "Currency conversion", "Data persistence"],
                    userBase: "Financial planning application users"
                }
            }
        };
        
        // Save report
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `production-issues-${timestamp}.json`;
        const filepath = path.join(this.outputDir, filename);
        
        fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
        
        return {
            filename: filepath,
            totalIssues: totalIssues,
            critical: issueCounts.critical,
            high: issueCounts.high,
            medium: issueCounts.medium,
            low: issueCounts.low,
            healthScore: Math.round(healthScore)
        };
    }
    
    // Helper methods for issue analysis
    categorizeConsoleError(message) {
        const msg = message.toLowerCase();
        if (msg.includes('is not defined') || msg.includes('cannot read property')) return 'critical';
        if (msg.includes('react') || msg.includes('component')) return 'high';
        if (msg.includes('warning')) return 'low';
        return 'medium';
    }
    
    categorizeNetworkError(request) {
        // 302 redirects are normal for CDNs
        if (request.status === 302 && (request.url.includes('unpkg.com') || request.url.includes('cdn.jsdelivr.net'))) {
            return null; // Skip this as it's normal CDN behavior
        }
        if (request.status >= 500) return 'high';
        if (request.status >= 400) return 'medium';
        return 'low';
    }
    
    getServiceName(url) {
        if (url.includes('exchangerate-api.com')) return 'Currency API';
        if (url.includes('finance.yahoo.com')) return 'Yahoo Finance';
        if (url.includes('advanced-retirement-planner')) return 'Production App';
        return 'External Service';
    }
    
    categorizeIssue(issue) {
        if (issue.type.includes('currency') || issue.description.toLowerCase().includes('currency')) return 'currency-api';
        if (issue.type.includes('network')) return 'network-connectivity';
        if (issue.type.includes('performance')) return 'performance';
        if (issue.type.includes('javascript') || issue.type.includes('console')) return 'javascript-errors';
        if (issue.type.includes('component')) return 'ui-components';
        return 'general';
    }
    
    assessUserImpact(issue) {
        if (issue.severity === 'critical') return 'high';
        if (issue.severity === 'high') return 'medium';
        return 'low';
    }
    
    identifyAffectedFunctionality(issue) {
        const functionality = [];
        const desc = issue.description.toLowerCase();
        
        if (desc.includes('currency')) functionality.push('currency-conversion');
        if (desc.includes('calculation')) functionality.push('financial-calculations');
        if (desc.includes('wizard')) functionality.push('user-workflow');
        if (desc.includes('network') || desc.includes('api')) functionality.push('external-services');
        if (desc.includes('component') || desc.includes('render')) functionality.push('ui-rendering');
        
        return functionality.length > 0 ? functionality : ['general'];
    }
    
    assessBusinessImpact(issue) {
        if (issue.severity === 'critical') return 'high';
        if (issue.type.includes('currency') || issue.type.includes('calculation')) return 'high';
        if (issue.severity === 'high') return 'medium';
        return 'low';
    }
    
    generateRecommendations(issue) {
        const recommendations = [];
        
        switch (issue.type) {
            case 'javascript-error':
                recommendations.push('Check browser console for detailed stack trace');
                recommendations.push('Review recent code changes');
                recommendations.push('Test in multiple browsers');
                break;
            case 'network-failure':
                recommendations.push('Verify API endpoint availability');
                recommendations.push('Check CORS configuration');
                recommendations.push('Implement retry logic with exponential backoff');
                break;
            case 'performance-issue':
                recommendations.push('Use browser dev tools for performance profiling');
                recommendations.push('Optimize resource loading');
                recommendations.push('Consider implementing lazy loading');
                break;
            case 'component-missing':
                recommendations.push('Verify component loading order');
                recommendations.push('Check for JavaScript errors preventing rendering');
                recommendations.push('Validate HTML structure');
                break;
            default:
                recommendations.push('Investigate issue context and environment');
                recommendations.push('Check related system components');
        }
        
        return recommendations;
    }
    
    assessComplexity(issue) {
        if (issue.severity === 'critical') return 'high';
        if (issue.type.includes('network') || issue.type.includes('performance')) return 'medium';
        return 'low';
    }
    
    generateDebuggingHints(issue) {
        const hints = [];
        
        if (issue.source === 'console-monitor') {
            hints.push('Open browser dev tools console');
            hints.push('Look for additional error context');
        }
        
        if (issue.type.includes('network')) {
            hints.push('Check Network tab in browser dev tools');
            hints.push('Verify API endpoint responses');
        }
        
        if (issue.type.includes('performance')) {
            hints.push('Use Performance tab for detailed analysis');
            hints.push('Check for memory leaks');
        }
        
        return hints;
    }
    
    identifyRelatedFiles(issue) {
        const files = [];
        
        if (issue.description.includes('currency')) {
            files.push('src/utils/currencyAPI.js', 'src/components/CurrencySelector.js');
        }
        
        if (issue.description.includes('calculation')) {
            files.push('src/utils/retirementCalculations.js', 'src/utils/financialHealthEngine.js');
        }
        
        if (issue.description.includes('wizard')) {
            files.push('src/components/WizardStep*.js', 'src/utils/wizardNavigation.js');
        }
        
        return files.length > 0 ? files : ['index.html', 'src/main.js'];
    }
    
    suggestTestingStrategy(issue) {
        const strategies = [];
        
        switch (issue.severity) {
            case 'critical':
                strategies.push('Immediate manual testing required');
                strategies.push('Add automated regression test');
                break;
            case 'high':
                strategies.push('Manual testing recommended');
                strategies.push('Add to automated test suite');
                break;
            default:
                strategies.push('Include in next testing cycle');
                strategies.push('Monitor for recurrence');
        }
        
        return strategies;
    }
    
    analyzePatterns() {
        const patterns = {};
        
        this.issues.forEach(issue => {
            const category = this.categorizeIssue(issue);
            if (!patterns[category]) patterns[category] = 0;
            patterns[category]++;
        });
        
        return Object.entries(patterns)
            .map(([category, count]) => ({ category, count }))
            .sort((a, b) => b.count - a.count);
    }
    
    generateOverallRecommendations() {
        const recommendations = [];
        
        const criticalCount = this.issues.filter(i => i.severity === 'critical').length;
        const highCount = this.issues.filter(i => i.severity === 'high').length;
        
        if (criticalCount > 0) {
            recommendations.push({
                priority: 'immediate',
                action: `Address ${criticalCount} critical issue(s) immediately`,
                reason: 'Critical issues pose significant risk to system stability'
            });
        }
        
        if (highCount > 2) {
            recommendations.push({
                priority: 'urgent',
                action: `Investigate pattern of ${highCount} high-severity issues`,
                reason: 'Multiple high-severity issues may indicate systemic problems'
            });
        }
        
        const networkIssues = this.issues.filter(i => i.type.includes('network')).length;
        if (networkIssues > 0) {
            recommendations.push({
                priority: 'high',
                action: 'Review external API reliability and implement fallbacks',
                reason: 'Network issues can significantly impact user experience'
            });
        }
        
        return recommendations;
    }
    
    prioritizeActions(issueCounts) {
        const actions = [];
        
        if (issueCounts.critical > 0) {
            actions.push({ priority: 1, action: 'Fix all critical issues', timeframe: 'immediately' });
        }
        
        if (issueCounts.high > 0) {
            actions.push({ priority: 2, action: 'Address high-severity issues', timeframe: 'within 24 hours' });
        }
        
        if (issueCounts.medium > 3) {
            actions.push({ priority: 3, action: 'Review medium-severity issue patterns', timeframe: 'within 1 week' });
        }
        
        return actions;
    }
    
    extractTechnicalDetails(issue) {
        const details = {};
        
        if (issue.details) {
            if (issue.details.status) details.httpStatus = issue.details.status;
            if (issue.details.message) details.errorMessage = issue.details.message;
            if (issue.details.url) details.sourceUrl = issue.details.url;
            if (issue.details.stack) details.stackTrace = issue.details.stack;
        }
        
        return details;
    }
}

// Run if called directly
if (require.main === module) {
    const exporter = new ProductionIssueExporter();
    exporter.exportIssues().catch(error => {
        console.error('❌ Export failed:', error);
        process.exit(1);
    });
}

module.exports = ProductionIssueExporter;