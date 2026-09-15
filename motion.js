/* ================================================================
   MOTION — site-wide "trendy" transition layer.
   Same color palette as the rest of the site; this file adds a
   curtain-style page transition between pages, kinetic text reveal
   on section titles, and a subtle cursor-tilt on project card images.

   (An earlier version also added Lenis inertial smooth-scroll, but it
   fought with the page's existing native scrollTo/scrollIntoView calls
   and caused uncontrollable auto-scrolling — removed. Native scrolling
   is fast and predictable; not worth the fragility.)

   Include with the static .page-wipe markup, BEFORE </body>, on every
   page that wants these effects.
================================================================ */
(function () {
    'use strict';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ====================== PAGE TRANSITION WIPE ====================== */
    const wipe = document.querySelector('.page-wipe');
    if (wipe && !reducedMotion) {
        // Reveal the page once it's actually ready (mirrors the old
        // spinner-loader's timing) rather than the moment the DOM parses,
        // so slow asset loads stay hidden behind the curtain.
        function reveal() {
            wipe.classList.add('wipe-anim');
            requestAnimationFrame(() => wipe.classList.add('revealed'));
        }
        if (document.readyState === 'complete') {
            setTimeout(reveal, 300);
        } else {
            window.addEventListener('load', () => setTimeout(reveal, 300));
        }

        // Intercept same-site navigations so leaving a page covers the
        // screen first, then the destination page repeats the reveal —
        // one continuous-feeling wipe across the "page load" boundary.
        const isInternalLink = a => {
            if (!a || !a.href) return false;
            if (a.target && a.target !== '' && a.target !== '_self') return false;
            if (a.hasAttribute('download')) return false;
            let url;
            try { url = new URL(a.href, location.href); } catch (e) { return false; }
            if (url.origin !== location.origin) return false;
            if (url.pathname === location.pathname && url.hash) return false; // in-page anchors
            return true;
        };

        document.addEventListener('click', e => {
            const a = e.target.closest && e.target.closest('a');
            if (!a || !isInternalLink(a)) return;
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // let new-tab opens through
            e.preventDefault();
            const dest = a.href;
            wipe.classList.remove('revealed');
            wipe.classList.add('hidden-below');
            requestAnimationFrame(() => {
                wipe.classList.remove('hidden-below');
                requestAnimationFrame(() => wipe.classList.add('covered'));
            });
            setTimeout(() => { window.location.href = dest; }, 520);
        });
    }

    /* ====================== KINETIC TEXT REVEAL ====================== */
    function maskReveal(selector) {
        const els = document.querySelectorAll(selector);
        if (!els.length) return;
        els.forEach(el => {
            if (el.dataset.masked) return;
            el.dataset.masked = 'true';
            const text = el.textContent;
            el.textContent = '';
            el.classList.add('mask-line');
            const inner = document.createElement('span');
            inner.className = 'mask-line-inner';
            inner.textContent = text;
            el.appendChild(inner);
        });
        if (reducedMotion) {
            els.forEach(el => el.classList.add('in-view'));
            return;
        }
        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        els.forEach(el => obs.observe(el));
    }
    maskReveal('.section-title');

    /* ====================== PROJECT CARD IMAGE TILT ====================== */
    if (!reducedMotion && !('ontouchstart' in window)) {
        document.addEventListener('mousemove', e => {
            const media = e.target.closest && e.target.closest('.pc-media');
            if (!media) return;
            const img = media.querySelector('.pc-img');
            if (!img) return;
            const r = media.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            img.style.transform = `scale(1.08) translate(${px * -14}px, ${py * -10}px)`;
        }, { passive: true });

        document.addEventListener('mouseout', e => {
            const media = e.target.closest && e.target.closest('.pc-media');
            if (!media) return;
            if (media.contains(e.relatedTarget)) return;
            const img = media.querySelector('.pc-img');
            if (img) img.style.transform = '';
        }, { passive: true });
    }
})();
