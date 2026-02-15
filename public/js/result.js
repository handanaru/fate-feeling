const resultBox = document.getElementById('resultBox');
const coreMetricsBox = document.getElementById('coreMetricsBox');
const bridgeBox = document.getElementById('bridgeBox');
const chartsBox = document.getElementById('chartsBox');
const timelineBox = document.getElementById('timelineBox');
const briefingBox = document.getElementById('briefingBox');
const counselorBox = document.getElementById('counselorBox');
const goldenTimeCard = document.getElementById('goldenTimeCard');
const mindKeywordCard = document.getElementById('mindKeywordCard');
const lockedReportBox = document.getElementById('lockedReportBox');
const overlay = document.getElementById('resultOverlay');
const reportTitle = document.getElementById('reportTitle');
const saved = localStorage.getItem('ff-result');

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

function buildYearTimelineData(concern = '일반 궁합') {
  const baseByConcern = {
    '금전/재산': { k: ['#현금흐름회복', '#분산투자', '#지출관리'], tip: '💰 금전운: 5월 이후 목돈 운이 강해. 단기보다 분할 접근이 유리해.' },
    '취업/직장': { k: ['#문서운상승', '#이직기회', '#평판관리'], tip: '💼 직장운: 상반기 준비, 하반기 이동수가 강하게 들어와.' },
    '사업/창업': { k: ['#시장검증', '#파트너십', '#확장타이밍'], tip: '🚀 사업운: 성급 확장보다 3분기 검증 후 확장이 안정적이야.' },
    '애정운': { k: ['#감정회복', '#표현강화', '#신뢰형성'], tip: '❤️ 애정운: 관계를 급하게 결론내기보다 템포를 맞추는 게 핵심이야.' }
  };
  const base = baseByConcern[concern] || { k: ['#변화의시작', '#문서운상승', '#인간관계주의'], tip: '✨ 올해 포인트: 감정적 결정보다 기록 기반 판단이 운을 살려.' };
  return {
    2025: { label: '지나온 흐름', keywords: ['#정체기', '#관계재정렬', '#기반정비'], desc: '지난 해는 속도를 줄이고 기반을 재정비한 시기였어. 무리한 확장보다 정리에 집중하면서 손실을 줄인 흐름이야.', months: [42, 38, 45, 48, 51, 46, 50, 55, 52, 58, 61, 64] },
    2026: { label: '현재의 운세', keywords: base.k, desc: '올해는 정체를 벗어나 새로운 문서·연결·결정이 시작되는 해야. 다만 감정적 충돌 가능성이 있으니 속도 조절이 중요해.', months: [56, 61, 64, 68, 74, 71, 76, 80, 77, 83, 79, 86] },
    2027: { label: '준비할 미래', keywords: ['#확장', '#성과가시화', '#선택집중'], desc: '내년은 올해의 선택이 성과로 드러나는 시기야. 잘 맞는 축에 집중하면 체감 성취가 크게 올라갈 가능성이 높아.', months: [63, 66, 69, 73, 76, 79, 82, 84, 81, 86, 88, 90] },
    tip: base.tip
  };
}

