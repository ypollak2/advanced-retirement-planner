#!/usr/bin/env node
// Version management script for Advanced Retirement Planner

const fs = require('fs');
const path = require('path');

const versionFile = path.join(__dirname, 'version.json');
const packageFile = path.join(__dirname, 'package.json');

function updateVersion(newVersion) {
    try {
        // Read current version
        const version = JSON.parse(fs.readFileSync(versionFile, 'utf8'));
        const pkg = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
        
        if (newVersion) {
            version.version = newVersion;
            pkg.version = newVersion;
        }
        
        // Update build date
        version.build = new Date().toISOString().split('T')[0];
        
        // Write updated files
        fs.writeFileSync(versionFile, JSON.stringify(version, null, 2));
        fs.writeFileSync(packageFile, JSON.stringify(pkg, null, 2));
        
        console.log(`Version updated to ${version.version}`);
        console.log(`Build date: ${version.build}`);
        
    } catch (error) {
        console.error('Error updating version:', error.message);
        process.exit(1);
    }
}

// Command line usage
if (require.main === module) {
    const newVersion = process.argv[2];
    updateVersion(newVersion);
}

module.exports = updateVersion;