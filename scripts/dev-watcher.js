#!/usr/bin/env node
// Development File Watcher with Auto-Validation
// Created by Yali Pollak (יהלי פולק) - v6.2.0

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Development File Watcher Starting...\n');

// Configuration
const watchDirectories = ['src/components', 'src/utils', 'src/modules', 'tests'];
const debounceDelay = 1000; // 1 second debounce
const validationTimeouts = new Map();

// Track validation stats
let validationStats = {
    totalValidations: 0,
    successfulValidations: 0,
    failedValidations: 0,
    startTime: Date.now()
};

// Color codes for better output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function colorize(text, color) {
    return `${colors[color]}${text}${colors.reset}`;
}

// Validate a specific file
function validateFile(filePath) {
    const relativePath = path.relative(process.cwd(), filePath);
    
    console.log(`${colorize('🔍', 'blue')} Validating: ${colorize(relativePath, 'cyan')}`);
    
    try {
        // Quick syntax check
        execSync(`node -c "${filePath}"`, { stdio: 'ignore' });
        
        // Browser compatibility check for component/util files
        if (filePath.includes('src/components/') || filePath.includes('src/utils/')) {
            const content = fs.readFileSync(filePath, 'utf8');
            
            if (content.includes('export default') || content.includes('export {') || 
                (content.includes('import ') && !content.includes('// @ts-ignore'))) {
                console.log(`  ${colorize('⚠️', 'yellow')} Browser compatibility warning: ES6 modules detected`);
            }
        }
        
        console.log(`  ${colorize('✅', 'green')} Syntax valid`);
        validationStats.successfulValidations++;
        return true;
        
    } catch (error) {
        console.log(`  ${colorize('❌', 'red')} Syntax error: ${error.message.split('\\n')[0]}`);
        validationStats.failedValidations++;
        return false;
    }
}

// Debounced validation function
function scheduleValidation(filePath) {
    // Clear existing timeout for this file
    if (validationTimeouts.has(filePath)) {
        clearTimeout(validationTimeouts.get(filePath));
    }
    
    // Schedule new validation
    const timeout = setTimeout(() => {
        validationStats.totalValidations++;
        validateFile(filePath);
        validationTimeouts.delete(filePath);
        
        // Show stats every 10 validations
        if (validationStats.totalValidations % 10 === 0) {
            showStats();
        }
    }, debounceDelay);
    
    validationTimeouts.set(filePath, timeout);
}

// Show validation statistics
function showStats() {
    const uptime = Math.floor((Date.now() - validationStats.startTime) / 1000);
    const successRate = validationStats.totalValidations > 0 
        ? Math.round((validationStats.successfulValidations / validationStats.totalValidations) * 100)
        : 0;
    
    console.log(`\\n${colorize('📊', 'magenta')} Stats: ${validationStats.totalValidations} validations, ${successRate}% success rate, ${uptime}s uptime\\n`);
}

// Watch directory for changes
function watchDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        console.log(`${colorize('⚠️', 'yellow')} Directory not found: ${dirPath}`);
        return;
    }
    
    console.log(`${colorize('👁️', 'blue')} Watching: ${colorize(dirPath, 'cyan')}`);
    
    // Watch for changes
    fs.watch(dirPath, { recursive: true }, (eventType, filename) => {
        if (!filename || !filename.endsWith('.js')) {
            return; // Only watch JS files
        }
        
        const fullPath = path.join(dirPath, filename);
        
        // Only validate if file exists (handles deletion events)
        if (fs.existsSync(fullPath)) {
            const now = new Date().toLocaleTimeString();
            console.log(`\\n${colorize(now, 'magenta')} ${colorize('📝', 'blue')} File changed: ${colorize(filename, 'cyan')}`);
            scheduleValidation(fullPath);
        }
    });
}

// Enhanced error handling
function handleError(error) {
    console.error(`${colorize('❌', 'red')} Watcher error:`, error.message);
    
    // Try to restart watching after a brief delay
    setTimeout(() => {
        console.log(`${colorize('🔄', 'yellow')} Attempting to restart watcher...`);
        startWatching();
    }, 5000);
}

// Main watch function
function startWatching() {
    try {
        console.log(`${colorize('🚀', 'green')} Development validation watcher initialized`);
        console.log(`${colorize('⏱️', 'blue')} Debounce delay: ${debounceDelay}ms`);
        console.log(`${colorize('📁', 'blue')} Watching directories: ${watchDirectories.join(', ')}\\n`);
        
        // Start watching each directory
        watchDirectories.forEach(dir => {
            try {
                watchDirectory(dir);
            } catch (error) {
                console.log(`${colorize('⚠️', 'yellow')} Failed to watch ${dir}: ${error.message}`);
            }
        });
        
        // Initial validation of all files
        console.log(`\\n${colorize('🔍', 'blue')} Running initial validation of all files...\\n`);
        
        watchDirectories.forEach(dir => {
            if (fs.existsSync(dir)) {
                const files = fs.readdirSync(dir, { recursive: true })
                    .filter(file => file.endsWith('.js'))
                    .map(file => path.join(dir, file));
                
                files.forEach(file => {
                    validationStats.totalValidations++;
                    validateFile(file);
                });
            }
        });
        
        showStats();
        
        console.log(`\\n${colorize('👀', 'green')} Watching for changes... (Press Ctrl+C to stop)\\n`);
        
    } catch (error) {
        handleError(error);
    }
}

// Graceful shutdown
process.on('SIGINT', () => {
    console.log(`\\n\\n${colorize('👋', 'yellow')} Development watcher stopping...`);
    showStats();
    console.log(`${colorize('✅', 'green')} Goodbye!`);
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log(`\\n\\n${colorize('👋', 'yellow')} Development watcher terminated...`);
    showStats();
    process.exit(0);
});

// Start the watcher
startWatching();