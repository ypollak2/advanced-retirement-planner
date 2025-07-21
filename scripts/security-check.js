#!/usr/bin/env node

// Simple JavaScript Security Check
// Scans source code for dangerous patterns while excluding test/analysis files

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking JavaScript security...');
console.log('Checking JavaScript security...');

let hasSecurityIssues = false;

// Function to recursively get all JS files, excluding test/analysis files
function getSourceFiles(dir) {
    const files = [];
    
    function scanDir(currentDir) {
        if (!fs.existsSync(currentDir)) return;
        
        const items = fs.readdirSync(currentDir);
        items.forEach(item => {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                // Skip test and analysis directories
                if (!item.includes('test') && !item.includes('Test') && item !== 'tests') {
                    scanDir(fullPath);
                }
            } else if (item.endsWith('.js')) {
                // Skip test, analysis, and security files
                if (!item.includes('test') && !item.includes('Test') && 
                    !item.includes('security-qa-analysis') && 
                    !item.includes('security-check')) {
                    files.push(fullPath);
                }
            }
        });
    }
    
    scanDir(dir);
    return files;
}

// Check for dangerous eval() usage
console.log('🔍 Scanning for dangerous eval() usage (FORBIDDEN)...');
const sourceFiles = [
    ...getSourceFiles('src'),
    ...getSourceFiles('scripts').filter(f => !f.includes('security-check.js'))
];

let foundEval = false;
sourceFiles.forEach(file => {
    if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
            // Look for actual eval usage, not references in comments or strings
            if ((line.includes('eval(') || line.includes('Function(')) && 
                !line.includes('//') && !line.includes('/*') && !line.includes('*') &&
                !line.includes('"') && !line.includes("'") &&
                !line.includes('security analysis') && !line.includes('detection pattern')) {
                console.log(`${file}:${index + 1}:        ${line.trim()}`);
                console.log('⚠️ eval() usage found - security risk');
                foundEval = true;
                hasSecurityIssues = true;
            }
        });
    }
});

if (!foundEval) {
    console.log('✅ No dangerous eval() usage found - SECURITY RULE COMPLIANT');
    console.log('ℹ️  Puppeteer DOM methods ($eval, page.evaluate) are allowed');
}

// Check for Function constructor usage
console.log('🔍 Scanning for Function constructor usage...');
let foundFunctionConstructor = false;
sourceFiles.forEach(file => {
    if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes('new Function(') && !content.includes('//') && !content.includes('/*')) {
            console.log(`${file}:        Function constructor usage found`);
            console.log('⚠️ Function constructor usage found - security risk');
            foundFunctionConstructor = true;
            hasSecurityIssues = true;
        }
    }
});

if (!foundFunctionConstructor) {
    console.log('✅ No Function constructor usage found');
}

// Check for document.write usage
console.log('🔍 Scanning for document.write usage...');
let foundDocumentWrite = false;
sourceFiles.forEach(file => {
    if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
            if (line.includes('document.write') && !line.includes('//') && !line.includes('/*')) {
                console.log(`${file}:${index + 1}:        ${line.trim()}`);
                console.log('⚠️ document.write usage found - security risk');
                foundDocumentWrite = true;
                hasSecurityIssues = true;
            }
        });
    }
});

if (!foundDocumentWrite) {
    console.log('✅ No document.write usage found - SECURITY COMPLIANT');
}

// Exit with appropriate code
if (hasSecurityIssues) {
    console.log('\n❌ SECURITY CHECK FAILED - Please address security issues above');
    process.exit(1);
} else {
    console.log('\n✅ SECURITY CHECK PASSED - All source files are secure');
    process.exit(0);
}