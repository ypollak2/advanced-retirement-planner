// Test Logger and Reporter for Financial Health E2E Testing
// Captures comprehensive test execution data with export functionality

class TestLogger {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = new Date();
        this.logs = [];
        this.testResults = [];
        this.errorStack = [];
        this.performanceMetrics = {};
        this.fieldMappingIssues = [];
        this.scoreValidationIssues = [];
        this.debugMode = window.location.search.includes('debug=true');
        
        // Initialize performance tracking
        this.initializePerformanceTracking();
    }

    // Generate unique session ID
    generateSessionId() {
        return `E2E_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Initialize performance tracking
    initializePerformanceTracking() {
        this.performanceMetrics = {
            testStartTime: Date.now(),
            testEndTime: null,
            totalDuration: 0,
            scenarioMetrics: {},
            wizardStepMetrics: {},
            apiCallMetrics: []
        };
    }

    // Log test event
    log(level, message, data = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            level: level,
            message: message,
            data: data,
            context: this.getCurrentContext()
        };

        this.logs.push(logEntry);

        // Console output in debug mode
        if (this.debugMode) {
            console.log(`[${level}] ${message}`, data);
        }
    }

    // Get current test context
    getCurrentContext() {
        return {
            currentScenario: this.currentScenario || null,
            currentStep: this.currentStep || null,
            testPhase: this.testPhase || 'initialization'
        };
    }

    // Start test scenario
    startScenario(scenario) {
        this.currentScenario = scenario.id;
        this.testPhase = 'execution';
        
        const scenarioStart = {
            scenarioId: scenario.id,
            startTime: Date.now(),
            scenario: scenario
        };

        this.performanceMetrics.scenarioMetrics[scenario.id] = scenarioStart;
        
        this.log('INFO', `Starting scenario: ${scenario.id}`, {
            category: scenario.category,
            expectedScore: scenario.expectedScoreRange
        });
    }

    // End test scenario
    endScenario(scenarioId, result) {
        if (this.performanceMetrics.scenarioMetrics[scenarioId]) {
            this.performanceMetrics.scenarioMetrics[scenarioId].endTime = Date.now();
            this.performanceMetrics.scenarioMetrics[scenarioId].duration = 
                Date.now() - this.performanceMetrics.scenarioMetrics[scenarioId].startTime;
        }

        this.testResults.push({
            scenarioId: scenarioId,
            result: result,
            timestamp: new Date().toISOString(),
            duration: this.performanceMetrics.scenarioMetrics[scenarioId]?.duration
        });

        this.log('INFO', `Completed scenario: ${scenarioId}`, {
            passed: result.passed,
            score: result.score,
            issues: result.issues
        });

        this.currentScenario = null;
    }

    // Log wizard step transition
    logWizardStep(step, data) {
        this.currentStep = step;
        
        if (!this.performanceMetrics.wizardStepMetrics[this.currentScenario]) {
            this.performanceMetrics.wizardStepMetrics[this.currentScenario] = {};
        }

        this.performanceMetrics.wizardStepMetrics[this.currentScenario][step] = {
            timestamp: Date.now(),
            data: data
        };

        this.log('DEBUG', `Wizard step ${step}`, {
            fieldsPresent: Object.keys(data || {}),
            dataSnapshot: this.sanitizeData(data)
        });
    }

    // Log field mapping issue
    logFieldMappingIssue(issue) {
        this.fieldMappingIssues.push({
            timestamp: new Date().toISOString(),
            scenarioId: this.currentScenario,
            issue: issue
        });

        this.log('WARNING', 'Field mapping issue detected', issue);
    }

    // Log score validation issue
    logScoreValidationIssue(issue) {
        this.scoreValidationIssues.push({
            timestamp: new Date().toISOString(),
            scenarioId: this.currentScenario,
            issue: issue
        });

        this.log('WARNING', 'Score validation issue detected', issue);
    }

    // Log error with stack trace
    logError(error, context = {}) {
        const errorEntry = {
            timestamp: new Date().toISOString(),
            scenarioId: this.currentScenario,
            error: {
                message: error.message,
                stack: error.stack,
                name: error.name
            },
            context: context
        };

        this.errorStack.push(errorEntry);
        this.log('ERROR', error.message, { stack: error.stack, context });
    }

    // Log API call
    logApiCall(endpoint, duration, success, data = {}) {
        this.performanceMetrics.apiCallMetrics.push({
            timestamp: Date.now(),
            endpoint: endpoint,
            duration: duration,
            success: success,
            scenarioId: this.currentScenario,
            data: data
        });

        this.log('DEBUG', `API call to ${endpoint}`, {
            duration: `${duration}ms`,
            success: success
        });
    }

    // Sanitize sensitive data
    sanitizeData(data) {
        if (!data) return data;
        
        const sanitized = { ...data };
        const sensitiveFields = ['password', 'ssn', 'creditCard', 'bankAccount'];
        
        Object.keys(sanitized).forEach(key => {
            if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
                sanitized[key] = '[REDACTED]';
            }
        });

        return sanitized;
    }

    // Generate comprehensive report
    generateReport() {
        const endTime = Date.now();
        this.performanceMetrics.testEndTime = endTime;
        this.performanceMetrics.totalDuration = endTime - this.performanceMetrics.testStartTime;

        const report = {
            sessionId: this.sessionId,
            timestamp: new Date().toISOString(),
            duration: this.performanceMetrics.totalDuration,
            summary: this.generateSummary(),
            detailedResults: this.testResults,
            fieldMappingIssues: this.fieldMappingIssues,
            scoreValidationIssues: this.scoreValidationIssues,
            errors: this.errorStack,
            performanceMetrics: this.performanceMetrics,
            logs: this.debugMode ? this.logs : this.logs.filter(l => l.level !== 'DEBUG')
        };

        return report;
    }

    // Generate test summary
    generateSummary() {
        const totalTests = this.testResults.length;
        const passed = this.testResults.filter(r => r.result.passed).length;
        const failed = totalTests - passed;
        
        // Analyze common issues
        const issueFrequency = {};
        this.testResults.forEach(result => {
            if (result.result.issues) {
                result.result.issues.forEach(issue => {
                    const issueKey = issue.split(':')[0].trim();
                    issueFrequency[issueKey] = (issueFrequency[issueKey] || 0) + 1;
                });
            }
        });

        // Score distribution
        const scoreDistribution = this.analyzeScoreDistribution();
        
        // Critical bug detection
        const criticalBugs = this.detectCriticalBugs();

        return {
            totalTests: totalTests,
            passed: passed,
            failed: failed,
            successRate: totalTests > 0 ? ((passed / totalTests) * 100).toFixed(2) + '%' : '0%',
            averageTestDuration: this.calculateAverageTestDuration(),
            commonIssues: Object.entries(issueFrequency)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([issue, count]) => ({ issue, count, percentage: ((count / totalTests) * 100).toFixed(2) + '%' })),
            scoreDistribution: scoreDistribution,
            criticalBugs: criticalBugs,
            fieldMappingFailures: this.fieldMappingIssues.length,
            scoreValidationFailures: this.scoreValidationIssues.length,
            errors: this.errorStack.length
        };
    }

    // Analyze score distribution
    analyzeScoreDistribution() {
        const distribution = {
            '0-20': 0,
            '21-40': 0,
            '41-60': 0,
            '61-80': 0,
            '81-100': 0,
            'critical_27-29': 0,
            'invalid': 0
        };

        this.testResults.forEach(result => {
            const score = result.result.score?.actual;
            if (score === undefined || score === null || isNaN(score)) {
                distribution.invalid++;
            } else if (score >= 27 && score <= 29) {
                distribution['critical_27-29']++;
            } else if (score <= 20) {
                distribution['0-20']++;
            } else if (score <= 40) {
                distribution['21-40']++;
            } else if (score <= 60) {
                distribution['41-60']++;
            } else if (score <= 80) {
                distribution['61-80']++;
            } else if (score <= 100) {
                distribution['81-100']++;
            } else {
                distribution.invalid++;
            }
        });

        return distribution;
    }

    // Detect critical bugs
    detectCriticalBugs() {
        const bugs = [];

        // Check for critical low score bug
        const criticalLowScores = this.testResults.filter(r => {
            const score = r.result.score?.actual;
            return score >= 27 && score <= 29;
        }).length;

        if (criticalLowScores > 0) {
            bugs.push({
                type: 'CRITICAL_LOW_SCORE_BUG',
                severity: 'critical',
                occurrences: criticalLowScores,
                percentage: ((criticalLowScores / this.testResults.length) * 100).toFixed(2) + '%',
                description: 'Scores consistently returning 27-29 regardless of input'
            });
        }

        // Check for field mapping failures
        const mappingFailures = this.fieldMappingIssues.filter(i => 
            i.issue.includes('Required field not found')
        ).length;

        if (mappingFailures > this.testResults.length * 0.3) {
            bugs.push({
                type: 'FIELD_MAPPING_FAILURE',
                severity: 'high',
                occurrences: mappingFailures,
                description: 'Systematic field mapping failures affecting scoring'
            });
        }

        // Check for couple mode issues
        const coupleModeFailures = this.testResults.filter(r => 
            r.result.scenario?.inputs?.planningType === 'couple' && !r.result.passed
        ).length;

        const totalCoupleTests = this.testResults.filter(r => 
            r.result.scenario?.inputs?.planningType === 'couple'
        ).length;

        if (totalCoupleTests > 0 && coupleModeFailures / totalCoupleTests > 0.5) {
            bugs.push({
                type: 'COUPLE_MODE_FAILURE',
                severity: 'high',
                occurrences: coupleModeFailures,
                percentage: ((coupleModeFailures / totalCoupleTests) * 100).toFixed(2) + '%',
                description: 'Couple mode calculations failing systematically'
            });
        }

        return bugs;
    }

    // Calculate average test duration
    calculateAverageTestDuration() {
        const durations = Object.values(this.performanceMetrics.scenarioMetrics)
            .filter(m => m.duration)
            .map(m => m.duration);

        if (durations.length === 0) return 0;

        const average = durations.reduce((sum, d) => sum + d, 0) / durations.length;
        return Math.round(average);
    }

    // Export report in various formats
    exportReport(format = 'json') {
        const report = this.generateReport();

        switch (format.toLowerCase()) {
            case 'json':
                return this.exportAsJSON(report);
            case 'csv':
                return this.exportAsCSV(report);
            case 'markdown':
                return this.exportAsMarkdown(report);
            case 'html':
                return this.exportAsHTML(report);
            default:
                throw new Error(`Unsupported export format: ${format}`);
        }
    }

    // Export as JSON
    exportAsJSON(report) {
        return JSON.stringify(report, null, 2);
    }

    // Export as CSV
    exportAsCSV(report) {
        const rows = [];
        
        // Header
        rows.push(['E2E Test Report']);
        rows.push(['Session ID', report.sessionId]);
        rows.push(['Date', report.timestamp]);
        rows.push(['Total Duration', `${report.duration}ms`]);
        rows.push([]);
        
        // Summary
        rows.push(['Summary']);
        rows.push(['Total Tests', report.summary.totalTests]);
        rows.push(['Passed', report.summary.passed]);
        rows.push(['Failed', report.summary.failed]);
        rows.push(['Success Rate', report.summary.successRate]);
        rows.push([]);
        
        // Test Results
        rows.push(['Test Results']);
        rows.push(['Scenario ID', 'Passed', 'Score', 'Expected Min', 'Expected Max', 'Issues', 'Duration (ms)']);
        
        report.detailedResults.forEach(result => {
            rows.push([
                result.scenarioId,
                result.result.passed ? 'Yes' : 'No',
                result.result.score?.actual || 'N/A',
                result.result.score?.expected?.min || 'N/A',
                result.result.score?.expected?.max || 'N/A',
                result.result.issues?.length || 0,
                result.duration || 'N/A'
            ]);
        });

        return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    }

    // Export as Markdown
    exportAsMarkdown(report) {
        let md = `# E2E Test Report\n\n`;
        md += `**Session ID:** ${report.sessionId}\n`;
        md += `**Date:** ${report.timestamp}\n`;
        md += `**Duration:** ${(report.duration / 1000).toFixed(2)}s\n\n`;

        // Summary
        md += `## Summary\n\n`;
        md += `- **Total Tests:** ${report.summary.totalTests}\n`;
        md += `- **Passed:** ${report.summary.passed}\n`;
        md += `- **Failed:** ${report.summary.failed}\n`;
        md += `- **Success Rate:** ${report.summary.successRate}\n`;
        md += `- **Average Duration:** ${report.summary.averageTestDuration}ms\n\n`;

        // Critical Bugs
        if (report.summary.criticalBugs.length > 0) {
            md += `## ⚠️ Critical Bugs Detected\n\n`;
            report.summary.criticalBugs.forEach(bug => {
                md += `### ${bug.type}\n`;
                md += `- **Severity:** ${bug.severity}\n`;
                md += `- **Occurrences:** ${bug.occurrences}\n`;
                md += `- **Description:** ${bug.description}\n\n`;
            });
        }

        // Score Distribution
        md += `## Score Distribution\n\n`;
        Object.entries(report.summary.scoreDistribution).forEach(([range, count]) => {
            const percentage = report.summary.totalTests > 0 
                ? ((count / report.summary.totalTests) * 100).toFixed(2) 
                : '0';
            md += `- ${range}: ${count} tests (${percentage}%)\n`;
        });
        md += `\n`;

        // Common Issues
        if (report.summary.commonIssues.length > 0) {
            md += `## Common Issues\n\n`;
            report.summary.commonIssues.forEach((issue, index) => {
                md += `${index + 1}. **${issue.issue}** - ${issue.count} occurrences (${issue.percentage})\n`;
            });
            md += `\n`;
        }

        // Failed Tests Detail
        const failedTests = report.detailedResults.filter(r => !r.result.passed);
        if (failedTests.length > 0) {
            md += `## Failed Tests Detail\n\n`;
            failedTests.forEach(test => {
                md += `### ${test.scenarioId}\n`;
                md += `- **Score:** ${test.result.score?.actual || 'N/A'} (expected: ${test.result.score?.expected?.min}-${test.result.score?.expected?.max})\n`;
                if (test.result.issues && test.result.issues.length > 0) {
                    md += `- **Issues:**\n`;
                    test.result.issues.forEach(issue => {
                        md += `  - ${issue}\n`;
                    });
                }
                md += `\n`;
            });
        }

        // Errors
        if (report.errors.length > 0) {
            md += `## Errors\n\n`;
            report.errors.forEach((error, index) => {
                md += `### Error ${index + 1}\n`;
                md += `- **Scenario:** ${error.scenarioId}\n`;
                md += `- **Message:** ${error.error.message}\n`;
                md += `- **Stack:** \`\`\`\n${error.error.stack}\n\`\`\`\n\n`;
            });
        }

        return md;
    }

    // Export as HTML
    exportAsHTML(report) {
        const html = `
<!DOCTYPE html>
<html>
<head>
    <title>E2E Test Report - ${report.sessionId}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f5f5f5; padding: 20px; border-radius: 5px; }
        .summary { margin: 20px 0; }
        .metric { display: inline-block; margin: 10px 20px 10px 0; }
        .metric-value { font-size: 24px; font-weight: bold; }
        .metric-label { color: #666; }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .warning { color: #ffc107; }
        .critical { color: #dc3545; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f5f5f5; }
        .issue { background-color: #ffe6e6; }
        .score-distribution { margin: 20px 0; }
        .bar { display: inline-block; height: 20px; background: #007bff; margin-right: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>E2E Test Report</h1>
        <div>Session ID: ${report.sessionId}</div>
        <div>Date: ${report.timestamp}</div>
        <div>Duration: ${(report.duration / 1000).toFixed(2)}s</div>
    </div>

    <div class="summary">
        <h2>Summary</h2>
        <div class="metric">
            <div class="metric-value">${report.summary.totalTests}</div>
            <div class="metric-label">Total Tests</div>
        </div>
        <div class="metric">
            <div class="metric-value passed">${report.summary.passed}</div>
            <div class="metric-label">Passed</div>
        </div>
        <div class="metric">
            <div class="metric-value failed">${report.summary.failed}</div>
            <div class="metric-label">Failed</div>
        </div>
        <div class="metric">
            <div class="metric-value">${report.summary.successRate}</div>
            <div class="metric-label">Success Rate</div>
        </div>
    </div>

    ${report.summary.criticalBugs.length > 0 ? `
    <div class="critical-bugs">
        <h2>⚠️ Critical Bugs</h2>
        ${report.summary.criticalBugs.map(bug => `
        <div class="critical">
            ${bug.type}: ${bug.description} (${bug.occurrences} occurrences)
        </div>
        `).join('')}
    </div>
    ` : ''}

    <div class="test-results">
        <h2>Test Results</h2>
        <table>
            <tr>
                <th>Scenario</th>
                <th>Status</th>
                <th>Score</th>
                <th>Expected</th>
                <th>Issues</th>
                <th>Duration</th>
            </tr>
            ${report.detailedResults.map(result => `
            <tr class="${result.result.passed ? '' : 'issue'}">
                <td>${result.scenarioId}</td>
                <td class="${result.result.passed ? 'passed' : 'failed'}">
                    ${result.result.passed ? '✓ Pass' : '✗ Fail'}
                </td>
                <td>${result.result.score?.actual || 'N/A'}</td>
                <td>${result.result.score?.expected ? 
                    `${result.result.score.expected.min}-${result.result.score.expected.max}` : 'N/A'}</td>
                <td>${result.result.issues?.length || 0}</td>
                <td>${result.duration ? `${result.duration}ms` : 'N/A'}</td>
            </tr>
            `).join('')}
        </table>
    </div>
</body>
</html>`;
        return html;
    }

    // Download report file
    downloadReport(format = 'json', filename = null) {
        const report = this.exportReport(format);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const defaultFilename = `e2e-test-report-${timestamp}.${format}`;
        const finalFilename = filename || defaultFilename;

        const blob = new Blob([report], { 
            type: this.getMimeType(format) 
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = finalFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.log('INFO', `Report downloaded: ${finalFilename}`);
    }

    // Get MIME type for format
    getMimeType(format) {
        switch (format.toLowerCase()) {
            case 'json':
                return 'application/json';
            case 'csv':
                return 'text/csv';
            case 'markdown':
                return 'text/markdown';
            case 'html':
                return 'text/html';
            default:
                return 'text/plain';
        }
    }
}

// Export for use in tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestLogger;
} else {
    window.TestLogger = TestLogger;
}