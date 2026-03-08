const resultBox = document.getElementById('resultBox');
const coreMetricsBox = document.getElementById('coreMetricsBox');
const fiveElementsBox = document.getElementById('fiveElementsBox');
const luckyGuideBox = document.getElementById('luckyGuideBox');
const shareBox = document.getElementById('shareBox');
const gradeBox = document.getElementById('gradeBox');
const pillarsBox = document.getElementById('pillarsBox');
const ossEngineBox = document.getElementById('ossEngineBox');
const totalFortuneBox = document.getElementById('totalFortuneBox');
const socialShareBox = document.getElementById('socialShareBox');
const bridgeBox = document.getElementById('bridgeBox');
const chartsBox = document.getElementById('chartsBox');
const timelineBox = document.getElementById('timelineBox');
const briefingBox = document.getElementById('briefingBox');
const counselorBox = document.getElementById('counselorBox');
const goldenTimeCard = document.getElementById('goldenTimeCard');
const mindKeywordCard = document.getElementById('mindKeywordCard');
const lockedReportBox = document.getElementById('lockedReportBox');
const revealCtaCard = document.getElementById('revealCtaCard');
const overlay = document.getElementById('resultOverlay');
const reportTitle = document.getElementById('reportTitle');
const viewModeSwitch = document.getElementById('viewModeSwitch');
const webtoonModeBox = document.getElementById('webtoonModeBox');
const saved = localStorage.getItem('ff-result');
if (totalFortuneBox) totalFortuneBox.hidden = true;
let pendingOrreryEvidence = null;
let latestOrreryData = null;

function animateGaugeMetrics(root = document) {
  const widgets = [...root.querySelectorAll('.gauge-card[data-target]')];
  widgets.forEach((card, idx) => {
    const target = Number(card.dataset.target || 0);
    const valueEl = card.querySelector('.gauge-value');
    const ring = card.querySelector('.gauge-ring-progress');
    if (!valueEl || !ring) return;

    const radius = Number(ring.getAttribute('r') || 52);
    const circumference = 2 * Math.PI * radius;
    ring.style.strokeDasharray = `${circumference}`;
    ring.style.strokeDashoffset = `${circumference}`;

    const started = performance.now() + idx * 260 + 220;
    const duration = 2400;

    const step = (now) => {
      const p = Math.min(1, Math.max(0, (now - started) / duration));
      const eased = 1 - Math.pow(1 - p, 4);
      const current = Math.round(target * eased);
      valueEl.textContent = `${current}%`;
      ring.style.strokeDashoffset = `${circumference * (1 - eased * (target / 100))}`;
      if (p < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  });
}

function hourToBranchLabel(time = '') {
  const hour = Number(String(time).split(':')[0]);
  if (Number.isNaN(hour)) return '미상시';
  if (hour >= 23 || hour < 1) return '자시(子時)';
  if (hour < 3) return '축시(丑時)';
  if (hour < 5) return '인시(寅時)';
  if (hour < 7) return '묘시(卯時)';
  if (hour < 9) return '진시(辰時)';
  if (hour < 11) return '사시(巳時)';
  if (hour < 13) return '오시(午時)';
  if (hour < 15) return '미시(未時)';
  if (hour < 17) return '신시(申時)';
  if (hour < 19) return '유시(酉時)';
  if (hour < 21) return '술시(戌時)';
  return '해시(亥時)';
}

function buildOrreryEvidence(data, concern = '') {
  const selfPillars = data?.self?.pillars || [];
  const partnerPillars = data?.partner?.pillars || [];
  const selfUnseong = selfPillars.map((p) => p.unseong).filter(Boolean);
  const partnerUnseong = partnerPillars.map((p) => p.unseong).filter(Boolean);
  const selfSipsin = selfPillars.map((p) => p.stemSipsin).filter(Boolean);
  const partnerSipsin = partnerPillars.map((p) => p.stemSipsin).filter(Boolean);

  const stems = [...selfPillars, ...partnerPillars].map((p) => p.stem).filter(Boolean);
  const branches = [...selfPillars, ...partnerPillars].map((p) => p.branch).filter(Boolean);
  const hasFire = stems.some((s) => ['丙', '丁'].includes(s)) || branches.some((b) => ['巳', '午'].includes(b));
  const hasMetal = stems.some((s) => ['庚', '辛'].includes(s)) || branches.some((b) => ['申', '酉'].includes(b));
  const hasWater = stems.some((s) => ['壬', '癸'].includes(s)) || branches.some((b) => ['子', '亥'].includes(b));
  const hasWood = stems.some((s) => ['甲', '乙'].includes(s)) || branches.some((b) => ['寅', '卯'].includes(b));

  let ruleStability = '기본 균형형';
  let ruleReaction = '기본 소통형';

  const stabilityCore = concern === '일반 궁합'
    ? `${selfUnseong.slice(0, 2).join('·') || '운성 데이터'}${partnerUnseong.length ? ` ↔ ${partnerUnseong.slice(0, 2).join('·')}` : ''}`
    : `${selfUnseong.slice(0, 2).join('·') || '운성 데이터'}`;

  let stabilityHint = `원국 근거: ${stabilityCore} 흐름이 보여서, 관계 안정은 리듬 조절형으로 해석했어.`;
  if (hasFire && hasMetal) {
    ruleStability = '열정-원칙 충돌형';
    stabilityHint = '원국 근거: 화(火)·금(金) 기운이 동시에 강해 열정은 높지만 충돌 시 완충이 느린 화극금 패턴이 보여.';
  } else if (hasWood && hasFire) {
    ruleStability = '상생 추진형';
    stabilityHint = '원국 근거: 목(木)→화(火) 상생 흐름이 살아 있어 관계 추진력과 회복력이 같이 올라가는 구조야.';
  } else if (!hasWater) {
    ruleStability = '감정 냉각 보완형';
    stabilityHint = '원국 근거: 수(水) 기운이 약해 감정 온도 조절이 느리게 작동할 수 있어 안정도에 보수적으로 반영했어.';
  }

  const reactionCore = concern === '일반 궁합'
    ? `${selfSipsin.slice(0, 2).join('·') || '십신 데이터'}${partnerSipsin.length ? ` / ${partnerSipsin.slice(0, 2).join('·')}` : ''}`
    : `${selfSipsin.slice(0, 2).join('·') || '십신 데이터'}`;

  let reactionHint = `성향 근거: ${reactionCore} 조합에서 표현 템포 차이가 보여 소통 반응도에 반영했어.`;
  const yangCount = stems.filter((s) => ['甲', '丙', '戊', '庚', '壬'].includes(s)).length;
  if (yangCount >= Math.ceil(stems.length / 2)) {
    ruleReaction = '직설 소통 보완형';
    reactionHint = '성향 근거: 양(陽) 기질이 강해 경청보다 선발언 패턴이 나타나서 소통 반응도 보정이 들어갔어.';
  } else if (hasWater && hasWood) {
    ruleReaction = '경청 반응 상승형';
    reactionHint = '성향 근거: 수(水)→목(木) 흐름이 살아 있어 질문·경청형 대화에서 반응도가 빠르게 회복되는 구조야.';
  }

  return { stabilityHint, reactionHint, ruleStability, ruleReaction };
}

function applyOrreryEvidence(evidence) {
  if (!evidence) return;
  const s = document.getElementById('metricEvidenceStability');
  const r = document.getElementById('metricEvidenceReaction');
  const b = document.getElementById('briefingEvidence');
  if (!s || !r) {
    pendingOrreryEvidence = evidence;
    return;
  }
  s.textContent = `${evidence.stabilityHint} · 해석 타입: ${evidence.ruleStability || '기본 균형형'}`;
  r.textContent = `${evidence.reactionHint} · 해석 타입: ${evidence.ruleReaction || '기본 소통형'}`;
  if (b) b.textContent = `${evidence.stabilityHint} (${evidence.ruleStability || '기본 균형형'}) ${evidence.reactionHint} (${evidence.ruleReaction || '기본 소통형'})`;
}

function applyEnergyCompare(data) {
  const bars = document.querySelectorAll('[data-energy-bar]');
  if (!bars.length) return;
  const getEnergyCount = (pillars = []) => {
    const counts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
    pillars.forEach((p) => {
      counts[p.stemElement] = (counts[p.stemElement] || 0) + 1;
      counts[p.branchElement] = (counts[p.branchElement] || 0) + 1;
    });
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    const key = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'earth';
    return { key, pct: Math.max(1, Math.round((counts[key] / total) * 100)) };
  };
  const me = getEnergyCount(data?.self?.pillars || []);
  const partner = getEnergyCount(data?.partner?.pillars || []);
  const harmonyText = Math.abs(me.pct - partner.pct) <= 8 ? '조화' : '보완 필요';

  const map = {
    me: me,
    partner: partner
  };
  bars.forEach((el) => {
    const who = el.getAttribute('data-energy-bar');
    const v = map[who] || { key: 'earth', pct: 50 };
    el.classList.remove('wood', 'fire', 'earth', 'metal', 'water');
    el.classList.add(v.key);
    el.style.setProperty('--w', `${v.pct}%`);
  });
  const mePct = document.getElementById('energyMePct');
  const partnerPct = document.getElementById('energyPartnerPct');
  const harmony = document.getElementById('energyHarmonyText');
  if (mePct) mePct.textContent = `${me.pct}%`;
  if (partnerPct) partnerPct.textContent = `${partner.pct}%`;
  if (harmony) harmony.textContent = harmonyText;
}

function renderPillarsGrid(data, concern = '') {
  if (!pillarsBox) return;
  const cols = ['시', '일', '월', '년'];
  const toneMap = { wood: 'wood', fire: 'fire', earth: 'earth', metal: 'metal', water: 'water' };

  const renderCell = (p = {}, i = 0, type = 'stem') => {
    const isDay = i === 1;
    const tone = toneMap[type === 'stem' ? p.stemElement : p.branchElement] || 'earth';
    const main = type === 'stem' ? (p.stem || '-') : (p.branch || '-');
    const sub = type === 'stem' ? (p.stemSipsin || '-') : (p.unseong || p.branchSipsin || '-');
    return `<div class="webtoon-cell ${tone} ${isDay ? 'is-day' : ''}"><small>${cols[i]}</small><strong>${main}</strong><em>${sub}</em></div>`;
  };

  const renderClassicTable = (title, pillars = []) => {
    const safe = pillars.slice(0, 4);
    return `<article class="webtoon-pillar-panel">
      <h4>${title}</h4>
      <div class="webtoon-pillar-table">
        <div class="row-label">천간</div>
        ${safe.map((p, i) => renderCell(p, i, 'stem')).join('')}
        <div class="row-label">지지</div>
        ${safe.map((p, i) => renderCell(p, i, 'branch')).join('')}
      </div>
      <p class="small">*예시용 카드 구성처럼 원국 가독성 우선으로 보여줘.</p>
    </article>`;
  };

  const hasPartner = concern === '일반 궁합' && data?.partner?.pillars?.length;
  const myDay = data?.self?.pillars?.[1]?.ganzi || '-';
  const partnerDay = data?.partner?.pillars?.[1]?.ganzi || '-';

  pillarsBox.innerHTML = `<section class="webtoon-chapter" id="chapter-pillar">
    <header class="chapter-head">
      <span class="chapter-no">제1장</span>
      <h3>나의 사주팔자</h3>
      <p class="small">생년월일시를 기반으로 시·일·월·년 기둥을 읽어. 핵심은 일주(일간/일지)야.</p>
    </header>

    <div class="speech-row">
      <div class="speech-bubble">각각의 기둥은 위아래로 나뉘어 하늘의 기운(천간)과 땅의 기운(지지)을 보여줘.</div>
      <div class="speech-bubble">그중에서도 가장 중요한 건 일주(◉) — 나라는 사람의 중심 축이야.</div>
    </div>

    ${renderClassicTable('내 원국', data?.self?.pillars || [])}
    ${hasPartner ? `<div class="speech-row single"><div class="speech-bubble emphasis">궁합 비교 포인트: ${myDay} ↔ ${partnerDay} (일주 연결)</div></div>${renderClassicTable('상대 원국', data.partner.pillars)}` : ''}
  </section>`;
}

function renderTotalFortuneSection(data, concern = '', userName = '당신', targetName = '') {
  if (!totalFortuneBox) return;
  if (!data?.self?.pillars?.length) {
    totalFortuneBox.hidden = true;
    return;
  }

  const allPillars = [
    ...(data?.self?.pillars || []),
    ...(data?.partner?.pillars || [])
  ];
  const elems = allPillars.flatMap((p) => [p.stemElement, p.branchElement]).filter(Boolean);
  const cnt = elems.reduce((acc, e) => ({ ...acc, [e]: (acc[e] || 0) + 1 }), {});
  const names = { wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)' };
  const ordered = Object.entries(cnt).sort((a, b) => b[1] - a[1]);
  const strongKey = ordered[0]?.[0] || 'earth';
  const weakKey = ordered[ordered.length - 1]?.[0] || 'water';
  const strong = names[strongKey] || '중심 기운';
  const weak = names[weakKey] || '보완 기운';

  const rows = [
    {
      icon: '💗',
      title: '연애 · 관계 총운',
      hook: `${strong} 중심의 강한 끌림, 표현 밸런스가 성패를 가른다`,
      body: `${userName}${targetName ? `·${targetName}` : ''} 관계는 ${strong} 기운이 주도해서 초반 몰입감이 빠른 편이야. 다만 ${weak} 기운이 약한 날엔 말의 온도 차가 생길 수 있으니, 결론보다 감정 확인을 먼저 하는 게 좋아.`
    },
    {
      icon: '🏠',
      title: '가정 · 기반운',
      hook: '독립성과 안정성의 균형이 핵심',
      body: `${strong} 기운이 생활 리듬을 밀어주지만, 집안·기반운은 ${weak} 보완이 필요해. 중요한 결정을 급히 내리기보다 1~2주 관찰 후 확정하면 흔들림을 줄일 수 있어.`
    },
    {
      icon: '🧑‍🤝‍🧑',
      title: '대인 · 사회운',
      hook: '겉인연은 넓고, 깊은 인연은 선별형',
      body: `${strong} 기운 덕분에 사람을 모으는 힘은 좋아. 대신 에너지 소모가 큰 자리에서는 ${weak} 기운이 빠르게 마르기 쉬워서, 약속 밀도 조절과 회복 루틴이 필요해.`
    },
    {
      icon: '💼',
      title: '직업 · 성취운',
      hook: '집중력 구간을 잡으면 성과 폭발형',
      body: `${strong} 기운이 목표 추격력에 유리하게 작동해. 올해는 짧은 다중작업보다 한 번에 한 축을 깊게 파는 방식이 성취운을 크게 끌어올려.`
    },
    {
      icon: '💰',
      title: '재물 · 금전운',
      hook: '흐름은 좋고, 지출 규칙이 수익을 지킨다',
      body: `돈복은 들어오는 문이 열려 있지만 ${weak} 기운이 약하면 새는 돈이 생기기 쉬워. 자동이체·고정지출 상한 같은 규칙 하나만 잡아도 총운 체감이 확 좋아져.`
    },
    {
      icon: '🧘',
      title: '건강 · 생활운',
      hook: `${weak} 보완 루틴이 전체 운의 바닥을 올린다`,
      body: `과열 구간엔 수면·수분·호흡처럼 기본 루틴이 곧 개운법이야. ${weak} 기운 보완 색/장소를 주 2회만 실천해도 컨디션 변동폭이 줄어들어 전체총운이 안정돼.`
    }
  ];

  totalFortuneBox.hidden = false;
  totalFortuneBox.innerHTML = `<h3>🌠 만세력 전체총운</h3>
    <p class="small">원국 중심 기운 <strong>${strong}</strong> · 보완 기운 <strong>${weak}</strong> 기준으로 읽은 전체 흐름이야.</p>
    <div class="total-fortune-list">${rows.map((r, i) => `<details class="fortune-acc" ${i === 0 ? 'open' : ''}><summary><span class="icon">${r.icon}</span><span class="txt">${r.hook}</span><span class="arr">⌄</span></summary><div class="fortune-body"><strong>${r.title}</strong><p>${r.body}</p></div></details>`).join('')}</div>`;
}

function setupTypingEffect() {
  const targets = [...document.querySelectorAll('.typing-target')];
  if (!targets.length) return;
  const type = (el) => {
    const full = el.dataset.fulltext || '';
    el.textContent = '';
    let idx = 0;
    const timer = setInterval(() => {
      idx += 1;
      el.textContent = full.slice(0, idx);
      if (idx >= full.length) clearInterval(timer);
    }, 18);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.typed === '1') return;
      el.dataset.typed = '1';
      type(el);
      io.unobserve(el);
    });
  }, { threshold: 0.35 });

  targets.forEach((el) => io.observe(el));
}

