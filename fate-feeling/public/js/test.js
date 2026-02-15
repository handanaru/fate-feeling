const categoryQuestions = {
  '결혼 운세': [
    '결혼을 생각할 때 본인이 가장 포기할 수 없는 배우자의 조건은 무엇인가요?',
    '본인이 생각하는 이상적인 결혼 생활의 모습은 어느 쪽에 가깝나요? (안정 vs 변화)',
    '결혼 후 경제권 관리는 어떤 방식을 선호하시나요?',
    '상대방의 가족 문제에 대해 본인은 얼마나 단호하게 대처할 수 있나요?',
    '자녀 계획에 대해 본인과 상대방의 생각이 다를 경우, 어떻게 조율하고 싶으신가요?',
    '결혼 준비 과정에서 발생하는 마찰을 맞춰가는 과정으로 보시나요?',
    '나에게 결혼이란 인생의 필수인가요, 아니면 선택인가요?',
    '배우자가 경제적 위기를 겪더라도 끝까지 신뢰를 유지할 자신이 있나요?',
    '명절이나 집안 행사 등 전통적인 가족 문화에 대해 어떻게 생각하시나요?',
    '결혼 후에도 개인적인 시간과 취미 생활이 얼마나 보장되어야 한다고 생각하시나요?',
    '내가 꿈꾸는 결혼식의 규모나 스타일은 어떤가요?',
    '현재 본인의 심리 상태는 결혼을 할 준비가 충분히 되었다고 느끼시나요?'
  ],
  '일반 궁합': [
    '상대방과 대화할 때 소통이 잘 통한다고 느끼는 순간은 언제인가요?',
    '두 사람의 성격 차이가 보완된다고 느끼시나요, 충돌한다고 느끼시나요?',
    '데이트 코스를 정하거나 결정을 내릴 때, 주로 누가 주도권을 갖나요?',
    '상대방의 사소한 습관 중에 본인을 가장 힘들게 하는 것이 있나요?',
    '서로의 친구 관계나 사회생활에 대해 얼마나 공유하고 간섭하시나요?',
    '화가 났을 때 본인의 감정을 표출하는 방식과 상대방의 방식이 비슷한가요?',
    '상대방과 함께 있을 때 나의 모습이 더 긍정적으로 변한다고 느끼시나요?',
    '두 사람 사이에 연락 빈도 문제로 갈등이 생기는 편인가요?',
    '서운한 점이 생겼을 때 바로 말하는 편인가요, 아니면 참는 편인가요?',
    '우리 관계에서 거짓말은 어디까지 허용될 수 있다고 생각하시나요?',
    '상대방이 나의 꿈이나 목표를 얼마나 지지해주고 있다고 느끼시나요?',
    '10년 뒤에도 지금 이 사람과 함께 있는 모습이 상상되시나요?'
  ],
  '속궁합': [
    '상대방과의 성적 에너지가 처음 만났을 때와 비교해 어떻게 변화했나요?',
    '관계 시 본인의 만족도만큼 상대방의 만족도를 챙기는 것이 중요하신가요?',
    '본인이 선호하는 스킨십의 강도와 상대방의 강도가 잘 맞는 편인가요?',
    '관계를 맺는 시간대나 장소에 대해 본인만의 선호하는 판타지가 있나요?',
    '관계 도중 나누는 대화나 소리가 중요하다고 생각하시나요?',
    '상대방의 특정 신체 부위나 자극에 대해 본인이 느끼는 반응이 강렬한가요?',
    '관계가 끝난 직후의 후속 교감(애프터 케어)에 대해 만족하시나요?',
    '새로운 체위나 도구 사용 등 변화를 주는 것에 대해 개방적이신가요?',
    '본인의 성적 취향을 요구했을 때, 거부당할까 봐 걱정되시나요?',
    '관계의 횟수(빈도)가 사랑의 척도라고 생각하시나요?',
    '컨디션이 좋지 않을 때 상대방의 요구를 거절하는 것이 편안하신가요?',
    '신체적 궁합이 맞지 않는다면, 정서적 교감만으로 관계 유지가 가능한가요?'
  ],
  '키스 궁합': [
    '상대방과 키스할 때 느껴지는 향기나 체온이 본인을 기분 좋게 하나요?',
    '키스 도중 상대방의 손 위치나 포옹 방식이 본인을 편안하게 만드나요?',
    '본인은 짧고 가벼운 입맞춤보다 깊고 긴 키스를 더 선호하시나요?',
    '키스의 템포(속도)를 누가 주로 리드하나요?',
    '키스할 때 상대방의 호흡이 본인과 잘 어우러진다고 느끼시나요?',
    '눈을 감고 키스할 때 상대방의 존재가 더 가깝게 느껴지나요?',
    '본인의 키스는 부드러움과 강렬함 중 어디에 가깝나요?',
    '키스 도중 상대방이 본인을 얼마나 아껴주고 있다는 느낌을 받나요?',
    '키스만으로도 관계의 끝까지 가고 싶다는 충동을 느낀 적이 있나요?',
    '상대방의 키스 테크닉이 본인의 기대치에 부합하시나요?',
    '공공장소에서의 가벼운 스킨십이나 입맞춤에 대해 어떻게 생각하시나요?',
    '키스가 끝난 후 서로 마주 보는 눈빛에서 어떤 감정을 가장 많이 느끼시나요?'
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
const concernPickerModal = document.getElementById('concernPickerModal');
const concernPickerButtons = [...document.querySelectorAll('#concernPickerButtons [data-concern]')];
const closeConcernPicker = document.getElementById('closeConcernPicker');

const intake = JSON.parse(localStorage.getItem('ff-intake') || '{}');
let concernLabelDisplay = intake.concern || '결혼 운세';

function isAdultConcern(concern = '') {
  return concern === '속궁합' || concern === '키스 궁합';
}

function normalizeConcern(concern = '') {
  if (categoryQuestions[concern]) return concern;
  if (['재회운', '애정운', '커플운', '썸운'].includes(concern)) return '일반 궁합';
  return '결혼 운세';
}

function concernLabel() {
  return concernLabelDisplay || '결혼 운세';
}

function currentQuestionSet() {
  const normalized = normalizeConcern(concernLabel());
  const questions = categoryQuestions[normalized] || categoryQuestions['결혼 운세'];
  return questions.map((text, idx) => ({ id: `Q${idx + 1}`, text }));
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
  const categoryTicker = {
    '결혼 운세': ['결혼 운 흐름 분석 중...', '배우자 조건 매칭 중...', '가족/경제 궁합 파악 중...'],
    '일반 궁합': ['관계 소통 패턴 분석 중...', '갈등/보완 포인트 추적 중...', '궁합 싱크로율 계산 중...'],
    '재회운': ['재회 타이밍 추적 중...', '관계 복원 지수 계산 중...', '감정 재연결 포인트 분석 중...'],
    '애정운': ['애정 흐름 분석 중...', '감정 온도 변화 추적 중...', '관계 안정도 측정 중...'],
    '커플운': ['커플 리듬 분석 중...', '장기 궁합 지표 계산 중...', '갈등 완화 포인트 추적 중...'],
    '썸운': ['썸 진전 확률 분석 중...', '관심 신호 매칭 중...', '연락 텐션 흐름 파악 중...'],
    '속궁합': ['성인 에너지 분석 중...', '관계 리듬 파악 중...', '속궁합 싱크로율 계산 중...'],
    '키스 궁합': ['키스 케미 분석 중...', '호흡 템포 싱크 계산 중...', '감정 밀착도 측정 중...']
  };
  const tickerPool = categoryTicker[concernLabel()] || categoryTicker['일반 궁합'];
  if (liveTicker) liveTicker.textContent = tickerPool[(solved + index) % tickerPool.length];
}

function likertLabel(score) { return ['전혀 아니다', '아니다', '보통이다', '그렇다', '매우 그렇다'][score - 1]; }

function renderQuestion(index) {
  const q = activeQuestions[index];
  const card = document.createElement('div');
  card.className = 'question-card slide-in';
  const isSpecial = index >= 8;
  card.innerHTML = `<div class="small question-context">${modeMeta[selectedMode].label} 관점 설문 · 문항 (${q.id}) · 카테고리: ${concernLabel()}</div><h3>${index + 1}. ${q.text}</h3><div class="options">${[1, 2, 3, 4, 5].map((score) => `<label class="option"><input type="radio" name="q" value="${score}" />${score}점 · ${likertLabel(score)}</label>`).join('')}</div>`;

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
  activeQuestions = currentQuestionSet();
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

  const concern = concernLabel();
  concernPickerButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.concern === concern));
  document.body.classList.toggle('adult-mode', isAdultConcern(concern));
  if (analysisTitle) analysisTitle.textContent = `[${concern}] 분석 중`;
  modeHint.innerHTML = `${modeMeta[selectedMode].guide} · <button type="button" class="concern-pill" id="openConcernPicker">현재 카테고리: ${concern}</button>`;
  document.getElementById('openConcernPicker')?.addEventListener('click', () => {
    if (concernPickerModal) concernPickerModal.hidden = false;
  });
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

closeConcernPicker?.addEventListener('click', () => {
  if (concernPickerModal) concernPickerModal.hidden = true;
});
concernPickerModal?.addEventListener('click', (e) => {
  if (e.target === concernPickerModal) concernPickerModal.hidden = true;
});
concernPickerButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const nextConcern = btn.dataset.concern;
    if (!nextConcern) return;

    if (isAdultConcern(nextConcern) && localStorage.getItem('ff-adult-verified') !== '1') {
      alert('19금 카테고리는 먼저 성인 인증이 필요해. 메인에서 인증 후 이용해줘.');
      if (concernPickerModal) concernPickerModal.hidden = true;
      location.href = '/';
      return;
    }

    concernLabelDisplay = nextConcern;
    const intakeDraft = JSON.parse(localStorage.getItem('ff-intake') || '{}');
    intakeDraft.concern = concernLabelDisplay;
    localStorage.setItem('ff-intake', JSON.stringify(intakeDraft));

    if (concernPickerModal) concernPickerModal.hidden = true;
    selectMode(selectedMode || intake.mode || 'ziwei', false);
  });
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

  const partA = ['Q1', 'Q2', 'Q3', 'Q4'].reduce((sum, key) => sum + (answerById[key] || 0), 0);
  const partB = ['Q5', 'Q6', 'Q7', 'Q8'].reduce((sum, key) => sum + (answerById[key] || 0), 0);
  const partC = ['Q9', 'Q10', 'Q11', 'Q12'].reduce((sum, key) => sum + (answerById[key] || 0), 0);
  const total = partA + partB + partC;
  const recoveryIndex = Math.max(20, Math.min(98, Math.round((72 - total) * 1.4 + 28)));
  const reunionForce = Math.max(12, Math.min(96, Math.round((partB + partC) * 1.45)));
  const emotionTemp = Math.max(24, Math.min(92, Math.round((partA * 1.7) + (partB * 1.1))));
  let type = '균형형';
  if (total >= 48) type = '몰입형';
  else if (total >= 36) type = '탐색형';

  localStorage.setItem('ff-result', JSON.stringify({
    mode: selectedMode, modeLabel: modeMeta[selectedMode].label, lensTitle: modeMeta[selectedMode].lensTitle,
    troubleType: concernLabel(), troubleLabel: concernLabel(), answers, answerById, partA, partB, partC,
    total, recoveryIndex, reunionForce, emotionTemp, type, createdAt: Date.now()
  }));

  const loader = document.getElementById('preResultLoader');
  const metricA = document.getElementById('loaderMetricA');
  const metricB = document.getElementById('loaderMetricB');
  const preResultMessage = document.getElementById('preResultMessage');
  if (!loader) return (location.href = '/result.html');

  if (preResultMessage) {
    const who = intake.name || '고객';
    preResultMessage.textContent = `${who}님의 자미두수 명반과 설문 결과를 결합 중입니다...`;
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

if (isAdultConcern(concernLabelDisplay) && localStorage.getItem('ff-adult-verified') !== '1') {
  alert('19금 카테고리는 성인 인증 후 이용 가능해. 메인으로 이동할게.');
  location.href = '/';
}

const initialMode = modeMeta[intake.mode] ? intake.mode : 'ziwei';
selectMode(initialMode, false);
updateProgress();