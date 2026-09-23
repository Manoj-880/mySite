/* ================================================================
   PROJECT DETAIL PAGE — renders one project from projects-data.js
================================================================ */
document.addEventListener('DOMContentLoaded', () => {

    /* ---- custom cursor ---- */
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) {
        if (cursor) cursor.style.display = 'none';
        if (follower) follower.style.display = 'none';
    } else if (cursor && follower) {
        let mx = 0, my = 0, fx = 0, fy = 0;
        document.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            cursor.style.left = mx + 'px';
            cursor.style.top = my + 'px';
        });
        (function loop() {
            fx += (mx - fx) * 0.12;
            fy += (my - fy) * 0.12;
            follower.style.left = fx + 'px';
            follower.style.top = fy + 'px';
            requestAnimationFrame(loop);
        })();
        const bind = () => document.querySelectorAll('a, button, .project-card, .social-btn, .back-to-top, .tech-pill').forEach(el => {
            el.addEventListener('mouseenter', () => { cursor.classList.add('hovered'); follower.classList.add('hovered'); });
            el.addEventListener('mouseleave', () => { cursor.classList.remove('hovered'); follower.classList.remove('hovered'); });
        });
        bind();
        window._bindCursorHovers = bind;
        document.addEventListener('mouseleave', () => { cursor.classList.add('hidden'); follower.classList.add('hidden'); });
        document.addEventListener('mouseenter', () => { cursor.classList.remove('hidden'); follower.classList.remove('hidden'); });
    }

    /* ---- year ---- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---- loader ---- */
    const loader = document.getElementById('loader');
    if (loader) window.addEventListener('load', () => setTimeout(() => loader.classList.add('hidden'), 400));

    /* ---- back to top ---- */
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    /* ---- mobile menu ---- */
    const hamburger = document.getElementById('nav-hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (hamburger && mobileMenu) {
        const toggle = () => {
            const open = mobileMenu.classList.toggle('open');
            hamburger.classList.toggle('open', open);
            mobileMenu.setAttribute('aria-hidden', String(!open));
            hamburger.setAttribute('aria-expanded', String(open));
            document.body.style.overflow = open ? 'hidden' : '';
        };
        hamburger.addEventListener('click', toggle);
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) toggle();
        });
    }

    /* ---- render project ---- */
    const root = document.getElementById('project-root');
    const projects = window.PROJECTS || [];
    const slug = new URLSearchParams(location.search).get('p');
    const idx = projects.findIndex(p => p.slug === slug);
    const project = projects[idx];

    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

    if (!project) {
        document.title = 'Project not found — Manoj Inamanamelluri';
        const robots = document.querySelector('meta[name="robots"]');
        if (robots) robots.setAttribute('content', 'noindex, follow');
        root.innerHTML = `
            <div class="pp-missing">
                <h1>Project not found</h1>
                <p style="color:var(--text-dim);margin-bottom:2rem;">This project doesn't exist or the link is broken.</p>
                <a class="pp-link-btn" href="index.html#projects"><i class="fas fa-arrow-left"></i> Back to all projects</a>
            </div>`;
        return;
    }

    /* ---- SEO: title, meta description, canonical, Open Graph ---- */
    const pageUrl = `https://www.craftbymanoj.in/projects/${encodeURIComponent(project.slug)}.html`;
    const seoDesc = `${project.title} by Manoj Inamanamelluri — full-stack developer & UI/UX designer in Hyderabad, India. ${project.overview || project.description}`;
    const seoTitle = `${project.title} — Case Study | Manoj Inamanamelluri, Full-Stack Developer in Hyderabad`;

    document.title = seoTitle;
    const setMeta = (id, attr, value) => {
        const el = document.getElementById(id);
        if (el) el.setAttribute(attr, value);
    };
    setMeta('pp-meta-desc', 'content', seoDesc);
    setMeta('pp-canonical', 'href', pageUrl);
    setMeta('pp-og-title2', 'content', seoTitle);
    setMeta('pp-og-desc', 'content', seoDesc);
    setMeta('pp-og-url', 'content', pageUrl);
    setMeta('pp-og-image', 'content', `https://www.craftbymanoj.in/${project.image}`);

    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        description: project.overview || project.description,
        url: pageUrl,
        image: `https://www.craftbymanoj.in/${project.image}`,
        creator: {
            '@type': 'Person',
            name: 'Manoj Inamanamelluri',
            url: 'https://www.craftbymanoj.in/'
        },
        keywords: project.tech.join(', ')
    });
    document.head.appendChild(ld);

    const links = (project.links && project.links.length)
        ? project.links
        : (project.link ? [{ label: 'Live site', url: project.link, icon: 'fa-arrow-up-right-from-square' }] : []);

    const linksHtml = links.map(l => {
        const iconClass = l.brand ? `fab ${esc(l.icon)}` : `fas ${esc(l.icon || 'fa-link')}`;
        return `<a class="pp-link-btn" href="${esc(l.url)}" target="_blank" rel="noopener"><i class="${iconClass}"></i>${esc(l.label)}</a>`;
    }).join('');

    const work = (project.contributions || []).map(w => `<li>${esc(w)}</li>`).join('');
    const tech = project.tech.map(t => `<span class="tech-pill">${esc(t)}</span>`).join('');

    const prev = projects[idx - 1];
    const next = projects[idx + 1];
    const nav = `
        <div class="pp-nextprev">
            ${prev ? `<a class="prev" href="projects/${encodeURIComponent(prev.slug)}.html"><span>← Previous</span>${esc(prev.title)}</a>` : ''}
            ${next ? `<a class="next" href="projects/${encodeURIComponent(next.slug)}.html"><span>Next →</span>${esc(next.title)}</a>` : ''}
        </div>`;

    root.innerHTML = `
        <a class="pp-back" href="index.html#projects"><i class="fas fa-arrow-left"></i> All projects</a>

        <div class="pp-hero">
            <div class="pp-hero-img" style="background-image:url('${esc(project.image)}')"></div>
            <div class="pp-hero-scrim"></div>
            <div class="pp-hero-text">
                <span class="pp-eyebrow">${esc(project.category)} · ${esc(project.year)}</span>
                <h1 class="pp-title">${esc(project.title)}</h1>
            </div>
        </div>

        <div class="pp-body">
            <div class="pp-main">
                <section class="pp-section">
                    <h2 class="pp-h">Overview</h2>
                    <p class="pp-lead">${esc(project.overview || project.description)}</p>
                </section>
                ${work ? `
                <section class="pp-section">
                    <h2 class="pp-h">What I did</h2>
                    <ul class="pp-work">${work}</ul>
                </section>` : ''}
            </div>

            <aside class="pp-aside">
                ${project.company ? `<div class="pp-aside-block"><span class="pp-h">Company</span><span class="pp-fact">${esc(project.company)}</span></div>` : ''}
                ${project.role ? `<div class="pp-aside-block"><span class="pp-h">Role</span><span class="pp-fact">${esc(project.role)}</span></div>` : ''}
                ${project.timeline ? `<div class="pp-aside-block"><span class="pp-h">Timeline</span><span class="pp-fact">${esc(project.timeline)}</span></div>` : ''}
                <div class="pp-aside-block"><span class="pp-h">Tech stack</span><div class="pp-tech">${tech}</div></div>
                ${links.length ? `<div class="pp-aside-block"><span class="pp-h">Links</span><div class="pp-links">${linksHtml}</div></div>` : ''}
            </aside>
        </div>

        ${(prev || next) ? nav : ''}
    `;

    if (window._bindCursorHovers) window._bindCursorHovers();
});
