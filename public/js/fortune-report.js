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
  <div class="fortune-tags">${p.map((x, i) => `<span>${['시','일','월','년'][i]}주 ${x?.ganzi || '-'} · ${x?.stemSipsin || '-'}</span>`).join('')}</div>`;

  const fortune = report?.data?.fortuneSummary || report?.data?.summary || '';
  totalBox.innerHTML = `<h3>🌠 전체총운 해설</h3><p>${fortune || '상세 해설은 최신 total-fortune 엔진 기반으로 저장됐고, 다음 버전에서 카드형 장문 해설이 여기로 이관돼.'}</p>`;

  engineBox.innerHTML = `<h3>🧮 엔진 정보</h3>
  <p class="small">엔진: ${report?.data?.engine || '@orrery/core'}</p>
  <p class="small">라이선스: ${report?.data?.license || 'AGPL-3.0-only'}</p>
  <p class="small"><a href="${report?.data?.sourceUrl || 'https://github.com/rath/orrery'}" target="_blank" rel="noopener">소스 저장소 보기</a></p>`;
}

render();
