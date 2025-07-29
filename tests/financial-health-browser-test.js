#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('\n💰 Financial Health Score Test Suite');
console.log('=====================================\n');

let testsPassed = 0;
let testsFailed = 0;

function logTest(name, passed, message = '') {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${name}`);
    if (message) {
        console.log(`    ${message}`);
    }
    
    if (passed) {
        testsPassed++;
    } else {
        testsFailed++;
    }
}

// Test 1: Check if financial health engine file exists
function testFileExists() {
    console.log('\n📁 Testing Financial Health Files...');
    
    const requiredFiles = [
        'src/utils/financialHealthEngine.js',
        'tests/scenarios/financial-health-scenarios.test.js',
        'test-scenarios-runner.html',
        'verify-fixes.html',
        'verify-rsu-fix.html'
    ];
    
    requiredFiles.forEach(file => {
        const filePath = path.join(__dirname, '..', file);
        const exists = fs.existsSync(filePath);
        logTest(`File exists: ${file}`, exists, 
            exists ? '' : `Missing file: ${file}`);
    });
}

// Test 2: Check financial health engine syntax
function testEngineSyntax() {
    console.log('\n🔍 Testing Financial Health Engine Syntax...');
    
    const enginePath = path.join(__dirname, '..', 'src', 'utils', 'financialHealthEngine.js');
    
    try {
        const content = fs.readFileSync(enginePath, 'utf8');
        
        // Check for key functions
        const functions = [
            'calculateFinancialHealthScore',
            'calculateSavingsRateScore',
            'calculateRetirementReadinessScore',
            'calculateEmergencyFundScore',
            'validateFinancialInputs',
            'safeParseFloat',
            'safeDivide',
            'safeMultiply',
            'safePercentage'
        ];
        
        functions.forEach(func => {
            const hasFunction = content.includes(`function ${func}`) || 
                               content.includes(`${func} =`) ||
                               content.includes(`${func}:`);
            logTest(`Function defined: ${func}`, hasFunction);
        });
        
        // Check for safe calculation usage
        const safeCalculations = [
            { pattern: 'safeDivide(', name: 'Safe division usage' },
            { pattern: 'safeMultiply(', name: 'Safe multiplication usage' },
            { pattern: 'safePercentage(', name: 'Safe percentage usage' },
            { pattern: 'safeParseFloat(', name: 'Safe parse float usage' }
        ];
        
        safeCalculations.forEach(calc => {
            const count = (content.match(new RegExp(calc.pattern.replace('(', '\\('), 'g')) || []).length;
            logTest(calc.name, count > 0, `Found ${count} occurrences`);
        });
        
        // Check for RSU handling
        const hasRSUHandling = content.includes('rsuUnits') && 
                              content.includes('rsuCurrentStockPrice') &&
                              content.includes('rsuFrequency');
        logTest('RSU income handling', hasRSUHandling);
        
        // Check for US retirement accounts
        const has401k = content.includes('current401k') || content.includes('401kBalance');
        const hasIRA = content.includes('currentIRA') || content.includes('iraBalance');
        logTest('401k support', has401k);
        logTest('IRA support', hasIRA);
        
        // Check for field mapping enhancements
        const hasGetFieldValue = content.includes('function getFieldValue');
        const hasFieldMapping = content.includes('combinePartners') && 
                               content.includes('allowZero') &&
                               content.includes('debugMode');
        logTest('Enhanced field mapping', hasGetFieldValue && hasFieldMapping);
        
    } catch (error) {
        logTest('Financial Health Engine syntax', false, `Error reading file: ${error.message}`);
    }
}

// Test 3: Check test scenarios structure
function testScenariosStructure() {
    console.log('\n📋 Testing Scenarios Structure...');
    
    const scenariosPath = path.join(__dirname, 'scenarios', 'financial-health-scenarios.test.js');
    
    try {
        const content = fs.readFileSync(scenariosPath, 'utf8');
        
        // Check for TEST_SCENARIOS array
        const hasTestScenarios = content.includes('TEST_SCENARIOS');
        logTest('TEST_SCENARIOS defined', hasTestScenarios);
        
        // Count scenarios
        const scenarioMatches = content.match(/id:\s*\d+/g) || [];
        const scenarioCount = scenarioMatches.length;
        logTest('Scenario count', scenarioCount === 10, `Found ${scenarioCount} scenarios (expected 10)`);
        
        // Check for ScenarioTestRunner
        const hasTestRunner = content.includes('class ScenarioTestRunner');
        logTest('ScenarioTestRunner class', hasTestRunner);
        
        // Check for key scenario properties
        const requiredProps = [
            'planningType',
            'currentAge',
            'retirementAge',
            'expected.totalScore',
            'expected.factors'
        ];
        
        requiredProps.forEach(prop => {
            const hasProp = content.includes(prop);
            logTest(`Scenario property: ${prop}`, hasProp);
        });
        
        // Check for diverse scenarios
        const scenarioTypes = [
            { pattern: 'Young Professional', name: 'Young Professional scenario' },
            { pattern: 'Mid-Career Couple', name: 'Couple scenario' },
            { pattern: 'Pre-Retirement', name: 'Pre-Retirement scenario' },
            { pattern: 'High Earner.*RSU', name: 'RSU scenario' },
            { pattern: 'Debt-Heavy', name: 'Debt scenario' },
            { pattern: 'Crypto Investor', name: 'Crypto scenario' },
            { pattern: 'Conservative Retiree', name: 'Retiree scenario' }
        ];
        
        scenarioTypes.forEach(scenario => {
            const hasScenario = new RegExp(scenario.pattern).test(content);
            logTest(scenario.name, hasScenario);
        });
        
    } catch (error) {
        logTest('Test scenarios structure', false, `Error reading file: ${error.message}`);
    }
}

// Test 4: Check HTML test runners
function testHTMLRunners() {
    console.log('\n🌐 Testing HTML Test Runners...');
    
    const htmlFiles = [
        { file: 'test-scenarios-runner.html', name: 'Main test runner' },
        { file: 'verify-fixes.html', name: 'Fixes verification runner' },
        { file: 'verify-rsu-fix.html', name: 'RSU fix verification' }
    ];
    
    htmlFiles.forEach(({ file, name }) => {
        const filePath = path.join(__dirname, '..', file);
        
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Check for required scripts
            const hasFinancialHealthEngine = content.includes('financialHealthEngine.js');
            const hasTestScenarios = content.includes('financial-health-scenarios.test.js');
            const hasRunFunction = content.includes('runAllTests') || content.includes('runTest');
            
            logTest(`${name} - loads engine`, hasFinancialHealthEngine);
            logTest(`${name} - has run function`, hasRunFunction);
            
            if (file === 'test-scenarios-runner.html') {
                logTest(`${name} - loads scenarios`, hasTestScenarios);
            }
            
        } catch (error) {
            logTest(name, false, `Error reading file: ${error.message}`);
        }
    });
}

// Test 5: Check documentation
function testDocumentation() {
    console.log('\n📚 Testing Documentation...');
    
    const docs = [
        { file: 'docs/AUDIT-001-PHASE-1-FIXES.md', name: 'Phase 1 fixes documentation' },
        { file: 'docs/AUDIT-001-ALL-FIXES-SUMMARY.md', name: 'All fixes summary' },
        { file: 'docs/AUDIT-001-IMPLEMENTATION-SUMMARY.md', name: 'Implementation summary' },
        { file: 'docs/AUDIT-PROCESS-TEMPLATE.md', name: 'Audit process template' }
    ];
    
    docs.forEach(({ file, name }) => {
        const filePath = path.join(__dirname, '..', file);
        const exists = fs.existsSync(filePath);
        logTest(name, exists);
        
        if (exists) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const hasContent = content.length > 100;
                const hasMarkdown = content.includes('#') && content.includes('##');
                logTest(`${name} - has content`, hasContent && hasMarkdown);
            } catch (error) {
                // Skip content check if can't read
            }
        }
    });
}

// Run all tests
function runTests() {
    testFileExists();
    testEngineSyntax();
    testScenariosStructure();
    testHTMLRunners();
    testDocumentation();
    
    // Summary
    console.log('\n📊 Financial Health Test Summary');
    console.log('================================');
    console.log(`Tests Passed: ${testsPassed}`);
    console.log(`Tests Failed: ${testsFailed}`);
    console.log(`Success Rate: ${testsPassed + testsFailed > 0 ? Math.round((testsPassed / (testsPassed + testsFailed)) * 100) : 0}%`);
    
    // Integration instructions
    if (testsPassed > 30) {
        console.log('\n✅ Financial Health test suite is ready for integration!');
        console.log('\n📝 To run the full scenario tests:');
        console.log('   1. Open test-scenarios-runner.html in a browser');
        console.log('   2. Click "Run All Tests" to execute all 10 scenarios');
        console.log('   3. Review the detailed results and debug output');
        console.log('\n🔧 To verify specific fixes:');
        console.log('   - RSU fix: Open verify-rsu-fix.html');
        console.log('   - All fixes: Open verify-fixes.html');
    }
    
    process.exit(testsFailed > 0 ? 1 : 0);
}

// Run the tests
runTests();