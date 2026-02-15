const commonQuestionsBase = [
  { id: 'Q1', text: '상대방의 SNS나 프로필 메시지를 하루에도 몇 번씩 확인하게 된다.' },
  { id: 'Q2', text: '우리 관계가 어긋난 이유를 생각하다 보면 결국 내 탓인 것만 같다.' },
  { id: 'Q3', text: '힘들 때 누군가에게 내 감정을 털어놓기보다 혼자 삭이는 편이다.' },
  { id: 'Q4', text: '상대방과 좋았던 기억보다 마지막의 좋지 않았던 장면이 자꾸 떠오른다.' },
  { id: 'Q5', text: '다시 연락하고 싶지만, 거절당할까 봐 혹은 자존심 때문에 망설여진다.' },
  { id: 'Q6', text: '일상생활 중에도 문득문득 상대방과의 추억이 떠올라 집중하기 어렵다.' },
  { id: 'Q7', text: '우리는 서로 너무 달랐지만, 그래서 더 잘 맞을 수 있었다고 믿는다.' },
  { id: 'Q8', text: '지금의 이 아픔이 시간이 지나면 자연스럽게 해결될 것이라고 믿기 어렵다.' }
];

const troubleSpecificQ9toQ12 = {
  reunion: [
    { id: 'X9', text: '상대방과 헤어진 이유가 지금 생각해보면 충분히 고칠 수 있는 문제였다고 생각한다.' },
    { id: 'X10', text: '우리 사이에 남아있는 미해결 감정이 아직 서로를 당기고 있다고 느낀다.' },
    { id: 'X11', text: '상대방이 나를 잊어버렸을까 봐 두려운 마음이 크다.' },
    { id: 'X12', text: '다시 만난다면 이전과는 다른 방식으로 사랑할 준비가 되어 있다.' }
  ],
  crush: [
    { id: 'X9', text: '상대방의 사소한 행동 하나에 나한테 관심 있나?라는 기대를 자주 하게 된다.' },
    { id: 'X10', text: '우리 관계는 아직 시작도 안 했지만, 이미 깊은 인연인 것처럼 느껴질 때가 있다.' },
    { id: 'X11', text: '상대방 주변에 다른 이성이 생길까 봐 조급한 마음이 든다.' },
    { id: 'X12', text: '그 사람에게 내가 어떤 의미(친구, 이성 등)인지 확인받고 싶은 욕구가 강하다.' }
  ],
  timing: [
    { id: 'X9', text: '지금 내가 연락하면 상대방이 부담을 느낄까 봐 가장 걱정된다.' },
    { id: 'X10', text: '메시지를 보낼 때 단어 하나하나를 수십 번 고치고 고민하는 편이다.' },
    { id: 'X11', text: '연락을 먼저 기다리기보다 내가 주도적으로 판을 흔들고 싶은 마음이 있다.' },
    { id: 'X12', text: '지금이 아니면 영영 기회를 놓칠 것 같은 강력한 직감이 든다.' }
  ]
};

const modeMeta = {
  saju: { label: '사주', guide: '당신의 사주 흐름을 분석하기 위한 문항입니다. 현재 마음이 가는 대로 선택해 주세요.', lensTitle: '기운 흐름 분석' },
  tarot: { label: '타로', guide: '당신의 타로 흐름을 분석하기 위한 문항입니다. 현재 마음이 가는 대로 선택해 주세요.', lensTitle: '현재 카드 해석' },
  astro: { label: '점성술', guide: '당신의 점성술 흐름을 분석하기 위한 문항입니다. 현재 마음이 가는 대로 선택해 주세요.', lensTitle: '행성 에너지 흐름' },
  mbti: { label: 'MBTI', guide: '당신의 MBTI 흐름을 분석하기 위한 문항입니다. 현재 마음이 가는 대로 선택해 주세요.', lensTitle: '연애 성향 리포트' },
  ziwei: { label: '자미두수', guide: '당신의 자미두수 명반 흐름을 보기 위한 문항입니다. 내면의 기운 변화를 중심으로 선택해 주세요.', lensTitle: '12궁 명반 해석' }
};

