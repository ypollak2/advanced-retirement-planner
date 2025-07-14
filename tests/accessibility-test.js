#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('♿ Advanced Retirement Planner - Accessibility Test Suite');
console.log('========================================================\n');

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

// Test ARIA attributes and semantic HTML
function testAccessibilityFeatures() {
    console.log('🔍 Testing Accessibility Features...');
    
    try {
        // Check HTML structure
        const htmlContent = fs.readFileSync('index.html', 'utf8');
        
        logTest('Viewport meta tag', htmlContent.includes('viewport'), 
            'Required for mobile accessibility');
        
        logTest('Language attribute', htmlContent.includes('lang='), 
            'Required for screen readers');
        
        logTest('Dir attribute support', htmlContent.includes('dir='), 
            'Required for RTL language support');
        
        // Check for semantic HTML and ARIA
        const hasAriaLabel = htmlContent.includes('aria-label');
        const hasRole = htmlContent.includes('role=');
        const hasSemanticElements = htmlContent.includes('<main>') || htmlContent.includes('role="main"');
        
        logTest('ARIA labels present', hasAriaLabel, 
            'ARIA labels help screen readers understand content');
        
        logTest('Role attributes present', hasRole, 
            'Role attributes provide semantic meaning');
        
        logTest('Main content landmark', hasSemanticElements, 
            'Main content should be identifiable');
        
        // Check component files for accessibility
        const componentFiles = [
            'src/components/RetirementBasicForm.js',
            'src/components/RetirementAdvancedForm.js',
            'src/components/RetirementResultsPanel.js'
        ];
        
        componentFiles.forEach(file => {
            if (fs.existsSync(file)) {
                const content = fs.readFileSync(file, 'utf8');
                const hasLabels = content.includes('aria-label') || content.includes('htmlFor');
                const hasAltText = !content.includes('<img') || content.includes('alt=');
                
                logTest(`Accessibility in ${path.basename(file)}`, hasLabels, 
                    'Form elements should have proper labels');
                
                if (content.includes('<img')) {
                    logTest(`Alt text in ${path.basename(file)}`, hasAltText, 
                        'Images should have alt text');
                }
            }
        });
        
    } catch (error) {
        logTest('Accessibility analysis', false, `Error: ${error.message}`);
    }
}

// Test color contrast and visual accessibility
function testVisualAccessibility() {
    console.log('\n🎨 Testing Visual Accessibility...');
    
    try {
        const cssContent = fs.readFileSync('src/styles/main.css', 'utf8');
        
        // Check for focus indicators
        const hasFocusStyles = cssContent.includes(':focus') || cssContent.includes('focus:');
        logTest('Focus indicators', hasFocusStyles, 
            'Interactive elements should have visible focus indicators');
        
        // Check for high contrast mode support
        const hasHighContrast = cssContent.includes('@media (prefers-contrast: high)') || 
                               cssContent.includes('contrast-');
        logTest('High contrast support', hasHighContrast, 
            'Support for users who prefer high contrast');
        
        // Check for reduced motion support
        const hasReducedMotion = cssContent.includes('@media (prefers-reduced-motion');
        logTest('Reduced motion support', hasReducedMotion, 
            'Respect user preferences for reduced motion');
        
        // Check font size responsiveness
        const hasResponsiveFonts = cssContent.includes('text-') || cssContent.includes('font-size');
        logTest('Responsive font sizes', hasResponsiveFonts, 
            'Text should scale appropriately');
        
    } catch (error) {
        logTest('Visual accessibility analysis', false, `Error: ${error.message}`);
    }
}

// Test keyboard navigation
function testKeyboardAccessibility() {
    console.log('\n⌨️  Testing Keyboard Accessibility...');
    
    try {
        const htmlContent = fs.readFileSync('index.html', 'utf8');
        
        // Check for tab index usage
        const hasTabIndex = htmlContent.includes('tabindex') || htmlContent.includes('tabIndex');
        logTest('Tab index management', !htmlContent.includes('tabindex="-1"') || hasTabIndex, 
            'Interactive elements should be keyboard accessible');
        
        // Check component files for keyboard support
        const componentFiles = [
            'src/components/RetirementBasicForm.js',
            'src/components/RetirementAdvancedForm.js'
        ];
        
        componentFiles.forEach(file => {
            if (fs.existsSync(file)) {
                const content = fs.readFileSync(file, 'utf8');
                const hasKeyHandlers = content.includes('onKeyDown') || content.includes('onKeyPress');
                const hasButtons = content.includes('button') || content.includes('Button');
                
                if (hasButtons) {
                    logTest(`Keyboard support in ${path.basename(file)}`, 
                        hasKeyHandlers || content.includes('onClick'), 
                        'Interactive elements should support keyboard navigation');
                }
            }
        });
        
    } catch (error) {
        logTest('Keyboard accessibility analysis', false, `Error: ${error.message}`);
    }
}

// Run all accessibility tests
testAccessibilityFeatures();
testVisualAccessibility();
testKeyboardAccessibility();

// Final report
console.log('\n📊 Accessibility Test Summary');
console.log('===============================');
console.log(`✅ Tests Passed: ${testsPassed}`);
console.log(`❌ Tests Failed: ${testsFailed}`);
console.log(`📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);

if (testsFailed > 0) {
    console.log('\n⚠️  Accessibility issues found. Please review and fix.');
    console.log('\n💡 Accessibility Guidelines:');
    console.log('   • Ensure all interactive elements are keyboard accessible');
    console.log('   • Provide alternative text for images');
    console.log('   • Use proper heading hierarchy');
    console.log('   • Maintain sufficient color contrast (4.5:1 for normal text)');
    console.log('   • Support screen readers with proper ARIA labels');
    console.log('   • Test with actual assistive technologies');
    process.exit(1);
} else {
    console.log('\n🎉 All accessibility tests passed!');
    process.exit(0);
}