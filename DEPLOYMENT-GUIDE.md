# Quick Deployment Guide

## One-Command Deployment

For experienced developers who want to deploy quickly:

```bash
npm run deploy:production
```

This interactive script will:
1. Run all pre-deployment checks
2. Verify 100% test pass rate (245/245)
3. Confirm version consistency
4. Push to production
5. Verify deployment success

## Manual Step-by-Step Deployment

If you prefer manual control:

### 1. Pre-Deployment Check
```bash
npm run deploy:pre-check
```
✅ Must see "READY FOR DEPLOYMENT"

### 2. Update Version (if needed)
```bash
node scripts/update-version.js X.Y.Z
```

### 3. Commit Changes
```bash
git add -A
git commit -m "Release vX.Y.Z: Brief description"
```

### 4. Push to Main
```bash
git push origin main
```

### 5. Verify Deployment (wait 3-5 minutes)
```bash
npm run deploy:verify
```

## Emergency Commands

### View Current Production Version
```bash
curl -s https://ypollak2.github.io/advanced-retirement-planner/version.json | jq .version
```

### Quick Rollback
```bash
git revert HEAD --no-edit && git push origin main
```

### Check Deployment Status
Visit: https://github.com/ypollak2/advanced-retirement-planner/actions

## Common Issues

### Tests Failing
- Run `npm test` to see which tests fail
- Fix the failing tests BEFORE deploying
- Never bypass test requirements

### Version Mismatch
- Use `node scripts/update-version.js X.Y.Z` to update all files
- Manual version edits will cause mismatches

### Deployment Not Updating
- Check GitHub Actions for errors
- Verify GitHub Pages is enabled
- Clear browser cache and retry

## Deployment Rules

🚫 **NEVER DEPLOY WITH FAILING TESTS**
🚫 **NEVER SKIP PRE-DEPLOYMENT CHECKS**
✅ **ALWAYS VERIFY AFTER DEPLOYMENT**

## Support

- Production URL: https://ypollak2.github.io/advanced-retirement-planner/
- GitHub Repo: https://github.com/ypollak2/advanced-retirement-planner
- Test Count: 245 tests must pass