// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Darkening page effect when hovering on interactive elements
document.addEventListener('DOMContentLoaded', function() {
    const interactiveElements = document.querySelectorAll('.bento-item, .process-item, .contact-link');
    const pageOverlay = document.querySelector('.page-overlay');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            pageOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        });
        element.addEventListener('mouseleave', function() {
            pageOverlay.style.backgroundColor = 'rgba(0,0,0,0)';
        });
    });
    
    const scrollingTexts = document.querySelectorAll('.scrolling-text');
    scrollingTexts.forEach(textElement => {
        const originalContent = textElement.textContent;
        textElement.textContent = originalContent + ' ' + originalContent;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                textElement.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
            });
        });
        observer.observe(textElement);
    });
});

// Active state for navigation based on current page
document.addEventListener('DOMContentLoaded', function() {
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentLocation.includes(linkPath) && linkPath !== '#') {
            link.classList.add('active');
        }
    });
});

// -----------------------------
// 🟣 Mobile Navigation Menu Logic
// -----------------------------
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (!hamburger || !navLinks) return; // safety check

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        document.body.classList.toggle('menu-open');

        // Apply staggered animation when opening
        if (navLinks.classList.contains('active')) {
            const links = navLinks.querySelectorAll('a');
            links.forEach((link, index) => {
                link.style.animation = `fadeIn 0.4s ease forwards ${index * 0.07}s`;
            });
        } else {
            const links = navLinks.querySelectorAll('a');
            links.forEach(link => link.style.animation = '');
        }
    });
});
