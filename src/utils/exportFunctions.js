// Export Functions for Advanced Retirement Planner
// Created by Yali Pollak (יהלי פולק) - v7.5.1

// Export retirement plan as image (PNG/PDF)
async function exportAsImage(format = 'png', includeCharts = true) {
    try {
        // Use html2canvas for capturing the page as image
        if (typeof html2canvas === 'undefined') {
            // Dynamically load html2canvas if not available
            await loadHtml2Canvas();
        }

        const container = document.getElementById('root');
        if (!container) {
            throw new Error('No content container found');
        }

        // Configure html2canvas options
        const options = {
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#f8fafc',
            scale: 2, // Higher resolution
            width: container.scrollWidth,
            height: container.scrollHeight,
            scrollX: 0,
            scrollY: 0,
            ignoreElements: (element) => {
                // Skip certain elements like buttons that shouldn't be in export
                return element.classList.contains('export-ignore') ||
                       element.tagName === 'BUTTON' && !element.classList.contains('export-include');
            }
        };

        console.log('🖼️ Starting image export...');
        const canvas = await html2canvas(container, options);
        
        if (format === 'pdf') {
            return await exportCanvasAsPDF(canvas);
        } else {
            return exportCanvasAsPNG(canvas);
        }
    } catch (error) {
        console.error('❌ Export as image failed:', error);
        throw error;
    }
}

