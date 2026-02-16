const tfInputBox = document.getElementById('tfInputBox');
const tfConfirmBox = document.getElementById('tfConfirmBox');
const tfEngineBox = document.getElementById('tfEngineBox');
const tfPillarsBox = document.getElementById('tfPillarsBox');
const tfTotalBox = document.getElementById('tfTotalBox');
const tfDaewoonBox = document.getElementById('tfDaewoonBox');
const tfAnalyzeState = document.getElementById('tfAnalyzeState');
const tfLoadingOverlay = document.getElementById('tfLoadingOverlay');
const tfLoadingText = document.getElementById('tfLoadingText');
const tfLoadingMeta = document.getElementById('tfLoadingMeta');

const KOREA_REGIONS = [
  '서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시', '대전광역시', '울산광역시',
  '세종특별자치시', '경기도', '강원특별자치도', '충청북도', '충청남도', '전북특별자치도', '전라남도',
  '경상북도', '경상남도', '제주특별자치도'
];

function parseBirth(birth = '2000-01-01') {
  const raw = String(birth || '').trim();
  if (/^\d{8}$/.test(raw)) return { year: Number(raw.slice(0, 4)), month: Number(raw.slice(4, 6)), day: Number(raw.slice(6, 8)) };
  const normalized = raw.replace(/\./g, '-').replace(/\//g, '-');
  const [y, m, d] = normalized.split('-').map((v) => Number(v));
  return { year: y || 2000, month: m || 1, day: d || 1 };
}

function parseTime(time = '') {
  const v = String(time || '').trim();
  if (!v || v.includes('모름')) return { hour: 12, minute: 0, unknownTime: true };
  const [h, m] = v.split(':').map((x) => Number(x));
  return { hour: Number.isFinite(h) ? h : 12, minute: Number.isFinite(m) ? m : 0, unknownTime: false };
}

function mapGender(g = '') {
  const s = String(g || '').toLowerCase();
  if (s.includes('남') || s === 'm') return 'M';
  if (s.includes('여') || s === 'f') return 'F';
  return 'F';
}

function normalizeKoreaRegion(v = '') {
  const input = String(v || '').trim();
  if (!input) return '서울특별시';
  const exact = KOREA_REGIONS.find((r) => r === input);
  if (exact) return exact;
  const partial = KOREA_REGIONS.find((r) => r.includes(input) || input.includes(r.replace('특별자치', '').replace('특별', '').replace('광역', '')));
  return partial || null;
}

function normalizeByKoreaStandardTime(birth = '', birthTime = '') {
  const { year, month, day } = parseBirth(birth);
  const { hour, minute } = parseTime(birthTime || '12:00');
  return {
    year,
    month,
    day,
    hour,
    minute,
    tz: 'KST(UTC+9)'
  };
}

function renderPillars(data) {
  const cols = ['시', '일', '월', '년'];
  const toneMap = { wood: 'wood', fire: 'fire', earth: 'earth', metal: 'metal', water: 'water' };
  const safe = (data?.self?.pillars || []).slice(0, 4);
  const stemCells = safe.map((p, i) => `<div class="pillar-cell ${toneMap[p.stemElement] || 'earth'}"><small>${cols[i]}</small><strong>${p.stem || '-'}</strong></div>`).join('');
  const branchCells = safe.map((p, i) => `<div class="pillar-cell ${toneMap[p.branchElement] || 'earth'}"><small>${cols[i]}</small><strong>${p.branch || '-'}</strong></div>`).join('');
  tfPillarsBox.innerHTML = `<h3>💎 만세력 미리보기</h3><div class="pillars-row-label">천간</div><div class="pillars-grid">${stemCells}</div><div class="pillars-row-label">지지</div><div class="pillars-grid">${branchCells}</div>`;
}

function renderDaewoonSection(data, payload = {}, userName = '당신') {
  if (!tfDaewoonBox) return;
  const birthYear = parseBirth(payload.birth || '').year || 2000;
  const nowYear = new Date().getFullYear();
  const age = Math.max(1, nowYear - birthYear + 1);

  const pillars = [...(data?.self?.pillars || [])];
  const elems = pillars.flatMap((p) => [p.stemElement, p.branchElement]).filter(Boolean);
  const cnt = elems.reduce((acc, e) => ({ ...acc, [e]: (acc[e] || 0) + 1 }), {});
  const names = { wood: '목', fire: '화', earth: '토', metal: '금', water: '수' };
  const ordered = Object.entries(cnt).sort((a, b) => b[1] - a[1]);
  const strongKey = ordered[0]?.[0] || 'earth';
  const weakKey = ordered[ordered.length - 1]?.[0] || 'water';

  const decadeStartAge = 2;
  const idx = Math.max(0, Math.floor((age - decadeStartAge) / 10));
  const curStartAge = decadeStartAge + idx * 10;
  const curEndAge = curStartAge + 9;
  const nextStartAge = curStartAge + 10;
  const nextEndAge = nextStartAge + 9;

  const hasLeader = pillars.some((p) => ['帝旺', '建祿', '乾祿'].includes(p.unseong));
  const hasDirect = pillars.some((p) => String(p.stemSipsin || '').includes('官'));
  const hasExpress = pillars.some((p) => ['食神', '傷官'].some((k) => String(p.stemSipsin || '').includes(k)));

  const curSummary = `${age}세 기준 현재 10년 흐름은 ${names[strongKey]} 기운 중심이야. ${hasLeader ? '주도권 운이 살아 있고' : '안정 누적형으로'} ${hasDirect ? '조직/평판 축이 중요해.' : '내 페이스 유지가 핵심이야.'}`;
  const nextSummary = `다음 10년은 ${names[weakKey]} 보완이 성패를 가를 가능성이 커. ${hasExpress ? '표현력은 강하지만' : '속도는 안정적이지만'} 균형 관리가 필요해.`;
  const prepSummary = `지금부터 준비할 것: ① 문서화 루틴 ② 건강 리듬 고정 ③ 관계 에너지 분배. ${userName}님은 한 번 흐름 잡으면 길게 가져가는 타입이야.`;

  tfDaewoonBox.innerHTML = `<h3>🧭 10년 대운 흐름 확장</h3>
    <p class="small">한국식 나이 기준 추정 흐름(참고용) · 현재 ${age}세</p>
    <div class="daewoon-grid">
      <article class="daewoon-card current">
        <small>현재 대운</small>
        <strong>${curStartAge}세 ~ ${curEndAge}세</strong>
        <p>${curSummary}</p>
      </article>
      <article class="daewoon-card next">
        <small>다음 대운</small>
        <strong>${nextStartAge}세 ~ ${nextEndAge}세</strong>
        <p>${nextSummary}</p>
      </article>
      <article class="daewoon-card prep">
        <small>미리 준비</small>
        <strong>지금부터 12개월</strong>
        <p>${prepSummary}</p>
      </article>
    </div>`;
}

function renderTotal(data, userName = '당신') {
  const pillars = [...(data?.self?.pillars || [])];
  const elems = pillars.flatMap((p) => [p.stemElement, p.branchElement]).filter(Boolean);
  const cnt = elems.reduce((acc, e) => ({ ...acc, [e]: (acc[e] || 0) + 1 }), {});
  const names = { wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)' };
  const ordered = Object.entries(cnt).sort((a, b) => b[1] - a[1]);
  const strongKey = ordered[0]?.[0] || 'earth';
  const weakKey = ordered[ordered.length - 1]?.[0] || 'water';
  const strong = names[strongKey];
  const weak = names[weakKey];

  const stemSipsin = pillars.map((p) => p.stemSipsin).filter(Boolean);
  const unseong = pillars.map((p) => p.unseong).filter(Boolean);
  const branches = pillars.map((p) => p.branch).filter(Boolean);

  const hasMany = (keywords = []) => stemSipsin.filter((s) => keywords.some((k) => String(s).includes(k))).length;
  const expressionScore = hasMany(['食神', '傷官']);
  const relationScore = hasMany(['正財', '偏財', '正官', '偏官']);
  const selfDriveScore = hasMany(['比肩', '劫財']);
  const supportScore = hasMany(['正印', '偏印']);

  const clashPairs = [['子','午'], ['卯','酉'], ['寅','申'], ['巳','亥'], ['辰','戌'], ['丑','未']];
  const hasClash = clashPairs.some(([a, b]) => branches.includes(a) && branches.includes(b));
  const hasLeaderUnseong = unseong.some((u) => ['帝旺', '建祿', '乾祿'].includes(u));

  const tipsByWeak = {
    wood: { key: '초록 루틴', action: '아침 15분 산책 + 주 2회 식물 관리', food: '봄나물·허브차', number: '3, 8' },
    fire: { key: '온도 조율', action: '따뜻한 조명 아래 10분 감정 대화', food: '생강차·계피차', number: '2, 7' },
    earth: { key: '문서화 습관', action: '해야 할 일 3개를 매일 손글씨로 기록', food: '고구마·단호박', number: '5, 10' },
    metal: { key: '정리 루틴', action: '매일 10분 정리·정돈으로 결단력 보강', food: '배·무·도라지', number: '4, 9' },
    water: { key: '냉각 루틴', action: '수분 섭취 + 늦은 밤 자극 줄이기', food: '해조류·검은콩', number: '1, 6' }
  };
  const tip = tipsByWeak[weakKey] || tipsByWeak.water;

  const rows = [
    {
      icon: '💗',
      title: '연애 · 관계 총운',
      summary: relationScore >= 2 ? '관계운은 기회가 열려 있고, 표현 타이밍이 성패를 가르는 구간이야.' : '관계운은 신중하게 열리는 흐름이라, 속도보다 신뢰를 먼저 쌓는 게 좋아.',
      body: `${userName}님의 현재 관계운은 ${strong} 중심으로 감정 에너지가 빠르게 붙는 타입이야. ${relationScore >= 2 ? '재성·관성 신호가 살아 있어 인연 자체는 잘 들어오는 편' : '상대를 보는 기준이 높아 선택은 느리지만, 한번 마음 주면 오래 가는 편'}이고, ${hasClash ? '지지 충(沖) 신호가 있어 감정 기복이 갑자기 커질 수 있어.' : '큰 충돌보단 작은 오해가 쌓이는 형태로 변동이 나타나기 쉬워.'}`,
      guide: `핵심은 감정 확인 → 결론 순서야. 연락 템포를 반 박자 늦추고, 주 1회는 관계 점검 대화를 고정해. [행운 처방] ${tip.action}`,
      tags: ['#표현조율', hasClash ? '#변동성관리' : '#신뢰축적', `#${tip.key.replace(/\s/g, '')}`]
    },
    {
      icon: '🏠',
      title: '가정 · 기반운',
      summary: '기반운은 안정성은 좋지만, 생활 리듬을 문서화할수록 운이 단단해져.',
      body: `${strong} 기운이 생활 중심축을 잡아줘서 큰 방향은 흔들리지 않는 편이야. 다만 ${weak} 기운이 약하면 집안·생활 이슈를 감정으로 처리해서 피로가 커질 수 있어. 특히 돈/시간/역할 분담을 말로만 합의하면 흐트러질 가능성이 높아.`,
      guide: `가정운은 '규칙 3개'가 전부야. 수면·청소·지출 한도만 고정해도 기반운 체감이 확 올라가. [행운 처방] ${tip.food} 섭취와 저녁 루틴 고정.` ,
      tags: ['#기반안정', '#생활규칙', `#행운숫자${tip.number}`]
    },
    {
      icon: '🧑‍🤝‍🧑',
      title: '대인 · 사회운',
      summary: supportScore >= 2 ? '사람복은 들어오는 흐름이고, 경계선만 잘 세우면 인맥운이 커져.' : '대인운은 선택과 집중형이라, 깊은 인연 3명만 지켜도 충분히 강해져.',
      body: `${supportScore >= 2 ? '인성 신호가 살아 있어 타인의 도움을 받는 창구가 열려 있어.' : '비겁/인성 균형이 예민해서, 사람을 넓게 만나기보다 깊게 연결하는 편이 유리해.'} ${hasClash ? '충(沖) 신호가 있는 달에는 오해성 발언이 커질 수 있어 말수를 줄이는 게 득이야.' : '합(合) 흐름이 강한 구간에는 협업 제안이 잘 붙는 편이야.'}`,
      guide: `모임 수를 줄이고 핵심 관계에 시간을 재배치해. 소개·협업 제안은 오전보다 오후가 유리해. [행운 처방] 핵심 키워드 메모 습관.` ,
      tags: ['#인맥선별', '#말의온도', '#협업운']
    },
    {
      icon: '💼',
      title: '직업 · 성취운',
      summary: hasLeaderUnseong ? '리더십·주도권 운이 살아 있는 해라, 결단한 만큼 결과가 나온다.' : '성과운은 누적형이라, 꾸준한 루틴이 곧 경쟁력이 되는 시기야.',
      body: `${selfDriveScore >= 2 ? '비겁 성분이 강해서 주도적으로 판을 여는 힘이 커.' : '혼자 몰아붙이기보다 구조를 활용할 때 성과가 안정적이야.'} ${hasLeaderUnseong ? '운성에서 제왕/건록 계열이 보이면 책임 있는 자리에서 존재감이 커진다.' : '운성이 완만하면 속도보다 정확도로 점수를 쌓는 전략이 좋아.'} ${hasClash ? '충 신호가 있으면 중간 이탈/방향 변경 리스크를 항상 관리해야 해.' : ''}`,
      guide: `올해 직업운 키워드는 문서화와 마감력이야. 아이디어보다 완료율 지표를 우선해. [행운 처방] 매일 1개 결과물 기록.` ,
      tags: ['#리더십', '#문서화', '#마감력']
    },
    {
      icon: '💰',
      title: '재물 · 금전운',
      summary: relationScore >= 2 ? '돈의 유입 창구는 열려 있고, 지출 규칙만 세우면 순자산이 남는 흐름이야.' : '재물운은 보수적으로 갈수록 승률이 높아지는 구간이야.',
      body: `${strong} 기운이 강하면 수익 기회 포착은 빠른데, ${weak} 보완이 안 되면 새는 지출이 생겨. 투자는 테마 추격보다 기준가/손절가를 먼저 적어야 수익 보존이 돼.`,
      guide: `재물운 실전 포인트: 계좌 분리(생활/투자) + 주 1회 정산. [행운 처방] ${tip.number} 숫자를 결제·저축 루틴의 기준일로 써봐.` ,
      tags: ['#지출통제', '#현금흐름', '#분리관리']
    },
    {
      icon: '🧘',
      title: '건강 · 생활운',
      summary: '건강운은 과열 후 회복 패턴이라, 에너지 관리가 곧 전체운 관리야.',
      body: `${strong} 과열 구간에서는 집중력이 올라가지만, 휴식이 밀리면 컨디션 급락이 와. ${weak} 기운 보완이 늦어지면 수면·소화·긴장도 문제로 연결될 수 있어.`,
      guide: `핵심은 '과열 전 진정'이야. 카페인 컷오프 시간 고정, 수분량 기록, 야간 스크린 타임 제한을 동시에 적용해. [행운 처방] ${tip.food} + 10분 호흡 루틴.` ,
      tags: ['#리듬관리', '#수면우선', '#회복력']
    }
  ];

  tfTotalBox.innerHTML = `<h3>🌠 ${userName}님의 전체총운</h3><p class="small">중심 기운 <strong>${strong}</strong> · 보완 기운 <strong>${weak}</strong></p><div class="total-fortune-list">${rows.map((r, i) => `<details class="fortune-acc" ${i === 0 ? 'open' : ''}><summary><span class="icon">${r.icon}</span><span class="txt">${r.summary}</span><span class="arr">⌄</span></summary><div class="fortune-body"><strong>${r.title}</strong><p>${r.body}</p><p>${r.guide}</p><div class="fortune-tags">${r.tags.map((t) => `<span>${t}</span>`).join('')}</div></div></details>`).join('')}</div>`;
}

function renderInputForm(intake = {}) {
  if (!tfInputBox) return;
  const city = intake.birthCity || '서울특별시';
  tfInputBox.innerHTML = `<h3 class="tf-step-title">1) 내 정보 입력</h3>
    <p class="small tf-step-sub">국가는 한국으로 고정되고, 출생 지역은 대한민국 시/도 단위로 선택해.</p>
    <div class="tf-form-grid">
      <label>성함<input id="tfName" value="${intake.name || ''}" placeholder="예: 박주원" /></label>
      <label>성별<select id="tfGender"><option ${String(intake.gender).includes('여') ? 'selected' : ''}>여성</option><option ${String(intake.gender).includes('남') ? 'selected' : ''}>남성</option><option ${!String(intake.gender).includes('여') && !String(intake.gender).includes('남') ? 'selected' : ''}>기타</option></select></label>
      <label>생년월일<input id="tfBirth" value="${intake.birth || ''}" placeholder="1997-11-11" /></label>
      <label>출생시간<input id="tfBirthTime" value="${intake.birthTime || ''}" placeholder="예: 12:35" /></label>
      <label>출생 지역(대한민국)
        <input id="tfBirthCity" list="tfCityList" value="${city}" placeholder="예: 경기도" />
        <datalist id="tfCityList">${KOREA_REGIONS.map((c) => `<option value="${c}"></option>`).join('')}</datalist>
      </label>
    </div>
    <div class="cta-row"><button class="btn tf-primary-btn" id="tfCheckBtn" type="button">✨ 2) 나의 운명 확인하기</button></div>`;

  document.getElementById('tfCheckBtn')?.addEventListener('click', () => {
    const payload = {
      name: (document.getElementById('tfName')?.value || '').trim(),
      gender: (document.getElementById('tfGender')?.value || '').trim(),
      birth: (document.getElementById('tfBirth')?.value || '').trim(),
      birthTime: (document.getElementById('tfBirthTime')?.value || '').trim(),
      birthCity: (document.getElementById('tfBirthCity')?.value || '서울특별시').trim()
    };
    if (!payload.name || !payload.birth) {
      alert('이름과 생년월일은 꼭 입력해줘.');
      return;
    }
    if (!/^\d{4}[-\/.]?\d{1,2}[-\/.]?\d{1,2}$|^\d{8}$/.test(payload.birth)) {
      alert('생년월일 형식을 확인해줘. 예: 1997-11-11 또는 19971111');
      return;
    }
    const normalizedCity = normalizeKoreaRegion(payload.birthCity);
    if (!normalizedCity) {
      alert('출생 지역은 대한민국 시/도 단위로 입력해줘. (예: 서울특별시, 경기도, 부산광역시)');
      return;
    }
    payload.birthCity = normalizedCity;
    renderConfirm(payload);
  });
}

function renderConfirm(payload) {
  if (!tfConfirmBox) return;
  tfConfirmBox.hidden = false;
  const norm = normalizeByKoreaStandardTime(payload.birth, payload.birthTime || '12:00');
  const kstTime = `${String(norm.hour).padStart(2, '0')}:${String(norm.minute).padStart(2, '0')}`;
  tfConfirmBox.innerHTML = `<h3>2) 입력 정보 확인</h3>
    <div class="tf-confirm-list">
      <p><strong>이름</strong><span>${payload.name}</span></p>
      <p><strong>성별</strong><span>${payload.gender}</span></p>
      <p><strong>생년월일</strong><span>${payload.birth}</span></p>
      <p><strong>출생시간</strong><span>${payload.birthTime || '모름'}</span></p>
      <p><strong>출생 국가</strong><span>한국(고정)</span></p>
      <p><strong>출생 도시</strong><span>${payload.birthCity || '서울특별시'}</span></p>
      <p><strong>적용 표준시</strong><span>${kstTime} · ${norm.tz}</span></p>
    </div>
    <div class="cta-row"><button class="btn secondary" id="tfEditBtn" type="button">수정하기</button><button class="btn" id="tfRunBtn" type="button">맞습니다 · 분석하기</button></div>`;

  document.getElementById('tfEditBtn')?.addEventListener('click', () => {
    tfConfirmBox.hidden = true;
  });
  document.getElementById('tfRunBtn')?.addEventListener('click', async () => {
    await runAnalysis(payload);
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const showLoading = () => {
  if (!tfLoadingOverlay) return;
  tfLoadingOverlay.hidden = false;
  tfLoadingOverlay.style.display = 'grid';
};
const hideLoading = () => {
  if (!tfLoadingOverlay) return;
  tfLoadingOverlay.classList.remove('flash');
  tfLoadingOverlay.hidden = true;
  tfLoadingOverlay.style.display = 'none';
};

async function playPillarLoading(data) {
  if (!tfLoadingOverlay) return;
  const pillars = data?.self?.pillars || [];
  const seq = [3, 2, 1, 0]; // 년 -> 월 -> 일 -> 시

  showLoading();
  tfLoadingOverlay.classList.remove('flash');
  tfLoadingText.textContent = '당신이 태어난 해의 기운을 불러오고 있습니다.';

  const resetCell = (key) => {
    const el = document.querySelector(`[data-cell="${key}"]`);
    if (!el) return;
    el.classList.remove('reveal', 'wood', 'fire', 'earth', 'metal', 'water');
    const strong = el.querySelector('strong');
    if (strong) strong.textContent = '·';
  };
  [...Array(4).keys()].forEach((i) => {
    resetCell(`stem-${i}`);
    resetCell(`branch-${i}`);
  });

  for (let step = 0; step < seq.length; step += 1) {
    const i = seq[step];
    const p = pillars[i] || {};

    if (step === 1) tfLoadingText.textContent = '계절의 흐름과 태어난 날의 에너지를 동기화합니다.';
    if (step === 3) tfLoadingText.textContent = '마지막 조각이 맞춰졌습니다. 당신의 운명 지도가 완성됩니다.';

    const applyCell = (key, char, tone) => {
      const el = document.querySelector(`[data-cell="${key}"]`);
      if (!el) return;
      const strong = el.querySelector('strong');
      if (strong) strong.textContent = char || '·';
      el.classList.remove('wood', 'fire', 'earth', 'metal', 'water');
      el.classList.add(tone || 'earth', 'reveal');
    };

    applyCell(`stem-${i}`, p.stem, p.stemElement);
    applyCell(`branch-${i}`, p.branch, p.branchElement);

    const core = pillars.flatMap((x) => [x.stemElement, x.branchElement]).filter(Boolean);
    const count = core.reduce((acc, e) => ({ ...acc, [e]: (acc[e] || 0) + 1 }), {});
    const top = Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] || 'earth';
    const label = ({ wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)' }[top]) || '토(土)';
    if (tfLoadingMeta) tfLoadingMeta.textContent = `핵심 오행 성향: ${label}`;

    await sleep(500);
  }

  tfLoadingOverlay.classList.add('flash');
  await sleep(320);
  hideLoading();
}

function renderEngineMeta(data, payload = {}, requestSelf = null) {
  if (!tfEngineBox) return;
  const engine = data?.engine || '@orrery/core';
  const license = data?.license || 'AGPL-3.0-only';
  const source = data?.sourceUrl || 'https://github.com/rath/orrery';
  const p = data?.self?.pillars || [];
  const pillarText = p.length ? `${p[0]?.stem || '-'}${p[0]?.branch || '-'} / ${p[1]?.stem || '-'}${p[1]?.branch || '-'} / ${p[2]?.stem || '-'}${p[2]?.branch || '-'} / ${p[3]?.stem || '-'}${p[3]?.branch || '-'}` : '-';
  const rawRows = p.map((x, i) => `<p class="small">${['시','일','월','년'][i]}주: ${x?.ganzi || '-'} · 십신 ${x?.stemSipsin || '-'} · 운성 ${x?.unseong || '-'}</p>`).join('');
  const req = requestSelf ? `${requestSelf.birth || '-'} ${requestSelf.birthTime || '-'}` : '-';
  tfEngineBox.innerHTML = `<h3>🧮 만세력 오픈소스 엔진 정보</h3><p class="small">엔진: ${engine}</p><p class="small">라이선스: ${license}</p><p class="small">입력(사용자): ${payload.birth || '-'} ${payload.birthTime || '모름'} · ${payload.gender || '-'} · 한국/${payload.birthCity || '서울특별시'} · 양력</p><p class="small">요청값(엔진): ${req}</p><p class="small">산출(시/일/월/년): ${pillarText}</p>${rawRows}<p class="small"><a href="${source}" target="_blank" rel="noopener">소스 저장소 보기</a></p>`;
}

function saveFortuneReport(payload, data, requestSelf) {
  const list = (() => {
    try { return JSON.parse(localStorage.getItem('ff-total-fortune-reports') || '[]'); } catch (e) { return []; }
  })();
  const id = `tfr_${Date.now()}`;
  const report = {
    id,
    createdAt: new Date().toISOString(),
    name: payload.name || '당신',
    birth: payload.birth || '-',
    birthTime: payload.birthTime || '-',
    gender: payload.gender || '-',
    birthCity: payload.birthCity || '서울특별시',
    requestSelf,
    data
  };
  list.unshift(report);
  localStorage.setItem('ff-total-fortune-reports', JSON.stringify(list.slice(0, 50)));
  localStorage.setItem('ff-total-fortune-active-report-id', id);
  return id;
}

async function runAnalysis(payload) {
  if (tfAnalyzeState) tfAnalyzeState.innerHTML = '<p class="small">원국 계산 중... 완료되면 리포트 목록으로 이동해.</p>';
  const failSafe = setTimeout(() => hideLoading(), 9000);
  try {
    const norm = normalizeByKoreaStandardTime(payload.birth, payload.birthTime || '12:00');
    const self = {
      birth: `${norm.year}-${String(norm.month).padStart(2, '0')}-${String(norm.day).padStart(2, '0')}`,
      birthTime: `${String(norm.hour).padStart(2, '0')}:${String(norm.minute).padStart(2, '0')}`,
      gender: payload.gender || '기타',
      birthCity: payload.birthCity || '서울특별시'
    };
    const intakeDraft = JSON.parse(localStorage.getItem('ff-intake') || '{}');
    intakeDraft.name = payload.name;
    intakeDraft.birth = payload.birth;
    intakeDraft.birthTime = payload.birthTime;
    intakeDraft.gender = payload.gender;
    intakeDraft.birthCity = payload.birthCity || '서울특별시';
    localStorage.setItem('ff-intake', JSON.stringify(intakeDraft));

    const res = await fetch('/api/orrery/saju', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ self, concern: intakeDraft.concern || '일반 궁합' })
    });
    const data = await res.json();
    if (!data?.ok) throw new Error(data?.error || '분석 실패');

    await playPillarLoading(data);
    const id = saveFortuneReport(payload, data, self);
    window.location.href = `/fortune-report.html?id=${encodeURIComponent(id)}`;
  } catch (e) {
    console.error(e);
    if (tfAnalyzeState) tfAnalyzeState.innerHTML = `<p class="small">분석 실패: ${e.message || 'unknown'} · 입력값 확인 후 다시 시도해줘.</p>`;
  } finally {
    clearTimeout(failSafe);
    hideLoading();
  }
}

function initTfJourneyNav(intake = {}) {
  const menuBtn = document.getElementById('tfMenuBtn');
  const drawer = document.getElementById('tfDrawer');
  const backdrop = document.getElementById('tfNavBackdrop');
  const closeBtn = document.getElementById('tfDrawerClose');
  const themeBtn = document.getElementById('tfThemeToggle');
  const nameEl = document.getElementById('tfJourneyName');
  const sealEl = document.getElementById('tfJourneySeal');
  const statusEl = document.getElementById('tfJourneyStatus');

  if (!menuBtn || !drawer) return;

  const result = (() => {
    try { return JSON.parse(localStorage.getItem('ff-result') || '{}'); } catch (e) { return {}; }
  })();
  const name = intake?.name || result?.name || '당신';
  if (nameEl) nameEl.textContent = name;

  const hour = new Date().getHours();
  const phase = hour < 6 ? '고요하게 정돈' : hour < 12 ? '맑게 상승' : hour < 18 ? '안정적으로 확장' : '차분하게 수렴';
  if (statusEl) statusEl.textContent = `${name} 님의 기운이 ${phase} 중입니다.`;

  const pillars = result?.evidence?.self?.pillars || result?.saju?.pillars || [];
  if (sealEl && pillars.length >= 4) {
    const stems = pillars.map((p) => p?.stem || '·').join(' ');
    const branches = pillars.map((p) => p?.branch || '·').join(' ');
    sealEl.textContent = `${stems} · ${branches}`;
  }

  const map = [
    ['/total-fortune.html', 'total'],
    ['/fortune-reports.html', 'result'],
    ['/fortune-report.html', 'result'],
    ['/result.html', 'result'],
    ['/test.html', 'test'],
    ['/experts.html', 'experts'],
    ['/', 'home']
  ];
  const key = map.find(([path]) => window.location.pathname === path)?.[1];
  if (key) {
    const active = drawer.querySelector(`[data-menu="${key}"]`);
    if (active) active.classList.add('active');
  }

  const openDrawer = () => {
    drawer.hidden = false;
    backdrop && (backdrop.hidden = false);
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.classList.add('active');
    menuBtn.textContent = '✦';
    document.body.classList.add('tf-nav-open');
  };
  const closeDrawer = () => {
    drawer.hidden = true;
    backdrop && (backdrop.hidden = true);
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.classList.remove('active');
    menuBtn.textContent = '☰';
    document.body.classList.remove('tf-nav-open');
  };

  menuBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (drawer.hidden) openDrawer();
    else closeDrawer();
  });
  closeBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);
  themeBtn?.addEventListener('click', () => {
    window.toggleTheme?.();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !drawer.hidden) closeDrawer();
  });
}

(function init() {
  hideLoading();
  const intake = JSON.parse(localStorage.getItem('ff-intake') || '{}');
  renderInputForm(intake);
  if (tfAnalyzeState) tfAnalyzeState.innerHTML = '<p class="small">입력이 끝나면 분석 후 리포트 페이지(목록/상세)로 이동해.</p>';

  initTfJourneyNav(intake);
})();
