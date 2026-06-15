// ===== HIDDENSEER — ABOUT PAGE ANNIVERSARY FIREWORKS =====
(function () {
  const section = document.querySelector('.anni-section');
  const canvas = document.getElementById('anni-canvas');
  if (!canvas || !section) return;

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['#FDB913', '#ffffff', '#005B94', '#FFD700', '#87CEEB', '#ff9de2', '#a8edea'];
  const particles = [];
  const rockets = [];

  class Rocket {
    constructor() {
      this.x = canvas.width * (0.1 + Math.random() * 0.8);
      this.y = canvas.height;
      this.tx = canvas.width * (0.1 + Math.random() * 0.8);
      this.ty = canvas.height * (0.05 + Math.random() * 0.5);
      const angle = Math.atan2(this.ty - this.y, this.tx - this.x);
      const speed = 10 + Math.random() * 6;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.trail = [];
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 10) this.trail.shift();
      this.x += this.vx;
      this.y += this.vy;
      if (Math.hypot(this.x - this.tx, this.y - this.ty) < 15) {
        this.burst(); return true;
      }
      return false;
    }
    burst() {
      for (let i = 0; i < 70; i++) {
        const a = (i / 70) * Math.PI * 2;
        const s = 2 + Math.random() * 5;
        particles.push(new Particle(this.x, this.y, Math.cos(a) * s, Math.sin(a) * s, this.color));
      }
    }
    draw() {
      this.trail.forEach((pt, i) => {
        ctx.globalAlpha = (i / this.trail.length) * 0.7;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
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
      this.decay = 0.014 + Math.random() * 0.012;
      this.r = 1.5 + Math.random() * 2;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.vy += 0.07; this.vx *= 0.98;
      this.alpha -= this.decay;
      return this.alpha > 0;
    }
    draw() {
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  let timer = 0;
  function loop() {
    ctx.fillStyle = 'rgba(26,10,0,0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (++timer > 30) { rockets.push(new Rocket()); timer = 0; }

    for (let i = rockets.length - 1; i >= 0; i--) {
      if (rockets[i].update()) rockets.splice(i, 1);
      else rockets[i].draw();
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      if (!particles[i].update()) particles.splice(i, 1);
      else particles[i].draw();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }

  loop();
})();
