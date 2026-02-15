const firstImpactForm = document.getElementById('firstImpactForm');
const trustCounter = document.getElementById('trustCounterValue');
const trustCounterText = document.getElementById('trustCounterText');
const trustCounterTail = document.getElementById('trustCounterTail');
const impactCopy = document.getElementById('impactCopy');
const concernSelect = document.getElementById('concern');
const nameGuideLabel = document.getElementById('nameGuideLabel');
const startSubmitBtn = document.getElementById('startSubmitBtn');
const onboardingConcernButtons = [...document.querySelectorAll('#onboardingConcernButtons [data-concern]')];
const onboardingConcernStatus = document.getElementById('onboardingConcernStatus');
const audienceTabButtons = [...document.querySelectorAll('#audienceTabs [data-audience]')];
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
const adultGateModal = document.getElementById('adultGateModal');
const adultGateConfirm = document.getElementById('adultGateConfirm');
const adultGateCancel = document.getElementById('adultGateCancel');
const partnerFields = document.getElementById('partnerFields');

function saveIntake(name, birth, birthTime, birthPlace, concern, mode, partner = {}) {
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
    concern: concern || prev.concern || '결혼 운세',
    mode: mode || prev.mode || 'ziwei',
    mbti: prev.mbti || 'INFP',
    partnerName: partner.name || prev.partnerName || '',
    partnerBirth: partner.birth || prev.partnerBirth || '',
    partnerBirthTime: partner.birthTime || prev.partnerBirthTime || '',
    agree: true
  };
  localStorage.setItem('ff-intake', JSON.stringify(payload));
}

const concernCopyMap = {
  '결혼 운세': {
    count: 11240,
    counterTail: '명이 결혼 운세와 배우자 흐름을 확인했습니다.',
    headline: "결혼의 타이밍과 현실 궁합을 함께 짚어드립니다.",
    nameGuide: '당신의 이름을 입력해 결혼 운세의 문을 여세요.',
    ctaGoal: '결혼 운'
  },
  '일반 궁합': {
    count: 15820,
    counterTail: '명이 관계 궁합 리포트를 확인했습니다.',
    headline: "두 사람의 소통 패턴과 충돌 포인트를 정확히 분석합니다.",
    nameGuide: '당신의 이름을 입력해 궁합 분석을 시작하세요.',
    ctaGoal: '궁합'
  },
  '재회운': {
    count: 12970,
    counterTail: '명이 재회운 타이밍을 점검했습니다.',
    headline: '엇갈린 인연의 재접점과 다시 붙는 타이밍을 추적합니다.',
    nameGuide: '당신의 이름을 입력해 재회운을 확인하세요.',
    ctaGoal: '재회 운'
  },
  '애정운': {
    count: 14020,
    counterTail: '명이 애정운 흐름을 확인했습니다.',
    headline: '감정 온도 변화와 관계 안정도를 정밀 분석합니다.',
    nameGuide: '당신의 이름을 입력해 애정운을 확인하세요.',
    ctaGoal: '애정 운'
  },
  '커플운': {
    count: 11640,
    counterTail: '명이 커플운 리듬을 확인했습니다.',
    headline: '연인 관계의 장기 안정성과 갈등 패턴을 함께 분석합니다.',
    nameGuide: '당신의 이름을 입력해 커플운을 확인하세요.',
    ctaGoal: '커플 운'
  },
  '썸운': {
    count: 12110,
    counterTail: '명이 썸운 확률을 확인했습니다.',
    headline: '썸 단계에서 관계가 진전될 확률을 읽어드립니다.',
    nameGuide: '당신의 이름을 입력해 썸운을 확인하세요.',
    ctaGoal: '썸 운'
  },
  '속궁합': {
    count: 9340,
    counterTail: '명이 19금 속궁합 리듬을 점검했습니다.',
    headline: "성인 전용 분석으로 관계의 밀도와 리듬을 해석합니다.",
    nameGuide: '당신의 이름을 입력해 성인 궁합 분석을 시작하세요.',
    ctaGoal: '속궁합'
  },
  '키스 궁합': {
    count: 8740,
    counterTail: '명이 19금 키스 케미 흐름을 확인했습니다.',
    headline: "미묘한 호흡과 텐션을 바탕으로 키스 케미를 진단합니다.",
    nameGuide: '당신의 이름을 입력해 키스 궁합 분석을 시작하세요.',
    ctaGoal: '키스 궁합'
  }
};

function concernMeta() {
  const key = concernSelect?.value || '결혼 운세';
  return concernCopyMap[key] || concernCopyMap['결혼 운세'];
}

function isAdultConcern(concern = '') {
  return concern === '속궁합' || concern === '키스 궁합';
}

function isAdultVerified() {
  return localStorage.getItem('ff-adult-verified') === '1';
}

function setAudience(audience = 'general') {
  audienceTabButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.audience === audience));
  onboardingConcernButtons.forEach((btn) => {
    const isMatch = (btn.dataset.audience || 'general') === audience;
    btn.hidden = !isMatch;
    btn.setAttribute('aria-hidden', String(!isMatch));
    btn.style.display = isMatch ? 'inline-flex' : 'none';
  });
}

