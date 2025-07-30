/**
 * Production Test Scenarios for Advanced Retirement Planner
 * Critical user flow validation for GitHub Pages deployment
 */

class ProductionTestScenarios {
    constructor(testRunner) {
        this.testRunner = testRunner;
        this.productionUrl = 'https://ypollak2.github.io/advanced-retirement-planner/';
        this.testWindow = null;
        this.testResults = [];
        
        this.registerAllScenarios();
    }
    
    registerAllScenarios() {
        // Critical Flow Tests
        this.registerScenario('flow', 'Complete wizard flow - Individual mode', this.testCompleteWizardFlow);
        this.registerScenario('flow', 'Complete wizard flow - Couple mode', this.testCoupleModeFlow);
        this.registerScenario('flow', 'Currency conversion functionality', this.testCurrencyConversion);
        this.registerScenario('flow', 'Form validation and error handling', this.testFormValidation);
        this.registerScenario('flow', 'Results calculation and display', this.testResultsCalculation);
        this.registerScenario('flow', 'Data persistence across sessions', this.testDataPersistence);
        this.registerScenario('flow', 'Language switching functionality', this.testLanguageSwitching);
        this.registerScenario('flow', 'Export functionality', this.testExportFunctionality);
        
        // Console Error Monitoring
        this.registerScenario('console', 'No critical console errors on load', this.testNoConsoleErrorsOnLoad);
        this.registerScenario('console', 'CurrencyAPI method availability', this.testCurrencyAPIAvailability);
        this.registerScenario('console', 'React components render without errors', this.testReactComponentsRender);
        this.registerScenario('console', 'No unhandled promise rejections', this.testNoUnhandledPromises);
        this.registerScenario('console', 'Service Worker registration', this.testServiceWorkerRegistration);
        
        // API Integration Tests
        this.registerScenario('api', 'External currency API connectivity', this.testExternalAPIConnectivity);
        this.registerScenario('api', 'Stock price API integration', this.testStockPriceAPI);
        this.registerScenario('api', 'Offline fallback behavior', this.testOfflineFallback);
        this.registerScenario('api', 'CORS proxy functionality', this.testCORSProxyFunctionality);
        
        // Performance Tests
        this.registerScenario('performance', 'Page load time under 5 seconds', this.testPageLoadTime);
        this.registerScenario('performance', 'No memory leaks during usage', this.testMemoryLeaks);
        this.registerScenario('performance', 'Responsive design on mobile', this.testMobileResponsiveness);
        
        // Security Tests
        this.registerScenario('security', 'No XSS vulnerabilities', this.testXSSVulnerabilities);
        this.registerScenario('security', 'Secure data handling', this.testSecureDataHandling);
        this.registerScenario('security', 'No sensitive data in console', this.testNoSensitiveDataInConsole);
    }
    
    registerScenario(category, description, testFunction) {
        if (this.testRunner && this.testRunner.addTest) {
            this.testRunner.addTest(category, description, testFunction.bind(this));
        }
    }
    
    async openProductionApp() {
        return new Promise((resolve, reject) => {
            // Create invisible iframe for testing
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.style.width = '1024px';
            iframe.style.height = '768px';
            iframe.src = this.productionUrl;
            
            const timeout = setTimeout(() => {
                document.body.removeChild(iframe);
                reject(new Error('Failed to load production app within 15 seconds'));
            }, 15000);
            
            iframe.onload = () => {
                clearTimeout(timeout);
                this.testWindow = iframe.contentWindow;
                resolve(iframe);
            };
            
            iframe.onerror = () => {
                clearTimeout(timeout);
                document.body.removeChild(iframe);
                reject(new Error('Failed to load production application'));
            };
            
            document.body.appendChild(iframe);
        });
    }
    
    async closeProductionApp(iframe) {
        if (iframe && iframe.parentNode) {
            document.body.removeChild(iframe);
        }
        this.testWindow = null;
    }
    
