/*
 * Shared motion layer — loaded on all 10 pages.
 * Lenis smooth scroll + the sitewide reveal system (data-reveal /
 * data-reveal-group) + the page-header heading word-stagger used on the
 * 9 secondary pages. index.html's hero/process choreography lives in
 * home.js, loaded after this file on that page only.
 *
 * Content is visible by default in CSS — this file only ever animates
 * FROM the hidden state CSS already defined for html.js:not(.reduced-motion)
 * [data-reveal]. If this script fails to load for any reason, everything
 * just stays at its default, fully visible, un-animated state.
 */
(function () {
  'use strict';

  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger, SplitText);

  var reducedMotion = document.documentElement.classList.contains('reduced-motion');

  // Smooth scroll — never instantiated under reduced motion (not just
  // internally disabled; the plan calls for not creating it at all).
  var lenis = null;
  if (!reducedMotion && typeof Lenis !== 'undefined') {
    lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }
  window.__lenis = lenis;

  // Third gate: gsap.matchMedia keeps every animation below reactive to
  // prefers-reduced-motion, on top of the CSS gate and the Lenis check above.
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', function () {
    var EASE = 'power3.out'; // closest GSAP named ease to --ease-out's cubic-bezier(0.23,1,0.32,1)

    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: EASE,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    });

    document.querySelectorAll('[data-reveal-group]').forEach(function (group) {
      gsap.to(group.children, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: EASE,
        stagger: 0.06,
        scrollTrigger: { trigger: group, start: 'top 85%', once: true },
      });
    });

    // Secondary-page headings only — index.html has no .page-header, it has
    // its own hero treatment in home.js.
    var pageHeaderH1 = document.querySelector('.page-header h1');
    if (pageHeaderH1) {
      SplitText.create(pageHeaderH1, {
        type: 'words',
        autoSplit: true,
        onSplit: function (self) {
          return gsap.from(self.words, {
            opacity: 0,
            y: 16,
            duration: 0.6,
            ease: EASE,
            stagger: 0.03,
            scrollTrigger: { trigger: pageHeaderH1, start: 'top 90%', once: true },
          });
        },
      });
    }
  });

  // Pin/scroll math computed before the Public Sans swap (display=swap on
  // every page) will be wrong after it reflows — refresh once fonts settle.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      ScrollTrigger.refresh();
    });
  }

  // bfcache restores can leave stale pin/scroll state on this multi-page
  // (non-SPA) site.
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) ScrollTrigger.refresh();
  });
})();
