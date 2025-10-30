document.addEventListener("DOMContentLoaded", () => {
    // Custom Cursor Functionality (Desktop only)
    const cursor = document.querySelector('.custom-cursor');
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
        cursor.style.display = 'none';
        document.body.style.cursor = 'auto';
        return;
    }
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let isHovering = false;
    let isClicking = false;

    // Smooth cursor movement
    function animateCursor() {
        const diffX = mouseX - cursorX;
        const diffY = mouseY - cursorY;
        
        // Increase interpolation factor for faster catch-up
        cursorX += diffX * 0.18;
        cursorY += diffY * 0.18;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }

    // Mouse move event
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Create trail effect
        if (Math.random() > 0.7) {
            createTrail(e.clientX, e.clientY);
        }
    });

    // Create cursor trail
    function createTrail(x, y) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = x + 'px';
        trail.style.top = y + 'px';
        document.body.appendChild(trail);
        
        setTimeout(() => {
            trail.remove();
        }, 600);
    }

    // Mouse enter/leave for hoverable elements
    const hoverableElements = document.querySelectorAll('a, button, .nav-item, .tech-item, .project-card, .icon-link, .menu-icon, .tech-icons i, .social-icons a, .hero-buttons button, .service-card, .mobile-nav-link, .mobile-social-link, .mobile-menu-close');
    
    hoverableElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            isHovering = true;
            cursor.classList.add('hover');
        });
        
        element.addEventListener('mouseleave', () => {
            isHovering = false;
            cursor.classList.remove('hover');
        });
    });

    // Click events
    document.addEventListener('mousedown', () => {
        isClicking = true;
        cursor.classList.add('click');
    });
    
    document.addEventListener('mouseup', () => {
        isClicking = false;
        cursor.classList.remove('click');
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.classList.add('hidden');
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.classList.remove('hidden');
    });

    // Start cursor animation
    animateCursor();

    // Theme locked to dark. Remove any stored preference.
    try { localStorage.removeItem('theme-preference'); } catch (_) {}
    document.body.setAttribute('data-theme', 'dark');

    // Mobile Menu Functionality
    const menuBtn = document.querySelector('.menu-icon');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    // Open mobile menu
    menuBtn.addEventListener('click', () => {
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });

    // Close mobile menu
    mobileMenuClose.addEventListener('click', () => {
        closeMobileMenu();
    });

    // Close mobile menu when clicking overlay
    mobileMenuOverlay.addEventListener('click', (e) => {
        if (e.target === mobileMenuOverlay) {
            closeMobileMenu();
        }
    });

    // Close mobile menu function
    function closeMobileMenu() {
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scrolling
    }

    // Handle mobile navigation links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                closeMobileMenu(); // Close the menu
                setTimeout(() => {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }, 300); // Wait for menu close animation
            }
        });
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    //open CV in new tab
    document.getElementById('dnlbtn').addEventListener('click', () => {
        window.open('assets/Manoj Inamanamelluri CV.pdf', '_blank');
    });


    // Projects Data with enhanced information (rewritten for trendy UI)
    const projectsData = [
        {
            image: 'assets/projects/secureusdt.png',
            title: 'SecureUSDT',
            description: 'Full‑stack USDT investment platform with automated profits, secure wallets, and invoices.',
            link: 'https://secureusdt.com',
            repo: 'https://github.com/Manoj-880/ustdCrypto',
            category: 'web',
            year: '2025',
            role: 'Full‑Stack',
            company: 'Freelance',
            tech: ['React', 'Node.js', 'MongoDB', 'AWS', 'TronWeb']
        },
        {
            image: 'assets/projects/jagbandhu.png',
            title: 'Jagbandhu Platform',
            description: 'Community-first platform connecting people with services. Modern stack, fast, and accessible.',
            link: 'https://www.jagbandhu.com',
            category: 'web',
            year: '2023',
            role: 'Full‑Stack',
            company: 'S&M Scholarly Solutions',
            repo: '',
            tech: ['React', 'Node.js', 'MongoDB', 'AWS']
        },
        {
            image: 'assets/projects/fcf.png',
            title: 'Feed Care Fear (UX)',
            description: 'Design system and flows for a healthcare app. Clean, legible, and patient‑centric.',
            link: 'https://www.figma.com/design/vjrkcZ21wBSYECQb4EpP85/web-application--Copy-?node-id=0-1&m=dev',
            category: 'design',
            year: '2023',
            role: 'Product Design',
            company: 'S&M Scholarly Solutions',
            repo: '',
            tech: ['Figma', 'Proto', 'Design Tokens']
        },
        {
            image: 'assets/projects/mason.png',
            title: 'Mason UPVC',
            description: 'E‑commerce storefront with conversion‑focused UI and super‑smooth interactions.',
            link: 'https://www.figma.com/design/vjrkcZ21wBSYECQb4EpP85/web-application--Copy-?node-id=0-1&m=dev',
            category: 'web',
            year: '2022',
            role: 'Frontend',
            company: 'S&M Scholarly Solutions',
            repo: '',
            tech: ['HTML', 'CSS', 'JavaScript', 'Bootstrap']
        },
        {
            image: 'assets/projects/nehwe.png',
            title: 'Nehwe (Mobile)',
            description: 'Social discovery app. Lightweight, responsive, and built for quick iteration.',
            link: 'https://www.figma.com/design/vjrkcZ21wBSYECQb4EpP85/web-application--Copy-?node-id=0-1&m=dev',
            category: 'mobile',
            year: '2023',
            role: 'Design + Flutter',
            company: 'S&M Scholarly Solutions',
            repo: '',
            tech: ['Flutter', 'Firebase', 'UI/UX']
        },
        {
            image: 'assets/projects/srbs.png',
            title: "SRBS (EdTech)",
            description: 'Student success app with offline‑first flows and clear progress tracking.',
            link: "https://www.figma.com/design/m6bOYNNibty89G1BHuSDqT/Mobile-App?node-id=0-1&t=JIlfm5Rw1G3KMUtK-1",
            category: 'mobile',
            year: '2022',
            role: 'Mobile',
            company: 'S&M Scholarly Solutions',
            repo: '',
            tech: ['Flutter', 'SQLite', 'REST']
        },
        {
            image: "assets/projects/smscholarly.png",
            title: "S&M Scholarly",
            description: 'Full‑stack suite for schools: CMS, analytics, and parent portal—deployed on AWS.',
            link: "https://www.smscholarly.com//",
            category: 'web',
            year: '2022',
            role: 'Full‑Stack',
            company: 'S&M Scholarly Solutions',
            repo: '',
            tech: ['React', 'Node.js', 'MySQL', 'AWS']
        }
    ];

    // Project filtering functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectsGrid = document.getElementById('projects-grid');
    let currentFilter = 'all';

    function renderProjects(filter = 'all') {
        projectsGrid.innerHTML = '';
        
        const filteredProjects = filter === 'all' 
            ? projectsData 
            : projectsData.filter(project => project.category === filter);

        filteredProjects.forEach((project) => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.setAttribute('data-category', project.category);

            const roleBadge = project.role ? `<div class="badge-role"><i class=\"fas fa-bolt\"></i>${project.role}</div>` : '';
            const companyChip = project.company ? `<div class=\"project-company\"><i class=\"fas fa-building\"></i>${project.company}</div>` : '';
            const repoIcon = project.repo ? `<a class="action-icon" href="${project.repo}" target="_blank" aria-label="View Code"><i class="fab fa-github"></i></a>` : '';
            const liveIcon = project.link ? `<a class="action-icon" href="${project.link}" target="_blank" aria-label="Open Live"><i class="fas fa-external-link-alt"></i></a>` : '';

            card.innerHTML = `
                <div class="project-image" style="background-image: url('${project.image}')"></div>
                <div class="project-content">
                    <div class="project-category">${project.category.toUpperCase()}</div>
                    <div class="project-meta">${roleBadge}${companyChip}</div>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tech">
                        ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="project-footer">
                        <div class="project-actions">${liveIcon}${repoIcon}</div>
                        <span class="project-year">${project.year}</span>
                    </div>
                </div>
            `;

            // Make whole card clickable to live link
            if (project.link) {
                card.setAttribute('role', 'link');
                card.setAttribute('tabindex', '0');
                card.addEventListener('click', () => {
                    window.open(project.link, '_blank');
                });
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        window.open(project.link, '_blank');
                    }
                });
            }

            // Prevent action icon clicks from bubbling to card
            setTimeout(() => {
                card.querySelectorAll('.action-icon').forEach(icon => {
                    icon.addEventListener('click', (e) => e.stopPropagation());
                });
            }, 0);

            projectsGrid.appendChild(card);
        });
    }

    // Filter button event listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get filter value and render projects
            currentFilter = button.getAttribute('data-filter');
            renderProjects(currentFilter);
        });
    });


    // Initial render
    renderProjects();

    // After rendering, enhance projects with tilt + reveal
    enhanceInteractiveCards();

    // Career timeline content
    const careerData = [
        {
            img: "assets/career/sm.png",
            title: "Software Engineer",
            company: "S&M Scholarly Solutions",
            timeline: "Aug 2022 - Present",
            description: `Leading full‑stack delivery for a multi‑product EdTech suite. Shipped CMS, analytics, and parent portal across web/mobile. Focus on performance, UX, and DX.`,
            skills: ["React", "Node.js", "Flutter", "UI/UX", "AWS", "MongoDB", "SEO"]
        },
        {
            img: "assets/career/fsa.png",
            title: "Full‑Stack Development Bootcamp",
            company: "FullStack Academy",
            timeline: "Jan 2022 - May 2022",
            description: `Built production‑style apps with modern stacks and CI. Strong focus on collaboration, code quality, and shipping.`,
            skills: ["JavaScript", "React", "Node.js", "MongoDB", "Git", "Agile"]
        },
        {
            img: "assets/career/vvit.png",
            title: "B.Tech — Mechanical Engineering",
            company: "Vasireddy Venkatadri Institute of Technology",
            timeline: "Jun 2017 - Jul 2021",
            description: `Strong analytical foundation. Transitioned to software through self‑learning and hands‑on projects.`,
            skills: ["Problem Solving", "Systems Thinking", "Mathematics", "Engineering"]
        }
    ];

    const careerTimeline = document.getElementById('career-timeline');

    careerData.forEach((career, index) => {
        const entry = document.createElement('div');
        entry.className = 'career-entry reveal';

        entry.innerHTML = `
            <div class="career-card">
                <div class="career-content">
                    <div class="career-header">
                        <div class="career-logo">
                            <img src="${career.img}" alt="${career.title}">
                        </div>
                        <div class="career-info">
                            <h3>${career.title}</h3>
                            <div class="career-meta">
                                <div class="career-company">${career.company}</div>
                                <div class="career-duration">${career.timeline}</div>
                            </div>
                        </div>
                    </div>
                    <p class="career-description">${career.description}</p>
                    <div class="career-skills">
                        ${career.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
            </div>
            <div class="career-timeline-dot"></div>
        `;

        careerTimeline.appendChild(entry);
    });

    // Scroll reveal for sections and generated items
    setupScrollReveal();

    // Parallax effect for hero gradient blob
    setupParallaxBlob();

    // Magnetic hover for buttons/links
    setupMagneticHover();
});

