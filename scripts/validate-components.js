#!/usr/bin/env node

/**
 * Component Validation Script
 * 
 * This script validates that all React components can be loaded and initialized
 * without throwing errors. It's designed to catch runtime errors before deployment.
 * 
 * Usage: node scripts/validate-components.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

// Results tracking
let totalComponents = 0;
let passedComponents = 0;
let failedComponents = 0;
const errors = [];

// Mock browser environment
const mockBrowserEnvironment = () => {
    const mockLocalStorage = {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {}
    };

    const mockWindow = {
        location: { hostname: 'localhost', href: 'http://localhost' },
        localStorage: mockLocalStorage,
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => {},
        setTimeout: setTimeout,
        clearTimeout: clearTimeout,
        console: console,
        a11yUtils: {
            handleWizardKeyNavigation: () => {},
            announceToScreenReader: () => {}
        },
        Chart: { register: () => {} },
        multiLanguage: { 
            updateLanguage: () => {}, 
            t: (key) => key 
        }
    };

    const mockDocument = {
        addEventListener: () => {},
        removeEventListener: () => {},
        createElement: (tag) => ({
            tagName: tag.toUpperCase(),
            style: {},
            setAttribute: () => {},
            appendChild: () => {},
            addEventListener: () => {},
            focus: () => {},
            blur: () => {}
        }),
        getElementById: () => null,
        querySelector: () => null,
        head: { appendChild: () => {} },
        body: { appendChild: () => {} },
        activeElement: null
    };

    // Create a context with mocked globals
    const context = {
        window: mockWindow,
        document: mockDocument,
        localStorage: mockLocalStorage,
        console: console,
        setTimeout: setTimeout,
        clearTimeout: clearTimeout,
        React: {
            createElement: () => ({ type: 'div' }),
            useState: () => [null, () => {}],
            useEffect: () => {},
            useCallback: (fn) => fn,
            useRef: () => ({ current: null }),
            Component: class Component { render() { return null; } }
        },
        ReactDOM: {
            createRoot: () => ({ render: () => {}, unmount: () => {} })
        }
    };

    return vm.createContext(context);
};

// Validate a single component file
function validateComponent(filePath) {
    const componentName = path.basename(filePath, '.js');
    
    try {
        // Read the component file
        const componentCode = fs.readFileSync(filePath, 'utf8');
        
        // Check for common initialization errors
        const initErrors = checkForInitializationErrors(componentCode, componentName);
        if (initErrors.length > 0) {
            throw new Error(`Initialization errors found: ${initErrors.join(', ')}`);
        }
        
        // Create a sandboxed environment
        const context = mockBrowserEnvironment();
        
        // Try to execute the component code in sandbox
        try {
            vm.runInContext(componentCode, context, {
                filename: filePath,
                timeout: 5000
            });
            
            passedComponents++;
            console.log(`${colors.green}✅ ${componentName}${colors.reset} - Validation passed`);
            
        } catch (runtimeError) {
            throw new Error(`Runtime error: ${runtimeError.message}`);
        }
        
    } catch (error) {
        failedComponents++;
        errors.push({
            component: componentName,
            file: filePath,
            error: error.message
        });
        console.log(`${colors.red}❌ ${componentName}${colors.reset} - Validation failed: ${error.message}`);
    }
    
    totalComponents++;
}

// Check for common initialization errors
function checkForInitializationErrors(code, componentName) {
    const errors = [];
    
    // Check for variables used before declaration in useEffect
    const useEffectPattern = /useEffect\s*\(\s*\(\s*\)\s*=>\s*{([^}]+)}\s*,\s*\[([^\]]*)\]/g;
    let match;
    
    while ((match = useEffectPattern.exec(code)) !== null) {
        const effectBody = match[1];
        const dependencies = match[2];
        
        // Check if dependencies are defined before the useEffect
        if (dependencies) {
            const deps = dependencies.split(',').map(d => d.trim());
            deps.forEach(dep => {
                if (dep && !dep.includes('.')) {
                    // Simple check: is this variable defined before this point?
                    const beforeEffect = code.substring(0, match.index);
                    const varPattern = new RegExp(`(const|let|var|function)\\s+${dep}\\s*[=\\(]`);
                    
                    if (!varPattern.test(beforeEffect)) {
                        errors.push(`'${dep}' used before initialization in useEffect`);
                    }
                }
            });
        }
    }
    
    // Check for duplicate function declarations
    const functionPattern = /(?:const|let|var)\s+(\w+)\s*=/g;
    const declaredFunctions = new Set();
    
    while ((match = functionPattern.exec(code)) !== null) {
        const funcName = match[1];
        if (declaredFunctions.has(funcName)) {
            errors.push(`Duplicate declaration of '${funcName}'`);
        }
        declaredFunctions.add(funcName);
    }
    
    return errors;
}

// Find all component files
function findComponentFiles(dir) {
    const components = [];
    
    const searchDirs = [
        'src/components',
        'src/components/wizard',
        'src/components/forms',
        'src/components/panels',
        'src/components/charts',
        'src/components/shared',
        'src/components/core'
    ];
    
    searchDirs.forEach(searchDir => {
        const fullPath = path.join(dir, searchDir);
        if (fs.existsSync(fullPath)) {
            const files = fs.readdirSync(fullPath);
            files.forEach(file => {
                if (file.endsWith('.js') && !file.includes('.test.')) {
                    components.push(path.join(fullPath, file));
                }
            });
        }
    });
    
    return components;
}

// Main validation function
function runValidation() {
    console.log(`${colors.blue}🧪 Component Validation Tool${colors.reset}`);
    console.log('=====================================\\n');
    
    const projectRoot = path.resolve(__dirname, '..');
    const components = findComponentFiles(projectRoot);
    
    console.log(`Found ${components.length} components to validate\\n`);
    
    // Validate each component
    components.forEach(validateComponent);
    
    // Print summary
    console.log('\\n=====================================');
    console.log(`${colors.blue}📊 Validation Summary:${colors.reset}`);
    console.log(`Total Components: ${totalComponents}`);
    console.log(`${colors.green}✅ Passed: ${passedComponents}${colors.reset}`);
    console.log(`${colors.red}❌ Failed: ${failedComponents}${colors.reset}`);
    console.log(`📈 Success Rate: ${((passedComponents / totalComponents) * 100).toFixed(1)}%`);
    
    if (failedComponents > 0) {
        console.log(`\\n${colors.red}Failed Components:${colors.reset}`);
        errors.forEach(error => {
            console.log(`\\n- ${error.component}`);
            console.log(`  File: ${error.file}`);
            console.log(`  Error: ${error.error}`);
        });
        
        console.log(`\\n${colors.yellow}⚠️  Fix these errors before deployment!${colors.reset}`);
        process.exit(1);
    } else {
        console.log(`\\n${colors.green}✅ All components validated successfully!${colors.reset}`);
        process.exit(0);
    }
}

// Run validation
runValidation();