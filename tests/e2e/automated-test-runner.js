// Automated Test Runner for E2E Financial Health Testing
// Executes all test scenarios with progress tracking and CI/CD integration

class AutomatedTestRunner {
    constructor(options = {}) {
        this.options = {
            parallel: options.parallel || false,
            maxConcurrent: options.maxConcurrent || 5,
            timeout: options.timeout || 30000, // 30 seconds per test
            retryFailedTests: options.retryFailedTests || true,
            maxRetries: options.maxRetries || 2,
            stopOnFailure: options.stopOnFailure || false,
            verbose: options.verbose || false,
            exportFormat: options.exportFormat || 'json',
            outputPath: options.outputPath || './test-results/',
            headless: options.headless || false
        };

        this.testQueue = [];
        this.activeTests = new Map();
        this.completedTests = [];
        this.failedTests = [];
        this.logger = null;
        this.startTime = null;
        this.abortController = new AbortController();
    }

    // Initialize test runner
    async initialize() {
        console.log('🚀 Initializing E2E Test Runner...');
        
        // Load dependencies
        await this.loadDependencies();
        
        // Initialize logger
        this.logger = new window.TestLogger();
        
        // Initialize test data generator
        this.dataGenerator = new window.TestDataGenerator();
        
        // Initialize validators
        this.fieldValidator = new window.FieldMappingValidator();
        this.scoreValidator = new window.ScoreValidationEngine();
        
        // Generate test scenarios
        this.scenarios = this.dataGenerator.generateAllScenarios();
        console.log(`✅ Generated ${this.scenarios.length} test scenarios`);
        
        // Initialize test queue
        this.testQueue = [...this.scenarios];
        
        return true;
    }

    // Load required dependencies
    async loadDependencies() {
        const dependencies = [
            'test-logger.js',
            'test-data-generator.js',
            'field-mapping-validator.js',
            'score-validation-engine.js'
        ];

        for (const dep of dependencies) {
            if (!window[this.getClassName(dep)]) {
                await this.loadScript(`tests/e2e/${dep}`);
            }
        }
    }

    // Get class name from filename
    getClassName(filename) {
        const name = filename.replace('.js', '').split('-')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join('');
        return name;
    }

    // Load script dynamically
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Run all tests
    async runAllTests() {
        console.log('🏃 Starting E2E test execution...');
        this.startTime = Date.now();
        
        try {
            // Initialize if not already done
            if (!this.logger) {
                await this.initialize();
            }

            // Show progress UI
            this.showProgress();

            // Execute tests based on mode
            if (this.options.parallel) {
                await this.runTestsParallel();
            } else {
                await this.runTestsSequential();
            }

            // Generate final report
            const report = await this.generateFinalReport();
            
            // Export results
            await this.exportResults(report);
            
            // Show summary
            this.showSummary(report);
            
            return report;

        } catch (error) {
            console.error('❌ Test runner failed:', error);
            this.logger.logError(error, { phase: 'test_runner' });
            throw error;
        }
    }

    // Run tests sequentially
    async runTestsSequential() {
        while (this.testQueue.length > 0 && !this.abortController.signal.aborted) {
            const scenario = this.testQueue.shift();
            await this.executeTest(scenario);
            
            // Check if we should stop on failure
            if (this.options.stopOnFailure && this.failedTests.length > 0) {
                console.log('⛔ Stopping execution due to test failure');
                break;
            }
        }
    }

    // Run tests in parallel
    async runTestsParallel() {
        const promises = [];
        
        while (this.testQueue.length > 0 || this.activeTests.size > 0) {
            // Start new tests if under limit
            while (this.testQueue.length > 0 && 
                   this.activeTests.size < this.options.maxConcurrent &&
                   !this.abortController.signal.aborted) {
                
                const scenario = this.testQueue.shift();
                const promise = this.executeTest(scenario);
                this.activeTests.set(scenario.id, promise);
                promises.push(promise);
            }
            
            // Wait for at least one test to complete
            if (this.activeTests.size > 0) {
                await Promise.race(Array.from(this.activeTests.values()));
            }
            
            // Clean up completed tests
            for (const [id, promise] of this.activeTests.entries()) {
                if (await this.isPromiseResolved(promise)) {
                    this.activeTests.delete(id);
                }
            }
            
            // Check stop condition
            if (this.options.stopOnFailure && this.failedTests.length > 0) {
                console.log('⛔ Stopping parallel execution due to test failure');
                this.abortController.abort();
                break;
            }
        }
        
        // Wait for all remaining tests
        await Promise.all(promises);
    }

