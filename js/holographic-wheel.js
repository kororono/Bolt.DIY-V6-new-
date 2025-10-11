// ==========================================
// 3D CARD DECK SHOWCASE - V2 (Draggable with Glow)
// ==========================================

// --- Project Data ---
const projects = {
    reload: {
        id: 'reload',
        title: 'RELOAD',
        description: '3D Product Animation Showcase for RELOAD isotonic drink. A dynamic visualization bringing the product to life through stunning motion graphics and realistic rendering.',
        thumbnail: 'assets/projects/reload/reload-thumb.webp',
        glowColor: '#00F5FF', // Cyan Glow
        images: [
            'assets/projects/reload/reload-1.jpg',
            'assets/projects/reload/reload-2.jpg',
            'assets/projects/reload/reload-3.jpg'
        ]
    },
    kfc: {
        id: 'kfc',
        title: 'KFC',
        description: 'Animated 3D Drive-Thru commercial showcasing the KFC brand experience through immersive 3D environments and product visualization.',
        thumbnail: 'assets/projects/kfc/KFC-thumb.webp',
        glowColor: '#EA1821', // Red Glow
        images: [
            'assets/projects/kfc/kfc-1.jpg',
            'assets/projects/kfc/kfc-2.jpg'
        ]
    },
    // You can add more projects here
    // Example:
    // project3: {
    //     id: 'project3',
    //     title: 'Project Three',
    //     description: 'Description for the third project goes here.',
    //     thumbnail: 'https://placehold.co/300x420/9D00FF/FFFFFF?text=Project+3',
    //     glowColor: '#9D00FF', // Purple Glow
    //     images: ['https://placehold.co/800x600/9D00FF/FFFFFF?text=Image+1']
    // }
};
const projectsArray = Object.values(projects);

// --- Main Deck Controller ---
document.addEventListener('DOMContentLoaded', () => {
    const cardDeck = document.getElementById('card-deck');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');

    if (!cardDeck || !nextBtn || !prevBtn) return;

    let currentIndex = 0;
    let cards = [];
    const modalController = new ModalController();

    // Drag functionality variables
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    const dragThreshold = 50; // Min pixels to swipe

    // 1. Generate the card elements
    function generateCards() {
        projectsArray.forEach((project, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.projectId = project.id;
            card.dataset.index = index;
            // NEW: Set the custom glow color variable for CSS
            if (project.glowColor) {
                card.style.setProperty('--card-glow-color', project.glowColor);
            }
            
            card.innerHTML = `
                <div class="card-image">
                    <img src="${project.thumbnail}" alt="${project.title}">
                </div>
                <div class="card-title">${project.title}</div>
            `;
            
            cardDeck.appendChild(card);
            cards.push(card);
        });
    }

    // 2. Update card classes based on currentIndex
    function updateDeck() {
        // This function remains largely the same, applying classes
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

        setupCardClickListeners();
    }
    
    // 3. Set up click listeners for cards
    function setupCardClickListeners() {
        cards.forEach((card) => {
            // We handle clicks in the dragEnd function to differentiate from drags
            // but we can add hover effects or other non-drag interactions here if needed.
        });
    }

    // 4. Navigation Button Listeners
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

    // 5. DRAG AND SWIPE LOGIC
    function dragStart(index) {
        return function(event) {
            isDragging = true;
            startX = getPositionX(event);
            cardDeck.classList.add('is-dragging');
            // Used for animation frame
            animationID = requestAnimationFrame(animation);
        }
    }

    function dragMove(event) {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            currentTranslate = prevTranslate + currentPosition - startX;
        }
    }
    
    function dragEnd(event) {
        cancelAnimationFrame(animationID);
        isDragging = false;
        
        const movedBy = currentTranslate - prevTranslate;

        // Swipe vs Click logic
        if (Math.abs(movedBy) > dragThreshold) { // It's a swipe
            if (movedBy < 0 && currentIndex < projectsArray.length - 1) currentIndex++;
            if (movedBy > 0 && currentIndex > 0) currentIndex--;
        } else { // It's a click
            const card = event.target.closest('.card');
            if (card) {
                const clickedIndex = parseInt(card.dataset.index);
                if(clickedIndex === currentIndex) { // Clicked on active card
                    const projectId = card.dataset.projectId;
                    if (projects[projectId]) modalController.open(projects[projectId]);
                } else { // Clicked on side card
                    currentIndex = clickedIndex;
                }
            }
        }

        cardDeck.classList.remove('is-dragging');
        // Reset translate and snap to new position
        currentTranslate = 0;
        prevTranslate = 0;
        setDeckTransform();
        updateDeck();
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function animation() {
        setDeckTransform();
        if (isDragging) requestAnimationFrame(animation);
    }

    function setDeckTransform() {
        // Move the whole deck slightly during drag for visual feedback
        cardDeck.style.transform = `translateX(${currentTranslate}px)`;
    }

    // Attach drag event listeners
    cards.forEach((card, index) => {
        const cardImg = card.querySelector('img');
        // Prevent default image drag behavior
        cardImg.addEventListener('dragstart', (e) => e.preventDefault());

        // Mouse events
        card.addEventListener('mousedown', dragStart(index));
        card.addEventListener('mouseup', dragEnd);
        card.addEventListener('mouseleave', dragEnd);
        card.addEventListener('mousemove', dragMove);

        // Touch events
        card.addEventListener('touchstart', dragStart(index));
        card.addEventListener('touchend', dragEnd);
        card.addEventListener('touchmove', dragMove);
    });

    // Initialize
    generateCards();
    updateDeck();
});

