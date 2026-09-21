(function () {
  const canvas = document.getElementById('flowCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const slider = document.getElementById('anchorSlider');
  const modeLabel = document.getElementById('toyMode');

  const W = canvas.width;
  const H = canvas.height;
  const FLOW_SPEED = 1.6;        // px/frame each particle moves downstream, constant
  const LIFETIME = 260;          // frames a particle lives before it fades out
  const SPAWN_EVERY = 4;         // frames between new particles

  let particles = [];
  let spawnX = 90;                // where new particles currently appear
  let frame = 0;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function anchoring() {
    return (parseInt(slider.value, 10) || 0) / 100; // 0 = drifts with flow, 1 = fully anchored
  }

  function step() {
    frame++;
    const a = anchoring();

    // The spawn point itself drifts downstream at a rate set by the dial:
    // fully anchored (a=1) -> spawn point never moves.
    // fully unanchored (a=0) -> spawn point drifts at the same speed as the flow,
    // so the whole pattern just rides along and exits.
    spawnX += FLOW_SPEED * (1 - a);
    if (spawnX > W - 40) spawnX = 90; // wrap the trigger back so it can keep demonstrating

    if (frame % SPAWN_EVERY === 0) {
      particles.push({ x: spawnX, y: H / 2 + (Math.random() - 0.5) * 90, born: frame, r: 2 + Math.random() * 2.5 });
    }

    particles.forEach(p => { p.x += FLOW_SPEED; });
    particles = particles.filter(p => frame - p.born < LIFETIME && p.x < W + 20);

    draw(a);
    if (!reduceMotion) requestAnimationFrame(step);
  }

  function draw(a) {
    ctx.clearRect(0, 0, W, H);

    // envelope shading: density histogram across x
    const bins = 60;
    const counts = new Array(bins).fill(0);
    particles.forEach(p => {
      const b = Math.floor((p.x / W) * bins);
      if (b >= 0 && b < bins) counts[b]++;
    });
    const maxCount = Math.max(1, ...counts);
    ctx.save();
    for (let i = 0; i < bins; i++) {
      const density = counts[i] / maxCount;
      if (density <= 0) continue;
      ctx.fillStyle = `rgba(232,124,46,${0.05 + density * 0.22})`;
      ctx.fillRect((i / bins) * W, 0, W / bins + 1, H);
    }
    ctx.restore();

    // particles
    particles.forEach(p => {
      const age = (frame - p.born) / LIFETIME;
      const alpha = Math.max(0, 1 - age);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,196,140,${alpha})`;
      ctx.shadowColor = 'rgba(232,124,46,0.8)';
      ctx.shadowBlur = 6;
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    // flow direction hint
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath();
    ctx.moveTo(20, H - 20);
    ctx.lineTo(W - 20, H - 20);
    ctx.stroke();

    if (modeLabel) {
      modeLabel.textContent = a > 0.66
        ? 'Anchored — the envelope holds still while everything inside it moves'
        : a > 0.33
          ? 'Partly anchored — the pattern lingers, then lets go'
          : 'Sweeps away with the flow';
    }
  }

  slider.addEventListener('input', () => { if (reduceMotion) draw(anchoring()); });
  step();
  if (reduceMotion) draw(anchoring());
})();
