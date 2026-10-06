/**
 * ATELIER HANDCRAFTED SILK LOOM & GOLDEN STARDUST BACKGROUND ENGINE
 * Multi-layer fluid auroras + 60fps HTML5 Canvas weave simulator
 * Automatically adapts with high-contrast visibility in both Dark and Light modes.
 */
(function() {
  'use strict';

  // 1. Universal High-Contrast & Luxury Style Injector
  function injectStyles() {
    let styleEl = document.getElementById('atelier-bg-styles');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'atelier-bg-styles';
      document.head.appendChild(styleEl);
    }
    
    styleEl.textContent = `
      @keyframes auroraMorph1 {
        0%, 100% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
        33% { transform: translate(45px, -35px) scale(1.15) rotate(45deg); }
        66% { transform: translate(-35px, 25px) scale(0.9) rotate(-30deg); }
      }
      @keyframes auroraMorph2 {
        0%, 100% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
        50% { transform: translate(-55px, -45px) scale(1.2) rotate(-60deg); }
      }
      @keyframes auroraMorph3 {
        0%, 100% { transform: translate(0px, 0px) scale(0.95); }
        50% { transform: translate(40px, 50px) scale(1.12); }
      }
      .aurora-orb-1 {
        animation: auroraMorph1 24s ease-in-out infinite alternate;
        position: absolute;
        border-radius: 9999px;
        pointer-events: none;
      }
      .aurora-orb-2 {
        animation: auroraMorph2 28s ease-in-out infinite alternate;
        position: absolute;
        border-radius: 9999px;
        pointer-events: none;
      }
      .aurora-orb-3 {
        animation: auroraMorph3 22s ease-in-out infinite alternate;
        position: absolute;
        border-radius: 9999px;
        pointer-events: none;
      }

      /* Dark Mode Auroras: Molten Gold & Warm Amber Glow */
      .dark .aurora-orb-1 {
        background: radial-gradient(circle, rgba(212, 175, 55, 0.16) 0%, rgba(245, 158, 11, 0.08) 50%, transparent 70%);
        filter: blur(100px);
      }
      .dark .aurora-orb-2 {
        background: radial-gradient(circle, rgba(184, 134, 11, 0.14) 0%, rgba(212, 175, 55, 0.07) 50%, transparent 70%);
        filter: blur(110px);
      }
      .dark .aurora-orb-3 {
        background: radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, rgba(180, 83, 9, 0.06) 60%, transparent 75%);
        filter: blur(120px);
      }

      /* In Light Mode: Completely remove background animations across all pages */
      html:not(.dark) #atelierBgContainer,
      html:not(.dark) #atelierCanvas,
      html:not(.dark) .aurora-orb-1,
      html:not(.dark) .aurora-orb-2,
      html:not(.dark) .aurora-orb-3 {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
        animation: none !important;
        pointer-events: none !important;
      }

      /* In Dark Mode: Ensure background animations are active and visible */
      .dark #atelierBgContainer,
      .dark #atelierCanvas {
        display: block !important;
        opacity: 1 !important;
        visibility: visible !important;
      }

      /* ==================================================== */
      /* UNIVERSAL HIGH-CONTRAST LIGHT MODE TYPOGRAPHY & TEXT */
      /* ==================================================== */
      html:not(.dark) body {
        background-color: #FAF8F5 !important;
        color: #0F172A !important;
      }

      /* Headings in Light Mode */
      html:not(.dark) h1:not([class*="bg-clip-text"]),
      html:not(.dark) h2:not([class*="bg-clip-text"]),
      html:not(.dark) h3:not([class*="bg-clip-text"]),
      html:not(.dark) h4:not([class*="bg-clip-text"]),
      html:not(.dark) h5,
      html:not(.dark) h6 {
        color: #0F172A !important;
      }

      /* Primary text classes formerly pale in dark mode */
      html:not(.dark) [class*="text-slate-100"],
      html:not(.dark) [class*="text-slate-200"],
      html:not(.dark) [class*="text-sand-100"],
      html:not(.dark) [class*="text-sand-200"],
      html:not(.dark) [class*="text-gray-100"],
      html:not(.dark) [class*="text-gray-200"],
      html:not(.dark) [class*="text-zinc-100"],
      html:not(.dark) [class*="text-zinc-200"] {
        color: #0F172A !important;
      }

      /* Secondary body text, paragraphs, descriptions & subtitles (Eliminating pale gray/white) */
      html:not(.dark) [class*="text-slate-300"],
      html:not(.dark) [class*="text-slate-400"],
      html:not(.dark) [class*="text-sand-300"],
      html:not(.dark) [class*="text-sand-400"],
      html:not(.dark) [class*="text-gray-300"],
      html:not(.dark) [class*="text-gray-400"],
      html:not(.dark) [class*="text-zinc-300"],
      html:not(.dark) [class*="text-zinc-400"],
      html:not(.dark) .custom-text-secondary,
      html:not(.dark) .custom-text-muted {
        color: #334155 !important; /* Deep Slate-700 - 9:1 contrast ratio against ivory/white */
      }

      /* Metadata, fine print & small captions */
      html:not(.dark) [class*="text-slate-500"],
      html:not(.dark) [class*="text-sand-500"],
      html:not(.dark) [class*="text-gray-500"],
      html:not(.dark) [class*="text-zinc-500"] {
        color: #475569 !important; /* Deep Slate-600 */
      }

      /* Gold & Amber Accents in Light Mode: Venetian Bronze-Gold (High Contrast & Luxury) */
      html:not(.dark) [class*="text-gold-400"]:not([class*="bg-clip-text"]):not(.btn-3d-gold *),
      html:not(.dark) [class*="text-gold-300"]:not([class*="bg-clip-text"]):not(.btn-3d-gold *),
      html:not(.dark) [class*="text-gold-500"]:not([class*="bg-clip-text"]):not(.btn-3d-gold *),
      html:not(.dark) [class*="text-amber-400"]:not([class*="bg-clip-text"]):not(.btn-3d-gold *),
      html:not(.dark) [class*="text-amber-300"]:not([class*="bg-clip-text"]):not(.btn-3d-gold *) {
        color: #A16207 !important; /* Rich Venetian Bronze-Gold (Amber-700 / Gold-700) */
      }

      /* Preserve text-white only inside explicit dark badges / overlays */
      html:not(.dark) [class*="text-white"]:not([class*="bg-black"] *):not([class*="bg-obsidian"] *):not(.btn-3d-gold *):not([class*="badge-gold"] *):not([class*="bg-emerald"] *):not([class*="bg-amber"] *):not([class*="bg-rose"] *) {
        color: #0F172A !important;
      }

      /* ==================================================== */
      /* TOGGLE CONTROLS (RTL & THEME BUTTONS) IN LIGHT MODE  */
      /* ==================================================== */
      html:not(.dark) .btn-3d-icon {
        background: linear-gradient(180deg, #FFFFFF 0%, #F1F4F9 100%) !important;
        border: 1.5px solid #CBD5E1 !important;
        color: #0F172A !important;
        box-shadow: 0 1px 0 rgba(255, 255, 255, 0.95) inset, 0 2px 0 #94A3B8, 0 4px 10px rgba(0, 0, 0, 0.12) !important;
      }
      html:not(.dark) .btn-3d-icon:hover {
        border-color: #A16207 !important;
        color: #A16207 !important;
        box-shadow: 0 1px 0 rgba(255, 255, 255, 1) inset, 0 3px 0 #A16207, 0 6px 14px rgba(161, 98, 7, 0.2) !important;
      }
      html:not(.dark) .btn-3d-icon:active {
        box-shadow: 0 1px 0 #94A3B8, 0 2px 4px rgba(0, 0, 0, 0.08) !important;
      }

      /* All icon SVGs inside .btn-3d-icon */
      html:not(.dark) .btn-3d-icon i,
      html:not(.dark) .btn-3d-icon svg,
      html:not(.dark) #rtlToggle i,
      html:not(.dark) #rtlToggle svg,
      html:not(.dark) #mobileRtlToggle i,
      html:not(.dark) #mobileRtlToggle svg,
      html:not(.dark) #rtlIcon,
      html:not(.dark) #moonIcon,
      html:not(.dark) #mobileMoonIcon {
        color: #0F172A !important;
        stroke: #0F172A !important;
        fill: none;
        stroke-width: 2.2px !important;
      }

      /* Sun Icon when visible in Light Mode: Warm Rich Venetian Amber-Gold */
      html:not(.dark) #sunIcon,
      html:not(.dark) #mobileSunIcon {
        color: #B45309 !important;
        stroke: #B45309 !important;
        stroke-width: 2.2px !important;
      }

      /* Hover States for Toggle Icons */
      html:not(.dark) .btn-3d-icon:hover i,
      html:not(.dark) .btn-3d-icon:hover svg,
      html:not(.dark) #rtlToggle:hover i,
      html:not(.dark) #rtlToggle:hover svg,
      html:not(.dark) #mobileRtlToggle:hover i,
      html:not(.dark) #mobileRtlToggle:hover svg {
        color: #A16207 !important;
        stroke: #A16207 !important;
      }

      /* ==================================================== */
      /* INPUT FIELDS & CARDS IN LIGHT MODE                   */
      /* ==================================================== */
      html:not(.dark) .login-input,
      html:not(.dark) .custom-input,
      html:not(.dark) input:not([type="checkbox"]):not([type="radio"]),
      html:not(.dark) select,
      html:not(.dark) textarea {
        background-color: #FFFFFF !important;
        border: 1.5px solid #CBD5E1 !important;
        color: #0F172A !important;
        font-weight: 500 !important;
      }
      html:not(.dark) .login-input::placeholder,
      html:not(.dark) .custom-input::placeholder,
      html:not(.dark) input::placeholder,
      html:not(.dark) textarea::placeholder {
        color: #64748B !important;
        font-weight: 400 !important;
      }
      html:not(.dark) .login-input:focus,
      html:not(.dark) .custom-input:focus,
      html:not(.dark) input:focus,
      html:not(.dark) textarea:focus {
        background-color: #FFFFFF !important;
        border-color: #D4AF37 !important;
        box-shadow: 0 0 0 2.5px rgba(212, 175, 55, 0.28) !important;
      }

      /* Glass Cards in Light Mode */
      html:not(.dark) .login-glass-card,
      html:not(.dark) .custom-glass-card {
        background: rgba(255, 255, 255, 0.97) !important;
        border: 1.5px solid rgba(212, 175, 55, 0.4) !important;
        box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.12), 0 4px 18px rgba(212, 175, 55, 0.12) !important;
      }
      html:not(.dark) .custom-inner-card {
        background: #F8FAFC !important;
        border: 1px solid rgba(0, 0, 0, 0.08) !important;
      }
    `;
  }

  // Inject immediately
  injectStyles();

  // 2. DOM Ready Orchestration
  function initEngine() {
    // Re-inject/ensure style is in head
    injectStyles();

    // Check if background container exists, otherwise inject at top of body
    let container = document.getElementById('atelierBgContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'atelierBgContainer';
      container.className = 'fixed inset-0 pointer-events-none overflow-hidden';
      container.style.zIndex = '0';
      container.innerHTML = `
        <div class="aurora-orb-1 absolute top-[5%] left-[12%] w-[520px] h-[420px]"></div>
        <div class="aurora-orb-2 absolute bottom-[10%] right-[8%] w-[560px] h-[440px]"></div>
        <div class="aurora-orb-3 absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[680px] h-[460px]"></div>
        <canvas id="atelierCanvas" class="absolute inset-0 w-full h-full pointer-events-none"></canvas>
      `;
      // Prepend to body so it stays behind all headers and content
      if (document.body.firstChild) {
        document.body.insertBefore(container, document.body.firstChild);
      } else {
        document.body.appendChild(container);
      }
    }

    const canvas = document.getElementById('atelierCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0, height = 0;
    let particles = [];
    const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };
    let isDark = document.documentElement.classList.contains('dark');

    // Theme state observer
    const observer = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains('dark');
      if (!isDark) {
        ctx.clearRect(0, 0, width, height);
      }
      // Ensure high-contrast stylesheet remains active and at the end of head
      injectStyles();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      spawnParticles();
    }

    function spawnParticles() {
      particles = [];
      const particleCount = Math.min(Math.floor((width * height) / 19000), 55);
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          baseX: Math.random() * width,
          radius: Math.random() * 2.2 + 0.8,
          alpha: Math.random() * 0.75 + 0.25,
          alphaSpeed: Math.random() * 0.02 + 0.01,
          alphaOffset: Math.random() * Math.PI * 2,
          vy: -(Math.random() * 0.35 + 0.15),
          swayAmp: Math.random() * 18 + 6,
          swaySpeed: Math.random() * 0.012 + 0.005,
          swayOffset: Math.random() * Math.PI * 2,
          colorType: Math.random() > 0.45 ? 'gold' : (Math.random() > 0.5 ? 'amber' : 'champagne')
        });
      }
    }

    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('mousemove', (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    });

    resizeCanvas();

    let time = 0;
    function renderLoop() {
      // In Light Mode: completely clear canvas and bypass all drawing
      if (!isDark) {
        ctx.clearRect(0, 0, width, height);
        requestAnimationFrame(renderLoop);
        return;
      }

      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // 1. Interactive Cursor Illumination
      if (mouse.x > 0 && mouse.y > 0) {
        const mouseGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 240);
        if (isDark) {
          mouseGrad.addColorStop(0, 'rgba(212, 175, 55, 0.16)');
          mouseGrad.addColorStop(0.5, 'rgba(212, 175, 55, 0.05)');
          mouseGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');
        } else {
          // High-visibility golden champagne sunburst in light mode
          mouseGrad.addColorStop(0, 'rgba(218, 165, 32, 0.32)');
          mouseGrad.addColorStop(0.4, 'rgba(245, 190, 80, 0.16)');
          mouseGrad.addColorStop(1, 'rgba(218, 165, 32, 0)');
        }
        ctx.fillStyle = mouseGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 240, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Flowing Handcrafted Loom Warp Threads (Sinusoidal Silk Waves)
      const loomThreadCount = 4;
      for (let t = 0; t < loomThreadCount; t++) {
        ctx.beginPath();
        const baseHeight = height * (0.16 + t * 0.24);
        const waveFreq = 0.0018 + t * 0.0006;
        const waveAmp = 30 + t * 10;
        const waveSpeed = time * (0.75 + t * 0.25);

        ctx.moveTo(0, baseHeight + Math.sin(waveSpeed) * waveAmp);
        for (let x = 0; x <= width; x += 15) {
          const y = baseHeight + Math.sin(x * waveFreq + waveSpeed) * waveAmp + Math.cos(x * 0.001 - time * 0.45) * 8;
          ctx.lineTo(x, y);
        }

        if (isDark) {
          ctx.strokeStyle = t % 2 === 0 ? 'rgba(212, 175, 55, 0.08)' : 'rgba(245, 222, 147, 0.05)';
          ctx.lineWidth = 1.1;
          ctx.shadowBlur = 0;
        } else {
          // High-contrast rich antique gold & bronze in light mode
          ctx.strokeStyle = t % 2 === 0 ? 'rgba(165, 110, 15, 0.65)' : 'rgba(195, 135, 25, 0.55)';
          ctx.lineWidth = 1.6;
          ctx.shadowColor = 'rgba(212, 160, 20, 0.5)';
          ctx.shadowBlur = 6;
        }
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      }

      // 3. Connect close particles with delicate golden knot strands
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            const knotAlpha = (1 - dist / 90);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);

            if (isDark) {
              ctx.strokeStyle = `rgba(212, 175, 55, ${knotAlpha * 0.18})`;
              ctx.lineWidth = 0.65;
            } else {
              // High-contrast visible golden knot thread in light mode
              ctx.strokeStyle = `rgba(160, 105, 15, ${knotAlpha * 0.75})`;
              ctx.lineWidth = 1.1;
            }
            ctx.stroke();
          }
        }
      }

      // 4. Update & Render Golden Stardust Silk Particles
      particles.forEach((p) => {
        p.y += p.vy;
        p.x = p.baseX + Math.sin(time * 3 * p.swaySpeed + p.swayOffset) * p.swayAmp;

        // Subtle mouse repulsion
        if (mouse.x > 0 && mouse.y > 0) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 110) {
            const force = (1 - mdist / 110) * 7;
            p.x += (mdx / mdist) * force;
            p.y += (mdy / mdist) * force;
          }
        }

        // Loop around screen edges
        if (p.y < -12) {
          p.y = height + 12;
          p.baseX = Math.random() * width;
        }

        const pulseAlpha = p.alpha * (0.65 + 0.35 * Math.sin(time * 2 * p.alphaSpeed + p.alphaOffset));

        let fillCol, haloCol;
        if (isDark) {
          if (p.colorType === 'gold') fillCol = `rgba(212, 175, 55, ${pulseAlpha})`;
          else if (p.colorType === 'amber') fillCol = `rgba(245, 190, 80, ${pulseAlpha})`;
          else fillCol = `rgba(255, 235, 170, ${pulseAlpha})`;
          haloCol = `rgba(212, 175, 55, ${pulseAlpha * 0.28})`;
        } else {
          // Rich, vibrant, glistening jewel tones in light mode (Highly visible!)
          if (p.colorType === 'gold') fillCol = `rgba(185, 125, 12, 0.95)`;
          else if (p.colorType === 'amber') fillCol = `rgba(215, 140, 20, 0.95)`;
          else fillCol = `rgba(160, 95, 10, 0.95)`;
          haloCol = `rgba(218, 165, 32, 0.55)`;
          ctx.shadowColor = 'rgba(212, 160, 23, 0.7)';
          ctx.shadowBlur = 8;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = fillCol;
        ctx.fill();

        // Extra halo for particles
        if (p.radius > 1.3) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.3, 0, Math.PI * 2);
          ctx.fillStyle = haloCol;
          ctx.fill();
        }
        ctx.shadowBlur = 0; // reset
      });

      requestAnimationFrame(renderLoop);
    }

    requestAnimationFrame(renderLoop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEngine);
  } else {
    initEngine();
  }
})();
