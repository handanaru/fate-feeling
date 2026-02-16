const box = document.getElementById('ziweiValidationList');

function hasCore(data = {}) {
  return Boolean(
    data.lifePalace ||
    data.bodyPalace ||
    (data.mainStars || []).length ||
    (data.siHwa || []).length ||
    data.daewoon?.startAge
  );
}

function normalizeText(v = '') {
  return String(v || '').trim();
}

function normalizeList(arr = []) {
  return [...(arr || [])].map((v) => normalizeText(v)).filter(Boolean).sort();
}

function compareCase(c = {}) {
  const e = c.expected || {};
  const a = c.actual || {};

  const r1 = normalizeText(e.lifePalace) === normalizeText(a.lifePalace)
    && normalizeText(e.bodyPalace) === normalizeText(a.bodyPalace);

  const r2 = JSON.stringify(normalizeList(e.mainStars)) === JSON.stringify(normalizeList(a.mainStars));
  const r3 = JSON.stringify(normalizeList(e.siHwa)) === JSON.stringify(normalizeList(a.siHwa));

  const eAge = Number(e.daewoon?.startAge || 0);
  const aAge = Number(a.daewoon?.startAge || 0);
  const r4 = eAge > 0 && aAge > 0
    ? (eAge === aAge && normalizeText(e.daewoon?.direction) === normalizeText(a.daewoon?.direction))
    : false;

  const expectedReady = hasCore(e);
  const actualReady = hasCore(a);

  let status = 'PENDING';
  if (expectedReady && actualReady) {
    status = r1 && r2 && r3 && r4 ? 'OK' : 'MISMATCH';
  }

  return {
    expectedReady,
    actualReady,
    status,
    checks: {
      palace: r1,
      mainStars: r2,
      siHwa: r3,
      daewoon: r4
    }
  };
}

function checkBadge(ok) {
  return ok ? '✅' : '❌';
}

async function render() {
  if (!box) return;
  box.innerHTML = '<p class="small">케이스 로딩 중...</p>';
  try {
    const res = await fetch('/data/ziwei-validation-cases.json');
    const data = await res.json();
    const cases = data.cases || [];

    const evals = cases.map((c) => ({ c, x: compareCase(c) }));
    const expectedDone = evals.filter((r) => r.x.expectedReady).length;
    const actualDone = evals.filter((r) => r.x.actualReady).length;
    const okCount = evals.filter((r) => r.x.status === 'OK').length;
    const mismatchCount = evals.filter((r) => r.x.status === 'MISMATCH').length;

    box.innerHTML = `
      <h3>검증 케이스 현황</h3>
      <p class="small">정답셋 ${expectedDone}/${cases.length} · 엔진결과 ${actualDone}/${cases.length} · 일치 ${okCount} · 불일치 ${mismatchCount}</p>
      <div class="total-fortune-list">
        ${evals.map(({ c, x }) => {
          const badge = x.status === 'OK' ? '✅ 일치' : x.status === 'MISMATCH' ? '⚠️ 불일치' : '⏳ 대기';
          return `
            <details class="fortune-acc">
              <summary>
                <span class="txt">${c.id} · ${c.input?.birth || '-'} ${c.input?.birthTime || '-'} · ${c.input?.gender || '-'}</span>
                <span class="arr">${badge}</span>
              </summary>
              <div class="fortune-body">
                <p><strong>태그</strong> ${(c.tags || []).map((t) => `#${t}`).join(' ') || '-'}</p>
                <p><strong>메모</strong> ${c.notes || '-'}</p>
                <p><strong>체크</strong> 명궁/신궁 ${checkBadge(x.checks.palace)} · 14정성 ${checkBadge(x.checks.mainStars)} · 사화 ${checkBadge(x.checks.siHwa)} · 대운 ${checkBadge(x.checks.daewoon)}</p>
                <p class="small">정답셋: ${x.expectedReady ? '입력됨' : '미입력'} · 엔진결과: ${x.actualReady ? '입력됨' : '미입력'}</p>
              </div>
            </details>
          `;
        }).join('')}
      </div>
      <p class="small" style="margin-top:10px;">데이터 파일: <code>/public/data/ziwei-validation-cases.json</code> (expected/actual 직접 입력)</p>
    `;
  } catch (err) {
    box.innerHTML = `<p class="small">로드 실패: ${err.message || 'unknown'}</p>`;
  }
}

render();
