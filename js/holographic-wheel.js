// ==========================================
// 3D CARD DECK SHOWCASE - V3 (FINAL)
// ==========================================

// --- Project Data ---
const projects = {
    reload: {
        id: 'reload',
        title: 'RELOAD',
        description:
            '3D Product Animation Showcase for RELOAD isotonic drink. A dynamic visualization bringing the product to life through stunning motion graphics and realistic rendering.',
        thumbnail: 'assets/projects/reload/reload-thumb.webp',
        glowColor: '#00F5FF',
        images: [
            'assets/projects/reload/reload-1.jpg',
            'assets/projects/reload/reload-2.jpg',
            'assets/projects/reload/reload-3.jpg'
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
            'assets/projects/kfc/kfc-1.jpg',
            'assets/projects/kfc/kfc-2.jpg'
        ]
    },
};

const projectsArray = Object.values(projects);

// --- Main Deck Controller ---
document.addEventListener('DOMContentLoaded', () => {
    const cardDeck = document.getElementById('card-deck');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');

    if (!cardDeck || !nextBtn || !prevBtn) return;

    let currentIndex = 0;
    const cards = [];
    const modalController = new ModalController();

    // Drag functionality variables
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    const dragThreshold = 50;

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

            card.querySelector('img').addEventListener('dragstart', (e) => e.preventDefault());
        });
    }

    // 2. Update card classes based on currentIndex
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

    // 3. Navigation Button Listeners
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

    // 4. DRAG AND SWIPE LOGIC (INTERACTIVE)
    function dragStart(event) {
        isDragging = true;
        startX = getPositionX(event);
        cardDeck.classList.add('is-dragging');
        animationID = requestAnimationFrame(animation);

        window.addEventListener('mousemove', dragMove);
        window.addEventListener('mouseup', dragEnd);
        window.addEventListener('touchmove', dragMove, { passive: true });
        window.addEventListener('touchend', dragEnd);
    }

    function dragMove(event) {
        if (!isDragging) return;
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startX;
    }

    function dragEnd(event) {
        if (!isDragging) return;

        cancelAnimationFrame(animationID);
        isDragging = false;

        const movedBy = currentTranslate - prevTranslate;

        // Swipe vs Click logic
        if (Math.abs(movedBy) > dragThreshold) {
            // It's a swipe
            if (movedBy < 0 && currentIndex < projectsArray.length - 1) {
                currentIndex++;
            } else if (movedBy > 0 && currentIndex > 0) {
                currentIndex--;
            }
        } else {
            // It's a click
            const card = event.target.closest('.card');
            if (card) {
                const clickedIndex = parseInt(card.dataset.index, 10);
                // Clicking on adjacent cards navigates to them
                if (clickedIndex !== currentIndex) {
                    currentIndex = clickedIndex;
                } else {
                    // Clicked on active card → open modal
                    const projectId = card.dataset.projectId;
                    if (projects[projectId]) modalController.open(projects[projectId]);
                }
            }
        }

        cardDeck.classList.remove('is-dragging');
        currentTranslate = 0;
        prevTranslate = 0;
        setDeckTransform(true);
        updateDeck();

        window.removeEventListener('mousemove', dragMove);
        window.removeEventListener('mouseup', dragEnd);
        window.removeEventListener('touchmove', dragMove);
        window.removeEventListener('touchend', dragEnd);
    }

    function getPositionX(event) {
        if (event.type.includes('end')) {
            return event.changedTouches ? event.changedTouches[0].clientX : event.clientX;
        }
        return event.touches ? event.touches[0].clientX : event.clientX;
    }

    function animation() {
        setDeckTransform();
        if (isDragging) requestAnimationFrame(animation);
    }

    function setDeckTransform(reset = false) {
        if (reset) {
            cardDeck.style.transform = ''; // Clear inline style
        } else {
            cardDeck.style.transform = `translateX(${currentTranslate}px)`;
        }
    }

    // Attach initial listeners
    cardDeck.addEventListener('mousedown', dragStart);
    cardDeck.addEventListener('touchstart', dragStart, { passive: true });

    // Initialize
    generateCards();
    updateDeck();
});


// ==========================================
// REUSED MODAL & LIGHTBOX CONTROLLERS
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
    }

    close() {
        this.modal.classList.remove('active');
        setTimeout(() => (this.modal.style.display = 'none'), 400);
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
    }

    close() {
        this.lightbox.classList.remove('active');
        setTimeout(() => (this.lightbox.style.display = 'none'), 400);
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