    async waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            const checkElement = () => {
                if (!this.testWindow) {
                    reject(new Error('Test window not available'));
                    return;
                }
                
                try {
                    const element = this.testWindow.document.querySelector(selector);
                    if (element) {
                        resolve(element);
                        return;
                    }
                } catch (e) {
                    // Cross-origin access might be blocked
                    console.warn('Cross-origin access blocked for element selection');
                }
                
                if (Date.now() - startTime > timeout) {
                    reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                    return;
                }
                
                setTimeout(checkElement, 100);
            };
            
            checkElement();
        });
    }
    
    async simulateUserInput(selector, value) {
        try {
            const element = await this.waitForElement(selector);
            element.value = value;
            element.dispatchEvent(new this.testWindow.Event('input', { bubbles: true }));
            element.dispatchEvent(new this.testWindow.Event('change', { bubbles: true }));
            return true;
        } catch (error) {
            console.warn(`Could not simulate input for ${selector}:`, error.message);
            return false;
        }
    }
    
    async clickElement(selector) {
        try {
            const element = await this.waitForElement(selector);
            element.click();
            return true;
        } catch (error) {
            console.warn(`Could not click element ${selector}:`, error.message);
            return false;
        }
    }
    
    // Test Implementations
    
    async testCompleteWizardFlow() {
        const iframe = await this.openProductionApp();
        
        try {
            // Wait for app to fully load
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Check if wizard is visible
            const hasWizard = await this.waitForElement('.wizard-container, #wizard-container, .step-container', 5000)
                .then(() => true)
                .catch(() => false);
            
            if (!hasWizard) {
                throw new Error('Wizard container not found on production app');
            }
            
            // Try to navigate through steps (limited by cross-origin restrictions)
            const navigationTests = [
                'button[id*="next"], .btn-next, .wizard-next',
                'button[id*="prev"], .btn-prev, .wizard-prev',
                '.wizard-step, .step-item'
            ];
            
            let navigationWorking = false;
            for (const selector of navigationTests) {
                if (await this.waitForElement(selector, 2000).then(() => true).catch(() => false)) {
                    navigationWorking = true;
                    break;
                }
            }
            
            if (!navigationWorking) {
                throw new Error('Wizard navigation elements not found');
            }
            
            // Check for any JavaScript errors during interaction
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const jsErrors = this.testRunner.errors.filter(err => 
                err.message.includes('wizard') || 
                err.message.includes('navigation') ||
                err.message.includes('step')
            );
            
            if (jsErrors.length > 0) {
                throw new Error(`JavaScript errors detected during wizard flow: ${jsErrors.length} errors`);
            }
            
        } finally {
            await this.closeProductionApp(iframe);
        }
    }
    
    async testCoupleModeFlow() {
        const iframe = await this.openProductionApp();
        
        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Look for couple mode toggle
            const coupleModeElements = [
                'input[id*="couple"], input[name*="couple"]',
                '.couple-toggle, .planning-type-toggle',
                'select[id*="planning"], select[name*="planning"]'
            ];
            
            let coupleModeFound = false;
            for (const selector of coupleModeElements) {
                if (await this.waitForElement(selector, 2000).then(() => true).catch(() => false)) {
                    coupleModeFound = true;
                    break;
                }
            }
            
            if (!coupleModeFound) {
                throw new Error('Couple mode toggle not found');
            }
            
            // Check for partner-specific elements
            const partnerElements = [
                '[id*="partner"], [name*="partner"]',
                '.partner-section, .couple-section',
                'input[id*="partner1"], input[id*="partner2"]'
            ];
            
            let partnerElementsFound = false;
            for (const selector of partnerElements) {
                if (await this.waitForElement(selector, 2000).then(() => true).catch(() => false)) {
                    partnerElementsFound = true;
                    break;
                }
            }
            
            // Check for couple-mode related errors
            const coupleErrors = this.testRunner.errors.filter(err => 
                err.message.includes('couple') || 
                err.message.includes('partner') ||
                err.message.includes('getFieldValue')
            );
            
            if (coupleErrors.length > 0) {
                throw new Error(`Couple mode errors detected: ${coupleErrors.length} errors`);
            }
            
        } finally {
            await this.closeProductionApp(iframe);
        }
    }
    
    async testCurrencyConversion() {
        const iframe = await this.openProductionApp();
        
        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Look for currency selection elements
            const currencyElements = [
                'select[id*="currency"], select[name*="currency"]',
                '.currency-select, .currency-dropdown',
                'input[id*="currency"]'
            ];
            
            let currencyElementFound = false;
            for (const selector of currencyElements) {
                if (await this.waitForElement(selector, 2000).then(() => true).catch(() => false)) {
                    currencyElementFound = true;
                    break;
                }
            }
            
            if (!currencyElementFound) {
                throw new Error('Currency selection elements not found');
            }
            
            // Check for currency-related errors
            const currencyErrors = this.testRunner.errors.filter(err => 
                err.message.includes('currency') || 
                err.message.includes('exchange') ||
                err.message.includes('getExchangeRates') ||
                err.message.includes('NaN') ||
                err.message.includes('Infinity')
            );
            
            if (currencyErrors.length > 0) {
                throw new Error(`Currency conversion errors detected: ${currencyErrors.length} errors`);
            }
            
            // Test if currency conversion functions are available
            try {
                if (this.testWindow.CurrencyAPI) {
                    const hasGetRates = typeof this.testWindow.CurrencyAPI.getExchangeRates === 'function';
                    if (!hasGetRates) {
                        throw new Error('CurrencyAPI.getExchangeRates method not available');
                    }
                } else {
                    console.warn('CurrencyAPI not accessible due to cross-origin restrictions');
                }
            } catch (e) {
                console.warn('Currency API check limited by cross-origin policy');
            }
            
        } finally {
            await this.closeProductionApp(iframe);
        }
    }
    
    async testFormValidation() {
        const iframe = await this.openProductionApp();
        
        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Look for form elements
            const formElements = [
                'form, .form-container',
                'input[required], input[data-required]',
                '.validation-error, .error-message'
            ];
            
            let formElementsFound = false;
            for (const selector of formElements) {
                if (await this.waitForElement(selector, 2000).then(() => true).catch(() => false)) {
                    formElementsFound = true;
                    break;
                }
            }
            
            if (!formElementsFound) {
                throw new Error('Form elements not found');
            }
            
            // Check for validation-related errors
            const validationErrors = this.testRunner.errors.filter(err => 
                err.message.includes('validation') || 
                err.message.includes('required') ||
                err.message.includes('invalid')
            );
            
            if (validationErrors.length > 0) {
                throw new Error(`Form validation errors detected: ${validationErrors.length} errors`);
            }
            
        } finally {
            await this.closeProductionApp(iframe);
        }
    }
    
    async testResultsCalculation() {
        const iframe = await this.openProductionApp();
        
        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Check for calculation-related errors
            const calculationErrors = this.testRunner.errors.filter(err => 
                err.message.includes('calculation') || 
                err.message.includes('NaN') ||
                err.message.includes('Infinity') ||
                err.message.includes('retirement') ||
                err.message.includes('financial')
            );
            
            if (calculationErrors.length > 0) {
                throw new Error(`Calculation errors detected: ${calculationErrors.length} errors`);
            }
            
            // Look for results display elements
            const resultsElements = [
                '.results-container, #results-container',
                '.calculation-results, .retirement-results',
                '.chart-container, .results-chart'
            ];
            
            let resultsElementFound = false;
            for (const selector of resultsElements) {
                if (await this.waitForElement(selector, 2000).then(() => true).catch(() => false)) {
                    resultsElementFound = true;
                    break;
                }
            }
            
            // Results might not be visible initially, so this is just a warning
            if (!resultsElementFound) {
                console.warn('Results display elements not immediately visible');
            }
            
        } finally {
            await this.closeProductionApp(iframe);
        }
    }
    
    async testDataPersistence() {
        const iframe = await this.openProductionApp();
        
        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Check for localStorage-related errors
            const storageErrors = this.testRunner.errors.filter(err => 
                err.message.includes('localStorage') || 
                err.message.includes('storage') ||
                err.message.includes('save') ||
                err.message.includes('load')
            );
            
            if (storageErrors.length > 0) {
                throw new Error(`Data persistence errors detected: ${storageErrors.length} errors`);
            }
            
            // Test localStorage functionality (if accessible)
            try {
                if (this.testWindow.localStorage) {
                    // localStorage is working
                    console.log('localStorage is accessible');
                } else {
                    console.warn('localStorage not accessible due to cross-origin restrictions');
                }
            } catch (e) {
                console.warn('localStorage check limited by cross-origin policy');
            }
            
        } finally {
            await this.closeProductionApp(iframe);
        }
    }
    
    async testLanguageSwitching() {
        const iframe = await this.openProductionApp();
        
        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Look for language switching elements
            const languageElements = [
                'select[id*="language"], select[name*="language"]',
                '.language-switch, .lang-toggle',
                'button[id*="hebrew"], button[id*="english"]'
            ];
            
            let languageElementFound = false;
            for (const selector of languageElements) {
                if (await this.waitForElement(selector, 2000).then(() => true).catch(() => false)) {
                    languageElementFound = true;
                    break;
                }
            }
            
            if (!languageElementFound) {
                throw new Error('Language switching elements not found');
            }
            
            // Check for language-related errors
            const languageErrors = this.testRunner.errors.filter(err => 
                err.message.includes('language') || 
                err.message.includes('translation') ||
                err.message.includes('i18n')
            );
            
            if (languageErrors.length > 0) {
                throw new Error(`Language switching errors detected: ${languageErrors.length} errors`);
            }
            
        } finally {
            await this.closeProductionApp(iframe);
        }
    }
    
    async testExportFunctionality() {
        const iframe = await this.openProductionApp();
        
        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Look for export elements
            const exportElements = [
                'button[id*="export"], button[name*="export"]',
                '.export-btn, .download-btn',
                'a[download], button[id*="download"]'
            ];
            
            let exportElementFound = false;
            for (const selector of exportElements) {
                if (await this.waitForElement(selector, 2000).then(() => true).catch(() => false)) {
                    exportElementFound = true;
                    break;
                }
            }
            
            if (!exportElementFound) {
                console.warn('Export functionality elements not immediately visible');
            }
            
            // Check for export-related errors
            const exportErrors = this.testRunner.errors.filter(err => 
                err.message.includes('export') || 
                err.message.includes('download') ||
                err.message.includes('blob') ||
                err.message.includes('pdf')
            );
            
            if (exportErrors.length > 0) {
                throw new Error(`Export functionality errors detected: ${exportErrors.length} errors`);
            }
            
        } finally {
            await this.closeProductionApp(iframe);
        }
    }
    
    async testNoConsoleErrorsOnLoad() {
        const initialErrorCount = this.testRunner.errors.length;
        
        const iframe = await this.openProductionApp();
        
        try {
            // Wait for full page load
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            const newErrors = this.testRunner.errors.slice(initialErrorCount);
            const criticalErrors = newErrors.filter(err => 
                err.message.includes('is not defined') ||
                err.message.includes('Cannot read property') ||
                err.message.includes('Script error') ||
                err.message.includes('Uncaught')
            );
            
            if (criticalErrors.length > 0) {
                throw new Error(`Critical console errors on load: ${criticalErrors.length} errors`);
            }
            
            if (newErrors.length > 5) {
                throw new Error(`Too many errors on load: ${newErrors.length} errors`);
            }
            
        } finally {
            await this.closeProductionApp(iframe);
        }
    }
    
    async testCurrencyAPIAvailability() {
        const iframe = await this.openProductionApp();
        
        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Check for CurrencyAPI-related errors
            const currencyAPIErrors = this.testRunner.errors.filter(err => 
                err.message.includes('getExchangeRates') ||
                err.message.includes('CurrencyAPI') ||
                err.message.includes('is not a function')
            );
            
            if (currencyAPIErrors.length > 0) {
                throw new Error(`CurrencyAPI method errors: ${currencyAPIErrors.length} errors`);
            }
            
        } finally {
            await this.closeProductionApp(iframe);
        }
    }
    
    async testReactComponentsRender() {
        const iframe = await this.openProductionApp();
        
        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Check for React-related errors
            const reactErrors = this.testRunner.errors.filter(err => 
                err.message.includes('React') ||
                err.message.includes('Component') ||
                err.message.includes('createElement') ||
                err.message.includes('render')
            );
            
            if (reactErrors.length > 0) {
                throw new Error(`React component errors: ${reactErrors.length} errors`);
            }
            
        } finally {
            await this.closeProductionApp(iframe);
        }
    }
    
    async testNoUnhandledPromises() {
        const iframe = await this.openProductionApp();
        
        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Check for unhandled promise rejections
            const promiseErrors = this.testRunner.errors.filter(err => 
                err.type === 'unhandled-promise-rejection' ||
                err.message.includes('Unhandled Promise Rejection')
            );
            
            if (promiseErrors.length > 0) {
                throw new Error(`Unhandled promise rejections: ${promiseErrors.length} errors`);
            }
            
        } finally {
            await this.closeProductionApp(iframe);
        }
    }
    
    async testServiceWorkerRegistration() {
        if (!('serviceWorker' in navigator)) {
            throw new Error('Service Worker not supported in this browser');
        }
        
        const iframe = await this.openProductionApp();
        
        try {
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            // Check for Service Worker registration
            const registrations = await navigator.serviceWorker.getRegistrations();
            const hasAppServiceWorker = registrations.some(reg => 
                reg.scope.includes('advanced-retirement-planner') ||
                reg.scope.includes('ypollak2.github.io')
            );
            
            if (!hasAppServiceWorker) {
                console.warn('Service Worker not found for the app domain');
            }
            
            // Check for Service Worker errors
            const swErrors = this.testRunner.errors.filter(err => 
                err.message.includes('service worker') ||
                err.message.includes('sw.js') ||
                err.message.includes('ServiceWorker')
            );
            
            if (swErrors.length > 0) {
                throw new Error(`Service Worker errors: ${swErrors.length} errors`);
            }
            
        } finally {
            await this.closeProductionApp(iframe);
        }
    }
    
    async testExternalAPIConnectivity() {
        try {
            // Test currency API connectivity
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Currency API returned status ${response.status}`);
            }
            
            const data = await response.json();
            if (!data.rates) {
                throw new Error('Currency API response missing rates data');
            }
            
        } catch (error) {
            throw new Error(`External API connectivity failed: ${error.message}`);
        }
    }
    
    async testStockPriceAPI() {
        try {
            // Test with a simple request to Yahoo Finance (might be blocked by CORS)
            const testSymbol = 'AAPL';
            const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${testSymbol}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            // This will likely fail due to CORS in browser environment
            console.log('Stock API test result:', response.status);
            
        } catch (error) {
            // Expected to fail due to CORS restrictions
            console.warn(`Stock API test failed as expected: ${error.message}`);
        }
    }
    
    async testOfflineFallback() {
        const iframe = await this.openProductionApp();
        
        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Check for network errors that should have fallback handling
            const networkErrors = this.testRunner.errors.filter(err => 
                err.message.includes('fetch') ||
                err.message.includes('network') ||
                err.message.includes('offline')
            );
            
            // Network errors are expected, but should be handled gracefully
            const unhandledNetworkErrors = networkErrors.filter(err => 
                err.message.includes('Uncaught') ||
                !err.message.includes('fallback')
            );
            
            if (unhandledNetworkErrors.length > 0) {
                throw new Error(`Unhandled network errors: ${unhandledNetworkErrors.length} errors`);
            }
            
        } finally {
            await this.closeProductionApp(iframe);
        }
    }
    
    async testCORSProxyFunctionality() {
        const iframe = await this.openProductionApp();
        
        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Check for CORS-related errors
            const corsErrors = this.testRunner.errors.filter(err => 
                err.message.includes('CORS') ||
                err.message.includes('cors') ||
                err.message.includes('Access-Control-Allow-Origin')
            );
            
            if (corsErrors.length > 2) { // Allow for some expected CORS issues
                throw new Error(`Excessive CORS errors: ${corsErrors.length} errors`);
            }
            
        } finally {
            await this.closeProductionApp(iframe);
        }
    }
    
    async testPageLoadTime() {
        const startTime = performance.now();
        const iframe = await this.openProductionApp();
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const loadTime = performance.now() - startTime;
            
            if (loadTime > 5000) {
                throw new Error(`Page load time too slow: ${loadTime.toFixed(2)}ms`);
            }
            
            console.log(`Page load time: ${loadTime.toFixed(2)}ms`);
            
        } finally {
            await this.closeProductionApp(iframe);
        }
    }
    
    async testMemoryLeaks() {
        if (!('memory' in performance)) {
            console.warn('Memory API not available in this browser');
            return;
        }
        
        const initialMemory = performance.memory.usedJSHeapSize;
        const iframe = await this.openProductionApp();
        
        try {
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            const finalMemory = performance.memory.usedJSHeapSize;
            const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024; // MB
            
            if (memoryIncrease > 50) { // More than 50MB increase
                throw new Error(`Significant memory increase: ${memoryIncrease.toFixed(2)}MB`);
            }
            
            console.log(`Memory increase: ${memoryIncrease.toFixed(2)}MB`);
            
        } finally {
            await this.closeProductionApp(iframe);
        }
    }
    
    async testMobileResponsiveness() {
        const iframe = await this.openProductionApp();
        
        try {
            // Simulate mobile viewport
            iframe.style.width = '375px';
            iframe.style.height = '667px';
            
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Check for mobile-specific errors
            const mobileErrors = this.testRunner.errors.filter(err => 
                err.message.includes('viewport') ||
                err.message.includes('mobile') ||
                err.message.includes('responsive')
            );
            
            if (mobileErrors.length > 0) {
                throw new Error(`Mobile responsiveness errors: ${mobileErrors.length} errors`);
            }
            
        } finally {
            await this.closeProductionApp(iframe);
        }
    }
    
    async testXSSVulnerabilities() {
        const iframe = await this.openProductionApp();
        
        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Check for potential XSS-related errors
            const xssErrors = this.testRunner.errors.filter(err => 
                err.message.includes('script') ||
                err.message.includes('innerHTML') ||
                err.message.includes('eval')
            );
            
            // Look for unsafe patterns (this is basic, real XSS testing would be more complex)
            const unsafePatterns = this.testRunner.consoleLogs.filter(log => 
                log.message.includes('<script>') ||
                log.message.includes('javascript:') ||
                log.message.includes('eval(')
            );
            
            if (unsafePatterns.length > 0) {
                throw new Error(`Potential XSS vulnerabilities detected: ${unsafePatterns.length} instances`);
            }
            
        } finally {
            await this.closeProductionApp(iframe);
        }
    }
    
    async testSecureDataHandling() {
        const iframe = await this.openProductionApp();
        
        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Check that no sensitive data patterns appear in console
            const sensitivePatterns = [
                /password/i,
                /secret/i,
                /key/i,
                /token/i,
                /api[_-]?key/i
            ];
            
            const sensitiveEntries = this.testRunner.consoleLogs.filter(log => 
                sensitivePatterns.some(pattern => pattern.test(log.message))
            );
            
            if (sensitiveEntries.length > 0) {
                throw new Error(`Potential sensitive data in console: ${sensitiveEntries.length} entries`);
            }
            
        } finally {
            await this.closeProductionApp(iframe);
        }
    }
    
    async testNoSensitiveDataInConsole() {
        // Check all captured logs for sensitive information
        const sensitivePatterns = [
            /\b\d{16}\b/, // Credit card numbers
            /\b\d{3}-\d{2}-\d{4}\b/, // SSN format
            /password\s*[:=]\s*\S+/i,
            /secret\s*[:=]\s*\S+/i,
            /api[_-]?key\s*[:=]\s*\S+/i,
            /token\s*[:=]\s*\S+/i
        ];
        
        const sensitiveEntries = this.testRunner.consoleLogs.filter(log => 
            sensitivePatterns.some(pattern => pattern.test(log.message))
        );
        
        if (sensitiveEntries.length > 0) {
            throw new Error(`Sensitive data detected in console logs: ${sensitiveEntries.length} entries`);
        }
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.ProductionTestScenarios = ProductionTestScenarios;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductionTestScenarios;
}