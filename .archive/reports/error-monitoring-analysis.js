#!/usr/bin/env node

// Comprehensive Error Monitoring and Analysis Report
// Identifies runtime errors, initialization issues, and provides specific fixes
// Created for Advanced Retirement Planner - v6.6.4

const fs = require('fs');
const path = require('path');

console.log('🔍 Comprehensive Error Monitoring and Analysis Report');
console.log('==================================================\n');

// Error analysis results
const errorReport = {
    criticalErrors: [],
    runtimeErrors: [], 
    initializationErrors: [],
    scopeIssues: [],
    undefinedPropertyErrors: [],
    memoryLeaks: [],
    raceConditions: [],
    errorHandlingGaps: [],
    recommendations: [],
    fixes: []
};

// 1. Analyze getUnifiedProjectionData initialization error
console.log('🔬 1. Analyzing getUnifiedProjectionData initialization error...\n');

function analyzeGetUnifiedProjectionDataError() {
    const dynamicChartsPath = 'src/components/charts/DynamicPartnerCharts.js';
    
    if (fs.existsSync(dynamicChartsPath)) {
        const content = fs.readFileSync(dynamicChartsPath, 'utf8');
        
        // Check for hoisting issues
        const useCallbackPattern = /const\s+getUnifiedProjectionData\s*=\s*React\.useCallback/;
        const usagePattern = /getUnifiedProjectionData\(\)/g;
        const useMemoPattern = /React\.useMemo.*getUnifiedProjectionData/;
        
        const useCallbackMatch = content.match(useCallbackPattern);
        const usageMatches = [...content.matchAll(usagePattern)];
        const useMemoMatch = content.match(useMemoPattern);
        
        if (useCallbackMatch && useMemoMatch && usageMatches.length > 1) {
            errorReport.criticalErrors.push({
                type: 'Initialization Error',
                file: dynamicChartsPath,
                error: 'Cannot access \'getUnifiedProjectionData\' before initialization',
                location: 'Line 37: React.useMemo(() => { const data = getUnifiedProjectionData(); ...',
                rootCause: 'React.useMemo runs before React.useCallback definition is complete, causing temporal dead zone error',
                severity: 'CRITICAL',
                impact: 'Chart component crashes on render, blocking user interface',
                fix: {
                    description: 'Move getUnifiedProjectionData logic outside useCallback or restructure dependencies',
                    implementation: `
// CURRENT PROBLEMATIC CODE (Lines 20-40):
const getUnifiedProjectionData = React.useCallback(() => {
    // ... callback logic
}, [inputs]);

const memoizedChartData = React.useMemo(() => {
    const data = getUnifiedProjectionData(); // ❌ ERROR: Accessing before initialization
    return data;
}, [getUnifiedProjectionData, chartView]);

// FIXED VERSION:
const memoizedChartData = React.useMemo(() => {
    // Move logic directly into useMemo
    if (!window.calculateProgressiveSavings) {
        console.warn('DynamicPartnerCharts: Progressive savings calculation function not available');
        return { primary: [], partner: [], combined: [] };
    }
    
    try {
        return window.calculateProgressiveSavings(inputs, [], []);
    } catch (error) {
        console.warn('DynamicPartnerCharts: Error generating progressive projections:', error);
        return { primary: [], partner: [], combined: [] };
    }
}, [inputs, chartView]);

// Remove getUnifiedProjectionData useCallback entirely
                    `
                }
            });
            
            console.log('❌ CRITICAL ERROR FOUND: getUnifiedProjectionData initialization issue');
            console.log('   📍 File: src/components/charts/DynamicPartnerCharts.js');
            console.log('   🔍 Root Cause: Temporal dead zone - React.useMemo accessing useCallback before initialization');
            console.log('   💥 Impact: Chart component crashes on render');
        } else {
            console.log('✅ No getUnifiedProjectionData initialization errors detected');
        }
    } else {
        console.log('⚠️  DynamicPartnerCharts.js not found');
    }
}

analyzeGetUnifiedProjectionDataError();

// 2. Analyze financialHealthEngine "undefined reading status" error
console.log('\n🔬 2. Analyzing financialHealthEngine status property errors...\n');

