// NETLIFY FIX - Correct deployment configuration
const fs = require('fs');

const fixId = `netlify-fix-${Date.now()}`;
console.log('🔧 NETLIFY FIX ID:', fixId);

// Create correct netlify.toml that doesn't conflict with Vite
const netlifyConfig = `# NETLIFY FIX CONFIGURATION
# Fix ID: ${fixId}
# Timestamp: ${new Date().toISOString()}

[build]
  command = "echo 'NETLIFY FIX ${fixId} - ROOT DIRECTORY DEPLOYMENT'"
  publish = "."
  ignore = "exit 0"

[build.environment]
  NETLIFY_FIX_ID = "${fixId}"
  FORCE_ROOT_DEPLOYMENT = "true"
  NODE_VERSION = "18"

# Disable Vite framework detection
[build.processing]
  skip_processing = false

# Force headers for root directory
[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate, max-age=0"
    Pragma = "no-cache"
    Expires = "0"
    ETag = "${fixId}"
    X-Netlify-Fix = "${fixId}"
    X-Force-Refresh = "true"

[[headers]]
  for = "/index.html"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate, max-age=0"
    Pragma = "no-cache"
    Expires = "0"
    ETag = "${fixId}-html"

[[headers]]
  for = "/src/core/*.js"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate, max-age=0"
    Pragma = "no-cache"  
    Expires = "0"
    ETag = "${fixId}-core"

[[headers]]
  for = "/src/utils/*.js"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate, max-age=0"
    Pragma = "no-cache"
    Expires = "0"
    ETag = "${fixId}-utils"

[[headers]]
  for = "/version.js"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate, max-age=0"
    Pragma = "no-cache"
    Expires = "0"
    ETag = "${fixId}-version"
`;

fs.writeFileSync('netlify.toml', netlifyConfig);

// Update index.html with fix ID
const currentIndex = fs.readFileSync('index.html', 'utf8');
const updatedIndex = currentIndex
    .replace(/emergency-\d+/g, fixId)
    .replace(/Emergency ID: [^<]+/g, `Fix ID: ${fixId}`)
    .replace(/✅ FIXED v4\.11\.0/g, `🔧 NETLIFY FIX v4.11.0`)
    .replace(/EMERGENCY DEPLOYMENT STARTING/g, `NETLIFY FIX STARTING`)
    .replace(/EMERGENCY/g, 'NETLIFY_FIX');

fs.writeFileSync('index.html', updatedIndex);

// Update headers
const simpleHeaders = `# NETLIFY FIX HEADERS
# Fix ID: ${fixId}
# Generated: ${new Date().toISOString()}

/*
  Cache-Control: no-cache, no-store, must-revalidate, max-age=0
  Pragma: no-cache
  Expires: 0
  ETag: "${fixId}"
  X-Netlify-Fix: "${fixId}"
  X-Force-Refresh: "true"

/index.html
  Cache-Control: no-cache, no-store, must-revalidate, max-age=0
  Pragma: no-cache
  Expires: 0
  ETag: "${fixId}-html"

/src/core/*.js
  Cache-Control: no-cache, no-store, must-revalidate, max-age=0
  Pragma: no-cache
  Expires: 0
  ETag: "${fixId}-core"

/src/utils/*.js
  Cache-Control: no-cache, no-store, must-revalidate, max-age=0
  Pragma: no-cache
  Expires: 0
  ETag: "${fixId}-utils"

/version.js
  Cache-Control: no-cache, no-store, must-revalidate, max-age=0
  Pragma: no-cache
  Expires: 0
  ETag: "${fixId}-version"
`;

fs.writeFileSync('_headers', simpleHeaders);

console.log('✅ NETLIFY FIX APPLIED:');
console.log('🔧 Fixed netlify.toml to use root directory');
console.log('📄 Updated index.html with fix ID');
console.log('🔧 Updated _headers with fix ID');
console.log('');
console.log('🎯 This should force Netlify to deploy from root directory!');

module.exports = { fixId };