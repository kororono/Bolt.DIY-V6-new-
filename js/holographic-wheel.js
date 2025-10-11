// ==========================================
// 3D CARD DECK SHOWCASE - SIMPLIFIED
//
// QUICK NAVIGATION:
// 1. Project Data - Add/edit projects here
// 2. Main Deck Controller - Card generation & navigation
// 3. Drag/Swipe Settings - Adjust sensitivity
// 4. Modal Controller - Project detail overlay
// 5. Lightbox Controller - Fullscreen image gallery
// 6. Global Back Button Handler - Mobile back button behavior
// ==========================================

// ========================================
// PROJECT DATA
// ========================================
const projects = {
    reload: {
        id: 'reload',
        title: 'RELOAD',
        description:
            '3D Product Animation Showcase for RELOAD isotonic drink. A dynamic visualization bringing the product to life through stunning motion graphics and realistic rendering.',
        thumbnail: 'assets/projects/reload/reload-thumb.webp',
        glowColor: '#00F5FF',
        images: [
            'assets/3d-animation/gallery/reload-1.jpg',
            'assets/3d-animation/gallery/reload-2.jpg',
            'assets/3d-animation/gallery/reload-3.jpg'
        ]
    },
    kfc: {
        id: 'kfc',
        title: 'KFC',
        description:
            'Animated 3D Drive-Thru commercial showcasing the KFC brand experience through immersive 3D environments and product visualization.',
        thumbnail: 'assets/projects/kfc/KFC-thumb.webp',
        glowColor: '#EA1821',
        images: [
            'assets/3d-animation/gallery/kfc-1.jpg',
            'assets/3d-animation/gallery/kfc-2.jpg'
        ]
    },
};

const projectsArray = Object.values(projects);

// ========================================
// MAIN DECK CONTROLLER
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const cardDeck = document.getElementById('card-deck');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');

    if (!cardDeck || !nextBtn || !prevBtn) return;

    let currentIndex = 0;
    const cards = [];
    const modalController = new ModalController();

    // ========================================
    // DRAG/SWIPE SETTINGS
    // Adjust swipeThreshold (in pixels) to change swipe sensitivity
    // ========================================
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    const swipeThreshold = 50; // Minimum swipe distance to trigger navigation

    // ========================================
    // CARD GENERATION
    // Creates card elements dynamically from project data
    // ========================================
    function generateCards() {
        projectsArray.forEach((project, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.projectId = project.id;
            card.dataset.index = index;

            card.innerHTML = `
                <div class="card-image">
                    <img src="${project.thumbnail}" alt="${project.title}">
                </div>
                <div class="card-title">${project.title}</div>
            `;

            cardDeck.appendChild(card);
            cards.push(card);

            // Prevent image drag
            const img = card.querySelector('img');
            if (img) img.addEventListener('dragstart', (e) => e.preventDefault());

            // Click handler: navigate to card or open modal
            card.addEventListener('click', () => {
                const clickedIndex = parseInt(card.dataset.index, 10);
                if (isNaN(clickedIndex)) return;

                if (clickedIndex === currentIndex) {
                    // Active card clicked → open modal
                    const projectId = card.dataset.projectId;
                    if (projects[projectId]) modalController.open(projects[projectId]);
                } else {
                    // Navigate to clicked card
                    currentIndex = clickedIndex;
                    updateDeck();
                }
            });
        });
    }

    // ========================================
    // DECK UPDATE
    // Updates card positions/states based on currentIndex
    // ========================================
    function updateDeck() {
        cards.forEach((card, index) => {
            card.classList.remove('active', 'prev', 'next', 'hide-left', 'hide-right');

            if (index === currentIndex) card.classList.add('active');
            else if (index === currentIndex - 1) card.classList.add('prev');
            else if (index === currentIndex + 1) card.classList.add('next');
            else if (index < currentIndex) card.classList.add('hide-left');
            else card.classList.add('hide-right');
        });

        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === projectsArray.length - 1;
    }

    // ========================================
    // NAVIGATION BUTTONS
    // Prev/Next button click handlers
    // ========================================
    nextBtn.addEventListener('click', () => {
        if (currentIndex < projectsArray.length - 1) {
            currentIndex++;
            updateDeck();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateDeck();
        }
    });

    // ========================================
    // DRAG/SWIPE HANDLERS
    // Touch gestures for mobile navigation with visual feedback
    // ========================================
    cardDeck.addEventListener('touchstart', handleTouchStart, { passive: true });
    cardDeck.addEventListener('touchmove', handleTouchMove, { passive: false });
    cardDeck.addEventListener('touchend', handleTouchEnd);

    function handleTouchStart(e) {
        isDragging = true;
        startX = e.touches[0].clientX;
        cardDeck.style.transition = 'none';
    }

    function handleTouchMove(e) {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        currentTranslate = currentX - startX;
        
        // Apply visual feedback - slight horizontal movement
        cardDeck.style.transform = `translateX(${currentTranslate * 0.5}px)`;
    }

    function handleTouchEnd() {
        if (!isDragging) return;
        isDragging = false;

        // Reset transform with smooth transition
        cardDeck.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
        cardDeck.style.transform = 'translateX(0)';

        // Determine if it's a swipe or click
        if (Math.abs(currentTranslate) > swipeThreshold) {
            // It's a swipe
            if (currentTranslate < 0 && currentIndex < projectsArray.length - 1) {
                // Swipe left → next
                currentIndex++;
                updateDeck();
            } else if (currentTranslate > 0 && currentIndex > 0) {
                // Swipe right → prev
                currentIndex--;
                updateDeck();
            }
        }

        currentTranslate = 0;
    }

    // Initialize
    generateCards();
    updateDeck();
});