function setupScrollReveal() {
    const revealables = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });

    revealables.forEach(el => observer.observe(el));
}

function enhanceInteractiveCards() {
    // Add tilt class to service and project cards
    document.querySelectorAll('.service-card, .project-card').forEach(card => {
        card.classList.add('tilt', 'reveal');
        addTilt(card);
    });
}

function addTilt(card) {
    let rect;
    const damp = 20; // lower -> stronger tilt
    const reset = () => {
        card.style.transform = '';
    };
    card.addEventListener('mouseenter', () => { rect = card.getBoundingClientRect(); });
    card.addEventListener('mousemove', (e) => {
        if (!rect) rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotX = (0.5 - y) * damp;
        const rotY = (x - 0.5) * damp;
        card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0)`;
    });
    card.addEventListener('mouseleave', () => { reset(); });
}

function setupParallaxBlob() {
    const blob = document.querySelector('.gradient-blob');
    if (!blob) return;
    let lastY = window.scrollY;
    const onScroll = () => {
        const y = window.scrollY;
        const delta = (y - lastY) * 0.05;
        blob.style.transform = `translate(-3vw, ${Math.max(-20, Math.min(20, delta))}px)`;
        lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
}

function setupMagneticHover() {
    const magnets = document.querySelectorAll('.primary-btn, .secondary-btn, .filter-btn');
    magnets.forEach(el => {
        let rect;
        el.addEventListener('mousemove', (e) => {
            rect = rect || el.getBoundingClientRect();
            const relX = e.clientX - rect.left - rect.width / 2;
            const relY = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${relX * 0.05}px, ${relY * 0.05}px)`;
        });
        el.addEventListener('mouseleave', () => { el.style.transform = ''; rect = undefined; });
    });
}
