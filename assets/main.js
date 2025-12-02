document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Optional: Animate hamburger to X
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

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const spans = menuToggle.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }

                const headerOffset = 80; // Height of fixed header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Lightbox Carousel
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentImages = [];
    let currentIndex = 0;

    // Create lightbox elements
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

    function showImage(index) {
        if (index < 0) index = currentImages.length - 1;
        if (index >= currentImages.length) index = 0;

        currentIndex = index;
        lightboxImg.src = currentImages[currentIndex];

        // Optional: Update caption if we had per-image captions
        // lightboxCaption.innerText = `Image ${currentIndex + 1} of ${currentImages.length}`;
    }

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imagesData = item.getAttribute('data-images');
            const title = item.getAttribute('data-title');

            if (imagesData) {
                try {
                    currentImages = JSON.parse(imagesData);
                    if (currentImages.length > 0) {
                        currentIndex = 0;
                        showImage(0);
                        lightboxCaption.innerText = title || '';
                        lightbox.classList.add('active');

                        // Show/hide nav buttons based on image count
                        if (currentImages.length > 1) {
                            lightboxPrev.style.display = 'block';
                            lightboxNext.style.display = 'block';
                        } else {
                            lightboxPrev.style.display = 'none';
                            lightboxNext.style.display = 'none';
                        }
                    }
                } catch (e) {
                    console.error('Error parsing gallery images', e);
                }
            }
        });
    });

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
});
