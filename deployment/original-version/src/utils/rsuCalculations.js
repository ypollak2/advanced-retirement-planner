// RSU (Restricted Stock Units) Calculations
// Handles RSU taxation and valuation for Israeli and US contexts

class RSUCalculations {
    constructor() {
        this.COMPANY_STOCKS = {
            'AAPL': { name: 'Apple Inc.', sector: 'Technology' },
            'GOOGL': { name: 'Alphabet Inc.', sector: 'Technology' },
            'MSFT': { name: 'Microsoft Corporation', sector: 'Technology' },
            'AMZN': { name: 'Amazon.com Inc.', sector: 'Technology' },
            'TSLA': { name: 'Tesla Inc.', sector: 'Automotive' },
            'META': { name: 'Meta Platforms Inc.', sector: 'Technology' },
            'NVDA': { name: 'NVIDIA Corporation', sector: 'Technology' },
            'NFLX': { name: 'Netflix Inc.', sector: 'Technology' },
            'CRM': { name: 'Salesforce Inc.', sector: 'Technology' },
            'ADBE': { name: 'Adobe Inc.', sector: 'Technology' },
            'ORCL': { name: 'Oracle Corporation', sector: 'Technology' },
            'NOW': { name: 'ServiceNow Inc.', sector: 'Technology' },
            'SHOP': { name: 'Shopify Inc.', sector: 'E-commerce' },
            'SPOT': { name: 'Spotify Technology', sector: 'Media' },
            'ZM': { name: 'Zoom Video Communications', sector: 'Technology' },
            'UBER': { name: 'Uber Technologies Inc.', sector: 'Transportation' },
            'ABNB': { name: 'Airbnb Inc.', sector: 'Travel' },
            'COIN': { name: 'Coinbase Global Inc.', sector: 'Fintech' },
            'PLTR': { name: 'Palantir Technologies', sector: 'Technology' },
            'SNOW': { name: 'Snowflake Inc.', sector: 'Technology' }
        };
    }

    // Get company suggestions based on user input
    getCompanySuggestions(query) {
        if (!query || query.length < 1) return [];
        
        const searchTerm = query.toLowerCase();
        const suggestions = [];
        
        Object.entries(this.COMPANY_STOCKS).forEach(([symbol, company]) => {
            if (symbol.toLowerCase().includes(searchTerm) || 
                company.name.toLowerCase().includes(searchTerm)) {
                suggestions.push({
                    symbol,
                    name: company.name,
                    sector: company.sector,
                    display: `${symbol} - ${company.name}`
                });
            }
        });
        
        return suggestions.slice(0, 10); // Limit to 10 suggestions
    }

    // Fetch stock price from Yahoo Finance API (mock implementation)
    async fetchStockPrice(symbol) {
        try {
            // In a real implementation, this would call Yahoo Finance API
            // For now, return mock data with realistic prices
            const mockPrices = {
                'AAPL': 175.50,
                'GOOGL': 135.25,
                'MSFT': 415.75,
                'AMZN': 145.30,
                'TSLA': 245.80,
                'META': 485.20,
                'NVDA': 875.40,
                'NFLX': 485.60,
                'CRM': 285.30,
                'ADBE': 585.75
            };
            
            const price = mockPrices[symbol] || 100.00;
            
            return {
                symbol,
                price,
                currency: 'USD',
                lastUpdated: new Date().toISOString(),
                source: 'Yahoo Finance (Mock)'
            };
        } catch (error) {
            console.error(`Error fetching price for ${symbol}:`, error);
            return {
                symbol,
                price: 100.00,
                currency: 'USD',
                lastUpdated: new Date().toISOString(),
                source: 'Fallback',
                error: error.message
            };
        }
    }

    // Calculate RSU taxation for Israeli residents
    calculateIsraeliTax(rsuValue, annualSalary) {
        // Israeli tax brackets for 2024 (in NIS)
        const brackets = [
            { min: 0, max: 77040, rate: 0.10 },
            { min: 77040, max: 110280, rate: 0.14 },
            { min: 110280, max: 177480, rate: 0.20 },
            { min: 177480, max: 247440, rate: 0.31 },
            { min: 247440, max: 663240, rate: 0.35 },
            { min: 663240, max: Infinity, rate: 0.47 }
        ];

        const totalIncome = annualSalary + rsuValue;
        let totalTax = 0;
        let remainingIncome = totalIncome;

        for (const bracket of brackets) {
            if (remainingIncome <= 0) break;
            
            const taxableInBracket = Math.min(
                remainingIncome, 
                bracket.max - bracket.min
            );
            
            totalTax += taxableInBracket * bracket.rate;
            remainingIncome -= taxableInBracket;
        }

        // Calculate marginal tax on RSU value
        const salaryTax = this.calculateIsraeliTax(0, annualSalary).totalTax;
        const rsuTax = totalTax - salaryTax;

        return {
            totalTax,
            rsuTax,
            netRsuValue: rsuValue - rsuTax,
            effectiveRate: rsuTax / rsuValue,
            currency: 'ILS'
        };
    }