    // Check if promise is resolved
    async isPromiseResolved(promise) {
        try {
            await Promise.race([promise, Promise.resolve()]);
            return true;
        } catch {
            return false;
        }
    }

    // Execute single test scenario
    async executeTest(scenario, retryCount = 0) {
        const testId = `${scenario.id}${retryCount > 0 ? `_retry${retryCount}` : ''}`;
        console.log(`🧪 Executing test: ${testId}`);
        
        try {
            // Start scenario logging
            this.logger.startScenario(scenario);
            
            // Create test context
            const testContext = {
                scenario: scenario,
                startTime: Date.now(),
                wizardData: {},
                scoringResult: null,
                validationResults: {}
            };
            
            // Execute test with timeout
            const result = await this.withTimeout(
                this.executeTestScenario(testContext),
                this.options.timeout
            );
            
            // Record success
            this.completedTests.push({
                scenarioId: scenario.id,
                result: result,
                duration: Date.now() - testContext.startTime,
                retryCount: retryCount
            });
            
            // End scenario logging
            this.logger.endScenario(scenario.id, result);
            
            // Update progress
            this.updateProgress();
            
            return result;
            
        } catch (error) {
            console.error(`❌ Test failed: ${testId}`, error);
            this.logger.logError(error, { scenario: scenario.id });
            
            // Retry logic
            if (this.options.retryFailedTests && retryCount < this.options.maxRetries) {
                console.log(`🔄 Retrying test: ${scenario.id} (attempt ${retryCount + 1})`);
                return await this.executeTest(scenario, retryCount + 1);
            }
            
            // Record failure
            this.failedTests.push({
                scenarioId: scenario.id,
                error: error,
                retryCount: retryCount
            });
            
            // Update progress
            this.updateProgress();
            
            return {
                passed: false,
                error: error.message,
                scenario: scenario
            };
        }
    }

    // Execute test scenario steps
    async executeTestScenario(context) {
        const { scenario } = context;
        
        // Step 1: Initialize wizard with test data
        this.logger.log('INFO', 'Initializing wizard with test data');
        await this.initializeWizard(scenario.inputs);
        
        // Step 2: Progress through all wizard steps
        for (let step = 1; step <= 9; step++) {
            this.logger.logWizardStep(step, this.getCurrentWizardData());
            await this.progressWizardStep(step, scenario.inputs);
            
            // Validate data persistence
            const stepData = this.getCurrentWizardData();
            context.wizardData[`step${step}`] = stepData;
        }
        
        // Step 3: Calculate financial health score
        this.logger.log('INFO', 'Calculating financial health score');
        const scoringResult = await this.calculateScore(scenario.inputs);
        context.scoringResult = scoringResult;
        
        // Step 4: Validate field mappings
        const fieldValidation = this.fieldValidator.validateScenario(
            scenario,
            context.wizardData.step9 || context.wizardData,
            scoringResult
        );
        context.validationResults.fieldMapping = fieldValidation;
        
        // Step 5: Validate score
        const scoreValidation = this.scoreValidator.validateScore(
            scenario,
            scoringResult
        );
        context.validationResults.score = scoreValidation;
        
        // Step 6: Compile results
        const testPassed = fieldValidation.passed && scoreValidation.passed;
        const issues = [
            ...fieldValidation.issues,
            ...scoreValidation.issues
        ];
        
        return {
            passed: testPassed,
            scenario: scenario,
            score: {
                actual: scoringResult.totalScore,
                expected: scenario.expectedScoreRange
            },
            issues: issues,
            validationResults: context.validationResults,
            scoringResult: scoringResult
        };
    }

    // Initialize wizard with test data
    async initializeWizard(inputs) {
        // Clear any existing data
        localStorage.removeItem('retirementWizardInputs');
        localStorage.removeItem('wizardCurrentStep');
        
        // Set planning type first
        if (inputs.planningType) {
            window.retirementWizard?.setPlanningType?.(inputs.planningType);
        }
        
        // Initialize wizard state
        window.retirementWizard?.initializeWizard?.();
        
        // Wait for initialization
        await this.waitFor(() => window.retirementWizard?.isInitialized, 1000);
    }

