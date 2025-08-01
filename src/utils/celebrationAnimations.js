// Celebration Animations - Confetti and visual rewards for milestones
// Implements recommendation from designEvaluator.js for engagement boosters
// Created by Yali Pollak (יהלי פולק) - v7.5.0

// Configuration for different celebration types
const CELEBRATION_CONFIG = {
    confetti: {
        particleCount: 100,
        spread: 70,
        startVelocity: 30,
        gravity: 0.5,
        ticks: 60,
        origin: { x: 0.5, y: 0.6 },
        colors: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899']
    },
    fireworks: {
        particleCount: 30,
        spread: 360,
        startVelocity: 40,
        gravity: 0.3,
        ticks: 100
    },
    stars: {
        particleCount: 50,
        spread: 120,
        shapes: ['star'],
        scalar: 1.2
    },
    emoji: {
        particleCount: 20,
        spread: 100,
        shapes: ['emoji'],
        scalar: 3
    }
};

// Milestone thresholds
const MILESTONES = {
    savings: [
        { amount: 100000, message: 'First ₪100K saved! 🎉', type: 'confetti' },
        { amount: 500000, message: 'Half a million! 🚀', type: 'fireworks' },
        { amount: 1000000, message: 'Millionaire status! 💰', type: 'fireworks' },
        { amount: 2000000, message: 'Multi-millionaire! 🎆', type: 'fireworks' }
    ],
    readiness: [
        { score: 50, message: 'Halfway there! 💪', type: 'confetti' },
        { score: 75, message: 'Great progress! ⭐', type: 'stars' },
        { score: 90, message: 'Almost ready! 🎯', type: 'fireworks' },
        { score: 100, message: 'Retirement ready! 🎆', type: 'fireworks' }
    ],
    age: [
        { years: 5, message: '5 years closer! ⏳', type: 'confetti' },
        { years: 10, message: 'A decade of progress! 📈', type: 'stars' },
        { years: 1, message: 'Final year! 🎯', type: 'fireworks' }
    ]
};

