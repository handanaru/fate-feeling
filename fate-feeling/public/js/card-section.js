(function () {
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function playFlipSound(enabled) {
    if (!enabled) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const audioCtx = playFlipSound.ctx || new AudioCtx();
    playFlipSound.ctx = audioCtx;

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(920, now);
    osc.frequency.exponentialRampToValueAtTime(330, now + 0.12);

    filter.type = 'highpass';
    filter.frequency.value = 210;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  async function typeSentence(el, text, expressionEl) {
    el.textContent = '';
    expressionEl?.classList.add('typing');
    const moods = ['🙂', '🤔', '✨', '🫶'];

    for (let i = 0; i < text.length; i += 1) {
      const ch = text[i];
      el.textContent += ch;
      if (expressionEl && i % 4 === 0) {
        expressionEl.textContent = moods[Math.floor(Math.random() * moods.length)];
      }
      await sleep(22);
    }

    if (expressionEl) {
      expressionEl.textContent = '😊';
      expressionEl.classList.remove('typing');
      expressionEl.classList.add('done');
      setTimeout(() => expressionEl.classList.remove('done'), 260);
    }
  }

  function createBubble() {
    const p = document.createElement('p');
    p.className = 'bubble ai typing';
    return p;
  }

  function parseLines(card) {
    const raw = card.dataset.interpretation || '';
    return raw
      .split('|')
      .map((line) => line.trim())
      .filter(Boolean);
  }

  function attachSfxToggle(section) {
    const target = section.querySelector('[data-sfx-toggle]');
    if (!target) return () => false;

    const key = 'ff-card-sfx-enabled';
    let enabled = localStorage.getItem(key);
    enabled = enabled === null ? true : enabled === 'true';

    target.textContent = `카드 SFX ${enabled ? 'ON' : 'OFF'}`;
    target.setAttribute('aria-pressed', String(enabled));

    target.addEventListener('click', () => {
      enabled = !enabled;
      localStorage.setItem(key, String(enabled));
      target.textContent = `카드 SFX ${enabled ? 'ON' : 'OFF'}`;
      target.setAttribute('aria-pressed', String(enabled));
    });

    return () => enabled;
  }

  function ensureExpression(section) {
    const coachTitle = section.querySelector('.coach-panel h3');
    if (!coachTitle || coachTitle.querySelector('.coach-expression')) return coachTitle?.querySelector('.coach-expression');

    const expr = document.createElement('span');
    expr.className = 'coach-expression';
    expr.textContent = '😊';
    coachTitle.appendChild(expr);
    return expr;
  }

  function ensureViralCTA(section) {
    if (section.querySelector('.viral-cta')) return;
    const cta = document.createElement('div');
    cta.className = 'viral-cta';
    cta.innerHTML = `
      <button class="btn secondary" type="button" data-share-trigger data-link="${window.location.href}">공유하기</button>
      <a class="btn" href="/test.html" data-fate-trigger>내 운명 확인하기</a>
    `;
    section.appendChild(cta);

    cta.querySelector('[data-share-trigger]')?.addEventListener('click', (e) => {
      const btn = e.currentTarget;
      window.ffShare?.(btn.dataset.link || window.location.href);
    });

    cta.querySelector('[data-fate-trigger]')?.addEventListener('click', () => {
      window.ffToast?.('좋아요! 내 운명 흐름을 다시 체크해봐요 ✨');
    });
  }

  function bindCenterFocus(section, cards) {
    const grid = section.querySelector('.fortune-card-grid');
    if (!grid || !cards.length) return;

    const updateFocus = () => {
      const rect = grid.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      let nearest = null;
      let minDistance = Infinity;

      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(center - cardCenter);
        if (distance < minDistance) {
          minDistance = distance;
          nearest = card;
        }
      });

      cards.forEach((card) => card.classList.toggle('is-focus', card === nearest));
    };

    grid.addEventListener('scroll', updateFocus, { passive: true });
    window.addEventListener('resize', updateFocus);
    setTimeout(updateFocus, 120);
  }

  function initSection(section) {
    const cards = [...section.querySelectorAll('.fortune-card')];
    const bubbleArea = section.querySelector('.coach-bubbles');
    const expressionEl = ensureExpression(section);
    const isSfxEnabled = attachSfxToggle(section);
    ensureViralCTA(section);
    bindCenterFocus(section, cards);
    let queue = Promise.resolve();

    cards.forEach((card) => {
      card.addEventListener('click', () => {
        card.classList.add('flipped');
        playFlipSound(isSfxEnabled());

        const lines = parseLines(card);
        if (!bubbleArea || !lines.length) return;

        queue = queue.then(async () => {
          for (const line of lines) {
            const bubble = createBubble();
            bubbleArea.appendChild(bubble);
            await typeSentence(bubble, line, expressionEl);
            bubble.classList.remove('typing');
            bubbleArea.scrollTop = bubbleArea.scrollHeight;
            await sleep(180);
          }
        });
      });
    });
  }

  function init() {
    document.querySelectorAll('.fortune-card-section').forEach(initSection);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();