const form = document.getElementById('testForm');
const submitBtn = document.getElementById('submitBtn');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const progressStar = document.getElementById('progressStar');
const modeHint = document.getElementById('modeHint');
const analysisTitle = document.getElementById('analysisTitle');
const modeButtons = [...document.querySelectorAll('.mode-btn, .scan-icon[data-mode]')];
const liveTicker = document.getElementById('liveTicker');
const recoveryMetric = document.getElementById('recoveryMetric');
const pullMetric = document.getElementById('pullMetric');
const scanIcons = [...document.querySelectorAll('.scan-icon')];
const backBtn = document.getElementById('backBtn');
const homeBtn = document.getElementById('homeBtn');

const intake = JSON.parse(localStorage.getItem('ff-intake') || '{}');
const concernLabelDisplay = intake.concern || '재회';

function normalizeTrouble(concern = '') {
  if (concern.includes('짝사랑') || concern.includes('썸')) return 'crush';
  if (concern.includes('연락')) return 'timing';
  // 취업/금전, MBTI 등은 별도 질문셋 전까지 기본셋으로 처리
  return 'reunion';
}

const troubleType = normalizeTrouble(concernLabelDisplay);
const commonQuestionMapping = {
  reunion: { Q1: '상대방의 SNS나 프로필 메시지를 하루에도 몇 번씩 확인하게 된다.', Q4: '상대방과 좋았던 기억보다 마지막의 좋지 않았던 장면이 자꾸 떠오른다.', Q5: '다시 연락하고 싶지만, 거절당할까 봐 혹은 자존심 때문에 망설여진다.', Q7: '우리는 서로 너무 달랐지만, 그래서 더 잘 맞을 수 있었다고 믿는다.' },
  crush: { Q1: '그 사람의 SNS나 프로필 메시지를 하루에도 몇 번씩 확인하게 된다.', Q4: '좋았던 상상보다 나를 대하던 차가운 말투가 더 오래 남는다.', Q5: '먼저 다가가고 싶지만, 어색해질까 봐 혹은 자존심 때문에 망설여진다.', Q7: '우린 잘 맞을 것 같은데, 그 미묘한 거리감이 더 신경 쓰인다.' },
  timing: { Q1: '메시지 읽음 표시나 마지막 접속 시간을 자주 확인하게 된다.', Q4: '대화가 끊겼던 마지막 순간이 반복해서 떠오른다.', Q5: '답장/선톡을 하고 싶지만, 타이밍이 아닐까 봐 망설여진다.', Q7: '우리의 텐션이 미묘하게 어긋난 채로 반복된다고 느낀다.' }
};

function buildCommonQuestions() {
  const map = commonQuestionMapping[troubleType] || commonQuestionMapping.reunion;
  return commonQuestionsBase.map((q) => ({ ...q, text: map[q.id] || q.text }));
}

function transformTroubleQuestionsByMode(baseQuestions, mode) {
  const prefixes = { tarot: '카드 해석 관점에서 보면, ', saju: '사주 흐름 기준으로, ', astro: '행성/관계 배치 기준으로, ', mbti: '성향/소통 패턴 기준으로, ', ziwei: '명반(12궁) 흐름 기준으로, ' };
  return baseQuestions.map((q) => ({ ...q, text: `${prefixes[mode] || ''}${q.text}` }));
}

function troubleLabel(type) {
  if (concernLabelDisplay) return concernLabelDisplay;
  if (type === 'crush') return '짝사랑/썸';
  if (type === 'timing') return '연락 타이밍';
  return '재회';
}

let selectedMode = null;
let currentIndex = 0;
let activeQuestions = [];
let answers = [];
let transitionLock = false;
const TOTAL_QUESTIONS = 12;

function animateScan(index = 0) {
  if (!scanIcons.length) return;
  scanIcons.forEach((el) => { el.classList.remove('scanning'); el.classList.toggle('active', el.dataset.mode === selectedMode); });
  const target = scanIcons.find((el) => el.dataset.mode === selectedMode) || scanIcons[index % scanIcons.length];
  if (!target) return;
  requestAnimationFrame(() => target.classList.add('scanning'));
}

