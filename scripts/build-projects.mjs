#!/usr/bin/env node
/* ================================================================
   BUILD: static, individually-indexable project pages
   ----------------------------------------------------------------
   Reads projects-data.js (the single source of truth for project
   content) and writes one fully pre-rendered HTML file per project
   to projects/<slug>.html — each with its own <title>,
   meta description, canonical URL, Open Graph tags, and
   CreativeWork + BreadcrumbList JSON-LD.

   Run after editing projects-data.js:
       node scripts/build-projects.mjs

   Also regenerates sitemap.xml with clean URLs + <lastmod>.
================================================================ */
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, statSync } from 'node:fs';
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

/* One composition per project — same chrome, different case-study structure. */
const LAYOUT = {
    carzzi: 'stage',
    jsr: 'window',
    jagbandhu: 'editorial',
    uktbc: 'dossier',
    nehwe: 'studio',
    secureusdt: 'ledger',
    'sm-scholarly': 'suite',
    solve: 'solve'
};

function projectLinks(project) {
    if (project.links && project.links.length) return project.links;
    if (project.link) return [{ label: 'Live site', url: project.link, icon: 'fa-arrow-up-right-from-square' }];
    return [];
}

function linksMarkup(links) {
    return links.map(l => {
        const iconClass = l.brand ? `fab ${esc(l.icon)}` : `fas ${esc(l.icon || 'fa-link')}`;
        return `<a class="pp-link-btn" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer"><i class="${iconClass}"></i>${esc(l.label)}</a>`;
    }).join('\n');
}

function techMarkup(project) {
    return project.tech.map(t => `<span class="tech-pill">${esc(t)}</span>`).join('');
}

function numbered(items) {
    return (items || []).map((w, i) =>
        `<li><span>${String(i + 1).padStart(2, '0')}</span><p>${esc(w)}</p></li>`
    ).join('\n');
}

function plainWork(items) {
    return (items || []).map(w => `<li>${esc(w)}</li>`).join('\n');
}

function factRows(project) {
    return [
        ['Company', project.company],
        ['Role', project.role],
        ['Timeline', project.timeline]
    ].filter(([, value]) => value);
}

