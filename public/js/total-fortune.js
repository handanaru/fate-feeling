const tfPillarsBox = document.getElementById('tfPillarsBox');
const tfTotalBox = document.getElementById('tfTotalBox');
const tfIntro = document.getElementById('tfIntro');

function parseBirth(birth = '2000-01-01') {
  const raw = String(birth || '').trim();
  if (/^\d{8}$/.test(raw)) return { year: Number(raw.slice(0, 4)), month: Number(raw.slice(4, 6)), day: Number(raw.slice(6, 8)) };
  const normalized = raw.replace(/\./g, '-').replace(/\//g, '-');
  const [y, m, d] = normalized.split('-').map((v) => Number(v));
  return { year: y || 2000, month: m || 1, day: d || 1 };
}

function parseTime(time = '') {
  const v = String(time || '').trim();
  if (!v || v.includes('모름')) return { hour: 12, minute: 0, unknownTime: true };
  const [h, m] = v.split(':').map((x) => Number(x));
  return { hour: Number.isFinite(h) ? h : 12, minute: Number.isFinite(m) ? m : 0, unknownTime: false };
}

function mapGender(g = '') {
  const s = String(g || '').toLowerCase();
  if (s.includes('남') || s === 'm') return 'M';
  if (s.includes('여') || s === 'f') return 'F';
  return 'F';
}

function renderPillars(data) {
  const cols = ['시', '일', '월', '년'];
  const toneMap = { wood: 'wood', fire: 'fire', earth: 'earth', metal: 'metal', water: 'water' };
  const safe = (data?.self?.pillars || []).slice(0, 4);
  const stemCells = safe.map((p, i) => `<div class="pillar-cell ${toneMap[p.stemElement] || 'earth'}"><small>${cols[i]}</small><strong>${p.stem || '-'}</strong></div>`).join('');
  const branchCells = safe.map((p, i) => `<div class="pillar-cell ${toneMap[p.branchElement] || 'earth'}"><small>${cols[i]}</small><strong>${p.branch || '-'}</strong></div>`).join('');
  tfPillarsBox.innerHTML = `<h3>💎 만세력 미리보기</h3><div class="pillars-row-label">천간</div><div class="pillars-grid">${stemCells}</div><div class="pillars-row-label">지지</div><div class="pillars-grid">${branchCells}</div>`;
}

function renderTotal(data, userName = '당신') {
  const allPillars = [...(data?.self?.pillars || [])];
  const elems = allPillars.flatMap((p) => [p.stemElement, p.branchElement]).filter(Boolean);
  const cnt = elems.reduce((acc, e) => ({ ...acc, [e]: (acc[e] || 0) + 1 }), {});
  const names = { wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)' };
  const ordered = Object.entries(cnt).sort((a, b) => b[1] - a[1]);
  const strong = names[ordered[0]?.[0] || 'earth'];
  const weak = names[ordered[ordered.length - 1]?.[0] || 'water'];

  const rows = [
    ['💗', '연애 · 관계 총운', `${strong} 기운이 강해 감정 몰입이 빠른 편. ${weak} 보완이 관건이야.`],
    ['🏠', '가정 · 기반운', `${strong} 흐름이 안정 기반을 밀어줘. 급결정보다 관찰 후 확정이 좋아.`],
    ['🧑‍🤝‍🧑', '대인 · 사회운', `사람을 모으는 힘은 좋고, 관계 피로는 ${weak} 루틴으로 줄이는 게 핵심.`],
    ['💼', '직업 · 성취운', `${strong} 구간에서 집중력이 강점. 다중 작업보다 한 축 집중이 유리해.`],
    ['💰', '재물 · 금전운', `유입운은 양호. 지출 상한 규칙 하나가 전체 운의 안정판이 돼.`],
    ['🧘', '건강 · 생활운', `${weak} 기운 보완 루틴(수면·수분·호흡)이 전체총운 체감을 끌어올려.`]
  ];

  tfTotalBox.innerHTML = `<h3>🌠 ${userName}님의 전체총운</h3><p class="small">중심 기운 <strong>${strong}</strong> · 보완 기운 <strong>${weak}</strong></p><div class="total-fortune-list">${rows.map((r, i) => `<details class="fortune-acc" ${i === 0 ? 'open' : ''}><summary><span class="icon">${r[0]}</span><span class="txt">${r[2]}</span><span class="arr">⌄</span></summary><div class="fortune-body"><strong>${r[1]}</strong><p>${r[2]}</p></div></details>`).join('')}</div>`;
}

async function run() {
  const intake = JSON.parse(localStorage.getItem('ff-intake') || '{}');
  if (!intake?.birth) {
    alert('먼저 정보 입력이 필요해. 첫 화면에서 입력하고 와줘.');
    location.href = '/';
    return;
  }

  try {
    const selfBirth = parseBirth(intake.birth);
    const selfTime = parseTime(intake.birthTime || '');
    const self = {
      year: selfBirth.year,
      month: selfBirth.month,
      day: selfBirth.day,
      hour: selfTime.hour,
      minute: selfTime.minute,
      unknownTime: selfTime.unknownTime,
      gender: mapGender(intake.gender || '기타')
    };

    const partnerBirth = parseBirth(intake.partnerBirth || intake.birth);
    const partnerTime = parseTime(intake.partnerBirthTime || '');
    const partner = {
      year: partnerBirth.year,
      month: partnerBirth.month,
      day: partnerBirth.day,
      hour: partnerTime.hour,
      minute: partnerTime.minute,
      unknownTime: partnerTime.unknownTime,
      gender: mapGender(intake.partnerGender || '기타')
    };

    const res = await fetch('/api/orrery/saju', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ self, partner, concern: intake.concern || '일반 궁합' })
    });
    const data = await res.json();
    renderPillars(data);
    renderTotal(data, intake.name || '당신');
    if (tfIntro) tfIntro.textContent = '원국을 기준으로 관계·일·재물·건강 흐름을 한눈에 정리했어.';
  } catch (e) {
    console.error(e);
    if (tfIntro) tfIntro.textContent = '원국 데이터를 불러오지 못했어. 잠시 후 다시 시도해줘.';
  }
}

run();
