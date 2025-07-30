#!/usr/bin/env node

/**
 * Test Script for Enhanced Version Update Script
 * 
 * This script tests all version patterns without modifying files
 */

const fs = require('fs');

console.log('🧪 Testing Enhanced Version Update Script Patterns\n');

// Test patterns against current files
const testFiles = [
    {
        file: 'src/components/core/RetirementPlannerApp.js',
        patterns: [
            { name: 'Footer fallback version', regex: /:\s*'v([\d.]+)'\)/ },
            { name: 'Header comment version', regex: /Created by Yali Pollak.*- v([\d.]+)/ }
        ]
    },
    {
        file: 'src/utils/exportFunctions.js',
        patterns: [
            { name: 'Export metadata version', regex: /version:\s*'v([\d.]+)'/ },
            { name: 'Header comment version', regex: /Created by Yali Pollak.*- v([\d.]+)/ }
        ]
    },
    {
        file: 'src/utils/currencyAPI.js',
        patterns: [
            { name: 'Console log version', regex: /console\.log\('CurrencyAPI v([\d.]+) loaded successfully'\)/ },
            { name: 'Header comment version', regex: /Created by Yali Pollak.*- v([\d.]+)/ }
        ]
    },
    {
        file: 'sw.js',
        patterns: [
            { name: 'Cache name versions', regex: /retirement-planner-.*-v([\d.]+)/g },
            { name: 'Header comment version', regex: /Created by Yali Pollak.*- v([\d.]+)/ }
        ]
    },
    {
        file: 'src/utils/robustLocalStorage.js',
        patterns: [
            { name: 'Metadata version', regex: /version:\s*'([\d.]+)'/ },
            { name: 'Fallback version', regex: /window\.APP_VERSION\s*=\s*'([\d.]+)'/ }
        ]
    },
    {
        file: 'index.html',
        patterns: [
            { name: 'Cache busting parameters', regex: /\?v=([\d.]+)/g },
            { name: 'Page title version', regex: /<title>Advanced Retirement Planner v([\d.]+)<\/title>/ },
            { name: 'Fallback version', regex: /window\.APP_VERSION\s*=\s*'([\d.]+)'/ }
        ]
    }
];

let totalPatternsFound = 0;
let filesWithVersions = 0;
let versionConsistencyIssues = [];

testFiles.forEach(testFile => {
    const { file, patterns } = testFile;
    
    if (!fs.existsSync(file)) {
        console.log(`⚠️  File not found: ${file}`);
        return;
    }
    
    console.log(`📁 Testing: ${file}`);
    const content = fs.readFileSync(file, 'utf8');
    let fileHasVersions = false;
    
    patterns.forEach(pattern => {
        const { name, regex } = pattern;
        
        if (regex.global) {
            const matches = [...content.matchAll(regex)];
            if (matches.length > 0) {
                console.log(`   ✅ ${name}: Found ${matches.length} matches`);
                matches.slice(0, 3).forEach(match => {
                    console.log(`      - v${match[1]}`);
                    if (match[1] !== '6.8.2') {
                        versionConsistencyIssues.push({
                            file,
                            pattern: name,
                            found: match[1],
                            expected: '6.8.2'
                        });
                    }
                });
                totalPatternsFound += matches.length;
                fileHasVersions = true;
            } else {
                console.log(`   ❌ ${name}: No matches found`);
            }
        } else {
            const match = content.match(regex);
            if (match) {
                console.log(`   ✅ ${name}: v${match[1]}`);
                if (match[1] !== '6.8.2') {
                    versionConsistencyIssues.push({
                        file,
                        pattern: name,
                        found: match[1],
                        expected: '6.8.2'
                    });
                }
                totalPatternsFound++;
                fileHasVersions = true;
            } else {
                console.log(`   ❌ ${name}: No match found`);
            }
        }
    });
    
    if (fileHasVersions) {
        filesWithVersions++;
    }
    
    console.log('');
});

// Summary
console.log('📊 TEST SUMMARY:');
console.log(`   Files tested: ${testFiles.length}`);
console.log(`   Files with versions: ${filesWithVersions}`);
console.log(`   Total version patterns found: ${totalPatternsFound}`);
console.log(`   Version consistency issues: ${versionConsistencyIssues.length}`);

if (versionConsistencyIssues.length > 0) {
    console.log('\n⚠️  VERSION CONSISTENCY ISSUES:');
    versionConsistencyIssues.forEach(issue => {
        console.log(`   ${issue.file} (${issue.pattern}): Found v${issue.found}, expected v${issue.expected}`);
    });
} else {
    console.log('\n✅ All version patterns are consistent!');
}

// Test specific critical patterns
console.log('\n🎯 CRITICAL PATTERN VERIFICATION:');

// Footer fallback pattern
const appContent = fs.readFileSync('src/components/core/RetirementPlannerApp.js', 'utf8');
const footerMatch = appContent.match(/:\s*'v([\d.]+)'\)/);
if (footerMatch) {
    console.log(`   Footer Fallback: ✅ v${footerMatch[1]} (prevents footer showing wrong version)`);
} else {
    console.log(`   Footer Fallback: ❌ Pattern not found - CRITICAL ISSUE!`);
}

// Cache busting pattern
const indexContent = fs.readFileSync('index.html', 'utf8');
const cacheMatches = [...indexContent.matchAll(/\?v=([\d.]+)/g)];
const uniqueVersions = [...new Set(cacheMatches.map(m => m[1]))];
console.log(`   Cache Busting: ${uniqueVersions.length === 1 ? '✅' : '❌'} ${cacheMatches.length} parameters, ${uniqueVersions.length} unique versions`);
if (uniqueVersions.length > 1) {
    console.log(`      Versions found: ${uniqueVersions.join(', ')}`);
}

// Service worker cache names
const swContent = fs.readFileSync('sw.js', 'utf8');
const swMatches = [...swContent.matchAll(/retirement-planner-[^-]*-v([\d.]+)/g)];
const uniqueSwVersions = [...new Set(swMatches.map(m => m[1]))];
console.log(`   Service Worker: ${uniqueSwVersions.length === 1 ? '✅' : '❌'} ${swMatches.length} cache names, ${uniqueSwVersions.length} unique versions`);

console.log('\n🏁 Enhanced version script testing complete!');
console.log('   The update-version.js script should now catch all these patterns automatically.');