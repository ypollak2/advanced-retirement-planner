# GitHub Workflows Migration Guide

**Migration Date**: July 30, 2025  
**Target Completion**: August 5, 2025  
**Project**: Advanced Retirement Planner v7.2.1

## 🎯 Migration Overview

This guide provides step-by-step instructions for migrating from the old scattered workflow approach to the new optimized, dependency-driven pipeline system.

## 📋 Pre-Migration Checklist

### Current State Verification

- [ ] Document current workflow execution patterns
- [ ] Backup existing workflow configurations
- [ ] Identify critical deployment dependencies
- [ ] Review branch protection rules
- [ ] Audit existing secrets and environment variables

### New Workflows Status

- [x] **CI Pipeline** (`ci-pipeline.yml`) - Created ✅
- [x] **Deployment Pipeline** (`deployment.yml`) - Created ✅
- [x] **Quality Assurance** (`quality-assurance.yml`) - Created ✅
- [x] **Monitoring** (`monitoring.yml`) - Created ✅

## 🔄 Migration Phases

### Phase 1: Preparation (Days 1-2)

#### 1.1 Branch Protection Backup
```bash
# Document current branch protection settings
gh api repos/:owner/:repo/branches/main/protection > branch-protection-backup.json
```

#### 1.2 Workflow Dependencies Audit
Create a mapping of current workflow triggers and dependencies:

| Current Workflow | Triggers | Dependencies | Critical Path |
|------------------|----------|--------------|---------------|
| `test.yml` | push, PR | None | ✅ Critical |
| `deploy-production.yml` | push to main | None | ✅ Critical |
| `qa-testing.yml` | push, PR | None | ⚠️ Overlapping |
| `security.yml` | push, PR, schedule | None | ⚠️ Overlapping |

#### 1.3 Environment Variables Setup
Verify all required environment variables are available:

```yaml
NODE_VERSION: '18'
PRODUCTION_URL: 'https://ypollak2.github.io/advanced-retirement-planner/'
STAGE_URL: 'https://ypollak2.github.io/advanced-retirement-planner/stage/'
MIRROR_URL: 'https://advanced-retirement-planner.netlify.app/'
```

### Phase 2: Testing New Workflows (Days 3-4)

#### 2.1 Feature Branch Testing

Create a test branch for workflow validation:

```bash
git checkout -b feature/workflow-optimization-test
git push -u origin feature/workflow-optimization-test
```

**Testing Sequence**:

1. **Test CI Pipeline**
   ```bash
   # Push a small change to trigger CI
   echo "# Workflow optimization test" >> README.md
   git add README.md
   git commit -m "test: trigger CI pipeline validation"
   git push
   ```

2. **Verify CI Pipeline Results**
   - [ ] All jobs complete successfully
   - [ ] Test results are properly reported
   - [ ] Security scans execute without issues
   - [ ] Build validation passes

3. **Test Deployment Pipeline Dependencies**
   ```bash
   # Merge test changes to main to trigger deployment
   git checkout main
   git merge feature/workflow-optimization-test
   git push
   ```

4. **Monitor Deployment Chain**
   - [ ] CI Pipeline completes successfully
   - [ ] Deployment Pipeline triggers automatically
   - [ ] Stage deployment executes
   - [ ] Production deployment follows stage success
   - [ ] All validations pass

#### 2.2 Manual Workflow Testing

Test manual triggers and edge cases:

```bash
# Test manual CI pipeline
gh workflow run ci-pipeline.yml

# Test deployment with different environments
gh workflow run deployment.yml -f environment=stage

# Test QA pipeline
gh workflow run quality-assurance.yml -f test_scope=regression

# Test monitoring
gh workflow run monitoring.yml -f monitoring_scope=health-check
```

### Phase 3: Branch Protection Migration (Day 5)

#### 3.1 Update Branch Protection Rules

**Current Protection**: Points to old workflow status checks
**New Protection**: Points to new CI pipeline

```bash
# Update branch protection to use new workflows
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["ci-pipeline"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1}' \
  --field restrictions=null
```

#### 3.2 Verify Protection Rules

```bash
# Verify new protection rules
gh api repos/:owner/:repo/branches/main/protection
```

