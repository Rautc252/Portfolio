/* ============================================
   CHETAN RAUT PORTFOLIO — SCRIPT.JS
============================================ */

/* ─── CUSTOM CURSOR ─────────────────────── */
const dot     = document.querySelector('.cursor-dot');
const outline = document.querySelector('.cursor-outline');

let mouseX = 0, mouseY = 0;
let outX = 0, outY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

(function animateCursor() {
  outX += (mouseX - outX) * 0.12;
  outY += (mouseY - outY) * 0.12;
  outline.style.left = outX + 'px';
  outline.style.top  = outY + 'px';
  requestAnimationFrame(animateCursor);
})();

// Scale cursor on interactive elements
document.querySelectorAll('a, button, .skill-card, .project-card, .card-inner').forEach(el => {
  el.addEventListener('mouseenter', () => {
    outline.style.width  = '56px';
    outline.style.height = '56px';
    outline.style.borderColor = 'var(--accent-2)';
  });
  el.addEventListener('mouseleave', () => {
    outline.style.width  = '36px';
    outline.style.height = '36px';
    outline.style.borderColor = 'var(--accent)';
  });
});


/* ─── CANVAS PARTICLE BACKGROUND ────────── */
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');

let W, H, particles;
const PARTICLE_COUNT = 70;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

class Particle {
  constructor() { this.reset(true); }

  reset(initial) {
    this.x  = Math.random() * W;
    this.y  = initial ? Math.random() * H : H + 10;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = -(Math.random() * 0.3 + 0.1);
    this.r  = Math.random() * 1.8 + 0.4;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '0,255,163' : '0,200,255';
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.y < -10) this.reset(false);
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
}

// Draw faint connecting lines
function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,255,163,${0.06 * (1 - dist / 130)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => { resize(); initParticles(); });
resize();
initParticles();
animate();


/* ─── NAVBAR SCROLL STYLE ───────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});


/* ─── SCROLL REVEAL ─────────────────────── */
const scrollEls = document.querySelectorAll('.scroll-reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      // For skill bars — also trigger them
      if (entry.target.classList.contains('skill-card')) {
        entry.target.classList.add('in-view');
      }
    }
  });
}, { threshold: 0.15 });

scrollEls.forEach(el => revealObserver.observe(el));


/* ─── SMOOTH ACTIVE NAV LINK ────────────── */
const sections  = document.querySelectorAll('section[id], header[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));


/* ─── MOBILE NAV TOGGLE ─────────────────── */
const toggle = document.getElementById('navToggle');
const navLinksContainer = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  const isOpen = navLinksContainer.style.display === 'flex';
  navLinksContainer.style.display = isOpen ? 'none' : 'flex';
  navLinksContainer.style.flexDirection = 'column';
  navLinksContainer.style.position = 'absolute';
  navLinksContainer.style.top = '70px';
  navLinksContainer.style.left = '0';
  navLinksContainer.style.right = '0';
  navLinksContainer.style.background = 'rgba(3,7,18,0.97)';
  navLinksContainer.style.padding = '24px 28px';
  navLinksContainer.style.borderBottom = '1px solid rgba(255,255,255,0.07)';
  navLinksContainer.style.backdropFilter = 'blur(20px)';
  if (isOpen) navLinksContainer.removeAttribute('style');
});

// Close mobile nav when a link is clicked
navLinksContainer.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 900) {
      navLinksContainer.removeAttribute('style');
    }
  });
});


/* ─── TYPEWRITER EFFECT ON HERO ─────────── */
const heroSub = document.querySelector('.hero-sub');
if (heroSub) {
  const roles = [
    'Full Stack Java Developer',
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typewrite() {
    const current = roles[roleIndex];
    const displayed = isDeleting
      ? current.substring(0, charIndex--)
      : current.substring(0, charIndex++);

    heroSub.textContent = displayed;

    let delay = isDeleting ? 50 : 80;
    if (!isDeleting && charIndex > current.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex < 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      charIndex = 0;
      delay = 400;
    }

    setTimeout(typewrite, delay);
  }

  // Start after reveal animation
  setTimeout(typewrite, 700);
}


/* ─── TILT EFFECT ON PROJECT CARDS ──────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-8px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
  });
});


/* ─── GLITCH EFFECT ON LOGO ─────────────── */
const logo = document.querySelector('.nav-logo');
if (logo) {
  logo.setAttribute('data-text', logo.textContent);
  logo.style.position = 'relative';
}


console.log('%c Chetan Portfolio Loaded ✓', 'color:#00ffa3;font-family:monospace;font-size:14px;');