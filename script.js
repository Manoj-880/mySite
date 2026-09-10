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

    /* ====================== PROJECTS DATA (shared: projects-data.js) ====================== */
    const projectsData = window.PROJECTS || [];

    /* ====================== RENDER PROJECTS ====================== */
    const projectsGrid = document.getElementById('projects-grid');

    function renderProjects(filter = 'all') {
        if (!projectsGrid) return;
        projectsGrid.innerHTML = '';

        const list = filter === 'all'
            ? projectsData
            : projectsData.filter(p => p.category === filter);

        list.forEach((project, i) => {
            const card = document.createElement('a');
            card.className = 'project-card' + (i === 0 ? ' featured' : '');
            card.style.setProperty('--delay', `${i * 0.08}s`);
            card.href = `project.html?p=${encodeURIComponent(project.slug)}`;
            card.setAttribute('aria-label', `${project.title} — open project overview`);

            card.innerHTML = `
                <div class="pc-media">
                    <div class="pc-img" style="background-image:url('${project.image}')"></div>
                    <div class="pc-scrim"></div>
                    <div class="pc-top">
                        <span class="pc-cat">${project.category}</span>
                        <span class="pc-year">${project.year}</span>
                    </div>
                    <span class="pc-num">${String(i + 1).padStart(2, '0')}</span>
                    <span class="pc-arrow" aria-hidden="true"><i class="fas fa-arrow-right"></i></span>
                </div>
                <div class="pc-body">
                    <div class="pc-meta">
                        ${project.company ? `<span class="pc-company">${project.company}</span>` : ''}
                        ${project.role ? `<span class="pc-role">${project.role}</span>` : ''}
                    </div>
                    <h3 class="pc-title">${project.title}</h3>
                    <p class="pc-desc">${project.description}</p>
                    <div class="pc-tech">
                        ${project.tech.slice(0, 5).map(t => `<span class="tech-pill">${t}</span>`).join('')}
                    </div>
                    <span class="pc-view">View overview <i class="fas fa-arrow-right"></i></span>
                </div>
            `;

            card.addEventListener('click', function (e) { addRipple(this, e); });

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
            description: 'Directs end-to-end design processes — user research, prototyping, and design systems — and mentors junior designers while collaborating closely with engineering and product teams.',
            skills: ['UI/UX', 'Figma', 'User Research', 'Prototyping', 'Design Systems', 'Mentoring']
        },
        {
            img: 'assets/career/sm.png',
            title: 'UI/UX Designer & Developer',
            company: 'S&M Scholarly Solutions',
            timeline: 'Aug 2022 – Jul 2026',
            description: 'Designed interfaces, built responsive web applications, developed backend APIs, and delivered cross-platform mobile apps across a multi-product suite.',
            skills: ['React', 'Node.js', 'Express.js', 'Flutter', 'Electron.js', 'MongoDB', 'MySQL', 'AWS', 'Figma']
        },
        {
            img: 'assets/career/fsa.png',
            title: 'UI/UX Design Certification',
            company: 'Fullstack Academy',
            timeline: '2022',
            description: 'Structured training in user-centered design — research, wireframing, prototyping, and design systems — alongside modern full-stack development fundamentals.',
            skills: ['UI/UX', 'Wireframing', 'Prototyping', 'JavaScript', 'React', 'Git']
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
