const firstImpactForm = document.getElementById('firstImpactForm');
const trustCounter = document.getElementById('trustCounterValue');
const trustCounterText = document.getElementById('trustCounterText');
const trustCounterTail = document.getElementById('trustCounterTail');
const impactCopy = document.getElementById('impactCopy');
const concernSelect = document.getElementById('concern');
const nameGuideLabel = document.getElementById('nameGuideLabel');
const startSubmitBtn = document.getElementById('startSubmitBtn');
const firstVisitModal = document.getElementById('firstVisitModal');
const hideOnboardingForever = document.getElementById('hideOnboardingForever');
const onboardingStartBtn = document.getElementById('onboardingStartBtn');
const onboardingPreviewBtn = document.getElementById('onboardingPreviewBtn');
const analysisModeSelect = document.getElementById('analysisMode');
const onboardingModeButtons = [...document.querySelectorAll('#onboardingModeButtons [data-mode]')];
const onboardingModeStatus = document.getElementById('onboardingModeStatus');
const modeCard = document.getElementById('modeCard');
const modeCardTitle = document.getElementById('modeCardTitle');
const modeCardIcon = document.getElementById('modeCardIcon');
const modeCardBg = document.getElementById('modeCardBg');

function saveIntake(name, birth, birthTime, birthPlace, concern, mode) {
  const prev = JSON.parse(localStorage.getItem('ff-intake') || '{}');
  const normalizedBirthTime = birthTime || prev.birthTime || '모름(입력 안 함)';
  const payload = {
    ...prev,
    name,
    gender: prev.gender || '기타',
    birth: birth || prev.birth || '2000-01-01',
    birthTime: normalizedBirthTime,
    birthTimeUnknown: normalizedBirthTime.includes('모름'),
    birthPlace: birthPlace || prev.birthPlace || '서울',
    concern: concern || prev.concern || '재회',
    mode: mode || prev.mode || 'ziwei',
    mbti: prev.mbti || 'INFP',
    agree: true
  };
  localStorage.setItem('ff-intake', JSON.stringify(payload));
}

const concernCopyMap = {
  '재회': {
    count: 12405,
    counterTail: '명이 이별 후 재회 타이밍을 확인했습니다.',
    headline: "어긋난 인연에도 다시 만날 '때'는 반드시 있습니다.",
    nameGuide: '당신의 이름을 입력해 사랑의 문을 여세요.',
    ctaGoal: '재회 운'
  },
  '짝사랑/썸': {
    count: 8920,
    counterTail: '명이 고백 성공 확률을 확인했습니다.',
    headline: "닿지 않는 마음이 '진심'으로 전해지는 찰나를 포착하세요.",
    nameGuide: '당신의 이름을 입력해 사랑의 문을 여세요.',
    ctaGoal: '짝사랑 운'
  },
  '취업/금전': {
    count: 15340,
    counterTail: '명이 대박 운 흐름을 확인했습니다.',
    headline: "막혔던 운의 흐름이 터지는 '결정적 순간'을 짚어드립니다.",
    nameGuide: '당신의 이름을 입력해 성공의 문을 여세요.',
    ctaGoal: '성공 운'
  },
  MBTI: {
    count: 10480,
    counterTail: '명이 성향 기반 관계 해석을 확인했습니다.',
    headline: "데이터가 말해주는 당신의 '진짜 모습'을 마주해 보세요.",
    nameGuide: '당신의 이름을 입력해 성향 분석의 문을 여세요.',
    ctaGoal: '성향'
  }
};

function concernMeta() {
  const key = concernSelect?.value || '재회';
  return concernCopyMap[key] || concernCopyMap['재회'];
}

let counterAnimFrame = null;
function animateTrustCounter(target = 12405) {
  if (!trustCounter) return;
  if (counterAnimFrame) cancelAnimationFrame(counterAnimFrame);
  const current = Number((trustCounter.textContent || '0').replace(/,/g, '')) || 0;
  const duration = 820;
  const startAt = performance.now();
  const tick = (now) => {
    const ratio = Math.min(1, (now - startAt) / duration);
    const eased = 1 - Math.pow(1 - ratio, 3);
    const value = Math.round(current + (target - current) * eased);
    trustCounter.textContent = value.toLocaleString('ko-KR');
    if (ratio < 1) counterAnimFrame = requestAnimationFrame(tick);
  };
  counterAnimFrame = requestAnimationFrame(tick);
}

function softSwapText(el, text) {
  if (!el) return;
  el.classList.remove('fade-swap');
  void el.offsetWidth;
  el.textContent = text;
  el.classList.add('fade-swap');
}


