#!/usr/bin/env node

// Pre-Release QA Checkpoint - Comprehensive Validation
// This is the MANDATORY checkpoint before every release

const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');
const SecurityQAAnalysis = require('../tests/security-qa-analysis');

console.log('🛡️  PRE-RELEASE QA CHECKPOINT');
console.log('='.repeat(50));
console.log('📅 Checkpoint Date:', new Date().toISOString());
console.log('='.repeat(50));
console.log('');

class PreReleaseQA {
    constructor() {
        this.results = {
            security: null,
            tests: null,
            syntax: null,
            businessLogic: null,
            performance: null,
            versionConsistency: null,
            readyForRelease: false
        };
        this.criticalIssues = [];
        this.highIssues = [];
    }

    async runCommand(command, description) {
        return new Promise((resolve, reject) => {
            console.log(`🔍 ${description}...`);
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.log(`❌ FAILED: ${description}`);
                    if (stderr) console.log('Error:', stderr);
                    reject({ error, stdout, stderr });
                } else {
                    console.log(`✅ PASSED: ${description}`);
                    resolve({ stdout, stderr });
                }
            });
        });
    }

    async runSecurityAnalysis() {
        console.log('\\n🔒 PHASE 1: SECURITY VULNERABILITY SCAN');
        console.log('-'.repeat(40));
        
        try {
            const securityAnalysis = new SecurityQAAnalysis();
            const securityReport = await securityAnalysis.runComprehensiveAnalysis();
            
            this.results.security = securityReport;
            
            // Check for critical security issues
            const criticalSecurity = securityReport.findings.filter(f => f.category === 'security' && f.severity === 'critical').length;
            const highSecurity = securityReport.findings.filter(f => f.category === 'security' && f.severity === 'high').length;
            
            if (criticalSecurity > 0) {
                this.criticalIssues.push(`${criticalSecurity} critical security vulnerabilities`);
            }
            if (highSecurity > 0) {
                this.highIssues.push(`${highSecurity} high-priority security issues`);
            }
            
            console.log(`Security Analysis: ${securityReport.readyForRelease ? '✅ READY' : '❌ BLOCKED'}`);
            return securityReport.readyForRelease;
            
        } catch (error) {
            console.error('❌ Security analysis failed:', error.message);
            this.criticalIssues.push('Security analysis system failure');
            return false;
        }
    }

    async runFullTestSuite() {
        console.log('\\n🧪 PHASE 2: FUNCTIONAL TESTING');
        console.log('-'.repeat(40));
        
        try {
            const testResult = await this.runCommand('npm test', 'Complete test suite');
            
            // Parse test results
            const testOutput = testResult.stdout;
            const testsPassed = (testOutput.match(/✅ PASS/g) || []).length;
            const testsFailed = (testOutput.match(/❌ FAIL/g) || []).length;
            const successRate = testsPassed / (testsPassed + testsFailed) * 100;
            
            this.results.tests = { testsPassed, testsFailed, successRate, passed: testsFailed === 0 };
            
            if (testsFailed > 0) {
                this.criticalIssues.push(`${testsFailed} failing tests`);
            }
            
            console.log(`Functional Tests: ${testsFailed === 0 ? '✅ ALL PASSED' : `❌ ${testsFailed} FAILURES`}`);
            return testsFailed === 0;
            
        } catch (error) {
            console.error('❌ Test suite failed');
            this.criticalIssues.push('Test suite execution failure');
            return false;
        }
    }

    async runSyntaxValidation() {
        console.log('\\n📝 PHASE 3: SYNTAX VALIDATION');
        console.log('-'.repeat(40));
        
        try {
            const syntaxResult = await this.runCommand('npm run validate:syntax', 'JavaScript syntax validation');
            this.results.syntax = { passed: true };
            return true;
        } catch (error) {
            console.error('❌ Syntax validation failed');
            this.criticalIssues.push('Syntax errors in JavaScript files');
            this.results.syntax = { passed: false };
            return false;
        }
    }

    async runVersionConsistencyCheck() {
        console.log('\\n🏷️  PHASE 4: VERSION CONSISTENCY');
        console.log('-'.repeat(40));
        
        try {
            // Check version consistency across all files
            const versionFiles = [
                { file: 'version.json', pattern: /"version":\\s*"([^"]+)"/ },
                { file: 'package.json', pattern: /"version":\\s*"([^"]+)"/ },
                { file: 'src/version.js', pattern: /number:\\s*"([^"]+)"/ },
                { file: 'index.html', pattern: /Advanced Retirement Planner v([0-9.]+)/ },
                { file: 'README.md', pattern: /# 🚀 Advanced Retirement Planner v([0-9.]+)/ }
            ];
            
            const versions = [];
            let allConsistent = true;
            
            for (const { file, pattern } of versionFiles) {
                if (fs.existsSync(file)) {
                    const content = fs.readFileSync(file, 'utf8');
                    const match = content.match(pattern);
                    if (match) {
                        versions.push({ file, version: match[1] });
                    } else {
                        console.log(`⚠️  Could not find version in ${file}`);
                        allConsistent = false;
                    }
                }
            }
            
            // Check if all versions match
            const uniqueVersions = [...new Set(versions.map(v => v.version))];
            if (uniqueVersions.length > 1) {
                allConsistent = false;
                this.criticalIssues.push(`Version mismatch: ${JSON.stringify(versions)}`);
                console.log('❌ Version consistency check failed');
                versions.forEach(v => console.log(`   ${v.file}: ${v.version}`));
            } else {
                console.log(`✅ Version consistency: All files at v${uniqueVersions[0]}`);
            }
            
            this.results.versionConsistency = { passed: allConsistent, versions };
            return allConsistent;
            
        } catch (error) {
            console.error('❌ Version consistency check failed:', error.message);
            this.criticalIssues.push('Version consistency check system failure');
            return false;
        }
    }

    async runBusinessLogicValidation() {
        console.log('\\n💼 PHASE 5: BUSINESS LOGIC VALIDATION');
        console.log('-'.repeat(40));
        
        try {
            // Check retirement calculation logic
            if (fs.existsSync('src/utils/retirementCalculations.js')) {
                const calcContent = fs.readFileSync('src/utils/retirementCalculations.js', 'utf8');
                
                let businessLogicIssues = [];
                
                // Check for essential calculation components
                if (!calcContent.includes('Math.pow') || !calcContent.includes('monthlyReturn')) {
                    businessLogicIssues.push('Missing compound interest calculations');
                }
                
                if (!calcContent.includes('inflation')) {
                    businessLogicIssues.push('Missing inflation adjustment');
                }
                
                if (!calcContent.includes('pensionContribution') && !calcContent.includes('contributionRate')) {
                    businessLogicIssues.push('Missing pension contribution logic');
                }
                
                if (businessLogicIssues.length > 0) {
                    this.highIssues.push(...businessLogicIssues);
                    console.log('⚠️  Business logic validation issues found');
                    businessLogicIssues.forEach(issue => console.log(`   - ${issue}`));
                    this.results.businessLogic = { passed: false, issues: businessLogicIssues };
                    return false;
                } else {
                    console.log('✅ Business logic validation passed');
                    this.results.businessLogic = { passed: true };
                    return true;
                }
            } else {
                this.criticalIssues.push('Missing retirement calculations file');
                return false;
            }
        } catch (error) {
            console.error('❌ Business logic validation failed:', error.message);
            this.criticalIssues.push('Business logic validation system failure');
            return false;
        }
    }

    async runPerformanceValidation() {
        console.log('\\n⚡ PHASE 6: PERFORMANCE VALIDATION');
        console.log('-'.repeat(40));
        
        try {
            const performanceFiles = {
                'index.html': 15, // KB limit
                'src/components/RetirementPlannerApp.js': 50,
                'src/utils/retirementCalculations.js': 30
            };
            
            let performanceIssues = [];
            
            for (const [file, limitKB] of Object.entries(performanceFiles)) {
                if (fs.existsSync(file)) {
                    const stats = fs.statSync(file);
                    const sizeKB = (stats.size / 1024).toFixed(1);
                    
                    if (sizeKB > limitKB) {
                        performanceIssues.push(`${file} is ${sizeKB}KB (limit: ${limitKB}KB)`);
                        console.log(`⚠️  ${file}: ${sizeKB}KB exceeds ${limitKB}KB limit`);
                    } else {
                        console.log(`✅ ${file}: ${sizeKB}KB (within ${limitKB}KB limit)`);
                    }
                }
            }
            
            if (performanceIssues.length > 0) {
                this.highIssues.push(...performanceIssues);
                this.results.performance = { passed: false, issues: performanceIssues };
                return false;
            } else {
                this.results.performance = { passed: true };
                return true;
            }
            
        } catch (error) {
            console.error('❌ Performance validation failed:', error.message);
            this.criticalIssues.push('Performance validation system failure');
            return false;
        }
    }

    generateReleaseReport() {
        console.log('\\n📊 PRE-RELEASE QA SUMMARY');
        console.log('='.repeat(50));
        
        const phases = [
            { name: 'Security Analysis', result: this.results.security },
            { name: 'Functional Testing', result: this.results.tests },
            { name: 'Syntax Validation', result: this.results.syntax },
            { name: 'Version Consistency', result: this.results.versionConsistency },
            { name: 'Business Logic', result: this.results.businessLogic },
            { name: 'Performance', result: this.results.performance }
        ];
        
        console.log('\\n📋 PHASE RESULTS:');
        phases.forEach(phase => {
            const status = phase.result?.passed ? '✅ PASSED' : '❌ FAILED';
            console.log(`   ${status} ${phase.name}`);
        });
        
        console.log('\\n🚨 CRITICAL ISSUES:');
        if (this.criticalIssues.length === 0) {
            console.log('   ✅ No critical issues found');
        } else {
            this.criticalIssues.forEach(issue => console.log(`   🚨 ${issue}`));
        }
        
        console.log('\\n⚠️  HIGH-PRIORITY ISSUES:');
        if (this.highIssues.length === 0) {
            console.log('   ✅ No high-priority issues found');
        } else {
            this.highIssues.forEach(issue => console.log(`   ⚠️  ${issue}`));
        }
        
        // Determine release readiness
        this.results.readyForRelease = this.criticalIssues.length === 0;
        
        console.log('\\n🚀 RELEASE READINESS:');
        if (this.results.readyForRelease) {
            console.log('   ✅ APPROVED FOR RELEASE');
            console.log('   🎉 All critical checks passed - safe to deploy');
        } else {
            console.log('   ❌ BLOCKED FOR RELEASE');
            console.log('   🛑 Critical issues must be resolved before deployment');
        }
        
        // Save detailed report
        const reportPath = 'pre-release-qa-report.json';
        fs.writeFileSync(reportPath, JSON.stringify({
            timestamp: new Date().toISOString(),
            readyForRelease: this.results.readyForRelease,
            criticalIssues: this.criticalIssues,
            highIssues: this.highIssues,
            results: this.results
        }, null, 2));
        
        console.log(`\\n📄 Detailed report saved: ${reportPath}`);
        
        return this.results.readyForRelease;
    }

    async runCompleteCheckpoint() {
        try {
            console.log('🚀 Running complete pre-release QA checkpoint...\\n');
            
            // Run all validation phases
            const securityPassed = await this.runSecurityAnalysis();
            const testsPassed = await this.runFullTestSuite();
            const syntaxPassed = await this.runSyntaxValidation();
            const versionPassed = await this.runVersionConsistencyCheck();
            const businessLogicPassed = await this.runBusinessLogicValidation();
            const performancePassed = await this.runPerformanceValidation();
            
            // Generate final report
            const readyForRelease = this.generateReleaseReport();
            
            // Exit with appropriate code
            process.exit(readyForRelease ? 0 : 1);
            
        } catch (error) {
            console.error('\\n💥 Pre-release QA checkpoint failed:', error);
            process.exit(1);
        }
    }
}

// Execute pre-release QA if run directly
if (require.main === module) {
    const preReleaseQA = new PreReleaseQA();
    preReleaseQA.runCompleteCheckpoint();
}

module.exports = PreReleaseQA;