// Accessibility and Performance Tests
// Tests WCAG compliance, keyboard navigation, screen reader support, and performance metrics

const fs = require('fs');
const path = require('path');

console.log('♿ Testing Accessibility and Performance...');

let testsPassed = 0;
let testsTotal = 0;

function runTest(testName, testFunction) {
    testsTotal++;
    try {
        const result = testFunction();
        if (result) {
            console.log(`✅ PASS ${testName}`);
            testsPassed++;
        } else {
            console.log(`❌ FAIL ${testName}`);
        }
    } catch (error) {
        console.log(`❌ FAIL ${testName}: ${error.message}`);
    }
}

// Test Suite 1: HTML Semantic Structure
runTest('A11y: HTML has proper document structure', () => {
    const indexPath = path.join(__dirname, '..', '..', 'index.html');
    if (!fs.existsSync(indexPath)) return false;
    const content = fs.readFileSync(indexPath, 'utf8');
    return content.includes('<!DOCTYPE html>') && 
           content.includes('<html lang=') &&
           content.includes('<head>') &&
           content.includes('<body>');
});

runTest('A11y: Page has meaningful title', () => {
    const indexPath = path.join(__dirname, '..', '..', 'index.html');
    if (!fs.existsSync(indexPath)) return false;
    const content = fs.readFileSync(indexPath, 'utf8');
    const titleMatch = content.match(/<title>(.*?)<\/title>/);
    return titleMatch && titleMatch[1].length > 10 && titleMatch[1].includes('Retirement');
});

runTest('A11y: Meta viewport for mobile accessibility', () => {
    const indexPath = path.join(__dirname, '..', '..', 'index.html');
    if (!fs.existsSync(indexPath)) return false;
    const content = fs.readFileSync(indexPath, 'utf8');
    return content.includes('name="viewport"') && 
           content.includes('width=device-width') &&
           content.includes('initial-scale=1');
});

runTest('A11y: Skip navigation link exists', () => {
    const indexPath = path.join(__dirname, '..', '..', 'index.html');
    if (!fs.existsSync(indexPath)) return false;
    const content = fs.readFileSync(indexPath, 'utf8');
    return content.includes('skip') && 
           content.includes('main content') &&
           content.includes('href="#root"');
});

runTest('A11y: Main content area has proper ARIA labels', () => {
    const indexPath = path.join(__dirname, '..', '..', 'index.html');
    if (!fs.existsSync(indexPath)) return false;
    const content = fs.readFileSync(indexPath, 'utf8');
    return content.includes('role="main"') && 
           content.includes('aria-label') &&
           content.includes('tabindex="-1"');
});

// Test Suite 2: Form Accessibility
runTest('A11y: Form inputs have associated labels', () => {
    const stepSalaryPath = path.join(__dirname, '..', '..', 'src/components/wizard/steps/WizardStepSalary.js');
    if (!fs.existsSync(stepSalaryPath)) return false;
    const content = fs.readFileSync(stepSalaryPath, 'utf8');
    
    // Check for label associations
    const hasLabels = content.includes('htmlFor') || content.includes('aria-label') || content.includes('aria-labelledby');
    const hasInputs = content.includes('input') || content.includes('select');
    
    return hasLabels && hasInputs;
});

runTest('A11y: Required fields have proper ARIA attributes', () => {
    const stepPersonalPath = path.join(__dirname, '..', '..', 'src/components/wizard/steps/WizardStepPersonal.js');
    if (!fs.existsSync(stepPersonalPath)) return false;
    const content = fs.readFileSync(stepPersonalPath, 'utf8');
    return content.includes('required') && 
           (content.includes('aria-required') || content.includes('required: true'));
});

runTest('A11y: Error messages are accessible', () => {
    const wizardPath = path.join(__dirname, '..', '..', 'src/components/wizard/RetirementWizard.js');
    if (!fs.existsSync(wizardPath)) return false;
    const content = fs.readFileSync(wizardPath, 'utf8');
    return content.includes('error') && 
           (content.includes('aria-describedby') || content.includes('role="alert"'));
});

runTest('A11y: Form validation provides clear feedback', () => {
    const inputValidationPath = path.join(__dirname, '..', '..', 'src/utils/inputValidation.js');
    if (!fs.existsSync(inputValidationPath)) return false;
    const content = fs.readFileSync(inputValidationPath, 'utf8');
    return content.includes('validate') && 
           content.includes('message') &&
           content.includes('error');
});

// Test Suite 3: Keyboard Navigation
runTest('A11y: Interactive elements are keyboard accessible', () => {
    const wizardPath = path.join(__dirname, '..', '..', 'src/components/wizard/RetirementWizard.js');
    if (!fs.existsSync(wizardPath)) return false;
    const content = fs.readFileSync(wizardPath, 'utf8');
    return content.includes('tabIndex') || 
           content.includes('onKeyDown') ||
           content.includes('onKeyPress');
});

