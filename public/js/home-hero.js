(() => {
  const line = document.querySelector('[data-typewriter]');
  if (!line) return;

  const text = line.dataset.text || line.textContent.trim().replace(/^"|"$/g, '');
  if (!text) return;

  const fullText = `"${text}"`;

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    line.textContent = fullText;
    return;
  }

  // 최종 문장 높이를 미리 고정해서, 타이핑 완료 시 문단이 "위로 튀는" 현상 방지
  const probe = line.cloneNode(true);
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  probe.style.pointerEvents = 'none';
  probe.style.height = 'auto';
  probe.style.minHeight = '0';
  probe.style.width = `${line.clientWidth || line.getBoundingClientRect().width}px`;
  probe.textContent = fullText;
  line.parentElement?.appendChild(probe);
  const reservedHeight = Math.ceil(probe.getBoundingClientRect().height);
  probe.remove();
  if (reservedHeight > 0) line.style.minHeight = `${reservedHeight}px`;

  line.classList.add('is-typing');
  line.textContent = '""';

  let index = 0;
  const baseDelay = 34;

  const tick = () => {
    index += 1;
    const current = text.slice(0, index);
    line.textContent = `"${current}"`;

    if (index >= text.length) {
      line.classList.remove('is-typing');
      line.classList.add('is-typed');
      // 마지막 프레임 이후 minHeight 해제 (미세한 레이아웃 점프 방지 위해 한 템포 뒤)
      setTimeout(() => {
        line.style.minHeight = '';
      }, 120);
      return;
    }

    const char = text[index - 1];
    const pause = /[,.!?… ]/.test(char) ? 72 : baseDelay;
    setTimeout(tick, pause);
  };

  setTimeout(tick, 480);
})();

(() => {
  const scene = document.querySelector('[data-parallax-scene]');
  if (!scene) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const layers = [...scene.querySelectorAll('[data-parallax-layer]')];
  if (!layers.length) return;

  const apply = (rx = 0, ry = 0) => {
    layers.forEach((layer) => {
      const depth = Number(layer.dataset.depth || 10);
      const x = (rx * depth) / 120;
      const y = (ry * depth) / 120;
      layer.style.setProperty('--px', `${x.toFixed(2)}px`);
      layer.style.setProperty('--py', `${y.toFixed(2)}px`);
    });
  };

  scene.addEventListener('mousemove', (e) => {
    const rect = scene.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = (e.clientX - cx) / (rect.width / 2);
    const ry = (e.clientY - cy) / (rect.height / 2);
    apply(rx, ry);
  });

  scene.addEventListener('mouseleave', () => apply(0, 0));

  window.addEventListener('deviceorientation', (e) => {
    const gamma = Math.max(-20, Math.min(20, Number(e.gamma) || 0));
    const beta = Math.max(-20, Math.min(20, Number(e.beta) || 0));
    apply(gamma / 20, beta / 20);
  });
})();

(() => {
  const hub = document.querySelector('[data-nav-hub]');
  if (!hub) return;
  const btn = hub.querySelector('.ff-nav-hub-main');
  if (!btn) return;

  const close = () => {
    hub.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
  };
  const toggle = () => {
    const open = hub.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle();
  });

  document.addEventListener('click', (e) => {
    if (!hub.contains(e.target)) close();
  });

  hub.querySelectorAll('.hub-item').forEach((item) => {
    item.addEventListener('click', () => close());
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
})();
