#!/usr/bin/env node

// Automatic Version Update Script
// Updates README.md and other files based on version.js configuration

const fs = require('fs');
const path = require('path');

// Load version configuration
const APP_VERSION = require('../version.js');

console.log(`🔄 Updating version to ${APP_VERSION.full}...`);

// Update README.md
const readmePath = path.join(__dirname, '../README.md');
let readmeContent = fs.readFileSync(readmePath, 'utf8');

// Update version badge and title
readmeContent = readmeContent.replace(
    /# 🚀 Advanced Retirement Planner v[\d.]+/,
    `# 🚀 Advanced Retirement Planner v${APP_VERSION.full}`
);

readmeContent = readmeContent.replace(
    /badge\/version-[\d.]+-blue/,
    `badge/version-${APP_VERSION.full}-blue`
);

readmeContent = readmeContent.replace(
    /badge\/QA-[\d.]+%-brightgreen/,
    `badge/QA-${APP_VERSION.qaScore}%-brightgreen`
);

// Update main section header
readmeContent = readmeContent.replace(
    /## 🎨 What's New in v[\d.]+ -/,
    `## 🎨 What's New in v${APP_VERSION.full} -`
);

fs.writeFileSync(readmePath, readmeContent);
console.log('✅ Updated README.md');

// Update wiki instructions
const wikiPath = path.join(__dirname, '../update-wiki.md');
let wikiContent = fs.readFileSync(wikiPath, 'utf8');

wikiContent = wikiContent.replace(
    /## 🎯 Key Updates for v[\d.]+:/,
    `## 🎯 Key Updates for v${APP_VERSION.full}:`
);

wikiContent = wikiContent.replace(
    /git commit -m "Update wiki for v[\d.]+ release"/,
    `git commit -m "Update wiki for v${APP_VERSION.full} release"`
);

fs.writeFileSync(wikiPath, wikiContent);
console.log('✅ Updated update-wiki.md');

// Update package.json if it exists
const packagePath = path.join(__dirname, '../package.json');
if (fs.existsSync(packagePath)) {
    let packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    packageContent.version = APP_VERSION.full;
    fs.writeFileSync(packagePath, JSON.stringify(packageContent, null, 2));
    console.log('✅ Updated package.json');
}

console.log(`🎉 Version update complete! All files now reference v${APP_VERSION.full}`);
console.log(`📊 QA Score: ${APP_VERSION.qaScore}%`);
console.log(`📅 Build Date: ${APP_VERSION.buildDate}`);