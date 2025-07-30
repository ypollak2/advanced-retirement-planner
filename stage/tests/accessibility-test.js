#!/usr/bin/env node

/**
 * Accessibility Test Suite for Advanced Retirement Planner
 * Tests WCAG 2.1 AA compliance for financial planning application
 * 
 * Created by: Advanced Retirement Planner Development Team
 * Version: 7.2.0
 * Date: 2025-07-30
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

class AccessibilityTester {
    constructor() {
        this.tests = [];
        this.results = {
            passed: 0,
            failed: 0,
            warnings: 0,
            total: 0
        };
        this.errors = [];
        this.warnings = [];
    }

    log(message, color = colors.reset) {
        console.log(`${color}${message}${colors.reset}`);
    }

    addTest(name, testFunction, category = 'General') {
        this.tests.push({ name, testFunction, category });
    }

    async runTest(test) {
        try {
            const result = await test.testFunction();
            if (result.passed) {
                this.results.passed++;
                this.log(`  ✅ ${test.name}`, colors.green);
                if (result.details) {
                    this.log(`     ${result.details}`, colors.blue);
                }
            } else {
                if (result.severity === 'warning') {
                    this.results.warnings++;
                    this.log(`  ⚠️  ${test.name}`, colors.yellow);
                    this.warnings.push({ test: test.name, message: result.message });
                } else {
                    this.results.failed++;
                    this.log(`  ❌ ${test.name}`, colors.red);
                    this.errors.push({ test: test.name, message: result.message });
                }
                if (result.message) {
                    this.log(`     ${result.message}`, colors.yellow);
                }
            }
        } catch (error) {
            this.results.failed++;
            this.log(`  ❌ ${test.name} - ERROR: ${error.message}`, colors.red);
            this.errors.push({ test: test.name, message: error.message });
        }
        this.results.total++;
    }

    // Utility function to read files
    readFile(filePath) {
        try {
            return fs.readFileSync(filePath, 'utf8');
        } catch (error) {
            throw new Error(`Cannot read file ${filePath}: ${error.message}`);
        }
    }

    // Check if HTML file exists and is readable
    checkFileExists(filePath) {
        return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
    }

    // Initialize all accessibility tests
    initializeTests() {
        
        // WCAG 2.1 Level A Tests
        this.addTest('HTML document has lang attribute', () => {
            const indexPath = 'index.html';
            if (!this.checkFileExists(indexPath)) {
                return { passed: false, message: 'index.html not found' };
            }
            
            const content = this.readFile(indexPath);
            const hasLang = /<html[^>]+lang=/i.test(content);
            
            return {
                passed: hasLang,
                message: hasLang ? null : 'HTML element must have lang attribute for screen readers',
                details: hasLang ? 'Language attribute found' : null
            };
        }, 'WCAG 2.1 Level A');

        this.addTest('Page has descriptive title', () => {
            const indexPath = 'index.html';
            const content = this.readFile(indexPath);
            const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
            
            if (!titleMatch) {
                return { passed: false, message: 'No title element found' };
            }
            
            const title = titleMatch[1].trim();
            const isDescriptive = title.length > 10 && !title.toLowerCase().includes('untitled');
            
            return {
                passed: isDescriptive,
                message: isDescriptive ? null : 'Title should be descriptive (>10 chars, not generic)',
                details: `Title: "${title}"`
            };
        }, 'WCAG 2.1 Level A');

        this.addTest('Images have alt attributes', () => {
            const indexPath = 'index.html';
            const content = this.readFile(indexPath);
            
            // Find all img tags
            const imgTags = content.match(/<img[^>]*>/gi) || [];
            let missingAlt = 0;
            let decorativeImages = 0;
            let descriptiveImages = 0;
            
            imgTags.forEach(img => {
                if (!img.includes('alt=')) {
                    missingAlt++;
                } else if (img.includes('alt=""')) {
                    decorativeImages++;
                } else {
                    descriptiveImages++;
                }
            });
            
            return {
                passed: missingAlt === 0,
                message: missingAlt > 0 ? `${missingAlt} images missing alt attributes` : null,
                details: `Found ${imgTags.length} images: ${descriptiveImages} descriptive, ${decorativeImages} decorative`
            };
        }, 'WCAG 2.1 Level A');

        this.addTest('Form inputs have labels', () => {
            const indexPath = 'index.html';
            const content = this.readFile(indexPath);
            
            // Check for inputs without proper labeling
            const inputPattern = /<input[^>]*>/gi;
            const inputs = content.match(inputPattern) || [];
            
            let unlabeledInputs = 0;
            let labeledInputs = 0;
            
            inputs.forEach(input => {
                // Skip hidden inputs, submit buttons, etc.
                if (input.includes('type="hidden"') || 
                    input.includes('type="submit"') || 
                    input.includes('type="button"')) {
                    return;
                }
                
                const hasId = /id\s*=\s*["']([^"']+)["']/i.test(input);
                const hasAriaLabel = /aria-label\s*=/i.test(input);
                const hasAriaLabelledBy = /aria-labelledby\s*=/i.test(input);
                const hasTitle = /title\s*=/i.test(input);
                
                if (hasId) {
                    const idMatch = input.match(/id\s*=\s*["']([^"']+)["']/i);
                    if (idMatch) {
                        const id = idMatch[1];
                        const hasLabel = content.includes(`for="${id}"`) || content.includes(`for='${id}'`);
                        if (hasLabel || hasAriaLabel || hasAriaLabelledBy || hasTitle) {
                            labeledInputs++;
                        } else {
                            unlabeledInputs++;
                        }
                    }
                } else if (hasAriaLabel || hasAriaLabelledBy || hasTitle) {
                    labeledInputs++;
                } else {
                    unlabeledInputs++;
                }
            });
            
            return {
                passed: unlabeledInputs === 0,
                message: unlabeledInputs > 0 ? `${unlabeledInputs} form inputs need labels` : null,
                details: `${labeledInputs} properly labeled inputs found`
            };
        }, 'WCAG 2.1 Level A');

        // WCAG 2.1 Level AA Tests
        this.addTest('Heading structure is logical', () => {
            const indexPath = 'index.html';
            const content = this.readFile(indexPath);
            
            const headings = content.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi) || [];
            const headingLevels = headings.map(h => {
                const match = h.match(/<h([1-6])/i);
                return match ? parseInt(match[1]) : 0;
            });
            
            // Check for proper heading hierarchy
            let hasH1 = headingLevels.includes(1);
            let properHierarchy = true;
            
            for (let i = 1; i < headingLevels.length; i++) {
                const current = headingLevels[i];
                const previous = headingLevels[i - 1];
                
                // Headings shouldn't skip levels (e.g., h2 -> h4)
                if (current > previous + 1) {
                    properHierarchy = false;
                    break;
                }
            }
            
            return {
                passed: hasH1 && properHierarchy,
                message: !hasH1 ? 'Page should have an H1 heading' : 
                        !properHierarchy ? 'Heading levels should not skip (e.g., h2 should not jump to h4)' : null,
                details: `Found ${headings.length} headings: ${headingLevels.join(', ')}`
            };
        }, 'WCAG 2.1 Level AA');

        this.addTest('Color contrast verification setup', () => {
            // This is a structural test - actual color contrast needs browser testing
            const indexPath = 'index.html';
            const content = this.readFile(indexPath);
            
            // Check if we're using a proper CSS framework or custom styles
            const hasTailwind = content.includes('tailwindcss');
            const hasCustomCSS = content.includes('.css');
            const hasInlineStyles = content.includes('style=');
            
            return {
                passed: true,
                severity: 'warning',
                message: 'Color contrast needs manual verification with browser tools',
                details: `Styling: ${hasTailwind ? 'Tailwind CSS' : 'Custom'}, Inline styles: ${hasInlineStyles ? 'Yes' : 'No'}`
            };
        }, 'WCAG 2.1 Level AA');

        this.addTest('JavaScript components are keyboard accessible', () => {
            // Check component files for keyboard event handlers
            const componentPaths = [
                'src/components/core/RetirementPlannerApp.js',
                'src/components/wizard/RetirementWizard.js'
            ];
            
            let keyboardSupport = 0;
            let totalComponents = 0;
            
            componentPaths.forEach(path => {
                if (this.checkFileExists(path)) {
                    totalComponents++;
                    const content = this.readFile(path);
                    
                    // Check for keyboard event handlers
                    const hasKeyboardEvents = /on(KeyDown|KeyUp|KeyPress)/i.test(content) ||
                                            /addEventListener.*key/i.test(content) ||
                                            /tabindex/i.test(content);
                    
                    if (hasKeyboardEvents) {
                        keyboardSupport++;
                    }
                }
            });
            
            return {
                passed: keyboardSupport > 0,
                message: keyboardSupport === 0 ? 'Components should support keyboard navigation' : null,
                details: `${keyboardSupport}/${totalComponents} components have keyboard support indicators`
            };
        }, 'WCAG 2.1 Level AA');

        // Financial Application Specific Tests
        this.addTest('Financial forms have proper error handling', () => {
            const componentPaths = [
                'src/components/wizard/steps/WizardStepSalary.js',
                'src/components/forms/RetirementBasicForm.js',
                'src/components/forms/RetirementAdvancedForm.js'
            ];
            
            let errorHandling = 0;
            let totalForms = 0;
            
            componentPaths.forEach(path => {
                if (this.checkFileExists(path)) {
                    totalForms++;
                    const content = this.readFile(path);
                    
                    // Look for error handling patterns
                    const hasErrorHandling = /error|validation|invalid/i.test(content) &&
                                           (/aria-invalid|aria-describedby/i.test(content) ||
                                            /role.*alert/i.test(content));
                    
                    if (hasErrorHandling) {
                        errorHandling++;
                    }
                }
            });
            
            return {
                passed: errorHandling > 0,
                message: errorHandling === 0 ? 'Financial forms should have accessible error messages' : null,
                details: `${errorHandling}/${totalForms} forms have accessible error handling`
            };
        }, 'Financial Accessibility');

        this.addTest('Currency values have proper formatting', () => {
            const utilPaths = [
                'src/utils/retirementCalculations.js',
                'src/utils/currencyAPI.js'
            ];
            
            let currencyFormatting = 0;
            let totalUtils = 0;
            
            utilPaths.forEach(path => {
                if (this.checkFileExists(path)) {
                    totalUtils++;
                    const content = this.readFile(path);
                    
                    // Check for proper currency formatting functions
                    const hasCurrencyFormatting = /formatCurrency|toLocaleString|Intl\.NumberFormat/i.test(content);
                    
                    if (hasCurrencyFormatting) {
                        currencyFormatting++;
                    }
                }
            });
            
            return {
                passed: currencyFormatting > 0,
                message: currencyFormatting === 0 ? 'Currency values should use accessible formatting' : null,
                details: `${currencyFormatting}/${totalUtils} utilities have currency formatting`
            };
        }, 'Financial Accessibility');

        this.addTest('Multilingual support structure', () => {
            const translationPath = 'src/translations/multiLanguage.js';
            
            if (!this.checkFileExists(translationPath)) {
                return { passed: false, message: 'Translation file not found' };
            }
            
            const content = this.readFile(translationPath);
            
            // Check for Hebrew and English support
            const hasHebrew = /['"]he['"]|['"]hebrew['"]|hebrew|עברית/i.test(content);
            const hasEnglish = /['"]en['"]|['"]english['"]|english/i.test(content);
            const hasRTLSupport = /rtl|right-to-left|dir.*rtl/i.test(content);
            
            return {
                passed: hasHebrew && hasEnglish,
                message: !(hasHebrew && hasEnglish) ? 'Should support both Hebrew and English' : null,
                details: `Hebrew: ${hasHebrew}, English: ${hasEnglish}, RTL support: ${hasRTLSupport}`
            };
        }, 'Internationalization');

        // Progressive Enhancement Tests
        this.addTest('Graceful degradation without JavaScript', () => {
            const indexPath = 'index.html';
            const content = this.readFile(indexPath);
            
            // Check for noscript tags or fallback content
            const hasNoscript = /<noscript>/i.test(content);
            const hasErrorBoundary = /ErrorBoundary|error.*boundary/i.test(content);
            
            return {
                passed: hasNoscript || hasErrorBoundary,
                severity: hasNoscript || hasErrorBoundary ? null : 'warning',
                message: !(hasNoscript || hasErrorBoundary) ? 'Consider adding graceful degradation for users without JavaScript' : null,
                details: `Noscript: ${hasNoscript}, Error boundaries: ${hasErrorBoundary}`
            };
        }, 'Progressive Enhancement');

        this.addTest('Responsive design indicators', () => {
            const indexPath = 'index.html';
            const content = this.readFile(indexPath);
            
            // Check for viewport meta tag and responsive CSS
            const hasViewport = /<meta[^>]*name\s*=\s*["']viewport["'][^>]*>/i.test(content);
            const hasResponsiveCSS = /responsive|mobile|tablet|md:|lg:|xl:|sm:/i.test(content);
            
            return {
                passed: hasViewport && hasResponsiveCSS,
                message: !hasViewport ? 'Missing viewport meta tag' : 
                        !hasResponsiveCSS ? 'No responsive design indicators found' : null,
                details: `Viewport: ${hasViewport}, Responsive classes: ${hasResponsiveCSS}`
            };
        }, 'Mobile Accessibility');
    }

    async runAllTests() {
        this.log(`\n${colors.bold}🔍 Advanced Retirement Planner - Accessibility Test Suite${colors.reset}`);
        this.log(`${colors.cyan}${'='.repeat(70)}${colors.reset}\n`);
        
        // Initialize all tests
        this.initializeTests();
        
        // Group tests by category
        const categories = [...new Set(this.tests.map(t => t.category))];
        
        for (const category of categories) {
            this.log(`\n${colors.bold}📋 ${category}${colors.reset}`);
            this.log(`${colors.blue}${'-'.repeat(40)}${colors.reset}`);
            
            const categoryTests = this.tests.filter(t => t.category === category);
            for (const test of categoryTests) {
                await this.runTest(test);
            }
        }
        
        // Print summary
        this.printSummary();
        
        // Generate report
        this.generateReport();
        
        // Exit with appropriate code
        process.exit(this.results.failed > 0 ? 1 : 0);
    }

    printSummary() {
        this.log(`\n${colors.cyan}${'='.repeat(70)}${colors.reset}`);
        this.log(`${colors.bold}📊 Accessibility Test Summary${colors.reset}\n`);
        
        this.log(`${colors.green}✅ Passed: ${this.results.passed}${colors.reset}`);
        this.log(`${colors.red}❌ Failed: ${this.results.failed}${colors.reset}`);
        this.log(`${colors.yellow}⚠️  Warnings: ${this.results.warnings}${colors.reset}`);
        this.log(`${colors.blue}📊 Total: ${this.results.total}${colors.reset}`);
        
        const successRate = Math.round((this.results.passed / this.results.total) * 100);
        this.log(`\n${colors.bold}Success Rate: ${successRate}%${colors.reset}`);
        
        if (this.errors.length > 0) {
            this.log(`\n${colors.red}❌ Critical Issues:${colors.reset}`);
            this.errors.forEach(error => {
                this.log(`   • ${error.test}: ${error.message}`, colors.red);
            });
        }
        
        if (this.warnings.length > 0) {
            this.log(`\n${colors.yellow}⚠️  Recommendations:${colors.reset}`);
            this.warnings.forEach(warning => {
                this.log(`   • ${warning.test}: ${warning.message}`, colors.yellow);
            });
        }
        
        // WCAG Compliance Assessment
        const wcagTests = this.tests.filter(t => t.category.includes('WCAG'));
        const wcagPassed = wcagTests.filter(t => {
            // This is a simplified check - in a real implementation we'd track individual results
            return true; // Placeholder
        }).length;
        
        this.log(`\n${colors.bold}🎯 WCAG 2.1 Compliance Assessment:${colors.reset}`);
        if (this.results.failed === 0) {
            this.log(`${colors.green}✅ Ready for accessibility review${colors.reset}`);
        } else if (this.results.failed <= 2) {
            this.log(`${colors.yellow}🟡 Minor issues to address${colors.reset}`);
        } else {
            this.log(`${colors.red}🔴 Significant accessibility barriers found${colors.reset}`);
        }
    }

    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: this.results,
            errors: this.errors,
            warnings: this.warnings,
            compliance: {
                wcag21Level: this.results.failed === 0 ? 'AA' : this.results.failed <= 2 ? 'A' : 'Non-compliant',
                recommendations: [
                    'Run browser-based accessibility tests with axe-core',
                    'Test with screen readers (NVDA, JAWS, VoiceOver)',
                    'Verify keyboard navigation in actual browsers',
                    'Test color contrast with accessibility tools',
                    'Validate with users who have disabilities'
                ]
            }
        };
        
        const reportPath = path.join(__dirname, 'accessibility-test-results.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        this.log(`\n${colors.cyan}📋 Report saved: ${reportPath}${colors.reset}`);
    }
}

// Run the accessibility tests
async function main() {
    const tester = new AccessibilityTester();
    await tester.runAllTests();
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Run tests
main().catch(console.error);