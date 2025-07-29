// End-to-End Test for Complete Wizard Flow
// Tests the entire user journey through the retirement planning wizard

const { TestFramework } = require('../utils/test-framework');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const test = new TestFramework();
test.configure({ timeout: 60000 }); // 60 seconds for E2E tests

// Test data for different user scenarios
const testScenarios = {
    youngProfessional: {
        planningType: 'individual',
        currentAge: 28,
        retirementAge: 65,
        monthlySalary: 12000,
        currentSavings: 50000,
        monthlyExpenses: 8000,
        pensionContributions: {
            employee: 6.5,
            employer: 6.5,
            severance: 8.33
        }
    },
    coupleNearRetirement: {
        planningType: 'couple',
        partner1: {
            currentAge: 58,
            retirementAge: 67,
            monthlySalary: 20000,
            currentSavings: 800000,
            monthlyExpenses: 7000
        },
        partner2: {
            currentAge: 55,
            retirementAge: 67,
            monthlySalary: 15000,
            currentSavings: 600000,
            monthlyExpenses: 5000
        }
    },
    highEarner: {
        planningType: 'individual',
        currentAge: 45,
        retirementAge: 60,
        monthlySalary: 50000,
        currentSavings: 2000000,
        monthlyExpenses: 25000,
        hasRSU: true,
        rsuDetails: {
            stockSymbol: 'AAPL',
            units: 1000,
            vestingFrequency: 'yearly'
        }
    }
};

