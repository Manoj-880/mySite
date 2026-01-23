document.addEventListener("DOMContentLoaded", () => {
    // Custom Cursor Functionality (Desktop only)
    const cursor = document.querySelector('.custom-cursor');
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
        // On touch devices, hide custom cursor but continue initializing the site
        if (cursor) cursor.style.display = 'none';
        document.body.style.cursor = 'auto';
    } else {
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
    }

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

    // Download CV from Google Docs
    document.getElementById('dnlbtn').addEventListener('click', () => {
        const googleDocId = '1aZjV6kCcsA1GVBkwuqPRmdDH9U589G4V_SPKU_ZI6s0';
        const exportUrl = `https://docs.google.com/document/d/${googleDocId}/export?format=pdf`;
        
        // Show loading state
        const btn = document.getElementById('dnlbtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening...';
        btn.disabled = true;
        
        // Method 1: Try direct download using hidden iframe (works in most browsers)
        // This bypasses CORS issues by letting the browser handle the download
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.src = exportUrl;
        document.body.appendChild(iframe);
        
        // Method 2: Also create a direct download link as backup
        // This will trigger download in browsers that support it
        const downloadLink = document.createElement('a');
        downloadLink.href = exportUrl;
        downloadLink.download = 'Manoj Inamanamelluri CV.pdf';
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        
        // Reset button after a short delay
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            
            // Cleanup
            setTimeout(() => {
                if (iframe.parentNode) {
                    document.body.removeChild(iframe);
                }
                if (downloadLink.parentNode) {
                    document.body.removeChild(downloadLink);
                }
            }, 2000);
        }, 500);
        
        // If iframe method doesn't work, open in new tab as final fallback
        setTimeout(() => {
            // Check if download started (this is a simple check)
            // If user needs to manually download, they can use the new tab
            const fallbackWindow = window.open(exportUrl, '_blank');
            
            // If popup was blocked, show message
            if (!fallbackWindow || fallbackWindow.closed || typeof fallbackWindow.closed === 'undefined') {
                // Popup blocked, show user-friendly message
                console.log('If download didn\'t start, the PDF should open in a new tab. Right-click and select "Save As" if needed.');
            }
        }, 1000);
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
            
            // Re-animate projects after filter
            setTimeout(() => {
                const projectCards = document.querySelectorAll('.project-card');
                projectCards.forEach((card, index) => {
                    card.classList.remove('animate-in');
                    setTimeout(() => {
                        card.classList.add('animate-in');
                    }, index * 100);
                });
            }, 50);
        });
    });


    // Initial render
    renderProjects();

    // After rendering, enhance projects with tilt + reveal
    enhanceInteractiveCards();

    // Setup animations for newly rendered projects
    setTimeout(() => {
        setupSectionAnimations();
    }, 100);

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

    // Enhanced scroll reveal for sections and generated items
    setupScrollReveal();

    // Parallax effect for hero gradient blob
    setupParallaxBlob();

    // Magnetic hover for buttons/links
    setupMagneticHover();

    // Scroll progress indicator
    setupScrollProgress();

    // Interactive tech stack animations
    setupTechStackAnimations();

    // Enhanced section animations
    setupSectionAnimations();

    // Add smooth scroll to navigation links
    setupSmoothScroll();

    // Add scroll-triggered animations for descriptions
    setupTextAnimations();

    // Setup floating UI elements
    setupFloatingUI();

    // Add page transition effects
    setupPageTransitions();

    // Navbar scroll effect
    setupNavbarScroll();
});

function setupScrollReveal() {
    const revealables = document.querySelectorAll('.reveal, .reveal-fade, .reveal-slide-left, .reveal-slide-right, .reveal-scale, .reveal-rotate');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

    revealables.forEach(el => observer.observe(el));
}

function setupScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    function updateProgress() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
}

function setupTechStackAnimations() {
    const techItems = document.querySelectorAll('.tech-item');
    const techContainer = document.querySelector('.tech-icons-container');
    const subHeading = document.querySelector('.home-container .sub-heading');

    if (techItems.length === 0) return;

    // Animate sub-heading first
    const headingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                headingObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (subHeading) {
        headingObserver.observe(subHeading);
    }

    // Animate tech container line
    const containerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                containerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    if (techContainer) {
        containerObserver.observe(techContainer);
    }

    // Animate tech items with stagger
    const techObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                techItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animate-in');
                    }, index * 80); // Stagger delay
                });
                techObserver.disconnect();
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -100px 0px' });

    if (techItems.length > 0) {
        techObserver.observe(techItems[0].closest('.tech-icons-container') || techItems[0]);
    }
}