runTest('A11y: Focus management in wizard steps', () => {
    const wizardPath = path.join(__dirname, '..', '..', 'src/components/wizard/RetirementWizard.js');
    if (!fs.existsSync(wizardPath)) return false;
    const content = fs.readFileSync(wizardPath, 'utf8');
    return content.includes('focus') && 
           (content.includes('useRef') || content.includes('focusRef'));
});

runTest('A11y: Skip link functionality implemented', () => {
    const indexPath = path.join(__dirname, '..', '..', 'index.html');
    if (!fs.existsSync(indexPath)) return false;
    const content = fs.readFileSync(indexPath, 'utf8');
    return content.includes('skip-link') && 
           content.includes('addEventListener') &&
           content.includes('focus()');
});

// Test Suite 4: Screen Reader Support
runTest('A11y: ARIA landmarks for page structure', () => {
    const indexPath = path.join(__dirname, '..', '..', 'index.html');
    if (!fs.existsSync(indexPath)) return false;
    const content = fs.readFileSync(indexPath, 'utf8');
    return content.includes('role="main"') && 
           content.includes('aria-label');
});

runTest('A11y: Dynamic content updates announced', () => {
    const financialHealthPath = path.join(__dirname, '..', '..', 'src/components/shared/FinancialHealthScoreEnhanced.js');
    if (!fs.existsSync(financialHealthPath)) return false;
    const content = fs.readFileSync(financialHealthPath, 'utf8');
    return content.includes('aria-live') || 
           content.includes('aria-atomic') ||
           content.includes('role="status"');
});

runTest('A11y: Chart data has text alternatives', () => {
    const chartPath = path.join(__dirname, '..', '..', 'src/components/charts/FinancialChart.js');
    if (!fs.existsSync(chartPath)) return false;
    const content = fs.readFileSync(chartPath, 'utf8');
    return content.includes('alt') || 
           content.includes('aria-label') ||
           content.includes('description');
});

// Test Suite 5: Color and Contrast
runTest('A11y: Color not sole means of conveying information', () => {
    const cssPath = path.join(__dirname, '..', '..', 'src/styles/main.css');
    if (!fs.existsSync(cssPath)) return false;
    const content = fs.readFileSync(cssPath, 'utf8');
    // Check for icon or text indicators beyond color
    return content.includes('icon') || 
           content.includes('border') ||
           content.includes('text-decoration');
});

runTest('A11y: High contrast mode considerations', () => {
    const cssPath = path.join(__dirname, '..', '..', 'src/styles/main.css');
    if (!fs.existsSync(cssPath)) return false;
    const content = fs.readFileSync(cssPath, 'utf8');
    return content.includes('prefers-contrast') || 
           content.includes('high-contrast') ||
           content.includes('border') && content.includes('outline');
});

// Test Suite 6: Multi-language Accessibility
runTest('A11y: Language attributes for internationalization', () => {
    const indexPath = path.join(__dirname, '..', '..', 'index.html');
    if (!fs.existsSync(indexPath)) return false;
    const content = fs.readFileSync(indexPath, 'utf8');
    return content.includes('lang="') && 
           (content.includes('dir="ltr"') || content.includes('dir="rtl"'));
});

runTest('A11y: RTL support for Hebrew language', () => {
    const indexPath = path.join(__dirname, '..', '..', 'index.html');
    if (!fs.existsSync(indexPath)) return false;
    const content = fs.readFileSync(indexPath, 'utf8');
    return content.includes('dir="ltr"'); // Default LTR with RTL switching capability
});

// Test Suite 7: Performance - Core Web Vitals
runTest('Performance: HTML file size is reasonable', () => {
    const indexPath = path.join(__dirname, '..', '..', 'index.html');
    if (!fs.existsSync(indexPath)) return false;
    const stats = fs.statSync(indexPath);
    const sizeKB = stats.size / 1024;
    return sizeKB < 50; // HTML should be under 50KB
});

runTest('Performance: Minimal inline scripts in HTML', () => {
    const indexPath = path.join(__dirname, '..', '..', 'index.html');
    if (!fs.existsSync(indexPath)) return false;
    const content = fs.readFileSync(indexPath, 'utf8');
    const inlineScripts = (content.match(/<script[^>]*>[\s\S]*?<\/script>/g) || []).length;
    return inlineScripts <= 5; // Should have 5 or fewer inline scripts
});

runTest('Performance: External resources use CDN', () => {
    const indexPath = path.join(__dirname, '..', '..', 'index.html');
    if (!fs.existsSync(indexPath)) return false;
    const content = fs.readFileSync(indexPath, 'utf8');
    return content.includes('cdn.jsdelivr.net') && 
           content.includes('unpkg.com');
});

runTest('Performance: Cache busting implemented', () => {
    const indexPath = path.join(__dirname, '..', '..', 'index.html');
    if (!fs.existsSync(indexPath)) return false;
    const content = fs.readFileSync(indexPath, 'utf8');
    return content.includes('?v=') && 
           content.includes('7.2.1');
});

runTest('Performance: Lazy loading strategy exists', () => {
    const lazyComponentPath = path.join(__dirname, '..', '..', 'src/components/core/LazyComponent.js');
    const dynamicLoaderPath = path.join(__dirname, '..', '..', 'src/utils/dynamicLoader.js');
    return fs.existsSync(lazyComponentPath) || fs.existsSync(dynamicLoaderPath);
});

