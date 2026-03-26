// ===========================
// PARTICLE BACKGROUND ANIMATION
// ===========================

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.resize();
        this.init();
        
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 8000);
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            radius: Math.random() * 1.5 + 0.5,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.1,
            color: Math.random() > 0.5 ? '0, 212, 255' : '0, 153, 204'
        };
    }
    
    animate = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = `rgba(${this.particles[0].color}, 0.1)`;
        
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Wrap around edges
            particle.x = (particle.x + this.canvas.width) % this.canvas.width;
            particle.y = (particle.y + this.canvas.height) % this.canvas.height;
            
            // Draw particle
            this.ctx.fillStyle = `rgba(0, 212, 255, ${particle.opacity * 0.6})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Connect nearby particles
            this.particles.forEach((otherParticle, otherIndex) => {
                if (index >= otherIndex) return;
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 * (1 - distance / 150)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(this.animate);
    }
}

// Initialize particle system if canvas exists
const particleCanvas = document.getElementById('particleCanvas');
if (particleCanvas) {
    new ParticleSystem(particleCanvas);
}

// ===========================
// SCROLL PROGRESS BAR
// ===========================

const scrollProgress = document.querySelector('.scroll-progress');

let ticking = false;

const updateScrollProgress = () => {
    const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    scrollProgress.style.width = scrollPercentage + '%';
    ticking = false;
};

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress);
        ticking = true;
    }
});

// ===========================
// NAVIGATION & SMOOTH SCROLLING
// ===========================

const navLinks = document.querySelectorAll('.nav-link');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinksContainer = document.querySelector('.nav-links');

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Close mobile menu if open
        navLinksContainer.classList.remove('mobile-open');
        mobileMenuToggle.classList.remove('active');
        
        // Get target section
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
});

// Mobile menu toggle
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('mobile-open');
        mobileMenuToggle.classList.toggle('active');
    });
}

// Update active navigation link on scroll
const sections = document.querySelectorAll('.section');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (correspondingLink) {
                navLinks.forEach(link => link.classList.remove('active'));
                correspondingLink.classList.add('active');
            }
        }
    });
}, { threshold: 0.3 });

sections.forEach(section => observer.observe(section));

// ===========================
// SKILL BAR ANIMATIONS
// ===========================

const skillBars = document.querySelectorAll('.skill-progress');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            // Animation is handled by CSS
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => skillObserver.observe(bar));

// ===========================
// CONTACT FORM HANDLING
// ===========================

const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

if (contactForm) {
    // Real-time form validation
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmail);
    messageInput.addEventListener('blur', validateMessage);
    
    function validateName() {
        const error = document.getElementById('nameError');
        if (nameInput.value.trim().length < 2) {
            error.textContent = 'Name must be at least 2 characters';
        } else {
            error.textContent = '';
        }
    }
    
    function validateEmail() {
        const error = document.getElementById('emailError');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            error.textContent = 'Please enter a valid email';
        } else {
            error.textContent = '';
        }
    }
    
    function validateMessage() {
        const error = document.getElementById('messageError');
        if (messageInput.value.trim().length < 10) {
            error.textContent = 'Message must be at least 10 characters';
        } else {
            error.textContent = '';
        }
    }
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate all fields
        validateName();
        validateEmail();
        validateMessage();
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = messageInput.value.trim();
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name || !email || !subject || !message) {
            formNote.textContent = '❌ Please fill in all fields';
            formNote.style.color = '#ff6b6b';
            return;
        }

        if (!emailRegex.test(email)) {
            formNote.textContent = '❌ Please enter a valid email';
            formNote.style.color = '#ff6b6b';
            return;
        }

        if (message.length < 10) {
            formNote.textContent = '❌ Message must be at least 10 characters';
            formNote.style.color = '#ff6b6b';
            return;
        }

        // Show loading state
        formNote.textContent = '⏳ Sending your message...';
        formNote.style.color = '#00d4ff';

        // Submit to Web3Forms
        const formData = new FormData(contactForm);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                formNote.textContent = '✅ Message sent successfully! I\'ll get back to you within 24 hours.';
                formNote.style.color = '#00d4ff';
                contactForm.reset();
                setTimeout(() => {
                    formNote.textContent = '';
                }, 5000);
            } else {
                formNote.textContent = '❌ Something went wrong. Please try again.';
                formNote.style.color = '#ff6b6b';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            formNote.textContent = '❌ Error sending message. Please try again.';
            formNote.style.color = '#ff6b6b';
        });
    });
}

// ===========================
// SCROLL ANIMATIONS
// ===========================

const fadeElements = document.querySelectorAll('[class*="fade"], [class*="slide"], .project-card, .skill-category, .contact-item, .highlight-item');

const elementObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
        }
    });
}, {threshold: 0.1, rootMargin: '0px 0px -50px 0px'});

fadeElements.forEach(element => elementObserver.observe(element));

// ===========================
// PROJECT CARD INTERACTIONS
// ===========================

const projectButtons = document.querySelectorAll('.project-btn');

projectButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Replace with actual URLs when available
        if (button.textContent.includes('GitHub')) {
            // alert('GitHub link will be added here!');
            console.log('GitHub link placeholder');
        } else if (button.textContent.includes('Live')) {
            // alert('Live demo link will be added here!');
            console.log('Live demo link placeholder');
        }
    });
});

// ===========================
// SMOOTH HOVER EFFECTS
// ===========================

const hoverElements = document.querySelectorAll('.project-card, .skill-category, .highlight-item');

hoverElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

// ===========================
// KEYBOARD SHORTCUTS
// ===========================

document.addEventListener('keydown', (e) => {
    // Press '/' to focus on contact form
    if (e.key === '/') {
        e.preventDefault();
        const nameInput = document.getElementById('name');
        if (nameInput) {
            nameInput.focus();
            nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    // Press 'Escape' to close mobile menu
    if (e.key === 'Escape' && navLinksContainer.classList.contains('mobile-open')) {
        navLinksContainer.classList.remove('mobile-open');
        mobileMenuToggle.classList.remove('active');
    }
});

// ===========================
// PERFORMANCE OPTIMIZATION
// ===========================

// Lazy load images if needed in the future
if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

// ===========================
// INITIALIZE ANIMATIONS ON PAGE LOAD
// ===========================

let animationFrameId;

function initAnimations() {
    const animatedElements = document.querySelectorAll('[style*="animation"]');
    animatedElements.forEach(element => {
        element.style.animationPlayState = 'running';
    });
}

window.addEventListener('load', () => {
    initAnimations();
    document.body.style.opacity = '1';
});

// Ensure initial state
window.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll behavior for browsers that need it fallback
    if (!CSS.supports('scroll-behavior', 'smooth')) {
        const style = document.createElement('style');
        style.textContent = `
            html {
                scroll-behavior: auto !important;
            }
        `;
        document.head.appendChild(style);
    }
});

// ===========================
// MOUSE POSITION TRACKING (Optional enhancement)
// ===========================

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Optional: Add subtle parallax effects to hero
    const hero = document.querySelector('.hero');
    if (hero && window.scrollY < window.innerHeight * 1.5) {
        const moveX = (mouseX - window.innerWidth / 2) * 0.01;
        const moveY = (mouseY - window.innerHeight / 2) * 0.01;
        
        const heroVisual = hero.querySelector('.hero-visual');
        if (heroVisual) {
            heroVisual.style.transform = `perspective(1000px) rotateY(${moveX}deg) rotateX(${-moveY}deg)`;
        }
    }
});

// ===========================
// CONSOLE MESSAGE
// ===========================

console.log('%cWelcome to Aaryan\'s Portfolio! 🚀', 'color: #00d4ff; font-size: 18px; font-weight: bold;');
console.log('%cBuilt with vanilla HTML, CSS & JavaScript | Press "/" to contact', 'color: #b0b0c0; font-size: 12px;');
// ===========================
// SMOOTH SCROLL ENHANCEMENT
// ===========================

const smoothScrollElements = document.querySelectorAll('a[href^="#"]');
smoothScrollElements.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===========================
// INTERSECTION OBSERVER - SMOOTH REVEAL
// ===========================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe animated elements with requestAnimationFrame for smooth performance
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.project-card, .skill-group, .contact-item, .about-paragraph').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        observer.observe(el);
    });
});

// ===========================
// SMOOTH HOVER EFFECTS WITH DEBOUNCE
// ===========================

const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

document.querySelectorAll('.btn, .project-btn, .nav-link, .skill-tag').forEach(el => {
    el.addEventListener('mouseenter', function() {
        this.style.willChange = 'transform';
    });
    
    el.addEventListener('mouseleave', function() {
        this.style.willChange = 'auto';
    });
});

console.log('%cLet\'s build something amazing together! 💡', 'color: #00d4ff; font-size: 14px; font-weight: bold;');