function renderTimelineCard(data, concern = '일반 궁합') {
  if (!timelineBox) return;
  const years = [2025, 2026, 2027];
  const thisYear = 2026;
  timelineBox.innerHTML = `<h3>나의 운세 타임라인</h3>
    <div class="timeline-summary">인생 총운 · ${concern} 흐름 기반 해석</div>
    <div class="timeline-tabs" id="yearTabs">${years.map((y) => `<button type="button" data-year="${y}" class="${y === thisYear ? 'active' : ''}">${y}</button>`).join('')}</div>
    <div class="timeline-panel" id="timelinePanel"></div>`;

  const panel = timelineBox.querySelector('#timelinePanel');
  const drawYear = (year) => {
    const y = data[year];
    if (!panel || !y) return;
    const max = Math.max(...y.months, 100);
    panel.innerHTML = `<p class="small">${y.label}</p>
      <p class="timeline-hash">${y.keywords.join(' ')}</p>
      <p>${y.desc}</p>
      <div class="monthly-bars">${y.months.map((v, i) => `<div class="mbar"><span style="height:${Math.max(10, Math.round((v / max) * 100))}%"></span><em>${i + 1}월</em></div>`).join('')}</div>
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

if (!saved) {
  location.href = '/test.html';
} else {
  try {
    const data = JSON.parse(saved);
    const intake = JSON.parse(localStorage.getItem('ff-intake') || '{}');
    const userName = intake.name || '당신';
    const targetName = intake.targetName || '';

    const concern = data.troubleLabel || data.troubleType || '일반 궁합';
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

    resultBox.innerHTML = `<div class="weather-hero"><div><div class="mode-hero-badge">✦ 분석 관점 · ${modeLabel}</div><p class="mode-hero-note destiny-line hand-font">명반의 별들이 다시 연결되고 있어요.</p><h1 class="result-main-title">${userName}님의 ${concern} 기상도</h1><div class="weather-badge">${weather.icon} ${weather.label}</div><p class="small">현재 감정 온도 <span class="core-value">${data.emotionTemp || 64}°</span> · 운세 인력 <span class="core-value">${data.reunionForce || 78}</span></p></div><div><div class="small">골든타임</div><div class="golden-time-pill">⏰ <span class="golden-time">${goldenTime}</span></div></div></div>`;

    const reunionRate = Math.min(96, Math.max(51, data.reunionForce || 78));
    const responseRate = Math.min(97, Math.max(48, data.recoveryIndex || 67));

    coreMetricsBox.innerHTML = `<h3>핵심 운명 지표</h3>
      <div class="core-metric-grid wizard-dashboard">
        <article class="gauge-card" data-target="${reunionRate}">
          <div class="gauge-head"><span class="metric-icon">✦</span><span>재회 확률</span></div>
          <div class="gauge-wrap">
            <svg viewBox="0 0 120 120" class="gauge-svg" aria-hidden="true">
              <circle class="gauge-ring-bg" cx="60" cy="60" r="52" />
              <circle class="gauge-ring-progress" cx="60" cy="60" r="52" />
            </svg>
            <strong class="gauge-value number-metric">0%</strong>
          </div>
        </article>
        <article class="gauge-card" data-target="${responseRate}">
          <div class="gauge-head"><span class="metric-icon">🧭</span><span>상대 반응도</span></div>
          <div class="gauge-wrap">
            <svg viewBox="0 0 120 120" class="gauge-svg" aria-hidden="true">
              <circle class="gauge-ring-bg" cx="60" cy="60" r="52" />
              <circle class="gauge-ring-progress" cx="60" cy="60" r="52" />
            </svg>
            <strong class="gauge-value number-metric">0%</strong>
          </div>
        </article>
      </div>`;

    bridgeBox.innerHTML = `<h3>결과 브릿지 안내 · ${modeLabel} 관점</h3><p>${targetName ? `${targetName}님과의` : ''} 현재 패턴을 빠르게 읽어주는 요약입니다. 정밀 리딩에서는 상대 성향/연락 히스토리/시간축을 함께 교차해 행동 순서를 제안합니다.</p>`;

    chartsBox.innerHTML = `<h3>${modeLabel} 명반 인포그래픽</h3><div class="reveal-ziwei"></div><div class="star-word destiny-line">핵심 별 문구: ${starWord}</div><blockquote class="authority-quote destiny-line">"인연의 시계는 멈춘 듯 보여도, 맞물릴 톱니는 결국 같은 시간을 가리킵니다."</blockquote>`;

    renderTimelineCard(buildYearTimelineData(concern), concern);

    briefingBox.innerHTML = `<h3>개인화 브리핑</h3><p>${hourToBranchLabel(intake.birthTime || '')}에 태어난 ${userName}님은 ${concern} 고민에서 신호를 민감하게 읽는 편입니다.${targetName ? ` 특히 ${targetName}님에게는 첫 문장을 짧고 부드럽게 여는 전략이 유리합니다.` : ' 첫 문장을 짧고 부드럽게 여는 전략이 유리합니다.'}</p>`;

    goldenTimeCard.innerHTML = `<h3>재회 골든타임 캘린더</h3>
      <div class="golden-calendar">
        <div class="day-mark">${new Date().getMonth() + 1}월 12일</div>
        <div class="day-mark">${new Date().getMonth() + 1}월 24일</div>
      </div>
      <p class="small">이번 달 하이라이트 2회 · ${goldenTime} ± 20분</p>`;

    const keywordByConcern = {
      '금전/재산': ['현금흐름', '분산', '기회포착'],
      '취업/직장': ['문서운', '평판', '이동수'],
      '사업/창업': ['검증', '확장', '파트너십'],
      '애정운': ['감정온도', '표현', '신뢰'],
      '재회운': ['여운', '경계', '재접촉 신호']
    };
    const keywordPool = keywordByConcern[concern] || ['균형', '타이밍', '집중'];
    mindKeywordCard.innerHTML = `<h3>운명의 한마디</h3><p class="gold-highlight-value destiny-line hand-font">${keywordPool.join(' · ')}</p><p class="small">키워드를 기준으로 첫 문장 톤을 차분하게 맞추면 성공 확률이 올라갑니다.</p>`;

    lockedReportBox.innerHTML = `<h3>운명의 미완성 리포트</h3>
      <div class="locked-grid">
        <article class="lock-card open"><strong>공개 리포트</strong><p>첫 연락 문장 톤 추천 공개</p></article>
        <article class="lock-card locked" data-tip="왜 중요해? 상대의 숨은 감정이 연락 타이밍을 뒤집을 수 있어요."><span class="lock-icon">🔒</span><strong>잠금 리포트</strong><p class="tease hand-font">🔒 상대방이 당신에게 연락하지 못하는 진짜 이유</p></article>
        <article class="lock-card locked" data-tip="누가 확인했나? 같은 고민군 상위 12%만 열람한 고급 리포트입니다."><span class="lock-icon">🔒</span><strong>잠금 리포트</strong><p class="tease hand-font">🔒 그 사람이 밤마다 당신의 프로필을...</p></article>
      </div>
      <div class="cta-row"><a class="btn glow-btn glossy-btn" href="/experts.html">상대방 속마음 확인</a><a class="btn glow-btn glossy-btn" href="/experts.html">맞춤 전략서 확인</a></div>`;

    const successRate = Math.max(83, Math.min(97, Math.round(((data.recoveryIndex || 64) + (data.reunionForce || 72)) / 2)));
    const waitingMin = 8 + Math.floor(Math.random() * 22);
    counselorBox.innerHTML = `<h3>분석 기반 추천 상담사</h3><div class="counselor-row"><div><strong>타로 레아 · 492번</strong><p class="small">${userName}님 고민 특화 · 지금 연결하면 골든타임 전략까지 확인 가능</p><div class="expert-meta"><span>재회 성공률 ${successRate}%</span><span>${waitingMin}분 내 상담 가능</span></div></div><button class="btn glow-btn" data-open-counselor-modal>상담하기</button></div>`;

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
  } catch (error) {
    console.error('result render error:', error);
    location.href = '/test.html';
  }
}