    // Calculate RSU taxation for US residents
    calculateUSTax(rsuValue, annualSalary, state = 'CA') {
        // US federal tax brackets for 2024 (single filer, in USD)
        const federalBrackets = [
            { min: 0, max: 11000, rate: 0.10 },
            { min: 11000, max: 44725, rate: 0.12 },
            { min: 44725, max: 95375, rate: 0.22 },
            { min: 95375, max: 182050, rate: 0.24 },
            { min: 182050, max: 231250, rate: 0.32 },
            { min: 231250, max: 578125, rate: 0.35 },
            { min: 578125, max: Infinity, rate: 0.37 }
        ];

        // California state tax (example)
        const stateTaxRate = state === 'CA' ? 0.093 : 0.05; // Approximate rates
        
        const totalIncome = annualSalary + rsuValue;
        let federalTax = 0;
        let remainingIncome = totalIncome;

        for (const bracket of federalBrackets) {
            if (remainingIncome <= 0) break;
            
            const taxableInBracket = Math.min(
                remainingIncome, 
                bracket.max - bracket.min
            );
            
            federalTax += taxableInBracket * bracket.rate;
            remainingIncome -= taxableInBracket;
        }

        const stateTax = rsuValue * stateTaxRate;
        const ficaTax = rsuValue * 0.0765; // Social Security + Medicare
        const totalTax = federalTax + stateTax + ficaTax;

        // Calculate marginal tax on RSU value
        const salaryFederalTax = this.calculateUSTax(0, annualSalary, state).federalTax;
        const rsuFederalTax = federalTax - salaryFederalTax;
        const totalRsuTax = rsuFederalTax + stateTax + ficaTax;

        return {
            federalTax,
            stateTax,
            ficaTax,
            totalTax: totalRsuTax,
            netRsuValue: rsuValue - totalRsuTax,
            effectiveRate: totalRsuTax / rsuValue,
            currency: 'USD'
        };
    }

    // Calculate total RSU value over vesting period
    calculateRsuProjection(inputs) {
        const {
            rsuUnits = 0,
            rsuStockPrice = 100,
            vestingSchedule = 'quarterly', // quarterly, annual, cliff
            vestingPeriodYears = 4,
            expectedGrowthRate = 0.1, // 10% annual growth
            taxCountry = 'Israel',
            annualSalary = 300000
        } = inputs;

        const projections = [];
        const totalUnits = parseInt(rsuUnits) || 0;
        const initialPrice = parseFloat(rsuStockPrice) || 100;
        const growthRate = parseFloat(expectedGrowthRate) / 100 || 0.1;
        const vestingYears = parseInt(vestingPeriodYears) || 4;

        // Determine vesting schedule
        let vestingEvents;
        switch (vestingSchedule) {
            case 'quarterly':
                vestingEvents = vestingYears * 4;
                break;
            case 'annual':
                vestingEvents = vestingYears;
                break;
            case 'cliff':
                vestingEvents = 1; // All at once after vesting period
                break;
            default:
                vestingEvents = vestingYears * 4; // Default to quarterly
        }

        const unitsPerEvent = totalUnits / vestingEvents;
        const monthsBetweenEvents = (vestingYears * 12) / vestingEvents;

        for (let event = 1; event <= vestingEvents; event++) {
            const monthsFromNow = event * monthsBetweenEvents;
            const yearsFromNow = monthsFromNow / 12;
            
            // Calculate stock price with growth
            const futurePrice = initialPrice * Math.pow(1 + growthRate, yearsFromNow);
            const vestingValue = unitsPerEvent * futurePrice;
            
            // Calculate taxes based on country
            let taxCalculation;
            if (taxCountry === 'USA') {
                taxCalculation = this.calculateUSTax(vestingValue, annualSalary);
            } else {
                // Convert to NIS for Israeli taxation (approximate rate: 1 USD = 3.7 NIS)
                const vestingValueNIS = vestingValue * 3.7;
                const annualSalaryNIS = annualSalary * 3.7;
                taxCalculation = this.calculateIsraeliTax(vestingValueNIS, annualSalaryNIS);
            }

            projections.push({
                event,
                date: new Date(Date.now() + monthsFromNow * 30 * 24 * 60 * 60 * 1000),
                monthsFromNow: Math.round(monthsFromNow),
                unitsVesting: unitsPerEvent,
                stockPrice: futurePrice,
                grossValue: vestingValue,
                taxAmount: taxCalculation.totalTax || taxCalculation.rsuTax,
                netValue: taxCalculation.netRsuValue,
                effectiveTaxRate: taxCalculation.effectiveRate,
                cumulativeUnits: event * unitsPerEvent,
                cumulativeGrossValue: projections.reduce((sum, p) => sum + p.grossValue, 0) + vestingValue,
                cumulativeNetValue: projections.reduce((sum, p) => sum + p.netValue, 0) + taxCalculation.netRsuValue
            });
        }

        return projections;
    }

    // Get summary statistics for RSU projections
    getRsuSummary(projections) {
        if (!projections || projections.length === 0) {
            return {
                totalGrossValue: 0,
                totalNetValue: 0,
                totalTaxes: 0,
                averageTaxRate: 0,
                totalUnits: 0,
                vestingPeriodMonths: 0
            };
        }

        const final = projections[projections.length - 1];
        const totalTaxes = projections.reduce((sum, p) => sum + p.taxAmount, 0);
        const totalGross = final.cumulativeGrossValue;
        
        return {
            totalGrossValue: totalGross,
            totalNetValue: final.cumulativeNetValue,
            totalTaxes,
            averageTaxRate: totalTaxes / totalGross,
            totalUnits: final.cumulativeUnits,
            vestingPeriodMonths: final.monthsFromNow,
            numberOfVestingEvents: projections.length
        };
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RSUCalculations;
} else {
    window.RSUCalculations = RSUCalculations;
}