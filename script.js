/* ================================================================
   MANOJ PORTFOLIO — 2025 REDESIGN — script.js
================================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ====================== YEAR COPYRIGHT ====================== */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ====================== CAREER YEARS ====================== */
    function professionalExperienceLabel() {
        const start = new Date(2022, 7, 1);
        const now = new Date();
        let whole = now.getFullYear() - start.getFullYear();
        if (now.getMonth() < start.getMonth() ||
           (now.getMonth() === start.getMonth() && now.getDate() < start.getDate())) {
            whole -= 1;
        }
        if (whole < 1) return '1+';
        const annivThisYear = new Date(now.getFullYear(), 7, 1);
        const anniv = now >= annivThisYear ? annivThisYear : new Date(now.getFullYear() - 1, 7, 1);
        return (now - anniv) / 86400000 >= 1 ? `${whole}+` : `${whole}`;
    }

    document.querySelectorAll('[data-career-years]').forEach(el => {
        el.textContent = professionalExperienceLabel();
    });

    /* ====================== PAGE LOADER ====================== */
    const loader = document.getElementById('loader');
    if (loader) {
        const hide = () => loader.classList.add('hidden');
        if (document.readyState === 'complete') {
            setTimeout(hide, 600);
        } else {
            window.addEventListener('load', () => setTimeout(hide, 600));
        }
    }

    /* ====================== FADE IN BODY ====================== */
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s ease';
    window.addEventListener('load', () => {
        requestAnimationFrame(() => { document.body.style.opacity = '1'; });
    });

    /* ====================== CUSTOM CURSOR ====================== */
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
        if (cursor) cursor.style.display = 'none';
        if (follower) follower.style.display = 'none';
    } else if (cursor && follower) {
        let mx = 0, my = 0;
        let fx = 0, fy = 0;

        document.addEventListener('mousemove', e => {
            mx = e.clientX;
            my = e.clientY;
            cursor.style.left = mx + 'px';
            cursor.style.top  = my + 'px';
        });

        function animateFollower() {
            fx += (mx - fx) * 0.12;
            fy += (my - fy) * 0.12;
            follower.style.left = fx + 'px';
            follower.style.top  = fy + 'px';
            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        const hoverTargets = 'a, button, .bento-card, .project-card, .timeline-card, .filter-pill, .social-btn, .proj-link-btn, .contact-email, .back-to-top';
        document.querySelectorAll(hoverTargets).forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovered');
                follower.classList.add('hovered');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovered');
                follower.classList.remove('hovered');
            });
        });

        document.addEventListener('mouseleave', () => {
            cursor.classList.add('hidden');
            follower.classList.add('hidden');
        });
        document.addEventListener('mouseenter', () => {
            cursor.classList.remove('hidden');
            follower.classList.remove('hidden');
        });
    }

    /* ====================== SCROLL PROGRESS ====================== */
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const total = document.documentElement.scrollHeight - window.innerHeight;
            progressBar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
        }, { passive: true });
    }

    /* ====================== NAVBAR SCROLL / ACTIVE LINKS ====================== */
    const navWrap = document.getElementById('nav-wrap');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id], footer[id]');

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scroll = window.scrollY;

        if (navWrap) {
            navWrap.classList.toggle('scrolled', scroll > 40);
        }

        // Active nav link based on section in view
        let current = '';
        sections.forEach(sec => {
            if (scroll >= sec.offsetTop - 120) current = sec.id;
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });

        lastScroll = scroll;
    }, { passive: true });

    /* ====================== MOBILE MENU ====================== */
    const hamburger = document.getElementById('nav-hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    function openMenu() {
        hamburger.classList.add('open');
        mobileMenu.classList.add('open');
        mobileMenu.setAttribute('aria-hidden', 'false');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (hamburger) hamburger.addEventListener('click', () => {
        mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            closeMenu();
            setTimeout(() => {
                if (target) {
                    const offset = target.getBoundingClientRect().top + window.scrollY - 90;
                    window.scrollTo({ top: offset, behavior: 'smooth' });
                }
            }, 300);
        });
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
    });

    /* ====================== SMOOTH SCROLL (desktop nav) ====================== */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || !href.startsWith('#')) return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const offset = target.getBoundingClientRect().top + window.scrollY - 90;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        });
    });

    /* ====================== BACK TO TOP ====================== */
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ====================== DOWNLOAD CV ====================== */
    const dnlBtn = document.getElementById('dnlbtn');
    if (dnlBtn) {
        dnlBtn.addEventListener('click', () => {
            const googleDocId = '1aZjV6kCcsA1GVBkwuqPRmdDH9U589G4V_SPKU_ZI6s0';
            const exportUrl = `https://docs.google.com/document/d/${googleDocId}/export?format=pdf`;

            const orig = dnlBtn.innerHTML;
            dnlBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            dnlBtn.disabled = true;

            const a = document.createElement('a');
            a.href = exportUrl;
            a.download = 'Manoj_Inamanamelluri_CV.pdf';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            setTimeout(() => {
                dnlBtn.innerHTML = orig;
                dnlBtn.disabled = false;
            }, 600);

            setTimeout(() => window.open(exportUrl, '_blank'), 800);
        });
    }

    /* ====================== REVEAL ANIMATIONS ====================== */
    function setupReveal() {
        const els = document.querySelectorAll('.reveal-up');
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        els.forEach(el => obs.observe(el));
    }
    setupReveal();

    /* ====================== PROJECTS DATA ====================== */
    const projectsData = [
        {
            image: 'assets/projects/secureusdt.png',
            title: 'SecureUSDT',
            description: 'Full-stack USDT investment platform with automated profits, secure wallets, and invoices.',
            link: 'https://secureusdt.com',
            repo: '',
            category: 'web',
            year: '2025',
            role: 'Full-Stack',
            company: 'Freelance',
            tech: ['React', 'Node.js', 'MongoDB', 'AWS', 'TronWeb']
        },
        {
            image: 'assets/projects/uktbc.png',
            title: 'UKTBC',
            description: 'Web application for donations and event management at a UK temple.',
            link: 'https://www.uktbc.org/',
            repo: '',
            category: 'web',
            year: '2025',
            role: 'Full-Stack',
            company: 'S&M Scholarly',
            tech: ['Figma', 'React', 'Express.js', 'MongoDB', 'Azure']
        },
        {
            image: 'assets/projects/jagbandhu.png',
            title: 'Jagbandhu Platform',
            description: 'Community-first platform connecting people with services. Modern stack, fast, and accessible.',
            link: 'https://www.jagbandhu.com',
            repo: '',
            category: 'web',
            year: '2023',
            role: 'Full-Stack',
            company: 'S&M Scholarly',
            tech: ['React', 'Node.js', 'MongoDB', 'AWS']
        },
        {
            image: 'assets/projects/fcf.png',
            title: 'Feed Care Fear (UX)',
            description: 'Design system and user flows for a healthcare app. Clean, legible, and patient-centric.',
            link: 'https://www.figma.com/design/vjrkcZ21wBSYECQb4EpP85/web-application--Copy-?node-id=0-1&t=kQTwAIBqM0mEpc1f-1',
            repo: '',
            category: 'design',
            year: '2023',
            role: 'Product Design',
            company: 'S&M Scholarly',
            tech: ['Figma', 'Prototype', 'Design Tokens']
        },
        {
            image: 'assets/projects/mason.png',
            title: 'Mason UPVC',
            description: 'E-commerce storefront with conversion-focused UI and smooth interactions.',
            link: 'https://www.figma.com/design/HX24sA4jsXfXNySFTEoujW/Websie--Copy---Copy-?t=dksRZbh6WaWRPBfg-1',
            repo: '',
            category: 'web',
            year: '2022',
            role: 'Frontend',
            company: 'S&M Scholarly',
            tech: ['HTML', 'CSS', 'JavaScript', 'Bootstrap']
        },
        {
            image: 'assets/projects/nehwe.png',
            title: 'Nehwe (Mobile)',
            description: 'Social discovery app. Lightweight, responsive, and built for quick iteration.',
            link: 'https://www.figma.com/design/Hboll34gY6z43Bm7Gp0UpF/Nehwe--Copy-?t=dksRZbh6WaWRPBfg-1',
            repo: '',
            category: 'mobile',
            year: '2023',
            role: 'Design + Flutter',
            company: 'S&M Scholarly',
            tech: ['Flutter', 'Firebase', 'UI/UX']
        },
        {
            image: 'assets/projects/srbs.png',
            title: 'SRBS (EdTech)',
            description: 'Student success app with offline-first flows and clear progress tracking.',
            link: 'https://www.figma.com/design/m6bOYNNibty89G1BHuSDqT/Mobile-App?t=dksRZbh6WaWRPBfg-1',
            repo: '',
            category: 'mobile',
            year: '2022',
            role: 'Mobile',
            company: 'S&M Scholarly',
            tech: ['Flutter', 'SQLite', 'REST']
        },
        {
            image: 'assets/projects/smscholarly.png',
            title: 'S&M Scholarly',
            description: 'Full-stack suite for schools: CMS, analytics, and parent portal deployed on AWS.',
            link: 'https://www.smscholarly.com/',
            repo: '',
            category: 'web',
            year: '2022',
            role: 'Full-Stack',
            company: 'S&M Scholarly',
            tech: ['React', 'Node.js', 'MySQL', 'AWS']
        }
    ];

    /* ====================== RENDER PROJECTS ====================== */
    const projectsGrid = document.getElementById('projects-grid');

    function renderProjects(filter = 'all') {
        if (!projectsGrid) return;
        projectsGrid.innerHTML = '';

        const list = filter === 'all'
            ? projectsData
            : projectsData.filter(p => p.category === filter);

        list.forEach((project, i) => {
            const card = document.createElement('div');
            card.className = 'project-card' + (i % 2 === 1 ? ' reverse' : '');
            card.style.setProperty('--delay', `${i * 0.08}s`);
            card.setAttribute('role', 'link');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `${project.title} — ${project.description}`);

            const repoBtn = project.repo
                ? `<a class="proj-link-btn" href="${project.repo}" target="_blank" aria-label="View code on GitHub" title="GitHub"><i class="fab fa-github"></i></a>`
                : '';
            const liveBtn = project.link
                ? `<a class="proj-link-btn" href="${project.link}" target="_blank" aria-label="View live site" title="Live Site"><i class="fas fa-arrow-up-right-from-square"></i></a>`
                : '';

            card.innerHTML = `
                <span class="project-index">${String(i + 1).padStart(2, '0')}</span>
                <div class="project-media">
                    <div class="project-image">
                        <div class="project-image-inner" style="background-image:url('${project.image}');width:100%;height:100%;"></div>
                    </div>
                </div>
                <div class="project-body">
                    <div class="project-head">
                        <span class="project-cat">${project.category}</span>
                        <span class="project-year">${project.year}</span>
                    </div>
                    <div class="project-badges">
                        ${project.role ? `<span class="badge badge-role-item"><i class="fas fa-bolt"></i>${project.role}</span>` : ''}
                        ${project.company ? `<span class="badge badge-company"><i class="fas fa-building"></i>${project.company}</span>` : ''}
                    </div>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-desc">${project.description}</p>
                    <div class="project-tech">
                        ${project.tech.map(t => `<span class="tech-pill">${t}</span>`).join('')}
                    </div>
                    <div class="project-footer">
                        <div class="project-links">${liveBtn}${repoBtn}</div>
                        <span class="proj-view-more">View Project <i class="fas fa-arrow-right"></i></span>
                    </div>
                </div>
            `;

            // Click to open live link
            if (project.link) {
                const openLink = () => window.open(project.link, '_blank');
                card.addEventListener('click', openLink);
                card.addEventListener('keydown', e => { if (e.key === 'Enter') openLink(); });
            }

            // Prevent inner link clicks from bubbling to card
            card.querySelectorAll('.proj-link-btn').forEach(btn => {
                btn.addEventListener('click', e => e.stopPropagation());
            });

            // Ripple on click
            card.addEventListener('click', function(e) {
                addRipple(this, e);
            });

            projectsGrid.appendChild(card);
        });

        // Trigger reveal for new cards
        requestAnimationFrame(() => {
            const cards = projectsGrid.querySelectorAll('.project-card');
            const obs = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.05 });
            cards.forEach(c => obs.observe(c));
        });
    }

    // Filter pills
    const filterPills = document.querySelectorAll('.filter-pill');
    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            renderProjects(pill.dataset.filter);
        });
    });

    renderProjects();

    /* ====================== CAREER DATA & TIMELINE ====================== */
    const careerData = [
        {
            img: 'assets/career/speshway.jpg',
            title: 'Senior UI/UX Designer',
            company: 'Speshway Solutions',
            timeline: 'Jul 2026 – Present',
            description: 'Designing intuitive, user-centered digital experiences across web and mobile products. Leading UI/UX strategy, wireframing, prototyping, and design systems while collaborating closely with engineering and product teams.',
            skills: ['UI/UX', 'Figma', 'Wireframing', 'Prototyping', 'Design Systems', 'User Research']
        },
        {
            img: 'assets/career/sm.png',
            title: 'UI/UX Designer',
            company: 'S&M Scholarly Solutions',
            timeline: 'Aug 2022 – Jul 2026',
            description: 'Leading full-stack delivery for a multi-product EdTech suite. Shipped CMS, analytics dashboard, and parent portal across web and mobile. Focus on performance, UX, and DX.',
            skills: ['React', 'Node.js', 'Flutter', 'UI/UX', 'AWS', 'MongoDB', 'SEO']
        },
        {
            img: 'assets/career/fsa.png',
            title: 'Full-Stack Development Bootcamp',
            company: 'FullStack Academy',
            timeline: 'Jan 2022 – May 2022',
            description: 'Built production-style applications with modern stacks and CI/CD pipelines. Strong focus on collaboration, code quality, and shipping.',
            skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git', 'Agile']
        },
        {
            img: 'assets/career/vvit.png',
            title: 'B.Tech — Mechanical Engineering',
            company: 'Vasireddy Venkatadri Institute of Technology',
            timeline: 'Jun 2017 – Jul 2021',
            description: 'Strong analytical foundation. Transitioned to software through self-learning and hands-on projects during and after graduation.',
            skills: ['Problem Solving', 'Systems Thinking', 'Mathematics', 'Engineering']
        }
    ];

    const careerTimeline = document.getElementById('career-timeline');
    if (careerTimeline) {
        careerData.forEach((item, i) => {
            const entry = document.createElement('div');
            entry.className = 'timeline-entry';
            entry.style.setProperty('--delay', `${i * 0.15}s`);

            entry.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="timeline-card">
                    <div class="timeline-head">
                        <div class="timeline-logo">
                            <img src="${item.img}" alt="${item.company}" loading="lazy">
                        </div>
                        <div class="timeline-meta">
                            <h3 class="timeline-role">${item.title}</h3>
                            <div class="timeline-tags">
                                <span class="tl-company">${item.company}</span>
                                <span class="tl-duration">${item.timeline}</span>
                            </div>
                        </div>
                    </div>
                    <p class="timeline-desc">${item.description}</p>
                    <div class="timeline-skills">
                        ${item.skills.map(s => `<span class="skill-pill">${s}</span>`).join('')}
                    </div>
                </div>
            `;

            careerTimeline.appendChild(entry);
        });

        // Animate timeline entries
        const tlObs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    tlObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

        careerTimeline.querySelectorAll('.timeline-entry').forEach(el => tlObs.observe(el));
    }

    /* ====================== 3D CARD TILT ====================== */
    function initTilt(selector) {
        document.querySelectorAll(selector).forEach(card => {
            let rect;
            card.addEventListener('mouseenter', () => { rect = card.getBoundingClientRect(); });
            card.addEventListener('mousemove', e => {
                if (!rect) return;
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                const rotX = (0.5 - y) * 10;
                const rotY = (x - 0.5) * 10;
                card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                rect = null;
            });
        });
    }

    initTilt('.bento-card');

    /* ====================== RIPPLE EFFECT ====================== */
    function addRipple(el, e) {
        const rect = el.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width  = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left   = x + 'px';
        ripple.style.top    = y + 'px';
        el.appendChild(ripple);

        setTimeout(() => ripple.remove(), 700);
    }

    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) { addRipple(this, e); });
    });

    /* ====================== MAGNETIC HOVER (buttons) ====================== */
    function initMagnetic(selector, strength = 0.3) {
        if (window.matchMedia('(hover: hover)').matches) {
            document.querySelectorAll(selector).forEach(el => {
                let rect;
                el.addEventListener('mouseenter', () => { rect = el.getBoundingClientRect(); });
                el.addEventListener('mousemove', e => {
                    if (!rect) return;
                    const dx = e.clientX - rect.left - rect.width / 2;
                    const dy = e.clientY - rect.top - rect.height / 2;
                    el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
                });
                el.addEventListener('mouseleave', () => {
                    el.style.transform = '';
                    rect = null;
                });
            });
        }
    }

    initMagnetic('.btn, .nav-cta, .social-btn, .back-to-top', 0.15);

    /* ====================== MARQUEE PAUSE ON HOVER ====================== */
    const marqueeInners = document.querySelectorAll('.marquee-inner');
    const marqueeTrack = document.querySelector('.marquee-track');
    if (marqueeTrack) {
        marqueeTrack.addEventListener('mouseenter', () => {
            marqueeInners.forEach(m => m.style.animationPlayState = 'paused');
        });
        marqueeTrack.addEventListener('mouseleave', () => {
            marqueeInners.forEach(m => m.style.animationPlayState = '');
        });
    }

    /* ====================== BENTO CARD STAGGER ====================== */
    const bentoObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.bento-card').forEach((c, i) => {
                    setTimeout(() => c.classList.add('in-view'), i * 80);
                });
                bentoObs.disconnect();
            }
        });
    }, { threshold: 0.1 });

    const bentoGrid = document.querySelector('.bento-grid');
    if (bentoGrid) {
        // Add initial hidden state handled by reveal-up via JS stagger
        document.querySelectorAll('.bento-card:not(.reveal-up)').forEach(c => {
            c.classList.add('reveal-up');
        });
        setupReveal();
    }

    /* ====================== AURORA PARALLAX ====================== */
    const auroras = document.querySelectorAll('.aurora');
    if (auroras.length && !isTouchDevice) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const s = window.scrollY;
                    auroras.forEach((a, i) => {
                        const speed = 0.06 + i * 0.03;
                        a.style.transform = `translateY(${s * speed}px)`;
                    });
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

});
