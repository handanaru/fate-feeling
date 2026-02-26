(() => {
  const line = document.querySelector('[data-typewriter]');
  if (!line) return;

  const text = line.dataset.text || line.textContent.trim().replace(/^"|"$/g, '');
  if (!text) return;

  const fullText = `"${text}"`;

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    line.textContent = fullText;
    return;
  }

  // 최종 문장 높이를 미리 고정해서, 타이핑 완료 시 문단이 "위로 튀는" 현상 방지
  const probe = line.cloneNode(true);
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  probe.style.pointerEvents = 'none';
  probe.style.height = 'auto';
  probe.style.minHeight = '0';
  probe.style.width = `${line.clientWidth || line.getBoundingClientRect().width}px`;
  probe.textContent = fullText;
  line.parentElement?.appendChild(probe);
  const reservedHeight = Math.ceil(probe.getBoundingClientRect().height);
  probe.remove();
  if (reservedHeight > 0) line.style.minHeight = `${reservedHeight}px`;

  line.classList.add('is-typing');
  line.textContent = '""';

  let index = 0;
  const baseDelay = 34;

  const tick = () => {
    index += 1;
    const current = text.slice(0, index);
    line.textContent = `"${current}"`;

    if (index >= text.length) {
      line.classList.remove('is-typing');
      line.classList.add('is-typed');
      // 마지막 프레임 이후 minHeight 해제 (미세한 레이아웃 점프 방지 위해 한 템포 뒤)
      setTimeout(() => {
        line.style.minHeight = '';
      }, 120);
      return;
    }

    const char = text[index - 1];
    const pause = /[,.!?… ]/.test(char) ? 72 : baseDelay;
    setTimeout(tick, pause);
  };

  setTimeout(tick, 480);
})();

(() => {
  const fab = document.querySelector('.ff-nav-fab');
  if (!fab) return;
  fab.addEventListener('click', () => {
    fab.classList.add('is-tap');
    setTimeout(() => fab.classList.remove('is-tap'), 180);
  });
})();

(() => {
  const resumeCta = document.getElementById('ffResumeCta');
  if (!resumeCta) return;

  const intake = JSON.parse(localStorage.getItem('ff-intake') || '{}');
  const concern = String(intake.concern || '').trim();
  if (!concern) return;

  const mode = String(intake.mode || 'saju').trim() || 'saju';
  const params = new URLSearchParams({
    entry: 'resume',
    concern,
    mode
  });

  const destination = mode === 'saju' ? '/result.html' : '/test.html';
  resumeCta.href = `${destination}?${params.toString()}`;
  resumeCta.textContent = `최근 고민(${concern}) 이어서 시작하기`;
  resumeCta.hidden = false;
})();

