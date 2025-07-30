#!/usr/bin/env node

// Version synchronization script
// Reads version from src/version.js and updates package.json

const fs = require('fs');
const path = require('path');

try {
    // Read version.js
    const versionPath = path.join(__dirname, 'src', 'version.js');
    const versionContent = fs.readFileSync(versionPath, 'utf8');
    
    // Extract version number using regex
    const versionMatch = versionContent.match(/number:\s*["']([^"']+)["']/);
    if (!versionMatch) {
        throw new Error('Could not find version number in src/version.js');
    }
    
    const version = versionMatch[1];
    console.log(`📦 Found version: ${version}`);
    
    // Read package.json
    const packagePath = path.join(__dirname, 'package.json');
    const packageContent = fs.readFileSync(packagePath, 'utf8');
    const packageJson = JSON.parse(packageContent);
    
    // Update version in package.json
    const oldVersion = packageJson.version;
    packageJson.version = version;
    
    // Write updated package.json
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
    
    console.log(`✅ Updated package.json version: ${oldVersion} → ${version}`);
    
    // Also update version.json if it exists
    const versionJsonPath = path.join(__dirname, 'version.json');
    if (fs.existsSync(versionJsonPath)) {
        const versionJsonContent = fs.readFileSync(versionJsonPath, 'utf8');
        const versionJson = JSON.parse(versionJsonContent);
        versionJson.version = version;
        fs.writeFileSync(versionJsonPath, JSON.stringify(versionJson, null, 2) + '\n');
        console.log(`✅ Updated version.json version: ${version}`);
    }
    
} catch (error) {
    console.error('❌ Error syncing version:', error.message);
    process.exit(1);
}