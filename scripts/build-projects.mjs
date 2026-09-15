#!/usr/bin/env node
/* ================================================================
   BUILD: static, individually-indexable project pages
   ----------------------------------------------------------------
   Reads projects-data.js (the single source of truth for project
   content) and writes one fully pre-rendered HTML file per project
   to projects/<slug>/index.html — each with its own <title>,
   meta description, canonical URL, Open Graph tags, and
   CreativeWork + BreadcrumbList JSON-LD.

   Run after editing projects-data.js:
       node scripts/build-projects.mjs

   Also regenerates sitemap.xml with clean URLs + <lastmod>.
================================================================ */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SITE_URL = 'https://www.craftbymanoj.in';
const TODAY = new Date().toISOString().slice(0, 10);

/* ---- load projects-data.js (defines window.PROJECTS) ---- */
const dataSrc = readFileSync(path.join(ROOT, 'projects-data.js'), 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(dataSrc, sandbox, { filename: 'projects-data.js' });
const PROJECTS = sandbox.window.PROJECTS;
if (!Array.isArray(PROJECTS) || !PROJECTS.length) {
    throw new Error('Could not load window.PROJECTS from projects-data.js');
}

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function truncate(str, max) {
    if (str.length <= max) return str;
    const cut = str.slice(0, max - 1);
    return cut.slice(0, cut.lastIndexOf(' ')) + '…';
}

function renderProject(project, index) {
    const url = `${SITE_URL}/projects/${project.slug}/`;
    const seoDesc = truncate(
        `${project.title} by Manoj Inamanamelluri — full-stack developer & UI/UX designer in Hyderabad. ${project.overview || project.description}`,
        155
    );
    const seoTitle = truncate(`${project.title} — Case Study | Manoj Inamanamelluri`, 60);
    const imageUrl = `${SITE_URL}/${project.image}`;

    const links = (project.links && project.links.length)
        ? project.links
        : (project.link ? [{ label: 'Live site', url: project.link, icon: 'fa-arrow-up-right-from-square' }] : []);

    const linksHtml = links.map(l => {
        const iconClass = l.brand ? `fab ${esc(l.icon)}` : `fas ${esc(l.icon || 'fa-link')}`;
        return `<a class="pp-link-btn" href="${esc(l.url)}" target="_blank" rel="noopener"><i class="${iconClass}"></i>${esc(l.label)}</a>`;
    }).join('\n                    ');

    const work = (project.contributions || []).map(w => `<li>${esc(w)}</li>`).join('\n                        ');
    const tech = project.tech.map(t => `<span class="tech-pill">${esc(t)}</span>`).join('\n                    ');

    const prev = PROJECTS[index - 1];
    const next = PROJECTS[index + 1];
    const navHtml = (prev || next) ? `
        <div class="pp-nextprev">
            ${prev ? `<a class="prev" href="../${prev.slug}/"><span>← Previous</span>${esc(prev.title)}</a>` : ''}
            ${next ? `<a class="next" href="../${next.slug}/"><span>Next →</span>${esc(next.title)}</a>` : ''}
        </div>` : '';

    const jsonLdCreativeWork = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        description: project.overview || project.description,
        url,
        image: imageUrl,
        creator: { '@type': 'Person', name: 'Manoj Inamanamelluri', url: `${SITE_URL}/` },
        keywords: project.tech.join(', ')
    };

    const jsonLdBreadcrumb = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Projects', item: `${SITE_URL}/#projects` },
            { '@type': 'ListItem', position: 3, name: project.title, item: url }
        ]
    };

    return `<!DOCTYPE html>
<html lang="en-IN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(seoTitle)}</title>
    <meta name="description" content="${esc(seoDesc)}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta name="author" content="Manoj Inamanamelluri">
    <link rel="canonical" href="${url}">

    <meta property="og:type" content="article">
    <meta property="og:title" content="${esc(seoTitle)}">
    <meta property="og:description" content="${esc(seoDesc)}">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:locale" content="en_IN">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(seoTitle)}">
    <meta name="twitter:description" content="${esc(seoDesc)}">
    <meta name="twitter:image" content="${imageUrl}">

    <link rel="shortcut icon" href="../../assets/logo.svg" type="image/x-icon">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link rel="stylesheet" href="../../style.css">

    <script type="application/ld+json">${JSON.stringify(jsonLdCreativeWork)}</script>
    <script type="application/ld+json">${JSON.stringify(jsonLdBreadcrumb)}</script>
</head>
<body>

    <div class="page-wipe" id="pageWipe">
        <div class="page-wipe-panel">
            <div class="loader-line"></div>
        </div>
    </div>

    <div class="scroll-progress" id="scroll-progress"></div>

    <div class="cursor" id="cursor"></div>
    <div class="cursor-follower" id="cursor-follower"></div>

    <button class="back-to-top" id="back-to-top" aria-label="Back to top">
        <i class="fas fa-arrow-up"></i>
    </button>

    <!-- ====================== NAV ====================== -->
    <header class="nav-wrap scrolled" id="nav-wrap">
        <nav class="nav" id="nav">
            <a href="../../index.html" class="nav-logo" aria-label="Home">
                <img src="../../assets/logo.svg" alt="Manoj Inamanamelluri — Full-Stack Developer & UI/UX Designer in Hyderabad">
            </a>
            <ul class="nav-links" role="list">
                <li><a href="../../index.html#home" class="nav-link">Home</a></li>
                <li><a href="../../index.html#services" class="nav-link">Services</a></li>
                <li><a href="../../index.html#projects" class="nav-link">Projects</a></li>
                <li><a href="../../index.html#experience" class="nav-link">Experience</a></li>
                <li><a href="../../index.html#contact" class="nav-link">Contact</a></li>
            </ul>
            <a class="nav-cta" href="../../index.html#contact">Hire Me</a>
            <button class="nav-hamburger" id="nav-hamburger" aria-label="Toggle menu" aria-expanded="false">
                <span></span><span></span><span></span>
            </button>
        </nav>
    </header>

    <div class="mobile-menu" id="mobile-menu" aria-hidden="true">
        <div class="mobile-menu-inner">
            <nav class="mobile-nav" aria-label="Mobile navigation">
                <a href="../../index.html#home" class="mobile-nav-link"><span>01</span>Home</a>
                <a href="../../index.html#services" class="mobile-nav-link"><span>02</span>Services</a>
                <a href="../../index.html#projects" class="mobile-nav-link"><span>03</span>Projects</a>
                <a href="../../index.html#experience" class="mobile-nav-link"><span>04</span>Experience</a>
                <a href="../../index.html#contact" class="mobile-nav-link"><span>05</span>Contact</a>
            </nav>
            <div class="mobile-menu-footer">
                <p class="mobile-email">manoj.inamanamelluri123@gmail.com</p>
            </div>
        </div>
    </div>

    <!-- ====================== PROJECT (statically pre-rendered for SEO) ====================== -->
    <main class="project-page">
        <div class="container">
            <a class="pp-back" href="../../index.html#projects"><i class="fas fa-arrow-left"></i> All projects</a>

            <div class="pp-hero">
                <div class="pp-hero-img" style="background-image:url('../../${esc(project.image)}')"></div>
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
                    ${work ? `<section class="pp-section">
                        <h2 class="pp-h">What I did</h2>
                        <ul class="pp-work">
                        ${work}
                        </ul>
                    </section>` : ''}
                </div>

                <aside class="pp-aside">
                    ${project.company ? `<div class="pp-aside-block"><span class="pp-h">Company</span><span class="pp-fact">${esc(project.company)}</span></div>` : ''}
                    ${project.role ? `<div class="pp-aside-block"><span class="pp-h">Role</span><span class="pp-fact">${esc(project.role)}</span></div>` : ''}
                    ${project.timeline ? `<div class="pp-aside-block"><span class="pp-h">Timeline</span><span class="pp-fact">${esc(project.timeline)}</span></div>` : ''}
                    <div class="pp-aside-block">
                        <span class="pp-h">Tech stack</span>
                        <div class="pp-tech">
                        ${tech}
                        </div>
                    </div>
                    ${links.length ? `<div class="pp-aside-block">
                        <span class="pp-h">Links</span>
                        <div class="pp-links">
                        ${linksHtml}
                        </div>
                    </div>` : ''}
                </aside>
            </div>
            ${navHtml}
        </div>
    </main>

    <!-- ====================== FOOTER ====================== -->
    <footer class="contact" id="contact">
        <div class="container">
            <div class="contact-inner">
                <p class="contact-eyebrow">Get in touch</p>
                <h2 class="contact-title">Let's work<br><em>together.</em></h2>
                <a href="mailto:manoj.inamanamelluri123@gmail.com" class="contact-email">
                    manoj.inamanamelluri123@gmail.com
                    <i class="fas fa-arrow-up-right-from-square"></i>
                </a>
                <div class="contact-socials">
                    <a href="https://www.linkedin.com/in/manoj-inamanamelluri-319852184/" target="_blank" class="social-btn" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
                    <a href="https://github.com/Manoj-880" target="_blank" class="social-btn" aria-label="GitHub"><i class="fab fa-github"></i></a>
                    <a href="https://www.behance.net/manojmanoj61" target="_blank" class="social-btn" aria-label="Behance"><i class="fab fa-behance"></i></a>
                    <a href="https://www.instagram.com/manoj_880/" target="_blank" class="social-btn" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                </div>
                <div class="contact-bottom">
                    <p class="contact-copy">© <span id="year">2026</span> Manoj Inamanamelluri. Designed &amp; Built with ♥</p>
                </div>
            </div>
        </div>
    </footer>

    <script src="../../motion.js"></script>
    <script src="../../project-static.js"></script>
</body>
</html>
`;
}

/* ---- write one file per project ---- */
const outPaths = [];
PROJECTS.forEach((project, i) => {
    const dir = path.join(ROOT, 'projects', project.slug);
    mkdirSync(dir, { recursive: true });
    const outFile = path.join(dir, 'index.html');
    writeFileSync(outFile, renderProject(project, i), 'utf8');
    outPaths.push(`projects/${project.slug}/`);
    console.log('wrote', path.relative(ROOT, outFile));
});

/* ---- regenerate sitemap.xml with clean URLs + lastmod ---- */
const sitemapUrls = [
    { loc: `${SITE_URL}/`, priority: '1.0' },
    ...outPaths.map(p => ({ loc: `${SITE_URL}/${p}`, priority: '0.7' }))
];
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `    <url>
        <loc>${u.loc}</loc>
        <lastmod>${TODAY}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>${u.priority}</priority>
    </url>`).join('\n')}
</urlset>
`;
writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemapXml, 'utf8');
console.log('wrote sitemap.xml');
