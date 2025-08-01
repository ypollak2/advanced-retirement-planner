// Particle Background System - Floating currency symbols for visual appeal
// Implements recommendation from designEvaluator.js for modern dynamic backgrounds
// Created by Yali Pollak (יהלי פולק) - v7.5.0

// Configuration
const PARTICLE_CONFIG = {
    maxParticles: 30,
    particleTypes: [
        { symbol: '₪', weight: 0.3, color: '#3B82F6', size: { min: 16, max: 24 } },  // Shekel
        { symbol: '$', weight: 0.25, color: '#10B981', size: { min: 14, max: 22 } },   // Dollar
        { symbol: '€', weight: 0.15, color: '#8B5CF6', size: { min: 14, max: 22 } },   // Euro
        { symbol: '£', weight: 0.1, color: '#F59E0B', size: { min: 14, max: 22 } },    // Pound
        { symbol: '₿', weight: 0.1, color: '#F97316', size: { min: 18, max: 26 } },    // Bitcoin
        { symbol: 'Ξ', weight: 0.1, color: '#6366F1', size: { min: 16, max: 24 } }     // Ethereum
    ],
    speed: {
        x: { min: -0.5, max: 0.5 },
        y: { min: -0.3, max: -0.1 } // Floating upward
    },
    opacity: {
        min: 0.1,
        max: 0.3,
        fadeSpeed: 0.001
    },
    respawnDelay: 500, // ms between new particles
    interactive: true,
    mouseRepelDistance: 100,
    mouseRepelForce: 0.5
};

// Particle class
class Particle {
    constructor(canvas, config) {
        this.canvas = canvas;
        this.config = config;
        this.reset(true);
    }

    reset(initial = false) {
        // Select particle type based on weights
        const rand = Math.random();
        let cumWeight = 0;
        for (const type of PARTICLE_CONFIG.particleTypes) {
            cumWeight += type.weight;
            if (rand <= cumWeight) {
                this.type = type;
                break;
            }
        }

        // Position
        this.x = Math.random() * this.canvas.width;
        this.y = initial ? 
            Math.random() * this.canvas.height : 
            this.canvas.height + 50;

        // Velocity
        this.vx = PARTICLE_CONFIG.speed.x.min + 
            Math.random() * (PARTICLE_CONFIG.speed.x.max - PARTICLE_CONFIG.speed.x.min);
        this.vy = PARTICLE_CONFIG.speed.y.min + 
            Math.random() * (PARTICLE_CONFIG.speed.y.max - PARTICLE_CONFIG.speed.y.min);

        // Properties
        this.size = this.type.size.min + 
            Math.random() * (this.type.size.max - this.type.size.min);
        this.opacity = initial ? 
            Math.random() * (PARTICLE_CONFIG.opacity.max - PARTICLE_CONFIG.opacity.min) + PARTICLE_CONFIG.opacity.min :
            0;
        this.targetOpacity = PARTICLE_CONFIG.opacity.min + 
            Math.random() * (PARTICLE_CONFIG.opacity.max - PARTICLE_CONFIG.opacity.min);
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.fadeIn = !initial;
        this.life = 1;
        
        // Wobble effect
        this.wobbleSpeed = 0.001 + Math.random() * 0.002;
        this.wobbleAmount = 20 + Math.random() * 30;
        this.wobbleOffset = Math.random() * Math.PI * 2;
    }

    update(mouseX, mouseY) {
        // Movement
        this.x += this.vx;
        this.y += this.vy;

        // Wobble
        const wobble = Math.sin(Date.now() * this.wobbleSpeed + this.wobbleOffset) * this.wobbleAmount;
        this.x += wobble * 0.01;

        // Rotation
        this.rotation += this.rotationSpeed;

        // Fade in/out
        if (this.fadeIn) {
            this.opacity += PARTICLE_CONFIG.opacity.fadeSpeed * 2;
            if (this.opacity >= this.targetOpacity) {
                this.opacity = this.targetOpacity;
                this.fadeIn = false;
            }
        }

        // Mouse interaction
        if (PARTICLE_CONFIG.interactive && mouseX !== null && mouseY !== null) {
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < PARTICLE_CONFIG.mouseRepelDistance) {
                const force = (1 - distance / PARTICLE_CONFIG.mouseRepelDistance) * PARTICLE_CONFIG.mouseRepelForce;
                this.vx += (dx / distance) * force;
                this.vy += (dy / distance) * force;
                
                // Limit velocity
                this.vx = Math.max(-2, Math.min(2, this.vx));
                this.vy = Math.max(-2, Math.min(-0.1, this.vy));
            }
        }

