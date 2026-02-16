const listBox = document.getElementById('fortuneReportList');

function getReports() {
  try { return JSON.parse(localStorage.getItem('ff-total-fortune-reports') || '[]'); } catch (e) { return []; }
}

function render() {
  const reports = getReports();
  if (!reports.length) {
    listBox.innerHTML = `<section class="card"><p class="small">아직 저장된 리포트가 없어. <a href="/total-fortune.html">전체총운 분석하러 가기</a></p></section>`;
    return;
  }

  listBox.innerHTML = reports.map((r) => {
    const date = new Date(r.createdAt || Date.now());
    const when = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    return `<article class="card report-item">
      <h3>${r.name || '이름없음'} · ${r.gender || '-'} · ${r.birth || '-'}</h3>
      <p class="small">출생시간 ${r.birthTime || '-'} · 지역 ${r.birthCity || '서울특별시'}</p>
      <p class="small">생성 ${when}</p>
      <div class="cta-row">
        <a class="btn" href="/fortune-report.html?id=${encodeURIComponent(r.id)}">리포트 보기</a>
        <button class="btn secondary" type="button" data-del="${r.id}">삭제</button>
      </div>
    </article>`;
  }).join('');

  listBox.querySelectorAll('[data-del]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-del');
      const next = getReports().filter((r) => r.id !== id);
      localStorage.setItem('ff-total-fortune-reports', JSON.stringify(next));
      render();
    });
  });
}

render();