// ========================================
// MODAL CONTROLLER
// Handles project detail modal
// ========================================
class ModalController {
    constructor() {
        this.modal = document.getElementById('infoModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalDescription = document.getElementById('modalDescription');
        this.modalGallery = document.getElementById('modalGallery');
        this.closeBtn = document.getElementById('modalClose');
        this.lightboxController = new LightboxController();
        this.isOpen = false;
        this.attachEvents();
    }

    attachEvents() {
        this.closeBtn.addEventListener('click', () => this.close());

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal || e.target.classList.contains('modal-backdrop')) {
                this.close();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }

    open(project) {
        this.modalTitle.textContent = project.title;
        this.modalDescription.textContent = project.description;
        this.modalGallery.innerHTML = '';

        project.images.forEach((src, i) => {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'gallery-image';
            imgContainer.innerHTML = `<img src="${src}" alt="${project.title} - Image ${i + 1}">`;
            imgContainer.addEventListener('click', () =>
                this.lightboxController.open(project.images, i)
            );
            this.modalGallery.appendChild(imgContainer);
        });

        this.modal.style.display = 'flex';
        setTimeout(() => this.modal.classList.add('active'), 10);
        
        // Push history state for back button
        history.pushState({ modal: 'open' }, '');
        this.isOpen = true;
    }

    close(skipHistory = false) {
        this.modal.classList.remove('active');
        setTimeout(() => (this.modal.style.display = 'none'), 400);
        this.isOpen = false;

        // Only manipulate history if not triggered by back button
        if (!skipHistory) {
            // Remove the history entry we added
            if (window.history.state) {
                window.history.back();
            }
        }
    }
}


// ========================================
// LIGHTBOX CONTROLLER
// Handles fullscreen image gallery
// ========================================
class LightboxController {
    constructor() {
        this.lightbox = document.getElementById('imageLightbox');
        this.lightboxImage = document.getElementById('lightboxImage');
        this.closeBtn = document.getElementById('lightboxClose');
        this.prevBtn = document.getElementById('lightboxPrev');
        this.nextBtn = document.getElementById('lightboxNext');
        this.images = [];
        this.currentIndex = 0;
        this.isOpen = false;
        this.attachEvents();
    }

    attachEvents() {
        this.closeBtn.addEventListener('click', () => this.close());
        this.prevBtn.addEventListener('click', () => this.navigate(-1));
        this.nextBtn.addEventListener('click', () => this.navigate(1));

        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox || e.target.classList.contains('lightbox-backdrop')) {
                this.close();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (this.lightbox.classList.contains('active')) {
                if (e.key === 'Escape') this.close();
                if (e.key === 'ArrowLeft') this.navigate(-1);
                if (e.key === 'ArrowRight') this.navigate(1);
            }
        });
    }

    open(images, index = 0) {
        this.images = images;
        this.currentIndex = index;
        this.updateImage();

        this.lightbox.style.display = 'flex';
        setTimeout(() => this.lightbox.classList.add('active'), 10);
        
        // Push history state for back button
        history.pushState({ lightbox: 'open' }, '');
        this.isOpen = true;
    }

    close(skipHistory = false) {
        this.lightbox.classList.remove('active');
        setTimeout(() => (this.lightbox.style.display = 'none'), 400);
        this.isOpen = false;

        // Only manipulate history if not triggered by back button
        if (!skipHistory) {
            // Remove the history entry we added
            if (window.history.state) {
                window.history.back();
            }
        }
    }

    navigate(direction) {
        this.currentIndex = (this.currentIndex + direction + this.images.length) % this.images.length;
        this.updateImage();
    }

    updateImage() {
        gsap.to(this.lightboxImage, {
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
                this.lightboxImage.src = this.images[this.currentIndex];
                gsap.to(this.lightboxImage, { opacity: 1, duration: 0.3 });
            }
        });
    }
}

// ========================================
// GLOBAL BACK BUTTON HANDLER
// Handles phone back button for modal/lightbox hierarchy
// Lightbox → Modal → Cards (hierarchical close)
// ========================================
let modalControllerInstance = null;
let lightboxControllerInstance = null;

// Store controller instances when modal is created
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for controllers to be instantiated
    setTimeout(() => {
        const modalElement = document.getElementById('infoModal');
        const lightboxElement = document.getElementById('imageLightbox');
        
        // Find instances by checking if they exist in window or via elements
        // This is a simple approach - controllers set their instances
    }, 100);
});

// Global popstate handler
window.addEventListener('popstate', () => {
    // Check lightbox first (topmost overlay)
    const lightboxElement = document.getElementById('imageLightbox');
    const modalElement = document.getElementById('infoModal');
    
    if (lightboxElement && lightboxElement.classList.contains('active')) {
        // Lightbox is open - close it
        lightboxElement.classList.remove('active');
        setTimeout(() => (lightboxElement.style.display = 'none'), 400);
    } else if (modalElement && modalElement.classList.contains('active')) {
        // Modal is open but lightbox is not - close modal
        modalElement.classList.remove('active');
        setTimeout(() => (modalElement.style.display = 'none'), 400);
    }
});
