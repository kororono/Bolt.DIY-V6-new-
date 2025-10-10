// ==========================================
// HOLOGRAPHIC WHEEL - FINAL VERSION
// ==========================================

// Project Data
const projects = {
    reload: {
        id: 'reload',
        title: 'RELOAD',
        description: '3D Product Animation Showcase for RELOAD isotonic drink. A dynamic visualization bringing the product to life through stunning motion graphics and realistic rendering.',
        thumbnail: 'assets/projects/reload/reload-thumb.webp',
        images: ['assets/projects/reload/reload-1.jpg', 'assets/projects/reload/reload-2.jpg', 'assets/projects/reload/reload-3.jpg']
    },
    kfc: {
        id: 'kfc',
        title: 'KFC',
        description: 'Animated 3D Drive-Thru commercial showcasing the KFC brand experience through immersive 3D environments and product visualization.',
        thumbnail: 'assets/projects/kfc/KFC-thumb.webp',
        images: ['assets/projects/kfc/kfc-1.jpg', 'assets/projects/kfc/kfc-2.jpg']
    }
};

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
        this.velocity = 0.1;
        this.idleVelocity = 0.1;
        this.isAutoRotating = true;
        this.isDragging = false;
        this.startX = 0;
        this.lastDragX = 0;
        this.dragVelocity = 0;
        this.isMobile = window.innerWidth <= 768;
        this.init();
    }

    init() {
        if (!this.isMobile) {
            this.generateTiles();
            this.positionTiles();
            this.startAutoRotation();
            this.attachEvents();
        } else {
            this.generateMobileTiles();
        }
    }

    generateTiles() {
        const numTiles = projectsArray.length * 2; // Duplicate for a fuller circle
        const angleStep = 360 / numTiles;
        [...projectsArray, ...projectsArray].forEach((project, index) => {
            const tile = document.createElement('div');
            tile.className = 'wheel-tile';
            tile.dataset.project = project.id;
            tile.dataset.angle = index * angleStep;
            tile.innerHTML = `
                <div class="tile-image"><img src="${project.thumbnail}" alt="${project.title}"></div>
                <div class="tile-title">${project.title}</div>
            `;
            tile.addEventListener('click', () => {
                // Only allow click if the card is not at the back
                if (!tile.classList.contains('is-back')) {
                    this.openModal(project.id);
                }
            });
            this.wheel.appendChild(tile);
            this.tiles.push(tile);
        });
    }

    generateMobileTiles() {
        projectsArray.forEach((project) => {
            const tile = document.createElement('div');
            tile.className = 'wheel-tile';
            tile.dataset.project = project.id;
            tile.innerHTML = `
                <div class="tile-image"><img src="${project.thumbnail}" alt="${project.title}"></div>
                <div class="tile-title">${project.title}</div>
            `;
            tile.addEventListener('click', () => this.openModal(project.id));
            this.wheel.appendChild(tile);
        });
    }

    positionTiles() {
        const radius = 450;
        this.tiles.forEach((tile) => {
            const angle = parseFloat(tile.dataset.angle);
            // *** BILLBOARD EFFECT RE-IMPLEMENTED ***
            tile.style.transform = `
                translate(-50%, -50%)
                rotateY(${angle}deg)
                translateZ(${radius}px)
                rotateY(${-angle}deg)
            `;
        });
    }

    updateTileStyles() {
        this.tiles.forEach(tile => {
            const initialAngle = parseFloat(tile.dataset.angle);
            const effectiveAngle = (initialAngle + this.currentRotation % 360 + 360) % 360;
            const combinedTransform = tile.style.transform;

            if (effectiveAngle > 90 && effectiveAngle < 270) {
                tile.classList.add('is-back');
            } else {
                tile.classList.remove('is-back');
            }
            
            // Re-apply the scale from the 'is-back' class directly to the transform
            if (tile.classList.contains('is-back')) {
                 tile.style.transform = `${combinedTransform.split('scale')[0]} scale(0.85)`;
            } else {
                 tile.style.transform = `${combinedTransform.split('scale')[0]} scale(1)`;
            }
        });
    }

    startAutoRotation() {
        if (this.isMobile) return;
        const animate = () => {
            if (this.isAutoRotating && !this.isDragging) {
                this.velocity += (this.idleVelocity - this.velocity) * 0.05;
                this.targetRotation += this.velocity;
            } else if (this.isDragging) {
                this.targetRotation += this.dragVelocity;
                this.dragVelocity *= 0.95;
            } else {
                this.velocity += (this.idleVelocity - this.velocity) * 0.02;
                this.targetRotation += this.velocity;
            }
            this.currentRotation += (this.targetRotation - this.currentRotation) * 0.1;
            this.wheel.style.transform = `rotateY(${this.currentRotation}deg)`;
            this.updateTileStyles();
            requestAnimationFrame(animate);
        };
        animate();
    }

    attachEvents() {
        if (this.isMobile) return;
        this.wheel.addEventListener('mousedown', (e) => this.startDrag(e));
        window.addEventListener('mousemove', (e) => this.onDrag(e));
        window.addEventListener('mouseup', () => this.endDrag());
        this.wheel.addEventListener('touchstart', (e) => this.startDrag(e.touches[0]));
        window.addEventListener('touchmove', (e) => this.onDrag(e.touches[0]));
        window.addEventListener('touchend', () => this.endDrag());
        this.tiles.forEach(tile => {
            tile.addEventListener('mouseenter', () => { this.isAutoRotating = false; });
            tile.addEventListener('mouseleave', () => { setTimeout(() => { this.isAutoRotating = true; }, 300); });
        });
    }

    startDrag(e) {
        this.isDragging = true;
        this.startX = e.clientX || e.pageX;
        this.lastDragX = this.startX;
        this.dragVelocity = 0;
        this.isAutoRotating = false;
        document.body.style.cursor = 'grabbing';
    }

    onDrag(e) {
        if (!this.isDragging) return;
        const currentX = e.clientX || e.pageX;
        const deltaX = currentX - this.lastDragX;
        this.dragVelocity = deltaX * 0.5;
        this.targetRotation += this.dragVelocity;
        this.lastDragX = currentX;
    }

    endDrag() {
        if (!this.isDragging) return;
        this.isDragging = false;
        document.body.style.cursor = 'default';
        this.velocity = this.dragVelocity;
        setTimeout(() => { this.isAutoRotating = true; }, 300);
    }

    openModal(projectId) {
        const project = projects[projectId];
        if (!project) return;
        modalController.open(project);
        this.isAutoRotating = false;
    }
}