function renderBody(project) {
    const layout = LAYOUT[project.slug] || 'stage';
    const links = projectLinks(project);
    const buttons = linksMarkup(links);
    const tech = techMarkup(project);
    const steps = numbered(project.contributions);
    const work = plainWork(project.contributions);
    const facts = factRows(project);
    const img = `../${esc(project.image)}`;
    const imageLabel = esc(project.imageAlt || `${project.title} screenshot`);
    const eyebrow = `${esc(project.category)} · ${esc(project.year)}`;
    const lead = esc(project.overview || project.description);

    const rail = facts.map(([k, v]) =>
        `<li><span>${esc(k)}</span><strong>${esc(v)}</strong></li>`
    ).join('');

    if (layout === 'stage') {
        return `
            <div class="stage">
                <div class="stage-copy">
                    <span class="pp-eyebrow">${eyebrow}</span>
                    <h1 class="pp-title">${esc(project.title)}</h1>
                    <p class="pp-lead">${lead}</p>
                    ${buttons ? `<div class="pp-links">${buttons}</div>` : ''}
                </div>
                <div class="stage-frame">
                    <div class="stage-img" style="background-image:url('${img}')" role="img" aria-label="${imageLabel}"></div>
                </div>
            </div>
            <ul class="pp-rail">${rail}</ul>
            <section class="pp-section">
                <h2 class="pp-h">What I did</h2>
                <ol class="stage-steps">${steps}</ol>
            </section>
            <div class="pp-tech-row"><span class="pp-h">Tech stack</span><div class="pp-tech">${tech}</div></div>`;
    }

    if (layout === 'window') {
        const aside = facts.map(([k, v]) =>
            `<div class="pp-aside-block"><span class="pp-h">${esc(k)}</span><span class="pp-fact">${esc(v)}</span></div>`
        ).join('');
        return `
            <div class="win" aria-hidden="false">
                <div class="win-bar">
                    <span class="win-name">JSR.exe — Agricultural trading</span>
                    <span class="win-badge">Windows</span>
                </div>
                <div class="win-canvas" style="background-image:url('${img}')" role="img" aria-label="${imageLabel}"></div>
                <div class="win-status">
                    <span>Windows installer</span>
                    <span>Offline-first</span>
                    <span>No public website</span>
                </div>
            </div>
            <p class="win-note"><i class="fas fa-window-maximize" aria-hidden="true"></i><span>JSR is a Windows desktop app. It is distributed as an installer, not a website, so there is no live URL and the executable is not available for download here.</span></p>
            <div class="pp-body">
                <div class="pp-main">
                    <section class="pp-section">
                        <span class="pp-eyebrow">${eyebrow}</span>
                        <h1 class="pp-title">${esc(project.title)}</h1>
                        <p class="pp-lead">${lead}</p>
                    </section>
                    <section class="pp-section">
                        <h2 class="pp-h">What I did</h2>
                        <ul class="pp-work">${work}</ul>
                    </section>
                </div>
                <aside class="pp-aside">
                    ${aside}
                    <div class="pp-aside-block"><span class="pp-h">Tech stack</span><div class="pp-tech">${tech}</div></div>
                </aside>
            </div>`;
    }

    if (layout === 'editorial') {
        const timeline = steps;
        const side = facts.map(([k, v]) =>
            `<div class="ed-fact"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`
        ).join('');
        return `
            <header class="ed-head">
                <div>
                    <span class="pp-eyebrow">${eyebrow}</span>
                    <h1 class="ed-title">${esc(project.title)}</h1>
                </div>
                ${buttons ? `<div class="pp-links">${buttons}</div>` : ''}
            </header>
            <p class="ed-dek">${esc(project.description)}</p>
            <div class="ed-hero" style="background-image:url('${img}')" role="img" aria-label="${imageLabel}"></div>
            <div class="ed-grid">
                <div class="ed-story">
                    <section class="pp-section">
                        <h2 class="pp-h">Overview</h2>
                        <p class="pp-lead">${lead}</p>
                    </section>
                    <section class="pp-section">
                        <h2 class="pp-h">What I did</h2>
                        <ol class="ed-time">${timeline}</ol>
                    </section>
                </div>
                <aside class="ed-side">
                    ${side}
                    <div class="ed-fact"><span>Tech stack</span><div class="pp-tech">${tech}</div></div>
                </aside>
            </div>`;
    }

    if (layout === 'dossier') {
        const meta = facts.map(([k, v]) =>
            `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`
        ).join('');
        return `
            <div class="dos">
                <header class="dos-head">
                    <div>
                        <span class="pp-eyebrow">${eyebrow}</span>
                        <h1 class="pp-title">${esc(project.title)}</h1>
                    </div>
                    ${buttons ? `<div class="pp-links">${buttons}</div>` : ''}
                </header>
                <dl class="dos-meta">${meta}</dl>
                <figure class="dos-figure">
                    <div class="dos-img" style="background-image:url('${img}')" role="img" aria-label="${imageLabel}"></div>
                    <figcaption>${esc(project.description)}</figcaption>
                </figure>
                <div class="dos-prose">
                    <section class="pp-section">
                        <h2 class="pp-h">Overview</h2>
                        <p class="pp-lead">${lead}</p>
                    </section>
                    <section class="pp-section">
                        <h2 class="pp-h">What I did</h2>
                        <ol class="dos-list">${steps}</ol>
                    </section>
                    <div class="pp-tech-row"><span class="pp-h">Tech stack</span><div class="pp-tech">${tech}</div></div>
                </div>
            </div>`;
    }

    if (layout === 'studio') {
        const figma = buttons;
        return `
            <div class="stu-hero">
                <div class="stu-copy">
                    <span class="pp-eyebrow">${eyebrow}</span>
                    <h1 class="stu-title">${esc(project.title)}</h1>
                    <p class="stu-flag">Design study · no public website</p>
                    <p class="pp-lead">${lead}</p>
                    ${figma ? `<div class="pp-links">${figma}</div>` : ''}
                </div>
                <div class="stu-art" style="background-image:url('${img}')" role="img" aria-label="${imageLabel}"></div>
            </div>
            <ol class="stu-grid">${steps}</ol>
            <ul class="pp-rail">${rail}</ul>
            <div class="pp-tech-row"><span class="pp-h">Tech stack</span><div class="pp-tech">${tech}</div></div>`;
    }

    if (layout === 'ledger') {
        const live = links[0];
        const urlLabel = live ? esc(live.label) : '';
        const urlHref = live ? esc(live.url) : '';
        const stats = facts.map(([k, v]) =>
            `<div><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`
        ).join('');
        return `
            <div class="led">
                <div class="led-bar">
                    <h1 class="led-mark">${esc(project.title)}</h1>
                    ${live ? `<a class="led-url" href="${urlHref}" target="_blank" rel="noopener noreferrer">${urlLabel}</a>` : ''}
                    <span class="led-live"><i></i> Live</span>
                </div>
                <div class="led-shot" style="background-image:url('${img}')" role="img" aria-label="${imageLabel}"></div>
                <div class="led-stats">${stats}</div>
            </div>
            <div class="led-cols">
                <section class="pp-section">
                    <span class="pp-eyebrow">${eyebrow}</span>
                    <h2 class="pp-h">Overview</h2>
                    <p class="pp-lead">${lead}</p>
                    <div class="pp-tech">${tech}</div>
                </section>
                <section class="pp-section">
                    <h2 class="pp-h">What I did</h2>
                    <ol class="led-rows">${steps}</ol>
                </section>
            </div>`;
    }

    if (layout === 'solve') {
        const asset = name => `../assets/projects/solve/${name}`;
        const swatches = [
            ['Forest Green', '#263D32', 'Wordmark & type', 'light'],
            ['Sage', '#DCE3D3', 'Soft supporting tone', 'dark'],
            ['Warm Ivory', '#F5F0E6', 'Backgrounds & label', 'dark'],
            ['Muted Terracotta', '#B77B58', 'Restrained accent', 'light']
        ].map(([name, hex, role, tone]) => `
                    <li class="sv-swatch ${tone}" style="--sw:${hex}">
                        <span class="sv-swatch-name">${name}</span>
                        <span class="sv-swatch-hex">${hex}</span>
                        <span class="sv-swatch-role">${role}</span>
                    </li>`).join('');
        const facts = [
            ['Project type', 'Self-initiated concept'],
            ['Industry', 'Skincare & Beauty'],
            ['Tools', 'Affinity'],
            ['Role', project.role]
        ].map(([k, v]) => `<li><span>${k}</span><strong>${esc(v)}</strong></li>`).join('');
        const process = (project.contributions || []).map((w, i) => {
            const [head, ...rest] = w.split(': ');
            return `<li><span>${String(i + 1).padStart(2, '0')}</span><h3>${esc(head)}</h3><p>${esc(rest.join(': '))}</p></li>`;
        }).join('\n');
        return `
            <header class="sv-head">
                <div class="sv-head-copy">
                    <span class="pp-eyebrow">${eyebrow}</span>
                    <h1 class="sv-title">Brand Identity <em>&amp;</em> Packaging</h1>
                    <p class="sv-sub">A Botanical Skincare Concept</p>
                    <p class="sv-flag"><i class="fas fa-seedling" aria-hidden="true"></i> Self-initiated concept · SOLVÉ is a fictional brand, not a client project</p>
                </div>
                <img class="sv-head-logo" src="${asset('solve-logo.webp')}" width="1280" height="1280" alt="SOLVÉ logo — serif wordmark in forest green with a botanical leaf line" fetchpriority="high">
            </header>

            <figure class="sv-hero">
                <picture>
                    <source media="(max-width: 640px)" srcset="${asset('solve-bottle.webp')}" width="1200" height="1500">
                    <img src="${asset('solve-mockup.webp')}" width="2000" height="1125" alt="${imageLabel}" fetchpriority="high">
                </picture>
            </figure>
            <ul class="pp-rail sv-rail">${facts}</ul>

            <section class="sv-section sv-overview" aria-labelledby="sv-overview-h">
                <h2 class="pp-h" id="sv-overview-h">Overview</h2>
                <p class="sv-lead">${lead}</p>
                <p class="sv-note">The brief was my own: imagine a premium skincare brand inspired by botanical simplicity and modern minimalism, then design the logo and one hero product around it.</p>
            </section>

            <section class="sv-section sv-identity" aria-labelledby="sv-identity-h">
                <h2 class="pp-h" id="sv-identity-h">Brand identity</h2>
                <div class="sv-split">
                    <img class="sv-logo-tile" src="${asset('solve-logo.webp')}" width="1280" height="1280" loading="lazy" alt="The SOLVÉ logo on a warm ivory background">
                    <div class="sv-copy">
                        <h3>A wordmark with one living line</h3>
                        <p>The logo is set in a refined serif in capitals, with generous spacing and high stroke contrast for a calm, premium voice. A single fine botanical line rises from the O and opens into a leaf over the V, so the nature reference lives inside the lettering instead of sitting beside it.</p>
                        <dl class="sv-points">
                            <div><dt>Typography</dt><dd>Elegant serif capitals; open, unhurried spacing.</dd></div>
                            <div><dt>Botanical detail</dt><dd>One continuous leaf stroke, with the accent echoing the same organic gesture.</dd></div>
                            <div><dt>Personality</dt><dd>Calm, refined, natural, and quietly minimal.</dd></div>
                        </dl>
                    </div>
                </div>
            </section>

            <section class="sv-section sv-palette" aria-labelledby="sv-palette-h">
                <h2 class="pp-h" id="sv-palette-h">Color palette</h2>
                <ul class="sv-swatches">${swatches}
                </ul>
                <p class="sv-note">Proposed brand specification. These values are not sampled from the logo artwork.</p>
            </section>

            <section class="sv-section sv-pack" aria-labelledby="sv-pack-h">
                <h2 class="pp-h" id="sv-pack-h">Packaging design</h2>
                <div class="sv-pack-grid">
                    <div class="sv-pack-stage">
                        <img src="${asset('solve-bottle.webp')}" width="1200" height="1500" loading="lazy" alt="SOLVÉ Daily Refresh Balancing Serum in an amber glass dropper bottle">
                    </div>
                    <div class="sv-pack-side">
                        <div class="sv-copy">
                            <h3>Daily Refresh Balancing Serum</h3>
                            <ul class="sv-spec">
                                <li>Amber glass dropper bottle</li>
                                <li>White / warm ivory label</li>
                                <li>Forest-green SOLVÉ wordmark</li>
                            </ul>
                        </div>
                        <img class="sv-label" src="${asset('solve-label.webp')}" width="1000" height="1000" loading="lazy" alt="Close-up of the SOLVÉ serum label: wordmark, product name, and descriptor">
                        <dl class="sv-points">
                            <div><dt>Hierarchy</dt><dd>The wordmark leads, the product name follows in smaller wide-spaced capitals, and a light descriptor closes the stack.</dd></div>
                            <div><dt>Contrast</dt><dd>Deep green on a clean label reads clearly, and the warm amber glass frames it.</dd></div>
                            <div><dt>Typography</dt><dd>A serif wordmark paired with a spaced sans for the product name, so the brand and the product read as two voices.</dd></div>
                            <div><dt>Presentation</dt><dd>Generous empty label space keeps the pack minimal and premium.</dd></div>
                        </dl>
                    </div>
                </div>
            </section>

            <section class="sv-section sv-process" aria-labelledby="sv-process-h">
                <h2 class="pp-h" id="sv-process-h">Design process</h2>
                <ol class="sv-steps">${process}</ol>
            </section>

            <section class="sv-final" aria-label="Final showcase">
                <div class="sv-final-art">
                    <img class="sv-final-logo" src="${asset('solve-logo.webp')}" width="1280" height="1280" loading="lazy" alt="SOLVÉ logo">
                    <img class="sv-final-bottle" src="${asset('solve-bottle.webp')}" width="1200" height="1500" loading="lazy" alt="SOLVÉ Daily Refresh Balancing Serum bottle">
                </div>
                <p class="sv-final-cap">SOLVÉ — a concept brand, designed in Affinity.</p>
                <div class="pp-links"><a class="pp-link-btn" href="../index.html#projects"><i class="fas fa-arrow-left" aria-hidden="true"></i>Back to projects</a></div>
            </section>
            <div class="pp-tech-row"><span class="pp-h">Tags</span><div class="pp-tech">${tech}</div></div>`;
    }

    /* suite — S&M Scholarly */
    const spec = facts.map(([k, v]) =>
        `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`
    ).join('');
    const live = links[0];
    return `
        <div class="suite">
            <div class="suite-poster" style="background-image:url('${img}')" role="img" aria-label="${imageLabel}"></div>
            <div class="suite-copy">
                <span class="pp-eyebrow">${eyebrow}</span>
                <h1 class="pp-title">${esc(project.title)}</h1>
                ${live ? `<a class="suite-url" href="${esc(live.url)}" target="_blank" rel="noopener noreferrer">${esc(live.label)} <i class="fas fa-arrow-up-right-from-square"></i></a>` : ''}
                <p class="pp-lead">${lead}</p>
                <dl class="suite-facts">${spec}</dl>
                <section class="pp-section">
                    <h2 class="pp-h">What I did</h2>
                    <ul class="suite-rows">${work}</ul>
                </section>
                <div class="pp-tech">${tech}</div>
            </div>
        </div>`;
}

