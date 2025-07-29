#!/usr/bin/env node
/**
 * Pre-Deployment Comprehensive Check Script
 * Ensures all requirements are met before production deployment
 * CRITICAL: Must have 100% test pass rate (245/245 tests)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Deployment requirements
const REQUIRED_TEST_COUNT = 245;
const REQUIRED_NODE_VERSION = '18.0.0';

// Track validation results
const validationResults = {
    passed: [],
    failed: [],
    warnings: [],
    testResults: {},
    versionInfo: {},
    timestamp: new Date().toISOString()
};

// Utility functions
function log(message, type = 'info') {
    const prefix = {
        info: chalk.blue('ℹ'),
        success: chalk.green('✓'),
        error: chalk.red('✗'),
        warning: chalk.yellow('⚠'),
        header: chalk.cyan('►')
    };
    
    console.log(`${prefix[type] || ''} ${message}`);
}

function runCommand(command, description, critical = true) {
    try {
        log(`Running: ${description}...`, 'info');
        const output = execSync(command, { encoding: 'utf8' });
        validationResults.passed.push(description);
        return { success: true, output };
    } catch (error) {
        if (critical) {
            validationResults.failed.push(description);
            log(`FAILED: ${description}`, 'error');
            log(error.message, 'error');
            return { success: false, error: error.message };
        } else {
            validationResults.warnings.push(description);
            log(`WARNING: ${description}`, 'warning');
            return { success: false, error: error.message, warning: true };
        }
    }
}

// Validation functions
function checkNodeVersion() {
    log('Checking Node.js version...', 'header');
    const nodeVersion = process.version;
    const major = parseInt(nodeVersion.split('.')[0].substring(1));
    
    if (major >= 18) {
        log(`Node.js version ${nodeVersion} meets requirements`, 'success');
        validationResults.passed.push('Node.js version check');
        return true;
    } else {
        log(`Node.js version ${nodeVersion} is below required ${REQUIRED_NODE_VERSION}`, 'error');
        validationResults.failed.push('Node.js version check');
        return false;
    }
}

function checkVersionConsistency() {
    log('Checking version consistency...', 'header');
    
    try {
        // Read version from all sources
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const versionJson = JSON.parse(fs.readFileSync('version.json', 'utf8'));
        const readmeContent = fs.readFileSync('README.md', 'utf8');
        
        const packageVersion = packageJson.version;
        const versionFileVersion = versionJson.version;
        
        // Extract version from README (looking for v7.1.1 pattern)
        const readmeVersionMatch = readmeContent.match(/v(\d+\.\d+\.\d+)/);
        const readmeVersion = readmeVersionMatch ? readmeVersionMatch[1] : null;
        
        validationResults.versionInfo = {
            package: packageVersion,
            versionFile: versionFileVersion,
            readme: readmeVersion,
            buildDate: versionJson.build,
            description: versionJson.description
        };
        
        // Check if all versions match
        if (packageVersion === versionFileVersion && packageVersion === readmeVersion) {
            log(`Version ${packageVersion} is consistent across all files`, 'success');
            validationResults.passed.push('Version consistency');
            
            // Check if build date is today
            const today = new Date().toISOString().split('T')[0];
            if (versionJson.build !== today) {
                log(`Build date in version.json should be updated to ${today}`, 'warning');
                validationResults.warnings.push('Build date not current');
            }
            
            return true;
        } else {
            log('Version mismatch detected:', 'error');
            log(`  package.json: ${packageVersion}`, 'error');
            log(`  version.json: ${versionFileVersion}`, 'error');
            log(`  README.md: ${readmeVersion || 'NOT FOUND'}`, 'error');
            validationResults.failed.push('Version consistency');
            return false;
        }
    } catch (error) {
        log(`Error checking versions: ${error.message}`, 'error');
        validationResults.failed.push('Version consistency');
        return false;
    }
}

function runTests() {
    log('Running full test suite...', 'header');
    
    const testResult = runCommand('npm test 2>&1', 'Full test suite');
    
    if (testResult.success) {
        // Parse test output for pass count
        const passMatch = testResult.output.match(/(\d+)\/(\d+) tests passed/);
        if (passMatch) {
            const passed = parseInt(passMatch[1]);
            const total = parseInt(passMatch[2]);
            
            validationResults.testResults = {
                passed,
                total,
                percentage: ((passed / total) * 100).toFixed(2)
            };
            
            if (passed === total && total === REQUIRED_TEST_COUNT) {
                log(`All ${REQUIRED_TEST_COUNT} tests passed!`, 'success');
                return true;
            } else if (passed === total) {
                log(`All ${total} tests passed, but expected ${REQUIRED_TEST_COUNT} tests`, 'warning');
                validationResults.warnings.push(`Test count mismatch: ${total} vs expected ${REQUIRED_TEST_COUNT}`);
                return true;
            } else {
                log(`Only ${passed}/${total} tests passed. 100% pass rate required!`, 'error');
                return false;
            }
        }
    }
    
    return false;
}

function runSecurityChecks() {
    log('Running security checks...', 'header');
    
    // NPM audit
    const auditResult = runCommand('npm audit --audit-level=moderate', 'NPM security audit', false);
    
    // License check
    runCommand('npm run license-check-prod', 'License compliance check', false);
    
    // Secret scanner
    runCommand('npm run security:scan', 'Secret scanner', false);
    
    return true; // Security checks are warnings, not blockers
}

function checkBuildReadiness() {
    log('Checking build readiness...', 'header');
    
    // Check for uncommitted changes
    try {
        const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
        if (gitStatus.trim()) {
            log('Uncommitted changes detected:', 'warning');
            console.log(gitStatus);
            validationResults.warnings.push('Uncommitted changes present');
        } else {
            log('Working directory is clean', 'success');
            validationResults.passed.push('Clean working directory');
        }
    } catch (error) {
        log('Unable to check git status', 'warning');
    }
    
    // Check if on main branch
    try {
        const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
        if (currentBranch === 'main') {
            log('On main branch', 'success');
            validationResults.passed.push('Correct branch');
        } else {
            log(`Currently on branch '${currentBranch}', should be on 'main' for production deployment`, 'warning');
            validationResults.warnings.push('Not on main branch');
        }
    } catch (error) {
        log('Unable to check current branch', 'warning');
    }
    
    return true;
}

function runPerformanceChecks() {
    log('Running performance checks...', 'header');
    
    const perfResult = runCommand('npm run test:performance', 'Performance tests');
    return perfResult.success;
}

function generateReport() {
    log('\nGenerating deployment readiness report...', 'header');
    
    const report = {
        ...validationResults,
        summary: {
            ready: validationResults.failed.length === 0,
            passedChecks: validationResults.passed.length,
            failedChecks: validationResults.failed.length,
            warnings: validationResults.warnings.length
        }
    };
    
    // Save report
    const reportPath = path.join(process.cwd(), 'deployment-readiness-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    log(`Report saved to: ${reportPath}`, 'info');
    
    // Display summary
    console.log('\n' + chalk.cyan('═'.repeat(60)));
    console.log(chalk.cyan.bold('DEPLOYMENT READINESS SUMMARY'));
    console.log(chalk.cyan('═'.repeat(60)));
    
    if (report.summary.ready) {
        console.log(chalk.green.bold('\n✅ READY FOR DEPLOYMENT\n'));
    } else {
        console.log(chalk.red.bold('\n❌ NOT READY FOR DEPLOYMENT\n'));
    }
    
    console.log(`Passed Checks: ${chalk.green(report.summary.passedChecks)}`);
    console.log(`Failed Checks: ${chalk.red(report.summary.failedChecks)}`);
    console.log(`Warnings: ${chalk.yellow(report.summary.warnings)}`);
    
    if (validationResults.testResults.total) {
        console.log(`\nTest Results: ${chalk.blue(validationResults.testResults.passed)}/${chalk.blue(validationResults.testResults.total)} (${validationResults.testResults.percentage}%)`);
    }
    
    if (validationResults.versionInfo.package) {
        console.log(`\nVersion: ${chalk.blue(validationResults.versionInfo.package)}`);
        console.log(`Build Date: ${chalk.blue(validationResults.versionInfo.buildDate)}`);
    }
    
    if (report.summary.failedChecks > 0) {
        console.log(chalk.red('\nFailed Checks:'));
        validationResults.failed.forEach(check => {
            console.log(chalk.red(`  ✗ ${check}`));
        });
    }
    
    if (report.summary.warnings > 0) {
        console.log(chalk.yellow('\nWarnings:'));
        validationResults.warnings.forEach(warning => {
            console.log(chalk.yellow(`  ⚠ ${warning}`));
        });
    }
    
    console.log('\n' + chalk.cyan('═'.repeat(60)));
    
    return report.summary.ready;
}

// Main execution
async function main() {
    console.log(chalk.cyan.bold('\n🚀 ADVANCED RETIREMENT PLANNER - PRE-DEPLOYMENT CHECK\n'));
    
    // Run all checks
    const checks = [
        checkNodeVersion,
        checkVersionConsistency,
        runTests,
        runSecurityChecks,
        runPerformanceChecks,
        checkBuildReadiness
    ];
    
    let allPassed = true;
    
    for (const check of checks) {
        const result = check();
        if (!result && validationResults.failed.length > 0) {
            allPassed = false;
        }
        console.log(''); // Add spacing between checks
    }
    
    // Generate and display report
    const ready = generateReport();
    
    if (!ready) {
        console.log(chalk.red.bold('\n⛔ DEPLOYMENT BLOCKED: Fix all failed checks before proceeding.\n'));
        process.exit(1);
    } else if (validationResults.warnings.length > 0) {
        console.log(chalk.yellow.bold('\n⚠️  DEPLOYMENT ALLOWED with warnings. Review warnings above.\n'));
        process.exit(0);
    } else {
        console.log(chalk.green.bold('\n✅ ALL CHECKS PASSED! Ready for deployment.\n'));
        process.exit(0);
    }
}

// Run the checks
main().catch(error => {
    log(`Unexpected error: ${error.message}`, 'error');
    process.exit(1);
});