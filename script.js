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
        
        cursorX += diffX * 0.1;
        cursorY += diffY * 0.1;
        
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


    // Projects Data with enhanced information
    const projectsData = [
        {
            image: 'assets/projects/jagbandhu.png',
            title: 'Jagbandhu',
            description: 'A comprehensive web platform for community services and social networking, built with modern web technologies.',
            link: 'https://www.jagbandhu.com',
            category: 'web',
            year: '2023',
            tech: ['React', 'Node.js', 'MongoDB', 'AWS']
        },
        {
            image: 'assets/projects/fcf.png',
            title: 'Feed Care Fear',
            description: 'UI/UX design for a healthcare application focused on patient care and medical data management.',
            link: 'https://www.figma.com/design/vjrkcZ21wBSYECQb4EpP85/web-application--Copy-?node-id=0-1&m=dev',
            category: 'design',
            year: '2023',
            tech: ['Figma', 'Adobe XD', 'UI/UX Design']
        },
        {
            image: 'assets/projects/mason.png',
            title: 'Mason Upvc',
            description: 'E-commerce website for UPVC products with modern design and seamless user experience.',
            link: 'https://www.figma.com/design/vjrkcZ21wBSYECQb4EpP85/web-application--Copy-?node-id=0-1&m=dev',
            category: 'web',
            year: '2022',
            tech: ['HTML', 'CSS', 'JavaScript', 'Bootstrap']
        },
        {
            image: 'assets/projects/nehwe.png',
            title: 'Nehwe',
            description: 'Mobile application design for a social platform connecting people with similar interests.',
            link: 'https://www.figma.com/design/vjrkcZ21wBSYECQb4EpP85/web-application--Copy-?node-id=0-1&m=dev',
            category: 'mobile',
            year: '2023',
            tech: ['Flutter', 'Firebase', 'UI/UX Design']
        },
        {
            image: 'assets/projects/srbs.png',
            title: "SRBS",
            description: 'Educational mobile application designed for student management and academic tracking.',
            link: "https://www.figma.com/design/m6bOYNNibty89G1BHuSDqT/Mobile-App?node-id=0-1&t=JIlfm5Rw1G3KMUtK-1",
            category: 'mobile',
            year: '2022',
            tech: ['Flutter', 'SQLite', 'REST API']
        },
        {
            image: "assets/projects/smscholarly.png",
            title: "S&M Scholarly",
            description: 'Comprehensive educational platform with web and mobile applications for academic excellence.',
            link: "https://www.smscholarly.com//",
            category: 'web',
            year: '2022',
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

            card.innerHTML = `
                <div class="project-image" style="background-image: url('${project.image}')">
                    <div class="project-overlay">View Project</div>
                </div>
                <div class="project-content">
                    <div class="project-category">${project.category.toUpperCase()}</div>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tech">
                        ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="project-footer">
                        <a href="${project.link}" target="_blank" class="project-link">
                            View Project <i class="fas fa-external-link-alt"></i>
                        </a>
                        <span class="project-year">${project.year}</span>
                    </div>
                </div>
            `;

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

    // Career timeline content
    const careerData = [
        {
            img: "assets/career/sm.png",
            title: "S&M Scholarly Solutions",
            company: "Software Engineer",
            timeline: "Aug 2022 - Present",
            description: `Leading full-stack development of educational platforms, crafting intuitive UI/UX designs, and building scalable web & mobile applications. Specialized in React, Node.js, and Flutter while driving SEO optimization strategies for enhanced digital presence.`,
            skills: ["React", "Node.js", "Flutter", "UI/UX Design", "AWS", "MongoDB", "SEO"]
        },
        {
            img: "assets/career/fsa.png",
            title: "FullStack Academy",
            company: "Full-Stack Development Bootcamp",
            timeline: "Jan 2022 - May 2022",
            description: `Intensive 4-month bootcamp mastering modern web technologies including React, Node.js, and MongoDB. Built multiple full-stack applications using agile methodologies, gaining hands-on experience in collaborative development and deployment.`,
            skills: ["JavaScript", "React", "Node.js", "MongoDB", "Git", "Agile", "Team Collaboration"]
        },
        {
            img: "assets/career/vvit.png",
            title: "Vasireddy Venkatadri Institute of Technology",
            company: "Bachelor of Technology - Mechanical Engineering",
            timeline: "Jun 2017 - Jul 2021",
            description: `Developed strong analytical and problem-solving foundation through mechanical engineering studies. Self-taught programming and web development, participating in tech workshops that sparked my transition into software engineering.`,
            skills: ["Problem Solving", "Analytical Thinking", "Mathematics", "Physics", "Engineering Design"]
        }
    ];

    const careerTimeline = document.getElementById('career-timeline');

    careerData.forEach((career, index) => {
        const entry = document.createElement('div');
        entry.className = 'career-entry';

        entry.innerHTML = `
            <div class="career-card">
                <div class="career-content">
                    <div class="career-header">
                        <div class="career-logo">
                            <img src="${career.img}" alt="${career.title}">
                        </div>
                        <div class="career-info">
                            <h3>${career.title}</h3>
                            <div class="career-company">${career.company}</div>
                            <div class="career-duration">${career.timeline}</div>
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
});
