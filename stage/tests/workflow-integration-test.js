#!/usr/bin/env node

/**
 * GitHub Workflows Integration Test Suite
 * 
 * This script validates the new optimized workflow architecture by:
 * 1. Testing individual workflow syntax and configuration
 * 2. Validating dependency relationships
 * 3. Simulating full workflow execution chains
 * 4. Testing failure scenarios and recovery
 * 
 * Usage: node tests/workflow-integration-test.js
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class WorkflowIntegrationTester {
    constructor() {
        this.workflowsDir = path.join(process.cwd(), '.github', 'workflows');
        this.results = {
            passed: 0,
            failed: 0,
            total: 0,
            errors: [],
            warnings: []
        };
        
        this.workflows = {
            'ci-pipeline.yml': null,
            'deployment.yml': null,
            'quality-assurance.yml': null,
            'monitoring.yml': null,
            'security.yml': null
        };
    }

    async runAllTests() {
        console.log('🧪 Starting GitHub Workflows Integration Test Suite');
        console.log('=' .repeat(60));
        
        // Phase 1: Load and validate workflow files
        await this.loadWorkflows();
        
        // Phase 2: Syntax and structure validation
        await this.validateWorkflowSyntax();
        
        // Phase 3: Dependency relationship validation
        await this.validateDependencies();
        
        // Phase 4: Configuration validation
        await this.validateConfiguration();
        
        // Phase 5: Integration testing
        await this.testIntegrationScenarios();
        
        // Phase 6: Failure scenario testing
        await this.testFailureScenarios();
        
        // Generate final report
        this.generateReport();
        
        return this.results.failed === 0;
    }

    async loadWorkflows() {
        console.log('\n📁 Phase 1: Loading workflow files...');
        
        for (const workflowFile of Object.keys(this.workflows)) {
            const filePath = path.join(this.workflowsDir, workflowFile);
            
            if (fs.existsSync(filePath)) {
                try {
                    const content = fs.readFileSync(filePath, 'utf8');
                    this.workflows[workflowFile] = yaml.load(content);
                    console.log(`  ✅ Loaded ${workflowFile}`);
                } catch (error) {
                    this.addError(`Failed to load ${workflowFile}`, error.message);
                }
            } else {
                this.addError(`Workflow file missing`, `${workflowFile} not found`);
            }
        }
    }

    async validateWorkflowSyntax() {
        console.log('\n🔍 Phase 2: Validating workflow syntax...');
        
        for (const [filename, workflow] of Object.entries(this.workflows)) {
            if (!workflow) continue;
            
            await this.runTest(`${filename}: Basic YAML structure`, () => {
                if (!workflow.name) throw new Error('Missing workflow name');
                if (!workflow.on) throw new Error('Missing workflow triggers');
                if (!workflow.jobs) throw new Error('Missing workflow jobs');
            });
            
            await this.runTest(`${filename}: Required fields present`, () => {
                for (const [jobName, job] of Object.entries(workflow.jobs)) {
                    if (!job['runs-on']) throw new Error(`Job ${jobName} missing runs-on`);
                    if (!job.steps) throw new Error(`Job ${jobName} missing steps`);
                }
            });
            
            await this.runTest(`${filename}: Timeout configurations`, () => {
                for (const [jobName, job] of Object.entries(workflow.jobs)) {
                    if (job['timeout-minutes'] && job['timeout-minutes'] > 60) {
                        this.addWarning(`Job ${jobName} has long timeout: ${job['timeout-minutes']} minutes`);
                    }
                }
            });
        }
    }

    async validateDependencies() {
        console.log('\n🔗 Phase 3: Validating workflow dependencies...');
        
        // Test CI Pipeline (entry point)
        await this.runTest('CI Pipeline: Entry point workflow', () => {
            const ciPipeline = this.workflows['ci-pipeline.yml'];
            if (!ciPipeline) throw new Error('CI Pipeline workflow not found');
            
            const triggers = ciPipeline.on;
            if (!triggers.push) throw new Error('CI Pipeline missing push trigger');
            if (!triggers.pull_request) throw new Error('CI Pipeline missing PR trigger');
            
            // Should not have workflow_run dependencies (it's the entry point)
            if (triggers.workflow_run) {
                throw new Error('CI Pipeline should not depend on other workflows');
            }
        });
        
        // Test Deployment Pipeline dependencies
        await this.runTest('Deployment Pipeline: Depends on CI Pipeline', () => {
            const deployment = this.workflows['deployment.yml'];
            if (!deployment) throw new Error('Deployment workflow not found');
            
            const triggers = deployment.on;
            if (!triggers.workflow_run) {
                throw new Error('Deployment missing workflow_run trigger');
            }
            
            const workflowDep = triggers.workflow_run;
            if (!workflowDep.workflows.includes('🔄 CI Pipeline (Main)')) {
                throw new Error('Deployment not dependent on CI Pipeline');
            }
            
            if (!workflowDep.types.includes('completed')) {
                throw new Error('Deployment not triggered on completion');
            }
        });
        
        // Test Quality Assurance dependencies
        await this.runTest('Quality Assurance: Depends on Deployment', () => {
            const qa = this.workflows['quality-assurance.yml'];
            if (!qa) throw new Error('Quality Assurance workflow not found');
            
            const triggers = qa.on;
            if (!triggers.workflow_run) {
                throw new Error('QA missing workflow_run trigger');
            }
            
            const workflowDep = triggers.workflow_run;
            if (!workflowDep.workflows.includes('🚀 Deployment Pipeline')) {
                throw new Error('QA not dependent on Deployment Pipeline');
            }
        });
        
        // Test Monitoring dependencies
        await this.runTest('Monitoring: Multiple trigger sources', () => {
            const monitoring = this.workflows['monitoring.yml'];
            if (!monitoring) throw new Error('Monitoring workflow not found');
            
            const triggers = monitoring.on;
            if (!triggers.workflow_run) {
                throw new Error('Monitoring missing workflow_run trigger');
            }
            if (!triggers.schedule) {
                throw new Error('Monitoring missing schedule trigger');
            }
            
            const workflowDep = triggers.workflow_run;
            if (!workflowDep.workflows.includes('🚀 Deployment Pipeline')) {
                throw new Error('Monitoring not dependent on Deployment Pipeline');
            }
        });
    }

    async validateConfiguration() {
        console.log('\n⚙️  Phase 4: Validating workflow configuration...');
        
        // Test environment variables consistency
        await this.runTest('Environment Variables: Consistent across workflows', () => {
            const expectedEnvVars = ['NODE_VERSION', 'PRODUCTION_URL'];
            const workflowsWithEnv = ['ci-pipeline.yml', 'deployment.yml', 'monitoring.yml'];
            
            for (const workflowFile of workflowsWithEnv) {
                const workflow = this.workflows[workflowFile];
                if (!workflow || !workflow.env) {
                    throw new Error(`${workflowFile} missing environment variables`);
                }
                
                for (const envVar of expectedEnvVars) {
                    if (!(envVar in workflow.env)) {
                        throw new Error(`${workflowFile} missing ${envVar} environment variable`);
                    }
                }
            }
        });
        
        // Test concurrency configurations
        await this.runTest('Concurrency: Proper concurrency controls', () => {
            const ciPipeline = this.workflows['ci-pipeline.yml'];
            const deployment = this.workflows['deployment.yml'];
            
            if (!ciPipeline.concurrency) {
                throw new Error('CI Pipeline missing concurrency control');
            }
            
            if (!deployment.concurrency) {
                throw new Error('Deployment missing concurrency control');
            }
            
            // CI should cancel previous runs, deployment should not
            if (!ciPipeline.concurrency['cancel-in-progress']) {
                throw new Error('CI Pipeline should cancel previous runs');
            }
            
            if (deployment.concurrency['cancel-in-progress'] !== false) {
                throw new Error('Deployment should not cancel previous runs');
            }
        });
        
        // Test permissions
        await this.runTest('Permissions: Minimal required permissions', () => {
            for (const [filename, workflow] of Object.entries(this.workflows)) {
                if (!workflow) continue;
                
                // Check for overly broad permissions
                if (workflow.permissions && workflow.permissions.contents === 'write') {
                    if (!filename.includes('deployment')) {
                        this.addWarning(`${filename} has write permissions - verify necessity`);
                    }
                }
            }
        });
    }

    async testIntegrationScenarios() {
        console.log('\n🔄 Phase 5: Testing integration scenarios...');
        
        // Test job dependencies within workflows
        await this.runTest('CI Pipeline: Job dependency chain', () => {
            const ciPipeline = this.workflows['ci-pipeline.yml'];
            const jobs = ciPipeline.jobs;
            
            // Verify job dependency chain
            if (jobs.tests && jobs.tests.needs) {
                if (!jobs.tests.needs.includes('code-quality')) {
                    throw new Error('Tests job should depend on code-quality');
                }
            }
            
            if (jobs['security-scan'] && jobs['security-scan'].needs) {
                const needs = Array.isArray(jobs['security-scan'].needs) 
                    ? jobs['security-scan'].needs 
                    : [jobs['security-scan'].needs];
                    
                if (!needs.includes('code-quality')) {
                    throw new Error('Security scan should depend on code-quality');
                }
            }
        });
        
        // Test deployment pipeline job chain
        await this.runTest('Deployment Pipeline: Stage-to-Production flow', () => {
            const deployment = this.workflows['deployment.yml'];
            const jobs = deployment.jobs;
            
            if (!jobs['deploy-stage'] || !jobs['deploy-production']) {
                throw new Error('Missing stage or production deployment jobs');
            }
            
            if (jobs['deploy-production'].needs) {
                const needs = Array.isArray(jobs['deploy-production'].needs) 
                    ? jobs['deploy-production'].needs 
                    : [jobs['deploy-production'].needs];
                    
                if (!needs.some(need => need.includes('stage'))) {
                    throw new Error('Production deployment should depend on stage deployment');
                }
            }
        });
        
        // Test conditional execution
        await this.runTest('Conditional Execution: Proper if conditions', () => {
            const workflows = [this.workflows['deployment.yml'], this.workflows['quality-assurance.yml']];
            
            for (const workflow of workflows) {
                if (!workflow) continue;
                
                for (const [jobName, job] of Object.entries(workflow.jobs)) {
                    if (job.if && job.if.includes('workflow_run')) {
                        // Should check for success condition
                        if (!job.if.includes('success') && !job.if.includes('completed')) {
                            this.addWarning(`Job ${jobName} may not check for successful completion`);
                        }
                    }
                }
            }
        });
    }

    async testFailureScenarios() {
        console.log('\n🚨 Phase 6: Testing failure scenarios...');
        
        // Test failure handling
        await this.runTest('Failure Handling: Continue-on-error usage', () => {
            let continueOnErrorCount = 0;
            
            for (const [filename, workflow] of Object.entries(this.workflows)) {
                if (!workflow) continue;
                
                for (const [jobName, job] of Object.entries(workflow.jobs)) {
                    if (job.steps) {
                        for (const step of job.steps) {
                            if (step['continue-on-error']) {
                                continueOnErrorCount++;
                                console.log(`    ℹ️  Found continue-on-error in ${filename}:${jobName}`);
                            }
                        }
                    }
                }
            }
            
            if (continueOnErrorCount === 0) {
                this.addWarning('No continue-on-error steps found - consider for non-critical operations');
            }
        });
        
        // Test timeout configurations
        await this.runTest('Timeout Protection: All jobs have timeouts', () => {
            let jobsWithoutTimeout = 0;
            
            for (const [filename, workflow] of Object.entries(this.workflows)) {
                if (!workflow) continue;
                
                for (const [jobName, job] of Object.entries(workflow.jobs)) {
                    if (!job['timeout-minutes']) {
                        jobsWithoutTimeout++;
                        this.addWarning(`Job ${jobName} in ${filename} has no timeout`);
                    }
                }
            }
            
            if (jobsWithoutTimeout > 5) {
                throw new Error(`Too many jobs without timeouts: ${jobsWithoutTimeout}`);
            }
        });
        
        // Test alert mechanisms
        await this.runTest('Alert Mechanisms: Monitoring has alert creation', () => {
            const monitoring = this.workflows['monitoring.yml'];
            if (!monitoring) throw new Error('Monitoring workflow not found');
            
            let hasAlertCreation = false;
            for (const [jobName, job] of Object.entries(monitoring.jobs)) {
                if (job.steps) {
                    for (const step of job.steps) {
                        if (step.uses && step.uses.includes('github-script') && 
                            step.with && step.with.script && 
                            step.with.script.includes('issues.create')) {
                            hasAlertCreation = true;
                            break;
                        }
                    }
                }
                if (hasAlertCreation) break;
            }
            
            if (!hasAlertCreation) {
                throw new Error('Monitoring workflow should create alerts on failure');
            }
        });
    }

    async runTest(testName, testFunction) {
        this.results.total++;
        
        try {
            await testFunction();
            this.results.passed++;
            console.log(`  ✅ ${testName}`);
        } catch (error) {
            this.results.failed++;
            this.results.errors.push({
                test: testName,
                error: error.message
            });
            console.log(`  ❌ ${testName}: ${error.message}`);
        }
    }

    addError(test, message) {
        this.results.errors.push({ test, error: message });
        console.log(`  ❌ ${test}: ${message}`);
    }

    addWarning(message) {
        this.results.warnings.push(message);
        console.log(`  ⚠️  ${message}`);
    }

    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 WORKFLOW INTEGRATION TEST REPORT');
        console.log('='.repeat(60));
        
        const successRate = this.results.total > 0 
            ? ((this.results.passed / this.results.total) * 100).toFixed(1)
            : 0;
            
        console.log(`✅ Tests Passed: ${this.results.passed}`);
        console.log(`❌ Tests Failed: ${this.results.failed}`);
        console.log(`📊 Total Tests: ${this.results.total}`);
        console.log(`📈 Success Rate: ${successRate}%`);
        console.log(`⚠️  Warnings: ${this.results.warnings.length}`);
        
        if (this.results.failed > 0) {
            console.log('\n❌ FAILED TESTS:');
            this.results.errors.forEach(error => {
                console.log(`  • ${error.test}: ${error.error}`);
            });
        }
        
        if (this.results.warnings.length > 0) {
            console.log('\n⚠️  WARNINGS:');
            this.results.warnings.forEach(warning => {
                console.log(`  • ${warning}`);
            });
        }
        
        if (this.results.failed === 0) {
            console.log('\n🎉 ALL TESTS PASSED! Workflow integration is ready for production.');
        } else {
            console.log('\n🚨 TESTS FAILED! Please fix the issues before deploying workflows.');
        }
        
        // Save report to file
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                passed: this.results.passed,
                failed: this.results.failed,
                total: this.results.total,
                successRate: successRate + '%',
                warnings: this.results.warnings.length
            },
            errors: this.results.errors,
            warnings: this.results.warnings
        };
        
        fs.writeFileSync('workflow-integration-test-report.json', JSON.stringify(report, null, 2));
        console.log('\n📄 Detailed report saved to: workflow-integration-test-report.json');
    }
}

// Run the tests if this script is executed directly
if (require.main === module) {
    // Check if js-yaml is available
    try {
        require('js-yaml');
    } catch (error) {
        console.log('📦 Installing required dependency: js-yaml');
        require('child_process').execSync('npm install js-yaml', { stdio: 'inherit' });
    }
    
    const tester = new WorkflowIntegrationTester();
    tester.runAllTests().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('❌ Test runner failed:', error);
        process.exit(1);
    });
}

module.exports = WorkflowIntegrationTester;