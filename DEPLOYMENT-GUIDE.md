# 🚀 Deployment Guide - Force Fresh Updates

## 🔧 Netlify Cache Issue Solution

### **Problem**: Netlify serves old cached version despite new commits

### **Solution**: Multiple cache-busting strategies implemented

## 📋 Files Added/Modified for Cache Busting:

### 1. **`_headers`** - Force no-cache headers
```
/src/core/*.js
  Cache-Control: no-cache, no-store, must-revalidate
```

### 2. **`netlify.toml`** - Netlify configuration 
```toml
[[headers]]
  for = "/src/core/*.js"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate"
```

### 3. **`index.html`** - Timestamp query parameters
```javascript
await loadScript(`./src/core/app-main.js?v=4.10.4&t=${Date.now()}`);
```

## 🚀 Deployment Steps:

### **Method 1: Force Netlify Rebuild (Recommended)**

1. **Go to Netlify Dashboard**:
   - https://app.netlify.com/sites/YOUR_SITE_NAME/deploys

2. **Trigger Deploy**:
   - Click "Trigger deploy" → "Deploy site"
   - This forces a fresh build with new timestamps

3. **Clear Site Cache**:
   - Click "Site settings" → "Build & deploy" → "Post processing"
   - Enable "Asset optimization" → Save
   - Then disable it → Save (this clears cache)

### **Method 2: Manual Cache Clear**

1. **Clear Browser Cache**:
   ```
   Chrome: Ctrl+Shift+Del (Windows) / Cmd+Shift+Del (Mac)
   Firefox: Ctrl+Shift+Del (Windows) / Cmd+Shift+Del (Mac)
   Safari: Cmd+Option+E (Mac)
   ```

2. **Hard Refresh**:
   ```
   Chrome: Ctrl+F5 (Windows) / Cmd+Shift+R (Mac)
   Firefox: Ctrl+F5 (Windows) / Cmd+Shift+R (Mac)
   Safari: Cmd+R while holding Shift (Mac)
   ```

### **Method 3: Incognito/Private Mode**
- Open the site in incognito/private browsing mode
- This bypasses all cached content

## 🔍 Verification Steps:

1. **Check Console Logs**:
   ```
   ✅ Version configuration loaded
   ✅ Currency exchange utility loaded
   ✅ Pension calculations utility loaded
   🎯 Initializing Retirement Planner Core...
   ```

2. **Check Footer Version**:
   - Bottom of page should show: "Advanced Retirement Planner v4.10.4"
   - Creator: "פותח על ידי יהלי פולק • בשיתוף Claude AI"

3. **Verify Functionality**:
   - Savings summary shows realistic values (not ₪0)
   - Chart renders in center of page (not sidebar)
   - Currency exchange rates load properly

## ⚡ Future Deployments:

**Simply commit and push** - the cache-busting is now automatic:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

The timestamp parameters (`t=${Date.now()}`) ensure fresh loads every time.

## 🆘 If Still Seeing Old Version:

1. Check Netlify build logs for errors
2. Verify all files committed to Git
3. Try Method 1 (Force Netlify Rebuild)
4. Contact support with build URL if persistent issues

**Current Version**: v4.10.4  
**Last Updated**: 2025-07-13