function setupSectionAnimations() {
    // Animate section headings
    const sectionHeadings = document.querySelectorAll('.services-content .sub-heading, .projects-content .sub-heading, .experience-content .sub-heading');
    const headingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                headingObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    sectionHeadings.forEach(heading => headingObserver.observe(heading));

    // Animate service cards
    const serviceCards = document.querySelectorAll('.service-card');
    if (serviceCards.length > 0) {
        const serviceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    serviceCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('animate-in');
                        }, index * 150);
                    });
                    serviceObserver.disconnect();
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        serviceObserver.observe(serviceCards[0].closest('.services-grid'));
    }

    // Animate project cards
    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const projectCards = document.querySelectorAll('.project-card');
                projectCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const projectsGrid = document.getElementById('projects-grid');
    if (projectsGrid) {
        projectObserver.observe(projectsGrid);
    }

    // Animate career entries
    const careerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const careerEntries = document.querySelectorAll('.career-entry');
                careerEntries.forEach((entry, index) => {
                    setTimeout(() => {
                        entry.classList.add('animate-in');
                    }, index * 200);
                });
                careerObserver.disconnect();
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const careerTimeline = document.getElementById('career-timeline');
    if (careerTimeline) {
        careerObserver.observe(careerTimeline);
    }
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
    
    let ticking = false;
    
    const onScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                const parallaxSpeed = 0.2;
                const yPos = scrolled * parallaxSpeed;
                const scale = 1 + (scrolled * 0.0001);
                blob.style.transform = `translate(-3vw, ${yPos}px) scale(${Math.min(scale, 1.1)})`;
                ticking = false;
            });
            ticking = true;
        }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Also add parallax to floating elements
    const floatingCodes = document.querySelectorAll('.floating-code');
    const particles = document.querySelectorAll('.particle');
    
    const updateParallax = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                
                floatingCodes.forEach((code, index) => {
                    const speed = 0.05 + (index * 0.02);
                    const currentTransform = code.style.transform || '';
                    const baseTransform = currentTransform.includes('translateY') 
                        ? currentTransform.split('translateY')[0] 
                        : '';
                    code.style.transform = `${baseTransform} translateY(${scrolled * speed}px)`;
                });
                
                particles.forEach((particle, index) => {
                    const speed = 0.03 + (index * 0.01);
                    particle.style.transform = `translateY(${scrolled * speed}px)`;
                });
                
                ticking = false;
            });
            ticking = true;
        }
    };
    
    window.addEventListener('scroll', updateParallax, { passive: true });
}

function setupMagneticHover() {
    const magnets = document.querySelectorAll('.primary-btn, .secondary-btn, .filter-btn, .tech-item');
    magnets.forEach(el => {
        let rect;
        el.addEventListener('mousemove', (e) => {
            rect = rect || el.getBoundingClientRect();
            const relX = e.clientX - rect.left - rect.width / 2;
            const relY = e.clientY - rect.top - rect.height / 2;
            const distance = Math.sqrt(relX * relX + relY * relY);
            const maxDistance = Math.max(rect.width, rect.height);
            
            if (distance < maxDistance) {
                const strength = (1 - distance / maxDistance) * 0.15;
                el.style.transform = `translate(${relX * strength}px, ${relY * strength}px)`;
            }
        });
        el.addEventListener('mouseleave', () => { 
            el.style.transform = ''; 
            rect = undefined; 
        });
    });
}

function setupSmoothScroll() {
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function setupTextAnimations() {
    // Animate paragraph text on scroll
    const paragraphs = document.querySelectorAll('.paragraph, .projects-description, .experience-description');
    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                textObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });
    
    paragraphs.forEach(para => textObserver.observe(para));
}

function setupFloatingUI() {
    // Back to top button
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Floating social icons
    const floatingSocial = document.getElementById('floating-social');
    if (floatingSocial) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
                floatingSocial.classList.add('visible');
            } else {
                floatingSocial.classList.remove('visible');
            }
        }, { passive: true });

        // Stagger animation for social links
        const socialLinks = floatingSocial.querySelectorAll('.floating-social-link');
        socialLinks.forEach((link, index) => {
            link.style.opacity = '0';
            link.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                link.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                link.style.opacity = '1';
                link.style.transform = 'translateX(0)';
            }, index * 100 + 500);
        });
    }
}

function setupPageTransitions() {
    // Add smooth fade-in on page load
    document.body.style.opacity = '0';
    window.addEventListener('load', () => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    });

    // Add ripple effect on button clicks
    const buttons = document.querySelectorAll('button, .project-card, .service-card');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

function setupNavbarScroll() {
    const navbar = document.querySelector('.nav-bar');
    if (!navbar) return;

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
}