function spawnSpark(x, y) {
  const dot = document.createElement('span');
  dot.style.position = 'fixed';
  dot.style.left = `${x}px`;
  dot.style.top = `${y}px`;
  dot.style.width = '4px';
  dot.style.height = '4px';
  dot.style.borderRadius = '50%';
  dot.style.pointerEvents = 'none';
  dot.style.background = 'rgba(255,237,170,.9)';
  dot.style.boxShadow = '0 0 10px rgba(255,214,117,.8)';
  dot.style.zIndex = '10';
  dot.style.transition = 'transform .7s ease, opacity .7s ease';
  document.body.appendChild(dot);
  requestAnimationFrame(() => {
    dot.style.transform = `translate(${(Math.random() - 0.5) * 40}px, ${-20 - Math.random() * 30}px)`;
    dot.style.opacity = '0';
  });
  setTimeout(() => dot.remove(), 750);
}

let sparkThrottle = 0;
window.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - sparkThrottle < 45) return;
  sparkThrottle = now;
  spawnSpark(e.clientX, e.clientY);
});

firstImpactForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = (document.getElementById('name')?.value || '').trim();
  const birth = (document.getElementById('birth')?.value || '').trim();
  const birthTime = (document.getElementById('birthTime')?.value || '').trim();
  const birthPlace = (document.getElementById('birthPlace')?.value || '').trim();
  const concern = (document.getElementById('concern')?.value || '재회').trim();
  const mode = (document.getElementById('analysisMode')?.value || 'ziwei').trim();

  if (!name) return alert('이름을 입력해줘.');
  if (!birth) return alert('생년월일을 입력해줘.');
  if (!birthPlace) return alert('출생지를 입력해줘.');

  saveIntake(name, birth, birthTime, birthPlace, concern, mode);
  window.location.replace('/test.html');
});

function closeOnboarding() {
  if (!firstVisitModal) return;
  firstVisitModal.hidden = true;
  if (hideOnboardingForever?.checked) {
    localStorage.setItem('ff-hide-onboarding', '1');
  }
}

function openOnboardingIfNeeded() {
  if (!firstVisitModal) return;
  const hide = localStorage.getItem('ff-hide-onboarding') === '1';
  if (hide) return;
  setTimeout(() => { firstVisitModal.hidden = false; }, 320);
}

const modeCardMeta = {
  saju: { title: 'FLOW', icon: '☯' },
  tarot: { title: 'DESTINY', icon: '✶' },
  ziwei: { title: 'ZODIAC', icon: '✦' },
  astro: { title: 'UNIVERSE', icon: '🪐' },
  mbti: { title: 'TYPE', icon: '◆' }
};

function modeLabel(mode) {
  return ({ saju: '사주', tarot: '타로', ziwei: '자미두수', astro: '점성술', mbti: 'MBTI' }[mode] || '자미두수');
}

function syncModeUI(mode) {
  if (!mode) return;
  if (analysisModeSelect) analysisModeSelect.value = mode;
  onboardingModeButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.mode === mode));
  const label = modeLabel(mode);
  if (onboardingModeStatus) onboardingModeStatus.textContent = `현재 선택: ${label}`;

  const meta = concernMeta();
  if (onboardingStartBtn) onboardingStartBtn.textContent = `${label}로 ${meta.ctaGoal} 확인하기`;
  if (startSubmitBtn) startSubmitBtn.textContent = `${label}로 ${meta.ctaGoal} 확인하기`;

  const card = modeCardMeta[mode] || modeCardMeta.ziwei;
  if (modeCardTitle) modeCardTitle.textContent = card.title;
  if (modeCardIcon) modeCardIcon.textContent = card.icon;
  if (modeCardBg) modeCardBg.textContent = card.title;
  if (modeCard) {
    modeCard.classList.remove('is-flipping', 'mode-glow');
    requestAnimationFrame(() => {
      modeCard.classList.add('is-flipping');
      modeCard.classList.add('mode-glow');
      setTimeout(() => modeCard.classList.remove('is-flipping'), 560);
      setTimeout(() => modeCard.classList.remove('mode-glow'), 700);
    });
  }
}

function syncConcernUI() {
  const meta = concernMeta();
  animateTrustCounter(meta.count);
  if (trustCounterTail) softSwapText(trustCounterTail, meta.counterTail);
  softSwapText(impactCopy, meta.headline);
  softSwapText(nameGuideLabel, meta.nameGuide);
  syncModeUI(analysisModeSelect?.value || 'ziwei');
}

onboardingModeButtons.forEach((btn) => {
  btn.addEventListener('click', () => syncModeUI(btn.dataset.mode));
});
analysisModeSelect?.addEventListener('change', () => syncModeUI(analysisModeSelect.value));
concernSelect?.addEventListener('change', syncConcernUI);
if (analysisModeSelect?.value) syncModeUI(analysisModeSelect.value);

onboardingStartBtn?.addEventListener('click', closeOnboarding);
onboardingPreviewBtn?.addEventListener('click', () => {
  closeOnboarding();
  window.location.href = '/ziwei.html';
});
firstVisitModal?.addEventListener('click', (e) => {
  if (e.target === firstVisitModal) closeOnboarding();
});

syncConcernUI();
openOnboardingIfNeeded();
