#!/bin/bash
# Production Deployment Script
# Automates the deployment process with safety checks

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_color() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to print header
print_header() {
    echo ""
    print_color "$CYAN" "════════════════════════════════════════════════════════════"
    print_color "$CYAN" "$1"
    print_color "$CYAN" "════════════════════════════════════════════════════════════"
    echo ""
}

# Function to ask for confirmation
confirm() {
    local prompt=$1
    local response
    
    while true; do
        read -r -p "$prompt [y/N] " response
        case "$response" in
            [yY][eE][sS]|[yY]) 
                return 0
                ;;
            [nN][oO]|[nN]|"")
                return 1
                ;;
            *)
                echo "Please answer yes or no."
                ;;
        esac
    done
}

# Main deployment process
main() {
    print_header "🚀 ADVANCED RETIREMENT PLANNER - PRODUCTION DEPLOYMENT"
    
    # Step 1: Check current branch
    print_color "$BLUE" "Checking current branch..."
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    
    if [ "$CURRENT_BRANCH" != "main" ]; then
        print_color "$YELLOW" "⚠️  You are on branch '$CURRENT_BRANCH', not 'main'"
        if ! confirm "Do you want to continue?"; then
            print_color "$RED" "Deployment cancelled."
            exit 1
        fi
    else
        print_color "$GREEN" "✓ On main branch"
    fi
    
    # Step 2: Check for uncommitted changes
    print_color "$BLUE" "Checking for uncommitted changes..."
    if ! git diff-index --quiet HEAD --; then
        print_color "$YELLOW" "⚠️  You have uncommitted changes:"
        git status --short
        if ! confirm "Do you want to continue without committing?"; then
            print_color "$RED" "Deployment cancelled. Please commit your changes first."
            exit 1
        fi
    else
        print_color "$GREEN" "✓ Working directory is clean"
    fi
    
    # Step 3: Pull latest changes
    print_color "$BLUE" "Pulling latest changes from remote..."
    git pull origin main || {
        print_color "$RED" "Failed to pull latest changes"
        exit 1
    }
    
    # Step 4: Run pre-deployment checks
    print_header "Running Pre-Deployment Checks"
    
    if ! node scripts/pre-deployment-check.js; then
        print_color "$RED" "❌ Pre-deployment checks failed!"
        print_color "$RED" "Please fix all issues before deploying."
        exit 1
    fi
    
    # Step 5: Show version information
    print_header "Version Information"
    
    CURRENT_VERSION=$(node -p "require('./package.json').version")
    print_color "$CYAN" "Current version: $CURRENT_VERSION"
    
    # Step 6: Confirm deployment
    print_header "Deployment Confirmation"
    
    print_color "$YELLOW" "You are about to deploy version $CURRENT_VERSION to production."
    print_color "$YELLOW" "This will update:"
    print_color "$YELLOW" "  • https://ypollak2.github.io/advanced-retirement-planner/"
    print_color "$YELLOW" "  • https://advanced-retirement-planner.netlify.app/"
    echo ""
    
    if ! confirm "Do you want to proceed with deployment?"; then
        print_color "$RED" "Deployment cancelled by user."
        exit 0
    fi
    
    # Step 7: Create deployment tag
    print_header "Creating Deployment Tag"
    
    TAG_NAME="v$CURRENT_VERSION"
    TAG_MESSAGE="Production deployment of version $CURRENT_VERSION"
    
    # Check if tag already exists
    if git rev-parse "$TAG_NAME" >/dev/null 2>&1; then
        print_color "$YELLOW" "Tag $TAG_NAME already exists. Skipping tag creation."
    else
        git tag -a "$TAG_NAME" -m "$TAG_MESSAGE"
        print_color "$GREEN" "✓ Created tag: $TAG_NAME"
    fi
    
    # Step 8: Push to main (triggers GitHub Actions deployment)
    print_header "Pushing to Main Branch"
    
    print_color "$BLUE" "Pushing changes and tags to remote..."
    git push origin main --tags || {
        print_color "$RED" "Failed to push to remote"
        exit 1
    }
    
    print_color "$GREEN" "✓ Successfully pushed to main branch"
    print_color "$CYAN" "GitHub Actions will now handle the deployment..."
    
    # Step 9: Monitor deployment
    print_header "Deployment Monitoring"
    
    print_color "$CYAN" "Monitor deployment progress at:"
    print_color "$BLUE" "https://github.com/ypollak2/advanced-retirement-planner/actions"
    echo ""
    
    # Step 10: Wait and verify
    print_color "$YELLOW" "Waiting 3 minutes for deployment to complete..."
    print_color "$YELLOW" "(You can press Ctrl+C to skip waiting and verify manually later)"
    
    # Show countdown
    for i in {180..1}; do
        printf "\r${YELLOW}Time remaining: %02d:%02d${NC}" $((i/60)) $((i%60))
        sleep 1
    done
    echo ""
    
    # Step 11: Run post-deployment verification
    print_header "Post-Deployment Verification"
    
    if node scripts/deployment-verification.js; then
        print_color "$GREEN" "✅ Deployment verification passed!"
    else
        print_color "$RED" "❌ Deployment verification failed!"
        print_color "$YELLOW" "Please check the deployment manually."
    fi
    
    # Step 12: Final summary
    print_header "Deployment Complete"
    
    print_color "$GREEN" "✅ Version $CURRENT_VERSION has been deployed to production!"
    echo ""
    print_color "$CYAN" "Production URLs:"
    print_color "$BLUE" "  • https://ypollak2.github.io/advanced-retirement-planner/"
    print_color "$BLUE" "  • https://advanced-retirement-planner.netlify.app/"
    echo ""
    print_color "$CYAN" "Next steps:"
    print_color "$BLUE" "  1. Test the production site thoroughly"
    print_color "$BLUE" "  2. Monitor for any user-reported issues"
    print_color "$BLUE" "  3. Update release notes if needed"
    echo ""
}

# Run main function
main "$@"