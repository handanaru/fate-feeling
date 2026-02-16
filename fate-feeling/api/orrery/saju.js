function parseBirth(birth = '2000-01-01') {
  const raw = String(birth || '').trim();
  if (/^\d{8}$/.test(raw)) {
    return {
      year: Number(raw.slice(0, 4)),
      month: Number(raw.slice(4, 6)),
      day: Number(raw.slice(6, 8))
    };
  }
  const normalized = raw.replace(/\./g, '-').replace(/\//g, '-');
  const [y, m, d] = normalized.split('-').map((v) => Number(v));
  return {
    year: Number.isFinite(y) ? y : 2000,
    month: Number.isFinite(m) ? m : 1,
    day: Number.isFinite(d) ? d : 1
  };
}

function parseTime(time = '') {
  const value = String(time || '').trim();
  if (!value || /모름|미상|unknown|unk/i.test(value)) return { hour: 12, minute: 0, unknownTime: true };

  // 1235, 12:35, 12 형태 모두 허용
  let h = 12;
  let m = 0;
  if (/^\d{4}$/.test(value)) {
    h = Number(value.slice(0, 2));
    m = Number(value.slice(2, 4));
  } else if (/^\d{1,2}:\d{1,2}$/.test(value)) {
    const [hh, mm] = value.split(':').map((v) => Number(v));
    h = hh;
    m = mm;
  } else if (/^\d{1,2}$/.test(value)) {
    h = Number(value);
    m = 0;
  }

  if (!Number.isFinite(h) || h < 0 || h > 23) h = 12;
  if (!Number.isFinite(m) || m < 0 || m > 59) m = 0;

  return { hour: h, minute: m, unknownTime: false };
}

function mapGender(gender = '') {
  const g = String(gender || '').toLowerCase();
  if (g.includes('남') || g === 'm' || g === 'male') return 'M';
  if (g.includes('여') || g === 'f' || g === 'female') return 'F';
  return 'F';
}

function elementFromStem(stem = '') {
  const map = {
    '甲': 'wood', '乙': 'wood',
    '丙': 'fire', '丁': 'fire',
    '戊': 'earth', '己': 'earth',
    '庚': 'metal', '辛': 'metal',
    '壬': 'water', '癸': 'water'
  };
  return map[stem] || 'earth';
}

function elementFromBranch(branch = '') {
  const map = {
    '寅': 'wood', '卯': 'wood',
    '巳': 'fire', '午': 'fire',
    '辰': 'earth', '戌': 'earth', '丑': 'earth', '未': 'earth',
    '申': 'metal', '酉': 'metal',
    '亥': 'water', '子': 'water'
  };
  return map[branch] || 'earth';
}

async function calculateWithOrrery(person = {}) {
  const sajuMod = await import('@orrery/core/saju');
  const { year, month, day } = parseBirth(person.birth || person.partnerBirth || '2000-01-01');
  const { hour, minute, unknownTime } = parseTime(person.birthTime || person.partnerBirthTime || '');
  const input = {
    year,
    month,
    day,
    hour,
    minute,
    gender: mapGender(person.gender || person.partnerGender),
    unknownTime
  };
  const result = sajuMod.calculateSaju(input);
  return {
    input,
    pillars: (result.pillars || []).map((p) => ({
      ganzi: p?.pillar?.ganzi,
      stem: p?.pillar?.stem || '',
      branch: p?.pillar?.branch || '',
      stemElement: elementFromStem(p?.pillar?.stem || ''),
      branchElement: elementFromBranch(p?.pillar?.branch || ''),
      stemSipsin: p?.stemSipsin,
      unseong: p?.unseong
    }))
  };
}

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  try {
    const { self, partner } = req.body || {};
    const selfResult = await calculateWithOrrery(self || {});
    const partnerResult = partner ? await calculateWithOrrery(partner) : null;
    res.status(200).json({
      ok: true,
      engine: '@orrery/core@0.3.0',
      license: 'AGPL-3.0-only',
      sourceUrl: 'https://github.com/rath/orrery',
      self: selfResult,
      partner: partnerResult
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error?.message || 'orrery calculation failed' });
  }
};
