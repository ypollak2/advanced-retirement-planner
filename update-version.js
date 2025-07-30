#!/usr/bin/env node

// Simple version update script
const fs = require('fs');
const path = require('path');

function updateVersion(newVersion) {
    // Update version.json
    const versionFile = 'version.json';
    const versionData = {
        version: newVersion,
        build: new Date().toISOString().split('T')[0],
        commit: `v${newVersion}-update`,
        description: `Version update to ${newVersion}`
    };
    
    fs.writeFileSync(versionFile, JSON.stringify(versionData, null, 2));
    console.log(`✅ Updated ${versionFile} to v${newVersion}`);
    
    // Update package.json
    const packageFile = 'package.json';
    const packageData = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
    packageData.version = newVersion;
    fs.writeFileSync(packageFile, JSON.stringify(packageData, null, 2));
    console.log(`✅ Updated ${packageFile} to v${newVersion}`);
    
    // Update src/version.js
    const versionJsFile = 'src/version.js';
    if (fs.existsSync(versionJsFile)) {
        let versionJsContent = fs.readFileSync(versionJsFile, 'utf8');
        versionJsContent = versionJsContent.replace(/number: "[^"]+"/g, `number: "${newVersion}"`);
        versionJsContent = versionJsContent.replace(/build: "[^"]+"/g, `build: "${new Date().toISOString().split('T')[0]}"`);
        versionJsContent = versionJsContent.replace(/commit: "[^"]+"/g, `commit: "v${newVersion}-update"`);
        fs.writeFileSync(versionJsFile, versionJsContent);
        console.log(`✅ Updated ${versionJsFile} to v${newVersion}`);
    }
    
    // Update index.html
    const indexFile = 'index.html';
    if (fs.existsSync(indexFile)) {
        let indexContent = fs.readFileSync(indexFile, 'utf8');
        indexContent = indexContent.replace(/Advanced Retirement Planner v\d+\.\d+\.\d+/g, `Advanced Retirement Planner v${newVersion}`);
        indexContent = indexContent.replace(/window\.APP_VERSION = '[^']+'/g, `window.APP_VERSION = '${newVersion}'`);
        indexContent = indexContent.replace(/✨ v\d+\.\d+\.\d+/g, `✨ v${newVersion}`);
        fs.writeFileSync(indexFile, indexContent);
        console.log(`✅ Updated ${indexFile} to v${newVersion}`);
    }
    
    // Update README.md
    const readmeFile = 'README.md';
    if (fs.existsSync(readmeFile)) {
        let readmeContent = fs.readFileSync(readmeFile, 'utf8');
        readmeContent = readmeContent.replace(/v\d+\.\d+\.\d+/g, `v${newVersion}`);
        readmeContent = readmeContent.replace(/version-\d+\.\d+\.\d+-/g, `version-${newVersion}-`);
        fs.writeFileSync(readmeFile, readmeContent);
        console.log(`✅ Updated ${readmeFile} to v${newVersion}`);
    }
    
    console.log(`🎉 Version updated to ${newVersion}`);
}

// Export for testing
module.exports = { updateVersion };

// CLI usage
if (require.main === module) {
    const version = process.argv[2];
    if (!version) {
        console.error('Usage: node update-version.js <version>');
        process.exit(1);
    }
    updateVersion(version);
}