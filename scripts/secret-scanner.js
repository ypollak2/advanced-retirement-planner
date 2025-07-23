#!/usr/bin/env node

/**
 * Semantic Secret Scanner CLI
 * 
 * Advanced AST-based secret detection with context awareness
 * Designed for fintech/crypto applications with intelligent filtering
 * 
 * Features:
 * - AST analysis for semantic context
 * - Cryptocurrency context filtering
 * - UI component prop recognition
 * - i18n/translation pattern detection
 * - .secretignore support
 * - Multiple output formats (JSON, Markdown, SARIF)
 * - CI/CD integration ready
 * 
 * @author AI Security Auditor
 */

const { program } = require('commander');
const SecretScanner = require('../lib/core/analyzer');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

// CLI Configuration
program
  .name('secret-scanner')
  .description('Semantic secret detection with context awareness')
  .version('1.0.0');

// Main scan command
program
  .command('scan')
  .description('Scan files for secrets and credentials')
  .option('-p, --path <path>', 'Path to scan (file or directory)', '.')
  .option('-i, --include <pattern>', 'Include files matching pattern')
  .option('-e, --exclude <pattern>', 'Exclude files matching pattern')
  .option('-f, --format <format>', 'Output format (console|json|markdown|sarif)', 'console')
  .option('-o, --output <file>', 'Output file path')
  .option('-s, --severity <level>', 'Minimum severity level (low|medium|high|critical)', 'medium')
  .option('-c, --config <file>', 'Configuration file path', '.secret-scanner.json')
  .option('--no-crypto-filter', 'Disable cryptocurrency context filtering')
  .option('--no-ui-filter', 'Disable UI component filtering')
  .option('--no-i18n-filter', 'Disable i18n/translation filtering')
  .option('--no-config-filter', 'Disable configuration file filtering')
  .option('--timeout <ms>', 'Timeout per file in milliseconds', '5000')
  .option('--concurrency <num>', 'Number of concurrent file scans', '5')
  .option('--stats', 'Show performance statistics')
  .action(async (options) => {
    try {
      console.log(chalk.blue('🔍 Semantic Secret Scanner v1.0.0'));
      console.log(chalk.gray('━'.repeat(50)));
      
      const startTime = Date.now();
      
      // Initialize scanner with options
      const scanner = new SecretScanner(options);
      
      // Load configuration if exists
      if (fs.existsSync(options.config)) {
        const config = JSON.parse(fs.readFileSync(options.config, 'utf8'));
        scanner.loadConfig(config);
      }
      
      // Perform scan
      console.log(chalk.yellow(`📂 Scanning: ${options.path}`));
      const results = await scanner.scanPath(options.path);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Generate report
      const report = scanner.generateReport(results, {
        format: options.format,
        includeStats: options.stats,
        duration: duration
      });
      
      // Output results
      if (options.output) {
        fs.writeFileSync(options.output, report);
        console.log(chalk.green(`📄 Report saved to: ${options.output}`));
      } else {
        console.log(report);
      }
      
      // Show summary
      const summary = scanner.getSummary(results);
      console.log(chalk.gray('━'.repeat(50)));
      console.log(chalk.cyan(`📊 Summary: ${summary.totalFindings} findings in ${summary.filesScanned} files`));
      console.log(chalk.gray(`⏱️  Duration: ${duration}ms`));
      
      // Exit with error code if critical/high severity findings
      const hasHighRisk = results.some(r => ['critical', 'high'].includes(r.severity));
      process.exit(hasHighRisk ? 1 : 0);
      
    } catch (error) {
      console.error(chalk.red('❌ Scan failed:'), error.message);
      process.exit(1);
    }
  });

// Configuration command
program
  .command('init')
  .description('Initialize configuration file')
  .option('-f, --force', 'Overwrite existing configuration')
  .action((options) => {
    const configPath = '.secret-scanner.json';
    
    if (fs.existsSync(configPath) && !options.force) {
      console.log(chalk.yellow('⚠️  Configuration file already exists. Use --force to overwrite.'));
      return;
    }
    
    const exampleConfig = fs.readFileSync(
      path.join(__dirname, '..', '.secret-scanner.example.json'),
      'utf8'
    );
    
    fs.writeFileSync(configPath, exampleConfig);
    console.log(chalk.green(`✅ Configuration file created: ${configPath}`));
  });

// Validate command
program
  .command('validate')
  .description('Validate configuration file')
  .option('-c, --config <file>', 'Configuration file path', '.secret-scanner.json')
  .action((options) => {
    try {
      if (!fs.existsSync(options.config)) {
        throw new Error('Configuration file not found');
      }
      
      const config = JSON.parse(fs.readFileSync(options.config, 'utf8'));
      console.log(chalk.green('✅ Configuration file is valid'));
      console.log(chalk.gray(`📁 Config: ${options.config}`));
      
    } catch (error) {
      console.error(chalk.red('❌ Configuration validation failed:'), error.message);
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse();