// Version Consistency Test - Advanced Retirement Planner
// Tests for version consistency across all files in the project
// Created for QA suite - v6.6.1

const fs = require('fs');
const path = require('path');

console.log('🏷️ Advanced Retirement Planner - Version Consistency Test');
console.log('========================================================');

let passedTests = 0;
let failedTests = 0;
const issues = [];

// Get the expected version from package.json
let expectedVersion = '6.6.1';
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    expectedVersion = packageJson.version;
    console.log(`📦 Expected version from package.json: ${expectedVersion}`);
} catch (error) {
    console.log(`❌ ERROR: Could not read package.json - ${error.message}`);
    process.exit(1);
}

// Test 1: Check core version files
console.log('\n📍 Testing Core Version Files...');

const coreVersionFiles = [
    { file: 'src/version.js', property: 'number' },
    { file: 'package.json', property: 'version' },
    { file: 'version.json', property: 'version' }
];

coreVersionFiles.forEach(versionFile => {
    try {
        if (versionFile.file === 'src/version.js') {
            const versionModule = require(path.resolve(versionFile.file));
            const version = versionModule[versionFile.property];
            if (version === expectedVersion) {
                console.log(`✅ PASS: ${versionFile.file} - Version ${version} matches expected`);
                passedTests++;
            } else {
                console.log(`❌ FAIL: ${versionFile.file} - Version ${version} does not match expected ${expectedVersion}`);
                issues.push(`${versionFile.file}: Update version to ${expectedVersion}`);
                failedTests++;
            }
        } else {
            const content = fs.readFileSync(versionFile.file, 'utf8');
            const data = JSON.parse(content);
            const version = data[versionFile.property];
            if (version === expectedVersion) {
                console.log(`✅ PASS: ${versionFile.file} - Version ${version} matches expected`);
                passedTests++;
            } else {
                console.log(`❌ FAIL: ${versionFile.file} - Version ${version} does not match expected ${expectedVersion}`);
                issues.push(`${versionFile.file}: Update version to ${expectedVersion}`);
                failedTests++;
            }
        }
    } catch (error) {
        console.log(`❌ ERROR: ${versionFile.file} - ${error.message}`);
        failedTests++;
    }
});

// Test 2: Check component file headers
console.log('\n📁 Testing Component Version Headers...');

const componentFiles = [
    'src/components/core/RetirementPlannerApp.js',
    'src/components/StressTestInterface.js',
    'src/components/shared/ExportControls.js',
    'src/components/charts/DynamicPartnerCharts.js',
    'src/components/core/Dashboard.js',
    'src/components/shared/CurrencySelector.js',
    'src/components/panels/summary/SummaryPanel.js',
    'src/utils/exportFunctions.js',
    'src/utils/stockPriceAPI.js'
];

componentFiles.forEach(filePath => {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Look for version in file header comments
        const versionMatch = content.match(/v(\d+\.\d+\.\d+)/);
        if (versionMatch) {
            const fileVersion = versionMatch[1];
            if (fileVersion === expectedVersion) {
                console.log(`✅ PASS: ${filePath} - Header version v${fileVersion} matches expected`);
                passedTests++;
            } else {
                console.log(`❌ FAIL: ${filePath} - Header version v${fileVersion} does not match expected v${expectedVersion}`);
                issues.push(`${filePath}: Update header version to v${expectedVersion}`);
                failedTests++;
            }
        } else {
            console.log(`⚠️  SKIP: ${filePath} - No version found in header`);
        }
    } catch (error) {
        console.log(`❌ ERROR: ${filePath} - ${error.message}`);
        failedTests++;
    }
});

// Test 3: Check HTML title and meta tags
console.log('\n🌐 Testing HTML Version References...');

try {
    const htmlContent = fs.readFileSync('index.html', 'utf8');
    
    // Check title
    const titleMatch = htmlContent.match(/<title>[^<]*v(\d+\.\d+\.\d+)/);
    if (titleMatch) {
        const titleVersion = titleMatch[1];
        if (titleVersion === expectedVersion) {
            console.log(`✅ PASS: index.html - Title version v${titleVersion} matches expected`);
            passedTests++;
        } else {
            console.log(`❌ FAIL: index.html - Title version v${titleVersion} does not match expected v${expectedVersion}`);
            issues.push(`index.html: Update title version to v${expectedVersion}`);
            failedTests++;
        }
    } else {
        console.log(`⚠️  SKIP: index.html - No version found in title`);
    }
    
    // Check cache busting parameters
    const cacheBustingMatches = htmlContent.match(/\?v=(\d+\.\d+\.\d+)/g);
    if (cacheBustingMatches) {
        let cacheBustingPassed = 0;
        let cacheBustingFailed = 0;
        
        cacheBustingMatches.forEach((match, index) => {
            const versionMatch = match.match(/v=(\d+\.\d+\.\d+)/);
            if (versionMatch) {
                const cacheVersion = versionMatch[1];
                if (cacheVersion === expectedVersion) {
                    cacheBustingPassed++;
                } else {
                    cacheBustingFailed++;
                }
            }
        });
        
        if (cacheBustingFailed === 0) {
            console.log(`✅ PASS: index.html - All ${cacheBustingPassed} cache busting parameters use v${expectedVersion}`);
            passedTests++;
        } else {
            console.log(`❌ FAIL: index.html - ${cacheBustingFailed} cache busting parameters use wrong version`);
            issues.push(`index.html: Update cache busting parameters to v${expectedVersion}`);
            failedTests++;
        }
    } else {
        console.log(`⚠️  SKIP: index.html - No cache busting parameters found`);
    }
} catch (error) {
    console.log(`❌ ERROR: index.html - ${error.message}`);
    failedTests++;
}

// Test 4: Check README version references
console.log('\n📖 Testing README Version References...');

