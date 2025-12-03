document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Mobile Navigation Toggle (Hamburger Menu) ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (mainNav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                menuToggle.querySelector('i').classList.remove('fa-times');
                menuToggle.querySelector('i').classList.add('fa-bars');
            }
        });
    });

    // --- 2. Smooth Scroll (with sticky header offset) ---
    // Note: CSS scroll-behavior: smooth is used, but this ensures correct offset for sticky header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const headerHeight = document.getElementById('header').offsetHeight;

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 3. Contact Form Validation and Submission ---
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const charCountSpan = document.querySelector('.char-count');
    const toastNotification = document.getElementById('toast-notification');

    const validationRules = {
        name: {
            regex: /^[a-zA-Z\s]+$/, // Alphabetic and whitespace
            errorMessage: 'Name must contain only letters and spaces.',
            requiredMessage: 'Name cannot be empty.'
        },
        email: {
            regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email format
            errorMessage: 'Please enter a valid email address.',
            requiredMessage: 'Email cannot be empty.'
        },
        message: {
            maxLength: 500,
            requiredMessage: 'Message cannot be empty.'
        }
    };

    function validateField(input, rule) {
        const value = input.value.trim();
        const errorElement = document.getElementById(`${input.id}-error`);
        errorElement.textContent = '';
        input.classList.remove('error');

        if (value === '') {
            errorElement.textContent = rule.requiredMessage;
            input.classList.add('error');
            return false;
        }

        if (rule.regex && !rule.regex.test(value)) {
            errorElement.textContent = rule.errorMessage;
            input.classList.add('error');
            return false;
        }

        if (input.id === 'message' && value.length > rule.maxLength) {
            errorElement.textContent = `Message is too long (max ${rule.maxLength} characters).`;
            input.classList.add('error');
            return false;
        }

        return true;
    }

    // Live validation for name and email on blur
    nameInput.addEventListener('blur', () => validateField(nameInput, validationRules.name));
    emailInput.addEventListener('blur', () => validateField(emailInput, validationRules.email));
    messageInput.addEventListener('blur', () => validateField(messageInput, validationRules.message));

    // Message character count update
    messageInput.addEventListener('input', () => {
        const remaining = validationRules.message.maxLength - messageInput.value.length;
        charCountSpan.textContent = `${remaining} characters remaining`;
        if (remaining < 0) {
            charCountSpan.style.color = 'red';
        } else {
            charCountSpan.style.color = '';
        }
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const isNameValid = validateField(nameInput, validationRules.name);
        const isEmailValid = validateField(emailInput, validationRules.email);
        const isMessageValid = validateField(messageInput, validationRules.message);

        if (isNameValid && isEmailValid && isMessageValid) {
            // Simulate form submission success
            console.log('Form submitted successfully:', {
                name: nameInput.value,
                email: emailInput.value,
                message: messageInput.value
            });

            // Show success confirmation (Toast)
            toastNotification.classList.add('show');
            setTimeout(() => {
                toastNotification.classList.remove('show');
            }, 3000);

            // Reset form
            contactForm.reset();
            charCountSpan.textContent = `${validationRules.message.maxLength} characters remaining`;
        } else {
            console.log('Form validation failed.');
        }
    });

    // --- 4. Animated Skill Bars (Intersection Observer) ---
    const skillBars = document.querySelectorAll('.skill-bar-container');
    const aboutSection = document.getElementById('about');

    const animateSkills = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillBars.forEach(container => {
                    const level = container.getAttribute('data-level');
                    const skillLevelElement = container.querySelector('.skill-level');
                    skillLevelElement.style.width = `${level}%`;
                });
                // Stop observing once the animation has run
                observer.unobserve(entry.target);
            }
        });
    };

    const skillObserver = new IntersectionObserver(animateSkills, {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.5 // Trigger when 50% of the section is visible
    });

    if (aboutSection) {
        skillObserver.observe(aboutSection);
    }

    // --- 5. Project Details Modal ---
    const modal = document.getElementById('project-modal');
    const closeModalBtn = modal.querySelector('.close-btn');
    const viewDetailsBtns = document.querySelectorAll('.view-details-btn');

    // Placeholder data for project details
    const projectData = {
        1: {
            title: 'Data Visualization Dashboard',
            screenshot: 'assets/project1_screenshot.jpg',
            description: 'This project is an interactive dashboard built to visualize complex datasets. It demonstrates proficiency in data processing (Python) and front-end data rendering. The dashboard allows users to filter and view data trends in real-time, showcasing a blend of analytical and web development skills.',
            tech: 'HTML, CSS (Grid), JavaScript (D3.js concept, simulated), Python (Backend concept)',
            link: '#'
        },
        2: {
            title: 'E-commerce Frontend Clone',
            screenshot: 'assets/project2_screenshot.jpg',
            description: 'A pixel-perfect clone of a modern e-commerce product listing page. The primary focus was on mastering advanced CSS layout techniques, specifically Flexbox and Grid, to ensure a robust and responsive design across all devices (mobile, tablet, desktop).',
            tech: 'HTML5, CSS3 (Flexbox & Grid), Responsive Design',
            link: '#'
        },
        3: {
            title: 'Vanilla JS Todo List App',
            screenshot: 'assets/project3_screenshot.jpg',
            description: 'A classic Todo List application developed using only vanilla JavaScript. It features CRUD operations, task filtering, and persistent storage using the browser\'s localStorage API. This project highlights core JavaScript DOM manipulation and event handling skills.',
            tech: 'HTML, CSS, Vanilla JavaScript, localStorage API',
            link: '#'
        }
    };

    function openModal(projectId) {
        const data = projectData[projectId];
        if (!data) return;

        modal.querySelector('#modal-title').textContent = data.title;
        modal.querySelector('.modal-screenshot').src = data.screenshot;
        modal.querySelector('.modal-screenshot').alt = `${data.title} Screenshot`;
        modal.querySelector('.modal-description').textContent = data.description;
        modal.querySelector('.modal-tech').innerHTML = `<strong>Technology Used:</strong> ${data.tech}`;
        modal.querySelector('.modal-link').href = data.link;

        modal.style.display = 'block';
        modal.setAttribute('aria-hidden', 'false');
    }

    function closeModal() {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
    }

    viewDetailsBtns.forEach(button => {
        button.addEventListener('click', () => {
            const projectId = button.getAttribute('data-project-id');
            openModal(projectId);
        });
    });

    closeModalBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Close modal on ESC key press
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
});
