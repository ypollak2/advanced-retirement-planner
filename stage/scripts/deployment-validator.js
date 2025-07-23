#!/usr/bin/env node
// Deployment Validation Script
// Created by Yali Pollak (יהלי פולק) - v6.2.0

const https = require('https');
const fs = require('fs');

console.log('🚀 Deployment Validation Starting...\n');

const deploymentUrls = [
    'https://ypollak2.github.io/advanced-retirement-planner/',
    'https://advanced-pension-planner.netlify.app/'
];

let validationErrors = [];
let validationWarnings = [];

// Test URL accessibility and basic functionality
async function validateDeployment(url) {
    console.log(`🌐 Validating: ${url}`);
    
    return new Promise((resolve) => {
        const request = https.get(url, (response) => {
            let data = '';
            
            response.on('data', (chunk) => {
                data += chunk;
            });
            
            response.on('end', () => {
                const results = {
                    url,
                    status: response.statusCode,
                    accessible: response.statusCode === 200,
                    hasTitle: data.includes('<title>Advanced Retirement Planner'),
                    hasVersionIndicator: data.includes('version-indicator'),
                    hasReactApp: data.includes('RetirementPlannerApp'),
                    hasServiceWorker: false,
                    serviceWorkerError: null
                };
                
                // Test service worker separately
                const swUrl = url + 'sw.js';
                https.get(swUrl, (swResponse) => {
                    results.hasServiceWorker = swResponse.statusCode === 200;
                    if (swResponse.statusCode !== 200) {
                        results.serviceWorkerError = `Service Worker 404: ${swUrl}`;
                    }
                    resolve(results);
                }).on('error', () => {
                    results.serviceWorkerError = `Service Worker fetch failed: ${swUrl}`;
                    resolve(results);
                });
            });
        });
        
        request.on('error', (error) => {
            resolve({
                url,
                accessible: false,
                error: error.message
            });
        });
        
        request.setTimeout(10000, () => {
            request.destroy();
            resolve({
                url,
                accessible: false,
                error: 'Timeout'
            });
        });
    });
}

// Validate all deployments
async function runValidation() {
    const results = await Promise.all(
        deploymentUrls.map(url => validateDeployment(url))
    );
    
    console.log('\n📊 DEPLOYMENT VALIDATION RESULTS');
    console.log('='.repeat(50));
    
    results.forEach(result => {
        console.log(`\n🌐 ${result.url}`);
        
        if (!result.accessible) {
            validationErrors.push(`❌ ${result.url} - Not accessible: ${result.error || 'Unknown error'}`);
            console.log(`  ❌ Status: NOT ACCESSIBLE (${result.error || 'Unknown error'})`);
            return;
        }
        
        console.log(`  ✅ Status: ${result.status} (Accessible)`);
        
        // Check key components
        if (result.hasTitle) {
            console.log('  ✅ Title: Present');
        } else {
            validationErrors.push(`❌ ${result.url} - Missing title`);
            console.log('  ❌ Title: Missing');
        }
        
        if (result.hasVersionIndicator) {
            console.log('  ✅ Version Indicator: Present');
        } else {
            validationWarnings.push(`⚠️ ${result.url} - Missing version indicator`);
            console.log('  ⚠️ Version Indicator: Missing');
        }
        
        if (result.hasReactApp) {
            console.log('  ✅ React App: Present');
        } else {
            validationErrors.push(`❌ ${result.url} - Missing React app`);
            console.log('  ❌ React App: Missing');
        }
        
        if (result.hasServiceWorker) {
            console.log('  ✅ Service Worker: Available');
        } else {
            validationWarnings.push(`⚠️ ${result.url} - Service Worker unavailable: ${result.serviceWorkerError}`);
            console.log(`  ⚠️ Service Worker: ${result.serviceWorkerError}`);
        }
    });
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 VALIDATION SUMMARY');
    console.log('='.repeat(50));
    
    if (validationErrors.length > 0) {
        console.log('\n❌ CRITICAL DEPLOYMENT ERRORS:');
        validationErrors.forEach(error => console.log(error));
    }
    
    if (validationWarnings.length > 0) {
        console.log('\n⚠️ DEPLOYMENT WARNINGS:');
        validationWarnings.forEach(warning => console.log(warning));
    }
    
    if (validationErrors.length === 0) {
        console.log('\n✅ DEPLOYMENT VALIDATION PASSED');
        if (validationWarnings.length > 0) {
            console.log('⚠️ Please review warnings above');
        }
    } else {
        console.log('\n🚫 DEPLOYMENT VALIDATION FAILED');
        console.log('Please fix critical errors before considering deployment complete');
    }
}

// Generate deployment report
function generateReport() {
    const report = {
        timestamp: new Date().toISOString(),
        validationErrors: validationErrors.length,
        validationWarnings: validationWarnings.length,
        urls: deploymentUrls,
        details: {
            errors: validationErrors,
            warnings: validationWarnings
        }
    };
    
    fs.writeFileSync('deployment-validation-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Report saved: deployment-validation-report.json');
}

// Run validation
runValidation().then(() => {
    generateReport();
}).catch(error => {
    console.error('❌ Validation failed:', error);
    process.exit(1);
});