// Canvas-based confetti implementation
class ConfettiSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;

        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'celebration-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10000;
        `;
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.resize();

        // Handle resize
        window.addEventListener('resize', () => this.resize());
        this.initialized = true;
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle(options) {
        const angle = options.angle || Math.random() * Math.PI * 2;
        const velocity = options.velocity || (Math.random() * 3 + 2);
        
        return {
            x: options.x || this.canvas.width / 2,
            y: options.y || this.canvas.height / 2,
            vx: Math.cos(angle) * velocity * (options.spread ? (Math.random() - 0.5) * options.spread / 50 : 1),
            vy: Math.sin(angle) * velocity * (options.spread ? (Math.random() - 0.5) * options.spread / 50 : 1) - options.startVelocity / 10,
            size: Math.random() * 5 + 5,
            color: options.colors[Math.floor(Math.random() * options.colors.length)],
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.2,
            life: 1,
            decay: options.decay || 0.015,
            gravity: options.gravity || 0.1,
            shape: options.shape || 'square'
        };
    }

    shoot(options = {}) {
        const config = { ...CELEBRATION_CONFIG.confetti, ...options };
        
        // Create particles
        for (let i = 0; i < config.particleCount; i++) {
            this.particles.push(this.createParticle({
                ...config,
                x: config.origin.x * this.canvas.width,
                y: config.origin.y * this.canvas.height
            }));
        }

        // Start animation if not running
        if (!this.animationId) {
            this.animate();
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles = this.particles.filter(particle => {
            // Update physics
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += particle.gravity;
            particle.rotation += particle.rotationSpeed;
            particle.life -= particle.decay;

            // Draw particle
            if (particle.life > 0) {
                this.ctx.save();
                this.ctx.globalAlpha = particle.life;
                this.ctx.translate(particle.x, particle.y);
                this.ctx.rotate(particle.rotation);

                if (particle.shape === 'star') {
                    this.drawStar(0, 0, particle.size, 5, 0.5, particle.color);
                } else if (particle.shape === 'emoji') {
                    this.ctx.font = `${particle.size * 2}px Arial`;
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.fillText('🎉', 0, 0);
                } else {
                    // Default square
                    this.ctx.fillStyle = particle.color;
                    this.ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
                }

                this.ctx.restore();
                return true;
            }
            return false;
        });

        // Continue animation if particles exist
        if (this.particles.length > 0) {
            this.animationId = requestAnimationFrame(() => this.animate());
        } else {
            this.animationId = null;
        }
    }

    drawStar(cx, cy, radius, points, inset, color) {
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        
        for (let i = 0; i < points * 2; i++) {
            const angle = (i * Math.PI) / points;
            const r = i % 2 === 0 ? radius : radius * inset;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.closePath();
        this.ctx.fill();
    }

    clear() {
        this.particles = [];
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    destroy() {
        this.clear();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        this.initialized = false;
    }
}

// Global confetti system instance
const confettiSystem = new ConfettiSystem();

// Achievement notification system
class AchievementNotification {
    static show(message, type = 'success', duration = 3000) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(-100px);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            font-size: 18px;
            font-weight: bold;
            z-index: 10001;
            animation: slideDown 0.5s ease-out forwards;
            text-align: center;
            min-width: 300px;
        `;

        // Add icon based on type
        const icon = type === 'success' ? '✓' : type === 'star' ? '⭐' : '🎆';
        notification.innerHTML = `
            <div style="font-size: 40px; margin-bottom: 10px;">${icon}</div>
            <div>${message}</div>
        `;

        document.body.appendChild(notification);

        // Add animation styles if not present
        if (!document.getElementById('achievement-styles')) {
            const styles = document.createElement('style');
            styles.id = 'achievement-styles';
            styles.textContent = `
                @keyframes slideDown {
                    to {
                        transform: translateX(-50%) translateY(0);
                    }
                }
                @keyframes slideUp {
                    from {
                        transform: translateX(-50%) translateY(0);
                    }
                    to {
                        transform: translateX(-50%) translateY(-100px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        // Auto-remove after duration
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.5s ease-in forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, duration);
    }
}

// Main celebration API
const CelebrationAnimations = {
    // Initialize the system
    init() {
        confettiSystem.init();
        console.log('🎉 Celebration animations initialized');
    },

    // Fire confetti
    confetti(options = {}) {
        confettiSystem.init();
        confettiSystem.shoot({ ...CELEBRATION_CONFIG.confetti, ...options });
    },

    // Fire fireworks
    fireworks(options = {}) {
        confettiSystem.init();
        const config = { ...CELEBRATION_CONFIG.fireworks, ...options };
        
        // Multiple bursts
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                confettiSystem.shoot({
                    ...config,
                    origin: {
                        x: 0.2 + Math.random() * 0.6,
                        y: 0.3 + Math.random() * 0.3
                    }
                });
            }, i * 200);
        }
    },

    // Show stars
    stars(options = {}) {
        confettiSystem.init();
        confettiSystem.shoot({ ...CELEBRATION_CONFIG.stars, ...options });
    },

    // Celebrate milestone
    celebrateMilestone(type, value, customMessage = null) {
        const milestones = MILESTONES[type];
        if (!milestones) return;

        // Find appropriate milestone
        let milestone = null;
        if (type === 'savings') {
            milestone = milestones.find(m => value >= m.amount && !this.celebrated[`${type}-${m.amount}`]);
            if (milestone) this.celebrated[`${type}-${milestone.amount}`] = true;
        } else if (type === 'readiness') {
            milestone = milestones.find(m => value >= m.score && !this.celebrated[`${type}-${m.score}`]);
            if (milestone) this.celebrated[`${type}-${milestone.score}`] = true;
        } else if (type === 'age') {
            milestone = milestones.find(m => value <= m.years && !this.celebrated[`${type}-${m.years}`]);
            if (milestone) this.celebrated[`${type}-${milestone.years}`] = true;
        }

        if (milestone) {
            const message = customMessage || milestone.message;
            
            // Show notification
            AchievementNotification.show(message, milestone.type);
            
            // Trigger animation
            setTimeout(() => {
                this[milestone.type]();
            }, 300);
            
            // Play sound if available
            this.playSound('achievement');
            
            return true;
        }
        return false;
    },

    // Track celebrated milestones
    celebrated: {},

    // Reset celebrations
    reset() {
        this.celebrated = {};
        confettiSystem.clear();
    },

    // Play celebration sound
    playSound(type = 'achievement') {
        try {
            // Create audio context if needed
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            // Simple celebration sound
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Celebration melody
            const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
            let time = this.audioContext.currentTime;
            
            notes.forEach((freq, i) => {
                oscillator.frequency.setValueAtTime(freq, time + i * 0.1);
            });
            
            gainNode.gain.setValueAtTime(0.3, time);
            gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
            
            oscillator.start(time);
            oscillator.stop(time + 0.5);
        } catch (e) {
            // Silently fail if audio not supported
            console.log('Audio not available');
        }
    },

    // Custom celebration
    custom(message, options = {}) {
        AchievementNotification.show(message, options.type || 'success');
        if (options.animation !== false) {
            setTimeout(() => {
                this.confetti(options);
            }, 300);
        }
        if (options.sound !== false) {
            this.playSound();
        }
    },

    // Destroy system
    destroy() {
        confettiSystem.destroy();
        this.reset();
    }
};

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CelebrationAnimations.init());
} else {
    CelebrationAnimations.init();
}

// Export to global scope
window.CelebrationAnimations = CelebrationAnimations;
window.celebrateMilestone = (type, value, message) => CelebrationAnimations.celebrateMilestone(type, value, message);
window.celebrate = (message, options) => CelebrationAnimations.custom(message, options);

// Integration with retirement planner
window.checkRetirementMilestones = function(data) {
    // Check savings milestones
    if (data.totalSavings) {
        CelebrationAnimations.celebrateMilestone('savings', data.totalSavings);
    }
    
    // Check readiness score
    if (data.readinessScore) {
        CelebrationAnimations.celebrateMilestone('readiness', data.readinessScore);
    }
    
    // Check years to retirement
    if (data.yearsToRetirement !== undefined) {
        CelebrationAnimations.celebrateMilestone('age', data.yearsToRetirement);
    }
};

console.log('🎆 CelebrationAnimations v7.5.0 loaded - Ready to celebrate achievements!');