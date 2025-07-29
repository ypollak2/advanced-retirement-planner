// Test Configuration for Advanced Retirement Planner
// Central configuration for all test suites

module.exports = {
    // Test runner configuration
    runner: {
        parallel: true,
        maxWorkers: 4,
        timeout: 30000, // 30 seconds global timeout
        verbose: process.env.VERBOSE === 'true',
        bail: process.env.CI === 'true', // Stop on first failure in CI
        retries: process.env.CI === 'true' ? 2 : 0
    },

    // Coverage configuration
    coverage: {
        enabled: process.env.COVERAGE !== 'false',
        threshold: {
            global: {
                branches: 70,
                functions: 80,
                lines: 80,
                statements: 80
            },
            './src/utils/': {
                branches: 90,
                functions: 95,
                lines: 95,
                statements: 95
            }
        },
        reporters: ['text', 'html', 'lcov'],
        exclude: [
            'node_modules/**',
            'tests/**',
            'scripts/**',
            '**/*.test.js',
            '**/*.spec.js'
        ]
    },

    // Test categories
    categories: {
        unit: {
            pattern: '**/unit/**/*.test.js',
            timeout: 5000
        },
        integration: {
            pattern: '**/integration/**/*.test.js',
            timeout: 15000
        },
        e2e: {
            pattern: '**/e2e/**/*.test.js',
            timeout: 60000
        },
        performance: {
            pattern: '**/performance/**/*.test.js',
            timeout: 30000
        },
        security: {
            pattern: '**/security/**/*.test.js',
            timeout: 20000
        }
    },

    // Browser testing configuration
    browser: {
        headless: process.env.HEADLESS !== 'false',
        slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0,
        devtools: process.env.DEVTOOLS === 'true',
        viewport: {
            width: 1280,
            height: 720
        },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },

    // Test data configuration
    testData: {
        dataDir: './tests/fixtures',
        seedData: './tests/fixtures/seed.json',
        mockApiResponses: './tests/fixtures/api-mocks.json'
    },

    // Performance benchmarks
    performance: {
        maxLoadTime: 3000, // 3 seconds
        maxScriptCount: 5,
        maxInlineScripts: 5,
        maxMemoryUsage: 50 * 1024 * 1024, // 50MB
        maxDOMNodes: 1500
    },

    // Security test configuration
    security: {
        xssPatterns: [
            '<script>alert("xss")</script>',
            'javascript:alert("xss")',
            '<img src=x onerror=alert("xss")>',
            '<svg onload=alert("xss")>',
            '"><script>alert("xss")</script>'
        ],
        sqlInjectionPatterns: [
            "' OR '1'='1",
            "1; DROP TABLE users",
            "admin'--",
            "1' UNION SELECT NULL--"
        ],
        sensitiveDataPatterns: [
            /api[_-]?key/i,
            /password/i,
            /secret/i,
            /token/i,
            /private[_-]?key/i
        ]
    },

    // Reporting configuration
    reporting: {
        outputDir: './test-results',
        screenshots: {
            enabled: true,
            onFailure: true,
            fullPage: true
        },
        videos: {
            enabled: process.env.RECORD_VIDEOS === 'true',
            codec: 'h264'
        },
        junit: {
            enabled: process.env.CI === 'true',
            outputFile: './test-results/junit.xml'
        }
    },

    // Environment-specific settings
    environments: {
        development: {
            baseUrl: 'http://localhost:8080',
            apiUrl: 'http://localhost:3000/api'
        },
        staging: {
            baseUrl: 'https://staging.advanced-retirement-planner.com',
            apiUrl: 'https://api-staging.advanced-retirement-planner.com'
        },
        production: {
            baseUrl: 'https://ypollak2.github.io/advanced-retirement-planner',
            apiUrl: 'https://api.advanced-retirement-planner.com'
        }
    },

    // Feature flags for testing
    features: {
        testNewCalculationEngine: false,
        testBetaFeatures: false,
        testExperimentalAPIs: false
    },

    // Accessibility testing
    accessibility: {
        standard: 'WCAG2AA',
        ignoreRules: [],
        viewports: [
            { width: 1920, height: 1080, name: 'desktop' },
            { width: 768, height: 1024, name: 'tablet' },
            { width: 375, height: 667, name: 'mobile' }
        ]
    },

    // Localization testing
    localization: {
        locales: ['en', 'he'],
        defaultLocale: 'en',
        rtlLocales: ['he']
    },

    // API mocking configuration
    mocking: {
        enabled: true,
        delay: 100, // ms
        errorRate: 0, // 0-1, percentage of requests that should fail
        slowRequestThreshold: 2000 // ms
    },

    // Test utilities
    utils: {
        waitForTimeout: 30000,
        retryAttempts: 3,
        retryDelay: 1000,
        debugMode: process.env.DEBUG === 'true'
    }
};

// Helper function to get environment-specific config
module.exports.getEnvironmentConfig = function() {
    const env = process.env.TEST_ENV || 'development';
    return this.environments[env] || this.environments.development;
};

// Helper function to get test category config
module.exports.getCategoryConfig = function(category) {
    return this.categories[category] || this.categories.unit;
};