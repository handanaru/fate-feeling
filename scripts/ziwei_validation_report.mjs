import fs from 'node:fs';
import path from 'node:path';

const inputPath = path.resolve('public/data/ziwei-validation-cases.json');
const outPath = path.resolve('ziwei-validation-report.md');

const raw = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
const cases = raw.cases || [];

function okExpected(exp = {}) {
  return Boolean(exp.lifePalace || exp.bodyPalace || (exp.mainStars || []).length || (exp.siHwa || []).length || exp.daewoon?.startAge);
}

const done = cases.filter((c) => okExpected(c.expected)).length;

const rows = cases.map((c) => {
  const i = c.input || {};
  const e = c.expected || {};
  return `| ${c.id} | ${i.birth || '-'} ${i.birthTime || '-'} / ${i.gender || '-'} / ${i.calendar || '-'} | ${e.lifePalace || '-'} / ${e.bodyPalace || '-'} / ${(e.mainStars || []).join(',') || '-'} | ${okExpected(e) ? '입력됨' : '미입력'} | ${c.notes || '-'} |`;
}).join('\n');

const md = `# 자미두수 검증 리포트 (뼈대)

- 완료 케이스: ${done}/${cases.length}
- 기준: KST, 조자시, 윤달 15일 분할

| 케이스 | 입력 | 정답셋(명궁/신궁/주성) | 상태 | 비고 |
|---|---|---|---|---|
${rows}
`;

fs.writeFileSync(outPath, md);
console.log(`wrote ${outPath}`);
