#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('🧪 Advanced Retirement Planner Test Suite');
console.log('==========================================\n');

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

// Test 1: File Structure
function testFileStructure() {
    console.log('\n📁 Testing File Structure...');
    
    const requiredFiles = [
        'index.html',
        'version.json',
        'update-version.js',
        'src/translations/multiLanguage.js',
        'src/data/marketConstants.js',
        'src/utils/retirementCalculations.js',
        'src/components/RetirementPlannerApp.js',
        'src/components/RetirementBasicForm.js',
        'src/components/RetirementAdvancedForm.js',
        'src/components/RetirementResultsPanel.js'
    ];
    
    requiredFiles.forEach(file => {
        const exists = fs.existsSync(file);
        logTest(`File exists: ${file}`, exists, 
            exists ? '' : `Missing required file: ${file}`);
    });
}

// Test 2: JavaScript Syntax
function testJavaScriptSyntax() {
    console.log('\n🔍 Testing JavaScript Syntax...');
    
    const jsFiles = [
        'src/utils/retirementCalculations.js',
        'src/components/RetirementPlannerApp.js',
        'src/components/RetirementBasicForm.js',
        'src/components/RetirementAdvancedForm.js',
        'src/components/RetirementResultsPanel.js'
    ];
    
    jsFiles.forEach(file => {
        if (!fs.existsSync(file)) {
            logTest(`Syntax check: ${file}`, false, 'File does not exist');
            return;
        }
        
        try {
            const content = fs.readFileSync(file, 'utf8');
            
            // Check for problematic patterns
            const issues = [];
            
            if (content.includes('export ') || content.includes('import ')) {
                issues.push('Contains ES6 module syntax (incompatible with script tags)');
            }
            
            if (content.includes('const { useState') || content.includes('const { createElement')) {
                issues.push('Contains destructuring assignments that cause redeclaration errors');
            }
            
            if (content.includes('useState(') && !content.includes('React.useState(')) {
                issues.push('Uses raw useState instead of React.useState');
            }
            
            if (content.includes('createElement(') && !content.includes('React.createElement(')) {
                issues.push('Uses raw createElement instead of React.createElement');
            }
            
            const passed = issues.length === 0;
            logTest(`Syntax check: ${file}`, passed, 
                passed ? 'No syntax issues found' : `Issues: ${issues.join('; ')}`);
                
        } catch (error) {
            logTest(`Syntax check: ${file}`, false, `Error reading file: ${error.message}`);
        }
    });
}

// Test 3: Version Management
function testVersionManagement() {
    console.log('\n🔄 Testing Version Management...');
    
    try {
        // Test version.json
        const versionData = JSON.parse(fs.readFileSync('version.json', 'utf8'));
        const hasVersion = versionData.version && typeof versionData.version === 'string';
        logTest('version.json format', hasVersion, 
            hasVersion ? `Current version: ${versionData.version}` : 'Invalid version format');
        
        // Test update script
        const updateScriptExists = fs.existsSync('update-version.js');
        logTest('update-version.js exists', updateScriptExists);
        
        if (updateScriptExists) {
            const updateScript = fs.readFileSync('update-version.js', 'utf8');
            const hasVersionLogic = updateScript.includes('version.json') && updateScript.includes('README.md');
            logTest('update-version.js functionality', hasVersionLogic,
                hasVersionLogic ? 'Script contains version update logic' : 'Missing version update logic');
        }
        
    } catch (error) {
        logTest('Version management', false, `Error: ${error.message}`);
    }
}

// Dynamic Architecture Discovery
function discoverArchitecture() {
    const entryPointCandidates = ['index.html', 'index-modular.html', 'main.html', 'app.html'];
    const entryPoint = entryPointCandidates.find(file => fs.existsSync(file)) || 'index.html';
    
    let architectureType = 'unknown';
    let html = '';
    
    try {
        html = fs.readFileSync(entryPoint, 'utf8');
        
        // Detect architecture type
        if (html.includes('src/core/') || html.includes('loadScript') || html.includes('dynamic-loader')) {
            architectureType = 'modular';
        } else if (html.includes('src/components/')) {
            architectureType = 'component-based';
        } else if (html.length > 100000) {
            architectureType = 'monolithic';
        } else {
            architectureType = 'simple';
        }
        
    } catch (error) {
        console.warn(`Warning: Could not read ${entryPoint}: ${error.message}`);
    }
    
    return {
        entryPoint,
        architectureType,
        html,
        hasModules: html.includes('src/modules/') || html.includes('loadModule'),
        hasErrorBoundary: html.includes('ErrorBoundary'),
        hasDynamicLoading: html.includes('loadScript') || html.includes('import(')
    };
}

