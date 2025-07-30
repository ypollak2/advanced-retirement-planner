#!/usr/bin/env node

/**
 * Comprehensive Version Update Script
 * 
 * This script AUTOMATICALLY updates ALL version references when bumping versions
 * to prevent cache busting and deployment issues.
 * 
 * Usage:
 *   node scripts/update-version.js 6.5.2
 *   npm run version:update 6.5.2
 */

const fs = require('fs');
const path = require('path');

const VERSION_FILES = [
    // Core version files
    {
        file: 'package.json',
        pattern: /"version":\s*"[^"]*"/,
        replacement: newVersion => `"version": "${newVersion}"`
    },
    {
        file: 'version.json',
        pattern: /"version":\s*"[^"]*"/,
        replacement: newVersion => `"version": "${newVersion}"`
    },
    {
        file: 'src/version.js',
        patterns: [
            {
                pattern: /number:\s*"[^"]*"/,
                replacement: newVersion => `number: "${newVersion}"`
            },
            {
                pattern: /commit:\s*"[^"]*"/,
                replacement: newVersion => `commit: "v${newVersion}-version-update"`
            }
        ]
    },
    {
        file: 'README.md',
        patterns: [
            {
                pattern: /# 🚀 Advanced Retirement Planner v[^\s]* ✨/,
                replacement: newVersion => `# 🚀 Advanced Retirement Planner v${newVersion} ✨`
            },
            {
                pattern: /version-[\d.]+-blue/,
                replacement: newVersion => `version-${newVersion}-blue`
            }
        ]
    },
    {
        file: 'index.html',
        patterns: [
            // Title tag
            {
                pattern: /<title>Advanced Retirement Planner v[^<]*<\/title>/,
                replacement: newVersion => `<title>Advanced Retirement Planner v${newVersion}</title>`
            },
            // All cache busting parameters
            {
                pattern: /\?v=[\d.]+/g,
                replacement: newVersion => `?v=${newVersion}`
            },
            // Fallback version in JavaScript
            {
                pattern: /window\.APP_VERSION\s*=\s*['"][^'"]*['"]/,
                replacement: newVersion => `window.APP_VERSION = '${newVersion}'`
            },
            {
                pattern: /textContent\s*=\s*['"]✨ v[^'"]*['"]/,
                replacement: newVersion => `textContent = '✨ v${newVersion}'`
            }
        ]
    },
    
    // Service Worker and caching files
    {
        file: 'sw.js',
        patterns: [
            {
                pattern: /retirement-planner-v[\d.]+/g,
                replacement: newVersion => `retirement-planner-v${newVersion}`
            },
            {
                pattern: /retirement-planner-static-v[\d.]+/g,
                replacement: newVersion => `retirement-planner-static-v${newVersion}`
            },
            {
                pattern: /retirement-planner-dynamic-v[\d.]+/g,
                replacement: newVersion => `retirement-planner-dynamic-v${newVersion}`
            },
            {
                pattern: /Created by Yali Pollak.*- v[\d.]+/,
                replacement: newVersion => `Created by Yali Pollak (יהלי פולק) - v${newVersion}`
            }
        ]
    },
    {
        file: 'src/utils/robustLocalStorage.js',
        patterns: [
            {
                pattern: /version:\s*'[\d.]+'/g,
                replacement: newVersion => `version: '${newVersion}'`
            },
            {
                pattern: /window\.APP_VERSION\s*=\s*'[\d.]+'/,
                replacement: newVersion => `window.APP_VERSION = '${newVersion}'`
            }
        ]
    },
    
    // Component fallback versions (Critical - caused footer issue)
    {
        file: 'src/components/core/RetirementPlannerApp.js',
        patterns: [
            {
                pattern: /:\s*'v[\d.]+'\)/,
                replacement: newVersion => `: 'v${newVersion}')`
            },
            {
                pattern: /Created by Yali Pollak.*- v[\d.]+/,
                replacement: newVersion => `Created by Yali Pollak (יהלי פולק) - v${newVersion}`
            }
        ]
    },
    {
        file: 'src/utils/exportFunctions.js',
        patterns: [
            {
                pattern: /version:\s*'v[\d.]+'/,
                replacement: newVersion => `version: 'v${newVersion}'`
            },
            {
                pattern: /Created by Yali Pollak.*- v[\d.]+/,
                replacement: newVersion => `Created by Yali Pollak (יהלי פולק) - v${newVersion}`
            }
        ]
    },
    
    // Console messages and logging
    {
        file: 'src/utils/currencyAPI.js',
        patterns: [
            {
                pattern: /console\.log\('CurrencyAPI v[\d.]+ loaded successfully'\)/,
                replacement: newVersion => `console.log('CurrencyAPI v${newVersion} loaded successfully')`
            },
            {
                pattern: /Created by Yali Pollak.*- v[\d.]+/,
                replacement: newVersion => `Created by Yali Pollak (יהלי פולק) - v${newVersion}`
            }
        ]
    },
    
    // Design and utility files
    {
        file: 'src/utils/designEvaluator.js',
        patterns: [
            {
                pattern: /Advanced Retirement Planner v[\d.]+/,
                replacement: newVersion => `Advanced Retirement Planner v${newVersion}`
            },
            {
                pattern: /Created by Yali Pollak.*- v[\d.]+/,
                replacement: newVersion => `Created by Yali Pollak (יהלי פולק) - v${newVersion}`
            }
        ]
    }
];

