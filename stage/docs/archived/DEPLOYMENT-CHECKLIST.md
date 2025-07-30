# Production Deployment Checklist for Advanced Retirement Planner

## Overview
This checklist ensures safe and reliable deployments to production. ALL steps must be completed before deployment.

**CRITICAL RULE**: 100% test pass rate (245/245 tests) is MANDATORY. No exceptions.

## Pre-Deployment Checklist

### 1. Code Quality Validation ✓
- [ ] Run syntax validation: `npm run validate:syntax`
- [ ] Run full test suite: `npm test` (MUST show 245/245 tests passing)
- [ ] Run security tests: `npm run test:security`
- [ ] Run performance tests: `npm run test:performance`
- [ ] Run accessibility tests: `npm run test:accessibility`
- [ ] Run component tests: `npm run test:components`
- [ ] Run version consistency: `npm run test:version`

### 2. Version Management ✓
- [ ] Update version in all three locations:
  - [ ] `version.json`
  - [ ] `package.json`
  - [ ] `README.md`
- [ ] Ensure version follows semantic versioning (MAJOR.MINOR.PATCH)
- [ ] Update build date in `version.json`
- [ ] Update commit reference in `version.json`
- [ ] Update description in `version.json` with main changes

### 3. Documentation Updates ✓
- [ ] Update README.md "What's New" section
- [ ] Document any breaking changes
- [ ] Update API documentation if applicable
- [ ] Review and update CLAUDE.md if development standards changed

### 4. Security Checks ✓
- [ ] Run security audit: `npm audit`
- [ ] Run secret scanner: `npm run security:scan`
- [ ] Verify no sensitive data in commits
- [ ] Check for exposed API keys or credentials
- [ ] Run license check: `npm run license-check-prod`

### 5. Pre-Deployment Testing ✓
- [ ] Test locally: `npm run serve` and verify all features work
- [ ] Test in different browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test mobile responsiveness
- [ ] Verify all external API integrations work
- [ ] Test offline functionality (Service Worker)

## Deployment Process

### Step 1: Final Pre-Deployment Validation
```bash
# Run the comprehensive pre-deployment check
npm run deploy:pre-check
```

This command will:
- Verify all tests pass (245/245)
- Check version consistency
- Validate build readiness
- Generate deployment report

### Step 2: Build Production Assets
```bash
# Create optimized production build
npm run build
```

### Step 3: Stage Changes
```bash
# Stage all changes for commit
git add -A

# Review staged changes
git status
```

### Step 4: Create Deployment Commit
```bash
# Commit with version number
git commit -m "Release v[VERSION]: [Brief description of main changes]"
```

### Step 5: Push to Main Branch
```bash
# Push to trigger deployment
git push origin main
```

### Step 6: Monitor Deployment
- GitHub Actions will automatically deploy to GitHub Pages
- Monitor the Actions tab for deployment status
- Deployment typically takes 2-5 minutes

### Step 7: Post-Deployment Verification
```bash
# Wait for deployment to complete (3-5 minutes)
# Then run validation
npm run deploy:verify
```

This will:
- Check production URL accessibility
- Verify all key components loaded
- Test Service Worker availability
- Generate deployment validation report

## Post-Deployment Checklist

### 1. Production Verification ✓
- [ ] Visit https://ypollak2.github.io/advanced-retirement-planner/
- [ ] Verify version number displays correctly
- [ ] Test core functionality:
  - [ ] Input forms work
  - [ ] Calculations run correctly
  - [ ] Charts display properly
  - [ ] Data saves/loads correctly
  - [ ] Export features work

### 2. Performance Verification ✓
- [ ] Page loads in < 3 seconds
- [ ] No console errors
- [ ] Service Worker registered successfully
- [ ] Offline mode works

### 3. Cross-Platform Testing ✓
- [ ] Test on mobile devices
- [ ] Test on different screen sizes
- [ ] Verify responsive design works

### 4. Monitoring Setup ✓
- [ ] Check error logs (if applicable)
- [ ] Monitor user feedback channels
- [ ] Set up alerts for deployment issues

## Rollback Procedures

If issues are discovered post-deployment:

### Quick Rollback (< 5 minutes)
```bash
# 1. Revert the last commit
git revert HEAD --no-edit

# 2. Push the revert
git push origin main

# 3. GitHub Actions will redeploy the previous version
```

### Manual Rollback
```bash
# 1. Find the last known good commit
git log --oneline -10

# 2. Reset to that commit
git reset --hard [COMMIT_HASH]

# 3. Force push (use with caution)
git push origin main --force

# 4. Verify rollback completed
npm run deploy:verify
```

## Emergency Procedures

### If Tests Fail During Deployment
1. DO NOT proceed with deployment
2. Fix failing tests immediately
3. Re-run full test suite
4. Only proceed when 245/245 tests pass

### If Production Site is Down
1. Check GitHub Pages status: https://www.githubstatus.com/
2. Verify DNS settings haven't changed
3. Check browser console for errors
4. Review recent commits for breaking changes

### If Service Worker Causes Issues
1. Update Service Worker version to force refresh
2. Clear browser cache and reload
3. Consider disabling Service Worker temporarily if critical

## Deployment Schedule Recommendations

- **Best Times**: Tuesday-Thursday, 10 AM - 2 PM (user timezone)
- **Avoid**: Fridays, weekends, holidays
- **Always**: Have team member available for 2 hours post-deployment
- **Never**: Deploy without passing tests

## Contact Information

- **GitHub Repository**: https://github.com/ypollak2/advanced-retirement-planner
- **Production URL**: https://ypollak2.github.io/advanced-retirement-planner/
- **Mirror URL**: https://advanced-retirement-planner.netlify.app/

## Version History Tracking

After each deployment, update:
1. GitHub Releases page with release notes
2. `CHANGELOG.md` with detailed changes
3. Project documentation with new features

---

**Remember**: Quality over speed. Never compromise test coverage for urgent deployments.