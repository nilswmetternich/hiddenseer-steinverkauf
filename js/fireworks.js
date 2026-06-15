// ===== HIDDENSEER — FIREWORKS ANIMATION =====

(function () {
  const overlay = document.getElementById('anniversary-overlay');
  const canvas = document.getElementById('fireworks-canvas');
  if (!canvas || !overlay) return;

  const ctx = canvas.getContext('2d');
  let W, H, animId;
  const particles = [];
  const rockets = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  const COLORS = ['#FDB913', '#005B94', '#ffffff', '#FFD700', '#87CEEB', '#FF6B6B', '#98FB98', '#DDA0DD'];

  class Rocket {
    constructor() {
      this.x = W * (0.1 + Math.random() * 0.8);
      this.y = H;
      this.tx = W * (0.15 + Math.random() * 0.7);
      this.ty = H * (0.1 + Math.random() * 0.4);
      this.speed = 14 + Math.random() * 8;
      this.angle = Math.atan2(this.ty - this.y, this.tx - this.x);
      this.vx = Math.cos(this.angle) * this.speed;
      this.vy = Math.sin(this.angle) * this.speed;
      this.trail = [];
      this.exploded = false;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 12) this.trail.shift();
      this.x += this.vx;
      this.y += this.vy;
      const dist = Math.hypot(this.x - this.tx, this.y - this.ty);
      if (dist < 20) {
        this.explode();
        return true;
      }
      return false;
    }
    explode() {
      const count = 80 + Math.floor(Math.random() * 60);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const speed = 2 + Math.random() * 6;
        particles.push(new Particle(this.x, this.y, Math.cos(angle) * speed, Math.sin(angle) * speed, this.color));
      }
      // Extra glitter burst
      for (let i = 0; i < 20; i++) {
        particles.push(new Particle(
          this.x + (Math.random() - 0.5) * 40,
          this.y + (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3,
          '#ffffff'
        ));
      }
    }
    draw() {
      ctx.beginPath();
      this.trail.forEach((pt, i) => {
        ctx.globalAlpha = i / this.trail.length * 0.8;
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  class Particle {
    constructor(x, y, vx, vy, color) {
      this.x = x; this.y = y;
      this.vx = vx; this.vy = vy;
      this.color = color;
      this.alpha = 1;
      this.decay = 0.012 + Math.random() * 0.015;
      this.gravity = 0.08;
      this.radius = 1.5 + Math.random() * 2.5;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.vx *= 0.98;
      this.alpha -= this.decay;
      return this.alpha > 0;
    }
    draw() {
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  let launchTimer = 0;
  let launchCount = 0;
  const MAX_LAUNCHES = 20;

  function loop() {
    ctx.fillStyle = 'rgba(0,10,30,0.18)';
    ctx.fillRect(0, 0, W, H);

    launchTimer++;
    if (launchTimer > 18 && launchCount < MAX_LAUNCHES) {
      rockets.push(new Rocket());
      launchTimer = 0;
      launchCount++;
    }

    for (let i = rockets.length - 1; i >= 0; i--) {
      const done = rockets[i].update();
      rockets[i].draw();
      if (done) rockets.splice(i, 1);
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const alive = particles[i].update();
      particles[i].draw();
      if (!alive) particles.splice(i, 1);
    }

    ctx.globalAlpha = 1;
    animId = requestAnimationFrame(loop);

    // Auto-close after all fireworks finish
    if (launchCount >= MAX_LAUNCHES && rockets.length === 0 && particles.length === 0) {
      setTimeout(closeOverlay, 1200);
    }
  }

  loop();

  window.closeOverlay = function () {
    cancelAnimationFrame(animId);
    overlay.style.transition = 'opacity 0.5s ease';
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 500);
  };
})();
