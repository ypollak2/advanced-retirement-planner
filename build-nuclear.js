// NUCLEAR CACHE-BUSTING BUILD SCRIPT
// This completely bypasses Netlify caching by using different file paths

const fs = require('fs');
const path = require('path');

const NUCLEAR_ID = `nuclear-${Date.now()}`;
const BUILD_VERSION = '4.10.5';

console.log(`🚀 NUCLEAR DEPLOYMENT: ${NUCLEAR_ID}`);

// Create new index.html with completely different file paths
const indexContent = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Advanced Retirement Planner v${BUILD_VERSION} - ${NUCLEAR_ID}</title>
    <meta name="description" content="Advanced retirement planning tool - NUCLEAR DEPLOYMENT ${NUCLEAR_ID}">
    
    <!-- Tailwind CSS via CDN -->
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    
    <!-- NUCLEAR CSS - Completely new path -->
    <link rel="stylesheet" href="build/v${BUILD_VERSION}/styles/main-${NUCLEAR_ID}.css?nuclear=${Date.now()}">
    
    <!-- React & ReactDOM from CDN -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <style>
        /* NUCLEAR CACHE BUSTER - INLINE CSS */
        body { 
            font-family: 'Inter', sans-serif; 
            background: linear-gradient(135deg, #f8fafc 0%, #cffafe 20%, #f1f5f9 100%);
            margin: 0;
            padding: 0;
            min-height: 100vh;
        }
        .nuclear-indicator {
            position: fixed;
            top: 10px;
            right: 10px;
            background: #ef4444;
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: bold;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
    </style>
</head>
<body>
    <!-- NUCLEAR DEPLOYMENT INDICATOR -->
    <div class="nuclear-indicator">
        🚀 NUCLEAR v${BUILD_VERSION}<br>
        ${NUCLEAR_ID}
    </div>
    
    <div id="root" class="min-h-screen"></div>
    
    <script>
        // NUCLEAR DEPLOYMENT LOADER
        console.log('🚀 NUCLEAR DEPLOYMENT STARTING:', '${NUCLEAR_ID}');
        
        const NUCLEAR_TIMESTAMP = Date.now();
        
        async function nuclearLoader() {
            try {
                console.log('💥 Loading NUCLEAR version files...');
                
                // Load with completely new file paths
                await loadScript(\`build/v${BUILD_VERSION}/version-${NUCLEAR_ID}.js?nuclear=\${NUCLEAR_TIMESTAMP}\`);
                console.log('✅ NUCLEAR version loaded');
                
                await loadScript(\`build/v${BUILD_VERSION}/utils/currencyExchange.js?nuclear=\${NUCLEAR_TIMESTAMP}\`);
                console.log('✅ NUCLEAR currency exchange loaded');
                
                await loadScript(\`build/v${BUILD_VERSION}/utils/pensionCalculations.js?nuclear=\${NUCLEAR_TIMESTAMP}\`);
                console.log('✅ NUCLEAR pension calculations loaded');
                
                await loadScript(\`build/v${BUILD_VERSION}/utils/rsuCalculations.js?nuclear=\${NUCLEAR_TIMESTAMP}\`);
                console.log('✅ NUCLEAR RSU calculations loaded');
                
                await loadScript(\`build/v${BUILD_VERSION}/core/app-main-${NUCLEAR_ID}.js?nuclear=\${NUCLEAR_TIMESTAMP}\`);
                console.log('✅ NUCLEAR core application loaded');
                
                // Initialize with nuclear indicator
                window.initializeRetirementPlannerCore();
                console.log('🎯 NUCLEAR DEPLOYMENT COMPLETE!');
                
            } catch (error) {
                console.error('💥 NUCLEAR DEPLOYMENT FAILED:', error);
                document.getElementById('root').innerHTML = \`
                    <div style="padding: 40px; text-align: center; background: #fee2e2; min-height: 100vh;">
                        <h1 style="color: #dc2626; font-size: 24px; margin-bottom: 20px;">
                            💥 NUCLEAR DEPLOYMENT FAILED
                        </h1>
                        <p style="color: #991b1b; font-size: 16px; margin-bottom: 10px;">
                            Nuclear ID: ${NUCLEAR_ID}
                        </p>
                        <p style="color: #7f1d1d; font-size: 14px;">
                            Error: \${error.message}
                        </p>
                        <button onclick="location.reload()" style="
                            background: #dc2626; color: white; padding: 12px 24px; 
                            border: none; border-radius: 6px; font-size: 16px; 
                            margin-top: 20px; cursor: pointer;
                        ">
                            🔄 Retry Nuclear Load
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
                    console.log(\`✅ NUCLEAR LOADED: \${src}\`);
                    resolve();
                };
                script.onerror = () => {
                    console.error(\`💥 NUCLEAR FAILED: \${src}\`);
                    reject(new Error(\`Failed to load: \${src}\`));
                };
                document.head.appendChild(script);
            });
        }
        
        // Start nuclear deployment
        document.addEventListener('DOMContentLoaded', nuclearLoader);
    </script>
</body>
</html>`;

// Write nuclear index.html
fs.writeFileSync('index-nuclear.html', indexContent);

// Create nuclear netlify.toml
const netlifyConfig = `# NUCLEAR DEPLOYMENT CONFIGURATION
# Nuclear ID: ${NUCLEAR_ID}
# Timestamp: ${new Date().toISOString()}

[build]
  command = "echo 'NUCLEAR DEPLOYMENT ${NUCLEAR_ID} - BYPASSING ALL CACHE'"
  publish = "."

[build.environment]
  NUCLEAR_ID = "${NUCLEAR_ID}"
  FORCE_NUCLEAR = "true"
  BUILD_VERSION = "${BUILD_VERSION}"

[[redirects]]
  from = "/"
  to = "/index-nuclear.html"
  status = 200
  force = true

[[redirects]]
  from = "/index.html"
  to = "/index-nuclear.html"
  status = 301
  force = true

[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate, max-age=0"
    Pragma = "no-cache"
    Expires = "0"
    ETag = "${NUCLEAR_ID}"
    X-Nuclear-Deployment = "${NUCLEAR_ID}"

[[headers]]
  for = "/build/v${BUILD_VERSION}/*"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate, max-age=0"
    Pragma = "no-cache"
    Expires = "0"
    ETag = "${NUCLEAR_ID}-build"
    X-Nuclear-Files = "true"
`;

fs.writeFileSync('netlify-nuclear.toml', netlifyConfig);

// Create nuclear _headers
const headersConfig = `# NUCLEAR CACHE-BUSTING HEADERS
# Nuclear ID: ${NUCLEAR_ID}
# Generated: ${new Date().toISOString()}

/*
  Cache-Control: no-cache, no-store, must-revalidate, max-age=0
  Pragma: no-cache
  Expires: 0
  ETag: "${NUCLEAR_ID}"
  X-Nuclear-Deployment: "${NUCLEAR_ID}"
  X-Force-Refresh: "true"

/build/v${BUILD_VERSION}/*
  Cache-Control: no-cache, no-store, must-revalidate, max-age=0
  Pragma: no-cache
  Expires: 0
  ETag: "${NUCLEAR_ID}-build"
  X-Nuclear-Files: "true"

/index-nuclear.html
  Cache-Control: no-cache, no-store, must-revalidate, max-age=0
  Pragma: no-cache
  Expires: 0
  ETag: "${NUCLEAR_ID}-html"
  X-Nuclear-HTML: "true"
`;

fs.writeFileSync('_headers-nuclear', headersConfig);

console.log(`✅ NUCLEAR DEPLOYMENT FILES CREATED:`);
console.log(`📄 index-nuclear.html`);
console.log(`⚙️ netlify-nuclear.toml`);
console.log(`🔧 _headers-nuclear`);
console.log(`📁 build/v${BUILD_VERSION}/ directory`);
console.log(``);
console.log(`🚀 NUCLEAR ID: ${NUCLEAR_ID}`);
console.log(`🎯 This will FORCE Netlify to serve fresh content!`);