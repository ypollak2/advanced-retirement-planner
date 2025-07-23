// ScenarioChart.js - Chart Visualization for Scenario Comparison
// Created by Yali Pollak (יהלי פולק) - Advanced Retirement Planner v6.3.0

const ScenarioChart = ({ 
    scenarios, 
    chartType = 'accumulation', 
    language = 'en', 
    workingCurrency = 'ILS' 
}) => {
    const createElement = React.createElement;
    
    // Chart configurations
    const chartTypes = {
        accumulation: {
            title: language === 'he' ? 'צבירה לאורך זמן' : 'Accumulation Over Time',
            yLabel: language === 'he' ? 'סכום צבור' : 'Accumulated Amount'
        },
        contributions: {
            title: language === 'he' ? 'הפקדות שנתיות' : 'Annual Contributions',
            yLabel: language === 'he' ? 'הפקדה שנתית' : 'Annual Contribution'
        },
        income: {
            title: language === 'he' ? 'הכנסה בפרישה' : 'Retirement Income',
            yLabel: language === 'he' ? 'הכנסה חודשית' : 'Monthly Income'
        },
        comparison: {
            title: language === 'he' ? 'השוואת תרחישים' : 'Scenario Comparison',
            yLabel: language === 'he' ? 'ערך כולל' : 'Total Value'
        }
    };

    // Generate projection data for each scenario
    const generateProjectionData = (scenarioData) => {
        const currentAge = parseFloat(scenarioData.currentAge || 30);
        const retirementAge = parseFloat(scenarioData.retirementAge || 67);
        const currentSalary = parseFloat(scenarioData.currentMonthlySalary || 0);
        const pensionRate = parseFloat(scenarioData.pensionContributionRate || 17.5) / 100;
        const trainingFundRate = parseFloat(scenarioData.trainingFundContributionRate || 7.5) / 100;
        const expectedReturn = parseFloat(scenarioData.expectedReturn || 7) / 100;
        const salaryGrowth = parseFloat(scenarioData.salaryGrowthRate || 3) / 100;
        
        const projectionData = [];
        let accumulatedAmount = parseFloat(scenarioData.currentSavings || 0);
        let currentSalaryValue = currentSalary;
        
        for (let age = currentAge; age <= retirementAge + 10; age++) {
            const isWorking = age <= retirementAge;
            
            if (isWorking) {
                // Calculate annual contributions
                const annualSalary = currentSalaryValue * 12;
                const pensionContribution = annualSalary * pensionRate;
                const trainingFundContribution = annualSalary * trainingFundRate;
                const totalContribution = pensionContribution + trainingFundContribution;
                
                // Add contributions and growth
                accumulatedAmount = (accumulatedAmount + totalContribution) * (1 + expectedReturn);
                
                // Salary growth
                currentSalaryValue *= (1 + salaryGrowth);
            } else {
                // Retirement: only growth, no contributions
                accumulatedAmount *= (1 + expectedReturn);
            }
            
            projectionData.push({
                age: age,
                year: new Date().getFullYear() + (age - currentAge),
                accumulated: accumulatedAmount,
                isRetired: !isWorking
            });
        }
        
        return projectionData;
    };

    // Create SVG line chart
    const createLineChart = () => {
        const width = 800;
        const height = 400;
        const margin = { top: 20, right: 80, bottom: 40, left: 80 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        
        // Generate data for all scenarios
        const scenarioProjections = scenarios.map(scenario => ({
            ...scenario,
            data: generateProjectionData(scenario.data)
        }));
        
        // Calculate scales
        const allDataPoints = scenarioProjections.flatMap(s => s.data);
        const minAge = Math.min(...allDataPoints.map(d => d.age));
        const maxAge = Math.max(...allDataPoints.map(d => d.age));
        const maxValue = Math.max(...allDataPoints.map(d => d.accumulated));
        
        const xScale = (age) => margin.left + ((age - minAge) / (maxAge - minAge)) * innerWidth;
        const yScale = (value) => margin.top + ((maxValue - value) / maxValue) * innerHeight;
        
        // Color palette
        const colors = {
            blue: '#3B82F6',
            green: '#10B981',
            purple: '#8B5CF6',
            orange: '#F59E0B',
            red: '#EF4444',
            indigo: '#6366F1',
            pink: '#EC4899',
            yellow: '#EAB308'
        };
        
        // Generate SVG paths
        const createPath = (data) => {
            return data.map((point, index) => {
                const x = xScale(point.age);
                const y = yScale(point.accumulated);
                return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
            }).join(' ');
        };
        
        // Create grid lines
        const gridLines = [];
        for (let i = 0; i <= 5; i++) {
            const y = margin.top + (innerHeight / 5) * i;
            gridLines.push(
                createElement('line', {
                    key: `grid-${i}`,
                    x1: margin.left,
                    y1: y,
                    x2: margin.left + innerWidth,
                    y2: y,
                    stroke: '#E5E7EB',
                    strokeWidth: 1
                })
            );
        }
        
        return createElement('div', {
            key: 'chart-container',
            className: 'bg-white rounded-xl p-6 border border-gray-200'
        }, [
            createElement('h3', {
                key: 'chart-title',
                className: 'text-xl font-semibold text-gray-800 mb-6 text-center'
            }, chartTypes[chartType].title),
            
            createElement('div', {
                key: 'chart-wrapper',
                className: 'relative overflow-x-auto'
            }, [
                createElement('svg', {
                    key: 'chart-svg',
                    width: width,
                    height: height,
                    className: 'border border-gray-200 rounded'
                }, [
                    // Grid lines
                    ...gridLines,
                    
                    // Scenario lines
                    ...scenarioProjections.map(scenario =>
                        createElement('path', {
                            key: `path-${scenario.id}`,
                            d: createPath(scenario.data),
                            fill: 'none',
                            stroke: colors[scenario.color] || colors.blue,
                            strokeWidth: 3,
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round'
                        })
                    ),
                    
                    // Retirement age line
                    createElement('line', {
                        key: 'retirement-line',
                        x1: xScale(scenarios[0]?.data?.retirementAge || 67),
                        y1: margin.top,
                        x2: xScale(scenarios[0]?.data?.retirementAge || 67),
                        y2: margin.top + innerHeight,
                        stroke: '#DC2626',
                        strokeWidth: 2,
                        strokeDasharray: '5,5'
                    }),
                    
                    // Y-axis labels
                    ...Array.from({ length: 6 }, (_, i) => {
                        const value = (maxValue / 5) * (5 - i);
                        const y = margin.top + (innerHeight / 5) * i;
                        return createElement('text', {
                            key: `y-label-${i}`,
                            x: margin.left - 10,
                            y: y + 5,
                            textAnchor: 'end',
                            fontSize: '12',
                            fill: '#6B7280'
                        }, formatCurrency(value, workingCurrency, true));
                    }),
                    
                    // X-axis labels
                    ...Array.from({ length: 6 }, (_, i) => {
                        const age = minAge + ((maxAge - minAge) / 5) * i;
                        const x = xScale(age);
                        return createElement('text', {
                            key: `x-label-${i}`,
                            x: x,
                            y: height - 10,
                            textAnchor: 'middle',
                            fontSize: '12',
                            fill: '#6B7280'
                        }, Math.round(age));
                    }),
                    
                    // Axis labels
                    createElement('text', {
                        key: 'y-axis-label',
                        x: 20,
                        y: height / 2,
                        textAnchor: 'middle',
                        fontSize: '14',
                        fill: '#374151',
                        transform: `rotate(-90, 20, ${height / 2})`
                    }, chartTypes[chartType].yLabel),
                    
                    createElement('text', {
                        key: 'x-axis-label',
                        x: width / 2,
                        y: height - 5,
                        textAnchor: 'middle',
                        fontSize: '14',
                        fill: '#374151'
                    }, language === 'he' ? 'גיל' : 'Age')
                ])
            ]),
            
            // Legend
            createElement('div', {
                key: 'legend',
                className: 'flex flex-wrap justify-center mt-6 space-x-6'
            }, scenarioProjections.map(scenario =>
                createElement('div', {
                    key: `legend-${scenario.id}`,
                    className: 'flex items-center space-x-2'
                }, [
                    createElement('div', {
                        key: 'legend-color',
                        className: 'w-4 h-4 rounded',
                        style: { backgroundColor: colors[scenario.color] || colors.blue }
                    }),
                    createElement('span', {
                        key: 'legend-text',
                        className: 'text-sm font-medium text-gray-700'
                    }, scenario.name)
                ])
            ))
        ]);
    };

    // Create bar chart for comparison
    const createBarChart = () => {
        if (!scenarios.length) return null;
        
        const scenarioResults = scenarios.map(scenario => {
            if (!window.calculateRetirement) {
                return { ...scenario, result: { totalAccumulated: 0, monthlyIncome: 0 } };
            }
            
            try {
                const result = window.calculateRetirement(scenario.data);
                return { ...scenario, result };
            } catch (error) {
                return { ...scenario, result: { totalAccumulated: 0, monthlyIncome: 0 } };
            }
        });
        
        const maxValue = Math.max(...scenarioResults.map(s => s.result.totalAccumulated || 0));
        
        return createElement('div', {
            key: 'bar-chart',
            className: 'bg-white rounded-xl p-6 border border-gray-200'
        }, [
            createElement('h3', {
                key: 'bar-title',
                className: 'text-xl font-semibold text-gray-800 mb-6 text-center'
            }, language === 'he' ? 'השוואת תוצאות סופיות' : 'Final Results Comparison'),
            
            createElement('div', {
                key: 'bars-container',
                className: 'space-y-4'
            }, scenarioResults.map(scenario => {
                const value = scenario.result.totalAccumulated || 0;
                const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
                
                return createElement('div', {
                    key: `bar-${scenario.id}`,
                    className: 'space-y-2'
                }, [
                    createElement('div', {
                        key: 'bar-header',
                        className: 'flex justify-between items-center'
                    }, [
                        createElement('span', {
                            key: 'scenario-name',
                            className: 'font-medium text-gray-700'
                        }, scenario.name),
                        createElement('span', {
                            key: 'scenario-value',
                            className: 'font-bold text-gray-800'
                        }, formatCurrency(value, workingCurrency))
                    ]),
                    createElement('div', {
                        key: 'bar-bg',
                        className: 'w-full bg-gray-200 rounded-full h-4'
                    }, [
                        createElement('div', {
                            key: 'bar-fill',
                            className: `bg-${scenario.color}-500 h-4 rounded-full transition-all duration-500`,
                            style: { width: `${percentage}%` }
                        })
                    ])
                ]);
            }))
        ]);
    };

    // Format currency helper
    const formatCurrency = (amount, currency, abbreviated = false) => {
        if (window.formatCurrency) {
            return window.formatCurrency(amount, currency);
        }
        
        const symbols = { ILS: '₪', USD: '$', GBP: '£', EUR: '€' };
        const symbol = symbols[currency] || '₪';
        
        if (abbreviated && amount >= 1000000) {
            return `${symbol}${(amount / 1000000).toFixed(1)}M`;
        } else if (abbreviated && amount >= 1000) {
            return `${symbol}${(amount / 1000).toFixed(0)}K`;
        }
        
        return `${symbol}${Math.round(amount).toLocaleString()}`;
    };

    // Render different chart types
    switch (chartType) {
        case 'accumulation':
        case 'contributions':
        case 'income':
            return createLineChart();
        case 'comparison':
            return createBarChart();
        default:
            return createLineChart();
    }
};

// Export the component
window.ScenarioChart = ScenarioChart;

console.log('✅ ScenarioChart component loaded successfully');