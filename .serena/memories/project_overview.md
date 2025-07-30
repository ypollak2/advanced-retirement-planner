# Advanced Retirement Planner Project Overview

## Project Purpose
The Advanced Retirement Planner is a professional-grade web application designed for comprehensive retirement planning with sophisticated financial modeling capabilities. It provides users with tools for retirement calculations, investment tracking, tax optimization, and couple planning.

## Current Version
- Version: 7.2.0 (Major Financial Health Score System Repair)
- Primary Deployment: https://ypollak2.github.io/advanced-retirement-planner/
- Mirror: https://advanced-pension-planner.netlify.app/

## Key Features
1. **Financial Planning Tools**
   - Retirement calculations with Monte Carlo simulations
   - Multi-currency support (ILS, USD, EUR, GBP, BTC, ETH)
   - Partner/couple planning mode
   - Investment tracking with real-time stock prices
   - Tax optimization and efficiency analysis
   - Financial health scoring system

2. **User Interface**
   - Wizard-based guided input system
   - Bilingual support (Hebrew/English)
   - Interactive charts and visualizations
   - Export functionality for reports
   - Real-time updates and calculations

## Tech Stack
- Frontend: Vanilla JavaScript with React (no JSX)
- React Components: Using React.createElement pattern
- No ES6 modules - all components use window exports
- Deployment: GitHub Pages (primary) and Netlify (mirror)
- Build Tool: Vite
- Testing: Custom test runner with 302 comprehensive tests
- Version Control: Git with GitHub

## Architecture Notes
- Components loaded via script tags in index.html
- Service Worker for offline functionality
- LocalStorage for data persistence
- CORS proxy for external API calls
- No build step required - runs directly in browser

## Repository Structure
- `/src` - Source code (components, utils, translations, styles)
- `/tests` - Comprehensive test suite
- `/docs` - Documentation and reports
- `/scripts` - Automation and deployment scripts
- `/plans` - Task planning documents (ticket-based)
- `/.github/workflows` - CI/CD pipelines