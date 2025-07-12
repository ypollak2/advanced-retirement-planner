#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('🧪 Advanced Retirement Planner Test Suite');
console.log('==========================================\n');

let testsPassed = 0;
let testsFailed = 0;

function logTest(name, passed, message = '') {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    
    console.log(`[${timestamp}] ${status} ${name}`);
    if (message) {
        console.log(`    ${message}`);
    }
    
    if (passed) {
        testsPassed++;
    } else {
        testsFailed++;
    }
}

// Test 1: File Structure
function testFileStructure() {
    console.log('\n📁 Testing File Structure...');
    
    const requiredFiles = [
        'index.html',
        'version.json',
        'update-version.js',
        'src/translations/multiLanguage.js',
        'src/data/marketConstants.js',
        'src/utils/retirementCalculations.js',
        'src/components/RetirementPlannerApp.js',
        'src/components/RetirementBasicForm.js',
        'src/components/RetirementAdvancedForm.js',
        'src/components/RetirementResultsPanel.js'
    ];
    
    requiredFiles.forEach(file => {
        const exists = fs.existsSync(file);
        logTest(`File exists: ${file}`, exists, 
            exists ? '' : `Missing required file: ${file}`);
    });
}

// Test 2: JavaScript Syntax
function testJavaScriptSyntax() {
    console.log('\n🔍 Testing JavaScript Syntax...');
    
    const jsFiles = [
        'src/utils/retirementCalculations.js',
        'src/components/RetirementPlannerApp.js',
        'src/components/RetirementBasicForm.js',
        'src/components/RetirementAdvancedForm.js',
        'src/components/RetirementResultsPanel.js'
    ];
    
    jsFiles.forEach(file => {
        if (!fs.existsSync(file)) {
            logTest(`Syntax check: ${file}`, false, 'File does not exist');
            return;
        }
        
        try {
            const content = fs.readFileSync(file, 'utf8');
            
            // Check for problematic patterns
            const issues = [];
            
            if (content.includes('export ') || content.includes('import ')) {
                issues.push('Contains ES6 module syntax (incompatible with script tags)');
            }
            
            if (content.includes('const { useState') || content.includes('const { createElement')) {
                issues.push('Contains destructuring assignments that cause redeclaration errors');
            }
            
            if (content.includes('useState(') && !content.includes('React.useState(')) {
                issues.push('Uses raw useState instead of React.useState');
            }
            
            if (content.includes('createElement(') && !content.includes('React.createElement(')) {
                issues.push('Uses raw createElement instead of React.createElement');
            }
            
            const passed = issues.length === 0;
            logTest(`Syntax check: ${file}`, passed, 
                passed ? 'No syntax issues found' : `Issues: ${issues.join('; ')}`);
                
        } catch (error) {
            logTest(`Syntax check: ${file}`, false, `Error reading file: ${error.message}`);
        }
    });
}

// Test 3: Version Management
function testVersionManagement() {
    console.log('\n🔄 Testing Version Management...');
    
    try {
        // Test version.json
        const versionData = JSON.parse(fs.readFileSync('version.json', 'utf8'));
        const hasVersion = versionData.version && typeof versionData.version === 'string';
        logTest('version.json format', hasVersion, 
            hasVersion ? `Current version: ${versionData.version}` : 'Invalid version format');
        
        // Test update script
        const updateScriptExists = fs.existsSync('update-version.js');
        logTest('update-version.js exists', updateScriptExists);
        
        if (updateScriptExists) {
            const updateScript = fs.readFileSync('update-version.js', 'utf8');
            const hasVersionLogic = updateScript.includes('version.json') && updateScript.includes('README.md');
            logTest('update-version.js functionality', hasVersionLogic,
                hasVersionLogic ? 'Script contains version update logic' : 'Missing version update logic');
        }
        
    } catch (error) {
        logTest('Version management', false, `Error: ${error.message}`);
    }
}

