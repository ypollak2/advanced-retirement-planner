# MCP Agents Specification for Advanced Retirement Planner

## Overview
This document defines 9 specialized MCP (Model Context Protocol) agents designed to enhance development workflow, AI capabilities, and product functions for the Advanced Retirement Planner project.

---

## 1. code-architect

### Purpose
AI-powered code generation and refactoring agent that understands and enforces the project's unique no-ES6 architecture.

### Core Functionalities

#### Component Generation
- **Input**: Component requirements and design specifications
- **Process**: 
  - Analyzes existing component patterns in the codebase
  - Generates complete component structure following window.ComponentName pattern
  - Converts any JSX syntax to React.createElement automatically
  - Ensures proper script tag dependencies
- **Output**: Ready-to-use component file with proper exports

#### Architecture Compliance
- **Automatic ES6 to ES5 conversion**: Transforms modern JavaScript to compatible syntax
- **Import/Export transformation**: Converts ES6 modules to window-based exports
- **Dependency management**: Analyzes and documents component load order requirements
- **Pattern matching**: Learns from existing code patterns to maintain consistency

#### Code Refactoring
- **Legacy code modernization**: Updates old patterns while maintaining no-ES6 rules
- **Performance optimization**: Suggests and implements performance improvements
- **Code splitting**: Identifies opportunities for lazy loading components
- **Dead code elimination**: Detects and removes unused functions and variables

#### Boilerplate Generation
- **Feature scaffolding**: Creates complete feature structure with all necessary files
- **Test file generation**: Creates matching test files for new components
- **Documentation stubs**: Generates inline documentation templates
- **Integration points**: Identifies and creates necessary hooks for existing systems

### Example Usage
```bash
mcp code-architect generate-component --name "TaxOptimizationWizard" --type "wizard-step" --features "validation,couple-mode"
```

---

## 2. test-scenario-generator

### Purpose
Intelligent test creation engine that generates comprehensive test cases based on code analysis and business logic understanding.

### Core Functionalities

#### Test Case Generation
- **Code analysis**: Parses functions to understand parameters, return types, and logic paths
- **Edge case detection**: Automatically identifies boundary conditions and edge cases
- **Test coverage analysis**: Identifies untested code paths and suggests test cases
- **Assertion generation**: Creates meaningful assertions based on function behavior

#### Financial Calculation Testing
- **Scenario creation**: Generates realistic financial scenarios for testing
- **Currency conversion tests**: Creates tests for all 6 supported currencies (ILS/USD/EUR/GBP/BTC/ETH)
- **Couple mode variations**: Automatically generates partner1/partner2 test variations
- **Precision testing**: Tests for floating-point precision issues in calculations

#### Regression Test Creation
- **Bug-to-test conversion**: Converts bug reports into regression tests
- **Historical analysis**: Learns from past bugs to predict test scenarios
- **Performance benchmarks**: Creates performance regression tests
- **Integration tests**: Generates tests for component interactions

#### Test Maintenance
- **Test updates**: Updates tests when code changes
- **Test optimization**: Removes redundant tests and optimizes test runtime
- **Flaky test detection**: Identifies and fixes unstable tests
- **Test documentation**: Generates clear descriptions for each test case

### Example Usage
```bash
mcp test-scenario-generator analyze --file "src/utils/retirementCalculations.js" --coverage-target 95
```

---

## 3. pr-review-assistant

### Purpose
Automated code review agent that ensures code quality, security, and compliance with project standards.

### Core Functionalities

#### Architecture Validation
- **ES6 detection**: Flags any ES6 syntax that violates project standards
- **Component structure**: Validates proper window export patterns
- **Dependency checking**: Ensures correct script loading order
- **Pattern compliance**: Checks adherence to established code patterns

#### Security Analysis
- **Secret scanning**: Detects hardcoded API keys or sensitive data
- **Input validation**: Ensures proper sanitization of user inputs
- **XSS prevention**: Checks for potential cross-site scripting vulnerabilities
- **CORS validation**: Verifies proper CORS proxy implementation for APIs

#### Performance Review
- **Bundle size impact**: Calculates size impact of changes
- **Performance patterns**: Identifies potential performance bottlenecks
- **Caching opportunities**: Suggests caching implementations
- **Lazy loading candidates**: Identifies components suitable for lazy loading

#### Automated Fixes
- **Style corrections**: Auto-fixes code style issues
- **Import corrections**: Converts ES6 imports to script dependencies
- **Security patches**: Applies security best practices automatically
- **Performance optimizations**: Implements approved performance improvements

### Example Usage
```bash
mcp pr-review-assistant review --pr 123 --auto-fix --security-scan
```

---

## 4. bug-predictor

