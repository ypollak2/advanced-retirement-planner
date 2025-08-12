// GitHub Gist Session Storage - Real-time debugging visibility for session data
// Created by Yali Pollak (יהלי פולק) - v7.3.8

class SessionStorageGist {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.gistId = null;
        this.gistUrl = null;
        this.lastUpdated = null;
        this.maxRetries = 3;
        this.updateQueue = [];
        this.isUpdating = false;
        
        // Configuration
        this.config = {
            enableGist: false, // Disabled by default (requires GitHub token)
            fallbackToLocal: true, // Fallback to localStorage if GitHub fails
            autoCleanup: true, // Auto-cleanup after 24 hours
            debugMode: window.location.search.includes('debug=true')
        };
        
        this.sessionData = {
            metadata: {
                sessionId: this.sessionId,
                startTime: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href,
                version: window.APP_VERSION || '7.3.8'
            },
            wizardInputs: {},
            calculationResults: {},
            financialHealthScores: {},
            errorLog: [],
            debugLog: []
        };
        
        console.log(`🔄 SessionStorageGist initialized with session ID: ${this.sessionId}`);
        
        // Try to restore from localStorage as fallback
        this.restoreFromLocalStorage();
        
        // Initialize GitHub Gist
        if (this.config.enableGist) {
            this.initializeGist();
        }
    }
    
    generateSessionId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 9);
        return `retirement-session-${timestamp}-${random}`;
    }
    
    async initializeGist() {
        try {
            // Check if gist feature is explicitly enabled
            if (!this.config.enableGist) {
                console.log('📊 GitHub Gist storage is disabled (requires authentication)');
                return false;
            }
            
            // Check for GitHub token
            const githubToken = localStorage.getItem('githubToken');
            if (!githubToken) {
                console.log('🔑 GitHub token not found. Gist storage requires authentication.');
                this.config.enableGist = false;
                return false;
            }
            
            // Create a new gist for this session
            const gistData = {
                description: `Advanced Retirement Planner - Session ${this.sessionId}`,
                public: false, // Private by default
                files: {
                    'session-data.json': {
                        content: JSON.stringify(this.sessionData, null, 2)
                    },
                    'README.md': {
                        content: this.generateReadme()
                    }
                }
            };
            
            const response = await fetch('https://api.github.com/gists', {
                method: 'POST',
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                    'Authorization': `token ${githubToken}`
                },
                body: JSON.stringify(gistData)
            });
            
            if (response.ok) {
                const gist = await response.json();
                this.gistId = gist.id;
                this.gistUrl = gist.html_url;
                this.lastUpdated = Date.now();
                
                console.log(`✅ GitHub Gist created for session: ${this.gistUrl}`);
                console.log(`📊 View real-time session data at: ${this.gistUrl}`);
                
                // Store gist info in localStorage for recovery
                localStorage.setItem('retirement-gist-info', JSON.stringify({
                    sessionId: this.sessionId,
                    gistId: this.gistId,
                    gistUrl: this.gistUrl,
                    created: Date.now()
                }));
                
                return true;
            } else if (response.status === 401) {
                console.warn('⚠️ GitHub authentication failed. Check your token.');
                this.config.enableGist = false;
                return false;
            } else {
                throw new Error(`Failed to create gist: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.warn('🔄 Failed to create GitHub Gist:', error.message);
            this.config.enableGist = false;
            return false;
        }
    }
    
    generateReadme() {
        return `# Advanced Retirement Planner - Session Data

**Session ID:** ${this.sessionId}
**Started:** ${new Date().toISOString()}
**URL:** ${window.location.href}

## About This Session

This Gist contains real-time session data from the Advanced Retirement Planner for debugging purposes.

### Files:
- \`session-data.json\` - Complete session data including wizard inputs, calculations, and scores
- \`console-logs.json\` - Captured console logs with categorization
- \`error-trace.json\` - Detailed error traces and debugging information

### Session Structure:
- **wizardInputs**: All user inputs from the retirement planning wizard
- **calculationResults**: Results from retirement calculations
- **financialHealthScores**: Financial health scoring breakdown
- **errorLog**: Any errors encountered during the session  
- **debugLog**: Debug information for troubleshooting

### Debugging Features:
- Real-time updates as user progresses through wizard
- Error correlation with specific inputs
- Field mapping diagnostics
- Calculation flow tracking

---
*Generated by Advanced Retirement Planner v${window.APP_VERSION || '7.3.8'}*
*Created by Yali Pollak (יהלי פולק)*
`;
    }
    
    async updateSessionData(category, data, options = {}) {
        const { merge = true, timestamp = true } = options;
        
        // Update local session data
        if (merge && typeof this.sessionData[category] === 'object') {
            this.sessionData[category] = { ...this.sessionData[category], ...data };
        } else {
            this.sessionData[category] = data;
        }
        
        if (timestamp) {
            this.sessionData.metadata.lastUpdated = new Date().toISOString();
        }
        
        // Save to localStorage as fallback
        this.saveToLocalStorage();
        
        // Queue GitHub update
        if (this.config.enableGist && this.gistId) {
            this.queueGistUpdate();
        }
        
        // Emit event for debugging
        if (this.config.debugMode) {
            console.log(`📊 Session data updated - ${category}:`, data);
        }
        
        window.dispatchEvent(new CustomEvent('sessionDataUpdated', {
            detail: { category, data, sessionId: this.sessionId }
        }));
    }
    
    queueGistUpdate() {
        // Add to update queue to batch updates
        this.updateQueue.push({
            timestamp: Date.now(),
            data: JSON.parse(JSON.stringify(this.sessionData)) // Deep clone
        });
        
        // Debounce updates - update at most every 5 seconds
        if (!this.isUpdating) {
            setTimeout(() => this.processUpdateQueue(), 5000);
        }
    }
    
    async processUpdateQueue() {
        if (this.updateQueue.length === 0 || this.isUpdating) return;
        
        this.isUpdating = true;
        
        try {
            // Get the latest data from the queue
            const latestUpdate = this.updateQueue[this.updateQueue.length - 1];
            this.updateQueue = [];
            
            const updateData = {
                files: {
                    'session-data.json': {
                        content: JSON.stringify(latestUpdate.data, null, 2)
                    }
                }
            };
            
            // Add console logs if available
            if (window.__consoleLogs && window.__consoleLogs.length > 0) {
                const logData = window.__exportConsoleLogs('llm');
                updateData.files['console-logs.json'] = {
                    content: JSON.stringify(logData, null, 2)
                };
            }
            
            const response = await fetch(`https://api.github.com/gists/${this.gistId}`, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });
            
            if (response.ok) {
                this.lastUpdated = Date.now();
                if (this.config.debugMode) {
                    console.log(`✅ GitHub Gist updated: ${this.gistUrl}`);
                }
            } else {
                throw new Error(`Failed to update gist: ${response.status}`);
            }
        } catch (error) {
            console.warn('🔄 Failed to update GitHub Gist:', error.message);
            
            // Disable gist updates if we hit rate limits or other issues
            if (error.message.includes('rate limit') || error.message.includes('403')) {
                console.warn('🔄 GitHub API rate limited, disabling gist updates for this session');
                this.config.enableGist = false;
            }
        } finally {
            this.isUpdating = false;
            
            // Process any queued updates
            if (this.updateQueue.length > 0) {
                setTimeout(() => this.processUpdateQueue(), 5000);
            }
        }
    }
    
    saveToLocalStorage() {
        try {
            localStorage.setItem(`retirement-session-${this.sessionId}`, JSON.stringify({
                ...this.sessionData,
                savedAt: Date.now()
            }));
        } catch (error) {
            console.warn('Failed to save to localStorage:', error.message);
        }
    }
    
    restoreFromLocalStorage() {
        try {
            const saved = localStorage.getItem(`retirement-session-${this.sessionId}`);
            if (saved) {
                const data = JSON.parse(saved);
                this.sessionData = { ...this.sessionData, ...data };
                console.log('🔄 Session data restored from localStorage');
            }
        } catch (error) {
            console.warn('Failed to restore from localStorage:', error.message);
        }
    }
    
    // Logging methods for different types of data
    logWizardStep(stepNumber, stepData) {
        this.updateSessionData('wizardInputs', {
            [`step${stepNumber}`]: {
                ...stepData,
                timestamp: new Date().toISOString()
            }
        });
    }
    
    logCalculation(calculationType, inputs, results) {
        this.updateSessionData('calculationResults', {
            [calculationType]: {
                inputs,
                results,
                timestamp: new Date().toISOString()
            }
        });
    }
    
    logFinancialHealthScore(scoreData) {
        this.updateSessionData('financialHealthScores', {
            ...scoreData,
            timestamp: new Date().toISOString()
        });
    }
    
    logError(error, context = {}) {
        const errorEntry = {
            message: error.message || error,
            stack: error.stack,
            context,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId
        };
        
        this.sessionData.errorLog.push(errorEntry);
        this.updateSessionData('errorLog', this.sessionData.errorLog, { merge: false });
        
        console.error('🚨 Error logged to session:', errorEntry);
    }
    
    logDebugInfo(message, data = {}) {
        const debugEntry = {
            message,
            data,
            timestamp: new Date().toISOString()
        };
        
        this.sessionData.debugLog.push(debugEntry);
        
        // Keep only last 100 debug entries to prevent bloat
        if (this.sessionData.debugLog.length > 100) {
            this.sessionData.debugLog = this.sessionData.debugLog.slice(-100);
        }
        
        this.updateSessionData('debugLog', this.sessionData.debugLog, { merge: false });
        
        if (this.config.debugMode) {
            console.log('🔍 Debug info logged:', debugEntry);
        }
    }
    
    // Field mapping diagnostics
    logFieldMappingDiagnosis(inputs, diagnosis) {
        this.logDebugInfo('Field Mapping Diagnosis', {
            availableFields: Object.keys(inputs),
            foundFields: Object.keys(diagnosis.foundFields || {}),
            missingFields: Object.keys(diagnosis.missingFields || {}),
            criticalIssues: diagnosis.criticalIssues || [],
            planningType: inputs.planningType
        });
    }
    
    // Get session info for display
    getSessionInfo() {
        return {
            sessionId: this.sessionId,
            gistUrl: this.gistUrl,
            gistId: this.gistId,
            lastUpdated: this.lastUpdated,
            config: this.config,
            entriesCount: {
                wizardSteps: Object.keys(this.sessionData.wizardInputs).length,
                calculations: Object.keys(this.sessionData.calculationResults).length,
                errors: this.sessionData.errorLog.length,
                debugEntries: this.sessionData.debugLog.length
            }
        };
    }
    
    // Manual export functions
    exportSessionData(format = 'json') {
        const data = {
            ...this.sessionData,
            exportedAt: new Date().toISOString()
        };
        
        if (format === 'json') {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `retirement-session-${this.sessionId}.json`;
            link.click();
            URL.revokeObjectURL(url);
        }
        
        return data;
    }
    
    // Cleanup old sessions
    static cleanupOldSessions() {
        const keys = Object.keys(localStorage);
        const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
        
        keys.forEach(key => {
            if (key.startsWith('retirement-session-')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (data.savedAt && data.savedAt < cutoffTime) {
                        localStorage.removeItem(key);
                        console.log(`🧹 Cleaned up old session: ${key}`);
                    }
                } catch (error) {
                    // Remove corrupted entries
                    localStorage.removeItem(key);
                }
            }
        });
    }
}

// Initialize global session storage
window.sessionStorageGist = new SessionStorageGist();

// Cleanup old sessions on initialization
SessionStorageGist.cleanupOldSessions();

// Auto-cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.sessionStorageGist) {
        window.sessionStorageGist.logDebugInfo('Session ending', {
            duration: Date.now() - new Date(window.sessionStorageGist.sessionData.metadata.startTime).getTime(),
            finalUrl: window.location.href
        });
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SessionStorageGist;
}

console.log('✅ SessionStorageGist loaded successfully');