// Force deployment script - Aggressive cache busting for Netlify
// This script will generate a unique deployment timestamp and update all cache-sensitive files

const fs = require('fs');
const path = require('path');

// Generate unique deployment ID
const deploymentId = `deploy-${Date.now()}`;
const buildTimestamp = new Date().toISOString();

console.log(`🚀 Starting force deployment: ${deploymentId}`);
console.log(`📅 Build timestamp: ${buildTimestamp}`);

// Files to update with new cache-busting parameters
const filesToUpdate = [
    'index.html',
    '_headers',
    'netlify.toml'
];

// Create deployment manifest
const deploymentManifest = {
    deploymentId,
    buildTimestamp,
    version: '4.10.5',
    cacheVersion: deploymentId,
    files: {
        'version.js': `version.js?v=4.10.5&cache=${deploymentId}`,
        'app-main.js': `src/core/app-main.js?v=4.10.5&cache=${deploymentId}`,
        'dynamic-loader.js': `src/core/dynamic-loader.js?v=4.10.5&cache=${deploymentId}`,
        'currencyExchange.js': `src/utils/currencyExchange.js?v=4.10.5&cache=${deploymentId}`,
        'pensionCalculations.js': `src/utils/pensionCalculations.js?v=4.10.5&cache=${deploymentId}`,
        'rsuCalculations.js': `src/utils/rsuCalculations.js?v=4.10.5&cache=${deploymentId}`,
        'main.css': `src/styles/main.css?v=4.10.5&cache=${deploymentId}`
    }
};

// Write deployment manifest
fs.writeFileSync('deployment-manifest.json', JSON.stringify(deploymentManifest, null, 2));

// Update _headers file with more aggressive cache control
const headersContent = `# Force no-cache headers for v4.10.5 deployment ${deploymentId}
# Generated on: ${buildTimestamp}

/*
  Cache-Control: no-cache, no-store, must-revalidate, max-age=0
  Pragma: no-cache
  Expires: 0
  ETag: "${deploymentId}"
  Last-Modified: ${new Date().toUTCString()}

/src/core/*.js
  Cache-Control: no-cache, no-store, must-revalidate, max-age=0
  Pragma: no-cache
  Expires: 0
  ETag: "${deploymentId}-core"

/src/utils/*.js
  Cache-Control: no-cache, no-store, must-revalidate, max-age=0
  Pragma: no-cache
  Expires: 0
  ETag: "${deploymentId}-utils"

/src/styles/*.css
  Cache-Control: no-cache, no-store, must-revalidate, max-age=0
  Pragma: no-cache
  Expires: 0
  ETag: "${deploymentId}-styles"

/version.js
  Cache-Control: no-cache, no-store, must-revalidate, max-age=0
  Pragma: no-cache
  Expires: 0
  ETag: "${deploymentId}-version"

/index.html
  Cache-Control: no-cache, no-store, must-revalidate, max-age=0
  Pragma: no-cache
  Expires: 0
  ETag: "${deploymentId}-html"
`;

fs.writeFileSync('_headers', headersContent);

// Update netlify.toml with force rebuild settings
const netlifyTomlContent = `# Advanced Retirement Planner Netlify Configuration
# Deployment ID: ${deploymentId}
# Build timestamp: ${buildTimestamp}

[build]
  command = "echo 'Force deploying Advanced Retirement Planner v4.10.5 - ${deploymentId}'"
  publish = "."

[build.environment]
  DEPLOYMENT_ID = "${deploymentId}"
  BUILD_TIMESTAMP = "${buildTimestamp}"
  FORCE_REBUILD = "true"

[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate, max-age=0"
    Pragma = "no-cache"
    Expires = "0"
    ETag = "${deploymentId}"

[[headers]]
  for = "/src/core/*.js"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate, max-age=0"
    Pragma = "no-cache"
    Expires = "0"
    ETag = "${deploymentId}-core"

[[headers]]
  for = "/src/utils/*.js"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate, max-age=0"
    Pragma = "no-cache"
    Expires = "0"
    ETag = "${deploymentId}-utils"

[[headers]]
  for = "/src/styles/*.css"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate, max-age=0"
    Pragma = "no-cache"
    Expires = "0"
    ETag = "${deploymentId}-styles"

[[headers]]
  for = "/version.js"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate, max-age=0"
    Pragma = "no-cache"
    Expires = "0"
    ETag = "${deploymentId}-version"

# Redirect rules
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

# Security headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
`;

fs.writeFileSync('netlify.toml', netlifyTomlContent);

console.log('✅ Updated _headers with deployment ID:', deploymentId);
console.log('✅ Updated netlify.toml with force rebuild settings');
console.log('✅ Created deployment manifest');

console.log('\n🚀 Force deployment complete!');
console.log('📋 Next steps:');
console.log('1. Commit these changes');
console.log('2. Push to trigger Netlify rebuild');
console.log('3. Verify deployment with new cache-busting parameters');

module.exports = { deploymentId, buildTimestamp, deploymentManifest };