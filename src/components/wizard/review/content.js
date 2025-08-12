// Review Step Content Module
// Multi-language content for review wizard step

function getReviewContent() {
    return {
        he: {
            title: 'סקירה מקיפה ותוצאות',
            subtitle: 'סיכום מקיף של תכנית הפרישה שלך עם המלצות פעולה',
            
            // Action Items
            actionItems: 'פעולות נדרשות',
            immediateActions: 'פעולות מיידיות (30 יום)',
            shortTermGoals: 'יעדים קצרי טווח (6-12 חודשים)',
            longTermStrategy: 'אסטרטגיה ארוכת טווח (5+ שנים)',
            
            // Country-specific recommendations
            countrySpecificActions: 'פעולות ספציפיות למדינה',
            regulatoryCompliance: 'רשימת ציות רגולטורי',
            contributionTiming: 'תזמון הפקדות אופטימלי',
            taxDeadlines: 'מועדי מס חשובים',
            
            // Final recommendations
            nextSteps: 'הצעדים הבאים',
            reviewSchedule: 'לוח זמנים לסקירה',
            professionalAdvice: 'ייעוץ מקצועי',
            
            // Summary
            overallAssessment: 'הערכה כוללת',
            readyForRetirement: 'מוכן לפרישה',
            needsWork: 'דורש עבודה',
            onTrack: 'במסלול הנכון',
            
            // Component labels
            componentScores: 'ציוני רכיבים',
            financialHealth: 'בריאות פיננסית',
            retirementReadiness: 'מוכנות לפרישה',
            totalAccumulation: 'צבירה צפויה',
            totalMonthlyIncome: 'הכנסה חודשית כוללת (ברוטו)',
            
            // Next steps content
            reviewImplementActions: 'סקור ויישם פעולות מיידיות',
            scheduleReviews: 'קבע סקירות רבעוניות לתוכנית',
            considerAdvice: 'שקול ייעוץ פיננסי מקצועי'
        },
        en: {
            title: 'Comprehensive Review & Results',
            subtitle: 'Complete summary of your retirement plan with actionable recommendations',
            
            // Action Items
            actionItems: 'Required Actions',
            immediateActions: 'Immediate Actions (30 days)',
            shortTermGoals: 'Short-term Goals (6-12 months)',
            longTermStrategy: 'Long-term Strategy (5+ years)',
            
            // Country-specific recommendations
            countrySpecificActions: 'Country-specific Actions',
            regulatoryCompliance: 'Regulatory Compliance Checklist',
            contributionTiming: 'Optimal Contribution Timing',
            taxDeadlines: 'Important Tax Deadlines',
            
            // Final recommendations
            nextSteps: 'Next Steps',
            reviewSchedule: 'Review Schedule',
            professionalAdvice: 'Professional Advice',
            
            // Summary
            overallAssessment: 'Overall Assessment',
            readyForRetirement: 'Ready for Retirement',
            needsWork: 'Needs Work',
            onTrack: 'On Track',
            
            // Component labels
            componentScores: 'Component Scores',
            financialHealth: 'Financial Health',
            retirementReadiness: 'Retirement Readiness',
            totalAccumulation: 'Total Accumulation',
            totalMonthlyIncome: 'Total Monthly Income (Gross)',
            
            // Next steps content
            reviewImplementActions: 'Review and implement immediate actions',
            scheduleReviews: 'Schedule quarterly plan reviews',
            considerAdvice: 'Consider professional financial advice'
        }
    };
}

// Overall status determination
function getOverallStatus(score, language = 'en') {
    const t = getReviewContent()[language];
    if (score >= 80) return { status: t.readyForRetirement, color: 'green' };
    if (score >= 60) return { status: t.onTrack, color: 'yellow' };
    return { status: t.needsWork, color: 'red' };
}

// Export to window
window.ReviewContent = {
    getReviewContent,
    getOverallStatus
};

console.log('✅ Review content module loaded');