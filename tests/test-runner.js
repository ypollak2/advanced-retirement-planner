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
            
            // Check for actual ES6 module syntax (not just string literals)
            if (/^export\s/m.test(content) || /^import\s/m.test(content) || /\bexport\s+default\b/.test(content) || /\bexport\s+\{/.test(content)) {
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
                test: arch.html.includes('Application Loading Error') || fs.existsSync('src/components/RetirementPlannerApp.js') 
            },
            { 
                name: 'Module loading check', 
                test: arch.html.includes('RetirementPlannerApp') && arch.html.includes('createRoot') 
            },
            { 
                name: 'Application initialization', 
                test: arch.html.includes('RetirementPlannerApp') && arch.html.includes('DOMContentLoaded') 
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

// Test 12: GitHub Actions CI/CD Pipeline Validation
function testGitHubActions() {
    console.log('\n⚙️ Testing GitHub Actions CI/CD Pipeline...');
    
    try {
        // Check if version.js exists in correct location for CI/CD
        const versionExists = fs.existsSync('src/version.js');
        logTest('GitHub Actions: version.js exists', versionExists, 
            versionExists ? 'Version file available for CI/CD' : 'Missing src/version.js for CI/CD pipeline');
        
        // Check version.js structure for CI/CD compatibility
        if (versionExists) {
            const versionContent = fs.readFileSync('src/version.js', 'utf8');
            const hasModuleExport = versionContent.includes('module.exports');
            const hasVersionNumber = versionContent.includes('number:');
            
            logTest('GitHub Actions: version.js module export', hasModuleExport,
                hasModuleExport ? 'Module export format compatible with CI/CD' : 'Missing module.exports for CI/CD');
            
            logTest('GitHub Actions: version.js number property', hasVersionNumber,
                hasVersionNumber ? 'Version number property available' : 'Missing version number property');
        }
        
        // Check pre-commit hook configuration
        const preCommitExists = fs.existsSync('scripts/pre-commit-qa.sh');
        logTest('GitHub Actions: pre-commit hook exists', preCommitExists);
        
        if (preCommitExists) {
            const preCommitContent = fs.readFileSync('scripts/pre-commit-qa.sh', 'utf8');
            const hasVersionCheck = preCommitContent.includes('src/version.js');
            logTest('GitHub Actions: pre-commit version check', hasVersionCheck,
                hasVersionCheck ? 'Pre-commit hook checks version.js' : 'Pre-commit hook missing version.js check');
        }
        
        // Check package.json for CI/CD compatibility
        const packageExists = fs.existsSync('package.json');
        if (packageExists) {
            const packageContent = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            const hasEngines = packageContent.engines && packageContent.engines.node;
            const hasTestScript = packageContent.scripts && packageContent.scripts.test;
            
            logTest('GitHub Actions: package.json engines', hasEngines,
                hasEngines ? `Node.js version specified: ${packageContent.engines.node}` : 'Missing Node.js engine specification');
            
            logTest('GitHub Actions: test script configured', hasTestScript,
                hasTestScript ? 'Test script available for CI/CD' : 'Missing test script for CI/CD');
        }
        
        // Check for critical syntax errors that would break CI/CD
        const jsFiles = [
            'src/components/FinancialChart.js',
            'src/components/RetirementPlannerApp.js',
            'src/components/RetirementBasicForm.js',
            'src/components/RetirementAdvancedForm.js',
            'src/components/RetirementResultsPanel.js'
        ];
        
        let syntaxErrorCount = 0;
        jsFiles.forEach(file => {
            if (fs.existsSync(file)) {
                try {
                    // Use Node.js built-in syntax checker
                    require('child_process').execSync(`node -c "${file}"`, { stdio: 'pipe' });
                    logTest(`GitHub Actions: ${file} syntax validation`, true, 
                        'Syntax validation passed');
                } catch (error) {
                    syntaxErrorCount++;
                    logTest(`GitHub Actions: ${file} syntax validation`, false, 
                        `Syntax error detected: ${error.message.split('\n')[0]}`);
                }
            }
        });
        
        logTest('GitHub Actions: overall syntax validation', syntaxErrorCount === 0,
            syntaxErrorCount === 0 ? 'All files syntax-validated for CI/CD' : `${syntaxErrorCount} files have syntax issues`);
        
    } catch (error) {
        logTest('GitHub Actions CI/CD testing', false, `Error: ${error.message}`);
    }
}

// Test 13: CSS Style Consistency Checks
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

// Test 14: Partner Planning Features UI Tests
function testPartnerPlanningFeatures() {
    console.log('\n👫 Testing Partner Planning Features...');
    
    try {
        // Test WizardStepSalary for partner data collection
        if (fs.existsSync('src/components/WizardStepSalary.js')) {
            const salaryContent = fs.readFileSync('src/components/WizardStepSalary.js', 'utf8');
            
            // Check for partner name inputs
            const hasPartnerNames = salaryContent.includes('partner1Name') && salaryContent.includes('partner2Name');
            logTest('WizardStepSalary: Partner name inputs', hasPartnerNames);
            
            // Check for partner salary fields
            const hasPartnerSalaries = salaryContent.includes('partner1Salary') && salaryContent.includes('partner2Salary');
            logTest('WizardStepSalary: Partner salary fields', hasPartnerSalaries);
            
            // Check for bonus and RSU fields
            const hasBonusRSU = salaryContent.includes('annualBonus') && salaryContent.includes('quarterlyRSU');
            logTest('WizardStepSalary: Bonus and RSU fields', hasBonusRSU);
            
            // Check for couple vs individual conditional rendering
            const hasCoupleConditional = salaryContent.includes("planningType === 'couple'");
            logTest('WizardStepSalary: Couple conditional rendering', hasCoupleConditional);
            
        } else {
            logTest('WizardStepSalary file exists', false, 'Missing WizardStepSalary.js');
        }
        
        // Test WizardStepSavings for detailed partner savings breakdown
        if (fs.existsSync('src/components/WizardStepSavings.js')) {
            const savingsContent = fs.readFileSync('src/components/WizardStepSavings.js', 'utf8');
            
            // Check for partner savings categories
            const hasPartnerSavingsBreakdown = savingsContent.includes('partner1CurrentPension') && 
                                             savingsContent.includes('partner2CurrentPension') &&
                                             savingsContent.includes('partner1PersonalPortfolio') &&
                                             savingsContent.includes('partner2PersonalPortfolio');
            logTest('WizardStepSavings: Partner savings breakdown', hasPartnerSavingsBreakdown);
            
            // Check for investment category separation
            const hasInvestmentCategories = savingsContent.includes('realEstateValue') && 
                                          savingsContent.includes('cryptoValue') &&
                                          savingsContent.includes('savingsAccountValue');
            logTest('WizardStepSavings: Investment categories', hasInvestmentCategories);
            
            // Check for total calculation logic
            const hasTotalCalculation = savingsContent.includes('calculateTotalSavings');
            logTest('WizardStepSavings: Total calculation logic', hasTotalCalculation);
            
        } else {
            logTest('WizardStepSavings file exists', false, 'Missing WizardStepSavings.js');
        }
        
        // Test WizardStepContributions for country-specific rules
        if (fs.existsSync('src/components/WizardStepContributions.js')) {
            const contributionsContent = fs.readFileSync('src/components/WizardStepContributions.js', 'utf8');
            
            // Check for training fund threshold logic
            const hasThresholdLogic = contributionsContent.includes('calculateTrainingFundRate') &&
                                    contributionsContent.includes('trainingFundThreshold');
            logTest('WizardStepContributions: Training fund threshold logic', hasThresholdLogic);
            
            // Check for country-specific rates
            const hasCountryRates = contributionsContent.includes('countryRates') &&
                                  contributionsContent.includes('israel') &&
                                  contributionsContent.includes('usa') &&
                                  contributionsContent.includes('uk');
            logTest('WizardStepContributions: Country-specific rates', hasCountryRates);
            
            // Check for employee/employer breakdown
            const hasEmployerEmployeeBreakdown = contributionsContent.includes('employeeContribution') &&
                                               contributionsContent.includes('employerMatching');
            logTest('WizardStepContributions: Employee/employer breakdown', hasEmployerEmployeeBreakdown);
            
            // Check for partner contribution rates
            const hasPartnerContributions = contributionsContent.includes('partner1EmployeeRate') &&
                                          contributionsContent.includes('partner2EmployeeRate');
            logTest('WizardStepContributions: Partner contribution rates', hasPartnerContributions);
            
        } else {
            logTest('WizardStepContributions file exists', false, 'Missing WizardStepContributions.js');
        }
        
        // Test WizardStepFees for per-partner fee structures
        if (fs.existsSync('src/components/WizardStepFees.js')) {
            const feesContent = fs.readFileSync('src/components/WizardStepFees.js', 'utf8');
            
            // Check for partner fee sections
            const hasPartnerFees = feesContent.includes('partner1ContributionFees') &&
                                 feesContent.includes('partner2ContributionFees') &&
                                 feesContent.includes('partner1AccumulationFees') &&
                                 feesContent.includes('partner2AccumulationFees');
            logTest('WizardStepFees: Partner fee structures', hasPartnerFees);
            
            // Check for partner return rates
            const hasPartnerReturns = feesContent.includes('partner1PensionReturn') &&
                                    feesContent.includes('partner2PensionReturn') &&
                                    feesContent.includes('partner1PersonalPortfolioReturn') &&
                                    feesContent.includes('partner2PersonalPortfolioReturn');
            logTest('WizardStepFees: Partner return rates', hasPartnerReturns);
            
            // Check for 4-section layout (main fees, expected returns, partner fees, partner returns)
            const hasFourSections = feesContent.includes('main-fees-section') &&
                                  feesContent.includes('returns-section') &&
                                  feesContent.includes('partner-fees-section') &&
                                  feesContent.includes('partner-returns-section');
            logTest('WizardStepFees: Four-section layout', hasFourSections);
            
        } else {
            logTest('WizardStepFees file exists', false, 'Missing WizardStepFees.js');
        }
        
    } catch (error) {
        logTest('Partner planning features testing', false, `Error: ${error.message}`);
    }
}

// Test 15: Enhanced Calculation Logic Tests
function testEnhancedCalculationLogic() {
    console.log('\n🧮 Testing Enhanced Calculation Logic...');
    
    try {
        // Test SummaryPanel for improved calculations
        if (fs.existsSync('src/components/SummaryPanel.js')) {
            const summaryContent = fs.readFileSync('src/components/SummaryPanel.js', 'utf8');
            
            // Check for comprehensive total income calculation
            const hasTotalIncomeCalculation = summaryContent.includes('totalIncome += (inputs.freelanceIncome') &&
                                            summaryContent.includes('inputs.annualBonus') &&
                                            summaryContent.includes('inputs.quarterlyRSU');
            logTest('SummaryPanel: Comprehensive income calculation', hasTotalIncomeCalculation);
            
            // Check for savings rate calculation with proper field mapping
            const hasSavingsRateLogic = summaryContent.includes('currentSavingsRate') &&
                                      summaryContent.includes('currentContributions / totalIncome');
            logTest('SummaryPanel: Savings rate calculation', hasSavingsRateLogic);
            
            // Check for enhanced readiness score with 5 factors
            const hasEnhancedReadinessScore = summaryContent.includes('Factor 1:') &&
                                            summaryContent.includes('Factor 2:') &&
                                            summaryContent.includes('Factor 3:') &&
                                            summaryContent.includes('Factor 4:') &&
                                            summaryContent.includes('Factor 5:');
            logTest('SummaryPanel: 5-factor readiness score', hasEnhancedReadinessScore);
            
            // Check for real vs nominal value calculations
            const hasRealNominalValues = summaryContent.includes('inflationFactor') &&
                                       summaryContent.includes('totalSavingsReal') &&
                                       summaryContent.includes('monthlyIncomeReal');
            logTest('SummaryPanel: Real vs nominal calculations', hasRealNominalValues);
            
        } else {
            logTest('SummaryPanel file exists', false, 'Missing SummaryPanel.js');
        }
        
        // Test retirementCalculations for monthlyIncome fix
        if (fs.existsSync('src/utils/retirementCalculations.js')) {
            const calcContent = fs.readFileSync('src/utils/retirementCalculations.js', 'utf8');
            
            // Check for monthlyIncome property in return object
            const hasMonthlyIncomeProperty = calcContent.includes('monthlyIncome:') &&
                                           calcContent.includes('totalNetIncome');
            logTest('retirementCalculations: monthlyIncome property fix', hasMonthlyIncomeProperty);
            
            // Check for comprehensive input handling
            const hasComprehensiveInputs = calcContent.includes('currentSalary') ||
                                         calcContent.includes('currentMonthlySalary');
            logTest('retirementCalculations: Input handling', hasComprehensiveInputs);
            
        } else {
            logTest('retirementCalculations file exists', false, 'Missing retirementCalculations.js');
        }
        
    } catch (error) {
        logTest('Enhanced calculation logic testing', false, `Error: ${error.message}`);
    }
}

// Test 16: Multi-Step Wizard UI/UX Tests
function testMultiStepWizardUX() {
    console.log('\n🎯 Testing Multi-Step Wizard UI/UX...');
    
    try {
        // Check main app for wizard integration
        if (fs.existsSync('src/components/RetirementPlannerApp.js')) {
            const appContent = fs.readFileSync('src/components/RetirementPlannerApp.js', 'utf8');
            
            // Check for wizard step components
            const hasWizardSteps = appContent.includes('WizardStepSalary') &&
                                 appContent.includes('WizardStepSavings') &&
                                 appContent.includes('WizardStepContributions') &&
                                 appContent.includes('WizardStepFees');
            logTest('RetirementPlannerApp: Wizard step integration', hasWizardSteps);
            
            // Check for step navigation
            const hasStepNavigation = appContent.includes('currentStep') ||
                                    appContent.includes('nextStep') ||
                                    appContent.includes('step navigation');
            logTest('RetirementPlannerApp: Step navigation', hasStepNavigation);
            
            // Check for input state management
            const hasInputStateManagement = appContent.includes('inputs') && appContent.includes('setInputs');
            logTest('RetirementPlannerApp: Input state management', hasInputStateManagement);
            
        } else {
            logTest('RetirementPlannerApp file exists', false, 'Missing RetirementPlannerApp.js');
        }
        
        // Test for consistent component exports
        const wizardComponents = [
            'src/components/WizardStepSalary.js',
            'src/components/WizardStepSavings.js',
            'src/components/WizardStepContributions.js',
            'src/components/WizardStepFees.js'
        ];
        
        let exportedComponents = 0;
        wizardComponents.forEach(componentFile => {
            if (fs.existsSync(componentFile)) {
                const content = fs.readFileSync(componentFile, 'utf8');
                if (content.includes('window.') && content.includes('= ')) {
                    exportedComponents++;
                }
            }
        });
        
        logTest('Wizard components: Window exports', exportedComponents === wizardComponents.length,
            `${exportedComponents}/${wizardComponents.length} components properly exported`);
        
        // Test for React.createElement usage consistency
        let reactCreateElementUsage = 0;
        wizardComponents.forEach(componentFile => {
            if (fs.existsSync(componentFile)) {
                const content = fs.readFileSync(componentFile, 'utf8');
                // Check for React.createElement presence and proper usage patterns
                const hasReactCreateElement = content.includes('React.createElement');
                const hasProperAssignment = content.includes('const createElement = React.createElement');
                const hasDirectUsage = content.includes('React.createElement(');
                
                // Valid patterns: either direct React.createElement calls OR proper assignment
                if (hasReactCreateElement && (hasProperAssignment || hasDirectUsage)) {
                    reactCreateElementUsage++;
                }
            }
        });
        
        logTest('Wizard components: React.createElement usage', reactCreateElementUsage === wizardComponents.length,
            `${reactCreateElementUsage}/${wizardComponents.length} components use React.createElement correctly`);
        
    } catch (error) {
        logTest('Multi-step wizard UI/UX testing', false, `Error: ${error.message}`);
    }
}

// Test 17: Data Validation and Error Handling
function testDataValidationAndErrorHandling() {
    console.log('\n🛡️ Testing Data Validation and Error Handling...');
    
    try {
        const componentFiles = [
            'src/components/WizardStepSalary.js',
            'src/components/WizardStepSavings.js',
            'src/components/WizardStepContributions.js',
            'src/components/WizardStepFees.js',
            'src/components/SummaryPanel.js'
        ];
        
        let componentsWithValidation = 0;
        let componentsWithErrorHandling = 0;
        
        componentFiles.forEach(file => {
            if (fs.existsSync(file)) {
                const content = fs.readFileSync(file, 'utf8');
                
                // Check for input validation
                const hasValidation = content.includes('parseFloat') || 
                                    content.includes('parseInt') ||
                                    content.includes('|| 0') ||
                                    content.includes('|| \'\'');
                if (hasValidation) componentsWithValidation++;
                
                // Check for error handling
                const hasErrorHandling = content.includes('try') || 
                                       content.includes('catch') ||
                                       content.includes('isNaN') ||
                                       content.includes('isValid');
                if (hasErrorHandling) componentsWithErrorHandling++;
            }
        });
        
        logTest('Components: Input validation', componentsWithValidation >= 4,
            `${componentsWithValidation}/${componentFiles.length} components have input validation`);
        
        logTest('Components: Error handling', componentsWithErrorHandling >= 2,
            `${componentsWithErrorHandling}/${componentFiles.length} components have error handling`);
        
        // Test for consistent default value handling
        if (fs.existsSync('src/components/WizardStepSalary.js')) {
            const salaryContent = fs.readFileSync('src/components/WizardStepSalary.js', 'utf8');
            const hasDefaultValues = salaryContent.includes('|| 0') && salaryContent.includes('value=');
            logTest('WizardStepSalary: Default value handling', hasDefaultValues);
        }
        
        // Test for number input type enforcement
        const wizardFiles = [
            'src/components/WizardStepSalary.js',
            'src/components/WizardStepSavings.js',
            'src/components/WizardStepContributions.js',
            'src/components/WizardStepFees.js'
        ];
        
        let filesWithNumberInputs = 0;
        wizardFiles.forEach(file => {
            if (fs.existsSync(file)) {
                const content = fs.readFileSync(file, 'utf8');
                if (content.includes('type: \'number\'')) {
                    filesWithNumberInputs++;
                }
            }
        });
        
        logTest('Wizard components: Number input types', filesWithNumberInputs === wizardFiles.length,
            `${filesWithNumberInputs}/${wizardFiles.length} components use number inputs`);
        
    } catch (error) {
        logTest('Data validation and error handling testing', false, `Error: ${error.message}`);
    }
}

// Test 20: Advanced Wizard Components Testing Pipeline (v6.3.0)
function testAdvancedWizardComponents() {
    console.log('\n🧙‍♂️ Testing Advanced Wizard Components...');
    
    // Test WizardStepInheritance component
    if (fs.existsSync('src/components/WizardStepInheritance.js')) {
        const inheritanceContent = fs.readFileSync('src/components/WizardStepInheritance.js', 'utf8');
        
        // Test inheritance planning features
        const hasAssetCategories = inheritanceContent.includes('realEstateAssets') &&
                                  inheritanceContent.includes('investmentAssets') &&
                                  inheritanceContent.includes('businessAssets') &&
                                  inheritanceContent.includes('personalAssets');
        logTest('WizardStepInheritance: Asset categorization', hasAssetCategories);
        
        const hasDebtTracking = inheritanceContent.includes('mortgageDebts') &&
                               inheritanceContent.includes('loanDebts') &&
                               inheritanceContent.includes('creditCardDebts');
        logTest('WizardStepInheritance: Debt tracking', hasDebtTracking);
        
        const hasBeneficiaryManagement = inheritanceContent.includes('children') &&
                                        inheritanceContent.includes('spouse') &&
                                        inheritanceContent.includes('parents');
        logTest('WizardStepInheritance: Beneficiary management', hasBeneficiaryManagement);
        
        const hasWillStatus = inheritanceContent.includes('willStatus') &&
                             inheritanceContent.includes('hasWill');
        logTest('WizardStepInheritance: Will status tracking', hasWillStatus);
        
        const hasLifeInsurance = inheritanceContent.includes('lifeInsuranceAmount') &&
                                inheritanceContent.includes('premiumAmount');
        logTest('WizardStepInheritance: Life insurance integration', hasLifeInsurance);
        
        const hasCountrySpecificLaws = inheritanceContent.includes('israel') ||
                                      inheritanceContent.includes('uk') ||
                                      inheritanceContent.includes('us');
        logTest('WizardStepInheritance: Country-specific inheritance laws', hasCountrySpecificLaws);
        
        const hasNetWorthCalculation = inheritanceContent.includes('totalAssets') &&
                                      inheritanceContent.includes('totalDebts') &&
                                      inheritanceContent.includes('netWorth');
        logTest('WizardStepInheritance: Net worth calculation', hasNetWorthCalculation);
        
    } else {
        logTest('WizardStepInheritance: Component exists', false, 'Missing WizardStepInheritance.js');
    }
    
    // Test WizardStepTaxes component
    if (fs.existsSync('src/components/WizardStepTaxes.js')) {
        const taxesContent = fs.readFileSync('src/components/WizardStepTaxes.js', 'utf8');
        
        const hasTaxCountrySelection = taxesContent.includes('taxCountry') &&
                                      taxesContent.includes('israel') &&
                                      taxesContent.includes('uk');
        logTest('WizardStepTaxes: Tax country selection', hasTaxCountrySelection);
        
        const hasTaxRateInputs = taxesContent.includes('currentTaxRate') &&
                                taxesContent.includes('marginalTaxRate') &&
                                taxesContent.includes('effectiveTaxRate');
        logTest('WizardStepTaxes: Tax rate inputs', hasTaxRateInputs);
        
        const hasOptimizedRates = taxesContent.includes('optimizedPensionRate') &&
                                 taxesContent.includes('optimizedTrainingFundRate');
        logTest('WizardStepTaxes: Optimized contribution rates', hasOptimizedRates);
        
        const hasTaxEfficiencyScoring = taxesContent.includes('taxEfficiencyScore') &&
                                       taxesContent.includes('calculateTaxEfficiency');
        logTest('WizardStepTaxes: Tax efficiency scoring', hasTaxEfficiencyScoring);
        
        const hasCountrySpecificTax = taxesContent.includes('israeliTaxRates') ||
                                     taxesContent.includes('ukTaxRates') ||
                                     taxesContent.includes('usTaxRates');
        logTest('WizardStepTaxes: Country-specific tax calculations', hasCountrySpecificTax);
        
        const hasTaxOptimizationLogic = taxesContent.includes('optimizeTax') ||
                                       taxesContent.includes('calculateOptimal');
        logTest('WizardStepTaxes: Tax optimization algorithms', hasTaxOptimizationLogic);
        
    } else {
        logTest('WizardStepTaxes: Component exists', false, 'Missing WizardStepTaxes.js');
    }
    
    // Test WizardStepReview component
    if (fs.existsSync('src/components/WizardStepReview.js')) {
        const reviewContent = fs.readFileSync('src/components/WizardStepReview.js', 'utf8');
        
        const hasFinancialHealthScore = reviewContent.includes('financialHealthScore') &&
                                       reviewContent.includes('calculateHealthScore');
        logTest('WizardStepReview: Financial health scoring', hasFinancialHealthScore);
        
        const hasComprehensiveAnalysis = reviewContent.includes('totalAccumulation') &&
                                        reviewContent.includes('monthlyIncome') &&
                                        reviewContent.includes('readinessScore');
        logTest('WizardStepReview: Comprehensive analysis', hasComprehensiveAnalysis);
        
        const hasActionItems = reviewContent.includes('actionItems') ||
                              reviewContent.includes('recommendations');
        logTest('WizardStepReview: Action items generation', hasActionItems);
        
        const hasDataValidation = reviewContent.includes('validateInputs') ||
                                 reviewContent.includes('checkComplete');
        logTest('WizardStepReview: Data validation', hasDataValidation);
        
        const hasRetirementProjections = reviewContent.includes('retirementAge') &&
                                        reviewContent.includes('projectedIncome');
        logTest('WizardStepReview: Retirement projections', hasRetirementProjections);
        
        const hasRiskAssessment = reviewContent.includes('riskTolerance') &&
                                 reviewContent.includes('riskLevel');
        logTest('WizardStepReview: Risk assessment integration', hasRiskAssessment);
        
    } else {
        logTest('WizardStepReview: Component exists', false, 'Missing WizardStepReview.js');
    }
}

// Test 21: Wizard Integration Pipeline Testing
function testWizardIntegrationPipeline() {
    console.log('\n🔄 Testing Wizard Integration Pipeline...');
    
    // Test RetirementWizard main component
    if (fs.existsSync('src/components/RetirementWizard.js')) {
        const wizardContent = fs.readFileSync('src/components/RetirementWizard.js', 'utf8');
        
        const hasTenStepStructure = wizardContent.includes('totalSteps = 10') ||
                                   wizardContent.includes('totalSteps: 10');
        logTest('RetirementWizard: 10-step structure', hasTenStepStructure);
        
        const hasAdvancedStepRefs = wizardContent.includes('WizardStepInheritance') &&
                                   wizardContent.includes('WizardStepTaxes') &&
                                   wizardContent.includes('WizardStepReview');
        logTest('RetirementWizard: Advanced step references', hasAdvancedStepRefs);
        
        const hasStepValidation = wizardContent.includes('isCurrentStepValid') &&
                                 wizardContent.includes('case 8') &&
                                 wizardContent.includes('case 9') &&
                                 wizardContent.includes('case 10');
        logTest('RetirementWizard: Advanced step validation', hasStepValidation);
        
        const hasStepNavigation = wizardContent.includes('handleNext') &&
                                 wizardContent.includes('handlePrevious') &&
                                 wizardContent.includes('handleSkip');
        logTest('RetirementWizard: Step navigation logic', hasStepNavigation);
        
        const hasProgressTracking = wizardContent.includes('currentStep') &&
                                   wizardContent.includes('completedSteps') &&
                                   wizardContent.includes('skippedSteps');
        logTest('RetirementWizard: Progress tracking', hasProgressTracking);
        
    } else {
        logTest('RetirementWizard: Component exists', false, 'Missing RetirementWizard.js');
    }
    
    // Test data flow integration
    if (fs.existsSync('src/components/RetirementPlannerApp.js')) {
        const appContent = fs.readFileSync('src/components/RetirementPlannerApp.js', 'utf8');
        
        const hasWizardCompletion = appContent.includes('handleWizardComplete') &&
                                   appContent.includes('setWizardCompleted');
        logTest('RetirementPlannerApp: Wizard completion handling', hasWizardCompletion);
        
        const hasDataIntegration = appContent.includes('totalAssets') &&
                                  appContent.includes('totalDebts') &&
                                  appContent.includes('taxOptimization');
        logTest('RetirementPlannerApp: Advanced data integration', hasDataIntegration);
        
        const hasCalculationEnhancement = appContent.includes('nationalInsuranceBenefits') &&
                                         appContent.includes('optimizedPensionRate');
        logTest('RetirementPlannerApp: Enhanced calculations', hasCalculationEnhancement);
        
        const hasExportIntegration = appContent.includes('inheritance') &&
                                    appContent.includes('taxOptimization') &&
                                    appContent.includes('nationalInsurance');
        logTest('RetirementPlannerApp: Export data integration', hasExportIntegration);
        
    }
    
    // Test Dashboard integration
    if (fs.existsSync('src/components/Dashboard.js')) {
        const dashboardContent = fs.readFileSync('src/components/Dashboard.js', 'utf8');
        
        const hasInheritanceSection = dashboardContent.includes('inheritancePlanning') &&
                                     dashboardContent.includes('estateScore');
        logTest('Dashboard: Inheritance planning section', hasInheritanceSection);
        
        const hasTaxOptimizationSection = dashboardContent.includes('taxOptimization') &&
                                         dashboardContent.includes('taxScore');
        logTest('Dashboard: Tax optimization section', hasTaxOptimizationSection);
        
        const hasNationalInsuranceSection = dashboardContent.includes('nationalInsurance') &&
                                           dashboardContent.includes('niScore');
        logTest('Dashboard: National insurance section', hasNationalInsuranceSection);
        
        const hasEnhancedHealthScore = dashboardContent.includes('estateScore') &&
                                      dashboardContent.includes('taxScore') &&
                                      dashboardContent.includes('niScore');
        logTest('Dashboard: Enhanced financial health score', hasEnhancedHealthScore);
        
    }
    
    // Test HTML component loading
    if (fs.existsSync('index.html')) {
        const htmlContent = fs.readFileSync('index.html', 'utf8');
        
        const hasAdvancedComponentScripts = htmlContent.includes('WizardStepInheritance.js') &&
                                           htmlContent.includes('WizardStepTaxes.js') &&
                                           htmlContent.includes('WizardStepReview.js');
        logTest('index.html: Advanced wizard component scripts', hasAdvancedComponentScripts);
        
        const hasCorrectLoadOrder = htmlContent.indexOf('WizardStepInheritance.js') < 
                                   htmlContent.indexOf('WizardStepReview.js');
        logTest('index.html: Correct component load order', hasCorrectLoadOrder);
        
    }
}

// Test 22: Wizard Save/Resume Functionality Testing
function testWizardSaveResumeFunctionality() {
    console.log('\n💾 Testing Wizard Save/Resume Functionality...');
    
    if (fs.existsSync('src/components/RetirementWizard.js')) {
        const wizardContent = fs.readFileSync('src/components/RetirementWizard.js', 'utf8');
        
        const hasLocalStorageKeys = wizardContent.includes('WIZARD_STORAGE_KEY') &&
                                   wizardContent.includes('WIZARD_INPUTS_KEY');
        logTest('RetirementWizard: LocalStorage key definitions', hasLocalStorageKeys);
        
        const hasAutoSaveLogic = wizardContent.includes('React.useEffect') &&
                                wizardContent.includes('localStorage.setItem') &&
                                wizardContent.includes('saveProgress');
        logTest('RetirementWizard: Auto-save functionality', hasAutoSaveLogic);
        
        const hasProgressLoading = wizardContent.includes('loadSavedProgress') &&
                                  wizardContent.includes('localStorage.getItem');
        logTest('RetirementWizard: Progress loading', hasProgressLoading);
        
        const hasSaveStatusIndicator = wizardContent.includes('showSaveNotification') &&
                                      wizardContent.includes('lastSaved');
        logTest('RetirementWizard: Save status indicator', hasSaveStatusIndicator);
        
        const hasClearProgressOption = wizardContent.includes('clearSavedProgress') &&
                                      wizardContent.includes('localStorage.removeItem');
        logTest('RetirementWizard: Clear progress functionality', hasClearProgressOption);
        
        const hasProgressValidation = wizardContent.includes('savedProgress') &&
                                     wizardContent.includes('currentStep');
        logTest('RetirementWizard: Progress validation', hasProgressValidation);
        
        const hasMultiLanguageSupport = wizardContent.includes('saveStatus') &&
                                       wizardContent.includes('clearProgress') &&
                                       wizardContent.includes('language === \'he\'');
        logTest('RetirementWizard: Multi-language save/resume', hasMultiLanguageSupport);
        
    }
    
    if (fs.existsSync('src/components/RetirementPlannerApp.js')) {
        const appContent = fs.readFileSync('src/components/RetirementPlannerApp.js', 'utf8');
        
        const hasResumeDetection = appContent.includes('localStorage.getItem') &&
                                  appContent.includes('retirementWizardProgress');
        logTest('RetirementPlannerApp: Resume detection', hasResumeDetection);
        
        const hasResumeOptions = appContent.includes('resume-wizard-btn') &&
                                appContent.includes('start-fresh-btn');
        logTest('RetirementPlannerApp: Resume/start fresh options', hasResumeOptions);
        
        const hasProgressConfirmation = appContent.includes('window.confirm') &&
                                       appContent.includes('start fresh');
        logTest('RetirementPlannerApp: Progress confirmation dialogs', hasProgressConfirmation);
        
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
    testGitHubActions();
    testCSSStyleConsistency();
    
    // Partner Planning Feature Tests (v6.0.0)
    testPartnerPlanningFeatures();
    testEnhancedCalculationLogic();
    testMultiStepWizardUX();
    testDataValidationAndErrorHandling();
    
    // Advanced Wizard Components Testing Pipeline (v6.3.0)
    testAdvancedWizardComponents();
    testWizardIntegrationPipeline();
    testWizardSaveResumeFunctionality();
    
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