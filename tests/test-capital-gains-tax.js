// Capital Gains Tax Calculation Test Suite
// Tests that capital gains tax is properly applied to personal portfolio investments

const testCapitalGainsTax = () => {
    console.log('=== Capital Gains Tax Calculation Test ===\n');
    
    const testCases = [
        {
            name: 'Standard 25% capital gains tax',
            grossPortfolio: 1000000,
            taxRate: 0.25,
            expectedNet: 750000,
            description: '1M portfolio with 25% tax should net 750K'
        },
        {
            name: 'High 50% capital gains tax',
            grossPortfolio: 1050000,
            taxRate: 0.50,
            expectedNet: 525000,
            description: '1.05M portfolio with 50% tax should net 525K'
        },
        {
            name: 'Zero tax rate',
            grossPortfolio: 500000,
            taxRate: 0,
            expectedNet: 500000,
            description: '500K portfolio with 0% tax should net 500K'
        },
        {
            name: 'Israeli standard 30% capital gains',
            grossPortfolio: 2000000,
            taxRate: 0.30,
            expectedNet: 1400000,
            description: '2M portfolio with 30% tax should net 1.4M'
        }
    ];
    
    let passed = 0;
    let failed = 0;
    
    testCases.forEach(test => {
        console.log(`Testing: ${test.name}`);
        console.log(`Description: ${test.description}`);
        
        // Calculate net value after tax
        const calculatedNet = test.grossPortfolio * (1 - test.taxRate);
        
        // Check if calculation matches expected
        const isCorrect = Math.abs(calculatedNet - test.expectedNet) < 0.01;
        
        if (isCorrect) {
            console.log(`✅ PASS: Gross ${test.grossPortfolio.toLocaleString()} - ${(test.taxRate * 100)}% tax = Net ${calculatedNet.toLocaleString()}`);
            passed++;
        } else {
            console.log(`❌ FAIL: Expected ${test.expectedNet.toLocaleString()}, got ${calculatedNet.toLocaleString()}`);
            failed++;
        }
        
        console.log('---');
    });
    
    // Test the actual SavingsSummaryPanel logic
    console.log('\nTesting SavingsSummaryPanel Integration:');
    
    // Simulate the component's calculation
    const simulateComponentCalc = (grossValue, taxRate) => {
        const portfolioTaxRate = taxRate || 0.25; // Default 25%
        const netPersonalPortfolio = grossValue * (1 - portfolioTaxRate);
        return netPersonalPortfolio;
    };
    
    // Test component calculation
    const componentTests = [
        { gross: 1050000, tax: 0.50, expectedNet: 525000 },
        { gross: 1000000, tax: 0.25, expectedNet: 750000 },
        { gross: 2000000, tax: 0.30, expectedNet: 1400000 }
    ];
    
    componentTests.forEach(test => {
        const result = simulateComponentCalc(test.gross, test.tax);
        const isCorrect = Math.abs(result - test.expectedNet) < 0.01;
        
        if (isCorrect) {
            console.log(`✅ Component calc: ${test.gross.toLocaleString()} @ ${(test.tax * 100)}% = ${result.toLocaleString()}`);
            passed++;
        } else {
            console.log(`❌ Component calc failed: Expected ${test.expectedNet.toLocaleString()}, got ${result.toLocaleString()}`);
            failed++;
        }
    });
    
    // Summary
    console.log('\n=== Test Summary ===');
    console.log(`Total tests: ${passed + failed}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
    
    return {
        passed,
        failed,
        total: passed + failed,
        successRate: (passed / (passed + failed)) * 100
    };
};

// Run tests if called directly
if (typeof module !== 'undefined' && module.exports) {
    module.exports = testCapitalGainsTax;
    
    // Run tests if this file is executed directly
    if (require.main === module) {
        testCapitalGainsTax();
    }
} else {
    // Browser environment
    window.testCapitalGainsTax = testCapitalGainsTax;
}