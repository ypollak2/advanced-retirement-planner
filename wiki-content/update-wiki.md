# 📚 GitHub Wiki Update Instructions

The wiki content has been updated in the `wiki-content/` directory. To update the GitHub Wiki:

## Method 1: Manual Copy (Recommended)
1. Go to: https://github.com/ypollak2/advanced-retirement-planner/wiki
2. Edit the following pages and replace content:

### Home Page
```markdown
Copy content from: wiki-content/Home.md
To: https://github.com/ypollak2/advanced-retirement-planner/wiki/Home
```

### RSU Features Page  
```markdown
Copy content from: wiki-content/RSU-Features.md
To: https://github.com/ypollak2/advanced-retirement-planner/wiki/RSU-Features
```

### Testing Guide Page
```markdown
Copy content from: wiki-content/Testing-Guide.md  
To: https://github.com/ypollak2/advanced-retirement-planner/wiki/Testing-Guide
```

## Method 2: Git Clone Wiki (Advanced)
```bash
# Clone the wiki repository
git clone https://github.com/ypollak2/advanced-retirement-planner.wiki.git

# Copy files
cp wiki-content/*.md advanced-retirement-planner.wiki/

# Commit and push
cd advanced-retirement-planner.wiki
git add .
git commit -m "Update wiki for v4.10.5 release"
git push origin master
```

## 🎯 Key Updates for v4.10.5:
- Updated version numbers from 4.10.4 to 4.10.5
- Added comprehensive GitHub Wiki documentation update
- Added Netlify deployment cache-busting solution
- Fixed missing generateChartData function and chart rendering
- Updated Hebrew creator name (יהלי פולק)
- Added complete deployment guide and troubleshooting documentation
- Enhanced cache-busting strategy with headers and netlify.toml configuration