// Export canvas as PNG
function exportCanvasAsPNG(canvas) {
    try {
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
        link.download = `retirement-plan-${timestamp}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('✅ PNG export completed');
        return { success: true, format: 'png', size: canvas.toDataURL().length };
    } catch (error) {
        console.error('❌ PNG export failed:', error);
        throw error;
    }
}

// Export canvas as PDF using jsPDF
async function exportCanvasAsPDF(canvas) {
    try {
        // Dynamically load jsPDF if not available
        if (typeof window.jsPDF === 'undefined') {
            await loadJsPDF();
        }

        // Check if jsPDF is properly loaded
        const jsPDF = window.jsPDF || window.jspdf?.jsPDF;
        if (!jsPDF || typeof jsPDF !== 'function') {
            throw new Error('jsPDF constructor not available after loading');
        }
        
        const imgData = canvas.toDataURL('image/png', 1.0);
        
        // Calculate PDF dimensions
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(210 / imgWidth, 297 / imgHeight); // A4 size in mm
        const pdfWidth = imgWidth * ratio;
        const pdfHeight = imgHeight * ratio;
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
        pdf.save(`retirement-plan-${timestamp}.pdf`);
        
        console.log('✅ PDF export completed');
        return { success: true, format: 'pdf', pages: 1 };
    } catch (error) {
        console.error('❌ PDF export failed:', error);
        throw error;
    }
}

// Export data for LLM analysis
function exportForLLMAnalysis(inputs, results, partnerResults = null) {
    try {
        const analysisData = {
            metadata: {
                exportDate: new Date().toISOString(),
                version: 'v7.5.1',
                tool: 'Advanced Retirement Planner by Yali Pollak',
                purpose: 'LLM Analysis and Recommendations'
            },
            personalInfo: {
                currentAge: inputs.currentAge,
                retirementAge: inputs.retirementAge,
                planningType: inputs.planningType || 'individual',
                riskTolerance: inputs.riskTolerance
            },
            financialData: {
                currentSavings: inputs.currentSavings,
                currentSalary: inputs.currentSalary,
                monthlyExpenses: inputs.currentMonthlyExpenses,
                targetReplacement: inputs.targetReplacement,
                inflationRate: inputs.inflationRate
            },
            investmentPortfolio: {
                trainingFund: {
                    current: inputs.currentTrainingFund,
                    return: inputs.trainingFundReturn,
                    managementFee: inputs.trainingFundManagementFee
                },
                personalPortfolio: {
                    current: inputs.currentPersonalPortfolio,
                    monthly: inputs.personalPortfolioMonthly,
                    return: inputs.personalPortfolioReturn,
                    taxRate: inputs.personalPortfolioTaxRate
                },
                realEstate: {
                    current: inputs.currentRealEstate,
                    monthly: inputs.realEstateMonthly,
                    return: inputs.realEstateReturn,
                    rentalYield: inputs.realEstateRentalYield
                },
                cryptocurrency: {
                    current: inputs.currentCrypto,
                    monthly: inputs.cryptoMonthly,
                    return: inputs.cryptoReturn
                }
            },
            rsuData: inputs.rsuCompany ? {
                company: inputs.rsuCompany,
                currentStockPrice: inputs.rsuCurrentStockPrice,
                totalShares: inputs.rsuTotalShares,
                vestingYears: inputs.rsuVestingYears
            } : null,
            projectionResults: {
                totalSavingsAtRetirement: results?.totalSavings,
                monthlyPensionIncome: results?.monthlyIncome,
                readinessScore: results?.readinessScore,
                yearsToRetirement: results?.yearsToRetirement,
                inflationAdjustedValues: results?.inflationAdjusted
            },
            partnerData: partnerResults ? {
                partner1: partnerResults.partner1,
                partner2: partnerResults.partner2,
                combined: partnerResults.combined
            } : null,
            recommendationAreas: [
                'asset_allocation_optimization',
                'savings_rate_improvement', 
                'tax_optimization_strategies',
                'risk_management',
                'retirement_timing_analysis',
                'diversification_opportunities',
                'cost_reduction_strategies',
                'income_replacement_strategies'
            ]
        };

        const jsonString = JSON.stringify(analysisData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
        link.download = `retirement-analysis-${timestamp}.json`;
        link.href = url;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log('✅ LLM analysis export completed');
        return { success: true, format: 'json', dataSize: jsonString.length };
    } catch (error) {
        console.error('❌ LLM analysis export failed:', error);
        throw error;
    }
}

// Generate Claude-specific recommendations prompt
function generateClaudeRecommendationsPrompt(inputs, results, partnerResults = null) {
    const prompt = `
Please analyze this retirement planning data and provide comprehensive, personalized recommendations:

**Personal Information:**
- Current Age: ${inputs.currentAge}
- Target Retirement Age: ${inputs.retirementAge}
- Planning Type: ${inputs.planningType || 'individual'}
- Risk Tolerance: ${inputs.riskTolerance}

**Current Financial Situation:**
- Current Savings: ₪${inputs.currentSavings?.toLocaleString()}
- Current Salary: ₪${inputs.currentSalary?.toLocaleString()}/month
- Monthly Expenses: ₪${inputs.currentMonthlyExpenses?.toLocaleString()}
- Target Income Replacement: ${inputs.targetReplacement}%

**Investment Portfolio:**
- Training Fund: ₪${inputs.currentTrainingFund?.toLocaleString()} (${inputs.trainingFundReturn}% return)
- Personal Portfolio: ₪${inputs.currentPersonalPortfolio?.toLocaleString()} + ₪${inputs.personalPortfolioMonthly}/month
- Real Estate: ₪${inputs.currentRealEstate?.toLocaleString()}
- Cryptocurrency: ₪${inputs.currentCrypto?.toLocaleString()}

**Projected Results:**
- Total Savings at Retirement: ₪${results?.totalSavings?.toLocaleString()}
- Monthly Pension Income: ₪${results?.monthlyIncome?.toLocaleString()}
- Retirement Readiness Score: ${results?.readinessScore || 'N/A'}

Please provide specific, actionable recommendations for:
1. **Asset Allocation Optimization** - How to improve portfolio balance
2. **Savings Rate Enhancement** - Strategies to increase monthly contributions
3. **Tax Optimization** - Legal methods to reduce tax burden
4. **Risk Management** - Insurance and diversification strategies
5. **Timeline Analysis** - Whether to adjust retirement age
6. **Investment Opportunities** - Specific asset classes or instruments to consider
7. **Cost Reduction** - Ways to minimize fees and expenses
8. **Income Strategies** - Post-retirement income generation methods

Focus on actionable advice specific to Israeli retirement planning, tax laws, and investment options.
`;

    return prompt.trim();
}

// Copy Claude prompt to clipboard
async function copyClaudePromptToClipboard(inputs, results, partnerResults = null) {
    try {
        const prompt = generateClaudeRecommendationsPrompt(inputs, results, partnerResults);
        
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(prompt);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = prompt;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
        
        console.log('✅ Claude prompt copied to clipboard');
        return { success: true, promptLength: prompt.length };
    } catch (error) {
        console.error('❌ Failed to copy Claude prompt:', error);
        throw error;
    }
}

// Dynamically load html2canvas library
async function loadHtml2Canvas() {
    return new Promise((resolve, reject) => {
        if (typeof html2canvas !== 'undefined') {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.crossOrigin = 'anonymous';
        script.onload = () => {
            console.log('✅ html2canvas loaded successfully');
            resolve();
        };
        script.onerror = (error) => {
            console.error('❌ Failed to load html2canvas from CDN:', error);
            // Try fallback URL
            const fallbackScript = document.createElement('script');
            fallbackScript.src = 'https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js';
            fallbackScript.crossOrigin = 'anonymous';
            fallbackScript.onload = () => {
                console.log('✅ html2canvas loaded from fallback CDN');
                resolve();
            };
            fallbackScript.onerror = () => {
                reject(new Error('Failed to load html2canvas from both primary and fallback CDNs'));
            };
            document.head.appendChild(fallbackScript);
        };
        document.head.appendChild(script);
    });
}

// Dynamically load jsPDF library
async function loadJsPDF() {
    return new Promise((resolve, reject) => {
        // Check if jsPDF is already available in various forms
        if (typeof window.jsPDF !== 'undefined' || typeof window.jspdf?.jsPDF !== 'undefined' || typeof jsPDF !== 'undefined') {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.crossOrigin = 'anonymous';
        script.onload = () => {
            // Verify jsPDF is properly available after loading
            if (typeof window.jsPDF !== 'undefined' || typeof window.jspdf?.jsPDF !== 'undefined') {
                console.log('✅ jsPDF loaded successfully');
                resolve();
            } else {
                console.error('❌ jsPDF loaded but constructor not found');
                reject(new Error('jsPDF constructor not found after script load'));
            }
        };
        script.onerror = (error) => {
            console.error('❌ Failed to load jsPDF from CDN:', error);
            // Try fallback URL
            const fallbackScript = document.createElement('script');
            fallbackScript.src = 'https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js';
            fallbackScript.crossOrigin = 'anonymous';
            fallbackScript.onload = () => {
                if (typeof window.jsPDF !== 'undefined' || typeof window.jspdf?.jsPDF !== 'undefined') {
                    console.log('✅ jsPDF loaded from fallback CDN');
                    resolve();
                } else {
                    reject(new Error('jsPDF constructor not found after fallback load'));
                }
            };
            fallbackScript.onerror = () => {
                reject(new Error('Failed to load jsPDF from both primary and fallback CDNs'));
            };
            document.head.appendChild(fallbackScript);
        };
        document.head.appendChild(script);
    });
}

// Export functions to window for global access
window.exportAsImage = exportAsImage;
window.exportForLLMAnalysis = exportForLLMAnalysis;
window.generateClaudeRecommendationsPrompt = generateClaudeRecommendationsPrompt;
window.copyClaudePromptToClipboard = copyClaudePromptToClipboard;

// Also make it available as a module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        exportAsImage,
        exportForLLMAnalysis,
        generateClaudeRecommendationsPrompt,
        copyClaudePromptToClipboard
    };
}