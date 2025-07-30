#!/usr/bin/env node

/**
 * Production E2E Test Suite Validation
 * Validates that all components are properly configured and functional
 */

const fs = require('fs');
const path = require('path');

class ProductionTestSuiteValidator {
    constructor() {
        this.testSuiteRoot = __dirname;
        this.projectRoot = path.join(__dirname, '../..');
        this.errors = [];
        this.warnings = [];
        this.validationResults = {
            files: { passed: 0, failed: 0 },
            configurations: { passed: 0, failed: 0 },
            integrations: { passed: 0, failed: 0 },
            overall: 'unknown'
        };
    }
    
    async validateSuite() {
        console.log('🔍 Validating Production E2E Test Suite...\n');
        
        try {
            await this.validateFileStructure();
            await this.validateConfigurations();
            await this.validateIntegrations();
            await this.validateGitHubWorkflow();
            
            this.generateReport();
            
        } catch (error) {
            this.addError('validation', `Validation failed: ${error.message}`);
            this.generateReport();
            process.exit(1);
        }
    }
    
    async validateFileStructure() {
        console.log('📁 Validating file structure...');
        
        const requiredFiles = [
            'production-e2e-runner.html',
            'console-monitor.js',
            'production-scenarios.js',
            'network-monitor.js',
            'dashboard.html',
            'README.md'
        ];
        
        for (const file of requiredFiles) {
            const filePath = path.join(this.testSuiteRoot, file);
            if (fs.existsSync(filePath)) {
                console.log(`  ✅ ${file}`);
                this.validationResults.files.passed++;
                
                // Validate file content
                await this.validateFileContent(file, filePath);
            } else {
                this.addError('file-structure', `Missing required file: ${file}`);
                this.validationResults.files.failed++;
                console.log(`  ❌ ${file} - MISSING`);
            }
        }
        
        // Check GitHub workflow
        const workflowPath = path.join(this.projectRoot, '.github/workflows/production-e2e.yml');
        if (fs.existsSync(workflowPath)) {
            console.log(`  ✅ .github/workflows/production-e2e.yml`);
            this.validationResults.files.passed++;
        } else {
            this.addError('file-structure', 'Missing GitHub Actions workflow');
            this.validationResults.files.failed++;
            console.log(`  ❌ .github/workflows/production-e2e.yml - MISSING`);
        }
        
        console.log('');
    }
    
    async validateFileContent(fileName, filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        switch (fileName) {
            case 'production-e2e-runner.html':
                this.validateHTMLRunner(content);
                break;
            case 'console-monitor.js':
                this.validateConsoleMonitor(content);
                break;
            case 'production-scenarios.js':
                this.validateTestScenarios(content);
                break;
            case 'network-monitor.js':
                this.validateNetworkMonitor(content);
                break;
            case 'dashboard.html':
                this.validateDashboard(content);
                break;
        }
    }
    
    validateHTMLRunner(content) {
        const requiredElements = [
            'ProductionE2ETestRunner',
            'setupConsoleCapture',
            'runAllTests',
            'downloadReport',
            'testProductionLoad'
        ];
        
        for (const element of requiredElements) {
            if (!content.includes(element)) {
                this.addWarning('html-runner', `Missing expected element: ${element}`);
            }
        }
        
        // Check for production URL
        if (!content.includes('ypollak2.github.io/advanced-retirement-planner')) {
            this.addError('html-runner', 'Production URL not configured correctly');
        }
    }
    
    validateConsoleMonitor(content) {
        const requiredMethods = [
            'ProductionConsoleMonitor',
            'setupConsoleInterception',
            'categorizeError',
            'captureError',
            'exportReport'
        ];
        
        for (const method of requiredMethods) {
            if (!content.includes(method)) {
                this.addWarning('console-monitor', `Missing expected method: ${method}`);
            }
        }
        
        // Check for error categorization
        if (!content.includes('currency-api-error') || !content.includes('react-error')) {
            this.addWarning('console-monitor', 'Missing expected error categories');
        }
    }
    
