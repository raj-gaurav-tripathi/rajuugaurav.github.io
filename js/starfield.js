/* ==========================================================================
   HERO VISUALISATION — "resonance bands"
   ==========================================================================
   This draws the hero's animated backdrop: a stack of thin horizontal mode
   lines, most of them calm, with a couple of bands whose amplitude slowly
   breathes up and down. That's a deliberate (simplified, illustrative)
   nod to Floquet / tachyonic-resonance instability bands — a periodically
   driven system is stable at most momenta but a narrow band of modes grows,
   which is the mechanism behind the magnetogenesis research this site is
   about. It is NOT a literal data plot, just a visual echo of the shape of
   that physics, layered over a sparse, static field of stars.

   Performance / courtesy:
   - Colors are read from variables.css at runtime, so the animation
     restyles itself automatically if you change the palette there.
   - The animation pauses via requestAnimationFrame cancellation whenever
     the tab is hidden OR the hero has scrolled out of view, and renders a
     single static frame (no motion at all) if the visitor has requested
     reduced motion.
   ========================================================================== */

(function () {
  'use strict';

  function initStarfield() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const heroSection = document.getElementById('hero');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* --- palette, read once from CSS custom properties ------------------ */
    function cssVar(name, fallback) {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    }
    function hexToRgbParts(hex) {
      const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec((hex || '').trim());
      if (!m) return { r: 255, g: 255, b: 255 };
      return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
    }
    function rgba(parts, alpha) {
      return 'rgba(' + parts.r + ',' + parts.g + ',' + parts.b + ',' + alpha + ')';
    }

    const RGB_QUIET = hexToRgbParts(cssVar('--color-void-line', '#262d52'));
    const RGB_FLUX = hexToRgbParts(cssVar('--color-flux', '#e3a857'));
    const RGB_RESONANCE = hexToRgbParts(cssVar('--color-resonance', '#b85c4a'));
    const RGB_STAR = hexToRgbParts(cssVar('--color-mist', '#b9bfdd'));

    /* --- state ------------------------------------------------------------ */
    const TRACK_SPACING = 26;  // px between mode lines — smaller = denser
    const SAMPLE_STEP = 10;    // px between sampled points along each line

    let width = 0, height = 0, dpr = 1;
    let tracks = [];
    let stars = [];
    let animationId = null;
    let tabVisible = !document.hidden;
    let heroVisible = true;
    let startTime = performance.now();

    function isRunning() {
      return animationId !== null;
    }

    function shouldRun() {
      return !prefersReducedMotion && tabVisible && heroVisible;
    }

    function syncAnimationState() {
      if (shouldRun() && !isRunning()) {
        animationId = requestAnimationFrame(frame);
      } else if (!shouldRun() && isRunning()) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    }

    function resize() {
      const parent = canvas.parentElement;
      const rect = parent.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildScene();
      renderFrame(performance.now() - startTime);
    }

    function bandOverlaps(usedIndices, start, size) {
      for (let k = 0; k < size; k++) {
        if (usedIndices.has(start + k)) return true;
      }
      return false;
    }

    function buildScene() {
      const count = Math.max(10, Math.floor(height / TRACK_SPACING));
      tracks = [];
      for (let i = 0; i < count; i++) {
        tracks.push({
          y: (i + 0.5) * (height / count) + (Math.random() * 6 - 3),
          baseAmplitude: 2 + Math.random() * 2,
          freq: 0.006 + Math.random() * 0.004,
          phase: Math.random() * Math.PI * 2,
          speed: 0.15 + Math.random() * 0.15,
          resonant: false,
          rgb: RGB_QUIET,
          resonancePhase: Math.random() * Math.PI * 2
        });
      }

      // Pick 1-2 contiguous "instability bands" of neighbouring tracks that
      // will slowly grow and shrink in amplitude, standing in for the
      // resonant momentum band in a real Floquet chart.
      const bandCount = width < 640 ? 1 : 2;
      const usedIndices = new Set();
      for (let b = 0; b < bandCount; b++) {
        const bandSize = 2 + Math.floor(Math.random() * 3);
        let start = Math.floor(Math.random() * Math.max(1, count - bandSize));
        let attempts = 0;
        while (bandOverlaps(usedIndices, start, bandSize) && attempts < 12) {
          start = Math.floor(Math.random() * Math.max(1, count - bandSize));
          attempts++;
        }
        const rgb = b % 2 === 0 ? RGB_FLUX : RGB_RESONANCE;
        for (let k = 0; k < bandSize; k++) {
          const idx = start + k;
          if (tracks[idx]) {
            tracks[idx].resonant = true;
            tracks[idx].rgb = rgb;
            usedIndices.add(idx);
          }
        }
      }

      const starCount = Math.floor((width * height) / 9000);
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.1 + 0.3,
          alpha: Math.random() * 0.5 + 0.15
        });
      }
    }

    function drawStars() {
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = rgba(RGB_STAR, s.alpha);
        ctx.fill();
      }
    }

    function drawTracks(t) {
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        let amplitude = track.baseAmplitude;
        let alpha = 0.35;
        let lineWidth = 1;

        if (track.resonant) {
          // Slow 0..1 breathing envelope — the "growth" of a resonant band.
          const envelope = (Math.sin(t * 0.0006 + track.resonancePhase) + 1) / 2;
          amplitude = track.baseAmplitude + envelope * 16;
          alpha = 0.22 + envelope * 0.55;
          lineWidth = 1 + envelope * 1.3;
        }

        ctx.beginPath();
        for (let x = 0; x <= width; x += SAMPLE_STEP) {
          const y = track.y + Math.sin(x * track.freq + t * track.speed * 0.002 + track.phase) * amplitude;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.strokeStyle = rgba(track.rgb, alpha);
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }
    }

    function renderFrame(t) {
      ctx.clearRect(0, 0, width, height);
      drawStars();
      drawTracks(t);
    }

    function frame(now) {
      renderFrame(now - startTime);
      if (shouldRun()) {
        animationId = requestAnimationFrame(frame);
      } else {
        animationId = null;
      }
    }

    function debounce(fn, delay) {
      let timer;
      return function () {
        clearTimeout(timer);
        timer = setTimeout(fn, delay);
      };
    }

    document.addEventListener('visibilitychange', function () {
      tabVisible = !document.hidden;
      syncAnimationState();
    });

    if (heroSection && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          heroVisible = entry.isIntersecting;
          syncAnimationState();
        });
      }, { threshold: 0 });
      io.observe(heroSection);
    }

    window.addEventListener('resize', debounce(resize, 200));

    resize();

    if (shouldRun()) {
      animationId = requestAnimationFrame(frame);
    }
    // If reduced motion is requested, resize() has already painted one
    // static frame above and we simply never start the loop.
  }

  window.initStarfield = initStarfield;
})();