        // Reset if out of bounds
        if (this.y < -50 || this.x < -50 || this.x > this.canvas.width + 50) {
            this.reset();
        }
    }

    draw(ctx) {
        ctx.save();
        
        // Set properties
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.type.color;
        ctx.font = `${this.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Apply rotation
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Draw shadow for depth
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        // Draw particle
        ctx.fillText(this.type.symbol, 0, 0);
        
        ctx.restore();
    }
}

// Particle System class
class ParticleSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        this.lastSpawn = 0;
        this.mouseX = null;
        this.mouseY = null;
        this.enabled = true;
        this.initialized = false;
    }

    init(containerId = 'particle-background') {
        if (this.initialized) return;

        // Create or get canvas
        this.canvas = document.getElementById(containerId);
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = containerId;
            this.canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: -1;
                opacity: 0;
                transition: opacity 1s ease-in;
            `;
            document.body.insertBefore(this.canvas, document.body.firstChild);
        }

        this.ctx = this.canvas.getContext('2d');
        this.resize();

        // Event listeners
        window.addEventListener('resize', () => this.resize());
        
        if (PARTICLE_CONFIG.interactive) {
            document.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            });
            
            document.addEventListener('mouseleave', () => {
                this.mouseX = null;
                this.mouseY = null;
            });
        }

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            console.log('Particle system disabled due to reduced motion preference');
            this.enabled = false;
            return;
        }

        // Initialize particles
        this.createInitialParticles();
        
        // Start animation
        this.animate();
        
        // Fade in
        setTimeout(() => {
            this.canvas.style.opacity = '1';
        }, 100);

        this.initialized = true;
        console.log('✨ Particle background initialized');
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createInitialParticles() {
        const count = Math.min(PARTICLE_CONFIG.maxParticles, Math.floor(this.canvas.width / 50));
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(this.canvas, PARTICLE_CONFIG));
        }
    }

    spawnParticle() {
        if (this.particles.length < PARTICLE_CONFIG.maxParticles) {
            this.particles.push(new Particle(this.canvas, PARTICLE_CONFIG));
        }
    }

    animate() {
        if (!this.enabled) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles = this.particles.filter(particle => {
            particle.update(this.mouseX, this.mouseY);
            particle.draw(this.ctx);
            return particle.life > 0;
        });

        // Spawn new particles
        const now = Date.now();
        if (now - this.lastSpawn > PARTICLE_CONFIG.respawnDelay && 
            this.particles.length < PARTICLE_CONFIG.maxParticles) {
            this.spawnParticle();
            this.lastSpawn = now;
        }

        // Continue animation
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        if (enabled && !this.animationId) {
            this.animate();
            this.canvas.style.opacity = '1';
        } else if (!enabled) {
            this.canvas.style.opacity = '0';
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
        }
    }

    setIntensity(intensity) {
        // Adjust particle count based on intensity (0-1)
        const targetCount = Math.floor(PARTICLE_CONFIG.maxParticles * intensity);
        
        if (targetCount < this.particles.length) {
            // Remove particles
            this.particles = this.particles.slice(0, targetCount);
        } else {
            // Add particles
            const toAdd = targetCount - this.particles.length;
            for (let i = 0; i < toAdd; i++) {
                this.spawnParticle();
            }
        }
    }

    destroy() {
        this.enabled = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        this.particles = [];
        this.initialized = false;
    }

    // Add burst effect at specific location
    burst(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            const particle = new Particle(this.canvas, PARTICLE_CONFIG);
            particle.x = x;
            particle.y = y;
            particle.vx = (Math.random() - 0.5) * 4;
            particle.vy = (Math.random() - 0.5) * 4 - 2;
            particle.opacity = PARTICLE_CONFIG.opacity.max;
            particle.fadeIn = false;
            this.particles.push(particle);
        }
    }
}

// Global instance
const particleSystem = new ParticleSystem();

// Public API
const ParticleBackground = {
    init(options = {}) {
        Object.assign(PARTICLE_CONFIG, options);
        particleSystem.init();
    },

    enable() {
        particleSystem.setEnabled(true);
    },

    disable() {
        particleSystem.setEnabled(false);
    },

    setIntensity(intensity) {
        particleSystem.setIntensity(Math.max(0, Math.min(1, intensity)));
    },

    burst(x, y, count) {
        particleSystem.burst(x, y, count);
    },

    destroy() {
        particleSystem.destroy();
    },

    // Toggle based on user preference
    toggle() {
        if (particleSystem.enabled) {
            this.disable();
            localStorage.setItem('particleBackgroundDisabled', 'true');
        } else {
            this.enable();
            localStorage.removeItem('particleBackgroundDisabled');
        }
        return particleSystem.enabled;
    },

    // Check if should auto-enable
    shouldAutoEnable() {
        // Check user preference
        if (localStorage.getItem('particleBackgroundDisabled') === 'true') {
            return false;
        }
        
        // Check device performance
        const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        return !isLowEnd && !isMobile;
    }
};

// Auto-initialize on DOM ready if appropriate
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (ParticleBackground.shouldAutoEnable()) {
            ParticleBackground.init();
        }
    });
} else {
    if (ParticleBackground.shouldAutoEnable()) {
        ParticleBackground.init();
    }
}

// Export to global scope
window.ParticleBackground = ParticleBackground;

// Add toggle button to UI
window.addParticleToggle = function() {
    const toggle = document.createElement('button');
    toggle.id = 'particle-toggle';
    toggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(255, 255, 255, 0.9);
        border: 2px solid #3B82F6;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        transition: all 0.3s ease;
        font-size: 20px;
    `;
    toggle.innerHTML = particleSystem.enabled ? '✨' : '🚫';
    toggle.title = 'Toggle particle effects';
    
    toggle.addEventListener('click', () => {
        const enabled = ParticleBackground.toggle();
        toggle.innerHTML = enabled ? '✨' : '🚫';
        toggle.style.transform = 'scale(0.8)';
        setTimeout(() => {
            toggle.style.transform = 'scale(1)';
        }, 200);
    });
    
    toggle.addEventListener('mouseenter', () => {
        toggle.style.transform = 'scale(1.1)';
    });
    
    toggle.addEventListener('mouseleave', () => {
        toggle.style.transform = 'scale(1)';
    });
    
    document.body.appendChild(toggle);
};

console.log('💰 ParticleBackground v7.5.0 loaded - Floating currency particles ready');