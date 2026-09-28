/*
 * index.html only — laddas efter site.js, som redan äger Lenis,
 * reduced-motion-spärrarna och det generella [data-reveal]-systemet.
 *
 * 1. Hero: rubrikens två rader glider upp bakom en mask.
 * 2. Affärsområden: pilknappar + räknare för den horisontella karusellen
 *    (fungerar även utan GSAP och under reduced motion).
 * 3. Footer: bokstäverna i jätteordmärket reser sig när man scrollar dit.
 */
(function () {
  'use strict';

  // ---------- 2. Karusell (ingen GSAP krävs) ----------
  function initAreas() {
    var track = document.querySelector('.area-track');
    if (!track) return;
    var items = Array.prototype.slice.call(track.children);
    var prev = document.querySelector('.areas-prev');
    var next = document.querySelector('.areas-next');
    var current = document.querySelector('.areas-current');
    var reduced = document.documentElement.classList.contains('reduced-motion');

    function step() {
      if (items.length < 2) return track.clientWidth;
      return items[1].offsetLeft - items[0].offsetLeft;
    }

    function index() {
      return Math.round(track.scrollLeft / step());
    }

    function update() {
      var i = Math.min(items.length - 1, Math.max(0, index()));
      var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
      if (atEnd) i = items.length - 1;
      if (current) current.textContent = String(i + 1).padStart(2, '0');
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = atEnd;
    }

    function go(dir) {
      track.scrollBy({ left: dir * step(), behavior: reduced ? 'auto' : 'smooth' });
    }

    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  initAreas();

  // Jätteordmärket i sidfoten ska fylla exakt hela bredden, oavsett typsnitt.
  function fitFooterMark() {
    var mark = document.querySelector('.footer-mark');
    if (!mark) return;
    var box = mark.parentNode;
    var avail = box.clientWidth - parseFloat(getComputedStyle(box).paddingLeft) - parseFloat(getComputedStyle(box).paddingRight);
    mark.style.fontSize = '100px';
    mark.style.display = 'inline-block';
    var w = mark.scrollWidth;
    mark.style.display = '';
    if (w > 0) mark.style.fontSize = (100 * avail / w) + 'px';
  }
  fitFooterMark();
  window.addEventListener('resize', fitFooterMark);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitFooterMark);

  if (typeof gsap === 'undefined') return;

  // ---------- 1. Hero ----------
  function heroIntro() {
    var lines = gsap.utils.toArray('.hero h1 .line');
    var label = document.querySelector('.hero .label');
    var facts = gsap.utils.toArray('.hero-facts li');
    if (!lines.length) return;

    // Varje rad får en egen mask så att texten glider upp "ur golvet".
    lines.forEach(function (line) {
      var mask = document.createElement('span');
      mask.style.display = 'block';
      mask.style.overflow = 'hidden';
      mask.style.paddingBottom = '0.08em';
      mask.style.marginBottom = '-0.08em';
      line.parentNode.insertBefore(mask, line);
      mask.appendChild(line);
    });

    var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from(lines, { yPercent: 110, duration: 1.1, stagger: 0.12 })
      .from(label, { opacity: 0, y: 8, duration: 0.6 }, 0.2)
      .from(facts, { opacity: 0, y: 8, duration: 0.6, stagger: 0.08 }, 0.5);
  }

  // ---------- 3. Footer-ordmärke ----------
  function footerMark() {
    var mark = document.querySelector('.footer-mark');
    if (!mark) return;
    var text = mark.textContent;
    mark.textContent = '';
    mark.style.overflow = 'hidden';
    text.split('').forEach(function (ch) {
      var span = document.createElement('span');
      span.className = 'char';
      span.textContent = ch;
      mark.appendChild(span);
    });
    gsap.from(mark.querySelectorAll('.char'), {
      yPercent: 100,
      duration: 1,
      ease: 'power4.out',
      stagger: 0.04,
      scrollTrigger: { trigger: mark, start: 'top 95%', once: true },
    });
  }

  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', function () {
    heroIntro();
    footerMark();
  });
})();
