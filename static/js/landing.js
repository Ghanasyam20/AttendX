/**
 * AttendX Landing Page - Interactive Effects
 * Features: Parallax scrolling, 3D tilt, smooth animations
 */

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initializeLanding);

function initializeLanding() {
    setupSmoothScrolling();
    setupParallaxEffects();
    setupMouseTracking();
    setupScrollAnimations();
    setup3DTilt();
    setupAnimationDelays();
}

/**
 * Smooth scrolling for navigation links
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/**
 * Parallax scrolling effect
 */
function setupParallaxEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${scrolled * 0.5}px)`;
        });
    });
}

/**
 * Mouse movement tracking for floating cards
 */
function setupMouseTracking() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    heroSection.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.floating-card');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        cards.forEach((card, index) => {
            const moveX = (x - 0.5) * 50;
            const moveY = (y - 0.5) * 50;
            card.style.transform = `translateX(${moveX}px) translateY(${moveY + (index * 20)}px) rotateZ(${(x - 0.5) * 10}deg)`;
        });
    });

    // Reset on mouse leave
    heroSection.addEventListener('mouseleave', () => {
        const cards = document.querySelectorAll('.floating-card');
        cards.forEach((card, index) => {
            card.style.transform = `translateX(0) translateY(${index * 20}px) rotateZ(0)`;
        });
    });
}

/**
 * Intersection Observer for scroll animations
 */
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .step, .stat-item').forEach(el => {
        observer.observe(el);
    });
}

/**
 * 3D tilt effect on feature cards
 */
function setup3DTilt() {
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const rotateX = (y - rect.height / 2) / 10;
            const rotateY = (x - rect.width / 2) / 10;

            card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

/**
 * Setup staggered animation delays
 */
function setupAnimationDelays() {
    const faders = document.querySelectorAll('.loading');
    faders.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
    });
}

/**
 * Utility: Add glow effect on mouse move
 */
function enableMouseGlowEffect() {
    const mouseGlow = document.createElement('div');
    mouseGlow.style.cssText = `
        position: fixed;
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
        opacity: 0;
        transition: opacity 0.3s;
    `;
    document.body.appendChild(mouseGlow);

    document.addEventListener('mousemove', (e) => {
        mouseGlow.style.left = (e.clientX - 150) + 'px';
        mouseGlow.style.top = (e.clientY - 150) + 'px';
        mouseGlow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        mouseGlow.style.opacity = '0';
    });
}

/**
 * Performance monitoring
 */
function monitorPerformance() {
    if (window.performance && window.performance.timing) {
        window.addEventListener('load', () => {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
        });
    }
}

// Initialize performance monitoring
monitorPerformance();
