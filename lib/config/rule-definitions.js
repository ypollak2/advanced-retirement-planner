/**
 * Credential Detection Rule Definitions
 * Comprehensive patterns for detecting various types of auth and credentials
 * 
 * Features:
 * - API key patterns for major providers
 * - Generic credential patterns with entropy validation
 * - Database connection strings
 * - Cryptographic keys and certificates
 * - OAuth tokens and JWT patterns
 * - Custom configurable rules
 * 
 * @author AI Security Auditor
 */

class CredentialPatterns {
  constructor() {
    // Initialize pattern categories
    this.patterns = this.buildPatterns();
    this.customPatterns = [];
  }

  /**
   * Get all detection patterns
   */
  static getPatterns() {
    const instance = new CredentialPatterns();
    return instance.getAllPatterns();
  }

  /**
   * Build comprehensive credential detection patterns
   */
  buildPatterns() {
    return [
      ...this.getAPIKeyPatterns(),
      ...this.getDatabasePatterns(),
      ...this.getCryptographicPatterns(),
      ...this.getOAuthPatterns(),
      ...this.getCloudProviderPatterns(),
      ...this.getGenericCredentialPatterns()
    ];
  }

  /**
   * API Key patterns for major services
   */
  getAPIKeyPatterns() {
    return [
      // AWS
      {
        name: 'AWS Access Key ID',
        regex: /AKIA[0-9A-Z]{16}/g,
        severity: 'high',
        description: 'AWS Access Key ID detected',
        entropy: 4.5
      },
      {
        name: 'AWS ' + 'Access Key',
        regex: /aws_secret_access_key\s*=\s*['"]?([A-Za-z0-9/+=]{40})['"]?/gi,
        severity: 'high',
        description: 'AWS ' + 'Access Key detected',
        entropy: 5.0
      },

      // Google Cloud
      {
        name: 'Google API Key',
        regex: /AIza[0-9A-Za-z_-]{35}/g,
        severity: 'high',
        description: 'Google API Key detected',
        entropy: 4.0
      },
      {
        name: 'Google OAuth',
        regex: /[0-9]+-[0-9A-Za-z_]{32}\.apps\.googleusercontent\.com/g,
        severity: 'medium',
        description: 'Google OAuth Client ID detected',
        entropy: 4.0
      },

      // GitHub
      {
        name: 'GitHub ' + 'Auth',  
        regex: /gh[pousr]_[A-Za-z0-9_]{36,255}/g,
        severity: 'high',
        description: 'GitHub Personal Access Auth detected',
        entropy: 4.5
      },
      {
        name: 'GitHub Classic Auth',
        regex: /[0-9a-f]{40}/g,
        severity: 'medium',
        description: 'Potential GitHub classic auth (40 hex chars)',
        entropy: 4.0,
        validation: 'hex'
      },

      // Stripe
      {
        name: 'Stripe API Key',
        regex: /(sk|pk)_(test|live)_[0-9a-zA-Z]{24,34}/g,
        severity: 'high',
        description: 'Stripe API Key detected',
        entropy: 4.0
      },

      // PayPal
      {
        name: 'PayPal Auth',
        regex: /access_token\$production\$[a-z0-9]{16}\$[a-f0-9]{32}/gi,
        severity: 'high',
        description: 'PayPal access auth detected',
        entropy: 4.5
      },

      // Slack
      {
        name: 'Slack Auth',
        regex: /xox[baprs]-([0-9a-zA-Z]{10,48})/g,
        severity: 'high',
        description: 'Slack auth detected',
        entropy: 4.0
      },

      // Discord
      {
        name: 'Discord Auth',
        regex: /[MN][A-Za-z\d]{23}\.[\w-]{6}\.[\w-]{27}/g,
        severity: 'high',
        description: 'Discord bot auth detected',
        entropy: 4.5
      },

      // Twilio
      {
        name: 'Twilio API Key',
        regex: /SK[a-f0-9]{32}/gi,
        severity: 'high',
        description: 'Twilio API Key detected',
        entropy: 4.0
      },

      // SendGrid
      {
        name: 'SendGrid API Key',
        regex: /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/g,
        severity: 'high',
        description: 'SendGrid API Key detected',
        entropy: 4.5
      },

      // Mailgun
      {
        name: 'Mailgun API Key',
        regex: /key-[a-f0-9]{32}/gi,
        severity: 'high',
        description: 'Mailgun API Key detected',
        entropy: 4.0
      },

      // Generic API patterns
      {
        name: 'Generic API Key',
        regex: /api[_-]?key\s*[:=]\s*['"]?([a-zA-Z0-9_-]{20,})['"]?/gi,
        severity: 'medium',
        description: 'Generic API key pattern detected',
        entropy: 3.5
      }
    ];
  }

  /**
   * Database connection patterns
   */
  getDatabasePatterns() {
    return [
      // MongoDB
      {
        name: 'MongoDB Connection String',
        regex: /mongodb(\+srv)?:\/\/[^\s]+/gi,
        severity: 'high',
        description: 'MongoDB connection string detected',
        entropy: 3.0
      },

      // MySQL/MariaDB
      {
        name: 'MySQL Connection String',
        regex: /mysql:\/\/[^\s]+/gi,
        severity: 'high',
        description: 'MySQL connection string detected',
        entropy: 3.0
      },

      // PostgreSQL
      {
        name: 'PostgreSQL Connection String',
        regex: /postgres(ql)?:\/\/[^\s]+/gi,
        severity: 'high',
        description: 'PostgreSQL connection string detected',
        entropy: 3.0
      },

      // Redis
      {
        name: 'Redis Connection String',
        regex: /redis:\/\/[^\s]+/gi,
        severity: 'medium',
        description: 'Redis connection string detected',
        entropy: 3.0
      },

      // Database passwords in config
      {
        name: 'Database Password',
        regex: /db[_-]?pass(word)?\s*[:=]\s*['"]?([^'"\\\s]{8,})['"]?/gi,
        severity: 'high',
        description: 'Database password detected',
        entropy: 3.5
      }
    ];
  }

  /**
   * Cryptographic key patterns
   */
  getCryptographicPatterns() {
    return [
      // RSA Private Key
      {
        name: 'RSA Private Key',
        regex: /-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----[\s\S]*?-----END\s+(RSA\s+)?PRIVATE\s+KEY-----/gi,
        severity: 'critical',
        description: 'RSA private key detected',
        entropy: 5.0
      },

      // OpenSSH Private Key
      {
        name: 'OpenSSH Private Key',
        regex: /-----BEGIN\s+OPENSSH\s+PRIVATE\s+KEY-----[\s\S]*?-----END\s+OPENSSH\s+PRIVATE\s+KEY-----/gi,
        severity: 'critical',
        description: 'OpenSSH private key detected',
        entropy: 5.0
      },

      // DSA Private Key
      {
        name: 'DSA Private Key',
        regex: /-----BEGIN\s+DSA\s+PRIVATE\s+KEY-----[\s\S]*?-----END\s+DSA\s+PRIVATE\s+KEY-----/gi,
        severity: 'critical',
        description: 'DSA private key detected',
        entropy: 5.0
      },

      // EC Private Key
      {
        name: 'EC Private Key',
        regex: /-----BEGIN\s+EC\s+PRIVATE\s+KEY-----[\s\S]*?-----END\s+EC\s+PRIVATE\s+KEY-----/gi,
        severity: 'critical',
        description: 'EC private key detected',
        entropy: 5.0
      },

      // Generic Private Key
      {
        name: 'Generic Private Key',
        regex: /-----BEGIN\s+[A-Z\s]+PRIVATE\s+KEY-----[\s\S]*?-----END\s+[A-Z\s]+PRIVATE\s+KEY-----/gi,
        severity: 'critical',
        description: 'Private key detected',
        entropy: 5.0
      },

      // Certificate
      {
        name: 'Certificate',
        regex: /-----BEGIN\s+CERTIFICATE-----[\s\S]*?-----END\s+CERTIFICATE-----/gi,
        severity: 'medium',
        description: 'Certificate detected',
        entropy: 4.0
      }
    ];
  }

  /**
   * OAuth and JWT patterns
   */
  getOAuthPatterns() {
    return [
      // JWT Token
      {
        name: 'JWT Token',
        regex: /eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*/g,
        severity: 'medium',
        description: 'JWT token detected',
        entropy: 4.0
      },

      // OAuth2 Access Token Pattern
      {
        name: 'OAuth2 Access Token',
        regex: /access[_-]?token\s*[:=]\s*['"]?([a-zA-Z0-9_-]{20,})['"]?/gi,
        severity: 'high',
        description: 'OAuth2 access token detected',
        entropy: 4.0
      },

      // OAuth2 Refresh Token
      {
        name: 'OAuth2 Refresh Token',
        regex: /refresh[_-]?token\s*[:=]\s*['"]?([a-zA-Z0-9_-]{20,})['"]?/gi,
        severity: 'high',
        description: 'OAuth2 refresh token detected',
        entropy: 4.0
      },

      // Bearer Token
      {
        name: 'Bearer Token',
        regex: /Bearer\s+([a-zA-Z0-9_-]{20,})/gi,
        severity: 'medium',
        description: 'Bearer token detected',
        entropy: 3.5
      }
    ];
  }

  /**
   * Cloud provider specific patterns
   */
  getCloudProviderPatterns() {
    return [
      // Azure
      {
        name: 'Azure Client Secret',
        regex: /client[_-]?secret\s*[:=]\s*['"]?([a-zA-Z0-9~._-]{34,40})['"]?/gi,
        severity: 'high',
        description: 'Azure client secret detected',
        entropy: 4.0
      },

      // Azure Storage Account Key
      {
        name: 'Azure Storage Account Key',
        regex: /[a-zA-Z0-9+/]{88}==/g,
        severity: 'high',
        description: 'Azure Storage Account Key detected',
        entropy: 4.5
      },

      // Heroku API Key
      {
        name: 'Heroku API Key',
        regex: /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
        severity: 'medium',
        description: 'Heroku API Key (UUID format) detected',
        entropy: 4.0
      },

      // DigitalOcean API Token
      {
        name: 'DigitalOcean API Token',
        regex: /dop_v1_[a-f0-9]{64}/gi,
        severity: 'high',
        description: 'DigitalOcean API Token detected',
        entropy: 4.0
      }
    ];
  }

  /**
   * Generic credential patterns
   */
  getGenericCredentialPatterns() {
    return [
      // Generic Credential
      {
        name: 'Generic ' + 'Credential',
        regex: /(secret|password|pass|pwd|key|token)\s*[:=]\s*['"]?([a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,})['"]?/gi,
        severity: 'medium',
        description: 'Generic credential pattern detected',
        entropy: 3.0
      },

      // High Entropy String
      {
        name: 'High Entropy String',
        regex: /['"]([a-zA-Z0-9+/=]{32,})['\"]/g,
        severity: 'low',
        description: 'High entropy string detected (potential credential)',
        entropy: 4.5,
        validation: 'entropy'
      },

      // Base64 Encoded Secrets
      {
        name: 'Base64 Data',
        regex: /['"]([A-Za-z0-9+/]{40,}={0,2})['\"]/g,
        severity: 'low',
        description: 'Base64 encoded string (potential credential)',
        entropy: 4.0,
        validation: 'base64'
      },

      // Hex Encoded Secrets
      {
        name: 'Hex Data',
        regex: /['"]([a-fA-F0-9]{32,})['\"]/g,
        severity: 'low',
        description: 'Hexadecimal string (potential credential)',
        entropy: 4.0,
        validation: 'hex'
      },

      // Credit Card Numbers
      {
        name: 'Credit Card Number',
        regex: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3[0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/g,
        severity: 'high',
        description: 'Credit card number detected',
        entropy: 2.5
      },

      // Social Security Numbers (US)
      {
        name: 'SSN',
        regex: /\b\d{3}-\d{2}-\d{4}\b/g,
        severity: 'high',
        description: 'Social Security Number detected',
        entropy: 2.0
      }
    ];
  }

  /**
   * Add custom pattern
   */
  addCustomPattern(pattern) {
    this.customPatterns.push({
      ...pattern,
      custom: true
    });
  }

  /**
   * Get all patterns including custom ones
   */
  getAllPatterns() {
    return [...this.patterns, ...this.customPatterns];
  }

  /**
   * Get patterns by severity
   */
  getPatternsBySeverity(severity) {
    return this.getAllPatterns().filter(pattern => pattern.severity === severity);
  }

  /**
   * Get patterns by category
   */
  getPatternsByCategory(category) {
    const categoryMap = {
      'api': this.getAPIKeyPatterns(),
      'database': this.getDatabasePatterns(),
      'crypto': this.getCryptographicPatterns(),
      'oauth': this.getOAuthPatterns(),
      'cloud': this.getCloudProviderPatterns(),
      'generic': this.getGenericCredentialPatterns()
    };

    return categoryMap[category] || [];
  }

  /**
   * Validate pattern configuration
   */
  validatePattern(pattern) {
    const required = ['name', 'regex', 'severity', 'description'];
    const severityLevels = ['low', 'medium', 'high', 'critical'];

    for (const field of required) {
      if (!pattern[field]) {
        throw new Error(`Pattern missing required field: ${field}`);
      }
    }

    if (!severityLevels.includes(pattern.severity)) {
      throw new Error(`Invalid severity level: ${pattern.severity}`);
    }

    if (!(pattern.regex instanceof RegExp)) {
      throw new Error('Pattern regex must be a RegExp object');
    }

    return true;
  }

  /**
   * Get pattern statistics
   */
  getStats() {
    const allPatterns = this.getAllPatterns();
    const severityCounts = {};
    const categoryCounts = {};

    allPatterns.forEach(pattern => {
      severityCounts[pattern.severity] = (severityCounts[pattern.severity] || 0) + 1;
    });

    return {
      total: allPatterns.length,
      custom: this.customPatterns.length,
      severityBreakdown: severityCounts,
      categories: {
        api: this.getAPIKeyPatterns().length,
        database: this.getDatabasePatterns().length,
        cryptographic: this.getCryptographicPatterns().length,
        oauth: this.getOAuthPatterns().length,
        cloud: this.getCloudProviderPatterns().length,
        generic: this.getGenericCredentialPatterns().length
      }
    };
  }
}

module.exports = CredentialPatterns;