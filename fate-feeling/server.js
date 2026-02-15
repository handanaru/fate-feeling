const express = require('express');
const path = require('path');

const app = express();
const PORT = 3200;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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
  if (!value || value.includes('모름')) return { hour: 12, minute: 0, unknownTime: true };
  const [h, m] = value.split(':').map((v) => Number(v));
  return {
    hour: Number.isFinite(h) ? h : 12,
    minute: Number.isFinite(m) ? m : 0,
    unknownTime: false
  };
}

function mapGender(gender = '') {
  const g = String(gender || '').toLowerCase();
  if (g.includes('남') || g === 'm' || g === 'male') return 'M';
  if (g.includes('여') || g === 'f' || g === 'female') return 'F';
  return 'F';
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
      stemSipsin: p?.stemSipsin,
      unseong: p?.unseong
    }))
  };
}

app.post('/api/orrery/saju', async (req, res) => {
  try {
    const { self, partner } = req.body || {};
    const selfResult = await calculateWithOrrery(self || {});
    const partnerResult = partner ? await calculateWithOrrery(partner) : null;
    res.json({
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
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Fate & Feeling running at http://localhost:${PORT}`);
});
