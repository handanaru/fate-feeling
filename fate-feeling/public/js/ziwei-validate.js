const box = document.getElementById('ziweiValidationList');

function hasExpected(exp = {}) {
  return Boolean(exp.lifePalace || exp.bodyPalace || (exp.mainStars || []).length || (exp.siHwa || []).length || exp.daewoon?.startAge);
}

async function render() {
  if (!box) return;
  box.innerHTML = '<p class="small">케이스 로딩 중...</p>';
  try {
    const res = await fetch('/data/ziwei-validation-cases.json');
    const data = await res.json();
    const cases = data.cases || [];
    const done = cases.filter((c) => hasExpected(c.expected)).length;

    box.innerHTML = `
      <h3>검증 케이스 현황</h3>
      <p class="small">완성 ${done}/${cases.length} · 정답셋 없는 상태에서도 케이스/비교 구조를 먼저 운영할 수 있어.</p>
      <div class="total-fortune-list">
        ${cases.map((c) => `
          <details class="fortune-acc">
            <summary><span class="txt">${c.id} · ${c.input.birth} ${c.input.birthTime} · ${c.input.gender}</span><span class="arr">⌄</span></summary>
            <div class="fortune-body">
              <p><strong>태그</strong> ${(c.tags || []).map((t) => `#${t}`).join(' ') || '-'}</p>
              <p><strong>메모</strong> ${c.notes || '-'}</p>
              <p><strong>정답셋 입력 상태</strong> ${hasExpected(c.expected) ? '입력됨' : '미입력'}</p>
              <p class="small">필수: 명궁/신궁/주성/사화/대운 시작나이</p>
            </div>
          </details>
        `).join('')}
      </div>
      <p class="small" style="margin-top:10px;">데이터 파일: <code>/public/data/ziwei-validation-cases.json</code></p>
    `;
  } catch (err) {
    box.innerHTML = `<p class="small">로드 실패: ${err.message || 'unknown'}</p>`;
  }
}

render();
