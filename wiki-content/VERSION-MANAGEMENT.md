# 📋 Version Management System

This project uses a centralized version management system. **Update only one file** to change the version across the entire application.

## 🎯 How to Update Version

### 1. Edit `version.js` (Single Source of Truth)
```javascript
const APP_VERSION = {
    major: 4,        // ← Change these numbers
    minor: 10,       // ← Change these numbers  
    patch: 5,        // ← Change these numbers
    
    qaScore: 95.2,   // ← Update QA score
    // ...rest stays the same
};
```

### 2. Run the Update Script
```bash
node scripts/update-version.js
```

This automatically updates:
- ✅ README.md title and badges
- ✅ package.json version
- ✅ Wiki update instructions
- ✅ Application footer (via window.APP_VERSION)

### 3. Commit Changes
```bash
git add .
git commit -m "Update version to v4.10.5"
git push
```

## 📁 Files Updated Automatically

| File | What Gets Updated |
|------|------------------|
| `README.md` | Title, version badge, QA badge, section headers |
| `package.json` | Version field |
| `update-wiki.md` | Version numbers in instructions |
| `src/core/app-main.js` | Footer version (via window.APP_VERSION) |

## 🚀 Benefits

- **Single Source of Truth**: Only edit one file
- **No Version Mismatches**: Everything stays in sync
- **Automatic Updates**: Script handles all the tedious work
- **Less Errors**: No manual find/replace across multiple files

## 📝 Version Format

The system uses semantic versioning: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes, major feature releases
- **MINOR**: New features, significant improvements
- **PATCH**: Bug fixes, small improvements

Current version: **v4.10.4**