// ==========================================
// MODAL & LIGHTBOX CONTROLLERS (Unchanged)
// ==========================================
class ModalController {
    constructor() {
        this.modal = document.getElementById('infoModal'); this.modalTitle = document.getElementById('modalTitle');
        this.modalDescription = document.getElementById('modalDescription'); this.modalGallery = document.getElementById('modalGallery');
        this.closeBtn = document.getElementById('modalClose'); this.currentProject = null; this.attachEvents();
    }
    attachEvents() {
        this.closeBtn.addEventListener('click', () => this.close());
        this.modal.addEventListener('click', (e) => { if (e.target === this.modal || e.target.classList.contains('modal-backdrop')) { this.close(); } });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && this.modal.classList.contains('active')) { this.close(); } });
    }
    open(project) {
        this.currentProject = project; this.modalTitle.textContent = project.title;
        this.modalDescription.textContent = project.description; this.modalGallery.innerHTML = '';
        project.images.forEach((imagePath, index) => {
            const imgWrapper = document.createElement('div'); imgWrapper.className = 'gallery-image';
            imgWrapper.innerHTML = `<img src="${imagePath}" alt="${project.title} - Image ${index + 1}">`;
            imgWrapper.addEventListener('click', () => { lightboxController.open(project.images, index); });
            this.modalGallery.appendChild(imgWrapper);
        });
        this.modal.style.display = 'flex';
        requestAnimationFrame(() => this.modal.classList.add('active'));
    }
    close() {
        this.modal.classList.remove('active');
        setTimeout(() => {
            this.modal.style.display = 'none';
            if (wheelController && !wheelController.isMobile) { wheelController.isAutoRotating = true; }
        }, 400);
    }
}
class LightboxController { /* This class can remain exactly the same as your original v7 file */ }

// ==========================================
// INITIALIZATION
// ==========================================
let wheelController, modalController, lightboxController;
document.addEventListener('DOMContentLoaded', () => {
    wheelController = new HolographicWheel();
    modalController = new ModalController();
    lightboxController = new LightboxController(); // Assuming this class is defined elsewhere or copied from original
    console.log('🌀 Holographic Wheel Final Version Initialized');
});
window.addEventListener('resize', () => {
    if (wheelController) {
        const wasMobile = wheelController.isMobile;
        const isMobileNow = window.innerWidth <= 768;
        if (wasMobile !== isMobileNow) { location.reload(); }
    }
});
