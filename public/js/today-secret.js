const cardEl = document.getElementById('dailySecretCard');
const dateEl = document.getElementById('secretDate');
const keywordEl = document.getElementById('secretKeyword');
const symbolEl = document.getElementById('secretSymbol');
const copyEl = document.getElementById('secretCopy');
const badgesEl = document.getElementById('secretBadges');
const saveBtn = document.getElementById('secretSaveBtn');

const ELEMENT_THEME = {
  wood: { label: '목(木)', glow: '#72f1b8', symbol: '🌿', keyword: '바람을 타는 새순의 기운' },
  fire: { label: '화(火)', glow: '#ff9e6d', symbol: '🔥', keyword: '심장을 밝히는 불꽃의 기운' },
  earth: { label: '토(土)', glow: '#f4d27a', symbol: '⛰️', keyword: '단단한 대지 위의 꽃 한 송이' },
  metal: { label: '금(金)', glow: '#dbe9ff', symbol: '🕊️', keyword: '차갑게 맑아진 결단의 칼날' },
  water: { label: '수(水)', glow: '#79c8ff', symbol: '🌊', keyword: '고요한 물결 속 선명한 직감' }
};

const DAILY_POOL = {
  wood: {
    text: '오늘은 확장운이 좋아. 새로운 제안은 오전에 가볍게 시작하고, 저녁엔 정리로 마무리해.',
    color: '에메랄드 그린', number: '3', place: '공원 산책로', food: '허브티'
  },
  fire: {
    text: '표현력이 강한 날이야. 중요한 말은 짧고 강하게, 감정 과열은 밤 전에 식혀줘.',
    color: '코랄 오렌지', number: '7', place: '햇빛 드는 창가', food: '생강차'
  },
  earth: {
    text: '기반을 쌓기 좋은 날이야. 미뤄둔 일 1개를 끝내면 전체 흐름이 안정적으로 올라가.',
    color: '골드 베이지', number: '5', place: '조용한 서점', food: '따뜻한 곡물차'
  },
  metal: {
    text: '판단력이 선명해지는 날이야. 결정을 미루지 말고 기준 2개를 정해서 바로 실행해.',
    color: '실버 화이트', number: '9', place: '미니멀한 카페', food: '배차'
  },
  water: {
    text: '직감과 회복력이 좋은 날이야. 말보다 관찰을 먼저 하고, 밤엔 깊은 휴식으로 운을 붙여.',
    color: '딥 네이비', number: '1', place: '물가 근처 산책', food: '검은콩차'
  }
};

function getReports() {
  try { return JSON.parse(localStorage.getItem('ff-total-fortune-reports') || '[]'); } catch (e) { return []; }
}

function pickElementKey() {
  const latest = getReports()[0];
  const elems = (latest?.data?.self?.pillars || []).flatMap((p) => [p?.stemElement, p?.branchElement]).filter(Boolean);
  if (elems.length) {
    const cnt = elems.reduce((a, e) => ({ ...a, [e]: (a[e] || 0) + 1 }), {});
    return Object.entries(cnt).sort((a, b) => b[1] - a[1])[0]?.[0] || 'earth';
  }
  const day = new Date().getDay();
  return ['water', 'wood', 'fire', 'earth', 'metal', 'water', 'earth'][day] || 'earth';
}

function formatDate() {
  const now = new Date();
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][now.getDay()];
  return `${now.getFullYear()}. ${String(now.getMonth() + 1).padStart(2, '0')}. ${String(now.getDate()).padStart(2, '0')} (${weekday})`;
}

function render() {
  const key = pickElementKey();
  const theme = ELEMENT_THEME[key] || ELEMENT_THEME.earth;
  const daily = DAILY_POOL[key] || DAILY_POOL.earth;

  dateEl.textContent = formatDate();
  keywordEl.textContent = theme.keyword;
  symbolEl.textContent = theme.symbol;
  copyEl.textContent = `${daily.text} 중요한 만남이나 계약은 오후 2시 이후가 특히 좋아.`;

  cardEl.style.setProperty('--daily-glow', theme.glow);

  badgesEl.innerHTML = `
    <span>🎨 행운색 · ${daily.color}</span>
    <span>🔢 행운수 · ${daily.number}</span>
    <span>📍 장소 · ${daily.place}</span>
    <span>🥘 음식 · ${daily.food}</span>
  `;
}

async function saveCardImage() {
  if (!window.html2canvas || !cardEl) {
    window.ffToast?.('이미지 저장 기능을 준비 중이야.');
    return;
  }

  const canvas = await window.html2canvas(cardEl, {
    backgroundColor: null,
    scale: Math.min(3, window.devicePixelRatio || 2),
    useCORS: true
  });

  const link = document.createElement('a');
  const date = new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  link.download = `today-secret-${stamp}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  window.ffToast?.('오늘의 비책 카드를 저장했어 ✨');
}

saveBtn?.addEventListener('click', saveCardImage);
render();