(() => {
  const chips = Array.from(document.querySelectorAll('.ff-concern-chip'));
  const chipList = document.querySelector('[data-concern-chip-list]');
  const startLink = document.querySelector('[data-concern-start]');
  const hint = document.querySelector('[data-concern-hint]');
  const scrollHint = document.querySelector('[data-concern-scroll-hint]');
  const previewFocus = document.querySelector('[data-concern-preview-focus]');
  const previewMeta = document.querySelector('[data-concern-preview-meta]');
  const previewPeek = document.querySelector('[data-concern-preview-peek]');
  const previewPoints = Array.from(document.querySelectorAll('[data-concern-point]'));
  const progressText = document.querySelector('[data-concern-progress-text]');
  const progressFill = document.querySelector('[data-concern-progress-fill]');
  const concernContext = document.querySelector('[data-concern-context]');
  const concernSyncLinks = Array.from(document.querySelectorAll('[data-concern-sync-link]'));
  if (!chips.length || !startLink) return;

  const hideScrollHint = () => {
    if (!scrollHint || scrollHint.classList.contains('is-done')) return;
    scrollHint.classList.add('is-done');
  };

  const syncScrollHint = () => {
    if (!scrollHint || !chipList || !window.matchMedia('(max-width: 430px)').matches) return;
    const hasOverflow = chipList.scrollWidth - chipList.clientWidth > 8;
    if (!hasOverflow || chipList.scrollLeft > 8) {
      hideScrollHint();
    } else {
      scrollHint.classList.remove('is-done');
      scrollHint.textContent = '좌우로 밀어서 고민 더 보기';
    }
  };

  const concernMetaMap = {
    '애정운': {
      hint: '지금 가장 필요한 흐름부터 1분 안에 확인',
      focus: '감정 흐름 · 타이밍',
      meta: '질문 12개 · 약 1분 소요',
      peek: '많이 묻는 질문 · 지금 상대도 나를 같은 속도로 보고 있을까?',
      points: [
        '✔ 지금 기준 상대 마음 신호를 먼저 확인',
        '✔ 내가 움직일 타이밍이 안전한지 체크',
        '✔ 바로 써먹을 한 줄 액션 제안 받기'
      ]
    },
    '결혼 운세': {
      hint: '결혼 타이밍과 변수만 콕 집어서 확인',
      focus: '결정 시기 · 현실 변수',
      meta: '질문 12개 · 약 1분 소요',
      peek: '많이 묻는 질문 · 결혼 얘기를 꺼내도 거절감 없이 받아들일 시기일까?',
      points: [
        '✔ 결혼 대화가 잘 먹히는 시기 우선 체크',
        '✔ 현실 변수(가족·일·거리) 충돌 구간 확인',
        '✔ 서두를지 기다릴지 선택 기준 받기'
      ]
    },
    '재회운': {
      hint: '연락 가능성과 감정 온도를 빠르게 점검',
      focus: '연락 시그널 · 관계 회복력',
      meta: '질문 12개 · 약 1분 소요',
      peek: '많이 묻는 질문 · 먼저 연락하면 다시 끊길지, 이어질지 알 수 있을까?',
      points: [
        '✔ 상대가 열려 있는 연락 타이밍 추려보기',
        '✔ 다시 멀어질 가능성 높은 패턴 점검',
        '✔ 첫 메시지 톤을 어떻게 잡을지 힌트 받기'
      ]
    },
    '취업/직장': {
      hint: '합격·이직 타이밍을 먼저 짚어보기',
      focus: '이직 타이밍 · 역량 포지션',
      meta: '질문 12개 · 약 1분 소요',
      peek: '많이 묻는 질문 · 지금 버티는 게 맞을지, 옮길 신호가 왔는지 헷갈려요',
      points: [
        '✔ 버티기 vs 이동 중 유리한 선택 가늠',
        '✔ 면접·지원 운이 강한 타이밍 체크',
        '✔ 지금 포지션에서 보완할 약점 짚기'
      ]
    },
    '금전/재산': {
      hint: '새는 지출과 들어올 재물운을 한 번에 체크',
      focus: '현금 흐름 · 지출 누수',
      meta: '질문 12개 · 약 1분 소요',
      peek: '많이 묻는 질문 · 이번 달 돈이 묶일지, 들어올지 미리 감 잡을 수 있을까?',
      points: [
        '✔ 막아야 할 지출 누수 구간 먼저 확인',
        '✔ 현금 유입이 커지는 시점 감 잡기',
        '✔ 이번 주 돈 관리 한 줄 행동 제안 받기'
      ]
    }
  };

  let selectedConcern = '';

  const setConcernContext = (sourceLabel = '') => {
    if (!concernContext) return;
    if (!sourceLabel) {
      concernContext.hidden = true;
      concernContext.textContent = '';
      return;
    }
    concernContext.hidden = false;
    concernContext.textContent = sourceLabel;
  };

  const syncConcernLinks = (concern) => {
    if (!concernSyncLinks.length || !concern) return;
    concernSyncLinks.forEach((link) => {
      try {
        const url = new URL(link.getAttribute('href') || '', window.location.origin);
        url.searchParams.set('concern', concern);
        if (!url.searchParams.get('entry')) {
          url.searchParams.set('entry', 'picker');
        }
        link.setAttribute('href', `${url.pathname}?${url.searchParams.toString()}`);

        if (link.dataset.concernDynamicCopy === 'true') {
          link.textContent = `${concern} 흐름 바로 시작하기`;
        }
      } catch {
        // ignore malformed href
      }
    });
  };

  const selectConcern = (concern) => {
    selectedConcern = concern;

    let activeChip = null;
    chips.forEach((chip) => {
      const active = chip.dataset.concern === concern;
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-selected', active ? 'true' : 'false');
      if (active) activeChip = chip;
    });

    if (activeChip && window.matchMedia('(max-width: 430px)').matches) {
      activeChip.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }

    const params = new URLSearchParams({ concern, entry: 'picker' });
    startLink.href = `/test.html?${params.toString()}`;
    startLink.textContent = `${concern} 바로 확인하기`;
    syncConcernLinks(concern);

    const meta = concernMetaMap[concern] || {
      hint: '지금 고민 흐름을 빠르게 확인',
      focus: '핵심 흐름 · 현실 포인트',
      meta: '질문 12개 · 약 1분 소요',
      peek: '많이 묻는 질문 · 지금 내 선택이 맞는 방향인지 빠르게 확인할 수 있을까?',
      points: [
        '✔ 지금 상황 기준으로 핵심 흐름 먼저 확인',
        '✔ 당장 피해야 할 선택 신호 체크',
        '✔ 바로 실행할 다음 한 줄 액션 받기'
      ]
    };

    if (hint) {
      hint.textContent = `${concern} 선택됨 · ${meta.hint}`;
    }
    if (previewFocus) previewFocus.textContent = meta.focus;
    if (previewMeta) previewMeta.textContent = meta.meta;
    if (previewPeek) previewPeek.textContent = meta.peek;
    if (previewPoints.length) {
      previewPoints.forEach((pointNode, index) => {
        pointNode.textContent = meta.points?.[index] || '';
      });
    }
    if (progressText) {
      progressText.innerHTML = `<strong>1/2</strong> 고민 선택 완료 · ${concern} 기준 질문으로 바로 시작`;
    }
    if (progressFill) {
      progressFill.style.width = '58%';
    }
  };

  const persistConcern = (concern) => {
    if (!concern) return;
    localStorage.setItem('ff-picker-last-concern', concern);

    const prevIntake = JSON.parse(localStorage.getItem('ff-intake') || '{}');
    localStorage.setItem('ff-intake', JSON.stringify({ ...prevIntake, concern }));
  };

  const nudgeStartCta = () => {
    if (!window.matchMedia('(max-width: 430px)').matches) return;

    startLink.classList.remove('is-ready');
    requestAnimationFrame(() => {
      startLink.classList.add('is-ready');
    });

    startLink.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
  };

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const concern = String(chip.dataset.concern || '').trim();
      if (!concern) return;
      startLink.classList.remove('is-confirmed');
      selectConcern(concern);
      setConcernContext('지금 직접 선택한 고민으로 시작');
      persistConcern(concern);
      hideScrollHint();
      nudgeStartCta();
    });
  });

  startLink.addEventListener('click', (event) => {
    if (!selectedConcern) return;
    event.preventDefault();

    const destination = startLink.href;
    if (progressText) {
      progressText.innerHTML = `<strong>2/2</strong> ${selectedConcern} 선택 확정 · 테스트로 이동 중`;
    }
    if (progressFill) {
      progressFill.style.width = '100%';
    }

    startLink.classList.add('is-confirmed');
    startLink.setAttribute('aria-busy', 'true');
    startLink.textContent = `${selectedConcern} 테스트 열어보는 중...`;

    setTimeout(() => {
      window.location.assign(destination);
    }, 180);
  });

  const fromQuery = new URLSearchParams(window.location.search).get('concern');
  const fromPicker = localStorage.getItem('ff-picker-last-concern');
  const fromIntake = (() => {
    const intake = JSON.parse(localStorage.getItem('ff-intake') || '{}');
    return typeof intake.concern === 'string' ? intake.concern.trim() : '';
  })();

  chipList?.addEventListener('scroll', () => {
    if (chipList.scrollLeft > 8) hideScrollHint();
  }, { passive: true });
  window.addEventListener('resize', syncScrollHint);

  const firstConcern = String(chips[0]?.dataset.concern || '').trim();
  const concernSourceOrder = [
    { value: fromQuery, label: '링크에서 고른 고민 불러옴' },
    { value: fromPicker, label: '지난 선택 고민 자동 불러옴' },
    { value: fromIntake, label: '최근 입력 고민 자동 불러옴' },
    { value: firstConcern, label: '' }
  ];

  const initialConcernSource = concernSourceOrder
    .map((item) => ({
      value: String(item.value || '').trim(),
      label: item.label
    }))
    .find((item) => item.value && chips.some((chip) => chip.dataset.concern === item.value));

  if (initialConcernSource?.value) {
    selectConcern(initialConcernSource.value);
    setConcernContext(initialConcernSource.label);
  } else {
    setConcernContext('');
  }
  syncScrollHint();
})();
