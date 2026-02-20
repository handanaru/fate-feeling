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
