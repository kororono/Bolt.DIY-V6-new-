// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get the target element
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Darkening page effect when hovering on interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // Get all interactive elements that should trigger darkening
    const interactiveElements = document.querySelectorAll('.bento-item, .process-item, .contact-link');
    const pageOverlay = document.querySelector('.page-overlay');
    
    // Add event listeners to each element
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            pageOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        });
        
        element.addEventListener('mouseleave', function() {
            pageOverlay.style.backgroundColor = 'rgba(0,0,0,0)';
        });
    });
    
    // Optimize scrolling text animation performance
    const scrollingTexts = document.querySelectorAll('.scrolling-text');
    
    scrollingTexts.forEach(textElement => {
        // Clone the text content to ensure smooth infinite scrolling
        const originalContent = textElement.textContent;
        textElement.textContent = originalContent + ' ' + originalContent;
        
        // Use Intersection Observer to pause animations when not visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Pause animation when not visible to save resources
                if (entry.isIntersecting) {
                    textElement.style.animationPlayState = 'running';
                } else {
                    textElement.style.animationPlayState = 'paused';
                }
            });
        });
        
        observer.observe(textElement);
    });
});

// Active state for navigation based on current page
document.addEventListener('DOMContentLoaded', function() {
    // Get the current page URL
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Check each nav link against current location
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        // If the link href matches the current page or section
        if (currentLocation.includes(linkPath) && linkPath !== '#') {
            link.classList.add('active');
        }
    });
});