Expected status checks:
- `ci-pipeline` ✅
- Remove old checks: `test`, `qa-testing`, etc.

### Phase 4: Old Workflow Cleanup (Day 6)

#### 4.1 Disable Old Workflows

Rather than deleting immediately, disable old workflows first:

```bash
# List all workflows
gh workflow list

# Disable specific workflows (keep as backup)
gh workflow disable test.yml
gh workflow disable qa-testing.yml
gh workflow disable test-ci.yml
gh workflow disable regression-tests.yml
```

#### 4.2 Archive Old Workflow Files

Move old workflows to archive directory:

```bash
mkdir -p .github/workflows-archive
mv .github/workflows/test.yml .github/workflows-archive/
mv .github/workflows/qa-testing.yml .github/workflows-archive/
mv .github/workflows/test-ci.yml .github/workflows-archive/
mv .github/workflows/regression-tests.yml .github/workflows-archive/
mv .github/workflows/security-simple.yml .github/workflows-archive/
rm .github/workflows/deploy-stage-simple.yml.bak

git add .github/workflows-archive/
git add .github/workflows/
git commit -m "archive: move old workflows to archive directory"
git push
```

### Phase 5: Documentation Update (Day 7)

#### 5.1 Update README Badges

Replace old workflow badges with new ones:

```markdown
<!-- Old badges -->
![Test](https://github.com/user/repo/workflows/Test/badge.svg)
![QA](https://github.com/user/repo/workflows/QA%20Testing/badge.svg)

<!-- New badges -->
![CI Pipeline](https://github.com/user/repo/workflows/🔄%20CI%20Pipeline%20(Main)/badge.svg)
![Deployment](https://github.com/user/repo/workflows/🚀%20Deployment%20Pipeline/badge.svg)
![Quality Assurance](https://github.com/user/repo/workflows/🎯%20Quality%20Assurance%20Pipeline/badge.svg)
![Monitoring](https://github.com/user/repo/workflows/📡%20Production%20Monitoring%20&%20Health%20Checks/badge.svg)
```

#### 5.2 Update Development Documentation

Create/update documentation files:
- [x] `docs/WORKFLOW-OPTIMIZATION.md` - Technical details
- [x] `docs/WORKFLOW-MIGRATION-GUIDE.md` - This guide
- [ ] Update `CONTRIBUTING.md` with new workflow information
- [ ] Update deployment documentation

## 🧪 Testing Checklist

### Pre-Migration Tests

- [ ] Current workflows execute successfully
- [ ] All tests pass (381/381)
- [ ] Deployments work correctly
- [ ] Security scans complete

### Post-Migration Tests

#### CI Pipeline Testing
- [ ] Code quality checks pass
- [ ] Multi-node testing (18.x, 20.x) works
- [ ] Security scanning functions correctly
- [ ] Build validation succeeds
- [ ] Branch protection integration works

#### Deployment Pipeline Testing
- [ ] Stage deployment executes
- [ ] Stage validation passes
- [ ] Production deployment follows stage success
- [ ] Production validation completes
- [ ] Manual environment selection works

#### Quality Assurance Testing
- [ ] Regression tests run on schedule
- [ ] Performance analysis completes
- [ ] Accessibility tests execute
- [ ] Extended security scans work
- [ ] QA reports generate correctly

#### Monitoring Testing
- [ ] Health checks run on schedule
- [ ] E2E tests execute successfully
- [ ] Alert issue creation works
- [ ] Multiple environment monitoring functions

### Edge Case Testing

#### Failure Scenarios
- [ ] CI pipeline failure blocks deployment
- [ ] Stage deployment failure prevents production
- [ ] Monitoring alerts create issues
- [ ] Manual overrides work correctly

#### Recovery Scenarios
- [ ] Failed deployments can be retried
- [ ] Monitoring recovers from temporary failures
- [ ] Manual workflow triggers work during issues

## 🚨 Rollback Plan

If issues occur during migration, follow this rollback procedure:

### Emergency Rollback (Critical Issues)

1. **Re-enable Old Workflows**
   ```bash
   gh workflow enable test.yml
   gh workflow enable deploy-production.yml
   ```

