#!/bin/bash
# Monitor GitHub Actions deployment

echo "🚀 Monitoring deployment for Advanced Retirement Planner v7.3.0"
echo "=================================================="
echo ""
echo "📍 GitHub Actions URL:"
echo "   https://github.com/ypollak2/advanced-retirement-planner/actions"
echo ""
echo "🌐 Production URLs to monitor:"
echo "   • https://ypollak2.github.io/advanced-retirement-planner/"
echo "   • https://advanced-retirement-planner.netlify.app/"
echo ""
echo "⏳ Waiting for deployment to complete (typically 3-5 minutes)..."
echo ""

# Function to check if URL is accessible
check_url() {
    local url=$1
    local max_attempts=20
    local attempt=1
    
    echo "🔍 Checking $url"
    
    while [ $attempt -le $max_attempts ]; do
        echo -n "   Attempt $attempt/$max_attempts: "
        
        if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200"; then
            echo "✅ Site is accessible!"
            
            # Check version
            if curl -s "$url" | grep -q "v7.3.0"; then
                echo "   ✅ Version 7.3.0 detected!"
                return 0
            else
                echo "   ⚠️  Version not yet updated to 7.3.0"
            fi
        else
            echo "⏳ Not ready yet"
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            echo "   ❌ Site not accessible after $max_attempts attempts"
            return 1
        fi
        
        sleep 15
        attempt=$((attempt + 1))
    done
}

echo "Starting deployment verification..."
echo ""

# Check GitHub Pages
check_url "https://ypollak2.github.io/advanced-retirement-planner/"
gh_pages_status=$?

echo ""

# Check Netlify
check_url "https://advanced-retirement-planner.netlify.app/"
netlify_status=$?

echo ""
echo "=================================================="
echo "📊 Deployment Summary:"
echo ""

if [ $gh_pages_status -eq 0 ]; then
    echo "✅ GitHub Pages: Successfully deployed v7.3.0"
else
    echo "❌ GitHub Pages: Deployment pending or failed"
fi

if [ $netlify_status -eq 0 ]; then
    echo "✅ Netlify: Successfully deployed v7.3.0"
else
    echo "⏳ Netlify: Deployment pending (may take longer)"
fi

echo ""
echo "🎯 Next steps:"
echo "1. Visit the production URLs to test functionality"
echo "2. Check for any console errors"
echo "3. Verify accessibility features are working"
echo "4. Test the wizard flow"
echo ""

if [ $gh_pages_status -eq 0 ] || [ $netlify_status -eq 0 ]; then
    echo "🎉 Deployment successful!"
    exit 0
else
    echo "⚠️  Deployment may still be in progress. Check GitHub Actions for details."
    exit 1
fi