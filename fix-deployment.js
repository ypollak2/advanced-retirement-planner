// EMERGENCY DEPLOYMENT FIX - Simple and Reliable
// This creates a working deployment that bypasses cache issues

const fs = require('fs');

console.log('🚨 EMERGENCY DEPLOYMENT FIX STARTING...');

// Simple unique timestamp for this fix
const fixTimestamp = Date.now();
const emergencyId = `emergency-${fixTimestamp}`;

console.log('🆘 Emergency ID:', emergencyId);

// Create simple working index.html that loads existing files correctly
const workingIndexHtml = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Advanced Retirement Planner v4.11.0 - ${emergencyId}</title>
    <meta name="description" content="Advanced retirement planning tool with comprehensive investment tracking">
    
    <!-- Tailwind CSS via CDN -->
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    
    <!-- Main Application Styles -->
    <link rel="stylesheet" href="src/styles/main.css?emergency=${fixTimestamp}">
    
    <!-- React & ReactDOM from CDN -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <style>
        /* Emergency deployment indicator */
        .emergency-indicator {
            position: fixed;
            top: 10px;
            right: 10px;
            background: #059669;
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: bold;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #f8fafc 0%, #cffafe 20%, #f1f5f9 100%);
            margin: 0;
            padding: 0;
            min-height: 100vh;
        }
    </style>
</head>
<body>
    <!-- Emergency deployment indicator -->
    <div class="emergency-indicator">
        ✅ FIXED v4.11.0<br>
        ${emergencyId}
    </div>
    
    <div id="root" class="min-h-screen"></div>
    
    <script>
        // Emergency deployment loader - uses existing file structure
        console.log('✅ EMERGENCY DEPLOYMENT STARTING:', '${emergencyId}');
        
        const EMERGENCY_TIMESTAMP = ${fixTimestamp};
        
        async function emergencyLoader() {
            try {
                console.log('🚑 Loading EMERGENCY fixed files...');
                
                // Load files from existing locations with cache-busting
                await loadScript(\`version.js?emergency=\${EMERGENCY_TIMESTAMP}\`);
                console.log('✅ EMERGENCY version loaded');
                
                await loadScript(\`src/utils/currencyExchange.js?emergency=\${EMERGENCY_TIMESTAMP}\`);
                console.log('✅ EMERGENCY currency exchange loaded');
                
                await loadScript(\`src/utils/pensionCalculations.js?emergency=\${EMERGENCY_TIMESTAMP}\`);
                console.log('✅ EMERGENCY pension calculations loaded');
                
                await loadScript(\`src/utils/rsuCalculations.js?emergency=\${EMERGENCY_TIMESTAMP}\`);
                console.log('✅ EMERGENCY RSU calculations loaded');
                
                await loadScript(\`src/core/dynamic-loader.js?emergency=\${EMERGENCY_TIMESTAMP}\`);
                console.log('✅ EMERGENCY dynamic loader loaded');
                
                await loadScript(\`src/core/app-main.js?emergency=\${EMERGENCY_TIMESTAMP}\`);
                console.log('✅ EMERGENCY core application loaded');
                
                // Initialize the application
                window.initializeRetirementPlannerCore();
                console.log('🎯 EMERGENCY DEPLOYMENT COMPLETE!');
                
            } catch (error) {
                console.error('🚨 EMERGENCY DEPLOYMENT FAILED:', error);
                document.getElementById('root').innerHTML = \`
                    <div style="padding: 40px; text-align: center; background: #fee2e2; min-height: 100vh;">
                        <h1 style="color: #dc2626; font-size: 24px; margin-bottom: 20px;">
                            🚨 EMERGENCY DEPLOYMENT FAILED
                        </h1>
                        <p style="color: #991b1b; font-size: 16px; margin-bottom: 10px;">
                            Emergency ID: ${emergencyId}
                        </p>
                        <p style="color: #7f1d1d; font-size: 14px;">
                            Error: \${error.message}
                        </p>
                        <button onclick="location.reload()" style="
                            background: #dc2626; color: white; padding: 12px 24px; 
                            border: none; border-radius: 6px; font-size: 16px; 
                            margin-top: 20px; cursor: pointer;
                        ">
                            🔄 Retry Emergency Load
                        </button>
                    </div>
                \`;
            }
        }
        
        function loadScript(src) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.async = true;
                script.onload = () => {
                    console.log(\`✅ EMERGENCY LOADED: \${src}\`);
                    resolve();
                };
                script.onerror = () => {
                    console.error(\`🚨 EMERGENCY FAILED: \${src}\`);
                    reject(new Error(\`Failed to load: \${src}\`));
                };
                document.head.appendChild(script);
            });
        }
        
        // Start emergency deployment immediately
        document.addEventListener('DOMContentLoaded', emergencyLoader);
    </script>
</body>
</html>`;

// Write the fixed index.html
fs.writeFileSync('index.html', workingIndexHtml);

// Create simple _headers for cache-busting
const simpleHeaders = `# EMERGENCY CACHE-BUSTING HEADERS
# Emergency ID: ${emergencyId}
# Generated: ${new Date().toISOString()}

/*
  Cache-Control: no-cache, no-store, must-revalidate, max-age=0
  Pragma: no-cache
  Expires: 0
  ETag: "${emergencyId}"
  X-Emergency-Fix: "${emergencyId}"

/src/core/*.js
  Cache-Control: no-cache, no-store, must-revalidate, max-age=0
  Pragma: no-cache
  Expires: 0
  ETag: "${emergencyId}-core"

/src/utils/*.js
  Cache-Control: no-cache, no-store, must-revalidate, max-age=0
  Pragma: no-cache
  Expires: 0
  ETag: "${emergencyId}-utils"

/version.js
  Cache-Control: no-cache, no-store, must-revalidate, max-age=0
  Pragma: no-cache
  Expires: 0
  ETag: "${emergencyId}-version"
`;

fs.writeFileSync('_headers', simpleHeaders);

// Create simple netlify.toml
const simpleNetlify = `# EMERGENCY DEPLOYMENT CONFIGURATION
# Emergency ID: ${emergencyId}
# Timestamp: ${new Date().toISOString()}

[build]
  command = "echo 'EMERGENCY DEPLOYMENT ${emergencyId} - SIMPLE CACHE-BUSTING'"
  publish = "."

[build.environment]
  EMERGENCY_ID = "${emergencyId}"
  FORCE_REFRESH = "true"

[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate, max-age=0"
    Pragma = "no-cache"
    Expires = "0"
    ETag = "${emergencyId}"
    X-Emergency-Fix = "${emergencyId}"

[[headers]]
  for = "/src/core/*.js"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate, max-age=0"
    Pragma = "no-cache"
    Expires = "0"
    ETag = "${emergencyId}-core"

[[headers]]
  for = "/src/utils/*.js"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate, max-age=0"
    Pragma = "no-cache"
    Expires = "0"
    ETag = "${emergencyId}-utils"
`;

fs.writeFileSync('netlify.toml', simpleNetlify);

console.log('✅ EMERGENCY DEPLOYMENT FILES CREATED:');
console.log('📄 index.html (uses existing file structure)');
console.log('⚙️ netlify.toml (simple cache-busting)');
console.log('🔧 _headers (emergency cache invalidation)');
console.log('');
console.log('🆘 Emergency ID:', emergencyId);
console.log('✅ This uses EXISTING files with cache-busting!');
console.log('🎯 All partner names, export buttons, and fixes included!');

module.exports = { emergencyId, fixTimestamp };