2. **Restore Branch Protection**
   ```bash
   gh api repos/:owner/:repo/branches/main/protection \
     --method PUT \
     --input branch-protection-backup.json
   ```

3. **Disable New Workflows**
   ```bash
   gh workflow disable ci-pipeline.yml
   gh workflow disable deployment.yml
   gh workflow disable quality-assurance.yml
   gh workflow disable monitoring.yml
   ```

### Partial Rollback (Minor Issues)

For non-critical issues, selectively rollback components:

1. **Keep CI Pipeline, Rollback Deployment**
   - Re-enable `deploy-production.yml`
   - Disable `deployment.yml`

2. **Keep Core Workflows, Disable Monitoring**
   - Disable `monitoring.yml`
   - Keep other new workflows active

## 📊 Migration Verification

### Success Criteria

#### Functional Requirements ✅
- [ ] All tests pass (381/381)
- [ ] Deployments execute successfully
- [ ] Security scans complete without critical issues
- [ ] Monitoring detects and alerts on issues

#### Performance Requirements ✅
- [ ] Workflow execution time improved by >30%
- [ ] GitHub Actions minutes usage reduced by >40%
- [ ] Faster feedback on pull requests

#### Operational Requirements ✅
- [ ] Clear dependency chain visualization
- [ ] Improved failure isolation and debugging
- [ ] Comprehensive monitoring and alerting
- [ ] Simplified workflow maintenance

### Post-Migration Monitoring

Track these metrics for 2 weeks post-migration:

#### Daily Checks
- [ ] CI pipeline success rate
- [ ] Deployment success rate
- [ ] Test execution time
- [ ] Alert frequency

#### Weekly Reviews
- [ ] GitHub Actions usage metrics
- [ ] Workflow failure analysis
- [ ] Developer feedback collection
- [ ] Performance improvement validation

## 🛠️ Troubleshooting Common Issues

### Issue: Workflow Dependencies Not Triggering

**Symptoms**: New workflow doesn't start after previous workflow completes

**Solutions**:
1. Check `workflow_run` syntax in YAML
2. Verify branch names match exactly
3. Ensure triggering workflow completed with `success` status

```yaml
# Correct syntax
on:
  workflow_run:
    workflows: ["🔄 CI Pipeline (Main)"]  # Exact name
    types: [completed]
    branches: [main]  # Exact branch name
```

### Issue: Branch Protection Not Recognizing New Status

**Symptoms**: PRs show as not meeting protection requirements

**Solutions**:
1. Verify status check context name matches workflow job
2. Update branch protection rules
3. Check workflow naming consistency

```bash
# Debug status checks
gh api repos/:owner/:repo/commits/COMMIT_SHA/status
```

### Issue: Environment Variables Not Available

**Symptoms**: Workflows fail with undefined environment variables

**Solutions**:
1. Check repository secrets configuration
2. Verify environment-specific variables
3. Add missing variables to workflow files

### Issue: Deployment Validation Timeouts

**Symptoms**: Deployment validation fails due to timeouts

**Solutions**:
1. Increase timeout values
2. Add retry logic
3. Check DNS propagation delays

```yaml
# Increase timeout
- name: Wait for deployment
  run: sleep 120  # Increase from 60 to 120 seconds
```

## 📞 Support & Resources

### Getting Help

1. **Check Workflow Logs**: Always start with GitHub Actions logs
2. **Review Documentation**: This guide and the optimization documentation
3. **Test Locally**: Use `act` or similar tools for local testing
4. **GitHub Support**: For platform-specific issues

### Useful Commands

```bash
# List workflow runs
gh run list --workflow=ci-pipeline.yml

# View specific run details
gh run view RUN_ID

# Re-run failed workflow
gh run rerun RUN_ID

# View workflow logs
gh run view RUN_ID --log
```

### Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Optimization Guide](./WORKFLOW-OPTIMIZATION.md)
- [Repository Settings](https://github.com/settings/repositories)
- [Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository)

---

**Migration Status**: 🚧 In Progress  
**Next Review**: August 1, 2025  
**Contact**: Development Team

*This migration guide ensures a smooth transition to optimized GitHub workflows while maintaining system reliability and developer productivity.*