// Test 4: HTML Structure - Dynamic and Architecture-Aware
function testHtmlStructure() {
    console.log('\n🌐 Testing HTML Structure...');
    
    try {
        const arch = discoverArchitecture();
        console.log(`   📍 Entry point: ${arch.entryPoint}`);
        console.log(`   🏗️  Architecture: ${arch.architectureType}`);
        
        if (!arch.html) {
            logTest('HTML structure', false, `Could not read entry point: ${arch.entryPoint}`);
            return;
        }
        
        // Dynamic checks based on discovered architecture
        const checks = [
            { 
                name: 'React CDN', 
                test: arch.html.includes('react.production.min.js') || arch.html.includes('react.development.js') 
            },
            { 
                name: 'ReactDOM CDN', 
                test: arch.html.includes('react-dom.production.min.js') || arch.html.includes('react-dom.development.js') 
            },
            { 
                name: 'Script tags for components', 
                test: arch.html.includes('src/core/') || arch.html.includes('src/modules/') || arch.html.includes('src/components/') 
            },
            { 
                name: 'Cache busting parameters', 
                test: arch.html.includes('?v=') 
            },
            { 
                name: 'Error boundary', 
                test: fs.existsSync('src/app.js') && fs.readFileSync('src/app.js', 'utf8').includes('ErrorBoundary') 
            },
            { 
                name: 'Module loading check', 
                test: arch.html.includes('src/app.js') && arch.html.includes('initializeApp') 
            },
            { 
                name: 'Application initialization', 
                test: fs.existsSync('src/app.js') && fs.readFileSync('src/app.js', 'utf8').includes('window.initializeApp') 
            }
        ];
        
        // Additional checks for modular architecture
        if (arch.architectureType === 'modular') {
            checks.push({
                name: 'Dynamic loading system',
                test: fs.existsSync('src/core/dynamic-loader.js') && fs.readFileSync('src/core/dynamic-loader.js', 'utf8').includes('window.DynamicModuleLoader')
            });
        }
        
        checks.forEach(check => {
            logTest(`HTML: ${check.name}`, check.test);
        });
        
        // Architecture-specific feedback
        if (arch.architectureType === 'modular') {
            console.log('   ✨ Modular architecture detected - advanced features available');
        }
        
    } catch (error) {
        logTest('HTML structure', false, `Error during architecture discovery: ${error.message}`);
    }
}

// Test 5: Module Exports
function testModuleExports() {
    console.log('\n📦 Testing Module Exports...');
    
    const moduleFiles = [
        { file: 'src/components/RetirementPlannerApp.js', exports: ['RetirementPlannerApp'] },
        { file: 'src/components/RetirementBasicForm.js', exports: ['BasicInputs'] },
        { file: 'src/components/RetirementAdvancedForm.js', exports: ['AdvancedInputs'] },
        { file: 'src/components/RetirementResultsPanel.js', exports: ['ResultsPanel'] },
        { file: 'src/utils/retirementCalculations.js', exports: ['calculateRetirement', 'formatCurrency'] },
        { file: 'src/translations/multiLanguage.js', exports: ['multiLanguage'] },
        { file: 'src/data/marketConstants.js', exports: ['countryData'] }
    ];
    
    moduleFiles.forEach(({ file, exports }) => {
        if (!fs.existsSync(file)) {
            logTest(`Module exports: ${file}`, false, 'File does not exist');
            return;
        }
        
        try {
            const content = fs.readFileSync(file, 'utf8');
            
            exports.forEach(exportName => {
                const hasExport = content.includes(`window.${exportName}`) || content.includes(`window['${exportName}']`);
                logTest(`Export: ${exportName} in ${file}`, hasExport,
                    hasExport ? '' : `Missing window.${exportName} export`);
            });
            
        } catch (error) {
            logTest(`Module exports: ${file}`, false, `Error: ${error.message}`);
        }
    });
}

// Test 6: Performance Checks
function testPerformance() {
    console.log('\n⚡ Testing Performance...');
    
    try {
        const html = fs.readFileSync('index.html', 'utf8');
        const htmlSize = Buffer.byteLength(html, 'utf8');
        
        logTest('HTML size reasonable', htmlSize < 100000, 
            `HTML size: ${(htmlSize / 1024).toFixed(1)}KB ${htmlSize >= 100000 ? '(too large!)' : '(good)'}`);
        
        // Check for performance optimizations
        const optimizations = [
            { name: 'CDN usage', test: html.includes('cdn.jsdelivr.net') || html.includes('unpkg.com') },
            { name: 'Cache busting', test: html.includes('?v=') },
            { name: 'Minimal inline scripts', test: (html.match(/<script>/g) || []).length < 5 }
        ];
        
        optimizations.forEach(opt => {
            logTest(`Performance: ${opt.name}`, opt.test);
        });
        
    } catch (error) {
        logTest('Performance checks', false, `Error: ${error.message}`);
    }
}

