#!/bin/bash

# Install Git hooks for automated testing

echo "📦 Installing Git hooks..."
echo "========================="

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Install pre-push hook
cat > .git/hooks/pre-push << 'EOF'
#!/bin/bash

# Pre-push hook - run regression tests before push
echo "🚀 Pre-push hook activated..."

# Run the pre-push test script
./scripts/pre-push-tests.sh

# Exit with the same code as the test script
exit $?
EOF

# Make the hook executable
chmod +x .git/hooks/pre-push

# Install pre-commit hook for quick checks
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

# Pre-commit hook - quick validation checks
echo "📝 Pre-commit hook activated..."

# Run quick syntax validation
echo "Running syntax validation..."
npm run validate:syntax > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "❌ Syntax validation failed!"
    echo "Run 'npm run validate:syntax' to see errors"
    exit 1
fi

echo "✅ Pre-commit checks passed!"
exit 0
EOF

# Make the hook executable
chmod +x .git/hooks/pre-commit

echo ""
echo "✅ Git hooks installed successfully!"
echo ""
echo "Installed hooks:"
echo "  - pre-commit: Quick syntax validation"
echo "  - pre-push: Full regression test suite"
echo ""
echo "To skip hooks (not recommended):"
echo "  - Skip pre-commit: git commit --no-verify"
echo "  - Skip pre-push: git push --no-verify"