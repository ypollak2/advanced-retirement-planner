#!/usr/bin/env node

// Comprehensive Version Synchronization Script
// Ensures all version references across the project are consistent
// Uses version.json as the single source of truth

const fs = require('fs');
const path = require('path');

console.log('🔄 Comprehensive Version Synchronization');
console.log('========================================');

let sourceVersion;

try {
    // Read version from version.json (single source of truth)
    const versionJsonPath = path.join(__dirname, 'version.json');
    const versionJson = JSON.parse(fs.readFileSync(versionJsonPath, 'utf8'));
    sourceVersion = versionJson.version;
    console.log(`📋 Source version from version.json: ${sourceVersion}`);

    // Update package.json
    console.log('\n📦 Updating package.json...');
    const packagePath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const oldPackageVersion = packageJson.version;
    packageJson.version = sourceVersion;
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
    console.log(`✅ package.json: ${oldPackageVersion} → ${sourceVersion}`);

    // Update src/version.js
    console.log('\n🔧 Updating src/version.js...');
    const versionJsPath = path.join(__dirname, 'src', 'version.js');
    let versionJsContent = fs.readFileSync(versionJsPath, 'utf8');
    const oldVersionMatch = versionJsContent.match(/number:\s*["']([^"']+)["']/);
    const oldVersionJs = oldVersionMatch ? oldVersionMatch[1] : 'unknown';
    versionJsContent = versionJsContent.replace(
        /number:\s*["'][^"']+["']/,
        `number: "${sourceVersion}"`
    );
    fs.writeFileSync(versionJsPath, versionJsContent);
    console.log(`✅ src/version.js: ${oldVersionJs} → ${sourceVersion}`);

    // Update component headers
    console.log('\n🧩 Updating component headers...');
    const componentFiles = [
        'src/components/RetirementPlannerApp.js',
        'src/components/ExportControls.js',
        'src/utils/exportFunctions.js',
        'src/utils/stockPriceAPI.js'
    ];

    componentFiles.forEach(filePath => {
        const fullPath = path.join(__dirname, filePath);
        if (fs.existsSync(fullPath)) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const oldVersionMatch = content.match(/v(\d+\.\d+\.\d+)/);
            const oldVersion = oldVersionMatch ? oldVersionMatch[1] : 'unknown';
            
            content = content.replace(/v\d+\.\d+\.\d+/, `v${sourceVersion}`);
            fs.writeFileSync(fullPath, content);
            console.log(`✅ ${filePath}: v${oldVersion} → v${sourceVersion}`);
        } else {
            console.log(`⚠️  ${filePath}: File not found, skipping`);
        }
    });

    // Update export metadata version
    console.log('\n📤 Updating export metadata...');
    const exportFunctionsPath = path.join(__dirname, 'src', 'utils', 'exportFunctions.js');
    if (fs.existsSync(exportFunctionsPath)) {
        let content = fs.readFileSync(exportFunctionsPath, 'utf8');
        const oldMetadataMatch = content.match(/version:\s*['"]v?([^'"]+)['"]/);
        const oldMetadataVersion = oldMetadataMatch ? oldMetadataMatch[1] : 'unknown';
        
        content = content.replace(
            /version:\s*['"]v?[^'"]+['"]/,
            `version: 'v${sourceVersion}'`
        );
        fs.writeFileSync(exportFunctionsPath, content);
        console.log(`✅ Export metadata: v${oldMetadataVersion} → v${sourceVersion}`);
    }

    // Update HTML title
    console.log('\n🌐 Updating HTML title...');
    const htmlPath = path.join(__dirname, 'index.html');
    if (fs.existsSync(htmlPath)) {
        let content = fs.readFileSync(htmlPath, 'utf8');
        const oldTitleMatch = content.match(/<title>[^<]*v(\d+\.\d+\.\d+)/);
        const oldTitleVersion = oldTitleMatch ? oldTitleMatch[1] : 'unknown';
        
        content = content.replace(
            /(Advanced Retirement Planner )v\d+\.\d+\.\d+/,
            `$1v${sourceVersion}`
        );
        
        // Also update fallback version in error handler
        content = content.replace(
            /window\.APP_VERSION = '[^']+'/g,
            `window.APP_VERSION = '${sourceVersion}'`
        );
        content = content.replace(
            /textContent = '✨ v[^']+'/g,
            `textContent = '✨ v${sourceVersion}'`
        );
        
        fs.writeFileSync(htmlPath, content);
        console.log(`✅ HTML title: v${oldTitleVersion} → v${sourceVersion}`);
    }

    // Update README.md
    console.log('\n📚 Updating README.md...');
    const readmePath = path.join(__dirname, 'README.md');
    if (fs.existsSync(readmePath)) {
        let content = fs.readFileSync(readmePath, 'utf8');
        
        // Update main title
        const oldReadmeMatch = content.match(/# [^v]*v(\d+\.\d+\.\d+)/);
        const oldReadmeVersion = oldReadmeMatch ? oldReadmeMatch[1] : 'unknown';
        
        content = content.replace(
            /(# 🚀 Advanced Retirement Planner )v\d+\.\d+\.\d+/,
            `$1v${sourceVersion}`
        );
        
        // Update version badge
        content = content.replace(
            /version-\d+\.\d+\.\d+-blue/,
            `version-${sourceVersion}-blue`
        );
        
        // Update "What's New" section
        content = content.replace(
            /(What's New in )v\d+\.\d+\.\d+/,
            `$1v${sourceVersion}`
        );
        
        fs.writeFileSync(readmePath, content);
        console.log(`✅ README.md: v${oldReadmeVersion} → v${sourceVersion}`);
    }

    console.log('\n🎉 Version synchronization completed successfully!');
    console.log(`📋 All files now use version: ${sourceVersion}`);

} catch (error) {
    console.error('❌ Error during version synchronization:', error.message);
    process.exit(1);
}