#!/usr/bin/env node
// Enhanced Pre-Commit QA Script
// Created by Yali Pollak (יהלי פולק) - v6.2.0

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Enhanced Pre-Commit QA Analysis...\n');

let hasErrors = false;
const errors = [];
const warnings = [];

// 1. SYNTAX VALIDATION - Check all JS files for syntax errors
function validateJSSyntax() {
    console.log('📝 Validating JavaScript Syntax...');
    
    const jsFiles = [
        'src/components/',
        'src/utils/',
        'src/modules/',
        'tests/'
    ].flatMap(dir => {
        if (!fs.existsSync(dir)) return [];
        return fs.readdirSync(dir, { recursive: true })
            .filter(file => file.endsWith('.js'))
            .map(file => path.join(dir, file));
    });

    jsFiles.forEach(file => {
        try {
            // Check syntax using Node.js
            execSync(`node -c "${file}"`, { stdio: 'ignore' });
            console.log(`  ✅ ${file}`);
        } catch (error) {
            hasErrors = true;
            errors.push(`❌ SYNTAX ERROR in ${file}: ${error.message}`);
            console.log(`  ❌ ${file} - SYNTAX ERROR`);
        }
    });
}

// 2. BROWSER COMPATIBILITY - Check for ES6 modules in browser scripts
function validateBrowserCompatibility() {
    console.log('\n🌐 Validating Browser Compatibility...');
    
    const browserFiles = [
        'src/components/',
        'src/utils/',
        'src/modules/'
    ].flatMap(dir => {
        if (!fs.existsSync(dir)) return [];
        return fs.readdirSync(dir, { recursive: true })
            .filter(file => file.endsWith('.js'))
            .map(file => path.join(dir, file));
    });

    browserFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check for ES6 export/import that won't work in browser
        if (content.includes('export default') || content.includes('export {') || 
            content.includes('import ') && !content.includes('// @ts-ignore')) {
            hasErrors = true;
            errors.push(`❌ BROWSER INCOMPATIBLE: ${file} uses ES6 modules (use window.ComponentName instead)`);
            console.log(`  ❌ ${file} - ES6 module syntax detected`);
        } else {
            console.log(`  ✅ ${file}`);
        }
    });
}

// 3. ORPHANED CODE DETECTION - Look for common orphaned code patterns
function detectOrphanedCode() {
    console.log('\n🔍 Detecting Orphaned Code...');
    
    const sourceFiles = [
        'src/components/',
        'src/utils/'
    ].flatMap(dir => {
        if (!fs.existsSync(dir)) return [];
        return fs.readdirSync(dir, { recursive: true })
            .filter(file => file.endsWith('.js'))
            .map(file => path.join(dir, file));
    });

    const orphanedPatterns = [
        /^\s*},\s*['"][^'"]*['"]\s*\),?\s*$/m,  // }, 'text'),
        /^\s*\]\s*,?\s*$/m,                     // stray ]
        /^\s*\)\s*,?\s*$/m,                     // stray )
        /React\.createElement\([^,)]+,\s*$/m,   // incomplete React.createElement
        /^\s*\{\s*$/m                           // stray {
    ];

    sourceFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        let hasOrphans = false;
        
        orphanedPatterns.forEach((pattern, index) => {
            const matches = content.match(pattern);
            if (matches) {
                hasOrphans = true;
                const lineNumber = content.substring(0, matches.index).split('\n').length;
                warnings.push(`⚠️ POTENTIAL ORPHANED CODE in ${file}:${lineNumber} - Pattern ${index + 1}`);
            }
        });

        if (hasOrphans) {
            console.log(`  ⚠️ ${file} - Potential orphaned code detected`);
        } else {
            console.log(`  ✅ ${file}`);
        }
    });
}

