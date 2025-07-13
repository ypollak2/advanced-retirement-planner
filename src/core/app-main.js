// Core Application - Advanced Retirement Planner
(function() {
    'use strict';

    // Import components
    const { EnhancedRSUCompanySelector } = window;
    const { BottomLineSummary } = window;
    const { SavingsSummaryPanel } = window;
    const { BasicInputs } = window;
    const { calculateNetSalary } = window;

    // Error Boundary Component
    class ErrorBoundary extends React.Component {
        constructor(props) {
            super(props);
            this.state = { hasError: false };
        }

        static getDerivedStateFromError(error) {
            return { hasError: true };
        }

        componentDidCatch(error, errorInfo) {
            console.error("Uncaught error:", error, errorInfo);
        }

        render() {
            if (this.state.hasError) {
                return React.createElement('h1', null, 'Something went wrong.');
            }

            return this.props.children; 
        }
    }

    // Main Retirement Planner Core Component
    const RetirementPlannerCore = () => {
        const [inputs, setInputs] = React.useState({
            currentAge: 30,
            retirementAge: 67,
            currentMonthlySalary: 15000,
            pensionContribution: 18.5,
            expectedReturn: 7.0,
            contributionFees: 1.0,
            accumulationFees: 1.0,
            currentPensionSavings: 0,
            // Training Fund (קרן השתלמות) Settings
            hasTrainingFund: true,
            trainingFundContributeAboveCeiling: false,
            trainingFundEmployeeRate: 2.5,
            trainingFundEmployerRate: 7.5,
            trainingFundCeiling: 15972,
            trainingFundFees: 0.6,
            currentTrainingFundSavings: 0,
            inflationRate: 3.0,
            taxCountry: 'israel',
            planningType: 'single',
            partner1Salary: 15000,
            partner2Salary: 12000,
            partner1Age: 30,
            partner2Age: 28
        });

        const handleInputChange = (e) => {
            try {
                const { name, value, type, checked } = e.target;
                const inputValue = type === 'checkbox' ? checked : value;

                // Input validation
                if (type === 'number') {
                    const numValue = parseFloat(inputValue);
                    if (isNaN(numValue) || numValue < 0) {
                        console.warn(`Invalid input for ${name}: ${inputValue}`);
                        return; // Prevent updating state with invalid data
                    }
                }

                setInputs(prevInputs => ({ ...prevInputs, [name]: inputValue }));
            } catch (error) {
                console.error(`Error handling input change for ${e.target.name}:`, error);
            }
        };

        // ... rest of the component
        return React.createElement('div', null, 
            React.createElement(ErrorBoundary, null, 
                React.createElement(BasicInputs, { inputs, setInputs, language, t, monthlyTrainingFundContribution, handleInputChange })
            ),
            React.createElement(ErrorBoundary, null, 
                React.createElement(SavingsSummaryPanel, { 
                    inputs, language, t, totalMonthlySalary, yearsToRetirement, 
                    estimatedMonthlyIncome, projectedWithGrowth, buyingPowerToday, 
                    monthlyTotal, avgNetReturn, exportToPNG, exportForAI, 
                    setShowChart, generateLLMAnalysis
                })
            )
        );
    };

    // ... other functions

    // Render the main component
    window.initializeRetirementPlannerCore = () => {
        const container = document.getElementById('retirement-planner-app');
        if (container) {
            ReactDOM.render(
                React.createElement(ErrorBoundary, null, 
                    React.createElement(RetirementPlannerCore)
                ),
                container
            );
        } else {
            console.error('Target container not found');
        }
    };

    // Ensure React and ReactDOM are globally available for other modules
    window.React = React;
    window.ReactDOM = ReactDOM;
})();