    validateTestScenarios(content) {
        const requiredScenarios = [
            'testCompleteWizardFlow',
            'testCoupleModeFlow',
            'testCurrencyConversion',
            'testFormValidation',
            'testResultsCalculation'
        ];
        
        for (const scenario of requiredScenarios) {
            if (!content.includes(scenario)) {
                this.addWarning('test-scenarios', `Missing test scenario: ${scenario}`);
            }
        }
        
        // Check for production URL usage
        if (!content.includes('ypollak2.github.io/advanced-retirement-planner')) {
            this.addError('test-scenarios', 'Production URL not configured in scenarios');
        }
    }
    
    validateNetworkMonitor(content) {
        const requiredFeatures = [
            'ProductionNetworkMonitor',
            'setupFetchInterception',
            'trackNetworkRequest',
            'checkServiceHealth',
            'generateHealthReport'
        ];
        
        for (const feature of requiredFeatures) {
            if (!content.includes(feature)) {
                this.addWarning('network-monitor', `Missing feature: ${feature}`);
            }
        }
        
        // Check for API endpoints
        const expectedAPIs = [
            'api.exchangerate-api.com',
            'query1.finance.yahoo.com',
            'cors-anywhere.herokuapp.com'
        ];
        
        for (const api of expectedAPIs) {
            if (!content.includes(api)) {
                this.addWarning('network-monitor', `Missing API endpoint: ${api}`);
            }
        }
    }
    
    validateDashboard(content) {
        const requiredFeatures = [
            'ProductionDashboard',
            'runFullTest',
            'checkAllServices',
            'updateMetrics',
            'logEvent'
        ];
        
        for (const feature of requiredFeatures) {
            if (!content.includes(feature)) {
                this.addWarning('dashboard', `Missing feature: ${feature}`);
            }
        }
        
        // Check for responsive design
        if (!content.includes('@media') || !content.includes('grid-template-columns')) {
            this.addWarning('dashboard', 'Missing responsive design elements');
        }
    }
    
    async validateConfigurations() {
        console.log('⚙️ Validating configurations...');
        
        // Check package.json for required dependencies
        const packageJsonPath = path.join(this.projectRoot, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            
            // Check for production URL
            if (packageJson.homepage && packageJson.homepage.includes('ypollak2.github.io/advanced-retirement-planner')) {
                console.log('  ✅ Production URL configured in package.json');
                this.validationResults.configurations.passed++;
            } else {
                this.addWarning('configuration', 'Production URL not properly set in package.json');
                this.validationResults.configurations.failed++;
            }
            
            // Check for test scripts
            if (packageJson.scripts && packageJson.scripts.test) {
                console.log('  ✅ Test scripts configured');
                this.validationResults.configurations.passed++;
            } else {
                this.addWarning('configuration', 'Test scripts not configured');
                this.validationResults.configurations.failed++;
            }
        } else {
            this.addError('configuration', 'package.json not found');
            this.validationResults.configurations.failed++;
        }
        
        // Check CLAUDE.md for deployment rules
        const claudeMdPath = path.join(this.projectRoot, 'CLAUDE.md');
        if (fs.existsSync(claudeMdPath)) {
            const claudeContent = fs.readFileSync(claudeMdPath, 'utf8');
            if (claudeContent.includes('100% test pass rate required') && 
                claudeContent.includes('302/302 tests pass')) {
                console.log('  ✅ Deployment rules configured');
                this.validationResults.configurations.passed++;
            } else {
                this.addWarning('configuration', 'Deployment rules may be outdated');
                this.validationResults.configurations.failed++;
            }
        }
        
        console.log('');
    }
    
