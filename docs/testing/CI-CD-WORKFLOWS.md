# CI/CD Test Workflows Documentation

## Overview

This document details the continuous integration and deployment workflows for the Advanced Retirement Planner, focusing on automated testing, quality gates, and deployment strategies.

## Table of Contents
1. [GitHub Actions Workflow](#github-actions-workflow)
2. [Test Pipeline Stages](#test-pipeline-stages)
3. [Deployment Gates](#deployment-gates)
4. [Branch Protection Rules](#branch-protection-rules)
5. [Monitoring and Notifications](#monitoring-and-notifications)
6. [Local CI Simulation](#local-ci-simulation)
7. [Troubleshooting CI/CD](#troubleshooting-cicd)
8. [Best Practices](#best-practices)

## GitHub Actions Workflow

### Main Test Workflow (`.github/workflows/test-ci.yml`)

```yaml
name: Comprehensive Test Suite CI

on:
  push:
    branches: [ main, develop, 'release/*' ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
  workflow_dispatch:    # Manual trigger
    inputs:
      test_category:
        description: 'Test category to run'
        required: false
        default: 'all'
        type: choice
        options:
          - all
          - unit
          - integration
          - e2e
          - performance
          - security
```

### Workflow Environment Variables

```yaml
env:
  NODE_VERSION: '18.x'
  COVERAGE_THRESHOLD: 80
  DEPLOYMENT_READY: false
  CACHE_KEY: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

## Test Pipeline Stages

### Stage 1: Unit Tests (Fast Feedback)

**Purpose**: Validate business logic and calculations

```yaml
unit-tests:
  name: Unit Tests
  runs-on: ubuntu-latest
  timeout-minutes: 10
  
  steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        
    - name: Install dependencies
      run: |
        npm ci --prefer-offline --no-audit
        
    - name: Run unit tests
      run: |
        npm run test:unit
        
    - name: Generate coverage report
      run: |
        npx c8 --reporter=lcov npm run test:unit
        
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage/lcov.info
        flags: unit
        fail_ci_if_error: true
```

**Success Criteria**:
- All tests pass (100%)
- Coverage > 80%
- Execution time < 5 minutes

### Stage 2: Integration Tests

**Purpose**: Verify component interactions

```yaml
integration-tests:
  name: Integration Tests
  runs-on: ubuntu-latest
  needs: unit-tests  # Run after unit tests
  timeout-minutes: 15
  
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        
    - name: Install and build
      run: |
        npm ci
        npm run build
        
    - name: Run integration tests
      run: |
        npm run test:integration
        
    - name: Upload test results
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: integration-test-results
        path: test-results/integration/
        retention-days: 7
```

### Stage 3: E2E Tests (Multi-Browser)

**Purpose**: Validate complete user journeys

```yaml
e2e-tests:
  name: E2E Tests - ${{ matrix.browser }}
  runs-on: ubuntu-latest
  needs: integration-tests
  timeout-minutes: 30
  
  strategy:
    fail-fast: false
    matrix:
      browser: [chrome, firefox, safari]
      
  steps:
    - uses: actions/checkout@v4
    
    - name: Setup test environment
      run: |
        npm ci
        npx playwright install ${{ matrix.browser }}
        
    - name: Run E2E tests
      run: |
        npm run test:e2e -- --browser=${{ matrix.browser }}
      env:
        HEADLESS: true
        
    - name: Upload screenshots on failure
      if: failure()
      uses: actions/upload-artifact@v3
      with:
        name: e2e-screenshots-${{ matrix.browser }}
        path: |
          test-results/screenshots/
          test-results/videos/
```

### Stage 4: Performance Tests

**Purpose**: Ensure performance standards

```yaml
performance-tests:
  name: Performance Tests
  runs-on: ubuntu-latest
  needs: unit-tests
  
  steps:
    - uses: actions/checkout@v4
    
    - name: Run performance benchmarks
      run: |
        npm run test:performance
        
    - name: Run Lighthouse CI
      uses: treosh/lighthouse-ci-action@v10
      with:
        urls: |
          https://deploy-preview-${{ github.event.pull_request.number }}.netlify.app
        uploadArtifacts: true
        temporaryPublicStorage: true
        
    - name: Comment performance results
      uses: actions/github-script@v7
      if: github.event_name == 'pull_request'
      with:
        script: |
          const results = require('./lighthouse-results.json');
          const comment = `## 🚀 Performance Results
          
          | Metric | Score |
          |--------|-------|
          | Performance | ${results.performance} |
          | Accessibility | ${results.accessibility} |
          | Best Practices | ${results.bestPractices} |
          | SEO | ${results.seo} |
          `;
          
          github.rest.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: comment
          });
```

### Stage 5: Security Tests

**Purpose**: Identify vulnerabilities

```yaml
security-tests:
  name: Security Tests
  runs-on: ubuntu-latest
  
  steps:
    - uses: actions/checkout@v4
    
    - name: Run npm audit
      run: |
        npm audit --audit-level=moderate
        
    - name: Run security tests
      run: |
        npm run test:security
        
    - name: SAST Scan
      uses: github/super-linter@v5
      env:
        DEFAULT_BRANCH: main
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        VALIDATE_JAVASCRIPT_ES: true
        VALIDATE_HTML: true
        
    - name: Upload security report
      uses: actions/upload-artifact@v3
      with:
        name: security-scan-results
        path: security-report.json
```

## Deployment Gates

### Pre-Deployment Validation

```yaml
deployment-gate:
  name: Deployment Gate Check
  runs-on: ubuntu-latest
  needs: [unit-tests, integration-tests, e2e-tests, performance-tests, security-tests]
  if: github.ref == 'refs/heads/main'
  
  outputs:
    deploy_allowed: ${{ steps.gate_check.outputs.allowed }}
    
  steps:
    - name: Check all tests passed
      id: gate_check
      run: |
        echo "Checking deployment readiness..."
        
        # Check if all required jobs succeeded
        if [[ "${{ needs.unit-tests.result }}" == "success" ]] && \
           [[ "${{ needs.integration-tests.result }}" == "success" ]] && \
           [[ "${{ needs.e2e-tests.result }}" == "success" ]] && \
           [[ "${{ needs.performance-tests.result }}" == "success" ]] && \
           [[ "${{ needs.security-tests.result }}" == "success" ]]; then
          echo "✅ All tests passed - deployment allowed"
          echo "allowed=true" >> $GITHUB_OUTPUT
        else
          echo "❌ Tests failed - deployment blocked"
          echo "allowed=false" >> $GITHUB_OUTPUT
          exit 1
        fi
        
    - name: Verify test count
      run: |
        # Run full test suite
        TEST_OUTPUT=$(npm test 2>&1)
        PASSED=$(echo "$TEST_OUTPUT" | grep -oE 'Tests Passed: [0-9]+' | grep -oE '[0-9]+')
        EXPECTED=354  # Update this when adding tests
        
        if [[ "$PASSED" -ne "$EXPECTED" ]]; then
          echo "❌ Expected $EXPECTED tests, but only $PASSED passed"
          exit 1
        fi
```

### Deployment Job

```yaml
deploy:
  name: Deploy to Production
  runs-on: ubuntu-latest
  needs: deployment-gate
  if: needs.deployment-gate.outputs.deploy_allowed == 'true'
  environment: production
  
  steps:
    - uses: actions/checkout@v4
    
    - name: Build for production
      run: |
        npm ci --production
        npm run build
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
        
    - name: Verify deployment
      run: |
        sleep 60  # Wait for deployment
        curl -f https://ypollak2.github.io/advanced-retirement-planner || exit 1
```

## Branch Protection Rules

### Main Branch Protection

```json
{
  "protection_rules": {
    "main": {
      "required_status_checks": {
        "strict": true,
        "contexts": [
          "unit-tests",
          "integration-tests",
          "e2e-tests / E2E Tests - chrome",
          "e2e-tests / E2E Tests - firefox",
          "performance-tests",
          "security-tests",
          "deployment-gate"
        ]
      },
      "enforce_admins": true,
      "required_pull_request_reviews": {
        "required_approving_review_count": 1,
        "dismiss_stale_reviews": true
      },
      "restrictions": null,
      "allow_force_pushes": false,
      "allow_deletions": false
    }
  }
}
```

### Pull Request Checks

```yaml
pr-checks:
  name: PR Validation
  on:
    pull_request:
      types: [opened, synchronize, reopened]
      
  jobs:
    validate:
      runs-on: ubuntu-latest
      steps:
        - name: Check PR title
          uses: deepakputhraya/action-pr-title@master
          with:
            regex: '^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+'
            
        - name: Check file changes
          uses: dorny/paths-filter@v2
          id: changes
          with:
            filters: |
              tests:
                - 'tests/**'
              source:
                - 'src/**'
                
        - name: Require tests for source changes
          if: steps.changes.outputs.source == 'true' && steps.changes.outputs.tests == 'false'
          run: |
            echo "❌ Source files changed but no tests added/modified"
            exit 1
```

## Monitoring and Notifications

### Slack Notifications

```yaml
notify-slack:
  name: Notify Slack
  runs-on: ubuntu-latest
  needs: [deployment-gate]
  if: always()
  
  steps:
    - name: Send notification
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        fields: repo,message,commit,author,action,eventName,ref,workflow
        
    - name: Send detailed failure report
      if: failure()
      uses: 8398a7/action-slack@v3
      with:
        status: custom
        custom_payload: |
          {
            text: "🚨 Test Failures Detected",
            attachments: [{
              color: 'danger',
              fields: [
                { title: 'Failed Jobs', value: '${{ needs.*.result }}' },
                { title: 'Branch', value: '${{ github.ref }}' },
                { title: 'Commit', value: '${{ github.sha }}' }
              ]
            }]
          }
```

### Test Result Dashboard

```yaml
update-dashboard:
  name: Update Test Dashboard
  runs-on: ubuntu-latest
  needs: [unit-tests, integration-tests, e2e-tests]
  if: always()
  
  steps:
    - name: Collect metrics
      run: |
        # Gather test results
        METRICS='{
          "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
          "branch": "'${{ github.ref_name }}'",
          "unit_tests": "'${{ needs.unit-tests.result }}'",
          "integration_tests": "'${{ needs.integration-tests.result }}'",
          "e2e_tests": "'${{ needs.e2e-tests.result }}'",
          "total_duration": '${{ github.run_duration_ms }}'
        }'
        
        echo "$METRICS" > metrics.json
        
    - name: Update dashboard
      uses: actions/github-script@v7
      with:
        script: |
          const metrics = require('./metrics.json');
          
          // Update GitHub Pages dashboard
          const content = Buffer.from(JSON.stringify(metrics)).toString('base64');
          
          await github.rest.repos.createOrUpdateFileContents({
            owner: context.repo.owner,
            repo: context.repo.repo,
            path: `dashboard/metrics/${Date.now()}.json`,
            message: 'Update test metrics',
            content: content,
            branch: 'gh-pages'
          });
```

## Local CI Simulation

### Running CI Tests Locally

```bash
#!/bin/bash
# scripts/local-ci.sh

echo "🚀 Running CI simulation locally..."

# Set CI environment
export CI=true
export NODE_ENV=test

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Track failures
FAILED=0

# Function to run stage
run_stage() {
    local stage_name=$1
    local command=$2
    
    echo -e "\n${YELLOW}Running: $stage_name${NC}"
    
    if eval "$command"; then
        echo -e "${GREEN}✓ $stage_name passed${NC}"
    else
        echo -e "${RED}✗ $stage_name failed${NC}"
        FAILED=$((FAILED + 1))
    fi
}

# Stage 1: Lint and syntax
run_stage "Syntax validation" "npm run validate:syntax"

# Stage 2: Unit tests
run_stage "Unit tests" "npm run test:unit"

# Stage 3: Integration tests
run_stage "Integration tests" "npm run test:integration"

# Stage 4: E2E tests
run_stage "E2E tests (Chrome)" "npm run test:e2e -- --browser=chrome"

# Stage 5: Performance tests
run_stage "Performance tests" "npm run test:performance"

# Stage 6: Security tests
run_stage "Security audit" "npm audit --audit-level=moderate"
run_stage "Security tests" "npm run test:security"

# Stage 7: Full test suite
run_stage "Full test suite" "npm test"

# Summary
echo -e "\n${YELLOW}=== CI Simulation Complete ===${NC}"
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All stages passed!${NC}"
    echo "Ready for deployment"
else
    echo -e "${RED}❌ $FAILED stage(s) failed${NC}"
    echo "Fix failures before pushing"
    exit 1
fi
```

### Pre-Push Hook

```bash
#!/bin/bash
# .git/hooks/pre-push

echo "Running pre-push checks..."

# Quick checks
npm run validate:quick || exit 1

# Run changed tests
CHANGED_FILES=$(git diff --name-only HEAD origin/main)
if echo "$CHANGED_FILES" | grep -q "\.js$"; then
    npm run test:unit -- --findRelatedTests $CHANGED_FILES || exit 1
fi

# Verify test count
npm run test:enhanced -- --verify-count || exit 1

echo "✅ Pre-push checks passed"
```

## Troubleshooting CI/CD

### Common CI Failures

#### 1. Node Version Mismatch

**Error**: `The engine "node" is incompatible with this module`

**Fix**:
```yaml
- uses: actions/setup-node@v4
  with:
    node-version-file: '.nvmrc'  # Use project's Node version
```

#### 2. Cache Issues

**Error**: `npm ERR! Unexpected end of JSON input`

**Fix**:
```yaml
- name: Clear npm cache
  if: failure()
  run: |
    npm cache clean --force
    rm -rf node_modules
    npm install
```

#### 3. Timeout in CI

**Error**: `Error: The operation was canceled`

**Fix**:
```yaml
jobs:
  test:
    timeout-minutes: 30  # Increase timeout
    steps:
      - name: Long running test
        timeout-minutes: 15  # Step-specific timeout
```

#### 4. Flaky E2E Tests

**Fix**:
```yaml
- name: Run E2E with retries
  uses: nick-invision/retry@v2
  with:
    timeout_minutes: 10
    max_attempts: 3
    command: npm run test:e2e
```

### CI Performance Optimization

#### 1. Dependency Caching

```yaml
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: |
      ~/.npm
      node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

#### 2. Parallel Jobs

```yaml
strategy:
  matrix:
    test-suite: [unit, integration, e2e, performance]
    
- name: Run ${{ matrix.test-suite }} tests
  run: npm run test:${{ matrix.test-suite }}
```

#### 3. Conditional Execution

```yaml
- name: Run expensive tests
  if: |
    github.event_name == 'push' && 
    github.ref == 'refs/heads/main' ||
    contains(github.event.pull_request.labels.*.name, 'full-test')
  run: npm run test:expensive
```

## Best Practices

### 1. Fast Feedback

```yaml
# Run quick tests first
jobs:
  quick-tests:
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint
      - run: npm run test:unit
      
  slow-tests:
    needs: quick-tests
    runs-on: ubuntu-latest
    steps:
      - run: npm run test:e2e
```

### 2. Fail Fast Strategy

```yaml
strategy:
  fail-fast: true  # Stop all jobs if one fails
  matrix:
    os: [ubuntu-latest, windows-latest, macos-latest]
```

### 3. Resource Management

```yaml
# Clean up resources
- name: Cleanup
  if: always()
  run: |
    # Kill any hanging processes
    pkill -f "node|chrome|firefox" || true
    
    # Clear temporary files
    rm -rf /tmp/test-*
    
    # Free disk space
    docker system prune -af
```

### 4. Security Best Practices

```yaml
# Use minimal permissions
permissions:
  contents: read
  pull-requests: write
  
# Use secrets safely
- name: Deploy
  env:
    API_KEY: ${{ secrets.API_KEY }}
  run: |
    # Never echo secrets
    deploy.sh
```

### 5. Monitoring and Alerts

```yaml
# Set up alerts for failures
- name: Alert on failure
  if: failure() && github.ref == 'refs/heads/main'
  uses: actions/github-script@v7
  with:
    script: |
      await github.rest.issues.create({
        owner: context.repo.owner,
        repo: context.repo.repo,
        title: `🚨 CI Failure on main branch`,
        body: `Build failed: ${context.runId}`,
        labels: ['ci-failure', 'urgent']
      });
```

## CI/CD Metrics

Track these metrics for continuous improvement:

1. **Build Success Rate**: `(Successful Builds / Total Builds) * 100`
2. **Average Build Time**: Track trends over time
3. **Test Flakiness**: `(Flaky Test Runs / Total Test Runs) * 100`
4. **Time to Deploy**: From commit to production
5. **Rollback Frequency**: How often deployments are reverted

```yaml
# Example metrics collection
- name: Collect CI metrics
  if: always()
  run: |
    echo '{
      "build_id": "${{ github.run_id }}",
      "duration_ms": ${{ github.run_duration_ms }},
      "status": "${{ job.status }}",
      "branch": "${{ github.ref_name }}",
      "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
    }' > ci-metrics.json
```

---

Remember: CI/CD is about **continuous improvement**. Monitor, measure, and optimize your pipelines regularly.