#!/usr/bin/env node

/**
 * Deployment Validation Script
 * This script MUST be run after every deployment to ensure the latest version is actually being served
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Get URLs based on environment
const getDeploymentUrls = () => {
    const baseUrls = [
        'https://ypollak2.github.io/advanced-retirement-planner', // Production
        'https://advanced-pension-planner.netlify.app'           // Production Mirror
    ];
    
    // Add stage URL if testing stage environment
    if (process.env.DEPLOY_ENV === 'stage' || process.argv.includes('--stage')) {
        baseUrls.unshift('https://ypollak2.github.io/advanced-retirement-planner/stage/'); // Stage
    }
    
    return baseUrls;
};

const DEPLOYMENT_URLS = getDeploymentUrls();

const CRITICAL_FILES = [
    '/version.json',
    '/index.html',
    '/src/components/core/RetirementPlannerApp.js',
    '/src/components/core/Dashboard.js'
];

async function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data }));
        }).on('error', reject);
    });
}

async function validateDeployment() {
    console.log('🚀 DEPLOYMENT VALIDATION STARTING...\n');
    
    // Get local version
    const localVersion = JSON.parse(fs.readFileSync('version.json', 'utf8')).version;
    console.log(`📋 Local Version: ${localVersion}\n`);
    
    let allPassed = true;
    
    for (const baseUrl of DEPLOYMENT_URLS) {
        console.log(`\n🌐 Checking ${baseUrl}...`);
        console.log('═'.repeat(50));
        
        // Check version.json
        try {
            const versionRes = await fetchUrl(`${baseUrl}/version.json`);
            const deployedVersion = JSON.parse(versionRes.data).version;
            
            if (deployedVersion === localVersion) {
                console.log(`✅ Version Match: ${deployedVersion}`);
            } else {
                console.log(`❌ VERSION MISMATCH! Deployed: ${deployedVersion}, Expected: ${localVersion}`);
                allPassed = false;
            }
        } catch (e) {
            console.log(`❌ Failed to fetch version.json: ${e.message}`);
            allPassed = false;
        }
        
        // Check cache busting in index.html
        try {
            const indexRes = await fetchUrl(`${baseUrl}/index.html`);
            const indexContent = indexRes.data;
            
            // Check if cache busting parameters match version
            const cacheBustingRegex = /\?v=(\d+\.\d+\.\d+)/g;
            const matches = [...indexContent.matchAll(cacheBustingRegex)];
            const wrongVersions = matches.filter(m => m[1] !== localVersion);
            
            if (wrongVersions.length === 0) {
                console.log(`✅ Cache Busting: All JS files use v=${localVersion}`);
            } else {
                console.log(`❌ CACHE BUSTING ERROR! Found ${wrongVersions.length} files with wrong version`);
                wrongVersions.slice(0, 5).forEach(m => {
                    console.log(`   - Found v=${m[1]} instead of v=${localVersion}`);
                });
                allPassed = false;
            }
            
            // Check critical navigation fixes
            const hasBackNav = indexContent.includes('src/components/core/RetirementPlannerApp.js?v=' + localVersion);
            if (hasBackNav) {
                console.log(`✅ Critical Component: RetirementPlannerApp.js loaded with correct version`);
            } else {
                console.log(`❌ Critical Component: RetirementPlannerApp.js not loaded with v=${localVersion}`);
                allPassed = false;
            }
        } catch (e) {
            console.log(`❌ Failed to validate index.html: ${e.message}`);
            allPassed = false;
        }
        
        // Check if navigation fixes are present
        try {
            const appRes = await fetchUrl(`${baseUrl}/src/components/core/RetirementPlannerApp.js`);
            const appContent = appRes.data;
            
            const hasBackNavigation = appContent.includes('back-nav');
            const hasFallbacks = appContent.includes('scenario-fallback');
            
            if (hasBackNavigation && hasFallbacks) {
                console.log(`✅ Navigation Fixes: Back buttons and fallbacks present`);
            } else {
                console.log(`❌ NAVIGATION FIXES MISSING!`);
                if (!hasBackNavigation) console.log(`   - Missing back-nav buttons`);
                if (!hasFallbacks) console.log(`   - Missing fallback components`);
                allPassed = false;
            }
        } catch (e) {
            console.log(`❌ Failed to check navigation fixes: ${e.message}`);
            allPassed = false;
        }
        
        // Browser cache test
        console.log(`\n💡 Browser Cache Test:`);
        console.log(`   Visit: ${baseUrl}?nocache=${Date.now()}`);
        console.log(`   Then check version indicator shows: v${localVersion}`);
    }
    
    console.log('\n' + '═'.repeat(50));
    
    if (allPassed) {
        console.log('✅ DEPLOYMENT VALIDATION PASSED!\n');
        process.exit(0);
    } else {
        console.log('❌ DEPLOYMENT VALIDATION FAILED!\n');
        console.log('🔧 REQUIRED ACTIONS:');
        console.log('1. Run: node update-version.js ' + localVersion);
        console.log('2. Ensure all cache busting parameters are updated');
        console.log('3. Clear CDN cache if needed');
        console.log('4. Wait 5-10 minutes for propagation');
        console.log('5. Run this validation again\n');
        process.exit(1);
    }
}

// Add to pre-push hook
if (process.argv[2] === '--add-to-git-hooks') {
    const hookContent = `#!/bin/sh
# Pre-push hook to validate deployment

echo "🚀 Running deployment validation..."
node scripts/validate-deployment.js

if [ $? -ne 0 ]; then
    echo "❌ Deployment validation failed. Push aborted."
    exit 1
fi
`;
    
    fs.writeFileSync('.git/hooks/pre-push', hookContent, { mode: 0o755 });
    console.log('✅ Added deployment validation to git pre-push hook');
    process.exit(0);
}

// Run validation
validateDeployment().catch(console.error);