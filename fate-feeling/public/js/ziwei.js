const params = new URLSearchParams(location.search);

function syncIntakeFromQuery() {
  const birth = (params.get('birth') || '').trim();
  const birthTime = (params.get('birthTime') || '').trim();
  const gender = (params.get('gender') || '').trim();
  const birthCity = (params.get('birthCity') || '').trim();
  if (!birth && !birthTime && !gender && !birthCity) return;
  try {
    const prev = JSON.parse(localStorage.getItem('ff-intake') || '{}');
    const next = {
      ...prev,
      birth: birth || prev.birth || '',
      birthTime: birthTime || prev.birthTime || '',
      gender: gender || prev.gender || '',
      birthCity: birthCity || prev.birthCity || ''
    };
    localStorage.setItem('ff-intake', JSON.stringify(next));
  } catch (_) {}
}

function showZiweiEntryLoader() {
  const from = params.get('from');
  if (from !== 'fortune-report') return;
  let overlay = document.getElementById('ziweiTransitOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'ziweiTransitOverlay';
    overlay.className = 'ziwei-transit-overlay show';
    overlay.innerHTML = `
      <div class="ziwei-transit-core">
        <h3>✦ 자미두수 명반 정렬 중...</h3>
        <p>사주 흐름과 연결해 12궁 좌표를 맞추는 중이야.</p>
        <div class="ziwei-transit-stars">${Array.from({ length: 12 }).map((_, i) => `<span style="--i:${i}"></span>`).join('')}</div>
      </div>`;
    document.body.appendChild(overlay);
  }
  setTimeout(() => {
    overlay.classList.remove('show');
    setTimeout(() => overlay.remove(), 260);
  }, 900);
}

syncIntakeFromQuery();
showZiweiEntryLoader();

const result = window.getFFResult?.();
const intake = JSON.parse(localStorage.getItem('ff-intake') || '{}');
const personal = document.getElementById('ziweiPersonal');
const bubble = document.getElementById('ziweiBubble');
const focusPalace = document.getElementById('focusPalace');
const focusAction = document.getElementById('focusAction');
const todayLuckyStar = document.getElementById('todayLuckyStar');
const saveTalismanBtn = document.getElementById('saveTalismanBtn');
const saveTalismanState = document.getElementById('saveTalismanState');
const energyChart = document.getElementById('energyChart');
const drawLuckyItemBtn = document.getElementById('drawLuckyItemBtn');
const luckyItemText = document.getElementById('luckyItemText');
const ziweiBoard = document.getElementById('ziweiBoard');
const ziweiDetail = document.getElementById('ziweiDetail');

const palaces = ['명궁', '형제궁', '부부궁', '자녀궁', '재백궁', '질액궁', '천이궁', '노복궁', '관록궁', '전택궁', '복덕궁', '부모궁'];
const palaceDesc = {
  명궁: '핵심 자아와 현재 감정의 중심축입니다.', 형제궁: '주변 관계/소통 템포를 보여줍니다.', 부부궁: '연애와 재접촉 가능성의 핵심 칸입니다.',
  자녀궁: '돌봄/표현 방식의 부드러움을 봅니다.', 재백궁: '관계 유지에 필요한 현실 에너지를 봅니다.', 질액궁: '불안/긴장 누적 상태를 읽는 구간입니다.',
  천이궁: '외부 움직임과 먼저 다가갈 타이밍을 시사합니다.', 노복궁: '주변 조언/도움 흐름을 보여줍니다.', 관록궁: '행동 계획과 실행력 구간입니다.',
  전택궁: '안정감/일상 회복 기반을 뜻합니다.', 복덕궁: '마음 여유·회복력의 원천을 나타냅니다.', 부모궁: '기대/기준이 관계에 미치는 영향을 뜻합니다.'
};

function mingzhuIndexFromTime(time = '') {
  const hour = Number(String(time).split(':')[0]);
  if (Number.isNaN(hour)) return 0;
  return Math.floor((hour % 24) / 2) % 12;
}

function renderPalaces() {
  if (!ziweiBoard) return;
  const mingzhuIdx = mingzhuIndexFromTime(intake.birthTime || '');
  ziweiBoard.innerHTML = palaces.map((name, idx) => `<button type="button" class="palace ${idx === mingzhuIdx ? 'mingzhu' : ''}" data-palace="${name}" ${idx === mingzhuIdx ? 'aria-current="true"' : ''}>${name}${idx === mingzhuIdx ? '<span class="mingzhu-tag">命主</span>' : ''}</button>`).join('');
  const defaultPalace = palaces[mingzhuIdx];
  if (ziweiDetail) ziweiDetail.innerHTML = `<strong>${defaultPalace}</strong><p>${palaceDesc[defaultPalace]}</p>`;
  ziweiBoard.querySelectorAll('.palace').forEach((btn) => {
    btn.addEventListener('click', () => {
      ziweiBoard.querySelectorAll('.palace').forEach((el) => el.classList.remove('selected'));
      btn.classList.add('selected');
      const palace = btn.dataset.palace;
      if (ziweiDetail) ziweiDetail.innerHTML = `<strong>${palace}</strong><p>${palaceDesc[palace] || '해석 데이터 준비 중입니다.'}</p>`;
    });
  });
}

if (result) {
  const modeText = result.modeLabel ? `${result.modeLabel} 관점` : '기본 관점';
  personal.textContent = `당신은 ${result.type} 흐름으로 분석됐어요. ${modeText} 테스트 결과를 자미두수 명반(12궁) 해석에 반영해 상담 연결 정확도를 높이고 있어요.`;
  if (result.anxiety >= 15) {
    bubble.textContent = '🌟 별자리 캐릭터: "불안 에너지가 높게 감지돼요. 명궁을 안정시키는 호흡 루틴 후에 연락 타이밍을 잡아봐요."';
    focusPalace.textContent = '명궁 · 감정 안정 우선';
    focusAction.textContent = '오늘은 10분 호흡 + 감정메모 후 반응 템포를 늦춰봐.';
    todayLuckyStar.textContent = '태음성 · 감정 진폭 완충 +14%';
  } else if (result.longing >= 15) {
    bubble.textContent = '🌟 별자리 캐릭터: "재회 갈망이 강하네요. 부부궁·복덕궁 흐름을 천천히 보며 감정 소모를 줄여봐요."';
    focusPalace.textContent = '부부궁 · 재접촉 균형';
    focusAction.textContent = '연락 목적 1개만 정하고 짧고 명확한 톤으로 준비해.';
    todayLuckyStar.textContent = '천희성 · 재접촉 타이밍 +11%';
  } else if ((result.mode === 'ziwei' || result.mode === 'saju') && result.lensIntensity >= 15) {
    bubble.textContent = '🌟 별자리 캐릭터: "시기 운행을 잘 읽고 있어요. 관록궁·천이궁 흐름을 묶어 재접촉 타이밍을 좁혀봐요."';
    focusPalace.textContent = '천이궁 · 시기 운행';
    focusAction.textContent = '이번 주 1회만 시도하는 타이밍 전략으로 가는 게 좋아.';
    todayLuckyStar.textContent = '문곡성 · 판단 명료도 +13%';
  }
}

renderPalaces();

saveTalismanBtn?.addEventListener('click', () => {
  localStorage.setItem('ff-ziwei-talisman', JSON.stringify({ star: todayLuckyStar?.textContent || '', savedAt: Date.now() }));
  saveTalismanState.textContent = '오늘의 부적으로 저장됐어요. (로컬 저장 완료)';
});

(function renderEnergyChart() {
  if (!energyChart) return;
  const points = [35, 42, 51, 62, 58, 64, 71, 67, 59, 52, 47, 55];
  energyChart.innerHTML = points.map((point, idx) => `<span class="energy-bar ${idx === 6 ? 'peak' : ''}" style="height:${point}%" title="${idx * 2}시"></span>`).join('');
})();

const luckyItems = ['은은한 향수', '실버 반지', '보라색 노트', '달 모양 키링', '흰 셔츠'];
drawLuckyItemBtn?.addEventListener('click', () => {
  luckyItemText.textContent = `오늘의 행운 아이템은 "${luckyItems[Math.floor(Math.random() * luckyItems.length)]}" 입니다.`;
});