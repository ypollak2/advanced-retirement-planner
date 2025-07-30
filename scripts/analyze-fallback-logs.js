#!/usr/bin/env node
/**
 * Financial Health Fallback Log Analyzer
 * Part of TICKET-006: Zero Fallback Achievement
 * 
 * This script analyzes logs from the comprehensive e2e tests to identify
 * field mapping issues and generate recommendations for fixes.
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class FallbackAnalyzer {
    constructor() {
        this.analysis = {
            timestamp: new Date().toISOString(),
            totalScenarios: 0,
            totalFallbacks: 0,
            fallbacksByField: {},
            fallbacksByScenario: {},
            missingFieldPatterns: new Set(),
            fieldSuggestions: {},
            recommendations: [],
            criticalFields: [],
            fieldCategories: {
                salary: [],
                pension: [],
                trainingFund: [],
                portfolio: [],
                savings: [],
                expenses: [],
                partner: [],
                other: []
            }
        };
    }

    analyzeLogFile(filePath) {
        console.log(chalk.blue('📊 Analyzing fallback logs...'));
        
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            this.processTestResults(data.results || data);
            this.categorizeFields();
            this.generateRecommendations();
            this.generateReport();
        } catch (error) {
            console.error(chalk.red('Error reading log file:'), error.message);
            process.exit(1);
        }
    }

    processTestResults(results) {
        this.analysis.totalScenarios = results.length;
        
        results.forEach(result => {
            const scenarioName = result.scenario || result.name;
            const fallbacks = result.logs?.fallbacks || [];
            
            this.analysis.fallbacksByScenario[scenarioName] = {
                count: fallbacks.length,
                fields: [],
                inputs: result.inputs
            };
            
            this.analysis.totalFallbacks += fallbacks.length;
            
            fallbacks.forEach(fallback => {
                if (fallback.fields) {
                    fallback.fields.forEach(field => {
                        // Track field frequency
                        this.analysis.fallbacksByField[field] = 
                            (this.analysis.fallbacksByField[field] || 0) + 1;
                        
                        // Track which scenarios have this field missing
                        if (!this.analysis.fallbacksByScenario[scenarioName].fields.includes(field)) {
                            this.analysis.fallbacksByScenario[scenarioName].fields.push(field);
                        }
                        
                        // Add to patterns
                        this.analysis.missingFieldPatterns.add(field);
                        
                        // Generate suggestions
                        this.generateFieldSuggestions(field, result.inputs);
                    });
                }
            });
        });
    }

    generateFieldSuggestions(missingField, inputs) {
        if (!this.analysis.fieldSuggestions[missingField]) {
            this.analysis.fieldSuggestions[missingField] = {
                possibleMatches: [],
                relatedFields: [],
                suggestedMapping: null
            };
        }
        
        const suggestions = this.analysis.fieldSuggestions[missingField];
        const inputKeys = Object.keys(inputs);
        const fieldLower = missingField.toLowerCase();
        
        // Find exact or near matches
        inputKeys.forEach(key => {
            const keyLower = key.toLowerCase();
            const similarity = this.calculateSimilarity(fieldLower, keyLower);
            
            if (similarity > 0.7) {
                suggestions.possibleMatches.push({
                    field: key,
                    value: inputs[key],
                    similarity
                });
            }
            
            // Check for related fields
            if (this.areFieldsRelated(missingField, key)) {
                suggestions.relatedFields.push({
                    field: key,
                    value: inputs[key]
                });
            }
        });
        
        // Sort by similarity
        suggestions.possibleMatches.sort((a, b) => b.similarity - a.similarity);
        
        // Suggest the best mapping
        if (suggestions.possibleMatches.length > 0) {
            suggestions.suggestedMapping = suggestions.possibleMatches[0].field;
        }
    }

    calculateSimilarity(str1, str2) {
        // Simple similarity calculation
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        
        if (longer.length === 0) return 1.0;
        
        const editDistance = this.levenshteinDistance(longer, shorter);
        return (longer.length - editDistance) / longer.length;
    }

    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }

    areFieldsRelated(field1, field2) {
        const f1 = field1.toLowerCase();
        const f2 = field2.toLowerCase();
        
        // Check for common patterns
        const patterns = [
            ['salary', 'income', 'wage'],
            ['pension', 'retirement', '401k', 'ira'],
            ['training', 'fund', 'keren'],
            ['portfolio', 'investment', 'stock', 'bond'],
            ['savings', 'bank', 'cash', 'emergency'],
            ['expense', 'cost', 'spending'],
            ['partner', 'spouse', 'partner1', 'partner2']
        ];
        
        for (const pattern of patterns) {
            const field1Match = pattern.some(p => f1.includes(p));
            const field2Match = pattern.some(p => f2.includes(p));
            if (field1Match && field2Match) return true;
        }
        
        return false;
    }

    categorizeFields() {
        Object.keys(this.analysis.fallbacksByField).forEach(field => {
            const fieldLower = field.toLowerCase();
            
            if (fieldLower.includes('salary') || fieldLower.includes('income')) {
                this.analysis.fieldCategories.salary.push(field);
            } else if (fieldLower.includes('pension')) {
                this.analysis.fieldCategories.pension.push(field);
            } else if (fieldLower.includes('training') && fieldLower.includes('fund')) {
                this.analysis.fieldCategories.trainingFund.push(field);
            } else if (fieldLower.includes('portfolio') || fieldLower.includes('stock')) {
                this.analysis.fieldCategories.portfolio.push(field);
            } else if (fieldLower.includes('savings') || fieldLower.includes('bank')) {
                this.analysis.fieldCategories.savings.push(field);
            } else if (fieldLower.includes('expense')) {
                this.analysis.fieldCategories.expenses.push(field);
            } else if (fieldLower.includes('partner')) {
                this.analysis.fieldCategories.partner.push(field);
            } else {
                this.analysis.fieldCategories.other.push(field);
            }
        });
    }

    generateRecommendations() {
        // Sort fields by frequency
        const sortedFields = Object.entries(this.analysis.fallbacksByField)
            .sort((a, b) => b[1] - a[1]);
        
        sortedFields.forEach(([field, count]) => {
            const severity = count > 10 ? 'CRITICAL' : count > 5 ? 'HIGH' : 'MEDIUM';
            const suggestions = this.analysis.fieldSuggestions[field];
            
            const recommendation = {
                field,
                occurrences: count,
                severity,
                suggestedMapping: suggestions?.suggestedMapping,
                possibleMatches: suggestions?.possibleMatches || [],
                action: this.generateActionItem(field, suggestions)
            };
            
            this.analysis.recommendations.push(recommendation);
            
            if (severity === 'CRITICAL') {
                this.analysis.criticalFields.push(field);
            }
        });
    }

    generateActionItem(field, suggestions) {
        if (suggestions?.suggestedMapping) {
            return `Add '${field}' to field mapping dictionary, mapping to '${suggestions.suggestedMapping}'`;
        }
        
        const fieldLower = field.toLowerCase();
        
        // Generate specific recommendations based on field type
        if (fieldLower.includes('training') && fieldLower.includes('fund')) {
            return `Add '${field}' to trainingFundRate mappings in fieldMappingDictionary.js`;
        } else if (fieldLower.includes('pension')) {
            return `Add '${field}' to pension-related mappings in fieldMappingDictionary.js`;
        } else if (fieldLower.includes('salary')) {
            return `Add '${field}' to salary mappings in fieldMappingDictionary.js`;
        } else if (fieldLower.includes('partner')) {
            return `Add '${field}' to partner field mappings with proper partner1/partner2 handling`;
        }
        
        return `Investigate and add '${field}' to appropriate mapping category`;
    }

    generateReport() {
        console.log(chalk.cyan('\n' + '='.repeat(60)));
        console.log(chalk.cyan.bold('FALLBACK ANALYSIS REPORT'));
        console.log(chalk.cyan('='.repeat(60)));
        
        // Summary
        console.log(chalk.white('\n📊 SUMMARY:'));
        console.log(`Total Scenarios Tested: ${chalk.blue(this.analysis.totalScenarios)}`);
        console.log(`Total Fallback Warnings: ${chalk.red(this.analysis.totalFallbacks)}`);
        console.log(`Unique Missing Fields: ${chalk.yellow(this.analysis.missingFieldPatterns.size)}`);
        console.log(`Critical Fields: ${chalk.red(this.analysis.criticalFields.length)}`);
        
        // Field Categories
        console.log(chalk.white('\n📁 FIELD CATEGORIES:'));
        Object.entries(this.analysis.fieldCategories).forEach(([category, fields]) => {
            if (fields.length > 0) {
                console.log(`${chalk.blue(category)}: ${fields.length} fields`);
            }
        });
        
        // Top Missing Fields
        console.log(chalk.white('\n🔝 TOP 10 MISSING FIELDS:'));
        const topFields = Object.entries(this.analysis.fallbacksByField)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        
        topFields.forEach(([field, count], index) => {
            const severity = count > 10 ? chalk.red('[CRITICAL]') : 
                           count > 5 ? chalk.yellow('[HIGH]') : 
                           chalk.blue('[MEDIUM]');
            console.log(`${index + 1}. ${severity} ${field}: ${count} occurrences`);
        });
        
        // Critical Recommendations
        console.log(chalk.white('\n🚨 CRITICAL RECOMMENDATIONS:'));
        this.analysis.recommendations
            .filter(r => r.severity === 'CRITICAL')
            .forEach(rec => {
                console.log(chalk.red(`\n• Field: ${rec.field}`));
                console.log(`  Occurrences: ${rec.occurrences}`);
                if (rec.suggestedMapping) {
                    console.log(chalk.green(`  ✓ Suggested Mapping: ${rec.suggestedMapping}`));
                }
                console.log(`  Action: ${rec.action}`);
            });
        
        // Scenarios with most fallbacks
        console.log(chalk.white('\n📋 SCENARIOS WITH MOST FALLBACKS:'));
        const scenarioList = Object.entries(this.analysis.fallbacksByScenario)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 5);
        
        scenarioList.forEach(([scenario, data]) => {
            console.log(`\n${chalk.yellow(scenario)}: ${data.count} fallbacks`);
            console.log(`  Missing: ${data.fields.slice(0, 5).join(', ')}${data.fields.length > 5 ? '...' : ''}`);
        });
        
        // Export paths
        console.log(chalk.white('\n💾 EXPORT RECOMMENDATIONS:'));
        console.log('1. Run the comprehensive e2e test');
        console.log('2. Export logs using the "Export Logs" button');
        console.log('3. Run this analyzer on the exported JSON');
        console.log('4. Implement the field mappings suggested above');
        
        // Save detailed report
        this.saveDetailedReport();
    }

    saveDetailedReport() {
        const reportPath = path.join(process.cwd(), `fallback-analysis-${Date.now()}.json`);
        
        const report = {
            ...this.analysis,
            missingFieldPatterns: Array.from(this.analysis.missingFieldPatterns),
            generatedMappings: this.generateFieldMappingCode()
        };
        
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(chalk.green(`\n✅ Detailed report saved to: ${reportPath}`));
    }

    generateFieldMappingCode() {
        const mappings = {};
        
        // Group fields by category and generate mapping code
        Object.entries(this.analysis.fieldCategories).forEach(([category, fields]) => {
            if (fields.length > 0) {
                mappings[category] = fields.map(field => {
                    const suggestions = this.analysis.fieldSuggestions[field];
                    return {
                        missingField: field,
                        suggestedMapping: suggestions?.suggestedMapping || null,
                        mappingCode: `'${field}'${suggestions?.suggestedMapping ? ` // Maps to: ${suggestions.suggestedMapping}` : ''}`
                    };
                });
            }
        });
        
        return mappings;
    }
}

// Main execution
function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log(chalk.yellow('Usage: node analyze-fallback-logs.js <log-file.json>'));
        console.log(chalk.yellow('Example: node analyze-fallback-logs.js financial-health-test-logs-1234567890.json'));
        process.exit(1);
    }
    
    const logFile = args[0];
    
    if (!fs.existsSync(logFile)) {
        console.error(chalk.red(`Error: File not found: ${logFile}`));
        process.exit(1);
    }
    
    const analyzer = new FallbackAnalyzer();
    analyzer.analyzeLogFile(logFile);
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = FallbackAnalyzer;