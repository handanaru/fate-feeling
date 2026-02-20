(() => {
  const line = document.querySelector('[data-typewriter]');
  if (!line) return;

  const text = line.dataset.text || line.textContent.trim().replace(/^"|"$/g, '');
  if (!text) return;

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    line.textContent = `"${text}"`;
    return;
  }

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
      return;
    }

    const char = text[index - 1];
    const pause = /[,.!?… ]/.test(char) ? 72 : baseDelay;
    setTimeout(tick, pause);
  };

  setTimeout(tick, 480);
})();
