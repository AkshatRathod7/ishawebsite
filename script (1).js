// Smooth reveal animations on scroll
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in class to elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.expertise-card, .theme-card, .community-card, .service-item, .impact-stat').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Parallax effect for glows
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                document.querySelectorAll('.glow').forEach((glow, index) => {
                    const speed = 0.05 + (index * 0.02);
                    glow.style.transform = `translateY(${scrollY * speed}px)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    });

    // ===== AUTOMATIC GALLERY SLIDER =====
    initGallerySlider();

    console.log('✨ Isha Ostwal - Speaker Website Loaded');
});

// Gallery Auto-Slider
function initGallerySlider() {
    const track = document.querySelector('.gallery-track');
    if (!track) return;

    const items = track.querySelectorAll('.gallery-item');
    if (items.length === 0) return;

    // Clone items for infinite scroll effect
    items.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
    });

    let scrollPosition = 0;
    const scrollSpeed = 1; // pixels per frame
    let isPaused = false;
    let animationId;

    // Get the width of original items (before cloning)
    const getOriginalWidth = () => {
        let width = 0;
        for (let i = 0; i < items.length; i++) {
            width += items[i].offsetWidth + 20; // 20px gap
        }
        return width;
    };

    const animate = () => {
        if (!isPaused) {
            scrollPosition += scrollSpeed;

            // Reset when we've scrolled past original items
            const originalWidth = getOriginalWidth();
            if (scrollPosition >= originalWidth) {
                scrollPosition = 0;
            }

            track.style.transform = `translateX(-${scrollPosition}px)`;
        }
        animationId = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Pause on hover
    const galleryScroll = document.querySelector('.gallery-scroll');
    if (galleryScroll) {
        galleryScroll.addEventListener('mouseenter', () => {
            isPaused = true;
        });

        galleryScroll.addEventListener('mouseleave', () => {
            isPaused = false;
        });

        // Touch support for mobile
        galleryScroll.addEventListener('touchstart', () => {
            isPaused = true;
        });

        galleryScroll.addEventListener('touchend', () => {
            setTimeout(() => {
                isPaused = false;
            }, 2000); // Resume after 2 seconds
        });
    }

    // Pause when tab is not visible (performance optimization)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            isPaused = true;
        } else {
            isPaused = false;
        }
    });
}

// Add CSS for fade-in animation
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
    }
    .gallery-track {
        transition: none;
    }
`;
document.head.appendChild(style);
