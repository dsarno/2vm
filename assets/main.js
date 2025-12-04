// Load projects dynamically from CMS
async function loadProjects() {
    try {
        const response = await fetch('/content/projects-manifest.json');
        if (!response.ok) {
            console.log('No projects manifest found, using static gallery');
            return;
        }

        const projects = await response.json();
        const galleryGrid = document.querySelector('.gallery-grid');

        if (!galleryGrid || projects.length === 0) return;

        // Clear existing static items
        galleryGrid.innerHTML = '';

        // Add CMS projects
        projects.forEach(project => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.setAttribute('data-images', JSON.stringify(project.images || [project.featured_image]));
            item.setAttribute('data-title', project.title);

            item.innerHTML = `
                <img src="${project.featured_image}" alt="${project.title}">
                <div class="overlay">
                    <h3>${project.title}</h3>
                    <p>Click to view project</p>
                </div>
            `;

            galleryGrid.appendChild(item);
        });

        // Reinitialize gallery click handlers
        initializeGallery();
    } catch (error) {
        console.log('Using static gallery');
    }
}

function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imagesData = this.getAttribute('data-images');
            const title = this.getAttribute('data-title');
            
            if (imagesData) {
                try {
                    window.currentImages = JSON.parse(imagesData);
                    if (window.currentImages.length > 0) {
                        window.currentIndex = 0;
                        window.showImage(0);
                        const lightboxCaption = document.querySelector('.lightbox-caption');
                        const lightboxPrev = document.querySelector('.lightbox-prev');
                        const lightboxNext = document.querySelector('.lightbox-next');
                        const lightbox = document.querySelector('.lightbox');
                        
                        if (lightboxCaption) lightboxCaption.innerText = title || '';
                        if (lightbox) lightbox.classList.add('active');
                        
                        if (window.currentImages.length > 1) {
                            if (lightboxPrev) lightboxPrev.style.display = 'block';
                            if (lightboxNext) lightboxNext.style.display = 'block';
                        } else {
                            if (lightboxPrev) lightboxPrev.style.display = 'none';
                            if (lightboxNext) lightboxNext.style.display = 'none';
                        }
                    }
                } catch (e) {
                    console.error('Error parsing gallery images', e);
                }
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            const spans = menuToggle.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const spans = menuToggle.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }

                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Lightbox Carousel - Global variables
    window.currentImages = [];
    window.currentIndex = 0;

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';

    const lightboxContent = document.createElement('div');
    lightboxContent.className = 'lightbox-content';

    const lightboxImg = document.createElement('img');

    const lightboxClose = document.createElement('button');
    lightboxClose.className = 'lightbox-close';
    lightboxClose.innerHTML = '&times;';

    const lightboxPrev = document.createElement('button');
    lightboxPrev.className = 'lightbox-nav lightbox-prev';
    lightboxPrev.innerHTML = '&#10094;';

    const lightboxNext = document.createElement('button');
    lightboxNext.className = 'lightbox-nav lightbox-next';
    lightboxNext.innerHTML = '&#10095;';

    const lightboxCaption = document.createElement('div');
    lightboxCaption.className = 'lightbox-caption';

    lightboxContent.appendChild(lightboxImg);
    lightboxContent.appendChild(lightboxCaption);
    lightbox.appendChild(lightboxContent);
    lightbox.appendChild(lightboxClose);
    lightbox.appendChild(lightboxPrev);
    lightbox.appendChild(lightboxNext);
    document.body.appendChild(lightbox);

    window.showImage = function (index) {
        if (index < 0) index = currentImages.length - 1;
        if (index >= currentImages.length) index = 0;

        currentIndex = index;
        lightboxImg.src = currentImages[currentIndex];
    };

    // Navigation events
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentIndex - 1);
    });

    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentIndex + 1);
    });

    // Close events
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === lightboxContent) {
            lightbox.classList.remove('active');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
        } else if (e.key === 'ArrowLeft') {
            showImage(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            showImage(currentIndex + 1);
        }
    });

    // Initialize gallery with static items first
    initializeGallery();

    // Try to load CMS projects
    loadProjects();
});