// 4. VERSION CONSISTENCY - Check all version files match
function validateVersionConsistency() {
    console.log('\n📊 Validating Version Consistency...');
    
    const versionFiles = {
        'package.json': () => JSON.parse(fs.readFileSync('package.json', 'utf8')).version,
        'version.json': () => JSON.parse(fs.readFileSync('version.json', 'utf8')).version,
        'src/version.js': () => {
            const content = fs.readFileSync('src/version.js', 'utf8');
            const match = content.match(/number:\s*["']([^"']+)["']/);
            return match ? match[1] : null;
        },
        'index.html': () => {
            // HTML title is now dynamic, use fallback version from script
            const content = fs.readFileSync('index.html', 'utf8');
            const fallbackMatch = content.match(/window\.APP_VERSION\s*=\s*['"]([^'"]+)['"]/);
            return fallbackMatch ? fallbackMatch[1] : 'dynamic';
        }
    };

    const versions = {};
    Object.keys(versionFiles).forEach(file => {
        if (fs.existsSync(file)) {
            try {
                versions[file] = versionFiles[file]();
                console.log(`  ✅ ${file}: v${versions[file]}`);
            } catch (error) {
                errors.push(`❌ VERSION ERROR in ${file}: ${error.message}`);
                console.log(`  ❌ ${file} - Error reading version`);
            }
        }
    });

    // Check all versions match
    const versionValues = Object.values(versions);
    const uniqueVersions = [...new Set(versionValues)];
    
    if (uniqueVersions.length > 1) {
        hasErrors = true;
        errors.push(`❌ VERSION MISMATCH: Found versions ${uniqueVersions.join(', ')}`);
        console.log(`  ❌ Version mismatch detected`);
    } else {
        console.log(`  ✅ All versions consistent: v${uniqueVersions[0]}`);
    }
}

// 5. CRITICAL FILE VALIDATION - Ensure critical files exist and are valid
function validateCriticalFiles() {
    console.log('\n📋 Validating Critical Files...');
    
    const criticalFiles = [
        'index.html',
        'src/components/core/RetirementPlannerApp.js',
        'src/components/core/Dashboard.js',
        'src/utils/retirementCalculations.js',
        'package.json',
        'README.md'
    ];

    criticalFiles.forEach(file => {
        if (!fs.existsSync(file)) {
            hasErrors = true;
            errors.push(`❌ MISSING CRITICAL FILE: ${file}`);
            console.log(`  ❌ ${file} - MISSING`);
        } else if (fs.statSync(file).size === 0) {
            hasErrors = true;
            errors.push(`❌ EMPTY CRITICAL FILE: ${file}`);
            console.log(`  ❌ ${file} - EMPTY`);
        } else {
            console.log(`  ✅ ${file}`);
        }
    });
}

// 6. SERVICE WORKER VALIDATION - Check service worker file exists
function validateServiceWorker() {
    console.log('\n🔧 Validating Service Worker...');
    
    if (!fs.existsSync('sw.js')) {
        hasErrors = true;
        errors.push('❌ MISSING SERVICE WORKER: sw.js not found');
        console.log('  ❌ sw.js - MISSING');
    } else {
        const content = fs.readFileSync('sw.js', 'utf8');
        if (content.length < 100) {
            warnings.push('⚠️ SERVICE WORKER too small, might be incomplete');
            console.log('  ⚠️ sw.js - Suspiciously small');
        } else {
            console.log('  ✅ sw.js');
        }
    }
}

// 7. HTML VALIDATION - Basic HTML structure validation
function validateHTML() {
    console.log('\n🌐 Validating HTML Structure...');
    
    if (!fs.existsSync('index.html')) {
        hasErrors = true;
        errors.push('❌ MISSING: index.html');
        return;
    }

    const content = fs.readFileSync('index.html', 'utf8');
    
    // Check for basic HTML structure
    const requiredElements = [
        /<html[^>]*>/,
        /<head>/,
        /<body>/,
        /<title>/,
        /<script[^>]*src=[^>]*RetirementPlannerApp/
    ];

    requiredElements.forEach((pattern, index) => {
        if (!pattern.test(content)) {
            hasErrors = true;
            errors.push(`❌ HTML STRUCTURE ERROR: Missing element ${index + 1}`);
        }
    });

    console.log('  ✅ HTML structure validated');
}

