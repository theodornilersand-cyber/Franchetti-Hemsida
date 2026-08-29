/*
 * index.html only — hero SplitText intro + pattern-piece motif draw-on,
 * and the pinned process narrative (desktop) / stacked fallback (mobile).
 * Loaded after site.js, which already owns Lenis, the reduced-motion
 * gates, and the generic [data-reveal] system used everywhere else.
 */
(function () {
  'use strict';

  if (typeof gsap === 'undefined') return;

  var hasPlayedHeroIntro = false;

  function heroIntro() {
    var h1 = document.querySelector('.hero h1');
    var motifIds = ['#motif-bodice', '#motif-grainline', '#motif-sleeve', '#motif-collar'];
    var motifPaths = motifIds
      .map(function (sel) { return document.querySelector(sel); })
      .filter(Boolean);

    motifPaths.forEach(function (path) {
      var len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    });

    function playMotif() {
      gsap.to(motifPaths, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' });
    }

    if (!h1) {
      playMotif();
      return;
    }

    SplitText.create(h1, {
      type: 'words',
      autoSplit: true,
      onSplit: function (self) {
        // Re-splits happen on font swap/resize (autoSplit) — only animate
        // the real first play; later resplits just snap to the end state
        // so resizing the window doesn't replay the intro.
        if (hasPlayedHeroIntro) {
          gsap.set(self.words, { opacity: 1, y: 0 });
          gsap.set(motifPaths, { strokeDashoffset: 0 });
          return;
        }
        hasPlayedHeroIntro = true;
        playMotif();
        return gsap.from(self.words, {
          opacity: 0,
          y: 20,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.04,
        });
      },
    });
  }

  function processPinned() {
    var section = document.querySelector('.process');
    if (!section) return;
    var pin = section.querySelector('.process-pin');
    var steps = gsap.utils.toArray('.process-step', section);
    var fill = section.querySelector('.process-progress-fill');
    var current = section.querySelector('.process-progress-current');
    if (!steps.length) return;

    section.setAttribute('data-pinned', '');
    steps[0].classList.add('is-active');

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=' + steps.length * 100 + '%',
      pin: pin,
      scrub: 1,
      onUpdate: function (self) {
        var idx = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
        steps.forEach(function (step, i) {
          step.classList.toggle('is-active', i === idx);
        });
        if (fill) fill.style.width = self.progress * 100 + '%';
        if (current) current.textContent = String(idx + 1).padStart(2, '0');
      },
    });
  }

  function processMobile() {
    var section = document.querySelector('.process');
    if (!section) return;
    var steps = gsap.utils.toArray('.process-step', section);
    steps.forEach(function (step) {
      gsap.from(step, {
        opacity: 0,
        y: 12,
        duration: 0.5,
        ease: 'power3.out',
        scrollTrigger: { trigger: step, start: 'top 85%', once: true },
      });
    });
  }

  // Hero intro runs at any viewport width, as long as motion is allowed.
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', heroIntro);

  // Process narrative: pinned/scrubbed on desktop, plain stacked fade on
  // mobile — never both, matchMedia only ever runs the branch that matches.
  gsap.matchMedia().add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', processPinned);
  gsap.matchMedia().add('(max-width: 899px) and (prefers-reduced-motion: no-preference)', processMobile);
})();
