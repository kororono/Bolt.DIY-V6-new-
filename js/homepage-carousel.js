// ==========================================
// HOMEPAGE 3D CAROUSEL
//
// SECTIONS:
// 1. Project Data - Add/edit featured projects here
// 2. Carousel Controller - Main logic
// 3. Card Generation - Creates HTML cards
// 4. Navigation - Prev/Next/Click handlers
// 5. Touch/Swipe - Mobile gesture support
// 6. Position Update - Card layout logic
// ==========================================

// ========================================
// 1. PROJECT DATA
// Add or edit featured projects here
// ======================================== 
const featuredProjects = [
    {
        id: 'nfw',
        title: 'Nairobi Fashion Week',
        image: 'assets/projects/nfw/nfw-thumb.webp',
        link: 'projects/nairobi fashion week.html'
    },
    {
        id: 'kfc',
        title: 'KFC',
        image: 'assets/projects/kfc/KFC-thumb.webp',
        link: 'projects/kfc.html'
    },
    {
        id: 'nova',
        title: 'NOVA',
        image: 'assets/images/projects/image 3-thumb.jpeg',
        link: 'projects/nova.html'
    },
    {
        id: 'reload',
        title: 'RELOAD',
        image: 'assets/projects/reload/reload-thumb.webp',
        link: 'projects/reload.html'
    },
    {
        id: 'placeholder',
        title: 'Coming Soon',
        image: 'assets/projects/placeholder.webp', // Add a "coming soon" placeholder image
        link: '#' // No link for placeholder
    }
];

// ========================================
// 2. CAROUSEL CONTROLLER
// Main carousel initialization and state
// ======================================== 
document.addEventListener('DOMContentLoaded', () => {
    const deck = document.getElementById('carousel-deck');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    
    if (!deck || !prevBtn || !nextBtn) return;

    let currentIndex = 0;                               // Current active card index
    const cards = [];                                   // Array to store card elements
    const totalCards = featuredProjects.length;         // Total number of cards (5)

    // ========================================
    // 3. CARD GENERATION
    // Creates card HTML elements
    // ======================================== 
    function generateCards() {
        featuredProjects.forEach((project, index) => {
            const card = document.createElement('div');
            card.className = 'carousel-card';
            card.dataset.index = index;
            
            card.innerHTML = `
                <img src="${project.image}" alt="${project.title}">
                <div class="carousel-overlay"></div>
                <div class="carousel-title">${project.title}</div>
            `;
            
            deck.appendChild(card);
            cards.push(card);

            // Prevent image drag
            const img = card.querySelector('img');
            if (img) {
                img.addEventListener('dragstart', (e) => e.preventDefault());
            }

            // Click handler - navigate to project
            card.addEventListener('click', () => {
                const clickedIndex = parseInt(card.dataset.index, 10);
                
                // If clicking active card, go to project page
                if (clickedIndex === currentIndex) {
                    if (project.link !== '#') {
                        window.location.href = project.link;
                    }
                } else {
                    // If clicking side card, make it active
                    currentIndex = clickedIndex;
                    updatePositions();
                }
            });
        });
    }

    // ========================================
    // 4. NAVIGATION
    // Prev/Next button handlers with infinite loop
    // ======================================== 
    function navigateNext() {
        currentIndex = (currentIndex + 1) % totalCards;  // Loop: 4 -> 0
        updatePositions();
    }

    function navigatePrev() {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;  // Loop: 0 -> 4
        updatePositions();
    }

    prevBtn.addEventListener('click', navigatePrev);
    nextBtn.addEventListener('click', navigateNext);

    // ========================================
    // 5. TOUCH/SWIPE SUPPORT
    // Mobile gesture navigation
    // ======================================== 
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50;                          // Minimum swipe distance (pixels)

    deck.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    deck.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeDistance = touchStartX - touchEndX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swiped left -> next card
                navigateNext();
            } else {
                // Swiped right -> previous card
                navigatePrev();
            }
        }
    }

    // ========================================
    // 6. POSITION UPDATE
    // Updates card positions based on currentIndex
    // Shows: 2 left + active + 2 right (5 total visible)
    // ======================================== 
    function updatePositions() {
        cards.forEach((card, index) => {
            // Remove all position classes
            card.classList.remove('active', 'left-1', 'left-2', 'right-1', 'right-2', 'hidden');
            
            // Calculate relative position from current index
            let relativePos = index - currentIndex;
            
            // Handle infinite loop wrapping
            if (relativePos > totalCards / 2) {
                relativePos -= totalCards;
            } else if (relativePos < -totalCards / 2) {
                relativePos += totalCards;
            }
            
            // Assign position classes
            if (relativePos === 0) {
                card.classList.add('active');           // Center card
            } else if (relativePos === -1) {
                card.classList.add('left-1');           // First card on left
            } else if (relativePos === -2) {
                card.classList.add('left-2');           // Second card on left
            } else if (relativePos === 1) {
                card.classList.add('right-1');          // First card on right
            } else if (relativePos === 2) {
                card.classList.add('right-2');          // Second card on right
            } else {
                card.classList.add('hidden');           // Cards beyond visible range
            }
        });
    }
    // ========================================
    // 7. ETHEREAL BACKGROUND ENHANCEMENT
    // Periodic, smooth gradient color shifts
    // ========================================
    const strips = document.querySelectorAll('.gradient-strip');

    // Warm, cinematic palette (deep red → amber glow)
    const palette = [
        ["#3b060a", "#8a0000", "#c83f12"],
        ["#8a0000", "#c83f12", "#fff287"],
        ["#5a0707", "#9b1c06", "#ffae42"],
        ["#7a070c", "#c83f12", "#ffdd8d"],
        ["#3b060a", "#8a0000", "#ffae42"]
    ];

    // Helper: pick a random gradient from the palette
    function randomGradient() {
        const combo = palette[Math.floor(Math.random() * palette.length)];
        return `linear-gradient(180deg, ${combo.join(', ')})`;
    }

    // Smoothly update a random strip’s gradient
    function updateRandomStrips() {
        const randomIndices = Array.from({ length: 3 }, () =>
            Math.floor(Math.random() * strips.length)
        );

        randomIndices.forEach((i) => {
            const el = strips[i];
            if (!el) return;
            const newGradient = randomGradient();
            
            // Smooth fade transition
            el.style.transition = "background 8s ease-in-out";
            el.style.background = newGradient;
        });
    }

    // Periodic updates (every 20 seconds)
    setInterval(updateRandomStrips, 20000);

    // Initial randomization (optional subtle variation on load)
    setTimeout(updateRandomStrips, 3000);

    // ========================================
    // INITIALIZE
    // Generate cards and set initial positions
    // ======================================== 
    generateCards();
    updatePositions();
});
