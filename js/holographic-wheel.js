// ==========================================
// 3D CARD DECK SHOWCASE - PREMIUM VERSION
// ==========================================

// --- Project Data ---
const projects = {
    reload: {
        id: 'reload',
        title: 'RELOAD',
        description: '3D Product Animation Showcase for RELOAD isotonic drink. A dynamic visualization bringing the product to life through stunning motion graphics and realistic rendering.',
        thumbnail: 'assets/projects/reload/reload-thumb.webp',
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
    //     thumbnail: 'https://placehold.co/300x420/FF5733/FFFFFF?text=Project+3',
    //     images: ['https://placehold.co/800x600/FF5733/FFFFFF?text=Image+1']
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
    const modalController = new ModalController(); // Instantiate your existing modal controller

    // 1. Generate the card elements
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
        });
    }

    // 2. Update card classes based on currentIndex
    function updateDeck() {
        cards.forEach((card, index) => {
            // Clear all special classes
            card.classList.remove('active', 'prev', 'next', 'hide-left', 'hide-right');

            if (index === currentIndex) {
                card.classList.add('active');
            } else if (index === currentIndex - 1) {
                card.classList.add('prev');
            } else if (index === currentIndex + 1) {
                card.classList.add('next');
            } else if (index < currentIndex) {
                card.classList.add('hide-left');
            } else {
                card.classList.add('hide-right');
            }
        });
        
        // Disable/Enable nav buttons
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === projectsArray.length - 1;

        setupCardClickListeners();
    }
    
    // 3. Set up click listeners for cards
    function setupCardClickListeners() {
        cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                const clickedIndex = parseInt(card.dataset.index);
                if (clickedIndex === currentIndex) {
                    // It's the active card, open the modal
                    const projectId = card.dataset.projectId;
                    if (projects[projectId]) {
                        modalController.open(projects[projectId]);
                    }
                } else {
                    // It's a side card, navigate to it
                    currentIndex = clickedIndex;
                    updateDeck();
                }
            });
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

    // Initialize
    generateCards();
    updateDeck();
});


// ==========================================
// REUSED MODAL & LIGHTBOX CONTROLLERS (FROM YOUR FILE)
// ==========================================

class ModalController {
    constructor() {
        this.modal = document.getElementById('infoModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalDescription = document.getElementById('modalDescription');
        this.modalGallery = document.getElementById('modalGallery');
        this.closeBtn = document.getElementById('modalClose');
        this.lightboxController = new LightboxController(); // Each modal gets a lightbox

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
        project.images.forEach((imagePath, index) => {
            const imgWrapper = document.createElement('div');
            imgWrapper.className = 'gallery-image';
            imgWrapper.innerHTML = `<img src="${imagePath}" alt="${project.title} - Image ${index + 1}">`;
            imgWrapper.addEventListener('click', () => {
                this.lightboxController.open(project.images, index);
            });
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
            if (e.target === this.lightbox || e.target.classList.contains('lightbox-backdrop')) {
                this.close();
            }
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
