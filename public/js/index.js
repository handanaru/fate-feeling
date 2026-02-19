const firstImpactForm = document.getElementById('firstImpactForm');
const enterWebtoonModeBtn = document.getElementById('enterWebtoonMode');
const enterReportModeBtn = document.getElementById('enterReportMode');
const modeCurrentText = document.getElementById('modeCurrentText');
const trustCounter = document.getElementById('trustCounterValue');
const trustCounterText = document.getElementById('trustCounterText');
const trustCounterTail = document.getElementById('trustCounterTail');
const impactCopy = document.getElementById('impactCopy');
const concernSelect = document.getElementById('concern');
const nameGuideLabel = document.getElementById('nameGuideLabel');
const startSubmitBtn = document.getElementById('startSubmitBtn');
const onboardingConcernButtons = [...document.querySelectorAll('#onboardingConcernButtons [data-concern]')];
const concernGridMainButtons = [...document.querySelectorAll('#concernGridMain [data-concern]')];
const subConcernWrap = document.getElementById('subConcernWrap');
const subConcernButtons = document.getElementById('subConcernButtons');
const subConcernTitle = document.getElementById('subConcernTitle');
const onboardingConcernStatus = document.getElementById('onboardingConcernStatus');
const audienceTabButtons = [...document.querySelectorAll('#audienceTabs [data-audience]')];
const firstVisitModal = document.getElementById('firstVisitModal');
const hideOnboardingForever = document.getElementById('hideOnboardingForever');
const onboardingStartBtn = document.getElementById('onboardingStartBtn');
const analysisModeSelect = document.getElementById('analysisMode');
const onboardingModeButtons = [...document.querySelectorAll('#onboardingModeButtons [data-mode]')];
const analysisModeGridButtons = [...document.querySelectorAll('#analysisModeGrid [data-mode]')];
const reportViewSelect = document.getElementById('reportViewMode');
const reportViewButtons = [...document.querySelectorAll('#reportViewGrid [data-result-view]')];
const webtoonStartBtn = document.getElementById('webtoonStartBtn');
const firstImpactSection = document.getElementById('firstImpact');
const webtoonStepNav = document.getElementById('webtoonStepNav');
const webtoonStepHint = document.getElementById('webtoonStepHint');
const webtoonPrevBtn = document.getElementById('webtoonPrevBtn');
const webtoonNextBtn = document.getElementById('webtoonNextBtn');
const onboardingModeStatus = document.getElementById('onboardingModeStatus');
const onboardingTotalFortuneBtn = document.getElementById('onboardingTotalFortuneBtn');
const modeCard = document.getElementById('modeCard');
const modeCardTitle = document.getElementById('modeCardTitle');
const modeCardIcon = document.getElementById('modeCardIcon');
const modeCardBg = document.getElementById('modeCardBg');
const myPageBtn = document.getElementById('myPageBtn');
const adultQuickBtn = document.getElementById('adultQuickBtn');
const entryHeroTitle = document.getElementById('entryHeroTitle');
const entryHeroSub = document.getElementById('entryHeroSub');
const entryHeroChips = document.getElementById('entryHeroChips');
const entryEyebrow = document.getElementById('entryEyebrow');
const adultGateModal = document.getElementById('adultGateModal');
const adultGateConfirm = document.getElementById('adultGateConfirm');
const adultGateCancel = document.getElementById('adultGateCancel');
const loveStateModal = document.getElementById('loveStateModal');
const loveStateButtons = [...document.querySelectorAll('#loveStateButtons [data-state]')];
const loveStateCancel = document.getElementById('loveStateCancel');
const partnerFields = document.getElementById('partnerFields');
const selfFields = document.getElementById('selfFields');
const dualStepNav = document.getElementById('dualStepNav');
const dualStepButtons = [...document.querySelectorAll('#dualStepNav [data-step]')];