// Test 7: Security Checks
function testSecurity() {
    console.log('\n🔒 Testing Security...');
    
    try {
        const html = fs.readFileSync('index.html', 'utf8');
        
        const securityChecks = [
            { 
                name: 'No inline event handlers', 
                test: !html.includes('onclick=') && !html.includes('onload='),
                message: 'Inline event handlers can be security risks'
            },
            { 
                name: 'No external scripts from untrusted domains', 
                test: !html.includes('src="http://'),
                message: 'All external scripts should use HTTPS'
            },
            { 
                name: 'CSP considerations', 
                test: html.includes('Content-Security-Policy') || !html.includes('eval' + '('),
                message: 'No obvious CSP violations found'
            }
        ];
        
        securityChecks.forEach(check => {
            logTest(`Security: ${check.name}`, check.test, check.message);
        });
        
    } catch (error) {
        logTest('Security checks', false, `Error: ${error.message}`);
    }
}

// Test 8: Version 5.0.0 Upgrade Verification
function testVersion5Upgrade() {
    console.log('\n🚀 Testing Version 5.0.0 Upgrade...');
    
    try {
        // Check version.json for version information
        const versionData = JSON.parse(fs.readFileSync('version.json', 'utf8'));
        const isVersion5Plus = parseFloat(versionData.version) >= 5.0;
        logTest('Version 5.0.0+ detected', isVersion5Plus, 
            `Current version: ${versionData.version}`);
        
        // Check HTML title for current version reference
        if (fs.existsSync('index.html')) {
            const html = fs.readFileSync('index.html', 'utf8');
            const currentVersion = versionData.version;
            const titleHasVersion = html.includes(`v${currentVersion}`) || html.includes(currentVersion);
            logTest(`HTML title includes v${currentVersion}`, titleHasVersion);
            
            // Verify version indicator display
            const hasVersionIndicator = html.includes('version-indicator') && html.includes(`v${currentVersion}`);
            logTest(`Version indicator displays v${currentVersion}`, hasVersionIndicator);
        }
        
    } catch (error) {
        logTest('Version 5.0.0 upgrade verification', false, `Error: ${error.message}`);
    }
}

// Test 9: generateChartData Partner Data Logic Testing
function testGenerateChartDataPartnerLogic() {
    console.log('\n👫 Testing generateChartData Partner Data Logic...');
    
    const chartRelatedFiles = [
        'src/components/FinancialChart.js',
        'src/components/RetirementResultsPanel.js',
        'src/utils/retirementCalculations.js'
    ];
    
    chartRelatedFiles.forEach(file => {
        if (!fs.existsSync(file)) {
            logTest(`Partner data logic: ${file}`, false, 'File does not exist');
            return;
        }
        
        try {
            const content = fs.readFileSync(file, 'utf8');
            
            // Check for partner/couple data handling
            const hasPartnerLogic = content.includes('partner') || content.includes('couple') || content.includes('spouse');
            logTest(`Partner data references in ${path.basename(file)}`, hasPartnerLogic);
            
            // Check for chart data generation functions
            const hasChartDataGeneration = content.includes('generateChartData') || 
                                         content.includes('chartData') || 
                                         content.includes('Chart.js');
            logTest(`Chart data generation in ${path.basename(file)}`, hasChartDataGeneration);
            
            // Check for data validation/sanitization
            const hasDataValidation = content.includes('validate') || 
                                    content.includes('sanitize') || 
                                    content.includes('isValid') ||
                                    content.includes('typeof') ||
                                    content.includes('Number(');
            logTest(`Data validation in ${path.basename(file)}`, hasDataValidation);
            
            // Check for error handling in data processing
            const hasErrorHandling = content.includes('try') || 
                                   content.includes('catch') || 
                                   content.includes('error');
            logTest(`Error handling in ${path.basename(file)}`, hasErrorHandling);
            
        } catch (error) {
            logTest(`Partner data logic: ${file}`, false, `Error: ${error.message}`);
        }
    });
}

