const metaBox = document.getElementById('frMetaBox');
const pillarsBox = document.getElementById('frPillarsBox');
const totalBox = document.getElementById('frTotalBox');
const engineBox = document.getElementById('frEngineBox');

function getReports() {
  try { return JSON.parse(localStorage.getItem('ff-total-fortune-reports') || '[]'); } catch (e) { return []; }
}

function getReport() {
  const id = new URLSearchParams(location.search).get('id') || localStorage.getItem('ff-total-fortune-active-report-id');
  return getReports().find((r) => r.id === id) || null;
}

function parseBirth(birth = '') {
  const [y, m, d] = String(birth).split('-').map(Number);
  return { year: y || 2000, month: m || 1, day: d || 1 };
}

function buildFortuneRows(pillars = [], userName = '당신') {
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
      icon: '💗', title: '연애 · 관계 총운',
      summary: relationScore >= 2 ? '관계운은 기회가 열려 있고, 표현 타이밍이 성패를 가르는 구간이야.' : '관계운은 신중하게 열리는 흐름이라, 속도보다 신뢰를 먼저 쌓는 게 좋아.',
      body: `${userName}님의 관계운은 ${strong} 중심으로 감정 에너지가 빠르게 붙는 타입이야. ${relationScore >= 2 ? '인연 자체는 잘 들어오는 편' : '선택은 느리지만 한번 마음 주면 오래 가는 편'}이고, ${hasClash ? '지지 충(沖) 신호가 있어 감정 기복이 갑자기 커질 수 있어.' : '큰 충돌보단 작은 오해가 쌓이는 형태의 변동을 조심하면 돼.'}`,
      guide: `핵심은 감정 확인 → 결론 순서야. 연락 템포를 반 박자 늦추고 주 1회 관계 점검 대화를 고정해. [행운 처방] ${tip.action}`,
      tags: ['#표현조율', hasClash ? '#변동성관리' : '#신뢰축적', `#${tip.key.replace(/\s/g, '')}`]
    },
    {
      icon: '💼', title: '직업 · 성취운',
      summary: hasLeaderUnseong ? '리더십·주도권 운이 살아 있는 해라, 결단한 만큼 결과가 나온다.' : '성과운은 누적형이라, 꾸준한 루틴이 곧 경쟁력이 되는 시기야.',
      body: `${selfDriveScore >= 2 ? '비겁 성분이 강해서 판을 여는 힘이 커.' : '혼자 몰아붙이기보다 구조를 활용할 때 성과가 안정적이야.'} ${hasLeaderUnseong ? '운성에서 제왕/건록 신호가 보여 책임 있는 자리에서 존재감이 커져.' : '속도보다 정확도로 점수를 쌓는 전략이 좋아.'}`,
      guide: `올해 직업운 키워드는 문서화와 마감력이야. 아이디어보다 완료율 지표를 우선해. [행운 처방] 매일 1개 결과물 기록.`,
      tags: ['#리더십', '#문서화', '#마감력']
    },
    {
      icon: '🧑‍🤝‍🧑', title: '대인 · 사회운',
      summary: supportScore >= 2 ? '사람복이 들어오는 흐름이고 경계선만 지키면 인맥운이 커져.' : '대인운은 선택과 집중형이라, 깊은 인연 3명만 지켜도 충분히 강해져.',
      body: `${supportScore >= 2 ? '인성 신호가 살아 있어 타인의 도움 창구가 열려 있어.' : '넓게보다 깊게 연결하는 편이 유리해.'} ${hasClash ? '충(沖) 신호가 있는 달엔 오해성 발언을 특히 조심해.' : '협업 제안이 붙는 시기가 찾아오면 먼저 제안해도 좋아.'}`,
      guide: `모임 수를 줄이고 핵심 관계에 시간을 재배치해. 소개·협업 제안은 오후 타이밍이 유리해.`,
      tags: ['#인맥선별', '#말의온도', '#협업운']
    },
    {
      icon: '💰', title: '재물 · 금전운',
      summary: '재물운은 유입 자체보다 보존 규칙을 세울 때 체감이 커지는 흐름이야.',
      body: `${strong} 기운이 강하면 기회 포착은 빠른데 ${weak} 보완이 안 되면 새는 지출이 생겨. 투자/소비 모두 기준가와 상한선을 먼저 적어두는 게 좋아.`,
      guide: `계좌 분리(생활/투자) + 주 1회 정산이 핵심. [행운 처방] ${tip.number} 숫자를 결제·저축 루틴 기준일로 써봐.`,
      tags: ['#지출통제', '#현금흐름', '#분리관리']
    }
  ];

  return { rows, strong, weak };
}

