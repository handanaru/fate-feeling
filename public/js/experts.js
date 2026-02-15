(function () {
  const modal = document.getElementById('expertModal');
  if (!modal) return;

  const title = document.getElementById('expertModalTitle');
  const styleEl = document.getElementById('expertModalStyle');
  const caseEl = document.getElementById('expertModalCase');
  const similarUsers = document.getElementById('similarUsers');
  const liveCounselingCount = document.getElementById('liveCounselingCount');

  const intake = JSON.parse(localStorage.getItem('ff-intake') || '{}');
  const name = intake.name || '고객';
  const result = JSON.parse(localStorage.getItem('ff-result') || '{}');
  const base = Math.max(82, Math.min(98, Math.round(((result.recoveryIndex || 64) + (result.reunionForce || 72)) / 2)));

  document.querySelectorAll('.tarot-card').forEach((card, idx) => {
    const score = Math.max(81, Math.min(98, base - idx + (idx % 2)));
    const front = card.querySelector('.tarot-front');
    if (front) {
      const p = document.createElement('p');
      p.className = 'expert-match-label';
      p.innerHTML = `<strong>${name}님과 사주 합 ${score}% 일치</strong><span>추정 기반</span>`;
      front.prepend(p);
    }
  });

  const now = new Date();
  const stamp = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  document.querySelectorAll('[data-status-updated]').forEach((el) => { el.textContent = `마지막 업데이트 ${stamp}`; });

  function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function updateLiveNumbers() {
    if (similarUsers) similarUsers.textContent = String(randomRange(40, 60));
    if (liveCounselingCount) liveCounselingCount.textContent = String(randomRange(3, 7));
    document.querySelectorAll('[data-waiting]').forEach((el) => {
      el.textContent = String(randomRange(3, 7));
    });
  }
  updateLiveNumbers();
  setInterval(updateLiveNumbers, 3500);

  document.querySelectorAll('[data-open-expert-modal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const expert = btn.dataset.expert || '추천 상담사';
      if (title) title.textContent = `${expert} 연결 전 안내`;
      if (styleEl) styleEl.textContent = btn.dataset.style || '감정 공감 + 행동 전략 제시';
      if (caseEl) caseEl.textContent = btn.dataset.case || '관계 재접촉 성공 사례 다수';
      modal.hidden = false;
    });
  });

  document.querySelectorAll('[data-close-expert-modal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      modal.hidden = true;
    });
  });
})();