// Test 10: Bottom Line Title Truncation Fix Verification
function testBottomLineTitleTruncation() {
    console.log('\n✂️ Testing Bottom Line Title Truncation Fix...');
    
    try {
        // Check CSS files for truncation styles
        const cssFiles = ['src/styles/main.css'];
        
        cssFiles.forEach(cssFile => {
            if (!fs.existsSync(cssFile)) {
                logTest(`CSS truncation styles: ${cssFile}`, false, 'CSS file does not exist');
                return;
            }
            
            const cssContent = fs.readFileSync(cssFile, 'utf8');
            
            // Check for text truncation CSS properties
            const hasTruncationStyles = cssContent.includes('text-overflow') || 
                                      cssContent.includes('overflow: hidden') || 
                                      cssContent.includes('white-space: nowrap') ||
                                      cssContent.includes('truncate');
            logTest('CSS text truncation styles', hasTruncationStyles);
            
            // Check for ellipsis handling
            const hasEllipsis = cssContent.includes('ellipsis');
            logTest('CSS ellipsis for truncation', hasEllipsis);
            
            // Check for responsive text sizing
            const hasResponsiveText = cssContent.includes('@media') && 
                                    (cssContent.includes('font-size') || cssContent.includes('text'));
            logTest('Responsive text sizing', hasResponsiveText);
        });
        
        // Check component files for title handling
        const componentFiles = [
            'src/components/RetirementResultsPanel.js',
            'src/components/RetirementPlannerApp.js'
        ];
        
        componentFiles.forEach(file => {
            if (!fs.existsSync(file)) return;
            
            const content = fs.readFileSync(file, 'utf8');
            
            // Check for title truncation logic
            const hasTitleHandling = content.includes('title') && 
                                   (content.includes('substring') || 
                                    content.includes('slice') || 
                                    content.includes('truncate') ||
                                    content.includes('length'));
            logTest(`Title truncation logic in ${path.basename(file)}`, hasTitleHandling);
        });
        
    } catch (error) {
        logTest('Bottom line title truncation', false, `Error: ${error.message}`);
    }
}

// Test 11: Layout Responsiveness Tests
function testLayoutResponsiveness() {
    console.log('\n📱 Testing Layout Responsiveness...');
    
    try {
        // Check HTML for viewport meta tag
        if (fs.existsSync('index.html')) {
            const html = fs.readFileSync('index.html', 'utf8');
            
            const hasViewportMeta = html.includes('name="viewport"') && 
                                  html.includes('width=device-width') && 
                                  html.includes('initial-scale=1.0');
            logTest('Viewport meta tag configured', hasViewportMeta);
            
            // Check for responsive CSS framework (Tailwind)
            const hasTailwind = html.includes('tailwindcss');
            logTest('Tailwind CSS responsive framework', hasTailwind);
        }
        
        // Check CSS for responsive design patterns
        if (fs.existsSync('src/styles/main.css')) {
            const css = fs.readFileSync('src/styles/main.css', 'utf8');
            
            // Check for media queries
            const hasMediaQueries = css.includes('@media');
            logTest('CSS media queries present', hasMediaQueries);
            
            // Check for flexbox/grid layouts
            const hasModernLayout = css.includes('flex') || css.includes('grid');
            logTest('Modern layout systems (flex/grid)', hasModernLayout);
            
            // Check for responsive units
            const hasResponsiveUnits = css.includes('rem') || css.includes('em') || css.includes('vh') || css.includes('vw');
            logTest('Responsive CSS units', hasResponsiveUnits);
            
            // Check for mobile-first design indicators
            const hasMobileFirst = css.includes('min-width') || css.includes('mobile');
            logTest('Mobile-first design patterns', hasMobileFirst);
        }
        
        // Check component files for responsive handling
        const componentFiles = [
            'src/components/RetirementPlannerApp.js',
            'src/components/RetirementBasicForm.js',
            'src/components/RetirementAdvancedForm.js',
            'src/components/RetirementResultsPanel.js'
        ];
        
        let responsiveComponentCount = 0;
        componentFiles.forEach(file => {
            if (!fs.existsSync(file)) return;
            
            const content = fs.readFileSync(file, 'utf8');
            
            // Check for responsive class usage
            const hasResponsiveClasses = content.includes('sm:') || 
                                       content.includes('md:') || 
                                       content.includes('lg:') || 
                                       content.includes('xl:') ||
                                       content.includes('responsive');
            if (hasResponsiveClasses) responsiveComponentCount++;
        });
        
        logTest('Components use responsive classes', responsiveComponentCount > 0, 
            `${responsiveComponentCount}/${componentFiles.length} components have responsive features`);
        
    } catch (error) {
        logTest('Layout responsiveness', false, `Error: ${error.message}`);
    }
}

