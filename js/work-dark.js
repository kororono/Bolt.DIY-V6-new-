document.addEventListener('DOMContentLoaded', function() {
    const projectItems = document.querySelectorAll('.project-item');
    const previewImage = document.getElementById('preview-image');
    
    // Function to handle mouse enter on project items
    function handleProjectMouseEnter(e) {
        const imagePath = this.getAttribute('data-image');
        if (imagePath) {
            previewImage.src = imagePath;
            previewImage.style.opacity = '1';
        }
    }
    
    // Function to handle mouse leave on project items
    function handleProjectMouseLeave() {
        previewImage.style.opacity = '0';
    }
    
    // Add event listeners to all project items
    projectItems.forEach(item => {
        item.addEventListener('mouseenter', handleProjectMouseEnter);
        item.addEventListener('mouseleave', handleProjectMouseLeave);
    });
    
    // Set initial preview to first project (optional)
    if (projectItems.length > 0) {
        const firstImagePath = projectItems[0].getAttribute('data-image');
        if (firstImagePath) {
            previewImage.src = firstImagePath;
        }
    }
});
