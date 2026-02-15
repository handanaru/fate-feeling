const resultBox = document.getElementById('resultBox');
const coreMetricsBox = document.getElementById('coreMetricsBox');
const fiveElementsBox = document.getElementById('fiveElementsBox');
const shareBox = document.getElementById('shareBox');
const gradeBox = document.getElementById('gradeBox');
const socialShareBox = document.getElementById('socialShareBox');
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
  timelineBox.innerHTML = `<h3>나의 운세 타임라인</h3>
    <div class="timeline-summary">인생 총운 · ${concern} 흐름 기반 해석</div>
    <div class="timeline-tabs" id="yearTabs">${years.map((y) => `<button type="button" data-year="${y}" class="${y === thisYear ? 'active' : ''}">${y}</button>`).join('')}</div>
    <div class="timeline-panel" id="timelinePanel"></div>`;

  const panel = timelineBox.querySelector('#timelinePanel');
  const drawYear = (year) => {
    const y = data[year];
    if (!panel || !y) return;
    const max = Math.max(...y.months, 100);
    panel.className = `timeline-panel tone-${y.tone || 'now'}`;
    panel.innerHTML = `<p class="small">${y.label}</p>
      <p class="timeline-hash">${y.keywords.join(' ')}</p>
      <p><strong>${y.desc}</strong></p>
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

function radarPoints(values, r = 86, cx = 110, cy = 110) {
  const angles = [-90, -18, 54, 126, 198];
  return values.map((v, i) => {
    const rr = (Math.max(0, Math.min(100, v)) / 100) * r;
    const rad = (angles[i] * Math.PI) / 180;
    return `${(cx + rr * Math.cos(rad)).toFixed(1)},${(cy + rr * Math.sin(rad)).toFixed(1)}`;
  }).join(' ');
}

function renderFiveElements(answerById, userName, partnerName) {
  if (!fiveElementsBox) return;
  const wood = ((answerById.Q1 || 3) + (answerById.Q6 || 3) + (answerById.Q11 || 3)) * 6;
  const fire = ((answerById.Q2 || 3) + (answerById.Q7 || 3) + (answerById.Q12 || 3)) * 6;
  const earth = ((answerById.Q3 || 3) + (answerById.Q8 || 3)) * 9;
  const metal = ((answerById.Q4 || 3) + (answerById.Q9 || 3)) * 9;
  const water = ((answerById.Q5 || 3) + (answerById.Q10 || 3)) * 9;
  const self = [wood, fire, earth, metal, water].map((v) => Math.max(28, Math.min(96, Math.round(v))));
  const partner = self.map((v, i) => Math.max(24, Math.min(94, Math.round(v - 8 + ((i % 2 === 0) ? 7 : -5)))));
  const harmony = Math.round(100 - (self.reduce((acc, v, i) => acc + Math.abs(v - partner[i]), 0) / 5));
  const oneLine = harmony >= 80 ? '서로의 기운이 상생하며 안정감을 높여주는 조화야.' : harmony >= 60 ? '다름이 있지만 대화를 통해 충분히 맞춰갈 수 있는 궁합이야.' : '기운의 충돌이 있어 속도보다 배려가 우선이야.';

  fiveElementsBox.innerHTML = `<h3>✨ 두 사람의 오행 조화</h3>
    <div class="five-wrap">
      <svg viewBox="0 0 220 220" class="five-radar" aria-hidden="true">
        <polygon points="${radarPoints([100,100,100,100,100])}" class="radar-grid" />
        <polygon points="${radarPoints([75,75,75,75,75])}" class="radar-grid" />
        <polygon points="${radarPoints([50,50,50,50,50])}" class="radar-grid" />
        <polygon points="${radarPoints(self)}" class="radar-self" />
        <polygon points="${radarPoints(partner)}" class="radar-partner" />
      </svg>
      <div class="five-legend"><span class="dot self"></span>${userName} · <span class="dot partner"></span>${partnerName || '상대'}</div>
    </div>
    <p class="small">🌳목 · 🔥화 · 🟨토 · ⚪금 · 🌊수</p>
    <p class="five-line"><strong>${oneLine}</strong> (조화도 ${harmony}점)</p>`;
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

    resultBox.innerHTML = `<div class="weather-hero hero-${header.theme}"><div><div class="mode-hero-badge">${header.icon} ${modeLabel} 정밀 리포트</div><h1 class="result-main-title">${header.title}</h1><p class="mode-hero-note destiny-line hand-font">${header.sub}</p><div class="fortune-score-head">종합 점수 <strong>${totalScore}점</strong></div><div class="fortune-score-bar"><span style="width:${totalScore}%;"></span></div><div class="hero-chip-row">${summaryTags.map((tag) => `<span class="hero-chip">${tag}</span>`).join('')}</div><p class="small">현재 감정 온도 <span class="core-value">${data.emotionTemp || 64}°</span> · 운세 인력 <span class="core-value">${data.reunionForce || 78}</span></p></div><div><div class="small">골든타임</div><div class="golden-time-pill">⏰ <span class="golden-time">${goldenTime}</span></div></div></div>`;

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

    if (gradeBox) {
      gradeBox.innerHTML = `<h3>등급 리포트</h3>
        <div class="grade-emblem" style="--grade-color:${gradeMeta.color}">Your Grade <strong>${gradeMeta.grade}</strong></div>
        <div class="fortune-score-bar"><span style="width:${totalScore}%; background:${gradeMeta.color};"></span></div>
        <p class="grade-label"><strong>${gradeMeta.label}</strong></p>
        <p>${gradeMeta.brief}</p>
        <p class="small">${gradeMeta.detail}</p>
        <p class="grade-tip">💡 행운의 조언: ${gradeMeta.tip}</p>`;
    }

    if (concern === '일반 궁합') renderFiveElements(data.answerById || {}, userName, targetName);
    else if (fiveElementsBox) fiveElementsBox.hidden = true;

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
      socialShareBox.innerHTML = `<h3>📣 내 운세 결과를 친구에게 공유하기</h3><p class="small">이미 15,820명이 결과를 공유했어.</p><div class="cta-row"><button class="btn kakao-share" id="kakaoShareBtn">🗨 카카오톡으로 결과 보내기</button></div><div class="cta-row"><button class="btn secondary" id="saveGradeBtn">📸 이미지 저장</button><button class="btn secondary" id="copyLinkBtn">🔗 링크 복사</button></div>`;
      document.getElementById('kakaoShareBtn')?.addEventListener('click', () => {
        const text = `${userName}님의 2026년 운세 등급은 [${gradeMeta.grade}] (${totalScore}점)!\n지금 확인해봐: https://fate-feeling.vercel.app`;
        const url = `https://share.kakao.com/talk/friends/picker/link?url=${encodeURIComponent('https://fate-feeling.vercel.app')}&text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
      });
      document.getElementById('saveGradeBtn')?.addEventListener('click', () => document.getElementById('saveSummaryBtn')?.click());
      document.getElementById('copyLinkBtn')?.addEventListener('click', async () => {
        await navigator.clipboard.writeText('https://fate-feeling.vercel.app');
        alert('링크 복사 완료!');
      });
    }

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