function analyzeFinancialHealthEngineError() {
    const enginePath = 'src/utils/financialHealthEngine.js';
    const meterPath = 'src/components/shared/EnhancedFinancialHealthMeter.js';
    
    let statusErrors = [];
    
    // Check financial health engine
    if (fs.existsSync(enginePath)) {
        const content = fs.readFileSync(enginePath, 'utf8');
        
        // Look for status property access without null checks
        const statusAccessPatterns = [
            /\.status\s*===?\s*['"`]/g,
            /factorData\.details\.status/g,
            /details\.status/g,
            /status:\s*status/g
        ];
        
        statusAccessPatterns.forEach(pattern => {
            const matches = [...content.matchAll(pattern)];
            matches.forEach(match => {
                const lineNumber = content.substring(0, match.index).split('\n').length;
                statusErrors.push({
                    file: enginePath,
                    line: lineNumber,
                    pattern: match[0],
                    context: content.split('\n')[lineNumber - 1]?.trim()
                });
            });
        });
    }
    
    // Check enhanced financial health meter
    if (fs.existsSync(meterPath)) {
        const content = fs.readFileSync(meterPath, 'utf8');
        
        // Look for status property access
        const statusAccessPattern = /\.status/g;
        const matches = [...content.matchAll(statusAccessPattern)];
        
        matches.forEach(match => {
            const lineNumber = content.substring(0, match.index).split('\n').length;
            const contextLine = content.split('\n')[lineNumber - 1]?.trim();
            
            if (contextLine && !contextLine.includes('?') && !contextLine.includes('&&')) {
                statusErrors.push({
                    file: meterPath,
                    line: lineNumber,
                    pattern: match[0],
                    context: contextLine
                });
            }
        });
    }
    
    if (statusErrors.length > 0) {
        errorReport.undefinedPropertyErrors.push({
            type: 'Undefined Property Access',
            error: 'Cannot read properties of undefined (reading \'status\')',
            locations: statusErrors,
            rootCause: 'Accessing .status property on potentially undefined factorData.details objects',
            severity: 'HIGH',
            impact: 'Financial health meter component may crash when calculations fail',
            fix: {
                description: 'Add null checks and fallback values for status property access',
                implementation: `
// PROBLEMATIC PATTERNS:
factorData.details.status === 'excellent'  // ❌ May crash if details is undefined
getStatusColor(status)  // ❌ May crash if status is undefined

// FIXED VERSION:
const status = factorData?.details?.status || 'unknown';
if (status !== 'unknown') {
    getStatusColor(status);
}

// OR with fallback:
const safeStatus = factorData?.details?.status ?? 'critical';
getStatusColor(safeStatus);
                `
            }
        });
        
        console.log(`❌ UNDEFINED PROPERTY ERRORS FOUND: ${statusErrors.length} status property access issues`);
        statusErrors.forEach(error => {
            console.log(`   📍 ${error.file}:${error.line} - ${error.context}`);
        });
    } else {
        console.log('✅ No status property access errors detected');
    }
}

analyzeFinancialHealthEngineError();

// 3. Search for other runtime errors
console.log('\n🔬 3. Scanning for additional runtime errors...\n');

function scanForRuntimeErrors() {
    const srcDir = 'src';
    const errorPatterns = [
        { pattern: /console\.error\(['"`]([^'"`]+)['"`]/g, type: 'Console Error' },
        { pattern: /throw new Error\(['"`]([^'"`]+)['"`]/g, type: 'Thrown Error' },
        { pattern: /TypeError:\s*([^\n]+)/g, type: 'Type Error' },
        { pattern: /ReferenceError:\s*([^\n]+)/g, type: 'Reference Error' },
        { pattern: /Cannot read propert(y|ies) of (undefined|null)/g, type: 'Property Access Error' },
        { pattern: /is not a function/g, type: 'Function Call Error' },
        { pattern: /Cannot access '([^']+)' before initialization/g, type: 'Initialization Error' }
    ];
    
    function scanFile(filePath) {
        if (!fs.existsSync(filePath) || !filePath.endsWith('.js')) return;
        
        const content = fs.readFileSync(filePath, 'utf8');
        const relativePath = path.relative('.', filePath);
        
        errorPatterns.forEach(({ pattern, type }) => {
            const matches = [...content.matchAll(pattern)];
            matches.forEach(match => {
                const lineNumber = content.substring(0, match.index).split('\n').length;
                const contextLine = content.split('\n')[lineNumber - 1]?.trim();
                
                errorReport.runtimeErrors.push({
                    type,
                    file: relativePath,
                    line: lineNumber,
                    match: match[0],
                    context: contextLine
                });
            });
        });
    }
    
    function scanDirectory(dir) {
        if (!fs.existsSync(dir)) return;
        
        const items = fs.readdirSync(dir);
        items.forEach(item => {
            const itemPath = path.join(dir, item);
            if (fs.statSync(itemPath).isDirectory()) {
                scanDirectory(itemPath);
            } else if (item.endsWith('.js')) {
                scanFile(itemPath);
            }
        });
    }
    
    scanDirectory(srcDir);
    
    if (errorReport.runtimeErrors.length > 0) {
        console.log(`🔍 Found ${errorReport.runtimeErrors.length} potential runtime error patterns:`);
        
        const errorsByType = {};
        errorReport.runtimeErrors.forEach(error => {
            if (!errorsByType[error.type]) errorsByType[error.type] = [];
            errorsByType[error.type].push(error);
        });
        
        Object.entries(errorsByType).forEach(([type, errors]) => {
            console.log(`\n   📋 ${type} (${errors.length} instances):`);
            errors.slice(0, 3).forEach(error => {
                console.log(`      📍 ${error.file}:${error.line} - ${error.context}`);
            });
            if (errors.length > 3) {
                console.log(`      ... and ${errors.length - 3} more`);
            }
        });
    } else {
        console.log('✅ No obvious runtime error patterns detected in source code');
    }
}

scanForRuntimeErrors();

// 4. Check for proper error handling
console.log('\n🔬 4. Analyzing error handling coverage...\n');

function analyzeErrorHandling() {
    const criticalFiles = [
        'src/utils/retirementCalculations.js',
        'src/utils/financialHealthEngine.js',
        'src/components/core/RetirementPlannerApp.js',
        'src/components/charts/DynamicPartnerCharts.js',
        'src/utils/currencyExchange.js'
    ];
    
    criticalFiles.forEach(filePath => {
        if (!fs.existsSync(filePath)) return;
        
        const content = fs.readFileSync(filePath, 'utf8');
        const relativePath = path.relative('.', filePath);
        
        // Count try-catch blocks
        const tryCatchCount = (content.match(/try\s*\{/g) || []).length;
        const errorHandlerCount = (content.match(/catch\s*\([^)]*\)/g) || []).length;
        const throwCount = (content.match(/throw\s+/g) || []).length;
        const consoleErrorCount = (content.match(/console\.error/g) || []).length;
        
        // Check for proper error handling patterns
        const hasErrorBoundary = content.includes('componentDidCatch') || content.includes('ErrorBoundary');
        const hasNullChecks = (content.match(/\?\.|&&\s*\w+\.|if\s*\([^)]*null\)/g) || []).length > 5;
        const hasTypeChecks = (content.match(/typeof\s+\w+\s*[=!]==?\s*['"`]/g) || []).length > 0;
        
        const errorHandlingScore = (
            (tryCatchCount > 0 ? 25 : 0) +
            (hasNullChecks ? 25 : 0) +
            (hasTypeChecks ? 25 : 0) +
            (consoleErrorCount > 0 ? 25 : 0)
        );
        
        if (errorHandlingScore < 75) {
            errorReport.errorHandlingGaps.push({
                file: relativePath,
                score: errorHandlingScore,
                issues: [
                    ...(tryCatchCount === 0 ? ['Missing try-catch blocks'] : []),
                    ...(consoleErrorCount === 0 ? ['No error logging'] : []),
                    ...(!hasNullChecks ? ['Insufficient null checks'] : []),
                    ...(!hasTypeChecks ? ['No type checking'] : [])
                ]
            });
        }
        
        console.log(`   📊 ${relativePath}: ${errorHandlingScore}/100 error handling score`);
        if (errorHandlingScore < 75) {
            console.log(`      ⚠️  Needs improvement: ${errorReport.errorHandlingGaps[errorReport.errorHandlingGaps.length - 1].issues.join(', ')}`);
        }
    });
}

analyzeErrorHandling();

// 5. Check for memory leaks and race conditions
console.log('\n🔬 5. Scanning for memory leaks and race conditions...\n');

function analyzeMemoryAndRaceConditions() {
    const problemPatterns = [
        {
            pattern: /setInterval\([^)]+\)/g,
            type: 'Potential Memory Leak',
            description: 'setInterval without clearInterval cleanup'
        },
        {
            pattern: /setTimeout\([^)]+\)/g,
            type: 'Potential Memory Leak', 
            description: 'setTimeout without clearTimeout cleanup'
        },
        {
            pattern: /addEventListener\([^)]+\)/g,
            type: 'Potential Memory Leak',
            description: 'addEventListener without removeEventListener cleanup'
        },
        {
            pattern: /useEffect\([^,]+,\s*\[\]/g,
            type: 'Potential Race Condition',
            description: 'useEffect with empty dependency array may cause stale closures'
        }
    ];
    
    function scanForPatterns(filePath) {
        if (!fs.existsSync(filePath) || !filePath.endsWith('.js')) return;
        
        const content = fs.readFileSync(filePath, 'utf8');
        const relativePath = path.relative('.', filePath);
        
        problemPatterns.forEach(({ pattern, type, description }) => {
            const matches = [...content.matchAll(pattern)];
            matches.forEach(match => {
                const lineNumber = content.substring(0, match.index).split('\n').length;
                const contextLine = content.split('\n')[lineNumber - 1]?.trim();
                
                // Check if there's cleanup logic nearby
                const hasCleanup = content.includes('clearInterval') || 
                                 content.includes('clearTimeout') || 
                                 content.includes('removeEventListener') ||
                                 content.includes('return () => {');
                
                if (!hasCleanup || type === 'Potential Race Condition') {
                    if (type === 'Potential Memory Leak') {
                        errorReport.memoryLeaks.push({
                            file: relativePath,
                            line: lineNumber,
                            type,
                            description,
                            context: contextLine
                        });
                    } else {
                        errorReport.raceConditions.push({
                            file: relativePath,
                            line: lineNumber,
                            type,
                            description,
                            context: contextLine
                        });
                    }
                }
            });
        });
    }
    
    // Scan all React components
    function scanDirectory(dir) {
        if (!fs.existsSync(dir)) return;
        
        const items = fs.readdirSync(dir);
        items.forEach(item => {
            const itemPath = path.join(dir, item);
            if (fs.statSync(itemPath).isDirectory()) {
                scanDirectory(itemPath);
            } else if (item.endsWith('.js')) {
                scanForPatterns(itemPath);
            }
        });
    }
    
    scanDirectory('src');
    
    if (errorReport.memoryLeaks.length > 0) {
        console.log(`⚠️  Found ${errorReport.memoryLeaks.length} potential memory leak patterns`);
        errorReport.memoryLeaks.forEach(leak => {
            console.log(`   📍 ${leak.file}:${leak.line} - ${leak.description}`);
        });
    } else {
        console.log('✅ No obvious memory leak patterns detected');
    }
    
    if (errorReport.raceConditions.length > 0) {
        console.log(`⚠️  Found ${errorReport.raceConditions.length} potential race condition patterns`);
        errorReport.raceConditions.forEach(race => {
            console.log(`   📍 ${race.file}:${race.line} - ${race.description}`);
        });
    } else {
        console.log('✅ No obvious race condition patterns detected');
    }
}

analyzeMemoryAndRaceConditions();

// 6. Generate comprehensive recommendations
console.log('\n🎯 6. Generating actionable recommendations...\n');

function generateRecommendations() {
    // Priority 1: Critical errors that break functionality
    if (errorReport.criticalErrors.length > 0) {
        errorReport.recommendations.push({
            priority: 'CRITICAL',
            category: 'Initialization Errors',
            action: 'Fix getUnifiedProjectionData temporal dead zone error immediately',
            impact: 'Prevents chart component crashes and improves user experience',
            effort: 'Low (30 minutes)',
            implementation: 'Move logic from useCallback to useMemo or restructure dependencies'
        });
    }
    
    // Priority 2: Undefined property access
    if (errorReport.undefinedPropertyErrors.length > 0) {
        errorReport.recommendations.push({
            priority: 'HIGH', 
            category: 'Null Safety',
            action: 'Add null checks and fallback values for all status property access',
            impact: 'Prevents financial health meter crashes',
            effort: 'Medium (2 hours)',
            implementation: 'Use optional chaining (?.) and nullish coalescing (??) operators'
        });
    }
    
    // Priority 3: Error handling gaps
    if (errorReport.errorHandlingGaps.length > 0) {
        errorReport.recommendations.push({
            priority: 'MEDIUM',
            category: 'Error Handling',
            action: 'Improve error handling coverage in critical components',
            impact: 'Better user experience and easier debugging',
            effort: 'High (1 day)',
            implementation: 'Add try-catch blocks, null checks, and error logging'
        });
    }
    
    // Priority 4: Memory leaks
    if (errorReport.memoryLeaks.length > 0) {
        errorReport.recommendations.push({
            priority: 'MEDIUM',
            category: 'Memory Management',
            action: 'Add cleanup functions for timers and event listeners',
            impact: 'Prevents memory leaks and improves performance',
            effort: 'Medium (3 hours)',
            implementation: 'Add cleanup in useEffect return functions'
        });
    }
    
    // Always recommend: Enhanced error monitoring
    errorReport.recommendations.push({
        priority: 'LOW',
        category: 'Monitoring',
        action: 'Implement comprehensive error tracking system',
        impact: 'Proactive error detection and faster issue resolution',
        effort: 'High (2 days)',
        implementation: 'Add error boundaries, logging service, and user feedback system'
    });
    
    console.log('📋 PRIORITIZED RECOMMENDATIONS:');
    errorReport.recommendations.forEach((rec, index) => {
        console.log(`\n   ${index + 1}. [${rec.priority}] ${rec.category}: ${rec.action}`);
        console.log(`      💥 Impact: ${rec.impact}`);
        console.log(`      ⏱️  Effort: ${rec.effort}`);
        console.log(`      🔧 Implementation: ${rec.implementation}`);
    });
}

generateRecommendations();

// 7. Generate specific fixes
console.log('\n🔧 7. Specific Code Fixes...\n');

function generateSpecificFixes() {
    // Fix 1: getUnifiedProjectionData initialization error
    errorReport.fixes.push({
        file: 'src/components/charts/DynamicPartnerCharts.js',
        issue: 'Temporal dead zone error in getUnifiedProjectionData',
        fix: `
// Replace lines 20-40 with this corrected version:
const memoizedChartData = React.useMemo(() => {
    if (!window.calculateProgressiveSavings) {
        console.warn('DynamicPartnerCharts: Progressive savings calculation function not available');
        return { primary: [], partner: [], combined: [] };
    }

    try {
        const data = window.calculateProgressiveSavings(inputs, [], []);
        return data;
    } catch (error) {
        console.warn('DynamicPartnerCharts: Error generating progressive projections:', error);
        return { primary: [], partner: [], combined: [] };
    }
}, [inputs, chartView]);

// Remove the getUnifiedProjectionData useCallback entirely
// Update getChartData function:
const getChartData = (dataType) => {
    return memoizedChartData[dataType] || [];
};
        `
    });
    
    // Fix 2: Status property access
    errorReport.fixes.push({
        file: 'src/components/shared/EnhancedFinancialHealthMeter.js',
        issue: 'Unsafe status property access',
        fix: `
// Add this helper function at the top of the component:
const getSafeStatus = (factorData) => {
    return factorData?.details?.status || 'unknown';
};

// Replace status property access with safe access:
// BEFORE: factorData.details.status === 'excellent'
// AFTER:  getSafeStatus(factorData) === 'excellent'

// Update getStatusColor calls:
const statusColor = getStatusColor(getSafeStatus(factorData));
        `
    });
    
    // Fix 3: Enhanced error boundary
    errorReport.fixes.push({
        file: 'Create new file: src/components/shared/ErrorBoundary.js',
        issue: 'Missing error boundaries for component crashes',
        fix: `
const ErrorBoundary = ({ children }) => {
    const [hasError, setHasError] = React.useState(false);
    const [error, setError] = React.useState(null);
    
    React.useEffect(() => {
        const handleError = (event) => {
            console.error('ErrorBoundary caught error:', event.error);
            setHasError(true);
            setError(event.error);
        };
        
        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleError);
        
        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleError);
        };
    }, []);
    
    if (hasError) {
        return React.createElement('div', {
            className: 'error-boundary p-6 bg-red-50 border border-red-200 rounded-lg'
        }, [
            React.createElement('h3', {
                key: 'title',
                className: 'text-red-800 font-semibold mb-2'
            }, 'Something went wrong'),
            React.createElement('p', {
                key: 'message',
                className: 'text-red-600 mb-4'
            }, 'An error occurred while loading this component. Please refresh the page.'),
            React.createElement('button', {
                key: 'retry',
                className: 'btn-primary',
                onClick: () => {
                    setHasError(false);
                    setError(null);
                }
            }, 'Try Again')
        ]);
    }
    
    return children;
};

window.ErrorBoundary = ErrorBoundary;
        `
    });
    
    console.log('🔧 SPECIFIC CODE FIXES GENERATED:');
    errorReport.fixes.forEach((fix, index) => {
        console.log(`\n   ${index + 1}. File: ${fix.file}`);
        console.log(`      Issue: ${fix.issue}`);
        console.log(`      Fix: ${fix.fix.substring(0, 100)}...`);
    });
}

generateSpecificFixes();

// 8. Generate final summary report
console.log('\n📊 FINAL ERROR ANALYSIS SUMMARY');
console.log('================================\n');

const totalIssues = errorReport.criticalErrors.length + 
                   errorReport.undefinedPropertyErrors.length + 
                   errorReport.memoryLeaks.length + 
                   errorReport.raceConditions.length +
                   errorReport.errorHandlingGaps.length;

console.log(`🔍 ISSUES DETECTED: ${totalIssues} total issues found`);
console.log(`   🔴 Critical Errors: ${errorReport.criticalErrors.length}`);
console.log(`   🟠 Undefined Property Errors: ${errorReport.undefinedPropertyErrors.length}`);
console.log(`   🟡 Memory Leaks: ${errorReport.memoryLeaks.length}`);
console.log(`   🟡 Race Conditions: ${errorReport.raceConditions.length}`);
console.log(`   🔵 Error Handling Gaps: ${errorReport.errorHandlingGaps.length}`);

console.log(`\n🎯 ACTIONABLE ITEMS: ${errorReport.recommendations.length} recommendations generated`);
console.log(`🔧 CODE FIXES: ${errorReport.fixes.length} specific fixes provided`);

// Severity assessment
let overallSeverity = 'LOW';
if (errorReport.criticalErrors.length > 0) overallSeverity = 'CRITICAL';
else if (errorReport.undefinedPropertyErrors.length > 0) overallSeverity = 'HIGH';
else if (errorReport.memoryLeaks.length > 0 || errorReport.raceConditions.length > 0) overallSeverity = 'MEDIUM';

console.log(`\n🚨 OVERALL SEVERITY: ${overallSeverity}`);
console.log(`📈 CONFIDENCE LEVEL: ${totalIssues === 0 ? 'High' : 'Medium'} (based on static analysis)`);

// Next steps
console.log('\n📝 IMMEDIATE NEXT STEPS:');
console.log('1. Fix critical getUnifiedProjectionData initialization error (PRIORITY 1)');
console.log('2. Add null safety checks for status property access (PRIORITY 2)');
console.log('3. Run application in browser with DevTools to catch additional runtime errors');
console.log('4. Implement error boundary component for graceful error handling');
console.log('5. Add comprehensive error logging and user feedback system');

// Save detailed report
const reportData = {
    timestamp: new Date().toISOString(),
    totalIssues,
    overallSeverity,
    ...errorReport
};

fs.writeFileSync('error-analysis-report.json', JSON.stringify(reportData, null, 2));
console.log('\n💾 Detailed report saved to: error-analysis-report.json');

console.log('\n✅ Error monitoring and analysis complete!');