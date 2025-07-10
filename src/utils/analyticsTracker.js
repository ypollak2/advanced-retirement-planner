// Analytics Tracking for Retirement Planner
const AnalyticsManager = {
    // Initialize analytics
    init: function() {
        const storageKey = 'retirement_planner_analytics';
        let analytics = this.getAnalytics();
        
        if (!analytics.metadata) {
            analytics.metadata = {
                firstVisit: new Date().toISOString(),
                totalSessions: 0,
                totalVisitors: 0,
                lastUpdated: new Date().toISOString(),
                version: '2.4.1'
            };
        }

        localStorage.setItem(storageKey, JSON.stringify(analytics));
        return analytics;
    },

    // Start new session
    startSession: function() {
        const storageKey = 'retirement_planner_analytics';
        const sessionId = this.generateSessionId();
        const timestamp = new Date().toISOString();
        
        let analytics = this.getAnalytics();
        
        // Initialize session
        analytics.sessions = analytics.sessions || [];
        analytics.sessions.push({
            id: sessionId,
            startTime: timestamp,
            actions: [],
            conclusions: null,
            endTime: null
        });

        analytics.metadata.totalSessions++;
        analytics.metadata.lastUpdated = timestamp;

        localStorage.setItem(storageKey, JSON.stringify(analytics));
        
        // Store current session ID for tracking actions
        sessionStorage.setItem('current_session_id', sessionId);
        
        return sessionId;
    },

    // Track user actions
    trackAction: function(actionType, actionData = {}) {
        const sessionId = sessionStorage.getItem('current_session_id');
        if (sessionId) {
            const storageKey = 'retirement_planner_analytics';
            let analytics = this.getAnalytics();
            
            const session = analytics.sessions.find(s => s.id === sessionId);
            if (session) {
                session.actions.push({
                    type: actionType,
                    data: actionData,
                    timestamp: new Date().toISOString()
                });

                analytics.metadata.lastUpdated = new Date().toISOString();
                localStorage.setItem(storageKey, JSON.stringify(analytics));
            }
        }
    },

    // Track retirement plan conclusions
    trackConclusion: function(results, inputs) {
        const sessionId = sessionStorage.getItem('current_session_id');
        if (sessionId) {
            const storageKey = 'retirement_planner_analytics';
            let analytics = this.getAnalytics();
            
            const session = analytics.sessions.find(s => s.id === sessionId);
            if (session) {
                session.conclusions = {
                    totalSavings: results.totalSavings,
                    monthlyIncome: results.totalNetIncome,
                    achievesTarget: results.achievesTarget,
                    timestamp: new Date().toISOString()
                };
            }

            // Store in conclusions array
            analytics.conclusions = analytics.conclusions || [];
            if (results && results.totalSavings) {
                const conclusion = {
                    sessionId,
                    userAge: inputs.currentAge,
                    retirementAge: inputs.retirementAge,
                    totalSavings: results.totalSavings,
                    monthlyIncome: results.totalNetIncome,
                    achieved: results.achievesTarget,
                    timestamp: new Date().toISOString()
                };
            }

            analytics.metadata.lastUpdated = new Date().toISOString();
            localStorage.setItem(storageKey, JSON.stringify(analytics));

            return conclusion;
        }
    },

    // Get analytics data
    getAnalytics: function() {
        const storageKey = 'retirement_planner_analytics';
        const stored = localStorage.getItem(storageKey);
        
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.warn('Failed to parse analytics data:', e);
            }
        }
        
        return {
            sessions: [],
            conclusions: [],
            metadata: {
                firstVisit: new Date().toISOString(),
                totalSessions: 0,
                totalVisitors: 0,
                lastUpdated: new Date().toISOString(),
                version: '2.4.1'
            }
        };
    },

    // Generate session ID
    generateSessionId: function() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    // Get analytics summary
    getSummary: function() {
        const analytics = this.getAnalytics();
        const today = new Date().toDateString();
        
        const sessionsToday = analytics.sessions.filter(s => 
            new Date(s.startTime).toDateString() === today
        ).length;
        
        const conclusionsToday = analytics.conclusions.filter(c => 
            new Date(c.timestamp).toDateString() === today
        ).length;
        
        return {
            totalVisitors: analytics.metadata.totalVisitors || 0,
            totalSessions: analytics.metadata.totalSessions || 0,
            totalConclusions: analytics.conclusions.length || 0,
            sessionsToday,
            conclusionsToday,
            lastUpdated: analytics.metadata.lastUpdated,
            version: analytics.metadata.version
        };
    },

    // Export analytics data
    exportData: function() {
        return this.getAnalytics();
    },

    // Clear analytics data
    clearData: function() {
        const storageKey = 'retirement_planner_analytics';
        localStorage.removeItem(storageKey);
        sessionStorage.removeItem('current_session_id');
    }
};

// Export to window for global access
window.AnalyticsManager = AnalyticsManager;