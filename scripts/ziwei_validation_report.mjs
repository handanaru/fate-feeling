import fs from 'node:fs';
import path from 'node:path';

const inputPath = path.resolve('public/data/ziwei-validation-cases.json');
const outPath = path.resolve('ziwei-validation-report.md');

const raw = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
const cases = raw.cases || [];

function hasCore(data = {}) {
  return Boolean(
    data.lifePalace ||
    data.bodyPalace ||
    (data.mainStars || []).length ||
    (data.siHwa || []).length ||
    data.daewoon?.startAge
  );
}

function t(v = '') { return String(v || '').trim(); }
function list(a = []) { return [...(a || [])].map((x) => t(x)).filter(Boolean).sort(); }

function compare(c = {}) {
  const e = c.expected || {};
  const a = c.actual || {};
  const palace = t(e.lifePalace) === t(a.lifePalace) && t(e.bodyPalace) === t(a.bodyPalace);
  const mainStars = JSON.stringify(list(e.mainStars)) === JSON.stringify(list(a.mainStars));
  const siHwa = JSON.stringify(list(e.siHwa)) === JSON.stringify(list(a.siHwa));
  const eAge = Number(e.daewoon?.startAge || 0);
  const aAge = Number(a.daewoon?.startAge || 0);
  const daewoon = eAge > 0 && aAge > 0 ? (eAge === aAge && t(e.daewoon?.direction) === t(a.daewoon?.direction)) : false;

  const expectedReady = hasCore(e);
  const actualReady = hasCore(a);
  let status = 'PENDING';
  if (expectedReady && actualReady) status = palace && mainStars && siHwa && daewoon ? 'OK' : 'MISMATCH';
  return { status, palace, mainStars, siHwa, daewoon, expectedReady, actualReady };
}

const rows = cases.map((c) => {
  const i = c.input || {};
  const e = c.expected || {};
  const a = c.actual || {};
  const r = compare(c);
  return `| ${c.id} | ${i.birth || '-'} ${i.birthTime || '-'} / ${i.gender || '-'} / ${i.calendar || '-'} | ${e.lifePalace || '-'} / ${e.bodyPalace || '-'} / ${(e.mainStars || []).join(',') || '-'} | ${a.lifePalace || '-'} / ${a.bodyPalace || '-'} / ${(a.mainStars || []).join(',') || '-'} | ${r.status} | ${c.notes || '-'} |`;
}).join('\n');

const compared = cases.map(compare);
const okCount = compared.filter((x) => x.status === 'OK').length;
const mismatch = compared.filter((x) => x.status === 'MISMATCH').length;
const pending = compared.filter((x) => x.status === 'PENDING').length;

const md = `# 자미두수 검증 리포트 (뼈대)\n\n- 완료 케이스: ${okCount} OK / ${mismatch} MISMATCH / ${pending} PENDING\n- 기준: KST, 조자시(23:00), 윤달 15일 분할\n\n| 케이스 | 입력 | 정답셋(명궁/신궁/주성) | 엔진값(명궁/신궁/주성) | 결과 | 비고 |\n|---|---|---|---|---|---|\n${rows}\n`;

fs.writeFileSync(outPath, md);
console.log(`wrote ${outPath}`);