function setupMetricAccordion() {
  document.querySelectorAll('[data-acc-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-acc-toggle');
      const panel = document.querySelector(`[data-acc-panel="${key}"]`);
      if (!panel) return;
      const isOpen = panel.getAttribute('data-open') === '1';
      panel.setAttribute('data-open', isOpen ? '0' : '1');
      panel.style.maxHeight = isOpen ? '0px' : `${panel.scrollHeight + 10}px`;
      btn.textContent = isOpen ? '🔍 사주학적 근거 더 보기' : '🔽 접기';
    });
  });
}

function parseBirthClient(birth = '2000-01-01') {
  const raw = String(birth || '').trim();
  if (/^\d{8}$/.test(raw)) return { year: Number(raw.slice(0, 4)), month: Number(raw.slice(4, 6)), day: Number(raw.slice(6, 8)) };
  const normalized = raw.replace(/\./g, '-').replace(/\//g, '-');
  const [y, m, d] = normalized.split('-').map((v) => Number(v));
  return { year: y || 2000, month: m || 1, day: d || 1 };
}

function parseTimeClient(time = '') {
  const v = String(time || '').trim();
  if (!v || v.includes('모름')) return { hour: 12, minute: 0, unknownTime: true };
  const [h, m] = v.split(':').map((x) => Number(x));
  return { hour: Number.isFinite(h) ? h : 12, minute: Number.isFinite(m) ? m : 0, unknownTime: false };
}

function mapGenderClient(g = '') {
  const s = String(g || '').toLowerCase();
  if (s.includes('남') || s === 'm') return 'M';
  if (s.includes('여') || s === 'f') return 'F';
  return 'F';
}

function stemToElement(stem = '') {
  const m = { '甲': 'wood', '乙': 'wood', '丙': 'fire', '丁': 'fire', '戊': 'earth', '己': 'earth', '庚': 'metal', '辛': 'metal', '壬': 'water', '癸': 'water' };
  return m[stem] || 'earth';
}
function branchToElement(branch = '') {
  const m = { '寅': 'wood', '卯': 'wood', '巳': 'fire', '午': 'fire', '辰': 'earth', '戌': 'earth', '丑': 'earth', '未': 'earth', '申': 'metal', '酉': 'metal', '亥': 'water', '子': 'water' };
  return m[branch] || 'earth';
}

async function calculateClientSideOrrery(intake = {}, concern = '') {
  const mod = await import('https://cdn.jsdelivr.net/npm/@orrery/core@0.3.0/dist/saju.js');
  const makeOne = (person = {}) => {
    const { year, month, day } = parseBirthClient(person.birth || '2000-01-01');
    const { hour, minute, unknownTime } = parseTimeClient(person.birthTime || '');
    const input = { year, month, day, hour, minute, unknownTime, gender: mapGenderClient(person.gender) };
    const r = mod.calculateSaju(input);
    return {
      input,
      pillars: (r.pillars || []).map((p) => ({
        ganzi: p?.pillar?.ganzi,
        stem: p?.pillar?.stem || '',
        branch: p?.pillar?.branch || '',
        stemElement: stemToElement(p?.pillar?.stem || ''),
        branchElement: branchToElement(p?.pillar?.branch || ''),
        stemSipsin: p?.stemSipsin,
        unseong: p?.unseong
      }))
    };
  };

  const self = makeOne({ birth: intake.birth, birthTime: intake.birthTime, gender: intake.gender });
  const partner = (concern === '일반 궁합' && intake.partnerBirth)
    ? makeOne({ birth: intake.partnerBirth, birthTime: intake.partnerBirthTime, gender: intake.partnerGender })
    : null;

  return {
    ok: true,
    engine: '@orrery/core@0.3.0 (browser fallback)',
    license: 'AGPL-3.0-only',
    sourceUrl: 'https://github.com/rath/orrery',
    self,
    partner
  };
}

async function renderOrreryEngineBox(intake = {}, concern = '') {
  if (!ossEngineBox) return;
  ossEngineBox.innerHTML = '<h3>오러리 기반 원국 계산 중...</h3>';
  try {
    const payload = {
      self: {
        birth: intake.birth,
        birthTime: intake.birthTime,
        gender: intake.gender,
        birthCity: intake.birthCity || intake.birthPlace || '서울특별시'
      }
    };
    const needPartner = concern === '일반 궁합' && intake.partnerBirth;
    if (needPartner) {
      payload.partner = {
        birth: intake.partnerBirth,
        birthTime: intake.partnerBirthTime,
        gender: intake.partnerGender,
        birthCity: intake.partnerBirthCity || intake.partnerBirthPlace || intake.birthCity || intake.birthPlace || '서울특별시'
      };
    }

    const res = await fetch('/api/orrery/saju', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const ct = res.headers.get('content-type') || '';
    if (!res.ok || !ct.includes('application/json')) throw new Error('api_unavailable');
    const data = await res.json();
    if (!data?.ok) throw new Error(data?.error || 'engine error');

    const selfPillars = (data.self?.pillars || []).map((p) => p.ganzi).filter(Boolean);
    const partnerPillars = (data.partner?.pillars || []).map((p) => p.ganzi).filter(Boolean);

    ossEngineBox.innerHTML = `<h3>🧮 오픈소스 엔진 기반 원국</h3>
      <p class="small">${selfPillars.length ? `내 사주: <strong>${selfPillars.join(' · ')}</strong>` : '내 사주 데이터 계산 대기중'}</p>
      ${partnerPillars.length ? `<p class="small">상대 사주: <strong>${partnerPillars.join(' · ')}</strong></p>` : ''}
      <p class="small">입력 기준: ${payload.self.birth || '-'} ${payload.self.birthTime || '모름'} · 한국/${payload.self.birthCity || '서울특별시'} · 양력</p>
      <p class="small">엔진: ${data.engine} · 라이선스: ${data.license}</p>
      <p class="small"><a href="${data.sourceUrl}" target="_blank" rel="noopener">소스코드 공개 저장소 보기</a></p>`;

    latestOrreryData = data;
    if (pillarsBox) pillarsBox.hidden = false;
    renderPillarsGrid(data, concern);
    renderTotalFortuneSection(data, concern, intake.name || '당신', intake.partnerName || intake.targetName || '');
    applyOrreryEvidence(buildOrreryEvidence(data, concern));
    applyEnergyCompare(data);
  } catch (e) {
    if (pillarsBox) pillarsBox.hidden = true;
    ossEngineBox.innerHTML = `<h3>🧮 오픈소스 엔진 연결</h3><p class="small">엔진 계산에 실패했어. (${e.message || 'unknown'})</p>`;
  }
}

function buildYearTimelineData(concern = '일반 궁합') {
  if (concern === '일반 궁합') {
    return {
      2025: {
        label: '지나온 관계 흐름',
        keywords: ['#서로탐색', '#관계재정렬', '#기반쌓기'],
        desc: '작년은 두 사람이 서로의 차이를 확인하고 관계의 기본 리듬을 맞춰가던 시기였어. 빠른 결론보다 이해의 폭을 넓히는 과정이었어.',
        months: [44, 46, 45, 47, 50, 52, 49, 53, 55, 58, 60, 62],
        tone: 'past'
      },
      2026: {
        label: '현재의 관계 운세',
        keywords: ['#관계상승', '#신뢰강화', '#표현조율'],
        desc: '올해는 관계의 밀도가 올라가는 해야. 서로의 강점을 연결하면 상승폭이 크고, 감정 표현만 부드럽게 조율하면 충돌을 크게 줄일 수 있어.',
        months: [60, 63, 67, 71, 76, 74, 79, 83, 80, 85, 87, 89],
        tone: 'now'
      },
      2027: {
        label: '함께 준비할 미래',
        keywords: ['#관계안정', '#장기합', '#공동성장'],
        desc: '내년은 함께 만든 신뢰가 구조로 자리 잡는 시기야. 역할 분담과 공감 실천법이 안정되면 장기적으로 더 단단한 관계를 만들 수 있어.',
        months: [66, 68, 72, 75, 78, 81, 83, 85, 84, 87, 89, 91],
        tone: 'future'
      },
      tip: '💞 우리 관계 포인트: 속도를 맞추고, 감정 표현을 한 템포 부드럽게 가져가면 운이 커져.'
    };
  }

  const concernTip = {
    '금전/재산': '💰 금전운: 5월 이후 목돈이 들어올 운세가 강해. 재테크는 장기 안목으로 접근해.',
    '취업/직장': '💼 직장운: 상반기 준비, 하반기에 승진/이동수가 강해.',
    '애정운': '❤️ 애정운: 매력은 상승하지만 화법을 부드럽게 가져가야 충돌을 줄여.',
    '사업/창업': '🚀 사업운: 올해 실험, 내년 수확 구조가 가장 안정적이야.'
  };
  return {
    2025: {
      label: '지나온 흐름',
      keywords: ['#인내심', '#내실다지기', '#정체기극복'],
      desc: '작년은 기운이 안으로 수렴되며 뿌리를 깊게 내린 시기였어. 생각보다 결과가 더뎠지만, 올해 도약을 위한 기반을 만든 해였어.',
      months: [40, 42, 41, 44, 47, 49, 46, 50, 52, 54, 57, 60],
      tone: 'past'
    },
    2026: {
      label: '현재의 운세',
      keywords: ['#거침없는도전', '#문서운상승', '#확실한성과'],
      desc: '병오(丙午)의 불 기운이 강하게 들어와 정체되던 흐름이 풀리는 해야. 무대 중앙으로 나갈수록 성과가 빨라져. 다만 강한 기세로 인한 마찰은 조심해.',
      months: [58, 61, 65, 69, 74, 71, 77, 81, 79, 84, 86, 88],
      tone: 'now'
    },
    2027: {
      label: '준비할 미래',
      keywords: ['#수확의계절', '#관계의안정', '#장기적계획'],
      desc: '내년은 올해의 도전이 자리 잡고 결실로 이어지는 시기야. 급변보다 유지·관리 전략이 수익과 평판을 지켜줄 가능성이 높아.',
      months: [64, 66, 70, 72, 75, 78, 80, 83, 82, 85, 87, 89],
      tone: 'future'
    },
    tip: concernTip[concern] || '✨ 올해 포인트: 결정은 빠르게, 표현은 부드럽게 가져가면 운이 살아.'
  };
}

function renderTimelineCard(data, concern = '일반 궁합') {
  if (!timelineBox) return;
  const years = [2025, 2026, 2027];
  const thisYear = 2026;
  const title = concern === '일반 궁합' ? '두 사람의 관계 타임라인' : '나의 운세 타임라인';
  const summary = concern === '일반 궁합' ? '두 사람 궁합 흐름 기반 해석' : `인생 총운 · ${concern} 흐름 기반 해석`;
  const useFold = concern !== '일반 궁합';
  timelineBox.innerHTML = useFold
    ? `<details class="timeline-fold" open><summary><span>${title}</span><em>${summary}</em></summary><div class="timeline-fold-body"><div class="timeline-tabs" id="yearTabs">${years.map((y) => `<button type="button" data-year="${y}" class="${y === thisYear ? 'active' : ''}">${y}</button>`).join('')}</div><div class="timeline-panel" id="timelinePanel"></div></div></details>`
    : `<h3>${title}</h3><div class="timeline-summary">${summary}</div><div class="timeline-tabs" id="yearTabs">${years.map((y) => `<button type="button" data-year="${y}" class="${y === thisYear ? 'active' : ''}">${y}</button>`).join('')}</div><div class="timeline-panel" id="timelinePanel"></div>`;

  const panel = timelineBox.querySelector('#timelinePanel');
  const drawYear = (year) => {
    const y = data[year];
    if (!panel || !y) return;
    const max = Math.max(...y.months);
    const min = Math.min(...y.months);
    const range = Math.max(1, max - min);
    panel.className = `timeline-panel tone-${y.tone || 'now'}`;
    panel.innerHTML = `<p class="small">${y.label}</p>
      <p class="timeline-hash">${y.keywords.join(' ')}</p>
      <p><strong>${y.desc}</strong></p>
      <div class="monthly-bars">${y.months.map((v, i) => {
        const h = 18 + Math.round(((v - min) / range) * 82);
        return `<div class="mbar"><span style="--i:${i};height:${h}%" title="${i + 1}월 ${v}"></span><em>${i + 1}월</em></div>`;
      }).join('')}</div>
      <p class="small timeline-tip">${data.tip}</p>`;
  };

  drawYear(thisYear);
  timelineBox.querySelectorAll('#yearTabs [data-year]').forEach((btn) => {
    btn.addEventListener('click', () => {
      timelineBox.querySelectorAll('#yearTabs button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      panel?.classList.remove('fade-in');
      void panel?.offsetWidth;
      drawYear(Number(btn.dataset.year));
      panel?.classList.add('fade-in');
    });
  });
}

function radarCoords(values, r = 86, cx = 110, cy = 110) {
  const angles = [-90, -18, 54, 126, 198];
  return values.map((v, i) => {
    const rr = (Math.max(0, Math.min(100, v)) / 100) * r;
    const rad = (angles[i] * Math.PI) / 180;
    return {
      keyIndex: i,
      x: Number((cx + rr * Math.cos(rad)).toFixed(1)),
      y: Number((cy + rr * Math.sin(rad)).toFixed(1))
    };
  });
}

function radarPoints(values, r = 86, cx = 110, cy = 110) {
  return radarCoords(values, r, cx, cy).map((p) => `${p.x},${p.y}`).join(' ');
}

function renderFiveElements(answerById, userName, partnerName) {
  if (!fiveElementsBox) return null;
  const keys = ['목', '화', '토', '금', '수'];
  const wood = ((answerById.Q1 || 3) + (answerById.Q6 || 3) + (answerById.Q11 || 3)) * 6;
  const fire = ((answerById.Q2 || 3) + (answerById.Q7 || 3) + (answerById.Q12 || 3)) * 6;
  const earth = ((answerById.Q3 || 3) + (answerById.Q8 || 3)) * 9;
  const metal = ((answerById.Q4 || 3) + (answerById.Q9 || 3)) * 9;
  const water = ((answerById.Q5 || 3) + (answerById.Q10 || 3)) * 9;
  const self = [wood, fire, earth, metal, water].map((v) => Math.max(28, Math.min(96, Math.round(v))));
  const partner = self.map((v, i) => Math.max(24, Math.min(94, Math.round(v - 8 + ((i % 2 === 0) ? 7 : -5)))));
  const harmony = Math.round(100 - (self.reduce((acc, v, i) => acc + Math.abs(v - partner[i]), 0) / 5));
  const oneLine = harmony >= 80 ? '서로의 기운이 상생하며 안정감을 높여주는 조화야.' : harmony >= 60 ? '다름이 있지만 대화를 통해 충분히 맞춰갈 수 있는 궁합이야.' : '기운의 충돌이 있어 속도보다 배려가 우선이야.';

  const selfPoints = radarCoords(self);
  const partnerPoints = radarCoords(partner);
  const axisPoints = radarCoords([100, 100, 100, 100, 100], 98);
  const pointClass = ['wood', 'fire', 'earth', 'metal', 'water'];

  fiveElementsBox.innerHTML = `<h3>✨ 오행 조화 에너지</h3>
    <div class="five-wrap">
      <svg viewBox="0 0 220 220" class="five-radar" aria-hidden="true">
        <polygon points="${radarPoints([100,100,100,100,100])}" class="radar-grid" />
        <polygon points="${radarPoints([75,75,75,75,75])}" class="radar-grid" />
        <polygon points="${radarPoints([50,50,50,50,50])}" class="radar-grid" />
        <polygon points="${radarPoints(self)}" class="radar-self" />
        <polygon points="${radarPoints(partner)}" class="radar-partner" />
        ${selfPoints.map((p, i) => `<circle cx="${p.x}" cy="${p.y}" r="4.2" class="radar-point self ${pointClass[i]}"></circle>`).join('')}
        ${partnerPoints.map((p, i) => `<circle cx="${p.x}" cy="${p.y}" r="3.4" class="radar-point partner ${pointClass[i]}"></circle>`).join('')}
        ${axisPoints.map((p, i) => `<text x="${p.x}" y="${p.y}" class="radar-axis-label ${pointClass[i]}" text-anchor="middle" dominant-baseline="middle">${keys[i]}</text>`).join('')}
      </svg>
      <div class="five-legend"><span class="dot self"></span>● ${userName} · <span class="dot partner"></span>■ ${partnerName || '상대'}</div>
    </div>
    <p class="small">🌳목 · 🔥화 · 🟨토 · ⚪금 · 🌊수</p>
    <p class="small">해석 가이드: 실선(나) · 점선/반투명(상대)으로 두 사람의 에너지 겹침을 보여줘.</p>
    <p class="five-line"><strong>${oneLine}</strong> (조화도 ${harmony}점)</p>`;

  return { keys, self, partner, harmony };
}

function renderLuckyGuide(elementPack) {
  if (!luckyGuideBox) return;
  if (!elementPack) {
    luckyGuideBox.hidden = true;
    return;
  }
  const { keys, self, partner } = elementPack;
  const avg = self.map((v, i) => Math.round((v + partner[i]) / 2));
  const minIdx = avg.indexOf(Math.min(...avg));
  const lacking = keys[minIdx];
  const keyMap = { '목': 'wood', '화': 'fire', '토': 'earth', '금': 'metal', '수': 'water' };
  const weakKey = keyMap[lacking] || 'water';

  const luckyMap = {
    '목': { place: '숲길·공원·화원·목조 카페', item: '나무 액세서리·식물·서적·초록 소품', color: '그린', reason: '성장 에너지를 살려 관계 정체를 풀어줘.' },
    '화': { place: '햇빛 테라스·번화가·공연장', item: '시트러스 향수·붉은 포인트 의상·조명', color: '레드/코랄', reason: '차가운 감정을 녹이고 대화 온도를 올려줘.' },
    '토': { place: '사찰·고궁·공예방·흙길 산책로', item: '도자기 소품·황토색 지갑·원석 팔찌', color: '머스타드/베이지', reason: '흔들리는 기운을 안정시켜 신뢰를 단단히 해줘.' },
    '금': { place: '빌딩 숲·정갈한 서재·보석상', item: '금속 시계·실버 주얼리·화이트 향수', color: '실버/화이트', reason: '흐트러진 생각을 정돈해 오해를 줄여줘.' },
    '수': { place: '호숫가·바다·분수 광장·온천', item: '블루 스카프·안경·수분 케어 아이템', color: '네이비/딥블루', reason: '막힌 대화의 흐름을 부드럽게 풀어줘.' }
  };
  const picked = luckyMap[lacking] || luckyMap['수'];

  const links = (window.FF_LUCKY_LINKS && window.FF_LUCKY_LINKS[weakKey]) || {};
  const placeLink = links.place?.url || `https://www.google.com/search?q=${encodeURIComponent(`${picked.place} 데이트`)}`;
  const itemLink = links.item?.url || `https://www.google.com/search?q=${encodeURIComponent(`${picked.item} 구매`)}`;

  luckyGuideBox.hidden = false;
  luckyGuideBox.innerHTML = `<h3><span class="section-badge">3</span> 행운 가이드</h3>
    <p class="small">✨ 부족한 ${lacking} 기운을 보완하면 두 분의 관계 흐름이 더 편안해져.</p>
    <div class="lucky-grid">
      <article class="lucky-item">
        <h4>📍 행운의 장소</h4>
        <strong>${picked.place}</strong>
        <p class="small">${picked.reason}</p>
      </article>
      <article class="lucky-item">
        <h4>🎁 행운의 아이템</h4>
        <strong>${picked.item}</strong>
        <p class="small">부족한 ${lacking} 기운을 채워 균형을 맞추는 데 도움 돼.</p>
      </article>
    </div>
    <p class="lucky-color">🎨 두 분의 행운 컬러: <strong>${picked.color}</strong></p>
    <div class="cta-row"><a class="btn secondary" href="${placeLink}" target="_blank" rel="noopener">근처 행운 장소 보기</a><a class="btn secondary" href="${itemLink}" target="_blank" rel="noopener">행운의 아이템 보기</a></div>`;
}

function setupWebtoonView({ concern, userName, targetName, totalScore, initialMode = 'report' }) {
  if (!webtoonModeBox || !viewModeSwitch) return;
  const concernLine = concern === '일반 궁합' ? `${userName}와 ${targetName || '상대'}의 인연선을 따라가보자.` : `${userName}의 ${concern} 흐름을 컷으로 풀어볼게.`;
  webtoonModeBox.innerHTML = `<div class="wt-cut reveal">
      <p class="wt-badge">특별 부록</p>
      <h3>웹툰으로 보는 내 사주</h3>
      <div class="wt-speech">오늘 당신의 핵심 기운은 <strong>${totalScore >= 75 ? '상승 흐름' : '정비 흐름'}</strong>이야.</div>
    </div>
    <div class="wt-cut reveal">
      <h4>컷 1 · 원국의 보석 상자</h4>
      <p>${concernLine}</p>
      <div class="wt-panel-placeholder">원국 8글자 컷</div>
    </div>
    <div class="wt-cut reveal">
      <h4>컷 2 · 대운 타임라인</h4>
      <div class="wt-timeline"><span>초년</span><span>청년</span><span>중년</span><span>말년</span></div>
      <p class="small">초년→청년→중년→말년으로 흐름을 만화 컷처럼 읽어줘.</p>
    </div>
    <div class="wt-cut reveal">
      <h4>컷 3 · 신강/신약 게이지</h4>
      <div class="wt-gauge"><i style="width:${Math.max(12, Math.min(100, totalScore))}%"></i></div>
      <p class="wt-speech">지금은 ${totalScore >= 70 ? '밀고 나갈 힘이 충분한' : '속도 조절이 필요한'} 구간이야.</p>
    </div>`;

  const contentSections = [
    resultBox, gradeBox, shareBox, fiveElementsBox, pillarsBox, totalFortuneBox,
    coreMetricsBox, luckyGuideBox, bridgeBox, chartsBox, timelineBox, briefingBox,
    goldenTimeCard, mindKeywordCard, lockedReportBox, counselorBox, socialShareBox,
    revealCtaCard, ossEngineBox
  ];

  const setMode = (mode = 'report') => {
    const isWebtoon = mode === 'webtoon';
    webtoonModeBox.hidden = !isWebtoon;
    contentSections.forEach((el) => {
      if (!el) return;
      if (isWebtoon) {
        el.dataset.prevHidden = el.hidden ? '1' : '0';
        el.hidden = true;
      } else {
        el.hidden = el.dataset.prevHidden === '1';
      }
    });
    viewModeSwitch.querySelectorAll('[data-view-mode]').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-view-mode') === mode);
    });
  };

  viewModeSwitch.querySelectorAll('[data-view-mode]').forEach((btn) => {
    btn.addEventListener('click', () => setMode(btn.getAttribute('data-view-mode') || 'report'));
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('on');
    });
  }, { threshold: 0.2 });
  webtoonModeBox.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  setMode(initialMode === 'webtoon' ? 'webtoon' : 'report');
}

