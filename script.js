// Language Toggle Functionality
let currentLanguage = 'en';

function changeLanguage(lang) {
    currentLanguage = lang;
    console.log('Changing language to:', lang);
    
    // Update all elements with data attributes
    const elements = document.querySelectorAll('[data-en][data-es]');
    console.log('Found elements to update:', elements.length);
    
    elements.forEach(element => {
        const newText = element.getAttribute(`data-${lang}`);
        if (newText) {
            element.textContent = newText;
            console.log('Updated element:', element.tagName, 'to:', newText);
        }
    });
    
    // Update placeholders
    document.querySelectorAll('[data-placeholder-en][data-placeholder-es]').forEach(element => {
        const newPlaceholder = element.getAttribute(`data-placeholder-${lang}`);
        if (newPlaceholder) {
            element.placeholder = newPlaceholder;
        }
    });
    
    // Update document language
    document.documentElement.lang = lang === 'es' ? 'es' : 'en';
    
    // Update active language button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
    
    // Store language preference
    localStorage.setItem('preferred-language', lang);
}

// Initialize language from localStorage or default to English
document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('preferred-language') || 'en';
    changeLanguage(savedLanguage);
});

// Language button event listeners
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        changeLanguage(lang);
    });
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Initialize EmailJS
(function() {
    emailjs.init("PDVOz9OeMKI6Gf3ZJ");
})();

// Form submission handling with EmailJS
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const linkedin = formData.get('linkedin');
        const company = formData.get('company');
        const message = formData.get('message');
        
        // Basic validation with language support
        const validationMessages = {
            en: {
                required: 'Please fill in all required fields.',
                email: 'Please enter a valid email address.',
                linkedin: 'Please enter a valid LinkedIn profile URL.',
                success: 'Thank you for your application! We will contact you soon.'
            },
            es: {
                required: 'Por favor, completa todos los campos requeridos.',
                email: 'Por favor, ingresa un email válido.',
                linkedin: 'Por favor, ingresa una URL válida de LinkedIn.',
                success: '¡Gracias por tu aplicación! Nos pondremos en contacto contigo pronto.'
            }
        };
        
        // Check all required fields
        if (!name || !email || !linkedin || !company || !message) {
            alert(validationMessages[currentLanguage].required);
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert(validationMessages[currentLanguage].email);
            return;
        }
        
        // LinkedIn URL validation
        const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
        if (!linkedinRegex.test(linkedin)) {
            alert(validationMessages[currentLanguage].linkedin);
            return;
        }
        
        // Submit form with EmailJS
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        const loadingText = currentLanguage === 'es' ? 'Enviando...' : 'Sending...';
        submitBtn.textContent = loadingText;
        submitBtn.disabled = true;
        
        try {
            // EmailJS template parameters
            const templateParams = {
                from_name: name,
                from_email: email,
                linkedin: linkedin,
                company: company,
                message: message,
                to_email: 'contact@aifounders.vc' // Your email
            };
            
            // Send email using EmailJS
            await emailjs.send('service_35qjh58', 'template_sf2n78i', templateParams);
            
            alert(validationMessages[currentLanguage].success);
            this.reset();
            
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = currentLanguage === 'es' 
                ? 'Error al enviar la aplicación. Por favor, inténtalo de nuevo.'
                : 'Error submitting application. Please try again.';
            alert(errorMessage);
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.about-card, .ai-card, .criteria-item, .stat-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            const originalText = statNumber.textContent;
            
            // Don't animate ranges or complex values
            if (originalText.includes('-') || originalText.includes('$') || originalText.includes('K') || originalText.includes('M')) {
                // Just show the original text without animation
                statNumber.textContent = originalText;
            } else {
                // Only animate simple numbers
                const numberMatch = originalText.match(/\d+/);
                if (numberMatch) {
                    const number = parseInt(numberMatch[0]);
                    statNumber.textContent = '0';
                    
                    setTimeout(() => {
                        animateCounter(statNumber, number);
                    }, 500);
                }
            }
            
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        statsObserver.observe(item);
    });
});

// Add loading state to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        if (this.classList.contains('btn-primary') && this.textContent === 'Aplicar Ahora') {
            return; // Let the form handle this
        }
        
        // Add ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple effect styles
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
