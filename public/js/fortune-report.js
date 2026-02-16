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

function calcKoreanAge(birth = '') {
  const b = parseBirth(birth);
  const now = new Date();
  return Math.max(1, now.getFullYear() - b.year + 1);
}

function buildDaewoonNarrative(report, pillars = []) {
  const age = calcKoreanAge(report.birth || '');
  const decadeStartAge = 2;
  const idx = Math.max(0, Math.floor((age - decadeStartAge) / 10));

  const elems = pillars.flatMap((p) => [p.stemElement, p.branchElement]).filter(Boolean);
  const cnt = elems.reduce((acc, e) => ({ ...acc, [e]: (acc[e] || 0) + 1 }), {});
  const ordered = Object.entries(cnt).sort((a, b) => b[1] - a[1]);
  const names = { wood: '목', fire: '화', earth: '토', metal: '금', water: '수' };
  const strongKey = ordered[0]?.[0] || 'earth';
  const weakKey = ordered[ordered.length - 1]?.[0] || 'water';

  const unseong = pillars.map((p) => p.unseong).filter(Boolean);
  const sipsin = pillars.map((p) => p.stemSipsin).filter(Boolean);
  const hasEmperor = unseong.some((u) => ['帝旺', '건록', '建祿', '乾祿'].includes(String(u)));
  const hasPyeonjae = sipsin.some((s) => String(s).includes('偏財'));
  const hasGwan = sipsin.some((s) => String(s).includes('官'));

  const makeRange = (i) => {
    const start = decadeStartAge + i * 10;
    const end = start + 9;
    return { start, end, label: `${start}세 ~ ${end}세` };
  };

  const past = makeRange(Math.max(0, idx - 1));
  const current = makeRange(idx);
  const future = makeRange(idx + 1);

  const coreTheme = hasEmperor ? '제왕(帝王) 흐름의 독립성과 리더십' : `${names[strongKey]} 기운 기반의 누적 성장`;
  const moneyTheme = hasPyeonjae ? '편재(偏財) 신호가 살아 있어 큰 거래·사업 확장 기회' : '재성 흐름은 보수적 누적이 유리한 구조';
  const roleTheme = hasGwan ? '관성 축이 강해 평판·직책·조직 책임이 중요' : '자기 페이스를 지키는 독립형 전략이 유효';

  const currentText = `${age}세인 지금은 인생 서사에서 가장 중요한 전개 구간이야. ${coreTheme}이 본격적으로 올라오고, ${roleTheme}이 동시에 작동하면서 사회적 위치를 재정의하게 돼. 특히 ${moneyTheme}이 겹치면 단순 월급 흐름보다 프로젝트·사업·파트너십에서 큰 판이 열릴 수 있어. 다만 ${names[weakKey]} 보완이 약하면 속도만 앞서고 체력·관계 균형이 흔들릴 수 있으니, 문서화·계약 검토·휴식 리듬을 같이 잡는 게 필수야.`;

  const pastText = `지나온 ${past.label} 구간은 기반을 세우는 시기였어. 지금의 선택 기준과 관계 패턴이 이때 만들어졌고, 특히 실패/성공의 반복에서 너만의 의사결정 프레임이 완성됐을 가능성이 커. 이 시기 경험을 버리지 말고 자산화하면 현재 대운의 성과 속도가 확실히 올라가.`;
  const futureText = `다가올 ${future.label} 구간은 결실과 안정의 밀도를 높이는 흐름이야. 현재에 만든 인맥·평판·전문성이 구조화되면서 장기 계약, 자산 배분, 라이프 밸런스 재설계 이슈가 커져. 지금부터 기준을 정리해두면 다음 구간에서 시행착오를 크게 줄일 수 있어.`;

  const yearlyLines = (range) => {
    const lines = [];
    for (let y = range.start; y <= range.end; y += 1) {
      const tone = y % 3 === 0 ? '확장' : y % 3 === 1 ? '정비' : '결실';
      lines.push(`<li><strong>${y}세</strong> · ${tone} 흐름: ${tone === '확장' ? '새 제안과 이동 운이 강함' : tone === '정비' ? '관계·건강 루틴 정리 우선' : '성과 회수와 자산화 집중'}</li>`);
    }
    return `<ul class="daewoon-yearly">${lines.join('')}</ul>`;
  };

  return {
    age,
    past: { ...past, text: pastText, tip: '#기반정리 #패턴복기 #실수자산화', yearly: yearlyLines(past) },
    current: { ...current, text: currentText, tip: hasPyeonjae ? '#사업확장 #큰재물흐름 #리스크관리' : '#문서화 #평판관리 #체력관리', yearly: yearlyLines(current) },
    future: { ...future, text: futureText, tip: '#결실관리 #자산배분 #관계정비', yearly: yearlyLines(future) }
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

  const labels = ['시', '일', '월', '년'];
  const stemRow = p.map((x, i) => `<div class="pillar-cell ${x?.stemElement || 'earth'} fr-pillar-big"><small>${labels[i]}주 천간</small><strong>${x?.stem || '-'}</strong><em>${x?.stemSipsin || '-'}</em></div>`).join('');
  const branchRow = p.map((x, i) => `<div class="pillar-cell ${x?.branchElement || 'earth'} fr-pillar-big"><small>${labels[i]}주 지지</small><strong>${x?.branch || '-'}</strong><em>${x?.unseong || '-'}</em></div>`).join('');

  pillarsBox.innerHTML = `<h3>🧭 만세력 원국</h3>
  <p class="small">먼저 원국이 맞는지 확인할 수 있게 크게 보여줄게 · 시/일/월/년: ${pillarText}</p>
  <div class="pillars-grid fr-pillar-grid-head">${labels.map((l) => `<b>${l}주</b>`).join('')}</div>
  <div class="pillars-grid">${stemRow}</div>
  <div class="pillars-grid">${branchRow}</div>
  <div class="fortune-tags">${p.map((x, i) => `<span>${labels[i]}주 ${x?.ganzi || '-'} · 십신 ${x?.stemSipsin || '-'} · 운성 ${x?.unseong || '-'}</span>`).join('')}</div>`;

  const { rows, strong, weak } = buildFortuneRows(p, report.name || '당신');
  const daewoon = buildDaewoonNarrative(report, p);

  totalBox.innerHTML = `<h3>🌠 전체총운 해설</h3>
    <p class="small">중심 기운 <strong>${strong}</strong> · 보완 기운 <strong>${weak}</strong></p>
    <div class="total-fortune-list">${rows.map((r, i) => `<details class="fortune-acc" ${i === 0 ? 'open' : ''}><summary><span class="icon">${r.icon}</span><span class="txt">${r.summary}</span><span class="arr">⌄</span></summary><div class="fortune-body"><strong>${r.title}</strong><p>${r.body}</p><p>${r.guide}</p><div class="fortune-tags">${r.tags.map((t) => `<span>${t}</span>`).join('')}</div></div></details>`).join('')}</div>

    <h3 style="margin-top:18px;">🧭 연령별 대운 타임라인</h3>
    <p class="small">현재 ${daewoon.age}세 기준 · 현재 대운을 최상단으로 강조했어.</p>
    <div class="daewoon-grid daewoon-story-grid" style="margin-top:10px;">
      <article class="daewoon-card current">
        <small>🔥 현재 대운 (최우선)</small>
        <strong>${daewoon.current.label}</strong>
        <p>${daewoon.current.text}</p>
        <p class="small"><strong>🗝️ 핵심 비책</strong> ${daewoon.current.tip}</p>
        <details class="daewoon-detail" open><summary>연도별 상세 흐름 보기</summary>${daewoon.current.yearly}</details>
      </article>
      <article class="daewoon-card past">
        <small>🕰 지나온 대운</small>
        <strong>${daewoon.past.label}</strong>
        <p>${daewoon.past.text}</p>
        <p class="small"><strong>🗝️ 핵심 비책</strong> ${daewoon.past.tip}</p>
        <details class="daewoon-detail"><summary>연도별 상세 흐름 보기</summary>${daewoon.past.yearly}</details>
      </article>
      <article class="daewoon-card future">
        <small>🔜 다가올 대운</small>
        <strong>${daewoon.future.label}</strong>
        <p>${daewoon.future.text}</p>
        <p class="small"><strong>🗝️ 핵심 비책</strong> ${daewoon.future.tip}</p>
        <details class="daewoon-detail"><summary>연도별 상세 흐름 보기</summary>${daewoon.future.yearly}</details>
      </article>
    </div>`;

  engineBox.innerHTML = `<h3>🧮 엔진 정보</h3>
  <p class="small">엔진: ${report?.data?.engine || '@orrery/core'}</p>
  <p class="small">라이선스: ${report?.data?.license || 'AGPL-3.0-only'}</p>
  <p class="small"><a href="${report?.data?.sourceUrl || 'https://github.com/rath/orrery'}" target="_blank" rel="noopener">소스 저장소 보기</a></p>`;
}

render();