    async validateIntegrations() {
        console.log('🔗 Validating integrations...');
        
        // Test production URL accessibility
        try {
            console.log('  🌐 Testing production URL accessibility...');
            
            // Simple connectivity test (in Node.js environment)
            const https = require('https');
            const url = require('url');
            
            await new Promise((resolve, reject) => {
                const options = url.parse('https://ypollak2.github.io/advanced-retirement-planner/');
                options.method = 'HEAD';
                options.timeout = 10000;
                
                const req = https.request(options, (res) => {
                    if (res.statusCode === 200) {
                        console.log('  ✅ Production site is accessible');
                        this.validationResults.integrations.passed++;
                        resolve();
                    } else {
                        this.addWarning('integration', `Production site returned status: ${res.statusCode}`);
                        this.validationResults.integrations.failed++;
                        resolve();
                    }
                });
                
                req.on('error', (error) => {
                    this.addWarning('integration', `Production site connectivity error: ${error.message}`);
                    this.validationResults.integrations.failed++;
                    resolve();
                });
                
                req.on('timeout', () => {
                    this.addWarning('integration', 'Production site request timeout');
                    this.validationResults.integrations.failed++;
                    resolve();
                });
                
                req.end();
            });
        } catch (error) {
            this.addWarning('integration', `Production URL test failed: ${error.message}`);
            this.validationResults.integrations.failed++;
        }
        
        // Test external API accessibility
        try {
            console.log('  🌐 Testing external API accessibility...');
            
            const https = require('https');
            await new Promise((resolve) => {
                const req = https.request('https://api.exchangerate-api.com/v4/latest/USD', (res) => {
                    if (res.statusCode === 200) {
                        console.log('  ✅ Currency API is accessible');
                        this.validationResults.integrations.passed++;
                    } else {
                        this.addWarning('integration', `Currency API returned status: ${res.statusCode}`);
                        this.validationResults.integrations.failed++;
                    }
                    resolve();
                });
                
                req.on('error', () => {
                    this.addWarning('integration', 'Currency API not accessible');
                    this.validationResults.integrations.failed++;
                    resolve();
                });
                
                req.setTimeout(5000, () => {
                    this.addWarning('integration', 'Currency API timeout');
                    this.validationResults.integrations.failed++;
                    resolve();
                });
                
                req.end();
            });
        } catch (error) {
            this.addWarning('integration', `API connectivity test failed: ${error.message}`);
            this.validationResults.integrations.failed++;
        }
        
        console.log('');
    }
    
    async validateGitHubWorkflow() {
        console.log('🔄 Validating GitHub Actions workflow...');
        
        const workflowPath = path.join(this.projectRoot, '.github/workflows/production-e2e.yml');
        if (!fs.existsSync(workflowPath)) {
            this.addError('workflow', 'GitHub Actions workflow file not found');
            return;
        }
        
        const workflowContent = fs.readFileSync(workflowPath, 'utf8');
        
        // Check required workflow elements
        const requiredElements = [
            'name: Production E2E Tests',
            'on:',
            'schedule:',
            'workflow_dispatch:',
            'production-e2e-tests:',
            'uses: actions/checkout@v4',
            'uses: actions/setup-node@v4',
            'npx playwright install'
        ];
        
        let workflowValid = true;
        for (const element of requiredElements) {
            if (!workflowContent.includes(element)) {
                this.addWarning('workflow', `Missing workflow element: ${element}`);
                workflowValid = false;
            }
        }
        
        if (workflowValid) {
            console.log('  ✅ GitHub Actions workflow is properly configured');
            this.validationResults.integrations.passed++;
        } else {
            console.log('  ⚠️ GitHub Actions workflow has missing elements');
            this.validationResults.integrations.failed++;
        }
        
        // Check environment variables
        if (workflowContent.includes('PRODUCTION_URL') && 
            workflowContent.includes('ypollak2.github.io/advanced-retirement-planner')) {
            console.log('  ✅ Production URL configured in workflow');
            this.validationResults.integrations.passed++;
        } else {
            this.addWarning('workflow', 'Production URL not properly configured in workflow');
            this.validationResults.integrations.failed++;
        }
        
        console.log('');
    }
    
    addError(category, message) {
        this.errors.push({ category, message, timestamp: new Date() });
    }
    
    addWarning(category, message) {
        this.warnings.push({ category, message, timestamp: new Date() });
    }
    