function updateVersion(newVersion) {
    if (!newVersion) {
        console.error('❌ Version required: node scripts/update-version.js <version>');
        process.exit(1);
    }

    // Validate version format
    if (!/^\d+\.\d+\.\d+$/.test(newVersion)) {
        console.error('❌ Invalid version format. Use: X.Y.Z (e.g., 6.5.2)');
        process.exit(1);
    }

    console.log(`🚀 UPDATING ALL VERSION REFERENCES TO v${newVersion}\n`);
    
    let updatedFiles = 0;
    let totalReplacements = 0;

    VERSION_FILES.forEach(fileConfig => {
        const filePath = fileConfig.file;
        
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️  File not found: ${filePath} (skipping)`);
            return;
        }

        let content = fs.readFileSync(filePath, 'utf8');
        let fileReplacements = 0;

        // Handle single pattern files
        if (fileConfig.pattern) {
            const oldContent = content;
            content = content.replace(fileConfig.pattern, fileConfig.replacement(newVersion));
            if (content !== oldContent) {
                fileReplacements++;
                console.log(`✅ Updated: ${filePath} (${fileConfig.pattern.toString()})`);
            }
        }

        // Handle multiple patterns files (like index.html)
        if (fileConfig.patterns) {
            fileConfig.patterns.forEach(patternConfig => {
                const oldContent = content;
                
                if (patternConfig.pattern.global) {
                    // Handle global patterns (like cache busting)
                    const matches = content.match(patternConfig.pattern);
                    if (matches) {
                        content = content.replace(patternConfig.pattern, patternConfig.replacement(newVersion));
                        fileReplacements += matches.length;
                        console.log(`✅ Updated: ${filePath} - ${matches.length} cache busting parameters`);
                    }
                } else {
                    // Handle single patterns
                    content = content.replace(patternConfig.pattern, patternConfig.replacement(newVersion));
                    if (content !== oldContent) {
                        fileReplacements++;
                        console.log(`✅ Updated: ${filePath} (${patternConfig.pattern.toString()})`);
                    }
                }
            });
        }

        // Write back to file if changes were made
        if (fileReplacements > 0) {
            fs.writeFileSync(filePath, content, 'utf8');
            updatedFiles++;
            totalReplacements += fileReplacements;
        } else {
            console.log(`⚠️  No changes made to: ${filePath}`);
        }
    });

    console.log(`\n📊 VERSION UPDATE SUMMARY:`);
    console.log(`   Files Updated: ${updatedFiles}`);
    console.log(`   Total Replacements: ${totalReplacements}`);
    console.log(`   New Version: v${newVersion}`);

    // Verify the update worked
    console.log(`\n🔍 COMPREHENSIVE VERIFICATION:`);
    
    // Check version.json
    try {
        const versionData = JSON.parse(fs.readFileSync('version.json', 'utf8'));
        console.log(`   version.json: ${versionData.version === newVersion ? '✅' : '❌'} ${versionData.version}`);
    } catch (e) {
        console.log(`   version.json: ❌ Could not verify`);
    }

    // Check index.html cache busting
    const indexContent = fs.readFileSync('index.html', 'utf8');
    const cacheBustingMatches = [...indexContent.matchAll(/\?v=([\d.]+)/g)];
    const wrongVersions = cacheBustingMatches.filter(m => m[1] !== newVersion);
    
    console.log(`   Cache Busting: ${wrongVersions.length === 0 ? '✅' : '❌'} ${cacheBustingMatches.length} total, ${wrongVersions.length} wrong versions`);

    if (wrongVersions.length > 0) {
        console.log(`   ❌ Found incorrect versions:`);
        wrongVersions.slice(0, 5).forEach(m => {
            console.log(`      - v${m[1]} (should be v${newVersion})`);
        });
    }

    // Check critical fallback versions (prevents footer issue)
    try {
        const appContent = fs.readFileSync('src/components/core/RetirementPlannerApp.js', 'utf8');
        const fallbackMatch = appContent.match(/:\s*'v([\d.]+)'\)/);
        if (fallbackMatch) {
            const fallbackVersion = fallbackMatch[1];
            console.log(`   Footer Fallback: ${fallbackVersion === newVersion ? '✅' : '❌'} v${fallbackVersion} (prevents footer version mismatch)`);
        } else {
            console.log(`   Footer Fallback: ❌ Pattern not found`);
        }
    } catch (e) {
        console.log(`   Footer Fallback: ❌ Could not verify`);
    }

    // Check service worker cache names
    try {
        const swContent = fs.readFileSync('sw.js', 'utf8');
        const cacheMatches = [...swContent.matchAll(/retirement-planner-[^-]*-v([\d.]+)/g)];
        const wrongCacheVersions = cacheMatches.filter(m => m[1] !== newVersion);
        console.log(`   Service Worker: ${wrongCacheVersions.length === 0 ? '✅' : '❌'} ${cacheMatches.length} cache names, ${wrongCacheVersions.length} wrong versions`);
    } catch (e) {
        console.log(`   Service Worker: ❌ Could not verify`);
    }

    // Check export metadata
    try {
        const exportContent = fs.readFileSync('src/utils/exportFunctions.js', 'utf8');
        const exportMatch = exportContent.match(/version:\s*'v([\d.]+)'/);
        if (exportMatch) {
            const exportVersion = exportMatch[1];
            console.log(`   Export Metadata: ${exportVersion === newVersion ? '✅' : '❌'} v${exportVersion}`);
        } else {
            console.log(`   Export Metadata: ❌ Pattern not found`);
        }
    } catch (e) {
        console.log(`   Export Metadata: ❌ Could not verify`);
    }

    // Run deployment validation
    console.log(`\n🚀 NEXT STEPS:`);
    console.log(`   1. Review changes with: git diff`);
    console.log(`   2. Test locally to ensure everything works`);
    console.log(`   3. Commit changes: git add -A && git commit -m "Bump version to v${newVersion}"`);
    console.log(`   4. Push to deploy: git push`);
    console.log(`   5. Validate deployment: npm run validate:deployment`);

    if (totalReplacements === 0) {
        console.log(`\n❌ WARNING: No replacements made! This might indicate:`);
        console.log(`   - Version was already at v${newVersion}`);
        console.log(`   - Patterns in this script need updating`);
        console.log(`   - Files might be in a different format than expected`);
        process.exit(1);
    }

    console.log(`\n✅ VERSION UPDATE COMPLETE! All references updated to v${newVersion}`);
}

// Run the version update
const newVersion = process.argv[2];
updateVersion(newVersion);