try {
    const readmeContent = fs.readFileSync('README.md', 'utf8');
    
    // Check main title
    const titleMatch = readmeContent.match(/# [^v]*v(\d+\.\d+\.\d+)/);
    if (titleMatch) {
        const readmeVersion = titleMatch[1];
        if (readmeVersion === expectedVersion) {
            console.log(`✅ PASS: README.md - Title version v${readmeVersion} matches expected`);
            passedTests++;
        } else {
            console.log(`❌ FAIL: README.md - Title version v${readmeVersion} does not match expected v${expectedVersion}`);
            issues.push(`README.md: Update title version to v${expectedVersion}`);
            failedTests++;
        }
    } else {
        console.log(`⚠️  SKIP: README.md - No version found in title`);
    }
    
    // Check version badge
    const badgeMatch = readmeContent.match(/version-(\d+\.\d+\.\d+)-blue/);
    if (badgeMatch) {
        const badgeVersion = badgeMatch[1];
        if (badgeVersion === expectedVersion) {
            console.log(`✅ PASS: README.md - Version badge ${badgeVersion} matches expected`);
            passedTests++;
        } else {
            console.log(`❌ FAIL: README.md - Version badge ${badgeVersion} does not match expected ${expectedVersion}`);
            issues.push(`README.md: Update version badge to ${expectedVersion}`);
            failedTests++;
        }
    } else {
        console.log(`⚠️  SKIP: README.md - No version badge found`);
    }
    
    // Check "What's New" section
    const whatsNewMatch = readmeContent.match(/What's New in v(\d+\.\d+\.\d+)/);
    if (whatsNewMatch) {
        const whatsNewVersion = whatsNewMatch[1];
        if (whatsNewVersion === expectedVersion) {
            console.log(`✅ PASS: README.md - "What's New" section version v${whatsNewVersion} matches expected`);
            passedTests++;
        } else {
            console.log(`❌ FAIL: README.md - "What's New" section version v${whatsNewVersion} does not match expected v${expectedVersion}`);
            issues.push(`README.md: Update "What's New" section version to v${expectedVersion}`);
            failedTests++;
        }
    } else {
        console.log(`⚠️  SKIP: README.md - No "What's New" section version found`);
    }
} catch (error) {
    console.log(`❌ ERROR: README.md - ${error.message}`);
    failedTests++;
}

// Test 5: Check test files for version references
console.log('\n🧪 Testing Test File Version References...');

const testFiles = [
    'tests/comprehensive-qa-test.js',
    'tests/accessibility-test.js',
    'tests/user-experience-test.js'
];

testFiles.forEach(filePath => {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Look for version references in test files
        const versionMatches = content.match(/v(\d+\.\d+\.\d+)/g);
        if (versionMatches) {
            let correctVersions = 0;
            let incorrectVersions = 0;
            
            versionMatches.forEach(match => {
                const version = match.substring(1); // Remove 'v' prefix
                if (version === expectedVersion) {
                    correctVersions++;
                } else {
                    incorrectVersions++;
                }
            });
            
            if (incorrectVersions === 0) {
                console.log(`✅ PASS: ${filePath} - All ${correctVersions} version references match expected`);
                passedTests++;
            } else {
                console.log(`❌ FAIL: ${filePath} - ${incorrectVersions} version references do not match expected`);
                issues.push(`${filePath}: Update version references to v${expectedVersion}`);
                failedTests++;
            }
        } else {
            console.log(`⚠️  SKIP: ${filePath} - No version references found`);
        }
    } catch (error) {
        console.log(`⚠️  SKIP: ${filePath} - File not found or error: ${error.message}`);
    }
});

// Test 6: Check export functions for version metadata
console.log('\n📤 Testing Export Function Version Metadata...');

try {
    const exportContent = fs.readFileSync('src/utils/exportFunctions.js', 'utf8');
    
    // Check for version in export metadata
    const metadataMatch = exportContent.match(/version: ['"]v?(\d+\.\d+\.\d+)['"]/);
    if (metadataMatch) {
        const metadataVersion = metadataMatch[1];
        if (metadataVersion === expectedVersion) {
            console.log(`✅ PASS: src/utils/exportFunctions.js - Export metadata version ${metadataVersion} matches expected`);
            passedTests++;
        } else {
            console.log(`❌ FAIL: src/utils/exportFunctions.js - Export metadata version ${metadataVersion} does not match expected ${expectedVersion}`);
            issues.push(`src/utils/exportFunctions.js: Update export metadata version to ${expectedVersion}`);
            failedTests++;
        }
    } else {
        console.log(`⚠️  SKIP: src/utils/exportFunctions.js - No export metadata version found`);
    }
} catch (error) {
    console.log(`❌ ERROR: src/utils/exportFunctions.js - ${error.message}`);
    failedTests++;
}

// Final Report
console.log('\n📊 Version Consistency Test Summary');
console.log('===================================');
console.log(`✅ Tests Passed: ${passedTests}`);
console.log(`❌ Tests Failed: ${failedTests}`);
console.log(`📈 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);

if (issues.length > 0) {
    console.log('\n🔧 Issues Found:');
    issues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue}`);
    });
}

console.log('\n💡 Version Consistency Best Practices:');
console.log('   • Update all version references when releasing new versions');
console.log('   • Use package.json as the single source of truth for version');
console.log('   • Include version in component headers for debugging');
console.log('   • Update README badges and "What\'s New" sections');
console.log('   • Use cache busting parameters with current version');
console.log('   • Test version consistency in CI/CD pipeline');

if (failedTests > 0) {
    console.log('\n⚠️  Version consistency issues found. Please review and fix.');
    process.exit(1);
} else {
    console.log('\n🎉 All version consistency tests passed!');
    process.exit(0);
}