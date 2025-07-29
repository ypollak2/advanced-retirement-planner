// Performance Benchmarks for Advanced Retirement Planner
// Measures and validates performance metrics

const { TestFramework } = require('../utils/test-framework');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const test = new TestFramework();
test.configure({ timeout: 60000 }); // 60 second timeout for performance tests

// Performance thresholds from test config
const THRESHOLDS = {
    maxLoadTime: 3000, // 3 seconds
    maxScriptCount: 5,
    maxInlineScripts: 5,
    maxMemoryUsage: 50 * 1024 * 1024, // 50MB
    maxDOMNodes: 1500,
    maxRenderTime: 100, // 100ms for component render
    maxCalculationTime: 50 // 50ms for calculations
};

test.describe('Performance Benchmarks', () => {
    let browser;
    let page;
    
    test.beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        page = await browser.newPage();
        
        // Enable performance metrics
        await page.evaluateOnNewDocument(() => {
            window.performanceMetrics = {
                loadStart: Date.now(),
                domReady: null,
                loadComplete: null,
                renderTimes: {},
                calculationTimes: {},
                memoryUsage: []
            };
            
            // Track DOM ready
            document.addEventListener('DOMContentLoaded', () => {
                window.performanceMetrics.domReady = Date.now() - window.performanceMetrics.loadStart;
            });
            
            // Track load complete
            window.addEventListener('load', () => {
                window.performanceMetrics.loadComplete = Date.now() - window.performanceMetrics.loadStart;
            });
        });
    });
    
    test.afterAll(async () => {
        if (browser) {
            await browser.close();
        }
    });
    
    test.describe('Page Load Performance', () => {
        test.it('should load within performance threshold', async () => {
            const indexPath = path.join(__dirname, '../../index.html');
            await page.goto(`file://${indexPath}`, { waitUntil: 'networkidle0' });
            
            const metrics = await page.evaluate(() => window.performanceMetrics);
            
            test.expect(metrics.loadComplete).toBeLessThan(THRESHOLDS.maxLoadTime);
        });
        
        test.it('should have minimal inline scripts', async () => {
            const inlineScripts = await page.evaluate(() => {
                return document.querySelectorAll('script:not([src])').length;
            });
            
            test.expect(inlineScripts).toBeLessThan(THRESHOLDS.maxInlineScripts + 1);
        });
        
        test.it('should have optimal script count', async () => {
            const scriptCount = await page.evaluate(() => {
                return document.querySelectorAll('script').length;
            });
            
            test.expect(scriptCount).toBeLessThan(THRESHOLDS.maxScriptCount + 1);
        });
        
        test.it('should not exceed DOM node limit', async () => {
            const domNodeCount = await page.evaluate(() => {
                return document.getElementsByTagName('*').length;
            });
            
            test.expect(domNodeCount).toBeLessThan(THRESHOLDS.maxDOMNodes);
        });
    });
    
    test.describe('Runtime Performance', () => {
        test.it('should render components quickly', async () => {
            // Measure component render time
            const renderTime = await page.evaluate(() => {
                const start = performance.now();
                
                // Trigger a re-render by changing language
                if (window.changeLanguage) {
                    window.changeLanguage('he');
                    window.changeLanguage('en');
                }
                
                return performance.now() - start;
            });
            
            test.expect(renderTime).toBeLessThan(THRESHOLDS.maxRenderTime);
        });
        
        test.it('should perform calculations efficiently', async () => {
            const calculationTime = await page.evaluate(() => {
                const start = performance.now();
                
                // Mock calculation inputs
                const mockInputs = {
                    currentAge: 35,
                    retirementAge: 67,
                    monthlySalary: 15000,
                    currentSavings: 100000,
                    monthlyExpenses: 10000
                };
                
                // Trigger calculations if available
                if (window.calculateRetirement) {
                    window.calculateRetirement(mockInputs);
                }
                
                return performance.now() - start;
            });
            
            test.expect(calculationTime).toBeLessThan(THRESHOLDS.maxCalculationTime);
        });
        
        test.it('should handle large datasets efficiently', async () => {
            const largeDatasetTime = await page.evaluate(() => {
                const start = performance.now();
                
                // Create large allocation dataset
                const allocations = [];
                for (let i = 0; i < 100; i++) {
                    allocations.push({
                        index: i % 5,
                        percentage: 1,
                        customReturn: null
                    });
                }
                
                // Calculate weighted return if available
                if (window.calculateWeightedReturn) {
                    window.calculateWeightedReturn(allocations, 20, {});
                }
                
                return performance.now() - start;
            });
            
            test.expect(largeDatasetTime).toBeLessThan(100); // Should handle 100 allocations in < 100ms
        });
    });
    
    test.describe('Memory Performance', () => {
        test.it('should not have memory leaks', async () => {
            // Initial memory snapshot
            const initialMetrics = await page.metrics();
            const initialHeap = initialMetrics.JSHeapUsedSize;
            
            // Perform actions that could leak memory
            for (let i = 0; i < 10; i++) {
                await page.evaluate(() => {
                    // Change language multiple times
                    if (window.changeLanguage) {
                        window.changeLanguage('he');
                        window.changeLanguage('en');
                    }
                    
                    // Update form values
                    const inputs = document.querySelectorAll('input');
                    inputs.forEach(input => {
                        if (input.type === 'number') {
                            input.value = Math.random() * 10000;
                            input.dispatchEvent(new Event('change'));
                        }
                    });
                });
            }
            
            // Force garbage collection if available
            if (page.evaluate(() => typeof global.gc === 'function')) {
                await page.evaluate(() => global.gc());
            }
            
            // Final memory snapshot
            const finalMetrics = await page.metrics();
            const finalHeap = finalMetrics.JSHeapUsedSize;
            
            // Memory growth should be minimal (< 10MB)
            const memoryGrowth = finalHeap - initialHeap;
            test.expect(memoryGrowth).toBeLessThan(10 * 1024 * 1024);
        });
        
        test.it('should stay within memory threshold', async () => {
            const metrics = await page.metrics();
            test.expect(metrics.JSHeapUsedSize).toBeLessThan(THRESHOLDS.maxMemoryUsage);
        });
    });
    
    test.describe('Network Performance', () => {
        test.it('should minimize external API calls', async () => {
            const requests = [];
            
            page.on('request', request => {
                if (request.url().includes('http') && !request.url().includes('file://')) {
                    requests.push(request.url());
                }
            });
            
            await page.reload({ waitUntil: 'networkidle0' });
            
            // Should have minimal external requests (fonts, analytics, etc.)
            test.expect(requests.length).toBeLessThan(10);
        });
        
        test.it('should cache API responses effectively', async () => {
            // Test cache implementation
            const cachePerformance = await page.evaluate(() => {
                if (!window.localStorage) return { supported: false };
                
                const testKey = 'perf-test-cache';
                const testData = { data: new Array(1000).fill('test').join('') };
                
                const start = performance.now();
                localStorage.setItem(testKey, JSON.stringify(testData));
                const writeTime = performance.now() - start;
                
                const readStart = performance.now();
                const retrieved = JSON.parse(localStorage.getItem(testKey));
                const readTime = performance.now() - readStart;
                
                localStorage.removeItem(testKey);
                
                return {
                    supported: true,
                    writeTime,
                    readTime,
                    dataIntegrity: JSON.stringify(testData) === JSON.stringify(retrieved)
                };
            });
            
            if (cachePerformance.supported) {
                test.expect(cachePerformance.writeTime).toBeLessThan(10);
                test.expect(cachePerformance.readTime).toBeLessThan(5);
                test.expect(cachePerformance.dataIntegrity).toBe(true);
            }
        });
    });
    
    test.describe('Rendering Performance', () => {
        test.it('should handle rapid state updates efficiently', async () => {
            const updatePerformance = await page.evaluate(() => {
                const start = performance.now();
                const iterations = 100;
                
                for (let i = 0; i < iterations; i++) {
                    // Update multiple form fields rapidly
                    const event = new Event('change', { bubbles: true });
                    document.querySelectorAll('input[type="number"]').forEach(input => {
                        input.value = i;
                        input.dispatchEvent(event);
                    });
                }
                
                return {
                    totalTime: performance.now() - start,
                    averageTime: (performance.now() - start) / iterations
                };
            });
            
            test.expect(updatePerformance.averageTime).toBeLessThan(5); // < 5ms per update
        });
        
        test.it('should optimize reflows and repaints', async () => {
            const layoutMetrics = await page.evaluate(() => {
                const observer = new PerformanceObserver((list) => {});
                observer.observe({ entryTypes: ['layout-shift'] });
                
                // Trigger potential layout shifts
                document.body.style.fontSize = '18px';
                document.body.style.fontSize = '16px';
                
                // Get layout shift score
                const entries = performance.getEntriesByType('layout-shift');
                const totalShift = entries.reduce((sum, entry) => sum + entry.value, 0);
                
                return {
                    layoutShifts: entries.length,
                    cumulativeShift: totalShift
                };
            });
            
            // Cumulative Layout Shift should be minimal
            test.expect(layoutMetrics.cumulativeShift).toBeLessThan(0.1);
        });
    });
    
    test.describe('Performance Report', () => {
        test.it('should generate performance report', async () => {
            const report = await page.evaluate(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                const resources = performance.getEntriesByType('resource');
                
                return {
                    timing: {
                        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                        domInteractive: navigation.domInteractive - navigation.fetchStart,
                        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0
                    },
                    resources: {
                        total: resources.length,
                        scripts: resources.filter(r => r.name.endsWith('.js')).length,
                        styles: resources.filter(r => r.name.endsWith('.css')).length,
                        totalSize: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0)
                    },
                    memory: performance.memory ? {
                        usedJSHeapSize: performance.memory.usedJSHeapSize,
                        totalJSHeapSize: performance.memory.totalJSHeapSize,
                        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
                    } : null
                };
            });
            
            // Save report
            const reportPath = path.join(__dirname, '../../test-results/performance-report.json');
            fs.mkdirSync(path.dirname(reportPath), { recursive: true });
            fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
            
            // Validate key metrics
            test.expect(report.timing.domContentLoaded).toBeLessThan(1000);
            test.expect(report.timing.loadComplete).toBeLessThan(3000);
            test.expect(report.resources.scripts).toBeLessThan(20);
        });
    });
});

// Run the tests
test.run();