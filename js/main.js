/**
 * Premier Stone Importers - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navLinks && navLinks.classList.contains('active')) {
            if (!e.target.closest('.nav-links') && !e.target.closest('.mobile-menu-toggle')) {
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        }
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }

        lastScroll = currentScroll;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const target = document.querySelector(targetId);

            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Gallery filter functionality
    const galleryFilters = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Remove active class from all filters
            galleryFilters.forEach(f => f.classList.remove('active'));
            // Add active class to clicked filter
            this.classList.add('active');

            const filterValue = this.dataset.filter;

            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.dataset.category === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Contact Form with AJAX submission to FormSubmit.co
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Basic validation
            const name = this.querySelector('[name="name"]');
            const email = this.querySelector('[name="email"]');
            const message = this.querySelector('[name="message"]');
            let isValid = true;

            // Reset previous errors
            this.querySelectorAll('.error').forEach(el => el.remove());
            this.querySelectorAll('.form-group').forEach(el => el.classList.remove('has-error'));

            if (name && !name.value.trim()) {
                showError(name, 'Please enter your name');
                isValid = false;
            }

            if (email && !isValidEmail(email.value)) {
                showError(email, 'Please enter a valid email address');
                isValid = false;
            }

            if (message && !message.value.trim()) {
                showError(message, 'Please enter your message');
                isValid = false;
            }

            if (isValid) {
                // Show loading state
                const originalBtnText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;

                // Prepare form data
                const formData = new FormData(this);

                // Submit via AJAX
                fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success === "true" || data.success === true) {
                        // Success
                        showFormStatus('success', 'Thank you for your message! We will get back to you within 24 hours.');
                        contactForm.reset();
                    } else {
                        // Error from FormSubmit
                        showFormStatus('error', 'There was a problem sending your message. Please try again or email us directly at info@premierstones.com');
                    }
                })
                .catch(error => {
                    console.error('Form submission error:', error);
                    showFormStatus('error', 'There was a problem sending your message. Please try again or email us directly at info@premierstones.com');
                })
                .finally(() => {
                    // Reset button state
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                });
            }
        });
    }

    function showFormStatus(type, message) {
        if (formStatus) {
            formStatus.className = 'form-status ' + type;
            formStatus.innerHTML = '<p>' + message + '</p>';
            formStatus.style.display = 'block';

            // Scroll to status message
            formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            // Auto-hide success message after 10 seconds
            if (type === 'success') {
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 10000);
            }
        }
    }

    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('has-error');

        const error = document.createElement('span');
        error.className = 'error';
        error.textContent = message;
        error.style.cssText = 'color: #dc3545; font-size: 13px; margin-top: 5px; display: block;';

        formGroup.appendChild(error);
    }

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .product-card, .application-card, .testimonial-card, .stone-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add animation class styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Product color filter from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const colourParam = urlParams.get('colour');

    if (colourParam) {
        // You could filter products here based on colour
        console.log('Filtering by colour:', colourParam);
    }

    // Lazy loading images (basic implementation)
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
});

// Utility function to format phone numbers for display
function formatPhoneNumber(phone) {
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2 $3');
}

// Dropdown menu for mobile - touch support
document.querySelectorAll('.has-dropdown > a').forEach(link => {
    link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            const dropdown = this.nextElementSibling;

            if (dropdown.style.display === 'block') {
                dropdown.style.display = 'none';
            } else {
                // Close all other dropdowns
                document.querySelectorAll('.dropdown').forEach(d => d.style.display = 'none');
                dropdown.style.display = 'block';
            }
        }
    });
});
