// Puppeteer E2E Tests for Production
// Run with: node puppeteer-tests.js

const puppeteer = require('puppeteer');
const fs = require('fs');

// Test configuration
const PRODUCTION_URL = 'https://ypollak2.github.io/advanced-retirement-planner/';
const TIMEOUT = 30000;

// Test results tracking
let testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    results: {},
    startTime: Date.now()
};

// Helper function to log with timestamp
function log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : '📝';
    console.log(`[${timestamp}] ${prefix} ${message}`);
}

// Helper to take screenshots
async function takeScreenshot(page, name) {
    const screenshotPath = `./screenshots/${name}-${Date.now()}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    return screenshotPath;
}

// Helper to wait for element and click
async function clickElement(page, selector, options = {}) {
    await page.waitForSelector(selector, { timeout: options.timeout || 5000 });
    await page.click(selector);
    await page.waitForTimeout(300); // Give UI time to update
}

// Helper to type in input
async function typeInInput(page, selector, text, options = {}) {
    await page.waitForSelector(selector, { timeout: options.timeout || 5000 });
    await page.click(selector, { clickCount: 3 }); // Select all
    await page.type(selector, text);
}

// Test Case 1: Complete wizard flow
async function test1_CompleteWizardFlow(page) {
    log('Test 1: Complete wizard flow - happy path');
    
    try {
        // Navigate to the app
        await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle2' });
        
        // Step 1: Planning type - Select couple
        await clickElement(page, '[data-value="couple"]');
        await clickElement(page, 'button:has-text("Next"), button:has-text("הבא")');
        
        // Step 2: Names
        await typeInInput(page, 'input[name="userName"]', 'John Doe');
        await typeInInput(page, 'input[name="partnerName"]', 'Jane Doe');
        await clickElement(page, 'button:has-text("Next"), button:has-text("הבא")');
        
        // Step 3: Country and ages
        await clickElement(page, '[data-country="israel"]');
        await typeInInput(page, 'input[name="currentAge"]', '35');
        await typeInInput(page, 'input[name="partnerAge"]', '33');
        await typeInInput(page, 'input[name="targetRetirementAge"]', '67');
        await typeInInput(page, 'input[name="partnerTargetRetirementAge"]', '67');
        await clickElement(page, 'button:has-text("Next"), button:has-text("הבא")');
        
        // Step 4: Salaries
        await typeInInput(page, 'input[name="partner1Salary"]', '40000');
        await typeInInput(page, 'input[name="partner2Salary"]', '30000');
        await page.waitForTimeout(500); // Wait for net salary calculation
        
        // Verify net salary calculated
        const partner1Net = await page.$eval('input[name="partner1NetSalary"]', el => el.value);
        if (!partner1Net || parseInt(partner1Net) < 20000) {
            throw new Error('Net salary calculation failed');
        }
        
        await clickElement(page, 'button:has-text("Next"), button:has-text("הבא")');
        
        // Navigate through remaining steps
        for (let i = 0; i < 5; i++) {
            await page.waitForTimeout(500);
            await clickElement(page, 'button:has-text("Next"), button:has-text("הבא")');
        }
        
        // Verify results displayed
        await page.waitForSelector('.financial-health-score', { timeout: 10000 });
        const scoreText = await page.$eval('.overall-score', el => el.textContent);
        
        if (!scoreText || scoreText === '0') {
            throw new Error('Financial health score not calculated');
        }
        
        await takeScreenshot(page, 'test1-success');
        log('Test 1 PASSED', 'success');
        return { status: 'passed', score: scoreText };
        
    } catch (error) {
        await takeScreenshot(page, 'test1-failed');
        log(`Test 1 FAILED: ${error.message}`, 'error');
        return { status: 'failed', error: error.message };
    }
}

// Test Case 2: Browser refresh mid-wizard
async function test2_BrowserRefresh(page) {
    log('Test 2: Browser refresh mid-wizard');
    
    try {
        await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle2' });
        
        // Progress to step 3
        await clickElement(page, '[data-value="couple"]');
        await typeInInput(page, 'input[name="userName"]', 'Test User');
        await clickElement(page, 'button:has-text("Next"), button:has-text("הבא")');
        
        await typeInInput(page, 'input[name="currentAge"]', '45');
        await clickElement(page, 'button:has-text("Next"), button:has-text("הבא")');
        
        await typeInInput(page, 'input[name="partner1Salary"]', '50000');
        
        // Check localStorage
        const savedData = await page.evaluate(() => {
            return {
                progress: localStorage.getItem('retirementWizardProgress'),
                inputs: localStorage.getItem('retirementWizardInputs')
            };
        });
        
        if (!savedData.progress) {
            throw new Error('Progress not saved to localStorage');
        }
        
        // Refresh the page
        await page.reload({ waitUntil: 'networkidle2' });
        await page.waitForTimeout(2000);
        
        // Check if wizard restored
        const currentStep = await page.evaluate(() => {
            const stepIndicator = document.querySelector('.step-indicator.active');
            return stepIndicator ? stepIndicator.textContent : null;
        });
        
        // Check if data restored
        const restoredSalary = await page.$eval('input[name="partner1Salary"]', el => el.value).catch(() => null);
        
        if (!restoredSalary || restoredSalary !== '50000') {
            throw new Error('Data not restored after refresh');
        }
        
        log('Test 2 PASSED', 'success');
        return { status: 'passed' };
        
    } catch (error) {
        await takeScreenshot(page, 'test2-failed');
        log(`Test 2 FAILED: ${error.message}`, 'error');
        return { status: 'failed', error: error.message };
    }
}

// Test Case 3: Input validation - negative numbers
async function test3_NegativeNumberValidation(page) {
    log('Test 3: Negative number validation');
    
    try {
        await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle2' });
        
        await clickElement(page, '[data-value="individual"]');
        await clickElement(page, 'button:has-text("Next"), button:has-text("הבא")');
        
        await typeInInput(page, 'input[name="currentAge"]', '35');
        await clickElement(page, 'button:has-text("Next"), button:has-text("הבא")');
        
        // Try negative salary
        await typeInInput(page, 'input[name="currentMonthlySalary"]', '-5000');
        await page.waitForTimeout(300);
        
        // Check for error
        const hasError = await page.$('.error-message, .text-red-500') !== null;
        if (!hasError) {
            throw new Error('No error shown for negative salary');
        }
        
        // Check if Next button is disabled
        const nextDisabled = await page.$eval('button:has-text("Next"), button:has-text("הבא")', 
            el => el.disabled || el.classList.contains('disabled'));
        
        if (!nextDisabled) {
            throw new Error('Next button not disabled with invalid input');
        }
        
        log('Test 3 PASSED', 'success');
        return { status: 'passed' };
        
    } catch (error) {
        await takeScreenshot(page, 'test3-failed');
        log(`Test 3 FAILED: ${error.message}`, 'error');
        return { status: 'failed', error: error.message };
    }
}

// Test Case 4: Mobile responsive design
async function test4_MobileResponsive(page) {
    log('Test 4: Mobile responsive design');
    
    try {
        // Set mobile viewport
        await page.setViewport({ width: 375, height: 667, isMobile: true });
        await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle2' });
        
        // Check for mobile menu or responsive layout
        await clickElement(page, '[data-value="individual"]');
        
        // Check button size
        const buttonSize = await page.$eval('button:has-text("Next"), button:has-text("הבא")', el => {
            const rect = el.getBoundingClientRect();
            return { width: rect.width, height: rect.height };
        });
        
        if (buttonSize.height < 44) {
            throw new Error(`Button too small for mobile: ${buttonSize.height}px (minimum 44px)`);
        }
        
        await takeScreenshot(page, 'test4-mobile');
        log('Test 4 PASSED', 'success');
        return { status: 'passed', buttonHeight: buttonSize.height };
        
    } catch (error) {
        await takeScreenshot(page, 'test4-failed');
        log(`Test 4 FAILED: ${error.message}`, 'error');
        return { status: 'failed', error: error.message };
    } finally {
        // Reset viewport
        await page.setViewport({ width: 1024, height: 768 });
    }
}

// Test Case 5: Language switching
async function test5_LanguageSwitching(page) {
    log('Test 5: Language switching');
    
    try {
        await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle2' });
        
        // Check initial language (should be English or Hebrew)
        const initialNextText = await page.$eval('button:has-text("Next"), button:has-text("הבא")', 
            el => el.textContent);
        
        // Find language toggle
        const langToggle = await page.$('.language-toggle, button:has-text("עב"), button:has-text("HE")');
        if (!langToggle) {
            throw new Error('Language toggle not found');
        }
        
        await langToggle.click();
        await page.waitForTimeout(500);
        
        // Check if language changed
        const newNextText = await page.$eval('button:has-text("Next"), button:has-text("הבא")', 
            el => el.textContent);
        
        if (initialNextText === newNextText) {
            throw new Error('Language did not change');
        }
        
        // Enter some data
        await clickElement(page, '[data-value="individual"]');
        await clickElement(page, 'button:has-text("Next"), button:has-text("הבא")');
        await typeInInput(page, 'input[name="currentAge"]', '40');
        
        // Switch language again
        await langToggle.click();
        await page.waitForTimeout(500);
        
        // Verify data persisted
        const ageValue = await page.$eval('input[name="currentAge"]', el => el.value);
        if (ageValue !== '40') {
            throw new Error('Data lost after language switch');
        }
        
        log('Test 5 PASSED', 'success');
        return { status: 'passed' };
        
    } catch (error) {
        await takeScreenshot(page, 'test5-failed');
        log(`Test 5 FAILED: ${error.message}`, 'error');
        return { status: 'failed', error: error.message };
    }
}

// Main test runner
async function runAllTests() {
    const browser = await puppeteer.launch({ 
        headless: false, // Set to true for CI/CD
        defaultViewport: { width: 1024, height: 768 }
    });
    
    // Create screenshots directory
    if (!fs.existsSync('./screenshots')) {
        fs.mkdirSync('./screenshots');
    }
    
    const tests = [
        { name: 'Complete Wizard Flow', fn: test1_CompleteWizardFlow },
        { name: 'Browser Refresh', fn: test2_BrowserRefresh },
        { name: 'Negative Number Validation', fn: test3_NegativeNumberValidation },
        { name: 'Mobile Responsive', fn: test4_MobileResponsive },
        { name: 'Language Switching', fn: test5_LanguageSwitching }
    ];
    
    testResults.total = tests.length;
    
    for (const test of tests) {
        const page = await browser.newPage();
        
        // Set up console logging
        page.on('console', msg => {
            if (msg.type() === 'error') {
                log(`Console error: ${msg.text()}`, 'error');
            }
        });
        
        // Run test
        const result = await test.fn(page);
        
        if (result.status === 'passed') {
            testResults.passed++;
        } else {
            testResults.failed++;
        }
        
        testResults.results[test.name] = result;
        
        await page.close();
    }
    
    await browser.close();
    
    // Generate report
    testResults.endTime = Date.now();
    testResults.duration = (testResults.endTime - testResults.startTime) / 1000;
    testResults.successRate = Math.round((testResults.passed / testResults.total) * 100);
    
    // Save results
    fs.writeFileSync(
        `e2e-results-${Date.now()}.json`, 
        JSON.stringify(testResults, null, 2)
    );
    
    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('E2E TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${testResults.total}`);
    console.log(`Passed: ${testResults.passed} ✅`);
    console.log(`Failed: ${testResults.failed} ❌`);
    console.log(`Success Rate: ${testResults.successRate}%`);
    console.log(`Duration: ${testResults.duration}s`);
    console.log('='.repeat(60) + '\n');
    
    process.exit(testResults.failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
    console.error('Test runner failed:', error);
    process.exit(1);
});