### Purpose
Machine learning-powered bug prediction system that identifies potential issues before they reach production.

### Core Functionalities

#### Pattern Analysis
- **Historical bug patterns**: Learns from past bugs in the codebase
- **Code complexity analysis**: Identifies overly complex functions prone to bugs
- **Change impact assessment**: Predicts bug risk based on code changes
- **Dependency risk scoring**: Evaluates risk of changes to core dependencies

#### Financial Logic Validation
- **Calculation verification**: Double-checks financial calculations for accuracy
- **Division by zero prevention**: Flags potential division by zero scenarios
- **NaN/Infinity detection**: Predicts conditions that could lead to invalid numbers
- **Currency conversion risks**: Identifies potential currency calculation errors

#### Predictive Warnings
- **Risk scoring**: Assigns risk scores to code changes
- **Bug likelihood estimation**: Calculates probability of bugs in new code
- **Impact analysis**: Estimates potential impact of predicted bugs
- **Mitigation suggestions**: Provides specific recommendations to prevent bugs

#### Monitoring Integration
- **Production error tracking**: Learns from production errors to improve predictions
- **Performance anomaly detection**: Identifies performance degradation patterns
- **User behavior correlation**: Links code changes to user-reported issues
- **Automated alerting**: Notifies team of high-risk changes

### Example Usage
```bash
mcp bug-predictor analyze --commit HEAD~5..HEAD --risk-threshold medium
```

---

## 5. retirement-advisor-ai

### Purpose
Intelligent retirement planning assistant that provides personalized recommendations and insights based on user data.

### Core Functionalities

#### Personalized Recommendations
- **Goal optimization**: Analyzes user goals and suggests optimal strategies
- **Savings recommendations**: Calculates ideal savings rates based on retirement goals
- **Investment allocation**: Suggests portfolio allocations based on risk profile
- **Tax optimization strategies**: Recommends tax-efficient withdrawal strategies

#### Natural Language Processing
- **Query understanding**: Interprets user questions about retirement planning
- **Explanation generation**: Creates clear explanations for complex calculations
- **Multi-language support**: Provides insights in Hebrew and English
- **Contextual responses**: Tailors responses based on user's financial situation

#### Scenario Analysis
- **What-if scenarios**: Generates multiple retirement scenarios for comparison
- **Risk assessment**: Evaluates retirement plan risks and suggests mitigations
- **Timeline optimization**: Suggests optimal retirement timing based on finances
- **Couple coordination**: Analyzes and optimizes plans for couples

#### Continuous Learning
- **User feedback integration**: Learns from user interactions to improve recommendations
- **Market adaptation**: Updates recommendations based on market conditions
- **Regulation compliance**: Stays updated with retirement planning regulations
- **Success tracking**: Monitors recommendation outcomes for improvement

### Example Usage
```bash
mcp retirement-advisor-ai analyze --user-data profile.json --goal "retire-at-55"
```

---

## 6. financial-insights-engine

### Purpose
Advanced analytics engine that provides deep financial insights and predictive modeling for retirement planning.

### Core Functionalities

#### Market Analysis
- **Trend prediction**: Analyzes market trends for return assumptions
- **Volatility modeling**: Calculates market volatility for stress testing
- **Correlation analysis**: Identifies asset correlation for portfolio optimization
- **Economic indicators**: Integrates economic data for better predictions

#### Inflation Modeling
- **Historical analysis**: Uses historical data to predict future inflation
- **Regional variations**: Accounts for different inflation rates by country
- **Sector-specific inflation**: Models inflation for different expense categories
- **Dynamic adjustments**: Updates predictions based on current economic data

#### Tax Intelligence
- **Tax optimization**: Calculates optimal withdrawal strategies for tax efficiency
- **Multi-jurisdiction support**: Handles tax implications for different countries
- **Future tax modeling**: Predicts potential tax law changes impact
- **Deduction maximization**: Identifies opportunities for tax deductions

#### Monte Carlo Enhancement
- **Advanced simulations**: Runs sophisticated Monte Carlo simulations
- **Probability distributions**: Uses realistic probability distributions for modeling
- **Tail risk analysis**: Focuses on extreme scenarios and black swan events
- **Confidence intervals**: Provides detailed confidence intervals for predictions

### Example Usage
```bash
mcp financial-insights-engine forecast --portfolio current.json --horizon 30-years
```

---

## 7. feature-prioritizer

### Purpose
Data-driven product management assistant that helps prioritize features based on user impact and development effort.

### Core Functionalities

#### Impact Analysis
- **User value scoring**: Calculates potential user value for each feature
- **Usage prediction**: Estimates feature adoption rates
- **Revenue impact**: Projects potential revenue impact of features
- **Retention influence**: Predicts effect on user retention