// ==========================================
// REUSED MODAL & LIGHTBOX CONTROLLERS (UNCHANGED)
// ==========================================

class ModalController {
    constructor() {
        this.modal = document.getElementById('infoModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalDescription = document.getElementById('modalDescription');
        this.modalGallery = document.getElementById('modalGallery');
        this.closeBtn = document.getElementById('modalClose');
        this.lightboxController = new LightboxController();

        this.attachEvents();
    }
    attachEvents() {
        this.closeBtn.addEventListener('click', () => this.close());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal || e.target.classList.contains('modal-backdrop')) this.close();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) this.close();
        });
    }
    open(project) {
        this.modalTitle.textContent = project.title;
        this.modalDescription.textContent = project.description;
        this.modalGallery.innerHTML = '';
        project.images.forEach((imagePath, index) => {
            const imgWrapper = document.createElement('div');
            imgWrapper.className = 'gallery-image';
            imgWrapper.innerHTML = `<img src="${imagePath}" alt="${project.title} - Image ${index + 1}">`;
            imgWrapper.addEventListener('click', () => this.lightboxController.open(project.images, index));
            this.modalGallery.appendChild(imgWrapper);
        });
        this.modal.style.display = 'flex';
        setTimeout(() => this.modal.classList.add('active'), 10);
    }
    close() {
        this.modal.classList.remove('active');
        setTimeout(() => this.modal.style.display = 'none', 400);
    }
}

class LightboxController {
    constructor() {
        this.lightbox = document.getElementById('imageLightbox');
        this.lightboxImage = document.getElementById('lightboxImage');
        this.closeBtn = document.getElementById('lightboxClose');
        this.prevBtn = document.getElementById('lightboxPrev');
        this.nextBtn = document.getElementById('lightboxNext');
        this.images = [];
        this.currentIndex = 0;
        this.attachEvents();
    }
    attachEvents() {
        this.closeBtn.addEventListener('click', () => this.close());
        this.prevBtn.addEventListener('click', () => this.navigate(-1));
        this.nextBtn.addEventListener('click', () => this.navigate(1));
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox || e.target.classList.contains('lightbox-backdrop')) this.close();
        });
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') this.close();
            if (e.key === 'ArrowLeft') this.navigate(-1);
            if (e.key === 'ArrowRight') this.navigate(1);
        });
    }
    open(images, startIndex = 0) {
        this.images = images;
        this.currentIndex = startIndex;
        this.updateImage();
        this.lightbox.style.display = 'flex';
        setTimeout(() => this.lightbox.classList.add('active'), 10);
    }
    close() {
        this.lightbox.classList.remove('active');
        setTimeout(() => this.lightbox.style.display = 'none', 400);
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