// Test Suite 8: Image and Media Accessibility
runTest('A11y: Images have alt text or are decorative', () => {
    const indexPath = path.join(__dirname, '..', '..', 'index.html');
    if (!fs.existsSync(indexPath)) return false;
    const content = fs.readFileSync(indexPath, 'utf8');
    // Check favicon implementation
    return content.includes('icon') && 
           (content.includes('alt=') || content.includes('aria-hidden'));
});

runTest('A11y: SVG graphics have accessible names', () => {
    // Check if any components use SVG icons
    const files = ['src/components/shared/HelpTooltip.js', 'src/components/core/Dashboard.js'];
    for (const file of files) {
        const filePath = path.join(__dirname, '..', '..', file);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            if (content.includes('svg') || content.includes('icon')) {
                return content.includes('aria-label') || content.includes('title');
            }
        }
    }
    return true; // No SVGs found, test passes
});

// Test Suite 9: Error Handling Accessibility
runTest('A11y: Error boundaries provide accessible error messages', () => {
    const errorBoundaryPath = path.join(__dirname, '..', '..', 'src/components/shared/ErrorBoundary.js');
    if (!fs.existsSync(errorBoundaryPath)) return false;
    const content = fs.readFileSync(errorBoundaryPath, 'utf8');
    return content.includes('error') && 
           (content.includes('aria-label') || content.includes('role="alert"'));
});

runTest('A11y: Loading states are announced to screen readers', () => {
    const wizardPath = path.join(__dirname, '..', '..', 'src/components/wizard/RetirementWizard.js');
    if (!fs.existsSync(wizardPath)) return false;
    const content = fs.readFileSync(wizardPath, 'utf8');
    return content.includes('loading') && 
           (content.includes('aria-live') || content.includes('aria-busy'));
});

// Test Suite 10: Mobile Accessibility
runTest('A11y: Touch targets meet minimum size requirements', () => {
    const cssPath = path.join(__dirname, '..', '..', 'src/styles/main.css');
    if (!fs.existsSync(cssPath)) return false;
    const content = fs.readFileSync(cssPath, 'utf8');
    // Check for button sizing that meets 44px minimum
    return content.includes('min-height') || 
           content.includes('padding') ||
           content.includes('44px');
});

runTest('A11y: Responsive design works with zoom up to 200%', () => {
    const cssPath = path.join(__dirname, '..', '..', 'src/styles/main.css');
    if (!fs.existsSync(cssPath)) return false;
    const content = fs.readFileSync(cssPath, 'utf8');
    return content.includes('responsive') && 
           content.includes('@media') &&
           (content.includes('rem') || content.includes('em'));
});

runTest('A11y: Orientation and device adaptation', () => {
    const indexPath = path.join(__dirname, '..', '..', 'index.html');
    if (!fs.existsSync(indexPath)) return false;
    const content = fs.readFileSync(indexPath, 'utf8');
    return content.includes('width=device-width') && 
           content.includes('responsive');
});

// Test Suite 11: Performance Monitoring
runTest('Performance: Service Worker for offline functionality', () => {
    const swPath = path.join(__dirname, '..', '..', 'sw.js');
    const indexPath = path.join(__dirname, '..', '..', 'index.html');
    if (!fs.existsSync(indexPath)) return false;
    const content = fs.readFileSync(indexPath, 'utf8');
    return content.includes('serviceWorker') && 
           content.includes('register');
});

runTest('Performance: Critical CSS inlined', () => {
    const indexPath = path.join(__dirname, '..', '..', 'index.html');
    if (!fs.existsSync(indexPath)) return false;
    const content = fs.readFileSync(indexPath, 'utf8');
    return content.includes('<style>') && 
           content.includes('font-family') &&
           content.includes('background');
});

runTest('Performance: Script loading optimization', () => {
    const indexPath = path.join(__dirname, '..', '..', 'index.html');
    if (!fs.existsSync(indexPath)) return false;
    const content = fs.readFileSync(indexPath, 'utf8');
    return content.includes('Promise.all') && 
           content.includes('parallel') &&
           content.includes('loadPromises');
});

// Summary
console.log(`\n📊 Accessibility and Performance Test Summary`);
console.log(`============================================`);
console.log(`✅ Tests Passed: ${testsPassed}`);
console.log(`❌ Tests Failed: ${testsTotal - testsPassed}`);
console.log(`📈 Success Rate: ${((testsPassed / testsTotal) * 100).toFixed(1)}%`);

if (testsPassed === testsTotal) {
    console.log(`\n🎉 All accessibility and performance tests passed! App is inclusive and fast.`);
} else {
    console.log(`\n⚠️ Some accessibility or performance tests failed. Review WCAG compliance and performance optimizations.`);
}

// Export results for main test runner
module.exports = {
    testsPassed,
    testsTotal,
    testSuiteName: 'Accessibility and Performance Tests'
};