function renderProject(project, index) {
    const url = `${SITE_URL}/projects/${project.slug}.html`;
    const seoDesc = truncate(
        `${project.title} by Manoj Inamanamelluri — full-stack developer & UI/UX designer in Hyderabad. ${project.overview || project.description}`,
        155
    );
    const seoTitle = truncate(`${project.title} — Case Study | Manoj Inamanamelluri`, 60);
    const imageUrl = `${SITE_URL}/${project.image}`;

    const layout = LAYOUT[project.slug] || 'stage';
    const prev = PROJECTS[index - 1];
    const next = PROJECTS[index + 1];
    const navHtml = (prev || next) ? `
        <div class="pp-nextprev">
            ${prev ? `<a class="prev" href="${prev.slug}.html"><span>← Previous</span>${esc(prev.title)}</a>` : ''}
            ${next ? `<a class="next" href="${next.slug}.html"><span>Next →</span>${esc(next.title)}</a>` : ''}
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
    if (project.link) jsonLdCreativeWork.sameAs = project.link;

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
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-JXWGFTYDS7"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-JXWGFTYDS7');
    </script>
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

    <link rel="shortcut icon" href="../assets/logo.svg" type="image/x-icon">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    </noscript>
    <link rel="stylesheet" href="../style.css">

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
            <a href="../index.html" class="nav-logo" aria-label="Home">
                <img src="../assets/logo.svg" alt="Manoj Inamanamelluri — Full-Stack Developer & UI/UX Designer in Hyderabad">
            </a>
            <ul class="nav-links" role="list">
                <li><a href="../index.html#home" class="nav-link">Home</a></li>
                <li><a href="../index.html#services" class="nav-link">Services</a></li>
                <li><a href="../index.html#projects" class="nav-link">Projects</a></li>
                <li><a href="../index.html#experience" class="nav-link">Experience</a></li>
                <li><a href="../index.html#contact" class="nav-link">Contact</a></li>
            </ul>
            <a class="nav-cta" href="../index.html#contact">Hire Me</a>
            <button class="nav-hamburger" id="nav-hamburger" aria-label="Toggle menu" aria-expanded="false">
                <span></span><span></span><span></span>
            </button>
        </nav>
    </header>

    <div class="mobile-menu" id="mobile-menu" aria-hidden="true">
        <div class="mobile-menu-inner">
            <nav class="mobile-nav" aria-label="Mobile navigation">
                <a href="../index.html#home" class="mobile-nav-link"><span>01</span>Home</a>
                <a href="../index.html#services" class="mobile-nav-link"><span>02</span>Services</a>
                <a href="../index.html#projects" class="mobile-nav-link"><span>03</span>Projects</a>
                <a href="../index.html#experience" class="mobile-nav-link"><span>04</span>Experience</a>
                <a href="../index.html#contact" class="mobile-nav-link"><span>05</span>Contact</a>
            </nav>
            <div class="mobile-menu-footer">
                <p class="mobile-email">manoj.inamanamelluri123@gmail.com</p>
            </div>
        </div>
    </div>

    <!-- ====================== PROJECT (statically pre-rendered for SEO) ====================== -->
    <main class="project-page pp-${layout}">
        <div class="container">
            <a class="pp-back" href="../index.html#projects"><i class="fas fa-arrow-left"></i> All projects</a>
            ${renderBody(project)}
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

    <script src="../motion.js"></script>
    <script src="../project-static.js"></script>
</body>
</html>
`;
}

/* ---- write one HTML file per project (no directory URL) ---- */
const projectsDir = path.join(ROOT, 'projects');
mkdirSync(projectsDir, { recursive: true });
const outPaths = [];
PROJECTS.forEach((project, i) => {
    const oldDir = path.join(projectsDir, project.slug);
    if (existsSync(oldDir) && statSync(oldDir).isDirectory()) {
        rmSync(oldDir, { recursive: true });
    }
    const outFile = path.join(projectsDir, `${project.slug}.html`);
    writeFileSync(outFile, renderProject(project, i), 'utf8');
    outPaths.push(`projects/${project.slug}.html`);
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
