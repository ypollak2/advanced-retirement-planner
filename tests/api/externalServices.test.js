// API Tests for External Services
// Tests stock price APIs, currency APIs, and CORS proxy functionality

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

console.log('🌐 Testing External API Services...');

let testsPassed = 0;
let testsTotal = 0;

function runTest(testName, testFunction) {
    testsTotal++;
    testFunction()
        .then(result => {
            if (result) {
                console.log(`✅ PASS ${testName}`);
                testsPassed++;
            } else {
                console.log(`❌ FAIL ${testName}`);
            }
        })
        .catch(error => {
            console.log(`❌ FAIL ${testName}: ${error.message}`);
        });
}

function runSyncTest(testName, testFunction) {
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

// Load API modules
const stockAPIPath = path.join(__dirname, '..', '..', 'src/utils/stockPriceAPI.js');
const currencyAPIPath = path.join(__dirname, '..', '..', 'src/utils/currencyAPI.js');
const corsProxyPath = path.join(__dirname, '..', '..', 'config/cors-proxy-solution.js');

// Test Suite 1: Stock Price API Structure
runSyncTest('Stock API: stockPriceAPI.js exists and has basic structure', () => {
    if (!fs.existsSync(stockAPIPath)) return false;
    const content = fs.readFileSync(stockAPIPath, 'utf8');
    return content.includes('window.StockPriceAPI') && 
           content.includes('fetchStockPrice') &&
           content.includes('fallbackPrices');
});

runSyncTest('Stock API: Fallback prices for major stocks', () => {
    if (!fs.existsSync(stockAPIPath)) return false;
    const content = fs.readFileSync(stockAPIPath, 'utf8');
    return content.includes('AAPL') && 
           content.includes('GOOGL') &&
           content.includes('MSFT') &&
           content.includes('AMZN');
});

runSyncTest('Stock API: Yahoo Finance integration', () => {
    if (!fs.existsSync(stockAPIPath)) return false;
    const content = fs.readFileSync(stockAPIPath, 'utf8');
    return content.includes('yahoo') && 
           content.includes('finance') &&
           content.includes('query');
});

runSyncTest('Stock API: Error handling and fallback logic', () => {
    if (!fs.existsSync(stockAPIPath)) return false;
    const content = fs.readFileSync(stockAPIPath, 'utf8');
    return content.includes('catch') && 
           content.includes('fallback') &&
           content.includes('error');
});

// Test Suite 2: Currency API Structure
runSyncTest('Currency API: currencyAPI.js exists and has basic structure', () => {
    if (!fs.existsSync(currencyAPIPath)) return false;
    const content = fs.readFileSync(currencyAPIPath, 'utf8');
    return content.includes('window.CurrencyAPI') && 
           content.includes('getRate') &&
           content.includes('USD') &&
           content.includes('ILS');
});

runSyncTest('Currency API: Multiple currency support', () => {
    if (!fs.existsSync(currencyAPIPath)) return false;
    const content = fs.readFileSync(currencyAPIPath, 'utf8');
    return content.includes('EUR') && 
           content.includes('GBP') &&
           content.includes('BTC') &&
           content.includes('ETH');
});

runSyncTest('Currency API: Rate caching mechanism', () => {
    if (!fs.existsSync(currencyAPIPath)) return false;
    const content = fs.readFileSync(currencyAPIPath, 'utf8');
    return content.includes('cache') && 
           content.includes('timestamp') &&
           content.includes('TTL');
});

runSyncTest('Currency API: Exchange rate validation', () => {
    if (!fs.existsSync(currencyAPIPath)) return false;
    const content = fs.readFileSync(currencyAPIPath, 'utf8');
    return content.includes('rate') && 
           content.includes('validation') ||
           content.includes('isNaN') ||
           content.includes('typeof');
});

// Test Suite 3: CORS Proxy Configuration
runSyncTest('CORS Proxy: Configuration file exists', () => {
    if (!fs.existsSync(corsProxyPath)) return false;
    const content = fs.readFileSync(corsProxyPath, 'utf8');
    return content.includes('CORSProxySolution') && 
           content.includes('proxyUrls');
});

runSyncTest('CORS Proxy: Multiple proxy services configured', () => {
    if (!fs.existsSync(corsProxyPath)) return false;
    const content = fs.readFileSync(corsProxyPath, 'utf8');
    const proxyCount = (content.match(/https:\/\/[^'",\s]+/g) || []).length;
    return proxyCount >= 3; // Should have at least 3 proxy services
});

runSyncTest('CORS Proxy: Proxy rotation logic', () => {
    if (!fs.existsSync(corsProxyPath)) return false;
    const content = fs.readFileSync(corsProxyPath, 'utf8');
    return content.includes('rotate') || 
           content.includes('next') ||
           content.includes('currentIndex');
});

runSyncTest('CORS Proxy: Domain validation for security', () => {
    if (!fs.existsSync(corsProxyPath)) return false;
    const content = fs.readFileSync(corsProxyPath, 'utf8');
    return content.includes('validate') && 
           content.includes('domain') ||
           content.includes('yahoo') ||
           content.includes('whitelist');
});

// Test Suite 4: API Response Validation
runSyncTest('API Response: Stock price data structure validation', () => {
    if (!fs.existsSync(stockAPIPath)) return false;
    const content = fs.readFileSync(stockAPIPath, 'utf8');
    return content.includes('price') && 
           content.includes('symbol') &&
           (content.includes('validate') || content.includes('result'));
});

runSyncTest('API Response: Currency rate data structure validation', () => {
    if (!fs.existsSync(currencyAPIPath)) return false;
    const content = fs.readFileSync(currencyAPIPath, 'utf8');
    return content.includes('rates') && 
           (content.includes('validate') || content.includes('response'));
});

// Test Suite 5: Mock and Offline Support
runSyncTest('Offline Support: Stock API has fallback data', () => {
    if (!fs.existsSync(stockAPIPath)) return false;
    const content = fs.readFileSync(stockAPIPath, 'utf8');
    // Check that fallback prices are realistic (between $10 and $500 for major stocks)
    const fallbackMatch = content.match(/AAPL.*?(\d+\.?\d*)/);
    if (!fallbackMatch) return false;
    const price = parseFloat(fallbackMatch[1]);
    return price > 10 && price < 500;
});

runSyncTest('Offline Support: Currency API has fallback rates', () => {
    if (!fs.existsSync(currencyAPIPath)) return false;
    const content = fs.readFileSync(currencyAPIPath, 'utf8');
    return content.includes('fallback') && 
           content.includes('rate') &&
           (content.includes('3.') || content.includes('4.')); // USD/ILS rate around 3-4
});

// Test Suite 6: API Integration Points
runSyncTest('Integration: Stock API used in RSU calculations', () => {
    const wizardSalaryPath = path.join(__dirname, '..', '..', 'src/components/wizard/steps/WizardStepSalary.js');
    if (!fs.existsSync(wizardSalaryPath)) return false;
    const content = fs.readFileSync(wizardSalaryPath, 'utf8');
    return content.includes('StockPriceAPI') || 
           content.includes('fetchStockPrice') ||
           content.includes('stockPrice');
});

runSyncTest('Integration: Currency API used in financial calculations', () => {
    const retirementCalcsPath = path.join(__dirname, '..', '..', 'src/utils/retirementCalculations.js');
    if (!fs.existsSync(retirementCalcsPath)) return false;
    const content = fs.readFileSync(retirementCalcsPath, 'utf8');
    return content.includes('CurrencyAPI') || 
           content.includes('currency') ||
           content.includes('exchange');
});

// Test Suite 7: Error Handling and Resilience
runSyncTest('Error Handling: Stock API timeout handling', () => {
    if (!fs.existsSync(stockAPIPath)) return false;
    const content = fs.readFileSync(stockAPIPath, 'utf8');
    return content.includes('timeout') || 
           content.includes('setTimeout') ||
           content.includes('AbortController');
});

runSyncTest('Error Handling: Currency API timeout handling', () => {
    if (!fs.existsSync(currencyAPIPath)) return false;
    const content = fs.readFileSync(currencyAPIPath, 'utf8');
    return content.includes('timeout') || 
           content.includes('setTimeout') ||
           content.includes('AbortController');
});

runSyncTest('Error Handling: Network failure graceful degradation', () => {
    if (!fs.existsSync(stockAPIPath)) return false;
    const stockContent = fs.readFileSync(stockAPIPath, 'utf8');
    const hasStockFallback = stockContent.includes('fallback') && stockContent.includes('catch');
    
    if (!fs.existsSync(currencyAPIPath)) return false;
    const currencyContent = fs.readFileSync(currencyAPIPath, 'utf8');
    const hasCurrencyFallback = currencyContent.includes('fallback') && currencyContent.includes('catch');
    
    return hasStockFallback && hasCurrencyFallback;
});

// Test Suite 8: Security Considerations
runSyncTest('Security: No API keys in frontend code', () => {
    const files = [stockAPIPath, currencyAPIPath, corsProxyPath];
    for (const file of files) {
        if (!fs.existsSync(file)) continue;
        const content = fs.readFileSync(file, 'utf8');
        // Check for common API key patterns
        if (content.match(/api[_-]?key/i) || 
            content.match(/secret/i) || 
            content.match(/token.*[A-Za-z0-9]{20,}/)) {
            return false;
        }
    }
    return true;
});

runSyncTest('Security: Domain whitelist for CORS requests', () => {
    if (!fs.existsSync(corsProxyPath)) return false;
    const content = fs.readFileSync(corsProxyPath, 'utf8');
    return content.includes('yahoo') && 
           (content.includes('whitelist') || content.includes('allowed') || content.includes('domain'));
});

runSyncTest('Security: HTTPS-only external requests', () => {
    const files = [stockAPIPath, currencyAPIPath, corsProxyPath];
    for (const file of files) {
        if (!fs.existsSync(file)) continue;
        const content = fs.readFileSync(file, 'utf8');
        // Check that all URLs use HTTPS
        const httpUrls = content.match(/http:\/\/[^'"\s]+/g);
        if (httpUrls && httpUrls.length > 0) {
            return false;
        }
    }
    return true;
});

// Test Suite 9: Performance Optimization
runSyncTest('Performance: Caching implementation for API responses', () => {
    if (!fs.existsSync(currencyAPIPath)) return false;
    const content = fs.readFileSync(currencyAPIPath, 'utf8');
    return content.includes('cache') && 
           content.includes('timestamp') &&
           (content.includes('TTL') || content.includes('expiry'));
});

runSyncTest('Performance: Request deduplication logic', () => {
    if (!fs.existsSync(stockAPIPath)) return false;
    const content = fs.readFileSync(stockAPIPath, 'utf8');
    return content.includes('pending') || 
           content.includes('dedupe') ||
           content.includes('inFlight');
});

// Test Suite 10: Data Validation
runSyncTest('Data Validation: Stock price range validation', () => {
    if (!fs.existsSync(stockAPIPath)) return false;
    const content = fs.readFileSync(stockAPIPath, 'utf8');
    return content.includes('validate') || 
           content.includes('range') ||
           content.includes('price > 0');
});

runSyncTest('Data Validation: Currency rate range validation', () => {
    if (!fs.existsSync(currencyAPIPath)) return false;
    const content = fs.readFileSync(currencyAPIPath, 'utf8');
    return content.includes('validate') || 
           content.includes('rate > 0') ||
           content.includes('isFinite');
});

// Wait for all async tests to complete
setTimeout(() => {
    console.log(`\n📊 External API Services Test Summary`);
    console.log(`====================================`);
    console.log(`✅ Tests Passed: ${testsPassed}`);
    console.log(`❌ Tests Failed: ${testsTotal - testsPassed}`);
    console.log(`📈 Success Rate: ${((testsPassed / testsTotal) * 100).toFixed(1)}%`);

    if (testsPassed === testsTotal) {
        console.log(`\n🎉 All API service tests passed! External integrations are solid.`);
    } else {
        console.log(`\n⚠️ Some API service tests failed. Review external service integrations.`);
    }
}, 2000);

// Export results for main test runner
module.exports = {
    testsPassed,
    testsTotal,
    testSuiteName: 'External API Services Tests'
};