// Dynamic Architecture Discovery
function discoverArchitecture() {
    const entryPointCandidates = ['index.html', 'index-modular.html', 'main.html', 'app.html'];
    const entryPoint = entryPointCandidates.find(file => fs.existsSync(file)) || 'index.html';
    
    let architectureType = 'unknown';
    let html = '';
    
    try {
        html = fs.readFileSync(entryPoint, 'utf8');
        
        // Detect architecture type
        if (html.includes('src/core/') || html.includes('loadScript') || html.includes('dynamic-loader')) {
            architectureType = 'modular';
        } else if (html.includes('src/components/')) {
            architectureType = 'component-based';
        } else if (html.length > 100000) {
            architectureType = 'monolithic';
        } else {
            architectureType = 'simple';
        }
        
    } catch (error) {
        console.warn(`Warning: Could not read ${entryPoint}: ${error.message}`);
    }
    
    return {
        entryPoint,
        architectureType,
        html,
        hasModules: html.includes('src/modules/') || html.includes('loadModule'),
        hasErrorBoundary: html.includes('ErrorBoundary'),
        hasDynamicLoading: html.includes('loadScript') || html.includes('import(')
    };
}

// Test 4: HTML Structure - Dynamic and Architecture-Aware
function testHtmlStructure() {
    console.log('\n🌐 Testing HTML Structure...');
    
    try {
        const arch = discoverArchitecture();
        console.log(`   📍 Entry point: ${arch.entryPoint}`);
        console.log(`   🏗️  Architecture: ${arch.architectureType}`);
        
        if (!arch.html) {
            logTest('HTML structure', false, `Could not read entry point: ${arch.entryPoint}`);
            return;
        }
        
        // Dynamic checks based on discovered architecture
        const checks = [
            { 
                name: 'React CDN', 
                test: arch.html.includes('react.production.min.js') || arch.html.includes('react.development.js') 
            },
            { 
                name: 'ReactDOM CDN', 
                test: arch.html.includes('react-dom.production.min.js') || arch.html.includes('react-dom.development.js') 
            },
            { 
                name: 'Script tags for components', 
                test: arch.html.includes('src/core/') || arch.html.includes('src/modules/') || arch.html.includes('src/components/') 
            },
            { 
                name: 'Cache busting parameters', 
                test: arch.html.includes('?v=') 
            },
            { 
                name: 'Error boundary', 
                test: arch.hasErrorBoundary 
            },
            { 
                name: 'Module loading check', 
                test: arch.html.includes('checkDependencies') || arch.html.includes('checkModules') || arch.html.includes('loadScript') 
            },
            { 
                name: 'Application initialization', 
                test: arch.html.includes('initializeRetirementPlannerCore') || 
                      arch.html.includes('initializeApp') || 
                      (arch.html.includes('RetirementPlannerApp') && arch.html.includes('BasicInputs')) 
            }
        ];
        
        // Additional checks for modular architecture
        if (arch.architectureType === 'modular') {
            checks.push({
                name: 'Dynamic loading system',
                test: arch.hasDynamicLoading
            });
        }
        
        checks.forEach(check => {
            logTest(`HTML: ${check.name}`, check.test);
        });
        
        // Architecture-specific feedback
        if (arch.architectureType === 'modular') {
            console.log('   ✨ Modular architecture detected - advanced features available');
        }
        
    } catch (error) {
        logTest('HTML structure', false, `Error during architecture discovery: ${error.message}`);
    }
}