function saveIntake(name, birth, birthTime, birthPlace, concern, mode, partner = {}, gender = '기타', loveState = '', resultViewMode = 'report') {
  const prev = JSON.parse(localStorage.getItem('ff-intake') || '{}');
  const normalizedBirthTime = birthTime || prev.birthTime || '모름(입력 안 함)';
  const payload = {
    ...prev,
    name,
    gender: gender || prev.gender || '기타',
    birth: birth || prev.birth || '2000-01-01',
    birthTime: normalizedBirthTime,
    birthTimeUnknown: normalizedBirthTime.includes('모름'),
    birthPlace: birthPlace || prev.birthPlace || '서울특별시',
    birthCity: birthPlace || prev.birthCity || prev.birthPlace || '서울특별시',
    concern: concern || prev.concern || '일반 궁합',
    mode: mode || prev.mode || 'saju',
    mbti: prev.mbti || 'INFP',
    partnerName: partner.name || prev.partnerName || '',
    partnerGender: partner.gender || prev.partnerGender || '기타',
    partnerBirth: partner.birth || prev.partnerBirth || '',
    partnerBirthTime: partner.birthTime || prev.partnerBirthTime || '',
    partnerBirthTimeUnknown: !!partner.birthTimeUnknown,
    partnerBirthPlace: partner.birthPlace || prev.partnerBirthPlace || '',
    partnerBirthCity: partner.birthPlace || prev.partnerBirthCity || prev.partnerBirthPlace || '',
    loveState: loveState || prev.loveState || '',
    resultViewMode: resultViewMode || prev.resultViewMode || 'report',
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
  '금전/재산': {
    count: 13240,
    counterTail: '명이 재물운 흐름과 투자 타이밍을 점검했습니다.',
    headline: '돈의 흐름과 축적 패턴, 기회 타이밍을 분석합니다.',
    nameGuide: '당신의 이름을 입력해 재물운 분석을 시작하세요.',
    ctaGoal: '재물 운'
  },
  '취업/직장': {
    count: 12870,
    counterTail: '명이 취업·직장 성공 가능성을 확인했습니다.',
    headline: '합격운·이직운·조직 적응도를 종합 분석합니다.',
    nameGuide: '당신의 이름을 입력해 커리어 운세를 확인하세요.',
    ctaGoal: '직장 운'
  },
  '사업/창업': {
    count: 9140,
    counterTail: '명이 사업 성공 타이밍을 확인했습니다.',
    headline: '창업 리스크와 확장 시점을 현실적으로 진단합니다.',
    nameGuide: '당신의 이름을 입력해 사업 운세를 확인하세요.',
    ctaGoal: '사업 운'
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
  const key = concernSelect?.value || '일반 궁합';
  return concernCopyMap[key] || concernCopyMap['일반 궁합'];
}

const ALWAYS_PAIR_CONCERNS = ['일반 궁합', '결혼 운세', '속궁합', '키스 궁합'];

function isAdultConcern(concern = '') {
  return concern === '속궁합' || concern === '키스 궁합';
}

function needsLoveState(concern = '') {
  return concern === '애정운';
}

function getLoveState() {
  return localStorage.getItem('ff-love-state') || '';
}

function requiresPartner(concern = '', state = getLoveState()) {
  if (ALWAYS_PAIR_CONCERNS.includes(concern)) return true;
  if (needsLoveState(concern)) return state && state !== 'solo';
  return false;
}

function isAdultVerified() {
  return localStorage.getItem('ff-adult-verified') === '1';
}

function setDualStep(step = 'self') {
  if (!dualStepNav) return;
  dualStepButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.step === step));
  if (selfFields) {
    selfFields.hidden = step !== 'self';
    if (step === 'self') {
      selfFields.classList.remove('form-slide');
      requestAnimationFrame(() => selfFields.classList.add('form-slide'));
    }
  }
  if (partnerFields) {
    partnerFields.hidden = step !== 'partner';
    if (step === 'partner') {
      partnerFields.classList.remove('form-slide');
      requestAnimationFrame(() => partnerFields.classList.add('form-slide'));
    }
  }
}