function updateLiveEvidence(index = 0) {
  const solvedAnswers = answers.filter((v) => v !== null);
  const solved = solvedAnswers.length;
  const sum = solvedAnswers.reduce((acc, v) => acc + v, 0);
  const avg = solved ? sum / solved : 0;
  const recovery = Math.max(22, Math.min(96, Math.round((6 - avg) * 16 + solved * 2.2)));
  const pull = Math.max(18, Math.min(95, Math.round(avg * 14 + solved * 1.8)));
  if (recoveryMetric) recoveryMetric.textContent = String(recovery);
  if (pullMetric) pullMetric.textContent = String(pull);
  animateScan(index + solved);
  const tickerPool = ['사주 데이터 매칭 완료...', '타로 심볼 스캔 중...', '자미두수 궁위 연산 중...', 'MBTI 소통 패턴 교차 분석 중...', '싱크로율 분석 중...'];
  if (liveTicker) liveTicker.textContent = tickerPool[(solved + index) % tickerPool.length];
}

function likertLabel(score) { return ['전혀 아니다', '아니다', '보통이다', '그렇다', '매우 그렇다'][score - 1]; }

function renderQuestion(index) {
  const q = activeQuestions[index];
  const card = document.createElement('div');
  card.className = 'question-card slide-in';
  const isSpecial = index >= 8;
  card.innerHTML = `<div class="small question-context">${modeMeta[selectedMode].label} 관점 설문 ${isSpecial ? `· 특화 문항 (${q.id})` : `· 공통 문항 (${q.id})`} · 고민: ${troubleLabel(troubleType)}</div><h3>${index + 1}. ${q.text}</h3><div class="options">${[1, 2, 3, 4, 5].map((score) => `<label class="option"><input type="radio" name="q" value="${score}" />${score}점 · ${likertLabel(score)}</label>`).join('')}</div>`;

  card.querySelectorAll('input').forEach((input) => {
    input.addEventListener('change', (e) => {
      if (transitionLock) return;
      transitionLock = true;
      card.querySelectorAll('.option').forEach((opt) => opt.classList.remove('selected'));
      e.target.closest('.option')?.classList.add('selected');
      answers[index] = Number(e.target.value);
      updateProgress();
      updateLiveEvidence(index);
      if (index < activeQuestions.length - 1) {
        card.classList.add('slide-out');
        setTimeout(() => { currentIndex += 1; form.innerHTML = ''; renderQuestion(currentIndex); transitionLock = false; }, 500);
      } else {
        submitBtn.style.display = 'inline-block';
        transitionLock = false;
      }
    });
  });

  form.appendChild(card);
}

function updateProgress() {
  const solved = answers.filter((x) => x !== null).length;
  const pct = Math.min(100, Math.round((solved / TOTAL_QUESTIONS) * 100));
  progressText.textContent = `${solved} / ${TOTAL_QUESTIONS}`;
  progressFill.style.width = `${pct}%`;
  if (progressStar) {
    progressStar.style.left = `calc(${pct}% - 10px)`;
  }
}

function startTest() {
  if (!selectedMode) return;
  activeQuestions = [...buildCommonQuestions(), ...transformTroubleQuestionsByMode(troubleSpecificQ9toQ12[troubleType] || troubleSpecificQ9toQ12.reunion, selectedMode)];
  answers = Array(activeQuestions.length).fill(null);
  currentIndex = 0;
  submitBtn.style.display = 'none';
  form.innerHTML = '';
  transitionLock = false;
  updateProgress();
  updateLiveEvidence(0);
  renderQuestion(0);
}