// Test 5: Module Exports
function testModuleExports() {
    console.log('\n📦 Testing Module Exports...');
    
    const moduleFiles = [
        { file: 'src/components/RetirementPlannerApp.js', exports: ['RetirementPlannerApp'] },
        { file: 'src/components/RetirementBasicForm.js', exports: ['BasicInputs'] },
        { file: 'src/components/RetirementAdvancedForm.js', exports: ['AdvancedInputs'] },
        { file: 'src/components/RetirementResultsPanel.js', exports: ['ResultsPanel'] },
        { file: 'src/utils/retirementCalculations.js', exports: ['calculateRetirement', 'formatCurrency'] },
        { file: 'src/translations/multiLanguage.js', exports: ['multiLanguage'] },
        { file: 'src/data/marketConstants.js', exports: ['countryData'] }
    ];
    
    moduleFiles.forEach(({ file, exports }) => {
        if (!fs.existsSync(file)) {
            logTest(`Module exports: ${file}`, false, 'File does not exist');
            return;
        }
        
        try {
            const content = fs.readFileSync(file, 'utf8');
            
            exports.forEach(exportName => {
                const hasExport = content.includes(`window.${exportName}`) || content.includes(`window['${exportName}']`);
                logTest(`Export: ${exportName} in ${file}`, hasExport,
                    hasExport ? '' : `Missing window.${exportName} export`);
            });
            
        } catch (error) {
            logTest(`Module exports: ${file}`, false, `Error: ${error.message}`);
        }
    });
}

// Test 6: Performance Checks
function testPerformance() {
    console.log('\n⚡ Testing Performance...');
    
    try {
        const html = fs.readFileSync('index.html', 'utf8');
        const htmlSize = Buffer.byteLength(html, 'utf8');
        
        logTest('HTML size reasonable', htmlSize < 100000, 
            `HTML size: ${(htmlSize / 1024).toFixed(1)}KB ${htmlSize >= 100000 ? '(too large!)' : '(good)'}`);
        
        // Check for performance optimizations
        const optimizations = [
            { name: 'CDN usage', test: html.includes('cdn.jsdelivr.net') || html.includes('unpkg.com') },
            { name: 'Cache busting', test: html.includes('?v=') },
            { name: 'Minimal inline scripts', test: (html.match(/<script>/g) || []).length < 5 }
        ];
        
        optimizations.forEach(opt => {
            logTest(`Performance: ${opt.name}`, opt.test);
        });
        
    } catch (error) {
        logTest('Performance checks', false, `Error: ${error.message}`);
    }
}

// Test 7: Security Checks
function testSecurity() {
    console.log('\n🔒 Testing Security...');
    
    try {
        const html = fs.readFileSync('index.html', 'utf8');
        
        const securityChecks = [
            { 
                name: 'No inline event handlers', 
                test: !html.includes('onclick=') && !html.includes('onload='),
                message: 'Inline event handlers can be security risks'
            },
            { 
                name: 'No external scripts from untrusted domains', 
                test: !html.includes('src="http://'),
                message: 'All external scripts should use HTTPS'
            },
            { 
                name: 'CSP considerations', 
                test: html.includes('Content-Security-Policy') || !html.includes('eval' + '('),
                message: 'No obvious CSP violations found'
            }
        ];
        
        securityChecks.forEach(check => {
            logTest(`Security: ${check.name}`, check.test, check.message);
        });
        
    } catch (error) {
        logTest('Security checks', false, `Error: ${error.message}`);
    }
}

// Main test execution
async function runAllTests() {
    console.log('Starting automated test suite...\n');
    
    testFileStructure();
    testJavaScriptSyntax();
    testVersionManagement();
    testHtmlStructure();
    testModuleExports();
    testPerformance();
    testSecurity();
    
    // Summary
    console.log('\n📊 Test Summary');
    console.log('================');
    console.log(`✅ Tests Passed: ${testsPassed}`);
    console.log(`❌ Tests Failed: ${testsFailed}`);
    console.log(`📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
    
    if (testsFailed === 0) {
        console.log('\n🎉 All tests passed! App is ready for deployment.');
        process.exit(0);
    } else {
        console.log('\n⚠️  Some tests failed. Please fix issues before deployment.');
        console.log('\n💡 Quick fixes:');
        console.log('   • Run: npm run test:local  (for visual testing)');
        console.log('   • Check: window exports in all component files');
        console.log('   • Verify: React.useState instead of useState');
        console.log('   • Ensure: No ES6 import/export statements');
        process.exit(1);
    }
}

// Run tests
runAllTests().catch(error => {
    console.error('\n💥 Test runner crashed:', error.message);
    process.exit(1);
});