function buildDaewoon(report, pillars = []) {
  const birthYear = parseBirth(report.birth || '').year || 2000;
  const nowYear = new Date().getFullYear();
  const age = Math.max(1, nowYear - birthYear + 1);
  const decadeStartAge = 2;
  const idx = Math.max(0, Math.floor((age - decadeStartAge) / 10));
  const curStartAge = decadeStartAge + idx * 10;
  const curEndAge = curStartAge + 9;
  const nextStartAge = curStartAge + 10;
  const nextEndAge = nextStartAge + 9;

  const elems = pillars.flatMap((p) => [p.stemElement, p.branchElement]).filter(Boolean);
  const cnt = elems.reduce((acc, e) => ({ ...acc, [e]: (acc[e] || 0) + 1 }), {});
  const ordered = Object.entries(cnt).sort((a, b) => b[1] - a[1]);
  const names = { wood: '목', fire: '화', earth: '토', metal: '금', water: '수' };
  const strongKey = ordered[0]?.[0] || 'earth';
  const weakKey = ordered[ordered.length - 1]?.[0] || 'water';

  return {
    age,
    curRange: `${curStartAge}세 ~ ${curEndAge}세`,
    nextRange: `${nextStartAge}세 ~ ${nextEndAge}세`,
    current: `${age}세 기준 현재 10년 흐름은 ${names[strongKey]} 기운 중심이야. 주도권과 리듬 관리가 핵심이야.`,
    next: `다음 10년은 ${names[weakKey]} 보완이 성패를 가를 가능성이 커. 속도보다 균형 관리가 중요해.`,
    prep: `지금부터 12개월은 문서화·건강 리듬·관계 에너지 분배 3가지를 고정해.`
  };
}

function render() {
  const report = getReport();
  if (!report) {
    metaBox.innerHTML = '<p class="small">리포트를 찾을 수 없어. <a href="/fortune-reports.html">목록으로 이동</a></p>';
    pillarsBox.innerHTML = totalBox.innerHTML = engineBox.innerHTML = '';
    return;
  }

  const p = report?.data?.self?.pillars || [];
  const pillarText = p.length ? `${p[0]?.stem || '-'}${p[0]?.branch || '-'} / ${p[1]?.stem || '-'}${p[1]?.branch || '-'} / ${p[2]?.stem || '-'}${p[2]?.branch || '-'} / ${p[3]?.stem || '-'}${p[3]?.branch || '-'}` : '-';

  metaBox.innerHTML = `<h3>✨ ${report.name}님의 전체총운 리포트</h3>
  <p class="small">${report.birth} ${report.birthTime} · ${report.gender} · 한국/${report.birthCity || '서울특별시'}</p>`;

  pillarsBox.innerHTML = `<h3>🧭 만세력 원국</h3><p class="small">시/일/월/년: ${pillarText}</p>
  <div class="fortune-tags">${p.map((x, i) => `<span>${['시','일','월','년'][i]}주 ${x?.ganzi || '-'} · 십신 ${x?.stemSipsin || '-'} · 운성 ${x?.unseong || '-'}</span>`).join('')}</div>`;

  const { rows, strong, weak } = buildFortuneRows(p, report.name || '당신');
  const daewoon = buildDaewoon(report, p);

  totalBox.innerHTML = `<h3>🌠 전체총운 해설</h3>
    <p class="small">중심 기운 <strong>${strong}</strong> · 보완 기운 <strong>${weak}</strong></p>
    <div class="total-fortune-list">${rows.map((r, i) => `<details class="fortune-acc" ${i === 0 ? 'open' : ''}><summary><span class="icon">${r.icon}</span><span class="txt">${r.summary}</span><span class="arr">⌄</span></summary><div class="fortune-body"><strong>${r.title}</strong><p>${r.body}</p><p>${r.guide}</p><div class="fortune-tags">${r.tags.map((t) => `<span>${t}</span>`).join('')}</div></div></details>`).join('')}</div>
    <div class="daewoon-grid" style="margin-top:14px;">
      <article class="daewoon-card current"><small>현재 대운</small><strong>${daewoon.curRange}</strong><p>${daewoon.current}</p></article>
      <article class="daewoon-card next"><small>다음 대운</small><strong>${daewoon.nextRange}</strong><p>${daewoon.next}</p></article>
      <article class="daewoon-card prep"><small>미리 준비</small><strong>현재 ${daewoon.age}세</strong><p>${daewoon.prep}</p></article>
    </div>`;

  engineBox.innerHTML = `<h3>🧮 엔진 정보</h3>
  <p class="small">엔진: ${report?.data?.engine || '@orrery/core'}</p>
  <p class="small">라이선스: ${report?.data?.license || 'AGPL-3.0-only'}</p>
  <p class="small"><a href="${report?.data?.sourceUrl || 'https://github.com/rath/orrery'}" target="_blank" rel="noopener">소스 저장소 보기</a></p>`;
}

render();