let pendingConcern = null;
function openAdultGate(nextConcern) {
  pendingConcern = nextConcern;
  if (adultGateModal) adultGateModal.hidden = false;
}

function applyConcern(concern) {
  if (!concern) return;
  if (concernSelect) concernSelect.value = concern;
  setAudience(isAdultConcern(concern) ? 'adult' : 'general');
  onboardingConcernButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.concern === concern));
  if (onboardingConcernStatus) onboardingConcernStatus.textContent = `현재 카테고리: ${concern}`;
}

function syncConcernSelection(concern) {
  if (!concern) return false;
  if (isAdultConcern(concern) && !isAdultVerified()) {
    openAdultGate(concern);
    const fallback = '일반 궁합';
    if (concernSelect) concernSelect.value = fallback;
    applyConcern(fallback);
    return false;
  }
  applyConcern(concern);
  return true;
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
  const concern = (document.getElementById('concern')?.value || '결혼 운세').trim();
  const mode = (document.getElementById('analysisMode')?.value || 'ziwei').trim();
  const partnerName = (document.getElementById('partnerName')?.value || '').trim();
  const partnerBirth = (document.getElementById('partnerBirth')?.value || '').trim();
  const partnerBirthTime = (document.getElementById('partnerBirthTime')?.value || '').trim();

  if (!name) return alert('이름을 입력해줘.');
  if (!birth) return alert('생년월일을 입력해줘.');
  if (!birthPlace) return alert('출생지를 입력해줘.');
  if (isAdultConcern(concern)) {
    if (!partnerName) return alert('상대 이름을 입력해줘.');
    if (!partnerBirth) return alert('상대 생년월일을 입력해줘.');
  }

  saveIntake(name, birth, birthTime, birthPlace, concern, mode, {
    name: partnerName,
    birth: partnerBirth,
    birthTime: partnerBirthTime
  });
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

  // 최초 노출은 항상 일반 버전으로 시작
  setAudience('general');
  if (concernSelect && isAdultConcern(concernSelect.value)) {
    concernSelect.value = '일반 궁합';
    applyConcern('일반 궁합');
    syncConcernUI();
  }

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
  if (onboardingModeStatus) onboardingModeStatus.textContent = `현재 관점: ${label}`;

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
  const concern = concernSelect?.value || '결혼 운세';
  const meta = concernCopyMap[concern] || concernCopyMap['결혼 운세'];
  animateTrustCounter(meta.count);
  if (trustCounterTail) softSwapText(trustCounterTail, meta.counterTail);
  softSwapText(impactCopy, meta.headline);
  softSwapText(nameGuideLabel, meta.nameGuide);
  applyConcern(concern);
  const adult = isAdultConcern(concern);
  document.body.classList.toggle('adult-mode', adult);
  if (partnerFields) partnerFields.hidden = !adult;
  syncModeUI(analysisModeSelect?.value || 'ziwei');
}

onboardingModeButtons.forEach((btn) => {
  btn.addEventListener('click', () => syncModeUI(btn.dataset.mode));
});
audienceTabButtons.forEach((tab) => {
  tab.addEventListener('click', () => {
    const audience = tab.dataset.audience || 'general';
    if (audience === 'adult' && !isAdultVerified()) {
      openAdultGate('속궁합');
      return;
    }
    setAudience(audience);
    const firstVisible = onboardingConcernButtons.find((btn) => !btn.hidden);
    if (firstVisible) {
      syncConcernSelection(firstVisible.dataset.concern);
      syncConcernUI();
    }
  });
});

onboardingConcernButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    syncConcernSelection(btn.dataset.concern);
    syncConcernUI();
  });
});
analysisModeSelect?.addEventListener('change', () => syncModeUI(analysisModeSelect.value));
concernSelect?.addEventListener('change', () => {
  syncConcernSelection(concernSelect.value);
  syncConcernUI();
});
if (analysisModeSelect?.value) syncModeUI(analysisModeSelect.value);

onboardingStartBtn?.addEventListener('click', closeOnboarding);
onboardingPreviewBtn?.addEventListener('click', () => {
  closeOnboarding();
  window.location.href = '/ziwei.html';
});
firstVisitModal?.addEventListener('click', (e) => {
  if (e.target === firstVisitModal) closeOnboarding();
});

adultGateCancel?.addEventListener('click', () => {
  pendingConcern = null;
  if (adultGateModal) adultGateModal.hidden = true;
  if (concernSelect && isAdultConcern(concernSelect.value)) concernSelect.value = '일반 궁합';
  syncConcernUI();
});
adultGateConfirm?.addEventListener('click', () => {
  localStorage.setItem('ff-adult-verified', '1');
  if (pendingConcern && concernSelect) concernSelect.value = pendingConcern;
  if (adultGateModal) adultGateModal.hidden = true;
  pendingConcern = null;
  syncConcernUI();
});
adultGateModal?.addEventListener('click', (e) => {
  if (e.target === adultGateModal) adultGateCancel?.click();
});

setAudience('general');
syncConcernSelection(concernSelect?.value || '결혼 운세');
syncConcernUI();
openOnboardingIfNeeded();
