(function () {
  const root = document.documentElement;
  const saved = localStorage.getItem('ff-theme') || 'dark';
  root.setAttribute('data-theme', saved);

  function normalizeTrouble(concern = '') {
    if (concern.includes('짝사랑') || concern.includes('썸')) return 'crush';
    if (concern.includes('연락')) return 'timing';
    return 'reunion';
  }

  function troubleMeta(type) {
    if (type === 'crush') {
      return { icon: '🌹', label: '짝사랑/썸', copy: '떨림의 결을 읽는 중', tone: 'rose + purple' };
    }
    if (type === 'timing') {
      return { icon: '🕰️', label: '연락 타이밍', copy: '정확한 타이밍을 계산 중', tone: 'navy + silver' };
    }
    return { icon: '🔥', label: '재회', copy: '재회 기류를 추적 중', tone: 'plum + gold' };
  }

  function applyConcernToneByType(type = 'reunion') {
    const meta = troubleMeta(type);
    document.body?.setAttribute('data-trouble', type);

    document.querySelectorAll('[data-personal-header]').forEach((el) => {
      el.textContent = `${meta.icon} 현재 고민: ${meta.label} · ${meta.copy}`;
    });

    document.querySelectorAll('[data-tone-pill]').forEach((el) => {
      el.textContent = `${meta.icon} ${meta.label} 모드 · ${meta.tone}`;
    });
  }

  window.ffApplyConcernTone = function (concern = '') {
    const type = concern === 'reunion' || concern === 'crush' || concern === 'timing'
      ? concern
      : normalizeTrouble(concern);
    applyConcernToneByType(type);
  };

  window.getFFResult = function () {
    try {
      const raw = localStorage.getItem('ff-result');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  };

  window.toggleTheme = function () {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('ff-theme', next);
  };

  function attachStarfield() {
    if (document.getElementById('ffStarfield')) return;
    const canvas = document.createElement('canvas');
    canvas.id = 'ffStarfield';
    canvas.className = 'ff-starfield';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let points = [];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const baseCount = reduced ? 20 : Math.min(55, Math.floor((window.innerWidth * window.innerHeight) / 26000));

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * Math.min(window.devicePixelRatio || 1, 1.5));
      canvas.height = Math.floor(h * Math.min(window.devicePixelRatio || 1, 1.5));
      ctx.setTransform(canvas.width / w, 0, 0, canvas.height / h, 0, 0);
      points = Array.from({ length: baseCount }).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.4,
        v: (Math.random() * 0.2 + 0.05) * (Math.random() > 0.5 ? 1 : -1),
        a: Math.random() * 0.6 + 0.2
      }));
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (const p of points) {
        p.y += p.v;
        if (p.y < -8) p.y = h + 8;
        if (p.y > h + 8) p.y = -8;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${p.a})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(195,155,255,.45)';
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener('resize', resize);
    if (!reduced) requestAnimationFrame(frame);
  }

  const navItems = [
    { href: '/', label: '홈' },
    { href: '/saju.html', label: '사주' },
    { href: '/tarot.html', label: '타로' },
    { href: '/astro.html', label: '점성술' },
    { href: '/mbti.html', label: 'MBTI' },
    { href: '/ziwei.html', label: '자미두수' },
    { href: '/philosophy.html', label: '철학관' },
    { href: '/test.html', label: '테스트' },
    { href: '/result.html', label: '결과' },
    { href: '/experts.html', label: '상담사' }
  ];

  const mobileBottomNavItems = [
    { href: '/', label: '홈' },
    { href: '/ziwei.html', label: '자미두수' },
    { href: '/tarot.html', label: '타로' },
    { href: '/philosophy.html', label: '철학관' },
    { href: '/test.html', label: '내 운명' }
  ];

  const pathname = window.location.pathname;

  function buildLinks(items = navItems) {
    return items
      .map((item) => {
        const active = (item.href === '/' && pathname === '/') || (item.href !== '/' && pathname === item.href);
        return `<a href="${item.href}" class="${active ? 'active' : ''}">${item.label}</a>`;
      })
      .join('');
  }

  function renderBrand() {
    document.querySelectorAll('.brand').forEach((brand) => {
      if (brand.querySelector('.brand-wordmark')) return;
      const raw = (brand.textContent || '').trim();
      const suffix = raw.includes('·') ? raw.split('·').slice(1).join('·').trim() : '';
      brand.innerHTML = `
        <span class="brand-logo" aria-hidden="true"><span class="spark">✦</span></span>
        <span class="brand-wordmark">Fate <span class="amp">&</span> Feeling</span>
        ${suffix ? `<span class="brand-extra">· ${suffix}</span>` : ''}
      `;
    });
  }

  function attachGlobalNav() {
    if (document.body?.dataset?.noGlobalNav === '1') return;
    if (window.location.pathname === '/') return;
    const header = document.querySelector('header');
    if (!header) return;

    if (!document.querySelector('.top-nav')) {
      const topNav = document.createElement('nav');
      topNav.className = 'top-nav';
      topNav.innerHTML = buildLinks();
      header.insertAdjacentElement('afterend', topNav);
    }

    if (!document.querySelector('.bottom-nav')) {
      const bottomNav = document.createElement('nav');
      bottomNav.className = 'bottom-nav';
      bottomNav.innerHTML = buildLinks(mobileBottomNavItems);
      document.body.appendChild(bottomNav);
    }
  }

  function getToast() {
    let toast = document.getElementById('ffToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'ffToast';
      toast.className = 'ff-toast';
      document.body.appendChild(toast);
    }
    return toast;
  }

  window.ffToast = function (message) {
    const toast = getToast();
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(window.__ffToastTimer);
    window.__ffToastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
  };

  window.ffShare = async function (link, message) {
    const target = link || window.location.href;
    try {
      await navigator.clipboard.writeText(target);
      window.ffToast(message || '링크를 복사했어요. 공유해볼까요? ✨');
    } catch (e) {
      window.ffToast('공유 링크를 확인해보세요 🙌');
    }
  };

  function initConcernTone() {
    let type = 'reunion';
    try {
      const intake = JSON.parse(localStorage.getItem('ff-intake') || '{}');
      type = normalizeTrouble(intake.concern || '');
    } catch (e) {
      type = 'reunion';
    }
    applyConcernToneByType(type);
  }

  function ensureCoachFab() {
    if (document.body?.dataset?.noGlobalNav === '1') return;
    if (window.location.pathname === '/') return;
    if (document.querySelector('.ai-coach-fab')) return;
    const fab = document.createElement('a');
    fab.className = 'ai-coach-fab';
    fab.href = '/ai.html';
    fab.textContent = 'AI 코치 상담';
    document.body.appendChild(fab);
  }

  function ensureTfMobileDock() {
    if (document.querySelector('.tf-mobile-dock')) return;

    const path = window.location.pathname;
    if (path.startsWith('/api/')) return;
    const isReport = path === '/fortune-reports.html' || path === '/fortune-report.html' || path === '/result.html';
    const isTotal = path === '/total-fortune.html';
    const isDaily = path === '/today-secret.html';

    const dock = document.createElement('nav');
    dock.className = 'tf-mobile-dock';
    dock.setAttribute('aria-label', '모바일 빠른 이동');
    const isAi = path === '/ai.html';
    dock.innerHTML = `
      <a href="/" class="item ${path === '/' ? 'active' : ''}"><span>🏠</span><b>홈</b></a>
      <a href="/today-secret.html" class="item ${isDaily ? 'active' : ''}"><span>☀️</span><b>오늘의 비책</b></a>
      <a href="/total-fortune.html" class="item ${isTotal ? 'active' : ''}"><span>🔮</span><b>전체총운</b></a>
      <a href="/ai.html" class="item ${isAi ? 'active' : ''}"><span>🤖</span><b>AI 상담</b></a>
      <a href="/fortune-reports.html" class="item ${isReport ? 'active' : ''}"><span>🗺️</span><b>내 보관함</b></a>
    `;
    document.body.classList.add('has-global-dock');
    document.body.appendChild(dock);
  }

  function ensurePhaseStyles() {
    if (document.querySelector('link[data-phase3]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/phase3.css';
    link.setAttribute('data-phase3', '1');
    document.head.appendChild(link);
  }

  function initCardParallax() {
    const cards = [...document.querySelectorAll('.card, .tarot-card')];
    if (!cards.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onScroll = () => {
      const vh = window.innerHeight || 1;
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return;
        const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
        card.style.transform = `translateY(${Math.max(-5, Math.min(5, -progress * 6)).toFixed(2)}px)`;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }

  function ensureExpertWaitlist() {
    if (document.getElementById('expertWaitlistModal')) return;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'expertWaitlistModal';
    modal.hidden = true;
    modal.innerHTML = `
      <div class="modal-card onboarding-modal expert-waitlist-modal">
        <h3>👩‍⚕️ 전문가 상담 오픈 알림</h3>
        <p class="small">오픈되면 가장 먼저 알려줄게. 연락처를 남겨줘.</p>
        <label for="expertWaitlistName">이름(선택)</label>
        <input id="expertWaitlistName" placeholder="예: 주원" />
        <label for="expertWaitlistContact">연락처</label>
        <input id="expertWaitlistContact" placeholder="예: 텔레그램 @id 또는 010-0000-0000" />
        <div class="cta-row">
          <button class="btn secondary" type="button" data-waitlist-cancel>닫기</button>
          <button class="btn" type="button" data-waitlist-submit>신청하기</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const openModal = () => {
      modal.hidden = false;
      setTimeout(() => document.getElementById('expertWaitlistContact')?.focus(), 20);
    };
    const closeModal = () => { modal.hidden = true; };

    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.closest('[data-expert-waitlist]')) {
        openModal();
        return;
      }
      if (target.matches('[data-waitlist-cancel]') || target === modal) {
        closeModal();
        return;
      }
      if (target.matches('[data-waitlist-submit]')) {
        const name = (document.getElementById('expertWaitlistName')?.value || '').trim();
        const contact = (document.getElementById('expertWaitlistContact')?.value || '').trim();
        if (!contact) {
          window.ffToast?.('연락처를 입력해줘 🙏');
          return;
        }
        try {
          const key = 'ff-expert-waitlist';
          const prev = JSON.parse(localStorage.getItem(key) || '[]');
          prev.push({ name, contact, createdAt: Date.now() });
          localStorage.setItem(key, JSON.stringify(prev));
        } catch (err) {
          console.error(err);
        }
        closeModal();
        window.ffToast?.('신청 완료! 오픈되면 바로 알려줄게 ✨');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) closeModal();
    });
  }

  function init() {
    ensurePhaseStyles();
    attachStarfield();
    renderBrand();
    attachGlobalNav();
    initConcernTone();
    ensureCoachFab();
    ensureTfMobileDock();
    ensureExpertWaitlist();
    initCardParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();