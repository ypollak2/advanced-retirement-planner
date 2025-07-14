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