// 8. SPECIFIC FILE VALIDATION - Validate individual files for development workflow
function validateSpecificFile(filePath) {
    if (!fs.existsSync(filePath)) {
        hasErrors = true;
        errors.push(`❌ FILE NOT FOUND: ${filePath}`);
        console.log(`  ❌ ${filePath} - FILE NOT FOUND`);
        return;
    }

    try {
        // Check syntax using Node.js
        execSync(`node -c "${filePath}"`, { stdio: 'ignore' });
        console.log(`  ✅ ${filePath} - Syntax valid`);

        // Check for browser compatibility if it's a browser-loaded file
        if (filePath.includes('src/components/') || filePath.includes('src/utils/')) {
            const content = fs.readFileSync(filePath, 'utf8');
            
            if (content.includes('export default') || content.includes('export {') || 
                content.includes('import ') && !content.includes('// @ts-ignore')) {
                warnings.push(`⚠️ BROWSER COMPATIBILITY: ${filePath} uses ES6 modules`);
                console.log(`  ⚠️ ${filePath} - Browser compatibility warning`);
            } else {
                console.log(`  ✅ ${filePath} - Browser compatible`);
            }
        }

    } catch (error) {
        hasErrors = true;
        errors.push(`❌ SYNTAX ERROR in ${filePath}: ${error.message}`);
        console.log(`  ❌ ${filePath} - SYNTAX ERROR`);
    }
}

// Enhanced Validation Modes - Support command line arguments
const args = process.argv.slice(2);
const mode = args[0] || 'full';
const targetFile = args[1];

// Validation mode configurations
const validationModes = {
    'full': ['syntax', 'browser', 'orphans', 'version', 'files', 'service-worker', 'html'],
    'quick': ['syntax', 'browser', 'orphans'],
    'syntax-only': ['syntax'],
    'file': ['syntax', 'browser'], // For single file validation
    'pre-commit': ['syntax', 'browser', 'orphans', 'version', 'files'],
    'development': ['syntax', 'browser', 'orphans']
};

const selectedMode = validationModes[mode] || validationModes['full'];

console.log(`🔍 Running ${mode} validation mode...`);
if (targetFile) {
    console.log(`📁 Target file: ${targetFile}`);
}

// Run validations based on selected mode
if (selectedMode.includes('syntax')) {
    if (targetFile) {
        console.log('\n📝 Validating Specific File Syntax...');
        validateSpecificFile(targetFile);
    } else {
        validateJSSyntax();
    }
}

if (selectedMode.includes('browser')) {
    validateBrowserCompatibility();
}

if (selectedMode.includes('orphans')) {
    detectOrphanedCode();
}

if (selectedMode.includes('version')) {
    validateVersionConsistency();
}

if (selectedMode.includes('files')) {
    validateCriticalFiles();
}

if (selectedMode.includes('service-worker')) {
    validateServiceWorker();
}

if (selectedMode.includes('html')) {
    validateHTML();
}

// Report results
console.log('\n' + '='.repeat(60));
console.log('📊 PRE-COMMIT QA RESULTS');
console.log('='.repeat(60));

if (errors.length > 0) {
    console.log('\n❌ CRITICAL ERRORS:');
    errors.forEach(error => console.log(error));
}

if (warnings.length > 0) {
    console.log('\n⚠️ WARNINGS:');
    warnings.forEach(warning => console.log(warning));
}

if (hasErrors) {
    console.log('\n🚫 COMMIT BLOCKED - Fix errors before committing');
    process.exit(1);
} else if (warnings.length > 0) {
    console.log('\n⚠️ COMMIT ALLOWED - Please review warnings');
    process.exit(0);
} else {
    console.log('\n✅ ALL CHECKS PASSED - Commit approved');
    process.exit(0);
}