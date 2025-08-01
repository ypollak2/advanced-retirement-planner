// Animated Numbers Utility - Smooth counting animations for financial numbers
// Implements recommendation from designEvaluator.js for visual wow factor
// Created by Yali Pollak (יהלי פולק) - v7.5.0

// Configuration
const ANIMATION_CONFIG = {
    duration: 2000, // 2 seconds default
    fps: 60,
    easing: {
        // Smooth easing functions
        easeOutQuart: (t) => 1 - Math.pow(1 - t, 4),
        easeInOutQuart: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
        easeOutExpo: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
        linear: (t) => t
    },
    formatters: {
        currency: (value, currency = 'ILS') => window.formatCurrency ? window.formatCurrency(Math.round(value), currency) : `₪${Math.round(value).toLocaleString()}`,
        percentage: (value) => `${value.toFixed(1)}%`,
        number: (value) => Math.round(value).toLocaleString(),
        decimal: (value, decimals = 2) => value.toFixed(decimals)
    }
};

// Animation state manager
class AnimationManager {
    constructor() {
        this.activeAnimations = new Map();
    }

    start(elementId, animation) {
        // Cancel any existing animation on this element
        this.cancel(elementId);
        this.activeAnimations.set(elementId, animation);
    }

    cancel(elementId) {
        const animation = this.activeAnimations.get(elementId);
        if (animation) {
            cancelAnimationFrame(animation.frameId);
            this.activeAnimations.delete(elementId);
        }
    }

    cancelAll() {
        this.activeAnimations.forEach((animation) => {
            cancelAnimationFrame(animation.frameId);
        });
        this.activeAnimations.clear();
    }
}

const animationManager = new AnimationManager();

// Main animation function
function animateNumber(element, options = {}) {
    // Parse options with defaults
    const {
        start = 0,
        end,
        duration = ANIMATION_CONFIG.duration,
        easing = 'easeOutQuart',
        format = 'currency',
        currency = 'ILS',
        decimals = 2,
        prefix = '',
        suffix = '',
        onComplete = null,
        onUpdate = null,
        separator = true
    } = options;

    // Validate inputs
    if (!element || typeof end === 'undefined') {
        console.error('AnimateNumber: Invalid element or end value');
        return;
    }

    // Get element ID for animation tracking
    const elementId = element.id || `anim-${Date.now()}`;
    if (!element.id) element.id = elementId;

    // Get easing function
    const easingFunc = typeof easing === 'function' ? easing : ANIMATION_CONFIG.easing[easing] || ANIMATION_CONFIG.easing.linear;

    // Get formatter function
    const formatter = typeof format === 'function' ? format : ANIMATION_CONFIG.formatters[format] || ANIMATION_CONFIG.formatters.number;

    // Animation state
    const startTime = performance.now();
    let lastFrame = startTime;

    // Animation loop
    const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easingFunc(progress);
        const currentValue = start + (end - start) * easedProgress;

        // Format and display value
        let displayValue = formatter(currentValue, currency, decimals);
        if (prefix) displayValue = prefix + displayValue;
        if (suffix) displayValue = displayValue + suffix;

        // Update element
        if (element.tagName === 'INPUT') {
            element.value = displayValue;
        } else {
            element.textContent = displayValue;
        }

        // Add visual feedback class
        if (progress === 0) {
            element.classList.add('number-animating');
        }

        // Callback for custom updates
        if (onUpdate) {
            onUpdate(currentValue, progress);
        }

        // Continue or complete
        if (progress < 1) {
            const frameId = requestAnimationFrame(animate);
            animationManager.start(elementId, { frameId, startTime });
        } else {
            // Animation complete
            element.classList.remove('number-animating');
            element.classList.add('number-animated');
            animationManager.cancel(elementId);

            // Final value to ensure accuracy
            let finalValue = formatter(end, currency, decimals);
            if (prefix) finalValue = prefix + finalValue;
            if (suffix) finalValue = finalValue + suffix;
            
            if (element.tagName === 'INPUT') {
                element.value = finalValue;
            } else {
                element.textContent = finalValue;
            }

            if (onComplete) {
                onComplete(end);
            }

            // Remove animation class after a delay
            setTimeout(() => {
                element.classList.remove('number-animated');
            }, 300);
        }
    };

    // Start animation
    requestAnimationFrame(animate);
}

// Animate multiple numbers in sequence or parallel
function animateNumberSequence(animations, options = {}) {
    const { parallel = false, stagger = 100, onAllComplete = null } = options;

    if (parallel) {
        // Animate all at once
        let completed = 0;
        const total = animations.length;

        animations.forEach((anim) => {
            const element = typeof anim.element === 'string' ? document.getElementById(anim.element) : anim.element;
            if (element) {
                const originalOnComplete = anim.onComplete;
                anim.onComplete = (value) => {
                    if (originalOnComplete) originalOnComplete(value);
                    completed++;
                    if (completed === total && onAllComplete) {
                        onAllComplete();
                    }
                };
                animateNumber(element, anim);
            }
        });
    } else {
        // Animate with stagger
        animations.forEach((anim, index) => {
            setTimeout(() => {
                const element = typeof anim.element === 'string' ? document.getElementById(anim.element) : anim.element;
                if (element) {
                    if (index === animations.length - 1 && onAllComplete) {
                        const originalOnComplete = anim.onComplete;
                        anim.onComplete = (value) => {
                            if (originalOnComplete) originalOnComplete(value);
                            onAllComplete();
                        };
                    }
                    animateNumber(element, anim);
                }
            }, index * stagger);
        });
    }
}

