# Production Issue Detection for Claude Code

**Advanced Retirement Planner - Automated Issue Detection & Export System**

## 🎯 Overview

This system automatically detects, categorizes, and exports production issues in a format optimized for Claude Code analysis. It provides comprehensive issue detection with detailed context, recommendations, and structured data for efficient debugging and resolution.

## 🏗️ System Components

### 1. **Issue Detection Engine** (`issue-detector.js`)
- Advanced issue categorization and severity assessment
- Pattern recognition for common production problems
- Claude Code optimized report generation
- Comprehensive context and metadata collection

### 2. **Production Dashboard Integration** (`dashboard.html`)
- Browser-based issue detection interface
- Real-time issue visualization and analysis
- One-click export for Claude Code
- Interactive issue management

### 3. **CLI Export Tool** (`export-production-issues.js`)
- Automated production scanning with Playwright
- Headless browser testing and data collection
- Structured JSON export for programmatic analysis
- CI/CD pipeline integration ready

## 🚀 Usage Methods

### Method 1: Production Dashboard (Interactive)

1. **Open Dashboard**
   ```bash
   open tests/production/dashboard.html
   ```

2. **Detect Issues**
   - Click "🔍 Detect Issues" button
   - Review detected issues in the panel
   - Analyze severity levels and categories

3. **Export for Claude Code**
   - Click "📥 Export for Claude Code" button
   - Download automatically generated JSON file
   - File is optimized for Claude Code analysis

### Method 2: CLI Tool (Automated)

1. **Run Issue Export**
   ```bash
   node export-production-issues.js
   ```

2. **Review Results**
   ```
   📊 Issues Found: 4
   🚨 Critical: 1
   ⚠️ High: 0  
   📝 Medium: 1
   ℹ️ Low: 2
   💯 Health Score: 65/100
   ```

3. **Access Export File**
   ```bash
   cat production-issues/production-issues-2025-07-30.json
   ```

### Method 3: Programmatic Integration

```javascript
const ProductionIssueDetector = require('./tests/production/issue-detector.js');

// Initialize detector
const detector = new ProductionIssueDetector();

// Detect issues (requires monitoring data)
const report = detector.detectIssues(consoleMonitor, networkMonitor, testResults);

// Export for Claude Code
const exportResult = detector.exportToFile('my-issues.json');
```

## 📊 Example Issue Report Structure

### Metadata Section
```json
{
  "metadata": {
    "generatedAt": "2025-07-30T13:47:36.946Z",
    "generatedBy": "ProductionIssueExporter v1.0.0",
    "productionUrl": "https://ypollak2.github.io/advanced-retirement-planner/",
    "reportFormat": "claude-code-optimized",
    "exportTool": "CLI",
    "dataCollectionMethod": "playwright-automation"
  }
}
```

### Summary Section
```json
{
  "summary": {
    "totalIssues": 4,
    "issueCounts": {
      "critical": 1,
      "high": 0,
      "medium": 1,
      "low": 2
    },
    "overallHealthScore": 65,
    "urgentActionRequired": true,
    "dataPoints": {
      "consoleLogs": 92,
      "networkRequests": 102,
      "performanceMetrics": 5
    }
  }
}
```

### Individual Issue Format
```json
{
  "id": "prod-1753883256948-rns15t",
  "title": "Missing Component: Main App Container",
  "severity": "critical",
  "category": "ui-components",
  "description": "Key UI component \"Main App Container\" not found on page",
  
  "technicalDetails": {
    "type": "component-missing",
    "source": "component-test",
    "timestamp": "2025-07-30T13:47:36.943Z"
  },
  
  "impact": {
    "user": "high",
    "functionality": ["ui-rendering"],
    "business": "high"
  },
  
  "context": {
    "reproducible": true,
    "automated": true,
    "environment": "production"
  },
  
  "recommendations": [
    "Verify component loading order",
    "Check for JavaScript errors preventing rendering",
    "Validate HTML structure"
  ],
  
  "claudeCodeMetadata": {
    "analysisComplexity": "high",
    "debuggingHints": [],
    "relatedFiles": ["index.html", "src/main.js"],
    "testingStrategy": [
      "Immediate manual testing required",
      "Add automated regression test"
    ]
  }
}
```

## 🎯 Issue Categories

### Critical Issues
- **Site Unavailable**: Production site returns error status
- **Missing Main Components**: Core UI elements not found
- **JavaScript Runtime Errors**: Uncaught exceptions
- **Calculation Failures**: Financial calculation errors

### High Priority Issues  
- **React Component Errors**: Component rendering failures
- **Currency API Failures**: Exchange rate service issues
- **Network Service Failures**: 5xx HTTP status codes
- **Performance Degradation**: >10 second load times

### Medium Priority Issues
- **Missing UI Components**: Non-critical elements missing
- **Slow Performance**: 5-10 second load times
- **Network Timeouts**: 4xx HTTP status codes
- **Memory Usage**: >100MB consumption

### Low Priority Issues
- **Service Worker Issues**: Registration problems
- **Form Validation**: Minor validation errors
- **Console Warnings**: Non-critical log messages
- **Minor Performance**: <5 second load times

## 🔍 Claude Code Analysis Instructions

When Claude Code receives an issue report, follow this workflow:

### 1. **Priority Assessment** (First 30 seconds)
```
1. Check summary.urgentActionRequired
2. Review issueCounts for critical/high issues
3. Examine overallHealthScore (<70 = needs attention)
4. Identify issues requiring immediate action
```

