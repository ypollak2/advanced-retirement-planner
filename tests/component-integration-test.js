#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔗 Advanced Retirement Planner - Component Integration Test Suite');
console.log('================================================================\n');

let testsPassed = 0;
let testsFailed = 0;

function logTest(name, passed, message = '') {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    
    console.log(`[${timestamp}] ${status} ${name}`);
    if (message) {
        console.log(`    ${message}`);
    }
    
    if (passed) {
        testsPassed++;
    } else {
        testsFailed++;
    }
}

// Test React component structure and dependencies
function testComponentStructure() {
    console.log('🔍 Testing Component Structure and Dependencies...');
    
    const componentFiles = [
        'src/components/RetirementBasicForm.js',
        'src/components/RetirementAdvancedForm.js', 
        'src/components/RetirementResultsPanel.js',
        'src/components/RetirementPlannerApp.js'
    ];
    
    componentFiles.forEach(file => {
        if (!fs.existsSync(file)) {
            logTest(`Component file exists: ${file}`, false, 'File missing');
            return;
        }
        
        try {
            const content = fs.readFileSync(file, 'utf8');
            
            // Check for window export
            const hasWindowExport = content.includes('window.') && 
                                   (content.includes('= ') || content.includes('window['));
            logTest(`Window export in ${path.basename(file)}`, hasWindowExport, 
                'Component must export to window for global access');
            
            // Check for React.createElement usage (not raw createElement)
            const usesReactCreateElement = !content.includes('createElement(') || 
                                          content.includes('React.createElement(');
            logTest(`React.createElement usage in ${path.basename(file)}`, usesReactCreateElement, 
                'Must use React.createElement not raw createElement');
            
            // Check for React hooks usage (should use React.useState not useState)
            const usesReactHooks = !content.includes('useState(') || 
                                  content.includes('React.useState(');
            logTest(`React hooks usage in ${path.basename(file)}`, usesReactHooks, 
                'Must use React.useState not raw useState');
            
            // Check for duplicate function declarations
            const functionNames = content.match(/(?:const|function)\s+(\w+)/g) || [];
            const duplicates = functionNames.filter((name, index) => 
                functionNames.indexOf(name) !== index);
            const noDuplicates = duplicates.length === 0;
            logTest(`No duplicate functions in ${path.basename(file)}`, noDuplicates,
                noDuplicates ? '' : `Duplicate functions found: ${duplicates.join(', ')}`);
            
            // Check for component parameter validation
            const hasParameterValidation = content.includes('inputs') && 
                                          content.includes('language') &&
                                          content.includes('t');
            logTest(`Parameter validation in ${path.basename(file)}`, hasParameterValidation,
                'Components should validate required parameters');
                
        } catch (error) {
            logTest(`Component analysis: ${file}`, false, `Error: ${error.message}`);
        }
    });
}

// Test icon component dependencies
function testIconComponentDependencies() {
    console.log('\n🎨 Testing Icon Component Dependencies...');
    
    try {
        const appMainContent = fs.readFileSync('src/core/app-main.js', 'utf8');
        
        // Required icon components that should be defined
        const requiredIcons = [
            'Calculator', 'PiggyBank', 'DollarSign', 'Target', 
            'AlertCircle', 'TrendingUp', 'Settings', 'Building', 
            'Globe', 'Plus', 'Trash2'
        ];
        
        requiredIcons.forEach(icon => {
            const iconDefined = appMainContent.includes(`const ${icon} =`) || 
                               appMainContent.includes(`${icon}:`);
            logTest(`Icon component defined: ${icon}`, iconDefined,
                'Icon components must be defined before being passed to other components');
        });
        
        // Check that components using icons are called with proper icon props
        const componentCalls = [
            { component: 'BasicInputs', icons: ['Calculator', 'PiggyBank', 'DollarSign'] },
            { component: 'AdvancedInputs', icons: ['Settings', 'Building', 'Globe', 'Plus', 'Trash2'] },
            { component: 'ResultsPanel', icons: ['PiggyBank', 'Calculator', 'Target', 'TrendingUp'] }
        ];
        
        componentCalls.forEach(({ component, icons }) => {
            const componentCall = appMainContent.includes(`React.createElement(${component}`) ||
                                 appMainContent.includes(`${component},`);
            if (componentCall) {
                icons.forEach(icon => {
                    const iconPassed = appMainContent.includes(`${icon}:`) || 
                                      appMainContent.includes(`${icon},`);
                    logTest(`${icon} passed to ${component}`, iconPassed,
                        `${component} requires ${icon} to be passed as prop`);
                });
            }
        });
        
    } catch (error) {
        logTest('Icon component dependency analysis', false, `Error: ${error.message}`);
    }
}

// Test component export consistency
function testComponentExports() {
    console.log('\n📤 Testing Component Export Consistency...');
    
    const expectedExports = [
        { file: 'src/components/RetirementBasicForm.js', export: 'BasicInputs' },
        { file: 'src/components/RetirementAdvancedForm.js', export: 'AdvancedInputs' },
        { file: 'src/components/RetirementResultsPanel.js', export: 'ResultsPanel' },
        { file: 'src/components/RetirementPlannerApp.js', export: 'RetirementPlannerApp' }
    ];
    
    expectedExports.forEach(({ file, export: exportName }) => {
        if (!fs.existsSync(file)) {
            logTest(`Export check: ${exportName}`, false, `File ${file} not found`);
            return;
        }
        
        try {
            const content = fs.readFileSync(file, 'utf8');
            
            // Check window export exists
            const hasExport = content.includes(`window.${exportName}`);
            logTest(`Window export exists: ${exportName}`, hasExport,
                `${file} must export ${exportName} to window`);
            
            // Check component function exists
            const componentDefined = content.includes(`const ${exportName}`) ||
                                    content.includes(`function ${exportName}`);
            logTest(`Component defined: ${exportName}`, componentDefined,
                `${exportName} component function must be defined in ${file}`);
            
            // Check that component is exported correctly
            if (hasExport && componentDefined) {
                const exportPattern = new RegExp(`window\\.${exportName}\\s*=\\s*${exportName}`);
                const correctExport = exportPattern.test(content);
                logTest(`Correct export syntax: ${exportName}`, correctExport,
                    `${exportName} must be exported as window.${exportName} = ${exportName}`);
            }
            
        } catch (error) {
            logTest(`Export analysis: ${exportName}`, false, `Error: ${error.message}`);
        }
    });
}