if (!saved) {
  location.href = '/test.html';
} else {
  try {
    const data = JSON.parse(saved);
    const intake = JSON.parse(localStorage.getItem('ff-intake') || '{}');
    const userName = intake.name || '당신';
    const targetName = intake.partnerName || intake.targetName || '';

    const concern = data.troubleLabel || data.troubleType || '일반 궁합';
    renderOrreryEngineBox(intake, concern);
    const weatherMap = {
      '결혼 운세': { icon: '🌤️', label: '안정 속 점진적 상승' },
      '일반 궁합': { icon: '⛅', label: '구름 사이 맑음' },
      '애정운': { icon: '🌸', label: '온기 상승 기류' },
      '재회운': { icon: '⛈️', label: '폭풍우 후 약한 개임' },
      '금전/재산': { icon: '💰', label: '수입 파동 후 회복세' },
      '취업/직장': { icon: '💼', label: '변동 뒤 기회 유입' },
      '사업/창업': { icon: '🚀', label: '상승 기류 형성' },
      '속궁합': { icon: '🔥', label: '열기 상승 구간' },
      '키스 궁합': { icon: '💋', label: '밀착도 상승' }
    };
    const weather = weatherMap[concern] || weatherMap['일반 궁합'];
    const goldenTime = concern === '취업/직장' ? '09:20' : concern === '금전/재산' ? '14:10' : concern === '사업/창업' ? '10:40' : '21:20';
    const starWord = data.mode === 'ziwei' ? '천희(天喜)' : data.mode === 'saju' ? '문창(文昌)' : '홍염(紅艶)';
    const modeLabel = data.modeLabel || '종합';
    if (reportTitle) reportTitle.textContent = `${modeLabel} 정밀 분석 리포트`;

    const totalScore = data.finalScore || Math.max(55, Math.min(98, Math.round(((data.recoveryIndex || 66) + (data.reunionForce || 72) + (data.emotionTemp || 64)) / 3)));
    const summaryTags = (buildYearTimelineData(concern)[2026]?.keywords || ['#변화', '#문서운', '#성과']).slice(0, 3);
    const headerCopyByConcern = {
      '일반 궁합': {
        icon: '❤️',
        title: `${userName}님${targetName ? ` & ${targetName}님` : ''}의 정밀 궁합 분석`,
        sub: '두 분의 사주가 그리는 조화 포인트를 정밀하게 읽었어.',
        theme: 'compat'
      },
      '결혼 운세': {
        icon: '💍',
        title: `${userName}님의 생애 결혼 운세 리포트`,
        sub: '함께 걷게 될 미래와 결혼 타이밍을 사주 흐름으로 정리했어.',
        theme: 'marriage'
      },
      '금전/재산': {
        icon: '💰',
        title: `${userName}님의 2026 재물 흐름 분석`,
        sub: '타고난 재복과 올해의 자금 기회를 총정리했어.',
        theme: 'money'
      },
      '취업/직장': {
        icon: '💼',
        title: `${userName}님의 커리어 성공 리포트`,
        sub: '이직·승진·문서운 타이밍을 중심으로 전략을 잡아줬어.',
        theme: 'career'
      },
      '속궁합': {
        icon: '🔞',
        title: `${userName}님${targetName ? ` & ${targetName}님` : ''}의 은밀한 궁합 분석`,
        sub: '두 사람만의 신체 리듬과 교감 포인트를 집중 분석했어.',
        theme: 'adult'
      },
      '애정운': {
        icon: '🌹',
        title: `${userName}님에게 찾아올 다음 사랑의 흐름`,
        sub: '지금 사랑이 열리는 타이밍과 감정의 전환점을 짚어봤어.',
        theme: 'love'
      }
    };
    const header = headerCopyByConcern[concern] || {
      icon: weather.icon,
      title: `${userName}님의 ${concern} 정밀 분석`,
      sub: '선택한 고민을 기준으로 결과를 재구성했어.',
      theme: 'default'
    };

    const isCompat = concern === '일반 궁합';
    const bandPreview = data.gradeBand || (totalScore >= 85 ? 'A' : totalScore >= 60 ? 'B' : totalScore >= 40 ? 'C' : 'D');
    const compatHeroCopy = {
      A: '하늘이 맺어준 찰떡궁합',
      B: '서로 성장시키는 좋은 궁합',
      C: '배려가 핵심인 관계 흐름',
      D: '속도 조절이 필요한 관계'
    };
    const heroTitle = isCompat ? `${userName} ❤️ ${targetName || '상대'}` : header.title;
    const heroSub = isCompat ? (compatHeroCopy[bandPreview] || header.sub) : header.sub;
    const heroStability = data.reunionForce || 78;
    const heroReaction = data.recoveryIndex || 67;

    resultBox.innerHTML = `<div class="weather-hero hero-${header.theme}"><div class="hero-focus-wrap"><div class="mode-hero-badge hero-eyebrow">✨ 사주 정밀 궁합 리포트</div><h1 class="result-main-title hero-name">${heroTitle}</h1><div class="hero-grade-badge hero-grade-display">GRADE ${bandPreview}</div><p class="mode-hero-note destiny-line hand-font hero-one-liner">${heroSub}</p><div class="fortune-score-head">Score <strong>${totalScore} / 100</strong></div><div class="fortune-score-bar hero-score-bar"><span class="hero-score-fill" style="--score:${totalScore};"></span></div><div class="hero-chip-row">${summaryTags.map((tag) => `<span class="hero-chip">${tag}</span>`).join('')}</div></div></div>`;

    const compatGradeMap = {
      A: { grade: 'A', label: '천생연분: 찰떡궁합', brief: '서로의 부족함을 완벽히 채워주는, 하늘이 맺어준 인연입니다.', detail: '두 분은 오행과 성향이 조화롭고 함께 있을 때 운이 상승하는 결합입니다. 어려운 시기도 서로를 믿고 지혜롭게 넘어갈 수 있어.', tip: '서로에 대한 감사를 잊지 않으면 더할 나위 없는 축복받은 관계야.', color: '#f4cd72' },
      B: { grade: 'B', label: '금슬상화: 좋은 만남', brief: '서로 존중하며 함께 성장할 수 있는 안정적이고 따뜻한 관계입니다.', detail: '완벽하진 않아도 서로에게 긍정적인 자극이 되는 궁합이야. 의견 차이는 대화로 충분히 조율 가능하고 시간이 지날수록 신뢰가 깊어져.', tip: '사소한 단점보다 함께 만든 좋은 기억에 더 집중해봐.', color: '#c4c6cf' },
      C: { grade: 'C', label: '상생노력: 주의가 필요한 만남', brief: '서로의 다름을 인정하는 과정이 필요합니다. 인내심이 관계의 핵심입니다.', detail: '성격·가치관 충돌이 잦을 수 있어. 한쪽 기운이 강해 오해가 쌓일 가능성이 있으니 꾸준한 배려와 노력이 필요해.', tip: '내 방식을 고집하기보다 상대 입장에서 한 번 더 생각하는 유연함이 핵심이야.', color: '#d28c52' },
      D: { grade: 'D', label: '풍파주의: 변화와 성찰', brief: '서로에게 상처를 주기 쉬운 시기입니다. 적절한 거리두기와 성찰이 필요합니다.', detail: '오행 충돌이 강해 감정 소모가 커질 수 있는 구간이야. 중요한 결정을 잠시 미루고 관계의 본질을 차분히 돌아보는 게 좋아.', tip: '지금의 갈등은 더 깊은 이해 또는 각자의 성장을 위한 진통일 수 있어.', color: '#8b92a8' }
    };

    const defaultGradeMap = {
      A: { grade: 'A', label: '거침없는 도약의 시기', brief: '하늘의 기운이 당신을 돕고 있습니다. 무엇을 시작해도 좋은 결실을 맺을 운세입니다.', detail: '그동안 준비해온 일들이 비로소 빛을 발하는 시기입니다. 막혔던 금전 흐름이 뚫리고, 귀인의 도움으로 예상치 못한 성과를 거둘 수 있습니다. 스스로를 믿고 과감하게 추진하세요.', tip: '오는 운을 겸손하게 받아들이되, 기회가 왔을 때 망설이지 말고 붙잡으세요.', color: '#f4cd72' },
      B: { grade: 'B', label: '안정과 성장의 시기', brief: '평탄하고 안정적인 흐름 속에 있습니다. 내실을 다지며 한 단계 올라설 준비를 하세요.', detail: '큰 굴곡 없이 계획한 대로 일이 진행되는 시기입니다. 당장 폭발적인 성장은 아니더라도 꾸준한 노력이 미래의 자산이 됩니다.', tip: '급하게 서두르기보다 현재 리듬을 유지하며 작은 성취를 쌓아가세요.', color: '#c4c6cf' },
      C: { grade: 'C', label: '인내와 관리가 필요한 시기', brief: '주변 환경이 다소 불투명할 수 있습니다. 무리한 확장보다는 지키는 전략이 필요합니다.', detail: '에너지가 잠시 분산되는 구간입니다. 새로운 투자나 큰 변화보다 현재 상태 점검과 실수 최소화가 우선입니다.', tip: '중요한 결정은 잠시 유예하고, 심신을 먼저 회복해 에너지를 충전하세요.', color: '#d28c52' },
      D: { grade: 'D', label: '변화를 위한 정비의 시기', brief: '거센 비바람을 피해 잠시 쉬어가야 할 때입니다. 비운 뒤에야 새로운 것이 채워집니다.', detail: '예상치 못한 변수가 생길 수 있어 각별한 주의가 필요합니다. 억지 돌파보다 점검·정비가 더 큰 행운으로 이어집니다.', tip: '오늘의 시련은 더 큰 행운을 맞기 위한 액땜입니다. 마음을 비우고 다음 기회를 준비하세요.', color: '#8b92a8' }
    };

    const band = data.gradeBand || (totalScore >= 85 ? 'A' : totalScore >= 60 ? 'B' : totalScore >= 40 ? 'C' : 'D');
    const gradeMeta = (concern === '일반 궁합' ? compatGradeMap : defaultGradeMap)[band];

    if (resultBox) {
      const instantSummary = isCompat
        ? [
            `지금 관계 온도: ${heroSub}`,
            `${targetName || '상대'}와는 속도 조절이 결과를 좌우해.`,
            `오늘 바로 써먹을 포인트: 첫 문장은 짧고 부드럽게.`
          ]
        : [
            `현재 흐름 한줄: ${heroSub}`,
            `지금 우선순위: 무리한 확장보다 핵심 한 가지 집중.`,
            `오늘 행동 포인트: 감정보다 리듬을 먼저 관리해.`
          ];
      resultBox.insertAdjacentHTML('beforeend', `<div class="hero-merged-summary"><p class="grade-label"><strong>${gradeMeta.label}</strong></p><p class="small">${gradeMeta.brief}</p><div class="hero-instant-summary"><div class="hero-instant-summary-title">결과 먼저 요약</div><ul>${instantSummary.map((item) => `<li>${item}</li>`).join('')}</ul></div></div>`);
    }

    if (gradeBox) {
      gradeBox.hidden = true;
      gradeBox.innerHTML = '';
    }

    if (concern === '일반 궁합') {
      const pack = renderFiveElements(data.answerById || {}, userName, targetName);
      renderLuckyGuide(pack);
    } else {
      if (fiveElementsBox) fiveElementsBox.hidden = true;
      if (luckyGuideBox) luckyGuideBox.hidden = true;
    }

    if (shareBox) {
      shareBox.innerHTML = `<h3>결과 공유</h3><p class="small">인스타 스토리용 요약 카드를 저장해 공유해봐.</p><div class="cta-row"><button class="btn" id="saveSummaryBtn">결과 이미지 저장</button></div>`;
      document.getElementById('saveSummaryBtn')?.addEventListener('click', () => {
        const card = document.createElement('canvas');
        card.width = 1080; card.height = 1920;
        const ctx = card.getContext('2d');
        if (!ctx) return;
        const g = ctx.createLinearGradient(0, 0, 1080, 1920);
        g.addColorStop(0, '#1d1436'); g.addColorStop(1, '#4b2a82');
        ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 64px sans-serif'; ctx.fillText('Fate & Feeling', 80, 150);
        ctx.font = 'bold 76px sans-serif'; ctx.fillText(`${concern} ${totalScore}점`, 80, 320);
        ctx.font = '42px sans-serif'; ctx.fillText(summaryTags.join('  '), 80, 420);
        ctx.font = '38px sans-serif'; ctx.fillText(`${userName}님의 2026 운세 요약`, 80, 520);
        ctx.fillStyle = '#f4cd72'; ctx.fillRect(80, 580, Math.round(9.2 * totalScore), 18);
        const link = document.createElement('a');
        link.download = `fate-feeling-${Date.now()}.png`;
        link.href = card.toDataURL('image/png');
        link.click();
      });
    }

    if (socialShareBox) {
      socialShareBox.innerHTML = `<h3>결과 공유</h3><div class="cta-row"><button class="btn kakao-share" id="kakaoShareBtn">🗨 카카오톡으로 공유하기</button><button class="btn instagram-share" id="instaShareBtn">📸 인스타로 공유하기</button></div><div class="cta-row"><button class="btn secondary" id="copyLinkBtn">🔗 링크 복사</button></div>`;
      document.getElementById('kakaoShareBtn')?.addEventListener('click', () => {
        const text = `${userName}님의 2026년 운세 등급은 [${gradeMeta.grade}] (${totalScore}점)!\n지금 확인해봐: https://fate-feeling.vercel.app`;
        const url = `https://share.kakao.com/talk/friends/picker/link?url=${encodeURIComponent('https://fate-feeling.vercel.app')}&text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
      });
      document.getElementById('instaShareBtn')?.addEventListener('click', async () => {
        document.getElementById('saveSummaryBtn')?.click();
        try {
          await navigator.clipboard.writeText('https://fate-feeling.vercel.app');
        } catch (e) {
          // noop
        }
        setTimeout(() => alert('이미지 저장 완료! 인스타 스토리에서 업로드하면 돼.'), 240);
      });
      document.getElementById('copyLinkBtn')?.addEventListener('click', async () => {
        await navigator.clipboard.writeText('https://fate-feeling.vercel.app');
        alert('링크 복사 완료!');
      });
    }

    const firstGauge = Math.min(96, Math.max(35, data.reunionForce || 78));
    const secondGauge = Math.min(97, Math.max(35, data.recoveryIndex || 67));
    const firstLabel = isCompat ? '관계 안정도' : '핵심 가능성';
    const secondLabel = isCompat ? '소통 반응도' : '상대 반응도';

    const orreryEvidence = latestOrreryData ? buildOrreryEvidence(latestOrreryData, concern) : null;

    const getMetricDetail = (value, type) => {
      if (type === 'stability') {
        if (value >= 80) {
          return {
            summary: '안정감이 높은 축복 구간이야.',
            cause: `사주적 근거: 두 사람의 오행 분포가 상생 구조(목→화, 금→수)로 이어져 관계 회복 탄력이 좋아.${orreryEvidence ? ` (${orreryEvidence.ruleStability})` : ''}`, 
            solution: '솔루션: 갈등이 생겨도 당일 마무리 원칙을 지키면 안정 흐름을 더 오래 유지할 수 있어.'
          };
        }
        if (value >= 60) {
          return {
            summary: '기본 리듬은 맞지만 충돌 완화가 숙제야.',
            cause: '사주적 근거: 화(火)와 금(金) 기운이 동시에 강해 추진력은 좋지만 의견 충돌 시 마찰열이 커지기 쉬워.',
            solution: '솔루션: 다름을 틀림으로 보지 말고 역할 분담을 먼저 합의하면 안정도가 더 올라가.'
          };
        }
        if (value >= 50) {
          return {
            summary: '초반 열정은 강한데 감정 완충이 느린 편이야.',
            cause: '사주적 근거: 화극금(화가 금을 제어) 패턴이 보여 예민한 상황에서 말이 날카롭게 느껴질 가능성이 높아.',
            solution: '솔루션: 갈등 시 30분만 각자 정리 시간을 갖고 다시 대화하면 안정 구조가 빨리 회복돼.'
          };
        }
        return {
          summary: '감정 기복 관리가 최우선인 구간이야.',
          cause: '사주적 근거: 수(水) 기운이 약하고 화(火) 압력이 높아 감정 온도 조절이 어렵게 작동할 수 있어.',
          solution: '솔루션: 주 1회 관계 점검 대화를 실천법화하면 충돌 누적을 크게 줄일 수 있어.'
        };
      }

      if (value >= 80) {
        return {
          summary: '소통 운이 열려 있고 반응 템포가 잘 맞아.',
          cause: '사주적 근거: 음양 밸런스가 비교적 고르게 분포되어 주고받는 리듬이 안정적으로 유지돼.',
          solution: '솔루션: 좋은 반응이 왔을 때 감사 표현을 즉시 주면 관계 신뢰가 더 빠르게 올라가.'
        };
      }
      if (value >= 60) {
        return {
          summary: '기본 소통은 양호하지만 화법 보정이 필요해.',
          cause: '사주적 근거: 양(陽) 성향이 강해서 먼저 말하고 결론 내리려는 경향이 같이 나타나.',
          solution: '솔루션: 질문형 문장 1개를 먼저 던지고 의견을 말하면 반응도가 확실히 좋아져.'
        };
      }
      if (value >= 50) {
        return {
          summary: '표현 방식 차이로 오해가 생기기 쉬운 구간이야.',
          cause: '사주적 근거: 두 사람 모두 주관성이 강한 양(陽) 기질이라 경청보다 주장으로 시작하기 쉬워.',
          solution: '솔루션: 상대 말이 끝난 뒤 3초 쉬고 답하는 습관이 소통 운을 여는 핵심 키야.'
        };
      }
      return {
        summary: '감정 전달이 자주 엇갈리는 구간이야.',
        cause: '사주적 근거: 금(金)-수(水) 연결이 약해 의도 전달 과정에서 말의 온도가 차갑게 받아들여질 수 있어.',
        solution: '솔루션: 짧고 단정한 문장 + 감정 확인 질문을 같이 쓰면 오해를 줄일 수 있어.'
      };
    };

    const renderDeepAccordion = (type, value, gradeBand = 'B') => {
      const allPillars = [
        ...(latestOrreryData?.self?.pillars || []),
        ...(latestOrreryData?.partner?.pillars || [])
      ];
      const elems = allPillars.flatMap((p) => [p.stemElement, p.branchElement]).filter(Boolean);
      const cnt = elems.reduce((acc, e) => ({ ...acc, [e]: (acc[e] || 0) + 1 }), {});
      const names = { wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)' };
      const ordered = Object.entries(cnt).sort((a, b) => b[1] - a[1]);
      const strongKey = ordered[0]?.[0] || 'earth';
      const weakKey = ordered[ordered.length - 1]?.[0] || 'water';
      const strong = names[strongKey] || '특정';
      const weak = names[weakKey] || '보완';

      const toneMap = {
        A: {
          stability: [
            `${strong} 기운이 상생 축으로 이어져 두 분의 관계 회복력이 빠르게 작동하는 상위 구간이야.`,
            `${strong} 기운이 과열되는 날엔 사소한 말도 강하게 전달될 수 있어.`,
            `갈등이 오르면 20분 침묵으로 수(水) 기운을 보충하고, 합의 문장 1개만 남기는 게 좋아.`,
            `주 2회 감사 문장 실천법으로 ${weak} 기운을 채우면 안정 흐름을 오래 유지하기 쉬워.`
          ],
          reaction: [
            `${strong} 기운이 언어 에너지를 밀어 올려 반응 속도와 이해력이 높은 편이야.`,
            `익숙할수록 설명 생략이 생겨 오해가 생길 수 있어.`,
            `“요약 1문장 + 확인 질문 1개”로 말하면 소통의 상생 루프가 유지돼.`,
            `매일 5분 감정 체크로 ${weak} 기운을 보완하면 반응도 상단을 안정적으로 지킬 수 있어.`
          ]
        },
        B: {
          stability: [
            `${strong} 기운이 관계를 끌어가지만 ${weak} 기운 보완이 필요해서 완충 속도는 보통 수준이야.`,
            `피로한 시간대엔 ${strong} 기운이 과해져 말의 온도가 날카로워질 수 있어.`,
            `갈등 직후 30분 정리 → 핵심 문장 1개 교환이 안정도 회복에 가장 효율적이야.`,
            `2주간 주 2회 점검 대화를 고정하면 체감 안정도가 한 단계 올라갈 수 있어.`
          ],
          reaction: [
            `${strong} 기운으로 표현력은 좋지만, 먼저 말하려는 성향이 소통 저항을 만들 때가 있어.`,
            `상대 의도 확인 전 결론을 내리면 반응도 하락이 빨라져.`,
            `3초 멈춤 + 상대 문장 요약 후 의견 1문장으로 전환하면 좋아.`,
            `질문형 화법을 실천법화하면 ${weak} 기운 보완과 함께 반응도 변동 폭이 줄어들어.`
          ]
        },
        C: {
          stability: [
            `${strong} 기운이 강하고 ${weak} 기운이 약해 갈등 후 잔열이 길게 남는 구조야.`,
            `감정이 올라온 상태에서 결론을 급히 내리면 충돌이 누적돼.`,
            `즉시 해결보다 “감정 진정 후 1주제 대화”로 범위를 좁혀야 회복이 빨라져.`,
            `주 1회 갈등 리뷰로 재발 요인 1개씩 줄이면 안정도 반등 여지가 커.`
          ],
          reaction: [
            `${strong} 기운 중심 대화가 이어져 설명보다 주장 톤이 앞서기 쉬운 단계야.`,
            `순서가 뒤집히면(주장→경청) 상대는 방어적으로 반응해.`,
            `경청→요약→의견 1문장 순서를 지키는 게 핵심 개운 포인트야.`,
            `감정 큰 날엔 문장 수를 절반으로 줄여 ${weak} 기운 보완에 집중해.`
          ]
        },
        D: {
          stability: [
            `${strong} 기운 과열과 ${weak} 기운 부족이 겹쳐 감정 파동이 크게 나타나는 구간이야.`,
            `작은 오해도 빠르게 확대될 수 있어 즉시 결론은 피해야 해.`,
            `타임아웃 합의(대화 중지 시간/재개 시간)를 먼저 정하는 게 최우선이야.`,
            `2주간 매일 10분 체크인으로 기운을 안정시키면 하강 추세를 끊을 수 있어.`
          ],
          reaction: [
            `${strong} 기운이 강한 날엔 말의 강도가 올라가 의도와 다르게 전달되기 쉬워.`,
            `반응 지연보다 반응 과열이 문제라서 톤 관리가 먼저야.`,
            `한 문장·한 감정·한 요청 포맷으로 소통 강도를 낮추는 게 좋아.`,
            `텍스트 대신 3분 음성 대화로 ${weak} 기운을 보완하면 오해를 줄일 수 있어.`
          ]
        }
      };

      const setRaw = (toneMap[gradeBand] || toneMap.B)[type] || toneMap.B[type];
      const set = [...setRaw];
      const gaeunByWeak = {
        wood: {
          spell: '함께 <span class="spell-key">숲길</span>을 걷거나 <span class="spell-key">초록빛 식물</span>을 가까이 두세요. 새로운 시작의 생명력이 두 분의 관계에 활력을 불어넣어 줍니다.',
          place: '숲길 · 공원 · 화원 · 목조 카페',
          item: '나무 액세서리 · 식물 · 서적 · 초록 소품'
        },
        fire: {
          spell: '따뜻한 <span class="spell-key">차</span>를 마시며 밝은 조명 아래서 대화하세요. 차가워진 감정의 벽을 녹이고 서로의 진심을 밝게 비춰줍니다.',
          place: '햇빛 테라스 · 번화가 · 공연장',
          item: '시트러스/플로럴 향수 · 붉은 포인트 의상 · 조명'
        },
        earth: {
          spell: '<span class="spell-key">도자기 공방</span> 체험이나 황토색 아이템을 활용해 보세요. 흔들리는 마음을 다잡고 관계의 단단한 뿌리를 내리게 합니다.',
          place: '사찰 · 고궁 · 공예방 · 흙길 산책로',
          item: '도자기 소품 · 황토색 지갑 · 호안석 팔찌'
        },
        metal: {
          spell: '<span class="spell-key">금속 액세서리</span>를 착용하거나 정갈한 공간에서 시간을 보내세요. 흐트러진 생각의 질서를 잡고 명확한 결단을 돕습니다.',
          place: '현대적 빌딩 숲 · 정갈한 서재 · 보석상',
          item: '금속 시계 · 은색 주얼리 · 백색 계열 향수'
        },
        water: {
          spell: '<span class="spell-key">강변 산책</span>이나 푸른색 소품을 가까이하세요. 막힌 대화의 흐름을 유연하게 만들고 깊은 공감을 이끌어냅니다.',
          place: '호숫가 · 바다 · 분수 광장 · 온천',
          item: '안경 · 푸른 스카프 · 수분감 화장품'
        }
      };
      const picked = gaeunByWeak[weakKey] || gaeunByWeak.water;
      set[2] = picked.spell;
      const weakLabel = names[weakKey] || '보완 기운';
      const links = (window.FF_LUCKY_LINKS && window.FF_LUCKY_LINKS[weakKey]) || {};
      const placeLink = links.place?.url || `https://www.google.com/search?q=${encodeURIComponent(`${picked.place} 데이트 추천`)}`;
      const itemLink = links.item?.url || `https://www.google.com/search?q=${encodeURIComponent(`${picked.item} 추천`)}`;
      const placeLinkLabel = links.place?.label || '추천 장소';
      const itemLinkLabel = links.item?.label || '추천 아이템';
      const imageMap = {
        wood: { place: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80', item: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=1200&q=80' },
        fire: { place: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80', item: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80' },
        earth: { place: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', item: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=80' },
        metal: { place: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80', item: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80' },
        water: { place: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', item: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80' }
      };
      const img = imageMap[weakKey] || imageMap.water;

      const luckCards = `<div class="luck-scroll luck-${weakKey}">
        <article class="luck-commerce-card">
          <div class="luck-label">${userName}님께 필요한 #${weakLabel}</div>
          <img src="${img.place}" alt="행운의 장소" loading="lazy" />
          <div class="luck-body">
            <strong>📿 두 분의 기운을 깨울 장소</strong>
            <p>${picked.place}</p>
            <p class="small">연결: ${placeLinkLabel}</p>
            <a class="luck-cta" href="${placeLink}" target="_blank" rel="noopener">비책 실천하기</a>
          </div>
        </article>
        <article class="luck-commerce-card">
          <div class="luck-label">${targetName || '상대'}님과 조화를 돕는 #${weakLabel}</div>
          <img src="${img.item}" alt="행운의 아이템" loading="lazy" />
          <div class="luck-body">
            <strong>🪷 조화를 돕는 영험한 물건</strong>
            <p>${picked.item}</p>
            <p class="small">연결: ${itemLinkLabel}</p>
            <a class="luck-cta silver" href="${itemLink}" target="_blank" rel="noopener">기운 담기</a>
          </div>
        </article>
      </div>`;
      return `<div class="metric-deep"><p class="small metric-evidence"><strong>✨ 타고난 관계의 결</strong><br/>${set[0]}</p><p class="small metric-evidence"><strong>⚠️ 조심해야 할 기운의 부딪힘</strong><br/>${set[1]}</p><p class="small metric-evidence gaeun-${weakKey}"><strong>🕯 관계를 밝히는 개운법(開運法)</strong><br/>${set[2]}</p><p class="small metric-evidence"><strong>📜 두 분을 위한 화합의 비책</strong><br/>${set[3]}</p><div class="small metric-evidence"><strong>🍀 기운을 깨우는 행운의 요소</strong>${luckCards}</div></div>`;
    };

    const metricState = (value) => (value < 50 ? 'low' : value >= 80 ? 'high' : 'mid');
    const metricStatusMeta = (value) => {
      if (value < 50) return { icon: '⚠️', label: '주의', hint: '충(沖) 기운 우세', key: 'low' };
      if (value >= 80) return { icon: '✨', label: '안정', hint: '합(合) 기운 우세', key: 'high' };
      return { icon: '🌓', label: '균형 조정', hint: '합·충 혼재 구간', key: 'mid' };
    };
    const cleanCause = (text = '') => String(text).replace('사주적 근거:', '').trim();
    const buildEnergyCompare = () => {
      return `<div class="energy-compare-wrap"><div class="energy-row"><span>나(실선)</span><div class="energy-bar"><i data-energy-bar="me" class="earth solid" style="--w:50%"></i></div><b id="energyMePct">50%</b></div><div class="energy-row"><span>상대(점선)</span><div class="energy-bar"><i data-energy-bar="partner" class="earth dashed" style="--w:50%"></i></div><b id="energyPartnerPct">50%</b></div><p class="small">에너지 판독: <span id="energyHarmonyText">조화</span></p></div>`;
    };

    const stabilityDetail = getMetricDetail(firstGauge, 'stability');
    const reactionDetail = getMetricDetail(secondGauge, 'reaction');
    const stabilityMeta = metricStatusMeta(firstGauge);
    const reactionMeta = metricStatusMeta(secondGauge);
    const energyCompare = buildEnergyCompare();

    coreMetricsBox.innerHTML = `<h3>${isCompat ? '<span class="section-badge">2</span> 상세 분석' : '핵심 운명 지표'}</h3>
      <div class="core-metric-grid wizard-dashboard detail-metric-grid">
        <article class="gauge-card gauge-detail ${metricState(firstGauge)}" data-target="${firstGauge}">
          <div class="gauge-head"><span class="metric-icon">◉</span><span>${firstLabel}</span><span class="metric-info" title="두 사람의 충돌 빈도, 회복 탄력, 생활 리듬 합을 바탕으로 계산">i</span></div>
          <div class="gauge-layout">
            <div class="gauge-wrap">
              <svg viewBox="0 0 120 120" class="gauge-svg" aria-hidden="true">
                <circle class="gauge-ring-bg" cx="60" cy="60" r="52" />
                <circle class="gauge-ring-progress" cx="60" cy="60" r="52" />
              </svg>
              <strong class="gauge-value number-metric">0%</strong>
              <span class="gauge-status ${stabilityMeta.key}">${stabilityMeta.icon} ${stabilityMeta.label}</span>
              <button class="gauge-tip-btn" data-tip="stability">ⓘ</button>
              <div class="gauge-floating-tip" data-tip-panel="stability" hidden><strong>${stabilityMeta.hint}</strong><p>${cleanCause(stabilityDetail.cause)}</p></div>
            </div>
            <div class="metric-copy"><div class="gauge-side-clue"><span class="energy-chip ${stabilityMeta.key}">기운 상태: ${stabilityMeta.label}</span><p class="small">${stabilityMeta.hint}</p><p class="small metric-inline-cause">${cleanCause(stabilityDetail.cause)}</p>${energyCompare}</div><p class="typing-target" data-fulltext="${stabilityDetail.summary}">${stabilityDetail.summary}</p><div class="metric-block"><strong>사주적 근거</strong><p class="small metric-evidence" id="metricEvidenceStability">${stabilityDetail.cause}</p></div><div class="metric-block"><strong>솔루션</strong><p class="small">${stabilityDetail.solution}</p></div><button class="btn secondary metric-detail-btn" data-acc-toggle="stability">🔍 사주학적 근거 더 보기</button><div class="metric-accordion" data-acc-panel="stability" data-open="0">${renderDeepAccordion('stability', firstGauge, band)}</div></div>
          </div>
        </article>
        <article class="gauge-card gauge-detail ${metricState(secondGauge)}" data-target="${secondGauge}">
          <div class="gauge-head"><span class="metric-icon">🧭</span><span>${secondLabel}</span><span class="metric-info" title="질문 응답 패턴과 감정 표현 성향을 기반으로 계산">i</span></div>
          <div class="gauge-layout">
            <div class="gauge-wrap">
              <svg viewBox="0 0 120 120" class="gauge-svg" aria-hidden="true">
                <circle class="gauge-ring-bg" cx="60" cy="60" r="52" />
                <circle class="gauge-ring-progress" cx="60" cy="60" r="52" />
              </svg>
              <strong class="gauge-value number-metric">0%</strong>
              <span class="gauge-status ${reactionMeta.key}">${reactionMeta.icon} ${reactionMeta.label}</span>
              <button class="gauge-tip-btn" data-tip="reaction">ⓘ</button>
              <div class="gauge-floating-tip" data-tip-panel="reaction" hidden><strong>${reactionMeta.hint}</strong><p>${cleanCause(reactionDetail.cause)}</p></div>
            </div>
            <div class="metric-copy"><div class="gauge-side-clue"><span class="energy-chip ${reactionMeta.key}">기운 상태: ${reactionMeta.label}</span><p class="small">${reactionMeta.hint}</p><p class="small metric-inline-cause">${cleanCause(reactionDetail.cause)}</p>${energyCompare}</div><p class="typing-target" data-fulltext="${reactionDetail.summary}">${reactionDetail.summary}</p><div class="metric-block"><strong>사주적 근거</strong><p class="small metric-evidence" id="metricEvidenceReaction">${reactionDetail.cause}</p></div><div class="metric-block"><strong>솔루션</strong><p class="small">${reactionDetail.solution}</p></div><button class="btn secondary metric-detail-btn" data-acc-toggle="reaction">🔍 사주학적 근거 더 보기</button><div class="metric-accordion" data-acc-panel="reaction" data-open="0">${renderDeepAccordion('reaction', secondGauge, band)}</div></div>
          </div>
        </article>
      </div>`;

    setupTypingEffect();
    setupMetricAccordion();
    applyEnergyCompare(latestOrreryData || {});
    coreMetricsBox.querySelectorAll('.gauge-tip-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const key = btn.getAttribute('data-tip');
        const panel = coreMetricsBox.querySelector(`[data-tip-panel="${key}"]`);
        if (!panel) return;
        const isHidden = panel.hasAttribute('hidden');
        coreMetricsBox.querySelectorAll('.gauge-floating-tip').forEach((p) => p.setAttribute('hidden', ''));
        if (isHidden) panel.removeAttribute('hidden');
      });
    });
    document.addEventListener('click', () => {
      coreMetricsBox.querySelectorAll('.gauge-floating-tip').forEach((p) => p.setAttribute('hidden', ''));
    });

    bridgeBox.innerHTML = `<h3>${isCompat ? '세부 운세' : `결과 브릿지 안내 · ${modeLabel} 관점`}</h3><p>${targetName ? `${targetName}님과의` : ''} 현재 패턴을 빠르게 읽어주는 요약입니다. 정밀 리딩에서는 상대 성향/연락 히스토리/시간축을 함께 교차해 행동 순서를 제안합니다.</p>`;

    chartsBox.innerHTML = `<h3>${modeLabel} 명반 인포그래픽</h3><div class="reveal-ziwei"></div><div class="star-word destiny-line">핵심 별 문구: ${starWord}</div><blockquote class="authority-quote destiny-line">"인연의 시계는 멈춘 듯 보여도, 맞물릴 톱니는 결국 같은 시간을 가리킵니다."</blockquote>`;

    renderTimelineCard(buildYearTimelineData(concern), concern);

    briefingBox.innerHTML = `<h3>먼저 읽어야 할 해석</h3><p>${hourToBranchLabel(intake.birthTime || '')}에 태어난 ${userName}님은 ${concern} 고민에서 신호를 민감하게 읽는 편입니다.${targetName ? ` 특히 ${targetName}님에게는 첫 문장을 짧고 부드럽게 여는 전략이 유리합니다.` : ' 첫 문장을 짧고 부드럽게 여는 전략이 유리합니다.'}</p><p class="small" id="briefingEvidence">원국 근거를 불러오면 이 브리핑에 자동 반영돼.</p>`;
    if (pendingOrreryEvidence) applyOrreryEvidence(pendingOrreryEvidence);

    const keywordByConcern = {
      '금전/재산': ['현금흐름', '분산', '기회포착'],
      '취업/직장': ['문서운', '평판', '이동수'],
      '사업/창업': ['검증', '확장', '파트너십'],
      '애정운': ['감정온도', '표현', '신뢰'],
      '재회운': ['여운', '경계', '재접촉 신호'],
      '일반 궁합': ['안정적', '금전상승', '배려필요']
    };
    const keywordPool = keywordByConcern[concern] || ['균형', '타이밍', '집중'];
    const keywordMeta = {
      '안정적': { icon: '🏠', tone: 'good' },
      '금전상승': { icon: '💰', tone: 'good' },
      '배려필요': { icon: '🤝', tone: 'warn' },
      '현금흐름': { icon: '💸', tone: 'good' },
      '분산': { icon: '🧩', tone: 'good' },
      '기회포착': { icon: '📈', tone: 'good' },
      '문서운': { icon: '📄', tone: 'good' },
      '평판': { icon: '◉', tone: 'good' },
      '이동수': { icon: '🧭', tone: 'warn' },
      '검증': { icon: '🔎', tone: 'warn' },
      '확장': { icon: '🚀', tone: 'good' },
      '파트너십': { icon: '🤝', tone: 'good' },
      '감정온도': { icon: '❤️', tone: 'good' },
      '표현': { icon: '🗣️', tone: 'good' },
      '신뢰': { icon: '🔐', tone: 'good' },
      '여운': { icon: '🌙', tone: 'warn' },
      '경계': { icon: '⚠️', tone: 'warn' },
      '재접촉 신호': { icon: '📩', tone: 'good' }
    };
    const keywordTags = keywordPool.map((k) => {
      const m = keywordMeta[k] || { icon: '✨', tone: 'good' };
      return `<span class="compat-keyword-tag ${m.tone}">${m.icon} ${k}</span>`;
    }).join('');
    if (isCompat && fiveElementsBox && !fiveElementsBox.hidden) {
      fiveElementsBox.insertAdjacentHTML('beforeend', `<div class="compat-keyword-block"><h4>✨ 두 분의 관계를 정의하는 키워드</h4><div class="compat-keyword-row">${keywordTags}</div><p class="small"><em>관계 흐름을 빠르게 이해할 수 있는 핵심 신호야.</em></p></div>`);
      if (mindKeywordCard) mindKeywordCard.hidden = true;
    } else {
      if (mindKeywordCard) {
        mindKeywordCard.hidden = false;
        mindKeywordCard.innerHTML = `<h3>${isCompat ? '궁합 키워드' : '운명의 한마디'}</h3><div class="compat-keyword-row">${keywordTags}</div><p class="small"><em>키워드 해석: 관계 흐름을 빠르게 이해할 수 있는 핵심 신호야.</em></p>`;
      }
    }

    const successRate = Math.max(83, Math.min(97, Math.round(((data.recoveryIndex || 64) + (data.reunionForce || 72)) / 2)));
    const waitingMin = 8 + Math.floor(Math.random() * 22);
    counselorBox.innerHTML = `<h3>추가로 보고 싶다면</h3><div class="counselor-row"><div><strong>더 깊은 해석 연결</strong><p class="small">${userName}님 케이스를 바탕으로 다음 행동 가이드까지 이어서 볼 수 있어.</p><div class="expert-meta"><span>추천 적합도 ${successRate}%</span><span>${waitingMin}분 내 연결 가능</span></div></div><button class="btn" data-open-counselor-modal aria-label="추가 해석 보기"><span class="btn-inline">추가 해석 보기</span><span class="btn-stack"><span>추가</span><span>해석</span></span></button></div>`;

    // Compatibility page slimming: hide stitched/reunion-like blocks
    if (isCompat) {
      if (lockedReportBox) lockedReportBox.hidden = true;
      if (goldenTimeCard) goldenTimeCard.hidden = true;
      if (revealCtaCard) revealCtaCard.hidden = true;
      if (shareBox) shareBox.hidden = true;
      if (bridgeBox) bridgeBox.hidden = true;
      if (chartsBox) chartsBox.hidden = true;
      if (timelineBox) timelineBox.hidden = true;
      if (briefingBox) briefingBox.hidden = true;
      if (coreMetricsBox) coreMetricsBox.hidden = false;
    } else {
      if (lockedReportBox) lockedReportBox.hidden = false;
      if (goldenTimeCard) goldenTimeCard.hidden = false;
      if (revealCtaCard) revealCtaCard.hidden = false;
      if (shareBox) shareBox.hidden = false;
      if (bridgeBox) bridgeBox.hidden = false;
      if (chartsBox) chartsBox.hidden = false;
      if (timelineBox) timelineBox.hidden = false;
      if (briefingBox) briefingBox.hidden = false;
      goldenTimeCard.innerHTML = `<h3>재회 골든타임 캘린더</h3>
        <div class="golden-calendar">
          <div class="day-mark">${new Date().getMonth() + 1}월 12일</div>
          <div class="day-mark">${new Date().getMonth() + 1}월 24일</div>
        </div>
        <p class="small">이번 달 하이라이트 2회 · ${goldenTime} ± 20분</p>`;
      lockedReportBox.innerHTML = `<h3>운명의 미완성 리포트</h3>
        <div class="locked-grid">
          <article class="lock-card open"><strong>공개 리포트</strong><p>첫 연락 문장 톤 추천 공개</p></article>
          <article class="lock-card locked" data-tip="왜 중요해? 상대의 숨은 감정이 연락 타이밍을 뒤집을 수 있어요."><span class="lock-icon">🔒</span><strong>잠금 리포트</strong><p class="tease hand-font">🔒 상대방이 당신에게 연락하지 못하는 진짜 이유</p></article>
          <article class="lock-card locked" data-tip="누가 확인했나? 같은 고민군 상위 12%만 열람한 고급 리포트입니다."><span class="lock-icon">🔒</span><strong>잠금 리포트</strong><p class="tease hand-font">🔒 그 사람이 밤마다 당신의 프로필을...</p></article>
        </div>
        <div class="cta-row"><a class="btn glow-btn glossy-btn" href="/experts.html">상대방 속마음 확인</a><a class="btn glow-btn glossy-btn" href="/experts.html">맞춤 전략서 확인</a></div>`;
    }

    setTimeout(() => {
      if (overlay) overlay.hidden = true;
      animateGaugeMetrics(coreMetricsBox);
    }, 1600);

    const modal = document.getElementById('counselorModal');
    document.querySelectorAll('[data-open-counselor-modal]').forEach((btn) => btn.addEventListener('click', () => { if (modal) modal.hidden = false; }));
    document.querySelectorAll('[data-close-counselor-modal]').forEach((btn) => btn.addEventListener('click', () => { if (modal) modal.hidden = true; }));

    const menuBtn = document.getElementById('resultMenuBtn');
    const drawer = document.getElementById('resultDrawer');
    menuBtn?.addEventListener('click', () => {
      if (!drawer) return;
      drawer.hidden = !drawer.hidden;
      menuBtn.setAttribute('aria-expanded', String(!drawer.hidden));
    });

    const preferredViewMode = intake.resultViewMode || localStorage.getItem('ff-result-view-mode') || 'report';
    setupWebtoonView({ concern, userName, targetName, totalScore, initialMode: preferredViewMode });
  } catch (error) {
    console.error('result render error:', error);
    location.href = '/test.html';
  }
}