test.describe('Wizard Flow E2E Tests', () => {
    let browser;
    let page;
    
    test.beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: { width: 1280, height: 720 }
        });
    });
    
    test.afterAll(async () => {
        if (browser) {
            await browser.close();
        }
    });
    
    test.beforeEach(async () => {
        page = await browser.newPage();
        
        // Set up request interception for API mocking
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            if (request.url().includes('finance.yahoo.com')) {
                // Mock stock price API
                request.respond({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ price: 150.00 })
                });
            } else {
                request.continue();
            }
        });
        
        const indexPath = path.join(__dirname, '../../index.html');
        await page.goto(`file://${indexPath}`, { waitUntil: 'networkidle0' });
    });
    
    test.afterEach(async () => {
        if (page) {
            await page.close();
        }
    });
    
    test.describe('Individual Planning Flow', () => {
        test.it('should complete wizard for young professional', async () => {
            const scenario = testScenarios.youngProfessional;
            
            // Step 1: Select planning type
            await page.waitForSelector('#planningType');
            await page.select('#planningType', scenario.planningType);
            
            // Click start/next button
            const startButton = await page.$('button:contains("Start"), button:contains("Next")');
            if (startButton) await startButton.click();
            
            // Step 2: Basic Information
            await page.waitForSelector('#currentAge');
            await page.type('#currentAge', String(scenario.currentAge));
            await page.type('#retirementAge', String(scenario.retirementAge));
            await page.type('#monthlyExpenses', String(scenario.monthlyExpenses));
            
            // Click next
            await clickNext(page);
            
            // Step 3: Income Information
            await page.waitForSelector('#monthlySalary');
            await page.type('#monthlySalary', String(scenario.monthlySalary));
            
            // Click next
            await clickNext(page);
            
            // Step 4: Savings Information
            await page.waitForSelector('#currentSavings');
            await page.type('#currentSavings', String(scenario.currentSavings));
            
            // Click next
            await clickNext(page);
            
            // Step 5: Pension Contributions
            if (await page.$('#employeePensionRate')) {
                await page.type('#employeePensionRate', String(scenario.pensionContributions.employee));
                await page.type('#employerPensionRate', String(scenario.pensionContributions.employer));
                await page.type('#severanceRate', String(scenario.pensionContributions.severance));
            }
            
            // Complete wizard
            await clickNext(page);
            
            // Verify results are displayed
            await page.waitForSelector('.results-container, #resultsPanel', { timeout: 10000 });
            
            // Verify key metrics are calculated
            const metrics = await page.evaluate(() => {
                const getText = (selector) => {
                    const el = document.querySelector(selector);
                    return el ? el.textContent : null;
                };
                
                return {
                    monthlyRetirement: getText('.monthly-retirement-income, [data-metric="monthly-income"]'),
                    totalSavings: getText('.total-retirement-savings, [data-metric="total-savings"]'),
                    healthScore: getText('.health-score, [data-metric="health-score"]')
                };
            });
            
            test.expect(metrics.monthlyRetirement).not.toBe(null);
            test.expect(metrics.totalSavings).not.toBe(null);
            
            // Take screenshot of results
            await page.screenshot({ 
                path: path.join(__dirname, '../../test-results/e2e-young-professional.png'),
                fullPage: true 
            });
        });
    });
    
    test.describe('Couple Planning Flow', () => {
        test.it('should complete wizard for couple near retirement', async () => {
            const scenario = testScenarios.coupleNearRetirement;
            
            // Select couple planning
            await page.waitForSelector('#planningType');
            await page.select('#planningType', scenario.planningType);
            
            const startButton = await page.$('button:contains("Start"), button:contains("Next")');
            if (startButton) await startButton.click();
            
            // Fill Partner 1 information
            await page.waitForSelector('[id*="partner1"], [name*="partner1"]');
            await fillPartnerInfo(page, 'partner1', scenario.partner1);
            
            // Click next
            await clickNext(page);
            
            // Fill Partner 2 information
            await page.waitForSelector('[id*="partner2"], [name*="partner2"]');
            await fillPartnerInfo(page, 'partner2', scenario.partner2);
            
            // Complete wizard
            await clickNext(page);
            
            // Verify couple results
            await page.waitForSelector('.results-container, #resultsPanel', { timeout: 10000 });
            
            const coupleMetrics = await page.evaluate(() => {
                const results = {};
                
                // Look for partner-specific results
                ['partner1', 'partner2'].forEach(partner => {
                    const partnerResults = document.querySelector(`[data-partner="${partner}"], .${partner}-results`);
                    if (partnerResults) {
                        results[partner] = {
                            found: true,
                            hasData: partnerResults.textContent.length > 0
                        };
                    }
                });
                
                // Look for combined results
                const combinedResults = document.querySelector('.combined-results, [data-combined="true"]');
                results.combined = combinedResults ? true : false;
                
                return results;
            });
            
            test.expect(coupleMetrics.partner1?.found || coupleMetrics.combined).toBe(true);
            test.expect(coupleMetrics.partner2?.found || coupleMetrics.combined).toBe(true);
            
            // Screenshot couple results
            await page.screenshot({ 
                path: path.join(__dirname, '../../test-results/e2e-couple-retirement.png'),
                fullPage: true 
            });
        });
    });
    
    test.describe('Advanced Features Flow', () => {
        test.it('should handle RSU and advanced investments', async () => {
            const scenario = testScenarios.highEarner;
            
            // Basic setup
            await page.waitForSelector('#planningType');
            await page.select('#planningType', scenario.planningType);
            
            // Fill basic info quickly
            await quickFillBasicInfo(page, scenario);
            
            // Navigate to RSU section
            const rsuTab = await page.$('[data-tab="rsu"], button:contains("RSU")');
            if (rsuTab) {
                await rsuTab.click();
                
                // Fill RSU details
                await page.waitForSelector('#stockSymbol, input[name*="stockSymbol"]');
                await page.type('#stockSymbol, input[name*="stockSymbol"]', scenario.rsuDetails.stockSymbol);
                await page.type('#rsuUnits, input[name*="units"]', String(scenario.rsuDetails.units));
                
                // Select vesting frequency
                const vestingSelect = await page.$('#vestingFrequency, select[name*="vesting"]');
                if (vestingSelect) {
                    await page.select('#vestingFrequency, select[name*="vesting"]', scenario.rsuDetails.vestingFrequency);
                }
                
                // Verify stock price lookup
                await page.waitForTimeout(2000); // Wait for API call
                
                const stockPrice = await page.evaluate(() => {
                    const priceEl = document.querySelector('[data-stock-price], .stock-price');
                    return priceEl ? priceEl.textContent : null;
                });
                
                test.expect(stockPrice).not.toBe(null);
            }
            
            // Complete and verify
            await completeWizard(page);
            
            // Take screenshot
            await page.screenshot({ 
                path: path.join(__dirname, '../../test-results/e2e-high-earner-rsu.png'),
                fullPage: true 
            });
        });
    });
    
    test.describe('Data Persistence', () => {
        test.it('should save and restore wizard progress', async () => {
            const scenario = testScenarios.youngProfessional;
            
            // Start filling wizard
            await page.waitForSelector('#planningType');
            await page.select('#planningType', scenario.planningType);
            
            // Fill some data
            const startButton = await page.$('button:contains("Start"), button:contains("Next")');
            if (startButton) await startButton.click();
            
            await page.waitForSelector('#currentAge');
            await page.type('#currentAge', String(scenario.currentAge));
            await page.type('#retirementAge', String(scenario.retirementAge));
            
            // Get current step
            const currentStep = await page.evaluate(() => {
                const stepIndicator = document.querySelector('.current-step, .active-step');
                return stepIndicator ? stepIndicator.textContent : '1';
            });
            
            // Reload page
            await page.reload({ waitUntil: 'networkidle0' });
            
            // Check if data persisted
            const savedData = await page.evaluate(() => {
                return {
                    localStorage: localStorage.getItem('retirementWizardInputs') !== null,
                    currentAge: document.querySelector('#currentAge')?.value,
                    retirementAge: document.querySelector('#retirementAge')?.value
                };
            });
            
            test.expect(savedData.localStorage).toBe(true);
            
            // If auto-restore is implemented, check values
            if (savedData.currentAge) {
                test.expect(savedData.currentAge).toBe(String(scenario.currentAge));
                test.expect(savedData.retirementAge).toBe(String(scenario.retirementAge));
            }
        });
    });
    
    test.describe('Multi-language Support', () => {
        test.it('should switch between Hebrew and English', async () => {
            // Find language switcher
            const langSwitcher = await page.$('[data-lang-switch], button:contains("עברית"), button:contains("HE")');
            
            if (langSwitcher) {
                // Get initial language
                const initialLang = await page.evaluate(() => {
                    return document.documentElement.lang || 'en';
                });
                
                // Switch language
                await langSwitcher.click();
                await page.waitForTimeout(1000); // Wait for UI update
                
                // Check if language changed
                const newLang = await page.evaluate(() => {
                    return document.documentElement.lang || 'en';
                });
                
                test.expect(newLang).not.toBe(initialLang);
                
                // Check RTL for Hebrew
                if (newLang === 'he') {
                    const isRTL = await page.evaluate(() => {
                        return document.documentElement.dir === 'rtl' || 
                               document.body.dir === 'rtl';
                    });
                    test.expect(isRTL).toBe(true);
                }
                
                // Take screenshot in Hebrew
                await page.screenshot({ 
                    path: path.join(__dirname, '../../test-results/e2e-hebrew-ui.png'),
                    fullPage: true 
                });
            }
        });
    });
    
    test.describe('Export Functionality', () => {
        test.it('should export results to PDF', async () => {
            // Complete wizard quickly
            await quickCompleteWizard(page, testScenarios.youngProfessional);
            
            // Look for export button
            const exportButton = await page.$('button:contains("Export"), button:contains("PDF"), button[data-export]');
            
            if (exportButton) {
                // Set up download handling
                const downloadPath = path.join(__dirname, '../../test-results/downloads');
                fs.mkdirSync(downloadPath, { recursive: true });
                
                await page._client.send('Page.setDownloadBehavior', {
                    behavior: 'allow',
                    downloadPath: downloadPath
                });
                
                // Click export
                await exportButton.click();
                
                // Wait for download
                await page.waitForTimeout(3000);
                
                // Check if file was downloaded
                const files = fs.readdirSync(downloadPath);
                const pdfFiles = files.filter(f => f.endsWith('.pdf'));
                
                test.expect(pdfFiles.length).toBeGreaterThan(0);
            }
        });
    });
});