    // Progress wizard step
    async progressWizardStep(step, inputs) {
        // Map inputs to wizard fields for this step
        const stepFields = this.getStepFields(step, inputs);
        
        // Set field values
        Object.entries(stepFields).forEach(([field, value]) => {
            this.setWizardField(field, value);
        });
        
        // Save and progress
        window.retirementWizard?.saveCurrentStep?.();
        
        if (step < 9) {
            window.retirementWizard?.nextStep?.();
            await this.waitFor(() => window.retirementWizard?.currentStep === step + 1, 1000);
        }
    }

    // Get current wizard data
    getCurrentWizardData() {
        const savedData = localStorage.getItem('retirementWizardInputs');
        return savedData ? JSON.parse(savedData) : {};
    }

    // Calculate financial health score
    async calculateScore(inputs) {
        // Get the scoring engine
        const engine = window.financialHealthEngine;
        if (!engine) {
            throw new Error('Financial health engine not available');
        }
        
        // Calculate score
        const result = engine.calculateHealthScore(inputs);
        
        // Log the result
        this.logger.log('DEBUG', 'Score calculated', {
            totalScore: result.totalScore,
            factors: Object.keys(result.factorScores || {})
        });
        
        return result;
    }

    // Get fields for specific wizard step
    getStepFields(step, inputs) {
        const stepMappings = {
            1: ['planningType', 'currentAge', 'retirementAge', 'country'],
            2: ['currentMonthlySalary', 'partner1Salary', 'partner2Salary'],
            3: ['currentMonthlyExpenses'],
            4: ['currentPension', 'currentTrainingFund', 'currentPortfolio', 'emergencyFund'],
            5: ['pensionContributionRate', 'trainingFundContributionRate'],
            6: ['pensionManagementFee', 'trainingFundManagementFee'],
            7: ['riskTolerance', 'expectedAnnualReturn'],
            8: ['retirementGoal', 'monthlyRetirementIncome'],
            9: []
        };
        
        const fields = {};
        const stepFieldNames = stepMappings[step] || [];
        
        stepFieldNames.forEach(field => {
            if (inputs[field] !== undefined) {
                fields[field] = inputs[field];
            }
        });
        
        return fields;
    }

    // Set wizard field value
    setWizardField(fieldName, value) {
        // Try different methods to set field
        const element = document.querySelector(`[name="${fieldName}"], #${fieldName}`);
        if (element) {
            element.value = value;
            element.dispatchEvent(new Event('change', { bubbles: true }));
        }
        
        // Also try direct wizard method
        if (window.retirementWizard?.setFieldValue) {
            window.retirementWizard.setFieldValue(fieldName, value);
        }
    }

