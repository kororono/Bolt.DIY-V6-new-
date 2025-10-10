// ==========================================
// HOLOGRAPHIC WHEEL - 3D SHOWCASE
// Main JavaScript Controller
// ==========================================

// Project Data
const projects = {
    reload: {
        id: 'reload',
        title: 'RELOAD',
        description: '3D Product Animation Showcase for RELOAD isotonic drink. A dynamic visualization bringing the product to life through stunning motion graphics and realistic rendering.',
        thumbnail: 'assets/projects/reload/reload-thumb.webp',
        glowColor: '#00F5FF', // Cyan glow
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
        glowColor: '#EA1821', // Red glow for KFC
        images: [
            'assets/projects/kfc/kfc-1.jpg',
            'assets/projects/kfc/kfc-2.jpg'
        ]
    }
};

// Convert to array for easier iteration
const projectsArray = Object.values(projects);

// ==========================================
// WHEEL CONTROLLER
// ==========================================

class HolographicWheel {
    constructor() {
        this.wheel = document.getElementById('wheel');
        this.tiles = [];
        this.currentRotation = 0;
        this.targetRotation = 0;
        this.velocity = 0.1; // Current rotation speed
        this.idleVelocity = 0.1; // Idle rotation speed
        this.isAutoRotating = true;
        this.isDragging = false;
        this.startX = 0;
        this.startRotation = 0;
        this.lastDragX = 0;
        this.dragVelocity = 0;
        this.isMobile = window.innerWidth <= 768;
        this.scrollGutter = 80; // Right-side scroll zone
        
        this.init();
    }

    init() {
        if (!this.isMobile) {
            this.generateTiles();
            this.positionTiles();
            this.createScrollIndicator();
            this.startAutoRotation();
            this.attachEvents();
        } else {
            this.generateMobileTiles();
        }
    }

    generateTiles() {
        const numTiles = projectsArray.length;
        const angleStep = 360 / numTiles;

        projectsArray.forEach((project, index) => {
            const tile = document.createElement('div');
            tile.className = 'wheel-tile';
            tile.dataset.project = project.id;
            tile.dataset.angle = index * angleStep;
            tile.dataset.glowColor = project.glowColor;

            // Apply custom glow color as CSS variable
            tile.style.setProperty('--card-glow', project.glowColor);

            tile.innerHTML = `
                <div class="tile-image">
                    <img src="${project.thumbnail}" alt="${project.title}">
                </div>
                <div class="tile-title">${project.title}</div>
            `;

            tile.addEventListener('click', () => this.openModal(project.id));

            this.wheel.appendChild(tile);
            this.tiles.push(tile);
        });
    }

    generateMobileTiles() {
        projectsArray.forEach((project) => {
            const tile = document.createElement('div');
            tile.className = 'wheel-tile';
            tile.dataset.project = project.id;
            tile.dataset.glowColor = project.glowColor;

            // Apply custom glow color as CSS variable
            tile.style.setProperty('--card-glow', project.glowColor);

            tile.innerHTML = `
                <div class="tile-image">
                    <img src="${project.thumbnail}" alt="${project.title}">
                </div>
                <div class="tile-title">${project.title}</div>
            `;

            tile.addEventListener('click', () => this.openModal(project.id));

            this.wheel.appendChild(tile);
        });
    }

    positionTiles() {
        const radius = 320; // Reduced for tighter, more immersive circle
        
        this.tiles.forEach((tile, index) => {
            const angle = parseFloat(tile.dataset.angle);
            tile.dataset.initialAngle = angle;
        });
    }

    updateTilePositions() {
        // Update positions with billboard effect - cards always face forward
        this.tiles.forEach((tile) => {
            const angle = parseFloat(tile.dataset.initialAngle);
            const totalRotation = this.currentRotation + angle;
            
            // Calculate if this is the center card
            const normalizedTotal = ((totalRotation % 360) + 360) % 360;
            let diff = Math.abs(normalizedTotal);
            if (diff > 180) diff = 360 - diff;
            
            // Apply scale for center card
            const scale = diff < 30 ? 1.1 : 1.0;
            
            // Add/remove center class for styling
            if (diff < 30) {
                tile.classList.add('center-card');
            } else {
                tile.classList.remove('center-card');
            }
            
            // Position in circle + counter-rotate to face camera + scale
            tile.style.transform = `
                translate(-50%, -50%)
                rotateY(${totalRotation}deg)
                translateZ(320px)
                rotateY(${-totalRotation}deg)
                scale(${scale})
            `;
        });
    }

    createScrollIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'scroll-zone-indicator';
        document.body.appendChild(indicator);
    }

    startAutoRotation() {
        if (this.isMobile) return;

        const animate = () => {
            if (this.isAutoRotating && !this.isDragging) {
                // Smoothly transition velocity to idle speed
                this.velocity += (this.idleVelocity - this.velocity) * 0.05;
                this.targetRotation += this.velocity;
            } else if (this.isDragging) {
                // Apply drag velocity
                this.targetRotation += this.dragVelocity;
                this.dragVelocity *= 0.95; // Natural friction
            } else {
                // Coasting after drag - smoothly reduce to idle
                this.velocity += (this.idleVelocity - this.velocity) * 0.02;
                this.targetRotation += this.velocity;
            }

            // Smooth interpolation
            this.currentRotation += (this.targetRotation - this.currentRotation) * 0.1;
            
            this.wheel.style.transform = `rotateY(${this.currentRotation}deg)`;
            
            // Update all tile positions with billboard effect
            this.updateTilePositions();

            requestAnimationFrame(animate);
        };

        animate();
    }

    attachEvents() {
        if (this.isMobile) return;

        // Scroll event with gutter detection
        window.addEventListener('wheel', (e) => {
            const mouseX = e.clientX;
            const windowWidth = window.innerWidth;
            const holographicSection = document.querySelector('.holographic-main');
            const sectionRect = holographicSection.getBoundingClientRect();
            const isInSection = e.clientY >= sectionRect.top && e.clientY <= sectionRect.bottom;
            
            // Check if mouse is in scroll gutter (right 80px) or outside section
            if (mouseX > windowWidth - this.scrollGutter || !isInSection) {
                return; // Allow natural scrolling
            }
            
            e.preventDefault();
            this.targetRotation += e.deltaY * 0.05;
            this.velocity = e.deltaY * 0.05; // Set current velocity
            this.isAutoRotating = false;
            
            // Resume auto-rotation after brief pause
            clearTimeout(this.autoRotateTimeout);
            this.autoRotateTimeout = setTimeout(() => {
                this.isAutoRotating = true;
            }, 300);
        }, { passive: false });

        // Drag events
        this.wheel.addEventListener('mousedown', (e) => this.startDrag(e));
        window.addEventListener('mousemove', (e) => this.onDrag(e));
        window.addEventListener('mouseup', () => this.endDrag());

        // Touch events
        this.wheel.addEventListener('touchstart', (e) => this.startDrag(e.touches[0]));
        window.addEventListener('touchmove', (e) => this.onDrag(e.touches[0]));
        window.addEventListener('touchend', () => this.endDrag());

        // Hover pause
        this.tiles.forEach(tile => {
            tile.addEventListener('mouseenter', () => {
                this.isAutoRotating = false;
            });
            tile.addEventListener('mouseleave', () => {
                setTimeout(() => {
                    this.isAutoRotating = true;
                }, 300);
            });
        });
    }

    startDrag(e) {
        this.isDragging = true;
        this.startX = e.clientX || e.pageX;
        this.lastDragX = this.startX;
        this.startRotation = this.currentRotation;
        this.dragVelocity = 0;
        this.isAutoRotating = false;
        document.body.style.cursor = 'grabbing';
    }

    onDrag(e) {
        if (!this.isDragging) return;

        const currentX = e.clientX || e.pageX;
        const deltaX = currentX - this.lastDragX;
        
        // Reduce velocity and cap it
        const rawVelocity = deltaX * 0.3;
        const maxVelocity = 5; // Cap maximum velocity
        this.dragVelocity = Math.max(-maxVelocity, Math.min(maxVelocity, rawVelocity));
        
        this.targetRotation += this.dragVelocity;
        this.lastDragX = currentX;
    }

    endDrag() {
        if (!this.isDragging) return;

        this.isDragging = false;
        document.body.style.cursor = 'default';
        this.velocity = this.dragVelocity; // Carry momentum

        // Smoothly coast back to idle rotation
        setTimeout(() => {
            this.isAutoRotating = true;
        }, 300);
    }

    openModal(projectId) {
        const project = projects[projectId];
        if (!project) return;

        modalController.open(project);
        this.isAutoRotating = false; // Pause wheel while modal is open
    }
}