function updateInputLayout(concern = concernSelect?.value || '일반 궁합') {
  const state = getLoveState();
  const needPartner = requiresPartner(concern, state);
  if (dualStepNav) dualStepNav.hidden = !needPartner;
  if (!needPartner) {
    if (selfFields) selfFields.hidden = false;
    if (partnerFields) partnerFields.hidden = true;
    return;
  }
  setDualStep('self');
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

const concernSubMap = {
  compat: ['일반 궁합', '결혼 운세'],
  love: ['애정운', '재회운', '커플운', '썸운'],
  adult: ['속궁합', '키스 궁합']
};

function concernGroupFromValue(concern = '') {
  if (['일반 궁합', '결혼 운세'].includes(concern)) return 'compat';
  if (['애정운', '재회운', '커플운', '썸운'].includes(concern)) return 'love';
  if (['속궁합', '키스 궁합'].includes(concern)) return 'adult';
  if (concern === '금전/재산') return 'money';
  if (concern === '취업/직장') return 'career';
  if (concern === '사업/창업') return 'biz';
  return 'compat';
}

function renderSubConcerns(currentConcern) {
  const group = concernGroupFromValue(currentConcern);
  const options = concernSubMap[group] || [];
  if (!subConcernWrap || !subConcernButtons || !subConcernTitle) return;
  if (!options.length) {
    subConcernWrap.hidden = true;
    subConcernButtons.innerHTML = '';
    return;
  }
  subConcernWrap.hidden = false;
  subConcernTitle.textContent = '세부 선택';
  subConcernButtons.innerHTML = options.map((opt) => `<button type="button" data-concern="${opt}" class="${opt === currentConcern ? 'active' : ''}">${opt}</button>`).join('');
  [...subConcernButtons.querySelectorAll('[data-concern]')].forEach((btn) => {
    btn.addEventListener('click', () => {
      syncConcernSelection(btn.dataset.concern);
      syncConcernUI();
    });
  });
}

function applyConcern(concern) {
  if (!concern) return;
  if (concernSelect) concernSelect.value = concern;
  setAudience(isAdultConcern(concern) ? 'adult' : 'general');
  onboardingConcernButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.concern === concern));
  concernGridMainButtons.forEach((btn) => {
    const group = btn.dataset.group || 'compat';
    const currentGroup = concernGroupFromValue(concern);
    btn.classList.toggle('active', group === currentGroup);
  });
  renderSubConcerns(concern);
  if (onboardingConcernStatus) onboardingConcernStatus.textContent = `현재 고민: ${concern}`;
}

function syncConcernSelection(concern) {
  if (!concern) return false;
  if (isAdultConcern(concern) && !isAdultVerified()) {
    openAdultGate(concern);
    const fallback = '일반 궁합';
    if (concernSelect) concernSelect.value = fallback;
    applyConcern(fallback);
    updateInputLayout(fallback);
    return false;
  }
  if (needsLoveState(concern) && !getLoveState()) {
    if (loveStateModal) loveStateModal.hidden = false;
  }
  applyConcern(concern);
  updateInputLayout(concern);
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

function bindFlowReactiveInput() {
  if (!firstImpactForm || !modeCard) return;
  const fields = [...firstImpactForm.querySelectorAll('input, select')];
  let t = null;
  fields.forEach((el) => {
    el.addEventListener('input', () => {
      modeCard.classList.add('flow-active');
      clearTimeout(t);
      t = setTimeout(() => modeCard.classList.remove('flow-active'), 360);
    });
    el.addEventListener('change', () => {
      modeCard.classList.add('flow-active');
      clearTimeout(t);
      t = setTimeout(() => modeCard.classList.remove('flow-active'), 420);
    });
  });
}

function formatBirthInput(raw = '') {
  const digits = String(raw || '').replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}

function formatTimeInput(raw = '') {
  const value = String(raw || '').trim();
  if (value.includes('모름')) return '모름';
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  let hh = Number(digits.slice(0, 2));
  let mm = Number(digits.slice(2, 4) || '0');
  if (!Number.isFinite(hh)) hh = 0;
  if (!Number.isFinite(mm)) mm = 0;
  hh = Math.max(0, Math.min(23, hh));
  mm = Math.max(0, Math.min(59, mm));
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

function bindBirthTimeAutoFormat() {
  const birthEl = document.getElementById('birth');
  const partnerBirthEl = document.getElementById('partnerBirth');
  const birthTimeEl = document.getElementById('birthTime');
  const partnerBirthTimeEl = document.getElementById('partnerBirthTime');

  const bind = (el, formatter) => {
    if (!el) return;
    el.addEventListener('input', () => {
      const caretEnd = el.selectionStart === el.value.length;
      el.value = formatter(el.value);
      if (caretEnd) el.setSelectionRange(el.value.length, el.value.length);
    });
    el.addEventListener('blur', () => {
      el.value = formatter(el.value);
    });
  };

  bind(birthEl, formatBirthInput);
  bind(partnerBirthEl, formatBirthInput);
  bind(birthTimeEl, formatTimeInput);
  bind(partnerBirthTimeEl, formatTimeInput);
}

let sparkThrottle = 0;
window.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - sparkThrottle < 45) return;
  sparkThrottle = now;
  spawnSpark(e.clientX, e.clientY);
});