    generateReport() {
        console.log('📊 Validation Report');
        console.log('===================\n');
        
        // Calculate overall status
        const totalPassed = Object.values(this.validationResults).reduce((sum, category) => 
            typeof category === 'object' ? sum + category.passed : sum, 0
        );
        const totalFailed = Object.values(this.validationResults).reduce((sum, category) => 
            typeof category === 'object' ? sum + category.failed : sum, 0
        );
        const totalTests = totalPassed + totalFailed;
        const successRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : 0;
        
        if (this.errors.length === 0 && this.warnings.length <= 2) {
            this.validationResults.overall = 'success';
        } else if (this.errors.length === 0) {
            this.validationResults.overall = 'warning';
        } else {
            this.validationResults.overall = 'failed';
        }
        
        // Summary
        console.log(`📈 Success Rate: ${successRate}%`);
        console.log(`✅ Passed: ${totalPassed}`);
        console.log(`⚠️ Warnings: ${this.warnings.length}`);
        console.log(`❌ Errors: ${this.errors.length}`);
        console.log(`🎯 Overall Status: ${this.validationResults.overall.toUpperCase()}\n`);
        
        // Category breakdown
        console.log('📋 Category Breakdown:');
        console.log(`  Files: ${this.validationResults.files.passed}/${this.validationResults.files.passed + this.validationResults.files.failed} passed`);
        console.log(`  Configurations: ${this.validationResults.configurations.passed}/${this.validationResults.configurations.passed + this.validationResults.configurations.failed} passed`);
        console.log(`  Integrations: ${this.validationResults.integrations.passed}/${this.validationResults.integrations.passed + this.validationResults.integrations.failed} passed\n`);
        
        // Warnings
        if (this.warnings.length > 0) {
            console.log('⚠️ Warnings:');
            this.warnings.forEach((warning, index) => {
                console.log(`  ${index + 1}. [${warning.category}] ${warning.message}`);
            });
            console.log('');
        }
        
        // Errors
        if (this.errors.length > 0) {
            console.log('❌ Errors:');
            this.errors.forEach((error, index) => {
                console.log(`  ${index + 1}. [${error.category}] ${error.message}`);
            });
            console.log('');
        }
        
        // Recommendations
        console.log('💡 Recommendations:');
        if (this.validationResults.overall === 'success') {
            console.log('  ✅ Production E2E Test Suite is ready for use!');
            console.log('  ✅ All core components are properly configured');
            console.log('  ✅ GitHub Actions workflow is set up correctly');
            console.log('');
            console.log('🚀 Next Steps:');
            console.log('  1. Open tests/production/dashboard.html to monitor production');
            console.log('  2. Run tests/production/production-e2e-runner.html for manual testing');
            console.log('  3. Enable GitHub Actions workflow for automated testing');
            console.log('  4. Configure Slack webhook for notifications (optional)');
        } else if (this.validationResults.overall === 'warning') {
            console.log('  ⚠️ Test suite is functional but has some issues');
            console.log('  📝 Review warnings above and address if needed');
            console.log('  ✅ Core functionality should work correctly');
        } else {
            console.log('  ❌ Critical issues found - test suite may not work properly');
            console.log('  🔧 Fix errors above before using the test suite');
            console.log('  📞 Consider reviewing the implementation');
        }
        
        console.log('');
        
        // Save detailed report
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                successRate: successRate + '%',
                totalPassed,
                totalFailed,
                warnings: this.warnings.length,
                errors: this.errors.length,
                overall: this.validationResults.overall
            },
            results: this.validationResults,
            warnings: this.warnings,
            errors: this.errors
        };
        
        const reportPath = path.join(this.testSuiteRoot, 'validation-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`📄 Detailed report saved to: ${reportPath}`);
        
        // Exit with appropriate code
        if (this.validationResults.overall === 'failed') {
            process.exit(1);
        } else {
            process.exit(0);
        }
    }
}

// Run validation if called directly
if (require.main === module) {
    const validator = new ProductionTestSuiteValidator();
    validator.validateSuite().catch(console.error);
}

module.exports = ProductionTestSuiteValidator;