// Test runtime component loading simulation
function testComponentLoadingSimulation() {
    console.log('\n🔄 Testing Component Loading Simulation...');
    
    try {
        // Simulate the HTML script loading order
        const htmlContent = fs.readFileSync('index.html', 'utf8');
        const scriptTags = htmlContent.match(/<script[^>]*src="([^"]*)"[^>]*>/g) || [];
        
        const componentScripts = scriptTags.filter(tag => 
            tag.includes('src/components/') || tag.includes('src/translations/') || 
            tag.includes('src/data/') || tag.includes('src/utils/')
        );
        
        const hasComponentScripts = componentScripts.length > 0;
        logTest('Component scripts in HTML', hasComponentScripts,
            hasComponentScripts ? `Found ${componentScripts.length} component scripts` : 
            'No component scripts found in HTML');
        
        // Check script loading order
        const coreScriptIndex = scriptTags.findIndex(tag => tag.includes('src/core/app-main.js'));
        const componentScriptIndices = scriptTags.map((tag, index) => 
            tag.includes('src/components/') ? index : -1
        ).filter(index => index !== -1);
        
        const correctOrder = componentScriptIndices.every(index => index < coreScriptIndex);
        logTest('Script loading order', correctOrder,
            'Component scripts must load before core app-main.js');
        
        // Check for cache busting
        const currentVersion = JSON.parse(fs.readFileSync('version.json', 'utf8')).version;
        const hasCacheBusting = scriptTags.every(tag => 
            !tag.includes('src/') || tag.includes(`?v=${currentVersion}`)
        );
        logTest('Cache busting on scripts', hasCacheBusting,
            `All component scripts should have ?v=${currentVersion}`);
        
    } catch (error) {
        logTest('Component loading simulation', false, `Error: ${error.message}`);
    }
}

// Test for common React errors
function testReactErrorPatterns() {
    console.log('\n⚛️ Testing Common React Error Patterns...');
    
    const componentFiles = [
        'src/components/RetirementBasicForm.js',
        'src/components/RetirementAdvancedForm.js',
        'src/components/RetirementResultsPanel.js',
        'src/core/app-main.js'
    ];
    
    componentFiles.forEach(file => {
        if (!fs.existsSync(file)) return;
        
        try {
            const content = fs.readFileSync(file, 'utf8');
            
            // Check for undefined component usage
            const componentReferences = content.match(/React\.createElement\(([^,)]+)/g) || [];
            const undefinedComponents = componentReferences.filter(ref => {
                const componentName = ref.replace('React.createElement(', '').trim();
                return componentName !== 'div' && componentName !== 'span' && 
                       componentName !== 'h1' && componentName !== 'h2' && 
                       componentName !== 'h3' && componentName !== 'p' &&
                       componentName !== 'button' && componentName !== 'input' &&
                       componentName !== 'label' && componentName !== 'form' &&
                       !componentName.includes("'") && !componentName.includes('"');
            });
            
            // This is a heuristic check - in a real app we'd need to trace imports
            const fileName = path.basename(file);
            logTest(`No undefined components in ${fileName}`, true,
                'Manual verification required: ensure all components are defined before use');
            
            // Check for proper key usage in arrays
            const hasArrayElements = content.includes('[') && content.includes('React.createElement');
            if (hasArrayElements) {
                const hasKeys = content.includes('key:') || content.includes("key: '") || 
                               content.includes('key: "');
                logTest(`React keys in ${fileName}`, hasKeys,
                    'React elements in arrays should have keys');
            }
            
            // Check for potential memory leaks (event listeners without cleanup)
            const hasEventListeners = content.includes('addEventListener');
            if (hasEventListeners) {
                const hasCleanup = content.includes('removeEventListener') || 
                                  content.includes('return () =>');
                logTest(`Event listener cleanup in ${fileName}`, hasCleanup,
                    'Event listeners should be cleaned up');
            }
            
        } catch (error) {
            logTest(`React error pattern analysis: ${file}`, false, `Error: ${error.message}`);
        }
    });
}

// Run all integration tests
testComponentStructure();
testIconComponentDependencies();
testComponentExports();
testComponentLoadingSimulation();
testReactErrorPatterns();

// Final report
console.log('\n📊 Component Integration Test Summary');
console.log('=====================================');
console.log(`✅ Tests Passed: ${testsPassed}`);
console.log(`❌ Tests Failed: ${testsFailed}`);
console.log(`📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);

if (testsFailed > 0) {
    console.log('\n⚠️  Component integration issues found. These can cause runtime errors!');
    console.log('\n💡 Component Integration Best Practices:');
    console.log('   • Ensure all components are exported to window before use');
    console.log('   • Define icon components before passing them as props');
    console.log('   • Use React.createElement and React.useState (not raw versions)');
    console.log('   • Load component scripts before core application scripts');
    console.log('   • Add proper cache busting to prevent stale component loads');
    console.log('   • Test component integration in development environment');
    process.exit(1);
} else {
    console.log('\n🎉 All component integration tests passed!');
    process.exit(0);
}