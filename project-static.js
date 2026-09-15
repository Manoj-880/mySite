/* ================================================================
   PROJECT PAGE (static, pre-rendered) — interactivity only.
   Content is baked into the HTML at build time by
   scripts/build-projects.mjs, so this file just wires up the same
   chrome as the rest of the site: cursor, nav, back-to-top.
   (Page load/reveal + link transitions are handled by motion.js.)
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
        document.querySelectorAll('a, button, .social-btn, .back-to-top, .tech-pill').forEach(el => {
            el.addEventListener('mouseenter', () => { cursor.classList.add('hovered'); follower.classList.add('hovered'); });
            el.addEventListener('mouseleave', () => { cursor.classList.remove('hovered'); follower.classList.remove('hovered'); });
        });
        document.addEventListener('mouseleave', () => { cursor.classList.add('hidden'); follower.classList.add('hidden'); });
        document.addEventListener('mouseenter', () => { cursor.classList.remove('hidden'); follower.classList.remove('hidden'); });
    }

    /* ---- year ---- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

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
});
