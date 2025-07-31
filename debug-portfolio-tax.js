#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Debugging Portfolio Tax Calculation in v7.3.6\n');

// Read the retirementCalculations.js file
const calcPath = path.join(__dirname, 'src/utils/retirementCalculations.js');
const calcContent = fs.readFileSync(calcPath, 'utf8');

// Check for tax application in calculateRetirement function
console.log('1️⃣ Checking tax application in calculateRetirement:');
console.log('================================================');

// Look for the personal portfolio initialization
const portfolioInitRegex = /let totalPersonalPortfolio = parseFloat[\s\S]*?(?=let totalCrypto)/;
const portfolioInit = calcContent.match(portfolioInitRegex);

if (portfolioInit) {
    console.log('Found portfolio initialization:');
    console.log(portfolioInit[0]);
    
    // Check if tax is applied
    if (portfolioInit[0].includes('(1 - portfolioTaxRate)')) {
        console.log('✅ Tax IS applied to portfolio principal');
    } else {
        console.log('❌ Tax is NOT applied to portfolio principal');
    }
} else {
    console.log('❌ Could not find portfolio initialization');
}

console.log('\n2️⃣ Checking couple mode tax application:');
console.log('==========================================');

// Look for partner portfolio handling
const partnerRegex = /partnerPersonal = [\s\S]*?(?=\/\/ Extract partner contributions|$)/;
const partnerInit = calcContent.match(partnerRegex);

if (partnerInit) {
    console.log('Found partner portfolio initialization:');
    console.log(partnerInit[0]);
    
    if (partnerInit[0].includes('(1 - partner2TaxRate)')) {
        console.log('✅ Tax IS applied to partner portfolio');
    } else {
        console.log('❌ Tax is NOT applied to partner portfolio');
    }
}

console.log('\n3️⃣ Checking SavingsSummaryPanel tax handling:');
console.log('===============================================');

// Read the SavingsSummaryPanel.js file
const panelPath = path.join(__dirname, 'src/components/panels/summary/SavingsSummaryPanel.js');
const panelContent = fs.readFileSync(panelPath, 'utf8');

// Look for tax rate handling
const taxRateRegex = /portfolioTaxRate.*=.*\(parseFloat.*\|\|.*\)/;
const taxRateMatch = panelContent.match(taxRateRegex);

if (taxRateMatch) {
    console.log('Found tax rate calculation:');
    console.log(taxRateMatch[0]);
    
    if (taxRateMatch[0].includes('/ 100')) {
        console.log('✅ Tax rate is correctly converted from percentage');
    } else {
        console.log('❌ Tax rate may not be converted correctly');
    }
}

console.log('\n4️⃣ Testing calculation logic directly:');
console.log('======================================');

// Simple test of the tax calculation
function testTaxCalculation(gross, taxRate) {
    const taxRateDecimal = taxRate / 100;
    const net = gross * (1 - taxRateDecimal);
    console.log(`Gross: ${gross.toLocaleString()}, Tax: ${taxRate}%, Net: ${net.toLocaleString()}`);
    return net;
}

console.log('Test 1: 1,000,000 with 25% tax');
const result1 = testTaxCalculation(1000000, 25);
console.log(`Expected: 750,000, Calculated: ${result1.toLocaleString()}, ${result1 === 750000 ? '✅' : '❌'}`);

console.log('\nTest 2: 1,000,000 with 30% tax');
const result2 = testTaxCalculation(1000000, 30);
console.log(`Expected: 700,000, Calculated: ${result2.toLocaleString()}, ${result2 === 700000 ? '✅' : '❌'}`);

console.log('\n5️⃣ Checking deployed files:');
console.log('===========================');

// Check if the changes are in the source files
const searchPatterns = [
    'const portfolioTaxRate = (inputs.portfolioTaxRate || 25) / 100',
    'let totalPersonalPortfolio = grossPersonalPortfolio * (1 - portfolioTaxRate)',
    'const partner2TaxRate = (inputs.partner2PortfolioTaxRate || 25) / 100',
    'partnerPersonal = grossPartner2Portfolio * (1 - partner2TaxRate)'
];

searchPatterns.forEach(pattern => {
    if (calcContent.includes(pattern)) {
        console.log(`✅ Found: "${pattern.substring(0, 50)}..."`);
    } else {
        console.log(`❌ NOT Found: "${pattern.substring(0, 50)}..."`);
    }
});

console.log('\n📊 Summary:');
console.log('==========');
console.log('If all checks above show ✅, the fix is properly implemented.');
console.log('If deployment still shows wrong values, check:');
console.log('1. Browser cache (force refresh with Ctrl+Shift+R)');
console.log('2. CDN cache (may take 5-10 minutes to update)');
console.log('3. Service Worker cache (check DevTools > Application > Service Workers)');