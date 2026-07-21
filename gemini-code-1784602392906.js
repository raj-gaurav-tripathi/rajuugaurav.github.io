/**
 * main.js
 * Core interactive logic for the Academic Portfolio
 * Features: Mobile Navigation State & Cosmic Web Canvas Simulation
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. MOBILE NAVIGATION LOGIC
    // ==========================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if (hamburger && navLinks) {
        // Toggle menu open/close
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Automatically close the mobile menu when a link is clicked
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // ==========================================
    // 2. COSMIC WEB CANVAS SIMULATION
    // ==========================================
    const canvas = document.getElementById('cosmic-canvas');
    if (!canvas) return; // Guard clause in case canvas fails to load

    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    
    // Dynamically adjust canvas to fit the hero section perfectly
    function setCanvasDimensions() {
        canvas.width = window.innerWidth;
        canvas.height = document.querySelector('.hero').offsetHeight;
    }
    
    setCanvasDimensions();

    // Re-calculate grid on screen resize
    window.addEventListener('resize', () => {
        setCanvasDimensions();
        initSimulation();
    });

    /**
     * Particle Class representing "galaxies" or "nodes"
     */
    class Particle {
        constructor(x, y, dx, dy, size, color) {
            this.x = x;
            this.y = y;
            this.dx = dx; // velocity vector x
            this.dy = dy; // velocity vector y
            this.size = size;
            this.color = color;
        }

        // Render the node
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        // Calculate theoretical trajectory and boundaries
        update() {
            // Boundary collision detection
            if (this.x > canvas.width || this.x < 0) this.dx = -this.dx;
            if (this.y > canvas.height || this.y < 0) this.dy = -this.dy;

            // Update positional coordinates
            this.x += this.dx;
            this.y += this.dy;

            this.draw();
        }
    }

    /**
     * Initialize the simulation grid
     */
    function initSimulation() {
        particlesArray = [];
        
        // Calculate dynamic particle density based on viewport volume
        // This prevents the simulation from crashing mobile browsers
        let numberOfParticles = (canvas.height * canvas.width) / 12000;
        
        // Hard cap particles for massive 4k desktop monitors
        if (numberOfParticles > 150) numberOfParticles = 150;

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 1.5) + 0.5; // Node size
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            
            // Ultra-slow, drifting velocities suitable for a cosmic simulation
            let dx = (Math.random() * 0.3) - 0.15;
            let dy = (Math.random() * 0.3) - 0.15;
            
            // Faint stellar white color
            let color = 'rgba(255, 255, 255, 0.6)';

            particlesArray.push(new Particle(x, y, dx, dy, size, color));
        }
    }

    /**
     * Connect particles to simulate dark matter filaments
     */
    function connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                
                // Calculate distance squared between nodes
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                             + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                
                // If particles are close enough, draw the connecting filament
                if (distance < (canvas.width / 10) * (canvas.height / 10)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue * 0.2})`; // Subtle edge rendering
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // ==========================================
    // 3. RENDER LOOP & PERFORMANCE OPTIMIZATION
    // ==========================================
    let animationFrameId;
    
    function animate() {
        animationFrameId = requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectParticles();
    }

    // Professional touch: Only run the heavy math animation when the hero is actually visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animationFrameId) animate(); // Start simulation
            } else {
                cancelAnimationFrame(animationFrameId); // Pause simulation to save CPU
                animationFrameId = null;
            }
        });
    }, { threshold: 0 });

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        observer.observe(heroSection);
    }

    // Boot the simulation
    initSimulation();
});