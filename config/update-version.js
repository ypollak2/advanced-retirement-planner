#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read version from central location
const versionData = JSON.parse(fs.readFileSync('version.json', 'utf8'));
const version = versionData.version;

console.log(`Updating to version ${version}...`);

// Update README.md
const readmePath = 'README.md';
let readme = fs.readFileSync(readmePath, 'utf8');
readme = readme.replace(/version-\d+\.\d+\.\d+-green\.svg/g, `version-${version}-green.svg`);
fs.writeFileSync(readmePath, readme);
console.log('✅ Updated README.md');

// Update index.html title
const indexPath = 'index.html';
let indexHtml = fs.readFileSync(indexPath, 'utf8');
indexHtml = indexHtml.replace(
    /<title>Advanced Retirement Planner v\d+\.\d+\.\d+ - Professional Pension Planning Tool<\/title>/g,
    `<title>Advanced Retirement Planner v${version} - Professional Pension Planning Tool</title>`
);

// Update script src cache-busting
indexHtml = indexHtml.replace(/\?v=\d+\.\d+\.\d+/g, `?v=${version}`);
fs.writeFileSync(indexPath, indexHtml);
console.log('✅ Updated index.html');

// Update package.json if it exists
const packagePath = 'package.json';
if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    packageJson.version = version;
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
    console.log('✅ Updated package.json');
}

// Update analytics tracker version if it exists
const analyticsPath = 'src/utils/analyticsTracker.js';
if (fs.existsSync(analyticsPath)) {
    let analytics = fs.readFileSync(analyticsPath, 'utf8');
    analytics = analytics.replace(/version: '\d+\.\d+\.\d+'/g, `version: '${version}'`);
    fs.writeFileSync(analyticsPath, analytics);
    console.log('✅ Updated analyticsTracker.js');
}

console.log(`🎉 All files updated to version ${version}!`);
console.log('💡 To release a new version:');
console.log('   1. Edit version.json');
console.log('   2. Run: node update-version.js');
console.log('   3. Commit and push changes');