function selectMode(mode, withPulse = false) {
  if (!modeMeta[mode]) return;
  selectedMode = mode;

  modeButtons.forEach((b) => {
    b.classList.remove('active');
    b.classList.remove('clicked-pulse');
    if (b.dataset.mode === mode) b.classList.add('active');
  });

  const targetBtn = modeButtons.find((b) => b.dataset.mode === mode);
  if (withPulse && targetBtn) {
    requestAnimationFrame(() => {
      targetBtn.classList.add('clicked-pulse');
      setTimeout(() => targetBtn.classList.remove('clicked-pulse'), 520);
    });
  }

  const concern = troubleLabel(troubleType);
  if (analysisTitle) analysisTitle.textContent = `[${concern}] 운세 분석 중`;
  modeHint.innerHTML = `${modeMeta[selectedMode].guide} · <span class="concern-pill">현재 고민: ${concern}</span>`;
  startTest();
}

function confirmLeaveIfNeeded() {
  const hasProgress = answers.some((v) => v !== null);
  if (!hasProgress) return true;
  return window.confirm('지금 나가면 분석 내용이 저장되지 않아. 정말 나갈까?');
}

backBtn?.addEventListener('click', () => {
  if (!confirmLeaveIfNeeded()) return;
  history.back();
});
homeBtn?.addEventListener('click', (e) => {
  if (!confirmLeaveIfNeeded()) {
    e.preventDefault();
  }
});

modeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    selectMode(btn.dataset.mode, true);
  });
});

submitBtn.addEventListener('click', () => {
  if (!selectedMode) return alert('먼저 테스트 관점을 선택해줘.');
  if (answers.some((v) => v === null)) return alert('모든 문항을 선택해줘.');

  const answerById = {};
  activeQuestions.forEach((q, idx) => { answerById[q.id] = answers[idx]; });

  const anxiety = ['Q1', 'Q2', 'Q3', 'Q4'].reduce((sum, key) => sum + (answerById[key] || 0), 0);
  const longing = ['Q5', 'Q6', 'Q7', 'Q8'].reduce((sum, key) => sum + (answerById[key] || 0), 0);
  const specialIds = activeQuestions.slice(8).map((q) => q.id);
  const lensIntensity = specialIds.reduce((sum, key) => sum + (answerById[key] || 0), 0);
  const total = anxiety + longing + lensIntensity;
  const recoveryIndex = Math.max(20, Math.min(98, Math.round((30 - anxiety) * 1.8 + (26 - longing) * 1.2)));
  const reunionForce = Math.max(12, Math.min(96, Math.round((longing + lensIntensity) * 1.8)));
  const emotionTemp = Math.max(24, Math.min(92, Math.round((anxiety * 1.9) + (longing * 1.4))));
  let type = '균형 회복형';
  if (total >= 47) type = '감정 과부하형';
  else if (total >= 36) type = '확신 탐색형';

  localStorage.setItem('ff-result', JSON.stringify({
    mode: selectedMode, modeLabel: modeMeta[selectedMode].label, lensTitle: modeMeta[selectedMode].lensTitle,
    troubleType, troubleLabel: troubleLabel(troubleType), answers, answerById, anxiety, longing, lensIntensity,
    total, recoveryIndex, reunionForce, emotionTemp, type, createdAt: Date.now()
  }));

  const loader = document.getElementById('preResultLoader');
  const metricA = document.getElementById('loaderMetricA');
  const metricB = document.getElementById('loaderMetricB');
  const preResultMessage = document.getElementById('preResultMessage');
  if (!loader) return (location.href = '/result.html');

  if (preResultMessage) {
    const who = intake.name || '고객';
    preResultMessage.textContent = `${who}님의 사주 명반과 타로 배열을 대조하여 융합 분석 중입니다...`;
  }

  loader.hidden = false;
  const startedAt = Date.now();
  const timer = setInterval(() => {
    const ratio = Math.min(1, (Date.now() - startedAt) / 4000);
    if (metricA) metricA.textContent = String(Math.round(42 + (recoveryIndex - 42) * ratio));
    if (metricB) metricB.textContent = String(Math.round(57 + (reunionForce - 57) * ratio));
  }, 120);

  setTimeout(() => { clearInterval(timer); location.href = '/result.html'; }, 4000);
});

const initialMode = modeMeta[intake.mode] ? intake.mode : 'ziwei';
selectMode(initialMode, false);
updateProgress();