// Helper functions
async function clickNext(page) {
    const nextButton = await page.$('button:contains("Next"), button:contains("Continue"), button[type="submit"]');
    if (nextButton) {
        await nextButton.click();
        await page.waitForTimeout(500); // Wait for animation
    }
}

async function fillPartnerInfo(page, partner, data) {
    const prefix = partner;
    await page.type(`#${prefix}CurrentAge, [name="${prefix}CurrentAge"]`, String(data.currentAge));
    await page.type(`#${prefix}RetirementAge, [name="${prefix}RetirementAge"]`, String(data.retirementAge));
    await page.type(`#${prefix}MonthlySalary, [name="${prefix}MonthlySalary"]`, String(data.monthlySalary));
    await page.type(`#${prefix}CurrentSavings, [name="${prefix}CurrentSavings"]`, String(data.currentSavings));
    await page.type(`#${prefix}MonthlyExpenses, [name="${prefix}MonthlyExpenses"]`, String(data.monthlyExpenses));
}

async function quickFillBasicInfo(page, scenario) {
    // This is a helper to quickly fill basic info for advanced feature testing
    const fields = {
        '#currentAge': scenario.currentAge,
        '#retirementAge': scenario.retirementAge,
        '#monthlySalary': scenario.monthlySalary,
        '#currentSavings': scenario.currentSavings,
        '#monthlyExpenses': scenario.monthlyExpenses
    };
    
    for (const [selector, value] of Object.entries(fields)) {
        const input = await page.$(selector);
        if (input) {
            await input.type(String(value));
        }
    }
}

async function completeWizard(page) {
    // Click through remaining steps
    let attempts = 0;
    while (attempts < 10) {
        const nextButton = await page.$('button:contains("Next"), button:contains("Finish"), button:contains("Calculate")');
        if (!nextButton) break;
        
        await nextButton.click();
        await page.waitForTimeout(1000);
        
        // Check if we reached results
        if (await page.$('.results-container, #resultsPanel')) {
            break;
        }
        
        attempts++;
    }
}

async function quickCompleteWizard(page, scenario) {
    await page.select('#planningType', scenario.planningType);
    await quickFillBasicInfo(page, scenario);
    await completeWizard(page);
    await page.waitForSelector('.results-container, #resultsPanel', { timeout: 10000 });
}

// Run the tests
test.run();