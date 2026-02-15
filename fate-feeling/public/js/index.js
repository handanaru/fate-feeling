const firstImpactForm = document.getElementById('firstImpactForm');
const trustCounter = document.getElementById('trustCounterValue');
const firstVisitModal = document.getElementById('firstVisitModal');
const hideOnboardingForever = document.getElementById('hideOnboardingForever');
const onboardingStartBtn = document.getElementById('onboardingStartBtn');
const onboardingPreviewBtn = document.getElementById('onboardingPreviewBtn');

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

function animateTrustCounter() {
  if (!trustCounter) return;
  const end = 12405;
  const duration = 1300;
  const startAt = performance.now();
  const start = 11890;
  const tick = (now) => {
    const ratio = Math.min(1, (now - startAt) / duration);
    const eased = 1 - Math.pow(1 - ratio, 3);
    const value = Math.round(start + (end - start) * eased);
    trustCounter.textContent = value.toLocaleString('ko-KR');
    if (ratio < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
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

onboardingStartBtn?.addEventListener('click', closeOnboarding);
onboardingPreviewBtn?.addEventListener('click', () => {
  closeOnboarding();
  window.location.href = '/ziwei.html';
});
firstVisitModal?.addEventListener('click', (e) => {
  if (e.target === firstVisitModal) closeOnboarding();
});

animateTrustCounter();
openOnboardingIfNeeded();