function makeDirectSajuResult(concern = '일반 궁합', mode = 'saju') {
  const byConcern = {
    '일반 궁합': { finalScore: 78, recoveryIndex: 76, reunionForce: 79, emotionTemp: 74, gradeBand: 'B' },
    '결혼 운세': { finalScore: 80, recoveryIndex: 77, reunionForce: 82, emotionTemp: 75, gradeBand: 'B' },
    '금전/재산': { finalScore: 76, recoveryIndex: 70, reunionForce: 74, emotionTemp: 72, gradeBand: 'B' },
    '취업/직장': { finalScore: 74, recoveryIndex: 73, reunionForce: 71, emotionTemp: 70, gradeBand: 'B' },
    '사업/창업': { finalScore: 75, recoveryIndex: 72, reunionForce: 73, emotionTemp: 71, gradeBand: 'B' },
    '애정운': { finalScore: 79, recoveryIndex: 78, reunionForce: 80, emotionTemp: 76, gradeBand: 'B' },
    '재회운': { finalScore: 72, recoveryIndex: 74, reunionForce: 68, emotionTemp: 73, gradeBand: 'C' },
    '속궁합': { finalScore: 77, recoveryIndex: 75, reunionForce: 78, emotionTemp: 79, gradeBand: 'B' },
    '키스 궁합': { finalScore: 76, recoveryIndex: 74, reunionForce: 77, emotionTemp: 78, gradeBand: 'B' }
  };
  const pick = byConcern[concern] || byConcern['일반 궁합'];
  return {
    ok: true,
    troubleType: concern,
    troubleLabel: concern,
    mode,
    modeLabel: modeLabel(mode),
    ...pick
  };
}

firstImpactForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = (document.getElementById('name')?.value || '').trim();
  const birth = (document.getElementById('birth')?.value || '').trim();
  const birthTime = (document.getElementById('birthTime')?.value || '').trim();
  const birthPlace = (document.getElementById('birthPlace')?.value || '').trim();
  const concern = (document.getElementById('concern')?.value || '일반 궁합').trim();
  const mode = (document.getElementById('analysisMode')?.value || 'saju').trim();
  const gender = (document.getElementById('gender')?.value || '기타').trim();
  const partnerName = (document.getElementById('partnerName')?.value || '').trim();
  const partnerGender = (document.getElementById('partnerGender')?.value || '기타').trim();
  const partnerBirth = (document.getElementById('partnerBirth')?.value || '').trim();
  const partnerBirthTime = (document.getElementById('partnerBirthTime')?.value || '').trim();
  const partnerBirthTimeUnknown = !!document.getElementById('partnerBirthTimeUnknown')?.checked;
  const partnerBirthPlace = (document.getElementById('partnerBirthPlace')?.value || '').trim();
  const loveState = getLoveState();
  const resultViewMode = (reportViewSelect?.value || localStorage.getItem('ff-result-view-mode') || 'report').trim();

  if (!name) return alert('이름을 입력해줘.');
  if (!birth) return alert('생년월일을 입력해줘.');
  if (!birthPlace) return alert('출생지를 입력해줘.');
  if (needsLoveState(concern) && !loveState) {
    if (loveStateModal) loveStateModal.hidden = false;
    return alert('먼저 현재 연애 상태를 선택해줘.');
  }
  if (requiresPartner(concern, loveState)) {
    if (!partnerName) return alert('상대 이름을 입력해줘.');
    if (!partnerBirth) return alert('상대 생년월일을 입력해줘.');
    if (!partnerBirthPlace) return alert('상대 출생지를 입력해줘.');
  }

  saveIntake(name, birth, birthTime, birthPlace, concern, mode, {
    name: partnerName,
    gender: partnerGender,
    birth: partnerBirth,
    birthTime: partnerBirthTime,
    birthTimeUnknown: partnerBirthTimeUnknown,
    birthPlace: partnerBirthPlace
  }, gender, loveState, resultViewMode);

  localStorage.setItem('ff-result-view-mode', resultViewMode);

  // 사주 관점은 설문을 거치지 않고 만세력 기반으로 바로 리포트 진입
  if (mode === 'saju') {
    localStorage.setItem('ff-result', JSON.stringify(makeDirectSajuResult(concern, mode)));
    window.location.replace('/result.html');
    return;
  }

  window.location.replace('/test.html');
});

function todayKey() {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' }); // YYYY-MM-DD
}

function closeOnboarding() {
  if (!firstVisitModal) return;
  firstVisitModal.hidden = true;
  if (hideOnboardingForever?.checked) {
    localStorage.setItem('ff-hide-onboarding-date', todayKey());
  }
}

function openOnboardingIfNeeded() {
  if (!firstVisitModal) return;
  const hiddenDate = localStorage.getItem('ff-hide-onboarding-date');
  const legacyHide = localStorage.getItem('ff-hide-onboarding') === '1';
  const hideToday = hiddenDate === todayKey() || legacyHide;
  if (hideToday) return;

  if (hideOnboardingForever) hideOnboardingForever.checked = false;

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
  vedic: { title: 'VEDIC', icon: '🇮🇳' },
  japan: { title: 'WAFU', icon: '🇯🇵' }
};

function modeLabel(mode) {
  return ({ saju: '사주', tarot: '타로', ziwei: '자미두수', astro: '점성술', vedic: '인도관점', japan: '일본관점' }[mode] || '자미두수');
}

function syncReportViewUI(view = 'report') {
  const next = view === 'webtoon' ? 'webtoon' : 'report';
  if (reportViewSelect) reportViewSelect.value = next;
  reportViewButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.resultView === next));
  localStorage.setItem('ff-result-view-mode', next);
}

function setExperienceMode(mode = 'webtoon') {
  const next = mode === 'report' ? 'report' : 'webtoon';
  localStorage.setItem('ff-experience-mode', next);
  document.body.classList.toggle('experience-report', next === 'report');
  document.body.classList.toggle('experience-webtoon', next === 'webtoon');
  if (modeCurrentText) modeCurrentText.textContent = next === 'webtoon' ? '웹툰 모드' : '정통 리포트 모드';
  syncReportViewUI(next === 'webtoon' ? 'webtoon' : 'report');
}

const webtoonFieldSteps = [
  { key: 'name', label: '먼저 이름을 알려줘.', validate: () => !!document.getElementById('name')?.value.trim() },
  { key: 'birth', label: '생년월일을 입력해줘.', validate: () => !!document.getElementById('birth')?.value.trim() },
  { key: 'birthTime', label: '태어난 시간을 입력해줘. 모르면 모름으로 적어도 돼.', validate: () => true },
  { key: 'gender', label: '성별을 선택해줘.', validate: () => !!document.getElementById('gender')?.value.trim() },
  { key: 'birthPlace', label: '출생지를 입력해줘.', validate: () => !!document.getElementById('birthPlace')?.value.trim() },
  { key: 'concernGridMain', label: '오늘 어떤 고민을 풀어볼까?', validate: () => !!document.getElementById('concern')?.value.trim() },
  { key: 'analysisModeGrid', label: '어떤 관점으로 분석할까?', validate: () => !!document.getElementById('analysisMode')?.value.trim() }
];
let webtoonStepIndex = 0;

