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

    // ===== 3D TILT EFFECT FOR PORTRAIT =====
    init3DTilt();

    // ===== TYPEWRITER EFFECT =====
    initTypewriter();

    // ===== ROTATING ROLES =====
    initRotatingRoles();

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

// ===== 3D TILT EFFECT FUNCTION =====
function init3DTilt() {
    const container = document.getElementById('portrait-tilt');
    if (!container) return;

    const frame = container.querySelector('.portrait-frame');
    const shine = container.querySelector('.portrait-shine');
    const badges = container.querySelectorAll('.floating-badge');

    const maxTilt = 15; // Maximum tilt angle in degrees
    const maxMove = 15; // Maximum badge movement in pixels

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate mouse position relative to center (-1 to 1)
        const mouseX = (e.clientX - centerX) / (rect.width / 2);
        const mouseY = (e.clientY - centerY) / (rect.height / 2);

        // Calculate tilt angles
        const tiltX = -mouseY * maxTilt; // Inverted for natural feel
        const tiltY = mouseX * maxTilt;

        // Apply 3D transform to frame
        frame.style.transform = `
            rotateX(${tiltX}deg) 
            rotateY(${tiltY}deg) 
            translateZ(10px)
        `;

        // Move shine based on mouse position
        if (shine) {
            const shineX = 50 + mouseX * 30;
            const shineY = 50 + mouseY * 30;
            shine.style.background = `
                linear-gradient(
                    ${135 + mouseX * 20}deg,
                    transparent 0%,
                    transparent 35%,
                    rgba(255, 255, 255, 0.08) 45%,
                    rgba(255, 255, 255, 0.15) 50%,
                    rgba(255, 255, 255, 0.08) 55%,
                    transparent 65%,
                    transparent 100%
                )
            `;
        }

        // Parallax effect on badges
        badges.forEach((badge, index) => {
            const direction = index % 2 === 0 ? 1 : -1;
            const depth = 0.5 + (index * 0.2);
            const moveX = mouseX * maxMove * depth * direction;
            const moveY = mouseY * maxMove * depth;
            badge.style.transform = `translateY(${-10 + moveY}px) translateX(${moveX}px)`;
        });
    });

    container.addEventListener('mouseleave', () => {
        // Reset transforms smoothly
        frame.style.transition = 'transform 0.5s ease-out';
        frame.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';

        badges.forEach(badge => {
            badge.style.transition = 'transform 0.5s ease-out';
            badge.style.transform = 'translateY(0) translateX(0)';
        });

        // Reset transition after animation
        setTimeout(() => {
            frame.style.transition = 'transform 0.1s ease-out';
            badges.forEach(badge => {
                badge.style.transition = 'transform 0.3s ease';
            });
        }, 500);
    });

    container.addEventListener('mouseenter', () => {
        frame.style.transition = 'transform 0.1s ease-out';
    });
}

// ===== TYPEWRITER EFFECT =====
function initTypewriter() {
    const typewriterElement = document.getElementById('typewriter');
    if (!typewriterElement) return;

    const phrases = [
        "Helping founders, brands, and institutions scale through systems, GTM strategy, and community-led growth.",
        "Building growth engines that create opportunities on autopilot.",
        "Designing networking systems that compound value over time.",
        "Turning vision into velocity for ambitious leaders."
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 50;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 30;
        } else {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 50;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            // Pause at end of phrase
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    // Start typing after a delay for other animations
    setTimeout(type, 2000);
}

// ===== ROTATING ROLES =====
function initRotatingRoles() {
    const roles = document.querySelectorAll('.rotating-roles .role');
    if (roles.length === 0) return;

    let currentIndex = 0;

    function rotateRoles() {
        // Remove active class from current
        roles[currentIndex].classList.remove('active');

        // Move to next role
        currentIndex = (currentIndex + 1) % roles.length;

        // Add active class to new current
        roles[currentIndex].classList.add('active');
    }

    // Rotate every 2.5 seconds
    setInterval(rotateRoles, 2500);
}