#### Effort Estimation
- **Development time prediction**: Estimates development hours based on historical data
- **Complexity scoring**: Analyzes technical complexity of features
- **Dependency mapping**: Identifies feature dependencies and prerequisites
- **Resource requirements**: Calculates required team resources

#### Prioritization Framework
- **RICE scoring**: Implements Reach, Impact, Confidence, Effort framework
- **Value vs. effort matrix**: Creates visual prioritization matrices
- **ROI calculation**: Computes return on investment for features
- **Strategic alignment**: Scores features based on business strategy

#### Roadmap Generation
- **Automated roadmaps**: Generates product roadmaps based on priorities
- **Timeline estimation**: Creates realistic development timelines
- **Milestone planning**: Identifies key milestones and dependencies
- **Progress tracking**: Monitors feature development progress

### Example Usage
```bash
mcp feature-prioritizer analyze --backlog features.json --team-capacity 5 --quarter Q4-2025
```

---

## 8. deployment-orchestrator

### Purpose
Intelligent deployment automation system that ensures safe, reliable releases with zero downtime.

### Core Functionalities

#### Pre-deployment Validation
- **Test verification**: Ensures all 302 tests pass before deployment
- **Performance benchmarks**: Validates performance metrics meet standards
- **Security scanning**: Runs security checks on deployment package
- **Dependency verification**: Checks all dependencies are properly resolved

#### Deployment Strategy
- **Blue-green deployment**: Manages blue-green deployment strategy
- **Canary releases**: Orchestrates gradual rollouts to user segments
- **Feature flags**: Manages feature flag configurations
- **Rollback planning**: Prepares automated rollback procedures

#### Multi-stage Pipeline
- **Environment progression**: Manages dev → staging → production flow
- **Approval gates**: Implements automated and manual approval gates
- **Health checks**: Monitors application health at each stage
- **Smoke testing**: Runs smoke tests after each deployment

#### Post-deployment Monitoring
- **Error tracking**: Monitors for increased error rates post-deployment
- **Performance monitoring**: Tracks performance metrics after release
- **User feedback**: Collects immediate user feedback on new release
- **Automated rollback**: Triggers rollback on critical issues

### Example Usage
```bash
mcp deployment-orchestrator deploy --version 7.2.0 --strategy canary --rollout-percentage 10
```

---

## 9. user-feedback-processor

### Purpose
Natural language processing system that analyzes user feedback to extract actionable insights and feature requests.

### Core Functionalities

#### Feedback Collection
- **Multi-source aggregation**: Collects feedback from GitHub issues, support emails, and in-app feedback
- **Sentiment analysis**: Determines user sentiment (positive/negative/neutral)
- **Language detection**: Handles feedback in Hebrew and English
- **Duplicate detection**: Identifies and merges duplicate feedback items

#### Intelligent Categorization
- **Auto-categorization**: Classifies feedback into bug reports, feature requests, questions
- **Priority scoring**: Assigns priority based on urgency and impact
- **Component mapping**: Maps feedback to specific application components
- **User segment analysis**: Identifies which user segments provide feedback

#### Insight Generation
- **Trend identification**: Detects emerging patterns in user feedback
- **Feature extraction**: Extracts specific feature requests from feedback
- **Pain point analysis**: Identifies common user frustrations
- **Success story mining**: Finds positive experiences to amplify

#### Action Item Creation
- **Ticket generation**: Creates development tickets from feedback
- **Requirements extraction**: Generates requirement documents from feature requests
- **Bug report formatting**: Converts user reports into structured bug tickets
- **Response automation**: Generates personalized responses to users

### Example Usage
```bash
mcp user-feedback-processor analyze --period last-30-days --output-format jira
```

---

## Integration Guidelines

### Installation
Each agent can be installed individually or as a complete suite:
```bash
# Individual installation
mcp install code-architect
mcp install test-scenario-generator

# Complete suite installation
mcp install retirement-planner-suite
```

### Configuration
Agents are configured through a central configuration file:
```json
{
  "agents": {
    "code-architect": {
      "architecture": "no-es6",
      "component-pattern": "window-export"
    },
    "test-scenario-generator": {
      "coverage-target": 95,
      "test-framework": "custom"
    }
  }
}
```

### Inter-agent Communication
Agents can work together for complex workflows:
- **Code generation → Test creation**: code-architect generates code, test-scenario-generator creates tests
- **Bug prediction → Test generation**: bug-predictor identifies risks, test-scenario-generator creates preventive tests
- **Feedback → Feature prioritization**: user-feedback-processor extracts requests, feature-prioritizer ranks them

### Monitoring and Analytics
All agents provide detailed analytics:
- Performance metrics
- Usage statistics
- Success rates
- Time saved estimates