function applyWebtoonStepUI() {
  if (!firstImpactForm) return;
  const step = webtoonFieldSteps[webtoonStepIndex];
  if (!step) return;
  firstImpactForm.dataset.activeField = step.key;
  if (webtoonStepHint) webtoonStepHint.textContent = `[${webtoonStepIndex + 1}/${webtoonFieldSteps.length}] ${step.label}`;
  if (webtoonPrevBtn) webtoonPrevBtn.disabled = webtoonStepIndex <= 0;
  if (webtoonNextBtn) webtoonNextBtn.textContent = webtoonStepIndex >= webtoonFieldSteps.length - 1 ? '결과 보기' : '다음';
  const el = document.getElementById(step.key);
  if (el && typeof el.focus === 'function') setTimeout(() => el.focus(), 120);
}

function setInputPresentation(mode = 'webtoon') {
  if (!firstImpactSection || !firstImpactForm) return;
  firstImpactSection.hidden = false;
  const isWebtoon = mode === 'webtoon';
  firstImpactSection.classList.toggle('as-report-sheet', !isWebtoon);
  firstImpactForm.classList.toggle('webtoon-question-mode', isWebtoon);
  if (webtoonStepNav) webtoonStepNav.hidden = !isWebtoon;
  if (startSubmitBtn) startSubmitBtn.hidden = isWebtoon;
  if (isWebtoon) {
    webtoonStepIndex = 0;
    applyWebtoonStepUI();
  } else {
    delete firstImpactForm.dataset.activeField;
  }
}

webtoonPrevBtn?.addEventListener('click', () => {
  if (webtoonStepIndex <= 0) return;
  webtoonStepIndex -= 1;
  applyWebtoonStepUI();
});

webtoonNextBtn?.addEventListener('click', () => {
  const step = webtoonFieldSteps[webtoonStepIndex];
  if (!step) return;
  if (typeof step.validate === 'function' && !step.validate()) {
    return alert('먼저 현재 질문에 답해줘.');
  }
  if (webtoonStepIndex >= webtoonFieldSteps.length - 1) {
    firstImpactForm.requestSubmit();
    return;
  }
  webtoonStepIndex += 1;
  applyWebtoonStepUI();
});

function syncModeUI(mode) {
  if (!mode) return;
  if (analysisModeSelect) analysisModeSelect.value = mode;
  onboardingModeButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.mode === mode));
  analysisModeGridButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.mode === mode));
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

function updateEntryHero(concern, mode) {
  const iconByConcern = {
    '일반 궁합': '❤️', '결혼 운세': '💍', '금전/재산': '💰', '취업/직장': '💼', '사업/창업': '🚀',
    '애정운': '🌹', '재회운': '🌈', '속궁합': '🔞', '키스 궁합': '💋'
  };
  const icon = iconByConcern[concern] || '✨';
  const modeText = modeLabel(mode || 'saju');
  if (entryEyebrow) entryEyebrow.textContent = '🌠 THE FLOW · 정보 입력';
  if (entryHeroTitle) entryHeroTitle.textContent = `${icon} ${modeText}로 분석하는 ${concern}`;
  if (entryHeroSub) entryHeroSub.textContent = '선택한 고민 기준으로 정확히 분석할게. 먼저 입력 정보를 확인해줘.';
  if (entryHeroChips) {
    entryHeroChips.innerHTML = `<span class="hero-chip">#${concern.replace(/\s/g, '')}</span><span class="hero-chip">#${modeText}</span><span class="hero-chip">#입력1단계</span>`;
  }
}

