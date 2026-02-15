const resultBox = document.getElementById('resultBox');
const coreMetricsBox = document.getElementById('coreMetricsBox');
const bridgeBox = document.getElementById('bridgeBox');
const chartsBox = document.getElementById('chartsBox');
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

if (!saved) {
  location.href = '/test.html';
} else {
  try {
    const data = JSON.parse(saved);
    const intake = JSON.parse(localStorage.getItem('ff-intake') || '{}');
    const userName = intake.name || '당신';
    const targetName = intake.targetName || '';

    const weatherMap = {
      reunion: { icon: '⛈️', label: '폭풍우 후 약한 개임' },
      crush: { icon: '🌫️', label: '안개 속 미세한 맑음' },
      timing: { icon: '🌤️', label: '맑음 뒤 흐림' }
    };
    const weather = weatherMap[data.troubleType] || weatherMap.reunion;
    const goldenTime = data.troubleType === 'timing' ? '22:40' : data.troubleType === 'crush' ? '21:20' : '23:00';
    const starWord = data.mode === 'ziwei' ? '천희(天喜)' : data.mode === 'saju' ? '문창(文昌)' : '홍염(紅艶)';
    const modeLabel = data.modeLabel || '종합';
    if (reportTitle) reportTitle.textContent = `${modeLabel} 정밀 분석 리포트`;

    resultBox.innerHTML = `<div class="weather-hero"><div><div class="mode-hero-badge">✦ 분석 관점 · ${modeLabel}</div><p class="mode-hero-note destiny-line hand-font">명반의 별들이 다시 연결되고 있어요.</p><h1 class="result-main-title">${userName}님의 재회 기상도</h1><div class="weather-badge">${weather.icon} ${weather.label}</div><p class="small">현재 감정 온도 <span class="core-value">${data.emotionTemp || 64}°</span> · 재회 인력 <span class="core-value">${data.reunionForce || 78}</span></p></div><div><div class="small">골든타임</div><div class="golden-time-pill">⏰ <span class="golden-time">${goldenTime}</span></div></div></div>`;

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

    briefingBox.innerHTML = `<h3>개인화 브리핑</h3><p>${hourToBranchLabel(intake.birthTime || '')}에 태어난 ${userName}님은 ${data.troubleLabel || '재회'} 고민에서 신호를 민감하게 읽는 편입니다.${targetName ? ` 특히 ${targetName}님에게는 첫 문장을 짧고 부드럽게 여는 전략이 유리합니다.` : ' 첫 문장을 짧고 부드럽게 여는 전략이 유리합니다.'}</p>`;

    goldenTimeCard.innerHTML = `<h3>재회 골든타임 캘린더</h3>
      <div class="golden-calendar">
        <div class="day-mark">${new Date().getMonth() + 1}월 12일</div>
        <div class="day-mark">${new Date().getMonth() + 1}월 24일</div>
      </div>
      <p class="small">이번 달 하이라이트 2회 · ${goldenTime} ± 20분</p>`;

    const keywordPool = data.troubleType === 'crush' ? ['망설임', '기대', '확인 욕구'] : data.troubleType === 'timing' ? ['타이밍 관망', '답장 고민', '심리적 거리'] : ['여운', '경계', '재접촉 신호'];
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
