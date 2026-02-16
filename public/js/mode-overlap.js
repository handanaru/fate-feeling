const summaryEl = document.getElementById('overlapSummary');
const signalsEl = document.getElementById('overlapSignals');
const modesEl = document.getElementById('overlapModes');

const labels = { saju: '사주', tarot: '타로', ziwei: '자미두수' };

function loadSnapshots() {
  try { return JSON.parse(localStorage.getItem('ff-mode-snapshots') || '{}'); } catch (_) { return {}; }
}

function scoreTag(v, hi = 75, lo = 55) {
  if (v >= hi) return '강함';
  if (v <= lo) return '낮음';
  return '보통';
}

function buildSignalSet(row = {}) {
  const set = new Set();
  set.add(`회복:${scoreTag(Number(row.recoveryIndex || 0))}`);
  set.add(`관계추진:${scoreTag(Number(row.reunionForce || 0))}`);
  set.add(`감정온도:${scoreTag(Number(row.emotionTemp || 0), 78, 48)}`);
  if (row.gradeBand) set.add(`등급:${row.gradeBand}`);
  if (row.concern) set.add(`고민:${row.concern}`);
  return set;
}

function render() {
  const all = loadSnapshots();
  const picked = ['saju', 'tarot', 'ziwei']
    .map((k) => all[k])
    .filter(Boolean);

  if (picked.length < 2) {
    summaryEl.innerHTML = '최소 2개 관점(사주/타로/자미두수) 결과가 있어야 겹쳐보기가 가능해.';
    signalsEl.innerHTML = '<h3>아직 데이터가 부족해</h3><p class="small">각 관점으로 테스트/분석을 한 번씩 돌린 뒤 다시 와줘.</p>';
    modesEl.innerHTML = '<a href="/test.html" class="btn ai-send-btn">관점별 분석하러 가기</a>';
    return;
  }

  const sets = picked.map(buildSignalSet);
  let common = [...sets[0]];
  for (let i = 1; i < sets.length; i += 1) {
    common = common.filter((x) => sets[i].has(x));
  }

  summaryEl.innerHTML = `비교 모드: <strong>${picked.map((r) => labels[r.mode] || r.modeLabel || r.mode).join(' · ')}</strong>`;

  signalsEl.innerHTML = `
    <h3>겹치는 공통 신호</h3>
    ${common.length
      ? `<div class="fortune-tags">${common.map((t) => `<span>${t}</span>`).join('')}</div>`
      : '<p class="small">완전히 동일한 신호는 적지만, 모드별 강약이 다르게 나오는 중이야. 아래 표로 비교해줘.</p>'}
  `;

  modesEl.innerHTML = `
    <h3>모드별 비교</h3>
    <div class="total-fortune-list">
      ${picked.map((r) => `
        <article class="daewoon-card">
          <small>${labels[r.mode] || r.modeLabel || r.mode}</small>
          <strong>${r.concern || '-'}</strong>
          <p>등급 ${r.gradeBand || '-'} · 최종점수 ${r.finalScore || 0}</p>
          <p class="small">회복 ${r.recoveryIndex || 0} · 관계 ${r.reunionForce || 0} · 감정온도 ${r.emotionTemp || 0}</p>
        </article>
      `).join('')}
    </div>
  `;
}

render();