function syncConcernUI() {
  const concern = concernSelect?.value || '일반 궁합';
  const meta = concernCopyMap[concern] || concernCopyMap['일반 궁합'];
  animateTrustCounter(meta.count);
  if (trustCounterTail) softSwapText(trustCounterTail, meta.counterTail);
  softSwapText(impactCopy, meta.headline);
  softSwapText(nameGuideLabel, meta.nameGuide);
  applyConcern(concern);
  const adult = isAdultConcern(concern);
  document.body.classList.toggle('adult-mode', adult);
  updateInputLayout(concern);
  const state = getLoveState();
  if (needsLoveState(concern) && onboardingConcernStatus) {
    const stateLabel = ({ solo: '완전한 솔로', crush: '썸/짝사랑', dating: '연애 중', reunion: '이별/재회 고민' }[state] || '미선택');
    onboardingConcernStatus.textContent = `현재 고민: ${concern} · 상태: ${stateLabel}`;
  }
  updateEntryHero(concern, analysisModeSelect?.value || 'saju');
  syncModeUI(analysisModeSelect?.value || 'saju');
}

dualStepButtons.forEach((btn) => {
  btn.addEventListener('click', () => setDualStep(btn.dataset.step || 'self'));
});
document.getElementById('partnerBirthTimeUnknown')?.addEventListener('change', (e) => {
  const input = document.getElementById('partnerBirthTime');
  if (!input) return;
  input.disabled = e.target.checked;
  if (e.target.checked) input.value = '모름';
  else if (input.value === '모름') input.value = '';
});

onboardingModeButtons.forEach((btn) => {
  btn.addEventListener('click', () => syncModeUI(btn.dataset.mode));
});
analysisModeGridButtons.forEach((btn) => {
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
concernGridMainButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const group = btn.dataset.group || 'compat';
    const concern = btn.dataset.concern;
    if (!concern) return;
    const options = concernSubMap[group] || [];
    const nextConcern = options.length ? options[0] : concern;
    syncConcernSelection(nextConcern);
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

loveStateButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const state = btn.dataset.state;
    if (!state) return;
    localStorage.setItem('ff-love-state', state);
    if (loveStateModal) loveStateModal.hidden = true;
    updateInputLayout(concernSelect?.value || '애정운');
    syncConcernUI();
  });
});
loveStateCancel?.addEventListener('click', () => {
  if (loveStateModal) loveStateModal.hidden = true;
});
loveStateModal?.addEventListener('click', (e) => {
  if (e.target === loveStateModal) loveStateCancel?.click();
});

myPageBtn?.addEventListener('click', () => {
  location.href = '/fortune-reports.html';
});
// hero CTA removed: entry header is now informational only.
adultQuickBtn?.addEventListener('click', () => {
  syncConcernSelection('속궁합');
  syncConcernUI();
  if (firstVisitModal) firstVisitModal.hidden = false;
});

onboardingTotalFortuneBtn?.addEventListener('click', () => {
  if (firstVisitModal) firstVisitModal.hidden = true;
  location.href = '/total-fortune.html';
});

setAudience('general');
bindFlowReactiveInput();
bindBirthTimeAutoFormat();
syncConcernSelection(concernSelect?.value || '일반 궁합');
syncConcernUI();
openOnboardingIfNeeded();


enterWebtoonModeBtn?.addEventListener('click', () => {
  setExperienceMode('webtoon');
  setInputPresentation('webtoon');
  firstImpactSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
enterReportModeBtn?.addEventListener('click', () => {
  setExperienceMode('report');
  setInputPresentation('report');
  firstImpactSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

reportViewButtons.forEach((btn) => {
  btn.addEventListener('click', () => syncReportViewUI(btn.dataset.resultView || 'report'));
});

if (webtoonStartBtn) {
  webtoonStartBtn.addEventListener('click', () => {
    setExperienceMode('webtoon');
    setInputPresentation('webtoon');
    firstImpactSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => document.getElementById('name')?.focus(), 260);
  });
}

if (reportViewSelect) {
  const preferred = localStorage.getItem('ff-experience-mode') || localStorage.getItem('ff-result-view-mode') || reportViewSelect.value || 'webtoon';
  setExperienceMode(preferred);
  if (firstImpactSection) firstImpactSection.hidden = true;
}