// ==========================================
// MODAL CONTROLLER
// ==========================================

class ModalController {
    constructor() {
        this.modal = document.getElementById('infoModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalDescription = document.getElementById('modalDescription');
        this.modalGallery = document.getElementById('modalGallery');
        this.closeBtn = document.getElementById('modalClose');
        this.currentProject = null;

        this.attachEvents();
    }

    attachEvents() {
        this.closeBtn.addEventListener('click', () => this.close());
        
        // Close on backdrop click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal || e.target.classList.contains('modal-backdrop')) {
                this.close();
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }

    open(project) {
        this.currentProject = project;
        
        // Populate content
        this.modalTitle.textContent = project.title;
        this.modalDescription.textContent = project.description;
        
        // Generate gallery
        this.modalGallery.innerHTML = '';
        project.images.forEach((imagePath, index) => {
            const imgWrapper = document.createElement('div');
            imgWrapper.className = 'gallery-image';
            imgWrapper.innerHTML = `<img src="${imagePath}" alt="${project.title} - Image ${index + 1}">`;
            imgWrapper.addEventListener('click', () => {
                lightboxController.open(project.images, index);
            });
            this.modalGallery.appendChild(imgWrapper);
        });

        // Animate in
        gsap.to(this.modal, {
            duration: 0,
            display: 'flex',
            onComplete: () => {
                this.modal.classList.add('active');
            }
        });
    }

    close() {
        this.modal.classList.remove('active');
        
        gsap.to(this.modal, {
            duration: 0.4,
            delay: 0.3,
            display: 'none',
            onComplete: () => {
                // Resume wheel rotation
                if (wheelController && !wheelController.isMobile) {
                    wheelController.isAutoRotating = true;
                }
            }
        });
    }
}

// ==========================================
// LIGHTBOX CONTROLLER
// ==========================================

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

        // Close on backdrop click
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox || e.target.classList.contains('lightbox-backdrop')) {
                this.close();
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.lightbox.classList.contains('active')) {
                this.close();
            }
            if (e.key === 'ArrowLeft' && this.lightbox.classList.contains('active')) {
                this.navigate(-1);
            }
            if (e.key === 'ArrowRight' && this.lightbox.classList.contains('active')) {
                this.navigate(1);
            }
        });
    }

    open(images, startIndex = 0) {
        this.images = images;
        this.currentIndex = startIndex;
        this.updateImage();

        gsap.to(this.lightbox, {
            duration: 0,
            display: 'flex',
            onComplete: () => {
                this.lightbox.classList.add('active');
            }
        });
    }

    close() {
        this.lightbox.classList.remove('active');
        
        gsap.to(this.lightbox, {
            duration: 0.4,
            delay: 0.3,
            display: 'none'
        });
    }

    navigate(direction) {
        this.currentIndex += direction;
        
        // Wrap around
        if (this.currentIndex < 0) {
            this.currentIndex = this.images.length - 1;
        } else if (this.currentIndex >= this.images.length) {
            this.currentIndex = 0;
        }

        this.updateImage();
    }

    updateImage() {
        // Fade out
        gsap.to(this.lightboxImage, {
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
                this.lightboxImage.src = this.images[this.currentIndex];
                // Fade in
                gsap.to(this.lightboxImage, {
                    opacity: 1,
                    duration: 0.3
                });
            }
        });

        // Update button states
        this.prevBtn.disabled = this.currentIndex === 0 && this.images.length === 1;
        this.nextBtn.disabled = this.currentIndex === this.images.length - 1 && this.images.length === 1;
    }
}

// ==========================================
// INITIALIZATION
// ==========================================

let wheelController;
let modalController;
let lightboxController;

document.addEventListener('DOMContentLoaded', () => {
    wheelController = new HolographicWheel();
    modalController = new ModalController();
    lightboxController = new LightboxController();

    console.log('🌀 Holographic Wheel initialized');
});

// Handle window resize
window.addEventListener('resize', () => {
    const wasMobile = wheelController.isMobile;
    const isMobileNow = window.innerWidth <= 768;

    if (wasMobile !== isMobileNow) {
        location.reload(); // Reload to switch between mobile/desktop layouts
    }
});