    // Execute with timeout
    withTimeout(promise, timeout) {
        return Promise.race([
            promise,
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Test timeout')), timeout)
            )
        ]);
    }

    // Wait for condition
    waitFor(condition, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const interval = setInterval(() => {
                if (condition()) {
                    clearInterval(interval);
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(interval);
                    reject(new Error('Wait timeout'));
                }
            }, 100);
        });
    }

    // Show progress UI
    showProgress() {
        if (this.options.headless) return;
        
        const progressHtml = `
        <div id="test-progress" style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 1px solid #ccc;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 10000;
            min-width: 300px;
        ">
            <h3 style="margin: 0 0 10px 0;">E2E Test Progress</h3>
            <div id="progress-stats">
                <div>Total: <span id="progress-total">0</span></div>
                <div>Completed: <span id="progress-completed">0</span></div>
                <div>Failed: <span id="progress-failed">0</span></div>
                <div>Remaining: <span id="progress-remaining">0</span></div>
            </div>
            <div style="margin-top: 10px;">
                <div style="background: #f0f0f0; height: 20px; border-radius: 10px; overflow: hidden;">
                    <div id="progress-bar" style="
                        background: #28a745;
                        height: 100%;
                        width: 0%;
                        transition: width 0.3s;
                    "></div>
                </div>
            </div>
            <div id="progress-current" style="margin-top: 10px; font-size: 12px; color: #666;"></div>
        </div>`;
        
        const div = document.createElement('div');
        div.innerHTML = progressHtml;
        document.body.appendChild(div);
    }

    // Update progress display
    updateProgress() {
        if (this.options.headless) return;
        
        const total = this.scenarios.length;
        const completed = this.completedTests.length;
        const failed = this.failedTests.length;
        const remaining = total - completed - failed;
        const percentage = (completed + failed) / total * 100;
        
        document.getElementById('progress-total').textContent = total;
        document.getElementById('progress-completed').textContent = completed;
        document.getElementById('progress-failed').textContent = failed;
        document.getElementById('progress-remaining').textContent = remaining;
        document.getElementById('progress-bar').style.width = percentage + '%';
        
        if (failed > 0) {
            document.getElementById('progress-bar').style.background = '#ffc107';
        }
        
        const current = this.activeTests.size > 0 
            ? `Running ${this.activeTests.size} tests...` 
            : 'Idle';
        document.getElementById('progress-current').textContent = current;
    }

    // Generate final report
    async generateFinalReport() {
        const report = this.logger.generateReport();
        
        // Add runner-specific metrics
        report.runnerMetrics = {
            totalDuration: Date.now() - this.startTime,
            mode: this.options.parallel ? 'parallel' : 'sequential',
            maxConcurrent: this.options.maxConcurrent,
            retriedTests: this.completedTests.filter(t => t.retryCount > 0).length,
            aborted: this.abortController.signal.aborted
        };
        
        // Add test categorization
        report.testsByCategory = this.categorizeTests();
        
        return report;
    }

    // Categorize test results
    categorizeTests() {
        const categories = {};
        
        this.completedTests.forEach(test => {
            const category = test.result.scenario.category;
            if (!categories[category]) {
                categories[category] = {
                    total: 0,
                    passed: 0,
                    failed: 0
                };
            }
            categories[category].total++;
            if (test.result.passed) {
                categories[category].passed++;
            } else {
                categories[category].failed++;
            }
        });
        
        return categories;
    }

    // Export results
    async exportResults(report) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `e2e-test-results-${timestamp}.${this.options.exportFormat}`;
        
        if (this.options.outputPath) {
            // In browser context, download the file
            this.logger.downloadReport(this.options.exportFormat, filename);
        }
        
        console.log(`📄 Results exported: ${filename}`);
    }

    // Show test summary
    showSummary(report) {
        const duration = (report.runnerMetrics.totalDuration / 1000).toFixed(2);
        
        console.log('\n' + '='.repeat(60));
        console.log('E2E TEST EXECUTION SUMMARY');
        console.log('='.repeat(60));
        console.log(`Total Tests: ${report.summary.totalTests}`);
        console.log(`Passed: ${report.summary.passed} ✅`);
        console.log(`Failed: ${report.summary.failed} ❌`);
        console.log(`Success Rate: ${report.summary.successRate}`);
        console.log(`Duration: ${duration}s`);
        console.log(`Mode: ${report.runnerMetrics.mode}`);
        
        if (report.summary.criticalBugs.length > 0) {
            console.log('\n⚠️  CRITICAL BUGS DETECTED:');
            report.summary.criticalBugs.forEach(bug => {
                console.log(`- ${bug.type}: ${bug.description}`);
            });
        }
        
        console.log('\nScore Distribution:');
        Object.entries(report.summary.scoreDistribution).forEach(([range, count]) => {
            if (count > 0) {
                const percentage = (count / report.summary.totalTests * 100).toFixed(2);
                console.log(`  ${range}: ${count} tests (${percentage}%)`);
            }
        });
        
        console.log('='.repeat(60));
    }

    // Abort test execution
    abort() {
        console.log('🛑 Aborting test execution...');
        this.abortController.abort();
    }
}

// CLI/Node.js support
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AutomatedTestRunner;
} else {
    window.AutomatedTestRunner = AutomatedTestRunner;
}

// Auto-run if launched directly
if (typeof window !== 'undefined' && window.location.search.includes('autorun=true')) {
    window.addEventListener('load', async () => {
        const runner = new AutomatedTestRunner({
            parallel: true,
            maxConcurrent: 5,
            exportFormat: 'markdown',
            verbose: true
        });
        
        try {
            const report = await runner.runAllTests();
            console.log('✅ Test execution completed successfully');
        } catch (error) {
            console.error('❌ Test execution failed:', error);
        }
    });
}