// Auto-animate numbers with data attributes
function initAutoAnimations() {
    const elements = document.querySelectorAll('[data-animate-number]');
    
    elements.forEach((element) => {
        const options = {
            end: parseFloat(element.getAttribute('data-animate-end') || element.textContent.replace(/[^0-9.-]/g, '')),
            start: parseFloat(element.getAttribute('data-animate-start') || '0'),
            duration: parseInt(element.getAttribute('data-animate-duration') || ANIMATION_CONFIG.duration),
            format: element.getAttribute('data-animate-format') || 'number',
            easing: element.getAttribute('data-animate-easing') || 'easeOutQuart',
            currency: element.getAttribute('data-animate-currency') || 'ILS',
            prefix: element.getAttribute('data-animate-prefix') || '',
            suffix: element.getAttribute('data-animate-suffix') || ''
        };

        // Trigger on element visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !element.classList.contains('number-animated')) {
                    animateNumber(element, options);
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(element);
    });
}

// Utility functions for common animations
const AnimatedNumbers = {
    // Animate currency value
    animateCurrency(elementId, endValue, currency = 'ILS', duration = 2000) {
        const element = document.getElementById(elementId);
        if (element) {
            animateNumber(element, {
                end: endValue,
                format: 'currency',
                currency,
                duration,
                easing: 'easeOutExpo'
            });
        }
    },

    // Animate percentage
    animatePercentage(elementId, endValue, duration = 1500) {
        const element = document.getElementById(elementId);
        if (element) {
            animateNumber(element, {
                end: endValue,
                format: 'percentage',
                duration,
                suffix: '%'
            });
        }
    },

    // Animate retirement countdown
    animateCountdown(elementId, years, months = 0, days = 0) {
        const element = document.getElementById(elementId);
        if (element) {
            const totalDays = years * 365 + months * 30 + days;
            animateNumber(element, {
                end: totalDays,
                format: (value) => {
                    const y = Math.floor(value / 365);
                    const m = Math.floor((value % 365) / 30);
                    const d = Math.floor(value % 30);
                    return `${y} years, ${m} months, ${d} days`;
                },
                duration: 3000,
                easing: 'easeOutQuart'
            });
        }
    },

    // Animate financial health score
    animateScore(elementId, score, maxScore = 100) {
        const element = document.getElementById(elementId);
        if (element) {
            animateNumber(element, {
                end: score,
                format: (value) => `${Math.round(value)}/${maxScore}`,
                duration: 2500,
                easing: 'easeInOutQuart',
                onUpdate: (value, progress) => {
                    // Update color based on score
                    const percentage = value / maxScore;
                    if (percentage >= 0.8) {
                        element.style.color = '#10b981'; // Green
                    } else if (percentage >= 0.6) {
                        element.style.color = '#f59e0b'; // Yellow
                    } else {
                        element.style.color = '#ef4444'; // Red
                    }
                }
            });
        }
    },

    // Batch animate all visible numbers
    animateAllVisible() {
        initAutoAnimations();
    },

    // Stop all animations
    stopAll() {
        animationManager.cancelAll();
    }
};

// CSS injection for animation states
const animationStyles = `
    .number-animating {
        transition: color 0.3s ease, transform 0.3s ease;
        transform: scale(1.05);
    }
    
    .number-animated {
        transition: transform 0.3s ease;
        transform: scale(1);
    }
    
    [data-animate-number] {
        display: inline-block;
        min-width: 1em;
    }
`;

// Inject styles if not already present
if (!document.getElementById('animated-numbers-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'animated-numbers-styles';
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);
}

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutoAnimations);
} else {
    initAutoAnimations();
}

// Export to global scope
window.AnimatedNumbers = AnimatedNumbers;
window.animateNumber = animateNumber;
window.animateNumberSequence = animateNumberSequence;

// Integration with existing retirement planner
window.animateRetirementNumbers = function() {
    // Find and animate key financial numbers
    const animations = [];

    // Total savings
    const savingsElement = document.querySelector('[data-value="total-savings"]');
    if (savingsElement) {
        const value = parseFloat(savingsElement.textContent.replace(/[^0-9.-]/g, ''));
        if (!isNaN(value)) {
            animations.push({
                element: savingsElement,
                end: value,
                format: 'currency',
                duration: 2000
            });
        }
    }

    // Monthly income
    const incomeElement = document.querySelector('[data-value="monthly-income"]');
    if (incomeElement) {
        const value = parseFloat(incomeElement.textContent.replace(/[^0-9.-]/g, ''));
        if (!isNaN(value)) {
            animations.push({
                element: incomeElement,
                end: value,
                format: 'currency',
                duration: 2000
            });
        }
    }

    // Financial health score
    const scoreElement = document.querySelector('[data-value="health-score"]');
    if (scoreElement) {
        const value = parseFloat(scoreElement.textContent.replace(/[^0-9.-]/g, ''));
        if (!isNaN(value)) {
            animations.push({
                element: scoreElement,
                end: value,
                format: 'percentage',
                duration: 1500
            });
        }
    }

    // Run animations with stagger
    if (animations.length > 0) {
        animateNumberSequence(animations, { parallel: false, stagger: 200 });
    }
};

console.log('✨ AnimatedNumbers v7.5.0 loaded - Smooth number animations ready');