// Test 12: CSS Style Consistency Checks
function testCSSStyleConsistency() {
    console.log('\n🎨 Testing CSS Style Consistency...');
    
    try {
        if (!fs.existsSync('src/styles/main.css')) {
            logTest('CSS style consistency', false, 'Main CSS file not found');
            return;
        }
        
        const css = fs.readFileSync('src/styles/main.css', 'utf8');
        
        // Check for consistent color scheme
        const colorPatterns = [
            /#[0-9a-fA-F]{6}/g,  // Hex colors
            /#[0-9a-fA-F]{3}/g,   // Short hex colors
            /rgb\([^)]+\)/g,      // RGB colors
            /rgba\([^)]+\)/g      // RGBA colors
        ];
        
        let totalColors = 0;
        colorPatterns.forEach(pattern => {
            const matches = css.match(pattern);
            if (matches) totalColors += matches.length;
        });
        
        logTest('Color usage defined', totalColors > 0, `${totalColors} color definitions found`);
        
        // Check for consistent spacing/padding patterns
        const spacingPatterns = css.match(/padding|margin/g);
        const hasConsistentSpacing = spacingPatterns && spacingPatterns.length > 5;
        logTest('Consistent spacing patterns', hasConsistentSpacing);
        
        // Check for design system indicators
        const designSystemIndicators = [
            'linear-gradient',  // Consistent gradients
            'border-radius',    // Consistent border radius
            'box-shadow',       // Consistent shadows
            'transition'        // Consistent animations
        ];
        
        let designSystemScore = 0;
        designSystemIndicators.forEach(indicator => {
            if (css.includes(indicator)) designSystemScore++;
        });
        
        logTest('Design system consistency', designSystemScore >= 3, 
            `${designSystemScore}/4 design system elements present`);
        
        // Check for CSS organization
        const hasComments = css.includes('/*') && css.includes('*/');
        logTest('CSS documentation/comments', hasComments);
        
        // Check for consistent naming conventions
        const classNames = css.match(/\.[a-zA-Z][a-zA-Z0-9-_]*/g) || [];
        const hasKebabCase = classNames.some(name => name.includes('-'));
        const hasCamelCase = classNames.some(name => /[a-z][A-Z]/.test(name));
        
        // Prefer one naming convention
        const namingConsistency = (hasKebabCase && !hasCamelCase) || (!hasKebabCase && hasCamelCase);
        logTest('CSS naming convention consistency', namingConsistency, 
            hasKebabCase ? 'Using kebab-case' : hasCamelCase ? 'Using camelCase' : 'Mixed naming detected');
        
        // Check for vendor prefixes where needed
        const hasVendorPrefixes = css.includes('-webkit-') || css.includes('-moz-') || css.includes('-ms-');
        logTest('Vendor prefixes for compatibility', hasVendorPrefixes);
        
        // Check for CSS custom properties (variables)
        const hasCustomProperties = css.includes('--') && css.includes('var(');
        logTest('CSS custom properties usage', hasCustomProperties);
        
    } catch (error) {
        logTest('CSS style consistency', false, `Error: ${error.message}`);
    }
}

// Main test execution
async function runAllTests() {
    console.log('Starting automated test suite...\n');
    
    // Original tests
    testFileStructure();
    testJavaScriptSyntax();
    testVersionManagement();
    testHtmlStructure();
    testModuleExports();
    testPerformance();
    testSecurity();
    
    // New UI/UX tests
    testVersion5Upgrade();
    testGenerateChartDataPartnerLogic();
    testBottomLineTitleTruncation();
    testLayoutResponsiveness();
    testCSSStyleConsistency();
    
    // Summary
    console.log('\n📊 Test Summary');
    console.log('================');
    console.log(`✅ Tests Passed: ${testsPassed}`);
    console.log(`❌ Tests Failed: ${testsFailed}`);
    console.log(`📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
    
    if (testsFailed === 0) {
        console.log('\n🎉 All tests passed! App is ready for deployment.');
        process.exit(0);
    } else {
        console.log('\n⚠️  Some tests failed. Please fix issues before deployment.');
        console.log('\n💡 Quick fixes:');
        console.log('   • Run: npm run test:local  (for visual testing)');
        console.log('   • Check: window exports in all component files');
        console.log('   • Verify: React.useState instead of useState');
        console.log('   • Ensure: No ES6 import/export statements');
        console.log('   • Review: UI/UX consistency and responsiveness');
        console.log('   • Validate: Version 5.0.0 upgrade requirements');
        process.exit(1);
    }
}

// Run tests
runAllTests().catch(error => {
    console.error('\n💥 Test runner crashed:', error.message);
    process.exit(1);
});