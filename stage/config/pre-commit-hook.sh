#!/bin/bash

# Pre-commit hook for Advanced Retirement Planner
# Runs quick tests before allowing commits

echo "🧪 Running pre-commit tests..."

# Check if test runner exists
if [ ! -f "test-runner.js" ]; then
    echo "❌ test-runner.js not found"
    exit 1
fi

# Run automated tests
echo "🔍 Running automated tests..."
if ! node test-runner.js; then
    echo "❌ Tests failed! Commit blocked."
    echo "💡 Fix the issues above and try again."
    exit 1
fi

# Check for common issues
echo "🔍 Checking for common issues..."

# Check for console.log in production files
if grep -r "console.log" src/ --include="*.js" | grep -v "// DEBUG:" | grep -v "test"; then
    echo "⚠️  WARNING: console.log found in production code"
    echo "💡 Consider removing or commenting out console.log statements"
fi

# Check for TODO/FIXME comments
if grep -r "TODO\|FIXME" src/ --include="*.js" | head -5; then
    echo "ℹ️  Found TODO/FIXME comments (not blocking)"
fi

# Check version consistency
current_version=$(grep '"version"' version.json | cut -d'"' -f4)
package_version=$(grep '"version"' package.json | cut -d'"' -f4)

if [ "$current_version" != "$package_version" ]; then
    echo "⚠️  WARNING: Version mismatch!"
    echo "   version.json: $current_version"
    echo "   package.json: $package_version"
    echo "💡 Run: node update-version.js"
fi

echo "✅ Pre-commit checks passed!"
echo "🚀 Proceeding with commit..."