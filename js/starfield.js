/* ==========================================================================
   HERO VISUALISATION — imported academic cosmos treatment
   ==========================================================================
   The former resonance-band visualisation is replaced by the academic
   portfolio's lighter particle field: drifting stars, three quiet orbital
   paths and the CSS glow forms in hero.css. It keeps the same public
   initStarfield() entry point used by main.js, so no other site behaviour
   changes. The loop pauses when it cannot be seen and honours reduced-motion.
   ========================================================================== */

(function () {
  'use strict';

  function initStarfield() {
    const canvas = document.getElementById('hero-canvas');
    const hero = document.getElementById('hero');
    if (!canvas || !hero) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const particleCount = window.innerWidth < 650 ? 52 : 92;
    let particles = [];
    let width = 0;
    let height = 0;
    let animationFrame = null;
    let tabVisible = !document.hidden;
    let heroVisible = true;

    function makeParticle() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.3 + 0.18,
        speed: Math.random() * 0.11 + 0.025,
        alpha: Math.random() * 0.55 + 0.2,
        drift: (Math.random() - 0.5) * 0.09,
        phase: Math.random() * Math.PI * 2
      };
    }

    function resize() {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = hero.clientWidth;
      height = hero.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * pixelRatio));
      canvas.height = Math.max(1, Math.floor(height * pixelRatio));
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      particles = Array.from({ length: particleCount }, makeParticle);
      draw(performance.now());
    }

    function draw(time) {
      context.clearRect(0, 0, width, height);
      const elapsed = time * 0.001;

      // The restrained orbital paths are directly carried over from the
      // academic landing page and give the hero its recognisable structure.
      context.save();
      context.translate(width * 0.76, height * 0.42);
      context.rotate(-0.3);
      context.strokeStyle = 'rgba(157, 200, 241, 0.10)';
      context.lineWidth = 1;
      [150, 235, 330].forEach(function (radius, index) {
        context.beginPath();
        context.ellipse(0, 0, radius, radius * (0.26 + index * 0.02), 0, 0, Math.PI * 2);
        context.stroke();
      });
      context.restore();

      particles.forEach(function (particle) {
        particle.y -= particle.speed;
        particle.x += particle.drift;
        if (particle.y < -3) {
          particle.y = height + 3;
          particle.x = Math.random() * width;
        }
        if (particle.x < -3) particle.x = width + 3;
        if (particle.x > width + 3) particle.x = -3;

        const shimmer = Math.sin(elapsed * 1.8 + particle.phase) * 0.14;
        context.beginPath();
        context.fillStyle = 'rgba(215, 235, 255, ' + Math.max(0.12, particle.alpha + shimmer) + ')';
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      });
    }

    function shouldAnimate() {
      return !prefersReducedMotion && tabVisible && heroVisible;
    }

    function animate(time) {
      draw(time);
      animationFrame = shouldAnimate() ? requestAnimationFrame(animate) : null;
    }

    function syncAnimation() {
      if (shouldAnimate() && animationFrame === null) {
        animationFrame = requestAnimationFrame(animate);
      } else if (!shouldAnimate() && animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    }

    function debounce(callback, delay) {
      let timer;
      return function () {
        window.clearTimeout(timer);
        timer = window.setTimeout(callback, delay);
      };
    }

    document.addEventListener('visibilitychange', function () {
      tabVisible = !document.hidden;
      syncAnimation();
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          heroVisible = entry.isIntersecting;
          syncAnimation();
        });
      }, { threshold: 0 });
      observer.observe(hero);
    }

    window.addEventListener('resize', debounce(resize, 200));
    resize();
    syncAnimation();
  }

  window.initStarfield = initStarfield;
})();
