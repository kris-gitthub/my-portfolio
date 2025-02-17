document.addEventListener('DOMContentLoaded', () => {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    // Get DOM elements
    const voiceButton = document.getElementById('voiceButton');
    const floatingStatus = document.getElementById('floatingStatus');
    const statusText = document.getElementById('statusText');
    const navLinks = document.querySelectorAll('.nav-icon');
    const floatingMic = document.getElementById('floatingMic'); // here one
    const homeSection = document.getElementById('home'); // here one 
    let recognition;

    // Active navigation handling
    const updateActiveNav = () => {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`a[href="#${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLinks.forEach(link => link.classList.remove('active'));
                correspondingLink?.classList.add('active');
            }
        });
        window.addEventListener('scroll', () => {         // here 7lines
            const homeRect = homeSection.getBoundingClientRect();
            if (homeRect.bottom < 0) {
                floatingMic.classList.remove('d-none');
            } else {
                floatingMic.classList.add('d-none');
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav);

    // Skills animation
    const observeSkills = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const branches = entry.target.querySelectorAll('.skill-branch');
                    branches.forEach((branch, index) => {
                        setTimeout(() => {
                            branch.classList.add('visible');
                        }, index * 200);
                    });
                }
            });
        }, { threshold: 0.5 });

        const skillsSection = document.querySelector('.skills-tree');
        if (skillsSection) {
            observer.observe(skillsSection);
        }
    };

    observeSkills();

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
        floatingMic.addEventListener('click', startListening); //here is one
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase();
            updateStatus(`Command recognized: ${command}`);

            // Navigation logic
            const sections = ['home', 'about', 'skills', 'projects', 'contact'];
            sections.forEach(section => {
                if (command.includes(section)) {
                    window.location.href = `#${section}`;
                }
            });

            stopListening();
        };

        recognition.onerror = (event) => {
            updateStatus('Error occurred in recognition: ' + event.error);
            stopListening();
        };

        recognition.onend = () => {
            stopListening();
        };

        // Helper functions
        function updateStatus(message) {
            statusText.textContent = message;
            floatingStatus.textContent = message;
            floatingStatus.style.display = 'block';
            setTimeout(() => {
                floatingStatus.style.display = 'none';
            }, 3000);
        }

        function startListening() {
            try {
                recognition.start();
                voiceButton.classList.add('listening');
                updateStatus('Listening...');
            } catch (e) {
                updateStatus('Recognition already started!');
            }
        }

        function stopListening() {
            voiceButton.classList.remove('listening');
            updateStatus('Click to start');
        }

        // Voice button click handler
        voiceButton.addEventListener('click', startListening);
    } else {
        updateStatus('Speech recognition not supported in this browser');
        voiceButton.disabled = true;
    }

    // Form submission handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const spinner = this.querySelector('.spinner-border');
            const button = this.querySelector('button[type="submit"]');
            
            spinner.classList.remove('d-none');
            button.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                spinner.classList.add('d-none');
                button.disabled = false;
                alert('Message sent successfully!');
                this.reset();
            }, 2000);
        });
    }

    // Initialize carousel
    const projectCarousel = new bootstrap.Carousel(document.getElementById('projectCarousel'), {
        interval: 5000,
        wrap: true
    });

    document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a').forEach(element => { // here is three line
        if (!element.classList.contains('hover-effect')) {
            element.classList.add('hover-effect');
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});