### 2. **Issue Analysis** (Next 2-3 minutes)
```
For each issue:
1. Read title and description for quick understanding
2. Check severity level and category
3. Review impact on user/functionality/business
4. Examine technical details for root cause clues
5. Note recommendations and debugging hints
```

### 3. **Pattern Recognition** (Next 1-2 minutes)
```
1. Group issues by category
2. Look for common root causes
3. Identify systemic vs. isolated problems
4. Check insights section for detected patterns
```

### 4. **Action Planning** (Final 2-3 minutes)
```
1. Use prioritizedActions from insights
2. Focus on issues that resolve multiple problems
3. Consider impact vs. effort for each fix
4. Plan testing strategy using claudeCodeMetadata
```

## 🛠️ Integration Examples

### CI/CD Pipeline Integration

```yaml
# .github/workflows/production-health-check.yml
name: Production Health Check

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18.x'
      
      - name: Install dependencies
        run: npm install playwright
      
      - name: Export production issues
        run: node export-production-issues.js
        
      - name: Create issue if problems found
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const report = JSON.parse(fs.readFileSync('./production-issues/production-issues-*.json', 'utf8'));
            
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: `🚨 Production Issues Detected - ${report.summary.totalIssues} issues`,
              body: `Critical: ${report.summary.issueCounts.critical}, Health Score: ${report.summary.overallHealthScore}/100`,
              labels: ['production', 'automated', 'health-check']
            });
```

### Monitoring Script

```bash
#!/bin/bash
# production-monitor.sh

echo "🔍 Running production health check..."

# Export issues
node export-production-issues.js

# Check exit code
if [ $? -eq 1 ]; then
    echo "🚨 Critical issues detected!"
    
    # Send alert (customize for your notification system)
    curl -X POST -H 'Content-type: application/json' \
        --data '{"text":"🚨 Critical production issues detected in Advanced Retirement Planner"}' \
        $SLACK_WEBHOOK_URL
        
    exit 1
else
    echo "✅ Production health check passed"
    exit 0
fi
```

## 📋 Report Analysis Checklist

When analyzing a production issue report:

### Immediate Actions Required If:
- [ ] `urgentActionRequired: true` 
- [ ] Any `severity: "critical"` issues present
- [ ] `overallHealthScore < 50`
- [ ] Site unavailable or major functionality broken

### High Priority Review If:
- [ ] Multiple `severity: "high"` issues
- [ ] `overallHealthScore < 70`
- [ ] Pattern of related issues in same category
- [ ] External API failures affecting core features

### Systematic Analysis Steps:
1. [ ] Review summary statistics
2. [ ] Examine each critical/high issue individually
3. [ ] Check for patterns in insights section
4. [ ] Review system metrics for context
5. [ ] Prioritize fixes based on impact and complexity
6. [ ] Plan testing strategy using provided hints

## 🔧 Customization Options

### Severity Thresholds

Modify thresholds in `issue-detector.js`:

```javascript
severityThresholds: {
    critical: {
        errorRate: 10,      // errors per minute
        responseTime: 8000, // ms
        failureRate: 0.5,   // 50%
        memoryUsage: 150    // MB
    },
    high: {
        errorRate: 5,
        responseTime: 5000,
        failureRate: 0.2,
        memoryUsage: 100
    }
}
```

### Issue Categories

Add custom categories in `issue-detector.js`:

```javascript
issueCategories: {
    'custom-category': {
        description: 'Custom issue type',
        patterns: [/custom-pattern/i],
        priority: 'high'
    }
}
```

### Export Format

Customize report structure in `generateClaudeCodeReport()`:

```javascript
// Add custom sections
customAnalysis: {
    businessMetrics: this.calculateBusinessMetrics(),
    userImpactScore: this.assessUserImpact(),
    technicalDebt: this.analyzeTechnicalDebt()
}
```

## 📊 Sample Analysis Workflow

Here's how Claude Code would analyze a typical report:

### 1. **Quick Assessment** (30s)
```
Report shows: 4 issues, 1 critical, Health Score 65/100
🚨 Action: Critical issue requires immediate attention
Focus: "Missing Component: Main App Container"
```

### 2. **Issue Analysis** (2m)
```
Critical Issue: UI component missing
- Impact: High user, ui-rendering, high business
- Cause: Likely JavaScript loading order or errors
- Files: index.html, src/main.js
- Strategy: Immediate manual testing + regression test
```

### 3. **Pattern Check** (1m)
```
Pattern: 2/4 issues are "Missing Component" 
Root Cause: Possible component loading sequence problem
Systemic Fix: Review JavaScript loading order
```

### 4. **Action Plan** (2m)
```
Priority 1: Fix component loading (addresses 2 issues)
Priority 2: Review currency element loading
Priority 3: Monitor Service Worker registration
Testing: Manual verification + automated regression
```

## 🎉 Benefits for Claude Code Usage

### Structured Analysis
- **Pre-categorized issues** for faster triage
- **Severity levels** for priority management
- **Impact assessment** for business context
- **Technical details** for root cause analysis

### Actionable Insights
- **Specific recommendations** for each issue
- **Debugging hints** for investigation direction
- **Related files** for targeted fixes
- **Testing strategies** for validation

### Comprehensive Context
- **System metrics** for environmental understanding
- **Pattern analysis** for systemic issues
- **Health scoring** for overall assessment
- **Time-based tracking** for trend analysis

This system transforms raw production monitoring data into actionable intelligence specifically formatted for Claude Code's analysis capabilities, enabling faster and more effective issue resolution.

---

**Last Updated**: July 30, 2025  
**Version**: 1.0.0  
**Compatible with**: Claude Code v1.0+