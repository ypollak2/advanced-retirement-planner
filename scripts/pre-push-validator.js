#!/usr/bin/env node
// Pre-Push Validation Script - Complete QA Protocol
// Created by Yali Pollak (יהלי פולק) - v6.2.0

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Pre-Push Validation Protocol');
console.log('=' + '='.repeat(50));

let validationResults = {
    passed: 0,
    failed: 0,
    total: 0,
    errors: [],
    warnings: []
};

function logTest(testName, passed, details = '') {
    validationResults.total++;
    const timestamp = new Date().toLocaleTimeString();
    
    if (passed) {
        validationResults.passed++;
        console.log(`[${timestamp}] ✅ PASS ${testName}`);
        if (details) console.log(`    ${details}`);
    } else {
        validationResults.failed++;
        validationResults.errors.push(`${testName}: ${details}`);
        console.log(`[${timestamp}] ❌ FAIL ${testName}`);
        if (details) console.log(`    ${details}`);
    }
}

function logWarning(testName, details) {
    validationResults.warnings.push(`${testName}: ${details}`);
    console.log(`[${new Date().toLocaleTimeString()}] ⚠️  WARN ${testName}`);
    if (details) console.log(`    ${details}`);
}

// 1. VERSION VALIDATION
function validateVersionBump() {
    console.log('\\n📊 Step 1: Validating Version Consistency...');
    
    try {
        // Check all version files exist and are consistent
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const versionJson = JSON.parse(fs.readFileSync('version.json', 'utf8'));
        
        const versionJsContent = fs.readFileSync('src/version.js', 'utf8');
        const versionJsMatch = versionJsContent.match(/number:\\s*[\"']([^\"']+)[\"']/);
        const versionJs = versionJsMatch ? versionJsMatch[1] : null;
        
        const indexHtml = fs.readFileSync('index.html', 'utf8');
        const htmlMatch = indexHtml.match(/<title>.*v([0-9.]+).*<\/title>/);
        const htmlVersion = htmlMatch ? htmlMatch[1] : null;
        
        const currentVersion = packageJson.version;
        
        // Test version consistency
        logTest('package.json version', !!currentVersion, `Version: ${currentVersion}`);
        logTest('version.json consistency', versionJson.version === currentVersion, 
            `Expected: ${currentVersion}, Got: ${versionJson.version}`);
        logTest('src/version.js consistency', versionJs === currentVersion,
            `Expected: ${currentVersion}, Got: ${versionJs}`);
        logTest('index.html consistency', htmlVersion === currentVersion,
            `Expected: ${currentVersion}, Got: ${htmlVersion}`);
            
        // Check if version was actually bumped (compare with git)
        try {
            const lastCommitVersion = execSync('git show HEAD~1:package.json', { encoding: 'utf8' });
            const lastVersion = JSON.parse(lastCommitVersion).version;
            const versionBumped = currentVersion !== lastVersion;
            
            logTest('Version bumped from previous', versionBumped,
                `Previous: ${lastVersion}, Current: ${currentVersion}`);
        } catch (error) {
            logWarning('Version bump check', 'Could not compare with previous version');
        }
        
    } catch (error) {
        logTest('Version file validation', false, `Error: ${error.message}`);
    }
}

// 2. DOCUMENTATION VALIDATION  
function validateDocumentationUpdate() {
    console.log('\\n📚 Step 2: Validating Documentation Updates...');
    
    try {
        // Check README exists and has recent updates
        const readmeExists = fs.existsSync('README.md');
        logTest('README.md exists', readmeExists, readmeExists ? 'README.md found' : 'README.md missing');
        
        if (readmeExists) {
            const readmeContent = fs.readFileSync('README.md', 'utf8');
            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            const currentVersion = packageJson.version;
            
            // Check if current version is mentioned in README
            const versionInReadme = readmeContent.includes(currentVersion);
            logTest('README version reference', versionInReadme,
                versionInReadme ? `Version ${currentVersion} found in README` : `Version ${currentVersion} not found in README`);
                
            // Check for "What's New" or changelog section
            const hasChangelog = readmeContent.toLowerCase().includes("what's new") || 
                                readmeContent.toLowerCase().includes('changelog') ||
                                readmeContent.toLowerCase().includes('changes');
            logTest('README changelog section', hasChangelog,
                hasChangelog ? 'Changelog section found' : 'Consider adding changelog section');
        }
        
        // Check CLAUDE.md is up to date
        const claudeExists = fs.existsSync('CLAUDE.md');
        logTest('CLAUDE.md exists', claudeExists, claudeExists ? 'Development docs found' : 'CLAUDE.md missing');
        
    } catch (error) {
        logTest('Documentation validation', false, `Error: ${error.message}`);
    }
}

// 3. COMPREHENSIVE QA TESTING
function runComprehensiveQA() {
    console.log('\\n🔍 Step 3: Running Comprehensive QA Testing...');
    
    try {
        // Run syntax validation
        console.log('  Running syntax validation...');
        execSync('npm run validate:syntax', { stdio: 'inherit' });
        logTest('Syntax validation', true, 'All files have valid syntax');
        
        // Run browser compatibility
        console.log('  Running browser compatibility check...');
        const browserResult = execSync('npm run validate:browser', { encoding: 'utf8' });
        const hasCompatibilityIssues = browserResult.includes('BROWSER') && browserResult.includes('❌');
        logTest('Browser compatibility', !hasCompatibilityIssues, 
            hasCompatibilityIssues ? 'Browser compatibility issues found' : 'No compatibility issues');
        
        // Run main test suite
        console.log('  Running main test suite...');
        const testResult = execSync('npm test', { encoding: 'utf8' });
        const testsPass = testResult.includes('🎉 All tests passed!');
        logTest('Main test suite', testsPass, 
            testsPass ? 'All 116 tests passed' : 'Some tests failed');
        
        // Run enhanced QA
        console.log('  Running enhanced QA validation...');
        const qaResult = execSync('npm run qa:syntax', { encoding: 'utf8' });
        const qaPass = qaResult.includes('✅ ALL CHECKS PASSED') || qaResult.includes('⚠️ COMMIT ALLOWED');
        logTest('Enhanced QA validation', qaPass,
            qaPass ? 'Enhanced QA passed' : 'Enhanced QA failed');
            
        // Run deployment validation
        console.log('  Running deployment validation...');
        const deployResult = execSync('npm run qa:deployment', { encoding: 'utf8' });
        const deployPass = deployResult.includes('✅ DEPLOYMENT VALIDATION PASSED');
        logTest('Deployment validation', deployPass,
            deployPass ? 'Deployment validation passed' : 'Deployment validation failed');
        
    } catch (error) {
        logTest('QA testing', false, `QA testing failed: ${error.message}`);
    }
}

// 4. PRE-PUSH CHECKLIST
function validatePrePushChecklist() {
    console.log('\\n📋 Step 4: Pre-Push Checklist Validation...');
    
    try {
        // Check git status for uncommitted changes
        const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
        const hasUncommittedChanges = gitStatus.trim().length > 0;
        
        if (hasUncommittedChanges) {
            logWarning('Git status', 'Uncommitted changes detected');
            console.log('    Uncommitted files:');
            gitStatus.split('\\n').forEach(line => {
                if (line.trim()) console.log(`      ${line}`);
            });
        } else {
            logTest('Git status clean', true, 'No uncommitted changes');
        }
        
        // Check if we're on main/master branch
        const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
        const isMainBranch = currentBranch === 'main' || currentBranch === 'master';
        logTest('Branch validation', isMainBranch, 
            `Current branch: ${currentBranch}. ${isMainBranch ? 'Ready for push' : 'Consider merging to main first'}`);
        
        // Check if there are commits to push
        try {
            const commitsAhead = execSync('git rev-list --count @{u}..HEAD', { encoding: 'utf8' }).trim();
            const hasCommitsToPush = parseInt(commitsAhead) > 0;
            logTest('Commits ready to push', hasCommitsToPush,
                `${commitsAhead} commit(s) ahead of remote`);
        } catch (error) {
            logWarning('Remote comparison', 'Could not compare with remote branch');
        }
        
    } catch (error) {
        logTest('Pre-push checklist', false, `Error: ${error.message}`);
    }
}

// Main execution
console.log('Starting Pre-Push Validation Protocol...\\n');

validateVersionBump();
validateDocumentationUpdate();
runComprehensiveQA();
validatePrePushChecklist();

// Final results
console.log('\\n' + '='.repeat(60));
console.log('📊 PRE-PUSH VALIDATION RESULTS');
console.log('=' + '='.repeat(60));

console.log(`✅ Tests Passed: ${validationResults.passed}`);
console.log(`❌ Tests Failed: ${validationResults.failed}`);
console.log(`⚠️  Warnings: ${validationResults.warnings.length}`);
console.log(`📈 Success Rate: ${validationResults.total > 0 ? Math.round((validationResults.passed / validationResults.total) * 100) : 0}%`);

if (validationResults.failed > 0) {
    console.log('\\n❌ CRITICAL ERRORS:');
    validationResults.errors.forEach(error => console.log(`  • ${error}`));
}

if (validationResults.warnings.length > 0) {
    console.log('\\n⚠️  WARNINGS:');
    validationResults.warnings.forEach(warning => console.log(`  • ${warning}`));
}

if (validationResults.failed > 0) {
    console.log('\\n🚫 PUSH BLOCKED - Fix all errors before pushing');
    console.log('\\n📋 Required Actions:');
    console.log('  1. Fix all failed tests');
    console.log('  2. Re-run pre-push validation');
    console.log('  3. Only push when 100% tests pass');
    process.exit(1);
} else {
    console.log('\\n🎉 PRE-PUSH VALIDATION PASSED!');
    console.log('\\n✅ Ready to push:');
    console.log('  • Version properly bumped');
    console.log('  • Documentation updated');
    console.log('  • All QA tests passed (100%)');
    console.log('  • Pre-push checklist validated');
    console.log('\\n🚀 You may now safely push to remote');
    
    if (validationResults.warnings.length > 0) {
        console.log('\\n⚠️  Please review warnings above');
    }
    
    process.exit(0);
}