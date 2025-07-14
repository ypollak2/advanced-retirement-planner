# 📋 Development Rules & Standards

## 🚀 Git Commit & Push Standards

### **RULE: Version Number & Changes in Every Push**

#### ✅ **Required Format for All Commits:**
```
[version] - [brief description]

Main changes:
• [Change 1]
• [Change 2] 
• [Change 3]

🤖 Generated with [Claude Code](https://claude.ai/code)
Co-Authored-By: Claude <noreply@anthropic.com>
```

#### ✅ **Example Good Commit Message:**
```
v5.1.0 - Comprehensive QA & testing framework with production deployment

Main changes:
• Fix critical HTML script loading and achieve 100% core test coverage
• Add accessibility (64.3%) and UX (57.1%) testing suites
• Create comprehensive product roadmap and UX improvement strategy
• Update documentation with latest features and deployment checklist

🤖 Generated with [Claude Code](https://claude.ai/code)
Co-Authored-By: Claude <noreply@anthropic.com>
```

#### ❌ **Avoid These Patterns:**
- Generic messages like "fix bugs" or "update files"
- Missing version numbers
- No clear main changes listed
- Overly technical without user impact

### **RULE: README Updates on Every Push**

#### ✅ **Required README Updates:**
1. **Version Badge**: Update version number in badges section
2. **What's New Section**: Add latest changes with version number
3. **Performance Metrics**: Update test scores and metrics if changed
4. **Quick Start**: Ensure commands are current and working
5. **Documentation Links**: Verify all links work and are current

#### ✅ **README Version Section Template:**
```markdown
## 🎨 What's New in v[X.Y.Z] - [MAJOR FEATURE DESCRIPTION]

### **🚨 LATEST: [MAIN IMPROVEMENT]** ([Date])

#### **🧪 [Category] Improvements**
- **[Feature 1]**: [User benefit and technical detail]
- **[Feature 2]**: [User benefit and technical detail]
- **[Feature 3]**: [User benefit and technical detail]

#### **📊 Updated Metrics**
- **Core Tests**: X% (Y/Z tests)
- **Security**: X% (Y/Z checks)
- **Accessibility**: X% (Y/Z tests)
- **UX**: X% (Y/Z tests)
```

### **RULE: Version Management Consistency**

#### ✅ **Files That Must Be Updated Together:**
1. `version.json` - Update version, build date, commit, description
2. `package.json` - Update version field
3. `README.md` - Update badges, what's new section, metrics
4. `index.html` - Update title and version indicator if applicable

#### ✅ **Version Numbering Standard:**
- **Major (X.0.0)**: Breaking changes, major feature overhauls
- **Minor (X.Y.0)**: New features, significant improvements
- **Patch (X.Y.Z)**: Bug fixes, small improvements, documentation updates

### **RULE: Documentation-First Development**

#### ✅ **Before Every Push:**
1. **Test Coverage**: Run `npm run qa:full` and document results
2. **Documentation**: Update relevant .md files with changes
3. **User Impact**: Clearly explain what users will experience
4. **Next Steps**: Update roadmap or todo items if priorities change

#### ✅ **Documentation Standards:**
- Use emojis for visual scanning (🚀 🎨 🔧 📊 ✅ ❌)
- Include both technical details and user benefits
- Maintain consistent formatting across all .md files
- Link to related documentation when appropriate

### **RULE: Quality Gates**

#### ✅ **Never Push If:**
- Core tests are below 95% success rate
- Security analysis shows critical vulnerabilities
- Documentation is out of sync with code changes
- Version numbers are inconsistent across files

#### ✅ **Always Include:**
- Test results summary in commit message or PR description
- User-facing impact description
- Links to related issues or discussions
- Clear next steps or follow-up tasks

---

## 🎯 Enforcement & Compliance

### **Pre-Push Checklist:**
- [ ] Version number updated in all required files
- [ ] README.md reflects latest changes and version
- [ ] Commit message includes version and main changes
- [ ] All tests pass (`npm run qa:full`)
- [ ] Documentation is current and accurate

### **Review Standards:**
- Every push should be reviewable by non-technical stakeholders
- Commit messages should tell the story of product evolution
- Documentation should enable new developers to contribute immediately
- User impact should be clear from commit message alone

This ensures professional, trackable, and user-focused development practices.